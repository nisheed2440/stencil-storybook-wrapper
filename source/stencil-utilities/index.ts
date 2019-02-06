/**
 * Import the name and stencil keys from package.json
 * name: Will be used as the namespace for the stencil config.
 * stencil: Will be used to get the details of how the dev server should be deployed.
 */

// Needed for type issue with TS for protocol option in devServer
type Protocol = 'http' | 'https';
type Port = number;
type Address = string;
type Name = string;
type BuildDir = string;

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
