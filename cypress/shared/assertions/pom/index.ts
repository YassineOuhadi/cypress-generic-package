// cypress/shared/assertions/pom/pomAssertions.ts
import { PageResolver } from "../../../support/resolver/pom/PageResolver";
import { logUserError, AssertionErrors } from "../../logs";

export const PomAssertions = {
    page: {
        /**
         * Asserts that the page is opened.
         *
         * @param {PageResolver} [pageResolver] - The PageResolver instance.
         * @param {string} [path] - Optional path expected to be part of the URL.
         * @throws Will throw an error if PageResolver is not initialized.
         */
        opened: (pageResolver?: PageResolver, path?: string) => {
            if (!pageResolver) {
                logUserError(
                    AssertionErrors.pageResolverNotInitialized()
                );
            }
            
            return pageResolver!
                .getPage().isPageOpened(path);
        },
    }
};