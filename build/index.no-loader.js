import 'aurelia-polyfills';
import { initialize } from 'aurelia-pal-browser';
import { LogManager, FrameworkConfiguration, Aurelia, View, PLATFORM, Loader } from 'aurelia-framework';
import { configure as configureBindingLanguage } from 'aurelia-templating-binding';
import { configure as configureDefaultResources } from 'aurelia-templating-resources';
import { configure as configureEventAggregator } from 'aurelia-event-aggregator';
import { ConsoleAppender } from 'aurelia-logging-console';
import { getLogger } from 'aurelia-logging';

/**
 * Bare implementation for a noop loader.
 */
PLATFORM.Loader = class NoopLoader extends Loader {

  normalize(name) {
    return Promise.resolve(name);
  }
  
  /**
  * Alters a module id so that it includes a plugin loader.
  * @param url The url of the module to load.
  * @param pluginName The plugin to apply to the module id.
  * @return The plugin-based module id.
  */
  applyPluginToUrl(url, pluginName) {
    return `${pluginName}!${url}`;
  }

  /**
  * Registers a plugin with the loader.
  * @param pluginName The name of the plugin.
  * @param implementation The plugin implementation.
  */
  addPlugin(pluginName, implementation) {/* empty */}
};

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

  const errorMsg = 'This bundle does not support router feature. Consider using full bundle';
  frameworkCfgProto.history = function() {
    getLogger('aurelia').error(errorMsg);
    return this;
  };
  
  frameworkCfgProto.router = function() {
    getLogger('aurelia').error(errorMsg);
    return this;
  };
})(FrameworkConfiguration.prototype);

export {
  start,
  enhance
} from './index.quick-start';

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
