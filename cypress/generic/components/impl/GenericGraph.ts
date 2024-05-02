/// <reference types="Cypress" />

import { 
    GRAPH_ENTRY,
    IGenericGraph 
} from "../IGenericGraph";

import { 
    COMPONENT_TYPE, 
    GenericComponent
} from "./GenericComponent";

/**
 * Represents a generic graph component.
 * 
 * @extends GenericComponent
 */
class GenericGraph extends GenericComponent implements IGenericGraph {

    entries: GRAPH_ENTRY[];

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
        types: GRAPH_ENTRY[], 
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
    GenericGraph 
};