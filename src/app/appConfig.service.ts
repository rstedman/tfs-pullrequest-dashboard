import { Injectable } from "@angular/core";

import { LiteEvent } from "./model";

// Used to initialize the application during bootstrap, including resolving VSS services so that they
// can be injected in the constructors of other services.
// This is the only class that should be interacting with the VSS module.
@Injectable()
export class AppConfigService {

    // change to true if you want to run in devmode
    private _devMode: boolean = false;
    // change this to the endpoint of the tfs service that you wish to develop against
    private _devApiEndpoint: string = "http://<host>:8080/tfs/DefaultCollection";
    private _widgetMode: boolean = false;
    private _widgetCategory: string = "assignedToMe";

    private _gitClientFactory: GitClientFactory;
    private _identitiesClientFactory: IdentitiesClientFactory;
    private _context: Context;
    private _extensionDataService: IExtensionDataService;

    private _onCategoryChanged = new LiteEvent<string>();

    get devMode(): boolean { return this._devMode; }
    get widgetMode(): boolean { return this._widgetMode; }
    get widgetCategory(): string { return this._widgetCategory; }
    get devApiEndpoint(): string { return this._devApiEndpoint; }
    get gitClientFactory(): GitClientFactory { return this._gitClientFactory; }
    get identitiesClientFactory(): IdentitiesClientFactory { return this._identitiesClientFactory; }
    get context(): Context { return this._context; }
    get extensionDataService(): IExtensionDataService { return this._extensionDataService; }
    get categoryChanged() { return this._onCategoryChanged.expose(); }

    public initialize(): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {

        // don't do any of the VSS when in dev mode
        if (this.devMode) {
          resolve(true);
          return;
        }

        VSS.init({
            usePlatformScripts: false,
            usePlatformStyles: false,
            explicitNotifyLoaded: true
        });

        VSS.require(["TFS/VersionControl/GitRestClient", "VSS/Identities/RestClient", "VSS/Context", "TFS/Dashboards/WidgetHelpers"],
          (gitFactory: GitClientFactory, identityFactory: IdentitiesClientFactory, context: Context, widgetHelpers: any) => {
              this._gitClientFactory = gitFactory;
              this._identitiesClientFactory = identityFactory;
              this._context = context;
              this._widgetMode = context.getPageContext().navigation.currentController === "dashboards";
              VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData)
                  .then((service) => {
                      this._extensionDataService = service;
                      if (this._widgetMode) {
                        widgetHelpers.IncludeWidgetStyles();
                        VSS.register("tfs-pullrequest-dashboard-widget", () => {
                          return {
                            load: (settings) => {
                              if (settings.customSettings.data) {
                                  const s = JSON.parse(settings.customSettings.data);
                                  if (s && s.prCategory) {
                                      this._widgetCategory = s.prCategory;
                                  }
                              }
                              resolve(true);
                              return widgetHelpers.WidgetStatusHelper.Success();
                            },
                            reload: (settings) => {
                              if (settings.customSettings.data) {
                                  const s = JSON.parse(settings.customSettings.data);
                                  if (s && s.prCategory) {
                                      this._widgetCategory = s.prCategory;
                                      this._onCategoryChanged.trigger(s.prCategory);
                                  }
                              }
                              return widgetHelpers.WidgetStatusHelper.Success();
                            }
                          };
                        });
                        VSS.notifyLoadSucceeded();
                      } else {
                        resolve(true);
                        VSS.notifyLoadSucceeded();
                      }
                  });
          });
      });
    }
}
