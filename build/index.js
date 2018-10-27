import 'aurelia-polyfills';
import { initialize } from 'aurelia-pal-browser';
import 'aurelia-loader-esm';
import { LogManager, FrameworkConfiguration } from 'aurelia-framework';
import { configure as configureBindingLanguage } from 'aurelia-templating-binding';
import { configure as configureDefaultResources } from 'aurelia-templating-resources';
import { configure as configureEventAggregator } from 'aurelia-event-aggregator';
// import { configure as configureHistory } from 'aurelia-history-browser';
// import { configure as configureRouter } from 'aurelia-templating-router';
import { ConsoleAppender } from 'aurelia-logging-console';
import { getLogger } from 'aurelia-logging';

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


export * from 'aurelia-framework';
