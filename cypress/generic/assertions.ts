// generic/assertions.ts

import { logAssertion } from "./logs";

/**
 * Returns a Cypress.Chainable object representing the element(s) specified by the given selector or element.
 * 
 * @param selectorOrElement - The selector string or Cypress.Chainable object representing the element(s) to select.
 * @returns A Cypress.Chainable object representing the selected element(s).
 */
const cyselector = (
    selectorOrElement: string | Cypress.Chainable<any>
): Cypress.Chainable<any> => {
    if (typeof selectorOrElement === 'string') {
        return cy.get(selectorOrElement);
    } else {
        return selectorOrElement;
    }
};

/**
 * Asserts that the URL includes the specified partial URL.
 * 
 * @param partialURL - The partial URL to check for inclusion.
 * @returns A Cypress.Chainable<boolean> representing the assertion result.
 */
const assertURLIncludes = (
    partialURL: string,
    errormessage?: string
): Cypress.Chainable<boolean> => {
    // Return the Cypress.Chainable<boolean> instance
    return cy.url().then(url => {

        let assertionPassed;

        cy.onFail(
            errormessage
                ? errormessage
                : `Expected URL to include "${partialURL}", but received "${url}"`
        );

        assertionPassed = url.includes(partialURL);
        if (!assertionPassed) throw new Error();

        cy.removeFailListeners();

        const message = `Assert URL Includes "${partialURL}": ${assertionPassed ? 'Passed' : 'Failed'}`;
        return logAssertion(message, cy.wrap(assertionPassed)); // Return the assertion result
    }).then((result) => {
        // Return the assertion result to properly chain Cypress commands
        return result;
    });
};

/**
 * Asserts that the URL does not include the specified partial URL.
 * 
 * @param partialURL - The partial URL to check for exclusion.
 * @returns A Cypress.Chainable<boolean> representing the assertion result.
 */
const assertURLNotIncludes = (
    partialURL: string,
    errormessage?: string
): Cypress.Chainable<boolean> => {

    let assertion;

    cy.onFail(
        errormessage
            ? errormessage
            : `Expected URL to not include "${partialURL}" but received "${cy.url()}"`
    );

    assertion = cy.url()
        .should('not.include', partialURL);

    cy.removeFailListeners();

    return logAssertion(`Assert URL Not Includes "${partialURL}"`, assertion);
};

/**
 * Asserts that the status code is within the specified range.
 * 
 * @param statusCode - The status code to assert.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns void
 */
const assertStatusCodeInRange = (
    statusCode: number,
    min: number,
    max: number,
    errormessage?: string
): void => {
    cy.onFail(
        errormessage
            ? errormessage
            : `Expected status code to be in range ${min}-${max}, but received ${statusCode}`
    );

    if (statusCode < min || statusCode > max) throw new Error();

    cy.removeFailListeners();
}

/**
 * Asserts that the status code is not within the specified range.
 * 
 * @param statusCode - The status code to assert.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns void
 */
const assertStatusCodeNotInRange = (
    statusCode: number,
    min: number,
    max: number,
    errormessage?: string
): void => {
    cy.onFail(
        errormessage
            ? errormessage
            : `Expected status code to not be in range ${min}-${max}, but received ${statusCode}`
    );

    if (statusCode >= min && statusCode <= max) throw new Error();

    cy.removeFailListeners();
}

/**
 * Asserts the existence of the specified element(s).
 * 
 * @param selector - The selector or Cypress.Chainable object representing the element(s) to assert.
 * @param expectedLength - The expected number of elements (optional).
 * @returns A Cypress.Chainable object representing the assertion result.
 */
