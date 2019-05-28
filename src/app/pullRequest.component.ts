import { Component, Input } from "@angular/core";

import { Vote } from "./model";
import { PullRequestViewModel } from "./pullRequestViewModel";

interface Tag {
    name: string;
    description: string;
    class: string;
}

@Component({
    selector: "pull-request",
    templateUrl: "pullRequest.component.html",
})
export class PullRequestComponent {

    @Input()
    public pullRequest: PullRequestViewModel;

    @Input()
    public dateFormat: string;

    @Input()
    public compactMode: boolean;

    public getVoteClasses(vote: number): string {
        let result = "fa vote";
        if (vote === Vote.NoResponse) {
            result += " fa-minus-circle";
        } else if (vote === Vote.Rejected) {
            result += " fa-times-circle rejected";
        } else if (vote === Vote.Approved) {
            result += " fa-check-circle approved";
        } else if (vote === Vote.ApprovedWithSuggestions) {
             result += " fa-check-circle-o approved";
        } else if (vote === Vote.WaitingForAuthor) {
            result += " fa-minus-circle waiting";
        }
        return result;
    }

    public getVoteTooltip(vote: number): string {
        if (vote === Vote.NoResponse) {
            return "No Response";
        } else if (vote === Vote.Rejected) {
            return "Rejected";
        } else if (vote === Vote.Approved) {
            return "Approved";
        } else if (vote === Vote.ApprovedWithSuggestions) {
             return "Approved With Suggestions";
        } else if (vote === Vote.WaitingForAuthor) {
            return "Waiting for Author";
        }
    }

    public getVoteGroups() {
        const groups = {};
        for (const r of this.pullRequest.reviewers) {
            if (groups[r.vote]) {
                groups[r.vote].push(r);
            } else {
                groups[r.vote] = [r];
            }
        }

        const result = [];
        for (const key of Object.keys(groups)) {
            let tooltip = this.getVoteTooltip(Number(key)) + ": ";
            let i = 0;
            for (const r of groups[key]) {
                if (i > 0) {
                    tooltip += ", ";
                }
                tooltip += r.displayName;
                i++;
            }
            result.push({
                vote: Number(key),
                count: groups[key].length,
                tooltip
            });
        }

        return result;
    }

    public getTags(): Tag[] {
        const tags = new Array<Tag>();
        if (this.pullRequest.isDraft) {
            tags.push({
                name: "Draft",
                description: "Pull request is in a draft state",
                class: "draft"
            });
        }
        if (this.pullRequest.hasMergeConflicts) {
            tags.push({
                name: "Conflicts",
                description: "Conflicts exist between the source and target branch",
                class: "conflicts"
            });
        }

        return tags;
    }
}
