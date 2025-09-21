// cypress/resolver/service/RestResolver.ts
import { IRestApiWrapper } from "../../wrappers/service/IRestApiWrapper";
import { ICommWrapper } from "../../wrappers/service/ICommWrapper";
import { RestClient } from "../../clients/RestClient";

export class RestResolver {
  private client?: RestClient;
  private wrapper?: IRestApiWrapper;

  constructor(private apiKey: string, private registry: Record<string, any>) {}

  init(): Cypress.Chainable<IRestApiWrapper> {
    return cy.task("loadCommunicationWrapper", {
      key: this.apiKey,
      registry: this.registry,
    }).then((result) => {
      const { type, wrapper } = result as ICommWrapper;

      if (type !== "rest") {
        throw new Error(`RestResolver expected a REST type but got ${type} for key ${this.apiKey}`);
      }

      this.wrapper = wrapper as IRestApiWrapper;
      this.client = new RestClient(this.apiKey, this.wrapper);

      return cy.wrap(this.wrapper);
    });
  }

  getClient(): RestClient {
    if (!this.client) throw new Error(`REST client for ${this.apiKey} not initialized`);
    return this.client;
  }

  getWrapper(): IRestApiWrapper {
    if (!this.wrapper) throw new Error(`REST wrapper for ${this.apiKey} not initialized`);
    return this.wrapper;
  }
}
