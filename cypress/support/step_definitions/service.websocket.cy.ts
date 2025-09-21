import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { WebSocketResolver } from "../resolver/service/WebSocketResolver";
import { WebSocketClient } from "../clients/WebSocketClient";

let wsResolver: WebSocketResolver;
let wsClient: WebSocketClient;
let lastMessage: any;

Given(/^I am connected to WebSocket API "([^"]+)"$/, (apiName: string) => {
  const registry = Cypress.env("SERVICE_REGISTRY");
  wsResolver = new WebSocketResolver(apiName, registry);
  return wsResolver.init().then(() => {
    wsClient = wsResolver.getClient();
    return wsClient.connect();
  });
});

When(/^I send WebSocket message$/, (dataTable: any) => {
  const payload = dataTable.rowsHash();
  return new Cypress.Promise((resolve) => {
    wsClient.onMessage((response) => {
      lastMessage = response.body;
      resolve(lastMessage);
    });
    wsClient.send(payload);
  });
});

When(/^I send WebSocket event "([^"]+)" with payload$/, (event: string, dataTable: any) => {
  const payload = dataTable.rowsHash();
  return new Cypress.Promise((resolve) => {
    wsClient.onMessage((response) => {
      lastMessage = response.body;
      resolve(lastMessage);
    });
    wsClient.send(event, payload);
  });
});

Then(/^the WebSocket response should contain "([^"]+)"$/, (expected: string) => {
  expect(JSON.stringify(lastMessage)).to.include(expected);
});

Then(/^I close the WebSocket connection$/, () => {
  return wsClient.disconnect();
});
