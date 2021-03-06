import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl, Validators} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {InruptService} from "../../services/inrupt/inrupt.service";
import {ContactInbox} from "../../model/contact.inbox";
import {SendService} from "../../services/send/send.service";
import {InboxDiscoveryService} from "../../services/discovery/inbox-discovery.service";
import {InruptStaticService} from "../../services/inrupt/inrupt.static.service";
import {InboxMessage} from "../../model/inbox.message";

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
  inputValue: string = "";

  @ViewChild('recipientInput') recipientInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @Input() replyTo: InboxMessage;

  constructor(
    private readonly _inruptService: InruptService,
    private readonly _sendService: SendService) {
  }

  ngOnInit(): void {
    this.loadContacts().then(() => {
      this.monitorFormInput();
    });
    this._processReplyMessage();
  }

  private monitorFormInput() {
    this.filteredContacts = this.formControl.valueChanges.pipe(
      startWith(null),
      map(recipient => recipient && typeof recipient === 'string' ? this._filter(recipient) : this.allContacts.slice()));
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    this._addRecipient(value, input);
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
        return contactInbox.url.toLowerCase().includes(filterValue); // filter contacts by inbox url
      }
    );

    // return this.allContacts.filter(contactInbox => {
    //   return contactInbox.url.toLowerCase().indexOf(filterValue) === 0 // filter contacts by inbox url
    //     || contactInbox.contact.name.subscribe(name => {
    //       if (name.toLocaleLowerCase().indexOf(filterValue) === 0) return contactInbox;
    //     }); // or by contact name
    // });
  }

  loadContacts() {
    return this._inruptService.getProfileContactInboxes().then(
      contacts => {
        this.allContacts = contacts;
      }
    );
  }

  private _setErrors(message: string) {
    this.errors.push(message);
  }

  private _resetErrors() {
    this.errors = [];
  }

  private _processReplyMessage() {
    if (this.replyTo?.actor) {
      this.formControl.setValue(this.replyTo);
      this.inputValue = this.replyTo.actor.webId;
      this._addRecipient(this.replyTo.actor.webId);
    }
  }

  private _addRecipient(value: string, input: HTMLInputElement = undefined) {
    this._resetErrors();

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

  private _processSubmittedInput(iri: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let promises = [];
      let isInboxIri;
      let inboxes;
      let name = InruptStaticService.getProfileName$(iri);

      promises.push(this._sendService.isInboxIri(iri).toPromise().then(value => isInboxIri = value).catch(ignore => {return;}));
      promises.push(InboxDiscoveryService.retrieveInboxUrlsFromWebId(iri).then(urls => inboxes = urls).catch(ignore => {return;}));

      Promise.all(promises).then(() => {
        if (isInboxIri) {
          this.recipients.push({url: iri, name: iri, contact: {webId: iri, name: name}});
          resolve();
          return;
        } else {
          if (inboxes?.length > 0) {
            for (const inbox of inboxes) {
              this.recipients.push({url: inbox, name: inbox, contact: {webId: iri, name: name}});
            }
            if (inboxes.length > 1) {
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
