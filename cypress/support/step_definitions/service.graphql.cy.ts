import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { GraphQLResolver } from "../resolver/service/GraphQLResolver";

let graphqlResolver: GraphQLResolver;
let lastResponse: any;

Given(/^I am using GraphQL API "([^"]+)"$/, (apiName: string) => {
  const registry = Cypress.env("SERVICE_REGISTRY");
  graphqlResolver = new GraphQLResolver(apiName, registry);
  return graphqlResolver.init();
});

When(/^I send GraphQL (query|mutation) "([^"]+)"$/, (type: string, key: string, variables?: string) => {
  const vars = variables ? JSON.parse(variables) : undefined;

  if (type === "query") {
    return graphqlResolver.getClient().query(key, vars).then(res => lastResponse = res);
  } else {
    return graphqlResolver.getClient().mutation(key, vars).then(res => lastResponse = res);
  }
});

When(/^I send GraphQL (query|mutation)$/, (type: string, query: string, variables?: string) => {
  const vars = variables ? JSON.parse(variables) : undefined;

  if (type === "query") {
    return graphqlResolver.getClient().query(query.trim(), vars).then(res => lastResponse = res);
  } else {
    return graphqlResolver.getClient().mutation(query.trim(), vars).then(res => lastResponse = res);
  }
});

Then(/^the GraphQL response should contain "([^"]+)"$/, (expected: string) => {
  expect(JSON.stringify(lastResponse.body)).to.include(expected);
});
