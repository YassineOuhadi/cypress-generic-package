// cypress/support/resolvers/GraphQLResolver.ts
import { IGraphQLWrapper } from "../../wrappers/service/IGraphQLWrapper";
import { ICommWrapper } from "../../wrappers/service/ICommWrapper";
import { GraphQLClient } from "../../clients/GraphQLClient";

export class GraphQLResolver {
  private client?: GraphQLClient;
  private wrapper?: IGraphQLWrapper;

  constructor(private apiKey: string, private registry: Record<string, any>) {}

  init(): Cypress.Chainable<IGraphQLWrapper> {
    return cy.task("loadCommunicationWrapper", {
      key: this.apiKey,
      registry: this.registry,
    }).then((result) => {
      const { type, wrapper } = result as ICommWrapper;

      if (type !== "graphql") {
        throw new Error(`Expected GraphQL wrapper but got ${type}`);
      }

      this.wrapper = wrapper as IGraphQLWrapper;
      this.client = new GraphQLClient(this.apiKey, this.wrapper);
      return cy.wrap(this.wrapper);
    });
  }

  getClient(): GraphQLClient {
    if (!this.client) throw new Error("GraphQL client not initialized");
    return this.client;
  }
}