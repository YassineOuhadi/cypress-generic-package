/// <reference types="Cypress" />

export { 
    IGenericGraph, 
    GraphEntry 
};

// Enum for valid graph entries
enum GraphEntry {
    CHART = 'CHART', // JsChart, Echarts, etc.
    CANVAS = 'CANVAS' // HTML Canvas, SVG, etc.
}

interface IGenericGraph extends IGenericComponent {
    name: string;
    cyElement: () => Cypress.Chainable<any>;
    entries: GraphEntry[];
    api?: string;
    method?: string;
    dataFromBackendByDefault?: boolean;
    oneventapi?: string;
    onEventHttpMethod?: string;
}

import { 
    IGenericComponent 
} from "./IGenericComponent";