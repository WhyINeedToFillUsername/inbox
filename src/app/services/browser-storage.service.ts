export class BrowserStorageService {
  public static saveToSession(storageKey: string, object: object): void {
    sessionStorage.setItem(storageKey, JSON.stringify(object));
  }

  public static loadFromSession(storageKey: string) {
    return JSON.parse(sessionStorage.getItem(storageKey));
  }

  public static saveToLocalStorage(storageKey: string, object: object): void {
    localStorage.setItem(storageKey, JSON.stringify(object));
  }

  public static loadFromLocalStorage(storageKey: string) {
    return JSON.parse(localStorage.getItem(storageKey));
  }
}
