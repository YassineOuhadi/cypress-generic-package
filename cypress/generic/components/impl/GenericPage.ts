/// <reference types="Cypress" />

import {
    assertURLIncludes
} from "../../assertions";


import {
    COMPONENT_TYPE,
    GenericComponent
} from "./GenericComponent";

import { 
    IGenericPage 
} from "../IGenericPage";

/**
 * Represents a generic page component.
 * 
 * @extends GenericComponent
 */
class GenericPage extends GenericComponent implements IGenericPage {

    /**
     * The base URL of the page.
     */
    baseUrl!: string;

    /**
     * The static instances of the GenericPage class.
     */
    private static instances: Map<
        typeof GenericPage,
        GenericPage
    > = new Map();

    /**
     * Constructs a new GenericPage object.
     * 
     * @param {...any[]} args - Arguments for constructing the page.
     */
    constructor(
        ...args: any[]
    ) {
        super(
            COMPONENT_TYPE.PAGE, 
            args[0]
        );

        const subclass = this.constructor as typeof GenericPage;
        if (!GenericPage.instances.has(subclass)) {
            GenericPage.instances
                .set(subclass, this);
        }
    }

    /**
     * Gets the singleton instance of the GenericPage class.
     * 
     * @param {...any[]} args - Arguments for constructing the page.
     * @returns {GenericPage} - The singleton instance of the GenericPage class.
     */
    static getInstance(
        ...args: any[]
    ): GenericPage {
        const subclass = this as typeof GenericPage;
        if (!GenericPage.instances.has(subclass)) {
            GenericPage.instances
                .set(subclass, new subclass(...args));
        }
        return GenericPage.instances.get(subclass)!;
    }

    static getAllInstances(): GenericPage[] {
        return Array.from(GenericPage.instances.values());
    }

    /**
     * Initializes the page.
     */
    override init() {
        // Clear all local storage
        cy.clearLocalStorage();

        // Call the init method of the parent class (GenericComponent) to perform generic initialization
        super.init();
    }

    // Getters & Setters
    // ..

    /**
     * Gets the page title.
     * 
     * @returns {Cypress.Chainable<string>} - The page title.
     */
    getPageTitle() {
        return cy.title();
    }

    /**
     * Gets the base URL of the page.
     * 
     * @returns {string} - The base URL of the page.
     */
    getBaseUrl() {
        return this.baseUrl;
    }

    /**
     * Sets the base URL of the page.
     * 
     * @param {string} url - The base URL to set.
     */
    setBaseUrl(
        url: string
    ) {
        this.baseUrl = url;
    }

    // Actions

    /**
     * Navigates to the specified path or to the base URL if no path is provided.
     * 
     * @param {string} [path] - The path to navigate to.
     */
    navigate(
        path?: string
    ) {
        path ? this.baseUrl += path : null;
        cy.visit(this.baseUrl);
    }

    // Assertions

    /**
     * Asserts that the specified elements are loaded on the page.
     * 
     * @param {...string[]} elements - The elements to check for loading.
     */
    loaded(
        ...elements: string[]
    ) {
        this.waitForElementsData();

        elements.forEach(c => { 
            cy.get(c).should('be.visible') 
        })
    }

    /**
     * Asserts that the page is opened with the specified path or with the base URL if no path is provided.
     * 
     * @param {string} [path] - The path to assert against.
     */
    isPageOpened(
        path?: string
    ) {
        if (path) {
            assertURLIncludes(
                this.getBaseUrl() + path!
            );
        } else {
            assertURLIncludes(
                this.getBaseUrl()
            );
        }
    }
}

export {
    GenericPage
};