/// <reference types="Cypress" />

import {
    ButtonEntry,
    GenericButton
} from "./GenericButton";

import {
    FieldEntry,
    GenericField
} from "./GenericField";

import {
    GenericColumn,
    SORTING
} from "./GenericColumn";

import {
    COMPONENT_TYPE,
    GenericComponent
} from "./GenericComponent";

import { 
    IGenericDatatable 
} from "../IGenericDatatable";

/**
 * Represents a generic datatable component.
 * 
 * @extends GenericComponent
 */
class GenericDatatable extends GenericComponent implements IGenericDatatable {

    // Current page index
    currentpage = 0;

    /**
     * NOTE: Datatable elements keys,
     * Selector for the page size select field : The name '_pagesize' key indicates the page size select field.
     * Selector for the total label : he name '_total' key indicates the total label.
    */

    /**
     * Constructs a new GenericDatatable object.
     * 
     * @param {string} name - The name of the datatable.
     * @param {() => Cypress.Chainable<any>} [cyelement] - The Cypress element function for the datatable.
     * @param {string} [api] - The API endpoint for the datatable.
     */
    constructor(
        name: string,
        cyelement?: () => Cypress.Chainable<any>,
        api?: string,
        dataFromBackendByDefault?: boolean,
        oneventapi?: string,
        onEventHttpMethod?: string
    ) {
        super(
            COMPONENT_TYPE.DATATABLE,
            name, cyelement,
            api, 'GET',
            dataFromBackendByDefault,
            oneventapi,
            onEventHttpMethod
        );
    }

    /**
     * Gets the keys of all columns in the datatable.
     * 
     * @returns {string[]} - An array of column keys.
     */
    getColumnsKeys(): string[] {
        return Array.from(this.elements.entries())
            .filter(([key, component]) => component.as === 'COLUMN')
            .map(([key]) => key);
    }

    /**
     * Adds a column to the datatable.
     * 
     * @param {any} key - The key of the column.
     * @param {GenericColumn} column - The column to add.
     */
    addColumn(
        key: any,
        column: GenericColumn
    ) {
        this.elements
            .set(key, column);
    }

    /**
     * Adds columns to the datatable.
     * 
     * @param {Record<string, () => Cypress.Chainable<any>>} columnSelectors - The selectors for the columns.
     * @param {Record<string, () => Cypress.Chainable<any>>} [filters] - The selectors for the associated filters.
     */
    addColumns(
        columnSelectors: Record<string, () => Cypress.Chainable<any>>,
        filters?: Record<string, () => Cypress.Chainable<any>>,
        sortbuttons?: Record<string, () => { button: () => Cypress.Chainable<any> }>
    ) {
        Object.entries(columnSelectors).forEach(([columnName, selectorFn], index) => {
            const filterComponent = filters ? filters[columnName] : undefined;
            let sortbuttonFn;

            // Check if sortbuttons are provided and if a button with the same name exists
            if (sortbuttons && sortbuttons[columnName]) {
                sortbuttonFn = sortbuttons[columnName];
            }

            const genericColumn = new GenericColumn(
                columnName,
                selectorFn,
                index++,
                new GenericField(
                    columnName + '_filter',
                    filterComponent!,
                    [FieldEntry.INPUT]
                )
            );

            // If a sort button function is found for the column, set it as the sorting button
            if (sortbuttonFn) {
                genericColumn.setSortButton(
                    new GenericButton(
                        columnName + '_sort',
                        sortbuttonFn().button,
                        [ButtonEntry.BUTTON]
                    )
                );
            }

            this.addColumn(
                columnName,
                genericColumn
            );
        });
    }

    /**
     * Gets a column from the datatable by key.
     * 
     * @param {string} key - The key of the column.
     * @returns {GenericColumn | undefined} - The column object, if found.
     */
    getColumn(
        key: string
    ): GenericColumn | undefined {
        if (this.elements.get(key) instanceof GenericColumn) {
            return this.elements
                .get(key) as GenericColumn;
        } else {
            return undefined;
        }
    }

    /**
     * Gets the label for the total rows.
     * 
     * @returns {Field | undefined} - The total rows label field.
     */
    getRowsTotalLabel() {
        return this.getElement('_total');
    }

    /**
     * Sets the label for the total rows.
     * 
     * @param {Field} totallabel - The total rows label field.
     */
    setRowsTotalLabel(
        totallabel: GenericComponent
    ) {
        this.setElement('_total', totallabel);
    }

