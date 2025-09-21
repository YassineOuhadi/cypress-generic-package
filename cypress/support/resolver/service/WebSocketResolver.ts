import { WebSocketClient } from "../../clients/WebSocketClient";
import { ICommWrapper } from "../../wrappers/service/ICommWrapper";
import { IWebSocketWrapper } from "../../wrappers/service/IWebSocketWrapper";

export class WebSocketResolver {
  private client?: WebSocketClient;
  private wrapper?: IWebSocketWrapper;

  constructor(private apiKey: string, private registry: Record<string, any>) {}

  init(): Cypress.Chainable<IWebSocketWrapper> {
    return cy.task("loadCommunicationWrapper", {
      key: this.apiKey,
      registry: this.registry,
    }).then((result) => {
      const { type, wrapper } = result as ICommWrapper;
      if (type !== "websocket") throw new Error(`Expected WebSocket wrapper but got ${type}`);

      this.wrapper = wrapper as IWebSocketWrapper;
      this.client = new WebSocketClient(this.apiKey, this.wrapper);
      return cy.wrap(this.wrapper);
    });
  }

  getClient(): WebSocketClient {
    if (!this.client) throw new Error("WebSocket client not initialized");
    return this.client;
  }
}
