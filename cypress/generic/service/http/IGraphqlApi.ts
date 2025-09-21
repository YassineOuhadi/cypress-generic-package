/// <reference types="cypress" />
import { IGenericCommunication, IGenericRequestOptions, IGenericResponse } from "../core/IGenericCommunication";

export interface IGraphqlApi extends IGenericCommunication {
  query(query: string, variables?: Record<string, any>, options?: IGenericRequestOptions): Cypress.Chainable<IGenericResponse>;
  mutation(mutation: string, variables?: Record<string, any>, options?: IGenericRequestOptions): Cypress.Chainable<IGenericResponse>;
}
