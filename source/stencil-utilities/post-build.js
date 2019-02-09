/**
 * This file is run after stencil build output.
 * Update the file as per your need.
 */
const fs = require('fs-extra');
const path = require('path');
const pkg = require('../package.json');

// The storybook output directory.
// Modify this constant as per the output dir option sent to the Storybook CLI
// https://storybook.js.org/configurations/cli-options/
const STORYBOOK_OUTPUT_DIR = 'storybook-static';

// The stencil JS `www` output directory name
const STENCIL_WWW_DIR = 'www';
/**
 * Get the contents of the file from strorbook-static
 * @param {string} name The name or path to the file under `STORYBOOK_OUTPUT_DIR`
 * DO NOT MODYFY THE FUNCTION DEFINITION
 */
async function readStorybookOutputfile(name) {
  return fs.readFile(path.resolve(process.cwd(), `${STORYBOOK_OUTPUT_DIR}/${name}`), 'utf8');
}

/**
 * set the contents of the file from strorbook-static
 * @param {string} name The name or path to the file under `STORYBOOK_OUTPUT_DIR`
 * DO NOT MODYFY THE FUNCTION DEFINITION
 */
async function writeStorybookOutputfile(name, data) {
  return fs.outputFile(path.resolve(process.cwd(), `${STORYBOOK_OUTPUT_DIR}/${name}`), data);
}

/**
 * Update storybook build assets with stencil build output
 * DO NOT MODYFY THE FUNCTION DEFINITION
 */
async function updateStorybookAssets() {
  const indexFilename = 'index.html';
  const iframeFilename = 'iframe.html';
  const indexHtml = await readStorybookOutputfile(indexFilename);
  const iframeHtml = await readStorybookOutputfile(iframeFilename);
  // Remove the stencil client code.
  let indexHtmlUpdated = indexHtml.replace(/<script src="\/stencil.client.js"><\/script>/, '');
  // Add stencil components to the iframe
  let iframeHtmlUpdated = iframeHtml.replace(
    /<\/head>/,
    `
    <link href="/build/${pkg.name}.css" rel="stylesheet">
    <script src="/build/${pkg.name}.js"></script>
    </head>
  `,
  );
  await writeStorybookOutputfile(indexFilename, indexHtmlUpdated);
  await writeStorybookOutputfile(iframeFilename, iframeHtmlUpdated);
  await fs.copy(
    path.resolve(process.cwd(), STENCIL_WWW_DIR),
    path.resolve(process.cwd(), STORYBOOK_OUTPUT_DIR),
    {
      filter: (src) => {
        return src.match(/(index.html)$/) ? false : true;
      },
    },
  );
}

/**
 * Function to be run after stencil and storybook build
 */
async function postBuild() {
  // DO NOT REMOVE
  await updateStorybookAssets();

  // Add your cusom code here.
}

postBuild();
