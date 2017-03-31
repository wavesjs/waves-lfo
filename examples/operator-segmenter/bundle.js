(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var min = Math.min;
var max = Math.max;

function clip(value) {
  var lower = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -Infinity;
  var upper = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : +Infinity;

  return max(lower, min(upper, value));
}

/**
 * Dictionnary of the available types. Each key correspond to the type of the
 * implemented param while the corresponding object value should the
 * {@link `paramDefinition`} of the defined type.
 *
 * typedef {Object} paramTemplates
 * @type {Object<String, paramTemplate>}
 */

/**
 * Definition of a parameter. The definition should at least contain the entries
 * `type` and `default`. Every parameter can also accept optionnal configuration
 * entries `constant` and `metas`.
 * Available definitions are:
 * - {@link booleanDefinition}
 * - {@link integerDefinition}
 * - {@link floatDefinition}
 * - {@link stringDefinition}
 * - {@link enumDefinition}
 *
 * typedef {Object} paramDefinition
 * @property {String} type - Type of the parameter.
 * @property {Mixed} default - Default value of the parameter if no
 *  initialization value is provided.
 * @property {Boolean} [constant=false] - Define if the parameter can be change
 *  after its initialization.
 * @property {Object} [metas=null] - Any user defined data associated to the
 *  parameter that couls be usefull in the application.
 */

exports.default = {
  /**
   * @typedef {Object} booleanDefinition
   * @property {String} [type='boolean'] - Define a boolean parameter.
   * @property {Boolean} default - Default value of the parameter.
   * @property {Boolean} [constant=false] - Define if the parameter is constant.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
  boolean: {
    definitionTemplate: ['default'],
    typeCheckFunction: function typeCheckFunction(value, definition, name) {
      if (typeof value !== 'boolean') throw new Error('Invalid value for boolean param "' + name + '": ' + value);

      return value;
    }
  },

  /**
   * @typedef {Object} integerDefinition
   * @property {String} [type='integer'] - Define a boolean parameter.
   * @property {Boolean} default - Default value of the parameter.
   * @property {Boolean} [min=-Infinity] - Minimum value of the parameter.
   * @property {Boolean} [max=+Infinity] - Maximum value of the parameter.
   * @property {Boolean} [constant=false] - Define if the parameter is constant.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
  integer: {
    definitionTemplate: ['default'],
    typeCheckFunction: function typeCheckFunction(value, definition, name) {
      if (!(typeof value === 'number' && Math.floor(value) === value)) throw new Error('Invalid value for integer param "' + name + '": ' + value);

      return clip(value, definition.min, definition.max);
    }
  },

  /**
   * @typedef {Object} floatDefinition
   * @property {String} [type='float'] - Define a boolean parameter.
   * @property {Boolean} default - Default value of the parameter.
   * @property {Boolean} [min=-Infinity] - Minimum value of the parameter.
   * @property {Boolean} [max=+Infinity] - Maximum value of the parameter.
   * @property {Boolean} [constant=false] - Define if the parameter is constant.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
  float: {
    definitionTemplate: ['default'],
    typeCheckFunction: function typeCheckFunction(value, definition, name) {
      if (typeof value !== 'number' || value !== value) // reject NaN
        throw new Error('Invalid value for float param "' + name + '": ' + value);

      return clip(value, definition.min, definition.max);
    }
  },

  /**
   * @typedef {Object} stringDefinition
   * @property {String} [type='string'] - Define a boolean parameter.
   * @property {Boolean} default - Default value of the parameter.
   * @property {Boolean} [constant=false] - Define if the parameter is constant.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
  string: {
    definitionTemplate: ['default'],
    typeCheckFunction: function typeCheckFunction(value, definition, name) {
      if (typeof value !== 'string') throw new Error('Invalid value for string param "' + name + '": ' + value);

      return value;
    }
  },

  /**
   * @typedef {Object} enumDefinition
   * @property {String} [type='enum'] - Define a boolean parameter.
   * @property {Boolean} default - Default value of the parameter.
   * @property {Array} list - Possible values of the parameter.
   * @property {Boolean} [constant=false] - Define if the parameter is constant.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
  enum: {
    definitionTemplate: ['default', 'list'],
    typeCheckFunction: function typeCheckFunction(value, definition, name) {
      if (definition.list.indexOf(value) === -1) throw new Error('Invalid value for enum param "' + name + '": ' + value);

      return value;
    }
  },

  /**
   * @typedef {Object} anyDefinition
   * @property {String} [type='enum'] - Define a parameter of any type.
   * @property {Boolean} default - Default value of the parameter.
   * @property {Boolean} [constant=false] - Define if the parameter is constant.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
  any: {
    definitionTemplate: ['default'],
    typeCheckFunction: function typeCheckFunction(value, definition, name) {
      // no check as it can have any type...
      return value;
    }
  }
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _paramTemplates = require('./paramTemplates');

var _paramTemplates2 = _interopRequireDefault(_paramTemplates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Generic class for typed parameters.
 *
 * @param {String} name - Name of the parameter.
 * @param {Array} definitionTemplate - List of mandatory keys in the param
 *  definition.
 * @param {Function} typeCheckFunction - Function to be used in order to check
 *  the value against the param definition.
 * @param {Object} definition - Definition of the parameter.
 * @param {Mixed} value - Value of the parameter.
 * @private
 */
var Param = function () {
  function Param(name, definitionTemplate, typeCheckFunction, definition, value) {
    _classCallCheck(this, Param);

    definitionTemplate.forEach(function (key) {
      if (definition.hasOwnProperty(key) === false) throw new Error('Invalid definition for param "' + name + '", ' + key + ' is not defined');
    });

    this.name = name;
    this.type = definition.type;
    this.definition = definition;

    if (this.definition.nullable === true && value === null) this.value = null;else this.value = typeCheckFunction(value, definition, name);
    this._typeCheckFunction = typeCheckFunction;
  }

  /**
   * Returns the current value.
   * @return {Mixed}
   */


  _createClass(Param, [{
    key: 'getValue',
    value: function getValue() {
      return this.value;
    }

    /**
     * Update the current value.
     * @param {Mixed} value - New value of the parameter.
     * @return {Boolean} - `true` if the param has been updated, false otherwise
     *  (e.g. if the parameter already had this value).
     */

  }, {
    key: 'setValue',
    value: function setValue(value) {
      if (this.definition.constant === true) throw new Error('Invalid assignement to constant param "' + this.name + '"');

      if (!(this.definition.nullable === true && value === null)) value = this._typeCheckFunction(value, this.definition, this.name);

      if (this.value !== value) {
        this.value = value;
        return true;
      }

      return false;
    }
  }]);

  return Param;
}();

/**
 * Bag of parameters. Main interface of the library
 */


var ParameterBag = function () {
  function ParameterBag(params, definitions) {
    _classCallCheck(this, ParameterBag);

    /**
     * List of parameters.
     *
     * @type {Object<String, Param>}
     * @name _params
     * @memberof ParameterBag
     * @instance
     * @private
     */
    this._params = params;

    /**
     * List of definitions with init values.
     *
     * @type {Object<String, paramDefinition>}
     * @name _definitions
     * @memberof ParameterBag
     * @instance
     * @private
     */
    this._definitions = definitions;

    /**
     * List of global listeners.
     *
     * @type {Set}
     * @name _globalListeners
     * @memberof ParameterBag
     * @instance
     * @private
     */
    this._globalListeners = new Set();

    /**
     * List of params listeners.
     *
     * @type {Object<String, Set>}
     * @name _paramsListeners
     * @memberof ParameterBag
     * @instance
     * @private
     */
    this._paramsListeners = {};

    // initialize empty Set for each param
    for (var name in params) {
      this._paramsListeners[name] = new Set();
    }
  }

  /**
   * Return the given definitions along with the initialization values.
   *
   * @return {Object}
   */


  _createClass(ParameterBag, [{
    key: 'getDefinitions',
    value: function getDefinitions() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (name !== null) return this._definitions[name];else return this._definitions;
    }

    /**
     * Return the value of the given parameter.
     *
     * @param {String} name - Name of the parameter.
     * @return {Mixed} - Value of the parameter.
     */

  }, {
    key: 'get',
    value: function get(name) {
      if (!this._params[name]) throw new Error('Cannot read property value of undefined parameter "' + name + '"');

      return this._params[name].value;
    }

    /**
     * Set the value of a parameter. If the value of the parameter is updated
     * (aka if previous value is different from new value) all registered
     * callbacks are registered.
     *
     * @param {String} name - Name of the parameter.
     * @param {Mixed} value - Value of the parameter.
     * @return {Mixed} - New value of the parameter.
     */

  }, {
    key: 'set',
    value: function set(name, value) {
      var param = this._params[name];
      var updated = param.setValue(value);
      value = param.getValue();

      if (updated) {
        var metas = param.definition.metas;
        // trigger global listeners
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this._globalListeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var listener = _step.value;

            listener(name, value, metas);
          } // trigger param listeners
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this._paramsListeners[name][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _listener = _step2.value;

            _listener(value, metas);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      return value;
    }

    /**
     * Define if the `name` parameter exists or not.
     *
     * @param {String} name - Name of the parameter.
     * @return {Boolean}
     */

  }, {
    key: 'has',
    value: function has(name) {
      return this._params[name] ? true : false;
    }

    /**
     * Reset a parameter to its init value. Reset all parameters if no argument.
     *
     * @param {String} [name=null] - Name of the parameter to reset.
     */

  }, {
    key: 'reset',
    value: function reset() {
      var _this = this;

      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (name !== null) this.set(name, param.definition.initValue);else Object.keys(this._params).forEach(function (name) {
        return _this.reset(name);
      });
    }

    /**
     * @callback ParameterBag~listenerCallback
     * @param {String} name - Parameter name.
     * @param {Mixed} value - Updated value of the parameter.
     * @param {Object} [meta=] - Given meta data of the parameter.
     */

    /**
     * Add listener to all param updates.
     *
     * @param {ParameterBag~listenerCallack} callback - Listener to register.
     */

  }, {
    key: 'addListener',
    value: function addListener(callback) {
      this._globalListeners.add(callback);
    }

    /**
     * Remove listener from all param changes.
     *
     * @param {ParameterBag~listenerCallack} callback - Listener to remove. If
     *  `null` remove all listeners.
     */

  }, {
    key: 'removeListener',
    value: function removeListener() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (callback === null) this._globalListeners.clear();else this._globalListeners.delete(callback);
    }

    /**
     * @callback ParameterBag~paramListenerCallack
     * @param {Mixed} value - Updated value of the parameter.
     * @param {Object} [meta=] - Given meta data of the parameter.
     */

    /**
     * Add listener to a given param updates.
     *
     * @param {String} name - Parameter name.
     * @param {ParameterBag~paramListenerCallack} callback - Function to apply
     *  when the value of the parameter changes.
     */

  }, {
    key: 'addParamListener',
    value: function addParamListener(name, callback) {
      this._paramsListeners[name].add(callback);
    }

    /**
     * Remove listener from a given param updates.
     *
     * @param {String} name - Parameter name.
     * @param {ParameterBag~paramListenerCallack} callback - Listener to remove.
     *  If `null` remove all listeners.
     */

  }, {
    key: 'removeParamListener',
    value: function removeParamListener(name) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (callback === null) this._paramsListeners[name].clear();else this._paramsListeners[name].delete(callback);
    }
  }]);

  return ParameterBag;
}();

/**
 * Factory for the `ParameterBag` class.
 *
 * @param {Object<String, paramDefinition>} definitions - Object describing the
 *  parameters.
 * @param {Object<String, Mixed>} values - Initialization values for the
 *  parameters.
 * @return {ParameterBag}
 */


function parameters(definitions) {
  var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var params = {};

  for (var name in values) {
    if (definitions.hasOwnProperty(name) === false) throw new Error('Unknown param "' + name + '"');
  }

  for (var _name in definitions) {
    if (params.hasOwnProperty(_name) === true) throw new Error('Parameter "' + _name + '" already defined');

    var definition = definitions[_name];

    if (!_paramTemplates2.default[definition.type]) throw new Error('Unknown param type "' + definition.type + '"');

    var _paramTemplates$defin = _paramTemplates2.default[definition.type],
        definitionTemplate = _paramTemplates$defin.definitionTemplate,
        typeCheckFunction = _paramTemplates$defin.typeCheckFunction;


    var value = void 0;

    if (values.hasOwnProperty(_name) === true) value = values[_name];else value = definition.default;

    // store init value in definition
    definition.initValue = value;

    if (!typeCheckFunction || !definitionTemplate) throw new Error('Invalid param type definition "' + definition.type + '"');

    params[_name] = new Param(_name, definitionTemplate, typeCheckFunction, definition, value);
  }

  return new ParameterBag(params, definitions);
}

/**
 * Register a new type for the `parameters` factory.
 * @param {String} typeName - Value that will be available as the `type` of a
 *  param definition.
 * @param {parameterDefinition} parameterDefinition - Object describing the
 *  parameter.
 */
parameters.defineType = function (typeName, parameterDefinition) {
  _paramTemplates2.default[typeName] = parameterDefinition;
};

exports.default = parameters;

},{"./paramTemplates":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sink = exports.source = exports.utils = exports.operator = exports.core = exports.version = undefined;

var _namespace = require('../common/operator/_namespace');

Object.defineProperty(exports, 'operator', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_namespace).default;
  }
});

var _namespace2 = require('./utils/_namespace');

Object.defineProperty(exports, 'utils', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_namespace2).default;
  }
});

var _namespace3 = require('./source/_namespace');

Object.defineProperty(exports, 'source', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_namespace3).default;
  }
});

var _namespace4 = require('./sink/_namespace');

Object.defineProperty(exports, 'sink', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_namespace4).default;
  }
});

var _core2 = require('../core');

var _core = _interopRequireWildcard(_core2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = exports.version = '1.0.0';

var core = exports.core = _core;

},{"../common/operator/_namespace":35,"../core":43,"./sink/_namespace":12,"./source/_namespace":15,"./utils/_namespace":17}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commonDefinitions = {
  min: {
    type: 'float',
    default: -1,
    metas: { kind: 'dynamic' }
  },
  max: {
    type: 'float',
    default: 1,
    metas: { kind: 'dynamic' }
  },
  width: {
    type: 'integer',
    default: 300,
    metas: { kind: 'dynamic' }
  },
  height: {
    type: 'integer',
    default: 150,
    metas: { kind: 'dynamic' }
  },
  container: {
    type: 'any',
    default: null,
    constant: true
  },
  canvas: {
    type: 'any',
    default: null,
    constant: true
  }
};

var hasDurationDefinitions = {
  duration: {
    type: 'float',
    min: 0,
    max: +Infinity,
    default: 1,
    metas: { kind: 'dynamic' }
  },
  referenceTime: {
    type: 'float',
    default: 0,
    constant: true
  }
};

/**
 * Base class to extend in order to create graphic sinks.
 *
 * <span class="warning">_This class should be considered abstract and only
 * be used to be extended._</span>
 *
 * @todo - fix float rounding errors (produce decays in sync draws)
 *
 * @memberof module:client.sink
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.min=-1] - Minimum value represented in the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.max=1] - Maximum value represented in the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.width=300] - Width of the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.height=150] - Height of the canvas.
 *  _dynamic parameter_
 * @param {Element|CSSSelector} [options.container=null] - Container element
 *  in which to insert the canvas. _constant parameter_
 * @param {Element|CSSSelector} [options.canvas=null] - Canvas element
 *  in which to draw. _constant parameter_
 * @param {Number} [options.duration=1] - Duration (in seconds) represented in
 *  the canvas. This parameter only exists for operators that display several
 *  consecutive frames on the canvas. _dynamic parameter_
 * @param {Number} [options.referenceTime=null] - Optionnal reference time the
 *  display should considerer as the origin. Is only usefull when synchronizing
 *  several display using the `DisplaySync` class. This parameter only exists
 *  for operators that display several consecutive frames on the canvas.
 */

var BaseDisplay = function (_BaseLfo) {
  (0, _inherits3.default)(BaseDisplay, _BaseLfo);

  function BaseDisplay(defs) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var hasDuration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    (0, _classCallCheck3.default)(this, BaseDisplay);

    var commonDefs = void 0;

    if (hasDuration) commonDefs = (0, _assign2.default)({}, commonDefinitions, hasDurationDefinitions);else commonDefs = commonDefinitions;

    var definitions = (0, _assign2.default)({}, commonDefs, defs);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BaseDisplay.__proto__ || (0, _getPrototypeOf2.default)(BaseDisplay)).call(this, definitions, options));

    if (_this.params.get('canvas') === null && _this.params.get('container') === null) throw new Error('Invalid parameter: `canvas` or `container` not defined');

    var canvasParam = _this.params.get('canvas');
    var containerParam = _this.params.get('container');

    // prepare canvas
    if (canvasParam) {
      if (typeof canvasParam === 'string') _this.canvas = document.querySelector(canvasParam);else _this.canvas = canvasParam;
    } else if (containerParam) {
      var container = void 0;

      if (typeof containerParam === 'string') container = document.querySelector(containerParam);else container = containerParam;

      _this.canvas = document.createElement('canvas');
      container.appendChild(_this.canvas);
    }

    _this.ctx = _this.canvas.getContext('2d');
    _this.cachedCanvas = document.createElement('canvas');
    _this.cachedCtx = _this.cachedCanvas.getContext('2d');

    _this.previousFrame = null;
    _this.currentTime = hasDuration ? _this.params.get('referenceTime') : null;

    /**
     * Instance of the `DisplaySync` used to synchronize the different displays
     * @private
     */
    _this.displaySync = false;

    //
    _this._stack;
    _this._rafId;

    _this.renderStack = _this.renderStack.bind(_this);
    _this.shiftError = 0;

    // initialize canvas size and y scale transfert function
    _this._resize();
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(BaseDisplay, [{
    key: '_resize',
    value: function _resize() {
      var width = this.params.get('width');
      var height = this.params.get('height');

      var ctx = this.ctx;
      var cachedCtx = this.cachedCtx;

      var dPR = window.devicePixelRatio || 1;
      var bPR = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;

      this.pixelRatio = dPR / bPR;

      var lastWidth = this.canvasWidth;
      var lastHeight = this.canvasHeight;
      this.canvasWidth = width * this.pixelRatio;
      this.canvasHeight = height * this.pixelRatio;

      cachedCtx.canvas.width = this.canvasWidth;
      cachedCtx.canvas.height = this.canvasHeight;

      // copy current image from ctx (resize)
      if (lastWidth && lastHeight) {
        cachedCtx.drawImage(ctx.canvas, 0, 0, lastWidth, lastHeight, 0, 0, this.canvasWidth, this.canvasHeight);
      }

      ctx.canvas.width = this.canvasWidth;
      ctx.canvas.height = this.canvasHeight;
      ctx.canvas.style.width = width + 'px';
      ctx.canvas.style.height = height + 'px';

      // update scale
      this._setYScale();
    }

    /**
     * Create the transfert function used to map values to pixel in the y axis
     * @private
     */

  }, {
    key: '_setYScale',
    value: function _setYScale() {
      var min = this.params.get('min');
      var max = this.params.get('max');
      var height = this.canvasHeight;

      var a = (0 - height) / (max - min);
      var b = height - a * min;

      this.getYPosition = function (x) {
        return a * x + b;
      };
    }

    /**
     * Returns the width in pixel a `vector` frame needs to be drawn.
     * @private
     */

  }, {
    key: 'getMinimumFrameWidth',
    value: function getMinimumFrameWidth() {
      return 1; // need one pixel to draw the line
    }

    /**
     * Callback function executed when a parameter is updated.
     *
     * @param {String} name - Parameter name.
     * @param {Mixed} value - Parameter value.
     * @param {Object} metas - Metadatas of the parameter.
     * @private
     */

  }, {
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      (0, _get3.default)(BaseDisplay.prototype.__proto__ || (0, _getPrototypeOf2.default)(BaseDisplay.prototype), 'onParamUpdate', this).call(this, name, value, metas);

      switch (name) {
        case 'min':
        case 'max':
          // @todo - make sure that min and max are different
          this._setYScale();
          break;
        case 'width':
        case 'height':
          this._resize();
      }
    }

    /** @private */

  }, {
    key: 'propagateStreamParams',
    value: function propagateStreamParams() {
      (0, _get3.default)(BaseDisplay.prototype.__proto__ || (0, _getPrototypeOf2.default)(BaseDisplay.prototype), 'propagateStreamParams', this).call(this);

      this._stack = [];
      this._rafId = requestAnimationFrame(this.renderStack);
    }

    /** @private */

  }, {
    key: 'resetStream',
    value: function resetStream() {
      (0, _get3.default)(BaseDisplay.prototype.__proto__ || (0, _getPrototypeOf2.default)(BaseDisplay.prototype), 'resetStream', this).call(this);

      var width = this.canvasWidth;
      var height = this.canvasHeight;

      this.ctx.clearRect(0, 0, width, height);
      this.cachedCtx.clearRect(0, 0, width, height);
    }

    /** @private */

  }, {
    key: 'finalizeStream',
    value: function finalizeStream(endTime) {
      this.currentTime = null;
      (0, _get3.default)(BaseDisplay.prototype.__proto__ || (0, _getPrototypeOf2.default)(BaseDisplay.prototype), 'finalizeStream', this).call(this, endTime);
      cancelAnimationFrame(this._rafId);
    }

    /**
     * Add the current frame to the frames to draw. Should not be overriden.
     * @private
     */

  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      var frameSize = this.streamParams.frameSize;
      var copy = new Float32Array(frameSize);
      var data = frame.data;

      // copy values of the input frame as they might be updated
      // in reference before being consumed in the draw function
      for (var i = 0; i < frameSize; i++) {
        copy[i] = data[i];
      }this._stack.push({
        time: frame.time,
        data: copy,
        metadata: frame.metadata
      });
    }

    /**
     * Render the accumulated frames. Method called in `requestAnimationFrame`.
     * @private
     */

  }, {
    key: 'renderStack',
    value: function renderStack() {
      if (this.params.has('duration')) {
        // render all frame since last `renderStack` call
        for (var i = 0, l = this._stack.length; i < l; i++) {
          this.scrollModeDraw(this._stack[i]);
        }
      } else {
        // only render last received frame if any
        if (this._stack.length > 0) {
          var frame = this._stack[this._stack.length - 1];
          this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
          this.processFunction(frame);
        }
      }

      // reinit stack for next call
      this._stack.length = 0;
      this._rafId = requestAnimationFrame(this.renderStack);
    }

    /**
     * Draw data from right to left with scrolling
     * @private
     * @todo - check possibility of maintaining all values from one place to
     *         minimize float error tracking.
     */

  }, {
    key: 'scrollModeDraw',
    value: function scrollModeDraw(frame) {
      var frameType = this.streamParams.frameType;
      var frameRate = this.streamParams.frameRate;
      var frameSize = this.streamParams.frameSize;
      var sourceSampleRate = this.streamParams.sourceSampleRate;

      var canvasDuration = this.params.get('duration');
      var ctx = this.ctx;
      var canvasWidth = this.canvasWidth;
      var canvasHeight = this.canvasHeight;

      var previousFrame = this.previousFrame;

      // current time at the left of the canvas
      var currentTime = this.currentTime !== null ? this.currentTime : frame.time;
      var frameStartTime = frame.time;
      var lastFrameTime = previousFrame ? previousFrame.time : 0;
      var lastFrameDuration = this.lastFrameDuration ? this.lastFrameDuration : 0;

      var frameDuration = void 0;

      if (frameType === 'scalar' || frameType === 'vector') {
        var pixelDuration = canvasDuration / canvasWidth;
        frameDuration = this.getMinimumFrameWidth() * pixelDuration;
      } else if (this.streamParams.frameType === 'signal') {
        frameDuration = frameSize / sourceSampleRate;
      }

      var frameEndTime = frameStartTime + frameDuration;
      // define if we need to shift the canvas
      var shiftTime = frameEndTime - currentTime;

      // if the canvas is not synced, should never go to `else`
      if (shiftTime > 0) {
        // shift the canvas of shiftTime in pixels
        var fShift = shiftTime / canvasDuration * canvasWidth - this.shiftError;
        var iShift = Math.floor(fShift + 0.5);
        this.shiftError = fShift - iShift;

        var _currentTime = frameStartTime + frameDuration;
        this.shiftCanvas(iShift, _currentTime);

        // if siblings, share the information
        if (this.displaySync) this.displaySync.shiftSiblings(iShift, _currentTime, this);
      }

      // width of the frame in pixels
      var fFrameWidth = frameDuration / canvasDuration * canvasWidth;
      var frameWidth = Math.floor(fFrameWidth + 0.5);

      // define position of the head in the canvas
      var canvasStartTime = this.currentTime - canvasDuration;
      var startTimeRatio = (frameStartTime - canvasStartTime) / canvasDuration;
      var startTimePosition = startTimeRatio * canvasWidth;

      // number of pixels since last frame
      var pixelsSinceLastFrame = this.lastFrameWidth;

      if ((frameType === 'scalar' || frameType === 'vector') && previousFrame) {
        var frameInterval = frame.time - previousFrame.time;
        pixelsSinceLastFrame = frameInterval / canvasDuration * canvasWidth;
      }

      // draw current frame
      ctx.save();
      ctx.translate(startTimePosition, 0);
      this.processFunction(frame, frameWidth, pixelsSinceLastFrame);
      ctx.restore();

      // save current canvas state into cached canvas
      this.cachedCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      this.cachedCtx.drawImage(this.canvas, 0, 0, canvasWidth, canvasHeight);

      // update lastFrameDuration, lastFrameWidth
      this.lastFrameDuration = frameDuration;
      this.lastFrameWidth = frameWidth;
      this.previousFrame = frame;
    }

    /**
     * Shift canvas, also called from `DisplaySync`
     * @private
     */

  }, {
    key: 'shiftCanvas',
    value: function shiftCanvas(iShift, time) {
      var ctx = this.ctx;
      var cache = this.cachedCanvas;
      var cachedCtx = this.cachedCtx;
      var width = this.canvasWidth;
      var height = this.canvasHeight;
      var croppedWidth = width - iShift;
      this.currentTime = time;

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(cache, iShift, 0, croppedWidth, height, 0, 0, croppedWidth, height);
      // save current canvas state into cached canvas
      cachedCtx.clearRect(0, 0, width, height);
      cachedCtx.drawImage(this.canvas, 0, 0, width, height);
    }

    // @todo - Fix trigger mode
    // allow to witch easily between the 2 modes
    // setTrigger(bool) {
    //   this.params.trigger = bool;
    //   // clear canvas and cache
    //   this.ctx.clearRect(0, 0, this.params.width, this.params.height);
    //   this.cachedCtx.clearRect(0, 0, this.params.width, this.params.height);
    //   // reset _currentXPosition
    //   this._currentXPosition = 0;
    //   this.lastShiftError = 0;
    // }

    // /**
    //  * Alternative drawing mode.
    //  * Draw from left to right, go back to left when > width
    //  */
    // triggerModeDraw(time, frame) {
    //   const width  = this.params.width;
    //   const height = this.params.height;
    //   const duration = this.params.duration;
    //   const ctx = this.ctx;

    //   const dt = time - this.previousTime;
    //   const fShift = (dt / duration) * width - this.lastShiftError; // px
    //   const iShift = Math.round(fShift);
    //   this.lastShiftError = iShift - fShift;

    //   this.currentXPosition += iShift;

    //   // draw the right part
    //   ctx.save();
    //   ctx.translate(this.currentXPosition, 0);
    //   ctx.clearRect(-iShift, 0, iShift, height);
    //   this.drawCurve(frame, iShift);
    //   ctx.restore();

    //   // go back to the left of the canvas and redraw the same thing
    //   if (this.currentXPosition > width) {
    //     // go back to start
    //     this.currentXPosition -= width;

    //     ctx.save();
    //     ctx.translate(this.currentXPosition, 0);
    //     ctx.clearRect(-iShift, 0, iShift, height);
    //     this.drawCurve(frame, this.previousFrame, iShift);
    //     ctx.restore();
    //   }
    // }

  }]);
  return BaseDisplay;
}(_BaseLfo3.default);

exports.default = BaseDisplay;

},{"../../core/BaseLfo":42,"babel-runtime/core-js/object/assign":48,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/get":59,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseDisplay2 = require('./BaseDisplay');

var _BaseDisplay3 = _interopRequireDefault(_BaseDisplay2);

var _displayUtils = require('../utils/display-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  radius: {
    type: 'float',
    min: 0,
    default: 0,
    metas: { kind: 'dynamic' }
  },
  line: {
    type: 'boolean',
    default: true,
    metas: { kind: 'dynamic' }
  },
  colors: {
    type: 'any',
    default: null
  }
};

/**
 * Breakpoint Function, display a stream of type `vector`.
 *
 * @memberof module:client.sink
 *
 * @param {Object} options - Override default parameters.
 * @param {String} [options.colors=null] - Array of colors for each index of the
 *  vector. _dynamic parameter_
 * @param {String} [options.radius=0] - Radius of the dot at each value.
 *  _dynamic parameter_
 * @param {String} [options.line=true] - Display a line between each consecutive
 *  values of the vector. _dynamic parameter_
 * @param {Number} [options.min=-1] - Minimum value represented in the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.max=1] - Maximum value represented in the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.width=300] - Width of the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.height=150] - Height of the canvas.
 *  _dynamic parameter_
 * @param {Element|CSSSelector} [options.container=null] - Container element
 *  in which to insert the canvas. _constant parameter_
 * @param {Element|CSSSelector} [options.canvas=null] - Canvas element
 *  in which to draw. _constant parameter_
 * @param {Number} [options.duration=1] - Duration (in seconds) represented in
 *  the canvas. _dynamic parameter_
 * @param {Number} [options.referenceTime=null] - Optionnal reference time the
 *  display should considerer as the origin. Is only usefull when synchronizing
 *  several display using the `DisplaySync` class.
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameSize: 2,
 *   frameRate: 0.1,
 *   frameType: 'vector'
 * });
 *
 * const bpf = new lfo.sink.BpfDisplay({
 *   canvas: '#bpf',
 *   duration: 10,
 * });
 *
 * eventIn.connect(bpf);
 * eventIn.start();
 *
 * let time = 0;
 * const dt = 0.1;
 *
 * (function generateData() {
 *   eventIn.process(time, [Math.random() * 2 - 1, Math.random() * 2 - 1]);
 *   time += dt;
 *
 *   setTimeout(generateData, dt * 1000);
 * }());
 */

var BpfDisplay = function (_BaseDisplay) {
  (0, _inherits3.default)(BpfDisplay, _BaseDisplay);

  function BpfDisplay(options) {
    (0, _classCallCheck3.default)(this, BpfDisplay);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BpfDisplay.__proto__ || (0, _getPrototypeOf2.default)(BpfDisplay)).call(this, definitions, options));

    _this.prevFrame = null;
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(BpfDisplay, [{
    key: 'getMinimumFrameWidth',
    value: function getMinimumFrameWidth() {
      return this.params.get('radius');
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      if (this.params.get('colors') === null) this.params.set('colors', (0, _displayUtils.getColors)('bpf', this.streamParams.frameSize));

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame, frameWidth, pixelsSinceLastFrame) {
      var colors = this.params.get('colors');
      var radius = this.params.get('radius');
      var drawLine = this.params.get('line');
      var frameSize = this.streamParams.frameSize;
      var ctx = this.ctx;
      var data = frame.data;
      var prevData = this.prevFrame ? this.prevFrame.data : null;

      ctx.save();

      for (var i = 0, l = frameSize; i < l; i++) {
        var posY = this.getYPosition(data[i]);
        var color = colors[i];

        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        if (prevData && drawLine) {
          var lastPosY = this.getYPosition(prevData[i]);
          ctx.beginPath();
          ctx.moveTo(-pixelsSinceLastFrame, lastPosY);
          ctx.lineTo(0, posY);
          ctx.stroke();
          ctx.closePath();
        }

        if (radius > 0) {
          ctx.beginPath();
          ctx.arc(0, posY, radius, 0, Math.PI * 2, false);
          ctx.fill();
          ctx.closePath();
        }
      }

      ctx.restore();

      this.prevFrame = frame;
    }
  }]);
  return BpfDisplay;
}(_BaseDisplay3.default);

exports.default = BpfDisplay;

},{"../utils/display-utils":18,"./BaseDisplay":4,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseDisplay2 = require('./BaseDisplay');

var _BaseDisplay3 = _interopRequireDefault(_BaseDisplay2);

var _displayUtils = require('../utils/display-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  threshold: {
    type: 'float',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' }
  },
  thresholdIndex: {
    type: 'integer',
    default: 0,
    metas: { kind: 'dynamic' }
  },
  color: {
    type: 'string',
    default: (0, _displayUtils.getColors)('marker'),
    nullable: true,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Display a marker according to a `vector` input frame.
 *
 * @memberof module:client.sink
 *
 * @param {Object} options - Override default parameters.
 * @param {String} options.color - Color of the marker.
 * @param {Number} [options.thresholdIndex=0] - Index of the incomming frame
 *  data to compare against the threshold. _Should be used in conjonction with
 *  `threshold`_.
 * @param {Number} [options.threshold=null] - Minimum value the incomming value
 *  must have to trigger the display of a marker. If null each incomming event
 *  triggers a marker. _Should be used in conjonction with `thresholdIndex`_.
 * @param {Number} [options.width=300] - Width of the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.height=150] - Height of the canvas.
 *  _dynamic parameter_
 * @param {Element|CSSSelector} [options.container=null] - Container element
 *  in which to insert the canvas. _constant parameter_
 * @param {Element|CSSSelector} [options.canvas=null] - Canvas element
 *  in which to draw. _constant parameter_
 * @param {Number} [options.duration=1] - Duration (in seconds) represented in
 *  the canvas. This parameter only exists for operators that display several
 *  consecutive frames on the canvas. _dynamic parameter_
 * @param {Number} [options.referenceTime=null] - Optionnal reference time the
 *  display should considerer as the origin. Is only usefull when synchronizing
 *  several display using the `DisplaySync` class. This parameter only exists
 *  for operators that display several consecutive frames on the canvas.
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameType: 'scalar',
 * });
 *
 * const marker = new lfo.sink.MarkerDisplay({
 *   canvas: '#marker',
 *   threshold: 0.5,
 * });
 *
 * eventIn.connect(marker);
 * eventIn.start();
 *
 * let time = 0;
 * const period = 1;
 *
 * (function generateData() {
 *   eventIn.process(time, Math.random());
 *
 *   time += period;
 *   setTimeout(generateData, period * 1000);
 * }());
 */

var MarkerDisplay = function (_BaseDisplay) {
  (0, _inherits3.default)(MarkerDisplay, _BaseDisplay);

  function MarkerDisplay() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, MarkerDisplay);
    return (0, _possibleConstructorReturn3.default)(this, (MarkerDisplay.__proto__ || (0, _getPrototypeOf2.default)(MarkerDisplay)).call(this, definitions, options));
  }

  /** @private */


  (0, _createClass3.default)(MarkerDisplay, [{
    key: 'processVector',
    value: function processVector(frame, frameWidth, pixelsSinceLastFrame) {
      var color = this.params.get('color');
      var threshold = this.params.get('threshold');
      var thresholdIndex = this.params.get('thresholdIndex');
      var ctx = this.ctx;
      var height = ctx.height;
      var value = frame.data[thresholdIndex];

      if (threshold === null || value >= threshold) {
        var yMin = this.getYPosition(this.params.get('min'));
        var yMax = this.getYPosition(this.params.get('max'));

        if (yMin > yMax) {
          var v = yMax;
          yMax = yMin;
          yMin = v;
        }

        ctx.save();
        ctx.fillStyle = color;
        ctx.fillRect(0, yMin, 1, yMax);
        ctx.restore();
      }
    }
  }]);
  return MarkerDisplay;
}(_BaseDisplay3.default);

exports.default = MarkerDisplay;

},{"../utils/display-utils":18,"./BaseDisplay":4,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseDisplay2 = require('./BaseDisplay');

var _BaseDisplay3 = _interopRequireDefault(_BaseDisplay2);

var _displayUtils = require('../utils/display-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var floor = Math.floor;
var ceil = Math.ceil;

function downSample(data, targetLength) {
  var length = data.length;
  var hop = length / targetLength;
  var target = new Float32Array(targetLength);
  var counter = 0;

  for (var i = 0; i < targetLength; i++) {
    var index = floor(counter);
    var phase = counter - index;
    var prev = data[index];
    var next = data[index + 1];

    target[i] = (next - prev) * phase + prev;
    counter += hop;
  }

  return target;
}

var definitions = {
  color: {
    type: 'string',
    default: (0, _displayUtils.getColors)('signal'),
    nullable: true
  }
};

/**
 * Display a stream of type `signal` on a canvas.
 *
 * @param {Object} options - Override default parameters.
 * @param {String} [options.color='#00e600'] - Color of the signal.
 * @param {Number} [options.min=-1] - Minimum value represented in the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.max=1] - Maximum value represented in the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.width=300] - Width of the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.height=150] - Height of the canvas.
 *  _dynamic parameter_
 * @param {Element|CSSSelector} [options.container=null] - Container element
 *  in which to insert the canvas. _constant parameter_
 * @param {Element|CSSSelector} [options.canvas=null] - Canvas element
 *  in which to draw. _constant parameter_
 * @param {Number} [options.duration=1] - Duration (in seconds) represented in
 *  the canvas. This parameter only exists for operators that display several
 *  consecutive frames on the canvas. _dynamic parameter_
 * @param {Number} [options.referenceTime=null] - Optionnal reference time the
 *  display should considerer as the origin. Is only usefull when synchronizing
 *  several display using the `DisplaySync` class. This parameter only exists
 *  for operators that display several consecutive frames on the canvas.
 *
 * @memberof module:client.sink
 *
 * @example
 * const eventIn = new lfo.source.EventIn({
 *   frameType: 'signal',
 *   sampleRate: 8,
 *   frameSize: 4,
 * });
 *
 * const signalDisplay = new lfo.sink.SignalDisplay({
 *   canvas: '#signal-canvas',
 * });
 *
 * eventIn.connect(signalDisplay);
 * eventIn.start();
 *
 * // push triangle signal in the graph
 * eventIn.process(0, [0, 0.5, 1, 0.5]);
 * eventIn.process(0.5, [0, -0.5, -1, -0.5]);
 * // ...
 */

var SignalDisplay = function (_BaseDisplay) {
  (0, _inherits3.default)(SignalDisplay, _BaseDisplay);

  function SignalDisplay(options) {
    (0, _classCallCheck3.default)(this, SignalDisplay);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SignalDisplay.__proto__ || (0, _getPrototypeOf2.default)(SignalDisplay)).call(this, definitions, options, true));

    _this.lastPosY = null;
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(SignalDisplay, [{
    key: 'processSignal',
    value: function processSignal(frame, frameWidth, pixelsSinceLastFrame) {
      var color = this.params.get('color');
      var frameSize = this.streamParams.frameSize;
      var ctx = this.ctx;
      var data = frame.data;

      if (frameWidth < frameSize) data = downSample(data, frameWidth);

      var length = data.length;
      var hopX = frameWidth / length;
      var posX = 0;
      var lastY = this.lastPosY;

      ctx.strokeStyle = color;
      ctx.beginPath();

      for (var i = 0; i < data.length; i++) {
        var posY = this.getYPosition(data[i]);

        if (lastY === null) {
          ctx.moveTo(posX, posY);
        } else {
          if (i === 0) ctx.moveTo(-hopX, lastY);

          ctx.lineTo(posX, posY);
        }

        posX += hopX;
        lastY = posY;
      }

      ctx.stroke();
      ctx.closePath();

      this.lastPosY = lastY;
    }
  }]);
  return SignalDisplay;
}(_BaseDisplay3.default);

exports.default = SignalDisplay;

},{"../utils/display-utils":18,"./BaseDisplay":4,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _log = require('babel-runtime/core-js/math/log10');

var _log2 = _interopRequireDefault(_log);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseDisplay2 = require('./BaseDisplay');

var _BaseDisplay3 = _interopRequireDefault(_BaseDisplay2);

var _Fft = require('../../common/operator/Fft');

var _Fft2 = _interopRequireDefault(_Fft);

var _displayUtils = require('../utils/display-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  scale: {
    type: 'float',
    default: 1,
    metas: { kind: 'dynamic' }
  },
  color: {
    type: 'string',
    default: (0, _displayUtils.getColors)('spectrum'),
    nullable: true,
    metas: { kind: 'dynamic' }
  },
  min: {
    type: 'float',
    default: -80,
    metas: { kind: 'dynamic' }
  },
  max: {
    type: 'float',
    default: 6,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Display the spectrum of the incomming `signal` input.
 *
 * @memberof module:client.sink
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.scale=1] - Scale display of the spectrogram.
 * @param {String} [options.color=null] - Color of the spectrogram.
 * @param {Number} [options.min=-80] - Minimum displayed value (in dB).
 * @param {Number} [options.max=6] - Maximum displayed value (in dB).
 * @param {Number} [options.width=300] - Width of the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.height=150] - Height of the canvas.
 *  _dynamic parameter_
 * @param {Element|CSSSelector} [options.container=null] - Container element
 *  in which to insert the canvas. _constant parameter_
 * @param {Element|CSSSelector} [options.canvas=null] - Canvas element
 *  in which to draw. _constant parameter_
 *
 * @todo - expose more `fft` config options
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const audioContext = new AudioContext();
 *
 * navigator.mediaDevices
 *   .getUserMedia({ audio: true })
 *   .then(init)
 *   .catch((err) => console.error(err.stack));
 *
 * function init(stream) {
 *   const source = audioContext.createMediaStreamSource(stream);
 *
 *   const audioInNode = new lfo.source.AudioInNode({
 *     audioContext: audioContext,
 *     sourceNode: source,
 *   });
 *
 *   const spectrum = new lfo.sink.SpectrumDisplay({
 *     canvas: '#spectrum',
 *   });
 *
 *   audioInNode.connect(spectrum);
 *   audioInNode.start();
 * }
 */

var SpectrumDisplay = function (_BaseDisplay) {
  (0, _inherits3.default)(SpectrumDisplay, _BaseDisplay);

  function SpectrumDisplay() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, SpectrumDisplay);
    return (0, _possibleConstructorReturn3.default)(this, (SpectrumDisplay.__proto__ || (0, _getPrototypeOf2.default)(SpectrumDisplay)).call(this, definitions, options, false));
  }

  /** @private */


  (0, _createClass3.default)(SpectrumDisplay, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      this.fft = new _Fft2.default({
        size: this.streamParams.frameSize,
        window: 'hann',
        norm: 'linear'
      });

      this.fft.initStream(this.streamParams);

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      var bins = this.fft.inputSignal(frame.data);
      var nbrBins = bins.length;

      var width = this.canvasWidth;
      var height = this.canvasHeight;
      var scale = this.params.get('scale');

      var binWidth = width / nbrBins;
      var ctx = this.ctx;

      ctx.fillStyle = this.params.get('color');

      // error handling needs review...
      var error = 0;

      for (var i = 0; i < nbrBins; i++) {
        var x1Float = i * binWidth + error;
        var x1Int = Math.round(x1Float);
        var x2Float = x1Float + (binWidth - error);
        var x2Int = Math.round(x2Float);

        error = x2Int - x2Float;

        if (x1Int !== x2Int) {
          var _width = x2Int - x1Int;
          var db = 20 * (0, _log2.default)(bins[i]);
          var y = this.getYPosition(db * scale);
          ctx.fillRect(x1Int, y, _width, height - y);
        } else {
          error -= binWidth;
        }
      }
    }
  }]);
  return SpectrumDisplay;
}(_BaseDisplay3.default);

exports.default = SpectrumDisplay;

},{"../../common/operator/Fft":21,"../utils/display-utils":18,"./BaseDisplay":4,"babel-runtime/core-js/math/log10":46,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseDisplay2 = require('./BaseDisplay');

var _BaseDisplay3 = _interopRequireDefault(_BaseDisplay2);

var _displayUtils = require('../utils/display-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  color: {
    type: 'string',
    default: (0, _displayUtils.getColors)('trace'),
    metas: { kind: 'dynamic' }
  },
  colorScheme: {
    type: 'enum',
    default: 'none',
    list: ['none', 'hue', 'opacity']
  }
};

/**
 * Display a range value around a mean value (for example mean
 * and standart deviation).
 *
 * This sink can handle input of type `vector` of frameSize >= 2.
 *
 * @param {Object} options - Override default parameters.
 * @param {String} [options.color='orange'] - Color.
 * @param {String} [options.colorScheme='none'] - If a third value is available
 *  in the input, can be used to control the opacity or the hue. If input frame
 *  size is 2, this param is automatically set to `none`
 * @param {Number} [options.min=-1] - Minimum value represented in the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.max=1] - Maximum value represented in the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.width=300] - Width of the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.height=150] - Height of the canvas.
 *  _dynamic parameter_
 * @param {Element|CSSSelector} [options.container=null] - Container element
 *  in which to insert the canvas. _constant parameter_
 * @param {Element|CSSSelector} [options.canvas=null] - Canvas element
 *  in which to draw. _constant parameter_
 * @param {Number} [options.duration=1] - Duration (in seconds) represented in
 *  the canvas. _dynamic parameter_
 * @param {Number} [options.referenceTime=null] - Optionnal reference time the
 *  display should considerer as the origin. Is only usefull when synchronizing
 *  several display using the `DisplaySync` class.
 *
 * @memberof module:client.sink
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const AudioContext = (window.AudioContext || window.webkitAudioContext);
 * const audioContext = new AudioContext();
 *
 * navigator.mediaDevices
 *   .getUserMedia({ audio: true })
 *   .then(init)
 *   .catch((err) => console.error(err.stack));
 *
 * function init(stream) {
 *   const source = audioContext.createMediaStreamSource(stream);
 *
 *   const audioInNode = new lfo.source.AudioInNode({
 *     sourceNode: source,
 *     audioContext: audioContext,
 *   });
 *
 *   // not sure it make sens but...
 *   const meanStddev = new lfo.operator.MeanStddev();
 *
 *   const traceDisplay = new lfo.sink.TraceDisplay({
 *     canvas: '#trace',
 *   });
 *
 *   const logger = new lfo.sink.Logger({ data: true });
 *
 *   audioInNode.connect(meanStddev);
 *   meanStddev.connect(traceDisplay);
 *
 *   audioInNode.start();
 * }
 */

var TraceDisplay = function (_BaseDisplay) {
  (0, _inherits3.default)(TraceDisplay, _BaseDisplay);

  function TraceDisplay() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, TraceDisplay);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TraceDisplay.__proto__ || (0, _getPrototypeOf2.default)(TraceDisplay)).call(this, definitions, options));

    _this.prevFrame = null;
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(TraceDisplay, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      if (this.streamParams.frameSize === 2) this.params.set('colorScheme', 'none');

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame, frameWidth, pixelsSinceLastFrame) {
      var colorScheme = this.params.get('colorScheme');
      var ctx = this.ctx;
      var prevData = this.prevFrame ? this.prevFrame.data : null;
      var data = frame.data;

      var halfRange = data[1] / 2;
      var mean = this.getYPosition(data[0]);
      var min = this.getYPosition(data[0] - halfRange);
      var max = this.getYPosition(data[0] + halfRange);

      var prevHalfRange = void 0;
      var prevMean = void 0;
      var prevMin = void 0;
      var prevMax = void 0;

      if (prevData !== null) {
        prevHalfRange = prevData[1] / 2;
        prevMean = this.getYPosition(prevData[0]);
        prevMin = this.getYPosition(prevData[0] - prevHalfRange);
        prevMax = this.getYPosition(prevData[0] + prevHalfRange);
      }

      var color = this.params.get('color');
      var gradient = void 0;
      var rgb = void 0;

      switch (colorScheme) {
        case 'none':
          rgb = (0, _displayUtils.hexToRGB)(color);
          ctx.fillStyle = 'rgba(' + rgb.join(',') + ', 0.7)';
          ctx.strokeStyle = color;
          break;
        case 'hue':
          gradient = ctx.createLinearGradient(-pixelsSinceLastFrame, 0, 0, 0);

          if (prevData) gradient.addColorStop(0, 'hsl(' + (0, _displayUtils.getHue)(prevData[2]) + ', 100%, 50%)');else gradient.addColorStop(0, 'hsl(' + (0, _displayUtils.getHue)(data[2]) + ', 100%, 50%)');

          gradient.addColorStop(1, 'hsl(' + (0, _displayUtils.getHue)(data[2]) + ', 100%, 50%)');
          ctx.fillStyle = gradient;
          break;
        case 'opacity':
          rgb = (0, _displayUtils.hexToRGB)(this.params.get('color'));
          gradient = ctx.createLinearGradient(-pixelsSinceLastFrame, 0, 0, 0);

          if (prevData) gradient.addColorStop(0, 'rgba(' + rgb.join(',') + ', ' + prevData[2] + ')');else gradient.addColorStop(0, 'rgba(' + rgb.join(',') + ', ' + data[2] + ')');

          gradient.addColorStop(1, 'rgba(' + rgb.join(',') + ', ' + data[2] + ')');
          ctx.fillStyle = gradient;
          break;
      }

      ctx.save();
      // draw range
      ctx.beginPath();
      ctx.moveTo(0, mean);
      ctx.lineTo(0, max);

      if (prevData !== null) {
        ctx.lineTo(-pixelsSinceLastFrame, prevMax);
        ctx.lineTo(-pixelsSinceLastFrame, prevMin);
      }

      ctx.lineTo(0, min);
      ctx.closePath();

      ctx.fill();

      // draw mean
      if (colorScheme === 'none' && prevMean) {
        ctx.beginPath();
        ctx.moveTo(-pixelsSinceLastFrame, prevMean);
        ctx.lineTo(0, mean);
        ctx.closePath();
        ctx.stroke();
      }

      ctx.restore();

      this.prevFrame = frame;
    }
  }]);
  return TraceDisplay;
}(_BaseDisplay3.default);

;

exports.default = TraceDisplay;

},{"../utils/display-utils":18,"./BaseDisplay":4,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _log = require('babel-runtime/core-js/math/log10');

var _log2 = _interopRequireDefault(_log);

var _BaseDisplay2 = require('./BaseDisplay');

var _BaseDisplay3 = _interopRequireDefault(_BaseDisplay2);

var _Rms = require('../../common/operator/Rms');

var _Rms2 = _interopRequireDefault(_Rms);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log10 = _log2.default;

var definitions = {
  offset: {
    type: 'float',
    default: -14,
    metas: { kind: 'dyanmic' }
  },
  min: {
    type: 'float',
    default: -80,
    metas: { kind: 'dynamic' }
  },
  max: {
    type: 'float',
    default: 6,
    metas: { kind: 'dynamic' }
  },
  width: {
    type: 'integer',
    default: 6,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Simple VU-Meter to used on a `signal` stream.
 *
 * @memberof module:client.sink
 *
 * @param {Object} options - Override defaults parameters.
 * @param {Number} [options.offset=-14] - dB offset applied to the signal.
 * @param {Number} [options.min=-80] - Minimum displayed value (in dB).
 * @param {Number} [options.max=6] - Maximum displayed value (in dB).
 * @param {Number} [options.width=6] - Width of the display (in pixels).
 * @param {Number} [options.height=150] - Height of the canvas.
 * @param {Element|CSSSelector} [options.container=null] - Container element
 *  in which to insert the canvas.
 * @param {Element|CSSSelector} [options.canvas=null] - Canvas element
 *  in which to draw.
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const audioContext = new window.AudioContext();
 *
 * navigator.mediaDevices
 *   .getUserMedia({ audio: true })
 *   .then(init)
 *   .catch((err) => console.error(err.stack));
 *
 * function init(stream) {
 *   const source = audioContext.createMediaStreamSource(stream);
 *
 *   const audioInNode = new lfo.source.AudioInNode({
 *     audioContext: audioContext,
 *     sourceNode: source,
 *   });
 *
 *   const vuMeter = new lfo.sink.VuMeterDisplay({
 *     canvas: '#vu-meter',
 *   });
 *
 *   audioInNode.connect(vuMeter);
 *   audioInNode.start();
 * }
 */

var VuMeterDisplay = function (_BaseDisplay) {
  (0, _inherits3.default)(VuMeterDisplay, _BaseDisplay);

  function VuMeterDisplay() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, VuMeterDisplay);

    var _this = (0, _possibleConstructorReturn3.default)(this, (VuMeterDisplay.__proto__ || (0, _getPrototypeOf2.default)(VuMeterDisplay)).call(this, definitions, options, false));

    _this.rmsOperator = new _Rms2.default();

    _this.lastDB = 0;
    _this.peak = {
      value: 0,
      time: 0
    };

    _this.peakLifetime = 1; // sec
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(VuMeterDisplay, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      this.rmsOperator.initStream(this.streamParams);

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      var now = new Date().getTime() / 1000; // sec
      var offset = this.params.get('offset'); // offset zero of the vu meter
      var height = this.canvasHeight;
      var width = this.canvasWidth;
      var ctx = this.ctx;

      var lastDB = this.lastDB;
      var peak = this.peak;

      var red = '#ff2121';
      var yellow = '#ffff1f';
      var green = '#00ff00';

      // handle current db value
      var rms = this.rmsOperator.inputSignal(frame.data);
      var dB = 20 * log10(rms) - offset;

      // slow release (could probably be improved)
      if (lastDB > dB) dB = lastDB - 6;

      // handle peak
      if (dB > peak.value || now - peak.time > this.peakLifetime) {
        peak.value = dB;
        peak.time = now;
      }

      var y0 = this.getYPosition(0);
      var y = this.getYPosition(dB);
      var yPeak = this.getYPosition(peak.value);

      ctx.save();

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      var gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, green);
      gradient.addColorStop((height - y0) / height, yellow);
      gradient.addColorStop(1, red);

      // dB
      ctx.fillStyle = gradient;
      ctx.fillRect(0, y, width, height - y);

      // 0 dB marker
      ctx.fillStyle = '#dcdcdc';
      ctx.fillRect(0, y0, width, 2);

      // peak
      ctx.fillStyle = gradient;
      ctx.fillRect(0, yPeak, width, 2);

      ctx.restore();

      this.lastDB = dB;
    }
  }]);
  return VuMeterDisplay;
}(_BaseDisplay3.default);

exports.default = VuMeterDisplay;

},{"../../common/operator/Rms":30,"./BaseDisplay":4,"babel-runtime/core-js/math/log10":46,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseDisplay2 = require('./BaseDisplay');

var _BaseDisplay3 = _interopRequireDefault(_BaseDisplay2);

var _MinMax = require('../../common/operator/MinMax');

var _MinMax2 = _interopRequireDefault(_MinMax);

var _Rms = require('../../common/operator/Rms');

var _Rms2 = _interopRequireDefault(_Rms);

var _displayUtils = require('../utils/display-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  colors: {
    type: 'any',
    default: (0, _displayUtils.getColors)('waveform'),
    metas: { kind: 'dyanmic' }
  },
  rms: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dyanmic' }
  }
};

/**
 * Display a waveform (along with optionnal Rms) of a given `signal` input in
 * a canvas.
 *
 * @param {Object} options - Override default parameters.
 * @param {Array<String>} [options.colors=['waveform', 'rms']] - Array
 *  containing the color codes for the waveform (index 0) and rms (index 1).
 *  _dynamic parameter_
 * @param {Boolean} [options.rms=false] - Set to `true` to display the rms.
 *  _dynamic parameter_
 * @param {Number} [options.duration=1] - Duration (in seconds) represented in
 *  the canvas. _dynamic parameter_
 * @param {Number} [options.min=-1] - Minimum value represented in the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.max=1] - Maximum value represented in the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.width=300] - Width of the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.height=150] - Height of the canvas.
 *  _dynamic parameter_
 * @param {Element|CSSSelector} [options.container=null] - Container element
 *  in which to insert the canvas. _constant parameter_
 * @param {Element|CSSSelector} [options.canvas=null] - Canvas element
 *  in which to draw. _constant parameter_
 * @param {Number} [options.referenceTime=null] - Optionnal reference time the
 *  display should considerer as the origin. Is only usefull when synchronizing
 *  several display using the `DisplaySync` class.
 *
 * @memberof module:client.sink
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const audioContext = new window.AudioContext();
 *
 * navigator.mediaDevices
 *   .getUserMedia({ audio: true })
 *   .then(init)
 *   .catch((err) => console.error(err.stack));
 *
 * function init(stream) {
 *   const audioIn = audioContext.createMediaStreamSource(stream);
 *
 *   const audioInNode = new lfo.source.AudioInNode({
 *     audioContext: audioContext,
 *     sourceNode: audioIn,
 *     frameSize: 512,
 *   });
 *
 *   const waveformDisplay = new lfo.sink.WaveformDisplay({
 *     canvas: '#waveform',
 *     duration: 3.5,
 *     rms: true,
 *   });
 *
 *   audioInNode.connect(waveformDisplay);
 *   audioInNode.start();
 * });
 */

var WaveformDisplay = function (_BaseDisplay) {
  (0, _inherits3.default)(WaveformDisplay, _BaseDisplay);

  function WaveformDisplay(options) {
    (0, _classCallCheck3.default)(this, WaveformDisplay);

    var _this = (0, _possibleConstructorReturn3.default)(this, (WaveformDisplay.__proto__ || (0, _getPrototypeOf2.default)(WaveformDisplay)).call(this, definitions, options, true));

    _this.minMaxOperator = new _MinMax2.default();
    _this.rmsOperator = new _Rms2.default();
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(WaveformDisplay, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      this.minMaxOperator.initStream(this.streamParams);
      this.rmsOperator.initStream(this.streamParams);

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame, frameWidth, pixelsSinceLastFrame) {
      // drop frames that cannot be displayed
      if (frameWidth < 1) return;

      var colors = this.params.get('colors');
      var showRms = this.params.get('rms');
      var ctx = this.ctx;
      var data = frame.data;
      var iSamplesPerPixels = Math.floor(data.length / frameWidth);

      for (var index = 0; index < frameWidth; index++) {
        var start = index * iSamplesPerPixels;
        var end = index === frameWidth - 1 ? undefined : start + iSamplesPerPixels;
        var slice = data.subarray(start, end);

        var minMax = this.minMaxOperator.inputSignal(slice);
        var minY = this.getYPosition(minMax[0]);
        var maxY = this.getYPosition(minMax[1]);

        ctx.strokeStyle = colors[0];
        ctx.beginPath();
        ctx.moveTo(index, minY);
        ctx.lineTo(index, maxY);
        ctx.closePath();
        ctx.stroke();

        if (showRms) {
          var rms = this.rmsOperator.inputSignal(slice);
          var rmsMaxY = this.getYPosition(rms);
          var rmsMinY = this.getYPosition(-rms);

          ctx.strokeStyle = colors[1];
          ctx.beginPath();
          ctx.moveTo(index, rmsMinY);
          ctx.lineTo(index, rmsMaxY);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  }]);
  return WaveformDisplay;
}(_BaseDisplay3.default);

exports.default = WaveformDisplay;

},{"../../common/operator/MinMax":26,"../../common/operator/Rms":30,"../utils/display-utils":18,"./BaseDisplay":4,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Bridge = require('../../common/sink/Bridge');

var _Bridge2 = _interopRequireDefault(_Bridge);

var _Logger = require('../../common/sink/Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _DataRecorder = require('../../common/sink/DataRecorder');

var _DataRecorder2 = _interopRequireDefault(_DataRecorder);

var _SignalRecorder = require('../../common/sink/SignalRecorder');

var _SignalRecorder2 = _interopRequireDefault(_SignalRecorder);

var _BaseDisplay = require('./BaseDisplay');

var _BaseDisplay2 = _interopRequireDefault(_BaseDisplay);

var _BpfDisplay = require('./BpfDisplay');

var _BpfDisplay2 = _interopRequireDefault(_BpfDisplay);

var _MarkerDisplay = require('./MarkerDisplay');

var _MarkerDisplay2 = _interopRequireDefault(_MarkerDisplay);

var _SignalDisplay = require('./SignalDisplay');

var _SignalDisplay2 = _interopRequireDefault(_SignalDisplay);

var _SpectrumDisplay = require('./SpectrumDisplay');

var _SpectrumDisplay2 = _interopRequireDefault(_SpectrumDisplay);

var _TraceDisplay = require('./TraceDisplay');

var _TraceDisplay2 = _interopRequireDefault(_TraceDisplay);

var _VuMeterDisplay = require('./VuMeterDisplay');

var _VuMeterDisplay2 = _interopRequireDefault(_VuMeterDisplay);

var _WaveformDisplay = require('./WaveformDisplay');

var _WaveformDisplay2 = _interopRequireDefault(_WaveformDisplay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// client only
// common
exports.default = {
  Bridge: _Bridge2.default,
  Logger: _Logger2.default,
  DataRecorder: _DataRecorder2.default,
  SignalRecorder: _SignalRecorder2.default,

  BaseDisplay: _BaseDisplay2.default,
  BpfDisplay: _BpfDisplay2.default,
  MarkerDisplay: _MarkerDisplay2.default,
  SignalDisplay: _SignalDisplay2.default,
  SpectrumDisplay: _SpectrumDisplay2.default,
  TraceDisplay: _TraceDisplay2.default,
  VuMeterDisplay: _VuMeterDisplay2.default,
  WaveformDisplay: _WaveformDisplay2.default
};

},{"../../common/sink/Bridge":36,"../../common/sink/DataRecorder":37,"../../common/sink/Logger":38,"../../common/sink/SignalRecorder":39,"./BaseDisplay":4,"./BpfDisplay":5,"./MarkerDisplay":6,"./SignalDisplay":7,"./SpectrumDisplay":8,"./TraceDisplay":9,"./VuMeterDisplay":10,"./WaveformDisplay":11}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = (0, _defineProperty3.default)({
  audioBuffer: {
    type: 'any',
    default: null,
    constant: true
  },
  frameSize: {
    type: 'integer',
    default: 512,
    constant: true
  },
  channel: {
    type: 'integer',
    default: 0,
    constant: true
  },
  progressCallback: {
    type: 'any',
    default: null,
    nullable: true,
    constant: true
  }
}, 'progressCallback', {
  type: 'any',
  default: null,
  nullable: true,
  constant: true
});

var noop = function noop() {};

/**
 * Slice an `AudioBuffer` into signal blocks and propagate the resulting frames
 * through the graph.
 *
 * @param {Object} options - Override parameter' default values.
 * @param {AudioBuffer} [options.audioBuffer] - Audio buffer to process.
 * @param {Number} [options.frameSize=512] - Size of the output blocks.
 * @param {Number} [options.channel=0] - Number of the channel to process.
 * @param {Number} [options.progressCallback=null] - Callback to be excuted on each
 *  frame output, receive as argument the current progress ratio.
 *
 * @memberof module:client.source
 *
 * @todo - Allow to pass raw buffer and sampleRate (simplified use server-side)
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const audioInBuffer = new lfo.source.AudioInBuffer({
 *   audioBuffer: audioBuffer,
 *   frameSize: 512,
 * });
 *
 * const waveform = new lfo.sink.Waveform({
 *   canvas: '#waveform',
 *   duration: 1,
 *   color: 'steelblue',
 *   rms: true,
 * });
 *
 * audioInBuffer.connect(waveform);
 * audioInBuffer.start();
 */

var AudioInBuffer = function (_BaseLfo) {
  (0, _inherits3.default)(AudioInBuffer, _BaseLfo);

  function AudioInBuffer() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, AudioInBuffer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AudioInBuffer.__proto__ || (0, _getPrototypeOf2.default)(AudioInBuffer)).call(this, definitions, options));

    var audioBuffer = _this.params.get('audioBuffer');

    if (!audioBuffer) throw new Error('Invalid "audioBuffer" parameter');

    _this.endTime = 0;
    return _this;
  }

  /**
   * Propagate the `streamParams` in the graph and start propagating frames.
   * When called, the slicing of the given `audioBuffer` starts immediately and
   * each resulting frame is propagated in graph.
   *
   * @see {@link module:common.core.BaseLfo#processStreamParams}
   * @see {@link module:common.core.BaseLfo#resetStream}
   * @see {@link module:client.source.AudioInBuffer#stop}
   */


  (0, _createClass3.default)(AudioInBuffer, [{
    key: 'start',
    value: function start() {
      this.initStream();

      var channel = this.params.get('channel');
      var audioBuffer = this.params.get('audioBuffer');
      var buffer = audioBuffer.getChannelData(channel);
      this.endTime = 0;

      this.processFrame(buffer);
    }

    /**
     * Finalize the stream and stop the whole graph. When called, the slicing of
     * the `audioBuffer` stops immediately.
     *
     * @see {@link module:common.core.BaseLfo#finalizeStream}
     * @see {@link module:client.source.AudioInBuffer#start}
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.finalizeStream(this.endTime);
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams() {
      var audioBuffer = this.params.get('audioBuffer');
      var frameSize = this.params.get('frameSize');
      var sourceSampleRate = audioBuffer.sampleRate;
      var frameRate = sourceSampleRate / frameSize;

      this.streamParams.frameSize = frameSize;
      this.streamParams.frameRate = frameRate;
      this.streamParams.frameType = 'signal';
      this.streamParams.sourceSampleRate = sourceSampleRate;
      this.streamParams.sourceSampleCount = frameSize;

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processFrame',
    value: function processFrame(buffer) {
      var sampleRate = this.streamParams.sourceSampleRate;
      var frameSize = this.streamParams.frameSize;
      var progressCallback = this.params.get('progressCallback') || noop;
      var length = buffer.length;
      var nbrFrames = Math.ceil(buffer.length / frameSize);
      var data = this.frame.data;
      var that = this;
      var i = 0;

      (function slice() {
        var offset = i * frameSize;
        var nbrCopy = Math.min(length - offset, frameSize);

        for (var j = 0; j < frameSize; j++) {
          data[j] = j < nbrCopy ? buffer[offset + j] : 0;
        }that.frame.time = offset / sampleRate;
        that.endTime = that.frame.time + nbrCopy / sampleRate;
        that.propagateFrame();

        i += 1;
        progressCallback(i / nbrFrames);

        if (i < nbrFrames) setTimeout(slice, 0);else that.finalizeStream(that.endTime);
      })();
    }
  }]);
  return AudioInBuffer;
}(_BaseLfo3.default);

exports.default = AudioInBuffer;

},{"../../core/BaseLfo":42,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/defineProperty":58,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AudioContext = window.AudioContext || window.webkitAudioContext;

var definitions = {
  frameSize: {
    type: 'integer',
    default: 512,
    constant: true
  },
  channel: {
    type: 'integer',
    default: 0,
    constant: true
  },
  sourceNode: {
    type: 'any',
    default: null,
    constant: true
  },
  audioContext: {
    type: 'any',
    default: null,
    constant: true
  }
};

/**
 * Use a `WebAudio` node as a source for the graph.
 *
 * @param {Object} options - Override parameter' default values.
 * @param {AudioNode} [options.sourceNode=null] - Audio node to process
 *  (mandatory).
 * @param {AudioContext} [options.audioContext=null] - Audio context used to
 *  create the audio node (mandatory).
 * @param {Number} [options.frameSize=512] - Size of the output blocks, define
 *  the `frameSize` in the `streamParams`.
 * @param {Number} [options.channel=0] - Number of the channel to process.
 *
 * @memberof module:client.source
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const audioContext = new AudioContext();
 * const sine = audioContext.createOscillator();
 * sine.frequency.value = 2;
 *
 * const audioInNode = new lfo.source.AudioInNode({
 *   audioContext: audioContext,
 *   sourceNode: sine,
 * });
 *
 * const signalDisplay = new lfo.sink.SignalDisplay({
 *   canvas: '#signal',
 *   duration: 1,
 * });
 *
 * audioInNode.connect(signalDisplay);
 *
 * // start the sine oscillator node and the lfo graph
 * sine.start();
 * audioInNode.start();
 */

var AudioInNode = function (_BaseLfo) {
  (0, _inherits3.default)(AudioInNode, _BaseLfo);

  function AudioInNode() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, AudioInNode);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AudioInNode.__proto__ || (0, _getPrototypeOf2.default)(AudioInNode)).call(this, definitions, options));

    var audioContext = _this.params.get('audioContext');
    var sourceNode = _this.params.get('sourceNode');

    if (!audioContext || !(audioContext instanceof AudioContext)) throw new Error('Invalid `audioContext` parameter');

    if (!sourceNode || !(sourceNode instanceof AudioNode)) throw new Error('Invalid `sourceNode` parameter');

    _this.sourceNode = sourceNode;
    _this._channel = _this.params.get('channel');
    _this._blockDuration = null;

    _this.processFrame = _this.processFrame.bind(_this);
    return _this;
  }

  /**
   * Propagate the `streamParams` in the graph and start to propagate signal
   * blocks produced by the audio node into the graph.
   *
   * @see {@link module:common.core.BaseLfo#processStreamParams}
   * @see {@link module:common.core.BaseLfo#resetStream}
   * @see {@link module:client.source.AudioInNode#stop}
   */


  (0, _createClass3.default)(AudioInNode, [{
    key: 'start',
    value: function start() {
      this.initStream();

      var audioContext = this.params.get('audioContext');
      this.frame.time = 0;

      var frameSize = this.params.get('frameSize');

      // @note: recreate each time because of a firefox weird behavior
      this.scriptProcessor = audioContext.createScriptProcessor(frameSize, 1, 1);
      this.scriptProcessor.onaudioprocess = this.processFrame;

      this.sourceNode.connect(this.scriptProcessor);
      this.scriptProcessor.connect(audioContext.destination);
    }

    /**
     * Finalize the stream and stop the whole graph.
     *
     * @see {@link module:common.core.BaseLfo#finalizeStream}
     * @see {@link module:client.source.AudioInNode#start}
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.finalizeStream(this.frame.time);

      this.sourceNode.disconnect();
      this.scriptProcessor.disconnect();
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams() {
      var audioContext = this.params.get('audioContext');
      var frameSize = this.params.get('frameSize');
      var sampleRate = audioContext.sampleRate;

      this.streamParams.frameSize = frameSize;
      this.streamParams.frameRate = sampleRate / frameSize;
      this.streamParams.frameType = 'signal';
      this.streamParams.sourceSampleRate = sampleRate;
      this.streamParams.sourceSampleCount = frameSize;

      this._blockDuration = frameSize / sampleRate;

      this.propagateStreamParams();
    }

    /**
     * Basically the `scriptProcessor.onaudioprocess` callback
     * @private
     */

  }, {
    key: 'processFrame',
    value: function processFrame(e) {
      this.frame.data = e.inputBuffer.getChannelData(this._channel);
      this.propagateFrame();

      this.frame.time += this._blockDuration;
    }
  }]);
  return AudioInNode;
}(_BaseLfo3.default);

exports.default = AudioInNode;

},{"../../core/BaseLfo":42,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EventIn = require('../../common/source/EventIn');

var _EventIn2 = _interopRequireDefault(_EventIn);

var _AudioInBuffer = require('./AudioInBuffer');

var _AudioInBuffer2 = _interopRequireDefault(_AudioInBuffer);

var _AudioInNode = require('./AudioInNode');

var _AudioInNode2 = _interopRequireDefault(_AudioInNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// client only
exports.default = {
  EventIn: _EventIn2.default,

  AudioInBuffer: _AudioInBuffer2.default,
  AudioInNode: _AudioInNode2.default
}; // common

},{"../../common/source/EventIn":40,"./AudioInBuffer":13,"./AudioInNode":14}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Synchronize several display sinks to a common time.
 *
 * @param {...BaseDisplay} views - List of the display to synchronize.
 *
 * @memberof module:client.utils
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const eventIn1 = new lfo.source.EventIn({
 *   frameType: 'scalar',
 *   frameSize: 1,
 * });
 *
 * const bpf1 = new lfo.sink.BpfDisplay({
 *   canvas: '#bpf-1',
 *   duration: 2,
 *   startTime: 0,
 *   min: 0,
 *   colors: ['steelblue'],
 * });
 *
 * eventIn1.connect(bpf1);
 *
 * const eventIn2 = new lfo.source.EventIn({
 *   frameType: 'scalar',
 *   frameSize: 1,
 * });
 *
 * const bpf2 = new lfo.sink.BpfDisplay({
 *   canvas: '#bpf-2',
 *   duration: 2,
 *   startTime: 7,
 *   min: 0,
 *   colors: ['orange'],
 * });
 *
 * const displaySync = new lfo.utils.DisplaySync(bpf1, bpf2);
 *
 * eventIn2.connect(bpf2);
 *
 * eventIn1.start();
 * eventIn2.start();
 *
 * let time = 0;
 * const period = 0.4;
 * const offset = 7.2;
 *
 * (function generateData() {
 *   const v = Math.random();
 *
 *   eventIn1.process(time, v);
 *   eventIn2.process(time + offset, v);
 *
 *   time += period;
 *
 *   setTimeout(generateData, period * 1000);
 * }());
 */
var DisplaySync = function () {
  function DisplaySync() {
    (0, _classCallCheck3.default)(this, DisplaySync);

    this.views = [];

    this.add.apply(this, arguments);
  }

  /** @private */


  (0, _createClass3.default)(DisplaySync, [{
    key: "add",
    value: function add() {
      var _this = this;

      for (var _len = arguments.length, views = Array(_len), _key = 0; _key < _len; _key++) {
        views[_key] = arguments[_key];
      }

      views.forEach(function (view) {
        return _this.install(view);
      });
    }

    /** @private */

  }, {
    key: "install",
    value: function install(view) {
      this.views.push(view);

      view.displaySync = this;
    }

    /** @private */

  }, {
    key: "shiftSiblings",
    value: function shiftSiblings(iShift, time, view) {
      this.views.forEach(function (display) {
        if (display !== view) display.shiftCanvas(iShift, time);
      });
    }
  }]);
  return DisplaySync;
}();

exports.default = DisplaySync;

},{"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DisplaySync = require('./DisplaySync');

var _DisplaySync2 = _interopRequireDefault(_DisplaySync);

var _windows = require('../../common/utils/windows');

var _windows2 = _interopRequireDefault(_windows);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  DisplaySync: _DisplaySync2.default,
  initWindows: _windows2.default
};

},{"../../common/utils/windows":41,"./DisplaySync":16}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var colors = ['#4682B4', '#ffa500', '#00e600', '#ff0000', '#800080', '#224153'];

var getColors = exports.getColors = function getColors(type, nbr) {
  switch (type) {
    case 'signal':
      return colors[0]; // steelblue
      break;
    case 'bpf':
      if (nbr <= colors.length) {
        return colors.slice(0, nbr);
      } else {
        var _colors = colors.slice(0);
        while (_colors.length < nbr) {
          _colors.push(getRandomColor());
        }return _colors;
      }
      break;
    case 'waveform':
      return [colors[0], colors[5]]; // steelblue / darkblue
      break;
    case 'marker':
      return colors[3]; // red
      break;
    case 'spectrum':
      return colors[2]; // green
      break;
    case 'trace':
      return colors[1]; // orange
      break;
  }
};

// http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
var getRandomColor = exports.getRandomColor = function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// scale from domain [0, 1] to range [270, 0] to consume in
// hsl(x, 100%, 50%) color scheme
var getHue = exports.getHue = function getHue(x) {
  var domainMin = 0;
  var domainMax = 1;
  var rangeMin = 270;
  var rangeMax = 0;

  return (rangeMax - rangeMin) * (x - domainMin) / (domainMax - domainMin) + rangeMin;
};

var hexToRGB = exports.hexToRGB = function hexToRGB(hex) {
  hex = hex.substring(1, 7);
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b];
};

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sin = Math.sin;
var cos = Math.cos;
var sqrt = Math.sqrt;
var pow = Math.pow;
var _2PI = Math.PI * 2;

// plot (from http://www.earlevel.com/scripts/widgets/20131013/biquads2.js)
// var len = 512;
// var magPlot = [];
// for (var idx = 0; idx < len; idx++) {
//   var w;
//   if (plotType == "linear")
//     w = idx / (len - 1) * Math.PI;  // 0 to pi, linear scale
//   else
//     w = Math.exp(Math.log(1 / 0.001) * idx / (len - 1)) * 0.001 * Math.PI;  // 0.001 to 1, times pi, log scale

//   var phi = Math.pow(Math.sin(w/2), 2);
//   var y = Math.log(Math.pow(a0+a1+a2, 2) - 4*(a0*a1 + 4*a0*a2 + a1*a2)*phi + 16*a0*a2*phi*phi) - Math.log(Math.pow(1+b1+b2, 2) - 4*(b1 + 4*b2 + b1*b2)*phi + 16*b2*phi*phi);
//   y = y * 10 / Math.LN10
//   if (y == -Infinity)
//     y = -200;

//   if (plotType == "linear")
//     magPlot.push([idx / (len - 1) * Fs / 2, y]);
//   else
//     magPlot.push([idx / (len - 1) / 2, y]);

//   if (idx == 0)
//     minVal = maxVal = y;
//   else if (y < minVal)
//     minVal = y;
//   else if (y > maxVal)
//     maxVal = y;
// }

var definitions = {
  type: {
    type: 'enum',
    default: 'lowpass',
    list: ['lowpass', 'highpass', 'bandpass_constant_skirt', 'bandpass', 'bandpass_constant_peak', 'notch', 'allpass', 'peaking', 'lowshelf', 'highshelf'],
    metas: { kind: 'dyanmic' }
  },
  f0: {
    type: 'float',
    default: 1,
    metas: { kind: 'dyanmic' }
  },
  gain: {
    type: 'float',
    default: 1,
    min: 0,
    metas: { kind: 'dyanmic' }
  },
  q: {
    type: 'float',
    default: 1,
    min: 0.001, // PIPO_BIQUAD_MIN_Q
    // max: 1,
    metas: { kind: 'dyanmic' }
  }
};

/**
 * Biquad filter (Direct form I). If input is of type `vector` the filter is
 * applied on each dimension i parallel.
 *
 * Based on the ["Cookbook formulae for audio EQ biquad filter coefficients"](http://www.musicdsp.org/files/Audio-EQ-Cookbook.txt)
 * by Robert Bristow-Johnson.
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default values.
 * @param {String} [options.type='lowpass'] - Type of the filter. Available
 *  filters: 'lowpass', 'highpass', 'bandpass_constant_skirt', 'bandpass_constant_peak'
 *  (alias 'bandpass'), 'notch', 'allpass', 'peaking', 'lowshelf', 'highshelf'.
 * @param {Number} [options.f0=1] - Cutoff or center frequency of the filter
 *  according to its type.
 * @param {Number} [options.gain=1] - Gain of the filter (in dB).
 * @param {Number} [options.q=1] - Quality factor of the filter.
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const audioInBuffer = new lfo.source.AudioInBuffer({
 *   audioBuffer: buffer,
 * });
 *
 * const biquad = new lfo.operator.Biquad({
 *   type: 'lowpass',
 *   f0: 2000,
 *   gain: 3,
 *   q: 12,
 * });
 *
 * const spectrumDisplay = new lfo.sink.SpectrumDisplay({
 *   canvas: '#spectrum',
 * });
 *
 * audioInBuffer.connect(biquad);
 * biquad.connect(spectrumDisplay);
 *
 * audioInBuffer.start();
 */
var Biquad = function (_BaseLfo) {
  (0, _inherits3.default)(Biquad, _BaseLfo);

  function Biquad() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Biquad);
    return (0, _possibleConstructorReturn3.default)(this, (Biquad.__proto__ || (0, _getPrototypeOf2.default)(Biquad)).call(this, definitions, options));
  }

  (0, _createClass3.default)(Biquad, [{
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      this._calculateCoefs();
    }
  }, {
    key: '_calculateCoefs',
    value: function _calculateCoefs() {
      var sampleRate = this.streamParams.sourceSampleRate;
      var frameType = this.streamParams.frameType;
      var frameSize = this.streamParams.frameSize;

      var type = this.params.get('type');
      var f0 = this.params.get('f0');
      var gain = this.params.get('gain');
      var q = this.params.get('q');
      // const bandwidth = this.params.get('bandwidth');
      var bandwidth = null;

      var b0 = 0,
          b1 = 0,
          b2 = 0,
          a0 = 0,
          a1 = 0,
          a2 = 0;

      var A = pow(10, gain / 40);
      var w0 = _2PI * f0 / sampleRate;
      var cosW0 = cos(w0);
      var sinW0 = sin(w0);
      var alpha = void 0; // depend of the filter type
      var _2RootAAlpha = void 0; // intermediate value for lowshelf and highshelf

      switch (type) {
        // H(s) = 1 / (s^2 + s/Q + 1)
        case 'lowpass':
          alpha = sinW0 / (2 * q);
          b0 = (1 - cosW0) / 2;
          b1 = 1 - cosW0;
          b2 = b0;
          a0 = 1 + alpha;
          a1 = -2 * cosW0;
          a2 = 1 - alpha;
          break;
        // H(s) = s^2 / (s^2 + s/Q + 1)
        case 'highpass':
          alpha = sinW0 / (2 * q);
          b0 = (1 + cosW0) / 2;
          b1 = -(1 + cosW0);
          b2 = b0;
          a0 = 1 + alpha;
          a1 = -2 * cosW0;
          a2 = 1 - alpha;
          break;
        // H(s) = s / (s^2 + s/Q + 1)  (constant skirt gain, peak gain = Q)
        case 'bandpass_constant_skirt':
          if (bandwidth) {
            // sin(w0)*sinh( ln(2)/2 * BW * w0/sin(w0) )           (case: BW)
          } else {
            alpha = sinW0 / (2 * q);
          }

          b0 = sinW0 / 2;
          b1 = 0;
          b2 = -b0;
          a0 = 1 + alpha;
          a1 = -2 * cosW0;
          a2 = 1 - alpha;
          break;
        // H(s) = (s/Q) / (s^2 + s/Q + 1)      (constant 0 dB peak gain)
        case 'bandpass': // looks like what is gnerally considered as a bandpass
        case 'bandpass_constant_peak':
          if (bandwidth) {
            // sin(w0)*sinh( ln(2)/2 * BW * w0/sin(w0) )           (case: BW)
          } else {
            alpha = sinW0 / (2 * q);
          }

          b0 = alpha;
          b1 = 0;
          b2 = -alpha;
          a0 = 1 + alpha;
          a1 = -2 * cosW0;
          a2 = 1 - alpha;
          break;
        // H(s) = (s^2 + 1) / (s^2 + s/Q + 1)
        case 'notch':
          alpha = sinW0 / (2 * q);
          b0 = 1;
          b1 = -2 * cosW0;
          b2 = 1;
          a0 = 1 + alpha;
          a1 = b1;
          a2 = 1 - alpha;
          break;
        // H(s) = (s^2 - s/Q + 1) / (s^2 + s/Q + 1)
        case 'allpass':
          alpha = sinW0 / (2 * q);
          b0 = 1 - alpha;
          b1 = -2 * cosW0;
          b2 = 1 + alpha;
          a0 = b2;
          a1 = b1;
          a2 = b0;
          break;
        // H(s) = (s^2 + s*(A/Q) + 1) / (s^2 + s/(A*Q) + 1)
        case 'peaking':
          if (bandwidth) {
            // sin(w0)*sinh( ln(2)/2 * BW * w0/sin(w0) )           (case: BW)
          } else {
            alpha = sinW0 / (2 * q);
          }

          b0 = 1 + alpha * A;
          b1 = -2 * cosW0;
          b2 = 1 - alpha * A;
          a0 = 1 + alpha / A;
          a1 = b1;
          a2 = 1 - alpha / A;
          break;
        // H(s) = A * (s^2 + (sqrt(A)/Q)*s + A)/(A*s^2 + (sqrt(A)/Q)*s + 1)
        case 'lowshelf':
          alpha = sinW0 / (2 * q);
          _2RootAAlpha = 2 * sqrt(A) * alpha;

          b0 = A * (A + 1 - (A - 1) * cosW0 + _2RootAAlpha);
          b1 = 2 * A * (A - 1 - (A + 1) * cosW0);
          b2 = A * (A + 1 - (A - 1) * cosW0 - _2RootAAlpha);
          a0 = A + 1 + (A - 1) * cosW0 + _2RootAAlpha;
          a1 = -2 * (A - 1 + (A + 1) * cosW0);
          a2 = A + 1 + (A - 1) * cosW0 - _2RootAAlpha;
          break;
        // H(s) = A * (A*s^2 + (sqrt(A)/Q)*s + 1)/(s^2 + (sqrt(A)/Q)*s + A)
        case 'highshelf':
          alpha = sinW0 / (2 * q);
          _2RootAAlpha = 2 * sqrt(A) * alpha;

          b0 = A * (A + 1 + (A - 1) * cosW0 + _2RootAAlpha);
          b1 = -2 * A * (A - 1 + (A + 1) * cosW0);
          b2 = A * (A + 1 + (A - 1) * cosW0 - _2RootAAlpha);
          a0 = A + 1 - (A - 1) * cosW0 + _2RootAAlpha;
          a1 = 2 * (A - 1 - (A + 1) * cosW0);
          a2 = A + 1 - (A - 1) * cosW0 - _2RootAAlpha;

          break;
      }

      this.coefs = {
        b0: b0 / a0,
        b1: b1 / a0,
        b2: b2 / a0,
        a1: a1 / a0,
        a2: a2 / a0
      };

      // reset state
      if (frameType === 'signal') {
        this.state = { x1: 0, x2: 0, y1: 0, y2: 0 };
      } else {
        this.state = {
          x1: new Float32Array(frameSize),
          x2: new Float32Array(frameSize),
          y1: new Float32Array(frameSize),
          y2: new Float32Array(frameSize)
        };
      }
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      // if no `sampleRate` or `sampleRate` is 0 we shall halt!
      var sampleRate = this.streamParams.sourceSampleRate;

      if (!sampleRate || sampleRate <= 0) throw new Error('Invalid sampleRate value (0) for biquad');

      this._calculateCoefs();
      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame) {
      var frameSize = this.streamParams.frameSize;
      var outData = this.frame.data;
      var inData = frame.data;
      var state = this.state;
      var coefs = this.coefs;

      for (var i = 0; i < frameSize; i++) {
        var x = inData[i];
        var y = coefs.b0 * x + coefs.b1 * state.x1[i] + coefs.b2 * state.x2[i] - coefs.a1 * state.y1[i] - coefs.a2 * state.y2[i];

        outData[i] = y;

        // update states
        state.x2[i] = state.x1[i];
        state.x1[i] = x;
        state.y2[i] = state.y1[i];
        state.y1[i] = y;
      }
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      var frameSize = this.streamParams.frameSize;
      var outData = this.frame.data;
      var inData = frame.data;
      var state = this.state;
      var coefs = this.coefs;

      for (var i = 0; i < frameSize; i++) {
        var x = inData[i];
        var y = coefs.b0 * x + coefs.b1 * state.x1 + coefs.b2 * state.x2 - coefs.a1 * state.y1 - coefs.a2 * state.y2;

        outData[i] = y;

        // update states
        state.x2 = state.x1;
        state.x1 = x;
        state.y2 = state.y1;
        state.y1 = y;
      }
    }
  }]);
  return Biquad;
}(_BaseLfo3.default);

exports.default = Biquad;

},{"../../core/BaseLfo":42,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sqrt = Math.sqrt;
var cos = Math.cos;
var PI = Math.PI;

// Dct Type 2 - orthogonal matrix scaling
function getDctWeights(order, N) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'htk';

  var weights = new Float32Array(N * order);
  var piOverN = PI / N;
  var scale0 = 1 / sqrt(2);
  var scale = sqrt(2 / N);

  for (var k = 0; k < order; k++) {
    var s = k === 0 ? scale0 * scale : scale;
    // const s = scale; // rta doesn't apply k=0 scaling

    for (var n = 0; n < N; n++) {
      weights[k * N + n] = s * cos(k * (n + 0.5) * piOverN);
    }
  }

  return weights;
}

var definitions = {
  order: {
    type: 'integer',
    default: 12,
    metas: { kind: 'static' }
  }
};

/**
 * Compute the Discrete Cosine Transform of an input `signal` or `vector`.
 * (HTK style weighting).
 *
 * _support `standalone` usage_
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.order=12] - Number of computed bins.
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * // assuming some audio buffer
 * const source = new AudioInBuffer({
 *   audioBuffer: audioBuffer,
 *   useWorker: false,
 * });
 *
 * const slicer = new Slicer({
 *   frameSize: 512,
 *   hopSize: 512,
 * });
 *
 * const dct = new Dct({
 *   order: 12,
 * });
 *
 * const logger = new lfo.sink.Logger({ data: true });
 *
 * source.connect(slicer);
 * slicer.connect(dct);
 * dct.connect(logger);
 *
 * source.start();
 */

var Dct = function (_BaseLfo) {
  (0, _inherits3.default)(Dct, _BaseLfo);

  function Dct() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Dct);
    return (0, _possibleConstructorReturn3.default)(this, (Dct.__proto__ || (0, _getPrototypeOf2.default)(Dct)).call(this, definitions, options));
  }

  /** @private */


  (0, _createClass3.default)(Dct, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      var order = this.params.get('order');
      var inFrameSize = prevStreamParams.frameSize;

      this.streamParams.frameSize = order;
      this.streamParams.frameType = 'vector';
      this.streamParams.description = [];

      this.weightMatrix = getDctWeights(order, inFrameSize);

      this.propagateStreamParams();
    }

    /**
     * Use the `Dct` operator in `standalone` mode (i.e. outside of a graph).
     *
     * @param {Array} values - Input values.
     * @return {Array} - Dct of the input array.
     *
     * @example
     * const dct = new lfo.operator.Dct({ order: 12 });
     * // mandatory for use in standalone mode
     * dct.initStream({ frameSize: 512, frameType: 'signal' });
     * dct.inputSignal(data);
     */

  }, {
    key: 'inputSignal',
    value: function inputSignal(values) {
      var order = this.params.get('order');
      var frameSize = values.length;
      var outFrame = this.frame.data;
      var weights = this.weightMatrix;

      for (var k = 0; k < order; k++) {
        var offset = k * frameSize;
        outFrame[k] = 0;

        for (var n = 0; n < frameSize; n++) {
          outFrame[k] += values[n] * weights[offset + n];
        }
      }

      return outFrame;
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      this.inputSignal(frame.data);
    }

    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame) {
      this.inputSignal(frame.data);
    }
  }]);
  return Dct;
}(_BaseLfo3.default);

exports.default = Dct;

},{"../../core/BaseLfo":42,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

var _windows = require('../utils/windows');

var _windows2 = _interopRequireDefault(_windows);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://code.soundsoftware.ac.uk/projects/js-dsp-test/repository/entry/fft/nayuki-obj/fft.js
/*
 * Free Fft and convolution (JavaScript)
 *
 * Copyright (c) 2014 Project Nayuki
 * http://www.nayuki.io/page/free-small-fft-in-multiple-languages
 *
 * (MIT License)
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * - The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 * - The Software is provided "as is", without warranty of any kind, express or
 *   implied, including but not limited to the warranties of merchantability,
 *   fitness for a particular purpose and noninfringement. In no event shall the
 *   authors or copyright holders be liable for any claim, damages or other
 *   liability, whether in an action of contract, tort or otherwise, arising from,
 *   out of or in connection with the Software or the use or other dealings in the
 *   Software.
 *
 * Slightly restructured by Chris Cannam, cannam@all-day-breakfast.com
 *
 * @private
 */
/*
 * Construct an object for calculating the discrete Fourier transform (DFT) of
 * size n, where n is a power of 2.
 *
 * @private
 */
function FftNayuki(n) {

  this.n = n;
  this.levels = -1;

  for (var i = 0; i < 32; i++) {
    if (1 << i == n) {
      this.levels = i; // Equal to log2(n)
    }
  }

  if (this.levels == -1) {
    throw "Length is not a power of 2";
  }

  this.cosTable = new Array(n / 2);
  this.sinTable = new Array(n / 2);

  for (var i = 0; i < n / 2; i++) {
    this.cosTable[i] = Math.cos(2 * Math.PI * i / n);
    this.sinTable[i] = Math.sin(2 * Math.PI * i / n);
  }

  /*
   * Computes the discrete Fourier transform (DFT) of the given complex vector,
   * storing the result back into the vector.
   * The vector's length must be equal to the size n that was passed to the
   * object constructor, and this must be a power of 2. Uses the Cooley-Tukey
   * decimation-in-time radix-2 algorithm.
   *
   * @private
   */
  this.forward = function (real, imag) {
    var n = this.n;

    // Bit-reversed addressing permutation
    for (var i = 0; i < n; i++) {
      var j = reverseBits(i, this.levels);

      if (j > i) {
        var temp = real[i];
        real[i] = real[j];
        real[j] = temp;
        temp = imag[i];
        imag[i] = imag[j];
        imag[j] = temp;
      }
    }

    // Cooley-Tukey decimation-in-time radix-2 Fft
    for (var size = 2; size <= n; size *= 2) {
      var halfsize = size / 2;
      var tablestep = n / size;

      for (var i = 0; i < n; i += size) {
        for (var j = i, k = 0; j < i + halfsize; j++, k += tablestep) {
          var tpre = real[j + halfsize] * this.cosTable[k] + imag[j + halfsize] * this.sinTable[k];
          var tpim = -real[j + halfsize] * this.sinTable[k] + imag[j + halfsize] * this.cosTable[k];
          real[j + halfsize] = real[j] - tpre;
          imag[j + halfsize] = imag[j] - tpim;
          real[j] += tpre;
          imag[j] += tpim;
        }
      }
    }

    // Returns the integer whose value is the reverse of the lowest 'bits'
    // bits of the integer 'x'.
    function reverseBits(x, bits) {
      var y = 0;

      for (var i = 0; i < bits; i++) {
        y = y << 1 | x & 1;
        x >>>= 1;
      }

      return y;
    }
  };

  /*
   * Computes the inverse discrete Fourier transform (IDFT) of the given complex
   * vector, storing the result back into the vector.
   * The vector's length must be equal to the size n that was passed to the
   * object constructor, and this must be a power of 2. This is a wrapper
   * function. This transform does not perform scaling, so the inverse is not
   * a true inverse.
   *
   * @private
   */
  this.inverse = function (real, imag) {
    forward(imag, real);
  };
}

var sqrt = Math.sqrt;

var isPowerOfTwo = function isPowerOfTwo(number) {
  while (number % 2 === 0 && number > 1) {
    number = number / 2;
  }return number === 1;
};

var definitions = {
  size: {
    type: 'integer',
    default: 1024,
    metas: { kind: 'static' }
  },
  window: {
    type: 'enum',
    list: ['none', 'hann', 'hanning', 'hamming', 'blackman', 'blackmanharris', 'sine', 'rectangle'],
    default: 'none',
    metas: { kind: 'static' }
  },
  mode: {
    type: 'enum',
    list: ['magnitude', 'power'], // add complex output
    default: 'magnitude'
  },
  norm: {
    type: 'enum',
    default: 'auto',
    list: ['auto', 'none', 'linear', 'power']
  }
};

/**
 * Compute the Fast Fourier Transform of an incomming `signal`.
 *
 * Fft implementation by [Nayuki](https://code.soundsoftware.ac.uk/projects/js-dsp-test/repository/entry/fft/nayuki-obj/fft.js).
 *
 * _support `standalone` usage_
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.size=1024] - Size of the fft, should be a power of
 *  2. If the frame size of the incomming signal is lower than this value,
 *  it is zero padded to match the fft size.
 * @param {String} [options.window='none'] - Name of the window applied on the
 *  incomming signal. Available windows are: 'none', 'hann', 'hanning',
 *  'hamming', 'blackman', 'blackmanharris', 'sine', 'rectangle'.
 * @param {String} [options.mode='magnitude'] - Type of the output (`magnitude`
 *  or `power`)
 * @param {String} [options.norm='auto'] - Type of normalization applied on the
 *  output. Possible values are 'auto', 'none', 'linear', 'power'. When set to
 *  `auto`, a `linear` normalization is applied on the magnitude spectrum, while
 *  a `power` normalizetion is applied on the power spectrum.
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * // assuming an `audioBuffer` exists
 * const source = new lfo.source.AudioInBuffer({ audioBuffer });
 *
 * const slicer = new lfo.operator.Slicer({
 *   frameSize: 256,
 * });
 *
 * const fft = new lfo.operator.Fft({
 *   mode: 'power',
 *   window: 'hann',
 *   norm: 'power',
 *   size: 256,
 * });
 *
 * source.connect(slicer);
 * slicer.connect(fft);
 * source.start();
 *
 * // > outputs 129 bins containing the values of the power spectrum (including
 * // > DC and Nyuist frequencies).
 *
 * @todo - check if 'rectangle' and 'none' windows are not redondant.
 * @todo - check default values for all params.
 */

var Fft = function (_BaseLfo) {
  (0, _inherits3.default)(Fft, _BaseLfo);

  function Fft() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Fft);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Fft.__proto__ || (0, _getPrototypeOf2.default)(Fft)).call(this, definitions, options));

    _this.windowSize = null;
    _this.normalizeCoefs = null;
    _this.window = null;
    _this.real = null;
    _this.imag = null;
    _this.fft = null;

    if (!isPowerOfTwo(_this.params.get('size'))) throw new Error('fftSize must be a power of two');
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Fft, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);
      // set the output frame size
      var inFrameSize = prevStreamParams.frameSize;
      var fftSize = this.params.get('size');
      var mode = this.params.get('mode');
      var norm = this.params.get('norm');
      var windowName = this.params.get('window');
      // window `none` and `rectangle` are aliases
      if (windowName === 'none') windowName = 'rectangle';

      this.streamParams.frameSize = fftSize / 2 + 1;
      this.streamParams.frameType = 'vector';
      this.streamParams.description = [];
      // size of the window to apply on the input frame
      this.windowSize = inFrameSize < fftSize ? inFrameSize : fftSize;

      // references to populate in the window functions (cf. `initWindow`)
      this.normalizeCoefs = { linear: 0, power: 0 };
      this.window = new Float32Array(this.windowSize);

      (0, _windows2.default)(windowName, // name of the window
      this.window, // buffer populated with the window signal
      this.windowSize, // size of the window
      this.normalizeCoefs // object populated with the normalization coefs
      );

      var _normalizeCoefs = this.normalizeCoefs,
          linear = _normalizeCoefs.linear,
          power = _normalizeCoefs.power;


      switch (norm) {
        case 'none':
          this.windowNorm = 1;
          break;

        case 'linear':
          this.windowNorm = linear;
          break;

        case 'power':
          this.windowNorm = power;
          break;

        case 'auto':
          if (mode === 'magnitude') this.windowNorm = linear;else if (mode === 'power') this.windowNorm = power;
          break;
      }

      this.real = new Float32Array(fftSize);
      this.imag = new Float32Array(fftSize);
      this.fft = new FftNayuki(fftSize);

      this.propagateStreamParams();
    }

    /**
     * Use the `Fft` operator in `standalone` mode (i.e. outside of a graph).
     *
     * @param {Array} signal - Input values.
     * @return {Array} - Fft of the input signal.
     *
     * @example
     * const fft = new lfo.operator.Fft({ size: 512, window: 'hann' });
     * // mandatory for use in standalone mode
     * fft.initStream({ frameSize: 256, frameType: 'signal' });
     * fft.inputSignal(signal);
     */

  }, {
    key: 'inputSignal',
    value: function inputSignal(signal) {
      var mode = this.params.get('mode');
      var windowSize = this.windowSize;
      var frameSize = this.streamParams.frameSize;
      var fftSize = this.params.get('size');
      var outData = this.frame.data;

      // apply window on the input signal and reset imag buffer
      for (var i = 0; i < windowSize; i++) {
        this.real[i] = signal[i] * this.window[i] * this.windowNorm;
        this.imag[i] = 0;
      }

      // if real is bigger than input signal, fill with zeros
      for (var _i = windowSize; _i < fftSize; _i++) {
        this.real[_i] = 0;
        this.imag[_i] = 0;
      }

      this.fft.forward(this.real, this.imag);

      if (mode === 'magnitude') {
        var norm = 1 / fftSize;

        // DC index
        var realDc = this.real[0];
        var imagDc = this.imag[0];
        outData[0] = sqrt(realDc * realDc + imagDc * imagDc) * norm;

        // Nquyst index
        var realNy = this.real[fftSize / 2];
        var imagNy = this.imag[fftSize / 2];
        outData[fftSize / 2] = sqrt(realNy * realNy + imagNy * imagNy) * norm;

        // power spectrum
        for (var _i2 = 1, j = fftSize - 1; _i2 < fftSize / 2; _i2++, j--) {
          var real = 0.5 * (this.real[_i2] + this.real[j]);
          var imag = 0.5 * (this.imag[_i2] - this.imag[j]);

          outData[_i2] = 2 * sqrt(real * real + imag * imag) * norm;
        }
      } else if (mode === 'power') {
        var _norm = 1 / (fftSize * fftSize);

        // DC index
        var _realDc = this.real[0];
        var _imagDc = this.imag[0];
        outData[0] = (_realDc * _realDc + _imagDc * _imagDc) * _norm;

        // Nquyst index
        var _realNy = this.real[fftSize / 2];
        var _imagNy = this.imag[fftSize / 2];
        outData[fftSize / 2] = (_realNy * _realNy + _imagNy * _imagNy) * _norm;

        // power spectrum
        for (var _i3 = 1, _j = fftSize - 1; _i3 < fftSize / 2; _i3++, _j--) {
          var _real = 0.5 * (this.real[_i3] + this.real[_j]);
          var _imag = 0.5 * (this.imag[_i3] - this.imag[_j]);

          outData[_i3] = 4 * (_real * _real + _imag * _imag) * _norm;
        }
      }

      return outData;
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      this.inputSignal(frame.data);
    }
  }]);
  return Fft;
}(_BaseLfo3.default);

exports.default = Fft;

},{"../../core/BaseLfo":42,"../utils/windows":41,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sqrt = Math.sqrt;

var definitions = {
  normalize: {
    type: 'boolean',
    default: true,
    metas: { kind: 'dynamic' }
  },
  power: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Compute the magnitude of a `vector` input.
 *
 * _support `standalone` usage_
 *
 * @param {Object} options - Override default parameters.
 * @param {Boolean} [options.normalize=true] - Normalize output according to
 *  the vector size.
 * @param {Boolean} [options.power=false] - If true, returns the squared
 *  magnitude (power).
 *
 * @memberof module:common.operator
 *
 * @example
 * import * as lfo from 'waves-lfo/common';
 *
 * const eventIn = new lfo.source.EventIn({ frameSize: 2, frameType: 'vector' });
 * const magnitude = new lfo.operator.Magnitude();
 * const logger = new lfo.sink.Logger({ outFrame: true });
 *
 * eventIn.connect(magnitude);
 * magnitude.connect(logger);
 * eventIn.start();
 *
 * eventIn.process(null, [1, 1]);
 * > [1]
 * eventIn.process(null, [2, 2]);
 * > [2.82842712475]
 * eventIn.process(null, [3, 3]);
 * > [4.24264068712]
 */

var Magnitude = function (_BaseLfo) {
  (0, _inherits3.default)(Magnitude, _BaseLfo);

  function Magnitude() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Magnitude);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Magnitude.__proto__ || (0, _getPrototypeOf2.default)(Magnitude)).call(this, definitions, options));

    _this._normalize = _this.params.get('normalize');
    _this._power = _this.params.get('power');
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Magnitude, [{
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      (0, _get3.default)(Magnitude.prototype.__proto__ || (0, _getPrototypeOf2.default)(Magnitude.prototype), 'onParamUpdate', this).call(this, name, value, metas);

      switch (name) {
        case 'normalize':
          this._normalize = value;
          break;
        case 'power':
          this._power = value;
          break;
      }
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);
      this.streamParams.frameSize = 1;
      this.streamParams.frameType = 'scalar';
      this.streamParams.description = ['magnitude'];
      this.propagateStreamParams();
    }

    /**
     * Use the `Magnitude` operator in `standalone` mode (i.e. outside of a graph).
     *
     * @param {Array|Float32Array} values - Values to process.
     * @return {Number} - Magnitude value.
     *
     * @example
     * import * as lfo from 'waves-lfo/client';
     *
     * const magnitude = new lfo.operator.Magnitude({ power: true });
     * magnitude.initStream({ frameType: 'vector', frameSize: 3 });
     * magnitude.inputVector([3, 3]);
     * > 4.24264068712
     */

  }, {
    key: 'inputVector',
    value: function inputVector(values) {
      var length = values.length;
      var sum = 0;

      for (var i = 0; i < length; i++) {
        sum += values[i] * values[i];
      }var mag = sum;

      if (this._normalize) mag /= length;

      if (!this._power) mag = sqrt(mag);

      return mag;
    }

    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame) {
      this.frame.data[0] = this.inputVector(frame.data);
    }
  }]);
  return Magnitude;
}(_BaseLfo3.default);

exports.default = Magnitude;

},{"../../core/BaseLfo":42,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/get":59,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sqrt = Math.sqrt;

/**
 * Compute mean and standard deviation of a given `signal`.
 *
 * _support `standalone` usage_
 *
 * @memberof module:common.operator
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const audioContext = new AudioContext();
 *
 * navigator.mediaDevices
 *   .getUserMedia({ audio: true })
 *   .then(init)
 *   .catch((err) => console.error(err.stack));
 *
 * function init(stream) {
 *   const source = audioContext.createMediaStreamSource(stream);
 *
 *   const audioInNode = new lfo.source.AudioInNode({
 *     sourceNode: source,
 *     audioContext: audioContext,
 *   });
 *
 *   const meanStddev = new lfo.operator.MeanStddev();
 *
 *   const traceDisplay = new lfo.sink.TraceDisplay({
 *     canvas: '#trace',
 *   });
 *
 *   audioInNode.connect(meanStddev);
 *   meanStddev.connect(traceDisplay);
 *   audioInNode.start();
 * }
 */

var MeanStddev = function (_BaseLfo) {
  (0, _inherits3.default)(MeanStddev, _BaseLfo);

  function MeanStddev() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, MeanStddev);

    // no options available, just throw an error if some param try to be set.
    return (0, _possibleConstructorReturn3.default)(this, (MeanStddev.__proto__ || (0, _getPrototypeOf2.default)(MeanStddev)).call(this, {}, options));
  }

  /** @private */


  (0, _createClass3.default)(MeanStddev, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      this.streamParams.frameType = 'vector';
      this.streamParams.frameSize = 2;
      this.streamParams.description = ['mean', 'stddev'];

      this.propagateStreamParams();
    }

    /**
     * Use the `MeanStddev` operator in `standalone` mode (i.e. outside of a graph).
     *
     * @param {Array|Float32Array} values - Values to process.
     * @return {Array} - Mean and standart deviation of the input values.
     *
     * @example
     * import * as lfo from 'waves-lfo/client';
     *
     * const meanStddev = new lfo.operator.MeanStddev();
     * meanStddev.initStream({ frameType: 'vector', frameSize: 1024 });
     * meanStddev.inputVector(someSineSignal);
     * > [0, 0.7071]
     */

  }, {
    key: 'inputSignal',
    value: function inputSignal(values) {
      var outData = this.frame.data;
      var length = values.length;

      var mean = 0;
      var m2 = 0;

      // compute mean and variance with Welford algorithm
      // https://en.wikipedia.org/wiki/Algorithms_for_calculating_variance
      for (var i = 0; i < length; i++) {
        var x = values[i];
        var delta = x - mean;
        mean += delta / (i + 1);
        m2 += delta * (x - mean);
      }

      var variance = m2 / (length - 1);
      var stddev = sqrt(variance);

      outData[0] = mean;
      outData[1] = stddev;

      return outData;
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      this.inputSignal(frame.data);
    }
  }]);
  return MeanStddev;
}(_BaseLfo3.default);

exports.default = MeanStddev;

},{"../../core/BaseLfo":42,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _log = require('babel-runtime/core-js/math/log10');

var _log2 = _interopRequireDefault(_log);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var min = Math.min;
var max = Math.max;
var pow = Math.pow;
var log10 = _log2.default;

function hertzToMelHtk(freqHz) {
  return 2595 * (0, _log2.default)(1 + freqHz / 700);
}

function melToHertzHtk(freqMel) {
  return 700 * (Math.pow(10, freqMel / 2595) - 1);
}

/**
 * Returns a description of the weights to apply on the fft bins for each
 * Mel band filter.
 * @note - adapted from imtr-tools/rta
 *
 * @param {Number} nbrBins - Number of fft bins.
 * @param {Number} nbrFilter - Number of mel filters.
 * @param {Number} sampleRate - Sample Rate of the signal.
 * @param {Number} minFreq - Minimum Frequency to be considerered.
 * @param {Number} maxFreq - Maximum frequency to consider.
 * @return {Array<Object>} - Description of the weights to apply on the bins for
 *  each mel filter. Each description has the following structure:
 *  { startIndex: binIndex, centerFreq: binCenterFrequency, weights: [] }
 *
 * @private
 */
function getMelBandWeights(nbrBins, nbrBands, sampleRate, minFreq, maxFreq) {
  var type = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'htk';


  var hertzToMel = null;
  var melToHertz = null;
  var minMel = void 0;
  var maxMel = void 0;

  if (type === 'htk') {
    hertzToMel = hertzToMelHtk;
    melToHertz = melToHertzHtk;
    minMel = hertzToMel(minFreq);
    maxMel = hertzToMel(maxFreq);
  } else {
    throw new Error('Invalid mel band type: "' + type + '"');
  }

  var melBandDescriptions = new Array(nbrBands);
  // center frequencies of Fft bins
  var fftFreqs = new Float32Array(nbrBins);
  // center frequencies of mel bands - uniformly spaced in mel domain between
  // limits, there are 2 more frequencies than the actual number of filters in
  // order to calculate the slopes
  var filterFreqs = new Float32Array(nbrBands + 2);

  var fftSize = (nbrBins - 1) * 2;
  // compute bins center frequencies
  for (var i = 0; i < nbrBins; i++) {
    fftFreqs[i] = sampleRate * i / fftSize;
  }for (var _i = 0; _i < nbrBands + 2; _i++) {
    filterFreqs[_i] = melToHertz(minMel + _i / (nbrBands + 1) * (maxMel - minMel));
  } // loop throught filters
  for (var _i2 = 0; _i2 < nbrBands; _i2++) {
    var minWeightIndexDefined = 0;

    var description = {
      startIndex: null,
      centerFreq: null,
      weights: []
    };

    // define contribution of each bin for the filter at index (i + 1)
    // do not process the last spectrum component (Nyquist)
    for (var j = 0; j < nbrBins - 1; j++) {
      var posSlopeContrib = (fftFreqs[j] - filterFreqs[_i2]) / (filterFreqs[_i2 + 1] - filterFreqs[_i2]);

      var negSlopeContrib = (filterFreqs[_i2 + 2] - fftFreqs[j]) / (filterFreqs[_i2 + 2] - filterFreqs[_i2 + 1]);
      // lowerSlope and upper slope intersect at zero and with each other
      var contribution = max(0, min(posSlopeContrib, negSlopeContrib));

      if (contribution > 0) {
        if (description.startIndex === null) {
          description.startIndex = j;
          description.centerFreq = filterFreqs[_i2 + 1];
        }

        description.weights.push(contribution);
      }
    }

    // empty filter
    if (description.startIndex === null) {
      description.startIndex = 0;
      description.centerFreq = 0;
    }

    // @todo - do some scaling for Slaney-style mel
    melBandDescriptions[_i2] = description;
  }

  return melBandDescriptions;
}

var definitions = {
  log: {
    type: 'boolean',
    default: false,
    metas: { kind: 'static' }
  },
  nbrBands: {
    type: 'integer',
    default: 24,
    metas: { kind: 'static' }
  },
  minFreq: {
    type: 'float',
    default: 0,
    metas: { kind: 'static' }
  },
  maxFreq: {
    type: 'float',
    default: null,
    nullable: true,
    metas: { kind: 'static' }
  },
  power: {
    type: 'integer',
    default: 1,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Compute the mel bands spectrum from a given spectrum (`vector` type).
 * _Implement the `htk` mel band style._
 *
 * _support `standalone` usage_
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Boolean} [options.log=false] - Apply a logarithmic scale on the output.
 * @param {Number} [options.nbrBands=24] - Number of filters defining the mel
 *  bands.
 * @param {Number} [options.minFreq=0] - Minimum frequency to consider.
 * @param {Number} [options.maxFreq=null] - Maximum frequency to consider.
 *  If `null`, is set to Nyquist frequency.
 * @param {Number} [options.power=1] - Apply a power scaling on each mel band.
 *
 * @todo - implement Slaney style mel bands
 *
 * @example
 * import lfo from 'waves-lfo/node'
 *
 * // read a file from path (node only source)
 * const audioInFile = new lfo.source.AudioInFile({
 *   filename: 'path/to/file',
 *   frameSize: 512,
 * });
 *
 * const slicer = new lfo.operator.Slicer({
 *   frameSize: 256,
 *   hopSize: 256,
 * });
 *
 * const fft = new lfo.operator.Fft({
 *   size: 1024,
 *   window: 'hann',
 *   mode: 'power',
 *   norm: 'power',
 * });
 *
 * const mel = new lfo.operator.Mel({
 *   log: true,
 *   nbrBands: 24,
 * });
 *
 * const logger = new lfo.sink.Logger({ data: true });
 *
 * audioInFile.connect(slicer);
 * slicer.connect(fft);
 * fft.connect(mel);
 * mel.connect(logger);
 *
 * audioInFile.start();
 */

var Mel = function (_BaseLfo) {
  (0, _inherits3.default)(Mel, _BaseLfo);

  function Mel() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Mel);
    return (0, _possibleConstructorReturn3.default)(this, (Mel.__proto__ || (0, _getPrototypeOf2.default)(Mel)).call(this, definitions, options));
  }

  /** @private */


  (0, _createClass3.default)(Mel, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      var nbrBins = prevStreamParams.frameSize;
      var nbrBands = this.params.get('nbrBands');
      var sampleRate = this.streamParams.sourceSampleRate;
      var minFreq = this.params.get('minFreq');
      var maxFreq = this.params.get('maxFreq');

      //
      this.streamParams.frameSize = nbrBands;
      this.streamParams.frameType = 'vector';
      this.streamParams.description = [];

      if (maxFreq === null) maxFreq = this.streamParams.sourceSampleRate / 2;

      this.melBandDescriptions = getMelBandWeights(nbrBins, nbrBands, sampleRate, minFreq, maxFreq);

      this.propagateStreamParams();
    }

    /**
     * Use the `Mel` operator in `standalone` mode (i.e. outside of a graph).
     *
     * @param {Array} spectrum - Fft bins.
     * @return {Array} - Mel bands.
     *
     * @example
     * const mel = new lfo.operator.Mel({ nbrBands: 24 });
     * // mandatory for use in standalone mode
     * mel.initStream({ frameSize: 256, frameType: 'vector' });
     * mel.inputVector(fftBins);
     */

  }, {
    key: 'inputVector',
    value: function inputVector(bins) {

      var power = this.params.get('power');
      var log = this.params.get('log');
      var melBands = this.frame.data;
      var nbrBands = this.streamParams.frameSize;
      var scale = 1;

      var minLogValue = 1e-48;
      var minLog = -480;

      if (log) scale *= nbrBands;

      for (var i = 0; i < nbrBands; i++) {
        var _melBandDescriptions$ = this.melBandDescriptions[i],
            startIndex = _melBandDescriptions$.startIndex,
            weights = _melBandDescriptions$.weights;

        var value = 0;

        for (var j = 0; j < weights.length; j++) {
          value += weights[j] * bins[startIndex + j];
        } // apply same logic as in PiPoBands
        if (scale !== 1) value *= scale;

        if (log) {
          if (value > minLogValue) value = 10 * log10(value);else value = minLog;
        }

        if (power !== 1) value = pow(value, power);

        melBands[i] = value;
      }

      return melBands;
    }

    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame) {
      this.inputVector(frame.data);
    }
  }]);
  return Mel;
}(_BaseLfo3.default);

exports.default = Mel;

},{"../../core/BaseLfo":42,"babel-runtime/core-js/math/log10":46,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

var _Fft = require('./Fft');

var _Fft2 = _interopRequireDefault(_Fft);

var _Mel = require('./Mel');

var _Mel2 = _interopRequireDefault(_Mel);

var _Dct = require('./Dct');

var _Dct2 = _interopRequireDefault(_Dct);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  nbrBands: {
    type: 'integer',
    default: 24,
    meta: { kind: 'static' }
  },
  nbrCoefs: {
    type: 'integer',
    default: 12,
    meta: { kind: 'static' }
  },
  minFreq: {
    type: 'float',
    default: 0,
    meta: { kind: 'static' }
  },
  maxFreq: {
    type: 'float',
    default: null,
    nullable: true,
    meta: { kind: 'static' }
  }
};

/**
 * Compute the Mfcc of the incomming `signal`. Is basically a wrapper around
 * [`Fft`]{@link module:common.operator.Fft}, [`Mel`]{@link module:common.operator.Mel}
 * and [`Dct`]{@link module:common.operator.Dct}.
 *
 * _support `standalone` usage_
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {nbrBands} [options.nbrBands=24] - Number of Mel bands.
 * @param {nbrCoefs} [options.nbrCoefs=12] - Number of output coefs.
 *
 * @see {@link module:common.operator.Fft}
 * @see {@link module:common.operator.Mel}
 * @see {@link module:common.operator.Dct}
 *
 * @example
 * import lfo from 'waves-lfo/node'
 *
 * const audioInFile = new lfo.source.AudioInFile({
 *   filename: 'path/to/file',
 *   frameSize: 512,
 * });
 *
 * const slicer = new lfo.operator.Slicer({
 *   frameSize: 256,
 * });
 *
 * const mfcc = new lfo.operator.Mfcc({
 *   nbrBands: 24,
 *   nbrCoefs: 12,
 * });
 *
 * const logger = new lfo.sink.Logger({ data: true });
 *
 * audioInFile.connect(slicer);
 * slicer.connect(mfcc);
 * mfcc.connect(logger);
 *
 * audioInFile.start();
 */

var Mfcc = function (_BaseLfo) {
  (0, _inherits3.default)(Mfcc, _BaseLfo);

  function Mfcc(options) {
    (0, _classCallCheck3.default)(this, Mfcc);
    return (0, _possibleConstructorReturn3.default)(this, (Mfcc.__proto__ || (0, _getPrototypeOf2.default)(Mfcc)).call(this, definitions, options));
  }

  /** @private */


  (0, _createClass3.default)(Mfcc, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      var nbrBands = this.params.get('nbrBands');
      var nbrCoefs = this.params.get('nbrCoefs');
      var minFreq = this.params.get('minFreq');
      var maxFreq = this.params.get('maxFreq');
      var inputFrameSize = prevStreamParams.frameSize;
      var inputFrameRate = prevStreamParams.frameRate;
      var inputSampleRate = prevStreamParams.sourceSampleRate;
      var nbrBins = inputFrameSize / 2 + 1;

      this.streamParams.frameSize = nbrCoefs;
      this.streamParams.frameType = 'vector';
      this.streamParams.description = [];

      this.fft = new _Fft2.default({
        window: 'hann',
        mode: 'power',
        norm: 'power',
        size: inputFrameSize
      });

      this.mel = new _Mel2.default({
        nbrBands: nbrBands,
        log: true,
        power: 1,
        minFreq: minFreq,
        maxFreq: maxFreq
      });

      this.dct = new _Dct2.default({
        order: nbrCoefs
      });

      // init streams
      this.fft.initStream({
        frameType: 'signal',
        frameSize: inputFrameSize,
        frameRate: inputFrameRate,
        sourceSampleRate: inputSampleRate
      });

      this.mel.initStream({
        frameType: 'vector',
        frameSize: nbrBins,
        frameRate: inputFrameRate,
        sourceSampleRate: inputSampleRate
      });

      this.dct.initStream({
        frameType: 'vector',
        frameSize: nbrBands,
        frameRate: inputFrameRate,
        sourceSampleRate: inputSampleRate
      });

      this.propagateStreamParams();
    }

    /**
     * Use the `Mfcc` operator in `standalone` mode (i.e. outside of a graph).
     *
     * @param {Array} data - Signal chunk to analyse.
     * @return {Array} - Mfcc coefficients.
     *
     * @example
     * const mfcc = new lfo.operator.Mfcc();
     * // mandatory for use in standalone mode
     * mfcc.initStream({ frameSize: 256, frameType: 'vector' });
     * mfcc.inputSignal(signal);
     */

  }, {
    key: 'inputSignal',
    value: function inputSignal(data) {
      var output = this.frame.data;
      var nbrCoefs = this.params.get('nbrCoefs');

      var bins = this.fft.inputSignal(data);
      var melBands = this.mel.inputVector(bins);
      // console.log(melBands);
      var coefs = this.dct.inputSignal(melBands);

      for (var i = 0; i < nbrCoefs; i++) {
        output[i] = coefs[i];
      }return output;
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      this.inputSignal(frame.data);
    }
  }]);
  return Mfcc;
}(_BaseLfo3.default);

exports.default = Mfcc;

},{"../../core/BaseLfo":42,"./Dct":20,"./Fft":21,"./Mel":24,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Find minimun and maximum values of a given `signal`.
 *
 * _support `standalone` usage_
 *
 * @memberof module:common.operator
 *
 * @example
 * import * as lfo from 'waves-lfo/common';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameSize: 512,
 *   frameType: 'signal',
 *   sampleRate: 0,
 * });
 *
 * const minMax = new lfo.operator.MinMax();
 *
 * const logger = new lfo.sink.Logger({ data: true });
 *
 * eventIn.connect(minMax);
 * minMax.connect(logger);
 * eventIn.start()
 *
 * // create a frame
 * const signal = new Float32Array(512);
 * for (let i = 0; i < 512; i++)
 *   signal[i] = i + 1;
 *
 * eventIn.process(null, signal);
 * > [1, 512];
 */
var MinMax = function (_BaseLfo) {
  (0, _inherits3.default)(MinMax, _BaseLfo);

  function MinMax() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, MinMax);

    // throw errors if options are given
    return (0, _possibleConstructorReturn3.default)(this, (MinMax.__proto__ || (0, _getPrototypeOf2.default)(MinMax)).call(this, {}, options));
  }

  /** @private */


  (0, _createClass3.default)(MinMax, [{
    key: 'processStreamParams',
    value: function processStreamParams() {
      var prevStreamParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.prepareStreamParams(prevStreamParams);

      this.streamParams.frameType = 'vector';
      this.streamParams.frameSize = 2;
      this.streamParams.description = ['min', 'max'];

      this.propagateStreamParams();
    }

    /**
     * Use the `MinMax` operator in `standalone` mode (i.e. outside of a graph).
     *
     * @param {Float32Array|Array} data - Input signal.
     * @return {Array} - Min and max values.
     *
     * @example
     * const minMax = new MinMax();
     * minMax.initStream({ frameType: 'signal', frameSize: 10 });
     *
     * minMax.inputSignal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
     * > [0, 5]
     */

  }, {
    key: 'inputSignal',
    value: function inputSignal(data) {
      var outData = this.frame.data;
      var min = +Infinity;
      var max = -Infinity;

      for (var i = 0, l = data.length; i < l; i++) {
        var value = data[i];
        if (value < min) min = value;
        if (value > max) max = value;
      }

      outData[0] = min;
      outData[1] = max;

      return outData;
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      this.inputSignal(frame.data);
    }
  }]);
  return MinMax;
}(_BaseLfo3.default);

exports.default = MinMax;

},{"../../core/BaseLfo":42,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  order: {
    type: 'integer',
    min: 1,
    max: 1e9,
    default: 10,
    metas: { kind: 'dynamic' }
  },
  fill: {
    type: 'float',
    min: -Infinity,
    max: +Infinity,
    default: 0,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Compute a moving average operation on the incomming frames (`scalar` or
 * `vector` type). If the input is of type vector, the moving average is
 * computed for each dimension in parallel. If the source sample rate is defined
 * frame time is shifted to the middle of the window defined by the order.
 *
 * _support `standalone` usage_
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.order=10] - Number of successive values on which
 *  the average is computed.
 * @param {Number} [options.fill=0] - Value to fill the ring buffer with before
 *  the first input frame.
 *
 * @todo - Implement `processSignal` ?
 *
 * @example
 * import * as lfo from 'waves-lfo/common';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameSize: 2,
 *   frameType: 'vector'
 * });
 *
 * const movingAverage = new lfo.operator.MovingAverage({
 *   order: 5,
 *   fill: 0
 * });
 *
 * const logger = new lfo.sink.Logger({ data: true });
 *
 * eventIn.connect(movingAverage);
 * movingAverage.connect(logger);
 *
 * eventIn.start();
 *
 * eventIn.process(null, [1, 1]);
 * > [0.2, 0.2]
 * eventIn.process(null, [1, 1]);
 * > [0.4, 0.4]
 * eventIn.process(null, [1, 1]);
 * > [0.6, 0.6]
 * eventIn.process(null, [1, 1]);
 * > [0.8, 0.8]
 * eventIn.process(null, [1, 1]);
 * > [1, 1]
 */

var MovingAverage = function (_BaseLfo) {
  (0, _inherits3.default)(MovingAverage, _BaseLfo);

  function MovingAverage() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, MovingAverage);

    var _this = (0, _possibleConstructorReturn3.default)(this, (MovingAverage.__proto__ || (0, _getPrototypeOf2.default)(MovingAverage)).call(this, definitions, options));

    _this.sum = null;
    _this.ringBuffer = null;
    _this.ringIndex = 0;
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(MovingAverage, [{
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      (0, _get3.default)(MovingAverage.prototype.__proto__ || (0, _getPrototypeOf2.default)(MovingAverage.prototype), 'onParamUpdate', this).call(this, name, value, metas);

      // @todo - should be done lazily in process
      switch (name) {
        case 'order':
          this.processStreamParams();
          this.resetStream();
          break;
        case 'fill':
          this.resetStream();
          break;
      }
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      var frameSize = this.streamParams.frameSize;
      var order = this.params.get('order');

      this.ringBuffer = new Float32Array(order * frameSize);

      if (frameSize > 1) this.sum = new Float32Array(frameSize);else this.sum = 0;

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'resetStream',
    value: function resetStream() {
      (0, _get3.default)(MovingAverage.prototype.__proto__ || (0, _getPrototypeOf2.default)(MovingAverage.prototype), 'resetStream', this).call(this);

      var order = this.params.get('order');
      var fill = this.params.get('fill');
      var ringBuffer = this.ringBuffer;
      var ringLength = ringBuffer.length;

      for (var i = 0; i < ringLength; i++) {
        ringBuffer[i] = fill;
      }var fillSum = order * fill;
      var frameSize = this.streamParams.frameSize;

      if (frameSize > 1) {
        for (var _i = 0; _i < frameSize; _i++) {
          this.sum[_i] = fillSum;
        }
      } else {
        this.sum = fillSum;
      }

      this.ringIndex = 0;
    }

    /** @private */

  }, {
    key: 'processScalar',
    value: function processScalar(value) {
      this.frame.data[0] = this.inputScalar(frame.data[0]);
    }

    /**
     * Use the `MovingAverage` operator in `standalone` mode (i.e. outside of a
     * graph) with a `scalar` input.
     *
     * @param {Number} value - Value to feed the moving average with.
     * @return {Number} - Average value.
     *
     * @example
     * import * as lfo from 'waves-lfo/client';
     *
     * const movingAverage = new lfo.operator.MovingAverage({ order: 5 });
     * movingAverage.initStream({ frameSize: 1, frameType: 'scalar' });
     *
     * movingAverage.inputScalar(1);
     * > 0.2
     * movingAverage.inputScalar(1);
     * > 0.4
     * movingAverage.inputScalar(1);
     * > 0.6
     */

  }, {
    key: 'inputScalar',
    value: function inputScalar(value) {
      var order = this.params.get('order');
      var ringIndex = this.ringIndex;
      var ringBuffer = this.ringBuffer;
      var sum = this.sum;

      sum -= ringBuffer[ringIndex];
      sum += value;

      this.sum = sum;
      this.ringBuffer[ringIndex] = value;
      this.ringIndex = (ringIndex + 1) % order;

      return sum / order;
    }

    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame) {
      this.inputVector(frame.data);
    }

    /**
     * Use the `MovingAverage` operator in `standalone` mode (i.e. outside of a
     * graph) with a `vector` input.
     *
     * @param {Array} values - Values to feed the moving average with.
     * @return {Float32Array} - Average value for each dimension.
     *
     * @example
     * import * as lfo from 'waves-lfo/client';
     *
     * const movingAverage = new lfo.operator.MovingAverage({ order: 5 });
     * movingAverage.initStream({ frameSize: 2, frameType: 'scalar' });
     *
     * movingAverage.inputArray([1, 1]);
     * > [0.2, 0.2]
     * movingAverage.inputArray([1, 1]);
     * > [0.4, 0.4]
     * movingAverage.inputArray([1, 1]);
     * > [0.6, 0.6]
     */

  }, {
    key: 'inputVector',
    value: function inputVector(values) {
      var order = this.params.get('order');
      var outFrame = this.frame.data;
      var frameSize = this.streamParams.frameSize;
      var ringIndex = this.ringIndex;
      var ringOffset = ringIndex * frameSize;
      var ringBuffer = this.ringBuffer;
      var sum = this.sum;
      var scale = 1 / order;

      for (var i = 0; i < frameSize; i++) {
        var ringBufferIndex = ringOffset + i;
        var value = values[i];
        var localSum = sum[i];

        localSum -= ringBuffer[ringBufferIndex];
        localSum += value;

        this.sum[i] = localSum;
        outFrame[i] = localSum * scale;
        ringBuffer[ringBufferIndex] = value;
      }

      this.ringIndex = (ringIndex + 1) % order;

      return outFrame;
    }

    /** @private */

  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      this.prepareFrame();
      this.processFunction(frame);

      var order = this.params.get('order');
      var time = frame.time;
      // shift time to take account of the added latency
      if (this.streamParams.sourceSampleRate) time -= 0.5 * (order - 1) / this.streamParams.sourceSampleRate;

      this.frame.time = time;
      this.frame.metadata = frame.metadata;

      this.propagateFrame();
    }
  }]);
  return MovingAverage;
}(_BaseLfo3.default);

exports.default = MovingAverage;

},{"../../core/BaseLfo":42,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/get":59,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  order: {
    type: 'integer',
    min: 1,
    max: 1e9,
    default: 9,
    metas: { kind: 'dynamic' }
  },
  fill: {
    type: 'float',
    min: -Infinity,
    max: +Infinity,
    default: 0,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Compute a moving median operation on the incomming frames (`scalar` or
 * `vector` type). If the input is of type vector, the moving median is
 * computed for each dimension in parallel. If the source sample rate is defined
 * frame time is shifted to the middle of the window defined by the order.
 *
 * _support `standalone` usage_
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.order=9] - Number of successive values in which
 *  the median is searched. This value must be odd. _dynamic parameter_
 * @param {Number} [options.fill=0] - Value to fill the ring buffer with before
 *  the first input frame. _dynamic parameter_
 *
 * @todo - Implement `processSignal`
 *
 * @example
 * import * as lfo from 'waves-lfo/common';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameSize: 2,
 *   frameType: 'vector',
 * });
 *
 * const movingMedian = new lfo.operator.MovingMedian({
 *   order: 5,
 *   fill: 0,
 * });
 *
 * const logger = new lfo.sink.Logger({ data: true });
 *
 * eventIn.connect(movingMedian);
 * movingMedian.connect(logger);
 *
 * eventIn.start();
 *
 * eventIn.processFrame(null, [1, 1]);
 * > [0, 0]
 * eventIn.processFrame(null, [2, 2]);
 * > [0, 0]
 * eventIn.processFrame(null, [3, 3]);
 * > [1, 1]
 * eventIn.processFrame(null, [4, 4]);
 * > [2, 2]
 * eventIn.processFrame(null, [5, 5]);
 * > [3, 3]
 */

var MovingMedian = function (_BaseLfo) {
  (0, _inherits3.default)(MovingMedian, _BaseLfo);

  function MovingMedian() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, MovingMedian);

    var _this = (0, _possibleConstructorReturn3.default)(this, (MovingMedian.__proto__ || (0, _getPrototypeOf2.default)(MovingMedian)).call(this, definitions, options));

    _this.ringBuffer = null;
    _this.sorter = null;
    _this.ringIndex = 0;

    _this._ensureOddOrder();
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(MovingMedian, [{
    key: '_ensureOddOrder',
    value: function _ensureOddOrder() {
      if (this.params.get('order') % 2 === 0) throw new Error('Invalid value ' + order + ' for param "order" - should be odd');
    }

    /** @private */

  }, {
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      (0, _get3.default)(MovingMedian.prototype.__proto__ || (0, _getPrototypeOf2.default)(MovingMedian.prototype), 'onParamUpdate', this).call(this, name, value, metas);

      switch (name) {
        case 'order':
          this._ensureOddOrder();
          this.processStreamParams();
          this.resetStream();
          break;
        case 'fill':
          this.resetStream();
          break;
      }
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);
      // outType is similar to input type

      var frameSize = this.streamParams.frameSize;
      var order = this.params.get('order');

      this.ringBuffer = new Float32Array(frameSize * order);
      this.sortBuffer = new Float32Array(frameSize * order);

      this.minIndices = new Uint32Array(frameSize);

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'resetStream',
    value: function resetStream() {
      (0, _get3.default)(MovingMedian.prototype.__proto__ || (0, _getPrototypeOf2.default)(MovingMedian.prototype), 'resetStream', this).call(this);

      var fill = this.params.get('fill');
      var ringBuffer = this.ringBuffer;
      var ringLength = ringBuffer.length;

      for (var i = 0; i < ringLength; i++) {
        this.ringBuffer[i] = fill;
      }this.ringIndex = 0;
    }

    /** @private */

  }, {
    key: 'processScalar',
    value: function processScalar(frame) {
      this.frame.data[0] = this.inputScalar(frame.data[0]);
    }

    /**
     * Allows for the use of a `MovingMedian` outside a graph (e.g. inside
     * another node), in this case `processStreamParams` and `resetStream`
     * should be called manually on the node.
     *
     * @param {Number} value - Value to feed the moving median with.
     * @return {Number} - Median value.
     *
     * @example
     * import * as lfo from 'waves-lfo/client';
     *
     * const movingMedian = new MovingMedian({ order: 5 });
     * movingMedian.initStream({ frameSize: 1, frameType: 'scalar' });
     *
     * movingMedian.inputScalar(1);
     * > 0
     * movingMedian.inputScalar(2);
     * > 0
     * movingMedian.inputScalar(3);
     * > 1
     * movingMedian.inputScalar(4);
     * > 2
     */

  }, {
    key: 'inputScalar',
    value: function inputScalar(value) {
      var ringIndex = this.ringIndex;
      var ringBuffer = this.ringBuffer;
      var sortBuffer = this.sortBuffer;
      var order = this.params.get('order');
      var medianIndex = (order - 1) / 2;
      var startIndex = 0;

      ringBuffer[ringIndex] = value;

      for (var i = 0; i <= medianIndex; i++) {
        var min = +Infinity;
        var minIndex = null;

        for (var j = startIndex; j < order; j++) {
          if (i === 0) sortBuffer[j] = ringBuffer[j];

          if (sortBuffer[j] < min) {
            min = sortBuffer[j];
            minIndex = j;
          }
        }

        // swap minIndex and startIndex
        var cache = sortBuffer[startIndex];
        sortBuffer[startIndex] = sortBuffer[minIndex];
        sortBuffer[minIndex] = cache;

        startIndex += 1;
      }

      var median = sortBuffer[medianIndex];
      this.ringIndex = (ringIndex + 1) % order;

      return median;
    }

    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame) {
      this.inputVector(frame.data);
    }

    /**
     * Allows for the use of a `MovingMedian` outside a graph (e.g. inside
     * another node), in this case `processStreamParams` and `resetStream`
     * should be called manually on the node.
     *
     * @param {Array} values - Values to feed the moving median with.
     * @return {Float32Array} - Median values for each dimension.
     *
     * @example
     * import * as lfo from 'waves-lfo/client';
     *
     * const movingMedian = new MovingMedian({ order: 3, fill: 0 });
     * movingMedian.initStream({ frameSize: 3, frameType: 'vector' });
     *
     * movingMedian.inputArray([1, 1]);
     * > [0, 0]
     * movingMedian.inputArray([2, 2]);
     * > [1, 1]
     * movingMedian.inputArray([3, 3]);
     * > [2, 2]
     */

  }, {
    key: 'inputVector',
    value: function inputVector(values) {
      var order = this.params.get('order');
      var ringBuffer = this.ringBuffer;
      var ringIndex = this.ringIndex;
      var sortBuffer = this.sortBuffer;
      var outFrame = this.frame.data;
      var minIndices = this.minIndices;
      var frameSize = this.streamParams.frameSize;
      var medianIndex = Math.floor(order / 2);
      var startIndex = 0;

      for (var i = 0; i <= medianIndex; i++) {

        for (var j = 0; j < frameSize; j++) {
          outFrame[j] = +Infinity;
          minIndices[j] = 0;

          for (var k = startIndex; k < order; k++) {
            var index = k * frameSize + j;

            // update ring buffer corresponding to current
            if (k === ringIndex && i === 0) ringBuffer[index] = values[j];

            // copy value in sort buffer on first pass
            if (i === 0) sortBuffer[index] = ringBuffer[index];

            // find minium in the remaining array
            if (sortBuffer[index] < outFrame[j]) {
              outFrame[j] = sortBuffer[index];
              minIndices[j] = index;
            }
          }

          // swap minimum and curent index
          var swapIndex = startIndex * frameSize + j;
          var v = sortBuffer[swapIndex];
          sortBuffer[swapIndex] = sortBuffer[minIndices[j]];
          sortBuffer[minIndices[j]] = v;

          // store this minimum value as current result
          outFrame[j] = sortBuffer[swapIndex];
        }

        startIndex += 1;
      }

      this.ringIndex = (ringIndex + 1) % order;

      return this.frame.data;
    }

    /** @private */

  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      this.preprocessFrame();
      this.processFunction(frame);

      var order = this.params.get('order');
      var time = frame.time;
      // shift time to take account of the added latency
      if (this.streamParams.sourceSampleRate) time -= 0.5 * (order - 1) / this.streamParams.sourceSampleRate;

      this.frame.time = time;
      this.frame.metadata = frame.metadata;

      this.propagateFrame(time, this.outFrame, metadata);
    }
  }]);
  return MovingMedian;
}(_BaseLfo3.default);

exports.default = MovingMedian;

},{"../../core/BaseLfo":42,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/get":59,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  state: {
    type: 'enum',
    default: 'on',
    list: ['on', 'off'],
    metas: { kind: 'dynamic' }
  }
};

/**
 * The OnOff operator allows to stop the propagation of the stream in a
 * subgraph. When "on", frames are propagated, when "off" the propagation is
 * stopped.
 *
 * The `streamParams` propagation is never bypassed so the subsequent subgraph
 * is always ready for incomming frames.
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {String} [options.state='on'] - Default state.
 *
 * @example
 * import * as lfo from 'waves-lfo/common';
 *
 * const frames = [
 *   { time: 0, data: [1, 2] },
 *   { time: 1, data: [3, 4] },
 *   { time: 2, data: [5, 6] },
 * ];
 *
 * const eventIn = new EventIn({
 *   frameSize: 2,
 *   frameRate: 0,
 *   frameType: 'vector',
 * });
 *
 * const onOff = new OnOff();
 *
 * const logger = new Logger({ data: true });
 *
 * eventIn.connect(onOff);
 * onOff.connect(logger);
 *
 * eventIn.start();
 *
 * eventIn.processFrame(frames[0]);
 * > [0, 1]
 *
 * // bypass subgraph
 * onOff.setState('off');
 * eventIn.processFrame(frames[1]);
 *
 * // re-open subgraph
 * onOff.setState('on');
 * eventIn.processFrame(frames[2]);
 * > [5, 6]
 */

var OnOff = function (_BaseLfo) {
  (0, _inherits3.default)(OnOff, _BaseLfo);

  function OnOff() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, OnOff);

    var _this = (0, _possibleConstructorReturn3.default)(this, (OnOff.__proto__ || (0, _getPrototypeOf2.default)(OnOff)).call(this, definitions, options));

    _this.state = _this.params.get('state');
    return _this;
  }

  /**
   * Set the state of the `OnOff`.
   *
   * @param {String} state - New state of the operator (`on` or `off`)
   */


  (0, _createClass3.default)(OnOff, [{
    key: 'setState',
    value: function setState(state) {
      if (definitions.state.list.indexOf(state) === -1) throw new Error('Invalid switch state value "' + state + '" [valid values: "on"/"off"]');

      this.state = state;
    }

    // define all possible stream API
    /** @private */

  }, {
    key: 'processScalar',
    value: function processScalar() {}
    /** @private */

  }, {
    key: 'processVector',
    value: function processVector() {}
    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal() {}

    /** @private */

  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      if (this.state === 'on') {
        this.prepareFrame();

        this.frame.time = frame.time;
        this.frame.metadata = frame.metadata;
        this.frame.data = frame.data;

        this.propagateFrame();
      }
    }
  }]);
  return OnOff;
}(_BaseLfo3.default);

exports.default = OnOff;

},{"../../core/BaseLfo":42,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sqrt = Math.sqrt;

var definitions = {
  power: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Compute the Root Mean Square of a `signal`.
 *
 * _support `standalone` usage_
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Boolean} [options.power=false] - If `true` remove the "R" of the
 *  "Rms" and return the squared result (i.e. power).
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * // assuming some `AudioBuffer`
 * const audioInBuffer = new lfo.source.AudioInBuffer({
 *   audioBuffer: audioBuffer,
 *   frameSize: 512,
 * });
 *
 * const rms = new lfo.operator.Rms();
 * const logger = new lfo.sink.Logger({ data: true });
 *
 * audioInBuffer.connect(rms);
 * rms.connect(logger);
 *
 * audioInBuffer.start();
 */

var Rms = function (_BaseLfo) {
  (0, _inherits3.default)(Rms, _BaseLfo);

  function Rms() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Rms);
    return (0, _possibleConstructorReturn3.default)(this, (Rms.__proto__ || (0, _getPrototypeOf2.default)(Rms)).call(this, definitions, options));
  }

  /** @private */


  (0, _createClass3.default)(Rms, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      this.streamParams.frameSize = 1;
      this.streamParams.frameType = 'scalar';
      this.streamParams.description = ['rms'];

      this.propagateStreamParams();
    }

    /**
     * Allows for the use of a `Rms` outside a graph (e.g. inside
     * another node). Return the rms of the given signal block.
     *
     * @param {Number} signal - Signal block to be computed.
     * @return {Number} - rms of the input signal.
     *
     * @example
     * import * as lfo from 'waves-lfo/client';
     *
     * const rms = new lfo.operator.Rms();
     * rms.initStream({ frameType: 'signal', frameSize: 1000 });
     *
     * const results = rms.inputSignal([...values]);
     */

  }, {
    key: 'inputSignal',
    value: function inputSignal(signal) {
      var power = this.params.get('power');
      var length = signal.length;
      var rms = 0;

      for (var i = 0; i < length; i++) {
        rms += signal[i] * signal[i];
      }rms = rms / length;

      if (!power) rms = sqrt(rms);

      return rms;
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      this.frame.data[0] = this.inputSignal(frame.data);
    }
  }]);
  return Rms;
}(_BaseLfo3.default);

exports.default = Rms;

},{"../../core/BaseLfo":42,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

var _MovingAverage = require('./MovingAverage');

var _MovingAverage2 = _interopRequireDefault(_MovingAverage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var min = Math.min;
var max = Math.max;

var definitions = {
  logInput: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dyanmic' }
  },
  minInput: {
    type: 'float',
    default: 0.000000000001,
    metas: { kind: 'dyanmic' }
  },
  filterOrder: {
    type: 'integer',
    default: 5,
    metas: { kind: 'dyanmic' }
  },
  threshold: {
    type: 'float',
    default: 3,
    metas: { kind: 'dyanmic' }
  },
  offThreshold: {
    type: 'float',
    default: -Infinity,
    metas: { kind: 'dyanmic' }
  },
  minInter: {
    type: 'float',
    default: 0.050,
    metas: { kind: 'dyanmic' }
  },
  maxDuration: {
    type: 'float',
    default: Infinity,
    metas: { kind: 'dyanmic' }
  }
};

/**
 * Create segments based on attacks.
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Boolean} [options.logInput=false] - Apply log on the input.
 * @param {Number} [options.minInput=0.000000000001] - Minimum value to use as
 *  input.
 * @param {Number} [options.filterOrder=5] - Order of the internally used moving
 *  average.
 * @param {Number} [options.threshold=3] - Threshold that triggers a segment
 *  start.
 * @param {Number} [options.offThreshold=-Infinity] - Threshold that triggers
 *  a segment end.
 * @param {Number} [options.minInter=0.050] - Minimum delay between two semgents.
 * @param {Number} [options.maxDuration=Infinity] - Maximum duration of a segment.
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * // assuming a stream from the microphone
 * const source = audioContext.createMediaStreamSource(stream);
 *
 * const audioInNode = new lfo.source.AudioInNode({
 *   sourceNode: source,
 *   audioContext: audioContext,
 * });
 *
 * const slicer = new lfo.operator.Slicer({
 *   frameSize: frameSize,
 *   hopSize: hopSize,
 *   centeredTimeTags: true
 * });
 *
 * const power = new lfo.operator.RMS({
 *   power: true,
 * });
 *
 * const segmenter = new lfo.operator.Segmenter({
 *   logInput: true,
 *   filterOrder: 5,
 *   threshold: 3,
 *   offThreshold: -Infinity,
 *   minInter: 0.050,
 *   maxDuration: 0.050,
 * });
 *
 * const logger = new lfo.sink.Logger({ time: true });
 *
 * audioInNode.connect(slicer);
 * slicer.connect(power);
 * power.connect(segmenter);
 * segmenter.connect(logger);
 *
 * audioInNode.start();
 */

var Segmenter = function (_BaseLfo) {
  (0, _inherits3.default)(Segmenter, _BaseLfo);

  function Segmenter(options) {
    (0, _classCallCheck3.default)(this, Segmenter);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Segmenter.__proto__ || (0, _getPrototypeOf2.default)(Segmenter)).call(this, definitions, options));

    _this.insideSegment = false;
    _this.onsetTime = -Infinity;

    // stats
    _this.min = Infinity;
    _this.max = -Infinity;
    _this.sum = 0;
    _this.sumOfSquares = 0;
    _this.count = 0;

    var minInput = _this.params.get('minInput');
    var fill = minInput;

    if (_this.params.get('logInput') && minInput > 0) fill = Math.log(minInput);

    _this.movingAverage = new _MovingAverage2.default({
      order: _this.params.get('filterOrder'),
      fill: fill
    });

    _this.lastMvavrg = fill;
    return _this;
  }

  (0, _createClass3.default)(Segmenter, [{
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      (0, _get3.default)(Segmenter.prototype.__proto__ || (0, _getPrototypeOf2.default)(Segmenter.prototype), 'onParamUpdate', this).call(this, name, value, metas);

      if (name === 'filterOrder') this.movingAverage.params.set('order', value);
    }
  }, {
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      this.streamParams.frameType = 'vector';
      this.streamParams.frameSize = 5;
      this.streamParams.frameRate = 0;
      this.streamParams.description = ['duration', 'min', 'max', 'mean', 'stddev'];

      this.movingAverage.initStream(prevStreamParams);

      this.propagateStreamParams();
    }
  }, {
    key: 'resetStream',
    value: function resetStream() {
      (0, _get3.default)(Segmenter.prototype.__proto__ || (0, _getPrototypeOf2.default)(Segmenter.prototype), 'resetStream', this).call(this);
      this.movingAverage.resetStream();
      this.resetSegment();
    }
  }, {
    key: 'finalizeStream',
    value: function finalizeStream(endTime) {
      if (this.insideSegment) this.outputSegment(endTime);

      (0, _get3.default)(Segmenter.prototype.__proto__ || (0, _getPrototypeOf2.default)(Segmenter.prototype), 'finalizeStream', this).call(this, endTime);
    }
  }, {
    key: 'resetSegment',
    value: function resetSegment() {
      this.insideSegment = false;
      this.onsetTime = -Infinity;
      // stats
      this.min = Infinity;
      this.max = -Infinity;
      this.sum = 0;
      this.sumOfSquares = 0;
      this.count = 0;
    }
  }, {
    key: 'outputSegment',
    value: function outputSegment(endTime) {
      var outData = this.frame.data;
      outData[0] = endTime - this.onsetTime;
      outData[1] = this.min;
      outData[2] = this.max;

      var norm = 1 / this.count;
      var mean = this.sum * norm;
      var meanOfSquare = this.sumOfSquares * norm;
      var squareOfmean = mean * mean;

      outData[3] = mean;
      outData[4] = 0;

      if (meanOfSquare > squareOfmean) outData[4] = Math.sqrt(meanOfSquare - squareOfmean);

      this.frame.time = this.onsetTime;

      this.propagateFrame();
    }
  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      var logInput = this.params.get('logInput');
      var minInput = this.params.get('minInput');
      var threshold = this.params.get('threshold');
      var minInter = this.params.get('minInter');
      var maxDuration = this.params.get('maxDuration');
      var offThreshold = this.params.get('offThreshold');
      var rawValue = frame.data[0];
      var time = frame.time;
      var value = Math.max(rawValue, minInput);

      if (logInput) value = Math.log(value);

      var diff = value - this.lastMvavrg;
      this.lastMvavrg = this.movingAverage.inputScalar(value);

      // update frame metadata
      this.frame.metadata = frame.metadata;

      if (diff > threshold && time - this.onsetTime > minInter) {
        if (this.insideSegment) this.outputSegment(time);

        // start segment
        this.insideSegment = true;
        this.onsetTime = time;
        this.max = -Infinity;
      }

      if (this.insideSegment) {
        this.min = min(this.min, rawValue);
        this.max = max(this.max, rawValue);
        this.sum += rawValue;
        this.sumOfSquares += rawValue * rawValue;
        this.count++;

        if (time - this.onsetTime >= maxDuration || value <= offThreshold) {
          this.outputSegment(time);
          this.insideSegment = false;
        }
      }
    }
  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      this.prepareFrame();
      this.processFunction(frame);
      // do not propagate here as the frameRate is now zero
    }
  }]);
  return Segmenter;
}(_BaseLfo3.default);

exports.default = Segmenter;

},{"../../core/BaseLfo":42,"./MovingAverage":27,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/get":59,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  index: {
    type: 'integer',
    default: 0,
    metas: { kind: 'static' }
  },
  indices: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'static' }
  }
};

/**
 * Select one or several indices from a `vector` input. If only one index is
 * selected, the output will be of type `scalar`, otherwise the output will
 * be a vector containing the selected indices.
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default values.
 * @param {Number} options.index - Index to select from the input frame.
 * @param {Array<Number>} options.indices - Indices to select from the input
 *  frame, if defined, take precedance over `option.index`.
 *
 * @example
 * import * as lfo from 'waves-lfo/common';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameType: 'vector',
 *   frameSize: 3,
 * });
 *
 * const select = new lfo.operator.Select({
 *   index: 1,
 * });
 *
 * eventIn.start();
 * eventIn.process(0, [0, 1, 2]);
 * > 1
 * eventIn.process(0, [3, 4, 5]);
 * > 4
 */

var Select = function (_BaseLfo) {
  (0, _inherits3.default)(Select, _BaseLfo);

  function Select() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Select);
    return (0, _possibleConstructorReturn3.default)(this, (Select.__proto__ || (0, _getPrototypeOf2.default)(Select)).call(this, definitions, options));
  }

  /** @private */


  (0, _createClass3.default)(Select, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      var _this2 = this;

      this.prepareStreamParams(prevStreamParams);

      var index = this.params.get('index');
      var indices = this.params.get('indices');

      var max = indices !== null ? Math.max.apply(null, indices) : index;

      if (max >= prevStreamParams.frameSize) throw new Error('Invalid select index "' + max + '"');

      this.streamParams.frameType = indices !== null ? 'vector' : 'scalar';
      this.streamParams.frameSize = indices !== null ? indices.length : 1;

      this.select = indices !== null ? indices : [index];

      // steal description() from parent
      if (prevStreamParams.description) {
        this.select.forEach(function (val, index) {
          _this2.streamParams.description[index] = prevStreamParams.description[val];
        });
      }

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame) {
      var data = frame.data;
      var outData = this.frame.data;
      var select = this.select;

      for (var i = 0; i < select.length; i++) {
        outData[i] = data[select[i]];
      }
    }
  }]);
  return Select;
}(_BaseLfo3.default);

exports.default = Select;

},{"../../core/BaseLfo":42,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  frameSize: {
    type: 'integer',
    default: 512,
    metas: { kind: 'static' }
  },
  hopSize: { // should be nullable
    type: 'integer',
    default: null,
    nullable: true,
    metas: { kind: 'static' }
  },
  centeredTimeTags: {
    type: 'boolean',
    default: false
  }
};

/**
 * Change the `frameSize` and `hopSize` of a `signal` input according to
 * the given options.
 * This operator updates the stream parameters according to its configuration.
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.frameSize=512] - Frame size of the output signal.
 * @param {Number} [options.hopSize=null] - Number of samples between two
 *  consecutive frames. If null, `hopSize` is set to `frameSize`.
 * @param {Boolean} [options.centeredTimeTags] - Move the time tag to the middle
 *  of the frame.
 *
 * @example
 * import * as lfo from 'waves-lfo/common';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameType: 'signal',
 *   frameSize: 10,
 *   sampleRate: 2,
 * });
 *
 * const slicer = new lfo.operator.Slicer({
 *   frameSize: 4,
 *   hopSize: 2
 * });
 *
 * const logger = new lfo.sink.Logger({ time: true, data: true });
 *
 * eventIn.connect(slicer);
 * slicer.connect(logger);
 * eventIn.start();
 *
 * eventIn.process(0, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
 * > { time: 0, data: [0, 1, 2, 3] }
 * > { time: 1, data: [2, 3, 4, 5] }
 * > { time: 2, data: [4, 5, 6, 7] }
 * > { time: 3, data: [6, 7, 8, 9] }
 */

var Slicer = function (_BaseLfo) {
  (0, _inherits3.default)(Slicer, _BaseLfo);

  function Slicer() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Slicer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Slicer.__proto__ || (0, _getPrototypeOf2.default)(Slicer)).call(this, definitions, options));

    var hopSize = _this.params.get('hopSize');
    var frameSize = _this.params.get('frameSize');

    if (!hopSize) _this.params.set('hopSize', frameSize);

    _this.params.addListener(_this.onParamUpdate.bind(_this));

    _this.frameIndex = 0;
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Slicer, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      var hopSize = this.params.get('hopSize');
      var frameSize = this.params.get('frameSize');

      this.streamParams.frameSize = frameSize;
      this.streamParams.frameRate = prevStreamParams.sourceSampleRate / hopSize;

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'resetStream',
    value: function resetStream() {
      (0, _get3.default)(Slicer.prototype.__proto__ || (0, _getPrototypeOf2.default)(Slicer.prototype), 'resetStream', this).call(this);
      this.frameIndex = 0;
    }

    /** @private */

  }, {
    key: 'finalizeStream',
    value: function finalizeStream(endTime) {
      if (this.frameIndex > 0) {
        var frameRate = this.streamParams.frameRate;
        var frameSize = this.streamParams.frameSize;
        var data = this.frame.data;
        // set the time of the last frame
        this.frame.time += 1 / frameRate;

        for (var i = this.frameIndex; i < frameSize; i++) {
          data[i] = 0;
        }this.propagateFrame();
      }

      (0, _get3.default)(Slicer.prototype.__proto__ || (0, _getPrototypeOf2.default)(Slicer.prototype), 'finalizeStream', this).call(this, endTime);
    }

    /** @private */

  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      this.prepareFrame();
      this.processFunction(frame);
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      var time = frame.time;
      var block = frame.data;
      var metadata = frame.metadata;

      var centeredTimeTags = this.params.get('centeredTimeTags');
      var hopSize = this.params.get('hopSize');
      var outFrame = this.frame.data;
      var frameSize = this.streamParams.frameSize;
      var sampleRate = this.streamParams.sourceSampleRate;
      var samplePeriod = 1 / sampleRate;
      var blockSize = block.length;

      var frameIndex = this.frameIndex;
      var blockIndex = 0;

      while (blockIndex < blockSize) {
        var numSkip = 0;

        // skip block samples for negative frameIndex (frameSize < hopSize)
        if (frameIndex < 0) {
          numSkip = -frameIndex;
          frameIndex = 0; // reset `frameIndex`
        }

        if (numSkip < blockSize) {
          blockIndex += numSkip; // skip block segment
          // can copy all the rest of the incoming block
          var numCopy = blockSize - blockIndex;
          // connot copy more than what fits into the frame
          var maxCopy = frameSize - frameIndex;

          if (numCopy >= maxCopy) numCopy = maxCopy;

          // copy block segment into frame
          var copy = block.subarray(blockIndex, blockIndex + numCopy);
          outFrame.set(copy, frameIndex);
          // advance block and frame index
          blockIndex += numCopy;
          frameIndex += numCopy;

          // send frame when completed
          if (frameIndex === frameSize) {
            // define time tag for the outFrame according to configuration
            if (centeredTimeTags) this.frame.time = time + (blockIndex - frameSize / 2) * samplePeriod;else this.frame.time = time + (blockIndex - frameSize) * samplePeriod;

            this.frame.metadata = metadata;
            // forward to next nodes
            this.propagateFrame();

            // shift frame left
            if (hopSize < frameSize) outFrame.set(outFrame.subarray(hopSize, frameSize), 0);

            frameIndex -= hopSize; // hop forward
          }
        } else {
          // skip entire block
          var blockRest = blockSize - blockIndex;
          frameIndex += blockRest;
          blockIndex += blockRest;
        }
      }

      this.frameIndex = frameIndex;
    }
  }]);
  return Slicer;
}(_BaseLfo3.default);

exports.default = Slicer;

},{"../../core/BaseLfo":42,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/get":59,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ceil = Math.ceil;

/**
 * paper: http://recherche.ircam.fr/equipes/pcm/cheveign/pss/2002_JASA_YIN.pdf
 * implementation based on https://github.com/ashokfernandez/Yin-Pitch-Tracking
 * @private
 */

var definitions = {
  threshold: {
    type: 'float',
    default: 0.1, // default from paper
    metas: { kind: 'static' }
  },
  downSamplingExp: { // downsampling factor
    type: 'integer',
    default: 2,
    min: 0,
    max: 3,
    metas: { kind: 'static' }
  },
  minFreq: { //
    type: 'float',
    default: 60, // mean 735 samples
    min: 0,
    metas: { kind: 'static' }
  }
};

/**
 * Yin fundamental frequency estimator, based on algorithm described in
 * [YIN, a fundamental frequency estimator for speech and music](http://recherche.ircam.fr/equipes/pcm/cheveign/pss/2002_JASA_YIN.pdf)
 * by Cheveigne and Kawahara.
 * On each frame, this operator propagate a vector containing the following
 * values: `frequency`, `probability`.
 *
 * For good results the input frame size should be large (1024 or 2048).
 *
 * _support `standalone` usage_
 *
 * @note - In node for a frame of 2048 samples, average computation time is:
 *         0.00016742283339993389 second.
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.threshold=0.1] - Absolute threshold to test the
 *  normalized difference (see paper for more informations).
 * @param {Number} [options.downSamplingExp=2] - Down sample the input frame by
 *  a factor of 2 at the power of `downSamplingExp` (min=0 and max=3) for
 *  performance improvements.
 * @param {Number} [options.minFreq=60] - Minimum frequency the operator can
 *  search for. This parameter defines the size of the autocorrelation performed
 *  on the signal, the input frame size should be around 2 time this size for
 *  good results (i.e. `inputFrameSize ≈ 2 * (samplingRate / minFreq)`).
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * // assuming some AudioBuffer
 * const source = new lfo.source.AudioInBuffer({
 *   audioBuffer: audioBuffer,
 * });
 *
 * const slicer = new lfo.operator.Slicer({
 *   frameSize: 2048,
 * });
 *
 * const yin = new lfo.operator.Yin();
 * const logger = new lfo.sink.Logger({ data: true });
 *
 * source.connect(slicer);
 * slicer.connect(yin);
 * yin.connect(logger);
 *
 * source.start();
 */

var Yin = function (_BaseLfo) {
  (0, _inherits3.default)(Yin, _BaseLfo);

  function Yin(options) {
    (0, _classCallCheck3.default)(this, Yin);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Yin.__proto__ || (0, _getPrototypeOf2.default)(Yin)).call(this, definitions, options));

    _this.probability = 0;
    _this.pitch = -1;

    _this.test = 0;
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Yin, [{
    key: '_downsample',
    value: function _downsample(input, size, output, downSamplingExp) {
      var outputSize = size >> downSamplingExp;
      var i = void 0,
          j = void 0;

      switch (downSamplingExp) {
        case 0:
          // no down sampling
          for (i = 0; i < size; i++) {
            output[i] = input[i];
          }break;
        case 1:
          for (i = 0, j = 0; i < outputSize; i++, j += 2) {
            output[i] = 0.5 * (input[j] + input[j + 1]);
          }break;
        case 2:
          for (i = 0, j = 0; i < outputSize; i++, j += 4) {
            output[i] = 0.25 * (input[j] + input[j + 1] + input[j + 2] + input[j + 3]);
          }break;
        case 3:
          for (i = 0, j = 0; i < outputSize; i++, j += 8) {
            output[i] = 0.125 * (input[j] + input[j + 1] + input[j + 2] + input[j + 3] + input[j + 4] + input[j + 5] + input[j + 6] + input[j + 7]);
          }break;
      }

      return outputSize;
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      this.streamParams.frameType = 'vector';
      this.streamParams.frameSize = 2;
      this.streamParams.description = ['frequency', 'confidence'];

      this.inputFrameSize = prevStreamParams.frameSize;
      // handle params
      var sourceSampleRate = this.streamParams.sourceSampleRate;
      var downSamplingExp = this.params.get('downSamplingExp');
      var downFactor = 1 << downSamplingExp; // 2^n
      var downSR = sourceSampleRate / downFactor;
      var downFrameSize = this.inputFrameSize / downFactor; // n_tick_down // 1 / 2^n

      var minFreq = this.params.get('minFreq');
      // limit min freq, cf. paper IV. sensitivity to parameters
      var minFreqNbrSamples = downSR / minFreq;
      // const bufferSize = prevStreamParams.frameSize;
      this.halfBufferSize = downFrameSize / 2;

      // minimum error to not crash but not enought to have results
      if (minFreqNbrSamples > this.halfBufferSize) throw new Error('Invalid input frame size, too small for given "minFreq"');

      this.downSamplingExp = downSamplingExp;
      this.downSamplingRate = downSR;
      this.downFrameSize = downFrameSize;
      this.buffer = new Float32Array(downFrameSize);
      // autocorrelation buffer
      this.yinBuffer = new Float32Array(this.halfBufferSize);

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: '_downsample',
    value: function _downsample(input, size, output, downSamplingExp) {
      var outputSize = size >> downSamplingExp;
      var i = void 0,
          j = void 0;

      switch (downSamplingExp) {
        case 0:
          // no down sampling
          for (i = 0; i < size; i++) {
            output[i] = input[i];
          }break;
        case 1:
          for (i = 0, j = 0; i < outputSize; i++, j += 2) {
            output[i] = 0.5 * (input[j] + input[j + 1]);
          }break;
        case 2:
          for (i = 0, j = 0; i < outputSize; i++, j += 4) {
            output[i] = 0.25 * (input[j] + input[j + 1] + input[j + 2] + input[j + 3]);
          }break;
        case 3:
          for (i = 0, j = 0; i < outputSize; i++, j += 8) {
            output[i] = 0.125 * (input[j] + input[j + 1] + input[j + 2] + input[j + 3] + input[j + 4] + input[j + 5] + input[j + 6] + input[j + 7]);
          }break;
      }

      return outputSize;
    }

    /**
     * Step 1, 2 and 3 - Squared difference of the shifted signal with itself.
     * cumulative mean normalized difference.
     *
     * @private
     */

  }, {
    key: '_normalizedDifference',
    value: function _normalizedDifference(buffer) {
      var halfBufferSize = this.halfBufferSize;
      var yinBuffer = this.yinBuffer;
      var sum = 0;

      // difference for different shift values (tau)
      for (var tau = 0; tau < halfBufferSize; tau++) {
        var squaredDifference = 0; // reset buffer

        // take difference of the signal with a shifted version of itself then
        // sqaure the result
        for (var i = 0; i < halfBufferSize; i++) {
          var delta = buffer[i] - buffer[i + tau];
          squaredDifference += delta * delta;
        }

        // step 3 - normalize yinBuffer
        if (tau > 0) {
          sum += squaredDifference;
          yinBuffer[tau] = squaredDifference * (tau / sum);
        }
      }

      yinBuffer[0] = 1;
    }

    /**
     * Step 4 - find first best tau that is under the thresold.
     *
     * @private
     */

  }, {
    key: '_absoluteThreshold',
    value: function _absoluteThreshold() {
      var threshold = this.params.get('threshold');
      var yinBuffer = this.yinBuffer;
      var halfBufferSize = this.halfBufferSize;
      var tau = void 0;

      for (tau = 1; tau < halfBufferSize; tau++) {
        if (yinBuffer[tau] < threshold) {
          // keep increasing tau if next value is better
          while (tau + 1 < halfBufferSize && yinBuffer[tau + 1] < yinBuffer[tau]) {
            tau += 1;
          } // best tau found , yinBuffer[tau] can be seen as an estimation of
          // aperiodicity then: periodicity = 1 - aperiodicity
          this.probability = 1 - yinBuffer[tau];
          break;
        }
      }

      // return -1 if not match found
      return tau === halfBufferSize ? -1 : tau;
    }

    /**
     * Step 5 - Find a better fractionnal approximate of tau.
     * this can probably be simplified...
     *
     * @private
     */

  }, {
    key: '_parabolicInterpolation',
    value: function _parabolicInterpolation(tauEstimate) {
      var halfBufferSize = this.halfBufferSize;
      var yinBuffer = this.yinBuffer;
      var betterTau = void 0;
      // @note - tauEstimate cannot be zero as the loop start at 1 in step 4
      var x0 = tauEstimate - 1;
      var x2 = tauEstimate < halfBufferSize - 1 ? tauEstimate + 1 : tauEstimate;

      // if `tauEstimate` is last index, we can't interpolate
      if (x2 === tauEstimate) {
        betterTau = tauEstimate;
      } else {
        var s0 = yinBuffer[x0];
        var s1 = yinBuffer[tauEstimate];
        var s2 = yinBuffer[x2];

        // @note - don't fully understand this formula neither...
        betterTau = tauEstimate + (s2 - s0) / (2 * (2 * s1 - s2 - s0));
      }

      return betterTau;
    }

    /**
     * Use the `Yin` operator in `standalone` mode (i.e. outside of a graph).
     *
     * @param {Array|Float32Array} input - The signal fragment to process.
     * @return {Array} - Array containing the `frequency`, `energy`, `periodicity`
     *  and `AC1`
     *
     * @example
     * import * as lfo from 'waves-lfo/client';
     *
     * const yin = new lfo.operator.Yin();
     * yin.initStream({
     *   frameSize: 2048,
     *   frameType: 'signal',
     *   sourceSampleRate: 44100
     * });
     *
     * const results = yin.inputSignal(signal);
     */

  }, {
    key: 'inputSignal',
    value: function inputSignal(input) {
      this.pitch = -1;
      this.probability = 0;

      var buffer = this.buffer;
      var inputFrameSize = this.inputFrameSize;
      var downSamplingExp = this.downSamplingExp;
      var sampleRate = this.downSamplingRate;
      var outData = this.frame.data;
      var tauEstimate = -1;

      // subsampling
      this._downsample(input, inputFrameSize, buffer, downSamplingExp);
      // step 1, 2, 3 - normalized squared difference of the signal with a
      // shifted version of itself
      this._normalizedDifference(buffer);
      // step 4 - find first best tau estimate that is over the threshold
      tauEstimate = this._absoluteThreshold();

      if (tauEstimate !== -1) {
        // step 5 - so far tau is an integer shift of the signal, check if
        // there is a better fractionnal value around
        tauEstimate = this._parabolicInterpolation(tauEstimate);
        this.pitch = sampleRate / tauEstimate;
      }

      outData[0] = this.pitch;
      outData[1] = this.probability;

      return outData;
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      this.inputSignal(frame.data);
    }
  }]);
  return Yin;
}(_BaseLfo3.default);

exports.default = Yin;

},{"../../core/BaseLfo":42,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Biquad = require('./Biquad');

var _Biquad2 = _interopRequireDefault(_Biquad);

var _Dct = require('./Dct');

var _Dct2 = _interopRequireDefault(_Dct);

var _Fft = require('./Fft');

var _Fft2 = _interopRequireDefault(_Fft);

var _Magnitude = require('./Magnitude');

var _Magnitude2 = _interopRequireDefault(_Magnitude);

var _MeanStddev = require('./MeanStddev');

var _MeanStddev2 = _interopRequireDefault(_MeanStddev);

var _Mel = require('./Mel');

var _Mel2 = _interopRequireDefault(_Mel);

var _Mfcc = require('./Mfcc');

var _Mfcc2 = _interopRequireDefault(_Mfcc);

var _MinMax = require('./MinMax');

var _MinMax2 = _interopRequireDefault(_MinMax);

var _MovingAverage = require('./MovingAverage');

var _MovingAverage2 = _interopRequireDefault(_MovingAverage);

var _MovingMedian = require('./MovingMedian');

var _MovingMedian2 = _interopRequireDefault(_MovingMedian);

var _OnOff = require('./OnOff');

var _OnOff2 = _interopRequireDefault(_OnOff);

var _Rms = require('./Rms');

var _Rms2 = _interopRequireDefault(_Rms);

var _Segmenter = require('./Segmenter');

var _Segmenter2 = _interopRequireDefault(_Segmenter);

var _Select = require('./Select');

var _Select2 = _interopRequireDefault(_Select);

var _Slicer = require('./Slicer');

var _Slicer2 = _interopRequireDefault(_Slicer);

var _Yin = require('./Yin');

var _Yin2 = _interopRequireDefault(_Yin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Biquad: _Biquad2.default,
  Dct: _Dct2.default,
  Fft: _Fft2.default,
  Magnitude: _Magnitude2.default,
  MeanStddev: _MeanStddev2.default,
  Mel: _Mel2.default,
  Mfcc: _Mfcc2.default,
  MinMax: _MinMax2.default,
  MovingAverage: _MovingAverage2.default,
  MovingMedian: _MovingMedian2.default,
  OnOff: _OnOff2.default,
  Rms: _Rms2.default,
  Segmenter: _Segmenter2.default,
  Select: _Select2.default,
  Slicer: _Slicer2.default,
  Yin: _Yin2.default
};

},{"./Biquad":19,"./Dct":20,"./Fft":21,"./Magnitude":22,"./MeanStddev":23,"./Mel":24,"./Mfcc":25,"./MinMax":26,"./MovingAverage":27,"./MovingMedian":28,"./OnOff":29,"./Rms":30,"./Segmenter":31,"./Select":32,"./Slicer":33,"./Yin":34}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  processFrame: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' }
  },
  finalizeStream: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Create a bridge between the graph and application logic. Handle `push`
 * and `pull` paradigms.
 *
 * This sink can handle any type of input (`signal`, `vector`, `scalar`)
 *
 * @memberof module:common.sink
 *
 * @param {Object} options - Override default parameters.
 * @param {Function} [options.processFrame=null] - Callback executed on each
 *  `processFrame` call.
 * @param {Function} [options.finalizeStream=null] - Callback executed on each
 *  `finalizeStream` call.
 *
 * @see {@link module:common.core.BaseLfo#processFrame}
 * @see {@link module:common.core.BaseLfo#processStreamParams}
 *
 * @example
 * import * as lfo from 'waves-lfo/common';
 *
 * const frames = [
 *  { time: 0, data: [0, 1] },
 *  { time: 1, data: [1, 2] },
 * ];
 *
 * const eventIn = new EventIn({
 *   frameType: 'vector',
 *   frameSize: 2,
 *   frameRate: 1,
 * });
 *
 * const bridge = new Bridge({
 *   processFrame: (frame) => console.log(frame),
 * });
 *
 * eventIn.connect(bridge);
 * eventIn.start();
 *
 * // callback executed on each frame
 * eventIn.processFrame(frame[0]);
 * > { time: 0, data: [0, 1] }
 * eventIn.processFrame(frame[1]);
 * > { time: 1, data: [1, 2] }
 *
 * // pull current frame when needed
 * console.log(bridge.frame);
 * > { time: 1, data: [1, 2] }
 */

var Bridge = function (_BaseLfo) {
  (0, _inherits3.default)(Bridge, _BaseLfo);

  function Bridge() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Bridge);
    return (0, _possibleConstructorReturn3.default)(this, (Bridge.__proto__ || (0, _getPrototypeOf2.default)(Bridge)).call(this, definitions, options));
  }

  /** @private */


  (0, _createClass3.default)(Bridge, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);
      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'finalizeStream',
    value: function finalizeStream(endTime) {
      var finalizeStreamCallback = this.params.get('finalizeStream');

      if (finalizeStreamCallback !== null) finalizeStreamCallback(endTime);
    }

    // process any type
    /** @private */

  }, {
    key: 'processScalar',
    value: function processScalar() {}
    /** @private */

  }, {
    key: 'processVector',
    value: function processVector() {}
    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal() {}

    /** @private */

  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      this.prepareFrame();

      var processFrameCallback = this.params.get('processFrame');
      var output = this.frame;
      output.data = new Float32Array(this.streamParams.frameSize);
      // pull interface (we copy data since we don't know what could
      // be done outside the graph)
      for (var i = 0; i < this.streamParams.frameSize; i++) {
        output.data[i] = frame.data[i];
      }output.time = frame.time;
      output.metadata = frame.metadata;

      // `push` interface
      if (processFrameCallback !== null) processFrameCallback(output);
    }
  }]);
  return Bridge;
}(_BaseLfo3.default);

exports.default = Bridge;

},{"../../core/BaseLfo":42,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  separateArrays: {
    type: 'boolean',
    default: false,
    constant: true
  },
  callback: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Record input frames from a graph. This sink can handle `signal`, `vector`
 * or `scalar` inputs.
 *
 * When the recording is stopped (either by calling `stop` on the node or when
 * the stream is finalized), the callback given as parameter is executed with
 * the recorder data as argument.
 *
 *
 * @param {Object} options - Override default parameters.
 * @param {Boolean} [options.separateArrays=false] - Format of the retrieved
 *  values:
 *  - when `false`, format is [{ time, data }, { time, data }, ...]
 *  - when `true`, format is { time: [...], data: [...] }
 * @param {Function} [options.callback] - Callback to execute when a new record
 *  is ended. This can happen when: `stop` is called on the recorder, or `stop`
 *  is called on the source.
 *
 * @todo - Add auto record param.
 *
 * @memberof module:common.sink
 *
 * @example
 * import * as lfo from 'waves-lfo/common';
 *
 * const eventIn = new lfo.source.EventIn({
 *  frameType: 'vector',
 *  frameSize: 2,
 *  frameRate: 0,
 * });
 *
 * const recorder = new lfo.sink.DataRecorder({
 *   callback: (data) => console.log(data),
 * });
 *
 * eventIn.connect(recorder);
 * eventIn.start();
 * recorder.start();
 *
 * eventIn.process(0, [0, 1]);
 * eventIn.process(1, [1, 2]);
 *
 * recorder.stop();
 * > [{ time: 0, data: [0, 1] }, { time: 1, data: [1, 2] }];
 */

var DataRecorder = function (_BaseLfo) {
  (0, _inherits3.default)(DataRecorder, _BaseLfo);

  function DataRecorder() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, DataRecorder);

    /**
     * Define if the node is currently recording.
     *
     * @type {Boolean}
     * @name isRecording
     * @instance
     * @memberof module:sink.SignalRecorder
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (DataRecorder.__proto__ || (0, _getPrototypeOf2.default)(DataRecorder)).call(this, definitions, options));

    _this.isRecording = false;
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(DataRecorder, [{
    key: '_initStore',
    value: function _initStore() {
      var separateArrays = this.params.get('separateArrays');

      if (separateArrays) this._store = { time: [], data: [] };else this._store = [];
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);
      this._initStore();
      this.propagateStreamParams();
    }

    /**
     * Start recording.
     *
     * @see {@link module:client.sink.DataRecorder#stop}
     */

  }, {
    key: 'start',
    value: function start() {
      this.isRecording = true;
    }

    /**
     * Stop recording and execute the callback defined in parameters.
     *
     * @see {@link module:client.sink.DataRecorder#start}
     */

  }, {
    key: 'stop',
    value: function stop() {
      if (this.isRecording) {
        this.isRecording = false;
        var callback = this.params.get('callback');

        if (callback !== null) callback(this._store);

        this._initStore();
      }
    }

    /** @private */

  }, {
    key: 'finalizeStream',
    value: function finalizeStream() {
      this.stop();
    }

    // handle any input types
    /** @private */

  }, {
    key: 'processScalar',
    value: function processScalar(frame) {}
    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {}
    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame) {}
  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      if (this.isRecording) {
        this.prepareFrame(frame);

        var separateArrays = this.params.get('separateArrays');
        var entry = {
          time: frame.time,
          data: new Float32Array(frame.data)
        };

        if (!separateArrays) {
          this._store.push(entry);
        } else {
          this._store.time.push(entry.time);
          this._store.data.push(entry.data);
        }
      }
    }
  }]);
  return DataRecorder;
}(_BaseLfo3.default);

exports.default = DataRecorder;

},{"../../core/BaseLfo":42,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  time: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  },
  data: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  },
  metadata: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  },
  streamParams: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  },
  frameIndex: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Log `frame.time`, `frame.data`, `frame.metadata` and/or
 * `streamAttributes` of any node in the console.
 *
 * This sink can handle any type if input (`signal`, `vector`, `scalar`)
 *
 * @param {Object} options - Override parameters default values.
 * @param {Boolean} [options.time=false] - Log incomming `frame.time` if `true`.
 * @param {Boolean} [options.data=false] - Log incomming `frame.data` if `true`.
 * @param {Boolean} [options.metadata=false] - Log incomming `frame.metadata`
 *  if `true`.
 * @param {Boolean} [options.streamParams=false] - Log `streamParams` of the
 *  previous node when graph is started.
 * @param {Boolean} [options.frameIndex=false] - Log index of the incomming
 *  `frame`.
 *
 * @memberof module:common.sink
 *
 * @example
 * import * as lfo from 'waves-lfo/common';
 *
 * const logger = new lfo.sink.Logger({ data: true });
 * whateverOperator.connect(logger);
 */

var Logger = function (_BaseLfo) {
  (0, _inherits3.default)(Logger, _BaseLfo);

  function Logger(options) {
    (0, _classCallCheck3.default)(this, Logger);
    return (0, _possibleConstructorReturn3.default)(this, (Logger.__proto__ || (0, _getPrototypeOf2.default)(Logger)).call(this, definitions, options));
  }

  /** @private */


  (0, _createClass3.default)(Logger, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      if (this.params.get('streamParams') === true) console.log(prevStreamParams);

      this.frameIndex = 0;
    }

    /** @private */

  }, {
    key: 'processFunction',
    value: function processFunction(frame) {
      if (this.params.get('frameIndex') === true) console.log(this.frameIndex++);

      if (this.params.get('time') === true) console.log(frame.time);

      if (this.params.get('data') === true) console.log(frame.data);

      if (this.params.get('metadata') === true) console.log(frame.metadata);
    }
  }]);
  return Logger;
}(_BaseLfo3.default);

exports.default = Logger;

},{"../../core/BaseLfo":42,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  duration: {
    type: 'float',
    default: 10,
    min: 0,
    metas: { kind: 'static' }
  },
  callback: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' }
  },
  ignoreLeadingZeros: {
    type: 'boolean',
    default: true,
    metas: { kind: 'static' }
  },
  retrieveAudioBuffer: {
    type: 'boolean',
    default: false,
    constant: true
  },
  audioContext: {
    type: 'any',
    default: null,
    nullable: true
  }
};

/**
 * Record an `signal` input stream of arbitrary duration and retrieve it
 * when done.
 *
 * When recording is stopped (either when the `stop` method is called, the
 * defined duration has been recorded, or the source of the graph finalized
 * the stream), the callback given as parameter is executed  with the
 * `AudioBuffer` or `Float32Array` containing the recorded signal as argument.
 *
 * @todo - add option to return only the Float32Array and not an audio buffer
 *  (node compliant) `retrieveAudioBuffer: false`
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.duration=10] - Maximum duration of the recording.
 * @param {Number} [options.callback] - Callback to execute when a new record is
 *  ended. This can happen: `stop` is called on the recorder, `stop` is called
 *  on the source or when the buffer is full according to the given `duration`.
 * @param {Object} [options.ignoreLeadingZeros=true] - Start the effective
 *  recording on the first non-zero value.
 * @param {Boolean} [options.retrieveAudioBuffer=false] - Define if an `AudioBuffer`
 *  should be retrieved or only the raw Float32Array of data.
 *  (works only in browser)
 * @param {AudioContext} [options.audioContext=null] - If
 *  `retrieveAudioBuffer` is set to `true`, audio context to be used
 *  in order to create the final audio buffer.
 *  (works only in browser)
 *
 * @memberof module:common.sink
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const audioContext = new AudioContext();
 *
 * navigator.mediaDevices
 *   .getUserMedia({ audio: true })
 *   .then(init)
 *   .catch((err) => console.error(err.stack));
 *
 * function init(stream) {
 *   const source = audioContext.createMediaStreamSource(stream);
 *
 *   const audioInNode = new lfo.source.AudioInNode({
 *     sourceNode: source,
 *     audioContext: audioContext,
 *   });
 *
 *   const signalRecorder = new lfo.sink.SignalRecorder({
 *     duration: 6,
 *     retrieveAudioBuffer: true,
 *     audioContext: audioContext,
 *     callback: (buffer) => {
 *       const bufferSource = audioContext.createBufferSource();
 *       bufferSource.buffer = buffer;
 *       bufferSource.connect(audioContext.destination);
 *       bufferSource.start();
 *     }
 *   });
 *
 *   audioInNode.connect(signalRecorder);
 *   audioInNode.start();
 *   signalRecorder.start();
 * });
 */

var SignalRecorder = function (_BaseLfo) {
  (0, _inherits3.default)(SignalRecorder, _BaseLfo);

  function SignalRecorder() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, SignalRecorder);

    /**
     * Define is the node is currently recording or not.
     *
     * @type {Boolean}
     * @name isRecording
     * @instance
     * @memberof module:client.sink.SignalRecorder
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (SignalRecorder.__proto__ || (0, _getPrototypeOf2.default)(SignalRecorder)).call(this, definitions, options));

    _this.isRecording = false;

    var retrieveAudioBuffer = _this.params.get('retrieveAudioBuffer');
    var audioContext = _this.params.get('audioContext');
    // needed to retrieve an AudioBuffer
    if (retrieveAudioBuffer && audioContext === null) throw new Error('Invalid parameter "audioContext": an AudioContext must be provided when `retrieveAudioBuffer` is set to `true`');

    _this._audioContext = audioContext;
    _this._ignoreZeros = false;
    _this._isInfiniteBuffer = false;
    _this._stack = [];
    _this._buffer = null;
    _this._bufferLength = null;
    _this._currentIndex = null;
    return _this;
  }

  (0, _createClass3.default)(SignalRecorder, [{
    key: '_initBuffer',
    value: function _initBuffer() {
      this._buffer = new Float32Array(this._bufferLength);
      this._stack.length = 0;
      this._currentIndex = 0;
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      var duration = this.params.get('duration');
      var sampleRate = this.streamParams.sourceSampleRate;

      if (isFinite(duration)) {
        this._isInfiniteBuffer = false;
        this._bufferLength = sampleRate * duration;
      } else {
        this._isInfiniteBuffer = true;
        this._bufferLength = sampleRate * 10;
      }

      this._initBuffer();
      this.propagateStreamParams();
    }

    /**
     * Start recording.
     */

  }, {
    key: 'start',
    value: function start() {
      this.isRecording = true;
      this._ignoreZeros = this.params.get('ignoreLeadingZeros');
    }

    /**
     * Stop recording and execute the callback defined in parameters.
     */

  }, {
    key: 'stop',
    value: function stop() {
      if (this.isRecording) {
        // ignore next incomming frame
        this.isRecording = false;

        var retrieveAudioBuffer = this.params.get('retrieveAudioBuffer');
        var callback = this.params.get('callback');
        var currentIndex = this._currentIndex;
        var buffer = this._buffer;
        var output = void 0;

        if (!this._isInfiniteBuffer) {
          output = new Float32Array(currentIndex);
          output.set(buffer.subarray(0, currentIndex), 0);
        } else {
          var bufferLength = this._bufferLength;
          var stack = this._stack;

          output = new Float32Array(stack.length * bufferLength + currentIndex);

          // copy all stacked buffers
          for (var i = 0; i < stack.length; i++) {
            var stackedBuffer = stack[i];
            output.set(stackedBuffer, bufferLength * i);
          };
          // copy data contained in current buffer
          output.set(buffer.subarray(0, currentIndex), stack.length * bufferLength);
        }

        if (retrieveAudioBuffer && this._audioContext) {
          var length = output.length;
          var sampleRate = this.streamParams.sourceSampleRate;
          var audioBuffer = this._audioContext.createBuffer(1, length, sampleRate);
          var channelData = audioBuffer.getChannelData(0);
          channelData.set(output, 0);

          callback(audioBuffer);
        } else {
          callback(output);
        }

        // reinit buffer, stack, and currentIndex
        this._initBuffer();
      }
    }

    /** @private */

  }, {
    key: 'finalizeStream',
    value: function finalizeStream(endTime) {
      this.stop();
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      if (!this.isRecording) return;

      var block = null;
      var input = frame.data;
      var bufferLength = this._bufferLength;
      var buffer = this._buffer;

      if (this._ignoreZeros === false) {
        block = new Float32Array(input);
      } else if (input[input.length - 1] !== 0) {
        // find first index where value !== 0
        var i = void 0;

        for (i = 0; i < input.length; i++) {
          if (input[i] !== 0) break;
        } // copy non zero segment
        block = new Float32Array(input.subarray(i));
        // don't repeat this logic once a non-zero value has been found
        this._ignoreZeros = false;
      }

      if (block !== null) {
        var availableSpace = bufferLength - this._currentIndex;
        var currentBlock = void 0;

        if (availableSpace < block.length) currentBlock = block.subarray(0, availableSpace);else currentBlock = block;

        buffer.set(currentBlock, this._currentIndex);
        this._currentIndex += currentBlock.length;

        if (this._isInfiniteBuffer && this._currentIndex === bufferLength) {
          this._stack.push(buffer);

          currentBlock = block.subarray(availableSpace);
          this._buffer = new Float32Array(bufferLength);
          this._buffer.set(currentBlock, 0);
          this._currentIndex = currentBlock.length;
        }

        //  stop if the buffer is finite and full
        if (!this._isInfiniteBuffer && this._currentIndex === bufferLength) this.stop();
      }
    }
  }]);
  return SignalRecorder;
}(_BaseLfo3.default);

exports.default = SignalRecorder;

},{"../../core/BaseLfo":42,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],40:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isFinite = require('babel-runtime/core-js/number/is-finite');

var _isFinite2 = _interopRequireDefault(_isFinite);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// http://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
var isNode = new Function('try { return this === global; } catch(e) { return false }');

/**
 * Create a function that returns time in seconds according to the current
 * environnement (node or browser).
 * If running in node the time rely on `process.hrtime`, while if in the browser
 * it is provided by the `currentTime` of an `AudioContext`, this context can
 * optionnaly be provided to keep time consistency between several `EventIn`
 * nodes.
 *
 * @param {AudioContext} [audioContext=null] - Optionnal audio context.
 * @return {Function}
 * @private
 */
function getTimeFunction() {
  var audioContext = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  if (isNode()) {
    return function () {
      var t = process.hrtime();
      return t[0] + t[1] * 1e-9;
    };
  } else {
    if (audioContext === null || !audioContext instanceof AudioContext) {
      var _AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new _AudioContext();
    }

    return function () {
      return audioContext.currentTime;
    };
  }
}

var definitions = {
  absoluteTime: {
    type: 'boolean',
    default: false,
    constant: true
  },
  audioContext: {
    type: 'any',
    default: null,
    constant: true,
    nullable: true
  },
  frameType: {
    type: 'enum',
    list: ['signal', 'vector', 'scalar'],
    default: 'signal',
    constant: true
  },
  frameSize: {
    type: 'integer',
    default: 1,
    min: 1,
    max: +Infinity, // not recommended...
    metas: { kind: 'static' }
  },
  sampleRate: {
    type: 'float',
    default: null,
    min: 0,
    max: +Infinity, // same here
    nullable: true,
    metas: { kind: 'static' }
  },
  frameRate: {
    type: 'float',
    default: null,
    min: 0,
    max: +Infinity, // same here
    nullable: true,
    metas: { kind: 'static' }
  },
  description: {
    type: 'any',
    default: null,
    constant: true
  }
};

/**
 * The `EventIn` operator allows to manually create a stream of data or to feed
 * a stream from another source (e.g. sensors) into a processing graph.
 *
 * @param {Object} options - Override parameters' default values.
 * @param {String} [options.frameType='signal'] - Type of the input - allowed
 * values: `signal`,  `vector` or `scalar`.
 * @param {Number} [options.frameSize=1] - Size of the output frame.
 * @param {Number} [options.sampleRate=null] - Sample rate of the source stream,
 *  if of type `signal`.
 * @param {Number} [options.frameRate=null] - Rate of the source stream, if of
 *  type `vector`.
 * @param {Array|String} [options.description] - Optionnal description
 *  describing the dimensions of the output frame
 * @param {Boolean} [options.absoluteTime=false] - Define if time should be used
 *  as forwarded as given in the process method, or relatively to the time of
 *  the first `process` call after start.
 *
 * @memberof module:common.source
 *
 * @todo - Add a `logicalTime` parameter to tag frame according to frame rate.
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameType: 'vector',
 *   frameSize: 3,
 *   frameRate: 1 / 50,
 *   description: ['alpha', 'beta', 'gamma'],
 * });
 *
 * // connect source to operators and sink(s)
 *
 * // initialize and start the graph
 * eventIn.start();
 *
 * // feed `deviceorientation` data into the graph
 * window.addEventListener('deviceorientation', (e) => {
 *   const frame = {
 *     time: new Date().getTime(),
 *     data: [e.alpha, e.beta, e.gamma],
 *   };
 *
 *   eventIn.processFrame(frame);
 * }, false);
 */

var EventIn = function (_BaseLfo) {
  (0, _inherits3.default)(EventIn, _BaseLfo);

  function EventIn() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, EventIn);

    var _this = (0, _possibleConstructorReturn3.default)(this, (EventIn.__proto__ || (0, _getPrototypeOf2.default)(EventIn)).call(this, definitions, options));

    var audioContext = _this.params.get('audioContext');
    _this._getTime = getTimeFunction(audioContext);
    _this._isStarted = false;
    _this._startTime = null;
    _this._systemTime = null;
    _this._absoluteTime = _this.params.get('absoluteTime');
    return _this;
  }

  /**
   * Propagate the `streamParams` in the graph and allow to push frames into
   * the graph. Any call to `process` or `processFrame` before `start` will be
   * ignored.
   *
   * @see {@link module:common.core.BaseLfo#processStreamParams}
   * @see {@link module:common.core.BaseLfo#resetStream}
   * @see {@link module:common.source.EventIn#stop}
   */


  (0, _createClass3.default)(EventIn, [{
    key: 'start',
    value: function start() {
      var startTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      this.initStream();

      this._startTime = startTime;
      this._isStarted = true;
      // values set in the first `process` call
      this._systemTime = null;
    }

    /**
     * Finalize the stream and stop the whole graph. Any call to `process` or
     * `processFrame` after `stop` will be ignored.
     *
     * @see {@link module:common.core.BaseLfo#finalizeStream}
     * @see {@link module:common.source.EventIn#start}
     */

  }, {
    key: 'stop',
    value: function stop() {
      if (this._isStarted && this._startTime !== null) {
        var currentTime = this._getTime();
        var endTime = this.frame.time + (currentTime - this._systemTime);

        this.finalizeStream(endTime);
        this._isStarted = false;
      }
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams() {
      var frameSize = this.params.get('frameSize');
      var frameType = this.params.get('frameType');
      var sampleRate = this.params.get('sampleRate');
      var frameRate = this.params.get('frameRate');
      var description = this.params.get('description');
      // init operator's stream params
      this.streamParams.frameSize = frameType === 'scalar' ? 1 : frameSize;
      this.streamParams.frameType = frameType;
      this.streamParams.description = description;

      if (frameType === 'signal') {
        if (sampleRate === null) throw new Error('Undefined "sampleRate" for "signal" stream');

        this.streamParams.sourceSampleRate = sampleRate;
        this.streamParams.frameRate = sampleRate / frameSize;
        this.streamParams.sourceSampleCount = frameSize;
      } else if (frameType === 'vector' || frameType === 'scalar') {
        if (frameRate === null) throw new Error('Undefined "frameRate" for "vector" stream');

        this.streamParams.frameRate = frameRate;
        this.streamParams.sourceSampleRate = frameRate;
        this.streamParams.sourceSampleCount = 1;
      }

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processFunction',
    value: function processFunction(frame) {
      var currentTime = this._getTime();
      var inData = frame.data.length ? frame.data : [frame.data];
      var outData = this.frame.data;
      // if no time provided, use system time
      var time = (0, _isFinite2.default)(frame.time) ? frame.time : currentTime;

      if (this._startTime === null) this._startTime = time;

      if (this._absoluteTime === false) time = time - this._startTime;

      for (var i = 0, l = this.streamParams.frameSize; i < l; i++) {
        outData[i] = inData[i];
      }this.frame.time = time;
      this.frame.metadata = frame.metadata;
      // store current time to compute `endTime` on stop
      this._systemTime = currentTime;
    }

    /**
     * Alternative interface to propagate a frame in the graph. Pack `time`,
     * `data` and `metadata` in a frame object.
     *
     * @param {Number} time - Frame time.
     * @param {Float32Array|Array} data - Frame data.
     * @param {Object} metadata - Optionnal frame metadata.
     *
     * @example
     * eventIn.process(1, [0, 1, 2]);
     * // is equivalent to
     * eventIn.processFrame({ time: 1, data: [0, 1, 2] });
     */

  }, {
    key: 'process',
    value: function process(time, data) {
      var metadata = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      this.processFrame({ time: time, data: data, metadata: metadata });
    }

    /**
     * Propagate a frame object in the graph.
     *
     * @param {Object} frame - Input frame.
     * @param {Number} frame.time - Frame time.
     * @param {Float32Array|Array} frame.data - Frame data.
     * @param {Object} [frame.metadata=undefined] - Optionnal frame metadata.
     *
     * @example
     * eventIn.processFrame({ time: 1, data: [0, 1, 2] });
     */

  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      if (!this._isStarted) return;

      this.prepareFrame();
      this.processFunction(frame);
      this.propagateFrame();
    }
  }]);
  return EventIn;
}(_BaseLfo3.default);

exports.default = EventIn;

}).call(this,require('_process'))

},{"../../core/BaseLfo":42,"_process":45,"babel-runtime/core-js/number/is-finite":47,"babel-runtime/core-js/object/get-prototype-of":52,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"babel-runtime/helpers/inherits":60,"babel-runtime/helpers/possibleConstructorReturn":61}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

// shortcuts / helpers
var PI = Math.PI;
var cos = Math.cos;
var sin = Math.sin;
var sqrt = Math.sqrt;

// window creation functions
function initHannWindow(buffer, size, normCoefs) {
  var linSum = 0;
  var powSum = 0;
  var step = 2 * PI / size;

  for (var i = 0; i < size; i++) {
    var phi = i * step;
    var value = 0.5 - 0.5 * cos(phi);

    buffer[i] = value;

    linSum += value;
    powSum += value * value;
  }

  normCoefs.linear = size / linSum;
  normCoefs.power = sqrt(size / powSum);
}

function initHammingWindow(buffer, size, normCoefs) {
  var linSum = 0;
  var powSum = 0;
  var step = 2 * PI / size;

  for (var i = 0; i < size; i++) {
    var phi = i * step;
    var value = 0.54 - 0.46 * cos(phi);

    buffer[i] = value;

    linSum += value;
    powSum += value * value;
  }

  normCoefs.linear = size / linSum;
  normCoefs.power = sqrt(size / powSum);
}

function initBlackmanWindow(buffer, size, normCoefs) {
  var linSum = 0;
  var powSum = 0;
  var step = 2 * PI / size;

  for (var i = 0; i < size; i++) {
    var phi = i * step;
    var value = 0.42 - 0.5 * cos(phi) + 0.08 * cos(2 * phi);

    buffer[i] = value;

    linSum += value;
    powSum += value * value;
  }

  normCoefs.linear = size / linSum;
  normCoefs.power = sqrt(size / powSum);
}

function initBlackmanHarrisWindow(buffer, size, normCoefs) {
  var linSum = 0;
  var powSum = 0;
  var a0 = 0.35875;
  var a1 = 0.48829;
  var a2 = 0.14128;
  var a3 = 0.01168;
  var step = 2 * PI / size;

  for (var i = 0; i < size; i++) {
    var phi = i * step;
    var value = a0 - a1 * cos(phi) + a2 * cos(2 * phi);-a3 * cos(3 * phi);

    buffer[i] = value;

    linSum += value;
    powSum += value * value;
  }

  normCoefs.linear = size / linSum;
  normCoefs.power = sqrt(size / powSum);
}

function initSineWindow(buffer, size, normCoefs) {
  var linSum = 0;
  var powSum = 0;
  var step = PI / size;

  for (var i = 0; i < size; i++) {
    var phi = i * step;
    var value = sin(phi);

    buffer[i] = value;

    linSum += value;
    powSum += value * value;
  }

  normCoefs.linear = size / linSum;
  normCoefs.power = sqrt(size / powSum);
}

function initRectangleWindow(buffer, size, normCoefs) {
  for (var i = 0; i < size; i++) {
    buffer[i] = 1;
  } // @todo - check if these are proper values
  normCoefs.linear = 1;
  normCoefs.power = 1;
}

/**
 * Create a buffer with window signal.
 *
 * @memberof module:common.utils
 *
 * @param {String} name - Name of the window.
 * @param {Float32Array} buffer - Buffer to be populated with the window signal.
 * @param {Number} size - Size of the buffer.
 * @param {Object} normCoefs - Object to be populated with the normailzation
 *  coefficients.
 */
function initWindow(name, buffer, size, normCoefs) {
  name = name.toLowerCase();

  switch (name) {
    case 'hann':
    case 'hanning':
      initHannWindow(buffer, size, normCoefs);
      break;
    case 'hamming':
      initHammingWindow(buffer, size, normCoefs);
      break;
    case 'blackman':
      initBlackmanWindow(buffer, size, normCoefs);
      break;
    case 'blackmanharris':
      initBlackmanHarrisWindow(buffer, size, normCoefs);
      break;
    case 'sine':
      initSineWindow(buffer, size, normCoefs);
      break;
    case 'rectangle':
      initRectangleWindow(buffer, size, normCoefs);
      break;
  }
}

exports.default = initWindow;

},{}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _parameters = require('parameters');

var _parameters2 = _interopRequireDefault(_parameters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var id = 0;

/**
 * Base `lfo` class to be extended in order to create new nodes.
 *
 * Nodes are divided in 3 categories:
 * - **`source`** are responsible for acquering a signal and its properties
 *   (frameRate, frameSize, etc.)
 * - **`sink`** are endpoints of the graph, such nodes can be recorders,
 *   visualizers, etc.
 * - **`operator`** are used to make computation on the input signal and
 *   forward the results below in the graph.
 *
 * In most cases the methods to override / extend are:
 * - the **`constructor`** to define the parameters of the new lfo node.
 * - the **`processStreamParams`** method to define how the node modify the
 *   stream attributes (e.g. by changing the frame size)
 * - the **`process{FrameType}`** method to define the operations that the
 *   node apply on the stream. The type of input a node can handle is define
 *   by its implemented interface, if it implements `processSignal` a stream
 *   with `frameType === 'signal'` can be processed, `processVector` to handle
 *   an input of type `vector`.
 *
 * <span class="warning">_This class should be considered abstract and only
 * be used to be extended._</span>
 *
 *
 * // overview of the behavior of a node
 *
 * **processStreamParams(prevStreamParams)**
 *
 * `base` class (default implementation)
 * - call `preprocessStreamParams`
 * - call `propagateStreamParams`
 *
 * `child` class
 * - call `preprocessStreamParams`
 * - override some of the inherited `streamParams`
 * - creates the any related logic buffers
 * - call `propagateStreamParams`
 *
 * _should not call `super.processStreamParams`_
 *
 * **prepareStreamParams()**
 *
 * - assign prevStreamParams to this.streamParams
 * - check if the class implements the correct `processInput` method
 *
 * _shouldn't be extended, only consumed in `processStreamParams`_
 *
 * **propagateStreamParams()**
 *
 * - creates the `frameData` buffer
 * - propagate `streamParams` to children
 *
 * _shouldn't be extended, only consumed in `processStreamParams`_
 *
 * **processFrame()**
 *
 * `base` class (default implementation)
 * - call `preprocessFrame`
 * - assign frameTime and frameMetadata to identity
 * - call the proper function according to inputType
 * - call `propagateFrame`
 *
 * `child` class
 * - call `preprocessFrame`
 * - do whatever you want with incomming frame
 * - call `propagateFrame`
 *
 * _should not call `super.processFrame`_
 *
 * **prepareFrame()**
 *
 * - if `reinit` and trigger `processStreamParams` if needed
 *
 * _shouldn't be extended, only consumed in `processFrame`_
 *
 * **propagateFrame()**
 *
 * - propagate frame to children
 *
 * _shouldn't be extended, only consumed in `processFrame`_
 *
 * @memberof module:core
 */

var BaseLfo = function () {
  function BaseLfo() {
    var definitions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, BaseLfo);

    this.cid = id++;

    /**
     * Parameter bag containing parameter instances.
     *
     * @type {Object}
     * @name params
     * @instance
     * @memberof module:common.core.BaseLfo
     */
    this.params = (0, _parameters2.default)(definitions, options);
    // listen for param updates
    this.params.addListener(this.onParamUpdate.bind(this));

    /**
     * Description of the stream output of the node.
     * Set to `null` when the node is destroyed.
     *
     * @type {Object}
     * @property {Number} frameSize - Frame size at the output of the node.
     * @property {Number} frameRate - Frame rate at the output of the node.
     * @property {String} frameType - Frame type at the output of the node,
     *  possible values are `signal`, `vector` or `scalar`.
     * @property {Array|String} description - If type is `vector`, describe
     *  the dimension(s) of output stream.
     * @property {Number} sourceSampleRate - Sample rate of the source of the
     *  graph. _The value should be defined by sources and never modified_.
     * @property {Number} sourceSampleCount - Number of consecutive discrete
     *  time values contained in the data frame output by the source.
     *  _The value should be defined by sources and never modified_.
     *
     * @name streamParams
     * @instance
     * @memberof module:common.core.BaseLfo
     */
    this.streamParams = {
      frameType: null,
      frameSize: 1,
      frameRate: 0,
      description: null,
      sourceSampleRate: 0,
      sourceSampleCount: null
    };

    /**
     * Current frame. This object and its data are updated at each incomming
     * frame without reallocating memory.
     *
     * @type {Object}
     * @name frame
     * @property {Number} time - Time of the current frame.
     * @property {Float32Array} data - Data of the current frame.
     * @property {Object} metadata - Metadata associted to the current frame.
     * @instance
     * @memberof module:common.core.BaseLfo
     */
    this.frame = {
      time: 0,
      data: null,
      metadata: {}
    };

    /**
     * List of nodes connected to the ouput of the node (lower in the graph).
     * At each frame, the node forward its `frame` to to all its `nextOps`.
     *
     * @type {Array<BaseLfo>}
     * @name nextOps
     * @instance
     * @memberof module:common.core.BaseLfo
     * @see {@link module:common.core.BaseLfo#connect}
     * @see {@link module:common.core.BaseLfo#disconnect}
     */
    this.nextOps = [];

    /**
     * The node from which the node receive the frames (upper in the graph).
     *
     * @type {BaseLfo}
     * @name prevOp
     * @instance
     * @memberof module:common.core.BaseLfo
     * @see {@link module:common.core.BaseLfo#connect}
     * @see {@link module:common.core.BaseLfo#disconnect}
     */
    this.prevOp = null;

    /**
     * Is set to true when a static parameter is updated. On the next input
     * frame all the subgraph streamParams starting from this node will be
     * updated.
     *
     * @type {Boolean}
     * @name _reinit
     * @instance
     * @memberof module:common.core.BaseLfo
     * @private
     */
    this._reinit = false;
  }

  /**
   * Returns an object describing each available parameter of the node.
   *
   * @return {Object}
   */


  (0, _createClass3.default)(BaseLfo, [{
    key: 'getParamsDescription',
    value: function getParamsDescription() {
      return this.params.getDefinitions();
    }

    /**
     * Reset all parameters to their initial value (as defined on instantication)
     *
     * @see {@link module:common.core.BaseLfo#streamParams}
     */

  }, {
    key: 'resetParams',
    value: function resetParams() {
      this.params.reset();
    }

    /**
     * Function called when a param is updated. By default set the `_reinit`
     * flag to `true` if the param is `static` one. This method should be
     * extended to handle particular logic bound to a specific parameter.
     *
     * @param {String} name - Name of the parameter.
     * @param {Mixed} value - Value of the parameter.
     * @param {Object} metas - Metadata associated to the parameter.
     */

  }, {
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value) {
      var metas = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (metas.kind === 'static') this._reinit = true;
    }

    /**
     * Connect the current node (`prevOp`) to another node (`nextOp`).
     * A given node can be connected to several operators and propagate the
     * stream to each of them.
     *
     * @param {BaseLfo} next - Next operator in the graph.
     * @see {@link module:common.core.BaseLfo#processFrame}
     * @see {@link module:common.core.BaseLfo#disconnect}
     */

  }, {
    key: 'connect',
    value: function connect(next) {
      if (!(next instanceof BaseLfo)) throw new Error('Invalid connection: child node is not an instance of `BaseLfo`');

      if (this.streamParams === null || next.streamParams === null) throw new Error('Invalid connection: cannot connect a dead node');

      this.nextOps.push(next);
      next.prevOp = this;

      if (this.streamParams.frameType !== null) // graph has already been started
        next.processStreamParams(this.streamParams);
    }

    /**
     * Remove the given operator from its previous operators' `nextOps`.
     *
     * @param {BaseLfo} [next=null] - The operator to disconnect from the current
     *  operator. If `null` disconnect all the next operators.
     */

  }, {
    key: 'disconnect',
    value: function disconnect() {
      var _this = this;

      var next = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (next === null) {
        this.nextOps.forEach(function (next) {
          return _this.disconnect(next);
        });
      } else {
        var index = this.nextOps.indexOf(this);
        this.nextOps.splice(index, 1);
        next.prevOp = null;
      }
    }

    /**
     * Destroy all the nodes in the sub-graph starting from the current node.
     * When detroyed, the `streamParams` of the node are set to `null`, the
     * operator is then considered as `dead` and cannot be reconnected.
     *
     * @see {@link module:common.core.BaseLfo#connect}
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      // destroy all chidren
      var index = this.nextOps.length;

      while (index--) {
        this.nextOps[index].destroy();
      } // disconnect itself from the previous operator
      if (this.prevOp) this.prevOp.disconnect(this);

      // mark the object as dead
      this.streamParams = null;
    }

    /**
     * Helper to initialize the stream in standalone mode.
     *
     * @param {Object} [streamParams={}] - Stream parameters to be used.
     *
     * @see {@link module:common.core.BaseLfo#processStreamParams}
     * @see {@link module:common.core.BaseLfo#resetStream}
     */

  }, {
    key: 'initStream',
    value: function initStream() {
      var streamParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.processStreamParams(streamParams);
      this.resetStream();
    }

    /**
     * Reset the `frame.data` buffer by setting all its values to 0.
     * A source operator should call `processStreamParams` and `resetStream` when
     * started, each of these method propagate through the graph automaticaly.
     *
     * @see {@link module:common.core.BaseLfo#processStreamParams}
     */

  }, {
    key: 'resetStream',
    value: function resetStream() {
      // buttom up
      for (var i = 0, l = this.nextOps.length; i < l; i++) {
        this.nextOps[i].resetStream();
      } // no buffer for `scalar` type or sink node
      if (this.streamParams.frameType !== 'scalar' && this.frame.data !== null) {
        var frameSize = this.streamParams.frameSize;
        var data = this.frame.data;

        for (var _i = 0; _i < frameSize; _i++) {
          data[_i] = 0;
        }
      }
    }

    /**
     * Finalize the stream. A source node should call this method when stopped,
     * `finalizeStream` is automatically propagated throught the graph.
     *
     * @param {Number} endTime - Logical time at which the graph is stopped.
     */

  }, {
    key: 'finalizeStream',
    value: function finalizeStream(endTime) {
      for (var i = 0, l = this.nextOps.length; i < l; i++) {
        this.nextOps[i].finalizeStream(endTime);
      }
    }

    /**
     * Initialize or update the operator's `streamParams` according to the
     * previous operators `streamParams` values.
     *
     * When implementing a new operator this method should:
     * 1. call `this.prepareStreamParams` with the given `prevStreamParams`
     * 2. optionnally change values to `this.streamParams` according to the
     *    logic performed by the operator.
     * 3. optionnally allocate memory for ring buffers, etc.
     * 4. call `this.propagateStreamParams` to trigger the method on the next
     *    operators in the graph.
     *
     * @param {Object} prevStreamParams - `streamParams` of the previous operator.
     *
     * @see {@link module:common.core.BaseLfo#prepareStreamParams}
     * @see {@link module:common.core.BaseLfo#propagateStreamParams}
     */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams() {
      var prevStreamParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.prepareStreamParams(prevStreamParams);
      this.propagateStreamParams();
    }

    /**
     * Common logic to do at the beginning of the `processStreamParam`, must be
     * called at the beginning of any `processStreamParam` implementation.
     *
     * The method mainly check if the current node implement the interface to
     * handle the type of frame propagated by it's parent:
     * - to handle a `vector` frame type, the class must implement `processVector`
     * - to handle a `signal` frame type, the class must implement `processSignal`
     * - in case of a 'scalar' frame type, the class can implement any of the
     * following by order of preference: `processScalar`, `processVector`,
     * `processSignal`.
     *
     * @param {Object} prevStreamParams - `streamParams` of the previous operator.
     *
     * @see {@link module:common.core.BaseLfo#processStreamParams}
     * @see {@link module:common.core.BaseLfo#propagateStreamParams}
     */

  }, {
    key: 'prepareStreamParams',
    value: function prepareStreamParams() {
      var prevStreamParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      (0, _assign2.default)(this.streamParams, prevStreamParams);
      var prevFrameType = prevStreamParams.frameType;

      switch (prevFrameType) {
        case 'scalar':
          if (this.processScalar) this.processFunction = this.processScalar;else if (this.processVector) this.processFunction = this.processVector;else if (this.processSignal) this.processFunction = this.processSignal;else throw new Error(this.constructor.name + ' - no "process" function found');
          break;
        case 'vector':
          if (!('processVector' in this)) throw new Error(this.constructor.name + ' - "processVector" is not defined');

          this.processFunction = this.processVector;
          break;
        case 'signal':
          if (!('processSignal' in this)) throw new Error(this.constructor.name + ' - "processSignal" is not defined');

          this.processFunction = this.processSignal;
          break;
        default:
          // defaults to processFunction
          break;
      }
    }

    /**
     * Create the `this.frame.data` buffer and forward the operator's `streamParam`
     * to all its next operators, must be called at the end of any
     * `processStreamParams` implementation.
     *
     * @see {@link module:common.core.BaseLfo#processStreamParams}
     * @see {@link module:common.core.BaseLfo#prepareStreamParams}
     */

  }, {
    key: 'propagateStreamParams',
    value: function propagateStreamParams() {
      this.frame.data = new Float32Array(this.streamParams.frameSize);

      for (var i = 0, l = this.nextOps.length; i < l; i++) {
        this.nextOps[i].processStreamParams(this.streamParams);
      }
    }

    /**
     * Define the particular logic the operator applies to the stream.
     * According to the frame type of the previous node, the method calls one
     * of the following method `processVector`, `processSignal` or `processScalar`
     *
     * @param {Object} frame - Frame (time, data, and metadata) as given by the
     *  previous operator. The incomming frame should never be modified by
     *  the operator.
     *
     * @see {@link module:common.core.BaseLfo#prepareFrame}
     * @see {@link module:common.core.BaseLfo#propagateFrame}
     * @see {@link module:common.core.BaseLfo#processStreamParams}
     */

  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      this.prepareFrame();

      // frameTime and frameMetadata defaults to identity
      this.frame.time = frame.time;
      this.frame.metadata = frame.metadata;

      this.processFunction(frame);
      this.propagateFrame();
    }

    /**
     * Pointer to the method called in `processFrame` according to the
     * frame type of the previous operator. Is dynamically assigned in
     * `prepareStreamParams`.
     *
     * @see {@link module:common.core.BaseLfo#prepareStreamParams}
     * @see {@link module:common.core.BaseLfo#processFrame}
     */

  }, {
    key: 'processFunction',
    value: function processFunction(frame) {
      this.frame = frame;
    }

    /**
     * Common logic to perform at the beginning of the `processFrame`.
     *
     * @see {@link module:common.core.BaseLfo#processFrame}
     */

  }, {
    key: 'prepareFrame',
    value: function prepareFrame() {
      if (this._reinit === true) {
        var streamParams = this.prevOp !== null ? this.prevOp.streamParams : {};
        this.initStream(streamParams);
        this._reinit = false;
      }
    }

    /**
     * Forward the current `frame` to the next operators, is called at the end of
     * `processFrame`.
     *
     * @see {@link module:common.core.BaseLfo#processFrame}
     */

  }, {
    key: 'propagateFrame',
    value: function propagateFrame() {
      for (var i = 0, l = this.nextOps.length; i < l; i++) {
        this.nextOps[i].processFrame(this.frame);
      }
    }
  }]);
  return BaseLfo;
}();

exports.default = BaseLfo;

},{"babel-runtime/core-js/object/assign":48,"babel-runtime/helpers/classCallCheck":56,"babel-runtime/helpers/createClass":57,"parameters":2}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseLfo = require('./BaseLfo');

Object.defineProperty(exports, 'BaseLfo', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_BaseLfo).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = exports.version = '1.0.0';

},{"./BaseLfo":42}],44:[function(require,module,exports){
'use strict';

var _client = require('waves-lfo/client');

var lfo = _interopRequireWildcard(_client);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();

var frameSize = Math.floor(0.020 * audioContext.sampleRate);
var hopSize = Math.floor(0.005 * audioContext.sampleRate);

navigator.mediaDevices.getUserMedia({ audio: true }).then(init).catch(function (err) {
  return console.error(err.stack);
});

function init(stream) {
  var source = audioContext.createMediaStreamSource(stream);

  var audioInNode = new lfo.source.AudioInNode({
    sourceNode: source,
    audioContext: audioContext
  });

  var slicer = new lfo.operator.Slicer({
    frameSize: frameSize,
    hopSize: hopSize,
    centeredTimeTags: true
  });

  var power = new lfo.operator.Rms({
    power: true
  });

  var segmenter = new lfo.operator.Segmenter({
    logInput: true,
    filterOrder: 5,
    threshold: 4,
    offThreshold: -Infinity,
    minInter: 0.100,
    maxDuration: 0.020
  });

  var waveformDisplay = new lfo.sink.WaveformDisplay({
    canvas: '#waveform'
  });

  var markerDisplay = new lfo.sink.MarkerDisplay({
    canvas: '#markers'
  });

  new lfo.utils.DisplaySync(waveformDisplay, markerDisplay);

  audioInNode.connect(slicer);
  audioInNode.connect(waveformDisplay);
  slicer.connect(power);
  power.connect(segmenter);
  segmenter.connect(markerDisplay);

  audioInNode.start();
}

},{"waves-lfo/client":3}],45:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],46:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/math/log10"), __esModule: true };
},{"core-js/library/fn/math/log10":63}],47:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/number/is-finite"), __esModule: true };
},{"core-js/library/fn/number/is-finite":64}],48:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":65}],49:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":66}],50:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":67}],51:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":68}],52:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/get-prototype-of":69}],53:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":70}],54:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":71}],55:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":72}],56:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
},{}],57:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _defineProperty = require("../core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
},{"../core-js/object/define-property":50}],58:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _defineProperty = require("../core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};
},{"../core-js/object/define-property":50}],59:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _getPrototypeOf = require("../core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _getOwnPropertyDescriptor = require("../core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

  if (desc === undefined) {
    var parent = (0, _getPrototypeOf2.default)(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};
},{"../core-js/object/get-own-property-descriptor":51,"../core-js/object/get-prototype-of":52}],60:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _setPrototypeOf = require("../core-js/object/set-prototype-of");

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = require("../core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _typeof2 = require("../helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};
},{"../core-js/object/create":49,"../core-js/object/set-prototype-of":53,"../helpers/typeof":62}],61:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _typeof2 = require("../helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};
},{"../helpers/typeof":62}],62:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _iterator = require("../core-js/symbol/iterator");

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require("../core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
},{"../core-js/symbol":54,"../core-js/symbol/iterator":55}],63:[function(require,module,exports){
require('../../modules/es6.math.log10');
module.exports = require('../../modules/_core').Math.log10;
},{"../../modules/_core":78,"../../modules/es6.math.log10":133}],64:[function(require,module,exports){
require('../../modules/es6.number.is-finite');
module.exports = require('../../modules/_core').Number.isFinite;
},{"../../modules/_core":78,"../../modules/es6.number.is-finite":134}],65:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;
},{"../../modules/_core":78,"../../modules/es6.object.assign":135}],66:[function(require,module,exports){
require('../../modules/es6.object.create');
var $Object = require('../../modules/_core').Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};
},{"../../modules/_core":78,"../../modules/es6.object.create":136}],67:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};
},{"../../modules/_core":78,"../../modules/es6.object.define-property":137}],68:[function(require,module,exports){
require('../../modules/es6.object.get-own-property-descriptor');
var $Object = require('../../modules/_core').Object;
module.exports = function getOwnPropertyDescriptor(it, key){
  return $Object.getOwnPropertyDescriptor(it, key);
};
},{"../../modules/_core":78,"../../modules/es6.object.get-own-property-descriptor":138}],69:[function(require,module,exports){
require('../../modules/es6.object.get-prototype-of');
module.exports = require('../../modules/_core').Object.getPrototypeOf;
},{"../../modules/_core":78,"../../modules/es6.object.get-prototype-of":139}],70:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/_core').Object.setPrototypeOf;
},{"../../modules/_core":78,"../../modules/es6.object.set-prototype-of":140}],71:[function(require,module,exports){
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
require('../../modules/es7.symbol.async-iterator');
require('../../modules/es7.symbol.observable');
module.exports = require('../../modules/_core').Symbol;
},{"../../modules/_core":78,"../../modules/es6.object.to-string":141,"../../modules/es6.symbol":143,"../../modules/es7.symbol.async-iterator":144,"../../modules/es7.symbol.observable":145}],72:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/_wks-ext').f('iterator');
},{"../../modules/_wks-ext":130,"../../modules/es6.string.iterator":142,"../../modules/web.dom.iterable":146}],73:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],74:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],75:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":94}],76:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length')
  , toIndex   = require('./_to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};
},{"./_to-index":122,"./_to-iobject":124,"./_to-length":125}],77:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],78:[function(require,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],79:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":73}],80:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],81:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":86}],82:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":87,"./_is-object":94}],83:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],84:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys')
  , gOPS    = require('./_object-gops')
  , pIE     = require('./_object-pie');
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};
},{"./_object-gops":109,"./_object-keys":112,"./_object-pie":113}],85:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , ctx       = require('./_ctx')
  , hide      = require('./_hide')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":78,"./_ctx":79,"./_global":87,"./_hide":89}],86:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],87:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],88:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],89:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":81,"./_object-dp":104,"./_property-desc":115}],90:[function(require,module,exports){
module.exports = require('./_global').document && document.documentElement;
},{"./_global":87}],91:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":81,"./_dom-create":82,"./_fails":86}],92:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":77}],93:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
},{"./_cof":77}],94:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],95:[function(require,module,exports){
'use strict';
var create         = require('./_object-create')
  , descriptor     = require('./_property-desc')
  , setToStringTag = require('./_set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./_hide":89,"./_object-create":103,"./_property-desc":115,"./_set-to-string-tag":118,"./_wks":131}],96:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./_library')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , hide           = require('./_hide')
  , has            = require('./_has')
  , Iterators      = require('./_iterators')
  , $iterCreate    = require('./_iter-create')
  , setToStringTag = require('./_set-to-string-tag')
  , getPrototypeOf = require('./_object-gpo')
  , ITERATOR       = require('./_wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./_export":85,"./_has":88,"./_hide":89,"./_iter-create":95,"./_iterators":98,"./_library":100,"./_object-gpo":110,"./_redefine":116,"./_set-to-string-tag":118,"./_wks":131}],97:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],98:[function(require,module,exports){
module.exports = {};
},{}],99:[function(require,module,exports){
var getKeys   = require('./_object-keys')
  , toIObject = require('./_to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./_object-keys":112,"./_to-iobject":124}],100:[function(require,module,exports){
module.exports = true;
},{}],101:[function(require,module,exports){
var META     = require('./_uid')('meta')
  , isObject = require('./_is-object')
  , has      = require('./_has')
  , setDesc  = require('./_object-dp').f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !require('./_fails')(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};
},{"./_fails":86,"./_has":88,"./_is-object":94,"./_object-dp":104,"./_uid":128}],102:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = require('./_object-keys')
  , gOPS     = require('./_object-gops')
  , pIE      = require('./_object-pie')
  , toObject = require('./_to-object')
  , IObject  = require('./_iobject')
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;
},{"./_fails":86,"./_iobject":92,"./_object-gops":109,"./_object-keys":112,"./_object-pie":113,"./_to-object":126}],103:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = require('./_an-object')
  , dPs         = require('./_object-dps')
  , enumBugKeys = require('./_enum-bug-keys')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":75,"./_dom-create":82,"./_enum-bug-keys":83,"./_html":90,"./_object-dps":105,"./_shared-key":119}],104:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":75,"./_descriptors":81,"./_ie8-dom-define":91,"./_to-primitive":127}],105:[function(require,module,exports){
var dP       = require('./_object-dp')
  , anObject = require('./_an-object')
  , getKeys  = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};
},{"./_an-object":75,"./_descriptors":81,"./_object-dp":104,"./_object-keys":112}],106:[function(require,module,exports){
var pIE            = require('./_object-pie')
  , createDesc     = require('./_property-desc')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , has            = require('./_has')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};
},{"./_descriptors":81,"./_has":88,"./_ie8-dom-define":91,"./_object-pie":113,"./_property-desc":115,"./_to-iobject":124,"./_to-primitive":127}],107:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject')
  , gOPN      = require('./_object-gopn').f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":108,"./_to-iobject":124}],108:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = require('./_object-keys-internal')
  , hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};
},{"./_enum-bug-keys":83,"./_object-keys-internal":111}],109:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;
},{}],110:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = require('./_has')
  , toObject    = require('./_to-object')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};
},{"./_has":88,"./_shared-key":119,"./_to-object":126}],111:[function(require,module,exports){
var has          = require('./_has')
  , toIObject    = require('./_to-iobject')
  , arrayIndexOf = require('./_array-includes')(false)
  , IE_PROTO     = require('./_shared-key')('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};
},{"./_array-includes":76,"./_has":88,"./_shared-key":119,"./_to-iobject":124}],112:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require('./_object-keys-internal')
  , enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":83,"./_object-keys-internal":111}],113:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;
},{}],114:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export')
  , core    = require('./_core')
  , fails   = require('./_fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./_core":78,"./_export":85,"./_fails":86}],115:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],116:[function(require,module,exports){
module.exports = require('./_hide');
},{"./_hide":89}],117:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object')
  , anObject = require('./_an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./_an-object":75,"./_ctx":79,"./_is-object":94,"./_object-gopd":106}],118:[function(require,module,exports){
var def = require('./_object-dp').f
  , has = require('./_has')
  , TAG = require('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_has":88,"./_object-dp":104,"./_wks":131}],119:[function(require,module,exports){
var shared = require('./_shared')('keys')
  , uid    = require('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":120,"./_uid":128}],120:[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":87}],121:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./_defined":80,"./_to-integer":123}],122:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":123}],123:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],124:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject')
  , defined = require('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":80,"./_iobject":92}],125:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":123}],126:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":80}],127:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":94}],128:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],129:[function(require,module,exports){
var global         = require('./_global')
  , core           = require('./_core')
  , LIBRARY        = require('./_library')
  , wksExt         = require('./_wks-ext')
  , defineProperty = require('./_object-dp').f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};
},{"./_core":78,"./_global":87,"./_library":100,"./_object-dp":104,"./_wks-ext":130}],130:[function(require,module,exports){
exports.f = require('./_wks');
},{"./_wks":131}],131:[function(require,module,exports){
var store      = require('./_shared')('wks')
  , uid        = require('./_uid')
  , Symbol     = require('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
},{"./_global":87,"./_shared":120,"./_uid":128}],132:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables')
  , step             = require('./_iter-step')
  , Iterators        = require('./_iterators')
  , toIObject        = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./_add-to-unscopables":74,"./_iter-define":96,"./_iter-step":97,"./_iterators":98,"./_to-iobject":124}],133:[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log10: function log10(x){
    return Math.log(x) / Math.LN10;
  }
});
},{"./_export":85}],134:[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export   = require('./_export')
  , _isFinite = require('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  }
});
},{"./_export":85,"./_global":87}],135:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', {assign: require('./_object-assign')});
},{"./_export":85,"./_object-assign":102}],136:[function(require,module,exports){
var $export = require('./_export')
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: require('./_object-create')});
},{"./_export":85,"./_object-create":103}],137:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperty: require('./_object-dp').f});
},{"./_descriptors":81,"./_export":85,"./_object-dp":104}],138:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject                 = require('./_to-iobject')
  , $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./_object-gopd":106,"./_object-sap":114,"./_to-iobject":124}],139:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = require('./_to-object')
  , $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
},{"./_object-gpo":110,"./_object-sap":114,"./_to-object":126}],140:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', {setPrototypeOf: require('./_set-proto').set});
},{"./_export":85,"./_set-proto":117}],141:[function(require,module,exports){

},{}],142:[function(require,module,exports){
'use strict';
var $at  = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./_iter-define":96,"./_string-at":121}],143:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global         = require('./_global')
  , has            = require('./_has')
  , DESCRIPTORS    = require('./_descriptors')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , META           = require('./_meta').KEY
  , $fails         = require('./_fails')
  , shared         = require('./_shared')
  , setToStringTag = require('./_set-to-string-tag')
  , uid            = require('./_uid')
  , wks            = require('./_wks')
  , wksExt         = require('./_wks-ext')
  , wksDefine      = require('./_wks-define')
  , keyOf          = require('./_keyof')
  , enumKeys       = require('./_enum-keys')
  , isArray        = require('./_is-array')
  , anObject       = require('./_an-object')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , createDesc     = require('./_property-desc')
  , _create        = require('./_object-create')
  , gOPNExt        = require('./_object-gopn-ext')
  , $GOPD          = require('./_object-gopd')
  , $DP            = require('./_object-dp')
  , $keys          = require('./_object-keys')
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f  = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./_library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./_an-object":75,"./_descriptors":81,"./_enum-keys":84,"./_export":85,"./_fails":86,"./_global":87,"./_has":88,"./_hide":89,"./_is-array":93,"./_keyof":99,"./_library":100,"./_meta":101,"./_object-create":103,"./_object-dp":104,"./_object-gopd":106,"./_object-gopn":108,"./_object-gopn-ext":107,"./_object-gops":109,"./_object-keys":112,"./_object-pie":113,"./_property-desc":115,"./_redefine":116,"./_set-to-string-tag":118,"./_shared":120,"./_to-iobject":124,"./_to-primitive":127,"./_uid":128,"./_wks":131,"./_wks-define":129,"./_wks-ext":130}],144:[function(require,module,exports){
require('./_wks-define')('asyncIterator');
},{"./_wks-define":129}],145:[function(require,module,exports){
require('./_wks-define')('observable');
},{"./_wks-define":129}],146:[function(require,module,exports){
require('./es6.array.iterator');
var global        = require('./_global')
  , hide          = require('./_hide')
  , Iterators     = require('./_iterators')
  , TO_STRING_TAG = require('./_wks')('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}
},{"./_global":87,"./_hide":89,"./_iterators":98,"./_wks":131,"./es6.array.iterator":132}]},{},[44])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi8uLi8uLi8uLi9pcmNhbS1qc3Rvb2xzL2xpYi9wYXJhbWV0ZXJzL2Rpc3QvcGFyYW1UZW1wbGF0ZXMuanMiLCIuLi8uLi8uLi8uLi8uLi9pcmNhbS1qc3Rvb2xzL2xpYi9wYXJhbWV0ZXJzL2Rpc3QvcGFyYW1ldGVycy5qcyIsIi4uLy4uL2NsaWVudC9pbmRleC5qcyIsIi4uLy4uL2NsaWVudC9zaW5rL0Jhc2VEaXNwbGF5LmpzIiwiLi4vLi4vY2xpZW50L3NpbmsvQnBmRGlzcGxheS5qcyIsIi4uLy4uL2NsaWVudC9zaW5rL01hcmtlckRpc3BsYXkuanMiLCIuLi8uLi9jbGllbnQvc2luay9TaWduYWxEaXNwbGF5LmpzIiwiLi4vLi4vY2xpZW50L3NpbmsvU3BlY3RydW1EaXNwbGF5LmpzIiwiLi4vLi4vY2xpZW50L3NpbmsvVHJhY2VEaXNwbGF5LmpzIiwiLi4vLi4vY2xpZW50L3NpbmsvVnVNZXRlckRpc3BsYXkuanMiLCIuLi8uLi9jbGllbnQvc2luay9XYXZlZm9ybURpc3BsYXkuanMiLCIuLi8uLi9jbGllbnQvc2luay9fbmFtZXNwYWNlLmpzIiwiLi4vLi4vY2xpZW50L3NvdXJjZS9BdWRpb0luQnVmZmVyLmpzIiwiLi4vLi4vY2xpZW50L3NvdXJjZS9BdWRpb0luTm9kZS5qcyIsIi4uLy4uL2NsaWVudC9zb3VyY2UvX25hbWVzcGFjZS5qcyIsIi4uLy4uL2NsaWVudC91dGlscy9EaXNwbGF5U3luYy5qcyIsIi4uLy4uL2NsaWVudC91dGlscy9fbmFtZXNwYWNlLmpzIiwiLi4vLi4vY2xpZW50L3V0aWxzL2Rpc3BsYXktdXRpbHMuanMiLCIuLi8uLi9jb21tb24vb3BlcmF0b3IvQmlxdWFkLmpzIiwiLi4vLi4vY29tbW9uL29wZXJhdG9yL0RjdC5qcyIsIi4uLy4uL2NvbW1vbi9vcGVyYXRvci9GZnQuanMiLCIuLi8uLi9jb21tb24vb3BlcmF0b3IvTWFnbml0dWRlLmpzIiwiLi4vLi4vY29tbW9uL29wZXJhdG9yL01lYW5TdGRkZXYuanMiLCIuLi8uLi9jb21tb24vb3BlcmF0b3IvTWVsLmpzIiwiLi4vLi4vY29tbW9uL29wZXJhdG9yL01mY2MuanMiLCIuLi8uLi9jb21tb24vb3BlcmF0b3IvTWluTWF4LmpzIiwiLi4vLi4vY29tbW9uL29wZXJhdG9yL01vdmluZ0F2ZXJhZ2UuanMiLCIuLi8uLi9jb21tb24vb3BlcmF0b3IvTW92aW5nTWVkaWFuLmpzIiwiLi4vLi4vY29tbW9uL29wZXJhdG9yL09uT2ZmLmpzIiwiLi4vLi4vY29tbW9uL29wZXJhdG9yL1Jtcy5qcyIsIi4uLy4uL2NvbW1vbi9vcGVyYXRvci9TZWdtZW50ZXIuanMiLCIuLi8uLi9jb21tb24vb3BlcmF0b3IvU2VsZWN0LmpzIiwiLi4vLi4vY29tbW9uL29wZXJhdG9yL1NsaWNlci5qcyIsIi4uLy4uL2NvbW1vbi9vcGVyYXRvci9ZaW4uanMiLCIuLi8uLi9jb21tb24vb3BlcmF0b3IvX25hbWVzcGFjZS5qcyIsIi4uLy4uL2NvbW1vbi9zaW5rL0JyaWRnZS5qcyIsIi4uLy4uL2NvbW1vbi9zaW5rL0RhdGFSZWNvcmRlci5qcyIsIi4uLy4uL2NvbW1vbi9zaW5rL0xvZ2dlci5qcyIsIi4uLy4uL2NvbW1vbi9zaW5rL1NpZ25hbFJlY29yZGVyLmpzIiwiLi4vLi4vY29tbW9uL3NvdXJjZS9FdmVudEluLmpzIiwiLi4vLi4vY29tbW9uL3V0aWxzL3dpbmRvd3MuanMiLCIuLi8uLi9jb3JlL0Jhc2VMZm8uanMiLCIuLi8uLi9jb3JlL2luZGV4LmpzIiwiZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL21hdGgvbG9nMTAuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL251bWJlci9pcy1maW5pdGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9hc3NpZ24uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9jcmVhdGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtcHJvdG90eXBlLW9mLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3Qvc2V0LXByb3RvdHlwZS1vZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvc3ltYm9sLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9zeW1ib2wvaXRlcmF0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvZGVmaW5lUHJvcGVydHkuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2dldC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL3R5cGVvZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vbWF0aC9sb2cxMC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vbnVtYmVyL2lzLWZpbml0ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2Fzc2lnbi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2NyZWF0ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2dldC1vd24tcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2dldC1wcm90b3R5cGUtb2YuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaW5kZXguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbC9pdGVyYXRvci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hbi1vYmplY3QuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb2YuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NvcmUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2N0eC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZGVmaW5lZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2VudW0tYnVnLWtleXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2VudW0ta2V5cy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZXhwb3J0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19mYWlscy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZ2xvYmFsLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oYXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2h0bWwuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pb2JqZWN0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1hcnJheS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1kZWZpbmUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItc3RlcC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19rZXlvZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbWV0YS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWNyZWF0ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ29wZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcG4tZXh0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ29wbi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1ncG8uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLWludGVybmFsLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LXBpZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LXNhcC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC1wcm90by5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXRvLXN0cmluZy10YWcuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pbmRleC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW50ZWdlci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW9iamVjdC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1vYmplY3QuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdWlkLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL193a3MtZGVmaW5lLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL193a3MtZXh0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL193a3MuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5tYXRoLmxvZzEwLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5udW1iZXIuaXMtZmluaXRlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuY3JlYXRlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuZGVmaW5lLXByb3BlcnR5LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LXByb3RvdHlwZS1vZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnNldC1wcm90b3R5cGUtb2YuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3ltYm9sLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5zeW1ib2wuYXN5bmMtaXRlcmF0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnN5bWJvbC5vYnNlcnZhYmxlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0FBLElBQU0sTUFBTSxLQUFLLEdBQWpCO0FBQ0EsSUFBTSxNQUFNLEtBQUssR0FBakI7O0FBRUEsU0FBUyxJQUFULENBQWMsS0FBZCxFQUEyRDtBQUFBLE1BQXRDLEtBQXNDLHVFQUE5QixDQUFDLFFBQTZCO0FBQUEsTUFBbkIsS0FBbUIsdUVBQVgsQ0FBQyxRQUFVOztBQUN6RCxTQUFPLElBQUksS0FBSixFQUFXLElBQUksS0FBSixFQUFXLEtBQVgsQ0FBWCxDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztBQVNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBcUJlO0FBQ2I7Ozs7Ozs7QUFPQSxXQUFTO0FBQ1Asd0JBQW9CLENBQUMsU0FBRCxDQURiO0FBRVAscUJBRk8sNkJBRVcsS0FGWCxFQUVrQixVQUZsQixFQUU4QixJQUY5QixFQUVvQztBQUN6QyxVQUFJLE9BQU8sS0FBUCxLQUFpQixTQUFyQixFQUNFLE1BQU0sSUFBSSxLQUFKLHVDQUE4QyxJQUE5QyxXQUF3RCxLQUF4RCxDQUFOOztBQUVGLGFBQU8sS0FBUDtBQUNEO0FBUE0sR0FSSTs7QUFrQmI7Ozs7Ozs7OztBQVNBLFdBQVM7QUFDUCx3QkFBb0IsQ0FBQyxTQUFELENBRGI7QUFFUCxxQkFGTyw2QkFFVyxLQUZYLEVBRWtCLFVBRmxCLEVBRThCLElBRjlCLEVBRW9DO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7O0FDQUE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTs7QUNGQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTs7QUNGQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxT0E7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgbWluID0gTWF0aC5taW47XG5jb25zdCBtYXggPSBNYXRoLm1heDtcblxuZnVuY3Rpb24gY2xpcCh2YWx1ZSwgbG93ZXIgPSAtSW5maW5pdHksIHVwcGVyID0gK0luZmluaXR5KSB7XG4gIHJldHVybiBtYXgobG93ZXIsIG1pbih1cHBlciwgdmFsdWUpKVxufVxuXG4vKipcbiAqIERpY3Rpb25uYXJ5IG9mIHRoZSBhdmFpbGFibGUgdHlwZXMuIEVhY2gga2V5IGNvcnJlc3BvbmQgdG8gdGhlIHR5cGUgb2YgdGhlXG4gKiBpbXBsZW1lbnRlZCBwYXJhbSB3aGlsZSB0aGUgY29ycmVzcG9uZGluZyBvYmplY3QgdmFsdWUgc2hvdWxkIHRoZVxuICoge0BsaW5rIGBwYXJhbURlZmluaXRpb25gfSBvZiB0aGUgZGVmaW5lZCB0eXBlLlxuICpcbiAqIHR5cGVkZWYge09iamVjdH0gcGFyYW1UZW1wbGF0ZXNcbiAqIEB0eXBlIHtPYmplY3Q8U3RyaW5nLCBwYXJhbVRlbXBsYXRlPn1cbiAqL1xuXG4vKipcbiAqIERlZmluaXRpb24gb2YgYSBwYXJhbWV0ZXIuIFRoZSBkZWZpbml0aW9uIHNob3VsZCBhdCBsZWFzdCBjb250YWluIHRoZSBlbnRyaWVzXG4gKiBgdHlwZWAgYW5kIGBkZWZhdWx0YC4gRXZlcnkgcGFyYW1ldGVyIGNhbiBhbHNvIGFjY2VwdCBvcHRpb25uYWwgY29uZmlndXJhdGlvblxuICogZW50cmllcyBgY29uc3RhbnRgIGFuZCBgbWV0YXNgLlxuICogQXZhaWxhYmxlIGRlZmluaXRpb25zIGFyZTpcbiAqIC0ge0BsaW5rIGJvb2xlYW5EZWZpbml0aW9ufVxuICogLSB7QGxpbmsgaW50ZWdlckRlZmluaXRpb259XG4gKiAtIHtAbGluayBmbG9hdERlZmluaXRpb259XG4gKiAtIHtAbGluayBzdHJpbmdEZWZpbml0aW9ufVxuICogLSB7QGxpbmsgZW51bURlZmluaXRpb259XG4gKlxuICogdHlwZWRlZiB7T2JqZWN0fSBwYXJhbURlZmluaXRpb25cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSB0eXBlIC0gVHlwZSBvZiB0aGUgcGFyYW1ldGVyLlxuICogQHByb3BlcnR5IHtNaXhlZH0gZGVmYXVsdCAtIERlZmF1bHQgdmFsdWUgb2YgdGhlIHBhcmFtZXRlciBpZiBub1xuICogIGluaXRpYWxpemF0aW9uIHZhbHVlIGlzIHByb3ZpZGVkLlxuICogQHByb3BlcnR5IHtCb29sZWFufSBbY29uc3RhbnQ9ZmFsc2VdIC0gRGVmaW5lIGlmIHRoZSBwYXJhbWV0ZXIgY2FuIGJlIGNoYW5nZVxuICogIGFmdGVyIGl0cyBpbml0aWFsaXphdGlvbi5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBbbWV0YXM9bnVsbF0gLSBBbnkgdXNlciBkZWZpbmVkIGRhdGEgYXNzb2NpYXRlZCB0byB0aGVcbiAqICBwYXJhbWV0ZXIgdGhhdCBjb3VscyBiZSB1c2VmdWxsIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBib29sZWFuRGVmaW5pdGlvblxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gW3R5cGU9J2Jvb2xlYW4nXSAtIERlZmluZSBhIGJvb2xlYW4gcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGRlZmF1bHQgLSBEZWZhdWx0IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gW2NvbnN0YW50PWZhbHNlXSAtIERlZmluZSBpZiB0aGUgcGFyYW1ldGVyIGlzIGNvbnN0YW50LlxuICAgKiBAcHJvcGVydHkge09iamVjdH0gW21ldGFzPXt9XSAtIE9wdGlvbm5hbCBtZXRhZGF0YSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgYm9vbGVhbjoge1xuICAgIGRlZmluaXRpb25UZW1wbGF0ZTogWydkZWZhdWx0J10sXG4gICAgdHlwZUNoZWNrRnVuY3Rpb24odmFsdWUsIGRlZmluaXRpb24sIG5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHZhbHVlIGZvciBib29sZWFuIHBhcmFtIFwiJHtuYW1lfVwiOiAke3ZhbHVlfWApO1xuXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBpbnRlZ2VyRGVmaW5pdGlvblxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gW3R5cGU9J2ludGVnZXInXSAtIERlZmluZSBhIGJvb2xlYW4gcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGRlZmF1bHQgLSBEZWZhdWx0IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gW21pbj0tSW5maW5pdHldIC0gTWluaW11bSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IFttYXg9K0luZmluaXR5XSAtIE1heGltdW0gdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBbY29uc3RhbnQ9ZmFsc2VdIC0gRGVmaW5lIGlmIHRoZSBwYXJhbWV0ZXIgaXMgY29uc3RhbnQuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBbbWV0YXM9e31dIC0gT3B0aW9ubmFsIG1ldGFkYXRhIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBpbnRlZ2VyOiB7XG4gICAgZGVmaW5pdGlvblRlbXBsYXRlOiBbJ2RlZmF1bHQnXSxcbiAgICB0eXBlQ2hlY2tGdW5jdGlvbih2YWx1ZSwgZGVmaW5pdGlvbiwgbmFtZSkge1xuICAgICAgaWYgKCEodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdmFsdWUgZm9yIGludGVnZXIgcGFyYW0gXCIke25hbWV9XCI6ICR7dmFsdWV9YCk7XG5cbiAgICAgIHJldHVybiBjbGlwKHZhbHVlLCBkZWZpbml0aW9uLm1pbiwgZGVmaW5pdGlvbi5tYXgpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gZmxvYXREZWZpbml0aW9uXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBbdHlwZT0nZmxvYXQnXSAtIERlZmluZSBhIGJvb2xlYW4gcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGRlZmF1bHQgLSBEZWZhdWx0IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gW21pbj0tSW5maW5pdHldIC0gTWluaW11bSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IFttYXg9K0luZmluaXR5XSAtIE1heGltdW0gdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBbY29uc3RhbnQ9ZmFsc2VdIC0gRGVmaW5lIGlmIHRoZSBwYXJhbWV0ZXIgaXMgY29uc3RhbnQuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBbbWV0YXM9e31dIC0gT3B0aW9ubmFsIG1ldGFkYXRhIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBmbG9hdDoge1xuICAgIGRlZmluaXRpb25UZW1wbGF0ZTogWydkZWZhdWx0J10sXG4gICAgdHlwZUNoZWNrRnVuY3Rpb24odmFsdWUsIGRlZmluaXRpb24sIG5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInIHx8wqB2YWx1ZSAhPT0gdmFsdWUpIC8vIHJlamVjdCBOYU5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHZhbHVlIGZvciBmbG9hdCBwYXJhbSBcIiR7bmFtZX1cIjogJHt2YWx1ZX1gKTtcblxuICAgICAgcmV0dXJuIGNsaXAodmFsdWUsIGRlZmluaXRpb24ubWluLCBkZWZpbml0aW9uLm1heCk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBzdHJpbmdEZWZpbml0aW9uXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBbdHlwZT0nc3RyaW5nJ10gLSBEZWZpbmUgYSBib29sZWFuIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBkZWZhdWx0IC0gRGVmYXVsdCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IFtjb25zdGFudD1mYWxzZV0gLSBEZWZpbmUgaWYgdGhlIHBhcmFtZXRlciBpcyBjb25zdGFudC5cbiAgICogQHByb3BlcnR5IHtPYmplY3R9IFttZXRhcz17fV0gLSBPcHRpb25uYWwgbWV0YWRhdGEgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIHN0cmluZzoge1xuICAgIGRlZmluaXRpb25UZW1wbGF0ZTogWydkZWZhdWx0J10sXG4gICAgdHlwZUNoZWNrRnVuY3Rpb24odmFsdWUsIGRlZmluaXRpb24sIG5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdmFsdWUgZm9yIHN0cmluZyBwYXJhbSBcIiR7bmFtZX1cIjogJHt2YWx1ZX1gKTtcblxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gZW51bURlZmluaXRpb25cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IFt0eXBlPSdlbnVtJ10gLSBEZWZpbmUgYSBib29sZWFuIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBkZWZhdWx0IC0gRGVmYXVsdCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0FycmF5fSBsaXN0IC0gUG9zc2libGUgdmFsdWVzIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gW2NvbnN0YW50PWZhbHNlXSAtIERlZmluZSBpZiB0aGUgcGFyYW1ldGVyIGlzIGNvbnN0YW50LlxuICAgKiBAcHJvcGVydHkge09iamVjdH0gW21ldGFzPXt9XSAtIE9wdGlvbm5hbCBtZXRhZGF0YSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgZW51bToge1xuICAgIGRlZmluaXRpb25UZW1wbGF0ZTogWydkZWZhdWx0JywgJ2xpc3QnXSxcbiAgICB0eXBlQ2hlY2tGdW5jdGlvbih2YWx1ZSwgZGVmaW5pdGlvbiwgbmFtZSkge1xuICAgICAgaWYgKGRlZmluaXRpb24ubGlzdC5pbmRleE9mKHZhbHVlKSA9PT0gLTEpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB2YWx1ZSBmb3IgZW51bSBwYXJhbSBcIiR7bmFtZX1cIjogJHt2YWx1ZX1gKTtcblxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gYW55RGVmaW5pdGlvblxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gW3R5cGU9J2VudW0nXSAtIERlZmluZSBhIHBhcmFtZXRlciBvZiBhbnkgdHlwZS5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBkZWZhdWx0IC0gRGVmYXVsdCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IFtjb25zdGFudD1mYWxzZV0gLSBEZWZpbmUgaWYgdGhlIHBhcmFtZXRlciBpcyBjb25zdGFudC5cbiAgICogQHByb3BlcnR5IHtPYmplY3R9IFttZXRhcz17fV0gLSBPcHRpb25uYWwgbWV0YWRhdGEgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIGFueToge1xuICAgIGRlZmluaXRpb25UZW1wbGF0ZTogWydkZWZhdWx0J10sXG4gICAgdHlwZUNoZWNrRnVuY3Rpb24odmFsdWUsIGRlZmluaXRpb24sIG5hbWUpIHtcbiAgICAgIC8vIG5vIGNoZWNrIGFzIGl0IGNhbiBoYXZlIGFueSB0eXBlLi4uXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgcGFyYW1UZW1wbGF0ZXMgZnJvbSAnLi9wYXJhbVRlbXBsYXRlcyc7XG5cbi8qKlxuICogR2VuZXJpYyBjbGFzcyBmb3IgdHlwZWQgcGFyYW1ldGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAqIEBwYXJhbSB7QXJyYXl9IGRlZmluaXRpb25UZW1wbGF0ZSAtIExpc3Qgb2YgbWFuZGF0b3J5IGtleXMgaW4gdGhlIHBhcmFtXG4gKiAgZGVmaW5pdGlvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHR5cGVDaGVja0Z1bmN0aW9uIC0gRnVuY3Rpb24gdG8gYmUgdXNlZCBpbiBvcmRlciB0byBjaGVja1xuICogIHRoZSB2YWx1ZSBhZ2FpbnN0IHRoZSBwYXJhbSBkZWZpbml0aW9uLlxuICogQHBhcmFtIHtPYmplY3R9IGRlZmluaXRpb24gLSBEZWZpbml0aW9uIG9mIHRoZSBwYXJhbWV0ZXIuXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZSAtIFZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBQYXJhbSB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIGRlZmluaXRpb25UZW1wbGF0ZSwgdHlwZUNoZWNrRnVuY3Rpb24sIGRlZmluaXRpb24sIHZhbHVlKSB7XG4gICAgZGVmaW5pdGlvblRlbXBsYXRlLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZiAoZGVmaW5pdGlvbi5oYXNPd25Qcm9wZXJ0eShrZXkpID09PSBmYWxzZSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGRlZmluaXRpb24gZm9yIHBhcmFtIFwiJHtuYW1lfVwiLCAke2tleX0gaXMgbm90IGRlZmluZWRgKTtcbiAgICB9KTtcblxuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy50eXBlID0gZGVmaW5pdGlvbi50eXBlO1xuICAgIHRoaXMuZGVmaW5pdGlvbiA9IGRlZmluaXRpb247XG5cbiAgICBpZiAodGhpcy5kZWZpbml0aW9uLm51bGxhYmxlID09PSB0cnVlICYmIHZhbHVlID09PSBudWxsKVxuICAgICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gICAgZWxzZVxuICAgICAgdGhpcy52YWx1ZSA9IHR5cGVDaGVja0Z1bmN0aW9uKHZhbHVlLCBkZWZpbml0aW9uLCBuYW1lKTtcbiAgICB0aGlzLl90eXBlQ2hlY2tGdW5jdGlvbiA9IHR5cGVDaGVja0Z1bmN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgdmFsdWUuXG4gICAqIEByZXR1cm4ge01peGVkfVxuICAgKi9cbiAgZ2V0VmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBjdXJyZW50IHZhbHVlLlxuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSAtIE5ldyB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSAtIGB0cnVlYCBpZiB0aGUgcGFyYW0gaGFzIGJlZW4gdXBkYXRlZCwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqICAoZS5nLiBpZiB0aGUgcGFyYW1ldGVyIGFscmVhZHkgaGFkIHRoaXMgdmFsdWUpLlxuICAgKi9cbiAgc2V0VmFsdWUodmFsdWUpIHtcbiAgICBpZiAodGhpcy5kZWZpbml0aW9uLmNvbnN0YW50ID09PSB0cnVlKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGFzc2lnbmVtZW50IHRvIGNvbnN0YW50IHBhcmFtIFwiJHt0aGlzLm5hbWV9XCJgKTtcblxuICAgIGlmICghKHRoaXMuZGVmaW5pdGlvbi5udWxsYWJsZSA9PT0gdHJ1ZSAmJiB2YWx1ZSA9PT0gbnVsbCkpXG4gICAgICB2YWx1ZSA9IHRoaXMuX3R5cGVDaGVja0Z1bmN0aW9uKHZhbHVlLCB0aGlzLmRlZmluaXRpb24sIHRoaXMubmFtZSk7XG5cbiAgICBpZiAodGhpcy52YWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5cbi8qKlxuICogQmFnIG9mIHBhcmFtZXRlcnMuIE1haW4gaW50ZXJmYWNlIG9mIHRoZSBsaWJyYXJ5XG4gKi9cbmNsYXNzIFBhcmFtZXRlckJhZyB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtcywgZGVmaW5pdGlvbnMpIHtcbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHBhcmFtZXRlcnMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0PFN0cmluZywgUGFyYW0+fVxuICAgICAqIEBuYW1lIF9wYXJhbXNcbiAgICAgKiBAbWVtYmVyb2YgUGFyYW1ldGVyQmFnXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9wYXJhbXMgPSBwYXJhbXM7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIGRlZmluaXRpb25zIHdpdGggaW5pdCB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0PFN0cmluZywgcGFyYW1EZWZpbml0aW9uPn1cbiAgICAgKiBAbmFtZSBfZGVmaW5pdGlvbnNcbiAgICAgKiBAbWVtYmVyb2YgUGFyYW1ldGVyQmFnXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9kZWZpbml0aW9ucyA9IGRlZmluaXRpb25zO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiBnbG9iYWwgbGlzdGVuZXJzLlxuICAgICAqXG4gICAgICogQHR5cGUge1NldH1cbiAgICAgKiBAbmFtZSBfZ2xvYmFsTGlzdGVuZXJzXG4gICAgICogQG1lbWJlcm9mIFBhcmFtZXRlckJhZ1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fZ2xvYmFsTGlzdGVuZXJzID0gbmV3IFNldCgpO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiBwYXJhbXMgbGlzdGVuZXJzLlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdDxTdHJpbmcsIFNldD59XG4gICAgICogQG5hbWUgX3BhcmFtc0xpc3RlbmVyc1xuICAgICAqIEBtZW1iZXJvZiBQYXJhbWV0ZXJCYWdcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX3BhcmFtc0xpc3RlbmVycyA9IHt9O1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBlbXB0eSBTZXQgZm9yIGVhY2ggcGFyYW1cbiAgICBmb3IgKGxldCBuYW1lIGluIHBhcmFtcylcbiAgICAgIHRoaXMuX3BhcmFtc0xpc3RlbmVyc1tuYW1lXSA9IG5ldyBTZXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGdpdmVuIGRlZmluaXRpb25zIGFsb25nIHdpdGggdGhlIGluaXRpYWxpemF0aW9uIHZhbHVlcy5cbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgZ2V0RGVmaW5pdGlvbnMobmFtZSA9IG51bGwpIHtcbiAgICBpZiAobmFtZSAhPT0gbnVsbClcbiAgICAgIHJldHVybiB0aGlzLl9kZWZpbml0aW9uc1tuYW1lXTtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGhpcy5fZGVmaW5pdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gcGFyYW1ldGVyLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHJldHVybiB7TWl4ZWR9IC0gVmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIGdldChuYW1lKSB7XG4gICAgaWYgKCF0aGlzLl9wYXJhbXNbbmFtZV0pXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCByZWFkIHByb3BlcnR5IHZhbHVlIG9mIHVuZGVmaW5lZCBwYXJhbWV0ZXIgXCIke25hbWV9XCJgKTtcblxuICAgIHJldHVybiB0aGlzLl9wYXJhbXNbbmFtZV0udmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSB2YWx1ZSBvZiBhIHBhcmFtZXRlci4gSWYgdGhlIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgaXMgdXBkYXRlZFxuICAgKiAoYWthIGlmIHByZXZpb3VzIHZhbHVlIGlzIGRpZmZlcmVudCBmcm9tIG5ldyB2YWx1ZSkgYWxsIHJlZ2lzdGVyZWRcbiAgICogY2FsbGJhY2tzIGFyZSByZWdpc3RlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgLSBWYWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcmV0dXJuIHtNaXhlZH0gLSBOZXcgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIHNldChuYW1lLCB2YWx1ZSkge1xuICAgIGNvbnN0IHBhcmFtID0gdGhpcy5fcGFyYW1zW25hbWVdO1xuICAgIGNvbnN0IHVwZGF0ZWQgPSBwYXJhbS5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgdmFsdWUgPSBwYXJhbS5nZXRWYWx1ZSgpO1xuXG4gICAgaWYgKHVwZGF0ZWQpIHtcbiAgICAgIGNvbnN0IG1ldGFzID0gcGFyYW0uZGVmaW5pdGlvbi5tZXRhcztcbiAgICAgIC8vIHRyaWdnZXIgZ2xvYmFsIGxpc3RlbmVyc1xuICAgICAgZm9yIChsZXQgbGlzdGVuZXIgb2YgdGhpcy5fZ2xvYmFsTGlzdGVuZXJzKVxuICAgICAgICBsaXN0ZW5lcihuYW1lLCB2YWx1ZSwgbWV0YXMpO1xuXG4gICAgICAvLyB0cmlnZ2VyIHBhcmFtIGxpc3RlbmVyc1xuICAgICAgZm9yIChsZXQgbGlzdGVuZXIgb2YgdGhpcy5fcGFyYW1zTGlzdGVuZXJzW25hbWVdKVxuICAgICAgICBsaXN0ZW5lcih2YWx1ZSwgbWV0YXMpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgaWYgdGhlIGBuYW1lYCBwYXJhbWV0ZXIgZXhpc3RzIG9yIG5vdC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBoYXMobmFtZSkge1xuICAgIHJldHVybiAodGhpcy5fcGFyYW1zW25hbWVdKSA/IHRydWUgOiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCBhIHBhcmFtZXRlciB0byBpdHMgaW5pdCB2YWx1ZS4gUmVzZXQgYWxsIHBhcmFtZXRlcnMgaWYgbm8gYXJndW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbbmFtZT1udWxsXSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlciB0byByZXNldC5cbiAgICovXG4gIHJlc2V0KG5hbWUgPSBudWxsKSB7XG4gICAgaWYgKG5hbWUgIT09IG51bGwpXG4gICAgICB0aGlzLnNldChuYW1lLCBwYXJhbS5kZWZpbml0aW9uLmluaXRWYWx1ZSk7XG4gICAgZWxzZVxuICAgICAgT2JqZWN0LmtleXModGhpcy5fcGFyYW1zKS5mb3JFYWNoKChuYW1lKSA9PiB0aGlzLnJlc2V0KG5hbWUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgUGFyYW1ldGVyQmFnfmxpc3RlbmVyQ2FsbGJhY2tcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBQYXJhbWV0ZXIgbmFtZS5cbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgLSBVcGRhdGVkIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbbWV0YT1dIC0gR2l2ZW4gbWV0YSBkYXRhIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBBZGQgbGlzdGVuZXIgdG8gYWxsIHBhcmFtIHVwZGF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7UGFyYW1ldGVyQmFnfmxpc3RlbmVyQ2FsbGFja30gY2FsbGJhY2sgLSBMaXN0ZW5lciB0byByZWdpc3Rlci5cbiAgICovXG4gIGFkZExpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fZ2xvYmFsTGlzdGVuZXJzLmFkZChjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGxpc3RlbmVyIGZyb20gYWxsIHBhcmFtIGNoYW5nZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7UGFyYW1ldGVyQmFnfmxpc3RlbmVyQ2FsbGFja30gY2FsbGJhY2sgLSBMaXN0ZW5lciB0byByZW1vdmUuIElmXG4gICAqICBgbnVsbGAgcmVtb3ZlIGFsbCBsaXN0ZW5lcnMuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihjYWxsYmFjayA9IG51bGwpIHtcbiAgICBpZiAoY2FsbGJhY2sgPT09IG51bGwpXG4gICAgICB0aGlzLl9nbG9iYWxMaXN0ZW5lcnMuY2xlYXIoKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLl9nbG9iYWxMaXN0ZW5lcnMuZGVsZXRlKGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgUGFyYW1ldGVyQmFnfnBhcmFtTGlzdGVuZXJDYWxsYWNrXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIC0gVXBkYXRlZCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW21ldGE9XSAtIEdpdmVuIG1ldGEgZGF0YSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cblxuICAvKipcbiAgICogQWRkIGxpc3RlbmVyIHRvIGEgZ2l2ZW4gcGFyYW0gdXBkYXRlcy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBQYXJhbWV0ZXIgbmFtZS5cbiAgICogQHBhcmFtIHtQYXJhbWV0ZXJCYWd+cGFyYW1MaXN0ZW5lckNhbGxhY2t9IGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gYXBwbHlcbiAgICogIHdoZW4gdGhlIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgY2hhbmdlcy5cbiAgICovXG4gIGFkZFBhcmFtTGlzdGVuZXIobmFtZSwgY2FsbGJhY2spIHtcbiAgICB0aGlzLl9wYXJhbXNMaXN0ZW5lcnNbbmFtZV0uYWRkKGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgbGlzdGVuZXIgZnJvbSBhIGdpdmVuIHBhcmFtIHVwZGF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gUGFyYW1ldGVyIG5hbWUuXG4gICAqIEBwYXJhbSB7UGFyYW1ldGVyQmFnfnBhcmFtTGlzdGVuZXJDYWxsYWNrfSBjYWxsYmFjayAtIExpc3RlbmVyIHRvIHJlbW92ZS5cbiAgICogIElmIGBudWxsYCByZW1vdmUgYWxsIGxpc3RlbmVycy5cbiAgICovXG4gIHJlbW92ZVBhcmFtTGlzdGVuZXIobmFtZSwgY2FsbGJhY2sgPSBudWxsKSB7XG4gICAgaWYgKGNhbGxiYWNrID09PSBudWxsKVxuICAgICAgdGhpcy5fcGFyYW1zTGlzdGVuZXJzW25hbWVdLmNsZWFyKCk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5fcGFyYW1zTGlzdGVuZXJzW25hbWVdLmRlbGV0ZShjYWxsYmFjayk7XG4gIH1cbn1cblxuLyoqXG4gKiBGYWN0b3J5IGZvciB0aGUgYFBhcmFtZXRlckJhZ2AgY2xhc3MuXG4gKlxuICogQHBhcmFtIHtPYmplY3Q8U3RyaW5nLCBwYXJhbURlZmluaXRpb24+fSBkZWZpbml0aW9ucyAtIE9iamVjdCBkZXNjcmliaW5nIHRoZVxuICogIHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge09iamVjdDxTdHJpbmcsIE1peGVkPn0gdmFsdWVzIC0gSW5pdGlhbGl6YXRpb24gdmFsdWVzIGZvciB0aGVcbiAqICBwYXJhbWV0ZXJzLlxuICogQHJldHVybiB7UGFyYW1ldGVyQmFnfVxuICovXG5mdW5jdGlvbiBwYXJhbWV0ZXJzKGRlZmluaXRpb25zLCB2YWx1ZXMgPSB7fSkge1xuICBjb25zdCBwYXJhbXMgPSB7fTtcblxuICBmb3IgKGxldCBuYW1lIGluIHZhbHVlcykge1xuICAgIGlmIChkZWZpbml0aW9ucy5oYXNPd25Qcm9wZXJ0eShuYW1lKSA9PT0gZmFsc2UpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gcGFyYW0gXCIke25hbWV9XCJgKTtcbiAgfVxuXG4gIGZvciAobGV0IG5hbWUgaW4gZGVmaW5pdGlvbnMpIHtcbiAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KG5hbWUpID09PSB0cnVlKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBQYXJhbWV0ZXIgXCIke25hbWV9XCIgYWxyZWFkeSBkZWZpbmVkYCk7XG5cbiAgICBjb25zdCBkZWZpbml0aW9uID0gZGVmaW5pdGlvbnNbbmFtZV07XG5cbiAgICBpZiAoIXBhcmFtVGVtcGxhdGVzW2RlZmluaXRpb24udHlwZV0pXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gcGFyYW0gdHlwZSBcIiR7ZGVmaW5pdGlvbi50eXBlfVwiYCk7XG5cbiAgICBjb25zdCB7XG4gICAgICBkZWZpbml0aW9uVGVtcGxhdGUsXG4gICAgICB0eXBlQ2hlY2tGdW5jdGlvblxuICAgIH0gPSBwYXJhbVRlbXBsYXRlc1tkZWZpbml0aW9uLnR5cGVdO1xuXG4gICAgbGV0IHZhbHVlO1xuXG4gICAgaWYgKHZhbHVlcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSA9PT0gdHJ1ZSlcbiAgICAgIHZhbHVlID0gdmFsdWVzW25hbWVdO1xuICAgIGVsc2VcbiAgICAgIHZhbHVlID0gZGVmaW5pdGlvbi5kZWZhdWx0O1xuXG4gICAgLy8gc3RvcmUgaW5pdCB2YWx1ZSBpbiBkZWZpbml0aW9uXG4gICAgZGVmaW5pdGlvbi5pbml0VmFsdWUgPSB2YWx1ZTtcblxuICAgIGlmICghdHlwZUNoZWNrRnVuY3Rpb24gfHzCoCFkZWZpbml0aW9uVGVtcGxhdGUpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcGFyYW0gdHlwZSBkZWZpbml0aW9uIFwiJHtkZWZpbml0aW9uLnR5cGV9XCJgKTtcblxuICAgIHBhcmFtc1tuYW1lXSA9IG5ldyBQYXJhbShuYW1lLCBkZWZpbml0aW9uVGVtcGxhdGUsIHR5cGVDaGVja0Z1bmN0aW9uLCBkZWZpbml0aW9uLCB2YWx1ZSk7XG4gIH1cblxuICByZXR1cm4gbmV3IFBhcmFtZXRlckJhZyhwYXJhbXMsIGRlZmluaXRpb25zKTtcbn1cblxuLyoqXG4gKiBSZWdpc3RlciBhIG5ldyB0eXBlIGZvciB0aGUgYHBhcmFtZXRlcnNgIGZhY3RvcnkuXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZU5hbWUgLSBWYWx1ZSB0aGF0IHdpbGwgYmUgYXZhaWxhYmxlIGFzIHRoZSBgdHlwZWAgb2YgYVxuICogIHBhcmFtIGRlZmluaXRpb24uXG4gKiBAcGFyYW0ge3BhcmFtZXRlckRlZmluaXRpb259IHBhcmFtZXRlckRlZmluaXRpb24gLSBPYmplY3QgZGVzY3JpYmluZyB0aGVcbiAqICBwYXJhbWV0ZXIuXG4gKi9cbnBhcmFtZXRlcnMuZGVmaW5lVHlwZSA9IGZ1bmN0aW9uKHR5cGVOYW1lLCBwYXJhbWV0ZXJEZWZpbml0aW9uKSB7XG4gIHBhcmFtVGVtcGxhdGVzW3R5cGVOYW1lXSA9IHBhcmFtZXRlckRlZmluaXRpb247XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBhcmFtZXRlcnM7XG4iLCJleHBvcnQgY29uc3QgdmVyc2lvbiA9ICcldmVyc2lvbiUnO1xuXG5pbXBvcnQgKiBhcyBfY29yZSBmcm9tICcuLi9jb3JlJztcbmV4cG9ydCBjb25zdCBjb3JlID0gX2NvcmU7XG5leHBvcnQgeyBkZWZhdWx0IGFzIG9wZXJhdG9yIH0gZnJvbSAnLi4vY29tbW9uL29wZXJhdG9yL19uYW1lc3BhY2UnO1xuXG5leHBvcnQgeyBkZWZhdWx0IGFzIHV0aWxzIH0gZnJvbSAnLi91dGlscy9fbmFtZXNwYWNlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc291cmNlIH0gZnJvbSAnLi9zb3VyY2UvX25hbWVzcGFjZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHNpbmsgfSBmcm9tICcuL3NpbmsvX25hbWVzcGFjZSc7XG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuXG5jb25zdCBjb21tb25EZWZpbml0aW9ucyA9IHtcbiAgbWluOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiAtMSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgbWF4OiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiAxLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICB3aWR0aDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAzMDAsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG4gIGhlaWdodDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAxNTAsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG4gIGNvbnRhaW5lcjoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGNhbnZhczoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG59O1xuXG5jb25zdCBoYXNEdXJhdGlvbkRlZmluaXRpb25zID0ge1xuICBkdXJhdGlvbjoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgbWluOiAwLFxuICAgIG1heDogK0luZmluaXR5LFxuICAgIGRlZmF1bHQ6IDEsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG4gIHJlZmVyZW5jZVRpbWU6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG59O1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgdG8gZXh0ZW5kIGluIG9yZGVyIHRvIGNyZWF0ZSBncmFwaGljIHNpbmtzLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9UaGlzIGNsYXNzIHNob3VsZCBiZSBjb25zaWRlcmVkIGFic3RyYWN0IGFuZCBvbmx5XG4gKiBiZSB1c2VkIHRvIGJlIGV4dGVuZGVkLl88L3NwYW4+XG4gKlxuICogQHRvZG8gLSBmaXggZmxvYXQgcm91bmRpbmcgZXJyb3JzIChwcm9kdWNlIGRlY2F5cyBpbiBzeW5jIGRyYXdzKVxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y2xpZW50LnNpbmtcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5taW49LTFdIC0gTWluaW11bSB2YWx1ZSByZXByZXNlbnRlZCBpbiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXg9MV0gLSBNYXhpbXVtIHZhbHVlIHJlcHJlc2VudGVkIGluIHRoZSBjYW52YXMuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndpZHRoPTMwMF0gLSBXaWR0aCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oZWlnaHQ9MTUwXSAtIEhlaWdodCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY29udGFpbmVyPW51bGxdIC0gQ29udGFpbmVyIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBpbnNlcnQgdGhlIGNhbnZhcy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY2FudmFzPW51bGxdIC0gQ2FudmFzIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBkcmF3LiBfY29uc3RhbnQgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmR1cmF0aW9uPTFdIC0gRHVyYXRpb24gKGluIHNlY29uZHMpIHJlcHJlc2VudGVkIGluXG4gKiAgdGhlIGNhbnZhcy4gVGhpcyBwYXJhbWV0ZXIgb25seSBleGlzdHMgZm9yIG9wZXJhdG9ycyB0aGF0IGRpc3BsYXkgc2V2ZXJhbFxuICogIGNvbnNlY3V0aXZlIGZyYW1lcyBvbiB0aGUgY2FudmFzLiBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucmVmZXJlbmNlVGltZT1udWxsXSAtIE9wdGlvbm5hbCByZWZlcmVuY2UgdGltZSB0aGVcbiAqICBkaXNwbGF5IHNob3VsZCBjb25zaWRlcmVyIGFzIHRoZSBvcmlnaW4uIElzIG9ubHkgdXNlZnVsbCB3aGVuIHN5bmNocm9uaXppbmdcbiAqICBzZXZlcmFsIGRpc3BsYXkgdXNpbmcgdGhlIGBEaXNwbGF5U3luY2AgY2xhc3MuIFRoaXMgcGFyYW1ldGVyIG9ubHkgZXhpc3RzXG4gKiAgZm9yIG9wZXJhdG9ycyB0aGF0IGRpc3BsYXkgc2V2ZXJhbCBjb25zZWN1dGl2ZSBmcmFtZXMgb24gdGhlIGNhbnZhcy5cbiAqL1xuY2xhc3MgQmFzZURpc3BsYXkgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3IoZGVmcywgb3B0aW9ucyA9IHt9LCBoYXNEdXJhdGlvbiA9IHRydWUpIHtcbiAgICBsZXQgY29tbW9uRGVmcztcblxuICAgIGlmIChoYXNEdXJhdGlvbilcbiAgICAgIGNvbW1vbkRlZnMgPSBPYmplY3QuYXNzaWduKHt9LCBjb21tb25EZWZpbml0aW9ucywgaGFzRHVyYXRpb25EZWZpbml0aW9ucyk7XG4gICAgZWxzZVxuICAgICAgY29tbW9uRGVmcyA9IGNvbW1vbkRlZmluaXRpb25zXG5cbiAgICBjb25zdCBkZWZpbml0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGNvbW1vbkRlZnMsIGRlZnMpO1xuXG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnY2FudmFzJykgPT09IG51bGwgJiYgdGhpcy5wYXJhbXMuZ2V0KCdjb250YWluZXInKSA9PT0gbnVsbClcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBwYXJhbWV0ZXI6IGBjYW52YXNgIG9yIGBjb250YWluZXJgIG5vdCBkZWZpbmVkJyk7XG5cbiAgICBjb25zdCBjYW52YXNQYXJhbSA9IHRoaXMucGFyYW1zLmdldCgnY2FudmFzJyk7XG4gICAgY29uc3QgY29udGFpbmVyUGFyYW0gPSB0aGlzLnBhcmFtcy5nZXQoJ2NvbnRhaW5lcicpO1xuXG4gICAgLy8gcHJlcGFyZSBjYW52YXNcbiAgICBpZiAoY2FudmFzUGFyYW0pIHtcbiAgICAgIGlmICh0eXBlb2YgY2FudmFzUGFyYW0gPT09ICdzdHJpbmcnKVxuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY2FudmFzUGFyYW0pO1xuICAgICAgZWxzZVxuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhc1BhcmFtO1xuICAgIH0gZWxzZSBpZiAoY29udGFpbmVyUGFyYW0pIHtcbiAgICAgIGxldCBjb250YWluZXI7XG5cbiAgICAgIGlmICh0eXBlb2YgY29udGFpbmVyUGFyYW0gPT09ICdzdHJpbmcnKVxuICAgICAgICBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lclBhcmFtKTtcbiAgICAgIGVsc2VcbiAgICAgICAgY29udGFpbmVyID0gY29udGFpbmVyUGFyYW07XG5cbiAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuICAgIH1cblxuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLmNhY2hlZENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHRoaXMuY2FjaGVkQ3R4ID0gdGhpcy5jYWNoZWRDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgIHRoaXMucHJldmlvdXNGcmFtZSA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50VGltZSA9IGhhc0R1cmF0aW9uID8gdGhpcy5wYXJhbXMuZ2V0KCdyZWZlcmVuY2VUaW1lJykgOiBudWxsO1xuXG4gICAgLyoqXG4gICAgICogSW5zdGFuY2Ugb2YgdGhlIGBEaXNwbGF5U3luY2AgdXNlZCB0byBzeW5jaHJvbml6ZSB0aGUgZGlmZmVyZW50IGRpc3BsYXlzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmRpc3BsYXlTeW5jID0gZmFsc2U7XG5cbiAgICAvL1xuICAgIHRoaXMuX3N0YWNrO1xuICAgIHRoaXMuX3JhZklkO1xuXG4gICAgdGhpcy5yZW5kZXJTdGFjayA9IHRoaXMucmVuZGVyU3RhY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLnNoaWZ0RXJyb3IgPSAwO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBjYW52YXMgc2l6ZSBhbmQgeSBzY2FsZSB0cmFuc2ZlcnQgZnVuY3Rpb25cbiAgICB0aGlzLl9yZXNpemUoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfcmVzaXplKCkge1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5wYXJhbXMuZ2V0KCd3aWR0aCcpO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmdldCgnaGVpZ2h0Jyk7XG5cbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCBjYWNoZWRDdHggPSB0aGlzLmNhY2hlZEN0eDtcblxuICAgIGNvbnN0IGRQUiA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG4gICAgY29uc3QgYlBSID0gY3R4LndlYmtpdEJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcbiAgICAgIGN0eC5tb3pCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG4gICAgICBjdHgubXNCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG4gICAgICBjdHgub0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcbiAgICAgIGN0eC5iYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8IDE7XG5cbiAgICB0aGlzLnBpeGVsUmF0aW8gPSBkUFIgLyBiUFI7XG5cbiAgICBjb25zdCBsYXN0V2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIGNvbnN0IGxhc3RIZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcbiAgICB0aGlzLmNhbnZhc1dpZHRoID0gd2lkdGggKiB0aGlzLnBpeGVsUmF0aW87XG4gICAgdGhpcy5jYW52YXNIZWlnaHQgPSBoZWlnaHQgKiB0aGlzLnBpeGVsUmF0aW87XG5cbiAgICBjYWNoZWRDdHguY2FudmFzLndpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjYWNoZWRDdHguY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuXG4gICAgLy8gY29weSBjdXJyZW50IGltYWdlIGZyb20gY3R4IChyZXNpemUpXG4gICAgaWYgKGxhc3RXaWR0aCAmJiBsYXN0SGVpZ2h0KSB7XG4gICAgICBjYWNoZWRDdHguZHJhd0ltYWdlKGN0eC5jYW52YXMsXG4gICAgICAgIDAsIDAsIGxhc3RXaWR0aCwgbGFzdEhlaWdodCxcbiAgICAgICAgMCwgMCwgdGhpcy5jYW52YXNXaWR0aCwgdGhpcy5jYW52YXNIZWlnaHRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY3R4LmNhbnZhcy53aWR0aCA9IHRoaXMuY2FudmFzV2lkdGg7XG4gICAgY3R4LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcbiAgICBjdHguY2FudmFzLnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xuICAgIGN0eC5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcblxuICAgIC8vIHVwZGF0ZSBzY2FsZVxuICAgIHRoaXMuX3NldFlTY2FsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgdHJhbnNmZXJ0IGZ1bmN0aW9uIHVzZWQgdG8gbWFwIHZhbHVlcyB0byBwaXhlbCBpbiB0aGUgeSBheGlzXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfc2V0WVNjYWxlKCkge1xuICAgIGNvbnN0IG1pbiA9IHRoaXMucGFyYW1zLmdldCgnbWluJyk7XG4gICAgY29uc3QgbWF4ID0gdGhpcy5wYXJhbXMuZ2V0KCdtYXgnKTtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcblxuICAgIGNvbnN0IGEgPSAoMCAtIGhlaWdodCkgLyAobWF4IC0gbWluKTtcbiAgICBjb25zdCBiID0gaGVpZ2h0IC0gKGEgKiBtaW4pO1xuXG4gICAgdGhpcy5nZXRZUG9zaXRpb24gPSAoeCkgPT4gYSAqIHggKyBiO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHdpZHRoIGluIHBpeGVsIGEgYHZlY3RvcmAgZnJhbWUgbmVlZHMgdG8gYmUgZHJhd24uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXRNaW5pbXVtRnJhbWVXaWR0aCgpIHtcbiAgICByZXR1cm4gMTsgLy8gbmVlZCBvbmUgcGl4ZWwgdG8gZHJhdyB0aGUgbGluZVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZ1bmN0aW9uIGV4ZWN1dGVkIHdoZW4gYSBwYXJhbWV0ZXIgaXMgdXBkYXRlZC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBQYXJhbWV0ZXIgbmFtZS5cbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgLSBQYXJhbWV0ZXIgdmFsdWUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBtZXRhcyAtIE1ldGFkYXRhcyBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpIHtcbiAgICBzdXBlci5vblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcyk7XG5cbiAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgIGNhc2UgJ21pbic6XG4gICAgICBjYXNlICdtYXgnOlxuICAgICAgICAvLyBAdG9kbyAtIG1ha2Ugc3VyZSB0aGF0IG1pbiBhbmQgbWF4IGFyZSBkaWZmZXJlbnRcbiAgICAgICAgdGhpcy5fc2V0WVNjYWxlKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnd2lkdGgnOlxuICAgICAgY2FzZSAnaGVpZ2h0JzpcbiAgICAgICAgdGhpcy5fcmVzaXplKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpIHtcbiAgICBzdXBlci5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcblxuICAgIHRoaXMuX3N0YWNrID0gW107XG4gICAgdGhpcy5fcmFmSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZW5kZXJTdGFjayk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcmVzZXRTdHJlYW0oKSB7XG4gICAgc3VwZXIucmVzZXRTdHJlYW0oKTtcblxuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcblxuICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICB0aGlzLmNhY2hlZEN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgZmluYWxpemVTdHJlYW0oZW5kVGltZSkge1xuICAgIHRoaXMuY3VycmVudFRpbWUgPSBudWxsO1xuICAgIHN1cGVyLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuX3JhZklkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIGN1cnJlbnQgZnJhbWUgdG8gdGhlIGZyYW1lcyB0byBkcmF3LiBTaG91bGQgbm90IGJlIG92ZXJyaWRlbi5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBjb3B5ID0gbmV3IEZsb2F0MzJBcnJheShmcmFtZVNpemUpO1xuICAgIGNvbnN0IGRhdGEgPSBmcmFtZS5kYXRhO1xuXG4gICAgLy8gY29weSB2YWx1ZXMgb2YgdGhlIGlucHV0IGZyYW1lIGFzIHRoZXkgbWlnaHQgYmUgdXBkYXRlZFxuICAgIC8vIGluIHJlZmVyZW5jZSBiZWZvcmUgYmVpbmcgY29uc3VtZWQgaW4gdGhlIGRyYXcgZnVuY3Rpb25cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKVxuICAgICAgY29weVtpXSA9IGRhdGFbaV07XG5cbiAgICB0aGlzLl9zdGFjay5wdXNoKHtcbiAgICAgIHRpbWU6IGZyYW1lLnRpbWUsXG4gICAgICBkYXRhOiBjb3B5LFxuICAgICAgbWV0YWRhdGE6IGZyYW1lLm1ldGFkYXRhLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgYWNjdW11bGF0ZWQgZnJhbWVzLiBNZXRob2QgY2FsbGVkIGluIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVuZGVyU3RhY2soKSB7XG4gICAgaWYgKHRoaXMucGFyYW1zLmhhcygnZHVyYXRpb24nKSkge1xuICAgICAgLy8gcmVuZGVyIGFsbCBmcmFtZSBzaW5jZSBsYXN0IGByZW5kZXJTdGFja2AgY2FsbFxuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLl9zdGFjay5sZW5ndGg7IGkgPCBsOyBpKyspXG4gICAgICAgIHRoaXMuc2Nyb2xsTW9kZURyYXcodGhpcy5fc3RhY2tbaV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvbmx5IHJlbmRlciBsYXN0IHJlY2VpdmVkIGZyYW1lIGlmIGFueVxuICAgICAgaWYgKHRoaXMuX3N0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgZnJhbWUgPSB0aGlzLl9zdGFja1t0aGlzLl9zdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzV2lkdGgsIHRoaXMuY2FudmFzSGVpZ2h0KTtcbiAgICAgICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlaW5pdCBzdGFjayBmb3IgbmV4dCBjYWxsXG4gICAgdGhpcy5fc3RhY2subGVuZ3RoID0gMDtcbiAgICB0aGlzLl9yYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlbmRlclN0YWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3IGRhdGEgZnJvbSByaWdodCB0byBsZWZ0IHdpdGggc2Nyb2xsaW5nXG4gICAqIEBwcml2YXRlXG4gICAqIEB0b2RvIC0gY2hlY2sgcG9zc2liaWxpdHkgb2YgbWFpbnRhaW5pbmcgYWxsIHZhbHVlcyBmcm9tIG9uZSBwbGFjZSB0b1xuICAgKiAgICAgICAgIG1pbmltaXplIGZsb2F0IGVycm9yIHRyYWNraW5nLlxuICAgKi9cbiAgc2Nyb2xsTW9kZURyYXcoZnJhbWUpIHtcbiAgICBjb25zdCBmcmFtZVR5cGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVR5cGU7XG4gICAgY29uc3QgZnJhbWVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBzb3VyY2VTYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcblxuICAgIGNvbnN0IGNhbnZhc0R1cmF0aW9uID0gdGhpcy5wYXJhbXMuZ2V0KCdkdXJhdGlvbicpO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IGNhbnZhc1dpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjb25zdCBjYW52YXNIZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcblxuICAgIGNvbnN0IHByZXZpb3VzRnJhbWUgPSB0aGlzLnByZXZpb3VzRnJhbWU7XG5cbiAgICAvLyBjdXJyZW50IHRpbWUgYXQgdGhlIGxlZnQgb2YgdGhlIGNhbnZhc1xuICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gKHRoaXMuY3VycmVudFRpbWUgIT09IG51bGwpID8gdGhpcy5jdXJyZW50VGltZSA6IGZyYW1lLnRpbWU7XG4gICAgY29uc3QgZnJhbWVTdGFydFRpbWUgPSBmcmFtZS50aW1lO1xuICAgIGNvbnN0IGxhc3RGcmFtZVRpbWUgPSBwcmV2aW91c0ZyYW1lID8gcHJldmlvdXNGcmFtZS50aW1lIDogMDtcbiAgICBjb25zdCBsYXN0RnJhbWVEdXJhdGlvbiA9IHRoaXMubGFzdEZyYW1lRHVyYXRpb24gPyB0aGlzLmxhc3RGcmFtZUR1cmF0aW9uIDogMDtcblxuICAgIGxldCBmcmFtZUR1cmF0aW9uO1xuXG4gICAgaWYgKGZyYW1lVHlwZSA9PT0gJ3NjYWxhcicgfHwgZnJhbWVUeXBlID09PSAndmVjdG9yJykge1xuICAgICAgY29uc3QgcGl4ZWxEdXJhdGlvbiA9IGNhbnZhc0R1cmF0aW9uIC8gY2FudmFzV2lkdGg7XG4gICAgICBmcmFtZUR1cmF0aW9uID0gdGhpcy5nZXRNaW5pbXVtRnJhbWVXaWR0aCgpICogcGl4ZWxEdXJhdGlvbjtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSA9PT0gJ3NpZ25hbCcpIHtcbiAgICAgIGZyYW1lRHVyYXRpb24gPSBmcmFtZVNpemUgLyBzb3VyY2VTYW1wbGVSYXRlO1xuICAgIH1cblxuICAgIGNvbnN0IGZyYW1lRW5kVGltZSA9IGZyYW1lU3RhcnRUaW1lICsgZnJhbWVEdXJhdGlvbjtcbiAgICAvLyBkZWZpbmUgaWYgd2UgbmVlZCB0byBzaGlmdCB0aGUgY2FudmFzXG4gICAgY29uc3Qgc2hpZnRUaW1lID0gZnJhbWVFbmRUaW1lIC0gY3VycmVudFRpbWU7XG5cbiAgICAvLyBpZiB0aGUgY2FudmFzIGlzIG5vdCBzeW5jZWQsIHNob3VsZCBuZXZlciBnbyB0byBgZWxzZWBcbiAgICBpZiAoc2hpZnRUaW1lID4gMCkge1xuICAgICAgLy8gc2hpZnQgdGhlIGNhbnZhcyBvZiBzaGlmdFRpbWUgaW4gcGl4ZWxzXG4gICAgICBjb25zdCBmU2hpZnQgPSAoc2hpZnRUaW1lIC8gY2FudmFzRHVyYXRpb24pICogY2FudmFzV2lkdGggLSB0aGlzLnNoaWZ0RXJyb3I7XG4gICAgICBjb25zdCBpU2hpZnQgPSBNYXRoLmZsb29yKGZTaGlmdCArIDAuNSk7XG4gICAgICB0aGlzLnNoaWZ0RXJyb3IgPSBmU2hpZnQgLSBpU2hpZnQ7XG5cbiAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gZnJhbWVTdGFydFRpbWUgKyBmcmFtZUR1cmF0aW9uO1xuICAgICAgdGhpcy5zaGlmdENhbnZhcyhpU2hpZnQsIGN1cnJlbnRUaW1lKTtcblxuICAgICAgLy8gaWYgc2libGluZ3MsIHNoYXJlIHRoZSBpbmZvcm1hdGlvblxuICAgICAgaWYgKHRoaXMuZGlzcGxheVN5bmMpXG4gICAgICAgIHRoaXMuZGlzcGxheVN5bmMuc2hpZnRTaWJsaW5ncyhpU2hpZnQsIGN1cnJlbnRUaW1lLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvLyB3aWR0aCBvZiB0aGUgZnJhbWUgaW4gcGl4ZWxzXG4gICAgY29uc3QgZkZyYW1lV2lkdGggPSAoZnJhbWVEdXJhdGlvbiAvIGNhbnZhc0R1cmF0aW9uKSAqIGNhbnZhc1dpZHRoO1xuICAgIGNvbnN0IGZyYW1lV2lkdGggPSBNYXRoLmZsb29yKGZGcmFtZVdpZHRoICsgMC41KTtcblxuICAgIC8vIGRlZmluZSBwb3NpdGlvbiBvZiB0aGUgaGVhZCBpbiB0aGUgY2FudmFzXG4gICAgY29uc3QgY2FudmFzU3RhcnRUaW1lID0gdGhpcy5jdXJyZW50VGltZSAtIGNhbnZhc0R1cmF0aW9uO1xuICAgIGNvbnN0IHN0YXJ0VGltZVJhdGlvID0gKGZyYW1lU3RhcnRUaW1lIC0gY2FudmFzU3RhcnRUaW1lKSAvIGNhbnZhc0R1cmF0aW9uO1xuICAgIGNvbnN0IHN0YXJ0VGltZVBvc2l0aW9uID0gc3RhcnRUaW1lUmF0aW8gKiBjYW52YXNXaWR0aDtcblxuICAgIC8vIG51bWJlciBvZiBwaXhlbHMgc2luY2UgbGFzdCBmcmFtZVxuICAgIGxldCBwaXhlbHNTaW5jZUxhc3RGcmFtZSA9IHRoaXMubGFzdEZyYW1lV2lkdGg7XG5cbiAgICBpZiAoKGZyYW1lVHlwZSA9PT0gJ3NjYWxhcicgfHwgZnJhbWVUeXBlID09PSAndmVjdG9yJykgJiYgcHJldmlvdXNGcmFtZSkge1xuICAgICAgY29uc3QgZnJhbWVJbnRlcnZhbCA9IGZyYW1lLnRpbWUgLSBwcmV2aW91c0ZyYW1lLnRpbWU7XG4gICAgICBwaXhlbHNTaW5jZUxhc3RGcmFtZSA9IChmcmFtZUludGVydmFsIC8gY2FudmFzRHVyYXRpb24pICogY2FudmFzV2lkdGg7XG4gICAgfVxuXG4gICAgLy8gZHJhdyBjdXJyZW50IGZyYW1lXG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHgudHJhbnNsYXRlKHN0YXJ0VGltZVBvc2l0aW9uLCAwKTtcbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSwgZnJhbWVXaWR0aCwgcGl4ZWxzU2luY2VMYXN0RnJhbWUpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICAvLyBzYXZlIGN1cnJlbnQgY2FudmFzIHN0YXRlIGludG8gY2FjaGVkIGNhbnZhc1xuICAgIHRoaXMuY2FjaGVkQ3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KTtcbiAgICB0aGlzLmNhY2hlZEN0eC5kcmF3SW1hZ2UodGhpcy5jYW52YXMsIDAsIDAsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xuXG4gICAgLy8gdXBkYXRlIGxhc3RGcmFtZUR1cmF0aW9uLCBsYXN0RnJhbWVXaWR0aFxuICAgIHRoaXMubGFzdEZyYW1lRHVyYXRpb24gPSBmcmFtZUR1cmF0aW9uO1xuICAgIHRoaXMubGFzdEZyYW1lV2lkdGggPSBmcmFtZVdpZHRoO1xuICAgIHRoaXMucHJldmlvdXNGcmFtZSA9IGZyYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNoaWZ0IGNhbnZhcywgYWxzbyBjYWxsZWQgZnJvbSBgRGlzcGxheVN5bmNgXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzaGlmdENhbnZhcyhpU2hpZnQsIHRpbWUpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCBjYWNoZSA9IHRoaXMuY2FjaGVkQ2FudmFzO1xuICAgIGNvbnN0IGNhY2hlZEN0eCA9IHRoaXMuY2FjaGVkQ3R4O1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcbiAgICBjb25zdCBjcm9wcGVkV2lkdGggPSB3aWR0aCAtIGlTaGlmdDtcbiAgICB0aGlzLmN1cnJlbnRUaW1lID0gdGltZTtcblxuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgY3R4LmRyYXdJbWFnZShjYWNoZSwgaVNoaWZ0LCAwLCBjcm9wcGVkV2lkdGgsIGhlaWdodCwgMCwgMCwgY3JvcHBlZFdpZHRoLCBoZWlnaHQpO1xuICAgIC8vIHNhdmUgY3VycmVudCBjYW52YXMgc3RhdGUgaW50byBjYWNoZWQgY2FudmFzXG4gICAgY2FjaGVkQ3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBjYWNoZWRDdHguZHJhd0ltYWdlKHRoaXMuY2FudmFzLCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgfVxuXG4gIC8vIEB0b2RvIC0gRml4IHRyaWdnZXIgbW9kZVxuICAvLyBhbGxvdyB0byB3aXRjaCBlYXNpbHkgYmV0d2VlbiB0aGUgMiBtb2Rlc1xuICAvLyBzZXRUcmlnZ2VyKGJvb2wpIHtcbiAgLy8gICB0aGlzLnBhcmFtcy50cmlnZ2VyID0gYm9vbDtcbiAgLy8gICAvLyBjbGVhciBjYW52YXMgYW5kIGNhY2hlXG4gIC8vICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucGFyYW1zLndpZHRoLCB0aGlzLnBhcmFtcy5oZWlnaHQpO1xuICAvLyAgIHRoaXMuY2FjaGVkQ3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnBhcmFtcy53aWR0aCwgdGhpcy5wYXJhbXMuaGVpZ2h0KTtcbiAgLy8gICAvLyByZXNldCBfY3VycmVudFhQb3NpdGlvblxuICAvLyAgIHRoaXMuX2N1cnJlbnRYUG9zaXRpb24gPSAwO1xuICAvLyAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSAwO1xuICAvLyB9XG5cbiAgLy8gLyoqXG4gIC8vICAqIEFsdGVybmF0aXZlIGRyYXdpbmcgbW9kZS5cbiAgLy8gICogRHJhdyBmcm9tIGxlZnQgdG8gcmlnaHQsIGdvIGJhY2sgdG8gbGVmdCB3aGVuID4gd2lkdGhcbiAgLy8gICovXG4gIC8vIHRyaWdnZXJNb2RlRHJhdyh0aW1lLCBmcmFtZSkge1xuICAvLyAgIGNvbnN0IHdpZHRoICA9IHRoaXMucGFyYW1zLndpZHRoO1xuICAvLyAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgLy8gICBjb25zdCBkdXJhdGlvbiA9IHRoaXMucGFyYW1zLmR1cmF0aW9uO1xuICAvLyAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuXG4gIC8vICAgY29uc3QgZHQgPSB0aW1lIC0gdGhpcy5wcmV2aW91c1RpbWU7XG4gIC8vICAgY29uc3QgZlNoaWZ0ID0gKGR0IC8gZHVyYXRpb24pICogd2lkdGggLSB0aGlzLmxhc3RTaGlmdEVycm9yOyAvLyBweFxuICAvLyAgIGNvbnN0IGlTaGlmdCA9IE1hdGgucm91bmQoZlNoaWZ0KTtcbiAgLy8gICB0aGlzLmxhc3RTaGlmdEVycm9yID0gaVNoaWZ0IC0gZlNoaWZ0O1xuXG4gIC8vICAgdGhpcy5jdXJyZW50WFBvc2l0aW9uICs9IGlTaGlmdDtcblxuICAvLyAgIC8vIGRyYXcgdGhlIHJpZ2h0IHBhcnRcbiAgLy8gICBjdHguc2F2ZSgpO1xuICAvLyAgIGN0eC50cmFuc2xhdGUodGhpcy5jdXJyZW50WFBvc2l0aW9uLCAwKTtcbiAgLy8gICBjdHguY2xlYXJSZWN0KC1pU2hpZnQsIDAsIGlTaGlmdCwgaGVpZ2h0KTtcbiAgLy8gICB0aGlzLmRyYXdDdXJ2ZShmcmFtZSwgaVNoaWZ0KTtcbiAgLy8gICBjdHgucmVzdG9yZSgpO1xuXG4gIC8vICAgLy8gZ28gYmFjayB0byB0aGUgbGVmdCBvZiB0aGUgY2FudmFzIGFuZCByZWRyYXcgdGhlIHNhbWUgdGhpbmdcbiAgLy8gICBpZiAodGhpcy5jdXJyZW50WFBvc2l0aW9uID4gd2lkdGgpIHtcbiAgLy8gICAgIC8vIGdvIGJhY2sgdG8gc3RhcnRcbiAgLy8gICAgIHRoaXMuY3VycmVudFhQb3NpdGlvbiAtPSB3aWR0aDtcblxuICAvLyAgICAgY3R4LnNhdmUoKTtcbiAgLy8gICAgIGN0eC50cmFuc2xhdGUodGhpcy5jdXJyZW50WFBvc2l0aW9uLCAwKTtcbiAgLy8gICAgIGN0eC5jbGVhclJlY3QoLWlTaGlmdCwgMCwgaVNoaWZ0LCBoZWlnaHQpO1xuICAvLyAgICAgdGhpcy5kcmF3Q3VydmUoZnJhbWUsIHRoaXMucHJldmlvdXNGcmFtZSwgaVNoaWZ0KTtcbiAgLy8gICAgIGN0eC5yZXN0b3JlKCk7XG4gIC8vICAgfVxuICAvLyB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmFzZURpc3BsYXk7XG4iLCJpbXBvcnQgQmFzZURpc3BsYXkgZnJvbSAnLi9CYXNlRGlzcGxheSc7XG5pbXBvcnQgeyBnZXRDb2xvcnMgfSBmcm9tICcuLi91dGlscy9kaXNwbGF5LXV0aWxzJztcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIHJhZGl1czoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgbWluOiAwLFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH1cbiAgfSxcbiAgbGluZToge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICBjb2xvcnM6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICB9XG59XG5cblxuLyoqXG4gKiBCcmVha3BvaW50IEZ1bmN0aW9uLCBkaXNwbGF5IGEgc3RyZWFtIG9mIHR5cGUgYHZlY3RvcmAuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjbGllbnQuc2lua1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9ycz1udWxsXSAtIEFycmF5IG9mIGNvbG9ycyBmb3IgZWFjaCBpbmRleCBvZiB0aGVcbiAqICB2ZWN0b3IuIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5yYWRpdXM9MF0gLSBSYWRpdXMgb2YgdGhlIGRvdCBhdCBlYWNoIHZhbHVlLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5saW5lPXRydWVdIC0gRGlzcGxheSBhIGxpbmUgYmV0d2VlbiBlYWNoIGNvbnNlY3V0aXZlXG4gKiAgdmFsdWVzIG9mIHRoZSB2ZWN0b3IuIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5taW49LTFdIC0gTWluaW11bSB2YWx1ZSByZXByZXNlbnRlZCBpbiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXg9MV0gLSBNYXhpbXVtIHZhbHVlIHJlcHJlc2VudGVkIGluIHRoZSBjYW52YXMuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndpZHRoPTMwMF0gLSBXaWR0aCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oZWlnaHQ9MTUwXSAtIEhlaWdodCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY29udGFpbmVyPW51bGxdIC0gQ29udGFpbmVyIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBpbnNlcnQgdGhlIGNhbnZhcy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY2FudmFzPW51bGxdIC0gQ2FudmFzIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBkcmF3LiBfY29uc3RhbnQgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmR1cmF0aW9uPTFdIC0gRHVyYXRpb24gKGluIHNlY29uZHMpIHJlcHJlc2VudGVkIGluXG4gKiAgdGhlIGNhbnZhcy4gX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnJlZmVyZW5jZVRpbWU9bnVsbF0gLSBPcHRpb25uYWwgcmVmZXJlbmNlIHRpbWUgdGhlXG4gKiAgZGlzcGxheSBzaG91bGQgY29uc2lkZXJlciBhcyB0aGUgb3JpZ2luLiBJcyBvbmx5IHVzZWZ1bGwgd2hlbiBzeW5jaHJvbml6aW5nXG4gKiAgc2V2ZXJhbCBkaXNwbGF5IHVzaW5nIHRoZSBgRGlzcGxheVN5bmNgIGNsYXNzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVNpemU6IDIsXG4gKiAgIGZyYW1lUmF0ZTogMC4xLFxuICogICBmcmFtZVR5cGU6ICd2ZWN0b3InXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBicGYgPSBuZXcgbGZvLnNpbmsuQnBmRGlzcGxheSh7XG4gKiAgIGNhbnZhczogJyNicGYnLFxuICogICBkdXJhdGlvbjogMTAsXG4gKiB9KTtcbiAqXG4gKiBldmVudEluLmNvbm5lY3QoYnBmKTtcbiAqIGV2ZW50SW4uc3RhcnQoKTtcbiAqXG4gKiBsZXQgdGltZSA9IDA7XG4gKiBjb25zdCBkdCA9IDAuMTtcbiAqXG4gKiAoZnVuY3Rpb24gZ2VuZXJhdGVEYXRhKCkge1xuICogICBldmVudEluLnByb2Nlc3ModGltZSwgW01hdGgucmFuZG9tKCkgKiAyIC0gMSwgTWF0aC5yYW5kb20oKSAqIDIgLSAxXSk7XG4gKiAgIHRpbWUgKz0gZHQ7XG4gKlxuICogICBzZXRUaW1lb3V0KGdlbmVyYXRlRGF0YSwgZHQgKiAxMDAwKTtcbiAqIH0oKSk7XG4gKi9cbmNsYXNzIEJwZkRpc3BsYXkgZXh0ZW5kcyBCYXNlRGlzcGxheSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnByZXZGcmFtZSA9IG51bGw7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgZ2V0TWluaW11bUZyYW1lV2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLmdldCgncmFkaXVzJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnY29sb3JzJykgPT09IG51bGwpXG4gICAgICB0aGlzLnBhcmFtcy5zZXQoJ2NvbG9ycycsIGdldENvbG9ycygnYnBmJywgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplKSk7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUsIGZyYW1lV2lkdGgsIHBpeGVsc1NpbmNlTGFzdEZyYW1lKSB7XG4gICAgY29uc3QgY29sb3JzID0gdGhpcy5wYXJhbXMuZ2V0KCdjb2xvcnMnKTtcbiAgICBjb25zdCByYWRpdXMgPSB0aGlzLnBhcmFtcy5nZXQoJ3JhZGl1cycpO1xuICAgIGNvbnN0IGRyYXdMaW5lID0gdGhpcy5wYXJhbXMuZ2V0KCdsaW5lJyk7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IGRhdGEgPSBmcmFtZS5kYXRhO1xuICAgIGNvbnN0IHByZXZEYXRhID0gdGhpcy5wcmV2RnJhbWUgPyB0aGlzLnByZXZGcmFtZS5kYXRhIDogbnVsbDtcblxuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IGZyYW1lU2l6ZTsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgcG9zWSA9IHRoaXMuZ2V0WVBvc2l0aW9uKGRhdGFbaV0pO1xuICAgICAgY29uc3QgY29sb3IgPSBjb2xvcnNbaV07XG5cbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuXG4gICAgICBpZiAocHJldkRhdGEgJiYgZHJhd0xpbmUpIHtcbiAgICAgICAgY29uc3QgbGFzdFBvc1kgPSB0aGlzLmdldFlQb3NpdGlvbihwcmV2RGF0YVtpXSk7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4Lm1vdmVUbygtcGl4ZWxzU2luY2VMYXN0RnJhbWUsIGxhc3RQb3NZKTtcbiAgICAgICAgY3R4LmxpbmVUbygwLCBwb3NZKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyYWRpdXMgPiAwKSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmFyYygwLCBwb3NZLCByYWRpdXMsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XG4gICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICB0aGlzLnByZXZGcmFtZSA9IGZyYW1lO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJwZkRpc3BsYXk7XG4iLCJpbXBvcnQgQmFzZURpc3BsYXkgZnJvbSAnLi9CYXNlRGlzcGxheSc7XG5pbXBvcnQgeyBnZXRDb2xvcnMgfSBmcm9tICcuLi91dGlscy9kaXNwbGF5LXV0aWxzJztcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIHRocmVzaG9sZDoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgdGhyZXNob2xkSW5kZXg6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMCxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgY29sb3I6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiBnZXRDb2xvcnMoJ21hcmtlcicpLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9XG59O1xuXG4vKipcbiAqIERpc3BsYXkgYSBtYXJrZXIgYWNjb3JkaW5nIHRvIGEgYHZlY3RvcmAgaW5wdXQgZnJhbWUuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjbGllbnQuc2lua1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuY29sb3IgLSBDb2xvciBvZiB0aGUgbWFya2VyLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnRocmVzaG9sZEluZGV4PTBdIC0gSW5kZXggb2YgdGhlIGluY29tbWluZyBmcmFtZVxuICogIGRhdGEgdG8gY29tcGFyZSBhZ2FpbnN0IHRoZSB0aHJlc2hvbGQuIF9TaG91bGQgYmUgdXNlZCBpbiBjb25qb25jdGlvbiB3aXRoXG4gKiAgYHRocmVzaG9sZGBfLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnRocmVzaG9sZD1udWxsXSAtIE1pbmltdW0gdmFsdWUgdGhlIGluY29tbWluZyB2YWx1ZVxuICogIG11c3QgaGF2ZSB0byB0cmlnZ2VyIHRoZSBkaXNwbGF5IG9mIGEgbWFya2VyLiBJZiBudWxsIGVhY2ggaW5jb21taW5nIGV2ZW50XG4gKiAgdHJpZ2dlcnMgYSBtYXJrZXIuIF9TaG91bGQgYmUgdXNlZCBpbiBjb25qb25jdGlvbiB3aXRoIGB0aHJlc2hvbGRJbmRleGBfLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndpZHRoPTMwMF0gLSBXaWR0aCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oZWlnaHQ9MTUwXSAtIEhlaWdodCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY29udGFpbmVyPW51bGxdIC0gQ29udGFpbmVyIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBpbnNlcnQgdGhlIGNhbnZhcy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY2FudmFzPW51bGxdIC0gQ2FudmFzIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBkcmF3LiBfY29uc3RhbnQgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmR1cmF0aW9uPTFdIC0gRHVyYXRpb24gKGluIHNlY29uZHMpIHJlcHJlc2VudGVkIGluXG4gKiAgdGhlIGNhbnZhcy4gVGhpcyBwYXJhbWV0ZXIgb25seSBleGlzdHMgZm9yIG9wZXJhdG9ycyB0aGF0IGRpc3BsYXkgc2V2ZXJhbFxuICogIGNvbnNlY3V0aXZlIGZyYW1lcyBvbiB0aGUgY2FudmFzLiBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucmVmZXJlbmNlVGltZT1udWxsXSAtIE9wdGlvbm5hbCByZWZlcmVuY2UgdGltZSB0aGVcbiAqICBkaXNwbGF5IHNob3VsZCBjb25zaWRlcmVyIGFzIHRoZSBvcmlnaW4uIElzIG9ubHkgdXNlZnVsbCB3aGVuIHN5bmNocm9uaXppbmdcbiAqICBzZXZlcmFsIGRpc3BsYXkgdXNpbmcgdGhlIGBEaXNwbGF5U3luY2AgY2xhc3MuIFRoaXMgcGFyYW1ldGVyIG9ubHkgZXhpc3RzXG4gKiAgZm9yIG9wZXJhdG9ycyB0aGF0IGRpc3BsYXkgc2V2ZXJhbCBjb25zZWN1dGl2ZSBmcmFtZXMgb24gdGhlIGNhbnZhcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIGNvbnN0IGV2ZW50SW4gPSBuZXcgbGZvLnNvdXJjZS5FdmVudEluKHtcbiAqICAgZnJhbWVUeXBlOiAnc2NhbGFyJyxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IG1hcmtlciA9IG5ldyBsZm8uc2luay5NYXJrZXJEaXNwbGF5KHtcbiAqICAgY2FudmFzOiAnI21hcmtlcicsXG4gKiAgIHRocmVzaG9sZDogMC41LFxuICogfSk7XG4gKlxuICogZXZlbnRJbi5jb25uZWN0KG1hcmtlcik7XG4gKiBldmVudEluLnN0YXJ0KCk7XG4gKlxuICogbGV0IHRpbWUgPSAwO1xuICogY29uc3QgcGVyaW9kID0gMTtcbiAqXG4gKiAoZnVuY3Rpb24gZ2VuZXJhdGVEYXRhKCkge1xuICogICBldmVudEluLnByb2Nlc3ModGltZSwgTWF0aC5yYW5kb20oKSk7XG4gKlxuICogICB0aW1lICs9IHBlcmlvZDtcbiAqICAgc2V0VGltZW91dChnZW5lcmF0ZURhdGEsIHBlcmlvZCAqIDEwMDApO1xuICogfSgpKTtcbiAqL1xuY2xhc3MgTWFya2VyRGlzcGxheSBleHRlbmRzIEJhc2VEaXNwbGF5IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUsIGZyYW1lV2lkdGgsIHBpeGVsc1NpbmNlTGFzdEZyYW1lKSB7XG4gICAgY29uc3QgY29sb3IgPSB0aGlzLnBhcmFtcy5nZXQoJ2NvbG9yJyk7XG4gICAgY29uc3QgdGhyZXNob2xkID0gdGhpcy5wYXJhbXMuZ2V0KCd0aHJlc2hvbGQnKTtcbiAgICBjb25zdCB0aHJlc2hvbGRJbmRleCA9IHRoaXMucGFyYW1zLmdldCgndGhyZXNob2xkSW5kZXgnKTtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCBoZWlnaHQgPSBjdHguaGVpZ2h0O1xuICAgIGNvbnN0IHZhbHVlID0gZnJhbWUuZGF0YVt0aHJlc2hvbGRJbmRleF07XG5cbiAgICBpZiAodGhyZXNob2xkID09PSBudWxsIHx8IHZhbHVlID49IHRocmVzaG9sZCkge1xuICAgICAgbGV0IHlNaW4gPSB0aGlzLmdldFlQb3NpdGlvbih0aGlzLnBhcmFtcy5nZXQoJ21pbicpKTtcbiAgICAgIGxldCB5TWF4ID0gdGhpcy5nZXRZUG9zaXRpb24odGhpcy5wYXJhbXMuZ2V0KCdtYXgnKSk7XG5cbiAgICAgIGlmICh5TWluID4geU1heCkge1xuICAgICAgICBjb25zdCB2ID0geU1heDtcbiAgICAgICAgeU1heCA9IHlNaW47XG4gICAgICAgIHlNaW4gPSB2O1xuICAgICAgfVxuXG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgICAgY3R4LmZpbGxSZWN0KDAsIHlNaW4sIDEsIHlNYXgpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFya2VyRGlzcGxheTtcbiIsImltcG9ydCBCYXNlRGlzcGxheSBmcm9tICcuL0Jhc2VEaXNwbGF5JztcbmltcG9ydCB7IGdldENvbG9ycyB9IGZyb20gJy4uL3V0aWxzL2Rpc3BsYXktdXRpbHMnO1xuXG5jb25zdCBmbG9vciA9IE1hdGguZmxvb3I7XG5jb25zdCBjZWlsID0gTWF0aC5jZWlsO1xuXG5mdW5jdGlvbiBkb3duU2FtcGxlKGRhdGEsIHRhcmdldExlbmd0aCkge1xuICBjb25zdCBsZW5ndGggPSBkYXRhLmxlbmd0aDtcbiAgY29uc3QgaG9wID0gbGVuZ3RoIC8gdGFyZ2V0TGVuZ3RoO1xuICBjb25zdCB0YXJnZXQgPSBuZXcgRmxvYXQzMkFycmF5KHRhcmdldExlbmd0aCk7XG4gIGxldCBjb3VudGVyID0gMDtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRhcmdldExlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgaW5kZXggPSBmbG9vcihjb3VudGVyKTtcbiAgICBjb25zdCBwaGFzZSA9IGNvdW50ZXIgLSBpbmRleDtcbiAgICBjb25zdCBwcmV2ID0gZGF0YVtpbmRleF07XG4gICAgY29uc3QgbmV4dCA9IGRhdGFbaW5kZXggKyAxXTtcblxuICAgIHRhcmdldFtpXSA9IChuZXh0IC0gcHJldikgKiBwaGFzZSArIHByZXY7XG4gICAgY291bnRlciArPSBob3A7XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgY29sb3I6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiBnZXRDb2xvcnMoJ3NpZ25hbCcpLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICB9LFxufTtcblxuLyoqXG4gKiBEaXNwbGF5IGEgc3RyZWFtIG9mIHR5cGUgYHNpZ25hbGAgb24gYSBjYW52YXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9JyMwMGU2MDAnXSAtIENvbG9yIG9mIHRoZSBzaWduYWwuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWluPS0xXSAtIE1pbmltdW0gdmFsdWUgcmVwcmVzZW50ZWQgaW4gdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWF4PTFdIC0gTWF4aW11bSB2YWx1ZSByZXByZXNlbnRlZCBpbiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy53aWR0aD0zMDBdIC0gV2lkdGggb2YgdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGVpZ2h0PTE1MF0gLSBIZWlnaHQgb2YgdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge0VsZW1lbnR8Q1NTU2VsZWN0b3J9IFtvcHRpb25zLmNvbnRhaW5lcj1udWxsXSAtIENvbnRhaW5lciBlbGVtZW50XG4gKiAgaW4gd2hpY2ggdG8gaW5zZXJ0IHRoZSBjYW52YXMuIF9jb25zdGFudCBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge0VsZW1lbnR8Q1NTU2VsZWN0b3J9IFtvcHRpb25zLmNhbnZhcz1udWxsXSAtIENhbnZhcyBlbGVtZW50XG4gKiAgaW4gd2hpY2ggdG8gZHJhdy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5kdXJhdGlvbj0xXSAtIER1cmF0aW9uIChpbiBzZWNvbmRzKSByZXByZXNlbnRlZCBpblxuICogIHRoZSBjYW52YXMuIFRoaXMgcGFyYW1ldGVyIG9ubHkgZXhpc3RzIGZvciBvcGVyYXRvcnMgdGhhdCBkaXNwbGF5IHNldmVyYWxcbiAqICBjb25zZWN1dGl2ZSBmcmFtZXMgb24gdGhlIGNhbnZhcy4gX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnJlZmVyZW5jZVRpbWU9bnVsbF0gLSBPcHRpb25uYWwgcmVmZXJlbmNlIHRpbWUgdGhlXG4gKiAgZGlzcGxheSBzaG91bGQgY29uc2lkZXJlciBhcyB0aGUgb3JpZ2luLiBJcyBvbmx5IHVzZWZ1bGwgd2hlbiBzeW5jaHJvbml6aW5nXG4gKiAgc2V2ZXJhbCBkaXNwbGF5IHVzaW5nIHRoZSBgRGlzcGxheVN5bmNgIGNsYXNzLiBUaGlzIHBhcmFtZXRlciBvbmx5IGV4aXN0c1xuICogIGZvciBvcGVyYXRvcnMgdGhhdCBkaXNwbGF5IHNldmVyYWwgY29uc2VjdXRpdmUgZnJhbWVzIG9uIHRoZSBjYW52YXMuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjbGllbnQuc2lua1xuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBldmVudEluID0gbmV3IGxmby5zb3VyY2UuRXZlbnRJbih7XG4gKiAgIGZyYW1lVHlwZTogJ3NpZ25hbCcsXG4gKiAgIHNhbXBsZVJhdGU6IDgsXG4gKiAgIGZyYW1lU2l6ZTogNCxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IHNpZ25hbERpc3BsYXkgPSBuZXcgbGZvLnNpbmsuU2lnbmFsRGlzcGxheSh7XG4gKiAgIGNhbnZhczogJyNzaWduYWwtY2FudmFzJyxcbiAqIH0pO1xuICpcbiAqIGV2ZW50SW4uY29ubmVjdChzaWduYWxEaXNwbGF5KTtcbiAqIGV2ZW50SW4uc3RhcnQoKTtcbiAqXG4gKiAvLyBwdXNoIHRyaWFuZ2xlIHNpZ25hbCBpbiB0aGUgZ3JhcGhcbiAqIGV2ZW50SW4ucHJvY2VzcygwLCBbMCwgMC41LCAxLCAwLjVdKTtcbiAqIGV2ZW50SW4ucHJvY2VzcygwLjUsIFswLCAtMC41LCAtMSwgLTAuNV0pO1xuICogLy8gLi4uXG4gKi9cbmNsYXNzIFNpZ25hbERpc3BsYXkgZXh0ZW5kcyBCYXNlRGlzcGxheSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucywgdHJ1ZSk7XG5cbiAgICB0aGlzLmxhc3RQb3NZID0gbnVsbDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKGZyYW1lLCBmcmFtZVdpZHRoLCBwaXhlbHNTaW5jZUxhc3RGcmFtZSkge1xuICAgIGNvbnN0IGNvbG9yID0gdGhpcy5wYXJhbXMuZ2V0KCdjb2xvcicpO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBsZXQgZGF0YSA9IGZyYW1lLmRhdGE7XG5cbiAgICBpZiAoZnJhbWVXaWR0aCA8IGZyYW1lU2l6ZSlcbiAgICAgIGRhdGEgPSBkb3duU2FtcGxlKGRhdGEsIGZyYW1lV2lkdGgpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gZGF0YS5sZW5ndGg7XG4gICAgY29uc3QgaG9wWCA9IGZyYW1lV2lkdGggLyBsZW5ndGg7XG4gICAgbGV0IHBvc1ggPSAwO1xuICAgIGxldCBsYXN0WSA9IHRoaXMubGFzdFBvc1k7XG5cbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHBvc1kgPSB0aGlzLmdldFlQb3NpdGlvbihkYXRhW2ldKTtcblxuICAgICAgaWYgKGxhc3RZID09PSBudWxsKSB7XG4gICAgICAgIGN0eC5tb3ZlVG8ocG9zWCwgcG9zWSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaSA9PT0gMClcbiAgICAgICAgICBjdHgubW92ZVRvKC1ob3BYLCBsYXN0WSk7XG5cbiAgICAgICAgY3R4LmxpbmVUbyhwb3NYLCBwb3NZKTtcbiAgICAgIH1cblxuICAgICAgcG9zWCArPSBob3BYO1xuICAgICAgbGFzdFkgPSBwb3NZO1xuICAgIH1cblxuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG5cbiAgICB0aGlzLmxhc3RQb3NZID0gbGFzdFk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2lnbmFsRGlzcGxheTtcbiIsImltcG9ydCBCYXNlRGlzcGxheSBmcm9tICcuL0Jhc2VEaXNwbGF5JztcbmltcG9ydCBGZnQgZnJvbSAnLi4vLi4vY29tbW9uL29wZXJhdG9yL0ZmdCc7XG5pbXBvcnQgeyBnZXRDb2xvcnMgfSBmcm9tICcuLi91dGlscy9kaXNwbGF5LXV0aWxzJztcblxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgc2NhbGU6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDEsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG4gIGNvbG9yOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogZ2V0Q29sb3JzKCdzcGVjdHJ1bScpLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICBtaW46IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IC04MCxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgbWF4OiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiA2LFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9XG59O1xuXG5cbi8qKlxuICogRGlzcGxheSB0aGUgc3BlY3RydW0gb2YgdGhlIGluY29tbWluZyBgc2lnbmFsYCBpbnB1dC5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNsaWVudC5zaW5rXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuc2NhbGU9MV0gLSBTY2FsZSBkaXNwbGF5IG9mIHRoZSBzcGVjdHJvZ3JhbS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj1udWxsXSAtIENvbG9yIG9mIHRoZSBzcGVjdHJvZ3JhbS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5taW49LTgwXSAtIE1pbmltdW0gZGlzcGxheWVkIHZhbHVlIChpbiBkQikuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWF4PTZdIC0gTWF4aW11bSBkaXNwbGF5ZWQgdmFsdWUgKGluIGRCKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy53aWR0aD0zMDBdIC0gV2lkdGggb2YgdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGVpZ2h0PTE1MF0gLSBIZWlnaHQgb2YgdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge0VsZW1lbnR8Q1NTU2VsZWN0b3J9IFtvcHRpb25zLmNvbnRhaW5lcj1udWxsXSAtIENvbnRhaW5lciBlbGVtZW50XG4gKiAgaW4gd2hpY2ggdG8gaW5zZXJ0IHRoZSBjYW52YXMuIF9jb25zdGFudCBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge0VsZW1lbnR8Q1NTU2VsZWN0b3J9IFtvcHRpb25zLmNhbnZhcz1udWxsXSAtIENhbnZhcyBlbGVtZW50XG4gKiAgaW4gd2hpY2ggdG8gZHJhdy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqXG4gKiBAdG9kbyAtIGV4cG9zZSBtb3JlIGBmZnRgIGNvbmZpZyBvcHRpb25zXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiBjb25zdCBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gKlxuICogbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICogICAuZ2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSlcbiAqICAgLnRoZW4oaW5pdClcbiAqICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKSk7XG4gKlxuICogZnVuY3Rpb24gaW5pdChzdHJlYW0pIHtcbiAqICAgY29uc3Qgc291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZU1lZGlhU3RyZWFtU291cmNlKHN0cmVhbSk7XG4gKlxuICogICBjb25zdCBhdWRpb0luTm9kZSA9IG5ldyBsZm8uc291cmNlLkF1ZGlvSW5Ob2RlKHtcbiAqICAgICBhdWRpb0NvbnRleHQ6IGF1ZGlvQ29udGV4dCxcbiAqICAgICBzb3VyY2VOb2RlOiBzb3VyY2UsXG4gKiAgIH0pO1xuICpcbiAqICAgY29uc3Qgc3BlY3RydW0gPSBuZXcgbGZvLnNpbmsuU3BlY3RydW1EaXNwbGF5KHtcbiAqICAgICBjYW52YXM6ICcjc3BlY3RydW0nLFxuICogICB9KTtcbiAqXG4gKiAgIGF1ZGlvSW5Ob2RlLmNvbm5lY3Qoc3BlY3RydW0pO1xuICogICBhdWRpb0luTm9kZS5zdGFydCgpO1xuICogfVxuICovXG5jbGFzcyBTcGVjdHJ1bURpc3BsYXkgZXh0ZW5kcyBCYXNlRGlzcGxheSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zLCBmYWxzZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5mZnQgPSBuZXcgRmZ0KHtcbiAgICAgIHNpemU6IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSxcbiAgICAgIHdpbmRvdzogJ2hhbm4nLFxuICAgICAgbm9ybTogJ2xpbmVhcicsXG4gICAgfSk7XG5cbiAgICB0aGlzLmZmdC5pbml0U3RyZWFtKHRoaXMuc3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIGNvbnN0IGJpbnMgPSB0aGlzLmZmdC5pbnB1dFNpZ25hbChmcmFtZS5kYXRhKTtcbiAgICBjb25zdCBuYnJCaW5zID0gYmlucy5sZW5ndGg7XG5cbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuY2FudmFzV2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5jYW52YXNIZWlnaHQ7XG4gICAgY29uc3Qgc2NhbGUgPSB0aGlzLnBhcmFtcy5nZXQoJ3NjYWxlJyk7XG5cbiAgICBjb25zdCBiaW5XaWR0aCA9IHdpZHRoIC8gbmJyQmlucztcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcblxuICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLnBhcmFtcy5nZXQoJ2NvbG9yJyk7XG5cbiAgICAvLyBlcnJvciBoYW5kbGluZyBuZWVkcyByZXZpZXcuLi5cbiAgICBsZXQgZXJyb3IgPSAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYnJCaW5zOyBpKyspIHtcbiAgICAgIGNvbnN0IHgxRmxvYXQgPSBpICogYmluV2lkdGggKyBlcnJvcjtcbiAgICAgIGNvbnN0IHgxSW50ID0gTWF0aC5yb3VuZCh4MUZsb2F0KTtcbiAgICAgIGNvbnN0IHgyRmxvYXQgPSB4MUZsb2F0ICsgKGJpbldpZHRoIC0gZXJyb3IpO1xuICAgICAgY29uc3QgeDJJbnQgPSBNYXRoLnJvdW5kKHgyRmxvYXQpO1xuXG4gICAgICBlcnJvciA9IHgySW50IC0geDJGbG9hdDtcblxuICAgICAgaWYgKHgxSW50ICE9PSB4MkludCkge1xuICAgICAgICBjb25zdCB3aWR0aCA9IHgySW50IC0geDFJbnQ7XG4gICAgICAgIGNvbnN0IGRiID0gMjAgKiBNYXRoLmxvZzEwKGJpbnNbaV0pO1xuICAgICAgICBjb25zdCB5ID0gdGhpcy5nZXRZUG9zaXRpb24oZGIgKiBzY2FsZSk7XG4gICAgICAgIGN0eC5maWxsUmVjdCh4MUludCwgeSwgd2lkdGgsIGhlaWdodCAtIHkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXJyb3IgLT0gYmluV2lkdGg7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNwZWN0cnVtRGlzcGxheTtcbiIsImltcG9ydCBCYXNlRGlzcGxheSBmcm9tICcuL0Jhc2VEaXNwbGF5JztcbmltcG9ydCB7IGdldENvbG9ycywgZ2V0SHVlLCBoZXhUb1JHQiB9IGZyb20gJy4uL3V0aWxzL2Rpc3BsYXktdXRpbHMnO1xuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBjb2xvcjoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6IGdldENvbG9ycygndHJhY2UnKSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgY29sb3JTY2hlbWU6IHtcbiAgICB0eXBlOiAnZW51bScsXG4gICAgZGVmYXVsdDogJ25vbmUnLFxuICAgIGxpc3Q6IFsnbm9uZScsICdodWUnLCAnb3BhY2l0eSddLFxuICB9LFxufTtcblxuLyoqXG4gKiBEaXNwbGF5IGEgcmFuZ2UgdmFsdWUgYXJvdW5kIGEgbWVhbiB2YWx1ZSAoZm9yIGV4YW1wbGUgbWVhblxuICogYW5kIHN0YW5kYXJ0IGRldmlhdGlvbikuXG4gKlxuICogVGhpcyBzaW5rIGNhbiBoYW5kbGUgaW5wdXQgb2YgdHlwZSBgdmVjdG9yYCBvZiBmcmFtZVNpemUgPj0gMi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nb3JhbmdlJ10gLSBDb2xvci5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvclNjaGVtZT0nbm9uZSddIC0gSWYgYSB0aGlyZCB2YWx1ZSBpcyBhdmFpbGFibGVcbiAqICBpbiB0aGUgaW5wdXQsIGNhbiBiZSB1c2VkIHRvIGNvbnRyb2wgdGhlIG9wYWNpdHkgb3IgdGhlIGh1ZS4gSWYgaW5wdXQgZnJhbWVcbiAqICBzaXplIGlzIDIsIHRoaXMgcGFyYW0gaXMgYXV0b21hdGljYWxseSBzZXQgdG8gYG5vbmVgXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWluPS0xXSAtIE1pbmltdW0gdmFsdWUgcmVwcmVzZW50ZWQgaW4gdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWF4PTFdIC0gTWF4aW11bSB2YWx1ZSByZXByZXNlbnRlZCBpbiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy53aWR0aD0zMDBdIC0gV2lkdGggb2YgdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGVpZ2h0PTE1MF0gLSBIZWlnaHQgb2YgdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge0VsZW1lbnR8Q1NTU2VsZWN0b3J9IFtvcHRpb25zLmNvbnRhaW5lcj1udWxsXSAtIENvbnRhaW5lciBlbGVtZW50XG4gKiAgaW4gd2hpY2ggdG8gaW5zZXJ0IHRoZSBjYW52YXMuIF9jb25zdGFudCBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge0VsZW1lbnR8Q1NTU2VsZWN0b3J9IFtvcHRpb25zLmNhbnZhcz1udWxsXSAtIENhbnZhcyBlbGVtZW50XG4gKiAgaW4gd2hpY2ggdG8gZHJhdy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5kdXJhdGlvbj0xXSAtIER1cmF0aW9uIChpbiBzZWNvbmRzKSByZXByZXNlbnRlZCBpblxuICogIHRoZSBjYW52YXMuIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5yZWZlcmVuY2VUaW1lPW51bGxdIC0gT3B0aW9ubmFsIHJlZmVyZW5jZSB0aW1lIHRoZVxuICogIGRpc3BsYXkgc2hvdWxkIGNvbnNpZGVyZXIgYXMgdGhlIG9yaWdpbi4gSXMgb25seSB1c2VmdWxsIHdoZW4gc3luY2hyb25pemluZ1xuICogIHNldmVyYWwgZGlzcGxheSB1c2luZyB0aGUgYERpc3BsYXlTeW5jYCBjbGFzcy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNsaWVudC5zaW5rXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiBjb25zdCBBdWRpb0NvbnRleHQgPSAod2luZG93LkF1ZGlvQ29udGV4dCB8fMKgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCk7XG4gKiBjb25zdCBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gKlxuICogbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICogICAuZ2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSlcbiAqICAgLnRoZW4oaW5pdClcbiAqICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKSk7XG4gKlxuICogZnVuY3Rpb24gaW5pdChzdHJlYW0pIHtcbiAqICAgY29uc3Qgc291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZU1lZGlhU3RyZWFtU291cmNlKHN0cmVhbSk7XG4gKlxuICogICBjb25zdCBhdWRpb0luTm9kZSA9IG5ldyBsZm8uc291cmNlLkF1ZGlvSW5Ob2RlKHtcbiAqICAgICBzb3VyY2VOb2RlOiBzb3VyY2UsXG4gKiAgICAgYXVkaW9Db250ZXh0OiBhdWRpb0NvbnRleHQsXG4gKiAgIH0pO1xuICpcbiAqICAgLy8gbm90IHN1cmUgaXQgbWFrZSBzZW5zIGJ1dC4uLlxuICogICBjb25zdCBtZWFuU3RkZGV2ID0gbmV3IGxmby5vcGVyYXRvci5NZWFuU3RkZGV2KCk7XG4gKlxuICogICBjb25zdCB0cmFjZURpc3BsYXkgPSBuZXcgbGZvLnNpbmsuVHJhY2VEaXNwbGF5KHtcbiAqICAgICBjYW52YXM6ICcjdHJhY2UnLFxuICogICB9KTtcbiAqXG4gKiAgIGNvbnN0IGxvZ2dlciA9IG5ldyBsZm8uc2luay5Mb2dnZXIoeyBkYXRhOiB0cnVlIH0pO1xuICpcbiAqICAgYXVkaW9Jbk5vZGUuY29ubmVjdChtZWFuU3RkZGV2KTtcbiAqICAgbWVhblN0ZGRldi5jb25uZWN0KHRyYWNlRGlzcGxheSk7XG4gKlxuICogICBhdWRpb0luTm9kZS5zdGFydCgpO1xuICogfVxuICovXG5jbGFzcyBUcmFjZURpc3BsYXkgZXh0ZW5kcyBCYXNlRGlzcGxheSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMucHJldkZyYW1lID0gbnVsbDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID09PSAyKVxuICAgICAgdGhpcy5wYXJhbXMuc2V0KCdjb2xvclNjaGVtZScsICdub25lJyk7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUsIGZyYW1lV2lkdGgsIHBpeGVsc1NpbmNlTGFzdEZyYW1lKSB7XG4gICAgY29uc3QgY29sb3JTY2hlbWUgPSB0aGlzLnBhcmFtcy5nZXQoJ2NvbG9yU2NoZW1lJyk7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG4gICAgY29uc3QgcHJldkRhdGEgPSB0aGlzLnByZXZGcmFtZSA/IHRoaXMucHJldkZyYW1lLmRhdGEgOiBudWxsO1xuICAgIGNvbnN0IGRhdGEgPSBmcmFtZS5kYXRhO1xuXG4gICAgY29uc3QgaGFsZlJhbmdlID0gZGF0YVsxXSAvIDI7XG4gICAgY29uc3QgbWVhbiA9IHRoaXMuZ2V0WVBvc2l0aW9uKGRhdGFbMF0pO1xuICAgIGNvbnN0IG1pbiA9IHRoaXMuZ2V0WVBvc2l0aW9uKGRhdGFbMF0gLSBoYWxmUmFuZ2UpO1xuICAgIGNvbnN0IG1heCA9IHRoaXMuZ2V0WVBvc2l0aW9uKGRhdGFbMF0gKyBoYWxmUmFuZ2UpO1xuXG4gICAgbGV0IHByZXZIYWxmUmFuZ2U7XG4gICAgbGV0IHByZXZNZWFuO1xuICAgIGxldCBwcmV2TWluO1xuICAgIGxldCBwcmV2TWF4O1xuXG4gICAgaWYgKHByZXZEYXRhICE9PSBudWxsKSB7XG4gICAgICBwcmV2SGFsZlJhbmdlID0gcHJldkRhdGFbMV0gLyAyO1xuICAgICAgcHJldk1lYW4gPSB0aGlzLmdldFlQb3NpdGlvbihwcmV2RGF0YVswXSk7XG4gICAgICBwcmV2TWluID0gdGhpcy5nZXRZUG9zaXRpb24ocHJldkRhdGFbMF0gLSBwcmV2SGFsZlJhbmdlKTtcbiAgICAgIHByZXZNYXggPSB0aGlzLmdldFlQb3NpdGlvbihwcmV2RGF0YVswXSArIHByZXZIYWxmUmFuZ2UpO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbG9yID0gdGhpcy5wYXJhbXMuZ2V0KCdjb2xvcicpO1xuICAgIGxldCBncmFkaWVudDtcbiAgICBsZXQgcmdiO1xuXG4gICAgc3dpdGNoIChjb2xvclNjaGVtZSkge1xuICAgICAgY2FzZSAnbm9uZSc6XG4gICAgICAgIHJnYiA9IGhleFRvUkdCKGNvbG9yKTtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGByZ2JhKCR7cmdiLmpvaW4oJywnKX0sIDAuNylgO1xuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaHVlJzpcbiAgICAgICAgZ3JhZGllbnQgPSBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQoLXBpeGVsc1NpbmNlTGFzdEZyYW1lLCAwLCAwLCAwKTtcblxuICAgICAgICBpZiAocHJldkRhdGEpXG4gICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIGBoc2woJHtnZXRIdWUocHJldkRhdGFbMl0pfSwgMTAwJSwgNTAlKWApO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIGBoc2woJHtnZXRIdWUoZGF0YVsyXSl9LCAxMDAlLCA1MCUpYCk7XG5cbiAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsIGBoc2woJHtnZXRIdWUoZGF0YVsyXSl9LCAxMDAlLCA1MCUpYCk7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb3BhY2l0eSc6XG4gICAgICAgIHJnYiA9IGhleFRvUkdCKHRoaXMucGFyYW1zLmdldCgnY29sb3InKSk7XG4gICAgICAgIGdyYWRpZW50ID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KC1waXhlbHNTaW5jZUxhc3RGcmFtZSwgMCwgMCwgMCk7XG5cbiAgICAgICAgaWYgKHByZXZEYXRhKVxuICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCBgcmdiYSgke3JnYi5qb2luKCcsJyl9LCAke3ByZXZEYXRhWzJdfSlgKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCBgcmdiYSgke3JnYi5qb2luKCcsJyl9LCAke2RhdGFbMl19KWApO1xuXG4gICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCBgcmdiYSgke3JnYi5qb2luKCcsJyl9LCAke2RhdGFbMl19KWApO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIC8vIGRyYXcgcmFuZ2VcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lm1vdmVUbygwLCBtZWFuKTtcbiAgICBjdHgubGluZVRvKDAsIG1heCk7XG5cbiAgICBpZiAocHJldkRhdGEgIT09IG51bGwpIHtcbiAgICAgIGN0eC5saW5lVG8oLXBpeGVsc1NpbmNlTGFzdEZyYW1lLCBwcmV2TWF4KTtcbiAgICAgIGN0eC5saW5lVG8oLXBpeGVsc1NpbmNlTGFzdEZyYW1lLCBwcmV2TWluKTtcbiAgICB9XG5cbiAgICBjdHgubGluZVRvKDAsIG1pbik7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuXG4gICAgY3R4LmZpbGwoKTtcblxuICAgIC8vIGRyYXcgbWVhblxuICAgIGlmIChjb2xvclNjaGVtZSA9PT0gJ25vbmUnICYmIHByZXZNZWFuKSB7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKC1waXhlbHNTaW5jZUxhc3RGcmFtZSwgcHJldk1lYW4pO1xuICAgICAgY3R4LmxpbmVUbygwLCBtZWFuKTtcbiAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cblxuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICB0aGlzLnByZXZGcmFtZSA9IGZyYW1lO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBUcmFjZURpc3BsYXk7XG4iLCJpbXBvcnQgQmFzZURpc3BsYXkgZnJvbSAnLi9CYXNlRGlzcGxheSc7XG5pbXBvcnQgUm1zIGZyb20gJy4uLy4uL2NvbW1vbi9vcGVyYXRvci9SbXMnO1xuXG5jb25zdCBsb2cxMCA9IE1hdGgubG9nMTA7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBvZmZzZXQ6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IC0xNCxcbiAgICBtZXRhczogeyBraW5kOiAnZHlhbm1pYycgfSxcbiAgfSxcbiAgbWluOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiAtODAsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG4gIG1heDoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogNixcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgd2lkdGg6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogNixcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfVxufVxuXG4vKipcbiAqIFNpbXBsZSBWVS1NZXRlciB0byB1c2VkIG9uIGEgYHNpZ25hbGAgc3RyZWFtLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y2xpZW50LnNpbmtcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHRzIHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMub2Zmc2V0PS0xNF0gLSBkQiBvZmZzZXQgYXBwbGllZCB0byB0aGUgc2lnbmFsLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1pbj0tODBdIC0gTWluaW11bSBkaXNwbGF5ZWQgdmFsdWUgKGluIGRCKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXg9Nl0gLSBNYXhpbXVtIGRpc3BsYXllZCB2YWx1ZSAoaW4gZEIpLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndpZHRoPTZdIC0gV2lkdGggb2YgdGhlIGRpc3BsYXkgKGluIHBpeGVscykuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGVpZ2h0PTE1MF0gLSBIZWlnaHQgb2YgdGhlIGNhbnZhcy5cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY29udGFpbmVyPW51bGxdIC0gQ29udGFpbmVyIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBpbnNlcnQgdGhlIGNhbnZhcy5cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY2FudmFzPW51bGxdIC0gQ2FudmFzIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBkcmF3LlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gKlxuICogY29uc3QgYXVkaW9Db250ZXh0ID0gbmV3IHdpbmRvdy5BdWRpb0NvbnRleHQoKTtcbiAqXG4gKiBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXG4gKiAgIC5nZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSB9KVxuICogICAudGhlbihpbml0KVxuICogICAuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcbiAqXG4gKiBmdW5jdGlvbiBpbml0KHN0cmVhbSkge1xuICogICBjb25zdCBzb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlTWVkaWFTdHJlYW1Tb3VyY2Uoc3RyZWFtKTtcbiAqXG4gKiAgIGNvbnN0IGF1ZGlvSW5Ob2RlID0gbmV3IGxmby5zb3VyY2UuQXVkaW9Jbk5vZGUoe1xuICogICAgIGF1ZGlvQ29udGV4dDogYXVkaW9Db250ZXh0LFxuICogICAgIHNvdXJjZU5vZGU6IHNvdXJjZSxcbiAqICAgfSk7XG4gKlxuICogICBjb25zdCB2dU1ldGVyID0gbmV3IGxmby5zaW5rLlZ1TWV0ZXJEaXNwbGF5KHtcbiAqICAgICBjYW52YXM6ICcjdnUtbWV0ZXInLFxuICogICB9KTtcbiAqXG4gKiAgIGF1ZGlvSW5Ob2RlLmNvbm5lY3QodnVNZXRlcik7XG4gKiAgIGF1ZGlvSW5Ob2RlLnN0YXJ0KCk7XG4gKiB9XG4gKi9cbmNsYXNzIFZ1TWV0ZXJEaXNwbGF5IGV4dGVuZHMgQmFzZURpc3BsYXkge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucywgZmFsc2UpO1xuXG4gICAgdGhpcy5ybXNPcGVyYXRvciA9IG5ldyBSbXMoKTtcblxuICAgIHRoaXMubGFzdERCID0gMDtcbiAgICB0aGlzLnBlYWsgPSB7XG4gICAgICB2YWx1ZTogMCxcbiAgICAgIHRpbWU6IDAsXG4gICAgfVxuXG4gICAgdGhpcy5wZWFrTGlmZXRpbWUgPSAxOyAvLyBzZWNcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLnJtc09wZXJhdG9yLmluaXRTdHJlYW0odGhpcy5zdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKGZyYW1lKSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwOyAvLyBzZWNcbiAgICBjb25zdCBvZmZzZXQgPSB0aGlzLnBhcmFtcy5nZXQoJ29mZnNldCcpOyAvLyBvZmZzZXQgemVybyBvZiB0aGUgdnUgbWV0ZXJcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuY2FudmFzV2lkdGg7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG5cbiAgICBjb25zdCBsYXN0REIgPSB0aGlzLmxhc3REQjtcbiAgICBjb25zdCBwZWFrID0gdGhpcy5wZWFrO1xuXG4gICAgY29uc3QgcmVkID0gJyNmZjIxMjEnO1xuICAgIGNvbnN0IHllbGxvdyA9ICcjZmZmZjFmJztcbiAgICBjb25zdCBncmVlbiA9ICcjMDBmZjAwJztcblxuICAgIC8vIGhhbmRsZSBjdXJyZW50IGRiIHZhbHVlXG4gICAgY29uc3Qgcm1zID0gdGhpcy5ybXNPcGVyYXRvci5pbnB1dFNpZ25hbChmcmFtZS5kYXRhKTtcbiAgICBsZXQgZEIgPSAyMCAqIGxvZzEwKHJtcykgLSBvZmZzZXQ7XG5cbiAgICAvLyBzbG93IHJlbGVhc2UgKGNvdWxkIHByb2JhYmx5IGJlIGltcHJvdmVkKVxuICAgIGlmIChsYXN0REIgPiBkQilcbiAgICAgIGRCID0gbGFzdERCIC0gNjtcblxuICAgIC8vIGhhbmRsZSBwZWFrXG4gICAgaWYgKGRCID4gcGVhay52YWx1ZSB8fMKgKG5vdyAtIHBlYWsudGltZSkgPiB0aGlzLnBlYWtMaWZldGltZSkge1xuICAgICAgcGVhay52YWx1ZSA9IGRCO1xuICAgICAgcGVhay50aW1lID0gbm93O1xuICAgIH1cblxuICAgIGNvbnN0IHkwID0gdGhpcy5nZXRZUG9zaXRpb24oMCk7XG4gICAgY29uc3QgeSA9IHRoaXMuZ2V0WVBvc2l0aW9uKGRCKTtcbiAgICBjb25zdCB5UGVhayA9IHRoaXMuZ2V0WVBvc2l0aW9uKHBlYWsudmFsdWUpO1xuXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGN0eC5maWxsU3R5bGUgPSAnIzAwMDAwMCc7XG4gICAgY3R4LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgY29uc3QgZ3JhZGllbnQgPSBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgaGVpZ2h0LCAwLCAwKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgZ3JlZW4pO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgoaGVpZ2h0IC0geTApIC8gaGVpZ2h0LCB5ZWxsb3cpO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCByZWQpO1xuXG4gICAgLy8gZEJcbiAgICBjdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgY3R4LmZpbGxSZWN0KDAsIHksIHdpZHRoLCBoZWlnaHQgLSB5KTtcblxuICAgIC8vIDAgZEIgbWFya2VyXG4gICAgY3R4LmZpbGxTdHlsZSA9ICcjZGNkY2RjJztcbiAgICBjdHguZmlsbFJlY3QoMCwgeTAsIHdpZHRoLCAyKTtcblxuICAgIC8vIHBlYWtcbiAgICBjdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgY3R4LmZpbGxSZWN0KDAsIHlQZWFrLCB3aWR0aCwgMik7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuXG4gICAgdGhpcy5sYXN0REIgPSBkQjtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBWdU1ldGVyRGlzcGxheTtcbiIsImltcG9ydCBCYXNlRGlzcGxheSBmcm9tICcuL0Jhc2VEaXNwbGF5JztcbmltcG9ydCBNaW5NYXggZnJvbSAnLi4vLi4vY29tbW9uL29wZXJhdG9yL01pbk1heCc7XG5pbXBvcnQgUm1zIGZyb20gJy4uLy4uL2NvbW1vbi9vcGVyYXRvci9SbXMnO1xuaW1wb3J0IHsgZ2V0Q29sb3JzIH0gZnJvbSAnLi4vdXRpbHMvZGlzcGxheS11dGlscyc7XG5cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGNvbG9yczoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IGdldENvbG9ycygnd2F2ZWZvcm0nKSxcbiAgICBtZXRhczogeyBraW5kOiAnZHlhbm1pYycgfSxcbiAgfSxcbiAgcm1zOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9XG59O1xuXG4vKipcbiAqIERpc3BsYXkgYSB3YXZlZm9ybSAoYWxvbmcgd2l0aCBvcHRpb25uYWwgUm1zKSBvZiBhIGdpdmVuIGBzaWduYWxgIGlucHV0IGluXG4gKiBhIGNhbnZhcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gW29wdGlvbnMuY29sb3JzPVsnd2F2ZWZvcm0nLCAncm1zJ11dIC0gQXJyYXlcbiAqICBjb250YWluaW5nIHRoZSBjb2xvciBjb2RlcyBmb3IgdGhlIHdhdmVmb3JtIChpbmRleCAwKSBhbmQgcm1zIChpbmRleCAxKS5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnJtcz1mYWxzZV0gLSBTZXQgdG8gYHRydWVgIHRvIGRpc3BsYXkgdGhlIHJtcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZHVyYXRpb249MV0gLSBEdXJhdGlvbiAoaW4gc2Vjb25kcykgcmVwcmVzZW50ZWQgaW5cbiAqICB0aGUgY2FudmFzLiBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWluPS0xXSAtIE1pbmltdW0gdmFsdWUgcmVwcmVzZW50ZWQgaW4gdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWF4PTFdIC0gTWF4aW11bSB2YWx1ZSByZXByZXNlbnRlZCBpbiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy53aWR0aD0zMDBdIC0gV2lkdGggb2YgdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGVpZ2h0PTE1MF0gLSBIZWlnaHQgb2YgdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge0VsZW1lbnR8Q1NTU2VsZWN0b3J9IFtvcHRpb25zLmNvbnRhaW5lcj1udWxsXSAtIENvbnRhaW5lciBlbGVtZW50XG4gKiAgaW4gd2hpY2ggdG8gaW5zZXJ0IHRoZSBjYW52YXMuIF9jb25zdGFudCBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge0VsZW1lbnR8Q1NTU2VsZWN0b3J9IFtvcHRpb25zLmNhbnZhcz1udWxsXSAtIENhbnZhcyBlbGVtZW50XG4gKiAgaW4gd2hpY2ggdG8gZHJhdy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5yZWZlcmVuY2VUaW1lPW51bGxdIC0gT3B0aW9ubmFsIHJlZmVyZW5jZSB0aW1lIHRoZVxuICogIGRpc3BsYXkgc2hvdWxkIGNvbnNpZGVyZXIgYXMgdGhlIG9yaWdpbi4gSXMgb25seSB1c2VmdWxsIHdoZW4gc3luY2hyb25pemluZ1xuICogIHNldmVyYWwgZGlzcGxheSB1c2luZyB0aGUgYERpc3BsYXlTeW5jYCBjbGFzcy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNsaWVudC5zaW5rXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiBjb25zdCBhdWRpb0NvbnRleHQgPSBuZXcgd2luZG93LkF1ZGlvQ29udGV4dCgpO1xuICpcbiAqIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAqICAgLmdldFVzZXJNZWRpYSh7IGF1ZGlvOiB0cnVlIH0pXG4gKiAgIC50aGVuKGluaXQpXG4gKiAgIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVyci5zdGFjaykpO1xuICpcbiAqIGZ1bmN0aW9uIGluaXQoc3RyZWFtKSB7XG4gKiAgIGNvbnN0IGF1ZGlvSW4gPSBhdWRpb0NvbnRleHQuY3JlYXRlTWVkaWFTdHJlYW1Tb3VyY2Uoc3RyZWFtKTtcbiAqXG4gKiAgIGNvbnN0IGF1ZGlvSW5Ob2RlID0gbmV3IGxmby5zb3VyY2UuQXVkaW9Jbk5vZGUoe1xuICogICAgIGF1ZGlvQ29udGV4dDogYXVkaW9Db250ZXh0LFxuICogICAgIHNvdXJjZU5vZGU6IGF1ZGlvSW4sXG4gKiAgICAgZnJhbWVTaXplOiA1MTIsXG4gKiAgIH0pO1xuICpcbiAqICAgY29uc3Qgd2F2ZWZvcm1EaXNwbGF5ID0gbmV3IGxmby5zaW5rLldhdmVmb3JtRGlzcGxheSh7XG4gKiAgICAgY2FudmFzOiAnI3dhdmVmb3JtJyxcbiAqICAgICBkdXJhdGlvbjogMy41LFxuICogICAgIHJtczogdHJ1ZSxcbiAqICAgfSk7XG4gKlxuICogICBhdWRpb0luTm9kZS5jb25uZWN0KHdhdmVmb3JtRGlzcGxheSk7XG4gKiAgIGF1ZGlvSW5Ob2RlLnN0YXJ0KCk7XG4gKiB9KTtcbiAqL1xuY2xhc3MgV2F2ZWZvcm1EaXNwbGF5IGV4dGVuZHMgQmFzZURpc3BsYXkge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMsIHRydWUpO1xuXG4gICAgdGhpcy5taW5NYXhPcGVyYXRvciA9IG5ldyBNaW5NYXgoKTtcbiAgICB0aGlzLnJtc09wZXJhdG9yID0gbmV3IFJtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMubWluTWF4T3BlcmF0b3IuaW5pdFN0cmVhbSh0aGlzLnN0cmVhbVBhcmFtcyk7XG4gICAgdGhpcy5ybXNPcGVyYXRvci5pbml0U3RyZWFtKHRoaXMuc3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSwgZnJhbWVXaWR0aCwgcGl4ZWxzU2luY2VMYXN0RnJhbWUpIHtcbiAgICAvLyBkcm9wIGZyYW1lcyB0aGF0IGNhbm5vdCBiZSBkaXNwbGF5ZWRcbiAgICBpZiAoZnJhbWVXaWR0aCA8IDEpIHJldHVybjtcblxuICAgIGNvbnN0IGNvbG9ycyA9IHRoaXMucGFyYW1zLmdldCgnY29sb3JzJyk7XG4gICAgY29uc3Qgc2hvd1JtcyA9IHRoaXMucGFyYW1zLmdldCgncm1zJyk7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG4gICAgY29uc3QgZGF0YSA9IGZyYW1lLmRhdGE7XG4gICAgY29uc3QgaVNhbXBsZXNQZXJQaXhlbHMgPSBNYXRoLmZsb29yKGRhdGEubGVuZ3RoIC8gZnJhbWVXaWR0aCk7XG5cbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZnJhbWVXaWR0aDsgaW5kZXgrKykge1xuICAgICAgY29uc3Qgc3RhcnQgPSBpbmRleCAqIGlTYW1wbGVzUGVyUGl4ZWxzO1xuICAgICAgY29uc3QgZW5kID0gaW5kZXggPT09IGZyYW1lV2lkdGggLSAxID8gdW5kZWZpbmVkIDogc3RhcnQgKyBpU2FtcGxlc1BlclBpeGVscztcbiAgICAgIGNvbnN0IHNsaWNlID0gZGF0YS5zdWJhcnJheShzdGFydCwgZW5kKTtcblxuICAgICAgY29uc3QgbWluTWF4ID0gdGhpcy5taW5NYXhPcGVyYXRvci5pbnB1dFNpZ25hbChzbGljZSk7XG4gICAgICBjb25zdCBtaW5ZID0gdGhpcy5nZXRZUG9zaXRpb24obWluTWF4WzBdKTtcbiAgICAgIGNvbnN0IG1heFkgPSB0aGlzLmdldFlQb3NpdGlvbihtaW5NYXhbMV0pO1xuXG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcnNbMF07XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKGluZGV4LCBtaW5ZKTtcbiAgICAgIGN0eC5saW5lVG8oaW5kZXgsIG1heFkpO1xuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuXG4gICAgICBpZiAoc2hvd1Jtcykge1xuICAgICAgICBjb25zdCBybXMgPSB0aGlzLnJtc09wZXJhdG9yLmlucHV0U2lnbmFsKHNsaWNlKTtcbiAgICAgICAgY29uc3Qgcm1zTWF4WSA9IHRoaXMuZ2V0WVBvc2l0aW9uKHJtcyk7XG4gICAgICAgIGNvbnN0IHJtc01pblkgPSB0aGlzLmdldFlQb3NpdGlvbigtcm1zKTtcblxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcnNbMV07XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4Lm1vdmVUbyhpbmRleCwgcm1zTWluWSk7XG4gICAgICAgIGN0eC5saW5lVG8oaW5kZXgsIHJtc01heFkpO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgV2F2ZWZvcm1EaXNwbGF5O1xuIiwiLy8gY29tbW9uXG5pbXBvcnQgQnJpZGdlIGZyb20gJy4uLy4uL2NvbW1vbi9zaW5rL0JyaWRnZSc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4uLy4uL2NvbW1vbi9zaW5rL0xvZ2dlcic7XG5pbXBvcnQgRGF0YVJlY29yZGVyIGZyb20gJy4uLy4uL2NvbW1vbi9zaW5rL0RhdGFSZWNvcmRlcic7XG5pbXBvcnQgU2lnbmFsUmVjb3JkZXIgZnJvbSAnLi4vLi4vY29tbW9uL3NpbmsvU2lnbmFsUmVjb3JkZXInO1xuXG4vLyBjbGllbnQgb25seVxuaW1wb3J0IEJhc2VEaXNwbGF5IGZyb20gJy4vQmFzZURpc3BsYXknO1xuaW1wb3J0IEJwZkRpc3BsYXkgZnJvbSAnLi9CcGZEaXNwbGF5JztcbmltcG9ydCBNYXJrZXJEaXNwbGF5IGZyb20gJy4vTWFya2VyRGlzcGxheSc7XG5pbXBvcnQgU2lnbmFsRGlzcGxheSBmcm9tICcuL1NpZ25hbERpc3BsYXknO1xuaW1wb3J0IFNwZWN0cnVtRGlzcGxheSBmcm9tICcuL1NwZWN0cnVtRGlzcGxheSc7XG5pbXBvcnQgVHJhY2VEaXNwbGF5IGZyb20gJy4vVHJhY2VEaXNwbGF5JztcbmltcG9ydCBWdU1ldGVyRGlzcGxheSBmcm9tICcuL1Z1TWV0ZXJEaXNwbGF5JztcbmltcG9ydCBXYXZlZm9ybURpc3BsYXkgZnJvbSAnLi9XYXZlZm9ybURpc3BsYXknO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIEJyaWRnZSxcbiAgTG9nZ2VyLFxuICBEYXRhUmVjb3JkZXIsXG4gIFNpZ25hbFJlY29yZGVyLFxuXG4gIEJhc2VEaXNwbGF5LFxuICBCcGZEaXNwbGF5LFxuICBNYXJrZXJEaXNwbGF5LFxuICBTaWduYWxEaXNwbGF5LFxuICBTcGVjdHJ1bURpc3BsYXksXG4gIFRyYWNlRGlzcGxheSxcbiAgVnVNZXRlckRpc3BsYXksXG4gIFdhdmVmb3JtRGlzcGxheSxcbn07XG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBhdWRpb0J1ZmZlcjoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGZyYW1lU2l6ZToge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiA1MTIsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGNoYW5uZWw6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgcHJvZ3Jlc3NDYWxsYmFjazoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIHByb2dyZXNzQ2FsbGJhY2s6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxufTtcblxuY29uc3Qgbm9vcCA9IGZ1bmN0aW9uKCkge307XG5cbi8qKlxuICogU2xpY2UgYW4gYEF1ZGlvQnVmZmVyYCBpbnRvIHNpZ25hbCBibG9ja3MgYW5kIHByb3BhZ2F0ZSB0aGUgcmVzdWx0aW5nIGZyYW1lc1xuICogdGhyb3VnaCB0aGUgZ3JhcGguXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBwYXJhbWV0ZXInIGRlZmF1bHQgdmFsdWVzLlxuICogQHBhcmFtIHtBdWRpb0J1ZmZlcn0gW29wdGlvbnMuYXVkaW9CdWZmZXJdIC0gQXVkaW8gYnVmZmVyIHRvIHByb2Nlc3MuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZnJhbWVTaXplPTUxMl0gLSBTaXplIG9mIHRoZSBvdXRwdXQgYmxvY2tzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmNoYW5uZWw9MF0gLSBOdW1iZXIgb2YgdGhlIGNoYW5uZWwgdG8gcHJvY2Vzcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5wcm9ncmVzc0NhbGxiYWNrPW51bGxdIC0gQ2FsbGJhY2sgdG8gYmUgZXhjdXRlZCBvbiBlYWNoXG4gKiAgZnJhbWUgb3V0cHV0LCByZWNlaXZlIGFzIGFyZ3VtZW50IHRoZSBjdXJyZW50IHByb2dyZXNzIHJhdGlvLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y2xpZW50LnNvdXJjZVxuICpcbiAqIEB0b2RvIC0gQWxsb3cgdG8gcGFzcyByYXcgYnVmZmVyIGFuZCBzYW1wbGVSYXRlIChzaW1wbGlmaWVkIHVzZSBzZXJ2ZXItc2lkZSlcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIGNvbnN0IGF1ZGlvSW5CdWZmZXIgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luQnVmZmVyKHtcbiAqICAgYXVkaW9CdWZmZXI6IGF1ZGlvQnVmZmVyLFxuICogICBmcmFtZVNpemU6IDUxMixcbiAqIH0pO1xuICpcbiAqIGNvbnN0IHdhdmVmb3JtID0gbmV3IGxmby5zaW5rLldhdmVmb3JtKHtcbiAqICAgY2FudmFzOiAnI3dhdmVmb3JtJyxcbiAqICAgZHVyYXRpb246IDEsXG4gKiAgIGNvbG9yOiAnc3RlZWxibHVlJyxcbiAqICAgcm1zOiB0cnVlLFxuICogfSk7XG4gKlxuICogYXVkaW9JbkJ1ZmZlci5jb25uZWN0KHdhdmVmb3JtKTtcbiAqIGF1ZGlvSW5CdWZmZXIuc3RhcnQoKTtcbiAqL1xuY2xhc3MgQXVkaW9JbkJ1ZmZlciBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBhdWRpb0J1ZmZlciA9IHRoaXMucGFyYW1zLmdldCgnYXVkaW9CdWZmZXInKTtcblxuICAgIGlmICghYXVkaW9CdWZmZXIpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgXCJhdWRpb0J1ZmZlclwiIHBhcmFtZXRlcicpO1xuXG4gICAgdGhpcy5lbmRUaW1lID0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGUgdGhlIGBzdHJlYW1QYXJhbXNgIGluIHRoZSBncmFwaCBhbmQgc3RhcnQgcHJvcGFnYXRpbmcgZnJhbWVzLlxuICAgKiBXaGVuIGNhbGxlZCwgdGhlIHNsaWNpbmcgb2YgdGhlIGdpdmVuIGBhdWRpb0J1ZmZlcmAgc3RhcnRzIGltbWVkaWF0ZWx5IGFuZFxuICAgKiBlYWNoIHJlc3VsdGluZyBmcmFtZSBpcyBwcm9wYWdhdGVkIGluIGdyYXBoLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNyZXNldFN0cmVhbX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNsaWVudC5zb3VyY2UuQXVkaW9JbkJ1ZmZlciNzdG9wfVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5pbml0U3RyZWFtKCk7XG5cbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5wYXJhbXMuZ2V0KCdjaGFubmVsJyk7XG4gICAgY29uc3QgYXVkaW9CdWZmZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ2F1ZGlvQnVmZmVyJyk7XG4gICAgY29uc3QgYnVmZmVyID0gYXVkaW9CdWZmZXIuZ2V0Q2hhbm5lbERhdGEoY2hhbm5lbCk7XG4gICAgdGhpcy5lbmRUaW1lID0gMDtcblxuICAgIHRoaXMucHJvY2Vzc0ZyYW1lKGJ1ZmZlcik7XG4gIH1cblxuICAvKipcbiAgICogRmluYWxpemUgdGhlIHN0cmVhbSBhbmQgc3RvcCB0aGUgd2hvbGUgZ3JhcGguIFdoZW4gY2FsbGVkLCB0aGUgc2xpY2luZyBvZlxuICAgKiB0aGUgYGF1ZGlvQnVmZmVyYCBzdG9wcyBpbW1lZGlhdGVseS5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jZmluYWxpemVTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjbGllbnQuc291cmNlLkF1ZGlvSW5CdWZmZXIjc3RhcnR9XG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuZmluYWxpemVTdHJlYW0odGhpcy5lbmRUaW1lKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKCkge1xuICAgIGNvbnN0IGF1ZGlvQnVmZmVyID0gdGhpcy5wYXJhbXMuZ2V0KCdhdWRpb0J1ZmZlcicpO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnZnJhbWVTaXplJyk7XG4gICAgY29uc3Qgc291cmNlU2FtcGxlUmF0ZSA9IGF1ZGlvQnVmZmVyLnNhbXBsZVJhdGU7XG4gICAgY29uc3QgZnJhbWVSYXRlID0gc291cmNlU2FtcGxlUmF0ZSAvIGZyYW1lU2l6ZTtcblxuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IGZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSBmcmFtZVJhdGU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3NpZ25hbCc7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSA9IHNvdXJjZVNhbXBsZVJhdGU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlQ291bnQgPSBmcmFtZVNpemU7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShidWZmZXIpIHtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgcHJvZ3Jlc3NDYWxsYmFjayA9IHRoaXMucGFyYW1zLmdldCgncHJvZ3Jlc3NDYWxsYmFjaycpIHx8wqBub29wO1xuICAgIGNvbnN0IGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG4gICAgY29uc3QgbmJyRnJhbWVzID0gTWF0aC5jZWlsKGJ1ZmZlci5sZW5ndGggLyBmcmFtZVNpemUpO1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgbGV0IGkgPSAwO1xuXG4gICAgKGZ1bmN0aW9uIHNsaWNlKCkge1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gaSAqIGZyYW1lU2l6ZTtcbiAgICAgIGNvbnN0IG5ickNvcHkgPSBNYXRoLm1pbihsZW5ndGggLSBvZmZzZXQsIGZyYW1lU2l6ZSk7XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZnJhbWVTaXplOyBqKyspXG4gICAgICAgIGRhdGFbal0gPSBqIDwgbmJyQ29weSA/IGJ1ZmZlcltvZmZzZXQgKyBqXSA6IDA7XG5cbiAgICAgIHRoYXQuZnJhbWUudGltZSA9IG9mZnNldCAvIHNhbXBsZVJhdGU7XG4gICAgICB0aGF0LmVuZFRpbWUgPSB0aGF0LmZyYW1lLnRpbWUgKyBuYnJDb3B5IC8gc2FtcGxlUmF0ZTtcbiAgICAgIHRoYXQucHJvcGFnYXRlRnJhbWUoKTtcblxuICAgICAgaSArPSAxO1xuICAgICAgcHJvZ3Jlc3NDYWxsYmFjayhpIC8gbmJyRnJhbWVzKTtcblxuICAgICAgaWYgKGkgPCBuYnJGcmFtZXMpXG4gICAgICAgIHNldFRpbWVvdXQoc2xpY2UsIDApO1xuICAgICAgZWxzZVxuICAgICAgICB0aGF0LmZpbmFsaXplU3RyZWFtKHRoYXQuZW5kVGltZSk7XG4gICAgfSgpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBdWRpb0luQnVmZmVyO1xuIiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcblxuY29uc3QgQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fMKgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGZyYW1lU2l6ZToge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiA1MTIsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGNoYW5uZWw6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgc291cmNlTm9kZToge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGF1ZGlvQ29udGV4dDoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG59O1xuXG4vKipcbiAqIFVzZSBhIGBXZWJBdWRpb2Agbm9kZSBhcyBhIHNvdXJjZSBmb3IgdGhlIGdyYXBoLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgcGFyYW1ldGVyJyBkZWZhdWx0IHZhbHVlcy5cbiAqIEBwYXJhbSB7QXVkaW9Ob2RlfSBbb3B0aW9ucy5zb3VyY2VOb2RlPW51bGxdIC0gQXVkaW8gbm9kZSB0byBwcm9jZXNzXG4gKiAgKG1hbmRhdG9yeSkuXG4gKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gW29wdGlvbnMuYXVkaW9Db250ZXh0PW51bGxdIC0gQXVkaW8gY29udGV4dCB1c2VkIHRvXG4gKiAgY3JlYXRlIHRoZSBhdWRpbyBub2RlIChtYW5kYXRvcnkpLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmZyYW1lU2l6ZT01MTJdIC0gU2l6ZSBvZiB0aGUgb3V0cHV0IGJsb2NrcywgZGVmaW5lXG4gKiAgdGhlIGBmcmFtZVNpemVgIGluIHRoZSBgc3RyZWFtUGFyYW1zYC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5jaGFubmVsPTBdIC0gTnVtYmVyIG9mIHRoZSBjaGFubmVsIHRvIHByb2Nlc3MuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjbGllbnQuc291cmNlXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiBjb25zdCBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gKiBjb25zdCBzaW5lID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAqIHNpbmUuZnJlcXVlbmN5LnZhbHVlID0gMjtcbiAqXG4gKiBjb25zdCBhdWRpb0luTm9kZSA9IG5ldyBsZm8uc291cmNlLkF1ZGlvSW5Ob2RlKHtcbiAqICAgYXVkaW9Db250ZXh0OiBhdWRpb0NvbnRleHQsXG4gKiAgIHNvdXJjZU5vZGU6IHNpbmUsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBzaWduYWxEaXNwbGF5ID0gbmV3IGxmby5zaW5rLlNpZ25hbERpc3BsYXkoe1xuICogICBjYW52YXM6ICcjc2lnbmFsJyxcbiAqICAgZHVyYXRpb246IDEsXG4gKiB9KTtcbiAqXG4gKiBhdWRpb0luTm9kZS5jb25uZWN0KHNpZ25hbERpc3BsYXkpO1xuICpcbiAqIC8vIHN0YXJ0IHRoZSBzaW5lIG9zY2lsbGF0b3Igbm9kZSBhbmQgdGhlIGxmbyBncmFwaFxuICogc2luZS5zdGFydCgpO1xuICogYXVkaW9Jbk5vZGUuc3RhcnQoKTtcbiAqL1xuY2xhc3MgQXVkaW9Jbk5vZGUgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgYXVkaW9Db250ZXh0ID0gdGhpcy5wYXJhbXMuZ2V0KCdhdWRpb0NvbnRleHQnKTtcbiAgICBjb25zdCBzb3VyY2VOb2RlID0gdGhpcy5wYXJhbXMuZ2V0KCdzb3VyY2VOb2RlJyk7XG5cbiAgICBpZiAoIWF1ZGlvQ29udGV4dCB8fCAhKGF1ZGlvQ29udGV4dCBpbnN0YW5jZW9mIEF1ZGlvQ29udGV4dCkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYGF1ZGlvQ29udGV4dGAgcGFyYW1ldGVyJyk7XG5cbiAgICBpZiAoIXNvdXJjZU5vZGUgfHwgIShzb3VyY2VOb2RlIGluc3RhbmNlb2YgQXVkaW9Ob2RlKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBgc291cmNlTm9kZWAgcGFyYW1ldGVyJyk7XG5cbiAgICB0aGlzLnNvdXJjZU5vZGUgPSBzb3VyY2VOb2RlO1xuICAgIHRoaXMuX2NoYW5uZWwgPSB0aGlzLnBhcmFtcy5nZXQoJ2NoYW5uZWwnKTtcbiAgICB0aGlzLl9ibG9ja0R1cmF0aW9uID0gbnVsbDtcblxuICAgIHRoaXMucHJvY2Vzc0ZyYW1lID0gdGhpcy5wcm9jZXNzRnJhbWUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGUgdGhlIGBzdHJlYW1QYXJhbXNgIGluIHRoZSBncmFwaCBhbmQgc3RhcnQgdG8gcHJvcGFnYXRlIHNpZ25hbFxuICAgKiBibG9ja3MgcHJvZHVjZWQgYnkgdGhlIGF1ZGlvIG5vZGUgaW50byB0aGUgZ3JhcGguXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Jlc2V0U3RyZWFtfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y2xpZW50LnNvdXJjZS5BdWRpb0luTm9kZSNzdG9wfVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5pbml0U3RyZWFtKCk7XG5cbiAgICBjb25zdCBhdWRpb0NvbnRleHQgPSB0aGlzLnBhcmFtcy5nZXQoJ2F1ZGlvQ29udGV4dCcpO1xuICAgIHRoaXMuZnJhbWUudGltZSA9IDA7XG5cbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lU2l6ZScpO1xuXG4gICAgLy8gQG5vdGU6IHJlY3JlYXRlIGVhY2ggdGltZSBiZWNhdXNlIG9mIGEgZmlyZWZveCB3ZWlyZCBiZWhhdmlvclxuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yID0gYXVkaW9Db250ZXh0LmNyZWF0ZVNjcmlwdFByb2Nlc3NvcihmcmFtZVNpemUsIDEsIDEpO1xuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gdGhpcy5wcm9jZXNzRnJhbWU7XG5cbiAgICB0aGlzLnNvdXJjZU5vZGUuY29ubmVjdCh0aGlzLnNjcmlwdFByb2Nlc3Nvcik7XG4gICAgdGhpcy5zY3JpcHRQcm9jZXNzb3IuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmFsaXplIHRoZSBzdHJlYW0gYW5kIHN0b3AgdGhlIHdob2xlIGdyYXBoLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNmaW5hbGl6ZVN0cmVhbX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNsaWVudC5zb3VyY2UuQXVkaW9Jbk5vZGUjc3RhcnR9XG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuZmluYWxpemVTdHJlYW0odGhpcy5mcmFtZS50aW1lKTtcblxuXG4gICAgdGhpcy5zb3VyY2VOb2RlLmRpc2Nvbm5lY3QoKTtcbiAgICB0aGlzLnNjcmlwdFByb2Nlc3Nvci5kaXNjb25uZWN0KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcygpIHtcbiAgICBjb25zdCBhdWRpb0NvbnRleHQgPSB0aGlzLnBhcmFtcy5nZXQoJ2F1ZGlvQ29udGV4dCcpO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnZnJhbWVTaXplJyk7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHNhbXBsZVJhdGUgLyBmcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3NpZ25hbCc7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSA9IHNhbXBsZVJhdGU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlQ291bnQgPSBmcmFtZVNpemU7XG5cbiAgICB0aGlzLl9ibG9ja0R1cmF0aW9uID0gZnJhbWVTaXplIC8gc2FtcGxlUmF0ZTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKipcbiAgICogQmFzaWNhbGx5IHRoZSBgc2NyaXB0UHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzYCBjYWxsYmFja1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJvY2Vzc0ZyYW1lKGUpIHtcbiAgICB0aGlzLmZyYW1lLmRhdGEgPSBlLmlucHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKHRoaXMuX2NoYW5uZWwpO1xuICAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcblxuICAgIHRoaXMuZnJhbWUudGltZSArPSB0aGlzLl9ibG9ja0R1cmF0aW9uO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEF1ZGlvSW5Ob2RlO1xuIiwiLy8gY29tbW9uXG5pbXBvcnQgRXZlbnRJbiBmcm9tICcuLi8uLi9jb21tb24vc291cmNlL0V2ZW50SW4nO1xuLy8gY2xpZW50IG9ubHlcbmltcG9ydCBBdWRpb0luQnVmZmVyIGZyb20gJy4vQXVkaW9JbkJ1ZmZlcic7XG5pbXBvcnQgQXVkaW9Jbk5vZGUgZnJvbSAnLi9BdWRpb0luTm9kZSc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgRXZlbnRJbixcblxuICBBdWRpb0luQnVmZmVyLFxuICBBdWRpb0luTm9kZSxcbn07XG4iLCIvKipcbiAqIFN5bmNocm9uaXplIHNldmVyYWwgZGlzcGxheSBzaW5rcyB0byBhIGNvbW1vbiB0aW1lLlxuICpcbiAqIEBwYXJhbSB7Li4uQmFzZURpc3BsYXl9IHZpZXdzIC0gTGlzdCBvZiB0aGUgZGlzcGxheSB0byBzeW5jaHJvbml6ZS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNsaWVudC51dGlsc1xuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gKlxuICogY29uc3QgZXZlbnRJbjEgPSBuZXcgbGZvLnNvdXJjZS5FdmVudEluKHtcbiAqICAgZnJhbWVUeXBlOiAnc2NhbGFyJyxcbiAqICAgZnJhbWVTaXplOiAxLFxuICogfSk7XG4gKlxuICogY29uc3QgYnBmMSA9IG5ldyBsZm8uc2luay5CcGZEaXNwbGF5KHtcbiAqICAgY2FudmFzOiAnI2JwZi0xJyxcbiAqICAgZHVyYXRpb246IDIsXG4gKiAgIHN0YXJ0VGltZTogMCxcbiAqICAgbWluOiAwLFxuICogICBjb2xvcnM6IFsnc3RlZWxibHVlJ10sXG4gKiB9KTtcbiAqXG4gKiBldmVudEluMS5jb25uZWN0KGJwZjEpO1xuICpcbiAqIGNvbnN0IGV2ZW50SW4yID0gbmV3IGxmby5zb3VyY2UuRXZlbnRJbih7XG4gKiAgIGZyYW1lVHlwZTogJ3NjYWxhcicsXG4gKiAgIGZyYW1lU2l6ZTogMSxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGJwZjIgPSBuZXcgbGZvLnNpbmsuQnBmRGlzcGxheSh7XG4gKiAgIGNhbnZhczogJyNicGYtMicsXG4gKiAgIGR1cmF0aW9uOiAyLFxuICogICBzdGFydFRpbWU6IDcsXG4gKiAgIG1pbjogMCxcbiAqICAgY29sb3JzOiBbJ29yYW5nZSddLFxuICogfSk7XG4gKlxuICogY29uc3QgZGlzcGxheVN5bmMgPSBuZXcgbGZvLnV0aWxzLkRpc3BsYXlTeW5jKGJwZjEsIGJwZjIpO1xuICpcbiAqIGV2ZW50SW4yLmNvbm5lY3QoYnBmMik7XG4gKlxuICogZXZlbnRJbjEuc3RhcnQoKTtcbiAqIGV2ZW50SW4yLnN0YXJ0KCk7XG4gKlxuICogbGV0IHRpbWUgPSAwO1xuICogY29uc3QgcGVyaW9kID0gMC40O1xuICogY29uc3Qgb2Zmc2V0ID0gNy4yO1xuICpcbiAqIChmdW5jdGlvbiBnZW5lcmF0ZURhdGEoKSB7XG4gKiAgIGNvbnN0IHYgPSBNYXRoLnJhbmRvbSgpO1xuICpcbiAqICAgZXZlbnRJbjEucHJvY2Vzcyh0aW1lLCB2KTtcbiAqICAgZXZlbnRJbjIucHJvY2Vzcyh0aW1lICsgb2Zmc2V0LCB2KTtcbiAqXG4gKiAgIHRpbWUgKz0gcGVyaW9kO1xuICpcbiAqICAgc2V0VGltZW91dChnZW5lcmF0ZURhdGEsIHBlcmlvZCAqIDEwMDApO1xuICogfSgpKTtcbiAqL1xuY2xhc3MgRGlzcGxheVN5bmMge1xuICBjb25zdHJ1Y3RvciguLi52aWV3cykge1xuICAgIHRoaXMudmlld3MgPSBbXTtcblxuICAgIHRoaXMuYWRkKC4uLnZpZXdzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBhZGQoLi4udmlld3MpIHtcbiAgICB2aWV3cy5mb3JFYWNoKHZpZXcgPT4gdGhpcy5pbnN0YWxsKHZpZXcpKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpbnN0YWxsKHZpZXcpIHtcbiAgICB0aGlzLnZpZXdzLnB1c2godmlldyk7XG5cbiAgICB2aWV3LmRpc3BsYXlTeW5jID0gdGhpcztcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzaGlmdFNpYmxpbmdzKGlTaGlmdCwgdGltZSwgdmlldykge1xuICAgIHRoaXMudmlld3MuZm9yRWFjaChmdW5jdGlvbihkaXNwbGF5KSB7XG4gICAgICBpZiAoZGlzcGxheSAhPT0gdmlldylcbiAgICAgICAgZGlzcGxheS5zaGlmdENhbnZhcyhpU2hpZnQsIHRpbWUpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERpc3BsYXlTeW5jO1xuIiwiaW1wb3J0IERpc3BsYXlTeW5jIGZyb20gJy4vRGlzcGxheVN5bmMnO1xuaW1wb3J0IGluaXRXaW5kb3dzIGZyb20gJy4uLy4uL2NvbW1vbi91dGlscy93aW5kb3dzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBEaXNwbGF5U3luYyxcbiAgaW5pdFdpbmRvd3MsXG59O1xuIiwiY29uc3QgY29sb3JzID0gWycjNDY4MkI0JywgJyNmZmE1MDAnLCAnIzAwZTYwMCcsICcjZmYwMDAwJywgJyM4MDAwODAnLCAnIzIyNDE1MyddO1xuXG5leHBvcnQgY29uc3QgZ2V0Q29sb3JzID0gZnVuY3Rpb24odHlwZSwgbmJyKSB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3NpZ25hbCc6XG4gICAgICByZXR1cm4gY29sb3JzWzBdOyAvLyBzdGVlbGJsdWVcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2JwZic6XG4gICAgICBpZiAobmJyIDw9IGNvbG9ycy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGNvbG9ycy5zbGljZSgwLCBuYnIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgX2NvbG9ycyA9IGNvbG9ycy5zbGljZSgwKTtcbiAgICAgICAgd2hpbGUgKF9jb2xvcnMubGVuZ3RoIDwgbmJyKVxuICAgICAgICAgIF9jb2xvcnMucHVzaChnZXRSYW5kb21Db2xvcigpKTtcblxuICAgICAgICByZXR1cm4gX2NvbG9ycztcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3dhdmVmb3JtJzpcbiAgICAgIHJldHVybiBbY29sb3JzWzBdLCBjb2xvcnNbNV1dOyAvLyBzdGVlbGJsdWUgLyBkYXJrYmx1ZVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnbWFya2VyJzpcbiAgICAgIHJldHVybiBjb2xvcnNbM107IC8vIHJlZFxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc3BlY3RydW0nOlxuICAgICAgcmV0dXJuIGNvbG9yc1syXTsgLy8gZ3JlZW5cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3RyYWNlJzpcbiAgICAgIHJldHVybiBjb2xvcnNbMV07IC8vIG9yYW5nZVxuICAgICAgYnJlYWs7XG4gIH1cbn07XG5cbi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTQ4NDUwNi9yYW5kb20tY29sb3ItZ2VuZXJhdG9yLWluLWphdmFzY3JpcHRcbmV4cG9ydCBjb25zdCBnZXRSYW5kb21Db2xvciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbGV0dGVycyA9ICcwMTIzNDU2Nzg5QUJDREVGJy5zcGxpdCgnJyk7XG4gIHZhciBjb2xvciA9ICcjJztcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCA2OyBpKysgKSB7XG4gICAgY29sb3IgKz0gbGV0dGVyc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNildO1xuICB9XG4gIHJldHVybiBjb2xvcjtcbn07XG5cbi8vIHNjYWxlIGZyb20gZG9tYWluIFswLCAxXSB0byByYW5nZSBbMjcwLCAwXSB0byBjb25zdW1lIGluXG4vLyBoc2woeCwgMTAwJSwgNTAlKSBjb2xvciBzY2hlbWVcbmV4cG9ydCBjb25zdCBnZXRIdWUgPSBmdW5jdGlvbih4KSB7XG4gIHZhciBkb21haW5NaW4gPSAwO1xuICB2YXIgZG9tYWluTWF4ID0gMTtcbiAgdmFyIHJhbmdlTWluID0gMjcwO1xuICB2YXIgcmFuZ2VNYXggPSAwO1xuXG4gIHJldHVybiAoKChyYW5nZU1heCAtIHJhbmdlTWluKSAqICh4IC0gZG9tYWluTWluKSkgLyAoZG9tYWluTWF4IC0gZG9tYWluTWluKSkgKyByYW5nZU1pbjtcbn07XG5cbmV4cG9ydCBjb25zdCBoZXhUb1JHQiA9IGZ1bmN0aW9uKGhleCkge1xuICBoZXggPSBoZXguc3Vic3RyaW5nKDEsIDcpO1xuICB2YXIgciA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoMCwgMiksIDE2KTtcbiAgdmFyIGcgPSBwYXJzZUludChoZXguc3Vic3RyaW5nKDIsIDQpLCAxNik7XG4gIHZhciBiID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZyg0LCA2KSwgMTYpO1xuICByZXR1cm4gW3IsIGcsIGJdO1xufTtcbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5cbmNvbnN0IHNpbiA9IE1hdGguc2luO1xuY29uc3QgY29zID0gTWF0aC5jb3M7XG5jb25zdCBzcXJ0ID0gTWF0aC5zcXJ0O1xuY29uc3QgcG93ID0gTWF0aC5wb3c7XG5jb25zdCBfMlBJID0gTWF0aC5QSSAqIDI7XG5cbi8vIHBsb3QgKGZyb20gaHR0cDovL3d3dy5lYXJsZXZlbC5jb20vc2NyaXB0cy93aWRnZXRzLzIwMTMxMDEzL2JpcXVhZHMyLmpzKVxuLy8gdmFyIGxlbiA9IDUxMjtcbi8vIHZhciBtYWdQbG90ID0gW107XG4vLyBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBsZW47IGlkeCsrKSB7XG4vLyAgIHZhciB3O1xuLy8gICBpZiAocGxvdFR5cGUgPT0gXCJsaW5lYXJcIilcbi8vICAgICB3ID0gaWR4IC8gKGxlbiAtIDEpICogTWF0aC5QSTsgIC8vIDAgdG8gcGksIGxpbmVhciBzY2FsZVxuLy8gICBlbHNlXG4vLyAgICAgdyA9IE1hdGguZXhwKE1hdGgubG9nKDEgLyAwLjAwMSkgKiBpZHggLyAobGVuIC0gMSkpICogMC4wMDEgKiBNYXRoLlBJOyAgLy8gMC4wMDEgdG8gMSwgdGltZXMgcGksIGxvZyBzY2FsZVxuXG4vLyAgIHZhciBwaGkgPSBNYXRoLnBvdyhNYXRoLnNpbih3LzIpLCAyKTtcbi8vICAgdmFyIHkgPSBNYXRoLmxvZyhNYXRoLnBvdyhhMCthMSthMiwgMikgLSA0KihhMCphMSArIDQqYTAqYTIgKyBhMSphMikqcGhpICsgMTYqYTAqYTIqcGhpKnBoaSkgLSBNYXRoLmxvZyhNYXRoLnBvdygxK2IxK2IyLCAyKSAtIDQqKGIxICsgNCpiMiArIGIxKmIyKSpwaGkgKyAxNipiMipwaGkqcGhpKTtcbi8vICAgeSA9IHkgKiAxMCAvIE1hdGguTE4xMFxuLy8gICBpZiAoeSA9PSAtSW5maW5pdHkpXG4vLyAgICAgeSA9IC0yMDA7XG5cbi8vICAgaWYgKHBsb3RUeXBlID09IFwibGluZWFyXCIpXG4vLyAgICAgbWFnUGxvdC5wdXNoKFtpZHggLyAobGVuIC0gMSkgKiBGcyAvIDIsIHldKTtcbi8vICAgZWxzZVxuLy8gICAgIG1hZ1Bsb3QucHVzaChbaWR4IC8gKGxlbiAtIDEpIC8gMiwgeV0pO1xuXG4vLyAgIGlmIChpZHggPT0gMClcbi8vICAgICBtaW5WYWwgPSBtYXhWYWwgPSB5O1xuLy8gICBlbHNlIGlmICh5IDwgbWluVmFsKVxuLy8gICAgIG1pblZhbCA9IHk7XG4vLyAgIGVsc2UgaWYgKHkgPiBtYXhWYWwpXG4vLyAgICAgbWF4VmFsID0geTtcbi8vIH1cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIHR5cGU6IHtcbiAgICB0eXBlOiAnZW51bScsXG4gICAgZGVmYXVsdDogJ2xvd3Bhc3MnLFxuICAgIGxpc3Q6IFtcbiAgICAgICdsb3dwYXNzJyxcbiAgICAgICdoaWdocGFzcycsXG4gICAgICAnYmFuZHBhc3NfY29uc3RhbnRfc2tpcnQnLFxuICAgICAgJ2JhbmRwYXNzJyxcbiAgICAgICdiYW5kcGFzc19jb25zdGFudF9wZWFrJyxcbiAgICAgICdub3RjaCcsXG4gICAgICAnYWxscGFzcycsXG4gICAgICAncGVha2luZycsXG4gICAgICAnbG93c2hlbGYnLFxuICAgICAgJ2hpZ2hzaGVsZicsXG4gICAgXSxcbiAgICBtZXRhczogeyBraW5kOiAnZHlhbm1pYycgfSxcbiAgfSxcbiAgZjA6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDEsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5YW5taWMnIH0sXG4gIH0sXG4gIGdhaW46IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDEsXG4gICAgbWluOiAwLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICBxOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiAxLFxuICAgIG1pbjogMC4wMDEsIC8vIFBJUE9fQklRVUFEX01JTl9RXG4gICAgLy8gbWF4OiAxLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICAvLyBiYW5kd2lkdGg6IHtcbiAgLy8gICB0eXBlOiAnZmxvYXQnLFxuICAvLyAgIGRlZmF1bHQ6IG51bGwsXG4gIC8vICAgbnVsbGFibGU6IHRydWUsXG4gIC8vICAgbWV0YXM6IHsga2luZDogJ2R5YW5taWMnIH0sXG4gIC8vIH0sXG59XG5cblxuLyoqXG4gKiBCaXF1YWQgZmlsdGVyIChEaXJlY3QgZm9ybSBJKS4gSWYgaW5wdXQgaXMgb2YgdHlwZSBgdmVjdG9yYCB0aGUgZmlsdGVyIGlzXG4gKiBhcHBsaWVkIG9uIGVhY2ggZGltZW5zaW9uIGkgcGFyYWxsZWwuXG4gKlxuICogQmFzZWQgb24gdGhlIFtcIkNvb2tib29rIGZvcm11bGFlIGZvciBhdWRpbyBFUSBiaXF1YWQgZmlsdGVyIGNvZWZmaWNpZW50c1wiXShodHRwOi8vd3d3Lm11c2ljZHNwLm9yZy9maWxlcy9BdWRpby1FUS1Db29rYm9vay50eHQpXG4gKiBieSBSb2JlcnQgQnJpc3Rvdy1Kb2huc29uLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHZhbHVlcy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy50eXBlPSdsb3dwYXNzJ10gLSBUeXBlIG9mIHRoZSBmaWx0ZXIuIEF2YWlsYWJsZVxuICogIGZpbHRlcnM6ICdsb3dwYXNzJywgJ2hpZ2hwYXNzJywgJ2JhbmRwYXNzX2NvbnN0YW50X3NraXJ0JywgJ2JhbmRwYXNzX2NvbnN0YW50X3BlYWsnXG4gKiAgKGFsaWFzICdiYW5kcGFzcycpLCAnbm90Y2gnLCAnYWxscGFzcycsICdwZWFraW5nJywgJ2xvd3NoZWxmJywgJ2hpZ2hzaGVsZicuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZjA9MV0gLSBDdXRvZmYgb3IgY2VudGVyIGZyZXF1ZW5jeSBvZiB0aGUgZmlsdGVyXG4gKiAgYWNjb3JkaW5nIHRvIGl0cyB0eXBlLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmdhaW49MV0gLSBHYWluIG9mIHRoZSBmaWx0ZXIgKGluIGRCKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5xPTFdIC0gUXVhbGl0eSBmYWN0b3Igb2YgdGhlIGZpbHRlci5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIGNvbnN0IGF1ZGlvSW5CdWZmZXIgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luQnVmZmVyKHtcbiAqICAgYXVkaW9CdWZmZXI6IGJ1ZmZlcixcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGJpcXVhZCA9IG5ldyBsZm8ub3BlcmF0b3IuQmlxdWFkKHtcbiAqICAgdHlwZTogJ2xvd3Bhc3MnLFxuICogICBmMDogMjAwMCxcbiAqICAgZ2FpbjogMyxcbiAqICAgcTogMTIsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBzcGVjdHJ1bURpc3BsYXkgPSBuZXcgbGZvLnNpbmsuU3BlY3RydW1EaXNwbGF5KHtcbiAqICAgY2FudmFzOiAnI3NwZWN0cnVtJyxcbiAqIH0pO1xuICpcbiAqIGF1ZGlvSW5CdWZmZXIuY29ubmVjdChiaXF1YWQpO1xuICogYmlxdWFkLmNvbm5lY3Qoc3BlY3RydW1EaXNwbGF5KTtcbiAqXG4gKiBhdWRpb0luQnVmZmVyLnN0YXJ0KCk7XG4gKi9cbmNsYXNzIEJpcXVhZCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICBvblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcykge1xuICAgIHRoaXMuX2NhbGN1bGF0ZUNvZWZzKCk7XG4gIH1cblxuICBfY2FsY3VsYXRlQ29lZnMoKSB7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG4gICAgY29uc3QgZnJhbWVUeXBlID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcblxuICAgIGNvbnN0IHR5cGUgPSB0aGlzLnBhcmFtcy5nZXQoJ3R5cGUnKTtcbiAgICBjb25zdCBmMCA9IHRoaXMucGFyYW1zLmdldCgnZjAnKTtcbiAgICBjb25zdCBnYWluID0gdGhpcy5wYXJhbXMuZ2V0KCdnYWluJyk7XG4gICAgY29uc3QgcSA9IHRoaXMucGFyYW1zLmdldCgncScpO1xuICAgIC8vIGNvbnN0IGJhbmR3aWR0aCA9IHRoaXMucGFyYW1zLmdldCgnYmFuZHdpZHRoJyk7XG4gICAgY29uc3QgYmFuZHdpZHRoID0gbnVsbDtcblxuICAgIGxldCBiMCA9IDAsIGIxID0gMCwgYjIgPSAwLCBhMCA9IDAsIGExID0gMCwgYTIgPSAwO1xuXG4gICAgY29uc3QgQSA9IHBvdygxMCwgZ2FpbiAvIDQwKTtcbiAgICBjb25zdCB3MCA9IF8yUEkgKiBmMCAvIHNhbXBsZVJhdGU7XG4gICAgY29uc3QgY29zVzAgPSBjb3ModzApO1xuICAgIGNvbnN0IHNpblcwID0gc2luKHcwKTtcbiAgICBsZXQgYWxwaGE7IC8vIGRlcGVuZCBvZiB0aGUgZmlsdGVyIHR5cGVcbiAgICBsZXQgXzJSb290QUFscGhhOyAvLyBpbnRlcm1lZGlhdGUgdmFsdWUgZm9yIGxvd3NoZWxmIGFuZCBoaWdoc2hlbGZcblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgLy8gSChzKSA9IDEgLyAoc14yICsgcy9RICsgMSlcbiAgICAgIGNhc2UgJ2xvd3Bhc3MnOlxuICAgICAgICBhbHBoYSA9IHNpblcwIC8gKDIgKiBxKTtcbiAgICAgICAgYjAgPSAoMSAtIGNvc1cwKSAvIDI7XG4gICAgICAgIGIxID0gMSAtIGNvc1cwO1xuICAgICAgICBiMiA9IGIwO1xuICAgICAgICBhMCA9IDEgKyBhbHBoYTtcbiAgICAgICAgYTEgPSAtMiAqIGNvc1cwO1xuICAgICAgICBhMiA9IDEgLWFscGhhO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIEgocykgPSBzXjIgLyAoc14yICsgcy9RICsgMSlcbiAgICAgIGNhc2UgJ2hpZ2hwYXNzJzpcbiAgICAgICAgYWxwaGEgPSBzaW5XMCAvICgyICogcSk7XG4gICAgICAgIGIwID0gKDEgKyBjb3NXMCkgLyAyO1xuICAgICAgICBiMSA9IC0gKDEgKyBjb3NXMClcbiAgICAgICAgYjIgPSBiMDtcbiAgICAgICAgYTAgPSAxICsgYWxwaGE7XG4gICAgICAgIGExID0gLTIgKiBjb3NXMDtcbiAgICAgICAgYTIgPSAxIC0gYWxwaGE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gSChzKSA9IHMgLyAoc14yICsgcy9RICsgMSkgIChjb25zdGFudCBza2lydCBnYWluLCBwZWFrIGdhaW4gPSBRKVxuICAgICAgY2FzZSAnYmFuZHBhc3NfY29uc3RhbnRfc2tpcnQnOlxuICAgICAgICBpZiAoYmFuZHdpZHRoKSB7XG4gICAgICAgICAgLy8gc2luKHcwKSpzaW5oKCBsbigyKS8yICogQlcgKiB3MC9zaW4odzApICkgICAgICAgICAgIChjYXNlOiBCVylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbHBoYSA9IHNpblcwIC8gKDIgKiBxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGIwID0gc2luVzAgLyAyO1xuICAgICAgICBiMSA9IDA7XG4gICAgICAgIGIyID0gLWIwO1xuICAgICAgICBhMCA9IDEgKyBhbHBoYTtcbiAgICAgICAgYTEgPSAtMiAqIGNvc1cwO1xuICAgICAgICBhMiA9IDEgLSBhbHBoYTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBIKHMpID0gKHMvUSkgLyAoc14yICsgcy9RICsgMSkgICAgICAoY29uc3RhbnQgMCBkQiBwZWFrIGdhaW4pXG4gICAgICBjYXNlICdiYW5kcGFzcyc6IC8vIGxvb2tzIGxpa2Ugd2hhdCBpcyBnbmVyYWxseSBjb25zaWRlcmVkIGFzIGEgYmFuZHBhc3NcbiAgICAgIGNhc2UgJ2JhbmRwYXNzX2NvbnN0YW50X3BlYWsnOlxuICAgICAgICBpZiAoYmFuZHdpZHRoKSB7XG4gICAgICAgICAgLy8gc2luKHcwKSpzaW5oKCBsbigyKS8yICogQlcgKiB3MC9zaW4odzApICkgICAgICAgICAgIChjYXNlOiBCVylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbHBoYSA9IHNpblcwIC8gKDIgKiBxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGIwID0gYWxwaGE7XG4gICAgICAgIGIxID0gMDtcbiAgICAgICAgYjIgPSAtYWxwaGE7XG4gICAgICAgIGEwID0gMSArIGFscGhhO1xuICAgICAgICBhMSA9IC0yICogY29zVzA7XG4gICAgICAgIGEyID0gMSAtIGFscGhhO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIEgocykgPSAoc14yICsgMSkgLyAoc14yICsgcy9RICsgMSlcbiAgICAgIGNhc2UgJ25vdGNoJzpcbiAgICAgICAgYWxwaGEgPSBzaW5XMCAvICgyICogcSk7XG4gICAgICAgIGIwID0gMTtcbiAgICAgICAgYjEgPSAtMiAqIGNvc1cwO1xuICAgICAgICBiMiA9IDE7XG4gICAgICAgIGEwID0gMSArIGFscGhhO1xuICAgICAgICBhMSA9IGIxO1xuICAgICAgICBhMiA9IDEgLSBhbHBoYTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBIKHMpID0gKHNeMiAtIHMvUSArIDEpIC8gKHNeMiArIHMvUSArIDEpXG4gICAgICBjYXNlICdhbGxwYXNzJzpcbiAgICAgICAgYWxwaGEgPSBzaW5XMCAvICgyICogcSk7XG4gICAgICAgIGIwID0gMSAtIGFscGhhO1xuICAgICAgICBiMSA9IC0yICogY29zVzA7XG4gICAgICAgIGIyID0gMSArIGFscGhhO1xuICAgICAgICBhMCA9IGIyO1xuICAgICAgICBhMSA9IGIxO1xuICAgICAgICBhMiA9IGIwO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIEgocykgPSAoc14yICsgcyooQS9RKSArIDEpIC8gKHNeMiArIHMvKEEqUSkgKyAxKVxuICAgICAgY2FzZSAncGVha2luZyc6XG4gICAgICAgIGlmIChiYW5kd2lkdGgpIHtcbiAgICAgICAgICAvLyBzaW4odzApKnNpbmgoIGxuKDIpLzIgKiBCVyAqIHcwL3Npbih3MCkgKSAgICAgICAgICAgKGNhc2U6IEJXKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFscGhhID0gc2luVzAgLyAoMiAqIHEpO1xuICAgICAgICB9XG5cbiAgICAgICAgYjAgPSAxICsgYWxwaGEgKiBBO1xuICAgICAgICBiMSA9IC0yICogY29zVzA7XG4gICAgICAgIGIyID0gMSAtIGFscGhhICogQTtcbiAgICAgICAgYTAgPSAxICsgYWxwaGEgLyBBO1xuICAgICAgICBhMSA9IGIxO1xuICAgICAgICBhMiA9IDEgLSBhbHBoYSAvIEE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gSChzKSA9IEEgKiAoc14yICsgKHNxcnQoQSkvUSkqcyArIEEpLyhBKnNeMiArIChzcXJ0KEEpL1EpKnMgKyAxKVxuICAgICAgY2FzZSAnbG93c2hlbGYnOlxuICAgICAgICBhbHBoYSA9IHNpblcwIC8gKDIgKiBxKTtcbiAgICAgICAgXzJSb290QUFscGhhID0gMiAqIHNxcnQoQSkgKiBhbHBoYTtcblxuICAgICAgICBiMCA9ICAgICBBICogKChBICsgMSkgLSAoQSAtIDEpICogY29zVzAgKyBfMlJvb3RBQWxwaGEpO1xuICAgICAgICBiMSA9IDIgKiBBICogKChBIC0gMSkgLSAoQSArIDEpICogY29zVzApO1xuICAgICAgICBiMiA9ICAgICBBICogKChBICsgMSkgLSAoQSAtIDEpICogY29zVzAgLSBfMlJvb3RBQWxwaGEpO1xuICAgICAgICBhMCA9ICAgICAgICAgIChBICsgMSkgKyAoQSAtIDEpICogY29zVzAgKyBfMlJvb3RBQWxwaGE7XG4gICAgICAgIGExID0gICAgLTIgKiAoKEEgLSAxKSArIChBICsgMSkgKiBjb3NXMCk7XG4gICAgICAgIGEyID0gICAgICAgICAgKEEgKyAxKSArIChBIC0gMSkgKiBjb3NXMCAtIF8yUm9vdEFBbHBoYTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBIKHMpID0gQSAqIChBKnNeMiArIChzcXJ0KEEpL1EpKnMgKyAxKS8oc14yICsgKHNxcnQoQSkvUSkqcyArIEEpXG4gICAgICBjYXNlICdoaWdoc2hlbGYnOlxuICAgICAgICBhbHBoYSA9IHNpblcwIC8gKDIgKiBxKTtcbiAgICAgICAgXzJSb290QUFscGhhID0gMiAqIHNxcnQoQSkgKiBhbHBoYTtcblxuICAgICAgICBiMCA9ICAgICAgQSAqICgoQSArIDEpICsgKEEgLSAxKSAqIGNvc1cwICsgXzJSb290QUFscGhhKTtcbiAgICAgICAgYjEgPSAtMiAqIEEgKiAoKEEgLSAxKSArIChBICsgMSkgKiBjb3NXMCk7XG4gICAgICAgIGIyID0gICAgICBBICogKChBICsgMSkgKyAoQSAtIDEpICogY29zVzAgLSBfMlJvb3RBQWxwaGEpO1xuICAgICAgICBhMCA9ICAgICAgICAgICAoQSArIDEpIC0gKEEgLSAxKSAqIGNvc1cwICsgXzJSb290QUFscGhhO1xuICAgICAgICBhMSA9ICAgICAgMiAqICgoQSAtIDEpIC0gKEEgKyAxKSAqIGNvc1cwKTtcbiAgICAgICAgYTIgPSAgICAgICAgICAgKEEgKyAxKSAtIChBIC0gMSkgKiBjb3NXMCAtIF8yUm9vdEFBbHBoYTtcblxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICB0aGlzLmNvZWZzID0ge1xuICAgICAgYjA6IGIwIC8gYTAsXG4gICAgICBiMTogYjEgLyBhMCxcbiAgICAgIGIyOiBiMiAvIGEwLFxuICAgICAgYTE6IGExIC8gYTAsXG4gICAgICBhMjogYTIgLyBhMCxcbiAgICB9O1xuXG4gICAgLy8gcmVzZXQgc3RhdGVcbiAgICBpZiAoZnJhbWVUeXBlID09PSAnc2lnbmFsJykge1xuICAgICAgdGhpcy5zdGF0ZSA9IHsgeDE6IDAsIHgyOiAwLCB5MTogMCwgeTI6IDAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgeDE6IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplKSxcbiAgICAgICAgeDI6IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplKSxcbiAgICAgICAgeTE6IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplKSxcbiAgICAgICAgeTI6IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplKSxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIC8vIGlmIG5vIGBzYW1wbGVSYXRlYCBvciBgc2FtcGxlUmF0ZWAgaXMgMCB3ZSBzaGFsbCBoYWx0IVxuICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuXG4gICAgaWYgKCFzYW1wbGVSYXRlIHx8IHNhbXBsZVJhdGUgPD0gMClcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzYW1wbGVSYXRlIHZhbHVlICgwKSBmb3IgYmlxdWFkJyk7XG5cbiAgICB0aGlzLl9jYWxjdWxhdGVDb2VmcygpO1xuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcihmcmFtZSkge1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBvdXREYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgIGNvbnN0IGluRGF0YSA9IGZyYW1lLmRhdGE7XG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IGNvZWZzID0gdGhpcy5jb2VmcztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IHggPSBpbkRhdGFbaV07XG4gICAgICBjb25zdCB5ID0gY29lZnMuYjAgKiB4XG4gICAgICAgICAgICAgICsgY29lZnMuYjEgKiBzdGF0ZS54MVtpXSArIGNvZWZzLmIyICogc3RhdGUueDJbaV1cbiAgICAgICAgICAgICAgLSBjb2Vmcy5hMSAqIHN0YXRlLnkxW2ldIC0gY29lZnMuYTIgKiBzdGF0ZS55MltpXTtcblxuICAgICAgb3V0RGF0YVtpXSA9IHk7XG5cbiAgICAgIC8vIHVwZGF0ZSBzdGF0ZXNcbiAgICAgIHN0YXRlLngyW2ldID0gc3RhdGUueDFbaV07XG4gICAgICBzdGF0ZS54MVtpXSA9IHg7XG4gICAgICBzdGF0ZS55MltpXSA9IHN0YXRlLnkxW2ldO1xuICAgICAgc3RhdGUueTFbaV0gPSB5O1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKGZyYW1lKSB7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IG91dERhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3QgaW5EYXRhID0gZnJhbWUuZGF0YTtcbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgY29lZnMgPSB0aGlzLmNvZWZzO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgY29uc3QgeCA9IGluRGF0YVtpXTtcbiAgICAgIGNvbnN0IHkgPSBjb2Vmcy5iMCAqIHhcbiAgICAgICAgICAgICAgKyBjb2Vmcy5iMSAqIHN0YXRlLngxICsgY29lZnMuYjIgKiBzdGF0ZS54MlxuICAgICAgICAgICAgICAtIGNvZWZzLmExICogc3RhdGUueTEgLSBjb2Vmcy5hMiAqIHN0YXRlLnkyO1xuXG4gICAgICBvdXREYXRhW2ldID0geTtcblxuICAgICAgLy8gdXBkYXRlIHN0YXRlc1xuICAgICAgc3RhdGUueDIgPSBzdGF0ZS54MTtcbiAgICAgIHN0YXRlLngxID0geDtcbiAgICAgIHN0YXRlLnkyID0gc3RhdGUueTE7XG4gICAgICBzdGF0ZS55MSA9IHk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJpcXVhZDtcbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5cbmNvbnN0IHNxcnQgPSBNYXRoLnNxcnQ7XG5jb25zdCBjb3MgPSBNYXRoLmNvcztcbmNvbnN0IFBJID0gTWF0aC5QSTtcblxuLy8gRGN0IFR5cGUgMiAtIG9ydGhvZ29uYWwgbWF0cml4IHNjYWxpbmdcbmZ1bmN0aW9uIGdldERjdFdlaWdodHMob3JkZXIsIE4sIHR5cGUgPSAnaHRrJykge1xuICBjb25zdCB3ZWlnaHRzID0gbmV3IEZsb2F0MzJBcnJheShOICogb3JkZXIpO1xuICBjb25zdCBwaU92ZXJOID0gUEkgLyBOO1xuICBjb25zdCBzY2FsZTAgPSAxIC8gc3FydCgyKTtcbiAgY29uc3Qgc2NhbGUgPSBzcXJ0KDIgLyBOKTtcblxuICBmb3IgKGxldCBrID0gMDsgayA8IG9yZGVyOyBrKyspIHtcbiAgICBjb25zdCBzID0gKGsgPT09IDApID8gKHNjYWxlMCAqIHNjYWxlKSA6IHNjYWxlO1xuICAgIC8vIGNvbnN0IHMgPSBzY2FsZTsgLy8gcnRhIGRvZXNuJ3QgYXBwbHkgaz0wIHNjYWxpbmdcblxuICAgIGZvciAobGV0IG4gPSAwOyBuIDwgTjsgbisrKVxuICAgICAgd2VpZ2h0c1trICogTiArIG5dID0gcyAqIGNvcyhrICogKG4gKyAwLjUpICogcGlPdmVyTik7XG4gIH1cblxuICByZXR1cm4gd2VpZ2h0cztcbn1cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIG9yZGVyOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDEyLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG59O1xuXG4vKipcbiAqIENvbXB1dGUgdGhlIERpc2NyZXRlIENvc2luZSBUcmFuc2Zvcm0gb2YgYW4gaW5wdXQgYHNpZ25hbGAgb3IgYHZlY3RvcmAuXG4gKiAoSFRLIHN0eWxlIHdlaWdodGluZykuXG4gKlxuICogX3N1cHBvcnQgYHN0YW5kYWxvbmVgIHVzYWdlX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMub3JkZXI9MTJdIC0gTnVtYmVyIG9mIGNvbXB1dGVkIGJpbnMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiAvLyBhc3N1bWluZyBzb21lIGF1ZGlvIGJ1ZmZlclxuICogY29uc3Qgc291cmNlID0gbmV3IEF1ZGlvSW5CdWZmZXIoe1xuICogICBhdWRpb0J1ZmZlcjogYXVkaW9CdWZmZXIsXG4gKiAgIHVzZVdvcmtlcjogZmFsc2UsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBzbGljZXIgPSBuZXcgU2xpY2VyKHtcbiAqICAgZnJhbWVTaXplOiA1MTIsXG4gKiAgIGhvcFNpemU6IDUxMixcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGRjdCA9IG5ldyBEY3Qoe1xuICogICBvcmRlcjogMTIsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBsb2dnZXIgPSBuZXcgbGZvLnNpbmsuTG9nZ2VyKHsgZGF0YTogdHJ1ZSB9KTtcbiAqXG4gKiBzb3VyY2UuY29ubmVjdChzbGljZXIpO1xuICogc2xpY2VyLmNvbm5lY3QoZGN0KTtcbiAqIGRjdC5jb25uZWN0KGxvZ2dlcik7XG4gKlxuICogc291cmNlLnN0YXJ0KCk7XG4gKi9cbmNsYXNzIERjdCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ29yZGVyJyk7XG4gICAgY29uc3QgaW5GcmFtZVNpemUgPSBwcmV2U3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcblxuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IG9yZGVyO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSA9ICd2ZWN0b3InO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmRlc2NyaXB0aW9uID0gW107XG5cbiAgICB0aGlzLndlaWdodE1hdHJpeCA9IGdldERjdFdlaWdodHMob3JkZXIsIGluRnJhbWVTaXplKTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIHRoZSBgRGN0YCBvcGVyYXRvciBpbiBgc3RhbmRhbG9uZWAgbW9kZSAoaS5lLiBvdXRzaWRlIG9mIGEgZ3JhcGgpLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgLSBJbnB1dCB2YWx1ZXMuXG4gICAqIEByZXR1cm4ge0FycmF5fSAtIERjdCBvZiB0aGUgaW5wdXQgYXJyYXkuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNvbnN0IGRjdCA9IG5ldyBsZm8ub3BlcmF0b3IuRGN0KHsgb3JkZXI6IDEyIH0pO1xuICAgKiAvLyBtYW5kYXRvcnkgZm9yIHVzZSBpbiBzdGFuZGFsb25lIG1vZGVcbiAgICogZGN0LmluaXRTdHJlYW0oeyBmcmFtZVNpemU6IDUxMiwgZnJhbWVUeXBlOiAnc2lnbmFsJyB9KTtcbiAgICogZGN0LmlucHV0U2lnbmFsKGRhdGEpO1xuICAgKi9cbiAgaW5wdXRTaWduYWwodmFsdWVzKSB7XG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ29yZGVyJyk7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdmFsdWVzLmxlbmd0aDtcbiAgICBjb25zdCBvdXRGcmFtZSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBjb25zdCB3ZWlnaHRzID0gdGhpcy53ZWlnaHRNYXRyaXg7XG5cbiAgICBmb3IgKGxldCBrID0gMDsgayA8IG9yZGVyOyBrKyspIHtcbiAgICAgIGNvbnN0IG9mZnNldCA9IGsgKiBmcmFtZVNpemU7XG4gICAgICBvdXRGcmFtZVtrXSA9IDA7XG5cbiAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgZnJhbWVTaXplOyBuKyspXG4gICAgICAgIG91dEZyYW1lW2tdICs9IHZhbHVlc1tuXSAqIHdlaWdodHNbb2Zmc2V0ICsgbl07XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dEZyYW1lO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTaWduYWwoZnJhbWUpIHtcbiAgICB0aGlzLmlucHV0U2lnbmFsKGZyYW1lLmRhdGEpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUpIHtcbiAgICB0aGlzLmlucHV0U2lnbmFsKGZyYW1lLmRhdGEpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERjdDtcbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5pbXBvcnQgaW5pdFdpbmRvdyBmcm9tICcuLi91dGlscy93aW5kb3dzJztcblxuLy8gaHR0cHM6Ly9jb2RlLnNvdW5kc29mdHdhcmUuYWMudWsvcHJvamVjdHMvanMtZHNwLXRlc3QvcmVwb3NpdG9yeS9lbnRyeS9mZnQvbmF5dWtpLW9iai9mZnQuanNcbi8qXG4gKiBGcmVlIEZmdCBhbmQgY29udm9sdXRpb24gKEphdmFTY3JpcHQpXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IFByb2plY3QgTmF5dWtpXG4gKiBodHRwOi8vd3d3Lm5heXVraS5pby9wYWdlL2ZyZWUtc21hbGwtZmZ0LWluLW11bHRpcGxlLWxhbmd1YWdlc1xuICpcbiAqIChNSVQgTGljZW5zZSlcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2ZcbiAqIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW5cbiAqIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG9cbiAqIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mXG4gKiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqIC0gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqICAgYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiAtIFRoZSBTb2Z0d2FyZSBpcyBwcm92aWRlZCBcImFzIGlzXCIsIHdpdGhvdXQgd2FycmFudHkgb2YgYW55IGtpbmQsIGV4cHJlc3Mgb3JcbiAqICAgaW1wbGllZCwgaW5jbHVkaW5nIGJ1dCBub3QgbGltaXRlZCB0byB0aGUgd2FycmFudGllcyBvZiBtZXJjaGFudGFiaWxpdHksXG4gKiAgIGZpdG5lc3MgZm9yIGEgcGFydGljdWxhciBwdXJwb3NlIGFuZCBub25pbmZyaW5nZW1lbnQuIEluIG5vIGV2ZW50IHNoYWxsIHRoZVxuICogICBhdXRob3JzIG9yIGNvcHlyaWdodCBob2xkZXJzIGJlIGxpYWJsZSBmb3IgYW55IGNsYWltLCBkYW1hZ2VzIG9yIG90aGVyXG4gKiAgIGxpYWJpbGl0eSwgd2hldGhlciBpbiBhbiBhY3Rpb24gb2YgY29udHJhY3QsIHRvcnQgb3Igb3RoZXJ3aXNlLCBhcmlzaW5nIGZyb20sXG4gKiAgIG91dCBvZiBvciBpbiBjb25uZWN0aW9uIHdpdGggdGhlIFNvZnR3YXJlIG9yIHRoZSB1c2Ugb3Igb3RoZXIgZGVhbGluZ3MgaW4gdGhlXG4gKiAgIFNvZnR3YXJlLlxuICpcbiAqIFNsaWdodGx5IHJlc3RydWN0dXJlZCBieSBDaHJpcyBDYW5uYW0sIGNhbm5hbUBhbGwtZGF5LWJyZWFrZmFzdC5jb21cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG4vKlxuICogQ29uc3RydWN0IGFuIG9iamVjdCBmb3IgY2FsY3VsYXRpbmcgdGhlIGRpc2NyZXRlIEZvdXJpZXIgdHJhbnNmb3JtIChERlQpIG9mXG4gKiBzaXplIG4sIHdoZXJlIG4gaXMgYSBwb3dlciBvZiAyLlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIEZmdE5heXVraShuKSB7XG5cbiAgdGhpcy5uID0gbjtcbiAgdGhpcy5sZXZlbHMgPSAtMTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IDMyOyBpKyspIHtcbiAgICBpZiAoMSA8PCBpID09IG4pIHtcbiAgICAgIHRoaXMubGV2ZWxzID0gaTsgIC8vIEVxdWFsIHRvIGxvZzIobilcbiAgICB9XG4gIH1cblxuICBpZiAodGhpcy5sZXZlbHMgPT0gLTEpIHtcbiAgICB0aHJvdyBcIkxlbmd0aCBpcyBub3QgYSBwb3dlciBvZiAyXCI7XG4gIH1cblxuICB0aGlzLmNvc1RhYmxlID0gbmV3IEFycmF5KG4gLyAyKTtcbiAgdGhpcy5zaW5UYWJsZSA9IG5ldyBBcnJheShuIC8gMik7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuIC8gMjsgaSsrKSB7XG4gICAgdGhpcy5jb3NUYWJsZVtpXSA9IE1hdGguY29zKDIgKiBNYXRoLlBJICogaSAvIG4pO1xuICAgIHRoaXMuc2luVGFibGVbaV0gPSBNYXRoLnNpbigyICogTWF0aC5QSSAqIGkgLyBuKTtcbiAgfVxuXG4gIC8qXG4gICAqIENvbXB1dGVzIHRoZSBkaXNjcmV0ZSBGb3VyaWVyIHRyYW5zZm9ybSAoREZUKSBvZiB0aGUgZ2l2ZW4gY29tcGxleCB2ZWN0b3IsXG4gICAqIHN0b3JpbmcgdGhlIHJlc3VsdCBiYWNrIGludG8gdGhlIHZlY3Rvci5cbiAgICogVGhlIHZlY3RvcidzIGxlbmd0aCBtdXN0IGJlIGVxdWFsIHRvIHRoZSBzaXplIG4gdGhhdCB3YXMgcGFzc2VkIHRvIHRoZVxuICAgKiBvYmplY3QgY29uc3RydWN0b3IsIGFuZCB0aGlzIG11c3QgYmUgYSBwb3dlciBvZiAyLiBVc2VzIHRoZSBDb29sZXktVHVrZXlcbiAgICogZGVjaW1hdGlvbi1pbi10aW1lIHJhZGl4LTIgYWxnb3JpdGhtLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdGhpcy5mb3J3YXJkID0gZnVuY3Rpb24ocmVhbCwgaW1hZykge1xuICAgIHZhciBuID0gdGhpcy5uO1xuXG4gICAgLy8gQml0LXJldmVyc2VkIGFkZHJlc3NpbmcgcGVybXV0YXRpb25cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgdmFyIGogPSByZXZlcnNlQml0cyhpLCB0aGlzLmxldmVscyk7XG5cbiAgICAgIGlmIChqID4gaSkge1xuICAgICAgICB2YXIgdGVtcCA9IHJlYWxbaV07XG4gICAgICAgIHJlYWxbaV0gPSByZWFsW2pdO1xuICAgICAgICByZWFsW2pdID0gdGVtcDtcbiAgICAgICAgdGVtcCA9IGltYWdbaV07XG4gICAgICAgIGltYWdbaV0gPSBpbWFnW2pdO1xuICAgICAgICBpbWFnW2pdID0gdGVtcDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDb29sZXktVHVrZXkgZGVjaW1hdGlvbi1pbi10aW1lIHJhZGl4LTIgRmZ0XG4gICAgZm9yICh2YXIgc2l6ZSA9IDI7IHNpemUgPD0gbjsgc2l6ZSAqPSAyKSB7XG4gICAgICB2YXIgaGFsZnNpemUgPSBzaXplIC8gMjtcbiAgICAgIHZhciB0YWJsZXN0ZXAgPSBuIC8gc2l6ZTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpICs9IHNpemUpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IGksIGsgPSAwOyBqIDwgaSArIGhhbGZzaXplOyBqKyssIGsgKz0gdGFibGVzdGVwKSB7XG4gICAgICAgICAgdmFyIHRwcmUgPSAgcmVhbFtqK2hhbGZzaXplXSAqIHRoaXMuY29zVGFibGVba10gK1xuICAgICAgICAgICAgICAgICAgICAgIGltYWdbaitoYWxmc2l6ZV0gKiB0aGlzLnNpblRhYmxlW2tdO1xuICAgICAgICAgIHZhciB0cGltID0gLXJlYWxbaitoYWxmc2l6ZV0gKiB0aGlzLnNpblRhYmxlW2tdICtcbiAgICAgICAgICAgICAgICAgICAgICBpbWFnW2oraGFsZnNpemVdICogdGhpcy5jb3NUYWJsZVtrXTtcbiAgICAgICAgICByZWFsW2ogKyBoYWxmc2l6ZV0gPSByZWFsW2pdIC0gdHByZTtcbiAgICAgICAgICBpbWFnW2ogKyBoYWxmc2l6ZV0gPSBpbWFnW2pdIC0gdHBpbTtcbiAgICAgICAgICByZWFsW2pdICs9IHRwcmU7XG4gICAgICAgICAgaW1hZ1tqXSArPSB0cGltO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJucyB0aGUgaW50ZWdlciB3aG9zZSB2YWx1ZSBpcyB0aGUgcmV2ZXJzZSBvZiB0aGUgbG93ZXN0ICdiaXRzJ1xuICAgIC8vIGJpdHMgb2YgdGhlIGludGVnZXIgJ3gnLlxuICAgIGZ1bmN0aW9uIHJldmVyc2VCaXRzKHgsIGJpdHMpIHtcbiAgICAgIHZhciB5ID0gMDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBiaXRzOyBpKyspIHtcbiAgICAgICAgeSA9ICh5IDw8IDEpIHwgKHggJiAxKTtcbiAgICAgICAgeCA+Pj49IDE7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB5O1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIENvbXB1dGVzIHRoZSBpbnZlcnNlIGRpc2NyZXRlIEZvdXJpZXIgdHJhbnNmb3JtIChJREZUKSBvZiB0aGUgZ2l2ZW4gY29tcGxleFxuICAgKiB2ZWN0b3IsIHN0b3JpbmcgdGhlIHJlc3VsdCBiYWNrIGludG8gdGhlIHZlY3Rvci5cbiAgICogVGhlIHZlY3RvcidzIGxlbmd0aCBtdXN0IGJlIGVxdWFsIHRvIHRoZSBzaXplIG4gdGhhdCB3YXMgcGFzc2VkIHRvIHRoZVxuICAgKiBvYmplY3QgY29uc3RydWN0b3IsIGFuZCB0aGlzIG11c3QgYmUgYSBwb3dlciBvZiAyLiBUaGlzIGlzIGEgd3JhcHBlclxuICAgKiBmdW5jdGlvbi4gVGhpcyB0cmFuc2Zvcm0gZG9lcyBub3QgcGVyZm9ybSBzY2FsaW5nLCBzbyB0aGUgaW52ZXJzZSBpcyBub3RcbiAgICogYSB0cnVlIGludmVyc2UuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB0aGlzLmludmVyc2UgPSBmdW5jdGlvbihyZWFsLCBpbWFnKSB7XG4gICAgZm9yd2FyZChpbWFnLCByZWFsKTtcbiAgfVxufVxuXG5cbmNvbnN0IHNxcnQgPSBNYXRoLnNxcnQ7XG5cbmNvbnN0IGlzUG93ZXJPZlR3byA9IGZ1bmN0aW9uKG51bWJlcikge1xuICB3aGlsZSAoKG51bWJlciAlIDIgPT09IDApICYmIG51bWJlciA+IDEpXG4gICAgbnVtYmVyID0gbnVtYmVyIC8gMjtcblxuICByZXR1cm4gbnVtYmVyID09PSAxO1xufVxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgc2l6ZToge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAxMDI0LFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIHdpbmRvdzoge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBsaXN0OiBbJ25vbmUnLCAnaGFubicsICdoYW5uaW5nJywgJ2hhbW1pbmcnLCAnYmxhY2ttYW4nLCAnYmxhY2ttYW5oYXJyaXMnLCAnc2luZScsICdyZWN0YW5nbGUnXSxcbiAgICBkZWZhdWx0OiAnbm9uZScsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgbW9kZToge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBsaXN0OiBbJ21hZ25pdHVkZScsICdwb3dlciddLCAvLyBhZGQgY29tcGxleCBvdXRwdXRcbiAgICBkZWZhdWx0OiAnbWFnbml0dWRlJyxcbiAgfSxcbiAgbm9ybToge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBkZWZhdWx0OiAnYXV0bycsXG4gICAgbGlzdDogWydhdXRvJywgJ25vbmUnLCAnbGluZWFyJywgJ3Bvd2VyJ10sXG4gIH0sXG59XG5cbi8qKlxuICogQ29tcHV0ZSB0aGUgRmFzdCBGb3VyaWVyIFRyYW5zZm9ybSBvZiBhbiBpbmNvbW1pbmcgYHNpZ25hbGAuXG4gKlxuICogRmZ0IGltcGxlbWVudGF0aW9uIGJ5IFtOYXl1a2ldKGh0dHBzOi8vY29kZS5zb3VuZHNvZnR3YXJlLmFjLnVrL3Byb2plY3RzL2pzLWRzcC10ZXN0L3JlcG9zaXRvcnkvZW50cnkvZmZ0L25heXVraS1vYmovZmZ0LmpzKS5cbiAqXG4gKiBfc3VwcG9ydCBgc3RhbmRhbG9uZWAgdXNhZ2VfXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24ub3BlcmF0b3JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5zaXplPTEwMjRdIC0gU2l6ZSBvZiB0aGUgZmZ0LCBzaG91bGQgYmUgYSBwb3dlciBvZlxuICogIDIuIElmIHRoZSBmcmFtZSBzaXplIG9mIHRoZSBpbmNvbW1pbmcgc2lnbmFsIGlzIGxvd2VyIHRoYW4gdGhpcyB2YWx1ZSxcbiAqICBpdCBpcyB6ZXJvIHBhZGRlZCB0byBtYXRjaCB0aGUgZmZ0IHNpemUuXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMud2luZG93PSdub25lJ10gLSBOYW1lIG9mIHRoZSB3aW5kb3cgYXBwbGllZCBvbiB0aGVcbiAqICBpbmNvbW1pbmcgc2lnbmFsLiBBdmFpbGFibGUgd2luZG93cyBhcmU6ICdub25lJywgJ2hhbm4nLCAnaGFubmluZycsXG4gKiAgJ2hhbW1pbmcnLCAnYmxhY2ttYW4nLCAnYmxhY2ttYW5oYXJyaXMnLCAnc2luZScsICdyZWN0YW5nbGUnLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm1vZGU9J21hZ25pdHVkZSddIC0gVHlwZSBvZiB0aGUgb3V0cHV0IChgbWFnbml0dWRlYFxuICogIG9yIGBwb3dlcmApXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubm9ybT0nYXV0byddIC0gVHlwZSBvZiBub3JtYWxpemF0aW9uIGFwcGxpZWQgb24gdGhlXG4gKiAgb3V0cHV0LiBQb3NzaWJsZSB2YWx1ZXMgYXJlICdhdXRvJywgJ25vbmUnLCAnbGluZWFyJywgJ3Bvd2VyJy4gV2hlbiBzZXQgdG9cbiAqICBgYXV0b2AsIGEgYGxpbmVhcmAgbm9ybWFsaXphdGlvbiBpcyBhcHBsaWVkIG9uIHRoZSBtYWduaXR1ZGUgc3BlY3RydW0sIHdoaWxlXG4gKiAgYSBgcG93ZXJgIG5vcm1hbGl6ZXRpb24gaXMgYXBwbGllZCBvbiB0aGUgcG93ZXIgc3BlY3RydW0uXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiAvLyBhc3N1bWluZyBhbiBgYXVkaW9CdWZmZXJgIGV4aXN0c1xuICogY29uc3Qgc291cmNlID0gbmV3IGxmby5zb3VyY2UuQXVkaW9JbkJ1ZmZlcih7IGF1ZGlvQnVmZmVyIH0pO1xuICpcbiAqIGNvbnN0IHNsaWNlciA9IG5ldyBsZm8ub3BlcmF0b3IuU2xpY2VyKHtcbiAqICAgZnJhbWVTaXplOiAyNTYsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBmZnQgPSBuZXcgbGZvLm9wZXJhdG9yLkZmdCh7XG4gKiAgIG1vZGU6ICdwb3dlcicsXG4gKiAgIHdpbmRvdzogJ2hhbm4nLFxuICogICBub3JtOiAncG93ZXInLFxuICogICBzaXplOiAyNTYsXG4gKiB9KTtcbiAqXG4gKiBzb3VyY2UuY29ubmVjdChzbGljZXIpO1xuICogc2xpY2VyLmNvbm5lY3QoZmZ0KTtcbiAqIHNvdXJjZS5zdGFydCgpO1xuICpcbiAqIC8vID4gb3V0cHV0cyAxMjkgYmlucyBjb250YWluaW5nIHRoZSB2YWx1ZXMgb2YgdGhlIHBvd2VyIHNwZWN0cnVtIChpbmNsdWRpbmdcbiAqIC8vID4gREMgYW5kIE55dWlzdCBmcmVxdWVuY2llcykuXG4gKlxuICogQHRvZG8gLSBjaGVjayBpZiAncmVjdGFuZ2xlJyBhbmQgJ25vbmUnIHdpbmRvd3MgYXJlIG5vdCByZWRvbmRhbnQuXG4gKiBAdG9kbyAtIGNoZWNrIGRlZmF1bHQgdmFsdWVzIGZvciBhbGwgcGFyYW1zLlxuICovXG5jbGFzcyBGZnQgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy53aW5kb3dTaXplID0gbnVsbDtcbiAgICB0aGlzLm5vcm1hbGl6ZUNvZWZzID0gbnVsbDtcbiAgICB0aGlzLndpbmRvdyA9IG51bGw7XG4gICAgdGhpcy5yZWFsID0gbnVsbDtcbiAgICB0aGlzLmltYWcgPSBudWxsO1xuICAgIHRoaXMuZmZ0ID0gbnVsbDtcblxuICAgIGlmICghaXNQb3dlck9mVHdvKHRoaXMucGFyYW1zLmdldCgnc2l6ZScpKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignZmZ0U2l6ZSBtdXN0IGJlIGEgcG93ZXIgb2YgdHdvJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuICAgIC8vIHNldCB0aGUgb3V0cHV0IGZyYW1lIHNpemVcbiAgICBjb25zdCBpbkZyYW1lU2l6ZSA9IHByZXZTdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IGZmdFNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ3NpemUnKTtcbiAgICBjb25zdCBtb2RlID0gdGhpcy5wYXJhbXMuZ2V0KCdtb2RlJyk7XG4gICAgY29uc3Qgbm9ybSA9IHRoaXMucGFyYW1zLmdldCgnbm9ybScpO1xuICAgIGxldCB3aW5kb3dOYW1lID0gdGhpcy5wYXJhbXMuZ2V0KCd3aW5kb3cnKTtcbiAgICAvLyB3aW5kb3cgYG5vbmVgIGFuZCBgcmVjdGFuZ2xlYCBhcmUgYWxpYXNlc1xuICAgIGlmICh3aW5kb3dOYW1lID09PSAnbm9uZScpXG4gICAgICB3aW5kb3dOYW1lID0gJ3JlY3RhbmdsZSc7XG5cbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSBmZnRTaXplIC8gMiArIDE7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3ZlY3Rvcic7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZGVzY3JpcHRpb24gPSBbXTtcbiAgICAvLyBzaXplIG9mIHRoZSB3aW5kb3cgdG8gYXBwbHkgb24gdGhlIGlucHV0IGZyYW1lXG4gICAgdGhpcy53aW5kb3dTaXplID0gKGluRnJhbWVTaXplIDwgZmZ0U2l6ZSkgPyBpbkZyYW1lU2l6ZSA6IGZmdFNpemU7XG5cbiAgICAvLyByZWZlcmVuY2VzIHRvIHBvcHVsYXRlIGluIHRoZSB3aW5kb3cgZnVuY3Rpb25zIChjZi4gYGluaXRXaW5kb3dgKVxuICAgIHRoaXMubm9ybWFsaXplQ29lZnMgPSB7IGxpbmVhcjogMCwgcG93ZXI6IDAgfTtcbiAgICB0aGlzLndpbmRvdyA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy53aW5kb3dTaXplKTtcblxuICAgIGluaXRXaW5kb3coXG4gICAgICB3aW5kb3dOYW1lLCAgICAgICAgIC8vIG5hbWUgb2YgdGhlIHdpbmRvd1xuICAgICAgdGhpcy53aW5kb3csICAgICAgICAvLyBidWZmZXIgcG9wdWxhdGVkIHdpdGggdGhlIHdpbmRvdyBzaWduYWxcbiAgICAgIHRoaXMud2luZG93U2l6ZSwgICAgLy8gc2l6ZSBvZiB0aGUgd2luZG93XG4gICAgICB0aGlzLm5vcm1hbGl6ZUNvZWZzIC8vIG9iamVjdCBwb3B1bGF0ZWQgd2l0aCB0aGUgbm9ybWFsaXphdGlvbiBjb2Vmc1xuICAgICk7XG5cbiAgICBjb25zdCB7IGxpbmVhciwgcG93ZXIgfSA9IHRoaXMubm9ybWFsaXplQ29lZnM7XG5cbiAgICBzd2l0Y2ggKG5vcm0pIHtcbiAgICAgIGNhc2UgJ25vbmUnOlxuICAgICAgICB0aGlzLndpbmRvd05vcm0gPSAxO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbGluZWFyJzpcbiAgICAgICAgdGhpcy53aW5kb3dOb3JtID0gbGluZWFyO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAncG93ZXInOlxuICAgICAgICB0aGlzLndpbmRvd05vcm0gPSBwb3dlcjtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2F1dG8nOlxuICAgICAgICBpZiAobW9kZSA9PT0gJ21hZ25pdHVkZScpXG4gICAgICAgICAgdGhpcy53aW5kb3dOb3JtID0gbGluZWFyO1xuICAgICAgICBlbHNlIGlmIChtb2RlID09PSAncG93ZXInKVxuICAgICAgICAgIHRoaXMud2luZG93Tm9ybSA9IHBvd2VyO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICB0aGlzLnJlYWwgPSBuZXcgRmxvYXQzMkFycmF5KGZmdFNpemUpO1xuICAgIHRoaXMuaW1hZyA9IG5ldyBGbG9hdDMyQXJyYXkoZmZ0U2l6ZSk7XG4gICAgdGhpcy5mZnQgPSBuZXcgRmZ0TmF5dWtpKGZmdFNpemUpO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgdGhlIGBGZnRgIG9wZXJhdG9yIGluIGBzdGFuZGFsb25lYCBtb2RlIChpLmUuIG91dHNpZGUgb2YgYSBncmFwaCkuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IHNpZ25hbCAtIElucHV0IHZhbHVlcy5cbiAgICogQHJldHVybiB7QXJyYXl9IC0gRmZ0IG9mIHRoZSBpbnB1dCBzaWduYWwuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNvbnN0IGZmdCA9IG5ldyBsZm8ub3BlcmF0b3IuRmZ0KHsgc2l6ZTogNTEyLCB3aW5kb3c6ICdoYW5uJyB9KTtcbiAgICogLy8gbWFuZGF0b3J5IGZvciB1c2UgaW4gc3RhbmRhbG9uZSBtb2RlXG4gICAqIGZmdC5pbml0U3RyZWFtKHsgZnJhbWVTaXplOiAyNTYsIGZyYW1lVHlwZTogJ3NpZ25hbCcgfSk7XG4gICAqIGZmdC5pbnB1dFNpZ25hbChzaWduYWwpO1xuICAgKi9cbiAgaW5wdXRTaWduYWwoc2lnbmFsKSB7XG4gICAgY29uc3QgbW9kZSA9IHRoaXMucGFyYW1zLmdldCgnbW9kZScpO1xuICAgIGNvbnN0IHdpbmRvd1NpemUgPSB0aGlzLndpbmRvd1NpemU7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IGZmdFNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ3NpemUnKTtcbiAgICBjb25zdCBvdXREYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuXG4gICAgLy8gYXBwbHkgd2luZG93IG9uIHRoZSBpbnB1dCBzaWduYWwgYW5kIHJlc2V0IGltYWcgYnVmZmVyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aW5kb3dTaXplOyBpKyspIHtcbiAgICAgIHRoaXMucmVhbFtpXSA9IHNpZ25hbFtpXSAqIHRoaXMud2luZG93W2ldICogdGhpcy53aW5kb3dOb3JtO1xuICAgICAgdGhpcy5pbWFnW2ldID0gMDtcbiAgICB9XG5cbiAgICAvLyBpZiByZWFsIGlzIGJpZ2dlciB0aGFuIGlucHV0IHNpZ25hbCwgZmlsbCB3aXRoIHplcm9zXG4gICAgZm9yIChsZXQgaSA9IHdpbmRvd1NpemU7IGkgPCBmZnRTaXplOyBpKyspIHtcbiAgICAgIHRoaXMucmVhbFtpXSA9IDA7XG4gICAgICB0aGlzLmltYWdbaV0gPSAwO1xuICAgIH1cblxuICAgIHRoaXMuZmZ0LmZvcndhcmQodGhpcy5yZWFsLCB0aGlzLmltYWcpO1xuXG4gICAgaWYgKG1vZGUgPT09ICdtYWduaXR1ZGUnKSB7XG4gICAgICBjb25zdCBub3JtID0gMSAvIGZmdFNpemU7XG5cbiAgICAgIC8vIERDIGluZGV4XG4gICAgICBjb25zdCByZWFsRGMgPSB0aGlzLnJlYWxbMF07XG4gICAgICBjb25zdCBpbWFnRGMgPSB0aGlzLmltYWdbMF07XG4gICAgICBvdXREYXRhWzBdID0gc3FydChyZWFsRGMgKiByZWFsRGMgKyBpbWFnRGMgKiBpbWFnRGMpICogbm9ybTtcblxuICAgICAgLy8gTnF1eXN0IGluZGV4XG4gICAgICBjb25zdCByZWFsTnkgPSB0aGlzLnJlYWxbZmZ0U2l6ZSAvIDJdO1xuICAgICAgY29uc3QgaW1hZ055ID0gdGhpcy5pbWFnW2ZmdFNpemUgLyAyXTtcbiAgICAgIG91dERhdGFbZmZ0U2l6ZSAvIDJdID0gc3FydChyZWFsTnkgKiByZWFsTnkgKyBpbWFnTnkgKiBpbWFnTnkpICogbm9ybTtcblxuICAgICAgLy8gcG93ZXIgc3BlY3RydW1cbiAgICAgIGZvciAobGV0IGkgPSAxLCBqID0gZmZ0U2l6ZSAtIDE7IGkgPCBmZnRTaXplIC8gMjsgaSsrLCBqLS0pIHtcbiAgICAgICAgY29uc3QgcmVhbCA9IDAuNSAqICh0aGlzLnJlYWxbaV0gKyB0aGlzLnJlYWxbal0pO1xuICAgICAgICBjb25zdCBpbWFnID0gMC41ICogKHRoaXMuaW1hZ1tpXSAtIHRoaXMuaW1hZ1tqXSk7XG5cbiAgICAgICAgb3V0RGF0YVtpXSA9IDIgKiBzcXJ0KHJlYWwgKiByZWFsICsgaW1hZyAqIGltYWcpICogbm9ybTtcbiAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gJ3Bvd2VyJykge1xuICAgICAgY29uc3Qgbm9ybSA9IDEgLyAoZmZ0U2l6ZSAqIGZmdFNpemUpO1xuXG4gICAgICAvLyBEQyBpbmRleFxuICAgICAgY29uc3QgcmVhbERjID0gdGhpcy5yZWFsWzBdO1xuICAgICAgY29uc3QgaW1hZ0RjID0gdGhpcy5pbWFnWzBdO1xuICAgICAgb3V0RGF0YVswXSA9IChyZWFsRGMgKiByZWFsRGMgKyBpbWFnRGMgKiBpbWFnRGMpICogbm9ybTtcblxuICAgICAgLy8gTnF1eXN0IGluZGV4XG4gICAgICBjb25zdCByZWFsTnkgPSB0aGlzLnJlYWxbZmZ0U2l6ZSAvIDJdO1xuICAgICAgY29uc3QgaW1hZ055ID0gdGhpcy5pbWFnW2ZmdFNpemUgLyAyXTtcbiAgICAgIG91dERhdGFbZmZ0U2l6ZSAvIDJdID0gKHJlYWxOeSAqIHJlYWxOeSArIGltYWdOeSAqIGltYWdOeSkgKiBub3JtO1xuXG4gICAgICAvLyBwb3dlciBzcGVjdHJ1bVxuICAgICAgZm9yIChsZXQgaSA9IDEsIGogPSBmZnRTaXplIC0gMTsgaSA8IGZmdFNpemUgLyAyOyBpKyssIGotLSkge1xuICAgICAgICBjb25zdCByZWFsID0gMC41ICogKHRoaXMucmVhbFtpXSArIHRoaXMucmVhbFtqXSk7XG4gICAgICAgIGNvbnN0IGltYWcgPSAwLjUgKiAodGhpcy5pbWFnW2ldIC0gdGhpcy5pbWFnW2pdKTtcblxuICAgICAgICBvdXREYXRhW2ldID0gNCAqIChyZWFsICogcmVhbCArIGltYWcgKiBpbWFnKSAqIG5vcm07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dERhdGE7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIHRoaXMuaW5wdXRTaWduYWwoZnJhbWUuZGF0YSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRmZ0O1xuIiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcblxuY29uc3Qgc3FydCA9IE1hdGguc3FydDtcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIG5vcm1hbGl6ZToge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICBwb3dlcjoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfVxufVxuXG4vKipcbiAqIENvbXB1dGUgdGhlIG1hZ25pdHVkZSBvZiBhIGB2ZWN0b3JgIGlucHV0LlxuICpcbiAqIF9zdXBwb3J0IGBzdGFuZGFsb25lYCB1c2FnZV9cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMubm9ybWFsaXplPXRydWVdIC0gTm9ybWFsaXplIG91dHB1dCBhY2NvcmRpbmcgdG9cbiAqICB0aGUgdmVjdG9yIHNpemUuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnBvd2VyPWZhbHNlXSAtIElmIHRydWUsIHJldHVybnMgdGhlIHNxdWFyZWRcbiAqICBtYWduaXR1ZGUgKHBvd2VyKS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NvbW1vbic7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oeyBmcmFtZVNpemU6IDIsIGZyYW1lVHlwZTogJ3ZlY3RvcicgfSk7XG4gKiBjb25zdCBtYWduaXR1ZGUgPSBuZXcgbGZvLm9wZXJhdG9yLk1hZ25pdHVkZSgpO1xuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IG91dEZyYW1lOiB0cnVlIH0pO1xuICpcbiAqIGV2ZW50SW4uY29ubmVjdChtYWduaXR1ZGUpO1xuICogbWFnbml0dWRlLmNvbm5lY3QobG9nZ2VyKTtcbiAqIGV2ZW50SW4uc3RhcnQoKTtcbiAqXG4gKiBldmVudEluLnByb2Nlc3MobnVsbCwgWzEsIDFdKTtcbiAqID4gWzFdXG4gKiBldmVudEluLnByb2Nlc3MobnVsbCwgWzIsIDJdKTtcbiAqID4gWzIuODI4NDI3MTI0NzVdXG4gKiBldmVudEluLnByb2Nlc3MobnVsbCwgWzMsIDNdKTtcbiAqID4gWzQuMjQyNjQwNjg3MTJdXG4gKi9cbmNsYXNzIE1hZ25pdHVkZSBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9ub3JtYWxpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ25vcm1hbGl6ZScpO1xuICAgIHRoaXMuX3Bvd2VyID0gdGhpcy5wYXJhbXMuZ2V0KCdwb3dlcicpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIG9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKSB7XG4gICAgc3VwZXIub25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpO1xuXG4gICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICBjYXNlICdub3JtYWxpemUnOlxuICAgICAgICB0aGlzLl9ub3JtYWxpemUgPSB2YWx1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdwb3dlcic6XG4gICAgICAgIHRoaXMuX3Bvd2VyID0gdmFsdWU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gMTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVR5cGUgPSAnc2NhbGFyJztcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5kZXNjcmlwdGlvbiA9IFsnbWFnbml0dWRlJ107XG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgdGhlIGBNYWduaXR1ZGVgIG9wZXJhdG9yIGluIGBzdGFuZGFsb25lYCBtb2RlIChpLmUuIG91dHNpZGUgb2YgYSBncmFwaCkuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl8RmxvYXQzMkFycmF5fSB2YWx1ZXMgLSBWYWx1ZXMgdG8gcHJvY2Vzcy5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIE1hZ25pdHVkZSB2YWx1ZS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICAgKlxuICAgKiBjb25zdCBtYWduaXR1ZGUgPSBuZXcgbGZvLm9wZXJhdG9yLk1hZ25pdHVkZSh7IHBvd2VyOiB0cnVlIH0pO1xuICAgKiBtYWduaXR1ZGUuaW5pdFN0cmVhbSh7IGZyYW1lVHlwZTogJ3ZlY3RvcicsIGZyYW1lU2l6ZTogMyB9KTtcbiAgICogbWFnbml0dWRlLmlucHV0VmVjdG9yKFszLCAzXSk7XG4gICAqID4gNC4yNDI2NDA2ODcxMlxuICAgKi9cbiAgaW5wdXRWZWN0b3IodmFsdWVzKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aDtcbiAgICBsZXQgc3VtID0gMDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspXG4gICAgICBzdW0gKz0gKHZhbHVlc1tpXSAqIHZhbHVlc1tpXSk7XG5cbiAgICBsZXQgbWFnID0gc3VtO1xuXG4gICAgaWYgKHRoaXMuX25vcm1hbGl6ZSlcbiAgICAgIG1hZyAvPSBsZW5ndGg7XG5cbiAgICBpZiAoIXRoaXMuX3Bvd2VyKVxuICAgICAgbWFnID0gc3FydChtYWcpO1xuXG4gICAgcmV0dXJuIG1hZztcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKGZyYW1lKSB7XG4gICAgdGhpcy5mcmFtZS5kYXRhWzBdID0gdGhpcy5pbnB1dFZlY3RvcihmcmFtZS5kYXRhKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYWduaXR1ZGU7XG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuXG5jb25zdCBzcXJ0ID0gTWF0aC5zcXJ0O1xuXG4vKipcbiAqIENvbXB1dGUgbWVhbiBhbmQgc3RhbmRhcmQgZGV2aWF0aW9uIG9mIGEgZ2l2ZW4gYHNpZ25hbGAuXG4gKlxuICogX3N1cHBvcnQgYHN0YW5kYWxvbmVgIHVzYWdlX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiBjb25zdCBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gKlxuICogbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICogICAuZ2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSlcbiAqICAgLnRoZW4oaW5pdClcbiAqICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKSk7XG4gKlxuICogZnVuY3Rpb24gaW5pdChzdHJlYW0pIHtcbiAqICAgY29uc3Qgc291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZU1lZGlhU3RyZWFtU291cmNlKHN0cmVhbSk7XG4gKlxuICogICBjb25zdCBhdWRpb0luTm9kZSA9IG5ldyBsZm8uc291cmNlLkF1ZGlvSW5Ob2RlKHtcbiAqICAgICBzb3VyY2VOb2RlOiBzb3VyY2UsXG4gKiAgICAgYXVkaW9Db250ZXh0OiBhdWRpb0NvbnRleHQsXG4gKiAgIH0pO1xuICpcbiAqICAgY29uc3QgbWVhblN0ZGRldiA9IG5ldyBsZm8ub3BlcmF0b3IuTWVhblN0ZGRldigpO1xuICpcbiAqICAgY29uc3QgdHJhY2VEaXNwbGF5ID0gbmV3IGxmby5zaW5rLlRyYWNlRGlzcGxheSh7XG4gKiAgICAgY2FudmFzOiAnI3RyYWNlJyxcbiAqICAgfSk7XG4gKlxuICogICBhdWRpb0luTm9kZS5jb25uZWN0KG1lYW5TdGRkZXYpO1xuICogICBtZWFuU3RkZGV2LmNvbm5lY3QodHJhY2VEaXNwbGF5KTtcbiAqICAgYXVkaW9Jbk5vZGUuc3RhcnQoKTtcbiAqIH1cbiAqL1xuY2xhc3MgTWVhblN0ZGRldiBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAvLyBubyBvcHRpb25zIGF2YWlsYWJsZSwganVzdCB0aHJvdyBhbiBlcnJvciBpZiBzb21lIHBhcmFtIHRyeSB0byBiZSBzZXQuXG4gICAgc3VwZXIoe30sIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSA9ICd2ZWN0b3InO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IDI7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZGVzY3JpcHRpb24gPSBbJ21lYW4nLCAnc3RkZGV2J107XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSB0aGUgYE1lYW5TdGRkZXZgIG9wZXJhdG9yIGluIGBzdGFuZGFsb25lYCBtb2RlIChpLmUuIG91dHNpZGUgb2YgYSBncmFwaCkuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl8RmxvYXQzMkFycmF5fSB2YWx1ZXMgLSBWYWx1ZXMgdG8gcHJvY2Vzcy5cbiAgICogQHJldHVybiB7QXJyYXl9IC0gTWVhbiBhbmQgc3RhbmRhcnQgZGV2aWF0aW9uIG9mIHRoZSBpbnB1dCB2YWx1ZXMuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAgICpcbiAgICogY29uc3QgbWVhblN0ZGRldiA9IG5ldyBsZm8ub3BlcmF0b3IuTWVhblN0ZGRldigpO1xuICAgKiBtZWFuU3RkZGV2LmluaXRTdHJlYW0oeyBmcmFtZVR5cGU6ICd2ZWN0b3InLCBmcmFtZVNpemU6IDEwMjQgfSk7XG4gICAqIG1lYW5TdGRkZXYuaW5wdXRWZWN0b3Ioc29tZVNpbmVTaWduYWwpO1xuICAgKiA+IFswLCAwLjcwNzFdXG4gICAqL1xuICBpbnB1dFNpZ25hbCh2YWx1ZXMpIHtcbiAgICBjb25zdCBvdXREYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgIGNvbnN0IGxlbmd0aCA9IHZhbHVlcy5sZW5ndGg7XG5cbiAgICBsZXQgbWVhbiA9IDA7XG4gICAgbGV0IG0yID0gMDtcblxuICAgIC8vIGNvbXB1dGUgbWVhbiBhbmQgdmFyaWFuY2Ugd2l0aCBXZWxmb3JkIGFsZ29yaXRobVxuICAgIC8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FsZ29yaXRobXNfZm9yX2NhbGN1bGF0aW5nX3ZhcmlhbmNlXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgeCA9IHZhbHVlc1tpXTtcbiAgICAgIGNvbnN0IGRlbHRhID0geCAtIG1lYW47XG4gICAgICBtZWFuICs9IGRlbHRhIC8gKGkgKyAxKTtcbiAgICAgIG0yICs9IGRlbHRhICogKHggLSBtZWFuKTtcbiAgICB9XG5cbiAgICBjb25zdCB2YXJpYW5jZSA9IG0yIC8gKGxlbmd0aCAtIDEpO1xuICAgIGNvbnN0IHN0ZGRldiA9IHNxcnQodmFyaWFuY2UpO1xuXG4gICAgb3V0RGF0YVswXSA9IG1lYW47XG4gICAgb3V0RGF0YVsxXSA9IHN0ZGRldjtcblxuICAgIHJldHVybiBvdXREYXRhO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTaWduYWwoZnJhbWUpIHtcbiAgICB0aGlzLmlucHV0U2lnbmFsKGZyYW1lLmRhdGEpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1lYW5TdGRkZXY7XG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuXG5jb25zdCBtaW4gPSBNYXRoLm1pbjtcbmNvbnN0IG1heCA9IE1hdGgubWF4O1xuY29uc3QgcG93ID0gTWF0aC5wb3c7XG5jb25zdCBsb2cxMCA9IE1hdGgubG9nMTA7XG5cbmZ1bmN0aW9uIGhlcnR6VG9NZWxIdGsoZnJlcUh6KSB7XG4gIHJldHVybiAyNTk1ICogTWF0aC5sb2cxMCgxICsgKGZyZXFIeiAvIDcwMCkpO1xufVxuXG5mdW5jdGlvbiBtZWxUb0hlcnR6SHRrKGZyZXFNZWwpIHtcbiAgcmV0dXJuIDcwMCAqIChNYXRoLnBvdygxMCwgZnJlcU1lbCAvIDI1OTUpIC0gMSk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGRlc2NyaXB0aW9uIG9mIHRoZSB3ZWlnaHRzIHRvIGFwcGx5IG9uIHRoZSBmZnQgYmlucyBmb3IgZWFjaFxuICogTWVsIGJhbmQgZmlsdGVyLlxuICogQG5vdGUgLSBhZGFwdGVkIGZyb20gaW10ci10b29scy9ydGFcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbmJyQmlucyAtIE51bWJlciBvZiBmZnQgYmlucy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBuYnJGaWx0ZXIgLSBOdW1iZXIgb2YgbWVsIGZpbHRlcnMuXG4gKiBAcGFyYW0ge051bWJlcn0gc2FtcGxlUmF0ZSAtIFNhbXBsZSBSYXRlIG9mIHRoZSBzaWduYWwuXG4gKiBAcGFyYW0ge051bWJlcn0gbWluRnJlcSAtIE1pbmltdW0gRnJlcXVlbmN5IHRvIGJlIGNvbnNpZGVyZXJlZC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBtYXhGcmVxIC0gTWF4aW11bSBmcmVxdWVuY3kgdG8gY29uc2lkZXIuXG4gKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fSAtIERlc2NyaXB0aW9uIG9mIHRoZSB3ZWlnaHRzIHRvIGFwcGx5IG9uIHRoZSBiaW5zIGZvclxuICogIGVhY2ggbWVsIGZpbHRlci4gRWFjaCBkZXNjcmlwdGlvbiBoYXMgdGhlIGZvbGxvd2luZyBzdHJ1Y3R1cmU6XG4gKiAgeyBzdGFydEluZGV4OiBiaW5JbmRleCwgY2VudGVyRnJlcTogYmluQ2VudGVyRnJlcXVlbmN5LCB3ZWlnaHRzOiBbXSB9XG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZ2V0TWVsQmFuZFdlaWdodHMobmJyQmlucywgbmJyQmFuZHMsIHNhbXBsZVJhdGUsIG1pbkZyZXEsIG1heEZyZXEsIHR5cGUgPSAnaHRrJykge1xuXG4gIGxldCBoZXJ0elRvTWVsID0gbnVsbDtcbiAgbGV0IG1lbFRvSGVydHogPSBudWxsO1xuICBsZXQgbWluTWVsO1xuICBsZXQgbWF4TWVsO1xuXG4gIGlmICh0eXBlID09PSAnaHRrJykge1xuICAgIGhlcnR6VG9NZWwgPSBoZXJ0elRvTWVsSHRrO1xuICAgIG1lbFRvSGVydHogPSBtZWxUb0hlcnR6SHRrO1xuICAgIG1pbk1lbCA9IGhlcnR6VG9NZWwobWluRnJlcSk7XG4gICAgbWF4TWVsID0gaGVydHpUb01lbChtYXhGcmVxKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbWVsIGJhbmQgdHlwZTogXCIke3R5cGV9XCJgKTtcbiAgfVxuXG4gIGNvbnN0IG1lbEJhbmREZXNjcmlwdGlvbnMgPSBuZXcgQXJyYXkobmJyQmFuZHMpO1xuICAvLyBjZW50ZXIgZnJlcXVlbmNpZXMgb2YgRmZ0IGJpbnNcbiAgY29uc3QgZmZ0RnJlcXMgPSBuZXcgRmxvYXQzMkFycmF5KG5ickJpbnMpO1xuICAvLyBjZW50ZXIgZnJlcXVlbmNpZXMgb2YgbWVsIGJhbmRzIC0gdW5pZm9ybWx5IHNwYWNlZCBpbiBtZWwgZG9tYWluIGJldHdlZW5cbiAgLy8gbGltaXRzLCB0aGVyZSBhcmUgMiBtb3JlIGZyZXF1ZW5jaWVzIHRoYW4gdGhlIGFjdHVhbCBudW1iZXIgb2YgZmlsdGVycyBpblxuICAvLyBvcmRlciB0byBjYWxjdWxhdGUgdGhlIHNsb3Blc1xuICBjb25zdCBmaWx0ZXJGcmVxcyA9IG5ldyBGbG9hdDMyQXJyYXkobmJyQmFuZHMgKyAyKTtcblxuICBjb25zdCBmZnRTaXplID0gKG5ickJpbnMgLSAxKSAqIDI7XG4gIC8vIGNvbXB1dGUgYmlucyBjZW50ZXIgZnJlcXVlbmNpZXNcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYnJCaW5zOyBpKyspXG4gICAgZmZ0RnJlcXNbaV0gPSBzYW1wbGVSYXRlICogaSAvIGZmdFNpemU7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYnJCYW5kcyArIDI7IGkrKylcbiAgICBmaWx0ZXJGcmVxc1tpXSA9IG1lbFRvSGVydHoobWluTWVsICsgaSAvIChuYnJCYW5kcyArIDEpICogKG1heE1lbCAtIG1pbk1lbCkpO1xuXG4gIC8vIGxvb3AgdGhyb3VnaHQgZmlsdGVyc1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5ickJhbmRzOyBpKyspIHtcbiAgICBsZXQgbWluV2VpZ2h0SW5kZXhEZWZpbmVkID0gMDtcblxuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0ge1xuICAgICAgc3RhcnRJbmRleDogbnVsbCxcbiAgICAgIGNlbnRlckZyZXE6IG51bGwsXG4gICAgICB3ZWlnaHRzOiBbXSxcbiAgICB9XG5cbiAgICAvLyBkZWZpbmUgY29udHJpYnV0aW9uIG9mIGVhY2ggYmluIGZvciB0aGUgZmlsdGVyIGF0IGluZGV4IChpICsgMSlcbiAgICAvLyBkbyBub3QgcHJvY2VzcyB0aGUgbGFzdCBzcGVjdHJ1bSBjb21wb25lbnQgKE55cXVpc3QpXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBuYnJCaW5zIC0gMTsgaisrKSB7XG4gICAgICBjb25zdCBwb3NTbG9wZUNvbnRyaWIgPSAoZmZ0RnJlcXNbal0gLSBmaWx0ZXJGcmVxc1tpXSkgL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZpbHRlckZyZXFzW2krMV0gLSBmaWx0ZXJGcmVxc1tpXSk7XG5cbiAgICAgIGNvbnN0IG5lZ1Nsb3BlQ29udHJpYiA9IChmaWx0ZXJGcmVxc1tpKzJdIC0gZmZ0RnJlcXNbal0pIC9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmaWx0ZXJGcmVxc1tpKzJdIC0gZmlsdGVyRnJlcXNbaSsxXSk7XG4gICAgICAvLyBsb3dlclNsb3BlIGFuZCB1cHBlciBzbG9wZSBpbnRlcnNlY3QgYXQgemVybyBhbmQgd2l0aCBlYWNoIG90aGVyXG4gICAgICBjb25zdCBjb250cmlidXRpb24gPSBtYXgoMCwgbWluKHBvc1Nsb3BlQ29udHJpYiwgbmVnU2xvcGVDb250cmliKSk7XG5cbiAgICAgIGlmIChjb250cmlidXRpb24gPiAwKSB7XG4gICAgICAgIGlmIChkZXNjcmlwdGlvbi5zdGFydEluZGV4ID09PSBudWxsKSB7XG4gICAgICAgICAgZGVzY3JpcHRpb24uc3RhcnRJbmRleCA9IGo7XG4gICAgICAgICAgZGVzY3JpcHRpb24uY2VudGVyRnJlcSA9IGZpbHRlckZyZXFzW2krMV07XG4gICAgICAgIH1cblxuICAgICAgICBkZXNjcmlwdGlvbi53ZWlnaHRzLnB1c2goY29udHJpYnV0aW9uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBlbXB0eSBmaWx0ZXJcbiAgICBpZiAoZGVzY3JpcHRpb24uc3RhcnRJbmRleCA9PT0gbnVsbCkge1xuICAgICAgZGVzY3JpcHRpb24uc3RhcnRJbmRleCA9IDA7XG4gICAgICBkZXNjcmlwdGlvbi5jZW50ZXJGcmVxID0gMDtcbiAgICB9XG5cbiAgICAvLyBAdG9kbyAtIGRvIHNvbWUgc2NhbGluZyBmb3IgU2xhbmV5LXN0eWxlIG1lbFxuICAgIG1lbEJhbmREZXNjcmlwdGlvbnNbaV0gPSBkZXNjcmlwdGlvbjtcbiAgfVxuXG4gIHJldHVybiBtZWxCYW5kRGVzY3JpcHRpb25zO1xufVxuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBsb2c6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgbmJyQmFuZHM6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMjQsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgbWluRnJlcToge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogMCxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBtYXhGcmVxOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIHBvd2VyOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDEsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG59O1xuXG5cbi8qKlxuICogQ29tcHV0ZSB0aGUgbWVsIGJhbmRzIHNwZWN0cnVtIGZyb20gYSBnaXZlbiBzcGVjdHJ1bSAoYHZlY3RvcmAgdHlwZSkuXG4gKiBfSW1wbGVtZW50IHRoZSBgaHRrYCBtZWwgYmFuZCBzdHlsZS5fXG4gKlxuICogX3N1cHBvcnQgYHN0YW5kYWxvbmVgIHVzYWdlX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmxvZz1mYWxzZV0gLSBBcHBseSBhIGxvZ2FyaXRobWljIHNjYWxlIG9uIHRoZSBvdXRwdXQuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubmJyQmFuZHM9MjRdIC0gTnVtYmVyIG9mIGZpbHRlcnMgZGVmaW5pbmcgdGhlIG1lbFxuICogIGJhbmRzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1pbkZyZXE9MF0gLSBNaW5pbXVtIGZyZXF1ZW5jeSB0byBjb25zaWRlci5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXhGcmVxPW51bGxdIC0gTWF4aW11bSBmcmVxdWVuY3kgdG8gY29uc2lkZXIuXG4gKiAgSWYgYG51bGxgLCBpcyBzZXQgdG8gTnlxdWlzdCBmcmVxdWVuY3kuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucG93ZXI9MV0gLSBBcHBseSBhIHBvd2VyIHNjYWxpbmcgb24gZWFjaCBtZWwgYmFuZC5cbiAqXG4gKiBAdG9kbyAtIGltcGxlbWVudCBTbGFuZXkgc3R5bGUgbWVsIGJhbmRzXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCBsZm8gZnJvbSAnd2F2ZXMtbGZvL25vZGUnXG4gKlxuICogLy8gcmVhZCBhIGZpbGUgZnJvbSBwYXRoIChub2RlIG9ubHkgc291cmNlKVxuICogY29uc3QgYXVkaW9JbkZpbGUgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luRmlsZSh7XG4gKiAgIGZpbGVuYW1lOiAncGF0aC90by9maWxlJyxcbiAqICAgZnJhbWVTaXplOiA1MTIsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBzbGljZXIgPSBuZXcgbGZvLm9wZXJhdG9yLlNsaWNlcih7XG4gKiAgIGZyYW1lU2l6ZTogMjU2LFxuICogICBob3BTaXplOiAyNTYsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBmZnQgPSBuZXcgbGZvLm9wZXJhdG9yLkZmdCh7XG4gKiAgIHNpemU6IDEwMjQsXG4gKiAgIHdpbmRvdzogJ2hhbm4nLFxuICogICBtb2RlOiAncG93ZXInLFxuICogICBub3JtOiAncG93ZXInLFxuICogfSk7XG4gKlxuICogY29uc3QgbWVsID0gbmV3IGxmby5vcGVyYXRvci5NZWwoe1xuICogICBsb2c6IHRydWUsXG4gKiAgIG5ickJhbmRzOiAyNCxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGxvZ2dlciA9IG5ldyBsZm8uc2luay5Mb2dnZXIoeyBkYXRhOiB0cnVlIH0pO1xuICpcbiAqIGF1ZGlvSW5GaWxlLmNvbm5lY3Qoc2xpY2VyKTtcbiAqIHNsaWNlci5jb25uZWN0KGZmdCk7XG4gKiBmZnQuY29ubmVjdChtZWwpO1xuICogbWVsLmNvbm5lY3QobG9nZ2VyKTtcbiAqXG4gKiBhdWRpb0luRmlsZS5zdGFydCgpO1xuICovXG5jbGFzcyBNZWwgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIGNvbnN0IG5ickJpbnMgPSBwcmV2U3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBuYnJCYW5kcyA9IHRoaXMucGFyYW1zLmdldCgnbmJyQmFuZHMnKTtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcbiAgICBjb25zdCBtaW5GcmVxID0gdGhpcy5wYXJhbXMuZ2V0KCdtaW5GcmVxJyk7XG4gICAgbGV0IG1heEZyZXEgPSB0aGlzLnBhcmFtcy5nZXQoJ21heEZyZXEnKTtcblxuICAgIC8vXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gbmJyQmFuZHM7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3ZlY3Rvcic7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZGVzY3JpcHRpb24gPSBbXTtcblxuICAgIGlmIChtYXhGcmVxID09PSBudWxsKVxuICAgICAgbWF4RnJlcSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgLyAyO1xuXG4gICAgdGhpcy5tZWxCYW5kRGVzY3JpcHRpb25zID0gZ2V0TWVsQmFuZFdlaWdodHMobmJyQmlucywgbmJyQmFuZHMsIHNhbXBsZVJhdGUsIG1pbkZyZXEsIG1heEZyZXEpO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgdGhlIGBNZWxgIG9wZXJhdG9yIGluIGBzdGFuZGFsb25lYCBtb2RlIChpLmUuIG91dHNpZGUgb2YgYSBncmFwaCkuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IHNwZWN0cnVtIC0gRmZ0IGJpbnMuXG4gICAqIEByZXR1cm4ge0FycmF5fSAtIE1lbCBiYW5kcy5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3QgbWVsID0gbmV3IGxmby5vcGVyYXRvci5NZWwoeyBuYnJCYW5kczogMjQgfSk7XG4gICAqIC8vIG1hbmRhdG9yeSBmb3IgdXNlIGluIHN0YW5kYWxvbmUgbW9kZVxuICAgKiBtZWwuaW5pdFN0cmVhbSh7IGZyYW1lU2l6ZTogMjU2LCBmcmFtZVR5cGU6ICd2ZWN0b3InIH0pO1xuICAgKiBtZWwuaW5wdXRWZWN0b3IoZmZ0Qmlucyk7XG4gICAqL1xuICBpbnB1dFZlY3RvcihiaW5zKSB7XG5cbiAgICBjb25zdCBwb3dlciA9IHRoaXMucGFyYW1zLmdldCgncG93ZXInKTtcbiAgICBjb25zdCBsb2cgPSB0aGlzLnBhcmFtcy5nZXQoJ2xvZycpO1xuICAgIGNvbnN0IG1lbEJhbmRzID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgIGNvbnN0IG5ickJhbmRzID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGxldCBzY2FsZSA9IDE7XG5cbiAgICBjb25zdCBtaW5Mb2dWYWx1ZSA9IDFlLTQ4O1xuICAgIGNvbnN0IG1pbkxvZyA9IC00ODA7XG5cbiAgICBpZiAobG9nKVxuICAgICAgc2NhbGUgKj0gbmJyQmFuZHM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ickJhbmRzOyBpKyspIHtcbiAgICAgIGNvbnN0IHsgc3RhcnRJbmRleCwgd2VpZ2h0cyB9ID0gdGhpcy5tZWxCYW5kRGVzY3JpcHRpb25zW2ldO1xuICAgICAgbGV0IHZhbHVlID0gMDtcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB3ZWlnaHRzLmxlbmd0aDsgaisrKVxuICAgICAgICB2YWx1ZSArPSB3ZWlnaHRzW2pdICogYmluc1tzdGFydEluZGV4ICsgal07XG5cbiAgICAgIC8vIGFwcGx5IHNhbWUgbG9naWMgYXMgaW4gUGlQb0JhbmRzXG4gICAgICBpZiAoc2NhbGUgIT09IDEpXG4gICAgICAgIHZhbHVlICo9IHNjYWxlO1xuXG4gICAgICBpZiAobG9nKSB7XG4gICAgICAgIGlmICh2YWx1ZSA+IG1pbkxvZ1ZhbHVlKVxuICAgICAgICAgIHZhbHVlID0gMTAgKiBsb2cxMCh2YWx1ZSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB2YWx1ZSA9IG1pbkxvZztcbiAgICAgIH1cblxuICAgICAgaWYgKHBvd2VyICE9PSAxKVxuICAgICAgICB2YWx1ZSA9IHBvdyh2YWx1ZSwgcG93ZXIpO1xuXG4gICAgICBtZWxCYW5kc1tpXSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBtZWxCYW5kcztcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKGZyYW1lKSB7XG4gICAgdGhpcy5pbnB1dFZlY3RvcihmcmFtZS5kYXRhKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNZWw7XG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuaW1wb3J0IEZmdCBmcm9tICcuL0ZmdCc7XG5pbXBvcnQgTWVsIGZyb20gJy4vTWVsJztcbmltcG9ydCBEY3QgZnJvbSAnLi9EY3QnO1xuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBuYnJCYW5kczoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAyNCxcbiAgICBtZXRhOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIG5ickNvZWZzOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDEyLFxuICAgIG1ldGE6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgbWluRnJlcToge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogMCxcbiAgICBtZXRhOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIG1heEZyZXE6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YTogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9XG59O1xuXG5cbi8qKlxuICogQ29tcHV0ZSB0aGUgTWZjYyBvZiB0aGUgaW5jb21taW5nIGBzaWduYWxgLiBJcyBiYXNpY2FsbHkgYSB3cmFwcGVyIGFyb3VuZFxuICogW2BGZnRgXXtAbGluayBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yLkZmdH0sIFtgTWVsYF17QGxpbmsgbW9kdWxlOmNvbW1vbi5vcGVyYXRvci5NZWx9XG4gKiBhbmQgW2BEY3RgXXtAbGluayBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yLkRjdH0uXG4gKlxuICogX3N1cHBvcnQgYHN0YW5kYWxvbmVgIHVzYWdlX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge25ickJhbmRzfSBbb3B0aW9ucy5uYnJCYW5kcz0yNF0gLSBOdW1iZXIgb2YgTWVsIGJhbmRzLlxuICogQHBhcmFtIHtuYnJDb2Vmc30gW29wdGlvbnMubmJyQ29lZnM9MTJdIC0gTnVtYmVyIG9mIG91dHB1dCBjb2Vmcy5cbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yLkZmdH1cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24ub3BlcmF0b3IuTWVsfVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5vcGVyYXRvci5EY3R9XG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCBsZm8gZnJvbSAnd2F2ZXMtbGZvL25vZGUnXG4gKlxuICogY29uc3QgYXVkaW9JbkZpbGUgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luRmlsZSh7XG4gKiAgIGZpbGVuYW1lOiAncGF0aC90by9maWxlJyxcbiAqICAgZnJhbWVTaXplOiA1MTIsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBzbGljZXIgPSBuZXcgbGZvLm9wZXJhdG9yLlNsaWNlcih7XG4gKiAgIGZyYW1lU2l6ZTogMjU2LFxuICogfSk7XG4gKlxuICogY29uc3QgbWZjYyA9IG5ldyBsZm8ub3BlcmF0b3IuTWZjYyh7XG4gKiAgIG5ickJhbmRzOiAyNCxcbiAqICAgbmJyQ29lZnM6IDEyLFxuICogfSk7XG4gKlxuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IGRhdGE6IHRydWUgfSk7XG4gKlxuICogYXVkaW9JbkZpbGUuY29ubmVjdChzbGljZXIpO1xuICogc2xpY2VyLmNvbm5lY3QobWZjYyk7XG4gKiBtZmNjLmNvbm5lY3QobG9nZ2VyKTtcbiAqXG4gKiBhdWRpb0luRmlsZS5zdGFydCgpO1xuICovXG5jbGFzcyBNZmNjIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgY29uc3QgbmJyQmFuZHMgPSB0aGlzLnBhcmFtcy5nZXQoJ25ickJhbmRzJyk7XG4gICAgY29uc3QgbmJyQ29lZnMgPSB0aGlzLnBhcmFtcy5nZXQoJ25ickNvZWZzJyk7XG4gICAgY29uc3QgbWluRnJlcSA9IHRoaXMucGFyYW1zLmdldCgnbWluRnJlcScpO1xuICAgIGNvbnN0IG1heEZyZXEgPSB0aGlzLnBhcmFtcy5nZXQoJ21heEZyZXEnKTtcbiAgICBjb25zdCBpbnB1dEZyYW1lU2l6ZSA9IHByZXZTdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IGlucHV0RnJhbWVSYXRlID0gcHJldlN0cmVhbVBhcmFtcy5mcmFtZVJhdGU7XG4gICAgY29uc3QgaW5wdXRTYW1wbGVSYXRlID0gcHJldlN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuICAgIGNvbnN0IG5ickJpbnMgPSBpbnB1dEZyYW1lU2l6ZSAvIDIgKyAxO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gbmJyQ29lZnM7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3ZlY3Rvcic7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZGVzY3JpcHRpb24gPSBbXTtcblxuICAgIHRoaXMuZmZ0ID0gbmV3IEZmdCh7XG4gICAgICB3aW5kb3c6ICdoYW5uJyxcbiAgICAgIG1vZGU6ICdwb3dlcicsXG4gICAgICBub3JtOiAncG93ZXInLFxuICAgICAgc2l6ZTogaW5wdXRGcmFtZVNpemUsXG4gICAgfSk7XG5cbiAgICB0aGlzLm1lbCA9IG5ldyBNZWwoe1xuICAgICAgbmJyQmFuZHM6IG5ickJhbmRzLFxuICAgICAgbG9nOiB0cnVlLFxuICAgICAgcG93ZXI6IDEsXG4gICAgICBtaW5GcmVxOiBtaW5GcmVxLFxuICAgICAgbWF4RnJlcTogbWF4RnJlcSxcbiAgICB9KTtcblxuICAgIHRoaXMuZGN0ID0gbmV3IERjdCh7XG4gICAgICBvcmRlcjogbmJyQ29lZnMsXG4gICAgfSk7XG5cbiAgICAvLyBpbml0IHN0cmVhbXNcbiAgICB0aGlzLmZmdC5pbml0U3RyZWFtKHtcbiAgICAgIGZyYW1lVHlwZTogJ3NpZ25hbCcsXG4gICAgICBmcmFtZVNpemU6IGlucHV0RnJhbWVTaXplLFxuICAgICAgZnJhbWVSYXRlOiBpbnB1dEZyYW1lUmF0ZSxcbiAgICAgIHNvdXJjZVNhbXBsZVJhdGU6IGlucHV0U2FtcGxlUmF0ZSxcbiAgICB9KTtcblxuICAgIHRoaXMubWVsLmluaXRTdHJlYW0oe1xuICAgICAgZnJhbWVUeXBlOiAndmVjdG9yJyxcbiAgICAgIGZyYW1lU2l6ZTogbmJyQmlucyxcbiAgICAgIGZyYW1lUmF0ZTogaW5wdXRGcmFtZVJhdGUsXG4gICAgICBzb3VyY2VTYW1wbGVSYXRlOiBpbnB1dFNhbXBsZVJhdGUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmRjdC5pbml0U3RyZWFtKHtcbiAgICAgIGZyYW1lVHlwZTogJ3ZlY3RvcicsXG4gICAgICBmcmFtZVNpemU6IG5ickJhbmRzLFxuICAgICAgZnJhbWVSYXRlOiBpbnB1dEZyYW1lUmF0ZSxcbiAgICAgIHNvdXJjZVNhbXBsZVJhdGU6IGlucHV0U2FtcGxlUmF0ZSxcbiAgICB9KTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIHRoZSBgTWZjY2Agb3BlcmF0b3IgaW4gYHN0YW5kYWxvbmVgIG1vZGUgKGkuZS4gb3V0c2lkZSBvZiBhIGdyYXBoKS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gZGF0YSAtIFNpZ25hbCBjaHVuayB0byBhbmFseXNlLlxuICAgKiBAcmV0dXJuIHtBcnJheX0gLSBNZmNjIGNvZWZmaWNpZW50cy5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3QgbWZjYyA9IG5ldyBsZm8ub3BlcmF0b3IuTWZjYygpO1xuICAgKiAvLyBtYW5kYXRvcnkgZm9yIHVzZSBpbiBzdGFuZGFsb25lIG1vZGVcbiAgICogbWZjYy5pbml0U3RyZWFtKHsgZnJhbWVTaXplOiAyNTYsIGZyYW1lVHlwZTogJ3ZlY3RvcicgfSk7XG4gICAqIG1mY2MuaW5wdXRTaWduYWwoc2lnbmFsKTtcbiAgICovXG4gIGlucHV0U2lnbmFsKGRhdGEpIHtcbiAgICBjb25zdCBvdXRwdXQgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3QgbmJyQ29lZnMgPSB0aGlzLnBhcmFtcy5nZXQoJ25ickNvZWZzJyk7XG5cbiAgICBjb25zdCBiaW5zID0gdGhpcy5mZnQuaW5wdXRTaWduYWwoZGF0YSk7XG4gICAgY29uc3QgbWVsQmFuZHMgPSB0aGlzLm1lbC5pbnB1dFZlY3RvcihiaW5zKTtcbiAgICAvLyBjb25zb2xlLmxvZyhtZWxCYW5kcyk7XG4gICAgY29uc3QgY29lZnMgPSB0aGlzLmRjdC5pbnB1dFNpZ25hbChtZWxCYW5kcyk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ickNvZWZzOyBpKyspXG4gICAgICBvdXRwdXRbaV0gPSBjb2Vmc1tpXTtcblxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIHRoaXMuaW5wdXRTaWduYWwoZnJhbWUuZGF0YSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWZjYztcbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5cbi8qKlxuICogRmluZCBtaW5pbXVuIGFuZCBtYXhpbXVtIHZhbHVlcyBvZiBhIGdpdmVuIGBzaWduYWxgLlxuICpcbiAqIF9zdXBwb3J0IGBzdGFuZGFsb25lYCB1c2FnZV9cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NvbW1vbic7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVNpemU6IDUxMixcbiAqICAgZnJhbWVUeXBlOiAnc2lnbmFsJyxcbiAqICAgc2FtcGxlUmF0ZTogMCxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IG1pbk1heCA9IG5ldyBsZm8ub3BlcmF0b3IuTWluTWF4KCk7XG4gKlxuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IGRhdGE6IHRydWUgfSk7XG4gKlxuICogZXZlbnRJbi5jb25uZWN0KG1pbk1heCk7XG4gKiBtaW5NYXguY29ubmVjdChsb2dnZXIpO1xuICogZXZlbnRJbi5zdGFydCgpXG4gKlxuICogLy8gY3JlYXRlIGEgZnJhbWVcbiAqIGNvbnN0IHNpZ25hbCA9IG5ldyBGbG9hdDMyQXJyYXkoNTEyKTtcbiAqIGZvciAobGV0IGkgPSAwOyBpIDwgNTEyOyBpKyspXG4gKiAgIHNpZ25hbFtpXSA9IGkgKyAxO1xuICpcbiAqIGV2ZW50SW4ucHJvY2VzcyhudWxsLCBzaWduYWwpO1xuICogPiBbMSwgNTEyXTtcbiAqL1xuY2xhc3MgTWluTWF4IGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIC8vIHRocm93IGVycm9ycyBpZiBvcHRpb25zIGFyZSBnaXZlblxuICAgIHN1cGVyKHt9LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSA9ICd2ZWN0b3InO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IDI7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZGVzY3JpcHRpb24gPSBbJ21pbicsICdtYXgnXTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIHRoZSBgTWluTWF4YCBvcGVyYXRvciBpbiBgc3RhbmRhbG9uZWAgbW9kZSAoaS5lLiBvdXRzaWRlIG9mIGEgZ3JhcGgpLlxuICAgKlxuICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheXxBcnJheX0gZGF0YSAtIElucHV0IHNpZ25hbC5cbiAgICogQHJldHVybiB7QXJyYXl9IC0gTWluIGFuZCBtYXggdmFsdWVzLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjb25zdCBtaW5NYXggPSBuZXcgTWluTWF4KCk7XG4gICAqIG1pbk1heC5pbml0U3RyZWFtKHsgZnJhbWVUeXBlOiAnc2lnbmFsJywgZnJhbWVTaXplOiAxMCB9KTtcbiAgICpcbiAgICogbWluTWF4LmlucHV0U2lnbmFsKFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5XSk7XG4gICAqID4gWzAsIDVdXG4gICAqL1xuICBpbnB1dFNpZ25hbChkYXRhKSB7XG4gICAgY29uc3Qgb3V0RGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBsZXQgbWluID0gK0luZmluaXR5O1xuICAgIGxldCBtYXggPSAtSW5maW5pdHk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IGRhdGEubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGRhdGFbaV07XG4gICAgICBpZiAodmFsdWUgPCBtaW4pIG1pbiA9IHZhbHVlO1xuICAgICAgaWYgKHZhbHVlID4gbWF4KSBtYXggPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBvdXREYXRhWzBdID0gbWluO1xuICAgIG91dERhdGFbMV0gPSBtYXg7XG5cbiAgICByZXR1cm4gb3V0RGF0YTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKGZyYW1lKSB7XG4gICAgdGhpcy5pbnB1dFNpZ25hbChmcmFtZS5kYXRhKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNaW5NYXg7XG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgb3JkZXI6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgbWluOiAxLFxuICAgIG1heDogMWU5LFxuICAgIGRlZmF1bHQ6IDEwLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9XG4gIH0sXG4gIGZpbGw6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIG1pbjogLUluZmluaXR5LFxuICAgIG1heDogK0luZmluaXR5LFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG59O1xuXG4vKipcbiAqIENvbXB1dGUgYSBtb3ZpbmcgYXZlcmFnZSBvcGVyYXRpb24gb24gdGhlIGluY29tbWluZyBmcmFtZXMgKGBzY2FsYXJgIG9yXG4gKiBgdmVjdG9yYCB0eXBlKS4gSWYgdGhlIGlucHV0IGlzIG9mIHR5cGUgdmVjdG9yLCB0aGUgbW92aW5nIGF2ZXJhZ2UgaXNcbiAqIGNvbXB1dGVkIGZvciBlYWNoIGRpbWVuc2lvbiBpbiBwYXJhbGxlbC4gSWYgdGhlIHNvdXJjZSBzYW1wbGUgcmF0ZSBpcyBkZWZpbmVkXG4gKiBmcmFtZSB0aW1lIGlzIHNoaWZ0ZWQgdG8gdGhlIG1pZGRsZSBvZiB0aGUgd2luZG93IGRlZmluZWQgYnkgdGhlIG9yZGVyLlxuICpcbiAqIF9zdXBwb3J0IGBzdGFuZGFsb25lYCB1c2FnZV9cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm9yZGVyPTEwXSAtIE51bWJlciBvZiBzdWNjZXNzaXZlIHZhbHVlcyBvbiB3aGljaFxuICogIHRoZSBhdmVyYWdlIGlzIGNvbXB1dGVkLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmZpbGw9MF0gLSBWYWx1ZSB0byBmaWxsIHRoZSByaW5nIGJ1ZmZlciB3aXRoIGJlZm9yZVxuICogIHRoZSBmaXJzdCBpbnB1dCBmcmFtZS5cbiAqXG4gKiBAdG9kbyAtIEltcGxlbWVudCBgcHJvY2Vzc1NpZ25hbGAgP1xuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NvbW1vbic7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVNpemU6IDIsXG4gKiAgIGZyYW1lVHlwZTogJ3ZlY3RvcidcbiAqIH0pO1xuICpcbiAqIGNvbnN0IG1vdmluZ0F2ZXJhZ2UgPSBuZXcgbGZvLm9wZXJhdG9yLk1vdmluZ0F2ZXJhZ2Uoe1xuICogICBvcmRlcjogNSxcbiAqICAgZmlsbDogMFxuICogfSk7XG4gKlxuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IGRhdGE6IHRydWUgfSk7XG4gKlxuICogZXZlbnRJbi5jb25uZWN0KG1vdmluZ0F2ZXJhZ2UpO1xuICogbW92aW5nQXZlcmFnZS5jb25uZWN0KGxvZ2dlcik7XG4gKlxuICogZXZlbnRJbi5zdGFydCgpO1xuICpcbiAqIGV2ZW50SW4ucHJvY2VzcyhudWxsLCBbMSwgMV0pO1xuICogPiBbMC4yLCAwLjJdXG4gKiBldmVudEluLnByb2Nlc3MobnVsbCwgWzEsIDFdKTtcbiAqID4gWzAuNCwgMC40XVxuICogZXZlbnRJbi5wcm9jZXNzKG51bGwsIFsxLCAxXSk7XG4gKiA+IFswLjYsIDAuNl1cbiAqIGV2ZW50SW4ucHJvY2VzcyhudWxsLCBbMSwgMV0pO1xuICogPiBbMC44LCAwLjhdXG4gKiBldmVudEluLnByb2Nlc3MobnVsbCwgWzEsIDFdKTtcbiAqID4gWzEsIDFdXG4gKi9cbmNsYXNzIE1vdmluZ0F2ZXJhZ2UgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5zdW0gPSBudWxsO1xuICAgIHRoaXMucmluZ0J1ZmZlciA9IG51bGw7XG4gICAgdGhpcy5yaW5nSW5kZXggPSAwO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIG9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKSB7XG4gICAgc3VwZXIub25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpO1xuXG4gICAgLy8gQHRvZG8gLSBzaG91bGQgYmUgZG9uZSBsYXppbHkgaW4gcHJvY2Vzc1xuICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgY2FzZSAnb3JkZXInOlxuICAgICAgICB0aGlzLnByb2Nlc3NTdHJlYW1QYXJhbXMoKTtcbiAgICAgICAgdGhpcy5yZXNldFN0cmVhbSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2ZpbGwnOlxuICAgICAgICB0aGlzLnJlc2V0U3RyZWFtKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ29yZGVyJyk7XG5cbiAgICB0aGlzLnJpbmdCdWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KG9yZGVyICogZnJhbWVTaXplKTtcblxuICAgIGlmIChmcmFtZVNpemUgPiAxKVxuICAgICAgdGhpcy5zdW0gPSBuZXcgRmxvYXQzMkFycmF5KGZyYW1lU2l6ZSk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5zdW0gPSAwO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICByZXNldFN0cmVhbSgpIHtcbiAgICBzdXBlci5yZXNldFN0cmVhbSgpO1xuXG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ29yZGVyJyk7XG4gICAgY29uc3QgZmlsbCA9IHRoaXMucGFyYW1zLmdldCgnZmlsbCcpO1xuICAgIGNvbnN0IHJpbmdCdWZmZXIgPSB0aGlzLnJpbmdCdWZmZXI7XG4gICAgY29uc3QgcmluZ0xlbmd0aCA9IHJpbmdCdWZmZXIubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByaW5nTGVuZ3RoOyBpKyspXG4gICAgICByaW5nQnVmZmVyW2ldID0gZmlsbDtcblxuICAgIGNvbnN0IGZpbGxTdW0gPSBvcmRlciAqIGZpbGw7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuXG4gICAgaWYgKGZyYW1lU2l6ZSA+IDEpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspXG4gICAgICAgIHRoaXMuc3VtW2ldID0gZmlsbFN1bTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdW0gPSBmaWxsU3VtO1xuICAgIH1cblxuICAgIHRoaXMucmluZ0luZGV4ID0gMDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2NhbGFyKHZhbHVlKSB7XG4gICAgdGhpcy5mcmFtZS5kYXRhWzBdID0gdGhpcy5pbnB1dFNjYWxhcihmcmFtZS5kYXRhWzBdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgdGhlIGBNb3ZpbmdBdmVyYWdlYCBvcGVyYXRvciBpbiBgc3RhbmRhbG9uZWAgbW9kZSAoaS5lLiBvdXRzaWRlIG9mIGFcbiAgICogZ3JhcGgpIHdpdGggYSBgc2NhbGFyYCBpbnB1dC5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIC0gVmFsdWUgdG8gZmVlZCB0aGUgbW92aW5nIGF2ZXJhZ2Ugd2l0aC5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIEF2ZXJhZ2UgdmFsdWUuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAgICpcbiAgICogY29uc3QgbW92aW5nQXZlcmFnZSA9IG5ldyBsZm8ub3BlcmF0b3IuTW92aW5nQXZlcmFnZSh7IG9yZGVyOiA1IH0pO1xuICAgKiBtb3ZpbmdBdmVyYWdlLmluaXRTdHJlYW0oeyBmcmFtZVNpemU6IDEsIGZyYW1lVHlwZTogJ3NjYWxhcicgfSk7XG4gICAqXG4gICAqIG1vdmluZ0F2ZXJhZ2UuaW5wdXRTY2FsYXIoMSk7XG4gICAqID4gMC4yXG4gICAqIG1vdmluZ0F2ZXJhZ2UuaW5wdXRTY2FsYXIoMSk7XG4gICAqID4gMC40XG4gICAqIG1vdmluZ0F2ZXJhZ2UuaW5wdXRTY2FsYXIoMSk7XG4gICAqID4gMC42XG4gICAqL1xuICBpbnB1dFNjYWxhcih2YWx1ZSkge1xuICAgIGNvbnN0IG9yZGVyID0gdGhpcy5wYXJhbXMuZ2V0KCdvcmRlcicpO1xuICAgIGNvbnN0IHJpbmdJbmRleCA9IHRoaXMucmluZ0luZGV4O1xuICAgIGNvbnN0IHJpbmdCdWZmZXIgPSB0aGlzLnJpbmdCdWZmZXI7XG4gICAgbGV0IHN1bSA9IHRoaXMuc3VtO1xuXG4gICAgc3VtIC09IHJpbmdCdWZmZXJbcmluZ0luZGV4XTtcbiAgICBzdW0gKz0gdmFsdWU7XG5cbiAgICB0aGlzLnN1bSA9IHN1bTtcbiAgICB0aGlzLnJpbmdCdWZmZXJbcmluZ0luZGV4XSA9IHZhbHVlO1xuICAgIHRoaXMucmluZ0luZGV4ID0gKHJpbmdJbmRleCArIDEpICUgb3JkZXI7XG5cbiAgICByZXR1cm4gc3VtIC8gb3JkZXI7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcihmcmFtZSkge1xuICAgIHRoaXMuaW5wdXRWZWN0b3IoZnJhbWUuZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIHRoZSBgTW92aW5nQXZlcmFnZWAgb3BlcmF0b3IgaW4gYHN0YW5kYWxvbmVgIG1vZGUgKGkuZS4gb3V0c2lkZSBvZiBhXG4gICAqIGdyYXBoKSB3aXRoIGEgYHZlY3RvcmAgaW5wdXQuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyAtIFZhbHVlcyB0byBmZWVkIHRoZSBtb3ZpbmcgYXZlcmFnZSB3aXRoLlxuICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXl9IC0gQXZlcmFnZSB2YWx1ZSBmb3IgZWFjaCBkaW1lbnNpb24uXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAgICpcbiAgICogY29uc3QgbW92aW5nQXZlcmFnZSA9IG5ldyBsZm8ub3BlcmF0b3IuTW92aW5nQXZlcmFnZSh7IG9yZGVyOiA1IH0pO1xuICAgKiBtb3ZpbmdBdmVyYWdlLmluaXRTdHJlYW0oeyBmcmFtZVNpemU6IDIsIGZyYW1lVHlwZTogJ3NjYWxhcicgfSk7XG4gICAqXG4gICAqIG1vdmluZ0F2ZXJhZ2UuaW5wdXRBcnJheShbMSwgMV0pO1xuICAgKiA+IFswLjIsIDAuMl1cbiAgICogbW92aW5nQXZlcmFnZS5pbnB1dEFycmF5KFsxLCAxXSk7XG4gICAqID4gWzAuNCwgMC40XVxuICAgKiBtb3ZpbmdBdmVyYWdlLmlucHV0QXJyYXkoWzEsIDFdKTtcbiAgICogPiBbMC42LCAwLjZdXG4gICAqL1xuICBpbnB1dFZlY3Rvcih2YWx1ZXMpIHtcbiAgICBjb25zdCBvcmRlciA9IHRoaXMucGFyYW1zLmdldCgnb3JkZXInKTtcbiAgICBjb25zdCBvdXRGcmFtZSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgcmluZ0luZGV4ID0gdGhpcy5yaW5nSW5kZXg7XG4gICAgY29uc3QgcmluZ09mZnNldCA9IHJpbmdJbmRleCAqIGZyYW1lU2l6ZTtcbiAgICBjb25zdCByaW5nQnVmZmVyID0gdGhpcy5yaW5nQnVmZmVyO1xuICAgIGNvbnN0IHN1bSA9IHRoaXMuc3VtO1xuICAgIGNvbnN0IHNjYWxlID0gMSAvIG9yZGVyO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgY29uc3QgcmluZ0J1ZmZlckluZGV4ID0gcmluZ09mZnNldCArIGk7XG4gICAgICBjb25zdCB2YWx1ZSA9IHZhbHVlc1tpXTtcbiAgICAgIGxldCBsb2NhbFN1bSA9IHN1bVtpXTtcblxuICAgICAgbG9jYWxTdW0gLT0gcmluZ0J1ZmZlcltyaW5nQnVmZmVySW5kZXhdO1xuICAgICAgbG9jYWxTdW0gKz0gdmFsdWU7XG5cbiAgICAgIHRoaXMuc3VtW2ldID0gbG9jYWxTdW07XG4gICAgICBvdXRGcmFtZVtpXSA9IGxvY2FsU3VtICogc2NhbGU7XG4gICAgICByaW5nQnVmZmVyW3JpbmdCdWZmZXJJbmRleF0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLnJpbmdJbmRleCA9IChyaW5nSW5kZXggKyAxKSAlIG9yZGVyO1xuXG4gICAgcmV0dXJuIG91dEZyYW1lO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIHRoaXMucHJlcGFyZUZyYW1lKCk7XG4gICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuXG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ29yZGVyJyk7XG4gICAgbGV0IHRpbWUgPSBmcmFtZS50aW1lO1xuICAgIC8vIHNoaWZ0IHRpbWUgdG8gdGFrZSBhY2NvdW50IG9mIHRoZSBhZGRlZCBsYXRlbmN5XG4gICAgaWYgKHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUpXG4gICAgICB0aW1lIC09ICgwLjUgKiAob3JkZXIgLSAxKSAvIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUpO1xuXG4gICAgdGhpcy5mcmFtZS50aW1lID0gdGltZTtcbiAgICB0aGlzLmZyYW1lLm1ldGFkYXRhID0gZnJhbWUubWV0YWRhdGE7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZUZyYW1lKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTW92aW5nQXZlcmFnZTtcbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBvcmRlcjoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBtaW46IDEsXG4gICAgbWF4OiAxZTksXG4gICAgZGVmYXVsdDogOSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgZmlsbDoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgbWluOiAtSW5maW5pdHksXG4gICAgbWF4OiArSW5maW5pdHksXG4gICAgZGVmYXVsdDogMCxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbn07XG5cbi8qKlxuICogQ29tcHV0ZSBhIG1vdmluZyBtZWRpYW4gb3BlcmF0aW9uIG9uIHRoZSBpbmNvbW1pbmcgZnJhbWVzIChgc2NhbGFyYCBvclxuICogYHZlY3RvcmAgdHlwZSkuIElmIHRoZSBpbnB1dCBpcyBvZiB0eXBlIHZlY3RvciwgdGhlIG1vdmluZyBtZWRpYW4gaXNcbiAqIGNvbXB1dGVkIGZvciBlYWNoIGRpbWVuc2lvbiBpbiBwYXJhbGxlbC4gSWYgdGhlIHNvdXJjZSBzYW1wbGUgcmF0ZSBpcyBkZWZpbmVkXG4gKiBmcmFtZSB0aW1lIGlzIHNoaWZ0ZWQgdG8gdGhlIG1pZGRsZSBvZiB0aGUgd2luZG93IGRlZmluZWQgYnkgdGhlIG9yZGVyLlxuICpcbiAqIF9zdXBwb3J0IGBzdGFuZGFsb25lYCB1c2FnZV9cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm9yZGVyPTldIC0gTnVtYmVyIG9mIHN1Y2Nlc3NpdmUgdmFsdWVzIGluIHdoaWNoXG4gKiAgdGhlIG1lZGlhbiBpcyBzZWFyY2hlZC4gVGhpcyB2YWx1ZSBtdXN0IGJlIG9kZC4gX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmZpbGw9MF0gLSBWYWx1ZSB0byBmaWxsIHRoZSByaW5nIGJ1ZmZlciB3aXRoIGJlZm9yZVxuICogIHRoZSBmaXJzdCBpbnB1dCBmcmFtZS4gX2R5bmFtaWMgcGFyYW1ldGVyX1xuICpcbiAqIEB0b2RvIC0gSW1wbGVtZW50IGBwcm9jZXNzU2lnbmFsYFxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NvbW1vbic7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVNpemU6IDIsXG4gKiAgIGZyYW1lVHlwZTogJ3ZlY3RvcicsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBtb3ZpbmdNZWRpYW4gPSBuZXcgbGZvLm9wZXJhdG9yLk1vdmluZ01lZGlhbih7XG4gKiAgIG9yZGVyOiA1LFxuICogICBmaWxsOiAwLFxuICogfSk7XG4gKlxuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IGRhdGE6IHRydWUgfSk7XG4gKlxuICogZXZlbnRJbi5jb25uZWN0KG1vdmluZ01lZGlhbik7XG4gKiBtb3ZpbmdNZWRpYW4uY29ubmVjdChsb2dnZXIpO1xuICpcbiAqIGV2ZW50SW4uc3RhcnQoKTtcbiAqXG4gKiBldmVudEluLnByb2Nlc3NGcmFtZShudWxsLCBbMSwgMV0pO1xuICogPiBbMCwgMF1cbiAqIGV2ZW50SW4ucHJvY2Vzc0ZyYW1lKG51bGwsIFsyLCAyXSk7XG4gKiA+IFswLCAwXVxuICogZXZlbnRJbi5wcm9jZXNzRnJhbWUobnVsbCwgWzMsIDNdKTtcbiAqID4gWzEsIDFdXG4gKiBldmVudEluLnByb2Nlc3NGcmFtZShudWxsLCBbNCwgNF0pO1xuICogPiBbMiwgMl1cbiAqIGV2ZW50SW4ucHJvY2Vzc0ZyYW1lKG51bGwsIFs1LCA1XSk7XG4gKiA+IFszLCAzXVxuICovXG5jbGFzcyBNb3ZpbmdNZWRpYW4gZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5yaW5nQnVmZmVyID0gbnVsbDtcbiAgICB0aGlzLnNvcnRlciA9IG51bGw7XG4gICAgdGhpcy5yaW5nSW5kZXggPSAwO1xuXG4gICAgdGhpcy5fZW5zdXJlT2RkT3JkZXIoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZW5zdXJlT2RkT3JkZXIoKSB7XG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnb3JkZXInKSAlIDIgPT09IDApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdmFsdWUgJHtvcmRlcn0gZm9yIHBhcmFtIFwib3JkZXJcIiAtIHNob3VsZCBiZSBvZGRgKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBvblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcykge1xuICAgIHN1cGVyLm9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKTtcblxuICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgY2FzZSAnb3JkZXInOlxuICAgICAgICB0aGlzLl9lbnN1cmVPZGRPcmRlcigpO1xuICAgICAgICB0aGlzLnByb2Nlc3NTdHJlYW1QYXJhbXMoKTtcbiAgICAgICAgdGhpcy5yZXNldFN0cmVhbSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2ZpbGwnOlxuICAgICAgICB0aGlzLnJlc2V0U3RyZWFtKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG4gICAgLy8gb3V0VHlwZSBpcyBzaW1pbGFyIHRvIGlucHV0IHR5cGVcblxuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBvcmRlciA9IHRoaXMucGFyYW1zLmdldCgnb3JkZXInKTtcblxuICAgIHRoaXMucmluZ0J1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplICogb3JkZXIpO1xuICAgIHRoaXMuc29ydEJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplICogb3JkZXIpO1xuXG4gICAgdGhpcy5taW5JbmRpY2VzID0gbmV3IFVpbnQzMkFycmF5KGZyYW1lU2l6ZSk7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHJlc2V0U3RyZWFtKCkge1xuICAgIHN1cGVyLnJlc2V0U3RyZWFtKCk7XG5cbiAgICBjb25zdCBmaWxsID0gdGhpcy5wYXJhbXMuZ2V0KCdmaWxsJyk7XG4gICAgY29uc3QgcmluZ0J1ZmZlciA9IHRoaXMucmluZ0J1ZmZlcjtcbiAgICBjb25zdCByaW5nTGVuZ3RoID0gcmluZ0J1ZmZlci5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJpbmdMZW5ndGg7IGkrKylcbiAgICAgIHRoaXMucmluZ0J1ZmZlcltpXSA9IGZpbGw7XG5cbiAgICB0aGlzLnJpbmdJbmRleCA9IDA7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NjYWxhcihmcmFtZSkge1xuICAgIHRoaXMuZnJhbWUuZGF0YVswXSA9IHRoaXMuaW5wdXRTY2FsYXIoZnJhbWUuZGF0YVswXSk7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3dzIGZvciB0aGUgdXNlIG9mIGEgYE1vdmluZ01lZGlhbmAgb3V0c2lkZSBhIGdyYXBoIChlLmcuIGluc2lkZVxuICAgKiBhbm90aGVyIG5vZGUpLCBpbiB0aGlzIGNhc2UgYHByb2Nlc3NTdHJlYW1QYXJhbXNgIGFuZCBgcmVzZXRTdHJlYW1gXG4gICAqIHNob3VsZCBiZSBjYWxsZWQgbWFudWFsbHkgb24gdGhlIG5vZGUuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSAtIFZhbHVlIHRvIGZlZWQgdGhlIG1vdmluZyBtZWRpYW4gd2l0aC5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIE1lZGlhbiB2YWx1ZS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICAgKlxuICAgKiBjb25zdCBtb3ZpbmdNZWRpYW4gPSBuZXcgTW92aW5nTWVkaWFuKHsgb3JkZXI6IDUgfSk7XG4gICAqIG1vdmluZ01lZGlhbi5pbml0U3RyZWFtKHsgZnJhbWVTaXplOiAxLCBmcmFtZVR5cGU6ICdzY2FsYXInIH0pO1xuICAgKlxuICAgKiBtb3ZpbmdNZWRpYW4uaW5wdXRTY2FsYXIoMSk7XG4gICAqID4gMFxuICAgKiBtb3ZpbmdNZWRpYW4uaW5wdXRTY2FsYXIoMik7XG4gICAqID4gMFxuICAgKiBtb3ZpbmdNZWRpYW4uaW5wdXRTY2FsYXIoMyk7XG4gICAqID4gMVxuICAgKiBtb3ZpbmdNZWRpYW4uaW5wdXRTY2FsYXIoNCk7XG4gICAqID4gMlxuICAgKi9cbiAgaW5wdXRTY2FsYXIodmFsdWUpIHtcbiAgICBjb25zdCByaW5nSW5kZXggPSB0aGlzLnJpbmdJbmRleDtcbiAgICBjb25zdCByaW5nQnVmZmVyID0gdGhpcy5yaW5nQnVmZmVyO1xuICAgIGNvbnN0IHNvcnRCdWZmZXIgPSB0aGlzLnNvcnRCdWZmZXI7XG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ29yZGVyJyk7XG4gICAgY29uc3QgbWVkaWFuSW5kZXggPSAob3JkZXIgLSAxKSAvIDI7XG4gICAgbGV0IHN0YXJ0SW5kZXggPSAwO1xuXG4gICAgcmluZ0J1ZmZlcltyaW5nSW5kZXhdID0gdmFsdWU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBtZWRpYW5JbmRleDsgaSsrKSB7XG4gICAgICBsZXQgbWluID0gK0luZmluaXR5O1xuICAgICAgbGV0IG1pbkluZGV4ID0gbnVsbDtcblxuICAgICAgZm9yIChsZXQgaiA9IHN0YXJ0SW5kZXg7IGogPCBvcmRlcjsgaisrKSB7XG4gICAgICAgIGlmIChpID09PSAwKVxuICAgICAgICAgIHNvcnRCdWZmZXJbal0gPSByaW5nQnVmZmVyW2pdO1xuXG4gICAgICAgIGlmIChzb3J0QnVmZmVyW2pdIDwgbWluKSB7XG4gICAgICAgICAgbWluID0gc29ydEJ1ZmZlcltqXTtcbiAgICAgICAgICBtaW5JbmRleCA9IGo7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gc3dhcCBtaW5JbmRleCBhbmQgc3RhcnRJbmRleFxuICAgICAgY29uc3QgY2FjaGUgPSBzb3J0QnVmZmVyW3N0YXJ0SW5kZXhdO1xuICAgICAgc29ydEJ1ZmZlcltzdGFydEluZGV4XSA9IHNvcnRCdWZmZXJbbWluSW5kZXhdO1xuICAgICAgc29ydEJ1ZmZlclttaW5JbmRleF0gPSBjYWNoZTtcblxuICAgICAgc3RhcnRJbmRleCArPSAxO1xuICAgIH1cblxuICAgIGNvbnN0IG1lZGlhbiA9IHNvcnRCdWZmZXJbbWVkaWFuSW5kZXhdO1xuICAgIHRoaXMucmluZ0luZGV4ID0gKHJpbmdJbmRleCArIDEpICUgb3JkZXI7XG5cbiAgICByZXR1cm4gbWVkaWFuO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUpIHtcbiAgICB0aGlzLmlucHV0VmVjdG9yKGZyYW1lLmRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyBmb3IgdGhlIHVzZSBvZiBhIGBNb3ZpbmdNZWRpYW5gIG91dHNpZGUgYSBncmFwaCAoZS5nLiBpbnNpZGVcbiAgICogYW5vdGhlciBub2RlKSwgaW4gdGhpcyBjYXNlIGBwcm9jZXNzU3RyZWFtUGFyYW1zYCBhbmQgYHJlc2V0U3RyZWFtYFxuICAgKiBzaG91bGQgYmUgY2FsbGVkIG1hbnVhbGx5IG9uIHRoZSBub2RlLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgLSBWYWx1ZXMgdG8gZmVlZCB0aGUgbW92aW5nIG1lZGlhbiB3aXRoLlxuICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXl9IC0gTWVkaWFuIHZhbHVlcyBmb3IgZWFjaCBkaW1lbnNpb24uXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAgICpcbiAgICogY29uc3QgbW92aW5nTWVkaWFuID0gbmV3IE1vdmluZ01lZGlhbih7IG9yZGVyOiAzLCBmaWxsOiAwIH0pO1xuICAgKiBtb3ZpbmdNZWRpYW4uaW5pdFN0cmVhbSh7IGZyYW1lU2l6ZTogMywgZnJhbWVUeXBlOiAndmVjdG9yJyB9KTtcbiAgICpcbiAgICogbW92aW5nTWVkaWFuLmlucHV0QXJyYXkoWzEsIDFdKTtcbiAgICogPiBbMCwgMF1cbiAgICogbW92aW5nTWVkaWFuLmlucHV0QXJyYXkoWzIsIDJdKTtcbiAgICogPiBbMSwgMV1cbiAgICogbW92aW5nTWVkaWFuLmlucHV0QXJyYXkoWzMsIDNdKTtcbiAgICogPiBbMiwgMl1cbiAgICovXG4gIGlucHV0VmVjdG9yKHZhbHVlcykge1xuICAgIGNvbnN0IG9yZGVyID0gdGhpcy5wYXJhbXMuZ2V0KCdvcmRlcicpO1xuICAgIGNvbnN0IHJpbmdCdWZmZXIgPSB0aGlzLnJpbmdCdWZmZXI7XG4gICAgY29uc3QgcmluZ0luZGV4ID0gdGhpcy5yaW5nSW5kZXg7XG4gICAgY29uc3Qgc29ydEJ1ZmZlciA9IHRoaXMuc29ydEJ1ZmZlcjtcbiAgICBjb25zdCBvdXRGcmFtZSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBjb25zdCBtaW5JbmRpY2VzID0gdGhpcy5taW5JbmRpY2VzO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBtZWRpYW5JbmRleCA9IE1hdGguZmxvb3Iob3JkZXIgLyAyKTtcbiAgICBsZXQgc3RhcnRJbmRleCA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBtZWRpYW5JbmRleDsgaSsrKSB7XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZnJhbWVTaXplOyBqKyspIHtcbiAgICAgICAgb3V0RnJhbWVbal0gPSArSW5maW5pdHk7XG4gICAgICAgIG1pbkluZGljZXNbal0gPSAwO1xuXG4gICAgICAgIGZvciAobGV0IGsgPSBzdGFydEluZGV4OyBrIDwgb3JkZXI7IGsrKykge1xuICAgICAgICAgIGNvbnN0IGluZGV4ID0gayAqIGZyYW1lU2l6ZSArIGo7XG5cbiAgICAgICAgICAvLyB1cGRhdGUgcmluZyBidWZmZXIgY29ycmVzcG9uZGluZyB0byBjdXJyZW50XG4gICAgICAgICAgaWYgKGsgPT09IHJpbmdJbmRleCAmJiBpID09PSAwKVxuICAgICAgICAgICAgcmluZ0J1ZmZlcltpbmRleF0gPSB2YWx1ZXNbal07XG5cbiAgICAgICAgICAvLyBjb3B5IHZhbHVlIGluIHNvcnQgYnVmZmVyIG9uIGZpcnN0IHBhc3NcbiAgICAgICAgICBpZiAoaSA9PT0gMCnCoFxuICAgICAgICAgICAgc29ydEJ1ZmZlcltpbmRleF0gPSByaW5nQnVmZmVyW2luZGV4XTtcblxuICAgICAgICAgIC8vIGZpbmQgbWluaXVtIGluIHRoZSByZW1haW5pbmcgYXJyYXlcbiAgICAgICAgICBpZiAoc29ydEJ1ZmZlcltpbmRleF0gPCBvdXRGcmFtZVtqXSkge1xuICAgICAgICAgICAgb3V0RnJhbWVbal0gPSBzb3J0QnVmZmVyW2luZGV4XTtcbiAgICAgICAgICAgIG1pbkluZGljZXNbal0gPSBpbmRleDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzd2FwIG1pbmltdW0gYW5kIGN1cmVudCBpbmRleFxuICAgICAgICBjb25zdCBzd2FwSW5kZXggPSBzdGFydEluZGV4ICogZnJhbWVTaXplICsgajtcbiAgICAgICAgY29uc3QgdiA9IHNvcnRCdWZmZXJbc3dhcEluZGV4XTtcbiAgICAgICAgc29ydEJ1ZmZlcltzd2FwSW5kZXhdID0gc29ydEJ1ZmZlclttaW5JbmRpY2VzW2pdXTtcbiAgICAgICAgc29ydEJ1ZmZlclttaW5JbmRpY2VzW2pdXSA9IHY7XG5cbiAgICAgICAgLy8gc3RvcmUgdGhpcyBtaW5pbXVtIHZhbHVlIGFzIGN1cnJlbnQgcmVzdWx0XG4gICAgICAgIG91dEZyYW1lW2pdID0gc29ydEJ1ZmZlcltzd2FwSW5kZXhdO1xuICAgICAgfVxuXG4gICAgICBzdGFydEluZGV4ICs9IDE7XG4gICAgfVxuXG4gICAgdGhpcy5yaW5nSW5kZXggPSAocmluZ0luZGV4ICsgMSkgJSBvcmRlcjtcblxuICAgIHJldHVybiB0aGlzLmZyYW1lLmRhdGE7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgdGhpcy5wcmVwcm9jZXNzRnJhbWUoKTtcbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG5cbiAgICBjb25zdCBvcmRlciA9IHRoaXMucGFyYW1zLmdldCgnb3JkZXInKTtcbiAgICBsZXQgdGltZSA9IGZyYW1lLnRpbWU7XG4gICAgLy8gc2hpZnQgdGltZSB0byB0YWtlIGFjY291bnQgb2YgdGhlIGFkZGVkIGxhdGVuY3lcbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSlcbiAgICAgIHRpbWUgLT0gKDAuNSAqIChvcmRlciAtIDEpIC8gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSk7XG5cbiAgICB0aGlzLmZyYW1lLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMuZnJhbWUubWV0YWRhdGEgPSBmcmFtZS5tZXRhZGF0YTtcblxuICAgIHRoaXMucHJvcGFnYXRlRnJhbWUodGltZSwgdGhpcy5vdXRGcmFtZSwgbWV0YWRhdGEpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vdmluZ01lZGlhbjtcbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBzdGF0ZToge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBkZWZhdWx0OiAnb24nLFxuICAgIGxpc3Q6IFsnb24nLCAnb2ZmJ10sXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG59O1xuXG4vKipcbiAqIFRoZSBPbk9mZiBvcGVyYXRvciBhbGxvd3MgdG8gc3RvcCB0aGUgcHJvcGFnYXRpb24gb2YgdGhlIHN0cmVhbSBpbiBhXG4gKiBzdWJncmFwaC4gV2hlbiBcIm9uXCIsIGZyYW1lcyBhcmUgcHJvcGFnYXRlZCwgd2hlbiBcIm9mZlwiIHRoZSBwcm9wYWdhdGlvbiBpc1xuICogc3RvcHBlZC5cbiAqXG4gKiBUaGUgYHN0cmVhbVBhcmFtc2AgcHJvcGFnYXRpb24gaXMgbmV2ZXIgYnlwYXNzZWQgc28gdGhlIHN1YnNlcXVlbnQgc3ViZ3JhcGhcbiAqIGlzIGFsd2F5cyByZWFkeSBmb3IgaW5jb21taW5nIGZyYW1lcy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnN0YXRlPSdvbiddIC0gRGVmYXVsdCBzdGF0ZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jb21tb24nO1xuICpcbiAqIGNvbnN0IGZyYW1lcyA9IFtcbiAqICAgeyB0aW1lOiAwLCBkYXRhOiBbMSwgMl0gfSxcbiAqICAgeyB0aW1lOiAxLCBkYXRhOiBbMywgNF0gfSxcbiAqICAgeyB0aW1lOiAyLCBkYXRhOiBbNSwgNl0gfSxcbiAqIF07XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBFdmVudEluKHtcbiAqICAgZnJhbWVTaXplOiAyLFxuICogICBmcmFtZVJhdGU6IDAsXG4gKiAgIGZyYW1lVHlwZTogJ3ZlY3RvcicsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBvbk9mZiA9IG5ldyBPbk9mZigpO1xuICpcbiAqIGNvbnN0IGxvZ2dlciA9IG5ldyBMb2dnZXIoeyBkYXRhOiB0cnVlIH0pO1xuICpcbiAqIGV2ZW50SW4uY29ubmVjdChvbk9mZik7XG4gKiBvbk9mZi5jb25uZWN0KGxvZ2dlcik7XG4gKlxuICogZXZlbnRJbi5zdGFydCgpO1xuICpcbiAqIGV2ZW50SW4ucHJvY2Vzc0ZyYW1lKGZyYW1lc1swXSk7XG4gKiA+IFswLCAxXVxuICpcbiAqIC8vIGJ5cGFzcyBzdWJncmFwaFxuICogb25PZmYuc2V0U3RhdGUoJ29mZicpO1xuICogZXZlbnRJbi5wcm9jZXNzRnJhbWUoZnJhbWVzWzFdKTtcbiAqXG4gKiAvLyByZS1vcGVuIHN1YmdyYXBoXG4gKiBvbk9mZi5zZXRTdGF0ZSgnb24nKTtcbiAqIGV2ZW50SW4ucHJvY2Vzc0ZyYW1lKGZyYW1lc1syXSk7XG4gKiA+IFs1LCA2XVxuICovXG5jbGFzcyBPbk9mZiBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnN0YXRlID0gdGhpcy5wYXJhbXMuZ2V0KCdzdGF0ZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgc3RhdGUgb2YgdGhlIGBPbk9mZmAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdGF0ZSAtIE5ldyBzdGF0ZSBvZiB0aGUgb3BlcmF0b3IgKGBvbmAgb3IgYG9mZmApXG4gICAqL1xuICBzZXRTdGF0ZShzdGF0ZSkge1xuICAgIGlmIChkZWZpbml0aW9ucy5zdGF0ZS5saXN0LmluZGV4T2Yoc3RhdGUpID09PSAtMSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzd2l0Y2ggc3RhdGUgdmFsdWUgXCIke3N0YXRlfVwiIFt2YWxpZCB2YWx1ZXM6IFwib25cIi9cIm9mZlwiXWApO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICB9XG5cbiAgLy8gZGVmaW5lIGFsbCBwb3NzaWJsZSBzdHJlYW0gQVBJXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2NhbGFyKCkge31cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoKSB7fVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbCgpIHt9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIGlmICh0aGlzLnN0YXRlID09PSAnb24nKSB7XG4gICAgICB0aGlzLnByZXBhcmVGcmFtZSgpO1xuXG4gICAgICB0aGlzLmZyYW1lLnRpbWUgPSBmcmFtZS50aW1lO1xuICAgICAgdGhpcy5mcmFtZS5tZXRhZGF0YSA9IGZyYW1lLm1ldGFkYXRhO1xuICAgICAgdGhpcy5mcmFtZS5kYXRhID0gZnJhbWUuZGF0YTtcblxuICAgICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBPbk9mZjtcbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5cbmNvbnN0IHNxcnQgPSBNYXRoLnNxcnQ7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBwb3dlcjoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbn07XG5cbi8qKlxuICogQ29tcHV0ZSB0aGUgUm9vdCBNZWFuIFNxdWFyZSBvZiBhIGBzaWduYWxgLlxuICpcbiAqIF9zdXBwb3J0IGBzdGFuZGFsb25lYCB1c2FnZV9cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5wb3dlcj1mYWxzZV0gLSBJZiBgdHJ1ZWAgcmVtb3ZlIHRoZSBcIlJcIiBvZiB0aGVcbiAqICBcIlJtc1wiIGFuZCByZXR1cm4gdGhlIHNxdWFyZWQgcmVzdWx0IChpLmUuIHBvd2VyKS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIC8vIGFzc3VtaW5nIHNvbWUgYEF1ZGlvQnVmZmVyYFxuICogY29uc3QgYXVkaW9JbkJ1ZmZlciA9IG5ldyBsZm8uc291cmNlLkF1ZGlvSW5CdWZmZXIoe1xuICogICBhdWRpb0J1ZmZlcjogYXVkaW9CdWZmZXIsXG4gKiAgIGZyYW1lU2l6ZTogNTEyLFxuICogfSk7XG4gKlxuICogY29uc3Qgcm1zID0gbmV3IGxmby5vcGVyYXRvci5SbXMoKTtcbiAqIGNvbnN0IGxvZ2dlciA9IG5ldyBsZm8uc2luay5Mb2dnZXIoeyBkYXRhOiB0cnVlIH0pO1xuICpcbiAqIGF1ZGlvSW5CdWZmZXIuY29ubmVjdChybXMpO1xuICogcm1zLmNvbm5lY3QobG9nZ2VyKTtcbiAqXG4gKiBhdWRpb0luQnVmZmVyLnN0YXJ0KCk7XG4gKi9cbmNsYXNzIFJtcyBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gMTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVR5cGUgPSAnc2NhbGFyJztcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5kZXNjcmlwdGlvbiA9IFsncm1zJ107XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyBmb3IgdGhlIHVzZSBvZiBhIGBSbXNgIG91dHNpZGUgYSBncmFwaCAoZS5nLiBpbnNpZGVcbiAgICogYW5vdGhlciBub2RlKS4gUmV0dXJuIHRoZSBybXMgb2YgdGhlIGdpdmVuIHNpZ25hbCBibG9jay5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNpZ25hbCAtIFNpZ25hbCBibG9jayB0byBiZSBjb21wdXRlZC5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIHJtcyBvZiB0aGUgaW5wdXQgc2lnbmFsLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gICAqXG4gICAqIGNvbnN0IHJtcyA9IG5ldyBsZm8ub3BlcmF0b3IuUm1zKCk7XG4gICAqIHJtcy5pbml0U3RyZWFtKHsgZnJhbWVUeXBlOiAnc2lnbmFsJywgZnJhbWVTaXplOiAxMDAwIH0pO1xuICAgKlxuICAgKiBjb25zdCByZXN1bHRzID0gcm1zLmlucHV0U2lnbmFsKFsuLi52YWx1ZXNdKTtcbiAgICovXG4gIGlucHV0U2lnbmFsKHNpZ25hbCkge1xuICAgIGNvbnN0IHBvd2VyID0gdGhpcy5wYXJhbXMuZ2V0KCdwb3dlcicpO1xuICAgIGNvbnN0IGxlbmd0aCA9IHNpZ25hbC5sZW5ndGg7XG4gICAgbGV0IHJtcyA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKVxuICAgICAgcm1zICs9IChzaWduYWxbaV0gKiBzaWduYWxbaV0pO1xuXG4gICAgcm1zID0gcm1zIC8gbGVuZ3RoO1xuXG4gICAgaWYgKCFwb3dlcilcbiAgICAgIHJtcyA9IHNxcnQocm1zKTtcblxuICAgIHJldHVybiBybXM7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIHRoaXMuZnJhbWUuZGF0YVswXSA9IHRoaXMuaW5wdXRTaWduYWwoZnJhbWUuZGF0YSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUm1zO1xuIiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcbmltcG9ydCBNb3ZpbmdBdmVyYWdlIGZyb20gJy4vTW92aW5nQXZlcmFnZSc7XG5cbmNvbnN0IG1pbiA9IE1hdGgubWluO1xuY29uc3QgbWF4ID0gTWF0aC5tYXg7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBsb2dJbnB1dDoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHlhbm1pYycgfSxcbiAgfSxcbiAgbWluSW5wdXQ6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDAuMDAwMDAwMDAwMDAxLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICBmaWx0ZXJPcmRlcjoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiA1LFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICB0aHJlc2hvbGQ6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDMsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5YW5taWMnIH0sXG4gIH0sXG4gIG9mZlRocmVzaG9sZDoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogLUluZmluaXR5LFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICBtaW5JbnRlcjoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogMC4wNTAsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5YW5taWMnIH0sXG4gIH0sXG4gIG1heER1cmF0aW9uOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiBJbmZpbml0eSxcbiAgICBtZXRhczogeyBraW5kOiAnZHlhbm1pYycgfSxcbiAgfSxcbn1cblxuLyoqXG4gKiBDcmVhdGUgc2VnbWVudHMgYmFzZWQgb24gYXR0YWNrcy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5sb2dJbnB1dD1mYWxzZV0gLSBBcHBseSBsb2cgb24gdGhlIGlucHV0LlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1pbklucHV0PTAuMDAwMDAwMDAwMDAxXSAtIE1pbmltdW0gdmFsdWUgdG8gdXNlIGFzXG4gKiAgaW5wdXQuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZmlsdGVyT3JkZXI9NV0gLSBPcmRlciBvZiB0aGUgaW50ZXJuYWxseSB1c2VkIG1vdmluZ1xuICogIGF2ZXJhZ2UuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMudGhyZXNob2xkPTNdIC0gVGhyZXNob2xkIHRoYXQgdHJpZ2dlcnMgYSBzZWdtZW50XG4gKiAgc3RhcnQuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMub2ZmVGhyZXNob2xkPS1JbmZpbml0eV0gLSBUaHJlc2hvbGQgdGhhdCB0cmlnZ2Vyc1xuICogIGEgc2VnbWVudCBlbmQuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWluSW50ZXI9MC4wNTBdIC0gTWluaW11bSBkZWxheSBiZXR3ZWVuIHR3byBzZW1nZW50cy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXhEdXJhdGlvbj1JbmZpbml0eV0gLSBNYXhpbXVtIGR1cmF0aW9uIG9mIGEgc2VnbWVudC5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIC8vIGFzc3VtaW5nIGEgc3RyZWFtIGZyb20gdGhlIG1pY3JvcGhvbmVcbiAqIGNvbnN0IHNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVNZWRpYVN0cmVhbVNvdXJjZShzdHJlYW0pO1xuICpcbiAqIGNvbnN0IGF1ZGlvSW5Ob2RlID0gbmV3IGxmby5zb3VyY2UuQXVkaW9Jbk5vZGUoe1xuICogICBzb3VyY2VOb2RlOiBzb3VyY2UsXG4gKiAgIGF1ZGlvQ29udGV4dDogYXVkaW9Db250ZXh0LFxuICogfSk7XG4gKlxuICogY29uc3Qgc2xpY2VyID0gbmV3IGxmby5vcGVyYXRvci5TbGljZXIoe1xuICogICBmcmFtZVNpemU6IGZyYW1lU2l6ZSxcbiAqICAgaG9wU2l6ZTogaG9wU2l6ZSxcbiAqICAgY2VudGVyZWRUaW1lVGFnczogdHJ1ZVxuICogfSk7XG4gKlxuICogY29uc3QgcG93ZXIgPSBuZXcgbGZvLm9wZXJhdG9yLlJNUyh7XG4gKiAgIHBvd2VyOiB0cnVlLFxuICogfSk7XG4gKlxuICogY29uc3Qgc2VnbWVudGVyID0gbmV3IGxmby5vcGVyYXRvci5TZWdtZW50ZXIoe1xuICogICBsb2dJbnB1dDogdHJ1ZSxcbiAqICAgZmlsdGVyT3JkZXI6IDUsXG4gKiAgIHRocmVzaG9sZDogMyxcbiAqICAgb2ZmVGhyZXNob2xkOiAtSW5maW5pdHksXG4gKiAgIG1pbkludGVyOiAwLjA1MCxcbiAqICAgbWF4RHVyYXRpb246IDAuMDUwLFxuICogfSk7XG4gKlxuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IHRpbWU6IHRydWUgfSk7XG4gKlxuICogYXVkaW9Jbk5vZGUuY29ubmVjdChzbGljZXIpO1xuICogc2xpY2VyLmNvbm5lY3QocG93ZXIpO1xuICogcG93ZXIuY29ubmVjdChzZWdtZW50ZXIpO1xuICogc2VnbWVudGVyLmNvbm5lY3QobG9nZ2VyKTtcbiAqXG4gKiBhdWRpb0luTm9kZS5zdGFydCgpO1xuICovXG5jbGFzcyBTZWdtZW50ZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuaW5zaWRlU2VnbWVudCA9IGZhbHNlO1xuICAgIHRoaXMub25zZXRUaW1lID0gLUluZmluaXR5O1xuXG4gICAgLy8gc3RhdHNcbiAgICB0aGlzLm1pbiA9IEluZmluaXR5O1xuICAgIHRoaXMubWF4ID0gLUluZmluaXR5O1xuICAgIHRoaXMuc3VtID0gMDtcbiAgICB0aGlzLnN1bU9mU3F1YXJlcyA9IDA7XG4gICAgdGhpcy5jb3VudCA9IDA7XG5cbiAgICBjb25zdCBtaW5JbnB1dCA9IHRoaXMucGFyYW1zLmdldCgnbWluSW5wdXQnKTtcbiAgICBsZXQgZmlsbCA9IG1pbklucHV0O1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnbG9nSW5wdXQnKSAmJiBtaW5JbnB1dCA+IDApXG4gICAgICBmaWxsID0gTWF0aC5sb2cobWluSW5wdXQpO1xuXG4gICAgdGhpcy5tb3ZpbmdBdmVyYWdlID0gbmV3IE1vdmluZ0F2ZXJhZ2Uoe1xuICAgICAgb3JkZXI6IHRoaXMucGFyYW1zLmdldCgnZmlsdGVyT3JkZXInKSxcbiAgICAgIGZpbGw6IGZpbGwsXG4gICAgfSk7XG5cbiAgICB0aGlzLmxhc3RNdmF2cmcgPSBmaWxsO1xuICB9XG5cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpIHtcbiAgICBzdXBlci5vblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcyk7XG5cbiAgICBpZiAobmFtZSA9PT0gJ2ZpbHRlck9yZGVyJylcbiAgICAgIHRoaXMubW92aW5nQXZlcmFnZS5wYXJhbXMuc2V0KCdvcmRlcicsIHZhbHVlKTtcbiAgfVxuXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSA9ICd2ZWN0b3InO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IDU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gMDtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5kZXNjcmlwdGlvbiA9IFsnZHVyYXRpb24nLCAnbWluJywgJ21heCcsICdtZWFuJywgJ3N0ZGRldiddO1xuXG5cbiAgICB0aGlzLm1vdmluZ0F2ZXJhZ2UuaW5pdFN0cmVhbShwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICByZXNldFN0cmVhbSgpIHtcbiAgICBzdXBlci5yZXNldFN0cmVhbSgpO1xuICAgIHRoaXMubW92aW5nQXZlcmFnZS5yZXNldFN0cmVhbSgpO1xuICAgIHRoaXMucmVzZXRTZWdtZW50KCk7XG4gIH1cblxuICBmaW5hbGl6ZVN0cmVhbShlbmRUaW1lKSB7XG4gICAgaWYgKHRoaXMuaW5zaWRlU2VnbWVudClcbiAgICAgIHRoaXMub3V0cHV0U2VnbWVudChlbmRUaW1lKTtcblxuICAgIHN1cGVyLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICB9XG5cbiAgcmVzZXRTZWdtZW50KCkge1xuICAgIHRoaXMuaW5zaWRlU2VnbWVudCA9IGZhbHNlO1xuICAgIHRoaXMub25zZXRUaW1lID0gLUluZmluaXR5O1xuICAgIC8vIHN0YXRzXG4gICAgdGhpcy5taW4gPSBJbmZpbml0eTtcbiAgICB0aGlzLm1heCA9IC1JbmZpbml0eTtcbiAgICB0aGlzLnN1bSA9IDA7XG4gICAgdGhpcy5zdW1PZlNxdWFyZXMgPSAwO1xuICAgIHRoaXMuY291bnQgPSAwO1xuICB9XG5cbiAgb3V0cHV0U2VnbWVudChlbmRUaW1lKSB7XG4gICAgY29uc3Qgb3V0RGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBvdXREYXRhWzBdID0gZW5kVGltZSAtIHRoaXMub25zZXRUaW1lO1xuICAgIG91dERhdGFbMV0gPSB0aGlzLm1pbjtcbiAgICBvdXREYXRhWzJdID0gdGhpcy5tYXg7XG5cbiAgICBjb25zdCBub3JtID0gMSAvIHRoaXMuY291bnQ7XG4gICAgY29uc3QgbWVhbiA9IHRoaXMuc3VtICogbm9ybTtcbiAgICBjb25zdCBtZWFuT2ZTcXVhcmUgPSB0aGlzLnN1bU9mU3F1YXJlcyAqIG5vcm07XG4gICAgY29uc3Qgc3F1YXJlT2ZtZWFuID0gbWVhbiAqIG1lYW47XG5cbiAgICBvdXREYXRhWzNdID0gbWVhbjtcbiAgICBvdXREYXRhWzRdID0gMDtcblxuICAgIGlmIChtZWFuT2ZTcXVhcmUgPiBzcXVhcmVPZm1lYW4pXG4gICAgICBvdXREYXRhWzRdID0gTWF0aC5zcXJ0KG1lYW5PZlNxdWFyZSAtIHNxdWFyZU9mbWVhbik7XG5cbiAgICB0aGlzLmZyYW1lLnRpbWUgPSB0aGlzLm9uc2V0VGltZTtcblxuICAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcbiAgfVxuXG4gIHByb2Nlc3NTaWduYWwoZnJhbWUpIHtcbiAgICBjb25zdCBsb2dJbnB1dCA9IHRoaXMucGFyYW1zLmdldCgnbG9nSW5wdXQnKTtcbiAgICBjb25zdCBtaW5JbnB1dCA9IHRoaXMucGFyYW1zLmdldCgnbWluSW5wdXQnKTtcbiAgICBjb25zdCB0aHJlc2hvbGQgPSB0aGlzLnBhcmFtcy5nZXQoJ3RocmVzaG9sZCcpO1xuICAgIGNvbnN0IG1pbkludGVyID0gdGhpcy5wYXJhbXMuZ2V0KCdtaW5JbnRlcicpO1xuICAgIGNvbnN0IG1heER1cmF0aW9uID0gdGhpcy5wYXJhbXMuZ2V0KCdtYXhEdXJhdGlvbicpO1xuICAgIGNvbnN0IG9mZlRocmVzaG9sZCA9IHRoaXMucGFyYW1zLmdldCgnb2ZmVGhyZXNob2xkJyk7XG4gICAgY29uc3QgcmF3VmFsdWUgPSBmcmFtZS5kYXRhWzBdO1xuICAgIGNvbnN0IHRpbWUgPSBmcmFtZS50aW1lO1xuICAgIGxldCB2YWx1ZSA9IE1hdGgubWF4KHJhd1ZhbHVlLCBtaW5JbnB1dCk7XG5cbiAgICBpZiAobG9nSW5wdXQpXG4gICAgICB2YWx1ZSA9IE1hdGgubG9nKHZhbHVlKTtcblxuICAgIGNvbnN0IGRpZmYgPSB2YWx1ZSAtIHRoaXMubGFzdE12YXZyZztcbiAgICB0aGlzLmxhc3RNdmF2cmcgPSB0aGlzLm1vdmluZ0F2ZXJhZ2UuaW5wdXRTY2FsYXIodmFsdWUpO1xuXG4gICAgLy8gdXBkYXRlIGZyYW1lIG1ldGFkYXRhXG4gICAgdGhpcy5mcmFtZS5tZXRhZGF0YSA9IGZyYW1lLm1ldGFkYXRhO1xuXG4gICAgaWYgKGRpZmYgPiB0aHJlc2hvbGQgJiYgdGltZSAtIHRoaXMub25zZXRUaW1lID4gbWluSW50ZXIpIHtcbiAgICAgIGlmICh0aGlzLmluc2lkZVNlZ21lbnQpXG4gICAgICAgIHRoaXMub3V0cHV0U2VnbWVudCh0aW1lKTtcblxuICAgICAgLy8gc3RhcnQgc2VnbWVudFxuICAgICAgdGhpcy5pbnNpZGVTZWdtZW50ID0gdHJ1ZTtcbiAgICAgIHRoaXMub25zZXRUaW1lID0gdGltZTtcbiAgICAgIHRoaXMubWF4ID0gLUluZmluaXR5O1xuICAgIH1cblxuICAgIGlmICh0aGlzLmluc2lkZVNlZ21lbnQpIHtcbiAgICAgIHRoaXMubWluID0gbWluKHRoaXMubWluLCByYXdWYWx1ZSk7XG4gICAgICB0aGlzLm1heCA9IG1heCh0aGlzLm1heCwgcmF3VmFsdWUpO1xuICAgICAgdGhpcy5zdW0gKz0gcmF3VmFsdWU7XG4gICAgICB0aGlzLnN1bU9mU3F1YXJlcyArPSByYXdWYWx1ZSAqIHJhd1ZhbHVlO1xuICAgICAgdGhpcy5jb3VudCsrO1xuXG4gICAgICBpZiAodGltZSAtIHRoaXMub25zZXRUaW1lID49IG1heER1cmF0aW9uIHx8IHZhbHVlIDw9IG9mZlRocmVzaG9sZCkge1xuICAgICAgICB0aGlzLm91dHB1dFNlZ21lbnQodGltZSk7XG4gICAgICAgIHRoaXMuaW5zaWRlU2VnbWVudCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIHRoaXMucHJlcGFyZUZyYW1lKCk7XG4gICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuICAgIC8vIGRvIG5vdCBwcm9wYWdhdGUgaGVyZSBhcyB0aGUgZnJhbWVSYXRlIGlzIG5vdyB6ZXJvXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VnbWVudGVyO1xuIiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGluZGV4OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgaW5kaWNlczoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfVxufTtcblxuLyoqXG4gKiBTZWxlY3Qgb25lIG9yIHNldmVyYWwgaW5kaWNlcyBmcm9tIGEgYHZlY3RvcmAgaW5wdXQuIElmIG9ubHkgb25lIGluZGV4IGlzXG4gKiBzZWxlY3RlZCwgdGhlIG91dHB1dCB3aWxsIGJlIG9mIHR5cGUgYHNjYWxhcmAsIG90aGVyd2lzZSB0aGUgb3V0cHV0IHdpbGxcbiAqIGJlIGEgdmVjdG9yIGNvbnRhaW5pbmcgdGhlIHNlbGVjdGVkIGluZGljZXMuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24ub3BlcmF0b3JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgdmFsdWVzLlxuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMuaW5kZXggLSBJbmRleCB0byBzZWxlY3QgZnJvbSB0aGUgaW5wdXQgZnJhbWUuXG4gKiBAcGFyYW0ge0FycmF5PE51bWJlcj59IG9wdGlvbnMuaW5kaWNlcyAtIEluZGljZXMgdG8gc2VsZWN0IGZyb20gdGhlIGlucHV0XG4gKiAgZnJhbWUsIGlmIGRlZmluZWQsIHRha2UgcHJlY2VkYW5jZSBvdmVyIGBvcHRpb24uaW5kZXhgLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NvbW1vbic7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVR5cGU6ICd2ZWN0b3InLFxuICogICBmcmFtZVNpemU6IDMsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBzZWxlY3QgPSBuZXcgbGZvLm9wZXJhdG9yLlNlbGVjdCh7XG4gKiAgIGluZGV4OiAxLFxuICogfSk7XG4gKlxuICogZXZlbnRJbi5zdGFydCgpO1xuICogZXZlbnRJbi5wcm9jZXNzKDAsIFswLCAxLCAyXSk7XG4gKiA+IDFcbiAqIGV2ZW50SW4ucHJvY2VzcygwLCBbMywgNCwgNV0pO1xuICogPiA0XG4gKi9cbmNsYXNzIFNlbGVjdCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnBhcmFtcy5nZXQoJ2luZGV4Jyk7XG4gICAgY29uc3QgaW5kaWNlcyA9IHRoaXMucGFyYW1zLmdldCgnaW5kaWNlcycpO1xuXG4gICAgbGV0IG1heCA9IChpbmRpY2VzICE9PSBudWxsKSA/ICBNYXRoLm1heC5hcHBseShudWxsLCBpbmRpY2VzKSA6IGluZGV4O1xuXG4gICAgaWYgKG1heCA+PSBwcmV2U3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzZWxlY3QgaW5kZXggXCIke21heH1cImApO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gKGluZGljZXMgIT09IG51bGwpID8gJ3ZlY3RvcicgOiAnc2NhbGFyJztcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSAoaW5kaWNlcyAhPT0gbnVsbCkgPyBpbmRpY2VzLmxlbmd0aCA6IDE7XG5cbiAgICB0aGlzLnNlbGVjdCA9IChpbmRpY2VzICE9PSBudWxsKSA/IGluZGljZXMgOiBbaW5kZXhdO1xuXG4gICAgLy8gc3RlYWwgZGVzY3JpcHRpb24oKSBmcm9tIHBhcmVudFxuICAgIGlmIChwcmV2U3RyZWFtUGFyYW1zLmRlc2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnNlbGVjdC5mb3JFYWNoKCh2YWwsIGluZGV4KSA9PiB7XG4gICAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmRlc2NyaXB0aW9uW2luZGV4XSA9IHByZXZTdHJlYW1QYXJhbXMuZGVzY3JpcHRpb25bdmFsXTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcihmcmFtZSkge1xuICAgIGNvbnN0IGRhdGEgPSBmcmFtZS5kYXRhO1xuICAgIGNvbnN0IG91dERhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3Qgc2VsZWN0ID0gdGhpcy5zZWxlY3Q7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdC5sZW5ndGg7IGkrKylcbiAgICAgIG91dERhdGFbaV0gPSBkYXRhW3NlbGVjdFtpXV07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0O1xuIiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGZyYW1lU2l6ZToge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiA1MTIsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgaG9wU2l6ZTogeyAvLyBzaG91bGQgYmUgbnVsbGFibGVcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBjZW50ZXJlZFRpbWVUYWdzOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICB9XG59XG5cbi8qKlxuICogQ2hhbmdlIHRoZSBgZnJhbWVTaXplYCBhbmQgYGhvcFNpemVgIG9mIGEgYHNpZ25hbGAgaW5wdXQgYWNjb3JkaW5nIHRvXG4gKiB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAqIFRoaXMgb3BlcmF0b3IgdXBkYXRlcyB0aGUgc3RyZWFtIHBhcmFtZXRlcnMgYWNjb3JkaW5nIHRvIGl0cyBjb25maWd1cmF0aW9uLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZnJhbWVTaXplPTUxMl0gLSBGcmFtZSBzaXplIG9mIHRoZSBvdXRwdXQgc2lnbmFsLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmhvcFNpemU9bnVsbF0gLSBOdW1iZXIgb2Ygc2FtcGxlcyBiZXR3ZWVuIHR3b1xuICogIGNvbnNlY3V0aXZlIGZyYW1lcy4gSWYgbnVsbCwgYGhvcFNpemVgIGlzIHNldCB0byBgZnJhbWVTaXplYC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuY2VudGVyZWRUaW1lVGFnc10gLSBNb3ZlIHRoZSB0aW1lIHRhZyB0byB0aGUgbWlkZGxlXG4gKiAgb2YgdGhlIGZyYW1lLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NvbW1vbic7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVR5cGU6ICdzaWduYWwnLFxuICogICBmcmFtZVNpemU6IDEwLFxuICogICBzYW1wbGVSYXRlOiAyLFxuICogfSk7XG4gKlxuICogY29uc3Qgc2xpY2VyID0gbmV3IGxmby5vcGVyYXRvci5TbGljZXIoe1xuICogICBmcmFtZVNpemU6IDQsXG4gKiAgIGhvcFNpemU6IDJcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGxvZ2dlciA9IG5ldyBsZm8uc2luay5Mb2dnZXIoeyB0aW1lOiB0cnVlLCBkYXRhOiB0cnVlIH0pO1xuICpcbiAqIGV2ZW50SW4uY29ubmVjdChzbGljZXIpO1xuICogc2xpY2VyLmNvbm5lY3QobG9nZ2VyKTtcbiAqIGV2ZW50SW4uc3RhcnQoKTtcbiAqXG4gKiBldmVudEluLnByb2Nlc3MoMCwgWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDldKTtcbiAqID4geyB0aW1lOiAwLCBkYXRhOiBbMCwgMSwgMiwgM10gfVxuICogPiB7IHRpbWU6IDEsIGRhdGE6IFsyLCAzLCA0LCA1XSB9XG4gKiA+IHsgdGltZTogMiwgZGF0YTogWzQsIDUsIDYsIDddIH1cbiAqID4geyB0aW1lOiAzLCBkYXRhOiBbNiwgNywgOCwgOV0gfVxuICovXG5jbGFzcyBTbGljZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgaG9wU2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnaG9wU2l6ZScpO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnZnJhbWVTaXplJyk7XG5cbiAgICBpZiAoIWhvcFNpemUpXG4gICAgICB0aGlzLnBhcmFtcy5zZXQoJ2hvcFNpemUnLCBmcmFtZVNpemUpO1xuXG4gICAgdGhpcy5wYXJhbXMuYWRkTGlzdGVuZXIodGhpcy5vblBhcmFtVXBkYXRlLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5mcmFtZUluZGV4ID0gMDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICBjb25zdCBob3BTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdob3BTaXplJyk7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdmcmFtZVNpemUnKTtcblxuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IGZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSBwcmV2U3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgLyBob3BTaXplO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICByZXNldFN0cmVhbSgpIHtcbiAgICBzdXBlci5yZXNldFN0cmVhbSgpO1xuICAgIHRoaXMuZnJhbWVJbmRleCA9IDA7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgZmluYWxpemVTdHJlYW0oZW5kVGltZSkge1xuICAgIGlmICh0aGlzLmZyYW1lSW5kZXggPiAwKSB7XG4gICAgICBjb25zdCBmcmFtZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGU7XG4gICAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgICBjb25zdCBkYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgICAgLy8gc2V0IHRoZSB0aW1lIG9mIHRoZSBsYXN0IGZyYW1lXG4gICAgICB0aGlzLmZyYW1lLnRpbWUgKz0gKDEgLyBmcmFtZVJhdGUpO1xuXG4gICAgICBmb3IgKGxldCBpID0gdGhpcy5mcmFtZUluZGV4OyBpIDwgZnJhbWVTaXplOyBpKyspXG4gICAgICAgIGRhdGFbaV0gPSAwO1xuXG4gICAgICB0aGlzLnByb3BhZ2F0ZUZyYW1lKCk7XG4gICAgfVxuXG4gICAgc3VwZXIuZmluYWxpemVTdHJlYW0oZW5kVGltZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgdGhpcy5wcmVwYXJlRnJhbWUoKTtcbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIGNvbnN0IHRpbWUgPSBmcmFtZS50aW1lO1xuICAgIGNvbnN0IGJsb2NrID0gZnJhbWUuZGF0YTtcbiAgICBjb25zdCBtZXRhZGF0YSA9IGZyYW1lLm1ldGFkYXRhO1xuXG4gICAgY29uc3QgY2VudGVyZWRUaW1lVGFncyA9IHRoaXMucGFyYW1zLmdldCgnY2VudGVyZWRUaW1lVGFncycpO1xuICAgIGNvbnN0IGhvcFNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ2hvcFNpemUnKTtcbiAgICBjb25zdCBvdXRGcmFtZSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG4gICAgY29uc3Qgc2FtcGxlUGVyaW9kID0gMSAvIHNhbXBsZVJhdGU7XG4gICAgY29uc3QgYmxvY2tTaXplID0gYmxvY2subGVuZ3RoO1xuXG4gICAgbGV0IGZyYW1lSW5kZXggPSB0aGlzLmZyYW1lSW5kZXg7XG4gICAgbGV0IGJsb2NrSW5kZXggPSAwO1xuXG4gICAgd2hpbGUgKGJsb2NrSW5kZXggPCBibG9ja1NpemUpIHtcbiAgICAgIGxldCBudW1Ta2lwID0gMDtcblxuICAgICAgLy8gc2tpcCBibG9jayBzYW1wbGVzIGZvciBuZWdhdGl2ZSBmcmFtZUluZGV4IChmcmFtZVNpemUgPCBob3BTaXplKVxuICAgICAgaWYgKGZyYW1lSW5kZXggPCAwKSB7XG4gICAgICAgIG51bVNraXAgPSAtZnJhbWVJbmRleDtcbiAgICAgICAgZnJhbWVJbmRleCA9IDA7IC8vIHJlc2V0IGBmcmFtZUluZGV4YFxuICAgICAgfVxuXG4gICAgICBpZiAobnVtU2tpcCA8IGJsb2NrU2l6ZSkge1xuICAgICAgICBibG9ja0luZGV4ICs9IG51bVNraXA7IC8vIHNraXAgYmxvY2sgc2VnbWVudFxuICAgICAgICAvLyBjYW4gY29weSBhbGwgdGhlIHJlc3Qgb2YgdGhlIGluY29taW5nIGJsb2NrXG4gICAgICAgIGxldCBudW1Db3B5ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDtcbiAgICAgICAgLy8gY29ubm90IGNvcHkgbW9yZSB0aGFuIHdoYXQgZml0cyBpbnRvIHRoZSBmcmFtZVxuICAgICAgICBjb25zdCBtYXhDb3B5ID0gZnJhbWVTaXplIC0gZnJhbWVJbmRleDtcblxuICAgICAgICBpZiAobnVtQ29weSA+PSBtYXhDb3B5KVxuICAgICAgICAgIG51bUNvcHkgPSBtYXhDb3B5O1xuXG4gICAgICAgIC8vIGNvcHkgYmxvY2sgc2VnbWVudCBpbnRvIGZyYW1lXG4gICAgICAgIGNvbnN0IGNvcHkgPSBibG9jay5zdWJhcnJheShibG9ja0luZGV4LCBibG9ja0luZGV4ICsgbnVtQ29weSk7XG4gICAgICAgIG91dEZyYW1lLnNldChjb3B5LCBmcmFtZUluZGV4KTtcbiAgICAgICAgLy8gYWR2YW5jZSBibG9jayBhbmQgZnJhbWUgaW5kZXhcbiAgICAgICAgYmxvY2tJbmRleCArPSBudW1Db3B5O1xuICAgICAgICBmcmFtZUluZGV4ICs9IG51bUNvcHk7XG5cbiAgICAgICAgLy8gc2VuZCBmcmFtZSB3aGVuIGNvbXBsZXRlZFxuICAgICAgICBpZiAoZnJhbWVJbmRleCA9PT0gZnJhbWVTaXplKSB7XG4gICAgICAgICAgLy8gZGVmaW5lIHRpbWUgdGFnIGZvciB0aGUgb3V0RnJhbWUgYWNjb3JkaW5nIHRvIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICBpZiAoY2VudGVyZWRUaW1lVGFncylcbiAgICAgICAgICAgIHRoaXMuZnJhbWUudGltZSA9IHRpbWUgKyAoYmxvY2tJbmRleCAtIGZyYW1lU2l6ZSAvIDIpICogc2FtcGxlUGVyaW9kO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuZnJhbWUudGltZSA9IHRpbWUgKyAoYmxvY2tJbmRleCAtIGZyYW1lU2l6ZSkgKiBzYW1wbGVQZXJpb2Q7XG5cbiAgICAgICAgICB0aGlzLmZyYW1lLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgICAgLy8gZm9yd2FyZCB0byBuZXh0IG5vZGVzXG4gICAgICAgICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuXG4gICAgICAgICAgLy8gc2hpZnQgZnJhbWUgbGVmdFxuICAgICAgICAgIGlmIChob3BTaXplIDwgZnJhbWVTaXplKVxuICAgICAgICAgICAgb3V0RnJhbWUuc2V0KG91dEZyYW1lLnN1YmFycmF5KGhvcFNpemUsIGZyYW1lU2l6ZSksIDApO1xuXG4gICAgICAgICAgZnJhbWVJbmRleCAtPSBob3BTaXplOyAvLyBob3AgZm9yd2FyZFxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBza2lwIGVudGlyZSBibG9ja1xuICAgICAgICBjb25zdCBibG9ja1Jlc3QgPSBibG9ja1NpemUgLSBibG9ja0luZGV4O1xuICAgICAgICBmcmFtZUluZGV4ICs9IGJsb2NrUmVzdDtcbiAgICAgICAgYmxvY2tJbmRleCArPSBibG9ja1Jlc3Q7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5mcmFtZUluZGV4ID0gZnJhbWVJbmRleDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTbGljZXI7XG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuXG5jb25zdCBjZWlsID0gTWF0aC5jZWlsO1xuXG4vKipcbiAqIHBhcGVyOiBodHRwOi8vcmVjaGVyY2hlLmlyY2FtLmZyL2VxdWlwZXMvcGNtL2NoZXZlaWduL3Bzcy8yMDAyX0pBU0FfWUlOLnBkZlxuICogaW1wbGVtZW50YXRpb24gYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2FzaG9rZmVybmFuZGV6L1lpbi1QaXRjaC1UcmFja2luZ1xuICogQHByaXZhdGVcbiAqL1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgdGhyZXNob2xkOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiAwLjEsIC8vIGRlZmF1bHQgZnJvbSBwYXBlclxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIGRvd25TYW1wbGluZ0V4cDogeyAvLyBkb3duc2FtcGxpbmcgZmFjdG9yXG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDIsXG4gICAgbWluOiAwLFxuICAgIG1heDogMyxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBtaW5GcmVxOiB7IC8vXG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiA2MCwgLy8gbWVhbiA3MzUgc2FtcGxlc1xuICAgIG1pbjogMCxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxufVxuXG4vKipcbiAqIFlpbiBmdW5kYW1lbnRhbCBmcmVxdWVuY3kgZXN0aW1hdG9yLCBiYXNlZCBvbiBhbGdvcml0aG0gZGVzY3JpYmVkIGluXG4gKiBbWUlOLCBhIGZ1bmRhbWVudGFsIGZyZXF1ZW5jeSBlc3RpbWF0b3IgZm9yIHNwZWVjaCBhbmQgbXVzaWNdKGh0dHA6Ly9yZWNoZXJjaGUuaXJjYW0uZnIvZXF1aXBlcy9wY20vY2hldmVpZ24vcHNzLzIwMDJfSkFTQV9ZSU4ucGRmKVxuICogYnkgQ2hldmVpZ25lIGFuZCBLYXdhaGFyYS5cbiAqIE9uIGVhY2ggZnJhbWUsIHRoaXMgb3BlcmF0b3IgcHJvcGFnYXRlIGEgdmVjdG9yIGNvbnRhaW5pbmcgdGhlIGZvbGxvd2luZ1xuICogdmFsdWVzOiBgZnJlcXVlbmN5YCwgYHByb2JhYmlsaXR5YC5cbiAqXG4gKiBGb3IgZ29vZCByZXN1bHRzIHRoZSBpbnB1dCBmcmFtZSBzaXplIHNob3VsZCBiZSBsYXJnZSAoMTAyNCBvciAyMDQ4KS5cbiAqXG4gKiBfc3VwcG9ydCBgc3RhbmRhbG9uZWAgdXNhZ2VfXG4gKlxuICogQG5vdGUgLSBJbiBub2RlIGZvciBhIGZyYW1lIG9mIDIwNDggc2FtcGxlcywgYXZlcmFnZSBjb21wdXRhdGlvbiB0aW1lIGlzOlxuICogICAgICAgICAwLjAwMDE2NzQyMjgzMzM5OTkzMzg5IHNlY29uZC5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnRocmVzaG9sZD0wLjFdIC0gQWJzb2x1dGUgdGhyZXNob2xkIHRvIHRlc3QgdGhlXG4gKiAgbm9ybWFsaXplZCBkaWZmZXJlbmNlIChzZWUgcGFwZXIgZm9yIG1vcmUgaW5mb3JtYXRpb25zKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5kb3duU2FtcGxpbmdFeHA9Ml0gLSBEb3duIHNhbXBsZSB0aGUgaW5wdXQgZnJhbWUgYnlcbiAqICBhIGZhY3RvciBvZiAyIGF0IHRoZSBwb3dlciBvZiBgZG93blNhbXBsaW5nRXhwYCAobWluPTAgYW5kIG1heD0zKSBmb3JcbiAqICBwZXJmb3JtYW5jZSBpbXByb3ZlbWVudHMuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWluRnJlcT02MF0gLSBNaW5pbXVtIGZyZXF1ZW5jeSB0aGUgb3BlcmF0b3IgY2FuXG4gKiAgc2VhcmNoIGZvci4gVGhpcyBwYXJhbWV0ZXIgZGVmaW5lcyB0aGUgc2l6ZSBvZiB0aGUgYXV0b2NvcnJlbGF0aW9uIHBlcmZvcm1lZFxuICogIG9uIHRoZSBzaWduYWwsIHRoZSBpbnB1dCBmcmFtZSBzaXplIHNob3VsZCBiZSBhcm91bmQgMiB0aW1lIHRoaXMgc2l6ZSBmb3JcbiAqICBnb29kIHJlc3VsdHMgKGkuZS4gYGlucHV0RnJhbWVTaXplIOKJiCAyICogKHNhbXBsaW5nUmF0ZSAvIG1pbkZyZXEpYCkuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiAvLyBhc3N1bWluZyBzb21lIEF1ZGlvQnVmZmVyXG4gKiBjb25zdCBzb3VyY2UgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luQnVmZmVyKHtcbiAqICAgYXVkaW9CdWZmZXI6IGF1ZGlvQnVmZmVyLFxuICogfSk7XG4gKlxuICogY29uc3Qgc2xpY2VyID0gbmV3IGxmby5vcGVyYXRvci5TbGljZXIoe1xuICogICBmcmFtZVNpemU6IDIwNDgsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCB5aW4gPSBuZXcgbGZvLm9wZXJhdG9yLllpbigpO1xuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IGRhdGE6IHRydWUgfSk7XG4gKlxuICogc291cmNlLmNvbm5lY3Qoc2xpY2VyKTtcbiAqIHNsaWNlci5jb25uZWN0KHlpbik7XG4gKiB5aW4uY29ubmVjdChsb2dnZXIpO1xuICpcbiAqIHNvdXJjZS5zdGFydCgpO1xuICovXG5jbGFzcyBZaW4gZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMucHJvYmFiaWxpdHkgPSAwO1xuICAgIHRoaXMucGl0Y2ggPSAtMTtcblxuICAgIHRoaXMudGVzdCA9IDA7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2Rvd25zYW1wbGUoaW5wdXQsIHNpemUsIG91dHB1dCwgZG93blNhbXBsaW5nRXhwKSB7XG4gICAgY29uc3Qgb3V0cHV0U2l6ZSA9IHNpemUgPj4gZG93blNhbXBsaW5nRXhwO1xuICAgIGxldCBpLCBqO1xuXG4gICAgc3dpdGNoIChkb3duU2FtcGxpbmdFeHApIHtcbiAgICAgIGNhc2UgMDogLy8gbm8gZG93biBzYW1wbGluZ1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc2l6ZTsgaSsrKVxuICAgICAgICAgIG91dHB1dFtpXSA9IGlucHV0W2ldO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICBmb3IgKGkgPSAwLCBqID0gMDsgaSA8IG91dHB1dFNpemU7IGkrKywgaiArPSAyKVxuICAgICAgICAgIG91dHB1dFtpXSA9IDAuNSAqIChpbnB1dFtqXSArIGlucHV0W2ogKyAxXSk7XG5cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgZm9yIChpID0gMCwgaiA9IDA7IGkgPCBvdXRwdXRTaXplOyBpKyssIGogKz0gNClcbiAgICAgICAgICBvdXRwdXRbaV0gPSAwLjI1ICogKGlucHV0W2pdICsgaW5wdXRbaiArIDFdICsgaW5wdXRbaiArIDJdICsgaW5wdXRbaiArIDNdKTtcblxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgZm9yIChpID0gMCwgaiA9IDA7IGkgPCBvdXRwdXRTaXplOyBpKyssIGogKz0gOClcbiAgICAgICAgICBvdXRwdXRbaV0gPSAwLjEyNSAqIChpbnB1dFtqXSArIGlucHV0W2ogKyAxXSArIGlucHV0W2ogKyAyXSArIGlucHV0W2ogKyAzXSArIGlucHV0W2ogKyA0XSArIGlucHV0W2ogKyA1XSArIGlucHV0W2ogKyA2XSArIGlucHV0W2ogKyA3XSk7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dFNpemU7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3ZlY3Rvcic7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gMjtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5kZXNjcmlwdGlvbiA9IFsnZnJlcXVlbmN5JywgJ2NvbmZpZGVuY2UnXTtcblxuICAgIHRoaXMuaW5wdXRGcmFtZVNpemUgPSBwcmV2U3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICAvLyBoYW5kbGUgcGFyYW1zXG4gICAgY29uc3Qgc291cmNlU2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG4gICAgY29uc3QgZG93blNhbXBsaW5nRXhwID0gdGhpcy5wYXJhbXMuZ2V0KCdkb3duU2FtcGxpbmdFeHAnKTtcbiAgICBjb25zdCBkb3duRmFjdG9yID0gMSA8PCBkb3duU2FtcGxpbmdFeHA7IC8vIDJeblxuICAgIGNvbnN0IGRvd25TUiA9IHNvdXJjZVNhbXBsZVJhdGUgLyBkb3duRmFjdG9yO1xuICAgIGNvbnN0IGRvd25GcmFtZVNpemUgPSB0aGlzLmlucHV0RnJhbWVTaXplIC8gZG93bkZhY3RvcjsgLy8gbl90aWNrX2Rvd24gLy8gMSAvIDJeblxuXG4gICAgY29uc3QgbWluRnJlcSA9IHRoaXMucGFyYW1zLmdldCgnbWluRnJlcScpO1xuICAgIC8vIGxpbWl0IG1pbiBmcmVxLCBjZi4gcGFwZXIgSVYuIHNlbnNpdGl2aXR5IHRvIHBhcmFtZXRlcnNcbiAgICBjb25zdCBtaW5GcmVxTmJyU2FtcGxlcyA9IGRvd25TUiAvIG1pbkZyZXE7XG4gICAgLy8gY29uc3QgYnVmZmVyU2l6ZSA9IHByZXZTdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuaGFsZkJ1ZmZlclNpemUgPSBkb3duRnJhbWVTaXplIC8gMjtcblxuICAgIC8vIG1pbmltdW0gZXJyb3IgdG8gbm90IGNyYXNoIGJ1dCBub3QgZW5vdWdodCB0byBoYXZlIHJlc3VsdHNcbiAgICBpZiAobWluRnJlcU5iclNhbXBsZXMgPiB0aGlzLmhhbGZCdWZmZXJTaXplKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGlucHV0IGZyYW1lIHNpemUsIHRvbyBzbWFsbCBmb3IgZ2l2ZW4gXCJtaW5GcmVxXCInKTtcblxuICAgIHRoaXMuZG93blNhbXBsaW5nRXhwID0gZG93blNhbXBsaW5nRXhwO1xuICAgIHRoaXMuZG93blNhbXBsaW5nUmF0ZSA9IGRvd25TUjtcbiAgICB0aGlzLmRvd25GcmFtZVNpemUgPSBkb3duRnJhbWVTaXplO1xuICAgIHRoaXMuYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShkb3duRnJhbWVTaXplKTtcbiAgICAvLyBhdXRvY29ycmVsYXRpb24gYnVmZmVyXG4gICAgdGhpcy55aW5CdWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuaGFsZkJ1ZmZlclNpemUpO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZG93bnNhbXBsZShpbnB1dCwgc2l6ZSwgb3V0cHV0LCBkb3duU2FtcGxpbmdFeHApIHtcbiAgICBjb25zdCBvdXRwdXRTaXplID0gc2l6ZSA+PiBkb3duU2FtcGxpbmdFeHA7XG4gICAgbGV0IGksIGo7XG5cbiAgICBzd2l0Y2ggKGRvd25TYW1wbGluZ0V4cCkge1xuICAgICAgY2FzZSAwOiAvLyBubyBkb3duIHNhbXBsaW5nXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBzaXplOyBpKyspXG4gICAgICAgICAgb3V0cHV0W2ldID0gaW5wdXRbaV07XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGZvciAoaSA9IDAsIGogPSAwOyBpIDwgb3V0cHV0U2l6ZTsgaSsrLCBqICs9IDIpXG4gICAgICAgICAgb3V0cHV0W2ldID0gMC41ICogKGlucHV0W2pdICsgaW5wdXRbaiArIDFdKTtcblxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICBmb3IgKGkgPSAwLCBqID0gMDsgaSA8IG91dHB1dFNpemU7IGkrKywgaiArPSA0KVxuICAgICAgICAgIG91dHB1dFtpXSA9IDAuMjUgKiAoaW5wdXRbal0gKyBpbnB1dFtqICsgMV0gKyBpbnB1dFtqICsgMl0gKyBpbnB1dFtqICsgM10pO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBmb3IgKGkgPSAwLCBqID0gMDsgaSA8IG91dHB1dFNpemU7IGkrKywgaiArPSA4KVxuICAgICAgICAgIG91dHB1dFtpXSA9IDAuMTI1ICogKGlucHV0W2pdICsgaW5wdXRbaiArIDFdICsgaW5wdXRbaiArIDJdICsgaW5wdXRbaiArIDNdICsgaW5wdXRbaiArIDRdICsgaW5wdXRbaiArIDVdICsgaW5wdXRbaiArIDZdICsgaW5wdXRbaiArIDddKTtcblxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0cHV0U2l6ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGVwIDEsIDIgYW5kIDMgLSBTcXVhcmVkIGRpZmZlcmVuY2Ugb2YgdGhlIHNoaWZ0ZWQgc2lnbmFsIHdpdGggaXRzZWxmLlxuICAgKiBjdW11bGF0aXZlIG1lYW4gbm9ybWFsaXplZCBkaWZmZXJlbmNlLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX25vcm1hbGl6ZWREaWZmZXJlbmNlKGJ1ZmZlcikge1xuICAgIGNvbnN0IGhhbGZCdWZmZXJTaXplID0gdGhpcy5oYWxmQnVmZmVyU2l6ZTtcbiAgICBjb25zdCB5aW5CdWZmZXIgPSB0aGlzLnlpbkJ1ZmZlcjtcbiAgICBsZXQgc3VtID0gMDtcblxuICAgIC8vIGRpZmZlcmVuY2UgZm9yIGRpZmZlcmVudCBzaGlmdCB2YWx1ZXMgKHRhdSlcbiAgICBmb3IgKGxldCB0YXUgPSAwOyB0YXUgPCBoYWxmQnVmZmVyU2l6ZTsgdGF1KyspIHtcbiAgICAgIGxldCBzcXVhcmVkRGlmZmVyZW5jZSA9IDA7IC8vIHJlc2V0IGJ1ZmZlclxuXG4gICAgICAvLyB0YWtlIGRpZmZlcmVuY2Ugb2YgdGhlIHNpZ25hbCB3aXRoIGEgc2hpZnRlZCB2ZXJzaW9uIG9mIGl0c2VsZiB0aGVuXG4gICAgICAvLyBzcWF1cmUgdGhlIHJlc3VsdFxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYWxmQnVmZmVyU2l6ZTsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gYnVmZmVyW2ldIC0gYnVmZmVyW2kgKyB0YXVdO1xuICAgICAgICBzcXVhcmVkRGlmZmVyZW5jZSArPSBkZWx0YSAqIGRlbHRhO1xuICAgICAgfVxuXG4gICAgICAvLyBzdGVwIDMgLSBub3JtYWxpemUgeWluQnVmZmVyXG4gICAgICBpZiAodGF1ID4gMCkge1xuICAgICAgICBzdW0gKz0gc3F1YXJlZERpZmZlcmVuY2U7XG4gICAgICAgIHlpbkJ1ZmZlclt0YXVdID0gc3F1YXJlZERpZmZlcmVuY2UgKiAodGF1IC8gc3VtKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB5aW5CdWZmZXJbMF0gPSAxO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0ZXAgNCAtIGZpbmQgZmlyc3QgYmVzdCB0YXUgdGhhdCBpcyB1bmRlciB0aGUgdGhyZXNvbGQuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWJzb2x1dGVUaHJlc2hvbGQoKSB7XG4gICAgY29uc3QgdGhyZXNob2xkID0gdGhpcy5wYXJhbXMuZ2V0KCd0aHJlc2hvbGQnKTtcbiAgICBjb25zdCB5aW5CdWZmZXIgPSB0aGlzLnlpbkJ1ZmZlcjtcbiAgICBjb25zdCBoYWxmQnVmZmVyU2l6ZSA9IHRoaXMuaGFsZkJ1ZmZlclNpemU7XG4gICAgbGV0IHRhdTtcblxuICAgIGZvciAodGF1ID0gMTsgdGF1IDwgaGFsZkJ1ZmZlclNpemU7IHRhdSsrKSB7XG4gICAgICBpZiAoeWluQnVmZmVyW3RhdV0gPCB0aHJlc2hvbGQpIHtcbiAgICAgICAgLy8ga2VlcCBpbmNyZWFzaW5nIHRhdSBpZiBuZXh0IHZhbHVlIGlzIGJldHRlclxuICAgICAgICB3aGlsZSAodGF1ICsgMSA8IGhhbGZCdWZmZXJTaXplICYmIHlpbkJ1ZmZlclt0YXUgKyAxXSA8IHlpbkJ1ZmZlclt0YXVdKVxuICAgICAgICAgIHRhdSArPSAxO1xuXG4gICAgICAgIC8vIGJlc3QgdGF1IGZvdW5kICwgeWluQnVmZmVyW3RhdV0gY2FuIGJlIHNlZW4gYXMgYW4gZXN0aW1hdGlvbiBvZlxuICAgICAgICAvLyBhcGVyaW9kaWNpdHkgdGhlbjogcGVyaW9kaWNpdHkgPSAxIC0gYXBlcmlvZGljaXR5XG4gICAgICAgIHRoaXMucHJvYmFiaWxpdHkgPSAxIC0geWluQnVmZmVyW3RhdV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJldHVybiAtMSBpZiBub3QgbWF0Y2ggZm91bmRcbiAgICByZXR1cm4gKHRhdSA9PT0gaGFsZkJ1ZmZlclNpemUpID8gLTEgOiB0YXU7XG4gIH1cblxuICAvKipcbiAgICogU3RlcCA1IC0gRmluZCBhIGJldHRlciBmcmFjdGlvbm5hbCBhcHByb3hpbWF0ZSBvZiB0YXUuXG4gICAqIHRoaXMgY2FuIHByb2JhYmx5IGJlIHNpbXBsaWZpZWQuLi5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9wYXJhYm9saWNJbnRlcnBvbGF0aW9uKHRhdUVzdGltYXRlKSB7XG4gICAgY29uc3QgaGFsZkJ1ZmZlclNpemUgPSB0aGlzLmhhbGZCdWZmZXJTaXplO1xuICAgIGNvbnN0IHlpbkJ1ZmZlciA9IHRoaXMueWluQnVmZmVyO1xuICAgIGxldCBiZXR0ZXJUYXU7XG4gICAgLy8gQG5vdGUgLSB0YXVFc3RpbWF0ZSBjYW5ub3QgYmUgemVybyBhcyB0aGUgbG9vcCBzdGFydCBhdCAxIGluIHN0ZXAgNFxuICAgIGNvbnN0IHgwID0gdGF1RXN0aW1hdGUgLSAxO1xuICAgIGNvbnN0IHgyID0gKHRhdUVzdGltYXRlIDwgaGFsZkJ1ZmZlclNpemUgLSAxKSA/IHRhdUVzdGltYXRlICsgMSA6IHRhdUVzdGltYXRlO1xuXG4gICAgLy8gaWYgYHRhdUVzdGltYXRlYCBpcyBsYXN0IGluZGV4LCB3ZSBjYW4ndCBpbnRlcnBvbGF0ZVxuICAgIGlmICh4MiA9PT0gdGF1RXN0aW1hdGUpIHtcbiAgICAgICAgYmV0dGVyVGF1ID0gdGF1RXN0aW1hdGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHMwID0geWluQnVmZmVyW3gwXTtcbiAgICAgIGNvbnN0IHMxID0geWluQnVmZmVyW3RhdUVzdGltYXRlXTtcbiAgICAgIGNvbnN0IHMyID0geWluQnVmZmVyW3gyXTtcblxuICAgICAgLy8gQG5vdGUgLSBkb24ndCBmdWxseSB1bmRlcnN0YW5kIHRoaXMgZm9ybXVsYSBuZWl0aGVyLi4uXG4gICAgICBiZXR0ZXJUYXUgPSB0YXVFc3RpbWF0ZSArIChzMiAtIHMwKSAvICgyICogKDIgKiBzMSAtIHMyIC0gczApKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYmV0dGVyVGF1O1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSB0aGUgYFlpbmAgb3BlcmF0b3IgaW4gYHN0YW5kYWxvbmVgIG1vZGUgKGkuZS4gb3V0c2lkZSBvZiBhIGdyYXBoKS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheXxGbG9hdDMyQXJyYXl9IGlucHV0IC0gVGhlIHNpZ25hbCBmcmFnbWVudCB0byBwcm9jZXNzLlxuICAgKiBAcmV0dXJuIHtBcnJheX0gLSBBcnJheSBjb250YWluaW5nIHRoZSBgZnJlcXVlbmN5YCwgYGVuZXJneWAsIGBwZXJpb2RpY2l0eWBcbiAgICogIGFuZCBgQUMxYFxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gICAqXG4gICAqIGNvbnN0IHlpbiA9IG5ldyBsZm8ub3BlcmF0b3IuWWluKCk7XG4gICAqIHlpbi5pbml0U3RyZWFtKHtcbiAgICogICBmcmFtZVNpemU6IDIwNDgsXG4gICAqICAgZnJhbWVUeXBlOiAnc2lnbmFsJyxcbiAgICogICBzb3VyY2VTYW1wbGVSYXRlOiA0NDEwMFxuICAgKiB9KTtcbiAgICpcbiAgICogY29uc3QgcmVzdWx0cyA9IHlpbi5pbnB1dFNpZ25hbChzaWduYWwpO1xuICAgKi9cbiAgaW5wdXRTaWduYWwoaW5wdXQpIHtcbiAgICB0aGlzLnBpdGNoID0gLTE7XG4gICAgdGhpcy5wcm9iYWJpbGl0eSA9IDA7XG5cbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICBjb25zdCBpbnB1dEZyYW1lU2l6ZSA9IHRoaXMuaW5wdXRGcmFtZVNpemU7XG4gICAgY29uc3QgZG93blNhbXBsaW5nRXhwID0gdGhpcy5kb3duU2FtcGxpbmdFeHA7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMuZG93blNhbXBsaW5nUmF0ZTtcbiAgICBjb25zdCBvdXREYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgIGxldCB0YXVFc3RpbWF0ZSA9IC0xO1xuXG4gICAgLy8gc3Vic2FtcGxpbmdcbiAgICB0aGlzLl9kb3duc2FtcGxlKGlucHV0LCBpbnB1dEZyYW1lU2l6ZSwgYnVmZmVyLCBkb3duU2FtcGxpbmdFeHApO1xuICAgIC8vIHN0ZXAgMSwgMiwgMyAtIG5vcm1hbGl6ZWQgc3F1YXJlZCBkaWZmZXJlbmNlIG9mIHRoZSBzaWduYWwgd2l0aCBhXG4gICAgLy8gc2hpZnRlZCB2ZXJzaW9uIG9mIGl0c2VsZlxuICAgIHRoaXMuX25vcm1hbGl6ZWREaWZmZXJlbmNlKGJ1ZmZlcik7XG4gICAgLy8gc3RlcCA0IC0gZmluZCBmaXJzdCBiZXN0IHRhdSBlc3RpbWF0ZSB0aGF0IGlzIG92ZXIgdGhlIHRocmVzaG9sZFxuICAgIHRhdUVzdGltYXRlID0gdGhpcy5fYWJzb2x1dGVUaHJlc2hvbGQoKTtcblxuICAgIGlmICh0YXVFc3RpbWF0ZSAhPT0gLTEpIHtcbiAgICAgIC8vIHN0ZXAgNSAtIHNvIGZhciB0YXUgaXMgYW4gaW50ZWdlciBzaGlmdCBvZiB0aGUgc2lnbmFsLCBjaGVjayBpZlxuICAgICAgLy8gdGhlcmUgaXMgYSBiZXR0ZXIgZnJhY3Rpb25uYWwgdmFsdWUgYXJvdW5kXG4gICAgICB0YXVFc3RpbWF0ZSA9IHRoaXMuX3BhcmFib2xpY0ludGVycG9sYXRpb24odGF1RXN0aW1hdGUpO1xuICAgICAgdGhpcy5waXRjaCA9IHNhbXBsZVJhdGUgLyB0YXVFc3RpbWF0ZTtcbiAgICB9XG5cbiAgICBvdXREYXRhWzBdID0gdGhpcy5waXRjaDtcbiAgICBvdXREYXRhWzFdID0gdGhpcy5wcm9iYWJpbGl0eTtcblxuICAgIHJldHVybiBvdXREYXRhO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTaWduYWwoZnJhbWUpIHtcbiAgICB0aGlzLmlucHV0U2lnbmFsKGZyYW1lLmRhdGEpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFlpbjtcbiIsImltcG9ydCBCaXF1YWQgZnJvbSAnLi9CaXF1YWQnO1xuaW1wb3J0IERjdCBmcm9tICcuL0RjdCc7XG5pbXBvcnQgRmZ0IGZyb20gJy4vRmZ0JztcbmltcG9ydCBNYWduaXR1ZGUgZnJvbSAnLi9NYWduaXR1ZGUnO1xuaW1wb3J0IE1lYW5TdGRkZXYgZnJvbSAnLi9NZWFuU3RkZGV2JztcbmltcG9ydCBNZWwgZnJvbSAnLi9NZWwnO1xuaW1wb3J0IE1mY2MgZnJvbSAnLi9NZmNjJztcbmltcG9ydCBNaW5NYXggZnJvbSAnLi9NaW5NYXgnO1xuaW1wb3J0IE1vdmluZ0F2ZXJhZ2UgZnJvbSAnLi9Nb3ZpbmdBdmVyYWdlJztcbmltcG9ydCBNb3ZpbmdNZWRpYW4gZnJvbSAnLi9Nb3ZpbmdNZWRpYW4nO1xuaW1wb3J0IE9uT2ZmIGZyb20gJy4vT25PZmYnO1xuaW1wb3J0IFJtcyBmcm9tICcuL1Jtcyc7XG5pbXBvcnQgU2VnbWVudGVyIGZyb20gJy4vU2VnbWVudGVyJztcbmltcG9ydCBTZWxlY3QgZnJvbSAnLi9TZWxlY3QnO1xuaW1wb3J0IFNsaWNlciBmcm9tICcuL1NsaWNlcic7XG5pbXBvcnQgWWluIGZyb20gJy4vWWluJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBCaXF1YWQsXG4gIERjdCxcbiAgRmZ0LFxuICBNYWduaXR1ZGUsXG4gIE1lYW5TdGRkZXYsXG4gIE1lbCxcbiAgTWZjYyxcbiAgTWluTWF4LFxuICBNb3ZpbmdBdmVyYWdlLFxuICBNb3ZpbmdNZWRpYW4sXG4gIE9uT2ZmLFxuICBSbXMsXG4gIFNlZ21lbnRlcixcbiAgU2VsZWN0LFxuICBTbGljZXIsXG4gIFlpbixcbn07XG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgcHJvY2Vzc0ZyYW1lOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgZmluYWxpemVTdHJlYW06IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxufTtcblxuLyoqXG4gKiBDcmVhdGUgYSBicmlkZ2UgYmV0d2VlbiB0aGUgZ3JhcGggYW5kIGFwcGxpY2F0aW9uIGxvZ2ljLiBIYW5kbGUgYHB1c2hgXG4gKiBhbmQgYHB1bGxgIHBhcmFkaWdtcy5cbiAqXG4gKiBUaGlzIHNpbmsgY2FuIGhhbmRsZSBhbnkgdHlwZSBvZiBpbnB1dCAoYHNpZ25hbGAsIGB2ZWN0b3JgLCBgc2NhbGFyYClcbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5zaW5rXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5wcm9jZXNzRnJhbWU9bnVsbF0gLSBDYWxsYmFjayBleGVjdXRlZCBvbiBlYWNoXG4gKiAgYHByb2Nlc3NGcmFtZWAgY2FsbC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmZpbmFsaXplU3RyZWFtPW51bGxdIC0gQ2FsbGJhY2sgZXhlY3V0ZWQgb24gZWFjaFxuICogIGBmaW5hbGl6ZVN0cmVhbWAgY2FsbC5cbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzRnJhbWV9XG4gKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzU3RyZWFtUGFyYW1zfVxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NvbW1vbic7XG4gKlxuICogY29uc3QgZnJhbWVzID0gW1xuICogIHsgdGltZTogMCwgZGF0YTogWzAsIDFdIH0sXG4gKiAgeyB0aW1lOiAxLCBkYXRhOiBbMSwgMl0gfSxcbiAqIF07XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBFdmVudEluKHtcbiAqICAgZnJhbWVUeXBlOiAndmVjdG9yJyxcbiAqICAgZnJhbWVTaXplOiAyLFxuICogICBmcmFtZVJhdGU6IDEsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBicmlkZ2UgPSBuZXcgQnJpZGdlKHtcbiAqICAgcHJvY2Vzc0ZyYW1lOiAoZnJhbWUpID0+IGNvbnNvbGUubG9nKGZyYW1lKSxcbiAqIH0pO1xuICpcbiAqIGV2ZW50SW4uY29ubmVjdChicmlkZ2UpO1xuICogZXZlbnRJbi5zdGFydCgpO1xuICpcbiAqIC8vIGNhbGxiYWNrIGV4ZWN1dGVkIG9uIGVhY2ggZnJhbWVcbiAqIGV2ZW50SW4ucHJvY2Vzc0ZyYW1lKGZyYW1lWzBdKTtcbiAqID4geyB0aW1lOiAwLCBkYXRhOiBbMCwgMV0gfVxuICogZXZlbnRJbi5wcm9jZXNzRnJhbWUoZnJhbWVbMV0pO1xuICogPiB7IHRpbWU6IDEsIGRhdGE6IFsxLCAyXSB9XG4gKlxuICogLy8gcHVsbCBjdXJyZW50IGZyYW1lIHdoZW4gbmVlZGVkXG4gKiBjb25zb2xlLmxvZyhicmlkZ2UuZnJhbWUpO1xuICogPiB7IHRpbWU6IDEsIGRhdGE6IFsxLCAyXSB9XG4gKi9cbmNsYXNzIEJyaWRnZSBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgZmluYWxpemVTdHJlYW0oZW5kVGltZSkge1xuICAgIGNvbnN0IGZpbmFsaXplU3RyZWFtQ2FsbGJhY2sgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZpbmFsaXplU3RyZWFtJyk7XG5cbiAgICBpZiAoZmluYWxpemVTdHJlYW1DYWxsYmFjayAhPT0gbnVsbClcbiAgICAgIGZpbmFsaXplU3RyZWFtQ2FsbGJhY2soZW5kVGltZSk7XG4gIH1cblxuICAvLyBwcm9jZXNzIGFueSB0eXBlXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2NhbGFyKCkge31cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoKSB7fVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbCgpIHt9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIHRoaXMucHJlcGFyZUZyYW1lKCk7XG5cbiAgICBjb25zdCBwcm9jZXNzRnJhbWVDYWxsYmFjayA9IHRoaXMucGFyYW1zLmdldCgncHJvY2Vzc0ZyYW1lJyk7XG4gICAgY29uc3Qgb3V0cHV0ID0gdGhpcy5mcmFtZTtcbiAgICBvdXRwdXQuZGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplKTtcbiAgICAvLyBwdWxsIGludGVyZmFjZSAod2UgY29weSBkYXRhIHNpbmNlIHdlIGRvbid0IGtub3cgd2hhdCBjb3VsZFxuICAgIC8vIGJlIGRvbmUgb3V0c2lkZSB0aGUgZ3JhcGgpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7IGkrKylcbiAgICAgIG91dHB1dC5kYXRhW2ldID0gZnJhbWUuZGF0YVtpXTtcblxuICAgIG91dHB1dC50aW1lID0gZnJhbWUudGltZTtcbiAgICBvdXRwdXQubWV0YWRhdGEgPSBmcmFtZS5tZXRhZGF0YTtcblxuICAgIC8vIGBwdXNoYCBpbnRlcmZhY2VcbiAgICBpZiAocHJvY2Vzc0ZyYW1lQ2FsbGJhY2sgIT09IG51bGwpXG4gICAgICBwcm9jZXNzRnJhbWVDYWxsYmFjayhvdXRwdXQpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJyaWRnZTtcbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIHNlcGFyYXRlQXJyYXlzOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBjYWxsYmFjazoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG59O1xuXG4vKipcbiAqIFJlY29yZCBpbnB1dCBmcmFtZXMgZnJvbSBhIGdyYXBoLiBUaGlzIHNpbmsgY2FuIGhhbmRsZSBgc2lnbmFsYCwgYHZlY3RvcmBcbiAqIG9yIGBzY2FsYXJgIGlucHV0cy5cbiAqXG4gKiBXaGVuIHRoZSByZWNvcmRpbmcgaXMgc3RvcHBlZCAoZWl0aGVyIGJ5IGNhbGxpbmcgYHN0b3BgIG9uIHRoZSBub2RlIG9yIHdoZW5cbiAqIHRoZSBzdHJlYW0gaXMgZmluYWxpemVkKSwgdGhlIGNhbGxiYWNrIGdpdmVuIGFzIHBhcmFtZXRlciBpcyBleGVjdXRlZCB3aXRoXG4gKiB0aGUgcmVjb3JkZXIgZGF0YSBhcyBhcmd1bWVudC5cbiAqXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnNlcGFyYXRlQXJyYXlzPWZhbHNlXSAtIEZvcm1hdCBvZiB0aGUgcmV0cmlldmVkXG4gKiAgdmFsdWVzOlxuICogIC0gd2hlbiBgZmFsc2VgLCBmb3JtYXQgaXMgW3sgdGltZSwgZGF0YSB9LCB7IHRpbWUsIGRhdGEgfSwgLi4uXVxuICogIC0gd2hlbiBgdHJ1ZWAsIGZvcm1hdCBpcyB7IHRpbWU6IFsuLi5dLCBkYXRhOiBbLi4uXSB9XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5jYWxsYmFja10gLSBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBuZXcgcmVjb3JkXG4gKiAgaXMgZW5kZWQuIFRoaXMgY2FuIGhhcHBlbiB3aGVuOiBgc3RvcGAgaXMgY2FsbGVkIG9uIHRoZSByZWNvcmRlciwgb3IgYHN0b3BgXG4gKiAgaXMgY2FsbGVkIG9uIHRoZSBzb3VyY2UuXG4gKlxuICogQHRvZG8gLSBBZGQgYXV0byByZWNvcmQgcGFyYW0uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24uc2lua1xuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NvbW1vbic7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogIGZyYW1lVHlwZTogJ3ZlY3RvcicsXG4gKiAgZnJhbWVTaXplOiAyLFxuICogIGZyYW1lUmF0ZTogMCxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IHJlY29yZGVyID0gbmV3IGxmby5zaW5rLkRhdGFSZWNvcmRlcih7XG4gKiAgIGNhbGxiYWNrOiAoZGF0YSkgPT4gY29uc29sZS5sb2coZGF0YSksXG4gKiB9KTtcbiAqXG4gKiBldmVudEluLmNvbm5lY3QocmVjb3JkZXIpO1xuICogZXZlbnRJbi5zdGFydCgpO1xuICogcmVjb3JkZXIuc3RhcnQoKTtcbiAqXG4gKiBldmVudEluLnByb2Nlc3MoMCwgWzAsIDFdKTtcbiAqIGV2ZW50SW4ucHJvY2VzcygxLCBbMSwgMl0pO1xuICpcbiAqIHJlY29yZGVyLnN0b3AoKTtcbiAqID4gW3sgdGltZTogMCwgZGF0YTogWzAsIDFdIH0sIHsgdGltZTogMSwgZGF0YTogWzEsIDJdIH1dO1xuICovXG5jbGFzcyBEYXRhUmVjb3JkZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lIGlmIHRoZSBub2RlIGlzIGN1cnJlbnRseSByZWNvcmRpbmcuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAbmFtZSBpc1JlY29yZGluZ1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c2luay5TaWduYWxSZWNvcmRlclxuICAgICAqL1xuICAgIHRoaXMuaXNSZWNvcmRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfaW5pdFN0b3JlKCkge1xuICAgIGNvbnN0IHNlcGFyYXRlQXJyYXlzID0gdGhpcy5wYXJhbXMuZ2V0KCdzZXBhcmF0ZUFycmF5cycpO1xuXG4gICAgaWYgKHNlcGFyYXRlQXJyYXlzKVxuICAgICAgdGhpcy5fc3RvcmUgPSB7IHRpbWU6IFtdLCBkYXRhOiBbXSB9O1xuICAgIGVsc2VcbiAgICAgIHRoaXMuX3N0b3JlID0gW107XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuICAgIHRoaXMuX2luaXRTdG9yZSgpO1xuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgcmVjb3JkaW5nLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y2xpZW50LnNpbmsuRGF0YVJlY29yZGVyI3N0b3B9XG4gICAqL1xuICBzdGFydCgpIHtcbiAgICB0aGlzLmlzUmVjb3JkaW5nID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHJlY29yZGluZyBhbmQgZXhlY3V0ZSB0aGUgY2FsbGJhY2sgZGVmaW5lZCBpbiBwYXJhbWV0ZXJzLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y2xpZW50LnNpbmsuRGF0YVJlY29yZGVyI3N0YXJ0fVxuICAgKi9cbiAgc3RvcCgpIHtcbiAgICBpZiAodGhpcy5pc1JlY29yZGluZykge1xuICAgICAgdGhpcy5pc1JlY29yZGluZyA9IGZhbHNlO1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLnBhcmFtcy5nZXQoJ2NhbGxiYWNrJyk7XG5cbiAgICAgIGlmIChjYWxsYmFjayAhPT0gbnVsbClcbiAgICAgICAgY2FsbGJhY2sodGhpcy5fc3RvcmUpO1xuXG4gICAgICB0aGlzLl9pbml0U3RvcmUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgZmluYWxpemVTdHJlYW0oKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gIH1cblxuICAvLyBoYW5kbGUgYW55IGlucHV0IHR5cGVzXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2NhbGFyKGZyYW1lKSB7fVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge31cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUpIHt9XG5cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgaWYgKHRoaXMuaXNSZWNvcmRpbmcpIHtcbiAgICAgIHRoaXMucHJlcGFyZUZyYW1lKGZyYW1lKTtcblxuICAgICAgY29uc3Qgc2VwYXJhdGVBcnJheXMgPSB0aGlzLnBhcmFtcy5nZXQoJ3NlcGFyYXRlQXJyYXlzJyk7XG4gICAgICBjb25zdCBlbnRyeSA9IHtcbiAgICAgICAgdGltZTogZnJhbWUudGltZSxcbiAgICAgICAgZGF0YTogbmV3IEZsb2F0MzJBcnJheShmcmFtZS5kYXRhKSxcbiAgICAgIH07XG5cbiAgICAgIGlmICghc2VwYXJhdGVBcnJheXMpIHtcbiAgICAgICAgdGhpcy5fc3RvcmUucHVzaChlbnRyeSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9zdG9yZS50aW1lLnB1c2goZW50cnkudGltZSk7XG4gICAgICAgIHRoaXMuX3N0b3JlLmRhdGEucHVzaChlbnRyeS5kYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGF0YVJlY29yZGVyO1xuXG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgdGltZToge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfVxuICB9LFxuICBkYXRhOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9XG4gIH0sXG4gIG1ldGFkYXRhOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9XG4gIH0sXG4gIHN0cmVhbVBhcmFtczoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfVxuICB9LFxuICBmcmFtZUluZGV4OiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9XG4gIH0sXG59XG5cbi8qKlxuICogTG9nIGBmcmFtZS50aW1lYCwgYGZyYW1lLmRhdGFgLCBgZnJhbWUubWV0YWRhdGFgIGFuZC9vclxuICogYHN0cmVhbUF0dHJpYnV0ZXNgIG9mIGFueSBub2RlIGluIHRoZSBjb25zb2xlLlxuICpcbiAqIFRoaXMgc2luayBjYW4gaGFuZGxlIGFueSB0eXBlIGlmIGlucHV0IChgc2lnbmFsYCwgYHZlY3RvcmAsIGBzY2FsYXJgKVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgcGFyYW1ldGVycyBkZWZhdWx0IHZhbHVlcy5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMudGltZT1mYWxzZV0gLSBMb2cgaW5jb21taW5nIGBmcmFtZS50aW1lYCBpZiBgdHJ1ZWAuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmRhdGE9ZmFsc2VdIC0gTG9nIGluY29tbWluZyBgZnJhbWUuZGF0YWAgaWYgYHRydWVgLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5tZXRhZGF0YT1mYWxzZV0gLSBMb2cgaW5jb21taW5nIGBmcmFtZS5tZXRhZGF0YWBcbiAqICBpZiBgdHJ1ZWAuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnN0cmVhbVBhcmFtcz1mYWxzZV0gLSBMb2cgYHN0cmVhbVBhcmFtc2Agb2YgdGhlXG4gKiAgcHJldmlvdXMgbm9kZSB3aGVuIGdyYXBoIGlzIHN0YXJ0ZWQuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmZyYW1lSW5kZXg9ZmFsc2VdIC0gTG9nIGluZGV4IG9mIHRoZSBpbmNvbW1pbmdcbiAqICBgZnJhbWVgLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLnNpbmtcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jb21tb24nO1xuICpcbiAqIGNvbnN0IGxvZ2dlciA9IG5ldyBsZm8uc2luay5Mb2dnZXIoeyBkYXRhOiB0cnVlIH0pO1xuICogd2hhdGV2ZXJPcGVyYXRvci5jb25uZWN0KGxvZ2dlcik7XG4gKi9cbmNsYXNzIExvZ2dlciBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ3N0cmVhbVBhcmFtcycpID09PSB0cnVlKVxuICAgICAgY29uc29sZS5sb2cocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLmZyYW1lSW5kZXggPSAwO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGdW5jdGlvbihmcmFtZSkge1xuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lSW5kZXgnKSA9PT0gdHJ1ZSlcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuZnJhbWVJbmRleCsrKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ3RpbWUnKSA9PT0gdHJ1ZSlcbiAgICAgIGNvbnNvbGUubG9nKGZyYW1lLnRpbWUpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnZGF0YScpID09PSB0cnVlKVxuICAgICAgY29uc29sZS5sb2coZnJhbWUuZGF0YSk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdtZXRhZGF0YScpID09PSB0cnVlKVxuICAgICAgY29uc29sZS5sb2coZnJhbWUubWV0YWRhdGEpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvZ2dlcjtcbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBkdXJhdGlvbjoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogMTAsXG4gICAgbWluOiAwLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIGNhbGxiYWNrOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgaWdub3JlTGVhZGluZ1plcm9zOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgcmV0cmlldmVBdWRpb0J1ZmZlcjoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgYXVkaW9Db250ZXh0OiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgfSxcbn07XG5cbi8qKlxuICogUmVjb3JkIGFuIGBzaWduYWxgIGlucHV0IHN0cmVhbSBvZiBhcmJpdHJhcnkgZHVyYXRpb24gYW5kIHJldHJpZXZlIGl0XG4gKiB3aGVuIGRvbmUuXG4gKlxuICogV2hlbiByZWNvcmRpbmcgaXMgc3RvcHBlZCAoZWl0aGVyIHdoZW4gdGhlIGBzdG9wYCBtZXRob2QgaXMgY2FsbGVkLCB0aGVcbiAqIGRlZmluZWQgZHVyYXRpb24gaGFzIGJlZW4gcmVjb3JkZWQsIG9yIHRoZSBzb3VyY2Ugb2YgdGhlIGdyYXBoIGZpbmFsaXplZFxuICogdGhlIHN0cmVhbSksIHRoZSBjYWxsYmFjayBnaXZlbiBhcyBwYXJhbWV0ZXIgaXMgZXhlY3V0ZWQgIHdpdGggdGhlXG4gKiBgQXVkaW9CdWZmZXJgIG9yIGBGbG9hdDMyQXJyYXlgIGNvbnRhaW5pbmcgdGhlIHJlY29yZGVkIHNpZ25hbCBhcyBhcmd1bWVudC5cbiAqXG4gKiBAdG9kbyAtIGFkZCBvcHRpb24gdG8gcmV0dXJuIG9ubHkgdGhlIEZsb2F0MzJBcnJheSBhbmQgbm90IGFuIGF1ZGlvIGJ1ZmZlclxuICogIChub2RlIGNvbXBsaWFudCkgYHJldHJpZXZlQXVkaW9CdWZmZXI6IGZhbHNlYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmR1cmF0aW9uPTEwXSAtIE1heGltdW0gZHVyYXRpb24gb2YgdGhlIHJlY29yZGluZy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5jYWxsYmFja10gLSBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBuZXcgcmVjb3JkIGlzXG4gKiAgZW5kZWQuIFRoaXMgY2FuIGhhcHBlbjogYHN0b3BgIGlzIGNhbGxlZCBvbiB0aGUgcmVjb3JkZXIsIGBzdG9wYCBpcyBjYWxsZWRcbiAqICBvbiB0aGUgc291cmNlIG9yIHdoZW4gdGhlIGJ1ZmZlciBpcyBmdWxsIGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gYGR1cmF0aW9uYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5pZ25vcmVMZWFkaW5nWmVyb3M9dHJ1ZV0gLSBTdGFydCB0aGUgZWZmZWN0aXZlXG4gKiAgcmVjb3JkaW5nIG9uIHRoZSBmaXJzdCBub24temVybyB2YWx1ZS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucmV0cmlldmVBdWRpb0J1ZmZlcj1mYWxzZV0gLSBEZWZpbmUgaWYgYW4gYEF1ZGlvQnVmZmVyYFxuICogIHNob3VsZCBiZSByZXRyaWV2ZWQgb3Igb25seSB0aGUgcmF3IEZsb2F0MzJBcnJheSBvZiBkYXRhLlxuICogICh3b3JrcyBvbmx5IGluIGJyb3dzZXIpXG4gKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gW29wdGlvbnMuYXVkaW9Db250ZXh0PW51bGxdIC0gSWZcbiAqICBgcmV0cmlldmVBdWRpb0J1ZmZlcmAgaXMgc2V0IHRvIGB0cnVlYCwgYXVkaW8gY29udGV4dCB0byBiZSB1c2VkXG4gKiAgaW4gb3JkZXIgdG8gY3JlYXRlIHRoZSBmaW5hbCBhdWRpbyBidWZmZXIuXG4gKiAgKHdvcmtzIG9ubHkgaW4gYnJvd3NlcilcbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5zaW5rXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiBjb25zdCBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gKlxuICogbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICogICAuZ2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSlcbiAqICAgLnRoZW4oaW5pdClcbiAqICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKSk7XG4gKlxuICogZnVuY3Rpb24gaW5pdChzdHJlYW0pIHtcbiAqICAgY29uc3Qgc291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZU1lZGlhU3RyZWFtU291cmNlKHN0cmVhbSk7XG4gKlxuICogICBjb25zdCBhdWRpb0luTm9kZSA9IG5ldyBsZm8uc291cmNlLkF1ZGlvSW5Ob2RlKHtcbiAqICAgICBzb3VyY2VOb2RlOiBzb3VyY2UsXG4gKiAgICAgYXVkaW9Db250ZXh0OiBhdWRpb0NvbnRleHQsXG4gKiAgIH0pO1xuICpcbiAqICAgY29uc3Qgc2lnbmFsUmVjb3JkZXIgPSBuZXcgbGZvLnNpbmsuU2lnbmFsUmVjb3JkZXIoe1xuICogICAgIGR1cmF0aW9uOiA2LFxuICogICAgIHJldHJpZXZlQXVkaW9CdWZmZXI6IHRydWUsXG4gKiAgICAgYXVkaW9Db250ZXh0OiBhdWRpb0NvbnRleHQsXG4gKiAgICAgY2FsbGJhY2s6IChidWZmZXIpID0+IHtcbiAqICAgICAgIGNvbnN0IGJ1ZmZlclNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbiAqICAgICAgIGJ1ZmZlclNvdXJjZS5idWZmZXIgPSBidWZmZXI7XG4gKiAgICAgICBidWZmZXJTb3VyY2UuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICogICAgICAgYnVmZmVyU291cmNlLnN0YXJ0KCk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiAgIGF1ZGlvSW5Ob2RlLmNvbm5lY3Qoc2lnbmFsUmVjb3JkZXIpO1xuICogICBhdWRpb0luTm9kZS5zdGFydCgpO1xuICogICBzaWduYWxSZWNvcmRlci5zdGFydCgpO1xuICogfSk7XG4gKi9cbmNsYXNzIFNpZ25hbFJlY29yZGVyIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZSBpcyB0aGUgbm9kZSBpcyBjdXJyZW50bHkgcmVjb3JkaW5nIG9yIG5vdC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBuYW1lIGlzUmVjb3JkaW5nXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpjbGllbnQuc2luay5TaWduYWxSZWNvcmRlclxuICAgICAqL1xuICAgIHRoaXMuaXNSZWNvcmRpbmcgPSBmYWxzZTtcblxuICAgIGNvbnN0IHJldHJpZXZlQXVkaW9CdWZmZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ3JldHJpZXZlQXVkaW9CdWZmZXInKTtcbiAgICBsZXQgYXVkaW9Db250ZXh0ID0gdGhpcy5wYXJhbXMuZ2V0KCdhdWRpb0NvbnRleHQnKTtcbiAgICAvLyBuZWVkZWQgdG8gcmV0cmlldmUgYW4gQXVkaW9CdWZmZXJcbiAgICBpZiAocmV0cmlldmVBdWRpb0J1ZmZlciAmJiBhdWRpb0NvbnRleHQgPT09IG51bGwpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcGFyYW1ldGVyIFwiYXVkaW9Db250ZXh0XCI6IGFuIEF1ZGlvQ29udGV4dCBtdXN0IGJlIHByb3ZpZGVkIHdoZW4gYHJldHJpZXZlQXVkaW9CdWZmZXJgIGlzIHNldCB0byBgdHJ1ZWAnKVxuXG4gICAgdGhpcy5fYXVkaW9Db250ZXh0ID0gYXVkaW9Db250ZXh0O1xuICAgIHRoaXMuX2lnbm9yZVplcm9zID0gZmFsc2U7XG4gICAgdGhpcy5faXNJbmZpbml0ZUJ1ZmZlciA9IGZhbHNlO1xuICAgIHRoaXMuX3N0YWNrID0gW107XG4gICAgdGhpcy5fYnVmZmVyID0gbnVsbDtcbiAgICB0aGlzLl9idWZmZXJMZW5ndGggPSBudWxsO1xuICAgIHRoaXMuX2N1cnJlbnRJbmRleCA9IG51bGw7XG4gIH1cblxuICBfaW5pdEJ1ZmZlcigpIHtcbiAgICB0aGlzLl9idWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuX2J1ZmZlckxlbmd0aCk7XG4gICAgdGhpcy5fc3RhY2subGVuZ3RoID0gMDtcbiAgICB0aGlzLl9jdXJyZW50SW5kZXggPSAwO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5wYXJhbXMuZ2V0KCdkdXJhdGlvbicpO1xuICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuXG4gICAgaWYgKGlzRmluaXRlKGR1cmF0aW9uKSkge1xuICAgICAgdGhpcy5faXNJbmZpbml0ZUJ1ZmZlciA9IGZhbHNlO1xuICAgICAgdGhpcy5fYnVmZmVyTGVuZ3RoID0gc2FtcGxlUmF0ZSAqIGR1cmF0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9pc0luZmluaXRlQnVmZmVyID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2J1ZmZlckxlbmd0aCA9IHNhbXBsZVJhdGUgKiAxMDtcbiAgICB9XG5cbiAgICB0aGlzLl9pbml0QnVmZmVyKCk7XG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCByZWNvcmRpbmcuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICB0aGlzLmlzUmVjb3JkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLl9pZ25vcmVaZXJvcyA9IHRoaXMucGFyYW1zLmdldCgnaWdub3JlTGVhZGluZ1plcm9zJyk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCByZWNvcmRpbmcgYW5kIGV4ZWN1dGUgdGhlIGNhbGxiYWNrIGRlZmluZWQgaW4gcGFyYW1ldGVycy5cbiAgICovXG4gIHN0b3AoKSB7XG4gICAgaWYgKHRoaXMuaXNSZWNvcmRpbmcpIHtcbiAgICAgIC8vIGlnbm9yZSBuZXh0IGluY29tbWluZyBmcmFtZVxuICAgICAgdGhpcy5pc1JlY29yZGluZyA9IGZhbHNlO1xuXG4gICAgICBjb25zdCByZXRyaWV2ZUF1ZGlvQnVmZmVyID0gdGhpcy5wYXJhbXMuZ2V0KCdyZXRyaWV2ZUF1ZGlvQnVmZmVyJyk7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMucGFyYW1zLmdldCgnY2FsbGJhY2snKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHRoaXMuX2N1cnJlbnRJbmRleDtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuX2J1ZmZlcjtcbiAgICAgIGxldCBvdXRwdXQ7XG5cbiAgICAgIGlmICghdGhpcy5faXNJbmZpbml0ZUJ1ZmZlcikge1xuICAgICAgICBvdXRwdXQgPSBuZXcgRmxvYXQzMkFycmF5KGN1cnJlbnRJbmRleCk7XG4gICAgICAgIG91dHB1dC5zZXQoYnVmZmVyLnN1YmFycmF5KDAsIGN1cnJlbnRJbmRleCksIDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgYnVmZmVyTGVuZ3RoID0gdGhpcy5fYnVmZmVyTGVuZ3RoO1xuICAgICAgICBjb25zdCBzdGFjayA9IHRoaXMuX3N0YWNrO1xuXG4gICAgICAgIG91dHB1dCA9IG5ldyBGbG9hdDMyQXJyYXkoc3RhY2subGVuZ3RoICogYnVmZmVyTGVuZ3RoICsgY3VycmVudEluZGV4KTtcblxuICAgICAgICAvLyBjb3B5IGFsbCBzdGFja2VkIGJ1ZmZlcnNcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFjay5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IHN0YWNrZWRCdWZmZXIgPSBzdGFja1tpXTtcbiAgICAgICAgICBvdXRwdXQuc2V0KHN0YWNrZWRCdWZmZXIsIGJ1ZmZlckxlbmd0aCAqIGkpO1xuICAgICAgICB9O1xuICAgICAgICAvLyBjb3B5IGRhdGEgY29udGFpbmVkIGluIGN1cnJlbnQgYnVmZmVyXG4gICAgICAgIG91dHB1dC5zZXQoYnVmZmVyLnN1YmFycmF5KDAsIGN1cnJlbnRJbmRleCksIHN0YWNrLmxlbmd0aCAqIGJ1ZmZlckxlbmd0aCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXRyaWV2ZUF1ZGlvQnVmZmVyICYmIHRoaXMuX2F1ZGlvQ29udGV4dCkge1xuICAgICAgICBjb25zdCBsZW5ndGggPSBvdXRwdXQubGVuZ3RoO1xuICAgICAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcbiAgICAgICAgY29uc3QgYXVkaW9CdWZmZXIgPSB0aGlzLl9hdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIGxlbmd0aCwgc2FtcGxlUmF0ZSk7XG4gICAgICAgIGNvbnN0IGNoYW5uZWxEYXRhID0gYXVkaW9CdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XG4gICAgICAgIGNoYW5uZWxEYXRhLnNldChvdXRwdXQsIDApO1xuXG4gICAgICAgIGNhbGxiYWNrKGF1ZGlvQnVmZmVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG91dHB1dCk7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlaW5pdCBidWZmZXIsIHN0YWNrLCBhbmQgY3VycmVudEluZGV4XG4gICAgICB0aGlzLl9pbml0QnVmZmVyKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGZpbmFsaXplU3RyZWFtKGVuZFRpbWUpIHtcbiAgICB0aGlzLnN0b3AoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKGZyYW1lKSB7XG4gICAgaWYgKCF0aGlzLmlzUmVjb3JkaW5nKVxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IGJsb2NrID0gbnVsbDtcbiAgICBjb25zdCBpbnB1dCA9IGZyYW1lLmRhdGE7XG4gICAgY29uc3QgYnVmZmVyTGVuZ3RoID0gdGhpcy5fYnVmZmVyTGVuZ3RoO1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuX2J1ZmZlcjtcblxuICAgIGlmICh0aGlzLl9pZ25vcmVaZXJvcyA9PT0gZmFsc2UpIHtcbiAgICAgIGJsb2NrID0gbmV3IEZsb2F0MzJBcnJheShpbnB1dCk7XG4gICAgfSBlbHNlIGlmIChpbnB1dFtpbnB1dC5sZW5ndGggLSAxXSAhPT0gMCkge1xuICAgICAgLy8gZmluZCBmaXJzdCBpbmRleCB3aGVyZSB2YWx1ZSAhPT0gMFxuICAgICAgbGV0IGk7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkrKylcbiAgICAgICAgaWYgKGlucHV0W2ldICE9PSAwKSBicmVhaztcblxuICAgICAgLy8gY29weSBub24gemVybyBzZWdtZW50XG4gICAgICBibG9jayA9IG5ldyBGbG9hdDMyQXJyYXkoaW5wdXQuc3ViYXJyYXkoaSkpO1xuICAgICAgLy8gZG9uJ3QgcmVwZWF0IHRoaXMgbG9naWMgb25jZSBhIG5vbi16ZXJvIHZhbHVlIGhhcyBiZWVuIGZvdW5kXG4gICAgICB0aGlzLl9pZ25vcmVaZXJvcyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChibG9jayAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgYXZhaWxhYmxlU3BhY2UgPSBidWZmZXJMZW5ndGggLSB0aGlzLl9jdXJyZW50SW5kZXg7XG4gICAgICBsZXQgY3VycmVudEJsb2NrO1xuXG4gICAgICBpZiAoYXZhaWxhYmxlU3BhY2UgPCBibG9jay5sZW5ndGgpXG4gICAgICAgIGN1cnJlbnRCbG9jayA9IGJsb2NrLnN1YmFycmF5KDAsIGF2YWlsYWJsZVNwYWNlKTtcbiAgICAgIGVsc2VcbiAgICAgICAgY3VycmVudEJsb2NrID0gYmxvY2s7XG5cbiAgICAgIGJ1ZmZlci5zZXQoY3VycmVudEJsb2NrLCB0aGlzLl9jdXJyZW50SW5kZXgpO1xuICAgICAgdGhpcy5fY3VycmVudEluZGV4ICs9IGN1cnJlbnRCbG9jay5sZW5ndGg7XG5cbiAgICAgIGlmICh0aGlzLl9pc0luZmluaXRlQnVmZmVyICYmIHRoaXMuX2N1cnJlbnRJbmRleCA9PT0gYnVmZmVyTGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX3N0YWNrLnB1c2goYnVmZmVyKTtcblxuICAgICAgICBjdXJyZW50QmxvY2sgPSBibG9jay5zdWJhcnJheShhdmFpbGFibGVTcGFjZSk7XG4gICAgICAgIHRoaXMuX2J1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoYnVmZmVyTGVuZ3RoKTtcbiAgICAgICAgdGhpcy5fYnVmZmVyLnNldChjdXJyZW50QmxvY2ssIDApO1xuICAgICAgICB0aGlzLl9jdXJyZW50SW5kZXggPSBjdXJyZW50QmxvY2subGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICAvLyAgc3RvcCBpZiB0aGUgYnVmZmVyIGlzIGZpbml0ZSBhbmQgZnVsbFxuICAgICAgaWYgKCF0aGlzLl9pc0luZmluaXRlQnVmZmVyICYmIHRoaXMuX2N1cnJlbnRJbmRleCA9PT0gYnVmZmVyTGVuZ3RoKVxuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2lnbmFsUmVjb3JkZXI7XG5cbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5cbi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTc1NzU3OTAvZW52aXJvbm1lbnQtZGV0ZWN0aW9uLW5vZGUtanMtb3ItYnJvd3NlclxuY29uc3QgaXNOb2RlID0gbmV3IEZ1bmN0aW9uKCd0cnkgeyByZXR1cm4gdGhpcyA9PT0gZ2xvYmFsOyB9IGNhdGNoKGUpIHsgcmV0dXJuIGZhbHNlIH0nKTtcblxuLyoqXG4gKiBDcmVhdGUgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGltZSBpbiBzZWNvbmRzIGFjY29yZGluZyB0byB0aGUgY3VycmVudFxuICogZW52aXJvbm5lbWVudCAobm9kZSBvciBicm93c2VyKS5cbiAqIElmIHJ1bm5pbmcgaW4gbm9kZSB0aGUgdGltZSByZWx5IG9uIGBwcm9jZXNzLmhydGltZWAsIHdoaWxlIGlmIGluIHRoZSBicm93c2VyXG4gKiBpdCBpcyBwcm92aWRlZCBieSB0aGUgYGN1cnJlbnRUaW1lYCBvZiBhbiBgQXVkaW9Db250ZXh0YCwgdGhpcyBjb250ZXh0IGNhblxuICogb3B0aW9ubmFseSBiZSBwcm92aWRlZCB0byBrZWVwIHRpbWUgY29uc2lzdGVuY3kgYmV0d2VlbiBzZXZlcmFsIGBFdmVudEluYFxuICogbm9kZXMuXG4gKlxuICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IFthdWRpb0NvbnRleHQ9bnVsbF0gLSBPcHRpb25uYWwgYXVkaW8gY29udGV4dC5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZ2V0VGltZUZ1bmN0aW9uKGF1ZGlvQ29udGV4dCA9IG51bGwpIHtcbiAgaWYgKGlzTm9kZSgpKSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNvbnN0IHQgPSBwcm9jZXNzLmhydGltZSgpO1xuICAgICAgcmV0dXJuIHRbMF0gKyB0WzFdICogMWUtOTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGF1ZGlvQ29udGV4dCA9PT0gbnVsbCB8fMKgKCFhdWRpb0NvbnRleHQgaW5zdGFuY2VvZiBBdWRpb0NvbnRleHQpKSB7XG4gICAgICBjb25zdCBBdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8wqB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuICAgICAgYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICAgIH1cblxuICAgIHJldHVybiAoKSA9PiBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gIH1cbn1cblxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgYWJzb2x1dGVUaW1lOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBhdWRpb0NvbnRleHQ6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICB9LFxuICBmcmFtZVR5cGU6IHtcbiAgICB0eXBlOiAnZW51bScsXG4gICAgbGlzdDogWydzaWduYWwnLCAndmVjdG9yJywgJ3NjYWxhciddLFxuICAgIGRlZmF1bHQ6ICdzaWduYWwnLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBmcmFtZVNpemU6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMSxcbiAgICBtaW46IDEsXG4gICAgbWF4OiArSW5maW5pdHksIC8vIG5vdCByZWNvbW1lbmRlZC4uLlxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIHNhbXBsZVJhdGU6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbWluOiAwLFxuICAgIG1heDogK0luZmluaXR5LCAvLyBzYW1lIGhlcmVcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBmcmFtZVJhdGU6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbWluOiAwLFxuICAgIG1heDogK0luZmluaXR5LCAvLyBzYW1lIGhlcmVcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBkZXNjcmlwdGlvbjoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH1cbn07XG5cbi8qKlxuICogVGhlIGBFdmVudEluYCBvcGVyYXRvciBhbGxvd3MgdG8gbWFudWFsbHkgY3JlYXRlIGEgc3RyZWFtIG9mIGRhdGEgb3IgdG8gZmVlZFxuICogYSBzdHJlYW0gZnJvbSBhbm90aGVyIHNvdXJjZSAoZS5nLiBzZW5zb3JzKSBpbnRvIGEgcHJvY2Vzc2luZyBncmFwaC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIHBhcmFtZXRlcnMnIGRlZmF1bHQgdmFsdWVzLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmZyYW1lVHlwZT0nc2lnbmFsJ10gLSBUeXBlIG9mIHRoZSBpbnB1dCAtIGFsbG93ZWRcbiAqIHZhbHVlczogYHNpZ25hbGAsICBgdmVjdG9yYCBvciBgc2NhbGFyYC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5mcmFtZVNpemU9MV0gLSBTaXplIG9mIHRoZSBvdXRwdXQgZnJhbWUuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuc2FtcGxlUmF0ZT1udWxsXSAtIFNhbXBsZSByYXRlIG9mIHRoZSBzb3VyY2Ugc3RyZWFtLFxuICogIGlmIG9mIHR5cGUgYHNpZ25hbGAuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZnJhbWVSYXRlPW51bGxdIC0gUmF0ZSBvZiB0aGUgc291cmNlIHN0cmVhbSwgaWYgb2ZcbiAqICB0eXBlIGB2ZWN0b3JgLlxuICogQHBhcmFtIHtBcnJheXxTdHJpbmd9IFtvcHRpb25zLmRlc2NyaXB0aW9uXSAtIE9wdGlvbm5hbCBkZXNjcmlwdGlvblxuICogIGRlc2NyaWJpbmcgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIG91dHB1dCBmcmFtZVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5hYnNvbHV0ZVRpbWU9ZmFsc2VdIC0gRGVmaW5lIGlmIHRpbWUgc2hvdWxkIGJlIHVzZWRcbiAqICBhcyBmb3J3YXJkZWQgYXMgZ2l2ZW4gaW4gdGhlIHByb2Nlc3MgbWV0aG9kLCBvciByZWxhdGl2ZWx5IHRvIHRoZSB0aW1lIG9mXG4gKiAgdGhlIGZpcnN0IGBwcm9jZXNzYCBjYWxsIGFmdGVyIHN0YXJ0LlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLnNvdXJjZVxuICpcbiAqIEB0b2RvIC0gQWRkIGEgYGxvZ2ljYWxUaW1lYCBwYXJhbWV0ZXIgdG8gdGFnIGZyYW1lIGFjY29yZGluZyB0byBmcmFtZSByYXRlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVR5cGU6ICd2ZWN0b3InLFxuICogICBmcmFtZVNpemU6IDMsXG4gKiAgIGZyYW1lUmF0ZTogMSAvIDUwLFxuICogICBkZXNjcmlwdGlvbjogWydhbHBoYScsICdiZXRhJywgJ2dhbW1hJ10sXG4gKiB9KTtcbiAqXG4gKiAvLyBjb25uZWN0IHNvdXJjZSB0byBvcGVyYXRvcnMgYW5kIHNpbmsocylcbiAqXG4gKiAvLyBpbml0aWFsaXplIGFuZCBzdGFydCB0aGUgZ3JhcGhcbiAqIGV2ZW50SW4uc3RhcnQoKTtcbiAqXG4gKiAvLyBmZWVkIGBkZXZpY2VvcmllbnRhdGlvbmAgZGF0YSBpbnRvIHRoZSBncmFwaFxuICogd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW9yaWVudGF0aW9uJywgKGUpID0+IHtcbiAqICAgY29uc3QgZnJhbWUgPSB7XG4gKiAgICAgdGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gKiAgICAgZGF0YTogW2UuYWxwaGEsIGUuYmV0YSwgZS5nYW1tYV0sXG4gKiAgIH07XG4gKlxuICogICBldmVudEluLnByb2Nlc3NGcmFtZShmcmFtZSk7XG4gKiB9LCBmYWxzZSk7XG4gKi9cbmNsYXNzIEV2ZW50SW4gZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgYXVkaW9Db250ZXh0ID0gdGhpcy5wYXJhbXMuZ2V0KCdhdWRpb0NvbnRleHQnKTtcbiAgICB0aGlzLl9nZXRUaW1lID0gZ2V0VGltZUZ1bmN0aW9uKGF1ZGlvQ29udGV4dCk7XG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gICAgdGhpcy5fc3RhcnRUaW1lID0gbnVsbDtcbiAgICB0aGlzLl9zeXN0ZW1UaW1lID0gbnVsbDtcbiAgICB0aGlzLl9hYnNvbHV0ZVRpbWUgPSB0aGlzLnBhcmFtcy5nZXQoJ2Fic29sdXRlVGltZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZSB0aGUgYHN0cmVhbVBhcmFtc2AgaW4gdGhlIGdyYXBoIGFuZCBhbGxvdyB0byBwdXNoIGZyYW1lcyBpbnRvXG4gICAqIHRoZSBncmFwaC4gQW55IGNhbGwgdG8gYHByb2Nlc3NgIG9yIGBwcm9jZXNzRnJhbWVgIGJlZm9yZSBgc3RhcnRgIHdpbGwgYmVcbiAgICogaWdub3JlZC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcmVzZXRTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uc291cmNlLkV2ZW50SW4jc3RvcH1cbiAgICovXG4gIHN0YXJ0KHN0YXJ0VGltZSA9IG51bGwpIHtcbiAgICB0aGlzLmluaXRTdHJlYW0oKTtcblxuICAgIHRoaXMuX3N0YXJ0VGltZSA9IHN0YXJ0VGltZTtcbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSB0cnVlO1xuICAgIC8vIHZhbHVlcyBzZXQgaW4gdGhlIGZpcnN0IGBwcm9jZXNzYCBjYWxsXG4gICAgdGhpcy5fc3lzdGVtVGltZSA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogRmluYWxpemUgdGhlIHN0cmVhbSBhbmQgc3RvcCB0aGUgd2hvbGUgZ3JhcGguIEFueSBjYWxsIHRvIGBwcm9jZXNzYCBvclxuICAgKiBgcHJvY2Vzc0ZyYW1lYCBhZnRlciBgc3RvcGAgd2lsbCBiZSBpZ25vcmVkLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNmaW5hbGl6ZVN0cmVhbX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5zb3VyY2UuRXZlbnRJbiNzdGFydH1cbiAgICovXG4gIHN0b3AoKSB7XG4gICAgaWYgKHRoaXMuX2lzU3RhcnRlZCAmJiB0aGlzLl9zdGFydFRpbWUgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gdGhpcy5fZ2V0VGltZSgpO1xuICAgICAgY29uc3QgZW5kVGltZSA9IHRoaXMuZnJhbWUudGltZSArIChjdXJyZW50VGltZSAtIHRoaXMuX3N5c3RlbVRpbWUpO1xuXG4gICAgICB0aGlzLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICAgICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMoKSB7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdmcmFtZVNpemUnKTtcbiAgICBjb25zdCBmcmFtZVR5cGUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lVHlwZScpO1xuICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnBhcmFtcy5nZXQoJ3NhbXBsZVJhdGUnKTtcbiAgICBjb25zdCBmcmFtZVJhdGUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lUmF0ZScpO1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdGhpcy5wYXJhbXMuZ2V0KCdkZXNjcmlwdGlvbicpO1xuICAgIC8vIGluaXQgb3BlcmF0b3IncyBzdHJlYW0gcGFyYW1zXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gZnJhbWVUeXBlID09PSAnc2NhbGFyJyA/IDEgOiBmcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gZnJhbWVUeXBlO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG5cbiAgICBpZiAoZnJhbWVUeXBlID09PSAnc2lnbmFsJykge1xuICAgICAgaWYgKHNhbXBsZVJhdGUgPT09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5kZWZpbmVkIFwic2FtcGxlUmF0ZVwiIGZvciBcInNpZ25hbFwiIHN0cmVhbScpO1xuXG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlID0gc2FtcGxlUmF0ZTtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHNhbXBsZVJhdGUgLyBmcmFtZVNpemU7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVDb3VudCA9IGZyYW1lU2l6ZTtcblxuICAgIH0gZWxzZSBpZiAoZnJhbWVUeXBlID09PSAndmVjdG9yJyB8fCBmcmFtZVR5cGUgPT09ICdzY2FsYXInKSB7XG4gICAgICBpZiAoZnJhbWVSYXRlID09PSBudWxsKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZGVmaW5lZCBcImZyYW1lUmF0ZVwiIGZvciBcInZlY3RvclwiIHN0cmVhbScpO1xuXG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSBmcmFtZVJhdGU7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlID0gZnJhbWVSYXRlO1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlQ291bnQgPSAxO1xuICAgIH1cblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0Z1bmN0aW9uKGZyYW1lKSB7XG4gICAgY29uc3QgY3VycmVudFRpbWUgPSB0aGlzLl9nZXRUaW1lKCk7XG4gICAgY29uc3QgaW5EYXRhID0gZnJhbWUuZGF0YS5sZW5ndGggPyBmcmFtZS5kYXRhIDogW2ZyYW1lLmRhdGFdO1xuICAgIGNvbnN0IG91dERhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgLy8gaWYgbm8gdGltZSBwcm92aWRlZCwgdXNlIHN5c3RlbSB0aW1lXG4gICAgbGV0IHRpbWUgPSBOdW1iZXIuaXNGaW5pdGUoZnJhbWUudGltZSkgPyBmcmFtZS50aW1lIDogY3VycmVudFRpbWU7XG5cbiAgICBpZiAodGhpcy5fc3RhcnRUaW1lID09PSBudWxsKVxuICAgICAgdGhpcy5fc3RhcnRUaW1lID0gdGltZTtcblxuICAgIGlmICh0aGlzLl9hYnNvbHV0ZVRpbWUgPT09IGZhbHNlKVxuICAgICAgdGltZSA9IHRpbWUgLSB0aGlzLl9zdGFydFRpbWU7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTsgaSA8IGw7IGkrKylcbiAgICAgIG91dERhdGFbaV0gPSBpbkRhdGFbaV07XG5cbiAgICB0aGlzLmZyYW1lLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMuZnJhbWUubWV0YWRhdGEgPSBmcmFtZS5tZXRhZGF0YTtcbiAgICAvLyBzdG9yZSBjdXJyZW50IHRpbWUgdG8gY29tcHV0ZSBgZW5kVGltZWAgb24gc3RvcFxuICAgIHRoaXMuX3N5c3RlbVRpbWUgPSBjdXJyZW50VGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbHRlcm5hdGl2ZSBpbnRlcmZhY2UgdG8gcHJvcGFnYXRlIGEgZnJhbWUgaW4gdGhlIGdyYXBoLiBQYWNrIGB0aW1lYCxcbiAgICogYGRhdGFgIGFuZCBgbWV0YWRhdGFgIGluIGEgZnJhbWUgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSAtIEZyYW1lIHRpbWUuXG4gICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fEFycmF5fSBkYXRhIC0gRnJhbWUgZGF0YS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG1ldGFkYXRhIC0gT3B0aW9ubmFsIGZyYW1lIG1ldGFkYXRhLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBldmVudEluLnByb2Nlc3MoMSwgWzAsIDEsIDJdKTtcbiAgICogLy8gaXMgZXF1aXZhbGVudCB0b1xuICAgKiBldmVudEluLnByb2Nlc3NGcmFtZSh7IHRpbWU6IDEsIGRhdGE6IFswLCAxLCAyXSB9KTtcbiAgICovXG4gIHByb2Nlc3ModGltZSwgZGF0YSwgbWV0YWRhdGEgPSBudWxsKSB7XG4gICAgdGhpcy5wcm9jZXNzRnJhbWUoeyB0aW1lLCBkYXRhLCBtZXRhZGF0YSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGUgYSBmcmFtZSBvYmplY3QgaW4gdGhlIGdyYXBoLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZnJhbWUgLSBJbnB1dCBmcmFtZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGZyYW1lLnRpbWUgLSBGcmFtZSB0aW1lLlxuICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheXxBcnJheX0gZnJhbWUuZGF0YSAtIEZyYW1lIGRhdGEuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbZnJhbWUubWV0YWRhdGE9dW5kZWZpbmVkXSAtIE9wdGlvbm5hbCBmcmFtZSBtZXRhZGF0YS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogZXZlbnRJbi5wcm9jZXNzRnJhbWUoeyB0aW1lOiAxLCBkYXRhOiBbMCwgMSwgMl0gfSk7XG4gICAqL1xuICBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgICBpZiAoIXRoaXMuX2lzU3RhcnRlZCkgcmV0dXJuO1xuXG4gICAgdGhpcy5wcmVwYXJlRnJhbWUoKTtcbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG4gICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50SW47XG4iLCJcbi8vIHNob3J0Y3V0cyAvIGhlbHBlcnNcbmNvbnN0IFBJICAgPSBNYXRoLlBJO1xuY29uc3QgY29zICA9IE1hdGguY29zO1xuY29uc3Qgc2luICA9IE1hdGguc2luO1xuY29uc3Qgc3FydCA9IE1hdGguc3FydDtcblxuLy8gd2luZG93IGNyZWF0aW9uIGZ1bmN0aW9uc1xuZnVuY3Rpb24gaW5pdEhhbm5XaW5kb3coYnVmZmVyLCBzaXplLCBub3JtQ29lZnMpIHtcbiAgbGV0IGxpblN1bSA9IDA7XG4gIGxldCBwb3dTdW0gPSAwO1xuICBjb25zdCBzdGVwID0gMiAqIFBJIC8gc2l6ZTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgIGNvbnN0IHBoaSA9IGkgKiBzdGVwO1xuICAgIGNvbnN0IHZhbHVlID0gMC41IC0gMC41ICogY29zKHBoaSk7XG5cbiAgICBidWZmZXJbaV0gPSB2YWx1ZTtcblxuICAgIGxpblN1bSArPSB2YWx1ZTtcbiAgICBwb3dTdW0gKz0gdmFsdWUgKiB2YWx1ZTtcbiAgfVxuXG4gIG5vcm1Db2Vmcy5saW5lYXIgPSBzaXplIC8gbGluU3VtO1xuICBub3JtQ29lZnMucG93ZXIgPSBzcXJ0KHNpemUgLyBwb3dTdW0pO1xufVxuXG5mdW5jdGlvbiBpbml0SGFtbWluZ1dpbmRvdyhidWZmZXIsIHNpemUsIG5vcm1Db2Vmcykge1xuICBsZXQgbGluU3VtID0gMDtcbiAgbGV0IHBvd1N1bSA9IDA7XG4gIGNvbnN0IHN0ZXAgPSAyICogUEkgLyBzaXplO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgY29uc3QgcGhpID0gaSAqIHN0ZXA7XG4gICAgY29uc3QgdmFsdWUgPSAwLjU0IC0gMC40NiAqIGNvcyhwaGkpO1xuXG4gICAgYnVmZmVyW2ldID0gdmFsdWU7XG5cbiAgICBsaW5TdW0gKz0gdmFsdWU7XG4gICAgcG93U3VtICs9IHZhbHVlICogdmFsdWU7XG4gIH1cblxuICBub3JtQ29lZnMubGluZWFyID0gc2l6ZSAvIGxpblN1bTtcbiAgbm9ybUNvZWZzLnBvd2VyID0gc3FydChzaXplIC8gcG93U3VtKTtcbn1cblxuZnVuY3Rpb24gaW5pdEJsYWNrbWFuV2luZG93KGJ1ZmZlciwgc2l6ZSwgbm9ybUNvZWZzKSB7XG4gIGxldCBsaW5TdW0gPSAwO1xuICBsZXQgcG93U3VtID0gMDtcbiAgY29uc3Qgc3RlcCA9IDIgKiBQSSAvIHNpemU7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICBjb25zdCBwaGkgPSBpICogc3RlcDtcbiAgICBjb25zdCB2YWx1ZSA9IDAuNDIgLSAwLjUgKiBjb3MocGhpKSArIDAuMDggKiBjb3MoMiAqIHBoaSk7XG5cbiAgICBidWZmZXJbaV0gPSB2YWx1ZTtcblxuICAgIGxpblN1bSArPSB2YWx1ZTtcbiAgICBwb3dTdW0gKz0gdmFsdWUgKiB2YWx1ZTtcbiAgfVxuXG4gIG5vcm1Db2Vmcy5saW5lYXIgPSBzaXplIC8gbGluU3VtO1xuICBub3JtQ29lZnMucG93ZXIgPSBzcXJ0KHNpemUgLyBwb3dTdW0pO1xufVxuXG5mdW5jdGlvbiBpbml0QmxhY2ttYW5IYXJyaXNXaW5kb3coYnVmZmVyLCBzaXplLCBub3JtQ29lZnMpIHtcbiAgbGV0IGxpblN1bSA9IDA7XG4gIGxldCBwb3dTdW0gPSAwO1xuICBjb25zdCBhMCA9IDAuMzU4NzU7XG4gIGNvbnN0IGExID0gMC40ODgyOTtcbiAgY29uc3QgYTIgPSAwLjE0MTI4O1xuICBjb25zdCBhMyA9IDAuMDExNjg7XG4gIGNvbnN0IHN0ZXAgPSAyICogUEkgLyBzaXplO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgY29uc3QgcGhpID0gaSAqIHN0ZXA7XG4gICAgY29uc3QgdmFsdWUgPSBhMCAtIGExICogY29zKHBoaSkgKyBhMiAqIGNvcygyICogcGhpKTsgLSBhMyAqIGNvcygzICogcGhpKTtcblxuICAgIGJ1ZmZlcltpXSA9IHZhbHVlO1xuXG4gICAgbGluU3VtICs9IHZhbHVlO1xuICAgIHBvd1N1bSArPSB2YWx1ZSAqIHZhbHVlO1xuICB9XG5cbiAgbm9ybUNvZWZzLmxpbmVhciA9IHNpemUgLyBsaW5TdW07XG4gIG5vcm1Db2Vmcy5wb3dlciA9IHNxcnQoc2l6ZSAvIHBvd1N1bSk7XG59XG5cbmZ1bmN0aW9uIGluaXRTaW5lV2luZG93KGJ1ZmZlciwgc2l6ZSwgbm9ybUNvZWZzKSB7XG4gIGxldCBsaW5TdW0gPSAwO1xuICBsZXQgcG93U3VtID0gMDtcbiAgY29uc3Qgc3RlcCA9IFBJIC8gc2l6ZTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgIGNvbnN0IHBoaSA9IGkgKiBzdGVwO1xuICAgIGNvbnN0IHZhbHVlID0gc2luKHBoaSk7XG5cbiAgICBidWZmZXJbaV0gPSB2YWx1ZTtcblxuICAgIGxpblN1bSArPSB2YWx1ZTtcbiAgICBwb3dTdW0gKz0gdmFsdWUgKiB2YWx1ZTtcbiAgfVxuXG4gIG5vcm1Db2Vmcy5saW5lYXIgPSBzaXplIC8gbGluU3VtO1xuICBub3JtQ29lZnMucG93ZXIgPSBzcXJ0KHNpemUgLyBwb3dTdW0pO1xufVxuXG5mdW5jdGlvbiBpbml0UmVjdGFuZ2xlV2luZG93KGJ1ZmZlciwgc2l6ZSwgbm9ybUNvZWZzKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKVxuICAgIGJ1ZmZlcltpXSA9IDE7XG5cbiAgLy8gQHRvZG8gLSBjaGVjayBpZiB0aGVzZSBhcmUgcHJvcGVyIHZhbHVlc1xuICBub3JtQ29lZnMubGluZWFyID0gMTtcbiAgbm9ybUNvZWZzLnBvd2VyID0gMTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBidWZmZXIgd2l0aCB3aW5kb3cgc2lnbmFsLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLnV0aWxzXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB3aW5kb3cuXG4gKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gYnVmZmVyIC0gQnVmZmVyIHRvIGJlIHBvcHVsYXRlZCB3aXRoIHRoZSB3aW5kb3cgc2lnbmFsLlxuICogQHBhcmFtIHtOdW1iZXJ9IHNpemUgLSBTaXplIG9mIHRoZSBidWZmZXIuXG4gKiBAcGFyYW0ge09iamVjdH0gbm9ybUNvZWZzIC0gT2JqZWN0IHRvIGJlIHBvcHVsYXRlZCB3aXRoIHRoZSBub3JtYWlsemF0aW9uXG4gKiAgY29lZmZpY2llbnRzLlxuICovXG5mdW5jdGlvbiBpbml0V2luZG93KG5hbWUsIGJ1ZmZlciwgc2l6ZSwgbm9ybUNvZWZzKSB7XG4gIG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgc3dpdGNoIChuYW1lKSB7XG4gICAgY2FzZSAnaGFubic6XG4gICAgY2FzZSAnaGFubmluZyc6XG4gICAgICBpbml0SGFubldpbmRvdyhidWZmZXIsIHNpemUsIG5vcm1Db2Vmcyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdoYW1taW5nJzpcbiAgICAgIGluaXRIYW1taW5nV2luZG93KGJ1ZmZlciwgc2l6ZSwgbm9ybUNvZWZzKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2JsYWNrbWFuJzpcbiAgICAgIGluaXRCbGFja21hbldpbmRvdyhidWZmZXIsIHNpemUsIG5vcm1Db2Vmcyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdibGFja21hbmhhcnJpcyc6XG4gICAgICBpbml0QmxhY2ttYW5IYXJyaXNXaW5kb3coYnVmZmVyLCBzaXplLCBub3JtQ29lZnMpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc2luZSc6XG4gICAgICBpbml0U2luZVdpbmRvdyhidWZmZXIsIHNpemUsIG5vcm1Db2Vmcyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdyZWN0YW5nbGUnOlxuICAgICAgaW5pdFJlY3RhbmdsZVdpbmRvdyhidWZmZXIsIHNpemUsIG5vcm1Db2Vmcyk7XG4gICAgICBicmVhaztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBpbml0V2luZG93O1xuXG5cbiIsImltcG9ydCBwYXJhbWV0ZXJzIGZyb20gJ3BhcmFtZXRlcnMnO1xuXG5sZXQgaWQgPSAwO1xuXG4vKipcbiAqIEJhc2UgYGxmb2AgY2xhc3MgdG8gYmUgZXh0ZW5kZWQgaW4gb3JkZXIgdG8gY3JlYXRlIG5ldyBub2Rlcy5cbiAqXG4gKiBOb2RlcyBhcmUgZGl2aWRlZCBpbiAzIGNhdGVnb3JpZXM6XG4gKiAtICoqYHNvdXJjZWAqKiBhcmUgcmVzcG9uc2libGUgZm9yIGFjcXVlcmluZyBhIHNpZ25hbCBhbmQgaXRzIHByb3BlcnRpZXNcbiAqICAgKGZyYW1lUmF0ZSwgZnJhbWVTaXplLCBldGMuKVxuICogLSAqKmBzaW5rYCoqIGFyZSBlbmRwb2ludHMgb2YgdGhlIGdyYXBoLCBzdWNoIG5vZGVzIGNhbiBiZSByZWNvcmRlcnMsXG4gKiAgIHZpc3VhbGl6ZXJzLCBldGMuXG4gKiAtICoqYG9wZXJhdG9yYCoqIGFyZSB1c2VkIHRvIG1ha2UgY29tcHV0YXRpb24gb24gdGhlIGlucHV0IHNpZ25hbCBhbmRcbiAqICAgZm9yd2FyZCB0aGUgcmVzdWx0cyBiZWxvdyBpbiB0aGUgZ3JhcGguXG4gKlxuICogSW4gbW9zdCBjYXNlcyB0aGUgbWV0aG9kcyB0byBvdmVycmlkZSAvIGV4dGVuZCBhcmU6XG4gKiAtIHRoZSAqKmBjb25zdHJ1Y3RvcmAqKiB0byBkZWZpbmUgdGhlIHBhcmFtZXRlcnMgb2YgdGhlIG5ldyBsZm8gbm9kZS5cbiAqIC0gdGhlICoqYHByb2Nlc3NTdHJlYW1QYXJhbXNgKiogbWV0aG9kIHRvIGRlZmluZSBob3cgdGhlIG5vZGUgbW9kaWZ5IHRoZVxuICogICBzdHJlYW0gYXR0cmlidXRlcyAoZS5nLiBieSBjaGFuZ2luZyB0aGUgZnJhbWUgc2l6ZSlcbiAqIC0gdGhlICoqYHByb2Nlc3N7RnJhbWVUeXBlfWAqKiBtZXRob2QgdG8gZGVmaW5lIHRoZSBvcGVyYXRpb25zIHRoYXQgdGhlXG4gKiAgIG5vZGUgYXBwbHkgb24gdGhlIHN0cmVhbS4gVGhlIHR5cGUgb2YgaW5wdXQgYSBub2RlIGNhbiBoYW5kbGUgaXMgZGVmaW5lXG4gKiAgIGJ5IGl0cyBpbXBsZW1lbnRlZCBpbnRlcmZhY2UsIGlmIGl0IGltcGxlbWVudHMgYHByb2Nlc3NTaWduYWxgIGEgc3RyZWFtXG4gKiAgIHdpdGggYGZyYW1lVHlwZSA9PT0gJ3NpZ25hbCdgIGNhbiBiZSBwcm9jZXNzZWQsIGBwcm9jZXNzVmVjdG9yYCB0byBoYW5kbGVcbiAqICAgYW4gaW5wdXQgb2YgdHlwZSBgdmVjdG9yYC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fVGhpcyBjbGFzcyBzaG91bGQgYmUgY29uc2lkZXJlZCBhYnN0cmFjdCBhbmQgb25seVxuICogYmUgdXNlZCB0byBiZSBleHRlbmRlZC5fPC9zcGFuPlxuICpcbiAqXG4gKiAvLyBvdmVydmlldyBvZiB0aGUgYmVoYXZpb3Igb2YgYSBub2RlXG4gKlxuICogKipwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpKipcbiAqXG4gKiBgYmFzZWAgY2xhc3MgKGRlZmF1bHQgaW1wbGVtZW50YXRpb24pXG4gKiAtIGNhbGwgYHByZXByb2Nlc3NTdHJlYW1QYXJhbXNgXG4gKiAtIGNhbGwgYHByb3BhZ2F0ZVN0cmVhbVBhcmFtc2BcbiAqXG4gKiBgY2hpbGRgIGNsYXNzXG4gKiAtIGNhbGwgYHByZXByb2Nlc3NTdHJlYW1QYXJhbXNgXG4gKiAtIG92ZXJyaWRlIHNvbWUgb2YgdGhlIGluaGVyaXRlZCBgc3RyZWFtUGFyYW1zYFxuICogLSBjcmVhdGVzIHRoZSBhbnkgcmVsYXRlZCBsb2dpYyBidWZmZXJzXG4gKiAtIGNhbGwgYHByb3BhZ2F0ZVN0cmVhbVBhcmFtc2BcbiAqXG4gKiBfc2hvdWxkIG5vdCBjYWxsIGBzdXBlci5wcm9jZXNzU3RyZWFtUGFyYW1zYF9cbiAqXG4gKiAqKnByZXBhcmVTdHJlYW1QYXJhbXMoKSoqXG4gKlxuICogLSBhc3NpZ24gcHJldlN0cmVhbVBhcmFtcyB0byB0aGlzLnN0cmVhbVBhcmFtc1xuICogLSBjaGVjayBpZiB0aGUgY2xhc3MgaW1wbGVtZW50cyB0aGUgY29ycmVjdCBgcHJvY2Vzc0lucHV0YCBtZXRob2RcbiAqXG4gKiBfc2hvdWxkbid0IGJlIGV4dGVuZGVkLCBvbmx5IGNvbnN1bWVkIGluIGBwcm9jZXNzU3RyZWFtUGFyYW1zYF9cbiAqXG4gKiAqKnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpKipcbiAqXG4gKiAtIGNyZWF0ZXMgdGhlIGBmcmFtZURhdGFgIGJ1ZmZlclxuICogLSBwcm9wYWdhdGUgYHN0cmVhbVBhcmFtc2AgdG8gY2hpbGRyZW5cbiAqXG4gKiBfc2hvdWxkbid0IGJlIGV4dGVuZGVkLCBvbmx5IGNvbnN1bWVkIGluIGBwcm9jZXNzU3RyZWFtUGFyYW1zYF9cbiAqXG4gKiAqKnByb2Nlc3NGcmFtZSgpKipcbiAqXG4gKiBgYmFzZWAgY2xhc3MgKGRlZmF1bHQgaW1wbGVtZW50YXRpb24pXG4gKiAtIGNhbGwgYHByZXByb2Nlc3NGcmFtZWBcbiAqIC0gYXNzaWduIGZyYW1lVGltZSBhbmQgZnJhbWVNZXRhZGF0YSB0byBpZGVudGl0eVxuICogLSBjYWxsIHRoZSBwcm9wZXIgZnVuY3Rpb24gYWNjb3JkaW5nIHRvIGlucHV0VHlwZVxuICogLSBjYWxsIGBwcm9wYWdhdGVGcmFtZWBcbiAqXG4gKiBgY2hpbGRgIGNsYXNzXG4gKiAtIGNhbGwgYHByZXByb2Nlc3NGcmFtZWBcbiAqIC0gZG8gd2hhdGV2ZXIgeW91IHdhbnQgd2l0aCBpbmNvbW1pbmcgZnJhbWVcbiAqIC0gY2FsbCBgcHJvcGFnYXRlRnJhbWVgXG4gKlxuICogX3Nob3VsZCBub3QgY2FsbCBgc3VwZXIucHJvY2Vzc0ZyYW1lYF9cbiAqXG4gKiAqKnByZXBhcmVGcmFtZSgpKipcbiAqXG4gKiAtIGlmIGByZWluaXRgIGFuZCB0cmlnZ2VyIGBwcm9jZXNzU3RyZWFtUGFyYW1zYCBpZiBuZWVkZWRcbiAqXG4gKiBfc2hvdWxkbid0IGJlIGV4dGVuZGVkLCBvbmx5IGNvbnN1bWVkIGluIGBwcm9jZXNzRnJhbWVgX1xuICpcbiAqICoqcHJvcGFnYXRlRnJhbWUoKSoqXG4gKlxuICogLSBwcm9wYWdhdGUgZnJhbWUgdG8gY2hpbGRyZW5cbiAqXG4gKiBfc2hvdWxkbid0IGJlIGV4dGVuZGVkLCBvbmx5IGNvbnN1bWVkIGluIGBwcm9jZXNzRnJhbWVgX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29yZVxuICovXG5jbGFzcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3IoZGVmaW5pdGlvbnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5jaWQgPSBpZCsrO1xuXG4gICAgLyoqXG4gICAgICogUGFyYW1ldGVyIGJhZyBjb250YWluaW5nIHBhcmFtZXRlciBpbnN0YW5jZXMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBuYW1lIHBhcmFtc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqL1xuICAgIHRoaXMucGFyYW1zID0gcGFyYW1ldGVycyhkZWZpbml0aW9ucywgb3B0aW9ucyk7XG4gICAgLy8gbGlzdGVuIGZvciBwYXJhbSB1cGRhdGVzXG4gICAgdGhpcy5wYXJhbXMuYWRkTGlzdGVuZXIodGhpcy5vblBhcmFtVXBkYXRlLmJpbmQodGhpcykpO1xuXG4gICAgLyoqXG4gICAgICogRGVzY3JpcHRpb24gb2YgdGhlIHN0cmVhbSBvdXRwdXQgb2YgdGhlIG5vZGUuXG4gICAgICogU2V0IHRvIGBudWxsYCB3aGVuIHRoZSBub2RlIGlzIGRlc3Ryb3llZC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGZyYW1lU2l6ZSAtIEZyYW1lIHNpemUgYXQgdGhlIG91dHB1dCBvZiB0aGUgbm9kZS5cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZnJhbWVSYXRlIC0gRnJhbWUgcmF0ZSBhdCB0aGUgb3V0cHV0IG9mIHRoZSBub2RlLlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBmcmFtZVR5cGUgLSBGcmFtZSB0eXBlIGF0IHRoZSBvdXRwdXQgb2YgdGhlIG5vZGUsXG4gICAgICogIHBvc3NpYmxlIHZhbHVlcyBhcmUgYHNpZ25hbGAsIGB2ZWN0b3JgIG9yIGBzY2FsYXJgLlxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl8U3RyaW5nfSBkZXNjcmlwdGlvbiAtIElmIHR5cGUgaXMgYHZlY3RvcmAsIGRlc2NyaWJlXG4gICAgICogIHRoZSBkaW1lbnNpb24ocykgb2Ygb3V0cHV0IHN0cmVhbS5cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gc291cmNlU2FtcGxlUmF0ZSAtIFNhbXBsZSByYXRlIG9mIHRoZSBzb3VyY2Ugb2YgdGhlXG4gICAgICogIGdyYXBoLiBfVGhlIHZhbHVlIHNob3VsZCBiZSBkZWZpbmVkIGJ5IHNvdXJjZXMgYW5kIG5ldmVyIG1vZGlmaWVkXy5cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gc291cmNlU2FtcGxlQ291bnQgLSBOdW1iZXIgb2YgY29uc2VjdXRpdmUgZGlzY3JldGVcbiAgICAgKiAgdGltZSB2YWx1ZXMgY29udGFpbmVkIGluIHRoZSBkYXRhIGZyYW1lIG91dHB1dCBieSB0aGUgc291cmNlLlxuICAgICAqICBfVGhlIHZhbHVlIHNob3VsZCBiZSBkZWZpbmVkIGJ5IHNvdXJjZXMgYW5kIG5ldmVyIG1vZGlmaWVkXy5cbiAgICAgKlxuICAgICAqIEBuYW1lIHN0cmVhbVBhcmFtc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqL1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zID0ge1xuICAgICAgZnJhbWVUeXBlOiBudWxsLFxuICAgICAgZnJhbWVTaXplOiAxLFxuICAgICAgZnJhbWVSYXRlOiAwLFxuICAgICAgZGVzY3JpcHRpb246IG51bGwsXG4gICAgICBzb3VyY2VTYW1wbGVSYXRlOiAwLFxuICAgICAgc291cmNlU2FtcGxlQ291bnQ6IG51bGwsXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEN1cnJlbnQgZnJhbWUuIFRoaXMgb2JqZWN0IGFuZCBpdHMgZGF0YSBhcmUgdXBkYXRlZCBhdCBlYWNoIGluY29tbWluZ1xuICAgICAqIGZyYW1lIHdpdGhvdXQgcmVhbGxvY2F0aW5nIG1lbW9yeS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgZnJhbWVcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gdGltZSAtIFRpbWUgb2YgdGhlIGN1cnJlbnQgZnJhbWUuXG4gICAgICogQHByb3BlcnR5IHtGbG9hdDMyQXJyYXl9IGRhdGEgLSBEYXRhIG9mIHRoZSBjdXJyZW50IGZyYW1lLlxuICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBtZXRhZGF0YSAtIE1ldGFkYXRhIGFzc29jaXRlZCB0byB0aGUgY3VycmVudCBmcmFtZS5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm9cbiAgICAgKi9cbiAgICB0aGlzLmZyYW1lID0ge1xuICAgICAgdGltZTogMCxcbiAgICAgIGRhdGE6IG51bGwsXG4gICAgICBtZXRhZGF0YToge30sXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2Ygbm9kZXMgY29ubmVjdGVkIHRvIHRoZSBvdXB1dCBvZiB0aGUgbm9kZSAobG93ZXIgaW4gdGhlIGdyYXBoKS5cbiAgICAgKiBBdCBlYWNoIGZyYW1lLCB0aGUgbm9kZSBmb3J3YXJkIGl0cyBgZnJhbWVgIHRvIHRvIGFsbCBpdHMgYG5leHRPcHNgLlxuICAgICAqXG4gICAgICogQHR5cGUge0FycmF5PEJhc2VMZm8+fVxuICAgICAqIEBuYW1lIG5leHRPcHNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm9cbiAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNjb25uZWN0fVxuICAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Rpc2Nvbm5lY3R9XG4gICAgICovXG4gICAgdGhpcy5uZXh0T3BzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbm9kZSBmcm9tIHdoaWNoIHRoZSBub2RlIHJlY2VpdmUgdGhlIGZyYW1lcyAodXBwZXIgaW4gdGhlIGdyYXBoKS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtCYXNlTGZvfVxuICAgICAqIEBuYW1lIHByZXZPcFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Nvbm5lY3R9XG4gICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jZGlzY29ubmVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnByZXZPcCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBJcyBzZXQgdG8gdHJ1ZSB3aGVuIGEgc3RhdGljIHBhcmFtZXRlciBpcyB1cGRhdGVkLiBPbiB0aGUgbmV4dCBpbnB1dFxuICAgICAqIGZyYW1lIGFsbCB0aGUgc3ViZ3JhcGggc3RyZWFtUGFyYW1zIHN0YXJ0aW5nIGZyb20gdGhpcyBub2RlIHdpbGwgYmVcbiAgICAgKiB1cGRhdGVkLlxuICAgICAqXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG5hbWUgX3JlaW5pdFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fcmVpbml0ID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBvYmplY3QgZGVzY3JpYmluZyBlYWNoIGF2YWlsYWJsZSBwYXJhbWV0ZXIgb2YgdGhlIG5vZGUuXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIGdldFBhcmFtc0Rlc2NyaXB0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy5nZXREZWZpbml0aW9ucygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IGFsbCBwYXJhbWV0ZXJzIHRvIHRoZWlyIGluaXRpYWwgdmFsdWUgKGFzIGRlZmluZWQgb24gaW5zdGFudGljYXRpb24pXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3N0cmVhbVBhcmFtc31cbiAgICovXG4gIHJlc2V0UGFyYW1zKCkge1xuICAgIHRoaXMucGFyYW1zLnJlc2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogRnVuY3Rpb24gY2FsbGVkIHdoZW4gYSBwYXJhbSBpcyB1cGRhdGVkLiBCeSBkZWZhdWx0IHNldCB0aGUgYF9yZWluaXRgXG4gICAqIGZsYWcgdG8gYHRydWVgIGlmIHRoZSBwYXJhbSBpcyBgc3RhdGljYCBvbmUuIFRoaXMgbWV0aG9kIHNob3VsZCBiZVxuICAgKiBleHRlbmRlZCB0byBoYW5kbGUgcGFydGljdWxhciBsb2dpYyBib3VuZCB0byBhIHNwZWNpZmljIHBhcmFtZXRlci5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIC0gVmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG1ldGFzIC0gTWV0YWRhdGEgYXNzb2NpYXRlZCB0byB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMgPSB7fSkge1xuICAgIGlmIChtZXRhcy5raW5kID09PSAnc3RhdGljJylcbiAgICAgIHRoaXMuX3JlaW5pdCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ29ubmVjdCB0aGUgY3VycmVudCBub2RlIChgcHJldk9wYCkgdG8gYW5vdGhlciBub2RlIChgbmV4dE9wYCkuXG4gICAqIEEgZ2l2ZW4gbm9kZSBjYW4gYmUgY29ubmVjdGVkIHRvIHNldmVyYWwgb3BlcmF0b3JzIGFuZCBwcm9wYWdhdGUgdGhlXG4gICAqIHN0cmVhbSB0byBlYWNoIG9mIHRoZW0uXG4gICAqXG4gICAqIEBwYXJhbSB7QmFzZUxmb30gbmV4dCAtIE5leHQgb3BlcmF0b3IgaW4gdGhlIGdyYXBoLlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzRnJhbWV9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Rpc2Nvbm5lY3R9XG4gICAqL1xuICBjb25uZWN0KG5leHQpIHtcbiAgICBpZiAoIShuZXh0IGluc3RhbmNlb2YgQmFzZUxmbykpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29ubmVjdGlvbjogY2hpbGQgbm9kZSBpcyBub3QgYW4gaW5zdGFuY2Ugb2YgYEJhc2VMZm9gJyk7XG5cbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMgPT09IG51bGwgfHxuZXh0LnN0cmVhbVBhcmFtcyA9PT0gbnVsbClcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb25uZWN0aW9uOiBjYW5ub3QgY29ubmVjdCBhIGRlYWQgbm9kZScpO1xuXG4gICAgdGhpcy5uZXh0T3BzLnB1c2gobmV4dCk7XG4gICAgbmV4dC5wcmV2T3AgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSAhPT0gbnVsbCkgLy8gZ3JhcGggaGFzIGFscmVhZHkgYmVlbiBzdGFydGVkXG4gICAgICBuZXh0LnByb2Nlc3NTdHJlYW1QYXJhbXModGhpcy5zdHJlYW1QYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgZ2l2ZW4gb3BlcmF0b3IgZnJvbSBpdHMgcHJldmlvdXMgb3BlcmF0b3JzJyBgbmV4dE9wc2AuXG4gICAqXG4gICAqIEBwYXJhbSB7QmFzZUxmb30gW25leHQ9bnVsbF0gLSBUaGUgb3BlcmF0b3IgdG8gZGlzY29ubmVjdCBmcm9tIHRoZSBjdXJyZW50XG4gICAqICBvcGVyYXRvci4gSWYgYG51bGxgIGRpc2Nvbm5lY3QgYWxsIHRoZSBuZXh0IG9wZXJhdG9ycy5cbiAgICovXG4gIGRpc2Nvbm5lY3QobmV4dCA9IG51bGwpIHtcbiAgICBpZiAobmV4dCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5uZXh0T3BzLmZvckVhY2goKG5leHQpID0+IHRoaXMuZGlzY29ubmVjdChuZXh0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5uZXh0T3BzLmluZGV4T2YodGhpcyk7XG4gICAgICB0aGlzLm5leHRPcHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIG5leHQucHJldk9wID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSBhbGwgdGhlIG5vZGVzIGluIHRoZSBzdWItZ3JhcGggc3RhcnRpbmcgZnJvbSB0aGUgY3VycmVudCBub2RlLlxuICAgKiBXaGVuIGRldHJveWVkLCB0aGUgYHN0cmVhbVBhcmFtc2Agb2YgdGhlIG5vZGUgYXJlIHNldCB0byBgbnVsbGAsIHRoZVxuICAgKiBvcGVyYXRvciBpcyB0aGVuIGNvbnNpZGVyZWQgYXMgYGRlYWRgIGFuZCBjYW5ub3QgYmUgcmVjb25uZWN0ZWQuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Nvbm5lY3R9XG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIC8vIGRlc3Ryb3kgYWxsIGNoaWRyZW5cbiAgICBsZXQgaW5kZXggPSB0aGlzLm5leHRPcHMubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGluZGV4LS0pXG4gICAgICB0aGlzLm5leHRPcHNbaW5kZXhdLmRlc3Ryb3koKTtcblxuICAgIC8vIGRpc2Nvbm5lY3QgaXRzZWxmIGZyb20gdGhlIHByZXZpb3VzIG9wZXJhdG9yXG4gICAgaWYgKHRoaXMucHJldk9wKVxuICAgICAgdGhpcy5wcmV2T3AuZGlzY29ubmVjdCh0aGlzKTtcblxuICAgIC8vIG1hcmsgdGhlIG9iamVjdCBhcyBkZWFkXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciB0byBpbml0aWFsaXplIHRoZSBzdHJlYW0gaW4gc3RhbmRhbG9uZSBtb2RlLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW3N0cmVhbVBhcmFtcz17fV0gLSBTdHJlYW0gcGFyYW1ldGVycyB0byBiZSB1c2VkLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNyZXNldFN0cmVhbX1cbiAgICovXG4gIGluaXRTdHJlYW0oc3RyZWFtUGFyYW1zID0ge30pIHtcbiAgICB0aGlzLnByb2Nlc3NTdHJlYW1QYXJhbXMoc3RyZWFtUGFyYW1zKTtcbiAgICB0aGlzLnJlc2V0U3RyZWFtKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGhlIGBmcmFtZS5kYXRhYCBidWZmZXIgYnkgc2V0dGluZyBhbGwgaXRzIHZhbHVlcyB0byAwLlxuICAgKiBBIHNvdXJjZSBvcGVyYXRvciBzaG91bGQgY2FsbCBgcHJvY2Vzc1N0cmVhbVBhcmFtc2AgYW5kIGByZXNldFN0cmVhbWAgd2hlblxuICAgKiBzdGFydGVkLCBlYWNoIG9mIHRoZXNlIG1ldGhvZCBwcm9wYWdhdGUgdGhyb3VnaCB0aGUgZ3JhcGggYXV0b21hdGljYWx5LlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzU3RyZWFtUGFyYW1zfVxuICAgKi9cbiAgcmVzZXRTdHJlYW0oKSB7XG4gICAgLy8gYnV0dG9tIHVwXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm5leHRPcHMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgdGhpcy5uZXh0T3BzW2ldLnJlc2V0U3RyZWFtKCk7XG5cbiAgICAvLyBubyBidWZmZXIgZm9yIGBzY2FsYXJgIHR5cGUgb3Igc2luayBub2RlXG4gICAgaWYgKHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSAhPT0gJ3NjYWxhcicgJiYgdGhpcy5mcmFtZS5kYXRhICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgICBjb25zdCBkYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKVxuICAgICAgICBkYXRhW2ldID0gMDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmluYWxpemUgdGhlIHN0cmVhbS4gQSBzb3VyY2Ugbm9kZSBzaG91bGQgY2FsbCB0aGlzIG1ldGhvZCB3aGVuIHN0b3BwZWQsXG4gICAqIGBmaW5hbGl6ZVN0cmVhbWAgaXMgYXV0b21hdGljYWxseSBwcm9wYWdhdGVkIHRocm91Z2h0IHRoZSBncmFwaC5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGVuZFRpbWUgLSBMb2dpY2FsIHRpbWUgYXQgd2hpY2ggdGhlIGdyYXBoIGlzIHN0b3BwZWQuXG4gICAqL1xuICBmaW5hbGl6ZVN0cmVhbShlbmRUaW1lKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm5leHRPcHMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgdGhpcy5uZXh0T3BzW2ldLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgb3IgdXBkYXRlIHRoZSBvcGVyYXRvcidzIGBzdHJlYW1QYXJhbXNgIGFjY29yZGluZyB0byB0aGVcbiAgICogcHJldmlvdXMgb3BlcmF0b3JzIGBzdHJlYW1QYXJhbXNgIHZhbHVlcy5cbiAgICpcbiAgICogV2hlbiBpbXBsZW1lbnRpbmcgYSBuZXcgb3BlcmF0b3IgdGhpcyBtZXRob2Qgc2hvdWxkOlxuICAgKiAxLiBjYWxsIGB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXNgIHdpdGggdGhlIGdpdmVuIGBwcmV2U3RyZWFtUGFyYW1zYFxuICAgKiAyLiBvcHRpb25uYWxseSBjaGFuZ2UgdmFsdWVzIHRvIGB0aGlzLnN0cmVhbVBhcmFtc2AgYWNjb3JkaW5nIHRvIHRoZVxuICAgKiAgICBsb2dpYyBwZXJmb3JtZWQgYnkgdGhlIG9wZXJhdG9yLlxuICAgKiAzLiBvcHRpb25uYWxseSBhbGxvY2F0ZSBtZW1vcnkgZm9yIHJpbmcgYnVmZmVycywgZXRjLlxuICAgKiA0LiBjYWxsIGB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtc2AgdG8gdHJpZ2dlciB0aGUgbWV0aG9kIG9uIHRoZSBuZXh0XG4gICAqICAgIG9wZXJhdG9ycyBpbiB0aGUgZ3JhcGguXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcmV2U3RyZWFtUGFyYW1zIC0gYHN0cmVhbVBhcmFtc2Agb2YgdGhlIHByZXZpb3VzIG9wZXJhdG9yLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcmVwYXJlU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9wYWdhdGVTdHJlYW1QYXJhbXN9XG4gICAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbW1vbiBsb2dpYyB0byBkbyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBgcHJvY2Vzc1N0cmVhbVBhcmFtYCwgbXVzdCBiZVxuICAgKiBjYWxsZWQgYXQgdGhlIGJlZ2lubmluZyBvZiBhbnkgYHByb2Nlc3NTdHJlYW1QYXJhbWAgaW1wbGVtZW50YXRpb24uXG4gICAqXG4gICAqIFRoZSBtZXRob2QgbWFpbmx5IGNoZWNrIGlmIHRoZSBjdXJyZW50IG5vZGUgaW1wbGVtZW50IHRoZSBpbnRlcmZhY2UgdG9cbiAgICogaGFuZGxlIHRoZSB0eXBlIG9mIGZyYW1lIHByb3BhZ2F0ZWQgYnkgaXQncyBwYXJlbnQ6XG4gICAqIC0gdG8gaGFuZGxlIGEgYHZlY3RvcmAgZnJhbWUgdHlwZSwgdGhlIGNsYXNzIG11c3QgaW1wbGVtZW50IGBwcm9jZXNzVmVjdG9yYFxuICAgKiAtIHRvIGhhbmRsZSBhIGBzaWduYWxgIGZyYW1lIHR5cGUsIHRoZSBjbGFzcyBtdXN0IGltcGxlbWVudCBgcHJvY2Vzc1NpZ25hbGBcbiAgICogLSBpbiBjYXNlIG9mIGEgJ3NjYWxhcicgZnJhbWUgdHlwZSwgdGhlIGNsYXNzIGNhbiBpbXBsZW1lbnQgYW55IG9mIHRoZVxuICAgKiBmb2xsb3dpbmcgYnkgb3JkZXIgb2YgcHJlZmVyZW5jZTogYHByb2Nlc3NTY2FsYXJgLCBgcHJvY2Vzc1ZlY3RvcmAsXG4gICAqIGBwcm9jZXNzU2lnbmFsYC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHByZXZTdHJlYW1QYXJhbXMgLSBgc3RyZWFtUGFyYW1zYCBvZiB0aGUgcHJldmlvdXMgb3BlcmF0b3IuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb3BhZ2F0ZVN0cmVhbVBhcmFtc31cbiAgICovXG4gIHByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyA9IHt9KSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0cmVhbVBhcmFtcywgcHJldlN0cmVhbVBhcmFtcyk7XG4gICAgY29uc3QgcHJldkZyYW1lVHlwZSA9IHByZXZTdHJlYW1QYXJhbXMuZnJhbWVUeXBlO1xuXG4gICAgc3dpdGNoIChwcmV2RnJhbWVUeXBlKSB7XG4gICAgICBjYXNlICdzY2FsYXInOlxuICAgICAgICBpZiAodGhpcy5wcm9jZXNzU2NhbGFyKVxuICAgICAgICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5wcm9jZXNzU2NhbGFyO1xuICAgICAgICBlbHNlIGlmICh0aGlzLnByb2Nlc3NWZWN0b3IpXG4gICAgICAgICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLnByb2Nlc3NWZWN0b3I7XG4gICAgICAgIGVsc2UgaWYgKHRoaXMucHJvY2Vzc1NpZ25hbClcbiAgICAgICAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbiA9IHRoaXMucHJvY2Vzc1NpZ25hbDtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9IC0gbm8gXCJwcm9jZXNzXCIgZnVuY3Rpb24gZm91bmRgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd2ZWN0b3InOlxuICAgICAgICBpZiAoISgncHJvY2Vzc1ZlY3RvcicgaW4gdGhpcykpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMuY29uc3RydWN0b3IubmFtZX0gLSBcInByb2Nlc3NWZWN0b3JcIiBpcyBub3QgZGVmaW5lZGApO1xuXG4gICAgICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5wcm9jZXNzVmVjdG9yO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NpZ25hbCc6XG4gICAgICAgIGlmICghKCdwcm9jZXNzU2lnbmFsJyBpbiB0aGlzKSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSAtIFwicHJvY2Vzc1NpZ25hbFwiIGlzIG5vdCBkZWZpbmVkYCk7XG5cbiAgICAgICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLnByb2Nlc3NTaWduYWw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgLy8gZGVmYXVsdHMgdG8gcHJvY2Vzc0Z1bmN0aW9uXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIGB0aGlzLmZyYW1lLmRhdGFgIGJ1ZmZlciBhbmQgZm9yd2FyZCB0aGUgb3BlcmF0b3IncyBgc3RyZWFtUGFyYW1gXG4gICAqIHRvIGFsbCBpdHMgbmV4dCBvcGVyYXRvcnMsIG11c3QgYmUgY2FsbGVkIGF0IHRoZSBlbmQgb2YgYW55XG4gICAqIGBwcm9jZXNzU3RyZWFtUGFyYW1zYCBpbXBsZW1lbnRhdGlvbi5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJlcGFyZVN0cmVhbVBhcmFtc31cbiAgICovXG4gIHByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpIHtcbiAgICB0aGlzLmZyYW1lLmRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubmV4dE9wcy5sZW5ndGg7IGkgPCBsOyBpKyspXG4gICAgICB0aGlzLm5leHRPcHNbaV0ucHJvY2Vzc1N0cmVhbVBhcmFtcyh0aGlzLnN0cmVhbVBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIHRoZSBwYXJ0aWN1bGFyIGxvZ2ljIHRoZSBvcGVyYXRvciBhcHBsaWVzIHRvIHRoZSBzdHJlYW0uXG4gICAqIEFjY29yZGluZyB0byB0aGUgZnJhbWUgdHlwZSBvZiB0aGUgcHJldmlvdXMgbm9kZSwgdGhlIG1ldGhvZCBjYWxscyBvbmVcbiAgICogb2YgdGhlIGZvbGxvd2luZyBtZXRob2QgYHByb2Nlc3NWZWN0b3JgLCBgcHJvY2Vzc1NpZ25hbGAgb3IgYHByb2Nlc3NTY2FsYXJgXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmcmFtZSAtIEZyYW1lICh0aW1lLCBkYXRhLCBhbmQgbWV0YWRhdGEpIGFzIGdpdmVuIGJ5IHRoZVxuICAgKiAgcHJldmlvdXMgb3BlcmF0b3IuIFRoZSBpbmNvbW1pbmcgZnJhbWUgc2hvdWxkIG5ldmVyIGJlIG1vZGlmaWVkIGJ5XG4gICAqICB0aGUgb3BlcmF0b3IuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3ByZXBhcmVGcmFtZX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvcGFnYXRlRnJhbWV9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqL1xuICBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgICB0aGlzLnByZXBhcmVGcmFtZSgpO1xuXG4gICAgLy8gZnJhbWVUaW1lIGFuZCBmcmFtZU1ldGFkYXRhIGRlZmF1bHRzIHRvIGlkZW50aXR5XG4gICAgdGhpcy5mcmFtZS50aW1lID0gZnJhbWUudGltZTtcbiAgICB0aGlzLmZyYW1lLm1ldGFkYXRhID0gZnJhbWUubWV0YWRhdGE7XG5cbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG4gICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBvaW50ZXIgdG8gdGhlIG1ldGhvZCBjYWxsZWQgaW4gYHByb2Nlc3NGcmFtZWAgYWNjb3JkaW5nIHRvIHRoZVxuICAgKiBmcmFtZSB0eXBlIG9mIHRoZSBwcmV2aW91cyBvcGVyYXRvci4gSXMgZHluYW1pY2FsbHkgYXNzaWduZWQgaW5cbiAgICogYHByZXBhcmVTdHJlYW1QYXJhbXNgLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcmVwYXJlU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzRnJhbWV9XG4gICAqL1xuICBwcm9jZXNzRnVuY3Rpb24oZnJhbWUpIHtcbiAgICB0aGlzLmZyYW1lID0gZnJhbWU7XG4gIH1cblxuICAvKipcbiAgICogQ29tbW9uIGxvZ2ljIHRvIHBlcmZvcm0gYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgYHByb2Nlc3NGcmFtZWAuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NGcmFtZX1cbiAgICovXG4gIHByZXBhcmVGcmFtZSgpIHtcbiAgICBpZiAodGhpcy5fcmVpbml0ID09PSB0cnVlKSB7XG4gICAgICBjb25zdCBzdHJlYW1QYXJhbXMgPSB0aGlzLnByZXZPcCAhPT0gbnVsbCA/IHRoaXMucHJldk9wLnN0cmVhbVBhcmFtcyA6IHt9O1xuICAgICAgdGhpcy5pbml0U3RyZWFtKHN0cmVhbVBhcmFtcyk7XG4gICAgICB0aGlzLl9yZWluaXQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRm9yd2FyZCB0aGUgY3VycmVudCBgZnJhbWVgIHRvIHRoZSBuZXh0IG9wZXJhdG9ycywgaXMgY2FsbGVkIGF0IHRoZSBlbmQgb2ZcbiAgICogYHByb2Nlc3NGcmFtZWAuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NGcmFtZX1cbiAgICovXG4gIHByb3BhZ2F0ZUZyYW1lKCkge1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5uZXh0T3BzLmxlbmd0aDsgaSA8IGw7IGkrKylcbiAgICAgIHRoaXMubmV4dE9wc1tpXS5wcm9jZXNzRnJhbWUodGhpcy5mcmFtZSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmFzZUxmbztcblxuIiwiZXhwb3J0IGNvbnN0IHZlcnNpb24gPSAnJXZlcnNpb24lJztcblxuZXhwb3J0IHsgZGVmYXVsdCBhcyBCYXNlTGZvIH0gZnJvbSAnLi9CYXNlTGZvJztcbiIsImltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcblxuY29uc3QgQXVkaW9Db250ZXh0ID0gKHdpbmRvdy5BdWRpb0NvbnRleHQgfHzCoHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpO1xuY29uc3QgYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuXG5jb25zdCBmcmFtZVNpemUgPSBNYXRoLmZsb29yKDAuMDIwICogYXVkaW9Db250ZXh0LnNhbXBsZVJhdGUpO1xuY29uc3QgaG9wU2l6ZSA9IE1hdGguZmxvb3IoMC4wMDUgKiBhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSk7XG5cbm5hdmlnYXRvci5tZWRpYURldmljZXNcbiAgLmdldFVzZXJNZWRpYSh7IGF1ZGlvOiB0cnVlIH0pXG4gIC50aGVuKGluaXQpXG4gIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVyci5zdGFjaykpO1xuXG5mdW5jdGlvbiBpbml0KHN0cmVhbSkge1xuICBjb25zdCBzb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlTWVkaWFTdHJlYW1Tb3VyY2Uoc3RyZWFtKTtcblxuICBjb25zdCBhdWRpb0luTm9kZSA9IG5ldyBsZm8uc291cmNlLkF1ZGlvSW5Ob2RlKHtcbiAgICBzb3VyY2VOb2RlOiBzb3VyY2UsXG4gICAgYXVkaW9Db250ZXh0OiBhdWRpb0NvbnRleHQsXG4gIH0pO1xuXG4gIGNvbnN0IHNsaWNlciA9IG5ldyBsZm8ub3BlcmF0b3IuU2xpY2VyKHtcbiAgICBmcmFtZVNpemU6IGZyYW1lU2l6ZSxcbiAgICBob3BTaXplOiBob3BTaXplLFxuICAgIGNlbnRlcmVkVGltZVRhZ3M6IHRydWVcbiAgfSk7XG5cbiAgY29uc3QgcG93ZXIgPSBuZXcgbGZvLm9wZXJhdG9yLlJtcyh7XG4gICAgcG93ZXI6IHRydWUsXG4gIH0pO1xuXG4gIGNvbnN0IHNlZ21lbnRlciA9IG5ldyBsZm8ub3BlcmF0b3IuU2VnbWVudGVyKHtcbiAgICBsb2dJbnB1dDogdHJ1ZSxcbiAgICBmaWx0ZXJPcmRlcjogNSxcbiAgICB0aHJlc2hvbGQ6IDQsXG4gICAgb2ZmVGhyZXNob2xkOiAtSW5maW5pdHksXG4gICAgbWluSW50ZXI6IDAuMTAwLFxuICAgIG1heER1cmF0aW9uOiAwLjAyMCxcbiAgfSk7XG5cbiAgY29uc3Qgd2F2ZWZvcm1EaXNwbGF5ID0gbmV3IGxmby5zaW5rLldhdmVmb3JtRGlzcGxheSh7XG4gICAgY2FudmFzOiAnI3dhdmVmb3JtJyxcbiAgfSk7XG5cbiAgY29uc3QgbWFya2VyRGlzcGxheSA9IG5ldyBsZm8uc2luay5NYXJrZXJEaXNwbGF5KHtcbiAgICBjYW52YXM6ICcjbWFya2VycycsXG4gIH0pO1xuXG4gIG5ldyBsZm8udXRpbHMuRGlzcGxheVN5bmMod2F2ZWZvcm1EaXNwbGF5LCBtYXJrZXJEaXNwbGF5KTtcblxuICBhdWRpb0luTm9kZS5jb25uZWN0KHNsaWNlcik7XG4gIGF1ZGlvSW5Ob2RlLmNvbm5lY3Qod2F2ZWZvcm1EaXNwbGF5KTtcbiAgc2xpY2VyLmNvbm5lY3QocG93ZXIpO1xuICBwb3dlci5jb25uZWN0KHNlZ21lbnRlcik7XG4gIHNlZ21lbnRlci5jb25uZWN0KG1hcmtlckRpc3BsYXkpO1xuXG4gIGF1ZGlvSW5Ob2RlLnN0YXJ0KCk7XG59XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL21hdGgvbG9nMTBcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vbnVtYmVyL2lzLWZpbml0ZVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvYXNzaWduXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9jcmVhdGVcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtcHJvdG90eXBlLW9mXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbFwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaXRlcmF0b3JcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9vYmplY3QvZGVmaW5lLXByb3BlcnR5XCIpO1xuXG52YXIgX2RlZmluZVByb3BlcnR5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlZmluZVByb3BlcnR5KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICgwLCBfZGVmaW5lUHJvcGVydHkyLmRlZmF1bHQpKHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gIH07XG59KCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9vYmplY3QvZGVmaW5lLXByb3BlcnR5XCIpO1xuXG52YXIgX2RlZmluZVByb3BlcnR5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlZmluZVByb3BlcnR5KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKG9iaiwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5IGluIG9iaikge1xuICAgICgwLCBfZGVmaW5lUHJvcGVydHkyLmRlZmF1bHQpKG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZlwiKTtcblxudmFyIF9nZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRQcm90b3R5cGVPZik7XG5cbnZhciBfZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L2dldC1vd24tcHJvcGVydHktZGVzY3JpcHRvclwiKTtcblxudmFyIF9nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gZ2V0KG9iamVjdCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gIGlmIChvYmplY3QgPT09IG51bGwpIG9iamVjdCA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbiAgdmFyIGRlc2MgPSAoMCwgX2dldE93blByb3BlcnR5RGVzY3JpcHRvcjIuZGVmYXVsdCkob2JqZWN0LCBwcm9wZXJ0eSk7XG5cbiAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkge1xuICAgIHZhciBwYXJlbnQgPSAoMCwgX2dldFByb3RvdHlwZU9mMi5kZWZhdWx0KShvYmplY3QpO1xuXG4gICAgaWYgKHBhcmVudCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGdldChwYXJlbnQsIHByb3BlcnR5LCByZWNlaXZlcik7XG4gICAgfVxuICB9IGVsc2UgaWYgKFwidmFsdWVcIiBpbiBkZXNjKSB7XG4gICAgcmV0dXJuIGRlc2MudmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGdldHRlciA9IGRlc2MuZ2V0O1xuXG4gICAgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfc2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9vYmplY3Qvc2V0LXByb3RvdHlwZS1vZlwiKTtcblxudmFyIF9zZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zZXRQcm90b3R5cGVPZik7XG5cbnZhciBfY3JlYXRlID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L2NyZWF0ZVwiKTtcblxudmFyIF9jcmVhdGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlKTtcblxudmFyIF90eXBlb2YyID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvdHlwZW9mXCIpO1xuXG52YXIgX3R5cGVvZjMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90eXBlb2YyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArICh0eXBlb2Ygc3VwZXJDbGFzcyA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiAoMCwgX3R5cGVvZjMuZGVmYXVsdCkoc3VwZXJDbGFzcykpKTtcbiAgfVxuXG4gIHN1YkNsYXNzLnByb3RvdHlwZSA9ICgwLCBfY3JlYXRlMi5kZWZhdWx0KShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuICBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mMi5kZWZhdWx0ID8gKDAsIF9zZXRQcm90b3R5cGVPZjIuZGVmYXVsdCkoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzcztcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfdHlwZW9mMiA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL3R5cGVvZlwiKTtcblxudmFyIF90eXBlb2YzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdHlwZW9mMik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChzZWxmLCBjYWxsKSB7XG4gIGlmICghc2VsZikge1xuICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtcbiAgfVxuXG4gIHJldHVybiBjYWxsICYmICgodHlwZW9mIGNhbGwgPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogKDAsIF90eXBlb2YzLmRlZmF1bHQpKGNhbGwpKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9pdGVyYXRvciA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL3N5bWJvbC9pdGVyYXRvclwiKTtcblxudmFyIF9pdGVyYXRvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pdGVyYXRvcik7XG5cbnZhciBfc3ltYm9sID0gcmVxdWlyZShcIi4uL2NvcmUtanMvc3ltYm9sXCIpO1xuXG52YXIgX3N5bWJvbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zeW1ib2wpO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBfc3ltYm9sMi5kZWZhdWx0ID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIF9pdGVyYXRvcjIuZGVmYXVsdCA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIF9zeW1ib2wyLmRlZmF1bHQgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IF9zeW1ib2wyLmRlZmF1bHQgJiYgb2JqICE9PSBfc3ltYm9sMi5kZWZhdWx0LnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSB0eXBlb2YgX3N5bWJvbDIuZGVmYXVsdCA9PT0gXCJmdW5jdGlvblwiICYmIF90eXBlb2YoX2l0ZXJhdG9yMi5kZWZhdWx0KSA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZihvYmopO1xufSA6IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgX3N5bWJvbDIuZGVmYXVsdCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gX3N5bWJvbDIuZGVmYXVsdCAmJiBvYmogIT09IF9zeW1ib2wyLmRlZmF1bHQucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmogPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZihvYmopO1xufTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5tYXRoLmxvZzEwJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5NYXRoLmxvZzEwOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm51bWJlci5pcy1maW5pdGUnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk51bWJlci5pc0Zpbml0ZTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3QuYXNzaWduOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5jcmVhdGUnKTtcbnZhciAkT2JqZWN0ID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlKFAsIEQpe1xuICByZXR1cm4gJE9iamVjdC5jcmVhdGUoUCwgRCk7XG59OyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5kZWZpbmUtcHJvcGVydHknKTtcbnZhciAkT2JqZWN0ID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgZGVzYyl7XG4gIHJldHVybiAkT2JqZWN0LmRlZmluZVByb3BlcnR5KGl0LCBrZXksIGRlc2MpO1xufTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yJyk7XG52YXIgJE9iamVjdCA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3Q7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KXtcbiAgcmV0dXJuICRPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpO1xufTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LXByb3RvdHlwZS1vZicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LmdldFByb3RvdHlwZU9mOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3Quc2V0UHJvdG90eXBlT2Y7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3ltYm9sJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNy5zeW1ib2wuYXN5bmMtaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM3LnN5bWJvbC5vYnNlcnZhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5TeW1ib2w7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fd2tzLWV4dCcpLmYoJ2l0ZXJhdG9yJyk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKCFpc09iamVjdChpdCkpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9MZW5ndGggID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCB0b0luZGV4ICAgPSByZXF1aXJlKCcuL190by1pbmRleCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihJU19JTkNMVURFUyl7XG4gIHJldHVybiBmdW5jdGlvbigkdGhpcywgZWwsIGZyb21JbmRleCl7XG4gICAgdmFyIE8gICAgICA9IHRvSU9iamVjdCgkdGhpcylcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXG4gICAgICAsIGluZGV4ICA9IHRvSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpXG4gICAgICAsIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICBpZihJU19JTkNMVURFUyAmJiBlbCAhPSBlbCl3aGlsZShsZW5ndGggPiBpbmRleCl7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICBpZih2YWx1ZSAhPSB2YWx1ZSlyZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSN0b0luZGV4IGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTyl7XG4gICAgICBpZihPW2luZGV4XSA9PT0gZWwpcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTsiLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59OyIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7dmVyc2lvbjogJzIuNC4wJ307XG5pZih0eXBlb2YgX19lID09ICdudW1iZXInKV9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZih0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xuICBzd2l0Y2gobGVuZ3RoKXtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59OyIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnRcbiAgLy8gaW4gb2xkIElFIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnXG4gICwgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07IiwiLy8gSUUgOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSAoXG4gICdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnXG4pLnNwbGl0KCcsJyk7IiwiLy8gYWxsIGVudW1lcmFibGUgb2JqZWN0IGtleXMsIGluY2x1ZGVzIHN5bWJvbHNcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIGdPUFMgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpXG4gICwgcElFICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgcmVzdWx0ICAgICA9IGdldEtleXMoaXQpXG4gICAgLCBnZXRTeW1ib2xzID0gZ09QUy5mO1xuICBpZihnZXRTeW1ib2xzKXtcbiAgICB2YXIgc3ltYm9scyA9IGdldFN5bWJvbHMoaXQpXG4gICAgICAsIGlzRW51bSAgPSBwSUUuZlxuICAgICAgLCBpICAgICAgID0gMFxuICAgICAgLCBrZXk7XG4gICAgd2hpbGUoc3ltYm9scy5sZW5ndGggPiBpKWlmKGlzRW51bS5jYWxsKGl0LCBrZXkgPSBzeW1ib2xzW2krK10pKXJlc3VsdC5wdXNoKGtleSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07IiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgY29yZSAgICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgY3R4ICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBoaWRlICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbih0eXBlLCBuYW1lLCBzb3VyY2Upe1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRlxuICAgICwgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuR1xuICAgICwgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuU1xuICAgICwgSVNfUFJPVE8gID0gdHlwZSAmICRleHBvcnQuUFxuICAgICwgSVNfQklORCAgID0gdHlwZSAmICRleHBvcnQuQlxuICAgICwgSVNfV1JBUCAgID0gdHlwZSAmICRleHBvcnQuV1xuICAgICwgZXhwb3J0cyAgID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSlcbiAgICAsIGV4cFByb3RvICA9IGV4cG9ydHNbUFJPVE9UWVBFXVxuICAgICwgdGFyZ2V0ICAgID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXVxuICAgICwga2V5LCBvd24sIG91dDtcbiAgaWYoSVNfR0xPQkFMKXNvdXJjZSA9IG5hbWU7XG4gIGZvcihrZXkgaW4gc291cmNlKXtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIGlmKG93biAmJiBrZXkgaW4gZXhwb3J0cyljb250aW51ZTtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG4gICAgZXhwb3J0c1trZXldID0gSVNfR0xPQkFMICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nID8gc291cmNlW2tleV1cbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcbiAgICA6IElTX1dSQVAgJiYgdGFyZ2V0W2tleV0gPT0gb3V0ID8gKGZ1bmN0aW9uKEMpe1xuICAgICAgdmFyIEYgPSBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgICAgaWYodGhpcyBpbnN0YW5jZW9mIEMpe1xuICAgICAgICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKXtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIG5ldyBDO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gbmV3IEMoYSk7XG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiBuZXcgQyhhLCBiKTtcbiAgICAgICAgICB9IHJldHVybiBuZXcgQyhhLCBiLCBjKTtcbiAgICAgICAgfSByZXR1cm4gQy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICAgIEZbUFJPVE9UWVBFXSA9IENbUFJPVE9UWVBFXTtcbiAgICAgIHJldHVybiBGO1xuICAgIC8vIG1ha2Ugc3RhdGljIHZlcnNpb25zIGZvciBwcm90b3R5cGUgbWV0aG9kc1xuICAgIH0pKG91dCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUubWV0aG9kcy4lTkFNRSVcbiAgICBpZihJU19QUk9UTyl7XG4gICAgICAoZXhwb3J0cy52aXJ0dWFsIHx8IChleHBvcnRzLnZpcnR1YWwgPSB7fSkpW2tleV0gPSBvdXQ7XG4gICAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUucHJvdG90eXBlLiVOQU1FJVxuICAgICAgaWYodHlwZSAmICRleHBvcnQuUiAmJiBleHBQcm90byAmJiAhZXhwUHJvdG9ba2V5XSloaWRlKGV4cFByb3RvLCBrZXksIG91dCk7XG4gICAgfVxuICB9XG59O1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YCBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07IiwidmFyIGRQICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50OyIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07IiwiLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZyl7XG4gIHJldHVybiBjb2YoYXJnKSA9PSAnQXJyYXknO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNyZWF0ZSAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpXG4gICwgZGVzY3JpcHRvciAgICAgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faGlkZScpKEl0ZXJhdG9yUHJvdG90eXBlLCByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KXtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7bmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KX0pO1xuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIGhpZGUgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIEl0ZXJhdG9ycyAgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCAkaXRlckNyZWF0ZSAgICA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKVxuICAsIElURVJBVE9SICAgICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBCVUdHWSAgICAgICAgICA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKSAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG4gICwgRkZfSVRFUkFUT1IgICAgPSAnQEBpdGVyYXRvcidcbiAgLCBLRVlTICAgICAgICAgICA9ICdrZXlzJ1xuICAsIFZBTFVFUyAgICAgICAgID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKXtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24oa2luZCl7XG4gICAgaWYoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaChraW5kKXtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHICAgICAgICA9IE5BTUUgKyAnIEl0ZXJhdG9yJ1xuICAgICwgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTXG4gICAgLCBWQUxVRVNfQlVHID0gZmFsc2VcbiAgICAsIHByb3RvICAgICAgPSBCYXNlLnByb3RvdHlwZVxuICAgICwgJG5hdGl2ZSAgICA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXVxuICAgICwgJGRlZmF1bHQgICA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpXG4gICAgLCAkZW50cmllcyAgID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZFxuICAgICwgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmVcbiAgICAsIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYoJGFueU5hdGl2ZSl7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UpKTtcbiAgICBpZihJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSl7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYoIUxJQlJBUlkgJiYgIWhhcyhJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IpKWhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZihERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpe1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKXtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddICA9IHJldHVyblRoaXM7XG4gIGlmKERFRkFVTFQpe1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6ICBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6ICAgIElTX1NFVCAgICAgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZihGT1JDRUQpZm9yKGtleSBpbiBtZXRob2RzKXtcbiAgICAgIGlmKCEoa2V5IGluIHByb3RvKSlyZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZG9uZSwgdmFsdWUpe1xuICByZXR1cm4ge3ZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJ2YXIgZ2V0S2V5cyAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBlbCl7XG4gIHZhciBPICAgICAgPSB0b0lPYmplY3Qob2JqZWN0KVxuICAgICwga2V5cyAgID0gZ2V0S2V5cyhPKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGluZGV4ICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobGVuZ3RoID4gaW5kZXgpaWYoT1trZXkgPSBrZXlzW2luZGV4KytdXSA9PT0gZWwpcmV0dXJuIGtleTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB0cnVlOyIsInZhciBNRVRBICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpKCdtZXRhJylcbiAgLCBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgaGFzICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHNldERlc2MgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGlkICAgICAgID0gMDtcbnZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGZ1bmN0aW9uKCl7XG4gIHJldHVybiB0cnVlO1xufTtcbnZhciBGUkVFWkUgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gaXNFeHRlbnNpYmxlKE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh7fSkpO1xufSk7XG52YXIgc2V0TWV0YSA9IGZ1bmN0aW9uKGl0KXtcbiAgc2V0RGVzYyhpdCwgTUVUQSwge3ZhbHVlOiB7XG4gICAgaTogJ08nICsgKytpZCwgLy8gb2JqZWN0IElEXG4gICAgdzoge30gICAgICAgICAgLy8gd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfX0pO1xufTtcbnZhciBmYXN0S2V5ID0gZnVuY3Rpb24oaXQsIGNyZWF0ZSl7XG4gIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnID8gaXQgOiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xuICBpZighaGFzKGl0LCBNRVRBKSl7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZighaXNFeHRlbnNpYmxlKGl0KSlyZXR1cm4gJ0YnO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYoIWNyZWF0ZSlyZXR1cm4gJ0UnO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBvYmplY3QgSURcbiAgfSByZXR1cm4gaXRbTUVUQV0uaTtcbn07XG52YXIgZ2V0V2VhayA9IGZ1bmN0aW9uKGl0LCBjcmVhdGUpe1xuICBpZighaGFzKGl0LCBNRVRBKSl7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZighaXNFeHRlbnNpYmxlKGl0KSlyZXR1cm4gdHJ1ZTtcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmKCFjcmVhdGUpcmV0dXJuIGZhbHNlO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBoYXNoIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gcmV0dXJuIGl0W01FVEFdLnc7XG59O1xuLy8gYWRkIG1ldGFkYXRhIG9uIGZyZWV6ZS1mYW1pbHkgbWV0aG9kcyBjYWxsaW5nXG52YXIgb25GcmVlemUgPSBmdW5jdGlvbihpdCl7XG4gIGlmKEZSRUVaRSAmJiBtZXRhLk5FRUQgJiYgaXNFeHRlbnNpYmxlKGl0KSAmJiAhaGFzKGl0LCBNRVRBKSlzZXRNZXRhKGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciBtZXRhID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIEtFWTogICAgICBNRVRBLFxuICBORUVEOiAgICAgZmFsc2UsXG4gIGZhc3RLZXk6ICBmYXN0S2V5LFxuICBnZXRXZWFrOiAgZ2V0V2VhayxcbiAgb25GcmVlemU6IG9uRnJlZXplXG59OyIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMi4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UsIC4uLilcbnZhciBnZXRLZXlzICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCBnT1BTICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJylcbiAgLCBwSUUgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKVxuICAsIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCBJT2JqZWN0ICA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsICRhc3NpZ24gID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9ICEkYXNzaWduIHx8IHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgdmFyIEEgPSB7fVxuICAgICwgQiA9IHt9XG4gICAgLCBTID0gU3ltYm9sKClcbiAgICAsIEsgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3QnO1xuICBBW1NdID0gNztcbiAgSy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbihrKXsgQltrXSA9IGs7IH0pO1xuICByZXR1cm4gJGFzc2lnbih7fSwgQSlbU10gIT0gNyB8fCBPYmplY3Qua2V5cygkYXNzaWduKHt9LCBCKSkuam9pbignJykgIT0gSztcbn0pID8gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgVCAgICAgPSB0b09iamVjdCh0YXJnZXQpXG4gICAgLCBhTGVuICA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAsIGluZGV4ID0gMVxuICAgICwgZ2V0U3ltYm9scyA9IGdPUFMuZlxuICAgICwgaXNFbnVtICAgICA9IHBJRS5mO1xuICB3aGlsZShhTGVuID4gaW5kZXgpe1xuICAgIHZhciBTICAgICAgPSBJT2JqZWN0KGFyZ3VtZW50c1tpbmRleCsrXSlcbiAgICAgICwga2V5cyAgID0gZ2V0U3ltYm9scyA/IGdldEtleXMoUykuY29uY2F0KGdldFN5bWJvbHMoUykpIDogZ2V0S2V5cyhTKVxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICAgLCBqICAgICAgPSAwXG4gICAgICAsIGtleTtcbiAgICB3aGlsZShsZW5ndGggPiBqKWlmKGlzRW51bS5jYWxsKFMsIGtleSA9IGtleXNbaisrXSkpVFtrZXldID0gU1trZXldO1xuICB9IHJldHVybiBUO1xufSA6ICRhc3NpZ247IiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGRQcyAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpXG4gICwgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJylcbiAgLCBJRV9QUk9UTyAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKVxuICAsIEVtcHR5ICAgICAgID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfVxuICAsIFBST1RPVFlQRSAgID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24oKXtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJylcbiAgICAsIGkgICAgICA9IGVudW1CdWdLZXlzLmxlbmd0aFxuICAgICwgbHQgICAgID0gJzwnXG4gICAgLCBndCAgICAgPSAnPidcbiAgICAsIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlKGktLSlkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2ldXTtcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcyl7XG4gIHZhciByZXN1bHQ7XG4gIGlmKE8gIT09IG51bGwpe1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCB0b1ByaW1pdGl2ZSAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXG4gICwgZFAgICAgICAgICAgICAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIGlmKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcyl0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZigndmFsdWUnIGluIEF0dHJpYnV0ZXMpT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTsiLCJ2YXIgZFAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBnZXRLZXlzICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzICAgPSBnZXRLZXlzKFByb3BlcnRpZXMpXG4gICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICwgaSA9IDBcbiAgICAsIFA7XG4gIHdoaWxlKGxlbmd0aCA+IGkpZFAuZihPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcbiAgcmV0dXJuIE87XG59OyIsInZhciBwSUUgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKVxuICAsIGNyZWF0ZURlc2MgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICwgdG9JT2JqZWN0ICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCB0b1ByaW1pdGl2ZSAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKVxuICAsIGdPUEQgICAgICAgICAgID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcblxuZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGdPUEQgOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUCl7XG4gIE8gPSB0b0lPYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgaWYoSUU4X0RPTV9ERUZJTkUpdHJ5IHtcbiAgICByZXR1cm4gZ09QRChPLCBQKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICBpZihoYXMoTywgUCkpcmV0dXJuIGNyZWF0ZURlc2MoIXBJRS5mLmNhbGwoTywgUCksIE9bUF0pO1xufTsiLCIvLyBmYWxsYmFjayBmb3IgSUUxMSBidWdneSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB3aXRoIGlmcmFtZSBhbmQgd2luZG93XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgZ09QTiAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mXG4gICwgdG9TdHJpbmcgID0ge30udG9TdHJpbmc7XG5cbnZhciB3aW5kb3dOYW1lcyA9IHR5cGVvZiB3aW5kb3cgPT0gJ29iamVjdCcgJiYgd2luZG93ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzXG4gID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMod2luZG93KSA6IFtdO1xuXG52YXIgZ2V0V2luZG93TmFtZXMgPSBmdW5jdGlvbihpdCl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGdPUE4oaXQpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB3aW5kb3dOYW1lcy5zbGljZSgpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5mID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCl7XG4gIHJldHVybiB3aW5kb3dOYW1lcyAmJiB0b1N0cmluZy5jYWxsKGl0KSA9PSAnW29iamVjdCBXaW5kb3ddJyA/IGdldFdpbmRvd05hbWVzKGl0KSA6IGdPUE4odG9JT2JqZWN0KGl0KSk7XG59O1xuIiwiLy8gMTkuMS4yLjcgLyAxNS4yLjMuNCBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxudmFyICRrZXlzICAgICAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpXG4gICwgaGlkZGVuS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKS5jb25jYXQoJ2xlbmd0aCcsICdwcm90b3R5cGUnKTtcblxuZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgfHwgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhPKXtcbiAgcmV0dXJuICRrZXlzKE8sIGhpZGRlbktleXMpO1xufTsiLCJleHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzOyIsIi8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgaGFzICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHRvT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCBJRV9QUk9UTyAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKVxuICAsIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24oTyl7XG4gIE8gPSB0b09iamVjdChPKTtcbiAgaWYoaGFzKE8sIElFX1BST1RPKSlyZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmKHR5cGVvZiBPLmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3Ipe1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07IiwidmFyIGhhcyAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgdG9JT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSlcbiAgLCBJRV9QUk9UTyAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBuYW1lcyl7XG4gIHZhciBPICAgICAgPSB0b0lPYmplY3Qob2JqZWN0KVxuICAgICwgaSAgICAgID0gMFxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGtleTtcbiAgZm9yKGtleSBpbiBPKWlmKGtleSAhPSBJRV9QUk9UTyloYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaWYoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKXtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59OyIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKVxuICAsIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTyl7XG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59OyIsImV4cG9ydHMuZiA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlOyIsIi8vIG1vc3QgT2JqZWN0IG1ldGhvZHMgYnkgRVM2IHNob3VsZCBhY2NlcHQgcHJpbWl0aXZlc1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGNvcmUgICAgPSByZXF1aXJlKCcuL19jb3JlJylcbiAgLCBmYWlscyAgID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZLCBleGVjKXtcbiAgdmFyIGZuICA9IChjb3JlLk9iamVjdCB8fCB7fSlbS0VZXSB8fCBPYmplY3RbS0VZXVxuICAgICwgZXhwID0ge307XG4gIGV4cFtLRVldID0gZXhlYyhmbik7XG4gICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogZmFpbHMoZnVuY3Rpb24oKXsgZm4oMSk7IH0pLCAnT2JqZWN0JywgZXhwKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihiaXRtYXAsIHZhbHVlKXtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faGlkZScpOyIsIi8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBjaGVjayA9IGZ1bmN0aW9uKE8sIHByb3RvKXtcbiAgYW5PYmplY3QoTyk7XG4gIGlmKCFpc09iamVjdChwcm90bykgJiYgcHJvdG8gIT09IG51bGwpdGhyb3cgVHlwZUVycm9yKHByb3RvICsgXCI6IGNhbid0IHNldCBhcyBwcm90b3R5cGUhXCIpO1xufTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCAoJ19fcHJvdG9fXycgaW4ge30gPyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgZnVuY3Rpb24odGVzdCwgYnVnZ3ksIHNldCl7XG4gICAgICB0cnkge1xuICAgICAgICBzZXQgPSByZXF1aXJlKCcuL19jdHgnKShGdW5jdGlvbi5jYWxsLCByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpLmYoT2JqZWN0LnByb3RvdHlwZSwgJ19fcHJvdG9fXycpLnNldCwgMik7XG4gICAgICAgIHNldCh0ZXN0LCBbXSk7XG4gICAgICAgIGJ1Z2d5ID0gISh0ZXN0IGluc3RhbmNlb2YgQXJyYXkpO1xuICAgICAgfSBjYXRjaChlKXsgYnVnZ3kgPSB0cnVlOyB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pe1xuICAgICAgICBjaGVjayhPLCBwcm90byk7XG4gICAgICAgIGlmKGJ1Z2d5KU8uX19wcm90b19fID0gcHJvdG87XG4gICAgICAgIGVsc2Ugc2V0KE8sIHByb3RvKTtcbiAgICAgICAgcmV0dXJuIE87XG4gICAgICB9O1xuICAgIH0oe30sIGZhbHNlKSA6IHVuZGVmaW5lZCksXG4gIGNoZWNrOiBjaGVja1xufTsiLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XG4gIGlmKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpZGVmKGl0LCBUQUcsIHtjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWd9KTtcbn07IiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJylcbiAgLCB1aWQgICAgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXydcbiAgLCBzdG9yZSAgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0ge30pO1xufTsiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgZGVmaW5lZCAgID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXG4gICAgICAsIGwgPSBzLmxlbmd0aFxuICAgICAgLCBhLCBiO1xuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTsiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgbWF4ICAgICAgID0gTWF0aC5tYXhcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaW5kZXgsIGxlbmd0aCl7XG4gIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG59OyIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgID0gTWF0aC5jZWlsXG4gICwgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTsiLCIvLyB0byBpbmRleGVkIG9iamVjdCwgdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpXG4gICwgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59OyIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBTKXtcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZihTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTsiLCJ2YXIgaWQgPSAwXG4gICwgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTsiLCJ2YXIgZ2xvYmFsICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGNvcmUgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgTElCUkFSWSAgICAgICAgPSByZXF1aXJlKCcuL19saWJyYXJ5JylcbiAgLCB3a3NFeHQgICAgICAgICA9IHJlcXVpcmUoJy4vX3drcy1leHQnKVxuICAsIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSl7XG4gIHZhciAkU3ltYm9sID0gY29yZS5TeW1ib2wgfHwgKGNvcmUuU3ltYm9sID0gTElCUkFSWSA/IHt9IDogZ2xvYmFsLlN5bWJvbCB8fCB7fSk7XG4gIGlmKG5hbWUuY2hhckF0KDApICE9ICdfJyAmJiAhKG5hbWUgaW4gJFN5bWJvbCkpZGVmaW5lUHJvcGVydHkoJFN5bWJvbCwgbmFtZSwge3ZhbHVlOiB3a3NFeHQuZihuYW1lKX0pO1xufTsiLCJleHBvcnRzLmYgPSByZXF1aXJlKCcuL193a3MnKTsiLCJ2YXIgc3RvcmUgICAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKVxuICAsIHVpZCAgICAgICAgPSByZXF1aXJlKCcuL191aWQnKVxuICAsIFN5bWJvbCAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2xcbiAgLCBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTsiLCIndXNlIHN0cmljdCc7XG52YXIgYWRkVG9VbnNjb3BhYmxlcyA9IHJlcXVpcmUoJy4vX2FkZC10by11bnNjb3BhYmxlcycpXG4gICwgc3RlcCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpXG4gICwgSXRlcmF0b3JzICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgdG9JT2JqZWN0ICAgICAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XG4gIHRoaXMuX3QgPSB0b0lPYmplY3QoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbiAgdGhpcy5fayA9IGtpbmQ7ICAgICAgICAgICAgICAgIC8vIGtpbmRcbi8vIDIyLjEuNS4yLjEgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwga2luZCAgPSB0aGlzLl9rXG4gICAgLCBpbmRleCA9IHRoaXMuX2krKztcbiAgaWYoIU8gfHwgaW5kZXggPj0gTy5sZW5ndGgpe1xuICAgIHRoaXMuX3QgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgT1tpbmRleF0pO1xuICByZXR1cm4gc3RlcCgwLCBbaW5kZXgsIE9baW5kZXhdXSk7XG59LCAndmFsdWVzJyk7XG5cbi8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJSAoOS40LjQuNiwgOS40LjQuNylcbkl0ZXJhdG9ycy5Bcmd1bWVudHMgPSBJdGVyYXRvcnMuQXJyYXk7XG5cbmFkZFRvVW5zY29wYWJsZXMoJ2tleXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ3ZhbHVlcycpO1xuYWRkVG9VbnNjb3BhYmxlcygnZW50cmllcycpOyIsIi8vIDIwLjIuMi4yMSBNYXRoLmxvZzEwKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7XG4gIGxvZzEwOiBmdW5jdGlvbiBsb2cxMCh4KXtcbiAgICByZXR1cm4gTWF0aC5sb2coeCkgLyBNYXRoLkxOMTA7XG4gIH1cbn0pOyIsIi8vIDIwLjEuMi4yIE51bWJlci5pc0Zpbml0ZShudW1iZXIpXG52YXIgJGV4cG9ydCAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBfaXNGaW5pdGUgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5pc0Zpbml0ZTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdOdW1iZXInLCB7XG4gIGlzRmluaXRlOiBmdW5jdGlvbiBpc0Zpbml0ZShpdCl7XG4gICAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnbnVtYmVyJyAmJiBfaXNGaW5pdGUoaXQpO1xuICB9XG59KTsiLCIvLyAxOS4xLjMuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYsICdPYmplY3QnLCB7YXNzaWduOiByZXF1aXJlKCcuL19vYmplY3QtYXNzaWduJyl9KTsiLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4vLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0Jywge2NyZWF0ZTogcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpfSk7IiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbi8vIDE5LjEuMi40IC8gMTUuMi4zLjYgT2JqZWN0LmRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpLCAnT2JqZWN0Jywge2RlZmluZVByb3BlcnR5OiByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mfSk7IiwiLy8gMTkuMS4yLjYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxudmFyIHRvSU9iamVjdCAgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKS5mO1xuXG5yZXF1aXJlKCcuL19vYmplY3Qtc2FwJykoJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcicsIGZ1bmN0aW9uKCl7XG4gIHJldHVybiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gICAgcmV0dXJuICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodG9JT2JqZWN0KGl0KSwga2V5KTtcbiAgfTtcbn0pOyIsIi8vIDE5LjEuMi45IE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIHRvT2JqZWN0ICAgICAgICA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgJGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpO1xuXG5yZXF1aXJlKCcuL19vYmplY3Qtc2FwJykoJ2dldFByb3RvdHlwZU9mJywgZnVuY3Rpb24oKXtcbiAgcmV0dXJuIGZ1bmN0aW9uIGdldFByb3RvdHlwZU9mKGl0KXtcbiAgICByZXR1cm4gJGdldFByb3RvdHlwZU9mKHRvT2JqZWN0KGl0KSk7XG4gIH07XG59KTsiLCIvLyAxOS4xLjMuMTkgT2JqZWN0LnNldFByb3RvdHlwZU9mKE8sIHByb3RvKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0Jywge3NldFByb3RvdHlwZU9mOiByZXF1aXJlKCcuL19zZXQtcHJvdG8nKS5zZXR9KTsiLCIiLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ICA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uKGl0ZXJhdGVkKXtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwgaW5kZXggPSB0aGlzLl9pXG4gICAgLCBwb2ludDtcbiAgaWYoaW5kZXggPj0gTy5sZW5ndGgpcmV0dXJuIHt2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHt2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlfTtcbn0pOyIsIid1c2Ugc3RyaWN0Jztcbi8vIEVDTUFTY3JpcHQgNiBzeW1ib2xzIHNoaW1cbnZhciBnbG9iYWwgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIERFU0NSSVBUT1JTICAgID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJylcbiAgLCBNRVRBICAgICAgICAgICA9IHJlcXVpcmUoJy4vX21ldGEnKS5LRVlcbiAgLCAkZmFpbHMgICAgICAgICA9IHJlcXVpcmUoJy4vX2ZhaWxzJylcbiAgLCBzaGFyZWQgICAgICAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgdWlkICAgICAgICAgICAgPSByZXF1aXJlKCcuL191aWQnKVxuICAsIHdrcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fd2tzJylcbiAgLCB3a3NFeHQgICAgICAgICA9IHJlcXVpcmUoJy4vX3drcy1leHQnKVxuICAsIHdrc0RlZmluZSAgICAgID0gcmVxdWlyZSgnLi9fd2tzLWRlZmluZScpXG4gICwga2V5T2YgICAgICAgICAgPSByZXF1aXJlKCcuL19rZXlvZicpXG4gICwgZW51bUtleXMgICAgICAgPSByZXF1aXJlKCcuL19lbnVtLWtleXMnKVxuICAsIGlzQXJyYXkgICAgICAgID0gcmVxdWlyZSgnLi9faXMtYXJyYXknKVxuICAsIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCB0b0lPYmplY3QgICAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIHRvUHJpbWl0aXZlICAgID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJylcbiAgLCBjcmVhdGVEZXNjICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIF9jcmVhdGUgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpXG4gICwgZ09QTkV4dCAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbi1leHQnKVxuICAsICRHT1BEICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKVxuICAsICREUCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCAka2V5cyAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCBnT1BEICAgICAgICAgICA9ICRHT1BELmZcbiAgLCBkUCAgICAgICAgICAgICA9ICREUC5mXG4gICwgZ09QTiAgICAgICAgICAgPSBnT1BORXh0LmZcbiAgLCAkU3ltYm9sICAgICAgICA9IGdsb2JhbC5TeW1ib2xcbiAgLCAkSlNPTiAgICAgICAgICA9IGdsb2JhbC5KU09OXG4gICwgX3N0cmluZ2lmeSAgICAgPSAkSlNPTiAmJiAkSlNPTi5zdHJpbmdpZnlcbiAgLCBQUk9UT1RZUEUgICAgICA9ICdwcm90b3R5cGUnXG4gICwgSElEREVOICAgICAgICAgPSB3a3MoJ19oaWRkZW4nKVxuICAsIFRPX1BSSU1JVElWRSAgID0gd2tzKCd0b1ByaW1pdGl2ZScpXG4gICwgaXNFbnVtICAgICAgICAgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZVxuICAsIFN5bWJvbFJlZ2lzdHJ5ID0gc2hhcmVkKCdzeW1ib2wtcmVnaXN0cnknKVxuICAsIEFsbFN5bWJvbHMgICAgID0gc2hhcmVkKCdzeW1ib2xzJylcbiAgLCBPUFN5bWJvbHMgICAgICA9IHNoYXJlZCgnb3Atc3ltYm9scycpXG4gICwgT2JqZWN0UHJvdG8gICAgPSBPYmplY3RbUFJPVE9UWVBFXVxuICAsIFVTRV9OQVRJVkUgICAgID0gdHlwZW9mICRTeW1ib2wgPT0gJ2Z1bmN0aW9uJ1xuICAsIFFPYmplY3QgICAgICAgID0gZ2xvYmFsLlFPYmplY3Q7XG4vLyBEb24ndCB1c2Ugc2V0dGVycyBpbiBRdCBTY3JpcHQsIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy8xNzNcbnZhciBzZXR0ZXIgPSAhUU9iamVjdCB8fCAhUU9iamVjdFtQUk9UT1RZUEVdIHx8ICFRT2JqZWN0W1BST1RPVFlQRV0uZmluZENoaWxkO1xuXG4vLyBmYWxsYmFjayBmb3Igb2xkIEFuZHJvaWQsIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD02ODdcbnZhciBzZXRTeW1ib2xEZXNjID0gREVTQ1JJUFRPUlMgJiYgJGZhaWxzKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBfY3JlYXRlKGRQKHt9LCAnYScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiBkUCh0aGlzLCAnYScsIHt2YWx1ZTogN30pLmE7IH1cbiAgfSkpLmEgIT0gNztcbn0pID8gZnVuY3Rpb24oaXQsIGtleSwgRCl7XG4gIHZhciBwcm90b0Rlc2MgPSBnT1BEKE9iamVjdFByb3RvLCBrZXkpO1xuICBpZihwcm90b0Rlc2MpZGVsZXRlIE9iamVjdFByb3RvW2tleV07XG4gIGRQKGl0LCBrZXksIEQpO1xuICBpZihwcm90b0Rlc2MgJiYgaXQgIT09IE9iamVjdFByb3RvKWRQKE9iamVjdFByb3RvLCBrZXksIHByb3RvRGVzYyk7XG59IDogZFA7XG5cbnZhciB3cmFwID0gZnVuY3Rpb24odGFnKXtcbiAgdmFyIHN5bSA9IEFsbFN5bWJvbHNbdGFnXSA9IF9jcmVhdGUoJFN5bWJvbFtQUk9UT1RZUEVdKTtcbiAgc3ltLl9rID0gdGFnO1xuICByZXR1cm4gc3ltO1xufTtcblxudmFyIGlzU3ltYm9sID0gVVNFX05BVElWRSAmJiB0eXBlb2YgJFN5bWJvbC5pdGVyYXRvciA9PSAnc3ltYm9sJyA/IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJztcbn0gOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCBpbnN0YW5jZW9mICRTeW1ib2w7XG59O1xuXG52YXIgJGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgRCl7XG4gIGlmKGl0ID09PSBPYmplY3RQcm90bykkZGVmaW5lUHJvcGVydHkoT1BTeW1ib2xzLCBrZXksIEQpO1xuICBhbk9iamVjdChpdCk7XG4gIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEQpO1xuICBpZihoYXMoQWxsU3ltYm9scywga2V5KSl7XG4gICAgaWYoIUQuZW51bWVyYWJsZSl7XG4gICAgICBpZighaGFzKGl0LCBISURERU4pKWRQKGl0LCBISURERU4sIGNyZWF0ZURlc2MoMSwge30pKTtcbiAgICAgIGl0W0hJRERFTl1ba2V5XSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0paXRbSElEREVOXVtrZXldID0gZmFsc2U7XG4gICAgICBEID0gX2NyZWF0ZShELCB7ZW51bWVyYWJsZTogY3JlYXRlRGVzYygwLCBmYWxzZSl9KTtcbiAgICB9IHJldHVybiBzZXRTeW1ib2xEZXNjKGl0LCBrZXksIEQpO1xuICB9IHJldHVybiBkUChpdCwga2V5LCBEKTtcbn07XG52YXIgJGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKGl0LCBQKXtcbiAgYW5PYmplY3QoaXQpO1xuICB2YXIga2V5cyA9IGVudW1LZXlzKFAgPSB0b0lPYmplY3QoUCkpXG4gICAgLCBpICAgID0gMFxuICAgICwgbCA9IGtleXMubGVuZ3RoXG4gICAgLCBrZXk7XG4gIHdoaWxlKGwgPiBpKSRkZWZpbmVQcm9wZXJ0eShpdCwga2V5ID0ga2V5c1tpKytdLCBQW2tleV0pO1xuICByZXR1cm4gaXQ7XG59O1xudmFyICRjcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaXQsIFApe1xuICByZXR1cm4gUCA9PT0gdW5kZWZpbmVkID8gX2NyZWF0ZShpdCkgOiAkZGVmaW5lUHJvcGVydGllcyhfY3JlYXRlKGl0KSwgUCk7XG59O1xudmFyICRwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IGZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKGtleSl7XG4gIHZhciBFID0gaXNFbnVtLmNhbGwodGhpcywga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKSk7XG4gIGlmKHRoaXMgPT09IE9iamVjdFByb3RvICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICFoYXMoT1BTeW1ib2xzLCBrZXkpKXJldHVybiBmYWxzZTtcbiAgcmV0dXJuIEUgfHwgIWhhcyh0aGlzLCBrZXkpIHx8ICFoYXMoQWxsU3ltYm9scywga2V5KSB8fCBoYXModGhpcywgSElEREVOKSAmJiB0aGlzW0hJRERFTl1ba2V5XSA/IEUgOiB0cnVlO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xuICBpdCAgPSB0b0lPYmplY3QoaXQpO1xuICBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpO1xuICBpZihpdCA9PT0gT2JqZWN0UHJvdG8gJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIWhhcyhPUFN5bWJvbHMsIGtleSkpcmV0dXJuO1xuICB2YXIgRCA9IGdPUEQoaXQsIGtleSk7XG4gIGlmKEQgJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIShoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKSlELmVudW1lcmFibGUgPSB0cnVlO1xuICByZXR1cm4gRDtcbn07XG52YXIgJGdldE93blByb3BlcnR5TmFtZXMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KXtcbiAgdmFyIG5hbWVzICA9IGdPUE4odG9JT2JqZWN0KGl0KSlcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpe1xuICAgIGlmKCFoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYga2V5ICE9IEhJRERFTiAmJiBrZXkgIT0gTUVUQSlyZXN1bHQucHVzaChrZXkpO1xuICB9IHJldHVybiByZXN1bHQ7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoaXQpe1xuICB2YXIgSVNfT1AgID0gaXQgPT09IE9iamVjdFByb3RvXG4gICAgLCBuYW1lcyAgPSBnT1BOKElTX09QID8gT1BTeW1ib2xzIDogdG9JT2JqZWN0KGl0KSlcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpe1xuICAgIGlmKGhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiAoSVNfT1AgPyBoYXMoT2JqZWN0UHJvdG8sIGtleSkgOiB0cnVlKSlyZXN1bHQucHVzaChBbGxTeW1ib2xzW2tleV0pO1xuICB9IHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyAxOS40LjEuMSBTeW1ib2woW2Rlc2NyaXB0aW9uXSlcbmlmKCFVU0VfTkFUSVZFKXtcbiAgJFN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbCgpe1xuICAgIGlmKHRoaXMgaW5zdGFuY2VvZiAkU3ltYm9sKXRocm93IFR5cGVFcnJvcignU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yIScpO1xuICAgIHZhciB0YWcgPSB1aWQoYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpO1xuICAgIHZhciAkc2V0ID0gZnVuY3Rpb24odmFsdWUpe1xuICAgICAgaWYodGhpcyA9PT0gT2JqZWN0UHJvdG8pJHNldC5jYWxsKE9QU3ltYm9scywgdmFsdWUpO1xuICAgICAgaWYoaGFzKHRoaXMsIEhJRERFTikgJiYgaGFzKHRoaXNbSElEREVOXSwgdGFnKSl0aGlzW0hJRERFTl1bdGFnXSA9IGZhbHNlO1xuICAgICAgc2V0U3ltYm9sRGVzYyh0aGlzLCB0YWcsIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbiAgICB9O1xuICAgIGlmKERFU0NSSVBUT1JTICYmIHNldHRlcilzZXRTeW1ib2xEZXNjKE9iamVjdFByb3RvLCB0YWcsIHtjb25maWd1cmFibGU6IHRydWUsIHNldDogJHNldH0pO1xuICAgIHJldHVybiB3cmFwKHRhZyk7XG4gIH07XG4gIHJlZGVmaW5lKCRTeW1ib2xbUFJPVE9UWVBFXSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKXtcbiAgICByZXR1cm4gdGhpcy5faztcbiAgfSk7XG5cbiAgJEdPUEQuZiA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICREUC5mICAgPSAkZGVmaW5lUHJvcGVydHk7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJykuZiA9IGdPUE5FeHQuZiA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzO1xuICByZXF1aXJlKCcuL19vYmplY3QtcGllJykuZiAgPSAkcHJvcGVydHlJc0VudW1lcmFibGU7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJykuZiA9ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbiAgaWYoREVTQ1JJUFRPUlMgJiYgIXJlcXVpcmUoJy4vX2xpYnJhcnknKSl7XG4gICAgcmVkZWZpbmUoT2JqZWN0UHJvdG8sICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICRwcm9wZXJ0eUlzRW51bWVyYWJsZSwgdHJ1ZSk7XG4gIH1cblxuICB3a3NFeHQuZiA9IGZ1bmN0aW9uKG5hbWUpe1xuICAgIHJldHVybiB3cmFwKHdrcyhuYW1lKSk7XG4gIH1cbn1cblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwge1N5bWJvbDogJFN5bWJvbH0pO1xuXG5mb3IodmFyIHN5bWJvbHMgPSAoXG4gIC8vIDE5LjQuMi4yLCAxOS40LjIuMywgMTkuNC4yLjQsIDE5LjQuMi42LCAxOS40LjIuOCwgMTkuNC4yLjksIDE5LjQuMi4xMCwgMTkuNC4yLjExLCAxOS40LjIuMTIsIDE5LjQuMi4xMywgMTkuNC4yLjE0XG4gICdoYXNJbnN0YW5jZSxpc0NvbmNhdFNwcmVhZGFibGUsaXRlcmF0b3IsbWF0Y2gscmVwbGFjZSxzZWFyY2gsc3BlY2llcyxzcGxpdCx0b1ByaW1pdGl2ZSx0b1N0cmluZ1RhZyx1bnNjb3BhYmxlcydcbikuc3BsaXQoJywnKSwgaSA9IDA7IHN5bWJvbHMubGVuZ3RoID4gaTsgKXdrcyhzeW1ib2xzW2krK10pO1xuXG5mb3IodmFyIHN5bWJvbHMgPSAka2V5cyh3a3Muc3RvcmUpLCBpID0gMDsgc3ltYm9scy5sZW5ndGggPiBpOyApd2tzRGVmaW5lKHN5bWJvbHNbaSsrXSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsICdTeW1ib2wnLCB7XG4gIC8vIDE5LjQuMi4xIFN5bWJvbC5mb3Ioa2V5KVxuICAnZm9yJzogZnVuY3Rpb24oa2V5KXtcbiAgICByZXR1cm4gaGFzKFN5bWJvbFJlZ2lzdHJ5LCBrZXkgKz0gJycpXG4gICAgICA/IFN5bWJvbFJlZ2lzdHJ5W2tleV1cbiAgICAgIDogU3ltYm9sUmVnaXN0cnlba2V5XSA9ICRTeW1ib2woa2V5KTtcbiAgfSxcbiAgLy8gMTkuNC4yLjUgU3ltYm9sLmtleUZvcihzeW0pXG4gIGtleUZvcjogZnVuY3Rpb24ga2V5Rm9yKGtleSl7XG4gICAgaWYoaXNTeW1ib2woa2V5KSlyZXR1cm4ga2V5T2YoU3ltYm9sUmVnaXN0cnksIGtleSk7XG4gICAgdGhyb3cgVHlwZUVycm9yKGtleSArICcgaXMgbm90IGEgc3ltYm9sIScpO1xuICB9LFxuICB1c2VTZXR0ZXI6IGZ1bmN0aW9uKCl7IHNldHRlciA9IHRydWU7IH0sXG4gIHVzZVNpbXBsZTogZnVuY3Rpb24oKXsgc2V0dGVyID0gZmFsc2U7IH1cbn0pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCAnT2JqZWN0Jywge1xuICAvLyAxOS4xLjIuMiBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG4gIGNyZWF0ZTogJGNyZWF0ZSxcbiAgLy8gMTkuMS4yLjQgT2JqZWN0LmRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpXG4gIGRlZmluZVByb3BlcnR5OiAkZGVmaW5lUHJvcGVydHksXG4gIC8vIDE5LjEuMi4zIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpXG4gIGRlZmluZVByb3BlcnRpZXM6ICRkZWZpbmVQcm9wZXJ0aWVzLFxuICAvLyAxOS4xLjIuNiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogJGdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgLy8gMTkuMS4yLjcgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbiAgZ2V0T3duUHJvcGVydHlOYW1lczogJGdldE93blByb3BlcnR5TmFtZXMsXG4gIC8vIDE5LjEuMi44IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoTylcbiAgZ2V0T3duUHJvcGVydHlTeW1ib2xzOiAkZ2V0T3duUHJvcGVydHlTeW1ib2xzXG59KTtcblxuLy8gMjQuMy4yIEpTT04uc3RyaW5naWZ5KHZhbHVlIFssIHJlcGxhY2VyIFssIHNwYWNlXV0pXG4kSlNPTiAmJiAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICghVVNFX05BVElWRSB8fCAkZmFpbHMoZnVuY3Rpb24oKXtcbiAgdmFyIFMgPSAkU3ltYm9sKCk7XG4gIC8vIE1TIEVkZ2UgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIHt9XG4gIC8vIFdlYktpdCBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMgbnVsbFxuICAvLyBWOCB0aHJvd3Mgb24gYm94ZWQgc3ltYm9sc1xuICByZXR1cm4gX3N0cmluZ2lmeShbU10pICE9ICdbbnVsbF0nIHx8IF9zdHJpbmdpZnkoe2E6IFN9KSAhPSAne30nIHx8IF9zdHJpbmdpZnkoT2JqZWN0KFMpKSAhPSAne30nO1xufSkpLCAnSlNPTicsIHtcbiAgc3RyaW5naWZ5OiBmdW5jdGlvbiBzdHJpbmdpZnkoaXQpe1xuICAgIGlmKGl0ID09PSB1bmRlZmluZWQgfHwgaXNTeW1ib2woaXQpKXJldHVybjsgLy8gSUU4IHJldHVybnMgc3RyaW5nIG9uIHVuZGVmaW5lZFxuICAgIHZhciBhcmdzID0gW2l0XVxuICAgICAgLCBpICAgID0gMVxuICAgICAgLCByZXBsYWNlciwgJHJlcGxhY2VyO1xuICAgIHdoaWxlKGFyZ3VtZW50cy5sZW5ndGggPiBpKWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgcmVwbGFjZXIgPSBhcmdzWzFdO1xuICAgIGlmKHR5cGVvZiByZXBsYWNlciA9PSAnZnVuY3Rpb24nKSRyZXBsYWNlciA9IHJlcGxhY2VyO1xuICAgIGlmKCRyZXBsYWNlciB8fCAhaXNBcnJheShyZXBsYWNlcikpcmVwbGFjZXIgPSBmdW5jdGlvbihrZXksIHZhbHVlKXtcbiAgICAgIGlmKCRyZXBsYWNlcil2YWx1ZSA9ICRyZXBsYWNlci5jYWxsKHRoaXMsIGtleSwgdmFsdWUpO1xuICAgICAgaWYoIWlzU3ltYm9sKHZhbHVlKSlyZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgICBhcmdzWzFdID0gcmVwbGFjZXI7XG4gICAgcmV0dXJuIF9zdHJpbmdpZnkuYXBwbHkoJEpTT04sIGFyZ3MpO1xuICB9XG59KTtcblxuLy8gMTkuNC4zLjQgU3ltYm9sLnByb3RvdHlwZVtAQHRvUHJpbWl0aXZlXShoaW50KVxuJFN5bWJvbFtQUk9UT1RZUEVdW1RPX1BSSU1JVElWRV0gfHwgcmVxdWlyZSgnLi9faGlkZScpKCRTeW1ib2xbUFJPVE9UWVBFXSwgVE9fUFJJTUlUSVZFLCAkU3ltYm9sW1BST1RPVFlQRV0udmFsdWVPZik7XG4vLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZygkU3ltYm9sLCAnU3ltYm9sJyk7XG4vLyAyMC4yLjEuOSBNYXRoW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZyhNYXRoLCAnTWF0aCcsIHRydWUpO1xuLy8gMjQuMy4zIEpTT05bQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKGdsb2JhbC5KU09OLCAnSlNPTicsIHRydWUpOyIsInJlcXVpcmUoJy4vX3drcy1kZWZpbmUnKSgnYXN5bmNJdGVyYXRvcicpOyIsInJlcXVpcmUoJy4vX3drcy1kZWZpbmUnKSgnb2JzZXJ2YWJsZScpOyIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgZ2xvYmFsICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgaGlkZSAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIEl0ZXJhdG9ycyAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIFRPX1NUUklOR19UQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxuZm9yKHZhciBjb2xsZWN0aW9ucyA9IFsnTm9kZUxpc3QnLCAnRE9NVG9rZW5MaXN0JywgJ01lZGlhTGlzdCcsICdTdHlsZVNoZWV0TGlzdCcsICdDU1NSdWxlTGlzdCddLCBpID0gMDsgaSA8IDU7IGkrKyl7XG4gIHZhciBOQU1FICAgICAgID0gY29sbGVjdGlvbnNbaV1cbiAgICAsIENvbGxlY3Rpb24gPSBnbG9iYWxbTkFNRV1cbiAgICAsIHByb3RvICAgICAgPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICBpZihwcm90byAmJiAhcHJvdG9bVE9fU1RSSU5HX1RBR10paGlkZShwcm90bywgVE9fU1RSSU5HX1RBRywgTkFNRSk7XG4gIEl0ZXJhdG9yc1tOQU1FXSA9IEl0ZXJhdG9ycy5BcnJheTtcbn0iXX0=
