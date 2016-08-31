import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import "rxjs/Rx";

import {Repository, Identity, PullRequest, Reviewer} from "./tfsmodel";

@Injectable()
export class TfsService {
    constructor(private http: Http) {}

    private USER_HEADER_NAME: string  = "x-vss-userdata";

    private baseUri: string = "http://jsitfsapp.jsitelecom.com:8080/tfs/DefaultCollection";
    // temp - uri to fetch the list of pull requests
    private uri: string = "http://jsitfsapp.jsitelecom.com:8080/tfs/DefaultCollection/_apis/git/repositories/";

    public async getCurrentUser(): Promise<Identity> {
        // just do a basic query to tfs to be able to look at response headers
        let r = await this.http.options(`${this.baseUri}/_apis`)
            .toPromise()
            .catch(this.handleError);
        // tfs adds a header in the response with the current authenticated users id in the format <userid>:<username>
        let userIdHeader = r.headers.get(this.USER_HEADER_NAME);
        let headerRegex = /([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})/i;
        let match = headerRegex.exec(userIdHeader);
        let userId = match[1];

        r = await this.http.get(`${this.baseUri}/_apis/Identities/${userId}`)
            .toPromise();

        let user: Identity = r.json();
        user.MembersOf = [];

        let membersOf = await this.getMembersOf(userId);
        let promises: Promise<Identity[]>[] = [];
        for (let m of membersOf) {
            user.MembersOf.push(m);
            // now recurse once into the subgroups of each group the member is a member of, to include
            // virtual groups made up of several groups
            promises.push(this.getMembersOf(m.Id));
        }

        for (let p of promises) {
            membersOf = await p;
            for (let m of membersOf) {
                user.MembersOf.push(m);
            }
        }

        return user;
    }

    private async getMembersOf(userId: string): Promise<Identity[]> {
        // get the identities that the current user is a member of
        let r = await this.http.get(`${this.baseUri}/_apis/Identities/${userId}/membersOf`)
            .toPromise();

        let promises: Promise<Response>[] = [];
        let result: Identity[] = [];
        for (let userId of r.json()) {
            // ignore any non-tfs identities
            if (!userId.startsWith("Microsoft.TeamFoundation.Identity"))
                continue;
            promises.push(this.http.get(`${this.baseUri}/_apis/Identities/${userId}`).toPromise());
        }

        for (let promise of promises) {
            let r = await promise;
            result.push(r.json());
        }

        return result;
    }

    public getPullRequests(repo: Repository): Promise<PullRequest[]> {
        let url = `${repo.url}/pullRequests?status=active`;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    public getRepositories(): Promise<Repository[]> {
        return this.http.get(this.uri)
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
