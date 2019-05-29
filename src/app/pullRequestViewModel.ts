import { PullRequestAsyncStatus, User } from "./model";

export class PullRequestViewModel {

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

    public isDraft: boolean = false;

    public autoComplete: boolean = false;

    public reviewers: IdentityRefWithVote[];

    constructor(public pullRequest: GitPullRequest, public repository: GitRepository, currentUser: User) {
        this.remoteUrl = `${repository._links.web.href}/pullrequest/${pullRequest.pullRequestId}`;

        this.requestedByMe = pullRequest.createdBy.id === currentUser.id;

        const reviewers = pullRequest.reviewers || [];
        for (const reviewer of reviewers) {
            if (!this.assignedToMe) {
                this.assignedToMe = reviewer.id === currentUser.id;
            }
            for (const team of currentUser.memberOf) {
                if (!this.assignedToMyTeam) {
                    this.assignedToMyTeam = team.id === reviewer.id;
                }
            }
        }

        this.title = pullRequest.title;
        this.createdByImageUrl = pullRequest.createdBy.imageUrl;
        this.createdBy = pullRequest.createdBy.displayName;
        this.createdDate = pullRequest.creationDate;
        this.repositoryName = repository.name;
        this.sourceRefName = pullRequest.sourceRefName.replace("refs/heads/", "");
        this.targetRefName = pullRequest.targetRefName.replace("refs/heads/", "");
        this.hasMergeConflicts = pullRequest.mergeStatus === PullRequestAsyncStatus.Conflicts;
        this.reviewers = reviewers.sort((a: IdentityRefWithVote, b: IdentityRefWithVote) => {
                if (a.isRequired && !b.isRequired) {
                    return -1;
                }
                if (!a.isRequired && b.isRequired) {
                    return 1;
                }
                return 0;
            });

        if (pullRequest.isDraft) {
            this.isDraft = true;
        }
        if (pullRequest.autoCompleteSetBy) {
            this.autoComplete = true;
        }
    }
}
