import {Injectable, NgZone    } from "@angular/core";

import {StorageService} from "./model";

export class TfsStorageService extends StorageService {

    private storageServicePromise: Promise<IExtensionDataService>;

    constructor(private zone: NgZone) {
        super();


        this.storageServicePromise = new Promise<IExtensionDataService>((resolve, reject) => {
          VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData)
                .then(service => resolve(service));
          });
    }

    getValue(key: string): Promise<string> {
        return new Promise((resolve, reject) =>
            this.storageServicePromise
                   .then(service => service.getValue<string>(key, {scopeType: "User", defaultValue: null}))
                   .then(x =>
                       // the IExtensionData calls run outside of the angular zone.
                       // Make the result callback run back into the angular zone
                       this.zone.run(() => resolve(x))));
    }

    setValue(key: string, value: string): Promise<string> {
        return new Promise<string>((resolve, reject) => this.storageServicePromise
                   .then(service => service.setValue(key, value, {scopeType: "User"}))
                   .then(x =>
                       // the IExtensionData calls run outside of the angular zone.
                       // Make the result callback run back into the angular zone
                       this.zone.run(() => resolve(x))));
    }
}
