import { Injectable, FactoryProvider }       from "@angular/core";
import { Http }     from "@angular/http";

import { OnPremTfsService } from "./onPremTfs.service";
import { OnlineTfsService } from "./onlineTfs.service";
import { AppConfig, TfsService } from './tfsmodel';

/** factory provider for the tfsservice, which switches the backend provider based on if it's using tfs online,
    an on-prem service **/
@Injectable()
export class TfsServiceProvider implements FactoryProvider{

  constructor() {}

  public provide = TfsService;

  public useFactory(http: Http, config: AppConfig): TfsService {
    let service: TfsService;
    if(config.onPrem === true) {
      return new OnPremTfsService(http, config);
    } else {
      return new OnlineTfsService(config);
    }
  }

  public deps = [Http, AppConfig]
};