    /**
     * Gets the total number of rows.
     * 
     * @returns {number} - The total number of rows.
     */
    getRowsTotal(): number {
        let total = 0;
        this.getRowsTotalLabel()
            ?.cyElement()
            .invoke('text')
            .then((text) => {
                total = parseFloat(text);
            });
        return total;
    }

    /**
     * Gets the page size field.
     * 
     * @returns {Field | undefined} - The page size field.
     */
    getPageSizeField() {
        return this.getField('_pagesize');
    }

    /**
     * Sets the page size field.
     * 
     * @param {GenericField} pagesizeselect - The page size field.
     */
    setPageSizeField(
        pagesizeselect: GenericField
    ) {
        this.setField(
            '_pagesize', 
            pagesizeselect
        );
    }

    /**
     * Gets the page size.
     * 
     * @returns {number} - The page size.
     */
    getPageSize(): number {
        let size = 0;
        this.getPageSizeField()?.cyElement()
            .invoke('val')
            .then(value => {
                size = value;
            });
        return size;
    }

    /**
     * Gets the current page index.
     * 
     * @returns {number} - The current page index.
     */
    getCurrentPage() {
        return this.currentpage;
    }

    /**
     * Sets the current page index.
     * 
     * @param {number} pageindex - The current page index.
     */
    setCurrentPage(
        pageindex: number
    ) {
        this.currentpage = pageindex;
    }

    /**
     * Sorts the datatable by a column.
     * 
     * @param {string} bycolumn - The column to sort by.
     * @param {SORTING} sortingvalue - The sorting direction.
     */
    sorting(
        bycolumn: string, 
        sortingvalue: SORTING
    ) {
        const column = this.getColumn(bycolumn);
        column!.sorting(sortingvalue)
    }

    /**
     * Filters the datatable by a column.
     * 
     * @param {string} bycolumn - The column to filter by.
     * @param {string} filteringvalue - The value to filter by.
     */
    filtering(
        bycolumn: string, 
        filteringvalue: string
    ) {
        const column = this.getColumn(bycolumn);

        return column?.filtering(filteringvalue)!.then(() => {
            return this.waitForLoadResponse()
        })
    }

    /**
     * Gets the button for navigating to the first page.
     * 
     * @returns {Button} - The first page button.
     */
    getFirstPageButton(): GenericButton {
        return this.elements.get('_firstpage')! as GenericButton;
    }

    /**
     * Gets the button for navigating to the next page.
     * 
     * @returns {GenericButton} - The next page button.
     */
    getNextPageButton(): GenericButton {
        return this.elements.get('_nextpage')! as GenericButton;
    }

    /**
     * Gets the button for navigating to the previous page.
     * 
     * @returns {GenericButton} - The previous page button.
     */
    getPreviewPageButton(): GenericButton {
        return this.elements.get('_previewspage')! as GenericButton;
    }

    /**
     * Gets the button for navigating to the last page.
     * 
     * @returns {GenericButton} - The last page button.
     */
    getLastPageButton(): GenericButton {
        return this.elements.get('_lastpage')! as GenericButton;
    }

    /**
     * Gets the button for navigating to a specific page index.
     * 
     * @param {number} index - The index of the page.
     * @returns {Cypress.Chainable<JQuery<HTMLElement>>} - The button element.
     */
    getIndexPageButton(
        index: number
    ) {
        return this.cyElement()
            .find(
                this.getButton('_indexpage')!.cyElement() as any
            ).contains(index);
    }

    /**
     * Gets the total number of pages.
     * 
     * @returns {number} - The total number of pages.
     */
    getTotalPages(): number {
        const totalItems = this.getRowsTotal();
        const pageSize = this.getPageSize();
        return Math.ceil(totalItems / pageSize);
    }

    /**
     * Paginates the datatable to a specific page index.
     * 
     * @param {number} pageindex - The index of the page to navigate to.
     */
    paginate(
        pageindex: number
    ) {
        const indexPaginateButton = this.getIndexPageButton(pageindex);
        if (indexPaginateButton)
            indexPaginateButton.click();
        this.setCurrentPage(pageindex);
    }

    /**
     * Navigates to the first page.
     */
    firstpage() {
        const firstPageButton = this.getFirstPageButton();
        if (firstPageButton) {
            firstPageButton.enabled();
            firstPageButton.click();
        }
        this.setCurrentPage(1);
    }

