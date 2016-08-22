import { NgModule }       from "@angular/core";
import { HttpModule }     from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { TfsService } from "./tfsService";

@NgModule({
  imports: [
    HttpModule,
    BrowserModule
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    TfsService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
