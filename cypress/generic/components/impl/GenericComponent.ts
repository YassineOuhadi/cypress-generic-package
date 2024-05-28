// @ts-nocheck

/// <reference types="Cypress" />

import {
    assertElementShould,
    assertElementEnabled,
    assertElementExist,
    assertElementVisible,
    assertElementContains,
    assertAtLeastOneElementWithCssProperty
} from "../../assertions"; // Import assertion utilities

import {
    ButtonEntry,
    GenericButton
} from "./GenericButton"; // Import GenericButton class

import {
    GenericForm
} from "./GenericForm"; // Import GenericForm class

import {
    GenericDatatable
} from "./GenericDatatable"; // Import GenericDatatable class

import {
    GenericField
} from "./GenericField"; // Import GenericField class

import {
    GenericMenu
} from "./GenericMenu"; // Import GenericMenu class

import {
    COMPONENT_TYPE,
    IGenericComponent,
    LANGUAGE
} from "../IGenericComponent";

import {
    logInterceptRequest
} from "../../logs";

class GenericComponent implements IGenericComponent {

    /**
     * Component name.
     * 
     * This property is required to define the component and serves as a preference, not necessarily unique.
     * It is used as a reference for the component and has no relation to the component map key.
     */
    name: string;

    /**
     * Component structure.
     * 
     * Each component type ('PAGE', 'FORM', 'FIELD', etc.) has specific actions, elements, and assertions associated with it.
     */
    as: COMPONENT_TYPE;

    /**
     * This is a function selector for a component. 
     * It is not executable, just a reference for () to convert to a function.
     * 
     * The function returned by cyElement becomes executable when we add () to it.
     * 
     * This ensures that the execution occurs only when needed, 
     * resolving the issue for elements that become visible after some actions.
    */
    cyElement: () => Cypress.Chainable<any>;

    /**
     * The component itself can also contain other components.
     * 
     * The component name is useful as a reference for intercepting requests to the base data API.
     * 
     * The component map key is used as a reference for a specific element.
     * 
     * For simple components, we use the component name as the key. 
     * 
     * However, for components that contain other components (e.g., a field input with a menu component),
     * the menu key is referenced by the parent key concatenated with '_menu'. 
     * 
     * The same case applies to the column component and the filter input, among others.
    */
    elements: Map<
        string,
        GenericComponent
    >;

    /**
     * Language setting for the component content to be displayed. 
     * By default, it is set to English.
    */
    lang: LANGUAGE = LANGUAGE.EN;

    /**
     * Data API URL.
     * 
     * This property represents the data API URL, which can be the same for certain components 
     * such as input autocomplete type and his menu component.
    */
    onLoadRequest?: { // Data source Request
        url?: string; // Source API Url
        method?: string; // Http Method sush as 'GET', 'POST' & 'PUT'..
        byDefaultOnLoaded?: boolean; // On DOM Content Loaded
    } = {
        };

    // Submit, Click.. Request
    onEventRequest?: { // On Event such as click, type..
        url?: string;
        method?: string;
    } = {
        };

    /**
     * Creates an instance of GenericComponent.
     * 
     * @param {any} as - The type of the component (e.g., 'PAGE', 'FORM', 'FIELD', 'BUTTON', 'DATATABLE', 'COLUMN', 'CANVAS', 'MENU').
     * @param {string} name - The name of the component.
     * @param {() => Cypress.Chainable<any>} [cyelement] - The function selector for the component.
     * @param {string} [dataBaseUrl] - The base URL for the data API.
     */
    constructor(
        as: COMPONENT_TYPE,
        name: string,
        cyelement?: () => Cypress.Chainable<any>,
        dataBaseUrl?: string,
        onLoadHttpMethod?: string,
        dataFromBackendByDefault?: boolean,
        onEventAPIUrl?: string,
        onEventHttpMethod?: string
    ) {
        this.as = as;
        this.name = name;
        this.cyElement = cyelement!;
        this.elements = new Map();
        this.onLoadRequest!.url = dataBaseUrl!;
        this.onEventRequest!.url = onEventAPIUrl!;
        onLoadHttpMethod
            ? this.onLoadRequest!.method = onLoadHttpMethod
            : this.onLoadRequest!.url ? this.onLoadRequest!.method = 'GET' : null;
        dataFromBackendByDefault
            ? this.onLoadRequest!.byDefaultOnLoaded = dataFromBackendByDefault
            : this.onLoadRequest!.url ? this.onLoadRequest!.byDefaultOnLoaded = false : null;
        onEventHttpMethod
            ? this.onEventRequest!.method = onEventHttpMethod
            : this.onEventRequest!.url ? this.onEventRequest!.method = 'POST' : null;
    }

