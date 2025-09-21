import { GenericMenu } from "../../../generic/pom/impl/GenericMenu";
import { GenericPage } from "../../../generic/pom/impl/GenericPage";
import { execCyCommand } from "../../helpers";
import { IPageWrapper } from "../../wrappers/pom/IPageWrapper";

export class MenuResolver {
  
  static resolveMenus(PomModel: IPageWrapper, pageInstance: GenericPage) {
    if (!PomModel.MENU) return {};

    const menus: Record<string, GenericMenu> = {};

    for (const [menuName, menuDef] of Object.entries(PomModel.MENU)) {
      const selectorFn = () => execCyCommand(menuDef.SELECTOR);
      const menuInstance = new GenericMenu(menuName, selectorFn);

      const items: Record<string, () => Cypress.Chainable> = {};
      for (const [itemName, itemDef] of Object.entries(menuDef.ITEMS)) {
        items[itemName] = () => execCyCommand(itemDef);
      }

      menuInstance.setItems(items);
      menuInstance.init();

      pageInstance.setElement(menuName, menuInstance);
      menus[menuName] = menuInstance;
    }

    return menus;
  }
}