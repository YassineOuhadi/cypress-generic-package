# Cypress Generic Package – Examples

This folder contains example tests showcasing how to use
`@yassinouhadi/cypress-generic-package` for implementing test automation scripts with Cypress and Cucumber.

## Structure

* `pom/` → Json definitions of **UI models** (pages, forms, tables) and **API wrappers** (HTTP requests, real-time communication) used in tests.
* `fixtures/` → JSON test data for Data-Driven Testing approach.
* `integration/` → Cucumber features for test scenarios.
* `reports/` → Generated test reports.


## Running Examples

A simple REST API example:

```json
{
  "BASE_URL": "https://randomuser.me",
  "ENDPOINTS": {
    "getUser": {
      "PATH": "/api",
      "METHOD": "GET"
    }
  }
}
```

For running Examples use cmd

```bash
npx cypress open --project ./examples
```