import {AppPage} from './app.po';
import {$, browser, by, element, protractor} from 'protractor';

describe('send messages test', () => {
  let page: AppPage;
  const until = protractor.ExpectedConditions;
  const $recipientsInput = $('input');

  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
    page.loginToInrupt();
  });

  it('form input validation + reading profile name', async () => {
    element(by.linkText('Send message')).click();
    element(by.linkText('Simple message')).click();

    expect($('h1').getText()).toEqual('Send message');

    const $submitButton = $('button[type=submit]');
    const $error = $('mat-error');
    const $contact = $('mat-chip');

    $submitButton.click();
    expect($error.getText()).toEqual('No recipients!');


    $recipientsInput.sendKeys('https://test-user1.inrupt.net/profile/card#me');
    $recipientsInput.sendKeys(protractor.Key.ENTER);
    browser.wait(until.visibilityOf($contact), 20000, 'Recipient is loaded.');
    expect($contact.getText()).toContain('Test User 1: https://test-user1.inrupt.net/inbox/')

    $submitButton.click();
    expect($error.getText()).toEqual('Message cannot be empty!');
  });
});
