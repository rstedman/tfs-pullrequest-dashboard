import { APP_INITIALIZER, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";

import { MultiselectDropdownModule } from "angular-2-dropdown-multiselect";

import { AppComponent } from "./app.component";
import { AppConfigService } from "./appConfig.service";
import { LimitPipe } from "./limit.pipe";
import { VarDirective } from "./ng-var.directive";
import { PullRequestSortPipe } from "./prSort.pipe";
import { PullRequestComponent } from "./pullRequest.component";
import { PullRequestFilterPipe } from "./pullRequestFilter.pipe";
import { RepoFilterPipe } from "./repoFilter.pipe";

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
    PullRequestSortPipe,
    VarDirective,
    LimitPipe
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
