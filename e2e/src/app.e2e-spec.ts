import { AppPage } from './app.po';
import {$, browser, logging} from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getNavbarHomeLinkText()).toEqual('inbox');
  });

  it('home link goes to home', () => {
    page.navigateTo();
    $('a#home').getWebElement().click();
    expect(page.getNavbarHomeLinkText()).toEqual('inbox');
  });

  it('login is shown', () => {
    page.navigateTo();
    expect($('.login h1').getText()).toEqual('Inbox');
    expect($('.login input').isDisplayed()).toBeTruthy();
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
