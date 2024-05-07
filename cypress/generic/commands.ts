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

Cypress.Commands.add('onFail', { prevSubject: true }, (chainedSubject, message) => {
    cy.on('fail', (error, runnable) => {
        error.name = 'Error'
        error.message = message
        throw error // throw error to have test still fail
    })
    return chainedSubject
})

// Cypress.Commands.overwrite<'type', 'element'>(
//     'type',
//     (originalFn, element, text, options?: Partial<TypeOptions>) => {
//         if (options && options.sensitive) {
//             // turn off original log
//             options.log = false
//             // create our own log with masked message
//             Cypress.log({
//                 $el: element,
//                 name: 'type',
//                 message: '*'.repeat(text.length),
//             })
//         }

//         return originalFn(element, text, options)
//     }
// )

// Cypress.Commands.overwrite('should', (originalFn: any, ...args: any[]) => {
//     const [actual, assertion, expected, options] = args;
//     if (options && options.message) {
//         cy.on('fail', (error, runnable) => {
//             error.name = 'ShouldError';
//             error.message = options.message;
//             throw error; // throw error to have test still fail
//         });
//     }
//     return originalFn(actual, assertion, expected, options);
// });