const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawn;
const chalk = require('chalk');

// Additional dependencies array to be installed as devDependencies after storybook init
// Kept separate to reduce time install during initial npx usage
const additionalDependencies = ['-D', '@types/jest', '@types/node'];
// Remove un-necessary devDependencies array
const blacklistedDependencies = [];

function spawnPromise(cmd, args, label = '') {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (err, signal) => {
      if (!err) {
        resolve(`${label ? label + ': - ' : '- '}${chalk.green('DONE!')}`);
        return;
      }
      reject(`${label ? label + ': -' : '-'}\nError Code:${err}\n${signal}`);
    });
  });
}

/**
 * Function to log messages to the command line
 * @param message The message to display on the command line
 */
function commandLog(message) {
  return () => message;
}

/**
 * Function to update the package.json object that needs to be written to disk
 * @param packageJson The package.json object to be written to disk
 * @param name The name of the dependency to be installed
 * @param packageVersion The version of the dependency to be installed
 */
function addToDevDependenciesIfNotPresent(packageJson, name, packageVersion) {
  if (!packageJson.dependencies[name] && !packageJson.devDependencies[name]) {
    packageJson.devDependencies[name] = packageVersion;
  }
}
/**
 * Function to update the scripts object in the package.json object that needs to be written to disk
 * @param {object} packageJson The package.json object to be written to disk
 * @param {string} name The key of the npm script
 * @param {string} npmScript The npm script to update
 */
function addToScripts(packageJson, name, npmScript) {
  packageJson.scripts[name] = npmScript;
}
/**
 * Function to update the package.json object that needs to be written to disk with custom data
 * @param {object} packageJson The package.json object to be written to disk
 * @param {string} name The key of the npm script
 * @param {object} data The object to update
 */
function addToPkg(packageJson, name, data) {
  packageJson[name] = data;
}

