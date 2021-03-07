import { AppPage } from './app.po';
import {$, browser, by, element, logging} from 'protractor';

describe('homepage tests', () => {
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

  it('navigation bar works -> about page', () => {
    page.navigateTo();
    element(by.linkText("About")).click();
    expect($('h1').getText()).toEqual('About inbox');
  });
});
