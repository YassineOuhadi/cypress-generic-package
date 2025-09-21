/// <reference types="cypress" />
import { IGenericCommunication, IGenericRequestOptions, IGenericResponse } from "../core/IGenericCommunication";

export interface ISoapApi extends IGenericCommunication {
  buildEnvelope(operation: string, args: Record<string, any>): string;
}