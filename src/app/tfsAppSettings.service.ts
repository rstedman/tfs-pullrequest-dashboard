import {NgZone} from "@angular/core";

import {AppSettingsService, Layout} from "./model";

export class TfsAppSettingsService extends AppSettingsService {

    constructor(private storageService: IExtensionDataService,
                private webContext: WebContext,
                zone: NgZone,
                layout: Layout) {
        super(layout, zone);
    }

    public getHubUri(): string {
        return `${this.webContext.host.uri}/${this.webContext.project.name}/_apps/hub/ryanstedman.tfs-pullrequest-dashboard.tfs-pullrequest-dashboard`;
    }

    protected getValue(key: string): Promise<string> {
      return new Promise((resolve, reject) =>
          this.storageService.getValue<string>(key, {scopeType: "User", defaultValue: null})
            .then((x) =>
              // the IExtensionData calls run outside of the angular zone.
              // Make the result callback run back into the angular zone
              this.zone.run(() => resolve(x))));
    }

    protected setValue(key: string, value: string): Promise<string> {
        return new Promise<string>((resolve, reject) =>
          this.storageService.setValue(key, value, {scopeType: "User"})
           .then((x) =>
               // the IExtensionData calls run outside of the angular zone.
               // Make the result callback run back into the angular zone
               this.zone.run(() => resolve(x))));
    }
}
