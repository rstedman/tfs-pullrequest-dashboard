import { Injectable, FactoryProvider, NgZone }       from "@angular/core";
import { Http }     from "@angular/http";

import { RestfulTfsService } from "./restfulTfs.service";
import { ExtensionsApiTfsService } from "./extensionsApiTfs.service";
import { AppConfigService } from "./appConfig.service";
import { TfsService } from "./model";

// factory provider for the tfsservice, which switches the backend provider based on if it's using tfs online,
// an on-prem service.
@Injectable()
export class TfsServiceProvider implements FactoryProvider {
  public provide = TfsService;

  public deps = [Http, AppConfigService, NgZone];

  public useFactory(http: Http, config: AppConfigService, zone: NgZone): TfsService {
    // If we aren't running as a VSS extension, use the restfultfsservice
    if (config.devMode) {
      return new RestfulTfsService(http, config);
    } else {
      let gitClient = config.gitClientFactory.getClient();
      let identitiesClient = config.identitiesClientFactory.getClient();
      let context = config.context;
      let isHosted = context.getPageContext().webAccessConfiguration.isHosted;
      let user = context.getPageContext().webContext.user;
      let projectName = context.getPageContext().webContext.project.name;
      return new ExtensionsApiTfsService(gitClient, identitiesClient, isHosted, projectName, user, zone);
    }
  }
};
