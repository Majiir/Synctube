var express = require('express');
var app = express();

var sockets = require('./sockets.js');

require('./sync.js');

app.use(express.static(__dirname + '/static'));

var server = app.listen(3000);
sockets.listen(server);
