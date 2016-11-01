/// <reference path="./vss-interfaces.d.ts" />

import { platformBrowserDynamic  } from "@angular/platform-browser-dynamic";
import { AppModule, AppConfigSettings } from "./app.module";
import { enableProdMode } from "@angular/core";
import { TfsServiceProvider } from "./tfsService.provider";
import { StorageServiceProvider } from "./storageService.provider";

//AppConfigSettings.devMode = true;
//AppConfigSettings.apiEndpoint = "http://<host>:8080/tfs/DefaultCollection"; // change this to the endpoint of the tfs service that you wish to develop against

if (!AppConfigSettings.devMode) {

    enableProdMode();

    VSS.init({
        usePlatformScripts: false,
        usePlatformStyles: false,
        explicitNotifyLoaded: false
    });

    VSS.require(["TFS/VersionControl/GitRestClient", "VSS/Identities/RestClient"], (gitFactory: GitClientFactory, identityFactory: IdentitiesClientFactory) => {
        TfsServiceProvider.gitClientFactory = gitFactory;
        TfsServiceProvider.identityClientFactory = identityFactory;
        VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData)
                .then(service => {
                    StorageServiceProvider.dataService = service;
                    platformBrowserDynamic().bootstrapModule(AppModule);
                });
    });
} else {
    platformBrowserDynamic().bootstrapModule(AppModule);
}
