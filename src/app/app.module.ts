import { NgModule }       from "@angular/core";
import { HttpModule }     from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { TfsService } from "./tfsService";
import { OpenExternalDirective } from "./openexternal.directive";
import { PullRequestFilterPipe } from "./pullRequestFilter.pipe";

@NgModule({
  imports: [
    HttpModule,
    BrowserModule
  ],
  declarations: [
    AppComponent,
    OpenExternalDirective,
    PullRequestFilterPipe
  ],
  providers: [
    TfsService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
