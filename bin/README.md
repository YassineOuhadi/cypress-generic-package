# 🚀 Feature Assured CLI

Feature Assured CLI help bootstrap and manage Cypress projects with generic step definitions, environment templates, and example tests. It also allows project initialization, listing implemented steps, and integrates directly with VSCode for feature validation and spec management.

---

## ⚡ CLI Commands

| Command                                    | Description                                                    |
| ------------------------------------------ | -------------------------------------------------------------- |
| `npx feature-assured init`                 | Initialize Cypress project with config and env files           |
| `npx feature-assured add-examples`         | Add UI, Service/API, or both examples                          |
| `npx feature-assured list-steps`           | List all implemented Cypress step definitions                  |

---

## Project Structure After Init

```
project/
├─ cypress.config.js
├─ package.json
├─ cypress/
│  ├─ fixtures/
│  ├─ env/
│  │  └─ <projectName>.json
│  ├─ integration/
│  │  └─ features/
│  └─ e2e/
│      └─ <projectName>/
```

---

## VSCode Extension

The Feature Assured VSCode extension adds an explorer and validation tools to manage your Cypress tests directly in the editor.

More details and installation: [Feature Assured GitHub](https://github.com/YassineOuhadi/feature-assured)

---

## Quick Start

```bash
npm install -D @yassinouhadi/cypress-generic-package
npx feature-assured init
npx feature-assured add-examples
npx cypress open
```
