import { platformBrowserDynamic  } from "@angular/platform-browser-dynamic";
import { AppModule, AppConfigSettings } from "./app.module";
import { enableProdMode } from "@angular/core";

if (AppConfigSettings.devMode === false) {

    enableProdMode();

    VSS.init({
        usePlatformScripts: true,
        usePlatformStyles: true,
        explicitNotifyLoaded: false
    });

    // init app in the require callback so that it's only run when the VSS initialization has completed,
    // and we're able to get the webcontext
    VSS.require([], () => {
        let context = VSS.getWebContext();
        AppConfigSettings.onPrem = (context.host.authority.indexOf("visualstudio.com") < 0);
        AppConfigSettings.apiEndpoint = context.collection.uri;
        if(!AppConfigSettings.onPrem) {
            AppConfigSettings.user = {
                Id: context.user.id,
                DisplayName: context.user.name,
                UniqueName: context.user.uniqueName,
                Descriptor: {
                    IdentityType: "onprem",
                    Identifier: context.user.id
                },
                ImageUrl: null,
                Members: [],
                MembersOf: [],
                Properties: new Map<string,string>()
            }
        }

        platformBrowserDynamic().bootstrapModule(AppModule);
    });
} else {
    platformBrowserDynamic().bootstrapModule(AppModule);
}
