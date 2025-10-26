#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");
const inquirer = require("inquirer");
const chalk = require("chalk");

const [, , command, arg] = process.argv;

// -----------------------------
// Terminal Logo
// -----------------------------
function printLogo() {
  console.log(chalk.cyan(`
   ____         __                 ___                           __
  / __/__ ___ _/ /___ _________   / _ | ___ ___ __ _________ ___/ /
 / _// -_) _ \`/ __/ // / __/ -_) / __ |(_-<(_-</ // / __/ -_) _  / 
/_/  \\__/\\_,_/\\__/\\_,_/_/  \\__/ /_/ |_/___/___/\\_,_/_/  \\__/\\_,_/  
`));
  console.log(chalk.yellow("Feature Assured CLI\n"));
}

// -----------------------------
// Help Section
// -----------------------------
function printHelp() {
  printLogo();
  console.log(`
Usage:
  npx feature-assured init
      Initialize base Cypress project.

  npx feature-assured add-examples
      Add test examples interactively (UI, Service/API, or both).

  npx feature-assured add-ui-examples
      Add only UI test examples (POM_REGISTRY).

  npx feature-assured add-service-examples
      Add only Service/API test examples (SERVICE_REGISTRY).

  npx feature-assured list-steps
      List all implemented Cypress step definitions from cypress-generic-package.

Examples:
  npx feature-assured init
  npx feature-assured add-ui-examples
  npx feature-assured add-service-examples
  npx feature-assured list-steps
`);
}

