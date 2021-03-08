import {AppPage} from './app.po';
import {$, browser, by, element, protractor} from 'protractor';

describe('send messages test', () => {
  let page: AppPage;
  const until = protractor.ExpectedConditions;
  const $recipientsInput = $('input');
  const $submitButton = $('button[type=submit]');

  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
    page.loginToInrupt();
  });

  it('form input validation + reading profile name', () => {
    element(by.linkText('Send message')).click();
    element(by.linkText('Simple message')).click();

    expect($('h1').getText()).toEqual('Send message');

    const $error = $('mat-error');

    $submitButton.click();
    expect($error.getText()).toEqual('No recipients!');

    addRecipient('https://test-user1.inrupt.net/profile/card#me');
    expect($('mat-chip').getText()).toContain('Test User 1: https://test-user1.inrupt.net/inbox/')

    $submitButton.click();
    expect($error.getText()).toEqual('Message cannot be empty!');
  });

  it('send simple message', () => {
    element(by.linkText('Send message')).click();
    element(by.linkText('Simple message')).click();

    expect($('h1').getText()).toEqual('Send message');

    addRecipient('https://inbox1.inrupt.net/profile/card#me');

    const $messageTextarea = $('textarea');
    $messageTextarea.sendKeys('This is a message sent by an e2e test at ' + Date.now().toString());

    $submitButton.click();

    // snackbar is out of page root, can't use 'element(...)', but 'browser.driver.findElement(...)'
    expect(browser.driver.findElement(by.tagName('snack-bar-container')).getText()).not.toContain('error');
  });

  function addRecipient(webId: string) {
    $recipientsInput.sendKeys(webId);
    $recipientsInput.sendKeys(protractor.Key.ENTER);
    return browser.wait(until.visibilityOf($('mat-chip')), 20000, 'Recipient is loaded.');
  }
});
