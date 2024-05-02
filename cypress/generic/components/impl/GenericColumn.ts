/// <reference types="Cypress" />

import { 
    GenericButton 
} from "./GenericButton";

import { 
    FieldEntry, 
    GenericField 
} from "./GenericField";

import { 
    COMPONENT_TYPE, 
    GenericComponent 
} from "./GenericComponent";

import { 
    IGenericColumn, 
    SORTING 
} from "../IGenericColumn";

/**
 * Represents a generic column component.
 * 
 * @extends GenericComponent
 */
class GenericColumn extends GenericComponent implements IGenericColumn {

    /**
     * The sorting value of the column.
     */
    sortingvalue: SORTING = SORTING.NONE;

    /**
     * The filtering input associated with the column.
     */
    filteringinput?: GenericField;

    /**
     * The sorting button associated with the column.
     */
    sortingbutton?: GenericButton;

    /**
     * The edit action button associated with the column.
     */
    EditActionButton?: GenericButton;

    options?: Map<
        string, 
        GenericButton
    >;

    /**
     * The index of the column.
     */
    index: number;

    /**
     * Constructs a new GenericColumn object.
     * 
     * @param {string} name - The name of the column.
     * @param {() => Cypress.Chainable<any>} cyElement - The Cypress element function for the column.
     * @param {number} index - The index of the column.
     * @param {GenericField} [filtercomponent] - The filter component associated with the column.
     */
    constructor(
        name: string,
        cyElement: () => Cypress.Chainable<any>,
        index: number,
        filtercomponent?: GenericField,
        sortbutton?: GenericButton
    ) {
        super(COMPONENT_TYPE.COLUMN, name, cyElement);
        this.index = index;
        this.filteringinput = filtercomponent;
        this.sortingbutton = sortbutton
    }

    /**
     * Gets the sorting button associated with the column.
     * 
     * @returns {GenericButton | undefined} - The sorting button.
     */
    getSortButton() {
        return this.sortingbutton;
    }

    /**
     * Sets the sorting button associated with the column.
     * 
     * @param {GenericButton} sortbutton - The sorting button to set.
     */
    setSortButton(
        sortbutton: GenericButton
    ) {
        this.sortingbutton = sortbutton;
    }

    /**
     * Gets the sorting value of the column.
     * 
     * @returns {SORTING} - The sorting value.
     */
    getSort() {
        return this.sortingvalue;
    }

    /**
     * Sets the sorting value of the column.
     * 
     * @param {SORTING} columnsorting - The sorting value to set.
     */
    setSort(
        columnsorting: SORTING
    ) {
        this.sortingvalue = columnsorting;
    }

    /**
     * Gets the filtering input associated with the column.
     * 
     * @returns {Field | undefined} - The filtering input.
     */
    getFilterInput() {
        return this.filteringinput;
    }

    /**
     * Sets the filtering input associated with the column.
     * 
     * @param {Field} filterinput - The filtering input to set.
     */
    setFilterInput(
        filterinput: GenericField
    ) {
        this.filteringinput = filterinput;
    }

    /**
     * Gets the filter value of the column.
     * 
     * @returns {Cypress.Chainable<string>} - The filter value.
     */
    getFilter() {
        return this.getFilterInput()?.cyElement()
            .invoke('val')
            .then((sometext: string) => {
                return sometext;
            });
    }

    /**
     * Performs sorting on the column.
     * 
     * @param {SORTING} columnsorting - The sorting value.
     */
    sorting(
        columnsorting: SORTING
    ) {
        this.setSort(columnsorting);
        if (columnsorting === SORTING.DECREMENT) {
            // this.getSortButton().entry === ButtonEntry.BUTTON
            this.getSortButton()!.click()
        } else {
           // Double click
        }
    }

    /**
     * Performs filtering on the column.
     * 
     * @param {string} by - The value to filter by.
     */
    filtering(
        by: string
    ) {
        return this.getFilterInput()?.entries.includes(FieldEntry.INPUT)
            ? this.getFilterInput()?.type(by).then(() => {
                this.waitForElementsData()
            })
            : null;
    }
}

export { 
    GenericColumn, 
    SORTING 
};