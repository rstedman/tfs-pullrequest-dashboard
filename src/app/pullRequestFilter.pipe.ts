import {Injectable, Pipe, PipeTransform} from "@angular/core";
import { PullRequestViewModel } from "./pullRequestViewModel";

@Pipe({
    name: "prFilter",
    pure: false
})
@Injectable()
export class PullRequestFilterPipe  implements PipeTransform {
    transform(items: PullRequestViewModel[], args: any[]): any {
        return items.filter(x => x.assignedToMe || x.requestedByMe || x.assignedToMyTeam);
    }
}
