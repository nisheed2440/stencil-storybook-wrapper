#! /usr/bin/env node

const path = require('path');
const spawn = require('child_process').spawn;
const chalk = require('chalk');

const relativePkgPath = path.resolve(__dirname, '../');
const relativeBinPath = path.resolve(relativePkgPath, 'node_modules/.bin');
const relativeDistPath = path.resolve(relativePkgPath, 'dist');

const child = spawn(
  `${relativeBinPath}/plop`,
  ['--plopfile', `${relativeDistPath}/plopfile.wrapper.js`],
  { stdio: 'inherit' },
);

child.on('error', (error) => {
  console.log(`\n\nStencil Storybook Wrapper ERROR:\n\n${chalk.red(error.message)}\n`);
});

child.on('exit', (err, signal) => {
  if (!err) {
    console.log(`\nStencil Storybook Wrapper - ${chalk.green('DONE!')}`);
    return;
  }
  console.error(`Stencil Storybook Wrapper:\nError Code:${err}\n${signal}`);
});
