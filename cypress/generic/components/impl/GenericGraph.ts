/// <reference types="Cypress" />

import { 
    IGenericGraph 
} from "../IGenericGraph";

import { 
    COMPONENT_TYPE, 
    GenericComponent
} from "./GenericComponent";

// Enum for valid graph entries
enum GraphEntry {
    CHART = 'CHART', // JsChart, Echarts, etc.
    CANVAS = 'CANVAS' // HTML Canvas, SVG, etc.
}

/**
 * Represents a generic graph component.
 * 
 * @extends GenericComponent
 */
class GenericGraph extends GenericComponent implements IGenericGraph {

    entries: GraphEntry[];

    /**
     * Constructs a new GenericGraph object.
     * 
     * @param {string} name - The name of the graph.
     * @param {() => Cypress.Chainable<any>} cyElement - Function selector for the graph.
     * @param {('CHART' | 'CANVAS')[]} types - An array of graph types supported by the graph.
     * @param {string} [api] - Optional data API URL.
     */
    constructor(
        name: string, 
        cyElement: () => Cypress.Chainable<any>, 
        types: GraphEntry[], 
        api?: string, 
        method?: string, 
        dataFromBackendByDefault?: boolean, 
        oneventapi?: string, 
        onEventHttpMethod?: string
    ) {
        super(
            COMPONENT_TYPE.FIELD, 
            name, 
            cyElement, 
            api, 
            method, 
            dataFromBackendByDefault, 
            oneventapi, 
            onEventHttpMethod
        );

        this.entries = types;
    }
}

export { 
    GenericGraph, 
    GraphEntry 
};