const assertElementExist = (
    selector: Cypress.Chainable<any>,
    expectedLength?: number,
    errormessage?: string
): Cypress.Chainable<any> => {
    let assertion;

    let message;
    expectedLength
        ? message = `Assert Elements Length to be ${expectedLength}`
        : message = 'Assert Element Existence';

    cy.onFail(
        errormessage
            ? errormessage
            : message
    );

    if (expectedLength) {
        selector.then(elements => {
            expect(elements.length)
                .to.equal(expectedLength);
        });

        cy.removeFailListeners();
        logAssertion(`Assert Elements Length to be ${expectedLength}`, selector);
        return selector;
    }

    assertion = selector.should('exist');

    cy.removeFailListeners();
    logAssertion('Assert Element Existence', assertion);
    return assertion;
};

/**
 * Asserts that the element is visible.
 * 
 * @param selectorOrElement - The selector or Cypress.Chainable object representing the element to assert.
 * @returns A Cypress.Chainable object representing the assertion result.
 */
const assertElementVisible = (
    selectorOrElement: Cypress.Chainable<any>,
    errormessage?: string
): Cypress.Chainable<any> => {
    let assertion;

    cy.onFail(
        errormessage
            ? errormessage
            : `Expected element to be visible, but received ${selectorOrElement}`
    );

    assertion = selectorOrElement
        .should('be.visible');

    cy.removeFailListeners();

    logAssertion('Assert Element Visible', assertion);
    return assertion;
};

/**
 * Asserts that the element is not visible.
 * 
 * @param selector - The selector string representing the element to assert.
 * @returns A Cypress.Chainable object representing the assertion result.
 */
const assertElementNotVisible = (
    selector: string,
    errormessage?: string
): Cypress.Chainable<any> => {
    let assertion;

    cy.onFail(
        errormessage
            ? errormessage
            : `Expected element not to be visible.`
    );

    assertion = cy.get(selector)
        .should('not.be.visible');

    cy.removeFailListeners();
    logAssertion('Assert Element Not Visible', assertion);
    return assertion;
};

/**
 * Asserts the specified property or value of the element.
 * 
 * @param selectorOrElement - The selector or Cypress.Chainable object representing the element to assert.
 * @param as - The assertion method to use (should, have.val, have.css, have.class, have.attr).
 * @param value - The value to assert.
 * @param property - The property to assert (optional).
 * @returns A Cypress.Chainable object representing the assertion result.
 */
const assertElementShould = (
    selectorOrElement: string | Cypress.Chainable<any>,
    as: string,
    value: string,
    property?: string,
    errormessage?: string
) => {
    let assertion;

    cy.onFail(
        errormessage
            ? errormessage
            : `Failed to assert element "${as}" "${property || ''}" "${value}"`
    );

    // Iterate through each text value and assert the specified property
    assertion = property
        ? cyselector(selectorOrElement).should(as, property!, value)
        : cyselector(selectorOrElement).should(as, value);

    cy.removeFailListeners();
    logAssertion(`Assert Element "${as}" "${property || ''}" "${value}"`, assertion);
    return assertion;
};

/**
 * Asserts that the element contains the specified values.
 * 
 * @param selectorOrElement - The selector or Cypress.Chainable object representing the element to assert.
 * @param values - The value(s) to assert.
 * @returns A Cypress.Chainable object representing the latest assertion result.
 */
const assertElementContains = (
    selectorOrElement: string | Cypress.Chainable<any>,
    values: string | string[],
    errormessage?: string
): Cypress.Chainable<any> => {
    let currentassertion: any;

    const array = Array.isArray(values)
        ? values
        : [values];

    let selector = cyselector(selectorOrElement);

    // Iterate through each text value and assert element contains it
    array.forEach(text => {

        cy.onFail(
            errormessage
                ? errormessage
                : `Failed to find ${text}.`
        );

        // currentassertion = selector
        //     .wait(400)
        //     .contains(text);

        currentassertion = selector
            .should('contain.text', text);

        cy.removeFailListeners();

        logAssertion(`Assert Element Contains "${text}"`, currentassertion);
    });

    return currentassertion;
};

/**
 * Asserts that the element does not contain the specified text.
 * 
 * @param selectorOrElement - The selector or Cypress.Chainable object representing the element to assert.
 * @param text - The text to check for exclusion.
 * @returns A Cypress.Chainable object representing the assertion result.
 */
