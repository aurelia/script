(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.au = {}));
}(this, function (exports) { 'use strict';

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function AggregateError(message, innerError, skipIfAlreadyAggregate) {
    if (innerError) {
      if (innerError.innerError && skipIfAlreadyAggregate) {
        return innerError;
      }

      var separator = '\n------------------------------------------------\n';
      message += separator + "Inner Error:\n";

      if (typeof innerError === 'string') {
        message += "Message: " + innerError;
      } else {
        if (innerError.message) {
          message += "Message: " + innerError.message;
        } else {
          message += "Unknown Inner Error Type. Displaying Inner Error as JSON:\n " + JSON.stringify(innerError, null, '  ');
        }

        if (innerError.stack) {
          message += "\nInner Error Stack:\n" + innerError.stack;
          message += '\nEnd Inner Error Stack';
        }
      }

      message += separator;
    }

    var e = new Error(message);

    if (innerError) {
      e.innerError = innerError;
    }

    return e;
  }
  var FEATURE = {};
  var PLATFORM = {
    noop: function noop() {},
    eachModule: function eachModule() {},
    moduleName: function moduleName(_moduleName) {
      return _moduleName;
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

  var DOM = {};
  exports.isInitialized = false;
  function initializePAL(callback) {
    if (exports.isInitialized) {
      return;
    }

    exports.isInitialized = true;

    if (typeof Object.getPropertyDescriptor !== 'function') {
      Object.getPropertyDescriptor = function (subject, name) {
        var pd = Object.getOwnPropertyDescriptor(subject, name);
        var proto = Object.getPrototypeOf(subject);

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

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  if (typeof FEATURE_NO_ES2015 === 'undefined') {
    (function (Object, GOPS) {

      if (GOPS in Object) return;

      var setDescriptor,
          G = PLATFORM.global,
          id = 0,
          random = '' + Math.random(),
          prefix = '__\x01symbol:',
          prefixLength = prefix.length,
          internalSymbol = '__\x01symbol@@' + random,
          DP = 'defineProperty',
          DPies = 'defineProperties',
          GOPN = 'getOwnPropertyNames',
          GOPD = 'getOwnPropertyDescriptor',
          PIE = 'propertyIsEnumerable',
          gOPN = Object[GOPN],
          gOPD = Object[GOPD],
          create = Object.create,
          keys = Object.keys,
          defineProperty = Object[DP],
          $defineProperties = Object[DPies],
          descriptor = gOPD(Object, GOPN),
          ObjectProto = Object.prototype,
          hOP = ObjectProto.hasOwnProperty,
          pIE = ObjectProto[PIE],
          toString = ObjectProto.toString,
          addInternalIfNeeded = function addInternalIfNeeded(o, uid, enumerable) {
        if (!hOP.call(o, internalSymbol)) {
          defineProperty(o, internalSymbol, {
            enumerable: false,
            configurable: false,
            writable: false,
            value: {}
          });
        }

        o[internalSymbol]['@@' + uid] = enumerable;
      },
          createWithSymbols = function createWithSymbols(proto, descriptors) {
        var self = create(proto);

        if (descriptors !== null && (typeof descriptors === 'undefined' ? 'undefined' : _typeof(descriptors)) === 'object') {
          gOPN(descriptors).forEach(function (key) {
            if (propertyIsEnumerable.call(descriptors, key)) {
              $defineProperty(self, key, descriptors[key]);
            }
          });
        }

        return self;
      },
          copyAsNonEnumerable = function copyAsNonEnumerable(descriptor) {
        var newDescriptor = create(descriptor);
        newDescriptor.enumerable = false;
        return newDescriptor;
      },
          get = function get() {},
          onlyNonSymbols = function onlyNonSymbols(name) {
        return name != internalSymbol && !hOP.call(source, name);
      },
          onlySymbols = function onlySymbols(name) {
        return name != internalSymbol && hOP.call(source, name);
      },
          propertyIsEnumerable = function propertyIsEnumerable(key) {
        var uid = '' + key;
        return onlySymbols(uid) ? hOP.call(this, uid) && this[internalSymbol] && this[internalSymbol]['@@' + uid] : pIE.call(this, key);
      },
          setAndGetSymbol = function setAndGetSymbol(uid) {
        var descriptor = {
          enumerable: false,
          configurable: true,
          get: get,
          set: function set(value) {
            setDescriptor(this, uid, {
              enumerable: false,
              configurable: true,
              writable: true,
              value: value
            });
            addInternalIfNeeded(this, uid, true);
          }
        };
        defineProperty(ObjectProto, uid, descriptor);
        return source[uid] = defineProperty(Object(uid), 'constructor', sourceConstructor);
      },
          _Symbol = function _Symbol2(description) {
        if (this && this !== G) {
          throw new TypeError('Symbol is not a constructor');
        }

        return setAndGetSymbol(prefix.concat(description || '', random, ++id));
      },
          source = create(null),
          sourceConstructor = {
        value: _Symbol
      },
          sourceMap = function sourceMap(uid) {
        return source[uid];
      },
          $defineProperty = function defineProp(o, key, descriptor) {
        var uid = '' + key;

        if (onlySymbols(uid)) {
          setDescriptor(o, uid, descriptor.enumerable ? copyAsNonEnumerable(descriptor) : descriptor);
          addInternalIfNeeded(o, uid, !!descriptor.enumerable);
        } else {
          defineProperty(o, key, descriptor);
        }

        return o;
      },
          $getOwnPropertySymbols = function getOwnPropertySymbols(o) {
        var cof = toString.call(o);
        o = cof === '[object String]' ? o.split('') : Object(o);
        return gOPN(o).filter(onlySymbols).map(sourceMap);
      };

      descriptor.value = $defineProperty;
      defineProperty(Object, DP, descriptor);
      descriptor.value = $getOwnPropertySymbols;
      defineProperty(Object, GOPS, descriptor);
      var cachedWindowNames = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' ? Object.getOwnPropertyNames(window) : [];
      var originalObjectGetOwnPropertyNames = Object.getOwnPropertyNames;

      descriptor.value = function getOwnPropertyNames(o) {
        if (toString.call(o) === '[object Window]') {
          try {
            return originalObjectGetOwnPropertyNames(o);
          } catch (e) {
            return [].concat([], cachedWindowNames);
          }
        }

        return gOPN(o).filter(onlyNonSymbols);
      };

      defineProperty(Object, GOPN, descriptor);

      descriptor.value = function defineProperties(o, descriptors) {
        var symbols = $getOwnPropertySymbols(descriptors);

        if (symbols.length) {
          keys(descriptors).concat(symbols).forEach(function (uid) {
            if (propertyIsEnumerable.call(descriptors, uid)) {
              $defineProperty(o, uid, descriptors[uid]);
            }
          });
        } else {
          $defineProperties(o, descriptors);
        }

        return o;
      };

      defineProperty(Object, DPies, descriptor);
      descriptor.value = propertyIsEnumerable;
      defineProperty(ObjectProto, PIE, descriptor);
      descriptor.value = _Symbol;
      defineProperty(G, 'Symbol', descriptor);

      descriptor.value = function (key) {
        var uid = prefix.concat(prefix, key, random);
        return uid in ObjectProto ? source[uid] : setAndGetSymbol(uid);
      };

      defineProperty(_Symbol, 'for', descriptor);

      descriptor.value = function (symbol) {
        return hOP.call(source, symbol) ? symbol.slice(prefixLength * 2, -random.length) : void 0;
      };

      defineProperty(_Symbol, 'keyFor', descriptor);

      descriptor.value = function getOwnPropertyDescriptor(o, key) {
        var descriptor = gOPD(o, key);

        if (descriptor && onlySymbols(key)) {
          descriptor.enumerable = propertyIsEnumerable.call(o, key);
        }

        return descriptor;
      };

      defineProperty(Object, GOPD, descriptor);

      descriptor.value = function (proto, descriptors) {
        return arguments.length === 1 ? create(proto) : createWithSymbols(proto, descriptors);
      };

      defineProperty(Object, 'create', descriptor);

      descriptor.value = function () {
        var str = toString.call(this);
        return str === '[object String]' && onlySymbols(this) ? '[object Symbol]' : str;
      };

      defineProperty(ObjectProto, 'toString', descriptor);

      try {
        setDescriptor = create(defineProperty({}, prefix, {
          get: function get() {
            return defineProperty(this, prefix, {
              value: false
            })[prefix];
          }
        }))[prefix] || defineProperty;
      } catch (o_O) {
        setDescriptor = function setDescriptor(o, key, descriptor) {
          var protoDescriptor = gOPD(ObjectProto, key);
          delete ObjectProto[key];
          defineProperty(o, key, descriptor);
          defineProperty(ObjectProto, key, protoDescriptor);
        };
      }
    })(Object, 'getOwnPropertySymbols');

    (function (O, S) {
      var dP = O.defineProperty,
          ObjectProto = O.prototype,
          toString = ObjectProto.toString,
          toStringTag = 'toStringTag',
          descriptor;
      ['iterator', 'match', 'replace', 'search', 'split', 'hasInstance', 'isConcatSpreadable', 'unscopables', 'species', 'toPrimitive', toStringTag].forEach(function (name) {
        if (!(name in Symbol)) {
          dP(Symbol, name, {
            value: Symbol(name)
          });

          switch (name) {
            case toStringTag:
              descriptor = O.getOwnPropertyDescriptor(ObjectProto, 'toString');

              descriptor.value = function () {
                var str = toString.call(this),
                    tst = typeof this === 'undefined' || this === null ? undefined : this[Symbol.toStringTag];
                return typeof tst === 'undefined' ? str : '[object ' + tst + ']';
              };

              dP(ObjectProto, 'toString', descriptor);
              break;
          }
        }
      });
    })(Object);

    (function (Si, AP, SP) {
      function returnThis() {
        return this;
      }

      if (!AP[Si]) AP[Si] = function () {
        var i = 0,
            self = this,
            iterator = {
          next: function next() {
            var done = self.length <= i;
            return done ? {
              done: done
            } : {
              done: done,
              value: self[i++]
            };
          }
        };
        iterator[Si] = returnThis;
        return iterator;
      };
      if (!SP[Si]) SP[Si] = function () {
        var fromCodePoint = String.fromCodePoint,
            self = this,
            i = 0,
            length = self.length,
            iterator = {
          next: function next() {
            var done = length <= i,
                c = done ? '' : fromCodePoint(self.codePointAt(i));
            i += c.length;
            return done ? {
              done: done
            } : {
              done: done,
              value: c
            };
          }
        };
        iterator[Si] = returnThis;
        return iterator;
      };
    })(Symbol.iterator, Array.prototype, String.prototype);
  }

  if (typeof FEATURE_NO_ES2015 === 'undefined') {
    Number.isNaN = Number.isNaN || function (value) {
      return value !== value;
    };

    Number.isFinite = Number.isFinite || function (value) {
      return typeof value === "number" && isFinite(value);
    };
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

  if (typeof FEATURE_NO_ES2015 === 'undefined') {
    if (!Array.from) {
      Array.from = function () {
        var toInteger = function toInteger(it) {
          return isNaN(it = +it) ? 0 : (it > 0 ? Math.floor : Math.ceil)(it);
        };

        var toLength = function toLength(it) {
          return it > 0 ? Math.min(toInteger(it), 0x1fffffffffffff) : 0;
        };

        var iterCall = function iterCall(iter, fn, val, index) {
          try {
            return fn(val, index);
          } catch (E) {
            if (typeof iter["return"] == 'function') iter["return"]();
            throw E;
          }
        };

        return function from(arrayLike) {
          var O = Object(arrayLike),
              C = typeof this == 'function' ? this : Array,
              aLen = arguments.length,
              mapfn = aLen > 1 ? arguments[1] : undefined,
              mapping = mapfn !== undefined,
              index = 0,
              iterFn = O[Symbol.iterator],
              length,
              result,
              step,
              iterator;
          if (mapping) mapfn = mapfn.bind(aLen > 2 ? arguments[2] : undefined);

          if (iterFn != undefined && !Array.isArray(arrayLike)) {
            for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
              result[index] = mapping ? iterCall(iterator, mapfn, step.value, index) : step.value;
            }
          } else {
            length = toLength(O.length);

            for (result = new C(length); length > index; index++) {
              result[index] = mapping ? mapfn(O[index], index) : O[index];
            }
          }

          result.length = index;
          return result;
        };
      }();
    }

    if (!Array.prototype.find) {
      Object.defineProperty(Array.prototype, 'find', {
        configurable: true,
        writable: true,
        enumerable: false,
        value: function value(predicate) {
          if (this === null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
          }

          if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
          }

          var list = Object(this);
          var length = list.length >>> 0;
          var thisArg = arguments[1];
          var value;

          for (var i = 0; i < length; i++) {
            value = list[i];

            if (predicate.call(thisArg, value, i, list)) {
              return value;
            }
          }

          return undefined;
        }
      });
    }

    if (!Array.prototype.findIndex) {
      Object.defineProperty(Array.prototype, 'findIndex', {
        configurable: true,
        writable: true,
        enumerable: false,
        value: function value(predicate) {
          if (this === null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
          }

          if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
          }

          var list = Object(this);
          var length = list.length >>> 0;
          var thisArg = arguments[1];
          var value;

          for (var i = 0; i < length; i++) {
            value = list[i];

            if (predicate.call(thisArg, value, i, list)) {
              return i;
            }
          }

          return -1;
        }
      });
    }
  }

  if (typeof FEATURE_NO_ES2016 === 'undefined' && !Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(searchElement) {
        var O = Object(this);
        var len = parseInt(O.length) || 0;

        if (len === 0) {
          return false;
        }

        var n = parseInt(arguments[1]) || 0;
        var k;

        if (n >= 0) {
          k = n;
        } else {
          k = len + n;

          if (k < 0) {
            k = 0;
          }
        }

        var currentElement;

        while (k < len) {
          currentElement = O[k];

          if (searchElement === currentElement || searchElement !== searchElement && currentElement !== currentElement) {
            return true;
          }

          k++;
        }

        return false;
      }
    });
  }

  if (typeof FEATURE_NO_ES2015 === 'undefined') {
    (function () {
      var needsFix = false;

      try {
        var s = Object.keys('a');
        needsFix = s.length !== 1 || s[0] !== '0';
      } catch (e) {
        needsFix = true;
      }

      if (needsFix) {
        Object.keys = function () {
          var hasOwnProperty = Object.prototype.hasOwnProperty,
              hasDontEnumBug = !{
            toString: null
          }.propertyIsEnumerable('toString'),
              dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
              dontEnumsLength = dontEnums.length;
          return function (obj) {
            if (obj === undefined || obj === null) {
              throw TypeError('Cannot convert undefined or null to object');
            }

            obj = Object(obj);
            var result = [],
                prop,
                i;

            for (prop in obj) {
              if (hasOwnProperty.call(obj, prop)) {
                result.push(prop);
              }
            }

            if (hasDontEnumBug) {
              for (i = 0; i < dontEnumsLength; i++) {
                if (hasOwnProperty.call(obj, dontEnums[i])) {
                  result.push(dontEnums[i]);
                }
              }
            }

            return result;
          };
        }();
      }
    })();

    (function (O) {
      if ('assign' in O) {
        return;
      }

      O.defineProperty(O, 'assign', {
        configurable: true,
        writable: true,
        value: function () {
          var gOPS = O.getOwnPropertySymbols,
              pIE = O.propertyIsEnumerable,
              filterOS = gOPS ? function (self) {
            return gOPS(self).filter(pIE, self);
          } : function () {
            return Array.prototype;
          };
          return function assign(where) {
            if (gOPS && !(where instanceof O)) {
              console.warn('problematic Symbols', where);
            }

            function set(keyOrSymbol) {
              where[keyOrSymbol] = arg[keyOrSymbol];
            }

            for (var i = 1, ii = arguments.length; i < ii; ++i) {
              var arg = arguments[i];

              if (arg === null || arg === undefined) {
                continue;
              }

              O.keys(arg).concat(filterOS(arg)).forEach(set);
            }

            return where;
          };
        }()
      });
    })(Object);

    if (!Object.is) {
      Object.is = function (x, y) {
        if (x === y) {
          return x !== 0 || 1 / x === 1 / y;
        } else {
          return x !== x && y !== y;
        }
      };
    }
  }

  if (typeof FEATURE_NO_ES2015 === 'undefined') {
    (function (global) {
      var i;

      var defineProperty = Object.defineProperty,
          is = function is(a, b) {
        return a === b || a !== a && b !== b;
      };

      if (typeof WeakMap == 'undefined') {
        global.WeakMap = createCollection({
          'delete': sharedDelete,
          clear: sharedClear,
          get: sharedGet,
          has: mapHas,
          set: sharedSet
        }, true);
      }

      if (typeof Map == 'undefined' || typeof new Map().values !== 'function' || !new Map().values().next) {
        var _createCollection;

        global.Map = createCollection((_createCollection = {
          'delete': sharedDelete,
          has: mapHas,
          get: sharedGet,
          set: sharedSet,
          keys: sharedKeys,
          values: sharedValues,
          entries: mapEntries,
          forEach: sharedForEach,
          clear: sharedClear
        }, _createCollection[Symbol.iterator] = mapEntries, _createCollection));
      }

      if (typeof Set == 'undefined' || typeof new Set().values !== 'function' || !new Set().values().next) {
        var _createCollection2;

        global.Set = createCollection((_createCollection2 = {
          has: setHas,
          add: sharedAdd,
          'delete': sharedDelete,
          clear: sharedClear,
          keys: sharedValues,
          values: sharedValues,
          entries: setEntries,
          forEach: sharedForEach
        }, _createCollection2[Symbol.iterator] = sharedValues, _createCollection2));
      }

      if (typeof WeakSet == 'undefined') {
        global.WeakSet = createCollection({
          'delete': sharedDelete,
          add: sharedAdd,
          clear: sharedClear,
          has: setHas
        }, true);
      }

      function createCollection(proto, objectOnly) {
        function Collection(a) {
          if (!this || this.constructor !== Collection) return new Collection(a);
          this._keys = [];
          this._values = [];
          this._itp = [];
          this.objectOnly = objectOnly;
          if (a) init.call(this, a);
        }

        if (!objectOnly) {
          defineProperty(proto, 'size', {
            get: sharedSize
          });
        }

        proto.constructor = Collection;
        Collection.prototype = proto;
        return Collection;
      }

      function init(a) {
        if (this.add) a.forEach(this.add, this);else a.forEach(function (a) {
          this.set(a[0], a[1]);
        }, this);
      }

      function sharedDelete(key) {
        if (this.has(key)) {
          this._keys.splice(i, 1);

          this._values.splice(i, 1);

          this._itp.forEach(function (p) {
            if (i < p[0]) p[0]--;
          });
        }

        return -1 < i;
      }

      function sharedGet(key) {
        return this.has(key) ? this._values[i] : undefined;
      }

      function has(list, key) {
        if (this.objectOnly && key !== Object(key)) throw new TypeError("Invalid value used as weak collection key");
        if (key != key || key === 0) for (i = list.length; i-- && !is(list[i], key);) {} else i = list.indexOf(key);
        return -1 < i;
      }

      function setHas(value) {
        return has.call(this, this._values, value);
      }

      function mapHas(value) {
        return has.call(this, this._keys, value);
      }

      function sharedSet(key, value) {
        this.has(key) ? this._values[i] = value : this._values[this._keys.push(key) - 1] = value;
        return this;
      }

      function sharedAdd(value) {
        if (!this.has(value)) this._values.push(value);
        return this;
      }

      function sharedClear() {
        (this._keys || 0).length = this._values.length = 0;
      }

      function sharedKeys() {
        return sharedIterator(this._itp, this._keys);
      }

      function sharedValues() {
        return sharedIterator(this._itp, this._values);
      }

      function mapEntries() {
        return sharedIterator(this._itp, this._keys, this._values);
      }

      function setEntries() {
        return sharedIterator(this._itp, this._values, this._values);
      }

      function sharedIterator(itp, array, array2) {
        var _ref;

        var p = [0],
            done = false;
        itp.push(p);
        return _ref = {}, _ref[Symbol.iterator] = function () {
          return this;
        }, _ref.next = function next() {
          var v,
              k = p[0];

          if (!done && k < array.length) {
            v = array2 ? [array[k], array2[k]] : array[k];
            p[0]++;
          } else {
            done = true;
            itp.splice(itp.indexOf(p), 1);
          }

          return {
            done: done,
            value: v
          };
        }, _ref;
      }

      function sharedSize() {
        return this._values.length;
      }

      function sharedForEach(callback, context) {
        var it = this.entries();

        for (;;) {
          var r = it.next();
          if (r.done) break;
          callback.call(context, r.value[1], r.value[0], this);
        }
      }
    })(PLATFORM.global);
  }

  if (typeof FEATURE_NO_ES2015 === 'undefined') {
    var bind = Function.prototype.bind;

    if (typeof PLATFORM.global.Reflect === 'undefined') {
      PLATFORM.global.Reflect = {};
    }

    if (typeof Reflect.defineProperty !== 'function') {
      Reflect.defineProperty = function (target, propertyKey, descriptor) {
        if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' ? target === null : typeof target !== 'function') {
          throw new TypeError('Reflect.defineProperty called on non-object');
        }

        try {
          Object.defineProperty(target, propertyKey, descriptor);
          return true;
        } catch (e) {
          return false;
        }
      };
    }

    if (typeof Reflect.construct !== 'function') {
      Reflect.construct = function (Target, args) {
        if (args) {
          switch (args.length) {
            case 0:
              return new Target();

            case 1:
              return new Target(args[0]);

            case 2:
              return new Target(args[0], args[1]);

            case 3:
              return new Target(args[0], args[1], args[2]);

            case 4:
              return new Target(args[0], args[1], args[2], args[3]);
          }
        }

        var a = [null];
        a.push.apply(a, args);
        return new (bind.apply(Target, a))();
      };
    }

    if (typeof Reflect.ownKeys !== 'function') {
      Reflect.ownKeys = function (o) {
        return Object.getOwnPropertyNames(o).concat(Object.getOwnPropertySymbols(o));
      };
    }
  }

  if (typeof FEATURE_NO_ESNEXT === 'undefined') {
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

  var _PLATFORM = {
    location: window.location,
    history: window.history,
    addEventListener: function addEventListener(eventName, callback, capture) {
      this.global.addEventListener(eventName, callback, capture);
    },
    removeEventListener: function removeEventListener(eventName, callback, capture) {
      this.global.removeEventListener(eventName, callback, capture);
    },
    performance: window.performance,
    requestAnimationFrame: function requestAnimationFrame(callback) {
      return this.global.requestAnimationFrame(callback);
    }
  };

  if (typeof FEATURE_NO_IE === 'undefined') {
    var test = function test() {};

    if (test.name === undefined) {
      Object.defineProperty(Function.prototype, 'name', {
        get: function get() {
          var name = this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
          Object.defineProperty(this, 'name', {
            value: name
          });
          return name;
        }
      });
    }
  }

  if (typeof FEATURE_NO_IE === 'undefined') {
    if (!('classList' in document.createElement('_')) || document.createElementNS && !('classList' in document.createElementNS('http://www.w3.org/2000/svg', 'g'))) {
      var protoProp = 'prototype';
      var strTrim = String.prototype.trim;
      var arrIndexOf = Array.prototype.indexOf;
      var emptyArray = [];

      var DOMEx = function DOMEx(type, message) {
        this.name = type;
        this.code = DOMException[type];
        this.message = message;
      };

      var checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
        if (token === '') {
          throw new DOMEx('SYNTAX_ERR', 'An invalid or illegal string was specified');
        }

        if (/\s/.test(token)) {
          throw new DOMEx('INVALID_CHARACTER_ERR', 'String contains an invalid character');
        }

        return arrIndexOf.call(classList, token);
      };

      var ClassList = function ClassList(elem) {
        var trimmedClasses = strTrim.call(elem.getAttribute('class') || '');
        var classes = trimmedClasses ? trimmedClasses.split(/\s+/) : emptyArray;

        for (var i = 0, ii = classes.length; i < ii; ++i) {
          this.push(classes[i]);
        }

        this._updateClassName = function () {
          elem.setAttribute('class', this.toString());
        };
      };

      var classListProto = ClassList[protoProp] = [];
      DOMEx[protoProp] = Error[protoProp];

      classListProto.item = function (i) {
        return this[i] || null;
      };

      classListProto.contains = function (token) {
        token += '';
        return checkTokenAndGetIndex(this, token) !== -1;
      };

      classListProto.add = function () {
        var tokens = arguments;
        var i = 0;
        var ii = tokens.length;
        var token;
        var updated = false;

        do {
          token = tokens[i] + '';

          if (checkTokenAndGetIndex(this, token) === -1) {
            this.push(token);
            updated = true;
          }
        } while (++i < ii);

        if (updated) {
          this._updateClassName();
        }
      };

      classListProto.remove = function () {
        var tokens = arguments;
        var i = 0;
        var ii = tokens.length;
        var token;
        var updated = false;
        var index;

        do {
          token = tokens[i] + '';
          index = checkTokenAndGetIndex(this, token);

          while (index !== -1) {
            this.splice(index, 1);
            updated = true;
            index = checkTokenAndGetIndex(this, token);
          }
        } while (++i < ii);

        if (updated) {
          this._updateClassName();
        }
      };

      classListProto.toggle = function (token, force) {
        token += '';
        var result = this.contains(token);
        var method = result ? force !== true && 'remove' : force !== false && 'add';

        if (method) {
          this[method](token);
        }

        if (force === true || force === false) {
          return force;
        }

        return !result;
      };

      classListProto.toString = function () {
        return this.join(' ');
      };

      Object.defineProperty(Element.prototype, 'classList', {
        get: function get() {
          return new ClassList(this);
        },
        enumerable: true,
        configurable: true
      });
    } else {
      var testElement = document.createElement('_');
      testElement.classList.add('c1', 'c2');

      if (!testElement.classList.contains('c2')) {
        var createMethod = function createMethod(method) {
          var original = DOMTokenList.prototype[method];

          DOMTokenList.prototype[method] = function (token) {
            for (var i = 0, ii = arguments.length; i < ii; ++i) {
              token = arguments[i];
              original.call(this, token);
            }
          };
        };

        createMethod('add');
        createMethod('remove');
      }

      testElement.classList.toggle('c3', false);

      if (testElement.classList.contains('c3')) {
        var _toggle = DOMTokenList.prototype.toggle;

        DOMTokenList.prototype.toggle = function (token, force) {
          if (1 in arguments && !this.contains(token) === !force) {
            return force;
          }

          return _toggle.call(this, token);
        };
      }

      testElement = null;
    }
  }

  if (typeof FEATURE_NO_IE === 'undefined') {
    var _filterEntries = function _filterEntries(key, value) {
      var i = 0,
          n = _entries.length,
          result = [];

      for (; i < n; i++) {
        if (_entries[i][key] == value) {
          result.push(_entries[i]);
        }
      }

      return result;
    };

    var _clearEntries = function _clearEntries(type, name) {
      var i = _entries.length,
          entry;

      while (i--) {
        entry = _entries[i];

        if (entry.entryType == type && (name === void 0 || entry.name == name)) {
          _entries.splice(i, 1);
        }
      }
    };

    // @license http://opensource.org/licenses/MIT
    if ('performance' in window === false) {
      window.performance = {};
    }

    if ('now' in window.performance === false) {
      var nowOffset = Date.now();

      if (performance.timing && performance.timing.navigationStart) {
        nowOffset = performance.timing.navigationStart;
      }

      window.performance.now = function now() {
        return Date.now() - nowOffset;
      };
    }
    var _entries = [];
    var _marksIndex = {};

    if (!window.performance.mark) {
      window.performance.mark = window.performance.webkitMark || function (name) {
        var mark = {
          name: name,
          entryType: "mark",
          startTime: window.performance.now(),
          duration: 0
        };

        _entries.push(mark);

        _marksIndex[name] = mark;
      };
    }

    if (!window.performance.measure) {
      window.performance.measure = window.performance.webkitMeasure || function (name, startMark, endMark) {
        startMark = _marksIndex[startMark].startTime;
        endMark = _marksIndex[endMark].startTime;

        _entries.push({
          name: name,
          entryType: "measure",
          startTime: startMark,
          duration: endMark - startMark
        });
      };
    }

    if (!window.performance.getEntriesByType) {
      window.performance.getEntriesByType = window.performance.webkitGetEntriesByType || function (type) {
        return _filterEntries("entryType", type);
      };
    }

    if (!window.performance.getEntriesByName) {
      window.performance.getEntriesByName = window.performance.webkitGetEntriesByName || function (name) {
        return _filterEntries("name", name);
      };
    }

    if (!window.performance.clearMarks) {
      window.performance.clearMarks = window.performance.webkitClearMarks || function (name) {
        _clearEntries("mark", name);
      };
    }

    if (!window.performance.clearMeasures) {
      window.performance.clearMeasures = window.performance.webkitClearMeasures || function (name) {
        _clearEntries("measure", name);
      };
    }

    _PLATFORM.performance = window.performance;
  }

  if (typeof FEATURE_NO_IE === 'undefined') {
    var con = window.console = window.console || {};

    var nop = function nop() {};

    if (!con.memory) con.memory = {};
    ('assert,clear,count,debug,dir,dirxml,error,exception,group,' + 'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' + 'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',').forEach(function (m) {
      if (!con[m]) con[m] = nop;
    });

    if (typeof con.log === 'object') {
      'log,info,warn,error,assert,dir,clear,profile,profileEnd'.split(',').forEach(function (method) {
        console[method] = this.bind(console[method], console);
      }, Function.prototype.call);
    }
  }

  if (typeof FEATURE_NO_IE === 'undefined') {
    if (!window.CustomEvent || typeof window.CustomEvent !== 'function') {
      var CustomEvent = function CustomEvent(event, params) {
        params = params || {
          bubbles: false,
          cancelable: false,
          detail: undefined
        };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      };

      CustomEvent.prototype = window.Event.prototype;
      window.CustomEvent = CustomEvent;
    }
  }

  if (Element && !Element.prototype.matches) {
    var proto = Element.prototype;
    proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
  }

  var _FEATURE = {
    shadowDOM: !!HTMLElement.prototype.attachShadow,
    scopedCSS: 'scoped' in document.createElement('style'),
    htmlTemplateElement: function () {
      var d = document.createElement('div');
      d.innerHTML = '<template></template>';
      return 'content' in d.children[0];
    }(),
    mutationObserver: !!(window.MutationObserver || window.WebKitMutationObserver),
    ensureHTMLTemplateElement: function ensureHTMLTemplateElement(t) {
      return t;
    }
  };

  if (typeof FEATURE_NO_IE === 'undefined') {
    var isSVGTemplate = function isSVGTemplate(el) {
      return el.tagName === 'template' && el.namespaceURI === 'http://www.w3.org/2000/svg';
    };

    var fixSVGTemplateElement = function fixSVGTemplateElement(el) {
      var template = el.ownerDocument.createElement('template');
      var attrs = el.attributes;
      var length = attrs.length;
      var attr;
      el.parentNode.insertBefore(template, el);

      while (length-- > 0) {
        attr = attrs[length];
        template.setAttribute(attr.name, attr.value);
        el.removeAttribute(attr.name);
      }

      el.parentNode.removeChild(el);
      return fixHTMLTemplateElement(template);
    };

    var fixHTMLTemplateElement = function fixHTMLTemplateElement(template) {
      var content = template.content = document.createDocumentFragment();
      var child;

      while (child = template.firstChild) {
        content.appendChild(child);
      }

      return template;
    };

    var fixHTMLTemplateElementRoot = function fixHTMLTemplateElementRoot(template) {
      var content = fixHTMLTemplateElement(template).content;
      var childTemplates = content.querySelectorAll('template');

      for (var i = 0, ii = childTemplates.length; i < ii; ++i) {
        var child = childTemplates[i];

        if (isSVGTemplate(child)) {
          fixSVGTemplateElement(child);
        } else {
          fixHTMLTemplateElement(child);
        }
      }

      return template;
    };

    if (!_FEATURE.htmlTemplateElement) {
      _FEATURE.ensureHTMLTemplateElement = fixHTMLTemplateElementRoot;
    }
  }

  var shadowPoly = window.ShadowDOMPolyfill || null;
  var _DOM = {
    Element: Element,
    NodeList: NodeList,
    SVGElement: SVGElement,
    boundary: 'aurelia-dom-boundary',
    addEventListener: function addEventListener(eventName, callback, capture) {
      document.addEventListener(eventName, callback, capture);
    },
    removeEventListener: function removeEventListener(eventName, callback, capture) {
      document.removeEventListener(eventName, callback, capture);
    },
    adoptNode: function adoptNode(node) {
      return document.adoptNode(node);
    },
    createAttribute: function createAttribute(name) {
      return document.createAttribute(name);
    },
    createElement: function createElement(tagName) {
      return document.createElement(tagName);
    },
    createTextNode: function createTextNode(text) {
      return document.createTextNode(text);
    },
    createComment: function createComment(text) {
      return document.createComment(text);
    },
    createDocumentFragment: function createDocumentFragment() {
      return document.createDocumentFragment();
    },
    createTemplateElement: function createTemplateElement() {
      var template = document.createElement('template');
      return _FEATURE.ensureHTMLTemplateElement(template);
    },
    createMutationObserver: function createMutationObserver(callback) {
      return new (window.MutationObserver || window.WebKitMutationObserver)(callback);
    },
    createCustomEvent: function createCustomEvent(eventType, options) {
      return new window.CustomEvent(eventType, options);
    },
    dispatchEvent: function dispatchEvent(evt) {
      document.dispatchEvent(evt);
    },
    getComputedStyle: function getComputedStyle(element) {
      return window.getComputedStyle(element);
    },
    getElementById: function getElementById(id) {
      return document.getElementById(id);
    },
    querySelector: function querySelector(query) {
      return document.querySelector(query);
    },
    querySelectorAll: function querySelectorAll(query) {
      return document.querySelectorAll(query);
    },
    nextElementSibling: function nextElementSibling(element) {
      if (element.nextElementSibling) {
        return element.nextElementSibling;
      }

      do {
        element = element.nextSibling;
      } while (element && element.nodeType !== 1);

      return element;
    },
    createTemplateFromMarkup: function createTemplateFromMarkup(markup) {
      var parser = document.createElement('div');
      parser.innerHTML = markup;
      var temp = parser.firstElementChild;

      if (!temp || temp.nodeName !== 'TEMPLATE') {
        throw new Error('Template markup must be wrapped in a <template> element e.g. <template> <!-- markup here --> </template>');
      }

      return _FEATURE.ensureHTMLTemplateElement(temp);
    },
    appendNode: function appendNode(newNode, parentNode) {
      (parentNode || document.body).appendChild(newNode);
    },
    replaceNode: function replaceNode(newNode, node, parentNode) {
      if (node.parentNode) {
        node.parentNode.replaceChild(newNode, node);
      } else if (shadowPoly !== null) {
        shadowPoly.unwrap(parentNode).replaceChild(shadowPoly.unwrap(newNode), shadowPoly.unwrap(node));
      } else {
        parentNode.replaceChild(newNode, node);
      }
    },
    removeNode: function removeNode(node, parentNode) {
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
    injectStyles: function injectStyles(styles, destination, prepend, id) {
      if (id) {
        var oldStyle = document.getElementById(id);

        if (oldStyle) {
          var isStyleTag = oldStyle.tagName.toLowerCase() === 'style';

          if (isStyleTag) {
            oldStyle.innerHTML = styles;
            return;
          }

          throw new Error('The provided id does not indicate a style tag.');
        }
      }

      var node = document.createElement('style');
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

    initializePAL(function (platform, feature, dom) {
      Object.assign(platform, _PLATFORM);
      Object.assign(feature, _FEATURE);
      Object.assign(dom, _DOM);
      Object.defineProperty(dom, 'title', {
        get: function get() {
          return document.title;
        },
        set: function set(value) {
          document.title = value;
        }
      });
      Object.defineProperty(dom, 'activeElement', {
        get: function get() {
          return document.activeElement;
        }
      });
      Object.defineProperty(platform, 'XMLHttpRequest', {
        get: function get() {
          return platform.global.XMLHttpRequest;
        }
      });
    });
  }

  var logLevel = {
    none: 0,
    error: 10,
    warn: 20,
    info: 30,
    debug: 40
  };
  var loggers = {};
  var appenders = [];
  var globalDefaultLevel = logLevel.none;
  var standardLevels = ['none', 'error', 'warn', 'info', 'debug'];

  function isStandardLevel(level) {
    return standardLevels.filter(function (l) {
      return l === level;
    }).length > 0;
  }

  function appendArgs() {
    return [this].concat(Array.prototype.slice.call(arguments));
  }

  function logFactory(level) {
    var threshold = logLevel[level];
    return function () {
      if (this.level < threshold) {
        return;
      }

      var args = appendArgs.apply(this, arguments);
      var i = appenders.length;

      while (i--) {
        var _appenders$i;

        (_appenders$i = appenders[i])[level].apply(_appenders$i, args);
      }
    };
  }

  function logFactoryCustom(level) {
    var threshold = logLevel[level];
    return function () {
      if (this.level < threshold) {
        return;
      }

      var args = appendArgs.apply(this, arguments);
      var i = appenders.length;

      while (i--) {
        var appender = appenders[i];

        if (appender[level] !== undefined) {
          appender[level].apply(appender, args);
        }
      }
    };
  }

  function connectLoggers() {
    var proto = Logger.prototype;

    for (var level in logLevel) {
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
    var proto = Logger.prototype;

    for (var level in logLevel) {
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
    appenders = appenders.filter(function (a) {
      return a !== appender;
    });
  }
  function getAppenders() {
    return [].concat(appenders);
  }
  function clearAppenders() {
    appenders = [];
    disconnectLoggers();
  }
  function addCustomLevel(name, value) {
    if (logLevel[name] !== undefined) {
      throw Error("Log level \"" + name + "\" already exists.");
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
      throw Error("Built-in log level \"" + name + "\" cannot be removed.");
    }

    delete logLevel[name];
    delete Logger.prototype[name];
  }
  function setLevel(level) {
    globalDefaultLevel = level;

    for (var key in loggers) {
      loggers[key].setLevel(level);
    }
  }
  function getLevel() {
    return globalDefaultLevel;
  }
  var Logger =
  /*#__PURE__*/
  function () {
    function Logger(id) {
      var cached = loggers[id];

      if (cached) {
        return cached;
      }

      loggers[id] = this;
      this.id = id;
      this.level = globalDefaultLevel;
    }

    var _proto = Logger.prototype;

    _proto.debug = function debug(message) {};

    _proto.info = function info(message) {};

    _proto.warn = function warn(message) {};

    _proto.error = function error(message) {};

    _proto.setLevel = function setLevel(level) {
      this.level = level;
    };

    _proto.isDebugEnabled = function isDebugEnabled() {
      return this.level === logLevel.debug;
    };

    return Logger;
  }();

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

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function isObject(val) {
    return val && (typeof val === 'function' || typeof val === 'object');
  }

  var metadata = {
    resource: 'aurelia:resource',
    paramTypes: 'design:paramtypes',
    propertyType: 'design:type',
    properties: 'design:properties',
    get: function get(metadataKey, target, targetKey) {
      if (!isObject(target)) {
        return undefined;
      }

      var result = metadata.getOwn(metadataKey, target, targetKey);
      return result === undefined ? metadata.get(metadataKey, Object.getPrototypeOf(target), targetKey) : result;
    },
    getOwn: function getOwn(metadataKey, target, targetKey) {
      if (!isObject(target)) {
        return undefined;
      }

      return Reflect.getOwnMetadata(metadataKey, target, targetKey);
    },
    define: function define(metadataKey, metadataValue, target, targetKey) {
      Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
    },
    getOrCreateOwn: function getOrCreateOwn(metadataKey, Type, target, targetKey) {
      var result = metadata.getOwn(metadataKey, target, targetKey);

      if (result === undefined) {
        result = new Type();
        Reflect.defineMetadata(metadataKey, result, target, targetKey);
      }

      return result;
    }
  };
  var originStorage = new Map();
  var unknownOrigin = Object.freeze({
    moduleId: undefined,
    moduleMember: undefined
  });
  var Origin =
  /*#__PURE__*/
  function () {
    function Origin(moduleId, moduleMember) {
      this.moduleId = moduleId;
      this.moduleMember = moduleMember;
    }

    Origin.get = function get(fn) {
      var origin = originStorage.get(fn);

      if (origin === undefined) {
        PLATFORM.eachModule(function (key, value) {
          if (typeof value === 'object') {
            for (var name in value) {
              try {
                var exp = value[name];

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
    };

    Origin.set = function set(fn, origin) {
      originStorage.set(fn, origin);
    };

    return Origin;
  }();
  function decorators() {
    for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
      rest[_key] = arguments[_key];
    }

    var applicator = function applicator(target, key, descriptor) {
      var i = rest.length;

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
      var methodSignature = target.constructor.name + "#" + key;
      var options = maybeKey ? {} : optionsOrTarget || {};
      var message = "DEPRECATION - " + methodSignature;

      if (typeof descriptor.value !== 'function') {
        throw new SyntaxError('Only methods can be marked as deprecated.');
      }

      if (options.message) {
        message += " - " + options.message;
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
    var instanceKeys = Object.keys(behavior);

    function _mixin(possible) {
      var decorator = function decorator(target) {
        var resolvedTarget = typeof target === 'function' ? target.prototype : target;
        var i = instanceKeys.length;

        while (i--) {
          var property = instanceKeys[i];
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
      var result = validate(target);
      return result === true;
    };
  }

  function createProtocolAsserter(name, validate) {
    return function (target) {
      var result = validate(target);

      if (result !== true) {
        throw new Error(result || name + " was not correctly implemented.");
      }
    };
  }

  function protocol(name, options) {
    options = ensureProtocolOptions(options);

    var result = function result(target) {
      var resolvedTarget = typeof target === 'function' ? target.prototype : target;
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
    var hidden = 'protocol:' + name;

    var result = function result(target) {
      var decorator = protocol(name, options);
      return target ? decorator(target) : decorator;
    };

    result.decorates = function (obj) {
      return obj[hidden] === true;
    };

    result.validate = createProtocolValidator(options.validate);
    result.assert = createProtocolAsserter(name, options.validate);
    return result;
  };

  var _classInvokers;

  var _dec, _class, _dec2, _class2, _dec3, _class3, _dec4, _class4, _dec5, _class5, _dec6, _class6, _dec7, _class7;
  var resolver = protocol.create('aurelia:resolver', function (target) {
    if (!(typeof target.get === 'function')) {
      return 'Resolvers must implement: get(container: Container, key: any): any';
    }

    return true;
  });
  var StrategyResolver = (_dec = resolver(), _dec(_class =
  /*#__PURE__*/
  function () {
    function StrategyResolver(strategy, state) {
      this.strategy = strategy;
      this.state = state;
    }

    var _proto = StrategyResolver.prototype;

    _proto.get = function get(container, key) {
      switch (this.strategy) {
        case 0:
          return this.state;

        case 1:
          var _singleton = container.invoke(this.state);

          this.state = _singleton;
          this.strategy = 0;
          return _singleton;

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
    };

    return StrategyResolver;
  }()) || _class);
  var Lazy = (_dec2 = resolver(), _dec2(_class2 =
  /*#__PURE__*/
  function () {
    function Lazy(key) {
      this._key = key;
    }

    var _proto2 = Lazy.prototype;

    _proto2.get = function get(container) {
      var _this = this;

      return function () {
        return container.get(_this._key);
      };
    };

    Lazy.of = function of(key) {
      return new Lazy(key);
    };

    return Lazy;
  }()) || _class2);
  var All = (_dec3 = resolver(), _dec3(_class3 =
  /*#__PURE__*/
  function () {
    function All(key) {
      this._key = key;
    }

    var _proto3 = All.prototype;

    _proto3.get = function get(container) {
      return container.getAll(this._key);
    };

    All.of = function of(key) {
      return new All(key);
    };

    return All;
  }()) || _class3);
  var Optional = (_dec4 = resolver(), _dec4(_class4 =
  /*#__PURE__*/
  function () {
    function Optional(key, checkParent) {
      if (checkParent === void 0) {
        checkParent = true;
      }

      this._key = key;
      this._checkParent = checkParent;
    }

    var _proto4 = Optional.prototype;

    _proto4.get = function get(container) {
      if (container.hasResolver(this._key, this._checkParent)) {
        return container.get(this._key);
      }

      return null;
    };

    Optional.of = function of(key, checkParent) {
      if (checkParent === void 0) {
        checkParent = true;
      }

      return new Optional(key, checkParent);
    };

    return Optional;
  }()) || _class4);
  var Parent = (_dec5 = resolver(), _dec5(_class5 =
  /*#__PURE__*/
  function () {
    function Parent(key) {
      this._key = key;
    }

    var _proto5 = Parent.prototype;

    _proto5.get = function get(container) {
      return container.parent ? container.parent.get(this._key) : null;
    };

    Parent.of = function of(key) {
      return new Parent(key);
    };

    return Parent;
  }()) || _class5);
  var Factory = (_dec6 = resolver(), _dec6(_class6 =
  /*#__PURE__*/
  function () {
    function Factory(key) {
      this._key = key;
    }

    var _proto6 = Factory.prototype;

    _proto6.get = function get(container) {
      var fn = this._key;
      var resolver = container.getResolver(fn);

      if (resolver && resolver.strategy === 3) {
        fn = resolver.state;
      }

      return function () {
        for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
          rest[_key] = arguments[_key];
        }

        return container.invoke(fn, rest);
      };
    };

    Factory.of = function of(key) {
      return new Factory(key);
    };

    return Factory;
  }()) || _class6);
  var NewInstance = (_dec7 = resolver(), _dec7(_class7 =
  /*#__PURE__*/
  function () {
    function NewInstance(key) {
      this.key = key;
      this.asKey = key;

      for (var _len2 = arguments.length, dynamicDependencies = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        dynamicDependencies[_key2 - 1] = arguments[_key2];
      }

      this.dynamicDependencies = dynamicDependencies;
    }

    var _proto7 = NewInstance.prototype;

    _proto7.get = function get(container) {
      var dynamicDependencies = this.dynamicDependencies.length > 0 ? this.dynamicDependencies.map(function (dependency) {
        return dependency['protocol:aurelia:resolver'] ? dependency.get(container) : container.get(dependency);
      }) : undefined;
      var fn = this.key;
      var resolver = container.getResolver(fn);

      if (resolver && resolver.strategy === 3) {
        fn = resolver.state;
      }

      var instance = container.invoke(fn, dynamicDependencies);
      container.registerInstance(this.asKey, instance);
      return instance;
    };

    _proto7.as = function as(key) {
      this.asKey = key;
      return this;
    };

    NewInstance.of = function of(key) {
      for (var _len3 = arguments.length, dynamicDependencies = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        dynamicDependencies[_key3 - 1] = arguments[_key3];
      }

      return _construct(NewInstance, [key].concat(dynamicDependencies));
    };

    return NewInstance;
  }()) || _class7);
  function getDecoratorDependencies(target) {
    autoinject(target);
    return target.inject;
  }
  function lazy(keyValue) {
    return function (target, key, index) {
      var inject = getDecoratorDependencies(target);
      inject[index] = Lazy.of(keyValue);
    };
  }
  function all(keyValue) {
    return function (target, key, index) {
      var inject = getDecoratorDependencies(target);
      inject[index] = All.of(keyValue);
    };
  }
  function optional(checkParentOrTarget) {
    if (checkParentOrTarget === void 0) {
      checkParentOrTarget = true;
    }

    var deco = function deco(checkParent) {
      return function (target, key, index) {
        var inject = getDecoratorDependencies(target);
        inject[index] = Optional.of(inject[index], checkParent);
      };
    };

    if (typeof checkParentOrTarget === 'boolean') {
      return deco(checkParentOrTarget);
    }

    return deco(true);
  }
  function parent(target, key, index) {
    var inject = getDecoratorDependencies(target);
    inject[index] = Parent.of(inject[index]);
  }
  function factory(keyValue) {
    return function (target, key, index) {
      var inject = getDecoratorDependencies(target);
      inject[index] = Factory.of(keyValue);
    };
  }
  function newInstance(asKeyOrTarget) {
    for (var _len4 = arguments.length, dynamicDependencies = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      dynamicDependencies[_key4 - 1] = arguments[_key4];
    }

    var deco = function deco(asKey) {
      return function (target, key, index) {
        var inject = getDecoratorDependencies(target);
        inject[index] = NewInstance.of.apply(NewInstance, [inject[index]].concat(dynamicDependencies));

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
    var deco = function deco(target) {
      metadata.define(metadata.invoker, FactoryInvoker.instance, target);
    };

    return potentialTarget ? deco(potentialTarget) : deco;
  }
  var FactoryInvoker =
  /*#__PURE__*/
  function () {
    function FactoryInvoker() {}

    var _proto8 = FactoryInvoker.prototype;

    _proto8.invoke = function invoke(container, fn, dependencies) {
      var i = dependencies.length;
      var args = new Array(i);

      while (i--) {
        args[i] = container.get(dependencies[i]);
      }

      return fn.apply(undefined, args);
    };

    _proto8.invokeWithDynamicDependencies = function invokeWithDynamicDependencies(container, fn, staticDependencies, dynamicDependencies) {
      var i = staticDependencies.length;
      var args = new Array(i);

      while (i--) {
        args[i] = container.get(staticDependencies[i]);
      }

      if (dynamicDependencies !== undefined) {
        args = args.concat(dynamicDependencies);
      }

      return fn.apply(undefined, args);
    };

    return FactoryInvoker;
  }();
  FactoryInvoker.instance = new FactoryInvoker();
  function registration(value) {
    return function (target) {
      metadata.define(metadata.registration, value, target);
    };
  }

  function _transient(key) {
    return registration(new TransientRegistration(key));
  }
  function singleton(keyOrRegisterInChild, registerInChild) {
    if (registerInChild === void 0) {
      registerInChild = false;
    }

    return registration(new SingletonRegistration(keyOrRegisterInChild, registerInChild));
  }
  var TransientRegistration =
  /*#__PURE__*/
  function () {
    function TransientRegistration(key) {
      this._key = key;
    }

    var _proto9 = TransientRegistration.prototype;

    _proto9.registerResolver = function registerResolver(container, key, fn) {
      var existingResolver = container.getResolver(this._key || key);
      return existingResolver === undefined ? container.registerTransient(this._key || key, fn) : existingResolver;
    };

    return TransientRegistration;
  }();
  var SingletonRegistration =
  /*#__PURE__*/
  function () {
    function SingletonRegistration(keyOrRegisterInChild, registerInChild) {
      if (registerInChild === void 0) {
        registerInChild = false;
      }

      if (typeof keyOrRegisterInChild === 'boolean') {
        this._registerInChild = keyOrRegisterInChild;
      } else {
        this._key = keyOrRegisterInChild;
        this._registerInChild = registerInChild;
      }
    }

    var _proto10 = SingletonRegistration.prototype;

    _proto10.registerResolver = function registerResolver(container, key, fn) {
      var targetContainer = this._registerInChild ? container : container.root;
      var existingResolver = targetContainer.getResolver(this._key || key);
      return existingResolver === undefined ? targetContainer.registerSingleton(this._key || key, fn) : existingResolver;
    };

    return SingletonRegistration;
  }();

  function validateKey(key) {
    if (key === null || key === undefined) {
      throw new Error('key/value cannot be null or undefined. Are you trying to inject/register something that doesn\'t exist with DI?');
    }
  }

  var _emptyParameters = Object.freeze([]);
  metadata.registration = 'aurelia:registration';
  metadata.invoker = 'aurelia:invoker';
  var resolverDecorates = resolver.decorates;
  var InvocationHandler =
  /*#__PURE__*/
  function () {
    function InvocationHandler(fn, invoker, dependencies) {
      this.fn = fn;
      this.invoker = invoker;
      this.dependencies = dependencies;
    }

    var _proto11 = InvocationHandler.prototype;

    _proto11.invoke = function invoke(container, dynamicDependencies) {
      return dynamicDependencies !== undefined ? this.invoker.invokeWithDynamicDependencies(container, this.fn, this.dependencies, dynamicDependencies) : this.invoker.invoke(container, this.fn, this.dependencies);
    };

    return InvocationHandler;
  }();

  function invokeWithDynamicDependencies(container, fn, staticDependencies, dynamicDependencies) {
    var i = staticDependencies.length;
    var args = new Array(i);
    var lookup;

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

  var classInvokers = (_classInvokers = {}, _classInvokers[0] = {
    invoke: function invoke(container, Type) {
      return new Type();
    },
    invokeWithDynamicDependencies: invokeWithDynamicDependencies
  }, _classInvokers[1] = {
    invoke: function invoke(container, Type, deps) {
      return new Type(container.get(deps[0]));
    },
    invokeWithDynamicDependencies: invokeWithDynamicDependencies
  }, _classInvokers[2] = {
    invoke: function invoke(container, Type, deps) {
      return new Type(container.get(deps[0]), container.get(deps[1]));
    },
    invokeWithDynamicDependencies: invokeWithDynamicDependencies
  }, _classInvokers[3] = {
    invoke: function invoke(container, Type, deps) {
      return new Type(container.get(deps[0]), container.get(deps[1]), container.get(deps[2]));
    },
    invokeWithDynamicDependencies: invokeWithDynamicDependencies
  }, _classInvokers[4] = {
    invoke: function invoke(container, Type, deps) {
      return new Type(container.get(deps[0]), container.get(deps[1]), container.get(deps[2]), container.get(deps[3]));
    },
    invokeWithDynamicDependencies: invokeWithDynamicDependencies
  }, _classInvokers[5] = {
    invoke: function invoke(container, Type, deps) {
      return new Type(container.get(deps[0]), container.get(deps[1]), container.get(deps[2]), container.get(deps[3]), container.get(deps[4]));
    },
    invokeWithDynamicDependencies: invokeWithDynamicDependencies
  }, _classInvokers.fallback = {
    invoke: invokeWithDynamicDependencies,
    invokeWithDynamicDependencies: invokeWithDynamicDependencies
  }, _classInvokers);

  function getDependencies(f) {
    if (!f.hasOwnProperty('inject')) {
      return [];
    }

    if (typeof f.inject === 'function') {
      return f.inject();
    }

    return f.inject;
  }

  var Container =
  /*#__PURE__*/
  function () {
    function Container(configuration) {
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

    var _proto12 = Container.prototype;

    _proto12.makeGlobal = function makeGlobal() {
      Container.instance = this;
      return this;
    };

    _proto12.setHandlerCreatedCallback = function setHandlerCreatedCallback(onHandlerCreated) {
      this._onHandlerCreated = onHandlerCreated;
      this._configuration.onHandlerCreated = onHandlerCreated;
    };

    _proto12.registerInstance = function registerInstance(key, instance) {
      return this.registerResolver(key, new StrategyResolver(0, instance === undefined ? key : instance));
    };

    _proto12.registerSingleton = function registerSingleton(key, fn) {
      return this.registerResolver(key, new StrategyResolver(1, fn === undefined ? key : fn));
    };

    _proto12.registerTransient = function registerTransient(key, fn) {
      return this.registerResolver(key, new StrategyResolver(2, fn === undefined ? key : fn));
    };

    _proto12.registerHandler = function registerHandler(key, handler) {
      return this.registerResolver(key, new StrategyResolver(3, handler));
    };

    _proto12.registerAlias = function registerAlias(originalKey, aliasKey) {
      return this.registerResolver(aliasKey, new StrategyResolver(5, originalKey));
    };

    _proto12.registerResolver = function registerResolver(key, resolver) {
      validateKey(key);
      var allResolvers = this._resolvers;
      var result = allResolvers.get(key);

      if (result === undefined) {
        allResolvers.set(key, resolver);
      } else if (result.strategy === 4) {
        result.state.push(resolver);
      } else {
        allResolvers.set(key, new StrategyResolver(4, [result, resolver]));
      }

      return resolver;
    };

    _proto12.autoRegister = function autoRegister(key, fn) {
      fn = fn === undefined ? key : fn;

      if (typeof fn === 'function') {
        var _registration = metadata.get(metadata.registration, fn);

        if (_registration === undefined) {
          return this.registerResolver(key, new StrategyResolver(1, fn));
        }

        return _registration.registerResolver(this, key, fn);
      }

      return this.registerResolver(key, new StrategyResolver(0, fn));
    };

    _proto12.autoRegisterAll = function autoRegisterAll(fns) {
      var i = fns.length;

      while (i--) {
        this.autoRegister(fns[i]);
      }
    };

    _proto12.unregister = function unregister(key) {
      this._resolvers["delete"](key);
    };

    _proto12.hasResolver = function hasResolver(key, checkParent) {
      if (checkParent === void 0) {
        checkParent = false;
      }

      validateKey(key);
      return this._resolvers.has(key) || checkParent && this.parent !== null && this.parent.hasResolver(key, checkParent);
    };

    _proto12.getResolver = function getResolver(key) {
      return this._resolvers.get(key);
    };

    _proto12.get = function get(key) {
      validateKey(key);

      if (key === Container) {
        return this;
      }

      if (resolverDecorates(key)) {
        return key.get(this, key);
      }

      var resolver = this._resolvers.get(key);

      if (resolver === undefined) {
        if (this.parent === null) {
          return this.autoRegister(key).get(this, key);
        }

        var _registration2 = metadata.get(metadata.registration, key);

        if (_registration2 === undefined) {
          return this.parent._get(key);
        }

        return _registration2.registerResolver(this, key, key).get(this, key);
      }

      return resolver.get(this, key);
    };

    _proto12._get = function _get(key) {
      var resolver = this._resolvers.get(key);

      if (resolver === undefined) {
        if (this.parent === null) {
          return this.autoRegister(key).get(this, key);
        }

        return this.parent._get(key);
      }

      return resolver.get(this, key);
    };

    _proto12.getAll = function getAll(key) {
      validateKey(key);

      var resolver = this._resolvers.get(key);

      if (resolver === undefined) {
        if (this.parent === null) {
          return _emptyParameters;
        }

        return this.parent.getAll(key);
      }

      if (resolver.strategy === 4) {
        var state = resolver.state;
        var i = state.length;
        var results = new Array(i);

        while (i--) {
          results[i] = state[i].get(this, key);
        }

        return results;
      }

      return [resolver.get(this, key)];
    };

    _proto12.createChild = function createChild() {
      var child = new Container(this._configuration);
      child.root = this.root;
      child.parent = this;
      return child;
    };

    _proto12.invoke = function invoke(fn, dynamicDependencies) {
      try {
        var handler = this._handlers.get(fn);

        if (handler === undefined) {
          handler = this._createInvocationHandler(fn);

          this._handlers.set(fn, handler);
        }

        return handler.invoke(this, dynamicDependencies);
      } catch (e) {
        throw new AggregateError("Error invoking " + fn.name + ". Check the inner error for details.", e, true);
      }
    };

    _proto12._createInvocationHandler = function _createInvocationHandler(fn) {
      var dependencies;

      if (fn.inject === undefined) {
        dependencies = metadata.getOwn(metadata.paramTypes, fn) || _emptyParameters;
      } else {
        dependencies = [];
        var ctor = fn;

        while (typeof ctor === 'function') {
          var _dependencies;

          (_dependencies = dependencies).push.apply(_dependencies, getDependencies(ctor));

          ctor = Object.getPrototypeOf(ctor);
        }
      }

      var invoker = metadata.getOwn(metadata.invoker, fn) || classInvokers[dependencies.length] || classInvokers.fallback;
      var handler = new InvocationHandler(fn, invoker, dependencies);
      return this._onHandlerCreated !== undefined ? this._onHandlerCreated(handler) : handler;
    };

    return Container;
  }();
  function autoinject(potentialTarget) {
    var deco = function deco(target) {
      if (!target.hasOwnProperty('inject')) {
        target.inject = (metadata.getOwn(metadata.paramTypes, target) || _emptyParameters).slice();

        if (target.inject.length > 0 && target.inject[target.inject.length - 1] === Object) {
          target.inject.pop();
        }
      }
    };

    return potentialTarget ? deco(potentialTarget) : deco;
  }
  function inject() {
    for (var _len5 = arguments.length, rest = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      rest[_key5] = arguments[_key5];
    }

    return function (target, key, descriptor) {
      if (typeof descriptor === 'number') {
        autoinject(target);

        if (rest.length === 1) {
          target.inject[descriptor] = rest[0];
        }

        return;
      }

      if (descriptor) {
        var fn = descriptor.value;
        fn.inject = rest;
      } else {
        target.inject = rest;
      }
    };
  }

  var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

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
          var arrayKey = key + '[' + (_typeof$1(value[i]) === 'object' && value[i] !== null ? i : '') + ']';
          result = result.concat(buildParam(arrayKey, value[i]));
        }
      }
    } else if ((typeof value === 'undefined' ? 'undefined' : _typeof$1(value)) === 'object' && !traditional) {
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
        var prevValue = !currentParams[key] || _typeof$1(currentParams[key]) === 'object' ? currentParams[key] : [currentParams[key]];
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

  var TemplateDependency = function TemplateDependency(src, name) {
    this.src = src;
    this.name = name;
  };
  var TemplateRegistryEntry =
  /*#__PURE__*/
  function () {
    function TemplateRegistryEntry(address) {
      this.templateIsLoaded = false;
      this.factoryIsReady = false;
      this.resources = null;
      this.dependencies = null;
      this.address = address;
      this.onReady = null;
      this._template = null;
      this._factory = null;
    }

    var _proto = TemplateRegistryEntry.prototype;

    _proto.addDependency = function addDependency(src, name) {
      var finalSrc = typeof src === 'string' ? relativeToFile(src, this.address) : Origin.get(src).moduleId;
      this.dependencies.push(new TemplateDependency(finalSrc, name));
    };

    _createClass(TemplateRegistryEntry, [{
      key: "template",
      get: function get() {
        return this._template;
      },
      set: function set(value) {
        var address = this.address;
        var requires;
        var current;
        var src;
        var dependencies;
        this._template = value;
        this.templateIsLoaded = true;
        requires = value.content.querySelectorAll('require');
        dependencies = this.dependencies = new Array(requires.length);

        for (var i = 0, ii = requires.length; i < ii; ++i) {
          current = requires[i];
          src = current.getAttribute('from');

          if (!src) {
            throw new Error("<require> element in " + address + " has no \"from\" attribute.");
          }

          dependencies[i] = new TemplateDependency(relativeToFile(src, address), current.getAttribute('as'));

          if (current.parentNode) {
            current.parentNode.removeChild(current);
          }
        }
      }
    }, {
      key: "factory",
      get: function get() {
        return this._factory;
      },
      set: function set(value) {
        this._factory = value;
        this.factoryIsReady = true;
      }
    }]);

    return TemplateRegistryEntry;
  }();
  var Loader =
  /*#__PURE__*/
  function () {
    function Loader() {
      this.templateRegistry = {};
    }

    var _proto2 = Loader.prototype;

    _proto2.map = function map(id, source) {
      throw new Error('Loaders must implement map(id, source).');
    };

    _proto2.normalizeSync = function normalizeSync(moduleId, relativeTo) {
      throw new Error('Loaders must implement normalizeSync(moduleId, relativeTo).');
    };

    _proto2.normalize = function normalize(moduleId, relativeTo) {
      throw new Error('Loaders must implement normalize(moduleId: string, relativeTo: string): Promise<string>.');
    };

    _proto2.loadModule = function loadModule(id) {
      throw new Error('Loaders must implement loadModule(id).');
    };

    _proto2.loadAllModules = function loadAllModules(ids) {
      throw new Error('Loader must implement loadAllModules(ids).');
    };

    _proto2.loadTemplate = function loadTemplate(url) {
      throw new Error('Loader must implement loadTemplate(url).');
    };

    _proto2.loadText = function loadText(url) {
      throw new Error('Loader must implement loadText(url).');
    };

    _proto2.applyPluginToUrl = function applyPluginToUrl(url, pluginName) {
      throw new Error('Loader must implement applyPluginToUrl(url, pluginName).');
    };

    _proto2.addPlugin = function addPlugin(pluginName, implementation) {
      throw new Error('Loader must implement addPlugin(pluginName, implementation).');
    };

    _proto2.getOrCreateTemplateRegistryEntry = function getOrCreateTemplateRegistryEntry(address) {
      return this.templateRegistry[address] || (this.templateRegistry[address] = new TemplateRegistryEntry(address));
    };

    return Loader;
  }();

  var stackSeparator = '\nEnqueued in TaskQueue by:\n';
  var microStackSeparator = '\nEnqueued in MicroTaskQueue by:\n';

  function makeRequestFlushFromMutationObserver(flush) {
    var observer = DOM.createMutationObserver(flush);
    var val = 'a';
    var node = DOM.createTextNode('a');
    var values = Object.create(null);
    values.a = 'b';
    values.b = 'a';
    observer.observe(node, {
      characterData: true
    });
    return function requestFlush() {
      node.data = val = values[val];
    };
  }

  function makeRequestFlushFromTimer(flush) {
    return function requestFlush() {
      var timeoutHandle = setTimeout(handleFlushTimer, 0);
      var intervalHandle = setInterval(handleFlushTimer, 50);

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
      setTimeout(function () {
        throw error;
      }, 0);
    }
  }

  var TaskQueue =
  /*#__PURE__*/
  function () {
    function TaskQueue() {
      var _this = this;

      this.flushing = false;
      this.longStacks = false;
      this.microTaskQueue = [];
      this.microTaskQueueCapacity = 1024;
      this.taskQueue = [];

      if (FEATURE.mutationObserver) {
        this.requestFlushMicroTaskQueue = makeRequestFlushFromMutationObserver(function () {
          return _this.flushMicroTaskQueue();
        });
      } else {
        this.requestFlushMicroTaskQueue = makeRequestFlushFromTimer(function () {
          return _this.flushMicroTaskQueue();
        });
      }

      this.requestFlushTaskQueue = makeRequestFlushFromTimer(function () {
        return _this.flushTaskQueue();
      });
    }

    var _proto = TaskQueue.prototype;

    _proto._flushQueue = function _flushQueue(queue, capacity) {
      var index = 0;
      var task;

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
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
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
    };

    _proto.queueMicroTask = function queueMicroTask(task) {
      if (this.microTaskQueue.length < 1) {
        this.requestFlushMicroTaskQueue();
      }

      if (this.longStacks) {
        task.stack = this.prepareQueueStack(microStackSeparator);
      }

      this.microTaskQueue.push(task);
    };

    _proto.queueTask = function queueTask(task) {
      if (this.taskQueue.length < 1) {
        this.requestFlushTaskQueue();
      }

      if (this.longStacks) {
        task.stack = this.prepareQueueStack(stackSeparator);
      }

      this.taskQueue.push(task);
    };

    _proto.flushTaskQueue = function flushTaskQueue() {
      var queue = this.taskQueue;
      this.taskQueue = [];

      this._flushQueue(queue, Number.MAX_VALUE);
    };

    _proto.flushMicroTaskQueue = function flushMicroTaskQueue() {
      var queue = this.microTaskQueue;

      this._flushQueue(queue, this.microTaskQueueCapacity);

      queue.length = 0;
    };

    _proto.prepareQueueStack = function prepareQueueStack(separator) {
      var stack = separator + filterQueueStack(captureStack());

      if (typeof this.stack === 'string') {
        stack = filterFlushStack(stack) + this.stack;
      }

      return stack;
    };

    return TaskQueue;
  }();

  function captureStack() {
    var error = new Error();

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
    var index = stack.lastIndexOf('flushMicroTaskQueue');

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
  var targetContext = 'Binding:target';
  var sourceContext = 'Binding:source';
  var map = Object.create(null);
  function camelCase(name) {
    if (name in map) {
      return map[name];
    }

    var result = name.charAt(0).toLowerCase() + name.slice(1).replace(/[_.-](\w|$)/g, function (_, x) {
      return x.toUpperCase();
    });
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
    var oc = scope.overrideContext;

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
        bindingContext: bindingContext,
        overrideContext: createOverrideContext(bindingContext, createOverrideContext(parentBindingContext))
      };
    }

    return {
      bindingContext: bindingContext,
      overrideContext: createOverrideContext(bindingContext)
    };
  }
  var slotNames = [];
  var versionSlotNames = [];

  for (var i = 0; i < 100; i++) {
    slotNames.push("_observer" + i);
    versionSlotNames.push("_observerVersion" + i);
  }

  function addObserver(observer) {
    var observerSlots = this._observerSlots === undefined ? 0 : this._observerSlots;
    var i = observerSlots;

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
    var observer = this.observerLocator.getObserver(obj, propertyName);
    addObserver.call(this, observer);
  }

  function observeArray(array) {
    var observer = this.observerLocator.getArrayObserver(array);
    addObserver.call(this, observer);
  }

  function unobserve(all) {
    var i = this._observerSlots;

    while (i--) {
      if (all || this[versionSlotNames[i]] !== this._version) {
        var observer = this[slotNames[i]];
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
  var queue = [];
  var queued = {};
  var nextId = 0;
  var minimumImmediate = 100;
  var frameBudget = 15;
  var isFlushRequested = false;
  var immediate = 0;

  function flush(animationFrameStart) {
    var length = queue.length;
    var i = 0;

    while (i < length) {
      var binding = queue[i];
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
      var id = binding.__connectQueueId;

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

    var callables = this._callablesRest;

    if (callables === undefined || callables.length === 0) {
      return false;
    }

    var contexts = this._contextsRest;
    var i = 0;

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

  var arrayPool1 = [];
  var arrayPool2 = [];
  var poolUtilization = [];

  function callSubscribers(newValue, oldValue) {
    var context0 = this._context0;
    var callable0 = this._callable0;
    var context1 = this._context1;
    var callable1 = this._callable1;
    var context2 = this._context2;
    var callable2 = this._callable2;
    var length = this._contextsRest ? this._contextsRest.length : 0;
    var contextsRest;
    var callablesRest;
    var poolIndex;
    var i;

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
        var callable = callablesRest[i];
        var context = contextsRest[i];

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
    var has = this._context0 === context && this._callable0 === callable || this._context1 === context && this._callable1 === callable || this._context2 === context && this._callable2 === callable;

    if (has) {
      return true;
    }

    var index;
    var contexts = this._contextsRest;

    if (!contexts || (index = contexts.length) === 0) {
      return false;
    }

    var callables = this._callablesRest;

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
  var ExpressionObserver = (_dec$1 = connectable(), _dec2$1 = subscriberCollection(), _dec$1(_class$1 = _dec2$1(_class$1 =
  /*#__PURE__*/
  function () {
    function ExpressionObserver(scope, expression, observerLocator, lookupFunctions) {
      this.scope = scope;
      this.expression = expression;
      this.observerLocator = observerLocator;
      this.lookupFunctions = lookupFunctions;
    }

    var _proto = ExpressionObserver.prototype;

    _proto.getValue = function getValue() {
      return this.expression.evaluate(this.scope, this.lookupFunctions);
    };

    _proto.setValue = function setValue(newValue) {
      this.expression.assign(this.scope, newValue);
    };

    _proto.subscribe = function subscribe(context, callable) {
      var _this = this;

      if (!this.hasSubscribers()) {
        this.oldValue = this.expression.evaluate(this.scope, this.lookupFunctions);
        this.expression.connect(this, this.scope);
      }

      this.addSubscriber(context, callable);

      if (arguments.length === 1 && context instanceof Function) {
        return {
          dispose: function dispose() {
            _this.unsubscribe(context, callable);
          }
        };
      }
    };

    _proto.unsubscribe = function unsubscribe(context, callable) {
      if (this.removeSubscriber(context, callable) && !this.hasSubscribers()) {
        this.unobserve(true);
        this.oldValue = undefined;
      }
    };

    _proto.call = function call() {
      var newValue = this.expression.evaluate(this.scope, this.lookupFunctions);
      var oldValue = this.oldValue;

      if (newValue !== oldValue) {
        this.oldValue = newValue;
        this.callSubscribers(newValue, oldValue);
      }

      this._version++;
      this.expression.connect(this, this.scope);
      this.unobserve(false);
    };

    return ExpressionObserver;
  }()) || _class$1) || _class$1);

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

  var EDIT_LEAVE = 0;
  var EDIT_UPDATE = 1;
  var EDIT_ADD = 2;
  var EDIT_DELETE = 3;

  function ArraySplice() {}

  ArraySplice.prototype = {
    calcEditDistances: function calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd) {
      var rowCount = oldEnd - oldStart + 1;
      var columnCount = currentEnd - currentStart + 1;
      var distances = new Array(rowCount);
      var north;
      var west;

      for (var _i = 0; _i < rowCount; ++_i) {
        distances[_i] = new Array(columnCount);
        distances[_i][0] = _i;
      }

      for (var j = 0; j < columnCount; ++j) {
        distances[0][j] = j;
      }

      for (var _i2 = 1; _i2 < rowCount; ++_i2) {
        for (var _j = 1; _j < columnCount; ++_j) {
          if (this.equals(current[currentStart + _j - 1], old[oldStart + _i2 - 1])) {
            distances[_i2][_j] = distances[_i2 - 1][_j - 1];
          } else {
            north = distances[_i2 - 1][_j] + 1;
            west = distances[_i2][_j - 1] + 1;
            distances[_i2][_j] = north < west ? north : west;
          }
        }
      }

      return distances;
    },
    spliceOperationsFromEditDistances: function spliceOperationsFromEditDistances(distances) {
      var i = distances.length - 1;
      var j = distances[0].length - 1;
      var current = distances[i][j];
      var edits = [];

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

        var northWest = distances[i - 1][j - 1];
        var west = distances[i - 1][j];
        var north = distances[i][j - 1];
        var min = void 0;

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
    calcSplices: function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
      var prefixCount = 0;
      var suffixCount = 0;
      var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);

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
        var _splice = newSplice(currentStart, [], 0);

        while (oldStart < oldEnd) {
          _splice.removed.push(old[oldStart++]);
        }

        return [_splice];
      } else if (oldStart === oldEnd) {
        return [newSplice(currentStart, [], currentEnd - currentStart)];
      }

      var ops = this.spliceOperationsFromEditDistances(this.calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd));
      var splice = undefined;
      var splices = [];
      var index = currentStart;
      var oldIndex = oldStart;

      for (var _i3 = 0; _i3 < ops.length; ++_i3) {
        switch (ops[_i3]) {
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
    sharedPrefix: function sharedPrefix(current, old, searchLength) {
      for (var _i4 = 0; _i4 < searchLength; ++_i4) {
        if (!this.equals(current[_i4], old[_i4])) {
          return _i4;
        }
      }

      return searchLength;
    },
    sharedSuffix: function sharedSuffix(current, old, searchLength) {
      var index1 = current.length;
      var index2 = old.length;
      var count = 0;

      while (count < searchLength && this.equals(current[--index1], old[--index2])) {
        count++;
      }

      return count;
    },
    calculateSplices: function calculateSplices(current, previous) {
      return this.calcSplices(current, 0, current.length, previous, 0, previous.length);
    },
    equals: function equals(currentValue, previousValue) {
      return currentValue === previousValue;
    }
  };
  var arraySplice = new ArraySplice();
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
    var splice = newSplice(index, removed, addedCount);
    var inserted = false;
    var insertionOffset = 0;

    for (var _i5 = 0; _i5 < splices.length; _i5++) {
      var current = splices[_i5];
      current.index += insertionOffset;

      if (inserted) {
        continue;
      }

      var intersectCount = intersect(splice.index, splice.index + splice.removed.length, current.index, current.index + current.addedCount);

      if (intersectCount >= 0) {
        splices.splice(_i5, 1);
        _i5--;
        insertionOffset -= current.addedCount - current.removed.length;
        splice.addedCount += current.addedCount - intersectCount;
        var deleteCount = splice.removed.length + current.removed.length - intersectCount;

        if (!splice.addedCount && !deleteCount) {
          inserted = true;
        } else {
          var currentRemoved = current.removed;

          if (splice.index < current.index) {
            var prepend = splice.removed.slice(0, current.index - splice.index);
            Array.prototype.push.apply(prepend, currentRemoved);
            currentRemoved = prepend;
          }

          if (splice.index + splice.removed.length > current.index + current.addedCount) {
            var append = splice.removed.slice(current.index + current.addedCount - splice.index);
            Array.prototype.push.apply(currentRemoved, append);
          }

          splice.removed = currentRemoved;

          if (current.index < splice.index) {
            splice.index = current.index;
          }
        }
      } else if (splice.index < current.index) {
        inserted = true;
        splices.splice(_i5, 0, splice);
        _i5++;
        var offset = splice.addedCount - splice.removed.length;
        current.index += offset;
        insertionOffset += offset;
      }
    }

    if (!inserted) {
      splices.push(splice);
    }
  }

  function createInitialSplices(array, changeRecords) {
    var splices = [];

    for (var _i6 = 0; _i6 < changeRecords.length; _i6++) {
      var record = changeRecords[_i6];

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

          var index = toNumber(record.name);

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
    var splices = [];
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
    var entries = new Array(map.size);
    var keys = map.keys();
    var i = 0;
    var item;

    while (item = keys.next()) {
      if (item.done) {
        break;
      }

      entries[i] = newRecord('added', map, item.value);
      i++;
    }

    return entries;
  }
  var ModifyCollectionObserver = (_dec3$1 = subscriberCollection(), _dec3$1(_class2$1 =
  /*#__PURE__*/
  function () {
    function ModifyCollectionObserver(taskQueue, collection) {
      this.taskQueue = taskQueue;
      this.queued = false;
      this.changeRecords = null;
      this.oldCollection = null;
      this.collection = collection;
      this.lengthPropertyName = collection instanceof Map || collection instanceof Set ? 'size' : 'length';
    }

    var _proto2 = ModifyCollectionObserver.prototype;

    _proto2.subscribe = function subscribe(context, callable) {
      this.addSubscriber(context, callable);
    };

    _proto2.unsubscribe = function unsubscribe(context, callable) {
      this.removeSubscriber(context, callable);
    };

    _proto2.addChangeRecord = function addChangeRecord(changeRecord) {
      if (!this.hasSubscribers() && !this.lengthObserver) {
        return;
      }

      if (changeRecord.type === 'splice') {
        var index = changeRecord.index;
        var arrayLength = changeRecord.object.length;

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
    };

    _proto2.flushChangeRecords = function flushChangeRecords() {
      if (this.changeRecords && this.changeRecords.length || this.oldCollection) {
        this.call();
      }
    };

    _proto2.reset = function reset(oldCollection) {
      this.oldCollection = oldCollection;

      if (this.hasSubscribers() && !this.queued) {
        this.queued = true;
        this.taskQueue.queueMicroTask(this);
      }
    };

    _proto2.getLengthObserver = function getLengthObserver() {
      return this.lengthObserver || (this.lengthObserver = new CollectionLengthObserver(this.collection));
    };

    _proto2.call = function call() {
      var changeRecords = this.changeRecords;
      var oldCollection = this.oldCollection;
      var records;
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
    };

    return ModifyCollectionObserver;
  }()) || _class2$1);
  var CollectionLengthObserver = (_dec4$1 = subscriberCollection(), _dec4$1(_class3$1 =
  /*#__PURE__*/
  function () {
    function CollectionLengthObserver(collection) {
      this.collection = collection;
      this.lengthPropertyName = collection instanceof Map || collection instanceof Set ? 'size' : 'length';
      this.currentValue = collection[this.lengthPropertyName];
    }

    var _proto3 = CollectionLengthObserver.prototype;

    _proto3.getValue = function getValue() {
      return this.collection[this.lengthPropertyName];
    };

    _proto3.setValue = function setValue(newValue) {
      this.collection[this.lengthPropertyName] = newValue;
    };

    _proto3.subscribe = function subscribe(context, callable) {
      this.addSubscriber(context, callable);
    };

    _proto3.unsubscribe = function unsubscribe(context, callable) {
      this.removeSubscriber(context, callable);
    };

    _proto3.call = function call(newValue) {
      var oldValue = this.currentValue;
      this.callSubscribers(newValue, oldValue);
      this.currentValue = newValue;
    };

    return CollectionLengthObserver;
  }()) || _class3$1);
  var arrayProto = Array.prototype;
  var pop = arrayProto.pop;
  var push = arrayProto.push;
  var reverse = arrayProto.reverse;
  var shift = arrayProto.shift;
  var sort = arrayProto.sort;
  var splice = arrayProto.splice;
  var unshift = arrayProto.unshift;

  if (arrayProto.__au_patched__) {
    getLogger('array-observation').warn('Detected 2nd attempt of patching array from Aurelia binding.' + ' This is probably caused by dependency mismatch between core modules and a 3rd party plugin.' + ' Please see https://github.com/aurelia/cli/pull/906 if you are using webpack.');
  } else {
    Reflect.defineProperty(arrayProto, '__au_patched__', {
      value: 1
    });

    arrayProto.pop = function () {
      var notEmpty = this.length > 0;
      var methodCallResult = pop.apply(this, arguments);

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
      var methodCallResult = push.apply(this, arguments);

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
      var oldArray;

      if (this.__array_observer__ !== undefined) {
        this.__array_observer__.flushChangeRecords();

        oldArray = this.slice();
      }

      var methodCallResult = reverse.apply(this, arguments);

      if (this.__array_observer__ !== undefined) {
        this.__array_observer__.reset(oldArray);
      }

      return methodCallResult;
    };

    arrayProto.shift = function () {
      var notEmpty = this.length > 0;
      var methodCallResult = shift.apply(this, arguments);

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
      var oldArray;

      if (this.__array_observer__ !== undefined) {
        this.__array_observer__.flushChangeRecords();

        oldArray = this.slice();
      }

      var methodCallResult = sort.apply(this, arguments);

      if (this.__array_observer__ !== undefined) {
        this.__array_observer__.reset(oldArray);
      }

      return methodCallResult;
    };

    arrayProto.splice = function () {
      var methodCallResult = splice.apply(this, arguments);

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
      var methodCallResult = unshift.apply(this, arguments);

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

  function _getArrayObserver(taskQueue, array) {
    return ModifyArrayObserver["for"](taskQueue, array);
  }

  var ModifyArrayObserver =
  /*#__PURE__*/
  function (_ModifyCollectionObse) {
    _inheritsLoose(ModifyArrayObserver, _ModifyCollectionObse);

    function ModifyArrayObserver(taskQueue, array) {
      return _ModifyCollectionObse.call(this, taskQueue, array) || this;
    }

    ModifyArrayObserver["for"] = function _for(taskQueue, array) {
      if (!('__array_observer__' in array)) {
        Reflect.defineProperty(array, '__array_observer__', {
          value: ModifyArrayObserver.create(taskQueue, array),
          enumerable: false,
          configurable: false
        });
      }

      return array.__array_observer__;
    };

    ModifyArrayObserver.create = function create(taskQueue, array) {
      return new ModifyArrayObserver(taskQueue, array);
    };

    return ModifyArrayObserver;
  }(ModifyCollectionObserver);

  var Expression =
  /*#__PURE__*/
  function () {
    function Expression() {
      this.isAssignable = false;
    }

    var _proto4 = Expression.prototype;

    _proto4.evaluate = function evaluate(scope, lookupFunctions, args) {
      throw new Error("Binding expression \"" + this + "\" cannot be evaluated.");
    };

    _proto4.assign = function assign(scope, value, lookupFunctions) {
      throw new Error("Binding expression \"" + this + "\" cannot be assigned to.");
    };

    _proto4.toString = function toString() {
      return typeof FEATURE_NO_UNPARSER === 'undefined' ? exports.Unparser.unparse(this) : Object.prototype.toString.call(this);
    };

    return Expression;
  }();
  var BindingBehavior =
  /*#__PURE__*/
  function (_Expression) {
    _inheritsLoose(BindingBehavior, _Expression);

    function BindingBehavior(expression, name, args) {
      var _this2;

      _this2 = _Expression.call(this) || this;
      _this2.expression = expression;
      _this2.name = name;
      _this2.args = args;
      return _this2;
    }

    var _proto5 = BindingBehavior.prototype;

    _proto5.evaluate = function evaluate(scope, lookupFunctions) {
      return this.expression.evaluate(scope, lookupFunctions);
    };

    _proto5.assign = function assign(scope, value, lookupFunctions) {
      return this.expression.assign(scope, value, lookupFunctions);
    };

    _proto5.accept = function accept(visitor) {
      return visitor.visitBindingBehavior(this);
    };

    _proto5.connect = function connect(binding, scope) {
      this.expression.connect(binding, scope);
    };

    _proto5.bind = function bind(binding, scope, lookupFunctions) {
      if (this.expression.expression && this.expression.bind) {
        this.expression.bind(binding, scope, lookupFunctions);
      }

      var behavior = lookupFunctions.bindingBehaviors(this.name);

      if (!behavior) {
        throw new Error("No BindingBehavior named \"" + this.name + "\" was found!");
      }

      var behaviorKey = "behavior-" + this.name;

      if (binding[behaviorKey]) {
        throw new Error("A binding behavior named \"" + this.name + "\" has already been applied to \"" + this.expression + "\"");
      }

      binding[behaviorKey] = behavior;
      behavior.bind.apply(behavior, [binding, scope].concat(evalList(scope, this.args, binding.lookupFunctions)));
    };

    _proto5.unbind = function unbind(binding, scope) {
      var behaviorKey = "behavior-" + this.name;
      binding[behaviorKey].unbind(binding, scope);
      binding[behaviorKey] = null;

      if (this.expression.expression && this.expression.unbind) {
        this.expression.unbind(binding, scope);
      }
    };

    return BindingBehavior;
  }(Expression);
  var ValueConverter =
  /*#__PURE__*/
  function (_Expression2) {
    _inheritsLoose(ValueConverter, _Expression2);

    function ValueConverter(expression, name, args) {
      var _this3;

      _this3 = _Expression2.call(this) || this;
      _this3.expression = expression;
      _this3.name = name;
      _this3.args = args;
      _this3.allArgs = [expression].concat(args);
      return _this3;
    }

    var _proto6 = ValueConverter.prototype;

    _proto6.evaluate = function evaluate(scope, lookupFunctions) {
      var converter = lookupFunctions.valueConverters(this.name);

      if (!converter) {
        throw new Error("No ValueConverter named \"" + this.name + "\" was found!");
      }

      if ('toView' in converter) {
        return converter.toView.apply(converter, evalList(scope, this.allArgs, lookupFunctions));
      }

      return this.allArgs[0].evaluate(scope, lookupFunctions);
    };

    _proto6.assign = function assign(scope, value, lookupFunctions) {
      var converter = lookupFunctions.valueConverters(this.name);

      if (!converter) {
        throw new Error("No ValueConverter named \"" + this.name + "\" was found!");
      }

      if ('fromView' in converter) {
        value = converter.fromView.apply(converter, [value].concat(evalList(scope, this.args, lookupFunctions)));
      }

      return this.allArgs[0].assign(scope, value, lookupFunctions);
    };

    _proto6.accept = function accept(visitor) {
      return visitor.visitValueConverter(this);
    };

    _proto6.connect = function connect(binding, scope) {
      var expressions = this.allArgs;
      var i = expressions.length;

      while (i--) {
        expressions[i].connect(binding, scope);
      }

      var converter = binding.lookupFunctions.valueConverters(this.name);

      if (!converter) {
        throw new Error("No ValueConverter named \"" + this.name + "\" was found!");
      }

      var signals = converter.signals;

      if (signals === undefined) {
        return;
      }

      i = signals.length;

      while (i--) {
        connectBindingToSignal(binding, signals[i]);
      }
    };

    return ValueConverter;
  }(Expression);
  var Assign =
  /*#__PURE__*/
  function (_Expression3) {
    _inheritsLoose(Assign, _Expression3);

    function Assign(target, value) {
      var _this4;

      _this4 = _Expression3.call(this) || this;
      _this4.target = target;
      _this4.value = value;
      _this4.isAssignable = true;
      return _this4;
    }

    var _proto7 = Assign.prototype;

    _proto7.evaluate = function evaluate(scope, lookupFunctions) {
      return this.target.assign(scope, this.value.evaluate(scope, lookupFunctions));
    };

    _proto7.accept = function accept(vistor) {
      vistor.visitAssign(this);
    };

    _proto7.connect = function connect(binding, scope) {};

    _proto7.assign = function assign(scope, value) {
      this.value.assign(scope, value);
      this.target.assign(scope, value);
    };

    return Assign;
  }(Expression);
  var Conditional =
  /*#__PURE__*/
  function (_Expression4) {
    _inheritsLoose(Conditional, _Expression4);

    function Conditional(condition, yes, no) {
      var _this5;

      _this5 = _Expression4.call(this) || this;
      _this5.condition = condition;
      _this5.yes = yes;
      _this5.no = no;
      return _this5;
    }

    var _proto8 = Conditional.prototype;

    _proto8.evaluate = function evaluate(scope, lookupFunctions) {
      return !!this.condition.evaluate(scope, lookupFunctions) ? this.yes.evaluate(scope, lookupFunctions) : this.no.evaluate(scope, lookupFunctions);
    };

    _proto8.accept = function accept(visitor) {
      return visitor.visitConditional(this);
    };

    _proto8.connect = function connect(binding, scope) {
      this.condition.connect(binding, scope);

      if (this.condition.evaluate(scope)) {
        this.yes.connect(binding, scope);
      } else {
        this.no.connect(binding, scope);
      }
    };

    return Conditional;
  }(Expression);
  var AccessThis =
  /*#__PURE__*/
  function (_Expression5) {
    _inheritsLoose(AccessThis, _Expression5);

    function AccessThis(ancestor) {
      var _this6;

      _this6 = _Expression5.call(this) || this;
      _this6.ancestor = ancestor;
      return _this6;
    }

    var _proto9 = AccessThis.prototype;

    _proto9.evaluate = function evaluate(scope, lookupFunctions) {
      var oc = scope.overrideContext;
      var i = this.ancestor;

      while (i-- && oc) {
        oc = oc.parentOverrideContext;
      }

      return i < 1 && oc ? oc.bindingContext : undefined;
    };

    _proto9.accept = function accept(visitor) {
      return visitor.visitAccessThis(this);
    };

    _proto9.connect = function connect(binding, scope) {};

    return AccessThis;
  }(Expression);
  var AccessScope =
  /*#__PURE__*/
  function (_Expression6) {
    _inheritsLoose(AccessScope, _Expression6);

    function AccessScope(name, ancestor) {
      var _this7;

      _this7 = _Expression6.call(this) || this;
      _this7.name = name;
      _this7.ancestor = ancestor;
      _this7.isAssignable = true;
      return _this7;
    }

    var _proto10 = AccessScope.prototype;

    _proto10.evaluate = function evaluate(scope, lookupFunctions) {
      var context = getContextFor(this.name, scope, this.ancestor);
      return context[this.name];
    };

    _proto10.assign = function assign(scope, value) {
      var context = getContextFor(this.name, scope, this.ancestor);
      return context ? context[this.name] = value : undefined;
    };

    _proto10.accept = function accept(visitor) {
      return visitor.visitAccessScope(this);
    };

    _proto10.connect = function connect(binding, scope) {
      var context = getContextFor(this.name, scope, this.ancestor);
      binding.observeProperty(context, this.name);
    };

    return AccessScope;
  }(Expression);
  var AccessMember =
  /*#__PURE__*/
  function (_Expression7) {
    _inheritsLoose(AccessMember, _Expression7);

    function AccessMember(object, name) {
      var _this8;

      _this8 = _Expression7.call(this) || this;
      _this8.object = object;
      _this8.name = name;
      _this8.isAssignable = true;
      return _this8;
    }

    var _proto11 = AccessMember.prototype;

    _proto11.evaluate = function evaluate(scope, lookupFunctions) {
      var instance = this.object.evaluate(scope, lookupFunctions);
      return instance === null || instance === undefined ? instance : instance[this.name];
    };

    _proto11.assign = function assign(scope, value) {
      var instance = this.object.evaluate(scope);

      if (instance === null || instance === undefined) {
        instance = {};
        this.object.assign(scope, instance);
      }

      instance[this.name] = value;
      return value;
    };

    _proto11.accept = function accept(visitor) {
      return visitor.visitAccessMember(this);
    };

    _proto11.connect = function connect(binding, scope) {
      this.object.connect(binding, scope);
      var obj = this.object.evaluate(scope);

      if (obj) {
        binding.observeProperty(obj, this.name);
      }
    };

    return AccessMember;
  }(Expression);
  var AccessKeyed =
  /*#__PURE__*/
  function (_Expression8) {
    _inheritsLoose(AccessKeyed, _Expression8);

    function AccessKeyed(object, key) {
      var _this9;

      _this9 = _Expression8.call(this) || this;
      _this9.object = object;
      _this9.key = key;
      _this9.isAssignable = true;
      return _this9;
    }

    var _proto12 = AccessKeyed.prototype;

    _proto12.evaluate = function evaluate(scope, lookupFunctions) {
      var instance = this.object.evaluate(scope, lookupFunctions);
      var lookup = this.key.evaluate(scope, lookupFunctions);
      return getKeyed(instance, lookup);
    };

    _proto12.assign = function assign(scope, value) {
      var instance = this.object.evaluate(scope);
      var lookup = this.key.evaluate(scope);
      return setKeyed(instance, lookup, value);
    };

    _proto12.accept = function accept(visitor) {
      return visitor.visitAccessKeyed(this);
    };

    _proto12.connect = function connect(binding, scope) {
      this.object.connect(binding, scope);
      var obj = this.object.evaluate(scope);

      if (obj instanceof Object) {
        this.key.connect(binding, scope);
        var key = this.key.evaluate(scope);

        if (key !== null && key !== undefined && !(Array.isArray(obj) && typeof key === 'number')) {
          binding.observeProperty(obj, key);
        }
      }
    };

    return AccessKeyed;
  }(Expression);
  var CallScope =
  /*#__PURE__*/
  function (_Expression9) {
    _inheritsLoose(CallScope, _Expression9);

    function CallScope(name, args, ancestor) {
      var _this10;

      _this10 = _Expression9.call(this) || this;
      _this10.name = name;
      _this10.args = args;
      _this10.ancestor = ancestor;
      return _this10;
    }

    var _proto13 = CallScope.prototype;

    _proto13.evaluate = function evaluate(scope, lookupFunctions, mustEvaluate) {
      var args = evalList(scope, this.args, lookupFunctions);
      var context = getContextFor(this.name, scope, this.ancestor);
      var func = getFunction(context, this.name, mustEvaluate);

      if (func) {
        return func.apply(context, args);
      }

      return undefined;
    };

    _proto13.accept = function accept(visitor) {
      return visitor.visitCallScope(this);
    };

    _proto13.connect = function connect(binding, scope) {
      var args = this.args;
      var i = args.length;

      while (i--) {
        args[i].connect(binding, scope);
      }
    };

    return CallScope;
  }(Expression);
  var CallMember =
  /*#__PURE__*/
  function (_Expression10) {
    _inheritsLoose(CallMember, _Expression10);

    function CallMember(object, name, args) {
      var _this11;

      _this11 = _Expression10.call(this) || this;
      _this11.object = object;
      _this11.name = name;
      _this11.args = args;
      return _this11;
    }

    var _proto14 = CallMember.prototype;

    _proto14.evaluate = function evaluate(scope, lookupFunctions, mustEvaluate) {
      var instance = this.object.evaluate(scope, lookupFunctions);
      var args = evalList(scope, this.args, lookupFunctions);
      var func = getFunction(instance, this.name, mustEvaluate);

      if (func) {
        return func.apply(instance, args);
      }

      return undefined;
    };

    _proto14.accept = function accept(visitor) {
      return visitor.visitCallMember(this);
    };

    _proto14.connect = function connect(binding, scope) {
      this.object.connect(binding, scope);
      var obj = this.object.evaluate(scope);

      if (getFunction(obj, this.name, false)) {
        var args = this.args;
        var _i7 = args.length;

        while (_i7--) {
          args[_i7].connect(binding, scope);
        }
      }
    };

    return CallMember;
  }(Expression);
  var CallFunction =
  /*#__PURE__*/
  function (_Expression11) {
    _inheritsLoose(CallFunction, _Expression11);

    function CallFunction(func, args) {
      var _this12;

      _this12 = _Expression11.call(this) || this;
      _this12.func = func;
      _this12.args = args;
      return _this12;
    }

    var _proto15 = CallFunction.prototype;

    _proto15.evaluate = function evaluate(scope, lookupFunctions, mustEvaluate) {
      var func = this.func.evaluate(scope, lookupFunctions);

      if (typeof func === 'function') {
        return func.apply(null, evalList(scope, this.args, lookupFunctions));
      }

      if (!mustEvaluate && (func === null || func === undefined)) {
        return undefined;
      }

      throw new Error(this.func + " is not a function");
    };

    _proto15.accept = function accept(visitor) {
      return visitor.visitCallFunction(this);
    };

    _proto15.connect = function connect(binding, scope) {
      this.func.connect(binding, scope);
      var func = this.func.evaluate(scope);

      if (typeof func === 'function') {
        var args = this.args;
        var _i8 = args.length;

        while (_i8--) {
          args[_i8].connect(binding, scope);
        }
      }
    };

    return CallFunction;
  }(Expression);
  var Binary =
  /*#__PURE__*/
  function (_Expression12) {
    _inheritsLoose(Binary, _Expression12);

    function Binary(operation, left, right) {
      var _this13;

      _this13 = _Expression12.call(this) || this;
      _this13.operation = operation;
      _this13.left = left;
      _this13.right = right;
      return _this13;
    }

    var _proto16 = Binary.prototype;

    _proto16.evaluate = function evaluate(scope, lookupFunctions) {
      var left = this.left.evaluate(scope, lookupFunctions);

      switch (this.operation) {
        case '&&':
          return left && this.right.evaluate(scope, lookupFunctions);

        case '||':
          return left || this.right.evaluate(scope, lookupFunctions);
      }

      var right = this.right.evaluate(scope, lookupFunctions);

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

      throw new Error("Internal error [" + this.operation + "] not handled");
    };

    _proto16.accept = function accept(visitor) {
      return visitor.visitBinary(this);
    };

    _proto16.connect = function connect(binding, scope) {
      this.left.connect(binding, scope);
      var left = this.left.evaluate(scope);

      if (this.operation === '&&' && !left || this.operation === '||' && left) {
        return;
      }

      this.right.connect(binding, scope);
    };

    return Binary;
  }(Expression);
  var Unary =
  /*#__PURE__*/
  function (_Expression13) {
    _inheritsLoose(Unary, _Expression13);

    function Unary(operation, expression) {
      var _this14;

      _this14 = _Expression13.call(this) || this;
      _this14.operation = operation;
      _this14.expression = expression;
      return _this14;
    }

    var _proto17 = Unary.prototype;

    _proto17.evaluate = function evaluate(scope, lookupFunctions) {
      switch (this.operation) {
        case '!':
          return !this.expression.evaluate(scope, lookupFunctions);

        case 'typeof':
          return typeof this.expression.evaluate(scope, lookupFunctions);

        case 'void':
          return void this.expression.evaluate(scope, lookupFunctions);
      }

      throw new Error("Internal error [" + this.operation + "] not handled");
    };

    _proto17.accept = function accept(visitor) {
      return visitor.visitPrefix(this);
    };

    _proto17.connect = function connect(binding, scope) {
      this.expression.connect(binding, scope);
    };

    return Unary;
  }(Expression);
  var LiteralPrimitive =
  /*#__PURE__*/
  function (_Expression14) {
    _inheritsLoose(LiteralPrimitive, _Expression14);

    function LiteralPrimitive(value) {
      var _this15;

      _this15 = _Expression14.call(this) || this;
      _this15.value = value;
      return _this15;
    }

    var _proto18 = LiteralPrimitive.prototype;

    _proto18.evaluate = function evaluate(scope, lookupFunctions) {
      return this.value;
    };

    _proto18.accept = function accept(visitor) {
      return visitor.visitLiteralPrimitive(this);
    };

    _proto18.connect = function connect(binding, scope) {};

    return LiteralPrimitive;
  }(Expression);
  var LiteralString =
  /*#__PURE__*/
  function (_Expression15) {
    _inheritsLoose(LiteralString, _Expression15);

    function LiteralString(value) {
      var _this16;

      _this16 = _Expression15.call(this) || this;
      _this16.value = value;
      return _this16;
    }

    var _proto19 = LiteralString.prototype;

    _proto19.evaluate = function evaluate(scope, lookupFunctions) {
      return this.value;
    };

    _proto19.accept = function accept(visitor) {
      return visitor.visitLiteralString(this);
    };

    _proto19.connect = function connect(binding, scope) {};

    return LiteralString;
  }(Expression);
  var LiteralTemplate =
  /*#__PURE__*/
  function (_Expression16) {
    _inheritsLoose(LiteralTemplate, _Expression16);

    function LiteralTemplate(cooked, expressions, raw, tag) {
      var _this17;

      _this17 = _Expression16.call(this) || this;
      _this17.cooked = cooked;
      _this17.expressions = expressions || [];
      _this17.length = _this17.expressions.length;
      _this17.tagged = tag !== undefined;

      if (_this17.tagged) {
        _this17.cooked.raw = raw;
        _this17.tag = tag;

        if (tag instanceof AccessScope) {
          _this17.contextType = 'Scope';
        } else if (tag instanceof AccessMember || tag instanceof AccessKeyed) {
          _this17.contextType = 'Object';
        } else {
          throw new Error(_this17.tag + " is not a valid template tag");
        }
      }

      return _this17;
    }

    var _proto20 = LiteralTemplate.prototype;

    _proto20.getScopeContext = function getScopeContext(scope, lookupFunctions) {
      return getContextFor(this.tag.name, scope, this.tag.ancestor);
    };

    _proto20.getObjectContext = function getObjectContext(scope, lookupFunctions) {
      return this.tag.object.evaluate(scope, lookupFunctions);
    };

    _proto20.evaluate = function evaluate(scope, lookupFunctions, mustEvaluate) {
      var results = new Array(this.length);

      for (var _i9 = 0; _i9 < this.length; _i9++) {
        results[_i9] = this.expressions[_i9].evaluate(scope, lookupFunctions);
      }

      if (this.tagged) {
        var func = this.tag.evaluate(scope, lookupFunctions);

        if (typeof func === 'function') {
          var context = this["get" + this.contextType + "Context"](scope, lookupFunctions);
          return func.call.apply(func, [context, this.cooked].concat(results));
        }

        if (!mustEvaluate) {
          return null;
        }

        throw new Error(this.tag + " is not a function");
      }

      var result = this.cooked[0];

      for (var _i10 = 0; _i10 < this.length; _i10++) {
        result = String.prototype.concat(result, results[_i10], this.cooked[_i10 + 1]);
      }

      return result;
    };

    _proto20.accept = function accept(visitor) {
      return visitor.visitLiteralTemplate(this);
    };

    _proto20.connect = function connect(binding, scope) {
      for (var _i11 = 0; _i11 < this.length; _i11++) {
        this.expressions[_i11].connect(binding, scope);
      }

      if (this.tagged) {
        this.tag.connect(binding, scope);
      }
    };

    return LiteralTemplate;
  }(Expression);
  var LiteralArray =
  /*#__PURE__*/
  function (_Expression17) {
    _inheritsLoose(LiteralArray, _Expression17);

    function LiteralArray(elements) {
      var _this18;

      _this18 = _Expression17.call(this) || this;
      _this18.elements = elements;
      return _this18;
    }

    var _proto21 = LiteralArray.prototype;

    _proto21.evaluate = function evaluate(scope, lookupFunctions) {
      var elements = this.elements;
      var result = [];

      for (var _i12 = 0, length = elements.length; _i12 < length; ++_i12) {
        result[_i12] = elements[_i12].evaluate(scope, lookupFunctions);
      }

      return result;
    };

    _proto21.accept = function accept(visitor) {
      return visitor.visitLiteralArray(this);
    };

    _proto21.connect = function connect(binding, scope) {
      var length = this.elements.length;

      for (var _i13 = 0; _i13 < length; _i13++) {
        this.elements[_i13].connect(binding, scope);
      }
    };

    return LiteralArray;
  }(Expression);
  var LiteralObject =
  /*#__PURE__*/
  function (_Expression18) {
    _inheritsLoose(LiteralObject, _Expression18);

    function LiteralObject(keys, values) {
      var _this19;

      _this19 = _Expression18.call(this) || this;
      _this19.keys = keys;
      _this19.values = values;
      return _this19;
    }

    var _proto22 = LiteralObject.prototype;

    _proto22.evaluate = function evaluate(scope, lookupFunctions) {
      var instance = {};
      var keys = this.keys;
      var values = this.values;

      for (var _i14 = 0, length = keys.length; _i14 < length; ++_i14) {
        instance[keys[_i14]] = values[_i14].evaluate(scope, lookupFunctions);
      }

      return instance;
    };

    _proto22.accept = function accept(visitor) {
      return visitor.visitLiteralObject(this);
    };

    _proto22.connect = function connect(binding, scope) {
      var length = this.keys.length;

      for (var _i15 = 0; _i15 < length; _i15++) {
        this.values[_i15].connect(binding, scope);
      }
    };

    return LiteralObject;
  }(Expression);

  function evalList(scope, list, lookupFunctions) {
    var length = list.length;
    var result = [];

    for (var _i16 = 0; _i16 < length; _i16++) {
      result[_i16] = list[_i16].evaluate(scope, lookupFunctions);
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
    var func = obj === null || obj === undefined ? null : obj[name];

    if (typeof func === 'function') {
      return func;
    }

    if (!mustExist && (func === null || func === undefined)) {
      return null;
    }

    throw new Error(name + " is not a function");
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
      var index = parseInt(key, 10);

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

  if (typeof FEATURE_NO_UNPARSER === 'undefined') {
    exports.Unparser =
    /*#__PURE__*/
    function () {
      function Unparser(buffer) {
        this.buffer = buffer;
      }

      Unparser.unparse = function unparse(expression) {
        var buffer = [];
        var visitor = new exports.Unparser(buffer);
        expression.accept(visitor);
        return buffer.join('');
      };

      var _proto23 = Unparser.prototype;

      _proto23.write = function write(text) {
        this.buffer.push(text);
      };

      _proto23.writeArgs = function writeArgs(args) {
        this.write('(');

        for (var _i17 = 0, length = args.length; _i17 < length; ++_i17) {
          if (_i17 !== 0) {
            this.write(',');
          }

          args[_i17].accept(this);
        }

        this.write(')');
      };

      _proto23.visitBindingBehavior = function visitBindingBehavior(behavior) {
        var args = behavior.args;
        behavior.expression.accept(this);
        this.write("&" + behavior.name);

        for (var _i18 = 0, length = args.length; _i18 < length; ++_i18) {
          this.write(':');

          args[_i18].accept(this);
        }
      };

      _proto23.visitValueConverter = function visitValueConverter(converter) {
        var args = converter.args;
        converter.expression.accept(this);
        this.write("|" + converter.name);

        for (var _i19 = 0, length = args.length; _i19 < length; ++_i19) {
          this.write(':');

          args[_i19].accept(this);
        }
      };

      _proto23.visitAssign = function visitAssign(assign) {
        assign.target.accept(this);
        this.write('=');
        assign.value.accept(this);
      };

      _proto23.visitConditional = function visitConditional(conditional) {
        conditional.condition.accept(this);
        this.write('?');
        conditional.yes.accept(this);
        this.write(':');
        conditional.no.accept(this);
      };

      _proto23.visitAccessThis = function visitAccessThis(access) {
        if (access.ancestor === 0) {
          this.write('$this');
          return;
        }

        this.write('$parent');
        var i = access.ancestor - 1;

        while (i--) {
          this.write('.$parent');
        }
      };

      _proto23.visitAccessScope = function visitAccessScope(access) {
        var i = access.ancestor;

        while (i--) {
          this.write('$parent.');
        }

        this.write(access.name);
      };

      _proto23.visitAccessMember = function visitAccessMember(access) {
        access.object.accept(this);
        this.write("." + access.name);
      };

      _proto23.visitAccessKeyed = function visitAccessKeyed(access) {
        access.object.accept(this);
        this.write('[');
        access.key.accept(this);
        this.write(']');
      };

      _proto23.visitCallScope = function visitCallScope(call) {
        var i = call.ancestor;

        while (i--) {
          this.write('$parent.');
        }

        this.write(call.name);
        this.writeArgs(call.args);
      };

      _proto23.visitCallFunction = function visitCallFunction(call) {
        call.func.accept(this);
        this.writeArgs(call.args);
      };

      _proto23.visitCallMember = function visitCallMember(call) {
        call.object.accept(this);
        this.write("." + call.name);
        this.writeArgs(call.args);
      };

      _proto23.visitPrefix = function visitPrefix(prefix) {
        this.write("(" + prefix.operation);

        if (prefix.operation.charCodeAt(0) >= 97) {
          this.write(' ');
        }

        prefix.expression.accept(this);
        this.write(')');
      };

      _proto23.visitBinary = function visitBinary(binary) {
        binary.left.accept(this);

        if (binary.operation.charCodeAt(0) === 105) {
          this.write(" " + binary.operation + " ");
        } else {
          this.write(binary.operation);
        }

        binary.right.accept(this);
      };

      _proto23.visitLiteralPrimitive = function visitLiteralPrimitive(literal) {
        this.write("" + literal.value);
      };

      _proto23.visitLiteralArray = function visitLiteralArray(literal) {
        var elements = literal.elements;
        this.write('[');

        for (var _i20 = 0, length = elements.length; _i20 < length; ++_i20) {
          if (_i20 !== 0) {
            this.write(',');
          }

          elements[_i20].accept(this);
        }

        this.write(']');
      };

      _proto23.visitLiteralObject = function visitLiteralObject(literal) {
        var keys = literal.keys;
        var values = literal.values;
        this.write('{');

        for (var _i21 = 0, length = keys.length; _i21 < length; ++_i21) {
          if (_i21 !== 0) {
            this.write(',');
          }

          this.write("'" + keys[_i21] + "':");

          values[_i21].accept(this);
        }

        this.write('}');
      };

      _proto23.visitLiteralString = function visitLiteralString(literal) {
        var escaped = literal.value.replace(/'/g, "\'");
        this.write("'" + escaped + "'");
      };

      _proto23.visitLiteralTemplate = function visitLiteralTemplate(literal) {
        var cooked = literal.cooked,
            expressions = literal.expressions;
        var length = expressions.length;
        this.write('`');
        this.write(cooked[0]);

        for (var _i22 = 0; _i22 < length; _i22++) {
          expressions[_i22].accept(this);

          this.write(cooked[_i22 + 1]);
        }

        this.write('`');
      };

      return Unparser;
    }();
  }

  var ExpressionCloner =
  /*#__PURE__*/
  function () {
    function ExpressionCloner() {}

    var _proto24 = ExpressionCloner.prototype;

    _proto24.cloneExpressionArray = function cloneExpressionArray(array) {
      var clonedArray = [];
      var i = array.length;

      while (i--) {
        clonedArray[i] = array[i].accept(this);
      }

      return clonedArray;
    };

    _proto24.visitBindingBehavior = function visitBindingBehavior(behavior) {
      return new BindingBehavior(behavior.expression.accept(this), behavior.name, this.cloneExpressionArray(behavior.args));
    };

    _proto24.visitValueConverter = function visitValueConverter(converter) {
      return new ValueConverter(converter.expression.accept(this), converter.name, this.cloneExpressionArray(converter.args));
    };

    _proto24.visitAssign = function visitAssign(assign) {
      return new Assign(assign.target.accept(this), assign.value.accept(this));
    };

    _proto24.visitConditional = function visitConditional(conditional) {
      return new Conditional(conditional.condition.accept(this), conditional.yes.accept(this), conditional.no.accept(this));
    };

    _proto24.visitAccessThis = function visitAccessThis(access) {
      return new AccessThis(access.ancestor);
    };

    _proto24.visitAccessScope = function visitAccessScope(access) {
      return new AccessScope(access.name, access.ancestor);
    };

    _proto24.visitAccessMember = function visitAccessMember(access) {
      return new AccessMember(access.object.accept(this), access.name);
    };

    _proto24.visitAccessKeyed = function visitAccessKeyed(access) {
      return new AccessKeyed(access.object.accept(this), access.key.accept(this));
    };

    _proto24.visitCallScope = function visitCallScope(call) {
      return new CallScope(call.name, this.cloneExpressionArray(call.args), call.ancestor);
    };

    _proto24.visitCallFunction = function visitCallFunction(call) {
      return new CallFunction(call.func.accept(this), this.cloneExpressionArray(call.args));
    };

    _proto24.visitCallMember = function visitCallMember(call) {
      return new CallMember(call.object.accept(this), call.name, this.cloneExpressionArray(call.args));
    };

    _proto24.visitUnary = function visitUnary(unary) {
      return new Unary(prefix.operation, prefix.expression.accept(this));
    };

    _proto24.visitBinary = function visitBinary(binary) {
      return new Binary(binary.operation, binary.left.accept(this), binary.right.accept(this));
    };

    _proto24.visitLiteralPrimitive = function visitLiteralPrimitive(literal) {
      return new LiteralPrimitive(literal);
    };

    _proto24.visitLiteralArray = function visitLiteralArray(literal) {
      return new LiteralArray(this.cloneExpressionArray(literal.elements));
    };

    _proto24.visitLiteralObject = function visitLiteralObject(literal) {
      return new LiteralObject(literal.keys, this.cloneExpressionArray(literal.values));
    };

    _proto24.visitLiteralString = function visitLiteralString(literal) {
      return new LiteralString(literal.value);
    };

    _proto24.visitLiteralTemplate = function visitLiteralTemplate(literal) {
      return new LiteralTemplate(literal.cooked, this.cloneExpressionArray(literal.expressions), literal.raw, literal.tag && literal.tag.accept(this));
    };

    return ExpressionCloner;
  }();
  function cloneExpression(expression) {
    var visitor = new ExpressionCloner();
    return expression.accept(visitor);
  }
  var bindingMode = {
    oneTime: 0,
    toView: 1,
    oneWay: 1,
    twoWay: 2,
    fromView: 3
  };
  var Parser =
  /*#__PURE__*/
  function () {
    function Parser() {
      this.cache = Object.create(null);
    }

    var _proto25 = Parser.prototype;

    _proto25.parse = function parse(src) {
      src = src || '';
      return this.cache[src] || (this.cache[src] = new ParserImplementation(src).parseBindingBehavior());
    };

    return Parser;
  }();
  var fromCharCode = String.fromCharCode;
  var ParserImplementation =
  /*#__PURE__*/
  function () {
    _createClass(ParserImplementation, [{
      key: "raw",
      get: function get() {
        return this.src.slice(this.start, this.idx);
      }
    }]);

    function ParserImplementation(src) {
      this.idx = 0;
      this.start = 0;
      this.src = src;
      this.len = src.length;
      this.tkn = T$EOF;
      this.val = undefined;
      this.ch = src.charCodeAt(0);
    }

    var _proto26 = ParserImplementation.prototype;

    _proto26.parseBindingBehavior = function parseBindingBehavior() {
      this.nextToken();

      if (this.tkn & T$ExpressionTerminal) {
        this.err('Invalid start of expression');
      }

      var result = this.parseValueConverter();

      while (this.opt(T$Ampersand)) {
        result = new BindingBehavior(result, this.val, this.parseVariadicArgs());
      }

      if (this.tkn !== T$EOF) {
        this.err("Unconsumed token " + this.raw);
      }

      return result;
    };

    _proto26.parseValueConverter = function parseValueConverter() {
      var result = this.parseExpression();

      while (this.opt(T$Bar)) {
        result = new ValueConverter(result, this.val, this.parseVariadicArgs());
      }

      return result;
    };

    _proto26.parseVariadicArgs = function parseVariadicArgs() {
      this.nextToken();
      var result = [];

      while (this.opt(T$Colon)) {
        result.push(this.parseExpression());
      }

      return result;
    };

    _proto26.parseExpression = function parseExpression() {
      var exprStart = this.idx;
      var result = this.parseConditional();

      while (this.tkn === T$Eq) {
        if (!result.isAssignable) {
          this.err("Expression " + this.src.slice(exprStart, this.start) + " is not assignable");
        }

        this.nextToken();
        exprStart = this.idx;
        result = new Assign(result, this.parseConditional());
      }

      return result;
    };

    _proto26.parseConditional = function parseConditional() {
      var result = this.parseBinary(0);

      if (this.opt(T$Question)) {
        var yes = this.parseExpression();
        this.expect(T$Colon);
        result = new Conditional(result, yes, this.parseExpression());
      }

      return result;
    };

    _proto26.parseBinary = function parseBinary(minPrecedence) {
      var left = this.parseLeftHandSide(0);

      while (this.tkn & T$BinaryOp) {
        var opToken = this.tkn;

        if ((opToken & T$Precedence) <= minPrecedence) {
          break;
        }

        this.nextToken();
        left = new Binary(TokenValues[opToken & T$TokenMask], left, this.parseBinary(opToken & T$Precedence));
      }

      return left;
    };

    _proto26.parseLeftHandSide = function parseLeftHandSide(context) {
      var result;

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
          var op = TokenValues[this.tkn & T$TokenMask];
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
            var _elements = [];

            if (this.tkn !== T$RBracket) {
              do {
                _elements.push(this.parseExpression());
              } while (this.opt(T$Comma));
            }

            this.expect(T$RBracket);
            result = new LiteralArray(_elements);
            context = C$Primary;
            break;
          }

        case T$LBrace:
          {
            var keys = [];
            var values = [];
            this.nextToken();

            while (this.tkn !== T$RBrace) {
              if (this.tkn & T$IdentifierOrKeyword) {
                var ch = this.ch,
                    tkn = this.tkn,
                    idx = this.idx;
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

      var name = this.val;

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
            var args = [];

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
    };

    _proto26.parseTemplate = function parseTemplate(context, func) {
      var cooked = [this.val];
      var raw = context & C$Tagged ? [this.raw] : undefined;
      this.expect(T$TemplateContinuation);
      var expressions = [this.parseExpression()];

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
    };

    _proto26.nextToken = function nextToken() {
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
    };

    _proto26.next = function next() {
      return this.ch = this.src.charCodeAt(++this.idx);
    };

    _proto26.scanIdentifier = function scanIdentifier() {
      while (AsciiIdParts.has(this.next()) || this.ch > 0x7F && IdParts[this.ch]) {}

      return KeywordLookup[this.val = this.raw] || T$Identifier;
    };

    _proto26.scanNumber = function scanNumber(isFloat) {
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

        var start = this.idx;
        var value = this.ch - 0x30;

        while (this.next() <= 0x39 && this.ch >= 0x30) {
          value = value * 10 + this.ch - 0x30;
        }

        this.val = this.val + value / Math.pow(10, this.idx - start);
      }

      if (this.ch === 0x65 || this.ch === 0x45) {
        var _start = this.idx;
        this.next();

        if (this.ch === 0x2D || this.ch === 0x2B) {
          this.next();
        }

        if (!(this.ch >= 0x30 && this.ch <= 0x39)) {
          this.idx = _start;
          this.err('Invalid exponent');
        }

        while (this.next() <= 0x39 && this.ch >= 0x30) {}

        this.val = parseFloat(this.src.slice(this.start, this.idx));
      }

      return T$NumericLiteral;
    };

    _proto26.scanString = function scanString() {
      var quote = this.ch;
      this.next();
      var buffer;
      var marker = this.idx;

      while (this.ch !== quote) {
        if (this.ch === 0x5C) {
          if (!buffer) {
            buffer = [];
          }

          buffer.push(this.src.slice(marker, this.idx));
          this.next();

          var _unescaped = void 0;

          if (this.ch === 0x75) {
            this.next();

            if (this.idx + 4 < this.len) {
              var hex = this.src.slice(this.idx, this.idx + 4);

              if (!/[A-Z0-9]{4}/i.test(hex)) {
                this.err("Invalid unicode escape [\\u" + hex + "]");
              }

              _unescaped = parseInt(hex, 16);
              this.idx += 4;
              this.ch = this.src.charCodeAt(this.idx);
            } else {
              this.err();
            }
          } else {
            _unescaped = unescape(this.ch);
            this.next();
          }

          buffer.push(fromCharCode(_unescaped));
          marker = this.idx;
        } else if (this.ch === 0 || this.idx >= this.len) {
          this.err('Unterminated quote');
        } else {
          this.next();
        }
      }

      var last = this.src.slice(marker, this.idx);
      this.next();
      var unescaped = last;

      if (buffer !== null && buffer !== undefined) {
        buffer.push(last);
        unescaped = buffer.join('');
      }

      this.val = unescaped;
      return T$StringLiteral;
    };

    _proto26.scanTemplate = function scanTemplate() {
      var tail = true;
      var result = '';

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
    };

    _proto26.scanTemplateTail = function scanTemplateTail() {
      if (this.idx >= this.len) {
        this.err('Unterminated template');
      }

      this.idx--;
      return this.scanTemplate();
    };

    _proto26.err = function err(message, column) {
      if (message === void 0) {
        message = "Unexpected token " + this.raw;
      }

      if (column === void 0) {
        column = this.start;
      }

      throw new Error("Parser Error: " + message + " at column " + column + " in expression [" + this.src + "]");
    };

    _proto26.opt = function opt(token) {
      if (this.tkn === token) {
        this.nextToken();
        return true;
      }

      return false;
    };

    _proto26.expect = function expect(token) {
      if (this.tkn === token) {
        this.nextToken();
      } else {
        this.err("Missing expected token " + TokenValues[token & T$TokenMask], this.idx);
      }
    };

    return ParserImplementation;
  }();

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

  var C$This = 1 << 10;
  var C$Scope = 1 << 11;
  var C$Member = 1 << 12;
  var C$Keyed = 1 << 13;
  var C$Call = 1 << 14;
  var C$Primary = 1 << 15;
  var C$ShorthandProp = 1 << 16;
  var C$Tagged = 1 << 17;
  var C$Ancestor = (1 << 9) - 1;
  var T$TokenMask = (1 << 6) - 1;
  var T$PrecShift = 6;
  var T$Precedence = 7 << T$PrecShift;
  var T$ExpressionTerminal = 1 << 11;
  var T$ClosingToken = 1 << 12;
  var T$OpeningToken = 1 << 13;
  var T$AccessScopeTerminal = 1 << 14;
  var T$Keyword = 1 << 15;
  var T$EOF = 1 << 16 | T$AccessScopeTerminal | T$ExpressionTerminal;
  var T$Identifier = 1 << 17;
  var T$IdentifierOrKeyword = T$Identifier | T$Keyword;
  var T$Literal = 1 << 18;
  var T$NumericLiteral = 1 << 19 | T$Literal;
  var T$StringLiteral = 1 << 20 | T$Literal;
  var T$BinaryOp = 1 << 21;
  var T$UnaryOp = 1 << 22;
  var T$MemberExpression = 1 << 23;
  var T$MemberOrCallExpression = 1 << 24;
  var T$TemplateTail = 1 << 25 | T$MemberOrCallExpression;
  var T$TemplateContinuation = 1 << 26 | T$MemberOrCallExpression;
  var T$FalseKeyword = 0 | T$Keyword | T$Literal;
  var T$TrueKeyword = 1 | T$Keyword | T$Literal;
  var T$NullKeyword = 2 | T$Keyword | T$Literal;
  var T$UndefinedKeyword = 3 | T$Keyword | T$Literal;
  var T$ThisScope = 4 | T$IdentifierOrKeyword;
  var T$ParentScope = 5 | T$IdentifierOrKeyword;
  var T$LParen = 6 | T$OpeningToken | T$AccessScopeTerminal | T$MemberOrCallExpression;
  var T$LBrace = 7 | T$OpeningToken;
  var T$Period = 8 | T$MemberExpression | T$MemberOrCallExpression;
  var T$RBrace = 9 | T$AccessScopeTerminal | T$ClosingToken | T$ExpressionTerminal;
  var T$RParen = 10 | T$AccessScopeTerminal | T$ClosingToken | T$ExpressionTerminal;
  var T$Comma = 11 | T$AccessScopeTerminal;
  var T$LBracket = 12 | T$OpeningToken | T$AccessScopeTerminal | T$MemberExpression | T$MemberOrCallExpression;
  var T$RBracket = 13 | T$ClosingToken | T$ExpressionTerminal;
  var T$Colon = 14 | T$AccessScopeTerminal;
  var T$Question = 15;
  var T$Ampersand = 18 | T$AccessScopeTerminal;
  var T$Bar = 19 | T$AccessScopeTerminal;
  var T$BarBar = 20 | 1 << T$PrecShift | T$BinaryOp;
  var T$AmpersandAmpersand = 21 | 2 << T$PrecShift | T$BinaryOp;
  var T$Caret = 22 | 3 << T$PrecShift | T$BinaryOp;
  var T$EqEq = 23 | 4 << T$PrecShift | T$BinaryOp;
  var T$BangEq = 24 | 4 << T$PrecShift | T$BinaryOp;
  var T$EqEqEq = 25 | 4 << T$PrecShift | T$BinaryOp;
  var T$BangEqEq = 26 | 4 << T$PrecShift | T$BinaryOp;
  var T$Lt = 27 | 5 << T$PrecShift | T$BinaryOp;
  var T$Gt = 28 | 5 << T$PrecShift | T$BinaryOp;
  var T$LtEq = 29 | 5 << T$PrecShift | T$BinaryOp;
  var T$GtEq = 30 | 5 << T$PrecShift | T$BinaryOp;
  var T$InKeyword = 31 | 5 << T$PrecShift | T$BinaryOp | T$Keyword;
  var T$InstanceOfKeyword = 32 | 5 << T$PrecShift | T$BinaryOp | T$Keyword;
  var T$Plus = 33 | 6 << T$PrecShift | T$BinaryOp | T$UnaryOp;
  var T$Minus = 34 | 6 << T$PrecShift | T$BinaryOp | T$UnaryOp;
  var T$TypeofKeyword = 35 | T$UnaryOp | T$Keyword;
  var T$VoidKeyword = 36 | T$UnaryOp | T$Keyword;
  var T$Star = 37 | 7 << T$PrecShift | T$BinaryOp;
  var T$Percent = 38 | 7 << T$PrecShift | T$BinaryOp;
  var T$Slash = 39 | 7 << T$PrecShift | T$BinaryOp;
  var T$Eq = 40;
  var T$Bang = 41 | T$UnaryOp;
  var KeywordLookup = Object.create(null);
  KeywordLookup["true"] = T$TrueKeyword;
  KeywordLookup["null"] = T$NullKeyword;
  KeywordLookup["false"] = T$FalseKeyword;
  KeywordLookup.undefined = T$UndefinedKeyword;
  KeywordLookup.$this = T$ThisScope;
  KeywordLookup.$parent = T$ParentScope;
  KeywordLookup["in"] = T$InKeyword;
  KeywordLookup["instanceof"] = T$InstanceOfKeyword;
  KeywordLookup["typeof"] = T$TypeofKeyword;
  KeywordLookup["void"] = T$VoidKeyword;
  var TokenValues = [false, true, null, undefined, '$this', '$parent', '(', '{', '.', '}', ')', ',', '[', ']', ':', '?', '\'', '"', '&', '|', '||', '&&', '^', '==', '!=', '===', '!==', '<', '>', '<=', '>=', 'in', 'instanceof', '+', '-', 'typeof', 'void', '*', '%', '/', '=', '!'];
  var codes = {
    AsciiIdPart: [0x24, 0, 0x30, 0x3A, 0x41, 0x5B, 0x5F, 0, 0x61, 0x7B],
    IdStart: [0x24, 0, 0x41, 0x5B, 0x5F, 0, 0x61, 0x7B, 0xAA, 0, 0xBA, 0, 0xC0, 0xD7, 0xD8, 0xF7, 0xF8, 0x2B9, 0x2E0, 0x2E5, 0x1D00, 0x1D26, 0x1D2C, 0x1D5D, 0x1D62, 0x1D66, 0x1D6B, 0x1D78, 0x1D79, 0x1DBF, 0x1E00, 0x1F00, 0x2071, 0, 0x207F, 0, 0x2090, 0x209D, 0x212A, 0x212C, 0x2132, 0, 0x214E, 0, 0x2160, 0x2189, 0x2C60, 0x2C80, 0xA722, 0xA788, 0xA78B, 0xA7AF, 0xA7B0, 0xA7B8, 0xA7F7, 0xA800, 0xAB30, 0xAB5B, 0xAB5C, 0xAB65, 0xFB00, 0xFB07, 0xFF21, 0xFF3B, 0xFF41, 0xFF5B],
    Digit: [0x30, 0x3A],
    Skip: [0, 0x21, 0x7F, 0xA1]
  };

  function decompress(lookup, set, compressed, value) {
    var rangeCount = compressed.length;

    for (var _i23 = 0; _i23 < rangeCount; _i23 += 2) {
      var start = compressed[_i23];
      var end = compressed[_i23 + 1];
      end = end > 0 ? end : start + 1;

      if (lookup) {
        var j = start;

        while (j < end) {
          lookup[j] = value;
          j++;
        }
      }

      if (set) {
        for (var ch = start; ch < end; ch++) {
          set.add(ch);
        }
      }
    }
  }

  function returnToken(token) {
    return function (p) {
      p.next();
      return token;
    };
  }

  function unexpectedCharacter(p) {
    p.err("Unexpected character [" + fromCharCode(p.ch) + "]");
    return null;
  }

  var AsciiIdParts = new Set();
  decompress(null, AsciiIdParts, codes.AsciiIdPart, true);
  var IdParts = new Uint8Array(0xFFFF);
  decompress(IdParts, null, codes.IdStart, 1);
  decompress(IdParts, null, codes.Digit, 1);
  var CharScanners = new Array(0xFFFF);
  var ci = 0;

  while (ci < 0xFFFF) {
    CharScanners[ci] = unexpectedCharacter;
    ci++;
  }

  decompress(CharScanners, null, codes.Skip, function (p) {
    p.next();
    return null;
  });
  decompress(CharScanners, null, codes.IdStart, function (p) {
    return p.scanIdentifier();
  });
  decompress(CharScanners, null, codes.Digit, function (p) {
    return p.scanNumber(false);
  });

  CharScanners[0x22] = CharScanners[0x27] = function (p) {
    return p.scanString();
  };

  CharScanners[0x60] = function (p) {
    return p.scanTemplate();
  };

  CharScanners[0x21] = function (p) {
    if (p.next() !== 0x3D) {
      return T$Bang;
    }

    if (p.next() !== 0x3D) {
      return T$BangEq;
    }

    p.next();
    return T$BangEqEq;
  };

  CharScanners[0x3D] = function (p) {
    if (p.next() !== 0x3D) {
      return T$Eq;
    }

    if (p.next() !== 0x3D) {
      return T$EqEq;
    }

    p.next();
    return T$EqEqEq;
  };

  CharScanners[0x26] = function (p) {
    if (p.next() !== 0x26) {
      return T$Ampersand;
    }

    p.next();
    return T$AmpersandAmpersand;
  };

  CharScanners[0x7C] = function (p) {
    if (p.next() !== 0x7C) {
      return T$Bar;
    }

    p.next();
    return T$BarBar;
  };

  CharScanners[0x2E] = function (p) {
    if (p.next() <= 0x39 && p.ch >= 0x30) {
      return p.scanNumber(true);
    }

    return T$Period;
  };

  CharScanners[0x3C] = function (p) {
    if (p.next() !== 0x3D) {
      return T$Lt;
    }

    p.next();
    return T$LtEq;
  };

  CharScanners[0x3E] = function (p) {
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
  var mapProto = Map.prototype;

  function _getMapObserver(taskQueue, map) {
    return ModifyMapObserver["for"](taskQueue, map);
  }

  var ModifyMapObserver =
  /*#__PURE__*/
  function (_ModifyCollectionObse2) {
    _inheritsLoose(ModifyMapObserver, _ModifyCollectionObse2);

    function ModifyMapObserver(taskQueue, map) {
      return _ModifyCollectionObse2.call(this, taskQueue, map) || this;
    }

    ModifyMapObserver["for"] = function _for(taskQueue, map) {
      if (!('__map_observer__' in map)) {
        Reflect.defineProperty(map, '__map_observer__', {
          value: ModifyMapObserver.create(taskQueue, map),
          enumerable: false,
          configurable: false
        });
      }

      return map.__map_observer__;
    };

    ModifyMapObserver.create = function create(taskQueue, map) {
      var observer = new ModifyMapObserver(taskQueue, map);
      var proto = mapProto;

      if (proto.set !== map.set || proto["delete"] !== map["delete"] || proto.clear !== map.clear) {
        proto = {
          set: map.set,
          "delete": map["delete"],
          clear: map.clear
        };
      }

      map.set = function () {
        var hasValue = map.has(arguments[0]);
        var type = hasValue ? 'update' : 'add';
        var oldValue = map.get(arguments[0]);
        var methodCallResult = proto.set.apply(map, arguments);

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

      map["delete"] = function () {
        var hasValue = map.has(arguments[0]);
        var oldValue = map.get(arguments[0]);
        var methodCallResult = proto["delete"].apply(map, arguments);

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
        var methodCallResult = proto.clear.apply(map, arguments);
        observer.addChangeRecord({
          type: 'clear',
          object: map
        });
        return methodCallResult;
      };

      return observer;
    };

    return ModifyMapObserver;
  }(ModifyCollectionObserver);

  function findOriginalEventTarget(event) {
    return event.path && event.path[0] || event.deepPath && event.deepPath[0] || event.target;
  }

  function stopPropagation() {
    this.standardStopPropagation();
    this.propagationStopped = true;
  }

  function handleCapturedEvent(event) {
    event.propagationStopped = false;
    var target = findOriginalEventTarget(event);
    var orderedCallbacks = [];

    while (target) {
      if (target.capturedCallbacks) {
        var callback = target.capturedCallbacks[event.type];

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

    for (var _i24 = orderedCallbacks.length - 1; _i24 >= 0 && !event.propagationStopped; _i24--) {
      var orderedCallback = orderedCallbacks[_i24];

      if ('handleEvent' in orderedCallback) {
        orderedCallback.handleEvent(event);
      } else {
        orderedCallback(event);
      }
    }
  }

  var CapturedHandlerEntry =
  /*#__PURE__*/
  function () {
    function CapturedHandlerEntry(eventName) {
      this.eventName = eventName;
      this.count = 0;
    }

    var _proto27 = CapturedHandlerEntry.prototype;

    _proto27.increment = function increment() {
      this.count++;

      if (this.count === 1) {
        DOM.addEventListener(this.eventName, handleCapturedEvent, true);
      }
    };

    _proto27.decrement = function decrement() {
      this.count--;

      if (this.count === 0) {
        DOM.removeEventListener(this.eventName, handleCapturedEvent, true);
      }
    };

    return CapturedHandlerEntry;
  }();

  function handleDelegatedEvent(event) {
    event.propagationStopped = false;
    var target = findOriginalEventTarget(event);

    while (target && !event.propagationStopped) {
      if (target.delegatedCallbacks) {
        var callback = target.delegatedCallbacks[event.type];

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

  var DelegateHandlerEntry =
  /*#__PURE__*/
  function () {
    function DelegateHandlerEntry(eventName) {
      this.eventName = eventName;
      this.count = 0;
    }

    var _proto28 = DelegateHandlerEntry.prototype;

    _proto28.increment = function increment() {
      this.count++;

      if (this.count === 1) {
        DOM.addEventListener(this.eventName, handleDelegatedEvent, false);
      }
    };

    _proto28.decrement = function decrement() {
      this.count--;

      if (this.count === 0) {
        DOM.removeEventListener(this.eventName, handleDelegatedEvent, false);
      }
    };

    return DelegateHandlerEntry;
  }();

  var DelegationEntryHandler =
  /*#__PURE__*/
  function () {
    function DelegationEntryHandler(entry, lookup, targetEvent) {
      this.entry = entry;
      this.lookup = lookup;
      this.targetEvent = targetEvent;
    }

    var _proto29 = DelegationEntryHandler.prototype;

    _proto29.dispose = function dispose() {
      this.entry.decrement();
      this.lookup[this.targetEvent] = null;
    };

    return DelegationEntryHandler;
  }();

  var EventHandler =
  /*#__PURE__*/
  function () {
    function EventHandler(target, targetEvent, callback) {
      this.target = target;
      this.targetEvent = targetEvent;
      this.callback = callback;
    }

    var _proto30 = EventHandler.prototype;

    _proto30.dispose = function dispose() {
      this.target.removeEventListener(this.targetEvent, this.callback);
    };

    return EventHandler;
  }();

  var DefaultEventStrategy =
  /*#__PURE__*/
  function () {
    function DefaultEventStrategy() {
      this.delegatedHandlers = {};
      this.capturedHandlers = {};
    }

    var _proto31 = DefaultEventStrategy.prototype;

    _proto31.subscribe = function subscribe(target, targetEvent, callback, strategy, disposable) {
      var delegatedHandlers;
      var capturedHandlers;
      var handlerEntry;

      if (strategy === delegationStrategy.bubbling) {
        delegatedHandlers = this.delegatedHandlers;
        handlerEntry = delegatedHandlers[targetEvent] || (delegatedHandlers[targetEvent] = new DelegateHandlerEntry(targetEvent));
        var delegatedCallbacks = target.delegatedCallbacks || (target.delegatedCallbacks = {});
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
        var capturedCallbacks = target.capturedCallbacks || (target.capturedCallbacks = {});
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
    };

    return DefaultEventStrategy;
  }();

  var delegationStrategy = {
    none: 0,
    capturing: 1,
    bubbling: 2
  };
  var EventManager =
  /*#__PURE__*/
  function () {
    function EventManager() {
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

    var _proto32 = EventManager.prototype;

    _proto32.registerElementConfig = function registerElementConfig(config) {
      var tagName = config.tagName.toLowerCase();
      var properties = config.properties;
      var propertyName;
      var lookup = this.elementHandlerLookup[tagName] = {};

      for (propertyName in properties) {
        if (properties.hasOwnProperty(propertyName)) {
          lookup[propertyName] = properties[propertyName];
        }
      }
    };

    _proto32.registerEventStrategy = function registerEventStrategy(eventName, strategy) {
      this.eventStrategyLookup[eventName] = strategy;
    };

    _proto32.getElementHandler = function getElementHandler(target, propertyName) {
      var tagName;
      var lookup = this.elementHandlerLookup;

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
    };

    _proto32.addEventListener = function addEventListener(target, targetEvent, callbackOrListener, delegate, disposable) {
      return (this.eventStrategyLookup[targetEvent] || this.defaultEventStrategy).subscribe(target, targetEvent, callbackOrListener, delegate, disposable);
    };

    return EventManager;
  }();
  var EventSubscriber =
  /*#__PURE__*/
  function () {
    function EventSubscriber(events) {
      this.events = events;
      this.element = null;
      this.handler = null;
    }

    var _proto33 = EventSubscriber.prototype;

    _proto33.subscribe = function subscribe(element, callbackOrListener) {
      this.element = element;
      this.handler = callbackOrListener;
      var events = this.events;

      for (var _i25 = 0, ii = events.length; ii > _i25; ++_i25) {
        element.addEventListener(events[_i25], callbackOrListener);
      }
    };

    _proto33.dispose = function dispose() {
      if (this.element === null) {
        return;
      }

      var element = this.element;
      var callbackOrListener = this.handler;
      var events = this.events;

      for (var _i26 = 0, ii = events.length; ii > _i26; ++_i26) {
        element.removeEventListener(events[_i26], callbackOrListener);
      }

      this.element = this.handler = null;
    };

    return EventSubscriber;
  }();
  var DirtyChecker =
  /*#__PURE__*/
  function () {
    function DirtyChecker() {
      this.tracked = [];
      this.checkDelay = 120;
    }

    var _proto34 = DirtyChecker.prototype;

    _proto34.addProperty = function addProperty(property) {
      var tracked = this.tracked;
      tracked.push(property);

      if (tracked.length === 1) {
        this.scheduleDirtyCheck();
      }
    };

    _proto34.removeProperty = function removeProperty(property) {
      var tracked = this.tracked;
      tracked.splice(tracked.indexOf(property), 1);
    };

    _proto34.scheduleDirtyCheck = function scheduleDirtyCheck() {
      var _this20 = this;

      setTimeout(function () {
        return _this20.check();
      }, this.checkDelay);
    };

    _proto34.check = function check() {
      var tracked = this.tracked;
      var i = tracked.length;

      while (i--) {
        var current = tracked[i];

        if (current.isDirty()) {
          current.call();
        }
      }

      if (tracked.length) {
        this.scheduleDirtyCheck();
      }
    };

    return DirtyChecker;
  }();
  var DirtyCheckProperty = (_dec5$1 = subscriberCollection(), _dec5$1(_class5$1 =
  /*#__PURE__*/
  function () {
    function DirtyCheckProperty(dirtyChecker, obj, propertyName) {
      this.dirtyChecker = dirtyChecker;
      this.obj = obj;
      this.propertyName = propertyName;
    }

    var _proto35 = DirtyCheckProperty.prototype;

    _proto35.getValue = function getValue() {
      return this.obj[this.propertyName];
    };

    _proto35.setValue = function setValue(newValue) {
      this.obj[this.propertyName] = newValue;
    };

    _proto35.call = function call() {
      var oldValue = this.oldValue;
      var newValue = this.getValue();
      this.callSubscribers(newValue, oldValue);
      this.oldValue = newValue;
    };

    _proto35.isDirty = function isDirty() {
      return this.oldValue !== this.obj[this.propertyName];
    };

    _proto35.subscribe = function subscribe(context, callable) {
      if (!this.hasSubscribers()) {
        this.oldValue = this.getValue();
        this.dirtyChecker.addProperty(this);
      }

      this.addSubscriber(context, callable);
    };

    _proto35.unsubscribe = function unsubscribe(context, callable) {
      if (this.removeSubscriber(context, callable) && !this.hasSubscribers()) {
        this.dirtyChecker.removeProperty(this);
      }
    };

    return DirtyCheckProperty;
  }()) || _class5$1);
  var logger = getLogger('property-observation');
  var propertyAccessor = {
    getValue: function getValue(obj, propertyName) {
      return obj[propertyName];
    },
    setValue: function setValue(value, obj, propertyName) {
      obj[propertyName] = value;
    }
  };
  var PrimitiveObserver =
  /*#__PURE__*/
  function () {
    function PrimitiveObserver(primitive, propertyName) {
      this.doNotCache = true;
      this.primitive = primitive;
      this.propertyName = propertyName;
    }

    var _proto36 = PrimitiveObserver.prototype;

    _proto36.getValue = function getValue() {
      return this.primitive[this.propertyName];
    };

    _proto36.setValue = function setValue() {
      var type = typeof this.primitive;
      throw new Error("The " + this.propertyName + " property of a " + type + " (" + this.primitive + ") cannot be assigned.");
    };

    _proto36.subscribe = function subscribe() {};

    _proto36.unsubscribe = function unsubscribe() {};

    return PrimitiveObserver;
  }();
  var SetterObserver = (_dec6$1 = subscriberCollection(), _dec6$1(_class7$1 =
  /*#__PURE__*/
  function () {
    function SetterObserver(taskQueue, obj, propertyName) {
      this.taskQueue = taskQueue;
      this.obj = obj;
      this.propertyName = propertyName;
      this.queued = false;
      this.observing = false;
    }

    var _proto37 = SetterObserver.prototype;

    _proto37.getValue = function getValue() {
      return this.obj[this.propertyName];
    };

    _proto37.setValue = function setValue(newValue) {
      this.obj[this.propertyName] = newValue;
    };

    _proto37.getterValue = function getterValue() {
      return this.currentValue;
    };

    _proto37.setterValue = function setterValue(newValue) {
      var oldValue = this.currentValue;

      if (oldValue !== newValue) {
        if (!this.queued) {
          this.oldValue = oldValue;
          this.queued = true;
          this.taskQueue.queueMicroTask(this);
        }

        this.currentValue = newValue;
      }
    };

    _proto37.call = function call() {
      var oldValue = this.oldValue;
      var newValue = this.currentValue;
      this.queued = false;
      this.callSubscribers(newValue, oldValue);
    };

    _proto37.subscribe = function subscribe(context, callable) {
      if (!this.observing) {
        this.convertProperty();
      }

      this.addSubscriber(context, callable);
    };

    _proto37.unsubscribe = function unsubscribe(context, callable) {
      this.removeSubscriber(context, callable);
    };

    _proto37.convertProperty = function convertProperty() {
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
        logger.warn("Cannot observe property '" + this.propertyName + "' of object", this.obj);
      }
    };

    return SetterObserver;
  }()) || _class7$1);
  var XLinkAttributeObserver =
  /*#__PURE__*/
  function () {
    function XLinkAttributeObserver(element, propertyName, attributeName) {
      this.element = element;
      this.propertyName = propertyName;
      this.attributeName = attributeName;
    }

    var _proto38 = XLinkAttributeObserver.prototype;

    _proto38.getValue = function getValue() {
      return this.element.getAttributeNS('http://www.w3.org/1999/xlink', this.attributeName);
    };

    _proto38.setValue = function setValue(newValue) {
      return this.element.setAttributeNS('http://www.w3.org/1999/xlink', this.attributeName, newValue);
    };

    _proto38.subscribe = function subscribe() {
      throw new Error("Observation of a \"" + this.element.nodeName + "\" element's \"" + this.propertyName + "\" property is not supported.");
    };

    return XLinkAttributeObserver;
  }();
  var dataAttributeAccessor = {
    getValue: function getValue(obj, propertyName) {
      return obj.getAttribute(propertyName);
    },
    setValue: function setValue(value, obj, propertyName) {
      if (value === null || value === undefined) {
        obj.removeAttribute(propertyName);
      } else {
        obj.setAttribute(propertyName, value);
      }
    }
  };
  var DataAttributeObserver =
  /*#__PURE__*/
  function () {
    function DataAttributeObserver(element, propertyName) {
      this.element = element;
      this.propertyName = propertyName;
    }

    var _proto39 = DataAttributeObserver.prototype;

    _proto39.getValue = function getValue() {
      return this.element.getAttribute(this.propertyName);
    };

    _proto39.setValue = function setValue(newValue) {
      if (newValue === null || newValue === undefined) {
        return this.element.removeAttribute(this.propertyName);
      }

      return this.element.setAttribute(this.propertyName, newValue);
    };

    _proto39.subscribe = function subscribe() {
      throw new Error("Observation of a \"" + this.element.nodeName + "\" element's \"" + this.propertyName + "\" property is not supported.");
    };

    return DataAttributeObserver;
  }();
  var StyleObserver =
  /*#__PURE__*/
  function () {
    function StyleObserver(element, propertyName) {
      this.element = element;
      this.propertyName = propertyName;
      this.styles = null;
      this.version = 0;
    }

    var _proto40 = StyleObserver.prototype;

    _proto40.getValue = function getValue() {
      return this.element.style.cssText;
    };

    _proto40._setProperty = function _setProperty(style, value) {
      var priority = '';

      if (value !== null && value !== undefined && typeof value.indexOf === 'function' && value.indexOf('!important') !== -1) {
        priority = 'important';
        value = value.replace('!important', '');
      }

      this.element.style.setProperty(style, value, priority);
    };

    _proto40.setValue = function setValue(newValue) {
      var styles = this.styles || {};
      var style;
      var version = this.version;

      if (newValue !== null && newValue !== undefined) {
        if (newValue instanceof Object) {
          var value;

          for (style in newValue) {
            if (newValue.hasOwnProperty(style)) {
              value = newValue[style];
              style = style.replace(/([A-Z])/g, function (m) {
                return '-' + m.toLowerCase();
              });
              styles[style] = version;

              this._setProperty(style, value);
            }
          }
        } else if (newValue.length) {
          var rx = /\s*([\w\-]+)\s*:\s*((?:(?:[\w\-]+\(\s*(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|[\w\-]+\(\s*(?:^"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|[^\)]*)\),?|[^\)]*)\),?|"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|[^;]*),?\s*)+);?/g;
          var pair;

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
    };

    _proto40.subscribe = function subscribe() {
      throw new Error("Observation of a \"" + this.element.nodeName + "\" element's \"" + this.propertyName + "\" property is not supported.");
    };

    return StyleObserver;
  }();
  var ValueAttributeObserver = (_dec7$1 = subscriberCollection(), _dec7$1(_class8 =
  /*#__PURE__*/
  function () {
    function ValueAttributeObserver(element, propertyName, handler) {
      this.element = element;
      this.propertyName = propertyName;
      this.handler = handler;

      if (propertyName === 'files') {
        this.setValue = function () {};
      }
    }

    var _proto41 = ValueAttributeObserver.prototype;

    _proto41.getValue = function getValue() {
      return this.element[this.propertyName];
    };

    _proto41.setValue = function setValue(newValue) {
      newValue = newValue === undefined || newValue === null ? '' : newValue;

      if (this.element[this.propertyName] !== newValue) {
        this.element[this.propertyName] = newValue;
        this.notify();
      }
    };

    _proto41.notify = function notify() {
      var oldValue = this.oldValue;
      var newValue = this.getValue();
      this.callSubscribers(newValue, oldValue);
      this.oldValue = newValue;
    };

    _proto41.handleEvent = function handleEvent() {
      this.notify();
    };

    _proto41.subscribe = function subscribe(context, callable) {
      if (!this.hasSubscribers()) {
        this.oldValue = this.getValue();
        this.handler.subscribe(this.element, this);
      }

      this.addSubscriber(context, callable);
    };

    _proto41.unsubscribe = function unsubscribe(context, callable) {
      if (this.removeSubscriber(context, callable) && !this.hasSubscribers()) {
        this.handler.dispose();
      }
    };

    return ValueAttributeObserver;
  }()) || _class8);
  var checkedArrayContext = 'CheckedObserver:array';
  var checkedValueContext = 'CheckedObserver:value';
  var CheckedObserver = (_dec8 = subscriberCollection(), _dec8(_class9 =
  /*#__PURE__*/
  function () {
    function CheckedObserver(element, handler, observerLocator) {
      this.element = element;
      this.handler = handler;
      this.observerLocator = observerLocator;
    }

    var _proto42 = CheckedObserver.prototype;

    _proto42.getValue = function getValue() {
      return this.value;
    };

    _proto42.setValue = function setValue(newValue) {
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
    };

    _proto42.call = function call(context, splices) {
      this.synchronizeElement();

      if (!this.valueObserver) {
        this.valueObserver = this.element.__observers__.model || this.element.__observers__.value;

        if (this.valueObserver) {
          this.valueObserver.subscribe(checkedValueContext, this);
        }
      }
    };

    _proto42.synchronizeElement = function synchronizeElement() {
      var value = this.value;
      var element = this.element;
      var elementValue = element.hasOwnProperty('model') ? element.model : element.value;
      var isRadio = element.type === 'radio';

      var matcher = element.matcher || function (a, b) {
        return a === b;
      };

      element.checked = isRadio && !!matcher(value, elementValue) || !isRadio && value === true || !isRadio && Array.isArray(value) && value.findIndex(function (item) {
        return !!matcher(item, elementValue);
      }) !== -1;
    };

    _proto42.synchronizeValue = function synchronizeValue() {
      var value = this.value;
      var element = this.element;
      var elementValue = element.hasOwnProperty('model') ? element.model : element.value;
      var index;

      var matcher = element.matcher || function (a, b) {
        return a === b;
      };

      if (element.type === 'checkbox') {
        if (Array.isArray(value)) {
          index = value.findIndex(function (item) {
            return !!matcher(item, elementValue);
          });

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
    };

    _proto42.notify = function notify() {
      var oldValue = this.oldValue;
      var newValue = this.value;

      if (newValue === oldValue) {
        return;
      }

      this.callSubscribers(newValue, oldValue);
    };

    _proto42.handleEvent = function handleEvent() {
      this.synchronizeValue();
    };

    _proto42.subscribe = function subscribe(context, callable) {
      if (!this.hasSubscribers()) {
        this.handler.subscribe(this.element, this);
      }

      this.addSubscriber(context, callable);
    };

    _proto42.unsubscribe = function unsubscribe(context, callable) {
      if (this.removeSubscriber(context, callable) && !this.hasSubscribers()) {
        this.handler.dispose();
      }
    };

    _proto42.unbind = function unbind() {
      if (this.arrayObserver) {
        this.arrayObserver.unsubscribe(checkedArrayContext, this);
        this.arrayObserver = null;
      }

      if (this.valueObserver) {
        this.valueObserver.unsubscribe(checkedValueContext, this);
      }
    };

    return CheckedObserver;
  }()) || _class9);
  var selectArrayContext = 'SelectValueObserver:array';
  var SelectValueObserver = (_dec9 = subscriberCollection(), _dec9(_class10 =
  /*#__PURE__*/
  function () {
    function SelectValueObserver(element, handler, observerLocator) {
      this.element = element;
      this.handler = handler;
      this.observerLocator = observerLocator;
    }

    var _proto43 = SelectValueObserver.prototype;

    _proto43.getValue = function getValue() {
      return this.value;
    };

    _proto43.setValue = function setValue(newValue) {
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
    };

    _proto43.call = function call(context, splices) {
      this.synchronizeOptions();
    };

    _proto43.synchronizeOptions = function synchronizeOptions() {
      var value = this.value;
      var isArray;

      if (Array.isArray(value)) {
        isArray = true;
      }

      var options = this.element.options;
      var i = options.length;

      var matcher = this.element.matcher || function (a, b) {
        return a === b;
      };

      var _loop = function _loop() {
        var option = options.item(i);
        var optionValue = option.hasOwnProperty('model') ? option.model : option.value;

        if (isArray) {
          option.selected = value.findIndex(function (item) {
            return !!matcher(optionValue, item);
          }) !== -1;
          return "continue";
        }

        option.selected = !!matcher(optionValue, value);
      };

      while (i--) {
        var _ret = _loop();

        if (_ret === "continue") continue;
      }
    };

    _proto43.synchronizeValue = function synchronizeValue() {
      var _this21 = this;

      var options = this.element.options;
      var count = 0;
      var value = [];

      for (var _i27 = 0, ii = options.length; _i27 < ii; _i27++) {
        var option = options.item(_i27);

        if (!option.selected) {
          continue;
        }

        value.push(option.hasOwnProperty('model') ? option.model : option.value);
        count++;
      }

      if (this.element.multiple) {
        if (Array.isArray(this.value)) {
          var _ret2 = function () {
            var matcher = _this21.element.matcher || function (a, b) {
              return a === b;
            };

            var i = 0;

            var _loop2 = function _loop2() {
              var a = _this21.value[i];

              if (value.findIndex(function (b) {
                return matcher(a, b);
              }) === -1) {
                _this21.value.splice(i, 1);
              } else {
                i++;
              }
            };

            while (i < _this21.value.length) {
              _loop2();
            }

            i = 0;

            var _loop3 = function _loop3() {
              var a = value[i];

              if (_this21.value.findIndex(function (b) {
                return matcher(a, b);
              }) === -1) {
                _this21.value.push(a);
              }

              i++;
            };

            while (i < value.length) {
              _loop3();
            }

            return {
              v: void 0
            };
          }();

          if (typeof _ret2 === "object") return _ret2.v;
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
    };

    _proto43.notify = function notify() {
      var oldValue = this.oldValue;
      var newValue = this.value;
      this.callSubscribers(newValue, oldValue);
    };

    _proto43.handleEvent = function handleEvent() {
      this.synchronizeValue();
    };

    _proto43.subscribe = function subscribe(context, callable) {
      if (!this.hasSubscribers()) {
        this.handler.subscribe(this.element, this);
      }

      this.addSubscriber(context, callable);
    };

    _proto43.unsubscribe = function unsubscribe(context, callable) {
      if (this.removeSubscriber(context, callable) && !this.hasSubscribers()) {
        this.handler.dispose();
      }
    };

    _proto43.bind = function bind() {
      var _this22 = this;

      this.domObserver = DOM.createMutationObserver(function () {
        _this22.synchronizeOptions();

        _this22.synchronizeValue();
      });
      this.domObserver.observe(this.element, {
        childList: true,
        subtree: true,
        characterData: true
      });
    };

    _proto43.unbind = function unbind() {
      this.domObserver.disconnect();
      this.domObserver = null;

      if (this.arrayObserver) {
        this.arrayObserver.unsubscribe(selectArrayContext, this);
        this.arrayObserver = null;
      }
    };

    return SelectValueObserver;
  }()) || _class10);
  var ClassObserver =
  /*#__PURE__*/
  function () {
    function ClassObserver(element) {
      this.element = element;
      this.doNotCache = true;
      this.value = '';
      this.version = 0;
    }

    var _proto44 = ClassObserver.prototype;

    _proto44.getValue = function getValue() {
      return this.value;
    };

    _proto44.setValue = function setValue(newValue) {
      var nameIndex = this.nameIndex || {};
      var version = this.version;
      var names;
      var name;

      if (newValue !== null && newValue !== undefined && newValue.length) {
        names = newValue.split(/\s+/);

        for (var _i28 = 0, length = names.length; _i28 < length; _i28++) {
          name = names[_i28];

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
    };

    _proto44.subscribe = function subscribe() {
      throw new Error("Observation of a \"" + this.element.nodeName + "\" element's \"class\" property is not supported.");
    };

    return ClassObserver;
  }();
  function hasDeclaredDependencies(descriptor) {
    return !!(descriptor && descriptor.get && descriptor.get.dependencies);
  }
  function declarePropertyDependencies(ctor, propertyName, dependencies) {
    var descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, propertyName);
    descriptor.get.dependencies = dependencies;
  }
  function computedFrom() {
    for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
      rest[_key] = arguments[_key];
    }

    return function (target, key, descriptor) {
      descriptor.get.dependencies = rest;
      return descriptor;
    };
  }
  var ComputedExpression =
  /*#__PURE__*/
  function (_Expression19) {
    _inheritsLoose(ComputedExpression, _Expression19);

    function ComputedExpression(name, dependencies) {
      var _this23;

      _this23 = _Expression19.call(this) || this;
      _this23.name = name;
      _this23.dependencies = dependencies;
      _this23.isAssignable = true;
      return _this23;
    }

    var _proto45 = ComputedExpression.prototype;

    _proto45.evaluate = function evaluate(scope, lookupFunctions) {
      return scope.bindingContext[this.name];
    };

    _proto45.assign = function assign(scope, value) {
      scope.bindingContext[this.name] = value;
    };

    _proto45.accept = function accept(visitor) {
      throw new Error('not implemented');
    };

    _proto45.connect = function connect(binding, scope) {
      var dependencies = this.dependencies;
      var i = dependencies.length;

      while (i--) {
        dependencies[i].connect(binding, scope);
      }
    };

    return ComputedExpression;
  }(Expression);
  function createComputedObserver(obj, propertyName, descriptor, observerLocator) {
    var dependencies = descriptor.get.dependencies;

    if (!(dependencies instanceof ComputedExpression)) {
      var _i29 = dependencies.length;

      while (_i29--) {
        dependencies[_i29] = observerLocator.parser.parse(dependencies[_i29]);
      }

      dependencies = descriptor.get.dependencies = new ComputedExpression(propertyName, dependencies);
    }

    var scope = {
      bindingContext: obj,
      overrideContext: createOverrideContext(obj)
    };
    return new ExpressionObserver(scope, dependencies, observerLocator);
  }
  var svgElements;
  var svgPresentationElements;
  var svgPresentationAttributes;
  var svgAnalyzer;

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
      "switch": ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
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

    var createElement = function createElement(html) {
      var div = DOM.createElement('div');
      div.innerHTML = html;
      return div.firstChild;
    };

    svgAnalyzer =
    /*#__PURE__*/
    function () {
      function SVGAnalyzer() {
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

      var _proto46 = SVGAnalyzer.prototype;

      _proto46.isStandardSvgAttribute = function isStandardSvgAttribute(nodeName, attributeName) {
        return presentationElements[nodeName] && presentationAttributes[attributeName] || elements[nodeName] && elements[nodeName].indexOf(attributeName) !== -1;
      };

      return SVGAnalyzer;
    }();
  }

  var elements = svgElements;
  var presentationElements = svgPresentationElements;
  var presentationAttributes = svgPresentationAttributes;
  var SVGAnalyzer = svgAnalyzer ||
  /*#__PURE__*/
  function () {
    function _class4() {}

    var _proto47 = _class4.prototype;

    _proto47.isStandardSvgAttribute = function isStandardSvgAttribute() {
      return false;
    };

    return _class4;
  }();
  var ObserverLocator = (_temp = _class11 =
  /*#__PURE__*/
  function () {
    function ObserverLocator(taskQueue, eventManager, dirtyChecker, svgAnalyzer, parser) {
      this.taskQueue = taskQueue;
      this.eventManager = eventManager;
      this.dirtyChecker = dirtyChecker;
      this.svgAnalyzer = svgAnalyzer;
      this.parser = parser;
      this.adapters = [];
      this.logger = getLogger('observer-locator');
    }

    var _proto48 = ObserverLocator.prototype;

    _proto48.getObserver = function getObserver(obj, propertyName) {
      var observersLookup = obj.__observers__;
      var observer;

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
    };

    _proto48.getOrCreateObserversLookup = function getOrCreateObserversLookup(obj) {
      return obj.__observers__ || this.createObserversLookup(obj);
    };

    _proto48.createObserversLookup = function createObserversLookup(obj) {
      var value = {};

      if (!Reflect.defineProperty(obj, '__observers__', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: value
      })) {
        this.logger.warn('Cannot add observers to object', obj);
      }

      return value;
    };

    _proto48.addAdapter = function addAdapter(adapter) {
      this.adapters.push(adapter);
    };

    _proto48.getAdapterObserver = function getAdapterObserver(obj, propertyName, descriptor) {
      for (var _i30 = 0, ii = this.adapters.length; _i30 < ii; _i30++) {
        var adapter = this.adapters[_i30];
        var observer = adapter.getObserver(obj, propertyName, descriptor);

        if (observer) {
          return observer;
        }
      }

      return null;
    };

    _proto48.createPropertyObserver = function createPropertyObserver(obj, propertyName) {
      var descriptor;
      var handler;
      var xlinkResult;

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
        var existingGetterOrSetter = descriptor.get || descriptor.set;

        if (existingGetterOrSetter) {
          if (existingGetterOrSetter.getObserver) {
            return existingGetterOrSetter.getObserver(obj);
          }

          var adapterObserver = this.getAdapterObserver(obj, propertyName, descriptor);

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
    };

    _proto48.getAccessor = function getAccessor(obj, propertyName) {
      if (obj instanceof DOM.Element) {
        if (propertyName === 'class' || propertyName === 'style' || propertyName === 'css' || propertyName === 'value' && (obj.tagName.toLowerCase() === 'input' || obj.tagName.toLowerCase() === 'select') || propertyName === 'checked' && obj.tagName.toLowerCase() === 'input' || propertyName === 'model' && obj.tagName.toLowerCase() === 'input' || /^xlink:.+$/.exec(propertyName)) {
          return this.getObserver(obj, propertyName);
        }

        if (/^\w+:|^data-|^aria-/.test(propertyName) || obj instanceof DOM.SVGElement && this.svgAnalyzer.isStandardSvgAttribute(obj.nodeName, propertyName) || obj.tagName.toLowerCase() === 'img' && propertyName === 'src' || obj.tagName.toLowerCase() === 'a' && propertyName === 'href') {
          return dataAttributeAccessor;
        }
      }

      return propertyAccessor;
    };

    _proto48.getArrayObserver = function getArrayObserver(array) {
      return _getArrayObserver(this.taskQueue, array);
    };

    _proto48.getMapObserver = function getMapObserver(map) {
      return _getMapObserver(this.taskQueue, map);
    };

    _proto48.getSetObserver = function getSetObserver(set) {
      return _getSetObserver(this.taskQueue, set);
    };

    return ObserverLocator;
  }(), _class11.inject = [TaskQueue, EventManager, DirtyChecker, SVGAnalyzer, Parser], _temp);
  var ObjectObservationAdapter =
  /*#__PURE__*/
  function () {
    function ObjectObservationAdapter() {}

    var _proto49 = ObjectObservationAdapter.prototype;

    _proto49.getObserver = function getObserver(object, propertyName, descriptor) {
      throw new Error('BindingAdapters must implement getObserver(object, propertyName).');
    };

    return ObjectObservationAdapter;
  }();
  var BindingExpression =
  /*#__PURE__*/
  function () {
    function BindingExpression(observerLocator, targetProperty, sourceExpression, mode, lookupFunctions, attribute) {
      this.observerLocator = observerLocator;
      this.targetProperty = targetProperty;
      this.sourceExpression = sourceExpression;
      this.mode = mode;
      this.lookupFunctions = lookupFunctions;
      this.attribute = attribute;
      this.discrete = false;
    }

    var _proto50 = BindingExpression.prototype;

    _proto50.createBinding = function createBinding(target) {
      return new Binding(this.observerLocator, this.sourceExpression, target, this.targetProperty, this.mode, this.lookupFunctions);
    };

    return BindingExpression;
  }();
  var Binding = (_dec10 = connectable(), _dec10(_class12 =
  /*#__PURE__*/
  function () {
    function Binding(observerLocator, sourceExpression, target, targetProperty, mode, lookupFunctions) {
      this.observerLocator = observerLocator;
      this.sourceExpression = sourceExpression;
      this.target = target;
      this.targetProperty = targetProperty;
      this.mode = mode;
      this.lookupFunctions = lookupFunctions;
    }

    var _proto51 = Binding.prototype;

    _proto51.updateTarget = function updateTarget(value) {
      this.targetObserver.setValue(value, this.target, this.targetProperty);
    };

    _proto51.updateSource = function updateSource(value) {
      this.sourceExpression.assign(this.source, value, this.lookupFunctions);
    };

    _proto51.call = function call(context, newValue, oldValue) {
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

      throw new Error("Unexpected call context " + context);
    };

    _proto51.bind = function bind(source) {
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

      var mode = this.mode;

      if (!this.targetObserver) {
        var method = mode === bindingMode.twoWay || mode === bindingMode.fromView ? 'getObserver' : 'getAccessor';
        this.targetObserver = this.observerLocator[method](this.target, this.targetProperty);
      }

      if ('bind' in this.targetObserver) {
        this.targetObserver.bind();
      }

      if (this.mode !== bindingMode.fromView) {
        var value = this.sourceExpression.evaluate(source, this.lookupFunctions);
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
    };

    _proto51.unbind = function unbind() {
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
    };

    _proto51.connect = function connect(evaluate) {
      if (!this.isBound) {
        return;
      }

      if (evaluate) {
        var value = this.sourceExpression.evaluate(this.source, this.lookupFunctions);
        this.updateTarget(value);
      }

      this.sourceExpression.connect(this, this.source);
    };

    return Binding;
  }()) || _class12);
  var CallExpression =
  /*#__PURE__*/
  function () {
    function CallExpression(observerLocator, targetProperty, sourceExpression, lookupFunctions) {
      this.observerLocator = observerLocator;
      this.targetProperty = targetProperty;
      this.sourceExpression = sourceExpression;
      this.lookupFunctions = lookupFunctions;
    }

    var _proto52 = CallExpression.prototype;

    _proto52.createBinding = function createBinding(target) {
      return new Call(this.observerLocator, this.sourceExpression, target, this.targetProperty, this.lookupFunctions);
    };

    return CallExpression;
  }();
  var Call =
  /*#__PURE__*/
  function () {
    function Call(observerLocator, sourceExpression, target, targetProperty, lookupFunctions) {
      this.sourceExpression = sourceExpression;
      this.target = target;
      this.targetProperty = observerLocator.getObserver(target, targetProperty);
      this.lookupFunctions = lookupFunctions;
    }

    var _proto53 = Call.prototype;

    _proto53.callSource = function callSource($event) {
      var overrideContext = this.source.overrideContext;
      Object.assign(overrideContext, $event);
      overrideContext.$event = $event;
      var mustEvaluate = true;
      var result = this.sourceExpression.evaluate(this.source, this.lookupFunctions, mustEvaluate);
      delete overrideContext.$event;

      for (var prop in $event) {
        delete overrideContext[prop];
      }

      return result;
    };

    _proto53.bind = function bind(source) {
      var _this24 = this;

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

      this.targetProperty.setValue(function ($event) {
        return _this24.callSource($event);
      });
    };

    _proto53.unbind = function unbind() {
      if (!this.isBound) {
        return;
      }

      this.isBound = false;

      if (this.sourceExpression.unbind) {
        this.sourceExpression.unbind(this, this.source);
      }

      this.source = null;
      this.targetProperty.setValue(null);
    };

    return Call;
  }();
  var ValueConverterResource =
  /*#__PURE__*/
  function () {
    function ValueConverterResource(name) {
      this.name = name;
    }

    ValueConverterResource.convention = function convention(name) {
      if (name.endsWith('ValueConverter')) {
        return new ValueConverterResource(camelCase(name.substring(0, name.length - 14)));
      }
    };

    var _proto54 = ValueConverterResource.prototype;

    _proto54.initialize = function initialize(container, target) {
      this.instance = container.get(target);
    };

    _proto54.register = function register(registry, name) {
      registry.registerValueConverter(name || this.name, this.instance);
    };

    _proto54.load = function load(container, target) {};

    return ValueConverterResource;
  }();
  function valueConverter(nameOrTarget) {
    if (nameOrTarget === undefined || typeof nameOrTarget === 'string') {
      return function (target) {
        metadata.define(metadata.resource, new ValueConverterResource(nameOrTarget), target);
      };
    }

    metadata.define(metadata.resource, new ValueConverterResource(), nameOrTarget);
  }
  var BindingBehaviorResource =
  /*#__PURE__*/
  function () {
    function BindingBehaviorResource(name) {
      this.name = name;
    }

    BindingBehaviorResource.convention = function convention(name) {
      if (name.endsWith('BindingBehavior')) {
        return new BindingBehaviorResource(camelCase(name.substring(0, name.length - 15)));
      }
    };

    var _proto55 = BindingBehaviorResource.prototype;

    _proto55.initialize = function initialize(container, target) {
      this.instance = container.get(target);
    };

    _proto55.register = function register(registry, name) {
      registry.registerBindingBehavior(name || this.name, this.instance);
    };

    _proto55.load = function load(container, target) {};

    return BindingBehaviorResource;
  }();
  function bindingBehavior(nameOrTarget) {
    if (nameOrTarget === undefined || typeof nameOrTarget === 'string') {
      return function (target) {
        metadata.define(metadata.resource, new BindingBehaviorResource(nameOrTarget), target);
      };
    }

    metadata.define(metadata.resource, new BindingBehaviorResource(), nameOrTarget);
  }
  var ListenerExpression =
  /*#__PURE__*/
  function () {
    function ListenerExpression(eventManager, targetEvent, sourceExpression, delegationStrategy, preventDefault, lookupFunctions) {
      this.eventManager = eventManager;
      this.targetEvent = targetEvent;
      this.sourceExpression = sourceExpression;
      this.delegationStrategy = delegationStrategy;
      this.discrete = true;
      this.preventDefault = preventDefault;
      this.lookupFunctions = lookupFunctions;
    }

    var _proto56 = ListenerExpression.prototype;

    _proto56.createBinding = function createBinding(target) {
      return new Listener(this.eventManager, this.targetEvent, this.delegationStrategy, this.sourceExpression, target, this.preventDefault, this.lookupFunctions);
    };

    return ListenerExpression;
  }();
  var Listener =
  /*#__PURE__*/
  function () {
    function Listener(eventManager, targetEvent, delegationStrategy, sourceExpression, target, preventDefault, lookupFunctions) {
      this.eventManager = eventManager;
      this.targetEvent = targetEvent;
      this.delegationStrategy = delegationStrategy;
      this.sourceExpression = sourceExpression;
      this.target = target;
      this.preventDefault = preventDefault;
      this.lookupFunctions = lookupFunctions;
    }

    var _proto57 = Listener.prototype;

    _proto57.callSource = function callSource(event) {
      var overrideContext = this.source.overrideContext;
      overrideContext.$event = event;
      var mustEvaluate = true;
      var result = this.sourceExpression.evaluate(this.source, this.lookupFunctions, mustEvaluate);
      delete overrideContext.$event;

      if (result !== true && this.preventDefault) {
        event.preventDefault();
      }

      return result;
    };

    _proto57.handleEvent = function handleEvent(event) {
      this.callSource(event);
    };

    _proto57.bind = function bind(source) {
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
    };

    _proto57.unbind = function unbind() {
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
    };

    return Listener;
  }();

  function getAU(element) {
    var au = element.au;

    if (au === undefined) {
      throw new Error("No Aurelia APIs are defined for the element: \"" + element.tagName + "\".");
    }

    return au;
  }

  var NameExpression =
  /*#__PURE__*/
  function () {
    function NameExpression(sourceExpression, apiName, lookupFunctions) {
      this.sourceExpression = sourceExpression;
      this.apiName = apiName;
      this.lookupFunctions = lookupFunctions;
      this.discrete = true;
    }

    var _proto58 = NameExpression.prototype;

    _proto58.createBinding = function createBinding(target) {
      return new NameBinder(this.sourceExpression, NameExpression.locateAPI(target, this.apiName), this.lookupFunctions);
    };

    NameExpression.locateAPI = function locateAPI(element, apiName) {
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
          var target = getAU(element)[apiName];

          if (target === undefined) {
            throw new Error("Attempted to reference \"" + apiName + "\", but it was not found amongst the target's API.");
          }

          return target.viewModel;
      }
    };

    return NameExpression;
  }();

  var NameBinder =
  /*#__PURE__*/
  function () {
    function NameBinder(sourceExpression, target, lookupFunctions) {
      this.sourceExpression = sourceExpression;
      this.target = target;
      this.lookupFunctions = lookupFunctions;
    }

    var _proto59 = NameBinder.prototype;

    _proto59.bind = function bind(source) {
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
    };

    _proto59.unbind = function unbind() {
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
    };

    return NameBinder;
  }();

  var LookupFunctions = {
    bindingBehaviors: function bindingBehaviors(name) {
      return null;
    },
    valueConverters: function valueConverters(name) {
      return null;
    }
  };
  var BindingEngine = (_temp2 = _class13 =
  /*#__PURE__*/
  function () {
    function BindingEngine(observerLocator, parser) {
      this.observerLocator = observerLocator;
      this.parser = parser;
    }

    var _proto60 = BindingEngine.prototype;

    _proto60.createBindingExpression = function createBindingExpression(targetProperty, sourceExpression, mode, lookupFunctions) {
      if (mode === void 0) {
        mode = bindingMode.toView;
      }

      if (lookupFunctions === void 0) {
        lookupFunctions = LookupFunctions;
      }

      return new BindingExpression(this.observerLocator, targetProperty, this.parser.parse(sourceExpression), mode, lookupFunctions);
    };

    _proto60.propertyObserver = function propertyObserver(obj, propertyName) {
      var _this25 = this;

      return {
        subscribe: function subscribe(callback) {
          var observer = _this25.observerLocator.getObserver(obj, propertyName);

          observer.subscribe(callback);
          return {
            dispose: function dispose() {
              return observer.unsubscribe(callback);
            }
          };
        }
      };
    };

    _proto60.collectionObserver = function collectionObserver(collection) {
      var _this26 = this;

      return {
        subscribe: function subscribe(callback) {
          var observer;

          if (collection instanceof Array) {
            observer = _this26.observerLocator.getArrayObserver(collection);
          } else if (collection instanceof Map) {
            observer = _this26.observerLocator.getMapObserver(collection);
          } else if (collection instanceof Set) {
            observer = _this26.observerLocator.getSetObserver(collection);
          } else {
            throw new Error('collection must be an instance of Array, Map or Set.');
          }

          observer.subscribe(callback);
          return {
            dispose: function dispose() {
              return observer.unsubscribe(callback);
            }
          };
        }
      };
    };

    _proto60.expressionObserver = function expressionObserver(bindingContext, expression) {
      var scope = {
        bindingContext: bindingContext,
        overrideContext: createOverrideContext(bindingContext)
      };
      return new ExpressionObserver(scope, this.parser.parse(expression), this.observerLocator, LookupFunctions);
    };

    _proto60.parseExpression = function parseExpression(expression) {
      return this.parser.parse(expression);
    };

    _proto60.registerAdapter = function registerAdapter(adapter) {
      this.observerLocator.addAdapter(adapter);
    };

    return BindingEngine;
  }(), _class13.inject = [ObserverLocator, Parser], _temp2);
  var setProto = Set.prototype;

  function _getSetObserver(taskQueue, set) {
    return ModifySetObserver["for"](taskQueue, set);
  }

  var ModifySetObserver =
  /*#__PURE__*/
  function (_ModifyCollectionObse3) {
    _inheritsLoose(ModifySetObserver, _ModifyCollectionObse3);

    function ModifySetObserver(taskQueue, set) {
      return _ModifyCollectionObse3.call(this, taskQueue, set) || this;
    }

    ModifySetObserver["for"] = function _for(taskQueue, set) {
      if (!('__set_observer__' in set)) {
        Reflect.defineProperty(set, '__set_observer__', {
          value: ModifySetObserver.create(taskQueue, set),
          enumerable: false,
          configurable: false
        });
      }

      return set.__set_observer__;
    };

    ModifySetObserver.create = function create(taskQueue, set) {
      var observer = new ModifySetObserver(taskQueue, set);
      var proto = setProto;

      if (proto.add !== set.add || proto["delete"] !== set["delete"] || proto.clear !== set.clear) {
        proto = {
          add: set.add,
          "delete": set["delete"],
          clear: set.clear
        };
      }

      set.add = function () {
        var type = 'add';
        var oldSize = set.size;
        var methodCallResult = proto.add.apply(set, arguments);
        var hasValue = set.size === oldSize;

        if (!hasValue) {
          observer.addChangeRecord({
            type: type,
            object: set,
            value: Array.from(set).pop()
          });
        }

        return methodCallResult;
      };

      set["delete"] = function () {
        var hasValue = set.has(arguments[0]);
        var methodCallResult = proto["delete"].apply(set, arguments);

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
        var methodCallResult = proto.clear.apply(set, arguments);
        observer.addChangeRecord({
          type: 'clear',
          object: set
        });
        return methodCallResult;
      };

      return observer;
    };

    return ModifySetObserver;
  }(ModifyCollectionObserver);

  function observable(targetOrConfig, key, descriptor) {
    function deco(target, key, descriptor, config) {
      var isClassDecorator = key === undefined;

      if (isClassDecorator) {
        target = target.prototype;
        key = typeof config === 'string' ? config : config.name;
      }

      var innerPropertyName = "_" + key;
      var innerPropertyDescriptor = {
        configurable: true,
        enumerable: false,
        writable: true
      };
      var callbackName = config && config.changeHandler || key + "Changed";

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
        var oldValue = this[innerPropertyName];

        if (newValue === oldValue) {
          return;
        }

        this[innerPropertyName] = newValue;
        Reflect.defineProperty(this, innerPropertyName, {
          enumerable: false
        });

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
      return function (t, k, d) {
        return deco(t, k, d, targetOrConfig);
      };
    }

    return deco(targetOrConfig, key, descriptor);
  }
  var signals = {};
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
  var animationEvent = {
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
  var Animator =
  /*#__PURE__*/
  function () {
    function Animator() {}

    var _proto = Animator.prototype;

    _proto.enter = function enter(element) {
      return Promise.resolve(false);
    };

    _proto.leave = function leave(element) {
      return Promise.resolve(false);
    };

    _proto.removeClass = function removeClass(element, className) {
      element.classList.remove(className);
      return Promise.resolve(false);
    };

    _proto.addClass = function addClass(element, className) {
      element.classList.add(className);
      return Promise.resolve(false);
    };

    _proto.animate = function animate(element, className) {
      return Promise.resolve(false);
    };

    _proto.runSequence = function runSequence(animations) {};

    _proto.registerEffect = function registerEffect(effectName, properties) {};

    _proto.unregisterEffect = function unregisterEffect(effectName) {};

    return Animator;
  }();
  var CompositionTransactionNotifier =
  /*#__PURE__*/
  function () {
    function CompositionTransactionNotifier(owner) {
      this.owner = owner;
      this.owner._compositionCount++;
    }

    var _proto2 = CompositionTransactionNotifier.prototype;

    _proto2.done = function done() {
      this.owner._compositionCount--;

      this.owner._tryCompleteTransaction();
    };

    return CompositionTransactionNotifier;
  }();
  var CompositionTransactionOwnershipToken =
  /*#__PURE__*/
  function () {
    function CompositionTransactionOwnershipToken(owner) {
      this.owner = owner;
      this.owner._ownershipToken = this;
      this.thenable = this._createThenable();
    }

    var _proto3 = CompositionTransactionOwnershipToken.prototype;

    _proto3.waitForCompositionComplete = function waitForCompositionComplete() {
      this.owner._tryCompleteTransaction();

      return this.thenable;
    };

    _proto3.resolve = function resolve() {
      this._resolveCallback();
    };

    _proto3._createThenable = function _createThenable() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this._resolveCallback = resolve;
      });
    };

    return CompositionTransactionOwnershipToken;
  }();
  var CompositionTransaction =
  /*#__PURE__*/
  function () {
    function CompositionTransaction() {
      this._ownershipToken = null;
      this._compositionCount = 0;
    }

    var _proto4 = CompositionTransaction.prototype;

    _proto4.tryCapture = function tryCapture() {
      return this._ownershipToken === null ? new CompositionTransactionOwnershipToken(this) : null;
    };

    _proto4.enlist = function enlist() {
      return new CompositionTransactionNotifier(this);
    };

    _proto4._tryCompleteTransaction = function _tryCompleteTransaction() {
      if (this._compositionCount <= 0) {
        this._compositionCount = 0;

        if (this._ownershipToken !== null) {
          var token = this._ownershipToken;
          this._ownershipToken = null;
          token.resolve();
        }
      }
    };

    return CompositionTransaction;
  }();
  var capitalMatcher = /([A-Z])/g;

  function addHyphenAndLower(_char) {
    return '-' + _char.toLowerCase();
  }

  function _hyphenate(name) {
    return (name.charAt(0).toLowerCase() + name.slice(1)).replace(capitalMatcher, addHyphenAndLower);
  }
  function _isAllWhitespace(node) {
    return !(node.auInterpolationTarget || /[^\t\n\r ]/.test(node.textContent));
  }
  var ViewEngineHooksResource =
  /*#__PURE__*/
  function () {
    function ViewEngineHooksResource() {}

    var _proto5 = ViewEngineHooksResource.prototype;

    _proto5.initialize = function initialize(container, target) {
      this.instance = container.get(target);
    };

    _proto5.register = function register(registry, name) {
      registry.registerViewEngineHooks(this.instance);
    };

    _proto5.load = function load(container, target) {};

    ViewEngineHooksResource.convention = function convention(name) {
      if (name.endsWith('ViewEngineHooks')) {
        return new ViewEngineHooksResource();
      }
    };

    return ViewEngineHooksResource;
  }();
  function viewEngineHooks(target) {
    var deco = function deco(t) {
      metadata.define(metadata.resource, new ViewEngineHooksResource(), t);
    };

    return target ? deco(target) : deco;
  }
  var ElementEvents =
  /*#__PURE__*/
  function () {
    function ElementEvents(element) {
      this.element = element;
      this.subscriptions = {};
    }

    var _proto6 = ElementEvents.prototype;

    _proto6._enqueueHandler = function _enqueueHandler(handler) {
      this.subscriptions[handler.eventName] = this.subscriptions[handler.eventName] || [];
      this.subscriptions[handler.eventName].push(handler);
    };

    _proto6._dequeueHandler = function _dequeueHandler(handler) {
      var index;
      var subscriptions = this.subscriptions[handler.eventName];

      if (subscriptions) {
        index = subscriptions.indexOf(handler);

        if (index > -1) {
          subscriptions.splice(index, 1);
        }
      }

      return handler;
    };

    _proto6.publish = function publish(eventName, detail, bubbles, cancelable) {
      if (detail === void 0) {
        detail = {};
      }

      if (bubbles === void 0) {
        bubbles = true;
      }

      if (cancelable === void 0) {
        cancelable = true;
      }

      var event = DOM.createCustomEvent(eventName, {
        cancelable: cancelable,
        bubbles: bubbles,
        detail: detail
      });
      this.element.dispatchEvent(event);
    };

    _proto6.subscribe = function subscribe(eventName, handler, captureOrOptions) {
      if (captureOrOptions === void 0) {
        captureOrOptions = true;
      }

      if (typeof handler === 'function') {
        var eventHandler = new EventHandlerImpl(this, eventName, handler, captureOrOptions, false);
        return eventHandler;
      }

      return undefined;
    };

    _proto6.subscribeOnce = function subscribeOnce(eventName, handler, captureOrOptions) {
      if (captureOrOptions === void 0) {
        captureOrOptions = true;
      }

      if (typeof handler === 'function') {
        var eventHandler = new EventHandlerImpl(this, eventName, handler, captureOrOptions, true);
        return eventHandler;
      }

      return undefined;
    };

    _proto6.dispose = function dispose(eventName) {
      if (eventName && typeof eventName === 'string') {
        var subscriptions = this.subscriptions[eventName];

        if (subscriptions) {
          while (subscriptions.length) {
            var subscription = subscriptions.pop();

            if (subscription) {
              subscription.dispose();
            }
          }
        }
      } else {
        this.disposeAll();
      }
    };

    _proto6.disposeAll = function disposeAll() {
      for (var key in this.subscriptions) {
        this.dispose(key);
      }
    };

    return ElementEvents;
  }();

  var EventHandlerImpl =
  /*#__PURE__*/
  function () {
    function EventHandlerImpl(owner, eventName, handler, captureOrOptions, once) {
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

    var _proto7 = EventHandlerImpl.prototype;

    _proto7.handleEvent = function handleEvent(e) {
      var fn = this.handler;
      fn(e);

      if (this.once) {
        this.dispose();
      }
    };

    _proto7.dispose = function dispose() {
      this.owner.element.removeEventListener(this.eventName, this, this.captureOrOptions);

      this.owner._dequeueHandler(this);

      this.owner = this.handler = null;
    };

    return EventHandlerImpl;
  }();

  var ResourceLoadContext =
  /*#__PURE__*/
  function () {
    function ResourceLoadContext() {
      this.dependencies = {};
    }

    var _proto8 = ResourceLoadContext.prototype;

    _proto8.addDependency = function addDependency(url) {
      this.dependencies[url] = true;
    };

    _proto8.hasDependency = function hasDependency(url) {
      return url in this.dependencies;
    };

    return ResourceLoadContext;
  }();
  var ViewCompileInstruction = function ViewCompileInstruction(targetShadowDOM, compileSurrogate) {
    if (targetShadowDOM === void 0) {
      targetShadowDOM = false;
    }

    if (compileSurrogate === void 0) {
      compileSurrogate = false;
    }

    this.targetShadowDOM = targetShadowDOM;
    this.compileSurrogate = compileSurrogate;
    this.associatedModuleId = null;
  };
  ViewCompileInstruction.normal = new ViewCompileInstruction();
  var BehaviorInstruction =
  /*#__PURE__*/
  function () {
    function BehaviorInstruction() {}

    BehaviorInstruction.enhance = function enhance() {
      var instruction = new BehaviorInstruction();
      instruction.enhance = true;
      return instruction;
    };

    BehaviorInstruction.unitTest = function unitTest(type, attributes) {
      var instruction = new BehaviorInstruction();
      instruction.type = type;
      instruction.attributes = attributes || {};
      return instruction;
    };

    BehaviorInstruction.element = function element(node, type) {
      var instruction = new BehaviorInstruction();
      instruction.type = type;
      instruction.attributes = {};
      instruction.anchorIsContainer = !(node.hasAttribute('containerless') || type.containerless);
      instruction.initiatedByBehavior = true;
      return instruction;
    };

    BehaviorInstruction.attribute = function attribute(attrName, type) {
      var instruction = new BehaviorInstruction();
      instruction.attrName = attrName;
      instruction.type = type || null;
      instruction.attributes = {};
      return instruction;
    };

    BehaviorInstruction.dynamic = function dynamic(host, viewModel, viewFactory) {
      var instruction = new BehaviorInstruction();
      instruction.host = host;
      instruction.viewModel = viewModel;
      instruction.viewFactory = viewFactory;
      instruction.inheritBindingContext = true;
      return instruction;
    };

    return BehaviorInstruction;
  }();
  var biProto = BehaviorInstruction.prototype;
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
  var TargetInstruction = (_temp$1 = _class$2 =
  /*#__PURE__*/
  function () {
    function TargetInstruction() {}

    TargetInstruction.shadowSlot = function shadowSlot(parentInjectorId) {
      var instruction = new TargetInstruction();
      instruction.parentInjectorId = parentInjectorId;
      instruction.shadowSlot = true;
      return instruction;
    };

    TargetInstruction.contentExpression = function contentExpression(expression) {
      var instruction = new TargetInstruction();
      instruction.contentExpression = expression;
      return instruction;
    };

    TargetInstruction.letElement = function letElement(expressions) {
      var instruction = new TargetInstruction();
      instruction.expressions = expressions;
      instruction.letElement = true;
      return instruction;
    };

    TargetInstruction.lifting = function lifting(parentInjectorId, liftingInstruction) {
      var instruction = new TargetInstruction();
      instruction.parentInjectorId = parentInjectorId;
      instruction.expressions = TargetInstruction.noExpressions;
      instruction.behaviorInstructions = [liftingInstruction];
      instruction.viewFactory = liftingInstruction.viewFactory;
      instruction.providers = [liftingInstruction.type.target];
      instruction.lifting = true;
      return instruction;
    };

    TargetInstruction.normal = function normal(injectorId, parentInjectorId, providers, behaviorInstructions, expressions, elementInstruction) {
      var instruction = new TargetInstruction();
      instruction.injectorId = injectorId;
      instruction.parentInjectorId = parentInjectorId;
      instruction.providers = providers;
      instruction.behaviorInstructions = behaviorInstructions;
      instruction.expressions = expressions;
      instruction.anchorIsContainer = elementInstruction ? elementInstruction.anchorIsContainer : true;
      instruction.elementInstruction = elementInstruction;
      return instruction;
    };

    TargetInstruction.surrogate = function surrogate(providers, behaviorInstructions, expressions, values) {
      var instruction = new TargetInstruction();
      instruction.expressions = expressions;
      instruction.behaviorInstructions = behaviorInstructions;
      instruction.providers = providers;
      instruction.values = values;
      return instruction;
    };

    return TargetInstruction;
  }(), _class$2.noExpressions = Object.freeze([]), _temp$1);
  var tiProto = TargetInstruction.prototype;
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
  var viewStrategy = protocol.create('aurelia:view-strategy', {
    validate: function validate(target) {
      if (!(typeof target.loadViewFactory === 'function')) {
        return 'View strategies must implement: loadViewFactory(viewEngine: ViewEngine, compileInstruction: ViewCompileInstruction, loadContext?: ResourceLoadContext): Promise<ViewFactory>';
      }

      return true;
    },
    compose: function compose(target) {
      if (!(typeof target.makeRelativeTo === 'function')) {
        target.makeRelativeTo = PLATFORM.noop;
      }
    }
  });
  var RelativeViewStrategy = (_dec$2 = viewStrategy(), _dec$2(_class2$2 =
  /*#__PURE__*/
  function () {
    function RelativeViewStrategy(path) {
      this.path = path;
      this.absolutePath = null;
    }

    var _proto9 = RelativeViewStrategy.prototype;

    _proto9.loadViewFactory = function loadViewFactory(viewEngine, compileInstruction, loadContext, target) {
      if (this.absolutePath === null && this.moduleId) {
        this.absolutePath = relativeToFile(this.path, this.moduleId);
      }

      compileInstruction.associatedModuleId = this.moduleId;
      return viewEngine.loadViewFactory(this.absolutePath || this.path, compileInstruction, loadContext, target);
    };

    _proto9.makeRelativeTo = function makeRelativeTo(file) {
      if (this.absolutePath === null) {
        this.absolutePath = relativeToFile(this.path, file);
      }
    };

    return RelativeViewStrategy;
  }()) || _class2$2);
  var ConventionalViewStrategy = (_dec2$2 = viewStrategy(), _dec2$2(_class3$2 =
  /*#__PURE__*/
  function () {
    function ConventionalViewStrategy(viewLocator, origin) {
      this.moduleId = origin.moduleId;
      this.viewUrl = viewLocator.convertOriginToViewUrl(origin);
    }

    var _proto10 = ConventionalViewStrategy.prototype;

    _proto10.loadViewFactory = function loadViewFactory(viewEngine, compileInstruction, loadContext, target) {
      compileInstruction.associatedModuleId = this.moduleId;
      return viewEngine.loadViewFactory(this.viewUrl, compileInstruction, loadContext, target);
    };

    return ConventionalViewStrategy;
  }()) || _class3$2);
  var NoViewStrategy = (_dec3$2 = viewStrategy(), _dec3$2(_class4$1 =
  /*#__PURE__*/
  function () {
    function NoViewStrategy(dependencies, dependencyBaseUrl) {
      this.dependencies = dependencies || null;
      this.dependencyBaseUrl = dependencyBaseUrl || '';
    }

    var _proto11 = NoViewStrategy.prototype;

    _proto11.loadViewFactory = function loadViewFactory(viewEngine, compileInstruction, loadContext, target) {
      var entry = this.entry;
      var dependencies = this.dependencies;

      if (entry && entry.factoryIsReady) {
        return Promise.resolve(null);
      }

      this.entry = entry = new TemplateRegistryEntry(this.moduleId || this.dependencyBaseUrl);
      entry.dependencies = [];
      entry.templateIsLoaded = true;

      if (dependencies !== null) {
        for (var i = 0, ii = dependencies.length; i < ii; ++i) {
          var current = dependencies[i];

          if (typeof current === 'string' || typeof current === 'function') {
            entry.addDependency(current);
          } else {
            entry.addDependency(current.from, current.as);
          }
        }
      }

      compileInstruction.associatedModuleId = this.moduleId;
      return viewEngine.loadViewFactory(entry, compileInstruction, loadContext, target);
    };

    return NoViewStrategy;
  }()) || _class4$1);
  var TemplateRegistryViewStrategy = (_dec4$2 = viewStrategy(), _dec4$2(_class5$2 =
  /*#__PURE__*/
  function () {
    function TemplateRegistryViewStrategy(moduleId, entry) {
      this.moduleId = moduleId;
      this.entry = entry;
    }

    var _proto12 = TemplateRegistryViewStrategy.prototype;

    _proto12.loadViewFactory = function loadViewFactory(viewEngine, compileInstruction, loadContext, target) {
      var entry = this.entry;

      if (entry.factoryIsReady) {
        return Promise.resolve(entry.factory);
      }

      compileInstruction.associatedModuleId = this.moduleId;
      return viewEngine.loadViewFactory(entry, compileInstruction, loadContext, target);
    };

    return TemplateRegistryViewStrategy;
  }()) || _class5$2);
  var InlineViewStrategy = (_dec5$2 = viewStrategy(), _dec5$2(_class6$1 =
  /*#__PURE__*/
  function () {
    function InlineViewStrategy(markup, dependencies, dependencyBaseUrl) {
      this.markup = markup;
      this.dependencies = dependencies || null;
      this.dependencyBaseUrl = dependencyBaseUrl || '';
    }

    var _proto13 = InlineViewStrategy.prototype;

    _proto13.loadViewFactory = function loadViewFactory(viewEngine, compileInstruction, loadContext, target) {
      var entry = this.entry;
      var dependencies = this.dependencies;

      if (entry && entry.factoryIsReady) {
        return Promise.resolve(entry.factory);
      }

      this.entry = entry = new TemplateRegistryEntry(this.moduleId || this.dependencyBaseUrl);
      entry.template = DOM.createTemplateFromMarkup(this.markup);

      if (dependencies !== null) {
        for (var i = 0, ii = dependencies.length; i < ii; ++i) {
          var current = dependencies[i];

          if (typeof current === 'string' || typeof current === 'function') {
            entry.addDependency(current);
          } else {
            entry.addDependency(current.from, current.as);
          }
        }
      }

      compileInstruction.associatedModuleId = this.moduleId;
      return viewEngine.loadViewFactory(entry, compileInstruction, loadContext, target);
    };

    return InlineViewStrategy;
  }()) || _class6$1);
  var StaticViewStrategy = (_dec6$2 = viewStrategy(), _dec6$2(_class7$2 =
  /*#__PURE__*/
  function () {
    function StaticViewStrategy(config) {
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

    var _proto14 = StaticViewStrategy.prototype;

    _proto14.loadViewFactory = function loadViewFactory(viewEngine, compileInstruction, loadContext, target) {
      var _this2 = this;

      if (this.factoryIsReady) {
        return Promise.resolve(this.factory);
      }

      var deps = this.dependencies;
      deps = typeof deps === 'function' ? deps() : deps;
      deps = deps ? deps : [];
      deps = Array.isArray(deps) ? deps : [deps];
      return Promise.all(deps).then(function (dependencies) {
        var container = viewEngine.container;
        var appResources = viewEngine.appResources;
        var viewCompiler = viewEngine.viewCompiler;
        var viewResources = new ViewResources(appResources);
        var resource;
        var elDeps = [];

        if (target) {
          viewResources.autoRegister(container, target);
        }

        for (var _iterator = dependencies, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var dep = _ref;

          if (typeof dep === 'function') {
            resource = viewResources.autoRegister(container, dep);

            if (resource.elementName !== null) {
              elDeps.push(resource);
            }
          } else if (dep && typeof dep === 'object') {
            for (var key in dep) {
              var exported = dep[key];

              if (typeof exported === 'function') {
                resource = viewResources.autoRegister(container, exported);

                if (resource.elementName !== null) {
                  elDeps.push(resource);
                }
              }
            }
          } else {
            throw new Error("dependency neither function nor object. Received: \"" + typeof dep + "\"");
          }
        }

        return Promise.all(elDeps.map(function (el) {
          return el.load(container, el.target);
        })).then(function () {
          var factory = _this2.template !== null ? viewCompiler.compile(_this2.template, viewResources, compileInstruction) : null;
          _this2.factoryIsReady = true;
          _this2.factory = factory;
          return factory;
        });
      });
    };

    return StaticViewStrategy;
  }()) || _class7$2);
  var ViewLocator = (_temp2$1 = _class8$1 =
  /*#__PURE__*/
  function () {
    function ViewLocator() {}

    var _proto15 = ViewLocator.prototype;

    _proto15.getViewStrategy = function getViewStrategy(value) {
      if (!value) {
        return null;
      }

      if (typeof value === 'object' && 'getViewStrategy' in value) {
        var _origin = Origin.get(value.constructor);

        value = value.getViewStrategy();

        if (typeof value === 'string') {
          value = new RelativeViewStrategy(value);
        }

        viewStrategy.assert(value);

        if (_origin.moduleId) {
          value.makeRelativeTo(_origin.moduleId);
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
        var c = value.$view;

        var _view;

        c = typeof c === 'function' ? c.call(value) : c;

        if (c === null) {
          _view = new NoViewStrategy();
        } else {
          _view = c instanceof StaticViewStrategy ? c : new StaticViewStrategy(c);
        }

        metadata.define(ViewLocator.viewStrategyMetadataKey, _view, value);
        return _view;
      }

      var origin = Origin.get(value);
      var strategy = metadata.get(ViewLocator.viewStrategyMetadataKey, value);

      if (!strategy) {
        if (!origin.moduleId) {
          throw new Error('Cannot determine default view strategy for object.', value);
        }

        strategy = this.createFallbackViewStrategy(origin);
      } else if (origin.moduleId) {
        strategy.moduleId = origin.moduleId;
      }

      return strategy;
    };

    _proto15.createFallbackViewStrategy = function createFallbackViewStrategy(origin) {
      return new ConventionalViewStrategy(this, origin);
    };

    _proto15.convertOriginToViewUrl = function convertOriginToViewUrl(origin) {
      var moduleId = origin.moduleId;
      var id = moduleId.endsWith('.js') || moduleId.endsWith('.ts') ? moduleId.substring(0, moduleId.length - 3) : moduleId;
      return id + '.html';
    };

    return ViewLocator;
  }(), _class8$1.viewStrategyMetadataKey = 'aurelia:view-strategy', _temp2$1);

  function mi(name) {
    throw new Error("BindingLanguage must implement " + name + "().");
  }

  var BindingLanguage =
  /*#__PURE__*/
  function () {
    function BindingLanguage() {}

    var _proto16 = BindingLanguage.prototype;

    _proto16.inspectAttribute = function inspectAttribute(resources, elementName, attrName, attrValue) {
      mi('inspectAttribute');
    };

    _proto16.createAttributeInstruction = function createAttributeInstruction(resources, element, info, existingInstruction) {
      mi('createAttributeInstruction');
    };

    _proto16.createLetExpressions = function createLetExpressions(resources, element) {
      mi('createLetExpressions');
    };

    _proto16.inspectTextContent = function inspectTextContent(resources, value) {
      mi('inspectTextContent');
    };

    return BindingLanguage;
  }();
  var noNodes = Object.freeze([]);
  var SlotCustomAttribute =
  /*#__PURE__*/
  function () {
    SlotCustomAttribute.inject = function inject() {
      return [DOM.Element];
    };

    function SlotCustomAttribute(element) {
      this.element = element;
      this.element.auSlotAttribute = this;
    }

    var _proto17 = SlotCustomAttribute.prototype;

    _proto17.valueChanged = function valueChanged(newValue, oldValue) {};

    return SlotCustomAttribute;
  }();
  var PassThroughSlot =
  /*#__PURE__*/
  function () {
    function PassThroughSlot(anchor, name, destinationName, fallbackFactory) {
      this.anchor = anchor;
      this.anchor.viewSlot = this;
      this.name = name;
      this.destinationName = destinationName;
      this.fallbackFactory = fallbackFactory;
      this.destinationSlot = null;
      this.projections = 0;
      this.contentView = null;
      var attr = new SlotCustomAttribute(this.anchor);
      attr.value = this.destinationName;
    }

    var _proto18 = PassThroughSlot.prototype;

    _proto18.renderFallbackContent = function renderFallbackContent(view, nodes, projectionSource, index) {
      if (this.contentView === null) {
        this.contentView = this.fallbackFactory.create(this.ownerView.container);
        this.contentView.bind(this.ownerView.bindingContext, this.ownerView.overrideContext);
        var slots = Object.create(null);
        slots[this.destinationSlot.name] = this.destinationSlot;
        ShadowDOM.distributeView(this.contentView, slots, projectionSource, index, this.destinationSlot.name);
      }
    };

    _proto18.passThroughTo = function passThroughTo(destinationSlot) {
      this.destinationSlot = destinationSlot;
    };

    _proto18.addNode = function addNode(view, node, projectionSource, index) {
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
    };

    _proto18.removeView = function removeView(view, projectionSource) {
      this.projections--;
      this.destinationSlot.removeView(view, projectionSource);

      if (this.needsFallbackRendering) {
        this.renderFallbackContent(null, noNodes, projectionSource);
      }
    };

    _proto18.removeAll = function removeAll(projectionSource) {
      this.projections = 0;
      this.destinationSlot.removeAll(projectionSource);

      if (this.needsFallbackRendering) {
        this.renderFallbackContent(null, noNodes, projectionSource);
      }
    };

    _proto18.projectFrom = function projectFrom(view, projectionSource) {
      this.destinationSlot.projectFrom(view, projectionSource);
    };

    _proto18.created = function created(ownerView) {
      this.ownerView = ownerView;
    };

    _proto18.bind = function bind(view) {
      if (this.contentView) {
        this.contentView.bind(view.bindingContext, view.overrideContext);
      }
    };

    _proto18.attached = function attached() {
      if (this.contentView) {
        this.contentView.attached();
      }
    };

    _proto18.detached = function detached() {
      if (this.contentView) {
        this.contentView.detached();
      }
    };

    _proto18.unbind = function unbind() {
      if (this.contentView) {
        this.contentView.unbind();
      }
    };

    _createClass(PassThroughSlot, [{
      key: "needsFallbackRendering",
      get: function get() {
        return this.fallbackFactory && this.projections === 0;
      }
    }]);

    return PassThroughSlot;
  }();
  var ShadowSlot =
  /*#__PURE__*/
  function () {
    function ShadowSlot(anchor, name, fallbackFactory) {
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

    var _proto19 = ShadowSlot.prototype;

    _proto19.addNode = function addNode(view, node, projectionSource, index, destination) {
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

        var anchor = this._findAnchor(view, node, projectionSource, index);

        var parent = anchor.parentNode;
        parent.insertBefore(node, anchor);
        this.children.push(node);
        this.projections++;
      }
    };

    _proto19.removeView = function removeView(view, projectionSource) {
      if (this.destinationSlots !== null) {
        ShadowDOM.undistributeView(view, this.destinationSlots, this);
      } else if (this.contentView && this.contentView.hasSlots) {
        ShadowDOM.undistributeView(view, this.contentView.slots, projectionSource);
      } else {
        var found = this.children.find(function (x) {
          return x.auSlotProjectFrom === projectionSource;
        });

        if (found) {
          var _children = found.auProjectionChildren;

          for (var i = 0, ii = _children.length; i < ii; ++i) {
            var _child = _children[i];

            if (_child.auOwnerView === view) {
              _children.splice(i, 1);

              view.fragment.appendChild(_child);
              i--;
              ii--;
              this.projections--;
            }
          }

          if (this.needsFallbackRendering) {
            this.renderFallbackContent(view, noNodes, projectionSource);
          }
        }
      }
    };

    _proto19.removeAll = function removeAll(projectionSource) {
      if (this.destinationSlots !== null) {
        ShadowDOM.undistributeAll(this.destinationSlots, this);
      } else if (this.contentView && this.contentView.hasSlots) {
        ShadowDOM.undistributeAll(this.contentView.slots, projectionSource);
      } else {
        var found = this.children.find(function (x) {
          return x.auSlotProjectFrom === projectionSource;
        });

        if (found) {
          var _children2 = found.auProjectionChildren;

          for (var i = 0, ii = _children2.length; i < ii; ++i) {
            var _child2 = _children2[i];

            _child2.auOwnerView.fragment.appendChild(_child2);

            this.projections--;
          }

          found.auProjectionChildren = [];

          if (this.needsFallbackRendering) {
            this.renderFallbackContent(null, noNodes, projectionSource);
          }
        }
      }
    };

    _proto19._findAnchor = function _findAnchor(view, node, projectionSource, index) {
      if (projectionSource) {
        var found = this.children.find(function (x) {
          return x.auSlotProjectFrom === projectionSource;
        });

        if (found) {
          if (index !== undefined) {
            var _children3 = found.auProjectionChildren;
            var viewIndex = -1;
            var lastView;

            for (var i = 0, ii = _children3.length; i < ii; ++i) {
              var current = _children3[i];

              if (current.auOwnerView !== lastView) {
                viewIndex++;
                lastView = current.auOwnerView;

                if (viewIndex >= index && lastView !== view) {
                  _children3.splice(i, 0, node);

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
    };

    _proto19.projectTo = function projectTo(slots) {
      this.destinationSlots = slots;
    };

    _proto19.projectFrom = function projectFrom(view, projectionSource) {
      var anchor = DOM.createComment('anchor');
      var parent = this.anchor.parentNode;
      anchor.auSlotProjectFrom = projectionSource;
      anchor.auOwnerView = view;
      anchor.auProjectionChildren = [];
      parent.insertBefore(anchor, this.anchor);
      this.children.push(anchor);

      if (this.projectFromAnchors === null) {
        this.projectFromAnchors = [];
      }

      this.projectFromAnchors.push(anchor);
    };

    _proto19.renderFallbackContent = function renderFallbackContent(view, nodes, projectionSource, index) {
      if (this.contentView === null) {
        this.contentView = this.fallbackFactory.create(this.ownerView.container);
        this.contentView.bind(this.ownerView.bindingContext, this.ownerView.overrideContext);
        this.contentView.insertNodesBefore(this.anchor);
      }

      if (this.contentView.hasSlots) {
        var slots = this.contentView.slots;
        var projectFromAnchors = this.projectFromAnchors;

        if (projectFromAnchors !== null) {
          for (var slotName in slots) {
            var slot = slots[slotName];

            for (var i = 0, ii = projectFromAnchors.length; i < ii; ++i) {
              var anchor = projectFromAnchors[i];
              slot.projectFrom(anchor.auOwnerView, anchor.auSlotProjectFrom);
            }
          }
        }

        this.fallbackSlots = slots;
        ShadowDOM.distributeNodes(view, nodes, slots, projectionSource, index);
      }
    };

    _proto19.created = function created(ownerView) {
      this.ownerView = ownerView;
    };

    _proto19.bind = function bind(view) {
      if (this.contentView) {
        this.contentView.bind(view.bindingContext, view.overrideContext);
      }
    };

    _proto19.attached = function attached() {
      if (this.contentView) {
        this.contentView.attached();
      }
    };

    _proto19.detached = function detached() {
      if (this.contentView) {
        this.contentView.detached();
      }
    };

    _proto19.unbind = function unbind() {
      if (this.contentView) {
        this.contentView.unbind();
      }
    };

    _createClass(ShadowSlot, [{
      key: "needsFallbackRendering",
      get: function get() {
        return this.fallbackFactory && this.projections === 0;
      }
    }]);

    return ShadowSlot;
  }();
  var ShadowDOM = (_temp3 = _class9$1 =
  /*#__PURE__*/
  function () {
    function ShadowDOM() {}

    ShadowDOM.getSlotName = function getSlotName(node) {
      if (node.auSlotAttribute === undefined) {
        return ShadowDOM.defaultSlotKey;
      }

      return node.auSlotAttribute.value;
    };

    ShadowDOM.distributeView = function distributeView(view, slots, projectionSource, index, destinationOverride) {
      var nodes;

      if (view === null) {
        nodes = noNodes;
      } else {
        var childNodes = view.fragment.childNodes;
        var ii = childNodes.length;
        nodes = new Array(ii);

        for (var i = 0; i < ii; ++i) {
          nodes[i] = childNodes[i];
        }
      }

      ShadowDOM.distributeNodes(view, nodes, slots, projectionSource, index, destinationOverride);
    };

    ShadowDOM.undistributeView = function undistributeView(view, slots, projectionSource) {
      for (var slotName in slots) {
        slots[slotName].removeView(view, projectionSource);
      }
    };

    ShadowDOM.undistributeAll = function undistributeAll(slots, projectionSource) {
      for (var slotName in slots) {
        slots[slotName].removeAll(projectionSource);
      }
    };

    ShadowDOM.distributeNodes = function distributeNodes(view, nodes, slots, projectionSource, index, destinationOverride) {
      for (var i = 0, ii = nodes.length; i < ii; ++i) {
        var currentNode = nodes[i];
        var nodeType = currentNode.nodeType;

        if (currentNode.isContentProjectionSource) {
          currentNode.viewSlot.projectTo(slots);

          for (var slotName in slots) {
            slots[slotName].projectFrom(view, currentNode.viewSlot);
          }

          nodes.splice(i, 1);
          ii--;
          i--;
        } else if (nodeType === 1 || nodeType === 3 || currentNode.viewSlot instanceof PassThroughSlot) {
          if (nodeType === 3 && _isAllWhitespace(currentNode)) {
            nodes.splice(i, 1);
            ii--;
            i--;
          } else {
            var found = slots[destinationOverride || ShadowDOM.getSlotName(currentNode)];

            if (found) {
              found.addNode(view, currentNode, projectionSource, index);
              nodes.splice(i, 1);
              ii--;
              i--;
            }
          }
        } else {
          nodes.splice(i, 1);
          ii--;
          i--;
        }
      }

      for (var _slotName in slots) {
        var slot = slots[_slotName];

        if (slot.needsFallbackRendering) {
          slot.renderFallbackContent(view, nodes, projectionSource, index);
        }
      }
    };

    return ShadowDOM;
  }(), _class9$1.defaultSlotKey = '__au-default-slot-key__', _temp3);

  function register(lookup, name, resource, type) {
    if (!name) {
      return;
    }

    var existing = lookup[name];

    if (existing) {
      if (existing !== resource) {
        throw new Error("Attempted to register " + type + " when one with the same name already exists. Name: " + name + ".");
      }

      return;
    }

    lookup[name] = resource;
  }

  function validateBehaviorName(name, type) {
    if (/[A-Z]/.test(name)) {
      var newName = _hyphenate(name);

      getLogger('templating').warn("'" + name + "' is not a valid " + type + " name and has been converted to '" + newName + "'. Upper-case letters are not allowed because the DOM is not case-sensitive.");
      return newName;
    }

    return name;
  }
  var conventionMark = '__au_resource__';
  var ViewResources =
  /*#__PURE__*/
  function () {
    ViewResources.convention = function convention(target, existing) {
      var resource;

      if (existing && conventionMark in existing) {
        return existing;
      }

      if ('$resource' in target) {
        var config = target.$resource;

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
            config = {
              name: config
            };
          }

          config = Object.assign({}, config);
          var resourceType = config.type || 'element';
          var name = config.name;

          switch (resourceType) {
            case 'element':
            case 'attribute':
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
          var bindables = typeof config === 'string' ? undefined : config.bindables;
          var currentProps = resource.properties;

          if (Array.isArray(bindables)) {
            for (var i = 0, ii = bindables.length; ii > i; ++i) {
              var prop = bindables[i];

              if (!prop || typeof prop !== 'string' && !prop.name) {
                throw new Error("Invalid bindable property at \"" + i + "\" for class \"" + target.name + "\". Expected either a string or an object with \"name\" property.");
              }

              var newProp = new BindableProperty(prop);
              var existed = false;

              for (var j = 0, jj = currentProps.length; jj > j; ++j) {
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
    };

    function ViewResources(parent, viewUrl) {
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

    var _proto20 = ViewResources.prototype;

    _proto20._tryAddHook = function _tryAddHook(obj, name) {
      if (typeof obj[name] === 'function') {
        var func = obj[name].bind(obj);
        var counter = 1;
        var callbackName;

        while (this[callbackName = name + counter.toString()] !== undefined) {
          counter++;
        }

        this[name] = true;
        this[callbackName] = func;
      }
    };

    _proto20._invokeHook = function _invokeHook(name, one, two, three, four) {
      if (this.hasParent) {
        this.parent._invokeHook(name, one, two, three, four);
      }

      if (this[name]) {
        this[name + '1'](one, two, three, four);
        var callbackName = name + '2';

        if (this[callbackName]) {
          this[callbackName](one, two, three, four);
          callbackName = name + '3';

          if (this[callbackName]) {
            this[callbackName](one, two, three, four);
            var counter = 4;

            while (this[callbackName = name + counter.toString()] !== undefined) {
              this[callbackName](one, two, three, four);
              counter++;
            }
          }
        }
      }
    };

    _proto20.registerViewEngineHooks = function registerViewEngineHooks(hooks) {
      this._tryAddHook(hooks, 'beforeCompile');

      this._tryAddHook(hooks, 'afterCompile');

      this._tryAddHook(hooks, 'beforeCreate');

      this._tryAddHook(hooks, 'afterCreate');

      this._tryAddHook(hooks, 'beforeBind');

      this._tryAddHook(hooks, 'beforeUnbind');
    };

    _proto20.getBindingLanguage = function getBindingLanguage(bindingLanguageFallback) {
      return this.bindingLanguage || (this.bindingLanguage = bindingLanguageFallback);
    };

    _proto20.patchInParent = function patchInParent(newParent) {
      var originalParent = this.parent;
      this.parent = newParent || null;
      this.hasParent = this.parent !== null;

      if (newParent.parent === null) {
        newParent.parent = originalParent;
        newParent.hasParent = originalParent !== null;
      }
    };

    _proto20.relativeToView = function relativeToView(path) {
      return relativeToFile(path, this.viewUrl);
    };

    _proto20.registerElement = function registerElement(tagName, behavior) {
      register(this.elements, tagName, behavior, 'an Element');
    };

    _proto20.getElement = function getElement(tagName) {
      return this.elements[tagName] || (this.hasParent ? this.parent.getElement(tagName) : null);
    };

    _proto20.mapAttribute = function mapAttribute(attribute) {
      return this.attributeMap[attribute] || (this.hasParent ? this.parent.mapAttribute(attribute) : null);
    };

    _proto20.registerAttribute = function registerAttribute(attribute, behavior, knownAttribute) {
      this.attributeMap[attribute] = knownAttribute;
      register(this.attributes, attribute, behavior, 'an Attribute');
    };

    _proto20.getAttribute = function getAttribute(attribute) {
      return this.attributes[attribute] || (this.hasParent ? this.parent.getAttribute(attribute) : null);
    };

    _proto20.registerValueConverter = function registerValueConverter(name, valueConverter) {
      register(this.valueConverters, name, valueConverter, 'a ValueConverter');
    };

    _proto20.getValueConverter = function getValueConverter(name) {
      return this.valueConverters[name] || (this.hasParent ? this.parent.getValueConverter(name) : null);
    };

    _proto20.registerBindingBehavior = function registerBindingBehavior(name, bindingBehavior) {
      register(this.bindingBehaviors, name, bindingBehavior, 'a BindingBehavior');
    };

    _proto20.getBindingBehavior = function getBindingBehavior(name) {
      return this.bindingBehaviors[name] || (this.hasParent ? this.parent.getBindingBehavior(name) : null);
    };

    _proto20.registerValue = function registerValue(name, value) {
      register(this.values, name, value, 'a value');
    };

    _proto20.getValue = function getValue(name) {
      return this.values[name] || (this.hasParent ? this.parent.getValue(name) : null);
    };

    _proto20.autoRegister = function autoRegister(container, impl) {
      var resourceTypeMeta = metadata.getOwn(metadata.resource, impl);

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
    };

    return ViewResources;
  }();
  var View =
  /*#__PURE__*/
  function () {
    function View(container, viewFactory, fragment, controllers, bindings, children, slots) {
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

      for (var key in slots) {
        this.hasSlots = true;
        break;
      }
    }

    var _proto21 = View.prototype;

    _proto21.returnToCache = function returnToCache() {
      this.viewFactory.returnViewToCache(this);
    };

    _proto21.created = function created() {
      var i;
      var ii;
      var controllers = this.controllers;

      for (i = 0, ii = controllers.length; i < ii; ++i) {
        controllers[i].created(this);
      }
    };

    _proto21.bind = function bind(bindingContext, overrideContext, _systemUpdate) {
      var controllers;
      var bindings;
      var children;
      var i;
      var ii;

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
    };

    _proto21.addBinding = function addBinding(binding) {
      this.bindings.push(binding);

      if (this.isBound) {
        binding.bind(this);
      }
    };

    _proto21.unbind = function unbind() {
      var controllers;
      var bindings;
      var children;
      var i;
      var ii;

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
    };

    _proto21.insertNodesBefore = function insertNodesBefore(refNode) {
      refNode.parentNode.insertBefore(this.fragment, refNode);
    };

    _proto21.appendNodesTo = function appendNodesTo(parent) {
      parent.appendChild(this.fragment);
    };

    _proto21.removeNodes = function removeNodes() {
      var fragment = this.fragment;
      var current = this.firstChild;
      var end = this.lastChild;
      var next;

      while (current) {
        next = current.nextSibling;
        fragment.appendChild(current);

        if (current === end) {
          break;
        }

        current = next;
      }
    };

    _proto21.attached = function attached() {
      var controllers;
      var children;
      var i;
      var ii;

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
    };

    _proto21.detached = function detached() {
      var controllers;
      var children;
      var i;
      var ii;

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
    };

    return View;
  }();

  function getAnimatableElement(view) {
    if (view.animatableElement !== undefined) {
      return view.animatableElement;
    }

    var current = view.firstChild;

    while (current && current.nodeType !== 1) {
      current = current.nextSibling;
    }

    if (current && current.nodeType === 1) {
      return view.animatableElement = current.classList.contains('au-animate') ? current : null;
    }

    return view.animatableElement = null;
  }

  var ViewSlot =
  /*#__PURE__*/
  function () {
    function ViewSlot(anchor, anchorIsContainer, animator) {
      if (animator === void 0) {
        animator = Animator.instance;
      }

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

    var _proto22 = ViewSlot.prototype;

    _proto22.animateView = function animateView(view, direction) {
      if (direction === void 0) {
        direction = 'enter';
      }

      var animatableElement = getAnimatableElement(view);

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
    };

    _proto22.transformChildNodesIntoView = function transformChildNodesIntoView() {
      var parent = this.anchor;
      this.children.push({
        fragment: parent,
        firstChild: parent.firstChild,
        lastChild: parent.lastChild,
        returnToCache: function returnToCache() {},
        removeNodes: function removeNodes() {
          var last;

          while (last = parent.lastChild) {
            parent.removeChild(last);
          }
        },
        created: function created() {},
        bind: function bind() {},
        unbind: function unbind() {},
        attached: function attached() {},
        detached: function detached() {}
      });
    };

    _proto22.bind = function bind(bindingContext, overrideContext) {
      var i;
      var ii;
      var children;

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
    };

    _proto22.unbind = function unbind() {
      if (this.isBound) {
        var i;
        var ii;
        var _children4 = this.children;
        this.isBound = false;
        this.bindingContext = null;
        this.overrideContext = null;

        for (i = 0, ii = _children4.length; i < ii; ++i) {
          _children4[i].unbind();
        }
      }
    };

    _proto22.add = function add(view) {
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
    };

    _proto22.insert = function insert(index, view) {
      var children = this.children;
      var length = children.length;

      if (index === 0 && length === 0 || index >= length) {
        return this.add(view);
      }

      view.insertNodesBefore(children[index].firstChild);
      children.splice(index, 0, view);

      if (this.isAttached) {
        view.attached();
        return this.animateView(view, 'enter');
      }
    };

    _proto22.move = function move(sourceIndex, targetIndex) {
      if (sourceIndex === targetIndex) {
        return;
      }

      var children = this.children;
      var view = children[sourceIndex];
      view.removeNodes();
      view.insertNodesBefore(children[targetIndex].firstChild);
      children.splice(sourceIndex, 1);
      children.splice(targetIndex, 0, view);
    };

    _proto22.remove = function remove(view, returnToCache, skipAnimation) {
      return this.removeAt(this.children.indexOf(view), returnToCache, skipAnimation);
    };

    _proto22.removeMany = function removeMany(viewsToRemove, returnToCache, skipAnimation) {
      var _this3 = this;

      var children = this.children;
      var ii = viewsToRemove.length;
      var i;
      var rmPromises = [];
      viewsToRemove.forEach(function (child) {
        if (skipAnimation) {
          child.removeNodes();
          return;
        }

        var animation = _this3.animateView(child, 'leave');

        if (animation) {
          rmPromises.push(animation.then(function () {
            return child.removeNodes();
          }));
        } else {
          child.removeNodes();
        }
      });

      var removeAction = function removeAction() {
        if (_this3.isAttached) {
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
          var index = children.indexOf(viewsToRemove[i]);

          if (index >= 0) {
            children.splice(index, 1);
          }
        }
      };

      if (rmPromises.length > 0) {
        return Promise.all(rmPromises).then(function () {
          return removeAction();
        });
      }

      return removeAction();
    };

    _proto22.removeAt = function removeAt(index, returnToCache, skipAnimation) {
      var _this4 = this;

      var view = this.children[index];

      var removeAction = function removeAction() {
        index = _this4.children.indexOf(view);
        view.removeNodes();

        _this4.children.splice(index, 1);

        if (_this4.isAttached) {
          view.detached();
        }

        if (returnToCache) {
          view.returnToCache();
        }

        return view;
      };

      if (!skipAnimation) {
        var animation = this.animateView(view, 'leave');

        if (animation) {
          return animation.then(function () {
            return removeAction();
          });
        }
      }

      return removeAction();
    };

    _proto22.removeAll = function removeAll(returnToCache, skipAnimation) {
      var _this5 = this;

      var children = this.children;
      var ii = children.length;
      var i;
      var rmPromises = [];
      children.forEach(function (child) {
        if (skipAnimation) {
          child.removeNodes();
          return;
        }

        var animation = _this5.animateView(child, 'leave');

        if (animation) {
          rmPromises.push(animation.then(function () {
            return child.removeNodes();
          }));
        } else {
          child.removeNodes();
        }
      });

      var removeAction = function removeAction() {
        if (_this5.isAttached) {
          for (i = 0; i < ii; ++i) {
            children[i].detached();
          }
        }

        if (returnToCache) {
          for (i = 0; i < ii; ++i) {
            var _child3 = children[i];

            if (_child3) {
              _child3.returnToCache();
            }
          }
        }

        _this5.children = [];
      };

      if (rmPromises.length > 0) {
        return Promise.all(rmPromises).then(function () {
          return removeAction();
        });
      }

      return removeAction();
    };

    _proto22.attached = function attached() {
      var i;
      var ii;
      var children;
      var child;

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
    };

    _proto22.detached = function detached() {
      var i;
      var ii;
      var children;

      if (this.isAttached) {
        this.isAttached = false;
        children = this.children;

        for (i = 0, ii = children.length; i < ii; ++i) {
          children[i].detached();
        }
      }
    };

    _proto22.projectTo = function projectTo(slots) {
      var _this6 = this;

      this.projectToSlots = slots;
      this.add = this._projectionAdd;
      this.insert = this._projectionInsert;
      this.move = this._projectionMove;
      this.remove = this._projectionRemove;
      this.removeAt = this._projectionRemoveAt;
      this.removeMany = this._projectionRemoveMany;
      this.removeAll = this._projectionRemoveAll;
      this.children.forEach(function (view) {
        return ShadowDOM.distributeView(view, slots, _this6);
      });
    };

    _proto22._projectionAdd = function _projectionAdd(view) {
      ShadowDOM.distributeView(view, this.projectToSlots, this);
      this.children.push(view);

      if (this.isAttached) {
        view.attached();
      }
    };

    _proto22._projectionInsert = function _projectionInsert(index, view) {
      if (index === 0 && !this.children.length || index >= this.children.length) {
        this.add(view);
      } else {
        ShadowDOM.distributeView(view, this.projectToSlots, this, index);
        this.children.splice(index, 0, view);

        if (this.isAttached) {
          view.attached();
        }
      }
    };

    _proto22._projectionMove = function _projectionMove(sourceIndex, targetIndex) {
      if (sourceIndex === targetIndex) {
        return;
      }

      var children = this.children;
      var view = children[sourceIndex];
      ShadowDOM.undistributeView(view, this.projectToSlots, this);
      ShadowDOM.distributeView(view, this.projectToSlots, this, targetIndex);
      children.splice(sourceIndex, 1);
      children.splice(targetIndex, 0, view);
    };

    _proto22._projectionRemove = function _projectionRemove(view, returnToCache) {
      ShadowDOM.undistributeView(view, this.projectToSlots, this);
      this.children.splice(this.children.indexOf(view), 1);

      if (this.isAttached) {
        view.detached();
      }

      if (returnToCache) {
        view.returnToCache();
      }
    };

    _proto22._projectionRemoveAt = function _projectionRemoveAt(index, returnToCache) {
      var view = this.children[index];
      ShadowDOM.undistributeView(view, this.projectToSlots, this);
      this.children.splice(index, 1);

      if (this.isAttached) {
        view.detached();
      }

      if (returnToCache) {
        view.returnToCache();
      }
    };

    _proto22._projectionRemoveMany = function _projectionRemoveMany(viewsToRemove, returnToCache) {
      var _this7 = this;

      viewsToRemove.forEach(function (view) {
        return _this7.remove(view, returnToCache);
      });
    };

    _proto22._projectionRemoveAll = function _projectionRemoveAll(returnToCache) {
      ShadowDOM.undistributeAll(this.projectToSlots, this);
      var children = this.children;
      var ii = children.length;

      for (var i = 0; i < ii; ++i) {
        if (returnToCache) {
          children[i].returnToCache();
        } else if (this.isAttached) {
          children[i].detached();
        }
      }

      this.children = [];
    };

    return ViewSlot;
  }();

  var ProviderResolver = resolver(_class11$1 =
  /*#__PURE__*/
  function () {
    function ProviderResolver() {}

    var _proto23 = ProviderResolver.prototype;

    _proto23.get = function get(container, key) {
      var id = key.__providerId__;
      return id in container ? container[id] : container[id] = container.invoke(key);
    };

    return ProviderResolver;
  }()) || _class11$1;

  var providerResolverInstance = new ProviderResolver();

  function elementContainerGet(key) {
    if (key === DOM.Element) {
      return this.element;
    }

    if (key === BoundViewFactory) {
      if (this.boundViewFactory) {
        return this.boundViewFactory;
      }

      var factory = this.instruction.viewFactory;
      var partReplacements = this.partReplacements;

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
    var container = parent.createChild();
    var providers;
    var i;
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
    var anchor = DOM.createComment('anchor');

    if (elementInstruction) {
      var firstChild = element.firstChild;

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
    var behaviorInstructions = instruction.behaviorInstructions;
    var expressions = instruction.expressions;
    var elementContainer;
    var i;
    var ii;
    var current;
    var instance;

    if (instruction.contentExpression) {
      bindings.push(instruction.contentExpression.createBinding(element.nextSibling));
      element.nextSibling.auInterpolationTarget = true;
      element.parentNode.removeChild(element);
      return;
    }

    if (instruction.shadowSlot) {
      var commentAnchor = DOM.createComment('slot');
      var slot;

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
    var attributes = style.split(';');
    var firstIndexOfColon;
    var i;
    var current;
    var key;
    var value;
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
    var result = '';

    for (var key in obj) {
      result += key + ':' + obj[key] + ';';
    }

    return result;
  }

  function applySurrogateInstruction(container, element, instruction, controllers, bindings, children) {
    var behaviorInstructions = instruction.behaviorInstructions;
    var expressions = instruction.expressions;
    var providers = instruction.providers;
    var values = instruction.values;
    var i;
    var ii;
    var current;
    var instance;
    var currentAttributeValue;
    i = providers.length;

    while (i--) {
      container._resolvers.set(providers[i], providerResolverInstance);
    }

    for (var key in values) {
      currentAttributeValue = element.getAttribute(key);

      if (currentAttributeValue) {
        if (key === 'class') {
          element.setAttribute('class', currentAttributeValue + ' ' + values[key]);
        } else if (key === 'style') {
          var styleObject = styleStringToObject(values[key]);
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

  var BoundViewFactory =
  /*#__PURE__*/
  function () {
    function BoundViewFactory(parentContainer, viewFactory, partReplacements) {
      this.parentContainer = parentContainer;
      this.viewFactory = viewFactory;
      this.factoryCreateInstruction = {
        partReplacements: partReplacements
      };
    }

    var _proto24 = BoundViewFactory.prototype;

    _proto24.create = function create() {
      var view = this.viewFactory.create(this.parentContainer.createChild(), this.factoryCreateInstruction);
      view._isUserControlled = true;
      return view;
    };

    _proto24.setCacheSize = function setCacheSize(size, doNotOverrideIfAlreadySet) {
      this.viewFactory.setCacheSize(size, doNotOverrideIfAlreadySet);
    };

    _proto24.getCachedView = function getCachedView() {
      return this.viewFactory.getCachedView();
    };

    _proto24.returnViewToCache = function returnViewToCache(view) {
      this.viewFactory.returnViewToCache(view);
    };

    _createClass(BoundViewFactory, [{
      key: "isCaching",
      get: function get() {
        return this.viewFactory.isCaching;
      }
    }]);

    return BoundViewFactory;
  }();
  var ViewFactory =
  /*#__PURE__*/
  function () {
    function ViewFactory(template, instructions, resources) {
      this.isCaching = false;
      this.template = template;
      this.instructions = instructions;
      this.resources = resources;
      this.cacheSize = -1;
      this.cache = null;
    }

    var _proto25 = ViewFactory.prototype;

    _proto25.setCacheSize = function setCacheSize(size, doNotOverrideIfAlreadySet) {
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
    };

    _proto25.getCachedView = function getCachedView() {
      return this.cache !== null ? this.cache.pop() || null : null;
    };

    _proto25.returnViewToCache = function returnViewToCache(view) {
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
    };

    _proto25.create = function create(container, createInstruction, element) {
      createInstruction = createInstruction || BehaviorInstruction.normal;
      var cachedView = this.getCachedView();

      if (cachedView !== null) {
        return cachedView;
      }

      var fragment = createInstruction.enhance ? this.template : this.template.cloneNode(true);
      var instructables = fragment.querySelectorAll('.au-target');
      var instructions = this.instructions;
      var resources = this.resources;
      var controllers = [];
      var bindings = [];
      var children = [];
      var shadowSlots = Object.create(null);
      var containers = {
        root: container
      };
      var partReplacements = createInstruction.partReplacements;
      var i;
      var ii;
      var view;
      var instructable;
      var instruction;

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
    };

    return ViewFactory;
  }();
  var nextInjectorId = 0;

  function getNextInjectorId() {
    return ++nextInjectorId;
  }

  var lastAUTargetID = 0;

  function getNextAUTargetID() {
    return (++lastAUTargetID).toString();
  }

  function makeIntoInstructionTarget(element) {
    var value = element.getAttribute('class');
    var auTargetID = getNextAUTargetID();
    element.setAttribute('class', value ? value + ' au-target' : 'au-target');
    element.setAttribute('au-target-id', auTargetID);
    return auTargetID;
  }

  function makeShadowSlot(compiler, resources, node, instructions, parentInjectorId) {
    var auShadowSlot = DOM.createElement('au-shadow-slot');
    DOM.replaceNode(auShadowSlot, node);
    var auTargetID = makeIntoInstructionTarget(auShadowSlot);
    var instruction = TargetInstruction.shadowSlot(parentInjectorId);
    instruction.slotName = node.getAttribute('name') || ShadowDOM.defaultSlotKey;
    instruction.slotDestination = node.getAttribute('slot');

    if (node.innerHTML.trim()) {
      var fragment = DOM.createDocumentFragment();

      var _child4;

      while (_child4 = node.firstChild) {
        fragment.appendChild(_child4);
      }

      instruction.slotFallbackFactory = compiler.compile(fragment, resources);
    }

    instructions[auTargetID] = instruction;
    return auShadowSlot;
  }

  var defaultLetHandler = BindingLanguage.prototype.createLetExpressions;
  var ViewCompiler = (_dec7$2 = inject(BindingLanguage, ViewResources), _dec7$2(_class13$1 =
  /*#__PURE__*/
  function () {
    function ViewCompiler(bindingLanguage, resources) {
      this.bindingLanguage = bindingLanguage;
      this.resources = resources;
    }

    var _proto26 = ViewCompiler.prototype;

    _proto26.compile = function compile(source, resources, compileInstruction) {
      resources = resources || this.resources;
      compileInstruction = compileInstruction || ViewCompileInstruction.normal;
      source = typeof source === 'string' ? DOM.createTemplateFromMarkup(source) : source;
      var content;
      var part;
      var cacheSize;

      if (source.content) {
        part = source.getAttribute('part');
        cacheSize = source.getAttribute('view-cache');
        content = DOM.adoptNode(source.content);
      } else {
        content = source;
      }

      compileInstruction.targetShadowDOM = compileInstruction.targetShadowDOM && FEATURE.shadowDOM;

      resources._invokeHook('beforeCompile', content, resources, compileInstruction);

      var instructions = {};

      this._compileNode(content, resources, instructions, source, 'root', !compileInstruction.targetShadowDOM);

      var firstChild = content.firstChild;

      if (firstChild && firstChild.nodeType === 1) {
        var targetId = firstChild.getAttribute('au-target-id');

        if (targetId) {
          var ins = instructions[targetId];

          if (ins.shadowSlot || ins.lifting || ins.elementInstruction && !ins.elementInstruction.anchorIsContainer) {
            content.insertBefore(DOM.createComment('view'), firstChild);
          }
        }
      }

      var factory = new ViewFactory(content, instructions, resources);
      factory.surrogateInstruction = compileInstruction.compileSurrogate ? this._compileSurrogate(source, resources) : null;
      factory.part = part;

      if (cacheSize) {
        factory.setCacheSize(cacheSize);
      }

      resources._invokeHook('afterCompile', factory);

      return factory;
    };

    _proto26._compileNode = function _compileNode(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM) {
      switch (node.nodeType) {
        case 1:
          return this._compileElement(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM);

        case 3:
          var expression = resources.getBindingLanguage(this.bindingLanguage).inspectTextContent(resources, node.wholeText);

          if (expression) {
            var marker = DOM.createElement('au-marker');
            var auTargetID = makeIntoInstructionTarget(marker);
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
          var currentChild = node.firstChild;

          while (currentChild) {
            currentChild = this._compileNode(currentChild, resources, instructions, node, parentInjectorId, targetLightDOM);
          }

          break;

        default:
          break;
      }

      return node.nextSibling;
    };

    _proto26._compileSurrogate = function _compileSurrogate(node, resources) {
      var tagName = node.tagName.toLowerCase();
      var attributes = node.attributes;
      var bindingLanguage = resources.getBindingLanguage(this.bindingLanguage);
      var knownAttribute;
      var property;
      var instruction;
      var i;
      var ii;
      var attr;
      var attrName;
      var attrValue;
      var info;
      var type;
      var expressions = [];
      var expression;
      var behaviorInstructions = [];
      var values = {};
      var hasValues = false;
      var providers = [];

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
                var primaryProperty = type.primaryProperty;
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
    };

    _proto26._compileElement = function _compileElement(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM) {
      var tagName = node.tagName.toLowerCase();
      var attributes = node.attributes;
      var expressions = [];
      var expression;
      var behaviorInstructions = [];
      var providers = [];
      var bindingLanguage = resources.getBindingLanguage(this.bindingLanguage);
      var liftingInstruction;
      var viewFactory;
      var type;
      var elementInstruction;
      var elementProperty;
      var i;
      var ii;
      var attr;
      var attrName;
      var attrValue;
      var originalAttrName;
      var instruction;
      var info;
      var property;
      var knownAttribute;
      var auTargetID;
      var injectorId;

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
                var primaryProperty = type.primaryProperty;
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
        var skipContentProcessing = false;

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

        var currentChild = node.firstChild;

        while (currentChild) {
          currentChild = this._compileNode(currentChild, resources, instructions, node, injectorId || parentInjectorId, targetLightDOM);
        }
      }

      return node.nextSibling;
    };

    _proto26._configureProperties = function _configureProperties(instruction, resources) {
      var type = instruction.type;
      var attrName = instruction.attrName;
      var attributes = instruction.attributes;
      var property;
      var key;
      var value;
      var knownAttribute = resources.mapAttribute(attrName);

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
    };

    return ViewCompiler;
  }()) || _class13$1);
  var ResourceModule =
  /*#__PURE__*/
  function () {
    function ResourceModule(moduleId) {
      this.id = moduleId;
      this.moduleInstance = null;
      this.mainResource = null;
      this.resources = null;
      this.viewStrategy = null;
      this.isInitialized = false;
      this.onLoaded = null;
      this.loadContext = null;
    }

    var _proto27 = ResourceModule.prototype;

    _proto27.initialize = function initialize(container) {
      var current = this.mainResource;
      var resources = this.resources;
      var vs = this.viewStrategy;

      if (this.isInitialized) {
        return;
      }

      this.isInitialized = true;

      if (current !== undefined) {
        current.metadata.viewStrategy = vs;
        current.initialize(container);
      }

      for (var i = 0, ii = resources.length; i < ii; ++i) {
        current = resources[i];
        current.metadata.viewStrategy = vs;
        current.initialize(container);
      }
    };

    _proto27.register = function register(registry, name) {
      var main = this.mainResource;
      var resources = this.resources;

      if (main !== undefined) {
        main.register(registry, name);
        name = null;
      }

      for (var i = 0, ii = resources.length; i < ii; ++i) {
        resources[i].register(registry, name);
        name = null;
      }
    };

    _proto27.load = function load(container, loadContext) {
      if (this.onLoaded !== null) {
        return this.loadContext === loadContext ? Promise.resolve() : this.onLoaded;
      }

      var main = this.mainResource;
      var resources = this.resources;
      var loads;

      if (main !== undefined) {
        loads = new Array(resources.length + 1);
        loads[0] = main.load(container, loadContext);

        for (var i = 0, ii = resources.length; i < ii; ++i) {
          loads[i + 1] = resources[i].load(container, loadContext);
        }
      } else {
        loads = new Array(resources.length);

        for (var _i2 = 0, _ii = resources.length; _i2 < _ii; ++_i2) {
          loads[_i2] = resources[_i2].load(container, loadContext);
        }
      }

      this.loadContext = loadContext;
      this.onLoaded = Promise.all(loads);
      return this.onLoaded;
    };

    return ResourceModule;
  }();
  var ResourceDescription =
  /*#__PURE__*/
  function () {
    function ResourceDescription(key, exportedValue, resourceTypeMeta) {
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

    var _proto28 = ResourceDescription.prototype;

    _proto28.initialize = function initialize(container) {
      this.metadata.initialize(container, this.value);
    };

    _proto28.register = function register(registry, name) {
      this.metadata.register(registry, name);
    };

    _proto28.load = function load(container, loadContext) {
      return this.metadata.load(container, this.value, loadContext);
    };

    return ResourceDescription;
  }();
  var ModuleAnalyzer =
  /*#__PURE__*/
  function () {
    function ModuleAnalyzer() {
      this.cache = Object.create(null);
    }

    var _proto29 = ModuleAnalyzer.prototype;

    _proto29.getAnalysis = function getAnalysis(moduleId) {
      return this.cache[moduleId];
    };

    _proto29.analyze = function analyze(moduleId, moduleInstance, mainResourceKey) {
      var mainResource;
      var fallbackValue;
      var fallbackKey;
      var resourceTypeMeta;
      var key;
      var exportedValue;
      var resources = [];
      var conventional;
      var vs;
      var resourceModule;
      resourceModule = this.cache[moduleId];

      if (resourceModule) {
        return resourceModule;
      }

      resourceModule = new ResourceModule(moduleId);
      this.cache[moduleId] = resourceModule;

      if (typeof moduleInstance === 'function') {
        moduleInstance = {
          'default': moduleInstance
        };
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
    };

    return ModuleAnalyzer;
  }();
  var logger$1 = getLogger('templating');

  function ensureRegistryEntry(loader, urlOrRegistryEntry) {
    if (urlOrRegistryEntry instanceof TemplateRegistryEntry) {
      return Promise.resolve(urlOrRegistryEntry);
    }

    return loader.loadTemplate(urlOrRegistryEntry);
  }

  var ProxyViewFactory =
  /*#__PURE__*/
  function () {
    function ProxyViewFactory(promise) {
      var _this8 = this;

      promise.then(function (x) {
        return _this8.viewFactory = x;
      });
    }

    var _proto30 = ProxyViewFactory.prototype;

    _proto30.create = function create(container, bindingContext, createInstruction, element) {
      return this.viewFactory.create(container, bindingContext, createInstruction, element);
    };

    _proto30.setCacheSize = function setCacheSize(size, doNotOverrideIfAlreadySet) {
      this.viewFactory.setCacheSize(size, doNotOverrideIfAlreadySet);
    };

    _proto30.getCachedView = function getCachedView() {
      return this.viewFactory.getCachedView();
    };

    _proto30.returnViewToCache = function returnViewToCache(view) {
      this.viewFactory.returnViewToCache(view);
    };

    _createClass(ProxyViewFactory, [{
      key: "isCaching",
      get: function get() {
        return this.viewFactory.isCaching;
      }
    }]);

    return ProxyViewFactory;
  }();

  var auSlotBehavior = null;
  var ViewEngine = (_dec8$1 = inject(Loader, Container, ViewCompiler, ModuleAnalyzer, ViewResources), _dec8$1(_class14 = (_temp4 = _class15 =
  /*#__PURE__*/
  function () {
    function ViewEngine(loader, container, viewCompiler, moduleAnalyzer, appResources) {
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

    var _proto31 = ViewEngine.prototype;

    _proto31.addResourcePlugin = function addResourcePlugin(extension, implementation) {
      var name = extension.replace('.', '') + '-resource-plugin';
      this._pluginMap[extension] = name;
      this.loader.addPlugin(name, implementation);
    };

    _proto31.loadViewFactory = function loadViewFactory(urlOrRegistryEntry, compileInstruction, loadContext, target) {
      var _this9 = this;

      loadContext = loadContext || new ResourceLoadContext();
      return ensureRegistryEntry(this.loader, urlOrRegistryEntry).then(function (registryEntry) {
        var url = registryEntry.address;

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
        registryEntry.onReady = _this9.loadTemplateResources(registryEntry, compileInstruction, loadContext, target).then(function (resources) {
          registryEntry.resources = resources;

          if (registryEntry.template === null) {
            return registryEntry.factory = null;
          }

          var viewFactory = _this9.viewCompiler.compile(registryEntry.template, resources, compileInstruction);

          return registryEntry.factory = viewFactory;
        });
        return registryEntry.onReady;
      });
    };

    _proto31.loadTemplateResources = function loadTemplateResources(registryEntry, compileInstruction, loadContext, target) {
      var resources = new ViewResources(this.appResources, registryEntry.address);
      var dependencies = registryEntry.dependencies;
      var importIds;
      var names;
      compileInstruction = compileInstruction || ViewCompileInstruction.normal;

      if (dependencies.length === 0 && !compileInstruction.associatedModuleId) {
        return Promise.resolve(resources);
      }

      importIds = dependencies.map(function (x) {
        return x.src;
      });
      names = dependencies.map(function (x) {
        return x.name;
      });
      logger$1.debug("importing resources for " + registryEntry.address, importIds);

      if (target) {
        var viewModelRequires = metadata.get(ViewEngine.viewModelRequireMetadataKey, target);

        if (viewModelRequires) {
          var templateImportCount = importIds.length;

          for (var i = 0, ii = viewModelRequires.length; i < ii; ++i) {
            var req = viewModelRequires[i];
            var importId = typeof req === 'function' ? Origin.get(req).moduleId : relativeToFile(req.src || req, registryEntry.address);

            if (importIds.indexOf(importId) === -1) {
              importIds.push(importId);
              names.push(req.as);
            }
          }

          logger$1.debug("importing ViewModel resources for " + compileInstruction.associatedModuleId, importIds.slice(templateImportCount));
        }
      }

      return this.importViewResources(importIds, names, resources, compileInstruction, loadContext);
    };

    _proto31.importViewModelResource = function importViewModelResource(moduleImport, moduleMember) {
      var _this10 = this;

      return this.loader.loadModule(moduleImport).then(function (viewModelModule) {
        var normalizedId = Origin.get(viewModelModule).moduleId;

        var resourceModule = _this10.moduleAnalyzer.analyze(normalizedId, viewModelModule, moduleMember);

        if (!resourceModule.mainResource) {
          throw new Error("No view model found in module \"" + moduleImport + "\".");
        }

        resourceModule.initialize(_this10.container);
        return resourceModule.mainResource;
      });
    };

    _proto31.importViewResources = function importViewResources(moduleIds, names, resources, compileInstruction, loadContext) {
      var _this11 = this;

      loadContext = loadContext || new ResourceLoadContext();
      compileInstruction = compileInstruction || ViewCompileInstruction.normal;
      moduleIds = moduleIds.map(function (x) {
        return _this11._applyLoaderPlugin(x);
      });
      return this.loader.loadAllModules(moduleIds).then(function (imports) {
        var i;
        var ii;
        var analysis;
        var normalizedId;
        var current;
        var associatedModule;
        var container = _this11.container;
        var moduleAnalyzer = _this11.moduleAnalyzer;
        var allAnalysis = new Array(imports.length);

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

        return Promise.all(allAnalysis).then(function () {
          return resources;
        });
      });
    };

    _proto31._applyLoaderPlugin = function _applyLoaderPlugin(id) {
      var index = id.lastIndexOf('.');

      if (index !== -1) {
        var ext = id.substring(index);
        var pluginName = this._pluginMap[ext];

        if (pluginName === undefined) {
          return id;
        }

        return this.loader.applyPluginToUrl(id, pluginName);
      }

      return id;
    };

    return ViewEngine;
  }(), _class15.viewModelRequireMetadataKey = 'aurelia:view-model-require', _temp4)) || _class14);
  var Controller =
  /*#__PURE__*/
  function () {
    function Controller(behavior, instruction, viewModel, container) {
      this.behavior = behavior;
      this.instruction = instruction;
      this.viewModel = viewModel;
      this.isAttached = false;
      this.view = null;
      this.isBound = false;
      this.scope = null;
      this.container = container;
      this.elementEvents = container.elementEvents || null;
      var observerLookup = behavior.observerLocator.getOrCreateObserversLookup(viewModel);
      var handlesBind = behavior.handlesBind;
      var attributes = instruction.attributes;
      var boundProperties = this.boundProperties = [];
      var properties = behavior.properties;
      var i;
      var ii;

      behavior._ensurePropertiesDefined(viewModel, observerLookup);

      for (i = 0, ii = properties.length; i < ii; ++i) {
        properties[i]._initialize(viewModel, observerLookup, attributes, handlesBind, boundProperties);
      }
    }

    var _proto32 = Controller.prototype;

    _proto32.created = function created(owningView) {
      if (this.behavior.handlesCreated) {
        this.viewModel.created(owningView, this.view);
      }
    };

    _proto32.automate = function automate(overrideContext, owningView) {
      this.view.bindingContext = this.viewModel;
      this.view.overrideContext = overrideContext || createOverrideContext(this.viewModel);
      this.view._isUserControlled = true;

      if (this.behavior.handlesCreated) {
        this.viewModel.created(owningView || null, this.view);
      }

      this.bind(this.view);
    };

    _proto32.bind = function bind(scope) {
      var skipSelfSubscriber = this.behavior.handlesBind;
      var boundProperties = this.boundProperties;
      var i;
      var ii;
      var x;
      var observer;
      var selfSubscriber;

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

      var overrideContext;

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
    };

    _proto32.unbind = function unbind() {
      if (this.isBound) {
        var _boundProperties = this.boundProperties;

        var _i3;

        var _ii2;

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

        for (_i3 = 0, _ii2 = _boundProperties.length; _i3 < _ii2; ++_i3) {
          _boundProperties[_i3].binding.unbind();
        }
      }
    };

    _proto32.attached = function attached() {
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
    };

    _proto32.detached = function detached() {
      if (this.isAttached) {
        this.isAttached = false;

        if (this.view !== null) {
          this.view.detached();
        }

        if (this.behavior.handlesDetached) {
          this.viewModel.detached();
        }
      }
    };

    return Controller;
  }();
  var BehaviorPropertyObserver = (_dec9$1 = subscriberCollection(), _dec9$1(_class16 =
  /*#__PURE__*/
  function () {
    function BehaviorPropertyObserver(taskQueue, obj, propertyName, selfSubscriber, initialValue) {
      this.taskQueue = taskQueue;
      this.obj = obj;
      this.propertyName = propertyName;
      this.notqueued = true;
      this.publishing = false;
      this.selfSubscriber = selfSubscriber;
      this.currentValue = this.oldValue = initialValue;
    }

    var _proto33 = BehaviorPropertyObserver.prototype;

    _proto33.getValue = function getValue() {
      return this.currentValue;
    };

    _proto33.setValue = function setValue(newValue) {
      var oldValue = this.currentValue;

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
    };

    _proto33.call = function call() {
      var oldValue = this.oldValue;
      var newValue = this.currentValue;
      this.notqueued = true;

      if (Object.is(newValue, oldValue)) {
        return;
      }

      if (this.selfSubscriber) {
        this.selfSubscriber(newValue, oldValue);
      }

      this.callSubscribers(newValue, oldValue);
      this.oldValue = newValue;
    };

    _proto33.subscribe = function subscribe(context, callable) {
      this.addSubscriber(context, callable);
    };

    _proto33.unsubscribe = function unsubscribe(context, callable) {
      this.removeSubscriber(context, callable);
    };

    return BehaviorPropertyObserver;
  }()) || _class16);

  function getObserver(instance, name) {
    var lookup = instance.__observers__;

    if (lookup === undefined) {
      var ctor = Object.getPrototypeOf(instance).constructor;

      var _behavior = metadata.get(metadata.resource, ctor);

      if (!_behavior.isInitialized) {
        _behavior.initialize(Container.instance || new Container(), instance.constructor);
      }

      lookup = _behavior.observerLocator.getOrCreateObserversLookup(instance);

      _behavior._ensurePropertiesDefined(instance, lookup);
    }

    return lookup[name];
  }

  var BindableProperty =
  /*#__PURE__*/
  function () {
    function BindableProperty(nameOrConfig) {
      if (typeof nameOrConfig === 'string') {
        this.name = nameOrConfig;
      } else {
        Object.assign(this, nameOrConfig);
      }

      this.attribute = this.attribute || _hyphenate(this.name);
      var defaultBindingMode = this.defaultBindingMode;

      if (defaultBindingMode === null || defaultBindingMode === undefined) {
        this.defaultBindingMode = bindingMode.oneWay;
      } else if (typeof defaultBindingMode === 'string') {
        this.defaultBindingMode = bindingMode[defaultBindingMode] || bindingMode.oneWay;
      }

      this.changeHandler = this.changeHandler || null;
      this.owner = null;
      this.descriptor = null;
    }

    var _proto34 = BindableProperty.prototype;

    _proto34.registerWith = function registerWith(target, behavior, descriptor) {
      behavior.properties.push(this);
      behavior.attributes[this.attribute] = this;
      this.owner = behavior;

      if (descriptor) {
        this.descriptor = descriptor;
        return this._configureDescriptor(descriptor);
      }

      return undefined;
    };

    _proto34._configureDescriptor = function _configureDescriptor(descriptor) {
      var name = this.name;
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
    };

    _proto34.defineOn = function defineOn(target, behavior) {
      var name = this.name;
      var handlerName;

      if (this.changeHandler === null) {
        handlerName = name + 'Changed';

        if (handlerName in target.prototype) {
          this.changeHandler = handlerName;
        }
      }

      if (this.descriptor === null) {
        Object.defineProperty(target.prototype, name, this._configureDescriptor(behavior, {}));
      }
    };

    _proto34.createObserver = function createObserver(viewModel) {
      var selfSubscriber = null;
      var defaultValue = this.defaultValue;
      var changeHandlerName = this.changeHandler;
      var name = this.name;
      var initialValue;

      if (this.hasOptions) {
        return undefined;
      }

      if (changeHandlerName in viewModel) {
        if ('propertyChanged' in viewModel) {
          selfSubscriber = function selfSubscriber(newValue, oldValue) {
            viewModel[changeHandlerName](newValue, oldValue);
            viewModel.propertyChanged(name, newValue, oldValue);
          };
        } else {
          selfSubscriber = function selfSubscriber(newValue, oldValue) {
            return viewModel[changeHandlerName](newValue, oldValue);
          };
        }
      } else if ('propertyChanged' in viewModel) {
        selfSubscriber = function selfSubscriber(newValue, oldValue) {
          return viewModel.propertyChanged(name, newValue, oldValue);
        };
      } else if (changeHandlerName !== null) {
        throw new Error("Change handler " + changeHandlerName + " was specified but not declared on the class.");
      }

      if (defaultValue !== undefined) {
        initialValue = typeof defaultValue === 'function' ? defaultValue.call(viewModel) : defaultValue;
      }

      return new BehaviorPropertyObserver(this.owner.taskQueue, viewModel, this.name, selfSubscriber, initialValue);
    };

    _proto34._initialize = function _initialize(viewModel, observerLookup, attributes, behaviorHandlesBind, boundProperties) {
      var selfSubscriber;
      var observer;
      var attribute;
      var defaultValue = this.defaultValue;

      if (this.isDynamic) {
        for (var key in attributes) {
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
            boundProperties.push({
              observer: observer,
              binding: attribute.createBinding(viewModel)
            });
          } else if (defaultValue !== undefined) {
            observer.call();
          }

          observer.selfSubscriber = selfSubscriber;
        }

        observer.publishing = true;
      }
    };

    _proto34._createDynamicProperty = function _createDynamicProperty(viewModel, observerLookup, behaviorHandlesBind, name, attribute, boundProperties) {
      var changeHandlerName = name + 'Changed';
      var selfSubscriber = null;
      var observer;
      var info;

      if (changeHandlerName in viewModel) {
        if ('propertyChanged' in viewModel) {
          selfSubscriber = function selfSubscriber(newValue, oldValue) {
            viewModel[changeHandlerName](newValue, oldValue);
            viewModel.propertyChanged(name, newValue, oldValue);
          };
        } else {
          selfSubscriber = function selfSubscriber(newValue, oldValue) {
            return viewModel[changeHandlerName](newValue, oldValue);
          };
        }
      } else if ('propertyChanged' in viewModel) {
        selfSubscriber = function selfSubscriber(newValue, oldValue) {
          return viewModel.propertyChanged(name, newValue, oldValue);
        };
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
        info = {
          observer: observer,
          binding: attribute.createBinding(viewModel)
        };
        boundProperties.push(info);
      }

      observer.publishing = true;
      observer.selfSubscriber = selfSubscriber;
    };

    return BindableProperty;
  }();
  var lastProviderId = 0;

  function nextProviderId() {
    return ++lastProviderId;
  }

  function doProcessContent() {
    return true;
  }

  function doProcessAttributes() {}

  var HtmlBehaviorResource =
  /*#__PURE__*/
  function () {
    function HtmlBehaviorResource() {
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

    HtmlBehaviorResource.convention = function convention(name, existing) {
      var behavior;

      if (name.endsWith('CustomAttribute')) {
        behavior = existing || new HtmlBehaviorResource();
        behavior.attributeName = _hyphenate(name.substring(0, name.length - 15));
      }

      if (name.endsWith('CustomElement')) {
        behavior = existing || new HtmlBehaviorResource();
        behavior.elementName = _hyphenate(name.substring(0, name.length - 13));
      }

      return behavior;
    };

    var _proto35 = HtmlBehaviorResource.prototype;

    _proto35.addChildBinding = function addChildBinding(behavior) {
      if (this.childBindings === null) {
        this.childBindings = [];
      }

      this.childBindings.push(behavior);
    };

    _proto35.initialize = function initialize(container, target) {
      var proto = target.prototype;
      var properties = this.properties;
      var attributeName = this.attributeName;
      var attributeDefaultBindingMode = this.attributeDefaultBindingMode;
      var i;
      var ii;
      var current;

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
    };

    _proto35.register = function register(registry, name) {
      var _this12 = this;

      if (this.attributeName !== null) {
        registry.registerAttribute(name || this.attributeName, this, this.attributeName);

        if (Array.isArray(this.aliases)) {
          this.aliases.forEach(function (alias) {
            registry.registerAttribute(alias, _this12, _this12.attributeName);
          });
        }
      }

      if (this.elementName !== null) {
        registry.registerElement(name || this.elementName, this);
      }
    };

    _proto35.load = function load(container, target, loadContext, viewStrategy, transientView) {
      var _this13 = this;

      var options;

      if (this.elementName !== null) {
        viewStrategy = container.get(ViewLocator).getViewStrategy(viewStrategy || this.viewStrategy || target);
        options = new ViewCompileInstruction(this.targetShadowDOM, true);

        if (!viewStrategy.moduleId) {
          viewStrategy.moduleId = Origin.get(target).moduleId;
        }

        return viewStrategy.loadViewFactory(container.get(ViewEngine), options, loadContext, target).then(function (viewFactory) {
          if (!transientView || !_this13.viewFactory) {
            _this13.viewFactory = viewFactory;
          }

          return viewFactory;
        });
      }

      return Promise.resolve(this);
    };

    _proto35.compile = function compile(compiler, resources, node, instruction, parentNode) {
      if (this.liftsContent) {
        if (!instruction.viewFactory) {
          var template = DOM.createElement('template');
          var fragment = DOM.createDocumentFragment();
          var cacheSize = node.getAttribute('view-cache');
          var part = node.getAttribute('part');
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
        var partReplacements = {};

        if (this.processContent(compiler, resources, node, instruction) && node.hasChildNodes()) {
          var currentChild = node.firstChild;
          var contentElement = this.usesShadowDOM ? null : DOM.createElement('au-content');
          var nextSibling;
          var toReplace;

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
    };

    _proto35.create = function create(container, instruction, element, bindings) {
      var viewHost;
      var au = null;
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

      var viewModel = instruction.viewModel || container.get(this.target);
      var controller = new Controller(this, instruction, viewModel, container);
      var childBindings = this.childBindings;
      var viewFactory;

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
              var contentElement = element.childNodes[0] || element.contentElement;
              controller.view.contentView = {
                fragment: contentElement
              };
              contentElement.parentNode && DOM.removeNode(contentElement);
            }

            if (instruction.anchorIsContainer) {
              if (childBindings !== null) {
                for (var _i4 = 0, _ii3 = childBindings.length; _i4 < _ii3; ++_i4) {
                  controller.view.addBinding(childBindings[_i4].create(element, viewModel, controller));
                }
              }

              controller.view.appendNodesTo(viewHost);
            } else {
              controller.view.insertNodesBefore(viewHost);
            }
          } else if (childBindings !== null) {
            for (var _i5 = 0, _ii4 = childBindings.length; _i5 < _ii4; ++_i5) {
              bindings.push(childBindings[_i5].create(element, viewModel, controller));
            }
          }
        } else if (controller.view) {
          controller.view.controller = controller;

          if (childBindings !== null) {
            for (var _i6 = 0, _ii5 = childBindings.length; _i6 < _ii5; ++_i6) {
              controller.view.addBinding(childBindings[_i6].create(instruction.host, viewModel, controller));
            }
          }
        } else if (childBindings !== null) {
          for (var _i7 = 0, _ii6 = childBindings.length; _i7 < _ii6; ++_i7) {
            bindings.push(childBindings[_i7].create(instruction.host, viewModel, controller));
          }
        }
      } else if (childBindings !== null) {
        for (var _i8 = 0, _ii7 = childBindings.length; _i8 < _ii7; ++_i8) {
          bindings.push(childBindings[_i8].create(element, viewModel, controller));
        }
      }

      if (au !== null) {
        au[this.htmlName] = controller;
      }

      if (instruction.initiatedByBehavior && viewFactory) {
        controller.view.created();
      }

      return controller;
    };

    _proto35._ensurePropertiesDefined = function _ensurePropertiesDefined(instance, lookup) {
      var properties;
      var i;
      var ii;
      var observer;

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
    };

    _proto35._copyInheritedProperties = function _copyInheritedProperties(container, target) {
      var _this14 = this;

      var behavior;
      var derived = target;

      while (true) {
        var proto = Object.getPrototypeOf(target.prototype);
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

      var _loop = function _loop(_i9, _ii8) {
        var prop = behavior.properties[_i9];

        if (_this14.properties.some(function (p) {
          return p.name === prop.name;
        })) {
          return "continue";
        }

        new BindableProperty(prop).registerWith(derived, _this14);
      };

      for (var _i9 = 0, _ii8 = behavior.properties.length; _i9 < _ii8; ++_i9) {
        var _ret = _loop(_i9);

        if (_ret === "continue") continue;
      }
    };

    return HtmlBehaviorResource;
  }();

  function createChildObserverDecorator(selectorOrConfig, all) {
    return function (target, key, descriptor) {
      var actualTarget = typeof key === 'string' ? target.constructor : target;
      var r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, actualTarget);

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

  var ChildObserver =
  /*#__PURE__*/
  function () {
    function ChildObserver(config) {
      this.name = config.name;
      this.changeHandler = config.changeHandler || this.name + 'Changed';
      this.selector = config.selector;
      this.all = config.all;
    }

    var _proto36 = ChildObserver.prototype;

    _proto36.create = function create(viewHost, viewModel, controller) {
      return new ChildObserverBinder(this.selector, viewHost, this.name, viewModel, controller, this.changeHandler, this.all);
    };

    return ChildObserver;
  }();

  var noMutations = [];

  function trackMutation(groupedMutations, binder, record) {
    var mutations = groupedMutations.get(binder);

    if (!mutations) {
      mutations = [];
      groupedMutations.set(binder, mutations);
    }

    mutations.push(record);
  }

  function onChildChange(mutations, observer) {
    var binders = observer.binders;
    var bindersLength = binders.length;
    var groupedMutations = new Map();

    for (var _i10 = 0, _ii9 = mutations.length; _i10 < _ii9; ++_i10) {
      var record = mutations[_i10];
      var added = record.addedNodes;
      var removed = record.removedNodes;

      for (var j = 0, jj = removed.length; j < jj; ++j) {
        var node = removed[j];

        if (node.nodeType === 1) {
          for (var k = 0; k < bindersLength; ++k) {
            var binder = binders[k];

            if (binder.onRemove(node)) {
              trackMutation(groupedMutations, binder, record);
            }
          }
        }
      }

      for (var _j = 0, _jj = added.length; _j < _jj; ++_j) {
        var _node = added[_j];

        if (_node.nodeType === 1) {
          for (var _k = 0; _k < bindersLength; ++_k) {
            var _binder = binders[_k];

            if (_binder.onAdd(_node)) {
              trackMutation(groupedMutations, _binder, record);
            }
          }
        }
      }
    }

    groupedMutations.forEach(function (value, key) {
      if (key.changeHandler !== null) {
        key.viewModel[key.changeHandler](value);
      }
    });
  }

  var ChildObserverBinder =
  /*#__PURE__*/
  function () {
    function ChildObserverBinder(selector, viewHost, property, viewModel, controller, changeHandler, all) {
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

    var _proto37 = ChildObserverBinder.prototype;

    _proto37.matches = function matches(element) {
      if (element.matches(this.selector)) {
        if (this.contentView === null) {
          return true;
        }

        var contentView = this.contentView;
        var assignedSlot = element.auAssignedSlot;

        if (assignedSlot && assignedSlot.projectFromAnchors) {
          var anchors = assignedSlot.projectFromAnchors;

          for (var _i11 = 0, _ii10 = anchors.length; _i11 < _ii10; ++_i11) {
            if (anchors[_i11].auOwnerView === contentView) {
              return true;
            }
          }

          return false;
        }

        return element.auOwnerView === contentView;
      }

      return false;
    };

    _proto37.bind = function bind(source) {
      var viewHost = this.viewHost;
      var viewModel = this.viewModel;
      var observer = viewHost.__childObserver__;

      if (!observer) {
        observer = viewHost.__childObserver__ = DOM.createMutationObserver(onChildChange);
        var options = {
          childList: true,
          subtree: !this.usesShadowDOM
        };
        observer.observe(viewHost, options);
        observer.binders = [];
      }

      observer.binders.push(this);

      if (this.usesShadowDOM) {
        var current = viewHost.firstElementChild;

        if (this.all) {
          var items = viewModel[this.property];

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
              var value = current.au && current.au.controller ? current.au.controller.viewModel : current;
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
    };

    _proto37.onRemove = function onRemove(element) {
      if (this.matches(element)) {
        var value = element.au && element.au.controller ? element.au.controller.viewModel : element;

        if (this.all) {
          var items = this.viewModel[this.property] || (this.viewModel[this.property] = []);
          var index = items.indexOf(value);

          if (index !== -1) {
            items.splice(index, 1);
          }

          return true;
        }

        return false;
      }

      return false;
    };

    _proto37.onAdd = function onAdd(element) {
      if (this.matches(element)) {
        var value = element.au && element.au.controller ? element.au.controller.viewModel : element;

        if (this.all) {
          var items = this.viewModel[this.property] || (this.viewModel[this.property] = []);

          if (this.selector === '*') {
            items.push(value);
            return true;
          }

          var index = 0;
          var prev = element.previousElementSibling;

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
    };

    _proto37.unbind = function unbind() {
      if (this.viewHost.__childObserver__) {
        this.viewHost.__childObserver__.disconnect();

        this.viewHost.__childObserver__ = null;
        this.viewModel[this.property] = null;
      }
    };

    return ChildObserverBinder;
  }();

  function remove(viewSlot, previous) {
    return Array.isArray(previous) ? viewSlot.removeMany(previous, true) : viewSlot.remove(previous, true);
  }

  var SwapStrategies = {
    before: function before(viewSlot, previous, callback) {
      return previous === undefined ? callback() : callback().then(function () {
        return remove(viewSlot, previous);
      });
    },
    "with": function _with(viewSlot, previous, callback) {
      return previous === undefined ? callback() : Promise.all([remove(viewSlot, previous), callback()]);
    },
    after: function after(viewSlot, previous, callback) {
      return Promise.resolve(viewSlot.removeAll(true)).then(callback);
    }
  };

  function tryActivateViewModel(context) {
    if (context.skipActivation || typeof context.viewModel.activate !== 'function') {
      return Promise.resolve();
    }

    return context.viewModel.activate(context.model) || Promise.resolve();
  }

  var CompositionEngine = (_dec10$1 = inject(ViewEngine, ViewLocator), _dec10$1(_class17 =
  /*#__PURE__*/
  function () {
    function CompositionEngine(viewEngine, viewLocator) {
      this.viewEngine = viewEngine;
      this.viewLocator = viewLocator;
    }

    var _proto38 = CompositionEngine.prototype;

    _proto38._swap = function _swap(context, view) {
      var swapStrategy = SwapStrategies[context.swapOrder] || SwapStrategies.after;
      var previousViews = context.viewSlot.children.slice();
      return swapStrategy(context.viewSlot, previousViews, function () {
        return Promise.resolve(context.viewSlot.add(view)).then(function () {
          if (context.currentController) {
            context.currentController.unbind();
          }
        });
      }).then(function () {
        if (context.compositionTransactionNotifier) {
          context.compositionTransactionNotifier.done();
        }
      });
    };

    _proto38._createControllerAndSwap = function _createControllerAndSwap(context) {
      var _this15 = this;

      return this.createController(context).then(function (controller) {
        if (context.compositionTransactionOwnershipToken) {
          return context.compositionTransactionOwnershipToken.waitForCompositionComplete().then(function () {
            controller.automate(context.overrideContext, context.owningView);
            return _this15._swap(context, controller.view);
          }).then(function () {
            return controller;
          });
        }

        controller.automate(context.overrideContext, context.owningView);
        return _this15._swap(context, controller.view).then(function () {
          return controller;
        });
      });
    };

    _proto38.createController = function createController(context) {
      var _this16 = this;

      var childContainer;
      var viewModel;
      var viewModelResource;
      var m;
      return this.ensureViewModel(context).then(tryActivateViewModel).then(function () {
        childContainer = context.childContainer;
        viewModel = context.viewModel;
        viewModelResource = context.viewModelResource;
        m = viewModelResource.metadata;

        var viewStrategy = _this16.viewLocator.getViewStrategy(context.view || viewModel);

        if (context.viewResources) {
          viewStrategy.makeRelativeTo(context.viewResources.viewUrl);
        }

        return m.load(childContainer, viewModelResource.value, null, viewStrategy, true);
      }).then(function (viewFactory) {
        return m.create(childContainer, BehaviorInstruction.dynamic(context.host, viewModel, viewFactory));
      });
    };

    _proto38.ensureViewModel = function ensureViewModel(context) {
      var childContainer = context.childContainer = context.childContainer || context.container.createChild();

      if (typeof context.viewModel === 'string') {
        context.viewModel = context.viewResources ? context.viewResources.relativeToView(context.viewModel) : context.viewModel;
        return this.viewEngine.importViewModelResource(context.viewModel).then(function (viewModelResource) {
          childContainer.autoRegister(viewModelResource.value);

          if (context.host) {
            childContainer.registerInstance(DOM.Element, context.host);
          }

          context.viewModel = childContainer.viewModel = childContainer.get(viewModelResource.value);
          context.viewModelResource = viewModelResource;
          return context;
        });
      }

      var ctor = context.viewModel.constructor;
      var isClass = typeof context.viewModel === 'function';

      if (isClass) {
        ctor = context.viewModel;
        childContainer.autoRegister(ctor);
      }

      var m = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, ctor);
      m.elementName = m.elementName || 'dynamic-element';
      m.initialize(isClass ? childContainer : context.container || childContainer, ctor);
      context.viewModelResource = {
        metadata: m,
        value: ctor
      };

      if (context.host) {
        childContainer.registerInstance(DOM.Element, context.host);
      }

      childContainer.viewModel = context.viewModel = isClass ? childContainer.get(ctor) : context.viewModel;
      return Promise.resolve(context);
    };

    _proto38.compose = function compose(context) {
      var _this17 = this;

      context.childContainer = context.childContainer || context.container.createChild();
      context.view = this.viewLocator.getViewStrategy(context.view);
      var transaction = context.childContainer.get(CompositionTransaction);
      var compositionTransactionOwnershipToken = transaction.tryCapture();

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

        return context.view.loadViewFactory(this.viewEngine, new ViewCompileInstruction()).then(function (viewFactory) {
          var result = viewFactory.create(context.childContainer);
          result.bind(context.bindingContext, context.overrideContext);

          if (context.compositionTransactionOwnershipToken) {
            return context.compositionTransactionOwnershipToken.waitForCompositionComplete().then(function () {
              return _this17._swap(context, result);
            }).then(function () {
              return result;
            });
          }

          return _this17._swap(context, result).then(function () {
            return result;
          });
        });
      } else if (context.viewSlot) {
        context.viewSlot.removeAll();

        if (context.compositionTransactionNotifier) {
          context.compositionTransactionNotifier.done();
        }

        return Promise.resolve(null);
      }

      return Promise.resolve(null);
    };

    return CompositionEngine;
  }()) || _class17);
  var ElementConfigResource =
  /*#__PURE__*/
  function () {
    function ElementConfigResource() {}

    var _proto39 = ElementConfigResource.prototype;

    _proto39.initialize = function initialize(container, target) {};

    _proto39.register = function register(registry, name) {};

    _proto39.load = function load(container, target) {
      var config = new target();
      var eventManager = container.get(EventManager);
      eventManager.registerElementConfig(config);
    };

    return ElementConfigResource;
  }();
  function resource(instanceOrConfig) {
    return function (target) {
      var isConfig = typeof instanceOrConfig === 'string' || Object.getPrototypeOf(instanceOrConfig) === Object.prototype;

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
        var r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, target);
        Object.assign(r, override);
      }
    };
  }
  function customElement(name) {
    return function (target) {
      var r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, target);
      r.elementName = validateBehaviorName(name, 'custom element');
    };
  }
  function customAttribute(name, defaultBindingMode, aliases) {
    return function (target) {
      var r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, target);
      r.attributeName = validateBehaviorName(name, 'custom attribute');
      r.attributeDefaultBindingMode = defaultBindingMode;
      r.aliases = aliases;
    };
  }
  function templateController(target) {
    var deco = function deco(t) {
      var r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, t);
      r.liftsContent = true;
    };

    return target ? deco(target) : deco;
  }
  function bindable(nameOrConfigOrTarget, key, descriptor) {
    var deco = function deco(target, key2, descriptor2) {
      var actualTarget = key2 ? target.constructor : target;
      var r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, actualTarget);
      var prop;

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
      var target = nameOrConfigOrTarget;
      nameOrConfigOrTarget = null;
      return deco(target, key, descriptor);
    }

    return deco;
  }
  function dynamicOptions(target) {
    var deco = function deco(t) {
      var r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, t);
      r.hasDynamicOptions = true;
    };

    return target ? deco(target) : deco;
  }
  var defaultShadowDOMOptions = {
    mode: 'open'
  };
  function useShadowDOM(targetOrOptions) {
    var options = typeof targetOrOptions === 'function' || !targetOrOptions ? defaultShadowDOMOptions : targetOrOptions;

    var deco = function deco(t) {
      var r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, t);
      r.targetShadowDOM = true;
      r.shadowDOMOptions = options;
    };

    return typeof targetOrOptions === 'function' ? deco(targetOrOptions) : deco;
  }
  function processAttributes(processor) {
    return function (t) {
      var r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, t);

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
      var r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, t);
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
    var deco = function deco(t) {
      var r = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, t);
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
    var target;
    var dependencies;

    if (typeof targetOrDependencies === 'function') {
      target = targetOrDependencies;
    } else {
      dependencies = targetOrDependencies;
      target = undefined;
    }

    var deco = function deco(t) {
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
    var deco = function deco(t) {
      metadata.define(metadata.resource, new ElementConfigResource(), t);
    };

    return target ? deco(target) : deco;
  }
  function viewResources() {
    for (var _len = arguments.length, resources = new Array(_len), _key = 0; _key < _len; _key++) {
      resources[_key] = arguments[_key];
    }

    return function (target) {
      metadata.define(ViewEngine.viewModelRequireMetadataKey, resources, target);
    };
  }
  var TemplatingEngine = (_dec11 = inject(Container, ModuleAnalyzer, ViewCompiler, CompositionEngine), _dec11(_class18 =
  /*#__PURE__*/
  function () {
    function TemplatingEngine(container, moduleAnalyzer, viewCompiler, compositionEngine) {
      this._container = container;
      this._moduleAnalyzer = moduleAnalyzer;
      this._viewCompiler = viewCompiler;
      this._compositionEngine = compositionEngine;
      container.registerInstance(Animator, Animator.instance = new Animator());
    }

    var _proto40 = TemplatingEngine.prototype;

    _proto40.configureAnimator = function configureAnimator(animator) {
      this._container.unregister(Animator);

      this._container.registerInstance(Animator, Animator.instance = animator);
    };

    _proto40.compose = function compose(context) {
      return this._compositionEngine.compose(context);
    };

    _proto40.enhance = function enhance(instruction) {
      if (instruction instanceof DOM.Element) {
        instruction = {
          element: instruction
        };
      }

      var compilerInstructions = {
        letExpressions: []
      };

      var resources = instruction.resources || this._container.get(ViewResources);

      this._viewCompiler._compileNode(instruction.element, resources, compilerInstructions, instruction.element.parentNode, 'root', true);

      var factory = new ViewFactory(instruction.element, compilerInstructions, resources);

      var container = instruction.container || this._container.createChild();

      var view = factory.create(container, BehaviorInstruction.enhance());
      view.bind(instruction.bindingContext || {}, instruction.overrideContext);
      view.firstChild = view.lastChild = view.fragment;
      view.fragment = DOM.createDocumentFragment();
      view.attached();
      return view;
    };

    return TemplatingEngine;
  }()) || _class18);

  function preventActionlessFormSubmit() {
    DOM.addEventListener('submit', function (evt) {
      var target = evt.target;
      var action = target.action;

      if (target.tagName.toLowerCase() === 'form' && !action) {
        evt.preventDefault();
      }
    });
  }

  var Aurelia =
  /*#__PURE__*/
  function () {
    function Aurelia(loader, container, resources) {
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

    var _proto = Aurelia.prototype;

    _proto.start = function start() {
      var _this = this;

      if (this._started) {
        return this._started;
      }

      this.logger.info('Aurelia Starting');
      return this._started = this.use.apply().then(function () {
        preventActionlessFormSubmit();

        if (!_this.container.hasResolver(BindingLanguage)) {
          var message = 'You must configure Aurelia with a BindingLanguage implementation.';

          _this.logger.error(message);

          throw new Error(message);
        }

        _this.logger.info('Aurelia Started');

        var evt = DOM.createCustomEvent('aurelia-started', {
          bubbles: true,
          cancelable: true
        });
        DOM.dispatchEvent(evt);
        return _this;
      });
    };

    _proto.enhance = function enhance(bindingContext, applicationHost) {
      var _this2 = this;

      if (bindingContext === void 0) {
        bindingContext = {};
      }

      if (applicationHost === void 0) {
        applicationHost = null;
      }

      this._configureHost(applicationHost || DOM.querySelectorAll('body')[0]);

      return new Promise(function (resolve) {
        var engine = _this2.container.get(TemplatingEngine);

        _this2.root = engine.enhance({
          container: _this2.container,
          element: _this2.host,
          resources: _this2.resources,
          bindingContext: bindingContext
        });

        _this2.root.attached();

        _this2._onAureliaComposed();

        resolve(_this2);
      });
    };

    _proto.setRoot = function setRoot(root, applicationHost) {
      var _this3 = this;

      if (root === void 0) {
        root = null;
      }

      if (applicationHost === void 0) {
        applicationHost = null;
      }

      var instruction = {};

      if (this.root && this.root.viewModel && this.root.viewModel.router) {
        this.root.viewModel.router.deactivate();
        this.root.viewModel.router.reset();
      }

      this._configureHost(applicationHost);

      var engine = this.container.get(TemplatingEngine);
      var transaction = this.container.get(CompositionTransaction);
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
      return engine.compose(instruction).then(function (r) {
        _this3.root = r;
        instruction.viewSlot.attached();

        _this3._onAureliaComposed();

        return _this3;
      });
    };

    _proto._configureHost = function _configureHost(applicationHost) {
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
    };

    _proto._onAureliaComposed = function _onAureliaComposed() {
      var evt = DOM.createCustomEvent('aurelia-composed', {
        bubbles: true,
        cancelable: true
      });
      setTimeout(function () {
        return DOM.dispatchEvent(evt);
      }, 1);
    };

    return Aurelia;
  }();
  var logger$2 = getLogger('aurelia');
  var extPattern = /\.[^/.]+$/;

  function runTasks(config, tasks) {
    var current;

    var next = function next() {
      current = tasks.shift();

      if (current) {
        return Promise.resolve(current(config)).then(next);
      }

      return Promise.resolve();
    };

    return next();
  }

  function loadPlugin(fwConfig, loader, info) {
    logger$2.debug("Loading plugin " + info.moduleId + ".");

    if (typeof info.moduleId === 'string') {
      fwConfig.resourcesRelativeTo = info.resourcesRelativeTo;
      var id = info.moduleId;

      if (info.resourcesRelativeTo.length > 1) {
        return loader.normalize(info.moduleId, info.resourcesRelativeTo[1]).then(function (normalizedId) {
          return _loadPlugin(normalizedId);
        });
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
      return loader.loadModule(moduleId).then(function (m) {
        if ('configure' in m) {
          if (fwConfig.configuredPlugins.indexOf(m.configure) !== -1) {
            return Promise.resolve();
          }

          return Promise.resolve(m.configure(fwConfig, info.config || {})).then(function () {
            fwConfig.configuredPlugins.push(m.configure);
            fwConfig.resourcesRelativeTo = null;
            logger$2.debug("Configured plugin " + info.moduleId + ".");
          });
        }

        fwConfig.resourcesRelativeTo = null;
        logger$2.debug("Loaded plugin " + info.moduleId + ".");
      });
    }
  }

  function loadResources(aurelia, resourcesToLoad, appResources) {
    if (Object.keys(resourcesToLoad).length === 0) {
      return Promise.resolve();
    }

    var viewEngine = aurelia.container.get(ViewEngine);
    return Promise.all(Object.keys(resourcesToLoad).map(function (n) {
      return _normalize(resourcesToLoad[n]);
    })).then(function (loads) {
      var names = [];
      var importIds = [];
      loads.forEach(function (l) {
        names.push(undefined);
        importIds.push(l.importId);
      });
      return viewEngine.importViewResources(importIds, names, appResources);
    });

    function _normalize(load) {
      var moduleId = load.moduleId;
      var ext = getExt(moduleId);

      if (isOtherResource(moduleId)) {
        moduleId = removeExt(moduleId);
      }

      return aurelia.loader.normalize(moduleId, load.relativeTo).then(function (normalized) {
        return {
          name: load.moduleId,
          importId: isOtherResource(load.moduleId) ? addOriginalExt(normalized, ext) : normalized
        };
      });
    }

    function isOtherResource(name) {
      var ext = getExt(name);
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
    var match = name.match(extPattern);

    if (match && match.length > 0) {
      return match[0].split('.')[1];
    }
  }

  function loadBehaviors(config) {
    return Promise.all(config.behaviorsToLoad.map(function (m) {
      return m.load(config.container, m.target);
    })).then(function () {
      config.behaviorsToLoad = null;
    });
  }

  function assertProcessed(plugins) {
    if (plugins.processed) {
      throw new Error('This config instance has already been applied. To load more plugins or global resources, create a new FrameworkConfiguration instance.');
    }
  }

  function invalidConfigMsg(cfg, type) {
    return "Invalid " + type + " [" + cfg + "], " + type + " must be specified as functions or relative module IDs.";
  }

  var FrameworkConfiguration =
  /*#__PURE__*/
  function () {
    function FrameworkConfiguration(aurelia) {
      var _this4 = this;

      this.aurelia = aurelia;
      this.container = aurelia.container;
      this.info = [];
      this.processed = false;
      this.preTasks = [];
      this.postTasks = [];
      this.behaviorsToLoad = [];
      this.configuredPlugins = [];
      this.resourcesToLoad = {};
      this.preTask(function () {
        return aurelia.loader.normalize('aurelia-bootstrapper').then(function (name) {
          return _this4.bootstrapperName = name;
        });
      });
      this.postTask(function () {
        return loadResources(aurelia, _this4.resourcesToLoad, aurelia.resources);
      });
    }

    var _proto2 = FrameworkConfiguration.prototype;

    _proto2.instance = function instance(type, _instance) {
      this.container.registerInstance(type, _instance);
      return this;
    };

    _proto2.singleton = function singleton(type, implementation) {
      this.container.registerSingleton(type, implementation);
      return this;
    };

    _proto2["transient"] = function transient(type, implementation) {
      this.container.registerTransient(type, implementation);
      return this;
    };

    _proto2.preTask = function preTask(task) {
      assertProcessed(this);
      this.preTasks.push(task);
      return this;
    };

    _proto2.postTask = function postTask(task) {
      assertProcessed(this);
      this.postTasks.push(task);
      return this;
    };

    _proto2.feature = function feature(plugin, config) {
      if (config === void 0) {
        config = {};
      }

      switch (typeof plugin) {
        case 'string':
          var hasIndex = /\/index$/i.test(plugin);
          var moduleId = hasIndex || getExt(plugin) ? plugin : plugin + '/index';
          var root = hasIndex ? plugin.substr(0, plugin.length - 6) : plugin;
          this.info.push({
            moduleId: moduleId,
            resourcesRelativeTo: [root, ''],
            config: config
          });
          break;

        case 'function':
          this.info.push({
            configure: plugin,
            config: config || {}
          });
          break;

        default:
          throw new Error(invalidConfigMsg(plugin, 'feature'));
      }

      return this;
    };

    _proto2.globalResources = function globalResources(resources) {
      var _this5 = this;

      assertProcessed(this);
      var toAdd = Array.isArray(resources) ? resources : arguments;
      var resource;
      var resourcesRelativeTo = this.resourcesRelativeTo || ['', ''];

      for (var i = 0, ii = toAdd.length; i < ii; ++i) {
        resource = toAdd[i];

        switch (typeof resource) {
          case 'string':
            var parent = resourcesRelativeTo[0];
            var grandParent = resourcesRelativeTo[1];
            var name = resource;

            if ((resource.startsWith('./') || resource.startsWith('../')) && parent !== '') {
              name = join(parent, resource);
            }

            this.resourcesToLoad[name] = {
              moduleId: name,
              relativeTo: grandParent
            };
            break;

          case 'function':
            var meta = this.aurelia.resources.autoRegister(this.container, resource);

            if (meta instanceof HtmlBehaviorResource && meta.elementName !== null) {
              if (this.behaviorsToLoad.push(meta) === 1) {
                this.postTask(function () {
                  return loadBehaviors(_this5);
                });
              }
            }

            break;

          default:
            throw new Error(invalidConfigMsg(resource, 'resource'));
        }
      }

      return this;
    };

    _proto2.globalName = function globalName(resourcePath, newName) {
      assertProcessed(this);
      this.resourcesToLoad[resourcePath] = {
        moduleId: newName,
        relativeTo: ''
      };
      return this;
    };

    _proto2.plugin = function plugin(_plugin, pluginConfig) {
      assertProcessed(this);
      var info;

      switch (typeof _plugin) {
        case 'string':
          info = {
            moduleId: _plugin,
            resourcesRelativeTo: [_plugin, ''],
            config: pluginConfig || {}
          };
          break;

        case 'function':
          info = {
            configure: _plugin,
            config: pluginConfig || {}
          };
          break;

        default:
          throw new Error(invalidConfigMsg(_plugin, 'plugin'));
      }

      this.info.push(info);
      return this;
    };

    _proto2._addNormalizedPlugin = function _addNormalizedPlugin(name, config) {
      var _this6 = this;

      var plugin = {
        moduleId: name,
        resourcesRelativeTo: [name, ''],
        config: config || {}
      };
      this.info.push(plugin);
      this.preTask(function () {
        var relativeTo = [name, _this6.bootstrapperName];
        plugin.moduleId = name;
        plugin.resourcesRelativeTo = relativeTo;
        return Promise.resolve();
      });
      return this;
    };

    _proto2.defaultBindingLanguage = function defaultBindingLanguage() {
      return this._addNormalizedPlugin('aurelia-templating-binding');
    };

    _proto2.router = function router() {
      return this._addNormalizedPlugin('aurelia-templating-router');
    };

    _proto2.history = function history() {
      return this._addNormalizedPlugin('aurelia-history-browser');
    };

    _proto2.defaultResources = function defaultResources() {
      return this._addNormalizedPlugin('aurelia-templating-resources');
    };

    _proto2.eventAggregator = function eventAggregator() {
      return this._addNormalizedPlugin('aurelia-event-aggregator');
    };

    _proto2.basicConfiguration = function basicConfiguration() {
      return this.defaultBindingLanguage().defaultResources().eventAggregator();
    };

    _proto2.standardConfiguration = function standardConfiguration() {
      return this.basicConfiguration().history().router();
    };

    _proto2.developmentLogging = function developmentLogging(level) {
      var _this7 = this;

      var logLevel$1 = level ? logLevel[level] : undefined;

      if (logLevel$1 === undefined) {
        logLevel$1 = logLevel.debug;
      }

      this.preTask(function () {
        return _this7.aurelia.loader.normalize('aurelia-logging-console', _this7.bootstrapperName).then(function (name) {
          return _this7.aurelia.loader.loadModule(name).then(function (m) {
            addAppender(new m.ConsoleAppender());
            setLevel(logLevel$1);
          });
        });
      });
      return this;
    };

    _proto2.apply = function apply() {
      var _this8 = this;

      if (this.processed) {
        return Promise.resolve();
      }

      return runTasks(this, this.preTasks).then(function () {
        var loader = _this8.aurelia.loader;
        var info = _this8.info;
        var current;

        var next = function next() {
          current = info.shift();

          if (current) {
            return loadPlugin(_this8, loader, current).then(next);
          }

          _this8.processed = true;
          _this8.configuredPlugins = null;
          return Promise.resolve();
        };

        return next().then(function () {
          return runTasks(_this8, _this8.postTasks);
        });
      });
    };

    return FrameworkConfiguration;
  }();
  var LogManager = TheLogManager;

  var _class$3, _temp$2, _dec$3, _class2$3, _dec2$3, _class3$3, _class4$2, _temp2$2, _class5$3, _temp3$1;
  var AttributeMap = (_temp$2 = _class$3 =
  /*#__PURE__*/
  function () {
    function AttributeMap(svg) {
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

    var _proto = AttributeMap.prototype;

    _proto.register = function register(elementName, attributeName, propertyName) {
      elementName = elementName.toLowerCase();
      attributeName = attributeName.toLowerCase();
      var element = this.elements[elementName] = this.elements[elementName] || Object.create(null);
      element[attributeName] = propertyName;
    };

    _proto.registerUniversal = function registerUniversal(attributeName, propertyName) {
      attributeName = attributeName.toLowerCase();
      this.allElements[attributeName] = propertyName;
    };

    _proto.map = function map(elementName, attributeName) {
      if (this.svg.isStandardSvgAttribute(elementName, attributeName)) {
        return attributeName;
      }

      elementName = elementName.toLowerCase();
      attributeName = attributeName.toLowerCase();
      var element = this.elements[elementName];

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
    };

    return AttributeMap;
  }(), _class$3.inject = [SVGAnalyzer], _temp$2);
  var InterpolationBindingExpression =
  /*#__PURE__*/
  function () {
    function InterpolationBindingExpression(observerLocator, targetProperty, parts, mode, lookupFunctions, attribute) {
      this.observerLocator = observerLocator;
      this.targetProperty = targetProperty;
      this.parts = parts;
      this.mode = mode;
      this.lookupFunctions = lookupFunctions;
      this.attribute = this.attrToRemove = attribute;
      this.discrete = false;
    }

    var _proto2 = InterpolationBindingExpression.prototype;

    _proto2.createBinding = function createBinding(target) {
      if (this.parts.length === 3) {
        return new ChildInterpolationBinding(target, this.observerLocator, this.parts[1], this.mode, this.lookupFunctions, this.targetProperty, this.parts[0], this.parts[2]);
      }

      return new InterpolationBinding(this.observerLocator, this.parts, target, this.targetProperty, this.mode, this.lookupFunctions);
    };

    return InterpolationBindingExpression;
  }();

  function validateTarget(target, propertyName) {
    if (propertyName === 'style') {
      getLogger('templating-binding').info('Internet Explorer does not support interpolation in "style" attributes.  Use the style attribute\'s alias, "css" instead.');
    } else if (target.parentElement && target.parentElement.nodeName === 'TEXTAREA' && propertyName === 'textContent') {
      throw new Error('Interpolation binding cannot be used in the content of a textarea element.  Use <textarea value.bind="expression"></textarea> instead.');
    }
  }

  var InterpolationBinding =
  /*#__PURE__*/
  function () {
    function InterpolationBinding(observerLocator, parts, target, targetProperty, mode, lookupFunctions) {
      validateTarget(target, targetProperty);
      this.observerLocator = observerLocator;
      this.parts = parts;
      this.target = target;
      this.targetProperty = targetProperty;
      this.targetAccessor = observerLocator.getAccessor(target, targetProperty);
      this.mode = mode;
      this.lookupFunctions = lookupFunctions;
    }

    var _proto3 = InterpolationBinding.prototype;

    _proto3.interpolate = function interpolate() {
      if (this.isBound) {
        var value = '';
        var parts = this.parts;

        for (var i = 0, ii = parts.length; i < ii; i++) {
          value += i % 2 === 0 ? parts[i] : this["childBinding" + i].value;
        }

        this.targetAccessor.setValue(value, this.target, this.targetProperty);
      }
    };

    _proto3.updateOneTimeBindings = function updateOneTimeBindings() {
      for (var i = 1, ii = this.parts.length; i < ii; i += 2) {
        var child = this["childBinding" + i];

        if (child.mode === bindingMode.oneTime) {
          child.call();
        }
      }
    };

    _proto3.bind = function bind(source) {
      if (this.isBound) {
        if (this.source === source) {
          return;
        }

        this.unbind();
      }

      this.source = source;
      var parts = this.parts;

      for (var i = 1, ii = parts.length; i < ii; i += 2) {
        var binding = new ChildInterpolationBinding(this, this.observerLocator, parts[i], this.mode, this.lookupFunctions);
        binding.bind(source);
        this["childBinding" + i] = binding;
      }

      this.isBound = true;
      this.interpolate();
    };

    _proto3.unbind = function unbind() {
      if (!this.isBound) {
        return;
      }

      this.isBound = false;
      this.source = null;
      var parts = this.parts;

      for (var i = 1, ii = parts.length; i < ii; i += 2) {
        var name = "childBinding" + i;
        this[name].unbind();
      }
    };

    return InterpolationBinding;
  }();
  var ChildInterpolationBinding = (_dec$3 = connectable(), _dec$3(_class2$3 =
  /*#__PURE__*/
  function () {
    function ChildInterpolationBinding(target, observerLocator, sourceExpression, mode, lookupFunctions, targetProperty, left, right) {
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

    var _proto4 = ChildInterpolationBinding.prototype;

    _proto4.updateTarget = function updateTarget(value) {
      value = value === null || value === undefined ? '' : value.toString();

      if (value !== this.value) {
        this.value = value;

        if (this.parent) {
          this.parent.interpolate();
        } else {
          this.targetAccessor.setValue(this.left + value + this.right, this.target, this.targetProperty);
        }
      }
    };

    _proto4.call = function call() {
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
    };

    _proto4.bind = function bind(source) {
      if (this.isBound) {
        if (this.source === source) {
          return;
        }

        this.unbind();
      }

      this.isBound = true;
      this.source = source;
      var sourceExpression = this.sourceExpression;

      if (sourceExpression.bind) {
        sourceExpression.bind(this, source, this.lookupFunctions);
      }

      this.rawValue = sourceExpression.evaluate(source, this.lookupFunctions);
      this.updateTarget(this.rawValue);

      if (this.mode === bindingMode.oneWay) {
        enqueueBindingConnect(this);
      }
    };

    _proto4.unbind = function unbind() {
      if (!this.isBound) {
        return;
      }

      this.isBound = false;
      var sourceExpression = this.sourceExpression;

      if (sourceExpression.unbind) {
        sourceExpression.unbind(this, this.source);
      }

      this.source = null;
      this.value = null;
      this.rawValue = null;
      this.unobserve(true);
    };

    _proto4.connect = function connect(evaluate) {
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
    };

    return ChildInterpolationBinding;
  }()) || _class2$3);
  var LetExpression =
  /*#__PURE__*/
  function () {
    function LetExpression(observerLocator, targetProperty, sourceExpression, lookupFunctions, toBindingContext) {
      this.observerLocator = observerLocator;
      this.sourceExpression = sourceExpression;
      this.targetProperty = targetProperty;
      this.lookupFunctions = lookupFunctions;
      this.toBindingContext = toBindingContext;
    }

    var _proto5 = LetExpression.prototype;

    _proto5.createBinding = function createBinding() {
      return new LetBinding(this.observerLocator, this.sourceExpression, this.targetProperty, this.lookupFunctions, this.toBindingContext);
    };

    return LetExpression;
  }();
  var LetBinding = (_dec2$3 = connectable(), _dec2$3(_class3$3 =
  /*#__PURE__*/
  function () {
    function LetBinding(observerLocator, sourceExpression, targetProperty, lookupFunctions, toBindingContext) {
      this.observerLocator = observerLocator;
      this.sourceExpression = sourceExpression;
      this.targetProperty = targetProperty;
      this.lookupFunctions = lookupFunctions;
      this.source = null;
      this.target = null;
      this.toBindingContext = toBindingContext;
    }

    var _proto6 = LetBinding.prototype;

    _proto6.updateTarget = function updateTarget() {
      var value = this.sourceExpression.evaluate(this.source, this.lookupFunctions);
      this.target[this.targetProperty] = value;
    };

    _proto6.call = function call(context) {
      if (!this.isBound) {
        return;
      }

      if (context === sourceContext) {
        this.updateTarget();
        return;
      }

      throw new Error("Unexpected call context " + context);
    };

    _proto6.bind = function bind(source) {
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
    };

    _proto6.unbind = function unbind() {
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
    };

    _proto6.connect = function connect() {
      if (!this.isBound) {
        return;
      }

      this.updateTarget();
      this.sourceExpression.connect(this, this.source);
    };

    return LetBinding;
  }()) || _class3$3);
  var LetInterpolationBindingExpression =
  /*#__PURE__*/
  function () {
    function LetInterpolationBindingExpression(observerLocator, targetProperty, parts, lookupFunctions, toBindingContext) {
      this.observerLocator = observerLocator;
      this.targetProperty = targetProperty;
      this.parts = parts;
      this.lookupFunctions = lookupFunctions;
      this.toBindingContext = toBindingContext;
    }

    var _proto7 = LetInterpolationBindingExpression.prototype;

    _proto7.createBinding = function createBinding() {
      return new LetInterpolationBinding(this.observerLocator, this.targetProperty, this.parts, this.lookupFunctions, this.toBindingContext);
    };

    return LetInterpolationBindingExpression;
  }();
  var LetInterpolationBinding =
  /*#__PURE__*/
  function () {
    function LetInterpolationBinding(observerLocator, targetProperty, parts, lookupFunctions, toBindingContext) {
      this.observerLocator = observerLocator;
      this.parts = parts;
      this.targetProperty = targetProperty;
      this.lookupFunctions = lookupFunctions;
      this.toBindingContext = toBindingContext;
      this.target = null;
    }

    var _proto8 = LetInterpolationBinding.prototype;

    _proto8.bind = function bind(source) {
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
    };

    _proto8.unbind = function unbind() {
      if (!this.isBound) {
        return;
      }

      this.isBound = false;
      this.source = null;
      this.target = null;
      this.interpolationBinding.unbind();
      this.interpolationBinding = null;
    };

    _proto8.createInterpolationBinding = function createInterpolationBinding() {
      if (this.parts.length === 3) {
        return new ChildInterpolationBinding(this.target, this.observerLocator, this.parts[1], bindingMode.oneWay, this.lookupFunctions, this.targetProperty, this.parts[0], this.parts[2]);
      }

      return new InterpolationBinding(this.observerLocator, this.parts, this.target, this.targetProperty, bindingMode.oneWay, this.lookupFunctions);
    };

    return LetInterpolationBinding;
  }();
  var SyntaxInterpreter = (_temp2$2 = _class4$2 =
  /*#__PURE__*/
  function () {
    function SyntaxInterpreter(parser, observerLocator, eventManager, attributeMap) {
      this.parser = parser;
      this.observerLocator = observerLocator;
      this.eventManager = eventManager;
      this.attributeMap = attributeMap;
    }

    var _proto9 = SyntaxInterpreter.prototype;

    _proto9.interpret = function interpret(resources, element, info, existingInstruction, context) {
      if (info.command in this) {
        return this[info.command](resources, element, info, existingInstruction, context);
      }

      return this.handleUnknownCommand(resources, element, info, existingInstruction, context);
    };

    _proto9.handleUnknownCommand = function handleUnknownCommand(resources, element, info, existingInstruction, context) {
      getLogger('templating-binding').warn('Unknown binding command.', info);
      return existingInstruction;
    };

    _proto9.determineDefaultBindingMode = function determineDefaultBindingMode(element, attrName, context) {
      var tagName = element.tagName.toLowerCase();

      if (tagName === 'input' && (attrName === 'value' || attrName === 'files') && element.type !== 'checkbox' && element.type !== 'radio' || tagName === 'input' && attrName === 'checked' && (element.type === 'checkbox' || element.type === 'radio') || (tagName === 'textarea' || tagName === 'select') && attrName === 'value' || (attrName === 'textcontent' || attrName === 'innerhtml') && element.contentEditable === 'true' || attrName === 'scrolltop' || attrName === 'scrollleft') {
        return bindingMode.twoWay;
      }

      if (context && attrName in context.attributes && context.attributes[attrName] && context.attributes[attrName].defaultBindingMode >= bindingMode.oneTime) {
        return context.attributes[attrName].defaultBindingMode;
      }

      return bindingMode.oneWay;
    };

    _proto9.bind = function bind(resources, element, info, existingInstruction, context) {
      var instruction = existingInstruction || BehaviorInstruction.attribute(info.attrName);
      instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, this.attributeMap.map(element.tagName, info.attrName), this.parser.parse(info.attrValue), info.defaultBindingMode === undefined || info.defaultBindingMode === null ? this.determineDefaultBindingMode(element, info.attrName, context) : info.defaultBindingMode, resources.lookupFunctions);
      return instruction;
    };

    _proto9.trigger = function trigger(resources, element, info) {
      return new ListenerExpression(this.eventManager, info.attrName, this.parser.parse(info.attrValue), delegationStrategy.none, true, resources.lookupFunctions);
    };

    _proto9.capture = function capture(resources, element, info) {
      return new ListenerExpression(this.eventManager, info.attrName, this.parser.parse(info.attrValue), delegationStrategy.capturing, true, resources.lookupFunctions);
    };

    _proto9.delegate = function delegate(resources, element, info) {
      return new ListenerExpression(this.eventManager, info.attrName, this.parser.parse(info.attrValue), delegationStrategy.bubbling, true, resources.lookupFunctions);
    };

    _proto9.call = function call(resources, element, info, existingInstruction) {
      var instruction = existingInstruction || BehaviorInstruction.attribute(info.attrName);
      instruction.attributes[info.attrName] = new CallExpression(this.observerLocator, info.attrName, this.parser.parse(info.attrValue), resources.lookupFunctions);
      return instruction;
    };

    _proto9.options = function options(resources, element, info, existingInstruction, context) {
      var instruction = existingInstruction || BehaviorInstruction.attribute(info.attrName);
      var attrValue = info.attrValue;
      var language = this.language;
      var name = null;
      var target = '';
      var current;
      var i;
      var ii;
      var inString = false;
      var inEscape = false;
      var foundName = false;

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
    };

    _proto9._getPrimaryPropertyName = function _getPrimaryPropertyName(resources, context) {
      var type = resources.getAttribute(context.attributeName);

      if (type && type.primaryProperty) {
        return type.primaryProperty.attribute;
      }

      return null;
    };

    _proto9['for'] = function _for(resources, element, info, existingInstruction) {
      var parts;
      var keyValue;
      var instruction;
      var attrValue;
      var isDestructuring;
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
    };

    _proto9['two-way'] = function twoWay(resources, element, info, existingInstruction) {
      var instruction = existingInstruction || BehaviorInstruction.attribute(info.attrName);
      instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, this.attributeMap.map(element.tagName, info.attrName), this.parser.parse(info.attrValue), bindingMode.twoWay, resources.lookupFunctions);
      return instruction;
    };

    _proto9['to-view'] = function toView(resources, element, info, existingInstruction) {
      var instruction = existingInstruction || BehaviorInstruction.attribute(info.attrName);
      instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, this.attributeMap.map(element.tagName, info.attrName), this.parser.parse(info.attrValue), bindingMode.toView, resources.lookupFunctions);
      return instruction;
    };

    _proto9['from-view'] = function fromView(resources, element, info, existingInstruction) {
      var instruction = existingInstruction || BehaviorInstruction.attribute(info.attrName);
      instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, this.attributeMap.map(element.tagName, info.attrName), this.parser.parse(info.attrValue), bindingMode.fromView, resources.lookupFunctions);
      return instruction;
    };

    _proto9['one-time'] = function oneTime(resources, element, info, existingInstruction) {
      var instruction = existingInstruction || BehaviorInstruction.attribute(info.attrName);
      instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, this.attributeMap.map(element.tagName, info.attrName), this.parser.parse(info.attrValue), bindingMode.oneTime, resources.lookupFunctions);
      return instruction;
    };

    return SyntaxInterpreter;
  }(), _class4$2.inject = [Parser, ObserverLocator, EventManager, AttributeMap], _temp2$2);
  SyntaxInterpreter.prototype['one-way'] = SyntaxInterpreter.prototype['to-view'];
  var info = {};
  var TemplatingBindingLanguage = (_temp3$1 = _class5$3 =
  /*#__PURE__*/
  function (_BindingLanguage) {
    _inheritsLoose(TemplatingBindingLanguage, _BindingLanguage);

    function TemplatingBindingLanguage(parser, observerLocator, syntaxInterpreter, attributeMap) {
      var _this;

      _this = _BindingLanguage.call(this) || this;
      _this.parser = parser;
      _this.observerLocator = observerLocator;
      _this.syntaxInterpreter = syntaxInterpreter;
      _this.emptyStringExpression = _this.parser.parse('\'\'');
      syntaxInterpreter.language = _assertThisInitialized(_this);
      _this.attributeMap = attributeMap;
      _this.toBindingContextAttr = 'to-binding-context';
      return _this;
    }

    var _proto10 = TemplatingBindingLanguage.prototype;

    _proto10.inspectAttribute = function inspectAttribute(resources, elementName, attrName, attrValue) {
      var parts = attrName.split('.');
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
        var interpolationParts = this.parseInterpolation(resources, attrValue);

        if (interpolationParts === null) {
          info.expression = null;
        } else {
          info.expression = new InterpolationBindingExpression(this.observerLocator, this.attributeMap.map(elementName, attrName), interpolationParts, bindingMode.oneWay, resources.lookupFunctions, attrName);
        }
      }

      return info;
    };

    _proto10.createAttributeInstruction = function createAttributeInstruction(resources, element, theInfo, existingInstruction, context) {
      var instruction;

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
    };

    _proto10.createLetExpressions = function createLetExpressions(resources, letElement) {
      var expressions = [];
      var attributes = letElement.attributes;
      var attr;
      var parts;
      var attrName;
      var attrValue;
      var command;
      var toBindingContextAttr = this.toBindingContextAttr;
      var toBindingContext = letElement.hasAttribute(toBindingContextAttr);

      for (var i = 0, ii = attributes.length; ii > i; ++i) {
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
            getLogger('templating-binding-language').warn("Detected invalid let command. Expected \"" + parts[0] + ".bind\", given \"" + attrName + "\"");
            continue;
          }

          expressions.push(new LetExpression(this.observerLocator, camelCase(parts[0]), this.parser.parse(attrValue), resources.lookupFunctions, toBindingContext));
        } else {
          attrName = camelCase(attrName);
          parts = this.parseInterpolation(resources, attrValue);

          if (parts === null) {
            getLogger('templating-binding-language').warn("Detected string literal in let bindings. Did you mean \"" + attrName + ".bind=" + attrValue + "\" or \"" + attrName + "=${" + attrValue + "}\" ?");
          }

          if (parts) {
            expressions.push(new LetInterpolationBindingExpression(this.observerLocator, attrName, parts, resources.lookupFunctions, toBindingContext));
          } else {
            expressions.push(new LetExpression(this.observerLocator, attrName, new LiteralString(attrValue), resources.lookupFunctions, toBindingContext));
          }
        }
      }

      return expressions;
    };

    _proto10.inspectTextContent = function inspectTextContent(resources, value) {
      var parts = this.parseInterpolation(resources, value);

      if (parts === null) {
        return null;
      }

      return new InterpolationBindingExpression(this.observerLocator, 'textContent', parts, bindingMode.oneWay, resources.lookupFunctions, 'textContent');
    };

    _proto10.parseInterpolation = function parseInterpolation(resources, value) {
      var i = value.indexOf('${', 0);
      var ii = value.length;

      var _char;

      var pos = 0;
      var open = 0;
      var quote = null;
      var interpolationStart;
      var parts;
      var partIndex = 0;

      while (i >= 0 && i < ii - 2) {
        open = 1;
        interpolationStart = i;
        i += 2;

        do {
          _char = value[i];
          i++;

          if (_char === "'" || _char === '"') {
            if (quote === null) {
              quote = _char;
            } else if (quote === _char) {
              quote = null;
            }

            continue;
          }

          if (_char === '\\') {
            i++;
            continue;
          }

          if (quote !== null) {
            continue;
          }

          if (_char === '{') {
            open++;
          } else if (_char === '}') {
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
    };

    return TemplatingBindingLanguage;
  }(BindingLanguage), _class5$3.inject = [Parser, ObserverLocator, SyntaxInterpreter, AttributeMap], _temp3$1);
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
  var Compose = (_dec$4 = customElement('compose'), _dec$4(_class$4 = noView(_class$4 = (_class2$4 =
  /*#__PURE__*/
  function () {
    Compose.inject = function inject() {
      return [DOM.Element, Container, CompositionEngine, ViewSlot, ViewResources, TaskQueue];
    };

    function Compose(element, container, compositionEngine, viewSlot, viewResources, taskQueue) {
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

    var _proto = Compose.prototype;

    _proto.created = function created(owningView) {
      this.owningView = owningView;
    };

    _proto.bind = function bind(bindingContext, overrideContext) {
      this.bindingContext = bindingContext;
      this.overrideContext = overrideContext;
      this.changes.view = this.view;
      this.changes.viewModel = this.viewModel;
      this.changes.model = this.model;

      if (!this.pendingTask) {
        processChanges(this);
      }
    };

    _proto.unbind = function unbind() {
      this.changes = Object.create(null);
      this.bindingContext = null;
      this.overrideContext = null;
      var returnToCache = true;
      var skipAnimation = true;
      this.viewSlot.removeAll(returnToCache, skipAnimation);
    };

    _proto.modelChanged = function modelChanged(newValue, oldValue) {
      this.changes.model = newValue;
      requestUpdate(this);
    };

    _proto.viewChanged = function viewChanged(newValue, oldValue) {
      this.changes.view = newValue;
      requestUpdate(this);
    };

    _proto.viewModelChanged = function viewModelChanged(newValue, oldValue) {
      this.changes.viewModel = newValue;
      requestUpdate(this);
    };

    return Compose;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2$4.prototype, 'model', [bindable], {
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
    for (var key in obj) {
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
    var changes = composer.changes;
    composer.changes = Object.create(null);

    if (!('view' in changes) && !('viewModel' in changes) && 'model' in changes) {
      composer.pendingTask = tryActivateViewModel$1(composer.currentViewModel, changes.model);

      if (!composer.pendingTask) {
        return;
      }
    } else {
      var instruction = {
        view: composer.view,
        viewModel: composer.currentViewModel || composer.viewModel,
        model: composer.model
      };
      instruction = Object.assign(instruction, changes);
      instruction = createInstruction(composer, instruction);
      composer.pendingTask = composer.compositionEngine.compose(instruction).then(function (controller) {
        composer.currentController = controller;
        composer.currentViewModel = controller ? controller.viewModel : null;
      });
    }

    composer.pendingTask = composer.pendingTask.then(function () {
      completeCompositionTask(composer);
    }, function (reason) {
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
    composer.taskQueue.queueMicroTask(function () {
      composer.updateRequested = false;
      processChanges(composer);
    });
  }

  var IfCore =
  /*#__PURE__*/
  function () {
    function IfCore(viewFactory, viewSlot) {
      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.view = null;
      this.bindingContext = null;
      this.overrideContext = null;
      this.showing = false;
    }

    var _proto = IfCore.prototype;

    _proto.bind = function bind(bindingContext, overrideContext) {
      this.bindingContext = bindingContext;
      this.overrideContext = overrideContext;
    };

    _proto.unbind = function unbind() {
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
    };

    _proto._show = function _show() {
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
    };

    _proto._hide = function _hide() {
      var _this = this;

      if (!this.showing) {
        return;
      }

      this.showing = false;
      var removed = this.viewSlot.remove(this.view);

      if (removed instanceof Promise) {
        return removed.then(function () {
          return _this.view.unbind();
        });
      }

      this.view.unbind();
    };

    return IfCore;
  }();

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
  var If = (_dec$5 = customAttribute('if'), _dec2$4 = inject(BoundViewFactory, ViewSlot), _dec3$3 = bindable({
    primaryProperty: true
  }), _dec$5(_class$5 = templateController(_class$5 = _dec2$4(_class$5 = (_class2$5 =
  /*#__PURE__*/
  function (_IfCore) {
    _inheritsLoose(If, _IfCore);

    function If() {
      var _this;

      var _temp;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _IfCore.call.apply(_IfCore, [this].concat(args)) || this, _initDefineProp$1(_assertThisInitialized(_this), 'condition', _descriptor$1, _assertThisInitialized(_this)), _initDefineProp$1(_assertThisInitialized(_this), 'swapOrder', _descriptor2$1, _assertThisInitialized(_this)), _temp) || _assertThisInitialized(_this);
    }

    var _proto = If.prototype;

    _proto.bind = function bind(bindingContext, overrideContext) {
      _IfCore.prototype.bind.call(this, bindingContext, overrideContext);

      if (this.condition) {
        this._show();
      } else {
        this._hide();
      }
    };

    _proto.conditionChanged = function conditionChanged(newValue) {
      this._update(newValue);
    };

    _proto._update = function _update(show) {
      var _this2 = this;

      if (this.animating) {
        return;
      }

      var promise;

      if (this.elseVm) {
        promise = show ? this._swap(this.elseVm, this) : this._swap(this, this.elseVm);
      } else {
        promise = show ? this._show() : this._hide();
      }

      if (promise) {
        this.animating = true;
        promise.then(function () {
          _this2.animating = false;

          if (_this2.condition !== _this2.showing) {
            _this2._update(_this2.condition);
          }
        });
      }
    };

    _proto._swap = function _swap(remove, add) {
      switch (this.swapOrder) {
        case 'before':
          return Promise.resolve(add._show()).then(function () {
            return remove._hide();
          });

        case 'with':
          return Promise.all([remove._hide(), add._show()]);

        default:
          var promise = remove._hide();

          return promise ? promise.then(function () {
            return add._show();
          }) : add._show();
      }
    };

    return If;
  }(IfCore), (_descriptor$1 = _applyDecoratedDescriptor$1(_class2$5.prototype, 'condition', [_dec3$3], {
    enumerable: true,
    initializer: null
  }), _descriptor2$1 = _applyDecoratedDescriptor$1(_class2$5.prototype, 'swapOrder', [bindable], {
    enumerable: true,
    initializer: null
  })), _class2$5)) || _class$5) || _class$5) || _class$5);

  var _dec$6, _dec2$5, _class$6;
  var Else = (_dec$6 = customAttribute('else'), _dec2$5 = inject(BoundViewFactory, ViewSlot), _dec$6(_class$6 = templateController(_class$6 = _dec2$5(_class$6 =
  /*#__PURE__*/
  function (_IfCore) {
    _inheritsLoose(Else, _IfCore);

    function Else(viewFactory, viewSlot) {
      var _this;

      _this = _IfCore.call(this, viewFactory, viewSlot) || this;

      _this._registerInIf();

      return _this;
    }

    var _proto = Else.prototype;

    _proto.bind = function bind(bindingContext, overrideContext) {
      _IfCore.prototype.bind.call(this, bindingContext, overrideContext);

      if (this.ifVm.condition) {
        this._hide();
      } else {
        this._show();
      }
    };

    _proto._registerInIf = function _registerInIf() {
      var previous = this.viewSlot.anchor.previousSibling;

      while (previous && !previous.au) {
        previous = previous.previousSibling;
      }

      if (!previous || !previous.au["if"]) {
        throw new Error("Can't find matching If for Else custom attribute.");
      }

      this.ifVm = previous.au["if"].viewModel;
      this.ifVm.elseVm = this;
    };

    return Else;
  }(IfCore)) || _class$6) || _class$6) || _class$6);

  var _dec$7, _dec2$6, _class$7;
  var With = (_dec$7 = customAttribute('with'), _dec2$6 = inject(BoundViewFactory, ViewSlot), _dec$7(_class$7 = templateController(_class$7 = _dec2$6(_class$7 =
  /*#__PURE__*/
  function () {
    function With(viewFactory, viewSlot) {
      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.parentOverrideContext = null;
      this.view = null;
    }

    var _proto = With.prototype;

    _proto.bind = function bind(bindingContext, overrideContext) {
      this.parentOverrideContext = overrideContext;
      this.valueChanged(this.value);
    };

    _proto.valueChanged = function valueChanged(newValue) {
      var overrideContext = createOverrideContext(newValue, this.parentOverrideContext);

      if (!this.view) {
        this.view = this.viewFactory.create();
        this.view.bind(newValue, overrideContext);
        this.viewSlot.add(this.view);
      } else {
        this.view.bind(newValue, overrideContext);
      }
    };

    _proto.unbind = function unbind() {
      this.parentOverrideContext = null;

      if (this.view) {
        this.view.unbind();
      }
    };

    return With;
  }()) || _class$7) || _class$7) || _class$7);

  var NullRepeatStrategy =
  /*#__PURE__*/
  function () {
    function NullRepeatStrategy() {}

    var _proto = NullRepeatStrategy.prototype;

    _proto.instanceChanged = function instanceChanged(repeat, items) {
      repeat.removeAllViews(true);
    };

    _proto.getCollectionObserver = function getCollectionObserver(observerLocator, items) {};

    return NullRepeatStrategy;
  }();

  var oneTime = bindingMode.oneTime;
  function updateOverrideContexts(views, startIndex) {
    var length = views.length;

    if (startIndex > 0) {
      startIndex = startIndex - 1;
    }

    for (; startIndex < length; ++startIndex) {
      updateOverrideContext(views[startIndex].overrideContext, startIndex, length);
    }
  }
  function createFullOverrideContext(repeat, data, index, length, key) {
    var bindingContext = {};
    var overrideContext = createOverrideContext(bindingContext, repeat.scope.overrideContext);

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
    var first = index === 0;
    var last = index === length - 1;
    var even = index % 2 === 0;
    overrideContext.$index = index;
    overrideContext.$first = first;
    overrideContext.$last = last;
    overrideContext.$middle = !(first || last);
    overrideContext.$odd = !even;
    overrideContext.$even = even;
  }
  function getItemsSourceExpression(instruction, attrName) {
    return instruction.behaviorInstructions.filter(function (bi) {
      return bi.originalAttrName === attrName;
    })[0].attributes.items.sourceExpression;
  }
  function unwrapExpression(expression) {
    var unwrapped = false;

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

    var length = array.length;

    for (var index = startIndex || 0; index < length; index++) {
      if (matcher(array[index], item)) {
        return index;
      }
    }

    return -1;
  }

  var ArrayRepeatStrategy =
  /*#__PURE__*/
  function () {
    function ArrayRepeatStrategy() {}

    var _proto = ArrayRepeatStrategy.prototype;

    _proto.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
      return observerLocator.getArrayObserver(items);
    };

    _proto.instanceChanged = function instanceChanged(repeat, items) {
      var _this = this;

      var itemsLength = items.length;

      if (!items || itemsLength === 0) {
        repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
        return;
      }

      var children = repeat.views();
      var viewsLength = children.length;

      if (viewsLength === 0) {
        this._standardProcessInstanceChanged(repeat, items);

        return;
      }

      if (repeat.viewsRequireLifecycle) {
        var childrenSnapshot = children.slice(0);
        var itemNameInBindingContext = repeat.local;
        var matcher = repeat.matcher();
        var itemsPreviouslyInViews = [];
        var viewsToRemove = [];

        for (var index = 0; index < viewsLength; index++) {
          var view = childrenSnapshot[index];
          var oldItem = view.bindingContext[itemNameInBindingContext];

          if (indexOf(items, oldItem, matcher) === -1) {
            viewsToRemove.push(view);
          } else {
            itemsPreviouslyInViews.push(oldItem);
          }
        }

        var updateViews;
        var removePromise;

        if (itemsPreviouslyInViews.length > 0) {
          removePromise = repeat.removeViews(viewsToRemove, true, !repeat.viewsRequireLifecycle);

          updateViews = function updateViews() {
            for (var _index = 0; _index < itemsLength; _index++) {
              var item = items[_index];
              var indexOfView = indexOf(itemsPreviouslyInViews, item, matcher, _index);

              var _view = void 0;

              if (indexOfView === -1) {
                var overrideContext = createFullOverrideContext(repeat, items[_index], _index, itemsLength);
                repeat.insertView(_index, overrideContext.bindingContext, overrideContext);
                itemsPreviouslyInViews.splice(_index, 0, undefined);
              } else if (indexOfView === _index) {
                _view = children[indexOfView];
                itemsPreviouslyInViews[indexOfView] = undefined;
              } else {
                _view = children[indexOfView];
                repeat.moveView(indexOfView, _index);
                itemsPreviouslyInViews.splice(indexOfView, 1);
                itemsPreviouslyInViews.splice(_index, 0, undefined);
              }

              if (_view) {
                updateOverrideContext(_view.overrideContext, _index, itemsLength);
              }
            }

            _this._inPlaceProcessItems(repeat, items);
          };
        } else {
          removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);

          updateViews = function updateViews() {
            return _this._standardProcessInstanceChanged(repeat, items);
          };
        }

        if (removePromise instanceof Promise) {
          removePromise.then(updateViews);
        } else {
          updateViews();
        }
      } else {
        this._inPlaceProcessItems(repeat, items);
      }
    };

    _proto._standardProcessInstanceChanged = function _standardProcessInstanceChanged(repeat, items) {
      for (var i = 0, ii = items.length; i < ii; i++) {
        var overrideContext = createFullOverrideContext(repeat, items[i], i, ii);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }
    };

    _proto._inPlaceProcessItems = function _inPlaceProcessItems(repeat, items) {
      var itemsLength = items.length;
      var viewsLength = repeat.viewCount();

      while (viewsLength > itemsLength) {
        viewsLength--;
        repeat.removeView(viewsLength, true, !repeat.viewsRequireLifecycle);
      }

      var local = repeat.local;

      for (var i = 0; i < viewsLength; i++) {
        var view = repeat.view(i);
        var last = i === itemsLength - 1;
        var middle = i !== 0 && !last;

        if (view.bindingContext[local] === items[i] && view.overrideContext.$middle === middle && view.overrideContext.$last === last) {
          continue;
        }

        view.bindingContext[local] = items[i];
        view.overrideContext.$middle = middle;
        view.overrideContext.$last = last;
        repeat.updateBindings(view);
      }

      for (var _i = viewsLength; _i < itemsLength; _i++) {
        var overrideContext = createFullOverrideContext(repeat, items[_i], _i, itemsLength);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }
    };

    _proto.instanceMutated = function instanceMutated(repeat, array, splices) {
      var _this2 = this;

      if (repeat.__queuedSplices) {
        for (var i = 0, ii = splices.length; i < ii; ++i) {
          var _splices$i = splices[i],
              index = _splices$i.index,
              removed = _splices$i.removed,
              addedCount = _splices$i.addedCount;
          mergeSplice(repeat.__queuedSplices, index, removed, addedCount);
        }

        repeat.__array = array.slice(0);
        return;
      }

      var maybePromise = this._runSplices(repeat, array.slice(0), splices);

      if (maybePromise instanceof Promise) {
        var queuedSplices = repeat.__queuedSplices = [];

        var runQueuedSplices = function runQueuedSplices() {
          if (!queuedSplices.length) {
            repeat.__queuedSplices = undefined;
            repeat.__array = undefined;
            return;
          }

          var nextPromise = _this2._runSplices(repeat, repeat.__array, queuedSplices) || Promise.resolve();
          queuedSplices = repeat.__queuedSplices = [];
          nextPromise.then(runQueuedSplices);
        };

        maybePromise.then(runQueuedSplices);
      }
    };

    _proto._runSplices = function _runSplices(repeat, array, splices) {
      var _this3 = this;

      var removeDelta = 0;
      var rmPromises = [];

      for (var i = 0, ii = splices.length; i < ii; ++i) {
        var splice = splices[i];
        var removed = splice.removed;

        for (var j = 0, jj = removed.length; j < jj; ++j) {
          var viewOrPromise = repeat.removeView(splice.index + removeDelta + rmPromises.length, true);

          if (viewOrPromise instanceof Promise) {
            rmPromises.push(viewOrPromise);
          }
        }

        removeDelta -= splice.addedCount;
      }

      if (rmPromises.length > 0) {
        return Promise.all(rmPromises).then(function () {
          var spliceIndexLow = _this3._handleAddedSplices(repeat, array, splices);

          updateOverrideContexts(repeat.views(), spliceIndexLow);
        });
      }

      var spliceIndexLow = this._handleAddedSplices(repeat, array, splices);

      updateOverrideContexts(repeat.views(), spliceIndexLow);
      return undefined;
    };

    _proto._handleAddedSplices = function _handleAddedSplices(repeat, array, splices) {
      var spliceIndex;
      var spliceIndexLow;
      var arrayLength = array.length;

      for (var i = 0, ii = splices.length; i < ii; ++i) {
        var splice = splices[i];
        var addIndex = spliceIndex = splice.index;
        var end = splice.index + splice.addedCount;

        if (typeof spliceIndexLow === 'undefined' || spliceIndexLow === null || spliceIndexLow > splice.index) {
          spliceIndexLow = spliceIndex;
        }

        for (; addIndex < end; ++addIndex) {
          var overrideContext = createFullOverrideContext(repeat, array[addIndex], addIndex, arrayLength);
          repeat.insertView(addIndex, overrideContext.bindingContext, overrideContext);
        }
      }

      return spliceIndexLow;
    };

    return ArrayRepeatStrategy;
  }();

  var MapRepeatStrategy =
  /*#__PURE__*/
  function () {
    function MapRepeatStrategy() {}

    var _proto = MapRepeatStrategy.prototype;

    _proto.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
      return observerLocator.getMapObserver(items);
    };

    _proto.instanceChanged = function instanceChanged(repeat, items) {
      var _this = this;

      var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);

      if (removePromise instanceof Promise) {
        removePromise.then(function () {
          return _this._standardProcessItems(repeat, items);
        });
        return;
      }

      this._standardProcessItems(repeat, items);
    };

    _proto._standardProcessItems = function _standardProcessItems(repeat, items) {
      var index = 0;
      var overrideContext;
      items.forEach(function (value, key) {
        overrideContext = createFullOverrideContext(repeat, value, index, items.size, key);
        repeat.addView(overrideContext.bindingContext, overrideContext);
        ++index;
      });
    };

    _proto.instanceMutated = function instanceMutated(repeat, map, records) {
      var key;
      var i;
      var ii;
      var overrideContext;
      var removeIndex;
      var addIndex;
      var record;
      var rmPromises = [];
      var viewOrPromise;

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
        Promise.all(rmPromises).then(function () {
          updateOverrideContexts(repeat.views(), 0);
        });
      } else {
        updateOverrideContexts(repeat.views(), 0);
      }
    };

    _proto._getViewIndexByKey = function _getViewIndexByKey(repeat, key) {
      var i;
      var ii;
      var child;

      for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
        child = repeat.view(i);

        if (child.bindingContext[repeat.key] === key) {
          return i;
        }
      }

      return undefined;
    };

    return MapRepeatStrategy;
  }();

  var SetRepeatStrategy =
  /*#__PURE__*/
  function () {
    function SetRepeatStrategy() {}

    var _proto = SetRepeatStrategy.prototype;

    _proto.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
      return observerLocator.getSetObserver(items);
    };

    _proto.instanceChanged = function instanceChanged(repeat, items) {
      var _this = this;

      var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);

      if (removePromise instanceof Promise) {
        removePromise.then(function () {
          return _this._standardProcessItems(repeat, items);
        });
        return;
      }

      this._standardProcessItems(repeat, items);
    };

    _proto._standardProcessItems = function _standardProcessItems(repeat, items) {
      var index = 0;
      var overrideContext;
      items.forEach(function (value) {
        overrideContext = createFullOverrideContext(repeat, value, index, items.size);
        repeat.addView(overrideContext.bindingContext, overrideContext);
        ++index;
      });
    };

    _proto.instanceMutated = function instanceMutated(repeat, set, records) {
      var value;
      var i;
      var ii;
      var overrideContext;
      var removeIndex;
      var record;
      var rmPromises = [];
      var viewOrPromise;

      for (i = 0, ii = records.length; i < ii; ++i) {
        record = records[i];
        value = record.value;

        switch (record.type) {
          case 'add':
            var size = Math.max(set.size - 1, 0);
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
        Promise.all(rmPromises).then(function () {
          updateOverrideContexts(repeat.views(), 0);
        });
      } else {
        updateOverrideContexts(repeat.views(), 0);
      }
    };

    _proto._getViewIndexByValue = function _getViewIndexByValue(repeat, value) {
      var i;
      var ii;
      var child;

      for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
        child = repeat.view(i);

        if (child.bindingContext[repeat.local] === value) {
          return i;
        }
      }

      return undefined;
    };

    return SetRepeatStrategy;
  }();

  var NumberRepeatStrategy =
  /*#__PURE__*/
  function () {
    function NumberRepeatStrategy() {}

    var _proto = NumberRepeatStrategy.prototype;

    _proto.getCollectionObserver = function getCollectionObserver() {
      return null;
    };

    _proto.instanceChanged = function instanceChanged(repeat, value) {
      var _this = this;

      var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);

      if (removePromise instanceof Promise) {
        removePromise.then(function () {
          return _this._standardProcessItems(repeat, value);
        });
        return;
      }

      this._standardProcessItems(repeat, value);
    };

    _proto._standardProcessItems = function _standardProcessItems(repeat, value) {
      var childrenLength = repeat.viewCount();
      var i;
      var ii;
      var overrideContext;
      var viewsToRemove;
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
    };

    return NumberRepeatStrategy;
  }();

  var RepeatStrategyLocator =
  /*#__PURE__*/
  function () {
    function RepeatStrategyLocator() {
      this.matchers = [];
      this.strategies = [];
      this.addStrategy(function (items) {
        return items === null || items === undefined;
      }, new NullRepeatStrategy());
      this.addStrategy(function (items) {
        return items instanceof Array;
      }, new ArrayRepeatStrategy());
      this.addStrategy(function (items) {
        return items instanceof Map;
      }, new MapRepeatStrategy());
      this.addStrategy(function (items) {
        return items instanceof Set;
      }, new SetRepeatStrategy());
      this.addStrategy(function (items) {
        return typeof items === 'number';
      }, new NumberRepeatStrategy());
    }

    var _proto = RepeatStrategyLocator.prototype;

    _proto.addStrategy = function addStrategy(matcher, strategy) {
      this.matchers.push(matcher);
      this.strategies.push(strategy);
    };

    _proto.getStrategy = function getStrategy(items) {
      var matchers = this.matchers;

      for (var i = 0, ii = matchers.length; i < ii; ++i) {
        if (matchers[i](items)) {
          return this.strategies[i];
        }
      }

      return null;
    };

    return RepeatStrategyLocator;
  }();

  var lifecycleOptionalBehaviors = ['focus', 'if', 'else', 'repeat', 'show', 'hide', 'with'];

  function behaviorRequiresLifecycle(instruction) {
    var t = instruction.type;
    var name = t.elementName !== null ? t.elementName : t.attributeName;
    return lifecycleOptionalBehaviors.indexOf(name) === -1 && (t.handlesAttached || t.handlesBind || t.handlesCreated || t.handlesDetached || t.handlesUnbind) || t.viewFactory && viewsRequireLifecycle(t.viewFactory) || instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
  }

  function targetRequiresLifecycle(instruction) {
    var behaviors = instruction.behaviorInstructions;

    if (behaviors) {
      var i = behaviors.length;

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

    for (var id in viewFactory.instructions) {
      if (targetRequiresLifecycle(viewFactory.instructions[id])) {
        viewFactory._viewsRequireLifecycle = true;
        return true;
      }
    }

    viewFactory._viewsRequireLifecycle = false;
    return false;
  }

  var AbstractRepeater =
  /*#__PURE__*/
  function () {
    function AbstractRepeater(options) {
      Object.assign(this, {
        local: 'items',
        viewsRequireLifecycle: true
      }, options);
    }

    var _proto = AbstractRepeater.prototype;

    _proto.viewCount = function viewCount() {
      throw new Error('subclass must implement `viewCount`');
    };

    _proto.views = function views() {
      throw new Error('subclass must implement `views`');
    };

    _proto.view = function view(index) {
      throw new Error('subclass must implement `view`');
    };

    _proto.matcher = function matcher() {
      throw new Error('subclass must implement `matcher`');
    };

    _proto.addView = function addView(bindingContext, overrideContext) {
      throw new Error('subclass must implement `addView`');
    };

    _proto.insertView = function insertView(index, bindingContext, overrideContext) {
      throw new Error('subclass must implement `insertView`');
    };

    _proto.moveView = function moveView(sourceIndex, targetIndex) {
      throw new Error('subclass must implement `moveView`');
    };

    _proto.removeAllViews = function removeAllViews(returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeAllViews`');
    };

    _proto.removeViews = function removeViews(viewsToRemove, returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeView`');
    };

    _proto.removeView = function removeView(index, returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeView`');
    };

    _proto.updateBindings = function updateBindings(view) {
      throw new Error('subclass must implement `updateBindings`');
    };

    return AbstractRepeater;
  }();

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
  var Repeat = (_dec$8 = customAttribute('repeat'), _dec2$7 = inject(BoundViewFactory, TargetInstruction, ViewSlot, ViewResources, ObserverLocator, RepeatStrategyLocator), _dec$8(_class$8 = templateController(_class$8 = _dec2$7(_class$8 = (_class2$6 =
  /*#__PURE__*/
  function (_AbstractRepeater) {
    _inheritsLoose(Repeat, _AbstractRepeater);

    function Repeat(viewFactory, instruction, viewSlot, viewResources, observerLocator, strategyLocator) {
      var _this;

      _this = _AbstractRepeater.call(this, {
        local: 'item',
        viewsRequireLifecycle: viewsRequireLifecycle(viewFactory)
      }) || this;

      _initDefineProp$2(_assertThisInitialized(_this), 'items', _descriptor$2, _assertThisInitialized(_this));

      _initDefineProp$2(_assertThisInitialized(_this), 'local', _descriptor2$2, _assertThisInitialized(_this));

      _initDefineProp$2(_assertThisInitialized(_this), 'key', _descriptor3$1, _assertThisInitialized(_this));

      _initDefineProp$2(_assertThisInitialized(_this), 'value', _descriptor4$1, _assertThisInitialized(_this));

      _this.viewFactory = viewFactory;
      _this.instruction = instruction;
      _this.viewSlot = viewSlot;
      _this.lookupFunctions = viewResources.lookupFunctions;
      _this.observerLocator = observerLocator;
      _this.key = 'key';
      _this.value = 'value';
      _this.strategyLocator = strategyLocator;
      _this.ignoreMutation = false;
      _this.sourceExpression = getItemsSourceExpression(_this.instruction, 'repeat.for');
      _this.isOneTime = isOneTime(_this.sourceExpression);
      _this.viewsRequireLifecycle = viewsRequireLifecycle(viewFactory);
      return _this;
    }

    var _proto = Repeat.prototype;

    _proto.call = function call(context, changes) {
      this[context](this.items, changes);
    };

    _proto.bind = function bind(bindingContext, overrideContext) {
      this.scope = {
        bindingContext: bindingContext,
        overrideContext: overrideContext
      };
      this.matcherBinding = this._captureAndRemoveMatcherBinding();
      this.itemsChanged();
    };

    _proto.unbind = function unbind() {
      this.scope = null;
      this.items = null;
      this.matcherBinding = null;
      this.viewSlot.removeAll(true, true);

      this._unsubscribeCollection();
    };

    _proto._unsubscribeCollection = function _unsubscribeCollection() {
      if (this.collectionObserver) {
        this.collectionObserver.unsubscribe(this.callContext, this);
        this.collectionObserver = null;
        this.callContext = null;
      }
    };

    _proto.itemsChanged = function itemsChanged() {
      var _this2 = this;

      this._unsubscribeCollection();

      if (!this.scope) {
        return;
      }

      var items = this.items;
      this.strategy = this.strategyLocator.getStrategy(items);

      if (!this.strategy) {
        throw new Error("Value for '" + this.sourceExpression + "' is non-repeatable");
      }

      if (!this.isOneTime && !this._observeInnerCollection()) {
        this._observeCollection();
      }

      this.ignoreMutation = true;
      this.strategy.instanceChanged(this, items);
      this.observerLocator.taskQueue.queueMicroTask(function () {
        _this2.ignoreMutation = false;
      });
    };

    _proto._getInnerCollection = function _getInnerCollection() {
      var expression = unwrapExpression(this.sourceExpression);

      if (!expression) {
        return null;
      }

      return expression.evaluate(this.scope, null);
    };

    _proto.handleCollectionMutated = function handleCollectionMutated(collection, changes) {
      if (!this.collectionObserver) {
        return;
      }

      if (this.ignoreMutation) {
        return;
      }

      this.strategy.instanceMutated(this, collection, changes);
    };

    _proto.handleInnerCollectionMutated = function handleInnerCollectionMutated(collection, changes) {
      var _this3 = this;

      if (!this.collectionObserver) {
        return;
      }

      if (this.ignoreMutation) {
        return;
      }

      this.ignoreMutation = true;
      var newItems = this.sourceExpression.evaluate(this.scope, this.lookupFunctions);
      this.observerLocator.taskQueue.queueMicroTask(function () {
        return _this3.ignoreMutation = false;
      });

      if (newItems === this.items) {
        this.itemsChanged();
      } else {
        this.items = newItems;
      }
    };

    _proto._observeInnerCollection = function _observeInnerCollection() {
      var items = this._getInnerCollection();

      var strategy = this.strategyLocator.getStrategy(items);

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
    };

    _proto._observeCollection = function _observeCollection() {
      var items = this.items;
      this.collectionObserver = this.strategy.getCollectionObserver(this.observerLocator, items);

      if (this.collectionObserver) {
        this.callContext = 'handleCollectionMutated';
        this.collectionObserver.subscribe(this.callContext, this);
      }
    };

    _proto._captureAndRemoveMatcherBinding = function _captureAndRemoveMatcherBinding() {
      if (this.viewFactory.viewFactory) {
        var instructions = this.viewFactory.viewFactory.instructions;
        var instructionIds = Object.keys(instructions);

        for (var i = 0; i < instructionIds.length; i++) {
          var expressions = instructions[instructionIds[i]].expressions;

          if (expressions) {
            for (var ii = 0; i < expressions.length; i++) {
              if (expressions[ii].targetProperty === 'matcher') {
                var matcherBinding = expressions[ii];
                expressions.splice(ii, 1);
                return matcherBinding;
              }
            }
          }
        }
      }

      return undefined;
    };

    _proto.viewCount = function viewCount() {
      return this.viewSlot.children.length;
    };

    _proto.views = function views() {
      return this.viewSlot.children;
    };

    _proto.view = function view(index) {
      return this.viewSlot.children[index];
    };

    _proto.matcher = function matcher() {
      return this.matcherBinding ? this.matcherBinding.sourceExpression.evaluate(this.scope, this.matcherBinding.lookupFunctions) : null;
    };

    _proto.addView = function addView(bindingContext, overrideContext) {
      var view = this.viewFactory.create();
      view.bind(bindingContext, overrideContext);
      this.viewSlot.add(view);
    };

    _proto.insertView = function insertView(index, bindingContext, overrideContext) {
      var view = this.viewFactory.create();
      view.bind(bindingContext, overrideContext);
      this.viewSlot.insert(index, view);
    };

    _proto.moveView = function moveView(sourceIndex, targetIndex) {
      this.viewSlot.move(sourceIndex, targetIndex);
    };

    _proto.removeAllViews = function removeAllViews(returnToCache, skipAnimation) {
      return this.viewSlot.removeAll(returnToCache, skipAnimation);
    };

    _proto.removeViews = function removeViews(viewsToRemove, returnToCache, skipAnimation) {
      return this.viewSlot.removeMany(viewsToRemove, returnToCache, skipAnimation);
    };

    _proto.removeView = function removeView(index, returnToCache, skipAnimation) {
      return this.viewSlot.removeAt(index, returnToCache, skipAnimation);
    };

    _proto.updateBindings = function updateBindings(view) {
      var j = view.bindings.length;

      while (j--) {
        updateOneTimeBinding(view.bindings[j]);
      }

      j = view.controllers.length;

      while (j--) {
        var k = view.controllers[j].boundProperties.length;

        while (k--) {
          var binding = view.controllers[j].boundProperties[k].binding;
          updateOneTimeBinding(binding);
        }
      }
    };

    return Repeat;
  }(AbstractRepeater), (_descriptor$2 = _applyDecoratedDescriptor$2(_class2$6.prototype, 'items', [bindable], {
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

  var aureliaHideClassName = 'aurelia-hide';
  var aureliaHideClass = "." + aureliaHideClassName + " { display:none !important; }";
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
  var Show = (_dec$9 = customAttribute('show'), _dec$9(_class$9 =
  /*#__PURE__*/
  function () {
    Show.inject = function inject() {
      return [DOM.Element, Animator, Optional.of(DOM.boundary, true)];
    };

    function Show(element, animator, domBoundary) {
      this.element = element;
      this.animator = animator;
      this.domBoundary = domBoundary;
    }

    var _proto = Show.prototype;

    _proto.created = function created() {
      injectAureliaHideStyleAtBoundary(this.domBoundary);
    };

    _proto.valueChanged = function valueChanged(newValue) {
      if (newValue) {
        this.animator.removeClass(this.element, aureliaHideClassName);
      } else {
        this.animator.addClass(this.element, aureliaHideClassName);
      }
    };

    _proto.bind = function bind(bindingContext) {
      this.valueChanged(this.value);
    };

    return Show;
  }()) || _class$9);

  var _dec$a, _class$a;
  var Hide = (_dec$a = customAttribute('hide'), _dec$a(_class$a =
  /*#__PURE__*/
  function () {
    Hide.inject = function inject() {
      return [DOM.Element, Animator, Optional.of(DOM.boundary, true)];
    };

    function Hide(element, animator, domBoundary) {
      this.element = element;
      this.animator = animator;
      this.domBoundary = domBoundary;
    }

    var _proto = Hide.prototype;

    _proto.created = function created() {
      injectAureliaHideStyleAtBoundary(this.domBoundary);
    };

    _proto.valueChanged = function valueChanged(newValue) {
      if (newValue) {
        this.animator.addClass(this.element, aureliaHideClassName);
      } else {
        this.animator.removeClass(this.element, aureliaHideClassName);
      }
    };

    _proto.bind = function bind(bindingContext) {
      this.valueChanged(this.value);
    };

    return Hide;
  }()) || _class$a);

  var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  var HTMLSanitizer =
  /*#__PURE__*/
  function () {
    function HTMLSanitizer() {}

    var _proto = HTMLSanitizer.prototype;

    _proto.sanitize = function sanitize(input) {
      return input.replace(SCRIPT_REGEX, '');
    };

    return HTMLSanitizer;
  }();

  var _dec$b, _dec2$8, _class$b;
  var SanitizeHTMLValueConverter = (_dec$b = valueConverter('sanitizeHTML'), _dec2$8 = inject(HTMLSanitizer), _dec$b(_class$b = _dec2$8(_class$b =
  /*#__PURE__*/
  function () {
    function SanitizeHTMLValueConverter(sanitizer) {
      this.sanitizer = sanitizer;
    }

    var _proto = SanitizeHTMLValueConverter.prototype;

    _proto.toView = function toView(untrustedMarkup) {
      if (untrustedMarkup === null || untrustedMarkup === undefined) {
        return null;
      }

      return this.sanitizer.sanitize(untrustedMarkup);
    };

    return SanitizeHTMLValueConverter;
  }()) || _class$b) || _class$b);

  var _dec$c, _dec2$9, _class$c;
  var Replaceable = (_dec$c = customAttribute('replaceable'), _dec2$9 = inject(BoundViewFactory, ViewSlot), _dec$c(_class$c = templateController(_class$c = _dec2$9(_class$c =
  /*#__PURE__*/
  function () {
    function Replaceable(viewFactory, viewSlot) {
      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.view = null;
    }

    var _proto = Replaceable.prototype;

    _proto.bind = function bind(bindingContext, overrideContext) {
      if (this.view === null) {
        this.view = this.viewFactory.create();
        this.viewSlot.add(this.view);
      }

      this.view.bind(bindingContext, overrideContext);
    };

    _proto.unbind = function unbind() {
      this.view.unbind();
    };

    return Replaceable;
  }()) || _class$c) || _class$c) || _class$c);

  var _dec$d, _class$d;
  var Focus = (_dec$d = customAttribute('focus', bindingMode.twoWay), _dec$d(_class$d =
  /*#__PURE__*/
  function () {
    Focus.inject = function inject() {
      return [DOM.Element, TaskQueue];
    };

    function Focus(element, taskQueue) {
      this.element = element;
      this.taskQueue = taskQueue;
      this.isAttached = false;
      this.needsApply = false;
    }

    var _proto = Focus.prototype;

    _proto.valueChanged = function valueChanged(newValue) {
      if (this.isAttached) {
        this._apply();
      } else {
        this.needsApply = true;
      }
    };

    _proto._apply = function _apply() {
      var _this = this;

      if (this.value) {
        this.taskQueue.queueMicroTask(function () {
          if (_this.value) {
            _this.element.focus();
          }
        });
      } else {
        this.element.blur();
      }
    };

    _proto.attached = function attached() {
      this.isAttached = true;

      if (this.needsApply) {
        this.needsApply = false;

        this._apply();
      }

      this.element.addEventListener('focus', this);
      this.element.addEventListener('blur', this);
    };

    _proto.detached = function detached() {
      this.isAttached = false;
      this.element.removeEventListener('focus', this);
      this.element.removeEventListener('blur', this);
    };

    _proto.handleEvent = function handleEvent(e) {
      if (e.type === 'focus') {
        this.value = true;
      } else if (DOM.activeElement !== this.element) {
        this.value = false;
      }
    };

    return Focus;
  }()) || _class$d);

  var cssUrlMatcher = /url\((?!['"]data)([^)]+)\)/gi;

  function fixupCSSUrls(address, css) {
    if (typeof css !== 'string') {
      throw new Error("Failed loading required CSS file: " + address);
    }

    return css.replace(cssUrlMatcher, function (match, p1) {
      var quote = p1.charAt(0);

      if (quote === '\'' || quote === '"') {
        p1 = p1.substr(1, p1.length - 2);
      }

      return 'url(\'' + relativeToFile(p1, address) + '\')';
    });
  }

  var CSSResource =
  /*#__PURE__*/
  function () {
    function CSSResource(address) {
      this.address = address;
      this._scoped = null;
      this._global = false;
      this._alreadyGloballyInjected = false;
    }

    var _proto = CSSResource.prototype;

    _proto.initialize = function initialize(container, target) {
      this._scoped = new target(this);
    };

    _proto.register = function register(registry, name) {
      if (name === 'scoped') {
        registry.registerViewEngineHooks(this._scoped);
      } else {
        this._global = true;
      }
    };

    _proto.load = function load(container) {
      var _this = this;

      return container.get(Loader).loadText(this.address)["catch"](function (err) {
        return null;
      }).then(function (text) {
        text = fixupCSSUrls(_this.address, text);
        _this._scoped.css = text;

        if (_this._global) {
          _this._alreadyGloballyInjected = true;
          DOM.injectStyles(text);
        }
      });
    };

    return CSSResource;
  }();

  var CSSViewEngineHooks =
  /*#__PURE__*/
  function () {
    function CSSViewEngineHooks(owner) {
      this.owner = owner;
      this.css = null;
    }

    var _proto2 = CSSViewEngineHooks.prototype;

    _proto2.beforeCompile = function beforeCompile(content, resources, instruction) {
      if (instruction.targetShadowDOM) {
        DOM.injectStyles(this.css, content, true);
      } else if (FEATURE.scopedCSS) {
        var styleNode = DOM.injectStyles(this.css, content, true);
        styleNode.setAttribute('scoped', 'scoped');
      } else if (this._global && !this.owner._alreadyGloballyInjected) {
        DOM.injectStyles(this.css);
        this.owner._alreadyGloballyInjected = true;
      }
    };

    return CSSViewEngineHooks;
  }();

  function _createCSSResource(address) {
    var _dec, _class;

    var ViewCSS = (_dec = resource(new CSSResource(address)), _dec(_class =
    /*#__PURE__*/
    function (_CSSViewEngineHooks) {
      _inheritsLoose(ViewCSS, _CSSViewEngineHooks);

      function ViewCSS() {
        return _CSSViewEngineHooks.apply(this, arguments) || this;
      }

      return ViewCSS;
    }(CSSViewEngineHooks)) || _class);
    return ViewCSS;
  }

  var _dec$e, _class$e;
  var AttrBindingBehavior = (_dec$e = bindingBehavior('attr'), _dec$e(_class$e =
  /*#__PURE__*/
  function () {
    function AttrBindingBehavior() {}

    var _proto = AttrBindingBehavior.prototype;

    _proto.bind = function bind(binding, source) {
      binding.targetObserver = new DataAttributeObserver(binding.target, binding.targetProperty);
    };

    _proto.unbind = function unbind(binding, source) {};

    return AttrBindingBehavior;
  }()) || _class$e);

  var _dec$f, _dec2$a, _class$f, _dec3$4, _dec4$3, _class2$7, _dec5$3, _dec6$3, _class3$4, _dec7$3, _dec8$2, _class4$3, _dec9$2, _dec10$2, _class5$4;
  var modeBindingBehavior = {
    bind: function bind(binding, source, lookupFunctions) {
      binding.originalMode = binding.mode;
      binding.mode = this.mode;
    },
    unbind: function unbind(binding, source) {
      binding.mode = binding.originalMode;
      binding.originalMode = null;
    }
  };
  var OneTimeBindingBehavior = (_dec$f = mixin(modeBindingBehavior), _dec2$a = bindingBehavior('oneTime'), _dec$f(_class$f = _dec2$a(_class$f = function OneTimeBindingBehavior() {
    this.mode = bindingMode.oneTime;
  }) || _class$f) || _class$f);
  var OneWayBindingBehavior = (_dec3$4 = mixin(modeBindingBehavior), _dec4$3 = bindingBehavior('oneWay'), _dec3$4(_class2$7 = _dec4$3(_class2$7 = function OneWayBindingBehavior() {
    this.mode = bindingMode.toView;
  }) || _class2$7) || _class2$7);
  var ToViewBindingBehavior = (_dec5$3 = mixin(modeBindingBehavior), _dec6$3 = bindingBehavior('toView'), _dec5$3(_class3$4 = _dec6$3(_class3$4 = function ToViewBindingBehavior() {
    this.mode = bindingMode.toView;
  }) || _class3$4) || _class3$4);
  var FromViewBindingBehavior = (_dec7$3 = mixin(modeBindingBehavior), _dec8$2 = bindingBehavior('fromView'), _dec7$3(_class4$3 = _dec8$2(_class4$3 = function FromViewBindingBehavior() {
    this.mode = bindingMode.fromView;
  }) || _class4$3) || _class4$3);
  var TwoWayBindingBehavior = (_dec9$2 = mixin(modeBindingBehavior), _dec10$2 = bindingBehavior('twoWay'), _dec9$2(_class5$4 = _dec10$2(_class5$4 = function TwoWayBindingBehavior() {
    this.mode = bindingMode.twoWay;
  }) || _class5$4) || _class5$4);

  var _dec$g, _class$g;

  function throttle(newValue) {
    var _this = this;

    var state = this.throttleState;
    var elapsed = +new Date() - state.last;

    if (elapsed >= state.delay) {
      clearTimeout(state.timeoutId);
      state.timeoutId = null;
      state.last = +new Date();
      this.throttledMethod(newValue);
      return;
    }

    state.newValue = newValue;

    if (state.timeoutId === null) {
      state.timeoutId = setTimeout(function () {
        state.timeoutId = null;
        state.last = +new Date();

        _this.throttledMethod(state.newValue);
      }, state.delay - elapsed);
    }
  }

  var ThrottleBindingBehavior = (_dec$g = bindingBehavior('throttle'), _dec$g(_class$g =
  /*#__PURE__*/
  function () {
    function ThrottleBindingBehavior() {}

    var _proto = ThrottleBindingBehavior.prototype;

    _proto.bind = function bind(binding, source, delay) {
      if (delay === void 0) {
        delay = 200;
      }

      var methodToThrottle = 'updateTarget';

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
    };

    _proto.unbind = function unbind(binding, source) {
      var methodToRestore = binding.throttledMethod.originalName;
      binding[methodToRestore] = binding.throttledMethod;
      binding.throttledMethod = null;
      clearTimeout(binding.throttleState.timeoutId);
      binding.throttleState = null;
    };

    return ThrottleBindingBehavior;
  }()) || _class$g);

  var _dec$h, _class$h;
  var unset = {};

  function debounceCallSource(event) {
    var _this = this;

    var state = this.debounceState;
    clearTimeout(state.timeoutId);
    state.timeoutId = setTimeout(function () {
      return _this.debouncedMethod(event);
    }, state.delay);
  }

  function debounceCall(context, newValue, oldValue) {
    var _this2 = this;

    var state = this.debounceState;
    clearTimeout(state.timeoutId);

    if (context !== state.callContextToDebounce) {
      state.oldValue = unset;
      this.debouncedMethod(context, newValue, oldValue);
      return;
    }

    if (state.oldValue === unset) {
      state.oldValue = oldValue;
    }

    state.timeoutId = setTimeout(function () {
      var _oldValue = state.oldValue;
      state.oldValue = unset;

      _this2.debouncedMethod(context, newValue, _oldValue);
    }, state.delay);
  }

  var DebounceBindingBehavior = (_dec$h = bindingBehavior('debounce'), _dec$h(_class$h =
  /*#__PURE__*/
  function () {
    function DebounceBindingBehavior() {}

    var _proto = DebounceBindingBehavior.prototype;

    _proto.bind = function bind(binding, source, delay) {
      if (delay === void 0) {
        delay = 200;
      }

      var isCallSource = binding.callSource !== undefined;
      var methodToDebounce = isCallSource ? 'callSource' : 'call';
      var debouncer = isCallSource ? debounceCallSource : debounceCall;
      var mode = binding.mode;
      var callContextToDebounce = mode === bindingMode.twoWay || mode === bindingMode.fromView ? targetContext : sourceContext;
      binding.debouncedMethod = binding[methodToDebounce];
      binding.debouncedMethod.originalName = methodToDebounce;
      binding[methodToDebounce] = debouncer;
      binding.debounceState = {
        callContextToDebounce: callContextToDebounce,
        delay: delay,
        timeoutId: 0,
        oldValue: unset
      };
    };

    _proto.unbind = function unbind(binding, source) {
      var methodToRestore = binding.debouncedMethod.originalName;
      binding[methodToRestore] = binding.debouncedMethod;
      binding.debouncedMethod = null;
      clearTimeout(binding.debounceState.timeoutId);
      binding.debounceState = null;
    };

    return DebounceBindingBehavior;
  }()) || _class$h);

  var _dec$i, _class$i;

  function findOriginalEventTarget$1(event) {
    return event.path && event.path[0] || event.deepPath && event.deepPath[0] || event.target;
  }

  function handleSelfEvent(event) {
    var target = findOriginalEventTarget$1(event);
    if (this.target !== target) return;
    this.selfEventCallSource(event);
  }

  var SelfBindingBehavior = (_dec$i = bindingBehavior('self'), _dec$i(_class$i =
  /*#__PURE__*/
  function () {
    function SelfBindingBehavior() {}

    var _proto = SelfBindingBehavior.prototype;

    _proto.bind = function bind(binding, source) {
      if (!binding.callSource || !binding.targetEvent) throw new Error('Self binding behavior only supports event.');
      binding.selfEventCallSource = binding.callSource;
      binding.callSource = handleSelfEvent;
    };

    _proto.unbind = function unbind(binding, source) {
      binding.callSource = binding.selfEventCallSource;
      binding.selfEventCallSource = null;
    };

    return SelfBindingBehavior;
  }()) || _class$i);

  var BindingSignaler =
  /*#__PURE__*/
  function () {
    function BindingSignaler() {
      this.signals = {};
    }

    var _proto = BindingSignaler.prototype;

    _proto.signal = function signal(name) {
      var bindings = this.signals[name];

      if (!bindings) {
        return;
      }

      var i = bindings.length;

      while (i--) {
        bindings[i].call(sourceContext);
      }
    };

    return BindingSignaler;
  }();

  var _dec$j, _class$j;
  var SignalBindingBehavior = (_dec$j = bindingBehavior('signal'), _dec$j(_class$j =
  /*#__PURE__*/
  function () {
    SignalBindingBehavior.inject = function inject() {
      return [BindingSignaler];
    };

    function SignalBindingBehavior(bindingSignaler) {
      this.signals = bindingSignaler.signals;
    }

    var _proto = SignalBindingBehavior.prototype;

    _proto.bind = function bind(binding, source) {
      if (!binding.updateTarget) {
        throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
      }

      if (arguments.length === 3) {
        var name = arguments[2];
        var bindings = this.signals[name] || (this.signals[name] = []);
        bindings.push(binding);
        binding.signalName = name;
      } else if (arguments.length > 3) {
        var names = Array.prototype.slice.call(arguments, 2);
        var i = names.length;

        while (i--) {
          var _name = names[i];

          var _bindings = this.signals[_name] || (this.signals[_name] = []);

          _bindings.push(binding);
        }

        binding.signalName = names;
      } else {
        throw new Error('Signal name is required.');
      }
    };

    _proto.unbind = function unbind(binding, source) {
      var name = binding.signalName;
      binding.signalName = null;

      if (Array.isArray(name)) {
        var names = name;
        var i = names.length;

        while (i--) {
          var n = names[i];
          var bindings = this.signals[n];
          bindings.splice(bindings.indexOf(binding), 1);
        }
      } else {
        var _bindings2 = this.signals[name];

        _bindings2.splice(_bindings2.indexOf(binding), 1);
      }
    };

    return SignalBindingBehavior;
  }()) || _class$j);

  var _dec$k, _class$k;
  var eventNamesRequired = 'The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:\'blur\'">';
  var notApplicableMessage = 'The updateTrigger binding behavior can only be applied to two-way/ from-view bindings on input/select elements.';
  var UpdateTriggerBindingBehavior = (_dec$k = bindingBehavior('updateTrigger'), _dec$k(_class$k =
  /*#__PURE__*/
  function () {
    function UpdateTriggerBindingBehavior() {}

    var _proto = UpdateTriggerBindingBehavior.prototype;

    _proto.bind = function bind(binding, source) {
      for (var _len = arguments.length, events = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        events[_key - 2] = arguments[_key];
      }

      if (events.length === 0) {
        throw new Error(eventNamesRequired);
      }

      if (binding.mode !== bindingMode.twoWay && binding.mode !== bindingMode.fromView) {
        throw new Error(notApplicableMessage);
      }

      var targetObserver = binding.observerLocator.getObserver(binding.target, binding.targetProperty);

      if (!targetObserver.handler) {
        throw new Error(notApplicableMessage);
      }

      binding.targetObserver = targetObserver;
      targetObserver.originalHandler = binding.targetObserver.handler;
      var handler = new EventSubscriber(events);
      targetObserver.handler = handler;
    };

    _proto.unbind = function unbind(binding, source) {
      binding.targetObserver.handler.dispose();
      binding.targetObserver.handler = binding.targetObserver.originalHandler;
      binding.targetObserver.originalHandler = null;
    };

    return UpdateTriggerBindingBehavior;
  }()) || _class$k);

  function _createDynamicElement(name, viewUrl, bindableNames) {
    var _dec, _dec2, _class;

    var DynamicElement = (_dec = customElement(name), _dec2 = useView(viewUrl), _dec(_class = _dec2(_class =
    /*#__PURE__*/
    function () {
      function DynamicElement() {}

      var _proto = DynamicElement.prototype;

      _proto.bind = function bind(bindingContext) {
        this.$parent = bindingContext;
      };

      return DynamicElement;
    }()) || _class) || _class);

    for (var i = 0, ii = bindableNames.length; i < ii; ++i) {
      bindable(bindableNames[i])(DynamicElement);
    }

    return DynamicElement;
  }

  function getElementName(address) {
    return /([^\/^\?]+)\.html/i.exec(address)[1].toLowerCase();
  }
  function configure$1(config) {
    var viewEngine = config.container.get(ViewEngine);
    var loader = config.aurelia.loader;
    viewEngine.addResourcePlugin('.html', {
      'fetch': function fetch(address) {
        return loader.loadTemplate(address).then(function (registryEntry) {
          var _ref;

          var bindable = registryEntry.template.getAttribute('bindable');
          var elementName = getElementName(address);

          if (bindable) {
            bindable = bindable.split(',').map(function (x) {
              return x.trim();
            });
            registryEntry.template.removeAttribute('bindable');
          } else {
            bindable = [];
          }

          return _ref = {}, _ref[elementName] = _createDynamicElement(elementName, address, bindable), _ref;
        });
      }
    });
  }

  function configure$2(config) {
    injectAureliaHideStyleAtHead();
    config.globalResources(Compose, If, Else, With, Repeat, Show, Hide, Replaceable, Focus, SanitizeHTMLValueConverter, OneTimeBindingBehavior, OneWayBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, TwoWayBindingBehavior, ThrottleBindingBehavior, DebounceBindingBehavior, SelfBindingBehavior, SignalBindingBehavior, UpdateTriggerBindingBehavior, AttrBindingBehavior);
    configure$1(config);
    var viewEngine = config.container.get(ViewEngine);
    var styleResourcePlugin = {
      fetch: function fetch(address) {
        var _ref;

        return _ref = {}, _ref[address] = _createCSSResource(address), _ref;
      }
    };
    ['.css', '.less', '.sass', '.scss', '.styl'].forEach(function (ext) {
      return viewEngine.addResourcePlugin(ext, styleResourcePlugin);
    });
  }

  var logger$3 = getLogger('event-aggregator');

  var Handler =
  /*#__PURE__*/
  function () {
    function Handler(messageType, callback) {
      this.messageType = messageType;
      this.callback = callback;
    }

    var _proto = Handler.prototype;

    _proto.handle = function handle(message) {
      if (message instanceof this.messageType) {
        this.callback.call(null, message);
      }
    };

    return Handler;
  }();

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

  var EventAggregator =
  /*#__PURE__*/
  function () {
    function EventAggregator() {
      this.eventLookup = {};
      this.messageHandlers = [];
    }

    var _proto2 = EventAggregator.prototype;

    _proto2.publish = function publish(event, data) {
      var subscribers;
      var i;

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
    };

    _proto2.subscribe = function subscribe(event, callback) {
      var handler;
      var subscribers;

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
        dispose: function dispose() {
          var idx = subscribers.indexOf(handler);

          if (idx !== -1) {
            subscribers.splice(idx, 1);
          }
        }
      };
    };

    _proto2.subscribeOnce = function subscribeOnce(event, callback) {
      var sub = this.subscribe(event, function (a, b) {
        sub.dispose();
        return callback(a, b);
      });
      return sub;
    };

    return EventAggregator;
  }();
  function includeEventsIn(obj) {
    var ea = new EventAggregator();

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

  var ConsoleAppender =
  /*#__PURE__*/
  function () {
    function ConsoleAppender() {}

    var _proto = ConsoleAppender.prototype;

    _proto.debug = function debug(logger) {
      var _console;

      for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
      }

      (_console = console).debug.apply(_console, ["DEBUG [" + logger.id + "]"].concat(rest));
    };

    _proto.info = function info(logger) {
      var _console2;

      for (var _len2 = arguments.length, rest = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        rest[_key2 - 1] = arguments[_key2];
      }

      (_console2 = console).info.apply(_console2, ["INFO [" + logger.id + "]"].concat(rest));
    };

    _proto.warn = function warn(logger) {
      var _console3;

      for (var _len3 = arguments.length, rest = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        rest[_key3 - 1] = arguments[_key3];
      }

      (_console3 = console).warn.apply(_console3, ["WARN [" + logger.id + "]"].concat(rest));
    };

    _proto.error = function error(logger) {
      var _console4;

      for (var _len4 = arguments.length, rest = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        rest[_key4 - 1] = arguments[_key4];
      }

      (_console4 = console).error.apply(_console4, ["ERROR [" + logger.id + "]"].concat(rest));
    };

    return ConsoleAppender;
  }();

  /**
   * Bootstrap a new Aurelia instance and start an application
   * @param {QuickStartOptions} options
   * @returns {Aurelia} the running Aurelia instance
   */

  var createAndStart = function createAndStart(options) {
    if (options === void 0) {
      options = {};
    }

    var aurelia = new Aurelia();
    var use = aurelia.use;
    use.standardConfiguration();

    if (options.debug) {
      use.developmentLogging();
    }

    if (Array.isArray(options.plugins)) {
      options.plugins.forEach(function (plgCfg) {
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


  function start(options) {
    if (options === void 0) {
      options = {};
    }

    return createAndStart(options).then(function (aurelia) {
      return aurelia.setRoot(options.root || 'app.js', options.host || document.body);
    });
  }
  /**
   * Bootstrap a new Aurelia instance and start an application by enhancing a DOM tree
   * @param {QuickEnhanceOptions} options Configuration for enhancing a DOM tree
   * @returns {View} the enhanced View by selected options
   */

  function enhance(options) {
    if (options === void 0) {
      options = {};
    }

    return createAndStart(options).then(function (aurelia) {
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

  /**
   * Bare implementation for a noop loader.
   */

  PLATFORM.Loader =
  /*#__PURE__*/
  function (_Loader) {
    _inheritsLoose(NoopLoader, _Loader);

    function NoopLoader() {
      return _Loader.apply(this, arguments) || this;
    }

    var _proto = NoopLoader.prototype;

    _proto.normalize = function normalize(name) {
      return Promise.resolve(name);
    }
    /**
    * Alters a module id so that it includes a plugin loader.
    * @param url The url of the module to load.
    * @param pluginName The plugin to apply to the module id.
    * @return The plugin-based module id.
    */
    ;

    _proto.applyPluginToUrl = function applyPluginToUrl(url, pluginName) {
      return pluginName + "!" + url;
    }
    /**
    * Registers a plugin with the loader.
    * @param pluginName The name of the plugin.
    * @param implementation The plugin implementation.
    */
    ;

    _proto.addPlugin = function addPlugin(pluginName, implementation) {
      /* empty */
    };

    return NoopLoader;
  }(Loader);

  initialize(); // Using static convention to avoid having to fetch / load module dynamically

  (function (frameworkCfgProto) {
    frameworkCfgProto.developmentLogging = function () {
      LogManager.addAppender(new ConsoleAppender());
      LogManager.setLevel(LogManager.logLevel.debug);
      return this;
    };

    frameworkCfgProto.defaultBindingLanguage = function () {
      return this.plugin(configure);
    };

    frameworkCfgProto.defaultResources = function () {
      return this.plugin(configure$2);
    };

    frameworkCfgProto.eventAggregator = function () {
      return this.plugin(configure$3);
    };

    var errorMsg = 'This bundle does not support router feature. Consider using full bundle';

    frameworkCfgProto.history = function () {
      getLogger('aurelia').error(errorMsg);
      return this;
    };

    frameworkCfgProto.router = function () {
      getLogger('aurelia').error(errorMsg);
      return this;
    };
  })(FrameworkConfiguration.prototype);

  exports.AbstractRepeater = AbstractRepeater;
  exports.AccessKeyed = AccessKeyed;
  exports.AccessMember = AccessMember;
  exports.AccessScope = AccessScope;
  exports.AccessThis = AccessThis;
  exports.AggregateError = AggregateError;
  exports.All = All;
  exports.Animator = Animator;
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
  exports.Call = Call;
  exports.CallExpression = CallExpression;
  exports.CallFunction = CallFunction;
  exports.CallMember = CallMember;
  exports.CallScope = CallScope;
  exports.CheckedObserver = CheckedObserver;
  exports.ClassObserver = ClassObserver;
  exports.CollectionLengthObserver = CollectionLengthObserver;
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
  exports.Loader = Loader;
  exports.LogManager = LogManager;
  exports.MapRepeatStrategy = MapRepeatStrategy;
  exports.ModifyCollectionObserver = ModifyCollectionObserver;
  exports.ModuleAnalyzer = ModuleAnalyzer;
  exports.NameExpression = NameExpression;
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
  exports.PrimitiveObserver = PrimitiveObserver;
  exports.RelativeViewStrategy = RelativeViewStrategy;
  exports.Repeat = Repeat;
  exports.RepeatStrategyLocator = RepeatStrategyLocator;
  exports.Replaceable = Replaceable;
  exports.ResourceDescription = ResourceDescription;
  exports.ResourceLoadContext = ResourceLoadContext;
  exports.ResourceModule = ResourceModule;
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
  exports.getArrayObserver = _getArrayObserver;
  exports.getChangeRecords = getChangeRecords;
  exports.getConnectQueueSize = getConnectQueueSize;
  exports.getContextFor = getContextFor;
  exports.getDecoratorDependencies = getDecoratorDependencies;
  exports.getItemsSourceExpression = getItemsSourceExpression;
  exports.getMapObserver = _getMapObserver;
  exports.getSetObserver = _getSetObserver;
  exports.hasDeclaredDependencies = hasDeclaredDependencies;
  exports.includeEventsIn = includeEventsIn;
  exports.initializePAL = initializePAL;
  exports.inject = inject;
  exports.inlineView = inlineView;
  exports.invokeAsFactory = invokeAsFactory;
  exports.invoker = invoker;
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
  exports.transient = _transient;
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
