// ***********************************************************
// cypress/shared/logs.ts
// Centralized logging utilities for assertions, network requests,
// user guidance, and standardized error messages.
// ***********************************************************

/**
 * Logs an assertion result and returns the chainable.
 * @param message - Description of the assertion.
 * @param assertion - Cypress.Chainable object to assert.
 * @returns The chainable assertion for further chaining.
 */
export const logAssertion = (
  message: string,
  assertion?: Cypress.Chainable<any>
): Cypress.Chainable<any> => {
  if (!assertion) return cy.wrap(null);

  return assertion.then((result) => {
    const passed = Boolean(result);
    const logMessage = `${message}: ${passed ? "Passed ✅" : "Failed ❌"}`;

    Cypress.log({
      name: "Assertion",
      message: [logMessage],
      consoleProps: () => ({ Message: message, Result: passed }),
    });

    return assertion;
  });
};

/**
 * Logs details of an intercepted network request.
 * @param method - HTTP method
 * @param url - Request URL
 * @param component - Component or context handling the request
 */
export const logInterceptRequest = (method: string, url: string, component: string): void => {
  Cypress.log({
    name: "InterceptRequest",
    message: [`${method} ${url} (${component})`],
    consoleProps: () => ({ Method: method, Url: url, Component: component }),
  });
};

/**
 * Logs a guidance message for the user.
 * @param message - The guidance message to display
 */
export const logUserGuidance = (message: string): void => {
  Cypress.log({
    name: "User Guidance",
    message: [`💡 ${message}`],
    consoleProps: () => ({ Guidance: message }),
  });
};

/**
 * Logs an error message guiding the user and stops the test.
 * @param message - The guidance/error message
 */
export const logUserError = (message: string): never => {
  Cypress.log({
    name: "User Error",
    message: [`⚠️ ${message}`],
    consoleProps: () => ({ Error: message }),
  });

  throw new Error(message);
};

/**
 * Standardized assertion errors for common failures
 */
export const AssertionErrors = Object.freeze({
  pageResolverNotInitialized: (pageName?: string) =>
    `PageResolver not initialized. Call "I visit '${pageName ?? "<page>"}' page" first."`,

  pageNotOpened: (pageName: string, path?: string) =>
    `Expected page "${pageName}" to be opened${path ? ` with path "${path}"` : ""}, but it was not.`,

  menuNotFound: (menuName: string) => `Menu "${menuName}" not found on the current page.`,

  formNotFound: (formName: string) => `Form "${formName}" not found on the current page.`,

  buttonNotFound: (btnName: string) => `Button "${btnName}" not found on the current page.`,
});