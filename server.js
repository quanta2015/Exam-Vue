var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

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
    var conditions = {userid: usr};

    console.log(conditions);

    var collection = _db.collection('resultTable');
    collection.find(conditions).toArray(function(err, ret) {
        if (err) {
            console.error(err);
        } else {
          if (ret.length !== 0) {
            //如果已经保存过
            res.json(ret[0].subs);
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
                }
                // console.log(subs);
                //保存考卷到结果表
                var colResult = _db.collection('resultTable');
                colResult.update({userid: usr}, {$set : {subs : subs}}, {upsert : true}, function(err, ret) {
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

// app.get('/subjectList', function(req, res, next) {
//     var collection = _db.collection('examTable');
//     collection.find({"examid": "20160001"}).toArray(function(err, ret) {
//         if (err) {
//             console.error(err);
//             return;
//         }
//         console.log(ret);
//         res.json(ret);
//     });
// });

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
    var entries={};

    var conditions = {userid: usr};
    var update = {$set : {subs : subs}};
    var options    = {upsert : true};

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
          //上线后更新状态
          // var collection = _db.collection('userTable');
          // collection.update({userid:usr }, {$set :{ 'online' : '1'}}, function(err, ret) {
          //   if (err) {
          //       console.error(err);
          //       return;
          //   }
          // });
          setStatusMark(usr, S_ONLINE);
          entries.code = 0;
          entries.msg = '登录成功！';
          entries.data = ret;
          res.json(entries);
      }
    })
});

var http = require('http');
var server = http.createServer(app);
server.listen(3000);
server.on('error', onError);
server.on('listening', onListening);

var io = require('socket.io').listen(server);

io.on('connection', function(socket) {
  var usr;

  socket.on('login', function(uid) {
    usr = uid;
    io.emit('refresh');
    console.log(uid + ' login the exam ... ');
  });

   socket.on('disconnect', function() {
      setStatusMark(usr, S_OFFLINE);
      io.emit('refresh');
      console.log(' offline...');
  });

});


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