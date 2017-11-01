'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    eslint = require('gulp-eslint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

var jsSources = ['app/js/*.js'],
    cssSources = ['app/css/*.css'],
    sassSources = ['app/styles/*.scss'],
    htmlSources = ['**/*.html'];

var tmpDir = '.tmp';


gulp.task('log', function() {
    gutil.log('== My First Task ==')
});

gulp.task('eslint', function() {
    return gulp.src(['completed/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('copy', function() {
    gulp.src('index.html')
    .pipe(gulp.dest(tmpDir))
});

gulp.task('sass', function() {
    gulp.src(sassSources)
    .pipe(sass({style: 'expanded'}))
    .on('error', gutil.log)
    .pipe(gulp.dest('assets'))
    .pipe(connect.reload())
});

gulp.task('js', function() {
    gulp.src(jsSources)
    // .pipe(uglify())
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest(tmpDir))
    .pipe(connect.reload())
});

gulp.task('watch', function() {
    gulp.watch(jsSources, ['js']);
    gulp.watch(cssSources, ['css']);
    gulp.watch(sassSources, ['sass']);
    gulp.watch(htmlSources, ['html']);
});

gulp.task('connect', function() {
    connect.server({
        root: 'app',
        livereload: true
    })
});

gulp.task('html', function() {
    gulp.src(htmlSources)
    .pipe(connect.reload())
});

gulp.task('default', ['html', 'js', 'sass', 'connect', 'watch'], function() {
    gutil.log('== Build Completed ==');
});
