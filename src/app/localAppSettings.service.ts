import {Injectable, NgZone} from "@angular/core";

import {AppSettingsService} from "./model";

@Injectable()
export class LocalAppSettingsService extends AppSettingsService {

    constructor(zone: NgZone) {
        super(false, null, zone);
    }

    protected getValue(key: string): Promise<string> {
        const value = localStorage.getItem(key);
        return Promise.resolve(value);
    }

    protected setValue(key: string, value: string): Promise<string> {
        localStorage.setItem(key, value);
        return Promise.resolve(value);
    }
}
