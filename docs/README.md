# Cypress Generic Package – Documentation

This documentation provides guidance on using `@yassinouhadi/cypress-generic-package` for test automation with **Cypress** and **Cucumber**.  

The package supports **two main approaches**:

- **Extend POM Objects** – Define UI components and services in JSON, then extend the generic Page Object Model (POM) classes to fit your application.  
- **BDD Pre-Implemented Steps** – Use pre-built Cucumber steps driven by JSON schemas for faster BDD-style test development.

---

## Documentation Overview

Explore the structured documentation below:

| Topic | Description |
|-------|-------------|
| [Approaches Overview](./approaches/README.md) | Learn about the two approaches with examples and guidance on when to use each. |
| [Schemas](./schemas/README.md) | JSON schemas for REST, SOAP, GraphQL, WebSocket, and UI components. |
| [Step Library](./step-library/README.md) | Pre-implemented Cucumber steps for UI and API testing. |
| [Examples](../examples//README.md) | Sample JSON definitions and test usage demonstrating both approaches. |
| [Feature Assured CLI](../bin//README.md) | CLI commands and automation helpers for running tests, generating reports, and managing environments. |

---

## Notes

- **Extend POM Objects Approach** gives full control using POM objects.  
- **Pre-Implemented Steps Approach** is ideal for BDD-style feature files with JSON schema validation.  
management.

---

> 💡 Tip: Start with the [Approaches Overview](./approaches/README.md) to decide which approach fits your project needs, then explore schemas, step libraries, and examples for implementation.
