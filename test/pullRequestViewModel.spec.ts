import {PullRequestAsyncStatus, User, GitPullRequestWithStatuses} from "../src/app/model";
import {PullRequestViewModel} from "../src/app/pullRequestViewModel";
import {TestUtils} from "./testHelpers";

describe("PullRequestViewModel", () => {

    const defaultUser: User = {
        id: "123",
        displayName: "test user",
        uniqueName: "testuser1",
        memberOf: [
            TestUtils.createIdentity("group1"),
            TestUtils.createIdentity("group2")
        ]
    };

    const defaultRepository = TestUtils.createRepository("repo1");

    function getSimplePR(): GitPullRequestWithStatuses {
        return TestUtils.createPullRequest({
            created: new Date(),
            createdById: "user1",
            id: 1,
            mergeStatus: PullRequestAsyncStatus.Succeeded,
            sourceBranch: "testbranch",
            targetBranch: "master",
            title: "test123",
            reviewers: [
                {
                    id: "reviewer1",
                    required: false,
                    vote: 0
                }
            ]
        });
    }

    it("Initializes Simple Properties", () => {
        const pr = getSimplePR();
        const subject = new PullRequestViewModel(pr, defaultRepository, defaultUser);
        expect(subject.reviewers.length).toEqual(pr.reviewers.length);
        expect(subject.createdBy).toEqual(pr.createdBy.displayName);
        expect(subject.createdDate).toEqual(pr.creationDate);
        expect(subject.repositoryName).toEqual(defaultRepository.name);
        expect(subject.sourceRefName).toEqual(pr.sourceRefName);
        expect(subject.targetRefName).toEqual(pr.targetRefName);
        expect(subject.createdByImageUrl).toEqual(pr.createdBy.imageUrl);
        expect(subject.hasMergeConflicts).toEqual(false);
    });

    it("Removes refs/heads from refNames", () => {
        const pr = getSimplePR();
        pr.sourceRefName = "refs/heads/my_branch";
        pr.targetRefName = "refs/heads/master";
        const subject = new PullRequestViewModel(pr, defaultRepository, defaultUser);
        expect(subject.sourceRefName).toEqual("my_branch");
        expect(subject.targetRefName).toEqual("master");
    });

    it("sets reviewers to empty array if reviewers null", () => {
        const pr = getSimplePR();
        pr.reviewers = null;
        const subject = new PullRequestViewModel(pr, defaultRepository, defaultUser);
        expect(subject.reviewers).toBeDefined();
        expect(subject.reviewers.length).toEqual(0);
    });

    it("sets requestedByMe correctly", () => {
        const pr = getSimplePR();
        pr.createdBy.id = defaultUser.id;
        const subject = new PullRequestViewModel(pr, defaultRepository, defaultUser);
        expect(subject.requestedByMe).toEqual(true);
        expect(subject.assignedToMe).toEqual(false);
        expect(subject.assignedToMyTeam).toEqual(false);
    });

    it("sets assignedToMe correctly", () => {
        const pr = getSimplePR();
        pr.reviewers.push(
            TestUtils.voterToIdentityRef({
                id: defaultUser.id,
                required: false,
                vote: 0
            }));
        const subject = new PullRequestViewModel(pr, defaultRepository, defaultUser);
        expect(subject.requestedByMe).toEqual(false);
        expect(subject.assignedToMe).toEqual(true);
        expect(subject.assignedToMyTeam).toEqual(false);
    });

    it("sets assignedToMyTeam correctly", () => {
        const pr = getSimplePR();
        pr.reviewers.push(
            TestUtils.voterToIdentityRef({
                id: "group2",
                required: false,
                vote: 0
            }));
        const subject = new PullRequestViewModel(pr, defaultRepository, defaultUser);
        expect(subject.requestedByMe).toEqual(false);
        expect(subject.assignedToMe).toEqual(false);
        expect(subject.assignedToMyTeam).toEqual(true);
    });

    it("sets hasMergeConflicts correctly", () => {
        const pr = getSimplePR();
        pr.mergeStatus = PullRequestAsyncStatus.Conflicts;
        const subject = new PullRequestViewModel(pr, defaultRepository, defaultUser);
        expect(subject.hasMergeConflicts).toEqual(true);
    });

    it("sorts required reviewers first", () => {
        const pr = getSimplePR();
        pr.reviewers = [
            TestUtils.voterToIdentityRef({
                id: "non_req1",
                required: false,
                vote: 0
            }),
            TestUtils.voterToIdentityRef({
                id: "req1",
                required: true,
                vote: 0
            }),
            TestUtils.voterToIdentityRef({
                id: "non_req2",
                required: false,
                vote: 0
            }),
            TestUtils.voterToIdentityRef({
                id: "req2",
                required: true,
                vote: 0
            })];
        const subject = new PullRequestViewModel(pr, defaultRepository, defaultUser);
        expect(subject.reviewers.length).toEqual(4);
        expect(subject.reviewers[0].id).toEqual("req1");
        expect(subject.reviewers[1].id).toEqual("req2");
        expect(subject.reviewers[2].id).toEqual("non_req1");
        expect(subject.reviewers[3].id).toEqual("non_req2");
    });
});
