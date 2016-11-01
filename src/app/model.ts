/**
    Represents an user in tfs. Extends the identity model to include the identity
    info for membersOf
**/
export interface User {
    /** The guid id of the identity **/
    id: string;

    /** The displayname of the identity **/
    displayName: string;

    /** The unique name of the indenity **/
    uniqueName: string;

    /** other identities this identity is a member of **/
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

export class AppConfig {
    public devMode: boolean = false;
    public apiEndpoint: string = "";
}

export abstract class TfsService {
    abstract getCurrentUser(): Promise<User>;
    abstract getPullRequests(repo: GitRepository): Promise<GitPullRequest[]>;
    abstract getRepositories(): Promise<GitRepository[]>;
}

export abstract class StorageService {
    abstract getValue(key: string): Promise<string>;
    abstract setValue(key: string, value: string): Promise<string>;
}
