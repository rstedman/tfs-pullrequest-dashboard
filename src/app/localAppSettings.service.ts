import {Injectable, NgZone} from "@angular/core";

import {AppSettingsService, Layout} from "./model";

@Injectable()
export class LocalAppSettingsService extends AppSettingsService {

    private static _layout: Layout = {
        categories: [{
            key: "requestedByMe", name: "Requested By Me"
          },
          {
            key: "assignedToMe", name: "Assigned To Me"
          },
          {
            key: "assignedToMyTeam", name: "Assigned To My Team"
        }],
        widgetMode: false
    };

    private static _widgetLayout: Layout = {
        categories: [{key: "all", name: "All Pull Requests"}],
        widgetMode: true,
        size: {
            columnSpan: 3,
            rowSpan: 2
        }
    };

    constructor(zone: NgZone) {
        super(LocalAppSettingsService._widgetLayout, zone);
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