    /**
     * Initializes the component.
     */
    init() {
        // Init Component Elements
        this.elements
            .forEach(element => {
                element.init();
            });

        // intercepting requests for component elements data
        this.interceptComponentRequests();
    }

    /**
     * Gets the name of the component.
     * 
     * @returns {string} - The name of the component.
     */
    getName() {
        return this.name;
    }

    /**
     * Gets the language setting for the component content.
     * 
     * @returns {LANGUAGE} - The language setting.
     */
    getLanguage() {
        return this.lang;
    }

    /**
     * Sets the language setting for the component content.
     * 
     * @param {LANGUAGE} lang - The language setting to set.
     */
    setLanguage(lang: LANGUAGE) {
        this.lang = lang;
    }

    /**
     * Gets the HTTP Request API URL.
     * 
     * @returns {string | undefined} - The data API URL.
     */
    getOnLoadRequestUrl() {
        return this.onLoadRequest!.url;
    }

    /**
     * Sets the data API URL.
     * 
     * @param {string} api - The data API URL to set.
     */
    async setOnLoadRequestUrl(
        api: string
    ) {
        const { GenericField } = await import('./GenericField'); // Dynamically Import
        const { GenericMenu } = await import('./GenericMenu'); // Dynamically Import
        const { GenericDatatable } = await import('./GenericDatatable'); // Dynamically Import

        if (this instanceof GenericMenu || this instanceof GenericDatatable) {
            this.onLoadRequest!.url = api;
        } else if (this instanceof GenericField) {
            this.entries
                .some(entry => ['INPUT', 'SELECT', 'MULTISELECT']
                    .includes(entry)) ? this.onLoadRequest!.url = api : null;
        }
    }

    /**
     * Gets the HTTP Request API Http Method.
     * 
     * @returns {string | undefined} - The data API Method.
     */
    getOnLoadRequestHttpMethod() {
        return this.onLoadRequest!.method;
    }

    // On Event Request

    /**
     * Gets the HTTP Request API URL.
     * 
     * @returns {string | undefined} - The data API URL.
     */
    getOnEventRequestUrl() {
        return this.onEventRequest!.url;
    }

    /**
     * Gets the HTTP Request API Http Method.
     * 
     * @returns {string | undefined} - The data API Method.
     */
    getOnEventRequestHttpMethod() {
        return this.onEventRequest!.method;
    }

    // Elements

    /**
     * Gets a specific element from the component.
     * 
     * @param {string} key - The key of the element to get.
     * @returns {GenericComponent | undefined} - The element, if found.
     */
    getElement(
        key: string
    ): GenericComponent {
        return this.elements.get(key)!;
    }

    getFirstSelector() {
        return this
            .cyElement()
            .first();
    }

    /**
     * Sets a specific element in the component.
     * 
     * @param {string} key - The key of the element to set.
     * @param {GenericComponent} component - The component to set.
     */
    setElement(
        key: string,
        component: GenericComponent
    ) {
        this.elements
            .set(key, component);
    }

    setElements(
        elementsSelectors: Record<string, () => Cypress.Chainable<any>>,
        dataBaseUrls?: Record<string, () => {
            onLoadRequestUrl: string;
            onLoadRequestHttpMethod?: string;
            isByDefaultOnLoaded?: boolean,
            onEventRequestUrl?: string,
            onEventRequestHttpMethod?: string
        }>
    ) {
        Object.entries(elementsSelectors).forEach(([elementName, selectorFn]) => {
            const dataBaseAPI = dataBaseUrls
                ? dataBaseUrls[elementName]?.()
                : undefined;

            const genericelement = new GenericComponent(
                COMPONENT_TYPE.GENERIC,
                elementName,
                selectorFn,
                dataBaseAPI?.onLoadRequestUrl,
                dataBaseAPI?.onLoadRequestHttpMethod,
                dataBaseAPI?.isByDefaultOnLoaded,
                dataBaseAPI?.onEventRequestUrl,
                dataBaseAPI?.onEventRequestHttpMethod
            );

            this.setElement(
                elementName,
                genericelement
            );
        });
    }

