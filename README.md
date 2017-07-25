# Init for Front End Styleguide

[![JavaScript Style Guide][standard-image]][standard-url]

[![NPM version][npm-image]][npm-url]
[![Dependencies][dependencies-image]][npm-url]

This package creates the basic file structure needed for the [Front End Styleguide](https://github.com/mvsde/styleguide) to work correct. It is used by the [CLI](https://github.com/mvsde/styleguide-cli) package.


## Usage

### Installation
With Yarn:  
`yarn add --dev front-end-styleguide-init`

With npm:  
`npm install --save-dev front-end-styleguide-init`

### Call the initialization

```js
// Require the init package
const styleguideInit = require('front-end-styleguide-init')

// `dir` is the directory where the styleguide will be initialized
styleguideInit(dir)
```


## Test

To test this package run `npm test`. Please note: This is not an automated test. It requires command line inputs and manual inspection of the `test/temp` output folder.


[standard-image]: https://cdn.rawgit.com/feross/standard/master/badge.svg
[standard-url]: https://github.com/feross/standard

[npm-image]: https://img.shields.io/npm/v/front-end-styleguide-init.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/front-end-styleguide-init

[dependencies-image]: https://img.shields.io/david/mvsde/styleguide-init.svg?style=flat-square
