const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [
  {
    mode: 'production',
    target: 'node',
    devtool: 'source-map',
    entry: './source/client.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'stencil-utilities/public-assets/stencil.client.js',
    },
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            'css-loader',
            'less-loader',
          ],
        },
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        { test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/ },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'stencil-utilities/public-assets/stencil.client.css',
        chunkFilename: '[id].css',
      }),
      new CopyWebpackPlugin([
        {
          from: 'source/storybook/',
          to: './.storybook/',
        },
        {
          from: 'source/plop/',
          to: './plop/',
        },
        {
          from: 'source/templates/',
          to: './templates/',
        },
        {
          from: 'source/stencil-utilities/',
          to: './stencil-utilities/',
        },
        {
          from: 'source/plopfile.stencil.js',
          to: './',
        },
        {
          from: 'source/plopfile.wrapper.js',
          to: './',
        },
        {
          from: 'source/bin/',
          to: '../.bin/',
        },
      ]),
    ],
  },
];
