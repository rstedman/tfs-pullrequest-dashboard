import { FactoryProvider, Injectable, NgZone } from "@angular/core";

import { AppConfigService } from "./appConfig.service";
import { LocalStorageService } from "./localStorage.service";
import { StorageService } from "./model";
import { TfsStorageService } from "./tfsStorage.service";

// factory provider for the tfsservice, which switches the backend provider based on if it's using tfs online,
// an on-prem service
@Injectable()
export class StorageServiceProvider implements FactoryProvider {
  public provide = StorageService;

  public deps = [NgZone, AppConfigService];

  public useFactory(zone: NgZone, config: AppConfigService): StorageService {
    // If we aren't running as a VSS extension, use the LocalStorageService
    if (config.devMode) {
      return new LocalStorageService();
    } else {
      return new TfsStorageService(config.extensionDataService, zone);
    }
  }

}
