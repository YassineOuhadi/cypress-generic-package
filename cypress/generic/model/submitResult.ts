import { 
    assertStatusCodeInRange,
    assertStatusCodeNotInRange,
    assertURLIncludes, 
    assertURLNotIncludes 
} from "../assertions";

class SubmitResult {
    static expect(path: string, statusCode: number, isincluded?: boolean) {
        return {
            toBeSuccessful: () => {
                isincluded
                    ? assertURLIncludes(path)
                    : assertURLNotIncludes(path);

                // Assert that the status code is in the range of 200-299 for success
                assertStatusCodeInRange(statusCode, 200, 299);
            },

            toBeUnsuccessful: () => {
                isincluded
                    ? assertURLNotIncludes(path)
                    : assertURLIncludes(path);

                // Assert that the status code is not in the range of 200-299 for failure
                assertStatusCodeNotInRange(statusCode, 200, 299);
            }
        };
    }
}

export {
    SubmitResult
};