import {Observable} from "rxjs";

export interface Contact {
  webId: string;
  name: Observable<string>;
}
