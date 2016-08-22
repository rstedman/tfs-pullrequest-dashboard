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

    ngOnInit(): void {
        this.tfsService.getPullRequests()
            .then(x => {this.pullRequests = x; });
    }
}
