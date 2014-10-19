'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    inject = require('gulp-inject'),
    plumber = require('gulp-plumber'),
    angularFilesort = require('gulp-angular-filesort'),
    templateCache = require('gulp-angular-templatecache'),
    connect = require('gulp-connect');

var outputDir = 'dist',
    publicDir = 'public',
    viewsDir = 'views',
    assetsDir = 'public/assets',
    stylesDir = 'stylesheets',
    rootDir = 'angular-app';


gulp.task('connect', function () {
  connect.server({
    root: [outputDir, publicDir, rootDir],
    port: 3000,
  });
});


gulp.task('templates', function () {
  return gulp.src(rootDir + '/**/*.html')
    .pipe(templateCache({
      standalone: true,
    }))
    .pipe(gulp.dest(rootDir));
});


gulp.task('css-compile', function () {
  return gulp.src([stylesDir + '/application.scss'])
    .pipe(sass({
      sourceMap: 'scss',
      sourceComment: 'map',
      includePaths: ['bower_components'],
      outputStyle: 'compressed',
    }))
    .pipe(gulp.dest(outputDir));
});


gulp.task('js-jshint', function () {
  return gulp.src(rootDir + '/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


gulp.task('js-inject', ['templates'], function () {
  return gulp.src([viewsDir + '/**/*.html'])
    .pipe(inject(gulp.src('**/*.js', { cwd: rootDir })
      .pipe(plumber())
      .pipe(angularFilesort()), {
        starttag: '<!-- inject:js -->',
        endtag: '<!-- endinject -->',
      }))
    .pipe(gulp.dest(outputDir));
});


gulp.task('watch', function () {
  gulp.watch([stylesDir + '/**/*.scss'], ['css-compile']);
  gulp.watch([rootDir + '/**/*.html', viewsDir + '/**/*.html'], ['js-inject']);
  gulp.watch([rootDir + '/**/*.js'], ['js-jshint', 'js-inject']);
});


gulp.task('prepare', function () {
  return gulp.start('js-inject', 'css-compile');
});


gulp.task('default', ['prepare'], function () {
  return gulp.start('watch', 'connect');
});
