import {Injectable} from "@angular/core";

import {StorageService} from "./model";

@Injectable()
export class LocalStorageService extends StorageService {

    private storageServicePromise: Promise<IExtensionDataService>;

    constructor() {
        super();
    }

    getValue(key: string): Promise<string> {
        let value = localStorage.getItem(key);
        return Promise.resolve(value);
    }

    setValue(key: string, value: string): Promise<string> {
        localStorage.setItem(key, value);
        return Promise.resolve(value);
    }
}
