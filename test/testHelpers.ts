import {PullRequestAsyncStatus} from "../src/app/model";

export interface Voter {
    id: string;
    required: boolean;
    vote: number;
}

export interface SimplePullRequest {
    id: number;
    mergeStatus: PullRequestAsyncStatus;
    createdById?: string;
    reviewers?: Voter[];
    created?: Date;
    sourceBranch?: string;
    targetBranch?: string;
    title?: string;
    repo?: string;
    project?: string;
}

export class TestUtils {
    public static createIdentity(id: string): Identity {
        return {
            customDisplayName: id,
            descriptor: null,
            id,
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

    public static voterToIdentityRef(voter: Voter): IdentityRefWithVote {
        const result: IdentityRefWithVote = {
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

    public static createPullRequest(details: SimplePullRequest): GitPullRequest {
        const result: GitPullRequest = {
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
                url: `http://images/${details.createdById}`,
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
            repository: {
                _links: null,
                defaultBranch: null,
                id: details.repo,
                name: details.repo,
                remoteUrl: null,
                url: null,
                project: {
                    id: details.project,
                    name : details.project
                }
            },
            mergeStatus: details.mergeStatus,
            reviewers: details.reviewers.map(TestUtils.voterToIdentityRef)
        };
        return result;
    }

    public static createRepository(name: string, project = "Test"): GitRepository {
        return {
            _links: null,
            defaultBranch: "master",
            url: `http://git/${name}`,
            id: name,
            name,
            project: {
                name: project,
                id: project
            },
            remoteUrl: `http://git/${name}`
        };
    }
}
