import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {forkJoin, Observable} from "rxjs";
import {ContactInbox} from "../../model/contact.inbox";
import {map} from "rxjs/operators";
import {ApMessage} from "../../model/ap.message";
import {InruptService} from "../inrupt/inrupt.service";

@Injectable({
  providedIn: 'root'
})
export class SendService {
  public replyTo: ApMessage;

  constructor(private readonly http: HttpClient,
              private readonly _inruptService: InruptService) {
  }

  sendSimpleMessage(destinations: ContactInbox[], messageContent: string) {
    return forkJoin(destinations.map(destinationInbox => this.http.post(destinationInbox.url, messageContent, {responseType: 'text'})));
  }

  sendActivityPubMessage(destinations: ContactInbox[], subject: string, messageContent: string, replyTo: ApMessage) {
    let message = new ApMessage();
    message.name = subject;
    message.content = messageContent;
    message.to = destinations.map(destination => destination.url);
    message.actor = this._inruptService.getSessionWebId();
    message.inReplyTo = replyTo?.inReplyTo;

    return this._sendActivityPubMessage(message);
  }

  private _sendActivityPubMessage(message: ApMessage) {
    const options = {headers: new HttpHeaders({'Content-Type': 'application/ld+json'}), responseType: 'text' as 'text'};

    return forkJoin(message.to.map(destinationInbox => {
      return this.http.post(destinationInbox, SendService.ConstructActivityPubObject(message),
        {headers: new HttpHeaders({'Content-Type': 'application/ld+json'}), responseType: 'text'});
    }));
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

  private static ConstructActivityPubObject(message: ApMessage) {
    return {
      '@context': "https://www.w3.org/ns/activitystreams",
      type: "Note",
      inReplyTo: message.inReplyTo,
      name: message.name,
      actor: message.actor,
      to: message.to,
      content: message.content
    };
  }
}
