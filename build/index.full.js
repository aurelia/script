import 'aurelia-polyfills';
import { initialize } from 'aurelia-pal-browser';
import 'aurelia-loader-esm';
import { LogManager, FrameworkConfiguration } from 'aurelia-framework';
import { configure as configureBindingLanguage } from 'aurelia-templating-binding';
import { configure as configureDefaultResources } from 'aurelia-templating-resources';
import { configure as configureEventAggregator } from 'aurelia-event-aggregator';
import { configure as configureHistory } from 'aurelia-history-browser';
import { configure as configureRouter } from 'aurelia-templating-router';
import { ConsoleAppender } from 'aurelia-logging-console';

initialize();

// Using static convention to avoid having to fetch / load module dynamically
(frameworkCfgProto => {
  frameworkCfgProto.developmentLogging = function() {
    LogManager.addAppender(new ConsoleAppender());
    LogManager.setLevel(LogManager.logLevel.debug);
    return this;
  };

  frameworkCfgProto.defaultBindingLanguage = function() {
    return this.plugin(configureBindingLanguage);
  };

  frameworkCfgProto.defaultResources = function() {
    return this.plugin(configureDefaultResources);
  };

  frameworkCfgProto.eventAggregator = function() {
    return this.plugin(configureEventAggregator);
  };

  frameworkCfgProto.history = function() {
    return this.plugin(configureHistory);
  };

  frameworkCfgProto.router = function() {
    return this.plugin(configureRouter);
  };
})(FrameworkConfiguration.prototype);

/**
 * Bootstrap a new Aurelia instance and start an application
 * @param {QuickStartOptions} options
 * @returns {Aurelia} the running Aurelia instance
 */
export async function start(options = {}) {
  const aurelia = new Aurelia();
  aurelia.use.standardConfiguration();
  if (options.debug) {
    aurelia.use.developmentLogging();
  }
  if (Array.isArray(options.resources)) {
    aurelia.use.globalResources(options.resources);
  }
  await aurelia.start();
  await aurelia.setRoot(options.root || 'app.js', options.host || document.body);
  return aurelia;
}

/**
 * Bootstrap a new Aurelia instance and start an application by enhancing a DOM tree
 * @param {QuickEnhanceOptions} options Configuration for enhancing a DOM tree
 * @returns {View} the enhanced View by selected options
 */
export async function enhance(options = {}) {
  const aurelia = new Aurelia();
  aurelia.use.standardConfiguration();
  if (options.debug) {
    aurelia.use.developmentLogging();
  }
  if (Array.isArray(options.resources)) {
    aurelia.use.globalResources(options.resources);
  }
  await aurelia.start();
  if (typeof options.root === 'function') {
    options.root = aurelia.container.get(options.root);
  }
  return aurelia.enhance(options.root || {}, options.host || document.body);
}

/** @typedef QuickStartOptions
 * @property {string | Function} [root] application root. Either string or a class, which will be instantiated with DI
 * @property {string | Element} [host] application host, element or a string, which will be used to query the element
 * @property {Array<string | Function>} [resources] global resources for the application
 * @property {boolean} [debug] true to use development console logging
 */

/** @typedef QuickEnhanceOptions
 * @property {{} | Function} [root] binding context for enhancement, can be either object or a class, which will be instantiated with DI
 * @property {string | Element} [host] host node of to be enhanced tree
 * @property {Array<string | Function>} [resources] global resources for the application
 * @property {boolean} [debug] true to use development console logging
 */

export * from 'aurelia-framework';
export { EventAggregator, includeEventsIn } from 'aurelia-event-aggregator';
export {
  If,
  Else,
  Repeat,
  Compose,
  Show,
  Hide,
  Focus,
  With,
  Replaceable,
  AbstractRepeater,
  ArrayRepeatStrategy,
  AttrBindingBehavior,
  BindingSignaler,
  DebounceBindingBehavior,
  FromViewBindingBehavior,
  HTMLSanitizer,
  MapRepeatStrategy,
  NullRepeatStrategy,
  NumberRepeatStrategy,
  OneTimeBindingBehavior,
  OneWayBindingBehavior,
  RepeatStrategyLocator,
  SanitizeHTMLValueConverter,
  SelfBindingBehavior,
  SetRepeatStrategy,
  SignalBindingBehavior,
  ThrottleBindingBehavior,
  ToViewBindingBehavior,
  TwoWayBindingBehavior,
  UpdateTriggerBindingBehavior,
  createFullOverrideContext,
  updateOneTimeBinding,
  updateOverrideContext,
  isOneTime,
  viewsRequireLifecycle,
  unwrapExpression,
  getItemsSourceExpression,
} from 'aurelia-templating-resources';
export {
  CommitChangesStep,
  NavigationInstruction,
  NavModel,
  isNavigationCommand,
  Redirect,
  RedirectToRoute,
  pipelineStatus,
  Pipeline,
  RouterConfiguration,
  activationStrategy,
  BuildNavigationPlanStep,
  Router,
  CanDeactivatePreviousStep,
  CanActivateNextStep,
  DeactivatePreviousStep,
  ActivateNextStep,
  RouteLoader,
  LoadRouteStep,
  PipelineProvider,
  AppRouter,
} from 'aurelia-router';
