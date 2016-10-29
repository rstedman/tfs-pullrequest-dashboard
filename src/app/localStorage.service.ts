import {Injectable} from "@angular/core";

import {StorageService} from "./model";

@Injectable()
export class LocalStorageService extends StorageService {

    private storageServicePromise: IPromise<IExtensionDataService>;

    constructor() {
        super();
    }
    
    getValue(key: string): IPromise<string> {
        return new Promise<string>((resolve, reject) => resolve(localStorage.getItem(key)));
    }

    setValue(key: string, value: string): IPromise<string> {
        return new Promise<string>((resolve, reject) => {
            localStorage.setItem(key, value);
            resolve(value);
        });
    }
}
