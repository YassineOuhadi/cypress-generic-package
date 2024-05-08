
// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import "./commands";

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {

      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(
        value: string
      ): Chainable<JQuery<HTMLElement>>

      /**
       * Custom command to type a few random words into input elements
       * @param count=3
       * @example cy.get('input').typeRandomWords()
       */
      typeRandomWords(
        count?: number,
        options?: Partial<TypeOptions>
      ): Chainable<JQuery<HTMLElement>>
      
      interceptAPIRequest(
        method: string, 
        url: string, 
        alias: string
      ): Chainable<any>;

      waitingAliasRequest(
        alias: string, 
        timeout?: number
      ): Chainable<any>;
      
      onFail(
        prevSubject: any, 
      ): Chainable<any>;
    }
  }
}