    /**
     * Gets a button component by its key.
     * 
     * @param {string} key - The key of the button.
     * @returns {GenericButton | undefined} - The button component, if found.
     */
    getButton(
        key: string
    ): GenericButton | undefined {
        const component = this.getElement(key);
        if (component && component.as === COMPONENT_TYPE.BUTTON) {
            return component as GenericButton;
        } else {
            console.error(`Button '${key}' not found.`);
            return undefined;
        }
    }

    /**
     * Adds a button component to the elements.
     * 
     * @param {any} key - The key of the button.
     * @param {GenericButton} button - The button component to add.
     */
    setButton(
        key: any,
        button: GenericButton
    ) {
        this.setElement(key, button);
    }

    /**
     * Asynchronously adds multiple buttons to the component.
     * 
     * @param {Record<string, () => Cypress.Chainable<any>>} buttonSelectors - The selectors for the buttons.
     * @param {Record<string, () => Cypress.Chainable<any>>} [hiddenframes] - The selectors for hidden frames.
     */
    async setButtons(
        buttonSelectors: Record<string, () => {
            button: () => Cypress.Chainable<any>,
            type?: string
        }>,
        menuSelectors?: Record<string, () => Cypress.Chainable<any>>,
        dataBaseUrls?: Record<string, () => {
            onLoadRequestUrl?: string;
            onLoadRequestHttpMethod?: string;
            isByDefaultOnLoaded?: boolean,
            onEventRequestUrl?: string,
            onEventRequestHttpMethod?: string
        }>,
    ) {
        Object.entries(buttonSelectors).forEach(([buttonName, selectorFn]) => {
            const dataBaseAPI = dataBaseUrls
                ? dataBaseUrls[buttonName]?.()
                : undefined;

            const menuSelectorFn = menuSelectors
                ? menuSelectors[buttonName]
                : undefined;

            const genericButton = new GenericComponent(
                COMPONENT_TYPE.BUTTON,
                buttonName,
                selectorFn().button,
                dataBaseAPI?.onLoadRequestUrl,
                dataBaseAPI?.onLoadRequestHttpMethod,
                dataBaseAPI?.isByDefaultOnLoaded,
                dataBaseAPI?.onEventRequestUrl,
                dataBaseAPI?.onEventRequestHttpMethod
            ) as GenericButton;

            genericButton.entry = selectorFn().type as ButtonEntry

            this.setButton(
                buttonName,
                genericButton
            );
        });
    }

    /**
     * Gets a field component by its key.
     * 
     * @param {string} key - The key of the field.
     * @returns {GenericField | undefined} - The field component, if found.
     */
    getField(
        key: string
    ): GenericField | undefined {
        const component = this.getElement(key);
        if (component && component.as === COMPONENT_TYPE.FIELD) {
            return component as GenericField;
        } else {
            console.error(`Field '${key}' not found.`);
            return undefined;
        }
    }

    /**
     * Adds a field component to the elements.
     * 
     * @param {any} key - The key of the field.
     * @param {GenericField} field - The field component to add.
     */
    setField(
        key: any,
        field: GenericField
    ) {
        this.setElement(key, field);
    }

    /**
     * Gets a form component by its key.
     * 
     * @param {string} key - The key of the form.
     * @returns {Form} - The form component.
     */
    getForm(
        key: string
    ): GenericForm {
        return this.elements
            .get(key) as GenericForm;
    }

    /**
     * Sets a form component in the elements.
     * 
     * @param {string} key - The key of the form.
     * @param {GenericForm} form - The form component to set.
     */
    setForm(
        key: string,
        form: GenericForm
    ) {
        this.elements
            .set(key, form);
    }

    /**
     * Gets a datatable component by its key.
     * 
     * @param {string} key - The key of the datatable.
     * @returns {Datatable} - The datatable component.
     */
    getTable(
        key: string
    ): GenericDatatable {
        return this.elements
            .get(key) as GenericDatatable;
    }

    /**
     * Sets a datatable component in the elements.
     * 
     * @param {string} key - The key of the datatable.
     * @param {GenericDatatable} table - The datatable component to set.
     */
    setTable(
        key: string,
        table: GenericDatatable
    ) {
        this.elements
            .set(key, table);
    }

