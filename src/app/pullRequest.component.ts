import { Component, Input } from "@angular/core";

import { TfsService } from "./tfsservice";
import { PullRequest, Repository, Identity, Reviewer } from "./tfsmodel";
import { PullRequestViewModel } from "./pullRequestViewModel";

@Component({
    selector: "pull-request",
    templateUrl: "app/pullRequest.component.html",
})
export class PullRequestComponent {

    @Input()
    public pullRequest: PullRequest;

    public getVoteClasses(reviewer: Reviewer): string {
        let result = "fa vote";
        if (reviewer.vote === 0) {
            result += " fa-minus-circle";
        } else if (reviewer.vote === -10) {
            result += " fa-times-circle rejected";
        } else if (reviewer.vote === 10 || reviewer.vote === 5) {
            result += " fa-check-circle approved";
        } else if (reviewer.vote === -5) {
            result += " fa-minus-circle waiting";
        }
        return result;
    }
}
