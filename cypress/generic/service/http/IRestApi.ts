/// <reference types="cypress" />
// cypress/generic/service/http/IRestApi.ts

import { IGenericCommunication, IGenericRequestOptions, IGenericResponse } from "../core/IGenericCommunication";

export interface IRestApi extends IGenericCommunication {
  get(path: string, options?: IGenericRequestOptions): Cypress.Chainable<IGenericResponse>;
  post(path: string, body: any, options?: IGenericRequestOptions): Cypress.Chainable<IGenericResponse>;
  put(path: string, body: any, options?: IGenericRequestOptions): Cypress.Chainable<IGenericResponse>;
  delete(path: string, options?: IGenericRequestOptions): Cypress.Chainable<IGenericResponse>;
}
