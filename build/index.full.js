import 'aurelia-polyfills';
import { initialize } from 'aurelia-pal-browser';
import 'aurelia-loader-esm';
import { LogManager, FrameworkConfiguration, Aurelia } from 'aurelia-framework';
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
