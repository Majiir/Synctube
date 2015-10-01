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

	vjs = videojs('player', {
		techOrder: ['youtube'],
		sources: [
			{
				type: 'video/youtube',
				src: 'https://www.youtube.com/watch?v=qEYOyZVWlzs',
			},
		],
	});


	vjs.ready(function () {

		player.emit('ready');

		vjs.on('pause', change);
		vjs.on('play', change);
		vjs.on('seeked', change);

		function change () {
			player.emit('change');
		}

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
		//youtube.loadVideoById(video.id, time);
	},
	getVideo: function () {
		//var data = youtube.getVideoData();
		//return data ? data.video_id : null;
	},
	getTime: function () {
		//return youtube.getCurrentTime();
	},
	isPlaying: function () {
		//return youtube.getPlayerState() === YT.PlayerState.PLAYING;
	},
	isEnded: function () {
		//return youtube.getPlayerState() === YT.PlayerState.ENDED;
	},
};

/**
 * Extend EventEmitter.
 */

player.__proto__ = events.EventEmitter.prototype;
events.EventEmitter.call(player);
