if (window.System && typeof System.amdDefine === 'function') {
  window.define = System.amdDefine;
}

define('aurelia-templating-router/router-view',['exports', 'aurelia-dependency-injection', 'aurelia-binding', 'aurelia-templating', 'aurelia-router', 'aurelia-metadata', 'aurelia-pal'], function (exports, _aureliaDependencyInjection, _aureliaBinding, _aureliaTemplating, _aureliaRouter, _aureliaMetadata, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RouterViewLocator = exports.RouterView = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

  var RouterView = exports.RouterView = (_dec = (0, _aureliaTemplating.customElement)('router-view'), _dec(_class = (0, _aureliaTemplating.noView)(_class = (_class2 = function () {
    RouterView.inject = function inject() {
      return [_aureliaPal.DOM.Element, _aureliaDependencyInjection.Container, _aureliaTemplating.ViewSlot, _aureliaRouter.Router, _aureliaTemplating.ViewLocator, _aureliaTemplating.CompositionTransaction, _aureliaTemplating.CompositionEngine];
    };

    function RouterView(element, container, viewSlot, router, viewLocator, compositionTransaction, compositionEngine) {
      

      _initDefineProp(this, 'swapOrder', _descriptor, this);

      _initDefineProp(this, 'layoutView', _descriptor2, this);

      _initDefineProp(this, 'layoutViewModel', _descriptor3, this);

      _initDefineProp(this, 'layoutModel', _descriptor4, this);

      this.element = element;
      this.container = container;
      this.viewSlot = viewSlot;
      this.router = router;
      this.viewLocator = viewLocator;
      this.compositionTransaction = compositionTransaction;
      this.compositionEngine = compositionEngine;
      this.router.registerViewPort(this, this.element.getAttribute('name'));

      if (!('initialComposition' in compositionTransaction)) {
        compositionTransaction.initialComposition = true;
        this.compositionTransactionNotifier = compositionTransaction.enlist();
      }
    }

    RouterView.prototype.created = function created(owningView) {
      this.owningView = owningView;
    };

    RouterView.prototype.bind = function bind(bindingContext, overrideContext) {
      this.container.viewModel = bindingContext;
      this.overrideContext = overrideContext;
    };

    RouterView.prototype.process = function process(viewPortInstruction, waitToSwap) {
      var _this = this;

      var component = viewPortInstruction.component;
      var childContainer = component.childContainer;
      var viewModel = component.viewModel;
      var viewModelResource = component.viewModelResource;
      var metadata = viewModelResource.metadata;
      var config = component.router.currentInstruction.config;
      var viewPort = config.viewPorts ? config.viewPorts[viewPortInstruction.name] || {} : {};

      childContainer.get(RouterViewLocator)._notify(this);

      var layoutInstruction = {
        viewModel: viewPort.layoutViewModel || config.layoutViewModel || this.layoutViewModel,
        view: viewPort.layoutView || config.layoutView || this.layoutView,
        model: viewPort.layoutModel || config.layoutModel || this.layoutModel,
        router: viewPortInstruction.component.router,
        childContainer: childContainer,
        viewSlot: this.viewSlot
      };

      var viewStrategy = this.viewLocator.getViewStrategy(component.view || viewModel);
      if (viewStrategy && component.view) {
        viewStrategy.makeRelativeTo(_aureliaMetadata.Origin.get(component.router.container.viewModel.constructor).moduleId);
      }

      return metadata.load(childContainer, viewModelResource.value, null, viewStrategy, true).then(function (viewFactory) {
        if (!_this.compositionTransactionNotifier) {
          _this.compositionTransactionOwnershipToken = _this.compositionTransaction.tryCapture();
        }

        if (layoutInstruction.viewModel || layoutInstruction.view) {
          viewPortInstruction.layoutInstruction = layoutInstruction;
        }

        viewPortInstruction.controller = metadata.create(childContainer, _aureliaTemplating.BehaviorInstruction.dynamic(_this.element, viewModel, viewFactory));

        if (waitToSwap) {
          return null;
        }

        _this.swap(viewPortInstruction);
      });
    };

    RouterView.prototype.swap = function swap(viewPortInstruction) {
      var _this2 = this;

      var layoutInstruction = viewPortInstruction.layoutInstruction;
      var previousView = this.view;

      var work = function work() {
        var swapStrategy = _aureliaTemplating.SwapStrategies[_this2.swapOrder] || _aureliaTemplating.SwapStrategies.after;
        var viewSlot = _this2.viewSlot;

        swapStrategy(viewSlot, previousView, function () {
          return Promise.resolve(viewSlot.add(_this2.view));
        }).then(function () {
          _this2._notify();
        });
      };

      var ready = function ready(owningView) {
        viewPortInstruction.controller.automate(_this2.overrideContext, owningView);
        if (_this2.compositionTransactionOwnershipToken) {
          return _this2.compositionTransactionOwnershipToken.waitForCompositionComplete().then(function () {
            _this2.compositionTransactionOwnershipToken = null;
            return work();
          });
        }

        return work();
      };

      if (layoutInstruction) {
        if (!layoutInstruction.viewModel) {
          layoutInstruction.viewModel = {};
        }

        return this.compositionEngine.createController(layoutInstruction).then(function (controller) {
          _aureliaTemplating.ShadowDOM.distributeView(viewPortInstruction.controller.view, controller.slots || controller.view.slots);
          controller.automate((0, _aureliaBinding.createOverrideContext)(layoutInstruction.viewModel), _this2.owningView);
          controller.view.children.push(viewPortInstruction.controller.view);
          return controller.view || controller;
        }).then(function (newView) {
          _this2.view = newView;
          return ready(newView);
        });
      }

      this.view = viewPortInstruction.controller.view;

      return ready(this.owningView);
    };

    RouterView.prototype._notify = function _notify() {
      if (this.compositionTransactionNotifier) {
        this.compositionTransactionNotifier.done();
        this.compositionTransactionNotifier = null;
      }
    };

    return RouterView;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'swapOrder', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'layoutView', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'layoutViewModel', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'layoutModel', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class);

  var RouterViewLocator = exports.RouterViewLocator = function () {
    function RouterViewLocator() {
      var _this3 = this;

      

      this.promise = new Promise(function (resolve) {
        return _this3.resolve = resolve;
      });
    }

    RouterViewLocator.prototype.findNearest = function findNearest() {
      return this.promise;
    };

    RouterViewLocator.prototype._notify = function _notify(routerView) {
      this.resolve(routerView);
    };

    return RouterViewLocator;
  }();
});
define('aurelia-templating-router/route-loader',['exports', 'aurelia-dependency-injection', 'aurelia-templating', 'aurelia-router', 'aurelia-path', 'aurelia-metadata', './router-view'], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaRouter, _aureliaPath, _aureliaMetadata, _routerView) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TemplatingRouteLoader = undefined;

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  

  var _dec, _class, _dec2, _class2;

  var EmptyClass = (_dec = (0, _aureliaTemplating.inlineView)('<template></template>'), _dec(_class = function EmptyClass() {
    
  }) || _class);
  var TemplatingRouteLoader = exports.TemplatingRouteLoader = (_dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.CompositionEngine), _dec2(_class2 = function (_RouteLoader) {
    _inherits(TemplatingRouteLoader, _RouteLoader);

    function TemplatingRouteLoader(compositionEngine) {
      

      var _this = _possibleConstructorReturn(this, _RouteLoader.call(this));

      _this.compositionEngine = compositionEngine;
      return _this;
    }

    TemplatingRouteLoader.prototype.loadRoute = function loadRoute(router, config) {
      var childContainer = router.container.createChild();

      var viewModel = void 0;
      if (config.moduleId === null) {
        viewModel = EmptyClass;
      } else if (/\.html/i.test(config.moduleId)) {
        viewModel = createDynamicClass(config.moduleId);
      } else {
        viewModel = (0, _aureliaPath.relativeToFile)(config.moduleId, _aureliaMetadata.Origin.get(router.container.viewModel.constructor).moduleId);
      }

      var instruction = {
        viewModel: viewModel,
        childContainer: childContainer,
        view: config.view || config.viewStrategy,
        router: router
      };

      childContainer.registerSingleton(_routerView.RouterViewLocator);

      childContainer.getChildRouter = function () {
        var childRouter = void 0;

        childContainer.registerHandler(_aureliaRouter.Router, function (c) {
          return childRouter || (childRouter = router.createChild(childContainer));
        });

        return childContainer.get(_aureliaRouter.Router);
      };

      return this.compositionEngine.ensureViewModel(instruction);
    };

    return TemplatingRouteLoader;
  }(_aureliaRouter.RouteLoader)) || _class2);


  function createDynamicClass(moduleId) {
    var _dec3, _dec4, _class3;

    var name = /([^\/^\?]+)\.html/i.exec(moduleId)[1];

    var DynamicClass = (_dec3 = (0, _aureliaTemplating.customElement)(name), _dec4 = (0, _aureliaTemplating.useView)(moduleId), _dec3(_class3 = _dec4(_class3 = function () {
      function DynamicClass() {
        
      }

      DynamicClass.prototype.bind = function bind(bindingContext) {
        this.$parent = bindingContext;
      };

      return DynamicClass;
    }()) || _class3) || _class3);


    return DynamicClass;
  }
});
define('aurelia-templating-router/route-href',['exports', 'aurelia-templating', 'aurelia-router', 'aurelia-pal', 'aurelia-logging'], function (exports, _aureliaTemplating, _aureliaRouter, _aureliaPal, _aureliaLogging) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RouteHref = undefined;

  var LogManager = _interopRequireWildcard(_aureliaLogging);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  

  var _dec, _dec2, _dec3, _dec4, _class;

  var logger = LogManager.getLogger('route-href');

  var RouteHref = exports.RouteHref = (_dec = (0, _aureliaTemplating.customAttribute)('route-href'), _dec2 = (0, _aureliaTemplating.bindable)({ name: 'route', changeHandler: 'processChange', primaryProperty: true }), _dec3 = (0, _aureliaTemplating.bindable)({ name: 'params', changeHandler: 'processChange' }), _dec4 = (0, _aureliaTemplating.bindable)({ name: 'attribute', defaultValue: 'href' }), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = function () {
    RouteHref.inject = function inject() {
      return [_aureliaRouter.Router, _aureliaPal.DOM.Element];
    };

    function RouteHref(router, element) {
      

      this.router = router;
      this.element = element;
    }

    RouteHref.prototype.bind = function bind() {
      this.isActive = true;
      this.processChange();
    };

    RouteHref.prototype.unbind = function unbind() {
      this.isActive = false;
    };

    RouteHref.prototype.attributeChanged = function attributeChanged(value, previous) {
      if (previous) {
        this.element.removeAttribute(previous);
      }

      this.processChange();
    };

    RouteHref.prototype.processChange = function processChange() {
      var _this = this;

      return this.router.ensureConfigured().then(function () {
        if (!_this.isActive) {
          return null;
        }

        var href = _this.router.generate(_this.route, _this.params);

        if (_this.element.au.controller) {
          _this.element.au.controller.viewModel[_this.attribute] = href;
        } else {
          _this.element.setAttribute(_this.attribute, href);
        }

        return null;
      }).catch(function (reason) {
        logger.error(reason);
      });
    };

    return RouteHref;
  }()) || _class) || _class) || _class) || _class);
});
define('aurelia-templating-router/aurelia-templating-router',['exports', 'aurelia-router', './route-loader', './router-view', './route-href'], function (exports, _aureliaRouter, _routeLoader, _routerView, _routeHref) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = exports.RouteHref = exports.RouterView = exports.TemplatingRouteLoader = undefined;


  function configure(config) {
    config.singleton(_aureliaRouter.RouteLoader, _routeLoader.TemplatingRouteLoader).singleton(_aureliaRouter.Router, _aureliaRouter.AppRouter).globalResources(_routerView.RouterView, _routeHref.RouteHref);

    config.container.registerAlias(_aureliaRouter.Router, _aureliaRouter.AppRouter);
  }

  exports.TemplatingRouteLoader = _routeLoader.TemplatingRouteLoader;
  exports.RouterView = _routerView.RouterView;
  exports.RouteHref = _routeHref.RouteHref;
  exports.configure = configure;
});
;define('aurelia-templating-router', ['aurelia-templating-router/aurelia-templating-router'], function (main) { return main; });

