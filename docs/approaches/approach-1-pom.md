# Extend POM Objects Approach

This approach uses the **generic Page Object Model (POM) classes** provided by the Cypress Generic Package.
It allows fine-grained control over UI components while starting from **ready-to-use objects**.

---

## Features

* **Extendable POM Objects**: Start with generic POM classes and customize for your application.
* **Component Interactions**: Fill forms, click buttons, select from menus, etc.
* **Assertions**: Built-in methods to validate field values, button states, and form submission results.


## Define Form Variables and Selectors

```ts
const MyFormVariables = {
  form: () => cy.get('[data-cy="form"]'),
  FIELDS: {
    name: () => ({ field: () => cy.get('[data-cy="name"]'), entry: ['INPUT'], isOptional: false }),
    role: () => ({ field: () => cy.get('[data-cy="role"]'), entry: ['SELECT'] })
  },
  MENUS: {},
  URLS: {},
  BUTTONS: {
    submit: () => ({ button: () => cy.get('[data-cy="submit"]'), type: 'SUBMIT' })
  }
}
```

---

## Create POM Class

```ts
import { GenericForm } from '@yassinouhadi/cypress-generic-package';

class RegistrationForm extends GenericForm {
  constructor() {
    super('FORM', cy.get('[data-cy="form"]'), 'https://example.com/form', 'GET', true, '', 'POST');
  }

  override init() {
    this.setFields(MyFormVariables.FIELDS, MyFormVariables.MENUS, MyFormVariables.URLS);
    this.setButtons(MyFormVariables.BUTTONS, MyFormVariables.URLS);
  }
}
```

---

## Define Fixture Data

```json
// cypress/fixtures/data.json
[
  {
    "name": "John Doe",
    "role": "Admin"
  },
  {
    "name": "Jane Smith",
    "role": "User"
  }
]
```

---

## Use in Cypress Tests

```ts
import { RegistrationForm } from '../pom/RegistrationForm';
const registrationForm = new RegistrationForm();
let data;

beforeEach(() => {
  cy.fixture('data.json').then((jsonData) => { data = jsonData; });
});

When('I fill out the registration form', () => {
  registrationForm.fill(data[0]);
});

When('I submit the registration form', () => {
  registrationForm.submitForm();
});
```

---

## Notes

* Provides **full control** over selectors, fields, menus, and buttons.
* Best for scenarios where detailed interaction with UI components is required.
* Works seamlessly with the generic **Step Library** to combine BDD pre-implemented steps with custom POM objects.

---

> 💡 Tip: Use this approach when detailed interaction with UI components is needed, and combine it with [Pre-Implemented Steps Approach](./approach-2-bdd.md) for reusable Cucumber steps.
