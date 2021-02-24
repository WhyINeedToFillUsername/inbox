import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {forkJoin, Observable} from "rxjs";
import {ContactInbox} from "../../model/contact.inbox";
import {map} from "rxjs/operators";
import {ApMessage} from "../../model/ap.message";

@Injectable({
  providedIn: 'root'
})
export class SendService {
  public replyTo: ApMessage;

  constructor(private readonly http: HttpClient) {
  }

  send(destinations: ContactInbox[], messageContent: string) {
    return forkJoin(destinations.map(destinationInbox => this.http.post(destinationInbox.url, messageContent, {responseType: 'text'})));
  }

  isInboxIri(iri: string): Observable<boolean> {
    return this.http.options(iri, {observe: 'response'}).pipe(
      map(response => {
        if (response.headers.get('link')?.includes('<http://www.w3.org/ns/ldp#Container>; rel="type"')) {
          return true;
        } else {
          return false;
        }
      }
    ));
  }
}
