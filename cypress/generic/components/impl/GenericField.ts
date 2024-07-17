/// <reference types="Cypress" />

import { 
    assertElementShould 
} from "../../assertions";

import { 
    FIELD_ENTRY, 
    IGenericField
} from "../IGenericField";

import { 
    COMPONENT_TYPE, 
    GenericComponent
} from "./GenericComponent";

/**
 * Represents a generic field component.
 * 
 * @extends GenericComponent
 */
class GenericField extends GenericComponent implements IGenericField {

    /** @var entries - An array of input types supported by the field. */
    entries: FIELD_ENTRY[];

    /** @var placeholder - Optional placeholder text for the field. */
    placeholder?: string;

    /** @var optional - Indicates whether the field is optional. */
    optional = false;

    /**
     * Constructs a new GenericField object.
     * 
     * @param {string} name - The name of the field.
     * @param {() => Cypress.Chainable<any>} cyElement - Function selector for the field.
     * @param {('INPUT' | 'SELECT' | 'MULTISELECT' | 'OPTION' | 'RADIO' | 'TEXTAREA')[]} types - An array of input types supported by the field.
     * @param {string} [api] - Optional data API URL.
     * @param {string} [placeholder] - Optional placeholder text for the field.
     * @param {Boolean} [isOptional] - Indicates whether the field is optional.
     */
    constructor(
        name: string, 
        cyElement: () => Cypress.Chainable<any>, 
        types: FIELD_ENTRY[], 
        api?: string, 
        method?: string, 
        dataFromBackendByDefault?: boolean, 
        oneventapi?: string, 
        onEventHttpMethod?: string, 
        placeholder?: string, 
        isOptional?: boolean
    ) {
        super(
            COMPONENT_TYPE.FIELD, 
            name, 
            cyElement, 
            api, 
            method, 
            dataFromBackendByDefault,
            undefined, 
            oneventapi, 
            onEventHttpMethod
        );

        this.entries = types;
        this.optional = isOptional!;
        placeholder ? this.setPlaceholder(placeholder) : null;
    }

    /**
     * Adds a new entry to the entries array.
     * 
     * @param {FIELD_ENTRY} entry - The entry to add.
      */
    addToEntries(
        entry: FIELD_ENTRY
    ) {
        if (!this.entries.includes(entry)) {
            this.entries.push(entry);
        }
    }

    /**
     * Removes an entry from the entries array.
     * 
     * @param {FIELD_ENTRY} entry - The entry to remove.
     */
    removeFromEntries(
        entry: FIELD_ENTRY
    ) {
        const index = this.entries.indexOf(entry);
        if (index !== -1) {
            this.entries.splice(index, 1);
        }
    }

    /**
     * Retrieves the placeholder text for the field.
     * 
     * @returns {string | undefined} - The placeholder text, if available.
     */
    getPlaceholder(): string | undefined {
        if (this.entries.some(entry => ['INPUT', 'TEXTAREA', 'SELECT', 'MULTISELECT'].includes(entry)))
            return this.placeholder;
        return undefined;
    }

    /**
     * Sets the placeholder text for the field.
     * 
     * @param {string} placeholder - The placeholder text to set.
     */
    setPlaceholder(
        placeholder: string
    ) {
        if (this.entries.some(entry => ['INPUT', 'TEXTAREA', 'SELECT', 'MULTISELECT'].includes(entry)))
            this.placeholder = placeholder;
    }

    // Overrides Actions
    /**
     * Overrides the type method to input text into the field, considering auto-complete functionality if available.
     * 
     * @param {string} text - The text to input into the field.
     */
    override type(
        text: string
    ) {
        const isInput = this.entries.includes(FIELD_ENTRY.INPUT);
        const isAutoComplete = this.getComponentMenu() !== undefined;

        if (isInput && isAutoComplete) {
            return this.cyElement().find('input').scrollIntoView().clear({ force: true }).type(text, { force: true });
        } else {
            return this.cyElement().scrollIntoView().clear({ force: true }).type(text, { force: true });
        }
    }

