import {Injectable, Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "limit",
    pure: false
})
@Injectable()
export class LimitPipe  implements PipeTransform {
    public transform(items: any[], limit: number): any[] {
        if (limit <= 0 || items.length < limit) {
            return items;
        }
        return items.slice(0, limit);
    }
}
