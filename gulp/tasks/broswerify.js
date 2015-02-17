var browserify = require('browserify'),
	gulp = require('gulp'),
	source = require('vinyl-source-stream'),
	plumber = require('gulp-plumber'),
	config = require('../config').scripts;

gulp.task('browserify', function () {
	return browserify(config.src)
		.bundle()
		.pipe(plumber())
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.dest));
});