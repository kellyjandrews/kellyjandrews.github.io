var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	config = require('../config.js').fonts;

gulp.task('fonts', function () {
	gulp.src(config.src)
		.pipe(plumber())
		.pipe(gulp.dest(config.dest));
});