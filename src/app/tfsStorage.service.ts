import {Injectable} from "@angular/core";

import {StorageService} from "./model";

@Injectable()
export class TfsStorageService extends StorageService {

    private storageServicePromise: IPromise<IExtensionDataService>;

    constructor() {
        super();

        this.storageServicePromise = VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData);
    }
    
    getValue(key: string): IPromise<string> {
        return this.storageServicePromise
                   .then(service => service.getValue<string>(key));
    }

    setValue(key: string, value: string): IPromise<string> {
        return this.storageServicePromise
                   .then(service => service.setValue(key, value));
    }
}
