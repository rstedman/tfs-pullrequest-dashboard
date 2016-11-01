/* note - this isn't the proper relative path for this file in source, it's actually the relative */
/*         path when the file is in a temp build dir.  This is a hacky workaround to get ts type checking to */
/*         work during builds */

/// <reference path="../../../typings/vss-interfaces.d.ts" />

import { platformBrowserDynamic  } from "@angular/platform-browser-dynamic";
import { AppModule, AppConfigSettings } from "./app.module";
import { enableProdMode } from "@angular/core";

//AppConfigSettings.devMode = true;
//AppConfigSettings.apiEndpoint = "http://<host>:8080/tfs/DefaultCollection"; // change this to the endpoint of the tfs service that you wish to develop against

if (AppConfigSettings.devMode === false) {

    enableProdMode();

    VSS.init({
        usePlatformScripts: false,
        usePlatformStyles: false,
        explicitNotifyLoaded: false
    });
    // init app in the require callback so that it's only run when the VSS initialization has completed,
    VSS.require([], () => {
        platformBrowserDynamic().bootstrapModule(AppModule);
    });
} else {
    platformBrowserDynamic().bootstrapModule(AppModule);
}
