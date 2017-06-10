import { Component, Input } from "@angular/core";

import { Vote } from "./model";
import { PullRequestViewModel } from "./pullRequestViewModel";

@Component({
    selector: "pull-request",
    templateUrl: "pullRequest.component.html",
})
export class PullRequestComponent {

    @Input()
    public pullRequest: PullRequestViewModel;

    @Input()
    public dateFormat: string;

    public getVoteClasses(reviewer: IdentityRefWithVote): string {
        let result = "fa vote";
        if (reviewer.vote === Vote.NoResponse) {
            result += " fa-minus-circle";
        } else if (reviewer.vote === Vote.Rejected) {
            result += " fa-times-circle rejected";
        } else if (reviewer.vote === Vote.Approved) {
            result += " fa-check-circle approved";
        } else if (reviewer.vote === Vote.ApprovedWithSuggestions) {
             result += " fa-check-circle-o approved";
        } else if (reviewer.vote === Vote.WaitingForAuthor) {
            result += " fa-minus-circle waiting";
        }
        return result;
    }

    public getVoteTooltip(reviewer: IdentityRefWithVote): string {
        if (reviewer.vote === Vote.NoResponse) {
            return "No Response";
        } else if (reviewer.vote === Vote.Rejected) {
            return "Rejected";
        } else if (reviewer.vote === Vote.Approved) {
            return "Approved";
        } else if (reviewer.vote === Vote.ApprovedWithSuggestions) {
             return "Approved With Suggestions";
        } else if (reviewer.vote === Vote.WaitingForAuthor) {
            return "Waiting for Author";
        }
    }
}
