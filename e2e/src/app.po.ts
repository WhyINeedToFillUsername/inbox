import {$, $$, browser, by, element, protractor} from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getNavbarHomeLinkText(): Promise<string> {
    return element(by.css('app-root app-navbar a#home')).getText() as Promise<string>;
  }

  async loginToInrupt() {
    const until = protractor.ExpectedConditions;

    $('.login input').sendKeys("https://inrupt.net/");
    $$('.mat-option-text').first().click();
    $('#btnLogin').click();
    browser.waitForAngularEnabled(false);

    await browser.wait(until.urlContains("inrupt.net/login"), 4000).then(() => {
      $('#username').sendKeys("test-user1");
      $('#password').sendKeys("Inrupt@2021");
      $('#login').click();
    }).catch(ignore => {/* user has already been logged in, inrupt redirected back to our app immediately */});

    await browser.getCurrentUrl().then(url => {
    if (url.includes("inrupt.net/sharing")) {
      // we need to authorize this app
      $('button[type=submit][name=consent]').click();
    }
    });

    browser.waitForAngularEnabled(true);

    return browser.wait(until.urlContains("/incoming"), 20000, "Page is not /incoming.");
  }
}
