# Init for Front End Styleguide
[https://github.com/mvsde/styleguide](https://github.com/mvsde/styleguide)

[![NPM version][npm-image]][npm-url] [![Dependencies][dependencies-image]][npm-url]

This package creates the basic file structure needed for the [https://github.com/mvsde/styleguide](Front End Styleguide) to work correct.

Install with `npm install --save-dev front-end-styleguide-init`.

Integrate into other modules:
```js
// Import the init package
const frontEndStyleguideInit = require('front-end-styleguide-init');

// `dir` is the directory where the styleguide will be initialized
frontEndStyleguideInit(dir);
```

The default configuration files are exposed for use in another module:
```js
// Import the init package
const frontEndStyleguideInit = require('front-end-styleguide-init');

// Import default configuration files
let configFile = frontEndStyleguideInit.configFile;
let pathsFile  = frontEndStyleguideInit.pathsFile;
```


[npm-image]: https://img.shields.io/npm/v/front-end-styleguide-init.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/front-end-styleguide-init

[dependencies-image]: https://img.shields.io/david/mvsde/styleguide-init.svg?style=flat-square
