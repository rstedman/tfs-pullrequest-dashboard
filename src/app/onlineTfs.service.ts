import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import "rxjs/Rx";

import {Repository, Identity, PullRequest, Reviewer, AppConfig, TfsService} from "./tfsmodel";

import * as GitClientLib from "TFS/VersionControl/GitRestClient";
import  { PullRequestStatus, GitPullRequest, PullRequestAsyncStatus } from "TFS/VersionControl/Contracts";

@Injectable()
/**
 ** Uses the TFS GitHttpClient if running in tfs online.
 ** Need to use the TFS client as it's not possible to interact with the apis directly due to CORS restrictions.
 **/
export class OnlineTfsService extends TfsService {
    private client: GitClientLib.GitHttpClient2_3;

    private config: AppConfig;

    private USER_HEADER_NAME: string  = "x-vss-userdata";

    private baseUri: string;

    public setConfig(config:AppConfig){
        this.config = config;
    }

    public getCurrentUser(): Promise<Identity> {
        // just do a basic query to tfs to be able to look at response headers
        let user: Identity;
        let userId: string;

        return new Promise<Identity>((resolve, reject) => { resolve(this.config.user); });
    }

    public getPullRequests(repo: Repository): IPromise<PullRequest[]> {
        return this.client.getPullRequests(repo.id, {includeLinks: true, creatorId: null, repositoryId: repo.id, reviewerId: null, sourceRefName: null, status: PullRequestStatus.Active, targetRefName: null})
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
            });
    }

    private mergeStatusToString(status: PullRequestAsyncStatus): string {
        if (status == PullRequestAsyncStatus.Conflicts) {
            return "conflicts";
        }
        // don't really care about other statuses.  extension only does something if there's a conflict.
        return "ok";
    }

    public getRepositories(): IPromise<Repository[]> {
        return this.client.getRepositories(VSS.getWebContext().project.name, true)
            .then(repos => {
                let res = new Array<Repository>();
                for(let repo of repos) {
                    res.push(repo);
                }
                return res;
            });
    }
}
