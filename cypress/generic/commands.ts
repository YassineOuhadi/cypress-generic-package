// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
Cypress.Commands.add("interceptAPIRequest", (method: string, url: string, alias: string) => {
    if (['GET', 'POST', 'PUT', 'DELETE'].includes(method)) {
        cy.intercept(method, url).as(alias);
    } else {
        throw new Error('Unsupported HTTP method');
    }
});

Cypress.Commands.add("waitingAliasRequest", (alias: string, timeout?: number) => {
    cy.wait('@' + alias, { requestTimeout: 
        timeout
            ? timeout
            : 20000
     });
});