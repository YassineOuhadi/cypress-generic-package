/// <reference types="Cypress" />

import { 
    IGenericComponent 
} from "./IGenericComponent";

// Enum for valid field entries
enum FIELD_ENTRY {
    INPUT = 'INPUT',
    SELECT = 'SELECT',
    MULTISELECT = 'MULTISELECT',
    OPTION = 'OPTION',
    RADIO = 'RADIO',
    TEXTAREA = 'TEXTAREA',
    LABEL = 'LABEL'
}

interface IGenericField extends IGenericComponent {
    entries: FIELD_ENTRY[];
    placeholder?: string;
    optional: boolean;

    addToEntries(entry: FIELD_ENTRY): void;
    removeFromEntries(entry: FIELD_ENTRY): void;
    getPlaceholder(): string | undefined;
    setPlaceholder(placeholder: string): void;
    type(text: string): Cypress.Chainable<any>;
    click(): Cypress.Chainable<any>;
    fill(values?: string | string[], toignore?: string[], isMultiple?: boolean): Promise<string[]>;
    isValue(value: string): void;
    validateFilledFields(values: string | string[]): void;
}

export { 
    IGenericField, 
    FIELD_ENTRY 
};