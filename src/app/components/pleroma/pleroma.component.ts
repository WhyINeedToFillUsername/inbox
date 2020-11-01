import {Component, OnInit} from '@angular/core';
import {PleromaService} from '../../services/pleroma.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-pleroma',
  templateUrl: './pleroma.component.html',
  styleUrls: ['./pleroma.component.css']
})
export class PleromaComponent implements OnInit {
  public idInput = 'https://greenish.red/users/nokton';

  private code: string;
  private apid: string; // param "state"

  constructor(
    private readonly pleromaService: PleromaService,
    private readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.code = this.route.snapshot.queryParamMap.get('code');
    this.apid = this.route.snapshot.queryParamMap.get('state');
    console.log("Retrieved params: code='", this.code, "', apid='", this.apid, "'.");
  }

  submit() {
    console.log('Fetching ', this.idInput);
    this.pleromaService.fetchUser(this.idInput).subscribe(
      user => {
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
}