// -----------------------------
// List Steps Command
// -----------------------------
async function listSteps({ json = false } = {}) {
  try {
    const pkgPath = path.dirname(require.resolve('@yassinouhadi/cypress-generic-package'));
    const stepsPath = path.join(pkgPath, 'cypress', 'support', 'step_definitions');

    if (!fs.existsSync(stepsPath)) {
      console.error('No step definitions found in cypress-generic-package');
      process.exit(1);
    }

    const files = (await fs.readdir(stepsPath)).filter(f => f.endsWith('.cy.js'));
    const stepsLibrary = {};

    for (const file of files) {
      const filePath = path.join(stepsPath, file);
      const content = await fs.readFile(filePath, 'utf8');
      const lines = content.split('\n');
      const category = file.replace('.cy.js', '').replace(/_/g, '.');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const regex = /\(\s*0\s*,\s*[\w\d_$.]+\.(Given|When|Then)\)\s*\(\s*(\/\^(.+?)\$\/|["'`](.+?)["'`])/;
        const match = line.match(regex);

        if (match) {
          if (!stepsLibrary[category]) stepsLibrary[category] = [];
          stepsLibrary[category].push({
            type: match[1],
            step: match[2].replace(/^\/\^?/, '').replace(/\$?\/$/, ''),
            definition: `${filePath}:${i + 1}:1`
          });
        }
      }
    }

    if (json) {
      console.log(JSON.stringify(stepsLibrary, null, 2));
    } else {
      console.log(chalk.yellow("Steps Library\n"));
      console.log(JSON.stringify(stepsLibrary, null, 2));
    }

    return stepsLibrary;
  } catch (err) {
    console.error('❌ Failed to list step definitions:', err);
    process.exit(1);
  }
}

// -----------------------------
// Main CLI Runner
// -----------------------------
async function run() {
  const args = process.argv.slice(2);
  const isJson = args.includes("--json") || args.includes("--output=json");

  switch (command) {
    case "init":
      if (!isJson) printLogo();
      await initProject();
      break;

    case "add-examples":
      await interactiveAddExamples();
      break;

    case "add-ui-examples":
      await copyExample("ui");
      if (!isJson) console.log(chalk.blue("✅ UI examples added successfully.\n"));
      break;

    case "add-service-examples":
      await copyExample("service");
      if (!isJson) console.log(chalk.blue("✅ Service/API examples added successfully.\n"));
      break;

    case "list-steps":
      if (!isJson) printLogo();
      await listSteps({ json: isJson });
      break;

    default:
      if (!isJson) printHelp();
  }
}

// -----------------------------
// Initialize Cypress Project
// -----------------------------
// -----------------------------
async function initProject() {
  const targetDir = process.cwd();
  console.log(chalk.blue("🚀 Initializing Cypress project...\n"));

  const args = process.argv.slice(3);
  const isYes = args.includes("--yes");
  const nameArgIndex = args.findIndex(a => a === "--name");
  const providedName = nameArgIndex !== -1 ? args[nameArgIndex + 1] : null;

  const nodePathIndex = args.findIndex(a => a === "--node-path");
  const containerNodePath = nodePathIndex !== -1 ? args[nodePathIndex + 1] : null;

  const projectName =
    providedName ||
    process.env.PROJECT_NAME ||
    (isYes ? "feature-assured" : (
      await inquirer.prompt([
        {
          type: "input",
          name: "projectName",
          message: "Enter project name (used for env config):",
          validate: (v) => v.trim() !== "" || "Project name cannot be empty",
        },
      ])
    )).projectName;

  const envFolder = path.join(targetDir, "cypress", "env");
  await fs.ensureDir(envFolder);

  const projectEnvFile = path.join(envFolder, `${projectName}.json`);
  if (!fs.existsSync(projectEnvFile)) {
    await fs.writeJson(projectEnvFile, { POM_REGISTRY: {}, SERVICE_REGISTRY: {} }, { spaces: 2 });
    console.log(chalk.green(`Created empty env template: cypress/env/${projectName}.json`));
  }

  const configFile = path.join(targetDir, "cypress.config.js");
  let overrides = {};

  if (!fs.existsSync(configFile) && !isYes && !process.env.CI) {
    const answers = await inquirer.prompt([
      { type: "confirm", name: "override", message: "Do you want to override default Cypress config?", default: false },
      { type: "input", name: "baseUrl", message: "Enter baseUrl (leave empty for default):", when: (a) => a.override },
      { type: "input", name: "fixturesFolder", message: "Enter fixturesFolder (leave empty for default):", when: (a) => a.override },
      { type: "input", name: "specPattern", message: "Enter specPattern (leave empty for default):", when: (a) => a.override },
      { type: "input", name: "supportFile", message: "Enter supportFile path (leave empty for default):", when: (a) => a.override },
    ]);

    overrides = answers.override
      ? {
        baseUrl: answers.baseUrl || undefined,
        fixturesFolder: answers.fixturesFolder || undefined,
        specPattern: answers.specPattern || undefined,
        supportFile: answers.supportFile || undefined,
      }
      : {};
  }

  const pkgModulePath = containerNodePath
    ? path.join(containerNodePath, "@yassinouhadi/cypress-generic-package")
    : require.resolve("@yassinouhadi/cypress-generic-package");
  
  const { stepDefinitions: defaultStepDefinitions, supportFile: defaultSupportFile } = require(pkgModulePath);

  const supportFilePath = containerNodePath
    ? path.join(containerNodePath, "@yassinouhadi/cypress-generic-package/cypress/support/e2e.ts")
    : defaultSupportFile;

  const stepDefinitionsPath = containerNodePath
    ? path.join(containerNodePath, "@yassinouhadi/cypress-generic-package/dist/**/*.cy.js")
    : defaultStepDefinitions;

  const configContent = `// Generated by Feature Assured
const { defineConfig } = require('cypress');
let preset = require('@yassinouhadi/cypress-generic-package/cypress-preset');
preset = preset && preset.__esModule && preset.default ? preset.default : preset;

module.exports = defineConfig({
  ...preset,
  env: {
    CYPRESS_ENV_FILE: process.env.CYPRESS_ENV_FILE || "cypress/env/${projectName}.json"
  },
  e2e: {
    ...preset.e2e,
    specPattern: "${overrides.specPattern || "cypress/integration/**/*.feature"}",
    supportFile: "${overrides.supportFile || supportFilePath}",
    fixturesFolder: "${overrides.fixturesFolder || "cypress/fixtures"}",
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 60000,
    requestTimeout: 5000,
    responseTimeout: 30000,
    retries: { runMode: 2, openMode: 0 },
    ${overrides.baseUrl ? `baseUrl: "${overrides.baseUrl}",` : ""}
  },
  component: {
    ...preset.component,
    specPattern: "cypress/component/**/*.cy.{js,ts}",
    devServer: { framework: "angular", bundler: "webpack" },
  },
});
`;

  await fs.writeFile(configFile, configContent, "utf8");
  console.log(chalk.green("Created cypress.config.js"));

  const packageJsonPath = path.join(targetDir, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const pkg = await fs.readJson(packageJsonPath);
    pkg.scripts = pkg.scripts || {};
    const envFile = `cypress/env/${projectName}.json`;
    pkg.scripts["cy:open"] = `CYPRESS_ENV_FILE='${envFile}' cypress open`;
    pkg.scripts["cy:run"] = `CYPRESS_ENV_FILE='${envFile}' && xvfb-run -a cypress run`;
    pkg.scripts["report:html"] = `npx multiple-cucumber-html-reporter --jsonDir=cypress/reports/json --reportPath=cypress/reports/html`;
    pkg.scripts["test:full"] = `rm -rf cypress/reports && npm run cy:run --`;
    pkg["cypress-cucumber-preprocessor"] = {
      stepDefinitions: stepDefinitionsPath,
      html: { enabled: true, output: "cypress/reports/html/cucumber-report.html" },
      json: { enabled: true, output: "cypress/reports/json/cucumber-report.json" },
      messages: { enabled: true, output: "cypress/reports/json/cucumber-report.ndjson" }
    };
    await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
    console.log(chalk.green(`Added npm scripts with CYPRESS_ENV_FILE='${envFile}'`));
  }

  console.log(chalk.blue("\n✅ Project initialized. Run tests with: npm run cy:open\n"));
}

// -----------------------------
// Interactive Add Examples
// -----------------------------
async function interactiveAddExamples() {
  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Which examples do you want to add?",
      choices: [
        { name: "UI Tests (POM_REGISTRY)", value: "ui" },
        { name: "Service/API Tests (SERVICE_REGISTRY)", value: "service" },
        { name: "Both UI & Service/API Tests", value: "both" },
      ],
    },
  ]);

  if (choice === "both") {
    await copyExample("service");
    await copyExample("ui");
  } else {
    await copyExample(choice);
  }

  console.log(chalk.blue("✅ Examples added successfully.\n"));
}

