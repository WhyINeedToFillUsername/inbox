import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {forkJoin} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SendService {

  constructor(private readonly http: HttpClient) { }

  send(destinations: string[], messageContent: string) {
    return forkJoin(destinations.map(destinationInbox => this.http.post(destinationInbox, messageContent, {responseType: 'text'})));
  }
}
