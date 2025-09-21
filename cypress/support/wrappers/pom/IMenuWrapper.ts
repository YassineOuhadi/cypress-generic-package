import { ICyCommandDef } from "../../helpers";

export interface IMenuWrapper {
  SELECTOR: ICyCommandDef;
  ITEMS: Record<string, ICyCommandDef>;
}