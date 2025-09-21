import { ICyCommandDef } from "../../helpers";

export interface IFieldWrapper {
  SELECTOR: ICyCommandDef;
  entry: string[];
  isOptional?: boolean;
}