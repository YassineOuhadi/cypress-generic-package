/// <reference types="Cypress" />
// @ts-nocheck
import { 
    IGenericColumn, 
    SORTING_ORDER 
} from "./IGenericColumn";

import { 
    IGenericComponent 
} from "./IGenericComponent";

interface IGenericDatatable extends IGenericComponent {
    currentpage: number;
    getColumnsKeys(): string[];
    addColumn(key: any, column: IGenericColumn): void;
    addColumns(
        columnSelectors: Record<string, () => Cypress.Chainable<any>>,
        filters?: Record<string, () => Cypress.Chainable<any>>,
        sortbuttons?: Record<string, () => { button: () => Cypress.Chainable<any> }>
    ): void;
    getColumn(key: string): IGenericColumn | undefined;
    getRowsTotalLabel(): IGenericComponent | undefined;
    setRowsTotalLabel(totallabel: IGenericComponent): void;
    getRowsTotal(): number;
    getPageSizeField(): IGenericComponent | undefined;
    setPageSizeField(pagesizeselect: IGenericComponent): void;
    getPageSize(): number;
    getCurrentPage(): number;
    setCurrentPage(pageindex: number): void;
    sorting(bycolumn: string, sortingvalue: SORTING_ORDER): void;
    filtering(bycolumn: string, filteringvalue: string): Cypress.Chainable<any> | undefined;
    getFirstPageButton(): IGenericComponent | undefined;
    getNextPageButton(): IGenericComponent | undefined;
    getPreviewPageButton(): IGenericComponent | undefined;
    getLastPageButton(): IGenericComponent | undefined;
    getIndexPageButton(index: number): Cypress.Chainable<JQuery<HTMLElement>> | undefined;
    getTotalPages(): number;
    paginate(pageindex: number): void;
    firstpage(): void;
    nextpage(): void;
    previewspage(): void;
    lastpage(): void;
    interactWithRow(rowIndex: number, action: (rowElement: Cypress.Chainable<JQuery<HTMLElement>>) => void): void;
    assertDatatableHasRows(timeout?: number): number;
    assertTableContains(columnKey: string, searchText: string): void;
}

export {
    IGenericDatatable
};