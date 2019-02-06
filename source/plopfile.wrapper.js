const fs = require('fs');
const path = require('path');
const shellExec = require('shell-exec');

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
/**
 * Function to get the package.json file of the destination.
 */
async function getSrcPackageJsonFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, '../package.json'), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
}
/**
 * Function to get the package.json file of the destination.
 */
async function getDestPackageJsonFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(process.cwd(), 'package.json'), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
}

/**
 * Function to get the tsconfig.json file of the destination.
 */
async function getDestTsConfigJsonFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(process.cwd(), 'tsconfig.json'), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
}

module.exports = function(plop) {
  /**
   * Check if storybook exists
   */
  plop.setActionType('CHECK_STORYBOOK', async () => {
    return new Promise((resolve, reject) => {
      fs.exists(path.resolve(process.cwd(), '.storybook'), (exists) => {
        if (exists) {
          reject(' - Storybook already initialize, Aborting!');
        } else {
          resolve(' - Check complete!');
        }
      });
    });
  });
  /**
   * Add storybook with html support
   */
  plop.setActionType('ADD_STORYBOOK', async () => {
    return new Promise((resolve, reject) => {
      shellExec('npx -p @storybook/cli sb init --type html')
        .then(() => resolve(' - Added storybook!'))
        .catch(() => reject(' - Error installing storybook!'));
    });
  });
  /**
   * Install NPM packages
   */
  plop.setActionType('NPM_INSTALL', async () => {
    return new Promise((resolve, reject) => {
      shellExec('npm install')
        .then(() => resolve(' - Added modules!'))
        .catch(() => reject(' - Error installing modules!'));
    });
  });
  /**
   * Create custom plop action to update the destination tsconfig.json file.
   */
  plop.setActionType('UPDATE_TSCONFIG', async () => {
    // Get the destination tsconfig.json file
    var destTsConfigJson = await getDestTsConfigJsonFile();
    // Add custom objects
    destTsConfigJson.compilerOptions['resolveJsonModule'] = true;
    destTsConfigJson.compilerOptions['esModuleInterop'] = true;
    destTsConfigJson.include.push('stencil.config.ts', 'plop');

    return new Promise((resolve, reject) => {
      // Write updated tsconfig.json file to disk
      fs.writeFile(
        path.resolve(process.cwd(), 'tsconfig.json'),
        JSON.stringify(destTsConfigJson, null, 2),
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(' - Updated tsconfig.json file.');
        },
      );
    });
  });
  /**
   * Create custom plop action to update the destination package.json file.
   */
  plop.setActionType('UPDATE_PACKAGE', async () => {
    // Get the source package.json file
    var srcPackageJson = await getSrcPackageJsonFile();
    // Get the destination package.json file
    var destPackageJson = await getDestPackageJsonFile();
    // Get the package dependencies object
    var dependencies = srcPackageJson.dependencies;
    // Get the package scripts object
    var npmScripts = srcPackageJson.stencilScripts;
    // Package dependency names as array, removing unwanted packages from going into the destination file
    var sPD = Object.keys(dependencies).filter(
      (k) => ['shelljs', 'chalk', 'shell-exec'].indexOf(k) === -1,
    );
    // NPM scripts to be updated in the destination package.json
    var sPS = Object.keys(npmScripts);

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
    addToPkg(destPackageJson, 'storybook', srcPackageJson['storybook']);

    return new Promise((resolve, reject) => {
      // Write updated package.json file to disk
      fs.writeFile(
        path.resolve(process.cwd(), 'package.json'),
        JSON.stringify(destPackageJson, null, 2),
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(' - Updated package.json file.');
        },
      );
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
        path: path.resolve(process.cwd(), 'src/globals/variable.css'),
        templateFile: path.resolve(__dirname, 'templates/variables.hbs'),
        force: true,
      },
      {
        type: 'add',
        path: path.resolve(process.cwd(), 'plopfile.js'),
        templateFile: path.resolve(__dirname, 'plopfile.stencil.js'),
        force: true,
      },
      commandLog('Stencil Storybook Wrapper - End!'),
      {
        type: 'NPM_INSTALL',
      },
    ],
  });
};
