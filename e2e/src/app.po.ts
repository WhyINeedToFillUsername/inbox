import {$, browser, by, element, protractor} from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getNavbarHomeLinkText(): Promise<string> {
    return element(by.css('app-root app-navbar a#home')).getText() as Promise<string>;
  }

  loginToInrupt() {
    const until = protractor.ExpectedConditions;

    $('.login input').sendKeys("inrupt");
    $('.mat-option-text').click();
    $('#btnLogin').click();
    browser.waitForAngularEnabled(false);
    browser.wait(until.urlContains("inrupt.net/login"), 20000);

    $('#username').sendKeys("test-user1");
    $('#password').sendKeys("Inrupt@2021");
    $('#login').click();
    browser.waitForAngularEnabled(true);

    browser.wait(until.urlContains("/incoming"), 20000);
  }
}
