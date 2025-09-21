# Cypress Generic Component Library

This package provides **ready-to-use generic objects** and helpers to simplify **Cucumber tests for UI and API**.

It offers a set of generic components for testing Angular applications using Cypress, including forms, fields, buttons, tables, menus, and graphs. These components can be easily extended and customized for specific testing needs.

---

## Features

* **Generic Components**: Reusable and extendable UI components.
* **Component Interactions**: Methods for interacting with components, such as clicking, typing, selecting, etc.
* **Customizable Requests**: Ability to intercept and handle API requests triggered by component interactions.
* **Assertions and Validations**: Built-in assertions to validate the state and behavior of components.
* **Custom Error Messages**: Personalized error messages by rewriting error-handling listeners in Cypress.

---

## Generic Testing Implementation

The library integrates the following testing methodologies:

* **Keyword-Driven Testing (KDT)**: Provides generic functions for actions and assertions.
* **Data-Driven Testing (DDT)**: Aligns with Cypress concepts such as fixtures.
* **Page Object Model (POM)**: Generic objects represent web interfaces that can be extended and initialized with data.

Identified generic objects include pages, tables, forms, buttons, inputs, selects, and menus, each with pre-defined actions and assertions.

---

## Installation

Install the Cypress Generic Component Library using npm:

[![npm version](https://img.shields.io/npm/v/@yassinouhadi/cypress-generic-package.svg)](https://www.npmjs.com/package/@yassinouhadi/cypress-generic-package)

```bash
npm i @yassinouhadi/cypress-generic-package
```

---

## Usage

The library provides ready-to-use objects that can be extended for your application. Combine with the **Step Library** or custom POM objects to write efficient BDD-style tests without repetitive boilerplate code.

For detailed examples and implementation, refer to the documentation in the `docs/approaches` folder.

---

## Documentation

* [Extend POM Objects Approach](./docs/approaches/approach-1-pom.md) – Start with ready-to-use POM objects and extend them for your application.
* [BDD Pre-Implemented Steps Approach](./docs/approaches/approach-2-bdd.md) – Use pre-implemented Cucumber steps driven by JSON schemas for fast BDD automation.
* [Schemas](./docs/schemas/README.md) – JSON schemas for REST, SOAP, GraphQL, WebSocket, and UI components.
* [Step Library](./docs/step-library/README.md) – Reusable pre-built steps for multiple projects.

---

## Contributing

Contributions are welcome! To contribute.

For more details, see [CONTRIBUTING.md](./docs/CONTRIBUTING.md).

---

## Issues

If you find a bug or want to request a feature, please report it on the [GitHub Issues page](https://github.com/YassineOuhadi/cypress-generic-package/issues).

---

## Feature Assured VS Code Extension

This library integrates seamlessly with the **Feature Assured VS Code extension** for managing tests, generating reports, and running automated scripts.
Check it out [here](https://marketplace.visualstudio.com/items?itemName=).

---

## License

This package is licensed under the MIT License.