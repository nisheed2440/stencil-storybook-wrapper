# Stencil Storybook Wrapper
This module provides a wrapper to interoperate stencil created app with storybook. 

It works by hooking into the stencil dev server during development, listenig to the websocket during HMR(Hot Module Replacement) and showing the errors or reloading the stencil generated resources.

During production builds for storybook, the output of the stencil build is moved to the `storybook-static` folder and resources requests updated so that the storybook can be deployed.

---
#### **NOTE: TO BE USED WITH VANNILA STENCIL APPS**

Using this with a stencil app already modifed by you could lead to un-necessary side effects. 

----

## Installation
Install it globally
```
npm i -g stencil-storybook-wrapper
```
OR

Use it via NPX
```
npx stencil-storybook-wrapper
```

## Usage

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

    // Run initial build after install to test integrity
    "postinstall": "npm run build:stencil",

    // Component generator for stencil components
    "generate": "plop"
}
```

### **READ ME TO BE UPDATED SOON...**