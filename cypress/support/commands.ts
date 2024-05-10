// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
// cypress/generic/commands.ts

import {
    generateRandomWords
} from "../utils";

// interface TypeOptions extends Cypress.TypeOptions {
//     sensitive: boolean
// }

Cypress.Commands.add('dataCy', (value) => {
    return cy.get(`[data-cy=${value}]`)
})

Cypress.Commands.add(
    'typeRandomWords',
    { prevSubject: 'element' },
    (subject /* :JQuery<HTMLElement> */, count = 3, options?) => {
        return cy.wrap(subject).type(generateRandomWords(count), options)
    }
)

Cypress.Commands.add("interceptAPIRequest", (method: string, url: string, alias: string) => {
    if (['GET', 'POST', 'PUT', 'DELETE'].includes(method)) {
        cy.intercept(method, url).as(alias);
    } else {
        throw new Error('Unsupported HTTP method');
    }
});

Cypress.Commands.add("waitingAliasRequest", (alias: string, timeout?: number) => {
    cy.wait('@' + alias, {
        requestTimeout:
            timeout
                ? timeout
                : 20000
    });
});

Cypress.Commands.add('onFail', (message): any => {

    let listener = (error: { name: string; message: string; }, runnable: any) => {
        error.name = 'CustomError'
        error.message = message
        throw error // throw error to have test still fail
    }

    cy.on('fail', listener)

    return listener
})

Cypress.Commands.add('removeFailListener', (listener): any => {

    const defaultlistener = (error: { name: any; message: any; }) => {
        error.name = error.name
        error.message = error.message
        throw error
    }

    let removelistener = () => {
        cy.removeListener('fail', listener)
        cy.removeListener('command:end', removelistener)
        cy.on('fail', defaultlistener)
    }
    
    removelistener()
})

// Cypress.Commands.overwrite('should', (originalFn, actual, assertion, expected, options) => {
//     if (options && options.message) {
//         const listener = (error, runnable) => {
//             error.name = 'CustomError'
//             error.message = options.message
//             throw error // throw error to have test still fail
//         }

//         //   (cy as any).removeAllListeners('fail') // remove all 'fail' listeners
//         const removeListener = () => {

//             cy.removeListener('fail', listener)
//             cy.removeListener('command:end', removeListener)
//         }

//         cy.on('fail', listener)
//         cy.on('command:end', removeListener)
//     }

//     return originalFn(actual, assertion, expected, options)
// })