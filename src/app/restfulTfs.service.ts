import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import "rxjs/Rx";

import {Repository, PullRequest, Reviewer, AppConfig, TfsService, User} from "./model";

@Injectable()
/** Interacts with TFS REST APis.  Meant for use when not running in the context of a TFS extension (ie. development) **/
export class RestfulTfsService extends TfsService {
    constructor(private http: Http, config: AppConfig) {
        super();

        this.baseUri = config.apiEndpoint;
    }

    private USER_HEADER_NAME: string  = "x-vss-userdata";
    // need to specify the version to get the response objects to look the same as when requested using the VSS Extension APIs
    private IDENTITIES_API_ACCEPT_HEADER: string = "application/json; api-version=2.3-preview.1";

    private baseUri: string;

    public async getCurrentUser(): Promise<User> {
        // just do a basic query to tfs to be able to look at response headers
        let r = await this.http.get(`${this.baseUri}/_apis/projects`, {withCredentials: true}).toPromise();
        // aren't actually interested in the projects response body, just the response headers.
        // tfs adds a header in the response with the current authenticated users id in the format <userid>:<username>
        let userIdHeader = r.headers.get(this.USER_HEADER_NAME);
        let headerRegex = /([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})/i;
        let match = headerRegex.exec(userIdHeader);
        let userId = match[1];

        r = await this.http.get(`${this.baseUri}/_apis/Identities/${userId}`, {
            withCredentials: true,
            headers: new Headers({"Accept": this.IDENTITIES_API_ACCEPT_HEADER})
        }).toPromise();
        let userIdentity: Identity = r.json();
        let user: User = {
            id: userIdentity.id,
            displayName: userIdentity.customDisplayName,
            uniqueName: userIdentity.providerDisplayName,
            memberOf: []
        };

        let membersOf = await this.getMembersOf(userId);
        let promises: Promise<Identity[]>[] = [];
        for (let m of membersOf) {
            user.memberOf.push(m);
            // now recurse once into the subgroups of each group the member is a member of, to include
            // virtual groups made up of several groups
            promises.push(this.getMembersOf(m.id));
        }
        let subMembersOf = await Promise.all(promises);
        for (let members of subMembersOf) {
            for (let i of members) {
                user.memberOf.push(i);
            }
        }

        return user;
    }

    private async getMembersOf(userId: string): Promise<Identity[]> {
        let response = await (this.http.get(`${this.baseUri}/_apis/Identities/${userId}/membersOf`, {
            withCredentials: true,
            headers: new Headers({"Accept": this.IDENTITIES_API_ACCEPT_HEADER})
        }).toPromise());
        let promises: Promise<Response>[] = [];
        let result: Identity[] = [];
        let memberOfIds: string[] = this.extractData(response);
        for (let memberId of memberOfIds) {
            // ignore any non-tfs identities
            if (!memberId.startsWith("Microsoft.TeamFoundation.Identity"))
                continue;

            promises.push(this.http.get(`${this.baseUri}/_apis/Identities/${memberId}`, {
                withCredentials: true,
                headers: new Headers({"Accept": this.IDENTITIES_API_ACCEPT_HEADER})
            }).toPromise());
        }

        let responses = await Promise.all(promises);
        for (let response of responses) {
            result.push(response.json());
        }
        return result;
    }

    public getPullRequests(repo: Repository): Promise<PullRequest[]> {
        let url = `${repo.url}/pullRequests?status=active`;
        return this.http.get(url, {withCredentials: true})
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    public getRepositories(): Promise<Repository[]> {
        return this.http.get(`${this.baseUri}/_apis/git/repositories`, {withCredentials: true})
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response): any {
        let body = res.json();
        return body.value || [];
    }

    private handleError (error: any) {
      let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : "Server error";
      console.error(errMsg); // log to console instead
      return Promise.reject(errMsg);
    }
}
