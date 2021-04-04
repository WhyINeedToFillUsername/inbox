import {Component} from '@angular/core';
import {GoogleTagManagerService} from "angular-google-tag-manager";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'inbox';

  constructor(private gtmService: GoogleTagManagerService,
              private readonly _router: Router) {

    this._router.events.forEach(item => {
      if (item instanceof NavigationEnd) {
        const gtmTag = {
          event: 'page',
          pageName: item.url
        };

        this.gtmService.pushTag(gtmTag);
      }
    });
  }
}
