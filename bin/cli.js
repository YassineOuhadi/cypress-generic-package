#! /usr/bin/env node
const yargs = require('yargs');

const argv = yargs.option('name', {
  alias: 'n',
  description: 'Name of the component',
  type: 'string',
  demandOption: true
})
  .option('location', {
    alias: 'l',
    description: 'Location to store the component file',
    type: 'string',
    demandOption: true
  })
  .help()
  .alias('help', 'h')
  .argv;

generateComponent(argv.name, argv.location);

function generateComponent(name, location) {
  const componentFileContent =
    `
    export class Component {
      constructor() {
        console.log('Hello World');
      }
    }
  `;

  const fs = require('fs');
  fs.writeFileSync(`/ComponentFile.ts`, componentFileContent);
  console.log(`Component file generated successfully at /ComponentFile.ts`);
}