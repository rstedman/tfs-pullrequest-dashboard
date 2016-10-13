import { Component, OnInit, Provider } from "@angular/core";

import { PullRequest, Repository, Identity, Reviewer, TfsService } from "./tfsmodel";
import { PullRequestViewModel } from "./pullRequestViewModel";

import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from "./multiselect-dropdown";

import { TfsServiceProvider } from "./tfsService.provider";

@Component({
    selector: "my-app",
    templateUrl: "app/app.component.html",
    providers: [new TfsServiceProvider()]
})
export class AppComponent implements OnInit {
    constructor(private tfsService: TfsService) { }

    public pullRequests: PullRequestViewModel[] = [];

    public repositories: Repository[] = [];

    public currentUser: Identity;

    public filterSettings: IMultiSelectSettings = {
        enableSearch: true,
        buttonClasses: 'btn btn-default fa fa-filter',
        closeOnSelect: false,
        showCheckAll: true,
        showUncheckAll: true
    };

    public filterTexts: IMultiSelectTexts = {
        checkAll: 'Select all',
        uncheckAll: 'Unselect all',
        checked: 'repos selected',
        checkedPlural: 'repos selected',
        searchPlaceholder: 'Search...',
        defaultTitle: 'Select',
    }

    public filteredRepoIds: string[] = [];

    public unfilteredRepoSelections: number[] = [];

    public repoOptions: IMultiSelectOption[] = [];

    ngOnInit() {
        let filter = localStorage.getItem("filter");
        if(filter && filter !== "") {
            this.filteredRepoIds = JSON.parse(filter);
        }

        this.refresh();
    }

    refresh() {
        this.pullRequests = [];

        this.tfsService.getCurrentUser()
            .then((x) => {
                this.currentUser = x;
                return this.tfsService.getRepositories();
            })
            .then((repos: Repository[]) => {

                this.repositories = repos;

                for (let i=0; i < repos.length; i++) {
                    let repo = repos[i];

                    this.repoOptions.push({
                        id: i,
                        name: repo.name
                    });

                    if (this.filteredRepoIds.indexOf(repo.id) < 0) {
                        this.unfilteredRepoSelections.push(i);
                    }

                    this.tfsService.getPullRequests(repo)
                        .then(prs => {
                            for (let pr of prs) {
                                this.pullRequests.push(new PullRequestViewModel(pr, repo, this.currentUser));
                            }
                        });
                }
            });
    }

    public onFilteredSelectionsChanged(unfiltered: number[]) {
        this.filteredRepoIds = [];
        for(let repoOption of this.repoOptions) {
            if (unfiltered.indexOf(repoOption.id) < 0) {
                let repo = this.getRepoByName(repoOption.name);
                this.filteredRepoIds.push(repo.id);
            }
        }

        localStorage.setItem("filter", JSON.stringify(this.filteredRepoIds))
    }

    private getRepoByName(name: string): Repository {
        for (let repo of this.repositories) {
            if (repo.name === name) {
                return repo;
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
