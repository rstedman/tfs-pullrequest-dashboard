import { NgModule }       from "@angular/core";
import { HttpModule }     from "@angular/http";
import { FormsModule } from "@angular/forms"
import { BrowserModule } from "@angular/platform-browser";

import { MultiselectDropdownModule } from "./multiselect-dropdown";

import { AppComponent } from "./app.component";
import { PullRequestComponent } from "./pullRequest.component";
import { AppConfig } from './model';
import { PullRequestFilterPipe } from "./pullRequestFilter.pipe";
import { RepoFilterPipe } from "./repoFilter.pipe"

export let AppConfigSettings = new AppConfig();

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
    RepoFilterPipe
  ],
  providers: [
    { provide: AppConfig, useValue: AppConfigSettings }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
