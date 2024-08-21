/// <reference types="Cypress" />
// @ts-nocheck
export { 
    IGenericGraph, 
    GRAPH_ENTRY 
};

// Enum for valid graph entries
enum GRAPH_ENTRY {
    CHART = 'CHART', // JsChart, Echarts, etc.
    CANVAS = 'CANVAS' // HTML Canvas, SVG, etc.
}

interface IGenericGraph extends IGenericComponent {
    name: string;
    cyElement: () => Cypress.Chainable<any>;
    entries: GRAPH_ENTRY[];
    api?: string;
    method?: string;
    dataFromBackendByDefault?: boolean;
    oneventapi?: string;
    onEventHttpMethod?: string;
}

import { 
    IGenericComponent 
} from "./IGenericComponent";