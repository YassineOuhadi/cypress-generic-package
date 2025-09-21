import { 
    assertStatusCodeInRange,
    assertStatusCodeNotInRange,
    assertURLIncludes, 
    assertURLNotIncludes 
} from "../assertions/chainable";

/**
 * Utility class to assert the result of form submissions, API calls, or page transitions.
 */
export class SubmitResult {
    /**
     * Creates a chainable assertion object for a given path and status code.
     * 
     * @param path - The expected URL path to validate.
     * @param statusCode - The HTTP status code to validate.
     * @param isIncluded - Optional flag to toggle URL inclusion checks (default: true).
     */
    static expect(path: string, statusCode: number, isIncluded: boolean = true) {
        return {
            /**
             * Asserts that the submission was successful.
             */
            toBeSuccessful: () => {
                isIncluded ? assertURLIncludes(path) : assertURLNotIncludes(path);
                assertStatusCodeInRange(statusCode, 200, 299);
            },

            /**
             * Asserts that the submission failed.
             */
            toBeUnsuccessful: () => {
                isIncluded ? assertURLNotIncludes(path) : assertURLIncludes(path);
                assertStatusCodeNotInRange(statusCode, 200, 299);
            }
        };
    }
}