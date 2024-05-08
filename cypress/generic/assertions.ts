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
    partialURL: string
): Cypress.Chainable<boolean> => {
    // Return the Cypress.Chainable<boolean> instance
    return cy.url().then(url => {
        const assertionPassed = url.includes(partialURL);
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
    partialURL: string
): Cypress.Chainable<boolean> => {
    const assertion = cy.url()
        .should('not.include', partialURL);

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
    max: number
): void => {
    if (statusCode < min || statusCode > max) {
        throw new Error(`Expected status code to be in range ${min}-${max}, but received ${statusCode}`);
    }
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
    max: number
): void => {
    if (statusCode >= min && statusCode <= max) {
        throw new Error(`Expected status code to not be in range ${min}-${max}, but received ${statusCode}`);
    }
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
    expectedLength?: number
): Cypress.Chainable<any> => {
    if (expectedLength) {
        selector.then(elements => {
            expect(elements.length)
                .to.equal(expectedLength);
        });
        return logAssertion(`Assert Elements Length to be ${expectedLength}`, selector);
    }

    const assertion = selector.should('exist');
    return logAssertion('Assert Element Existence', assertion);
};

/**
 * Asserts that the element is visible.
 * 
 * @param selectorOrElement - The selector or Cypress.Chainable object representing the element to assert.
 * @returns A Cypress.Chainable object representing the assertion result.
 */
const assertElementVisible = (
    selectorOrElement: Cypress.Chainable<any>
): Cypress.Chainable<any> => {
    const assertion = selectorOrElement.should('be.visible');
    return logAssertion('Assert Element Visible', assertion);
};

/**
 * Asserts that the element is not visible.
 * 
 * @param selector - The selector string representing the element to assert.
 * @returns A Cypress.Chainable object representing the assertion result.
 */
const assertElementNotVisible = (
    selector: string
): Cypress.Chainable<any> => {
    const assertion = cy.get(selector).should('not.be.visible');

    return logAssertion('Assert Element Not Visible', assertion);
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
    property?: string
) => {
    // Iterate through each text value and assert the specified property
    const assertion = property
        ? cyselector(selectorOrElement).should(as, property!, value)
        : cyselector(selectorOrElement).should(as, value);

    return logAssertion(`Assert Element "${as}" "${property || ''}" "${value}"`, assertion);
};

/**
 * Asserts that the element contains the specified values.
 * 
 * @param selectorOrElement - The selector or Cypress.Chainable object representing the element to assert.
 * @param values - The value(s) to assert.
 * @returns A Cypress.Chainable object representing the assertion result.
 */
const assertElementContains = (
    selectorOrElement: string | Cypress.Chainable<any>,
    values: string | string[]
) => {
    // Convert single string to an array
    const texts = Array.isArray(values) ? values : [values];

    // Iterate through each text value and assert element contains it
    return texts.forEach(text => {
        const assertion = cyselector(selectorOrElement)
            .onFail(`Failed to find ${text}.`)
            .should('exist')
            .wait(100)
            .should('contain', text)
        return logAssertion(`Assert Element Contains "${text}"`, assertion);
    });
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
    text: string
) => {
    const assertion = cyselector(selectorOrElement).should('not.contain', text);
    return logAssertion(`Assert Element Not Contains "${text}"`, assertion);
};

/**
 * Asserts that the element is enabled.
 * 
 * @param selectorOrElement - The selector or Cypress.Chainable object representing the element to assert.
 * @returns A Cypress.Chainable object representing the assertion result.
 */
const assertElementEnabled = (
    selectorOrElement: Cypress.Chainable<any>
): Cypress.Chainable<any> => {
    const assertion = selectorOrElement.should('be.enabled');
    return logAssertion('Assert Element Enabled', assertion);
};

/**
 * Asserts that the element is disabled.
 * 
 * @param selector - The selector string representing the element to assert.
 * @returns A Cypress.Chainable object representing the assertion result.
 */
const assertElementDisabled = (
    selector: string
): Cypress.Chainable<any> => {
    const assertion = cy.get(selector).should('be.disabled');
    return logAssertion('Assert Element Disabled', assertion);
};

/**
 * Asserts that the button is enabled.
 * 
 * @param selectorOrElement - The selector or Cypress.Chainable object representing the button to assert.
 * @returns A Cypress.Chainable object representing the assertion result.
 */
const assertButtonEnabled = (
    selectorOrElement: string | Cypress.Chainable<any>
) => {
    const assertion = cyselector(selectorOrElement)
        .should('exist');

    assertion
        .should('be.visible')
        .should('be.enabled');

    return logAssertion('Assert Button Enabled', assertion);
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
    text: string
) => {
    const assertion = cyselector(selectorOrElement).should('exist');

    cy.get('.pagination > li:nth-child(7)').then(($ele) => {
        if ($ele.find('a').attr('aria-disabled') === 'true') {
            // Button is disabled, do nothing
            return;
        } else {
            // Button is enabled, click it and recursively call maybeClick
            cy.get('.pagination > :nth-child(6)').click().then(() => {
                // Perform the assertion
                assertion.contains(where, text).should('be.visible').then((result) => {
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

    return logAssertion(`Assert Table Contains "${text}" at "${where}"`, assertion);
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
    selectorOrElement: string | Cypress.Chainable<any>
) {
    let assertion = cyselector(selectorOrElement)
        .should('exist');

    assertion
        .should('not.have.attr', 'type', 'text');

    // Check if the element is a select element
    assertion = assertion
        .should('have.prop', 'tagName', 'SELECT')
        .should('be.visible')
        .and('be.enabled');

    return logAssertion('Wait Until Select', assertion);
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
    condition: boolean
): Cypress.Chainable<any> => {
    const assertion = condition
        ? cy.get(selector)
            .should('exist')
            .should('be.visible')
        : cy.get(selector)
            .should('not.exist');

    return logAssertion('Assert Element With Condition', assertion);
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
    expectedValue: string
) => {
    const elementsWithExpectedColor = $element.filter(function () {
        return Cypress.$(this).css(property) === expectedValue;
    });
    return expect(elementsWithExpectedColor.length).to.be.greaterThan(0, `At least one element with the expected ${property} "${expectedValue}" was found`);
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