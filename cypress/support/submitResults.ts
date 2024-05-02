import { assertURLIncludes, assertURLNotIncludes } from "../generic/assertions";

class SubmitResults {
    static expect(path: string) {
        return {
            toBeSuccessful: () => {
                // Assert that the URL does not include 'partial-path' if submission is successful
                return assertURLNotIncludes(path);
            },

            toBeUnsuccessful: () => {
                // Assert that the URL includes 'partial-path' if submission is unsuccessful
                return assertURLIncludes(path);
            },
        };
    }

    // TODO: also the same with the status result code
}

export default SubmitResults;