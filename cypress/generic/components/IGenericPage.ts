/// <reference types="Cypress" />
// @ts-nocheck
import { 
    IGenericComponent 
} from "./IGenericComponent";

interface IGenericPage extends IGenericComponent {
    baseUrl: string;
    init(): void;
    getPageTitle(): Cypress.Chainable<string>;
    getBaseUrl(): string;
    setBaseUrl(url: string): void;
    navigate(path?: string): void;
    loaded(...elements: string[]): void;
    isPageOpened(path?: string): void;
}

export {
    IGenericPage
};