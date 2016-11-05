module.exports = function(config) {

  var appSrcBase = 'src/';       // app source TS files
  var testSrcBase= 'test/';       // test source TS files
  var appAssets  = 'src/app/'; // component assets fetched by Angular's compiler


  config.set({
    basePath: './',
    frameworks: ['jasmine'],

    plugins: [
      require('karma-jasmine'),,
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-htmlfile-reporter') // crashing w/ strange socket error
    ],

    files: [
      // System.js for module loading
      'node_modules/systemjs/dist/system.src.js',

      // Polyfills
      'node_modules/es6-shim/es6-shim.js',
      'node_modules/reflect-metadata/Reflect.js',

      // zone.js
      'node_modules/zone.js/dist/zone.js',
      'node_modules/zone.js/dist/long-stack-trace-zone.js',
      'node_modules/zone.js/dist/proxy.js',
      'node_modules/zone.js/dist/sync-test.js',
      'node_modules/zone.js/dist/jasmine-patch.js',
      'node_modules/zone.js/dist/async-test.js',
      'node_modules/zone.js/dist/fake-async-test.js',

      // RxJs
      { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },

      // Paths loaded via module imports:
      // Angular itself
      { pattern: 'node_modules/@angular/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: false },

      { pattern: 'src/system.config.js', included: false, watched: false },
      'karma-test-shim.js',

      // application & spec code paths loaded via module imports
      { pattern: appSrcBase + '**/*.ts', included: false, watched: true },

      // Asset (HTML & CSS) paths loaded via Angular's component compiler
      // (these paths need to be rewritten, see proxies section)
      { pattern: appSrcBase + '**/*.html', included: false, watched: true },
      { pattern: appSrcBase + '**/*.css', included: false, watched: true },

      // Paths for debugging with source maps in dev tools
      { pattern: testSrcBase + '**/*.ts', included: false, watched: true }
    ],

/*    // Proxied base paths for loading assets
    proxies: {
      // required for component assets fetched by Angular's compiler
      "/": appAssets
    },
*/
    exclude: [],
    // disabled HtmlReporter; suddenly crashing w/ strange socket error
    reporters: ['progress', 'kjhtml'],//'html'],

    // HtmlReporter configuration
    htmlReporter: {
      // Open this file to see results in browser
      outputFile: '_test-output/tests.html',

      // Optional
      pageTitle: 'Unit Tests',
      subPageTitle: __dirname
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  })
}
