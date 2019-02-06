const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [
  {
    mode: 'development',
    target: 'node',
    devtool: 'source-map',
    entry: './source/stencil-utilities/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist/stencil-utilities'),
      filename: 'index.js',
    },
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        '@root-path': path.resolve(__dirname),
      },
    },
    module: {
      rules: [
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        { test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/ },
      ],
    },
    plugins: [
      new CopyWebpackPlugin([
        {
          from: 'source/storybook/', to : '../.storybook/'
        },
        {
          from: 'source/plop/', to : '../plop/'
        },
        {
          from: 'source/templates/', to : '../templates/'
        },
        {
          from: 'source/stencil-utilities/', to : './'
        },
        {
          from: 'source/plopfile.stencil.js', to : '../'
        },
        {
          from: 'source/plopfile.wrapper.js', to : '../'
        },
        {
          from: 'source/bin/', to : '../../.bin/'
        }
      ])
    ],
  },
];
