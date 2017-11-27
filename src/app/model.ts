import {NgZone} from "@angular/core";

// source: https://stackoverflow.com/a/14657922
export interface ILiteEvent<T> {
    on(handler: (data?: T) => void): void;
    off(handler: (data?: T) => void): void;
}

export class LiteEvent<T> implements ILiteEvent<T> {
    private handlers: Array<(data?: T) => void> = [];

    public on(handler: (data?: T) => void): void {
        this.handlers.push(handler);
    }

    public off(handler: (data?: T) => void): void {
        this.handlers = this.handlers.filter( (h) => h !== handler);
    }

    public trigger(data?: T) {
        this.handlers.slice(0).forEach( (h) => h(data));
    }

    public expose(): ILiteEvent<T> {
        return this;
    }
}

// Represents an user in tfs. Extends the identity model to include the identity
// info for membersOf
export interface User {
    // The guid id of the identity
    id: string;

    // The displayname of the identity
    displayName: string;

    // The unique name of the indenity
    uniqueName: string;

    // other identities this identity is a member of
    memberOf: Identity[];
}

export enum Vote {
    Approved = 10,
    ApprovedWithSuggestions = 5,
    NoResponse = 0,
    Rejected = -10,
    WaitingForAuthor = -5
}

export enum PullRequestAsyncStatus {
    NotSet = 0,
    Queued = 1,
    Conflicts = 2,
    Succeeded = 3,
    RejectedByPolicy = 4,
    Failure = 5,
}

export abstract class TfsService {
    public abstract getCurrentUser(): Promise<User>;
    public abstract getPullRequests(repo: GitRepository): Promise<GitPullRequest[]>;
    public abstract getRepositories(allProjects?: boolean): Promise<GitRepository[]>;
}

export abstract class AppSettingsService {
    // settings key for the list of repositories that the user has unselected from the other section
    public static repoFilterKey = "repoFilter";
    // settings key for the datetime format the user wants dates to display in
    public static dateFormatKey = "dateFormat";
    // settings key for showing PRs across all projects instead of just the current
    public static allProjectsKey = "allProjects";

    public static defaultDateFormat = "dd/MM/yyyy HH:mm";

    private onCategoryChanged = new LiteEvent<string>();

    constructor(private isWidgetContext: boolean,
                private widgetCategory: string,
                protected zone: NgZone) {
    }

    public async getRepoFilter(): Promise<string[]> {
        const filterStr = await this.getValue(AppSettingsService.repoFilterKey);
        if (filterStr) {
            return JSON.parse(filterStr);
        }
        return [];
    }

    public async setRepoFilter(value: string[]): Promise<void> {
        await this.setValue(AppSettingsService.repoFilterKey, JSON.stringify(value));
    }

    public async getDateFormat(): Promise<string> {
        const savedFormat = await this.getValue(AppSettingsService.dateFormatKey);
        if (savedFormat && savedFormat !== "") {
            return savedFormat;
        }
        return AppSettingsService.defaultDateFormat;
    }

    public async setDateFormat(value: string): Promise<void> {
        await this.setValue(AppSettingsService.dateFormatKey, value);
    }

    public async getShowAllProjects(): Promise<boolean> {
        const savedAllProjects = await this.getValue(AppSettingsService.allProjectsKey);
        if (savedAllProjects === "true") {
            return true;
        }
        return false;
    }

    public async setShowAllProjects(value: boolean): Promise<void> {
        await this.setValue(AppSettingsService.allProjectsKey, value.toString());
    }

    public getIsWidgetContext(): boolean {
        return this.isWidgetContext;
    }

    public getWidgetFilterCategory(): string {
        return this.widgetCategory;
    }

    public setWidgetFilterCategory(category: string) {
        this.widgetCategory = category;
        this.zone.run(() => this.onCategoryChanged.trigger(category));
    }

    public categoryChanged() {
        return this.onCategoryChanged.expose();
    }

    protected abstract getValue(key: string): Promise<string>;
    protected abstract setValue(key: string, value: string): Promise<string>;
}
