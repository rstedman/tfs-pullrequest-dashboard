import {PullRequestViewModel} from "../src/app/pullRequestViewModel";
import {User, PullRequestAsyncStatus} from "../src/app/model";
import {PullRequestFilterPipe} from "../src/app/pullRequestFilter.pipe";
import {TestUtils} from "./testHelpers";

describe("PullRequestFilterPipe", () => {

    function createPRViewModel(createdBy: string, reviewers: string[]): PullRequestViewModel {
        let user: User = {
            id: "user1",
            displayName: "test user",
            uniqueName: "testuser1",
            memberOf: [
                TestUtils.createIdentity("team1"),
                TestUtils.createIdentity("team2")
            ]
        };
        let repo: GitRepository = {
            _links: null,
            defaultBranch: "master",
            url: `http://git/repo`,
            id: "repo",
            name: "repo",
            project: null,
            remoteUrl: `http://git/repo`
        };
        let pr = TestUtils.createPullRequest({
            created: new Date(),
            createdById: createdBy,
            id: 1,
            mergeStatus: PullRequestAsyncStatus.Succeeded,
            sourceBranch: "testbranch",
            targetBranch: "master",
            title: "test123",
            reviewers: reviewers.map(x => {
                return {
                    id: x,
                    required: false,
                    vote: 0
                };
            })
        });
        return new PullRequestViewModel(pr, repo, user);
    }

    let subject: PullRequestFilterPipe = null;

    beforeEach(() => {
        subject = new PullRequestFilterPipe();
    });

    it("returns an emtpy list if given an empty list", () => {
        let result = subject.transform([], "requestedByMe");
        expect(result).toBeDefined();
        expect(result.length).toEqual(0);
    });

    it("returns only PRs requested by me when filtered", () => {
        let pr1 = createPRViewModel("user2", []);
        let pr2 = createPRViewModel("user1", ["user2"]);
        let pr3 = createPRViewModel("user3", ["user2", "user1"]);
        let pr4 = createPRViewModel("user1", ["user2"]);

        let result = subject.transform([pr1, pr2, pr3, pr4], "requestedByMe");
        expect(result).toBeDefined();
        expect(result.length).toEqual(2);
        expect(result[0]).toEqual(pr2);
        expect(result[1]).toEqual(pr4);
    });

    it("returns returns an empty list if no prs requested by me when filtered", () => {
        let pr1 = createPRViewModel("user2", []);
        let pr2 = createPRViewModel("user4", ["user2"]);
        let pr3 = createPRViewModel("user3", ["user2", "user1"]);
        let pr4 = createPRViewModel("user2", ["user1"]);

        let result = subject.transform([pr1, pr2, pr3, pr4], "requestedByMe");
        expect(result).toBeDefined();
        expect(result.length).toEqual(0);
    });

    it("returns PRs assignedToMe when filtered", () => {
        let pr1 = createPRViewModel("user2", ["user3", "user5", "user1", "user10"]);
        let pr2 = createPRViewModel("user1", ["user2"]);
        let pr3 = createPRViewModel("user3", ["user2", "user1"]);
        let pr4 = createPRViewModel("user1", ["user2"]);

        let result = subject.transform([pr1, pr2, pr3, pr4], "assignedToMe");
        expect(result).toBeDefined();
        expect(result.length).toEqual(2);
        expect(result[0]).toEqual(pr1);
        expect(result[1]).toEqual(pr3);
    });

    it("doesn't return PRs assignedToMe if also createdByMe", () => {
        let pr1 = createPRViewModel("user1", ["user3", "user5", "user1", "user10"]);
        let pr2 = createPRViewModel("user1", ["user2"]);
        let pr3 = createPRViewModel("user2", ["user2", "user1"]);
        let pr4 = createPRViewModel("user1", ["user2"]);

        let result = subject.transform([pr1, pr2, pr3, pr4], "assignedToMe");
        expect(result).toBeDefined();
        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(pr3);
    });

    it("returns an empty list if no PRs assignedtoMe", () => {
        let pr1 = createPRViewModel("user2", ["user3", "user5", "user4", "user10"]);
        let pr2 = createPRViewModel("user3", ["user2"]);
        let pr3 = createPRViewModel("user2", ["user2", "user5"]);
        let pr4 = createPRViewModel("user5", ["user2"]);

        let result = subject.transform([pr1, pr2, pr3, pr4], "assignedToMe");
        expect(result).toBeDefined();
        expect(result.length).toEqual(0);
    });

    it("returns PRs assignedToMyTeam when filtered", () => {
        let pr1 = createPRViewModel("user2", ["user3", "team1", "user4", "user10"]);
        let pr2 = createPRViewModel("user3", ["user2"]);
        let pr3 = createPRViewModel("user2", ["user2", "user5"]);
        let pr4 = createPRViewModel("user5", ["team2"]);

        let result = subject.transform([pr1, pr2, pr3, pr4], "assignedToMyTeam");
        expect(result).toBeDefined();
        expect(result.length).toEqual(2);
        expect(result[0]).toEqual(pr1);
        expect(result[1]).toEqual(pr4);
    });

    it("doesn't return PRs assignedToMyTeam if also requestedByMe", () => {
        let pr1 = createPRViewModel("user1", ["user3", "team1", "user4", "user10"]);
        let pr2 = createPRViewModel("user3", ["user2"]);
        let pr3 = createPRViewModel("user2", ["user2", "user5"]);
        let pr4 = createPRViewModel("user5", ["team2"]);

        let result = subject.transform([pr1, pr2, pr3, pr4], "assignedToMyTeam");
        expect(result).toBeDefined();
        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(pr4);
    });

    it("returns an empty list if no PRs assignedToMyTeam", () => {
        let pr1 = createPRViewModel("user3", ["user3", "team4", "user4", "user10"]);
        let pr2 = createPRViewModel("user3", ["user2"]);
        let pr3 = createPRViewModel("user2", ["user2", "user5"]);
        let pr4 = createPRViewModel("user5", ["team3"]);

        let result = subject.transform([pr1, pr2, pr3, pr4], "assignedToMyTeam");
        expect(result).toBeDefined();
        expect(result.length).toEqual(0);
    });

    it("returns all other PRs if filtering for other", () => {
        let pr1 = createPRViewModel("user1", []); // matches requestedByMe
        let pr2 = createPRViewModel("user3", ["user2"]);
        let pr3 = createPRViewModel("user2", ["user2", "user1"]); // matches assignedToMe
        let pr4 = createPRViewModel("user5", ["team3"]);
        let pr5 = createPRViewModel("user5", ["team1"]); // matches assignedToMyTeam

        let result = subject.transform([pr1, pr2, pr3, pr4, pr5], "other");
        expect(result).toBeDefined();
        expect(result.length).toEqual(2);
        expect(result[0]).toEqual(pr2);
        expect(result[1]).toEqual(pr4);
    });

});
