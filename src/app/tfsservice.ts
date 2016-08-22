import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import "rxjs/Rx";

import {Repository, Identity, PullRequest, Reviewer} from "./tfsmodel";

@Injectable()
export class TfsService {
    constructor(private http: Http) {}

    // temp - uri to fetch the list of pull requests
    private uri: string = "..enter api uri..";

    public getPullRequests(): Promise<PullRequest[]> {
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
