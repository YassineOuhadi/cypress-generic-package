/// <reference types="cypress" />
// cypress/generic/service/IGenericCommunication.ts

export interface IGenericRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"; // REST method, optional for SOAP
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  metadata?: Record<string, any>; // For SOAP: { operation, soapAction }
}

export interface IGenericResponse<T = any> {
  status?: number;                // HTTP-like (REST, SOAP)
  body?: T;                       // Parsed response (JSON, XML, message…)
  raw?: any;                      // Raw payload
  duration?: number;              // Latency
  metadata?: Record<string, any>; // Extra data, e.g., operation called
  event?: string;                 // For WebSocket events
}

export interface IGenericCommunication {
  key: string;
  baseUrl: string;
  defaultHeaders?: Record<string, string>;

  // Core entry point
  send(request: IGenericRequestOptions): Cypress.Chainable<IGenericResponse>;

  // Optional real-time hooks
  onMessage?(callback: (response: IGenericResponse) => void): void;

  // Common validation helpers
  validateStatus(response: IGenericResponse, expected: number): void;
  validateSchema(response: IGenericResponse, schema: object): void;
  validateContains(response: IGenericResponse, key: string): void;
}
