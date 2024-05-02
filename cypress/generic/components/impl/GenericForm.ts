/// <reference types="Cypress" />

import { 
    GenericButton 
} from "./GenericButton";

import { 
    FieldEntry, 
    GenericField 
} from "./GenericField";

import { 
    COMPONENT_TYPE, 
    GenericComponent 
} from "./GenericComponent";

import { 
    GenericMenu 
} from "./GenericMenu";

import { 
    IGenericForm 
} from "../IGenericForm";

/**
 * Represents a generic form component.
 * 
 * @extends GenericComponent
 */
class GenericForm extends GenericComponent implements IGenericForm {

    /**
     * Constructs a new GenericForm object.
     * 
     * @param {string} name - The name of the form.
     * @param {() => Cypress.Chainable<any>} [cyelement] - The Cypress element function for the form.
     */
    constructor(
        name: string, 
        cyelement?: () => Cypress.Chainable<any>, 
        api?: string, 
        method?: string, 
        dataFromBackendByDefault?: boolean, 
        oneventapi?: string, 
        onEventHttpMethod?: string
    ) {
        super(
            COMPONENT_TYPE.FORM, 
            name, 
            cyelement, 
            api, 
            method, 
            dataFromBackendByDefault, 
            oneventapi, 
            onEventHttpMethod
        )
    }

    /**
     * Gets the keys of all fields in the form.
     * 
     * @returns {string[]} - An array of field keys.
     */
    getFieldsKeys(): string[] {
        // Filter keys based on the type of elements
        return Array.from(this.elements.entries())
            .filter(([key, component]) => component.as === 'FIELD')
            .map(([key]) => key);
    }

    /**
     * Adds a field to the form.
     * 
     * @param {any} key - The key of the field.
     * @param {Field} field - The field to add.
     */
    override setField(
        key: any, 
        field: GenericField
    ) {
        this.elements.set(key, field);
    }

    /**
     * Gets a field from the form by key.
     * 
     * @param {any} key - The key of the field.
     * @returns {Field | undefined} - The field object, if found.
     */
    override getField(
        key: any
    ): GenericField | undefined {
        if (this.elements.get(key) instanceof GenericField) {
            return this.elements.get(key) as GenericField;
        } else {
            return undefined;
        }
    }

    /**
     * Sets fields with optional menus and database URLs.
     * 
     * @param {Record<string, () => Cypress.Chainable<any>>} fieldSelectors - The selectors for the fields.
     * @param {Record<string, () => Cypress.Chainable<any>>} [menuSelectors] - The selectors for the associated menus.
     * @param {Record<string, () => string>} [dataBaseUrls] - The database URLs for the fields.
     */
    setFields(
        fieldSelectors: Record<string, () => {
            field: () => Cypress.Chainable<any>,
            entry: string[],
            placeholder?: string,
            isOptional?: boolean
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
        Object.entries(fieldSelectors).forEach(([fieldName, selectorFn]) => {
            const dataBaseAPI = dataBaseUrls ? dataBaseUrls[fieldName]?.() : undefined;
            const menuSelectorFn = menuSelectors ? menuSelectors[fieldName] : undefined;

            const field = new GenericField(
                fieldName,
                selectorFn().field,
                selectorFn().entry.map(type => type.toUpperCase() as FieldEntry),
                dataBaseAPI?.onLoadRequestUrl,
                dataBaseAPI?.onLoadRequestHttpMethod,
                dataBaseAPI?.isByDefaultOnLoaded,
                dataBaseAPI?.onEventRequestUrl,
                dataBaseAPI?.onEventRequestHttpMethod,
                selectorFn().placeholder!,
                selectorFn().isOptional!
            );

            menuSelectorFn ?
                field.setMenu(fieldName + '_menu',
                    new GenericMenu(
                        fieldName + '_menu',
                        menuSelectorFn,
                        dataBaseAPI?.onLoadRequestUrl,
                        dataBaseAPI?.onLoadRequestHttpMethod,
                        dataBaseAPI?.isByDefaultOnLoaded,
                        dataBaseAPI?.onEventRequestUrl,
                        dataBaseAPI?.onEventRequestHttpMethod
                    )
                ) : null;

            this.setField(fieldName, field);
        });
    }
    
    /**
     * Fills the form with the provided data.
     * 
     * @param {any} data - The data to fill the form with.
     * @param {string[]} [fieldsToIgnore] - The fields to ignore while filling the form.
     */
    override fill(
        data: any, 
        fieldsToIgnore?: string[]
    ) {
        const fieldsToFill: string[] = Object.keys(data);
        fieldsToFill.forEach(f => {
            if (data[f]) {
                const field = this.getField(f);

                if (!field) {
                    console.warn(`Element for field "${f}" not found.`);
                    return; // Skip if element not found
                }

                if (!fieldsToIgnore!.includes(f)) {
                    field.fill(data[f])
                }
            }
        });
    }

    /**
     * Validates the values of the fields in the form.
     * 
     * @param {any} data - The data to validate.
     * @param {string[]} [fieldsToIgnore] - The fields to ignore while validating.
     */
    validFieldsValues(
        data: any, 
        fieldsToIgnore?: string[]
    ) {
        let fieldsToFill: string[];

        fieldsToFill = Object.keys(data);

        if (fieldsToIgnore && fieldsToIgnore.length > 0)
            fieldsToFill = fieldsToFill.filter(field => !fieldsToIgnore.includes(field));

        fieldsToFill.forEach(f => {

            const field = this.getField(f);

            if (!field) {
                console.warn(`Element for field "${f}" not found.`);
                return; // Skip if element not found
            }

            field.validateFilledFields(data[f]);
        });
    }

    /**
     * Gets the submit buttons in the form.
     * 
     * @returns {GenericButton[]} - An array of submit buttons.
     */
    getSubmitButtons(): GenericButton[] {
        return (
            Array.from(this.elements.values())
            .filter(button => button.as === 'BUTTON') as GenericButton[]
        ).filter(button => button.entry === 'SUBMIT');
    }

    /**
     * Submits the form.
     */
    submitForm() {
        const submitButtons = this.getSubmitButtons();
        if (submitButtons.length > 0) {
            // submitFields.forEach(submitField => {
            //     submitField.cyElement.click({ force: true });
            // });
            submitButtons[0].cyElement().click({ force: true }); //TODO: Multi Submit Buttons, To Fixed, case of more thanb one submit, shoud get by key
        } else {
            console.warn('No submit fields found.');
        }
    }
}

export { 
    GenericForm 
};
