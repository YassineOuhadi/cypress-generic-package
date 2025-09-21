import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import path from "path";
import fs from "fs";
import { registerTasks } from "./cypress/support/tasks";

export default defineConfig({
  e2e: {
    specPattern: "cypress/integration/**/*.feature",
    supportFile: path.resolve(__dirname, "cypress/support/e2e.js"),

    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      registerTasks(on);
      return config;
    }
  }
});
