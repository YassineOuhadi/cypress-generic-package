// cypress/support/wrappers/IWebSocketWrapper.ts
export interface IWebSocketWrapper {
  URL: string;
  PROTOCOLS?: string[];
  HEADERS?: Record<string, string>;
}
