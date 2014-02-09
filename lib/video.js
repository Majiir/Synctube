/**
 * Module exports.
 */

module.exports = exports = Video;

/**
 * YouTube ID validation.
 * See: http://markmail.org/message/jb6nsveqs7hya5la#query:+page:1+mid:jb6nsveqs7hya5la+state:results
 */

Video.validId = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Identifies a single video.
 */

function Video (id, length) {
	if (!Video.validId.test(id)) {
		throw new Error('Invalid video ID');
	}
	this.id = id;
	this.length = length;
}

/**
 * Whether this instance has been augmented with length metadata.
 */

Video.prototype.hasLength = function () {
	return this.hasOwnProperty('length');
};
