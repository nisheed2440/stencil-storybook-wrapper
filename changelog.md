# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 08-02-2019
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