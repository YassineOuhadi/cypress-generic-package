import { ISoapWrapper } from "../../wrappers/service/ISoapWrapper";
import { ICommWrapper } from "../../wrappers/service/ICommWrapper";
import { SoapClient } from "../../clients/SoapClient";

export class SoapResolver {
  private client?: SoapClient;
  private wrapper?: ISoapWrapper;

  constructor(private apiKey: string, private registry: Record<string, any>) { }

  init(): Cypress.Chainable<ISoapWrapper> {
    return cy.task("loadCommunicationWrapper", { 
      key: this.apiKey, 
      registry: this.registry 
    }).then((result) => {
        const { type, wrapper } = result as ICommWrapper;
        
        if (type !== "soap") {
          throw new Error(`Expected SOAP wrapper but got ${type}`);
        }
        
        this.wrapper = wrapper as ISoapWrapper;
        this.client = new SoapClient(this.apiKey, this.wrapper);
        
        return cy.wrap(this.wrapper);
      });
  }

  getClient(): SoapClient {
    if (!this.client) throw new Error("SOAP client not initialized");
    return this.client;
  }

  getWrapper(): ISoapWrapper { //TODO: add IAPIClient.ts
      if (!this.wrapper) throw new Error(`SOAP wrapper for ${this.apiKey} not initialized`);
      return this.wrapper;
  }
}