# BDD Pre-Implemented Steps Approach

This approach uses **ready-made Cucumber steps** driven by **JSON schemas** for fast BDD-style test automation.  
Users only need to define **feature files**; all steps are already implemented and reusable.

---

## Features

* **Ready-to-Use Steps** – Pre-implemented Cucumber steps for common UI and API actions.  
* **JSON Schema Validation** – Enforces consistent structure for REST, SOAP, GraphQL, WebSocket, and UI components.  
* **Quick BDD Automation** – Allows multiple testers to write standardized feature files without manual step coding.  

---

## JSON Schemas

Schemas enforce **correct structure** for REST, SOAP, GraphQL, WebSocket, and UI components.

Example REST API schema:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["BASE_URL"],
  "properties": {
    "BASE_URL": { "type": "string" },
    "ENDPOINTS": {
      "type": "object",
      "patternProperties": {
        ".*": {
          "type": "object",
          "properties": {
            "METHOD": { "enum": ["GET","POST","PUT","DELETE"] },
            "HEADERS": { "type": "object" },
            "BODY_TEMPLATE": { "type": "object" }
          },
          "additionalProperties": true
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": true
}
```

Other schemas are available in the [Schemas folder](../schemas/README.md).

---

## Example Usage

Define a REST service in JSON:

```json
{
  "BASE_URL": "https://randomuser.me",
  "ENDPOINTS": {
    "/api": {
      "METHOD": "GET"
    }
  }
}
```

Then create a feature file using the pre-implemented steps:

```gherkin
Feature: Retrieve random user

  Scenario: Get user information
    When I send a GET request to "/api"
    Then the response status should be 200
```

Explore all pre-implemented steps in the [Step Library](../step-library/README.md).

## Notes

* Ready-to-use steps **remove the need for manual coding** of step definitions.  
* JSON schemas ensure **consistency** and prevent runtime errors.  
* Perfect for **BDD-style feature files**.
---

> 💡 Tip: Use this approach to reuse pre-built steps across multiple projects.