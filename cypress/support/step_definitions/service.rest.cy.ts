import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { IRestApiWrapper } from "../wrappers/service/IRestApiWrapper";
import { RestResolver } from "../resolver/service/RestResolver";
import { RestClient } from "../clients/RestClient";

let apiResolver: RestResolver;
let apiClient: RestClient;
let apiModel: IRestApiWrapper;
let lastResponse: any;

Given(/^I am using "([^"]+)"$/, (apiName: string) => {
  const registry = Cypress.env("SERVICE_REGISTRY");
  apiResolver = new RestResolver(apiName, registry);
  return apiResolver.init().then((wrapper) => {
    apiModel = wrapper;
    apiClient = apiResolver.getClient();
  });
});

When(/^I send a request to "([^"]+)"$/, (endpoint: string) => {
  return apiClient.send({ path: endpoint }).then((res: any) => lastResponse = res);
});

When(/^I send a (GET|POST|PUT|DELETE) request to "([^"]+)"$/, (method: string, endpoint: string) => {
  return apiClient.send({ path: endpoint, method: method as any }).then((res: any) => lastResponse = res);
});

When(/^I send a (POST|PUT) request to "([^"]+)" with body$/, (method: string, endpoint: string, dataTable: any) => {
  const body = dataTable.rowsHash();
  return apiClient.send({ path: endpoint, method: method as any, body }).then((res: any) => lastResponse = res);
});

Then(/^the response status should be (\d+)$/, (status: number) => {
  apiClient.validateStatus(lastResponse, status);
});

Then(/^the response should contain "([^"]+)"$/, (key: string) => {
  apiClient.validateContains(lastResponse, key);
});