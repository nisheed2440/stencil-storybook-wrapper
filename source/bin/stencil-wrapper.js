#! /usr/bin/env node

const path = require('path');
const shelljs = require('shelljs');
const relativePkgPath = path.resolve(__dirname, '../');
const relativeBinPath = path.resolve(relativePkgPath, 'node_modules/.bin');
const relativeDistPath = path.resolve(relativePkgPath, 'dist');

shelljs.exec(`${relativeBinPath}/plop --plopfile ${relativeDistPath}/plopfile.wrapper.js`);