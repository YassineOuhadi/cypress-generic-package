// cypress/support/wrappers/IRestApiWrapper.ts
export interface IRestApiWrapper {
  BASE_URL: string;
  HEADERS?: Record<string, string>;

  ENDPOINTS?: Record<string, {
    PATH: string;
    METHOD?: "GET" | "POST" | "PUT" | "DELETE";
    HEADERS?: Record<string, string>;
    BODY_TEMPLATE?: Record<string, any>;
  }>;

  RESPONSE_SCHEMA?: Record<string, any>;
}