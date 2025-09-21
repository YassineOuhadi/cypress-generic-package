// cypress/client/RestClient.ts
import { GenericRestApi } from "../../generic/service/impl/GenericRestApi";
import { IGenericResponse } from "../../generic/service/core/IGenericCommunication";
import { IRestApiWrapper } from "../wrappers/service/IRestApiWrapper";

export class RestClient {
  private api: GenericRestApi;

  constructor(private apiKey: string, private wrapper: IRestApiWrapper) {
    if (!wrapper.BASE_URL) {
      throw new Error(`BASE_URL is missing in REST wrapper for '${apiKey}'`);
    }

    this.api = new GenericRestApi(apiKey, wrapper.BASE_URL, wrapper.HEADERS);
  }

  send(
    params: {
      path: string; method?: "GET" | "POST" | "PUT" | "DELETE";
      body?: any; headers?: Record<string, string>
    }): Cypress.Chainable<IGenericResponse> {
    return this.api.send({
      metadata: { path: params.path },
      body: params.body,
      headers: params.headers,
      // method comes from wrapper.ENDPOINTS if not passed
      ...(params.method ? { method: params.method } : {})
    });
  }

  validateStatus(response: IGenericResponse, expected: number) {
    this.api.validateStatus(response, expected);
  }

  validateContains(response: IGenericResponse, key: string) {
    this.api.validateContains(response, key);
  }
}
