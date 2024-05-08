/// <reference types="Cypress" />

import {
    IGenericMenu
} from "../IGenericMenu";

import {
    COMPONENT_TYPE,
    GenericComponent
} from "./GenericComponent";

/**
 * Represents a generic menu component.
 * 
 * @extends GenericComponent
 */
class GenericMenu extends GenericComponent implements IGenericMenu {

    /**
     * Constructs a new GenericMenu object.
     * 
     * @param {string} name - The name of the menu.
     * @param {() => Cypress.Chainable<any>} [cyelement] - Function selector for the menu.
     * @param {string} [api] - Optional data API URL.
     */
    constructor(
        name: string,
        cyelement?: () => Cypress.Chainable<any>,
        api?: string,
        onLoadRequestHttpMethod?: string,
        dataFromBackendByDefault?: boolean,
        oneventapi?: string,
        onEventHttpMethod?: string
    ) {
        super(
            COMPONENT_TYPE.MENU,
            name,
            cyelement,
            api,
            onLoadRequestHttpMethod,
            dataFromBackendByDefault,
            oneventapi,
            onEventHttpMethod
        );
    }

    getItem(
        key: string
    ): GenericComponent | undefined {
        return this.getElement(key);
    }

    // TODO: Make it generic, [setElements]
    setItems(
        itemSelectors: Record<string, () => Cypress.Chainable<any>>,
        menuSelectors?: Record<string, () => Cypress.Chainable<any>>,
        dataBaseUrls?: Record<string, () => {
            onLoadRequestUrl?: string;
            onLoadRequestHttpMethod?: string;
            isByDefaultOnLoaded?: boolean,
            onEventRequestUrl?: string,
            onEventRequestHttpMethod?: string
        }>
    ) {
        Object.entries(itemSelectors).forEach(([itemName, selectorFn]) => {
            const dataBaseAPI = dataBaseUrls ? dataBaseUrls[itemName]?.() : undefined;
            const menuSelectorFn = menuSelectors ? menuSelectors[itemName] : undefined;

            const item = new GenericComponent(
                COMPONENT_TYPE.BUTTON,
                itemName,
                selectorFn,
                dataBaseAPI?.onLoadRequestUrl,
                dataBaseAPI?.onLoadRequestHttpMethod,
                dataBaseAPI?.isByDefaultOnLoaded,
                dataBaseAPI?.onEventRequestUrl,
                dataBaseAPI?.onEventRequestHttpMethod
            );

            menuSelectorFn ?
                item.setMenu(
                    itemName + '_menu',
                    new GenericMenu(
                        itemName + '_menu',
                        menuSelectorFn,
                        dataBaseAPI?.onLoadRequestUrl,
                        dataBaseAPI?.onLoadRequestHttpMethod,
                        dataBaseAPI?.isByDefaultOnLoaded,
                        dataBaseAPI?.onEventRequestUrl,
                        dataBaseAPI?.onEventRequestHttpMethod
                    )) : null;

            this.setElement(itemName, item);
        });
    }

    /**
     * Function to interact with the menu.
     * 
     * @param {Function} action - The action to perform on the menu.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>} - The Cypress chainable object representing the menu.
     */
    interactWithMenu(
        action: (frameElement: Cypress.Chainable<JQuery<HTMLElement>>) => void
    ) {
        return this.cyElement().then($menu => {
            action(cy.wrap($menu));
        });
    }

    /**
     * Allows selecting multiple items from the menu.
     * 
     * @param {string|string[]} values - A string or an array of values to select.
     */
    selectItems(
        values: string | string[]
    ) {
        const valuesArray = typeof values === 'string' ? [values] : values;
        valuesArray.forEach(value => {
            this.interactWithMenu(frameElement => {
                frameElement.then(() => {
                    frameElement
                        .onFail(`Failed to find ${value} in ${this.getName()}.`)
                        .contains(value)
                        .click({ force: true });
                })
            });
        });
    }

    /**
     * Function to select the first item in the menu.
     */
    selectFirstItem() {
        this.interactWithMenu(frameElement => {
            const checkboxs = frameElement.find('input[type="checkbox"]').then(result => {
                if (Cypress.$(result).length > 0) {
                    checkboxs.first().parent().click({ force: true });
                } else {
                    const classesToCheck = ['.form-check-input', '.checkbox', '.p-checkbox'];
                    let clicked = false;
                    for (const classToCheck of classesToCheck) {
                        const elements = frameElement.find(classToCheck).then(result => {
                            if (Cypress.$(result).length) {
                                elements.first().click({ force: true });
                                clicked = true;
                            }
                        });
                        if (clicked) break;
                    }
                    if (!clicked) {
                        console.error('Neither first input checkbox nor any specific element found.');
                    }
                }
            });
        });
    }

