import { PullRequest, Repository, Identity } from "./tfsModel";

export class PullRequestViewModel {
    constructor(public pullRequest: PullRequest, public repository: Repository, currentUser: Identity) {
        this.remoteUrl = `${repository.remoteUrl}/pullrequest/${pullRequest.pullRequestId}`;

        this.requestedByMe = pullRequest.createdBy.id === currentUser.Id;

        for (let reviewer of pullRequest.reviewers) {
            if (!this.assignedToMe)
                this.assignedToMe = reviewer.id === currentUser.Id;
            for (let team of currentUser.MembersOf) {
                if (!this.assignedToMyTeam)
                    this.assignedToMyTeam = team.Id === reviewer.id;
            }
        }
    }

    public remoteUrl: string;

    public requestedByMe: boolean;

    public assignedToMe: boolean;

    public assignedToMyTeam: boolean;
}
