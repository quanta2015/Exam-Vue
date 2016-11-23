var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/exam';
var _db;

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

app.get('/userList', function(req, res, next) {

    var collection = _db.collection('userTable');
    collection.find({}).toArray(function(err, ret) {
        if (err) {
            console.error(err);
            return;
        }
        res.json(ret);
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

  socket.on('msg', function(msg) {
    console.log(' send msg ... ' + msg);
    io.emit('msg', 'reveive');
  });

  socket.on('login', function(uid) {
    console.log(uid + ' login the exam ... ');
    io.emit('login', uid);
  });

  //正常下线
  socket.on('leave', function() {
    socket.emit('disconnect');
  });

});



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