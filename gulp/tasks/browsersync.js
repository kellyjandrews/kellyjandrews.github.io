var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	config = require('../config').browserSync;

gulp.task('browsersync', function () {
	browserSync(config);
});