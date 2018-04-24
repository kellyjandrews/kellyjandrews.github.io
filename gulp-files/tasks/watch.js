var gulp = require('gulp'),
	config = require('../config'),

gulp.task('watch', function () {
	gulp.watch(config.less.watch, ['less']);
	gulp.watch([config.scripts.src,config.templates.src], ['browserify']);
});
