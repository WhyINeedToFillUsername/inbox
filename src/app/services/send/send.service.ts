import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {forkJoin, Observable} from "rxjs";
import {ContactInbox} from "../../model/contact.inbox";
import {map} from "rxjs/operators";
import {InruptService} from "../inrupt/inrupt.service";
import {InboxMessage} from "../../model/inbox.message";

@Injectable({
  providedIn: 'root'
})
export class SendService {
  public replyTo: InboxMessage;

  constructor(private readonly http: HttpClient,
              private readonly _inruptService: InruptService) {
  }

  sendSimpleMessage(destinations: ContactInbox[], messageContent: string) {
    return forkJoin(destinations.map(destinationInbox => this.http.post(destinationInbox.url, messageContent, {responseType: 'text'})));
  }

  sendActivityStreamsMessage(destinations: ContactInbox[], subject: string, messageContent: string, replyTo: InboxMessage) {
    let message = new InboxMessage();
    message.name = subject;
    message.content = messageContent;
    message.to = destinations.map(destination => destination.url);
    message.actor = {webId: this._inruptService.getSessionWebId(), name: undefined};
    message.inReplyTo = replyTo?.inReplyTo;

    return this._sendActivityStreamsMessage(message);
  }

  private _sendActivityStreamsMessage(message: InboxMessage) {
    return forkJoin(message.to.map(destinationInbox => {
      return this.http.post(destinationInbox, SendService.ConstructActivityStreamsObject(message),
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

  private static ConstructActivityStreamsObject(message: InboxMessage) {
    return {
      '@context': "https://www.w3.org/ns/activitystreams",
      type: "Note",
      inReplyTo: message.inReplyTo,
      name: message.name,
      actor: message.actor.webId,
      to: message.to,
      content: message.content
    };
  }
}
