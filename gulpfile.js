const fs = require('fs');
const del = require('del');
const gulp = require('gulp');
const streamqueue = require('streamqueue');
const karma = require('karma').server;
const $ = require('gulp-load-plugins')();

const config = {
  pkg: JSON.parse(fs.readFileSync('./package.json')),
  banner:
    '/*!\n' +
    ' * <%= pkg.name %>\n' +
    ' * <%= pkg.homepage %>\n' +
    ' * Version: <%= pkg.version %> - <%= timestamp %>\n' +
    ' * License: <%= pkg.license %>\n' +
    ' */\n\n\n'
};

gulp.task('default', ['build', 'test']);
gulp.task('build', ['scripts', 'styles']);
gulp.task('test', ['build', 'karma']);

gulp.task('watch', ['build', 'karma-watch'], function() {
  gulp.watch(['src/**/*.{js,html}'], ['build']);
});

gulp.task('clean', function(cb) {
  del(['dist', 'temp'], cb);
});

gulp.task('scripts', ['clean'], function() {
  const buildTemplates = function() {
    return gulp
      .src('src/**/*.html')
      .pipe(
        $.minifyHtml({
          empty: true,
          spare: true,
          quotes: true
        })
      )
      .pipe($.angularTemplatecache({ module: 'ui.select' }));
  };

  const buildLib = function() {
    return gulp
      .src(['src/common.js', 'src/*.js'])
      .pipe(
        $.plumber({
          errorHandler: handleError
        })
      )
      .pipe($.concat('select_without_templates.js'))
      .pipe($.header('(function () { \n"use strict";\n'))
      .pipe($.footer('\n}());'))
      .pipe(gulp.dest('temp'))
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'))
      .pipe($.jshint.reporter('fail'));
  };

  return streamqueue({ objectMode: true }, buildLib(), buildTemplates())
    .pipe(
      $.plumber({
        errorHandler: handleError
      })
    )
    .pipe($.concat('select.js'))
    .pipe(
      $.header(config.banner, {
        timestamp: new Date().toISOString(),
        pkg: config.pkg
      })
    )
    .pipe(gulp.dest('dist'))
    .pipe($.sourcemaps.init())
    .pipe($.uglify({ preserveComments: 'some' }))
    .pipe($.concat('select.min.js'))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', ['clean'], function() {
  return gulp
    .src(['src/common.css'], { base: 'src' })
    .pipe($.sourcemaps.init())
    .pipe(
      $.header(config.banner, {
        timestamp: new Date().toISOString(),
        pkg: config.pkg
      })
    )
    .pipe($.concat('select.css'))
    .pipe(gulp.dest('dist'))
    .pipe($.minifyCss())
    .pipe($.concat('select.min.css'))
    .pipe($.sourcemaps.write('../dist', { debug: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('karma', ['build'], function() {
  karma.start({ configFile: __dirname + '/karma.conf.js', singleRun: true });
});

gulp.task('karma-watch', ['build'], function() {
  karma.start({ configFile: __dirname + '/karma.conf.js', singleRun: false });
});

const handleError = function(err) {
  console.log(err.toString());
  this.emit('end');
};
