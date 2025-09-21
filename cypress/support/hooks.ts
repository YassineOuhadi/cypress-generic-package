// cypress/support/step_definitions/hooks.cy.ts
import { Before } from "@badeball/cypress-cucumber-preprocessor";

/**
 * Before each scenario, loads the project-specific or default configuration
 * and sets Cypress env variables accordingly
 */
Before(function (scenario) {
  // extract all scenario tags
  const tags = scenario.pickle.tags.map(tag => tag.name);

  // find @project=<value> tag, if present
  const projectTag = tags.find(tag => tag.startsWith("@project="));
  const projectName = projectTag?.replace("@project=", "");

  // load project config or default config via cy.task
  const configTask = projectName
    ? cy.task("loadProjectConfig", projectName)
    : cy.task("loadDefaultConfig");

  // apply configuration to Cypress environment
  configTask.then((config) => {
    if (!config) {
      throw new Error(`Configuration not found for project: ${projectName ?? "default"}`);
    }

    Cypress.env("SERVICE_REGISTRY", config.SERVICE_REGISTRY);
    Cypress.env("POM_REGISTRY", config.POM_REGISTRY);

    cy.log(`Configuration loaded for project: ${projectName ?? "default"}`);
  });
});
