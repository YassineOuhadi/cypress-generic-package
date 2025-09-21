import { IButtonWrapper } from "./IButtonWrapper";
import { IFormWrapper } from "./IFormWrapper";
import { IMenuWrapper } from "./IMenuWrapper";

export interface IPageWrapper {
  URL: string;

  MENU?: Record<string, IMenuWrapper>;
  FORM?: Record<string, IFormWrapper>;
  BUTTONS?: Record<string, IButtonWrapper>;
}
