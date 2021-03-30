import {InruptStaticService} from "./inrupt.static.service";
import {InboxMessage} from "../../model/inbox.message";

describe('InruptStaticService', () => {
  it('should sort by created date, new first', () => {
    const messages: InboxMessage[] = [];

    const newMessage = new InboxMessage();
    newMessage.created = today();

    const oldMessage = new InboxMessage();
    oldMessage.created = yesterday();

    messages.push(oldMessage);
    messages.push(newMessage);

    expect(messages[0]).toEqual(oldMessage);

    const sorted = InruptStaticService.sortMessagesByDateDesc(messages);
    expect(sorted[0]).toEqual(newMessage);
  });

  it('should get name from inbox URL', () => {
    const parsed = InruptStaticService.getInboxNameFromUrl("https://inbox2.inrupt.net/coolInboxName/");
    expect(parsed).toEqual("coolInboxName");
  });

  it('should parse message with ActivityStreams type', () => {
    expect(InruptStaticService.shouldParseJson('application/ld+json; profile="https://www.w3.org/ns/activitystreams"'))
      .toBeTruthy();
  });

  it('parse message with ActivityStreams type', async () => {
    let originalMessage = new InboxMessage();
    originalMessage.type = 'application/ld+json; profile="https://www.w3.org/ns/activitystreams"';
    originalMessage.content = JSON.stringify({name: "test name", content: "message content"})

    let parsed = await InruptStaticService.parseActivityStreamsMessage(originalMessage)
    expect(parsed.name).toEqual("test name");
    expect(parsed.content).toEqual("message content");
  });

  it('parse fail', async () => {
    let originalMessage = new InboxMessage();
    originalMessage.type = 'application/json';

    let parsed = await InruptStaticService.parseActivityStreamsMessage(originalMessage)
    expect(parsed).toEqual(originalMessage);
  });

  it('should not parse message without ActivityStreams type', async () => {
    let originalMessage = new InboxMessage();
    originalMessage.type = "don't parse me";

    let parsed = await InruptStaticService.parseActivityStreamsMessage(originalMessage)
    expect(parsed).toEqual(originalMessage);
  });
});


function today() {
  return new Date();
}

function yesterday() {
  let date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
}
