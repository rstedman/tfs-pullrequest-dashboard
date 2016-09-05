import {Injectable, Pipe, PipeTransform} from "@angular/core";
import { PullRequestViewModel } from "./pullRequestViewModel";

@Pipe({
    name: "repoFilter",
    pure: false
})
@Injectable()
export class RepoFilterPipe  implements PipeTransform {
    transform(items: PullRequestViewModel[], filteredRepoIds: string[]): any {
        return items.filter(x => { return !filteredRepoIds.includes(x.repository.id); });
    }
}