define('aurelia-router',['exports', 'aurelia-logging', 'aurelia-route-recognizer', 'aurelia-dependency-injection', 'aurelia-history', 'aurelia-event-aggregator'], function (exports, _aureliaLogging, _aureliaRouteRecognizer, _aureliaDependencyInjection, _aureliaHistory, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AppRouter = exports.PipelineProvider = exports.LoadRouteStep = exports.RouteLoader = exports.ActivateNextStep = exports.DeactivatePreviousStep = exports.CanActivateNextStep = exports.CanDeactivatePreviousStep = exports.Router = exports.BuildNavigationPlanStep = exports.activationStrategy = exports.RouterConfiguration = exports.Pipeline = exports.pipelineStatus = exports.RedirectToRoute = exports.Redirect = exports.NavModel = exports.NavigationInstruction = exports.CommitChangesStep = undefined;
  exports._normalizeAbsolutePath = _normalizeAbsolutePath;
  exports._createRootedPath = _createRootedPath;
  exports._resolveUrl = _resolveUrl;
  exports._ensureArrayWithSingleRoutePerConfig = _ensureArrayWithSingleRoutePerConfig;
  exports.isNavigationCommand = isNavigationCommand;
  exports._buildNavigationPlan = _buildNavigationPlan;

  var LogManager = _interopRequireWildcard(_aureliaLogging);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  

  function _normalizeAbsolutePath(path, hasPushState) {
    var absolute = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (!hasPushState && path[0] !== '#') {
      path = '#' + path;
    }

    if (hasPushState && absolute) {
      path = path.substring(1, path.length);
    }

    return path;
  }

  function _createRootedPath(fragment, baseUrl, hasPushState, absolute) {
    if (isAbsoluteUrl.test(fragment)) {
      return fragment;
    }

    var path = '';

    if (baseUrl.length && baseUrl[0] !== '/') {
      path += '/';
    }

    path += baseUrl;

    if ((!path.length || path[path.length - 1] !== '/') && fragment[0] !== '/') {
      path += '/';
    }

    if (path.length && path[path.length - 1] === '/' && fragment[0] === '/') {
      path = path.substring(0, path.length - 1);
    }

    return _normalizeAbsolutePath(path + fragment, hasPushState, absolute);
  }

  function _resolveUrl(fragment, baseUrl, hasPushState) {
    if (isRootedPath.test(fragment)) {
      return _normalizeAbsolutePath(fragment, hasPushState);
    }

    return _createRootedPath(fragment, baseUrl, hasPushState);
  }

  function _ensureArrayWithSingleRoutePerConfig(config) {
    var routeConfigs = [];

    if (Array.isArray(config.route)) {
      for (var i = 0, ii = config.route.length; i < ii; ++i) {
        var current = Object.assign({}, config);
        current.route = config.route[i];
        routeConfigs.push(current);
      }
    } else {
      routeConfigs.push(Object.assign({}, config));
    }

    return routeConfigs;
  }

  var isRootedPath = /^#?\//;
  var isAbsoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;

  var CommitChangesStep = exports.CommitChangesStep = function () {
    function CommitChangesStep() {
      
    }

    CommitChangesStep.prototype.run = function run(navigationInstruction, next) {
      return navigationInstruction._commitChanges(true).then(function () {
        navigationInstruction._updateTitle();
        return next();
      });
    };

    return CommitChangesStep;
  }();

  var NavigationInstruction = exports.NavigationInstruction = function () {
    function NavigationInstruction(init) {
      

      this.plan = null;
      this.options = {};

      Object.assign(this, init);

      this.params = this.params || {};
      this.viewPortInstructions = {};

      var ancestorParams = [];
      var current = this;
      do {
        var currentParams = Object.assign({}, current.params);
        if (current.config && current.config.hasChildRouter) {
          delete currentParams[current.getWildCardName()];
        }

        ancestorParams.unshift(currentParams);
        current = current.parentInstruction;
      } while (current);

      var allParams = Object.assign.apply(Object, [{}, this.queryParams].concat(ancestorParams));
      this.lifecycleArgs = [allParams, this.config, this];
    }

    NavigationInstruction.prototype.getAllInstructions = function getAllInstructions() {
      var instructions = [this];
      for (var _key in this.viewPortInstructions) {
        var childInstruction = this.viewPortInstructions[_key].childNavigationInstruction;
        if (childInstruction) {
          instructions.push.apply(instructions, childInstruction.getAllInstructions());
        }
      }

      return instructions;
    };

    NavigationInstruction.prototype.getAllPreviousInstructions = function getAllPreviousInstructions() {
      return this.getAllInstructions().map(function (c) {
        return c.previousInstruction;
      }).filter(function (c) {
        return c;
      });
    };

    NavigationInstruction.prototype.addViewPortInstruction = function addViewPortInstruction(viewPortName, strategy, moduleId, component) {
      var config = Object.assign({}, this.lifecycleArgs[1], { currentViewPort: viewPortName });
      var viewportInstruction = this.viewPortInstructions[viewPortName] = {
        name: viewPortName,
        strategy: strategy,
        moduleId: moduleId,
        component: component,
        childRouter: component.childRouter,
        lifecycleArgs: [].concat(this.lifecycleArgs[0], config, this.lifecycleArgs[2])
      };

      return viewportInstruction;
    };

    NavigationInstruction.prototype.getWildCardName = function getWildCardName() {
      var wildcardIndex = this.config.route.lastIndexOf('*');
      return this.config.route.substr(wildcardIndex + 1);
    };

    NavigationInstruction.prototype.getWildcardPath = function getWildcardPath() {
      var wildcardName = this.getWildCardName();
      var path = this.params[wildcardName] || '';

      if (this.queryString) {
        path += '?' + this.queryString;
      }

      return path;
    };

    NavigationInstruction.prototype.getBaseUrl = function getBaseUrl() {
      var _this = this;

      var fragment = decodeURI(this.fragment);

      if (fragment === '') {
        var nonEmptyRoute = this.router.routes.find(function (route) {
          return route.name === _this.config.name && route.route !== '';
        });
        if (nonEmptyRoute) {
          fragment = nonEmptyRoute.route;
        }
      }

      if (!this.params) {
        return encodeURI(fragment);
      }

      var wildcardName = this.getWildCardName();
      var path = this.params[wildcardName] || '';

      if (!path) {
        return encodeURI(fragment);
      }

      return encodeURI(fragment.substr(0, fragment.lastIndexOf(path)));
    };

    NavigationInstruction.prototype._commitChanges = function _commitChanges(waitToSwap) {
      var _this2 = this;

      var router = this.router;
      router.currentInstruction = this;

      if (this.previousInstruction) {
        this.previousInstruction.config.navModel.isActive = false;
      }

      this.config.navModel.isActive = true;

      router.refreshNavigation();

      var loads = [];
      var delaySwaps = [];

      var _loop = function _loop(viewPortName) {
        var viewPortInstruction = _this2.viewPortInstructions[viewPortName];
        var viewPort = router.viewPorts[viewPortName];

        if (!viewPort) {
          throw new Error('There was no router-view found in the view for ' + viewPortInstruction.moduleId + '.');
        }

        if (viewPortInstruction.strategy === activationStrategy.replace) {
          if (viewPortInstruction.childNavigationInstruction && viewPortInstruction.childNavigationInstruction.parentCatchHandler) {
            loads.push(viewPortInstruction.childNavigationInstruction._commitChanges(waitToSwap));
          } else {
            if (waitToSwap) {
              delaySwaps.push({ viewPort: viewPort, viewPortInstruction: viewPortInstruction });
            }
            loads.push(viewPort.process(viewPortInstruction, waitToSwap).then(function (x) {
              if (viewPortInstruction.childNavigationInstruction) {
                return viewPortInstruction.childNavigationInstruction._commitChanges(waitToSwap);
              }
            }));
          }
        } else {
          if (viewPortInstruction.childNavigationInstruction) {
            loads.push(viewPortInstruction.childNavigationInstruction._commitChanges(waitToSwap));
          }
        }
      };

      for (var viewPortName in this.viewPortInstructions) {
        _loop(viewPortName);
      }

      return Promise.all(loads).then(function () {
        delaySwaps.forEach(function (x) {
          return x.viewPort.swap(x.viewPortInstruction);
        });
        return null;
      }).then(function () {
        return prune(_this2);
      });
    };

    NavigationInstruction.prototype._updateTitle = function _updateTitle() {
      var title = this._buildTitle(this.router.titleSeparator);
      if (title) {
        this.router.history.setTitle(title);
      }
    };

    NavigationInstruction.prototype._buildTitle = function _buildTitle() {
      var separator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ' | ';

      var title = '';
      var childTitles = [];

      if (this.config.navModel.title) {
        title = this.router.transformTitle(this.config.navModel.title);
      }

      for (var viewPortName in this.viewPortInstructions) {
        var _viewPortInstruction = this.viewPortInstructions[viewPortName];

        if (_viewPortInstruction.childNavigationInstruction) {
          var childTitle = _viewPortInstruction.childNavigationInstruction._buildTitle(separator);
          if (childTitle) {
            childTitles.push(childTitle);
          }
        }
      }

      if (childTitles.length) {
        title = childTitles.join(separator) + (title ? separator : '') + title;
      }

      if (this.router.title) {
        title += (title ? separator : '') + this.router.transformTitle(this.router.title);
      }

      return title;
    };

    return NavigationInstruction;
  }();

  function prune(instruction) {
    instruction.previousInstruction = null;
    instruction.plan = null;
  }

  var NavModel = exports.NavModel = function () {
    function NavModel(router, relativeHref) {
      

      this.isActive = false;
      this.title = null;
      this.href = null;
      this.relativeHref = null;
      this.settings = {};
      this.config = null;

      this.router = router;
      this.relativeHref = relativeHref;
    }

    NavModel.prototype.setTitle = function setTitle(title) {
      this.title = title;

      if (this.isActive) {
        this.router.updateTitle();
      }
    };

    return NavModel;
  }();

  function isNavigationCommand(obj) {
    return obj && typeof obj.navigate === 'function';
  }

  var Redirect = exports.Redirect = function () {
    function Redirect(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      

      this.url = url;
      this.options = Object.assign({ trigger: true, replace: true }, options);
      this.shouldContinueProcessing = false;
    }

    Redirect.prototype.setRouter = function setRouter(router) {
      this.router = router;
    };

    Redirect.prototype.navigate = function navigate(appRouter) {
      var navigatingRouter = this.options.useAppRouter ? appRouter : this.router || appRouter;
      navigatingRouter.navigate(this.url, this.options);
    };

    return Redirect;
  }();

  var RedirectToRoute = exports.RedirectToRoute = function () {
    function RedirectToRoute(route) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      

      this.route = route;
      this.params = params;
      this.options = Object.assign({ trigger: true, replace: true }, options);
      this.shouldContinueProcessing = false;
    }

    RedirectToRoute.prototype.setRouter = function setRouter(router) {
      this.router = router;
    };

    RedirectToRoute.prototype.navigate = function navigate(appRouter) {
      var navigatingRouter = this.options.useAppRouter ? appRouter : this.router || appRouter;
      navigatingRouter.navigateToRoute(this.route, this.params, this.options);
    };

    return RedirectToRoute;
  }();

  var pipelineStatus = exports.pipelineStatus = {
    completed: 'completed',
    canceled: 'canceled',
    rejected: 'rejected',
    running: 'running'
  };

  var Pipeline = exports.Pipeline = function () {
    function Pipeline() {
      

      this.steps = [];
    }

    Pipeline.prototype.addStep = function addStep(step) {
      var run = void 0;

      if (typeof step === 'function') {
        run = step;
      } else if (typeof step.getSteps === 'function') {
        var steps = step.getSteps();
        for (var i = 0, l = steps.length; i < l; i++) {
          this.addStep(steps[i]);
        }

        return this;
      } else {
        run = step.run.bind(step);
      }

      this.steps.push(run);

      return this;
    };

    Pipeline.prototype.run = function run(instruction) {
      var index = -1;
      var steps = this.steps;

      function next() {
        index++;

        if (index < steps.length) {
          var currentStep = steps[index];

          try {
            return currentStep(instruction, next);
          } catch (e) {
            return next.reject(e);
          }
        } else {
          return next.complete();
        }
      }

      next.complete = createCompletionHandler(next, pipelineStatus.completed);
      next.cancel = createCompletionHandler(next, pipelineStatus.canceled);
      next.reject = createCompletionHandler(next, pipelineStatus.rejected);

      return next();
    };

    return Pipeline;
  }();

  function createCompletionHandler(next, status) {
    return function (output) {
      return Promise.resolve({ status: status, output: output, completed: status === pipelineStatus.completed });
    };
  }

  var RouterConfiguration = exports.RouterConfiguration = function () {
    function RouterConfiguration() {
      

      this.instructions = [];
      this.options = {};
      this.pipelineSteps = [];
    }

    RouterConfiguration.prototype.addPipelineStep = function addPipelineStep(name, step) {
      if (step === null || step === undefined) {
        throw new Error('Pipeline step cannot be null or undefined.');
      }
      this.pipelineSteps.push({ name: name, step: step });
      return this;
    };

    RouterConfiguration.prototype.addAuthorizeStep = function addAuthorizeStep(step) {
      return this.addPipelineStep('authorize', step);
    };

    RouterConfiguration.prototype.addPreActivateStep = function addPreActivateStep(step) {
      return this.addPipelineStep('preActivate', step);
    };

    RouterConfiguration.prototype.addPreRenderStep = function addPreRenderStep(step) {
      return this.addPipelineStep('preRender', step);
    };

    RouterConfiguration.prototype.addPostRenderStep = function addPostRenderStep(step) {
      return this.addPipelineStep('postRender', step);
    };

    RouterConfiguration.prototype.fallbackRoute = function fallbackRoute(fragment) {
      this._fallbackRoute = fragment;
      return this;
    };

    RouterConfiguration.prototype.map = function map(route) {
      if (Array.isArray(route)) {
        route.forEach(this.map.bind(this));
        return this;
      }

      return this.mapRoute(route);
    };

    RouterConfiguration.prototype.useViewPortDefaults = function useViewPortDefaults(viewPortConfig) {
      this.viewPortDefaults = viewPortConfig;
      return this;
    };

    RouterConfiguration.prototype.mapRoute = function mapRoute(config) {
      this.instructions.push(function (router) {
        var routeConfigs = _ensureArrayWithSingleRoutePerConfig(config);

        var navModel = void 0;
        for (var i = 0, ii = routeConfigs.length; i < ii; ++i) {
          var _routeConfig = routeConfigs[i];
          _routeConfig.settings = _routeConfig.settings || {};
          if (!navModel) {
            navModel = router.createNavModel(_routeConfig);
          }

          router.addRoute(_routeConfig, navModel);
        }
      });

      return this;
    };

    RouterConfiguration.prototype.mapUnknownRoutes = function mapUnknownRoutes(config) {
      this.unknownRouteConfig = config;
      return this;
    };

    RouterConfiguration.prototype.exportToRouter = function exportToRouter(router) {
      var instructions = this.instructions;
      for (var i = 0, ii = instructions.length; i < ii; ++i) {
        instructions[i](router);
      }

      if (this.title) {
        router.title = this.title;
      }

      if (this.titleSeparator) {
        router.titleSeparator = this.titleSeparator;
      }

      if (this.unknownRouteConfig) {
        router.handleUnknownRoutes(this.unknownRouteConfig);
      }

      if (this._fallbackRoute) {
        router.fallbackRoute = this._fallbackRoute;
      }

      if (this.viewPortDefaults) {
        router.useViewPortDefaults(this.viewPortDefaults);
      }

      Object.assign(router.options, this.options);

      var pipelineSteps = this.pipelineSteps;
      if (pipelineSteps.length) {
        if (!router.isRoot) {
          throw new Error('Pipeline steps can only be added to the root router');
        }

        var pipelineProvider = router.pipelineProvider;
        for (var _i = 0, _ii = pipelineSteps.length; _i < _ii; ++_i) {
          var _pipelineSteps$_i = pipelineSteps[_i],
              _name = _pipelineSteps$_i.name,
              _step = _pipelineSteps$_i.step;

          pipelineProvider.addStep(_name, _step);
        }
      }
    };

    return RouterConfiguration;
  }();

  var activationStrategy = exports.activationStrategy = {
    noChange: 'no-change',
    invokeLifecycle: 'invoke-lifecycle',
    replace: 'replace'
  };

  var BuildNavigationPlanStep = exports.BuildNavigationPlanStep = function () {
    function BuildNavigationPlanStep() {
      
    }

    BuildNavigationPlanStep.prototype.run = function run(navigationInstruction, next) {
      return _buildNavigationPlan(navigationInstruction).then(function (plan) {
        if (plan instanceof Redirect) {
          return next.cancel(plan);
        }
        navigationInstruction.plan = plan;
        return next();
      }).catch(next.cancel);
    };

    return BuildNavigationPlanStep;
  }();

  function _buildNavigationPlan(instruction, forceLifecycleMinimum) {
    var config = instruction.config;

    if ('redirect' in config) {
      var _router = instruction.router;
      return _router._createNavigationInstruction(config.redirect).then(function (newInstruction) {
        var params = {};
        for (var _key2 in newInstruction.params) {
          var val = newInstruction.params[_key2];
          if (typeof val === 'string' && val[0] === ':') {
            val = val.slice(1);

            if (val in instruction.params) {
              params[_key2] = instruction.params[val];
            }
          } else {
            params[_key2] = newInstruction.params[_key2];
          }
        }
        var redirectLocation = _router.generate(newInstruction.config.name, params, instruction.options);

        if (instruction.queryString) {
          redirectLocation += '?' + instruction.queryString;
        }

        return Promise.resolve(new Redirect(redirectLocation));
      });
    }

    var prev = instruction.previousInstruction;
    var plan = {};
    var defaults = instruction.router.viewPortDefaults;

    if (prev) {
      var newParams = hasDifferentParameterValues(prev, instruction);
      var pending = [];

      var _loop2 = function _loop2(viewPortName) {
        var prevViewPortInstruction = prev.viewPortInstructions[viewPortName];
        var nextViewPortConfig = viewPortName in config.viewPorts ? config.viewPorts[viewPortName] : prevViewPortInstruction;
        if (nextViewPortConfig.moduleId === null && viewPortName in instruction.router.viewPortDefaults) {
          nextViewPortConfig = defaults[viewPortName];
        }

        var viewPortPlan = plan[viewPortName] = {
          name: viewPortName,
          config: nextViewPortConfig,
          prevComponent: prevViewPortInstruction.component,
          prevModuleId: prevViewPortInstruction.moduleId
        };

        if (prevViewPortInstruction.moduleId !== nextViewPortConfig.moduleId) {
          viewPortPlan.strategy = activationStrategy.replace;
        } else if ('determineActivationStrategy' in prevViewPortInstruction.component.viewModel) {
          var _prevViewPortInstruct;

          viewPortPlan.strategy = (_prevViewPortInstruct = prevViewPortInstruction.component.viewModel).determineActivationStrategy.apply(_prevViewPortInstruct, instruction.lifecycleArgs);
        } else if (config.activationStrategy) {
          viewPortPlan.strategy = config.activationStrategy;
        } else if (newParams || forceLifecycleMinimum) {
          viewPortPlan.strategy = activationStrategy.invokeLifecycle;
        } else {
          viewPortPlan.strategy = activationStrategy.noChange;
        }

        if (viewPortPlan.strategy !== activationStrategy.replace && prevViewPortInstruction.childRouter) {
          var path = instruction.getWildcardPath();
          var task = prevViewPortInstruction.childRouter._createNavigationInstruction(path, instruction).then(function (childInstruction) {
            viewPortPlan.childNavigationInstruction = childInstruction;

            return _buildNavigationPlan(childInstruction, viewPortPlan.strategy === activationStrategy.invokeLifecycle).then(function (childPlan) {
              if (childPlan instanceof Redirect) {
                return Promise.reject(childPlan);
              }
              childInstruction.plan = childPlan;
            });
          });

          pending.push(task);
        }
      };

      for (var viewPortName in prev.viewPortInstructions) {
        _loop2(viewPortName);
      }

      return Promise.all(pending).then(function () {
        return plan;
      });
    }

    for (var viewPortName in config.viewPorts) {
      var viewPortConfig = config.viewPorts[viewPortName];
      if (viewPortConfig.moduleId === null && viewPortName in instruction.router.viewPortDefaults) {
        viewPortConfig = defaults[viewPortName];
      }
      plan[viewPortName] = {
        name: viewPortName,
        strategy: activationStrategy.replace,
        config: viewPortConfig
      };
    }

    return Promise.resolve(plan);
  }

  function hasDifferentParameterValues(prev, next) {
    var prevParams = prev.params;
    var nextParams = next.params;
    var nextWildCardName = next.config.hasChildRouter ? next.getWildCardName() : null;

    for (var _key3 in nextParams) {
      if (_key3 === nextWildCardName) {
        continue;
      }

      if (prevParams[_key3] !== nextParams[_key3]) {
        return true;
      }
    }

    for (var _key4 in prevParams) {
      if (_key4 === nextWildCardName) {
        continue;
      }

      if (prevParams[_key4] !== nextParams[_key4]) {
        return true;
      }
    }

    if (!next.options.compareQueryParams) {
      return false;
    }

    var prevQueryParams = prev.queryParams;
    var nextQueryParams = next.queryParams;
    for (var _key5 in nextQueryParams) {
      if (prevQueryParams[_key5] !== nextQueryParams[_key5]) {
        return true;
      }
    }

    for (var _key6 in prevQueryParams) {
      if (prevQueryParams[_key6] !== nextQueryParams[_key6]) {
        return true;
      }
    }

    return false;
  }

  var Router = exports.Router = function () {
    function Router(container, history) {
      var _this3 = this;

      

      this.parent = null;
      this.options = {};
      this.viewPortDefaults = {};

      this.transformTitle = function (title) {
        if (_this3.parent) {
          return _this3.parent.transformTitle(title);
        }
        return title;
      };

      this.container = container;
      this.history = history;
      this.reset();
    }

    Router.prototype.reset = function reset() {
      var _this4 = this;

      this.viewPorts = {};
      this.routes = [];
      this.baseUrl = '';
      this.isConfigured = false;
      this.isNavigating = false;
      this.isExplicitNavigation = false;
      this.isExplicitNavigationBack = false;
      this.isNavigatingFirst = false;
      this.isNavigatingNew = false;
      this.isNavigatingRefresh = false;
      this.isNavigatingForward = false;
      this.isNavigatingBack = false;
      this.couldDeactivate = false;
      this.navigation = [];
      this.currentInstruction = null;
      this.viewPortDefaults = {};
      this._fallbackOrder = 100;
      this._recognizer = new _aureliaRouteRecognizer.RouteRecognizer();
      this._childRecognizer = new _aureliaRouteRecognizer.RouteRecognizer();
      this._configuredPromise = new Promise(function (resolve) {
        _this4._resolveConfiguredPromise = resolve;
      });
    };

    Router.prototype.registerViewPort = function registerViewPort(viewPort, name) {
      name = name || 'default';
      this.viewPorts[name] = viewPort;
    };

    Router.prototype.ensureConfigured = function ensureConfigured() {
      return this._configuredPromise;
    };

    Router.prototype.configure = function configure(callbackOrConfig) {
      var _this5 = this;

      this.isConfigured = true;

      var result = callbackOrConfig;
      var config = void 0;
      if (typeof callbackOrConfig === 'function') {
        config = new RouterConfiguration();
        result = callbackOrConfig(config);
      }

      return Promise.resolve(result).then(function (c) {
        if (c && c.exportToRouter) {
          config = c;
        }

        config.exportToRouter(_this5);
        _this5.isConfigured = true;
        _this5._resolveConfiguredPromise();
      });
    };

    Router.prototype.navigate = function navigate(fragment, options) {
      if (!this.isConfigured && this.parent) {
        return this.parent.navigate(fragment, options);
      }

      this.isExplicitNavigation = true;
      return this.history.navigate(_resolveUrl(fragment, this.baseUrl, this.history._hasPushState), options);
    };

    Router.prototype.navigateToRoute = function navigateToRoute(route, params, options) {
      var path = this.generate(route, params);
      return this.navigate(path, options);
    };

    Router.prototype.navigateBack = function navigateBack() {
      this.isExplicitNavigationBack = true;
      this.history.navigateBack();
    };

    Router.prototype.createChild = function createChild(container) {
      var childRouter = new Router(container || this.container.createChild(), this.history);
      childRouter.parent = this;
      return childRouter;
    };

    Router.prototype.generate = function generate(name, params) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var hasRoute = this._recognizer.hasRoute(name);
      if ((!this.isConfigured || !hasRoute) && this.parent) {
        return this.parent.generate(name, params, options);
      }

      if (!hasRoute) {
        throw new Error('A route with name \'' + name + '\' could not be found. Check that `name: \'' + name + '\'` was specified in the route\'s config.');
      }

      var path = this._recognizer.generate(name, params);
      var rootedPath = _createRootedPath(path, this.baseUrl, this.history._hasPushState, options.absolute);
      return options.absolute ? '' + this.history.getAbsoluteRoot() + rootedPath : rootedPath;
    };

    Router.prototype.createNavModel = function createNavModel(config) {
      var navModel = new NavModel(this, 'href' in config ? config.href : config.route);
      navModel.title = config.title;
      navModel.order = config.nav;
      navModel.href = config.href;
      navModel.settings = config.settings;
      navModel.config = config;

      return navModel;
    };

    Router.prototype.addRoute = function addRoute(config, navModel) {
      if (Array.isArray(config.route)) {
        var routeConfigs = _ensureArrayWithSingleRoutePerConfig(config);
        routeConfigs.forEach(this.addRoute.bind(this));
        return;
      }

      validateRouteConfig(config, this.routes);

      if (!('viewPorts' in config) && !config.navigationStrategy) {
        config.viewPorts = {
          'default': {
            moduleId: config.moduleId,
            view: config.view
          }
        };
      }

      if (!navModel) {
        navModel = this.createNavModel(config);
      }

      this.routes.push(config);

      var path = config.route;
      if (path.charAt(0) === '/') {
        path = path.substr(1);
      }
      var caseSensitive = config.caseSensitive === true;
      var state = this._recognizer.add({ path: path, handler: config, caseSensitive: caseSensitive });

      if (path) {
        var _settings = config.settings;
        delete config.settings;
        var withChild = JSON.parse(JSON.stringify(config));
        config.settings = _settings;
        withChild.route = path + '/*childRoute';
        withChild.hasChildRouter = true;
        this._childRecognizer.add({
          path: withChild.route,
          handler: withChild,
          caseSensitive: caseSensitive
        });

        withChild.navModel = navModel;
        withChild.settings = config.settings;
        withChild.navigationStrategy = config.navigationStrategy;
      }

      config.navModel = navModel;

      if ((navModel.order || navModel.order === 0) && this.navigation.indexOf(navModel) === -1) {
        if (!navModel.href && navModel.href !== '' && (state.types.dynamics || state.types.stars)) {
          throw new Error('Invalid route config for "' + config.route + '" : dynamic routes must specify an "href:" to be included in the navigation model.');
        }

        if (typeof navModel.order !== 'number') {
          navModel.order = ++this._fallbackOrder;
        }

        this.navigation.push(navModel);
        this.navigation = this.navigation.sort(function (a, b) {
          return a.order - b.order;
        });
      }
    };

    Router.prototype.hasRoute = function hasRoute(name) {
      return !!(this._recognizer.hasRoute(name) || this.parent && this.parent.hasRoute(name));
    };

    Router.prototype.hasOwnRoute = function hasOwnRoute(name) {
      return this._recognizer.hasRoute(name);
    };

    Router.prototype.handleUnknownRoutes = function handleUnknownRoutes(config) {
      var _this6 = this;

      if (!config) {
        throw new Error('Invalid unknown route handler');
      }

      this.catchAllHandler = function (instruction) {
        return _this6._createRouteConfig(config, instruction).then(function (c) {
          instruction.config = c;
          return instruction;
        });
      };
    };

    Router.prototype.updateTitle = function updateTitle() {
      if (this.parent) {
        return this.parent.updateTitle();
      }

      if (this.currentInstruction) {
        this.currentInstruction._updateTitle();
      }
      return undefined;
    };

    Router.prototype.refreshNavigation = function refreshNavigation() {
      var nav = this.navigation;

      for (var i = 0, length = nav.length; i < length; i++) {
        var _current = nav[i];
        if (!_current.config.href) {
          _current.href = _createRootedPath(_current.relativeHref, this.baseUrl, this.history._hasPushState);
        } else {
          _current.href = _normalizeAbsolutePath(_current.config.href, this.history._hasPushState);
        }
      }
    };

    Router.prototype.useViewPortDefaults = function useViewPortDefaults(viewPortDefaults) {
      for (var viewPortName in viewPortDefaults) {
        var viewPortConfig = viewPortDefaults[viewPortName];
        this.viewPortDefaults[viewPortName] = {
          moduleId: viewPortConfig.moduleId
        };
      }
    };

    Router.prototype._refreshBaseUrl = function _refreshBaseUrl() {
      if (this.parent) {
        this.baseUrl = generateBaseUrl(this.parent, this.parent.currentInstruction);
      }
    };

    Router.prototype._createNavigationInstruction = function _createNavigationInstruction() {
      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var parentInstruction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var fragment = url;
      var queryString = '';

      var queryIndex = url.indexOf('?');
      if (queryIndex !== -1) {
        fragment = url.substr(0, queryIndex);
        queryString = url.substr(queryIndex + 1);
      }

      var results = this._recognizer.recognize(url);
      if (!results || !results.length) {
        results = this._childRecognizer.recognize(url);
      }

      var instructionInit = {
        fragment: fragment,
        queryString: queryString,
        config: null,
        parentInstruction: parentInstruction,
        previousInstruction: this.currentInstruction,
        router: this,
        options: {
          compareQueryParams: this.options.compareQueryParams
        }
      };

      var result = void 0;

      if (results && results.length) {
        var first = results[0];
        var _instruction = new NavigationInstruction(Object.assign({}, instructionInit, {
          params: first.params,
          queryParams: first.queryParams || results.queryParams,
          config: first.config || first.handler
        }));

        if (typeof first.handler === 'function') {
          result = evaluateNavigationStrategy(_instruction, first.handler, first);
        } else if (first.handler && typeof first.handler.navigationStrategy === 'function') {
          result = evaluateNavigationStrategy(_instruction, first.handler.navigationStrategy, first.handler);
        } else {
          result = Promise.resolve(_instruction);
        }
      } else if (this.catchAllHandler) {
        var _instruction2 = new NavigationInstruction(Object.assign({}, instructionInit, {
          params: { path: fragment },
          queryParams: results ? results.queryParams : {},
          config: null }));

        result = evaluateNavigationStrategy(_instruction2, this.catchAllHandler);
      } else if (this.parent) {
        var _router2 = this._parentCatchAllHandler(this.parent);

        if (_router2) {
          var newParentInstruction = this._findParentInstructionFromRouter(_router2, parentInstruction);

          var _instruction3 = new NavigationInstruction(Object.assign({}, instructionInit, {
            params: { path: fragment },
            queryParams: results ? results.queryParams : {},
            router: _router2,
            parentInstruction: newParentInstruction,
            parentCatchHandler: true,
            config: null }));

          result = evaluateNavigationStrategy(_instruction3, _router2.catchAllHandler);
        }
      }

      if (result && parentInstruction) {
        this.baseUrl = generateBaseUrl(this.parent, parentInstruction);
      }

      return result || Promise.reject(new Error('Route not found: ' + url));
    };

    Router.prototype._findParentInstructionFromRouter = function _findParentInstructionFromRouter(router, instruction) {
      if (instruction.router === router) {
        instruction.fragment = router.baseUrl;
        return instruction;
      } else if (instruction.parentInstruction) {
        return this._findParentInstructionFromRouter(router, instruction.parentInstruction);
      }
      return undefined;
    };

    Router.prototype._parentCatchAllHandler = function _parentCatchAllHandler(router) {
      if (router.catchAllHandler) {
        return router;
      } else if (router.parent) {
        return this._parentCatchAllHandler(router.parent);
      }
      return false;
    };

    Router.prototype._createRouteConfig = function _createRouteConfig(config, instruction) {
      var _this7 = this;

      return Promise.resolve(config).then(function (c) {
        if (typeof c === 'string') {
          return { moduleId: c };
        } else if (typeof c === 'function') {
          return c(instruction);
        }

        return c;
      }).then(function (c) {
        return typeof c === 'string' ? { moduleId: c } : c;
      }).then(function (c) {
        c.route = instruction.params.path;
        validateRouteConfig(c, _this7.routes);

        if (!c.navModel) {
          c.navModel = _this7.createNavModel(c);
        }

        return c;
      });
    };

    _createClass(Router, [{
      key: 'isRoot',
      get: function get() {
        return !this.parent;
      }
    }]);

    return Router;
  }();

  function generateBaseUrl(router, instruction) {
    return '' + (router.baseUrl || '') + (instruction.getBaseUrl() || '');
  }

  function validateRouteConfig(config, routes) {
    if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) !== 'object') {
      throw new Error('Invalid Route Config');
    }

    if (typeof config.route !== 'string') {
      var _name2 = config.name || '(no name)';
      throw new Error('Invalid Route Config for "' + _name2 + '": You must specify a "route:" pattern.');
    }

    if (!('redirect' in config || config.moduleId || config.navigationStrategy || config.viewPorts)) {
      throw new Error('Invalid Route Config for "' + config.route + '": You must specify a "moduleId:", "redirect:", "navigationStrategy:", or "viewPorts:".');
    }
  }

  function evaluateNavigationStrategy(instruction, evaluator, context) {
    return Promise.resolve(evaluator.call(context, instruction)).then(function () {
      if (!('viewPorts' in instruction.config)) {
        instruction.config.viewPorts = {
          'default': {
            moduleId: instruction.config.moduleId
          }
        };
      }

      return instruction;
    });
  }

  var CanDeactivatePreviousStep = exports.CanDeactivatePreviousStep = function () {
    function CanDeactivatePreviousStep() {
      
    }

    CanDeactivatePreviousStep.prototype.run = function run(navigationInstruction, next) {
      return processDeactivatable(navigationInstruction, 'canDeactivate', next);
    };

    return CanDeactivatePreviousStep;
  }();

  var CanActivateNextStep = exports.CanActivateNextStep = function () {
    function CanActivateNextStep() {
      
    }

    CanActivateNextStep.prototype.run = function run(navigationInstruction, next) {
      return processActivatable(navigationInstruction, 'canActivate', next);
    };

    return CanActivateNextStep;
  }();

  var DeactivatePreviousStep = exports.DeactivatePreviousStep = function () {
    function DeactivatePreviousStep() {
      
    }

    DeactivatePreviousStep.prototype.run = function run(navigationInstruction, next) {
      return processDeactivatable(navigationInstruction, 'deactivate', next, true);
    };

    return DeactivatePreviousStep;
  }();

  var ActivateNextStep = exports.ActivateNextStep = function () {
    function ActivateNextStep() {
      
    }

    ActivateNextStep.prototype.run = function run(navigationInstruction, next) {
      return processActivatable(navigationInstruction, 'activate', next, true);
    };

    return ActivateNextStep;
  }();

  function processDeactivatable(navigationInstruction, callbackName, next, ignoreResult) {
    var plan = navigationInstruction.plan;
    var infos = findDeactivatable(plan, callbackName);
    var i = infos.length;

    function inspect(val) {
      if (ignoreResult || shouldContinue(val)) {
        return iterate();
      }

      return next.cancel(val);
    }

    function iterate() {
      if (i--) {
        try {
          var viewModel = infos[i];
          var _result = viewModel[callbackName](navigationInstruction);
          return processPotential(_result, inspect, next.cancel);
        } catch (error) {
          return next.cancel(error);
        }
      }

      navigationInstruction.router.couldDeactivate = true;

      return next();
    }

    return iterate();
  }

  function findDeactivatable(plan, callbackName) {
    var list = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    for (var viewPortName in plan) {
      var _viewPortPlan = plan[viewPortName];
      var prevComponent = _viewPortPlan.prevComponent;

      if ((_viewPortPlan.strategy === activationStrategy.invokeLifecycle || _viewPortPlan.strategy === activationStrategy.replace) && prevComponent) {
        var viewModel = prevComponent.viewModel;

        if (callbackName in viewModel) {
          list.push(viewModel);
        }
      }

      if (_viewPortPlan.strategy === activationStrategy.replace && prevComponent) {
        addPreviousDeactivatable(prevComponent, callbackName, list);
      } else if (_viewPortPlan.childNavigationInstruction) {
        findDeactivatable(_viewPortPlan.childNavigationInstruction.plan, callbackName, list);
      }
    }

    return list;
  }

  function addPreviousDeactivatable(component, callbackName, list) {
    var childRouter = component.childRouter;

    if (childRouter && childRouter.currentInstruction) {
      var viewPortInstructions = childRouter.currentInstruction.viewPortInstructions;

      for (var viewPortName in viewPortInstructions) {
        var _viewPortInstruction2 = viewPortInstructions[viewPortName];
        var prevComponent = _viewPortInstruction2.component;
        var prevViewModel = prevComponent.viewModel;

        if (callbackName in prevViewModel) {
          list.push(prevViewModel);
        }

        addPreviousDeactivatable(prevComponent, callbackName, list);
      }
    }
  }

  function processActivatable(navigationInstruction, callbackName, next, ignoreResult) {
    var infos = findActivatable(navigationInstruction, callbackName);
    var length = infos.length;
    var i = -1;

    function inspect(val, router) {
      if (ignoreResult || shouldContinue(val, router)) {
        return iterate();
      }

      return next.cancel(val);
    }

    function iterate() {
      i++;

      if (i < length) {
        try {
          var _current2$viewModel;

          var _current2 = infos[i];
          var _result2 = (_current2$viewModel = _current2.viewModel)[callbackName].apply(_current2$viewModel, _current2.lifecycleArgs);
          return processPotential(_result2, function (val) {
            return inspect(val, _current2.router);
          }, next.cancel);
        } catch (error) {
          return next.cancel(error);
        }
      }

      return next();
    }

    return iterate();
  }

  function findActivatable(navigationInstruction, callbackName) {
    var list = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var router = arguments[3];

    var plan = navigationInstruction.plan;

    Object.keys(plan).filter(function (viewPortName) {
      var viewPortPlan = plan[viewPortName];
      var viewPortInstruction = navigationInstruction.viewPortInstructions[viewPortName];
      var viewModel = viewPortInstruction.component.viewModel;

      if ((viewPortPlan.strategy === activationStrategy.invokeLifecycle || viewPortPlan.strategy === activationStrategy.replace) && callbackName in viewModel) {
        list.push({
          viewModel: viewModel,
          lifecycleArgs: viewPortInstruction.lifecycleArgs,
          router: router
        });
      }

      if (viewPortPlan.childNavigationInstruction) {
        findActivatable(viewPortPlan.childNavigationInstruction, callbackName, list, viewPortInstruction.component.childRouter || router);
      }
    });

    return list;
  }

  function shouldContinue(output, router) {
    if (output instanceof Error) {
      return false;
    }

    if (isNavigationCommand(output)) {
      if (typeof output.setRouter === 'function') {
        output.setRouter(router);
      }

      return !!output.shouldContinueProcessing;
    }

    if (output === undefined) {
      return true;
    }

    return output;
  }

  var SafeSubscription = function () {
    function SafeSubscription(subscriptionFunc) {
      

      this._subscribed = true;
      this._subscription = subscriptionFunc(this);

      if (!this._subscribed) this.unsubscribe();
    }

    SafeSubscription.prototype.unsubscribe = function unsubscribe() {
      if (this._subscribed && this._subscription) this._subscription.unsubscribe();

      this._subscribed = false;
    };

    _createClass(SafeSubscription, [{
      key: 'subscribed',
      get: function get() {
        return this._subscribed;
      }
    }]);

    return SafeSubscription;
  }();

  function processPotential(obj, resolve, reject) {
    if (obj && typeof obj.then === 'function') {
      return Promise.resolve(obj).then(resolve).catch(reject);
    }

    if (obj && typeof obj.subscribe === 'function') {
      var obs = obj;
      return new SafeSubscription(function (sub) {
        return obs.subscribe({
          next: function next() {
            if (sub.subscribed) {
              sub.unsubscribe();
              resolve(obj);
            }
          },
          error: function error(_error) {
            if (sub.subscribed) {
              sub.unsubscribe();
              reject(_error);
            }
          },
          complete: function complete() {
            if (sub.subscribed) {
              sub.unsubscribe();
              resolve(obj);
            }
          }
        });
      });
    }

    try {
      return resolve(obj);
    } catch (error) {
      return reject(error);
    }
  }

  var RouteLoader = exports.RouteLoader = function () {
    function RouteLoader() {
      
    }

    RouteLoader.prototype.loadRoute = function loadRoute(router, config, navigationInstruction) {
      throw Error('Route loaders must implement "loadRoute(router, config, navigationInstruction)".');
    };

    return RouteLoader;
  }();

  var LoadRouteStep = exports.LoadRouteStep = function () {
    LoadRouteStep.inject = function inject() {
      return [RouteLoader];
    };

    function LoadRouteStep(routeLoader) {
      

      this.routeLoader = routeLoader;
    }

    LoadRouteStep.prototype.run = function run(navigationInstruction, next) {
      return loadNewRoute(this.routeLoader, navigationInstruction).then(next).catch(next.cancel);
    };

    return LoadRouteStep;
  }();

  function loadNewRoute(routeLoader, navigationInstruction) {
    var toLoad = determineWhatToLoad(navigationInstruction);
    var loadPromises = toLoad.map(function (current) {
      return loadRoute(routeLoader, current.navigationInstruction, current.viewPortPlan);
    });

    return Promise.all(loadPromises);
  }

  function determineWhatToLoad(navigationInstruction) {
    var toLoad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var plan = navigationInstruction.plan;

    for (var viewPortName in plan) {
      var _viewPortPlan2 = plan[viewPortName];

      if (_viewPortPlan2.strategy === activationStrategy.replace) {
        toLoad.push({ viewPortPlan: _viewPortPlan2, navigationInstruction: navigationInstruction });

        if (_viewPortPlan2.childNavigationInstruction) {
          determineWhatToLoad(_viewPortPlan2.childNavigationInstruction, toLoad);
        }
      } else {
        var _viewPortInstruction3 = navigationInstruction.addViewPortInstruction(viewPortName, _viewPortPlan2.strategy, _viewPortPlan2.prevModuleId, _viewPortPlan2.prevComponent);

        if (_viewPortPlan2.childNavigationInstruction) {
          _viewPortInstruction3.childNavigationInstruction = _viewPortPlan2.childNavigationInstruction;
          determineWhatToLoad(_viewPortPlan2.childNavigationInstruction, toLoad);
        }
      }
    }

    return toLoad;
  }

  function loadRoute(routeLoader, navigationInstruction, viewPortPlan) {
    var moduleId = viewPortPlan.config ? viewPortPlan.config.moduleId : null;

    return loadComponent(routeLoader, navigationInstruction, viewPortPlan.config).then(function (component) {
      var viewPortInstruction = navigationInstruction.addViewPortInstruction(viewPortPlan.name, viewPortPlan.strategy, moduleId, component);

      var childRouter = component.childRouter;
      if (childRouter) {
        var path = navigationInstruction.getWildcardPath();

        return childRouter._createNavigationInstruction(path, navigationInstruction).then(function (childInstruction) {
          viewPortPlan.childNavigationInstruction = childInstruction;

          return _buildNavigationPlan(childInstruction).then(function (childPlan) {
            if (childPlan instanceof Redirect) {
              return Promise.reject(childPlan);
            }
            childInstruction.plan = childPlan;
            viewPortInstruction.childNavigationInstruction = childInstruction;

            return loadNewRoute(routeLoader, childInstruction);
          });
        });
      }

      return undefined;
    });
  }

  function loadComponent(routeLoader, navigationInstruction, config) {
    var router = navigationInstruction.router;
    var lifecycleArgs = navigationInstruction.lifecycleArgs;

    return routeLoader.loadRoute(router, config, navigationInstruction).then(function (component) {
      var viewModel = component.viewModel,
          childContainer = component.childContainer;

      component.router = router;
      component.config = config;

      if ('configureRouter' in viewModel) {
        var childRouter = childContainer.getChildRouter();
        component.childRouter = childRouter;

        return childRouter.configure(function (c) {
          return viewModel.configureRouter.apply(viewModel, [c, childRouter].concat(lifecycleArgs));
        }).then(function () {
          return component;
        });
      }

      return component;
    });
  }

  var PipelineSlot = function () {
    function PipelineSlot(container, name, alias) {
      

      this.steps = [];

      this.container = container;
      this.slotName = name;
      this.slotAlias = alias;
    }

    PipelineSlot.prototype.getSteps = function getSteps() {
      var _this8 = this;

      return this.steps.map(function (x) {
        return _this8.container.get(x);
      });
    };

    return PipelineSlot;
  }();

  var PipelineProvider = exports.PipelineProvider = function () {
    PipelineProvider.inject = function inject() {
      return [_aureliaDependencyInjection.Container];
    };

    function PipelineProvider(container) {
      

      this.container = container;
      this.steps = [BuildNavigationPlanStep, CanDeactivatePreviousStep, LoadRouteStep, this._createPipelineSlot('authorize'), CanActivateNextStep, this._createPipelineSlot('preActivate', 'modelbind'), DeactivatePreviousStep, ActivateNextStep, this._createPipelineSlot('preRender', 'precommit'), CommitChangesStep, this._createPipelineSlot('postRender', 'postcomplete')];
    }

    PipelineProvider.prototype.createPipeline = function createPipeline() {
      var _this9 = this;

      var useCanDeactivateStep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var pipeline = new Pipeline();
      this.steps.forEach(function (step) {
        if (useCanDeactivateStep || step !== CanDeactivatePreviousStep) {
          pipeline.addStep(_this9.container.get(step));
        }
      });
      return pipeline;
    };

    PipelineProvider.prototype._findStep = function _findStep(name) {
      return this.steps.find(function (x) {
        return x.slotName === name || x.slotAlias === name;
      });
    };

    PipelineProvider.prototype.addStep = function addStep(name, step) {
      var found = this._findStep(name);
      if (found) {
        if (!found.steps.includes(step)) {
          found.steps.push(step);
        }
      } else {
        throw new Error('Invalid pipeline slot name: ' + name + '.');
      }
    };

    PipelineProvider.prototype.removeStep = function removeStep(name, step) {
      var slot = this._findStep(name);
      if (slot) {
        slot.steps.splice(slot.steps.indexOf(step), 1);
      }
    };

    PipelineProvider.prototype._clearSteps = function _clearSteps() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      var slot = this._findStep(name);
      if (slot) {
        slot.steps = [];
      }
    };

    PipelineProvider.prototype.reset = function reset() {
      this._clearSteps('authorize');
      this._clearSteps('preActivate');
      this._clearSteps('preRender');
      this._clearSteps('postRender');
    };

    PipelineProvider.prototype._createPipelineSlot = function _createPipelineSlot(name, alias) {
      return new PipelineSlot(this.container, name, alias);
    };

    return PipelineProvider;
  }();

  var logger = LogManager.getLogger('app-router');

  var AppRouter = exports.AppRouter = function (_Router) {
    _inherits(AppRouter, _Router);

    AppRouter.inject = function inject() {
      return [_aureliaDependencyInjection.Container, _aureliaHistory.History, PipelineProvider, _aureliaEventAggregator.EventAggregator];
    };

    function AppRouter(container, history, pipelineProvider, events) {
      

      var _this10 = _possibleConstructorReturn(this, _Router.call(this, container, history));

      _this10.pipelineProvider = pipelineProvider;
      _this10.events = events;
      return _this10;
    }

    AppRouter.prototype.reset = function reset() {
      _Router.prototype.reset.call(this);
      this.maxInstructionCount = 10;
      if (!this._queue) {
        this._queue = [];
      } else {
        this._queue.length = 0;
      }
    };

    AppRouter.prototype.loadUrl = function loadUrl(url) {
      var _this11 = this;

      return this._createNavigationInstruction(url).then(function (instruction) {
        return _this11._queueInstruction(instruction);
      }).catch(function (error) {
        logger.error(error);
        restorePreviousLocation(_this11);
      });
    };

    AppRouter.prototype.registerViewPort = function registerViewPort(viewPort, name) {
      var _this12 = this;

      _Router.prototype.registerViewPort.call(this, viewPort, name);

      if (!this.isActive) {
        var viewModel = this._findViewModel(viewPort);
        if ('configureRouter' in viewModel) {
          if (!this.isConfigured) {
            var resolveConfiguredPromise = this._resolveConfiguredPromise;
            this._resolveConfiguredPromise = function () {};
            return this.configure(function (config) {
              return viewModel.configureRouter(config, _this12);
            }).then(function () {
              _this12.activate();
              resolveConfiguredPromise();
            });
          }
        } else {
          this.activate();
        }
      } else {
        this._dequeueInstruction();
      }

      return Promise.resolve();
    };

    AppRouter.prototype.activate = function activate(options) {
      if (this.isActive) {
        return;
      }

      this.isActive = true;
      this.options = Object.assign({ routeHandler: this.loadUrl.bind(this) }, this.options, options);
      this.history.activate(this.options);
      this._dequeueInstruction();
    };

    AppRouter.prototype.deactivate = function deactivate() {
      this.isActive = false;
      this.history.deactivate();
    };

    AppRouter.prototype._queueInstruction = function _queueInstruction(instruction) {
      var _this13 = this;

      return new Promise(function (resolve) {
        instruction.resolve = resolve;
        _this13._queue.unshift(instruction);
        _this13._dequeueInstruction();
      });
    };

    AppRouter.prototype._dequeueInstruction = function _dequeueInstruction() {
      var _this14 = this;

      var instructionCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      return Promise.resolve().then(function () {
        if (_this14.isNavigating && !instructionCount) {
          return undefined;
        }

        var instruction = _this14._queue.shift();
        _this14._queue.length = 0;

        if (!instruction) {
          return undefined;
        }

        _this14.isNavigating = true;

        var navtracker = _this14.history.getState('NavigationTracker');
        if (!navtracker && !_this14.currentNavigationTracker) {
          _this14.isNavigatingFirst = true;
          _this14.isNavigatingNew = true;
        } else if (!navtracker) {
          _this14.isNavigatingNew = true;
        } else if (!_this14.currentNavigationTracker) {
          _this14.isNavigatingRefresh = true;
        } else if (_this14.currentNavigationTracker < navtracker) {
          _this14.isNavigatingForward = true;
        } else if (_this14.currentNavigationTracker > navtracker) {
          _this14.isNavigatingBack = true;
        }if (!navtracker) {
          navtracker = Date.now();
          _this14.history.setState('NavigationTracker', navtracker);
        }
        _this14.currentNavigationTracker = navtracker;

        instruction.previousInstruction = _this14.currentInstruction;

        if (!instructionCount) {
          _this14.events.publish('router:navigation:processing', { instruction: instruction });
        } else if (instructionCount === _this14.maxInstructionCount - 1) {
          logger.error(instructionCount + 1 + ' navigation instructions have been attempted without success. Restoring last known good location.');
          restorePreviousLocation(_this14);
          return _this14._dequeueInstruction(instructionCount + 1);
        } else if (instructionCount > _this14.maxInstructionCount) {
          throw new Error('Maximum navigation attempts exceeded. Giving up.');
        }

        var pipeline = _this14.pipelineProvider.createPipeline(!_this14.couldDeactivate);

        return pipeline.run(instruction).then(function (result) {
          return processResult(instruction, result, instructionCount, _this14);
        }).catch(function (error) {
          return { output: error instanceof Error ? error : new Error(error) };
        }).then(function (result) {
          return resolveInstruction(instruction, result, !!instructionCount, _this14);
        });
      });
    };

    AppRouter.prototype._findViewModel = function _findViewModel(viewPort) {
      if (this.container.viewModel) {
        return this.container.viewModel;
      }

      if (viewPort.container) {
        var container = viewPort.container;

        while (container) {
          if (container.viewModel) {
            this.container.viewModel = container.viewModel;
            return container.viewModel;
          }

          container = container.parent;
        }
      }

      return undefined;
    };

    return AppRouter;
  }(Router);

  function processResult(instruction, result, instructionCount, router) {
    if (!(result && 'completed' in result && 'output' in result)) {
      result = result || {};
      result.output = new Error('Expected router pipeline to return a navigation result, but got [' + JSON.stringify(result) + '] instead.');
    }

    var finalResult = null;
    var navigationCommandResult = null;
    if (isNavigationCommand(result.output)) {
      navigationCommandResult = result.output.navigate(router);
    } else {
      finalResult = result;

      if (!result.completed) {
        if (result.output instanceof Error) {
          logger.error(result.output);
        }

        restorePreviousLocation(router);
      }
    }

    return Promise.resolve(navigationCommandResult).then(function (_) {
      return router._dequeueInstruction(instructionCount + 1);
    }).then(function (innerResult) {
      return finalResult || innerResult || result;
    });
  }

  function resolveInstruction(instruction, result, isInnerInstruction, router) {
    instruction.resolve(result);

    var eventArgs = { instruction: instruction, result: result };
    if (!isInnerInstruction) {
      router.isNavigating = false;
      router.isExplicitNavigation = false;
      router.isExplicitNavigationBack = false;
      router.isNavigatingFirst = false;
      router.isNavigatingNew = false;
      router.isNavigatingRefresh = false;
      router.isNavigatingForward = false;
      router.isNavigatingBack = false;
      router.couldDeactivate = false;

      var eventName = void 0;

      if (result.output instanceof Error) {
        eventName = 'error';
      } else if (!result.completed) {
        eventName = 'canceled';
      } else {
        var _queryString = instruction.queryString ? '?' + instruction.queryString : '';
        router.history.previousLocation = instruction.fragment + _queryString;
        eventName = 'success';
      }

      router.events.publish('router:navigation:' + eventName, eventArgs);
      router.events.publish('router:navigation:complete', eventArgs);
    } else {
      router.events.publish('router:navigation:child:complete', eventArgs);
    }

    return result;
  }

  function restorePreviousLocation(router) {
    var previousLocation = router.history.previousLocation;
    if (previousLocation) {
      router.navigate(router.history.previousLocation, { trigger: false, replace: true });
    } else if (router.fallbackRoute) {
      router.navigate(router.fallbackRoute, { trigger: true, replace: true });
    } else {
      logger.error('Router navigation failed, and no previous location or fallbackRoute could be restored.');
    }
  }
});
define('aurelia-route-recognizer',['exports', 'aurelia-path'], function (exports, _aureliaPath) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RouteRecognizer = exports.EpsilonSegment = exports.StarSegment = exports.DynamicSegment = exports.StaticSegment = exports.State = undefined;

  

  var State = exports.State = function () {
    function State(charSpec) {
      

      this.charSpec = charSpec;
      this.nextStates = [];
    }

    State.prototype.get = function get(charSpec) {
      for (var _iterator = this.nextStates, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var child = _ref;

        var isEqual = child.charSpec.validChars === charSpec.validChars && child.charSpec.invalidChars === charSpec.invalidChars;

        if (isEqual) {
          return child;
        }
      }

      return undefined;
    };

    State.prototype.put = function put(charSpec) {
      var state = this.get(charSpec);

      if (state) {
        return state;
      }

      state = new State(charSpec);

      this.nextStates.push(state);

      if (charSpec.repeat) {
        state.nextStates.push(state);
      }

      return state;
    };

    State.prototype.match = function match(ch) {
      var nextStates = this.nextStates;
      var results = [];

      for (var i = 0, l = nextStates.length; i < l; i++) {
        var child = nextStates[i];
        var charSpec = child.charSpec;

        if (charSpec.validChars !== undefined) {
          if (charSpec.validChars.indexOf(ch) !== -1) {
            results.push(child);
          }
        } else if (charSpec.invalidChars !== undefined) {
          if (charSpec.invalidChars.indexOf(ch) === -1) {
            results.push(child);
          }
        }
      }

      return results;
    };

    return State;
  }();

  var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];

  var escapeRegex = new RegExp('(\\' + specials.join('|\\') + ')', 'g');

  var StaticSegment = exports.StaticSegment = function () {
    function StaticSegment(string, caseSensitive) {
      

      this.string = string;
      this.caseSensitive = caseSensitive;
    }

    StaticSegment.prototype.eachChar = function eachChar(callback) {
      var s = this.string;
      for (var i = 0, ii = s.length; i < ii; ++i) {
        var ch = s[i];
        callback({ validChars: this.caseSensitive ? ch : ch.toUpperCase() + ch.toLowerCase() });
      }
    };

    StaticSegment.prototype.regex = function regex() {
      return this.string.replace(escapeRegex, '\\$1');
    };

    StaticSegment.prototype.generate = function generate() {
      return this.string;
    };

    return StaticSegment;
  }();

  var DynamicSegment = exports.DynamicSegment = function () {
    function DynamicSegment(name, optional) {
      

      this.name = name;
      this.optional = optional;
    }

    DynamicSegment.prototype.eachChar = function eachChar(callback) {
      callback({ invalidChars: '/', repeat: true });
    };

    DynamicSegment.prototype.regex = function regex() {
      return '([^/]+)';
    };

    DynamicSegment.prototype.generate = function generate(params, consumed) {
      consumed[this.name] = true;
      return params[this.name];
    };

    return DynamicSegment;
  }();

  var StarSegment = exports.StarSegment = function () {
    function StarSegment(name) {
      

      this.name = name;
    }

    StarSegment.prototype.eachChar = function eachChar(callback) {
      callback({ invalidChars: '', repeat: true });
    };

    StarSegment.prototype.regex = function regex() {
      return '(.+)';
    };

    StarSegment.prototype.generate = function generate(params, consumed) {
      consumed[this.name] = true;
      return params[this.name];
    };

    return StarSegment;
  }();

  var EpsilonSegment = exports.EpsilonSegment = function () {
    function EpsilonSegment() {
      
    }

    EpsilonSegment.prototype.eachChar = function eachChar() {};

    EpsilonSegment.prototype.regex = function regex() {
      return '';
    };

    EpsilonSegment.prototype.generate = function generate() {
      return '';
    };

    return EpsilonSegment;
  }();

  var RouteRecognizer = exports.RouteRecognizer = function () {
    function RouteRecognizer() {
      

      this.rootState = new State();
      this.names = {};
    }

    RouteRecognizer.prototype.add = function add(route) {
      var _this = this;

      if (Array.isArray(route)) {
        route.forEach(function (r) {
          return _this.add(r);
        });
        return undefined;
      }

      var currentState = this.rootState;
      var skippableStates = [];
      var regex = '^';
      var types = { statics: 0, dynamics: 0, stars: 0 };
      var names = [];
      var routeName = route.handler.name;
      var isEmpty = true;
      var segments = parse(route.path, names, types, route.caseSensitive);

      for (var i = 0, ii = segments.length; i < ii; i++) {
        var segment = segments[i];
        if (segment instanceof EpsilonSegment) {
          continue;
        }

        var _addSegment = addSegment(currentState, segment),
            firstState = _addSegment[0],
            nextState = _addSegment[1];

        for (var j = 0, jj = skippableStates.length; j < jj; j++) {
          skippableStates[j].nextStates.push(firstState);
        }

        if (segment.optional) {
          skippableStates.push(nextState);
          regex += '(?:/' + segment.regex() + ')?';
        } else {
          currentState = nextState;
          regex += '/' + segment.regex();
          skippableStates.length = 0;
          isEmpty = false;
        }
      }

      if (isEmpty) {
        currentState = currentState.put({ validChars: '/' });
        regex += '/?';
      }

      var handlers = [{ handler: route.handler, names: names }];

      if (routeName) {
        var routeNames = Array.isArray(routeName) ? routeName : [routeName];
        for (var _i2 = 0; _i2 < routeNames.length; _i2++) {
          this.names[routeNames[_i2]] = {
            segments: segments,
            handlers: handlers
          };
        }
      }

      for (var _i3 = 0; _i3 < skippableStates.length; _i3++) {
        var state = skippableStates[_i3];
        state.handlers = handlers;
        state.regex = new RegExp(regex + '$', route.caseSensitive ? '' : 'i');
        state.types = types;
      }

      currentState.handlers = handlers;
      currentState.regex = new RegExp(regex + '$', route.caseSensitive ? '' : 'i');
      currentState.types = types;

      return currentState;
    };

    RouteRecognizer.prototype.handlersFor = function handlersFor(name) {
      var route = this.names[name];
      if (!route) {
        throw new Error('There is no route named ' + name);
      }

      return [].concat(route.handlers);
    };

    RouteRecognizer.prototype.hasRoute = function hasRoute(name) {
      return !!this.names[name];
    };

    RouteRecognizer.prototype.generate = function generate(name, params) {
      var route = this.names[name];
      if (!route) {
        throw new Error('There is no route named ' + name);
      }

      var handler = route.handlers[0].handler;
      if (handler.generationUsesHref) {
        return handler.href;
      }

      var routeParams = Object.assign({}, params);
      var segments = route.segments;
      var consumed = {};
      var output = '';

      for (var i = 0, l = segments.length; i < l; i++) {
        var segment = segments[i];

        if (segment instanceof EpsilonSegment) {
          continue;
        }

        var segmentValue = segment.generate(routeParams, consumed);
        if (segmentValue === null || segmentValue === undefined) {
          if (!segment.optional) {
            throw new Error('A value is required for route parameter \'' + segment.name + '\' in route \'' + name + '\'.');
          }
        } else {
          output += '/';
          output += segmentValue;
        }
      }

      if (output.charAt(0) !== '/') {
        output = '/' + output;
      }

      for (var param in consumed) {
        delete routeParams[param];
      }

      var queryString = (0, _aureliaPath.buildQueryString)(routeParams);
      output += queryString ? '?' + queryString : '';

      return output;
    };

    RouteRecognizer.prototype.recognize = function recognize(path) {
      var states = [this.rootState];
      var queryParams = {};
      var isSlashDropped = false;
      var normalizedPath = path;

      var queryStart = normalizedPath.indexOf('?');
      if (queryStart !== -1) {
        var queryString = normalizedPath.substr(queryStart + 1, normalizedPath.length);
        normalizedPath = normalizedPath.substr(0, queryStart);
        queryParams = (0, _aureliaPath.parseQueryString)(queryString);
      }

      normalizedPath = decodeURI(normalizedPath);

      if (normalizedPath.charAt(0) !== '/') {
        normalizedPath = '/' + normalizedPath;
      }

      var pathLen = normalizedPath.length;
      if (pathLen > 1 && normalizedPath.charAt(pathLen - 1) === '/') {
        normalizedPath = normalizedPath.substr(0, pathLen - 1);
        isSlashDropped = true;
      }

      for (var i = 0, l = normalizedPath.length; i < l; i++) {
        states = recognizeChar(states, normalizedPath.charAt(i));
        if (!states.length) {
          break;
        }
      }

      var solutions = [];
      for (var _i4 = 0, _l = states.length; _i4 < _l; _i4++) {
        if (states[_i4].handlers) {
          solutions.push(states[_i4]);
        }
      }

      states = sortSolutions(solutions);

      var state = solutions[0];
      if (state && state.handlers) {
        if (isSlashDropped && state.regex.source.slice(-5) === '(.+)$') {
          normalizedPath = normalizedPath + '/';
        }

        return findHandler(state, normalizedPath, queryParams);
      }
    };

    return RouteRecognizer;
  }();

  var RecognizeResults = function RecognizeResults(queryParams) {
    

    this.splice = Array.prototype.splice;
    this.slice = Array.prototype.slice;
    this.push = Array.prototype.push;
    this.length = 0;
    this.queryParams = queryParams || {};
  };

  function parse(route, names, types, caseSensitive) {
    var normalizedRoute = route;
    if (route.charAt(0) === '/') {
      normalizedRoute = route.substr(1);
    }

    var results = [];

    var splitRoute = normalizedRoute.split('/');
    for (var i = 0, ii = splitRoute.length; i < ii; ++i) {
      var segment = splitRoute[i];

      var match = segment.match(/^:([^?]+)(\?)?$/);
      if (match) {
        var _match = match,
            _name = _match[1],
            optional = _match[2];

        if (_name.indexOf('=') !== -1) {
          throw new Error('Parameter ' + _name + ' in route ' + route + ' has a default value, which is not supported.');
        }
        results.push(new DynamicSegment(_name, !!optional));
        names.push(_name);
        types.dynamics++;
        continue;
      }

      match = segment.match(/^\*(.+)$/);
      if (match) {
        results.push(new StarSegment(match[1]));
        names.push(match[1]);
        types.stars++;
      } else if (segment === '') {
        results.push(new EpsilonSegment());
      } else {
        results.push(new StaticSegment(segment, caseSensitive));
        types.statics++;
      }
    }

    return results;
  }

  function sortSolutions(states) {
    return states.sort(function (a, b) {
      if (a.types.stars !== b.types.stars) {
        return a.types.stars - b.types.stars;
      }

      if (a.types.stars) {
        if (a.types.statics !== b.types.statics) {
          return b.types.statics - a.types.statics;
        }
        if (a.types.dynamics !== b.types.dynamics) {
          return b.types.dynamics - a.types.dynamics;
        }
      }

      if (a.types.dynamics !== b.types.dynamics) {
        return a.types.dynamics - b.types.dynamics;
      }

      if (a.types.statics !== b.types.statics) {
        return b.types.statics - a.types.statics;
      }

      return 0;
    });
  }

  function recognizeChar(states, ch) {
    var nextStates = [];

    for (var i = 0, l = states.length; i < l; i++) {
      var state = states[i];
      nextStates.push.apply(nextStates, state.match(ch));
    }

    return nextStates;
  }

  function findHandler(state, path, queryParams) {
    var handlers = state.handlers;
    var regex = state.regex;
    var captures = path.match(regex);
    var currentCapture = 1;
    var result = new RecognizeResults(queryParams);

    for (var i = 0, l = handlers.length; i < l; i++) {
      var _handler = handlers[i];
      var _names = _handler.names;
      var _params = {};

      for (var j = 0, m = _names.length; j < m; j++) {
        _params[_names[j]] = captures[currentCapture++];
      }

      result.push({ handler: _handler.handler, params: _params, isDynamic: !!_names.length });
    }

    return result;
  }

  function addSegment(currentState, segment) {
    var firstState = currentState.put({ validChars: '/' });
    var nextState = firstState;
    segment.eachChar(function (ch) {
      nextState = nextState.put(ch);
    });

    return [firstState, nextState];
  }
});
define('aurelia-history',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  function mi(name) {
    throw new Error('History must implement ' + name + '().');
  }

  var History = exports.History = function () {
    function History() {
      
    }

    History.prototype.activate = function activate(options) {
      mi('activate');
    };

    History.prototype.deactivate = function deactivate() {
      mi('deactivate');
    };

    History.prototype.getAbsoluteRoot = function getAbsoluteRoot() {
      mi('getAbsoluteRoot');
    };

    History.prototype.navigate = function navigate(fragment, options) {
      mi('navigate');
    };

    History.prototype.navigateBack = function navigateBack() {
      mi('navigateBack');
    };

    History.prototype.setTitle = function setTitle(title) {
      mi('setTitle');
    };

    History.prototype.setState = function setState(key, value) {
      mi('setState');
    };

    History.prototype.getState = function getState(key) {
      mi('getState');
    };

    return History;
  }();
});
define('aurelia-history-browser',['exports', 'aurelia-pal', 'aurelia-history'], function (exports, _aureliaPal, _aureliaHistory) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BrowserHistory = exports.DefaultLinkHandler = exports.LinkHandler = undefined;
  exports.configure = configure;

  var _class, _temp;

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  

  var LinkHandler = exports.LinkHandler = function () {
    function LinkHandler() {
      
    }

    LinkHandler.prototype.activate = function activate(history) {};

    LinkHandler.prototype.deactivate = function deactivate() {};

    return LinkHandler;
  }();

  var DefaultLinkHandler = exports.DefaultLinkHandler = function (_LinkHandler) {
    _inherits(DefaultLinkHandler, _LinkHandler);

    function DefaultLinkHandler() {
      

      var _this = _possibleConstructorReturn(this, _LinkHandler.call(this));

      _this.handler = function (e) {
        var _DefaultLinkHandler$g = DefaultLinkHandler.getEventInfo(e),
            shouldHandleEvent = _DefaultLinkHandler$g.shouldHandleEvent,
            href = _DefaultLinkHandler$g.href;

        if (shouldHandleEvent) {
          e.preventDefault();
          _this.history.navigate(href);
        }
      };
      return _this;
    }

    DefaultLinkHandler.prototype.activate = function activate(history) {
      if (history._hasPushState) {
        this.history = history;
        _aureliaPal.DOM.addEventListener('click', this.handler, true);
      }
    };

    DefaultLinkHandler.prototype.deactivate = function deactivate() {
      _aureliaPal.DOM.removeEventListener('click', this.handler);
    };

    DefaultLinkHandler.getEventInfo = function getEventInfo(event) {
      var info = {
        shouldHandleEvent: false,
        href: null,
        anchor: null
      };

      var target = DefaultLinkHandler.findClosestAnchor(event.target);
      if (!target || !DefaultLinkHandler.targetIsThisWindow(target)) {
        return info;
      }

      if (target.hasAttribute('download') || target.hasAttribute('router-ignore')) {
        return info;
      }

      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return info;
      }

      var href = target.getAttribute('href');
      info.anchor = target;
      info.href = href;

      var leftButtonClicked = event.which === 1;
      var isRelative = href && !(href.charAt(0) === '#' || /^[a-z]+:/i.test(href));

      info.shouldHandleEvent = leftButtonClicked && isRelative;
      return info;
    };

    DefaultLinkHandler.findClosestAnchor = function findClosestAnchor(el) {
      while (el) {
        if (el.tagName === 'A') {
          return el;
        }

        el = el.parentNode;
      }
    };

    DefaultLinkHandler.targetIsThisWindow = function targetIsThisWindow(target) {
      var targetWindow = target.getAttribute('target');
      var win = _aureliaPal.PLATFORM.global;

      return !targetWindow || targetWindow === win.name || targetWindow === '_self';
    };

    return DefaultLinkHandler;
  }(LinkHandler);

  function configure(config) {
    config.singleton(_aureliaHistory.History, BrowserHistory);
    config.transient(LinkHandler, DefaultLinkHandler);
  }

  var BrowserHistory = exports.BrowserHistory = (_temp = _class = function (_History) {
    _inherits(BrowserHistory, _History);

    function BrowserHistory(linkHandler) {
      

      var _this2 = _possibleConstructorReturn(this, _History.call(this));

      _this2._isActive = false;
      _this2._checkUrlCallback = _this2._checkUrl.bind(_this2);

      _this2.location = _aureliaPal.PLATFORM.location;
      _this2.history = _aureliaPal.PLATFORM.history;
      _this2.linkHandler = linkHandler;
      return _this2;
    }

    BrowserHistory.prototype.activate = function activate(options) {
      if (this._isActive) {
        throw new Error('History has already been activated.');
      }

      var wantsPushState = !!options.pushState;

      this._isActive = true;
      this.options = Object.assign({}, { root: '/' }, this.options, options);

      this.root = ('/' + this.options.root + '/').replace(rootStripper, '/');

      this._wantsHashChange = this.options.hashChange !== false;
      this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);

      var eventName = void 0;
      if (this._hasPushState) {
        eventName = 'popstate';
      } else if (this._wantsHashChange) {
        eventName = 'hashchange';
      }

      _aureliaPal.PLATFORM.addEventListener(eventName, this._checkUrlCallback);

      if (this._wantsHashChange && wantsPushState) {
        var loc = this.location;
        var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

        if (!this._hasPushState && !atRoot) {
          this.fragment = this._getFragment(null, true);
          this.location.replace(this.root + this.location.search + '#' + this.fragment);

          return true;
        } else if (this._hasPushState && atRoot && loc.hash) {
          this.fragment = this._getHash().replace(routeStripper, '');
          this.history.replaceState({}, _aureliaPal.DOM.title, this.root + this.fragment + loc.search);
        }
      }

      if (!this.fragment) {
        this.fragment = this._getFragment();
      }

      this.linkHandler.activate(this);

      if (!this.options.silent) {
        return this._loadUrl();
      }
    };

    BrowserHistory.prototype.deactivate = function deactivate() {
      _aureliaPal.PLATFORM.removeEventListener('popstate', this._checkUrlCallback);
      _aureliaPal.PLATFORM.removeEventListener('hashchange', this._checkUrlCallback);
      this._isActive = false;
      this.linkHandler.deactivate();
    };

    BrowserHistory.prototype.getAbsoluteRoot = function getAbsoluteRoot() {
      var origin = createOrigin(this.location.protocol, this.location.hostname, this.location.port);
      return '' + origin + this.root;
    };

    BrowserHistory.prototype.navigate = function navigate(fragment) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$trigger = _ref.trigger,
          trigger = _ref$trigger === undefined ? true : _ref$trigger,
          _ref$replace = _ref.replace,
          replace = _ref$replace === undefined ? false : _ref$replace;

      if (fragment && absoluteUrl.test(fragment)) {
        this.location.href = fragment;
        return true;
      }

      if (!this._isActive) {
        return false;
      }

      fragment = this._getFragment(fragment || '');

      if (this.fragment === fragment && !replace) {
        return false;
      }

      this.fragment = fragment;

      var url = this.root + fragment;

      if (fragment === '' && url !== '/') {
        url = url.slice(0, -1);
      }

      if (this._hasPushState) {
        url = url.replace('//', '/');
        this.history[replace ? 'replaceState' : 'pushState']({}, _aureliaPal.DOM.title, url);
      } else if (this._wantsHashChange) {
        updateHash(this.location, fragment, replace);
      } else {
        this.location.assign(url);
      }

      if (trigger) {
        return this._loadUrl(fragment);
      }

      return true;
    };

    BrowserHistory.prototype.navigateBack = function navigateBack() {
      this.history.back();
    };

    BrowserHistory.prototype.setTitle = function setTitle(title) {
      _aureliaPal.DOM.title = title;
    };

    BrowserHistory.prototype.setState = function setState(key, value) {
      var state = Object.assign({}, this.history.state);
      var _location = this.location,
          pathname = _location.pathname,
          search = _location.search,
          hash = _location.hash;

      state[key] = value;
      this.history.replaceState(state, null, '' + pathname + search + hash);
    };

    BrowserHistory.prototype.getState = function getState(key) {
      var state = Object.assign({}, this.history.state);
      return state[key];
    };

    BrowserHistory.prototype._getHash = function _getHash() {
      return this.location.hash.substr(1);
    };

    BrowserHistory.prototype._getFragment = function _getFragment(fragment, forcePushState) {
      var root = void 0;

      if (!fragment) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = this.location.pathname + this.location.search;
          root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) {
            fragment = fragment.substr(root.length);
          }
        } else {
          fragment = this._getHash();
        }
      }

      return '/' + fragment.replace(routeStripper, '');
    };

    BrowserHistory.prototype._checkUrl = function _checkUrl() {
      var current = this._getFragment();
      if (current !== this.fragment) {
        this._loadUrl();
      }
    };

    BrowserHistory.prototype._loadUrl = function _loadUrl(fragmentOverride) {
      var fragment = this.fragment = this._getFragment(fragmentOverride);

      return this.options.routeHandler ? this.options.routeHandler(fragment) : false;
    };

    return BrowserHistory;
  }(_aureliaHistory.History), _class.inject = [LinkHandler], _temp);

  var routeStripper = /^#?\/*|\s+$/g;

  var rootStripper = /^\/+|\/+$/g;

  var trailingSlash = /\/$/;

  var absoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;

  function updateHash(location, fragment, replace) {
    if (replace) {
      var _href = location.href.replace(/(javascript:|#).*$/, '');
      location.replace(_href + '#' + fragment);
    } else {
      location.hash = '#' + fragment;
    }
  }

  function createOrigin(protocol, hostname, port) {
    return protocol + '//' + hostname + (port ? ':' + port : '');
  }
});