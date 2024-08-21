/// <reference types="Cypress" />
// @ts-nocheck
import { 
    BUTTON_ENTRY, 
    IGenericButton 
} from "../components/IGenericButton";

import { 
    COMPONENT_TYPE, 
    GenericComponent 
} from "./GenericComponent";

/**
 * Represents a generic button component.
 * 
 * @extends GenericComponent
 */
class GenericButton extends GenericComponent implements IGenericButton {

    /**
     * The type of button entry.
     */
    entry: BUTTON_ENTRY = BUTTON_ENTRY.BUTTON;

    /**
     * The text displayed on the button.
     */
    text?: string;

    /**
     * Constructs a new GenericButton object.
     * 
     * @param {string} name - The name of the button.
     * @param {() => Cypress.Chainable<any>} cyelement - Function selector for the button.
     * @param {any} type - The type of button entry.
     * @param {string} [text] - The text displayed on the button.
     */
    constructor(
        name: string,
        cyelement: () => Cypress.Chainable<any>,
        type?: any,
        text?: string,
        onLoadRequestUrl?: string,
        onLoadRequestHttpMethod?: string,
        dataFromBackendByDefault?: boolean,
        oneventapi?: string,
        onEventHttpMethod?: string,
    ) {
        super(
            COMPONENT_TYPE.BUTTON,
            name, cyelement,
            onLoadRequestUrl,
            onLoadRequestHttpMethod,
            dataFromBackendByDefault,
            undefined,
            oneventapi,
            onEventHttpMethod
        );
        this.entry = type;
        this.setText(text!);
    }

    /**
     * Gets the text displayed on the button.
     * 
     * @returns {string} - The text displayed on the button.
     */
    getText(): string {
        return this.text!;
    }

    /**
     * Sets the text displayed on the button.
     * 
     * @param {string} text - The text to set on the button.
     */
    setText(
        text: string
    ) {
        this.text = text;
    }

    getEntry(): BUTTON_ENTRY {
        return this.entry;
    }

    setEntry(
        entry: string
    ) {
        this.entry = entry as BUTTON_ENTRY;
    }
}

export { 
    GenericButton, 
    BUTTON_ENTRY 
};