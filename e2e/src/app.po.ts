import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getNavbarHomeLinkText(): Promise<string> {
    return element(by.css('app-root app-navbar a#home')).getText() as Promise<string>;
  }
}
