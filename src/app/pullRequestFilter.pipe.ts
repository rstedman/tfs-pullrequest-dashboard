import {Injectable, Pipe, PipeTransform} from "@angular/core";
import { PullRequestViewModel } from "./pullRequestViewModel";

@Pipe({
    name: "prFilter",
    pure: false
})
@Injectable()
export class PullRequestFilterPipe  implements PipeTransform {
    transform(items: PullRequestViewModel[], arg: string): any {
        return items.filter(x => {
            return (arg === "requestedByMe" && x.requestedByMe) ||
                   (arg === "assignedToMe" && x.assignedToMe && !x.requestedByMe) ||
                   (arg === "assignedToMyTeam" && x.assignedToMyTeam && !x.requestedByMe) ||
                   (arg === "other" && !x.requestedByMe && !x.assignedToMe && !x.assignedToMyTeam);
        });
    }
}
