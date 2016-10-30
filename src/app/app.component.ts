import { Component, OnInit, Provider } from "@angular/core";

import { PullRequest, Repository, Identity, Reviewer, TfsService, StorageService } from "./model";
import { PullRequestViewModel } from "./pullRequestViewModel";
import { TfsServiceProvider } from "./tfsService.provider";
import { StorageServiceProvider } from "./storageService.provider";

import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from "./multiselect-dropdown";

@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
    providers: [new TfsServiceProvider(), new StorageServiceProvider()]
})
export class AppComponent implements OnInit {

    private static repoFilterKey = "repoFilter";

    constructor(private tfsService: TfsService, private storage: StorageService) { }

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
        this.storage.getValue(AppComponent.repoFilterKey)
            .then(x => {
                if(x && x !== "") {
                    this.filteredRepoIds = JSON.parse(x);
                }
            })
            .then(() => this.refresh());
    }

    async refresh() {
        let serializedFilter = await this.storage.getValue(AppComponent.repoFilterKey);
        this.currentUser = await this.tfsService.getCurrentUser();
        let repos = await this.tfsService.getRepositories();
        this.repositories = repos.sort((a,b) => {
            if(a.name.toLowerCase() > b.name.toLowerCase())
                return 1;
            if(a.name.toLowerCase() < b.name.toLowerCase())
                return -1;
            return 0;
        });

        this.pullRequests = [];
        for(let i=0; i < this.repositories.length; i++) {
            let repo = this.repositories[i];

            this.repoOptions.push({
                id: i,
                name: repo.name
            });

            if (this.filteredRepoIds.indexOf(repo.id) < 0) {
                this.unfilteredRepoSelections.push(i);
            }
            // use continuation instead of await here, as we don't want to block fetching of prs from other repos
            this.tfsService.getPullRequests(repo)
                .then(prs => {
                    for (let pr of prs) {
                        this.pullRequests.push(new PullRequestViewModel(pr, repo, this.currentUser));
                    }
                });
        }
    }

    public onFilteredSelectionsChanged(unfiltered: number[]) {
        this.filteredRepoIds = [];
        for(let repoOption of this.repoOptions) {
            if (unfiltered.indexOf(repoOption.id) < 0) {
                let repo = this.getRepoByName(repoOption.name);
                this.filteredRepoIds.push(repo.id);
            }
        }

        this.storage.setValue(AppComponent.repoFilterKey, JSON.stringify(this.filteredRepoIds));
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
