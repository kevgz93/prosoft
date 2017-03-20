var gulp = require('gulp');
var webserver = require('gulp-webserver');
var serverFactory = require('spa-server');
var less = require('gulp-less');
var path = require('path');
var runSequence = require('run-sequence');

gulp.task('less', function () {
  return gulp.src('_style/*.less')
    .pipe(less())
    .pipe(gulp.dest('css'));
});

gulp.task('webserver', function () {
  var server = serverFactory.create({
    path: './',
    port: 8888,
    fallback: 'index.html'
  });

  server.start();
});

gulp.task('default',function(){
  runSequence(
    'less','webserver'
  );
});
