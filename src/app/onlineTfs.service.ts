import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import "rxjs/Rx";

import {Repository, Identity, PullRequest, Reviewer, AppConfig, TfsService, Descriptor} from "./tfsmodel";

// can't reference these types without them attempting to import as modules, which will fail since the VSS.SDK does module resolution in a non-standard way
//import { GitHttpClient } from "TFS/VersionControl/GitRestClient";
//import { PullRequestStatus, GitPullRequest, PullRequestAsyncStatus } from "TFS/VersionControl/Contracts";

interface TfsClients {
    gitClient: any;

    identityClient: any;
}

/**
 ** Uses the TFS GitHttpClient if running in tfs online.
 ** Need to use the TFS client as it's not possible to interact with the apis directly due to CORS restrictions.
 **/
@Injectable()
export class OnlineTfsService extends TfsService {

    private getClientsPromise: Promise<TfsClients>;

    constructor(private config: AppConfig) {
        super();

        this.getClientsPromise = new Promise<TfsClients>((resolve,reject) => {
            VSS.require(["TFS/VersionControl/GitRestClient", "VSS/Identities/RestClient"], (TFS_Git_WebApi, TFS_Identity_WebApi) => {
                resolve({
                    gitClient: TFS_Git_WebApi.getClient(),
                    identityClient: TFS_Identity_WebApi.getClient()
                });
            })
        });
    }

    public getCurrentUser(): IPromise<Identity> {
        let context = VSS.getWebContext();
        let user: Identity = {
                Id: context.user.id,
                DisplayName: context.user.name,
                UniqueName: context.user.uniqueName,
                Descriptor: {
                    IdentityType: "user",
                    Identifier: context.user.id
                },
                ImageUrl: null,
                Members: [],
                MembersOf: []
            };
        return this.getClientsPromise
            .then(clients => clients.identityClient.readMembersOf(user.Id))
                .then((groups: any[]) => {
                    for(let group of groups) {
                        user.MembersOf.push({
                            Identifier: group.identifier,
                            IdentityType: group.identityType
                        });
                    }
                    return user;
                })
    }

    /*private getMembersOf(userId: string): IPromise<Identity[]> {
        // get the identities that the current user is a member of
        return this.http.get(`${this.baseUri}/_apis/Identities/${userId}/membersOf`, {withCredentials: true})
            .toPromise()
            .then(response => {
                let promises: Promise<Response>[] = [];
                let result: Identity[] = [];
                for (let userId of response.json()) {
                    // ignore any non-tfs identities
                    if (!userId.startsWith("Microsoft.TeamFoundation.Identity"))
                        continue;

                    promises.push(this.http.get(`${this.baseUri}/_apis/Identities/${userId}`, {withCredentials: true})
                                           .toPromise());
                }
                return Promise.all<Response>(promises);
            })
            .then( (responses: Response[]) => {
                let result: Identity[] = [];
                for (let response of responses) {
                    result.push(response.json());
                }
                return result;
            });
    }*/

    public getPullRequests(repo: Repository): IPromise<PullRequest[]> {
        return this.getClientsPromise
            .then(clients => clients.gitClient.getPullRequests(repo.id, {includeLinks: true, creatorId: null, repositoryId: repo.id, reviewerId: null, sourceRefName: null, status: 1, targetRefName: null})
                .then(prs => {
                    let res = new Array<PullRequest>();
                    for(let pr of prs) {
                        res.push({
                            pullRequestId: pr.pullRequestId,
                            createdBy: {
                                displayName: pr.createdBy.displayName,
                                id: pr.createdBy.id,
                                imageUrl: pr.createdBy.imageUrl,
                                uniqueName: pr.createdBy.uniqueName
                            },
                            creationDate: pr.creationDate,
                            repository: {
                                id: pr.repository.id,
                                name: pr.repository.name,
                                remoteUrl: pr.repository.remoteUrl,
                                url: pr.repository.url
                            },
                            description: pr.description,
                            mergeId: pr.mergeId,
                            mergeStatus: this.mergeStatusToString(pr.mergeStatus),
                            reviewers: pr.reviewers,
                            sourceRefName: pr.sourceRefName,
                            status: pr.status,
                            targetRefName: pr.targetRefName,
                            title: pr.title
                        })
                    }
                    return res;
                }));
    }

    private mergeStatusToString(status: number): string {
        if (status == 2) {
            return "conflicts";
        }
        // don't really care about other statuses.  extension only does something if there's a conflict.
        return "ok";
    }

    public getRepositories(): IPromise<Repository[]> {
        return this.getClientsPromise
            .then(clients => clients.gitClient.getRepositories(VSS.getWebContext().project.name, true)
                .then(repos => {
                    let res = new Array<Repository>();
                    for(let repo of repos) {
                        res.push(repo);
                    }
                    return res;
                }));
    }
}
