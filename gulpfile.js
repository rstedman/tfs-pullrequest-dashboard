var gulp = require('gulp');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var connect = require('gulp-connect');
var systemjsBuilder = require('systemjs-builder');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var run = require('gulp-run');
var embedTemplates = require('gulp-angular2-embed-templates');

var paths = {
    buildFiles: ['./gulpfile.js', './package.json', './typings.json', './tsconfig.json', './system.config.js'],
    static: ['src/**/*', '!**/*.ts', '!**/*.js', '!src/app/**/*.html'],
    compiledFiles: ['src/**/*.ts', 'typings/index.d.ts', 'src/**/*.js'],
    vendor_js: ['node_modules/zone.js/dist/zone.js','node_modules/reflect-metadata/Reflect.js', 'node_modules/systemjs/dist/system.src.js', 'node_modules/es6-shim/es6-shim.js', 'node_modules/vss-web-extension-sdk/lib/VSS.SDK.js'],
    buildOut: 'build/target'
}

gulp.task('clean', function() {
    return del(['build']);
});

gulp.task('copy:static', function() {
    return gulp
        .src(paths.static)
        .pipe(gulp.dest(paths.buildOut));
});

gulp.task('copy:multiselect-src', function() {
    // the multiselect-src module isn't packaged with compiled sources, so instead copy it into the app so it can be
    // compiled with it.
    return gulp.src(['./node_modules/angular-2-dropdown-multiselect/src/multiselect-dropdown.ts'])
        .pipe(gulp.dest('./build/compile/app/'));
});

gulp.task('bundle:app', ['copy:multiselect-src'], function() {
    var builder = new systemjsBuilder('.', './system.config.js');
    return builder.buildStatic('./build/compile/app/app.ts', paths.buildOut + '/app/app.bundle.min.js',
        {
            sourceMaps: true,
            runtime: false,
            sourceMapContents: true,
            minify: true
        });
});

gulp.task('bundle:vendor', function() {
    return gulp.src(paths.vendor_js)
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.bundle.js'))
        .pipe(uglify())
        .pipe(rename('vendor.bundle.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.buildOut + '/vendor'));
});

gulp.task('compile:copy', function() {
    return gulp.src('./src/**/*')
        .pipe(gulp.dest('./build/compile'));
});

gulp.task('compile:embed', function () {
    return gulp.src('./build/compile/**/*.ts')
               .pipe(embedTemplates({sourceType:'ts'}))
               .pipe(gulp.dest('./build/compile'));
});

gulp.task('compile', function(callback) {
    runSequence('compile:copy', 'compile:embed', callback);
});


gulp.task('build', function(callback) {
    runSequence('clean', 'compile', ['copy:static', 'bundle:vendor', 'bundle:app'], callback);
});


gulp.task('package', ['build'], function() {
    return run('tfx extension create --root build\\target --manifest-globs manifest.json  --output-path build\\dist').exec()
});

gulp.task('watch', function() {
    gulp.watch(paths.buildFiles, ['build']);
    gulp.watch(paths.static, ['copy:static']);
    gulp.watch(paths.compiledFiles, ['bundle:app']);
});

gulp.task('serve', function() {
    connect.server({
        root: 'build/target'
    });
});

gulp.task('default', ['build']);
