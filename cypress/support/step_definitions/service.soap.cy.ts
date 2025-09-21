import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { SoapResolver } from "../resolver/service/SoapResolver";

let soapResolver: SoapResolver;
let lastResponse: any;

Given(/^I am using SOAP API "([^"]+)"$/, (apiName: string) => {
  const registry = Cypress.env("SERVICE_REGISTRY");
  soapResolver = new SoapResolver(apiName, registry);
  return soapResolver.init();
});

When(/^I call SOAP operation "([^"]+)"$/, (operation: string) => {
  return soapResolver.getClient().call(operation).then(res => lastResponse = res);
});

When(/^I call SOAP operation "([^"]+)" with args$/, (operation: string, dataTable: any) => {
  const args = dataTable.rowsHash();
  return soapResolver.getClient().call(operation, args).then(res => lastResponse = res);
});

Then(/^the SOAP response should contain "([^"]+)"$/, (expected: string) => {
  expect(JSON.stringify(lastResponse.body)).to.include(expected);
});


