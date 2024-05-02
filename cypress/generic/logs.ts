// generic/logs/assertionslogs.ts

/**
 * Logs an assertion and returns the assertion chainable.
 * 
 * @param message - The message to be logged.
 * @param assertion - The assertion chainable.
 * @returns The assertion chainable.
 */
const logAssertion = (
    message: string,
    assertion: Cypress.Chainable<any>
): Cypress.Chainable<any> => {
    return assertion.then(result => {
        const assertionPassed = !!result;
        const assertionResultMessage = assertionPassed ? 'Passed' : 'Failed';
        const logMessage = `${message}: ${assertionResultMessage}`;
        Cypress.log({
            name: 'Assertion',
            message: [logMessage],
            consoleProps: () => ({
                Message: message,
                Result: assertionResultMessage,
            })
        });
        return assertion;
    });
};


/**
 * Logs an intercept on event request.
 * 
 * @param httpMethod - The HTTP method of the intercepted request.
 * @param url - The URL of the intercepted request.
 * @param componentName - The name of the component that intercepted the request.
 */
const logInterceptRequest = (
    httpMethod: string,
    url: string,
    componentName: string
): void => {
    const logMessage = `InterceptRequest, ${httpMethod} METHOD, ${url}, ${componentName}`;
    Cypress.log({
        name: 'InterceptRequest',
        message: [logMessage],
        consoleProps: () => ({
            HttpMethod: httpMethod,
            Url: url,
            ComponentName: componentName,
        })
    });
};

export {
    logAssertion,
    logInterceptRequest
}