// -----------------------------
// Copy Examples
// -----------------------------
async function copyExample(type) {
  const targetModelsDir = path.join(process.cwd(), "cypress", "e2e", "examples", "pom");
  const sourceModelsDir = path.resolve(__dirname, "..", "examples", "pom", type);
  await fs.ensureDir(targetModelsDir);
  if (fs.existsSync(sourceModelsDir)) {
    await fs.copy(sourceModelsDir, path.join(targetModelsDir, type));
    console.log(`Example models '${type}' copied`);
  }

  const sourceFeaturesDir = path.resolve(__dirname, "..", "examples", "integration", "features", type);
  const targetFeaturesDir = path.join(process.cwd(), "cypress", "integration", "features", type);
  if (fs.existsSync(sourceFeaturesDir)) {
    await fs.ensureDir(targetFeaturesDir);
    await fs.copy(sourceFeaturesDir, targetFeaturesDir);
    console.log(`Feature files '${type}' copied`);
  }

  const sourceFixturesDir = path.resolve(__dirname, "..", "examples", "fixtures");
  const targetFixturesDir = path.join(process.cwd(), "cypress", "fixtures");
  if (fs.existsSync(sourceFixturesDir)) {
    await fs.ensureDir(targetFixturesDir);
    await fs.copy(sourceFixturesDir, targetFixturesDir);
    console.log("Fixtures copied");
  }

  const envFolder = path.join(process.cwd(), "cypress", "env");
  await fs.ensureDir(envFolder);
  const exampleEnvFile = path.join(envFolder, "examples.json");
  const defaultEnvFile = path.resolve(__dirname, "..", "dist", "cypress.env.json");

  if (!fs.existsSync(defaultEnvFile)) {
    console.warn("⚠️ Default env file not found, skipping registry merge");
    return;
  }

  const defaultEnv = await fs.readJson(defaultEnvFile);
  let currentEnv = fs.existsSync(exampleEnvFile) ? await fs.readJson(exampleEnvFile) : {};

  if (type === "ui") {
    currentEnv.POM_REGISTRY = { ...(currentEnv.POM_REGISTRY || {}), ...(defaultEnv.POM_REGISTRY || {}) };
    console.log("Added/Updated UI examples (POM_REGISTRY)");
  } else if (type === "service") {
    currentEnv.SERVICE_REGISTRY = { ...(currentEnv.SERVICE_REGISTRY || {}), ...(defaultEnv.SERVICE_REGISTRY || {}) };
    console.log("Added/Updated Service examples (SERVICE_REGISTRY)");
  }

  await fs.writeJson(exampleEnvFile, currentEnv, { spaces: 2 });
  console.log("Updated cypress/env/examples.json");

  // update package.json scripts
  const packageJsonPath = path.join(process.cwd(), "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const pkg = await fs.readJson(packageJsonPath);
    pkg.scripts["cy:open"] = `CYPRESS_ENV_FILE='cypress/env/examples.json' cypress open`;
    pkg.scripts["cy:run"] = `CYPRESS_ENV_FILE='cypress/env/examples.json' && xvfb-run -a cypress run`;
    await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
    console.log("Updated npm scripts to use CYPRESS_ENV_FILE='examples.json'");
  }
}

run();