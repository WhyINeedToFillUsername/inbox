import {$, $$, browser, by, element, protractor} from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getNavbarHomeLinkText(): Promise<string> {
    return element(by.css('app-root app-navbar a#home')).getText() as Promise<string>;
  }

  loginToInrupt() {
    const until = protractor.ExpectedConditions;

    $('.login input').sendKeys("https://inrupt.net/");
    $$('.mat-option-text').first().click();
    $('#btnLogin').click();
    browser.waitForAngularEnabled(false);

    browser.wait(until.urlContains("inrupt.net/login"), 5000).then(() => {
      // fill form on inrupt login page
      $('#username').sendKeys("test-user1");
      $('#password').sendKeys("Inrupt@2021");
      $('#login').click();

      browser.wait(until.urlContains("inrupt.net/sharing"), 5000, "app authorized").then(() => {
        // we need to authorize this app
        expect($('h1').getText()).toContain("Authorize");
        const authorizeButton = $('form button[name=consent]');
        browser.wait(until.elementToBeClickable(authorizeButton), 5000, 'authorize button not clickable').then(() => {
          authorizeButton.click().then(this.waitForMessagesListLoaded);
        });
      }).catch(this.waitForMessagesListLoaded); // app was already authorized
    }).catch(this.waitForMessagesListLoaded); // we are already logged in, inrupt redirects back to app immediately
  }

  waitForMessagesListLoaded() {
    const until = protractor.ExpectedConditions;
    browser.waitForAngularEnabled(true);
    browser.wait(until.urlContains("/incoming"), 20000, "Page is not /incoming.");
    expect(browser.getCurrentUrl()).toContain("/incoming");
  }
}
