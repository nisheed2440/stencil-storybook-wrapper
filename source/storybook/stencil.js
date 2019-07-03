/**
 * CAUTION: DO NOT MODIFY THIS FILE
 * .storybook/stencil.js
 */
/**
 * Import the custom addon for adding assets to the manager head.
 */
import withAssets from '../stencil-utilities/addon-assets';
import kebabCase from 'lodash.kebabcase';

// Constants for the file
const DEFAULT_NAME = 'my-component';
const DEFAULT_PORT = 3333;
const DEFAULT_HOST = 'localhost';
const DEFAULT_PROTOCOL = 'http';
const DEFAULT_BUILD_DIR = 'build';

// eslint-disable-next-line import/no-unresolved
const { name = DEFAULT_NAME, stencil } = require('../package.json');

const {
  host = DEFAULT_HOST,
  port = DEFAULT_PORT,
  protocol = DEFAULT_PROTOCOL,
  buildDir = DEFAULT_BUILD_DIR,
} = stencil;

// Fix for scoped package names
const normalizedPkgName = kebabCase(name);

/**
 * Function to get the stencil resources
 */
const getStencilResources = () => ({
  'components-css':
    process.env.NODE_ENV === 'development'
      ? `${protocol}://${host}:${port}/${buildDir}/${normalizedPkgName}.css`
      : `/${buildDir}/${normalizedPkgName}.css`,
  'component-js':
    process.env.NODE_ENV === 'development'
      ? `${protocol}://${host}:${port}/${buildDir}/${normalizedPkgName}.js`
      : `/${buildDir}/${normalizedPkgName}.js`,
  'component-js-module':
    process.env.NODE_ENV === 'development'
      ? `${protocol}://${host}:${port}/${buildDir}/${normalizedPkgName}.esm.js`
      : `/${buildDir}/${normalizedPkgName}.esm.js`,
});
/**
 * With assets custom decorator
 */
export default (config) => {
  return withAssets({
    assets: {
      ...getStencilResources(),
      ...config,
    },
  });
};
