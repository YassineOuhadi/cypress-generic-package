/// <reference types="Cypress" />
// @ts-nocheck
import { 
    IGenericComponent 
} from "./IGenericComponent";

interface IGenericMenu extends IGenericComponent {
    // getItem(key: string): IGenericComponent | undefined;
    setItems(
        itemSelectors: Record<string, () => Cypress.Chainable<any>>,
        menuSelectors?: Record<string, () => Cypress.Chainable<any>>,
        dataBaseUrls?: Record<
            string,
            () => {
                onLoadRequestUrl?: string;
                onLoadRequestHttpMethod?: string;
                isByDefaultOnLoaded?: boolean;
                onEventRequestUrl?: string;
                onEventRequestHttpMethod?: string;
            }
        >
    ): void;
    interactWithMenu(
        action: (frameElement: Cypress.Chainable<JQuery<HTMLElement>>) => void
    ): Cypress.Chainable<JQuery<HTMLElement>>;
    selectItems(values: string | string[]): void;
    selectFirstItem(): void;
    clickIfExist(element: any): void;
    isElementExist(): boolean;
    selectRandomItems(
        isMultiple: boolean,
        toignore?: string[]
    ): Promise<string[]>;
    getSelectedItems(): Cypress.Chainable<JQuery<HTMLElement>>;
}

export { 
    IGenericMenu 
};