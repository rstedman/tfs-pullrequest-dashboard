import { FactoryProvider, Injectable, NgZone } from "@angular/core";

import { AppConfigService } from "./appConfig.service";
import { LocalAppSettingsService } from "./localAppSettings.service";
import { AppSettingsService } from "./model";
import { TfsAppSettingsService } from "./tfsAppSettings.service";

// factory provider for the tfsservice, which switches the backend provider based on if it's using tfs online,
// an on-prem service
@Injectable()
export class AppSettingsServiceProvider implements FactoryProvider {
  public provide = AppSettingsService;

  public deps = [NgZone, AppConfigService];

  public useFactory(zone: NgZone, config: AppConfigService): AppSettingsService {
    // If we aren't running as a VSS extension, use the LocalStorageService
    if (config.devMode) {
      return new LocalAppSettingsService(zone);
    } else {
      const res = new TfsAppSettingsService(config.extensionDataService, VSS.getWebContext(), zone, config.layout);
      config.layoutChanged.on((data) => res.setLayout(data));
      return res;
    }
  }

}
