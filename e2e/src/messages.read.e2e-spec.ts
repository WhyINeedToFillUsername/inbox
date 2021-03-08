import { AppPage } from './app.po';
import {$, $$, browser, logging, protractor} from 'protractor';

describe('reading messages test', () => {
  let page: AppPage;
  const until = protractor.ExpectedConditions;

  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
    page.loginToInrupt();
  });

  it('list of messages is loaded and contains at least 1 message', () => {

    browser.wait(until.presenceOf($('table')), 20000, 'Messages not loaded.');

    expect($$('table tr').count()).toBeGreaterThan(1);
  });

  it('read message detail', () => {
    browser.wait(until.presenceOf($('table')), 20000, 'Messages not loaded.');

    const firstMessage = $$('table tr td').get(3);
    const firstMessageText = firstMessage.getText();

    firstMessage.click(); // click on first message
    expect($('h2').getText()).toContain("message detail");

    const $messageContent = $('.message');
    browser.wait(until.presenceOf($messageContent), 20000, 'Message detail not loaded.');
    expect($messageContent.getText()).toContain(firstMessageText);
  });
});
