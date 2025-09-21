// cypress/client/SoapClient.ts
import { GenericSoapApi } from "../../generic/service/impl/GenericSoapApi";
import { IGenericResponse } from "../../generic/service/core/IGenericCommunication";
import { ISoapWrapper } from "../wrappers/service/ISoapWrapper";

export class SoapClient {
  private api: GenericSoapApi;

  constructor(private apiKey: string, private wrapper: ISoapWrapper) {
    if (!wrapper.WSDL_URL) {
      throw new Error(`WSDL_URL is missing in SOAP wrapper for '${apiKey}'`);
    }
    if (!wrapper.NAMESPACE) {
      throw new Error(`NAMESPACE is missing in SOAP wrapper for '${apiKey}'`);
    }

    this.api = new GenericSoapApi(apiKey, wrapper.WSDL_URL, wrapper.NAMESPACE, wrapper.HEADERS);
  }

  call(
    operation: string,
    args: Record<string, any> = {},
    extraHeaders?: Record<string, string>
  ): Cypress.Chainable<IGenericResponse> {
    const opConfig = this.wrapper.OPERATIONS?.[operation];
    if (!opConfig) {
      throw new Error(`Operation '${operation}' is not defined in SOAP wrapper`);
    }

    const mergedArgs = { ...(opConfig.DEFAULT_ARGS || {}), ...args };
    const soapAction = opConfig.SOAPAction || `${this.wrapper.WSDL_URL}/${operation}`;

    return this.api.send({
      body: mergedArgs,
      headers: extraHeaders,
      metadata: {
        operation,
        soapAction,
      },
    });
  }

  validateStatus(response: IGenericResponse, expected: number): void {
    this.api.validateStatus(response, expected);
  }

  validateContains(response: IGenericResponse, key: string): void {
    this.api.validateContains(response, key);
  }
}