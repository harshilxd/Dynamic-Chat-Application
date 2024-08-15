require('dotenv').config;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dynamicChat');

var app = require('express')();

var http = require('http').Server(app);
http.listen(3000, function(){
  console.log('listening on *:3000');
})