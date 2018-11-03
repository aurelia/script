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


export * from 'aurelia-framework';
export { EventAggregator, includeEventsIn } from 'aurelia-event-aggregator';
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
