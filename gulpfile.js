const gulp = require('gulp');
const watch = require('gulp-watch');
const compressor = require('node-minify');
const uglify = require('gulp-uglifyjs');

gulp.task('watch', function () {
    gulp.watch('public/js/*.js');
});

gulp.task('default', ['watch']

    // compressor.minify({
    //     compressor: 'gcc',
    //     input: 'public/js/*.js',
    //     output: 'public/build/app.min.js',
    //     callback: function (err, min) {
    //
    //         gulp.src('public/build/app.min.js')
    //             .pipe(uglify())
    //             .pipe(gulp.dest('public/dist/'))
    //
    //     }
    // });

);

gulp.task('minify', function() {

    return compressor.minify({
        compressor: 'gcc',
        input: 'public/js/*.js',
        output: 'public/build/app.min.js',
        callback: function (err, min) {}
    });
});

gulp.task('uglify', function() {
    return gulp.src('public/build/app.min.js')
        .pipe(uglify())
        .pipe(gulp.dest('public/dist/'))
});

gulp.task('watch', function() {
    gulp.watch('public/js/*.js', ['minify', 'uglify']);
});