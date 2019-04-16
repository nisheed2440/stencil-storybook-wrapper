import { configure, addDecorator } from '@storybook/html';
import withAssets from  './stencil';

/**
 * Add custom with assets decorator
 * DO NOT REMOVE - This injects the stencil assets by default to the iframe head
 */
addDecorator(withAssets({
  // Add addtional key value pair assets.
  // The key is the id of the script or style tag
}));

// automatically import all files ending in *.stories.js
const reqSrcStories = require.context('../src', true, /.stories.js$/);
const reqExternalStories = require.context('../stories', true, /.stories.js$/);
function loadStories() {
  reqSrcStories.keys().forEach(filename => reqSrcStories(filename));
  reqExternalStories.keys().forEach(filename => reqExternalStories(filename));
}

configure(loadStories, module);
