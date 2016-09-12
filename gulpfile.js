var gulp = require('gulp');
var del = require('del');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var connect = require('gulp-connect');
var systemjsBuilder = require('systemjs-builder');
var concat = require('gulp-concat');

var tsProject = ts.createProject('tsconfig.json');

var paths = {
    buildFiles: ['gulpfile.js', 'package.json', 'typings.json', 'tsconfig.json'],
    static: ['src/**/*', '!**/*.ts'],
    tsSource: ['src/**/*.ts', 'typings/index.d.ts', "node_modules/angular-2-dropdown-multiselect/src/multiselect-dropdown.ts"],
    systemjs_vendor: ['node_modules/@angular/**/*', 'node_modules/rxjs/**/*'],
    vendor_js: ['node_modules/zone.js/dist/zone.js','node_modules/reflect-metadata/Reflect.js', 'node_modules/systemjs/dist/system.src.js', 'node_modules/es6-shim/es6-shim.js'],
    vendor_css: ['node_modules/bootstrap/dist/**/*', 'node_modules/font-awesome/**/*']
}

gulp.task('clean', function() {
    return del(['build']);
});

gulp.task('copy:static', function(){
    return gulp
        .src(paths.static)
        .pipe(gulp.dest('build'));
});

gulp.task('copy:systemjs_modules', function() {
    return gulp.src(paths.systemjs_vendor, {base: './node_modules'})
        .pipe(gulp.dest('build/vendor/'));
});

gulp.task('copy:bootstrap', function() {
    return gulp.src(['node_modules/bootstrap/dist/css/*.css', 'node_modules/bootstrap/dist/fonts/*'], {base: './node_modules/bootstrap/dist'})
        .pipe(gulp.dest('build/vendor/bootstrap'));
})

gulp.task('copy:fa', function() {
    return gulp.src(['node_modules/font-awesome/css/*.css', 'node_modules/font-awesome/fonts/*'], {base: './node_modules'})
        .pipe(gulp.dest('build/vendor'));
})

gulp.task('copy:vendor_css', ['copy:bootstrap', 'copy:fa']);

gulp.task('compile:ts', function () {
    var tsResult = gulp.src(paths.tsSource)
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    tsResult.dts.pipe(gulp.dest('build/'));

    return tsResult.js
        .pipe(sourcemaps.write('.', { sourceRoot: './' }))
        .pipe(gulp.dest("build/"));
});

gulp.task('bundle:app', function() {
    var builder = new systemjsBuilder('./build', './build/systemjs.config.js');
    return builder.buildStatic('app/app.js', 'build/app/app.bundle.js', { sourceMaps:true });
});

gulp.task('bundle:vendor', function() {
    return gulp.src(paths.vendor_js)
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.bundle.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/vendor'));
});

gulp.task('build', function(callback) {
    runSequence('clean', ['copy:static', 'copy:vendor_css', 'copy:systemjs_modules', 'bundle:vendor', 'compile:ts'], 'bundle:app', callback);
});

gulp.task('watch', function() {
    gulp.watch(paths.buildFiles, ['build']);
    gulp.watch(paths.static, ['copy:static']);
    gulp.watch(paths.tsSource, ['compile:ts']);
});

gulp.task('serve', function() {
    connect.server({
        root: 'build'
    });
});

gulp.task('default', ['build']);
