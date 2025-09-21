import { GenericGraphqlApi } from "../../generic/service/impl/GenericGraphqlApi";
import { IGenericRequestOptions, IGenericResponse } from "../../generic/service/core/IGenericCommunication";
import { IGraphQLWrapper } from "../wrappers/service/IGraphQLWrapper";

export class GraphQLClient {
  private api: GenericGraphqlApi;

  constructor(private apiKey: string, private wrapper: IGraphQLWrapper) {
    if (!wrapper.URL) throw new Error("GraphQL URL is missing in wrapper");
    this.api = new GenericGraphqlApi(apiKey, wrapper.URL, wrapper.HEADERS);
  }

  private call(request: IGenericRequestOptions): Cypress.Chainable<IGenericResponse> {
    return this.api.send(request);
  }

  query(queryOrKey: string, variables?: Record<string, any>, extraHeaders?: Record<string, string>) {
    let query = queryOrKey;
    let vars = variables;

    if (this.wrapper.QUERIES?.[queryOrKey]) {
      query = this.wrapper.QUERIES[queryOrKey].QUERY;
      vars = variables ?? this.wrapper.QUERIES[queryOrKey].VARIABLES;
    }

    return this.call({
      body: { query, variables: vars },
      headers: extraHeaders,
      metadata: { type: "query", key: queryOrKey },
    });
  }

  mutation(mutationOrKey: string, variables?: Record<string, any>, extraHeaders?: Record<string, string>) {
    let mutation = mutationOrKey;
    let vars = variables;

    if (this.wrapper.MUTATIONS?.[mutationOrKey]) {
      mutation = this.wrapper.MUTATIONS[mutationOrKey].MUTATION;
      vars = variables ?? this.wrapper.MUTATIONS[mutationOrKey].VARIABLES;
    }

    return this.call({
      body: { query: mutation, variables: vars },
      headers: extraHeaders,
      metadata: { type: "mutation", key: mutationOrKey },
    });
  }
}