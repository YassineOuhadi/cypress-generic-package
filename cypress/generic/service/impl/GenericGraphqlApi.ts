import { GenericCommunication } from "./GenericCommunication";
import { IGenericRequestOptions } from "../core/IGenericCommunication";

export class GenericGraphqlApi extends GenericCommunication {
  constructor(key: string, baseUrl: string, headers?: Record<string, string>) {
    super(key, baseUrl, headers);
  }

  protected prepareRequest(request: IGenericRequestOptions) {
    const body = request.body;
    if (!body?.query) {
      throw new Error("GraphQL request must include 'body.query'");
    }

    const headers = {
      "Content-Type": "application/json",
      ...this.defaultHeaders,
      ...(request.headers || {}),
    };

    return {
      url: this.baseUrl,
      method: "POST" as const,
      headers,
      body,
      timeout: request.timeout,
    };
  }
}