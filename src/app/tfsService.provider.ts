import { Injectable, FactoryProvider }       from "@angular/core";
import { Http }     from "@angular/http";

import { OnPremTfsService } from "./onPremTfs.service";
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
      service = new OnPremTfsService(http);
    } else {
      let m = require("./onlineTfs.service");
      return new m.OnlineTfsService();
    }
    service.setConfig(config);
    return service
  }

  public deps = [Http, AppConfig]
};
