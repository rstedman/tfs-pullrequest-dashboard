import {Injectable, Pipe, PipeTransform} from "@angular/core";
import { PullRequestViewModel } from "./pullRequestViewModel";

@Pipe({
    name: "prSort",
    pure: false
})
@Injectable()
export class PullRequestSortPipe  implements PipeTransform {
    public transform(items: PullRequestViewModel[]): PullRequestViewModel[] {
        return items.sort((a: PullRequestViewModel, b: PullRequestViewModel) => {
            if (a.createdDate > b.createdDate) {
                return 1;
            }
            if (a.createdDate < b.createdDate) {
                return -1;
            }
            return 0;
        });
    }
}
