import { IRestApiWrapper } from "./IRestApiWrapper";
import { ISoapWrapper } from "./ISoapWrapper";
import { IGraphQLWrapper } from "./IGraphQLWrapper";
import { IWebSocketWrapper } from "./IWebSocketWrapper";

export interface ICommWrapper {
  type: "rest" | "soap" | "graphql" | "websocket";
  wrapper: IRestApiWrapper | ISoapWrapper | IGraphQLWrapper | IWebSocketWrapper | any;
}