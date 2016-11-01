import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import "rxjs/Rx";

import {AppConfig, TfsService, User} from "./model";

// can't reference these types without them attempting to import as modules, which will fail since the VSS.SDK does module resolution in a non-standard way
//import { GitHttpClient } from "TFS/VersionControl/GitRestClient";
//import { PullRequestStatus, GitPullRequest, PullRequestAsyncStatus } from "TFS/VersionControl/Contracts";

interface TfsClients {
    gitClient: GitClient;

    identityClient: IdentitiesClient;
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
            VSS.require(["TFS/VersionControl/GitRestClient", "VSS/Identities/RestClient"], (TFS_Git_WebApi: GitClientFactory, TFS_Identity_WebApi: IdentitiesClientFactory) => {
                resolve({
                    gitClient: TFS_Git_WebApi.getClient(),
                    identityClient: TFS_Identity_WebApi.getClient()
                });
            })
        });

        this.isOnline = (VSS.getWebContext().host.authority.indexOf("visualstudio.com") > 0);
    }

    public async getCurrentUser(): Promise<User> {
        let context = VSS.getWebContext();
        let user: User = {
            id: context.user.id,
            displayName: context.user.name,
            uniqueName: context.user.uniqueName,
            memberOf: []
        };
        // The identity apis aren't available in TFS online, only for on-prem versions.  If this is running as an extension in
        // visual studio online, we aren't able to return any group membership information for the current user.
        if(this.isOnline) {
            return user;
        }

        let identityClient = (await this.getClientsPromise).identityClient;
        let membersOf = await this.getMembersOf(identityClient, user.id);
        let promises: Promise<Identity[]>[] = [];
        for (let m of membersOf) {
            user.memberOf.push(m);
            // now recurse once into the subgroups of each group the member is a member of, to include
            // virtual groups made up of several groups
            promises.push(this.getMembersOf(identityClient, m.id));
        }
        let subMembersOf = await Promise.all<Identity[]>(promises);
        for (let members of subMembersOf) {
            for (let i of members) {
                user.memberOf.push(i);
            }
        }
        return user;
    }

    private async getMembersOf(identityClient: IdentitiesClient, userId: string): Promise<Identity[]> {
        // get the identities that the current user is a member of
        let members = await identityClient.readMembersOf(userId);
        let promises: Promise<Identity>[] = [];
        for(let memberId of members) {
            // ignore any non-tfs identities
            if (!memberId.startsWith("Microsoft.TeamFoundation.Identity"))
                continue;

            promises.push(identityClient.readIdentity(memberId));
        }
        let identities = await Promise.all(promises);
        return identities;
    }

    public async getPullRequests(repo: GitRepository): Promise<GitPullRequest[]> {
        let client = (await this.getClientsPromise).gitClient;
        let prs = await client.getPullRequests(repo.id, {includeLinks: true, creatorId: null, repositoryId: repo.id, reviewerId: null, sourceRefName: null, status: 1, targetRefName: null});
        return prs;
    }

    public async getRepositories(): Promise<GitRepository[]> {
        let client = (await this.getClientsPromise).gitClient;
        return await client.getRepositories(VSS.getWebContext().project.name, true);
    }
}
