import {AllIncomingComponent} from "./all-incoming/all-incoming.component";

export const INCOMING_ROUTES = [
  {path: '', component: AllIncomingComponent, pathMatch: 'full'},
  {path: ':inboxId', component: AllIncomingComponent}
];
