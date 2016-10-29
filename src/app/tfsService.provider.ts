import { Injectable, FactoryProvider }       from "@angular/core";
import { Http }     from "@angular/http";

import { RestfulTfsService } from "./restfulTfs.service";
import { ExtensionsApiTfsService } from "./extensionsApiTfs.service";
import { AppConfig, TfsService } from './model';

/** factory provider for the tfsservice, which switches the backend provider based on if it's using tfs online,
    an on-prem service **/
@Injectable()
export class TfsServiceProvider implements FactoryProvider{

  constructor() {}

  public provide = TfsService;

  public useFactory(http: Http, config: AppConfig): TfsService {
    // If we aren't running as a VSS extension, use the restfultfsservice
    if(!VSS.getWebContext()) {
      return new RestfulTfsService(http, config);
    } else {
      return new ExtensionsApiTfsService();
    }
  }

  public deps = [Http, AppConfig]
};
