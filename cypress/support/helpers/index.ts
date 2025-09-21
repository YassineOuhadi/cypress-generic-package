// cypress/support/helper/index.ts
import { PageResolver } from "../resolver/pom/PageResolver";

/**
 * Dynamic Cypress command execution
 */
export interface ICyCommandDef {
  /** Cypress command name (e.g., 'visit', 'click') */
  cmd: string;

  /** Arguments to pass to the Cypress command */
  args: unknown[];
}

/**
 * Dynamically execute a Cypress command with provided arguments.
 *
 * @param def - Command definition including name and arguments
 * @returns Cypress.Chainable wrapping the command result
 * @throws Error if the command is not supported by Cypress
 */
export function execCyCommand(def: ICyCommandDef): Cypress.Chainable {
  const { cmd, args } = def;

  if (typeof (cy as any)[cmd] !== "function") {
    throw new Error(`Unsupported Cypress command: "${cmd}"`);
  }

  return (cy as any)[cmd](...args);
}

/**
 * Execute a callback function using the current PageResolver instance.
 *
 * This allows interacting with the current page's methods and elements
 * in a type-safe and chainable way.
 *
 * @param fn - Callback receiving the PageResolver
 * @returns Cypress.Chainable wrapping the result of the callback
 */
export const withCurrentPage = <T = void>(
  fn: (resolver: PageResolver) => void | Cypress.Chainable<T>
): Cypress.Chainable<T> => {
  return cy.currentPageResolver().then(resolver => fn(resolver) as Cypress.Chainable<T>);
};