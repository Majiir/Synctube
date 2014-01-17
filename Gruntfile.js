module.exports = function (grunt) {

	var errors = grunt.file.readJSON('error_text.json');
	var errorPages = [];
	for (error in errors) {
		errors[error].code = error;
		errorPages.push({
			data: errors[error],
			template: 'templates/error.html',
			dest: 'error/' + error + '.html',
		});
	}

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		less: {
			dist: {
				options: {
					paths: [
						'less',
						'bower_components',
					],
					compress: true,
					cleancss: true,
					report: 'min',
				},
				files: {
					'static/style.css': 'less/main.less',
				},
			},
		},
		mustache_render: {
			dist: {
				files: errorPages,
			},
		},
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-mustache-render');

	grunt.registerTask('default', ['less', 'mustache_render']);

};
