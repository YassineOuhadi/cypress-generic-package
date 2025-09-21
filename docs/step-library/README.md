# 🧩 Cypress Generic Package – Step Library

This folder documents all **pre-implemented Cucumber steps** provided by `@yassinouhadi/cypress-generic-package`.  

These steps allow quickly building BDD-style tests without manually implementing Cypress actions.

---

## Step Categories

### 1️⃣ POM Pages

Steps for interacting with UI pages, forms, menus, and buttons.

| Type | Step | Definition |
| ---- | ---- | ---------- |
| Given | I visit "?([^\"]+)""?(?: page)? | [pom.page.cy.ts:13](../../cypress/support/step_definitions/pom.page.cy.ts) |
| Given | I am on "?([^\"]+)""?(?: page)? | [pom.page.cy.ts:18](../../cypress/support/step_definitions/pom.page.cy.ts) |
| Then | I should be on "?([^\"]+)""?(?: page)? | [pom.page.cy.ts:23](../../cypress/support/step_definitions/pom.page.cy.ts) |
| When | I click on "?([^\"]+)""? item from "?([^\"]+)""?(?: menu)? | [pom.page.cy.ts:28](../../cypress/support/step_definitions/pom.page.cy.ts) |
| When | I fill the form with data: | [pom.page.cy.ts:36](../../cypress/support/step_definitions/pom.page.cy.ts) |
| Given | I submit the "?([^\"]+)""?(?: form)? | [pom.page.cy.ts:44](../../cypress/support/step_definitions/pom.page.cy.ts) |
| Then | I should see "([^\"]*)" | [pom.page.cy.ts:52](../../cypress/support/step_definitions/pom.page.cy.ts) |

---

### 2️⃣ REST Services

Steps for REST API calls and response validation.

| Type | Step | Definition |
| ---- | ---- | ---------- |
| Given | I am using "([^\"]+)" | [service.rest.cy.ts:9](../../cypress/support/step_definitions/service.rest.cy.ts) |
| When | I send a request to "([^\"]+)" | [service.rest.cy.ts:17](../../cypress/support/step_definitions/service.rest.cy.ts) |
| When | I send a (GET\|POST\|PUT\|DELETE) request to "([^\"]+)" | [service.rest.cy.ts:20](../../cypress/support/step_definitions/service.rest.cy.ts) |
| When | I send a (POST\|PUT) request to "([^\"]+)" with body | [service.rest.cy.ts:23](../../cypress/support/step_definitions/service.rest.cy.ts) |
| Then | the response status should be (\d+) | [service.rest.cy.ts:27](../../cypress/support/step_definitions/service.rest.cy.ts) |
| Then | the response should contain "([^\"]+)" | [service.rest.cy.ts:30](../../cypress/support/step_definitions/service.rest.cy.ts) |

---

### 3️⃣ SOAP Services

| Type | Step | Definition |
| ---- | ---- | ---------- |
| Given | I am using SOAP API "([^\"]+)" | [service.soap.cy.ts:7](../../cypress/support/step_definitions/service.soap.cy.ts) |
| When | I call SOAP operation "([^\"]+)" | [service.soap.cy.ts:12](../../cypress/support/step_definitions/service.soap.cy.ts) |
| When | I call SOAP operation "([^\"]+)" with args | [service.soap.cy.ts:15](../../cypress/support/step_definitions/service.soap.cy.ts) |
| Then | the SOAP response should contain "([^\"]+)" | [service.soap.cy.ts:19](../../cypress/support/step_definitions/service.soap.cy.ts) |

---

### 4️⃣ GraphQL Services

| Type | Step | Definition |
| ---- | ---- | ---------- |
| Given | I am using GraphQL API "([^\"]+)" | [service.graphql.cy.ts:7](../../cypress/support/step_definitions/service.graphql.cy.ts) |
| When | I send GraphQL (query\|mutation) "([^\"]+)" | [service.graphql.cy.ts:12](../../cypress/support/step_definitions/service.graphql.cy.ts) |
| When | I send GraphQL (query\|mutation) | [service.graphql.cy.ts:21](../../cypress/support/step_definitions/service.graphql.cy.ts) |
| Then | the GraphQL response should contain "([^\"]+)" | [service.graphql.cy.ts:30](../../cypress/support/step_definitions/service.graphql.cy.ts) |

---

### 5️⃣ WebSocket Services

| Type | Step | Definition |
| ---- | ---- | ---------- |
| Given | I am connected to WebSocket API "([^\"]+)" | [service.websocket.cy.ts:8](../../cypress/support/step_definitions/service.websocket.cy.ts) |
| When | I send WebSocket message | [service.websocket.cy.ts:16](../../cypress/support/step_definitions/service.websocket.cy.ts) |
| When | I send WebSocket event "([^\"]+)" with payload | [service.websocket.cy.ts:26](../../cypress/support/step_definitions/service.websocket.cy.ts) |
| Then | the WebSocket response should contain "([^\"]+)" | [service.websocket.cy.ts:36](../../cypress/support/step_definitions/service.websocket.cy.ts) |
| Then | I close the WebSocket connection | [service.websocket.cy.ts:39](../../cypress/support/step_definitions/service.websocket.cy.ts) |

---

## Notes

* All step definitions are ready to use with Cypress + Cucumber.
* Use the steps directly in `.feature` files for BDD-style testing.
* JSON schemas in `/docs/schemas/` help ensure your test objects match the expected structure.
