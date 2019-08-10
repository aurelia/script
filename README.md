# aurelia-script

[![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This repo is the home for Aurelia's concatenated script-tag-ready build.

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.aurelia.io/) and [our email list](http://eepurl.com/ces50j). We also invite you to [follow us on twitter](https://twitter.com/aureliaeffect). If you have questions, please [join our community on Gitter](https://gitter.im/aurelia/discuss) or use [stack overflow](http://stackoverflow.com/search?q=aurelia). Documentation can be found [in our developer hub](http://aurelia.io).

## Getting started with Aurelia Script

### Simple examples

In the good old day, you chuck in a script tag into your html and start writing app. Aurelia Script is a way to help you return to that, with Aurelia. Simply add:

```html
  <script src='https://unpkg.com/aurelia-script@1.5.2'></script>
```

into your main html and you are ready to go, like the following:

```html
	<script>
    au
      .start({
        debug: true,
        // root: 'app.js', // can be ommitted, default is app.js
        // host: document.body // can be ommitted, default is document.body
      })
      .catch(ex => {
        document.body.textContent = `Bootstrap error: ${ex}`;
      })
	</script>
```

If you want to enhance a section of your page, which is a typical requirement in CMS environment:

```html
	<script>
    au
      .enhance({
        host: document.querySelector('.datepicker')
        // root can be a string, an object or a constructor function
        // aurelia will automatically instantiate if a function is given
        root: class DatePickerViewModel {
          format = 'dd/MM/yyyy'
        },
      });
  </script>
```

If you want to reuse the same `Aurelia` instance for multiple enhancements, you can do:

```js
  var aurelia = new au.Aurelia();
  aurelia.start().then(() => {
    // here you are ready to enhance or start a new app
  });
```

### Using aurelia-script with ES5:

For some projects that need to run in ES5, there are 2 dists that can be used: `dist/aurelia_no_loader.es5.umd.js` and `dist/aurelia_router_no_loader.es5.umd.js` (or equivalent minified versions). This is great when you just want to use Aurelia for its templating/binding capabilities (progressive enhancement, sub section of a bigger app for example). As their name suggest, there's no loader bundled with them, but you can easily add a loader to fit your need, in case you need to dynamically load a module. Both Requirejs and SystemJS are compatible with ES5 environments to dynamically load modules at runtime. Just make sure you configure Aurelia modules aliases correctly if those modules happen to have a dependencies on one of Aurelia modules.

### What is with `au`:

`au` is a global namespace for all exports from Aurelia modules, instead of importing from `aurelia-framework` module. This is because aurelia-script is bundled in UMD module format, to enable simple, old school style usage. For example:

The equivalent of 

```ts
import { CompositionEngine, ViewCompiler } from 'aurelia-framework';
```

In Aurelia Script would be:
```ts
const { CompositionEngine, ViewCompiler } = au;
```

### With ESM:

There is another distribution bundle that is in ES module format, which you can think of it as a barrel export version of all Aurelia modules in ESM. For example:

The equivalent of 

```ts
import { BindingEngine, CompositionEngine, ViewCompiler } from 'aurelia-framework';
```

In Aurelia Script esm distribution would be:

```ts
import {
  BindingEngine,
  CompositionEngine,
  ViewCompiler
} from 'https://unpkg.com/aurelia-script@1.4.0/dist/aurelia.esm.min.js';
```

## Online Playground with Single file script
  * Codesandbox: https://codesandbox.io/s/wnr6zxv6vl
  * Codepen: https://codepen.io/bigopon/pen/MzGLZe
  * With Aurelia Store: https://codesandbox.io/s/n3r48qvzjl
  * With Aurelia UI Virtualization: https://codesandbox.io/s/m781l8oyqj
  * With Aurelia Dialog: https://codesandbox.io/s/62lmyy16xn
  * With Aurelia Validation: https://codesandbox.io/s/6y1zzon47r

## Development

### Build

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

### Run the example project
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