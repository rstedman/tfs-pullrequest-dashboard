import {Injectable, NgZone    } from "@angular/core";

import {StorageService} from "./model";

export class TfsStorageService extends StorageService {

    constructor(private storageService: IExtensionDataService, private zone: NgZone) {
        super();
    }

    getValue(key: string): Promise<string> {
      return new Promise((resolve, reject) =>
          this.storageService.getValue<string>(key, {scopeType: "User", defaultValue: null})
            .then(x =>
              // the IExtensionData calls run outside of the angular zone.
              // Make the result callback run back into the angular zone
              this.zone.run(() => resolve(x))));
    }

    setValue(key: string, value: string): Promise<string> {
        return new Promise<string>((resolve, reject) =>
          this.storageService.setValue(key, value, {scopeType: "User"})
           .then(x =>
               // the IExtensionData calls run outside of the angular zone.
               // Make the result callback run back into the angular zone
               this.zone.run(() => resolve(x))));
    }
}
