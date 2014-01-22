var express = require('express');
var app = express();

var sockets = require('./lib/sockets.js');

require('./lib/sync.js');

///

var mu = require('mu2');
var rooms = require('./lib/rooms.js');

mu.root = __dirname + '/template';

function render(res, file, data) {
	mu.clearCache(__dirname + '/template/' + file);
	mu.compileAndRender(__dirname + '/template/' + file, data)
	.on('error', function (err) {
		console.log(err);
		res.end();
	})
	.pipe(res);
}

rooms.get('dev').add({ id: 'foo' });
rooms.get('test').add({ id: 'foo' });

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
	var data = {
		name: req.params.name,
		rooms: rooms.toArray().length,
	};
	res.format({
		json: function (req, res) {
			res.json(data);
		},
		html: function (req, res) {
			render(res, 'room.html', data);
		},
	});
});


///

app.use(express.static(__dirname + '/static'));

var server = app.listen(3000);
sockets.listen(server);
