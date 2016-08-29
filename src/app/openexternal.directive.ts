import { Directive, Input, ElementRef } from "@angular/core";
import { shell } from "electron";

@Directive({
    selector: "[openExternal]",
    host: {
        "(click)": "onClick($event)"
    }
})
export class OpenExternalDirective {
    onClick($event) {
        $event.preventDefault();
        shell.openExternal($event.target.href);
    }
}
