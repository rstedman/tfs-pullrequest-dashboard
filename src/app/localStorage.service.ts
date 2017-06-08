import {Injectable} from "@angular/core";

import {StorageService} from "./model";

@Injectable()
export class LocalStorageService extends StorageService {

    constructor() {
        super();
    }

    public getValue(key: string): Promise<string> {
        const value = localStorage.getItem(key);
        return Promise.resolve(value);
    }

    public setValue(key: string, value: string): Promise<string> {
        localStorage.setItem(key, value);
        return Promise.resolve(value);
    }
}
