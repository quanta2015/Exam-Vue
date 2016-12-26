var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var formidable = require('formidable');
var nodecsv = require('node-csv');
var csv = require('csv');
var path = require('path');
var fs = require('fs');
var NodePDF = require('nodepdf');
var port = normalizePort(process.env.PORT || '3000');

var hljs = require('highlightjs')

var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/exam';
var _db;

var S_OFFLINE = '0';
var S_ONLINE = '1';
var S_EXAM = '2';
var S_FINISH = '3';

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('dist'));
app.use(express.static(path.join(__dirname, '/')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('port', port);


app.all("*", function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

MongoClient.connect(mongoUrl, function(err, db) {
    if (err) {
        console.error(err);
        return;
    }

    console.log('connected to mongo');
    _db = db;
    app.listen(8888, function() {
        console.log('server is running...');
    });
});

app.get('/pdf', function(req, res, next) {
    var collection = _db.collection('resultTable');
    collection.find().toArray(function(err, ret) {
        if (err) {
          console.log(err);
        }else{
          // console.log(ret);
          res.render('exampdf', { entries: ret });
        }
      })
});


app.get('/export', function (req, res, next) {

  var host = req.protocol + '://' + req.hostname+ ':3000/pdf';
  var pdffile =  'tmp\\exam' + Date.now() + '.pdf';

  console.log(host);
  console.log(pdffile);

  NodePDF.render(host, pdffile, function(err, filePath){
    if (err) {
      console.log(err);
    }else{
      fs.readFile(pdffile , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
      });
    }
  });
})


app.get('/problemInfo', function(req, res, next) {

    var collection = _db.collection('examTable');
    collection.find({}).toArray(function(err, ret) {
        if (err) {
            console.error(err);
            return;
        }
        // console.log(ret)
        res.json(ret);
    });
});

app.get('/examInfo', function(req, res, next) {

    var collection = _db.collection('infoTable');
    collection.find({}).toArray(function(err, ret) {
        if (err) {
            console.error(err);
            return;
        }
        res.json(ret);
    });
});

app.post('/saveProblems', function(req, res, next) {

    var infos = req.body.infos;

    for(var i =0; i< infos.length; i++) {
      var conditions = {subIndex: infos[i].subIndex};
      var update = {$set : {subContent: infos[i].subContent, examid : infos[i].examid}};
      var options    = {upsert : true};
          var collection = _db.collection('examTable');
          collection.update(conditions, update, options, function(err, ret) {
              if (err) console.error(err);
          })
    }

});


app.post('/saveExamInfo', function(req, res, next) {

    var infos = req.body.infos;
    var entries={};

    var conditions = {examid: infos.examid};
    var update = {$set : {examname : infos.examname, examdate: infos.examdate, starttime: infos.starttime, endtime: infos.endtime}};
    var options    = {upsert : true};

    var collection = _db.collection('infoTable');
    collection.update(conditions, update, options, function(err, ret) {
        if (err) {
            console.log(err)
        } else {
          entries.code = 0;
          entries.msg = '保存考试信息成功';
          res.json(entries);
      }
    })
});

app.get('/userList', function(req, res, next) {

    var collection = _db.collection('userTable');
    collection.find({userid: { $ne : "admin" }}).toArray(function(err, ret) {
        if (err) {
            console.error(err);
            return;
        }
        // console.log(ret);
        res.json(ret);
    });
});

app.post('/subjectList', function(req, res, next) {
    var usr = req.body.usr;
    var username = req.body.username;
    var conditions = {userid: usr};

    console.log(conditions);

    var collection = _db.collection('resultTable');
    collection.find(conditions).toArray(function(err, ret) {
        if (err) {
            console.error(err);
        } else {
          if (ret.length !== 0) {
            //如果已经保存过 动态生成语法敏感代码
            var subs = ret[0].subs;
            for(var i=0;i<subs.length;i++) {
              subs[i].html = hljs.highlightAuto(subs[i].result).value;
            }
            
            res.json(subs);
          }else{
            //刚刚进入考场
            console.log('no')
            var collection = _db.collection('examTable');
            collection.find({"examid": "20160001"}).toArray(function(err, ret) {
              if (err) {
                console.error(err);
              }else{
                //根据模板新建考卷
                var subs = ret;
                for (var i = 0; i < subs.length; i++) {
                  subs[i].result = ''
                  subs[i].mark = '0'
                }
                // console.log(subs);
                //保存考卷到结果表
                var colResult = _db.collection('resultTable');
                colResult.update({userid: usr}, {$set : {username: username, subs : subs, score: 0}}, {upsert : true}, function(err, ret) {
                    if (err) {
                        console.log(err)
                    } else {
                      res.json(subs);
                  }
                })// end of update 保存答题结果
              }
            })// end of find 查询试卷模板
          }
        }
    })// end of find 查询答题结果
});

app.post('/startExam', function(req, res, next) {
    var usr = req.body.usr;
    var entries={};
    var collection = _db.collection('userTable');
    collection.update({userid:usr }, {$set :{ 'online' : S_EXAM}}, function(err, ret) {
      if (err) {
          console.error(err);
      }else {
        entries.code = 0;
        entries.msg = '开始考试';
        res.json(entries);
        io.emit('refresh');
      }
    });
    
});


app.post('/saveExam', function(req, res, next) {
    var usr = req.body.usr;
    var subs = req.body.subs;
    var score = req.body.score;
    var entries={};

    var conditions = {userid: usr};
    var update = {$set : {subs : subs, score: score}};
    var options    = {upsert : true};

    for(var i=0;i<subs.length;i++) {
      subs[i].html = hljs.highlightAuto(subs[i].result).value;
    }

    var collection = _db.collection('resultTable');
    collection.update(conditions, update, options, function(err, ret) {
        if (err) {
            console.log(err)
        } else {
          entries.code = 0;
          entries.msg = '保存考卷成功';
          res.json(entries);
      }
    })
});


app.post('/submitExam', function(req, res, next) {
    var usr = req.body.usr;
    var subs = req.body.subs;
    var entries={};

    var conditions = {userid: usr};
    var update = {$set : {subs : subs}};
    var options    = {upsert : true};

    var collection = _db.collection('resultTable');
    collection.update(conditions, update, options, function(err, ret) {
        if (err) {
            console.log(err)
        } else {
          setStatusMark(usr, S_FINISH);
          entries.code = 0;
          entries.msg = '提交考卷成功';
          res.json(entries);
          console.log('提交考卷成功')
          io.emit('refresh');
      }
    })
});

app.post('/uploadFile', function(req, res, next) {
  var form = new formidable.IncomingForm();
  var path = "";
  var entries = {};

  form.encoding = 'utf-8';
  form.uploadDir = "tmp";
  form.keepExtensions = true;
  form.maxFieldsSize = 30000 * 1024 * 1024;
  form.parse(req);

  form.on('field', function(field, value) {})
      .on('file', function(field, file) {
        path = '\\' + file.path;
      })
      .on('end', function() {
        console.log('-> upload done\n');
        var excelFile = __dirname  + path;
        var csvParser = nodecsv.createParser();
        csvParser.parseFile(excelFile, function(err, data) {
            if (err) { return next(err); }

            
            arr = [];
            for(var i=0;i<data.length;i++){
                arr.push({"userid":data[i][0],"pwd":data[i][0],"username":data[i][1],"class":data[i][2],"online":"0"});
            }
            var collection = _db.collection('userTable');
            collection.insertMany(arr , function(err, docs) {
              if (err) { 
                return next(err); 
              } else {
                entries.code = 0;
                res.writeHead(200, { 'content-type': 'text/json' });
                res.end(JSON.stringify(entries));
              }
            })
        });
        
      })
});

app.get('/exportExcel', function(req, res, next) {

    var collection = _db.collection('resultTable');
    collection.find({}).toArray(function(err, ret) {
        if (err) {
            console.error(err);
            return;
        }

        arr = [];
        for(var i=0;i<ret.length;i++){
            var sum =0;
            for(var j=0;j<ret[i].subs.length;j++){
                sum += parseInt(ret[i].subs[j].mark)
            }
            arr.push({"userid":ret[i].userid, "username":ret[i].username,"mark": sum});
        }
        csv.stringify(arr, function(err, data){
            var file =  'tmp\\result' + Date.now() + '.csv';
            fs.writeFile(file, data, function (err) {
                if (err) { 
                    throw err;
                    return;
                }else {
                    console.log("Export Excel Success!");
                    var entries={};
                    entries.code = 0;
                    entries.url = file
                    res.send(entries);
                }
            });
       });
    });
});

app.post('/login', function(req, res, next) {
    var usr = req.body.usr;
    var pwd = req.body.pwd;
    var entries={};

    console.log(usr + pwd);
    var collection = _db.collection('userTable');
    collection.findOne({
        userid: usr, pwd: pwd
    }, function(err, ret) {
        if (err) {
            console.log(err)
        } else if(ret === null){
          entries.code = 99;
          entries.msg = '密码错误！';
          console.log(entries)
          res.json(entries);
        } else {
          console.log('online mark is ' + ret.online);
          if (ret.online !== '3') {
            setStatusMark(usr, S_ONLINE);
          }
          entries.code = 0;
          entries.msg = '登录成功！';
          entries.data = ret;
          res.json(entries);
      }
    })
});

var http = require('http');
var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

var io = require('socket.io').listen(server);

io.on('connection', function(socket) {
  var usr;
  var online;

  socket.on('login', function(uid, status) {
    usr = uid;
    online = status;
    io.emit('refresh');
    console.log(uid + ' login the exam ... ');
  });

   socket.on('disconnect', function() {

    var collection = _db.collection('userTable');
    collection.findOne({userid:usr }, function(err, ret) {
      if (err) {
          console.error(err);
      }else{
         if (ret !== null) {
            if (ret.online !== '3') {
              setStatusMark(usr, S_OFFLINE);
            }
           io.emit('refresh');
          console.log(' offline...');
        }
      }
    });
  });

});

function getStatusMark(usr) {
  var collection = _db.collection('userTable');
    collection.find({userid:usr }, function(err, ret) {
      if (err) {
          console.error(err);
      }else{
         return ret.online;
      }
    });
}


function setStatusMark(usr, mark) {
  var collection = _db.collection('userTable');
    collection.update({userid:usr }, {$set :{ 'online' : mark}}, function(err, ret) {
      if (err) {
          console.error(err);
      }
    });
}





function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
   console.log('Listening on ' + bind);
}

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}