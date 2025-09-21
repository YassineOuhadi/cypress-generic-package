import { ICyCommandDef } from "../../helpers";
import { IButtonWrapper } from "./IButtonWrapper";
import { IFieldWrapper } from "./IFieldWrapper";

export interface IFormWrapper {
  SELECTOR: ICyCommandDef;
  FIELDS: Record<string, IFieldWrapper>;
  BUTTONS: Record<string, IButtonWrapper>;
}
