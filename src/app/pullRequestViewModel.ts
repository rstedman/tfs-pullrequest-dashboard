import { User, PullRequestAsyncStatus } from "./model";

export class PullRequestViewModel {
    constructor(public pullRequest: GitPullRequest, public repository: GitRepository, currentUser: User) {
        this.remoteUrl = `${repository.remoteUrl}/pullrequest/${pullRequest.pullRequestId}`;

        this.requestedByMe = pullRequest.createdBy.id === currentUser.id;

        let reviewers = pullRequest.reviewers || [];
        for (let reviewer of reviewers) {
            if (!this.assignedToMe)
                this.assignedToMe = reviewer.id === currentUser.id;
            for (let team of currentUser.memberOf) {
                if (!this.assignedToMyTeam)
                    this.assignedToMyTeam = team.id === reviewer.id;
            }
        }

        this.title = pullRequest.title;
        this.createdByImageUrl = pullRequest.createdBy.imageUrl;
        this.createdBy = pullRequest.createdBy.displayName;
        this.createdDate = pullRequest.creationDate;
        this.repositoryName = repository.name;
        this.sourceRefName = pullRequest.sourceRefName.replace("refs/heads/", "");
        this.targetRefName = pullRequest.targetRefName.replace("refs/heads/", "");
        this.hasMergeConflicts = pullRequest.mergeStatus == PullRequestAsyncStatus.Conflicts;
        this.reviewers = pullRequest.reviewers;
    }

    public remoteUrl: string;

    public requestedByMe: boolean;

    public assignedToMe: boolean;

    public assignedToMyTeam: boolean;

    public title: string;

    public createdByImageUrl: string;

    public createdBy: string;

    public createdDate: Date;

    public repositoryName: string;

    public sourceRefName: string;

    public targetRefName: string;

    public hasMergeConflicts: boolean;

    public reviewers: IdentityRefWithVote[];
}
