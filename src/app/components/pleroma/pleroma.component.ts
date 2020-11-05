import {Component, OnInit} from '@angular/core';
import {PleromaService} from '../../services/pleroma.service';
import {ActivatedRoute} from '@angular/router';
import {LocalStorageService} from '../../services/local-storage.service';

@Component({
  selector: 'app-pleroma',
  templateUrl: './pleroma.component.html',
  styleUrls: ['./pleroma.component.css']
})
export class PleromaComponent implements OnInit {
  public idInput = 'https://greenish.red/users/nokton';

  submitted: boolean = false;

  private code: string;
  private apid: string; // param "state"
  statuses;

  constructor(
    private readonly pleromaService: PleromaService,
    private readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.retrieveParams();
    if (this.code && this.apid) {
      this.submitted = true;
      this.connectPleroma(this.code, this.apid);
    }
  }

  submit() {
    this.submitted = true;
    console.log('Fetching ', this.idInput);
    this.pleromaService.fetchUser(this.idInput).subscribe(
      user => {
        LocalStorageService.saveToLocalStorage(PleromaService.STORAGE_KEY_USERS, [this.idInput])
        console.log('Fetched user: ', user)
        this.pleromaService.registerApp(user.endpoints.oauthRegistrationEndpoint).subscribe(
          app => {
            console.log('Registered app: ', app);
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
            history.replaceState(null, '', location.pathname); // remove code from URL
            const token = tokenInfo.access_token;

            this.pleromaService.getInbox(user.inbox, token).subscribe(
              inbox => {
                console.log('Retrieved inbox: ', inbox);

                this.pleromaService.getInboxPage(inbox.first, token).subscribe(
                  page => {
                    console.log('Retrieved page: ', page);
                    this.statuses = page.orderedItems;
                  }
                )
              }
            )
          }
        );
      }
    )
  }

  private retrieveParams(): void {
    this.code = this.route.snapshot.queryParamMap.get('code');
    this.apid = this.route.snapshot.queryParamMap.get('state');
    console.log('Retrieved params: code=\'', this.code, '\', apid=\'', this.apid, '\'.');
  }
}