const assertElementNotContains = (
    selectorOrElement: string | Cypress.Chainable<any>,
    text: string,
    errormessage?: string
) => {
    let assertion;

    cy.onFail(
        errormessage
            ? errormessage
            : `Failed, its contains ${text}.`
    );

    assertion = cyselector(selectorOrElement)
        .should('not.contain', text);

    cy.removeFailListeners();

    logAssertion(`Assert Element Not Contains "${text}"`, assertion);

    return assertion;
};

/**
 * Asserts that the element is enabled.
 * 
 * @param selectorOrElement - The selector or Cypress.Chainable object representing the element to assert.
 * @returns A Cypress.Chainable object representing the assertion result.
 */
const assertElementEnabled = (
    selectorOrElement: Cypress.Chainable<any>,
    errormessage?: string
): Cypress.Chainable<any> => {
    let assertion;

    cy.onFail(
        errormessage
            ? errormessage
            : `Expected element to be enabled, but received ${selectorOrElement}`
    );

    assertion = selectorOrElement.should('be.enabled');

    cy.removeFailListeners();
    logAssertion('Assert Element Enabled', assertion);
    return assertion;
};

/**
 * Asserts that the element is disabled.
 * 
 * @param selector - The selector string representing the element to assert.
 * @returns A Cypress.Chainable object representing the assertion result.
 */
const assertElementDisabled = (
    selector: string,
    errormessage?: string
): Cypress.Chainable<any> => {
    let assertion;

    cy.onFail(
        errormessage
            ? errormessage
            : `Expected element to be disabled, but received ${selector}`
    );

    assertion = cy.get(selector).should('be.disabled');

    cy.removeFailListeners();
    logAssertion('Assert Element Disabled', assertion);
    return assertion;
};

/**
 * Asserts that the button is enabled.
 * 
 * @param selectorOrElement - The selector or Cypress.Chainable object representing the button to assert.
 * @returns A Cypress.Chainable object representing the assertion result.
 */
const assertButtonEnabled = (
    selectorOrElement: string | Cypress.Chainable<any>,
    errormessage?: string
) => {
    let assertion;

    cy.onFail(
        errormessage
            ? errormessage
            : `Expected button to be enabled, but received ${selectorOrElement}`
    );

    assertion = cyselector(selectorOrElement)
        .should('exist');

    assertion
        .should('be.visible')
        .should('be.enabled');

    cy.removeFailListeners();
    logAssertion('Assert Button Enabled', assertion);
    return assertion;
};

/**
 * Asserts that the table contains the specified text at the specified location.
 * 
 * @param selectorOrElement - The selector or Cypress.Chainable object representing the table to assert.
 * @param where - The location within the table to search for the text.
 * @param text - The text to search for.
 * @returns A Cypress.Chainable object representing the assertion result.
 */
const assertTableContains = (
    selectorOrElement: string | Cypress.Chainable<any>,
    where: string,
    text: string,
    errormessage?: string
) => {
    let assertion: any;

    cy.onFail(
        errormessage
            ? errormessage
            : `Failed to find "${text}" at "${where}" in the table.`
    );

    assertion = cyselector(selectorOrElement)
        .should('exist');

    cy.get('.pagination > li:nth-child(7)').then(($ele) => {
        if ($ele.find('a').attr('aria-disabled') === 'true') { // Button is disabled, do nothing
            return;
        } else { // Button is enabled, click it and recursively call maybeClick
            cy.get('.pagination > :nth-child(6)').click().then(() => {
                assertion.contains(where, text).should('be.visible').then((result: any) => { // Perform the assertion
                    if (!result) {  // Assertion failed, continue to next page
                        nextPage();
                    } else { // Assertion succeeded, stop recursion
                        return;
                    }
                });

            });
        }
    });

    cy.removeFailListeners();
    logAssertion(`Assert Table Contains "${text}" at "${where}"`, assertion);
    return assertion;
};

