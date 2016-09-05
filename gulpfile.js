var gulp = require('gulp');
var del = require('del');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var connect = require('gulp-connect');

var tsProject = ts.createProject('tsconfig.json');

var paths = {
    static: ['src/**/*', '!**/*.ts'],
    tsSource: ['src/**/*.ts', 'typings/index.d.ts'],
    vendor: ['node_modules/@angular/**/*', 'node_modules/rxjs/**/*']
}

gulp.task('clean', function() {
    return del(['build']);
})

gulp.task('copy:static', function(){
    return gulp
        .src(paths.static)
        .pipe(gulp.dest('build'));
})

gulp.task('compile:ts', function () {
    var tsResult = gulp.src(paths.tsSource)
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    tsResult.dts.pipe(gulp.dest('build/'));

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("build/"));
});

gulp.task('build', function(callback) {
    runSequence('clean', ['copy:static', 'compile:ts'], callback);
})

gulp.task('watch', function() {
    gulp.watch(paths.static, ['copy:static']);
    gulp.watch(paths.tsSource, ['compile:ts']);
});

gulp.task('serve', function() {
    connect.server({
        livereload:true
    });
})

gulp.task('default', ['build'])
