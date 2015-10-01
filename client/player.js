/**
 * Module dependencies.
 */

var events = require('events');
var videojs = require('videojs');
var $ = require('jquery');

require('videojs-youtube');

/**
 * Videojs player.
 */

var vjs;

$(function () {

	videojs('player', {
		techOrder: ['html5', 'youtube'],
	}).ready(function () {

		vjs = this;

		vjs.on('pause', change);
		vjs.on('play', change);
		vjs.on('seeked', change);

		function change () {
			player.emit('change');
		}

		player.emit('ready');

	});

/**
 * TODO:
 *
 * Player reacts to sync module events--and that's it.
 * Player does not export anything.
 * Sync-to-player logic all happens in this module.
 * Syncing logic might be simplified if we can remove controls--that way we only
 *   have to worry about buffering and clock drift stuff.
 * Investigative items:
 *   - How the heck do we query and control this player? The API isn't too well documented.
 *   - How do we switch between videos? Can we queue them up and 'preload' videos?
 *   - How do we get YouTube support back? Does that plugin still work?
 */

});

/**
 * Player module interface.
 */

var _current = null;

var player = module.exports = exports = {
	play: function () {
		vjs.play();
	},
	pause: function () {
		vjs.pause();
	},
	seek: function (time) {
		vjs.currentTime(time + (this.isPlaying() ? 0.5 : 0));
	},
	load: function (video, time) {
		_current = video.id;
		vjs.src({ type: 'video/youtube', src: 'https://www.youtube.com/watch?v=' + video.id });
	},
	getVideo: function () {
		return _current;
	},
	getTime: function () {
		return vjs.currentTime();
	},
	isPlaying: function () {
		return !vjs.paused();
	},
	isEnded: function () {
		return vjs.ended();
	},
};

/**
 * Extend EventEmitter.
 */

player.__proto__ = events.EventEmitter.prototype;
events.EventEmitter.call(player);
