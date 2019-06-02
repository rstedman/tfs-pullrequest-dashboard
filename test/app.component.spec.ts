import {AppComponent} from "../src/app/app.component";
import {AppSettingsService, Layout, TfsService, User} from "../src/app/model";
import {TestUtils} from "./testHelpers";
import { NgZone, EventEmitter } from "@angular/core";
import { Observable } from "rxjs";

declare var Rx: any;

describe("AppComponent", () => {

    class SettingsMock extends AppSettingsService {
        protected getValue(key: string): Promise<string> {
            return Promise.resolve("");
        }

        protected setValue(key: string, value: string): Promise<string> {
            return Promise.resolve(value);
        }
    }

    const defaultUser: User = {
        id: "123",
        displayName: "test user",
        uniqueName: "testuser1",
        memberOf: [
            TestUtils.createIdentity("group1"),
            TestUtils.createIdentity("group2")
        ]
    };

    const layout: Layout = {
        categories: [{key: "test", name: "Test"}],
        widgetMode: false
    };

    let tfsMock: TfsService;
    let settingsMock: AppSettingsService;
    let zoneMock: NgZone;

    const repos = [TestUtils.createRepository("repo1"),
        TestUtils.createRepository("repo2"),
        TestUtils.createRepository("repo3"),
        TestUtils.createRepository("repo4")];

    let subject: AppComponent;

    beforeEach(() => {
        tfsMock = {
            getCurrentUser: (): Promise<User> => {
                return Promise.resolve(defaultUser);
            },
            getPullRequests: (allProjects?: boolean): Observable<GitPullRequest> => {
                return Rx.Observable.from([]);
            },
            getRepositories: (): Promise<GitRepository[]> => {
                return Promise.resolve(repos);
            }
        };
        spyOn(tfsMock, "getCurrentUser");
        spyOn(tfsMock, "getPullRequests");
        spyOn(tfsMock, "getRepositories");

        settingsMock = new SettingsMock(layout, null);
        spyOn(settingsMock, "getDateFormat");
        spyOn(settingsMock, "getRepoFilter");
        spyOn(settingsMock, "getShowAllProjects");

        zoneMock = {
            run: (action: () => void) => action(),
            hasPendingMacrotasks: false,
            hasPendingMicrotasks: false,
            isStable: true,
            onError: null,
            onMicrotaskEmpty: null,
            onStable: null,
            onUnstable: null,
            runGuarded: null,
            runOutsideAngular: null
        }

        subject = new AppComponent(tfsMock, settingsMock, zoneMock);
    });

    it("doesn't make any service calls in the constructor", () => {
        expect(tfsMock.getCurrentUser).toHaveBeenCalledTimes(0);
        expect(tfsMock.getPullRequests).toHaveBeenCalledTimes(0);
        expect(tfsMock.getRepositories).toHaveBeenCalledTimes(0);
        expect(settingsMock.getDateFormat).toHaveBeenCalledTimes(0);
        expect(settingsMock.getRepoFilter).toHaveBeenCalledTimes(0);
        expect(settingsMock.getShowAllProjects).toHaveBeenCalledTimes(0);
    });

});
