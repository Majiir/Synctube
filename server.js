var express = require('express');
var app = express();
var mu = require('mu2');

var sockets = require('./server/sockets.js');
var rooms = require('./lib/rooms.js');

require('./server/sync.js');

mu.root = __dirname + '/template';

function render(res, file, data) {
	if (app.settings.env === 'development') {
		mu.clearCache(file);
	}
	mu.compileAndRender(file, data).pipe(res);
}

app.get('/rooms', function (req, res) {
	var data = {
		rooms: rooms.toArray().map(function (room) {
			return {
				name: room.name,
				connected: Object.keys(room.connected).length,
			};
		}),
	};
	res.format({
		json: function (req, res) {
			res.json(data);
		},
		html: function (req, res) {
			render(res, 'rooms.html', data);
		},
	});
});

app.get('/rooms/:name', function (req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
	var room = rooms.get(req.params.name);
	render(res, 'room.html', {
		name: room.name,
		connected: Object.keys(room.connected).length,
	});
});

app.use(express.static(__dirname + '/static'));

var server = app.listen(3000);
sockets.listen(server);
