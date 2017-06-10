import { Component, OnInit } from "@angular/core";
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from "angular-2-dropdown-multiselect";

import { StorageService, TfsService, User } from "./model";
import { PullRequestViewModel } from "./pullRequestViewModel";
import { StorageServiceProvider } from "./storageService.provider";
import { TfsServiceProvider } from "./tfsService.provider";

@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
    providers: [new TfsServiceProvider(), new StorageServiceProvider()]
})
export class AppComponent implements OnInit {

    // settings key for the list of repositories that the user has unselected from the other section
    private static repoFilterKey = "repoFilter";
    // settings key for the datetime format the user wants dates to display in
    private static dateFormatKey = "dateFormat";

    private static defaultDateFormat = "dd/MM/yyyy HH:mm";

    public pullRequests: PullRequestViewModel[] = [];

    public repositories: GitRepository[] = [];

    public currentUser: User;

    public filterSettings: IMultiSelectSettings = {
        enableSearch: true,
        buttonClasses: "btn btn-default fa fa-filter",
        closeOnSelect: false,
        showCheckAll: true,
        showUncheckAll: true
    };

    public filterTexts: IMultiSelectTexts = {
        checkAll: "Select all",
        uncheckAll: "Unselect all",
        checked: "repos selected",
        checkedPlural: "repos selected",
        searchPlaceholder: "Search...",
        defaultTitle: "Select"
    };

    public filteredRepoIds: string[] = [];

    public unfilteredRepoSelections: number[] = [];

    public repoOptions: IMultiSelectOption[] = [];

    public dateFormat: string = AppComponent.defaultDateFormat;

    constructor(private tfsService: TfsService, private storage: StorageService) { }

    public ngOnInit() {
        this.refresh();
    }

    public async refresh() {
        const serializedFilter = await this.storage.getValue(AppComponent.repoFilterKey);
        if (serializedFilter && serializedFilter !== "") {
            this.filteredRepoIds = JSON.parse(serializedFilter);
        }
        const savedFormat = await this.storage.getValue(AppComponent.dateFormatKey);
        if (savedFormat && savedFormat !== "") {
            this.dateFormat = savedFormat;
        }
        this.currentUser = await this.tfsService.getCurrentUser();
        const repos = await this.tfsService.getRepositories();
        this.repositories = repos.sort((a, b) => {
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
                return 1;
            }
            if (a.name.toLowerCase() < b.name.toLowerCase()) {
                return -1;
            }
            return 0;
        });

        this.pullRequests = [];
        for (let i = 0; i < this.repositories.length; i++) {
            const repo = this.repositories[i];

            this.repoOptions.push({
                id: i,
                name: repo.name
            });

            if (this.filteredRepoIds.indexOf(repo.id) < 0) {
                this.unfilteredRepoSelections.push(i);
            }
            // use continuation instead of await here, as we don't want to block fetching of prs from other repos
            this.tfsService.getPullRequests(repo)
                .then((prs) => {
                    for (const pr of prs) {
                        this.pullRequests.push(new PullRequestViewModel(pr, repo, this.currentUser));
                    }
                });
        }
    }

    public onFilteredSelectionsChanged(unfiltered: number[]) {
        this.filteredRepoIds = [];
        for (const repoOption of this.repoOptions) {
            if (unfiltered.indexOf(repoOption.id) < 0) {
                const repo = this.getRepoByName(repoOption.name);
                this.filteredRepoIds.push(repo.id);
            }
        }

        this.storage.setValue(AppComponent.repoFilterKey, JSON.stringify(this.filteredRepoIds));
    }

    public onDateFormatChanged(format: string) {
        this.dateFormat = format;
        this.storage.setValue(AppComponent.dateFormatKey, format);
    }

    public getVoteClasses(reviewer: IdentityRefWithVote): string {
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

    private getRepoByName(name: string): GitRepository {
        for (const repo of this.repositories) {
            if (repo.name === name) {
                return repo;
            }
        }
    }
}
