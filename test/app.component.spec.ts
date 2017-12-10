import {AppComponent} from "../src/app/app.component";
import {AppSettingsService, Layout, TfsService, User} from "../src/app/model";
import {TestUtils} from "./testHelpers";

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
            getPullRequests: (allProjects?: boolean): Promise<GitPullRequest[]> => {
                return Promise.resolve([]);
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

        subject = new AppComponent(tfsMock, settingsMock);
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
