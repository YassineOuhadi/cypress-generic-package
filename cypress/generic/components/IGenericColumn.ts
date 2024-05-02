/// <reference types="Cypress" />

import { 
    IGenericButton 
} from "./IGenericButton";

import { 
    IGenericComponent 
} from "./IGenericComponent";

import { 
    IGenericField 
} from "./IGenericField";

/**
 * Enum representing sorting options.
 */
enum SORTING {
    INCREMENT,
    DECREMENT,
    NONE
}

interface IGenericColumn extends IGenericComponent {
    sortingvalue: SORTING;
    filteringinput?: IGenericField;
    sortingbutton?: IGenericButton;
    EditActionButton?: IGenericButton;
    options?: Map<string, IGenericButton>;
    index: number;

    getSortButton(): IGenericButton | undefined;
    setSortButton(sortbutton: IGenericButton): void;
    getSort(): SORTING;
    setSort(columnsorting: SORTING): void;
    getFilterInput(): IGenericField | undefined;
    setFilterInput(filterinput: IGenericField): void;
    getFilter(): Cypress.Chainable<string> | undefined;
    sorting(columnsorting: SORTING): void;
    filtering(by: string): void;
}

export { 
    IGenericColumn, 
    SORTING 
};