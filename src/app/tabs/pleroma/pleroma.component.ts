import {Component, OnDestroy, OnInit} from '@angular/core';
import {PleromaService} from '../../services/pleroma/pleroma.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BrowserStorageService} from '../../services/browser-storage.service';
import {of, Subject} from 'rxjs';
import {Location} from '@angular/common';

@Component({
  selector: 'app-pleroma',
  templateUrl: './pleroma.component.html',
  styleUrls: ['./pleroma.component.css']
})
export class PleromaComponent implements OnInit, OnDestroy {
  public idInput = '';

  submitted: boolean = false;
  logged: boolean = false;

  public destroyed$ = new Subject<any>();

  private code: string;
  private apid: string; // param "state"
  statuses;

  constructor(
    private readonly pleromaService: PleromaService,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly router: Router) {
  }

  ngOnInit(): void {
    this.initPage();
  }

  submit() {
    this.submitted = true;
    this.pleromaService.fetchUser(this.idInput).subscribe(
      user => {
        BrowserStorageService.saveToLocalStorage(PleromaService.STORAGE_KEY_USERS, [this.idInput])
        this.pleromaService.registerApp(user.endpoints.oauthRegistrationEndpoint).subscribe(
          app => {
            this.pleromaService.logUserIn(user, app);
          }
        );
      }
    )
  }

  private connectPleroma(code, apid) {
    this.pleromaService.fetchUser(apid).subscribe(
      user => {
        console.log('Fetched user: ', user);

        this.pleromaService.getOAuthToken(code, apid, user.endpoints).subscribe(
          tokenInfo => {
            console.log('Retrieved token info: ', tokenInfo);
            const token = tokenInfo.access_token;
            this.pleromaService.saveToken(token);
            BrowserStorageService.saveToSession('userInbox', user.inbox)


            this.router.navigate([], {queryParams: {'code': null, 'state': null,}, queryParamsHandling: 'merge'});

            // this.location.replaceState('pleroma');
            // history.replaceState(null, '', location.pathname); // remove code from URL
            // console.log('replaced state');
            // this.router.navigateByUrl(this.router.url, {queryParams: {}, preserveQueryParams: false});
            // this.initPage();
          }
        );
      }
    )
  }

  private loadInbox() {
    const inboxUrl = BrowserStorageService.loadFromSession('userInbox');

    if (inboxUrl) {
      this.pleromaService.getWithToken(inboxUrl).subscribe(
        inbox => {
          this.logged = true;

          this.pleromaService.getWithToken(inbox.first).subscribe(
            page => {
              this.statuses = page.orderedItems;
            },
            error => {
              this.submitted = false;
              this.logged = false;
              return of(error);
            }
          )
        },
        error => {
          console.error('Error getting inbox: ', error);
          this.submitted = false;
          this.logged = false;
          return of(error);
        }
      )
    } else {
      this.submitted = false;
      this.logged = false;
    }
  }

  private initPage(): void {

    this.route.queryParamMap.subscribe(
      queryParamMap => {

        this.code = queryParamMap.get('code');
        this.apid = queryParamMap.get('state');

        if (this.code && this.apid) {
          this.submitted = true;
          this.connectPleroma(this.code, this.apid);
        } else {
          this.loadInbox()
        }

      }
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
