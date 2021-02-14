import {MessageListComponent} from "./message-list/message-list.component";
import {MessageDetailComponent} from "./message-detail/message-detail.component";

export const INCOMING_ROUTES = [
  {path: '', component: MessageListComponent, pathMatch: 'full'},
  {path: ':inboxUrl', component: MessageListComponent},
  {path: ':inboxUrl/:messageId', component: MessageDetailComponent}
];
