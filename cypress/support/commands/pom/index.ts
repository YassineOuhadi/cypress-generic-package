/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { GenericPage } from "../../../generic/pom/impl/GenericPage";
import { PageResolver } from "../../resolver/pom/PageResolver";

Cypress.Commands.add("resolvePage", (page: string) => {
  const registry = Cypress.env("POM_REGISTRY");
  const resolver = new PageResolver(page, registry);
  return resolver.init().then(() => {
    Cypress.env('currentPageResolver', resolver);
    return resolver;
  });
});

Cypress.Commands.add("currentPageResolver", (): Cypress.Chainable<PageResolver> => {
  const resolver: PageResolver | undefined = Cypress.env('currentPageResolver');
  if (!resolver) {
    throw new Error('No page resolver is set. Call cy.resolvePage("<page>") first.');
  }
  return cy.wrap(resolver);
});

Cypress.Commands.add("currentPageObject", (): Cypress.Chainable<GenericPage> => {
  return cy.currentPageResolver().then(resolver => resolver.getPage());
});