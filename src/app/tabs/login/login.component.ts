import {Component, OnInit} from '@angular/core';
import {InruptService} from "../../services/inrupt/inrupt.service";
import {Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  spinner: boolean = false;

  myControl = new FormControl();
  options: string[] = ['https://inrupt.net/', 'https://solidcommunity.net/', 'https://broker.pod.inrupt.com/'];
  filteredOptions: Observable<string[]>;

  constructor(private readonly _inruptService: InruptService,
              private readonly _router: Router) {
  }

  ngOnInit(): void {
    this._initAutocomplete();
    this.handleRedirectAfterLogin();
  }

  login() {
    this.spinner = true;
    this._inruptService.login(this.myControl.value);
  }

  handleRedirectAfterLogin() {
    this.spinner = true;
    this._inruptService.session.handleIncomingRedirect(window.location.href)
      .then(sessionInfo => {
        if (sessionInfo.isLoggedIn) {
          this._router.navigate(['/incoming']);
        } else {
          this.spinner = false;
        }
      });
  }

  private _initAutocomplete() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
