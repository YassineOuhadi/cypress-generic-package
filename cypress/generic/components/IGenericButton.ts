/// <reference types="Cypress" />

import { 
    IGenericComponent 
} from "./IGenericComponent";

export { 
    IGenericButton, 
    BUTTON_ENTRY 
};

// Enum for valid button entries
enum BUTTON_ENTRY {
    BUTTON = 'BUTTON',
    SUBMIT = 'SUBMIT',
    HREF = 'HREF'
}

interface IGenericButton extends IGenericComponent {
    entry: BUTTON_ENTRY;
    text?: string;
    name: string;
    onLoadRequestUrl?: string;
    onLoadRequestHttpMethod?: string;
    dataFromBackendByDefault?: boolean;
    oneventapi?: string;
    onEventHttpMethod?: string;
    getText(): string;
    setText(text: string): void;
    getEntry(): BUTTON_ENTRY;
    setEntry(entry: string): void;
}