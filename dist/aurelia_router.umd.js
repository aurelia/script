(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.au = {}));
}(this, function (exports) { 'use strict';

  function AggregateError(message, innerError, skipIfAlreadyAggregate) {
    if (innerError) {
      if (innerError.innerError && skipIfAlreadyAggregate) {
        return innerError;
      }

      const separator = '\n------------------------------------------------\n';

      message += `${separator}Inner Error:\n`;

      if (typeof innerError === 'string') {
        message += `Message: ${innerError}`;
      } else {
        if (innerError.message) {
          message += `Message: ${innerError.message}`;
        } else {
          message += `Unknown Inner Error Type. Displaying Inner Error as JSON:\n ${JSON.stringify(innerError, null, '  ')}`;
        }

        if (innerError.stack) {
          message += `\nInner Error Stack:\n${innerError.stack}`;
          message += '\nEnd Inner Error Stack';
        }
      }

      message += separator;
    }

    let e = new Error(message);
    if (innerError) {
      e.innerError = innerError;
    }

    return e;
  }

  const FEATURE = {};

  const PLATFORM = {
    noop() {},
    eachModule() {},
    moduleName(moduleName) {
      return moduleName;
    }
  };

  PLATFORM.global = function () {
    if (typeof self !== 'undefined') {
      return self;
    }

    if (typeof global !== 'undefined') {
      return global;
    }

    return new Function('return this')();
  }();

  const DOM = {};
  exports.isInitialized = false;

  function initializePAL(callback) {
    if (exports.isInitialized) {
      return;
    }
    exports.isInitialized = true;
    if (typeof Object.getPropertyDescriptor !== 'function') {
      Object.getPropertyDescriptor = function (subject, name) {
        let pd = Object.getOwnPropertyDescriptor(subject, name);
        let proto = Object.getPrototypeOf(subject);
        while (typeof pd === 'undefined' && proto !== null) {
          pd = Object.getOwnPropertyDescriptor(proto, name);
          proto = Object.getPrototypeOf(proto);
        }
        return pd;
      };
    }

    callback(PLATFORM, FEATURE, DOM);
  }
  function reset() {
    exports.isInitialized = false;
  }

  if (!String.prototype.endsWith || function () {
    try {
      return !"ab".endsWith("a", 1);
    } catch (e) {
      return true;
    }
  }()) {
    String.prototype.endsWith = function (searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    };
  }

  if (!String.prototype.startsWith || function () {
    try {
      return !"ab".startsWith("b", 1);
    } catch (e) {
      return true;
    }
  }()) {
    String.prototype.startsWith = function (searchString, position) {
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
    };
  }

  {

    var emptyMetadata = Object.freeze({});
    var metadataContainerKey = '__metadata__';

    if (typeof Reflect.getOwnMetadata !== 'function') {
      Reflect.getOwnMetadata = function (metadataKey, target, targetKey) {
        if (target.hasOwnProperty(metadataContainerKey)) {
          return (target[metadataContainerKey][targetKey] || emptyMetadata)[metadataKey];
        }
      };
    }

    if (typeof Reflect.defineMetadata !== 'function') {
      Reflect.defineMetadata = function (metadataKey, metadataValue, target, targetKey) {
        var metadataContainer = target.hasOwnProperty(metadataContainerKey) ? target[metadataContainerKey] : target[metadataContainerKey] = {};
        var targetContainer = metadataContainer[targetKey] || (metadataContainer[targetKey] = {});
        targetContainer[metadataKey] = metadataValue;
      };
    }

    if (typeof Reflect.metadata !== 'function') {
      Reflect.metadata = function (metadataKey, metadataValue) {
        return function (target, targetKey) {
          Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
        };
      };
    }
  }

  const _PLATFORM = {
    location: window.location,
    history: window.history,
    addEventListener(eventName, callback, capture) {
      this.global.addEventListener(eventName, callback, capture);
    },
    removeEventListener(eventName, callback, capture) {
      this.global.removeEventListener(eventName, callback, capture);
    },
    performance: window.performance,
    requestAnimationFrame(callback) {
      return this.global.requestAnimationFrame(callback);
    }
  };

  if (Element && !Element.prototype.matches) {
    let proto = Element.prototype;
    proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
  }

  const _FEATURE = {
    shadowDOM: !!HTMLElement.prototype.attachShadow,
    scopedCSS: 'scoped' in document.createElement('style'),
    htmlTemplateElement: function () {
      let d = document.createElement('div');
      d.innerHTML = '<template></template>';
      return 'content' in d.children[0];
    }(),
    mutationObserver: !!(window.MutationObserver || window.WebKitMutationObserver),
    ensureHTMLTemplateElement: t => t
  };

  let shadowPoly = window.ShadowDOMPolyfill || null;

  const _DOM = {
    Element: Element,
    NodeList: NodeList,
    SVGElement: SVGElement,
    boundary: 'aurelia-dom-boundary',
    addEventListener(eventName, callback, capture) {
      document.addEventListener(eventName, callback, capture);
    },
    removeEventListener(eventName, callback, capture) {
      document.removeEventListener(eventName, callback, capture);
    },
    adoptNode(node) {
      return document.adoptNode(node);
    },
    createAttribute(name) {
      return document.createAttribute(name);
    },
    createElement(tagName) {
      return document.createElement(tagName);
    },
    createTextNode(text) {
      return document.createTextNode(text);
    },
    createComment(text) {
      return document.createComment(text);
    },
    createDocumentFragment() {
      return document.createDocumentFragment();
    },
    createTemplateElement() {
      let template = document.createElement('template');
      return _FEATURE.ensureHTMLTemplateElement(template);
    },
    createMutationObserver(callback) {
      return new (window.MutationObserver || window.WebKitMutationObserver)(callback);
    },
    createCustomEvent(eventType, options) {
      return new window.CustomEvent(eventType, options);
    },
    dispatchEvent(evt) {
      document.dispatchEvent(evt);
    },
    getComputedStyle(element) {
      return window.getComputedStyle(element);
    },
    getElementById(id) {
      return document.getElementById(id);
    },
    querySelector(query) {
      return document.querySelector(query);
    },
    querySelectorAll(query) {
      return document.querySelectorAll(query);
    },
    nextElementSibling(element) {
      if (element.nextElementSibling) {
        return element.nextElementSibling;
      }
      do {
        element = element.nextSibling;
      } while (element && element.nodeType !== 1);
      return element;
    },
    createTemplateFromMarkup(markup) {
      let parser = document.createElement('div');
      parser.innerHTML = markup;

      let temp = parser.firstElementChild;
      if (!temp || temp.nodeName !== 'TEMPLATE') {
        throw new Error('Template markup must be wrapped in a <template> element e.g. <template> <!-- markup here --> </template>');
      }

      return _FEATURE.ensureHTMLTemplateElement(temp);
    },
    appendNode(newNode, parentNode) {
      (parentNode || document.body).appendChild(newNode);
    },
    replaceNode(newNode, node, parentNode) {
      if (node.parentNode) {
        node.parentNode.replaceChild(newNode, node);
      } else if (shadowPoly !== null) {
        shadowPoly.unwrap(parentNode).replaceChild(shadowPoly.unwrap(newNode), shadowPoly.unwrap(node));
      } else {
        parentNode.replaceChild(newNode, node);
      }
    },
    removeNode(node, parentNode) {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      } else if (parentNode) {
        if (shadowPoly !== null) {
          shadowPoly.unwrap(parentNode).removeChild(shadowPoly.unwrap(node));
        } else {
          parentNode.removeChild(node);
        }
      }
    },
    injectStyles(styles, destination, prepend, id) {
      if (id) {
        let oldStyle = document.getElementById(id);
        if (oldStyle) {
          let isStyleTag = oldStyle.tagName.toLowerCase() === 'style';

          if (isStyleTag) {
            oldStyle.innerHTML = styles;
            return;
          }

          throw new Error('The provided id does not indicate a style tag.');
        }
      }

      let node = document.createElement('style');
      node.innerHTML = styles;
      node.type = 'text/css';

      if (id) {
        node.id = id;
      }

      destination = destination || document.head;

      if (prepend && destination.childNodes.length > 0) {
        destination.insertBefore(node, destination.childNodes[0]);
      } else {
        destination.appendChild(node);
      }

      return node;
    }
  };

  function initialize() {
    if (exports.isInitialized) {
      return;
    }

    initializePAL((platform, feature, dom) => {
      Object.assign(platform, _PLATFORM);
      Object.assign(feature, _FEATURE);
      Object.assign(dom, _DOM);

      Object.defineProperty(dom, 'title', {
        get: () => document.title,
        set: value => {
          document.title = value;
        }
      });

      Object.defineProperty(dom, 'activeElement', {
        get: () => document.activeElement
      });

      Object.defineProperty(platform, 'XMLHttpRequest', {
        get: () => platform.global.XMLHttpRequest
      });
    });
  }

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  function isObject(val) {
    return val && (typeof val === 'function' || typeof val === 'object');
  }

  const metadata = {
    resource: 'aurelia:resource',
    paramTypes: 'design:paramtypes',
    propertyType: 'design:type',
    properties: 'design:properties',
    get(metadataKey, target, targetKey) {
      if (!isObject(target)) {
        return undefined;
      }
      let result = metadata.getOwn(metadataKey, target, targetKey);
      return result === undefined ? metadata.get(metadataKey, Object.getPrototypeOf(target), targetKey) : result;
    },
    getOwn(metadataKey, target, targetKey) {
      if (!isObject(target)) {
        return undefined;
      }
      return Reflect.getOwnMetadata(metadataKey, target, targetKey);
    },
    define(metadataKey, metadataValue, target, targetKey) {
      Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
    },
    getOrCreateOwn(metadataKey, Type, target, targetKey) {
      let result = metadata.getOwn(metadataKey, target, targetKey);

      if (result === undefined) {
        result = new Type();
        Reflect.defineMetadata(metadataKey, result, target, targetKey);
      }

      return result;
    }
  };

  const originStorage = new Map();
  const unknownOrigin = Object.freeze({ moduleId: undefined, moduleMember: undefined });

  let Origin = class Origin {
    constructor(moduleId, moduleMember) {
      this.moduleId = moduleId;
      this.moduleMember = moduleMember;
    }

    static get(fn) {
      let origin = originStorage.get(fn);

      if (origin === undefined) {
        PLATFORM.eachModule((key, value) => {
          if (typeof value === 'object') {
            for (let name in value) {
              try {
                let exp = value[name];
                if (exp === fn) {
                  originStorage.set(fn, origin = new Origin(key, name));
                  return true;
                }
              } catch (e) {}
            }
          }

          if (value === fn) {
            originStorage.set(fn, origin = new Origin(key, 'default'));
            return true;
          }

          return false;
        });
      }

      return origin || unknownOrigin;
    }

    static set(fn, origin) {
      originStorage.set(fn, origin);
    }
  };

  function decorators(...rest) {
    let applicator = function (target, key, descriptor) {
      let i = rest.length;

      if (key) {
        descriptor = descriptor || {
          value: target[key],
          writable: true,
          configurable: true,
          enumerable: true
        };

        while (i--) {
          descriptor = rest[i](target, key, descriptor) || descriptor;
        }

        Object.defineProperty(target, key, descriptor);
      } else {
        while (i--) {
          target = rest[i](target) || target;
        }
      }

      return target;
    };

    applicator.on = applicator;
    return applicator;
  }

  function deprecated(optionsOrTarget, maybeKey, maybeDescriptor) {
    function decorator(target, key, descriptor) {
      const methodSignature = `${target.constructor.name}#${key}`;
      let options = maybeKey ? {} : optionsOrTarget || {};
      let message = `DEPRECATION - ${methodSignature}`;

      if (typeof descriptor.value !== 'function') {
        throw new SyntaxError('Only methods can be marked as deprecated.');
      }

      if (options.message) {
        message += ` - ${options.message}`;
      }

      return _extends({}, descriptor, {
        value: function deprecationWrapper() {
          if (options.error) {
            throw new Error(message);
          } else {
            console.warn(message);
          }

          return descriptor.value.apply(this, arguments);
        }
      });
    }

    return maybeKey ? decorator(optionsOrTarget, maybeKey, maybeDescriptor) : decorator;
  }

  function mixin(behavior) {
    const instanceKeys = Object.keys(behavior);

    function _mixin(possible) {
      let decorator = function (target) {
        let resolvedTarget = typeof target === 'function' ? target.prototype : target;

        let i = instanceKeys.length;
        while (i--) {
          let property = instanceKeys[i];
          Object.defineProperty(resolvedTarget, property, {
            value: behavior[property],
            writable: true
          });
        }
      };

      return possible ? decorator(possible) : decorator;
    }

    return _mixin;
  }

  function alwaysValid() {
    return true;
  }
  function noCompose() {}

  function ensureProtocolOptions(options) {
    if (options === undefined) {
      options = {};
    } else if (typeof options === 'function') {
      options = {
        validate: options
      };
    }

    if (!options.validate) {
      options.validate = alwaysValid;
    }

    if (!options.compose) {
      options.compose = noCompose;
    }

    return options;
  }

  function createProtocolValidator(validate) {
    return function (target) {
      let result = validate(target);
      return result === true;
    };
  }

  function createProtocolAsserter(name, validate) {
    return function (target) {
      let result = validate(target);
      if (result !== true) {
        throw new Error(result || `${name} was not correctly implemented.`);
      }
    };
  }

  function protocol(name, options) {
    options = ensureProtocolOptions(options);

    let result = function (target) {
      let resolvedTarget = typeof target === 'function' ? target.prototype : target;

      options.compose(resolvedTarget);
      result.assert(resolvedTarget);

      Object.defineProperty(resolvedTarget, 'protocol:' + name, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: true
      });
    };

    result.validate = createProtocolValidator(options.validate);
    result.assert = createProtocolAsserter(name, options.validate);

    return result;
  }

  protocol.create = function (name, options) {
    options = ensureProtocolOptions(options);
    let hidden = 'protocol:' + name;
    let result = function (target) {
      let decorator = protocol(name, options);
      return target ? decorator(target) : decorator;
    };

    result.decorates = function (obj) {
      return obj[hidden] === true;
    };
    result.validate = createProtocolValidator(options.validate);
    result.assert = createProtocolAsserter(name, options.validate);

    return result;
  };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  function trimDots(ary) {
    for (var i = 0; i < ary.length; ++i) {
      var part = ary[i];
      if (part === '.') {
        ary.splice(i, 1);
        i -= 1;
      } else if (part === '..') {
        if (i === 0 || i === 1 && ary[2] === '..' || ary[i - 1] === '..') {
          continue;
        } else if (i > 0) {
          ary.splice(i - 1, 2);
          i -= 2;
        }
      }
    }
  }

  function relativeToFile(name, file) {
    var fileParts = file && file.split('/');
    var nameParts = name.trim().split('/');

    if (nameParts[0].charAt(0) === '.' && fileParts) {
      var normalizedBaseParts = fileParts.slice(0, fileParts.length - 1);
      nameParts.unshift.apply(nameParts, normalizedBaseParts);
    }

    trimDots(nameParts);

    return nameParts.join('/');
  }

  function join(path1, path2) {
    if (!path1) {
      return path2;
    }

    if (!path2) {
      return path1;
    }

    var schemeMatch = path1.match(/^([^/]*?:)\//);
    var scheme = schemeMatch && schemeMatch.length > 0 ? schemeMatch[1] : '';
    path1 = path1.substr(scheme.length);

    var urlPrefix = void 0;
    if (path1.indexOf('///') === 0 && scheme === 'file:') {
      urlPrefix = '///';
    } else if (path1.indexOf('//') === 0) {
      urlPrefix = '//';
    } else if (path1.indexOf('/') === 0) {
      urlPrefix = '/';
    } else {
      urlPrefix = '';
    }

    var trailingSlash = path2.slice(-1) === '/' ? '/' : '';

    var url1 = path1.split('/');
    var url2 = path2.split('/');
    var url3 = [];

    for (var i = 0, ii = url1.length; i < ii; ++i) {
      if (url1[i] === '..') {
        url3.pop();
      } else if (url1[i] === '.' || url1[i] === '') {
        continue;
      } else {
        url3.push(url1[i]);
      }
    }

    for (var _i = 0, _ii = url2.length; _i < _ii; ++_i) {
      if (url2[_i] === '..') {
        url3.pop();
      } else if (url2[_i] === '.' || url2[_i] === '') {
        continue;
      } else {
        url3.push(url2[_i]);
      }
    }

    return scheme + urlPrefix + url3.join('/') + trailingSlash;
  }

  var encode = encodeURIComponent;
  var encodeKey = function encodeKey(k) {
    return encode(k).replace('%24', '$');
  };

  function buildParam(key, value, traditional) {
    var result = [];
    if (value === null || value === undefined) {
      return result;
    }
    if (Array.isArray(value)) {
      for (var i = 0, l = value.length; i < l; i++) {
        if (traditional) {
          result.push(encodeKey(key) + '=' + encode(value[i]));
        } else {
          var arrayKey = key + '[' + (_typeof(value[i]) === 'object' && value[i] !== null ? i : '') + ']';
          result = result.concat(buildParam(arrayKey, value[i]));
        }
      }
    } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !traditional) {
      for (var propertyName in value) {
        result = result.concat(buildParam(key + '[' + propertyName + ']', value[propertyName]));
      }
    } else {
      result.push(encodeKey(key) + '=' + encode(value));
    }
    return result;
  }

  function buildQueryString(params, traditional) {
    var pairs = [];
    var keys = Object.keys(params || {}).sort();
    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i];
      pairs = pairs.concat(buildParam(key, params[key], traditional));
    }

    if (pairs.length === 0) {
      return '';
    }

    return pairs.join('&');
  }

  function processScalarParam(existedParam, value) {
    if (Array.isArray(existedParam)) {
      existedParam.push(value);
      return existedParam;
    }
    if (existedParam !== undefined) {
      return [existedParam, value];
    }

    return value;
  }

  function parseComplexParam(queryParams, keys, value) {
    var currentParams = queryParams;
    var keysLastIndex = keys.length - 1;
    for (var j = 0; j <= keysLastIndex; j++) {
      var key = keys[j] === '' ? currentParams.length : keys[j];
      if (j < keysLastIndex) {
        var prevValue = !currentParams[key] || _typeof(currentParams[key]) === 'object' ? currentParams[key] : [currentParams[key]];
        currentParams = currentParams[key] = prevValue || (isNaN(keys[j + 1]) ? {} : []);
      } else {
        currentParams = currentParams[key] = value;
      }
    }
  }

  function parseQueryString(queryString) {
    var queryParams = {};
    if (!queryString || typeof queryString !== 'string') {
      return queryParams;
    }

    var query = queryString;
    if (query.charAt(0) === '?') {
      query = query.substr(1);
    }

    var pairs = query.replace(/\+/g, ' ').split('&');
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      var key = decodeURIComponent(pair[0]);
      if (!key) {
        continue;
      }

      var keys = key.split('][');
      var keysLastIndex = keys.length - 1;

      if (/\[/.test(keys[0]) && /\]$/.test(keys[keysLastIndex])) {
        keys[keysLastIndex] = keys[keysLastIndex].replace(/\]$/, '');
        keys = keys.shift().split('[').concat(keys);
        keysLastIndex = keys.length - 1;
      } else {
        keysLastIndex = 0;
      }

      if (pair.length >= 2) {
        var value = pair[1] ? decodeURIComponent(pair[1]) : '';
        if (keysLastIndex) {
          parseComplexParam(queryParams, keys, value);
        } else {
          queryParams[key] = processScalarParam(queryParams[key], value);
        }
      } else {
        queryParams[key] = true;
      }
    }
    return queryParams;
  }

  let TemplateDependency = class TemplateDependency {
    constructor(src, name) {
      this.src = src;
      this.name = name;
    }
  };

  let TemplateRegistryEntry = class TemplateRegistryEntry {
    constructor(address) {
      this.templateIsLoaded = false;
      this.factoryIsReady = false;
      this.resources = null;
      this.dependencies = null;

      this.address = address;
      this.onReady = null;
      this._template = null;
      this._factory = null;
    }

    get template() {
      return this._template;
    }

    set template(value) {
      let address = this.address;
      let requires;
      let current;
      let src;
      let dependencies;

      this._template = value;
      this.templateIsLoaded = true;

      requires = value.content.querySelectorAll('require');
      dependencies = this.dependencies = new Array(requires.length);

      for (let i = 0, ii = requires.length; i < ii; ++i) {
        current = requires[i];
        src = current.getAttribute('from');

        if (!src) {
          throw new Error(`<require> element in ${address} has no "from" attribute.`);
        }

        dependencies[i] = new TemplateDependency(relativeToFile(src, address), current.getAttribute('as'));

        if (current.parentNode) {
          current.parentNode.removeChild(current);
        }
      }
    }

    get factory() {
      return this._factory;
    }

    set factory(value) {
      this._factory = value;
      this.factoryIsReady = true;
    }

    addDependency(src, name) {
      let finalSrc = typeof src === 'string' ? relativeToFile(src, this.address) : Origin.get(src).moduleId;

      this.dependencies.push(new TemplateDependency(finalSrc, name));
    }
  };

  let Loader = class Loader {
    constructor() {
      this.templateRegistry = {};
    }

    map(id, source) {
      throw new Error('Loaders must implement map(id, source).');
    }

    normalizeSync(moduleId, relativeTo) {
      throw new Error('Loaders must implement normalizeSync(moduleId, relativeTo).');
    }

    normalize(moduleId, relativeTo) {
      throw new Error('Loaders must implement normalize(moduleId: string, relativeTo: string): Promise<string>.');
    }

    loadModule(id) {
      throw new Error('Loaders must implement loadModule(id).');
    }

    loadAllModules(ids) {
      throw new Error('Loader must implement loadAllModules(ids).');
    }

    loadTemplate(url) {
      throw new Error('Loader must implement loadTemplate(url).');
    }

    loadText(url) {
      throw new Error('Loader must implement loadText(url).');
    }

    applyPluginToUrl(url, pluginName) {
      throw new Error('Loader must implement applyPluginToUrl(url, pluginName).');
    }

    addPlugin(pluginName, implementation) {
      throw new Error('Loader must implement addPlugin(pluginName, implementation).');
    }

    getOrCreateTemplateRegistryEntry(address) {
      return this.templateRegistry[address] || (this.templateRegistry[address] = new TemplateRegistryEntry(address));
    }
  };

  /**
  * An implementation of the TemplateLoader interface implemented with text-based loading.
  */
  class TextTemplateLoader {
      /**
      * Loads a template.
      * @param loader The loader that is requesting the template load.
      * @param entry The TemplateRegistryEntry to load and populate with a template.
      * @return A promise which resolves when the TemplateRegistryEntry is loaded with a template.
      */
      async loadTemplate(loader, entry) {
          const text = await loader.loadText(entry.address);
          entry.template = DOM.createTemplateFromMarkup(text);
      }
  }
  function ensureOriginOnExports(moduleExports, moduleId) {
      let target = moduleExports;
      let key;
      let exportedValue;
      // Mark the module with Origin
      // for view mapping from loader
      Origin.set(target, new Origin(moduleId, ''));
      if (typeof target === 'object') {
          for (key in target) {
              exportedValue = target[key];
              if (typeof exportedValue === 'function') {
                  Origin.set(exportedValue, new Origin(moduleId, key));
              }
          }
      }
      return moduleExports;
  }
  /**
  * A default implementation of the Loader abstraction which works with webpack (extended common-js style).
  */
  class EsmLoader extends Loader {
      constructor() {
          super();
          this.moduleRegistry = Object.create(null);
          this.loaderPlugins = Object.create(null);
          this.modulesBeingLoaded = new Map();
          this.baseUrl = location.origin || `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}`;
          this.useTemplateLoader(new TextTemplateLoader());
          this.addPlugin('template-registry-entry', {
              fetch: async (moduleId) => {
                  const entry = this.getOrCreateTemplateRegistryEntry(moduleId);
                  if (!entry.templateIsLoaded) {
                      await this.templateLoader.loadTemplate(this, entry);
                  }
                  return entry;
              }
          });
          PLATFORM.eachModule = callback => {
              const registry = this.moduleRegistry;
              const cachedModuleIds = Object.getOwnPropertyNames(registry);
              cachedModuleIds
                  // Note: we use .some here like a .forEach that can be "break"ed out of.
                  // It will stop iterating only when a truthy value is returned.
                  // Even though the docs say "true" explicitly, loader-default also goes by truthy
                  // and this is to keep it consistent with that.
                  .some(moduleId => {
                  const moduleExports = registry[moduleId].exports;
                  if (typeof moduleExports === 'object') {
                      return callback(moduleId, moduleExports);
                  }
                  return false;
              });
          };
      }
      /**
       * @internal
       */
      async _import(address) {
          const addressParts = address.split('!');
          const moduleId = addressParts.splice(addressParts.length - 1, 1)[0];
          const loaderPlugin = addressParts.length === 1 ? addressParts[0] : null;
          if (loaderPlugin) {
              const plugin = this.loaderPlugins[loaderPlugin];
              if (!plugin) {
                  throw new Error(`Plugin ${loaderPlugin} is not registered in the loader.`);
              }
              return await plugin.fetch(moduleId);
          }
          return import(join(this.baseUrl, moduleId)).then(m => {
              this.moduleRegistry[moduleId] = m;
              return m;
          });
      }
      /**
      * Maps a module id to a source.
      * @param id The module id.
      * @param source The source to map the module to.
      */
      map(id, source) { }
      /**
      * Normalizes a module id.
      * @param moduleId The module id to normalize.
      * @param relativeTo What the module id should be normalized relative to.
      * @return The normalized module id.
      */
      normalizeSync(moduleId, relativeTo) {
          return moduleId;
      }
      /**
      * Normalizes a module id.
      * @param moduleId The module id to normalize.
      * @param relativeTo What the module id should be normalized relative to.
      * @return The normalized module id.
      */
      normalize(moduleId, relativeTo) {
          return Promise.resolve(moduleId);
      }
      /**
      * Instructs the loader to use a specific TemplateLoader instance for loading templates
      * @param templateLoader The instance of TemplateLoader to use for loading templates.
      */
      useTemplateLoader(templateLoader) {
          this.templateLoader = templateLoader;
      }
      /**
      * Loads a collection of modules.
      * @param ids The set of module ids to load.
      * @return A Promise for an array of loaded modules.
      */
      loadAllModules(ids) {
          return Promise.all(ids.map(id => this.loadModule(id)));
      }
      /**
      * Loads a module.
      * @param moduleId The module ID to load.
      * @return A Promise for the loaded module.
      */
      async loadModule(moduleId) {
          let existing = this.moduleRegistry[moduleId];
          if (existing) {
              return existing;
          }
          let beingLoaded = this.modulesBeingLoaded.get(moduleId);
          if (beingLoaded) {
              return beingLoaded;
          }
          beingLoaded = this._import(moduleId);
          this.modulesBeingLoaded.set(moduleId, beingLoaded);
          const moduleExports = await beingLoaded;
          this.moduleRegistry[moduleId] = ensureOriginOnExports(moduleExports, moduleId);
          this.modulesBeingLoaded.delete(moduleId);
          return moduleExports;
      }
      /**
      * Loads a template.
      * @param url The url of the template to load.
      * @return A Promise for a TemplateRegistryEntry containing the template.
      */
      loadTemplate(url) {
          return this.loadModule(this.applyPluginToUrl(url, 'template-registry-entry'));
      }
      /**
      * Loads a text-based resource.
      * @param url The url of the text file to load.
      * @return A Promise for text content.
      */
      async loadText(url) {
          return fetch(url).then(res => res.text());
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
      addPlugin(pluginName, implementation) {
          this.loaderPlugins[pluginName] = implementation;
      }
  }
  PLATFORM.Loader = EsmLoader;

  const logLevel = {
    none: 0,
    error: 10,
    warn: 20,
    info: 30,
    debug: 40
  };

  let loggers = {};
  let appenders = [];
  let globalDefaultLevel = logLevel.none;

  const standardLevels = ['none', 'error', 'warn', 'info', 'debug'];
  function isStandardLevel(level) {
    return standardLevels.filter(l => l === level).length > 0;
  }

  function appendArgs() {
    return [this, ...arguments];
  }

  function logFactory(level) {
    const threshold = logLevel[level];
    return function () {
      if (this.level < threshold) {
        return;
      }

      const args = appendArgs.apply(this, arguments);
      let i = appenders.length;
      while (i--) {
        appenders[i][level](...args);
      }
    };
  }

  function logFactoryCustom(level) {
    const threshold = logLevel[level];
    return function () {
      if (this.level < threshold) {
        return;
      }

      const args = appendArgs.apply(this, arguments);
      let i = appenders.length;
      while (i--) {
        const appender = appenders[i];
        if (appender[level] !== undefined) {
          appender[level](...args);
        }
      }
    };
  }

  function connectLoggers() {
    let proto = Logger.prototype;
    for (let level in logLevel) {
      if (isStandardLevel(level)) {
        if (level !== 'none') {
          proto[level] = logFactory(level);
        }
      } else {
        proto[level] = logFactoryCustom(level);
      }
    }
  }

  function disconnectLoggers() {
    let proto = Logger.prototype;
    for (let level in logLevel) {
      if (level !== 'none') {
        proto[level] = function () {};
      }
    }
  }

  function getLogger(id) {
    return loggers[id] || new Logger(id);
  }

  function addAppender(appender) {
    if (appenders.push(appender) === 1) {
      connectLoggers();
    }
  }

  function removeAppender(appender) {
    appenders = appenders.filter(a => a !== appender);
  }

  function getAppenders() {
    return [...appenders];
  }

  function clearAppenders() {
    appenders = [];
    disconnectLoggers();
  }

  function addCustomLevel(name, value) {
    if (logLevel[name] !== undefined) {
      throw Error(`Log level "${name}" already exists.`);
    }

    if (isNaN(value)) {
      throw Error('Value must be a number.');
    }

    logLevel[name] = value;

    if (appenders.length > 0) {
      connectLoggers();
    } else {
      Logger.prototype[name] = function () {};
    }
  }

  function removeCustomLevel(name) {
    if (logLevel[name] === undefined) {
      return;
    }

    if (isStandardLevel(name)) {
      throw Error(`Built-in log level "${name}" cannot be removed.`);
    }

    delete logLevel[name];
    delete Logger.prototype[name];
  }

  function setLevel(level) {
    globalDefaultLevel = level;
    for (let key in loggers) {
      loggers[key].setLevel(level);
    }
  }

  function getLevel() {
    return globalDefaultLevel;
  }

  let Logger = class Logger {
    constructor(id) {
      let cached = loggers[id];
      if (cached) {
        return cached;
      }

      loggers[id] = this;
      this.id = id;
      this.level = globalDefaultLevel;
    }

    debug(message, ...rest) {}

    info(message, ...rest) {}

    warn(message, ...rest) {}

    error(message, ...rest) {}

    setLevel(level) {
      this.level = level;
    }

    isDebugEnabled() {
      return this.level === logLevel.debug;
    }
  };

  var TheLogManager = /*#__PURE__*/Object.freeze({
    logLevel: logLevel,
    getLogger: getLogger,
    addAppender: addAppender,
    removeAppender: removeAppender,
    getAppenders: getAppenders,
    clearAppenders: clearAppenders,
    addCustomLevel: addCustomLevel,
    removeCustomLevel: removeCustomLevel,
    setLevel: setLevel,
    getLevel: getLevel,
    Logger: Logger
  });

  var _dec, _class, _dec2, _class2, _dec3, _class3, _dec4, _class4, _dec5, _class5, _dec6, _class6, _dec7, _class7;

  const resolver = protocol.create('aurelia:resolver', function (target) {
    if (!(typeof target.get === 'function')) {
      return 'Resolvers must implement: get(container: Container, key: any): any';
    }

    return true;
  });

  let StrategyResolver = (_dec = resolver(), _dec(_class = class StrategyResolver {
    constructor(strategy, state) {
      this.strategy = strategy;
      this.state = state;
    }

    get(container, key) {
      switch (this.strategy) {
        case 0:
          return this.state;
        case 1:
          let singleton = container.invoke(this.state);
          this.state = singleton;
          this.strategy = 0;
          return singleton;
        case 2:
          return container.invoke(this.state);
        case 3:
          return this.state(container, key, this);
        case 4:
          return this.state[0].get(container, key);
        case 5:
          return container.get(this.state);
        default:
          throw new Error('Invalid strategy: ' + this.strategy);
      }
    }
  }) || _class);

  let Lazy = (_dec2 = resolver(), _dec2(_class2 = class Lazy {
    constructor(key) {
      this._key = key;
    }

    get(container) {
      return () => container.get(this._key);
    }

    static of(key) {
      return new Lazy(key);
    }
  }) || _class2);

  let All = (_dec3 = resolver(), _dec3(_class3 = class All {
    constructor(key) {
      this._key = key;
    }

    get(container) {
      return container.getAll(this._key);
    }

    static of(key) {
      return new All(key);
    }
  }) || _class3);

  let Optional = (_dec4 = resolver(), _dec4(_class4 = class Optional {
    constructor(key, checkParent = true) {
      this._key = key;
      this._checkParent = checkParent;
    }

    get(container) {
      if (container.hasResolver(this._key, this._checkParent)) {
        return container.get(this._key);
      }

      return null;
    }

    static of(key, checkParent = true) {
      return new Optional(key, checkParent);
    }
  }) || _class4);

  let Parent = (_dec5 = resolver(), _dec5(_class5 = class Parent {
    constructor(key) {
      this._key = key;
    }

    get(container) {
      return container.parent ? container.parent.get(this._key) : null;
    }

    static of(key) {
      return new Parent(key);
    }
  }) || _class5);

  let Factory = (_dec6 = resolver(), _dec6(_class6 = class Factory {
    constructor(key) {
      this._key = key;
    }

    get(container) {
      let fn = this._key;
      let resolver = container.getResolver(fn);
      if (resolver && resolver.strategy === 3) {
        fn = resolver.state;
      }

      return (...rest) => container.invoke(fn, rest);
    }

    static of(key) {
      return new Factory(key);
    }
  }) || _class6);

  let NewInstance = (_dec7 = resolver(), _dec7(_class7 = class NewInstance {
    constructor(key, ...dynamicDependencies) {
      this.key = key;
      this.asKey = key;
      this.dynamicDependencies = dynamicDependencies;
    }

    get(container) {
      let dynamicDependencies = this.dynamicDependencies.length > 0 ? this.dynamicDependencies.map(dependency => dependency['protocol:aurelia:resolver'] ? dependency.get(container) : container.get(dependency)) : undefined;

      let fn = this.key;
      let resolver = container.getResolver(fn);
      if (resolver && resolver.strategy === 3) {
        fn = resolver.state;
      }

      const instance = container.invoke(fn, dynamicDependencies);
      container.registerInstance(this.asKey, instance);
      return instance;
    }

    as(key) {
      this.asKey = key;
      return this;
    }

    static of(key, ...dynamicDependencies) {
      return new NewInstance(key, ...dynamicDependencies);
    }
  }) || _class7);

  function getDecoratorDependencies(target) {
    autoinject(target);

    return target.inject;
  }

  function lazy(keyValue) {
    return function (target, key, index) {
      let inject = getDecoratorDependencies(target);
      inject[index] = Lazy.of(keyValue);
    };
  }

  function all(keyValue) {
    return function (target, key, index) {
      let inject = getDecoratorDependencies(target);
      inject[index] = All.of(keyValue);
    };
  }

  function optional(checkParentOrTarget = true) {
    let deco = function (checkParent) {
      return function (target, key, index) {
        let inject = getDecoratorDependencies(target);
        inject[index] = Optional.of(inject[index], checkParent);
      };
    };
    if (typeof checkParentOrTarget === 'boolean') {
      return deco(checkParentOrTarget);
    }
    return deco(true);
  }

  function parent(target, key, index) {
    let inject = getDecoratorDependencies(target);
    inject[index] = Parent.of(inject[index]);
  }

  function factory(keyValue) {
    return function (target, key, index) {
      let inject = getDecoratorDependencies(target);
      inject[index] = Factory.of(keyValue);
    };
  }

  function newInstance(asKeyOrTarget, ...dynamicDependencies) {
    let deco = function (asKey) {
      return function (target, key, index) {
        let inject = getDecoratorDependencies(target);
        inject[index] = NewInstance.of(inject[index], ...dynamicDependencies);
        if (!!asKey) {
          inject[index].as(asKey);
        }
      };
    };
    if (arguments.length >= 1) {
      return deco(asKeyOrTarget);
    }
    return deco();
  }

  function invoker(value) {
    return function (target) {
      metadata.define(metadata.invoker, value, target);
    };
  }

  function invokeAsFactory(potentialTarget) {
    let deco = function (target) {
      metadata.define(metadata.invoker, FactoryInvoker.instance, target);
    };

    return potentialTarget ? deco(potentialTarget) : deco;
  }

  let FactoryInvoker = class FactoryInvoker {
    invoke(container, fn, dependencies) {
      let i = dependencies.length;
      let args = new Array(i);

      while (i--) {
        args[i] = container.get(dependencies[i]);
      }

      return fn.apply(undefined, args);
    }

    invokeWithDynamicDependencies(container, fn, staticDependencies, dynamicDependencies) {
      let i = staticDependencies.length;
      let args = new Array(i);

      while (i--) {
        args[i] = container.get(staticDependencies[i]);
      }

      if (dynamicDependencies !== undefined) {
        args = args.concat(dynamicDependencies);
      }

      return fn.apply(undefined, args);
    }
  };

  FactoryInvoker.instance = new FactoryInvoker();

  function registration(value) {
    return function (target) {
      metadata.define(metadata.registration, value, target);
    };
  }

  function transient(key) {
    return registration(new TransientRegistration(key));
  }

  function singleton(keyOrRegisterInChild, registerInChild = false) {
    return registration(new SingletonRegistration(keyOrRegisterInChild, registerInChild));
  }

  let TransientRegistration = class TransientRegistration {
    constructor(key) {
      this._key = key;
    }

    registerResolver(container, key, fn) {
      let existingResolver = container.getResolver(this._key || key);
      return existingResolver === undefined ? container.registerTransient(this._key || key, fn) : existingResolver;
    }
  };

  let SingletonRegistration = class SingletonRegistration {
    constructor(keyOrRegisterInChild, registerInChild = false) {
      if (typeof keyOrRegisterInChild === 'boolean') {
        this._registerInChild = keyOrRegisterInChild;
      } else {
        this._key = keyOrRegisterInChild;
        this._registerInChild = registerInChild;
      }
    }

    registerResolver(container, key, fn) {
      let targetContainer = this._registerInChild ? container : container.root;
      let existingResolver = targetContainer.getResolver(this._key || key);
      return existingResolver === undefined ? targetContainer.registerSingleton(this._key || key, fn) : existingResolver;
    }
  };

  function validateKey(key) {
    if (key === null || key === undefined) {
      throw new Error('key/value cannot be null or undefined. Are you trying to inject/register something that doesn\'t exist with DI?');
    }
  }
  const _emptyParameters = Object.freeze([]);

  metadata.registration = 'aurelia:registration';
  metadata.invoker = 'aurelia:invoker';

  let resolverDecorates = resolver.decorates;

  let InvocationHandler = class InvocationHandler {
    constructor(fn, invoker, dependencies) {
      this.fn = fn;
      this.invoker = invoker;
      this.dependencies = dependencies;
    }

    invoke(container, dynamicDependencies) {
      return dynamicDependencies !== undefined ? this.invoker.invokeWithDynamicDependencies(container, this.fn, this.dependencies, dynamicDependencies) : this.invoker.invoke(container, this.fn, this.dependencies);
    }
  };

  function invokeWithDynamicDependencies(container, fn, staticDependencies, dynamicDependencies) {
    let i = staticDependencies.length;
    let args = new Array(i);
    let lookup;

    while (i--) {
      lookup = staticDependencies[i];

      if (lookup === null || lookup === undefined) {
        throw new Error('Constructor Parameter with index ' + i + ' cannot be null or undefined. Are you trying to inject/register something that doesn\'t exist with DI?');
      } else {
        args[i] = container.get(lookup);
      }
    }

    if (dynamicDependencies !== undefined) {
      args = args.concat(dynamicDependencies);
    }

    return Reflect.construct(fn, args);
  }

  let classInvokers = {
    [0]: {
      invoke(container, Type) {
        return new Type();
      },
      invokeWithDynamicDependencies: invokeWithDynamicDependencies
    },
    [1]: {
      invoke(container, Type, deps) {
        return new Type(container.get(deps[0]));
      },
      invokeWithDynamicDependencies: invokeWithDynamicDependencies
    },
    [2]: {
      invoke(container, Type, deps) {
        return new Type(container.get(deps[0]), container.get(deps[1]));
      },
      invokeWithDynamicDependencies: invokeWithDynamicDependencies
    },
    [3]: {
      invoke(container, Type, deps) {
        return new Type(container.get(deps[0]), container.get(deps[1]), container.get(deps[2]));
      },
      invokeWithDynamicDependencies: invokeWithDynamicDependencies
    },
    [4]: {
      invoke(container, Type, deps) {
        return new Type(container.get(deps[0]), container.get(deps[1]), container.get(deps[2]), container.get(deps[3]));
      },
      invokeWithDynamicDependencies: invokeWithDynamicDependencies
    },
    [5]: {
      invoke(container, Type, deps) {
        return new Type(container.get(deps[0]), container.get(deps[1]), container.get(deps[2]), container.get(deps[3]), container.get(deps[4]));
      },
      invokeWithDynamicDependencies: invokeWithDynamicDependencies
    },
    fallback: {
      invoke: invokeWithDynamicDependencies,
      invokeWithDynamicDependencies: invokeWithDynamicDependencies
    }
  };

  function getDependencies(f) {
    if (!f.hasOwnProperty('inject')) {
      return [];
    }

    if (typeof f.inject === 'function') {
      return f.inject();
    }

    return f.inject;
  }

  let Container = class Container {
    constructor(configuration) {
      if (configuration === undefined) {
        configuration = {};
      }

      this._configuration = configuration;
      this._onHandlerCreated = configuration.onHandlerCreated;
      this._handlers = configuration.handlers || (configuration.handlers = new Map());
      this._resolvers = new Map();
      this.root = this;
      this.parent = null;
    }

    makeGlobal() {
      Container.instance = this;
      return this;
    }

    setHandlerCreatedCallback(onHandlerCreated) {
      this._onHandlerCreated = onHandlerCreated;
      this._configuration.onHandlerCreated = onHandlerCreated;
    }

    registerInstance(key, instance) {
      return this.registerResolver(key, new StrategyResolver(0, instance === undefined ? key : instance));
    }

    registerSingleton(key, fn) {
      return this.registerResolver(key, new StrategyResolver(1, fn === undefined ? key : fn));
    }

    registerTransient(key, fn) {
      return this.registerResolver(key, new StrategyResolver(2, fn === undefined ? key : fn));
    }

    registerHandler(key, handler) {
      return this.registerResolver(key, new StrategyResolver(3, handler));
    }

    registerAlias(originalKey, aliasKey) {
      return this.registerResolver(aliasKey, new StrategyResolver(5, originalKey));
    }

    registerResolver(key, resolver) {
      validateKey(key);

      let allResolvers = this._resolvers;
      let result = allResolvers.get(key);

      if (result === undefined) {
        allResolvers.set(key, resolver);
      } else if (result.strategy === 4) {
        result.state.push(resolver);
      } else {
        allResolvers.set(key, new StrategyResolver(4, [result, resolver]));
      }

      return resolver;
    }

    autoRegister(key, fn) {
      fn = fn === undefined ? key : fn;

      if (typeof fn === 'function') {
        let registration = metadata.get(metadata.registration, fn);

        if (registration === undefined) {
          return this.registerResolver(key, new StrategyResolver(1, fn));
        }

        return registration.registerResolver(this, key, fn);
      }

      return this.registerResolver(key, new StrategyResolver(0, fn));
    }

    autoRegisterAll(fns) {
      let i = fns.length;
      while (i--) {
        this.autoRegister(fns[i]);
      }
    }

    unregister(key) {
      this._resolvers.delete(key);
    }

    hasResolver(key, checkParent = false) {
      validateKey(key);

      return this._resolvers.has(key) || checkParent && this.parent !== null && this.parent.hasResolver(key, checkParent);
    }

    getResolver(key) {
      return this._resolvers.get(key);
    }

    get(key) {
      validateKey(key);

      if (key === Container) {
        return this;
      }

      if (resolverDecorates(key)) {
        return key.get(this, key);
      }

      let resolver = this._resolvers.get(key);

      if (resolver === undefined) {
        if (this.parent === null) {
          return this.autoRegister(key).get(this, key);
        }

        let registration = metadata.get(metadata.registration, key);

        if (registration === undefined) {
          return this.parent._get(key);
        }

        return registration.registerResolver(this, key, key).get(this, key);
      }

      return resolver.get(this, key);
    }

    _get(key) {
      let resolver = this._resolvers.get(key);

      if (resolver === undefined) {
        if (this.parent === null) {
          return this.autoRegister(key).get(this, key);
        }

        return this.parent._get(key);
      }

      return resolver.get(this, key);
    }

    getAll(key) {
      validateKey(key);

      let resolver = this._resolvers.get(key);

      if (resolver === undefined) {
        if (this.parent === null) {
          return _emptyParameters;
        }

        return this.parent.getAll(key);
      }

      if (resolver.strategy === 4) {
        let state = resolver.state;
        let i = state.length;
        let results = new Array(i);

        while (i--) {
          results[i] = state[i].get(this, key);
        }

        return results;
      }

      return [resolver.get(this, key)];
    }

    createChild() {
      let child = new Container(this._configuration);
      child.root = this.root;
      child.parent = this;
      return child;
    }

    invoke(fn, dynamicDependencies) {
      try {
        let handler = this._handlers.get(fn);

        if (handler === undefined) {
          handler = this._createInvocationHandler(fn);
          this._handlers.set(fn, handler);
        }

        return handler.invoke(this, dynamicDependencies);
      } catch (e) {
        throw new AggregateError(`Error invoking ${fn.name}. Check the inner error for details.`, e, true);
      }
    }

    _createInvocationHandler(fn) {
      let dependencies;

      if (fn.inject === undefined) {
        dependencies = metadata.getOwn(metadata.paramTypes, fn) || _emptyParameters;
      } else {
        dependencies = [];
        let ctor = fn;
        while (typeof ctor === 'function') {
          dependencies.push(...getDependencies(ctor));
          ctor = Object.getPrototypeOf(ctor);
        }
      }

      let invoker = metadata.getOwn(metadata.invoker, fn) || classInvokers[dependencies.length] || classInvokers.fallback;

      let handler = new InvocationHandler(fn, invoker, dependencies);
      return this._onHandlerCreated !== undefined ? this._onHandlerCreated(handler) : handler;
    }
  };

  function autoinject(potentialTarget) {
    let deco = function (target) {
      if (!target.hasOwnProperty('inject')) {
        target.inject = (metadata.getOwn(metadata.paramTypes, target) || _emptyParameters).slice();

        if (target.inject.length > 0 && target.inject[target.inject.length - 1] === Object) {
          target.inject.pop();
        }
      }
    };

    return potentialTarget ? deco(potentialTarget) : deco;
  }

  function inject(...rest) {
    return function (target, key, descriptor) {
      if (typeof descriptor === 'number') {
        autoinject(target);
        if (rest.length === 1) {
          target.inject[descriptor] = rest[0];
        }
        return;
      }

      if (descriptor) {
        const fn = descriptor.value;
        fn.inject = rest;
      } else {
        target.inject = rest;
      }
    };
  }

  const stackSeparator = '\nEnqueued in TaskQueue by:\n';
  const microStackSeparator = '\nEnqueued in MicroTaskQueue by:\n';

  function makeRequestFlushFromMutationObserver(flush) {
    let observer = DOM.createMutationObserver(flush);
    let val = 'a';
    let node = DOM.createTextNode('a');
    let values = Object.create(null);
    values.a = 'b';
    values.b = 'a';
    observer.observe(node, { characterData: true });
    return function requestFlush() {
      node.data = val = values[val];
    };
  }

  function makeRequestFlushFromTimer(flush) {
    return function requestFlush() {
      let timeoutHandle = setTimeout(handleFlushTimer, 0);

      let intervalHandle = setInterval(handleFlushTimer, 50);
      function handleFlushTimer() {
        clearTimeout(timeoutHandle);
        clearInterval(intervalHandle);
        flush();
      }
    };
  }

  function onError(error, task, longStacks) {
    if (longStacks && task.stack && typeof error === 'object' && error !== null) {
      error.stack = filterFlushStack(error.stack) + task.stack;
    }

    if ('onError' in task) {
      task.onError(error);
    } else {
      setTimeout(() => {
        throw error;
      }, 0);
    }
  }

  let TaskQueue = class TaskQueue {
    constructor() {
      this.flushing = false;
      this.longStacks = false;

      this.microTaskQueue = [];
      this.microTaskQueueCapacity = 1024;
      this.taskQueue = [];

      if (FEATURE.mutationObserver) {
        this.requestFlushMicroTaskQueue = makeRequestFlushFromMutationObserver(() => this.flushMicroTaskQueue());
      } else {
        this.requestFlushMicroTaskQueue = makeRequestFlushFromTimer(() => this.flushMicroTaskQueue());
      }

      this.requestFlushTaskQueue = makeRequestFlushFromTimer(() => this.flushTaskQueue());
    }

    _flushQueue(queue, capacity) {
      let index = 0;
      let task;

      try {
        this.flushing = true;
        while (index < queue.length) {
          task = queue[index];
          if (this.longStacks) {
            this.stack = typeof task.stack === 'string' ? task.stack : undefined;
          }
          task.call();
          index++;

          if (index > capacity) {
            for (let scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
              queue[scan] = queue[scan + index];
            }

            queue.length -= index;
            index = 0;
          }
        }
      } catch (error) {
        onError(error, task, this.longStacks);
      } finally {
        this.flushing = false;
      }
    }

    queueMicroTask(task) {
      if (this.microTaskQueue.length < 1) {
        this.requestFlushMicroTaskQueue();
      }

      if (this.longStacks) {
        task.stack = this.prepareQueueStack(microStackSeparator);
      }

      this.microTaskQueue.push(task);
    }

    queueTask(task) {
      if (this.taskQueue.length < 1) {
        this.requestFlushTaskQueue();
      }

      if (this.longStacks) {
        task.stack = this.prepareQueueStack(stackSeparator);
      }

      this.taskQueue.push(task);
    }

    flushTaskQueue() {
      let queue = this.taskQueue;
      this.taskQueue = [];
      this._flushQueue(queue, Number.MAX_VALUE);
    }

    flushMicroTaskQueue() {
      let queue = this.microTaskQueue;
      this._flushQueue(queue, this.microTaskQueueCapacity);
      queue.length = 0;
    }

    prepareQueueStack(separator) {
      let stack = separator + filterQueueStack(captureStack());

      if (typeof this.stack === 'string') {
        stack = filterFlushStack(stack) + this.stack;
      }

      return stack;
    }
  };

  function captureStack() {
    let error = new Error();

    if (error.stack) {
      return error.stack;
    }

    try {
      throw error;
    } catch (e) {
      return e.stack;
    }
  }

  function filterQueueStack(stack) {
    return stack.replace(/^[\s\S]*?\bqueue(Micro)?Task\b[^\n]*\n/, '');
  }

  function filterFlushStack(stack) {
    let index = stack.lastIndexOf('flushMicroTaskQueue');

    if (index < 0) {
      index = stack.lastIndexOf('flushTaskQueue');
      if (index < 0) {
        return stack;
      }
    }

    index = stack.lastIndexOf('\n', index);

    return index < 0 ? stack : stack.substr(0, index);
  }

  var _dec$1, _dec2$1, _class$1, _dec3$1, _class2$1, _dec4$1, _class3$1, _dec5$1, _class5$1, _dec6$1, _class7$1, _dec7$1, _class8, _dec8, _class9, _dec9, _class10, _class11, _temp, _dec10, _class12, _class13, _temp2;

  const targetContext = 'Binding:target';
  const sourceContext = 'Binding:source';

  const map = Object.create(null);

  function camelCase(name) {
    if (name in map) {
      return map[name];
    }
    const result = name.charAt(0).toLowerCase() + name.slice(1).replace(/[_.-](\w|$)/g, (_, x) => x.toUpperCase());
    map[name] = result;
    return result;
  }

  function createOverrideContext(bindingContext, parentOverrideContext) {
    return {
      bindingContext: bindingContext,
      parentOverrideContext: parentOverrideContext || null
    };
  }

  function getContextFor(name, scope, ancestor) {
    let oc = scope.overrideContext;

    if (ancestor) {
      while (ancestor && oc) {
        ancestor--;
        oc = oc.parentOverrideContext;
      }
      if (ancestor || !oc) {
        return undefined;
      }
      return name in oc ? oc : oc.bindingContext;
    }

    while (oc && !(name in oc) && !(oc.bindingContext && name in oc.bindingContext)) {
      oc = oc.parentOverrideContext;
    }
    if (oc) {
      return name in oc ? oc : oc.bindingContext;
    }

    return scope.bindingContext || scope.overrideContext;
  }

  function createScopeForTest(bindingContext, parentBindingContext) {
    if (parentBindingContext) {
      return {
        bindingContext,
        overrideContext: createOverrideContext(bindingContext, createOverrideContext(parentBindingContext))
      };
    }
    return {
      bindingContext,
      overrideContext: createOverrideContext(bindingContext)
    };
  }

  const slotNames = [];
  const versionSlotNames = [];

  for (let i = 0; i < 100; i++) {
    slotNames.push(`_observer${i}`);
    versionSlotNames.push(`_observerVersion${i}`);
  }

  function addObserver(observer) {
    let observerSlots = this._observerSlots === undefined ? 0 : this._observerSlots;
    let i = observerSlots;
    while (i-- && this[slotNames[i]] !== observer) {}

    if (i === -1) {
      i = 0;
      while (this[slotNames[i]]) {
        i++;
      }
      this[slotNames[i]] = observer;
      observer.subscribe(sourceContext, this);

      if (i === observerSlots) {
        this._observerSlots = i + 1;
      }
    }

    if (this._version === undefined) {
      this._version = 0;
    }
    this[versionSlotNames[i]] = this._version;
  }

  function observeProperty(obj, propertyName) {
    let observer = this.observerLocator.getObserver(obj, propertyName);
    addObserver.call(this, observer);
  }

  function observeArray(array) {
    let observer = this.observerLocator.getArrayObserver(array);
    addObserver.call(this, observer);
  }

  function unobserve(all) {
    let i = this._observerSlots;
    while (i--) {
      if (all || this[versionSlotNames[i]] !== this._version) {
        let observer = this[slotNames[i]];
        this[slotNames[i]] = null;
        if (observer) {
          observer.unsubscribe(sourceContext, this);
        }
      }
    }
  }

  function connectable() {
    return function (target) {
      target.prototype.observeProperty = observeProperty;
      target.prototype.observeArray = observeArray;
      target.prototype.unobserve = unobserve;
      target.prototype.addObserver = addObserver;
    };
  }

  const queue = [];
  const queued = {};
  let nextId = 0;
  let minimumImmediate = 100;
  const frameBudget = 15;

  let isFlushRequested = false;
  let immediate = 0;

  function flush(animationFrameStart) {
    const length = queue.length;
    let i = 0;
    while (i < length) {
      const binding = queue[i];
      queued[binding.__connectQueueId] = false;
      binding.connect(true);
      i++;

      if (i % 100 === 0 && PLATFORM.performance.now() - animationFrameStart > frameBudget) {
        break;
      }
    }
    queue.splice(0, i);

    if (queue.length) {
      PLATFORM.requestAnimationFrame(flush);
    } else {
      isFlushRequested = false;
      immediate = 0;
    }
  }

  function enqueueBindingConnect(binding) {
    if (immediate < minimumImmediate) {
      immediate++;
      binding.connect(false);
    } else {
      let id = binding.__connectQueueId;
      if (id === undefined) {
        id = nextId;
        nextId++;
        binding.__connectQueueId = id;
      }

      if (!queued[id]) {
        queue.push(binding);
        queued[id] = true;
      }
    }
    if (!isFlushRequested) {
      isFlushRequested = true;
      PLATFORM.requestAnimationFrame(flush);
    }
  }

  function setConnectQueueThreshold(value) {
    minimumImmediate = value;
  }

  function enableConnectQueue() {
    setConnectQueueThreshold(100);
  }

  function disableConnectQueue() {
    setConnectQueueThreshold(Number.MAX_SAFE_INTEGER);
  }

  function getConnectQueueSize() {
    return queue.length;
  }

  function addSubscriber(context, callable) {
    if (this.hasSubscriber(context, callable)) {
      return false;
    }
    if (!this._context0) {
      this._context0 = context;
      this._callable0 = callable;
      return true;
    }
    if (!this._context1) {
      this._context1 = context;
      this._callable1 = callable;
      return true;
    }
    if (!this._context2) {
      this._context2 = context;
      this._callable2 = callable;
      return true;
    }
    if (!this._contextsRest) {
      this._contextsRest = [context];
      this._callablesRest = [callable];
      return true;
    }
    this._contextsRest.push(context);
    this._callablesRest.push(callable);
    return true;
  }

  function removeSubscriber(context, callable) {
    if (this._context0 === context && this._callable0 === callable) {
      this._context0 = null;
      this._callable0 = null;
      return true;
    }
    if (this._context1 === context && this._callable1 === callable) {
      this._context1 = null;
      this._callable1 = null;
      return true;
    }
    if (this._context2 === context && this._callable2 === callable) {
      this._context2 = null;
      this._callable2 = null;
      return true;
    }
    const callables = this._callablesRest;
    if (callables === undefined || callables.length === 0) {
      return false;
    }
    const contexts = this._contextsRest;
    let i = 0;
    while (!(callables[i] === callable && contexts[i] === context) && callables.length > i) {
      i++;
    }
    if (i >= callables.length) {
      return false;
    }
    contexts.splice(i, 1);
    callables.splice(i, 1);
    return true;
  }

  let arrayPool1 = [];
  let arrayPool2 = [];
  let poolUtilization = [];

  function callSubscribers(newValue, oldValue) {
    let context0 = this._context0;
    let callable0 = this._callable0;
    let context1 = this._context1;
    let callable1 = this._callable1;
    let context2 = this._context2;
    let callable2 = this._callable2;
    let length = this._contextsRest ? this._contextsRest.length : 0;
    let contextsRest;
    let callablesRest;
    let poolIndex;
    let i;
    if (length) {
      poolIndex = poolUtilization.length;
      while (poolIndex-- && poolUtilization[poolIndex]) {}
      if (poolIndex < 0) {
        poolIndex = poolUtilization.length;
        contextsRest = [];
        callablesRest = [];
        poolUtilization.push(true);
        arrayPool1.push(contextsRest);
        arrayPool2.push(callablesRest);
      } else {
        poolUtilization[poolIndex] = true;
        contextsRest = arrayPool1[poolIndex];
        callablesRest = arrayPool2[poolIndex];
      }

      i = length;
      while (i--) {
        contextsRest[i] = this._contextsRest[i];
        callablesRest[i] = this._callablesRest[i];
      }
    }

    if (context0) {
      if (callable0) {
        callable0.call(context0, newValue, oldValue);
      } else {
        context0(newValue, oldValue);
      }
    }
    if (context1) {
      if (callable1) {
        callable1.call(context1, newValue, oldValue);
      } else {
        context1(newValue, oldValue);
      }
    }
    if (context2) {
      if (callable2) {
        callable2.call(context2, newValue, oldValue);
      } else {
        context2(newValue, oldValue);
      }
    }
    if (length) {
      for (i = 0; i < length; i++) {
        let callable = callablesRest[i];
        let context = contextsRest[i];
        if (callable) {
          callable.call(context, newValue, oldValue);
        } else {
          context(newValue, oldValue);
        }
        contextsRest[i] = null;
        callablesRest[i] = null;
      }
      poolUtilization[poolIndex] = false;
    }
  }

  function hasSubscribers() {
    return !!(this._context0 || this._context1 || this._context2 || this._contextsRest && this._contextsRest.length);
  }

  function hasSubscriber(context, callable) {
    let has = this._context0 === context && this._callable0 === callable || this._context1 === context && this._callable1 === callable || this._context2 === context && this._callable2 === callable;
    if (has) {
      return true;
    }
    let index;
    let contexts = this._contextsRest;
    if (!contexts || (index = contexts.length) === 0) {
      return false;
    }
    let callables = this._callablesRest;
    while (index--) {
      if (contexts[index] === context && callables[index] === callable) {
        return true;
      }
    }
    return false;
  }

  function subscriberCollection() {
    return function (target) {
      target.prototype.addSubscriber = addSubscriber;
      target.prototype.removeSubscriber = removeSubscriber;
      target.prototype.callSubscribers = callSubscribers;
      target.prototype.hasSubscribers = hasSubscribers;
      target.prototype.hasSubscriber = hasSubscriber;
    };
  }

  let ExpressionObserver = (_dec$1 = connectable(), _dec2$1 = subscriberCollection(), _dec$1(_class$1 = _dec2$1(_class$1 = class ExpressionObserver {
    constructor(scope, expression, observerLocator, lookupFunctions) {
      this.scope = scope;
      this.expression = expression;
      this.observerLocator = observerLocator;
      this.lookupFunctions = lookupFunctions;
    }

    getValue() {
      return this.expression.evaluate(this.scope, this.lookupFunctions);
    }

    setValue(newValue) {
      this.expression.assign(this.scope, newValue);
    }

    subscribe(context, callable) {
      if (!this.hasSubscribers()) {
        this.oldValue = this.expression.evaluate(this.scope, this.lookupFunctions);
        this.expression.connect(this, this.scope);
      }
      this.addSubscriber(context, callable);
      if (arguments.length === 1 && context instanceof Function) {
        return {
          dispose: () => {
            this.unsubscribe(context, callable);
          }
        };
      }
    }

    unsubscribe(context, callable) {
      if (this.removeSubscriber(context, callable) && !this.hasSubscribers()) {
        this.unobserve(true);
        this.oldValue = undefined;
      }
    }

    call() {
      let newValue = this.expression.evaluate(this.scope, this.lookupFunctions);
      let oldValue = this.oldValue;
      if (newValue !== oldValue) {
        this.oldValue = newValue;
        this.callSubscribers(newValue, oldValue);
      }
      this._version++;
      this.expression.connect(this, this.scope);
      this.unobserve(false);
    }
  }) || _class$1) || _class$1);

  function isIndex(s) {
    return +s === s >>> 0;
  }

  function toNumber(s) {
    return +s;
  }

  function newSplice(index, removed, addedCount) {
    return {
      index: index,
      removed: removed,
      addedCount: addedCount
    };
  }

  const EDIT_LEAVE = 0;
  const EDIT_UPDATE = 1;
  const EDIT_ADD = 2;
  const EDIT_DELETE = 3;

  function ArraySplice() {}

  ArraySplice.prototype = {
    calcEditDistances: function (current, currentStart, currentEnd, old, oldStart, oldEnd) {
      let rowCount = oldEnd - oldStart + 1;
      let columnCount = currentEnd - currentStart + 1;
      let distances = new Array(rowCount);
      let north;
      let west;

      for (let i = 0; i < rowCount; ++i) {
        distances[i] = new Array(columnCount);
        distances[i][0] = i;
      }

      for (let j = 0; j < columnCount; ++j) {
        distances[0][j] = j;
      }

      for (let i = 1; i < rowCount; ++i) {
        for (let j = 1; j < columnCount; ++j) {
          if (this.equals(current[currentStart + j - 1], old[oldStart + i - 1])) {
            distances[i][j] = distances[i - 1][j - 1];
          } else {
            north = distances[i - 1][j] + 1;
            west = distances[i][j - 1] + 1;
            distances[i][j] = north < west ? north : west;
          }
        }
      }

      return distances;
    },

    spliceOperationsFromEditDistances: function (distances) {
      let i = distances.length - 1;
      let j = distances[0].length - 1;
      let current = distances[i][j];
      let edits = [];
      while (i > 0 || j > 0) {
        if (i === 0) {
          edits.push(EDIT_ADD);
          j--;
          continue;
        }
        if (j === 0) {
          edits.push(EDIT_DELETE);
          i--;
          continue;
        }
        let northWest = distances[i - 1][j - 1];
        let west = distances[i - 1][j];
        let north = distances[i][j - 1];

        let min;
        if (west < north) {
          min = west < northWest ? west : northWest;
        } else {
          min = north < northWest ? north : northWest;
        }

        if (min === northWest) {
          if (northWest === current) {
            edits.push(EDIT_LEAVE);
          } else {
            edits.push(EDIT_UPDATE);
            current = northWest;
          }
          i--;
          j--;
        } else if (min === west) {
          edits.push(EDIT_DELETE);
          i--;
          current = west;
        } else {
          edits.push(EDIT_ADD);
          j--;
          current = north;
        }
      }

      edits.reverse();
      return edits;
    },

    calcSplices: function (current, currentStart, currentEnd, old, oldStart, oldEnd) {
      let prefixCount = 0;
      let suffixCount = 0;

      let minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
      if (currentStart === 0 && oldStart === 0) {
        prefixCount = this.sharedPrefix(current, old, minLength);
      }

      if (currentEnd === current.length && oldEnd === old.length) {
        suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);
      }

      currentStart += prefixCount;
      oldStart += prefixCount;
      currentEnd -= suffixCount;
      oldEnd -= suffixCount;

      if (currentEnd - currentStart === 0 && oldEnd - oldStart === 0) {
        return [];
      }

      if (currentStart === currentEnd) {
        let splice = newSplice(currentStart, [], 0);
        while (oldStart < oldEnd) {
          splice.removed.push(old[oldStart++]);
        }

        return [splice];
      } else if (oldStart === oldEnd) {
        return [newSplice(currentStart, [], currentEnd - currentStart)];
      }

      let ops = this.spliceOperationsFromEditDistances(this.calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd));

      let splice = undefined;
      let splices = [];
      let index = currentStart;
      let oldIndex = oldStart;
      for (let i = 0; i < ops.length; ++i) {
        switch (ops[i]) {
          case EDIT_LEAVE:
            if (splice) {
              splices.push(splice);
              splice = undefined;
            }

            index++;
            oldIndex++;
            break;
          case EDIT_UPDATE:
            if (!splice) {
              splice = newSplice(index, [], 0);
            }

            splice.addedCount++;
            index++;

            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
          case EDIT_ADD:
            if (!splice) {
              splice = newSplice(index, [], 0);
            }

            splice.addedCount++;
            index++;
            break;
          case EDIT_DELETE:
            if (!splice) {
              splice = newSplice(index, [], 0);
            }

            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
        }
      }

      if (splice) {
        splices.push(splice);
      }
      return splices;
    },

    sharedPrefix: function (current, old, searchLength) {
      for (let i = 0; i < searchLength; ++i) {
        if (!this.equals(current[i], old[i])) {
          return i;
        }
      }

      return searchLength;
    },

    sharedSuffix: function (current, old, searchLength) {
      let index1 = current.length;
      let index2 = old.length;
      let count = 0;
      while (count < searchLength && this.equals(current[--index1], old[--index2])) {
        count++;
      }

      return count;
    },

    calculateSplices: function (current, previous) {
      return this.calcSplices(current, 0, current.length, previous, 0, previous.length);
    },

    equals: function (currentValue, previousValue) {
      return currentValue === previousValue;
    }
  };

  let arraySplice = new ArraySplice();

  function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
    return arraySplice.calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd);
  }

  function intersect(start1, end1, start2, end2) {
    if (end1 < start2 || end2 < start1) {
      return -1;
    }

    if (end1 === start2 || end2 === start1) {
      return 0;
    }

    if (start1 < start2) {
      if (end1 < end2) {
        return end1 - start2;
      }

      return end2 - start2;
    }

    if (end2 < end1) {
      return end2 - start1;
    }

    return end1 - start1;
  }

  function mergeSplice(splices, index, removed, addedCount) {
    let splice = newSplice(index, removed, addedCount);

    let inserted = false;
    let insertionOffset = 0;

    for (let i = 0; i < splices.length; i++) {
      let current = splices[i];
      current.index += insertionOffset;

      if (inserted) {
        continue;
      }

      let intersectCount = intersect(splice.index, splice.index + splice.removed.length, current.index, current.index + current.addedCount);

      if (intersectCount >= 0) {

        splices.splice(i, 1);
        i--;

        insertionOffset -= current.addedCount - current.removed.length;

        splice.addedCount += current.addedCount - intersectCount;
        let deleteCount = splice.removed.length + current.removed.length - intersectCount;

        if (!splice.addedCount && !deleteCount) {
          inserted = true;
        } else {
          let currentRemoved = current.removed;

          if (splice.index < current.index) {
            let prepend = splice.removed.slice(0, current.index - splice.index);
            Array.prototype.push.apply(prepend, currentRemoved);
            currentRemoved = prepend;
          }

          if (splice.index + splice.removed.length > current.index + current.addedCount) {
            let append = splice.removed.slice(current.index + current.addedCount - splice.index);
            Array.prototype.push.apply(currentRemoved, append);
          }

          splice.removed = currentRemoved;
          if (current.index < splice.index) {
            splice.index = current.index;
          }
        }
      } else if (splice.index < current.index) {

        inserted = true;

        splices.splice(i, 0, splice);
        i++;

        let offset = splice.addedCount - splice.removed.length;
        current.index += offset;
        insertionOffset += offset;
      }
    }

    if (!inserted) {
      splices.push(splice);
    }
  }

  function createInitialSplices(array, changeRecords) {
    let splices = [];

    for (let i = 0; i < changeRecords.length; i++) {
      let record = changeRecords[i];
      switch (record.type) {
        case 'splice':
          mergeSplice(splices, record.index, record.removed.slice(), record.addedCount);
          break;
        case 'add':
        case 'update':
        case 'delete':
          if (!isIndex(record.name)) {
            continue;
          }

          let index = toNumber(record.name);
          if (index < 0) {
            continue;
          }

          mergeSplice(splices, index, [record.oldValue], record.type === 'delete' ? 0 : 1);
          break;
        default:
          console.error('Unexpected record type: ' + JSON.stringify(record));
          break;
      }
    }

    return splices;
  }

  function projectArraySplices(array, changeRecords) {
    let splices = [];

    createInitialSplices(array, changeRecords).forEach(function (splice) {
      if (splice.addedCount === 1 && splice.removed.length === 1) {
        if (splice.removed[0] !== array[splice.index]) {
          splices.push(splice);
        }

        return;
      }

      splices = splices.concat(calcSplices(array, splice.index, splice.index + splice.addedCount, splice.removed, 0, splice.removed.length));
    });

    return splices;
  }

  function newRecord(type, object, key, oldValue) {
    return {
      type: type,
      object: object,
      key: key,
      oldValue: oldValue
    };
  }

  function getChangeRecords(map) {
    let entries = new Array(map.size);
    let keys = map.keys();
    let i = 0;
    let item;

    while (item = keys.next()) {
      if (item.done) {
        break;
      }

      entries[i] = newRecord('added', map, item.value);
      i++;
    }

    return entries;
  }

  let ModifyCollectionObserver = (_dec3$1 = subscriberCollection(), _dec3$1(_class2$1 = class ModifyCollectionObserver {
    constructor(taskQueue, collection) {
      this.taskQueue = taskQueue;
      this.queued = false;
      this.changeRecords = null;
      this.oldCollection = null;
      this.collection = collection;
      this.lengthPropertyName = collection instanceof Map || collection instanceof Set ? 'size' : 'length';
    }

    subscribe(context, callable) {
      this.addSubscriber(context, callable);
    }

    unsubscribe(context, callable) {
      this.removeSubscriber(context, callable);
    }

    addChangeRecord(changeRecord) {
      if (!this.hasSubscribers() && !this.lengthObserver) {
        return;
      }

      if (changeRecord.type === 'splice') {
        let index = changeRecord.index;
        let arrayLength = changeRecord.object.length;
        if (index > arrayLength) {
          index = arrayLength - changeRecord.addedCount;
        } else if (index < 0) {
          index = arrayLength + changeRecord.removed.length + index - changeRecord.addedCount;
        }
        if (index < 0) {
          index = 0;
        }
        changeRecord.index = index;
      }

      if (this.changeRecords === null) {
        this.changeRecords = [changeRecord];
      } else {
        this.changeRecords.push(changeRecord);
      }

      if (!this.queued) {
        this.queued = true;
        this.taskQueue.queueMicroTask(this);
      }
    }

    flushChangeRecords() {
      if (this.changeRecords && this.changeRecords.length || this.oldCollection) {
        this.call();
      }
    }

    reset(oldCollection) {
      this.oldCollection = oldCollection;

      if (this.hasSubscribers() && !this.queued) {
        this.queued = true;
        this.taskQueue.queueMicroTask(this);
      }
    }

    getLengthObserver() {
      return this.lengthObserver || (this.lengthObserver = new CollectionLengthObserver(this.collection));
    }

    call() {
      let changeRecords = this.changeRecords;
      let oldCollection = this.oldCollection;
      let records;

      this.queued = false;
      this.changeRecords = [];
      this.oldCollection = null;

      if (this.hasSubscribers()) {
        if (oldCollection) {
          if (this.collection instanceof Map || this.collection instanceof Set) {
            records = getChangeRecords(oldCollection);
          } else {
            records = calcSplices(this.collection, 0, this.collection.length, oldCollection, 0, oldCollection.length);
          }
        } else {
          if (this.collection instanceof Map || this.collection instanceof Set) {
            records = changeRecords;
          } else {
            records = projectArraySplices(this.collection, changeRecords);
          }
        }

        this.callSubscribers(records);
      }

      if (this.lengthObserver) {
        this.lengthObserver.call(this.collection[this.lengthPropertyName]);
      }
    }
  }) || _class2$1);

  let CollectionLengthObserver = (_dec4$1 = subscriberCollection(), _dec4$1(_class3$1 = class CollectionLengthObserver {
    constructor(collection) {
      this.collection = collection;
      this.lengthPropertyName = collection instanceof Map || collection instanceof Set ? 'size' : 'length';
      this.currentValue = collection[this.lengthPropertyName];
    }

    getValue() {
      return this.collection[this.lengthPropertyName];
    }

    setValue(newValue) {
      this.collection[this.lengthPropertyName] = newValue;
    }

    subscribe(context, callable) {
      this.addSubscriber(context, callable);
    }

    unsubscribe(context, callable) {
      this.removeSubscriber(context, callable);
    }

    call(newValue) {
      let oldValue = this.currentValue;
      this.callSubscribers(newValue, oldValue);
      this.currentValue = newValue;
    }
  }) || _class3$1);

  const arrayProto = Array.prototype;
  const pop = arrayProto.pop;
  const push = arrayProto.push;
  const reverse = arrayProto.reverse;
  const shift = arrayProto.shift;
  const sort = arrayProto.sort;
  const splice = arrayProto.splice;
  const unshift = arrayProto.unshift;

  if (arrayProto.__au_patched__) {
    getLogger('array-observation').warn('Detected 2nd attempt of patching array from Aurelia binding.' + ' This is probably caused by dependency mismatch between core modules and a 3rd party plugin.' + ' Please see https://github.com/aurelia/cli/pull/906 if you are using webpack.');
  } else {
    Reflect.defineProperty(arrayProto, '__au_patched__', { value: 1 });
    arrayProto.pop = function () {
      let notEmpty = this.length > 0;
      let methodCallResult = pop.apply(this, arguments);
      if (notEmpty && this.__array_observer__ !== undefined) {
        this.__array_observer__.addChangeRecord({
          type: 'delete',
          object: this,
          name: this.length,
          oldValue: methodCallResult
        });
      }
      return methodCallResult;
    };

    arrayProto.push = function () {
      let methodCallResult = push.apply(this, arguments);
      if (this.__array_observer__ !== undefined) {
        this.__array_observer__.addChangeRecord({
          type: 'splice',
          object: this,
          index: this.length - arguments.length,
          removed: [],
          addedCount: arguments.length
        });
      }
      return methodCallResult;
    };

    arrayProto.reverse = function () {
      let oldArray;
      if (this.__array_observer__ !== undefined) {
        this.__array_observer__.flushChangeRecords();
        oldArray = this.slice();
      }
      let methodCallResult = reverse.apply(this, arguments);
      if (this.__array_observer__ !== undefined) {
        this.__array_observer__.reset(oldArray);
      }
      return methodCallResult;
    };

    arrayProto.shift = function () {
      let notEmpty = this.length > 0;
      let methodCallResult = shift.apply(this, arguments);
      if (notEmpty && this.__array_observer__ !== undefined) {
        this.__array_observer__.addChangeRecord({
          type: 'delete',
          object: this,
          name: 0,
          oldValue: methodCallResult
        });
      }
      return methodCallResult;
    };

    arrayProto.sort = function () {
      let oldArray;
      if (this.__array_observer__ !== undefined) {
        this.__array_observer__.flushChangeRecords();
        oldArray = this.slice();
      }
      let methodCallResult = sort.apply(this, arguments);
      if (this.__array_observer__ !== undefined) {
        this.__array_observer__.reset(oldArray);
      }
      return methodCallResult;
    };

    arrayProto.splice = function () {
      let methodCallResult = splice.apply(this, arguments);
      if (this.__array_observer__ !== undefined) {
        this.__array_observer__.addChangeRecord({
          type: 'splice',
          object: this,
          index: +arguments[0],
          removed: methodCallResult,
          addedCount: arguments.length > 2 ? arguments.length - 2 : 0
        });
      }
      return methodCallResult;
    };

    arrayProto.unshift = function () {
      let methodCallResult = unshift.apply(this, arguments);
      if (this.__array_observer__ !== undefined) {
        this.__array_observer__.addChangeRecord({
          type: 'splice',
          object: this,
          index: 0,
          removed: [],
          addedCount: arguments.length
        });
      }
      return methodCallResult;
    };
  }

  function getArrayObserver(taskQueue, array) {
    return ModifyArrayObserver.for(taskQueue, array);
  }

  let ModifyArrayObserver = class ModifyArrayObserver extends ModifyCollectionObserver {
    constructor(taskQueue, array) {
      super(taskQueue, array);
    }

    static for(taskQueue, array) {
      if (!('__array_observer__' in array)) {
        Reflect.defineProperty(array, '__array_observer__', {
          value: ModifyArrayObserver.create(taskQueue, array),
          enumerable: false, configurable: false
        });
      }
      return array.__array_observer__;
    }

    static create(taskQueue, array) {
      return new ModifyArrayObserver(taskQueue, array);
    }
  };


  let Expression = class Expression {
    constructor() {
      this.isAssignable = false;
    }

    evaluate(scope, lookupFunctions, args) {
      throw new Error(`Binding expression "${this}" cannot be evaluated.`);
    }

    assign(scope, value, lookupFunctions) {
      throw new Error(`Binding expression "${this}" cannot be assigned to.`);
    }

    toString() {
      return  super.toString();
    }
  };

  let BindingBehavior = class BindingBehavior extends Expression {
    constructor(expression, name, args) {
      super();

      this.expression = expression;
      this.name = name;
      this.args = args;
    }

    evaluate(scope, lookupFunctions) {
      return this.expression.evaluate(scope, lookupFunctions);
    }

    assign(scope, value, lookupFunctions) {
      return this.expression.assign(scope, value, lookupFunctions);
    }

    accept(visitor) {
      return visitor.visitBindingBehavior(this);
    }

    connect(binding, scope) {
      this.expression.connect(binding, scope);
    }

    bind(binding, scope, lookupFunctions) {
      if (this.expression.expression && this.expression.bind) {
        this.expression.bind(binding, scope, lookupFunctions);
      }
      let behavior = lookupFunctions.bindingBehaviors(this.name);
      if (!behavior) {
        throw new Error(`No BindingBehavior named "${this.name}" was found!`);
      }
      let behaviorKey = `behavior-${this.name}`;
      if (binding[behaviorKey]) {
        throw new Error(`A binding behavior named "${this.name}" has already been applied to "${this.expression}"`);
      }
      binding[behaviorKey] = behavior;
      behavior.bind.apply(behavior, [binding, scope].concat(evalList(scope, this.args, binding.lookupFunctions)));
    }

    unbind(binding, scope) {
      let behaviorKey = `behavior-${this.name}`;
      binding[behaviorKey].unbind(binding, scope);
      binding[behaviorKey] = null;
      if (this.expression.expression && this.expression.unbind) {
        this.expression.unbind(binding, scope);
      }
    }
  };

  let ValueConverter = class ValueConverter extends Expression {
    constructor(expression, name, args) {
      super();

      this.expression = expression;
      this.name = name;
      this.args = args;
      this.allArgs = [expression].concat(args);
    }

    evaluate(scope, lookupFunctions) {
      let converter = lookupFunctions.valueConverters(this.name);
      if (!converter) {
        throw new Error(`No ValueConverter named "${this.name}" was found!`);
      }

      if ('toView' in converter) {
        return converter.toView.apply(converter, evalList(scope, this.allArgs, lookupFunctions));
      }

      return this.allArgs[0].evaluate(scope, lookupFunctions);
    }

    assign(scope, value, lookupFunctions) {
      let converter = lookupFunctions.valueConverters(this.name);
      if (!converter) {
        throw new Error(`No ValueConverter named "${this.name}" was found!`);
      }

      if ('fromView' in converter) {
        value = converter.fromView.apply(converter, [value].concat(evalList(scope, this.args, lookupFunctions)));
      }

      return this.allArgs[0].assign(scope, value, lookupFunctions);
    }

    accept(visitor) {
      return visitor.visitValueConverter(this);
    }

    connect(binding, scope) {
      let expressions = this.allArgs;
      let i = expressions.length;
      while (i--) {
        expressions[i].connect(binding, scope);
      }
      let converter = binding.lookupFunctions.valueConverters(this.name);
      if (!converter) {
        throw new Error(`No ValueConverter named "${this.name}" was found!`);
      }
      let signals = converter.signals;
      if (signals === undefined) {
        return;
      }
      i = signals.length;
      while (i--) {
        connectBindingToSignal(binding, signals[i]);
      }
    }
  };

  let Assign = class Assign extends Expression {
    constructor(target, value) {
      super();

      this.target = target;
      this.value = value;
      this.isAssignable = true;
    }

    evaluate(scope, lookupFunctions) {
      return this.target.assign(scope, this.value.evaluate(scope, lookupFunctions));
    }

    accept(vistor) {
      vistor.visitAssign(this);
    }

    connect(binding, scope) {}

    assign(scope, value) {
      this.value.assign(scope, value);
      this.target.assign(scope, value);
    }
  };

  let Conditional = class Conditional extends Expression {
    constructor(condition, yes, no) {
      super();

      this.condition = condition;
      this.yes = yes;
      this.no = no;
    }

    evaluate(scope, lookupFunctions) {
      return !!this.condition.evaluate(scope, lookupFunctions) ? this.yes.evaluate(scope, lookupFunctions) : this.no.evaluate(scope, lookupFunctions);
    }

    accept(visitor) {
      return visitor.visitConditional(this);
    }

    connect(binding, scope) {
      this.condition.connect(binding, scope);
      if (this.condition.evaluate(scope)) {
        this.yes.connect(binding, scope);
      } else {
        this.no.connect(binding, scope);
      }
    }
  };

  let AccessThis = class AccessThis extends Expression {
    constructor(ancestor) {
      super();
      this.ancestor = ancestor;
    }

    evaluate(scope, lookupFunctions) {
      let oc = scope.overrideContext;
      let i = this.ancestor;
      while (i-- && oc) {
        oc = oc.parentOverrideContext;
      }
      return i < 1 && oc ? oc.bindingContext : undefined;
    }

    accept(visitor) {
      return visitor.visitAccessThis(this);
    }

    connect(binding, scope) {}
  };

  let AccessScope = class AccessScope extends Expression {
    constructor(name, ancestor) {
      super();

      this.name = name;
      this.ancestor = ancestor;
      this.isAssignable = true;
    }

    evaluate(scope, lookupFunctions) {
      let context = getContextFor(this.name, scope, this.ancestor);
      return context[this.name];
    }

    assign(scope, value) {
      let context = getContextFor(this.name, scope, this.ancestor);
      return context ? context[this.name] = value : undefined;
    }

    accept(visitor) {
      return visitor.visitAccessScope(this);
    }

    connect(binding, scope) {
      let context = getContextFor(this.name, scope, this.ancestor);
      binding.observeProperty(context, this.name);
    }
  };

  let AccessMember = class AccessMember extends Expression {
    constructor(object, name) {
      super();

      this.object = object;
      this.name = name;
      this.isAssignable = true;
    }

    evaluate(scope, lookupFunctions) {
      let instance = this.object.evaluate(scope, lookupFunctions);
      return instance === null || instance === undefined ? instance : instance[this.name];
    }

    assign(scope, value) {
      let instance = this.object.evaluate(scope);

      if (instance === null || instance === undefined) {
        instance = {};
        this.object.assign(scope, instance);
      }

      instance[this.name] = value;
      return value;
    }

    accept(visitor) {
      return visitor.visitAccessMember(this);
    }

    connect(binding, scope) {
      this.object.connect(binding, scope);
      let obj = this.object.evaluate(scope);
      if (obj) {
        binding.observeProperty(obj, this.name);
      }
    }
  };

  let AccessKeyed = class AccessKeyed extends Expression {
    constructor(object, key) {
      super();

      this.object = object;
      this.key = key;
      this.isAssignable = true;
    }

    evaluate(scope, lookupFunctions) {
      let instance = this.object.evaluate(scope, lookupFunctions);
      let lookup = this.key.evaluate(scope, lookupFunctions);
      return getKeyed(instance, lookup);
    }

    assign(scope, value) {
      let instance = this.object.evaluate(scope);
      let lookup = this.key.evaluate(scope);
      return setKeyed(instance, lookup, value);
    }

    accept(visitor) {
      return visitor.visitAccessKeyed(this);
    }

    connect(binding, scope) {
      this.object.connect(binding, scope);
      let obj = this.object.evaluate(scope);
      if (obj instanceof Object) {
        this.key.connect(binding, scope);
        let key = this.key.evaluate(scope);

        if (key !== null && key !== undefined && !(Array.isArray(obj) && typeof key === 'number')) {
          binding.observeProperty(obj, key);
        }
      }
    }
  };

  let CallScope = class CallScope extends Expression {
    constructor(name, args, ancestor) {
      super();

      this.name = name;
      this.args = args;
      this.ancestor = ancestor;
    }

    evaluate(scope, lookupFunctions, mustEvaluate) {
      let args = evalList(scope, this.args, lookupFunctions);
      let context = getContextFor(this.name, scope, this.ancestor);
      let func = getFunction(context, this.name, mustEvaluate);
      if (func) {
        return func.apply(context, args);
      }
      return undefined;
    }

    accept(visitor) {
      return visitor.visitCallScope(this);
    }

    connect(binding, scope) {
      let args = this.args;
      let i = args.length;
      while (i--) {
        args[i].connect(binding, scope);
      }
    }
  };

  let CallMember = class CallMember extends Expression {
    constructor(object, name, args) {
      super();

      this.object = object;
      this.name = name;
      this.args = args;
    }

    evaluate(scope, lookupFunctions, mustEvaluate) {
      let instance = this.object.evaluate(scope, lookupFunctions);
      let args = evalList(scope, this.args, lookupFunctions);
      let func = getFunction(instance, this.name, mustEvaluate);
      if (func) {
        return func.apply(instance, args);
      }
      return undefined;
    }

    accept(visitor) {
      return visitor.visitCallMember(this);
    }

    connect(binding, scope) {
      this.object.connect(binding, scope);
      let obj = this.object.evaluate(scope);
      if (getFunction(obj, this.name, false)) {
        let args = this.args;
        let i = args.length;
        while (i--) {
          args[i].connect(binding, scope);
        }
      }
    }
  };

  let CallFunction = class CallFunction extends Expression {
    constructor(func, args) {
      super();

      this.func = func;
      this.args = args;
    }

    evaluate(scope, lookupFunctions, mustEvaluate) {
      let func = this.func.evaluate(scope, lookupFunctions);
      if (typeof func === 'function') {
        return func.apply(null, evalList(scope, this.args, lookupFunctions));
      }
      if (!mustEvaluate && (func === null || func === undefined)) {
        return undefined;
      }
      throw new Error(`${this.func} is not a function`);
    }

    accept(visitor) {
      return visitor.visitCallFunction(this);
    }

    connect(binding, scope) {
      this.func.connect(binding, scope);
      let func = this.func.evaluate(scope);
      if (typeof func === 'function') {
        let args = this.args;
        let i = args.length;
        while (i--) {
          args[i].connect(binding, scope);
        }
      }
    }
  };

  let Binary = class Binary extends Expression {
    constructor(operation, left, right) {
      super();

      this.operation = operation;
      this.left = left;
      this.right = right;
    }

    evaluate(scope, lookupFunctions) {
      let left = this.left.evaluate(scope, lookupFunctions);

      switch (this.operation) {
        case '&&':
          return left && this.right.evaluate(scope, lookupFunctions);
        case '||':
          return left || this.right.evaluate(scope, lookupFunctions);
      }

      let right = this.right.evaluate(scope, lookupFunctions);

      switch (this.operation) {
        case '==':
          return left == right;
        case '===':
          return left === right;
        case '!=':
          return left != right;
        case '!==':
          return left !== right;
        case 'instanceof':
          return typeof right === 'function' && left instanceof right;
        case 'in':
          return typeof right === 'object' && right !== null && left in right;
      }

      if (left === null || right === null || left === undefined || right === undefined) {
        switch (this.operation) {
          case '+':
            if (left !== null && left !== undefined) return left;
            if (right !== null && right !== undefined) return right;
            return 0;
          case '-':
            if (left !== null && left !== undefined) return left;
            if (right !== null && right !== undefined) return 0 - right;
            return 0;
        }

        return null;
      }

      switch (this.operation) {
        case '+':
          return autoConvertAdd(left, right);
        case '-':
          return left - right;
        case '*':
          return left * right;
        case '/':
          return left / right;
        case '%':
          return left % right;
        case '<':
          return left < right;
        case '>':
          return left > right;
        case '<=':
          return left <= right;
        case '>=':
          return left >= right;
        case '^':
          return left ^ right;
      }

      throw new Error(`Internal error [${this.operation}] not handled`);
    }

    accept(visitor) {
      return visitor.visitBinary(this);
    }

    connect(binding, scope) {
      this.left.connect(binding, scope);
      let left = this.left.evaluate(scope);
      if (this.operation === '&&' && !left || this.operation === '||' && left) {
        return;
      }
      this.right.connect(binding, scope);
    }
  };

  let Unary = class Unary extends Expression {
    constructor(operation, expression) {
      super();

      this.operation = operation;
      this.expression = expression;
    }

    evaluate(scope, lookupFunctions) {
      switch (this.operation) {
        case '!':
          return !this.expression.evaluate(scope, lookupFunctions);
        case 'typeof':
          return typeof this.expression.evaluate(scope, lookupFunctions);
        case 'void':
          return void this.expression.evaluate(scope, lookupFunctions);
      }

      throw new Error(`Internal error [${this.operation}] not handled`);
    }

    accept(visitor) {
      return visitor.visitPrefix(this);
    }

    connect(binding, scope) {
      this.expression.connect(binding, scope);
    }
  };

  let LiteralPrimitive = class LiteralPrimitive extends Expression {
    constructor(value) {
      super();

      this.value = value;
    }

    evaluate(scope, lookupFunctions) {
      return this.value;
    }

    accept(visitor) {
      return visitor.visitLiteralPrimitive(this);
    }

    connect(binding, scope) {}
  };

  let LiteralString = class LiteralString extends Expression {
    constructor(value) {
      super();

      this.value = value;
    }

    evaluate(scope, lookupFunctions) {
      return this.value;
    }

    accept(visitor) {
      return visitor.visitLiteralString(this);
    }

    connect(binding, scope) {}
  };

  let LiteralTemplate = class LiteralTemplate extends Expression {
    constructor(cooked, expressions, raw, tag) {
      super();
      this.cooked = cooked;
      this.expressions = expressions || [];
      this.length = this.expressions.length;
      this.tagged = tag !== undefined;
      if (this.tagged) {
        this.cooked.raw = raw;
        this.tag = tag;
        if (tag instanceof AccessScope) {
          this.contextType = 'Scope';
        } else if (tag instanceof AccessMember || tag instanceof AccessKeyed) {
          this.contextType = 'Object';
        } else {
          throw new Error(`${this.tag} is not a valid template tag`);
        }
      }
    }

    getScopeContext(scope, lookupFunctions) {
      return getContextFor(this.tag.name, scope, this.tag.ancestor);
    }

    getObjectContext(scope, lookupFunctions) {
      return this.tag.object.evaluate(scope, lookupFunctions);
    }

    evaluate(scope, lookupFunctions, mustEvaluate) {
      const results = new Array(this.length);
      for (let i = 0; i < this.length; i++) {
        results[i] = this.expressions[i].evaluate(scope, lookupFunctions);
      }
      if (this.tagged) {
        const func = this.tag.evaluate(scope, lookupFunctions);
        if (typeof func === 'function') {
          const context = this[`get${this.contextType}Context`](scope, lookupFunctions);
          return func.call(context, this.cooked, ...results);
        }
        if (!mustEvaluate) {
          return null;
        }
        throw new Error(`${this.tag} is not a function`);
      }
      let result = this.cooked[0];
      for (let i = 0; i < this.length; i++) {
        result = String.prototype.concat(result, results[i], this.cooked[i + 1]);
      }
      return result;
    }

    accept(visitor) {
      return visitor.visitLiteralTemplate(this);
    }

    connect(binding, scope) {
      for (let i = 0; i < this.length; i++) {
        this.expressions[i].connect(binding, scope);
      }
      if (this.tagged) {
        this.tag.connect(binding, scope);
      }
    }
  };

  let LiteralArray = class LiteralArray extends Expression {
    constructor(elements) {
      super();

      this.elements = elements;
    }

    evaluate(scope, lookupFunctions) {
      let elements = this.elements;
      let result = [];

      for (let i = 0, length = elements.length; i < length; ++i) {
        result[i] = elements[i].evaluate(scope, lookupFunctions);
      }

      return result;
    }

    accept(visitor) {
      return visitor.visitLiteralArray(this);
    }

    connect(binding, scope) {
      let length = this.elements.length;
      for (let i = 0; i < length; i++) {
        this.elements[i].connect(binding, scope);
      }
    }
  };

  let LiteralObject = class LiteralObject extends Expression {
    constructor(keys, values) {
      super();

      this.keys = keys;
      this.values = values;
    }

    evaluate(scope, lookupFunctions) {
      let instance = {};
      let keys = this.keys;
      let values = this.values;

      for (let i = 0, length = keys.length; i < length; ++i) {
        instance[keys[i]] = values[i].evaluate(scope, lookupFunctions);
      }

      return instance;
    }

    accept(visitor) {
      return visitor.visitLiteralObject(this);
    }

    connect(binding, scope) {
      let length = this.keys.length;
      for (let i = 0; i < length; i++) {
        this.values[i].connect(binding, scope);
      }
    }
  };

  function evalList(scope, list, lookupFunctions) {
    const length = list.length;
    const result = [];
    for (let i = 0; i < length; i++) {
      result[i] = list[i].evaluate(scope, lookupFunctions);
    }
    return result;
  }

  function autoConvertAdd(a, b) {
    if (a !== null && b !== null) {
      if (typeof a === 'string' && typeof b !== 'string') {
        return a + b.toString();
      }

      if (typeof a !== 'string' && typeof b === 'string') {
        return a.toString() + b;
      }

      return a + b;
    }

    if (a !== null) {
      return a;
    }

    if (b !== null) {
      return b;
    }

    return 0;
  }

  function getFunction(obj, name, mustExist) {
    let func = obj === null || obj === undefined ? null : obj[name];
    if (typeof func === 'function') {
      return func;
    }
    if (!mustExist && (func === null || func === undefined)) {
      return null;
    }
    throw new Error(`${name} is not a function`);
  }

  function getKeyed(obj, key) {
    if (Array.isArray(obj)) {
      return obj[parseInt(key, 10)];
    } else if (obj) {
      return obj[key];
    } else if (obj === null || obj === undefined) {
      return undefined;
    }

    return obj[key];
  }

  function setKeyed(obj, key, value) {
    if (Array.isArray(obj)) {
      let index = parseInt(key, 10);

      if (obj.length <= index) {
        obj.length = index + 1;
      }

      obj[index] = value;
    } else {
      obj[key] = value;
    }

    return value;
  }

  exports.Unparser = null;

  let ExpressionCloner = class ExpressionCloner {
    cloneExpressionArray(array) {
      let clonedArray = [];
      let i = array.length;
      while (i--) {
        clonedArray[i] = array[i].accept(this);
      }
      return clonedArray;
    }

    visitBindingBehavior(behavior) {
      return new BindingBehavior(behavior.expression.accept(this), behavior.name, this.cloneExpressionArray(behavior.args));
    }

    visitValueConverter(converter) {
      return new ValueConverter(converter.expression.accept(this), converter.name, this.cloneExpressionArray(converter.args));
    }

    visitAssign(assign) {
      return new Assign(assign.target.accept(this), assign.value.accept(this));
    }

    visitConditional(conditional) {
      return new Conditional(conditional.condition.accept(this), conditional.yes.accept(this), conditional.no.accept(this));
    }

    visitAccessThis(access) {
      return new AccessThis(access.ancestor);
    }

    visitAccessScope(access) {
      return new AccessScope(access.name, access.ancestor);
    }

    visitAccessMember(access) {
      return new AccessMember(access.object.accept(this), access.name);
    }

    visitAccessKeyed(access) {
      return new AccessKeyed(access.object.accept(this), access.key.accept(this));
    }

    visitCallScope(call) {
      return new CallScope(call.name, this.cloneExpressionArray(call.args), call.ancestor);
    }

    visitCallFunction(call) {
      return new CallFunction(call.func.accept(this), this.cloneExpressionArray(call.args));
    }

    visitCallMember(call) {
      return new CallMember(call.object.accept(this), call.name, this.cloneExpressionArray(call.args));
    }

    visitUnary(unary) {
      return new Unary(prefix.operation, prefix.expression.accept(this));
    }

    visitBinary(binary) {
      return new Binary(binary.operation, binary.left.accept(this), binary.right.accept(this));
    }

    visitLiteralPrimitive(literal) {
      return new LiteralPrimitive(literal);
    }

    visitLiteralArray(literal) {
      return new LiteralArray(this.cloneExpressionArray(literal.elements));
    }

    visitLiteralObject(literal) {
      return new LiteralObject(literal.keys, this.cloneExpressionArray(literal.values));
    }

    visitLiteralString(literal) {
      return new LiteralString(literal.value);
    }

    visitLiteralTemplate(literal) {
      return new LiteralTemplate(literal.cooked, this.cloneExpressionArray(literal.expressions), literal.raw, literal.tag && literal.tag.accept(this));
    }
  };

  function cloneExpression(expression) {
    let visitor = new ExpressionCloner();
    return expression.accept(visitor);
  }

  const bindingMode = {
    oneTime: 0,
    toView: 1,
    oneWay: 1,
    twoWay: 2,
    fromView: 3
  };

  let Parser = class Parser {
    constructor() {
      this.cache = Object.create(null);
    }

    parse(src) {
      src = src || '';

      return this.cache[src] || (this.cache[src] = new ParserImplementation(src).parseBindingBehavior());
    }
  };

  const fromCharCode = String.fromCharCode;

  let ParserImplementation = class ParserImplementation {
    get raw() {
      return this.src.slice(this.start, this.idx);
    }

    constructor(src) {
      this.idx = 0;

      this.start = 0;

      this.src = src;
      this.len = src.length;

      this.tkn = T$EOF;

      this.val = undefined;

      this.ch = src.charCodeAt(0);
    }

    parseBindingBehavior() {
      this.nextToken();
      if (this.tkn & T$ExpressionTerminal) {
        this.err('Invalid start of expression');
      }
      let result = this.parseValueConverter();
      while (this.opt(T$Ampersand)) {
        result = new BindingBehavior(result, this.val, this.parseVariadicArgs());
      }
      if (this.tkn !== T$EOF) {
        this.err(`Unconsumed token ${this.raw}`);
      }
      return result;
    }

    parseValueConverter() {
      let result = this.parseExpression();
      while (this.opt(T$Bar)) {
        result = new ValueConverter(result, this.val, this.parseVariadicArgs());
      }
      return result;
    }

    parseVariadicArgs() {
      this.nextToken();
      const result = [];
      while (this.opt(T$Colon)) {
        result.push(this.parseExpression());
      }
      return result;
    }

    parseExpression() {
      let exprStart = this.idx;
      let result = this.parseConditional();

      while (this.tkn === T$Eq) {
        if (!result.isAssignable) {
          this.err(`Expression ${this.src.slice(exprStart, this.start)} is not assignable`);
        }
        this.nextToken();
        exprStart = this.idx;
        result = new Assign(result, this.parseConditional());
      }
      return result;
    }

    parseConditional() {
      let result = this.parseBinary(0);

      if (this.opt(T$Question)) {
        let yes = this.parseExpression();
        this.expect(T$Colon);
        result = new Conditional(result, yes, this.parseExpression());
      }
      return result;
    }

    parseBinary(minPrecedence) {
      let left = this.parseLeftHandSide(0);

      while (this.tkn & T$BinaryOp) {
        const opToken = this.tkn;
        if ((opToken & T$Precedence) <= minPrecedence) {
          break;
        }
        this.nextToken();
        left = new Binary(TokenValues[opToken & T$TokenMask], left, this.parseBinary(opToken & T$Precedence));
      }
      return left;
    }

    parseLeftHandSide(context) {
      let result;

      primary: switch (this.tkn) {
        case T$Plus:
          this.nextToken();
          return this.parseLeftHandSide(0);
        case T$Minus:
          this.nextToken();
          return new Binary('-', new LiteralPrimitive(0), this.parseLeftHandSide(0));
        case T$Bang:
        case T$TypeofKeyword:
        case T$VoidKeyword:
          const op = TokenValues[this.tkn & T$TokenMask];
          this.nextToken();
          return new Unary(op, this.parseLeftHandSide(0));
        case T$ParentScope:
          {
            do {
              this.nextToken();
              context++;
              if (this.opt(T$Period)) {
                if (this.tkn === T$Period) {
                  this.err();
                }
                continue;
              } else if (this.tkn & T$AccessScopeTerminal) {
                result = new AccessThis(context & C$Ancestor);

                context = context & C$ShorthandProp | C$This;
                break primary;
              } else {
                this.err();
              }
            } while (this.tkn === T$ParentScope);
          }

        case T$Identifier:
          {
            result = new AccessScope(this.val, context & C$Ancestor);
            this.nextToken();
            context = context & C$ShorthandProp | C$Scope;
            break;
          }
        case T$ThisScope:
          this.nextToken();
          result = new AccessThis(0);
          context = context & C$ShorthandProp | C$This;
          break;
        case T$LParen:
          this.nextToken();
          result = this.parseExpression();
          this.expect(T$RParen);
          context = C$Primary;
          break;
        case T$LBracket:
          {
            this.nextToken();
            const elements = [];
            if (this.tkn !== T$RBracket) {
              do {
                elements.push(this.parseExpression());
              } while (this.opt(T$Comma));
            }
            this.expect(T$RBracket);
            result = new LiteralArray(elements);
            context = C$Primary;
            break;
          }
        case T$LBrace:
          {
            const keys = [];
            const values = [];
            this.nextToken();
            while (this.tkn !== T$RBrace) {
              if (this.tkn & T$IdentifierOrKeyword) {
                const { ch, tkn, idx } = this;
                keys.push(this.val);
                this.nextToken();
                if (this.opt(T$Colon)) {
                  values.push(this.parseExpression());
                } else {
                  this.ch = ch;
                  this.tkn = tkn;
                  this.idx = idx;
                  values.push(this.parseLeftHandSide(C$ShorthandProp));
                }
              } else if (this.tkn & T$Literal) {
                keys.push(this.val);
                this.nextToken();
                this.expect(T$Colon);
                values.push(this.parseExpression());
              } else {
                this.err();
              }
              if (this.tkn !== T$RBrace) {
                this.expect(T$Comma);
              }
            }
            this.expect(T$RBrace);
            result = new LiteralObject(keys, values);
            context = C$Primary;
            break;
          }
        case T$StringLiteral:
          result = new LiteralString(this.val);
          this.nextToken();
          context = C$Primary;
          break;
        case T$TemplateTail:
          result = new LiteralTemplate([this.val]);
          this.nextToken();
          context = C$Primary;
          break;
        case T$TemplateContinuation:
          result = this.parseTemplate(0);
          context = C$Primary;
          break;
        case T$NumericLiteral:
          {
            result = new LiteralPrimitive(this.val);
            this.nextToken();

            break;
          }
        case T$NullKeyword:
        case T$UndefinedKeyword:
        case T$TrueKeyword:
        case T$FalseKeyword:
          result = new LiteralPrimitive(TokenValues[this.tkn & T$TokenMask]);
          this.nextToken();
          context = C$Primary;
          break;
        default:
          if (this.idx >= this.len) {
            this.err('Unexpected end of expression');
          } else {
            this.err();
          }
      }

      if (context & C$ShorthandProp) {
        return result;
      }

      let name = this.val;
      while (this.tkn & T$MemberOrCallExpression) {
        switch (this.tkn) {
          case T$Period:
            this.nextToken();
            if (!(this.tkn & T$IdentifierOrKeyword)) {
              this.err();
            }
            name = this.val;
            this.nextToken();

            context = context & C$Primary | (context & (C$This | C$Scope)) << 1 | context & C$Member | (context & C$Keyed) >> 1 | (context & C$Call) >> 2;
            if (this.tkn === T$LParen) {
              continue;
            }
            if (context & C$Scope) {
              result = new AccessScope(name, result.ancestor);
            } else {
              result = new AccessMember(result, name);
            }
            continue;
          case T$LBracket:
            this.nextToken();
            context = C$Keyed;
            result = new AccessKeyed(result, this.parseExpression());
            this.expect(T$RBracket);
            break;
          case T$LParen:
            this.nextToken();
            const args = [];
            while (this.tkn !== T$RParen) {
              args.push(this.parseExpression());
              if (!this.opt(T$Comma)) {
                break;
              }
            }
            this.expect(T$RParen);
            if (context & C$Scope) {
              result = new CallScope(name, args, result.ancestor);
            } else if (context & (C$Member | C$Primary)) {
              result = new CallMember(result, name, args);
            } else {
              result = new CallFunction(result, args);
            }
            context = C$Call;
            break;
          case T$TemplateTail:
            result = new LiteralTemplate([this.val], [], [this.raw], result);
            this.nextToken();
            break;
          case T$TemplateContinuation:
            result = this.parseTemplate(context | C$Tagged, result);
        }
      }

      return result;
    }

    parseTemplate(context, func) {
      const cooked = [this.val];
      const raw = context & C$Tagged ? [this.raw] : undefined;
      this.expect(T$TemplateContinuation);
      const expressions = [this.parseExpression()];

      while ((this.tkn = this.scanTemplateTail()) !== T$TemplateTail) {
        cooked.push(this.val);
        if (context & C$Tagged) {
          raw.push(this.raw);
        }
        this.expect(T$TemplateContinuation);
        expressions.push(this.parseExpression());
      }

      cooked.push(this.val);
      if (context & C$Tagged) {
        raw.push(this.raw);
      }
      this.nextToken();
      return new LiteralTemplate(cooked, expressions, raw, func);
    }

    nextToken() {
      while (this.idx < this.len) {
        if (this.ch <= 0x20) {
          this.next();
          continue;
        }
        this.start = this.idx;
        if (this.ch === 0x24 || this.ch >= 0x61 && this.ch <= 0x7A) {
          this.tkn = this.scanIdentifier();
          return;
        }

        if ((this.tkn = CharScanners[this.ch](this)) !== null) {
          return;
        }
      }
      this.tkn = T$EOF;
    }

    next() {
      return this.ch = this.src.charCodeAt(++this.idx);
    }

    scanIdentifier() {
      while (AsciiIdParts.has(this.next()) || this.ch > 0x7F && IdParts[this.ch]) {}

      return KeywordLookup[this.val = this.raw] || T$Identifier;
    }

    scanNumber(isFloat) {
      if (isFloat) {
        this.val = 0;
      } else {
        this.val = this.ch - 0x30;
        while (this.next() <= 0x39 && this.ch >= 0x30) {
          this.val = this.val * 10 + this.ch - 0x30;
        }
      }

      if (isFloat || this.ch === 0x2E) {
        if (!isFloat) {
          this.next();
        }
        const start = this.idx;
        let value = this.ch - 0x30;
        while (this.next() <= 0x39 && this.ch >= 0x30) {
          value = value * 10 + this.ch - 0x30;
        }
        this.val = this.val + value / Math.pow(10, this.idx - start);
      }

      if (this.ch === 0x65 || this.ch === 0x45) {
        const start = this.idx;

        this.next();
        if (this.ch === 0x2D || this.ch === 0x2B) {
          this.next();
        }

        if (!(this.ch >= 0x30 && this.ch <= 0x39)) {
          this.idx = start;
          this.err('Invalid exponent');
        }
        while (this.next() <= 0x39 && this.ch >= 0x30) {}
        this.val = parseFloat(this.src.slice(this.start, this.idx));
      }

      return T$NumericLiteral;
    }

    scanString() {
      let quote = this.ch;
      this.next();

      let buffer;
      let marker = this.idx;

      while (this.ch !== quote) {
        if (this.ch === 0x5C) {
          if (!buffer) {
            buffer = [];
          }

          buffer.push(this.src.slice(marker, this.idx));

          this.next();

          let unescaped;

          if (this.ch === 0x75) {
            this.next();

            if (this.idx + 4 < this.len) {
              let hex = this.src.slice(this.idx, this.idx + 4);

              if (!/[A-Z0-9]{4}/i.test(hex)) {
                this.err(`Invalid unicode escape [\\u${hex}]`);
              }

              unescaped = parseInt(hex, 16);
              this.idx += 4;
              this.ch = this.src.charCodeAt(this.idx);
            } else {
              this.err();
            }
          } else {
            unescaped = unescape(this.ch);
            this.next();
          }

          buffer.push(fromCharCode(unescaped));
          marker = this.idx;
        } else if (this.ch === 0 || this.idx >= this.len) {
          this.err('Unterminated quote');
        } else {
          this.next();
        }
      }

      let last = this.src.slice(marker, this.idx);
      this.next();
      let unescaped = last;

      if (buffer !== null && buffer !== undefined) {
        buffer.push(last);
        unescaped = buffer.join('');
      }

      this.val = unescaped;
      return T$StringLiteral;
    }

    scanTemplate() {
      let tail = true;
      let result = '';

      while (this.next() !== 0x60) {
        if (this.ch === 0x24) {
          if (this.idx + 1 < this.len && this.src.charCodeAt(this.idx + 1) === 0x7B) {
            this.idx++;
            tail = false;
            break;
          } else {
            result += '$';
          }
        } else if (this.ch === 0x5C) {
          result += fromCharCode(unescape(this.next()));
        } else if (this.ch === 0 || this.idx >= this.len) {
          this.err('Unterminated template literal');
        } else {
          result += fromCharCode(this.ch);
        }
      }

      this.next();
      this.val = result;
      if (tail) {
        return T$TemplateTail;
      }
      return T$TemplateContinuation;
    }

    scanTemplateTail() {
      if (this.idx >= this.len) {
        this.err('Unterminated template');
      }
      this.idx--;
      return this.scanTemplate();
    }

    err(message = `Unexpected token ${this.raw}`, column = this.start) {
      throw new Error(`Parser Error: ${message} at column ${column} in expression [${this.src}]`);
    }

    opt(token) {
      if (this.tkn === token) {
        this.nextToken();
        return true;
      }

      return false;
    }

    expect(token) {
      if (this.tkn === token) {
        this.nextToken();
      } else {
        this.err(`Missing expected token ${TokenValues[token & T$TokenMask]}`, this.idx);
      }
    }
  };

  function unescape(code) {
    switch (code) {
      case 0x66:
        return 0xC;
      case 0x6E:
        return 0xA;
      case 0x72:
        return 0xD;
      case 0x74:
        return 0x9;
      case 0x76:
        return 0xB;
      default:
        return code;
    }
  }

  const C$This = 1 << 10;
  const C$Scope = 1 << 11;
  const C$Member = 1 << 12;
  const C$Keyed = 1 << 13;
  const C$Call = 1 << 14;
  const C$Primary = 1 << 15;
  const C$ShorthandProp = 1 << 16;
  const C$Tagged = 1 << 17;

  const C$Ancestor = (1 << 9) - 1;

  const T$TokenMask = (1 << 6) - 1;

  const T$PrecShift = 6;

  const T$Precedence = 7 << T$PrecShift;

  const T$ExpressionTerminal = 1 << 11;

  const T$ClosingToken = 1 << 12;

  const T$OpeningToken = 1 << 13;

  const T$AccessScopeTerminal = 1 << 14;
  const T$Keyword = 1 << 15;
  const T$EOF = 1 << 16 | T$AccessScopeTerminal | T$ExpressionTerminal;
  const T$Identifier = 1 << 17;
  const T$IdentifierOrKeyword = T$Identifier | T$Keyword;
  const T$Literal = 1 << 18;
  const T$NumericLiteral = 1 << 19 | T$Literal;
  const T$StringLiteral = 1 << 20 | T$Literal;
  const T$BinaryOp = 1 << 21;

  const T$UnaryOp = 1 << 22;

  const T$MemberExpression = 1 << 23;

  const T$MemberOrCallExpression = 1 << 24;
  const T$TemplateTail = 1 << 25 | T$MemberOrCallExpression;
  const T$TemplateContinuation = 1 << 26 | T$MemberOrCallExpression;

  const T$FalseKeyword = 0 | T$Keyword | T$Literal;
  const T$TrueKeyword = 1 | T$Keyword | T$Literal;
  const T$NullKeyword = 2 | T$Keyword | T$Literal;
  const T$UndefinedKeyword = 3 | T$Keyword | T$Literal;
  const T$ThisScope = 4 | T$IdentifierOrKeyword;
  const T$ParentScope = 5 | T$IdentifierOrKeyword;

  const T$LParen = 6 | T$OpeningToken | T$AccessScopeTerminal | T$MemberOrCallExpression;
  const T$LBrace = 7 | T$OpeningToken;
  const T$Period = 8 | T$MemberExpression | T$MemberOrCallExpression;
  const T$RBrace = 9 | T$AccessScopeTerminal | T$ClosingToken | T$ExpressionTerminal;
  const T$RParen = 10 | T$AccessScopeTerminal | T$ClosingToken | T$ExpressionTerminal;
  const T$Comma = 11 | T$AccessScopeTerminal;
  const T$LBracket = 12 | T$OpeningToken | T$AccessScopeTerminal | T$MemberExpression | T$MemberOrCallExpression;
  const T$RBracket = 13 | T$ClosingToken | T$ExpressionTerminal;
  const T$Colon = 14 | T$AccessScopeTerminal;
  const T$Question = 15;

  const T$Ampersand = 18 | T$AccessScopeTerminal;
  const T$Bar = 19 | T$AccessScopeTerminal;
  const T$BarBar = 20 | 1 << T$PrecShift | T$BinaryOp;
  const T$AmpersandAmpersand = 21 | 2 << T$PrecShift | T$BinaryOp;
  const T$Caret = 22 | 3 << T$PrecShift | T$BinaryOp;
  const T$EqEq = 23 | 4 << T$PrecShift | T$BinaryOp;
  const T$BangEq = 24 | 4 << T$PrecShift | T$BinaryOp;
  const T$EqEqEq = 25 | 4 << T$PrecShift | T$BinaryOp;
  const T$BangEqEq = 26 | 4 << T$PrecShift | T$BinaryOp;
  const T$Lt = 27 | 5 << T$PrecShift | T$BinaryOp;
  const T$Gt = 28 | 5 << T$PrecShift | T$BinaryOp;
  const T$LtEq = 29 | 5 << T$PrecShift | T$BinaryOp;
  const T$GtEq = 30 | 5 << T$PrecShift | T$BinaryOp;
  const T$InKeyword = 31 | 5 << T$PrecShift | T$BinaryOp | T$Keyword;
  const T$InstanceOfKeyword = 32 | 5 << T$PrecShift | T$BinaryOp | T$Keyword;
  const T$Plus = 33 | 6 << T$PrecShift | T$BinaryOp | T$UnaryOp;
  const T$Minus = 34 | 6 << T$PrecShift | T$BinaryOp | T$UnaryOp;
  const T$TypeofKeyword = 35 | T$UnaryOp | T$Keyword;
  const T$VoidKeyword = 36 | T$UnaryOp | T$Keyword;
  const T$Star = 37 | 7 << T$PrecShift | T$BinaryOp;
  const T$Percent = 38 | 7 << T$PrecShift | T$BinaryOp;
  const T$Slash = 39 | 7 << T$PrecShift | T$BinaryOp;
  const T$Eq = 40;
  const T$Bang = 41 | T$UnaryOp;

  const KeywordLookup = Object.create(null);
  KeywordLookup.true = T$TrueKeyword;
  KeywordLookup.null = T$NullKeyword;
  KeywordLookup.false = T$FalseKeyword;
  KeywordLookup.undefined = T$UndefinedKeyword;
  KeywordLookup.$this = T$ThisScope;
  KeywordLookup.$parent = T$ParentScope;
  KeywordLookup.in = T$InKeyword;
  KeywordLookup.instanceof = T$InstanceOfKeyword;
  KeywordLookup.typeof = T$TypeofKeyword;
  KeywordLookup.void = T$VoidKeyword;

  const TokenValues = [false, true, null, undefined, '$this', '$parent', '(', '{', '.', '}', ')', ',', '[', ']', ':', '?', '\'', '"', '&', '|', '||', '&&', '^', '==', '!=', '===', '!==', '<', '>', '<=', '>=', 'in', 'instanceof', '+', '-', 'typeof', 'void', '*', '%', '/', '=', '!'];

  const codes = {
    AsciiIdPart: [0x24, 0, 0x30, 0x3A, 0x41, 0x5B, 0x5F, 0, 0x61, 0x7B],
    IdStart: [0x24, 0, 0x41, 0x5B, 0x5F, 0, 0x61, 0x7B, 0xAA, 0, 0xBA, 0, 0xC0, 0xD7, 0xD8, 0xF7, 0xF8, 0x2B9, 0x2E0, 0x2E5, 0x1D00, 0x1D26, 0x1D2C, 0x1D5D, 0x1D62, 0x1D66, 0x1D6B, 0x1D78, 0x1D79, 0x1DBF, 0x1E00, 0x1F00, 0x2071, 0, 0x207F, 0, 0x2090, 0x209D, 0x212A, 0x212C, 0x2132, 0, 0x214E, 0, 0x2160, 0x2189, 0x2C60, 0x2C80, 0xA722, 0xA788, 0xA78B, 0xA7AF, 0xA7B0, 0xA7B8, 0xA7F7, 0xA800, 0xAB30, 0xAB5B, 0xAB5C, 0xAB65, 0xFB00, 0xFB07, 0xFF21, 0xFF3B, 0xFF41, 0xFF5B],
    Digit: [0x30, 0x3A],
    Skip: [0, 0x21, 0x7F, 0xA1]
  };

  function decompress(lookup, set, compressed, value) {
    let rangeCount = compressed.length;
    for (let i = 0; i < rangeCount; i += 2) {
      const start = compressed[i];
      let end = compressed[i + 1];
      end = end > 0 ? end : start + 1;
      if (lookup) {
        let j = start;
        while (j < end) {
          lookup[j] = value;
          j++;
        }
      }
      if (set) {
        for (let ch = start; ch < end; ch++) {
          set.add(ch);
        }
      }
    }
  }

  function returnToken(token) {
    return p => {
      p.next();
      return token;
    };
  }
  function unexpectedCharacter(p) {
    p.err(`Unexpected character [${fromCharCode(p.ch)}]`);
    return null;
  }

  const AsciiIdParts = new Set();
  decompress(null, AsciiIdParts, codes.AsciiIdPart, true);

  const IdParts = new Uint8Array(0xFFFF);
  decompress(IdParts, null, codes.IdStart, 1);
  decompress(IdParts, null, codes.Digit, 1);

  const CharScanners = new Array(0xFFFF);
  let ci = 0;
  while (ci < 0xFFFF) {
    CharScanners[ci] = unexpectedCharacter;
    ci++;
  }

  decompress(CharScanners, null, codes.Skip, p => {
    p.next();
    return null;
  });
  decompress(CharScanners, null, codes.IdStart, p => p.scanIdentifier());
  decompress(CharScanners, null, codes.Digit, p => p.scanNumber(false));

  CharScanners[0x22] = CharScanners[0x27] = p => {
    return p.scanString();
  };
  CharScanners[0x60] = p => {
    return p.scanTemplate();
  };

  CharScanners[0x21] = p => {
    if (p.next() !== 0x3D) {
      return T$Bang;
    }
    if (p.next() !== 0x3D) {
      return T$BangEq;
    }
    p.next();
    return T$BangEqEq;
  };

  CharScanners[0x3D] = p => {
    if (p.next() !== 0x3D) {
      return T$Eq;
    }
    if (p.next() !== 0x3D) {
      return T$EqEq;
    }
    p.next();
    return T$EqEqEq;
  };

  CharScanners[0x26] = p => {
    if (p.next() !== 0x26) {
      return T$Ampersand;
    }
    p.next();
    return T$AmpersandAmpersand;
  };

  CharScanners[0x7C] = p => {
    if (p.next() !== 0x7C) {
      return T$Bar;
    }
    p.next();
    return T$BarBar;
  };

  CharScanners[0x2E] = p => {
    if (p.next() <= 0x39 && p.ch >= 0x30) {
      return p.scanNumber(true);
    }
    return T$Period;
  };

  CharScanners[0x3C] = p => {
    if (p.next() !== 0x3D) {
      return T$Lt;
    }
    p.next();
    return T$LtEq;
  };

  CharScanners[0x3E] = p => {
    if (p.next() !== 0x3D) {
      return T$Gt;
    }
    p.next();
    return T$GtEq;
  };

  CharScanners[0x25] = returnToken(T$Percent);
  CharScanners[0x28] = returnToken(T$LParen);
  CharScanners[0x29] = returnToken(T$RParen);
  CharScanners[0x2A] = returnToken(T$Star);
  CharScanners[0x2B] = returnToken(T$Plus);
  CharScanners[0x2C] = returnToken(T$Comma);
  CharScanners[0x2D] = returnToken(T$Minus);
  CharScanners[0x2F] = returnToken(T$Slash);
  CharScanners[0x3A] = returnToken(T$Colon);
  CharScanners[0x3F] = returnToken(T$Question);
  CharScanners[0x5B] = returnToken(T$LBracket);
  CharScanners[0x5D] = returnToken(T$RBracket);
  CharScanners[0x5E] = returnToken(T$Caret);
  CharScanners[0x7B] = returnToken(T$LBrace);
  CharScanners[0x7D] = returnToken(T$RBrace);

  let mapProto = Map.prototype;

  function getMapObserver(taskQueue, map) {
    return ModifyMapObserver.for(taskQueue, map);
  }

  let ModifyMapObserver = class ModifyMapObserver extends ModifyCollectionObserver {
    constructor(taskQueue, map) {
      super(taskQueue, map);
    }

    static for(taskQueue, map) {
      if (!('__map_observer__' in map)) {
        Reflect.defineProperty(map, '__map_observer__', {
          value: ModifyMapObserver.create(taskQueue, map),
          enumerable: false, configurable: false
        });
      }
      return map.__map_observer__;
    }

    static create(taskQueue, map) {
      let observer = new ModifyMapObserver(taskQueue, map);

      let proto = mapProto;
      if (proto.set !== map.set || proto.delete !== map.delete || proto.clear !== map.clear) {
        proto = {
          set: map.set,
          delete: map.delete,
          clear: map.clear
        };
      }

      map.set = function () {
        let hasValue = map.has(arguments[0]);
        let type = hasValue ? 'update' : 'add';
        let oldValue = map.get(arguments[0]);
        let methodCallResult = proto.set.apply(map, arguments);
        if (!hasValue || oldValue !== map.get(arguments[0])) {
          observer.addChangeRecord({
            type: type,
            object: map,
            key: arguments[0],
            oldValue: oldValue
          });
        }
        return methodCallResult;
      };

      map.delete = function () {
        let hasValue = map.has(arguments[0]);
        let oldValue = map.get(arguments[0]);
        let methodCallResult = proto.delete.apply(map, arguments);
        if (hasValue) {
          observer.addChangeRecord({
            type: 'delete',
            object: map,
            key: arguments[0],
            oldValue: oldValue
          });
        }
        return methodCallResult;
      };

      map.clear = function () {
        let methodCallResult = proto.clear.apply(map, arguments);
        observer.addChangeRecord({
          type: 'clear',
          object: map
        });
        return methodCallResult;
      };

      return observer;
    }
  };

  function findOriginalEventTarget(event) {
    return event.path && event.path[0] || event.deepPath && event.deepPath[0] || event.target;
  }

  function stopPropagation() {
    this.standardStopPropagation();
    this.propagationStopped = true;
  }

  function handleCapturedEvent(event) {
    event.propagationStopped = false;
    let target = findOriginalEventTarget(event);

    let orderedCallbacks = [];

    while (target) {
      if (target.capturedCallbacks) {
        let callback = target.capturedCallbacks[event.type];
        if (callback) {
          if (event.stopPropagation !== stopPropagation) {
            event.standardStopPropagation = event.stopPropagation;
            event.stopPropagation = stopPropagation;
          }
          orderedCallbacks.push(callback);
        }
      }
      target = target.parentNode;
    }
    for (let i = orderedCallbacks.length - 1; i >= 0 && !event.propagationStopped; i--) {
      let orderedCallback = orderedCallbacks[i];
      if ('handleEvent' in orderedCallback) {
        orderedCallback.handleEvent(event);
      } else {
        orderedCallback(event);
      }
    }
  }

  let CapturedHandlerEntry = class CapturedHandlerEntry {
    constructor(eventName) {
      this.eventName = eventName;
      this.count = 0;
    }

    increment() {
      this.count++;

      if (this.count === 1) {
        DOM.addEventListener(this.eventName, handleCapturedEvent, true);
      }
    }

    decrement() {
      this.count--;

      if (this.count === 0) {
        DOM.removeEventListener(this.eventName, handleCapturedEvent, true);
      }
    }
  };


  function handleDelegatedEvent(event) {
    event.propagationStopped = false;
    let target = findOriginalEventTarget(event);

    while (target && !event.propagationStopped) {
      if (target.delegatedCallbacks) {
        let callback = target.delegatedCallbacks[event.type];
        if (callback) {
          if (event.stopPropagation !== stopPropagation) {
            event.standardStopPropagation = event.stopPropagation;
            event.stopPropagation = stopPropagation;
          }
          if ('handleEvent' in callback) {
            callback.handleEvent(event);
          } else {
            callback(event);
          }
        }
      }

      target = target.parentNode;
    }
  }

  let DelegateHandlerEntry = class DelegateHandlerEntry {
    constructor(eventName) {
      this.eventName = eventName;
      this.count = 0;
    }

    increment() {
      this.count++;

      if (this.count === 1) {
        DOM.addEventListener(this.eventName, handleDelegatedEvent, false);
      }
    }

    decrement() {
      this.count--;

      if (this.count === 0) {
        DOM.removeEventListener(this.eventName, handleDelegatedEvent, false);
      }
    }
  };
  let DelegationEntryHandler = class DelegationEntryHandler {
    constructor(entry, lookup, targetEvent) {
      this.entry = entry;
      this.lookup = lookup;
      this.targetEvent = targetEvent;
    }

    dispose() {
      this.entry.decrement();
      this.lookup[this.targetEvent] = null;
    }
  };
  let EventHandler = class EventHandler {
    constructor(target, targetEvent, callback) {
      this.target = target;
      this.targetEvent = targetEvent;
      this.callback = callback;
    }

    dispose() {
      this.target.removeEventListener(this.targetEvent, this.callback);
    }
  };
  let DefaultEventStrategy = class DefaultEventStrategy {
    constructor() {
      this.delegatedHandlers = {};
      this.capturedHandlers = {};
    }

    subscribe(target, targetEvent, callback, strategy, disposable) {
      let delegatedHandlers;
      let capturedHandlers;
      let handlerEntry;

      if (strategy === delegationStrategy.bubbling) {
        delegatedHandlers = this.delegatedHandlers;
        handlerEntry = delegatedHandlers[targetEvent] || (delegatedHandlers[targetEvent] = new DelegateHandlerEntry(targetEvent));
        let delegatedCallbacks = target.delegatedCallbacks || (target.delegatedCallbacks = {});

        handlerEntry.increment();
        delegatedCallbacks[targetEvent] = callback;

        if (disposable === true) {
          return new DelegationEntryHandler(handlerEntry, delegatedCallbacks, targetEvent);
        }

        return function () {
          handlerEntry.decrement();
          delegatedCallbacks[targetEvent] = null;
        };
      }
      if (strategy === delegationStrategy.capturing) {
        capturedHandlers = this.capturedHandlers;
        handlerEntry = capturedHandlers[targetEvent] || (capturedHandlers[targetEvent] = new CapturedHandlerEntry(targetEvent));
        let capturedCallbacks = target.capturedCallbacks || (target.capturedCallbacks = {});

        handlerEntry.increment();
        capturedCallbacks[targetEvent] = callback;

        if (disposable === true) {
          return new DelegationEntryHandler(handlerEntry, capturedCallbacks, targetEvent);
        }

        return function () {
          handlerEntry.decrement();
          capturedCallbacks[targetEvent] = null;
        };
      }

      target.addEventListener(targetEvent, callback);

      if (disposable === true) {
        return new EventHandler(target, targetEvent, callback);
      }

      return function () {
        target.removeEventListener(targetEvent, callback);
      };
    }
  };


  const delegationStrategy = {
    none: 0,
    capturing: 1,
    bubbling: 2
  };

  let EventManager = class EventManager {
    constructor() {
      this.elementHandlerLookup = {};
      this.eventStrategyLookup = {};

      this.registerElementConfig({
        tagName: 'input',
        properties: {
          value: ['change', 'input'],
          checked: ['change', 'input'],
          files: ['change', 'input']
        }
      });

      this.registerElementConfig({
        tagName: 'textarea',
        properties: {
          value: ['change', 'input']
        }
      });

      this.registerElementConfig({
        tagName: 'select',
        properties: {
          value: ['change']
        }
      });

      this.registerElementConfig({
        tagName: 'content editable',
        properties: {
          value: ['change', 'input', 'blur', 'keyup', 'paste']
        }
      });

      this.registerElementConfig({
        tagName: 'scrollable element',
        properties: {
          scrollTop: ['scroll'],
          scrollLeft: ['scroll']
        }
      });

      this.defaultEventStrategy = new DefaultEventStrategy();
    }

    registerElementConfig(config) {
      let tagName = config.tagName.toLowerCase();
      let properties = config.properties;
      let propertyName;

      let lookup = this.elementHandlerLookup[tagName] = {};

      for (propertyName in properties) {
        if (properties.hasOwnProperty(propertyName)) {
          lookup[propertyName] = properties[propertyName];
        }
      }
    }

    registerEventStrategy(eventName, strategy) {
      this.eventStrategyLookup[eventName] = strategy;
    }

    getElementHandler(target, propertyName) {
      let tagName;
      let lookup = this.elementHandlerLookup;

      if (target.tagName) {
        tagName = target.tagName.toLowerCase();

        if (lookup[tagName] && lookup[tagName][propertyName]) {
          return new EventSubscriber(lookup[tagName][propertyName]);
        }

        if (propertyName === 'textContent' || propertyName === 'innerHTML') {
          return new EventSubscriber(lookup['content editable'].value);
        }

        if (propertyName === 'scrollTop' || propertyName === 'scrollLeft') {
          return new EventSubscriber(lookup['scrollable element'][propertyName]);
        }
      }

      return null;
    }

    addEventListener(target, targetEvent, callbackOrListener, delegate, disposable) {
      return (this.eventStrategyLookup[targetEvent] || this.defaultEventStrategy).subscribe(target, targetEvent, callbackOrListener, delegate, disposable);
    }
  };

  let EventSubscriber = class EventSubscriber {
    constructor(events) {
      this.events = events;
      this.element = null;
      this.handler = null;
    }

    subscribe(element, callbackOrListener) {
      this.element = element;
      this.handler = callbackOrListener;

      let events = this.events;
      for (let i = 0, ii = events.length; ii > i; ++i) {
        element.addEventListener(events[i], callbackOrListener);
      }
    }

    dispose() {
      if (this.element === null) {
        return;
      }
      let element = this.element;
      let callbackOrListener = this.handler;
      let events = this.events;
      for (let i = 0, ii = events.length; ii > i; ++i) {
        element.removeEventListener(events[i], callbackOrListener);
      }
      this.element = this.handler = null;
    }
  };

  let DirtyChecker = class DirtyChecker {
    constructor() {
      this.tracked = [];
      this.checkDelay = 120;
    }

    addProperty(property) {
      let tracked = this.tracked;

      tracked.push(property);

      if (tracked.length === 1) {
        this.scheduleDirtyCheck();
      }
    }

    removeProperty(property) {
      let tracked = this.tracked;
      tracked.splice(tracked.indexOf(property), 1);
    }

    scheduleDirtyCheck() {
      setTimeout(() => this.check(), this.checkDelay);
    }

    check() {
      let tracked = this.tracked;
      let i = tracked.length;

      while (i--) {
        let current = tracked[i];

        if (current.isDirty()) {
          current.call();
        }
      }

      if (tracked.length) {
        this.scheduleDirtyCheck();
      }
    }
  };

  let DirtyCheckProperty = (_dec5$1 = subscriberCollection(), _dec5$1(_class5$1 = class DirtyCheckProperty {
    constructor(dirtyChecker, obj, propertyName) {
      this.dirtyChecker = dirtyChecker;
      this.obj = obj;
      this.propertyName = propertyName;
    }

    getValue() {
      return this.obj[this.propertyName];
    }

    setValue(newValue) {
      this.obj[this.propertyName] = newValue;
    }

    call() {
      let oldValue = this.oldValue;
      let newValue = this.getValue();

      this.callSubscribers(newValue, oldValue);

      this.oldValue = newValue;
    }

    isDirty() {
      return this.oldValue !== this.obj[this.propertyName];
    }

    subscribe(context, callable) {
      if (!this.hasSubscribers()) {
        this.oldValue = this.getValue();
        this.dirtyChecker.addProperty(this);
      }
      this.addSubscriber(context, callable);
    }

    unsubscribe(context, callable) {
      if (this.removeSubscriber(context, callable) && !this.hasSubscribers()) {
        this.dirtyChecker.removeProperty(this);
      }
    }
  }) || _class5$1);

  const logger = getLogger('property-observation');

  const propertyAccessor = {
    getValue: (obj, propertyName) => obj[propertyName],
    setValue: (value, obj, propertyName) => {
      obj[propertyName] = value;
    }
  };

  let PrimitiveObserver = class PrimitiveObserver {

    constructor(primitive, propertyName) {
      this.doNotCache = true;

      this.primitive = primitive;
      this.propertyName = propertyName;
    }

    getValue() {
      return this.primitive[this.propertyName];
    }

    setValue() {
      let type = typeof this.primitive;
      throw new Error(`The ${this.propertyName} property of a ${type} (${this.primitive}) cannot be assigned.`);
    }

    subscribe() {}

    unsubscribe() {}
  };

  let SetterObserver = (_dec6$1 = subscriberCollection(), _dec6$1(_class7$1 = class SetterObserver {
    constructor(taskQueue, obj, propertyName) {
      this.taskQueue = taskQueue;
      this.obj = obj;
      this.propertyName = propertyName;
      this.queued = false;
      this.observing = false;
    }

    getValue() {
      return this.obj[this.propertyName];
    }

    setValue(newValue) {
      this.obj[this.propertyName] = newValue;
    }

    getterValue() {
      return this.currentValue;
    }

    setterValue(newValue) {
      let oldValue = this.currentValue;

      if (oldValue !== newValue) {
        if (!this.queued) {
          this.oldValue = oldValue;
          this.queued = true;
          this.taskQueue.queueMicroTask(this);
        }

        this.currentValue = newValue;
      }
    }

    call() {
      let oldValue = this.oldValue;
      let newValue = this.currentValue;

      this.queued = false;

      this.callSubscribers(newValue, oldValue);
    }

    subscribe(context, callable) {
      if (!this.observing) {
        this.convertProperty();
      }
      this.addSubscriber(context, callable);
    }

    unsubscribe(context, callable) {
      this.removeSubscriber(context, callable);
    }

    convertProperty() {
      this.observing = true;
      this.currentValue = this.obj[this.propertyName];
      this.setValue = this.setterValue;
      this.getValue = this.getterValue;

      if (!Reflect.defineProperty(this.obj, this.propertyName, {
        configurable: true,
        enumerable: this.propertyName in this.obj ? this.obj.propertyIsEnumerable(this.propertyName) : true,
        get: this.getValue.bind(this),
        set: this.setValue.bind(this)
      })) {
        logger.warn(`Cannot observe property '${this.propertyName}' of object`, this.obj);
      }
    }
  }) || _class7$1);

  let XLinkAttributeObserver = class XLinkAttributeObserver {
    constructor(element, propertyName, attributeName) {
      this.element = element;
      this.propertyName = propertyName;
      this.attributeName = attributeName;
    }

    getValue() {
      return this.element.getAttributeNS('http://www.w3.org/1999/xlink', this.attributeName);
    }

    setValue(newValue) {
      return this.element.setAttributeNS('http://www.w3.org/1999/xlink', this.attributeName, newValue);
    }

    subscribe() {
      throw new Error(`Observation of a "${this.element.nodeName}" element\'s "${this.propertyName}" property is not supported.`);
    }
  };

  const dataAttributeAccessor = {
    getValue: (obj, propertyName) => obj.getAttribute(propertyName),
    setValue: (value, obj, propertyName) => {
      if (value === null || value === undefined) {
        obj.removeAttribute(propertyName);
      } else {
        obj.setAttribute(propertyName, value);
      }
    }
  };

  let DataAttributeObserver = class DataAttributeObserver {
    constructor(element, propertyName) {
      this.element = element;
      this.propertyName = propertyName;
    }

    getValue() {
      return this.element.getAttribute(this.propertyName);
    }

    setValue(newValue) {
      if (newValue === null || newValue === undefined) {
        return this.element.removeAttribute(this.propertyName);
      }
      return this.element.setAttribute(this.propertyName, newValue);
    }

    subscribe() {
      throw new Error(`Observation of a "${this.element.nodeName}" element\'s "${this.propertyName}" property is not supported.`);
    }
  };

  let StyleObserver = class StyleObserver {
    constructor(element, propertyName) {
      this.element = element;
      this.propertyName = propertyName;

      this.styles = null;
      this.version = 0;
    }

    getValue() {
      return this.element.style.cssText;
    }

    _setProperty(style, value) {
      let priority = '';

      if (value !== null && value !== undefined && typeof value.indexOf === 'function' && value.indexOf('!important') !== -1) {
        priority = 'important';
        value = value.replace('!important', '');
      }
      this.element.style.setProperty(style, value, priority);
    }

    setValue(newValue) {
      let styles = this.styles || {};
      let style;
      let version = this.version;

      if (newValue !== null && newValue !== undefined) {
        if (newValue instanceof Object) {
          let value;
          for (style in newValue) {
            if (newValue.hasOwnProperty(style)) {
              value = newValue[style];
              style = style.replace(/([A-Z])/g, m => '-' + m.toLowerCase());
              styles[style] = version;
              this._setProperty(style, value);
            }
          }
        } else if (newValue.length) {
          let rx = /\s*([\w\-]+)\s*:\s*((?:(?:[\w\-]+\(\s*(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|[\w\-]+\(\s*(?:^"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|[^\)]*)\),?|[^\)]*)\),?|"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|[^;]*),?\s*)+);?/g;
          let pair;
          while ((pair = rx.exec(newValue)) !== null) {
            style = pair[1];
            if (!style) {
              continue;
            }

            styles[style] = version;
            this._setProperty(style, pair[2]);
          }
        }
      }

      this.styles = styles;
      this.version += 1;

      if (version === 0) {
        return;
      }

      version -= 1;
      for (style in styles) {
        if (!styles.hasOwnProperty(style) || styles[style] !== version) {
          continue;
        }

        this.element.style.removeProperty(style);
      }
    }

    subscribe() {
      throw new Error(`Observation of a "${this.element.nodeName}" element\'s "${this.propertyName}" property is not supported.`);
    }
  };

  let ValueAttributeObserver = (_dec7$1 = subscriberCollection(), _dec7$1(_class8 = class ValueAttributeObserver {
    constructor(element, propertyName, handler) {
      this.element = element;
      this.propertyName = propertyName;
      this.handler = handler;
      if (propertyName === 'files') {
        this.setValue = () => {};
      }
    }

    getValue() {
      return this.element[this.propertyName];
    }

    setValue(newValue) {
      newValue = newValue === undefined || newValue === null ? '' : newValue;
      if (this.element[this.propertyName] !== newValue) {
        this.element[this.propertyName] = newValue;
        this.notify();
      }
    }

    notify() {
      let oldValue = this.oldValue;
      let newValue = this.getValue();

      this.callSubscribers(newValue, oldValue);

      this.oldValue = newValue;
    }

    handleEvent() {
      this.notify();
    }

    subscribe(context, callable) {
      if (!this.hasSubscribers()) {
        this.oldValue = this.getValue();
        this.handler.subscribe(this.element, this);
      }

      this.addSubscriber(context, callable);
    }

    unsubscribe(context, callable) {
      if (this.removeSubscriber(context, callable) && !this.hasSubscribers()) {
        this.handler.dispose();
      }
    }
  }) || _class8);

  const checkedArrayContext = 'CheckedObserver:array';
  const checkedValueContext = 'CheckedObserver:value';

  let CheckedObserver = (_dec8 = subscriberCollection(), _dec8(_class9 = class CheckedObserver {
    constructor(element, handler, observerLocator) {
      this.element = element;
      this.handler = handler;
      this.observerLocator = observerLocator;
    }

    getValue() {
      return this.value;
    }

    setValue(newValue) {
      if (this.initialSync && this.value === newValue) {
        return;
      }

      if (this.arrayObserver) {
        this.arrayObserver.unsubscribe(checkedArrayContext, this);
        this.arrayObserver = null;
      }

      if (this.element.type === 'checkbox' && Array.isArray(newValue)) {
        this.arrayObserver = this.observerLocator.getArrayObserver(newValue);
        this.arrayObserver.subscribe(checkedArrayContext, this);
      }

      this.oldValue = this.value;
      this.value = newValue;
      this.synchronizeElement();
      this.notify();

      if (!this.initialSync) {
        this.initialSync = true;
        this.observerLocator.taskQueue.queueMicroTask(this);
      }
    }

    call(context, splices) {
      this.synchronizeElement();

      if (!this.valueObserver) {
        this.valueObserver = this.element.__observers__.model || this.element.__observers__.value;
        if (this.valueObserver) {
          this.valueObserver.subscribe(checkedValueContext, this);
        }
      }
    }

    synchronizeElement() {
      let value = this.value;
      let element = this.element;
      let elementValue = element.hasOwnProperty('model') ? element.model : element.value;
      let isRadio = element.type === 'radio';
      let matcher = element.matcher || ((a, b) => a === b);

      element.checked = isRadio && !!matcher(value, elementValue) || !isRadio && value === true || !isRadio && Array.isArray(value) && value.findIndex(item => !!matcher(item, elementValue)) !== -1;
    }

    synchronizeValue() {
      let value = this.value;
      let element = this.element;
      let elementValue = element.hasOwnProperty('model') ? element.model : element.value;
      let index;
      let matcher = element.matcher || ((a, b) => a === b);

      if (element.type === 'checkbox') {
        if (Array.isArray(value)) {
          index = value.findIndex(item => !!matcher(item, elementValue));
          if (element.checked && index === -1) {
            value.push(elementValue);
          } else if (!element.checked && index !== -1) {
            value.splice(index, 1);
          }

          return;
        }

        value = element.checked;
      } else if (element.checked) {
        value = elementValue;
      } else {
        return;
      }

      this.oldValue = this.value;
      this.value = value;
      this.notify();
    }

    notify() {
      let oldValue = this.oldValue;
      let newValue = this.value;

      if (newValue === oldValue) {
        return;
      }

      this.callSubscribers(newValue, oldValue);
    }

    handleEvent() {
      this.synchronizeValue();
    }

    subscribe(context, callable) {
      if (!this.hasSubscribers()) {
        this.handler.subscribe(this.element, this);
      }
      this.addSubscriber(context, callable);
    }

    unsubscribe(context, callable) {
      if (this.removeSubscriber(context, callable) && !this.hasSubscribers()) {
        this.handler.dispose();
      }
    }

    unbind() {
      if (this.arrayObserver) {
        this.arrayObserver.unsubscribe(checkedArrayContext, this);
        this.arrayObserver = null;
      }
      if (this.valueObserver) {
        this.valueObserver.unsubscribe(checkedValueContext, this);
      }
    }
  }) || _class9);

  const selectArrayContext = 'SelectValueObserver:array';

  let SelectValueObserver = (_dec9 = subscriberCollection(), _dec9(_class10 = class SelectValueObserver {
    constructor(element, handler, observerLocator) {
      this.element = element;
      this.handler = handler;
      this.observerLocator = observerLocator;
    }

    getValue() {
      return this.value;
    }

    setValue(newValue) {
      if (newValue !== null && newValue !== undefined && this.element.multiple && !Array.isArray(newValue)) {
        throw new Error('Only null or Array instances can be bound to a multi-select.');
      }
      if (this.value === newValue) {
        return;
      }

      if (this.arrayObserver) {
        this.arrayObserver.unsubscribe(selectArrayContext, this);
        this.arrayObserver = null;
      }

      if (Array.isArray(newValue)) {
        this.arrayObserver = this.observerLocator.getArrayObserver(newValue);
        this.arrayObserver.subscribe(selectArrayContext, this);
      }

      this.oldValue = this.value;
      this.value = newValue;
      this.synchronizeOptions();
      this.notify();

      if (!this.initialSync) {
        this.initialSync = true;
        this.observerLocator.taskQueue.queueMicroTask(this);
      }
    }

    call(context, splices) {
      this.synchronizeOptions();
    }

    synchronizeOptions() {
      let value = this.value;
      let isArray;

      if (Array.isArray(value)) {
        isArray = true;
      }

      let options = this.element.options;
      let i = options.length;
      let matcher = this.element.matcher || ((a, b) => a === b);
      while (i--) {
        let option = options.item(i);
        let optionValue = option.hasOwnProperty('model') ? option.model : option.value;
        if (isArray) {
          option.selected = value.findIndex(item => !!matcher(optionValue, item)) !== -1;
          continue;
        }
        option.selected = !!matcher(optionValue, value);
      }
    }

    synchronizeValue() {
      let options = this.element.options;
      let count = 0;
      let value = [];

      for (let i = 0, ii = options.length; i < ii; i++) {
        let option = options.item(i);
        if (!option.selected) {
          continue;
        }
        value.push(option.hasOwnProperty('model') ? option.model : option.value);
        count++;
      }

      if (this.element.multiple) {
        if (Array.isArray(this.value)) {
          let matcher = this.element.matcher || ((a, b) => a === b);

          let i = 0;
          while (i < this.value.length) {
            let a = this.value[i];
            if (value.findIndex(b => matcher(a, b)) === -1) {
              this.value.splice(i, 1);
            } else {
              i++;
            }
          }

          i = 0;
          while (i < value.length) {
            let a = value[i];
            if (this.value.findIndex(b => matcher(a, b)) === -1) {
              this.value.push(a);
            }
            i++;
          }
          return;
        }
      } else {
        if (count === 0) {
          value = null;
        } else {
          value = value[0];
        }
      }

      if (value !== this.value) {
        this.oldValue = this.value;
        this.value = value;
        this.notify();
      }
    }

    notify() {
      let oldValue = this.oldValue;
      let newValue = this.value;

      this.callSubscribers(newValue, oldValue);
    }

    handleEvent() {
      this.synchronizeValue();
    }

    subscribe(context, callable) {
      if (!this.hasSubscribers()) {
        this.handler.subscribe(this.element, this);
      }
      this.addSubscriber(context, callable);
    }

    unsubscribe(context, callable) {
      if (this.removeSubscriber(context, callable) && !this.hasSubscribers()) {
        this.handler.dispose();
      }
    }

    bind() {
      this.domObserver = DOM.createMutationObserver(() => {
        this.synchronizeOptions();
        this.synchronizeValue();
      });
      this.domObserver.observe(this.element, { childList: true, subtree: true, characterData: true });
    }

    unbind() {
      this.domObserver.disconnect();
      this.domObserver = null;

      if (this.arrayObserver) {
        this.arrayObserver.unsubscribe(selectArrayContext, this);
        this.arrayObserver = null;
      }
    }
  }) || _class10);

  let ClassObserver = class ClassObserver {
    constructor(element) {
      this.element = element;
      this.doNotCache = true;
      this.value = '';
      this.version = 0;
    }

    getValue() {
      return this.value;
    }

    setValue(newValue) {
      let nameIndex = this.nameIndex || {};
      let version = this.version;
      let names;
      let name;

      if (newValue !== null && newValue !== undefined && newValue.length) {
        names = newValue.split(/\s+/);
        for (let i = 0, length = names.length; i < length; i++) {
          name = names[i];
          if (name === '') {
            continue;
          }
          nameIndex[name] = version;
          this.element.classList.add(name);
        }
      }

      this.value = newValue;
      this.nameIndex = nameIndex;
      this.version += 1;

      if (version === 0) {
        return;
      }

      version -= 1;
      for (name in nameIndex) {
        if (!nameIndex.hasOwnProperty(name) || nameIndex[name] !== version) {
          continue;
        }
        this.element.classList.remove(name);
      }
    }

    subscribe() {
      throw new Error(`Observation of a "${this.element.nodeName}" element\'s "class" property is not supported.`);
    }
  };

  function hasDeclaredDependencies(descriptor) {
    return !!(descriptor && descriptor.get && descriptor.get.dependencies);
  }

  function declarePropertyDependencies(ctor, propertyName, dependencies) {
    let descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, propertyName);
    descriptor.get.dependencies = dependencies;
  }

  function computedFrom(...rest) {
    return function (target, key, descriptor) {
      descriptor.get.dependencies = rest;
      return descriptor;
    };
  }

  let ComputedExpression = class ComputedExpression extends Expression {
    constructor(name, dependencies) {
      super();

      this.name = name;
      this.dependencies = dependencies;
      this.isAssignable = true;
    }

    evaluate(scope, lookupFunctions) {
      return scope.bindingContext[this.name];
    }

    assign(scope, value) {
      scope.bindingContext[this.name] = value;
    }

    accept(visitor) {
      throw new Error('not implemented');
    }

    connect(binding, scope) {
      let dependencies = this.dependencies;
      let i = dependencies.length;
      while (i--) {
        dependencies[i].connect(binding, scope);
      }
    }
  };

  function createComputedObserver(obj, propertyName, descriptor, observerLocator) {
    let dependencies = descriptor.get.dependencies;
    if (!(dependencies instanceof ComputedExpression)) {
      let i = dependencies.length;
      while (i--) {
        dependencies[i] = observerLocator.parser.parse(dependencies[i]);
      }
      dependencies = descriptor.get.dependencies = new ComputedExpression(propertyName, dependencies);
    }

    let scope = { bindingContext: obj, overrideContext: createOverrideContext(obj) };
    return new ExpressionObserver(scope, dependencies, observerLocator);
  }

  let svgElements;
  let svgPresentationElements;
  let svgPresentationAttributes;
  let svgAnalyzer;

  if (typeof FEATURE_NO_SVG === 'undefined') {
    svgElements = {
      a: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'target', 'transform', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      altGlyph: ['class', 'dx', 'dy', 'externalResourcesRequired', 'format', 'glyphRef', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rotate', 'style', 'systemLanguage', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      altGlyphDef: ['id', 'xml:base', 'xml:lang', 'xml:space'],
      altGlyphItem: ['id', 'xml:base', 'xml:lang', 'xml:space'],
      animate: ['accumulate', 'additive', 'attributeName', 'attributeType', 'begin', 'by', 'calcMode', 'dur', 'end', 'externalResourcesRequired', 'fill', 'from', 'id', 'keySplines', 'keyTimes', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'systemLanguage', 'to', 'values', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      animateColor: ['accumulate', 'additive', 'attributeName', 'attributeType', 'begin', 'by', 'calcMode', 'dur', 'end', 'externalResourcesRequired', 'fill', 'from', 'id', 'keySplines', 'keyTimes', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'systemLanguage', 'to', 'values', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      animateMotion: ['accumulate', 'additive', 'begin', 'by', 'calcMode', 'dur', 'end', 'externalResourcesRequired', 'fill', 'from', 'id', 'keyPoints', 'keySplines', 'keyTimes', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'origin', 'path', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'rotate', 'systemLanguage', 'to', 'values', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      animateTransform: ['accumulate', 'additive', 'attributeName', 'attributeType', 'begin', 'by', 'calcMode', 'dur', 'end', 'externalResourcesRequired', 'fill', 'from', 'id', 'keySplines', 'keyTimes', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'systemLanguage', 'to', 'type', 'values', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      circle: ['class', 'cx', 'cy', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'r', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
      clipPath: ['class', 'clipPathUnits', 'externalResourcesRequired', 'id', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
      'color-profile': ['id', 'local', 'name', 'rendering-intent', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      cursor: ['externalResourcesRequired', 'id', 'requiredExtensions', 'requiredFeatures', 'systemLanguage', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      defs: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
      desc: ['class', 'id', 'style', 'xml:base', 'xml:lang', 'xml:space'],
      ellipse: ['class', 'cx', 'cy', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rx', 'ry', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
      feBlend: ['class', 'height', 'id', 'in', 'in2', 'mode', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feColorMatrix: ['class', 'height', 'id', 'in', 'result', 'style', 'type', 'values', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feComponentTransfer: ['class', 'height', 'id', 'in', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feComposite: ['class', 'height', 'id', 'in', 'in2', 'k1', 'k2', 'k3', 'k4', 'operator', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feConvolveMatrix: ['bias', 'class', 'divisor', 'edgeMode', 'height', 'id', 'in', 'kernelMatrix', 'kernelUnitLength', 'order', 'preserveAlpha', 'result', 'style', 'targetX', 'targetY', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feDiffuseLighting: ['class', 'diffuseConstant', 'height', 'id', 'in', 'kernelUnitLength', 'result', 'style', 'surfaceScale', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feDisplacementMap: ['class', 'height', 'id', 'in', 'in2', 'result', 'scale', 'style', 'width', 'x', 'xChannelSelector', 'xml:base', 'xml:lang', 'xml:space', 'y', 'yChannelSelector'],
      feDistantLight: ['azimuth', 'elevation', 'id', 'xml:base', 'xml:lang', 'xml:space'],
      feFlood: ['class', 'height', 'id', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feFuncA: ['amplitude', 'exponent', 'id', 'intercept', 'offset', 'slope', 'tableValues', 'type', 'xml:base', 'xml:lang', 'xml:space'],
      feFuncB: ['amplitude', 'exponent', 'id', 'intercept', 'offset', 'slope', 'tableValues', 'type', 'xml:base', 'xml:lang', 'xml:space'],
      feFuncG: ['amplitude', 'exponent', 'id', 'intercept', 'offset', 'slope', 'tableValues', 'type', 'xml:base', 'xml:lang', 'xml:space'],
      feFuncR: ['amplitude', 'exponent', 'id', 'intercept', 'offset', 'slope', 'tableValues', 'type', 'xml:base', 'xml:lang', 'xml:space'],
      feGaussianBlur: ['class', 'height', 'id', 'in', 'result', 'stdDeviation', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feImage: ['class', 'externalResourcesRequired', 'height', 'id', 'preserveAspectRatio', 'result', 'style', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feMerge: ['class', 'height', 'id', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feMergeNode: ['id', 'xml:base', 'xml:lang', 'xml:space'],
      feMorphology: ['class', 'height', 'id', 'in', 'operator', 'radius', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feOffset: ['class', 'dx', 'dy', 'height', 'id', 'in', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      fePointLight: ['id', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y', 'z'],
      feSpecularLighting: ['class', 'height', 'id', 'in', 'kernelUnitLength', 'result', 'specularConstant', 'specularExponent', 'style', 'surfaceScale', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feSpotLight: ['id', 'limitingConeAngle', 'pointsAtX', 'pointsAtY', 'pointsAtZ', 'specularExponent', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y', 'z'],
      feTile: ['class', 'height', 'id', 'in', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      feTurbulence: ['baseFrequency', 'class', 'height', 'id', 'numOctaves', 'result', 'seed', 'stitchTiles', 'style', 'type', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      filter: ['class', 'externalResourcesRequired', 'filterRes', 'filterUnits', 'height', 'id', 'primitiveUnits', 'style', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      font: ['class', 'externalResourcesRequired', 'horiz-adv-x', 'horiz-origin-x', 'horiz-origin-y', 'id', 'style', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'xml:base', 'xml:lang', 'xml:space'],
      'font-face': ['accent-height', 'alphabetic', 'ascent', 'bbox', 'cap-height', 'descent', 'font-family', 'font-size', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'hanging', 'id', 'ideographic', 'mathematical', 'overline-position', 'overline-thickness', 'panose-1', 'slope', 'stemh', 'stemv', 'strikethrough-position', 'strikethrough-thickness', 'underline-position', 'underline-thickness', 'unicode-range', 'units-per-em', 'v-alphabetic', 'v-hanging', 'v-ideographic', 'v-mathematical', 'widths', 'x-height', 'xml:base', 'xml:lang', 'xml:space'],
      'font-face-format': ['id', 'string', 'xml:base', 'xml:lang', 'xml:space'],
      'font-face-name': ['id', 'name', 'xml:base', 'xml:lang', 'xml:space'],
      'font-face-src': ['id', 'xml:base', 'xml:lang', 'xml:space'],
      'font-face-uri': ['id', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      foreignObject: ['class', 'externalResourcesRequired', 'height', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      g: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
      glyph: ['arabic-form', 'class', 'd', 'glyph-name', 'horiz-adv-x', 'id', 'lang', 'orientation', 'style', 'unicode', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'xml:base', 'xml:lang', 'xml:space'],
      glyphRef: ['class', 'dx', 'dy', 'format', 'glyphRef', 'id', 'style', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      hkern: ['g1', 'g2', 'id', 'k', 'u1', 'u2', 'xml:base', 'xml:lang', 'xml:space'],
      image: ['class', 'externalResourcesRequired', 'height', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'preserveAspectRatio', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      line: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'x1', 'x2', 'xml:base', 'xml:lang', 'xml:space', 'y1', 'y2'],
      linearGradient: ['class', 'externalResourcesRequired', 'gradientTransform', 'gradientUnits', 'id', 'spreadMethod', 'style', 'x1', 'x2', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y1', 'y2'],
      marker: ['class', 'externalResourcesRequired', 'id', 'markerHeight', 'markerUnits', 'markerWidth', 'orient', 'preserveAspectRatio', 'refX', 'refY', 'style', 'viewBox', 'xml:base', 'xml:lang', 'xml:space'],
      mask: ['class', 'externalResourcesRequired', 'height', 'id', 'maskContentUnits', 'maskUnits', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      metadata: ['id', 'xml:base', 'xml:lang', 'xml:space'],
      'missing-glyph': ['class', 'd', 'horiz-adv-x', 'id', 'style', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'xml:base', 'xml:lang', 'xml:space'],
      mpath: ['externalResourcesRequired', 'id', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      path: ['class', 'd', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'pathLength', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
      pattern: ['class', 'externalResourcesRequired', 'height', 'id', 'patternContentUnits', 'patternTransform', 'patternUnits', 'preserveAspectRatio', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'viewBox', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      polygon: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'points', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
      polyline: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'points', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
      radialGradient: ['class', 'cx', 'cy', 'externalResourcesRequired', 'fx', 'fy', 'gradientTransform', 'gradientUnits', 'id', 'r', 'spreadMethod', 'style', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      rect: ['class', 'externalResourcesRequired', 'height', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rx', 'ry', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      script: ['externalResourcesRequired', 'id', 'type', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      set: ['attributeName', 'attributeType', 'begin', 'dur', 'end', 'externalResourcesRequired', 'fill', 'id', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'systemLanguage', 'to', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      stop: ['class', 'id', 'offset', 'style', 'xml:base', 'xml:lang', 'xml:space'],
      style: ['id', 'media', 'title', 'type', 'xml:base', 'xml:lang', 'xml:space'],
      svg: ['baseProfile', 'class', 'contentScriptType', 'contentStyleType', 'externalResourcesRequired', 'height', 'id', 'onabort', 'onactivate', 'onclick', 'onerror', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onresize', 'onscroll', 'onunload', 'onzoom', 'preserveAspectRatio', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'version', 'viewBox', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y', 'zoomAndPan'],
      switch: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
      symbol: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'preserveAspectRatio', 'style', 'viewBox', 'xml:base', 'xml:lang', 'xml:space'],
      text: ['class', 'dx', 'dy', 'externalResourcesRequired', 'id', 'lengthAdjust', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rotate', 'style', 'systemLanguage', 'textLength', 'transform', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      textPath: ['class', 'externalResourcesRequired', 'id', 'lengthAdjust', 'method', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'spacing', 'startOffset', 'style', 'systemLanguage', 'textLength', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
      title: ['class', 'id', 'style', 'xml:base', 'xml:lang', 'xml:space'],
      tref: ['class', 'dx', 'dy', 'externalResourcesRequired', 'id', 'lengthAdjust', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rotate', 'style', 'systemLanguage', 'textLength', 'x', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      tspan: ['class', 'dx', 'dy', 'externalResourcesRequired', 'id', 'lengthAdjust', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rotate', 'style', 'systemLanguage', 'textLength', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      use: ['class', 'externalResourcesRequired', 'height', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
      view: ['externalResourcesRequired', 'id', 'preserveAspectRatio', 'viewBox', 'viewTarget', 'xml:base', 'xml:lang', 'xml:space', 'zoomAndPan'],
      vkern: ['g1', 'g2', 'id', 'k', 'u1', 'u2', 'xml:base', 'xml:lang', 'xml:space']
    };


    svgPresentationElements = {
      'a': true,
      'altGlyph': true,
      'animate': true,
      'animateColor': true,
      'circle': true,
      'clipPath': true,
      'defs': true,
      'ellipse': true,
      'feBlend': true,
      'feColorMatrix': true,
      'feComponentTransfer': true,
      'feComposite': true,
      'feConvolveMatrix': true,
      'feDiffuseLighting': true,
      'feDisplacementMap': true,
      'feFlood': true,
      'feGaussianBlur': true,
      'feImage': true,
      'feMerge': true,
      'feMorphology': true,
      'feOffset': true,
      'feSpecularLighting': true,
      'feTile': true,
      'feTurbulence': true,
      'filter': true,
      'font': true,
      'foreignObject': true,
      'g': true,
      'glyph': true,
      'glyphRef': true,
      'image': true,
      'line': true,
      'linearGradient': true,
      'marker': true,
      'mask': true,
      'missing-glyph': true,
      'path': true,
      'pattern': true,
      'polygon': true,
      'polyline': true,
      'radialGradient': true,
      'rect': true,
      'stop': true,
      'svg': true,
      'switch': true,
      'symbol': true,
      'text': true,
      'textPath': true,
      'tref': true,
      'tspan': true,
      'use': true
    };

    svgPresentationAttributes = {
      'alignment-baseline': true,
      'baseline-shift': true,
      'clip-path': true,
      'clip-rule': true,
      'clip': true,
      'color-interpolation-filters': true,
      'color-interpolation': true,
      'color-profile': true,
      'color-rendering': true,
      'color': true,
      'cursor': true,
      'direction': true,
      'display': true,
      'dominant-baseline': true,
      'enable-background': true,
      'fill-opacity': true,
      'fill-rule': true,
      'fill': true,
      'filter': true,
      'flood-color': true,
      'flood-opacity': true,
      'font-family': true,
      'font-size-adjust': true,
      'font-size': true,
      'font-stretch': true,
      'font-style': true,
      'font-variant': true,
      'font-weight': true,
      'glyph-orientation-horizontal': true,
      'glyph-orientation-vertical': true,
      'image-rendering': true,
      'kerning': true,
      'letter-spacing': true,
      'lighting-color': true,
      'marker-end': true,
      'marker-mid': true,
      'marker-start': true,
      'mask': true,
      'opacity': true,
      'overflow': true,
      'pointer-events': true,
      'shape-rendering': true,
      'stop-color': true,
      'stop-opacity': true,
      'stroke-dasharray': true,
      'stroke-dashoffset': true,
      'stroke-linecap': true,
      'stroke-linejoin': true,
      'stroke-miterlimit': true,
      'stroke-opacity': true,
      'stroke-width': true,
      'stroke': true,
      'text-anchor': true,
      'text-decoration': true,
      'text-rendering': true,
      'unicode-bidi': true,
      'visibility': true,
      'word-spacing': true,
      'writing-mode': true
    };

    let createElement = function (html) {
      let div = DOM.createElement('div');
      div.innerHTML = html;
      return div.firstChild;
    };

    svgAnalyzer = class SVGAnalyzer {
      constructor() {
        if (createElement('<svg><altGlyph /></svg>').firstElementChild.nodeName === 'altglyph' && elements.altGlyph) {
          elements.altglyph = elements.altGlyph;
          delete elements.altGlyph;
          elements.altglyphdef = elements.altGlyphDef;
          delete elements.altGlyphDef;
          elements.altglyphitem = elements.altGlyphItem;
          delete elements.altGlyphItem;
          elements.glyphref = elements.glyphRef;
          delete elements.glyphRef;
        }
      }

      isStandardSvgAttribute(nodeName, attributeName) {
        return presentationElements[nodeName] && presentationAttributes[attributeName] || elements[nodeName] && elements[nodeName].indexOf(attributeName) !== -1;
      }
    };
  }

  const elements = svgElements;
  const presentationElements = svgPresentationElements;
  const presentationAttributes = svgPresentationAttributes;
  const SVGAnalyzer = svgAnalyzer || class {
    isStandardSvgAttribute() {
      return false;
    }
  };

  let ObserverLocator = (_temp = _class11 = class ObserverLocator {
    constructor(taskQueue, eventManager, dirtyChecker, svgAnalyzer, parser) {
      this.taskQueue = taskQueue;
      this.eventManager = eventManager;
      this.dirtyChecker = dirtyChecker;
      this.svgAnalyzer = svgAnalyzer;
      this.parser = parser;

      this.adapters = [];
      this.logger = getLogger('observer-locator');
    }

    getObserver(obj, propertyName) {
      let observersLookup = obj.__observers__;
      let observer;

      if (observersLookup && propertyName in observersLookup) {
        return observersLookup[propertyName];
      }

      observer = this.createPropertyObserver(obj, propertyName);

      if (!observer.doNotCache) {
        if (observersLookup === undefined) {
          observersLookup = this.getOrCreateObserversLookup(obj);
        }

        observersLookup[propertyName] = observer;
      }

      return observer;
    }

    getOrCreateObserversLookup(obj) {
      return obj.__observers__ || this.createObserversLookup(obj);
    }

    createObserversLookup(obj) {
      let value = {};

      if (!Reflect.defineProperty(obj, '__observers__', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: value
      })) {
        this.logger.warn('Cannot add observers to object', obj);
      }

      return value;
    }

    addAdapter(adapter) {
      this.adapters.push(adapter);
    }

    getAdapterObserver(obj, propertyName, descriptor) {
      for (let i = 0, ii = this.adapters.length; i < ii; i++) {
        let adapter = this.adapters[i];
        let observer = adapter.getObserver(obj, propertyName, descriptor);
        if (observer) {
          return observer;
        }
      }
      return null;
    }

    createPropertyObserver(obj, propertyName) {
      let descriptor;
      let handler;
      let xlinkResult;

      if (!(obj instanceof Object)) {
        return new PrimitiveObserver(obj, propertyName);
      }

      if (obj instanceof DOM.Element) {
        if (propertyName === 'class') {
          return new ClassObserver(obj);
        }
        if (propertyName === 'style' || propertyName === 'css') {
          return new StyleObserver(obj, propertyName);
        }
        handler = this.eventManager.getElementHandler(obj, propertyName);
        if (propertyName === 'value' && obj.tagName.toLowerCase() === 'select') {
          return new SelectValueObserver(obj, handler, this);
        }
        if (propertyName === 'checked' && obj.tagName.toLowerCase() === 'input') {
          return new CheckedObserver(obj, handler, this);
        }
        if (handler) {
          return new ValueAttributeObserver(obj, propertyName, handler);
        }
        xlinkResult = /^xlink:(.+)$/.exec(propertyName);
        if (xlinkResult) {
          return new XLinkAttributeObserver(obj, propertyName, xlinkResult[1]);
        }
        if (propertyName === 'role' && (obj instanceof DOM.Element || obj instanceof DOM.SVGElement) || /^\w+:|^data-|^aria-/.test(propertyName) || obj instanceof DOM.SVGElement && this.svgAnalyzer.isStandardSvgAttribute(obj.nodeName, propertyName)) {
          return new DataAttributeObserver(obj, propertyName);
        }
      }

      descriptor = Object.getPropertyDescriptor(obj, propertyName);

      if (hasDeclaredDependencies(descriptor)) {
        return createComputedObserver(obj, propertyName, descriptor, this);
      }

      if (descriptor) {
        const existingGetterOrSetter = descriptor.get || descriptor.set;
        if (existingGetterOrSetter) {
          if (existingGetterOrSetter.getObserver) {
            return existingGetterOrSetter.getObserver(obj);
          }

          let adapterObserver = this.getAdapterObserver(obj, propertyName, descriptor);
          if (adapterObserver) {
            return adapterObserver;
          }
          return new DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
        }
      }

      if (obj instanceof Array) {
        if (propertyName === 'length') {
          return this.getArrayObserver(obj).getLengthObserver();
        }

        return new DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
      } else if (obj instanceof Map) {
        if (propertyName === 'size') {
          return this.getMapObserver(obj).getLengthObserver();
        }

        return new DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
      } else if (obj instanceof Set) {
        if (propertyName === 'size') {
          return this.getSetObserver(obj).getLengthObserver();
        }

        return new DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
      }

      return new SetterObserver(this.taskQueue, obj, propertyName);
    }

    getAccessor(obj, propertyName) {
      if (obj instanceof DOM.Element) {
        if (propertyName === 'class' || propertyName === 'style' || propertyName === 'css' || propertyName === 'value' && (obj.tagName.toLowerCase() === 'input' || obj.tagName.toLowerCase() === 'select') || propertyName === 'checked' && obj.tagName.toLowerCase() === 'input' || propertyName === 'model' && obj.tagName.toLowerCase() === 'input' || /^xlink:.+$/.exec(propertyName)) {
          return this.getObserver(obj, propertyName);
        }
        if (/^\w+:|^data-|^aria-/.test(propertyName) || obj instanceof DOM.SVGElement && this.svgAnalyzer.isStandardSvgAttribute(obj.nodeName, propertyName) || obj.tagName.toLowerCase() === 'img' && propertyName === 'src' || obj.tagName.toLowerCase() === 'a' && propertyName === 'href') {
          return dataAttributeAccessor;
        }
      }
      return propertyAccessor;
    }

    getArrayObserver(array) {
      return getArrayObserver(this.taskQueue, array);
    }

    getMapObserver(map) {
      return getMapObserver(this.taskQueue, map);
    }

    getSetObserver(set) {
      return getSetObserver(this.taskQueue, set);
    }
  }, _class11.inject = [TaskQueue, EventManager, DirtyChecker, SVGAnalyzer, Parser], _temp);

  let ObjectObservationAdapter = class ObjectObservationAdapter {
    getObserver(object, propertyName, descriptor) {
      throw new Error('BindingAdapters must implement getObserver(object, propertyName).');
    }
  };

  let BindingExpression = class BindingExpression {
    constructor(observerLocator, targetProperty, sourceExpression, mode, lookupFunctions, attribute) {
      this.observerLocator = observerLocator;
      this.targetProperty = targetProperty;
      this.sourceExpression = sourceExpression;
      this.mode = mode;
      this.lookupFunctions = lookupFunctions;
      this.attribute = attribute;
      this.discrete = false;
    }

    createBinding(target) {
      return new Binding(this.observerLocator, this.sourceExpression, target, this.targetProperty, this.mode, this.lookupFunctions);
    }
  };

  let Binding = (_dec10 = connectable(), _dec10(_class12 = class Binding {
    constructor(observerLocator, sourceExpression, target, targetProperty, mode, lookupFunctions) {
      this.observerLocator = observerLocator;
      this.sourceExpression = sourceExpression;
      this.target = target;
      this.targetProperty = targetProperty;
      this.mode = mode;
      this.lookupFunctions = lookupFunctions;
    }

    updateTarget(value) {
      this.targetObserver.setValue(value, this.target, this.targetProperty);
    }

    updateSource(value) {
      this.sourceExpression.assign(this.source, value, this.lookupFunctions);
    }

    call(context, newValue, oldValue) {
      if (!this.isBound) {
        return;
      }
      if (context === sourceContext) {
        oldValue = this.targetObserver.getValue(this.target, this.targetProperty);
        newValue = this.sourceExpression.evaluate(this.source, this.lookupFunctions);
        if (newValue !== oldValue) {
          this.updateTarget(newValue);
        }
        if (this.mode !== bindingMode.oneTime) {
          this._version++;
          this.sourceExpression.connect(this, this.source);
          this.unobserve(false);
        }
        return;
      }
      if (context === targetContext) {
        if (newValue !== this.sourceExpression.evaluate(this.source, this.lookupFunctions)) {
          this.updateSource(newValue);
        }
        return;
      }
      throw new Error(`Unexpected call context ${context}`);
    }

    bind(source) {
      if (this.isBound) {
        if (this.source === source) {
          return;
        }
        this.unbind();
      }
      this.isBound = true;
      this.source = source;

      if (this.sourceExpression.bind) {
        this.sourceExpression.bind(this, source, this.lookupFunctions);
      }

      let mode = this.mode;
      if (!this.targetObserver) {
        let method = mode === bindingMode.twoWay || mode === bindingMode.fromView ? 'getObserver' : 'getAccessor';
        this.targetObserver = this.observerLocator[method](this.target, this.targetProperty);
      }

      if ('bind' in this.targetObserver) {
        this.targetObserver.bind();
      }
      if (this.mode !== bindingMode.fromView) {
        let value = this.sourceExpression.evaluate(source, this.lookupFunctions);
        this.updateTarget(value);
      }

      if (mode === bindingMode.oneTime) {
        return;
      } else if (mode === bindingMode.toView) {
        enqueueBindingConnect(this);
      } else if (mode === bindingMode.twoWay) {
        this.sourceExpression.connect(this, source);
        this.targetObserver.subscribe(targetContext, this);
      } else if (mode === bindingMode.fromView) {
        this.targetObserver.subscribe(targetContext, this);
      }
    }

    unbind() {
      if (!this.isBound) {
        return;
      }
      this.isBound = false;
      if (this.sourceExpression.unbind) {
        this.sourceExpression.unbind(this, this.source);
      }
      this.source = null;
      if ('unbind' in this.targetObserver) {
        this.targetObserver.unbind();
      }
      if (this.targetObserver.unsubscribe) {
        this.targetObserver.unsubscribe(targetContext, this);
      }
      this.unobserve(true);
    }

    connect(evaluate) {
      if (!this.isBound) {
        return;
      }
      if (evaluate) {
        let value = this.sourceExpression.evaluate(this.source, this.lookupFunctions);
        this.updateTarget(value);
      }
      this.sourceExpression.connect(this, this.source);
    }
  }) || _class12);

  let CallExpression = class CallExpression {
    constructor(observerLocator, targetProperty, sourceExpression, lookupFunctions) {
      this.observerLocator = observerLocator;
      this.targetProperty = targetProperty;
      this.sourceExpression = sourceExpression;
      this.lookupFunctions = lookupFunctions;
    }

    createBinding(target) {
      return new Call(this.observerLocator, this.sourceExpression, target, this.targetProperty, this.lookupFunctions);
    }
  };

  let Call = class Call {
    constructor(observerLocator, sourceExpression, target, targetProperty, lookupFunctions) {
      this.sourceExpression = sourceExpression;
      this.target = target;
      this.targetProperty = observerLocator.getObserver(target, targetProperty);
      this.lookupFunctions = lookupFunctions;
    }

    callSource($event) {
      let overrideContext = this.source.overrideContext;
      Object.assign(overrideContext, $event);
      overrideContext.$event = $event;
      let mustEvaluate = true;
      let result = this.sourceExpression.evaluate(this.source, this.lookupFunctions, mustEvaluate);
      delete overrideContext.$event;
      for (let prop in $event) {
        delete overrideContext[prop];
      }
      return result;
    }

    bind(source) {
      if (this.isBound) {
        if (this.source === source) {
          return;
        }
        this.unbind();
      }
      this.isBound = true;
      this.source = source;

      if (this.sourceExpression.bind) {
        this.sourceExpression.bind(this, source, this.lookupFunctions);
      }
      this.targetProperty.setValue($event => this.callSource($event));
    }

    unbind() {
      if (!this.isBound) {
        return;
      }
      this.isBound = false;
      if (this.sourceExpression.unbind) {
        this.sourceExpression.unbind(this, this.source);
      }
      this.source = null;
      this.targetProperty.setValue(null);
    }
  };

  let ValueConverterResource = class ValueConverterResource {
    constructor(name) {
      this.name = name;
    }

    static convention(name) {
      if (name.endsWith('ValueConverter')) {
        return new ValueConverterResource(camelCase(name.substring(0, name.length - 14)));
      }
    }

    initialize(container, target) {
      this.instance = container.get(target);
    }

    register(registry, name) {
      registry.registerValueConverter(name || this.name, this.instance);
    }

    load(container, target) {}
  };

  function valueConverter(nameOrTarget) {
    if (nameOrTarget === undefined || typeof nameOrTarget === 'string') {
      return function (target) {
        metadata.define(metadata.resource, new ValueConverterResource(nameOrTarget), target);
      };
    }

    metadata.define(metadata.resource, new ValueConverterResource(), nameOrTarget);
  }

  let BindingBehaviorResource = class BindingBehaviorResource {
    constructor(name) {
      this.name = name;
    }

    static convention(name) {
      if (name.endsWith('BindingBehavior')) {
        return new BindingBehaviorResource(camelCase(name.substring(0, name.length - 15)));
      }
    }

    initialize(container, target) {
      this.instance = container.get(target);
    }

    register(registry, name) {
      registry.registerBindingBehavior(name || this.name, this.instance);
    }

    load(container, target) {}
  };

  function bindingBehavior(nameOrTarget) {
    if (nameOrTarget === undefined || typeof nameOrTarget === 'string') {
      return function (target) {
        metadata.define(metadata.resource, new BindingBehaviorResource(nameOrTarget), target);
      };
    }

    metadata.define(metadata.resource, new BindingBehaviorResource(), nameOrTarget);
  }

  let ListenerExpression = class ListenerExpression {
    constructor(eventManager, targetEvent, sourceExpression, delegationStrategy, preventDefault, lookupFunctions) {
      this.eventManager = eventManager;
      this.targetEvent = targetEvent;
      this.sourceExpression = sourceExpression;
      this.delegationStrategy = delegationStrategy;
      this.discrete = true;
      this.preventDefault = preventDefault;
      this.lookupFunctions = lookupFunctions;
    }

    createBinding(target) {
      return new Listener(this.eventManager, this.targetEvent, this.delegationStrategy, this.sourceExpression, target, this.preventDefault, this.lookupFunctions);
    }
  };

  let Listener = class Listener {
    constructor(eventManager, targetEvent, delegationStrategy, sourceExpression, target, preventDefault, lookupFunctions) {
      this.eventManager = eventManager;
      this.targetEvent = targetEvent;
      this.delegationStrategy = delegationStrategy;
      this.sourceExpression = sourceExpression;
      this.target = target;
      this.preventDefault = preventDefault;
      this.lookupFunctions = lookupFunctions;
    }

    callSource(event) {
      let overrideContext = this.source.overrideContext;
      overrideContext.$event = event;
      let mustEvaluate = true;
      let result = this.sourceExpression.evaluate(this.source, this.lookupFunctions, mustEvaluate);
      delete overrideContext.$event;
      if (result !== true && this.preventDefault) {
        event.preventDefault();
      }
      return result;
    }

    handleEvent(event) {
      this.callSource(event);
    }

    bind(source) {
      if (this.isBound) {
        if (this.source === source) {
          return;
        }
        this.unbind();
      }
      this.isBound = true;
      this.source = source;

      if (this.sourceExpression.bind) {
        this.sourceExpression.bind(this, source, this.lookupFunctions);
      }
      this._handler = this.eventManager.addEventListener(this.target, this.targetEvent, this, this.delegationStrategy, true);
    }

    unbind() {
      if (!this.isBound) {
        return;
      }
      this.isBound = false;
      if (this.sourceExpression.unbind) {
        this.sourceExpression.unbind(this, this.source);
      }
      this.source = null;
      this._handler.dispose();
      this._handler = null;
    }
  };

  function getAU(element) {
    let au = element.au;

    if (au === undefined) {
      throw new Error(`No Aurelia APIs are defined for the element: "${element.tagName}".`);
    }

    return au;
  }

  let NameExpression = class NameExpression {
    constructor(sourceExpression, apiName, lookupFunctions) {
      this.sourceExpression = sourceExpression;
      this.apiName = apiName;
      this.lookupFunctions = lookupFunctions;
      this.discrete = true;
    }

    createBinding(target) {
      return new NameBinder(this.sourceExpression, NameExpression.locateAPI(target, this.apiName), this.lookupFunctions);
    }

    static locateAPI(element, apiName) {
      switch (apiName) {
        case 'element':
          return element;
        case 'controller':
          return getAU(element).controller;
        case 'view-model':
          return getAU(element).controller.viewModel;
        case 'view':
          return getAU(element).controller.view;
        default:
          let target = getAU(element)[apiName];

          if (target === undefined) {
            throw new Error(`Attempted to reference "${apiName}", but it was not found amongst the target's API.`);
          }

          return target.viewModel;
      }
    }
  };

  let NameBinder = class NameBinder {
    constructor(sourceExpression, target, lookupFunctions) {
      this.sourceExpression = sourceExpression;
      this.target = target;
      this.lookupFunctions = lookupFunctions;
    }

    bind(source) {
      if (this.isBound) {
        if (this.source === source) {
          return;
        }
        this.unbind();
      }
      this.isBound = true;
      this.source = source;
      if (this.sourceExpression.bind) {
        this.sourceExpression.bind(this, source, this.lookupFunctions);
      }
      this.sourceExpression.assign(this.source, this.target, this.lookupFunctions);
    }

    unbind() {
      if (!this.isBound) {
        return;
      }
      this.isBound = false;
      if (this.sourceExpression.evaluate(this.source, this.lookupFunctions) === this.target) {
        this.sourceExpression.assign(this.source, null, this.lookupFunctions);
      }
      if (this.sourceExpression.unbind) {
        this.sourceExpression.unbind(this, this.source);
      }
      this.source = null;
    }
  };


  const LookupFunctions = {
    bindingBehaviors: name => null,
    valueConverters: name => null
  };

  let BindingEngine = (_temp2 = _class13 = class BindingEngine {

    constructor(observerLocator, parser) {
      this.observerLocator = observerLocator;
      this.parser = parser;
    }

    createBindingExpression(targetProperty, sourceExpression, mode = bindingMode.toView, lookupFunctions = LookupFunctions) {
      return new BindingExpression(this.observerLocator, targetProperty, this.parser.parse(sourceExpression), mode, lookupFunctions);
    }

    propertyObserver(obj, propertyName) {
      return {
        subscribe: callback => {
          let observer = this.observerLocator.getObserver(obj, propertyName);
          observer.subscribe(callback);
          return {
            dispose: () => observer.unsubscribe(callback)
          };
        }
      };
    }

    collectionObserver(collection) {
      return {
        subscribe: callback => {
          let observer;
          if (collection instanceof Array) {
            observer = this.observerLocator.getArrayObserver(collection);
          } else if (collection instanceof Map) {
            observer = this.observerLocator.getMapObserver(collection);
          } else if (collection instanceof Set) {
            observer = this.observerLocator.getSetObserver(collection);
          } else {
            throw new Error('collection must be an instance of Array, Map or Set.');
          }
          observer.subscribe(callback);
          return {
            dispose: () => observer.unsubscribe(callback)
          };
        }
      };
    }

    expressionObserver(bindingContext, expression) {
      let scope = { bindingContext, overrideContext: createOverrideContext(bindingContext) };
      return new ExpressionObserver(scope, this.parser.parse(expression), this.observerLocator, LookupFunctions);
    }

    parseExpression(expression) {
      return this.parser.parse(expression);
    }

    registerAdapter(adapter) {
      this.observerLocator.addAdapter(adapter);
    }
  }, _class13.inject = [ObserverLocator, Parser], _temp2);

  let setProto = Set.prototype;

  function getSetObserver(taskQueue, set) {
    return ModifySetObserver.for(taskQueue, set);
  }

  let ModifySetObserver = class ModifySetObserver extends ModifyCollectionObserver {
    constructor(taskQueue, set) {
      super(taskQueue, set);
    }

    static for(taskQueue, set) {
      if (!('__set_observer__' in set)) {
        Reflect.defineProperty(set, '__set_observer__', {
          value: ModifySetObserver.create(taskQueue, set),
          enumerable: false, configurable: false
        });
      }
      return set.__set_observer__;
    }

    static create(taskQueue, set) {
      let observer = new ModifySetObserver(taskQueue, set);

      let proto = setProto;
      if (proto.add !== set.add || proto.delete !== set.delete || proto.clear !== set.clear) {
        proto = {
          add: set.add,
          delete: set.delete,
          clear: set.clear
        };
      }

      set.add = function () {
        let type = 'add';
        let oldSize = set.size;
        let methodCallResult = proto.add.apply(set, arguments);
        let hasValue = set.size === oldSize;
        if (!hasValue) {
          observer.addChangeRecord({
            type: type,
            object: set,
            value: Array.from(set).pop()
          });
        }
        return methodCallResult;
      };

      set.delete = function () {
        let hasValue = set.has(arguments[0]);
        let methodCallResult = proto.delete.apply(set, arguments);
        if (hasValue) {
          observer.addChangeRecord({
            type: 'delete',
            object: set,
            value: arguments[0]
          });
        }
        return methodCallResult;
      };

      set.clear = function () {
        let methodCallResult = proto.clear.apply(set, arguments);
        observer.addChangeRecord({
          type: 'clear',
          object: set
        });
        return methodCallResult;
      };

      return observer;
    }
  };


  function observable(targetOrConfig, key, descriptor) {
    function deco(target, key, descriptor, config) {
      const isClassDecorator = key === undefined;
      if (isClassDecorator) {
        target = target.prototype;
        key = typeof config === 'string' ? config : config.name;
      }

      let innerPropertyName = `_${key}`;
      const innerPropertyDescriptor = {
        configurable: true,
        enumerable: false,
        writable: true
      };

      const callbackName = config && config.changeHandler || `${key}Changed`;

      if (descriptor) {
        if (typeof descriptor.initializer === 'function') {
          innerPropertyDescriptor.value = descriptor.initializer();
        }
      } else {
        descriptor = {};
      }

      if (!('enumerable' in descriptor)) {
        descriptor.enumerable = true;
      }

      delete descriptor.value;
      delete descriptor.writable;
      delete descriptor.initializer;

      Reflect.defineProperty(target, innerPropertyName, innerPropertyDescriptor);

      descriptor.get = function () {
        return this[innerPropertyName];
      };
      descriptor.set = function (newValue) {
        let oldValue = this[innerPropertyName];
        if (newValue === oldValue) {
          return;
        }

        this[innerPropertyName] = newValue;
        Reflect.defineProperty(this, innerPropertyName, { enumerable: false });

        if (this[callbackName]) {
          this[callbackName](newValue, oldValue, key);
        }
      };

      descriptor.get.dependencies = [innerPropertyName];

      if (isClassDecorator) {
        Reflect.defineProperty(target, key, descriptor);
      } else {
        return descriptor;
      }
    }

    if (key === undefined) {
      return (t, k, d) => deco(t, k, d, targetOrConfig);
    }
    return deco(targetOrConfig, key, descriptor);
  }

  const signals = {};

  function connectBindingToSignal(binding, name) {
    if (!signals.hasOwnProperty(name)) {
      signals[name] = 0;
    }
    binding.observeProperty(signals, name);
  }

  function signalBindings(name) {
    if (signals.hasOwnProperty(name)) {
      signals[name]++;
    }
  }

  var _class$2, _temp$1, _dec$2, _class2$2, _dec2$2, _class3$2, _dec3$2, _class4$1, _dec4$2, _class5$2, _dec5$2, _class6$1, _dec6$2, _class7$2, _class8$1, _temp2$1, _class9$1, _temp3, _class11$1, _dec7$2, _class13$1, _dec8$1, _class14, _class15, _temp4, _dec9$1, _class16, _dec10$1, _class17, _dec11, _class18;

  const animationEvent = {
    enterBegin: 'animation:enter:begin',
    enterActive: 'animation:enter:active',
    enterDone: 'animation:enter:done',
    enterTimeout: 'animation:enter:timeout',

    leaveBegin: 'animation:leave:begin',
    leaveActive: 'animation:leave:active',
    leaveDone: 'animation:leave:done',
    leaveTimeout: 'animation:leave:timeout',

    staggerNext: 'animation:stagger:next',

    removeClassBegin: 'animation:remove-class:begin',
    removeClassActive: 'animation:remove-class:active',
    removeClassDone: 'animation:remove-class:done',
    removeClassTimeout: 'animation:remove-class:timeout',

    addClassBegin: 'animation:add-class:begin',
    addClassActive: 'animation:add-class:active',
    addClassDone: 'animation:add-class:done',
    addClassTimeout: 'animation:add-class:timeout',

    animateBegin: 'animation:animate:begin',
    animateActive: 'animation:animate:active',
    animateDone: 'animation:animate:done',
    animateTimeout: 'animation:animate:timeout',

    sequenceBegin: 'animation:sequence:begin',
    sequenceDone: 'animation:sequence:done'
  };

  let Animator = class Animator {
    enter(element) {
      return Promise.resolve(false);
    }

    leave(element) {
      return Promise.resolve(false);
    }

    removeClass(element, className) {
      element.classList.remove(className);
      return Promise.resolve(false);
    }

    addClass(element, className) {
      element.classList.add(className);
      return Promise.resolve(false);
    }

    animate(element, className) {
      return Promise.resolve(false);
    }

    runSequence(animations) {}

    registerEffect(effectName, properties) {}

    unregisterEffect(effectName) {}
  };

  let CompositionTransactionNotifier = class CompositionTransactionNotifier {
    constructor(owner) {
      this.owner = owner;
      this.owner._compositionCount++;
    }

    done() {
      this.owner._compositionCount--;
      this.owner._tryCompleteTransaction();
    }
  };

  let CompositionTransactionOwnershipToken = class CompositionTransactionOwnershipToken {
    constructor(owner) {
      this.owner = owner;
      this.owner._ownershipToken = this;
      this.thenable = this._createThenable();
    }

    waitForCompositionComplete() {
      this.owner._tryCompleteTransaction();
      return this.thenable;
    }

    resolve() {
      this._resolveCallback();
    }

    _createThenable() {
      return new Promise((resolve, reject) => {
        this._resolveCallback = resolve;
      });
    }
  };

  let CompositionTransaction = class CompositionTransaction {
    constructor() {
      this._ownershipToken = null;
      this._compositionCount = 0;
    }

    tryCapture() {
      return this._ownershipToken === null ? new CompositionTransactionOwnershipToken(this) : null;
    }

    enlist() {
      return new CompositionTransactionNotifier(this);
    }

    _tryCompleteTransaction() {
      if (this._compositionCount <= 0) {
        this._compositionCount = 0;

        if (this._ownershipToken !== null) {
          let token = this._ownershipToken;
          this._ownershipToken = null;
          token.resolve();
        }
      }
    }
  };

  const capitalMatcher = /([A-Z])/g;

  function addHyphenAndLower(char) {
    return '-' + char.toLowerCase();
  }

  function _hyphenate(name) {
    return (name.charAt(0).toLowerCase() + name.slice(1)).replace(capitalMatcher, addHyphenAndLower);
  }

  function _isAllWhitespace(node) {
    return !(node.auInterpolationTarget || /[^\t\n\r ]/.test(node.textContent));
  }

  let ViewEngineHooksResource = class ViewEngineHooksResource {
    constructor() {}

    initialize(container, target) {
      this.instance = container.get(target);
    }

    register(registry, name) {
      registry.registerViewEngineHooks(this.instance);
    }

    load(container, target) {}

    static convention(name) {
      if (name.endsWith('ViewEngineHooks')) {
        return new ViewEngineHooksResource();
      }
    }
  };

  function viewEngineHooks(target) {
    let deco = function (t) {
      metadata.define(metadata.resource, new ViewEngineHooksResource(), t);
    };

    return target ? deco(target) : deco;
  }

  let ElementEvents = class ElementEvents {
    constructor(element) {
      this.element = element;
      this.subscriptions = {};
    }

    _enqueueHandler(handler) {
      this.subscriptions[handler.eventName] = this.subscriptions[handler.eventName] || [];
      this.subscriptions[handler.eventName].push(handler);
    }

    _dequeueHandler(handler) {
      let index;
      let subscriptions = this.subscriptions[handler.eventName];
      if (subscriptions) {
        index = subscriptions.indexOf(handler);
        if (index > -1) {
          subscriptions.splice(index, 1);
        }
      }
      return handler;
    }

    publish(eventName, detail = {}, bubbles = true, cancelable = true) {
      let event = DOM.createCustomEvent(eventName, { cancelable, bubbles, detail });
      this.element.dispatchEvent(event);
    }

    subscribe(eventName, handler, captureOrOptions = true) {
      if (typeof handler === 'function') {
        const eventHandler = new EventHandlerImpl(this, eventName, handler, captureOrOptions, false);
        return eventHandler;
      }

      return undefined;
    }

    subscribeOnce(eventName, handler, captureOrOptions = true) {
      if (typeof handler === 'function') {
        const eventHandler = new EventHandlerImpl(this, eventName, handler, captureOrOptions, true);
        return eventHandler;
      }

      return undefined;
    }

    dispose(eventName) {
      if (eventName && typeof eventName === 'string') {
        let subscriptions = this.subscriptions[eventName];
        if (subscriptions) {
          while (subscriptions.length) {
            let subscription = subscriptions.pop();
            if (subscription) {
              subscription.dispose();
            }
          }
        }
      } else {
        this.disposeAll();
      }
    }

    disposeAll() {
      for (let key in this.subscriptions) {
        this.dispose(key);
      }
    }
  };

  let EventHandlerImpl = class EventHandlerImpl {
    constructor(owner, eventName, handler, captureOrOptions, once) {
      this.owner = owner;
      this.eventName = eventName;
      this.handler = handler;

      this.capture = typeof captureOrOptions === 'boolean' ? captureOrOptions : captureOrOptions.capture;
      this.bubbles = !this.capture;
      this.captureOrOptions = captureOrOptions;
      this.once = once;
      owner.element.addEventListener(eventName, this, captureOrOptions);
      owner._enqueueHandler(this);
    }

    handleEvent(e) {
      const fn = this.handler;
      fn(e);
      if (this.once) {
        this.dispose();
      }
    }

    dispose() {
      this.owner.element.removeEventListener(this.eventName, this, this.captureOrOptions);
      this.owner._dequeueHandler(this);
      this.owner = this.handler = null;
    }
  };

  let ResourceLoadContext = class ResourceLoadContext {
    constructor() {
      this.dependencies = {};
    }

    addDependency(url) {
      this.dependencies[url] = true;
    }

    hasDependency(url) {
      return url in this.dependencies;
    }
  };

  let ViewCompileInstruction = class ViewCompileInstruction {
    constructor(targetShadowDOM = false, compileSurrogate = false) {
      this.targetShadowDOM = targetShadowDOM;
      this.compileSurrogate = compileSurrogate;
      this.associatedModuleId = null;
    }
  };

  ViewCompileInstruction.normal = new ViewCompileInstruction();

  let BehaviorInstruction = class BehaviorInstruction {
    static enhance() {
      let instruction = new BehaviorInstruction();
      instruction.enhance = true;
      return instruction;
    }

    static unitTest(type, attributes) {
      let instruction = new BehaviorInstruction();
      instruction.type = type;
      instruction.attributes = attributes || {};
      return instruction;
    }

    static element(node, type) {
      let instruction = new BehaviorInstruction();
      instruction.type = type;
      instruction.attributes = {};
      instruction.anchorIsContainer = !(node.hasAttribute('containerless') || type.containerless);
      instruction.initiatedByBehavior = true;
      return instruction;
    }

    static attribute(attrName, type) {
      let instruction = new BehaviorInstruction();
      instruction.attrName = attrName;
      instruction.type = type || null;
      instruction.attributes = {};
      return instruction;
    }

    static dynamic(host, viewModel, viewFactory) {
      let instruction = new BehaviorInstruction();
      instruction.host = host;
      instruction.viewModel = viewModel;
      instruction.viewFactory = viewFactory;
      instruction.inheritBindingContext = true;
      return instruction;
    }
  };

  const biProto = BehaviorInstruction.prototype;
  biProto.initiatedByBehavior = false;
  biProto.enhance = false;
  biProto.partReplacements = null;
  biProto.viewFactory = null;
  biProto.originalAttrName = null;
  biProto.skipContentProcessing = false;
  biProto.contentFactory = null;
  biProto.viewModel = null;
  biProto.anchorIsContainer = false;
  biProto.host = null;
  biProto.attributes = null;
  biProto.type = null;
  biProto.attrName = null;
  biProto.inheritBindingContext = false;

  BehaviorInstruction.normal = new BehaviorInstruction();

  let TargetInstruction = (_temp$1 = _class$2 = class TargetInstruction {
    static shadowSlot(parentInjectorId) {
      let instruction = new TargetInstruction();
      instruction.parentInjectorId = parentInjectorId;
      instruction.shadowSlot = true;
      return instruction;
    }

    static contentExpression(expression) {
      let instruction = new TargetInstruction();
      instruction.contentExpression = expression;
      return instruction;
    }

    static letElement(expressions) {
      let instruction = new TargetInstruction();
      instruction.expressions = expressions;
      instruction.letElement = true;
      return instruction;
    }

    static lifting(parentInjectorId, liftingInstruction) {
      let instruction = new TargetInstruction();
      instruction.parentInjectorId = parentInjectorId;
      instruction.expressions = TargetInstruction.noExpressions;
      instruction.behaviorInstructions = [liftingInstruction];
      instruction.viewFactory = liftingInstruction.viewFactory;
      instruction.providers = [liftingInstruction.type.target];
      instruction.lifting = true;
      return instruction;
    }

    static normal(injectorId, parentInjectorId, providers, behaviorInstructions, expressions, elementInstruction) {
      let instruction = new TargetInstruction();
      instruction.injectorId = injectorId;
      instruction.parentInjectorId = parentInjectorId;
      instruction.providers = providers;
      instruction.behaviorInstructions = behaviorInstructions;
      instruction.expressions = expressions;
      instruction.anchorIsContainer = elementInstruction ? elementInstruction.anchorIsContainer : true;
      instruction.elementInstruction = elementInstruction;
      return instruction;
    }

    static surrogate(providers, behaviorInstructions, expressions, values) {
      let instruction = new TargetInstruction();
      instruction.expressions = expressions;
      instruction.behaviorInstructions = behaviorInstructions;
      instruction.providers = providers;
      instruction.values = values;
      return instruction;
    }
  }, _class$2.noExpressions = Object.freeze([]), _temp$1);

  const tiProto = TargetInstruction.prototype;

  tiProto.injectorId = null;
  tiProto.parentInjectorId = null;

  tiProto.shadowSlot = false;
  tiProto.slotName = null;
  tiProto.slotFallbackFactory = null;

  tiProto.contentExpression = null;
  tiProto.letElement = false;

  tiProto.expressions = null;
  tiProto.expressions = null;
  tiProto.providers = null;

  tiProto.viewFactory = null;

  tiProto.anchorIsContainer = false;
  tiProto.elementInstruction = null;
  tiProto.lifting = false;

  tiProto.values = null;

  const viewStrategy = protocol.create('aurelia:view-strategy', {
    validate(target) {
      if (!(typeof target.loadViewFactory === 'function')) {
        return 'View strategies must implement: loadViewFactory(viewEngine: ViewEngine, compileInstruction: ViewCompileInstruction, loadContext?: ResourceLoadContext): Promise<ViewFactory>';
      }

      return true;
    },
    compose(target) {
      if (!(typeof target.makeRelativeTo === 'function')) {
        target.makeRelativeTo = PLATFORM.noop;
      }
    }
  });

  let RelativeViewStrategy = (_dec$2 = viewStrategy(), _dec$2(_class2$2 = class RelativeViewStrategy {
    constructor(path) {
      this.path = path;
      this.absolutePath = null;
    }

    loadViewFactory(viewEngine, compileInstruction, loadContext, target) {
      if (this.absolutePath === null && this.moduleId) {
        this.absolutePath = relativeToFile(this.path, this.moduleId);
      }

      compileInstruction.associatedModuleId = this.moduleId;
      return viewEngine.loadViewFactory(this.absolutePath || this.path, compileInstruction, loadContext, target);
    }

    makeRelativeTo(file) {
      if (this.absolutePath === null) {
        this.absolutePath = relativeToFile(this.path, file);
      }
    }
  }) || _class2$2);

  let ConventionalViewStrategy = (_dec2$2 = viewStrategy(), _dec2$2(_class3$2 = class ConventionalViewStrategy {
    constructor(viewLocator, origin) {
      this.moduleId = origin.moduleId;
      this.viewUrl = viewLocator.convertOriginToViewUrl(origin);
    }

    loadViewFactory(viewEngine, compileInstruction, loadContext, target) {
      compileInstruction.associatedModuleId = this.moduleId;
      return viewEngine.loadViewFactory(this.viewUrl, compileInstruction, loadContext, target);
    }
  }) || _class3$2);

  let NoViewStrategy = (_dec3$2 = viewStrategy(), _dec3$2(_class4$1 = class NoViewStrategy {
    constructor(dependencies, dependencyBaseUrl) {
      this.dependencies = dependencies || null;
      this.dependencyBaseUrl = dependencyBaseUrl || '';
    }

    loadViewFactory(viewEngine, compileInstruction, loadContext, target) {
      let entry = this.entry;
      let dependencies = this.dependencies;

      if (entry && entry.factoryIsReady) {
        return Promise.resolve(null);
      }

      this.entry = entry = new TemplateRegistryEntry(this.moduleId || this.dependencyBaseUrl);

      entry.dependencies = [];
      entry.templateIsLoaded = true;

      if (dependencies !== null) {
        for (let i = 0, ii = dependencies.length; i < ii; ++i) {
          let current = dependencies[i];

          if (typeof current === 'string' || typeof current === 'function') {
            entry.addDependency(current);
          } else {
            entry.addDependency(current.from, current.as);
          }
        }
      }

      compileInstruction.associatedModuleId = this.moduleId;

      return viewEngine.loadViewFactory(entry, compileInstruction, loadContext, target);
    }
  }) || _class4$1);

  let TemplateRegistryViewStrategy = (_dec4$2 = viewStrategy(), _dec4$2(_class5$2 = class TemplateRegistryViewStrategy {
    constructor(moduleId, entry) {
      this.moduleId = moduleId;
      this.entry = entry;
    }

    loadViewFactory(viewEngine, compileInstruction, loadContext, target) {
      let entry = this.entry;

      if (entry.factoryIsReady) {
        return Promise.resolve(entry.factory);
      }

      compileInstruction.associatedModuleId = this.moduleId;
      return viewEngine.loadViewFactory(entry, compileInstruction, loadContext, target);
    }
  }) || _class5$2);

  let InlineViewStrategy = (_dec5$2 = viewStrategy(), _dec5$2(_class6$1 = class InlineViewStrategy {
    constructor(markup, dependencies, dependencyBaseUrl) {
      this.markup = markup;
      this.dependencies = dependencies || null;
      this.dependencyBaseUrl = dependencyBaseUrl || '';
    }

    loadViewFactory(viewEngine, compileInstruction, loadContext, target) {
      let entry = this.entry;
      let dependencies = this.dependencies;

      if (entry && entry.factoryIsReady) {
        return Promise.resolve(entry.factory);
      }

      this.entry = entry = new TemplateRegistryEntry(this.moduleId || this.dependencyBaseUrl);
      entry.template = DOM.createTemplateFromMarkup(this.markup);

      if (dependencies !== null) {
        for (let i = 0, ii = dependencies.length; i < ii; ++i) {
          let current = dependencies[i];

          if (typeof current === 'string' || typeof current === 'function') {
            entry.addDependency(current);
          } else {
            entry.addDependency(current.from, current.as);
          }
        }
      }

      compileInstruction.associatedModuleId = this.moduleId;
      return viewEngine.loadViewFactory(entry, compileInstruction, loadContext, target);
    }
  }) || _class6$1);

  let StaticViewStrategy = (_dec6$2 = viewStrategy(), _dec6$2(_class7$2 = class StaticViewStrategy {

    constructor(config) {
      if (typeof config === 'string' || config instanceof DOM.Element && config.tagName === 'TEMPLATE') {
        config = {
          template: config
        };
      }
      this.template = config.template;
      this.dependencies = config.dependencies || [];
      this.factoryIsReady = false;
      this.onReady = null;
      this.moduleId = 'undefined';
    }

    loadViewFactory(viewEngine, compileInstruction, loadContext, target) {
      if (this.factoryIsReady) {
        return Promise.resolve(this.factory);
      }
      let deps = this.dependencies;
      deps = typeof deps === 'function' ? deps() : deps;
      deps = deps ? deps : [];
      deps = Array.isArray(deps) ? deps : [deps];

      return Promise.all(deps).then(dependencies => {
        const container = viewEngine.container;
        const appResources = viewEngine.appResources;
        const viewCompiler = viewEngine.viewCompiler;
        const viewResources = new ViewResources(appResources);

        let resource;
        let elDeps = [];

        if (target) {
          viewResources.autoRegister(container, target);
        }

        for (let dep of dependencies) {
          if (typeof dep === 'function') {
            resource = viewResources.autoRegister(container, dep);
            if (resource.elementName !== null) {
              elDeps.push(resource);
            }
          } else if (dep && typeof dep === 'object') {
            for (let key in dep) {
              let exported = dep[key];
              if (typeof exported === 'function') {
                resource = viewResources.autoRegister(container, exported);
                if (resource.elementName !== null) {
                  elDeps.push(resource);
                }
              }
            }
          } else {
            throw new Error(`dependency neither function nor object. Received: "${typeof dep}"`);
          }
        }

        return Promise.all(elDeps.map(el => el.load(container, el.target))).then(() => {
          const factory = this.template !== null ? viewCompiler.compile(this.template, viewResources, compileInstruction) : null;
          this.factoryIsReady = true;
          this.factory = factory;
          return factory;
        });
      });
    }
  }) || _class7$2);

  let ViewLocator = (_temp2$1 = _class8$1 = class ViewLocator {
    getViewStrategy(value) {
      if (!value) {
        return null;
      }

      if (typeof value === 'object' && 'getViewStrategy' in value) {
        let origin = Origin.get(value.constructor);

        value = value.getViewStrategy();

        if (typeof value === 'string') {
          value = new RelativeViewStrategy(value);
        }

        viewStrategy.assert(value);

        if (origin.moduleId) {
          value.makeRelativeTo(origin.moduleId);
        }

        return value;
      }

      if (typeof value === 'string') {
        value = new RelativeViewStrategy(value);
      }

      if (viewStrategy.validate(value)) {
        return value;
      }

      if (typeof value !== 'function') {
        value = value.constructor;
      }

      if ('$view' in value) {
        let c = value.$view;
        let view;
        c = typeof c === 'function' ? c.call(value) : c;
        if (c === null) {
          view = new NoViewStrategy();
        } else {
          view = c instanceof StaticViewStrategy ? c : new StaticViewStrategy(c);
        }
        metadata.define(ViewLocator.viewStrategyMetadataKey, view, value);
        return view;
      }

      let origin = Origin.get(value);
      let strategy = metadata.get(ViewLocator.viewStrategyMetadataKey, value);

      if (!strategy) {
        if (!origin.moduleId) {
          throw new Error('Cannot determine default view strategy for object.', value);
        }

        strategy = this.createFallbackViewStrategy(origin);
      } else if (origin.moduleId) {
        strategy.moduleId = origin.moduleId;
      }

      return strategy;
    }

    createFallbackViewStrategy(origin) {
      return new ConventionalViewStrategy(this, origin);
    }

    convertOriginToViewUrl(origin) {
      let moduleId = origin.moduleId;
      let id = moduleId.endsWith('.js') || moduleId.endsWith('.ts') ? moduleId.substring(0, moduleId.length - 3) : moduleId;
      return id + '.html';
    }
  }, _class8$1.viewStrategyMetadataKey = 'aurelia:view-strategy', _temp2$1);

  function mi(name) {
    throw new Error(`BindingLanguage must implement ${name}().`);
  }

  let BindingLanguage = class BindingLanguage {
    inspectAttribute(resources, elementName, attrName, attrValue) {
      mi('inspectAttribute');
    }

    createAttributeInstruction(resources, element, info, existingInstruction) {
      mi('createAttributeInstruction');
    }

    createLetExpressions(resources, element) {
      mi('createLetExpressions');
    }

    inspectTextContent(resources, value) {
      mi('inspectTextContent');
    }
  };

  let noNodes = Object.freeze([]);

  let SlotCustomAttribute = class SlotCustomAttribute {
    static inject() {
      return [DOM.Element];
    }

    constructor(element) {
      this.element = element;
      this.element.auSlotAttribute = this;
    }

    valueChanged(newValue, oldValue) {}
  };

  let PassThroughSlot = class PassThroughSlot {
    constructor(anchor, name, destinationName, fallbackFactory) {
      this.anchor = anchor;
      this.anchor.viewSlot = this;
      this.name = name;
      this.destinationName = destinationName;
      this.fallbackFactory = fallbackFactory;
      this.destinationSlot = null;
      this.projections = 0;
      this.contentView = null;

      let attr = new SlotCustomAttribute(this.anchor);
      attr.value = this.destinationName;
    }

    get needsFallbackRendering() {
      return this.fallbackFactory && this.projections === 0;
    }

    renderFallbackContent(view, nodes, projectionSource, index) {
      if (this.contentView === null) {
        this.contentView = this.fallbackFactory.create(this.ownerView.container);
        this.contentView.bind(this.ownerView.bindingContext, this.ownerView.overrideContext);

        let slots = Object.create(null);
        slots[this.destinationSlot.name] = this.destinationSlot;

        ShadowDOM.distributeView(this.contentView, slots, projectionSource, index, this.destinationSlot.name);
      }
    }

    passThroughTo(destinationSlot) {
      this.destinationSlot = destinationSlot;
    }

    addNode(view, node, projectionSource, index) {
      if (this.contentView !== null) {
        this.contentView.removeNodes();
        this.contentView.detached();
        this.contentView.unbind();
        this.contentView = null;
      }

      if (node.viewSlot instanceof PassThroughSlot) {
        node.viewSlot.passThroughTo(this);
        return;
      }

      this.projections++;
      this.destinationSlot.addNode(view, node, projectionSource, index);
    }

    removeView(view, projectionSource) {
      this.projections--;
      this.destinationSlot.removeView(view, projectionSource);

      if (this.needsFallbackRendering) {
        this.renderFallbackContent(null, noNodes, projectionSource);
      }
    }

    removeAll(projectionSource) {
      this.projections = 0;
      this.destinationSlot.removeAll(projectionSource);

      if (this.needsFallbackRendering) {
        this.renderFallbackContent(null, noNodes, projectionSource);
      }
    }

    projectFrom(view, projectionSource) {
      this.destinationSlot.projectFrom(view, projectionSource);
    }

    created(ownerView) {
      this.ownerView = ownerView;
    }

    bind(view) {
      if (this.contentView) {
        this.contentView.bind(view.bindingContext, view.overrideContext);
      }
    }

    attached() {
      if (this.contentView) {
        this.contentView.attached();
      }
    }

    detached() {
      if (this.contentView) {
        this.contentView.detached();
      }
    }

    unbind() {
      if (this.contentView) {
        this.contentView.unbind();
      }
    }
  };

  let ShadowSlot = class ShadowSlot {
    constructor(anchor, name, fallbackFactory) {
      this.anchor = anchor;
      this.anchor.isContentProjectionSource = true;
      this.anchor.viewSlot = this;
      this.name = name;
      this.fallbackFactory = fallbackFactory;
      this.contentView = null;
      this.projections = 0;
      this.children = [];
      this.projectFromAnchors = null;
      this.destinationSlots = null;
    }

    get needsFallbackRendering() {
      return this.fallbackFactory && this.projections === 0;
    }

    addNode(view, node, projectionSource, index, destination) {
      if (this.contentView !== null) {
        this.contentView.removeNodes();
        this.contentView.detached();
        this.contentView.unbind();
        this.contentView = null;
      }

      if (node.viewSlot instanceof PassThroughSlot) {
        node.viewSlot.passThroughTo(this);
        return;
      }

      if (this.destinationSlots !== null) {
        ShadowDOM.distributeNodes(view, [node], this.destinationSlots, this, index);
      } else {
        node.auOwnerView = view;
        node.auProjectionSource = projectionSource;
        node.auAssignedSlot = this;

        let anchor = this._findAnchor(view, node, projectionSource, index);
        let parent = anchor.parentNode;

        parent.insertBefore(node, anchor);
        this.children.push(node);
        this.projections++;
      }
    }

    removeView(view, projectionSource) {
      if (this.destinationSlots !== null) {
        ShadowDOM.undistributeView(view, this.destinationSlots, this);
      } else if (this.contentView && this.contentView.hasSlots) {
        ShadowDOM.undistributeView(view, this.contentView.slots, projectionSource);
      } else {
        let found = this.children.find(x => x.auSlotProjectFrom === projectionSource);
        if (found) {
          let children = found.auProjectionChildren;

          for (let i = 0, ii = children.length; i < ii; ++i) {
            let child = children[i];

            if (child.auOwnerView === view) {
              children.splice(i, 1);
              view.fragment.appendChild(child);
              i--;ii--;
              this.projections--;
            }
          }

          if (this.needsFallbackRendering) {
            this.renderFallbackContent(view, noNodes, projectionSource);
          }
        }
      }
    }

    removeAll(projectionSource) {
      if (this.destinationSlots !== null) {
        ShadowDOM.undistributeAll(this.destinationSlots, this);
      } else if (this.contentView && this.contentView.hasSlots) {
        ShadowDOM.undistributeAll(this.contentView.slots, projectionSource);
      } else {
        let found = this.children.find(x => x.auSlotProjectFrom === projectionSource);

        if (found) {
          let children = found.auProjectionChildren;
          for (let i = 0, ii = children.length; i < ii; ++i) {
            let child = children[i];
            child.auOwnerView.fragment.appendChild(child);
            this.projections--;
          }

          found.auProjectionChildren = [];

          if (this.needsFallbackRendering) {
            this.renderFallbackContent(null, noNodes, projectionSource);
          }
        }
      }
    }

    _findAnchor(view, node, projectionSource, index) {
      if (projectionSource) {
        let found = this.children.find(x => x.auSlotProjectFrom === projectionSource);
        if (found) {
          if (index !== undefined) {
            let children = found.auProjectionChildren;
            let viewIndex = -1;
            let lastView;

            for (let i = 0, ii = children.length; i < ii; ++i) {
              let current = children[i];

              if (current.auOwnerView !== lastView) {
                viewIndex++;
                lastView = current.auOwnerView;

                if (viewIndex >= index && lastView !== view) {
                  children.splice(i, 0, node);
                  return current;
                }
              }
            }
          }

          found.auProjectionChildren.push(node);
          return found;
        }
      }

      return this.anchor;
    }

    projectTo(slots) {
      this.destinationSlots = slots;
    }

    projectFrom(view, projectionSource) {
      let anchor = DOM.createComment('anchor');
      let parent = this.anchor.parentNode;
      anchor.auSlotProjectFrom = projectionSource;
      anchor.auOwnerView = view;
      anchor.auProjectionChildren = [];
      parent.insertBefore(anchor, this.anchor);
      this.children.push(anchor);

      if (this.projectFromAnchors === null) {
        this.projectFromAnchors = [];
      }

      this.projectFromAnchors.push(anchor);
    }

    renderFallbackContent(view, nodes, projectionSource, index) {
      if (this.contentView === null) {
        this.contentView = this.fallbackFactory.create(this.ownerView.container);
        this.contentView.bind(this.ownerView.bindingContext, this.ownerView.overrideContext);
        this.contentView.insertNodesBefore(this.anchor);
      }

      if (this.contentView.hasSlots) {
        let slots = this.contentView.slots;
        let projectFromAnchors = this.projectFromAnchors;

        if (projectFromAnchors !== null) {
          for (let slotName in slots) {
            let slot = slots[slotName];

            for (let i = 0, ii = projectFromAnchors.length; i < ii; ++i) {
              let anchor = projectFromAnchors[i];
              slot.projectFrom(anchor.auOwnerView, anchor.auSlotProjectFrom);
            }
          }
        }

        this.fallbackSlots = slots;
        ShadowDOM.distributeNodes(view, nodes, slots, projectionSource, index);
      }
    }

    created(ownerView) {
      this.ownerView = ownerView;
    }

    bind(view) {
      if (this.contentView) {
        this.contentView.bind(view.bindingContext, view.overrideContext);
      }
    }

    attached() {
      if (this.contentView) {
        this.contentView.attached();
      }
    }

    detached() {
      if (this.contentView) {
        this.contentView.detached();
      }
    }

    unbind() {
      if (this.contentView) {
        this.contentView.unbind();
      }
    }
  };

  let ShadowDOM = (_temp3 = _class9$1 = class ShadowDOM {

    static getSlotName(node) {
      if (node.auSlotAttribute === undefined) {
        return ShadowDOM.defaultSlotKey;
      }

      return node.auSlotAttribute.value;
    }

    static distributeView(view, slots, projectionSource, index, destinationOverride) {
      let nodes;

      if (view === null) {
        nodes = noNodes;
      } else {
        let childNodes = view.fragment.childNodes;
        let ii = childNodes.length;
        nodes = new Array(ii);

        for (let i = 0; i < ii; ++i) {
          nodes[i] = childNodes[i];
        }
      }

      ShadowDOM.distributeNodes(view, nodes, slots, projectionSource, index, destinationOverride);
    }

    static undistributeView(view, slots, projectionSource) {
      for (let slotName in slots) {
        slots[slotName].removeView(view, projectionSource);
      }
    }

    static undistributeAll(slots, projectionSource) {
      for (let slotName in slots) {
        slots[slotName].removeAll(projectionSource);
      }
    }

    static distributeNodes(view, nodes, slots, projectionSource, index, destinationOverride) {
      for (let i = 0, ii = nodes.length; i < ii; ++i) {
        let currentNode = nodes[i];
        let nodeType = currentNode.nodeType;

        if (currentNode.isContentProjectionSource) {
          currentNode.viewSlot.projectTo(slots);

          for (let slotName in slots) {
            slots[slotName].projectFrom(view, currentNode.viewSlot);
          }

          nodes.splice(i, 1);
          ii--;i--;
        } else if (nodeType === 1 || nodeType === 3 || currentNode.viewSlot instanceof PassThroughSlot) {
          if (nodeType === 3 && _isAllWhitespace(currentNode)) {
            nodes.splice(i, 1);
            ii--;i--;
          } else {
            let found = slots[destinationOverride || ShadowDOM.getSlotName(currentNode)];

            if (found) {
              found.addNode(view, currentNode, projectionSource, index);
              nodes.splice(i, 1);
              ii--;i--;
            }
          }
        } else {
          nodes.splice(i, 1);
          ii--;i--;
        }
      }

      for (let slotName in slots) {
        let slot = slots[slotName];

        if (slot.needsFallbackRendering) {
          slot.renderFallbackContent(view, nodes, projectionSource, index);
        }
      }
    }
  }, _class9$1.defaultSlotKey = '__au-default-slot-key__', _temp3);

  function register(lookup, name, resource, type) {
    if (!name) {
      return;
    }

    let existing = lookup[name];
    if (existing) {
      if (existing !== resource) {
        throw new Error(`Attempted to register ${type} when one with the same name already exists. Name: ${name}.`);
      }

      return;
    }

    lookup[name] = resource;
  }

  function validateBehaviorName(name, type) {
    if (/[A-Z]/.test(name)) {
      let newName = _hyphenate(name);
      getLogger('templating').warn(`'${name}' is not a valid ${type} name and has been converted to '${newName}'. Upper-case letters are not allowed because the DOM is not case-sensitive.`);
      return newName;
    }
    return name;
  }

  const conventionMark = '__au_resource__';

  let ViewResources = class ViewResources {
    static convention(target, existing) {
      let resource;

      if (existing && conventionMark in existing) {
        return existing;
      }
      if ('$resource' in target) {
        let config = target.$resource;

        if (typeof config === 'string') {
          resource = existing || new HtmlBehaviorResource();
          resource[conventionMark] = true;
          if (!resource.elementName) {
            resource.elementName = validateBehaviorName(config, 'custom element');
          }
        } else {
          if (typeof config === 'function') {
            config = config.call(target);
          }
          if (typeof config === 'string') {
            config = { name: config };
          }

          config = Object.assign({}, config);

          let resourceType = config.type || 'element';

          let name = config.name;
          switch (resourceType) {
            case 'element':case 'attribute':
              resource = existing || new HtmlBehaviorResource();
              resource[conventionMark] = true;
              if (resourceType === 'element') {
                if (!resource.elementName) {
                  resource.elementName = name ? validateBehaviorName(name, 'custom element') : _hyphenate(target.name);
                }
              } else {
                if (!resource.attributeName) {
                  resource.attributeName = name ? validateBehaviorName(name, 'custom attribute') : _hyphenate(target.name);
                }
              }
              if ('templateController' in config) {
                config.liftsContent = config.templateController;
                delete config.templateController;
              }
              if ('defaultBindingMode' in config && resource.attributeDefaultBindingMode !== undefined) {
                config.attributeDefaultBindingMode = config.defaultBindingMode;
                delete config.defaultBindingMode;
              }

              delete config.name;

              Object.assign(resource, config);
              break;
            case 'valueConverter':
              resource = new ValueConverterResource(camelCase(name || target.name));
              break;
            case 'bindingBehavior':
              resource = new BindingBehaviorResource(camelCase(name || target.name));
              break;
            case 'viewEngineHooks':
              resource = new ViewEngineHooksResource();
              break;
          }
        }

        if (resource instanceof HtmlBehaviorResource) {
          let bindables = typeof config === 'string' ? undefined : config.bindables;
          let currentProps = resource.properties;
          if (Array.isArray(bindables)) {
            for (let i = 0, ii = bindables.length; ii > i; ++i) {
              let prop = bindables[i];
              if (!prop || typeof prop !== 'string' && !prop.name) {
                throw new Error(`Invalid bindable property at "${i}" for class "${target.name}". Expected either a string or an object with "name" property.`);
              }
              let newProp = new BindableProperty(prop);

              let existed = false;
              for (let j = 0, jj = currentProps.length; jj > j; ++j) {
                if (currentProps[j].name === newProp.name) {
                  existed = true;
                  break;
                }
              }
              if (existed) {
                continue;
              }
              newProp.registerWith(target, resource);
            }
          }
        }
      }
      return resource;
    }

    constructor(parent, viewUrl) {
      this.bindingLanguage = null;

      this.parent = parent || null;
      this.hasParent = this.parent !== null;
      this.viewUrl = viewUrl || '';
      this.lookupFunctions = {
        valueConverters: this.getValueConverter.bind(this),
        bindingBehaviors: this.getBindingBehavior.bind(this)
      };
      this.attributes = Object.create(null);
      this.elements = Object.create(null);
      this.valueConverters = Object.create(null);
      this.bindingBehaviors = Object.create(null);
      this.attributeMap = Object.create(null);
      this.values = Object.create(null);
      this.beforeCompile = this.afterCompile = this.beforeCreate = this.afterCreate = this.beforeBind = this.beforeUnbind = false;
    }

    _tryAddHook(obj, name) {
      if (typeof obj[name] === 'function') {
        let func = obj[name].bind(obj);
        let counter = 1;
        let callbackName;

        while (this[callbackName = name + counter.toString()] !== undefined) {
          counter++;
        }

        this[name] = true;
        this[callbackName] = func;
      }
    }

    _invokeHook(name, one, two, three, four) {
      if (this.hasParent) {
        this.parent._invokeHook(name, one, two, three, four);
      }

      if (this[name]) {
        this[name + '1'](one, two, three, four);

        let callbackName = name + '2';
        if (this[callbackName]) {
          this[callbackName](one, two, three, four);

          callbackName = name + '3';
          if (this[callbackName]) {
            this[callbackName](one, two, three, four);

            let counter = 4;

            while (this[callbackName = name + counter.toString()] !== undefined) {
              this[callbackName](one, two, three, four);
              counter++;
            }
          }
        }
      }
    }

    registerViewEngineHooks(hooks) {
      this._tryAddHook(hooks, 'beforeCompile');
      this._tryAddHook(hooks, 'afterCompile');
      this._tryAddHook(hooks, 'beforeCreate');
      this._tryAddHook(hooks, 'afterCreate');
      this._tryAddHook(hooks, 'beforeBind');
      this._tryAddHook(hooks, 'beforeUnbind');
    }

    getBindingLanguage(bindingLanguageFallback) {
      return this.bindingLanguage || (this.bindingLanguage = bindingLanguageFallback);
    }

    patchInParent(newParent) {
      let originalParent = this.parent;

      this.parent = newParent || null;
      this.hasParent = this.parent !== null;

      if (newParent.parent === null) {
        newParent.parent = originalParent;
        newParent.hasParent = originalParent !== null;
      }
    }

    relativeToView(path) {
      return relativeToFile(path, this.viewUrl);
    }

    registerElement(tagName, behavior) {
      register(this.elements, tagName, behavior, 'an Element');
    }

    getElement(tagName) {
      return this.elements[tagName] || (this.hasParent ? this.parent.getElement(tagName) : null);
    }

    mapAttribute(attribute) {
      return this.attributeMap[attribute] || (this.hasParent ? this.parent.mapAttribute(attribute) : null);
    }

    registerAttribute(attribute, behavior, knownAttribute) {
      this.attributeMap[attribute] = knownAttribute;
      register(this.attributes, attribute, behavior, 'an Attribute');
    }

    getAttribute(attribute) {
      return this.attributes[attribute] || (this.hasParent ? this.parent.getAttribute(attribute) : null);
    }

    registerValueConverter(name, valueConverter) {
      register(this.valueConverters, name, valueConverter, 'a ValueConverter');
    }

    getValueConverter(name) {
      return this.valueConverters[name] || (this.hasParent ? this.parent.getValueConverter(name) : null);
    }

    registerBindingBehavior(name, bindingBehavior) {
      register(this.bindingBehaviors, name, bindingBehavior, 'a BindingBehavior');
    }

    getBindingBehavior(name) {
      return this.bindingBehaviors[name] || (this.hasParent ? this.parent.getBindingBehavior(name) : null);
    }

    registerValue(name, value) {
      register(this.values, name, value, 'a value');
    }

    getValue(name) {
      return this.values[name] || (this.hasParent ? this.parent.getValue(name) : null);
    }

    autoRegister(container, impl) {
      let resourceTypeMeta = metadata.getOwn(metadata.resource, impl);
      if (resourceTypeMeta) {
        if (resourceTypeMeta instanceof HtmlBehaviorResource) {
          ViewResources.convention(impl, resourceTypeMeta);

          if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
            HtmlBehaviorResource.convention(impl.name, resourceTypeMeta);
          }
          if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
            resourceTypeMeta.elementName = _hyphenate(impl.name);
          }
        }
      } else {
        resourceTypeMeta = ViewResources.convention(impl) || HtmlBehaviorResource.convention(impl.name) || ValueConverterResource.convention(impl.name) || BindingBehaviorResource.convention(impl.name) || ViewEngineHooksResource.convention(impl.name);
        if (!resourceTypeMeta) {
          resourceTypeMeta = new HtmlBehaviorResource();
          resourceTypeMeta.elementName = _hyphenate(impl.name);
        }
        metadata.define(metadata.resource, resourceTypeMeta, impl);
      }
      resourceTypeMeta.initialize(container, impl);
      resourceTypeMeta.register(this);
      return resourceTypeMeta;
    }
  };

  let View = class View {
    constructor(container, viewFactory, fragment, controllers, bindings, children, slots) {
      this.container = container;
      this.viewFactory = viewFactory;
      this.resources = viewFactory.resources;
      this.fragment = fragment;
      this.firstChild = fragment.firstChild;
      this.lastChild = fragment.lastChild;
      this.controllers = controllers;
      this.bindings = bindings;
      this.children = children;
      this.slots = slots;
      this.hasSlots = false;
      this.fromCache = false;
      this.isBound = false;
      this.isAttached = false;
      this.bindingContext = null;
      this.overrideContext = null;
      this.controller = null;
      this.viewModelScope = null;
      this.animatableElement = undefined;
      this._isUserControlled = false;
      this.contentView = null;

      for (let key in slots) {
        this.hasSlots = true;
        break;
      }
    }

    returnToCache() {
      this.viewFactory.returnViewToCache(this);
    }

    created() {
      let i;
      let ii;
      let controllers = this.controllers;

      for (i = 0, ii = controllers.length; i < ii; ++i) {
        controllers[i].created(this);
      }
    }

    bind(bindingContext, overrideContext, _systemUpdate) {
      let controllers;
      let bindings;
      let children;
      let i;
      let ii;

      if (_systemUpdate && this._isUserControlled) {
        return;
      }

      if (this.isBound) {
        if (this.bindingContext === bindingContext) {
          return;
        }

        this.unbind();
      }

      this.isBound = true;
      this.bindingContext = bindingContext;
      this.overrideContext = overrideContext || createOverrideContext(bindingContext);

      this.resources._invokeHook('beforeBind', this);

      bindings = this.bindings;
      for (i = 0, ii = bindings.length; i < ii; ++i) {
        bindings[i].bind(this);
      }

      if (this.viewModelScope !== null) {
        bindingContext.bind(this.viewModelScope.bindingContext, this.viewModelScope.overrideContext);
        this.viewModelScope = null;
      }

      controllers = this.controllers;
      for (i = 0, ii = controllers.length; i < ii; ++i) {
        controllers[i].bind(this);
      }

      children = this.children;
      for (i = 0, ii = children.length; i < ii; ++i) {
        children[i].bind(bindingContext, overrideContext, true);
      }

      if (this.hasSlots) {
        ShadowDOM.distributeView(this.contentView, this.slots);
      }
    }

    addBinding(binding) {
      this.bindings.push(binding);

      if (this.isBound) {
        binding.bind(this);
      }
    }

    unbind() {
      let controllers;
      let bindings;
      let children;
      let i;
      let ii;

      if (this.isBound) {
        this.isBound = false;
        this.resources._invokeHook('beforeUnbind', this);

        if (this.controller !== null) {
          this.controller.unbind();
        }

        bindings = this.bindings;
        for (i = 0, ii = bindings.length; i < ii; ++i) {
          bindings[i].unbind();
        }

        controllers = this.controllers;
        for (i = 0, ii = controllers.length; i < ii; ++i) {
          controllers[i].unbind();
        }

        children = this.children;
        for (i = 0, ii = children.length; i < ii; ++i) {
          children[i].unbind();
        }

        this.bindingContext = null;
        this.overrideContext = null;
      }
    }

    insertNodesBefore(refNode) {
      refNode.parentNode.insertBefore(this.fragment, refNode);
    }

    appendNodesTo(parent) {
      parent.appendChild(this.fragment);
    }

    removeNodes() {
      let fragment = this.fragment;
      let current = this.firstChild;
      let end = this.lastChild;
      let next;

      while (current) {
        next = current.nextSibling;
        fragment.appendChild(current);

        if (current === end) {
          break;
        }

        current = next;
      }
    }

    attached() {
      let controllers;
      let children;
      let i;
      let ii;

      if (this.isAttached) {
        return;
      }

      this.isAttached = true;

      if (this.controller !== null) {
        this.controller.attached();
      }

      controllers = this.controllers;
      for (i = 0, ii = controllers.length; i < ii; ++i) {
        controllers[i].attached();
      }

      children = this.children;
      for (i = 0, ii = children.length; i < ii; ++i) {
        children[i].attached();
      }
    }

    detached() {
      let controllers;
      let children;
      let i;
      let ii;

      if (this.isAttached) {
        this.isAttached = false;

        if (this.controller !== null) {
          this.controller.detached();
        }

        controllers = this.controllers;
        for (i = 0, ii = controllers.length; i < ii; ++i) {
          controllers[i].detached();
        }

        children = this.children;
        for (i = 0, ii = children.length; i < ii; ++i) {
          children[i].detached();
        }
      }
    }
  };

  function getAnimatableElement(view) {
    if (view.animatableElement !== undefined) {
      return view.animatableElement;
    }

    let current = view.firstChild;

    while (current && current.nodeType !== 1) {
      current = current.nextSibling;
    }

    if (current && current.nodeType === 1) {
      return view.animatableElement = current.classList.contains('au-animate') ? current : null;
    }

    return view.animatableElement = null;
  }

  let ViewSlot = class ViewSlot {
    constructor(anchor, anchorIsContainer, animator = Animator.instance) {
      this.anchor = anchor;
      this.anchorIsContainer = anchorIsContainer;
      this.bindingContext = null;
      this.overrideContext = null;
      this.animator = animator;
      this.children = [];
      this.isBound = false;
      this.isAttached = false;
      this.contentSelectors = null;
      anchor.viewSlot = this;
      anchor.isContentProjectionSource = false;
    }

    animateView(view, direction = 'enter') {
      let animatableElement = getAnimatableElement(view);

      if (animatableElement !== null) {
        switch (direction) {
          case 'enter':
            return this.animator.enter(animatableElement);
          case 'leave':
            return this.animator.leave(animatableElement);
          default:
            throw new Error('Invalid animation direction: ' + direction);
        }
      }
    }

    transformChildNodesIntoView() {
      let parent = this.anchor;

      this.children.push({
        fragment: parent,
        firstChild: parent.firstChild,
        lastChild: parent.lastChild,
        returnToCache() {},
        removeNodes() {
          let last;

          while (last = parent.lastChild) {
            parent.removeChild(last);
          }
        },
        created() {},
        bind() {},
        unbind() {},
        attached() {},
        detached() {}
      });
    }

    bind(bindingContext, overrideContext) {
      let i;
      let ii;
      let children;

      if (this.isBound) {
        if (this.bindingContext === bindingContext) {
          return;
        }

        this.unbind();
      }

      this.isBound = true;
      this.bindingContext = bindingContext = bindingContext || this.bindingContext;
      this.overrideContext = overrideContext = overrideContext || this.overrideContext;

      children = this.children;
      for (i = 0, ii = children.length; i < ii; ++i) {
        children[i].bind(bindingContext, overrideContext, true);
      }
    }

    unbind() {
      if (this.isBound) {
        let i;
        let ii;
        let children = this.children;

        this.isBound = false;
        this.bindingContext = null;
        this.overrideContext = null;

        for (i = 0, ii = children.length; i < ii; ++i) {
          children[i].unbind();
        }
      }
    }

    add(view) {
      if (this.anchorIsContainer) {
        view.appendNodesTo(this.anchor);
      } else {
        view.insertNodesBefore(this.anchor);
      }

      this.children.push(view);

      if (this.isAttached) {
        view.attached();
        return this.animateView(view, 'enter');
      }
    }

    insert(index, view) {
      let children = this.children;
      let length = children.length;

      if (index === 0 && length === 0 || index >= length) {
        return this.add(view);
      }

      view.insertNodesBefore(children[index].firstChild);
      children.splice(index, 0, view);

      if (this.isAttached) {
        view.attached();
        return this.animateView(view, 'enter');
      }
    }

    move(sourceIndex, targetIndex) {
      if (sourceIndex === targetIndex) {
        return;
      }

      const children = this.children;
      const view = children[sourceIndex];

      view.removeNodes();
      view.insertNodesBefore(children[targetIndex].firstChild);
      children.splice(sourceIndex, 1);
      children.splice(targetIndex, 0, view);
    }

    remove(view, returnToCache, skipAnimation) {
      return this.removeAt(this.children.indexOf(view), returnToCache, skipAnimation);
    }

    removeMany(viewsToRemove, returnToCache, skipAnimation) {
      const children = this.children;
      let ii = viewsToRemove.length;
      let i;
      let rmPromises = [];

      viewsToRemove.forEach(child => {
        if (skipAnimation) {
          child.removeNodes();
          return;
        }

        let animation = this.animateView(child, 'leave');
        if (animation) {
          rmPromises.push(animation.then(() => child.removeNodes()));
        } else {
          child.removeNodes();
        }
      });

      let removeAction = () => {
        if (this.isAttached) {
          for (i = 0; i < ii; ++i) {
            viewsToRemove[i].detached();
          }
        }

        if (returnToCache) {
          for (i = 0; i < ii; ++i) {
            viewsToRemove[i].returnToCache();
          }
        }

        for (i = 0; i < ii; ++i) {
          const index = children.indexOf(viewsToRemove[i]);
          if (index >= 0) {
            children.splice(index, 1);
          }
        }
      };

      if (rmPromises.length > 0) {
        return Promise.all(rmPromises).then(() => removeAction());
      }

      return removeAction();
    }

    removeAt(index, returnToCache, skipAnimation) {
      let view = this.children[index];

      let removeAction = () => {
        index = this.children.indexOf(view);
        view.removeNodes();
        this.children.splice(index, 1);

        if (this.isAttached) {
          view.detached();
        }

        if (returnToCache) {
          view.returnToCache();
        }

        return view;
      };

      if (!skipAnimation) {
        let animation = this.animateView(view, 'leave');
        if (animation) {
          return animation.then(() => removeAction());
        }
      }

      return removeAction();
    }

    removeAll(returnToCache, skipAnimation) {
      let children = this.children;
      let ii = children.length;
      let i;
      let rmPromises = [];

      children.forEach(child => {
        if (skipAnimation) {
          child.removeNodes();
          return;
        }

        let animation = this.animateView(child, 'leave');
        if (animation) {
          rmPromises.push(animation.then(() => child.removeNodes()));
        } else {
          child.removeNodes();
        }
      });

      let removeAction = () => {
        if (this.isAttached) {
          for (i = 0; i < ii; ++i) {
            children[i].detached();
          }
        }

        if (returnToCache) {
          for (i = 0; i < ii; ++i) {
            const child = children[i];

            if (child) {
              child.returnToCache();
            }
          }
        }

        this.children = [];
      };

      if (rmPromises.length > 0) {
        return Promise.all(rmPromises).then(() => removeAction());
      }

      return removeAction();
    }

    attached() {
      let i;
      let ii;
      let children;
      let child;

      if (this.isAttached) {
        return;
      }

      this.isAttached = true;

      children = this.children;
      for (i = 0, ii = children.length; i < ii; ++i) {
        child = children[i];
        child.attached();
        this.animateView(child, 'enter');
      }
    }

    detached() {
      let i;
      let ii;
      let children;

      if (this.isAttached) {
        this.isAttached = false;
        children = this.children;
        for (i = 0, ii = children.length; i < ii; ++i) {
          children[i].detached();
        }
      }
    }

    projectTo(slots) {
      this.projectToSlots = slots;
      this.add = this._projectionAdd;
      this.insert = this._projectionInsert;
      this.move = this._projectionMove;
      this.remove = this._projectionRemove;
      this.removeAt = this._projectionRemoveAt;
      this.removeMany = this._projectionRemoveMany;
      this.removeAll = this._projectionRemoveAll;
      this.children.forEach(view => ShadowDOM.distributeView(view, slots, this));
    }

    _projectionAdd(view) {
      ShadowDOM.distributeView(view, this.projectToSlots, this);

      this.children.push(view);

      if (this.isAttached) {
        view.attached();
      }
    }

    _projectionInsert(index, view) {
      if (index === 0 && !this.children.length || index >= this.children.length) {
        this.add(view);
      } else {
        ShadowDOM.distributeView(view, this.projectToSlots, this, index);

        this.children.splice(index, 0, view);

        if (this.isAttached) {
          view.attached();
        }
      }
    }

    _projectionMove(sourceIndex, targetIndex) {
      if (sourceIndex === targetIndex) {
        return;
      }

      const children = this.children;
      const view = children[sourceIndex];

      ShadowDOM.undistributeView(view, this.projectToSlots, this);
      ShadowDOM.distributeView(view, this.projectToSlots, this, targetIndex);

      children.splice(sourceIndex, 1);
      children.splice(targetIndex, 0, view);
    }

    _projectionRemove(view, returnToCache) {
      ShadowDOM.undistributeView(view, this.projectToSlots, this);
      this.children.splice(this.children.indexOf(view), 1);

      if (this.isAttached) {
        view.detached();
      }
      if (returnToCache) {
        view.returnToCache();
      }
    }

    _projectionRemoveAt(index, returnToCache) {
      let view = this.children[index];

      ShadowDOM.undistributeView(view, this.projectToSlots, this);
      this.children.splice(index, 1);

      if (this.isAttached) {
        view.detached();
      }
      if (returnToCache) {
        view.returnToCache();
      }
    }

    _projectionRemoveMany(viewsToRemove, returnToCache) {
      viewsToRemove.forEach(view => this.remove(view, returnToCache));
    }

    _projectionRemoveAll(returnToCache) {
      ShadowDOM.undistributeAll(this.projectToSlots, this);

      let children = this.children;
      let ii = children.length;

      for (let i = 0; i < ii; ++i) {
        if (returnToCache) {
          children[i].returnToCache();
        } else if (this.isAttached) {
          children[i].detached();
        }
      }

      this.children = [];
    }
  };

  let ProviderResolver = resolver(_class11$1 = class ProviderResolver {
    get(container, key) {
      let id = key.__providerId__;
      return id in container ? container[id] : container[id] = container.invoke(key);
    }
  }) || _class11$1;

  let providerResolverInstance = new ProviderResolver();

  function elementContainerGet(key) {
    if (key === DOM.Element) {
      return this.element;
    }

    if (key === BoundViewFactory) {
      if (this.boundViewFactory) {
        return this.boundViewFactory;
      }

      let factory = this.instruction.viewFactory;
      let partReplacements = this.partReplacements;

      if (partReplacements) {
        factory = partReplacements[factory.part] || factory;
      }

      this.boundViewFactory = new BoundViewFactory(this, factory, partReplacements);
      return this.boundViewFactory;
    }

    if (key === ViewSlot) {
      if (this.viewSlot === undefined) {
        this.viewSlot = new ViewSlot(this.element, this.instruction.anchorIsContainer);
        this.element.isContentProjectionSource = this.instruction.lifting;
        this.children.push(this.viewSlot);
      }

      return this.viewSlot;
    }

    if (key === ElementEvents) {
      return this.elementEvents || (this.elementEvents = new ElementEvents(this.element));
    }

    if (key === CompositionTransaction) {
      return this.compositionTransaction || (this.compositionTransaction = this.parent.get(key));
    }

    if (key === ViewResources) {
      return this.viewResources;
    }

    if (key === TargetInstruction) {
      return this.instruction;
    }

    return this.superGet(key);
  }

  function createElementContainer(parent, element, instruction, children, partReplacements, resources) {
    let container = parent.createChild();
    let providers;
    let i;

    container.element = element;
    container.instruction = instruction;
    container.children = children;
    container.viewResources = resources;
    container.partReplacements = partReplacements;

    providers = instruction.providers;
    i = providers.length;

    while (i--) {
      container._resolvers.set(providers[i], providerResolverInstance);
    }

    container.superGet = container.get;
    container.get = elementContainerGet;

    return container;
  }

  function hasAttribute(name) {
    return this._element.hasAttribute(name);
  }

  function getAttribute(name) {
    return this._element.getAttribute(name);
  }

  function setAttribute(name, value) {
    this._element.setAttribute(name, value);
  }

  function makeElementIntoAnchor(element, elementInstruction) {
    let anchor = DOM.createComment('anchor');

    if (elementInstruction) {
      let firstChild = element.firstChild;

      if (firstChild && firstChild.tagName === 'AU-CONTENT') {
        anchor.contentElement = firstChild;
      }

      anchor._element = element;

      anchor.hasAttribute = hasAttribute;
      anchor.getAttribute = getAttribute;
      anchor.setAttribute = setAttribute;
    }

    DOM.replaceNode(anchor, element);

    return anchor;
  }

  function applyInstructions(containers, element, instruction, controllers, bindings, children, shadowSlots, partReplacements, resources) {
    let behaviorInstructions = instruction.behaviorInstructions;
    let expressions = instruction.expressions;
    let elementContainer;
    let i;
    let ii;
    let current;
    let instance;

    if (instruction.contentExpression) {
      bindings.push(instruction.contentExpression.createBinding(element.nextSibling));
      element.nextSibling.auInterpolationTarget = true;
      element.parentNode.removeChild(element);
      return;
    }

    if (instruction.shadowSlot) {
      let commentAnchor = DOM.createComment('slot');
      let slot;

      if (instruction.slotDestination) {
        slot = new PassThroughSlot(commentAnchor, instruction.slotName, instruction.slotDestination, instruction.slotFallbackFactory);
      } else {
        slot = new ShadowSlot(commentAnchor, instruction.slotName, instruction.slotFallbackFactory);
      }

      DOM.replaceNode(commentAnchor, element);
      shadowSlots[instruction.slotName] = slot;
      controllers.push(slot);
      return;
    }

    if (instruction.letElement) {
      for (i = 0, ii = expressions.length; i < ii; ++i) {
        bindings.push(expressions[i].createBinding());
      }
      element.parentNode.removeChild(element);
      return;
    }

    if (behaviorInstructions.length) {
      if (!instruction.anchorIsContainer) {
        element = makeElementIntoAnchor(element, instruction.elementInstruction);
      }

      containers[instruction.injectorId] = elementContainer = createElementContainer(containers[instruction.parentInjectorId], element, instruction, children, partReplacements, resources);

      for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
        current = behaviorInstructions[i];
        instance = current.type.create(elementContainer, current, element, bindings);
        controllers.push(instance);
      }
    }

    for (i = 0, ii = expressions.length; i < ii; ++i) {
      bindings.push(expressions[i].createBinding(element));
    }
  }

  function styleStringToObject(style, target) {
    let attributes = style.split(';');
    let firstIndexOfColon;
    let i;
    let current;
    let key;
    let value;

    target = target || {};

    for (i = 0; i < attributes.length; i++) {
      current = attributes[i];
      firstIndexOfColon = current.indexOf(':');
      key = current.substring(0, firstIndexOfColon).trim();
      value = current.substring(firstIndexOfColon + 1).trim();
      target[key] = value;
    }

    return target;
  }

  function styleObjectToString(obj) {
    let result = '';

    for (let key in obj) {
      result += key + ':' + obj[key] + ';';
    }

    return result;
  }

  function applySurrogateInstruction(container, element, instruction, controllers, bindings, children) {
    let behaviorInstructions = instruction.behaviorInstructions;
    let expressions = instruction.expressions;
    let providers = instruction.providers;
    let values = instruction.values;
    let i;
    let ii;
    let current;
    let instance;
    let currentAttributeValue;

    i = providers.length;
    while (i--) {
      container._resolvers.set(providers[i], providerResolverInstance);
    }

    for (let key in values) {
      currentAttributeValue = element.getAttribute(key);

      if (currentAttributeValue) {
        if (key === 'class') {
          element.setAttribute('class', currentAttributeValue + ' ' + values[key]);
        } else if (key === 'style') {
          let styleObject = styleStringToObject(values[key]);
          styleStringToObject(currentAttributeValue, styleObject);
          element.setAttribute('style', styleObjectToString(styleObject));
        }
      } else {
        element.setAttribute(key, values[key]);
      }
    }

    if (behaviorInstructions.length) {
      for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
        current = behaviorInstructions[i];
        instance = current.type.create(container, current, element, bindings);

        if (instance.contentView) {
          children.push(instance.contentView);
        }

        controllers.push(instance);
      }
    }

    for (i = 0, ii = expressions.length; i < ii; ++i) {
      bindings.push(expressions[i].createBinding(element));
    }
  }

  let BoundViewFactory = class BoundViewFactory {
    constructor(parentContainer, viewFactory, partReplacements) {
      this.parentContainer = parentContainer;
      this.viewFactory = viewFactory;
      this.factoryCreateInstruction = { partReplacements: partReplacements };
    }

    create() {
      let view = this.viewFactory.create(this.parentContainer.createChild(), this.factoryCreateInstruction);
      view._isUserControlled = true;
      return view;
    }

    get isCaching() {
      return this.viewFactory.isCaching;
    }

    setCacheSize(size, doNotOverrideIfAlreadySet) {
      this.viewFactory.setCacheSize(size, doNotOverrideIfAlreadySet);
    }

    getCachedView() {
      return this.viewFactory.getCachedView();
    }

    returnViewToCache(view) {
      this.viewFactory.returnViewToCache(view);
    }
  };

  let ViewFactory = class ViewFactory {
    constructor(template, instructions, resources) {
      this.isCaching = false;

      this.template = template;
      this.instructions = instructions;
      this.resources = resources;
      this.cacheSize = -1;
      this.cache = null;
    }

    setCacheSize(size, doNotOverrideIfAlreadySet) {
      if (size) {
        if (size === '*') {
          size = Number.MAX_VALUE;
        } else if (typeof size === 'string') {
          size = parseInt(size, 10);
        }
      }

      if (this.cacheSize === -1 || !doNotOverrideIfAlreadySet) {
        this.cacheSize = size;
      }

      if (this.cacheSize > 0) {
        this.cache = [];
      } else {
        this.cache = null;
      }

      this.isCaching = this.cacheSize > 0;
    }

    getCachedView() {
      return this.cache !== null ? this.cache.pop() || null : null;
    }

    returnViewToCache(view) {
      if (view.isAttached) {
        view.detached();
      }

      if (view.isBound) {
        view.unbind();
      }

      if (this.cache !== null && this.cache.length < this.cacheSize) {
        view.fromCache = true;
        this.cache.push(view);
      }
    }

    create(container, createInstruction, element) {
      createInstruction = createInstruction || BehaviorInstruction.normal;

      let cachedView = this.getCachedView();
      if (cachedView !== null) {
        return cachedView;
      }

      let fragment = createInstruction.enhance ? this.template : this.template.cloneNode(true);
      let instructables = fragment.querySelectorAll('.au-target');
      let instructions = this.instructions;
      let resources = this.resources;
      let controllers = [];
      let bindings = [];
      let children = [];
      let shadowSlots = Object.create(null);
      let containers = { root: container };
      let partReplacements = createInstruction.partReplacements;
      let i;
      let ii;
      let view;
      let instructable;
      let instruction;

      this.resources._invokeHook('beforeCreate', this, container, fragment, createInstruction);

      if (element && this.surrogateInstruction !== null) {
        applySurrogateInstruction(container, element, this.surrogateInstruction, controllers, bindings, children);
      }

      if (createInstruction.enhance && fragment.hasAttribute('au-target-id')) {
        instructable = fragment;
        instruction = instructions[instructable.getAttribute('au-target-id')];
        applyInstructions(containers, instructable, instruction, controllers, bindings, children, shadowSlots, partReplacements, resources);
      }

      for (i = 0, ii = instructables.length; i < ii; ++i) {
        instructable = instructables[i];
        instruction = instructions[instructable.getAttribute('au-target-id')];
        applyInstructions(containers, instructable, instruction, controllers, bindings, children, shadowSlots, partReplacements, resources);
      }

      view = new View(container, this, fragment, controllers, bindings, children, shadowSlots);

      if (!createInstruction.initiatedByBehavior) {
        view.created();
      }

      this.resources._invokeHook('afterCreate', view);

      return view;
    }
  };

  let nextInjectorId = 0;
  function getNextInjectorId() {
    return ++nextInjectorId;
  }

  let lastAUTargetID = 0;
  function getNextAUTargetID() {
    return (++lastAUTargetID).toString();
  }

  function makeIntoInstructionTarget(element) {
    let value = element.getAttribute('class');
    let auTargetID = getNextAUTargetID();

    element.setAttribute('class', value ? value + ' au-target' : 'au-target');
    element.setAttribute('au-target-id', auTargetID);

    return auTargetID;
  }

  function makeShadowSlot(compiler, resources, node, instructions, parentInjectorId) {
    let auShadowSlot = DOM.createElement('au-shadow-slot');
    DOM.replaceNode(auShadowSlot, node);

    let auTargetID = makeIntoInstructionTarget(auShadowSlot);
    let instruction = TargetInstruction.shadowSlot(parentInjectorId);

    instruction.slotName = node.getAttribute('name') || ShadowDOM.defaultSlotKey;
    instruction.slotDestination = node.getAttribute('slot');

    if (node.innerHTML.trim()) {
      let fragment = DOM.createDocumentFragment();
      let child;

      while (child = node.firstChild) {
        fragment.appendChild(child);
      }

      instruction.slotFallbackFactory = compiler.compile(fragment, resources);
    }

    instructions[auTargetID] = instruction;

    return auShadowSlot;
  }

  const defaultLetHandler = BindingLanguage.prototype.createLetExpressions;

  let ViewCompiler = (_dec7$2 = inject(BindingLanguage, ViewResources), _dec7$2(_class13$1 = class ViewCompiler {
    constructor(bindingLanguage, resources) {
      this.bindingLanguage = bindingLanguage;
      this.resources = resources;
    }

    compile(source, resources, compileInstruction) {
      resources = resources || this.resources;
      compileInstruction = compileInstruction || ViewCompileInstruction.normal;
      source = typeof source === 'string' ? DOM.createTemplateFromMarkup(source) : source;

      let content;
      let part;
      let cacheSize;

      if (source.content) {
        part = source.getAttribute('part');
        cacheSize = source.getAttribute('view-cache');
        content = DOM.adoptNode(source.content);
      } else {
        content = source;
      }

      compileInstruction.targetShadowDOM = compileInstruction.targetShadowDOM && FEATURE.shadowDOM;
      resources._invokeHook('beforeCompile', content, resources, compileInstruction);

      let instructions = {};
      this._compileNode(content, resources, instructions, source, 'root', !compileInstruction.targetShadowDOM);

      let firstChild = content.firstChild;
      if (firstChild && firstChild.nodeType === 1) {
        let targetId = firstChild.getAttribute('au-target-id');
        if (targetId) {
          let ins = instructions[targetId];

          if (ins.shadowSlot || ins.lifting || ins.elementInstruction && !ins.elementInstruction.anchorIsContainer) {
            content.insertBefore(DOM.createComment('view'), firstChild);
          }
        }
      }

      let factory = new ViewFactory(content, instructions, resources);

      factory.surrogateInstruction = compileInstruction.compileSurrogate ? this._compileSurrogate(source, resources) : null;
      factory.part = part;

      if (cacheSize) {
        factory.setCacheSize(cacheSize);
      }

      resources._invokeHook('afterCompile', factory);

      return factory;
    }

    _compileNode(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM) {
      switch (node.nodeType) {
        case 1:
          return this._compileElement(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM);
        case 3:
          let expression = resources.getBindingLanguage(this.bindingLanguage).inspectTextContent(resources, node.wholeText);
          if (expression) {
            let marker = DOM.createElement('au-marker');
            let auTargetID = makeIntoInstructionTarget(marker);
            (node.parentNode || parentNode).insertBefore(marker, node);
            node.textContent = ' ';
            instructions[auTargetID] = TargetInstruction.contentExpression(expression);

            while (node.nextSibling && node.nextSibling.nodeType === 3) {
              (node.parentNode || parentNode).removeChild(node.nextSibling);
            }
          } else {
            while (node.nextSibling && node.nextSibling.nodeType === 3) {
              node = node.nextSibling;
            }
          }
          return node.nextSibling;
        case 11:
          let currentChild = node.firstChild;
          while (currentChild) {
            currentChild = this._compileNode(currentChild, resources, instructions, node, parentInjectorId, targetLightDOM);
          }
          break;
        default:
          break;
      }

      return node.nextSibling;
    }

    _compileSurrogate(node, resources) {
      let tagName = node.tagName.toLowerCase();
      let attributes = node.attributes;
      let bindingLanguage = resources.getBindingLanguage(this.bindingLanguage);
      let knownAttribute;
      let property;
      let instruction;
      let i;
      let ii;
      let attr;
      let attrName;
      let attrValue;
      let info;
      let type;
      let expressions = [];
      let expression;
      let behaviorInstructions = [];
      let values = {};
      let hasValues = false;
      let providers = [];

      for (i = 0, ii = attributes.length; i < ii; ++i) {
        attr = attributes[i];
        attrName = attr.name;
        attrValue = attr.value;

        info = bindingLanguage.inspectAttribute(resources, tagName, attrName, attrValue);
        type = resources.getAttribute(info.attrName);

        if (type) {
          knownAttribute = resources.mapAttribute(info.attrName);
          if (knownAttribute) {
            property = type.attributes[knownAttribute];

            if (property) {
              info.defaultBindingMode = property.defaultBindingMode;

              if (!info.command && !info.expression) {
                info.command = property.hasOptions ? 'options' : null;
              }

              if (info.command && info.command !== 'options' && type.primaryProperty) {
                const primaryProperty = type.primaryProperty;
                attrName = info.attrName = primaryProperty.attribute;

                info.defaultBindingMode = primaryProperty.defaultBindingMode;
              }
            }
          }
        }

        instruction = bindingLanguage.createAttributeInstruction(resources, node, info, undefined, type);

        if (instruction) {
          if (instruction.alteredAttr) {
            type = resources.getAttribute(instruction.attrName);
          }

          if (instruction.discrete) {
            expressions.push(instruction);
          } else {
            if (type) {
              instruction.type = type;
              this._configureProperties(instruction, resources);

              if (type.liftsContent) {
                throw new Error('You cannot place a template controller on a surrogate element.');
              } else {
                behaviorInstructions.push(instruction);
              }
            } else {
              expressions.push(instruction.attributes[instruction.attrName]);
            }
          }
        } else {
          if (type) {
            instruction = BehaviorInstruction.attribute(attrName, type);
            instruction.attributes[resources.mapAttribute(attrName)] = attrValue;

            if (type.liftsContent) {
              throw new Error('You cannot place a template controller on a surrogate element.');
            } else {
              behaviorInstructions.push(instruction);
            }
          } else if (attrName !== 'id' && attrName !== 'part' && attrName !== 'replace-part') {
            hasValues = true;
            values[attrName] = attrValue;
          }
        }
      }

      if (expressions.length || behaviorInstructions.length || hasValues) {
        for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
          instruction = behaviorInstructions[i];
          instruction.type.compile(this, resources, node, instruction);
          providers.push(instruction.type.target);
        }

        for (i = 0, ii = expressions.length; i < ii; ++i) {
          expression = expressions[i];
          if (expression.attrToRemove !== undefined) {
            node.removeAttribute(expression.attrToRemove);
          }
        }

        return TargetInstruction.surrogate(providers, behaviorInstructions, expressions, values);
      }

      return null;
    }

    _compileElement(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM) {
      let tagName = node.tagName.toLowerCase();
      let attributes = node.attributes;
      let expressions = [];
      let expression;
      let behaviorInstructions = [];
      let providers = [];
      let bindingLanguage = resources.getBindingLanguage(this.bindingLanguage);
      let liftingInstruction;
      let viewFactory;
      let type;
      let elementInstruction;
      let elementProperty;
      let i;
      let ii;
      let attr;
      let attrName;
      let attrValue;
      let originalAttrName;
      let instruction;
      let info;
      let property;
      let knownAttribute;
      let auTargetID;
      let injectorId;

      if (tagName === 'slot') {
        if (targetLightDOM) {
          node = makeShadowSlot(this, resources, node, instructions, parentInjectorId);
        }
        return node.nextSibling;
      } else if (tagName === 'template') {
        if (!('content' in node)) {
          throw new Error('You cannot place a template element within ' + node.namespaceURI + ' namespace');
        }
        viewFactory = this.compile(node, resources);
        viewFactory.part = node.getAttribute('part');
      } else {
        type = resources.getElement(node.getAttribute('as-element') || tagName);

        if (tagName === 'let' && !type && bindingLanguage.createLetExpressions !== defaultLetHandler) {
          expressions = bindingLanguage.createLetExpressions(resources, node);
          auTargetID = makeIntoInstructionTarget(node);
          instructions[auTargetID] = TargetInstruction.letElement(expressions);
          return node.nextSibling;
        }
        if (type) {
          elementInstruction = BehaviorInstruction.element(node, type);
          type.processAttributes(this, resources, node, attributes, elementInstruction);
          behaviorInstructions.push(elementInstruction);
        }
      }

      for (i = 0, ii = attributes.length; i < ii; ++i) {
        attr = attributes[i];
        originalAttrName = attrName = attr.name;
        attrValue = attr.value;
        info = bindingLanguage.inspectAttribute(resources, tagName, attrName, attrValue);

        if (targetLightDOM && info.attrName === 'slot') {
          info.attrName = attrName = 'au-slot';
        }

        type = resources.getAttribute(info.attrName);
        elementProperty = null;

        if (type) {
          knownAttribute = resources.mapAttribute(info.attrName);
          if (knownAttribute) {
            property = type.attributes[knownAttribute];

            if (property) {
              info.defaultBindingMode = property.defaultBindingMode;

              if (!info.command && !info.expression) {
                info.command = property.hasOptions ? 'options' : null;
              }

              if (info.command && info.command !== 'options' && type.primaryProperty) {
                const primaryProperty = type.primaryProperty;
                attrName = info.attrName = primaryProperty.attribute;

                info.defaultBindingMode = primaryProperty.defaultBindingMode;
              }
            }
          }
        } else if (elementInstruction) {
          elementProperty = elementInstruction.type.attributes[info.attrName];
          if (elementProperty) {
            info.defaultBindingMode = elementProperty.defaultBindingMode;
          }
        }

        if (elementProperty) {
          instruction = bindingLanguage.createAttributeInstruction(resources, node, info, elementInstruction);
        } else {
          instruction = bindingLanguage.createAttributeInstruction(resources, node, info, undefined, type);
        }

        if (instruction) {
          if (instruction.alteredAttr) {
            type = resources.getAttribute(instruction.attrName);
          }

          if (instruction.discrete) {
            expressions.push(instruction);
          } else {
            if (type) {
              instruction.type = type;
              this._configureProperties(instruction, resources);

              if (type.liftsContent) {
                instruction.originalAttrName = originalAttrName;
                liftingInstruction = instruction;
                break;
              } else {
                behaviorInstructions.push(instruction);
              }
            } else if (elementProperty) {
              elementInstruction.attributes[info.attrName].targetProperty = elementProperty.name;
            } else {
              expressions.push(instruction.attributes[instruction.attrName]);
            }
          }
        } else {
          if (type) {
            instruction = BehaviorInstruction.attribute(attrName, type);
            instruction.attributes[resources.mapAttribute(attrName)] = attrValue;

            if (type.liftsContent) {
              instruction.originalAttrName = originalAttrName;
              liftingInstruction = instruction;
              break;
            } else {
              behaviorInstructions.push(instruction);
            }
          } else if (elementProperty) {
            elementInstruction.attributes[attrName] = attrValue;
          }
        }
      }

      if (liftingInstruction) {
        liftingInstruction.viewFactory = viewFactory;
        node = liftingInstruction.type.compile(this, resources, node, liftingInstruction, parentNode);
        auTargetID = makeIntoInstructionTarget(node);
        instructions[auTargetID] = TargetInstruction.lifting(parentInjectorId, liftingInstruction);
      } else {
        let skipContentProcessing = false;

        if (expressions.length || behaviorInstructions.length) {
          injectorId = behaviorInstructions.length ? getNextInjectorId() : false;

          for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
            instruction = behaviorInstructions[i];
            instruction.type.compile(this, resources, node, instruction, parentNode);
            providers.push(instruction.type.target);
            skipContentProcessing = skipContentProcessing || instruction.skipContentProcessing;
          }

          for (i = 0, ii = expressions.length; i < ii; ++i) {
            expression = expressions[i];
            if (expression.attrToRemove !== undefined) {
              node.removeAttribute(expression.attrToRemove);
            }
          }

          auTargetID = makeIntoInstructionTarget(node);
          instructions[auTargetID] = TargetInstruction.normal(injectorId, parentInjectorId, providers, behaviorInstructions, expressions, elementInstruction);
        }

        if (skipContentProcessing) {
          return node.nextSibling;
        }

        let currentChild = node.firstChild;
        while (currentChild) {
          currentChild = this._compileNode(currentChild, resources, instructions, node, injectorId || parentInjectorId, targetLightDOM);
        }
      }

      return node.nextSibling;
    }

    _configureProperties(instruction, resources) {
      let type = instruction.type;
      let attrName = instruction.attrName;
      let attributes = instruction.attributes;
      let property;
      let key;
      let value;

      let knownAttribute = resources.mapAttribute(attrName);
      if (knownAttribute && attrName in attributes && knownAttribute !== attrName) {
        attributes[knownAttribute] = attributes[attrName];
        delete attributes[attrName];
      }

      for (key in attributes) {
        value = attributes[key];

        if (value !== null && typeof value === 'object') {
          property = type.attributes[key];

          if (property !== undefined) {
            value.targetProperty = property.name;
          } else {
            value.targetProperty = key;
          }
        }
      }
    }
  }) || _class13$1);

  let ResourceModule = class ResourceModule {
    constructor(moduleId) {
      this.id = moduleId;
      this.moduleInstance = null;
      this.mainResource = null;
      this.resources = null;
      this.viewStrategy = null;
      this.isInitialized = false;
      this.onLoaded = null;
      this.loadContext = null;
    }

    initialize(container) {
      let current = this.mainResource;
      let resources = this.resources;
      let vs = this.viewStrategy;

      if (this.isInitialized) {
        return;
      }

      this.isInitialized = true;

      if (current !== undefined) {
        current.metadata.viewStrategy = vs;
        current.initialize(container);
      }

      for (let i = 0, ii = resources.length; i < ii; ++i) {
        current = resources[i];
        current.metadata.viewStrategy = vs;
        current.initialize(container);
      }
    }

    register(registry, name) {
      let main = this.mainResource;
      let resources = this.resources;

      if (main !== undefined) {
        main.register(registry, name);
        name = null;
      }

      for (let i = 0, ii = resources.length; i < ii; ++i) {
        resources[i].register(registry, name);
        name = null;
      }
    }

    load(container, loadContext) {
      if (this.onLoaded !== null) {
        return this.loadContext === loadContext ? Promise.resolve() : this.onLoaded;
      }

      let main = this.mainResource;
      let resources = this.resources;
      let loads;

      if (main !== undefined) {
        loads = new Array(resources.length + 1);
        loads[0] = main.load(container, loadContext);
        for (let i = 0, ii = resources.length; i < ii; ++i) {
          loads[i + 1] = resources[i].load(container, loadContext);
        }
      } else {
        loads = new Array(resources.length);
        for (let i = 0, ii = resources.length; i < ii; ++i) {
          loads[i] = resources[i].load(container, loadContext);
        }
      }

      this.loadContext = loadContext;
      this.onLoaded = Promise.all(loads);
      return this.onLoaded;
    }
  };

  let ResourceDescription = class ResourceDescription {
    constructor(key, exportedValue, resourceTypeMeta) {
      if (!resourceTypeMeta) {
        resourceTypeMeta = metadata.get(metadata.resource, exportedValue);

        if (!resourceTypeMeta) {
          resourceTypeMeta = new HtmlBehaviorResource();
          resourceTypeMeta.elementName = _hyphenate(key);
          metadata.define(metadata.resource, resourceTypeMeta, exportedValue);
        }
      }

      if (resourceTypeMeta instanceof HtmlBehaviorResource) {
        if (resourceTypeMeta.elementName === undefined) {
          resourceTypeMeta.elementName = _hyphenate(key);
        } else if (resourceTypeMeta.attributeName === undefined) {
          resourceTypeMeta.attributeName = _hyphenate(key);
        } else if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
          HtmlBehaviorResource.convention(key, resourceTypeMeta);
        }
      } else if (!resourceTypeMeta.name) {
        resourceTypeMeta.name = _hyphenate(key);
      }

      this.metadata = resourceTypeMeta;
      this.value = exportedValue;
    }

    initialize(container) {
      this.metadata.initialize(container, this.value);
    }

    register(registry, name) {
      this.metadata.register(registry, name);
    }

    load(container, loadContext) {
      return this.metadata.load(container, this.value, loadContext);
    }
  };

  let ModuleAnalyzer = class ModuleAnalyzer {
    constructor() {
      this.cache = Object.create(null);
    }

    getAnalysis(moduleId) {
      return this.cache[moduleId];
    }

    analyze(moduleId, moduleInstance, mainResourceKey) {
      let mainResource;
      let fallbackValue;
      let fallbackKey;
      let resourceTypeMeta;
      let key;
      let exportedValue;
      let resources = [];
      let conventional;
      let vs;
      let resourceModule;

      resourceModule = this.cache[moduleId];
      if (resourceModule) {
        return resourceModule;
      }

      resourceModule = new ResourceModule(moduleId);
      this.cache[moduleId] = resourceModule;

      if (typeof moduleInstance === 'function') {
        moduleInstance = { 'default': moduleInstance };
      }

      if (mainResourceKey) {
        mainResource = new ResourceDescription(mainResourceKey, moduleInstance[mainResourceKey]);
      }

      for (key in moduleInstance) {
        exportedValue = moduleInstance[key];

        if (key === mainResourceKey || typeof exportedValue !== 'function') {
          continue;
        }

        resourceTypeMeta = metadata.get(metadata.resource, exportedValue);

        if (resourceTypeMeta) {
          if (resourceTypeMeta instanceof HtmlBehaviorResource) {
            ViewResources.convention(exportedValue, resourceTypeMeta);

            if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
              HtmlBehaviorResource.convention(key, resourceTypeMeta);
            }

            if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
              resourceTypeMeta.elementName = _hyphenate(key);
            }
          }

          if (!mainResource && resourceTypeMeta instanceof HtmlBehaviorResource && resourceTypeMeta.elementName !== null) {
            mainResource = new ResourceDescription(key, exportedValue, resourceTypeMeta);
          } else {
            resources.push(new ResourceDescription(key, exportedValue, resourceTypeMeta));
          }
        } else if (viewStrategy.decorates(exportedValue)) {
          vs = exportedValue;
        } else if (exportedValue instanceof TemplateRegistryEntry) {
          vs = new TemplateRegistryViewStrategy(moduleId, exportedValue);
        } else {
          if (conventional = ViewResources.convention(exportedValue)) {
            if (conventional.elementName !== null && !mainResource) {
              mainResource = new ResourceDescription(key, exportedValue, conventional);
            } else {
              resources.push(new ResourceDescription(key, exportedValue, conventional));
            }
            metadata.define(metadata.resource, conventional, exportedValue);
          } else if (conventional = HtmlBehaviorResource.convention(key)) {
            if (conventional.elementName !== null && !mainResource) {
              mainResource = new ResourceDescription(key, exportedValue, conventional);
            } else {
              resources.push(new ResourceDescription(key, exportedValue, conventional));
            }

            metadata.define(metadata.resource, conventional, exportedValue);
          } else if (conventional = ValueConverterResource.convention(key) || BindingBehaviorResource.convention(key) || ViewEngineHooksResource.convention(key)) {
            resources.push(new ResourceDescription(key, exportedValue, conventional));
            metadata.define(metadata.resource, conventional, exportedValue);
          } else if (!fallbackValue) {
            fallbackValue = exportedValue;
            fallbackKey = key;
          }
        }
      }

      if (!mainResource && fallbackValue) {
        mainResource = new ResourceDescription(fallbackKey, fallbackValue);
      }

      resourceModule.moduleInstance = moduleInstance;
      resourceModule.mainResource = mainResource;
      resourceModule.resources = resources;
      resourceModule.viewStrategy = vs;

      return resourceModule;
    }
  };

  let logger$1 = getLogger('templating');

  function ensureRegistryEntry(loader, urlOrRegistryEntry) {
    if (urlOrRegistryEntry instanceof TemplateRegistryEntry) {
      return Promise.resolve(urlOrRegistryEntry);
    }

    return loader.loadTemplate(urlOrRegistryEntry);
  }

  let ProxyViewFactory = class ProxyViewFactory {
    constructor(promise) {
      promise.then(x => this.viewFactory = x);
    }

    create(container, bindingContext, createInstruction, element) {
      return this.viewFactory.create(container, bindingContext, createInstruction, element);
    }

    get isCaching() {
      return this.viewFactory.isCaching;
    }

    setCacheSize(size, doNotOverrideIfAlreadySet) {
      this.viewFactory.setCacheSize(size, doNotOverrideIfAlreadySet);
    }

    getCachedView() {
      return this.viewFactory.getCachedView();
    }

    returnViewToCache(view) {
      this.viewFactory.returnViewToCache(view);
    }
  };


  let auSlotBehavior = null;

  let ViewEngine = (_dec8$1 = inject(Loader, Container, ViewCompiler, ModuleAnalyzer, ViewResources), _dec8$1(_class14 = (_temp4 = _class15 = class ViewEngine {
    constructor(loader, container, viewCompiler, moduleAnalyzer, appResources) {
      this.loader = loader;
      this.container = container;
      this.viewCompiler = viewCompiler;
      this.moduleAnalyzer = moduleAnalyzer;
      this.appResources = appResources;
      this._pluginMap = {};

      if (auSlotBehavior === null) {
        auSlotBehavior = new HtmlBehaviorResource();
        auSlotBehavior.attributeName = 'au-slot';
        metadata.define(metadata.resource, auSlotBehavior, SlotCustomAttribute);
      }

      auSlotBehavior.initialize(container, SlotCustomAttribute);
      auSlotBehavior.register(appResources);
    }

    addResourcePlugin(extension, implementation) {
      let name = extension.replace('.', '') + '-resource-plugin';
      this._pluginMap[extension] = name;
      this.loader.addPlugin(name, implementation);
    }

    loadViewFactory(urlOrRegistryEntry, compileInstruction, loadContext, target) {
      loadContext = loadContext || new ResourceLoadContext();

      return ensureRegistryEntry(this.loader, urlOrRegistryEntry).then(registryEntry => {
        const url = registryEntry.address;

        if (registryEntry.onReady) {
          if (!loadContext.hasDependency(url)) {
            loadContext.addDependency(url);
            return registryEntry.onReady;
          }

          if (registryEntry.template === null) {
            return registryEntry.onReady;
          }

          return Promise.resolve(new ProxyViewFactory(registryEntry.onReady));
        }

        loadContext.addDependency(url);

        registryEntry.onReady = this.loadTemplateResources(registryEntry, compileInstruction, loadContext, target).then(resources => {
          registryEntry.resources = resources;

          if (registryEntry.template === null) {
            return registryEntry.factory = null;
          }

          let viewFactory = this.viewCompiler.compile(registryEntry.template, resources, compileInstruction);
          return registryEntry.factory = viewFactory;
        });

        return registryEntry.onReady;
      });
    }

    loadTemplateResources(registryEntry, compileInstruction, loadContext, target) {
      let resources = new ViewResources(this.appResources, registryEntry.address);
      let dependencies = registryEntry.dependencies;
      let importIds;
      let names;

      compileInstruction = compileInstruction || ViewCompileInstruction.normal;

      if (dependencies.length === 0 && !compileInstruction.associatedModuleId) {
        return Promise.resolve(resources);
      }

      importIds = dependencies.map(x => x.src);
      names = dependencies.map(x => x.name);
      logger$1.debug(`importing resources for ${registryEntry.address}`, importIds);

      if (target) {
        let viewModelRequires = metadata.get(ViewEngine.viewModelRequireMetadataKey, target);
        if (viewModelRequires) {
          let templateImportCount = importIds.length;
          for (let i = 0, ii = viewModelRequires.length; i < ii; ++i) {
            let req = viewModelRequires[i];
            let importId = typeof req === 'function' ? Origin.get(req).moduleId : relativeToFile(req.src || req, registryEntry.address);

            if (importIds.indexOf(importId) === -1) {
              importIds.push(importId);
              names.push(req.as);
            }
          }
          logger$1.debug(`importing ViewModel resources for ${compileInstruction.associatedModuleId}`, importIds.slice(templateImportCount));
        }
      }

      return this.importViewResources(importIds, names, resources, compileInstruction, loadContext);
    }

    importViewModelResource(moduleImport, moduleMember) {
      return this.loader.loadModule(moduleImport).then(viewModelModule => {
        let normalizedId = Origin.get(viewModelModule).moduleId;
        let resourceModule = this.moduleAnalyzer.analyze(normalizedId, viewModelModule, moduleMember);

        if (!resourceModule.mainResource) {
          throw new Error(`No view model found in module "${moduleImport}".`);
        }

        resourceModule.initialize(this.container);

        return resourceModule.mainResource;
      });
    }

    importViewResources(moduleIds, names, resources, compileInstruction, loadContext) {
      loadContext = loadContext || new ResourceLoadContext();
      compileInstruction = compileInstruction || ViewCompileInstruction.normal;

      moduleIds = moduleIds.map(x => this._applyLoaderPlugin(x));

      return this.loader.loadAllModules(moduleIds).then(imports => {
        let i;
        let ii;
        let analysis;
        let normalizedId;
        let current;
        let associatedModule;
        let container = this.container;
        let moduleAnalyzer = this.moduleAnalyzer;
        let allAnalysis = new Array(imports.length);

        for (i = 0, ii = imports.length; i < ii; ++i) {
          current = imports[i];
          normalizedId = Origin.get(current).moduleId;

          analysis = moduleAnalyzer.analyze(normalizedId, current);
          analysis.initialize(container);
          analysis.register(resources, names[i]);

          allAnalysis[i] = analysis;
        }

        if (compileInstruction.associatedModuleId) {
          associatedModule = moduleAnalyzer.getAnalysis(compileInstruction.associatedModuleId);

          if (associatedModule) {
            associatedModule.register(resources);
          }
        }

        for (i = 0, ii = allAnalysis.length; i < ii; ++i) {
          allAnalysis[i] = allAnalysis[i].load(container, loadContext);
        }

        return Promise.all(allAnalysis).then(() => resources);
      });
    }

    _applyLoaderPlugin(id) {
      let index = id.lastIndexOf('.');
      if (index !== -1) {
        let ext = id.substring(index);
        let pluginName = this._pluginMap[ext];

        if (pluginName === undefined) {
          return id;
        }

        return this.loader.applyPluginToUrl(id, pluginName);
      }

      return id;
    }
  }, _class15.viewModelRequireMetadataKey = 'aurelia:view-model-require', _temp4)) || _class14);

  let Controller = class Controller {
    constructor(behavior, instruction, viewModel, container) {
      this.behavior = behavior;
      this.instruction = instruction;
      this.viewModel = viewModel;
      this.isAttached = false;
      this.view = null;
      this.isBound = false;
      this.scope = null;
      this.container = container;
      this.elementEvents = container.elementEvents || null;

      let observerLookup = behavior.observerLocator.getOrCreateObserversLookup(viewModel);
      let handlesBind = behavior.handlesBind;
      let attributes = instruction.attributes;
      let boundProperties = this.boundProperties = [];
      let properties = behavior.properties;
      let i;
      let ii;

      behavior._ensurePropertiesDefined(viewModel, observerLookup);

      for (i = 0, ii = properties.length; i < ii; ++i) {
        properties[i]._initialize(viewModel, observerLookup, attributes, handlesBind, boundProperties);
      }
    }

    created(owningView) {
      if (this.behavior.handlesCreated) {
        this.viewModel.created(owningView, this.view);
      }
    }

    automate(overrideContext, owningView) {
      this.view.bindingContext = this.viewModel;
      this.view.overrideContext = overrideContext || createOverrideContext(this.viewModel);
      this.view._isUserControlled = true;

      if (this.behavior.handlesCreated) {
        this.viewModel.created(owningView || null, this.view);
      }

      this.bind(this.view);
    }

    bind(scope) {
      let skipSelfSubscriber = this.behavior.handlesBind;
      let boundProperties = this.boundProperties;
      let i;
      let ii;
      let x;
      let observer;
      let selfSubscriber;

      if (this.isBound) {
        if (this.scope === scope) {
          return;
        }

        this.unbind();
      }

      this.isBound = true;
      this.scope = scope;

      for (i = 0, ii = boundProperties.length; i < ii; ++i) {
        x = boundProperties[i];
        observer = x.observer;
        selfSubscriber = observer.selfSubscriber;
        observer.publishing = false;

        if (skipSelfSubscriber) {
          observer.selfSubscriber = null;
        }

        x.binding.bind(scope);
        observer.call();

        observer.publishing = true;
        observer.selfSubscriber = selfSubscriber;
      }

      let overrideContext;
      if (this.view !== null) {
        if (skipSelfSubscriber) {
          this.view.viewModelScope = scope;
        }

        if (this.viewModel === scope.overrideContext.bindingContext) {
          overrideContext = scope.overrideContext;
        } else if (this.instruction.inheritBindingContext) {
          overrideContext = createOverrideContext(this.viewModel, scope.overrideContext);
        } else {
          overrideContext = createOverrideContext(this.viewModel);
          overrideContext.__parentOverrideContext = scope.overrideContext;
        }

        this.view.bind(this.viewModel, overrideContext);
      } else if (skipSelfSubscriber) {
        overrideContext = scope.overrideContext;

        if (scope.overrideContext.__parentOverrideContext !== undefined && this.viewModel.viewFactory && this.viewModel.viewFactory.factoryCreateInstruction.partReplacements) {
          overrideContext = Object.assign({}, scope.overrideContext);
          overrideContext.parentOverrideContext = scope.overrideContext.__parentOverrideContext;
        }
        this.viewModel.bind(scope.bindingContext, overrideContext);
      }
    }

    unbind() {
      if (this.isBound) {
        let boundProperties = this.boundProperties;
        let i;
        let ii;

        this.isBound = false;
        this.scope = null;

        if (this.view !== null) {
          this.view.unbind();
        }

        if (this.behavior.handlesUnbind) {
          this.viewModel.unbind();
        }

        if (this.elementEvents !== null) {
          this.elementEvents.disposeAll();
        }

        for (i = 0, ii = boundProperties.length; i < ii; ++i) {
          boundProperties[i].binding.unbind();
        }
      }
    }

    attached() {
      if (this.isAttached) {
        return;
      }

      this.isAttached = true;

      if (this.behavior.handlesAttached) {
        this.viewModel.attached();
      }

      if (this.view !== null) {
        this.view.attached();
      }
    }

    detached() {
      if (this.isAttached) {
        this.isAttached = false;

        if (this.view !== null) {
          this.view.detached();
        }

        if (this.behavior.handlesDetached) {
          this.viewModel.detached();
        }
      }
    }
  };

  let BehaviorPropertyObserver = (_dec9$1 = subscriberCollection(), _dec9$1(_class16 = class BehaviorPropertyObserver {
    constructor(taskQueue, obj, propertyName, selfSubscriber, initialValue) {
      this.taskQueue = taskQueue;
      this.obj = obj;
      this.propertyName = propertyName;
      this.notqueued = true;
      this.publishing = false;
      this.selfSubscriber = selfSubscriber;
      this.currentValue = this.oldValue = initialValue;
    }

    getValue() {
      return this.currentValue;
    }

    setValue(newValue) {
      let oldValue = this.currentValue;

      if (!Object.is(newValue, oldValue)) {
        this.oldValue = oldValue;
        this.currentValue = newValue;

        if (this.publishing && this.notqueued) {
          if (this.taskQueue.flushing) {
            this.call();
          } else {
            this.notqueued = false;
            this.taskQueue.queueMicroTask(this);
          }
        }
      }
    }

    call() {
      let oldValue = this.oldValue;
      let newValue = this.currentValue;

      this.notqueued = true;

      if (Object.is(newValue, oldValue)) {
        return;
      }

      if (this.selfSubscriber) {
        this.selfSubscriber(newValue, oldValue);
      }

      this.callSubscribers(newValue, oldValue);
      this.oldValue = newValue;
    }

    subscribe(context, callable) {
      this.addSubscriber(context, callable);
    }

    unsubscribe(context, callable) {
      this.removeSubscriber(context, callable);
    }
  }) || _class16);

  function getObserver(instance, name) {
    let lookup = instance.__observers__;

    if (lookup === undefined) {
      let ctor = Object.getPrototypeOf(instance).constructor;
      let behavior = metadata.get(metadata.resource, ctor);
      if (!behavior.isInitialized) {
        behavior.initialize(Container.instance || new Container(), instance.constructor);
      }

      lookup = behavior.observerLocator.getOrCreateObserversLookup(instance);
      behavior._ensurePropertiesDefined(instance, lookup);
    }

    return lookup[name];
  }

  let BindableProperty = class BindableProperty {
    constructor(nameOrConfig) {
      if (typeof nameOrConfig === 'string') {
        this.name = nameOrConfig;
      } else {
        Object.assign(this, nameOrConfig);
      }

      this.attribute = this.attribute || _hyphenate(this.name);
      let defaultBindingMode = this.defaultBindingMode;
      if (defaultBindingMode === null || defaultBindingMode === undefined) {
        this.defaultBindingMode = bindingMode.oneWay;
      } else if (typeof defaultBindingMode === 'string') {
        this.defaultBindingMode = bindingMode[defaultBindingMode] || bindingMode.oneWay;
      }
      this.changeHandler = this.changeHandler || null;
      this.owner = null;
      this.descriptor = null;
    }

    registerWith(target, behavior, descriptor) {
      behavior.properties.push(this);
      behavior.attributes[this.attribute] = this;
      this.owner = behavior;

      if (descriptor) {
        this.descriptor = descriptor;
        return this._configureDescriptor(descriptor);
      }

      return undefined;
    }

    _configureDescriptor(descriptor) {
      let name = this.name;

      descriptor.configurable = true;
      descriptor.enumerable = true;

      if ('initializer' in descriptor) {
        this.defaultValue = descriptor.initializer;
        delete descriptor.initializer;
        delete descriptor.writable;
      }

      if ('value' in descriptor) {
        this.defaultValue = descriptor.value;
        delete descriptor.value;
        delete descriptor.writable;
      }

      descriptor.get = function () {
        return getObserver(this, name).getValue();
      };

      descriptor.set = function (value) {
        getObserver(this, name).setValue(value);
      };

      descriptor.get.getObserver = function (obj) {
        return getObserver(obj, name);
      };

      return descriptor;
    }

    defineOn(target, behavior) {
      let name = this.name;
      let handlerName;

      if (this.changeHandler === null) {
        handlerName = name + 'Changed';
        if (handlerName in target.prototype) {
          this.changeHandler = handlerName;
        }
      }

      if (this.descriptor === null) {
        Object.defineProperty(target.prototype, name, this._configureDescriptor(behavior, {}));
      }
    }

    createObserver(viewModel) {
      let selfSubscriber = null;
      let defaultValue = this.defaultValue;
      let changeHandlerName = this.changeHandler;
      let name = this.name;
      let initialValue;

      if (this.hasOptions) {
        return undefined;
      }

      if (changeHandlerName in viewModel) {
        if ('propertyChanged' in viewModel) {
          selfSubscriber = (newValue, oldValue) => {
            viewModel[changeHandlerName](newValue, oldValue);
            viewModel.propertyChanged(name, newValue, oldValue);
          };
        } else {
          selfSubscriber = (newValue, oldValue) => viewModel[changeHandlerName](newValue, oldValue);
        }
      } else if ('propertyChanged' in viewModel) {
        selfSubscriber = (newValue, oldValue) => viewModel.propertyChanged(name, newValue, oldValue);
      } else if (changeHandlerName !== null) {
        throw new Error(`Change handler ${changeHandlerName} was specified but not declared on the class.`);
      }

      if (defaultValue !== undefined) {
        initialValue = typeof defaultValue === 'function' ? defaultValue.call(viewModel) : defaultValue;
      }

      return new BehaviorPropertyObserver(this.owner.taskQueue, viewModel, this.name, selfSubscriber, initialValue);
    }

    _initialize(viewModel, observerLookup, attributes, behaviorHandlesBind, boundProperties) {
      let selfSubscriber;
      let observer;
      let attribute;
      let defaultValue = this.defaultValue;

      if (this.isDynamic) {
        for (let key in attributes) {
          this._createDynamicProperty(viewModel, observerLookup, behaviorHandlesBind, key, attributes[key], boundProperties);
        }
      } else if (!this.hasOptions) {
        observer = observerLookup[this.name];

        if (attributes !== null) {
          selfSubscriber = observer.selfSubscriber;
          attribute = attributes[this.attribute];

          if (behaviorHandlesBind) {
            observer.selfSubscriber = null;
          }

          if (typeof attribute === 'string') {
            viewModel[this.name] = attribute;
            observer.call();
          } else if (attribute) {
            boundProperties.push({ observer: observer, binding: attribute.createBinding(viewModel) });
          } else if (defaultValue !== undefined) {
            observer.call();
          }

          observer.selfSubscriber = selfSubscriber;
        }

        observer.publishing = true;
      }
    }

    _createDynamicProperty(viewModel, observerLookup, behaviorHandlesBind, name, attribute, boundProperties) {
      let changeHandlerName = name + 'Changed';
      let selfSubscriber = null;
      let observer;
      let info;

      if (changeHandlerName in viewModel) {
        if ('propertyChanged' in viewModel) {
          selfSubscriber = (newValue, oldValue) => {
            viewModel[changeHandlerName](newValue, oldValue);
            viewModel.propertyChanged(name, newValue, oldValue);
          };
        } else {
          selfSubscriber = (newValue, oldValue) => viewModel[changeHandlerName](newValue, oldValue);
        }
      } else if ('propertyChanged' in viewModel) {
        selfSubscriber = (newValue, oldValue) => viewModel.propertyChanged(name, newValue, oldValue);
      }

      observer = observerLookup[name] = new BehaviorPropertyObserver(this.owner.taskQueue, viewModel, name, selfSubscriber);

      Object.defineProperty(viewModel, name, {
        configurable: true,
        enumerable: true,
        get: observer.getValue.bind(observer),
        set: observer.setValue.bind(observer)
      });

      if (behaviorHandlesBind) {
        observer.selfSubscriber = null;
      }

      if (typeof attribute === 'string') {
        viewModel[name] = attribute;
        observer.call();
      } else if (attribute) {
        info = { observer: observer, binding: attribute.createBinding(viewModel) };
        boundProperties.push(info);
      }

      observer.publishing = true;
      observer.selfSubscriber = selfSubscriber;
    }
  };

  let lastProviderId = 0;

  function nextProviderId() {
    return ++lastProviderId;
  }

  function doProcessContent() {
    return true;
  }
  function doProcessAttributes() {}

  let HtmlBehaviorResource = class HtmlBehaviorResource {
    constructor() {
      this.elementName = null;
      this.attributeName = null;
      this.attributeDefaultBindingMode = undefined;
      this.liftsContent = false;
      this.targetShadowDOM = false;
      this.shadowDOMOptions = null;
      this.processAttributes = doProcessAttributes;
      this.processContent = doProcessContent;
      this.usesShadowDOM = false;
      this.childBindings = null;
      this.hasDynamicOptions = false;
      this.containerless = false;
      this.properties = [];
      this.attributes = {};
      this.isInitialized = false;
      this.primaryProperty = null;
    }

    static convention(name, existing) {
      let behavior;

      if (name.endsWith('CustomAttribute')) {
        behavior = existing || new HtmlBehaviorResource();
        behavior.attributeName = _hyphenate(name.substring(0, name.length - 15));
      }

      if (name.endsWith('CustomElement')) {
        behavior = existing || new HtmlBehaviorResource();
        behavior.elementName = _hyphenate(name.substring(0, name.length - 13));
      }

      return behavior;
    }

    addChildBinding(behavior) {
      if (this.childBindings === null) {
        this.childBindings = [];
      }

      this.childBindings.push(behavior);
    }

    initialize(container, target) {
      let proto = target.prototype;
      let properties = this.properties;
      let attributeName = this.attributeName;
      let attributeDefaultBindingMode = this.attributeDefaultBindingMode;
      let i;
      let ii;
      let current;

      if (this.isInitialized) {
        return;
      }

      this.isInitialized = true;
      target.__providerId__ = nextProviderId();

      this.observerLocator = container.get(ObserverLocator);
      this.taskQueue = container.get(TaskQueue);

      this.target = target;
      this.usesShadowDOM = this.targetShadowDOM && FEATURE.shadowDOM;
      this.handlesCreated = 'created' in proto;
      this.handlesBind = 'bind' in proto;
      this.handlesUnbind = 'unbind' in proto;
      this.handlesAttached = 'attached' in proto;
      this.handlesDetached = 'detached' in proto;
      this.htmlName = this.elementName || this.attributeName;

      if (attributeName !== null) {
        if (properties.length === 0) {
          new BindableProperty({
            name: 'value',
            changeHandler: 'valueChanged' in proto ? 'valueChanged' : null,
            attribute: attributeName,
            defaultBindingMode: attributeDefaultBindingMode
          }).registerWith(target, this);
        }

        current = properties[0];

        if (properties.length === 1 && current.name === 'value') {
          current.isDynamic = current.hasOptions = this.hasDynamicOptions;
          current.defineOn(target, this);
        } else {
          for (i = 0, ii = properties.length; i < ii; ++i) {
            properties[i].defineOn(target, this);
            if (properties[i].primaryProperty) {
              if (this.primaryProperty) {
                throw new Error('Only one bindable property on a custom element can be defined as the default');
              }
              this.primaryProperty = properties[i];
            }
          }

          current = new BindableProperty({
            name: 'value',
            changeHandler: 'valueChanged' in proto ? 'valueChanged' : null,
            attribute: attributeName,
            defaultBindingMode: attributeDefaultBindingMode
          });

          current.hasOptions = true;
          current.registerWith(target, this);
        }
      } else {
        for (i = 0, ii = properties.length; i < ii; ++i) {
          properties[i].defineOn(target, this);
        }

        this._copyInheritedProperties(container, target);
      }
    }

    register(registry, name) {
      if (this.attributeName !== null) {
        registry.registerAttribute(name || this.attributeName, this, this.attributeName);

        if (Array.isArray(this.aliases)) {
          this.aliases.forEach(alias => {
            registry.registerAttribute(alias, this, this.attributeName);
          });
        }
      }

      if (this.elementName !== null) {
        registry.registerElement(name || this.elementName, this);
      }
    }

    load(container, target, loadContext, viewStrategy, transientView) {
      let options;

      if (this.elementName !== null) {
        viewStrategy = container.get(ViewLocator).getViewStrategy(viewStrategy || this.viewStrategy || target);
        options = new ViewCompileInstruction(this.targetShadowDOM, true);

        if (!viewStrategy.moduleId) {
          viewStrategy.moduleId = Origin.get(target).moduleId;
        }

        return viewStrategy.loadViewFactory(container.get(ViewEngine), options, loadContext, target).then(viewFactory => {
          if (!transientView || !this.viewFactory) {
            this.viewFactory = viewFactory;
          }

          return viewFactory;
        });
      }

      return Promise.resolve(this);
    }

    compile(compiler, resources, node, instruction, parentNode) {
      if (this.liftsContent) {
        if (!instruction.viewFactory) {
          let template = DOM.createElement('template');
          let fragment = DOM.createDocumentFragment();
          let cacheSize = node.getAttribute('view-cache');
          let part = node.getAttribute('part');

          node.removeAttribute(instruction.originalAttrName);
          DOM.replaceNode(template, node, parentNode);
          fragment.appendChild(node);
          instruction.viewFactory = compiler.compile(fragment, resources);

          if (part) {
            instruction.viewFactory.part = part;
            node.removeAttribute('part');
          }

          if (cacheSize) {
            instruction.viewFactory.setCacheSize(cacheSize);
            node.removeAttribute('view-cache');
          }

          node = template;
        }
      } else if (this.elementName !== null) {
        let partReplacements = {};

        if (this.processContent(compiler, resources, node, instruction) && node.hasChildNodes()) {
          let currentChild = node.firstChild;
          let contentElement = this.usesShadowDOM ? null : DOM.createElement('au-content');
          let nextSibling;
          let toReplace;

          while (currentChild) {
            nextSibling = currentChild.nextSibling;

            if (currentChild.tagName === 'TEMPLATE' && (toReplace = currentChild.getAttribute('replace-part'))) {
              partReplacements[toReplace] = compiler.compile(currentChild, resources);
              DOM.removeNode(currentChild, parentNode);
              instruction.partReplacements = partReplacements;
            } else if (contentElement !== null) {
              if (currentChild.nodeType === 3 && _isAllWhitespace(currentChild)) {
                DOM.removeNode(currentChild, parentNode);
              } else {
                contentElement.appendChild(currentChild);
              }
            }

            currentChild = nextSibling;
          }

          if (contentElement !== null && contentElement.hasChildNodes()) {
            node.appendChild(contentElement);
          }

          instruction.skipContentProcessing = false;
        } else {
          instruction.skipContentProcessing = true;
        }
      } else if (!this.processContent(compiler, resources, node, instruction)) {
        instruction.skipContentProcessing = true;
      }

      return node;
    }

    create(container, instruction, element, bindings) {
      let viewHost;
      let au = null;

      instruction = instruction || BehaviorInstruction.normal;
      element = element || null;
      bindings = bindings || null;

      if (this.elementName !== null && element) {
        if (this.usesShadowDOM) {
          viewHost = element.attachShadow(this.shadowDOMOptions);
          container.registerInstance(DOM.boundary, viewHost);
        } else {
          viewHost = element;
          if (this.targetShadowDOM) {
            container.registerInstance(DOM.boundary, viewHost);
          }
        }
      }

      if (element !== null) {
        element.au = au = element.au || {};
      }

      let viewModel = instruction.viewModel || container.get(this.target);
      let controller = new Controller(this, instruction, viewModel, container);
      let childBindings = this.childBindings;
      let viewFactory;

      if (this.liftsContent) {
        au.controller = controller;
      } else if (this.elementName !== null) {
        viewFactory = instruction.viewFactory || this.viewFactory;
        container.viewModel = viewModel;

        if (viewFactory) {
          controller.view = viewFactory.create(container, instruction, element);
        }

        if (element !== null) {
          au.controller = controller;

          if (controller.view) {
            if (!this.usesShadowDOM && (element.childNodes.length === 1 || element.contentElement)) {
              let contentElement = element.childNodes[0] || element.contentElement;
              controller.view.contentView = { fragment: contentElement };
              contentElement.parentNode && DOM.removeNode(contentElement);
            }

            if (instruction.anchorIsContainer) {
              if (childBindings !== null) {
                for (let i = 0, ii = childBindings.length; i < ii; ++i) {
                  controller.view.addBinding(childBindings[i].create(element, viewModel, controller));
                }
              }

              controller.view.appendNodesTo(viewHost);
            } else {
              controller.view.insertNodesBefore(viewHost);
            }
          } else if (childBindings !== null) {
            for (let i = 0, ii = childBindings.length; i < ii; ++i) {
              bindings.push(childBindings[i].create(element, viewModel, controller));
            }
          }
        } else if (controller.view) {
          controller.view.controller = controller;

          if (childBindings !== null) {
            for (let i = 0, ii = childBindings.length; i < ii; ++i) {
              controller.view.addBinding(childBindings[i].create(instruction.host, viewModel, controller));
            }
          }
        } else if (childBindings !== null) {
          for (let i = 0, ii = childBindings.length; i < ii; ++i) {
            bindings.push(childBindings[i].create(instruction.host, viewModel, controller));
          }
        }
      } else if (childBindings !== null) {
        for (let i = 0, ii = childBindings.length; i < ii; ++i) {
          bindings.push(childBindings[i].create(element, viewModel, controller));
        }
      }

      if (au !== null) {
        au[this.htmlName] = controller;
      }

      if (instruction.initiatedByBehavior && viewFactory) {
        controller.view.created();
      }

      return controller;
    }

    _ensurePropertiesDefined(instance, lookup) {
      let properties;
      let i;
      let ii;
      let observer;

      if ('__propertiesDefined__' in lookup) {
        return;
      }

      lookup.__propertiesDefined__ = true;
      properties = this.properties;

      for (i = 0, ii = properties.length; i < ii; ++i) {
        observer = properties[i].createObserver(instance);

        if (observer !== undefined) {
          lookup[observer.propertyName] = observer;
        }
      }
    }

    _copyInheritedProperties(container, target) {
      let behavior;
      let derived = target;

      while (true) {
        let proto = Object.getPrototypeOf(target.prototype);
        target = proto && proto.constructor;
        if (!target) {
          return;
        }
        behavior = metadata.getOwn(metadata.resource, target);
        if (behavior) {
          break;
        }
      }
      behavior.initialize(container, target);
      for (let i = 0, ii = behavior.properties.length; i < ii; ++i) {
        let prop = behavior.properties[i];

        if (this.properties.some(p => p.name === prop.name)) {
          continue;
        }

        new BindableProperty(prop).registerWith(derived, this);
      }
    }
  };

  function createChildObserverDecorator(selectorOrConfig, all) {
    return function (target, key, descriptor) {
      let actualTarget = typeof key === 'string' ? target.constructor : target;
      let r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, actualTarget);

      if (typeof selectorOrConfig === 'string') {
        selectorOrConfig = {
          selector: selectorOrConfig,
          name: key
        };
      }

      if (descriptor) {
        descriptor.writable = true;
        descriptor.configurable = true;
      }

      selectorOrConfig.all = all;
      r.addChildBinding(new ChildObserver(selectorOrConfig));
    };
  }

  function children(selectorOrConfig) {
    return createChildObserverDecorator(selectorOrConfig, true);
  }

  function child(selectorOrConfig) {
    return createChildObserverDecorator(selectorOrConfig, false);
  }

  let ChildObserver = class ChildObserver {
    constructor(config) {
      this.name = config.name;
      this.changeHandler = config.changeHandler || this.name + 'Changed';
      this.selector = config.selector;
      this.all = config.all;
    }

    create(viewHost, viewModel, controller) {
      return new ChildObserverBinder(this.selector, viewHost, this.name, viewModel, controller, this.changeHandler, this.all);
    }
  };


  const noMutations = [];

  function trackMutation(groupedMutations, binder, record) {
    let mutations = groupedMutations.get(binder);

    if (!mutations) {
      mutations = [];
      groupedMutations.set(binder, mutations);
    }

    mutations.push(record);
  }

  function onChildChange(mutations, observer) {
    let binders = observer.binders;
    let bindersLength = binders.length;
    let groupedMutations = new Map();

    for (let i = 0, ii = mutations.length; i < ii; ++i) {
      let record = mutations[i];
      let added = record.addedNodes;
      let removed = record.removedNodes;

      for (let j = 0, jj = removed.length; j < jj; ++j) {
        let node = removed[j];
        if (node.nodeType === 1) {
          for (let k = 0; k < bindersLength; ++k) {
            let binder = binders[k];
            if (binder.onRemove(node)) {
              trackMutation(groupedMutations, binder, record);
            }
          }
        }
      }

      for (let j = 0, jj = added.length; j < jj; ++j) {
        let node = added[j];
        if (node.nodeType === 1) {
          for (let k = 0; k < bindersLength; ++k) {
            let binder = binders[k];
            if (binder.onAdd(node)) {
              trackMutation(groupedMutations, binder, record);
            }
          }
        }
      }
    }

    groupedMutations.forEach((value, key) => {
      if (key.changeHandler !== null) {
        key.viewModel[key.changeHandler](value);
      }
    });
  }

  let ChildObserverBinder = class ChildObserverBinder {
    constructor(selector, viewHost, property, viewModel, controller, changeHandler, all) {
      this.selector = selector;
      this.viewHost = viewHost;
      this.property = property;
      this.viewModel = viewModel;
      this.controller = controller;
      this.changeHandler = changeHandler in viewModel ? changeHandler : null;
      this.usesShadowDOM = controller.behavior.usesShadowDOM;
      this.all = all;

      if (!this.usesShadowDOM && controller.view && controller.view.contentView) {
        this.contentView = controller.view.contentView;
      } else {
        this.contentView = null;
      }
    }

    matches(element) {
      if (element.matches(this.selector)) {
        if (this.contentView === null) {
          return true;
        }

        let contentView = this.contentView;
        let assignedSlot = element.auAssignedSlot;

        if (assignedSlot && assignedSlot.projectFromAnchors) {
          let anchors = assignedSlot.projectFromAnchors;

          for (let i = 0, ii = anchors.length; i < ii; ++i) {
            if (anchors[i].auOwnerView === contentView) {
              return true;
            }
          }

          return false;
        }

        return element.auOwnerView === contentView;
      }

      return false;
    }

    bind(source) {
      let viewHost = this.viewHost;
      let viewModel = this.viewModel;
      let observer = viewHost.__childObserver__;

      if (!observer) {
        observer = viewHost.__childObserver__ = DOM.createMutationObserver(onChildChange);

        let options = {
          childList: true,
          subtree: !this.usesShadowDOM
        };

        observer.observe(viewHost, options);
        observer.binders = [];
      }

      observer.binders.push(this);

      if (this.usesShadowDOM) {
        let current = viewHost.firstElementChild;

        if (this.all) {
          let items = viewModel[this.property];
          if (!items) {
            items = viewModel[this.property] = [];
          } else {
            items.splice(0);
          }

          while (current) {
            if (this.matches(current)) {
              items.push(current.au && current.au.controller ? current.au.controller.viewModel : current);
            }

            current = current.nextElementSibling;
          }

          if (this.changeHandler !== null) {
            this.viewModel[this.changeHandler](noMutations);
          }
        } else {
          while (current) {
            if (this.matches(current)) {
              let value = current.au && current.au.controller ? current.au.controller.viewModel : current;
              this.viewModel[this.property] = value;

              if (this.changeHandler !== null) {
                this.viewModel[this.changeHandler](value);
              }

              break;
            }

            current = current.nextElementSibling;
          }
        }
      }
    }

    onRemove(element) {
      if (this.matches(element)) {
        let value = element.au && element.au.controller ? element.au.controller.viewModel : element;

        if (this.all) {
          let items = this.viewModel[this.property] || (this.viewModel[this.property] = []);
          let index = items.indexOf(value);

          if (index !== -1) {
            items.splice(index, 1);
          }

          return true;
        }

        return false;
      }

      return false;
    }

    onAdd(element) {
      if (this.matches(element)) {
        let value = element.au && element.au.controller ? element.au.controller.viewModel : element;

        if (this.all) {
          let items = this.viewModel[this.property] || (this.viewModel[this.property] = []);

          if (this.selector === '*') {
            items.push(value);
            return true;
          }

          let index = 0;
          let prev = element.previousElementSibling;

          while (prev) {
            if (this.matches(prev)) {
              index++;
            }

            prev = prev.previousElementSibling;
          }

          items.splice(index, 0, value);
          return true;
        }

        this.viewModel[this.property] = value;

        if (this.changeHandler !== null) {
          this.viewModel[this.changeHandler](value);
        }
      }

      return false;
    }

    unbind() {
      if (this.viewHost.__childObserver__) {
        this.viewHost.__childObserver__.disconnect();
        this.viewHost.__childObserver__ = null;
        this.viewModel[this.property] = null;
      }
    }
  };


  function remove(viewSlot, previous) {
    return Array.isArray(previous) ? viewSlot.removeMany(previous, true) : viewSlot.remove(previous, true);
  }

  const SwapStrategies = {
    before(viewSlot, previous, callback) {
      return previous === undefined ? callback() : callback().then(() => remove(viewSlot, previous));
    },

    with(viewSlot, previous, callback) {
      return previous === undefined ? callback() : Promise.all([remove(viewSlot, previous), callback()]);
    },

    after(viewSlot, previous, callback) {
      return Promise.resolve(viewSlot.removeAll(true)).then(callback);
    }
  };

  function tryActivateViewModel(context) {
    if (context.skipActivation || typeof context.viewModel.activate !== 'function') {
      return Promise.resolve();
    }

    return context.viewModel.activate(context.model) || Promise.resolve();
  }

  let CompositionEngine = (_dec10$1 = inject(ViewEngine, ViewLocator), _dec10$1(_class17 = class CompositionEngine {
    constructor(viewEngine, viewLocator) {
      this.viewEngine = viewEngine;
      this.viewLocator = viewLocator;
    }

    _swap(context, view) {
      let swapStrategy = SwapStrategies[context.swapOrder] || SwapStrategies.after;
      let previousViews = context.viewSlot.children.slice();

      return swapStrategy(context.viewSlot, previousViews, () => {
        return Promise.resolve(context.viewSlot.add(view)).then(() => {
          if (context.currentController) {
            context.currentController.unbind();
          }
        });
      }).then(() => {
        if (context.compositionTransactionNotifier) {
          context.compositionTransactionNotifier.done();
        }
      });
    }

    _createControllerAndSwap(context) {
      return this.createController(context).then(controller => {
        if (context.compositionTransactionOwnershipToken) {
          return context.compositionTransactionOwnershipToken.waitForCompositionComplete().then(() => {
            controller.automate(context.overrideContext, context.owningView);

            return this._swap(context, controller.view);
          }).then(() => controller);
        }

        controller.automate(context.overrideContext, context.owningView);

        return this._swap(context, controller.view).then(() => controller);
      });
    }

    createController(context) {
      let childContainer;
      let viewModel;
      let viewModelResource;

      let m;

      return this.ensureViewModel(context).then(tryActivateViewModel).then(() => {
        childContainer = context.childContainer;
        viewModel = context.viewModel;
        viewModelResource = context.viewModelResource;
        m = viewModelResource.metadata;

        let viewStrategy = this.viewLocator.getViewStrategy(context.view || viewModel);

        if (context.viewResources) {
          viewStrategy.makeRelativeTo(context.viewResources.viewUrl);
        }

        return m.load(childContainer, viewModelResource.value, null, viewStrategy, true);
      }).then(viewFactory => m.create(childContainer, BehaviorInstruction.dynamic(context.host, viewModel, viewFactory)));
    }

    ensureViewModel(context) {
      let childContainer = context.childContainer = context.childContainer || context.container.createChild();

      if (typeof context.viewModel === 'string') {
        context.viewModel = context.viewResources ? context.viewResources.relativeToView(context.viewModel) : context.viewModel;

        return this.viewEngine.importViewModelResource(context.viewModel).then(viewModelResource => {
          childContainer.autoRegister(viewModelResource.value);

          if (context.host) {
            childContainer.registerInstance(DOM.Element, context.host);
          }

          context.viewModel = childContainer.viewModel = childContainer.get(viewModelResource.value);
          context.viewModelResource = viewModelResource;
          return context;
        });
      }

      let ctor = context.viewModel.constructor;
      let isClass = typeof context.viewModel === 'function';
      if (isClass) {
        ctor = context.viewModel;
        childContainer.autoRegister(ctor);
      }
      let m = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, ctor);

      m.elementName = m.elementName || 'dynamic-element';

      m.initialize(isClass ? childContainer : context.container || childContainer, ctor);

      context.viewModelResource = { metadata: m, value: ctor };

      if (context.host) {
        childContainer.registerInstance(DOM.Element, context.host);
      }
      childContainer.viewModel = context.viewModel = isClass ? childContainer.get(ctor) : context.viewModel;
      return Promise.resolve(context);
    }

    compose(context) {
      context.childContainer = context.childContainer || context.container.createChild();
      context.view = this.viewLocator.getViewStrategy(context.view);

      let transaction = context.childContainer.get(CompositionTransaction);
      let compositionTransactionOwnershipToken = transaction.tryCapture();

      if (compositionTransactionOwnershipToken) {
        context.compositionTransactionOwnershipToken = compositionTransactionOwnershipToken;
      } else {
        context.compositionTransactionNotifier = transaction.enlist();
      }

      if (context.viewModel) {
        return this._createControllerAndSwap(context);
      } else if (context.view) {
        if (context.viewResources) {
          context.view.makeRelativeTo(context.viewResources.viewUrl);
        }

        return context.view.loadViewFactory(this.viewEngine, new ViewCompileInstruction()).then(viewFactory => {
          let result = viewFactory.create(context.childContainer);
          result.bind(context.bindingContext, context.overrideContext);

          if (context.compositionTransactionOwnershipToken) {
            return context.compositionTransactionOwnershipToken.waitForCompositionComplete().then(() => this._swap(context, result)).then(() => result);
          }

          return this._swap(context, result).then(() => result);
        });
      } else if (context.viewSlot) {
        context.viewSlot.removeAll();

        if (context.compositionTransactionNotifier) {
          context.compositionTransactionNotifier.done();
        }

        return Promise.resolve(null);
      }

      return Promise.resolve(null);
    }
  }) || _class17);

  let ElementConfigResource = class ElementConfigResource {
    initialize(container, target) {}

    register(registry, name) {}

    load(container, target) {
      let config = new target();
      let eventManager = container.get(EventManager);
      eventManager.registerElementConfig(config);
    }
  };

  function resource(instanceOrConfig) {
    return function (target) {
      let isConfig = typeof instanceOrConfig === 'string' || Object.getPrototypeOf(instanceOrConfig) === Object.prototype;
      if (isConfig) {
        target.$resource = instanceOrConfig;
      } else {
        metadata.define(metadata.resource, instanceOrConfig, target);
      }
    };
  }

  function behavior(override) {
    return function (target) {
      if (override instanceof HtmlBehaviorResource) {
        metadata.define(metadata.resource, override, target);
      } else {
        let r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, target);
        Object.assign(r, override);
      }
    };
  }

  function customElement(name) {
    return function (target) {
      let r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, target);
      r.elementName = validateBehaviorName(name, 'custom element');
    };
  }

  function customAttribute(name, defaultBindingMode, aliases) {
    return function (target) {
      let r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, target);
      r.attributeName = validateBehaviorName(name, 'custom attribute');
      r.attributeDefaultBindingMode = defaultBindingMode;
      r.aliases = aliases;
    };
  }

  function templateController(target) {
    let deco = function (t) {
      let r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, t);
      r.liftsContent = true;
    };

    return target ? deco(target) : deco;
  }

  function bindable(nameOrConfigOrTarget, key, descriptor) {
    let deco = function (target, key2, descriptor2) {
      let actualTarget = key2 ? target.constructor : target;
      let r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, actualTarget);
      let prop;

      if (key2) {
        nameOrConfigOrTarget = nameOrConfigOrTarget || {};
        nameOrConfigOrTarget.name = key2;
      }

      prop = new BindableProperty(nameOrConfigOrTarget);
      return prop.registerWith(actualTarget, r, descriptor2);
    };

    if (!nameOrConfigOrTarget) {
      return deco;
    }

    if (key) {
      let target = nameOrConfigOrTarget;
      nameOrConfigOrTarget = null;
      return deco(target, key, descriptor);
    }

    return deco;
  }

  function dynamicOptions(target) {
    let deco = function (t) {
      let r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, t);
      r.hasDynamicOptions = true;
    };

    return target ? deco(target) : deco;
  }

  const defaultShadowDOMOptions = { mode: 'open' };

  function useShadowDOM(targetOrOptions) {
    let options = typeof targetOrOptions === 'function' || !targetOrOptions ? defaultShadowDOMOptions : targetOrOptions;

    let deco = function (t) {
      let r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, t);
      r.targetShadowDOM = true;
      r.shadowDOMOptions = options;
    };

    return typeof targetOrOptions === 'function' ? deco(targetOrOptions) : deco;
  }

  function processAttributes(processor) {
    return function (t) {
      let r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, t);
      r.processAttributes = function (compiler, resources, node, attributes, elementInstruction) {
        try {
          processor(compiler, resources, node, attributes, elementInstruction);
        } catch (error) {
          getLogger('templating').error(error);
        }
      };
    };
  }

  function doNotProcessContent() {
    return false;
  }

  function processContent(processor) {
    return function (t) {
      let r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, t);
      r.processContent = processor ? function (compiler, resources, node, instruction) {
        try {
          return processor(compiler, resources, node, instruction);
        } catch (error) {
          getLogger('templating').error(error);
          return false;
        }
      } : doNotProcessContent;
    };
  }

  function containerless(target) {
    let deco = function (t) {
      let r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, t);
      r.containerless = true;
    };

    return target ? deco(target) : deco;
  }

  function useViewStrategy(strategy) {
    return function (target) {
      metadata.define(ViewLocator.viewStrategyMetadataKey, strategy, target);
    };
  }

  function useView(path) {
    return useViewStrategy(new RelativeViewStrategy(path));
  }

  function inlineView(markup, dependencies, dependencyBaseUrl) {
    return useViewStrategy(new InlineViewStrategy(markup, dependencies, dependencyBaseUrl));
  }

  function noView(targetOrDependencies, dependencyBaseUrl) {
    let target;
    let dependencies;
    if (typeof targetOrDependencies === 'function') {
      target = targetOrDependencies;
    } else {
      dependencies = targetOrDependencies;
      target = undefined;
    }

    let deco = function (t) {
      metadata.define(ViewLocator.viewStrategyMetadataKey, new NoViewStrategy(dependencies, dependencyBaseUrl), t);
    };

    return target ? deco(target) : deco;
  }

  function view(templateOrConfig) {
    return function (target) {
      target.$view = templateOrConfig;
    };
  }

  function elementConfig(target) {
    let deco = function (t) {
      metadata.define(metadata.resource, new ElementConfigResource(), t);
    };

    return target ? deco(target) : deco;
  }

  function viewResources(...resources) {
    return function (target) {
      metadata.define(ViewEngine.viewModelRequireMetadataKey, resources, target);
    };
  }

  let TemplatingEngine = (_dec11 = inject(Container, ModuleAnalyzer, ViewCompiler, CompositionEngine), _dec11(_class18 = class TemplatingEngine {
    constructor(container, moduleAnalyzer, viewCompiler, compositionEngine) {
      this._container = container;
      this._moduleAnalyzer = moduleAnalyzer;
      this._viewCompiler = viewCompiler;
      this._compositionEngine = compositionEngine;
      container.registerInstance(Animator, Animator.instance = new Animator());
    }

    configureAnimator(animator) {
      this._container.unregister(Animator);
      this._container.registerInstance(Animator, Animator.instance = animator);
    }

    compose(context) {
      return this._compositionEngine.compose(context);
    }

    enhance(instruction) {
      if (instruction instanceof DOM.Element) {
        instruction = { element: instruction };
      }

      let compilerInstructions = { letExpressions: [] };
      let resources = instruction.resources || this._container.get(ViewResources);

      this._viewCompiler._compileNode(instruction.element, resources, compilerInstructions, instruction.element.parentNode, 'root', true);

      let factory = new ViewFactory(instruction.element, compilerInstructions, resources);
      let container = instruction.container || this._container.createChild();
      let view = factory.create(container, BehaviorInstruction.enhance());

      view.bind(instruction.bindingContext || {}, instruction.overrideContext);

      view.firstChild = view.lastChild = view.fragment;
      view.fragment = DOM.createDocumentFragment();
      view.attached();

      return view;
    }
  }) || _class18);

  function preventActionlessFormSubmit() {
    DOM.addEventListener('submit', evt => {
      const target = evt.target;
      const action = target.action;

      if (target.tagName.toLowerCase() === 'form' && !action) {
        evt.preventDefault();
      }
    });
  }

  let Aurelia = class Aurelia {
    constructor(loader, container, resources) {
      this.loader = loader || new PLATFORM.Loader();
      this.container = container || new Container().makeGlobal();
      this.resources = resources || new ViewResources();
      this.use = new FrameworkConfiguration(this);
      this.logger = getLogger('aurelia');
      this.hostConfigured = false;
      this.host = null;

      this.use.instance(Aurelia, this);
      this.use.instance(Loader, this.loader);
      this.use.instance(ViewResources, this.resources);
    }

    start() {
      if (this._started) {
        return this._started;
      }

      this.logger.info('Aurelia Starting');
      return this._started = this.use.apply().then(() => {
        preventActionlessFormSubmit();

        if (!this.container.hasResolver(BindingLanguage)) {
          let message = 'You must configure Aurelia with a BindingLanguage implementation.';
          this.logger.error(message);
          throw new Error(message);
        }

        this.logger.info('Aurelia Started');
        let evt = DOM.createCustomEvent('aurelia-started', { bubbles: true, cancelable: true });
        DOM.dispatchEvent(evt);
        return this;
      });
    }

    enhance(bindingContext = {}, applicationHost = null) {
      this._configureHost(applicationHost || DOM.querySelectorAll('body')[0]);

      return new Promise(resolve => {
        let engine = this.container.get(TemplatingEngine);
        this.root = engine.enhance({ container: this.container, element: this.host, resources: this.resources, bindingContext: bindingContext });
        this.root.attached();
        this._onAureliaComposed();
        resolve(this);
      });
    }

    setRoot(root = null, applicationHost = null) {
      let instruction = {};

      if (this.root && this.root.viewModel && this.root.viewModel.router) {
        this.root.viewModel.router.deactivate();
        this.root.viewModel.router.reset();
      }

      this._configureHost(applicationHost);

      let engine = this.container.get(TemplatingEngine);
      let transaction = this.container.get(CompositionTransaction);
      delete transaction.initialComposition;

      if (!root) {
        if (this.configModuleId) {
          root = relativeToFile('./app', this.configModuleId);
        } else {
          root = 'app';
        }
      }

      instruction.viewModel = root;
      instruction.container = instruction.childContainer = this.container;
      instruction.viewSlot = this.hostSlot;
      instruction.host = this.host;

      return engine.compose(instruction).then(r => {
        this.root = r;
        instruction.viewSlot.attached();
        this._onAureliaComposed();
        return this;
      });
    }

    _configureHost(applicationHost) {
      if (this.hostConfigured) {
        return;
      }
      applicationHost = applicationHost || this.host;

      if (!applicationHost || typeof applicationHost === 'string') {
        this.host = DOM.getElementById(applicationHost || 'applicationHost');
      } else {
        this.host = applicationHost;
      }

      if (!this.host) {
        throw new Error('No applicationHost was specified.');
      }

      this.hostConfigured = true;
      this.host.aurelia = this;
      this.hostSlot = new ViewSlot(this.host, true);
      this.hostSlot.transformChildNodesIntoView();
      this.container.registerInstance(DOM.boundary, this.host);
    }

    _onAureliaComposed() {
      let evt = DOM.createCustomEvent('aurelia-composed', { bubbles: true, cancelable: true });
      setTimeout(() => DOM.dispatchEvent(evt), 1);
    }
  };

  const logger$2 = getLogger('aurelia');
  const extPattern = /\.[^/.]+$/;

  function runTasks(config, tasks) {
    let current;
    let next = () => {
      current = tasks.shift();
      if (current) {
        return Promise.resolve(current(config)).then(next);
      }

      return Promise.resolve();
    };

    return next();
  }

  function loadPlugin(fwConfig, loader, info) {
    logger$2.debug(`Loading plugin ${info.moduleId}.`);
    if (typeof info.moduleId === 'string') {
      fwConfig.resourcesRelativeTo = info.resourcesRelativeTo;

      let id = info.moduleId;

      if (info.resourcesRelativeTo.length > 1) {
        return loader.normalize(info.moduleId, info.resourcesRelativeTo[1]).then(normalizedId => _loadPlugin(normalizedId));
      }

      return _loadPlugin(id);
    } else if (typeof info.configure === 'function') {
      if (fwConfig.configuredPlugins.indexOf(info.configure) !== -1) {
        return Promise.resolve();
      }
      fwConfig.configuredPlugins.push(info.configure);

      return Promise.resolve(info.configure.call(null, fwConfig, info.config || {}));
    }
    throw new Error(invalidConfigMsg(info.moduleId || info.configure, 'plugin'));

    function _loadPlugin(moduleId) {
      return loader.loadModule(moduleId).then(m => {
        if ('configure' in m) {
          if (fwConfig.configuredPlugins.indexOf(m.configure) !== -1) {
            return Promise.resolve();
          }
          return Promise.resolve(m.configure(fwConfig, info.config || {})).then(() => {
            fwConfig.configuredPlugins.push(m.configure);
            fwConfig.resourcesRelativeTo = null;
            logger$2.debug(`Configured plugin ${info.moduleId}.`);
          });
        }

        fwConfig.resourcesRelativeTo = null;
        logger$2.debug(`Loaded plugin ${info.moduleId}.`);
      });
    }
  }

  function loadResources(aurelia, resourcesToLoad, appResources) {
    if (Object.keys(resourcesToLoad).length === 0) {
      return Promise.resolve();
    }
    let viewEngine = aurelia.container.get(ViewEngine);

    return Promise.all(Object.keys(resourcesToLoad).map(n => _normalize(resourcesToLoad[n]))).then(loads => {
      let names = [];
      let importIds = [];

      loads.forEach(l => {
        names.push(undefined);
        importIds.push(l.importId);
      });

      return viewEngine.importViewResources(importIds, names, appResources);
    });

    function _normalize(load) {
      let moduleId = load.moduleId;
      let ext = getExt(moduleId);

      if (isOtherResource(moduleId)) {
        moduleId = removeExt(moduleId);
      }

      return aurelia.loader.normalize(moduleId, load.relativeTo).then(normalized => {
        return {
          name: load.moduleId,
          importId: isOtherResource(load.moduleId) ? addOriginalExt(normalized, ext) : normalized
        };
      });
    }

    function isOtherResource(name) {
      let ext = getExt(name);
      if (!ext) return false;
      if (ext === '') return false;
      if (ext === '.js' || ext === '.ts') return false;
      return true;
    }

    function removeExt(name) {
      return name.replace(extPattern, '');
    }

    function addOriginalExt(normalized, ext) {
      return removeExt(normalized) + '.' + ext;
    }
  }

  function getExt(name) {
    let match = name.match(extPattern);
    if (match && match.length > 0) {
      return match[0].split('.')[1];
    }
  }

  function loadBehaviors(config) {
    return Promise.all(config.behaviorsToLoad.map(m => m.load(config.container, m.target))).then(() => {
      config.behaviorsToLoad = null;
    });
  }

  function assertProcessed(plugins) {
    if (plugins.processed) {
      throw new Error('This config instance has already been applied. To load more plugins or global resources, create a new FrameworkConfiguration instance.');
    }
  }

  function invalidConfigMsg(cfg, type) {
    return `Invalid ${type} [${cfg}], ${type} must be specified as functions or relative module IDs.`;
  }

  let FrameworkConfiguration = class FrameworkConfiguration {
    constructor(aurelia) {
      this.aurelia = aurelia;
      this.container = aurelia.container;

      this.info = [];
      this.processed = false;
      this.preTasks = [];
      this.postTasks = [];

      this.behaviorsToLoad = [];

      this.configuredPlugins = [];
      this.resourcesToLoad = {};
      this.preTask(() => aurelia.loader.normalize('aurelia-bootstrapper').then(name => this.bootstrapperName = name));
      this.postTask(() => loadResources(aurelia, this.resourcesToLoad, aurelia.resources));
    }

    instance(type, instance) {
      this.container.registerInstance(type, instance);
      return this;
    }

    singleton(type, implementation) {
      this.container.registerSingleton(type, implementation);
      return this;
    }

    transient(type, implementation) {
      this.container.registerTransient(type, implementation);
      return this;
    }

    preTask(task) {
      assertProcessed(this);
      this.preTasks.push(task);
      return this;
    }

    postTask(task) {
      assertProcessed(this);
      this.postTasks.push(task);
      return this;
    }

    feature(plugin, config = {}) {
      switch (typeof plugin) {
        case 'string':
          let hasIndex = /\/index$/i.test(plugin);
          let moduleId = hasIndex || getExt(plugin) ? plugin : plugin + '/index';
          let root = hasIndex ? plugin.substr(0, plugin.length - 6) : plugin;
          this.info.push({ moduleId, resourcesRelativeTo: [root, ''], config });
          break;

        case 'function':
          this.info.push({ configure: plugin, config: config || {} });
          break;
        default:
          throw new Error(invalidConfigMsg(plugin, 'feature'));
      }
      return this;
    }

    globalResources(resources) {
      assertProcessed(this);

      let toAdd = Array.isArray(resources) ? resources : arguments;
      let resource;
      let resourcesRelativeTo = this.resourcesRelativeTo || ['', ''];

      for (let i = 0, ii = toAdd.length; i < ii; ++i) {
        resource = toAdd[i];
        switch (typeof resource) {
          case 'string':
            let parent = resourcesRelativeTo[0];
            let grandParent = resourcesRelativeTo[1];
            let name = resource;

            if ((resource.startsWith('./') || resource.startsWith('../')) && parent !== '') {
              name = join(parent, resource);
            }

            this.resourcesToLoad[name] = { moduleId: name, relativeTo: grandParent };
            break;
          case 'function':
            let meta = this.aurelia.resources.autoRegister(this.container, resource);
            if (meta instanceof HtmlBehaviorResource && meta.elementName !== null) {
              if (this.behaviorsToLoad.push(meta) === 1) {
                this.postTask(() => loadBehaviors(this));
              }
            }
            break;
          default:
            throw new Error(invalidConfigMsg(resource, 'resource'));
        }
      }

      return this;
    }

    globalName(resourcePath, newName) {
      assertProcessed(this);
      this.resourcesToLoad[resourcePath] = { moduleId: newName, relativeTo: '' };
      return this;
    }

    plugin(plugin, pluginConfig) {
      assertProcessed(this);

      let info;
      switch (typeof plugin) {
        case 'string':
          info = { moduleId: plugin, resourcesRelativeTo: [plugin, ''], config: pluginConfig || {} };
          break;
        case 'function':
          info = { configure: plugin, config: pluginConfig || {} };
          break;
        default:
          throw new Error(invalidConfigMsg(plugin, 'plugin'));
      }
      this.info.push(info);
      return this;
    }

    _addNormalizedPlugin(name, config) {
      let plugin = { moduleId: name, resourcesRelativeTo: [name, ''], config: config || {} };
      this.info.push(plugin);

      this.preTask(() => {
        let relativeTo = [name, this.bootstrapperName];
        plugin.moduleId = name;
        plugin.resourcesRelativeTo = relativeTo;
        return Promise.resolve();
      });

      return this;
    }

    defaultBindingLanguage() {
      return this._addNormalizedPlugin('aurelia-templating-binding');
    }

    router() {
      return this._addNormalizedPlugin('aurelia-templating-router');
    }

    history() {
      return this._addNormalizedPlugin('aurelia-history-browser');
    }

    defaultResources() {
      return this._addNormalizedPlugin('aurelia-templating-resources');
    }

    eventAggregator() {
      return this._addNormalizedPlugin('aurelia-event-aggregator');
    }

    basicConfiguration() {
      return this.defaultBindingLanguage().defaultResources().eventAggregator();
    }

    standardConfiguration() {
      return this.basicConfiguration().history().router();
    }

    developmentLogging(level) {
      let logLevel$1 = level ? logLevel[level] : undefined;

      if (logLevel$1 === undefined) {
        logLevel$1 = logLevel.debug;
      }

      this.preTask(() => {
        return this.aurelia.loader.normalize('aurelia-logging-console', this.bootstrapperName).then(name => {
          return this.aurelia.loader.loadModule(name).then(m => {
            addAppender(new m.ConsoleAppender());
            setLevel(logLevel$1);
          });
        });
      });

      return this;
    }

    apply() {
      if (this.processed) {
        return Promise.resolve();
      }

      return runTasks(this, this.preTasks).then(() => {
        let loader = this.aurelia.loader;
        let info = this.info;
        let current;

        let next = () => {
          current = info.shift();
          if (current) {
            return loadPlugin(this, loader, current).then(next);
          }

          this.processed = true;
          this.configuredPlugins = null;
          return Promise.resolve();
        };

        return next().then(() => runTasks(this, this.postTasks));
      });
    }
  };

  const LogManager = TheLogManager;

  var _class$3, _temp$2, _dec$3, _class2$3, _dec2$3, _class3$3, _class4$2, _temp2$2, _class5$3, _temp3$1;

  let AttributeMap = (_temp$2 = _class$3 = class AttributeMap {

    constructor(svg) {
      this.elements = Object.create(null);
      this.allElements = Object.create(null);

      this.svg = svg;

      this.registerUniversal('accesskey', 'accessKey');
      this.registerUniversal('contenteditable', 'contentEditable');
      this.registerUniversal('tabindex', 'tabIndex');
      this.registerUniversal('textcontent', 'textContent');
      this.registerUniversal('innerhtml', 'innerHTML');
      this.registerUniversal('scrolltop', 'scrollTop');
      this.registerUniversal('scrollleft', 'scrollLeft');
      this.registerUniversal('readonly', 'readOnly');

      this.register('label', 'for', 'htmlFor');

      this.register('img', 'usemap', 'useMap');

      this.register('input', 'maxlength', 'maxLength');
      this.register('input', 'minlength', 'minLength');
      this.register('input', 'formaction', 'formAction');
      this.register('input', 'formenctype', 'formEncType');
      this.register('input', 'formmethod', 'formMethod');
      this.register('input', 'formnovalidate', 'formNoValidate');
      this.register('input', 'formtarget', 'formTarget');

      this.register('textarea', 'maxlength', 'maxLength');

      this.register('td', 'rowspan', 'rowSpan');
      this.register('td', 'colspan', 'colSpan');
      this.register('th', 'rowspan', 'rowSpan');
      this.register('th', 'colspan', 'colSpan');
    }

    register(elementName, attributeName, propertyName) {
      elementName = elementName.toLowerCase();
      attributeName = attributeName.toLowerCase();
      const element = this.elements[elementName] = this.elements[elementName] || Object.create(null);
      element[attributeName] = propertyName;
    }

    registerUniversal(attributeName, propertyName) {
      attributeName = attributeName.toLowerCase();
      this.allElements[attributeName] = propertyName;
    }

    map(elementName, attributeName) {
      if (this.svg.isStandardSvgAttribute(elementName, attributeName)) {
        return attributeName;
      }
      elementName = elementName.toLowerCase();
      attributeName = attributeName.toLowerCase();
      const element = this.elements[elementName];
      if (element !== undefined && attributeName in element) {
        return element[attributeName];
      }
      if (attributeName in this.allElements) {
        return this.allElements[attributeName];
      }

      if (/(?:^data-)|(?:^aria-)|:/.test(attributeName)) {
        return attributeName;
      }
      return camelCase(attributeName);
    }
  }, _class$3.inject = [SVGAnalyzer], _temp$2);

  let InterpolationBindingExpression = class InterpolationBindingExpression {
    constructor(observerLocator, targetProperty, parts, mode, lookupFunctions, attribute) {
      this.observerLocator = observerLocator;
      this.targetProperty = targetProperty;
      this.parts = parts;
      this.mode = mode;
      this.lookupFunctions = lookupFunctions;
      this.attribute = this.attrToRemove = attribute;
      this.discrete = false;
    }

    createBinding(target) {
      if (this.parts.length === 3) {
        return new ChildInterpolationBinding(target, this.observerLocator, this.parts[1], this.mode, this.lookupFunctions, this.targetProperty, this.parts[0], this.parts[2]);
      }
      return new InterpolationBinding(this.observerLocator, this.parts, target, this.targetProperty, this.mode, this.lookupFunctions);
    }
  };

  function validateTarget(target, propertyName) {
    if (propertyName === 'style') {
      getLogger('templating-binding').info('Internet Explorer does not support interpolation in "style" attributes.  Use the style attribute\'s alias, "css" instead.');
    } else if (target.parentElement && target.parentElement.nodeName === 'TEXTAREA' && propertyName === 'textContent') {
      throw new Error('Interpolation binding cannot be used in the content of a textarea element.  Use <textarea value.bind="expression"></textarea> instead.');
    }
  }

  let InterpolationBinding = class InterpolationBinding {
    constructor(observerLocator, parts, target, targetProperty, mode, lookupFunctions) {
      validateTarget(target, targetProperty);
      this.observerLocator = observerLocator;
      this.parts = parts;
      this.target = target;
      this.targetProperty = targetProperty;
      this.targetAccessor = observerLocator.getAccessor(target, targetProperty);
      this.mode = mode;
      this.lookupFunctions = lookupFunctions;
    }

    interpolate() {
      if (this.isBound) {
        let value = '';
        let parts = this.parts;
        for (let i = 0, ii = parts.length; i < ii; i++) {
          value += i % 2 === 0 ? parts[i] : this[`childBinding${i}`].value;
        }
        this.targetAccessor.setValue(value, this.target, this.targetProperty);
      }
    }

    updateOneTimeBindings() {
      for (let i = 1, ii = this.parts.length; i < ii; i += 2) {
        let child = this[`childBinding${i}`];
        if (child.mode === bindingMode.oneTime) {
          child.call();
        }
      }
    }

    bind(source) {
      if (this.isBound) {
        if (this.source === source) {
          return;
        }
        this.unbind();
      }
      this.source = source;

      let parts = this.parts;
      for (let i = 1, ii = parts.length; i < ii; i += 2) {
        let binding = new ChildInterpolationBinding(this, this.observerLocator, parts[i], this.mode, this.lookupFunctions);
        binding.bind(source);
        this[`childBinding${i}`] = binding;
      }

      this.isBound = true;
      this.interpolate();
    }

    unbind() {
      if (!this.isBound) {
        return;
      }
      this.isBound = false;
      this.source = null;
      let parts = this.parts;
      for (let i = 1, ii = parts.length; i < ii; i += 2) {
        let name = `childBinding${i}`;
        this[name].unbind();
      }
    }
  };

  let ChildInterpolationBinding = (_dec$3 = connectable(), _dec$3(_class2$3 = class ChildInterpolationBinding {
    constructor(target, observerLocator, sourceExpression, mode, lookupFunctions, targetProperty, left, right) {
      if (target instanceof InterpolationBinding) {
        this.parent = target;
      } else {
        validateTarget(target, targetProperty);
        this.target = target;
        this.targetProperty = targetProperty;
        this.targetAccessor = observerLocator.getAccessor(target, targetProperty);
      }
      this.observerLocator = observerLocator;
      this.sourceExpression = sourceExpression;
      this.mode = mode;
      this.lookupFunctions = lookupFunctions;
      this.left = left;
      this.right = right;
    }

    updateTarget(value) {
      value = value === null || value === undefined ? '' : value.toString();
      if (value !== this.value) {
        this.value = value;
        if (this.parent) {
          this.parent.interpolate();
        } else {
          this.targetAccessor.setValue(this.left + value + this.right, this.target, this.targetProperty);
        }
      }
    }

    call() {
      if (!this.isBound) {
        return;
      }

      this.rawValue = this.sourceExpression.evaluate(this.source, this.lookupFunctions);
      this.updateTarget(this.rawValue);

      if (this.mode !== bindingMode.oneTime) {
        this._version++;
        this.sourceExpression.connect(this, this.source);
        if (this.rawValue instanceof Array) {
          this.observeArray(this.rawValue);
        }
        this.unobserve(false);
      }
    }

    bind(source) {
      if (this.isBound) {
        if (this.source === source) {
          return;
        }
        this.unbind();
      }
      this.isBound = true;
      this.source = source;

      let sourceExpression = this.sourceExpression;
      if (sourceExpression.bind) {
        sourceExpression.bind(this, source, this.lookupFunctions);
      }

      this.rawValue = sourceExpression.evaluate(source, this.lookupFunctions);
      this.updateTarget(this.rawValue);

      if (this.mode === bindingMode.oneWay) {
        enqueueBindingConnect(this);
      }
    }

    unbind() {
      if (!this.isBound) {
        return;
      }
      this.isBound = false;
      let sourceExpression = this.sourceExpression;
      if (sourceExpression.unbind) {
        sourceExpression.unbind(this, this.source);
      }
      this.source = null;
      this.value = null;
      this.rawValue = null;
      this.unobserve(true);
    }

    connect(evaluate) {
      if (!this.isBound) {
        return;
      }
      if (evaluate) {
        this.rawValue = this.sourceExpression.evaluate(this.source, this.lookupFunctions);
        this.updateTarget(this.rawValue);
      }
      this.sourceExpression.connect(this, this.source);
      if (this.rawValue instanceof Array) {
        this.observeArray(this.rawValue);
      }
    }
  }) || _class2$3);

  let LetExpression = class LetExpression {
    constructor(observerLocator, targetProperty, sourceExpression, lookupFunctions, toBindingContext) {
      this.observerLocator = observerLocator;
      this.sourceExpression = sourceExpression;
      this.targetProperty = targetProperty;
      this.lookupFunctions = lookupFunctions;
      this.toBindingContext = toBindingContext;
    }

    createBinding() {
      return new LetBinding(this.observerLocator, this.sourceExpression, this.targetProperty, this.lookupFunctions, this.toBindingContext);
    }
  };

  let LetBinding = (_dec2$3 = connectable(), _dec2$3(_class3$3 = class LetBinding {
    constructor(observerLocator, sourceExpression, targetProperty, lookupFunctions, toBindingContext) {
      this.observerLocator = observerLocator;
      this.sourceExpression = sourceExpression;
      this.targetProperty = targetProperty;
      this.lookupFunctions = lookupFunctions;
      this.source = null;
      this.target = null;
      this.toBindingContext = toBindingContext;
    }

    updateTarget() {
      const value = this.sourceExpression.evaluate(this.source, this.lookupFunctions);
      this.target[this.targetProperty] = value;
    }

    call(context) {
      if (!this.isBound) {
        return;
      }
      if (context === sourceContext) {
        this.updateTarget();
        return;
      }
      throw new Error(`Unexpected call context ${context}`);
    }

    bind(source) {
      if (this.isBound) {
        if (this.source === source) {
          return;
        }
        this.unbind();
      }

      this.isBound = true;
      this.source = source;
      this.target = this.toBindingContext ? source.bindingContext : source.overrideContext;

      if (this.sourceExpression.bind) {
        this.sourceExpression.bind(this, source, this.lookupFunctions);
      }

      enqueueBindingConnect(this);
    }

    unbind() {
      if (!this.isBound) {
        return;
      }
      this.isBound = false;
      if (this.sourceExpression.unbind) {
        this.sourceExpression.unbind(this, this.source);
      }
      this.source = null;
      this.target = null;
      this.unobserve(true);
    }

    connect() {
      if (!this.isBound) {
        return;
      }
      this.updateTarget();
      this.sourceExpression.connect(this, this.source);
    }
  }) || _class3$3);

  let LetInterpolationBindingExpression = class LetInterpolationBindingExpression {
    constructor(observerLocator, targetProperty, parts, lookupFunctions, toBindingContext) {
      this.observerLocator = observerLocator;
      this.targetProperty = targetProperty;
      this.parts = parts;
      this.lookupFunctions = lookupFunctions;
      this.toBindingContext = toBindingContext;
    }

    createBinding() {
      return new LetInterpolationBinding(this.observerLocator, this.targetProperty, this.parts, this.lookupFunctions, this.toBindingContext);
    }
  };

  let LetInterpolationBinding = class LetInterpolationBinding {
    constructor(observerLocator, targetProperty, parts, lookupFunctions, toBindingContext) {
      this.observerLocator = observerLocator;
      this.parts = parts;
      this.targetProperty = targetProperty;
      this.lookupFunctions = lookupFunctions;
      this.toBindingContext = toBindingContext;
      this.target = null;
    }

    bind(source) {
      if (this.isBound) {
        if (this.source === source) {
          return;
        }
        this.unbind();
      }

      this.isBound = true;
      this.source = source;
      this.target = this.toBindingContext ? source.bindingContext : source.overrideContext;

      this.interpolationBinding = this.createInterpolationBinding();
      this.interpolationBinding.bind(source);
    }

    unbind() {
      if (!this.isBound) {
        return;
      }
      this.isBound = false;
      this.source = null;
      this.target = null;
      this.interpolationBinding.unbind();
      this.interpolationBinding = null;
    }

    createInterpolationBinding() {
      if (this.parts.length === 3) {
        return new ChildInterpolationBinding(this.target, this.observerLocator, this.parts[1], bindingMode.oneWay, this.lookupFunctions, this.targetProperty, this.parts[0], this.parts[2]);
      }
      return new InterpolationBinding(this.observerLocator, this.parts, this.target, this.targetProperty, bindingMode.oneWay, this.lookupFunctions);
    }
  };

  let SyntaxInterpreter = (_temp2$2 = _class4$2 = class SyntaxInterpreter {

    constructor(parser, observerLocator, eventManager, attributeMap) {
      this.parser = parser;
      this.observerLocator = observerLocator;
      this.eventManager = eventManager;
      this.attributeMap = attributeMap;
    }

    interpret(resources, element, info, existingInstruction, context) {
      if (info.command in this) {
        return this[info.command](resources, element, info, existingInstruction, context);
      }

      return this.handleUnknownCommand(resources, element, info, existingInstruction, context);
    }

    handleUnknownCommand(resources, element, info, existingInstruction, context) {
      getLogger('templating-binding').warn('Unknown binding command.', info);
      return existingInstruction;
    }

    determineDefaultBindingMode(element, attrName, context) {
      let tagName = element.tagName.toLowerCase();

      if (tagName === 'input' && (attrName === 'value' || attrName === 'files') && element.type !== 'checkbox' && element.type !== 'radio' || tagName === 'input' && attrName === 'checked' && (element.type === 'checkbox' || element.type === 'radio') || (tagName === 'textarea' || tagName === 'select') && attrName === 'value' || (attrName === 'textcontent' || attrName === 'innerhtml') && element.contentEditable === 'true' || attrName === 'scrolltop' || attrName === 'scrollleft') {
        return bindingMode.twoWay;
      }

      if (context && attrName in context.attributes && context.attributes[attrName] && context.attributes[attrName].defaultBindingMode >= bindingMode.oneTime) {
        return context.attributes[attrName].defaultBindingMode;
      }

      return bindingMode.oneWay;
    }

    bind(resources, element, info, existingInstruction, context) {
      let instruction = existingInstruction || BehaviorInstruction.attribute(info.attrName);

      instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, this.attributeMap.map(element.tagName, info.attrName), this.parser.parse(info.attrValue), info.defaultBindingMode === undefined || info.defaultBindingMode === null ? this.determineDefaultBindingMode(element, info.attrName, context) : info.defaultBindingMode, resources.lookupFunctions);

      return instruction;
    }

    trigger(resources, element, info) {
      return new ListenerExpression(this.eventManager, info.attrName, this.parser.parse(info.attrValue), delegationStrategy.none, true, resources.lookupFunctions);
    }

    capture(resources, element, info) {
      return new ListenerExpression(this.eventManager, info.attrName, this.parser.parse(info.attrValue), delegationStrategy.capturing, true, resources.lookupFunctions);
    }

    delegate(resources, element, info) {
      return new ListenerExpression(this.eventManager, info.attrName, this.parser.parse(info.attrValue), delegationStrategy.bubbling, true, resources.lookupFunctions);
    }

    call(resources, element, info, existingInstruction) {
      let instruction = existingInstruction || BehaviorInstruction.attribute(info.attrName);

      instruction.attributes[info.attrName] = new CallExpression(this.observerLocator, info.attrName, this.parser.parse(info.attrValue), resources.lookupFunctions);

      return instruction;
    }

    options(resources, element, info, existingInstruction, context) {
      let instruction = existingInstruction || BehaviorInstruction.attribute(info.attrName);
      let attrValue = info.attrValue;
      let language = this.language;
      let name = null;
      let target = '';
      let current;
      let i;
      let ii;
      let inString = false;
      let inEscape = false;
      let foundName = false;

      for (i = 0, ii = attrValue.length; i < ii; ++i) {
        current = attrValue[i];

        if (current === ';' && !inString) {
          if (!foundName) {
            name = this._getPrimaryPropertyName(resources, context);
          }
          info = language.inspectAttribute(resources, '?', name, target.trim());
          language.createAttributeInstruction(resources, element, info, instruction, context);

          if (!instruction.attributes[info.attrName]) {
            instruction.attributes[info.attrName] = info.attrValue;
          }

          target = '';
          name = null;
        } else if (current === ':' && name === null) {
          foundName = true;
          name = target.trim();
          target = '';
        } else if (current === '\\') {
          target += current;
          inEscape = true;
          continue;
        } else {
          target += current;

          if (name !== null && inEscape === false && current === '\'') {
            inString = !inString;
          }
        }

        inEscape = false;
      }

      if (!foundName) {
        name = this._getPrimaryPropertyName(resources, context);
      }

      if (name !== null) {
        info = language.inspectAttribute(resources, '?', name, target.trim());
        language.createAttributeInstruction(resources, element, info, instruction, context);

        if (!instruction.attributes[info.attrName]) {
          instruction.attributes[info.attrName] = info.attrValue;
        }
      }

      return instruction;
    }

    _getPrimaryPropertyName(resources, context) {
      let type = resources.getAttribute(context.attributeName);
      if (type && type.primaryProperty) {
        return type.primaryProperty.attribute;
      }
      return null;
    }

    'for'(resources, element, info, existingInstruction) {
      let parts;
      let keyValue;
      let instruction;
      let attrValue;
      let isDestructuring;

      attrValue = info.attrValue;
      isDestructuring = attrValue.match(/^ *[[].+[\]]/);
      parts = isDestructuring ? attrValue.split('of ') : attrValue.split(' of ');

      if (parts.length !== 2) {
        throw new Error('Incorrect syntax for "for". The form is: "$local of $items" or "[$key, $value] of $items".');
      }

      instruction = existingInstruction || BehaviorInstruction.attribute(info.attrName);

      if (isDestructuring) {
        keyValue = parts[0].replace(/[[\]]/g, '').replace(/,/g, ' ').replace(/\s+/g, ' ').trim().split(' ');
        instruction.attributes.key = keyValue[0];
        instruction.attributes.value = keyValue[1];
      } else {
        instruction.attributes.local = parts[0];
      }

      instruction.attributes.items = new BindingExpression(this.observerLocator, 'items', this.parser.parse(parts[1]), bindingMode.oneWay, resources.lookupFunctions);

      return instruction;
    }

    'two-way'(resources, element, info, existingInstruction) {
      let instruction = existingInstruction || BehaviorInstruction.attribute(info.attrName);

      instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, this.attributeMap.map(element.tagName, info.attrName), this.parser.parse(info.attrValue), bindingMode.twoWay, resources.lookupFunctions);

      return instruction;
    }

    'to-view'(resources, element, info, existingInstruction) {
      let instruction = existingInstruction || BehaviorInstruction.attribute(info.attrName);

      instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, this.attributeMap.map(element.tagName, info.attrName), this.parser.parse(info.attrValue), bindingMode.toView, resources.lookupFunctions);

      return instruction;
    }

    'from-view'(resources, element, info, existingInstruction) {
      let instruction = existingInstruction || BehaviorInstruction.attribute(info.attrName);

      instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, this.attributeMap.map(element.tagName, info.attrName), this.parser.parse(info.attrValue), bindingMode.fromView, resources.lookupFunctions);

      return instruction;
    }

    'one-time'(resources, element, info, existingInstruction) {
      let instruction = existingInstruction || BehaviorInstruction.attribute(info.attrName);

      instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, this.attributeMap.map(element.tagName, info.attrName), this.parser.parse(info.attrValue), bindingMode.oneTime, resources.lookupFunctions);

      return instruction;
    }
  }, _class4$2.inject = [Parser, ObserverLocator, EventManager, AttributeMap], _temp2$2);

  SyntaxInterpreter.prototype['one-way'] = SyntaxInterpreter.prototype['to-view'];

  let info = {};

  let TemplatingBindingLanguage = (_temp3$1 = _class5$3 = class TemplatingBindingLanguage extends BindingLanguage {

    constructor(parser, observerLocator, syntaxInterpreter, attributeMap) {
      super();
      this.parser = parser;
      this.observerLocator = observerLocator;
      this.syntaxInterpreter = syntaxInterpreter;
      this.emptyStringExpression = this.parser.parse('\'\'');
      syntaxInterpreter.language = this;
      this.attributeMap = attributeMap;
      this.toBindingContextAttr = 'to-binding-context';
    }

    inspectAttribute(resources, elementName, attrName, attrValue) {
      let parts = attrName.split('.');

      info.defaultBindingMode = null;

      if (parts.length === 2) {
        info.attrName = parts[0].trim();
        info.attrValue = attrValue;
        info.command = parts[1].trim();

        if (info.command === 'ref') {
          info.expression = new NameExpression(this.parser.parse(attrValue), info.attrName, resources.lookupFunctions);
          info.command = null;
          info.attrName = 'ref';
        } else {
          info.expression = null;
        }
      } else if (attrName === 'ref') {
        info.attrName = attrName;
        info.attrValue = attrValue;
        info.command = null;
        info.expression = new NameExpression(this.parser.parse(attrValue), 'element', resources.lookupFunctions);
      } else {
        info.attrName = attrName;
        info.attrValue = attrValue;
        info.command = null;
        const interpolationParts = this.parseInterpolation(resources, attrValue);
        if (interpolationParts === null) {
          info.expression = null;
        } else {
          info.expression = new InterpolationBindingExpression(this.observerLocator, this.attributeMap.map(elementName, attrName), interpolationParts, bindingMode.oneWay, resources.lookupFunctions, attrName);
        }
      }

      return info;
    }

    createAttributeInstruction(resources, element, theInfo, existingInstruction, context) {
      let instruction;

      if (theInfo.expression) {
        if (theInfo.attrName === 'ref') {
          return theInfo.expression;
        }

        instruction = existingInstruction || BehaviorInstruction.attribute(theInfo.attrName);
        instruction.attributes[theInfo.attrName] = theInfo.expression;
      } else if (theInfo.command) {
        instruction = this.syntaxInterpreter.interpret(resources, element, theInfo, existingInstruction, context);
      }

      return instruction;
    }

    createLetExpressions(resources, letElement) {
      let expressions = [];
      let attributes = letElement.attributes;

      let attr;

      let parts;
      let attrName;
      let attrValue;
      let command;
      let toBindingContextAttr = this.toBindingContextAttr;
      let toBindingContext = letElement.hasAttribute(toBindingContextAttr);
      for (let i = 0, ii = attributes.length; ii > i; ++i) {
        attr = attributes[i];
        attrName = attr.name;
        attrValue = attr.nodeValue;
        parts = attrName.split('.');

        if (attrName === toBindingContextAttr) {
          continue;
        }

        if (parts.length === 2) {
          command = parts[1];
          if (command !== 'bind') {
            getLogger('templating-binding-language').warn(`Detected invalid let command. Expected "${parts[0]}.bind", given "${attrName}"`);
            continue;
          }
          expressions.push(new LetExpression(this.observerLocator, camelCase(parts[0]), this.parser.parse(attrValue), resources.lookupFunctions, toBindingContext));
        } else {
          attrName = camelCase(attrName);
          parts = this.parseInterpolation(resources, attrValue);
          if (parts === null) {
            getLogger('templating-binding-language').warn(`Detected string literal in let bindings. Did you mean "${attrName}.bind=${attrValue}" or "${attrName}=\${${attrValue}}" ?`);
          }
          if (parts) {
            expressions.push(new LetInterpolationBindingExpression(this.observerLocator, attrName, parts, resources.lookupFunctions, toBindingContext));
          } else {
            expressions.push(new LetExpression(this.observerLocator, attrName, new LiteralString(attrValue), resources.lookupFunctions, toBindingContext));
          }
        }
      }
      return expressions;
    }

    inspectTextContent(resources, value) {
      const parts = this.parseInterpolation(resources, value);
      if (parts === null) {
        return null;
      }
      return new InterpolationBindingExpression(this.observerLocator, 'textContent', parts, bindingMode.oneWay, resources.lookupFunctions, 'textContent');
    }

    parseInterpolation(resources, value) {
      let i = value.indexOf('${', 0);
      let ii = value.length;
      let char;
      let pos = 0;
      let open = 0;
      let quote = null;
      let interpolationStart;
      let parts;
      let partIndex = 0;

      while (i >= 0 && i < ii - 2) {
        open = 1;
        interpolationStart = i;
        i += 2;

        do {
          char = value[i];
          i++;

          if (char === "'" || char === '"') {
            if (quote === null) {
              quote = char;
            } else if (quote === char) {
              quote = null;
            }
            continue;
          }

          if (char === '\\') {
            i++;
            continue;
          }

          if (quote !== null) {
            continue;
          }

          if (char === '{') {
            open++;
          } else if (char === '}') {
            open--;
          }
        } while (open > 0 && i < ii);

        if (open === 0) {
          parts = parts || [];
          if (value[interpolationStart - 1] === '\\' && value[interpolationStart - 2] !== '\\') {
            parts[partIndex] = value.substring(pos, interpolationStart - 1) + value.substring(interpolationStart, i);
            partIndex++;
            parts[partIndex] = this.emptyStringExpression;
            partIndex++;
          } else {
            parts[partIndex] = value.substring(pos, interpolationStart);
            partIndex++;
            parts[partIndex] = this.parser.parse(value.substring(interpolationStart + 2, i - 1));
            partIndex++;
          }
          pos = i;
          i = value.indexOf('${', i);
        } else {
          break;
        }
      }

      if (partIndex === 0) {
        return null;
      }

      parts[partIndex] = value.substr(pos);
      return parts;
    }
  }, _class5$3.inject = [Parser, ObserverLocator, SyntaxInterpreter, AttributeMap], _temp3$1);

  function configure(config) {
    config.container.registerSingleton(BindingLanguage, TemplatingBindingLanguage);
    config.container.registerAlias(BindingLanguage, TemplatingBindingLanguage);
  }

  var _dec$4, _class$4, _class2$4, _descriptor, _descriptor2, _descriptor3, _descriptor4;

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

  let Compose = (_dec$4 = customElement('compose'), _dec$4(_class$4 = noView(_class$4 = (_class2$4 = class Compose {

    static inject() {
      return [DOM.Element, Container, CompositionEngine, ViewSlot, ViewResources, TaskQueue];
    }

    constructor(element, container, compositionEngine, viewSlot, viewResources, taskQueue) {
      _initDefineProp(this, 'model', _descriptor, this);

      _initDefineProp(this, 'view', _descriptor2, this);

      _initDefineProp(this, 'viewModel', _descriptor3, this);

      _initDefineProp(this, 'swapOrder', _descriptor4, this);

      this.element = element;
      this.container = container;
      this.compositionEngine = compositionEngine;
      this.viewSlot = viewSlot;
      this.viewResources = viewResources;
      this.taskQueue = taskQueue;
      this.currentController = null;
      this.currentViewModel = null;
      this.changes = Object.create(null);
    }

    created(owningView) {
      this.owningView = owningView;
    }

    bind(bindingContext, overrideContext) {
      this.bindingContext = bindingContext;
      this.overrideContext = overrideContext;
      this.changes.view = this.view;
      this.changes.viewModel = this.viewModel;
      this.changes.model = this.model;
      if (!this.pendingTask) {
        processChanges(this);
      }
    }

    unbind() {
      this.changes = Object.create(null);
      this.bindingContext = null;
      this.overrideContext = null;
      let returnToCache = true;
      let skipAnimation = true;
      this.viewSlot.removeAll(returnToCache, skipAnimation);
    }

    modelChanged(newValue, oldValue) {
      this.changes.model = newValue;
      requestUpdate(this);
    }

    viewChanged(newValue, oldValue) {
      this.changes.view = newValue;
      requestUpdate(this);
    }

    viewModelChanged(newValue, oldValue) {
      this.changes.viewModel = newValue;
      requestUpdate(this);
    }
  }, (_descriptor = _applyDecoratedDescriptor(_class2$4.prototype, 'model', [bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2$4.prototype, 'view', [bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2$4.prototype, 'viewModel', [bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2$4.prototype, 'swapOrder', [bindable], {
    enumerable: true,
    initializer: null
  })), _class2$4)) || _class$4) || _class$4);

  function isEmpty(obj) {
    for (const key in obj) {
      return false;
    }
    return true;
  }

  function tryActivateViewModel$1(vm, model) {
    if (vm && typeof vm.activate === 'function') {
      return Promise.resolve(vm.activate(model));
    }
  }

  function createInstruction(composer, instruction) {
    return Object.assign(instruction, {
      bindingContext: composer.bindingContext,
      overrideContext: composer.overrideContext,
      owningView: composer.owningView,
      container: composer.container,
      viewSlot: composer.viewSlot,
      viewResources: composer.viewResources,
      currentController: composer.currentController,
      host: composer.element,
      swapOrder: composer.swapOrder
    });
  }

  function processChanges(composer) {
    const changes = composer.changes;
    composer.changes = Object.create(null);

    if (!('view' in changes) && !('viewModel' in changes) && 'model' in changes) {
      composer.pendingTask = tryActivateViewModel$1(composer.currentViewModel, changes.model);
      if (!composer.pendingTask) {
        return;
      }
    } else {
      let instruction = {
        view: composer.view,
        viewModel: composer.currentViewModel || composer.viewModel,
        model: composer.model
      };

      instruction = Object.assign(instruction, changes);

      instruction = createInstruction(composer, instruction);
      composer.pendingTask = composer.compositionEngine.compose(instruction).then(controller => {
        composer.currentController = controller;
        composer.currentViewModel = controller ? controller.viewModel : null;
      });
    }

    composer.pendingTask = composer.pendingTask.then(() => {
      completeCompositionTask(composer);
    }, reason => {
      completeCompositionTask(composer);
      throw reason;
    });
  }

  function completeCompositionTask(composer) {
    composer.pendingTask = null;
    if (!isEmpty(composer.changes)) {
      processChanges(composer);
    }
  }

  function requestUpdate(composer) {
    if (composer.pendingTask || composer.updateRequested) {
      return;
    }
    composer.updateRequested = true;
    composer.taskQueue.queueMicroTask(() => {
      composer.updateRequested = false;
      processChanges(composer);
    });
  }

  let IfCore = class IfCore {
    constructor(viewFactory, viewSlot) {
      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.view = null;
      this.bindingContext = null;
      this.overrideContext = null;

      this.showing = false;
    }

    bind(bindingContext, overrideContext) {
      this.bindingContext = bindingContext;
      this.overrideContext = overrideContext;
    }

    unbind() {
      if (this.view === null) {
        return;
      }

      this.view.unbind();

      if (!this.viewFactory.isCaching) {
        return;
      }

      if (this.showing) {
        this.showing = false;
        this.viewSlot.remove(this.view, true, true);
      } else {
        this.view.returnToCache();
      }

      this.view = null;
    }

    _show() {
      if (this.showing) {
        if (!this.view.isBound) {
          this.view.bind(this.bindingContext, this.overrideContext);
        }
        return;
      }

      if (this.view === null) {
        this.view = this.viewFactory.create();
      }

      if (!this.view.isBound) {
        this.view.bind(this.bindingContext, this.overrideContext);
      }

      this.showing = true;
      return this.viewSlot.add(this.view);
    }

    _hide() {
      if (!this.showing) {
        return;
      }

      this.showing = false;
      let removed = this.viewSlot.remove(this.view);

      if (removed instanceof Promise) {
        return removed.then(() => this.view.unbind());
      }

      this.view.unbind();
    }
  };

  var _dec$5, _dec2$4, _dec3$3, _class$5, _class2$5, _descriptor$1, _descriptor2$1;

  function _initDefineProp$1(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _applyDecoratedDescriptor$1(target, property, decorators, descriptor, context) {
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

  let If = (_dec$5 = customAttribute('if'), _dec2$4 = inject(BoundViewFactory, ViewSlot), _dec3$3 = bindable({ primaryProperty: true }), _dec$5(_class$5 = templateController(_class$5 = _dec2$4(_class$5 = (_class2$5 = class If extends IfCore {
    constructor(...args) {
      var _temp;

      return _temp = super(...args), _initDefineProp$1(this, 'condition', _descriptor$1, this), _initDefineProp$1(this, 'swapOrder', _descriptor2$1, this), _temp;
    }

    bind(bindingContext, overrideContext) {
      super.bind(bindingContext, overrideContext);
      if (this.condition) {
        this._show();
      } else {
        this._hide();
      }
    }

    conditionChanged(newValue) {
      this._update(newValue);
    }

    _update(show) {
      if (this.animating) {
        return;
      }

      let promise;
      if (this.elseVm) {
        promise = show ? this._swap(this.elseVm, this) : this._swap(this, this.elseVm);
      } else {
        promise = show ? this._show() : this._hide();
      }

      if (promise) {
        this.animating = true;
        promise.then(() => {
          this.animating = false;
          if (this.condition !== this.showing) {
            this._update(this.condition);
          }
        });
      }
    }

    _swap(remove, add) {
      switch (this.swapOrder) {
        case 'before':
          return Promise.resolve(add._show()).then(() => remove._hide());
        case 'with':
          return Promise.all([remove._hide(), add._show()]);
        default:
          let promise = remove._hide();
          return promise ? promise.then(() => add._show()) : add._show();
      }
    }
  }, (_descriptor$1 = _applyDecoratedDescriptor$1(_class2$5.prototype, 'condition', [_dec3$3], {
    enumerable: true,
    initializer: null
  }), _descriptor2$1 = _applyDecoratedDescriptor$1(_class2$5.prototype, 'swapOrder', [bindable], {
    enumerable: true,
    initializer: null
  })), _class2$5)) || _class$5) || _class$5) || _class$5);

  var _dec$6, _dec2$5, _class$6;

  let Else = (_dec$6 = customAttribute('else'), _dec2$5 = inject(BoundViewFactory, ViewSlot), _dec$6(_class$6 = templateController(_class$6 = _dec2$5(_class$6 = class Else extends IfCore {
    constructor(viewFactory, viewSlot) {
      super(viewFactory, viewSlot);
      this._registerInIf();
    }

    bind(bindingContext, overrideContext) {
      super.bind(bindingContext, overrideContext);

      if (this.ifVm.condition) {
        this._hide();
      } else {
        this._show();
      }
    }

    _registerInIf() {
      let previous = this.viewSlot.anchor.previousSibling;
      while (previous && !previous.au) {
        previous = previous.previousSibling;
      }
      if (!previous || !previous.au.if) {
        throw new Error("Can't find matching If for Else custom attribute.");
      }
      this.ifVm = previous.au.if.viewModel;
      this.ifVm.elseVm = this;
    }
  }) || _class$6) || _class$6) || _class$6);

  var _dec$7, _dec2$6, _class$7;

  let With = (_dec$7 = customAttribute('with'), _dec2$6 = inject(BoundViewFactory, ViewSlot), _dec$7(_class$7 = templateController(_class$7 = _dec2$6(_class$7 = class With {
    constructor(viewFactory, viewSlot) {
      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.parentOverrideContext = null;
      this.view = null;
    }

    bind(bindingContext, overrideContext) {
      this.parentOverrideContext = overrideContext;
      this.valueChanged(this.value);
    }

    valueChanged(newValue) {
      let overrideContext = createOverrideContext(newValue, this.parentOverrideContext);
      if (!this.view) {
        this.view = this.viewFactory.create();
        this.view.bind(newValue, overrideContext);
        this.viewSlot.add(this.view);
      } else {
        this.view.bind(newValue, overrideContext);
      }
    }

    unbind() {
      this.parentOverrideContext = null;

      if (this.view) {
        this.view.unbind();
      }
    }
  }) || _class$7) || _class$7) || _class$7);

  let NullRepeatStrategy = class NullRepeatStrategy {
    instanceChanged(repeat, items) {
      repeat.removeAllViews(true);
    }

    getCollectionObserver(observerLocator, items) {}
  };

  const oneTime = bindingMode.oneTime;

  function updateOverrideContexts(views, startIndex) {
    let length = views.length;

    if (startIndex > 0) {
      startIndex = startIndex - 1;
    }

    for (; startIndex < length; ++startIndex) {
      updateOverrideContext(views[startIndex].overrideContext, startIndex, length);
    }
  }

  function createFullOverrideContext(repeat, data, index, length, key) {
    let bindingContext = {};
    let overrideContext = createOverrideContext(bindingContext, repeat.scope.overrideContext);

    if (typeof key !== 'undefined') {
      bindingContext[repeat.key] = key;
      bindingContext[repeat.value] = data;
    } else {
      bindingContext[repeat.local] = data;
    }
    updateOverrideContext(overrideContext, index, length);
    return overrideContext;
  }

  function updateOverrideContext(overrideContext, index, length) {
    let first = index === 0;
    let last = index === length - 1;
    let even = index % 2 === 0;

    overrideContext.$index = index;
    overrideContext.$first = first;
    overrideContext.$last = last;
    overrideContext.$middle = !(first || last);
    overrideContext.$odd = !even;
    overrideContext.$even = even;
  }

  function getItemsSourceExpression(instruction, attrName) {
    return instruction.behaviorInstructions.filter(bi => bi.originalAttrName === attrName)[0].attributes.items.sourceExpression;
  }

  function unwrapExpression(expression) {
    let unwrapped = false;
    while (expression instanceof BindingBehavior) {
      expression = expression.expression;
    }
    while (expression instanceof ValueConverter) {
      expression = expression.expression;
      unwrapped = true;
    }
    return unwrapped ? expression : null;
  }

  function isOneTime(expression) {
    while (expression instanceof BindingBehavior) {
      if (expression.name === 'oneTime') {
        return true;
      }
      expression = expression.expression;
    }
    return false;
  }

  function updateOneTimeBinding(binding) {
    if (binding.call && binding.mode === oneTime) {
      binding.call(sourceContext);
    } else if (binding.updateOneTimeBindings) {
      binding.updateOneTimeBindings();
    }
  }

  function indexOf(array, item, matcher, startIndex) {
    if (!matcher) {
      return array.indexOf(item);
    }
    const length = array.length;
    for (let index = startIndex || 0; index < length; index++) {
      if (matcher(array[index], item)) {
        return index;
      }
    }
    return -1;
  }

  let ArrayRepeatStrategy = class ArrayRepeatStrategy {
    getCollectionObserver(observerLocator, items) {
      return observerLocator.getArrayObserver(items);
    }

    instanceChanged(repeat, items) {
      const itemsLength = items.length;

      if (!items || itemsLength === 0) {
        repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
        return;
      }

      const children = repeat.views();
      const viewsLength = children.length;

      if (viewsLength === 0) {
        this._standardProcessInstanceChanged(repeat, items);
        return;
      }

      if (repeat.viewsRequireLifecycle) {
        const childrenSnapshot = children.slice(0);
        const itemNameInBindingContext = repeat.local;
        const matcher = repeat.matcher();

        let itemsPreviouslyInViews = [];
        const viewsToRemove = [];

        for (let index = 0; index < viewsLength; index++) {
          const view = childrenSnapshot[index];
          const oldItem = view.bindingContext[itemNameInBindingContext];

          if (indexOf(items, oldItem, matcher) === -1) {
            viewsToRemove.push(view);
          } else {
            itemsPreviouslyInViews.push(oldItem);
          }
        }

        let updateViews;
        let removePromise;

        if (itemsPreviouslyInViews.length > 0) {
          removePromise = repeat.removeViews(viewsToRemove, true, !repeat.viewsRequireLifecycle);
          updateViews = () => {
            for (let index = 0; index < itemsLength; index++) {
              const item = items[index];
              const indexOfView = indexOf(itemsPreviouslyInViews, item, matcher, index);
              let view;

              if (indexOfView === -1) {
                const overrideContext = createFullOverrideContext(repeat, items[index], index, itemsLength);
                repeat.insertView(index, overrideContext.bindingContext, overrideContext);

                itemsPreviouslyInViews.splice(index, 0, undefined);
              } else if (indexOfView === index) {
                view = children[indexOfView];
                itemsPreviouslyInViews[indexOfView] = undefined;
              } else {
                view = children[indexOfView];
                repeat.moveView(indexOfView, index);
                itemsPreviouslyInViews.splice(indexOfView, 1);
                itemsPreviouslyInViews.splice(index, 0, undefined);
              }

              if (view) {
                updateOverrideContext(view.overrideContext, index, itemsLength);
              }
            }

            this._inPlaceProcessItems(repeat, items);
          };
        } else {
          removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
          updateViews = () => this._standardProcessInstanceChanged(repeat, items);
        }

        if (removePromise instanceof Promise) {
          removePromise.then(updateViews);
        } else {
          updateViews();
        }
      } else {
        this._inPlaceProcessItems(repeat, items);
      }
    }

    _standardProcessInstanceChanged(repeat, items) {
      for (let i = 0, ii = items.length; i < ii; i++) {
        let overrideContext = createFullOverrideContext(repeat, items[i], i, ii);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }
    }

    _inPlaceProcessItems(repeat, items) {
      let itemsLength = items.length;
      let viewsLength = repeat.viewCount();

      while (viewsLength > itemsLength) {
        viewsLength--;
        repeat.removeView(viewsLength, true, !repeat.viewsRequireLifecycle);
      }

      let local = repeat.local;

      for (let i = 0; i < viewsLength; i++) {
        let view = repeat.view(i);
        let last = i === itemsLength - 1;
        let middle = i !== 0 && !last;

        if (view.bindingContext[local] === items[i] && view.overrideContext.$middle === middle && view.overrideContext.$last === last) {
          continue;
        }

        view.bindingContext[local] = items[i];
        view.overrideContext.$middle = middle;
        view.overrideContext.$last = last;
        repeat.updateBindings(view);
      }

      for (let i = viewsLength; i < itemsLength; i++) {
        let overrideContext = createFullOverrideContext(repeat, items[i], i, itemsLength);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }
    }

    instanceMutated(repeat, array, splices) {
      if (repeat.__queuedSplices) {
        for (let i = 0, ii = splices.length; i < ii; ++i) {
          let { index, removed, addedCount } = splices[i];
          mergeSplice(repeat.__queuedSplices, index, removed, addedCount);
        }

        repeat.__array = array.slice(0);
        return;
      }

      let maybePromise = this._runSplices(repeat, array.slice(0), splices);
      if (maybePromise instanceof Promise) {
        let queuedSplices = repeat.__queuedSplices = [];

        let runQueuedSplices = () => {
          if (!queuedSplices.length) {
            repeat.__queuedSplices = undefined;
            repeat.__array = undefined;
            return;
          }

          let nextPromise = this._runSplices(repeat, repeat.__array, queuedSplices) || Promise.resolve();
          queuedSplices = repeat.__queuedSplices = [];
          nextPromise.then(runQueuedSplices);
        };

        maybePromise.then(runQueuedSplices);
      }
    }

    _runSplices(repeat, array, splices) {
      let removeDelta = 0;
      let rmPromises = [];

      for (let i = 0, ii = splices.length; i < ii; ++i) {
        let splice = splices[i];
        let removed = splice.removed;

        for (let j = 0, jj = removed.length; j < jj; ++j) {
          let viewOrPromise = repeat.removeView(splice.index + removeDelta + rmPromises.length, true);
          if (viewOrPromise instanceof Promise) {
            rmPromises.push(viewOrPromise);
          }
        }
        removeDelta -= splice.addedCount;
      }

      if (rmPromises.length > 0) {
        return Promise.all(rmPromises).then(() => {
          let spliceIndexLow = this._handleAddedSplices(repeat, array, splices);
          updateOverrideContexts(repeat.views(), spliceIndexLow);
        });
      }

      let spliceIndexLow = this._handleAddedSplices(repeat, array, splices);
      updateOverrideContexts(repeat.views(), spliceIndexLow);

      return undefined;
    }

    _handleAddedSplices(repeat, array, splices) {
      let spliceIndex;
      let spliceIndexLow;
      let arrayLength = array.length;
      for (let i = 0, ii = splices.length; i < ii; ++i) {
        let splice = splices[i];
        let addIndex = spliceIndex = splice.index;
        let end = splice.index + splice.addedCount;

        if (typeof spliceIndexLow === 'undefined' || spliceIndexLow === null || spliceIndexLow > splice.index) {
          spliceIndexLow = spliceIndex;
        }

        for (; addIndex < end; ++addIndex) {
          let overrideContext = createFullOverrideContext(repeat, array[addIndex], addIndex, arrayLength);
          repeat.insertView(addIndex, overrideContext.bindingContext, overrideContext);
        }
      }

      return spliceIndexLow;
    }
  };

  let MapRepeatStrategy = class MapRepeatStrategy {
    getCollectionObserver(observerLocator, items) {
      return observerLocator.getMapObserver(items);
    }

    instanceChanged(repeat, items) {
      let removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
      if (removePromise instanceof Promise) {
        removePromise.then(() => this._standardProcessItems(repeat, items));
        return;
      }
      this._standardProcessItems(repeat, items);
    }

    _standardProcessItems(repeat, items) {
      let index = 0;
      let overrideContext;

      items.forEach((value, key) => {
        overrideContext = createFullOverrideContext(repeat, value, index, items.size, key);
        repeat.addView(overrideContext.bindingContext, overrideContext);
        ++index;
      });
    }

    instanceMutated(repeat, map, records) {
      let key;
      let i;
      let ii;
      let overrideContext;
      let removeIndex;
      let addIndex;
      let record;
      let rmPromises = [];
      let viewOrPromise;

      for (i = 0, ii = records.length; i < ii; ++i) {
        record = records[i];
        key = record.key;
        switch (record.type) {
          case 'update':
            removeIndex = this._getViewIndexByKey(repeat, key);
            viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
            if (viewOrPromise instanceof Promise) {
              rmPromises.push(viewOrPromise);
            }
            overrideContext = createFullOverrideContext(repeat, map.get(key), removeIndex, map.size, key);
            repeat.insertView(removeIndex, overrideContext.bindingContext, overrideContext);
            break;
          case 'add':
            addIndex = repeat.viewCount() <= map.size - 1 ? repeat.viewCount() : map.size - 1;
            overrideContext = createFullOverrideContext(repeat, map.get(key), addIndex, map.size, key);
            repeat.insertView(map.size - 1, overrideContext.bindingContext, overrideContext);
            break;
          case 'delete':
            if (record.oldValue === undefined) {
              return;
            }
            removeIndex = this._getViewIndexByKey(repeat, key);
            viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
            if (viewOrPromise instanceof Promise) {
              rmPromises.push(viewOrPromise);
            }
            break;
          case 'clear':
            repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
            break;
          default:
            continue;
        }
      }

      if (rmPromises.length > 0) {
        Promise.all(rmPromises).then(() => {
          updateOverrideContexts(repeat.views(), 0);
        });
      } else {
        updateOverrideContexts(repeat.views(), 0);
      }
    }

    _getViewIndexByKey(repeat, key) {
      let i;
      let ii;
      let child;

      for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
        child = repeat.view(i);
        if (child.bindingContext[repeat.key] === key) {
          return i;
        }
      }

      return undefined;
    }
  };

  let SetRepeatStrategy = class SetRepeatStrategy {
    getCollectionObserver(observerLocator, items) {
      return observerLocator.getSetObserver(items);
    }

    instanceChanged(repeat, items) {
      let removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
      if (removePromise instanceof Promise) {
        removePromise.then(() => this._standardProcessItems(repeat, items));
        return;
      }
      this._standardProcessItems(repeat, items);
    }

    _standardProcessItems(repeat, items) {
      let index = 0;
      let overrideContext;

      items.forEach(value => {
        overrideContext = createFullOverrideContext(repeat, value, index, items.size);
        repeat.addView(overrideContext.bindingContext, overrideContext);
        ++index;
      });
    }

    instanceMutated(repeat, set, records) {
      let value;
      let i;
      let ii;
      let overrideContext;
      let removeIndex;
      let record;
      let rmPromises = [];
      let viewOrPromise;

      for (i = 0, ii = records.length; i < ii; ++i) {
        record = records[i];
        value = record.value;
        switch (record.type) {
          case 'add':
            let size = Math.max(set.size - 1, 0);
            overrideContext = createFullOverrideContext(repeat, value, size, set.size);
            repeat.insertView(size, overrideContext.bindingContext, overrideContext);
            break;
          case 'delete':
            removeIndex = this._getViewIndexByValue(repeat, value);
            viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
            if (viewOrPromise instanceof Promise) {
              rmPromises.push(viewOrPromise);
            }
            break;
          case 'clear':
            repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
            break;
          default:
            continue;
        }
      }

      if (rmPromises.length > 0) {
        Promise.all(rmPromises).then(() => {
          updateOverrideContexts(repeat.views(), 0);
        });
      } else {
        updateOverrideContexts(repeat.views(), 0);
      }
    }

    _getViewIndexByValue(repeat, value) {
      let i;
      let ii;
      let child;

      for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
        child = repeat.view(i);
        if (child.bindingContext[repeat.local] === value) {
          return i;
        }
      }

      return undefined;
    }
  };

  let NumberRepeatStrategy = class NumberRepeatStrategy {
    getCollectionObserver() {
      return null;
    }

    instanceChanged(repeat, value) {
      let removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
      if (removePromise instanceof Promise) {
        removePromise.then(() => this._standardProcessItems(repeat, value));
        return;
      }
      this._standardProcessItems(repeat, value);
    }

    _standardProcessItems(repeat, value) {
      let childrenLength = repeat.viewCount();
      let i;
      let ii;
      let overrideContext;
      let viewsToRemove;

      value = Math.floor(value);
      viewsToRemove = childrenLength - value;

      if (viewsToRemove > 0) {
        if (viewsToRemove > childrenLength) {
          viewsToRemove = childrenLength;
        }

        for (i = 0, ii = viewsToRemove; i < ii; ++i) {
          repeat.removeView(childrenLength - (i + 1), true, !repeat.viewsRequireLifecycle);
        }

        return;
      }

      for (i = childrenLength, ii = value; i < ii; ++i) {
        overrideContext = createFullOverrideContext(repeat, i, i, ii);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }

      updateOverrideContexts(repeat.views(), 0);
    }
  };

  let RepeatStrategyLocator = class RepeatStrategyLocator {
    constructor() {
      this.matchers = [];
      this.strategies = [];

      this.addStrategy(items => items === null || items === undefined, new NullRepeatStrategy());
      this.addStrategy(items => items instanceof Array, new ArrayRepeatStrategy());
      this.addStrategy(items => items instanceof Map, new MapRepeatStrategy());
      this.addStrategy(items => items instanceof Set, new SetRepeatStrategy());
      this.addStrategy(items => typeof items === 'number', new NumberRepeatStrategy());
    }

    addStrategy(matcher, strategy) {
      this.matchers.push(matcher);
      this.strategies.push(strategy);
    }

    getStrategy(items) {
      let matchers = this.matchers;

      for (let i = 0, ii = matchers.length; i < ii; ++i) {
        if (matchers[i](items)) {
          return this.strategies[i];
        }
      }

      return null;
    }
  };

  const lifecycleOptionalBehaviors = ['focus', 'if', 'else', 'repeat', 'show', 'hide', 'with'];

  function behaviorRequiresLifecycle(instruction) {
    let t = instruction.type;
    let name = t.elementName !== null ? t.elementName : t.attributeName;
    return lifecycleOptionalBehaviors.indexOf(name) === -1 && (t.handlesAttached || t.handlesBind || t.handlesCreated || t.handlesDetached || t.handlesUnbind) || t.viewFactory && viewsRequireLifecycle(t.viewFactory) || instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
  }

  function targetRequiresLifecycle(instruction) {
    let behaviors = instruction.behaviorInstructions;
    if (behaviors) {
      let i = behaviors.length;
      while (i--) {
        if (behaviorRequiresLifecycle(behaviors[i])) {
          return true;
        }
      }
    }

    return instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
  }

  function viewsRequireLifecycle(viewFactory) {
    if ('_viewsRequireLifecycle' in viewFactory) {
      return viewFactory._viewsRequireLifecycle;
    }

    viewFactory._viewsRequireLifecycle = false;

    if (viewFactory.viewFactory) {
      viewFactory._viewsRequireLifecycle = viewsRequireLifecycle(viewFactory.viewFactory);
      return viewFactory._viewsRequireLifecycle;
    }

    if (viewFactory.template.querySelector('.au-animate')) {
      viewFactory._viewsRequireLifecycle = true;
      return true;
    }

    for (let id in viewFactory.instructions) {
      if (targetRequiresLifecycle(viewFactory.instructions[id])) {
        viewFactory._viewsRequireLifecycle = true;
        return true;
      }
    }

    viewFactory._viewsRequireLifecycle = false;
    return false;
  }

  let AbstractRepeater = class AbstractRepeater {
    constructor(options) {
      Object.assign(this, {
        local: 'items',
        viewsRequireLifecycle: true
      }, options);
    }

    viewCount() {
      throw new Error('subclass must implement `viewCount`');
    }

    views() {
      throw new Error('subclass must implement `views`');
    }

    view(index) {
      throw new Error('subclass must implement `view`');
    }

    matcher() {
      throw new Error('subclass must implement `matcher`');
    }

    addView(bindingContext, overrideContext) {
      throw new Error('subclass must implement `addView`');
    }

    insertView(index, bindingContext, overrideContext) {
      throw new Error('subclass must implement `insertView`');
    }

    moveView(sourceIndex, targetIndex) {
      throw new Error('subclass must implement `moveView`');
    }

    removeAllViews(returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeAllViews`');
    }

    removeViews(viewsToRemove, returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeView`');
    }

    removeView(index, returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeView`');
    }

    updateBindings(view) {
      throw new Error('subclass must implement `updateBindings`');
    }
  };

  var _dec$8, _dec2$7, _class$8, _class2$6, _descriptor$2, _descriptor2$2, _descriptor3$1, _descriptor4$1;

  function _initDefineProp$2(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _applyDecoratedDescriptor$2(target, property, decorators, descriptor, context) {
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

  let Repeat = (_dec$8 = customAttribute('repeat'), _dec2$7 = inject(BoundViewFactory, TargetInstruction, ViewSlot, ViewResources, ObserverLocator, RepeatStrategyLocator), _dec$8(_class$8 = templateController(_class$8 = _dec2$7(_class$8 = (_class2$6 = class Repeat extends AbstractRepeater {
    constructor(viewFactory, instruction, viewSlot, viewResources, observerLocator, strategyLocator) {
      super({
        local: 'item',
        viewsRequireLifecycle: viewsRequireLifecycle(viewFactory)
      });

      _initDefineProp$2(this, 'items', _descriptor$2, this);

      _initDefineProp$2(this, 'local', _descriptor2$2, this);

      _initDefineProp$2(this, 'key', _descriptor3$1, this);

      _initDefineProp$2(this, 'value', _descriptor4$1, this);

      this.viewFactory = viewFactory;
      this.instruction = instruction;
      this.viewSlot = viewSlot;
      this.lookupFunctions = viewResources.lookupFunctions;
      this.observerLocator = observerLocator;
      this.key = 'key';
      this.value = 'value';
      this.strategyLocator = strategyLocator;
      this.ignoreMutation = false;
      this.sourceExpression = getItemsSourceExpression(this.instruction, 'repeat.for');
      this.isOneTime = isOneTime(this.sourceExpression);
      this.viewsRequireLifecycle = viewsRequireLifecycle(viewFactory);
    }

    call(context, changes) {
      this[context](this.items, changes);
    }

    bind(bindingContext, overrideContext) {
      this.scope = { bindingContext, overrideContext };
      this.matcherBinding = this._captureAndRemoveMatcherBinding();
      this.itemsChanged();
    }

    unbind() {
      this.scope = null;
      this.items = null;
      this.matcherBinding = null;
      this.viewSlot.removeAll(true, true);
      this._unsubscribeCollection();
    }

    _unsubscribeCollection() {
      if (this.collectionObserver) {
        this.collectionObserver.unsubscribe(this.callContext, this);
        this.collectionObserver = null;
        this.callContext = null;
      }
    }

    itemsChanged() {
      this._unsubscribeCollection();

      if (!this.scope) {
        return;
      }

      let items = this.items;
      this.strategy = this.strategyLocator.getStrategy(items);
      if (!this.strategy) {
        throw new Error(`Value for '${this.sourceExpression}' is non-repeatable`);
      }

      if (!this.isOneTime && !this._observeInnerCollection()) {
        this._observeCollection();
      }
      this.ignoreMutation = true;
      this.strategy.instanceChanged(this, items);
      this.observerLocator.taskQueue.queueMicroTask(() => {
        this.ignoreMutation = false;
      });
    }

    _getInnerCollection() {
      let expression = unwrapExpression(this.sourceExpression);
      if (!expression) {
        return null;
      }
      return expression.evaluate(this.scope, null);
    }

    handleCollectionMutated(collection, changes) {
      if (!this.collectionObserver) {
        return;
      }
      if (this.ignoreMutation) {
        return;
      }
      this.strategy.instanceMutated(this, collection, changes);
    }

    handleInnerCollectionMutated(collection, changes) {
      if (!this.collectionObserver) {
        return;
      }

      if (this.ignoreMutation) {
        return;
      }
      this.ignoreMutation = true;
      let newItems = this.sourceExpression.evaluate(this.scope, this.lookupFunctions);
      this.observerLocator.taskQueue.queueMicroTask(() => this.ignoreMutation = false);

      if (newItems === this.items) {
        this.itemsChanged();
      } else {
        this.items = newItems;
      }
    }

    _observeInnerCollection() {
      let items = this._getInnerCollection();
      let strategy = this.strategyLocator.getStrategy(items);
      if (!strategy) {
        return false;
      }
      this.collectionObserver = strategy.getCollectionObserver(this.observerLocator, items);
      if (!this.collectionObserver) {
        return false;
      }
      this.callContext = 'handleInnerCollectionMutated';
      this.collectionObserver.subscribe(this.callContext, this);
      return true;
    }

    _observeCollection() {
      let items = this.items;
      this.collectionObserver = this.strategy.getCollectionObserver(this.observerLocator, items);
      if (this.collectionObserver) {
        this.callContext = 'handleCollectionMutated';
        this.collectionObserver.subscribe(this.callContext, this);
      }
    }

    _captureAndRemoveMatcherBinding() {
      if (this.viewFactory.viewFactory) {
        const instructions = this.viewFactory.viewFactory.instructions;
        const instructionIds = Object.keys(instructions);
        for (let i = 0; i < instructionIds.length; i++) {
          const expressions = instructions[instructionIds[i]].expressions;
          if (expressions) {
            for (let ii = 0; i < expressions.length; i++) {
              if (expressions[ii].targetProperty === 'matcher') {
                const matcherBinding = expressions[ii];
                expressions.splice(ii, 1);
                return matcherBinding;
              }
            }
          }
        }
      }

      return undefined;
    }

    viewCount() {
      return this.viewSlot.children.length;
    }
    views() {
      return this.viewSlot.children;
    }
    view(index) {
      return this.viewSlot.children[index];
    }
    matcher() {
      return this.matcherBinding ? this.matcherBinding.sourceExpression.evaluate(this.scope, this.matcherBinding.lookupFunctions) : null;
    }

    addView(bindingContext, overrideContext) {
      let view = this.viewFactory.create();
      view.bind(bindingContext, overrideContext);
      this.viewSlot.add(view);
    }

    insertView(index, bindingContext, overrideContext) {
      let view = this.viewFactory.create();
      view.bind(bindingContext, overrideContext);
      this.viewSlot.insert(index, view);
    }

    moveView(sourceIndex, targetIndex) {
      this.viewSlot.move(sourceIndex, targetIndex);
    }

    removeAllViews(returnToCache, skipAnimation) {
      return this.viewSlot.removeAll(returnToCache, skipAnimation);
    }

    removeViews(viewsToRemove, returnToCache, skipAnimation) {
      return this.viewSlot.removeMany(viewsToRemove, returnToCache, skipAnimation);
    }

    removeView(index, returnToCache, skipAnimation) {
      return this.viewSlot.removeAt(index, returnToCache, skipAnimation);
    }

    updateBindings(view) {
      let j = view.bindings.length;
      while (j--) {
        updateOneTimeBinding(view.bindings[j]);
      }
      j = view.controllers.length;
      while (j--) {
        let k = view.controllers[j].boundProperties.length;
        while (k--) {
          let binding = view.controllers[j].boundProperties[k].binding;
          updateOneTimeBinding(binding);
        }
      }
    }
  }, (_descriptor$2 = _applyDecoratedDescriptor$2(_class2$6.prototype, 'items', [bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2$2 = _applyDecoratedDescriptor$2(_class2$6.prototype, 'local', [bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3$1 = _applyDecoratedDescriptor$2(_class2$6.prototype, 'key', [bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor4$1 = _applyDecoratedDescriptor$2(_class2$6.prototype, 'value', [bindable], {
    enumerable: true,
    initializer: null
  })), _class2$6)) || _class$8) || _class$8) || _class$8);

  const aureliaHideClassName = 'aurelia-hide';

  const aureliaHideClass = `.${aureliaHideClassName} { display:none !important; }`;

  function injectAureliaHideStyleAtHead() {
    DOM.injectStyles(aureliaHideClass);
  }

  function injectAureliaHideStyleAtBoundary(domBoundary) {
    if (FEATURE.shadowDOM && domBoundary && !domBoundary.hasAureliaHideStyle) {
      domBoundary.hasAureliaHideStyle = true;
      DOM.injectStyles(aureliaHideClass, domBoundary);
    }
  }

  var _dec$9, _class$9;

  let Show = (_dec$9 = customAttribute('show'), _dec$9(_class$9 = class Show {

    static inject() {
      return [DOM.Element, Animator, Optional.of(DOM.boundary, true)];
    }

    constructor(element, animator, domBoundary) {
      this.element = element;
      this.animator = animator;
      this.domBoundary = domBoundary;
    }

    created() {
      injectAureliaHideStyleAtBoundary(this.domBoundary);
    }

    valueChanged(newValue) {
      if (newValue) {
        this.animator.removeClass(this.element, aureliaHideClassName);
      } else {
        this.animator.addClass(this.element, aureliaHideClassName);
      }
    }

    bind(bindingContext) {
      this.valueChanged(this.value);
    }
  }) || _class$9);

  var _dec$a, _class$a;

  let Hide = (_dec$a = customAttribute('hide'), _dec$a(_class$a = class Hide {

    static inject() {
      return [DOM.Element, Animator, Optional.of(DOM.boundary, true)];
    }

    constructor(element, animator, domBoundary) {
      this.element = element;
      this.animator = animator;
      this.domBoundary = domBoundary;
    }

    created() {
      injectAureliaHideStyleAtBoundary(this.domBoundary);
    }

    valueChanged(newValue) {
      if (newValue) {
        this.animator.addClass(this.element, aureliaHideClassName);
      } else {
        this.animator.removeClass(this.element, aureliaHideClassName);
      }
    }

    bind(bindingContext) {
      this.valueChanged(this.value);
    }
  }) || _class$a);

  const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

  let HTMLSanitizer = class HTMLSanitizer {
    sanitize(input) {
      return input.replace(SCRIPT_REGEX, '');
    }
  };

  var _dec$b, _dec2$8, _class$b;

  let SanitizeHTMLValueConverter = (_dec$b = valueConverter('sanitizeHTML'), _dec2$8 = inject(HTMLSanitizer), _dec$b(_class$b = _dec2$8(_class$b = class SanitizeHTMLValueConverter {
    constructor(sanitizer) {
      this.sanitizer = sanitizer;
    }

    toView(untrustedMarkup) {
      if (untrustedMarkup === null || untrustedMarkup === undefined) {
        return null;
      }

      return this.sanitizer.sanitize(untrustedMarkup);
    }
  }) || _class$b) || _class$b);

  var _dec$c, _dec2$9, _class$c;

  let Replaceable = (_dec$c = customAttribute('replaceable'), _dec2$9 = inject(BoundViewFactory, ViewSlot), _dec$c(_class$c = templateController(_class$c = _dec2$9(_class$c = class Replaceable {
    constructor(viewFactory, viewSlot) {
      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.view = null;
    }

    bind(bindingContext, overrideContext) {
      if (this.view === null) {
        this.view = this.viewFactory.create();
        this.viewSlot.add(this.view);
      }

      this.view.bind(bindingContext, overrideContext);
    }

    unbind() {
      this.view.unbind();
    }
  }) || _class$c) || _class$c) || _class$c);

  var _dec$d, _class$d;

  let Focus = (_dec$d = customAttribute('focus', bindingMode.twoWay), _dec$d(_class$d = class Focus {

    static inject() {
      return [DOM.Element, TaskQueue];
    }

    constructor(element, taskQueue) {
      this.element = element;
      this.taskQueue = taskQueue;
      this.isAttached = false;
      this.needsApply = false;
    }

    valueChanged(newValue) {
      if (this.isAttached) {
        this._apply();
      } else {
        this.needsApply = true;
      }
    }

    _apply() {
      if (this.value) {
        this.taskQueue.queueMicroTask(() => {
          if (this.value) {
            this.element.focus();
          }
        });
      } else {
        this.element.blur();
      }
    }

    attached() {
      this.isAttached = true;
      if (this.needsApply) {
        this.needsApply = false;
        this._apply();
      }
      this.element.addEventListener('focus', this);
      this.element.addEventListener('blur', this);
    }

    detached() {
      this.isAttached = false;
      this.element.removeEventListener('focus', this);
      this.element.removeEventListener('blur', this);
    }

    handleEvent(e) {
      if (e.type === 'focus') {
        this.value = true;
      } else if (DOM.activeElement !== this.element) {
        this.value = false;
      }
    }
  }) || _class$d);

  let cssUrlMatcher = /url\((?!['"]data)([^)]+)\)/gi;

  function fixupCSSUrls(address, css) {
    if (typeof css !== 'string') {
      throw new Error(`Failed loading required CSS file: ${address}`);
    }
    return css.replace(cssUrlMatcher, (match, p1) => {
      let quote = p1.charAt(0);
      if (quote === '\'' || quote === '"') {
        p1 = p1.substr(1, p1.length - 2);
      }
      return 'url(\'' + relativeToFile(p1, address) + '\')';
    });
  }

  let CSSResource = class CSSResource {
    constructor(address) {
      this.address = address;
      this._scoped = null;
      this._global = false;
      this._alreadyGloballyInjected = false;
    }

    initialize(container, target) {
      this._scoped = new target(this);
    }

    register(registry, name) {
      if (name === 'scoped') {
        registry.registerViewEngineHooks(this._scoped);
      } else {
        this._global = true;
      }
    }

    load(container) {
      return container.get(Loader).loadText(this.address).catch(err => null).then(text => {
        text = fixupCSSUrls(this.address, text);
        this._scoped.css = text;
        if (this._global) {
          this._alreadyGloballyInjected = true;
          DOM.injectStyles(text);
        }
      });
    }
  };
  let CSSViewEngineHooks = class CSSViewEngineHooks {
    constructor(owner) {
      this.owner = owner;
      this.css = null;
    }

    beforeCompile(content, resources, instruction) {
      if (instruction.targetShadowDOM) {
        DOM.injectStyles(this.css, content, true);
      } else if (FEATURE.scopedCSS) {
        let styleNode = DOM.injectStyles(this.css, content, true);
        styleNode.setAttribute('scoped', 'scoped');
      } else if (this._global && !this.owner._alreadyGloballyInjected) {
        DOM.injectStyles(this.css);
        this.owner._alreadyGloballyInjected = true;
      }
    }
  };


  function _createCSSResource(address) {
    var _dec, _class;

    let ViewCSS = (_dec = resource(new CSSResource(address)), _dec(_class = class ViewCSS extends CSSViewEngineHooks {}) || _class);

    return ViewCSS;
  }

  var _dec$e, _class$e;

  let AttrBindingBehavior = (_dec$e = bindingBehavior('attr'), _dec$e(_class$e = class AttrBindingBehavior {
    bind(binding, source) {
      binding.targetObserver = new DataAttributeObserver(binding.target, binding.targetProperty);
    }

    unbind(binding, source) {}
  }) || _class$e);

  var _dec$f, _dec2$a, _class$f, _dec3$4, _dec4$3, _class2$7, _dec5$3, _dec6$3, _class3$4, _dec7$3, _dec8$2, _class4$3, _dec9$2, _dec10$2, _class5$4;

  let modeBindingBehavior = {
    bind(binding, source, lookupFunctions) {
      binding.originalMode = binding.mode;
      binding.mode = this.mode;
    },

    unbind(binding, source) {
      binding.mode = binding.originalMode;
      binding.originalMode = null;
    }
  };

  let OneTimeBindingBehavior = (_dec$f = mixin(modeBindingBehavior), _dec2$a = bindingBehavior('oneTime'), _dec$f(_class$f = _dec2$a(_class$f = class OneTimeBindingBehavior {
    constructor() {
      this.mode = bindingMode.oneTime;
    }
  }) || _class$f) || _class$f);

  let OneWayBindingBehavior = (_dec3$4 = mixin(modeBindingBehavior), _dec4$3 = bindingBehavior('oneWay'), _dec3$4(_class2$7 = _dec4$3(_class2$7 = class OneWayBindingBehavior {
    constructor() {
      this.mode = bindingMode.toView;
    }
  }) || _class2$7) || _class2$7);

  let ToViewBindingBehavior = (_dec5$3 = mixin(modeBindingBehavior), _dec6$3 = bindingBehavior('toView'), _dec5$3(_class3$4 = _dec6$3(_class3$4 = class ToViewBindingBehavior {
    constructor() {
      this.mode = bindingMode.toView;
    }
  }) || _class3$4) || _class3$4);

  let FromViewBindingBehavior = (_dec7$3 = mixin(modeBindingBehavior), _dec8$2 = bindingBehavior('fromView'), _dec7$3(_class4$3 = _dec8$2(_class4$3 = class FromViewBindingBehavior {
    constructor() {
      this.mode = bindingMode.fromView;
    }
  }) || _class4$3) || _class4$3);

  let TwoWayBindingBehavior = (_dec9$2 = mixin(modeBindingBehavior), _dec10$2 = bindingBehavior('twoWay'), _dec9$2(_class5$4 = _dec10$2(_class5$4 = class TwoWayBindingBehavior {
    constructor() {
      this.mode = bindingMode.twoWay;
    }
  }) || _class5$4) || _class5$4);

  var _dec$g, _class$g;

  function throttle(newValue) {
    let state = this.throttleState;
    let elapsed = +new Date() - state.last;
    if (elapsed >= state.delay) {
      clearTimeout(state.timeoutId);
      state.timeoutId = null;
      state.last = +new Date();
      this.throttledMethod(newValue);
      return;
    }
    state.newValue = newValue;
    if (state.timeoutId === null) {
      state.timeoutId = setTimeout(() => {
        state.timeoutId = null;
        state.last = +new Date();
        this.throttledMethod(state.newValue);
      }, state.delay - elapsed);
    }
  }

  let ThrottleBindingBehavior = (_dec$g = bindingBehavior('throttle'), _dec$g(_class$g = class ThrottleBindingBehavior {
    bind(binding, source, delay = 200) {
      let methodToThrottle = 'updateTarget';
      if (binding.callSource) {
        methodToThrottle = 'callSource';
      } else if (binding.updateSource && binding.mode === bindingMode.twoWay) {
        methodToThrottle = 'updateSource';
      }

      binding.throttledMethod = binding[methodToThrottle];
      binding.throttledMethod.originalName = methodToThrottle;

      binding[methodToThrottle] = throttle;

      binding.throttleState = {
        delay: delay,
        last: 0,
        timeoutId: null
      };
    }

    unbind(binding, source) {
      let methodToRestore = binding.throttledMethod.originalName;
      binding[methodToRestore] = binding.throttledMethod;
      binding.throttledMethod = null;
      clearTimeout(binding.throttleState.timeoutId);
      binding.throttleState = null;
    }
  }) || _class$g);

  var _dec$h, _class$h;

  const unset = {};

  function debounceCallSource(event) {
    const state = this.debounceState;
    clearTimeout(state.timeoutId);
    state.timeoutId = setTimeout(() => this.debouncedMethod(event), state.delay);
  }

  function debounceCall(context, newValue, oldValue) {
    const state = this.debounceState;
    clearTimeout(state.timeoutId);
    if (context !== state.callContextToDebounce) {
      state.oldValue = unset;
      this.debouncedMethod(context, newValue, oldValue);
      return;
    }
    if (state.oldValue === unset) {
      state.oldValue = oldValue;
    }
    state.timeoutId = setTimeout(() => {
      const _oldValue = state.oldValue;
      state.oldValue = unset;
      this.debouncedMethod(context, newValue, _oldValue);
    }, state.delay);
  }

  let DebounceBindingBehavior = (_dec$h = bindingBehavior('debounce'), _dec$h(_class$h = class DebounceBindingBehavior {
    bind(binding, source, delay = 200) {
      const isCallSource = binding.callSource !== undefined;
      const methodToDebounce = isCallSource ? 'callSource' : 'call';
      const debouncer = isCallSource ? debounceCallSource : debounceCall;
      const mode = binding.mode;
      const callContextToDebounce = mode === bindingMode.twoWay || mode === bindingMode.fromView ? targetContext : sourceContext;

      binding.debouncedMethod = binding[methodToDebounce];
      binding.debouncedMethod.originalName = methodToDebounce;

      binding[methodToDebounce] = debouncer;

      binding.debounceState = {
        callContextToDebounce,
        delay,
        timeoutId: 0,
        oldValue: unset
      };
    }

    unbind(binding, source) {
      const methodToRestore = binding.debouncedMethod.originalName;
      binding[methodToRestore] = binding.debouncedMethod;
      binding.debouncedMethod = null;
      clearTimeout(binding.debounceState.timeoutId);
      binding.debounceState = null;
    }
  }) || _class$h);

  var _dec$i, _class$i;

  function findOriginalEventTarget$1(event) {
    return event.path && event.path[0] || event.deepPath && event.deepPath[0] || event.target;
  }

  function handleSelfEvent(event) {
    let target = findOriginalEventTarget$1(event);
    if (this.target !== target) return;
    this.selfEventCallSource(event);
  }

  let SelfBindingBehavior = (_dec$i = bindingBehavior('self'), _dec$i(_class$i = class SelfBindingBehavior {
    bind(binding, source) {
      if (!binding.callSource || !binding.targetEvent) throw new Error('Self binding behavior only supports event.');
      binding.selfEventCallSource = binding.callSource;
      binding.callSource = handleSelfEvent;
    }

    unbind(binding, source) {
      binding.callSource = binding.selfEventCallSource;
      binding.selfEventCallSource = null;
    }
  }) || _class$i);

  let BindingSignaler = class BindingSignaler {
    constructor() {
      this.signals = {};
    }

    signal(name) {
      let bindings = this.signals[name];
      if (!bindings) {
        return;
      }
      let i = bindings.length;
      while (i--) {
        bindings[i].call(sourceContext);
      }
    }
  };

  var _dec$j, _class$j;

  let SignalBindingBehavior = (_dec$j = bindingBehavior('signal'), _dec$j(_class$j = class SignalBindingBehavior {
    static inject() {
      return [BindingSignaler];
    }


    constructor(bindingSignaler) {
      this.signals = bindingSignaler.signals;
    }

    bind(binding, source) {
      if (!binding.updateTarget) {
        throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
      }
      if (arguments.length === 3) {
        let name = arguments[2];
        let bindings = this.signals[name] || (this.signals[name] = []);
        bindings.push(binding);
        binding.signalName = name;
      } else if (arguments.length > 3) {
        let names = Array.prototype.slice.call(arguments, 2);
        let i = names.length;
        while (i--) {
          let name = names[i];
          let bindings = this.signals[name] || (this.signals[name] = []);
          bindings.push(binding);
        }
        binding.signalName = names;
      } else {
        throw new Error('Signal name is required.');
      }
    }

    unbind(binding, source) {
      let name = binding.signalName;
      binding.signalName = null;
      if (Array.isArray(name)) {
        let names = name;
        let i = names.length;
        while (i--) {
          let n = names[i];
          let bindings = this.signals[n];
          bindings.splice(bindings.indexOf(binding), 1);
        }
      } else {
        let bindings = this.signals[name];
        bindings.splice(bindings.indexOf(binding), 1);
      }
    }
  }) || _class$j);

  var _dec$k, _class$k;

  const eventNamesRequired = 'The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:\'blur\'">';
  const notApplicableMessage = 'The updateTrigger binding behavior can only be applied to two-way/ from-view bindings on input/select elements.';

  let UpdateTriggerBindingBehavior = (_dec$k = bindingBehavior('updateTrigger'), _dec$k(_class$k = class UpdateTriggerBindingBehavior {

    bind(binding, source, ...events) {
      if (events.length === 0) {
        throw new Error(eventNamesRequired);
      }
      if (binding.mode !== bindingMode.twoWay && binding.mode !== bindingMode.fromView) {
        throw new Error(notApplicableMessage);
      }

      let targetObserver = binding.observerLocator.getObserver(binding.target, binding.targetProperty);
      if (!targetObserver.handler) {
        throw new Error(notApplicableMessage);
      }
      binding.targetObserver = targetObserver;

      targetObserver.originalHandler = binding.targetObserver.handler;

      let handler = new EventSubscriber(events);
      targetObserver.handler = handler;
    }

    unbind(binding, source) {
      binding.targetObserver.handler.dispose();
      binding.targetObserver.handler = binding.targetObserver.originalHandler;
      binding.targetObserver.originalHandler = null;
    }
  }) || _class$k);

  function _createDynamicElement(name, viewUrl, bindableNames) {
    var _dec, _dec2, _class;

    let DynamicElement = (_dec = customElement(name), _dec2 = useView(viewUrl), _dec(_class = _dec2(_class = class DynamicElement {
      bind(bindingContext) {
        this.$parent = bindingContext;
      }
    }) || _class) || _class);

    for (let i = 0, ii = bindableNames.length; i < ii; ++i) {
      bindable(bindableNames[i])(DynamicElement);
    }
    return DynamicElement;
  }

  function getElementName(address) {
    return (/([^\/^\?]+)\.html/i.exec(address)[1].toLowerCase()
    );
  }

  function configure$1(config) {
    let viewEngine = config.container.get(ViewEngine);
    let loader = config.aurelia.loader;

    viewEngine.addResourcePlugin('.html', {
      'fetch': function (address) {
        return loader.loadTemplate(address).then(registryEntry => {
          let bindable = registryEntry.template.getAttribute('bindable');
          let elementName = getElementName(address);

          if (bindable) {
            bindable = bindable.split(',').map(x => x.trim());
            registryEntry.template.removeAttribute('bindable');
          } else {
            bindable = [];
          }

          return { [elementName]: _createDynamicElement(elementName, address, bindable) };
        });
      }
    });
  }

  function configure$2(config) {
    injectAureliaHideStyleAtHead();

    config.globalResources(Compose, If, Else, With, Repeat, Show, Hide, Replaceable, Focus, SanitizeHTMLValueConverter, OneTimeBindingBehavior, OneWayBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, TwoWayBindingBehavior, ThrottleBindingBehavior, DebounceBindingBehavior, SelfBindingBehavior, SignalBindingBehavior, UpdateTriggerBindingBehavior, AttrBindingBehavior);

    configure$1(config);

    let viewEngine = config.container.get(ViewEngine);
    let styleResourcePlugin = {
      fetch(address) {
        return { [address]: _createCSSResource(address) };
      }
    };
    ['.css', '.less', '.sass', '.scss', '.styl'].forEach(ext => viewEngine.addResourcePlugin(ext, styleResourcePlugin));
  }

  const logger$3 = getLogger('event-aggregator');

  let Handler = class Handler {
    constructor(messageType, callback) {
      this.messageType = messageType;
      this.callback = callback;
    }

    handle(message) {
      if (message instanceof this.messageType) {
        this.callback.call(null, message);
      }
    }
  };


  function invokeCallback(callback, data, event) {
    try {
      callback(data, event);
    } catch (e) {
      logger$3.error(e);
    }
  }

  function invokeHandler(handler, data) {
    try {
      handler.handle(data);
    } catch (e) {
      logger$3.error(e);
    }
  }

  let EventAggregator = class EventAggregator {
    constructor() {
      this.eventLookup = {};
      this.messageHandlers = [];
    }

    publish(event, data) {
      let subscribers;
      let i;

      if (!event) {
        throw new Error('Event was invalid.');
      }

      if (typeof event === 'string') {
        subscribers = this.eventLookup[event];
        if (subscribers) {
          subscribers = subscribers.slice();
          i = subscribers.length;

          while (i--) {
            invokeCallback(subscribers[i], data, event);
          }
        }
      } else {
        subscribers = this.messageHandlers.slice();
        i = subscribers.length;

        while (i--) {
          invokeHandler(subscribers[i], event);
        }
      }
    }

    subscribe(event, callback) {
      let handler;
      let subscribers;

      if (!event) {
        throw new Error('Event channel/type was invalid.');
      }

      if (typeof event === 'string') {
        handler = callback;
        subscribers = this.eventLookup[event] || (this.eventLookup[event] = []);
      } else {
        handler = new Handler(event, callback);
        subscribers = this.messageHandlers;
      }

      subscribers.push(handler);

      return {
        dispose() {
          let idx = subscribers.indexOf(handler);
          if (idx !== -1) {
            subscribers.splice(idx, 1);
          }
        }
      };
    }

    subscribeOnce(event, callback) {
      let sub = this.subscribe(event, (a, b) => {
        sub.dispose();
        return callback(a, b);
      });

      return sub;
    }
  };

  function includeEventsIn(obj) {
    let ea = new EventAggregator();

    obj.subscribeOnce = function (event, callback) {
      return ea.subscribeOnce(event, callback);
    };

    obj.subscribe = function (event, callback) {
      return ea.subscribe(event, callback);
    };

    obj.publish = function (event, data) {
      ea.publish(event, data);
    };

    return ea;
  }

  function configure$3(config) {
    config.instance(EventAggregator, includeEventsIn(config.aurelia));
  }

  function mi$1(name) {
    throw new Error('History must implement ' + name + '().');
  }

  var History = function () {
    function History() {
      
    }

    History.prototype.activate = function activate(options) {
      mi$1('activate');
    };

    History.prototype.deactivate = function deactivate() {
      mi$1('deactivate');
    };

    History.prototype.getAbsoluteRoot = function getAbsoluteRoot() {
      mi$1('getAbsoluteRoot');
    };

    History.prototype.navigate = function navigate(fragment, options) {
      mi$1('navigate');
    };

    History.prototype.navigateBack = function navigateBack() {
      mi$1('navigateBack');
    };

    History.prototype.setTitle = function setTitle(title) {
      mi$1('setTitle');
    };

    History.prototype.setState = function setState(key, value) {
      mi$1('setState');
    };

    History.prototype.getState = function getState(key) {
      mi$1('getState');
    };

    History.prototype.getHistoryIndex = function getHistoryIndex() {
      mi$1('getHistoryIndex');
    };

    History.prototype.go = function go(movement) {
      mi$1('go');
    };

    return History;
  }();

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var LinkHandler = (function () {
      function LinkHandler() {
      }
      LinkHandler.prototype.activate = function (history) { };
      LinkHandler.prototype.deactivate = function () { };
      return LinkHandler;
  }());
  var DefaultLinkHandler = (function (_super) {
      __extends(DefaultLinkHandler, _super);
      function DefaultLinkHandler() {
          var _this = _super.call(this) || this;
          _this.handler = function (e) {
              var _a = DefaultLinkHandler.getEventInfo(e), shouldHandleEvent = _a.shouldHandleEvent, href = _a.href;
              if (shouldHandleEvent) {
                  e.preventDefault();
                  _this.history.navigate(href);
              }
          };
          return _this;
      }
      DefaultLinkHandler.prototype.activate = function (history) {
          if (history._hasPushState) {
              this.history = history;
              DOM.addEventListener('click', this.handler, true);
          }
      };
      DefaultLinkHandler.prototype.deactivate = function () {
          DOM.removeEventListener('click', this.handler, true);
      };
      DefaultLinkHandler.getEventInfo = function (event) {
          var $event = event;
          var info = {
              shouldHandleEvent: false,
              href: null,
              anchor: null
          };
          var target = DefaultLinkHandler.findClosestAnchor($event.target);
          if (!target || !DefaultLinkHandler.targetIsThisWindow(target)) {
              return info;
          }
          if (hasAttribute$1(target, 'download')
              || hasAttribute$1(target, 'router-ignore')
              || hasAttribute$1(target, 'data-router-ignore')) {
              return info;
          }
          if ($event.altKey || $event.ctrlKey || $event.metaKey || $event.shiftKey) {
              return info;
          }
          var href = target.getAttribute('href');
          info.anchor = target;
          info.href = href;
          var leftButtonClicked = $event.which === 1;
          var isRelative = href && !(href.charAt(0) === '#' || (/^[a-z]+:/i).test(href));
          info.shouldHandleEvent = leftButtonClicked && isRelative;
          return info;
      };
      DefaultLinkHandler.findClosestAnchor = function (el) {
          while (el) {
              if (el.tagName === 'A') {
                  return el;
              }
              el = el.parentNode;
          }
      };
      DefaultLinkHandler.targetIsThisWindow = function (target) {
          var targetWindow = target.getAttribute('target');
          var win = PLATFORM.global;
          return !targetWindow ||
              targetWindow === win.name ||
              targetWindow === '_self';
      };
      return DefaultLinkHandler;
  }(LinkHandler));
  var hasAttribute$1 = function (el, attr) { return el.hasAttribute(attr); };

  var BrowserHistory = (function (_super) {
      __extends(BrowserHistory, _super);
      function BrowserHistory(linkHandler) {
          var _this = _super.call(this) || this;
          _this._isActive = false;
          _this._checkUrlCallback = _this._checkUrl.bind(_this);
          _this.location = PLATFORM.location;
          _this.history = PLATFORM.history;
          _this.linkHandler = linkHandler;
          return _this;
      }
      BrowserHistory.prototype.activate = function (options) {
          if (this._isActive) {
              throw new Error('History has already been activated.');
          }
          var $history = this.history;
          var wantsPushState = !!options.pushState;
          this._isActive = true;
          var normalizedOptions = this.options = Object.assign({}, { root: '/' }, this.options, options);
          var rootUrl = this.root = ('/' + normalizedOptions.root + '/').replace(rootStripper, '/');
          var wantsHashChange = this._wantsHashChange = normalizedOptions.hashChange !== false;
          var hasPushState = this._hasPushState = !!(normalizedOptions.pushState && $history && $history.pushState);
          var eventName;
          if (hasPushState) {
              eventName = 'popstate';
          }
          else if (wantsHashChange) {
              eventName = 'hashchange';
          }
          PLATFORM.addEventListener(eventName, this._checkUrlCallback);
          if (wantsHashChange && wantsPushState) {
              var $location = this.location;
              var atRoot = $location.pathname.replace(/[^\/]$/, '$&/') === rootUrl;
              if (!hasPushState && !atRoot) {
                  var fragment = this.fragment = this._getFragment(null, true);
                  $location.replace(rootUrl + $location.search + '#' + fragment);
                  return true;
              }
              else if (hasPushState && atRoot && $location.hash) {
                  var fragment = this.fragment = this._getHash().replace(routeStripper, '');
                  $history.replaceState({}, DOM.title, rootUrl + fragment + $location.search);
              }
          }
          if (!this.fragment) {
              this.fragment = this._getFragment('');
          }
          this.linkHandler.activate(this);
          if (!normalizedOptions.silent) {
              return this._loadUrl('');
          }
      };
      BrowserHistory.prototype.deactivate = function () {
          var handler = this._checkUrlCallback;
          PLATFORM.removeEventListener('popstate', handler);
          PLATFORM.removeEventListener('hashchange', handler);
          this._isActive = false;
          this.linkHandler.deactivate();
      };
      BrowserHistory.prototype.getAbsoluteRoot = function () {
          var $location = this.location;
          var origin = createOrigin($location.protocol, $location.hostname, $location.port);
          return "" + origin + this.root;
      };
      BrowserHistory.prototype.navigate = function (fragment, _a) {
          var _b = _a === void 0 ? {} : _a, _c = _b.trigger, trigger = _c === void 0 ? true : _c, _d = _b.replace, replace = _d === void 0 ? false : _d;
          var location = this.location;
          if (fragment && absoluteUrl.test(fragment)) {
              location.href = fragment;
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
              this.history[replace ? 'replaceState' : 'pushState']({}, DOM.title, url);
          }
          else if (this._wantsHashChange) {
              updateHash(location, fragment, replace);
          }
          else {
              location.assign(url);
          }
          if (trigger) {
              return this._loadUrl(fragment);
          }
          return true;
      };
      BrowserHistory.prototype.navigateBack = function () {
          this.history.back();
      };
      BrowserHistory.prototype.setTitle = function (title) {
          DOM.title = title;
      };
      BrowserHistory.prototype.setState = function (key, value) {
          var $history = this.history;
          var state = Object.assign({}, $history.state);
          var _a = this.location, pathname = _a.pathname, search = _a.search, hash = _a.hash;
          state[key] = value;
          $history.replaceState(state, null, "" + pathname + search + hash);
      };
      BrowserHistory.prototype.getState = function (key) {
          var state = Object.assign({}, this.history.state);
          return state[key];
      };
      BrowserHistory.prototype.getHistoryIndex = function () {
          var historyIndex = this.getState('HistoryIndex');
          if (historyIndex === undefined) {
              historyIndex = this.history.length - 1;
              this.setState('HistoryIndex', historyIndex);
          }
          return historyIndex;
      };
      BrowserHistory.prototype.go = function (movement) {
          this.history.go(movement);
      };
      BrowserHistory.prototype._getHash = function () {
          return this.location.hash.substr(1);
      };
      BrowserHistory.prototype._getFragment = function (fragment, forcePushState) {
          var rootUrl;
          if (!fragment) {
              if (this._hasPushState || !this._wantsHashChange || forcePushState) {
                  var location_1 = this.location;
                  fragment = location_1.pathname + location_1.search;
                  rootUrl = this.root.replace(trailingSlash, '');
                  if (!fragment.indexOf(rootUrl)) {
                      fragment = fragment.substr(rootUrl.length);
                  }
              }
              else {
                  fragment = this._getHash();
              }
          }
          return '/' + fragment.replace(routeStripper, '');
      };
      BrowserHistory.prototype._checkUrl = function () {
          var current = this._getFragment('');
          if (current !== this.fragment) {
              this._loadUrl('');
          }
      };
      BrowserHistory.prototype._loadUrl = function (fragmentOverride) {
          var fragment = this.fragment = this._getFragment(fragmentOverride);
          return this.options.routeHandler ?
              this.options.routeHandler(fragment) :
              false;
      };
      BrowserHistory.inject = [LinkHandler];
      return BrowserHistory;
  }(History));
  var routeStripper = /^#?\/*|\s+$/g;
  var rootStripper = /^\/+|\/+$/g;
  var trailingSlash = /\/$/;
  var absoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;
  function updateHash($location, fragment, replace) {
      if (replace) {
          var href = $location.href.replace(/(javascript:|#).*$/, '');
          $location.replace(href + '#' + fragment);
      }
      else {
          $location.hash = '#' + fragment;
      }
  }
  function createOrigin(protocol, hostname, port) {
      return protocol + "//" + hostname + (port ? ':' + port : '');
  }

  function configure$4(config) {
      var $config = config;
      $config.singleton(History, BrowserHistory);
      $config.transient(LinkHandler, DefaultLinkHandler);
  }

  let State = class State {
    constructor(charSpec) {
      this.charSpec = charSpec;
      this.nextStates = [];
    }

    get(charSpec) {
      for (let child of this.nextStates) {
        let isEqual = child.charSpec.validChars === charSpec.validChars && child.charSpec.invalidChars === charSpec.invalidChars;

        if (isEqual) {
          return child;
        }
      }

      return undefined;
    }

    put(charSpec) {
      let state = this.get(charSpec);

      if (state) {
        return state;
      }

      state = new State(charSpec);

      this.nextStates.push(state);

      if (charSpec.repeat) {
        state.nextStates.push(state);
      }

      return state;
    }

    match(ch) {
      let nextStates = this.nextStates;
      let results = [];

      for (let i = 0, l = nextStates.length; i < l; i++) {
        let child = nextStates[i];
        let charSpec = child.charSpec;

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
    }
  };

  const specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];

  const escapeRegex = new RegExp('(\\' + specials.join('|\\') + ')', 'g');

  let StaticSegment = class StaticSegment {
    constructor(string, caseSensitive) {
      this.string = string;
      this.caseSensitive = caseSensitive;
    }

    eachChar(callback) {
      let s = this.string;
      for (let i = 0, ii = s.length; i < ii; ++i) {
        let ch = s[i];
        callback({ validChars: this.caseSensitive ? ch : ch.toUpperCase() + ch.toLowerCase() });
      }
    }

    regex() {
      return this.string.replace(escapeRegex, '\\$1');
    }

    generate() {
      return this.string;
    }
  };

  let DynamicSegment = class DynamicSegment {
    constructor(name, optional) {
      this.name = name;
      this.optional = optional;
    }

    eachChar(callback) {
      callback({ invalidChars: '/', repeat: true });
    }

    regex() {
      return '([^/]+)';
    }

    generate(params, consumed) {
      consumed[this.name] = true;
      return params[this.name];
    }
  };

  let StarSegment = class StarSegment {
    constructor(name) {
      this.name = name;
    }

    eachChar(callback) {
      callback({ invalidChars: '', repeat: true });
    }

    regex() {
      return '(.+)';
    }

    generate(params, consumed) {
      consumed[this.name] = true;
      return params[this.name];
    }
  };

  let EpsilonSegment = class EpsilonSegment {
    eachChar() {}

    regex() {
      return '';
    }

    generate() {
      return '';
    }
  };

  let RouteRecognizer = class RouteRecognizer {
    constructor() {
      this.rootState = new State();
      this.names = {};
      this.routes = new Map();
    }

    add(route) {
      if (Array.isArray(route)) {
        route.forEach(r => this.add(r));
        return undefined;
      }

      let currentState = this.rootState;
      let skippableStates = [];
      let regex = '^';
      let types = { statics: 0, dynamics: 0, stars: 0 };
      let names = [];
      let routeName = route.handler.name;
      let isEmpty = true;
      let segments = parse(route.path, names, types, route.caseSensitive);

      for (let i = 0, ii = segments.length; i < ii; i++) {
        let segment = segments[i];
        if (segment instanceof EpsilonSegment) {
          continue;
        }

        let [firstState, nextState] = addSegment(currentState, segment);

        for (let j = 0, jj = skippableStates.length; j < jj; j++) {
          skippableStates[j].nextStates.push(firstState);
        }

        if (segment.optional) {
          skippableStates.push(nextState);
          regex += `(?:/${segment.regex()})?`;
        } else {
          currentState = nextState;
          regex += `/${segment.regex()}`;
          skippableStates.length = 0;
          isEmpty = false;
        }
      }

      if (isEmpty) {
        currentState = currentState.put({ validChars: '/' });
        regex += '/?';
      }

      let handlers = [{ handler: route.handler, names: names }];

      this.routes.set(route.handler, { segments, handlers });
      if (routeName) {
        let routeNames = Array.isArray(routeName) ? routeName : [routeName];
        for (let i = 0; i < routeNames.length; i++) {
          if (!(routeNames[i] in this.names)) {
            this.names[routeNames[i]] = { segments, handlers };
          }
        }
      }

      for (let i = 0; i < skippableStates.length; i++) {
        let state = skippableStates[i];
        state.handlers = handlers;
        state.regex = new RegExp(regex + '$', route.caseSensitive ? '' : 'i');
        state.types = types;
      }

      currentState.handlers = handlers;
      currentState.regex = new RegExp(regex + '$', route.caseSensitive ? '' : 'i');
      currentState.types = types;

      return currentState;
    }

    getRoute(nameOrRoute) {
      return typeof nameOrRoute === 'string' ? this.names[nameOrRoute] : this.routes.get(nameOrRoute);
    }

    handlersFor(nameOrRoute) {
      let route = this.getRoute(nameOrRoute);
      if (!route) {
        throw new Error(`There is no route named ${nameOrRoute}`);
      }

      return [...route.handlers];
    }

    hasRoute(nameOrRoute) {
      return !!this.getRoute(nameOrRoute);
    }

    generate(nameOrRoute, params) {
      let route = this.getRoute(nameOrRoute);
      if (!route) {
        throw new Error(`There is no route named ${nameOrRoute}`);
      }

      let handler = route.handlers[0].handler;
      if (handler.generationUsesHref) {
        return handler.href;
      }

      let routeParams = Object.assign({}, params);
      let segments = route.segments;
      let consumed = {};
      let output = '';

      for (let i = 0, l = segments.length; i < l; i++) {
        let segment = segments[i];

        if (segment instanceof EpsilonSegment) {
          continue;
        }

        let segmentValue = segment.generate(routeParams, consumed);
        if (segmentValue === null || segmentValue === undefined) {
          if (!segment.optional) {
            throw new Error(`A value is required for route parameter '${segment.name}' in route '${nameOrRoute}'.`);
          }
        } else {
          output += '/';
          output += segmentValue;
        }
      }

      if (output.charAt(0) !== '/') {
        output = '/' + output;
      }

      for (let param in consumed) {
        delete routeParams[param];
      }

      let queryString = buildQueryString(routeParams);
      output += queryString ? `?${queryString}` : '';

      return output;
    }

    recognize(path) {
      let states = [this.rootState];
      let queryParams = {};
      let isSlashDropped = false;
      let normalizedPath = path;

      let queryStart = normalizedPath.indexOf('?');
      if (queryStart !== -1) {
        let queryString = normalizedPath.substr(queryStart + 1, normalizedPath.length);
        normalizedPath = normalizedPath.substr(0, queryStart);
        queryParams = parseQueryString(queryString);
      }

      normalizedPath = decodeURI(normalizedPath);

      if (normalizedPath.charAt(0) !== '/') {
        normalizedPath = '/' + normalizedPath;
      }

      let pathLen = normalizedPath.length;
      if (pathLen > 1 && normalizedPath.charAt(pathLen - 1) === '/') {
        normalizedPath = normalizedPath.substr(0, pathLen - 1);
        isSlashDropped = true;
      }

      for (let i = 0, l = normalizedPath.length; i < l; i++) {
        states = recognizeChar(states, normalizedPath.charAt(i));
        if (!states.length) {
          break;
        }
      }

      let solutions = [];
      for (let i = 0, l = states.length; i < l; i++) {
        if (states[i].handlers) {
          solutions.push(states[i]);
        }
      }

      states = sortSolutions(solutions);

      let state = solutions[0];
      if (state && state.handlers) {
        if (isSlashDropped && state.regex.source.slice(-5) === '(.+)$') {
          normalizedPath = normalizedPath + '/';
        }

        return findHandler(state, normalizedPath, queryParams);
      }
    }
  };

  let RecognizeResults = class RecognizeResults {
    constructor(queryParams) {
      this.splice = Array.prototype.splice;
      this.slice = Array.prototype.slice;
      this.push = Array.prototype.push;
      this.length = 0;
      this.queryParams = queryParams || {};
    }
  };


  function parse(route, names, types, caseSensitive) {
    let normalizedRoute = route;
    if (route.charAt(0) === '/') {
      normalizedRoute = route.substr(1);
    }

    let results = [];

    let splitRoute = normalizedRoute.split('/');
    for (let i = 0, ii = splitRoute.length; i < ii; ++i) {
      let segment = splitRoute[i];

      let match = segment.match(/^:([^?]+)(\?)?$/);
      if (match) {
        let [, name, optional] = match;
        if (name.indexOf('=') !== -1) {
          throw new Error(`Parameter ${name} in route ${route} has a default value, which is not supported.`);
        }
        results.push(new DynamicSegment(name, !!optional));
        names.push(name);
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
    return states.sort((a, b) => {
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
    let nextStates = [];

    for (let i = 0, l = states.length; i < l; i++) {
      let state = states[i];
      nextStates.push(...state.match(ch));
    }

    return nextStates;
  }

  function findHandler(state, path, queryParams) {
    let handlers = state.handlers;
    let regex = state.regex;
    let captures = path.match(regex);
    let currentCapture = 1;
    let result = new RecognizeResults(queryParams);

    for (let i = 0, l = handlers.length; i < l; i++) {
      let handler = handlers[i];
      let names = handler.names;
      let params = {};

      for (let j = 0, m = names.length; j < m; j++) {
        params[names[j]] = captures[currentCapture++];
      }

      result.push({ handler: handler.handler, params: params, isDynamic: !!names.length });
    }

    return result;
  }

  function addSegment(currentState, segment) {
    let firstState = currentState.put({ validChars: '/' });
    let nextState = firstState;
    segment.eachChar(ch => {
      nextState = nextState.put(ch);
    });

    return [firstState, nextState];
  }

  /**
   * Class used to represent an instruction during a navigation.
   */
  class NavigationInstruction {
      constructor(init) {
          /**
           * Current built viewport plan of this nav instruction
           */
          this.plan = null;
          this.options = {};
          Object.assign(this, init);
          this.params = this.params || {};
          this.viewPortInstructions = {};
          let ancestorParams = [];
          let current = this;
          do {
              let currentParams = Object.assign({}, current.params);
              if (current.config && current.config.hasChildRouter) {
                  // remove the param for the injected child route segment
                  delete currentParams[current.getWildCardName()];
              }
              ancestorParams.unshift(currentParams);
              current = current.parentInstruction;
          } while (current);
          let allParams = Object.assign({}, this.queryParams, ...ancestorParams);
          this.lifecycleArgs = [allParams, this.config, this];
      }
      /**
       * Gets an array containing this instruction and all child instructions for the current navigation.
       */
      getAllInstructions() {
          let instructions = [this];
          let viewPortInstructions = this.viewPortInstructions;
          for (let key in viewPortInstructions) {
              let childInstruction = viewPortInstructions[key].childNavigationInstruction;
              if (childInstruction) {
                  instructions.push(...childInstruction.getAllInstructions());
              }
          }
          return instructions;
      }
      /**
       * Gets an array containing the instruction and all child instructions for the previous navigation.
       * Previous instructions are no longer available after navigation completes.
       */
      getAllPreviousInstructions() {
          return this.getAllInstructions().map(c => c.previousInstruction).filter(c => c);
      }
      addViewPortInstruction(nameOrInitOptions, strategy, moduleId, component) {
          let viewPortInstruction;
          let viewPortName = typeof nameOrInitOptions === 'string' ? nameOrInitOptions : nameOrInitOptions.name;
          const lifecycleArgs = this.lifecycleArgs;
          const config = Object.assign({}, lifecycleArgs[1], { currentViewPort: viewPortName });
          if (typeof nameOrInitOptions === 'string') {
              viewPortInstruction = {
                  name: nameOrInitOptions,
                  strategy: strategy,
                  moduleId: moduleId,
                  component: component,
                  childRouter: component.childRouter,
                  lifecycleArgs: [lifecycleArgs[0], config, lifecycleArgs[2]]
              };
          }
          else {
              viewPortInstruction = {
                  name: viewPortName,
                  strategy: nameOrInitOptions.strategy,
                  component: nameOrInitOptions.component,
                  moduleId: nameOrInitOptions.moduleId,
                  childRouter: nameOrInitOptions.component.childRouter,
                  lifecycleArgs: [lifecycleArgs[0], config, lifecycleArgs[2]]
              };
          }
          return this.viewPortInstructions[viewPortName] = viewPortInstruction;
      }
      /**
       * Gets the name of the route pattern's wildcard parameter, if applicable.
       */
      getWildCardName() {
          // todo: potential issue, or at least unsafe typings
          let configRoute = this.config.route;
          let wildcardIndex = configRoute.lastIndexOf('*');
          return configRoute.substr(wildcardIndex + 1);
      }
      /**
       * Gets the path and query string created by filling the route
       * pattern's wildcard parameter with the matching param.
       */
      getWildcardPath() {
          let wildcardName = this.getWildCardName();
          let path = this.params[wildcardName] || '';
          let queryString = this.queryString;
          if (queryString) {
              path += '?' + queryString;
          }
          return path;
      }
      /**
       * Gets the instruction's base URL, accounting for wildcard route parameters.
       */
      getBaseUrl() {
          let $encodeURI = encodeURI;
          let fragment = decodeURI(this.fragment);
          if (fragment === '') {
              let nonEmptyRoute = this.router.routes.find(route => {
                  return route.name === this.config.name &&
                      route.route !== '';
              });
              if (nonEmptyRoute) {
                  fragment = nonEmptyRoute.route;
              }
          }
          if (!this.params) {
              return $encodeURI(fragment);
          }
          let wildcardName = this.getWildCardName();
          let path = this.params[wildcardName] || '';
          if (!path) {
              return $encodeURI(fragment);
          }
          return $encodeURI(fragment.substr(0, fragment.lastIndexOf(path)));
      }
      /**
       * Finalize a viewport instruction
       * @internal
       */
      _commitChanges(waitToSwap) {
          let router = this.router;
          router.currentInstruction = this;
          const previousInstruction = this.previousInstruction;
          if (previousInstruction) {
              previousInstruction.config.navModel.isActive = false;
          }
          this.config.navModel.isActive = true;
          router.refreshNavigation();
          let loads = [];
          let delaySwaps = [];
          let viewPortInstructions = this.viewPortInstructions;
          for (let viewPortName in viewPortInstructions) {
              let viewPortInstruction = viewPortInstructions[viewPortName];
              let viewPort = router.viewPorts[viewPortName];
              if (!viewPort) {
                  throw new Error(`There was no router-view found in the view for ${viewPortInstruction.moduleId}.`);
              }
              let childNavInstruction = viewPortInstruction.childNavigationInstruction;
              if (viewPortInstruction.strategy === "replace" /* Replace */) {
                  if (childNavInstruction && childNavInstruction.parentCatchHandler) {
                      loads.push(childNavInstruction._commitChanges(waitToSwap));
                  }
                  else {
                      if (waitToSwap) {
                          delaySwaps.push({ viewPort, viewPortInstruction });
                      }
                      loads.push(viewPort
                          .process(viewPortInstruction, waitToSwap)
                          .then(() => childNavInstruction
                          ? childNavInstruction._commitChanges(waitToSwap)
                          : Promise.resolve()));
                  }
              }
              else {
                  if (childNavInstruction) {
                      loads.push(childNavInstruction._commitChanges(waitToSwap));
                  }
              }
          }
          return Promise
              .all(loads)
              .then(() => {
              delaySwaps.forEach(x => x.viewPort.swap(x.viewPortInstruction));
              return null;
          })
              .then(() => prune(this));
      }
      /**@internal */
      _updateTitle() {
          let router = this.router;
          let title = this._buildTitle(router.titleSeparator);
          if (title) {
              router.history.setTitle(title);
          }
      }
      /**@internal */
      _buildTitle(separator = ' | ') {
          let title = '';
          let childTitles = [];
          let navModelTitle = this.config.navModel.title;
          let instructionRouter = this.router;
          let viewPortInstructions = this.viewPortInstructions;
          if (navModelTitle) {
              title = instructionRouter.transformTitle(navModelTitle);
          }
          for (let viewPortName in viewPortInstructions) {
              let viewPortInstruction = viewPortInstructions[viewPortName];
              let child_nav_instruction = viewPortInstruction.childNavigationInstruction;
              if (child_nav_instruction) {
                  let childTitle = child_nav_instruction._buildTitle(separator);
                  if (childTitle) {
                      childTitles.push(childTitle);
                  }
              }
          }
          if (childTitles.length) {
              title = childTitles.join(separator) + (title ? separator : '') + title;
          }
          if (instructionRouter.title) {
              title += (title ? separator : '') + instructionRouter.transformTitle(instructionRouter.title);
          }
          return title;
      }
  }
  const prune = (instruction) => {
      instruction.previousInstruction = null;
      instruction.plan = null;
  };

  /**
  * Class for storing and interacting with a route's navigation settings.
  */
  class NavModel {
      constructor(router, relativeHref) {
          /**
          * True if this nav item is currently active.
          */
          this.isActive = false;
          /**
          * The title.
          */
          this.title = null;
          /**
          * This nav item's absolute href.
          */
          this.href = null;
          /**
          * This nav item's relative href.
          */
          this.relativeHref = null;
          /**
          * Data attached to the route at configuration time.
          */
          this.settings = {};
          /**
          * The route config.
          */
          this.config = null;
          this.router = router;
          this.relativeHref = relativeHref;
      }
      /**
      * Sets the route's title and updates document.title.
      *  If the a navigation is in progress, the change will be applied
      *  to document.title when the navigation completes.
      *
      * @param title The new title.
      */
      setTitle(title) {
          this.title = title;
          if (this.isActive) {
              this.router.updateTitle();
          }
      }
  }

  function _normalizeAbsolutePath(path, hasPushState, absolute = false) {
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
      let path = '';
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
      let routeConfigs = [];
      if (Array.isArray(config.route)) {
          for (let i = 0, ii = config.route.length; i < ii; ++i) {
              let current = Object.assign({}, config);
              current.route = config.route[i];
              routeConfigs.push(current);
          }
      }
      else {
          routeConfigs.push(Object.assign({}, config));
      }
      return routeConfigs;
  }
  const isRootedPath = /^#?\//;
  const isAbsoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;

  /**
   * Class used to configure a [[Router]] instance.
   *
   * @constructor
   */
  class RouterConfiguration {
      constructor() {
          this.instructions = [];
          this.options = {};
          this.pipelineSteps = [];
      }
      /**
       * Adds a step to be run during the [[Router]]'s navigation pipeline.
       *
       * @param name The name of the pipeline slot to insert the step into.
       * @param step The pipeline step.
       * @chainable
       */
      addPipelineStep(name, step) {
          if (step === null || step === undefined) {
              throw new Error('Pipeline step cannot be null or undefined.');
          }
          this.pipelineSteps.push({ name, step });
          return this;
      }
      /**
       * Adds a step to be run during the [[Router]]'s authorize pipeline slot.
       *
       * @param step The pipeline step.
       * @chainable
       */
      addAuthorizeStep(step) {
          return this.addPipelineStep("authorize" /* Authorize */, step);
      }
      /**
       * Adds a step to be run during the [[Router]]'s preActivate pipeline slot.
       *
       * @param step The pipeline step.
       * @chainable
       */
      addPreActivateStep(step) {
          return this.addPipelineStep("preActivate" /* PreActivate */, step);
      }
      /**
       * Adds a step to be run during the [[Router]]'s preRender pipeline slot.
       *
       * @param step The pipeline step.
       * @chainable
       */
      addPreRenderStep(step) {
          return this.addPipelineStep("preRender" /* PreRender */, step);
      }
      /**
       * Adds a step to be run during the [[Router]]'s postRender pipeline slot.
       *
       * @param step The pipeline step.
       * @chainable
       */
      addPostRenderStep(step) {
          return this.addPipelineStep("postRender" /* PostRender */, step);
      }
      /**
       * Configures a route that will be used if there is no previous location available on navigation cancellation.
       *
       * @param fragment The URL fragment to use as the navigation destination.
       * @chainable
       */
      fallbackRoute(fragment) {
          this._fallbackRoute = fragment;
          return this;
      }
      /**
       * Maps one or more routes to be registered with the router.
       *
       * @param route The [[RouteConfig]] to map, or an array of [[RouteConfig]] to map.
       * @chainable
       */
      map(route) {
          if (Array.isArray(route)) {
              route.forEach(r => this.map(r));
              return this;
          }
          return this.mapRoute(route);
      }
      /**
       * Configures defaults to use for any view ports.
       *
       * @param viewPortConfig a view port configuration object to use as a
       *  default, of the form { viewPortName: { moduleId } }.
       * @chainable
       */
      useViewPortDefaults(viewPortConfig) {
          this.viewPortDefaults = viewPortConfig;
          return this;
      }
      /**
       * Maps a single route to be registered with the router.
       *
       * @param route The [[RouteConfig]] to map.
       * @chainable
       */
      mapRoute(config) {
          this.instructions.push(router => {
              let routeConfigs = _ensureArrayWithSingleRoutePerConfig(config);
              let navModel;
              for (let i = 0, ii = routeConfigs.length; i < ii; ++i) {
                  let routeConfig = routeConfigs[i];
                  routeConfig.settings = routeConfig.settings || {};
                  if (!navModel) {
                      navModel = router.createNavModel(routeConfig);
                  }
                  router.addRoute(routeConfig, navModel);
              }
          });
          return this;
      }
      /**
       * Registers an unknown route handler to be run when the URL fragment doesn't match any registered routes.
       *
       * @param config A string containing a moduleId to load, or a [[RouteConfig]], or a function that takes the
       *  [[NavigationInstruction]] and selects a moduleId to load.
       * @chainable
       */
      mapUnknownRoutes(config) {
          this.unknownRouteConfig = config;
          return this;
      }
      /**
       * Applies the current configuration to the specified [[Router]].
       *
       * @param router The [[Router]] to apply the configuration to.
       */
      exportToRouter(router) {
          let instructions = this.instructions;
          for (let i = 0, ii = instructions.length; i < ii; ++i) {
              instructions[i](router);
          }
          let { title, titleSeparator, unknownRouteConfig, _fallbackRoute, viewPortDefaults } = this;
          if (title) {
              router.title = title;
          }
          if (titleSeparator) {
              router.titleSeparator = titleSeparator;
          }
          if (unknownRouteConfig) {
              router.handleUnknownRoutes(unknownRouteConfig);
          }
          if (_fallbackRoute) {
              router.fallbackRoute = _fallbackRoute;
          }
          if (viewPortDefaults) {
              router.useViewPortDefaults(viewPortDefaults);
          }
          Object.assign(router.options, this.options);
          let pipelineSteps = this.pipelineSteps;
          let pipelineStepCount = pipelineSteps.length;
          if (pipelineStepCount) {
              if (!router.isRoot) {
                  throw new Error('Pipeline steps can only be added to the root router');
              }
              let pipelineProvider = router.pipelineProvider;
              for (let i = 0, ii = pipelineStepCount; i < ii; ++i) {
                  let { name, step } = pipelineSteps[i];
                  pipelineProvider.addStep(name, step);
              }
          }
      }
  }

  /**
   * The primary class responsible for handling routing and navigation.
   */
  class Router {
      /**
       * @param container The [[Container]] to use when child routers.
       * @param history The [[History]] implementation to delegate navigation requests to.
       */
      constructor(container, history) {
          /**
           * The parent router, or null if this instance is not a child router.
           */
          this.parent = null;
          this.options = {};
          /**
           * The defaults used when a viewport lacks specified content
           */
          this.viewPortDefaults = {};
          /**
           * Extension point to transform the document title before it is built and displayed.
           * By default, child routers delegate to the parent router, and the app router
           * returns the title unchanged.
           */
          this.transformTitle = (title) => {
              if (this.parent) {
                  return this.parent.transformTitle(title);
              }
              return title;
          };
          this.container = container;
          this.history = history;
          this.reset();
      }
      /**
       * Fully resets the router's internal state. Primarily used internally by the framework when multiple calls to setRoot are made.
       * Use with caution (actually, avoid using this). Do not use this to simply change your navigation model.
       */
      reset() {
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
          this._recognizer = new RouteRecognizer();
          this._childRecognizer = new RouteRecognizer();
          this._configuredPromise = new Promise(resolve => {
              this._resolveConfiguredPromise = resolve;
          });
      }
      /**
       * Gets a value indicating whether or not this [[Router]] is the root in the router tree. I.e., it has no parent.
       */
      get isRoot() {
          return !this.parent;
      }
      /**
       * Registers a viewPort to be used as a rendering target for activated routes.
       *
       * @param viewPort The viewPort.
       * @param name The name of the viewPort. 'default' if unspecified.
       */
      registerViewPort(viewPort, name) {
          name = name || 'default';
          this.viewPorts[name] = viewPort;
      }
      /**
       * Returns a Promise that resolves when the router is configured.
       */
      ensureConfigured() {
          return this._configuredPromise;
      }
      /**
       * Configures the router.
       *
       * @param callbackOrConfig The [[RouterConfiguration]] or a callback that takes a [[RouterConfiguration]].
       */
      configure(callbackOrConfig) {
          this.isConfigured = true;
          let result = callbackOrConfig;
          let config;
          if (typeof callbackOrConfig === 'function') {
              config = new RouterConfiguration();
              result = callbackOrConfig(config);
          }
          return Promise
              .resolve(result)
              .then((c) => {
              if (c && c.exportToRouter) {
                  config = c;
              }
              config.exportToRouter(this);
              this.isConfigured = true;
              this._resolveConfiguredPromise();
          });
      }
      /**
       * Navigates to a new location.
       *
       * @param fragment The URL fragment to use as the navigation destination.
       * @param options The navigation options.
       */
      navigate(fragment, options) {
          if (!this.isConfigured && this.parent) {
              return this.parent.navigate(fragment, options);
          }
          this.isExplicitNavigation = true;
          return this.history.navigate(_resolveUrl(fragment, this.baseUrl, this.history._hasPushState), options);
      }
      /**
       * Navigates to a new location corresponding to the route and params specified. Equivallent to [[Router.generate]] followed
       * by [[Router.navigate]].
       *
       * @param route The name of the route to use when generating the navigation location.
       * @param params The route parameters to be used when populating the route pattern.
       * @param options The navigation options.
       */
      navigateToRoute(route, params, options) {
          let path = this.generate(route, params);
          return this.navigate(path, options);
      }
      /**
       * Navigates back to the most recent location in history.
       */
      navigateBack() {
          this.isExplicitNavigationBack = true;
          this.history.navigateBack();
      }
      /**
       * Creates a child router of the current router.
       *
       * @param container The [[Container]] to provide to the child router. Uses the current [[Router]]'s [[Container]] if unspecified.
       * @returns {Router} The new child Router.
       */
      createChild(container) {
          let childRouter = new Router(container || this.container.createChild(), this.history);
          childRouter.parent = this;
          return childRouter;
      }
      /**
       * Generates a URL fragment matching the specified route pattern.
       *
       * @param name The name of the route whose pattern should be used to generate the fragment.
       * @param params The route params to be used to populate the route pattern.
       * @param options If options.absolute = true, then absolute url will be generated; otherwise, it will be relative url.
       * @returns {string} A string containing the generated URL fragment.
       */
      generate(nameOrRoute, params = {}, options = {}) {
          // A child recognizer generates routes for potential child routes. Any potential child route is added
          // to the childRoute property of params for the childRouter to recognize. When generating routes, we
          // use the childRecognizer when childRoute params are available to generate a child router enabled route.
          let recognizer = 'childRoute' in params ? this._childRecognizer : this._recognizer;
          let hasRoute = recognizer.hasRoute(nameOrRoute);
          if (!hasRoute) {
              if (this.parent) {
                  return this.parent.generate(nameOrRoute, params, options);
              }
              throw new Error(`A route with name '${nameOrRoute}' could not be found. Check that \`name: '${nameOrRoute}'\` was specified in the route's config.`);
          }
          let path = recognizer.generate(nameOrRoute, params);
          let rootedPath = _createRootedPath(path, this.baseUrl, this.history._hasPushState, options.absolute);
          return options.absolute ? `${this.history.getAbsoluteRoot()}${rootedPath}` : rootedPath;
      }
      /**
       * Creates a [[NavModel]] for the specified route config.
       *
       * @param config The route config.
       */
      createNavModel(config) {
          let navModel = new NavModel(this, 'href' in config
              ? config.href
              // potential error when config.route is a string[] ?
              : config.route);
          navModel.title = config.title;
          navModel.order = config.nav;
          navModel.href = config.href;
          navModel.settings = config.settings;
          navModel.config = config;
          return navModel;
      }
      /**
       * Registers a new route with the router.
       *
       * @param config The [[RouteConfig]].
       * @param navModel The [[NavModel]] to use for the route. May be omitted for single-pattern routes.
       */
      addRoute(config, navModel) {
          if (Array.isArray(config.route)) {
              let routeConfigs = _ensureArrayWithSingleRoutePerConfig(config);
              // the following is wrong. todo: fix this after TS refactoring release
              routeConfigs.forEach(this.addRoute.bind(this));
              return;
          }
          validateRouteConfig(config);
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
          let path = config.route;
          if (path.charAt(0) === '/') {
              path = path.substr(1);
          }
          let caseSensitive = config.caseSensitive === true;
          let state = this._recognizer.add({
              path: path,
              handler: config,
              caseSensitive: caseSensitive
          });
          if (path) {
              let settings = config.settings;
              delete config.settings;
              let withChild = JSON.parse(JSON.stringify(config));
              config.settings = settings;
              withChild.route = `${path}/*childRoute`;
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
          let navigation = this.navigation;
          if ((navModel.order || navModel.order === 0) && navigation.indexOf(navModel) === -1) {
              if ((!navModel.href && navModel.href !== '') && (state.types.dynamics || state.types.stars)) {
                  throw new Error('Invalid route config for "' + config.route + '" : dynamic routes must specify an "href:" to be included in the navigation model.');
              }
              if (typeof navModel.order !== 'number') {
                  navModel.order = ++this._fallbackOrder;
              }
              navigation.push(navModel);
              // this is a potential error / inconsistency between browsers
              //
              // MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
              // If compareFunction(a, b) returns 0, leave a and b unchanged with respect to each other,
              // but sorted with respect to all different elements.
              // Note: the ECMAscript standard does not guarantee this behaviour,
              // and thus not all browsers (e.g. Mozilla versions dating back to at least 2003) respect this.
              navigation.sort((a, b) => a.order - b.order);
          }
      }
      /**
       * Gets a value indicating whether or not this [[Router]] or one of its ancestors has a route registered with the specified name.
       *
       * @param name The name of the route to check.
       */
      hasRoute(name) {
          return !!(this._recognizer.hasRoute(name) || this.parent && this.parent.hasRoute(name));
      }
      /**
       * Gets a value indicating whether or not this [[Router]] has a route registered with the specified name.
       *
       * @param name The name of the route to check.
       */
      hasOwnRoute(name) {
          return this._recognizer.hasRoute(name);
      }
      /**
       * Register a handler to use when the incoming URL fragment doesn't match any registered routes.
       *
       * @param config The moduleId, or a function that selects the moduleId, or a [[RouteConfig]].
       */
      handleUnknownRoutes(config) {
          if (!config) {
              throw new Error('Invalid unknown route handler');
          }
          this.catchAllHandler = instruction => {
              return this
                  ._createRouteConfig(config, instruction)
                  .then(c => {
                  instruction.config = c;
                  return instruction;
              });
          };
      }
      /**
       * Updates the document title using the current navigation instruction.
       */
      updateTitle() {
          let parentRouter = this.parent;
          if (parentRouter) {
              return parentRouter.updateTitle();
          }
          let currentInstruction = this.currentInstruction;
          if (currentInstruction) {
              currentInstruction._updateTitle();
          }
          return undefined;
      }
      /**
       * Updates the navigation routes with hrefs relative to the current location.
       * Note: This method will likely move to a plugin in a future release.
       */
      refreshNavigation() {
          let nav = this.navigation;
          for (let i = 0, length = nav.length; i < length; i++) {
              let current = nav[i];
              if (!current.config.href) {
                  current.href = _createRootedPath(current.relativeHref, this.baseUrl, this.history._hasPushState);
              }
              else {
                  current.href = _normalizeAbsolutePath(current.config.href, this.history._hasPushState);
              }
          }
      }
      /**
       * Sets the default configuration for the view ports. This specifies how to
       *  populate a view port for which no module is specified. The default is
       *  an empty view/view-model pair.
       */
      useViewPortDefaults($viewPortDefaults) {
          // a workaround to have strong typings while not requiring to expose interface ViewPortInstruction
          let viewPortDefaults = $viewPortDefaults;
          for (let viewPortName in viewPortDefaults) {
              let viewPortConfig = viewPortDefaults[viewPortName];
              this.viewPortDefaults[viewPortName] = {
                  moduleId: viewPortConfig.moduleId
              };
          }
      }
      /**@internal */
      _refreshBaseUrl() {
          let parentRouter = this.parent;
          if (parentRouter) {
              this.baseUrl = generateBaseUrl(parentRouter, parentRouter.currentInstruction);
          }
      }
      /**@internal */
      _createNavigationInstruction(url = '', parentInstruction = null) {
          let fragment = url;
          let queryString = '';
          let queryIndex = url.indexOf('?');
          if (queryIndex !== -1) {
              fragment = url.substr(0, queryIndex);
              queryString = url.substr(queryIndex + 1);
          }
          let urlRecognizationResults = this._recognizer.recognize(url);
          if (!urlRecognizationResults || !urlRecognizationResults.length) {
              urlRecognizationResults = this._childRecognizer.recognize(url);
          }
          let instructionInit = {
              fragment,
              queryString,
              config: null,
              parentInstruction,
              previousInstruction: this.currentInstruction,
              router: this,
              options: {
                  compareQueryParams: this.options.compareQueryParams
              }
          };
          let result;
          if (urlRecognizationResults && urlRecognizationResults.length) {
              let first = urlRecognizationResults[0];
              let instruction = new NavigationInstruction(Object.assign({}, instructionInit, {
                  params: first.params,
                  queryParams: first.queryParams || urlRecognizationResults.queryParams,
                  config: first.config || first.handler
              }));
              if (typeof first.handler === 'function') {
                  result = evaluateNavigationStrategy(instruction, first.handler, first);
              }
              else if (first.handler && typeof first.handler.navigationStrategy === 'function') {
                  result = evaluateNavigationStrategy(instruction, first.handler.navigationStrategy, first.handler);
              }
              else {
                  result = Promise.resolve(instruction);
              }
          }
          else if (this.catchAllHandler) {
              let instruction = new NavigationInstruction(Object.assign({}, instructionInit, {
                  params: { path: fragment },
                  queryParams: urlRecognizationResults ? urlRecognizationResults.queryParams : {},
                  config: null // config will be created by the catchAllHandler
              }));
              result = evaluateNavigationStrategy(instruction, this.catchAllHandler);
          }
          else if (this.parent) {
              let router = this._parentCatchAllHandler(this.parent);
              if (router) {
                  let newParentInstruction = this._findParentInstructionFromRouter(router, parentInstruction);
                  let instruction = new NavigationInstruction(Object.assign({}, instructionInit, {
                      params: { path: fragment },
                      queryParams: urlRecognizationResults ? urlRecognizationResults.queryParams : {},
                      router: router,
                      parentInstruction: newParentInstruction,
                      parentCatchHandler: true,
                      config: null // config will be created by the chained parent catchAllHandler
                  }));
                  result = evaluateNavigationStrategy(instruction, router.catchAllHandler);
              }
          }
          if (result && parentInstruction) {
              this.baseUrl = generateBaseUrl(this.parent, parentInstruction);
          }
          return result || Promise.reject(new Error(`Route not found: ${url}`));
      }
      /**@internal */
      _findParentInstructionFromRouter(router, instruction) {
          if (instruction.router === router) {
              instruction.fragment = router.baseUrl; // need to change the fragment in case of a redirect instead of moduleId
              return instruction;
          }
          else if (instruction.parentInstruction) {
              return this._findParentInstructionFromRouter(router, instruction.parentInstruction);
          }
          return undefined;
      }
      /**@internal */
      _parentCatchAllHandler(router) {
          if (router.catchAllHandler) {
              return router;
          }
          else if (router.parent) {
              return this._parentCatchAllHandler(router.parent);
          }
          return false;
      }
      /**
       * @internal
       */
      _createRouteConfig(config, instruction) {
          return Promise
              .resolve(config)
              .then((c) => {
              if (typeof c === 'string') {
                  return { moduleId: c };
              }
              else if (typeof c === 'function') {
                  return c(instruction);
              }
              return c;
          })
              // typing here could be either RouteConfig or RedirectConfig
              // but temporarily treat both as RouteConfig
              // todo: improve typings precision
              .then((c) => typeof c === 'string' ? { moduleId: c } : c)
              .then((c) => {
              c.route = instruction.params.path;
              validateRouteConfig(c);
              if (!c.navModel) {
                  c.navModel = this.createNavModel(c);
              }
              return c;
          });
      }
  }
  /* @internal exported for unit testing */
  const generateBaseUrl = (router, instruction) => {
      return `${router.baseUrl || ''}${instruction.getBaseUrl() || ''}`;
  };
  /* @internal exported for unit testing */
  const validateRouteConfig = (config) => {
      if (typeof config !== 'object') {
          throw new Error('Invalid Route Config');
      }
      if (typeof config.route !== 'string') {
          let name = config.name || '(no name)';
          throw new Error('Invalid Route Config for "' + name + '": You must specify a "route:" pattern.');
      }
      if (!('redirect' in config || config.moduleId || config.navigationStrategy || config.viewPorts)) {
          throw new Error('Invalid Route Config for "' + config.route + '": You must specify a "moduleId:", "redirect:", "navigationStrategy:", or "viewPorts:".');
      }
  };
  /* @internal exported for unit testing */
  const evaluateNavigationStrategy = (instruction, evaluator, context) => {
      return Promise
          .resolve(evaluator.call(context, instruction))
          .then(() => {
          if (!('viewPorts' in instruction.config)) {
              instruction.config.viewPorts = {
                  'default': {
                      moduleId: instruction.config.moduleId
                  }
              };
          }
          return instruction;
      });
  };

  /**@internal exported for unit testing */
  const createNextFn = (instruction, steps) => {
      let index = -1;
      const next = function () {
          index++;
          if (index < steps.length) {
              let currentStep = steps[index];
              try {
                  return currentStep(instruction, next);
              }
              catch (e) {
                  return next.reject(e);
              }
          }
          else {
              return next.complete();
          }
      };
      next.complete = createCompletionHandler(next, "completed" /* Completed */);
      next.cancel = createCompletionHandler(next, "canceled" /* Canceled */);
      next.reject = createCompletionHandler(next, "rejected" /* Rejected */);
      return next;
  };
  /**@internal exported for unit testing */
  const createCompletionHandler = (next, status) => {
      return (output) => Promise
          .resolve({
          status,
          output,
          completed: status === "completed" /* Completed */
      });
  };

  /**
   * The class responsible for managing and processing the navigation pipeline.
   */
  class Pipeline {
      constructor() {
          /**
           * The pipeline steps. And steps added via addStep will be converted to a function
           * The actualy running functions with correct step contexts of this pipeline
           */
          this.steps = [];
      }
      /**
       * Adds a step to the pipeline.
       *
       * @param step The pipeline step.
       */
      addStep(step) {
          let run;
          if (typeof step === 'function') {
              run = step;
          }
          else if (typeof step.getSteps === 'function') {
              // getSteps is to enable support open slots
              // where devs can add multiple steps into the same slot name
              let steps = step.getSteps();
              for (let i = 0, l = steps.length; i < l; i++) {
                  this.addStep(steps[i]);
              }
              return this;
          }
          else {
              run = step.run.bind(step);
          }
          this.steps.push(run);
          return this;
      }
      /**
       * Runs the pipeline.
       *
       * @param instruction The navigation instruction to process.
       */
      run(instruction) {
          const nextFn = createNextFn(instruction, this.steps);
          return nextFn();
      }
  }

  /**
  * Determines if the provided object is a navigation command.
  * A navigation command is anything with a navigate method.
  *
  * @param obj The object to check.
  */
  function isNavigationCommand(obj) {
      return obj && typeof obj.navigate === 'function';
  }
  /**
  * Used during the activation lifecycle to cause a redirect.
  */
  class Redirect {
      /**
       * @param url The URL fragment to use as the navigation destination.
       * @param options The navigation options.
       */
      constructor(url, options = {}) {
          this.url = url;
          this.options = Object.assign({ trigger: true, replace: true }, options);
          this.shouldContinueProcessing = false;
      }
      /**
       * Called by the activation system to set the child router.
       *
       * @param router The router.
       */
      setRouter(router) {
          this.router = router;
      }
      /**
       * Called by the navigation pipeline to navigate.
       *
       * @param appRouter The router to be redirected.
       */
      navigate(appRouter) {
          let navigatingRouter = this.options.useAppRouter ? appRouter : (this.router || appRouter);
          navigatingRouter.navigate(this.url, this.options);
      }
  }
  /**
   * Used during the activation lifecycle to cause a redirect to a named route.
   */
  class RedirectToRoute {
      /**
       * @param route The name of the route.
       * @param params The parameters to be sent to the activation method.
       * @param options The options to use for navigation.
       */
      constructor(route, params = {}, options = {}) {
          this.route = route;
          this.params = params;
          this.options = Object.assign({ trigger: true, replace: true }, options);
          this.shouldContinueProcessing = false;
      }
      /**
       * Called by the activation system to set the child router.
       *
       * @param router The router.
       */
      setRouter(router) {
          this.router = router;
      }
      /**
       * Called by the navigation pipeline to navigate.
       *
       * @param appRouter The router to be redirected.
       */
      navigate(appRouter) {
          let navigatingRouter = this.options.useAppRouter ? appRouter : (this.router || appRouter);
          navigatingRouter.navigateToRoute(this.route, this.params, this.options);
      }
  }

  /**
   * @internal exported for unit testing
   */
  function _buildNavigationPlan(instruction, forceLifecycleMinimum) {
      let config = instruction.config;
      if ('redirect' in config) {
          return buildRedirectPlan(instruction);
      }
      const prevInstruction = instruction.previousInstruction;
      const defaultViewPortConfigs = instruction.router.viewPortDefaults;
      if (prevInstruction) {
          return buildTransitionPlans(instruction, prevInstruction, defaultViewPortConfigs, forceLifecycleMinimum);
      }
      // first navigation, only need to prepare a few information for each viewport plan
      const viewPortPlans = {};
      let viewPortConfigs = config.viewPorts;
      for (let viewPortName in viewPortConfigs) {
          let viewPortConfig = viewPortConfigs[viewPortName];
          if (viewPortConfig.moduleId === null && viewPortName in defaultViewPortConfigs) {
              viewPortConfig = defaultViewPortConfigs[viewPortName];
          }
          viewPortPlans[viewPortName] = {
              name: viewPortName,
              strategy: "replace" /* Replace */,
              config: viewPortConfig
          };
      }
      return Promise.resolve(viewPortPlans);
  }
  /**
   * Build redirect plan based on config of a navigation instruction
   * @internal exported for unit testing
   */
  const buildRedirectPlan = (instruction) => {
      const config = instruction.config;
      const router = instruction.router;
      return router
          ._createNavigationInstruction(config.redirect)
          .then(redirectInstruction => {
          const params = {};
          const originalInstructionParams = instruction.params;
          const redirectInstructionParams = redirectInstruction.params;
          for (let key in redirectInstructionParams) {
              // If the param on the redirect points to another param, e.g. { route: first/:this, redirect: second/:this }
              let val = redirectInstructionParams[key];
              if (typeof val === 'string' && val[0] === ':') {
                  val = val.slice(1);
                  // And if that param is found on the original instruction then use it
                  if (val in originalInstructionParams) {
                      params[key] = originalInstructionParams[val];
                  }
              }
              else {
                  params[key] = redirectInstructionParams[key];
              }
          }
          let redirectLocation = router.generate(redirectInstruction.config, params, instruction.options);
          // Special handling for child routes
          for (let key in originalInstructionParams) {
              redirectLocation = redirectLocation.replace(`:${key}`, originalInstructionParams[key]);
          }
          let queryString = instruction.queryString;
          if (queryString) {
              redirectLocation += '?' + queryString;
          }
          return Promise.resolve(new Redirect(redirectLocation));
      });
  };
  /**
   * @param viewPortPlans the Plan record that holds information about built plans
   * @internal exported for unit testing
   */
  const buildTransitionPlans = (currentInstruction, previousInstruction, defaultViewPortConfigs, forceLifecycleMinimum) => {
      let viewPortPlans = {};
      let newInstructionConfig = currentInstruction.config;
      let hasNewParams = hasDifferentParameterValues(previousInstruction, currentInstruction);
      let pending = [];
      let previousViewPortInstructions = previousInstruction.viewPortInstructions;
      for (let viewPortName in previousViewPortInstructions) {
          const prevViewPortInstruction = previousViewPortInstructions[viewPortName];
          const prevViewPortComponent = prevViewPortInstruction.component;
          const newInstructionViewPortConfigs = newInstructionConfig.viewPorts;
          // if this is invoked on a viewport without any changes, based on new url,
          // newViewPortConfig will be the existing viewport instruction
          let nextViewPortConfig = viewPortName in newInstructionViewPortConfigs
              ? newInstructionViewPortConfigs[viewPortName]
              : prevViewPortInstruction;
          if (nextViewPortConfig.moduleId === null && viewPortName in defaultViewPortConfigs) {
              nextViewPortConfig = defaultViewPortConfigs[viewPortName];
          }
          const viewPortActivationStrategy = determineActivationStrategy(currentInstruction, prevViewPortInstruction, nextViewPortConfig, hasNewParams, forceLifecycleMinimum);
          const viewPortPlan = viewPortPlans[viewPortName] = {
              name: viewPortName,
              // ViewPortInstruction can quack like a RouteConfig
              config: nextViewPortConfig,
              prevComponent: prevViewPortComponent,
              prevModuleId: prevViewPortInstruction.moduleId,
              strategy: viewPortActivationStrategy
          };
          // recursively build nav plans for all existing child routers/viewports of this viewport
          // this is possible because existing child viewports and routers already have necessary information
          // to process the wildcard path from parent instruction
          if (viewPortActivationStrategy !== "replace" /* Replace */ && prevViewPortInstruction.childRouter) {
              const path = currentInstruction.getWildcardPath();
              const task = prevViewPortInstruction
                  .childRouter
                  ._createNavigationInstruction(path, currentInstruction)
                  .then((childInstruction) => {
                  viewPortPlan.childNavigationInstruction = childInstruction;
                  return _buildNavigationPlan(childInstruction, 
                  // is it safe to assume viewPortPlan has not been changed from previous assignment?
                  // if so, can just use local variable viewPortPlanStrategy
                  // there could be user code modifying viewport plan during _createNavigationInstruction?
                  viewPortPlan.strategy === "invoke-lifecycle" /* InvokeLifecycle */)
                      .then(childPlan => {
                      if (childPlan instanceof Redirect) {
                          return Promise.reject(childPlan);
                      }
                      childInstruction.plan = childPlan;
                      // for bluebird ?
                      return null;
                  });
              });
              pending.push(task);
          }
      }
      return Promise.all(pending).then(() => viewPortPlans);
  };
  /**
   * @param newViewPortConfig if this is invoked on a viewport without any changes, based on new url, newViewPortConfig will be the existing viewport instruction
   * @internal exported for unit testing
   */
  const determineActivationStrategy = (currentNavInstruction, prevViewPortInstruction, newViewPortConfig, 
  // indicates whether there is difference between old and new url params
  hasNewParams, forceLifecycleMinimum) => {
      let newInstructionConfig = currentNavInstruction.config;
      let prevViewPortViewModel = prevViewPortInstruction.component.viewModel;
      let viewPortPlanStrategy;
      if (prevViewPortInstruction.moduleId !== newViewPortConfig.moduleId) {
          viewPortPlanStrategy = "replace" /* Replace */;
      }
      else if ('determineActivationStrategy' in prevViewPortViewModel) {
          viewPortPlanStrategy = prevViewPortViewModel.determineActivationStrategy(...currentNavInstruction.lifecycleArgs);
      }
      else if (newInstructionConfig.activationStrategy) {
          viewPortPlanStrategy = newInstructionConfig.activationStrategy;
      }
      else if (hasNewParams || forceLifecycleMinimum) {
          viewPortPlanStrategy = "invoke-lifecycle" /* InvokeLifecycle */;
      }
      else {
          viewPortPlanStrategy = "no-change" /* NoChange */;
      }
      return viewPortPlanStrategy;
  };
  /**@internal exported for unit testing */
  const hasDifferentParameterValues = (prev, next) => {
      let prevParams = prev.params;
      let nextParams = next.params;
      let nextWildCardName = next.config.hasChildRouter ? next.getWildCardName() : null;
      for (let key in nextParams) {
          if (key === nextWildCardName) {
              continue;
          }
          if (prevParams[key] !== nextParams[key]) {
              return true;
          }
      }
      for (let key in prevParams) {
          if (key === nextWildCardName) {
              continue;
          }
          if (prevParams[key] !== nextParams[key]) {
              return true;
          }
      }
      if (!next.options.compareQueryParams) {
          return false;
      }
      let prevQueryParams = prev.queryParams;
      let nextQueryParams = next.queryParams;
      for (let key in nextQueryParams) {
          if (prevQueryParams[key] !== nextQueryParams[key]) {
              return true;
          }
      }
      for (let key in prevQueryParams) {
          if (prevQueryParams[key] !== nextQueryParams[key]) {
              return true;
          }
      }
      return false;
  };

  /**
   * Transform a navigation instruction into viewport plan record object,
   * or a redirect request if user viewmodel demands
   */
  class BuildNavigationPlanStep {
      run(navigationInstruction, next) {
          return _buildNavigationPlan(navigationInstruction)
              .then(plan => {
              if (plan instanceof Redirect) {
                  return next.cancel(plan);
              }
              navigationInstruction.plan = plan;
              return next();
          })
              .catch(next.cancel);
      }
  }

  /**
   * @internal Exported for unit testing
   */
  const loadNewRoute = (routeLoader, navigationInstruction) => {
      let loadingPlans = determineLoadingPlans(navigationInstruction);
      let loadPromises = loadingPlans.map((loadingPlan) => loadRoute(routeLoader, loadingPlan.navigationInstruction, loadingPlan.viewPortPlan));
      return Promise.all(loadPromises);
  };
  /**
   * @internal Exported for unit testing
   */
  const determineLoadingPlans = (navigationInstruction, loadingPlans = []) => {
      let viewPortPlans = navigationInstruction.plan;
      for (let viewPortName in viewPortPlans) {
          let viewPortPlan = viewPortPlans[viewPortName];
          let childNavInstruction = viewPortPlan.childNavigationInstruction;
          if (viewPortPlan.strategy === "replace" /* Replace */) {
              loadingPlans.push({ viewPortPlan, navigationInstruction });
              if (childNavInstruction) {
                  determineLoadingPlans(childNavInstruction, loadingPlans);
              }
          }
          else {
              let viewPortInstruction = navigationInstruction.addViewPortInstruction({
                  name: viewPortName,
                  strategy: viewPortPlan.strategy,
                  moduleId: viewPortPlan.prevModuleId,
                  component: viewPortPlan.prevComponent
              });
              if (childNavInstruction) {
                  viewPortInstruction.childNavigationInstruction = childNavInstruction;
                  determineLoadingPlans(childNavInstruction, loadingPlans);
              }
          }
      }
      return loadingPlans;
  };
  /**
   * @internal Exported for unit testing
   */
  const loadRoute = (routeLoader, navigationInstruction, viewPortPlan) => {
      let planConfig = viewPortPlan.config;
      let moduleId = planConfig ? planConfig.moduleId : null;
      return loadComponent(routeLoader, navigationInstruction, planConfig)
          .then((component) => {
          let viewPortInstruction = navigationInstruction.addViewPortInstruction({
              name: viewPortPlan.name,
              strategy: viewPortPlan.strategy,
              moduleId: moduleId,
              component: component
          });
          let childRouter = component.childRouter;
          if (childRouter) {
              let path = navigationInstruction.getWildcardPath();
              return childRouter
                  ._createNavigationInstruction(path, navigationInstruction)
                  .then((childInstruction) => {
                  viewPortPlan.childNavigationInstruction = childInstruction;
                  return _buildNavigationPlan(childInstruction)
                      .then((childPlan) => {
                      if (childPlan instanceof Redirect) {
                          return Promise.reject(childPlan);
                      }
                      childInstruction.plan = childPlan;
                      viewPortInstruction.childNavigationInstruction = childInstruction;
                      return loadNewRoute(routeLoader, childInstruction);
                  });
              });
          }
          // ts complains without this, though they are same
          return void 0;
      });
  };
  /**
   * Load a routed-component based on navigation instruction and route config
   * @internal exported for unit testing only
   */
  const loadComponent = (routeLoader, navigationInstruction, config) => {
      let router = navigationInstruction.router;
      let lifecycleArgs = navigationInstruction.lifecycleArgs;
      return Promise.resolve()
          .then(() => routeLoader.loadRoute(router, config, navigationInstruction))
          .then(
      /**
       * @param component an object carrying information about loaded route
       * typically contains information about view model, childContainer, view and router
       */
      (component) => {
          let { viewModel, childContainer } = component;
          component.router = router;
          component.config = config;
          if ('configureRouter' in viewModel) {
              let childRouter = childContainer.getChildRouter();
              component.childRouter = childRouter;
              return childRouter
                  .configure(c => viewModel.configureRouter(c, childRouter, lifecycleArgs[0], lifecycleArgs[1], lifecycleArgs[2]))
                  .then(() => component);
          }
          return component;
      });
  };

  /**
   * Abstract class that is responsible for loading view / view model from a route config
   * The default implementation can be found in `aurelia-templating-router`
   */
  class RouteLoader {
      /**
       * Load a route config based on its viewmodel / view configuration
       */
      // return typing: return typings used to be never
      // as it was a throw. Changing it to Promise<any> should not cause any issues
      loadRoute(router, config, navigationInstruction) {
          throw new Error('Route loaders must implement "loadRoute(router, config, navigationInstruction)".');
      }
  }

  /**
   * A pipeline step responsible for loading a route config of a navigation instruction
   */
  class LoadRouteStep {
      /**@internal */
      static inject() { return [RouteLoader]; }
      constructor(routeLoader) {
          this.routeLoader = routeLoader;
      }
      /**
       * Run the internal to load route config of a navigation instruction to prepare for next steps in the pipeline
       */
      run(navigationInstruction, next) {
          return loadNewRoute(this.routeLoader, navigationInstruction)
              .then(next, next.cancel);
      }
  }

  /**
   * A pipeline step for instructing a piepline to commit changes on a navigation instruction
   */
  class CommitChangesStep {
      run(navigationInstruction, next) {
          return navigationInstruction
              ._commitChanges(/*wait to swap?*/ true)
              .then(() => {
              navigationInstruction._updateTitle();
              return next();
          });
      }
  }

  /**
   * An optional interface describing the available activation strategies.
   * @internal Used internally.
   */
  var InternalActivationStrategy;
  (function (InternalActivationStrategy) {
      /**
       * Reuse the existing view model, without invoking Router lifecycle hooks.
       */
      InternalActivationStrategy["NoChange"] = "no-change";
      /**
       * Reuse the existing view model, invoking Router lifecycle hooks.
       */
      InternalActivationStrategy["InvokeLifecycle"] = "invoke-lifecycle";
      /**
       * Replace the existing view model, invoking Router lifecycle hooks.
       */
      InternalActivationStrategy["Replace"] = "replace";
  })(InternalActivationStrategy || (InternalActivationStrategy = {}));
  /**
   * The strategy to use when activating modules during navigation.
   */
  // kept for compat reason
  const activationStrategy = {
      noChange: "no-change" /* NoChange */,
      invokeLifecycle: "invoke-lifecycle" /* InvokeLifecycle */,
      replace: "replace" /* Replace */
  };

  /**
   * Recursively find list of deactivate-able view models
   * and invoke the either 'canDeactivate' or 'deactivate' on each
   * @internal exported for unit testing
   */
  const processDeactivatable = (navigationInstruction, callbackName, next, ignoreResult) => {
      let plan = navigationInstruction.plan;
      let infos = findDeactivatable(plan, callbackName);
      let i = infos.length; // query from inside out
      function inspect(val) {
          if (ignoreResult || shouldContinue(val)) {
              return iterate();
          }
          return next.cancel(val);
      }
      function iterate() {
          if (i--) {
              try {
                  let viewModel = infos[i];
                  let result = viewModel[callbackName](navigationInstruction);
                  return processPotential(result, inspect, next.cancel);
              }
              catch (error) {
                  return next.cancel(error);
              }
          }
          navigationInstruction.router.couldDeactivate = true;
          return next();
      }
      return iterate();
  };
  /**
   * Recursively find and returns a list of deactivate-able view models
   * @internal exported for unit testing
   */
  const findDeactivatable = (plan, callbackName, list = []) => {
      for (let viewPortName in plan) {
          let viewPortPlan = plan[viewPortName];
          let prevComponent = viewPortPlan.prevComponent;
          if ((viewPortPlan.strategy === activationStrategy.invokeLifecycle || viewPortPlan.strategy === activationStrategy.replace)
              && prevComponent) {
              let viewModel = prevComponent.viewModel;
              if (callbackName in viewModel) {
                  list.push(viewModel);
              }
          }
          if (viewPortPlan.strategy === activationStrategy.replace && prevComponent) {
              addPreviousDeactivatable(prevComponent, callbackName, list);
          }
          else if (viewPortPlan.childNavigationInstruction) {
              findDeactivatable(viewPortPlan.childNavigationInstruction.plan, callbackName, list);
          }
      }
      return list;
  };
  /**
   * @internal exported for unit testing
   */
  const addPreviousDeactivatable = (component, callbackName, list) => {
      let childRouter = component.childRouter;
      if (childRouter && childRouter.currentInstruction) {
          let viewPortInstructions = childRouter.currentInstruction.viewPortInstructions;
          for (let viewPortName in viewPortInstructions) {
              let viewPortInstruction = viewPortInstructions[viewPortName];
              let prevComponent = viewPortInstruction.component;
              let prevViewModel = prevComponent.viewModel;
              if (callbackName in prevViewModel) {
                  list.push(prevViewModel);
              }
              addPreviousDeactivatable(prevComponent, callbackName, list);
          }
      }
  };
  /**
   * @internal exported for unit testing
   */
  const processActivatable = (navigationInstruction, callbackName, next, ignoreResult) => {
      let infos = findActivatable(navigationInstruction, callbackName);
      let length = infos.length;
      let i = -1; // query from top down
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
                  let current = infos[i];
                  let result = current.viewModel[callbackName](...current.lifecycleArgs);
                  return processPotential(result, (val) => inspect(val, current.router), next.cancel);
              }
              catch (error) {
                  return next.cancel(error);
              }
          }
          return next();
      }
      return iterate();
  };
  /**
   * Find list of activatable view model and add to list (3rd parameter)
   * @internal exported for unit testing
   */
  const findActivatable = (navigationInstruction, callbackName, list = [], router) => {
      let plan = navigationInstruction.plan;
      Object
          .keys(plan)
          .forEach((viewPortName) => {
          let viewPortPlan = plan[viewPortName];
          let viewPortInstruction = navigationInstruction.viewPortInstructions[viewPortName];
          let viewPortComponent = viewPortInstruction.component;
          let viewModel = viewPortComponent.viewModel;
          if ((viewPortPlan.strategy === activationStrategy.invokeLifecycle
              || viewPortPlan.strategy === activationStrategy.replace)
              && callbackName in viewModel) {
              list.push({
                  viewModel,
                  lifecycleArgs: viewPortInstruction.lifecycleArgs,
                  router
              });
          }
          let childNavInstruction = viewPortPlan.childNavigationInstruction;
          if (childNavInstruction) {
              findActivatable(childNavInstruction, callbackName, list, viewPortComponent.childRouter || router);
          }
      });
      return list;
  };
  const shouldContinue = (output, router) => {
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
  };
  /**
   * wraps a subscription, allowing unsubscribe calls even if
   * the first value comes synchronously
   */
  class SafeSubscription {
      constructor(subscriptionFunc) {
          this._subscribed = true;
          this._subscription = subscriptionFunc(this);
          if (!this._subscribed) {
              this.unsubscribe();
          }
      }
      get subscribed() {
          return this._subscribed;
      }
      unsubscribe() {
          if (this._subscribed && this._subscription) {
              this._subscription.unsubscribe();
          }
          this._subscribed = false;
      }
  }
  /**
   * A function to process return value from `activate`/`canActivate` steps
   * Supports observable/promise
   *
   * For observable, resolve at first next() or on complete()
   */
  const processPotential = (obj, resolve, reject) => {
      // if promise like
      if (obj && typeof obj.then === 'function') {
          return Promise.resolve(obj).then(resolve).catch(reject);
      }
      // if observable
      if (obj && typeof obj.subscribe === 'function') {
          let obs = obj;
          return new SafeSubscription(sub => obs.subscribe({
              next() {
                  if (sub.subscribed) {
                      sub.unsubscribe();
                      resolve(obj);
                  }
              },
              error(error) {
                  if (sub.subscribed) {
                      sub.unsubscribe();
                      reject(error);
                  }
              },
              complete() {
                  if (sub.subscribed) {
                      sub.unsubscribe();
                      resolve(obj);
                  }
              }
          }));
      }
      // else just resolve
      try {
          return resolve(obj);
      }
      catch (error) {
          return reject(error);
      }
  };

  /**
   * A pipeline step responsible for finding and activating method `canDeactivate` on a view model of a route
   */
  class CanDeactivatePreviousStep {
      run(navigationInstruction, next) {
          return processDeactivatable(navigationInstruction, 'canDeactivate', next);
      }
  }
  /**
   * A pipeline step responsible for finding and activating method `canActivate` on a view model of a route
   */
  class CanActivateNextStep {
      run(navigationInstruction, next) {
          return processActivatable(navigationInstruction, 'canActivate', next);
      }
  }
  /**
   * A pipeline step responsible for finding and activating method `deactivate` on a view model of a route
   */
  class DeactivatePreviousStep {
      run(navigationInstruction, next) {
          return processDeactivatable(navigationInstruction, 'deactivate', next, true);
      }
  }
  /**
   * A pipeline step responsible for finding and activating method `activate` on a view model of a route
   */
  class ActivateNextStep {
      run(navigationInstruction, next) {
          return processActivatable(navigationInstruction, 'activate', next, true);
      }
  }

  /**
   * A multi-slots Pipeline Placeholder Step for hooking into a pipeline execution
   */
  class PipelineSlot {
      constructor(container, name, alias) {
          this.steps = [];
          this.container = container;
          this.slotName = name;
          this.slotAlias = alias;
      }
      getSteps() {
          return this.steps.map(x => this.container.get(x));
      }
  }
  /**
   * Class responsible for creating the navigation pipeline.
   */
  class PipelineProvider {
      /**@internal */
      static inject() { return [Container]; }
      constructor(container) {
          this.container = container;
          this.steps = [
              BuildNavigationPlanStep,
              CanDeactivatePreviousStep,
              LoadRouteStep,
              createPipelineSlot(container, "authorize" /* Authorize */),
              CanActivateNextStep,
              createPipelineSlot(container, "preActivate" /* PreActivate */, 'modelbind'),
              // NOTE: app state changes start below - point of no return
              DeactivatePreviousStep,
              ActivateNextStep,
              createPipelineSlot(container, "preRender" /* PreRender */, 'precommit'),
              CommitChangesStep,
              createPipelineSlot(container, "postRender" /* PostRender */, 'postcomplete')
          ];
      }
      /**
       * Create the navigation pipeline.
       */
      createPipeline(useCanDeactivateStep = true) {
          let pipeline = new Pipeline();
          this.steps.forEach(step => {
              if (useCanDeactivateStep || step !== CanDeactivatePreviousStep) {
                  pipeline.addStep(this.container.get(step));
              }
          });
          return pipeline;
      }
      /**@internal */
      _findStep(name) {
          // Steps that are not PipelineSlots are constructor functions, and they will automatically fail. Probably.
          return this.steps.find(x => x.slotName === name || x.slotAlias === name);
      }
      /**
       * Adds a step into the pipeline at a known slot location.
       */
      addStep(name, step) {
          let found = this._findStep(name);
          if (found) {
              let slotSteps = found.steps;
              // prevent duplicates
              if (!slotSteps.includes(step)) {
                  slotSteps.push(step);
              }
          }
          else {
              throw new Error(`Invalid pipeline slot name: ${name}.`);
          }
      }
      /**
       * Removes a step from a slot in the pipeline
       */
      removeStep(name, step) {
          let slot = this._findStep(name);
          if (slot) {
              let slotSteps = slot.steps;
              slotSteps.splice(slotSteps.indexOf(step), 1);
          }
      }
      /**
       * Clears all steps from a slot in the pipeline
       * @internal
       */
      _clearSteps(name = '') {
          let slot = this._findStep(name);
          if (slot) {
              slot.steps = [];
          }
      }
      /**
       * Resets all pipeline slots
       */
      reset() {
          this._clearSteps("authorize" /* Authorize */);
          this._clearSteps("preActivate" /* PreActivate */);
          this._clearSteps("preRender" /* PreRender */);
          this._clearSteps("postRender" /* PostRender */);
      }
  }
  /**@internal */
  const createPipelineSlot = (container, name, alias) => {
      return new PipelineSlot(container, name, alias);
  };

  const logger$4 = getLogger('app-router');
  /**
   * The main application router.
   */
  class AppRouter extends Router {
      /**@internal */
      static inject() { return [Container, History, PipelineProvider, EventAggregator]; }
      constructor(container, history, pipelineProvider, events) {
          super(container, history); // Note the super will call reset internally.
          this.pipelineProvider = pipelineProvider;
          this.events = events;
      }
      /**
       * Fully resets the router's internal state. Primarily used internally by the framework when multiple calls to setRoot are made.
       * Use with caution (actually, avoid using this). Do not use this to simply change your navigation model.
       */
      reset() {
          super.reset();
          this.maxInstructionCount = 10;
          if (!this._queue) {
              this._queue = [];
          }
          else {
              this._queue.length = 0;
          }
      }
      /**
       * Loads the specified URL.
       *
       * @param url The URL fragment to load.
       */
      loadUrl(url) {
          return this
              ._createNavigationInstruction(url)
              .then(instruction => this._queueInstruction(instruction))
              .catch(error => {
              logger$4.error(error);
              restorePreviousLocation(this);
          });
      }
      /**
       * Registers a viewPort to be used as a rendering target for activated routes.
       *
       * @param viewPort The viewPort. This is typically a <router-view/> element in Aurelia default impl
       * @param name The name of the viewPort. 'default' if unspecified.
       */
      registerViewPort(viewPort, name) {
          // having strong typing without changing public API
          const $viewPort = viewPort;
          super.registerViewPort($viewPort, name);
          // beside adding viewport to the registry of this instance
          // AppRouter also configure routing/history to start routing functionality
          // There are situation where there are more than 1 <router-view/> element at root view
          // in that case, still only activate once via the following guard
          if (!this.isActive) {
              const viewModel = this._findViewModel($viewPort);
              if ('configureRouter' in viewModel) {
                  // If there are more than one <router-view/> element at root view
                  // use this flag to guard against configure method being invoked multiple times
                  // this flag is set inside method configure
                  if (!this.isConfigured) {
                      // replace the real resolve with a noop to guarantee that any action in base class Router
                      // won't resolve the configurePromise prematurely
                      const resolveConfiguredPromise = this._resolveConfiguredPromise;
                      this._resolveConfiguredPromise = () => { };
                      return this
                          .configure(config => Promise
                          .resolve(viewModel.configureRouter(config, this))
                          // an issue with configure interface. Should be fixed there
                          // todo: fix this via configure interface in router
                          .then(() => config))
                          .then(() => {
                          this.activate();
                          resolveConfiguredPromise();
                      });
                  }
              }
              else {
                  this.activate();
              }
          }
          // when a viewport is added dynamically to a root view that is already activated
          // just process the navigation instruction
          else {
              this._dequeueInstruction();
          }
          return Promise.resolve();
      }
      /**
       * Activates the router. This instructs the router to begin listening for history changes and processing instructions.
       *
       * @params options The set of options to activate the router with.
       */
      activate(options) {
          if (this.isActive) {
              return;
          }
          this.isActive = true;
          // route handler property is responsible for handling url change
          // the interface of aurelia-history isn't clear on this perspective
          this.options = Object.assign({ routeHandler: this.loadUrl.bind(this) }, this.options, options);
          this.history.activate(this.options);
          this._dequeueInstruction();
      }
      /**
       * Deactivates the router.
       */
      deactivate() {
          this.isActive = false;
          this.history.deactivate();
      }
      /**@internal */
      _queueInstruction(instruction) {
          return new Promise((resolve) => {
              instruction.resolve = resolve;
              this._queue.unshift(instruction);
              this._dequeueInstruction();
          });
      }
      /**@internal */
      _dequeueInstruction(instructionCount = 0) {
          return Promise.resolve().then(() => {
              if (this.isNavigating && !instructionCount) {
                  // ts complains about inconsistent returns without void 0
                  return void 0;
              }
              let instruction = this._queue.shift();
              this._queue.length = 0;
              if (!instruction) {
                  // ts complains about inconsistent returns without void 0
                  return void 0;
              }
              this.isNavigating = true;
              let navtracker = this.history.getState('NavigationTracker');
              let currentNavTracker = this.currentNavigationTracker;
              if (!navtracker && !currentNavTracker) {
                  this.isNavigatingFirst = true;
                  this.isNavigatingNew = true;
              }
              else if (!navtracker) {
                  this.isNavigatingNew = true;
              }
              else if (!currentNavTracker) {
                  this.isNavigatingRefresh = true;
              }
              else if (currentNavTracker < navtracker) {
                  this.isNavigatingForward = true;
              }
              else if (currentNavTracker > navtracker) {
                  this.isNavigatingBack = true;
              }
              if (!navtracker) {
                  navtracker = Date.now();
                  this.history.setState('NavigationTracker', navtracker);
              }
              this.currentNavigationTracker = navtracker;
              instruction.previousInstruction = this.currentInstruction;
              let maxInstructionCount = this.maxInstructionCount;
              if (!instructionCount) {
                  this.events.publish("router:navigation:processing" /* Processing */, { instruction });
              }
              else if (instructionCount === maxInstructionCount - 1) {
                  logger$4.error(`${instructionCount + 1} navigation instructions have been attempted without success. Restoring last known good location.`);
                  restorePreviousLocation(this);
                  return this._dequeueInstruction(instructionCount + 1);
              }
              else if (instructionCount > maxInstructionCount) {
                  throw new Error('Maximum navigation attempts exceeded. Giving up.');
              }
              let pipeline = this.pipelineProvider.createPipeline(!this.couldDeactivate);
              return pipeline
                  .run(instruction)
                  .then(result => processResult(instruction, result, instructionCount, this))
                  .catch(error => {
                  return { output: error instanceof Error ? error : new Error(error) };
              })
                  .then(result => resolveInstruction(instruction, result, !!instructionCount, this));
          });
      }
      /**@internal */
      _findViewModel(viewPort) {
          if (this.container.viewModel) {
              return this.container.viewModel;
          }
          if (viewPort.container) {
              let container = viewPort.container;
              while (container) {
                  if (container.viewModel) {
                      this.container.viewModel = container.viewModel;
                      return container.viewModel;
                  }
                  container = container.parent;
              }
          }
          return undefined;
      }
  }
  const processResult = (instruction, result, instructionCount, router) => {
      if (!(result && 'completed' in result && 'output' in result)) {
          result = result || {};
          result.output = new Error(`Expected router pipeline to return a navigation result, but got [${JSON.stringify(result)}] instead.`);
      }
      let finalResult = null;
      let navigationCommandResult = null;
      if (isNavigationCommand(result.output)) {
          navigationCommandResult = result.output.navigate(router);
      }
      else {
          finalResult = result;
          if (!result.completed) {
              if (result.output instanceof Error) {
                  logger$4.error(result.output.toString());
              }
              restorePreviousLocation(router);
          }
      }
      return Promise.resolve(navigationCommandResult)
          .then(_ => router._dequeueInstruction(instructionCount + 1))
          .then(innerResult => finalResult || innerResult || result);
  };
  const resolveInstruction = (instruction, result, isInnerInstruction, router) => {
      instruction.resolve(result);
      let eventAggregator = router.events;
      let eventArgs = { instruction, result };
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
          let eventName;
          if (result.output instanceof Error) {
              eventName = "router:navigation:error" /* Error */;
          }
          else if (!result.completed) {
              eventName = "router:navigation:canceled" /* Canceled */;
          }
          else {
              let queryString = instruction.queryString ? ('?' + instruction.queryString) : '';
              router.history.previousLocation = instruction.fragment + queryString;
              eventName = "router:navigation:success" /* Success */;
          }
          eventAggregator.publish(eventName, eventArgs);
          eventAggregator.publish("router:navigation:complete" /* Complete */, eventArgs);
      }
      else {
          eventAggregator.publish("router:navigation:child:complete" /* ChildComplete */, eventArgs);
      }
      return result;
  };
  const restorePreviousLocation = (router) => {
      let previousLocation = router.history.previousLocation;
      if (previousLocation) {
          router.navigate(previousLocation, { trigger: false, replace: true });
      }
      else if (router.fallbackRoute) {
          router.navigate(router.fallbackRoute, { trigger: true, replace: true });
      }
      else {
          logger$4.error('Router navigation failed, and no previous location or fallbackRoute could be restored.');
      }
  };

  /**
  * The status of a Pipeline.
  */

  (function (PipelineStatus) {
      PipelineStatus["Completed"] = "completed";
      PipelineStatus["Canceled"] = "canceled";
      PipelineStatus["Rejected"] = "rejected";
      PipelineStatus["Running"] = "running";
  })(exports.PipelineStatus || (exports.PipelineStatus = {}));

  /**
   * A list of known router events used by the Aurelia router
   * to signal the pipeline has come to a certain state
   */
  // const enum is preserved in tsconfig
  var RouterEvent;
  (function (RouterEvent) {
      RouterEvent["Processing"] = "router:navigation:processing";
      RouterEvent["Error"] = "router:navigation:error";
      RouterEvent["Canceled"] = "router:navigation:canceled";
      RouterEvent["Complete"] = "router:navigation:complete";
      RouterEvent["Success"] = "router:navigation:success";
      RouterEvent["ChildComplete"] = "router:navigation:child:complete";
  })(RouterEvent || (RouterEvent = {}));

  /**
   * Available pipeline slot names to insert interceptor into router pipeline
   */
  // const enum is preserved in tsconfig
  var PipelineSlotName;
  (function (PipelineSlotName) {
      /**
       * Authorization slot. Invoked early in the pipeline,
       * before `canActivate` hook of incoming route
       */
      PipelineSlotName["Authorize"] = "authorize";
      /**
       * Pre-activation slot. Invoked early in the pipeline,
       * Invoked timing:
       *   - after Authorization slot
       *   - after canActivate hook on new view model
       *   - before deactivate hook on old view model
       *   - before activate hook on new view model
       */
      PipelineSlotName["PreActivate"] = "preActivate";
      /**
       * Pre-render slot. Invoked later in the pipeline
       * Invokcation timing:
       *   - after activate hook on new view model
       *   - before commit step on new navigation instruction
       */
      PipelineSlotName["PreRender"] = "preRender";
      /**
       * Post-render slot. Invoked last in the pipeline
       */
      PipelineSlotName["PostRender"] = "postRender";
  })(PipelineSlotName || (PipelineSlotName = {}));

  class EmptyLayoutViewModel {
  }
  /**
   * Implementation of Aurelia Router ViewPort. Responsible for loading route, composing and swapping routes views
   */
  class RouterView {
      constructor(element, container, viewSlot, router, viewLocator, compositionTransaction, compositionEngine) {
          this.element = element;
          this.container = container;
          this.viewSlot = viewSlot;
          this.router = router;
          this.viewLocator = viewLocator;
          this.compositionTransaction = compositionTransaction;
          this.compositionEngine = compositionEngine;
          // add this <router-view/> to router view ports lookup based on name attribute
          // when this router is the root router-view
          // also trigger AppRouter registerViewPort extra flow
          this.router.registerViewPort(this, this.element.getAttribute('name'));
          // Each <router-view/> process its instruction as a composition transaction
          // there are differences between intial composition and subsequent compositions
          // also there are differences between root composition and child <router-view/> composition
          // mark the first composition transaction with a property initialComposition to distinguish it
          // when the root <router-view/> gets new instruction for the first time
          if (!('initialComposition' in compositionTransaction)) {
              compositionTransaction.initialComposition = true;
              this.compositionTransactionNotifier = compositionTransaction.enlist();
          }
      }
      /**@internal */
      static inject() {
          return [DOM.Element, Container, ViewSlot, Router, ViewLocator, CompositionTransaction, CompositionEngine];
      }
      created(owningView) {
          this.owningView = owningView;
      }
      bind(bindingContext, overrideContext) {
          // router needs to get access to view model of current route parent
          // doing it in generic way via viewModel property on container
          this.container.viewModel = bindingContext;
          this.overrideContext = overrideContext;
      }
      /**
       * Implementation of `aurelia-router` ViewPort interface, responsible for templating related part in routing Pipeline
       */
      process($viewPortInstruction, waitToSwap) {
          // have strong typings without exposing it in public typings, this is to ensure maximum backward compat
          const viewPortInstruction = $viewPortInstruction;
          const component = viewPortInstruction.component;
          const childContainer = component.childContainer;
          const viewModel = component.viewModel;
          const viewModelResource = component.viewModelResource;
          const metadata = viewModelResource.metadata;
          const config = component.router.currentInstruction.config;
          const viewPortConfig = config.viewPorts ? (config.viewPorts[viewPortInstruction.name] || {}) : {};
          childContainer.get(RouterViewLocator)._notify(this);
          // layoutInstruction is our layout viewModel
          const layoutInstruction = {
              viewModel: viewPortConfig.layoutViewModel || config.layoutViewModel || this.layoutViewModel,
              view: viewPortConfig.layoutView || config.layoutView || this.layoutView,
              model: viewPortConfig.layoutModel || config.layoutModel || this.layoutModel,
              router: viewPortInstruction.component.router,
              childContainer: childContainer,
              viewSlot: this.viewSlot
          };
          // viewport will be a thin wrapper around composition engine
          // to process instruction/configuration from users
          // preparing all information related to a composition process
          // first by getting view strategy of a ViewPortComponent View
          const viewStrategy = this.viewLocator.getViewStrategy(component.view || viewModel);
          if (viewStrategy && component.view) {
              viewStrategy.makeRelativeTo(Origin.get(component.router.container.viewModel.constructor).moduleId);
          }
          // using metadata of a custom element view model to load appropriate view-factory instance
          return metadata
              .load(childContainer, viewModelResource.value, null, viewStrategy, true)
              // for custom element, viewFactory typing is always ViewFactory
              // for custom attribute, it will be HtmlBehaviorResource
              .then((viewFactory) => {
              // if this is not the first time that this <router-view/> is composing its instruction
              // try to capture ownership of the composition transaction
              // child <router-view/> will not be able to capture, since root <router-view/> typically captures
              // the ownership token
              if (!this.compositionTransactionNotifier) {
                  this.compositionTransactionOwnershipToken = this.compositionTransaction.tryCapture();
              }
              if (layoutInstruction.viewModel || layoutInstruction.view) {
                  viewPortInstruction.layoutInstruction = layoutInstruction;
              }
              const viewPortComponentBehaviorInstruction = BehaviorInstruction.dynamic(this.element, viewModel, viewFactory);
              viewPortInstruction.controller = metadata.create(childContainer, viewPortComponentBehaviorInstruction);
              if (waitToSwap) {
                  return null;
              }
              this.swap(viewPortInstruction);
          });
      }
      swap($viewPortInstruction) {
          // have strong typings without exposing it in public typings, this is to ensure maximum backward compat
          const viewPortInstruction = $viewPortInstruction;
          const viewPortController = viewPortInstruction.controller;
          const layoutInstruction = viewPortInstruction.layoutInstruction;
          const previousView = this.view;
          // Final step of swapping a <router-view/> ViewPortComponent
          const work = () => {
              const swapStrategy = SwapStrategies[this.swapOrder] || SwapStrategies.after;
              const viewSlot = this.viewSlot;
              swapStrategy(viewSlot, previousView, () => Promise.resolve(viewSlot.add(this.view))).then(() => {
                  this._notify();
              });
          };
          // Ensure all users setups have been completed
          const ready = (owningView_or_layoutView) => {
              viewPortController.automate(this.overrideContext, owningView_or_layoutView);
              const transactionOwnerShipToken = this.compositionTransactionOwnershipToken;
              // if this router-view is the root <router-view/> of a normal startup via aurelia.setRoot
              // attemp to take control of the transaction
              // if ownership can be taken
              // wait for transaction to complete before swapping
              if (transactionOwnerShipToken) {
                  return transactionOwnerShipToken
                      .waitForCompositionComplete()
                      .then(() => {
                      this.compositionTransactionOwnershipToken = null;
                      return work();
                  });
              }
              // otherwise, just swap
              return work();
          };
          // If there is layout instruction, new to compose layout before processing ViewPortComponent
          // layout controller/view/view-model is composed using composition engine APIs
          if (layoutInstruction) {
              if (!layoutInstruction.viewModel) {
                  // createController chokes if there's no viewmodel, so create a dummy one
                  // but avoid using a POJO as it creates unwanted metadata in Object constructor
                  layoutInstruction.viewModel = new EmptyLayoutViewModel();
              }
              // using composition engine to create compose layout
              return this.compositionEngine
                  // first create controller from layoutInstruction
                  // and treat it as CompositionContext
                  // then emulate slot projection with ViewPortComponent view
                  .createController(layoutInstruction)
                  .then((layoutController) => {
                  const layoutView = layoutController.view;
                  ShadowDOM.distributeView(viewPortController.view, layoutController.slots || layoutView.slots);
                  // when there is a layout
                  // view hierarchy is: <router-view/> owner view -> layout view -> ViewPortComponent view
                  layoutController.automate(createOverrideContext(layoutInstruction.viewModel), this.owningView);
                  layoutView.children.push(viewPortController.view);
                  return layoutView || layoutController;
              })
                  .then((newView) => {
                  this.view = newView;
                  return ready(newView);
              });
          }
          // if there is no layout, then get ViewPortComponent view ready as view property
          // and process controller/swapping
          // when there is no layout
          // view hierarchy is: <router-view/> owner view -> ViewPortComponent view
          this.view = viewPortController.view;
          return ready(this.owningView);
      }
      /**
       * Notify composition transaction that this router has finished processing
       * Happens when this <router-view/> is the root router-view
       * @internal
       */
      _notify() {
          const notifier = this.compositionTransactionNotifier;
          if (notifier) {
              notifier.done();
              this.compositionTransactionNotifier = null;
          }
      }
  }
  /**
   * @internal Actively avoid using decorator to reduce the amount of code generated
   *
   * There is no view to compose by default in a router view
   * This custom element is responsible for composing its own view, based on current config
   */
  RouterView.$view = null;
  /**
   * @internal Actively avoid using decorator to reduce the amount of code generated
   */
  RouterView.$resource = {
      name: 'router-view',
      bindables: ['swapOrder', 'layoutView', 'layoutViewModel', 'layoutModel', 'inherit-binding-context']
  };
  /**
  * Locator which finds the nearest RouterView, relative to the current dependency injection container.
  */
  class RouterViewLocator {
      /**
      * Creates an instance of the RouterViewLocator class.
      */
      constructor() {
          this.promise = new Promise((resolve) => this.resolve = resolve);
      }
      /**
      * Finds the nearest RouterView instance.
      * @returns A promise that will be resolved with the located RouterView instance.
      */
      findNearest() {
          return this.promise;
      }
      /**@internal */
      _notify(routerView) {
          this.resolve(routerView);
      }
  }

  /**@internal exported for unit testing */
  class EmptyClass {
  }
  inlineView('<template></template>')(EmptyClass);
  /**
   * Default implementation of `RouteLoader` used for loading component based on a route config
   */
  class TemplatingRouteLoader extends RouteLoader {
      constructor(compositionEngine) {
          super();
          this.compositionEngine = compositionEngine;
      }
      /**
       * Resolve a view model from a RouteConfig
       * Throws when there is neither "moduleId" nor "viewModel" property
       * @internal
       */
      resolveViewModel(router, config) {
          return new Promise((resolve, reject) => {
              let viewModel;
              if ('moduleId' in config) {
                  let moduleId = config.moduleId;
                  if (moduleId === null) {
                      viewModel = EmptyClass;
                  }
                  else {
                      // this requires container of router has passes a certain point
                      // where a view model has been setup on the container
                      // it will fail in enhance scenario because no viewport has been registered
                      moduleId = relativeToFile(moduleId, Origin.get(router.container.viewModel.constructor).moduleId);
                      if (/\.html/i.test(moduleId)) {
                          viewModel = createDynamicClass(moduleId);
                      }
                      else {
                          viewModel = moduleId;
                      }
                  }
                  return resolve(viewModel);
              }
              // todo: add if ('viewModel' in config) to support static view model resolution
              reject(new Error('Invalid route config. No "moduleId" found.'));
          });
      }
      /**
       * Create child container based on a router container
       * Also ensures that child router are properly constructed in the newly created child container
       * @internal
       */
      createChildContainer(router) {
          const childContainer = router.container.createChild();
          childContainer.registerSingleton(RouterViewLocator);
          childContainer.getChildRouter = function () {
              let childRouter;
              childContainer.registerHandler(Router, () => childRouter || (childRouter = router.createChild(childContainer)));
              return childContainer.get(Router);
          };
          return childContainer;
      }
      /**
       * Load corresponding component of a route config of a navigation instruction
       */
      loadRoute(router, config, _navInstruction) {
          return this
              .resolveViewModel(router, config)
              .then(viewModel => this.compositionEngine.ensureViewModel({
              viewModel: viewModel,
              childContainer: this.createChildContainer(router),
              view: config.view || config.viewStrategy,
              router: router
          }));
      }
  }
  /**@internal */
  TemplatingRouteLoader.inject = [CompositionEngine];
  /**@internal exported for unit testing */
  function createDynamicClass(moduleId) {
      const name = /([^\/^\?]+)\.html/i.exec(moduleId)[1];
      class DynamicClass {
          bind(bindingContext) {
              this.$parent = bindingContext;
          }
      }
      customElement(name)(DynamicClass);
      useView(moduleId)(DynamicClass);
      return DynamicClass;
  }

  const logger$5 = getLogger('route-href');
  /**
   * Helper custom attribute to help associate an element with a route by name
   */
  class RouteHref {
      constructor(router, element) {
          this.router = router;
          this.element = element;
          this.attribute = 'href';
      }
      /*@internal */
      static inject() {
          return [Router, DOM.Element];
      }
      bind() {
          this.isActive = true;
          this.processChange();
      }
      unbind() {
          this.isActive = false;
      }
      attributeChanged(value, previous) {
          if (previous) {
              this.element.removeAttribute(previous);
          }
          return this.processChange();
      }
      processChange() {
          return this.router
              .ensureConfigured()
              .then(() => {
              if (!this.isActive) {
                  // returning null to avoid Bluebird warning
                  return null;
              }
              const element = this.element;
              const href = this.router.generate(this.route, this.params);
              if (element.au.controller) {
                  element.au.controller.viewModel[this.attribute] = href;
              }
              else {
                  element.setAttribute(this.attribute, href);
              }
              // returning null to avoid Bluebird warning
              return null;
          })
              .catch((reason) => {
              logger$5.error(reason);
          });
      }
  }
  /**
   * @internal Actively avoid using decorator to reduce the amount of code generated
   */
  RouteHref.$resource = {
      type: 'attribute',
      name: 'route-href',
      bindables: [
          { name: 'route', changeHandler: 'processChange', primaryProperty: true },
          { name: 'params', changeHandler: 'processChange' },
          'attribute'
      ] // type definition of Aurelia templating is wrong
  };

  function configure$5(config) {
      config
          .singleton(RouteLoader, TemplatingRouteLoader)
          .singleton(Router, AppRouter)
          .globalResources(RouterView, RouteHref);
      config.container.registerAlias(Router, AppRouter);
  }

  let ConsoleAppender = class ConsoleAppender {
    debug(logger, ...rest) {
      console.debug(`DEBUG [${logger.id}]`, ...rest);
    }

    info(logger, ...rest) {
      console.info(`INFO [${logger.id}]`, ...rest);
    }

    warn(logger, ...rest) {
      console.warn(`WARN [${logger.id}]`, ...rest);
    }

    error(logger, ...rest) {
      console.error(`ERROR [${logger.id}]`, ...rest);
    }
  };

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
  };

  /**
   * Bootstrap a new Aurelia instance and start an application
   * @param {QuickStartOptions} options
   * @returns {Aurelia} the running Aurelia instance
   */
  function start(options = {}) {
    return createAndStart(options)
      .then(aurelia => aurelia.setRoot(options.root || 'app.js', options.host || document.body));
  }

  /**
   * Bootstrap a new Aurelia instance and start an application by enhancing a DOM tree
   * @param {QuickEnhanceOptions} options Configuration for enhancing a DOM tree
   * @returns {View} the enhanced View by selected options
   */
  function enhance(options = {}) {
    return createAndStart(options)
      .then(aurelia => {
        if (typeof options.root === 'function') {
          options.root = aurelia.container.get(options.root);
        }
        return aurelia.enhance(options.root || {}, options.host || document.body);
      });
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

  initialize();

  // Using static convention to avoid having to fetch / load module dynamically
  (frameworkCfgProto => {
    frameworkCfgProto.developmentLogging = function() {
      LogManager.addAppender(new ConsoleAppender());
      LogManager.setLevel(LogManager.logLevel.debug);
      return this;
    };

    frameworkCfgProto.defaultBindingLanguage = function() {
      return this.plugin(configure);
    };

    frameworkCfgProto.defaultResources = function() {
      return this.plugin(configure$2);
    };

    frameworkCfgProto.eventAggregator = function() {
      return this.plugin(configure$3);
    };

    frameworkCfgProto.history = function() {
      return this.plugin(configure$4);
    };

    frameworkCfgProto.router = function() {
      return this.plugin(configure$5);
    };
  })(FrameworkConfiguration.prototype);

  exports.AbstractRepeater = AbstractRepeater;
  exports.AccessKeyed = AccessKeyed;
  exports.AccessMember = AccessMember;
  exports.AccessScope = AccessScope;
  exports.AccessThis = AccessThis;
  exports.ActivateNextStep = ActivateNextStep;
  exports.AggregateError = AggregateError;
  exports.All = All;
  exports.Animator = Animator;
  exports.AppRouter = AppRouter;
  exports.ArrayRepeatStrategy = ArrayRepeatStrategy;
  exports.Assign = Assign;
  exports.AttrBindingBehavior = AttrBindingBehavior;
  exports.Aurelia = Aurelia;
  exports.BehaviorInstruction = BehaviorInstruction;
  exports.BehaviorPropertyObserver = BehaviorPropertyObserver;
  exports.Binary = Binary;
  exports.BindableProperty = BindableProperty;
  exports.Binding = Binding;
  exports.BindingBehavior = BindingBehavior;
  exports.BindingBehaviorResource = BindingBehaviorResource;
  exports.BindingEngine = BindingEngine;
  exports.BindingExpression = BindingExpression;
  exports.BindingLanguage = BindingLanguage;
  exports.BindingSignaler = BindingSignaler;
  exports.BoundViewFactory = BoundViewFactory;
  exports.BuildNavigationPlanStep = BuildNavigationPlanStep;
  exports.Call = Call;
  exports.CallExpression = CallExpression;
  exports.CallFunction = CallFunction;
  exports.CallMember = CallMember;
  exports.CallScope = CallScope;
  exports.CanActivateNextStep = CanActivateNextStep;
  exports.CanDeactivatePreviousStep = CanDeactivatePreviousStep;
  exports.CheckedObserver = CheckedObserver;
  exports.ClassObserver = ClassObserver;
  exports.CollectionLengthObserver = CollectionLengthObserver;
  exports.CommitChangesStep = CommitChangesStep;
  exports.Compose = Compose;
  exports.CompositionEngine = CompositionEngine;
  exports.CompositionTransaction = CompositionTransaction;
  exports.CompositionTransactionNotifier = CompositionTransactionNotifier;
  exports.CompositionTransactionOwnershipToken = CompositionTransactionOwnershipToken;
  exports.ComputedExpression = ComputedExpression;
  exports.Conditional = Conditional;
  exports.Container = Container;
  exports.Controller = Controller;
  exports.ConventionalViewStrategy = ConventionalViewStrategy;
  exports.DOM = DOM;
  exports.DataAttributeObserver = DataAttributeObserver;
  exports.DeactivatePreviousStep = DeactivatePreviousStep;
  exports.DebounceBindingBehavior = DebounceBindingBehavior;
  exports.DirtyCheckProperty = DirtyCheckProperty;
  exports.DirtyChecker = DirtyChecker;
  exports.ElementConfigResource = ElementConfigResource;
  exports.ElementEvents = ElementEvents;
  exports.Else = Else;
  exports.EventAggregator = EventAggregator;
  exports.EventManager = EventManager;
  exports.EventSubscriber = EventSubscriber;
  exports.Expression = Expression;
  exports.ExpressionCloner = ExpressionCloner;
  exports.ExpressionObserver = ExpressionObserver;
  exports.FEATURE = FEATURE;
  exports.Factory = Factory;
  exports.FactoryInvoker = FactoryInvoker;
  exports.Focus = Focus;
  exports.FrameworkConfiguration = FrameworkConfiguration;
  exports.FromViewBindingBehavior = FromViewBindingBehavior;
  exports.HTMLSanitizer = HTMLSanitizer;
  exports.Hide = Hide;
  exports.HtmlBehaviorResource = HtmlBehaviorResource;
  exports.If = If;
  exports.InlineViewStrategy = InlineViewStrategy;
  exports.InvocationHandler = InvocationHandler;
  exports.Lazy = Lazy;
  exports.Listener = Listener;
  exports.ListenerExpression = ListenerExpression;
  exports.LiteralArray = LiteralArray;
  exports.LiteralObject = LiteralObject;
  exports.LiteralPrimitive = LiteralPrimitive;
  exports.LiteralString = LiteralString;
  exports.LiteralTemplate = LiteralTemplate;
  exports.LoadRouteStep = LoadRouteStep;
  exports.Loader = Loader;
  exports.LogManager = LogManager;
  exports.MapRepeatStrategy = MapRepeatStrategy;
  exports.ModifyCollectionObserver = ModifyCollectionObserver;
  exports.ModuleAnalyzer = ModuleAnalyzer;
  exports.NameExpression = NameExpression;
  exports.NavModel = NavModel;
  exports.NavigationInstruction = NavigationInstruction;
  exports.NewInstance = NewInstance;
  exports.NoViewStrategy = NoViewStrategy;
  exports.NullRepeatStrategy = NullRepeatStrategy;
  exports.NumberRepeatStrategy = NumberRepeatStrategy;
  exports.ObjectObservationAdapter = ObjectObservationAdapter;
  exports.ObserverLocator = ObserverLocator;
  exports.OneTimeBindingBehavior = OneTimeBindingBehavior;
  exports.OneWayBindingBehavior = OneWayBindingBehavior;
  exports.Optional = Optional;
  exports.Origin = Origin;
  exports.PLATFORM = PLATFORM;
  exports.Parent = Parent;
  exports.Parser = Parser;
  exports.ParserImplementation = ParserImplementation;
  exports.PassThroughSlot = PassThroughSlot;
  exports.Pipeline = Pipeline;
  exports.PipelineProvider = PipelineProvider;
  exports.PrimitiveObserver = PrimitiveObserver;
  exports.Redirect = Redirect;
  exports.RedirectToRoute = RedirectToRoute;
  exports.RelativeViewStrategy = RelativeViewStrategy;
  exports.Repeat = Repeat;
  exports.RepeatStrategyLocator = RepeatStrategyLocator;
  exports.Replaceable = Replaceable;
  exports.ResourceDescription = ResourceDescription;
  exports.ResourceLoadContext = ResourceLoadContext;
  exports.ResourceModule = ResourceModule;
  exports.RouteLoader = RouteLoader;
  exports.Router = Router;
  exports.RouterConfiguration = RouterConfiguration;
  exports.SVGAnalyzer = SVGAnalyzer;
  exports.SanitizeHTMLValueConverter = SanitizeHTMLValueConverter;
  exports.SelectValueObserver = SelectValueObserver;
  exports.SelfBindingBehavior = SelfBindingBehavior;
  exports.SetRepeatStrategy = SetRepeatStrategy;
  exports.SetterObserver = SetterObserver;
  exports.ShadowDOM = ShadowDOM;
  exports.ShadowSlot = ShadowSlot;
  exports.Show = Show;
  exports.SignalBindingBehavior = SignalBindingBehavior;
  exports.SingletonRegistration = SingletonRegistration;
  exports.SlotCustomAttribute = SlotCustomAttribute;
  exports.StaticViewStrategy = StaticViewStrategy;
  exports.StrategyResolver = StrategyResolver;
  exports.StyleObserver = StyleObserver;
  exports.SwapStrategies = SwapStrategies;
  exports.TargetInstruction = TargetInstruction;
  exports.TaskQueue = TaskQueue;
  exports.TemplateDependency = TemplateDependency;
  exports.TemplateRegistryEntry = TemplateRegistryEntry;
  exports.TemplateRegistryViewStrategy = TemplateRegistryViewStrategy;
  exports.TemplatingEngine = TemplatingEngine;
  exports.ThrottleBindingBehavior = ThrottleBindingBehavior;
  exports.ToViewBindingBehavior = ToViewBindingBehavior;
  exports.TransientRegistration = TransientRegistration;
  exports.TwoWayBindingBehavior = TwoWayBindingBehavior;
  exports.Unary = Unary;
  exports.UpdateTriggerBindingBehavior = UpdateTriggerBindingBehavior;
  exports.ValueAttributeObserver = ValueAttributeObserver;
  exports.ValueConverter = ValueConverter;
  exports.ValueConverterResource = ValueConverterResource;
  exports.View = View;
  exports.ViewCompileInstruction = ViewCompileInstruction;
  exports.ViewCompiler = ViewCompiler;
  exports.ViewEngine = ViewEngine;
  exports.ViewEngineHooksResource = ViewEngineHooksResource;
  exports.ViewFactory = ViewFactory;
  exports.ViewLocator = ViewLocator;
  exports.ViewResources = ViewResources;
  exports.ViewSlot = ViewSlot;
  exports.With = With;
  exports.XLinkAttributeObserver = XLinkAttributeObserver;
  exports._emptyParameters = _emptyParameters;
  exports._hyphenate = _hyphenate;
  exports._isAllWhitespace = _isAllWhitespace;
  exports.activationStrategy = activationStrategy;
  exports.all = all;
  exports.animationEvent = animationEvent;
  exports.autoinject = autoinject;
  exports.behavior = behavior;
  exports.bindable = bindable;
  exports.bindingBehavior = bindingBehavior;
  exports.bindingMode = bindingMode;
  exports.buildQueryString = buildQueryString;
  exports.calcSplices = calcSplices;
  exports.camelCase = camelCase;
  exports.child = child;
  exports.children = children;
  exports.cloneExpression = cloneExpression;
  exports.computedFrom = computedFrom;
  exports.connectBindingToSignal = connectBindingToSignal;
  exports.connectable = connectable;
  exports.containerless = containerless;
  exports.createComputedObserver = createComputedObserver;
  exports.createFullOverrideContext = createFullOverrideContext;
  exports.createOverrideContext = createOverrideContext;
  exports.createScopeForTest = createScopeForTest;
  exports.customAttribute = customAttribute;
  exports.customElement = customElement;
  exports.dataAttributeAccessor = dataAttributeAccessor;
  exports.declarePropertyDependencies = declarePropertyDependencies;
  exports.decorators = decorators;
  exports.delegationStrategy = delegationStrategy;
  exports.deprecated = deprecated;
  exports.disableConnectQueue = disableConnectQueue;
  exports.dynamicOptions = dynamicOptions;
  exports.elementConfig = elementConfig;
  exports.elements = elements;
  exports.enableConnectQueue = enableConnectQueue;
  exports.enhance = enhance;
  exports.enqueueBindingConnect = enqueueBindingConnect;
  exports.factory = factory;
  exports.getArrayObserver = getArrayObserver;
  exports.getChangeRecords = getChangeRecords;
  exports.getConnectQueueSize = getConnectQueueSize;
  exports.getContextFor = getContextFor;
  exports.getDecoratorDependencies = getDecoratorDependencies;
  exports.getItemsSourceExpression = getItemsSourceExpression;
  exports.getMapObserver = getMapObserver;
  exports.getSetObserver = getSetObserver;
  exports.hasDeclaredDependencies = hasDeclaredDependencies;
  exports.includeEventsIn = includeEventsIn;
  exports.initializePAL = initializePAL;
  exports.inject = inject;
  exports.inlineView = inlineView;
  exports.invokeAsFactory = invokeAsFactory;
  exports.invoker = invoker;
  exports.isNavigationCommand = isNavigationCommand;
  exports.isOneTime = isOneTime;
  exports.join = join;
  exports.lazy = lazy;
  exports.mergeSplice = mergeSplice;
  exports.metadata = metadata;
  exports.mixin = mixin;
  exports.newInstance = newInstance;
  exports.noView = noView;
  exports.observable = observable;
  exports.optional = optional;
  exports.parent = parent;
  exports.parseQueryString = parseQueryString;
  exports.presentationAttributes = presentationAttributes;
  exports.presentationElements = presentationElements;
  exports.processAttributes = processAttributes;
  exports.processContent = processContent;
  exports.projectArraySplices = projectArraySplices;
  exports.propertyAccessor = propertyAccessor;
  exports.protocol = protocol;
  exports.registration = registration;
  exports.relativeToFile = relativeToFile;
  exports.reset = reset;
  exports.resolver = resolver;
  exports.resource = resource;
  exports.setConnectQueueThreshold = setConnectQueueThreshold;
  exports.signalBindings = signalBindings;
  exports.singleton = singleton;
  exports.sourceContext = sourceContext;
  exports.start = start;
  exports.subscriberCollection = subscriberCollection;
  exports.targetContext = targetContext;
  exports.templateController = templateController;
  exports.transient = transient;
  exports.unwrapExpression = unwrapExpression;
  exports.updateOneTimeBinding = updateOneTimeBinding;
  exports.updateOverrideContext = updateOverrideContext;
  exports.useShadowDOM = useShadowDOM;
  exports.useView = useView;
  exports.useViewStrategy = useViewStrategy;
  exports.validateBehaviorName = validateBehaviorName;
  exports.valueConverter = valueConverter;
  exports.view = view;
  exports.viewEngineHooks = viewEngineHooks;
  exports.viewResources = viewResources;
  exports.viewStrategy = viewStrategy;
  exports.viewsRequireLifecycle = viewsRequireLifecycle;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
