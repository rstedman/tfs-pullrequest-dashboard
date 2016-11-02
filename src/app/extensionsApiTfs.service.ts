import {Injectable, NgZone} from "@angular/core";
import {Http, Response} from "@angular/http";
import "rxjs/Rx";

import {AppConfig, TfsService, User} from "./model";

/**
 ** TfsService implementation which uses the VSS extension apis for fetching data
 **/
@Injectable()
export class ExtensionsApiTfsService extends TfsService {

    private isOnline: boolean;

    constructor(private gitClient: GitClient, private identitiesClient: IdentitiesClient, private zone: NgZone) {
        super();

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

        let membersOf = await this.getMembersOf(user.id);
        let promises: Promise<Identity[]>[] = [];
        for (let m of membersOf) {
            user.memberOf.push(m);
            // now recurse once into the subgroups of each group the member is a member of, to include
            // virtual groups made up of several groups
            promises.push(this.getMembersOf(m.id));
        }
        let subMembersOf = await Promise.all<Identity[]>(promises);
        for (let members of subMembersOf) {
            for (let i of members) {
                user.memberOf.push(i);
            }
        }
        return new Promise<User>((resolve, reject) => {
            // use ngzone to bring promise callback back into the angular zone
            this.zone.run(() => resolve(user));
        });
    }

    private async getMembersOf(userId: string): Promise<Identity[]> {
        // get the identities that the current user is a member of
        let members = await this.identitiesClient.readMembersOf(userId);
        let promises: Promise<Identity>[] = [];
        for(let memberId of members) {
            // ignore any non-tfs identities
            if (!memberId.startsWith("Microsoft.TeamFoundation.Identity"))
                continue;

            promises.push(this.identitiesClient.readIdentity(memberId));
        }
        let identities = await Promise.all(promises);
        return identities;
    }

    public async getPullRequests(repo: GitRepository): Promise<GitPullRequest[]> {
        let prs = await this.gitClient.getPullRequests(repo.id, {
            includeLinks: true,
            creatorId: null,
            repositoryId: repo.id,
            reviewerId: null,
            sourceRefName: null,
            status: 1,
            targetRefName: null});
        return new Promise<GitPullRequest[]>((resolve, reject) => {
            // use ngzone to bring promise callback back into the angular zone
            this.zone.run(() => resolve(prs));
        })
    }

    public async getRepositories(): Promise<GitRepository[]> {
        let repos = await this.gitClient.getRepositories(VSS.getWebContext().project.name, true);
        return new Promise<GitRepository[]>((resolve, reject) => {
            // use ngzone to bring promise callback back into the angular zone
            this.zone.run(() => resolve(repos));
        })
    }
}
