var browserify = require('browserify'),
	gulp = require('gulp'),
	hbsfy = require('hbsfy'),
	source = require('vinyl-source-stream'),
	plumber = require('gulp-plumber'),
	config = require('../config').scripts;

gulp.task('browserify', function () {
	return browserify(config.src)
		.transform(hbsfy)
		.bundle()
		.pipe(plumber())
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.dest));
});
