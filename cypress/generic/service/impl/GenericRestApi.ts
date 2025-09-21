import { GenericCommunication } from "./GenericCommunication";
import { IGenericRequestOptions, IGenericResponse } from "../core/IGenericCommunication";

export class GenericRestApi extends GenericCommunication {
  constructor(key: string, baseUrl: string, headers?: Record<string, string>) {
    super(key, baseUrl, headers);
  }

  protected prepareRequest(request: IGenericRequestOptions) {
    const method = request.method || "GET";
    const path = request.metadata?.path || "";
    return {
      url: `${this.baseUrl}${path}`,
      method,
      headers: { ...this.defaultHeaders, ...(request.headers || {}) },
      body: request.body,
    };
  }

  get(path: string, options?: IGenericRequestOptions) {
    return this.send({ ...options, method: "GET", metadata: { path } });
  }
  post(path: string, body: any, options?: IGenericRequestOptions) {
    return this.send({ ...options, method: "POST", body, metadata: { path } });
  }
  put(path: string, body: any, options?: IGenericRequestOptions) {
    return this.send({ ...options, method: "PUT", body, metadata: { path } });
  }
  delete(path: string, options?: IGenericRequestOptions) {
    return this.send({ ...options, method: "DELETE", metadata: { path } });
  }
}
