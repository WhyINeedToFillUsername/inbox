import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl, Validators} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {InruptService} from "../../services/inrupt/inrupt.service";
import {Contact} from "../../model/contact";

@Component({
  selector: 'app-recipients-picker',
  templateUrl: './recipients-picker.component.html',
  styleUrls: ['./recipients-picker.component.css']
})
export class RecipientsPickerComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  formControl = new FormControl('', [Validators.required]);
  filteredContacts: Observable<Contact[]>;
  recipients: Contact[] = [];
  allContacts: Contact[] = [];
  errors: string[] = [];

  @ViewChild('recipientInput') recipientInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private readonly _inruptService: InruptService) {
  }

  ngOnInit(): void {
    this.loadContacts().then(() => {
      this.monitorFormInput();
    });
  }

  private monitorFormInput() {
    this.filteredContacts = this.formControl.valueChanges.pipe(
      startWith(null),
      map((contact: Contact | null) => contact ? this._filter(contact) : this.allContacts.slice()));
  }

  add(event: MatChipInputEvent): void {
    this._resetErrors();
    const input = event.input;
    const value = event.value;

    // Add our recipient
    if ((value || '').trim()) {
      this.recipients.push(RecipientsPickerComponent._newContactByIRI(value.trim()));
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.formControl.setValue(null);
  }

  remove(recipient: Contact): void {
    this._resetErrors();
    const index = this.recipients.indexOf(recipient);

    if (index >= 0) {
      this.recipients.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this._resetErrors();
    this.recipients.push(event.option.value);
    this.recipientInput.nativeElement.value = '';
    this.formControl.setValue(null);
  }

  private _filter(value: Contact): Contact[] {
    const filterValue = value.webId.toLowerCase();

    return this.allContacts.filter(contact => contact.webId.toLowerCase().indexOf(filterValue) === 0);
  }

  loadContacts() {
    return this._inruptService.getProfileContacts().then(
      contacts => {
        this.allContacts = contacts;
      }
    )
  }

  private _resetErrors() {
    this.errors = [];
  }

  private static _newContactByIRI(iri: string): Contact {
    return {webId: iri, name: iri, inboxes: []};
  }
}
