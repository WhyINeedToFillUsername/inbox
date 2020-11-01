import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-pleroma-oauth',
  template: '<p>pleroma-oauth works!</p>'
})
export class PleromaOAuthComponent implements OnInit {

  private code: string;
  private apid: string; // param "state"

  constructor(
    private readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.code = this.route.snapshot.queryParamMap.get('code');
    this.apid = this.route.snapshot.queryParamMap.get('state');
    console.log("Retrieved params: code='", this.code, "', apid='", this.apid, "'.");
  }

}
