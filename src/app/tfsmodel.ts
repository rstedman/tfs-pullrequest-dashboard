/** Represents a repository in tfs **/
export class Repository {
    /** The guid id of the repository **/
    public id: string;

    /** The name of the repository **/
    public name: string;

    /** The api url for the repository **/
    public url: string;

    /** The main page url for the repository **/
    public remoteUrl: string;
}

/** Represents an identity in tfs.  Can be a person or group **/
export class Identity {
    /** The guid id of the identity **/
    public id: string;

    /** The displayname of the identity **/
    public displayName: string;

    /** The unique name of the indenity **/
    public uniqueName: string;

    /** The url to the image representing the identity **/
    public imageUrl: string;
}

/** Represents a pull request in tfs **/
export class PullRequest {
    /** The repository that the pull request belongs to **/
    public repository: Repository;

    /** The numeric id of the pull request **/
    public pullRequestId: number;

    /** The status of the pull request **/
    public status: string;

    /** The identity that created the pull request **/
    public createdBy: Identity;

    /** The datetime that the pullrequest was created, as an ISO8601 string **/
    public creationDate: string;

    /** Title of the pull request **/
    public title: string;

    /** Full description of the pull request **/
    public description: string;

    /** Name of the source branch of the merge **/
    public sourceRefName: string;

    /** Name of the target branch of the merge **/
    public targetRefName: string;

    /** Status of the merge operation **/
    public mergeStatus: string;

    /** Guid Id of the merge **/
    public mergeId: string;
}

/** Represents a reviewer on a pull request **/
export class Reviewer extends Identity {
    /** numeric id representing how the reviewer has voted on the pull request **/
    public vote: number;

    /** Specifies if the given reviewer is required on the pull request **/
    public isRequired: boolean;

    /** Lists any other reviewers that voted on behalf of this viewer.  (Ex. team member voted when team was required) **/
    public votedFor: Reviewer[];
}
