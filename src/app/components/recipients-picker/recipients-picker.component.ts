import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {InruptService} from "../../services/inrupt/inrupt.service";

@Component({
  selector: 'app-recipients-picker',
  templateUrl: './recipients-picker.component.html',
  styleUrls: ['./recipients-picker.component.css']
})
export class RecipientsPickerComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  formControl = new FormControl();
  filteredFriends: Observable<string[]>;
  selectedFriends: string[] = [];
  allFriends: string[] = [];

  @ViewChild('friendInput') friendInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private readonly _inruptService: InruptService) {
  }

  ngOnInit(): void {
    this.readFriends().then(() => {
      this.monitorFormInput();
    });
  }

  private monitorFormInput() {
    this.filteredFriends = this.formControl.valueChanges.pipe(
      startWith(null),
      map((friend: string | null) => friend ? this._filter(friend) : this.allFriends.slice()));
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our friend
    if ((value || '').trim()) {
      this.selectedFriends.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.formControl.setValue(null);
  }

  remove(friend: string): void {
    const index = this.selectedFriends.indexOf(friend);

    if (index >= 0) {
      this.selectedFriends.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedFriends.push(event.option.viewValue);
    this.friendInput.nativeElement.value = '';
    this.formControl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFriends.filter(friend => friend.toLowerCase().indexOf(filterValue) === 0);
  }

  readFriends() {
    return this._inruptService.getFriendsFromWebId(this._inruptService.getSessionWebId()).then(
      friends => {
        friends.forEach(friend => {
          this.allFriends.push(friend);
        })
      }
    )
  }
}
