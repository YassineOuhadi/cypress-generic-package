import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { PomAssertions } from '../../shared/assertions';
import { withCurrentPage } from '../helpers';
import { GenericForm } from '../../generic/pom/impl/GenericForm';

let data: any;

beforeEach(() => {
  Cypress.env('currentPageResolver', undefined);
  
  cy.fixture('loginData.json').then((json) => {
    data = json[0];
  });
});

Given(/^I visit "?([^"]+)"?(?: page)?$/, (page: string) => {
  cy.resolvePage(page).then((pResolver) => {
    pResolver.getPage().navigate();
  });
});

Given(/^I am on "?([^"]+)"?(?: page)?$/, (pageName: string) => {

  cy.resolvePage(pageName).then((resolver) => {
    PomAssertions.page.opened(resolver);
  });
});

Then(/^I should be on "?([^"]+)"?(?: page)?$/, (pageName: string) => {
  cy.resolvePage(pageName).then((resolver) => {
    PomAssertions.page.opened(resolver);
  });
});

When(/^I click on "?([^"]+)"? item from "?([^"]+)"?(?: menu)?$/, (itemKey: string, menuKey: string) => {
  withCurrentPage(resolver => {
    const menu = resolver.menus[menuKey as keyof typeof resolver.menus];
    if (!menu) throw new Error(`Menu "${menuKey}" not found in page "${resolver.getPage().key}"`);
    menu.selectItems(itemKey);
  });
});

When(/^I fill the form with data:$/, (table: any) => {
  withCurrentPage(resolver => {
    const form: GenericForm = resolver.forms["LoginForm" as keyof typeof resolver.forms];
    if (!form) throw new Error(`Form " not found in page "${resolver.getPage().key}"`);
    form.fill(data, []);
  });
});

Given(/^I submit the "?([^"]+)"?(?: form)?$/, (formName: string) => {
  withCurrentPage(resolver => {
    const form = resolver.forms[formName as keyof typeof resolver.forms];
    if (!form) throw new Error(`Form "${formName}" not found in page "${resolver.getPage().key}"`);
    form.submitForm();
  });
});

Then(/^I should see "([^"]*)"$/, (text: string) => {
  withCurrentPage(resolver => {
    resolver.getPage().contains(text); // .should('be.visible')
  });
});
