import {Component, OnInit} from '@angular/core';
import {PleromaService} from '../../services/pleroma.service';

@Component({
  selector: 'app-pleroma',
  templateUrl: './pleroma.component.html',
  styleUrls: ['./pleroma.component.css']
})
export class PleromaComponent implements OnInit {
  public idInput;

  constructor(private readonly pleromaService: PleromaService) {
  }

  ngOnInit(): void {
  }

  submit() {
    console.log('Fetching ', this.idInput);
    this.pleromaService.fetchUser(this.idInput).subscribe(
      user => {
        console.log("Fetched user: ", user)
        this.pleromaService.registerApp(user.endpoints.oauthRegistrationEndpoint).subscribe(
          app => {
            console.log("Registered app: ", app);
            this.pleromaService.logUserIn(user, app);
          }
        );
      }
    )
  }
}