    /**
     * Overrides the click method to click on the element, considering auto-complete functionality if available.
     */
    override click() {
        const isInput = this.entries.includes(FIELD_ENTRY.INPUT);
        const isAutoComplete = this.getComponentMenu() !== undefined;
        const cyElement = this.cyElement();

        if (isInput && isAutoComplete) {
            // cyElement.invoke('prop', 'tagName').then((tagName: string) => {
            // if (tagName.toLowerCase() !== 'input') {
            return cyElement.find('input').scrollIntoView().click({ force: true });
            // }
            // });
        }

        return cyElement.scrollIntoView().click({ force: true });
    }

    /**
     * Overrides the fill method to handle different field types.
     * 
     * @param {string[]} values - The array of values to fill in the field.
     * @param {boolean} isMultiple - Indicates whether multiple items should be selected.
     * @returns {Promise<string[]>} - A promise resolving to an array of selected strings.
     */
    override fill(values?: string | string[], toignore?: string[], isMultiple?: boolean): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            if (values && values.length > 0) {
                // Assert that the text input exists
                this.exist();

                (this.onLoadRequest!.url && !this.onLoadRequest!.byDefaultOnLoaded)
                    ? cy.wrap(this.waitForLoadResponse())
                    : null;

                (this.getComponentMenu() && this.getComponentMenu()?.onLoadRequest!.url && !this.getComponentMenu()?.onLoadRequest!.byDefaultOnLoaded)
                    ? this.waitForElementsData()
                    : null;

                // Convert single string to an array
                Array.isArray(values)
                    ? isMultiple = true
                    : values = [values];

                // Handle input type
                if (this.entries.includes(FIELD_ENTRY.INPUT)) {
                    values.forEach(value => {
                        // Click
                        this.click();

                        // Enter value into the input
                        this.type(value);

                        // Handle INPUT Auto Complete
                        if (this.getComponentMenu() !== undefined) {
                            // Wait for the API request to complete
                            // this.waitData();
                            this.getComponentMenu()?.selectFirstItem();
                        }
                    });
                }

                // Handle MULTISELECT field type
                else if (this.entries.includes(FIELD_ENTRY.MULTISELECT)) {
                    if (this.getComponentMenu() !== undefined) {
                        // Enter value into the input
                        this.click();

                        // Wait for the API request to complete
                        // this.waitData();
                        this.getComponentMenu()?.selectItems(values);
                    } else {
                        this.select(values);
                    }
                }

                // Handle SELECT field type
                else if (this.entries.includes(FIELD_ENTRY.SELECT)) {
                    // Select option
                    this.select(values);
                }

                // Handle other field types
                else {
                    // Handle other cases
                }
            } else {
                if (this.entries.includes(FIELD_ENTRY.INPUT) && this.entries.includes(FIELD_ENTRY.MULTISELECT)) {
                    // Handle input type
                    this.click();

                    // Handle INPUT Auto Complete
                    if (this.getComponentMenu() !== undefined) {
                        // Wait for the API request to complete
                        // this.waitData();
                        this.getComponentMenu()?.selectRandomItems(isMultiple!, toignore)?.then(selectedValues => {
                            resolve(selectedValues);
                        }).catch(error => {
                            reject(error);
                        });
                    }
                }
            }
        });
    }

    /**
     * Asserts that the element's value matches the specified value.
     * 
     * @param {string} value - The expected value.
     */
    override isValue(value: string) {
        assertElementShould(this.cyElement(), 'have.value', value);
    }

    /**
     * Overrides the validateFilledFields method to validate filled fields based on input type.
     * 
     * @param {string} value - The value to validate in the input field.
     */
    override validateFilledFields(values: string | string[]) {
        // Handle input type
        if (this.entries.includes(FIELD_ENTRY.INPUT)) {

            // Handle INPUT Auto Complete
            if (this.getComponentMenu()) {

                // Assert that the text input exists
                this.exist();

                // Validate value
                this.contains(values);
            } else if (!Array.isArray(values)) {
                // Assert that the text input is exist
                this.exist();

                // Validate value
                this.isValue(values);
            }
        }

        // Handle SELECT input type
        else if (this.entries.includes(FIELD_ENTRY.SELECT)) {
            // Assert that the select input exists
            this.exist();
            // Validate value
            this.contains(values);
        }

        // Handle other input types
        else {
            // Handle other cases
        }
    }
}

export { 
    GenericField, 
    FIELD_ENTRY as FieldEntry 
};