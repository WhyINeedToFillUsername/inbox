import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {map} from 'rxjs/operators';
import {BrowserStorageService} from './browser-storage.service';


@Injectable({
  providedIn: 'root'
})
export class PleromaService {
  public static readonly STORAGE_KEY_USERS = 'pleroma_users';
  private static readonly STORAGE_TOKEN_KEY = 'token';
  private static readonly STORAGE_PREFIX_APP = 'inbox_app_data_';
  private static readonly CALLBACK_URI = location.origin + '/pleroma';

  constructor(
    private http: HttpClient) {
  }

  fetchUser(userUrl: string): Observable<any> {
    return this.http.get(userUrl, {headers: {Accept: 'application/activity+json'}});
  }

  registerApp(oauthRegistrationEndpoint: string): Observable<any> {
    const storageKey = PleromaService.STORAGE_PREFIX_APP + btoa(oauthRegistrationEndpoint);

    if (storageKey in localStorage) {
      console.log("App is already in local storage, loading.");
      return of(BrowserStorageService.loadFromLocalStorage(storageKey));

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
          BrowserStorageService.saveToLocalStorage(storageKey, app);
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
    const storageKey = PleromaService.STORAGE_PREFIX_APP + btoa(userEndpoints.oauthRegistrationEndpoint);
    const app = BrowserStorageService.loadFromLocalStorage(storageKey);

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

  getWithToken(url: string): Observable<any> {
    const token = BrowserStorageService.loadFromSession(PleromaService.STORAGE_TOKEN_KEY);
    if (token) {
      console.log("Getting ", url, " with token ", token);
      return this.http.get(url, {headers: {Accept: 'application/activity+json', Authorization: 'Bearer ' + token}});
    } else {
      console.error("no token");
      return throwError("no token");
    }
  }

  saveToken(token) {
    BrowserStorageService.saveToSession(PleromaService.STORAGE_TOKEN_KEY, token);
  }
}
