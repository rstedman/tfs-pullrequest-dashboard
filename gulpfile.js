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
var path = require('path');
var htmlreplace = require('gulp-html-replace');
var tslint = require('gulp-tslint');

var paths = {
    buildFiles: ['./gulpfile.js', './package.json', './typings.json', './tsconfig.json', './system.config.js'],
    compiledFiles: ['src/**/*.ts', 'typings/index.d.ts', 'src/**/*.js'],
    vendor_js: ['node_modules/zone.js/dist/zone.js','node_modules/reflect-metadata/Reflect.js', 'node_modules/systemjs/dist/system.src.js', 'node_modules/es6-shim/es6-shim.js', 'node_modules/vss-web-extension-sdk/lib/VSS.SDK.js'],
}

gulp.task('clean', function() {
    return del(['build']);
});

gulp.task('copy:vendor', function() {
    return gulp.src(['node_modules/@angular/**/*', 'node_modules/rxjs/**/*', 'node_modules/typescript/**/*', 'node_modules/plugin-typescript/**/*'], {base: './node_modules'})
        .pipe(gulp.dest('./build/vendor'));
})

gulp.task('copy:multiselect-src', function() {
    // the multiselect-src module isn't packaged with compiled sources, so instead copy it into the app so it can be
    // compiled with it.
    return gulp.src(['./node_modules/angular-2-dropdown-multiselect/src/multiselect-dropdown.ts'])
        .pipe(gulp.dest('./build/app/'));
});

gulp.task('bundle:app', function() {
    var builder = new systemjsBuilder('build/', 'build/system.config.js');
    return builder.buildStatic('./build/app/app.ts', './build/app/app.bundle.min.js',
        {
            sourceMaps: true,
            runtime: false,
            sourceMapContents: true,
            // don't minify (for now).  Seems to mess up the sourcemaps.
            //minify: true
        });
});

gulp.task('html:replace', function() {
    return gulp.src('build/index.html')
            .pipe(htmlreplace({
                'load_bundle': 'app/app.bundle.min.js'
            },
            {
                keepUnassigned: false //will remove any build sections that we don't have any explicit actions for
            }))
            .pipe(gulp.dest('build/'));
})

gulp.task('bundle:vendor', function() {
    return gulp.src(paths.vendor_js)
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.bundle.js'))
        .pipe(uglify())
        .pipe(rename('vendor.bundle.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/vendor'));
});

gulp.task('tslint', function() {
    return gulp.src(['./src/app/*.ts', '!./src/app/vss-interfaces.d.ts'])
        .pipe(tslint({
            //program: program,
            configuration: 'tslint.json',
            formatter: 'prose'
        }))
        .pipe(tslint.report({
            summarizeFailureOutput: false,
            reportLimit: 20
        }));
});

gulp.task('compile:copy', ['copy:multiselect-src'], function() {
    return gulp.src(['./src/**/*', 'tsconfig.json'])
        .pipe(gulp.dest('./build'));
});

gulp.task('compile:embed', function () {
    return gulp.src('./build/app/*.ts')
               .pipe(embedTemplates({sourceType:'ts'}))
               .pipe(gulp.dest('./build/app'));
});

// compiles just local sources
gulp.task('compile:sources', function(callback) {
    runSequence( 'tslint', 'compile:copy', 'compile:embed', callback);
});

gulp.task('compile', ['copy:vendor', 'compile:sources']);

gulp.task('build', function(callback) {
    runSequence('clean', 'compile', ['bundle:vendor', 'bundle:app', 'html:replace'], callback);
});

gulp.task('package', ['build'], function() {
    return run('tfx extension create --root build --manifest-globs manifest.json  --output-path dist').exec()
});

gulp.task('package:dev', ['build'], function() {
    return run('tfx extension create --root build --manifest-globs manifest-dev.json  --output-path dist').exec()
});

gulp.task('serve', ['compile'], function() {

    gulp.watch(['./src/**/*.*', './tsconfig.json'], ['compile:sources']);

    connect.server({
        root: './build'
    });
});

gulp.task('default', ['build']);