    /**
     * Gets a datatable component by its key.
     * 
     * @param {string} key - The key of the datatable.
     * @returns {Datatable} - The datatable component.
     */
    getMenu(
        key: string
    ): GenericMenu {
        return this.elements
            .get(key) as GenericMenu;
    }

    /**
     * Gets the menu component associated with the current component.
     * 
     * @returns {Menu | undefined} - The menu component, if found.
     */
    getComponentMenu(): GenericMenu | undefined {
        const element = this.elements.get(this.getName() + '_menu');
        if (element && element.as === COMPONENT_TYPE.MENU) {
            return element as GenericMenu;
        } else {
            console.error(`Menu '${this.getName() + '_menu'}' not found or not of type 'MENU'.`);
            return undefined;
        }
    }

    /**
     * Sets a menu component associated with the current component.
     * 
     * @param {string} key - The key of the menu.
     * @param {GenericMenu} menu - The menu component to set.
     */
    setMenu(
        key: string,
        menu: GenericMenu
    ) {
        if (!this.elements.has(key)) {
            this.elements
                .set(key, menu);
        } else {
            console.error(`Menu with key '${key}' already exists.`);
        }
    }

    /**
     * Asynchronously adds multiple menus to the component.
     * 
     * @param {Record<string, () => Cypress.Chainable<any>>} menuSelectors - The selectors for the menus.
     * @param {Record<string, () => Cypress.Chainable<any>>} [items] - The selectors for menus items [item or menu..].
     */
    async setMenus(
        menuSelectors: Record<string, () => Cypress.Chainable<any>>,
        items?: Record<string, () => Cypress.Chainable<any>>,
        dataBaseUrls?: Record<string, () => {
            onLoadRequestUrl: string;
            onLoadRequestHttpMethod?: string;
            isByDefaultOnLoaded?: boolean,
            onEventRequestUrl?: string,
            onEventRequestHttpMethod?: string
        }>) {
        const { GenericMenu } = await import('./GenericMenu'); // Dynamically Import

        Object.entries(menuSelectors).forEach(([menuName, selectorFn]) => {
            const item = items
                ? items[menuName]
                : undefined;

            const dataBaseAPI = dataBaseUrls
                ? dataBaseUrls[menuName]?.()
                : undefined;

            const genericMenu = new GenericMenu(
                menuName,
                selectorFn,
                dataBaseAPI?.onLoadRequestUrl,
                dataBaseAPI?.onLoadRequestHttpMethod,
                dataBaseAPI?.isByDefaultOnLoaded,
                dataBaseAPI?.onEventRequestUrl,
                dataBaseAPI?.onEventRequestHttpMethod
            );

            // TODO: Simple Items / Other Childs Menus
            // item ?
            //     genericMenu.setMenu(menuName + '_menu', new GenericMenu(menuName + '_menu', item, dataBaseAPI?.url, dataBaseAPI?.dataFromBackendByDefault)) 
            //     : null;

            this.setMenu(
                menuName,
                genericMenu
            );
        });
    }

    /**
     * Clicks on the element.
     */
    click(
        values?: string | string[]
    ) {
        if (values) {
            // Convert single string to an array
            Array.isArray(values)
                ? null
                : values = [values];

            // If it's a multi click
            values.forEach((text: string) => {
                assertElementContains(
                    this.cyElement(),
                    text,
                    `Failed to find ${text} in ${this.getName()}.`
                ).click(
                    { force: true }
                );
            })
        } else {
            this.cyElement().click({ force: true }).then(() => {
                this.onEventRequest
                    ? this.waitForEventResponse()
                    : null;
            });
        }
    }

    /**
     * Types text into the element.
     * 
     * @param {string} text - The text to type into the element.
     */
    type(
        text: string
    ) { // Type actions
        this.cyElement()
            .type(text);
    }

    /**
     * Selects one or more options from the element.
     * 
     * @param {string | string[]} option - The option or options to select. Can be a single option or an array of options.
     */
    select(
        option: string | string[]
    ) { // Select actions
        const cyElement = this.cyElement();
        const selectOptions = { force: true };

        // If it's a multi-select element
        if (Array.isArray(option)) {
            // If multiple options are provided, select each one
            option.forEach((opt: string) => {
                cy.selectOption(
                    cyElement,
                    opt,
                    selectOptions
                );
            });
        } else {
            // If a single option is provided, select it
            cy.selectOption(
                cyElement,
                option as string,
                selectOptions
            );
        }
    }

