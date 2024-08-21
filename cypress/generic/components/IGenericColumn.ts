/// <reference types="Cypress" />
// @ts-nocheck
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
enum SORTING_ORDER {
    INCREMENT,
    DECREMENT,
    NONE
}

interface IGenericColumn extends IGenericComponent {
    sortingvalue: SORTING_ORDER;
    filteringinput?: IGenericField;
    sortingbutton?: IGenericButton;
    EditActionButton?: IGenericButton;
    options?: Map<string, IGenericButton>;
    index: number;

    getSortButton(): IGenericButton | undefined;
    setSortButton(sortbutton: IGenericButton): void;
    getSort(): SORTING_ORDER;
    setSort(columnsorting: SORTING_ORDER): void;
    getFilterInput(): IGenericField | undefined;
    setFilterInput(filterinput: IGenericField): void;
    getFilter(): Cypress.Chainable<string> | undefined;
    sorting(columnsorting: SORTING_ORDER): void;
    filtering(by: string): void;
}

export { 
    IGenericColumn, 
    SORTING_ORDER 
};