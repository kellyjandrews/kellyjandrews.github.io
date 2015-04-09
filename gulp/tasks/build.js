var gulp = require('gulp'),
	shell = require('gulp-shell');

gulp.task('build', ['browserify'], shell.task(['jekyll build -q --drafts --config _config-dev.yml']));
