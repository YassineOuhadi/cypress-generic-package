// cypress/support/step_definitions/hooks.cy.ts
import { Before } from "@badeball/cypress-cucumber-preprocessor";

/**
 * Runs before each scenario to configure environment registries
 * based on the @project tag.
 */
Before(function (scenario) {
    const tags: string[] = scenario.pickle.tags.map((tag) => tag.name);

    // extract @project=<value> tag
    const projectTag = tags.find((tag) => tag.startsWith("@project="));
    const projectValue = projectTag?.replace("@project=", "");

    type ProjectConfig = {
        SERVICE_REGISTRY: Record<string, any>;
        POM_REGISTRY: Record<string, any>;
    };

    const loadConfig: Cypress.Chainable<ProjectConfig> = projectValue
        ? cy.task("loadProjectConfig", projectValue)
        : cy.task("loadDefaultConfig");

    loadConfig.then((config) => {
        if (!config) {
            throw new Error(
                `No configuration found for project "${projectValue ?? "default"}".`
            );
        }

        Cypress.env("SERVICE_REGISTRY", config.SERVICE_REGISTRY);
        Cypress.env("POM_REGISTRY", config.POM_REGISTRY);

        cy.log(`Loaded configuration for project: ${projectValue ?? "default"}`);
    });
});
