import { Component, OnInit } from "@angular/core";

import { TfsService } from "./tfsservice";
import { PullRequest } from "./tfsmodel";

@Component({
    selector: "my-app",
    templateUrl: "app/app.component.html",
    providers: [TfsService]
})
export class AppComponent implements OnInit {
    constructor(private tfsService: TfsService) { }

    public pullRequests: PullRequest[] = [];

    async ngOnInit() {
        this.refresh();
    }

    async refresh() {
        this.pullRequests = [];
        let repos = await this.tfsService.getRepositories();
        let promises = new Array<Promise<PullRequest[]>>();
        for (let repo of repos) {
            promises.push(this.tfsService.getPullRequests(repo));
        }

        for (let p of promises) {
            let prs = await p;
            if (prs.length > 0) {
                this.pullRequests = this.pullRequests.concat(prs);
            }
        }
    }
}
