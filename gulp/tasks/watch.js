var gulp = require('gulp'),
	config = require('../config'),
	browserSync = require('browser-sync');

gulp.task('watch', ['build', 'browsersync'], function () {
	gulp.watch(config.less.watch, ['less', 'build', browserSync.reload]);
	gulp.watch(config.images.src, ['build', browserSync.reload]);
	gulp.watch([config.scripts.src,config.templates.src], ['browserify', 'build', browserSync.reload]);
	gulp.watch([config.jekyll.data, config.jekyll.includes, config.jekyll.layouts, config.jekyll.pages, config.jekyll.posts, config.jekyll.drafts], ['build', browserSync.reload]);
});
