# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 30-04-2019
### Added
- Support for Sass using variable maps and reference functions
- Added Generator prompt to use Sass or CSS

## [1.3.1] - 17-04-2019
### Bug Fixes
- Fixed issue with typos

## [1.3.0] - 17-04-2019
### Bug Fixes
- Issue #6 - scoped package name issue during build
- External `stories` folder outside `src` skipped during build issue

## [1.2.0] - 09-02-2019
### Added
- `fs-extra` package to replace `fs` usages.

### Updated
- readme.md with stencil dev server config doc
- `post-build.js` updated to copy stencil assets to storybook build folder

### Removed
- Dependency on `webpack.config.js`
- Dependency on `copy-webpack-plugin`
- storybook config in `package.json`

## [1.1.0] - 08-02-2019
### Updated
- plopfile.wrapper.js to use spawn for executing scripts
- plopfile.wrapper.js to have blacklisted and whitelisted dependencies to be installed in destination module
- readme.md with usage and info documentation

### Removed
- Dependency on shelljs and shellexec
- Un-necessary dependencies moved to devDependencies

## [1.0.1] - 07-02-2019
### Added
- changelog.md file

### Updated
- .npmignore file with .eslintignore

## [1.0.0] - 07-02-2019
### Added
- Core module files
- The logic for creating the wrapper elements
- Plop generator implementation
- Templates to be replaced in the destination folder
- Update destantion package.json file with custom scripts
- Readme instructions