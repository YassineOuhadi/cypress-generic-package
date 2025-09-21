// cypress/support/wrappers/ISoapWrapper.ts
export interface ISoapWrapper {
  WSDL_URL: string;
  NAMESPACE: string;
  HEADERS?: Record<string, string>;

  OPERATIONS?: Record<string, {
    SOAPAction?: string;
    HEADERS?: Record<string, string>;
    DEFAULT_ARGS?: Record<string, any>;
  }>;
}