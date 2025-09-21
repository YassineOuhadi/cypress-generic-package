/// <reference types="cypress" />
import { IGenericCommunication, IGenericRequestOptions, IGenericResponse } from "../core/IGenericCommunication";

abstract class GenericCommunication implements IGenericCommunication {
  key: string;
  baseUrl: string;
  defaultHeaders?: Record<string, string>;

  constructor(key: string, baseUrl: string, headers?: Record<string, string>) {
    this.key = key;
    this.baseUrl = baseUrl;
    this.defaultHeaders = headers;
  }

  protected abstract prepareRequest(
    request: IGenericRequestOptions
  ): { url: string; method: "GET" | "POST" | "PUT" | "DELETE"; headers: Record<string, string>; body?: any };

  send(request: IGenericRequestOptions): Cypress.Chainable<IGenericResponse> {
    const { url, method, headers, body } = this.prepareRequest(request);

    return cy.request({
      method,
      url,
      headers,
      body,
      timeout: request.timeout,
      failOnStatusCode: false,
    }).then((res): IGenericResponse => ({
      status: res.status ?? 0,
      body: res.body ?? {},
      raw: res,
      duration: res.duration,
      metadata: request.metadata,
    }));
  }

  onMessage?(callback: (response: IGenericResponse) => void): void;

  validateStatus(response: IGenericResponse, expected: number): void {
    expect(response.status).to.eq(expected);
  }

  validateSchema(response: IGenericResponse, schema: object): void {
    expect(response.body).to.deep.include(schema);
  }

  validateContains(response: IGenericResponse, key: string): void {
    const content = typeof response.body === "string" ? response.body : JSON.stringify(response.body);
    expect(content).to.include(key);
  }
}

export { GenericCommunication };