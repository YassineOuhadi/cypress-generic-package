/// <reference types="Cypress" />

import { 
    IGenericButton 
} from "./IGenericButton";

import { 
    IGenericComponent 
} from "./IGenericComponent";

import { 
    IGenericField 
} from "./IGenericField";

interface IGenericForm extends IGenericComponent {
    getFieldsKeys(): string[];
    setField(key: any, field: IGenericField): void;
    getField(key: any): IGenericField | undefined;
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
    ): void;
    validFieldsValues(
        data: any, 
        fieldsToIgnore?: string[]
    ): void;
    getSubmitButtons(): IGenericButton[];
    submitForm(): void
}

export { 
    IGenericForm 
};
