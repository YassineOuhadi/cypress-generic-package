# Cypress Generic Component Library

This package provides a set of generic components for testing Angular applications using Cypress. It includes various components such as forms, fields, buttons, tables, menus, and graphs, all of which can be easily extended and customized for specific testing needs.

## Features

- **Generic Components**: Reusable and extendable UI components.
- **Component Interactions**: Methods for interacting with components, such as clicking, typing, selecting, etc.
- **Customizable Requests**: The ability to intercept and handle API requests triggered by component interactions.
- **Assertions and Validations**: Built-in assertions to validate the state and behavior of components.

- **Custom error messages**: Error messages were personalized by rewriting error-handling listeners in Cypress.

## Generic Testing Implementation

Generic tests represent an integration between the Keyword-Driven Testing (KDT) approach, Keyword-Driven Testing (DDT) and the Page Object Model (POM) methodology.

- **KDT**: Keywords that serve as generic functions, either for actions or assertions.

- **DDT**: This approach aligns with Cypress concepts, such as fixtures; see the [Cypress documentation](https://docs.cypress.io/api/commands/fixture) for details.

- **POM**:Page Object Model objects represent web interfaces that can be extended and initialized with data.

We have identified generic objects, each object has specific actions and assertions. The table below lists some of the identified elements, their actions, and assertions:

| **Element** | **Actions** | **Assertions** |
|-------------|-------------|----------------|
| **Page**    | Navigate, Refresh | Verify title, Verify URL |
| **Table**   | Sort, Filter, Select a row | Verify row count, Verify data presence |
| **Form**    | Fill, Submit | Verify validation, Verify errors |
| **Button**  | Click, Double click | Verify state (enabled/disabled), Verify existence |
| **Input**   | Enter text, Clear | Verify value, Verify placeholder |
| **Select**  | Select an option, Deselect | Verify available options, Verify selection |
| **Menu**    | Open, Close, Navigate | Verify menu items, Verify state (open/closed) |

## Installation

To install the Cypress Generic Component Library, use npm:

```bash
npm i @yassinouhadi/cypress-generic-package
```

## Usage

To use the Cypress Generic Component Library in your Cypress tests, start by importing the required components:

```bash
import { 
  GenericForm
} from '@yassinouhadi/cypress-generic-package';
```
Define form Cypress selectors: Use the cy.get() method to define selectors. It's better to include a 'data-cy' attribute in the HTML elements to simplify TDD and BDD testing approaches.

```bash
const MyFormVariables = {
    
    form: () => cy.get('[data-cy="form"]'),

    FIELDS: {

        name: () => ({
            field: () => cy.get('[data-cy="name"]'),
            entry: ['INPUT'],
            isOptional: false
        }),

        role: () => ({
            field: () => cy.get('[data-cy="role"]'),
            entry: ['SELECT']
        }),

        tags: () => ({
            field: () => cy.get('[data-cy="tags"]'),
            entry: ['INPUT' , 'MULTISELECT']
        })
    },    

    MENUS: {

        role: () => cy.get('[data-cy="rolemenu"]'),

        tags: () => cy.get('[data-cy="tagsmenu"]')
    },

    URLS: {

        tags: () => ({ 
            onLoadRequestUrl: 'https://',,
            onLoadRequestHttpMethod: 'GET', 
            isByDefaultOnLoaded: true,
            onEventRequestUrl: 'https://',,
            onEventRequestHttpMethod: 'POST'
        })
    },

    BUTTONS: {

        submit: () => ({
            button: () => cy.get('[data-cy="submit"]'),
            type: 'SUBMIT' 
        })
    }
}
```

Define the form POM object by extending from the generic form and initializing it with the corresponding fields, buttons, etc.

```bash
class MyForm extends GenericForm {

  constructor() {
    super('FORM', 
        cy.get('app-correlation-form'), 
        'https://',
        "GET",
        true,
        'https://',
        'POST'
        );
  }

  override init() {

    // Define form fields
    this.setFields(
      MyFormVariables.FIELDS,
      MyFormVariables.MENUS,
      MyFormVariables.URLS
    );

    // Define buttons
    this.setButtons(
      MyFormVariables.BUTTONS,
      MyFormVariables.URLS
    );
  }
}
```

Below is an example of a data.json file that contains test data for the form fields. This file should be placed in the cypress/fixtures directory of your project.

```bash
// cypress/fixtures/data.json
[
  {
    "name": "John Doe",
    "role": "Admin",
    "tags": ["cypress", "testing"]
  },
  {
    "name": "Jane Smith",
    "role": "User",
    "tags": ["automation", "qa"]
  }
]
```

```
And once we have POM objects, we can use the actions and assertions provided by the library directly:

```bash
/// <reference types="Cypress" />

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { Assertions } from "@watch/cypress-generic-package";

let successfullySubmit =  false;
let fieldsToIgnore = [];
let data;

beforeEach(function () {
  // Load data from the fixtures file
  cy.fixture('data.json').then((jsonData) => {
    data = jsonData;
  });
});

When('I fill out the form completely', () => {
  myform.fill(data).then(() => {
    successfullySubmit = true;
  });
});

When('I fill out the form with some fields empty', () => {
  data.name = '';
  myform.fill(data).then(() => {
    successfullySubmit = false;
  });
});

When('I submit the form', () => {
  form.submitForm();

  if (successfullySubmit) {
    form.waitForEventResponse()
        .then((interception: { response: { statusCode: any; } }) => { 
      const status = interception.response?.statusCode;

      SubmitResult.expect('/', status, false).toBeSuccessful();
    });
  }
});
```
If you find a bug, please report it on our [GitHub Issues page](https://github.com/YassineOuhadi/cypress-generic-package/issues).

## License

This package is licensed under the MIT License.