import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl, Validators} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith, tap} from 'rxjs/operators';
import {InruptService} from "../../services/inrupt/inrupt.service";
import {ContactInbox} from "../../model/contact.inbox";
import {SendService} from "../../services/send/send.service";
import {InboxDiscoveryService} from "../../services/discovery/inbox-discovery.service";

@Component({
  selector: 'app-recipients-picker',
  templateUrl: './recipients-picker.component.html',
  styleUrls: ['./recipients-picker.component.css']
})
export class RecipientsPickerComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  formControl = new FormControl('', [Validators.required]);
  filteredContacts: Observable<ContactInbox[]>;
  recipients: ContactInbox[] = [];
  allContacts: ContactInbox[] = [];
  errors: string[] = [];
  spinner: boolean = false;
  hints: string[] = [];

  @ViewChild('recipientInput') recipientInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private readonly _inruptService: InruptService,
    private readonly _sendService: SendService) {
  }

  ngOnInit(): void {
    this.loadContacts().then(() => {
      this.monitorFormInput();
    });
  }

  private monitorFormInput() {
    this.filteredContacts = this.formControl.valueChanges.pipe(
      startWith(null),
      map((recipient) => recipient && typeof recipient === 'string' ? this._filter(recipient) : this.allContacts.slice()));
  }

  add(event: MatChipInputEvent): void {
    this._resetErrors();
    const input = event.input;
    const value = event.value;

    // Add our recipient
    const trimmedValue = (value || '').trim();

    if (trimmedValue) {
      this.spinner = true;
      this.formControl.disable();
      this._processSubmittedInput(value).finally(() => {
        this.spinner = false;
        this.formControl.enable();
      })
        .then(() => {
            // Reset the input value
            if (input) {
              input.value = '';
            }

            this.formControl.setValue(null);
          },
          error => {
            this._setErrors("Couldn't find inbox / profile!");
          }
        )
    } else {
      this._setErrors("You've inputted only whitespaces!");
    }
  }

  remove(recipient: ContactInbox): void {
    this._resetErrors();
    this.hints = [];
    const index = this.recipients.indexOf(recipient);

    if (index >= 0) {
      this.allContacts.push(recipient); // add back to selectbox
      this.recipients.splice(index, 1);
      this.monitorFormInput();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this._resetErrors();
    const selectedContactInbox = event.option.value;
    this.recipients.push(selectedContactInbox);

    // remove selected option from all
    const index = this.recipients.indexOf(selectedContactInbox);
    this.allContacts.splice(index, 1);
    this.monitorFormInput();

    this.recipientInput.nativeElement.value = '';
    this.formControl.setValue(null);
  }

  private _filter(value: string): ContactInbox[] {
    const filterValue = value.toLowerCase().replace(':', '');

    return this.allContacts.filter(contactInbox => {
      return contactInbox.url.toLowerCase().indexOf(filterValue) === 0 // filter contacts by inbox url
        || contactInbox.contact.name.toLocaleLowerCase().indexOf(filterValue) === 0; // or by contact name
    });
  }

  loadContacts() {
    return this._inruptService.getProfileContactInboxes().then(
      contacts => {
        this.allContacts = contacts;
      }
    )
  }

  private _setErrors(message: string) {
    this.errors.push(message);
  }

  private _resetErrors() {
    this.errors = [];
  }

  private _processSubmittedInput(iri: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let promises = [];
      let isInboxIri;
      let inboxes;
      let name = "Unknown";

      promises.push(this._sendService.isInboxIri(iri).toPromise().then(value => isInboxIri = value).catch(ignore => {return}));
      promises.push(InboxDiscoveryService.retrieveInboxUrlsFromWebId(iri).then(urls => inboxes = urls).catch(ignore => {return}))
      promises.push(InruptService.getProfileName(iri).then(profileName => name = profileName).catch(ignore => {return}));

      Promise.all(promises).then(() => {
        if (isInboxIri) {
          this.recipients.push({url: iri, name: iri, contact: {webId: iri, name: "Unknown"}});
          resolve();
          return;
        } else {
          if (inboxes?.length > 0) {
            for (const inbox of inboxes) {
              this.recipients.push({url: inbox, name: inbox, contact: {webId: iri, name: name}});
            }
            if (inboxes.length > 1) {
              console.log("moore")
              this.hints.push("Discovered multiple inboxes at supplied webId. Choose which you want to keep.");
            }
            resolve();
            return;
          }
          reject();
          return;
        }
      }).catch(error => {
        console.error(error);
        reject();
        return;
      });
    });
  }
}
