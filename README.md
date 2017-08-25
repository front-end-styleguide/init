# <img alt="" src="https://cdn.rawgit.com/front-end-styleguide/brand/master/mark/mark.svg" width="24"> Front End Styleguide Init

[![NPM version][npm-image]][npm-url]
[![Dependencies][dependencies-image]][npm-url]
[![JavaScript Standard Style][standard-image]][standard-url]

This package creates the basic file structure needed for the [Front End Styleguide](https://github.com/front-end-styleguide/core) to work correct. It is used by the [CLI](https://github.com/front-end-styleguide/cli) package.


## Installation

```bash
# Yarn
yarn add --dev front-end-styleguide-init

# npm
npm install --save-dev front-end-styleguide-init
```

## Usage

```js
// Require the init package
const styleguideInit = require('front-end-styleguide-init')

// `dir` is the directory where the styleguide will be initialized
styleguideInit(dir)
```


## Test

To test this package run `npm test`. Please note: This is not an automated test. It requires command line inputs and manual inspection of the `test/temp` output folder.


[npm-image]: https://img.shields.io/npm/v/front-end-styleguide-init.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/front-end-styleguide-init

[dependencies-image]: https://img.shields.io/david/front-end-styleguide/init.svg?style=flat-square

[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://standardjs.com
