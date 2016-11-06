import {PullRequestViewModel} from "../src/app/pullRequestViewModel";
import {User, PullRequestAsyncStatus} from "../src/app/model";

interface Voter {
    id: string;
    required: boolean;
    vote: number;
}

interface SimplePullRequest {
    id: number;
    mergeStatus: PullRequestAsyncStatus;
    createdById?: string;
    reviewers?: Voter[];
    created?: Date;
    sourceBranch?: string;
    targetBranch?: string;
    title?: string;
}

describe("PullRequestViewModel", () => {

    let defaultUser: User = {
        id: "123",
        displayName: "test user",
        uniqueName: "testuser1",
        memberOf: [
            createIdentity("group1"),
            createIdentity("group2")
        ]
    };

    let defaultRepository: GitRepository = {
        _links: null,
        defaultBranch: "master",
        url: "http://git/repo1",
        id: "repo1",
        name: "repo1",
        project: null,
        remoteUrl: "http://git/repo1"
    };

    function createIdentity(id: string): Identity {
        return {
            customDisplayName: id,
            descriptor: null,
            id: id,
            isActive: true,
            isContainer: true,
            masterId: id,
            memberIds: [],
            memberOf: [],
            members: [],
            metaTypeId: 0,
            properties: null,
            providerDisplayName: id,
            resourceVersion: null,
            uniqueUserId: 0
        };
    }

    function voterToIdentityRef(voter: Voter): IdentityRefWithVote {
        let result: IdentityRefWithVote = {
            displayName: voter.id,
            id: voter.id,
            imageUrl: null,
            isAadIdentity: false,
            isContainer: false,
            profileUrl: null,
            uniqueName: null,
            url: null,
            isRequired: voter.required,
            reviewerUrl: null,
            vote: voter.vote,
            votedFor: []
        };
        return result;
    }

    function createPullRequest(details: SimplePullRequest): GitPullRequest {
        let result: GitPullRequest = {
            _links: null,
            pullRequestId: details.id,
            autoCompleteSetBy: null,
            closedBy: null,
            closedDate: null,
            codeReviewId: 0,
            commits: [],
            completionOptions: null,
            completionQueueTime: null,
            createdBy: {
                displayName: details.createdById,
                id: details.createdById,
                url: null,
                imageUrl: null,
                isAadIdentity: false,
                isContainer: false,
                profileUrl: null,
                uniqueName: details.createdById
            },
            creationDate: details.created,
            description: details.title,
            lastMergeCommit: null,
            lastMergeSourceCommit: null,
            lastMergeTargetCommit: null,
            mergeId: null,
            status: 1,
            supportsIterations: true,
            targetRefName: details.targetBranch,
            sourceRefName: details.sourceBranch,
            title: details.title,
            url: null,
            workItemRefs: [],
            remoteUrl: null,
            repository: null,
            mergeStatus: details.mergeStatus,
            reviewers: details.reviewers.map(voterToIdentityRef)
        };
        return result;
    }

    it("Initializes Simple Properties", () => {
        let pr = createPullRequest({
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

        let subject = new PullRequestViewModel(pr, defaultRepository, defaultUser);
        expect(subject.reviewers.length).toEqual(pr.reviewers.length);
        expect(subject.createdBy).toEqual(pr.createdBy.displayName);
        expect(subject.createdDate).toEqual(pr.creationDate);
        expect(subject.repositoryName).toEqual(defaultRepository.name);
        expect(subject.sourceRefName).toEqual(pr.sourceRefName);
        expect(subject.targetRefName).toEqual(pr.targetRefName);
    });
});
