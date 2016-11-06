import {Injectable, Pipe, PipeTransform} from "@angular/core";
import { PullRequestViewModel } from "./pullRequestViewModel";

@Pipe({
    name: "repoFilter",
    pure: false
})
@Injectable()
export class RepoFilterPipe  implements PipeTransform {
    public transform(items: PullRequestViewModel[], filteredRepoIds: string[]): PullRequestViewModel[] {
        return items.filter(x => filteredRepoIds.indexOf(x.repository.id) < 0);
    }
}
