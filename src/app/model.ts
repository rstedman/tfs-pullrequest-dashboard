// not sure why, but get compilation errors if there are no imports.
/* tslint:disable */
import {OpaqueToken} from "@angular/core";
/* tslint:enable */

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
    public abstract getRepositories(): Promise<GitRepository[]>;
}

export abstract class StorageService {
    public abstract getValue(key: string): Promise<string>;
    public abstract setValue(key: string, value: string): Promise<string>;
}
