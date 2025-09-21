# JSON Schemas for Cypress Generic Package

This folder contains JSON schemas for defining UI components and service wrappers for the Cypress Generic Package.

Each schema ensures proper structure when using the BDD pre-implemented steps.

| Schema        | Description                                                                 | File                                                     |
| ------------- | --------------------------------------------------------------------------- | -------------------------------------------------------- |
| REST API      | Defines REST services, endpoints, methods, headers, and body templates      | [rest.schema.json](./rest.schema.json)           |
| SOAP API      | Defines SOAP services with WSDL, operations, headers, and default arguments | [soap.schema.json](./soap.schema.json)                   |
| GraphQL API   | Defines GraphQL queries and mutations, with variables                       | [graphql.schema.json](./graphql.schema.json)             |
| WebSocket     | Defines WebSocket endpoints, protocols, and headers                         | [websocket.schema.json](./websocket.schema.json)         |
| UI Components | Defines Tables, Forms, Fields, and Buttons with Cypress commands             | [page.schema.json](./page.schema.json) |