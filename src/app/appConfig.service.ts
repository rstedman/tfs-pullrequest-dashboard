import { Injectable } from "@angular/core";

// Used to initialize the application during bootstrap, including resolving VSS services so that they
// can be injected in the constructors of other services.
// This is the only class that should be interacting with the VSS module.
@Injectable()
export class AppConfigService {

    // change to true if you want to run in devmode
    private _devMode: boolean = false;
    // change this to the endpoint of the tfs service that you wish to develop against
    private _devApiEndpoint: string = "http://<host>:8080/tfs/DefaultCollection";

    private _gitClientFactory: GitClientFactory;
    private _identitiesClientFactory: IdentitiesClientFactory;
    private _context: Context;
    private _extensionDataService: IExtensionDataService;

    get devMode(): boolean { return this._devMode; }
    get devApiEndpoint(): string { return this._devApiEndpoint; }
    get gitClientFactory(): GitClientFactory { return this._gitClientFactory; }
    get identitiesClientFactory(): IdentitiesClientFactory { return this._identitiesClientFactory; }
    get context(): Context { return this._context; }
    get extensionDataService(): IExtensionDataService { return this._extensionDataService; }

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
            explicitNotifyLoaded: false
        });

        VSS.require(["TFS/VersionControl/GitRestClient", "VSS/Identities/RestClient", "VSS/Context"],
          (gitFactory: GitClientFactory, identityFactory: IdentitiesClientFactory, context: Context) => {
              this._gitClientFactory = gitFactory;
              this._identitiesClientFactory = identityFactory;
              this._context = context;
              VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData)
                      .then((service) => {
                          this._extensionDataService = service;
                          resolve(true);
                      });
          });
      });
    }
}
