import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-pleroma',
  templateUrl: './pleroma.component.html',
  styleUrls: ['./pleroma.component.css']
})
export class PleromaComponent implements OnInit {
  public idInput;

  constructor() {
  }

  ngOnInit(): void {
  }

  submit() {
    console.log(this.idInput);
  }
}
