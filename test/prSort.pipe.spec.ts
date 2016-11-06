import {PullRequestViewModel} from "../src/app/pullRequestViewModel";
import {User, PullRequestAsyncStatus} from "../src/app/model";
import {PullRequestSortPipe} from "../src/app/prSort.pipe";
import {TestUtils} from "./testHelpers";

describe("PullRequestSortPipe", () => {

    function createPRViewModel(createdDate: Date): PullRequestViewModel {
        let user: User = {
            id: "123",
            displayName: "test user",
            uniqueName: "testuser1",
            memberOf: []
        };
        let repo: GitRepository = {
            _links: null,
            defaultBranch: "master",
            url: "http://git/repo",
            id: "repo",
            name: "repo",
            project: null,
            remoteUrl: "http://git/repo"
        };
        let pr = TestUtils.createPullRequest({
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

    let subject: PullRequestSortPipe = null;

    beforeEach(() => {
        subject = new PullRequestSortPipe();
    });

    it("does nothing with an empty list", () => {
        let result = subject.transform([]);
        expect(result).toBeDefined();
        expect(result.length).toEqual(0);
    });

    it("sorts prs oldest first", () => {
        let time = new Date();
        let pr1 = createPRViewModel(time);
        time.setMinutes(-10);
        let pr2 = createPRViewModel(time);
        time.setMinutes(-25);
        let pr3 = createPRViewModel(time);
        let result = subject.transform([pr1, pr2, pr3]);

        expect(result).toBeDefined();
        expect(result.length).toEqual(3);
        expect(result[0]).toEqual(pr3);
        expect(result[1]).toEqual(pr2);
        expect(result[2]).toEqual(pr1);
    });
});
