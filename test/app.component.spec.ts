import {AppComponent} from "../src/app/app.component";
import {StorageService, TfsService, User} from "../src/app/model";
import {TestUtils} from "./testHelpers";

describe("AppComponent", () => {

    const defaultUser: User = {
        id: "123",
        displayName: "test user",
        uniqueName: "testuser1",
        memberOf: [
            TestUtils.createIdentity("group1"),
            TestUtils.createIdentity("group2")
        ]
    };

    let tfsMock: TfsService;
    let storageMock: StorageService;

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
            getPullRequests: (repo: GitRepository): Promise<GitPullRequest[]> => {
                return Promise.resolve([]);
            },
            getRepositories: (): Promise<GitRepository[]> => {
                return Promise.resolve(repos);
            },
            widgetContext: (): boolean => true
        };
        spyOn(tfsMock, "getCurrentUser");
        spyOn(tfsMock, "getPullRequests");
        spyOn(tfsMock, "getRepositories");

        storageMock = {
            getValue: (key: string): Promise<string> => {
                return Promise.resolve("");
            },
            setValue: (key: string, value: string): Promise<string> => {
                return Promise.resolve(value);
            }
        };
        spyOn(storageMock, "getValue");
        spyOn(storageMock, "setValue");

        subject = new AppComponent(tfsMock, storageMock);
    });

    it("doesn't make any service calls in the constructor", () => {
        expect(tfsMock.getCurrentUser).toHaveBeenCalledTimes(0);
        expect(tfsMock.getPullRequests).toHaveBeenCalledTimes(0);
        expect(tfsMock.getRepositories).toHaveBeenCalledTimes(0);
        expect(storageMock.getValue).toHaveBeenCalledTimes(0);
        expect(storageMock.setValue).toHaveBeenCalledTimes(0);
    });

});
