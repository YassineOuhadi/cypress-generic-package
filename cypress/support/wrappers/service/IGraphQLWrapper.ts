// cypress/support/wrappers/IGraphQLWrapper.ts
export interface IGraphQLWrapper {
  URL: string;
  HEADERS?: Record<string, string>;

  QUERIES?: Record<string, {
    QUERY: string;
    VARIABLES?: Record<string, any>;
  }>;

  MUTATIONS?: Record<string, {
    MUTATION: string;
    VARIABLES?: Record<string, any>;
  }>;
}
