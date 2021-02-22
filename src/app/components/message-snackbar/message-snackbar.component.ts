import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from "@angular/material/snack-bar";

@Component({
  selector: 'app-message-snackbar',
  templateUrl: './message-snackbar.component.html',
  styleUrls: ['./message-snackbar.component.css']
})
export class MessageSnackbarComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string,
              private snackBarRef: MatSnackBarRef<MessageSnackbarComponent>) {
  }

  close() {
    this.snackBarRef.dismiss();
  }
}
