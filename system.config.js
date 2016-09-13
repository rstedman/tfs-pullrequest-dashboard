(function(global) {
  // map tells the System loader where to look for things
  var map = {
    'app':                        './src/app',
    '@angular':                   './node_modules/@angular',
    'rxjs':                       './node_modules/rxjs',
    'typescript':                 './node_modules/typescript/lib/',
    'ts':                         './node_modules/plugin-typescript/lib/'
  };
  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app':                        { main: 'app.ts',  defaultExtension: 'ts' },
    'rxjs':                       { defaultExtension: 'js' },
    'ts': { 'main': 'plugin.js'},
    "typescript": {
      "main": "typescript.js",
      "meta": {
        "typescript.js": {
          "exports": "ts"
        }
      }
    }
  };
  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'forms',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'upgrade',
  ];
  // Individual files (~300 requests):
  function packIndex(pkgName) {
    packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
  }
  // Bundled (~40 requests):
  function packUmd(pkgName) {
    packages['@angular/'+pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
  }
  // Most environments should use UMD; some (Karma) need the individual index files
  var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
  // Add package entries for angular packages
  ngPackageNames.forEach(setPackageConfig);
  var config = {
    //defaultJSExtensions: true,
    baseURL: './src',
    transpiler: 'ts',
    typescriptOptions: {
      target: 'es5',
      soureMap: true,
      inlineSourceMap: true,
      resolveTypings: true,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      noImplicitAny: false,
      module: 'system'
    },
    map: map,
    packages: packages
  };
  System.config(config);
})(this);
