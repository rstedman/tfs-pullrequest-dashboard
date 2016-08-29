import { Component, OnInit } from "@angular/core";

import { TfsService } from "./tfsservice";
import { PullRequest, Repository, Identity, Reviewer } from "./tfsmodel";
import { PullRequestViewModel } from "./pullRequestViewModel";

@Component({
    selector: "my-app",
    templateUrl: "app/app.component.html",
    providers: [TfsService]
})
export class AppComponent implements OnInit {
    constructor(private tfsService: TfsService) { }

    public pullRequests: PullRequestViewModel[] = [];

    public currentUser: Identity;

    async ngOnInit() {
        this.refresh();
    }

    async refresh() {
        this.currentUser = await this.tfsService.getCurrentUser();
        this.pullRequests = [];
        let repos = await this.tfsService.getRepositories();
        let repoPRSearch = [];
        for (let repo of repos) {
            repoPRSearch.push({
                repo: repo,
                promise: this.tfsService.getPullRequests(repo)
            });
        }

        for (let r of repoPRSearch) {
            let prs = await r.promise;
            for (let pr of prs) {
                this.pullRequests.push(new PullRequestViewModel(pr, r.repo, this.currentUser));
            }
        }
    }

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
