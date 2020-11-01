import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PleromaService {
  private static readonly STORAGE_PREFIX = 'inbox_app_data_';
  private static readonly CALLBACK_URI = location.origin + '/pleroma';

  constructor(
    private http: HttpClient) {
  }

  fetchUser(userUrl: string): Observable<any> {
    return this.http.get(userUrl, {headers: {Accept: 'application/activity+json'}});
  }

  registerApp(oauthRegistrationEndpoint: string): Observable<any> {
    const storageKey = PleromaService.STORAGE_PREFIX + btoa(oauthRegistrationEndpoint);

    if (storageKey in localStorage) {
      console.log("App is already in local storage, loading.");
      return of(PleromaService.loadFromLocalStorage(storageKey));
    } else {
      console.log("App is not in local storage, retrieving...");

      const body = {
        client_name: 'inbox',
        redirect_uris: PleromaService.CALLBACK_URI,
        scopes: 'read write follow',
      };
      const options = {headers: {'Content-Type': 'application/json'}};
      return this.http.post(oauthRegistrationEndpoint, body, options).pipe(
        map(app => {
          console.log('Registered app, saving to local storage: ', app);
          PleromaService.saveToLocalStorage(storageKey, app);
          return app;
        })
      );
    }
  }

  logUserIn(user, app) {
    const redirectUrl = user.endpoints.oauthAuthorizationEndpoint +
      '?response_type=code&client_id=' + app.client_id +
      '&redirect_uri=' + encodeURIComponent(PleromaService.CALLBACK_URI) +
      '&state=' + encodeURIComponent(user.id);

    location.assign(redirectUrl);
  }

  getOAuthToken(code: string, apid: string, userEndpoints): Observable<any> {
    const storageKey = PleromaService.STORAGE_PREFIX + btoa(userEndpoints.oauthRegistrationEndpoint);
    const app = PleromaService.loadFromLocalStorage(storageKey);

    const params = {
      grant_type: 'authorization_code',
      code: code,
      client_id: app.client_id,
      client_secret: app.client_secret,
      redirect_uri: PleromaService.CALLBACK_URI,
      scope: 'read write follow',
    };

    return this.http.post(userEndpoints.oauthTokenEndpoint, params, {headers: {'Content-Type': 'application/json'}});
  }

  getInbox(inboxUrl: string, token: string): Observable<any> {
    return this.getWithToken(inboxUrl, token);
  }

  getInboxPage(inboxPageUrl: string, token: string): Observable<any> {
    return this.getWithToken(inboxPageUrl, token);
  }


  private getWithToken(inboxUrl: string, token: string) {
    return this.http.get(inboxUrl, {headers: {Accept: 'application/activity+json', Authorization: 'Bearer ' + token}});
  }

  private static saveToLocalStorage(storageKey: string, object: object): void {
    localStorage.setItem(storageKey, JSON.stringify(object));
  }

  private static loadFromLocalStorage(storageKey: string) {
    return JSON.parse(localStorage.getItem(storageKey));
  }
}
