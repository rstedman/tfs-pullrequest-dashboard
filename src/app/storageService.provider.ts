import { FactoryProvider, NgZone, Injectable }       from "@angular/core";

import { StorageService } from './model';
import { LocalStorageService } from "./localStorage.service";
import { TfsStorageService } from "./tfsStorage.service";
import { AppConfigService } from "./appConfig.service";

/** factory provider for the tfsservice, which switches the backend provider based on if it's using tfs online,
    an on-prem service **/
@Injectable()
export class StorageServiceProvider implements FactoryProvider {
  public provide = StorageService;

  // expected to be set before the app is bootstrapped, if running as an extension
  public static dataService: IExtensionDataService;

  public useFactory(zone: NgZone, config: AppConfigService): StorageService {
    // If we aren't running as a VSS extension, use the LocalStorageService
    if(config.devMode) {
      return new LocalStorageService();
    } else {
      return new TfsStorageService(StorageServiceProvider.dataService, zone);
    }
  }

  public deps = [NgZone, AppConfigService];
};
