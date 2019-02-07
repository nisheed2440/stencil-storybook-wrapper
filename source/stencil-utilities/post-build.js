/**
 * This file is run after stencil build output.
 * Update the file as per your need.
 */
const fs = require("fs");
const path = require("path");
const pkg = require("../package.json");

/**
 * Get the contents of the file from strorbook-static
 * @param {string} name The name or path to the file under storybook-static
 */
async function readStorybookOutputfile(name) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.resolve(process.cwd(), `storybook-static/${name}`),
      "utf8",
      (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      }
    );
  });
}

/**
 * set the contents of the file from strorbook-static
 * @param {string} name The name or path to the file under storybook-static
 */
async function writeStorybookOutputfile(name, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path.resolve(process.cwd(), `storybook-static/${name}`),
      data,
      "utf8",
      err => {
        if (err) {
          reject(err);
          return;
        }
        resolve("Done!");
      }
    );
  });
}

/**
 * Function to run after storybook build is completed
 */
async function postBuild() {
  const indexFilename = "index.html";
  const iframeFilename = "iframe.html";
  const indexHtml = await readStorybookOutputfile(indexFilename);
  const iframeHtml = await readStorybookOutputfile(iframeFilename);
  // Remove the stencil client code.
  let indexHtmlUpdated = indexHtml.replace(
    /<script src="\/stencil.client.js"><\/script>/,
    ""
  );
  // Add stencil components to the iframe
  let iframeHtmlUpdated = iframeHtml.replace(
    /<\/head>/,
    `
    <link href="/build/${pkg.name}.css" rel="stylesheet">
    <script src="/build/${pkg.name}.js"></script>
    </head>
  `
  );
  await writeStorybookOutputfile(indexFilename, indexHtmlUpdated);
  await writeStorybookOutputfile(iframeFilename, iframeHtmlUpdated);
}

postBuild();