module.exports = function(plop) {
  /**
   * Check if storybook exists
   */
  plop.setActionType('CHECK_STORYBOOK', async () => {
    const exists = await fs.pathExists(path.resolve(process.cwd(), '.storybook'));
    if (exists) {
      return Promise.reject(' - Storybook already initialize, Aborting!');
    }
    return Promise.resolve(' - Check complete!');
  });
  /**
   * Add storybook with html support
   */
  plop.setActionType('ADD_STORYBOOK', async () => {
    return spawnPromise('npx', ['-p', '@storybook/cli', 'sb', 'init', '--type', 'html']);
  });
  /**
   * Install NPM packages
   */
  plop.setActionType('NPM_INSTALL', async () => {
    return spawnPromise('npm', ['install']);
  });
  /**
   * Install NPM additional packages
   */
  plop.setActionType('NPM_INSTALL_ADDITIONAL', async () => {
    return spawnPromise('npm', ['install'].concat(additionalDependencies));
  });
  /**
   * Create custom plop action to update the destination tsconfig.json file.
   */
  plop.setActionType('UPDATE_TSCONFIG', async () => {
    // Get the destination tsconfig.json file
    const destTsConfigJson = await fs.readJSON(path.resolve(process.cwd(), 'tsconfig.json'));
    // Add custom objects
    destTsConfigJson.compilerOptions['resolveJsonModule'] = true;
    destTsConfigJson.compilerOptions['esModuleInterop'] = true;
    destTsConfigJson.include.push('stencil.config.ts', 'plop');
    // Write the updated tsconfig.json file
    return fs.writeJson(path.resolve(process.cwd(), 'tsconfig.json'), destTsConfigJson).then(() => {
      return ' - Updated tsconfig.json file.';
    });
  });
  /**
   * Create custom plop action to update the destination package.json file.
   */
  plop.setActionType('UPDATE_PACKAGE', async () => {
    // Get the source package.json file
    const srcPackageJson = await fs.readJson(path.resolve(__dirname, '../package.json'));
    // Get the destination package.json file
    let destPackageJson = await fs.readJson(path.resolve(process.cwd(), 'package.json'));
    // Get the package dependencies object
    const dependencies = srcPackageJson.dependencies;
    // Get the package scripts object
    const npmScripts = srcPackageJson.stencilScripts;
    // Package dependency names as array, removing unwanted packages from going into the destination file
    const sPD = Object.keys(dependencies).filter((k) => blacklistedDependencies.indexOf(k) === -1);
    // NPM scripts to be updated in the destination package.json
    const sPS = Object.keys(npmScripts);

    for (let i = 0; i < sPD.length; i++) {
      const k = sPD[i];
      // Update the destination package.json object
      addToDevDependenciesIfNotPresent(destPackageJson, k, dependencies[k]);
    }

    for (let j = 0; j < sPS.length; j++) {
      const k = sPS[j];
      // Update the destination package.json object
      addToScripts(destPackageJson, k, npmScripts[k]);
    }

    // Add custom objects
    addToPkg(destPackageJson, 'stencil', srcPackageJson['stencil']);

    // Write the updated package.json file
    return fs.writeJson(path.resolve(process.cwd(), 'package.json'), destPackageJson).then(() => {
      return ' - Updated package.json file.';
    });
  });

  // create your generators here
  plop.setGenerator('Stencil Storybook wrapper', {
    description: 'Create a wrapper for stencil with storybook',
    prompts: [],
    // array of actions
    actions: [
      commandLog('Stencil Storybook Wrapper - Start!'),
      {
        type: 'CHECK_STORYBOOK',
      },
      {
        type: 'ADD_STORYBOOK',
      },
      {
        type: 'UPDATE_PACKAGE',
      },
      {
        type: 'UPDATE_TSCONFIG',
      },
      {
        type: 'addMany',
        destination: path.resolve(process.cwd(), '.storybook/'),
        base: path.resolve(__dirname, '.storybook'),
        templateFiles: path.resolve(__dirname, '.storybook/**/*.*'),
        verbose: false,
        force: true,
      },
      commandLog(`Updated .storybook folder`),
      {
        type: 'addMany',
        destination: path.resolve(process.cwd(), 'plop/'),
        base: path.resolve(__dirname, 'plop'),
        templateFiles: path.resolve(__dirname, 'plop/**/*.*'),
        verbose: false,
        force: true,
      },
      commandLog('Added plop folder'),
      {
        type: 'addMany',
        destination: path.resolve(process.cwd(), 'stencil-utilities/'),
        base: path.resolve(__dirname, 'stencil-utilities'),
        templateFiles: path.resolve(__dirname, 'stencil-utilities/**/*.*'),
        verbose: false,
        force: true,
      },
      commandLog('Added stencil-utilities folder'),
      {
        type: 'add',
        path: path.resolve(process.cwd(), 'stencil.config.ts'),
        templateFile: path.resolve(__dirname, 'templates/stencil.config.hbs'),
        force: true,
      },
      {
        type: 'add',
        path: path.resolve(process.cwd(), '.storybook/addons.js'),
        templateFile: path.resolve(__dirname, 'templates/addons.hbs'),
        force: true,
      },
      {
        type: 'add',
        path: path.resolve(process.cwd(), '.storybook/config.js'),
        templateFile: path.resolve(__dirname, 'templates/config.hbs'),
        force: true,
      },
      {
        type: 'add',
        path: path.resolve(process.cwd(), 'src/globals/variables.css'),
        templateFile: path.resolve(__dirname, 'templates/variables.hbs'),
        force: true,
      },
      {
        type: 'add',
        path: path.resolve(process.cwd(), 'plopfile.js'),
        templateFile: path.resolve(__dirname, 'plopfile.stencil.js'),
        force: true,
      },
      {
        type: 'add',
        path: path.resolve(process.cwd(), 'src/index.html'),
        templateFile: path.resolve(__dirname, 'templates/index.hbs'),
        force: true,
      },
      {
        type: 'NPM_INSTALL',
      },
      {
        type: 'NPM_INSTALL_ADDITIONAL',
      },
    ],
  });
};
