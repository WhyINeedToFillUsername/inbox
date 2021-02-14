import {MessageListComponent} from "./message-list/message-list.component";

export const INCOMING_ROUTES = [
  {path: '', component: MessageListComponent, pathMatch: 'full'},
  {path: ':inboxId', component: MessageListComponent}
];
