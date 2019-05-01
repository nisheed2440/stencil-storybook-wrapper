# Stencil Storybook Wrapper
This module provides a wrapper to interoperate stencil created app with storybook. 

It works by hooking into the stencil dev server during development, listening to the websocket during HMR(Hot Module Replacement) and showing the errors or reloading the stencil generated resources.

During production builds for storybook, the output of the stencil build is moved to the `storybook-static` folder and resources requests updated so that the storybook can be deployed.

---
#### **NOTE: TO BE USED WITH VANNILA STENCIL COMPONENT PROJECT**

Using this with a stencil project already modifed by you could lead to un-necessary side effects. 

----

## Prerequisites
Create a stencil project of the type __*component*__ using the [getting started docs](https://stenciljs.com/docs/getting-started#starting-a-new-project**.

**Note: If using Sass you will also need [stencil sass](https://www.npmjs.com/package/@stencil/sass) installed.**

## Installation

Install it globally
```
$ npm i -g stencil-storybook-wrapper
$ cd my-awesome-stencil-app
$ stencil-storybook-wrapper
```
OR

Use it via NPX
```
$ cd my-awesome-stencil-app
npx stencil-storybook-wrapper
```

## Usage

### Start Storybook
```
$ npm run start
```
### Build Stencil & Storybook
- Stencil built to `dist` folder
- Storybook built to `storybook-static` folder
```
$ npm run build
```
### Create component
The wrapper adds a tiny [plopjs](https://plopjs.com/) component generator which can be used to create new stencil components. Components created by the generator have all the necessary scaffolding and story file to get to started.
```
$ npm run generate
```
and follow the instructions. Modify the `plopfile.js` and the add/update `plop/templates` to create `atoms`, `molecules` or `organism` type components.

### Build Stencil
- Storybook built to `storybook-static` folder
```
$ npm run build:stencil
```

The following npm scrips are added to your package.json

```
{
    // Delete output folders
    "clean": "del-cli dist storybook-static",
    
    // Build stencil and storybook
    "build": "npm-run-all clean build:stencil build:storybook",
    
    // Build only stencil components
    "build:stencil": "STENCIL_ENV=prod stencil build --docs",
    
    // Build only storybook
    // Always use this after `build:stencil`
    "build:storybook": "build-storybook",

    // Start the dev server for both stencil and storybook
    "start": "npm-run-all --parallel stencil storybook",

    // Start only stencil dev server
    "stencil": "cross-env STENCIL_ENV=dev stencil build --dev --watch --serve --docs",
    
    // Start only storybook dev server
    // Always use this after `stencil`
    "storybook": "start-storybook -p 6007 -s ./stencil-utilities/public-assets",

    // Run initial build before starting the dev server
    // Needed for readme addon
    "prestart": "npm run build:stencil",

    // Component generator for stencil components
    "generate": "plop"
}
```

## Configure Stencil Dev Server
The wrapper adds a dev server config object to the `package.json` file. You can use it to configure how the dev server launches.
```
"stencil": {
    // The protocol used by the dev server
    "protocol": "http",
    // The host or IP address
    "host": "localhost",
    // The port where the dev server is launched
    "port": 3333,
    // The buildDir as per https://stenciljs.com/docs/config#www
    "buildDir": "build"
},
```

Please raise any issues you have while using this wrapper. Any help would also be appreciated.

### **More updates to come...**
