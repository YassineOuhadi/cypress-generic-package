// WebSocketClient.ts
import { IGenericResponse, IGenericRequestOptions } from "../../generic/service/core/IGenericCommunication";
import { GenericWebSocketApi } from "../../generic/service/impl/GenericWebSocketApi";
import { IWebSocketWrapper } from "../wrappers/service/IWebSocketWrapper";

export class WebSocketClient {
  private api: GenericWebSocketApi;

  constructor(private apiKey: string, private wrapper: IWebSocketWrapper) {
    if (!wrapper.URL) throw new Error("WebSocket URL is missing in wrapper");
    this.api = new GenericWebSocketApi(apiKey, wrapper.URL, wrapper.HEADERS);
  }

  connect(): Cypress.Chainable<IGenericResponse> {
    return this.api.connect();
  }

  send(message: any, metadata?: Record<string, any>): Cypress.Chainable<IGenericResponse> {
    const request: IGenericRequestOptions = { body: message, metadata };
    return this.api.send(request);
  }

  disconnect(): void {
    this.api.disconnect();
  }

  onMessage(callback: (response: IGenericResponse) => void): void {
    this.api.onMessage(callback);
  }

  onEvent(event: string, callback: (response: IGenericResponse) => void): void {
    this.api.onEvent(event, callback);
  }
}
