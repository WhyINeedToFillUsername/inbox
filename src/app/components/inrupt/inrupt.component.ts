import {Component, OnInit} from '@angular/core';
import {Session} from '@inrupt/solid-client-authn-browser';
import {getSolidDataset, getStringNoLocale, getThing, SolidDataset} from '@inrupt/solid-client';
import {VCARD} from '@inrupt/vocab-common-rdf';
import {InboxDiscoveryService} from "../../services/pleroma/discovery/inbox-discovery.service";

@Component({
  selector: 'app-inrupt',
  templateUrl: './inrupt.component.html',
  styleUrls: ['./inrupt.component.css']
})
export class InruptComponent implements OnInit {
  webID: string = 'https://docs-example.inrupt.net/profile/card#me';
  fn: string;
  role: string;

  readonly session = new Session();

  constructor(
    private readonly inboxDiscoveryService: InboxDiscoveryService
  ) {
  }

  ngOnInit(): void {
    this.handleRedirectAfterLogin();
  }

  // 1a. Start Login Process. Call session.login() function.
  async login() {
    if (!this.session.info.isLoggedIn) {
      await this.session.login({
        oidcIssuer: 'https://inrupt.net',
        redirectUrl: window.location.href,
      });
    }
  }

  // 1b. Login Redirect. Call session.handleIncomingRedirect() function.
  // When redirected after login, finish the process by retrieving session information.
  async handleRedirectAfterLogin() {

    await this.session.handleIncomingRedirect(window.location.href);

    if (this.session.info.isLoggedIn) {
      // Update the page with the status.
      document.getElementById('labelStatus').textContent = 'Your session is logged in.';
      document.getElementById('labelStatus').setAttribute('role', 'alert');
    }
  }

  // The example has the login redirect back to the index.html.
  // This calls the function to process login information.
  // If the function is called when not part of the login redirect, the function is a no-op.

  // 2. Read profile
  async readProfile() {
    console.log('webid : ', this.webID);
    // Profile is public data; i.e., you do not need to be logged in to read the data.
    // For illustrative purposes, shows both an authenticated and non-authenticated reads.

    let myDataset: SolidDataset;
    if (this.session.info.isLoggedIn) {
      myDataset = await getSolidDataset(this.webID, {fetch: this.session.fetch});
    } else {
      myDataset = await getSolidDataset(this.webID);
    }

    const profile = getThing(myDataset, this.webID);

    // Get the formatted name (fn) using the property identifier "http://www.w3.org/2006/vcard/ns#fn".
    // VCARD.fn object is a convenience object that includes the identifier string "http://www.w3.org/2006/vcard/ns#fn".
    // As an alternative, you can pass in the "http://www.w3.org/2006/vcard/ns#fn" string instead of VCARD.fn.

    const fn = getStringNoLocale(profile, VCARD.fn);

    // VCARD.role object is a convenience object that includes the identifier string "http://www.w3.org/2006/vcard/ns#role"
    // As an alternative, you can pass in the "http://www.w3.org/2006/vcard/ns#role" string instead of VCARD.role.

    const role = getStringNoLocale(profile, VCARD.role);

    // Update the page with the retrieved values.
    this.fn = fn;
    this.role = role;

    this.inboxDiscoveryService.retrieveInboxUrlFromWebId(this.webID).then(inboxUrl => console.log(inboxUrl));
  }
}
