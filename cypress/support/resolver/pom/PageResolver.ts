import { MenuResolver } from "./MenuResolver";
import { FormResolver } from "./FormResolver";
import { GenericPage } from "../../../generic/pom/impl/GenericPage";
import { GenericMenu } from "../../../generic/pom/impl/GenericMenu";
import { GenericForm } from "../../../generic/pom/impl/GenericForm";
import { IPageWrapper } from "../../wrappers/pom/IPageWrapper";

export class PageResolver {
  // static PageObjectModelRegistry: Record<string, string> = Cypress.env("POM_REGISTRY") || {};

  private pageInstance?: GenericPage;
  menus: Record<string, GenericMenu> = {};
  forms: Record<string, GenericForm> = {};

  constructor(private page: string, private registry: Record<string, any>) { }

  init(): Cypress.Chainable<IPageWrapper> {

    return cy.task("loadPageWrapper", {
      page: this.page,
      registry: this.registry,
    }).then((res) => {
      const PomModel = res as IPageWrapper;

      this.pageInstance = new GenericPage(this.page, PomModel);
      this.pageInstance.setBaseUrl(PomModel.URL);

      this.menus = MenuResolver.resolveMenus(PomModel, this.pageInstance);
      this.forms = FormResolver.resolveForms(PomModel, this.pageInstance);

      this.pageInstance.init();
      return cy.wrap(PomModel);
    });
  }

  getPage(): GenericPage {
    if (!this.pageInstance) throw new Error(`Page ${this.page} not initialized. Call init() first.`);
    return this.pageInstance;
  }
}