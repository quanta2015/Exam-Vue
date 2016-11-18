//app.js
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
    var userJ = 0;

    collection.find({}).toArray(function(err, ret) {
        if (err) {
            console.error(err);
            return;
        }
        res.json(ret);
    });
});