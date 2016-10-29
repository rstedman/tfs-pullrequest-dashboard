import { PullRequest, Repository, Identity, Reviewer } from "./model";

export class PullRequestViewModel {
    constructor(public pullRequest: PullRequest, public repository: Repository, currentUser: Identity) {
        this.remoteUrl = `${repository.remoteUrl}/pullrequest/${pullRequest.pullRequestId}`;

        this.requestedByMe = pullRequest.createdBy.id === currentUser.Id;

        let reviewers = pullRequest.reviewers || [];
        for (let reviewer of reviewers) {
            if (!this.assignedToMe)
                this.assignedToMe = reviewer.id === currentUser.Id;
            for (let team of currentUser.MembersOf) {
                if (!this.assignedToMyTeam)
                    this.assignedToMyTeam = team.Id === reviewer.id;
            }
        }

        this.title = pullRequest.title;
        this.createdByImageUrl = pullRequest.createdBy.imageUrl;
        this.createdBy = pullRequest.createdBy.displayName;
        this.repositoryName = repository.name;
        this.sourceRefName = pullRequest.sourceRefName;
        this.targetRefName = pullRequest.targetRefName;
        this.mergeStatus = pullRequest.mergeStatus;
        this.reviewers = pullRequest.reviewers;
    }

    public remoteUrl: string;

    public requestedByMe: boolean;

    public assignedToMe: boolean;

    public assignedToMyTeam: boolean;

    public title: string;

    public createdByImageUrl: string;

    public createdBy: string;

    public repositoryName: string;

    public sourceRefName: string;

    public targetRefName: string;

    public mergeStatus: string;

    public reviewers: Reviewer[];

}
