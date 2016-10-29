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
