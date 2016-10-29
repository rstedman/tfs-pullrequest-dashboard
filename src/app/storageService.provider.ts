import { Injectable, FactoryProvider }       from "@angular/core";
import { Http }     from "@angular/http";

import { StorageService } from './model';
import { LocalStorageService } from "./localStorage.service"
import { TfsStorageService } from "./tfsStorage.service"

/** factory provider for the tfsservice, which switches the backend provider based on if it's using tfs online,
    an on-prem service **/
export class StorageServiceProvider implements FactoryProvider {
  public provide = StorageService;

  public useFactory(): StorageService {
    // If we aren't running as a VSS extension, use the LocalStorageService
    if(!VSS.getWebContext()) {
      return new LocalStorageService();
    } else {
      return new TfsStorageService();
    }
  }
};
