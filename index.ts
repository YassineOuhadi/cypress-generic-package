// index.ts
import path from 'path';

import * as Assertions from './cypress/shared/assertions';
import * as Logs from './cypress/shared/logs';
import { SubmitResult } from './cypress/shared/models/SubmitResult';

export { 
    COMPONENT_TYPE,
    LANGUAGE 
} from './cypress/generic/pom/core/IGenericComponent';

export { FIELD_ENTRY } from './cypress/generic/pom/components/IGenericField';
export { BUTTON_ENTRY } from './cypress/generic/pom/components/IGenericButton';
export { GRAPH_ENTRY } from './cypress/generic/pom/components/IGenericGraph';
export { SORTING_ORDER } from './cypress/generic/pom/components/IGenericColumn';

export { 
    Assertions,
    Logs,
    SubmitResult
};

export { 
    GenericComponent,
    GenericPage,
    GenericDatatable,
    GenericColumn,
    GenericForm,
    GenericField,
    GenericButton,
    GenericMenu,
    GenericGraph
} from './cypress/generic/pom/impl';

export { 
    GenericCommunication,
    GenericGraphqlApi,
    GenericRestApi,
    GenericSoapApi,
    GenericWebSocketApi
} from './cypress/generic/service/impl';

export const supportFile = (typeof process !== 'undefined' && process.versions?.node)
    ? path.join(__dirname, 'cypress/support/e2e.js')
    : '';

export const stepDefinitions = (() => {
  const pkgRoot = path.resolve(__dirname);
  const distPath = path.join(pkgRoot, '**', '*.cy.js');
  return distPath;
})();