    fill(...args: any[]) { }

    /**
     * Performs multiple actions on the element dynamically.
     * 
     * @param {Array<{ method: string, params?: any[] }>} actions - Array of objects containing action methods and their parameters.
     * Each object in the array should have the following structure:
     * {
     *    method: string, // The name of the action method (e.g., 'click', 'type', 'select')
     *    params?: any[]  // (Optional) Parameters to be passed to the action method
     * }
     */
    performMultipleActions(actions: { method: string, params?: any[] }[]) {
        actions.forEach(({ method, params }) => {
            switch (method) {
                case 'click':
                    this.click();
                    break;
                case 'type':
                    if (params && params.length > 0) {
                        this.type(params[0]);
                    } else {
                        throw new Error(`Missing parameters for 'type' action.`);
                    }
                    break;
                case 'select':
                    if (params && params.length > 0) {
                        this.select(params[0]);
                    } else {
                        throw new Error(`Missing parameters for 'select' action.`);
                    }
                    break;
                // Add other action cases as needed
                default:
                    throw new Error(`Unsupported action method: ${method}`);
            }
        });
    }

    /**
     * Asserts that the element exists.
     */
    exist() { // Assert existence
        return assertElementExist(this.cyElement());
    }

    /**
     * Asserts that the element is visible.
     */
    visible() { // Assert visibility
        return assertElementVisible(this.cyElement());
    }

    /**
     * Asserts that the element is enabled.
     */
    enabled() {
        return assertElementEnabled(this.cyElement());
    }

    /**
     * Asserts that the element is disabled.
     */
    disabled() {
        return assertElementEnabled(this.cyElement());
    }

    /**
     * Asserts that the element's value matches the specified value.
     * 
     * @param {string} value - The expected value.
     */
    isValue(
        value: string
    ) {
        this.contains(value);
    }

    /**
     * Assert element content to be a valid number.
     */
    asValidNumber() {
        this.waitForvalue().then((value: any) => {
            expect(value)
                .to.be.a('number')
                .and.not.NaN;
        });
    }

    getAsNumber() {
        return this.waitForvalue().then((value: any) => {
            if (typeof value === 'number') {
                return value;
            }
            return undefined; // Return undefined if value is not a number
        });
    }

    /**
     * Asserts that the element is empty.
     */
    empty() {
        this.isValue('')
    }

    /**
     * Asserts that the element contains the specified text.
     * 
     * @param {string | string[] | Cypress.Chainable<any>} values - The text or array of texts to check for.
     * @returns {Cypress.Chainable<any>} - Cypress chainable object.
     */
    contains(
        value: string | string[] | Cypress.Chainable<any>,
        expectedLength?: number
    ) {
        if (typeof value === 'string' || Array.isArray(value)) {
            return assertElementContains(
                this.cyElement(),
                value,
                true
            );
        } else {
            // Handle the case when values is a Cypress.Chainable<any>
            return assertElementExist(
                value,
                expectedLength
            );
        }
    }

    /**
     * Asserts that the element has the specified class.
     * 
     * @param {string} name - The class name to check for.
     */
    haveClass(
        name: string
    ) {
        assertElementShould(
            this.cyElement(),
            'have.class',
            name
        );
    }

    /**
     * Asserts that the element has the specified CSS style.
     * 
     * @param {string} style - The CSS style to check for.
     */
    haveCSS(
        property: string,
        value: string
    ) {
        assertElementShould(
            this.cyElement(),
            'have.css',
            value,
            property
        );
    }

    parentHaveCSS(
        property: string,
        value: string
    ) {
        assertElementShould(
            this.cyElement()
                .parent(),
            'have.css',
            value,
            property
        );
    }

    atLeastOneElementWithCssProperty(
        property: string,
        value: string
    ) {
        // Assert the expected color
        this.cyElement()
            .find('*')
            .then($element => {
                assertAtLeastOneElementWithCssProperty(
                    $element,
                    property,
                    value
                )
            });
    }

    /**
     * Function to validate filled fields.
     */
    validateFilledFields(...args: any[]) { // Function to validate filled fields
    }

