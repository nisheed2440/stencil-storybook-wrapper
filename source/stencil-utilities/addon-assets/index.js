import { document } from 'global';
import { makeDecorator } from '@storybook/addons';
/**
 * Function to check if variable is an Object
 * @param {*} val The variable to check
 */
function isObject(val) {
  if (val === null) {
    return false;
  }
  return typeof val === 'object';
}
/**
 * Function to add script and style assets to head
 * @param {string} id The id of the asset
 * @param {string} src The source of the asset
 */
const getOrCreateElement = (id, src) => {
  const elementOnDom = document.getElementById(id);

  if (elementOnDom) {
    return elementOnDom;
  }
  let element = null;
  //   Check is string is JS
  if (src.match(/(.js)$/gi)) {
    element = document.createElement('script');

    if (src.match(/(.esm.js)$/gi)) {
      element.setAttribute('type', 'module')
    } else {
      element.setAttribute('nomodule', '')
    }

    element.src = src;
  }
  //   Check is string is CSS
  if (src.match(/(.css)$/gi)) {
    element = document.createElement('link');
    element.rel = 'stylesheet';
    element.href = src;
  }

  if (element) {
    element.setAttribute('id', id);
    document.head.appendChild(element);
  } else {
    console.warn(`Could not add asset '${id}': '${src}'`);
  }

  return document.getElementById(id);
};
/**
 * With Assets decorator
 */
export default makeDecorator({
  name: 'withAssets',
  parameterName: 'assets',
  // This means don't run this decorator if the notes decorator is not set
  skipIfNoParametersOrOptions: true,
  wrapper: (getStory, context, { options, parameters }) => {
    if (options && isObject(options.assets)) {
      Object.keys(options.assets).forEach((k) => {
        getOrCreateElement(k, options.assets[k]);
      });
    }

    if (parameters && isObject(parameters.assets)) {
      Object.keys(parameters.assets).forEach((k) => {
        getOrCreateElement(k, parameters.assets[k]);
      });
    }

    return getStory(context);
  },
});
