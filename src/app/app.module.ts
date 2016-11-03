import { NgModule, APP_INITIALIZER }       from "@angular/core";
import { HttpModule }     from "@angular/http";
import { FormsModule } from "@angular/forms"
import { BrowserModule } from "@angular/platform-browser";

import { MultiselectDropdownModule } from "./multiselect-dropdown";

import { AppComponent } from "./app.component";
import { PullRequestComponent } from "./pullRequest.component";
import { AppConfigService } from "./appConfig.service";
import { PullRequestFilterPipe } from "./pullRequestFilter.pipe";
import { RepoFilterPipe } from "./repoFilter.pipe"
import { PullRequestSortPipe } from "./prSort.pipe"

@NgModule({
  imports: [
    HttpModule,
    FormsModule,
    BrowserModule,
    MultiselectDropdownModule
  ],
  declarations: [
    AppComponent,
    PullRequestComponent,
    PullRequestFilterPipe,
    RepoFilterPipe,
    PullRequestSortPipe
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: AppConfigService) => (() => configService.initialize()),
      deps: [AppConfigService],
      multi: true
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
