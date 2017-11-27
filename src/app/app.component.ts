import { Component, OnInit } from "@angular/core";
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from "angular-2-dropdown-multiselect";

import { AppConfigService } from "./appConfig.service";
import { AppSettingsServiceProvider } from "./appSettingsService.provider";
import { AppSettingsService, TfsService, User } from "./model";
import { PullRequestViewModel } from "./pullRequestViewModel";
import { TfsServiceProvider } from "./tfsService.provider";

@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
    providers: [new TfsServiceProvider(), new AppSettingsServiceProvider()],
})
export class AppComponent implements OnInit {

    // settings key for the list of repositories that the user has unselected from the other section
    private static repoFilterKey = "repoFilter";
    // settings key for the datetime format the user wants dates to display in
    private static dateFormatKey = "dateFormat";
    // settings key for showing PRs across all projects instead of just the current
    private static allProjectsKey = "allProjects";

    private static defaultDateFormat = "dd/MM/yyyy HH:mm";

    public pullRequests: PullRequestViewModel[] = [];

    public repositories: GitRepository[] = [];

    public currentUser: User;

    public filterSettings: IMultiSelectSettings = {
        enableSearch: true,
        buttonClasses: "btn btn-default btn-sm fa fa-filter",
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

    public allProjects: boolean = false;

    public loading: boolean = false;

    public widgetMode: boolean = false;

    public widgetCategory: string = "assignedToMe";

    constructor(private tfsService: TfsService, private settings: AppSettingsService) {
        this.settings.categoryChanged().on((data) => this.widgetCategory = data);
    }

    public ngOnInit() {
        this.refresh();
    }

    public async refresh() {
        this.loading = true;
        try {
            this.widgetMode = this.settings.getIsWidgetContext();
            this.widgetCategory = this.settings.getWidgetFilterCategory();
            const filterPromise = this.settings.getRepoFilter();
            const formatPromise = this.settings.getDateFormat();
            const allProjectsPromise = this.settings.getShowAllProjects();
            const currentUserPromise = this.tfsService.getCurrentUser();

            this.filteredRepoIds = await filterPromise;
            this.dateFormat = await formatPromise;
            this.allProjects = await allProjectsPromise;
            this.currentUser = await currentUserPromise;
            await this.reloadPullRequests();
        } finally {
            this.loading = false;
        }
    }

    public async reloadPullRequests(): Promise<void> {
        this.loading = true;
        try {
            const repos = await this.tfsService.getRepositories(this.allProjects);
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
            this.repoOptions = [];
            this.unfilteredRepoSelections.length = 0;
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
        } finally {
            this.loading = false;
        }
    }

    public onFilteredSelectionsChanged(unfiltered: number[]) {
        if (this.loading) {
            return;
        }

        this.filteredRepoIds = [];
        for (const repoOption of this.repoOptions) {
            if (unfiltered.indexOf(repoOption.id) < 0) {
                const repo = this.getRepoByName(repoOption.name);
                this.filteredRepoIds.push(repo.id);
            }
        }
        this.settings.setRepoFilter(this.filteredRepoIds);
    }

    public onDateFormatChanged(format: string) {
        if (this.loading) {
            return;
        }

        this.dateFormat = format;
        this.settings.setDateFormat(format);
    }

    public onAllProjectsChanged(allProjects: boolean) {
        if (this.loading) {
            return;
        }

        this.allProjects = allProjects;
        this.settings.setShowAllProjects(allProjects);
        this.reloadPullRequests();
    }

    private getRepoByName(name: string): GitRepository {
        for (const repo of this.repositories) {
            if (repo.name === name) {
                return repo;
            }
        }
    }
}
