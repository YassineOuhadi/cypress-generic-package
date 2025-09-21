import { IGenericRequestOptions, IGenericResponse } from "../core/IGenericCommunication";
import { GenericCommunication } from "./GenericCommunication";

export class GenericWebSocketApi extends GenericCommunication {
  private socket?: WebSocket;

  constructor(key: string, baseUrl: string, headers?: Record<string, string>) {
    super(key, baseUrl, headers);
  }

  protected prepareRequest(request: IGenericRequestOptions) {
    const payload = typeof request.body === "string" ? request.body : JSON.stringify(request.body ?? {});

    return {
      url: this.baseUrl,
      method: "POST" as const,
      headers: { ...this.defaultHeaders, ...(request.headers || {}) },
      body: payload,
    };
  }

  connect(): Cypress.Chainable<IGenericResponse> {
    return cy.wrap(
      new Cypress.Promise<IGenericResponse>((resolve, reject) => {
        try {
          this.socket = new WebSocket(this.baseUrl);

          this.socket.onopen = () =>
            resolve({
              status: 101,
              body: { message: "Connected" },
              raw: null,
              duration: 0,
              metadata: { event: "open" },
            });

          this.socket.onerror = (err) => reject(err);
        } catch (err) {
          reject(err);
        }
      })
    );
  }

  send(request: IGenericRequestOptions): Cypress.Chainable<IGenericResponse> {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected");
    }
    const req = this.prepareRequest(request);
    return cy.wrap(new Promise<IGenericResponse>((resolve) => {
      this.socket!.send(req.body);
      resolve({
        status: 200,
        body: { sent: req.body },
        raw: req.body,
        duration: 0,
        event: "send",
        metadata: request.metadata,
      });
    }));
  }

  disconnect(): void {
    this.socket?.close();
  }

  onMessage(callback: (response: IGenericResponse) => void): void {
    if (!this.socket) return;
    this.socket.onmessage = (event) =>
      callback({ status: 200, body: event.data, raw: event, event: "message" });
  }

  onEvent(event: string, callback: (response: IGenericResponse) => void): void {
    if (!this.socket) return;
    this.socket.addEventListener(event, (raw) =>
      callback({ status: 200, body: raw, raw, event })
    );
  }
}