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
});
