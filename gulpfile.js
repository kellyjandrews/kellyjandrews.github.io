var gulp = require('gulp');
var flatten = require('gulp-flatten');

gulp.task("flatten", function(){
	gulp.src(['bower_components/foundation/**/*.js','bower_components/jquery/distjs'])
  		.pipe(flatten())
  		.pipe(gulp.dest('vendor/js'));

	gulp.src('bower_components/**/*.css')
  	  	.pipe(flatten())
  		.pipe(gulp.dest('vendor/css'));
});



gulp.task('default', ['flatten']);