/**
 * Performs the next page action.
 * 
 * @returns void
 */
const nextPage = () => {
    cy.get('.pagination > li:nth-child(7)').then(($ele) => {
        if ($ele.find('a').attr('aria-disabled') === 'true') {
            // Button is disabled, do nothing
            return;
        } else {
            // Button is enabled, click it and recursively call maybeClick
            cy.get('.pagination > :nth-child(6)').click().then(() => {

                // Perform the assertion
                cy.get('table').should('contain', 'expectedContent').then((result) => {
                    if (!result) {
                        // Assertion failed, continue to next page
                        nextPage();
                    } else {
                        // Assertion succeeded, stop recursion
                        return;
                    }
                });

            });
        }
    });
}

/**
 * Waits until the specified element is a select element and is visible and enabled.
 * 
 * @param selectorOrElement - The selector or Cypress.Chainable object representing the element to wait for.
 * @returns A Cypress.Chainable object representing the assertion result.
 */
function waitUntilSelect(
    selectorOrElement: string | Cypress.Chainable<any>,
    errormessage?: string
) {
    let assertion;

    cy.onFail(
        errormessage
            ? errormessage
            : `Expected element to be a select element, but received ${selectorOrElement}`
    );

    assertion = cyselector(selectorOrElement)
        .should('exist');

    assertion
        .should('not.have.attr', 'type', 'text');

    // Check if the element is a select element
    assertion = assertion
        .should('have.prop', 'tagName', 'SELECT')
        .should('be.visible')
        .and('be.enabled');

    cy.removeFailListeners();
    logAssertion('Wait Until Select', assertion);
    return assertion;
}

/**
 * Asserts the existence of the specified element or verifies its non-existence based on a condition.
 * 
 * @param selector - The selector string representing the element to assert.
 * @param condition - The condition to determine if the element should exist or not.
 * @returns A Cypress.Chainable object representing the assertion result.
 */
const existWithCondition = (
    selector: string,
    condition: boolean,
    errormessage?: string
): Cypress.Chainable<any> => {
    let assertion;

    cy.onFail(
        errormessage
            ? errormessage
            : `Expected element to ${condition ? 'exist' : 'not exist'}, but received ${selector}`
    );

    assertion = condition
        ? cy.get(selector)
            .should('exist')
            .should('be.visible')
        : cy.get(selector)
            .should('not.exist');

    cy.removeFailListeners();
    logAssertion('Assert Element With Condition', assertion);
    return assertion;
};

/**
 * Asserts that there is at least one element with the specified CSS property and value.
 * 
 * @param $element - The jQuery object representing the element(s) to assert.
 * @param property - The CSS property to check.
 * @param expectedValue - The expected value of the CSS property.
 * @returns A Chai assertion representing the result of the assertion.
 */
const assertAtLeastOneElementWithCssProperty = (
    $element: JQuery<HTMLElement>,
    property: string,
    expectedValue: string,
    errormessage?: string
) => {
    let assertion;

    cy.onFail(
        errormessage
            ? errormessage
            : `Failed to find an element with the expected ${property} "${expectedValue}"`
    );

    const elementsWithExpectedColor = $element.filter(function () {
        return Cypress.$(this).css(property) === expectedValue;
    });

    assertion = expect(elementsWithExpectedColor.length)
        .to.be.greaterThan(0, `At least one element with the expected ${property} "${expectedValue}" was found`);

    cy.removeFailListeners();
    logAssertion('Assert At Least One Element With CSS Property');
    return assertion;
};

export {
    assertURLIncludes,
    assertURLNotIncludes,
    assertStatusCodeInRange,
    assertStatusCodeNotInRange,
    assertElementExist,
    assertElementVisible,
    assertElementNotVisible,
    assertElementShould,
    assertElementContains,
    assertElementNotContains,
    assertElementEnabled,
    assertElementDisabled,
    assertButtonEnabled,
    assertTableContains,
    waitUntilSelect,
    existWithCondition,
    assertAtLeastOneElementWithCssProperty
}