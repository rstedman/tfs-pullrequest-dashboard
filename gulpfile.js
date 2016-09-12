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
    static: ['src/**/*', '!**/*.ts', '!**/*.js'],
    tsSource: ['src/**/*.ts', 'typings/index.d.ts'],
    systemjs_vendor: ['node_modules/@angular/**/*.umd.js', 'node_modules/rxjs/**/*', '!**/*.ts'],
    vendor_js: ['node_modules/zone.js/dist/zone.js','node_modules/reflect-metadata/Reflect.js', 'node_modules/systemjs/dist/system.src.js', 'node_modules/es6-shim/es6-shim.js'],
    vendor_css: ['node_modules/bootstrap/dist/**/*', 'node_modules/font-awesome/**/*'],
    compileFolder: 'build/compile',
    buildOut: 'build/target'
}

gulp.task('clean', function() {
    return del(['build']);
});

gulp.task('copy:static', function(){
    return gulp
        .src(paths.static)
        .pipe(gulp.dest(paths.buildOut));
});

gulp.task('copy:systemjs_modules', function() {
    return gulp.src(paths.systemjs_vendor, {base: './node_modules'})
        .pipe(gulp.dest(paths.compileFolder + '/vendor/'));
});

gulp.task('copy:systemjs_config', function() {
    return gulp.src(['src/systemjs.config.js'])
        .pipe(gulp.dest(paths.compileFolder));
})

gulp.task('copy:bootstrap', function() {
    return gulp.src(['node_modules/bootstrap/dist/css/*.css', 'node_modules/bootstrap/dist/fonts/*'], {base: './node_modules/bootstrap/dist'})
        .pipe(gulp.dest(paths.buildOut + '/vendor/bootstrap'));
})

gulp.task('copy:fa', function() {
    return gulp.src(['node_modules/font-awesome/css/*.css', 'node_modules/font-awesome/fonts/*'], {base: './node_modules'})
        .pipe(gulp.dest(paths.buildOut + '/vendor'));
})

gulp.task('copy:vendor_css', ['copy:bootstrap', 'copy:fa']);

gulp.task('compile:ts', function () {
    var tsResult = gulp.src(paths.tsSource)
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    tsResult.dts.pipe(gulp.dest(paths.compileFolder));

    return tsResult.js
        .pipe(sourcemaps.write('.', { sourceRoot: './' }))
        .pipe(gulp.dest(paths.compileFolder));
});

gulp.task('bundle:app', function() {
    var builder = new systemjsBuilder(paths.compileFolder, paths.compileFolder + '/systemjs.config.js');
    return builder.buildStatic('app/app.js', paths.buildOut + '/app/app.bundle.js', { sourceMaps:true });
});

gulp.task('bundle:vendor', function() {
    return gulp.src(paths.vendor_js)
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.bundle.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.buildOut + '/vendor'));
});

gulp.task('build', function(callback) {
    runSequence('clean', ['copy:static', 'copy:systemjs_config', 'copy:vendor_css', 'copy:systemjs_modules', 'bundle:vendor', 'compile:ts'], 'bundle:app', callback);
});

gulp.task('watch', function() {
    gulp.watch(paths.buildFiles, ['build']);
    gulp.watch(paths.static, ['copy:static']);
    gulp.watch(paths.tsSource, ['compile:ts']);
});

gulp.task('serve', function() {
    connect.server({
        root: 'build/target'
    });
});

gulp.task('default', ['build']);
