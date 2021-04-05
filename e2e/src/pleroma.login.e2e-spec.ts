import {AppPage} from './app.po';
import {$, $$, browser, by, element, protractor} from 'protractor';

describe('pleroma login tests', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('login is shown', () => {
    page.navigateTo();
    element(by.linkText("Try Pleroma")).click();

    expect($('h1').getText()).toEqual('Pleroma');
    expect($('#pleroma-login-input').isDisplayed()).toBeTruthy();
  });

  it('login to pleroma works', () => {
    const until = protractor.ExpectedConditions;

    page.navigateTo();

    element(by.linkText("Try Pleroma")).click();
    expect($('h1').getText()).toEqual('Pleroma');

    $('#pleroma-login-input').sendKeys("https://greenish.red/users/test-user-1");
    $('#pleroma-login-submit').click();

    browser.waitForAngularEnabled(false).then(() => {
      browser.wait(until.urlContains("greenish.red/oauth/authorize"), 5000).then(() => {
        console.log("should be logging in")
        expect($('h1').getText()).toContain("greenish.red");

        browser.wait(until.elementToBeClickable($('button[type=submit]')), 5000, 'login button not clickable').then(() => {

          // fill form on greenish.red login page
          $('#authorization_name').sendKeys("test-user-1");
          $('#authorization_password').sendKeys("Greenish@2021");
          $('button[type=submit]').click();

          browser.waitForAngularEnabled(true);
          browser.wait(until.urlContains("/pleroma"), 20000, "Page is not /pleroma.").then(() => {

            expect(browser.getCurrentUrl()).toContain("/pleroma");
            expect($$('h2').first().getText()).toEqual('Your Pleroma statuses');
          });
        });
      });
    });
  });
});
