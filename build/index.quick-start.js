import { Aurelia, FrameworkConfiguration } from 'aurelia-framework';

/**
 * Bootstrap a new Aurelia instance and start an application
 * @param {QuickStartOptions} options
 * @returns {Aurelia} the running Aurelia instance
 */
const createAndStart = (options = {}) => {
  const aurelia = new Aurelia();
  const use = aurelia.use;
  use.standardConfiguration();
  if (options.debug) {
    use.developmentLogging();
  }
  if (Array.isArray(options.plugins)) {
    options.plugins.forEach((plgCfg) => {
      if (Array.isArray(plgCfg)) {
        use.plugin(plgCfg[0], plgCfg[1]);
      } else {
        use.plugin(plgCfg);
      }
    });
  }
  if (Array.isArray(options.resources)) {
    use.globalResources(options.resources);
  }
  return aurelia.start();
}

/**
 * Bootstrap a new Aurelia instance and start an application
 * @param {QuickStartOptions} options
 * @returns {Aurelia} the running Aurelia instance
 */
export async function start(options = {}) {
  const aurelia = await createAndStart(options);
  await aurelia.setRoot(options.root || 'app.js', options.host || document.body);
  return aurelia;
}

/**
 * Bootstrap a new Aurelia instance and start an application by enhancing a DOM tree
 * @param {QuickEnhanceOptions} options Configuration for enhancing a DOM tree
 * @returns {View} the enhanced View by selected options
 */
export async function enhance(options = {}) {
  const aurelia = await createAndStart(options);
  if (typeof options.root === 'function') {
    options.root = aurelia.container.get(options.root);
  }
  return aurelia.enhance(options.root || {}, options.host || document.body);
}

/** @typed ConfigureFn
 * @param {FrameworkConfiguration} frameWorkConfig
 * @param {any} plugigConfig
 */

/** @typedef QuickStartOptions
 * @property {string | Function} [root] application root. Either string or a class, which will be instantiated with DI
 * @property {string | Element} [host] application host, element or a string, which will be used to query the element
 * @property {Array<string | Function>} [resources] global resources for the application
 * @property {Array<string | {(fwCfg: FrameworkConfiguration) => any}  | [(fwCfg: FrameworkConfiguration, cfg: {}) => any, {}]>} [plugins]
 * @property {boolean} [debug] true to use development console logging
 */

/** @typedef QuickEnhanceOptions
 * @property {{} | Function} [root] binding context for enhancement, can be either object or a class, which will be instantiated with DI
 * @property {string | Element} [host] host node of to be enhanced tree
 * @property {Array<string | Function>} [resources] global resources for the application
 * @property {Array<string | {(fwCfg: FrameworkConfiguration) => any}  | [(fwCfg: FrameworkConfiguration, cfg: {}) => any, {}]>} [plugins]
 * @property {boolean} [debug] true to use development console logging
 */