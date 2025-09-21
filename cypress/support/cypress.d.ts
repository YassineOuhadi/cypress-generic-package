// ***********************************************************
// This file is loaded automatically before your test files.
// It is the ideal place to put global configuration, custom
// commands, and behavior modifications for Cypress.
// ***********************************************************

import "../shared/commands";
import { PageResolver } from "./resolver/pom/PageResolver";

// -------------------------------------------------------------------
// Type definitions for custom Cypress commands and environment
// -------------------------------------------------------------------
declare global {
  namespace Cypress {
    /** Project configuration loaded per scenario */
    interface ProjectConfig {
      SERVICE_REGISTRY: Record<string, any>;
      POM_REGISTRY: Record<string, any>;
    }

    interface Chainable {
      /**
       * Select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Select option in a form element
       */
      selectOption(
        element: Cypress.Chainable<any>,
        value: string,
        options?: any,
        errormessage?: string
      ): Chainable<any>;

      /**
       * Intercept an API request and alias it
       */
      interceptAPIRequest(method: string, url: string, alias: string): Chainable<any>;

      /**
       * Wait for an alias request to complete
       */
      waitingAliasRequest(alias: string, timeout?: number): Chainable<any>;

      /**
       * Custom failure handler
       */
      onFail(message?: string): Promise<any>;

      /**
       * Remove Cypress failure listeners
       */
      removeFailListeners(listener?: any): Chainable<any>;

      /**
       * Resolve a page by its name and return a PageResolver
       */
      resolvePage(page: string): Chainable<PageResolver>;

      /**
       * Get the current page resolver instance
       */
      currentPageResolver(): Chainable<PageResolver>;

      /**
       * Get the current page object instance
       */
      currentPageObject(): Chainable<GenericPage>;

      /**
       * Load project-specific configuration
       */
      task(event: "loadProjectConfig", arg: string): Chainable<ProjectConfig>;

      /**
       * Load default project configuration
       */
      task(event: "loadDefaultConfig"): Chainable<ProjectConfig>;
    }
  }
}