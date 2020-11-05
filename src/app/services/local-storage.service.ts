import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
  }

  public static saveToLocalStorage(storageKey: string, object: object): void {
    localStorage.setItem(storageKey, JSON.stringify(object));
  }

  public static loadFromLocalStorage(storageKey: string) {
    return JSON.parse(localStorage.getItem(storageKey));
  }
}
