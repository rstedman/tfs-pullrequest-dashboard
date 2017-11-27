import { FactoryProvider, Injectable, NgZone } from "@angular/core";
import { Http } from "@angular/http";

import { AppConfigService } from "./appConfig.service";
import { ExtensionsApiTfsService } from "./extensionsApiTfs.service";
import { TfsService } from "./model";
import { RestfulTfsService } from "./restfulTfs.service";

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
      const gitClient = config.gitClientFactory.getClient();
      const identitiesClient = config.identitiesClientFactory.getClient();
      const context = config.context;
      const isHosted = context.getPageContext().webAccessConfiguration.isHosted;
      const user = context.getPageContext().webContext.user;
      const projectName = context.getPageContext().webContext.project.name;
      return new ExtensionsApiTfsService(gitClient, identitiesClient, isHosted, projectName, user, zone);
    }
  }
}
