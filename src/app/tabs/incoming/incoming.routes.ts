import {MessageListComponent} from "./message-list/message-list.component";
import {MessageDetailComponent} from "./message-detail/message-detail.component";

export const INCOMING_ROUTES = [
  {path: '', component: MessageListComponent, pathMatch: 'full'},
  {path: ':inboxId', component: MessageListComponent},
  {path: ':inboxId/:messageId', component: MessageDetailComponent}
];
