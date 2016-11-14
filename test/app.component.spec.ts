import {AppComponent} from "../src/app/app.component";
import {User, TfsService, StorageService} from "../src/app/model";
import {TestUtils} from "./testHelpers";

describe("AppComponent", () => {

    let defaultUser: User = {
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

    let repos = [TestUtils.createRepository("repo1"),
        TestUtils.createRepository("repo2"),
        TestUtils.createRepository("repo3"),
        TestUtils.createRepository("repo4")];

    let subject: AppComponent;

    beforeEach(() => {
        tfsMock = {
            getCurrentUser: function(): Promise<User> {
                return Promise.resolve(defaultUser);
            },
            getPullRequests: function(repo: GitRepository): Promise<GitPullRequest[]>{
                return Promise.resolve([]);
            },
            getRepositories: function(): Promise<GitRepository[]> {
                return Promise.resolve(repos);
            }
        };
        spyOn(tfsMock, "getCurrentUser");
        spyOn(tfsMock, "getPullRequests");
        spyOn(tfsMock, "getRepositories");

        storageMock = {
            getValue: function(key: string): Promise<string> {
                return Promise.resolve("");
            },
            setValue: function(key: string, value: string): Promise<string> {
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