    /**
     * Navigates to the next page.
     */
    nextpage() {
        const nextPageButton = this.getNextPageButton();
        if (nextPageButton) {
            nextPageButton.enabled();
            nextPageButton.click();
        }
        this.setCurrentPage(this.currentpage++);
    }

    /**
     * Navigates to the previous page.
     */
    previewspage() {
        const previewsPageButton = this.getPreviewPageButton();
        if (previewsPageButton) {
            previewsPageButton.enabled();
            previewsPageButton.click();
        }
        this.setCurrentPage(this.currentpage--);
    }

    /**
     * Navigates to the last page.
     */
    lastpage() {
        const lastPageButton = this.getLastPageButton();
        if (lastPageButton) {
            lastPageButton.enabled();
            lastPageButton.click();
        }
        this.setCurrentPage(this.getTotalPages());
    }

    /**
     * Finds a row in the table and performs an action on it.
     * 
     * @param {number} rowIndex - The index of the row to interact with.
     * @param {(rowElement: Cypress.Chainable<JQuery<HTMLElement>>) => void} action - The action to perform on the row.
     */
    interactWithRow(
        rowIndex: number, 
        action: (rowElement: Cypress.Chainable<JQuery<HTMLElement>>) => void
    ) {
        // Retry finding the row element until it becomes available
        this.cyElement().find(`tbody > tr:eq(${rowIndex})`) // Adjust the timeout as needed
            .then($rowElement => {
                // Wrap the jQuery object with Cypress.Chainable
                const cyRowElement = this.cyElement().wrap($rowElement);

                // Pass the wrapped row element to the action function
                action(cyRowElement);
            });
    }

    // More Actions

    /**
     * Asserts that the datatable has rows and returns the number of rows.
     * 
     * @returns {number} - The number of rows in the datatable.
     */
    assertDatatableHasRows(
        timeout?: number
    ): number {
        let numberOfRows = 0;

        // Wait for the API request to complete
        (this.onLoadRequest!.url && !this.onLoadRequest!.byDefaultOnLoaded)
            ? this.waitForLoadResponse()
            : null;

        this.cyElement().wait(
            timeout
                ? timeout
                : 0
        ).find('tbody > tr').then(rows => {
            numberOfRows = Cypress.$(rows).length;
            expect(numberOfRows).to.be.greaterThan(0, 'Datatable should have rows');
        });
        return numberOfRows;
    }

    /**
     * Asserts that the datatable contains the specified text in the specified column.
     * 
     * @param {string} columnKey - The key of the column to search.
     * @param {string} searchText - The text to search for in the column.
     */
    assertTableContains(
        columnKey: string, 
        searchText: string
    ): void {
        this.getColumn(columnKey)!.contains(searchText);
    }

    // assertTableContainsss = (
    //     columnKey: string, 
    //     searchText: string
    // ) => {
    //     this.getLastPageButton().cyElement().then(($ele) => {
    //         if ($ele.find('a').attr('aria-disabled') === 'true') {
    //             // Button is disabled, do nothing
    //             return;
    //         } else {
    //             // Button is enabled, click it and recursively call maybeClick
    //             this.getNextPageButton().cyElement().click().then(() => {

    //                 // Perform the assertion
    //                 this.cyElement().contains('td', searchText).should('be.visible').then((result) => {
    //                     if (!result) {
    //                         // Assertion failed, continue to next page
    //                         this.nextpagesearch();
    //                     } else {
    //                         // Assertion succeeded, stop recursion
    //                         // return this.getColumn(columnKey).contains(searchText)
    //                         return;
    //                     }
    //                 });

    //             });
    //         }
    //     });

    //     logAssertion(`Assert Table Contains "${searchText}" at "${columnKey}"`, this.cyElement());
    //     return;
    // };

    nextpagesearch() {
        this.getLastPageButton().cyElement().then(($ele) => {
            if ($ele.find('a').attr('aria-disabled') === 'true') {
                // Button is disabled, do nothing
                return;
            } else {
                // Button is enabled, click it and recursively call maybeClick
                this.getNextPageButton().click()

                // Perform the assertion
                this.cyElement().should('contain', 'expectedContent').then((result) => {
                    if (!result) {
                        // Assertion failed, continue to next page
                        this.nextpagesearch();
                    } else {
                        // Assertion succeeded, stop recursion
                        // return this.getColumn(columnKey).contains(searchText)
                        return;
                    }
                });
            }
        });
    }

    // Responsiveness Assertions
}

export {
    GenericDatatable
};