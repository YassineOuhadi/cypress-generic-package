/* eslint-disable @typescript-eslint/no-var-requires */
import path from "path";
import fs from "fs";
import {
  IPageWrapper,
  IRestApiWrapper,
  IWebSocketWrapper,
  IGraphQLWrapper,
  ISoapWrapper
} from "./wrappers";

type RegistryEntry = { path: string; type?: string };
type Registry = Record<string, RegistryEntry>;

export function registerTasks(on: Cypress.PluginEvents) {
  on("task", {
    /** load a page object wrapper */
    loadPageWrapper({ page, registry }: { page: string; registry: Registry }): IPageWrapper {
      return loadFromRegistry<IPageWrapper>(page, registry);
    },

    /** load a generic communication wrapper */
    loadCommunicationWrapper({ key, registry }: { key: string; registry: Registry }) {
      const entry = registry[key];
      if (!entry) throw new Error(`No registry entry found for key "${key}"`);

      const wrapper = loadFile(entry.path);
      return { type: entry.type, wrapper };
    },

    /** load service wrappers (REST, GraphQL, SOAP, WebSocket) */
    loadApiWrapper({ api, registry }: { api: string; registry: Registry }): IRestApiWrapper {
      return loadFromRegistry<IRestApiWrapper>(api, registry);
    },

    loadGraphQLWrapper({ api, registry }: { api: string; registry: Registry }): IGraphQLWrapper {
      return loadFromRegistry<IGraphQLWrapper>(api, registry);
    },

    loadSoapWrapper({ api, registry }: { api: string; registry: Registry }): ISoapWrapper {
      return loadFromRegistry<ISoapWrapper>(api, registry);
    },
    
    loadWebSocketWrapper({ socket, registry }: { socket: string; registry: Registry }): IWebSocketWrapper {
      return loadFromRegistry<IWebSocketWrapper>(socket, registry);
    },

    /** load project-specific config JSON */
    loadProjectConfig(projectName: string) {
      const filePath = path.resolve(process.cwd(), `cypress/env/${projectName}.json`);
      return loadConfigFile(filePath);
    },

    /** load default config JSON */
    loadDefaultConfig() {
      const envFile = process.env.CYPRESS_ENV_FILE || "cypress/env/examples.json";
      const filePath = path.resolve(process.cwd(), envFile);
      return loadConfigFile(filePath);
    }
  });
}

/** helper to load modules from a registry */
function loadFromRegistry<T>(key: string, registry: Registry): T {
  const entry = registry[key];
  if (!entry) throw new Error(`No registry entry found for key "${key}"`);
  return loadFile<T>(entry.path);
}

/** helper to load JSON or TS/JS module */
function loadFile<T>(relativePath: string): T {
  const filePath = path.resolve(process.cwd(), relativePath);

  if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

  if (filePath.endsWith(".json")) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } else {
    // TS/JS module
    const module = require(filePath);
    if (!module.default) throw new Error(`No default export found in ${filePath}`);
    return module.default as T;
  }
}

/** helper to normalize paths in config objects */
function loadConfigFile(filePath: string) {
  if (!fs.existsSync(filePath)) throw new Error(`Config file not found: ${filePath}`);

  const config = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  Object.values(config)
    .flatMap((obj: any) => Object.values(obj))
    .forEach((item: any) => {
      if (item?.path) {
        item.path = path.join(process.cwd(), "cypress/e2e", item.path);
      }
    });

  return config;
}