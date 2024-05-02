/// <reference types="Cypress" />

import { 
    IGenericComponent 
} from "./IGenericComponent";

export { 
    IGenericButton, 
    ButtonEntry 
};

// Enum for valid button entries
enum ButtonEntry {
    BUTTON = 'BUTTON',
    SUBMIT = 'SUBMIT',
    HREF = 'HREF'
}

interface IGenericButton extends IGenericComponent {
    entry: ButtonEntry;
    text?: string;
    name: string;
    onLoadRequestUrl?: string;
    onLoadRequestHttpMethod?: string;
    dataFromBackendByDefault?: boolean;
    oneventapi?: string;
    onEventHttpMethod?: string;
    getText(): string;
    setText(text: string): void;
    getEntry(): ButtonEntry;
    setEntry(entry: string): void;
}