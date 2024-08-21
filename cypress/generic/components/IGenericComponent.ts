/// <reference types="Cypress" />
// @ts-nocheck
import { 
    IGenericButton 
} from "./IGenericButton"; // Import IGenericButton interface

import { 
    IGenericForm 
} from "./IGenericForm"; // Import GenericForm class

import { 
    IGenericDatatable 
} from "./IGenericDatatable"; // Import GenericDatatable class

import { 
    IGenericField 
} from "./IGenericField"; // Import GenericField class

import { 
    IGenericMenu 
} from "./IGenericMenu"; // Import GenericMenu class

enum LANGUAGE {
    EN,
    FR
}

// Enum for valid components types
enum COMPONENT_TYPE {
    PAGE = 'PAGE',
    FORM = 'FORM',
    FIELD = 'FIELD',
    BUTTON = 'BUTTON',
    DATATABLE = 'DATATABLE',
    COLUMN = 'COLUMN',
    GRAPH = 'GRAPH',
    MENU = 'MENU',
    GENERIC = 'GENERIC'
}

interface IGenericComponent {
    name: string;
    as: COMPONENT_TYPE;
    cyElement: () => Cypress.Chainable<any>;
    elements: Map<string, IGenericComponent>;
    lang: LANGUAGE;
    onLoadRequest?: {
        url?: string;
        method?: string;
        byDefaultOnLoaded?: boolean;
    };
    onEventRequest?: {
        url?: string;
        method?: string;
    };
    init(): void;
    getName(): string;
    getLanguage(): LANGUAGE;
    setLanguage(lang: LANGUAGE): void;
    getOnLoadRequestUrl(): string | undefined;
    setOnLoadRequestUrl(api: string): Promise<void>;
    getOnLoadRequestHttpMethod(): string | undefined;
    getOnEventRequestUrl(): string | undefined;
    getOnEventRequestHttpMethod(): string | undefined;
    getElement(key: string): IGenericComponent | undefined;
    getFirstSelector(): Cypress.Chainable<any>;
    setElement(key: string, component: IGenericComponent): void;
    setElements(
        elementsSelectors: Record<string, () => Cypress.Chainable<any>>,
        dataBaseUrls?: Record<string, () => {
            onLoadRequestUrl: string;
            onLoadRequestHttpMethod?: string;
            isByDefaultOnLoaded?: boolean;
            onEventRequestUrl?: string;
            onEventRequestHttpMethod?: string;
        }>
    ): void;
    getButton(key: string): IGenericButton | undefined;
    setButton(key: any, button: IGenericButton): void;
    setButtons(
        buttonSelectors: Record<string, () => {
            button: () => Cypress.Chainable<any>;
            type?: string;
        }>,
        menuSelectors?: Record<string, () => Cypress.Chainable<any>>,
        dataBaseUrls?: Record<string, () => {
            onLoadRequestUrl?: string;
            onLoadRequestHttpMethod?: string;
            isByDefaultOnLoaded?: boolean;
            onEventRequestUrl?: string;
            onEventRequestHttpMethod?: string;
        }>
    ): Promise<void>;
    getField(key: string): IGenericField | undefined;
    setField(key: any, field: IGenericField): void;
    getForm(key: string): IGenericForm;
    setForm(key: string, form: IGenericForm): void;
    getTable(key: string): IGenericDatatable;
    setTable(key: string, table: IGenericDatatable): void;
    getMenu(key: string): IGenericMenu;
    getComponentMenu(): IGenericMenu | undefined;
    setMenu(key: string, menu: IGenericMenu): void;
    setMenus(
        menuSelectors: Record<string, () => Cypress.Chainable<any>>,
        items?: Record<string, () => Cypress.Chainable<any>>,
        dataBaseUrls?: Record<string, () => {
            onLoadRequestUrl: string;
            onLoadRequestHttpMethod?: string;
            isByDefaultOnLoaded?: boolean;
            onEventRequestUrl?: string;
            onEventRequestHttpMethod?: string;
        }>
    ): Promise<void>;
    click(values?: string | string[]): void;
    type(text: string): void;
    select(option: string | string[]): void;
    fill(...args: any[]): void;
    performMultipleActions(actions: { method: string, params?: any[] }[]): void;
    exist(): Cypress.Chainable<any>;
    visible(): Cypress.Chainable<any>;
    enabled(): Cypress.Chainable<any>;
    disabled(): Cypress.Chainable<any>;
    isValue(value: string): void;
    asValidNumber(): void;
    getAsNumber(): Cypress.Chainable<number>;
    empty(): void;
    contains(value: string | string[] | Cypress.Chainable<any>, expectedLength?: number): void | Cypress.Chainable<any>;
    haveClass(name: string): void;
    haveCSS(property: string, value: string): void;
    parentHaveCSS(property: string, value: string): void;
    atLeastOneElementWithCssProperty(property: string, value: string): void;
    validateFilledFields(...args: any[]): void;
    assertMultiple(assertions: { method: string, params: any[] }[]): void;
    interceptOnLoadRequest(): void;
    interceptOnEventRequest(): void;
    interceptComponentRequests(): void;
    waitForLoadResponse(timeout?: number): void;
    waitForEventResponse(): Cypress.Chainable<any> | undefined;
    waitForvalue(): Cypress.Chainable<any>;
    waitForElementsData(): void;
}

export { 
    IGenericComponent, // Generic Component interface
    COMPONENT_TYPE, // Generic Component Type enum
    LANGUAGE // Language enum
};