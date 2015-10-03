/**
 * Module dependencies.
 */

var pjson = require('../package');
var request = require('request');
var url = require('url');

if (global.videojs) {
	require('videojs-dailymotion');
}

/**
 * DailyMotion media plugin constructor.
 */

function DailyMotion (opts) {
	this._opts = {};
	this._opts.batchDelay = opts.batchDelay || 50;
	this._opts.batchLimit = opts.batchLimit || 10;

	var self = this;

	/**
	 * Gets the length (in seconds) of a video by its ID.
	 */

	this.getLength = _timeBatch(this._opts.batchDelay, this._opts.batchLimit, function (reqs) {
		var ids = _groupCalls(reqs);
		self._listVideos(ids, ['duration'], function (item) {
			return item.duration;
		});
	});

	/**
	 * Gets display details of a video by its ID.
	 */

	this.getDetails = _timeBatch(this._opts.batchDelay, this._opts.batchLimit, function (reqs) {
		var ids = _groupCalls(reqs);
		self._listVideos(ids, ['title', 'thumbnail_60_url'], function (item) {
			return {
				title: item.title,
				thumbnail: item.thumbnail_60_url,
			};
		});
	});
}

module.exports = exports = DailyMotion;

/**
 * Videojs technology name to play this media.
 */

DailyMotion.prototype.technologyName = 'dailymotion';

/**
 * Produces a Videojs source object for the given ID.
 */

DailyMotion.prototype.formatSource = function formatSource (id) {
	return { type: 'video/dailymotion', src: 'https://www.dailymotion.com/video/' + id };
};

/**
 * Gets the ID from a DailyMotion URL, or null if the URL is not valid.
 */

DailyMotion.prototype.parseUrl = function parseUrl (str) {
	var parsed = url.parse(str, true);
	if (parsed.hostname == 'www.dailymotion.com' || parsed.hostname == 'dailymotion.com') {
		var matches = parsed.pathname.match(/^\/video\/([a-zA-Z0-9]+)_/i);
		if (matches) {
			return matches[1];
		}
	}
	return null;
};

/**
 * DailyMotion ID validation.
 * (I'm really just guessing here.)
 */

var validId = /^[a-zA-Z0-9]+$/;

/**
 * Multi-video videos/list query.
 */

DailyMotion.prototype._listVideos = function _listVideos (ids, fields, selector) {
	var reqs = [];
	Object.keys(ids).forEach(function (id) {
		if (!validId.test(id)) {
			var cb = ids[id];
			process.nextTick(function () {
				cb('Invalid video ID');
			});
			delete ids[id];
		} else {
			reqs.push(id);
		}
	});

	request({
		uri: 'https://api.dailymotion.com/videos',
		qs: {
			fields: ['id'].concat(fields).join(','),
			ids: reqs.join(','),
		},
		json: true,
	}, function (err, res, body) {
		err = err || body.error;
		if (err) {
			Object.keys(ids).forEach(function (id) {
				var cb = ids[id];
				cb(err);
			});
			return;
		}

		body.list.forEach(function (item) {
			var cb = ids[item.id];
			if (cb) {
				delete ids[item.id];
				cb(null, selector(item));
			}
		});

		for (id in ids) {
			var cb = id[ids];
			cb('Invalid video ID');
		}
	});
}

/**
 * Utilities for batching requests.
 */

function _timeBatch (delay, max, func) {
	var batch = [];
	var timer = null;
	return function () {
		var args = [];
		for (var i = 0; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
		batch.push(args);
		if (batch.length == max) {
			var _batch = batch;
			batch = [];
			process.nextTick(function () {
				func(_batch);
			});
			return;
		}
		if (!timer) {
			timer = setTimeout(function () {
				var _batch = batch;
				batch = [];
				timer = null;
				if (_batch.length == 0) { return; }
				func(_batch);
			}, delay);
		}
	};
}

function _groupCalls (reqs) {
	var ids = {};
	reqs.forEach(function (req) {
		var id = req[0];
		var cb = req[1];
		var prev = ids[id];
		if (prev) {
			ids[id] = function (err, res) {
				prev(err, res);
				cb(err, res);
			};
		} else {
			ids[id] = cb;
		}		
	});
	return ids;
}
