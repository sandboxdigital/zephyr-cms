
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Configuration - you can change these settings

// Destination - where all the files are save after processing. Defaults to /public/assets but you can change to
// something like public/wp-content/themes/THEME_NAME/assets for a Wordpress project

var dest        = "frontend/";
var destCss     = dest+"css/";
var destJs      = dest+"js/";

var src         = "frontent-src/";
var srcScss     = src+"scss/";
var srcJs       = src+"js/";

var watchPaths  = [
    dest+'/**'
];

var destJsFile = 'cms1.js';

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
    wrap = require('gulp-wrap'),
    notify = require('gulp-notify');

//gulp.task('default', function() {
//    //bootstrap ();
//});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// CSS / SCSS

gulp.task('styles', function() {
    return gulp.src(srcScss+'*.scss')
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest(destCss))
        .pipe(notify({ message: 'Styles task complete' }));
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Javascript

gulp.task('scripts', function() {
    // var stream = streamqueue({ objectMode: true });
    // stream.queue(gulp.src('vendor/*.js'));
    // stream.queue(gulp.src([
    //     srcJs+'vendor/*.js',
    //     srcJs+'wrap.start.js',
    //     srcJs+'cms.js',
    //     srcJs+'cms.form.js',
    //     srcJs+'cms.form.field.js',
    //     srcJs+'**/*.js',
    //     srcJs+'wrap.end.js'
    // ]).pipe(wrap({ src: srcJs+'templates/nodep.js'})));
    //
    // return stream.done()
    //     .pipe(concat('result.txt'))
    //     .pipe(gulp.dest('build'));



    return gulp.src([
            srcJs+'vendor/*.js',
            srcJs+'cms/cms.js',
            srcJs+'cms/cms.form.js',
            srcJs+'cms/cms.form.field.js',
            srcJs+'cms/*.js'
        ])
        //.pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat(destJsFile))
        .pipe(wrap({ src: srcJs+'templates/wrap.js'}))
        .pipe(gulp.dest(destJs))
        .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('scripts:prod', function() {
    return gulp.src(srcJs+'**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(destJs))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(destJs))
        .pipe(notify({ message: 'Scripts & Minify task complete' }));
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Watch

gulp.task('watch', function() {
    console.log ('Watching: '+srcScss+'*.scss');
    gulp.watch(srcScss+'/**/*.scss', ['styles']);

    // Watch .js files
    console.log ('Watching: '+srcJs+'**/*.js');
    gulp.watch(srcJs+'**/*.js', ['scripts']);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(watchPaths).on('change', livereload.changed);
});

gulp.task('dev', ['watch']);
gulp.task('prod', ['styles:prod','scripts:prod']);
gulp.task('default', ['styles','scripts']);