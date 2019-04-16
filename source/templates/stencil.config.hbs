/**
 * The stencil config file.
 * https://stenciljs.com/docs/config
 */
// Needed for type issue with TS for protocol option in devServer
import { Config } from '@stencil/core';
import kebabCase from 'lodash.kebabcase';

type Protocol = 'http' | 'https';
type Port = number;
type Address = string;
type Name = string;
type BuildDir = string;

interface IstencilPkg {
  host: Address;
  port: Port;
  protocol: Protocol;
  buildDir: BuildDir;
}

// Constants for the file
const DEFAULT_NAME = 'my-component';
const DEFAULT_PORT = 3333;
const DEFAULT_HOST = 'localhost';
const DEFAULT_PROTOCOL = 'http';
const DEFAULT_BUILD_DIR = 'build';

/**
 * Function to get the resouces URL for build and prod environments
 * @param rP The resource protocol
 * @param rH The resource host
 * @param rT The resource port
 * @param rF The resouce lib folder
 * @param rB The resouce buildDir path
 */
export const getResourcesURL = (
  rP: Protocol = DEFAULT_PROTOCOL,
  rH: Address = DEFAULT_HOST,
  rT: Port = DEFAULT_PORT,
  rF: Name = DEFAULT_NAME,
  rB: BuildDir = DEFAULT_BUILD_DIR,
) => (process.env.STENCIL_ENV === 'dev' ? `${rP}://${rH}:${rT}/${rB}/${rF}/` : `/${rB}/${rF}/`);

/**
 * Import the name and stencil keys from package.json
 * name: Will be used as the namespace for the stencil config.
 * stencil: Will be used to get the details of how the dev server should be deployed.
 */
import { name, stencil } from './package.json';

// Fix for scoped package names
const normalizedPkgName = kebabCase(name);

// Assign defaults when importing from package.json
const { host = 'localhost', port = 3333, protocol = 'http', buildDir = 'build' }: IstencilPkg = stencil as IstencilPkg;

/**
 * Export the stencil config to be used with the StencilJS CLI
 * The `devServer` options should ONLY be configured via the `stencil` object in package.json.
 * The `getResourcesURL` is directly dependant on the `stencil` object in package.json.
 * The othe options on the config object can be updated by you as per need.
 */
export const config: Config = {
  namespace: normalizedPkgName,
  devServer: {
    address: host as Address,
    port: port as Port,
    protocol: protocol as Protocol,
    openBrowser: false,
  },
  outputTargets: [
    { type: 'dist' },
    { type: 'docs' },
    /**
     * Output target `www` needed for publishing storybook and hosting them.
     */
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      /**
       * The `resourcesUrl` key is needed for stencil to resolve relative paths in dev server mode.
       * Since we are using the `stencil devServer` to serve the output files to `storybooks' devServer`,
       * We need resolve the relative paths on `stencil devServer`.
       */
      resourcesUrl: getResourcesURL(protocol as Protocol, host, port, normalizedPkgName, buildDir),
      buildDir
    },
  ],
  globalStyle: 'src/globals/variables.css',
};
