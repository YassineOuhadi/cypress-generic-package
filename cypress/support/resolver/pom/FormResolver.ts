import { GenericForm } from "../../../generic/pom/impl/GenericForm";
import { GenericPage } from "../../../generic/pom/impl/GenericPage";
import { execCyCommand } from "../../helpers";
import { IPageWrapper } from "../../wrappers/pom/IPageWrapper";

export class FormResolver {
  static resolveForms(PomModel: IPageWrapper, pageInstance: GenericPage) {
    if (!PomModel.FORM) return {};

    const forms: Record<string, GenericForm> = {};

    for (const [formName, formDef] of Object.entries(PomModel.FORM)) {
      const selectorFn = () => execCyCommand(formDef.SELECTOR);
      const formInstance = new GenericForm(formName, selectorFn);

      // fields
      if (formDef.FIELDS) {
        const fieldSelectors: Record<string, () => {
          field: () => Cypress.Chainable<any>;
          entry: string[];
          isOptional?: boolean;
        }> = {};

        Object.entries(formDef.FIELDS).forEach(([fieldName, fieldDef]) => {
          fieldSelectors[fieldName] = () => ({
            field: () => execCyCommand(fieldDef.SELECTOR),
            entry: fieldDef.entry ?? ["INPUT"],
            isOptional: fieldDef.isOptional ?? false
          });
        });

        formInstance.setFields(fieldSelectors);
      }

      // buttons
      if (formDef.BUTTONS) {
        const buttonSelectors: Record<string, () => { button: () => Cypress.Chainable<any>; type?: string }> = {};

        Object.entries(formDef.BUTTONS).forEach(([buttonName, buttonDef]) => {
          buttonSelectors[buttonName] = () => ({
            button: () => execCyCommand(buttonDef.SELECTOR),
            type: buttonDef.type ?? "BUTTON"
          });
        });

        formInstance.setButtons(buttonSelectors);
      }

      formInstance.init();
      pageInstance.setElement(formName, formInstance);
      forms[formName] = formInstance;
    }

    return forms;
  }
}
