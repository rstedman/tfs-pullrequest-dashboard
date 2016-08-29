"use strict";

// shim to allow module loading of electron classes w/ SystemJS

let { shell } = System._nodeRequire('electron')
exports.shell = shell;
