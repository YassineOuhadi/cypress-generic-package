/// <reference types="cypress" />

import { IGenericCommunication, IGenericRequestOptions, IGenericResponse } from "../core/IGenericCommunication";

interface IWebSocketCommunication extends IGenericCommunication {
  // Connect to WebSocket endpoint
  connect(options?: IGenericRequestOptions): Cypress.Chainable<IGenericResponse>;

  // Send message over WebSocket
  sendMessage(message: string | object, options?: IGenericRequestOptions): Cypress.Chainable<IGenericResponse>;

  // Close WebSocket connection
  disconnect(): void;

  // Listen for messages (override base onMessage)
  onMessage(callback: (response: IGenericResponse) => void): void;

  // Listen for specific event (e.g., "open", "close", "error", "custom-event")
  onEvent(event: string, callback: (response: IGenericResponse) => void): void;
}

export { IWebSocketCommunication };
