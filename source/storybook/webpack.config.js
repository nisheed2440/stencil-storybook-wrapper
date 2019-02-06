// Copy webpack plugin import
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Export a function. Accept the base config as the only param.
module.exports = (storybookBaseConfig, configType) => {
  // configType has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.
  
  /**
   * Copy dist folder created by stencil to stories output directory
   */
  if (configType === "PRODUCTION") {
    storybookBaseConfig.plugins.push(
      new CopyWebpackPlugin([{ from: "./www/build/", to: "./build" }])
    );
  }
  // Return the altered config
  return storybookBaseConfig;
};