    /**
     * Custom assertion method to check multiple conditions dynamically.
     * 
     * @param {Array<{ method: string, params: any[] }>} assertions - Array of objects containing assertion methods and their parameters.
     */
    assertMultiple(
        assertions: {
            method: string,
            params: any[]
        }[]
    ) {
        assertions.forEach(({ method, params }) => {
            switch (method) {
                case 'exist':
                    this.exist();
                    break;
                case 'visible':
                    this.visible();
                    break;
                case 'enabled':
                    this.enabled();
                    break;
                case 'disabled':
                    this.disabled();
                    break;
                case 'isValue':
                    this.isValue(params[0]);
                    break;
                case 'isEmpty':
                    this.empty();
                    break;
                case 'isContains':
                    this.contains(params[0]);
                    break;
                case 'haveClass':
                    this.haveClass(params[0]);
                    break;
                case 'haveCSS':
                    this.haveCSS(params[0], params[1]);
                    break;
                default:
                    throw new Error(`Unsupported assertion method: ${method}`);
            }
        });
    }

    /**
     * Intercept the GET request for fetching data.
     */
    interceptOnLoadRequest() {
        cy.interceptAPIRequest(
            this.getOnLoadRequestHttpMethod()!,
            this.getOnLoadRequestUrl()!,
            this.getName()
        );

        logInterceptRequest(
            this.getOnLoadRequestHttpMethod()!,
            this.getOnLoadRequestUrl()!,
            this.getName() + '_OnLoad'
        )
    }

    interceptOnEventRequest() {
        cy.interceptAPIRequest(
            this.getOnEventRequestHttpMethod()!,
            this.getOnEventRequestUrl()!,
            this.getName() + '_OnEvent'
        );

        logInterceptRequest(
            this.getOnEventRequestHttpMethod()!,
            this.getOnEventRequestUrl()!,
            this.getName() + '_OnEvent'
        )
    }

    /**
     * Recursively intercepts requests for data in components and their child fields.
     * If a component is of type 'FIELD' or 'DATATABLE' and has a dataAPI defined,
     * it intercepts GET requests for data. Otherwise, it recursively calls itself
     * on child components.
     */
    interceptComponentRequests() {
        this.elements.forEach(component => {
            // Element source data Request
            if (component.onLoadRequest!.url) {
                if (['GET', 'POST'].includes(component.onLoadRequest!.method!)) {
                    component.interceptOnLoadRequest();
                } else {
                    throw new Error(`Unknown Http method: ${component.onLoadRequest!.method}`);
                }
            }

            // Element on event Request
            if (component.onEventRequest!.url) {
                if (['GET', 'POST', 'PUT', 'DELETE'].includes(component.onEventRequest!.method!)) {
                    component.interceptOnEventRequest();
                } else {
                    throw new Error(`Unknown Http method: ${component.onEventRequest!.method}`);
                }
            }

            // Recursively intercept requests for data and events in child components
            component.interceptComponentRequests();
        });
    }

    /**
     * Waits for data to be loaded.
     */
    waitForLoadResponse(
        timeout?: number
    ) {
        if (this.onLoadRequest!.url) {
            cy.waitingAliasRequest(
                this.getName(),
                timeout
            );
        }
    }

    waitForEventResponse() {
        if (this.onEventRequest!.url) {
            return cy.waitingAliasRequest(
                this.getName() + '_OnEvent'
            );
        }
    }

    waitForvalue() {
        (this.onLoadRequest!.url && !this.onLoadRequest!.byDefaultOnLoaded)
            ? this.waitForLoadResponse()
            : null;

        return this.visible()
            .invoke('text')
            .then((text: string) => {
                // Parse the text content to check if it's a valid number
                const value = parseFloat(text);
                return cy.wrap(value);
            });
    }

    /**
     * Recursively waits for data to be loaded in components and their child fields.
     * If a component is of type 'FIELD' and has a dataAPI defined,
     * it waits for data to be loaded. Otherwise, it recursively calls itself
     * on child components.
     */
    waitForElementsData() {
        this.elements.forEach(component => {
            if ((component.as === COMPONENT_TYPE.FIELD || component.as === COMPONENT_TYPE.DATATABLE) && component.onLoadRequest!.url && component.onLoadRequest!.byDefaultOnLoaded) {
                // Assuming waitData is a method in FIELD components
                cy.waitingAliasRequest(
                    component.getName()
                );
            } else {
                // Recursively wait for data in child fields
                component.waitForElementsData();
            }
        });
    }
}

export {
    GenericComponent, // Generic Component class
    COMPONENT_TYPE, // Generic Component Type enum
    LANGUAGE // Language enum
};