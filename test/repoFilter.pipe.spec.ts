import {PullRequestAsyncStatus, User} from "../src/app/model";
import {PullRequestViewModel} from "../src/app/pullRequestViewModel";
import {RepoFilterPipe} from "../src/app/repoFilter.pipe";
import {TestUtils} from "./testHelpers";

describe("RepoFilterPipe", () => {

    function createPRViewModel(repoId: string): PullRequestViewModel {
        const user: User = {
            id: "123",
            displayName: "test user",
            uniqueName: "testuser1",
            memberOf: []
        };
        const repo: GitRepository = {
            _links: {
                web: {
                    href: `http://git/${repoId}`
                }
            },
            defaultBranch: "master",
            url: `http://git/${repoId}`,
            id: repoId,
            name: repoId,
            project: null,
            remoteUrl: `http://git/${repoId}`
        };
        const pr = TestUtils.createPullRequest({
            created: new Date(),
            createdById: "user1",
            id: 1,
            mergeStatus: PullRequestAsyncStatus.Succeeded,
            sourceBranch: "testbranch",
            targetBranch: "master",
            title: "test123",
            reviewers: []
        });
        return new PullRequestViewModel(pr, repo, user);
    }

    let subject: RepoFilterPipe = null;

    beforeEach(() => {
        subject = new RepoFilterPipe();
    });

    it("returns an empty list if an empty list is given", () => {
        const result = subject.transform([], ["repo1"]);
        expect(result).toBeDefined();
        expect(result.length).toEqual(0);
    });

    it("returns the input if no repos filtered", () => {
        const pr1 = createPRViewModel("repo1");
        const pr2 = createPRViewModel("repo2");
        const result = subject.transform([pr1, pr2], []);
        expect(result).toBeDefined();
        expect(result.length).toEqual(2);
        expect(result[0]).toEqual(pr1);
        expect(result[1]).toEqual(pr2);
    });

    it("filters out repos based on repoid", () => {
        const pr1 = createPRViewModel("repo1");
        const pr2 = createPRViewModel("repo2");
        const pr3 = createPRViewModel("repo3");
        const pr4 = createPRViewModel("repo4");
        const result = subject.transform([pr1, pr2, pr3, pr4], ["repo2", "repo4"]);
        expect(result).toBeDefined();
        expect(result.length).toEqual(2);
        expect(result[0]).toEqual(pr1);
        expect(result[1]).toEqual(pr3);
    });

});
