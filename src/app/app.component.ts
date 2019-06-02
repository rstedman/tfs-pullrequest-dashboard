import { Component, NgZone, OnInit } from "@angular/core";
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from "angular-2-dropdown-multiselect";

import { AppSettingsServiceProvider } from "./appSettingsService.provider";
import { AppSettingsService, Layout, TfsService, User } from "./model";
import { PullRequestViewModel } from "./pullRequestViewModel";
import { TfsServiceProvider } from "./tfsService.provider";

@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
    providers: [new TfsServiceProvider(), new AppSettingsServiceProvider()],
})
export class AppComponent implements OnInit {

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

    public layout: Layout;

    public hubUri: string = "#";

    public rowLimit: number = 0;

    constructor(private tfsService: TfsService,
                private settings: AppSettingsService,
                private zone: NgZone) {

        this.settings.layoutChanged().on((data) => this.updateLayout(data));
        this.hubUri = this.settings.getHubUri();
    }

    public ngOnInit() {
        this.refresh();
    }

    public async refresh() {
        this.loading = true;
        try {
            this.updateLayout(this.settings.getLayout());
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
            const getReposPromise = this.tfsService.getRepositories(this.allProjects);

            const repos = await getReposPromise;
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

            this.tfsService.getPullRequests(this.allProjects)
                .map((pr) => new PullRequestViewModel(pr, repoById[pr.repository.id], this.currentUser))
                .subscribe((pr) => this.zone.run(() => this.pullRequests.push(pr)));

            this.repoOptions = [];
            this.unfilteredRepoSelections.length = 0;
            const repoById: Map<string, GitRepository> = new Map<string, GitRepository>();
            for (let i = 0; i < this.repositories.length; i++) {
                const repo = this.repositories[i];
                repoById[repo.id] = repo;

                this.repoOptions.push({
                    id: i,
                    name: repo.name
                });

                if (this.filteredRepoIds.indexOf(repo.id) < 0) {
                    this.unfilteredRepoSelections.push(i);
                }
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

    private updateLayout(layout: Layout) {
        this.layout = layout;
        if (layout.widgetMode && layout.size) {
            // trial & error - this allows the most PRs to be displayed while fitting nicely in the available
            //                 widget space
            this.rowLimit = (layout.size.rowSpan * 3) + (layout.size.rowSpan - 2);
        }
    }
}
