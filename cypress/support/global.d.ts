/// <reference types="cypress" />
declare module "@badeball/cypress-cucumber-preprocessor/esbuild" {
  import type { Plugin } from "@bahmutov/cypress-esbuild-preprocessor/node_modules/esbuild";

  const createEsbuildPlugin: (config: any) => Plugin;
  export default createEsbuildPlugin;
}