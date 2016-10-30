import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import "rxjs/Rx";

import {Repository, Identity, PullRequest, Reviewer, AppConfig, TfsService, Descriptor} from "./model";

// can't reference these types without them attempting to import as modules, which will fail since the VSS.SDK does module resolution in a non-standard way
//import { GitHttpClient } from "TFS/VersionControl/GitRestClient";
//import { PullRequestStatus, GitPullRequest, PullRequestAsyncStatus } from "TFS/VersionControl/Contracts";

interface TfsClients {
    gitClient: any;

    identityClient: any;
}

/**
 ** TfsService implementation which uses the VSS extension apis for fetching data
 **/
@Injectable()
export class ExtensionsApiTfsService extends TfsService {

    private getClientsPromise: Promise<TfsClients>;
    private isOnline: boolean;

    constructor() {
        super();

        this.getClientsPromise = new Promise<TfsClients>((resolve,reject) => {
            VSS.require(["TFS/VersionControl/GitRestClient", "VSS/Identities/RestClient"], (TFS_Git_WebApi, TFS_Identity_WebApi) => {
                resolve({
                    gitClient: TFS_Git_WebApi.getClient(),
                    identityClient: TFS_Identity_WebApi.getClient()
                });
            })
        });

        this.isOnline = (VSS.getWebContext().host.authority.indexOf("visualstudio.com") > 0);
    }

    public getCurrentUser(): Promise<Identity> {
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
        // The identity apis aren't available in TFS online, only for on-prem versions.  If this is running as an extension in
        // visual studio online, we aren't able to return any group membership information for the current user.
        if(this.isOnline) {
            return new Promise<Identity>((resolve, reject) => resolve(user));
        }

        let identityClient: any = null;
        return this.getClientsPromise
            .then(clients => {
                identityClient = clients.identityClient;
                return this.getMembersOf(identityClient, user.Id)
                    .then((membersOf: Identity[]) => {
                        let promises: Promise<Identity[]>[] = [];
                        for (let m of membersOf) {
                            user.MembersOf.push(m);
                            // now recurse once into the subgroups of each group the member is a member of, to include
                            // virtual groups made up of several groups
                            promises.push(this.getMembersOf(identityClient, m.Id));
                        }
                        return Promise.all<Identity[]>(promises);
                    })
                    .then((membersOf: Identity[][]) => {
                        for (let members of membersOf) {
                            for (let i of members) {
                                user.MembersOf.push(i);
                            }
                        }
                        return user;
                    })
                });

    }

    private getMembersOf(identityClient: any, userId: string): Promise<Identity[]> {
        // get the identities that the current user is a member of
        return identityClient.readMembersOf(userId)
                .then((members: any[]) => {
                    let promises: Promise<Identity[]>[] = [];
                    for(let memberId of members) {

                        // ignore any non-tfs identities
                        if (!memberId.startsWith("Microsoft.TeamFoundation.Identity"))
                            continue;

                        promises.push(identityClient.readIdentity(memberId));
                    }
                    return Promise.all<any[]>(promises);
                })
                .then((identities: any[]) => {
                    let result :Identity[] = [];
                    for(let identity of identities) {
                        let model: Identity = {
                            Id: identity.id,
                            DisplayName: identity.customDisplayName,
                            UniqueName: identity.providerDisplayName,
                            Descriptor: {
                                IdentityType: "user",
                                Identifier: identity.id
                            },
                            ImageUrl: null,
                            Members: [],
                            MembersOf: []
                        };
                        result.push(model)
                    }
                    return result;
                });
    }

    public getPullRequests(repo: Repository): Promise<PullRequest[]> {
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

    public getRepositories(): Promise<Repository[]> {
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
