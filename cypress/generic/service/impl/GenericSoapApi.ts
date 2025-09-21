import { GenericCommunication } from "./GenericCommunication";
import { IGenericRequestOptions } from "../core/IGenericCommunication";

export class GenericSoapApi extends GenericCommunication {
  private namespace: string;

  constructor(key: string, baseUrl: string, namespace: string, headers?: Record<string, string>) {
    super(key, baseUrl, headers);
    if (!namespace) throw new Error(`Namespace is required for SOAP API '${key}'`);
    this.namespace = namespace;
  }

  private buildEnvelope(operation: string, args: Record<string, any>): string {
    const argsXml = Object.entries(args)
      .map(([k, v]) => `<${k}>${typeof v === "string" ? v : JSON.stringify(v)}</${k}>`)
      .join("");

    return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <${operation} xmlns="${this.namespace}">
      ${argsXml}
    </${operation}>
  </soap:Body>
</soap:Envelope>`;
  }

  protected prepareRequest(request: IGenericRequestOptions) {
    const metadata = request.metadata;
    if (!metadata || !metadata.operation || !metadata.soapAction) {
      throw new Error("SOAP request requires metadata: { operation, soapAction }");
    }

    const body = this.buildEnvelope(metadata.operation, request.body || {});
    const headers = {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: metadata.soapAction,
      ...this.defaultHeaders,
      ...(request.headers || {}),
    };

    return {
      url: this.baseUrl,
      method: "POST" as const,
      headers,
      body,
    };
  }
}
