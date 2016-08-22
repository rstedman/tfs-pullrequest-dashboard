var gulp = require('gulp');
var del = require('del');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

var tsProject = ts.createProject('tsconfig.json');

var paths = {
    static: ['src/**/*', '!**/*.ts'],
    tsSource: ['src/**/*.ts'],
    vendor: ['node_modules/@angular/**/*', 'node_modules/rxjs/**/*']
}

gulp.task('clean', function() {
    return del(['build']);
})

gulp.task('copy:static', ['clean'], function(){
    return gulp
        .src(paths.static)
        .pipe(gulp.dest('build'));
})

gulp.task('compile:ts', ['clean'], function () {
    var tsResult = gulp.src(paths.tsSource)
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    tsResult.dts.pipe(gulp.dest('build/'));

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("build/"));
});

gulp.task('build', ['clean', 'compile:ts', 'copy:static'])

gulp.task('watch', function() {
    gulp.watch(paths.static, ['copy']);
    gulp.watch('./src/*.ts', ['ts']);
})

gulp.task('default', ['build'])
