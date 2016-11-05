(function(global) {

  var paths = {
    'npm:': 'node_modules/'
  };

  // map tells the System loader where to look for things
  var map = {
    'app': 'app',
    // angular bundles
    '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
    '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
    '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
    '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
    '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
    '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
    '@angular/upgrade': 'npm:@angular/upgrade/bundles/upgrade.umd.js',
    'rxjs': 'npm:rxjs',
    'typescript': 'npm:typescript',
    'ts': 'npm:plugin-typescript/lib'
  };
  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app': { main: 'app.ts',  defaultExtension: 'ts' },
    'rxjs': { defaultExtension: 'js' },
    'ts': { 'main': 'plugin.js'},
    "typescript": {
      "main": "lib/typescript.js",
      "meta": {
        "lib/typescript.js": {
          "exports": "ts"
        }
      }
    }
  };

  var config = {
    transpiler: 'ts',
    typescriptOptions: {
      tsconfig: true,
    },
    paths: paths,
    map: map,
    packages: packages,
    meta: {
      'TFS/*': {build:false}
    }
  };
  System.config(config);
})(this);
