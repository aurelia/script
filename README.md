# aurelia-script

[![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This repo is the home for Aurelia's concatenated script-tag-ready build.

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.aurelia.io/) and [our email list](http://eepurl.com/ces50j). We also invite you to [follow us on twitter](https://twitter.com/aureliaeffect). If you have questions, please [join our community on Gitter](https://gitter.im/aurelia/discuss) or use [stack overflow](http://stackoverflow.com/search?q=aurelia). Documentation can be found [in our developer hub](http://aurelia.io).

## Online Playground with Single file script
  * Codesandbox: https://codesandbox.io/s/wnr6zxv6vl
  * Codepen: https://codepen.io/bigopon/pen/MzGLZe
  * With Aurelia Store: https://codesandbox.io/s/n3r48qvzjl
  * With Aurelia UI Virtualization: https://codesandbox.io/s/m781l8oyqj
  * With Aurelia Dialog: https://codesandbox.io/s/62lmyy16xn
  * With Aurelia Validation: https://codesandbox.io/s/6y1zzon47r

## Build

  1. Install the dependencies

  ```bash
  npm install
  ```

  2. Run either the build / bundle script

  ```bash
  # Build only core
  npm run build
  # Or full build, with router
  npm run bundle
  ```

## Run the example project
  1. Go to example folder inside this project
  2. Start a http server
  3. Navigate to `index.html` in browser

## How it works?
  1. `dist` folder contains built result of all aurelia bundles, together with their minified versions, with different scopes:
     * bundles with names ending in `.esm.js` are in ESM (ECMAScript Module) format. bundles with names ending in `.umd.js` are in UMD (Universal Module Definition) format.
     * `aurelia.esm.js`, `aurelia.umd.js` are bundles without router feature. Typically used when you want to minimized to script included in your page.
     * `aurelia_router.esm.js`, `aurelia_router.umd.js` are bundles of with router feature.
  2. `example` folder contains an example application to get started. Step to run it included in the section above
  3. `scripts` folder contains all built result of all aurelia core modules, in AMD module format for environment like `gistrun` (https://gist.run)
  4. `build` folder contains entry/ setup script, code for building / emiting code to `dist` and `example` folders.
     * `index.js` and `index.full.js` are custom entries to give rollup instruction how to bundle all core modules. `index.js` will result in a bundle without router related features. `index.full.js` will result in a bundle with all features.
     * `rollup.config.js` is rollup config for running `npm run bundle` and `npm run build` scripts

### Notes:
  `aurelia-script` uses new ECMAScript feature: dynamic import via `import()` API. If your target browser does not support such API, `aurelia-script` won't be able to run. Browser support matrix is at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Browser_compatibility (check for Dynamic import)