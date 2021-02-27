import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
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

  sendSimpleMessage(destinations: ContactInbox[], messageContent: string) {
    return forkJoin(destinations.map(destinationInbox => this.http.post(destinationInbox.url, messageContent, {responseType: 'text'})));
  }

  sendActivityPubMessage(destinations: ContactInbox[], message: ApMessage) {
    const headers = new HttpHeaders({'Content-Type': 'application/ld+json'});
    const options = { headers: headers };

    return forkJoin(destinations.map(destinationInbox => {
      return this.http.post(destinationInbox.url, this.constructActivityPubMessage(message), options);
    }));
  }

  constructActivityPubMessage(message: ApMessage): JSON {
    let obj = {
      '@context': "https://www.w3.org/ns/activitystreams",
      type: "Note",
      inReplyTo: message.inReplyTo,
      name: message.name,
      actor: message.actor,
      to: message.to,
      content: message.content
    };
    const text = JSON.stringify(obj);
    console.log(text);
    const parse = JSON.parse(text);
    console.log(parse);
    return parse;
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