    clickIfExist(
        element: any
    ) {
        cy.get('body').then((body) => {
            cy.wait(5000).then(() => {
                if (body.find(element).length > 0) {
                    cy.log('Element found, proceeding with test')
                    cy.get(element).click()
                } else {
                    cy.log('Element not found, skipping test')
                }
            })
        })
    }

    isElementExist(): boolean {
        const nonExistent = Cypress.$('.ng-option-disabled');
        if (!nonExistent.length) {
            cy.log('Element not found.');
            return false;
        } else {
            return true;
        }
    }

    /**
     * Function to select random items in the menu.
     * 
     * @param {boolean} isMultiple - Indicates whether multiple items should be selected.
     * @param {string[]} toignore - An array of strings to ignore while selecting random items.
     * @returns {Promise<string[]>} - A promise resolving to an array of selected strings.
     */
    selectRandomItems(
        isMultiple: boolean,
        toignore?: string[]
    ): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            this.interactWithMenu(frameElement => {
                if (Cypress.$(frameElement).find('.ng-option-disabled').length > 0) {
                    console.error('No checkboxes found.');
                    resolve([]); // Resolve with an empty array
                    return;
                } else {
                    const checkboxes = frameElement.find('input[type="checkbox"]');
                    checkboxes.then(elements => {
                        const selectedValues: string[] = [];

                        if (Cypress.$(elements).length > 0) {
                            if (isMultiple) {
                                // Select multiple random checkboxes
                                const randomIndexes: number[] = [];
                                while (randomIndexes.length < 2) {
                                    const randomIndex = Math.floor(Math.random() * elements.length);
                                    if (!randomIndexes.includes(randomIndex)) {
                                        const value = (
                                            elements[randomIndex].parentElement as HTMLElement
                                        ).querySelector('span, p, div')!
                                            .textContent;

                                        if (value && !toignore?.includes(value)) {
                                            randomIndexes.push(randomIndex);
                                            // TODO: Bug
                                            (elements[randomIndex].parentElement as HTMLElement).click();
                                            selectedValues.push(value);
                                        }
                                    }
                                }
                            } else {
                                // Select one random checkbox
                                let randomIndex = Math.floor(Math.random() * elements.length);
                                let value = (
                                    elements[randomIndex].parentElement as HTMLElement
                                ).querySelector('span, p, div')!
                                    .textContent;


                                // Keep selecting until a suitable one is found
                                while (toignore && toignore.includes(value!)) {
                                    randomIndex = Math.floor(Math.random() * elements.length);
                                    value = (
                                        elements[randomIndex].parentElement as HTMLElement
                                    ).querySelector('span, p, div')!
                                        .textContent;
                                }

                                if (value) {
                                    (
                                        elements[randomIndex].parentElement as HTMLElement// BU CLICK CJEBOX NOT WORK TODO:
                                    ).click();
                                    if (this.onEventRequest!.url) {
                                        this.waitForEventResponse()
                                    }
                                    selectedValues.push(value);
                                }
                            }
                        } else {
                            const classesToCheck = ['.form-check-input', '.checkbox', '.p-checkbox'];
                            let clicked = false;
                            for (const classToCheck of classesToCheck) {
                                const specificElements = frameElement.find(classToCheck);
                                specificElements.then(specificElements => {
                                    if (Cypress.$(specificElements).length && !clicked) {
                                        const randomIndex = Math.floor(Math.random() * specificElements.length);

                                        const value = (
                                            elements[randomIndex].parentElement as HTMLElement
                                        ).querySelector('span, p, div')!
                                            .textContent;

                                        if (value && !toignore?.includes(value)) {
                                            (specificElements[randomIndex] as HTMLElement).click();
                                            selectedValues.push(value);
                                        }
                                        clicked = true;
                                    }
                                });
                                if (clicked) break;
                            }
                            if (!clicked) {
                                console.error('Neither checkboxes nor any specific elements found.');
                            }
                        }

                        resolve(selectedValues);
                    });
                }
            });
        });
    }

    /**
     * Function to retrieve the list of selected items in the menu.
     * 
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>} - The Cypress chainable object representing the selected items.
     */
    getSelectedItems() {
        return this.interactWithMenu(frameElement => {
            return frameElement.find('.ng-option[aria-selected="true"]');
        });
    }
}

export {
    GenericMenu
};