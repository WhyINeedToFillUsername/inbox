import { AppPage } from './app.po';
import {$, browser, logging, protractor} from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('login is shown', () => {
    page.navigateTo();
    expect($('.login h1').getText()).toEqual('Inbox');
    expect($('.login input').isDisplayed()).toBeTruthy();
  });

  it('login input works', () => {
    page.navigateTo();
    const $loginInput = $('.login input');
    const $autocompleteSuggestion = $('.mat-option-text');

    $loginInput.sendKeys("inrupt");
    expect($autocompleteSuggestion.getText()).toEqual('https://inrupt.net/');

    $autocompleteSuggestion.click();
    expect($loginInput.getAttribute('value')).toEqual('https://inrupt.net/');
  });

  it('login to inrupt works', () => {
    page.navigateTo();

    page.loginToInrupt();

    expect(browser.getCurrentUrl()).toContain("/incoming");
  });
});
