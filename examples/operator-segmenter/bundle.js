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

},{"../common/operator/_namespace":37,"../core":47,"./sink/_namespace":13,"./source/_namespace":17,"./utils/_namespace":19}],4:[function(require,module,exports){
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

    _this._stack = [];
    _this._rafId = null;

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
      this._rafId = null;
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

      if (this._rafId === null) this._rafId = requestAnimationFrame(this.renderStack);
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

},{"../../core/BaseLfo":45,"babel-runtime/core-js/object/assign":53,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],5:[function(require,module,exports){
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

},{"../utils/display-utils":20,"./BaseDisplay":4,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],6:[function(require,module,exports){
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

},{"../utils/display-utils":20,"./BaseDisplay":4,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],7:[function(require,module,exports){
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

},{"../utils/display-utils":20,"./BaseDisplay":4,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

var _wsUtils = require('../../common/utils/wsUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parameters = {
  port: {
    type: 'integer',
    default: 8000,
    nullable: true,
    constant: true
  },
  url: {
    type: 'string',
    default: null,
    nullable: true,
    constant: true
  }
};

/**
 * Send an lfo frame as a socket message to a `node.source.SocketReceive`
 * instance.
 *
 * <p class="warning">Experimental</p>
 *
 * @example
 * const eventIn = new lfo.source.EventIn({
 *   frameType: 'vector',
 *   frameSize: 2,
 *   frameRate: 1,
 * });
 *
 * const socketSend = new lfo.sink.SocketSend({
 *   port: 3000
 * });
 *
 * eventIn.connect(socketSend);
 *
 * eventIn.init().then(() => {
 *   eventIn.start();
 *
 *   let time = 0;
 *
 *   (function createFrame() {
 *     eventIn.process(time, [Math.random(), Math.random()], { test: true });
 *     time += 1;
 *
 *     setTimeout(createFrame, 1000);
 *   }());
 * });
 */

var SocketSend = function (_BaseLfo) {
  (0, _inherits3.default)(SocketSend, _BaseLfo);

  function SocketSend() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, SocketSend);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SocketSend.__proto__ || (0, _getPrototypeOf2.default)(SocketSend)).call(this, parameters, options));

    var protocol = window.location.protocol.replace(/^http/, 'ws');
    var address = _this.params.get('url') || window.location.hostname;
    var port = _this.params.get('port') || ''; // everything falsy becomes ''
    var socketAddress = protocol + '//' + address + ':' + port;

    _this.socket = new WebSocket(socketAddress);
    _this.socket.binaryType = 'arraybuffer';

    _this.openedPromise = new _promise2.default(function (resolve, reject) {
      _this.socket.onopen = resolve;
    });

    _this.socket.onerror = function (err) {
      return console.error(err.stack);
    };
    return _this;
  }

  (0, _createClass3.default)(SocketSend, [{
    key: 'initModule',
    value: function initModule() {
      var _this2 = this;

      // send a INIT_MODULE_REQ and wait for INIT_MODULE_ACK
      // no need to get children promises as we are in a leef
      return this.openedPromise.then(function () {
        return new _promise2.default(function (resolve, reject) {
          _this2.socket.onmessage = function (e) {
            var opcode = _wsUtils.decoders.opcode(e.data);

            if (opcode === _wsUtils.opcodes.INIT_MODULE_ACK) resolve();
          };

          var buffer = _wsUtils.encoders.initModuleReq();
          _this2.socket.send(buffer);
        });
      });
    }
  }, {
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      (0, _get3.default)(SocketSend.prototype.__proto__ || (0, _getPrototypeOf2.default)(SocketSend.prototype), 'processStreamParams', this).call(this, prevStreamParams);

      var buffer = _wsUtils.encoders.streamParams(this.streamParams);
      this.socket.send(buffer);
    }
  }, {
    key: 'resetStream',
    value: function resetStream() {
      (0, _get3.default)(SocketSend.prototype.__proto__ || (0, _getPrototypeOf2.default)(SocketSend.prototype), 'resetStream', this).call(this);

      var buffer = _wsUtils.encoders.resetStream();
      this.socket.send(buffer);
    }

    /** @private */

  }, {
    key: 'finalizeStream',
    value: function finalizeStream(endTime) {
      (0, _get3.default)(SocketSend.prototype.__proto__ || (0, _getPrototypeOf2.default)(SocketSend.prototype), 'finalizeStream', this).call(this, endTime);

      var buffer = _wsUtils.encoders.finalizeStream(endTime);
      this.socket.send(buffer);
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
  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      var frameSize = this.streamParams.frameSize;
      this.frame.time = frame.time;
      this.frame.data.set(frame.data, 0);
      this.frame.metadata = frame.metadata;

      var buffer = _wsUtils.encoders.processFrame(this.frame, frameSize);
      this.socket.send(buffer);
    }
  }]);
  return SocketSend;
}(_BaseLfo3.default);

exports.default = SocketSend;

},{"../../common/utils/wsUtils":44,"../../core/BaseLfo":45,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/core-js/promise":59,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],9:[function(require,module,exports){
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

},{"../../common/operator/Fft":23,"../utils/display-utils":20,"./BaseDisplay":4,"babel-runtime/core-js/math/log10":51,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],10:[function(require,module,exports){
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

},{"../utils/display-utils":20,"./BaseDisplay":4,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],11:[function(require,module,exports){
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

},{"../../common/operator/Rms":32,"./BaseDisplay":4,"babel-runtime/core-js/math/log10":51,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],12:[function(require,module,exports){
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

},{"../../common/operator/MinMax":28,"../../common/operator/Rms":32,"../utils/display-utils":20,"./BaseDisplay":4,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],13:[function(require,module,exports){
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

var _SocketSend = require('./SocketSend');

var _SocketSend2 = _interopRequireDefault(_SocketSend);

var _SpectrumDisplay = require('./SpectrumDisplay');

var _SpectrumDisplay2 = _interopRequireDefault(_SpectrumDisplay);

var _TraceDisplay = require('./TraceDisplay');

var _TraceDisplay2 = _interopRequireDefault(_TraceDisplay);

var _VuMeterDisplay = require('./VuMeterDisplay');

var _VuMeterDisplay2 = _interopRequireDefault(_VuMeterDisplay);

var _WaveformDisplay = require('./WaveformDisplay');

var _WaveformDisplay2 = _interopRequireDefault(_WaveformDisplay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Bridge: _Bridge2.default,
  Logger: _Logger2.default,
  DataRecorder: _DataRecorder2.default,
  SignalRecorder: _SignalRecorder2.default,

  BaseDisplay: _BaseDisplay2.default,
  BpfDisplay: _BpfDisplay2.default,
  MarkerDisplay: _MarkerDisplay2.default,
  SignalDisplay: _SignalDisplay2.default,
  SocketSend: _SocketSend2.default,
  SpectrumDisplay: _SpectrumDisplay2.default,
  TraceDisplay: _TraceDisplay2.default,
  VuMeterDisplay: _VuMeterDisplay2.default,
  WaveformDisplay: _WaveformDisplay2.default
};

// client only
// common

},{"../../common/sink/Bridge":38,"../../common/sink/DataRecorder":39,"../../common/sink/Logger":40,"../../common/sink/SignalRecorder":41,"./BaseDisplay":4,"./BpfDisplay":5,"./MarkerDisplay":6,"./SignalDisplay":7,"./SocketSend":8,"./SpectrumDisplay":9,"./TraceDisplay":10,"./VuMeterDisplay":11,"./WaveformDisplay":12}],14:[function(require,module,exports){
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

var _definitions;

var _BaseLfo = require('../../core/BaseLfo');

var _BaseLfo2 = _interopRequireDefault(_BaseLfo);

var _SourceMixin2 = require('../../core/SourceMixin');

var _SourceMixin3 = _interopRequireDefault(_SourceMixin2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = (_definitions = {
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
}, (0, _defineProperty3.default)(_definitions, 'progressCallback', {
  type: 'any',
  default: null,
  nullable: true,
  constant: true
}), (0, _defineProperty3.default)(_definitions, 'async', {
  type: 'boolean',
  default: false
}), _definitions);

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

var AudioInBuffer = function (_SourceMixin) {
  (0, _inherits3.default)(AudioInBuffer, _SourceMixin);

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
      if (this.initialized === false) {
        if (this.initPromise === null) // init has not yet been called
          this.initPromise = this.init();

        this.initPromise.then(this.start);
        return;
      }

      var channel = this.params.get('channel');
      var audioBuffer = this.params.get('audioBuffer');
      var buffer = audioBuffer.getChannelData(channel);
      this.endTime = 0;
      this.started = true;

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
      this.started = false;
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
      var async = this.params.get('async');
      var sampleRate = this.streamParams.sourceSampleRate;
      var frameSize = this.streamParams.frameSize;
      var progressCallback = this.params.get('progressCallback') || noop;
      var length = buffer.length;
      var nbrFrames = Math.ceil(buffer.length / frameSize);
      var data = this.frame.data;
      var that = this;
      var i = 0;

      function slice() {
        var offset = i * frameSize;
        var nbrCopy = Math.min(length - offset, frameSize);

        for (var j = 0; j < frameSize; j++) {
          data[j] = j < nbrCopy ? buffer[offset + j] : 0;
        }that.frame.time = offset / sampleRate;
        that.endTime = that.frame.time + nbrCopy / sampleRate;
        that.propagateFrame();

        i += 1;
        progressCallback(i / nbrFrames);

        if (i < nbrFrames) {
          if (async) setTimeout(slice, 0);else slice();
        } else {
          that.finalizeStream(that.endTime);
        }
      };

      // allow the following to do the expected thing:
      // audioIn.connect(recorder);
      // audioIn.start();
      // recorder.start();
      setTimeout(slice, 0);
    }
  }]);
  return AudioInBuffer;
}((0, _SourceMixin3.default)(_BaseLfo2.default));

exports.default = AudioInBuffer;

},{"../../core/BaseLfo":45,"../../core/SourceMixin":46,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/defineProperty":64,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],15:[function(require,module,exports){
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

var _BaseLfo = require('../../core/BaseLfo');

var _BaseLfo2 = _interopRequireDefault(_BaseLfo);

var _SourceMixin2 = require('../../core/SourceMixin');

var _SourceMixin3 = _interopRequireDefault(_SourceMixin2);

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

var AudioInNode = function (_SourceMixin) {
  (0, _inherits3.default)(AudioInNode, _SourceMixin);

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
      if (this.initialized === false) {
        if (this.initPromise === null) // init has not yet been called
          this.initPromise = this.init();

        this.initPromise.then(this.start);
        return;
      }

      var audioContext = this.params.get('audioContext');
      var frameSize = this.params.get('frameSize');

      this.frame.time = 0;
      // @note: recreate each time because of a firefox weird behavior
      this.scriptProcessor = audioContext.createScriptProcessor(frameSize, 1, 1);
      this.scriptProcessor.onaudioprocess = this.processFrame;

      this.started = true;
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
      this.started = false;
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
      if (this.started === false) return;

      this.frame.data = e.inputBuffer.getChannelData(this._channel);
      this.propagateFrame();

      this.frame.time += this._blockDuration;
    }
  }]);
  return AudioInNode;
}((0, _SourceMixin3.default)(_BaseLfo2.default));

exports.default = AudioInNode;

},{"../../core/BaseLfo":45,"../../core/SourceMixin":46,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

var _wsUtils = require('../../common/utils/wsUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parameters = {
  port: {
    type: 'integer',
    default: 8000,
    nullable: true,
    constant: true
  },
  url: {
    type: 'string',
    default: null,
    nullable: true,
    constant: true
  }
};

/**
 * Receive an lfo frame as a socket message from a `node.sink.SocketSend`
 * instance.
 *
 * <p class="warning">Experimental</p>
 *
 * @todo - handle init / start properly.
 */

var SocketReceive = function (_BaseLfo) {
  (0, _inherits3.default)(SocketReceive, _BaseLfo);

  function SocketReceive() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, SocketReceive);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SocketReceive.__proto__ || (0, _getPrototypeOf2.default)(SocketReceive)).call(this, parameters, options));

    var protocol = window.location.protocol.replace(/^http/, 'ws');
    var address = _this.params.get('url') || window.location.hostname;
    var port = _this.params.get('port') || ''; // everything falsy becomes ''
    var socketAddress = protocol + '//' + address + ':' + port;

    _this._dispatch = _this._dispatch.bind(_this);

    _this.socket = new WebSocket(socketAddress);
    _this.socket.binaryType = 'arraybuffer';

    _this.openedPromise = new _promise2.default(function (resolve, reject) {
      _this.socket.onopen = resolve;
    });

    _this.socket.onmessage = _this._dispatch;
    _this.socket.onerror = function (err) {
      return console.error(err.stack);
    };
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(SocketReceive, [{
    key: 'initModule',
    value: function initModule() {
      var _this2 = this;

      var promises = this.nextModules.map(function (mod) {
        return mod.initModule();
      });
      promises.push(this.openedPromise);
      // wait for children promises and send INIT_MODULE_ACK
      _promise2.default.all(promises).then(function () {
        var buffer = _wsUtils.encoders.initModuleAck();
        _this2.socket.send(buffer);
      });
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
      this.frame = frame;
      this.propagateFrame();
    }

    /**
     * Decode and dispatch incomming frame according to opcode
     * @private
     */

  }, {
    key: '_dispatch',
    value: function _dispatch(e) {
      var arrayBuffer = e.data;
      var opcode = _wsUtils.decoders.opcode(arrayBuffer);

      switch (opcode) {
        case _wsUtils.opcodes.INIT_MODULE_REQ:
          this.initModule();
          break;
        case _wsUtils.opcodes.PROCESS_STREAM_PARAMS:
          var prevStreamParams = _wsUtils.decoders.streamParams(arrayBuffer);
          this.processStreamParams(prevStreamParams);
          break;
        case _wsUtils.opcodes.RESET_STREAM:
          this.resetStream();
          break;
        case _wsUtils.opcodes.FINALIZE_STREAM:
          var endTime = _wsUtils.decoders.finalizeStream(arrayBuffer);
          this.finalizeStream(endTime);
          break;
        case _wsUtils.opcodes.PROCESS_FRAME:
          var frameSize = this.streamParams.frameSize;
          var frame = _wsUtils.decoders.processFrame(arrayBuffer, frameSize);
          this.processFrame(frame);
          break;
      }
    }
  }]);
  return SocketReceive;
}(_BaseLfo3.default);

exports.default = SocketReceive;

},{"../../common/utils/wsUtils":44,"../../core/BaseLfo":45,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/core-js/promise":59,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],17:[function(require,module,exports){
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

var _SocketReceive = require('./SocketReceive');

var _SocketReceive2 = _interopRequireDefault(_SocketReceive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// common
exports.default = {
  EventIn: _EventIn2.default,

  AudioInBuffer: _AudioInBuffer2.default,
  AudioInNode: _AudioInNode2.default,
  SocketReceive: _SocketReceive2.default
};
// client only

},{"../../common/source/EventIn":42,"./AudioInBuffer":14,"./AudioInNode":15,"./SocketReceive":16}],18:[function(require,module,exports){
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

},{"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63}],19:[function(require,module,exports){
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

},{"../../common/utils/windows":43,"./DisplaySync":18}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{"../../core/BaseLfo":45,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],22:[function(require,module,exports){
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

},{"../../core/BaseLfo":45,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],23:[function(require,module,exports){
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
 * @param {Number} [options.size=1024] - Size of the fft, should be a power of 2.
 *  If the frame size of the incomming signal is lower than this value,
 *  it is zero padded to match the fft size.
 * @param {String} [options.window='none'] - Name of the window applied on the
 *  incomming signal. Available windows are: 'none', 'hann', 'hanning',
 *  'hamming', 'blackman', 'blackmanharris', 'sine', 'rectangle'.
 * @param {String} [options.mode='magnitude'] - Type of the output (`magnitude`
 *  or `power`)
 * @param {String} [options.norm='auto'] - Type of normalization applied on the
 *  output. Possible values are 'auto', 'none', 'linear', 'power'. When set to
 *  `auto`, a `linear` normalization is applied on the magnitude spectrum, while
 *  a `power` normalization is applied on the power spectrum.
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

},{"../../core/BaseLfo":45,"../utils/windows":43,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],24:[function(require,module,exports){
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

},{"../../core/BaseLfo":45,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],25:[function(require,module,exports){
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

},{"../../core/BaseLfo":45,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],26:[function(require,module,exports){
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
     * mel.initStream({ frameSize: 256, frameType: 'vector', sourceSampleRate: 44100 });
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

},{"../../core/BaseLfo":45,"babel-runtime/core-js/math/log10":51,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],27:[function(require,module,exports){
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

},{"../../core/BaseLfo":45,"./Dct":22,"./Fft":23,"./Mel":26,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],28:[function(require,module,exports){
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

},{"../../core/BaseLfo":45,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],29:[function(require,module,exports){
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

},{"../../core/BaseLfo":45,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],30:[function(require,module,exports){
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

},{"../../core/BaseLfo":45,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],31:[function(require,module,exports){
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

},{"../../core/BaseLfo":45,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],32:[function(require,module,exports){
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

},{"../../core/BaseLfo":45,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],33:[function(require,module,exports){
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

},{"../../core/BaseLfo":45,"./MovingAverage":29,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],34:[function(require,module,exports){
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

},{"../../core/BaseLfo":45,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],35:[function(require,module,exports){
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

},{"../../core/BaseLfo":45,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],36:[function(require,module,exports){
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

},{"../../core/BaseLfo":45,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],37:[function(require,module,exports){
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

},{"./Biquad":21,"./Dct":22,"./Fft":23,"./Magnitude":24,"./MeanStddev":25,"./Mel":26,"./Mfcc":27,"./MinMax":28,"./MovingAverage":29,"./MovingMedian":30,"./OnOff":31,"./Rms":32,"./Segmenter":33,"./Select":34,"./Slicer":35,"./Yin":36}],38:[function(require,module,exports){
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
  processStreamParams: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' }
  },
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

      var processStreamParamsCallback = this.params.get('processStreamParams');

      if (processStreamParamsCallback !== null) processStreamParamsCallback(this.streamParams);

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

},{"../../core/BaseLfo":45,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],39:[function(require,module,exports){
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

},{"../../core/BaseLfo":45,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],40:[function(require,module,exports){
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

},{"../../core/BaseLfo":45,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],41:[function(require,module,exports){
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

},{"../../core/BaseLfo":45,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],42:[function(require,module,exports){
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

var _BaseLfo = require('../../core/BaseLfo');

var _BaseLfo2 = _interopRequireDefault(_BaseLfo);

var _SourceMixin2 = require('../../core/SourceMixin');

var _SourceMixin3 = _interopRequireDefault(_SourceMixin2);

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
    // @todo - replace with `performance.now`
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
 *     time: window.performace.now() / 1000,
 *     data: [e.alpha, e.beta, e.gamma],
 *   };
 *
 *   eventIn.processFrame(frame);
 * }, false);
 */

var EventIn = function (_SourceMixin) {
  (0, _inherits3.default)(EventIn, _SourceMixin);

  function EventIn() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, EventIn);

    var _this = (0, _possibleConstructorReturn3.default)(this, (EventIn.__proto__ || (0, _getPrototypeOf2.default)(EventIn)).call(this, definitions, options));

    var audioContext = _this.params.get('audioContext');
    _this._getTime = getTimeFunction(audioContext);
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
      var _this2 = this;

      var startTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (this.initialized === false) {
        if (this.initPromise === null) // init has not yet been called
          this.initPromise = this.init();

        this.initPromise.then(function () {
          return _this2.start(startTime);
        });
        return;
      }

      this._startTime = startTime;
      this._systemTime = null; // value set in the first `process` call

      this.started = true;
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
      if (this.started && this._startTime !== null) {
        var currentTime = this._getTime();
        var endTime = this.frame.time + (currentTime - this._systemTime);

        this.finalizeStream(endTime);
        this.started = false;
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
      if (!this.started) return;

      this.prepareFrame();
      this.processFunction(frame);
      this.propagateFrame();
    }
  }]);
  return EventIn;
}((0, _SourceMixin3.default)(_BaseLfo2.default));

exports.default = EventIn;

}).call(this,require('_process'))

},{"../../core/BaseLfo":45,"../../core/SourceMixin":46,"_process":49,"babel-runtime/core-js/number/is-finite":52,"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decoders = exports.encoders = exports.opcodes = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//http://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer
// converts a nodejs Buffer to ArrayBuffer
// export function bufferToArrayBuffer(buffer) {
//   const ab = new ArrayBuffer(buffer.length);
//   const view = new Uint8Array(ab);

//   for (let i = 0; i < buffer.length; ++i)
//     view[i] = buffer[i];

//   return ab;
// }

// export function arrayBufferToBuffer(arrayBuffer) {
//   const buffer = new Buffer(arrayBuffer.byteLength);
//   const view = new Uint8Array(arrayBuffer);

//   for (let i = 0; i < buffer.length; ++i)
//     buffer[i] = view[i];

//   return buffer;
// }

// http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
function Uint16Array2json(arr) {
  var str = String.fromCharCode.apply(null, arr);
  return JSON.parse(str.replace(/\u0000/g, ''));
}

function json2Uint16Array(json) {
  var str = (0, _stringify2.default)(json);
  var buffer = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufferView = new Uint16Array(buffer);

  for (var i = 0, l = str.length; i < l; i++) {
    bufferView[i] = str.charCodeAt(i);
  }return bufferView;
}

var opcodes = exports.opcodes = {
  INIT_MODULE_REQ: 10,
  INIT_MODULE_ACK: 11,
  PROCESS_STREAM_PARAMS: 12,
  RESET_STREAM: 13,
  FINALIZE_STREAM: 14,
  PROCESS_FRAME: 15
};

//
var encoders = exports.encoders = {
  opcode: function opcode(name) {
    var opcode = opcodes[name];
    var buffer = new Uint16Array(1);
    buffer[0] = opcode;

    return buffer;
  },

  // `opcode`    2 bytes (Uint16) |
  initModuleReq: function initModuleReq() {
    var payload = encoders.opcode('INIT_MODULE_REQ');
    return payload.buffer;
  },
  // `opcode`    2 bytes (Uint16) |
  initModuleAck: function initModuleAck() {
    var payload = encoders.opcode('INIT_MODULE_ACK');
    return payload.buffer;
  },
  // `opcode`    2 bytes (Uint16) |
  // `streamParams`  n bytes (Uint16)
  streamParams: function streamParams(_streamParams) {
    var opcode = encoders.opcode('PROCESS_STREAM_PARAMS');
    var streamParamsBuffer = json2Uint16Array(_streamParams);

    var payload = new Uint16Array(1 + streamParamsBuffer.length);
    payload.set(opcode, 0);
    payload.set(streamParamsBuffer, 1);

    return payload.buffer;
  },
  // `opcode`    2 bytes (Uint16) |
  resetStream: function resetStream() {
    var payload = encoders.opcode('RESET_STREAM');
    return payload.buffer;
  },
  // `opcode`    2 bytes (Uint16) |
  // `endTime`   8 bytes (Float64)
  finalizeStream: function finalizeStream(endTime) {
    var opcode = encoders.opcode('RESET_STREAM');

    var endTimeBuffer = new Float64Array(1);
    endTimeBuffer[0] = endTime;

    var payload = new Uint16Array(1 + 4);
    payload.set(opcode, 0);
    payload.set(new Uint16Array(endTimeBuffer.buffer), 1);

    return payload.buffer;
  },
  // `opcode`    2 bytes (Uint16) |
  // `time`      8 bytes (Float64) |
  // `data`      frameSize * 4 (Float32) |
  // `metadata`  n bytes (Uint16)
  processFrame: function processFrame(frame, frameSize) {
    var opcode = encoders.opcode('PROCESS_FRAME');

    var time = new Float64Array(1);
    time[0] = frame.time;

    var data = new Float32Array(frameSize);
    for (var i = 0; i < frameSize; i++) {
      data[i] = frame.data[i];
    }var metadata = json2Uint16Array(frame.metadata);

    var length = 1 + 4 + 2 * frameSize + metadata.length;
    var payload = new Uint16Array(length);
    payload.set(opcode, 0);
    payload.set(new Uint16Array(time.buffer), 1);
    payload.set(new Uint16Array(data.buffer), 1 + 4);
    payload.set(metadata, 1 + 4 + 2 * frameSize);

    return payload.buffer;
  }
};

var decoders = exports.decoders = {
  opcode: function opcode(arrayBuffer) {
    return new Uint16Array(arrayBuffer)[0];
  },

  // `opcode`    2 bytes (Uint16) |
  // `streamParams`  n bytes (Uint16)
  streamParams: function streamParams(arrayBuffer) {
    var payload = new Uint16Array(arrayBuffer.slice(2));
    var prevStreamParams = Uint16Array2json(payload);
    return prevStreamParams;
  },

  // `opcode`    2 bytes (Uint16) |
  // `endTime`   8 bytes (Float64)
  finalizeStream: function finalizeStream(arrayBuffer) {
    return new Float64Array(arrayBuffer.slice(2))[0];
  },

  // `opcode`    2 bytes (Uint16) |
  // `time`      8 bytes (Float64) |
  // `data`      frameSize * 4 (Float32) |
  // `metadata`  n bytes (Uint16)
  processFrame: function processFrame(arrayBuffer, frameSize) {
    // 1 * 8 bytes
    var timeStart = 2;
    var timeEnd = timeStart + 8;
    var time = new Float64Array(arrayBuffer.slice(timeStart, timeEnd))[0];
    // frameSize * 4 bytes
    var dataStart = timeEnd;
    var dataEnd = dataStart + 4 * frameSize;
    var data = new Float32Array(arrayBuffer.slice(dataStart, dataEnd));
    // rest of payload
    var metaStart = dataEnd;
    var metaBuffer = new Uint16Array(arrayBuffer.slice(metaStart));
    var metadata = Uint16Array2json(metaBuffer);

    return { time: time, data: data, metadata: metadata };
  }
};

},{"babel-runtime/core-js/json/stringify":50}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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
 *   node apply on the stream. The type of input a node can handle is defined
 *   by its implemented interface, if it implements `processSignal`, a stream
 *   of type `signal` can be processed, `processVector` to handle
 *   an input of type `vector`.
 *
 * <span class="warning">_This class should be considered abstract and only
 * be used as a base class to extend._</span>
 *
 * #### overview of the interface
 *
 * **initModule**
 *
 * Returns a Promise that resolves when the module is initialized. Is
 * especially important for modules that rely on asynchronous underlying APIs.
 *
 * **processStreamParams(prevStreamParams)**
 *
 * `base` class (default implementation)
 * - call `prepareStreamParams`
 * - call `propagateStreamParams`
 *
 * `child` class
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
 * - call `prepareFrame`
 * - assign frameTime and frameMetadata to identity
 * - call the proper function according to inputType
 * - call `propagateFrame`
 *
 * `child` class
 * - call `prepareFrame`
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
     * At each frame, the node forward its `frame` to to all its `nextModules`.
     *
     * @type {Array<BaseLfo>}
     * @name nextModules
     * @instance
     * @memberof module:common.core.BaseLfo
     * @see {@link module:common.core.BaseLfo#connect}
     * @see {@link module:common.core.BaseLfo#disconnect}
     */
    this.nextModules = [];

    /**
     * The node from which the node receive the frames (upper in the graph).
     *
     * @type {BaseLfo}
     * @name prevModule
     * @instance
     * @memberof module:common.core.BaseLfo
     * @see {@link module:common.core.BaseLfo#connect}
     * @see {@link module:common.core.BaseLfo#disconnect}
     */
    this.prevModule = null;

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
     * Connect the current node (`prevModule`) to another node (`nextOp`).
     * A given node can be connected to several operators and propagate frames
     * to each of them.
     *
     * @param {BaseLfo} next - Next operator in the graph.
     * @see {@link module:common.core.BaseLfo#processFrame}
     * @see {@link module:common.core.BaseLfo#disconnect}
     */

  }, {
    key: 'connect',
    value: function connect(next) {
      var _this = this;

      if (!(next instanceof BaseLfo)) throw new Error('Invalid connection: child node is not an instance of `BaseLfo`');

      if (this.streamParams === null || next.streamParams === null) throw new Error('Invalid connection: cannot connect a dead node');

      if (this.streamParams.frameType !== null) {
        // graph has already been started
        // next.processStreamParams(this.streamParams);
        next.initModule().then(function () {
          next.processStreamParams(_this.streamParams);
          // we can forward frame from now
          _this.nextModules.push(next);
          next.prevModule = _this;
        });
      } else {
        this.nextModules.push(next);
        next.prevModule = this;
      }
    }

    /**
     * Remove the given operator from its previous operators' `nextModules`.
     *
     * @param {BaseLfo} [next=null] - The operator to disconnect from the current
     *  operator. If `null` disconnect all the next operators.
     */

  }, {
    key: 'disconnect',
    value: function disconnect() {
      var _this2 = this;

      var next = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (next === null) {
        this.nextModules.forEach(function (next) {
          return _this2.disconnect(next);
        });
      } else {
        var index = this.nextModules.indexOf(this);
        this.nextModules.splice(index, 1);
        next.prevModule = null;
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
      var index = this.nextModules.length;

      while (index--) {
        this.nextModules[index].destroy();
      } // disconnect itself from the previous operator
      if (this.prevModule) this.prevModule.disconnect(this);

      // mark the object as dead
      this.streamParams = null;
    }

    /**
     * Return a `Promise` that resolve when the module is ready to be consumed.
     * Some modules relies on asynchronous APIs at initialization and thus could
     * be not ready to be consumed when the graph starts.
     * A module should be consider as initialized when all next modules (children)
     * are themselves initialized. The event bubbles up from sinks to sources.
     * When all its next operators are ready, a source can consider the whole graph
     * as ready and then start to produce frames.
     * The default implementation resolves when all next operators are resolved
     * themselves.
     * An operator relying on external async API must override this method to
     * resolve only when its dependecy is ready.
     *
     * @return Promise
     * @todo - Handle dynamic connections
     */

  }, {
    key: 'initModule',
    value: function initModule() {
      var nextPromises = this.nextModules.map(function (module) {
        return module.initModule();
      });

      return _promise2.default.all(nextPromises);
    }

    /**
     * Helper to initialize the stream in standalone mode.
     *
     * @param {Object} [streamParams={}] - Parameters of the stream.
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
      for (var i = 0, l = this.nextModules.length; i < l; i++) {
        this.nextModules[i].resetStream();
      } // no buffer for `scalar` type or sink node
      // @note - this should be reviewed
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
      for (var i = 0, l = this.nextModules.length; i < l; i++) {
        this.nextModules[i].finalizeStream(endTime);
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

      for (var i = 0, l = this.nextModules.length; i < l; i++) {
        this.nextModules[i].processStreamParams(this.streamParams);
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
        var streamParams = this.prevModule !== null ? this.prevModule.streamParams : {};
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
      for (var i = 0, l = this.nextModules.length; i < l; i++) {
        this.nextModules[i].processFrame(this.frame);
      }
    }
  }]);
  return BaseLfo;
}();

exports.default = BaseLfo;

},{"babel-runtime/core-js/object/assign":53,"babel-runtime/core-js/promise":59,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"parameters":2}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Interface added to `LfoCore to implement source
 *
 * Source have some responsability on graph as they mostly control its whole
 * lifecycle. They must implement the start and stop method in order to
 * make sure the graph is initialized and set `started` to true.
 * A source should never accept and propagate incomming frames until `started`
 * is set to `true`.
 *
 * @example
 * class MySource extends SourceMixin(BaseLfo) {}
 */
var SourceMixin = function SourceMixin(superclass) {
  return function (_superclass) {
    (0, _inherits3.default)(_class, _superclass);

    function _class() {
      var _ref;

      (0, _classCallCheck3.default)(this, _class);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _this = (0, _possibleConstructorReturn3.default)(this, (_ref = _class.__proto__ || (0, _getPrototypeOf2.default)(_class)).call.apply(_ref, [this].concat(args)));

      _this.initialized = false;
      _this.initPromise = null;
      _this.started = false;

      _this.start = _this.start.bind(_this);
      _this.stop = _this.stop.bind(_this);
      return _this;
    }

    /**
     * Initialize the graph by calling `initModule`. When the returned `Promise`
     * fulfills, the graph can be considered as initialized and `start` can be
     * called safely. If `start` is called whithout explicit `init`, `init` is
     * made internally, actual start of the graph is then not garanteed to be
     * synchronous.
     *
     * @return Promise
     *
     * @example
     * // safe initialization and start
     * source.init().then(() => source.start())
     * // safe initialization and start
     * source.start();
     */


    (0, _createClass3.default)(_class, [{
      key: "init",
      value: function init() {
        var _this2 = this;

        this.initPromise = this.initModule().then(function () {
          // when graph is started
          _this2.initStream(); // this is synchronous
          _this2.initialized = true;
          return _promise2.default.resolve(true);
        });

        return this.initPromise;
      }

      /**
       * Interface method to implement that starts the graph.
       *
       * The method main purpose is to make sure take verify initialization step and
       * set `started` to `true` when done.
       * Should behave synchronously when called inside `init().then()` and async
       * if called without init step.
       *
       * @abstract
       *
       * @example
       * // basic `start` implementation
       * start() {
       *   if (this.initialized === false) {
       *     if (this.initPromise === null) // init has not yet been called
       *       this.initPromise = this.init();
       *
       *     this.initPromise.then(this.start);
       *     return;
       *   }
       *
       *   this.started = true;
       * }
       */

    }, {
      key: "start",
      value: function start() {}

      /**
       * Interface method to implement that stops the graph.
       *
       * @abstract
       *
       * @example
       * // basic `stop` implementation
       * stop() {
       *   this.started = false;
       * }
       */

    }, {
      key: "stop",
      value: function stop() {}

      /**
       * The implementation should never allow incomming frames
       * if `this.started` is not `true`.
       *
       * @abstract
       *
       * @param {Object} frame
       *
       * @example
       * // basic `processFrame` implementation
       * processFrame(frame) {
       *   if (this.started === true) {
       *     this.prepareFrame();
       *     this.processFunction(frame);
       *     this.propagateFrame();
       *   }
       * }
       */

    }, {
      key: "processFrame",
      value: function processFrame(frame) {}
    }]);
    return _class;
  }(superclass);
};

exports.default = SourceMixin;

},{"babel-runtime/core-js/object/get-prototype-of":57,"babel-runtime/core-js/promise":59,"babel-runtime/helpers/classCallCheck":62,"babel-runtime/helpers/createClass":63,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/possibleConstructorReturn":67}],47:[function(require,module,exports){
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

var _SourceMixin = require('./SourceMixin');

Object.defineProperty(exports, 'SourceMixin', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SourceMixin).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = exports.version = '1.0.0';

},{"./BaseLfo":45,"./SourceMixin":46}],48:[function(require,module,exports){
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

},{"waves-lfo/client":3}],49:[function(require,module,exports){
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

},{}],50:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/json/stringify"), __esModule: true };
},{"core-js/library/fn/json/stringify":69}],51:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/math/log10"), __esModule: true };
},{"core-js/library/fn/math/log10":70}],52:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/number/is-finite"), __esModule: true };
},{"core-js/library/fn/number/is-finite":71}],53:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":72}],54:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":73}],55:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":74}],56:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":75}],57:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/get-prototype-of":76}],58:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":77}],59:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/promise"), __esModule: true };
},{"core-js/library/fn/promise":78}],60:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":79}],61:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":80}],62:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
},{}],63:[function(require,module,exports){
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
},{"../core-js/object/define-property":55}],64:[function(require,module,exports){
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
},{"../core-js/object/define-property":55}],65:[function(require,module,exports){
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
},{"../core-js/object/get-own-property-descriptor":56,"../core-js/object/get-prototype-of":57}],66:[function(require,module,exports){
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
},{"../core-js/object/create":54,"../core-js/object/set-prototype-of":58,"../helpers/typeof":68}],67:[function(require,module,exports){
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
},{"../helpers/typeof":68}],68:[function(require,module,exports){
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
},{"../core-js/symbol":60,"../core-js/symbol/iterator":61}],69:[function(require,module,exports){
var core  = require('../../modules/_core')
  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};
},{"../../modules/_core":88}],70:[function(require,module,exports){
require('../../modules/es6.math.log10');
module.exports = require('../../modules/_core').Math.log10;
},{"../../modules/_core":88,"../../modules/es6.math.log10":154}],71:[function(require,module,exports){
require('../../modules/es6.number.is-finite');
module.exports = require('../../modules/_core').Number.isFinite;
},{"../../modules/_core":88,"../../modules/es6.number.is-finite":155}],72:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;
},{"../../modules/_core":88,"../../modules/es6.object.assign":156}],73:[function(require,module,exports){
require('../../modules/es6.object.create');
var $Object = require('../../modules/_core').Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};
},{"../../modules/_core":88,"../../modules/es6.object.create":157}],74:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};
},{"../../modules/_core":88,"../../modules/es6.object.define-property":158}],75:[function(require,module,exports){
require('../../modules/es6.object.get-own-property-descriptor');
var $Object = require('../../modules/_core').Object;
module.exports = function getOwnPropertyDescriptor(it, key){
  return $Object.getOwnPropertyDescriptor(it, key);
};
},{"../../modules/_core":88,"../../modules/es6.object.get-own-property-descriptor":159}],76:[function(require,module,exports){
require('../../modules/es6.object.get-prototype-of');
module.exports = require('../../modules/_core').Object.getPrototypeOf;
},{"../../modules/_core":88,"../../modules/es6.object.get-prototype-of":160}],77:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/_core').Object.setPrototypeOf;
},{"../../modules/_core":88,"../../modules/es6.object.set-prototype-of":161}],78:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.promise');
module.exports = require('../modules/_core').Promise;
},{"../modules/_core":88,"../modules/es6.object.to-string":162,"../modules/es6.promise":163,"../modules/es6.string.iterator":164,"../modules/web.dom.iterable":168}],79:[function(require,module,exports){
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
require('../../modules/es7.symbol.async-iterator');
require('../../modules/es7.symbol.observable');
module.exports = require('../../modules/_core').Symbol;
},{"../../modules/_core":88,"../../modules/es6.object.to-string":162,"../../modules/es6.symbol":165,"../../modules/es7.symbol.async-iterator":166,"../../modules/es7.symbol.observable":167}],80:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/_wks-ext').f('iterator');
},{"../../modules/_wks-ext":150,"../../modules/es6.string.iterator":164,"../../modules/web.dom.iterable":168}],81:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],82:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],83:[function(require,module,exports){
module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};
},{}],84:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":107}],85:[function(require,module,exports){
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
},{"./_to-index":142,"./_to-iobject":144,"./_to-length":145}],86:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof')
  , TAG = require('./_wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./_cof":87,"./_wks":151}],87:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],88:[function(require,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],89:[function(require,module,exports){
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
},{"./_a-function":81}],90:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],91:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":96}],92:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":98,"./_is-object":107}],93:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],94:[function(require,module,exports){
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
},{"./_object-gops":125,"./_object-keys":128,"./_object-pie":129}],95:[function(require,module,exports){
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
},{"./_core":88,"./_ctx":89,"./_global":98,"./_hide":100}],96:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],97:[function(require,module,exports){
var ctx         = require('./_ctx')
  , call        = require('./_iter-call')
  , isArrayIter = require('./_is-array-iter')
  , anObject    = require('./_an-object')
  , toLength    = require('./_to-length')
  , getIterFn   = require('./core.get-iterator-method')
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;
},{"./_an-object":84,"./_ctx":89,"./_is-array-iter":105,"./_iter-call":108,"./_to-length":145,"./core.get-iterator-method":152}],98:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],99:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],100:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":91,"./_object-dp":120,"./_property-desc":131}],101:[function(require,module,exports){
module.exports = require('./_global').document && document.documentElement;
},{"./_global":98}],102:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":91,"./_dom-create":92,"./_fails":96}],103:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],104:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":87}],105:[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./_iterators')
  , ITERATOR   = require('./_wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./_iterators":113,"./_wks":151}],106:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
},{"./_cof":87}],107:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],108:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./_an-object":84}],109:[function(require,module,exports){
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
},{"./_hide":100,"./_object-create":119,"./_property-desc":131,"./_set-to-string-tag":136,"./_wks":151}],110:[function(require,module,exports){
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
},{"./_export":95,"./_has":99,"./_hide":100,"./_iter-create":109,"./_iterators":113,"./_library":115,"./_object-gpo":126,"./_redefine":133,"./_set-to-string-tag":136,"./_wks":151}],111:[function(require,module,exports){
var ITERATOR     = require('./_wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./_wks":151}],112:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],113:[function(require,module,exports){
module.exports = {};
},{}],114:[function(require,module,exports){
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
},{"./_object-keys":128,"./_to-iobject":144}],115:[function(require,module,exports){
module.exports = true;
},{}],116:[function(require,module,exports){
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
},{"./_fails":96,"./_has":99,"./_is-object":107,"./_object-dp":120,"./_uid":148}],117:[function(require,module,exports){
var global    = require('./_global')
  , macrotask = require('./_task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = require('./_cof')(process) == 'process';

module.exports = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode && (parent = process.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode){
    notify = function(){
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise && Promise.resolve){
    var promise = Promise.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};
},{"./_cof":87,"./_global":98,"./_task":141}],118:[function(require,module,exports){
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
},{"./_fails":96,"./_iobject":104,"./_object-gops":125,"./_object-keys":128,"./_object-pie":129,"./_to-object":146}],119:[function(require,module,exports){
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

},{"./_an-object":84,"./_dom-create":92,"./_enum-bug-keys":93,"./_html":101,"./_object-dps":121,"./_shared-key":137}],120:[function(require,module,exports){
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
},{"./_an-object":84,"./_descriptors":91,"./_ie8-dom-define":102,"./_to-primitive":147}],121:[function(require,module,exports){
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
},{"./_an-object":84,"./_descriptors":91,"./_object-dp":120,"./_object-keys":128}],122:[function(require,module,exports){
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
},{"./_descriptors":91,"./_has":99,"./_ie8-dom-define":102,"./_object-pie":129,"./_property-desc":131,"./_to-iobject":144,"./_to-primitive":147}],123:[function(require,module,exports){
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

},{"./_object-gopn":124,"./_to-iobject":144}],124:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = require('./_object-keys-internal')
  , hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};
},{"./_enum-bug-keys":93,"./_object-keys-internal":127}],125:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;
},{}],126:[function(require,module,exports){
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
},{"./_has":99,"./_shared-key":137,"./_to-object":146}],127:[function(require,module,exports){
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
},{"./_array-includes":85,"./_has":99,"./_shared-key":137,"./_to-iobject":144}],128:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require('./_object-keys-internal')
  , enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":93,"./_object-keys-internal":127}],129:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;
},{}],130:[function(require,module,exports){
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
},{"./_core":88,"./_export":95,"./_fails":96}],131:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],132:[function(require,module,exports){
var hide = require('./_hide');
module.exports = function(target, src, safe){
  for(var key in src){
    if(safe && target[key])target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};
},{"./_hide":100}],133:[function(require,module,exports){
module.exports = require('./_hide');
},{"./_hide":100}],134:[function(require,module,exports){
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
},{"./_an-object":84,"./_ctx":89,"./_is-object":107,"./_object-gopd":122}],135:[function(require,module,exports){
'use strict';
var global      = require('./_global')
  , core        = require('./_core')
  , dP          = require('./_object-dp')
  , DESCRIPTORS = require('./_descriptors')
  , SPECIES     = require('./_wks')('species');

module.exports = function(KEY){
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./_core":88,"./_descriptors":91,"./_global":98,"./_object-dp":120,"./_wks":151}],136:[function(require,module,exports){
var def = require('./_object-dp').f
  , has = require('./_has')
  , TAG = require('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_has":99,"./_object-dp":120,"./_wks":151}],137:[function(require,module,exports){
var shared = require('./_shared')('keys')
  , uid    = require('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":138,"./_uid":148}],138:[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":98}],139:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = require('./_an-object')
  , aFunction = require('./_a-function')
  , SPECIES   = require('./_wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./_a-function":81,"./_an-object":84,"./_wks":151}],140:[function(require,module,exports){
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
},{"./_defined":90,"./_to-integer":143}],141:[function(require,module,exports){
var ctx                = require('./_ctx')
  , invoke             = require('./_invoke')
  , html               = require('./_html')
  , cel                = require('./_dom-create')
  , global             = require('./_global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./_cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./_cof":87,"./_ctx":89,"./_dom-create":92,"./_global":98,"./_html":101,"./_invoke":103}],142:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":143}],143:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],144:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject')
  , defined = require('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":90,"./_iobject":104}],145:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":143}],146:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":90}],147:[function(require,module,exports){
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
},{"./_is-object":107}],148:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],149:[function(require,module,exports){
var global         = require('./_global')
  , core           = require('./_core')
  , LIBRARY        = require('./_library')
  , wksExt         = require('./_wks-ext')
  , defineProperty = require('./_object-dp').f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};
},{"./_core":88,"./_global":98,"./_library":115,"./_object-dp":120,"./_wks-ext":150}],150:[function(require,module,exports){
exports.f = require('./_wks');
},{"./_wks":151}],151:[function(require,module,exports){
var store      = require('./_shared')('wks')
  , uid        = require('./_uid')
  , Symbol     = require('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
},{"./_global":98,"./_shared":138,"./_uid":148}],152:[function(require,module,exports){
var classof   = require('./_classof')
  , ITERATOR  = require('./_wks')('iterator')
  , Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./_classof":86,"./_core":88,"./_iterators":113,"./_wks":151}],153:[function(require,module,exports){
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
},{"./_add-to-unscopables":82,"./_iter-define":110,"./_iter-step":112,"./_iterators":113,"./_to-iobject":144}],154:[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log10: function log10(x){
    return Math.log(x) / Math.LN10;
  }
});
},{"./_export":95}],155:[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export   = require('./_export')
  , _isFinite = require('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  }
});
},{"./_export":95,"./_global":98}],156:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', {assign: require('./_object-assign')});
},{"./_export":95,"./_object-assign":118}],157:[function(require,module,exports){
var $export = require('./_export')
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: require('./_object-create')});
},{"./_export":95,"./_object-create":119}],158:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperty: require('./_object-dp').f});
},{"./_descriptors":91,"./_export":95,"./_object-dp":120}],159:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject                 = require('./_to-iobject')
  , $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./_object-gopd":122,"./_object-sap":130,"./_to-iobject":144}],160:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = require('./_to-object')
  , $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
},{"./_object-gpo":126,"./_object-sap":130,"./_to-object":146}],161:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', {setPrototypeOf: require('./_set-proto').set});
},{"./_export":95,"./_set-proto":134}],162:[function(require,module,exports){

},{}],163:[function(require,module,exports){
'use strict';
var LIBRARY            = require('./_library')
  , global             = require('./_global')
  , ctx                = require('./_ctx')
  , classof            = require('./_classof')
  , $export            = require('./_export')
  , isObject           = require('./_is-object')
  , aFunction          = require('./_a-function')
  , anInstance         = require('./_an-instance')
  , forOf              = require('./_for-of')
  , speciesConstructor = require('./_species-constructor')
  , task               = require('./_task').set
  , microtask          = require('./_microtask')()
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , process            = global.process
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject  = aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject  = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});
},{"./_a-function":81,"./_an-instance":83,"./_classof":86,"./_core":88,"./_ctx":89,"./_export":95,"./_for-of":97,"./_global":98,"./_is-object":107,"./_iter-detect":111,"./_library":115,"./_microtask":117,"./_redefine-all":132,"./_set-species":135,"./_set-to-string-tag":136,"./_species-constructor":139,"./_task":141,"./_wks":151}],164:[function(require,module,exports){
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
},{"./_iter-define":110,"./_string-at":140}],165:[function(require,module,exports){
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
},{"./_an-object":84,"./_descriptors":91,"./_enum-keys":94,"./_export":95,"./_fails":96,"./_global":98,"./_has":99,"./_hide":100,"./_is-array":106,"./_keyof":114,"./_library":115,"./_meta":116,"./_object-create":119,"./_object-dp":120,"./_object-gopd":122,"./_object-gopn":124,"./_object-gopn-ext":123,"./_object-gops":125,"./_object-keys":128,"./_object-pie":129,"./_property-desc":131,"./_redefine":133,"./_set-to-string-tag":136,"./_shared":138,"./_to-iobject":144,"./_to-primitive":147,"./_uid":148,"./_wks":151,"./_wks-define":149,"./_wks-ext":150}],166:[function(require,module,exports){
require('./_wks-define')('asyncIterator');
},{"./_wks-define":149}],167:[function(require,module,exports){
require('./_wks-define')('observable');
},{"./_wks-define":149}],168:[function(require,module,exports){
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
},{"./_global":98,"./_hide":100,"./_iterators":113,"./_wks":151,"./es6.array.iterator":153}]},{},[48])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi8uLi8uLi8uLi9pcmNhbS1qc3Rvb2xzL2xpYi9wYXJhbWV0ZXJzL2Rpc3QvcGFyYW1UZW1wbGF0ZXMuanMiLCIuLi8uLi8uLi8uLi8uLi9pcmNhbS1qc3Rvb2xzL2xpYi9wYXJhbWV0ZXJzL2Rpc3QvcGFyYW1ldGVycy5qcyIsIi4uLy4uL2NsaWVudC9pbmRleC5qcyIsIi4uLy4uL2NsaWVudC9zaW5rL0Jhc2VEaXNwbGF5LmpzIiwiLi4vLi4vY2xpZW50L3NpbmsvQnBmRGlzcGxheS5qcyIsIi4uLy4uL2NsaWVudC9zaW5rL01hcmtlckRpc3BsYXkuanMiLCIuLi8uLi9jbGllbnQvc2luay9TaWduYWxEaXNwbGF5LmpzIiwiLi4vLi4vY2xpZW50L3NpbmsvU29ja2V0U2VuZC5qcyIsIi4uLy4uL2NsaWVudC9zaW5rL1NwZWN0cnVtRGlzcGxheS5qcyIsIi4uLy4uL2NsaWVudC9zaW5rL1RyYWNlRGlzcGxheS5qcyIsIi4uLy4uL2NsaWVudC9zaW5rL1Z1TWV0ZXJEaXNwbGF5LmpzIiwiLi4vLi4vY2xpZW50L3NpbmsvV2F2ZWZvcm1EaXNwbGF5LmpzIiwiLi4vLi4vY2xpZW50L3NpbmsvX25hbWVzcGFjZS5qcyIsIi4uLy4uL2NsaWVudC9zb3VyY2UvQXVkaW9JbkJ1ZmZlci5qcyIsIi4uLy4uL2NsaWVudC9zb3VyY2UvQXVkaW9Jbk5vZGUuanMiLCIuLi8uLi9jbGllbnQvc291cmNlL1NvY2tldFJlY2VpdmUuanMiLCIuLi8uLi9jbGllbnQvc291cmNlL19uYW1lc3BhY2UuanMiLCIuLi8uLi9jbGllbnQvdXRpbHMvRGlzcGxheVN5bmMuanMiLCIuLi8uLi9jbGllbnQvdXRpbHMvX25hbWVzcGFjZS5qcyIsIi4uLy4uL2NsaWVudC91dGlscy9kaXNwbGF5LXV0aWxzLmpzIiwiLi4vLi4vY29tbW9uL29wZXJhdG9yL0JpcXVhZC5qcyIsIi4uLy4uL2NvbW1vbi9vcGVyYXRvci9EY3QuanMiLCIuLi8uLi9jb21tb24vb3BlcmF0b3IvRmZ0LmpzIiwiLi4vLi4vY29tbW9uL29wZXJhdG9yL01hZ25pdHVkZS5qcyIsIi4uLy4uL2NvbW1vbi9vcGVyYXRvci9NZWFuU3RkZGV2LmpzIiwiLi4vLi4vY29tbW9uL29wZXJhdG9yL01lbC5qcyIsIi4uLy4uL2NvbW1vbi9vcGVyYXRvci9NZmNjLmpzIiwiLi4vLi4vY29tbW9uL29wZXJhdG9yL01pbk1heC5qcyIsIi4uLy4uL2NvbW1vbi9vcGVyYXRvci9Nb3ZpbmdBdmVyYWdlLmpzIiwiLi4vLi4vY29tbW9uL29wZXJhdG9yL01vdmluZ01lZGlhbi5qcyIsIi4uLy4uL2NvbW1vbi9vcGVyYXRvci9Pbk9mZi5qcyIsIi4uLy4uL2NvbW1vbi9vcGVyYXRvci9SbXMuanMiLCIuLi8uLi9jb21tb24vb3BlcmF0b3IvU2VnbWVudGVyLmpzIiwiLi4vLi4vY29tbW9uL29wZXJhdG9yL1NlbGVjdC5qcyIsIi4uLy4uL2NvbW1vbi9vcGVyYXRvci9TbGljZXIuanMiLCIuLi8uLi9jb21tb24vb3BlcmF0b3IvWWluLmpzIiwiLi4vLi4vY29tbW9uL29wZXJhdG9yL19uYW1lc3BhY2UuanMiLCIuLi8uLi9jb21tb24vc2luay9CcmlkZ2UuanMiLCIuLi8uLi9jb21tb24vc2luay9EYXRhUmVjb3JkZXIuanMiLCIuLi8uLi9jb21tb24vc2luay9Mb2dnZXIuanMiLCIuLi8uLi9jb21tb24vc2luay9TaWduYWxSZWNvcmRlci5qcyIsIi4uLy4uL2NvbW1vbi9zb3VyY2UvRXZlbnRJbi5qcyIsIi4uLy4uL2NvbW1vbi91dGlscy93aW5kb3dzLmpzIiwiLi4vLi4vY29tbW9uL3V0aWxzL3dzVXRpbHMuanMiLCIuLi8uLi9jb3JlL0Jhc2VMZm8uanMiLCIuLi8uLi9jb3JlL1NvdXJjZU1peGluLmpzIiwiLi4vLi4vY29yZS9pbmRleC5qcyIsImRpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9qc29uL3N0cmluZ2lmeS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvbWF0aC9sb2cxMC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvbnVtYmVyL2lzLWZpbml0ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2Fzc2lnbi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2NyZWF0ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1vd24tcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2YuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9zZXQtcHJvdG90eXBlLW9mLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9wcm9taXNlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9zeW1ib2wuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbC9pdGVyYXRvci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2suanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9kZWZpbmVQcm9wZXJ0eS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvZ2V0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvdHlwZW9mLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9qc29uL3N0cmluZ2lmeS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vbWF0aC9sb2cxMC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vbnVtYmVyL2lzLWZpbml0ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2Fzc2lnbi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2NyZWF0ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2dldC1vd24tcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2dldC1wcm90b3R5cGUtb2YuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9wcm9taXNlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaW5kZXguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbC9pdGVyYXRvci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hbi1pbnN0YW5jZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29mLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jdHguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RlZmluZWQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWtleXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2V4cG9ydC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZmFpbHMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Zvci1vZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZ2xvYmFsLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oYXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2h0bWwuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pbnZva2UuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lvYmplY3QuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lzLWFycmF5LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1vYmplY3QuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItY2FsbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWRldGVjdC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2tleW9mLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19saWJyYXJ5LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19tZXRhLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19taWNyb3Rhc2suanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1hc3NpZ24uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1kcC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcGQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BuLWV4dC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcG4uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWtleXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1waWUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1zYXAuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3Byb3BlcnR5LWRlc2MuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLWFsbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC1wcm90by5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC10by1zdHJpbmctdGFnLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQta2V5LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NwZWNpZXMtY29uc3RydWN0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3N0cmluZy1hdC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdGFzay5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW5kZXguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWludGVnZXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWlvYmplY3QuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWxlbmd0aC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1wcmltaXRpdmUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3VpZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLWRlZmluZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLWV4dC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm1hdGgubG9nMTAuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm51bWJlci5pcy1maW5pdGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5jcmVhdGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5kZWZpbmUtcHJvcGVydHkuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtcHJvdG90eXBlLW9mLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYucHJvbWlzZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zeW1ib2wuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnN5bWJvbC5hc3luYy1pdGVyYXRvci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcuc3ltYm9sLm9ic2VydmFibGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FDQUEsSUFBTSxNQUFNLEtBQUssR0FBakI7QUFDQSxJQUFNLE1BQU0sS0FBSyxHQUFqQjs7QUFFQSxTQUFTLElBQVQsQ0FBYyxLQUFkLEVBQTJEO0FBQUEsTUFBdEMsS0FBc0MsdUVBQTlCLENBQUMsUUFBNkI7QUFBQSxNQUFuQixLQUFtQix1RUFBWCxDQUFDLFFBQVU7O0FBQ3pELFNBQU8sSUFBSSxLQUFKLEVBQVcsSUFBSSxLQUFKLEVBQVcsS0FBWCxDQUFYLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7O0FBU0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQkFxQmU7QUFDYjs7Ozs7OztBQU9BLFdBQVM7QUFDUCx3QkFBb0IsQ0FBQyxTQUFELENBRGI7QUFFUCxxQkFGTyw2QkFFVyxLQUZYLEVBRWtCLFVBRmxCLEVBRThCLElBRjlCLEVBRW9DO0FBQ3pDLFVBQUksT0FBTyxLQUFQLEtBQWlCLFNBQXJCLEVBQ0UsTUFBTSxJQUFJLEtBQUosdUNBQThDLElBQTlDLFdBQXdELEtBQXhELENBQU47O0FBRUYsYUFBTyxLQUFQO0FBQ0Q7QUFQTSxHQVJJOztBQWtCYjs7Ozs7Ozs7O0FBU0EsV0FBUztBQUNQLHdCQUFvQixDQUFDLFNBQUQsQ0FEYjtBQUVQLHFCQUZPLDZCQUVXLEtBRlgsRUFFa0IsVUFGbEIsRUFFOEIsSUFGOUIsRUFFb0M7QUFDekMsVUFBSSxFQUFFLE9BQU8sS0FBUCxLQUFpQixRQUFqQixJQUE2QixLQUFLLEtBQUwsQ0FBVyxLQUFYLE1BQXNCLEtBQXJELENBQUosRUFDRSxNQUFNLElBQUksS0FBSix1Q0FBOEMsSUFBOUMsV0FBd0QsS0FBeEQsQ0FBTjs7QUFFRixhQUFPLEtBQUssS0FBTCxFQUFZLFdBQVcs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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BMQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7O0FDREE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7O0FDREE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7O0FDQUE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBOztBQ0ZBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7O0FDRkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU9BOztBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IG1pbiA9IE1hdGgubWluO1xuY29uc3QgbWF4ID0gTWF0aC5tYXg7XG5cbmZ1bmN0aW9uIGNsaXAodmFsdWUsIGxvd2VyID0gLUluZmluaXR5LCB1cHBlciA9ICtJbmZpbml0eSkge1xuICByZXR1cm4gbWF4KGxvd2VyLCBtaW4odXBwZXIsIHZhbHVlKSlcbn1cblxuLyoqXG4gKiBEaWN0aW9ubmFyeSBvZiB0aGUgYXZhaWxhYmxlIHR5cGVzLiBFYWNoIGtleSBjb3JyZXNwb25kIHRvIHRoZSB0eXBlIG9mIHRoZVxuICogaW1wbGVtZW50ZWQgcGFyYW0gd2hpbGUgdGhlIGNvcnJlc3BvbmRpbmcgb2JqZWN0IHZhbHVlIHNob3VsZCB0aGVcbiAqIHtAbGluayBgcGFyYW1EZWZpbml0aW9uYH0gb2YgdGhlIGRlZmluZWQgdHlwZS5cbiAqXG4gKiB0eXBlZGVmIHtPYmplY3R9IHBhcmFtVGVtcGxhdGVzXG4gKiBAdHlwZSB7T2JqZWN0PFN0cmluZywgcGFyYW1UZW1wbGF0ZT59XG4gKi9cblxuLyoqXG4gKiBEZWZpbml0aW9uIG9mIGEgcGFyYW1ldGVyLiBUaGUgZGVmaW5pdGlvbiBzaG91bGQgYXQgbGVhc3QgY29udGFpbiB0aGUgZW50cmllc1xuICogYHR5cGVgIGFuZCBgZGVmYXVsdGAuIEV2ZXJ5IHBhcmFtZXRlciBjYW4gYWxzbyBhY2NlcHQgb3B0aW9ubmFsIGNvbmZpZ3VyYXRpb25cbiAqIGVudHJpZXMgYGNvbnN0YW50YCBhbmQgYG1ldGFzYC5cbiAqIEF2YWlsYWJsZSBkZWZpbml0aW9ucyBhcmU6XG4gKiAtIHtAbGluayBib29sZWFuRGVmaW5pdGlvbn1cbiAqIC0ge0BsaW5rIGludGVnZXJEZWZpbml0aW9ufVxuICogLSB7QGxpbmsgZmxvYXREZWZpbml0aW9ufVxuICogLSB7QGxpbmsgc3RyaW5nRGVmaW5pdGlvbn1cbiAqIC0ge0BsaW5rIGVudW1EZWZpbml0aW9ufVxuICpcbiAqIHR5cGVkZWYge09iamVjdH0gcGFyYW1EZWZpbml0aW9uXG4gKiBAcHJvcGVydHkge1N0cmluZ30gdHlwZSAtIFR5cGUgb2YgdGhlIHBhcmFtZXRlci5cbiAqIEBwcm9wZXJ0eSB7TWl4ZWR9IGRlZmF1bHQgLSBEZWZhdWx0IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgaWYgbm9cbiAqICBpbml0aWFsaXphdGlvbiB2YWx1ZSBpcyBwcm92aWRlZC5cbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gW2NvbnN0YW50PWZhbHNlXSAtIERlZmluZSBpZiB0aGUgcGFyYW1ldGVyIGNhbiBiZSBjaGFuZ2VcbiAqICBhZnRlciBpdHMgaW5pdGlhbGl6YXRpb24uXG4gKiBAcHJvcGVydHkge09iamVjdH0gW21ldGFzPW51bGxdIC0gQW55IHVzZXIgZGVmaW5lZCBkYXRhIGFzc29jaWF0ZWQgdG8gdGhlXG4gKiAgcGFyYW1ldGVyIHRoYXQgY291bHMgYmUgdXNlZnVsbCBpbiB0aGUgYXBwbGljYXRpb24uXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gYm9vbGVhbkRlZmluaXRpb25cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IFt0eXBlPSdib29sZWFuJ10gLSBEZWZpbmUgYSBib29sZWFuIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBkZWZhdWx0IC0gRGVmYXVsdCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IFtjb25zdGFudD1mYWxzZV0gLSBEZWZpbmUgaWYgdGhlIHBhcmFtZXRlciBpcyBjb25zdGFudC5cbiAgICogQHByb3BlcnR5IHtPYmplY3R9IFttZXRhcz17fV0gLSBPcHRpb25uYWwgbWV0YWRhdGEgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIGJvb2xlYW46IHtcbiAgICBkZWZpbml0aW9uVGVtcGxhdGU6IFsnZGVmYXVsdCddLFxuICAgIHR5cGVDaGVja0Z1bmN0aW9uKHZhbHVlLCBkZWZpbml0aW9uLCBuYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbicpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB2YWx1ZSBmb3IgYm9vbGVhbiBwYXJhbSBcIiR7bmFtZX1cIjogJHt2YWx1ZX1gKTtcblxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gaW50ZWdlckRlZmluaXRpb25cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IFt0eXBlPSdpbnRlZ2VyJ10gLSBEZWZpbmUgYSBib29sZWFuIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBkZWZhdWx0IC0gRGVmYXVsdCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IFttaW49LUluZmluaXR5XSAtIE1pbmltdW0gdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBbbWF4PStJbmZpbml0eV0gLSBNYXhpbXVtIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gW2NvbnN0YW50PWZhbHNlXSAtIERlZmluZSBpZiB0aGUgcGFyYW1ldGVyIGlzIGNvbnN0YW50LlxuICAgKiBAcHJvcGVydHkge09iamVjdH0gW21ldGFzPXt9XSAtIE9wdGlvbm5hbCBtZXRhZGF0YSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgaW50ZWdlcjoge1xuICAgIGRlZmluaXRpb25UZW1wbGF0ZTogWydkZWZhdWx0J10sXG4gICAgdHlwZUNoZWNrRnVuY3Rpb24odmFsdWUsIGRlZmluaXRpb24sIG5hbWUpIHtcbiAgICAgIGlmICghKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlKSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHZhbHVlIGZvciBpbnRlZ2VyIHBhcmFtIFwiJHtuYW1lfVwiOiAke3ZhbHVlfWApO1xuXG4gICAgICByZXR1cm4gY2xpcCh2YWx1ZSwgZGVmaW5pdGlvbi5taW4sIGRlZmluaXRpb24ubWF4KTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9IGZsb2F0RGVmaW5pdGlvblxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gW3R5cGU9J2Zsb2F0J10gLSBEZWZpbmUgYSBib29sZWFuIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBkZWZhdWx0IC0gRGVmYXVsdCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IFttaW49LUluZmluaXR5XSAtIE1pbmltdW0gdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBbbWF4PStJbmZpbml0eV0gLSBNYXhpbXVtIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gW2NvbnN0YW50PWZhbHNlXSAtIERlZmluZSBpZiB0aGUgcGFyYW1ldGVyIGlzIGNvbnN0YW50LlxuICAgKiBAcHJvcGVydHkge09iamVjdH0gW21ldGFzPXt9XSAtIE9wdGlvbm5hbCBtZXRhZGF0YSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgZmxvYXQ6IHtcbiAgICBkZWZpbml0aW9uVGVtcGxhdGU6IFsnZGVmYXVsdCddLFxuICAgIHR5cGVDaGVja0Z1bmN0aW9uKHZhbHVlLCBkZWZpbml0aW9uLCBuYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJyB8fMKgdmFsdWUgIT09IHZhbHVlKSAvLyByZWplY3QgTmFOXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB2YWx1ZSBmb3IgZmxvYXQgcGFyYW0gXCIke25hbWV9XCI6ICR7dmFsdWV9YCk7XG5cbiAgICAgIHJldHVybiBjbGlwKHZhbHVlLCBkZWZpbml0aW9uLm1pbiwgZGVmaW5pdGlvbi5tYXgpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gc3RyaW5nRGVmaW5pdGlvblxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gW3R5cGU9J3N0cmluZyddIC0gRGVmaW5lIGEgYm9vbGVhbiBwYXJhbWV0ZXIuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZGVmYXVsdCAtIERlZmF1bHQgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBbY29uc3RhbnQ9ZmFsc2VdIC0gRGVmaW5lIGlmIHRoZSBwYXJhbWV0ZXIgaXMgY29uc3RhbnQuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBbbWV0YXM9e31dIC0gT3B0aW9ubmFsIG1ldGFkYXRhIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBzdHJpbmc6IHtcbiAgICBkZWZpbml0aW9uVGVtcGxhdGU6IFsnZGVmYXVsdCddLFxuICAgIHR5cGVDaGVja0Z1bmN0aW9uKHZhbHVlLCBkZWZpbml0aW9uLCBuYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHZhbHVlIGZvciBzdHJpbmcgcGFyYW0gXCIke25hbWV9XCI6ICR7dmFsdWV9YCk7XG5cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9IGVudW1EZWZpbml0aW9uXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBbdHlwZT0nZW51bSddIC0gRGVmaW5lIGEgYm9vbGVhbiBwYXJhbWV0ZXIuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZGVmYXVsdCAtIERlZmF1bHQgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtBcnJheX0gbGlzdCAtIFBvc3NpYmxlIHZhbHVlcyBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IFtjb25zdGFudD1mYWxzZV0gLSBEZWZpbmUgaWYgdGhlIHBhcmFtZXRlciBpcyBjb25zdGFudC5cbiAgICogQHByb3BlcnR5IHtPYmplY3R9IFttZXRhcz17fV0gLSBPcHRpb25uYWwgbWV0YWRhdGEgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIGVudW06IHtcbiAgICBkZWZpbml0aW9uVGVtcGxhdGU6IFsnZGVmYXVsdCcsICdsaXN0J10sXG4gICAgdHlwZUNoZWNrRnVuY3Rpb24odmFsdWUsIGRlZmluaXRpb24sIG5hbWUpIHtcbiAgICAgIGlmIChkZWZpbml0aW9uLmxpc3QuaW5kZXhPZih2YWx1ZSkgPT09IC0xKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdmFsdWUgZm9yIGVudW0gcGFyYW0gXCIke25hbWV9XCI6ICR7dmFsdWV9YCk7XG5cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9IGFueURlZmluaXRpb25cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IFt0eXBlPSdlbnVtJ10gLSBEZWZpbmUgYSBwYXJhbWV0ZXIgb2YgYW55IHR5cGUuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZGVmYXVsdCAtIERlZmF1bHQgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBbY29uc3RhbnQ9ZmFsc2VdIC0gRGVmaW5lIGlmIHRoZSBwYXJhbWV0ZXIgaXMgY29uc3RhbnQuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBbbWV0YXM9e31dIC0gT3B0aW9ubmFsIG1ldGFkYXRhIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBhbnk6IHtcbiAgICBkZWZpbml0aW9uVGVtcGxhdGU6IFsnZGVmYXVsdCddLFxuICAgIHR5cGVDaGVja0Z1bmN0aW9uKHZhbHVlLCBkZWZpbml0aW9uLCBuYW1lKSB7XG4gICAgICAvLyBubyBjaGVjayBhcyBpdCBjYW4gaGF2ZSBhbnkgdHlwZS4uLlxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHBhcmFtVGVtcGxhdGVzIGZyb20gJy4vcGFyYW1UZW1wbGF0ZXMnO1xuXG4vKipcbiAqIEdlbmVyaWMgY2xhc3MgZm9yIHR5cGVkIHBhcmFtZXRlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gKiBAcGFyYW0ge0FycmF5fSBkZWZpbml0aW9uVGVtcGxhdGUgLSBMaXN0IG9mIG1hbmRhdG9yeSBrZXlzIGluIHRoZSBwYXJhbVxuICogIGRlZmluaXRpb24uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0eXBlQ2hlY2tGdW5jdGlvbiAtIEZ1bmN0aW9uIHRvIGJlIHVzZWQgaW4gb3JkZXIgdG8gY2hlY2tcbiAqICB0aGUgdmFsdWUgYWdhaW5zdCB0aGUgcGFyYW0gZGVmaW5pdGlvbi5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZpbml0aW9uIC0gRGVmaW5pdGlvbiBvZiB0aGUgcGFyYW1ldGVyLlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgLSBWYWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgUGFyYW0ge1xuICBjb25zdHJ1Y3RvcihuYW1lLCBkZWZpbml0aW9uVGVtcGxhdGUsIHR5cGVDaGVja0Z1bmN0aW9uLCBkZWZpbml0aW9uLCB2YWx1ZSkge1xuICAgIGRlZmluaXRpb25UZW1wbGF0ZS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKGRlZmluaXRpb24uaGFzT3duUHJvcGVydHkoa2V5KSA9PT0gZmFsc2UpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBkZWZpbml0aW9uIGZvciBwYXJhbSBcIiR7bmFtZX1cIiwgJHtrZXl9IGlzIG5vdCBkZWZpbmVkYCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMudHlwZSA9IGRlZmluaXRpb24udHlwZTtcbiAgICB0aGlzLmRlZmluaXRpb24gPSBkZWZpbml0aW9uO1xuXG4gICAgaWYgKHRoaXMuZGVmaW5pdGlvbi5udWxsYWJsZSA9PT0gdHJ1ZSAmJiB2YWx1ZSA9PT0gbnVsbClcbiAgICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICAgIGVsc2VcbiAgICAgIHRoaXMudmFsdWUgPSB0eXBlQ2hlY2tGdW5jdGlvbih2YWx1ZSwgZGVmaW5pdGlvbiwgbmFtZSk7XG4gICAgdGhpcy5fdHlwZUNoZWNrRnVuY3Rpb24gPSB0eXBlQ2hlY2tGdW5jdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHZhbHVlLlxuICAgKiBAcmV0dXJuIHtNaXhlZH1cbiAgICovXG4gIGdldFZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgY3VycmVudCB2YWx1ZS5cbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgLSBOZXcgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gLSBgdHJ1ZWAgaWYgdGhlIHBhcmFtIGhhcyBiZWVuIHVwZGF0ZWQsIGZhbHNlIG90aGVyd2lzZVxuICAgKiAgKGUuZy4gaWYgdGhlIHBhcmFtZXRlciBhbHJlYWR5IGhhZCB0aGlzIHZhbHVlKS5cbiAgICovXG4gIHNldFZhbHVlKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuZGVmaW5pdGlvbi5jb25zdGFudCA9PT0gdHJ1ZSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBhc3NpZ25lbWVudCB0byBjb25zdGFudCBwYXJhbSBcIiR7dGhpcy5uYW1lfVwiYCk7XG5cbiAgICBpZiAoISh0aGlzLmRlZmluaXRpb24ubnVsbGFibGUgPT09IHRydWUgJiYgdmFsdWUgPT09IG51bGwpKVxuICAgICAgdmFsdWUgPSB0aGlzLl90eXBlQ2hlY2tGdW5jdGlvbih2YWx1ZSwgdGhpcy5kZWZpbml0aW9uLCB0aGlzLm5hbWUpO1xuXG4gICAgaWYgKHRoaXMudmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuXG4vKipcbiAqIEJhZyBvZiBwYXJhbWV0ZXJzLiBNYWluIGludGVyZmFjZSBvZiB0aGUgbGlicmFyeVxuICovXG5jbGFzcyBQYXJhbWV0ZXJCYWcge1xuICBjb25zdHJ1Y3RvcihwYXJhbXMsIGRlZmluaXRpb25zKSB7XG4gICAgLyoqXG4gICAgICogTGlzdCBvZiBwYXJhbWV0ZXJzLlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdDxTdHJpbmcsIFBhcmFtPn1cbiAgICAgKiBAbmFtZSBfcGFyYW1zXG4gICAgICogQG1lbWJlcm9mIFBhcmFtZXRlckJhZ1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fcGFyYW1zID0gcGFyYW1zO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiBkZWZpbml0aW9ucyB3aXRoIGluaXQgdmFsdWVzLlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdDxTdHJpbmcsIHBhcmFtRGVmaW5pdGlvbj59XG4gICAgICogQG5hbWUgX2RlZmluaXRpb25zXG4gICAgICogQG1lbWJlcm9mIFBhcmFtZXRlckJhZ1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fZGVmaW5pdGlvbnMgPSBkZWZpbml0aW9ucztcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgZ2xvYmFsIGxpc3RlbmVycy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtTZXR9XG4gICAgICogQG5hbWUgX2dsb2JhbExpc3RlbmVyc1xuICAgICAqIEBtZW1iZXJvZiBQYXJhbWV0ZXJCYWdcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX2dsb2JhbExpc3RlbmVycyA9IG5ldyBTZXQoKTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgcGFyYW1zIGxpc3RlbmVycy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3Q8U3RyaW5nLCBTZXQ+fVxuICAgICAqIEBuYW1lIF9wYXJhbXNMaXN0ZW5lcnNcbiAgICAgKiBAbWVtYmVyb2YgUGFyYW1ldGVyQmFnXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9wYXJhbXNMaXN0ZW5lcnMgPSB7fTtcblxuICAgIC8vIGluaXRpYWxpemUgZW1wdHkgU2V0IGZvciBlYWNoIHBhcmFtXG4gICAgZm9yIChsZXQgbmFtZSBpbiBwYXJhbXMpXG4gICAgICB0aGlzLl9wYXJhbXNMaXN0ZW5lcnNbbmFtZV0gPSBuZXcgU2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBnaXZlbiBkZWZpbml0aW9ucyBhbG9uZyB3aXRoIHRoZSBpbml0aWFsaXphdGlvbiB2YWx1ZXMuXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIGdldERlZmluaXRpb25zKG5hbWUgPSBudWxsKSB7XG4gICAgaWYgKG5hbWUgIT09IG51bGwpXG4gICAgICByZXR1cm4gdGhpcy5fZGVmaW5pdGlvbnNbbmFtZV07XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRoaXMuX2RlZmluaXRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdmFsdWUgb2YgdGhlIGdpdmVuIHBhcmFtZXRlci5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEByZXR1cm4ge01peGVkfSAtIFZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBnZXQobmFtZSkge1xuICAgIGlmICghdGhpcy5fcGFyYW1zW25hbWVdKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcmVhZCBwcm9wZXJ0eSB2YWx1ZSBvZiB1bmRlZmluZWQgcGFyYW1ldGVyIFwiJHtuYW1lfVwiYCk7XG5cbiAgICByZXR1cm4gdGhpcy5fcGFyYW1zW25hbWVdLnZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgdmFsdWUgb2YgYSBwYXJhbWV0ZXIuIElmIHRoZSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyIGlzIHVwZGF0ZWRcbiAgICogKGFrYSBpZiBwcmV2aW91cyB2YWx1ZSBpcyBkaWZmZXJlbnQgZnJvbSBuZXcgdmFsdWUpIGFsbCByZWdpc3RlcmVkXG4gICAqIGNhbGxiYWNrcyBhcmUgcmVnaXN0ZXJlZC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIC0gVmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHJldHVybiB7TWl4ZWR9IC0gTmV3IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBzZXQobmFtZSwgdmFsdWUpIHtcbiAgICBjb25zdCBwYXJhbSA9IHRoaXMuX3BhcmFtc1tuYW1lXTtcbiAgICBjb25zdCB1cGRhdGVkID0gcGFyYW0uc2V0VmFsdWUodmFsdWUpO1xuICAgIHZhbHVlID0gcGFyYW0uZ2V0VmFsdWUoKTtcblxuICAgIGlmICh1cGRhdGVkKSB7XG4gICAgICBjb25zdCBtZXRhcyA9IHBhcmFtLmRlZmluaXRpb24ubWV0YXM7XG4gICAgICAvLyB0cmlnZ2VyIGdsb2JhbCBsaXN0ZW5lcnNcbiAgICAgIGZvciAobGV0IGxpc3RlbmVyIG9mIHRoaXMuX2dsb2JhbExpc3RlbmVycylcbiAgICAgICAgbGlzdGVuZXIobmFtZSwgdmFsdWUsIG1ldGFzKTtcblxuICAgICAgLy8gdHJpZ2dlciBwYXJhbSBsaXN0ZW5lcnNcbiAgICAgIGZvciAobGV0IGxpc3RlbmVyIG9mIHRoaXMuX3BhcmFtc0xpc3RlbmVyc1tuYW1lXSlcbiAgICAgICAgbGlzdGVuZXIodmFsdWUsIG1ldGFzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIGlmIHRoZSBgbmFtZWAgcGFyYW1ldGVyIGV4aXN0cyBvciBub3QuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaGFzKG5hbWUpIHtcbiAgICByZXR1cm4gKHRoaXMuX3BhcmFtc1tuYW1lXSkgPyB0cnVlIDogZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgYSBwYXJhbWV0ZXIgdG8gaXRzIGluaXQgdmFsdWUuIFJlc2V0IGFsbCBwYXJhbWV0ZXJzIGlmIG5vIGFyZ3VtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW25hbWU9bnVsbF0gLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIgdG8gcmVzZXQuXG4gICAqL1xuICByZXNldChuYW1lID0gbnVsbCkge1xuICAgIGlmIChuYW1lICE9PSBudWxsKVxuICAgICAgdGhpcy5zZXQobmFtZSwgcGFyYW0uZGVmaW5pdGlvbi5pbml0VmFsdWUpO1xuICAgIGVsc2VcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3BhcmFtcykuZm9yRWFjaCgobmFtZSkgPT4gdGhpcy5yZXNldChuYW1lKSk7XG4gIH1cblxuICAvKipcbiAgICogQGNhbGxiYWNrIFBhcmFtZXRlckJhZ35saXN0ZW5lckNhbGxiYWNrXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gUGFyYW1ldGVyIG5hbWUuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIC0gVXBkYXRlZCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW21ldGE9XSAtIEdpdmVuIG1ldGEgZGF0YSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cblxuICAvKipcbiAgICogQWRkIGxpc3RlbmVyIHRvIGFsbCBwYXJhbSB1cGRhdGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge1BhcmFtZXRlckJhZ35saXN0ZW5lckNhbGxhY2t9IGNhbGxiYWNrIC0gTGlzdGVuZXIgdG8gcmVnaXN0ZXIuXG4gICAqL1xuICBhZGRMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMuX2dsb2JhbExpc3RlbmVycy5hZGQoY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBsaXN0ZW5lciBmcm9tIGFsbCBwYXJhbSBjaGFuZ2VzLlxuICAgKlxuICAgKiBAcGFyYW0ge1BhcmFtZXRlckJhZ35saXN0ZW5lckNhbGxhY2t9IGNhbGxiYWNrIC0gTGlzdGVuZXIgdG8gcmVtb3ZlLiBJZlxuICAgKiAgYG51bGxgIHJlbW92ZSBhbGwgbGlzdGVuZXJzLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoY2FsbGJhY2sgPSBudWxsKSB7XG4gICAgaWYgKGNhbGxiYWNrID09PSBudWxsKVxuICAgICAgdGhpcy5fZ2xvYmFsTGlzdGVuZXJzLmNsZWFyKCk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5fZ2xvYmFsTGlzdGVuZXJzLmRlbGV0ZShjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogQGNhbGxiYWNrIFBhcmFtZXRlckJhZ35wYXJhbUxpc3RlbmVyQ2FsbGFja1xuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSAtIFVwZGF0ZWQgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IFttZXRhPV0gLSBHaXZlbiBtZXRhIGRhdGEgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG5cbiAgLyoqXG4gICAqIEFkZCBsaXN0ZW5lciB0byBhIGdpdmVuIHBhcmFtIHVwZGF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gUGFyYW1ldGVyIG5hbWUuXG4gICAqIEBwYXJhbSB7UGFyYW1ldGVyQmFnfnBhcmFtTGlzdGVuZXJDYWxsYWNrfSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGFwcGx5XG4gICAqICB3aGVuIHRoZSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyIGNoYW5nZXMuXG4gICAqL1xuICBhZGRQYXJhbUxpc3RlbmVyKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fcGFyYW1zTGlzdGVuZXJzW25hbWVdLmFkZChjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGxpc3RlbmVyIGZyb20gYSBnaXZlbiBwYXJhbSB1cGRhdGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFBhcmFtZXRlciBuYW1lLlxuICAgKiBAcGFyYW0ge1BhcmFtZXRlckJhZ35wYXJhbUxpc3RlbmVyQ2FsbGFja30gY2FsbGJhY2sgLSBMaXN0ZW5lciB0byByZW1vdmUuXG4gICAqICBJZiBgbnVsbGAgcmVtb3ZlIGFsbCBsaXN0ZW5lcnMuXG4gICAqL1xuICByZW1vdmVQYXJhbUxpc3RlbmVyKG5hbWUsIGNhbGxiYWNrID0gbnVsbCkge1xuICAgIGlmIChjYWxsYmFjayA9PT0gbnVsbClcbiAgICAgIHRoaXMuX3BhcmFtc0xpc3RlbmVyc1tuYW1lXS5jbGVhcigpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuX3BhcmFtc0xpc3RlbmVyc1tuYW1lXS5kZWxldGUoY2FsbGJhY2spO1xuICB9XG59XG5cbi8qKlxuICogRmFjdG9yeSBmb3IgdGhlIGBQYXJhbWV0ZXJCYWdgIGNsYXNzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0PFN0cmluZywgcGFyYW1EZWZpbml0aW9uPn0gZGVmaW5pdGlvbnMgLSBPYmplY3QgZGVzY3JpYmluZyB0aGVcbiAqICBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtPYmplY3Q8U3RyaW5nLCBNaXhlZD59IHZhbHVlcyAtIEluaXRpYWxpemF0aW9uIHZhbHVlcyBmb3IgdGhlXG4gKiAgcGFyYW1ldGVycy5cbiAqIEByZXR1cm4ge1BhcmFtZXRlckJhZ31cbiAqL1xuZnVuY3Rpb24gcGFyYW1ldGVycyhkZWZpbml0aW9ucywgdmFsdWVzID0ge30pIHtcbiAgY29uc3QgcGFyYW1zID0ge307XG5cbiAgZm9yIChsZXQgbmFtZSBpbiB2YWx1ZXMpIHtcbiAgICBpZiAoZGVmaW5pdGlvbnMuaGFzT3duUHJvcGVydHkobmFtZSkgPT09IGZhbHNlKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHBhcmFtIFwiJHtuYW1lfVwiYCk7XG4gIH1cblxuICBmb3IgKGxldCBuYW1lIGluIGRlZmluaXRpb25zKSB7XG4gICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSA9PT0gdHJ1ZSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUGFyYW1ldGVyIFwiJHtuYW1lfVwiIGFscmVhZHkgZGVmaW5lZGApO1xuXG4gICAgY29uc3QgZGVmaW5pdGlvbiA9IGRlZmluaXRpb25zW25hbWVdO1xuXG4gICAgaWYgKCFwYXJhbVRlbXBsYXRlc1tkZWZpbml0aW9uLnR5cGVdKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHBhcmFtIHR5cGUgXCIke2RlZmluaXRpb24udHlwZX1cImApO1xuXG4gICAgY29uc3Qge1xuICAgICAgZGVmaW5pdGlvblRlbXBsYXRlLFxuICAgICAgdHlwZUNoZWNrRnVuY3Rpb25cbiAgICB9ID0gcGFyYW1UZW1wbGF0ZXNbZGVmaW5pdGlvbi50eXBlXTtcblxuICAgIGxldCB2YWx1ZTtcblxuICAgIGlmICh2YWx1ZXMuaGFzT3duUHJvcGVydHkobmFtZSkgPT09IHRydWUpXG4gICAgICB2YWx1ZSA9IHZhbHVlc1tuYW1lXTtcbiAgICBlbHNlXG4gICAgICB2YWx1ZSA9IGRlZmluaXRpb24uZGVmYXVsdDtcblxuICAgIC8vIHN0b3JlIGluaXQgdmFsdWUgaW4gZGVmaW5pdGlvblxuICAgIGRlZmluaXRpb24uaW5pdFZhbHVlID0gdmFsdWU7XG5cbiAgICBpZiAoIXR5cGVDaGVja0Z1bmN0aW9uIHx8wqAhZGVmaW5pdGlvblRlbXBsYXRlKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHBhcmFtIHR5cGUgZGVmaW5pdGlvbiBcIiR7ZGVmaW5pdGlvbi50eXBlfVwiYCk7XG5cbiAgICBwYXJhbXNbbmFtZV0gPSBuZXcgUGFyYW0obmFtZSwgZGVmaW5pdGlvblRlbXBsYXRlLCB0eXBlQ2hlY2tGdW5jdGlvbiwgZGVmaW5pdGlvbiwgdmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBQYXJhbWV0ZXJCYWcocGFyYW1zLCBkZWZpbml0aW9ucyk7XG59XG5cbi8qKlxuICogUmVnaXN0ZXIgYSBuZXcgdHlwZSBmb3IgdGhlIGBwYXJhbWV0ZXJzYCBmYWN0b3J5LlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVOYW1lIC0gVmFsdWUgdGhhdCB3aWxsIGJlIGF2YWlsYWJsZSBhcyB0aGUgYHR5cGVgIG9mIGFcbiAqICBwYXJhbSBkZWZpbml0aW9uLlxuICogQHBhcmFtIHtwYXJhbWV0ZXJEZWZpbml0aW9ufSBwYXJhbWV0ZXJEZWZpbml0aW9uIC0gT2JqZWN0IGRlc2NyaWJpbmcgdGhlXG4gKiAgcGFyYW1ldGVyLlxuICovXG5wYXJhbWV0ZXJzLmRlZmluZVR5cGUgPSBmdW5jdGlvbih0eXBlTmFtZSwgcGFyYW1ldGVyRGVmaW5pdGlvbikge1xuICBwYXJhbVRlbXBsYXRlc1t0eXBlTmFtZV0gPSBwYXJhbWV0ZXJEZWZpbml0aW9uO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwYXJhbWV0ZXJzO1xuIiwiZXhwb3J0IGNvbnN0IHZlcnNpb24gPSAnJXZlcnNpb24lJztcblxuaW1wb3J0ICogYXMgX2NvcmUgZnJvbSAnLi4vY29yZSc7XG5leHBvcnQgY29uc3QgY29yZSA9IF9jb3JlO1xuXG5leHBvcnQgeyBkZWZhdWx0IGFzIG9wZXJhdG9yIH0gZnJvbSAnLi4vY29tbW9uL29wZXJhdG9yL19uYW1lc3BhY2UnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB1dGlscyB9IGZyb20gJy4vdXRpbHMvX25hbWVzcGFjZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHNvdXJjZSB9IGZyb20gJy4vc291cmNlL19uYW1lc3BhY2UnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzaW5rIH0gZnJvbSAnLi9zaW5rL19uYW1lc3BhY2UnO1xuIiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcblxuY29uc3QgY29tbW9uRGVmaW5pdGlvbnMgPSB7XG4gIG1pbjoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogLTEsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG4gIG1heDoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogMSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgd2lkdGg6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMzAwLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICBoZWlnaHQ6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMTUwLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICBjb250YWluZXI6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBjYW52YXM6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxufTtcblxuY29uc3QgaGFzRHVyYXRpb25EZWZpbml0aW9ucyA9IHtcbiAgZHVyYXRpb246IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIG1pbjogMCxcbiAgICBtYXg6ICtJbmZpbml0eSxcbiAgICBkZWZhdWx0OiAxLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICByZWZlcmVuY2VUaW1lOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiAwLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxufTtcblxuLyoqXG4gKiBCYXNlIGNsYXNzIHRvIGV4dGVuZCBpbiBvcmRlciB0byBjcmVhdGUgZ3JhcGhpYyBzaW5rcy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fVGhpcyBjbGFzcyBzaG91bGQgYmUgY29uc2lkZXJlZCBhYnN0cmFjdCBhbmQgb25seVxuICogYmUgdXNlZCB0byBiZSBleHRlbmRlZC5fPC9zcGFuPlxuICpcbiAqIEB0b2RvIC0gZml4IGZsb2F0IHJvdW5kaW5nIGVycm9ycyAocHJvZHVjZSBkZWNheXMgaW4gc3luYyBkcmF3cylcbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNsaWVudC5zaW5rXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWluPS0xXSAtIE1pbmltdW0gdmFsdWUgcmVwcmVzZW50ZWQgaW4gdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWF4PTFdIC0gTWF4aW11bSB2YWx1ZSByZXByZXNlbnRlZCBpbiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy53aWR0aD0zMDBdIC0gV2lkdGggb2YgdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGVpZ2h0PTE1MF0gLSBIZWlnaHQgb2YgdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge0VsZW1lbnR8Q1NTU2VsZWN0b3J9IFtvcHRpb25zLmNvbnRhaW5lcj1udWxsXSAtIENvbnRhaW5lciBlbGVtZW50XG4gKiAgaW4gd2hpY2ggdG8gaW5zZXJ0IHRoZSBjYW52YXMuIF9jb25zdGFudCBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge0VsZW1lbnR8Q1NTU2VsZWN0b3J9IFtvcHRpb25zLmNhbnZhcz1udWxsXSAtIENhbnZhcyBlbGVtZW50XG4gKiAgaW4gd2hpY2ggdG8gZHJhdy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5kdXJhdGlvbj0xXSAtIER1cmF0aW9uIChpbiBzZWNvbmRzKSByZXByZXNlbnRlZCBpblxuICogIHRoZSBjYW52YXMuIFRoaXMgcGFyYW1ldGVyIG9ubHkgZXhpc3RzIGZvciBvcGVyYXRvcnMgdGhhdCBkaXNwbGF5IHNldmVyYWxcbiAqICBjb25zZWN1dGl2ZSBmcmFtZXMgb24gdGhlIGNhbnZhcy4gX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnJlZmVyZW5jZVRpbWU9bnVsbF0gLSBPcHRpb25uYWwgcmVmZXJlbmNlIHRpbWUgdGhlXG4gKiAgZGlzcGxheSBzaG91bGQgY29uc2lkZXJlciBhcyB0aGUgb3JpZ2luLiBJcyBvbmx5IHVzZWZ1bGwgd2hlbiBzeW5jaHJvbml6aW5nXG4gKiAgc2V2ZXJhbCBkaXNwbGF5IHVzaW5nIHRoZSBgRGlzcGxheVN5bmNgIGNsYXNzLiBUaGlzIHBhcmFtZXRlciBvbmx5IGV4aXN0c1xuICogIGZvciBvcGVyYXRvcnMgdGhhdCBkaXNwbGF5IHNldmVyYWwgY29uc2VjdXRpdmUgZnJhbWVzIG9uIHRoZSBjYW52YXMuXG4gKi9cbmNsYXNzIEJhc2VEaXNwbGF5IGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKGRlZnMsIG9wdGlvbnMgPSB7fSwgaGFzRHVyYXRpb24gPSB0cnVlKSB7XG4gICAgbGV0IGNvbW1vbkRlZnM7XG5cbiAgICBpZiAoaGFzRHVyYXRpb24pXG4gICAgICBjb21tb25EZWZzID0gT2JqZWN0LmFzc2lnbih7fSwgY29tbW9uRGVmaW5pdGlvbnMsIGhhc0R1cmF0aW9uRGVmaW5pdGlvbnMpO1xuICAgIGVsc2VcbiAgICAgIGNvbW1vbkRlZnMgPSBjb21tb25EZWZpbml0aW9uc1xuXG4gICAgY29uc3QgZGVmaW5pdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBjb21tb25EZWZzLCBkZWZzKTtcblxuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ2NhbnZhcycpID09PSBudWxsICYmIHRoaXMucGFyYW1zLmdldCgnY29udGFpbmVyJykgPT09IG51bGwpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcGFyYW1ldGVyOiBgY2FudmFzYCBvciBgY29udGFpbmVyYCBub3QgZGVmaW5lZCcpO1xuXG4gICAgY29uc3QgY2FudmFzUGFyYW0gPSB0aGlzLnBhcmFtcy5nZXQoJ2NhbnZhcycpO1xuICAgIGNvbnN0IGNvbnRhaW5lclBhcmFtID0gdGhpcy5wYXJhbXMuZ2V0KCdjb250YWluZXInKTtcblxuICAgIC8vIHByZXBhcmUgY2FudmFzXG4gICAgaWYgKGNhbnZhc1BhcmFtKSB7XG4gICAgICBpZiAodHlwZW9mIGNhbnZhc1BhcmFtID09PSAnc3RyaW5nJylcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNhbnZhc1BhcmFtKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXNQYXJhbTtcbiAgICB9IGVsc2UgaWYgKGNvbnRhaW5lclBhcmFtKSB7XG4gICAgICBsZXQgY29udGFpbmVyO1xuXG4gICAgICBpZiAodHlwZW9mIGNvbnRhaW5lclBhcmFtID09PSAnc3RyaW5nJylcbiAgICAgICAgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXJQYXJhbSk7XG4gICAgICBlbHNlXG4gICAgICAgIGNvbnRhaW5lciA9IGNvbnRhaW5lclBhcmFtO1xuXG4gICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcbiAgICB9XG5cbiAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5jYWNoZWRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB0aGlzLmNhY2hlZEN0eCA9IHRoaXMuY2FjaGVkQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICB0aGlzLnByZXZpb3VzRnJhbWUgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFRpbWUgPSBoYXNEdXJhdGlvbiA/IHRoaXMucGFyYW1zLmdldCgncmVmZXJlbmNlVGltZScpIDogbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEluc3RhbmNlIG9mIHRoZSBgRGlzcGxheVN5bmNgIHVzZWQgdG8gc3luY2hyb25pemUgdGhlIGRpZmZlcmVudCBkaXNwbGF5c1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5kaXNwbGF5U3luYyA9IGZhbHNlO1xuXG4gICAgdGhpcy5fc3RhY2sgPSBbXTtcbiAgICB0aGlzLl9yYWZJZCA9IG51bGw7XG5cbiAgICB0aGlzLnJlbmRlclN0YWNrID0gdGhpcy5yZW5kZXJTdGFjay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2hpZnRFcnJvciA9IDA7XG5cbiAgICAvLyBpbml0aWFsaXplIGNhbnZhcyBzaXplIGFuZCB5IHNjYWxlIHRyYW5zZmVydCBmdW5jdGlvblxuICAgIHRoaXMuX3Jlc2l6ZSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9yZXNpemUoKSB7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnBhcmFtcy5nZXQoJ3dpZHRoJyk7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuZ2V0KCdoZWlnaHQnKTtcblxuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IGNhY2hlZEN0eCA9IHRoaXMuY2FjaGVkQ3R4O1xuXG4gICAgY29uc3QgZFBSID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgICBjb25zdCBiUFIgPSBjdHgud2Via2l0QmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxuICAgICAgY3R4Lm1vekJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcbiAgICAgIGN0eC5tc0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcbiAgICAgIGN0eC5vQmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxuICAgICAgY3R4LmJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHwgMTtcblxuICAgIHRoaXMucGl4ZWxSYXRpbyA9IGRQUiAvIGJQUjtcblxuICAgIGNvbnN0IGxhc3RXaWR0aCA9IHRoaXMuY2FudmFzV2lkdGg7XG4gICAgY29uc3QgbGFzdEhlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuICAgIHRoaXMuY2FudmFzV2lkdGggPSB3aWR0aCAqIHRoaXMucGl4ZWxSYXRpbztcbiAgICB0aGlzLmNhbnZhc0hlaWdodCA9IGhlaWdodCAqIHRoaXMucGl4ZWxSYXRpbztcblxuICAgIGNhY2hlZEN0eC5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIGNhY2hlZEN0eC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYW52YXNIZWlnaHQ7XG5cbiAgICAvLyBjb3B5IGN1cnJlbnQgaW1hZ2UgZnJvbSBjdHggKHJlc2l6ZSlcbiAgICBpZiAobGFzdFdpZHRoICYmIGxhc3RIZWlnaHQpIHtcbiAgICAgIGNhY2hlZEN0eC5kcmF3SW1hZ2UoY3R4LmNhbnZhcyxcbiAgICAgICAgMCwgMCwgbGFzdFdpZHRoLCBsYXN0SGVpZ2h0LFxuICAgICAgICAwLCAwLCB0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjdHguY2FudmFzLndpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjdHguY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuICAgIGN0eC5jYW52YXMuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgY3R4LmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xuXG4gICAgLy8gdXBkYXRlIHNjYWxlXG4gICAgdGhpcy5fc2V0WVNjYWxlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSB0cmFuc2ZlcnQgZnVuY3Rpb24gdXNlZCB0byBtYXAgdmFsdWVzIHRvIHBpeGVsIGluIHRoZSB5IGF4aXNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9zZXRZU2NhbGUoKSB7XG4gICAgY29uc3QgbWluID0gdGhpcy5wYXJhbXMuZ2V0KCdtaW4nKTtcbiAgICBjb25zdCBtYXggPSB0aGlzLnBhcmFtcy5nZXQoJ21heCcpO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuXG4gICAgY29uc3QgYSA9ICgwIC0gaGVpZ2h0KSAvIChtYXggLSBtaW4pO1xuICAgIGNvbnN0IGIgPSBoZWlnaHQgLSAoYSAqIG1pbik7XG5cbiAgICB0aGlzLmdldFlQb3NpdGlvbiA9ICh4KSA9PiBhICogeCArIGI7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgd2lkdGggaW4gcGl4ZWwgYSBgdmVjdG9yYCBmcmFtZSBuZWVkcyB0byBiZSBkcmF3bi5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldE1pbmltdW1GcmFtZVdpZHRoKCkge1xuICAgIHJldHVybiAxOyAvLyBuZWVkIG9uZSBwaXhlbCB0byBkcmF3IHRoZSBsaW5lXG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZnVuY3Rpb24gZXhlY3V0ZWQgd2hlbiBhIHBhcmFtZXRlciBpcyB1cGRhdGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFBhcmFtZXRlciBuYW1lLlxuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSAtIFBhcmFtZXRlciB2YWx1ZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG1ldGFzIC0gTWV0YWRhdGFzIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcykge1xuICAgIHN1cGVyLm9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKTtcblxuICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgY2FzZSAnbWluJzpcbiAgICAgIGNhc2UgJ21heCc6XG4gICAgICAgIC8vIEB0b2RvIC0gbWFrZSBzdXJlIHRoYXQgbWluIGFuZCBtYXggYXJlIGRpZmZlcmVudFxuICAgICAgICB0aGlzLl9zZXRZU2NhbGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3aWR0aCc6XG4gICAgICBjYXNlICdoZWlnaHQnOlxuICAgICAgICB0aGlzLl9yZXNpemUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvcGFnYXRlU3RyZWFtUGFyYW1zKCkge1xuICAgIHN1cGVyLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHJlc2V0U3RyZWFtKCkge1xuICAgIHN1cGVyLnJlc2V0U3RyZWFtKCk7XG5cbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuY2FudmFzV2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5jYW52YXNIZWlnaHQ7XG5cbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgdGhpcy5jYWNoZWRDdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGZpbmFsaXplU3RyZWFtKGVuZFRpbWUpIHtcbiAgICB0aGlzLmN1cnJlbnRUaW1lID0gbnVsbDtcbiAgICBzdXBlci5maW5hbGl6ZVN0cmVhbShlbmRUaW1lKTtcblxuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuX3JhZklkKTtcbiAgICB0aGlzLl9yYWZJZCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSBjdXJyZW50IGZyYW1lIHRvIHRoZSBmcmFtZXMgdG8gZHJhdy4gU2hvdWxkIG5vdCBiZSBvdmVycmlkZW4uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgY29weSA9IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplKTtcbiAgICBjb25zdCBkYXRhID0gZnJhbWUuZGF0YTtcblxuICAgIC8vIGNvcHkgdmFsdWVzIG9mIHRoZSBpbnB1dCBmcmFtZSBhcyB0aGV5IG1pZ2h0IGJlIHVwZGF0ZWRcbiAgICAvLyBpbiByZWZlcmVuY2UgYmVmb3JlIGJlaW5nIGNvbnN1bWVkIGluIHRoZSBkcmF3IGZ1bmN0aW9uXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKylcbiAgICAgIGNvcHlbaV0gPSBkYXRhW2ldO1xuXG4gICAgdGhpcy5fc3RhY2sucHVzaCh7XG4gICAgICB0aW1lOiBmcmFtZS50aW1lLFxuICAgICAgZGF0YTogY29weSxcbiAgICAgIG1ldGFkYXRhOiBmcmFtZS5tZXRhZGF0YSxcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9yYWZJZCA9PT0gbnVsbClcbiAgICAgIHRoaXMuX3JhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVuZGVyU3RhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgYWNjdW11bGF0ZWQgZnJhbWVzLiBNZXRob2QgY2FsbGVkIGluIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVuZGVyU3RhY2soKSB7XG4gICAgaWYgKHRoaXMucGFyYW1zLmhhcygnZHVyYXRpb24nKSkge1xuICAgICAgLy8gcmVuZGVyIGFsbCBmcmFtZSBzaW5jZSBsYXN0IGByZW5kZXJTdGFja2AgY2FsbFxuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLl9zdGFjay5sZW5ndGg7IGkgPCBsOyBpKyspXG4gICAgICAgIHRoaXMuc2Nyb2xsTW9kZURyYXcodGhpcy5fc3RhY2tbaV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvbmx5IHJlbmRlciBsYXN0IHJlY2VpdmVkIGZyYW1lIGlmIGFueVxuICAgICAgaWYgKHRoaXMuX3N0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgZnJhbWUgPSB0aGlzLl9zdGFja1t0aGlzLl9zdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzV2lkdGgsIHRoaXMuY2FudmFzSGVpZ2h0KTtcbiAgICAgICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlaW5pdCBzdGFjayBmb3IgbmV4dCBjYWxsXG4gICAgdGhpcy5fc3RhY2subGVuZ3RoID0gMDtcbiAgICB0aGlzLl9yYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlbmRlclN0YWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3IGRhdGEgZnJvbSByaWdodCB0byBsZWZ0IHdpdGggc2Nyb2xsaW5nXG4gICAqIEBwcml2YXRlXG4gICAqIEB0b2RvIC0gY2hlY2sgcG9zc2liaWxpdHkgb2YgbWFpbnRhaW5pbmcgYWxsIHZhbHVlcyBmcm9tIG9uZSBwbGFjZSB0b1xuICAgKiAgICAgICAgIG1pbmltaXplIGZsb2F0IGVycm9yIHRyYWNraW5nLlxuICAgKi9cbiAgc2Nyb2xsTW9kZURyYXcoZnJhbWUpIHtcbiAgICBjb25zdCBmcmFtZVR5cGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVR5cGU7XG4gICAgY29uc3QgZnJhbWVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBzb3VyY2VTYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcblxuICAgIGNvbnN0IGNhbnZhc0R1cmF0aW9uID0gdGhpcy5wYXJhbXMuZ2V0KCdkdXJhdGlvbicpO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IGNhbnZhc1dpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjb25zdCBjYW52YXNIZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcblxuICAgIGNvbnN0IHByZXZpb3VzRnJhbWUgPSB0aGlzLnByZXZpb3VzRnJhbWU7XG5cbiAgICAvLyBjdXJyZW50IHRpbWUgYXQgdGhlIGxlZnQgb2YgdGhlIGNhbnZhc1xuICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gKHRoaXMuY3VycmVudFRpbWUgIT09IG51bGwpID8gdGhpcy5jdXJyZW50VGltZSA6IGZyYW1lLnRpbWU7XG4gICAgY29uc3QgZnJhbWVTdGFydFRpbWUgPSBmcmFtZS50aW1lO1xuICAgIGNvbnN0IGxhc3RGcmFtZVRpbWUgPSBwcmV2aW91c0ZyYW1lID8gcHJldmlvdXNGcmFtZS50aW1lIDogMDtcbiAgICBjb25zdCBsYXN0RnJhbWVEdXJhdGlvbiA9IHRoaXMubGFzdEZyYW1lRHVyYXRpb24gPyB0aGlzLmxhc3RGcmFtZUR1cmF0aW9uIDogMDtcblxuICAgIGxldCBmcmFtZUR1cmF0aW9uO1xuXG4gICAgaWYgKGZyYW1lVHlwZSA9PT0gJ3NjYWxhcicgfHwgZnJhbWVUeXBlID09PSAndmVjdG9yJykge1xuICAgICAgY29uc3QgcGl4ZWxEdXJhdGlvbiA9IGNhbnZhc0R1cmF0aW9uIC8gY2FudmFzV2lkdGg7XG4gICAgICBmcmFtZUR1cmF0aW9uID0gdGhpcy5nZXRNaW5pbXVtRnJhbWVXaWR0aCgpICogcGl4ZWxEdXJhdGlvbjtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSA9PT0gJ3NpZ25hbCcpIHtcbiAgICAgIGZyYW1lRHVyYXRpb24gPSBmcmFtZVNpemUgLyBzb3VyY2VTYW1wbGVSYXRlO1xuICAgIH1cblxuICAgIGNvbnN0IGZyYW1lRW5kVGltZSA9IGZyYW1lU3RhcnRUaW1lICsgZnJhbWVEdXJhdGlvbjtcbiAgICAvLyBkZWZpbmUgaWYgd2UgbmVlZCB0byBzaGlmdCB0aGUgY2FudmFzXG4gICAgY29uc3Qgc2hpZnRUaW1lID0gZnJhbWVFbmRUaW1lIC0gY3VycmVudFRpbWU7XG5cbiAgICAvLyBpZiB0aGUgY2FudmFzIGlzIG5vdCBzeW5jZWQsIHNob3VsZCBuZXZlciBnbyB0byBgZWxzZWBcbiAgICBpZiAoc2hpZnRUaW1lID4gMCkge1xuICAgICAgLy8gc2hpZnQgdGhlIGNhbnZhcyBvZiBzaGlmdFRpbWUgaW4gcGl4ZWxzXG4gICAgICBjb25zdCBmU2hpZnQgPSAoc2hpZnRUaW1lIC8gY2FudmFzRHVyYXRpb24pICogY2FudmFzV2lkdGggLSB0aGlzLnNoaWZ0RXJyb3I7XG4gICAgICBjb25zdCBpU2hpZnQgPSBNYXRoLmZsb29yKGZTaGlmdCArIDAuNSk7XG4gICAgICB0aGlzLnNoaWZ0RXJyb3IgPSBmU2hpZnQgLSBpU2hpZnQ7XG5cbiAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gZnJhbWVTdGFydFRpbWUgKyBmcmFtZUR1cmF0aW9uO1xuICAgICAgdGhpcy5zaGlmdENhbnZhcyhpU2hpZnQsIGN1cnJlbnRUaW1lKTtcblxuICAgICAgLy8gaWYgc2libGluZ3MsIHNoYXJlIHRoZSBpbmZvcm1hdGlvblxuICAgICAgaWYgKHRoaXMuZGlzcGxheVN5bmMpXG4gICAgICAgIHRoaXMuZGlzcGxheVN5bmMuc2hpZnRTaWJsaW5ncyhpU2hpZnQsIGN1cnJlbnRUaW1lLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvLyB3aWR0aCBvZiB0aGUgZnJhbWUgaW4gcGl4ZWxzXG4gICAgY29uc3QgZkZyYW1lV2lkdGggPSAoZnJhbWVEdXJhdGlvbiAvIGNhbnZhc0R1cmF0aW9uKSAqIGNhbnZhc1dpZHRoO1xuICAgIGNvbnN0IGZyYW1lV2lkdGggPSBNYXRoLmZsb29yKGZGcmFtZVdpZHRoICsgMC41KTtcblxuICAgIC8vIGRlZmluZSBwb3NpdGlvbiBvZiB0aGUgaGVhZCBpbiB0aGUgY2FudmFzXG4gICAgY29uc3QgY2FudmFzU3RhcnRUaW1lID0gdGhpcy5jdXJyZW50VGltZSAtIGNhbnZhc0R1cmF0aW9uO1xuICAgIGNvbnN0IHN0YXJ0VGltZVJhdGlvID0gKGZyYW1lU3RhcnRUaW1lIC0gY2FudmFzU3RhcnRUaW1lKSAvIGNhbnZhc0R1cmF0aW9uO1xuICAgIGNvbnN0IHN0YXJ0VGltZVBvc2l0aW9uID0gc3RhcnRUaW1lUmF0aW8gKiBjYW52YXNXaWR0aDtcblxuICAgIC8vIG51bWJlciBvZiBwaXhlbHMgc2luY2UgbGFzdCBmcmFtZVxuICAgIGxldCBwaXhlbHNTaW5jZUxhc3RGcmFtZSA9IHRoaXMubGFzdEZyYW1lV2lkdGg7XG5cbiAgICBpZiAoKGZyYW1lVHlwZSA9PT0gJ3NjYWxhcicgfHwgZnJhbWVUeXBlID09PSAndmVjdG9yJykgJiYgcHJldmlvdXNGcmFtZSkge1xuICAgICAgY29uc3QgZnJhbWVJbnRlcnZhbCA9IGZyYW1lLnRpbWUgLSBwcmV2aW91c0ZyYW1lLnRpbWU7XG4gICAgICBwaXhlbHNTaW5jZUxhc3RGcmFtZSA9IChmcmFtZUludGVydmFsIC8gY2FudmFzRHVyYXRpb24pICogY2FudmFzV2lkdGg7XG4gICAgfVxuXG4gICAgLy8gZHJhdyBjdXJyZW50IGZyYW1lXG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHgudHJhbnNsYXRlKHN0YXJ0VGltZVBvc2l0aW9uLCAwKTtcbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSwgZnJhbWVXaWR0aCwgcGl4ZWxzU2luY2VMYXN0RnJhbWUpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICAvLyBzYXZlIGN1cnJlbnQgY2FudmFzIHN0YXRlIGludG8gY2FjaGVkIGNhbnZhc1xuICAgIHRoaXMuY2FjaGVkQ3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KTtcbiAgICB0aGlzLmNhY2hlZEN0eC5kcmF3SW1hZ2UodGhpcy5jYW52YXMsIDAsIDAsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xuXG4gICAgLy8gdXBkYXRlIGxhc3RGcmFtZUR1cmF0aW9uLCBsYXN0RnJhbWVXaWR0aFxuICAgIHRoaXMubGFzdEZyYW1lRHVyYXRpb24gPSBmcmFtZUR1cmF0aW9uO1xuICAgIHRoaXMubGFzdEZyYW1lV2lkdGggPSBmcmFtZVdpZHRoO1xuICAgIHRoaXMucHJldmlvdXNGcmFtZSA9IGZyYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNoaWZ0IGNhbnZhcywgYWxzbyBjYWxsZWQgZnJvbSBgRGlzcGxheVN5bmNgXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzaGlmdENhbnZhcyhpU2hpZnQsIHRpbWUpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCBjYWNoZSA9IHRoaXMuY2FjaGVkQ2FudmFzO1xuICAgIGNvbnN0IGNhY2hlZEN0eCA9IHRoaXMuY2FjaGVkQ3R4O1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcbiAgICBjb25zdCBjcm9wcGVkV2lkdGggPSB3aWR0aCAtIGlTaGlmdDtcbiAgICB0aGlzLmN1cnJlbnRUaW1lID0gdGltZTtcblxuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgY3R4LmRyYXdJbWFnZShjYWNoZSwgaVNoaWZ0LCAwLCBjcm9wcGVkV2lkdGgsIGhlaWdodCwgMCwgMCwgY3JvcHBlZFdpZHRoLCBoZWlnaHQpO1xuICAgIC8vIHNhdmUgY3VycmVudCBjYW52YXMgc3RhdGUgaW50byBjYWNoZWQgY2FudmFzXG4gICAgY2FjaGVkQ3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBjYWNoZWRDdHguZHJhd0ltYWdlKHRoaXMuY2FudmFzLCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgfVxuXG4gIC8vIEB0b2RvIC0gRml4IHRyaWdnZXIgbW9kZVxuICAvLyBhbGxvdyB0byB3aXRjaCBlYXNpbHkgYmV0d2VlbiB0aGUgMiBtb2Rlc1xuICAvLyBzZXRUcmlnZ2VyKGJvb2wpIHtcbiAgLy8gICB0aGlzLnBhcmFtcy50cmlnZ2VyID0gYm9vbDtcbiAgLy8gICAvLyBjbGVhciBjYW52YXMgYW5kIGNhY2hlXG4gIC8vICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucGFyYW1zLndpZHRoLCB0aGlzLnBhcmFtcy5oZWlnaHQpO1xuICAvLyAgIHRoaXMuY2FjaGVkQ3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnBhcmFtcy53aWR0aCwgdGhpcy5wYXJhbXMuaGVpZ2h0KTtcbiAgLy8gICAvLyByZXNldCBfY3VycmVudFhQb3NpdGlvblxuICAvLyAgIHRoaXMuX2N1cnJlbnRYUG9zaXRpb24gPSAwO1xuICAvLyAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSAwO1xuICAvLyB9XG5cbiAgLy8gLyoqXG4gIC8vICAqIEFsdGVybmF0aXZlIGRyYXdpbmcgbW9kZS5cbiAgLy8gICogRHJhdyBmcm9tIGxlZnQgdG8gcmlnaHQsIGdvIGJhY2sgdG8gbGVmdCB3aGVuID4gd2lkdGhcbiAgLy8gICovXG4gIC8vIHRyaWdnZXJNb2RlRHJhdyh0aW1lLCBmcmFtZSkge1xuICAvLyAgIGNvbnN0IHdpZHRoICA9IHRoaXMucGFyYW1zLndpZHRoO1xuICAvLyAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgLy8gICBjb25zdCBkdXJhdGlvbiA9IHRoaXMucGFyYW1zLmR1cmF0aW9uO1xuICAvLyAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuXG4gIC8vICAgY29uc3QgZHQgPSB0aW1lIC0gdGhpcy5wcmV2aW91c1RpbWU7XG4gIC8vICAgY29uc3QgZlNoaWZ0ID0gKGR0IC8gZHVyYXRpb24pICogd2lkdGggLSB0aGlzLmxhc3RTaGlmdEVycm9yOyAvLyBweFxuICAvLyAgIGNvbnN0IGlTaGlmdCA9IE1hdGgucm91bmQoZlNoaWZ0KTtcbiAgLy8gICB0aGlzLmxhc3RTaGlmdEVycm9yID0gaVNoaWZ0IC0gZlNoaWZ0O1xuXG4gIC8vICAgdGhpcy5jdXJyZW50WFBvc2l0aW9uICs9IGlTaGlmdDtcblxuICAvLyAgIC8vIGRyYXcgdGhlIHJpZ2h0IHBhcnRcbiAgLy8gICBjdHguc2F2ZSgpO1xuICAvLyAgIGN0eC50cmFuc2xhdGUodGhpcy5jdXJyZW50WFBvc2l0aW9uLCAwKTtcbiAgLy8gICBjdHguY2xlYXJSZWN0KC1pU2hpZnQsIDAsIGlTaGlmdCwgaGVpZ2h0KTtcbiAgLy8gICB0aGlzLmRyYXdDdXJ2ZShmcmFtZSwgaVNoaWZ0KTtcbiAgLy8gICBjdHgucmVzdG9yZSgpO1xuXG4gIC8vICAgLy8gZ28gYmFjayB0byB0aGUgbGVmdCBvZiB0aGUgY2FudmFzIGFuZCByZWRyYXcgdGhlIHNhbWUgdGhpbmdcbiAgLy8gICBpZiAodGhpcy5jdXJyZW50WFBvc2l0aW9uID4gd2lkdGgpIHtcbiAgLy8gICAgIC8vIGdvIGJhY2sgdG8gc3RhcnRcbiAgLy8gICAgIHRoaXMuY3VycmVudFhQb3NpdGlvbiAtPSB3aWR0aDtcblxuICAvLyAgICAgY3R4LnNhdmUoKTtcbiAgLy8gICAgIGN0eC50cmFuc2xhdGUodGhpcy5jdXJyZW50WFBvc2l0aW9uLCAwKTtcbiAgLy8gICAgIGN0eC5jbGVhclJlY3QoLWlTaGlmdCwgMCwgaVNoaWZ0LCBoZWlnaHQpO1xuICAvLyAgICAgdGhpcy5kcmF3Q3VydmUoZnJhbWUsIHRoaXMucHJldmlvdXNGcmFtZSwgaVNoaWZ0KTtcbiAgLy8gICAgIGN0eC5yZXN0b3JlKCk7XG4gIC8vICAgfVxuICAvLyB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmFzZURpc3BsYXk7XG4iLCJpbXBvcnQgQmFzZURpc3BsYXkgZnJvbSAnLi9CYXNlRGlzcGxheSc7XG5pbXBvcnQgeyBnZXRDb2xvcnMgfSBmcm9tICcuLi91dGlscy9kaXNwbGF5LXV0aWxzJztcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIHJhZGl1czoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgbWluOiAwLFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH1cbiAgfSxcbiAgbGluZToge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICBjb2xvcnM6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICB9XG59XG5cblxuLyoqXG4gKiBCcmVha3BvaW50IEZ1bmN0aW9uLCBkaXNwbGF5IGEgc3RyZWFtIG9mIHR5cGUgYHZlY3RvcmAuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjbGllbnQuc2lua1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9ycz1udWxsXSAtIEFycmF5IG9mIGNvbG9ycyBmb3IgZWFjaCBpbmRleCBvZiB0aGVcbiAqICB2ZWN0b3IuIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5yYWRpdXM9MF0gLSBSYWRpdXMgb2YgdGhlIGRvdCBhdCBlYWNoIHZhbHVlLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5saW5lPXRydWVdIC0gRGlzcGxheSBhIGxpbmUgYmV0d2VlbiBlYWNoIGNvbnNlY3V0aXZlXG4gKiAgdmFsdWVzIG9mIHRoZSB2ZWN0b3IuIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5taW49LTFdIC0gTWluaW11bSB2YWx1ZSByZXByZXNlbnRlZCBpbiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXg9MV0gLSBNYXhpbXVtIHZhbHVlIHJlcHJlc2VudGVkIGluIHRoZSBjYW52YXMuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndpZHRoPTMwMF0gLSBXaWR0aCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oZWlnaHQ9MTUwXSAtIEhlaWdodCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY29udGFpbmVyPW51bGxdIC0gQ29udGFpbmVyIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBpbnNlcnQgdGhlIGNhbnZhcy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY2FudmFzPW51bGxdIC0gQ2FudmFzIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBkcmF3LiBfY29uc3RhbnQgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmR1cmF0aW9uPTFdIC0gRHVyYXRpb24gKGluIHNlY29uZHMpIHJlcHJlc2VudGVkIGluXG4gKiAgdGhlIGNhbnZhcy4gX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnJlZmVyZW5jZVRpbWU9bnVsbF0gLSBPcHRpb25uYWwgcmVmZXJlbmNlIHRpbWUgdGhlXG4gKiAgZGlzcGxheSBzaG91bGQgY29uc2lkZXJlciBhcyB0aGUgb3JpZ2luLiBJcyBvbmx5IHVzZWZ1bGwgd2hlbiBzeW5jaHJvbml6aW5nXG4gKiAgc2V2ZXJhbCBkaXNwbGF5IHVzaW5nIHRoZSBgRGlzcGxheVN5bmNgIGNsYXNzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVNpemU6IDIsXG4gKiAgIGZyYW1lUmF0ZTogMC4xLFxuICogICBmcmFtZVR5cGU6ICd2ZWN0b3InXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBicGYgPSBuZXcgbGZvLnNpbmsuQnBmRGlzcGxheSh7XG4gKiAgIGNhbnZhczogJyNicGYnLFxuICogICBkdXJhdGlvbjogMTAsXG4gKiB9KTtcbiAqXG4gKiBldmVudEluLmNvbm5lY3QoYnBmKTtcbiAqIGV2ZW50SW4uc3RhcnQoKTtcbiAqXG4gKiBsZXQgdGltZSA9IDA7XG4gKiBjb25zdCBkdCA9IDAuMTtcbiAqXG4gKiAoZnVuY3Rpb24gZ2VuZXJhdGVEYXRhKCkge1xuICogICBldmVudEluLnByb2Nlc3ModGltZSwgW01hdGgucmFuZG9tKCkgKiAyIC0gMSwgTWF0aC5yYW5kb20oKSAqIDIgLSAxXSk7XG4gKiAgIHRpbWUgKz0gZHQ7XG4gKlxuICogICBzZXRUaW1lb3V0KGdlbmVyYXRlRGF0YSwgZHQgKiAxMDAwKTtcbiAqIH0oKSk7XG4gKi9cbmNsYXNzIEJwZkRpc3BsYXkgZXh0ZW5kcyBCYXNlRGlzcGxheSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnByZXZGcmFtZSA9IG51bGw7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgZ2V0TWluaW11bUZyYW1lV2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLmdldCgncmFkaXVzJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnY29sb3JzJykgPT09IG51bGwpXG4gICAgICB0aGlzLnBhcmFtcy5zZXQoJ2NvbG9ycycsIGdldENvbG9ycygnYnBmJywgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplKSk7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUsIGZyYW1lV2lkdGgsIHBpeGVsc1NpbmNlTGFzdEZyYW1lKSB7XG4gICAgY29uc3QgY29sb3JzID0gdGhpcy5wYXJhbXMuZ2V0KCdjb2xvcnMnKTtcbiAgICBjb25zdCByYWRpdXMgPSB0aGlzLnBhcmFtcy5nZXQoJ3JhZGl1cycpO1xuICAgIGNvbnN0IGRyYXdMaW5lID0gdGhpcy5wYXJhbXMuZ2V0KCdsaW5lJyk7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IGRhdGEgPSBmcmFtZS5kYXRhO1xuICAgIGNvbnN0IHByZXZEYXRhID0gdGhpcy5wcmV2RnJhbWUgPyB0aGlzLnByZXZGcmFtZS5kYXRhIDogbnVsbDtcblxuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IGZyYW1lU2l6ZTsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgcG9zWSA9IHRoaXMuZ2V0WVBvc2l0aW9uKGRhdGFbaV0pO1xuICAgICAgY29uc3QgY29sb3IgPSBjb2xvcnNbaV07XG5cbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuXG4gICAgICBpZiAocHJldkRhdGEgJiYgZHJhd0xpbmUpIHtcbiAgICAgICAgY29uc3QgbGFzdFBvc1kgPSB0aGlzLmdldFlQb3NpdGlvbihwcmV2RGF0YVtpXSk7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4Lm1vdmVUbygtcGl4ZWxzU2luY2VMYXN0RnJhbWUsIGxhc3RQb3NZKTtcbiAgICAgICAgY3R4LmxpbmVUbygwLCBwb3NZKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyYWRpdXMgPiAwKSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmFyYygwLCBwb3NZLCByYWRpdXMsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XG4gICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICB0aGlzLnByZXZGcmFtZSA9IGZyYW1lO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJwZkRpc3BsYXk7XG4iLCJpbXBvcnQgQmFzZURpc3BsYXkgZnJvbSAnLi9CYXNlRGlzcGxheSc7XG5pbXBvcnQgeyBnZXRDb2xvcnMgfSBmcm9tICcuLi91dGlscy9kaXNwbGF5LXV0aWxzJztcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIHRocmVzaG9sZDoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgdGhyZXNob2xkSW5kZXg6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMCxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgY29sb3I6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiBnZXRDb2xvcnMoJ21hcmtlcicpLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9XG59O1xuXG4vKipcbiAqIERpc3BsYXkgYSBtYXJrZXIgYWNjb3JkaW5nIHRvIGEgYHZlY3RvcmAgaW5wdXQgZnJhbWUuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjbGllbnQuc2lua1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuY29sb3IgLSBDb2xvciBvZiB0aGUgbWFya2VyLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnRocmVzaG9sZEluZGV4PTBdIC0gSW5kZXggb2YgdGhlIGluY29tbWluZyBmcmFtZVxuICogIGRhdGEgdG8gY29tcGFyZSBhZ2FpbnN0IHRoZSB0aHJlc2hvbGQuIF9TaG91bGQgYmUgdXNlZCBpbiBjb25qb25jdGlvbiB3aXRoXG4gKiAgYHRocmVzaG9sZGBfLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnRocmVzaG9sZD1udWxsXSAtIE1pbmltdW0gdmFsdWUgdGhlIGluY29tbWluZyB2YWx1ZVxuICogIG11c3QgaGF2ZSB0byB0cmlnZ2VyIHRoZSBkaXNwbGF5IG9mIGEgbWFya2VyLiBJZiBudWxsIGVhY2ggaW5jb21taW5nIGV2ZW50XG4gKiAgdHJpZ2dlcnMgYSBtYXJrZXIuIF9TaG91bGQgYmUgdXNlZCBpbiBjb25qb25jdGlvbiB3aXRoIGB0aHJlc2hvbGRJbmRleGBfLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndpZHRoPTMwMF0gLSBXaWR0aCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oZWlnaHQ9MTUwXSAtIEhlaWdodCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY29udGFpbmVyPW51bGxdIC0gQ29udGFpbmVyIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBpbnNlcnQgdGhlIGNhbnZhcy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY2FudmFzPW51bGxdIC0gQ2FudmFzIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBkcmF3LiBfY29uc3RhbnQgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmR1cmF0aW9uPTFdIC0gRHVyYXRpb24gKGluIHNlY29uZHMpIHJlcHJlc2VudGVkIGluXG4gKiAgdGhlIGNhbnZhcy4gVGhpcyBwYXJhbWV0ZXIgb25seSBleGlzdHMgZm9yIG9wZXJhdG9ycyB0aGF0IGRpc3BsYXkgc2V2ZXJhbFxuICogIGNvbnNlY3V0aXZlIGZyYW1lcyBvbiB0aGUgY2FudmFzLiBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucmVmZXJlbmNlVGltZT1udWxsXSAtIE9wdGlvbm5hbCByZWZlcmVuY2UgdGltZSB0aGVcbiAqICBkaXNwbGF5IHNob3VsZCBjb25zaWRlcmVyIGFzIHRoZSBvcmlnaW4uIElzIG9ubHkgdXNlZnVsbCB3aGVuIHN5bmNocm9uaXppbmdcbiAqICBzZXZlcmFsIGRpc3BsYXkgdXNpbmcgdGhlIGBEaXNwbGF5U3luY2AgY2xhc3MuIFRoaXMgcGFyYW1ldGVyIG9ubHkgZXhpc3RzXG4gKiAgZm9yIG9wZXJhdG9ycyB0aGF0IGRpc3BsYXkgc2V2ZXJhbCBjb25zZWN1dGl2ZSBmcmFtZXMgb24gdGhlIGNhbnZhcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIGNvbnN0IGV2ZW50SW4gPSBuZXcgbGZvLnNvdXJjZS5FdmVudEluKHtcbiAqICAgZnJhbWVUeXBlOiAnc2NhbGFyJyxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IG1hcmtlciA9IG5ldyBsZm8uc2luay5NYXJrZXJEaXNwbGF5KHtcbiAqICAgY2FudmFzOiAnI21hcmtlcicsXG4gKiAgIHRocmVzaG9sZDogMC41LFxuICogfSk7XG4gKlxuICogZXZlbnRJbi5jb25uZWN0KG1hcmtlcik7XG4gKiBldmVudEluLnN0YXJ0KCk7XG4gKlxuICogbGV0IHRpbWUgPSAwO1xuICogY29uc3QgcGVyaW9kID0gMTtcbiAqXG4gKiAoZnVuY3Rpb24gZ2VuZXJhdGVEYXRhKCkge1xuICogICBldmVudEluLnByb2Nlc3ModGltZSwgTWF0aC5yYW5kb20oKSk7XG4gKlxuICogICB0aW1lICs9IHBlcmlvZDtcbiAqICAgc2V0VGltZW91dChnZW5lcmF0ZURhdGEsIHBlcmlvZCAqIDEwMDApO1xuICogfSgpKTtcbiAqL1xuY2xhc3MgTWFya2VyRGlzcGxheSBleHRlbmRzIEJhc2VEaXNwbGF5IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUsIGZyYW1lV2lkdGgsIHBpeGVsc1NpbmNlTGFzdEZyYW1lKSB7XG4gICAgY29uc3QgY29sb3IgPSB0aGlzLnBhcmFtcy5nZXQoJ2NvbG9yJyk7XG4gICAgY29uc3QgdGhyZXNob2xkID0gdGhpcy5wYXJhbXMuZ2V0KCd0aHJlc2hvbGQnKTtcbiAgICBjb25zdCB0aHJlc2hvbGRJbmRleCA9IHRoaXMucGFyYW1zLmdldCgndGhyZXNob2xkSW5kZXgnKTtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCBoZWlnaHQgPSBjdHguaGVpZ2h0O1xuICAgIGNvbnN0IHZhbHVlID0gZnJhbWUuZGF0YVt0aHJlc2hvbGRJbmRleF07XG5cbiAgICBpZiAodGhyZXNob2xkID09PSBudWxsIHx8IHZhbHVlID49IHRocmVzaG9sZCkge1xuICAgICAgbGV0IHlNaW4gPSB0aGlzLmdldFlQb3NpdGlvbih0aGlzLnBhcmFtcy5nZXQoJ21pbicpKTtcbiAgICAgIGxldCB5TWF4ID0gdGhpcy5nZXRZUG9zaXRpb24odGhpcy5wYXJhbXMuZ2V0KCdtYXgnKSk7XG5cbiAgICAgIGlmICh5TWluID4geU1heCkge1xuICAgICAgICBjb25zdCB2ID0geU1heDtcbiAgICAgICAgeU1heCA9IHlNaW47XG4gICAgICAgIHlNaW4gPSB2O1xuICAgICAgfVxuXG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgICAgY3R4LmZpbGxSZWN0KDAsIHlNaW4sIDEsIHlNYXgpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFya2VyRGlzcGxheTtcbiIsImltcG9ydCBCYXNlRGlzcGxheSBmcm9tICcuL0Jhc2VEaXNwbGF5JztcbmltcG9ydCB7IGdldENvbG9ycyB9IGZyb20gJy4uL3V0aWxzL2Rpc3BsYXktdXRpbHMnO1xuXG5jb25zdCBmbG9vciA9IE1hdGguZmxvb3I7XG5jb25zdCBjZWlsID0gTWF0aC5jZWlsO1xuXG5mdW5jdGlvbiBkb3duU2FtcGxlKGRhdGEsIHRhcmdldExlbmd0aCkge1xuICBjb25zdCBsZW5ndGggPSBkYXRhLmxlbmd0aDtcbiAgY29uc3QgaG9wID0gbGVuZ3RoIC8gdGFyZ2V0TGVuZ3RoO1xuICBjb25zdCB0YXJnZXQgPSBuZXcgRmxvYXQzMkFycmF5KHRhcmdldExlbmd0aCk7XG4gIGxldCBjb3VudGVyID0gMDtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRhcmdldExlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgaW5kZXggPSBmbG9vcihjb3VudGVyKTtcbiAgICBjb25zdCBwaGFzZSA9IGNvdW50ZXIgLSBpbmRleDtcbiAgICBjb25zdCBwcmV2ID0gZGF0YVtpbmRleF07XG4gICAgY29uc3QgbmV4dCA9IGRhdGFbaW5kZXggKyAxXTtcblxuICAgIHRhcmdldFtpXSA9IChuZXh0IC0gcHJldikgKiBwaGFzZSArIHByZXY7XG4gICAgY291bnRlciArPSBob3A7XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgY29sb3I6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiBnZXRDb2xvcnMoJ3NpZ25hbCcpLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICB9LFxufTtcblxuLyoqXG4gKiBEaXNwbGF5IGEgc3RyZWFtIG9mIHR5cGUgYHNpZ25hbGAgb24gYSBjYW52YXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9JyMwMGU2MDAnXSAtIENvbG9yIG9mIHRoZSBzaWduYWwuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWluPS0xXSAtIE1pbmltdW0gdmFsdWUgcmVwcmVzZW50ZWQgaW4gdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWF4PTFdIC0gTWF4aW11bSB2YWx1ZSByZXByZXNlbnRlZCBpbiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy53aWR0aD0zMDBdIC0gV2lkdGggb2YgdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGVpZ2h0PTE1MF0gLSBIZWlnaHQgb2YgdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge0VsZW1lbnR8Q1NTU2VsZWN0b3J9IFtvcHRpb25zLmNvbnRhaW5lcj1udWxsXSAtIENvbnRhaW5lciBlbGVtZW50XG4gKiAgaW4gd2hpY2ggdG8gaW5zZXJ0IHRoZSBjYW52YXMuIF9jb25zdGFudCBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge0VsZW1lbnR8Q1NTU2VsZWN0b3J9IFtvcHRpb25zLmNhbnZhcz1udWxsXSAtIENhbnZhcyBlbGVtZW50XG4gKiAgaW4gd2hpY2ggdG8gZHJhdy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5kdXJhdGlvbj0xXSAtIER1cmF0aW9uIChpbiBzZWNvbmRzKSByZXByZXNlbnRlZCBpblxuICogIHRoZSBjYW52YXMuIFRoaXMgcGFyYW1ldGVyIG9ubHkgZXhpc3RzIGZvciBvcGVyYXRvcnMgdGhhdCBkaXNwbGF5IHNldmVyYWxcbiAqICBjb25zZWN1dGl2ZSBmcmFtZXMgb24gdGhlIGNhbnZhcy4gX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnJlZmVyZW5jZVRpbWU9bnVsbF0gLSBPcHRpb25uYWwgcmVmZXJlbmNlIHRpbWUgdGhlXG4gKiAgZGlzcGxheSBzaG91bGQgY29uc2lkZXJlciBhcyB0aGUgb3JpZ2luLiBJcyBvbmx5IHVzZWZ1bGwgd2hlbiBzeW5jaHJvbml6aW5nXG4gKiAgc2V2ZXJhbCBkaXNwbGF5IHVzaW5nIHRoZSBgRGlzcGxheVN5bmNgIGNsYXNzLiBUaGlzIHBhcmFtZXRlciBvbmx5IGV4aXN0c1xuICogIGZvciBvcGVyYXRvcnMgdGhhdCBkaXNwbGF5IHNldmVyYWwgY29uc2VjdXRpdmUgZnJhbWVzIG9uIHRoZSBjYW52YXMuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjbGllbnQuc2lua1xuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBldmVudEluID0gbmV3IGxmby5zb3VyY2UuRXZlbnRJbih7XG4gKiAgIGZyYW1lVHlwZTogJ3NpZ25hbCcsXG4gKiAgIHNhbXBsZVJhdGU6IDgsXG4gKiAgIGZyYW1lU2l6ZTogNCxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IHNpZ25hbERpc3BsYXkgPSBuZXcgbGZvLnNpbmsuU2lnbmFsRGlzcGxheSh7XG4gKiAgIGNhbnZhczogJyNzaWduYWwtY2FudmFzJyxcbiAqIH0pO1xuICpcbiAqIGV2ZW50SW4uY29ubmVjdChzaWduYWxEaXNwbGF5KTtcbiAqIGV2ZW50SW4uc3RhcnQoKTtcbiAqXG4gKiAvLyBwdXNoIHRyaWFuZ2xlIHNpZ25hbCBpbiB0aGUgZ3JhcGhcbiAqIGV2ZW50SW4ucHJvY2VzcygwLCBbMCwgMC41LCAxLCAwLjVdKTtcbiAqIGV2ZW50SW4ucHJvY2VzcygwLjUsIFswLCAtMC41LCAtMSwgLTAuNV0pO1xuICogLy8gLi4uXG4gKi9cbmNsYXNzIFNpZ25hbERpc3BsYXkgZXh0ZW5kcyBCYXNlRGlzcGxheSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucywgdHJ1ZSk7XG5cbiAgICB0aGlzLmxhc3RQb3NZID0gbnVsbDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKGZyYW1lLCBmcmFtZVdpZHRoLCBwaXhlbHNTaW5jZUxhc3RGcmFtZSkge1xuICAgIGNvbnN0IGNvbG9yID0gdGhpcy5wYXJhbXMuZ2V0KCdjb2xvcicpO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBsZXQgZGF0YSA9IGZyYW1lLmRhdGE7XG5cbiAgICBpZiAoZnJhbWVXaWR0aCA8IGZyYW1lU2l6ZSlcbiAgICAgIGRhdGEgPSBkb3duU2FtcGxlKGRhdGEsIGZyYW1lV2lkdGgpO1xuXG4gICAgY29uc3QgbGVuZ3RoID0gZGF0YS5sZW5ndGg7XG4gICAgY29uc3QgaG9wWCA9IGZyYW1lV2lkdGggLyBsZW5ndGg7XG4gICAgbGV0IHBvc1ggPSAwO1xuICAgIGxldCBsYXN0WSA9IHRoaXMubGFzdFBvc1k7XG5cbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHBvc1kgPSB0aGlzLmdldFlQb3NpdGlvbihkYXRhW2ldKTtcblxuICAgICAgaWYgKGxhc3RZID09PSBudWxsKSB7XG4gICAgICAgIGN0eC5tb3ZlVG8ocG9zWCwgcG9zWSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaSA9PT0gMClcbiAgICAgICAgICBjdHgubW92ZVRvKC1ob3BYLCBsYXN0WSk7XG5cbiAgICAgICAgY3R4LmxpbmVUbyhwb3NYLCBwb3NZKTtcbiAgICAgIH1cblxuICAgICAgcG9zWCArPSBob3BYO1xuICAgICAgbGFzdFkgPSBwb3NZO1xuICAgIH1cblxuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG5cbiAgICB0aGlzLmxhc3RQb3NZID0gbGFzdFk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2lnbmFsRGlzcGxheTtcbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5pbXBvcnQgeyBvcGNvZGVzLCBlbmNvZGVycywgZGVjb2RlcnMgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMvd3NVdGlscyc7XG5cbmNvbnN0IHBhcmFtZXRlcnMgPSB7XG4gIHBvcnQ6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogODAwMCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgdXJsOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfVxufVxuXG4vKipcbiAqIFNlbmQgYW4gbGZvIGZyYW1lIGFzIGEgc29ja2V0IG1lc3NhZ2UgdG8gYSBgbm9kZS5zb3VyY2UuU29ja2V0UmVjZWl2ZWBcbiAqIGluc3RhbmNlLlxuICpcbiAqIDxwIGNsYXNzPVwid2FybmluZ1wiPkV4cGVyaW1lbnRhbDwvcD5cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVR5cGU6ICd2ZWN0b3InLFxuICogICBmcmFtZVNpemU6IDIsXG4gKiAgIGZyYW1lUmF0ZTogMSxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IHNvY2tldFNlbmQgPSBuZXcgbGZvLnNpbmsuU29ja2V0U2VuZCh7XG4gKiAgIHBvcnQ6IDMwMDBcbiAqIH0pO1xuICpcbiAqIGV2ZW50SW4uY29ubmVjdChzb2NrZXRTZW5kKTtcbiAqXG4gKiBldmVudEluLmluaXQoKS50aGVuKCgpID0+IHtcbiAqICAgZXZlbnRJbi5zdGFydCgpO1xuICpcbiAqICAgbGV0IHRpbWUgPSAwO1xuICpcbiAqICAgKGZ1bmN0aW9uIGNyZWF0ZUZyYW1lKCkge1xuICogICAgIGV2ZW50SW4ucHJvY2Vzcyh0aW1lLCBbTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKV0sIHsgdGVzdDogdHJ1ZSB9KTtcbiAqICAgICB0aW1lICs9IDE7XG4gKlxuICogICAgIHNldFRpbWVvdXQoY3JlYXRlRnJhbWUsIDEwMDApO1xuICogICB9KCkpO1xuICogfSk7XG4gKi9cbmNsYXNzIFNvY2tldFNlbmQgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIocGFyYW1ldGVycywgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBwcm90b2NvbCA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbC5yZXBsYWNlKC9eaHR0cC8sICd3cycpO1xuICAgIGNvbnN0IGFkZHJlc3MgPSB0aGlzLnBhcmFtcy5nZXQoJ3VybCcpIHx8wqB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWU7XG4gICAgY29uc3QgcG9ydCA9IHRoaXMucGFyYW1zLmdldCgncG9ydCcpIHx8ICcnOyAvLyBldmVyeXRoaW5nIGZhbHN5IGJlY29tZXMgJydcbiAgICBjb25zdCBzb2NrZXRBZGRyZXNzID0gYCR7cHJvdG9jb2x9Ly8ke2FkZHJlc3N9OiR7cG9ydH1gO1xuXG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KHNvY2tldEFkZHJlc3MpO1xuICAgIHRoaXMuc29ja2V0LmJpbmFyeVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG4gICAgdGhpcy5vcGVuZWRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5zb2NrZXQub25vcGVuID0gcmVzb2x2ZTtcbiAgICB9KTtcblxuICAgIHRoaXMuc29ja2V0Lm9uZXJyb3IgPSAoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XG4gIH1cblxuICBpbml0TW9kdWxlKCkge1xuICAgIC8vIHNlbmQgYSBJTklUX01PRFVMRV9SRVEgYW5kIHdhaXQgZm9yIElOSVRfTU9EVUxFX0FDS1xuICAgIC8vIG5vIG5lZWQgdG8gZ2V0IGNoaWxkcmVuIHByb21pc2VzIGFzIHdlIGFyZSBpbiBhIGxlZWZcbiAgICByZXR1cm4gdGhpcy5vcGVuZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdGhpcy5zb2NrZXQub25tZXNzYWdlID0gKGUpID0+IHtcbiAgICAgICAgICBjb25zdCBvcGNvZGUgPSBkZWNvZGVycy5vcGNvZGUoZS5kYXRhKTtcblxuICAgICAgICAgIGlmIChvcGNvZGUgPT09IG9wY29kZXMuSU5JVF9NT0RVTEVfQUNLKVxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYnVmZmVyID0gZW5jb2RlcnMuaW5pdE1vZHVsZVJlcSgpO1xuICAgICAgICB0aGlzLnNvY2tldC5zZW5kKGJ1ZmZlcik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHN1cGVyLnByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICBjb25zdCBidWZmZXIgPSBlbmNvZGVycy5zdHJlYW1QYXJhbXModGhpcy5zdHJlYW1QYXJhbXMpO1xuICAgIHRoaXMuc29ja2V0LnNlbmQoYnVmZmVyKTtcbiAgfVxuXG4gIHJlc2V0U3RyZWFtKCkge1xuICAgIHN1cGVyLnJlc2V0U3RyZWFtKCk7XG5cbiAgICBjb25zdCBidWZmZXIgPSBlbmNvZGVycy5yZXNldFN0cmVhbSgpO1xuICAgIHRoaXMuc29ja2V0LnNlbmQoYnVmZmVyKTtcbiAgfVxuXG4gICAgLyoqIEBwcml2YXRlICovXG4gIGZpbmFsaXplU3RyZWFtKGVuZFRpbWUpIHtcbiAgICBzdXBlci5maW5hbGl6ZVN0cmVhbShlbmRUaW1lKTtcblxuICAgIGNvbnN0IGJ1ZmZlciA9IGVuY29kZXJzLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICAgIHRoaXMuc29ja2V0LnNlbmQoYnVmZmVyKTtcbiAgfVxuXG4gIC8vIHByb2Nlc3MgYW55IHR5cGVcbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTY2FsYXIoKSB7fVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcigpIHt9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKCkge31cblxuICBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgdGhpcy5mcmFtZS50aW1lID0gZnJhbWUudGltZTtcbiAgICB0aGlzLmZyYW1lLmRhdGEuc2V0KGZyYW1lLmRhdGEsIDApO1xuICAgIHRoaXMuZnJhbWUubWV0YWRhdGEgPSBmcmFtZS5tZXRhZGF0YTtcblxuICAgIGNvbnN0IGJ1ZmZlciA9IGVuY29kZXJzLnByb2Nlc3NGcmFtZSh0aGlzLmZyYW1lLCBmcmFtZVNpemUpO1xuICAgIHRoaXMuc29ja2V0LnNlbmQoYnVmZmVyKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTb2NrZXRTZW5kO1xuIiwiaW1wb3J0IEJhc2VEaXNwbGF5IGZyb20gJy4vQmFzZURpc3BsYXknO1xuaW1wb3J0IEZmdCBmcm9tICcuLi8uLi9jb21tb24vb3BlcmF0b3IvRmZ0JztcbmltcG9ydCB7IGdldENvbG9ycyB9IGZyb20gJy4uL3V0aWxzL2Rpc3BsYXktdXRpbHMnO1xuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBzY2FsZToge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogMSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgY29sb3I6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiBnZXRDb2xvcnMoJ3NwZWN0cnVtJyksXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG4gIG1pbjoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogLTgwLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICBtYXg6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDYsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH1cbn07XG5cblxuLyoqXG4gKiBEaXNwbGF5IHRoZSBzcGVjdHJ1bSBvZiB0aGUgaW5jb21taW5nIGBzaWduYWxgIGlucHV0LlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y2xpZW50LnNpbmtcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5zY2FsZT0xXSAtIFNjYWxlIGRpc3BsYXkgb2YgdGhlIHNwZWN0cm9ncmFtLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPW51bGxdIC0gQ29sb3Igb2YgdGhlIHNwZWN0cm9ncmFtLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1pbj0tODBdIC0gTWluaW11bSBkaXNwbGF5ZWQgdmFsdWUgKGluIGRCKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXg9Nl0gLSBNYXhpbXVtIGRpc3BsYXllZCB2YWx1ZSAoaW4gZEIpLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndpZHRoPTMwMF0gLSBXaWR0aCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oZWlnaHQ9MTUwXSAtIEhlaWdodCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY29udGFpbmVyPW51bGxdIC0gQ29udGFpbmVyIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBpbnNlcnQgdGhlIGNhbnZhcy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY2FudmFzPW51bGxdIC0gQ2FudmFzIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBkcmF3LiBfY29uc3RhbnQgcGFyYW1ldGVyX1xuICpcbiAqIEB0b2RvIC0gZXhwb3NlIG1vcmUgYGZmdGAgY29uZmlnIG9wdGlvbnNcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIGNvbnN0IGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAqXG4gKiBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXG4gKiAgIC5nZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSB9KVxuICogICAudGhlbihpbml0KVxuICogICAuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcbiAqXG4gKiBmdW5jdGlvbiBpbml0KHN0cmVhbSkge1xuICogICBjb25zdCBzb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlTWVkaWFTdHJlYW1Tb3VyY2Uoc3RyZWFtKTtcbiAqXG4gKiAgIGNvbnN0IGF1ZGlvSW5Ob2RlID0gbmV3IGxmby5zb3VyY2UuQXVkaW9Jbk5vZGUoe1xuICogICAgIGF1ZGlvQ29udGV4dDogYXVkaW9Db250ZXh0LFxuICogICAgIHNvdXJjZU5vZGU6IHNvdXJjZSxcbiAqICAgfSk7XG4gKlxuICogICBjb25zdCBzcGVjdHJ1bSA9IG5ldyBsZm8uc2luay5TcGVjdHJ1bURpc3BsYXkoe1xuICogICAgIGNhbnZhczogJyNzcGVjdHJ1bScsXG4gKiAgIH0pO1xuICpcbiAqICAgYXVkaW9Jbk5vZGUuY29ubmVjdChzcGVjdHJ1bSk7XG4gKiAgIGF1ZGlvSW5Ob2RlLnN0YXJ0KCk7XG4gKiB9XG4gKi9cbmNsYXNzIFNwZWN0cnVtRGlzcGxheSBleHRlbmRzIEJhc2VEaXNwbGF5IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLmZmdCA9IG5ldyBGZnQoe1xuICAgICAgc2l6ZTogdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplLFxuICAgICAgd2luZG93OiAnaGFubicsXG4gICAgICBub3JtOiAnbGluZWFyJyxcbiAgICB9KTtcblxuICAgIHRoaXMuZmZ0LmluaXRTdHJlYW0odGhpcy5zdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKGZyYW1lKSB7XG4gICAgY29uc3QgYmlucyA9IHRoaXMuZmZ0LmlucHV0U2lnbmFsKGZyYW1lLmRhdGEpO1xuICAgIGNvbnN0IG5ickJpbnMgPSBiaW5zLmxlbmd0aDtcblxuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcbiAgICBjb25zdCBzY2FsZSA9IHRoaXMucGFyYW1zLmdldCgnc2NhbGUnKTtcblxuICAgIGNvbnN0IGJpbldpZHRoID0gd2lkdGggLyBuYnJCaW5zO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuXG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMucGFyYW1zLmdldCgnY29sb3InKTtcblxuICAgIC8vIGVycm9yIGhhbmRsaW5nIG5lZWRzIHJldmlldy4uLlxuICAgIGxldCBlcnJvciA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ickJpbnM7IGkrKykge1xuICAgICAgY29uc3QgeDFGbG9hdCA9IGkgKiBiaW5XaWR0aCArIGVycm9yO1xuICAgICAgY29uc3QgeDFJbnQgPSBNYXRoLnJvdW5kKHgxRmxvYXQpO1xuICAgICAgY29uc3QgeDJGbG9hdCA9IHgxRmxvYXQgKyAoYmluV2lkdGggLSBlcnJvcik7XG4gICAgICBjb25zdCB4MkludCA9IE1hdGgucm91bmQoeDJGbG9hdCk7XG5cbiAgICAgIGVycm9yID0geDJJbnQgLSB4MkZsb2F0O1xuXG4gICAgICBpZiAoeDFJbnQgIT09IHgySW50KSB7XG4gICAgICAgIGNvbnN0IHdpZHRoID0geDJJbnQgLSB4MUludDtcbiAgICAgICAgY29uc3QgZGIgPSAyMCAqIE1hdGgubG9nMTAoYmluc1tpXSk7XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLmdldFlQb3NpdGlvbihkYiAqIHNjYWxlKTtcbiAgICAgICAgY3R4LmZpbGxSZWN0KHgxSW50LCB5LCB3aWR0aCwgaGVpZ2h0IC0geSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcnJvciAtPSBiaW5XaWR0aDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3BlY3RydW1EaXNwbGF5O1xuIiwiaW1wb3J0IEJhc2VEaXNwbGF5IGZyb20gJy4vQmFzZURpc3BsYXknO1xuaW1wb3J0IHsgZ2V0Q29sb3JzLCBnZXRIdWUsIGhleFRvUkdCIH0gZnJvbSAnLi4vdXRpbHMvZGlzcGxheS11dGlscyc7XG5cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGNvbG9yOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogZ2V0Q29sb3JzKCd0cmFjZScpLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICBjb2xvclNjaGVtZToge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBkZWZhdWx0OiAnbm9uZScsXG4gICAgbGlzdDogWydub25lJywgJ2h1ZScsICdvcGFjaXR5J10sXG4gIH0sXG59O1xuXG4vKipcbiAqIERpc3BsYXkgYSByYW5nZSB2YWx1ZSBhcm91bmQgYSBtZWFuIHZhbHVlIChmb3IgZXhhbXBsZSBtZWFuXG4gKiBhbmQgc3RhbmRhcnQgZGV2aWF0aW9uKS5cbiAqXG4gKiBUaGlzIHNpbmsgY2FuIGhhbmRsZSBpbnB1dCBvZiB0eXBlIGB2ZWN0b3JgIG9mIGZyYW1lU2l6ZSA+PSAyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdvcmFuZ2UnXSAtIENvbG9yLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yU2NoZW1lPSdub25lJ10gLSBJZiBhIHRoaXJkIHZhbHVlIGlzIGF2YWlsYWJsZVxuICogIGluIHRoZSBpbnB1dCwgY2FuIGJlIHVzZWQgdG8gY29udHJvbCB0aGUgb3BhY2l0eSBvciB0aGUgaHVlLiBJZiBpbnB1dCBmcmFtZVxuICogIHNpemUgaXMgMiwgdGhpcyBwYXJhbSBpcyBhdXRvbWF0aWNhbGx5IHNldCB0byBgbm9uZWBcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5taW49LTFdIC0gTWluaW11bSB2YWx1ZSByZXByZXNlbnRlZCBpbiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXg9MV0gLSBNYXhpbXVtIHZhbHVlIHJlcHJlc2VudGVkIGluIHRoZSBjYW52YXMuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndpZHRoPTMwMF0gLSBXaWR0aCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oZWlnaHQ9MTUwXSAtIEhlaWdodCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY29udGFpbmVyPW51bGxdIC0gQ29udGFpbmVyIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBpbnNlcnQgdGhlIGNhbnZhcy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY2FudmFzPW51bGxdIC0gQ2FudmFzIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBkcmF3LiBfY29uc3RhbnQgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmR1cmF0aW9uPTFdIC0gRHVyYXRpb24gKGluIHNlY29uZHMpIHJlcHJlc2VudGVkIGluXG4gKiAgdGhlIGNhbnZhcy4gX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnJlZmVyZW5jZVRpbWU9bnVsbF0gLSBPcHRpb25uYWwgcmVmZXJlbmNlIHRpbWUgdGhlXG4gKiAgZGlzcGxheSBzaG91bGQgY29uc2lkZXJlciBhcyB0aGUgb3JpZ2luLiBJcyBvbmx5IHVzZWZ1bGwgd2hlbiBzeW5jaHJvbml6aW5nXG4gKiAgc2V2ZXJhbCBkaXNwbGF5IHVzaW5nIHRoZSBgRGlzcGxheVN5bmNgIGNsYXNzLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y2xpZW50LnNpbmtcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIGNvbnN0IEF1ZGlvQ29udGV4dCA9ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8wqB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0KTtcbiAqIGNvbnN0IGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAqXG4gKiBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXG4gKiAgIC5nZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSB9KVxuICogICAudGhlbihpbml0KVxuICogICAuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcbiAqXG4gKiBmdW5jdGlvbiBpbml0KHN0cmVhbSkge1xuICogICBjb25zdCBzb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlTWVkaWFTdHJlYW1Tb3VyY2Uoc3RyZWFtKTtcbiAqXG4gKiAgIGNvbnN0IGF1ZGlvSW5Ob2RlID0gbmV3IGxmby5zb3VyY2UuQXVkaW9Jbk5vZGUoe1xuICogICAgIHNvdXJjZU5vZGU6IHNvdXJjZSxcbiAqICAgICBhdWRpb0NvbnRleHQ6IGF1ZGlvQ29udGV4dCxcbiAqICAgfSk7XG4gKlxuICogICAvLyBub3Qgc3VyZSBpdCBtYWtlIHNlbnMgYnV0Li4uXG4gKiAgIGNvbnN0IG1lYW5TdGRkZXYgPSBuZXcgbGZvLm9wZXJhdG9yLk1lYW5TdGRkZXYoKTtcbiAqXG4gKiAgIGNvbnN0IHRyYWNlRGlzcGxheSA9IG5ldyBsZm8uc2luay5UcmFjZURpc3BsYXkoe1xuICogICAgIGNhbnZhczogJyN0cmFjZScsXG4gKiAgIH0pO1xuICpcbiAqICAgY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IGRhdGE6IHRydWUgfSk7XG4gKlxuICogICBhdWRpb0luTm9kZS5jb25uZWN0KG1lYW5TdGRkZXYpO1xuICogICBtZWFuU3RkZGV2LmNvbm5lY3QodHJhY2VEaXNwbGF5KTtcbiAqXG4gKiAgIGF1ZGlvSW5Ob2RlLnN0YXJ0KCk7XG4gKiB9XG4gKi9cbmNsYXNzIFRyYWNlRGlzcGxheSBleHRlbmRzIEJhc2VEaXNwbGF5IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5wcmV2RnJhbWUgPSBudWxsO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIGlmICh0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPT09IDIpXG4gICAgICB0aGlzLnBhcmFtcy5zZXQoJ2NvbG9yU2NoZW1lJywgJ25vbmUnKTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcihmcmFtZSwgZnJhbWVXaWR0aCwgcGl4ZWxzU2luY2VMYXN0RnJhbWUpIHtcbiAgICBjb25zdCBjb2xvclNjaGVtZSA9IHRoaXMucGFyYW1zLmdldCgnY29sb3JTY2hlbWUnKTtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCBwcmV2RGF0YSA9IHRoaXMucHJldkZyYW1lID8gdGhpcy5wcmV2RnJhbWUuZGF0YSA6IG51bGw7XG4gICAgY29uc3QgZGF0YSA9IGZyYW1lLmRhdGE7XG5cbiAgICBjb25zdCBoYWxmUmFuZ2UgPSBkYXRhWzFdIC8gMjtcbiAgICBjb25zdCBtZWFuID0gdGhpcy5nZXRZUG9zaXRpb24oZGF0YVswXSk7XG4gICAgY29uc3QgbWluID0gdGhpcy5nZXRZUG9zaXRpb24oZGF0YVswXSAtIGhhbGZSYW5nZSk7XG4gICAgY29uc3QgbWF4ID0gdGhpcy5nZXRZUG9zaXRpb24oZGF0YVswXSArIGhhbGZSYW5nZSk7XG5cbiAgICBsZXQgcHJldkhhbGZSYW5nZTtcbiAgICBsZXQgcHJldk1lYW47XG4gICAgbGV0IHByZXZNaW47XG4gICAgbGV0IHByZXZNYXg7XG5cbiAgICBpZiAocHJldkRhdGEgIT09IG51bGwpIHtcbiAgICAgIHByZXZIYWxmUmFuZ2UgPSBwcmV2RGF0YVsxXSAvIDI7XG4gICAgICBwcmV2TWVhbiA9IHRoaXMuZ2V0WVBvc2l0aW9uKHByZXZEYXRhWzBdKTtcbiAgICAgIHByZXZNaW4gPSB0aGlzLmdldFlQb3NpdGlvbihwcmV2RGF0YVswXSAtIHByZXZIYWxmUmFuZ2UpO1xuICAgICAgcHJldk1heCA9IHRoaXMuZ2V0WVBvc2l0aW9uKHByZXZEYXRhWzBdICsgcHJldkhhbGZSYW5nZSk7XG4gICAgfVxuXG4gICAgY29uc3QgY29sb3IgPSB0aGlzLnBhcmFtcy5nZXQoJ2NvbG9yJyk7XG4gICAgbGV0IGdyYWRpZW50O1xuICAgIGxldCByZ2I7XG5cbiAgICBzd2l0Y2ggKGNvbG9yU2NoZW1lKSB7XG4gICAgICBjYXNlICdub25lJzpcbiAgICAgICAgcmdiID0gaGV4VG9SR0IoY29sb3IpO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gYHJnYmEoJHtyZ2Iuam9pbignLCcpfSwgMC43KWA7XG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdodWUnOlxuICAgICAgICBncmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgtcGl4ZWxzU2luY2VMYXN0RnJhbWUsIDAsIDAsIDApO1xuXG4gICAgICAgIGlmIChwcmV2RGF0YSlcbiAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgYGhzbCgke2dldEh1ZShwcmV2RGF0YVsyXSl9LCAxMDAlLCA1MCUpYCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgYGhzbCgke2dldEh1ZShkYXRhWzJdKX0sIDEwMCUsIDUwJSlgKTtcblxuICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgYGhzbCgke2dldEh1ZShkYXRhWzJdKX0sIDEwMCUsIDUwJSlgKTtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvcGFjaXR5JzpcbiAgICAgICAgcmdiID0gaGV4VG9SR0IodGhpcy5wYXJhbXMuZ2V0KCdjb2xvcicpKTtcbiAgICAgICAgZ3JhZGllbnQgPSBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQoLXBpeGVsc1NpbmNlTGFzdEZyYW1lLCAwLCAwLCAwKTtcblxuICAgICAgICBpZiAocHJldkRhdGEpXG4gICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIGByZ2JhKCR7cmdiLmpvaW4oJywnKX0sICR7cHJldkRhdGFbMl19KWApO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIGByZ2JhKCR7cmdiLmpvaW4oJywnKX0sICR7ZGF0YVsyXX0pYCk7XG5cbiAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsIGByZ2JhKCR7cmdiLmpvaW4oJywnKX0sICR7ZGF0YVsyXX0pYCk7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGN0eC5zYXZlKCk7XG4gICAgLy8gZHJhdyByYW5nZVxuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubW92ZVRvKDAsIG1lYW4pO1xuICAgIGN0eC5saW5lVG8oMCwgbWF4KTtcblxuICAgIGlmIChwcmV2RGF0YSAhPT0gbnVsbCkge1xuICAgICAgY3R4LmxpbmVUbygtcGl4ZWxzU2luY2VMYXN0RnJhbWUsIHByZXZNYXgpO1xuICAgICAgY3R4LmxpbmVUbygtcGl4ZWxzU2luY2VMYXN0RnJhbWUsIHByZXZNaW4pO1xuICAgIH1cblxuICAgIGN0eC5saW5lVG8oMCwgbWluKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG5cbiAgICBjdHguZmlsbCgpO1xuXG4gICAgLy8gZHJhdyBtZWFuXG4gICAgaWYgKGNvbG9yU2NoZW1lID09PSAnbm9uZScgJiYgcHJldk1lYW4pIHtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5tb3ZlVG8oLXBpeGVsc1NpbmNlTGFzdEZyYW1lLCBwcmV2TWVhbik7XG4gICAgICBjdHgubGluZVRvKDAsIG1lYW4pO1xuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuXG4gICAgY3R4LnJlc3RvcmUoKTtcblxuICAgIHRoaXMucHJldkZyYW1lID0gZnJhbWU7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFRyYWNlRGlzcGxheTtcbiIsImltcG9ydCBCYXNlRGlzcGxheSBmcm9tICcuL0Jhc2VEaXNwbGF5JztcbmltcG9ydCBSbXMgZnJvbSAnLi4vLi4vY29tbW9uL29wZXJhdG9yL1Jtcyc7XG5cbmNvbnN0IGxvZzEwID0gTWF0aC5sb2cxMDtcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIG9mZnNldDoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogLTE0LFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICBtaW46IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IC04MCxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgbWF4OiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiA2LFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICB3aWR0aDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiA2LFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9XG59XG5cbi8qKlxuICogU2ltcGxlIFZVLU1ldGVyIHRvIHVzZWQgb24gYSBgc2lnbmFsYCBzdHJlYW0uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjbGllbnQuc2lua1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdHMgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5vZmZzZXQ9LTE0XSAtIGRCIG9mZnNldCBhcHBsaWVkIHRvIHRoZSBzaWduYWwuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWluPS04MF0gLSBNaW5pbXVtIGRpc3BsYXllZCB2YWx1ZSAoaW4gZEIpLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1heD02XSAtIE1heGltdW0gZGlzcGxheWVkIHZhbHVlIChpbiBkQikuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMud2lkdGg9Nl0gLSBXaWR0aCBvZiB0aGUgZGlzcGxheSAoaW4gcGl4ZWxzKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oZWlnaHQ9MTUwXSAtIEhlaWdodCBvZiB0aGUgY2FudmFzLlxuICogQHBhcmFtIHtFbGVtZW50fENTU1NlbGVjdG9yfSBbb3B0aW9ucy5jb250YWluZXI9bnVsbF0gLSBDb250YWluZXIgZWxlbWVudFxuICogIGluIHdoaWNoIHRvIGluc2VydCB0aGUgY2FudmFzLlxuICogQHBhcmFtIHtFbGVtZW50fENTU1NlbGVjdG9yfSBbb3B0aW9ucy5jYW52YXM9bnVsbF0gLSBDYW52YXMgZWxlbWVudFxuICogIGluIHdoaWNoIHRvIGRyYXcuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiBjb25zdCBhdWRpb0NvbnRleHQgPSBuZXcgd2luZG93LkF1ZGlvQ29udGV4dCgpO1xuICpcbiAqIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAqICAgLmdldFVzZXJNZWRpYSh7IGF1ZGlvOiB0cnVlIH0pXG4gKiAgIC50aGVuKGluaXQpXG4gKiAgIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVyci5zdGFjaykpO1xuICpcbiAqIGZ1bmN0aW9uIGluaXQoc3RyZWFtKSB7XG4gKiAgIGNvbnN0IHNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVNZWRpYVN0cmVhbVNvdXJjZShzdHJlYW0pO1xuICpcbiAqICAgY29uc3QgYXVkaW9Jbk5vZGUgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luTm9kZSh7XG4gKiAgICAgYXVkaW9Db250ZXh0OiBhdWRpb0NvbnRleHQsXG4gKiAgICAgc291cmNlTm9kZTogc291cmNlLFxuICogICB9KTtcbiAqXG4gKiAgIGNvbnN0IHZ1TWV0ZXIgPSBuZXcgbGZvLnNpbmsuVnVNZXRlckRpc3BsYXkoe1xuICogICAgIGNhbnZhczogJyN2dS1tZXRlcicsXG4gKiAgIH0pO1xuICpcbiAqICAgYXVkaW9Jbk5vZGUuY29ubmVjdCh2dU1ldGVyKTtcbiAqICAgYXVkaW9Jbk5vZGUuc3RhcnQoKTtcbiAqIH1cbiAqL1xuY2xhc3MgVnVNZXRlckRpc3BsYXkgZXh0ZW5kcyBCYXNlRGlzcGxheSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zLCBmYWxzZSk7XG5cbiAgICB0aGlzLnJtc09wZXJhdG9yID0gbmV3IFJtcygpO1xuXG4gICAgdGhpcy5sYXN0REIgPSAwO1xuICAgIHRoaXMucGVhayA9IHtcbiAgICAgIHZhbHVlOiAwLFxuICAgICAgdGltZTogMCxcbiAgICB9XG5cbiAgICB0aGlzLnBlYWtMaWZldGltZSA9IDE7IC8vIHNlY1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMucm1zT3BlcmF0b3IuaW5pdFN0cmVhbSh0aGlzLnN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTaWduYWwoZnJhbWUpIHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDA7IC8vIHNlY1xuICAgIGNvbnN0IG9mZnNldCA9IHRoaXMucGFyYW1zLmdldCgnb2Zmc2V0Jyk7IC8vIG9mZnNldCB6ZXJvIG9mIHRoZSB2dSBtZXRlclxuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcblxuICAgIGNvbnN0IGxhc3REQiA9IHRoaXMubGFzdERCO1xuICAgIGNvbnN0IHBlYWsgPSB0aGlzLnBlYWs7XG5cbiAgICBjb25zdCByZWQgPSAnI2ZmMjEyMSc7XG4gICAgY29uc3QgeWVsbG93ID0gJyNmZmZmMWYnO1xuICAgIGNvbnN0IGdyZWVuID0gJyMwMGZmMDAnO1xuXG4gICAgLy8gaGFuZGxlIGN1cnJlbnQgZGIgdmFsdWVcbiAgICBjb25zdCBybXMgPSB0aGlzLnJtc09wZXJhdG9yLmlucHV0U2lnbmFsKGZyYW1lLmRhdGEpO1xuICAgIGxldCBkQiA9IDIwICogbG9nMTAocm1zKSAtIG9mZnNldDtcblxuICAgIC8vIHNsb3cgcmVsZWFzZSAoY291bGQgcHJvYmFibHkgYmUgaW1wcm92ZWQpXG4gICAgaWYgKGxhc3REQiA+IGRCKVxuICAgICAgZEIgPSBsYXN0REIgLSA2O1xuXG4gICAgLy8gaGFuZGxlIHBlYWtcbiAgICBpZiAoZEIgPiBwZWFrLnZhbHVlIHx8wqAobm93IC0gcGVhay50aW1lKSA+IHRoaXMucGVha0xpZmV0aW1lKSB7XG4gICAgICBwZWFrLnZhbHVlID0gZEI7XG4gICAgICBwZWFrLnRpbWUgPSBub3c7XG4gICAgfVxuXG4gICAgY29uc3QgeTAgPSB0aGlzLmdldFlQb3NpdGlvbigwKTtcbiAgICBjb25zdCB5ID0gdGhpcy5nZXRZUG9zaXRpb24oZEIpO1xuICAgIGNvbnN0IHlQZWFrID0gdGhpcy5nZXRZUG9zaXRpb24ocGVhay52YWx1ZSk7XG5cbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY3R4LmZpbGxTdHlsZSA9ICcjMDAwMDAwJztcbiAgICBjdHguZmlsbFJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICBjb25zdCBncmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCBoZWlnaHQsIDAsIDApO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCBncmVlbik7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKChoZWlnaHQgLSB5MCkgLyBoZWlnaHQsIHllbGxvdyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsIHJlZCk7XG5cbiAgICAvLyBkQlxuICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICBjdHguZmlsbFJlY3QoMCwgeSwgd2lkdGgsIGhlaWdodCAtIHkpO1xuXG4gICAgLy8gMCBkQiBtYXJrZXJcbiAgICBjdHguZmlsbFN0eWxlID0gJyNkY2RjZGMnO1xuICAgIGN0eC5maWxsUmVjdCgwLCB5MCwgd2lkdGgsIDIpO1xuXG4gICAgLy8gcGVha1xuICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICBjdHguZmlsbFJlY3QoMCwgeVBlYWssIHdpZHRoLCAyKTtcblxuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICB0aGlzLmxhc3REQiA9IGRCO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFZ1TWV0ZXJEaXNwbGF5O1xuIiwiaW1wb3J0IEJhc2VEaXNwbGF5IGZyb20gJy4vQmFzZURpc3BsYXknO1xuaW1wb3J0IE1pbk1heCBmcm9tICcuLi8uLi9jb21tb24vb3BlcmF0b3IvTWluTWF4JztcbmltcG9ydCBSbXMgZnJvbSAnLi4vLi4vY29tbW9uL29wZXJhdG9yL1Jtcyc7XG5pbXBvcnQgeyBnZXRDb2xvcnMgfSBmcm9tICcuLi91dGlscy9kaXNwbGF5LXV0aWxzJztcblxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgY29sb3JzOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogZ2V0Q29sb3JzKCd3YXZlZm9ybScpLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICBybXM6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5YW5taWMnIH0sXG4gIH1cbn07XG5cbi8qKlxuICogRGlzcGxheSBhIHdhdmVmb3JtIChhbG9uZyB3aXRoIG9wdGlvbm5hbCBSbXMpIG9mIGEgZ2l2ZW4gYHNpZ25hbGAgaW5wdXQgaW5cbiAqIGEgY2FudmFzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBbb3B0aW9ucy5jb2xvcnM9Wyd3YXZlZm9ybScsICdybXMnXV0gLSBBcnJheVxuICogIGNvbnRhaW5pbmcgdGhlIGNvbG9yIGNvZGVzIGZvciB0aGUgd2F2ZWZvcm0gKGluZGV4IDApIGFuZCBybXMgKGluZGV4IDEpLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucm1zPWZhbHNlXSAtIFNldCB0byBgdHJ1ZWAgdG8gZGlzcGxheSB0aGUgcm1zLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5kdXJhdGlvbj0xXSAtIER1cmF0aW9uIChpbiBzZWNvbmRzKSByZXByZXNlbnRlZCBpblxuICogIHRoZSBjYW52YXMuIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5taW49LTFdIC0gTWluaW11bSB2YWx1ZSByZXByZXNlbnRlZCBpbiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXg9MV0gLSBNYXhpbXVtIHZhbHVlIHJlcHJlc2VudGVkIGluIHRoZSBjYW52YXMuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndpZHRoPTMwMF0gLSBXaWR0aCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oZWlnaHQ9MTUwXSAtIEhlaWdodCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY29udGFpbmVyPW51bGxdIC0gQ29udGFpbmVyIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBpbnNlcnQgdGhlIGNhbnZhcy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY2FudmFzPW51bGxdIC0gQ2FudmFzIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBkcmF3LiBfY29uc3RhbnQgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnJlZmVyZW5jZVRpbWU9bnVsbF0gLSBPcHRpb25uYWwgcmVmZXJlbmNlIHRpbWUgdGhlXG4gKiAgZGlzcGxheSBzaG91bGQgY29uc2lkZXJlciBhcyB0aGUgb3JpZ2luLiBJcyBvbmx5IHVzZWZ1bGwgd2hlbiBzeW5jaHJvbml6aW5nXG4gKiAgc2V2ZXJhbCBkaXNwbGF5IHVzaW5nIHRoZSBgRGlzcGxheVN5bmNgIGNsYXNzLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y2xpZW50LnNpbmtcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIGNvbnN0IGF1ZGlvQ29udGV4dCA9IG5ldyB3aW5kb3cuQXVkaW9Db250ZXh0KCk7XG4gKlxuICogbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICogICAuZ2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSlcbiAqICAgLnRoZW4oaW5pdClcbiAqICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKSk7XG4gKlxuICogZnVuY3Rpb24gaW5pdChzdHJlYW0pIHtcbiAqICAgY29uc3QgYXVkaW9JbiA9IGF1ZGlvQ29udGV4dC5jcmVhdGVNZWRpYVN0cmVhbVNvdXJjZShzdHJlYW0pO1xuICpcbiAqICAgY29uc3QgYXVkaW9Jbk5vZGUgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luTm9kZSh7XG4gKiAgICAgYXVkaW9Db250ZXh0OiBhdWRpb0NvbnRleHQsXG4gKiAgICAgc291cmNlTm9kZTogYXVkaW9JbixcbiAqICAgICBmcmFtZVNpemU6IDUxMixcbiAqICAgfSk7XG4gKlxuICogICBjb25zdCB3YXZlZm9ybURpc3BsYXkgPSBuZXcgbGZvLnNpbmsuV2F2ZWZvcm1EaXNwbGF5KHtcbiAqICAgICBjYW52YXM6ICcjd2F2ZWZvcm0nLFxuICogICAgIGR1cmF0aW9uOiAzLjUsXG4gKiAgICAgcm1zOiB0cnVlLFxuICogICB9KTtcbiAqXG4gKiAgIGF1ZGlvSW5Ob2RlLmNvbm5lY3Qod2F2ZWZvcm1EaXNwbGF5KTtcbiAqICAgYXVkaW9Jbk5vZGUuc3RhcnQoKTtcbiAqIH0pO1xuICovXG5jbGFzcyBXYXZlZm9ybURpc3BsYXkgZXh0ZW5kcyBCYXNlRGlzcGxheSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucywgdHJ1ZSk7XG5cbiAgICB0aGlzLm1pbk1heE9wZXJhdG9yID0gbmV3IE1pbk1heCgpO1xuICAgIHRoaXMucm1zT3BlcmF0b3IgPSBuZXcgUm1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5taW5NYXhPcGVyYXRvci5pbml0U3RyZWFtKHRoaXMuc3RyZWFtUGFyYW1zKTtcbiAgICB0aGlzLnJtc09wZXJhdG9yLmluaXRTdHJlYW0odGhpcy5zdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKGZyYW1lLCBmcmFtZVdpZHRoLCBwaXhlbHNTaW5jZUxhc3RGcmFtZSkge1xuICAgIC8vIGRyb3AgZnJhbWVzIHRoYXQgY2Fubm90IGJlIGRpc3BsYXllZFxuICAgIGlmIChmcmFtZVdpZHRoIDwgMSkgcmV0dXJuO1xuXG4gICAgY29uc3QgY29sb3JzID0gdGhpcy5wYXJhbXMuZ2V0KCdjb2xvcnMnKTtcbiAgICBjb25zdCBzaG93Um1zID0gdGhpcy5wYXJhbXMuZ2V0KCdybXMnKTtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCBkYXRhID0gZnJhbWUuZGF0YTtcbiAgICBjb25zdCBpU2FtcGxlc1BlclBpeGVscyA9IE1hdGguZmxvb3IoZGF0YS5sZW5ndGggLyBmcmFtZVdpZHRoKTtcblxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBmcmFtZVdpZHRoOyBpbmRleCsrKSB7XG4gICAgICBjb25zdCBzdGFydCA9IGluZGV4ICogaVNhbXBsZXNQZXJQaXhlbHM7XG4gICAgICBjb25zdCBlbmQgPSBpbmRleCA9PT0gZnJhbWVXaWR0aCAtIDEgPyB1bmRlZmluZWQgOiBzdGFydCArIGlTYW1wbGVzUGVyUGl4ZWxzO1xuICAgICAgY29uc3Qgc2xpY2UgPSBkYXRhLnN1YmFycmF5KHN0YXJ0LCBlbmQpO1xuXG4gICAgICBjb25zdCBtaW5NYXggPSB0aGlzLm1pbk1heE9wZXJhdG9yLmlucHV0U2lnbmFsKHNsaWNlKTtcbiAgICAgIGNvbnN0IG1pblkgPSB0aGlzLmdldFlQb3NpdGlvbihtaW5NYXhbMF0pO1xuICAgICAgY29uc3QgbWF4WSA9IHRoaXMuZ2V0WVBvc2l0aW9uKG1pbk1heFsxXSk7XG5cbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yc1swXTtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5tb3ZlVG8oaW5kZXgsIG1pblkpO1xuICAgICAgY3R4LmxpbmVUbyhpbmRleCwgbWF4WSk7XG4gICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG5cbiAgICAgIGlmIChzaG93Um1zKSB7XG4gICAgICAgIGNvbnN0IHJtcyA9IHRoaXMucm1zT3BlcmF0b3IuaW5wdXRTaWduYWwoc2xpY2UpO1xuICAgICAgICBjb25zdCBybXNNYXhZID0gdGhpcy5nZXRZUG9zaXRpb24ocm1zKTtcbiAgICAgICAgY29uc3Qgcm1zTWluWSA9IHRoaXMuZ2V0WVBvc2l0aW9uKC1ybXMpO1xuXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yc1sxXTtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKGluZGV4LCBybXNNaW5ZKTtcbiAgICAgICAgY3R4LmxpbmVUbyhpbmRleCwgcm1zTWF4WSk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBXYXZlZm9ybURpc3BsYXk7XG4iLCIvLyBjb21tb25cbmltcG9ydCBCcmlkZ2UgZnJvbSAnLi4vLi4vY29tbW9uL3NpbmsvQnJpZGdlJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi4vLi4vY29tbW9uL3NpbmsvTG9nZ2VyJztcbmltcG9ydCBEYXRhUmVjb3JkZXIgZnJvbSAnLi4vLi4vY29tbW9uL3NpbmsvRGF0YVJlY29yZGVyJztcbmltcG9ydCBTaWduYWxSZWNvcmRlciBmcm9tICcuLi8uLi9jb21tb24vc2luay9TaWduYWxSZWNvcmRlcic7XG5cbi8vIGNsaWVudCBvbmx5XG5pbXBvcnQgQmFzZURpc3BsYXkgZnJvbSAnLi9CYXNlRGlzcGxheSc7XG5pbXBvcnQgQnBmRGlzcGxheSBmcm9tICcuL0JwZkRpc3BsYXknO1xuaW1wb3J0IE1hcmtlckRpc3BsYXkgZnJvbSAnLi9NYXJrZXJEaXNwbGF5JztcbmltcG9ydCBTaWduYWxEaXNwbGF5IGZyb20gJy4vU2lnbmFsRGlzcGxheSc7XG5pbXBvcnQgU29ja2V0U2VuZCBmcm9tICcuL1NvY2tldFNlbmQnO1xuaW1wb3J0IFNwZWN0cnVtRGlzcGxheSBmcm9tICcuL1NwZWN0cnVtRGlzcGxheSc7XG5pbXBvcnQgVHJhY2VEaXNwbGF5IGZyb20gJy4vVHJhY2VEaXNwbGF5JztcbmltcG9ydCBWdU1ldGVyRGlzcGxheSBmcm9tICcuL1Z1TWV0ZXJEaXNwbGF5JztcbmltcG9ydCBXYXZlZm9ybURpc3BsYXkgZnJvbSAnLi9XYXZlZm9ybURpc3BsYXknO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIEJyaWRnZSxcbiAgTG9nZ2VyLFxuICBEYXRhUmVjb3JkZXIsXG4gIFNpZ25hbFJlY29yZGVyLFxuXG4gIEJhc2VEaXNwbGF5LFxuICBCcGZEaXNwbGF5LFxuICBNYXJrZXJEaXNwbGF5LFxuICBTaWduYWxEaXNwbGF5LFxuICBTb2NrZXRTZW5kLFxuICBTcGVjdHJ1bURpc3BsYXksXG4gIFRyYWNlRGlzcGxheSxcbiAgVnVNZXRlckRpc3BsYXksXG4gIFdhdmVmb3JtRGlzcGxheSxcbn07XG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuaW1wb3J0IFNvdXJjZU1peGluIGZyb20gJy4uLy4uL2NvcmUvU291cmNlTWl4aW4nO1xuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBhdWRpb0J1ZmZlcjoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGZyYW1lU2l6ZToge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiA1MTIsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGNoYW5uZWw6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgcHJvZ3Jlc3NDYWxsYmFjazoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIHByb2dyZXNzQ2FsbGJhY2s6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBhc3luYzoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgfSxcbn07XG5cbmNvbnN0IG5vb3AgPSBmdW5jdGlvbigpIHt9O1xuXG4vKipcbiAqIFNsaWNlIGFuIGBBdWRpb0J1ZmZlcmAgaW50byBzaWduYWwgYmxvY2tzIGFuZCBwcm9wYWdhdGUgdGhlIHJlc3VsdGluZyBmcmFtZXNcbiAqIHRocm91Z2ggdGhlIGdyYXBoLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgcGFyYW1ldGVyJyBkZWZhdWx0IHZhbHVlcy5cbiAqIEBwYXJhbSB7QXVkaW9CdWZmZXJ9IFtvcHRpb25zLmF1ZGlvQnVmZmVyXSAtIEF1ZGlvIGJ1ZmZlciB0byBwcm9jZXNzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmZyYW1lU2l6ZT01MTJdIC0gU2l6ZSBvZiB0aGUgb3V0cHV0IGJsb2Nrcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5jaGFubmVsPTBdIC0gTnVtYmVyIG9mIHRoZSBjaGFubmVsIHRvIHByb2Nlc3MuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucHJvZ3Jlc3NDYWxsYmFjaz1udWxsXSAtIENhbGxiYWNrIHRvIGJlIGV4Y3V0ZWQgb24gZWFjaFxuICogIGZyYW1lIG91dHB1dCwgcmVjZWl2ZSBhcyBhcmd1bWVudCB0aGUgY3VycmVudCBwcm9ncmVzcyByYXRpby5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNsaWVudC5zb3VyY2VcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIGNvbnN0IGF1ZGlvSW5CdWZmZXIgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luQnVmZmVyKHtcbiAqICAgYXVkaW9CdWZmZXI6IGF1ZGlvQnVmZmVyLFxuICogICBmcmFtZVNpemU6IDUxMixcbiAqIH0pO1xuICpcbiAqIGNvbnN0IHdhdmVmb3JtID0gbmV3IGxmby5zaW5rLldhdmVmb3JtKHtcbiAqICAgY2FudmFzOiAnI3dhdmVmb3JtJyxcbiAqICAgZHVyYXRpb246IDEsXG4gKiAgIGNvbG9yOiAnc3RlZWxibHVlJyxcbiAqICAgcm1zOiB0cnVlLFxuICogfSk7XG4gKlxuICogYXVkaW9JbkJ1ZmZlci5jb25uZWN0KHdhdmVmb3JtKTtcbiAqIGF1ZGlvSW5CdWZmZXIuc3RhcnQoKTtcbiAqL1xuY2xhc3MgQXVkaW9JbkJ1ZmZlciBleHRlbmRzIFNvdXJjZU1peGluKEJhc2VMZm8pIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgYXVkaW9CdWZmZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ2F1ZGlvQnVmZmVyJyk7XG5cbiAgICBpZiAoIWF1ZGlvQnVmZmVyKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFwiYXVkaW9CdWZmZXJcIiBwYXJhbWV0ZXInKTtcblxuICAgIHRoaXMuZW5kVGltZSA9IDA7XG4gIH1cblxuICAvKipcbiAgICogUHJvcGFnYXRlIHRoZSBgc3RyZWFtUGFyYW1zYCBpbiB0aGUgZ3JhcGggYW5kIHN0YXJ0IHByb3BhZ2F0aW5nIGZyYW1lcy5cbiAgICogV2hlbiBjYWxsZWQsIHRoZSBzbGljaW5nIG9mIHRoZSBnaXZlbiBgYXVkaW9CdWZmZXJgIHN0YXJ0cyBpbW1lZGlhdGVseSBhbmRcbiAgICogZWFjaCByZXN1bHRpbmcgZnJhbWUgaXMgcHJvcGFnYXRlZCBpbiBncmFwaC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcmVzZXRTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjbGllbnQuc291cmNlLkF1ZGlvSW5CdWZmZXIjc3RvcH1cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkID09PSBmYWxzZSkge1xuICAgICAgaWYgKHRoaXMuaW5pdFByb21pc2UgPT09IG51bGwpIC8vIGluaXQgaGFzIG5vdCB5ZXQgYmVlbiBjYWxsZWRcbiAgICAgICAgdGhpcy5pbml0UHJvbWlzZSA9IHRoaXMuaW5pdCgpO1xuXG4gICAgICB0aGlzLmluaXRQcm9taXNlLnRoZW4odGhpcy5zdGFydCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY2hhbm5lbCA9IHRoaXMucGFyYW1zLmdldCgnY2hhbm5lbCcpO1xuICAgIGNvbnN0IGF1ZGlvQnVmZmVyID0gdGhpcy5wYXJhbXMuZ2V0KCdhdWRpb0J1ZmZlcicpO1xuICAgIGNvbnN0IGJ1ZmZlciA9IGF1ZGlvQnVmZmVyLmdldENoYW5uZWxEYXRhKGNoYW5uZWwpO1xuICAgIHRoaXMuZW5kVGltZSA9IDA7XG4gICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcblxuICAgIHRoaXMucHJvY2Vzc0ZyYW1lKGJ1ZmZlcik7XG4gIH1cblxuICAvKipcbiAgICogRmluYWxpemUgdGhlIHN0cmVhbSBhbmQgc3RvcCB0aGUgd2hvbGUgZ3JhcGguIFdoZW4gY2FsbGVkLCB0aGUgc2xpY2luZyBvZlxuICAgKiB0aGUgYGF1ZGlvQnVmZmVyYCBzdG9wcyBpbW1lZGlhdGVseS5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jZmluYWxpemVTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjbGllbnQuc291cmNlLkF1ZGlvSW5CdWZmZXIjc3RhcnR9XG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuZmluYWxpemVTdHJlYW0odGhpcy5lbmRUaW1lKTtcbiAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKCkge1xuICAgIGNvbnN0IGF1ZGlvQnVmZmVyID0gdGhpcy5wYXJhbXMuZ2V0KCdhdWRpb0J1ZmZlcicpO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnZnJhbWVTaXplJyk7XG4gICAgY29uc3Qgc291cmNlU2FtcGxlUmF0ZSA9IGF1ZGlvQnVmZmVyLnNhbXBsZVJhdGU7XG4gICAgY29uc3QgZnJhbWVSYXRlID0gc291cmNlU2FtcGxlUmF0ZSAvIGZyYW1lU2l6ZTtcblxuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IGZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSBmcmFtZVJhdGU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3NpZ25hbCc7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSA9IHNvdXJjZVNhbXBsZVJhdGU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlQ291bnQgPSBmcmFtZVNpemU7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShidWZmZXIpIHtcbiAgICBjb25zdCBhc3luYyA9IHRoaXMucGFyYW1zLmdldCgnYXN5bmMnKTtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgcHJvZ3Jlc3NDYWxsYmFjayA9IHRoaXMucGFyYW1zLmdldCgncHJvZ3Jlc3NDYWxsYmFjaycpIHx8wqBub29wO1xuICAgIGNvbnN0IGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG4gICAgY29uc3QgbmJyRnJhbWVzID0gTWF0aC5jZWlsKGJ1ZmZlci5sZW5ndGggLyBmcmFtZVNpemUpO1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgbGV0IGkgPSAwO1xuXG4gICAgZnVuY3Rpb24gc2xpY2UoKSB7XG4gICAgICBjb25zdCBvZmZzZXQgPSBpICogZnJhbWVTaXplO1xuICAgICAgY29uc3QgbmJyQ29weSA9IE1hdGgubWluKGxlbmd0aCAtIG9mZnNldCwgZnJhbWVTaXplKTtcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBmcmFtZVNpemU7IGorKylcbiAgICAgICAgZGF0YVtqXSA9IGogPCBuYnJDb3B5ID8gYnVmZmVyW29mZnNldCArIGpdIDogMDtcblxuICAgICAgdGhhdC5mcmFtZS50aW1lID0gb2Zmc2V0IC8gc2FtcGxlUmF0ZTtcbiAgICAgIHRoYXQuZW5kVGltZSA9IHRoYXQuZnJhbWUudGltZSArIG5ickNvcHkgLyBzYW1wbGVSYXRlO1xuICAgICAgdGhhdC5wcm9wYWdhdGVGcmFtZSgpO1xuXG4gICAgICBpICs9IDE7XG4gICAgICBwcm9ncmVzc0NhbGxiYWNrKGkgLyBuYnJGcmFtZXMpO1xuXG4gICAgICBpZiAoaSA8IG5ickZyYW1lcykge1xuICAgICAgICBpZiAoYXN5bmMpXG4gICAgICAgICAgc2V0VGltZW91dChzbGljZSwgMCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBzbGljZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhhdC5maW5hbGl6ZVN0cmVhbSh0aGF0LmVuZFRpbWUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBhbGxvdyB0aGUgZm9sbG93aW5nIHRvIGRvIHRoZSBleHBlY3RlZCB0aGluZzpcbiAgICAvLyBhdWRpb0luLmNvbm5lY3QocmVjb3JkZXIpO1xuICAgIC8vIGF1ZGlvSW4uc3RhcnQoKTtcbiAgICAvLyByZWNvcmRlci5zdGFydCgpO1xuICAgIHNldFRpbWVvdXQoc2xpY2UsIDApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEF1ZGlvSW5CdWZmZXI7XG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuaW1wb3J0IFNvdXJjZU1peGluIGZyb20gJy4uLy4uL2NvcmUvU291cmNlTWl4aW4nO1xuXG5jb25zdCBBdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8wqB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgZnJhbWVTaXplOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDUxMixcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgY2hhbm5lbDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAwLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBzb3VyY2VOb2RlOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgYXVkaW9Db250ZXh0OiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbn07XG5cbi8qKlxuICogVXNlIGEgYFdlYkF1ZGlvYCBub2RlIGFzIGEgc291cmNlIGZvciB0aGUgZ3JhcGguXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBwYXJhbWV0ZXInIGRlZmF1bHQgdmFsdWVzLlxuICogQHBhcmFtIHtBdWRpb05vZGV9IFtvcHRpb25zLnNvdXJjZU5vZGU9bnVsbF0gLSBBdWRpbyBub2RlIHRvIHByb2Nlc3NcbiAqICAobWFuZGF0b3J5KS5cbiAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBbb3B0aW9ucy5hdWRpb0NvbnRleHQ9bnVsbF0gLSBBdWRpbyBjb250ZXh0IHVzZWQgdG9cbiAqICBjcmVhdGUgdGhlIGF1ZGlvIG5vZGUgKG1hbmRhdG9yeSkuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZnJhbWVTaXplPTUxMl0gLSBTaXplIG9mIHRoZSBvdXRwdXQgYmxvY2tzLCBkZWZpbmVcbiAqICB0aGUgYGZyYW1lU2l6ZWAgaW4gdGhlIGBzdHJlYW1QYXJhbXNgLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmNoYW5uZWw9MF0gLSBOdW1iZXIgb2YgdGhlIGNoYW5uZWwgdG8gcHJvY2Vzcy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNsaWVudC5zb3VyY2VcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIGNvbnN0IGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAqIGNvbnN0IHNpbmUgPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICogc2luZS5mcmVxdWVuY3kudmFsdWUgPSAyO1xuICpcbiAqIGNvbnN0IGF1ZGlvSW5Ob2RlID0gbmV3IGxmby5zb3VyY2UuQXVkaW9Jbk5vZGUoe1xuICogICBhdWRpb0NvbnRleHQ6IGF1ZGlvQ29udGV4dCxcbiAqICAgc291cmNlTm9kZTogc2luZSxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IHNpZ25hbERpc3BsYXkgPSBuZXcgbGZvLnNpbmsuU2lnbmFsRGlzcGxheSh7XG4gKiAgIGNhbnZhczogJyNzaWduYWwnLFxuICogICBkdXJhdGlvbjogMSxcbiAqIH0pO1xuICpcbiAqIGF1ZGlvSW5Ob2RlLmNvbm5lY3Qoc2lnbmFsRGlzcGxheSk7XG4gKlxuICogLy8gc3RhcnQgdGhlIHNpbmUgb3NjaWxsYXRvciBub2RlIGFuZCB0aGUgbGZvIGdyYXBoXG4gKiBzaW5lLnN0YXJ0KCk7XG4gKiBhdWRpb0luTm9kZS5zdGFydCgpO1xuICovXG5jbGFzcyBBdWRpb0luTm9kZSBleHRlbmRzIFNvdXJjZU1peGluKEJhc2VMZm8pIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgYXVkaW9Db250ZXh0ID0gdGhpcy5wYXJhbXMuZ2V0KCdhdWRpb0NvbnRleHQnKTtcbiAgICBjb25zdCBzb3VyY2VOb2RlID0gdGhpcy5wYXJhbXMuZ2V0KCdzb3VyY2VOb2RlJyk7XG5cbiAgICBpZiAoIWF1ZGlvQ29udGV4dCB8fCAhKGF1ZGlvQ29udGV4dCBpbnN0YW5jZW9mIEF1ZGlvQ29udGV4dCkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYGF1ZGlvQ29udGV4dGAgcGFyYW1ldGVyJyk7XG5cbiAgICBpZiAoIXNvdXJjZU5vZGUgfHwgIShzb3VyY2VOb2RlIGluc3RhbmNlb2YgQXVkaW9Ob2RlKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBgc291cmNlTm9kZWAgcGFyYW1ldGVyJyk7XG5cbiAgICB0aGlzLnNvdXJjZU5vZGUgPSBzb3VyY2VOb2RlO1xuICAgIHRoaXMuX2NoYW5uZWwgPSB0aGlzLnBhcmFtcy5nZXQoJ2NoYW5uZWwnKTtcbiAgICB0aGlzLl9ibG9ja0R1cmF0aW9uID0gbnVsbDtcblxuICAgIHRoaXMucHJvY2Vzc0ZyYW1lID0gdGhpcy5wcm9jZXNzRnJhbWUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGUgdGhlIGBzdHJlYW1QYXJhbXNgIGluIHRoZSBncmFwaCBhbmQgc3RhcnQgdG8gcHJvcGFnYXRlIHNpZ25hbFxuICAgKiBibG9ja3MgcHJvZHVjZWQgYnkgdGhlIGF1ZGlvIG5vZGUgaW50byB0aGUgZ3JhcGguXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Jlc2V0U3RyZWFtfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y2xpZW50LnNvdXJjZS5BdWRpb0luTm9kZSNzdG9wfVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQgPT09IGZhbHNlKSB7XG4gICAgICBpZiAodGhpcy5pbml0UHJvbWlzZSA9PT0gbnVsbCkgLy8gaW5pdCBoYXMgbm90IHlldCBiZWVuIGNhbGxlZFxuICAgICAgICB0aGlzLmluaXRQcm9taXNlID0gdGhpcy5pbml0KCk7XG5cbiAgICAgIHRoaXMuaW5pdFByb21pc2UudGhlbih0aGlzLnN0YXJ0KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhdWRpb0NvbnRleHQgPSB0aGlzLnBhcmFtcy5nZXQoJ2F1ZGlvQ29udGV4dCcpO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnZnJhbWVTaXplJyk7XG5cbiAgICB0aGlzLmZyYW1lLnRpbWUgPSAwO1xuICAgIC8vIEBub3RlOiByZWNyZWF0ZSBlYWNoIHRpbWUgYmVjYXVzZSBvZiBhIGZpcmVmb3ggd2VpcmQgYmVoYXZpb3JcbiAgICB0aGlzLnNjcmlwdFByb2Nlc3NvciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IoZnJhbWVTaXplLCAxLCAxKTtcbiAgICB0aGlzLnNjcmlwdFByb2Nlc3Nvci5vbmF1ZGlvcHJvY2VzcyA9IHRoaXMucHJvY2Vzc0ZyYW1lO1xuXG4gICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICB0aGlzLnNvdXJjZU5vZGUuY29ubmVjdCh0aGlzLnNjcmlwdFByb2Nlc3Nvcik7XG4gICAgdGhpcy5zY3JpcHRQcm9jZXNzb3IuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmFsaXplIHRoZSBzdHJlYW0gYW5kIHN0b3AgdGhlIHdob2xlIGdyYXBoLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNmaW5hbGl6ZVN0cmVhbX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNsaWVudC5zb3VyY2UuQXVkaW9Jbk5vZGUjc3RhcnR9XG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuZmluYWxpemVTdHJlYW0odGhpcy5mcmFtZS50aW1lKTtcbiAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLnNvdXJjZU5vZGUuZGlzY29ubmVjdCgpO1xuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLmRpc2Nvbm5lY3QoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKCkge1xuICAgIGNvbnN0IGF1ZGlvQ29udGV4dCA9IHRoaXMucGFyYW1zLmdldCgnYXVkaW9Db250ZXh0Jyk7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdmcmFtZVNpemUnKTtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gYXVkaW9Db250ZXh0LnNhbXBsZVJhdGU7XG5cbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSBmcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gc2FtcGxlUmF0ZSAvIGZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVR5cGUgPSAnc2lnbmFsJztcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlID0gc2FtcGxlUmF0ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVDb3VudCA9IGZyYW1lU2l6ZTtcblxuICAgIHRoaXMuX2Jsb2NrRHVyYXRpb24gPSBmcmFtZVNpemUgLyBzYW1wbGVSYXRlO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCYXNpY2FsbHkgdGhlIGBzY3JpcHRQcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3NgIGNhbGxiYWNrXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcm9jZXNzRnJhbWUoZSkge1xuICAgIGlmICh0aGlzLnN0YXJ0ZWQgPT09IGZhbHNlKVxuICAgICAgcmV0dXJuO1xuXG4gICAgdGhpcy5mcmFtZS5kYXRhID0gZS5pbnB1dEJ1ZmZlci5nZXRDaGFubmVsRGF0YSh0aGlzLl9jaGFubmVsKTtcbiAgICB0aGlzLnByb3BhZ2F0ZUZyYW1lKCk7XG5cbiAgICB0aGlzLmZyYW1lLnRpbWUgKz0gdGhpcy5fYmxvY2tEdXJhdGlvbjtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBdWRpb0luTm9kZTtcbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5pbXBvcnQgeyBvcGNvZGVzLCBlbmNvZGVycywgZGVjb2RlcnMgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMvd3NVdGlscyc7XG5cbmNvbnN0IHBhcmFtZXRlcnMgPSB7XG4gIHBvcnQ6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogODAwMCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgdXJsOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfVxufVxuXG4vKipcbiAqIFJlY2VpdmUgYW4gbGZvIGZyYW1lIGFzIGEgc29ja2V0IG1lc3NhZ2UgZnJvbSBhIGBub2RlLnNpbmsuU29ja2V0U2VuZGBcbiAqIGluc3RhbmNlLlxuICpcbiAqIDxwIGNsYXNzPVwid2FybmluZ1wiPkV4cGVyaW1lbnRhbDwvcD5cbiAqXG4gKiBAdG9kbyAtIGhhbmRsZSBpbml0IC8gc3RhcnQgcHJvcGVybHkuXG4gKi9cbmNsYXNzIFNvY2tldFJlY2VpdmUgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIocGFyYW1ldGVycywgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBwcm90b2NvbCA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbC5yZXBsYWNlKC9eaHR0cC8sICd3cycpO1xuICAgIGNvbnN0IGFkZHJlc3MgPSB0aGlzLnBhcmFtcy5nZXQoJ3VybCcpIHx8wqB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWU7XG4gICAgY29uc3QgcG9ydCA9IHRoaXMucGFyYW1zLmdldCgncG9ydCcpIHx8ICcnOyAvLyBldmVyeXRoaW5nIGZhbHN5IGJlY29tZXMgJydcbiAgICBjb25zdCBzb2NrZXRBZGRyZXNzID0gYCR7cHJvdG9jb2x9Ly8ke2FkZHJlc3N9OiR7cG9ydH1gO1xuXG4gICAgdGhpcy5fZGlzcGF0Y2ggPSB0aGlzLl9kaXNwYXRjaC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KHNvY2tldEFkZHJlc3MpO1xuICAgIHRoaXMuc29ja2V0LmJpbmFyeVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG4gICAgdGhpcy5vcGVuZWRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5zb2NrZXQub25vcGVuID0gcmVzb2x2ZTtcbiAgICB9KTtcblxuICAgIHRoaXMuc29ja2V0Lm9ubWVzc2FnZSA9IHRoaXMuX2Rpc3BhdGNoO1xuICAgIHRoaXMuc29ja2V0Lm9uZXJyb3IgPSAoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdE1vZHVsZSgpIHtcbiAgICBjb25zdCBwcm9taXNlcyA9IHRoaXMubmV4dE1vZHVsZXMubWFwKChtb2QpID0+IG1vZC5pbml0TW9kdWxlKCkpO1xuICAgIHByb21pc2VzLnB1c2godGhpcy5vcGVuZWRQcm9taXNlKTtcbiAgICAvLyB3YWl0IGZvciBjaGlsZHJlbiBwcm9taXNlcyBhbmQgc2VuZCBJTklUX01PRFVMRV9BQ0tcbiAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBidWZmZXIgPSBlbmNvZGVycy5pbml0TW9kdWxlQWNrKCk7XG4gICAgICB0aGlzLnNvY2tldC5zZW5kKGJ1ZmZlcik7XG4gICAgfSk7XG4gIH1cblxuICAvLyBwcm9jZXNzIGFueSB0eXBlXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2NhbGFyKCkge31cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoKSB7fVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbCgpIHt9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIHRoaXMucHJlcGFyZUZyYW1lKCk7XG4gICAgdGhpcy5mcmFtZSA9IGZyYW1lO1xuICAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWNvZGUgYW5kIGRpc3BhdGNoIGluY29tbWluZyBmcmFtZSBhY2NvcmRpbmcgdG8gb3Bjb2RlXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZGlzcGF0Y2goZSkge1xuICAgIGNvbnN0IGFycmF5QnVmZmVyID0gZS5kYXRhO1xuICAgIGNvbnN0IG9wY29kZSA9IGRlY29kZXJzLm9wY29kZShhcnJheUJ1ZmZlcik7XG5cbiAgICBzd2l0Y2ggKG9wY29kZSkge1xuICAgICAgY2FzZSBvcGNvZGVzLklOSVRfTU9EVUxFX1JFUTpcbiAgICAgICAgdGhpcy5pbml0TW9kdWxlKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBvcGNvZGVzLlBST0NFU1NfU1RSRUFNX1BBUkFNUzpcbiAgICAgICAgY29uc3QgcHJldlN0cmVhbVBhcmFtcyA9IGRlY29kZXJzLnN0cmVhbVBhcmFtcyhhcnJheUJ1ZmZlcik7XG4gICAgICAgIHRoaXMucHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG9wY29kZXMuUkVTRVRfU1RSRUFNOlxuICAgICAgICB0aGlzLnJlc2V0U3RyZWFtKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBvcGNvZGVzLkZJTkFMSVpFX1NUUkVBTTpcbiAgICAgICAgY29uc3QgZW5kVGltZSA9IGRlY29kZXJzLmZpbmFsaXplU3RyZWFtKGFycmF5QnVmZmVyKTtcbiAgICAgICAgdGhpcy5maW5hbGl6ZVN0cmVhbShlbmRUaW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG9wY29kZXMuUFJPQ0VTU19GUkFNRTpcbiAgICAgICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgICAgICBjb25zdCBmcmFtZSA9IGRlY29kZXJzLnByb2Nlc3NGcmFtZShhcnJheUJ1ZmZlciwgZnJhbWVTaXplKTtcbiAgICAgICAgdGhpcy5wcm9jZXNzRnJhbWUoZnJhbWUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU29ja2V0UmVjZWl2ZTtcbiIsIi8vIGNvbW1vblxuaW1wb3J0IEV2ZW50SW4gZnJvbSAnLi4vLi4vY29tbW9uL3NvdXJjZS9FdmVudEluJztcbi8vIGNsaWVudCBvbmx5XG5pbXBvcnQgQXVkaW9JbkJ1ZmZlciBmcm9tICcuL0F1ZGlvSW5CdWZmZXInO1xuaW1wb3J0IEF1ZGlvSW5Ob2RlIGZyb20gJy4vQXVkaW9Jbk5vZGUnO1xuaW1wb3J0IFNvY2tldFJlY2VpdmUgZnJvbSAnLi9Tb2NrZXRSZWNlaXZlJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBFdmVudEluLFxuXG4gIEF1ZGlvSW5CdWZmZXIsXG4gIEF1ZGlvSW5Ob2RlLFxuICBTb2NrZXRSZWNlaXZlLFxufTtcbiIsIi8qKlxuICogU3luY2hyb25pemUgc2V2ZXJhbCBkaXNwbGF5IHNpbmtzIHRvIGEgY29tbW9uIHRpbWUuXG4gKlxuICogQHBhcmFtIHsuLi5CYXNlRGlzcGxheX0gdmlld3MgLSBMaXN0IG9mIHRoZSBkaXNwbGF5IHRvIHN5bmNocm9uaXplLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y2xpZW50LnV0aWxzXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiBjb25zdCBldmVudEluMSA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVR5cGU6ICdzY2FsYXInLFxuICogICBmcmFtZVNpemU6IDEsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBicGYxID0gbmV3IGxmby5zaW5rLkJwZkRpc3BsYXkoe1xuICogICBjYW52YXM6ICcjYnBmLTEnLFxuICogICBkdXJhdGlvbjogMixcbiAqICAgc3RhcnRUaW1lOiAwLFxuICogICBtaW46IDAsXG4gKiAgIGNvbG9yczogWydzdGVlbGJsdWUnXSxcbiAqIH0pO1xuICpcbiAqIGV2ZW50SW4xLmNvbm5lY3QoYnBmMSk7XG4gKlxuICogY29uc3QgZXZlbnRJbjIgPSBuZXcgbGZvLnNvdXJjZS5FdmVudEluKHtcbiAqICAgZnJhbWVUeXBlOiAnc2NhbGFyJyxcbiAqICAgZnJhbWVTaXplOiAxLFxuICogfSk7XG4gKlxuICogY29uc3QgYnBmMiA9IG5ldyBsZm8uc2luay5CcGZEaXNwbGF5KHtcbiAqICAgY2FudmFzOiAnI2JwZi0yJyxcbiAqICAgZHVyYXRpb246IDIsXG4gKiAgIHN0YXJ0VGltZTogNyxcbiAqICAgbWluOiAwLFxuICogICBjb2xvcnM6IFsnb3JhbmdlJ10sXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBkaXNwbGF5U3luYyA9IG5ldyBsZm8udXRpbHMuRGlzcGxheVN5bmMoYnBmMSwgYnBmMik7XG4gKlxuICogZXZlbnRJbjIuY29ubmVjdChicGYyKTtcbiAqXG4gKiBldmVudEluMS5zdGFydCgpO1xuICogZXZlbnRJbjIuc3RhcnQoKTtcbiAqXG4gKiBsZXQgdGltZSA9IDA7XG4gKiBjb25zdCBwZXJpb2QgPSAwLjQ7XG4gKiBjb25zdCBvZmZzZXQgPSA3LjI7XG4gKlxuICogKGZ1bmN0aW9uIGdlbmVyYXRlRGF0YSgpIHtcbiAqICAgY29uc3QgdiA9IE1hdGgucmFuZG9tKCk7XG4gKlxuICogICBldmVudEluMS5wcm9jZXNzKHRpbWUsIHYpO1xuICogICBldmVudEluMi5wcm9jZXNzKHRpbWUgKyBvZmZzZXQsIHYpO1xuICpcbiAqICAgdGltZSArPSBwZXJpb2Q7XG4gKlxuICogICBzZXRUaW1lb3V0KGdlbmVyYXRlRGF0YSwgcGVyaW9kICogMTAwMCk7XG4gKiB9KCkpO1xuICovXG5jbGFzcyBEaXNwbGF5U3luYyB7XG4gIGNvbnN0cnVjdG9yKC4uLnZpZXdzKSB7XG4gICAgdGhpcy52aWV3cyA9IFtdO1xuXG4gICAgdGhpcy5hZGQoLi4udmlld3MpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGFkZCguLi52aWV3cykge1xuICAgIHZpZXdzLmZvckVhY2godmlldyA9PiB0aGlzLmluc3RhbGwodmlldykpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGluc3RhbGwodmlldykge1xuICAgIHRoaXMudmlld3MucHVzaCh2aWV3KTtcblxuICAgIHZpZXcuZGlzcGxheVN5bmMgPSB0aGlzO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHNoaWZ0U2libGluZ3MoaVNoaWZ0LCB0aW1lLCB2aWV3KSB7XG4gICAgdGhpcy52aWV3cy5mb3JFYWNoKGZ1bmN0aW9uKGRpc3BsYXkpIHtcbiAgICAgIGlmIChkaXNwbGF5ICE9PSB2aWV3KVxuICAgICAgICBkaXNwbGF5LnNoaWZ0Q2FudmFzKGlTaGlmdCwgdGltZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGlzcGxheVN5bmM7XG4iLCJpbXBvcnQgRGlzcGxheVN5bmMgZnJvbSAnLi9EaXNwbGF5U3luYyc7XG5pbXBvcnQgaW5pdFdpbmRvd3MgZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzL3dpbmRvd3MnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIERpc3BsYXlTeW5jLFxuICBpbml0V2luZG93cyxcbn07XG4iLCJjb25zdCBjb2xvcnMgPSBbJyM0NjgyQjQnLCAnI2ZmYTUwMCcsICcjMDBlNjAwJywgJyNmZjAwMDAnLCAnIzgwMDA4MCcsICcjMjI0MTUzJ107XG5cbmV4cG9ydCBjb25zdCBnZXRDb2xvcnMgPSBmdW5jdGlvbih0eXBlLCBuYnIpIHtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnc2lnbmFsJzpcbiAgICAgIHJldHVybiBjb2xvcnNbMF07IC8vIHN0ZWVsYmx1ZVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnYnBmJzpcbiAgICAgIGlmIChuYnIgPD0gY29sb3JzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gY29sb3JzLnNsaWNlKDAsIG5icik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBfY29sb3JzID0gY29sb3JzLnNsaWNlKDApO1xuICAgICAgICB3aGlsZSAoX2NvbG9ycy5sZW5ndGggPCBuYnIpXG4gICAgICAgICAgX2NvbG9ycy5wdXNoKGdldFJhbmRvbUNvbG9yKCkpO1xuXG4gICAgICAgIHJldHVybiBfY29sb3JzO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnd2F2ZWZvcm0nOlxuICAgICAgcmV0dXJuIFtjb2xvcnNbMF0sIGNvbG9yc1s1XV07IC8vIHN0ZWVsYmx1ZSAvIGRhcmtibHVlXG4gICAgICBicmVhaztcbiAgICBjYXNlICdtYXJrZXInOlxuICAgICAgcmV0dXJuIGNvbG9yc1szXTsgLy8gcmVkXG4gICAgICBicmVhaztcbiAgICBjYXNlICdzcGVjdHJ1bSc6XG4gICAgICByZXR1cm4gY29sb3JzWzJdOyAvLyBncmVlblxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAndHJhY2UnOlxuICAgICAgcmV0dXJuIGNvbG9yc1sxXTsgLy8gb3JhbmdlXG4gICAgICBicmVhaztcbiAgfVxufTtcblxuLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNDg0NTA2L3JhbmRvbS1jb2xvci1nZW5lcmF0b3ItaW4tamF2YXNjcmlwdFxuZXhwb3J0IGNvbnN0IGdldFJhbmRvbUNvbG9yID0gZnVuY3Rpb24oKSB7XG4gIHZhciBsZXR0ZXJzID0gJzAxMjM0NTY3ODlBQkNERUYnLnNwbGl0KCcnKTtcbiAgdmFyIGNvbG9yID0gJyMnO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDY7IGkrKyApIHtcbiAgICBjb2xvciArPSBsZXR0ZXJzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2KV07XG4gIH1cbiAgcmV0dXJuIGNvbG9yO1xufTtcblxuLy8gc2NhbGUgZnJvbSBkb21haW4gWzAsIDFdIHRvIHJhbmdlIFsyNzAsIDBdIHRvIGNvbnN1bWUgaW5cbi8vIGhzbCh4LCAxMDAlLCA1MCUpIGNvbG9yIHNjaGVtZVxuZXhwb3J0IGNvbnN0IGdldEh1ZSA9IGZ1bmN0aW9uKHgpIHtcbiAgdmFyIGRvbWFpbk1pbiA9IDA7XG4gIHZhciBkb21haW5NYXggPSAxO1xuICB2YXIgcmFuZ2VNaW4gPSAyNzA7XG4gIHZhciByYW5nZU1heCA9IDA7XG5cbiAgcmV0dXJuICgoKHJhbmdlTWF4IC0gcmFuZ2VNaW4pICogKHggLSBkb21haW5NaW4pKSAvIChkb21haW5NYXggLSBkb21haW5NaW4pKSArIHJhbmdlTWluO1xufTtcblxuZXhwb3J0IGNvbnN0IGhleFRvUkdCID0gZnVuY3Rpb24oaGV4KSB7XG4gIGhleCA9IGhleC5zdWJzdHJpbmcoMSwgNyk7XG4gIHZhciByID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZygwLCAyKSwgMTYpO1xuICB2YXIgZyA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoMiwgNCksIDE2KTtcbiAgdmFyIGIgPSBwYXJzZUludChoZXguc3Vic3RyaW5nKDQsIDYpLCAxNik7XG4gIHJldHVybiBbciwgZywgYl07XG59O1xuIiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcblxuY29uc3Qgc2luID0gTWF0aC5zaW47XG5jb25zdCBjb3MgPSBNYXRoLmNvcztcbmNvbnN0IHNxcnQgPSBNYXRoLnNxcnQ7XG5jb25zdCBwb3cgPSBNYXRoLnBvdztcbmNvbnN0IF8yUEkgPSBNYXRoLlBJICogMjtcblxuLy8gcGxvdCAoZnJvbSBodHRwOi8vd3d3LmVhcmxldmVsLmNvbS9zY3JpcHRzL3dpZGdldHMvMjAxMzEwMTMvYmlxdWFkczIuanMpXG4vLyB2YXIgbGVuID0gNTEyO1xuLy8gdmFyIG1hZ1Bsb3QgPSBbXTtcbi8vIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGxlbjsgaWR4KyspIHtcbi8vICAgdmFyIHc7XG4vLyAgIGlmIChwbG90VHlwZSA9PSBcImxpbmVhclwiKVxuLy8gICAgIHcgPSBpZHggLyAobGVuIC0gMSkgKiBNYXRoLlBJOyAgLy8gMCB0byBwaSwgbGluZWFyIHNjYWxlXG4vLyAgIGVsc2Vcbi8vICAgICB3ID0gTWF0aC5leHAoTWF0aC5sb2coMSAvIDAuMDAxKSAqIGlkeCAvIChsZW4gLSAxKSkgKiAwLjAwMSAqIE1hdGguUEk7ICAvLyAwLjAwMSB0byAxLCB0aW1lcyBwaSwgbG9nIHNjYWxlXG5cbi8vICAgdmFyIHBoaSA9IE1hdGgucG93KE1hdGguc2luKHcvMiksIDIpO1xuLy8gICB2YXIgeSA9IE1hdGgubG9nKE1hdGgucG93KGEwK2ExK2EyLCAyKSAtIDQqKGEwKmExICsgNCphMCphMiArIGExKmEyKSpwaGkgKyAxNiphMCphMipwaGkqcGhpKSAtIE1hdGgubG9nKE1hdGgucG93KDErYjErYjIsIDIpIC0gNCooYjEgKyA0KmIyICsgYjEqYjIpKnBoaSArIDE2KmIyKnBoaSpwaGkpO1xuLy8gICB5ID0geSAqIDEwIC8gTWF0aC5MTjEwXG4vLyAgIGlmICh5ID09IC1JbmZpbml0eSlcbi8vICAgICB5ID0gLTIwMDtcblxuLy8gICBpZiAocGxvdFR5cGUgPT0gXCJsaW5lYXJcIilcbi8vICAgICBtYWdQbG90LnB1c2goW2lkeCAvIChsZW4gLSAxKSAqIEZzIC8gMiwgeV0pO1xuLy8gICBlbHNlXG4vLyAgICAgbWFnUGxvdC5wdXNoKFtpZHggLyAobGVuIC0gMSkgLyAyLCB5XSk7XG5cbi8vICAgaWYgKGlkeCA9PSAwKVxuLy8gICAgIG1pblZhbCA9IG1heFZhbCA9IHk7XG4vLyAgIGVsc2UgaWYgKHkgPCBtaW5WYWwpXG4vLyAgICAgbWluVmFsID0geTtcbi8vICAgZWxzZSBpZiAoeSA+IG1heFZhbClcbi8vICAgICBtYXhWYWwgPSB5O1xuLy8gfVxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgdHlwZToge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBkZWZhdWx0OiAnbG93cGFzcycsXG4gICAgbGlzdDogW1xuICAgICAgJ2xvd3Bhc3MnLFxuICAgICAgJ2hpZ2hwYXNzJyxcbiAgICAgICdiYW5kcGFzc19jb25zdGFudF9za2lydCcsXG4gICAgICAnYmFuZHBhc3MnLFxuICAgICAgJ2JhbmRwYXNzX2NvbnN0YW50X3BlYWsnLFxuICAgICAgJ25vdGNoJyxcbiAgICAgICdhbGxwYXNzJyxcbiAgICAgICdwZWFraW5nJyxcbiAgICAgICdsb3dzaGVsZicsXG4gICAgICAnaGlnaHNoZWxmJyxcbiAgICBdLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICBmMDoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogMSxcbiAgICBtZXRhczogeyBraW5kOiAnZHlhbm1pYycgfSxcbiAgfSxcbiAgZ2Fpbjoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogMSxcbiAgICBtaW46IDAsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5YW5taWMnIH0sXG4gIH0sXG4gIHE6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDEsXG4gICAgbWluOiAwLjAwMSwgLy8gUElQT19CSVFVQURfTUlOX1FcbiAgICAvLyBtYXg6IDEsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5YW5taWMnIH0sXG4gIH0sXG4gIC8vIGJhbmR3aWR0aDoge1xuICAvLyAgIHR5cGU6ICdmbG9hdCcsXG4gIC8vICAgZGVmYXVsdDogbnVsbCxcbiAgLy8gICBudWxsYWJsZTogdHJ1ZSxcbiAgLy8gICBtZXRhczogeyBraW5kOiAnZHlhbm1pYycgfSxcbiAgLy8gfSxcbn1cblxuXG4vKipcbiAqIEJpcXVhZCBmaWx0ZXIgKERpcmVjdCBmb3JtIEkpLiBJZiBpbnB1dCBpcyBvZiB0eXBlIGB2ZWN0b3JgIHRoZSBmaWx0ZXIgaXNcbiAqIGFwcGxpZWQgb24gZWFjaCBkaW1lbnNpb24gaSBwYXJhbGxlbC5cbiAqXG4gKiBCYXNlZCBvbiB0aGUgW1wiQ29va2Jvb2sgZm9ybXVsYWUgZm9yIGF1ZGlvIEVRIGJpcXVhZCBmaWx0ZXIgY29lZmZpY2llbnRzXCJdKGh0dHA6Ly93d3cubXVzaWNkc3Aub3JnL2ZpbGVzL0F1ZGlvLUVRLUNvb2tib29rLnR4dClcbiAqIGJ5IFJvYmVydCBCcmlzdG93LUpvaG5zb24uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24ub3BlcmF0b3JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgdmFsdWVzLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnR5cGU9J2xvd3Bhc3MnXSAtIFR5cGUgb2YgdGhlIGZpbHRlci4gQXZhaWxhYmxlXG4gKiAgZmlsdGVyczogJ2xvd3Bhc3MnLCAnaGlnaHBhc3MnLCAnYmFuZHBhc3NfY29uc3RhbnRfc2tpcnQnLCAnYmFuZHBhc3NfY29uc3RhbnRfcGVhaydcbiAqICAoYWxpYXMgJ2JhbmRwYXNzJyksICdub3RjaCcsICdhbGxwYXNzJywgJ3BlYWtpbmcnLCAnbG93c2hlbGYnLCAnaGlnaHNoZWxmJy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5mMD0xXSAtIEN1dG9mZiBvciBjZW50ZXIgZnJlcXVlbmN5IG9mIHRoZSBmaWx0ZXJcbiAqICBhY2NvcmRpbmcgdG8gaXRzIHR5cGUuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZ2Fpbj0xXSAtIEdhaW4gb2YgdGhlIGZpbHRlciAoaW4gZEIpLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnE9MV0gLSBRdWFsaXR5IGZhY3RvciBvZiB0aGUgZmlsdGVyLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gKlxuICogY29uc3QgYXVkaW9JbkJ1ZmZlciA9IG5ldyBsZm8uc291cmNlLkF1ZGlvSW5CdWZmZXIoe1xuICogICBhdWRpb0J1ZmZlcjogYnVmZmVyLFxuICogfSk7XG4gKlxuICogY29uc3QgYmlxdWFkID0gbmV3IGxmby5vcGVyYXRvci5CaXF1YWQoe1xuICogICB0eXBlOiAnbG93cGFzcycsXG4gKiAgIGYwOiAyMDAwLFxuICogICBnYWluOiAzLFxuICogICBxOiAxMixcbiAqIH0pO1xuICpcbiAqIGNvbnN0IHNwZWN0cnVtRGlzcGxheSA9IG5ldyBsZm8uc2luay5TcGVjdHJ1bURpc3BsYXkoe1xuICogICBjYW52YXM6ICcjc3BlY3RydW0nLFxuICogfSk7XG4gKlxuICogYXVkaW9JbkJ1ZmZlci5jb25uZWN0KGJpcXVhZCk7XG4gKiBiaXF1YWQuY29ubmVjdChzcGVjdHJ1bURpc3BsYXkpO1xuICpcbiAqIGF1ZGlvSW5CdWZmZXIuc3RhcnQoKTtcbiAqL1xuY2xhc3MgQmlxdWFkIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIG9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKSB7XG4gICAgdGhpcy5fY2FsY3VsYXRlQ29lZnMoKTtcbiAgfVxuXG4gIF9jYWxjdWxhdGVDb2VmcygpIHtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcbiAgICBjb25zdCBmcmFtZVR5cGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVR5cGU7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuXG4gICAgY29uc3QgdHlwZSA9IHRoaXMucGFyYW1zLmdldCgndHlwZScpO1xuICAgIGNvbnN0IGYwID0gdGhpcy5wYXJhbXMuZ2V0KCdmMCcpO1xuICAgIGNvbnN0IGdhaW4gPSB0aGlzLnBhcmFtcy5nZXQoJ2dhaW4nKTtcbiAgICBjb25zdCBxID0gdGhpcy5wYXJhbXMuZ2V0KCdxJyk7XG4gICAgLy8gY29uc3QgYmFuZHdpZHRoID0gdGhpcy5wYXJhbXMuZ2V0KCdiYW5kd2lkdGgnKTtcbiAgICBjb25zdCBiYW5kd2lkdGggPSBudWxsO1xuXG4gICAgbGV0IGIwID0gMCwgYjEgPSAwLCBiMiA9IDAsIGEwID0gMCwgYTEgPSAwLCBhMiA9IDA7XG5cbiAgICBjb25zdCBBID0gcG93KDEwLCBnYWluIC8gNDApO1xuICAgIGNvbnN0IHcwID0gXzJQSSAqIGYwIC8gc2FtcGxlUmF0ZTtcbiAgICBjb25zdCBjb3NXMCA9IGNvcyh3MCk7XG4gICAgY29uc3Qgc2luVzAgPSBzaW4odzApO1xuICAgIGxldCBhbHBoYTsgLy8gZGVwZW5kIG9mIHRoZSBmaWx0ZXIgdHlwZVxuICAgIGxldCBfMlJvb3RBQWxwaGE7IC8vIGludGVybWVkaWF0ZSB2YWx1ZSBmb3IgbG93c2hlbGYgYW5kIGhpZ2hzaGVsZlxuXG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAvLyBIKHMpID0gMSAvIChzXjIgKyBzL1EgKyAxKVxuICAgICAgY2FzZSAnbG93cGFzcyc6XG4gICAgICAgIGFscGhhID0gc2luVzAgLyAoMiAqIHEpO1xuICAgICAgICBiMCA9ICgxIC0gY29zVzApIC8gMjtcbiAgICAgICAgYjEgPSAxIC0gY29zVzA7XG4gICAgICAgIGIyID0gYjA7XG4gICAgICAgIGEwID0gMSArIGFscGhhO1xuICAgICAgICBhMSA9IC0yICogY29zVzA7XG4gICAgICAgIGEyID0gMSAtYWxwaGE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gSChzKSA9IHNeMiAvIChzXjIgKyBzL1EgKyAxKVxuICAgICAgY2FzZSAnaGlnaHBhc3MnOlxuICAgICAgICBhbHBoYSA9IHNpblcwIC8gKDIgKiBxKTtcbiAgICAgICAgYjAgPSAoMSArIGNvc1cwKSAvIDI7XG4gICAgICAgIGIxID0gLSAoMSArIGNvc1cwKVxuICAgICAgICBiMiA9IGIwO1xuICAgICAgICBhMCA9IDEgKyBhbHBoYTtcbiAgICAgICAgYTEgPSAtMiAqIGNvc1cwO1xuICAgICAgICBhMiA9IDEgLSBhbHBoYTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBIKHMpID0gcyAvIChzXjIgKyBzL1EgKyAxKSAgKGNvbnN0YW50IHNraXJ0IGdhaW4sIHBlYWsgZ2FpbiA9IFEpXG4gICAgICBjYXNlICdiYW5kcGFzc19jb25zdGFudF9za2lydCc6XG4gICAgICAgIGlmIChiYW5kd2lkdGgpIHtcbiAgICAgICAgICAvLyBzaW4odzApKnNpbmgoIGxuKDIpLzIgKiBCVyAqIHcwL3Npbih3MCkgKSAgICAgICAgICAgKGNhc2U6IEJXKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFscGhhID0gc2luVzAgLyAoMiAqIHEpO1xuICAgICAgICB9XG5cbiAgICAgICAgYjAgPSBzaW5XMCAvIDI7XG4gICAgICAgIGIxID0gMDtcbiAgICAgICAgYjIgPSAtYjA7XG4gICAgICAgIGEwID0gMSArIGFscGhhO1xuICAgICAgICBhMSA9IC0yICogY29zVzA7XG4gICAgICAgIGEyID0gMSAtIGFscGhhO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIEgocykgPSAocy9RKSAvIChzXjIgKyBzL1EgKyAxKSAgICAgIChjb25zdGFudCAwIGRCIHBlYWsgZ2FpbilcbiAgICAgIGNhc2UgJ2JhbmRwYXNzJzogLy8gbG9va3MgbGlrZSB3aGF0IGlzIGduZXJhbGx5IGNvbnNpZGVyZWQgYXMgYSBiYW5kcGFzc1xuICAgICAgY2FzZSAnYmFuZHBhc3NfY29uc3RhbnRfcGVhayc6XG4gICAgICAgIGlmIChiYW5kd2lkdGgpIHtcbiAgICAgICAgICAvLyBzaW4odzApKnNpbmgoIGxuKDIpLzIgKiBCVyAqIHcwL3Npbih3MCkgKSAgICAgICAgICAgKGNhc2U6IEJXKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFscGhhID0gc2luVzAgLyAoMiAqIHEpO1xuICAgICAgICB9XG5cbiAgICAgICAgYjAgPSBhbHBoYTtcbiAgICAgICAgYjEgPSAwO1xuICAgICAgICBiMiA9IC1hbHBoYTtcbiAgICAgICAgYTAgPSAxICsgYWxwaGE7XG4gICAgICAgIGExID0gLTIgKiBjb3NXMDtcbiAgICAgICAgYTIgPSAxIC0gYWxwaGE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gSChzKSA9IChzXjIgKyAxKSAvIChzXjIgKyBzL1EgKyAxKVxuICAgICAgY2FzZSAnbm90Y2gnOlxuICAgICAgICBhbHBoYSA9IHNpblcwIC8gKDIgKiBxKTtcbiAgICAgICAgYjAgPSAxO1xuICAgICAgICBiMSA9IC0yICogY29zVzA7XG4gICAgICAgIGIyID0gMTtcbiAgICAgICAgYTAgPSAxICsgYWxwaGE7XG4gICAgICAgIGExID0gYjE7XG4gICAgICAgIGEyID0gMSAtIGFscGhhO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIEgocykgPSAoc14yIC0gcy9RICsgMSkgLyAoc14yICsgcy9RICsgMSlcbiAgICAgIGNhc2UgJ2FsbHBhc3MnOlxuICAgICAgICBhbHBoYSA9IHNpblcwIC8gKDIgKiBxKTtcbiAgICAgICAgYjAgPSAxIC0gYWxwaGE7XG4gICAgICAgIGIxID0gLTIgKiBjb3NXMDtcbiAgICAgICAgYjIgPSAxICsgYWxwaGE7XG4gICAgICAgIGEwID0gYjI7XG4gICAgICAgIGExID0gYjE7XG4gICAgICAgIGEyID0gYjA7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gSChzKSA9IChzXjIgKyBzKihBL1EpICsgMSkgLyAoc14yICsgcy8oQSpRKSArIDEpXG4gICAgICBjYXNlICdwZWFraW5nJzpcbiAgICAgICAgaWYgKGJhbmR3aWR0aCkge1xuICAgICAgICAgIC8vIHNpbih3MCkqc2luaCggbG4oMikvMiAqIEJXICogdzAvc2luKHcwKSApICAgICAgICAgICAoY2FzZTogQlcpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWxwaGEgPSBzaW5XMCAvICgyICogcSk7XG4gICAgICAgIH1cblxuICAgICAgICBiMCA9IDEgKyBhbHBoYSAqIEE7XG4gICAgICAgIGIxID0gLTIgKiBjb3NXMDtcbiAgICAgICAgYjIgPSAxIC0gYWxwaGEgKiBBO1xuICAgICAgICBhMCA9IDEgKyBhbHBoYSAvIEE7XG4gICAgICAgIGExID0gYjE7XG4gICAgICAgIGEyID0gMSAtIGFscGhhIC8gQTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBIKHMpID0gQSAqIChzXjIgKyAoc3FydChBKS9RKSpzICsgQSkvKEEqc14yICsgKHNxcnQoQSkvUSkqcyArIDEpXG4gICAgICBjYXNlICdsb3dzaGVsZic6XG4gICAgICAgIGFscGhhID0gc2luVzAgLyAoMiAqIHEpO1xuICAgICAgICBfMlJvb3RBQWxwaGEgPSAyICogc3FydChBKSAqIGFscGhhO1xuXG4gICAgICAgIGIwID0gICAgIEEgKiAoKEEgKyAxKSAtIChBIC0gMSkgKiBjb3NXMCArIF8yUm9vdEFBbHBoYSk7XG4gICAgICAgIGIxID0gMiAqIEEgKiAoKEEgLSAxKSAtIChBICsgMSkgKiBjb3NXMCk7XG4gICAgICAgIGIyID0gICAgIEEgKiAoKEEgKyAxKSAtIChBIC0gMSkgKiBjb3NXMCAtIF8yUm9vdEFBbHBoYSk7XG4gICAgICAgIGEwID0gICAgICAgICAgKEEgKyAxKSArIChBIC0gMSkgKiBjb3NXMCArIF8yUm9vdEFBbHBoYTtcbiAgICAgICAgYTEgPSAgICAtMiAqICgoQSAtIDEpICsgKEEgKyAxKSAqIGNvc1cwKTtcbiAgICAgICAgYTIgPSAgICAgICAgICAoQSArIDEpICsgKEEgLSAxKSAqIGNvc1cwIC0gXzJSb290QUFscGhhO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIEgocykgPSBBICogKEEqc14yICsgKHNxcnQoQSkvUSkqcyArIDEpLyhzXjIgKyAoc3FydChBKS9RKSpzICsgQSlcbiAgICAgIGNhc2UgJ2hpZ2hzaGVsZic6XG4gICAgICAgIGFscGhhID0gc2luVzAgLyAoMiAqIHEpO1xuICAgICAgICBfMlJvb3RBQWxwaGEgPSAyICogc3FydChBKSAqIGFscGhhO1xuXG4gICAgICAgIGIwID0gICAgICBBICogKChBICsgMSkgKyAoQSAtIDEpICogY29zVzAgKyBfMlJvb3RBQWxwaGEpO1xuICAgICAgICBiMSA9IC0yICogQSAqICgoQSAtIDEpICsgKEEgKyAxKSAqIGNvc1cwKTtcbiAgICAgICAgYjIgPSAgICAgIEEgKiAoKEEgKyAxKSArIChBIC0gMSkgKiBjb3NXMCAtIF8yUm9vdEFBbHBoYSk7XG4gICAgICAgIGEwID0gICAgICAgICAgIChBICsgMSkgLSAoQSAtIDEpICogY29zVzAgKyBfMlJvb3RBQWxwaGE7XG4gICAgICAgIGExID0gICAgICAyICogKChBIC0gMSkgLSAoQSArIDEpICogY29zVzApO1xuICAgICAgICBhMiA9ICAgICAgICAgICAoQSArIDEpIC0gKEEgLSAxKSAqIGNvc1cwIC0gXzJSb290QUFscGhhO1xuXG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMuY29lZnMgPSB7XG4gICAgICBiMDogYjAgLyBhMCxcbiAgICAgIGIxOiBiMSAvIGEwLFxuICAgICAgYjI6IGIyIC8gYTAsXG4gICAgICBhMTogYTEgLyBhMCxcbiAgICAgIGEyOiBhMiAvIGEwLFxuICAgIH07XG5cbiAgICAvLyByZXNldCBzdGF0ZVxuICAgIGlmIChmcmFtZVR5cGUgPT09ICdzaWduYWwnKSB7XG4gICAgICB0aGlzLnN0YXRlID0geyB4MTogMCwgeDI6IDAsIHkxOiAwLCB5MjogMCB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICB4MTogbmV3IEZsb2F0MzJBcnJheShmcmFtZVNpemUpLFxuICAgICAgICB4MjogbmV3IEZsb2F0MzJBcnJheShmcmFtZVNpemUpLFxuICAgICAgICB5MTogbmV3IEZsb2F0MzJBcnJheShmcmFtZVNpemUpLFxuICAgICAgICB5MjogbmV3IEZsb2F0MzJBcnJheShmcmFtZVNpemUpLFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgLy8gaWYgbm8gYHNhbXBsZVJhdGVgIG9yIGBzYW1wbGVSYXRlYCBpcyAwIHdlIHNoYWxsIGhhbHQhXG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG5cbiAgICBpZiAoIXNhbXBsZVJhdGUgfHwgc2FtcGxlUmF0ZSA8PSAwKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHNhbXBsZVJhdGUgdmFsdWUgKDApIGZvciBiaXF1YWQnKTtcblxuICAgIHRoaXMuX2NhbGN1bGF0ZUNvZWZzKCk7XG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKGZyYW1lKSB7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IG91dERhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3QgaW5EYXRhID0gZnJhbWUuZGF0YTtcbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgY29lZnMgPSB0aGlzLmNvZWZzO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgY29uc3QgeCA9IGluRGF0YVtpXTtcbiAgICAgIGNvbnN0IHkgPSBjb2Vmcy5iMCAqIHhcbiAgICAgICAgICAgICAgKyBjb2Vmcy5iMSAqIHN0YXRlLngxW2ldICsgY29lZnMuYjIgKiBzdGF0ZS54MltpXVxuICAgICAgICAgICAgICAtIGNvZWZzLmExICogc3RhdGUueTFbaV0gLSBjb2Vmcy5hMiAqIHN0YXRlLnkyW2ldO1xuXG4gICAgICBvdXREYXRhW2ldID0geTtcblxuICAgICAgLy8gdXBkYXRlIHN0YXRlc1xuICAgICAgc3RhdGUueDJbaV0gPSBzdGF0ZS54MVtpXTtcbiAgICAgIHN0YXRlLngxW2ldID0geDtcbiAgICAgIHN0YXRlLnkyW2ldID0gc3RhdGUueTFbaV07XG4gICAgICBzdGF0ZS55MVtpXSA9IHk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTaWduYWwoZnJhbWUpIHtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3Qgb3V0RGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBjb25zdCBpbkRhdGEgPSBmcmFtZS5kYXRhO1xuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCBjb2VmcyA9IHRoaXMuY29lZnM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCB4ID0gaW5EYXRhW2ldO1xuICAgICAgY29uc3QgeSA9IGNvZWZzLmIwICogeFxuICAgICAgICAgICAgICArIGNvZWZzLmIxICogc3RhdGUueDEgKyBjb2Vmcy5iMiAqIHN0YXRlLngyXG4gICAgICAgICAgICAgIC0gY29lZnMuYTEgKiBzdGF0ZS55MSAtIGNvZWZzLmEyICogc3RhdGUueTI7XG5cbiAgICAgIG91dERhdGFbaV0gPSB5O1xuXG4gICAgICAvLyB1cGRhdGUgc3RhdGVzXG4gICAgICBzdGF0ZS54MiA9IHN0YXRlLngxO1xuICAgICAgc3RhdGUueDEgPSB4O1xuICAgICAgc3RhdGUueTIgPSBzdGF0ZS55MTtcbiAgICAgIHN0YXRlLnkxID0geTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmlxdWFkO1xuIiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcblxuY29uc3Qgc3FydCA9IE1hdGguc3FydDtcbmNvbnN0IGNvcyA9IE1hdGguY29zO1xuY29uc3QgUEkgPSBNYXRoLlBJO1xuXG4vLyBEY3QgVHlwZSAyIC0gb3J0aG9nb25hbCBtYXRyaXggc2NhbGluZ1xuZnVuY3Rpb24gZ2V0RGN0V2VpZ2h0cyhvcmRlciwgTiwgdHlwZSA9ICdodGsnKSB7XG4gIGNvbnN0IHdlaWdodHMgPSBuZXcgRmxvYXQzMkFycmF5KE4gKiBvcmRlcik7XG4gIGNvbnN0IHBpT3Zlck4gPSBQSSAvIE47XG4gIGNvbnN0IHNjYWxlMCA9IDEgLyBzcXJ0KDIpO1xuICBjb25zdCBzY2FsZSA9IHNxcnQoMiAvIE4pO1xuXG4gIGZvciAobGV0IGsgPSAwOyBrIDwgb3JkZXI7IGsrKykge1xuICAgIGNvbnN0IHMgPSAoayA9PT0gMCkgPyAoc2NhbGUwICogc2NhbGUpIDogc2NhbGU7XG4gICAgLy8gY29uc3QgcyA9IHNjYWxlOyAvLyBydGEgZG9lc24ndCBhcHBseSBrPTAgc2NhbGluZ1xuXG4gICAgZm9yIChsZXQgbiA9IDA7IG4gPCBOOyBuKyspXG4gICAgICB3ZWlnaHRzW2sgKiBOICsgbl0gPSBzICogY29zKGsgKiAobiArIDAuNSkgKiBwaU92ZXJOKTtcbiAgfVxuXG4gIHJldHVybiB3ZWlnaHRzO1xufVxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgb3JkZXI6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMTIsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbn07XG5cbi8qKlxuICogQ29tcHV0ZSB0aGUgRGlzY3JldGUgQ29zaW5lIFRyYW5zZm9ybSBvZiBhbiBpbnB1dCBgc2lnbmFsYCBvciBgdmVjdG9yYC5cbiAqIChIVEsgc3R5bGUgd2VpZ2h0aW5nKS5cbiAqXG4gKiBfc3VwcG9ydCBgc3RhbmRhbG9uZWAgdXNhZ2VfXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24ub3BlcmF0b3JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5vcmRlcj0xMl0gLSBOdW1iZXIgb2YgY29tcHV0ZWQgYmlucy5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIC8vIGFzc3VtaW5nIHNvbWUgYXVkaW8gYnVmZmVyXG4gKiBjb25zdCBzb3VyY2UgPSBuZXcgQXVkaW9JbkJ1ZmZlcih7XG4gKiAgIGF1ZGlvQnVmZmVyOiBhdWRpb0J1ZmZlcixcbiAqICAgdXNlV29ya2VyOiBmYWxzZSxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IHNsaWNlciA9IG5ldyBTbGljZXIoe1xuICogICBmcmFtZVNpemU6IDUxMixcbiAqICAgaG9wU2l6ZTogNTEyLFxuICogfSk7XG4gKlxuICogY29uc3QgZGN0ID0gbmV3IERjdCh7XG4gKiAgIG9yZGVyOiAxMixcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGxvZ2dlciA9IG5ldyBsZm8uc2luay5Mb2dnZXIoeyBkYXRhOiB0cnVlIH0pO1xuICpcbiAqIHNvdXJjZS5jb25uZWN0KHNsaWNlcik7XG4gKiBzbGljZXIuY29ubmVjdChkY3QpO1xuICogZGN0LmNvbm5lY3QobG9nZ2VyKTtcbiAqXG4gKiBzb3VyY2Uuc3RhcnQoKTtcbiAqL1xuY2xhc3MgRGN0IGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICBjb25zdCBvcmRlciA9IHRoaXMucGFyYW1zLmdldCgnb3JkZXInKTtcbiAgICBjb25zdCBpbkZyYW1lU2l6ZSA9IHByZXZTdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gb3JkZXI7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3ZlY3Rvcic7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZGVzY3JpcHRpb24gPSBbXTtcblxuICAgIHRoaXMud2VpZ2h0TWF0cml4ID0gZ2V0RGN0V2VpZ2h0cyhvcmRlciwgaW5GcmFtZVNpemUpO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgdGhlIGBEY3RgIG9wZXJhdG9yIGluIGBzdGFuZGFsb25lYCBtb2RlIChpLmUuIG91dHNpZGUgb2YgYSBncmFwaCkuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyAtIElucHV0IHZhbHVlcy5cbiAgICogQHJldHVybiB7QXJyYXl9IC0gRGN0IG9mIHRoZSBpbnB1dCBhcnJheS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3QgZGN0ID0gbmV3IGxmby5vcGVyYXRvci5EY3QoeyBvcmRlcjogMTIgfSk7XG4gICAqIC8vIG1hbmRhdG9yeSBmb3IgdXNlIGluIHN0YW5kYWxvbmUgbW9kZVxuICAgKiBkY3QuaW5pdFN0cmVhbSh7IGZyYW1lU2l6ZTogNTEyLCBmcmFtZVR5cGU6ICdzaWduYWwnIH0pO1xuICAgKiBkY3QuaW5wdXRTaWduYWwoZGF0YSk7XG4gICAqL1xuICBpbnB1dFNpZ25hbCh2YWx1ZXMpIHtcbiAgICBjb25zdCBvcmRlciA9IHRoaXMucGFyYW1zLmdldCgnb3JkZXInKTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB2YWx1ZXMubGVuZ3RoO1xuICAgIGNvbnN0IG91dEZyYW1lID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgIGNvbnN0IHdlaWdodHMgPSB0aGlzLndlaWdodE1hdHJpeDtcblxuICAgIGZvciAobGV0IGsgPSAwOyBrIDwgb3JkZXI7IGsrKykge1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gayAqIGZyYW1lU2l6ZTtcbiAgICAgIG91dEZyYW1lW2tdID0gMDtcblxuICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBmcmFtZVNpemU7IG4rKylcbiAgICAgICAgb3V0RnJhbWVba10gKz0gdmFsdWVzW25dICogd2VpZ2h0c1tvZmZzZXQgKyBuXTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0RnJhbWU7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIHRoaXMuaW5wdXRTaWduYWwoZnJhbWUuZGF0YSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcihmcmFtZSkge1xuICAgIHRoaXMuaW5wdXRTaWduYWwoZnJhbWUuZGF0YSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGN0O1xuIiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcbmltcG9ydCBpbml0V2luZG93IGZyb20gJy4uL3V0aWxzL3dpbmRvd3MnO1xuXG4vLyBodHRwczovL2NvZGUuc291bmRzb2Z0d2FyZS5hYy51ay9wcm9qZWN0cy9qcy1kc3AtdGVzdC9yZXBvc2l0b3J5L2VudHJ5L2ZmdC9uYXl1a2ktb2JqL2ZmdC5qc1xuLypcbiAqIEZyZWUgRmZ0IGFuZCBjb252b2x1dGlvbiAoSmF2YVNjcmlwdClcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgUHJvamVjdCBOYXl1a2lcbiAqIGh0dHA6Ly93d3cubmF5dWtpLmlvL3BhZ2UvZnJlZS1zbWFsbC1mZnQtaW4tbXVsdGlwbGUtbGFuZ3VhZ2VzXG4gKlxuICogKE1JVCBMaWNlbnNlKVxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZlxuICogdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpblxuICogdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0b1xuICogdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2ZcbiAqIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICogLSBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogICBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqIC0gVGhlIFNvZnR3YXJlIGlzIHByb3ZpZGVkIFwiYXMgaXNcIiwgd2l0aG91dCB3YXJyYW50eSBvZiBhbnkga2luZCwgZXhwcmVzcyBvclxuICogICBpbXBsaWVkLCBpbmNsdWRpbmcgYnV0IG5vdCBsaW1pdGVkIHRvIHRoZSB3YXJyYW50aWVzIG9mIG1lcmNoYW50YWJpbGl0eSxcbiAqICAgZml0bmVzcyBmb3IgYSBwYXJ0aWN1bGFyIHB1cnBvc2UgYW5kIG5vbmluZnJpbmdlbWVudC4gSW4gbm8gZXZlbnQgc2hhbGwgdGhlXG4gKiAgIGF1dGhvcnMgb3IgY29weXJpZ2h0IGhvbGRlcnMgYmUgbGlhYmxlIGZvciBhbnkgY2xhaW0sIGRhbWFnZXMgb3Igb3RoZXJcbiAqICAgbGlhYmlsaXR5LCB3aGV0aGVyIGluIGFuIGFjdGlvbiBvZiBjb250cmFjdCwgdG9ydCBvciBvdGhlcndpc2UsIGFyaXNpbmcgZnJvbSxcbiAqICAgb3V0IG9mIG9yIGluIGNvbm5lY3Rpb24gd2l0aCB0aGUgU29mdHdhcmUgb3IgdGhlIHVzZSBvciBvdGhlciBkZWFsaW5ncyBpbiB0aGVcbiAqICAgU29mdHdhcmUuXG4gKlxuICogU2xpZ2h0bHkgcmVzdHJ1Y3R1cmVkIGJ5IENocmlzIENhbm5hbSwgY2FubmFtQGFsbC1kYXktYnJlYWtmYXN0LmNvbVxuICpcbiAqIEBwcml2YXRlXG4gKi9cbi8qXG4gKiBDb25zdHJ1Y3QgYW4gb2JqZWN0IGZvciBjYWxjdWxhdGluZyB0aGUgZGlzY3JldGUgRm91cmllciB0cmFuc2Zvcm0gKERGVCkgb2ZcbiAqIHNpemUgbiwgd2hlcmUgbiBpcyBhIHBvd2VyIG9mIDIuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gRmZ0TmF5dWtpKG4pIHtcblxuICB0aGlzLm4gPSBuO1xuICB0aGlzLmxldmVscyA9IC0xO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMzI7IGkrKykge1xuICAgIGlmICgxIDw8IGkgPT0gbikge1xuICAgICAgdGhpcy5sZXZlbHMgPSBpOyAgLy8gRXF1YWwgdG8gbG9nMihuKVxuICAgIH1cbiAgfVxuXG4gIGlmICh0aGlzLmxldmVscyA9PSAtMSkge1xuICAgIHRocm93IFwiTGVuZ3RoIGlzIG5vdCBhIHBvd2VyIG9mIDJcIjtcbiAgfVxuXG4gIHRoaXMuY29zVGFibGUgPSBuZXcgQXJyYXkobiAvIDIpO1xuICB0aGlzLnNpblRhYmxlID0gbmV3IEFycmF5KG4gLyAyKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG4gLyAyOyBpKyspIHtcbiAgICB0aGlzLmNvc1RhYmxlW2ldID0gTWF0aC5jb3MoMiAqIE1hdGguUEkgKiBpIC8gbik7XG4gICAgdGhpcy5zaW5UYWJsZVtpXSA9IE1hdGguc2luKDIgKiBNYXRoLlBJICogaSAvIG4pO1xuICB9XG5cbiAgLypcbiAgICogQ29tcHV0ZXMgdGhlIGRpc2NyZXRlIEZvdXJpZXIgdHJhbnNmb3JtIChERlQpIG9mIHRoZSBnaXZlbiBjb21wbGV4IHZlY3RvcixcbiAgICogc3RvcmluZyB0aGUgcmVzdWx0IGJhY2sgaW50byB0aGUgdmVjdG9yLlxuICAgKiBUaGUgdmVjdG9yJ3MgbGVuZ3RoIG11c3QgYmUgZXF1YWwgdG8gdGhlIHNpemUgbiB0aGF0IHdhcyBwYXNzZWQgdG8gdGhlXG4gICAqIG9iamVjdCBjb25zdHJ1Y3RvciwgYW5kIHRoaXMgbXVzdCBiZSBhIHBvd2VyIG9mIDIuIFVzZXMgdGhlIENvb2xleS1UdWtleVxuICAgKiBkZWNpbWF0aW9uLWluLXRpbWUgcmFkaXgtMiBhbGdvcml0aG0uXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB0aGlzLmZvcndhcmQgPSBmdW5jdGlvbihyZWFsLCBpbWFnKSB7XG4gICAgdmFyIG4gPSB0aGlzLm47XG5cbiAgICAvLyBCaXQtcmV2ZXJzZWQgYWRkcmVzc2luZyBwZXJtdXRhdGlvblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICB2YXIgaiA9IHJldmVyc2VCaXRzKGksIHRoaXMubGV2ZWxzKTtcblxuICAgICAgaWYgKGogPiBpKSB7XG4gICAgICAgIHZhciB0ZW1wID0gcmVhbFtpXTtcbiAgICAgICAgcmVhbFtpXSA9IHJlYWxbal07XG4gICAgICAgIHJlYWxbal0gPSB0ZW1wO1xuICAgICAgICB0ZW1wID0gaW1hZ1tpXTtcbiAgICAgICAgaW1hZ1tpXSA9IGltYWdbal07XG4gICAgICAgIGltYWdbal0gPSB0ZW1wO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENvb2xleS1UdWtleSBkZWNpbWF0aW9uLWluLXRpbWUgcmFkaXgtMiBGZnRcbiAgICBmb3IgKHZhciBzaXplID0gMjsgc2l6ZSA8PSBuOyBzaXplICo9IDIpIHtcbiAgICAgIHZhciBoYWxmc2l6ZSA9IHNpemUgLyAyO1xuICAgICAgdmFyIHRhYmxlc3RlcCA9IG4gLyBzaXplO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkgKz0gc2l6ZSkge1xuICAgICAgICBmb3IgKHZhciBqID0gaSwgayA9IDA7IGogPCBpICsgaGFsZnNpemU7IGorKywgayArPSB0YWJsZXN0ZXApIHtcbiAgICAgICAgICB2YXIgdHByZSA9ICByZWFsW2oraGFsZnNpemVdICogdGhpcy5jb3NUYWJsZVtrXSArXG4gICAgICAgICAgICAgICAgICAgICAgaW1hZ1tqK2hhbGZzaXplXSAqIHRoaXMuc2luVGFibGVba107XG4gICAgICAgICAgdmFyIHRwaW0gPSAtcmVhbFtqK2hhbGZzaXplXSAqIHRoaXMuc2luVGFibGVba10gK1xuICAgICAgICAgICAgICAgICAgICAgIGltYWdbaitoYWxmc2l6ZV0gKiB0aGlzLmNvc1RhYmxlW2tdO1xuICAgICAgICAgIHJlYWxbaiArIGhhbGZzaXplXSA9IHJlYWxbal0gLSB0cHJlO1xuICAgICAgICAgIGltYWdbaiArIGhhbGZzaXplXSA9IGltYWdbal0gLSB0cGltO1xuICAgICAgICAgIHJlYWxbal0gKz0gdHByZTtcbiAgICAgICAgICBpbWFnW2pdICs9IHRwaW07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm5zIHRoZSBpbnRlZ2VyIHdob3NlIHZhbHVlIGlzIHRoZSByZXZlcnNlIG9mIHRoZSBsb3dlc3QgJ2JpdHMnXG4gICAgLy8gYml0cyBvZiB0aGUgaW50ZWdlciAneCcuXG4gICAgZnVuY3Rpb24gcmV2ZXJzZUJpdHMoeCwgYml0cykge1xuICAgICAgdmFyIHkgPSAwO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJpdHM7IGkrKykge1xuICAgICAgICB5ID0gKHkgPDwgMSkgfCAoeCAmIDEpO1xuICAgICAgICB4ID4+Pj0gMTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHk7XG4gICAgfVxuICB9XG5cbiAgLypcbiAgICogQ29tcHV0ZXMgdGhlIGludmVyc2UgZGlzY3JldGUgRm91cmllciB0cmFuc2Zvcm0gKElERlQpIG9mIHRoZSBnaXZlbiBjb21wbGV4XG4gICAqIHZlY3Rvciwgc3RvcmluZyB0aGUgcmVzdWx0IGJhY2sgaW50byB0aGUgdmVjdG9yLlxuICAgKiBUaGUgdmVjdG9yJ3MgbGVuZ3RoIG11c3QgYmUgZXF1YWwgdG8gdGhlIHNpemUgbiB0aGF0IHdhcyBwYXNzZWQgdG8gdGhlXG4gICAqIG9iamVjdCBjb25zdHJ1Y3RvciwgYW5kIHRoaXMgbXVzdCBiZSBhIHBvd2VyIG9mIDIuIFRoaXMgaXMgYSB3cmFwcGVyXG4gICAqIGZ1bmN0aW9uLiBUaGlzIHRyYW5zZm9ybSBkb2VzIG5vdCBwZXJmb3JtIHNjYWxpbmcsIHNvIHRoZSBpbnZlcnNlIGlzIG5vdFxuICAgKiBhIHRydWUgaW52ZXJzZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHRoaXMuaW52ZXJzZSA9IGZ1bmN0aW9uKHJlYWwsIGltYWcpIHtcbiAgICBmb3J3YXJkKGltYWcsIHJlYWwpO1xuICB9XG59XG5cblxuY29uc3Qgc3FydCA9IE1hdGguc3FydDtcblxuY29uc3QgaXNQb3dlck9mVHdvID0gZnVuY3Rpb24obnVtYmVyKSB7XG4gIHdoaWxlICgobnVtYmVyICUgMiA9PT0gMCkgJiYgbnVtYmVyID4gMSlcbiAgICBudW1iZXIgPSBudW1iZXIgLyAyO1xuXG4gIHJldHVybiBudW1iZXIgPT09IDE7XG59XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBzaXplOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDEwMjQsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgd2luZG93OiB7XG4gICAgdHlwZTogJ2VudW0nLFxuICAgIGxpc3Q6IFsnbm9uZScsICdoYW5uJywgJ2hhbm5pbmcnLCAnaGFtbWluZycsICdibGFja21hbicsICdibGFja21hbmhhcnJpcycsICdzaW5lJywgJ3JlY3RhbmdsZSddLFxuICAgIGRlZmF1bHQ6ICdub25lJyxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBtb2RlOiB7XG4gICAgdHlwZTogJ2VudW0nLFxuICAgIGxpc3Q6IFsnbWFnbml0dWRlJywgJ3Bvd2VyJ10sIC8vIGFkZCBjb21wbGV4IG91dHB1dFxuICAgIGRlZmF1bHQ6ICdtYWduaXR1ZGUnLFxuICB9LFxuICBub3JtOiB7XG4gICAgdHlwZTogJ2VudW0nLFxuICAgIGRlZmF1bHQ6ICdhdXRvJyxcbiAgICBsaXN0OiBbJ2F1dG8nLCAnbm9uZScsICdsaW5lYXInLCAncG93ZXInXSxcbiAgfSxcbn1cblxuLyoqXG4gKiBDb21wdXRlIHRoZSBGYXN0IEZvdXJpZXIgVHJhbnNmb3JtIG9mIGFuIGluY29tbWluZyBgc2lnbmFsYC5cbiAqXG4gKiBGZnQgaW1wbGVtZW50YXRpb24gYnkgW05heXVraV0oaHR0cHM6Ly9jb2RlLnNvdW5kc29mdHdhcmUuYWMudWsvcHJvamVjdHMvanMtZHNwLXRlc3QvcmVwb3NpdG9yeS9lbnRyeS9mZnQvbmF5dWtpLW9iai9mZnQuanMpLlxuICpcbiAqIF9zdXBwb3J0IGBzdGFuZGFsb25lYCB1c2FnZV9cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnNpemU9MTAyNF0gLSBTaXplIG9mIHRoZSBmZnQsIHNob3VsZCBiZSBhIHBvd2VyIG9mIDIuXG4gKiAgSWYgdGhlIGZyYW1lIHNpemUgb2YgdGhlIGluY29tbWluZyBzaWduYWwgaXMgbG93ZXIgdGhhbiB0aGlzIHZhbHVlLFxuICogIGl0IGlzIHplcm8gcGFkZGVkIHRvIG1hdGNoIHRoZSBmZnQgc2l6ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy53aW5kb3c9J25vbmUnXSAtIE5hbWUgb2YgdGhlIHdpbmRvdyBhcHBsaWVkIG9uIHRoZVxuICogIGluY29tbWluZyBzaWduYWwuIEF2YWlsYWJsZSB3aW5kb3dzIGFyZTogJ25vbmUnLCAnaGFubicsICdoYW5uaW5nJyxcbiAqICAnaGFtbWluZycsICdibGFja21hbicsICdibGFja21hbmhhcnJpcycsICdzaW5lJywgJ3JlY3RhbmdsZScuXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubW9kZT0nbWFnbml0dWRlJ10gLSBUeXBlIG9mIHRoZSBvdXRwdXQgKGBtYWduaXR1ZGVgXG4gKiAgb3IgYHBvd2VyYClcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5ub3JtPSdhdXRvJ10gLSBUeXBlIG9mIG5vcm1hbGl6YXRpb24gYXBwbGllZCBvbiB0aGVcbiAqICBvdXRwdXQuIFBvc3NpYmxlIHZhbHVlcyBhcmUgJ2F1dG8nLCAnbm9uZScsICdsaW5lYXInLCAncG93ZXInLiBXaGVuIHNldCB0b1xuICogIGBhdXRvYCwgYSBgbGluZWFyYCBub3JtYWxpemF0aW9uIGlzIGFwcGxpZWQgb24gdGhlIG1hZ25pdHVkZSBzcGVjdHJ1bSwgd2hpbGVcbiAqICBhIGBwb3dlcmAgbm9ybWFsaXphdGlvbiBpcyBhcHBsaWVkIG9uIHRoZSBwb3dlciBzcGVjdHJ1bS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIC8vIGFzc3VtaW5nIGFuIGBhdWRpb0J1ZmZlcmAgZXhpc3RzXG4gKiBjb25zdCBzb3VyY2UgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luQnVmZmVyKHsgYXVkaW9CdWZmZXIgfSk7XG4gKlxuICogY29uc3Qgc2xpY2VyID0gbmV3IGxmby5vcGVyYXRvci5TbGljZXIoe1xuICogICBmcmFtZVNpemU6IDI1NixcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGZmdCA9IG5ldyBsZm8ub3BlcmF0b3IuRmZ0KHtcbiAqICAgbW9kZTogJ3Bvd2VyJyxcbiAqICAgd2luZG93OiAnaGFubicsXG4gKiAgIG5vcm06ICdwb3dlcicsXG4gKiAgIHNpemU6IDI1NixcbiAqIH0pO1xuICpcbiAqIHNvdXJjZS5jb25uZWN0KHNsaWNlcik7XG4gKiBzbGljZXIuY29ubmVjdChmZnQpO1xuICogc291cmNlLnN0YXJ0KCk7XG4gKlxuICogLy8gPiBvdXRwdXRzIDEyOSBiaW5zIGNvbnRhaW5pbmcgdGhlIHZhbHVlcyBvZiB0aGUgcG93ZXIgc3BlY3RydW0gKGluY2x1ZGluZ1xuICogLy8gPiBEQyBhbmQgTnl1aXN0IGZyZXF1ZW5jaWVzKS5cbiAqXG4gKiBAdG9kbyAtIGNoZWNrIGlmICdyZWN0YW5nbGUnIGFuZCAnbm9uZScgd2luZG93cyBhcmUgbm90IHJlZG9uZGFudC5cbiAqIEB0b2RvIC0gY2hlY2sgZGVmYXVsdCB2YWx1ZXMgZm9yIGFsbCBwYXJhbXMuXG4gKi9cbmNsYXNzIEZmdCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLndpbmRvd1NpemUgPSBudWxsO1xuICAgIHRoaXMubm9ybWFsaXplQ29lZnMgPSBudWxsO1xuICAgIHRoaXMud2luZG93ID0gbnVsbDtcbiAgICB0aGlzLnJlYWwgPSBudWxsO1xuICAgIHRoaXMuaW1hZyA9IG51bGw7XG4gICAgdGhpcy5mZnQgPSBudWxsO1xuXG4gICAgaWYgKCFpc1Bvd2VyT2ZUd28odGhpcy5wYXJhbXMuZ2V0KCdzaXplJykpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdmZnRTaXplIG11c3QgYmUgYSBwb3dlciBvZiB0d28nKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG4gICAgLy8gc2V0IHRoZSBvdXRwdXQgZnJhbWUgc2l6ZVxuICAgIGNvbnN0IGluRnJhbWVTaXplID0gcHJldlN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgZmZ0U2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnc2l6ZScpO1xuICAgIGNvbnN0IG1vZGUgPSB0aGlzLnBhcmFtcy5nZXQoJ21vZGUnKTtcbiAgICBjb25zdCBub3JtID0gdGhpcy5wYXJhbXMuZ2V0KCdub3JtJyk7XG4gICAgbGV0IHdpbmRvd05hbWUgPSB0aGlzLnBhcmFtcy5nZXQoJ3dpbmRvdycpO1xuICAgIC8vIHdpbmRvdyBgbm9uZWAgYW5kIGByZWN0YW5nbGVgIGFyZSBhbGlhc2VzXG4gICAgaWYgKHdpbmRvd05hbWUgPT09ICdub25lJylcbiAgICAgIHdpbmRvd05hbWUgPSAncmVjdGFuZ2xlJztcblxuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IGZmdFNpemUgLyAyICsgMTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVR5cGUgPSAndmVjdG9yJztcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5kZXNjcmlwdGlvbiA9IFtdO1xuICAgIC8vIHNpemUgb2YgdGhlIHdpbmRvdyB0byBhcHBseSBvbiB0aGUgaW5wdXQgZnJhbWVcbiAgICB0aGlzLndpbmRvd1NpemUgPSAoaW5GcmFtZVNpemUgPCBmZnRTaXplKSA/IGluRnJhbWVTaXplIDogZmZ0U2l6ZTtcblxuICAgIC8vIHJlZmVyZW5jZXMgdG8gcG9wdWxhdGUgaW4gdGhlIHdpbmRvdyBmdW5jdGlvbnMgKGNmLiBgaW5pdFdpbmRvd2ApXG4gICAgdGhpcy5ub3JtYWxpemVDb2VmcyA9IHsgbGluZWFyOiAwLCBwb3dlcjogMCB9O1xuICAgIHRoaXMud2luZG93ID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLndpbmRvd1NpemUpO1xuXG4gICAgaW5pdFdpbmRvdyhcbiAgICAgIHdpbmRvd05hbWUsICAgICAgICAgLy8gbmFtZSBvZiB0aGUgd2luZG93XG4gICAgICB0aGlzLndpbmRvdywgICAgICAgIC8vIGJ1ZmZlciBwb3B1bGF0ZWQgd2l0aCB0aGUgd2luZG93IHNpZ25hbFxuICAgICAgdGhpcy53aW5kb3dTaXplLCAgICAvLyBzaXplIG9mIHRoZSB3aW5kb3dcbiAgICAgIHRoaXMubm9ybWFsaXplQ29lZnMgLy8gb2JqZWN0IHBvcHVsYXRlZCB3aXRoIHRoZSBub3JtYWxpemF0aW9uIGNvZWZzXG4gICAgKTtcblxuICAgIGNvbnN0IHsgbGluZWFyLCBwb3dlciB9ID0gdGhpcy5ub3JtYWxpemVDb2VmcztcblxuICAgIHN3aXRjaCAobm9ybSkge1xuICAgICAgY2FzZSAnbm9uZSc6XG4gICAgICAgIHRoaXMud2luZG93Tm9ybSA9IDE7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdsaW5lYXInOlxuICAgICAgICB0aGlzLndpbmRvd05vcm0gPSBsaW5lYXI7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdwb3dlcic6XG4gICAgICAgIHRoaXMud2luZG93Tm9ybSA9IHBvd2VyO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnYXV0byc6XG4gICAgICAgIGlmIChtb2RlID09PSAnbWFnbml0dWRlJylcbiAgICAgICAgICB0aGlzLndpbmRvd05vcm0gPSBsaW5lYXI7XG4gICAgICAgIGVsc2UgaWYgKG1vZGUgPT09ICdwb3dlcicpXG4gICAgICAgICAgdGhpcy53aW5kb3dOb3JtID0gcG93ZXI7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMucmVhbCA9IG5ldyBGbG9hdDMyQXJyYXkoZmZ0U2l6ZSk7XG4gICAgdGhpcy5pbWFnID0gbmV3IEZsb2F0MzJBcnJheShmZnRTaXplKTtcbiAgICB0aGlzLmZmdCA9IG5ldyBGZnROYXl1a2koZmZ0U2l6ZSk7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSB0aGUgYEZmdGAgb3BlcmF0b3IgaW4gYHN0YW5kYWxvbmVgIG1vZGUgKGkuZS4gb3V0c2lkZSBvZiBhIGdyYXBoKS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gc2lnbmFsIC0gSW5wdXQgdmFsdWVzLlxuICAgKiBAcmV0dXJuIHtBcnJheX0gLSBGZnQgb2YgdGhlIGlucHV0IHNpZ25hbC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3QgZmZ0ID0gbmV3IGxmby5vcGVyYXRvci5GZnQoeyBzaXplOiA1MTIsIHdpbmRvdzogJ2hhbm4nIH0pO1xuICAgKiAvLyBtYW5kYXRvcnkgZm9yIHVzZSBpbiBzdGFuZGFsb25lIG1vZGVcbiAgICogZmZ0LmluaXRTdHJlYW0oeyBmcmFtZVNpemU6IDI1NiwgZnJhbWVUeXBlOiAnc2lnbmFsJyB9KTtcbiAgICogZmZ0LmlucHV0U2lnbmFsKHNpZ25hbCk7XG4gICAqL1xuICBpbnB1dFNpZ25hbChzaWduYWwpIHtcbiAgICBjb25zdCBtb2RlID0gdGhpcy5wYXJhbXMuZ2V0KCdtb2RlJyk7XG4gICAgY29uc3Qgd2luZG93U2l6ZSA9IHRoaXMud2luZG93U2l6ZTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgZmZ0U2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnc2l6ZScpO1xuICAgIGNvbnN0IG91dERhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG5cbiAgICAvLyBhcHBseSB3aW5kb3cgb24gdGhlIGlucHV0IHNpZ25hbCBhbmQgcmVzZXQgaW1hZyBidWZmZXJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdpbmRvd1NpemU7IGkrKykge1xuICAgICAgdGhpcy5yZWFsW2ldID0gc2lnbmFsW2ldICogdGhpcy53aW5kb3dbaV0gKiB0aGlzLndpbmRvd05vcm07XG4gICAgICB0aGlzLmltYWdbaV0gPSAwO1xuICAgIH1cblxuICAgIC8vIGlmIHJlYWwgaXMgYmlnZ2VyIHRoYW4gaW5wdXQgc2lnbmFsLCBmaWxsIHdpdGggemVyb3NcbiAgICBmb3IgKGxldCBpID0gd2luZG93U2l6ZTsgaSA8IGZmdFNpemU7IGkrKykge1xuICAgICAgdGhpcy5yZWFsW2ldID0gMDtcbiAgICAgIHRoaXMuaW1hZ1tpXSA9IDA7XG4gICAgfVxuXG4gICAgdGhpcy5mZnQuZm9yd2FyZCh0aGlzLnJlYWwsIHRoaXMuaW1hZyk7XG5cbiAgICBpZiAobW9kZSA9PT0gJ21hZ25pdHVkZScpIHtcbiAgICAgIGNvbnN0IG5vcm0gPSAxIC8gZmZ0U2l6ZTtcblxuICAgICAgLy8gREMgaW5kZXhcbiAgICAgIGNvbnN0IHJlYWxEYyA9IHRoaXMucmVhbFswXTtcbiAgICAgIGNvbnN0IGltYWdEYyA9IHRoaXMuaW1hZ1swXTtcbiAgICAgIG91dERhdGFbMF0gPSBzcXJ0KHJlYWxEYyAqIHJlYWxEYyArIGltYWdEYyAqIGltYWdEYykgKiBub3JtO1xuXG4gICAgICAvLyBOcXV5c3QgaW5kZXhcbiAgICAgIGNvbnN0IHJlYWxOeSA9IHRoaXMucmVhbFtmZnRTaXplIC8gMl07XG4gICAgICBjb25zdCBpbWFnTnkgPSB0aGlzLmltYWdbZmZ0U2l6ZSAvIDJdO1xuICAgICAgb3V0RGF0YVtmZnRTaXplIC8gMl0gPSBzcXJ0KHJlYWxOeSAqIHJlYWxOeSArIGltYWdOeSAqIGltYWdOeSkgKiBub3JtO1xuXG4gICAgICAvLyBwb3dlciBzcGVjdHJ1bVxuICAgICAgZm9yIChsZXQgaSA9IDEsIGogPSBmZnRTaXplIC0gMTsgaSA8IGZmdFNpemUgLyAyOyBpKyssIGotLSkge1xuICAgICAgICBjb25zdCByZWFsID0gMC41ICogKHRoaXMucmVhbFtpXSArIHRoaXMucmVhbFtqXSk7XG4gICAgICAgIGNvbnN0IGltYWcgPSAwLjUgKiAodGhpcy5pbWFnW2ldIC0gdGhpcy5pbWFnW2pdKTtcblxuICAgICAgICBvdXREYXRhW2ldID0gMiAqIHNxcnQocmVhbCAqIHJlYWwgKyBpbWFnICogaW1hZykgKiBub3JtO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIGlmIChtb2RlID09PSAncG93ZXInKSB7XG4gICAgICBjb25zdCBub3JtID0gMSAvIChmZnRTaXplICogZmZ0U2l6ZSk7XG5cbiAgICAgIC8vIERDIGluZGV4XG4gICAgICBjb25zdCByZWFsRGMgPSB0aGlzLnJlYWxbMF07XG4gICAgICBjb25zdCBpbWFnRGMgPSB0aGlzLmltYWdbMF07XG4gICAgICBvdXREYXRhWzBdID0gKHJlYWxEYyAqIHJlYWxEYyArIGltYWdEYyAqIGltYWdEYykgKiBub3JtO1xuXG4gICAgICAvLyBOcXV5c3QgaW5kZXhcbiAgICAgIGNvbnN0IHJlYWxOeSA9IHRoaXMucmVhbFtmZnRTaXplIC8gMl07XG4gICAgICBjb25zdCBpbWFnTnkgPSB0aGlzLmltYWdbZmZ0U2l6ZSAvIDJdO1xuICAgICAgb3V0RGF0YVtmZnRTaXplIC8gMl0gPSAocmVhbE55ICogcmVhbE55ICsgaW1hZ055ICogaW1hZ055KSAqIG5vcm07XG5cbiAgICAgIC8vIHBvd2VyIHNwZWN0cnVtXG4gICAgICBmb3IgKGxldCBpID0gMSwgaiA9IGZmdFNpemUgLSAxOyBpIDwgZmZ0U2l6ZSAvIDI7IGkrKywgai0tKSB7XG4gICAgICAgIGNvbnN0IHJlYWwgPSAwLjUgKiAodGhpcy5yZWFsW2ldICsgdGhpcy5yZWFsW2pdKTtcbiAgICAgICAgY29uc3QgaW1hZyA9IDAuNSAqICh0aGlzLmltYWdbaV0gLSB0aGlzLmltYWdbal0pO1xuXG4gICAgICAgIG91dERhdGFbaV0gPSA0ICogKHJlYWwgKiByZWFsICsgaW1hZyAqIGltYWcpICogbm9ybTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb3V0RGF0YTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKGZyYW1lKSB7XG4gICAgdGhpcy5pbnB1dFNpZ25hbChmcmFtZS5kYXRhKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBGZnQ7XG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuXG5jb25zdCBzcXJ0ID0gTWF0aC5zcXJ0O1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgbm9ybWFsaXplOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG4gIHBvd2VyOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9XG59XG5cbi8qKlxuICogQ29tcHV0ZSB0aGUgbWFnbml0dWRlIG9mIGEgYHZlY3RvcmAgaW5wdXQuXG4gKlxuICogX3N1cHBvcnQgYHN0YW5kYWxvbmVgIHVzYWdlX1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5ub3JtYWxpemU9dHJ1ZV0gLSBOb3JtYWxpemUgb3V0cHV0IGFjY29yZGluZyB0b1xuICogIHRoZSB2ZWN0b3Igc2l6ZS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucG93ZXI9ZmFsc2VdIC0gSWYgdHJ1ZSwgcmV0dXJucyB0aGUgc3F1YXJlZFxuICogIG1hZ25pdHVkZSAocG93ZXIpLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY29tbW9uJztcbiAqXG4gKiBjb25zdCBldmVudEluID0gbmV3IGxmby5zb3VyY2UuRXZlbnRJbih7IGZyYW1lU2l6ZTogMiwgZnJhbWVUeXBlOiAndmVjdG9yJyB9KTtcbiAqIGNvbnN0IG1hZ25pdHVkZSA9IG5ldyBsZm8ub3BlcmF0b3IuTWFnbml0dWRlKCk7XG4gKiBjb25zdCBsb2dnZXIgPSBuZXcgbGZvLnNpbmsuTG9nZ2VyKHsgb3V0RnJhbWU6IHRydWUgfSk7XG4gKlxuICogZXZlbnRJbi5jb25uZWN0KG1hZ25pdHVkZSk7XG4gKiBtYWduaXR1ZGUuY29ubmVjdChsb2dnZXIpO1xuICogZXZlbnRJbi5zdGFydCgpO1xuICpcbiAqIGV2ZW50SW4ucHJvY2VzcyhudWxsLCBbMSwgMV0pO1xuICogPiBbMV1cbiAqIGV2ZW50SW4ucHJvY2VzcyhudWxsLCBbMiwgMl0pO1xuICogPiBbMi44Mjg0MjcxMjQ3NV1cbiAqIGV2ZW50SW4ucHJvY2VzcyhudWxsLCBbMywgM10pO1xuICogPiBbNC4yNDI2NDA2ODcxMl1cbiAqL1xuY2xhc3MgTWFnbml0dWRlIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX25vcm1hbGl6ZSA9IHRoaXMucGFyYW1zLmdldCgnbm9ybWFsaXplJyk7XG4gICAgdGhpcy5fcG93ZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ3Bvd2VyJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpIHtcbiAgICBzdXBlci5vblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcyk7XG5cbiAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgIGNhc2UgJ25vcm1hbGl6ZSc6XG4gICAgICAgIHRoaXMuX25vcm1hbGl6ZSA9IHZhbHVlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Bvd2VyJzpcbiAgICAgICAgdGhpcy5fcG93ZXIgPSB2YWx1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSAxO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSA9ICdzY2FsYXInO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmRlc2NyaXB0aW9uID0gWydtYWduaXR1ZGUnXTtcbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSB0aGUgYE1hZ25pdHVkZWAgb3BlcmF0b3IgaW4gYHN0YW5kYWxvbmVgIG1vZGUgKGkuZS4gb3V0c2lkZSBvZiBhIGdyYXBoKS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheXxGbG9hdDMyQXJyYXl9IHZhbHVlcyAtIFZhbHVlcyB0byBwcm9jZXNzLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gTWFnbml0dWRlIHZhbHVlLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gICAqXG4gICAqIGNvbnN0IG1hZ25pdHVkZSA9IG5ldyBsZm8ub3BlcmF0b3IuTWFnbml0dWRlKHsgcG93ZXI6IHRydWUgfSk7XG4gICAqIG1hZ25pdHVkZS5pbml0U3RyZWFtKHsgZnJhbWVUeXBlOiAndmVjdG9yJywgZnJhbWVTaXplOiAzIH0pO1xuICAgKiBtYWduaXR1ZGUuaW5wdXRWZWN0b3IoWzMsIDNdKTtcbiAgICogPiA0LjI0MjY0MDY4NzEyXG4gICAqL1xuICBpbnB1dFZlY3Rvcih2YWx1ZXMpIHtcbiAgICBjb25zdCBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoO1xuICAgIGxldCBzdW0gPSAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKylcbiAgICAgIHN1bSArPSAodmFsdWVzW2ldICogdmFsdWVzW2ldKTtcblxuICAgIGxldCBtYWcgPSBzdW07XG5cbiAgICBpZiAodGhpcy5fbm9ybWFsaXplKVxuICAgICAgbWFnIC89IGxlbmd0aDtcblxuICAgIGlmICghdGhpcy5fcG93ZXIpXG4gICAgICBtYWcgPSBzcXJ0KG1hZyk7XG5cbiAgICByZXR1cm4gbWFnO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUpIHtcbiAgICB0aGlzLmZyYW1lLmRhdGFbMF0gPSB0aGlzLmlucHV0VmVjdG9yKGZyYW1lLmRhdGEpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hZ25pdHVkZTtcbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5cbmNvbnN0IHNxcnQgPSBNYXRoLnNxcnQ7XG5cbi8qKlxuICogQ29tcHV0ZSBtZWFuIGFuZCBzdGFuZGFyZCBkZXZpYXRpb24gb2YgYSBnaXZlbiBgc2lnbmFsYC5cbiAqXG4gKiBfc3VwcG9ydCBgc3RhbmRhbG9uZWAgdXNhZ2VfXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24ub3BlcmF0b3JcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIGNvbnN0IGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAqXG4gKiBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXG4gKiAgIC5nZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSB9KVxuICogICAudGhlbihpbml0KVxuICogICAuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcbiAqXG4gKiBmdW5jdGlvbiBpbml0KHN0cmVhbSkge1xuICogICBjb25zdCBzb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlTWVkaWFTdHJlYW1Tb3VyY2Uoc3RyZWFtKTtcbiAqXG4gKiAgIGNvbnN0IGF1ZGlvSW5Ob2RlID0gbmV3IGxmby5zb3VyY2UuQXVkaW9Jbk5vZGUoe1xuICogICAgIHNvdXJjZU5vZGU6IHNvdXJjZSxcbiAqICAgICBhdWRpb0NvbnRleHQ6IGF1ZGlvQ29udGV4dCxcbiAqICAgfSk7XG4gKlxuICogICBjb25zdCBtZWFuU3RkZGV2ID0gbmV3IGxmby5vcGVyYXRvci5NZWFuU3RkZGV2KCk7XG4gKlxuICogICBjb25zdCB0cmFjZURpc3BsYXkgPSBuZXcgbGZvLnNpbmsuVHJhY2VEaXNwbGF5KHtcbiAqICAgICBjYW52YXM6ICcjdHJhY2UnLFxuICogICB9KTtcbiAqXG4gKiAgIGF1ZGlvSW5Ob2RlLmNvbm5lY3QobWVhblN0ZGRldik7XG4gKiAgIG1lYW5TdGRkZXYuY29ubmVjdCh0cmFjZURpc3BsYXkpO1xuICogICBhdWRpb0luTm9kZS5zdGFydCgpO1xuICogfVxuICovXG5jbGFzcyBNZWFuU3RkZGV2IGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIC8vIG5vIG9wdGlvbnMgYXZhaWxhYmxlLCBqdXN0IHRocm93IGFuIGVycm9yIGlmIHNvbWUgcGFyYW0gdHJ5IHRvIGJlIHNldC5cbiAgICBzdXBlcih7fSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3ZlY3Rvcic7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gMjtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5kZXNjcmlwdGlvbiA9IFsnbWVhbicsICdzdGRkZXYnXTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIHRoZSBgTWVhblN0ZGRldmAgb3BlcmF0b3IgaW4gYHN0YW5kYWxvbmVgIG1vZGUgKGkuZS4gb3V0c2lkZSBvZiBhIGdyYXBoKS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheXxGbG9hdDMyQXJyYXl9IHZhbHVlcyAtIFZhbHVlcyB0byBwcm9jZXNzLlxuICAgKiBAcmV0dXJuIHtBcnJheX0gLSBNZWFuIGFuZCBzdGFuZGFydCBkZXZpYXRpb24gb2YgdGhlIGlucHV0IHZhbHVlcy5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICAgKlxuICAgKiBjb25zdCBtZWFuU3RkZGV2ID0gbmV3IGxmby5vcGVyYXRvci5NZWFuU3RkZGV2KCk7XG4gICAqIG1lYW5TdGRkZXYuaW5pdFN0cmVhbSh7IGZyYW1lVHlwZTogJ3ZlY3RvcicsIGZyYW1lU2l6ZTogMTAyNCB9KTtcbiAgICogbWVhblN0ZGRldi5pbnB1dFZlY3Rvcihzb21lU2luZVNpZ25hbCk7XG4gICAqID4gWzAsIDAuNzA3MV1cbiAgICovXG4gIGlucHV0U2lnbmFsKHZhbHVlcykge1xuICAgIGNvbnN0IG91dERhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3QgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aDtcblxuICAgIGxldCBtZWFuID0gMDtcbiAgICBsZXQgbTIgPSAwO1xuXG4gICAgLy8gY29tcHV0ZSBtZWFuIGFuZCB2YXJpYW5jZSB3aXRoIFdlbGZvcmQgYWxnb3JpdGhtXG4gICAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQWxnb3JpdGhtc19mb3JfY2FsY3VsYXRpbmdfdmFyaWFuY2VcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCB4ID0gdmFsdWVzW2ldO1xuICAgICAgY29uc3QgZGVsdGEgPSB4IC0gbWVhbjtcbiAgICAgIG1lYW4gKz0gZGVsdGEgLyAoaSArIDEpO1xuICAgICAgbTIgKz0gZGVsdGEgKiAoeCAtIG1lYW4pO1xuICAgIH1cblxuICAgIGNvbnN0IHZhcmlhbmNlID0gbTIgLyAobGVuZ3RoIC0gMSk7XG4gICAgY29uc3Qgc3RkZGV2ID0gc3FydCh2YXJpYW5jZSk7XG5cbiAgICBvdXREYXRhWzBdID0gbWVhbjtcbiAgICBvdXREYXRhWzFdID0gc3RkZGV2O1xuXG4gICAgcmV0dXJuIG91dERhdGE7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIHRoaXMuaW5wdXRTaWduYWwoZnJhbWUuZGF0YSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWVhblN0ZGRldjtcbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5cbmNvbnN0IG1pbiA9IE1hdGgubWluO1xuY29uc3QgbWF4ID0gTWF0aC5tYXg7XG5jb25zdCBwb3cgPSBNYXRoLnBvdztcbmNvbnN0IGxvZzEwID0gTWF0aC5sb2cxMDtcblxuZnVuY3Rpb24gaGVydHpUb01lbEh0ayhmcmVxSHopIHtcbiAgcmV0dXJuIDI1OTUgKiBNYXRoLmxvZzEwKDEgKyAoZnJlcUh6IC8gNzAwKSk7XG59XG5cbmZ1bmN0aW9uIG1lbFRvSGVydHpIdGsoZnJlcU1lbCkge1xuICByZXR1cm4gNzAwICogKE1hdGgucG93KDEwLCBmcmVxTWVsIC8gMjU5NSkgLSAxKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZGVzY3JpcHRpb24gb2YgdGhlIHdlaWdodHMgdG8gYXBwbHkgb24gdGhlIGZmdCBiaW5zIGZvciBlYWNoXG4gKiBNZWwgYmFuZCBmaWx0ZXIuXG4gKiBAbm90ZSAtIGFkYXB0ZWQgZnJvbSBpbXRyLXRvb2xzL3J0YVxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBuYnJCaW5zIC0gTnVtYmVyIG9mIGZmdCBiaW5zLlxuICogQHBhcmFtIHtOdW1iZXJ9IG5ickZpbHRlciAtIE51bWJlciBvZiBtZWwgZmlsdGVycy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBzYW1wbGVSYXRlIC0gU2FtcGxlIFJhdGUgb2YgdGhlIHNpZ25hbC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBtaW5GcmVxIC0gTWluaW11bSBGcmVxdWVuY3kgdG8gYmUgY29uc2lkZXJlcmVkLlxuICogQHBhcmFtIHtOdW1iZXJ9IG1heEZyZXEgLSBNYXhpbXVtIGZyZXF1ZW5jeSB0byBjb25zaWRlci5cbiAqIEByZXR1cm4ge0FycmF5PE9iamVjdD59IC0gRGVzY3JpcHRpb24gb2YgdGhlIHdlaWdodHMgdG8gYXBwbHkgb24gdGhlIGJpbnMgZm9yXG4gKiAgZWFjaCBtZWwgZmlsdGVyLiBFYWNoIGRlc2NyaXB0aW9uIGhhcyB0aGUgZm9sbG93aW5nIHN0cnVjdHVyZTpcbiAqICB7IHN0YXJ0SW5kZXg6IGJpbkluZGV4LCBjZW50ZXJGcmVxOiBiaW5DZW50ZXJGcmVxdWVuY3ksIHdlaWdodHM6IFtdIH1cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBnZXRNZWxCYW5kV2VpZ2h0cyhuYnJCaW5zLCBuYnJCYW5kcywgc2FtcGxlUmF0ZSwgbWluRnJlcSwgbWF4RnJlcSwgdHlwZSA9ICdodGsnKSB7XG5cbiAgbGV0IGhlcnR6VG9NZWwgPSBudWxsO1xuICBsZXQgbWVsVG9IZXJ0eiA9IG51bGw7XG4gIGxldCBtaW5NZWw7XG4gIGxldCBtYXhNZWw7XG5cbiAgaWYgKHR5cGUgPT09ICdodGsnKSB7XG4gICAgaGVydHpUb01lbCA9IGhlcnR6VG9NZWxIdGs7XG4gICAgbWVsVG9IZXJ0eiA9IG1lbFRvSGVydHpIdGs7XG4gICAgbWluTWVsID0gaGVydHpUb01lbChtaW5GcmVxKTtcbiAgICBtYXhNZWwgPSBoZXJ0elRvTWVsKG1heEZyZXEpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBtZWwgYmFuZCB0eXBlOiBcIiR7dHlwZX1cImApO1xuICB9XG5cbiAgY29uc3QgbWVsQmFuZERlc2NyaXB0aW9ucyA9IG5ldyBBcnJheShuYnJCYW5kcyk7XG4gIC8vIGNlbnRlciBmcmVxdWVuY2llcyBvZiBGZnQgYmluc1xuICBjb25zdCBmZnRGcmVxcyA9IG5ldyBGbG9hdDMyQXJyYXkobmJyQmlucyk7XG4gIC8vIGNlbnRlciBmcmVxdWVuY2llcyBvZiBtZWwgYmFuZHMgLSB1bmlmb3JtbHkgc3BhY2VkIGluIG1lbCBkb21haW4gYmV0d2VlblxuICAvLyBsaW1pdHMsIHRoZXJlIGFyZSAyIG1vcmUgZnJlcXVlbmNpZXMgdGhhbiB0aGUgYWN0dWFsIG51bWJlciBvZiBmaWx0ZXJzIGluXG4gIC8vIG9yZGVyIHRvIGNhbGN1bGF0ZSB0aGUgc2xvcGVzXG4gIGNvbnN0IGZpbHRlckZyZXFzID0gbmV3IEZsb2F0MzJBcnJheShuYnJCYW5kcyArIDIpO1xuXG4gIGNvbnN0IGZmdFNpemUgPSAobmJyQmlucyAtIDEpICogMjtcbiAgLy8gY29tcHV0ZSBiaW5zIGNlbnRlciBmcmVxdWVuY2llc1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5ickJpbnM7IGkrKylcbiAgICBmZnRGcmVxc1tpXSA9IHNhbXBsZVJhdGUgKiBpIC8gZmZ0U2l6ZTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG5ickJhbmRzICsgMjsgaSsrKVxuICAgIGZpbHRlckZyZXFzW2ldID0gbWVsVG9IZXJ0eihtaW5NZWwgKyBpIC8gKG5ickJhbmRzICsgMSkgKiAobWF4TWVsIC0gbWluTWVsKSk7XG5cbiAgLy8gbG9vcCB0aHJvdWdodCBmaWx0ZXJzXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbmJyQmFuZHM7IGkrKykge1xuICAgIGxldCBtaW5XZWlnaHRJbmRleERlZmluZWQgPSAwO1xuXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSB7XG4gICAgICBzdGFydEluZGV4OiBudWxsLFxuICAgICAgY2VudGVyRnJlcTogbnVsbCxcbiAgICAgIHdlaWdodHM6IFtdLFxuICAgIH1cblxuICAgIC8vIGRlZmluZSBjb250cmlidXRpb24gb2YgZWFjaCBiaW4gZm9yIHRoZSBmaWx0ZXIgYXQgaW5kZXggKGkgKyAxKVxuICAgIC8vIGRvIG5vdCBwcm9jZXNzIHRoZSBsYXN0IHNwZWN0cnVtIGNvbXBvbmVudCAoTnlxdWlzdClcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5ickJpbnMgLSAxOyBqKyspIHtcbiAgICAgIGNvbnN0IHBvc1Nsb3BlQ29udHJpYiA9IChmZnRGcmVxc1tqXSAtIGZpbHRlckZyZXFzW2ldKSAvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZmlsdGVyRnJlcXNbaSsxXSAtIGZpbHRlckZyZXFzW2ldKTtcblxuICAgICAgY29uc3QgbmVnU2xvcGVDb250cmliID0gKGZpbHRlckZyZXFzW2krMl0gLSBmZnRGcmVxc1tqXSkgL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZpbHRlckZyZXFzW2krMl0gLSBmaWx0ZXJGcmVxc1tpKzFdKTtcbiAgICAgIC8vIGxvd2VyU2xvcGUgYW5kIHVwcGVyIHNsb3BlIGludGVyc2VjdCBhdCB6ZXJvIGFuZCB3aXRoIGVhY2ggb3RoZXJcbiAgICAgIGNvbnN0IGNvbnRyaWJ1dGlvbiA9IG1heCgwLCBtaW4ocG9zU2xvcGVDb250cmliLCBuZWdTbG9wZUNvbnRyaWIpKTtcblxuICAgICAgaWYgKGNvbnRyaWJ1dGlvbiA+IDApIHtcbiAgICAgICAgaWYgKGRlc2NyaXB0aW9uLnN0YXJ0SW5kZXggPT09IG51bGwpIHtcbiAgICAgICAgICBkZXNjcmlwdGlvbi5zdGFydEluZGV4ID0gajtcbiAgICAgICAgICBkZXNjcmlwdGlvbi5jZW50ZXJGcmVxID0gZmlsdGVyRnJlcXNbaSsxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlc2NyaXB0aW9uLndlaWdodHMucHVzaChjb250cmlidXRpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGVtcHR5IGZpbHRlclxuICAgIGlmIChkZXNjcmlwdGlvbi5zdGFydEluZGV4ID09PSBudWxsKSB7XG4gICAgICBkZXNjcmlwdGlvbi5zdGFydEluZGV4ID0gMDtcbiAgICAgIGRlc2NyaXB0aW9uLmNlbnRlckZyZXEgPSAwO1xuICAgIH1cblxuICAgIC8vIEB0b2RvIC0gZG8gc29tZSBzY2FsaW5nIGZvciBTbGFuZXktc3R5bGUgbWVsXG4gICAgbWVsQmFuZERlc2NyaXB0aW9uc1tpXSA9IGRlc2NyaXB0aW9uO1xuICB9XG5cbiAgcmV0dXJuIG1lbEJhbmREZXNjcmlwdGlvbnM7XG59XG5cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGxvZzoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBuYnJCYW5kczoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAyNCxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBtaW5GcmVxOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiAwLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIG1heEZyZXE6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgcG93ZXI6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbn07XG5cblxuLyoqXG4gKiBDb21wdXRlIHRoZSBtZWwgYmFuZHMgc3BlY3RydW0gZnJvbSBhIGdpdmVuIHNwZWN0cnVtIChgdmVjdG9yYCB0eXBlKS5cbiAqIF9JbXBsZW1lbnQgdGhlIGBodGtgIG1lbCBiYW5kIHN0eWxlLl9cbiAqXG4gKiBfc3VwcG9ydCBgc3RhbmRhbG9uZWAgdXNhZ2VfXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24ub3BlcmF0b3JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMubG9nPWZhbHNlXSAtIEFwcGx5IGEgbG9nYXJpdGhtaWMgc2NhbGUgb24gdGhlIG91dHB1dC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5uYnJCYW5kcz0yNF0gLSBOdW1iZXIgb2YgZmlsdGVycyBkZWZpbmluZyB0aGUgbWVsXG4gKiAgYmFuZHMuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWluRnJlcT0wXSAtIE1pbmltdW0gZnJlcXVlbmN5IHRvIGNvbnNpZGVyLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1heEZyZXE9bnVsbF0gLSBNYXhpbXVtIGZyZXF1ZW5jeSB0byBjb25zaWRlci5cbiAqICBJZiBgbnVsbGAsIGlzIHNldCB0byBOeXF1aXN0IGZyZXF1ZW5jeS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5wb3dlcj0xXSAtIEFwcGx5IGEgcG93ZXIgc2NhbGluZyBvbiBlYWNoIG1lbCBiYW5kLlxuICpcbiAqIEB0b2RvIC0gaW1wbGVtZW50IFNsYW5leSBzdHlsZSBtZWwgYmFuZHNcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IGxmbyBmcm9tICd3YXZlcy1sZm8vbm9kZSdcbiAqXG4gKiAvLyByZWFkIGEgZmlsZSBmcm9tIHBhdGggKG5vZGUgb25seSBzb3VyY2UpXG4gKiBjb25zdCBhdWRpb0luRmlsZSA9IG5ldyBsZm8uc291cmNlLkF1ZGlvSW5GaWxlKHtcbiAqICAgZmlsZW5hbWU6ICdwYXRoL3RvL2ZpbGUnLFxuICogICBmcmFtZVNpemU6IDUxMixcbiAqIH0pO1xuICpcbiAqIGNvbnN0IHNsaWNlciA9IG5ldyBsZm8ub3BlcmF0b3IuU2xpY2VyKHtcbiAqICAgZnJhbWVTaXplOiAyNTYsXG4gKiAgIGhvcFNpemU6IDI1NixcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGZmdCA9IG5ldyBsZm8ub3BlcmF0b3IuRmZ0KHtcbiAqICAgc2l6ZTogMTAyNCxcbiAqICAgd2luZG93OiAnaGFubicsXG4gKiAgIG1vZGU6ICdwb3dlcicsXG4gKiAgIG5vcm06ICdwb3dlcicsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBtZWwgPSBuZXcgbGZvLm9wZXJhdG9yLk1lbCh7XG4gKiAgIGxvZzogdHJ1ZSxcbiAqICAgbmJyQmFuZHM6IDI0LFxuICogfSk7XG4gKlxuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IGRhdGE6IHRydWUgfSk7XG4gKlxuICogYXVkaW9JbkZpbGUuY29ubmVjdChzbGljZXIpO1xuICogc2xpY2VyLmNvbm5lY3QoZmZ0KTtcbiAqIGZmdC5jb25uZWN0KG1lbCk7XG4gKiBtZWwuY29ubmVjdChsb2dnZXIpO1xuICpcbiAqIGF1ZGlvSW5GaWxlLnN0YXJ0KCk7XG4gKi9cbmNsYXNzIE1lbCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgY29uc3QgbmJyQmlucyA9IHByZXZTdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IG5ickJhbmRzID0gdGhpcy5wYXJhbXMuZ2V0KCduYnJCYW5kcycpO1xuICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuICAgIGNvbnN0IG1pbkZyZXEgPSB0aGlzLnBhcmFtcy5nZXQoJ21pbkZyZXEnKTtcbiAgICBsZXQgbWF4RnJlcSA9IHRoaXMucGFyYW1zLmdldCgnbWF4RnJlcScpO1xuXG4gICAgLy9cbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSBuYnJCYW5kcztcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVR5cGUgPSAndmVjdG9yJztcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5kZXNjcmlwdGlvbiA9IFtdO1xuXG4gICAgaWYgKG1heEZyZXEgPT09IG51bGwpXG4gICAgICBtYXhGcmVxID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSAvIDI7XG5cbiAgICB0aGlzLm1lbEJhbmREZXNjcmlwdGlvbnMgPSBnZXRNZWxCYW5kV2VpZ2h0cyhuYnJCaW5zLCBuYnJCYW5kcywgc2FtcGxlUmF0ZSwgbWluRnJlcSwgbWF4RnJlcSk7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSB0aGUgYE1lbGAgb3BlcmF0b3IgaW4gYHN0YW5kYWxvbmVgIG1vZGUgKGkuZS4gb3V0c2lkZSBvZiBhIGdyYXBoKS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gc3BlY3RydW0gLSBGZnQgYmlucy5cbiAgICogQHJldHVybiB7QXJyYXl9IC0gTWVsIGJhbmRzLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjb25zdCBtZWwgPSBuZXcgbGZvLm9wZXJhdG9yLk1lbCh7IG5ickJhbmRzOiAyNCB9KTtcbiAgICogLy8gbWFuZGF0b3J5IGZvciB1c2UgaW4gc3RhbmRhbG9uZSBtb2RlXG4gICAqIG1lbC5pbml0U3RyZWFtKHsgZnJhbWVTaXplOiAyNTYsIGZyYW1lVHlwZTogJ3ZlY3RvcicsIHNvdXJjZVNhbXBsZVJhdGU6IDQ0MTAwIH0pO1xuICAgKiBtZWwuaW5wdXRWZWN0b3IoZmZ0Qmlucyk7XG4gICAqL1xuICBpbnB1dFZlY3RvcihiaW5zKSB7XG5cbiAgICBjb25zdCBwb3dlciA9IHRoaXMucGFyYW1zLmdldCgncG93ZXInKTtcbiAgICBjb25zdCBsb2cgPSB0aGlzLnBhcmFtcy5nZXQoJ2xvZycpO1xuICAgIGNvbnN0IG1lbEJhbmRzID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgIGNvbnN0IG5ickJhbmRzID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGxldCBzY2FsZSA9IDE7XG5cbiAgICBjb25zdCBtaW5Mb2dWYWx1ZSA9IDFlLTQ4O1xuICAgIGNvbnN0IG1pbkxvZyA9IC00ODA7XG5cbiAgICBpZiAobG9nKVxuICAgICAgc2NhbGUgKj0gbmJyQmFuZHM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ickJhbmRzOyBpKyspIHtcbiAgICAgIGNvbnN0IHsgc3RhcnRJbmRleCwgd2VpZ2h0cyB9ID0gdGhpcy5tZWxCYW5kRGVzY3JpcHRpb25zW2ldO1xuICAgICAgbGV0IHZhbHVlID0gMDtcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB3ZWlnaHRzLmxlbmd0aDsgaisrKVxuICAgICAgICB2YWx1ZSArPSB3ZWlnaHRzW2pdICogYmluc1tzdGFydEluZGV4ICsgal07XG5cbiAgICAgIC8vIGFwcGx5IHNhbWUgbG9naWMgYXMgaW4gUGlQb0JhbmRzXG4gICAgICBpZiAoc2NhbGUgIT09IDEpXG4gICAgICAgIHZhbHVlICo9IHNjYWxlO1xuXG4gICAgICBpZiAobG9nKSB7XG4gICAgICAgIGlmICh2YWx1ZSA+IG1pbkxvZ1ZhbHVlKVxuICAgICAgICAgIHZhbHVlID0gMTAgKiBsb2cxMCh2YWx1ZSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB2YWx1ZSA9IG1pbkxvZztcbiAgICAgIH1cblxuICAgICAgaWYgKHBvd2VyICE9PSAxKVxuICAgICAgICB2YWx1ZSA9IHBvdyh2YWx1ZSwgcG93ZXIpO1xuXG4gICAgICBtZWxCYW5kc1tpXSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBtZWxCYW5kcztcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKGZyYW1lKSB7XG4gICAgdGhpcy5pbnB1dFZlY3RvcihmcmFtZS5kYXRhKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNZWw7XG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuaW1wb3J0IEZmdCBmcm9tICcuL0ZmdCc7XG5pbXBvcnQgTWVsIGZyb20gJy4vTWVsJztcbmltcG9ydCBEY3QgZnJvbSAnLi9EY3QnO1xuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBuYnJCYW5kczoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAyNCxcbiAgICBtZXRhOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIG5ickNvZWZzOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDEyLFxuICAgIG1ldGE6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgbWluRnJlcToge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogMCxcbiAgICBtZXRhOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIG1heEZyZXE6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YTogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9XG59O1xuXG5cbi8qKlxuICogQ29tcHV0ZSB0aGUgTWZjYyBvZiB0aGUgaW5jb21taW5nIGBzaWduYWxgLiBJcyBiYXNpY2FsbHkgYSB3cmFwcGVyIGFyb3VuZFxuICogW2BGZnRgXXtAbGluayBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yLkZmdH0sIFtgTWVsYF17QGxpbmsgbW9kdWxlOmNvbW1vbi5vcGVyYXRvci5NZWx9XG4gKiBhbmQgW2BEY3RgXXtAbGluayBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yLkRjdH0uXG4gKlxuICogX3N1cHBvcnQgYHN0YW5kYWxvbmVgIHVzYWdlX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge25ickJhbmRzfSBbb3B0aW9ucy5uYnJCYW5kcz0yNF0gLSBOdW1iZXIgb2YgTWVsIGJhbmRzLlxuICogQHBhcmFtIHtuYnJDb2Vmc30gW29wdGlvbnMubmJyQ29lZnM9MTJdIC0gTnVtYmVyIG9mIG91dHB1dCBjb2Vmcy5cbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yLkZmdH1cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24ub3BlcmF0b3IuTWVsfVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5vcGVyYXRvci5EY3R9XG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCBsZm8gZnJvbSAnd2F2ZXMtbGZvL25vZGUnXG4gKlxuICogY29uc3QgYXVkaW9JbkZpbGUgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luRmlsZSh7XG4gKiAgIGZpbGVuYW1lOiAncGF0aC90by9maWxlJyxcbiAqICAgZnJhbWVTaXplOiA1MTIsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBzbGljZXIgPSBuZXcgbGZvLm9wZXJhdG9yLlNsaWNlcih7XG4gKiAgIGZyYW1lU2l6ZTogMjU2LFxuICogfSk7XG4gKlxuICogY29uc3QgbWZjYyA9IG5ldyBsZm8ub3BlcmF0b3IuTWZjYyh7XG4gKiAgIG5ickJhbmRzOiAyNCxcbiAqICAgbmJyQ29lZnM6IDEyLFxuICogfSk7XG4gKlxuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IGRhdGE6IHRydWUgfSk7XG4gKlxuICogYXVkaW9JbkZpbGUuY29ubmVjdChzbGljZXIpO1xuICogc2xpY2VyLmNvbm5lY3QobWZjYyk7XG4gKiBtZmNjLmNvbm5lY3QobG9nZ2VyKTtcbiAqXG4gKiBhdWRpb0luRmlsZS5zdGFydCgpO1xuICovXG5jbGFzcyBNZmNjIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgY29uc3QgbmJyQmFuZHMgPSB0aGlzLnBhcmFtcy5nZXQoJ25ickJhbmRzJyk7XG4gICAgY29uc3QgbmJyQ29lZnMgPSB0aGlzLnBhcmFtcy5nZXQoJ25ickNvZWZzJyk7XG4gICAgY29uc3QgbWluRnJlcSA9IHRoaXMucGFyYW1zLmdldCgnbWluRnJlcScpO1xuICAgIGNvbnN0IG1heEZyZXEgPSB0aGlzLnBhcmFtcy5nZXQoJ21heEZyZXEnKTtcbiAgICBjb25zdCBpbnB1dEZyYW1lU2l6ZSA9IHByZXZTdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IGlucHV0RnJhbWVSYXRlID0gcHJldlN0cmVhbVBhcmFtcy5mcmFtZVJhdGU7XG4gICAgY29uc3QgaW5wdXRTYW1wbGVSYXRlID0gcHJldlN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuICAgIGNvbnN0IG5ickJpbnMgPSBpbnB1dEZyYW1lU2l6ZSAvIDIgKyAxO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gbmJyQ29lZnM7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3ZlY3Rvcic7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZGVzY3JpcHRpb24gPSBbXTtcblxuICAgIHRoaXMuZmZ0ID0gbmV3IEZmdCh7XG4gICAgICB3aW5kb3c6ICdoYW5uJyxcbiAgICAgIG1vZGU6ICdwb3dlcicsXG4gICAgICBub3JtOiAncG93ZXInLFxuICAgICAgc2l6ZTogaW5wdXRGcmFtZVNpemUsXG4gICAgfSk7XG5cbiAgICB0aGlzLm1lbCA9IG5ldyBNZWwoe1xuICAgICAgbmJyQmFuZHM6IG5ickJhbmRzLFxuICAgICAgbG9nOiB0cnVlLFxuICAgICAgcG93ZXI6IDEsXG4gICAgICBtaW5GcmVxOiBtaW5GcmVxLFxuICAgICAgbWF4RnJlcTogbWF4RnJlcSxcbiAgICB9KTtcblxuICAgIHRoaXMuZGN0ID0gbmV3IERjdCh7XG4gICAgICBvcmRlcjogbmJyQ29lZnMsXG4gICAgfSk7XG5cbiAgICAvLyBpbml0IHN0cmVhbXNcbiAgICB0aGlzLmZmdC5pbml0U3RyZWFtKHtcbiAgICAgIGZyYW1lVHlwZTogJ3NpZ25hbCcsXG4gICAgICBmcmFtZVNpemU6IGlucHV0RnJhbWVTaXplLFxuICAgICAgZnJhbWVSYXRlOiBpbnB1dEZyYW1lUmF0ZSxcbiAgICAgIHNvdXJjZVNhbXBsZVJhdGU6IGlucHV0U2FtcGxlUmF0ZSxcbiAgICB9KTtcblxuICAgIHRoaXMubWVsLmluaXRTdHJlYW0oe1xuICAgICAgZnJhbWVUeXBlOiAndmVjdG9yJyxcbiAgICAgIGZyYW1lU2l6ZTogbmJyQmlucyxcbiAgICAgIGZyYW1lUmF0ZTogaW5wdXRGcmFtZVJhdGUsXG4gICAgICBzb3VyY2VTYW1wbGVSYXRlOiBpbnB1dFNhbXBsZVJhdGUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmRjdC5pbml0U3RyZWFtKHtcbiAgICAgIGZyYW1lVHlwZTogJ3ZlY3RvcicsXG4gICAgICBmcmFtZVNpemU6IG5ickJhbmRzLFxuICAgICAgZnJhbWVSYXRlOiBpbnB1dEZyYW1lUmF0ZSxcbiAgICAgIHNvdXJjZVNhbXBsZVJhdGU6IGlucHV0U2FtcGxlUmF0ZSxcbiAgICB9KTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIHRoZSBgTWZjY2Agb3BlcmF0b3IgaW4gYHN0YW5kYWxvbmVgIG1vZGUgKGkuZS4gb3V0c2lkZSBvZiBhIGdyYXBoKS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gZGF0YSAtIFNpZ25hbCBjaHVuayB0byBhbmFseXNlLlxuICAgKiBAcmV0dXJuIHtBcnJheX0gLSBNZmNjIGNvZWZmaWNpZW50cy5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3QgbWZjYyA9IG5ldyBsZm8ub3BlcmF0b3IuTWZjYygpO1xuICAgKiAvLyBtYW5kYXRvcnkgZm9yIHVzZSBpbiBzdGFuZGFsb25lIG1vZGVcbiAgICogbWZjYy5pbml0U3RyZWFtKHsgZnJhbWVTaXplOiAyNTYsIGZyYW1lVHlwZTogJ3ZlY3RvcicgfSk7XG4gICAqIG1mY2MuaW5wdXRTaWduYWwoc2lnbmFsKTtcbiAgICovXG4gIGlucHV0U2lnbmFsKGRhdGEpIHtcbiAgICBjb25zdCBvdXRwdXQgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3QgbmJyQ29lZnMgPSB0aGlzLnBhcmFtcy5nZXQoJ25ickNvZWZzJyk7XG5cbiAgICBjb25zdCBiaW5zID0gdGhpcy5mZnQuaW5wdXRTaWduYWwoZGF0YSk7XG4gICAgY29uc3QgbWVsQmFuZHMgPSB0aGlzLm1lbC5pbnB1dFZlY3RvcihiaW5zKTtcbiAgICAvLyBjb25zb2xlLmxvZyhtZWxCYW5kcyk7XG4gICAgY29uc3QgY29lZnMgPSB0aGlzLmRjdC5pbnB1dFNpZ25hbChtZWxCYW5kcyk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ickNvZWZzOyBpKyspXG4gICAgICBvdXRwdXRbaV0gPSBjb2Vmc1tpXTtcblxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIHRoaXMuaW5wdXRTaWduYWwoZnJhbWUuZGF0YSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWZjYztcbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5cbi8qKlxuICogRmluZCBtaW5pbXVuIGFuZCBtYXhpbXVtIHZhbHVlcyBvZiBhIGdpdmVuIGBzaWduYWxgLlxuICpcbiAqIF9zdXBwb3J0IGBzdGFuZGFsb25lYCB1c2FnZV9cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NvbW1vbic7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVNpemU6IDUxMixcbiAqICAgZnJhbWVUeXBlOiAnc2lnbmFsJyxcbiAqICAgc2FtcGxlUmF0ZTogMCxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IG1pbk1heCA9IG5ldyBsZm8ub3BlcmF0b3IuTWluTWF4KCk7XG4gKlxuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IGRhdGE6IHRydWUgfSk7XG4gKlxuICogZXZlbnRJbi5jb25uZWN0KG1pbk1heCk7XG4gKiBtaW5NYXguY29ubmVjdChsb2dnZXIpO1xuICogZXZlbnRJbi5zdGFydCgpXG4gKlxuICogLy8gY3JlYXRlIGEgZnJhbWVcbiAqIGNvbnN0IHNpZ25hbCA9IG5ldyBGbG9hdDMyQXJyYXkoNTEyKTtcbiAqIGZvciAobGV0IGkgPSAwOyBpIDwgNTEyOyBpKyspXG4gKiAgIHNpZ25hbFtpXSA9IGkgKyAxO1xuICpcbiAqIGV2ZW50SW4ucHJvY2VzcyhudWxsLCBzaWduYWwpO1xuICogPiBbMSwgNTEyXTtcbiAqL1xuY2xhc3MgTWluTWF4IGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIC8vIHRocm93IGVycm9ycyBpZiBvcHRpb25zIGFyZSBnaXZlblxuICAgIHN1cGVyKHt9LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSA9ICd2ZWN0b3InO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IDI7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZGVzY3JpcHRpb24gPSBbJ21pbicsICdtYXgnXTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIHRoZSBgTWluTWF4YCBvcGVyYXRvciBpbiBgc3RhbmRhbG9uZWAgbW9kZSAoaS5lLiBvdXRzaWRlIG9mIGEgZ3JhcGgpLlxuICAgKlxuICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheXxBcnJheX0gZGF0YSAtIElucHV0IHNpZ25hbC5cbiAgICogQHJldHVybiB7QXJyYXl9IC0gTWluIGFuZCBtYXggdmFsdWVzLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjb25zdCBtaW5NYXggPSBuZXcgTWluTWF4KCk7XG4gICAqIG1pbk1heC5pbml0U3RyZWFtKHsgZnJhbWVUeXBlOiAnc2lnbmFsJywgZnJhbWVTaXplOiAxMCB9KTtcbiAgICpcbiAgICogbWluTWF4LmlucHV0U2lnbmFsKFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5XSk7XG4gICAqID4gWzAsIDVdXG4gICAqL1xuICBpbnB1dFNpZ25hbChkYXRhKSB7XG4gICAgY29uc3Qgb3V0RGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBsZXQgbWluID0gK0luZmluaXR5O1xuICAgIGxldCBtYXggPSAtSW5maW5pdHk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IGRhdGEubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGRhdGFbaV07XG4gICAgICBpZiAodmFsdWUgPCBtaW4pIG1pbiA9IHZhbHVlO1xuICAgICAgaWYgKHZhbHVlID4gbWF4KSBtYXggPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBvdXREYXRhWzBdID0gbWluO1xuICAgIG91dERhdGFbMV0gPSBtYXg7XG5cbiAgICByZXR1cm4gb3V0RGF0YTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKGZyYW1lKSB7XG4gICAgdGhpcy5pbnB1dFNpZ25hbChmcmFtZS5kYXRhKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNaW5NYXg7XG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgb3JkZXI6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgbWluOiAxLFxuICAgIG1heDogMWU5LFxuICAgIGRlZmF1bHQ6IDEwLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9XG4gIH0sXG4gIGZpbGw6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIG1pbjogLUluZmluaXR5LFxuICAgIG1heDogK0luZmluaXR5LFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG59O1xuXG4vKipcbiAqIENvbXB1dGUgYSBtb3ZpbmcgYXZlcmFnZSBvcGVyYXRpb24gb24gdGhlIGluY29tbWluZyBmcmFtZXMgKGBzY2FsYXJgIG9yXG4gKiBgdmVjdG9yYCB0eXBlKS4gSWYgdGhlIGlucHV0IGlzIG9mIHR5cGUgdmVjdG9yLCB0aGUgbW92aW5nIGF2ZXJhZ2UgaXNcbiAqIGNvbXB1dGVkIGZvciBlYWNoIGRpbWVuc2lvbiBpbiBwYXJhbGxlbC4gSWYgdGhlIHNvdXJjZSBzYW1wbGUgcmF0ZSBpcyBkZWZpbmVkXG4gKiBmcmFtZSB0aW1lIGlzIHNoaWZ0ZWQgdG8gdGhlIG1pZGRsZSBvZiB0aGUgd2luZG93IGRlZmluZWQgYnkgdGhlIG9yZGVyLlxuICpcbiAqIF9zdXBwb3J0IGBzdGFuZGFsb25lYCB1c2FnZV9cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm9yZGVyPTEwXSAtIE51bWJlciBvZiBzdWNjZXNzaXZlIHZhbHVlcyBvbiB3aGljaFxuICogIHRoZSBhdmVyYWdlIGlzIGNvbXB1dGVkLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmZpbGw9MF0gLSBWYWx1ZSB0byBmaWxsIHRoZSByaW5nIGJ1ZmZlciB3aXRoIGJlZm9yZVxuICogIHRoZSBmaXJzdCBpbnB1dCBmcmFtZS5cbiAqXG4gKiBAdG9kbyAtIEltcGxlbWVudCBgcHJvY2Vzc1NpZ25hbGAgP1xuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NvbW1vbic7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVNpemU6IDIsXG4gKiAgIGZyYW1lVHlwZTogJ3ZlY3RvcidcbiAqIH0pO1xuICpcbiAqIGNvbnN0IG1vdmluZ0F2ZXJhZ2UgPSBuZXcgbGZvLm9wZXJhdG9yLk1vdmluZ0F2ZXJhZ2Uoe1xuICogICBvcmRlcjogNSxcbiAqICAgZmlsbDogMFxuICogfSk7XG4gKlxuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IGRhdGE6IHRydWUgfSk7XG4gKlxuICogZXZlbnRJbi5jb25uZWN0KG1vdmluZ0F2ZXJhZ2UpO1xuICogbW92aW5nQXZlcmFnZS5jb25uZWN0KGxvZ2dlcik7XG4gKlxuICogZXZlbnRJbi5zdGFydCgpO1xuICpcbiAqIGV2ZW50SW4ucHJvY2VzcyhudWxsLCBbMSwgMV0pO1xuICogPiBbMC4yLCAwLjJdXG4gKiBldmVudEluLnByb2Nlc3MobnVsbCwgWzEsIDFdKTtcbiAqID4gWzAuNCwgMC40XVxuICogZXZlbnRJbi5wcm9jZXNzKG51bGwsIFsxLCAxXSk7XG4gKiA+IFswLjYsIDAuNl1cbiAqIGV2ZW50SW4ucHJvY2VzcyhudWxsLCBbMSwgMV0pO1xuICogPiBbMC44LCAwLjhdXG4gKiBldmVudEluLnByb2Nlc3MobnVsbCwgWzEsIDFdKTtcbiAqID4gWzEsIDFdXG4gKi9cbmNsYXNzIE1vdmluZ0F2ZXJhZ2UgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5zdW0gPSBudWxsO1xuICAgIHRoaXMucmluZ0J1ZmZlciA9IG51bGw7XG4gICAgdGhpcy5yaW5nSW5kZXggPSAwO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIG9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKSB7XG4gICAgc3VwZXIub25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpO1xuXG4gICAgLy8gQHRvZG8gLSBzaG91bGQgYmUgZG9uZSBsYXppbHkgaW4gcHJvY2Vzc1xuICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgY2FzZSAnb3JkZXInOlxuICAgICAgICB0aGlzLnByb2Nlc3NTdHJlYW1QYXJhbXMoKTtcbiAgICAgICAgdGhpcy5yZXNldFN0cmVhbSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2ZpbGwnOlxuICAgICAgICB0aGlzLnJlc2V0U3RyZWFtKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ29yZGVyJyk7XG5cbiAgICB0aGlzLnJpbmdCdWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KG9yZGVyICogZnJhbWVTaXplKTtcblxuICAgIGlmIChmcmFtZVNpemUgPiAxKVxuICAgICAgdGhpcy5zdW0gPSBuZXcgRmxvYXQzMkFycmF5KGZyYW1lU2l6ZSk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5zdW0gPSAwO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICByZXNldFN0cmVhbSgpIHtcbiAgICBzdXBlci5yZXNldFN0cmVhbSgpO1xuXG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ29yZGVyJyk7XG4gICAgY29uc3QgZmlsbCA9IHRoaXMucGFyYW1zLmdldCgnZmlsbCcpO1xuICAgIGNvbnN0IHJpbmdCdWZmZXIgPSB0aGlzLnJpbmdCdWZmZXI7XG4gICAgY29uc3QgcmluZ0xlbmd0aCA9IHJpbmdCdWZmZXIubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByaW5nTGVuZ3RoOyBpKyspXG4gICAgICByaW5nQnVmZmVyW2ldID0gZmlsbDtcblxuICAgIGNvbnN0IGZpbGxTdW0gPSBvcmRlciAqIGZpbGw7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuXG4gICAgaWYgKGZyYW1lU2l6ZSA+IDEpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspXG4gICAgICAgIHRoaXMuc3VtW2ldID0gZmlsbFN1bTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdW0gPSBmaWxsU3VtO1xuICAgIH1cblxuICAgIHRoaXMucmluZ0luZGV4ID0gMDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2NhbGFyKHZhbHVlKSB7XG4gICAgdGhpcy5mcmFtZS5kYXRhWzBdID0gdGhpcy5pbnB1dFNjYWxhcihmcmFtZS5kYXRhWzBdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgdGhlIGBNb3ZpbmdBdmVyYWdlYCBvcGVyYXRvciBpbiBgc3RhbmRhbG9uZWAgbW9kZSAoaS5lLiBvdXRzaWRlIG9mIGFcbiAgICogZ3JhcGgpIHdpdGggYSBgc2NhbGFyYCBpbnB1dC5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIC0gVmFsdWUgdG8gZmVlZCB0aGUgbW92aW5nIGF2ZXJhZ2Ugd2l0aC5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIEF2ZXJhZ2UgdmFsdWUuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAgICpcbiAgICogY29uc3QgbW92aW5nQXZlcmFnZSA9IG5ldyBsZm8ub3BlcmF0b3IuTW92aW5nQXZlcmFnZSh7IG9yZGVyOiA1IH0pO1xuICAgKiBtb3ZpbmdBdmVyYWdlLmluaXRTdHJlYW0oeyBmcmFtZVNpemU6IDEsIGZyYW1lVHlwZTogJ3NjYWxhcicgfSk7XG4gICAqXG4gICAqIG1vdmluZ0F2ZXJhZ2UuaW5wdXRTY2FsYXIoMSk7XG4gICAqID4gMC4yXG4gICAqIG1vdmluZ0F2ZXJhZ2UuaW5wdXRTY2FsYXIoMSk7XG4gICAqID4gMC40XG4gICAqIG1vdmluZ0F2ZXJhZ2UuaW5wdXRTY2FsYXIoMSk7XG4gICAqID4gMC42XG4gICAqL1xuICBpbnB1dFNjYWxhcih2YWx1ZSkge1xuICAgIGNvbnN0IG9yZGVyID0gdGhpcy5wYXJhbXMuZ2V0KCdvcmRlcicpO1xuICAgIGNvbnN0IHJpbmdJbmRleCA9IHRoaXMucmluZ0luZGV4O1xuICAgIGNvbnN0IHJpbmdCdWZmZXIgPSB0aGlzLnJpbmdCdWZmZXI7XG4gICAgbGV0IHN1bSA9IHRoaXMuc3VtO1xuXG4gICAgc3VtIC09IHJpbmdCdWZmZXJbcmluZ0luZGV4XTtcbiAgICBzdW0gKz0gdmFsdWU7XG5cbiAgICB0aGlzLnN1bSA9IHN1bTtcbiAgICB0aGlzLnJpbmdCdWZmZXJbcmluZ0luZGV4XSA9IHZhbHVlO1xuICAgIHRoaXMucmluZ0luZGV4ID0gKHJpbmdJbmRleCArIDEpICUgb3JkZXI7XG5cbiAgICByZXR1cm4gc3VtIC8gb3JkZXI7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcihmcmFtZSkge1xuICAgIHRoaXMuaW5wdXRWZWN0b3IoZnJhbWUuZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIHRoZSBgTW92aW5nQXZlcmFnZWAgb3BlcmF0b3IgaW4gYHN0YW5kYWxvbmVgIG1vZGUgKGkuZS4gb3V0c2lkZSBvZiBhXG4gICAqIGdyYXBoKSB3aXRoIGEgYHZlY3RvcmAgaW5wdXQuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyAtIFZhbHVlcyB0byBmZWVkIHRoZSBtb3ZpbmcgYXZlcmFnZSB3aXRoLlxuICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXl9IC0gQXZlcmFnZSB2YWx1ZSBmb3IgZWFjaCBkaW1lbnNpb24uXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAgICpcbiAgICogY29uc3QgbW92aW5nQXZlcmFnZSA9IG5ldyBsZm8ub3BlcmF0b3IuTW92aW5nQXZlcmFnZSh7IG9yZGVyOiA1IH0pO1xuICAgKiBtb3ZpbmdBdmVyYWdlLmluaXRTdHJlYW0oeyBmcmFtZVNpemU6IDIsIGZyYW1lVHlwZTogJ3NjYWxhcicgfSk7XG4gICAqXG4gICAqIG1vdmluZ0F2ZXJhZ2UuaW5wdXRBcnJheShbMSwgMV0pO1xuICAgKiA+IFswLjIsIDAuMl1cbiAgICogbW92aW5nQXZlcmFnZS5pbnB1dEFycmF5KFsxLCAxXSk7XG4gICAqID4gWzAuNCwgMC40XVxuICAgKiBtb3ZpbmdBdmVyYWdlLmlucHV0QXJyYXkoWzEsIDFdKTtcbiAgICogPiBbMC42LCAwLjZdXG4gICAqL1xuICBpbnB1dFZlY3Rvcih2YWx1ZXMpIHtcbiAgICBjb25zdCBvcmRlciA9IHRoaXMucGFyYW1zLmdldCgnb3JkZXInKTtcbiAgICBjb25zdCBvdXRGcmFtZSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgcmluZ0luZGV4ID0gdGhpcy5yaW5nSW5kZXg7XG4gICAgY29uc3QgcmluZ09mZnNldCA9IHJpbmdJbmRleCAqIGZyYW1lU2l6ZTtcbiAgICBjb25zdCByaW5nQnVmZmVyID0gdGhpcy5yaW5nQnVmZmVyO1xuICAgIGNvbnN0IHN1bSA9IHRoaXMuc3VtO1xuICAgIGNvbnN0IHNjYWxlID0gMSAvIG9yZGVyO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgY29uc3QgcmluZ0J1ZmZlckluZGV4ID0gcmluZ09mZnNldCArIGk7XG4gICAgICBjb25zdCB2YWx1ZSA9IHZhbHVlc1tpXTtcbiAgICAgIGxldCBsb2NhbFN1bSA9IHN1bVtpXTtcblxuICAgICAgbG9jYWxTdW0gLT0gcmluZ0J1ZmZlcltyaW5nQnVmZmVySW5kZXhdO1xuICAgICAgbG9jYWxTdW0gKz0gdmFsdWU7XG5cbiAgICAgIHRoaXMuc3VtW2ldID0gbG9jYWxTdW07XG4gICAgICBvdXRGcmFtZVtpXSA9IGxvY2FsU3VtICogc2NhbGU7XG4gICAgICByaW5nQnVmZmVyW3JpbmdCdWZmZXJJbmRleF0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLnJpbmdJbmRleCA9IChyaW5nSW5kZXggKyAxKSAlIG9yZGVyO1xuXG4gICAgcmV0dXJuIG91dEZyYW1lO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIHRoaXMucHJlcGFyZUZyYW1lKCk7XG4gICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuXG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ29yZGVyJyk7XG4gICAgbGV0IHRpbWUgPSBmcmFtZS50aW1lO1xuICAgIC8vIHNoaWZ0IHRpbWUgdG8gdGFrZSBhY2NvdW50IG9mIHRoZSBhZGRlZCBsYXRlbmN5XG4gICAgaWYgKHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUpXG4gICAgICB0aW1lIC09ICgwLjUgKiAob3JkZXIgLSAxKSAvIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUpO1xuXG4gICAgdGhpcy5mcmFtZS50aW1lID0gdGltZTtcbiAgICB0aGlzLmZyYW1lLm1ldGFkYXRhID0gZnJhbWUubWV0YWRhdGE7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZUZyYW1lKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTW92aW5nQXZlcmFnZTtcbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBvcmRlcjoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBtaW46IDEsXG4gICAgbWF4OiAxZTksXG4gICAgZGVmYXVsdDogOSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgZmlsbDoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgbWluOiAtSW5maW5pdHksXG4gICAgbWF4OiArSW5maW5pdHksXG4gICAgZGVmYXVsdDogMCxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbn07XG5cbi8qKlxuICogQ29tcHV0ZSBhIG1vdmluZyBtZWRpYW4gb3BlcmF0aW9uIG9uIHRoZSBpbmNvbW1pbmcgZnJhbWVzIChgc2NhbGFyYCBvclxuICogYHZlY3RvcmAgdHlwZSkuIElmIHRoZSBpbnB1dCBpcyBvZiB0eXBlIHZlY3RvciwgdGhlIG1vdmluZyBtZWRpYW4gaXNcbiAqIGNvbXB1dGVkIGZvciBlYWNoIGRpbWVuc2lvbiBpbiBwYXJhbGxlbC4gSWYgdGhlIHNvdXJjZSBzYW1wbGUgcmF0ZSBpcyBkZWZpbmVkXG4gKiBmcmFtZSB0aW1lIGlzIHNoaWZ0ZWQgdG8gdGhlIG1pZGRsZSBvZiB0aGUgd2luZG93IGRlZmluZWQgYnkgdGhlIG9yZGVyLlxuICpcbiAqIF9zdXBwb3J0IGBzdGFuZGFsb25lYCB1c2FnZV9cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm9yZGVyPTldIC0gTnVtYmVyIG9mIHN1Y2Nlc3NpdmUgdmFsdWVzIGluIHdoaWNoXG4gKiAgdGhlIG1lZGlhbiBpcyBzZWFyY2hlZC4gVGhpcyB2YWx1ZSBtdXN0IGJlIG9kZC4gX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmZpbGw9MF0gLSBWYWx1ZSB0byBmaWxsIHRoZSByaW5nIGJ1ZmZlciB3aXRoIGJlZm9yZVxuICogIHRoZSBmaXJzdCBpbnB1dCBmcmFtZS4gX2R5bmFtaWMgcGFyYW1ldGVyX1xuICpcbiAqIEB0b2RvIC0gSW1wbGVtZW50IGBwcm9jZXNzU2lnbmFsYFxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NvbW1vbic7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVNpemU6IDIsXG4gKiAgIGZyYW1lVHlwZTogJ3ZlY3RvcicsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBtb3ZpbmdNZWRpYW4gPSBuZXcgbGZvLm9wZXJhdG9yLk1vdmluZ01lZGlhbih7XG4gKiAgIG9yZGVyOiA1LFxuICogICBmaWxsOiAwLFxuICogfSk7XG4gKlxuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IGRhdGE6IHRydWUgfSk7XG4gKlxuICogZXZlbnRJbi5jb25uZWN0KG1vdmluZ01lZGlhbik7XG4gKiBtb3ZpbmdNZWRpYW4uY29ubmVjdChsb2dnZXIpO1xuICpcbiAqIGV2ZW50SW4uc3RhcnQoKTtcbiAqXG4gKiBldmVudEluLnByb2Nlc3NGcmFtZShudWxsLCBbMSwgMV0pO1xuICogPiBbMCwgMF1cbiAqIGV2ZW50SW4ucHJvY2Vzc0ZyYW1lKG51bGwsIFsyLCAyXSk7XG4gKiA+IFswLCAwXVxuICogZXZlbnRJbi5wcm9jZXNzRnJhbWUobnVsbCwgWzMsIDNdKTtcbiAqID4gWzEsIDFdXG4gKiBldmVudEluLnByb2Nlc3NGcmFtZShudWxsLCBbNCwgNF0pO1xuICogPiBbMiwgMl1cbiAqIGV2ZW50SW4ucHJvY2Vzc0ZyYW1lKG51bGwsIFs1LCA1XSk7XG4gKiA+IFszLCAzXVxuICovXG5jbGFzcyBNb3ZpbmdNZWRpYW4gZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5yaW5nQnVmZmVyID0gbnVsbDtcbiAgICB0aGlzLnNvcnRlciA9IG51bGw7XG4gICAgdGhpcy5yaW5nSW5kZXggPSAwO1xuXG4gICAgdGhpcy5fZW5zdXJlT2RkT3JkZXIoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZW5zdXJlT2RkT3JkZXIoKSB7XG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnb3JkZXInKSAlIDIgPT09IDApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdmFsdWUgJHtvcmRlcn0gZm9yIHBhcmFtIFwib3JkZXJcIiAtIHNob3VsZCBiZSBvZGRgKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBvblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcykge1xuICAgIHN1cGVyLm9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKTtcblxuICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgY2FzZSAnb3JkZXInOlxuICAgICAgICB0aGlzLl9lbnN1cmVPZGRPcmRlcigpO1xuICAgICAgICB0aGlzLnByb2Nlc3NTdHJlYW1QYXJhbXMoKTtcbiAgICAgICAgdGhpcy5yZXNldFN0cmVhbSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2ZpbGwnOlxuICAgICAgICB0aGlzLnJlc2V0U3RyZWFtKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG4gICAgLy8gb3V0VHlwZSBpcyBzaW1pbGFyIHRvIGlucHV0IHR5cGVcblxuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBvcmRlciA9IHRoaXMucGFyYW1zLmdldCgnb3JkZXInKTtcblxuICAgIHRoaXMucmluZ0J1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplICogb3JkZXIpO1xuICAgIHRoaXMuc29ydEJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplICogb3JkZXIpO1xuXG4gICAgdGhpcy5taW5JbmRpY2VzID0gbmV3IFVpbnQzMkFycmF5KGZyYW1lU2l6ZSk7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHJlc2V0U3RyZWFtKCkge1xuICAgIHN1cGVyLnJlc2V0U3RyZWFtKCk7XG5cbiAgICBjb25zdCBmaWxsID0gdGhpcy5wYXJhbXMuZ2V0KCdmaWxsJyk7XG4gICAgY29uc3QgcmluZ0J1ZmZlciA9IHRoaXMucmluZ0J1ZmZlcjtcbiAgICBjb25zdCByaW5nTGVuZ3RoID0gcmluZ0J1ZmZlci5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJpbmdMZW5ndGg7IGkrKylcbiAgICAgIHRoaXMucmluZ0J1ZmZlcltpXSA9IGZpbGw7XG5cbiAgICB0aGlzLnJpbmdJbmRleCA9IDA7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NjYWxhcihmcmFtZSkge1xuICAgIHRoaXMuZnJhbWUuZGF0YVswXSA9IHRoaXMuaW5wdXRTY2FsYXIoZnJhbWUuZGF0YVswXSk7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3dzIGZvciB0aGUgdXNlIG9mIGEgYE1vdmluZ01lZGlhbmAgb3V0c2lkZSBhIGdyYXBoIChlLmcuIGluc2lkZVxuICAgKiBhbm90aGVyIG5vZGUpLCBpbiB0aGlzIGNhc2UgYHByb2Nlc3NTdHJlYW1QYXJhbXNgIGFuZCBgcmVzZXRTdHJlYW1gXG4gICAqIHNob3VsZCBiZSBjYWxsZWQgbWFudWFsbHkgb24gdGhlIG5vZGUuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSAtIFZhbHVlIHRvIGZlZWQgdGhlIG1vdmluZyBtZWRpYW4gd2l0aC5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIE1lZGlhbiB2YWx1ZS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICAgKlxuICAgKiBjb25zdCBtb3ZpbmdNZWRpYW4gPSBuZXcgTW92aW5nTWVkaWFuKHsgb3JkZXI6IDUgfSk7XG4gICAqIG1vdmluZ01lZGlhbi5pbml0U3RyZWFtKHsgZnJhbWVTaXplOiAxLCBmcmFtZVR5cGU6ICdzY2FsYXInIH0pO1xuICAgKlxuICAgKiBtb3ZpbmdNZWRpYW4uaW5wdXRTY2FsYXIoMSk7XG4gICAqID4gMFxuICAgKiBtb3ZpbmdNZWRpYW4uaW5wdXRTY2FsYXIoMik7XG4gICAqID4gMFxuICAgKiBtb3ZpbmdNZWRpYW4uaW5wdXRTY2FsYXIoMyk7XG4gICAqID4gMVxuICAgKiBtb3ZpbmdNZWRpYW4uaW5wdXRTY2FsYXIoNCk7XG4gICAqID4gMlxuICAgKi9cbiAgaW5wdXRTY2FsYXIodmFsdWUpIHtcbiAgICBjb25zdCByaW5nSW5kZXggPSB0aGlzLnJpbmdJbmRleDtcbiAgICBjb25zdCByaW5nQnVmZmVyID0gdGhpcy5yaW5nQnVmZmVyO1xuICAgIGNvbnN0IHNvcnRCdWZmZXIgPSB0aGlzLnNvcnRCdWZmZXI7XG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ29yZGVyJyk7XG4gICAgY29uc3QgbWVkaWFuSW5kZXggPSAob3JkZXIgLSAxKSAvIDI7XG4gICAgbGV0IHN0YXJ0SW5kZXggPSAwO1xuXG4gICAgcmluZ0J1ZmZlcltyaW5nSW5kZXhdID0gdmFsdWU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBtZWRpYW5JbmRleDsgaSsrKSB7XG4gICAgICBsZXQgbWluID0gK0luZmluaXR5O1xuICAgICAgbGV0IG1pbkluZGV4ID0gbnVsbDtcblxuICAgICAgZm9yIChsZXQgaiA9IHN0YXJ0SW5kZXg7IGogPCBvcmRlcjsgaisrKSB7XG4gICAgICAgIGlmIChpID09PSAwKVxuICAgICAgICAgIHNvcnRCdWZmZXJbal0gPSByaW5nQnVmZmVyW2pdO1xuXG4gICAgICAgIGlmIChzb3J0QnVmZmVyW2pdIDwgbWluKSB7XG4gICAgICAgICAgbWluID0gc29ydEJ1ZmZlcltqXTtcbiAgICAgICAgICBtaW5JbmRleCA9IGo7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gc3dhcCBtaW5JbmRleCBhbmQgc3RhcnRJbmRleFxuICAgICAgY29uc3QgY2FjaGUgPSBzb3J0QnVmZmVyW3N0YXJ0SW5kZXhdO1xuICAgICAgc29ydEJ1ZmZlcltzdGFydEluZGV4XSA9IHNvcnRCdWZmZXJbbWluSW5kZXhdO1xuICAgICAgc29ydEJ1ZmZlclttaW5JbmRleF0gPSBjYWNoZTtcblxuICAgICAgc3RhcnRJbmRleCArPSAxO1xuICAgIH1cblxuICAgIGNvbnN0IG1lZGlhbiA9IHNvcnRCdWZmZXJbbWVkaWFuSW5kZXhdO1xuICAgIHRoaXMucmluZ0luZGV4ID0gKHJpbmdJbmRleCArIDEpICUgb3JkZXI7XG5cbiAgICByZXR1cm4gbWVkaWFuO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUpIHtcbiAgICB0aGlzLmlucHV0VmVjdG9yKGZyYW1lLmRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyBmb3IgdGhlIHVzZSBvZiBhIGBNb3ZpbmdNZWRpYW5gIG91dHNpZGUgYSBncmFwaCAoZS5nLiBpbnNpZGVcbiAgICogYW5vdGhlciBub2RlKSwgaW4gdGhpcyBjYXNlIGBwcm9jZXNzU3RyZWFtUGFyYW1zYCBhbmQgYHJlc2V0U3RyZWFtYFxuICAgKiBzaG91bGQgYmUgY2FsbGVkIG1hbnVhbGx5IG9uIHRoZSBub2RlLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgLSBWYWx1ZXMgdG8gZmVlZCB0aGUgbW92aW5nIG1lZGlhbiB3aXRoLlxuICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXl9IC0gTWVkaWFuIHZhbHVlcyBmb3IgZWFjaCBkaW1lbnNpb24uXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAgICpcbiAgICogY29uc3QgbW92aW5nTWVkaWFuID0gbmV3IE1vdmluZ01lZGlhbih7IG9yZGVyOiAzLCBmaWxsOiAwIH0pO1xuICAgKiBtb3ZpbmdNZWRpYW4uaW5pdFN0cmVhbSh7IGZyYW1lU2l6ZTogMywgZnJhbWVUeXBlOiAndmVjdG9yJyB9KTtcbiAgICpcbiAgICogbW92aW5nTWVkaWFuLmlucHV0QXJyYXkoWzEsIDFdKTtcbiAgICogPiBbMCwgMF1cbiAgICogbW92aW5nTWVkaWFuLmlucHV0QXJyYXkoWzIsIDJdKTtcbiAgICogPiBbMSwgMV1cbiAgICogbW92aW5nTWVkaWFuLmlucHV0QXJyYXkoWzMsIDNdKTtcbiAgICogPiBbMiwgMl1cbiAgICovXG4gIGlucHV0VmVjdG9yKHZhbHVlcykge1xuICAgIGNvbnN0IG9yZGVyID0gdGhpcy5wYXJhbXMuZ2V0KCdvcmRlcicpO1xuICAgIGNvbnN0IHJpbmdCdWZmZXIgPSB0aGlzLnJpbmdCdWZmZXI7XG4gICAgY29uc3QgcmluZ0luZGV4ID0gdGhpcy5yaW5nSW5kZXg7XG4gICAgY29uc3Qgc29ydEJ1ZmZlciA9IHRoaXMuc29ydEJ1ZmZlcjtcbiAgICBjb25zdCBvdXRGcmFtZSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBjb25zdCBtaW5JbmRpY2VzID0gdGhpcy5taW5JbmRpY2VzO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBtZWRpYW5JbmRleCA9IE1hdGguZmxvb3Iob3JkZXIgLyAyKTtcbiAgICBsZXQgc3RhcnRJbmRleCA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBtZWRpYW5JbmRleDsgaSsrKSB7XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZnJhbWVTaXplOyBqKyspIHtcbiAgICAgICAgb3V0RnJhbWVbal0gPSArSW5maW5pdHk7XG4gICAgICAgIG1pbkluZGljZXNbal0gPSAwO1xuXG4gICAgICAgIGZvciAobGV0IGsgPSBzdGFydEluZGV4OyBrIDwgb3JkZXI7IGsrKykge1xuICAgICAgICAgIGNvbnN0IGluZGV4ID0gayAqIGZyYW1lU2l6ZSArIGo7XG5cbiAgICAgICAgICAvLyB1cGRhdGUgcmluZyBidWZmZXIgY29ycmVzcG9uZGluZyB0byBjdXJyZW50XG4gICAgICAgICAgaWYgKGsgPT09IHJpbmdJbmRleCAmJiBpID09PSAwKVxuICAgICAgICAgICAgcmluZ0J1ZmZlcltpbmRleF0gPSB2YWx1ZXNbal07XG5cbiAgICAgICAgICAvLyBjb3B5IHZhbHVlIGluIHNvcnQgYnVmZmVyIG9uIGZpcnN0IHBhc3NcbiAgICAgICAgICBpZiAoaSA9PT0gMCnCoFxuICAgICAgICAgICAgc29ydEJ1ZmZlcltpbmRleF0gPSByaW5nQnVmZmVyW2luZGV4XTtcblxuICAgICAgICAgIC8vIGZpbmQgbWluaXVtIGluIHRoZSByZW1haW5pbmcgYXJyYXlcbiAgICAgICAgICBpZiAoc29ydEJ1ZmZlcltpbmRleF0gPCBvdXRGcmFtZVtqXSkge1xuICAgICAgICAgICAgb3V0RnJhbWVbal0gPSBzb3J0QnVmZmVyW2luZGV4XTtcbiAgICAgICAgICAgIG1pbkluZGljZXNbal0gPSBpbmRleDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzd2FwIG1pbmltdW0gYW5kIGN1cmVudCBpbmRleFxuICAgICAgICBjb25zdCBzd2FwSW5kZXggPSBzdGFydEluZGV4ICogZnJhbWVTaXplICsgajtcbiAgICAgICAgY29uc3QgdiA9IHNvcnRCdWZmZXJbc3dhcEluZGV4XTtcbiAgICAgICAgc29ydEJ1ZmZlcltzd2FwSW5kZXhdID0gc29ydEJ1ZmZlclttaW5JbmRpY2VzW2pdXTtcbiAgICAgICAgc29ydEJ1ZmZlclttaW5JbmRpY2VzW2pdXSA9IHY7XG5cbiAgICAgICAgLy8gc3RvcmUgdGhpcyBtaW5pbXVtIHZhbHVlIGFzIGN1cnJlbnQgcmVzdWx0XG4gICAgICAgIG91dEZyYW1lW2pdID0gc29ydEJ1ZmZlcltzd2FwSW5kZXhdO1xuICAgICAgfVxuXG4gICAgICBzdGFydEluZGV4ICs9IDE7XG4gICAgfVxuXG4gICAgdGhpcy5yaW5nSW5kZXggPSAocmluZ0luZGV4ICsgMSkgJSBvcmRlcjtcblxuICAgIHJldHVybiB0aGlzLmZyYW1lLmRhdGE7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgdGhpcy5wcmVwcm9jZXNzRnJhbWUoKTtcbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG5cbiAgICBjb25zdCBvcmRlciA9IHRoaXMucGFyYW1zLmdldCgnb3JkZXInKTtcbiAgICBsZXQgdGltZSA9IGZyYW1lLnRpbWU7XG4gICAgLy8gc2hpZnQgdGltZSB0byB0YWtlIGFjY291bnQgb2YgdGhlIGFkZGVkIGxhdGVuY3lcbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSlcbiAgICAgIHRpbWUgLT0gKDAuNSAqIChvcmRlciAtIDEpIC8gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSk7XG5cbiAgICB0aGlzLmZyYW1lLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMuZnJhbWUubWV0YWRhdGEgPSBmcmFtZS5tZXRhZGF0YTtcblxuICAgIHRoaXMucHJvcGFnYXRlRnJhbWUodGltZSwgdGhpcy5vdXRGcmFtZSwgbWV0YWRhdGEpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vdmluZ01lZGlhbjtcbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBzdGF0ZToge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBkZWZhdWx0OiAnb24nLFxuICAgIGxpc3Q6IFsnb24nLCAnb2ZmJ10sXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG59O1xuXG4vKipcbiAqIFRoZSBPbk9mZiBvcGVyYXRvciBhbGxvd3MgdG8gc3RvcCB0aGUgcHJvcGFnYXRpb24gb2YgdGhlIHN0cmVhbSBpbiBhXG4gKiBzdWJncmFwaC4gV2hlbiBcIm9uXCIsIGZyYW1lcyBhcmUgcHJvcGFnYXRlZCwgd2hlbiBcIm9mZlwiIHRoZSBwcm9wYWdhdGlvbiBpc1xuICogc3RvcHBlZC5cbiAqXG4gKiBUaGUgYHN0cmVhbVBhcmFtc2AgcHJvcGFnYXRpb24gaXMgbmV2ZXIgYnlwYXNzZWQgc28gdGhlIHN1YnNlcXVlbnQgc3ViZ3JhcGhcbiAqIGlzIGFsd2F5cyByZWFkeSBmb3IgaW5jb21taW5nIGZyYW1lcy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnN0YXRlPSdvbiddIC0gRGVmYXVsdCBzdGF0ZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jb21tb24nO1xuICpcbiAqIGNvbnN0IGZyYW1lcyA9IFtcbiAqICAgeyB0aW1lOiAwLCBkYXRhOiBbMSwgMl0gfSxcbiAqICAgeyB0aW1lOiAxLCBkYXRhOiBbMywgNF0gfSxcbiAqICAgeyB0aW1lOiAyLCBkYXRhOiBbNSwgNl0gfSxcbiAqIF07XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBFdmVudEluKHtcbiAqICAgZnJhbWVTaXplOiAyLFxuICogICBmcmFtZVJhdGU6IDAsXG4gKiAgIGZyYW1lVHlwZTogJ3ZlY3RvcicsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBvbk9mZiA9IG5ldyBPbk9mZigpO1xuICpcbiAqIGNvbnN0IGxvZ2dlciA9IG5ldyBMb2dnZXIoeyBkYXRhOiB0cnVlIH0pO1xuICpcbiAqIGV2ZW50SW4uY29ubmVjdChvbk9mZik7XG4gKiBvbk9mZi5jb25uZWN0KGxvZ2dlcik7XG4gKlxuICogZXZlbnRJbi5zdGFydCgpO1xuICpcbiAqIGV2ZW50SW4ucHJvY2Vzc0ZyYW1lKGZyYW1lc1swXSk7XG4gKiA+IFswLCAxXVxuICpcbiAqIC8vIGJ5cGFzcyBzdWJncmFwaFxuICogb25PZmYuc2V0U3RhdGUoJ29mZicpO1xuICogZXZlbnRJbi5wcm9jZXNzRnJhbWUoZnJhbWVzWzFdKTtcbiAqXG4gKiAvLyByZS1vcGVuIHN1YmdyYXBoXG4gKiBvbk9mZi5zZXRTdGF0ZSgnb24nKTtcbiAqIGV2ZW50SW4ucHJvY2Vzc0ZyYW1lKGZyYW1lc1syXSk7XG4gKiA+IFs1LCA2XVxuICovXG5jbGFzcyBPbk9mZiBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnN0YXRlID0gdGhpcy5wYXJhbXMuZ2V0KCdzdGF0ZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgc3RhdGUgb2YgdGhlIGBPbk9mZmAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdGF0ZSAtIE5ldyBzdGF0ZSBvZiB0aGUgb3BlcmF0b3IgKGBvbmAgb3IgYG9mZmApXG4gICAqL1xuICBzZXRTdGF0ZShzdGF0ZSkge1xuICAgIGlmIChkZWZpbml0aW9ucy5zdGF0ZS5saXN0LmluZGV4T2Yoc3RhdGUpID09PSAtMSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzd2l0Y2ggc3RhdGUgdmFsdWUgXCIke3N0YXRlfVwiIFt2YWxpZCB2YWx1ZXM6IFwib25cIi9cIm9mZlwiXWApO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICB9XG5cbiAgLy8gZGVmaW5lIGFsbCBwb3NzaWJsZSBzdHJlYW0gQVBJXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2NhbGFyKCkge31cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoKSB7fVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbCgpIHt9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIGlmICh0aGlzLnN0YXRlID09PSAnb24nKSB7XG4gICAgICB0aGlzLnByZXBhcmVGcmFtZSgpO1xuXG4gICAgICB0aGlzLmZyYW1lLnRpbWUgPSBmcmFtZS50aW1lO1xuICAgICAgdGhpcy5mcmFtZS5tZXRhZGF0YSA9IGZyYW1lLm1ldGFkYXRhO1xuICAgICAgdGhpcy5mcmFtZS5kYXRhID0gZnJhbWUuZGF0YTtcblxuICAgICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBPbk9mZjtcbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5cbmNvbnN0IHNxcnQgPSBNYXRoLnNxcnQ7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBwb3dlcjoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbn07XG5cbi8qKlxuICogQ29tcHV0ZSB0aGUgUm9vdCBNZWFuIFNxdWFyZSBvZiBhIGBzaWduYWxgLlxuICpcbiAqIF9zdXBwb3J0IGBzdGFuZGFsb25lYCB1c2FnZV9cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5wb3dlcj1mYWxzZV0gLSBJZiBgdHJ1ZWAgcmVtb3ZlIHRoZSBcIlJcIiBvZiB0aGVcbiAqICBcIlJtc1wiIGFuZCByZXR1cm4gdGhlIHNxdWFyZWQgcmVzdWx0IChpLmUuIHBvd2VyKS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIC8vIGFzc3VtaW5nIHNvbWUgYEF1ZGlvQnVmZmVyYFxuICogY29uc3QgYXVkaW9JbkJ1ZmZlciA9IG5ldyBsZm8uc291cmNlLkF1ZGlvSW5CdWZmZXIoe1xuICogICBhdWRpb0J1ZmZlcjogYXVkaW9CdWZmZXIsXG4gKiAgIGZyYW1lU2l6ZTogNTEyLFxuICogfSk7XG4gKlxuICogY29uc3Qgcm1zID0gbmV3IGxmby5vcGVyYXRvci5SbXMoKTtcbiAqIGNvbnN0IGxvZ2dlciA9IG5ldyBsZm8uc2luay5Mb2dnZXIoeyBkYXRhOiB0cnVlIH0pO1xuICpcbiAqIGF1ZGlvSW5CdWZmZXIuY29ubmVjdChybXMpO1xuICogcm1zLmNvbm5lY3QobG9nZ2VyKTtcbiAqXG4gKiBhdWRpb0luQnVmZmVyLnN0YXJ0KCk7XG4gKi9cbmNsYXNzIFJtcyBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gMTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVR5cGUgPSAnc2NhbGFyJztcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5kZXNjcmlwdGlvbiA9IFsncm1zJ107XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyBmb3IgdGhlIHVzZSBvZiBhIGBSbXNgIG91dHNpZGUgYSBncmFwaCAoZS5nLiBpbnNpZGVcbiAgICogYW5vdGhlciBub2RlKS4gUmV0dXJuIHRoZSBybXMgb2YgdGhlIGdpdmVuIHNpZ25hbCBibG9jay5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNpZ25hbCAtIFNpZ25hbCBibG9jayB0byBiZSBjb21wdXRlZC5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIHJtcyBvZiB0aGUgaW5wdXQgc2lnbmFsLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gICAqXG4gICAqIGNvbnN0IHJtcyA9IG5ldyBsZm8ub3BlcmF0b3IuUm1zKCk7XG4gICAqIHJtcy5pbml0U3RyZWFtKHsgZnJhbWVUeXBlOiAnc2lnbmFsJywgZnJhbWVTaXplOiAxMDAwIH0pO1xuICAgKlxuICAgKiBjb25zdCByZXN1bHRzID0gcm1zLmlucHV0U2lnbmFsKFsuLi52YWx1ZXNdKTtcbiAgICovXG4gIGlucHV0U2lnbmFsKHNpZ25hbCkge1xuICAgIGNvbnN0IHBvd2VyID0gdGhpcy5wYXJhbXMuZ2V0KCdwb3dlcicpO1xuICAgIGNvbnN0IGxlbmd0aCA9IHNpZ25hbC5sZW5ndGg7XG4gICAgbGV0IHJtcyA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKVxuICAgICAgcm1zICs9IChzaWduYWxbaV0gKiBzaWduYWxbaV0pO1xuXG4gICAgcm1zID0gcm1zIC8gbGVuZ3RoO1xuXG4gICAgaWYgKCFwb3dlcilcbiAgICAgIHJtcyA9IHNxcnQocm1zKTtcblxuICAgIHJldHVybiBybXM7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIHRoaXMuZnJhbWUuZGF0YVswXSA9IHRoaXMuaW5wdXRTaWduYWwoZnJhbWUuZGF0YSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUm1zO1xuIiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcbmltcG9ydCBNb3ZpbmdBdmVyYWdlIGZyb20gJy4vTW92aW5nQXZlcmFnZSc7XG5cbmNvbnN0IG1pbiA9IE1hdGgubWluO1xuY29uc3QgbWF4ID0gTWF0aC5tYXg7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBsb2dJbnB1dDoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHlhbm1pYycgfSxcbiAgfSxcbiAgbWluSW5wdXQ6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDAuMDAwMDAwMDAwMDAxLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICBmaWx0ZXJPcmRlcjoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiA1LFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICB0aHJlc2hvbGQ6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDMsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5YW5taWMnIH0sXG4gIH0sXG4gIG9mZlRocmVzaG9sZDoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogLUluZmluaXR5LFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICBtaW5JbnRlcjoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogMC4wNTAsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5YW5taWMnIH0sXG4gIH0sXG4gIG1heER1cmF0aW9uOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiBJbmZpbml0eSxcbiAgICBtZXRhczogeyBraW5kOiAnZHlhbm1pYycgfSxcbiAgfSxcbn1cblxuLyoqXG4gKiBDcmVhdGUgc2VnbWVudHMgYmFzZWQgb24gYXR0YWNrcy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5sb2dJbnB1dD1mYWxzZV0gLSBBcHBseSBsb2cgb24gdGhlIGlucHV0LlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1pbklucHV0PTAuMDAwMDAwMDAwMDAxXSAtIE1pbmltdW0gdmFsdWUgdG8gdXNlIGFzXG4gKiAgaW5wdXQuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZmlsdGVyT3JkZXI9NV0gLSBPcmRlciBvZiB0aGUgaW50ZXJuYWxseSB1c2VkIG1vdmluZ1xuICogIGF2ZXJhZ2UuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMudGhyZXNob2xkPTNdIC0gVGhyZXNob2xkIHRoYXQgdHJpZ2dlcnMgYSBzZWdtZW50XG4gKiAgc3RhcnQuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMub2ZmVGhyZXNob2xkPS1JbmZpbml0eV0gLSBUaHJlc2hvbGQgdGhhdCB0cmlnZ2Vyc1xuICogIGEgc2VnbWVudCBlbmQuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWluSW50ZXI9MC4wNTBdIC0gTWluaW11bSBkZWxheSBiZXR3ZWVuIHR3byBzZW1nZW50cy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXhEdXJhdGlvbj1JbmZpbml0eV0gLSBNYXhpbXVtIGR1cmF0aW9uIG9mIGEgc2VnbWVudC5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIC8vIGFzc3VtaW5nIGEgc3RyZWFtIGZyb20gdGhlIG1pY3JvcGhvbmVcbiAqIGNvbnN0IHNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVNZWRpYVN0cmVhbVNvdXJjZShzdHJlYW0pO1xuICpcbiAqIGNvbnN0IGF1ZGlvSW5Ob2RlID0gbmV3IGxmby5zb3VyY2UuQXVkaW9Jbk5vZGUoe1xuICogICBzb3VyY2VOb2RlOiBzb3VyY2UsXG4gKiAgIGF1ZGlvQ29udGV4dDogYXVkaW9Db250ZXh0LFxuICogfSk7XG4gKlxuICogY29uc3Qgc2xpY2VyID0gbmV3IGxmby5vcGVyYXRvci5TbGljZXIoe1xuICogICBmcmFtZVNpemU6IGZyYW1lU2l6ZSxcbiAqICAgaG9wU2l6ZTogaG9wU2l6ZSxcbiAqICAgY2VudGVyZWRUaW1lVGFnczogdHJ1ZVxuICogfSk7XG4gKlxuICogY29uc3QgcG93ZXIgPSBuZXcgbGZvLm9wZXJhdG9yLlJNUyh7XG4gKiAgIHBvd2VyOiB0cnVlLFxuICogfSk7XG4gKlxuICogY29uc3Qgc2VnbWVudGVyID0gbmV3IGxmby5vcGVyYXRvci5TZWdtZW50ZXIoe1xuICogICBsb2dJbnB1dDogdHJ1ZSxcbiAqICAgZmlsdGVyT3JkZXI6IDUsXG4gKiAgIHRocmVzaG9sZDogMyxcbiAqICAgb2ZmVGhyZXNob2xkOiAtSW5maW5pdHksXG4gKiAgIG1pbkludGVyOiAwLjA1MCxcbiAqICAgbWF4RHVyYXRpb246IDAuMDUwLFxuICogfSk7XG4gKlxuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IHRpbWU6IHRydWUgfSk7XG4gKlxuICogYXVkaW9Jbk5vZGUuY29ubmVjdChzbGljZXIpO1xuICogc2xpY2VyLmNvbm5lY3QocG93ZXIpO1xuICogcG93ZXIuY29ubmVjdChzZWdtZW50ZXIpO1xuICogc2VnbWVudGVyLmNvbm5lY3QobG9nZ2VyKTtcbiAqXG4gKiBhdWRpb0luTm9kZS5zdGFydCgpO1xuICovXG5jbGFzcyBTZWdtZW50ZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuaW5zaWRlU2VnbWVudCA9IGZhbHNlO1xuICAgIHRoaXMub25zZXRUaW1lID0gLUluZmluaXR5O1xuXG4gICAgLy8gc3RhdHNcbiAgICB0aGlzLm1pbiA9IEluZmluaXR5O1xuICAgIHRoaXMubWF4ID0gLUluZmluaXR5O1xuICAgIHRoaXMuc3VtID0gMDtcbiAgICB0aGlzLnN1bU9mU3F1YXJlcyA9IDA7XG4gICAgdGhpcy5jb3VudCA9IDA7XG5cbiAgICBjb25zdCBtaW5JbnB1dCA9IHRoaXMucGFyYW1zLmdldCgnbWluSW5wdXQnKTtcbiAgICBsZXQgZmlsbCA9IG1pbklucHV0O1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnbG9nSW5wdXQnKSAmJiBtaW5JbnB1dCA+IDApXG4gICAgICBmaWxsID0gTWF0aC5sb2cobWluSW5wdXQpO1xuXG4gICAgdGhpcy5tb3ZpbmdBdmVyYWdlID0gbmV3IE1vdmluZ0F2ZXJhZ2Uoe1xuICAgICAgb3JkZXI6IHRoaXMucGFyYW1zLmdldCgnZmlsdGVyT3JkZXInKSxcbiAgICAgIGZpbGw6IGZpbGwsXG4gICAgfSk7XG5cbiAgICB0aGlzLmxhc3RNdmF2cmcgPSBmaWxsO1xuICB9XG5cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpIHtcbiAgICBzdXBlci5vblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcyk7XG5cbiAgICBpZiAobmFtZSA9PT0gJ2ZpbHRlck9yZGVyJylcbiAgICAgIHRoaXMubW92aW5nQXZlcmFnZS5wYXJhbXMuc2V0KCdvcmRlcicsIHZhbHVlKTtcbiAgfVxuXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSA9ICd2ZWN0b3InO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IDU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gMDtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5kZXNjcmlwdGlvbiA9IFsnZHVyYXRpb24nLCAnbWluJywgJ21heCcsICdtZWFuJywgJ3N0ZGRldiddO1xuXG5cbiAgICB0aGlzLm1vdmluZ0F2ZXJhZ2UuaW5pdFN0cmVhbShwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICByZXNldFN0cmVhbSgpIHtcbiAgICBzdXBlci5yZXNldFN0cmVhbSgpO1xuICAgIHRoaXMubW92aW5nQXZlcmFnZS5yZXNldFN0cmVhbSgpO1xuICAgIHRoaXMucmVzZXRTZWdtZW50KCk7XG4gIH1cblxuICBmaW5hbGl6ZVN0cmVhbShlbmRUaW1lKSB7XG4gICAgaWYgKHRoaXMuaW5zaWRlU2VnbWVudClcbiAgICAgIHRoaXMub3V0cHV0U2VnbWVudChlbmRUaW1lKTtcblxuICAgIHN1cGVyLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICB9XG5cbiAgcmVzZXRTZWdtZW50KCkge1xuICAgIHRoaXMuaW5zaWRlU2VnbWVudCA9IGZhbHNlO1xuICAgIHRoaXMub25zZXRUaW1lID0gLUluZmluaXR5O1xuICAgIC8vIHN0YXRzXG4gICAgdGhpcy5taW4gPSBJbmZpbml0eTtcbiAgICB0aGlzLm1heCA9IC1JbmZpbml0eTtcbiAgICB0aGlzLnN1bSA9IDA7XG4gICAgdGhpcy5zdW1PZlNxdWFyZXMgPSAwO1xuICAgIHRoaXMuY291bnQgPSAwO1xuICB9XG5cbiAgb3V0cHV0U2VnbWVudChlbmRUaW1lKSB7XG4gICAgY29uc3Qgb3V0RGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBvdXREYXRhWzBdID0gZW5kVGltZSAtIHRoaXMub25zZXRUaW1lO1xuICAgIG91dERhdGFbMV0gPSB0aGlzLm1pbjtcbiAgICBvdXREYXRhWzJdID0gdGhpcy5tYXg7XG5cbiAgICBjb25zdCBub3JtID0gMSAvIHRoaXMuY291bnQ7XG4gICAgY29uc3QgbWVhbiA9IHRoaXMuc3VtICogbm9ybTtcbiAgICBjb25zdCBtZWFuT2ZTcXVhcmUgPSB0aGlzLnN1bU9mU3F1YXJlcyAqIG5vcm07XG4gICAgY29uc3Qgc3F1YXJlT2ZtZWFuID0gbWVhbiAqIG1lYW47XG5cbiAgICBvdXREYXRhWzNdID0gbWVhbjtcbiAgICBvdXREYXRhWzRdID0gMDtcblxuICAgIGlmIChtZWFuT2ZTcXVhcmUgPiBzcXVhcmVPZm1lYW4pXG4gICAgICBvdXREYXRhWzRdID0gTWF0aC5zcXJ0KG1lYW5PZlNxdWFyZSAtIHNxdWFyZU9mbWVhbik7XG5cbiAgICB0aGlzLmZyYW1lLnRpbWUgPSB0aGlzLm9uc2V0VGltZTtcblxuICAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcbiAgfVxuXG4gIHByb2Nlc3NTaWduYWwoZnJhbWUpIHtcbiAgICBjb25zdCBsb2dJbnB1dCA9IHRoaXMucGFyYW1zLmdldCgnbG9nSW5wdXQnKTtcbiAgICBjb25zdCBtaW5JbnB1dCA9IHRoaXMucGFyYW1zLmdldCgnbWluSW5wdXQnKTtcbiAgICBjb25zdCB0aHJlc2hvbGQgPSB0aGlzLnBhcmFtcy5nZXQoJ3RocmVzaG9sZCcpO1xuICAgIGNvbnN0IG1pbkludGVyID0gdGhpcy5wYXJhbXMuZ2V0KCdtaW5JbnRlcicpO1xuICAgIGNvbnN0IG1heER1cmF0aW9uID0gdGhpcy5wYXJhbXMuZ2V0KCdtYXhEdXJhdGlvbicpO1xuICAgIGNvbnN0IG9mZlRocmVzaG9sZCA9IHRoaXMucGFyYW1zLmdldCgnb2ZmVGhyZXNob2xkJyk7XG4gICAgY29uc3QgcmF3VmFsdWUgPSBmcmFtZS5kYXRhWzBdO1xuICAgIGNvbnN0IHRpbWUgPSBmcmFtZS50aW1lO1xuICAgIGxldCB2YWx1ZSA9IE1hdGgubWF4KHJhd1ZhbHVlLCBtaW5JbnB1dCk7XG5cbiAgICBpZiAobG9nSW5wdXQpXG4gICAgICB2YWx1ZSA9IE1hdGgubG9nKHZhbHVlKTtcblxuICAgIGNvbnN0IGRpZmYgPSB2YWx1ZSAtIHRoaXMubGFzdE12YXZyZztcbiAgICB0aGlzLmxhc3RNdmF2cmcgPSB0aGlzLm1vdmluZ0F2ZXJhZ2UuaW5wdXRTY2FsYXIodmFsdWUpO1xuXG4gICAgLy8gdXBkYXRlIGZyYW1lIG1ldGFkYXRhXG4gICAgdGhpcy5mcmFtZS5tZXRhZGF0YSA9IGZyYW1lLm1ldGFkYXRhO1xuXG4gICAgaWYgKGRpZmYgPiB0aHJlc2hvbGQgJiYgdGltZSAtIHRoaXMub25zZXRUaW1lID4gbWluSW50ZXIpIHtcbiAgICAgIGlmICh0aGlzLmluc2lkZVNlZ21lbnQpXG4gICAgICAgIHRoaXMub3V0cHV0U2VnbWVudCh0aW1lKTtcblxuICAgICAgLy8gc3RhcnQgc2VnbWVudFxuICAgICAgdGhpcy5pbnNpZGVTZWdtZW50ID0gdHJ1ZTtcbiAgICAgIHRoaXMub25zZXRUaW1lID0gdGltZTtcbiAgICAgIHRoaXMubWF4ID0gLUluZmluaXR5O1xuICAgIH1cblxuICAgIGlmICh0aGlzLmluc2lkZVNlZ21lbnQpIHtcbiAgICAgIHRoaXMubWluID0gbWluKHRoaXMubWluLCByYXdWYWx1ZSk7XG4gICAgICB0aGlzLm1heCA9IG1heCh0aGlzLm1heCwgcmF3VmFsdWUpO1xuICAgICAgdGhpcy5zdW0gKz0gcmF3VmFsdWU7XG4gICAgICB0aGlzLnN1bU9mU3F1YXJlcyArPSByYXdWYWx1ZSAqIHJhd1ZhbHVlO1xuICAgICAgdGhpcy5jb3VudCsrO1xuXG4gICAgICBpZiAodGltZSAtIHRoaXMub25zZXRUaW1lID49IG1heER1cmF0aW9uIHx8IHZhbHVlIDw9IG9mZlRocmVzaG9sZCkge1xuICAgICAgICB0aGlzLm91dHB1dFNlZ21lbnQodGltZSk7XG4gICAgICAgIHRoaXMuaW5zaWRlU2VnbWVudCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIHRoaXMucHJlcGFyZUZyYW1lKCk7XG4gICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuICAgIC8vIGRvIG5vdCBwcm9wYWdhdGUgaGVyZSBhcyB0aGUgZnJhbWVSYXRlIGlzIG5vdyB6ZXJvXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VnbWVudGVyO1xuIiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGluZGV4OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgaW5kaWNlczoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfVxufTtcblxuLyoqXG4gKiBTZWxlY3Qgb25lIG9yIHNldmVyYWwgaW5kaWNlcyBmcm9tIGEgYHZlY3RvcmAgaW5wdXQuIElmIG9ubHkgb25lIGluZGV4IGlzXG4gKiBzZWxlY3RlZCwgdGhlIG91dHB1dCB3aWxsIGJlIG9mIHR5cGUgYHNjYWxhcmAsIG90aGVyd2lzZSB0aGUgb3V0cHV0IHdpbGxcbiAqIGJlIGEgdmVjdG9yIGNvbnRhaW5pbmcgdGhlIHNlbGVjdGVkIGluZGljZXMuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24ub3BlcmF0b3JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgdmFsdWVzLlxuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMuaW5kZXggLSBJbmRleCB0byBzZWxlY3QgZnJvbSB0aGUgaW5wdXQgZnJhbWUuXG4gKiBAcGFyYW0ge0FycmF5PE51bWJlcj59IG9wdGlvbnMuaW5kaWNlcyAtIEluZGljZXMgdG8gc2VsZWN0IGZyb20gdGhlIGlucHV0XG4gKiAgZnJhbWUsIGlmIGRlZmluZWQsIHRha2UgcHJlY2VkYW5jZSBvdmVyIGBvcHRpb24uaW5kZXhgLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NvbW1vbic7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVR5cGU6ICd2ZWN0b3InLFxuICogICBmcmFtZVNpemU6IDMsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBzZWxlY3QgPSBuZXcgbGZvLm9wZXJhdG9yLlNlbGVjdCh7XG4gKiAgIGluZGV4OiAxLFxuICogfSk7XG4gKlxuICogZXZlbnRJbi5zdGFydCgpO1xuICogZXZlbnRJbi5wcm9jZXNzKDAsIFswLCAxLCAyXSk7XG4gKiA+IDFcbiAqIGV2ZW50SW4ucHJvY2VzcygwLCBbMywgNCwgNV0pO1xuICogPiA0XG4gKi9cbmNsYXNzIFNlbGVjdCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnBhcmFtcy5nZXQoJ2luZGV4Jyk7XG4gICAgY29uc3QgaW5kaWNlcyA9IHRoaXMucGFyYW1zLmdldCgnaW5kaWNlcycpO1xuXG4gICAgbGV0IG1heCA9IChpbmRpY2VzICE9PSBudWxsKSA/ICBNYXRoLm1heC5hcHBseShudWxsLCBpbmRpY2VzKSA6IGluZGV4O1xuXG4gICAgaWYgKG1heCA+PSBwcmV2U3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzZWxlY3QgaW5kZXggXCIke21heH1cImApO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gKGluZGljZXMgIT09IG51bGwpID8gJ3ZlY3RvcicgOiAnc2NhbGFyJztcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSAoaW5kaWNlcyAhPT0gbnVsbCkgPyBpbmRpY2VzLmxlbmd0aCA6IDE7XG5cbiAgICB0aGlzLnNlbGVjdCA9IChpbmRpY2VzICE9PSBudWxsKSA/IGluZGljZXMgOiBbaW5kZXhdO1xuXG4gICAgLy8gc3RlYWwgZGVzY3JpcHRpb24oKSBmcm9tIHBhcmVudFxuICAgIGlmIChwcmV2U3RyZWFtUGFyYW1zLmRlc2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnNlbGVjdC5mb3JFYWNoKCh2YWwsIGluZGV4KSA9PiB7XG4gICAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmRlc2NyaXB0aW9uW2luZGV4XSA9IHByZXZTdHJlYW1QYXJhbXMuZGVzY3JpcHRpb25bdmFsXTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcihmcmFtZSkge1xuICAgIGNvbnN0IGRhdGEgPSBmcmFtZS5kYXRhO1xuICAgIGNvbnN0IG91dERhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3Qgc2VsZWN0ID0gdGhpcy5zZWxlY3Q7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdC5sZW5ndGg7IGkrKylcbiAgICAgIG91dERhdGFbaV0gPSBkYXRhW3NlbGVjdFtpXV07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0O1xuIiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGZyYW1lU2l6ZToge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiA1MTIsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgaG9wU2l6ZTogeyAvLyBzaG91bGQgYmUgbnVsbGFibGVcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBjZW50ZXJlZFRpbWVUYWdzOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICB9XG59XG5cbi8qKlxuICogQ2hhbmdlIHRoZSBgZnJhbWVTaXplYCBhbmQgYGhvcFNpemVgIG9mIGEgYHNpZ25hbGAgaW5wdXQgYWNjb3JkaW5nIHRvXG4gKiB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAqIFRoaXMgb3BlcmF0b3IgdXBkYXRlcyB0aGUgc3RyZWFtIHBhcmFtZXRlcnMgYWNjb3JkaW5nIHRvIGl0cyBjb25maWd1cmF0aW9uLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZnJhbWVTaXplPTUxMl0gLSBGcmFtZSBzaXplIG9mIHRoZSBvdXRwdXQgc2lnbmFsLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmhvcFNpemU9bnVsbF0gLSBOdW1iZXIgb2Ygc2FtcGxlcyBiZXR3ZWVuIHR3b1xuICogIGNvbnNlY3V0aXZlIGZyYW1lcy4gSWYgbnVsbCwgYGhvcFNpemVgIGlzIHNldCB0byBgZnJhbWVTaXplYC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuY2VudGVyZWRUaW1lVGFnc10gLSBNb3ZlIHRoZSB0aW1lIHRhZyB0byB0aGUgbWlkZGxlXG4gKiAgb2YgdGhlIGZyYW1lLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NvbW1vbic7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVR5cGU6ICdzaWduYWwnLFxuICogICBmcmFtZVNpemU6IDEwLFxuICogICBzYW1wbGVSYXRlOiAyLFxuICogfSk7XG4gKlxuICogY29uc3Qgc2xpY2VyID0gbmV3IGxmby5vcGVyYXRvci5TbGljZXIoe1xuICogICBmcmFtZVNpemU6IDQsXG4gKiAgIGhvcFNpemU6IDJcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGxvZ2dlciA9IG5ldyBsZm8uc2luay5Mb2dnZXIoeyB0aW1lOiB0cnVlLCBkYXRhOiB0cnVlIH0pO1xuICpcbiAqIGV2ZW50SW4uY29ubmVjdChzbGljZXIpO1xuICogc2xpY2VyLmNvbm5lY3QobG9nZ2VyKTtcbiAqIGV2ZW50SW4uc3RhcnQoKTtcbiAqXG4gKiBldmVudEluLnByb2Nlc3MoMCwgWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDldKTtcbiAqID4geyB0aW1lOiAwLCBkYXRhOiBbMCwgMSwgMiwgM10gfVxuICogPiB7IHRpbWU6IDEsIGRhdGE6IFsyLCAzLCA0LCA1XSB9XG4gKiA+IHsgdGltZTogMiwgZGF0YTogWzQsIDUsIDYsIDddIH1cbiAqID4geyB0aW1lOiAzLCBkYXRhOiBbNiwgNywgOCwgOV0gfVxuICovXG5jbGFzcyBTbGljZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgaG9wU2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnaG9wU2l6ZScpO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnZnJhbWVTaXplJyk7XG5cbiAgICBpZiAoIWhvcFNpemUpXG4gICAgICB0aGlzLnBhcmFtcy5zZXQoJ2hvcFNpemUnLCBmcmFtZVNpemUpO1xuXG4gICAgdGhpcy5wYXJhbXMuYWRkTGlzdGVuZXIodGhpcy5vblBhcmFtVXBkYXRlLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5mcmFtZUluZGV4ID0gMDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICBjb25zdCBob3BTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdob3BTaXplJyk7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdmcmFtZVNpemUnKTtcblxuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IGZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSBwcmV2U3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgLyBob3BTaXplO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICByZXNldFN0cmVhbSgpIHtcbiAgICBzdXBlci5yZXNldFN0cmVhbSgpO1xuICAgIHRoaXMuZnJhbWVJbmRleCA9IDA7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgZmluYWxpemVTdHJlYW0oZW5kVGltZSkge1xuICAgIGlmICh0aGlzLmZyYW1lSW5kZXggPiAwKSB7XG4gICAgICBjb25zdCBmcmFtZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGU7XG4gICAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgICBjb25zdCBkYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgICAgLy8gc2V0IHRoZSB0aW1lIG9mIHRoZSBsYXN0IGZyYW1lXG4gICAgICB0aGlzLmZyYW1lLnRpbWUgKz0gKDEgLyBmcmFtZVJhdGUpO1xuXG4gICAgICBmb3IgKGxldCBpID0gdGhpcy5mcmFtZUluZGV4OyBpIDwgZnJhbWVTaXplOyBpKyspXG4gICAgICAgIGRhdGFbaV0gPSAwO1xuXG4gICAgICB0aGlzLnByb3BhZ2F0ZUZyYW1lKCk7XG4gICAgfVxuXG4gICAgc3VwZXIuZmluYWxpemVTdHJlYW0oZW5kVGltZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgdGhpcy5wcmVwYXJlRnJhbWUoKTtcbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIGNvbnN0IHRpbWUgPSBmcmFtZS50aW1lO1xuICAgIGNvbnN0IGJsb2NrID0gZnJhbWUuZGF0YTtcbiAgICBjb25zdCBtZXRhZGF0YSA9IGZyYW1lLm1ldGFkYXRhO1xuXG4gICAgY29uc3QgY2VudGVyZWRUaW1lVGFncyA9IHRoaXMucGFyYW1zLmdldCgnY2VudGVyZWRUaW1lVGFncycpO1xuICAgIGNvbnN0IGhvcFNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ2hvcFNpemUnKTtcbiAgICBjb25zdCBvdXRGcmFtZSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG4gICAgY29uc3Qgc2FtcGxlUGVyaW9kID0gMSAvIHNhbXBsZVJhdGU7XG4gICAgY29uc3QgYmxvY2tTaXplID0gYmxvY2subGVuZ3RoO1xuXG4gICAgbGV0IGZyYW1lSW5kZXggPSB0aGlzLmZyYW1lSW5kZXg7XG4gICAgbGV0IGJsb2NrSW5kZXggPSAwO1xuXG4gICAgd2hpbGUgKGJsb2NrSW5kZXggPCBibG9ja1NpemUpIHtcbiAgICAgIGxldCBudW1Ta2lwID0gMDtcblxuICAgICAgLy8gc2tpcCBibG9jayBzYW1wbGVzIGZvciBuZWdhdGl2ZSBmcmFtZUluZGV4IChmcmFtZVNpemUgPCBob3BTaXplKVxuICAgICAgaWYgKGZyYW1lSW5kZXggPCAwKSB7XG4gICAgICAgIG51bVNraXAgPSAtZnJhbWVJbmRleDtcbiAgICAgICAgZnJhbWVJbmRleCA9IDA7IC8vIHJlc2V0IGBmcmFtZUluZGV4YFxuICAgICAgfVxuXG4gICAgICBpZiAobnVtU2tpcCA8IGJsb2NrU2l6ZSkge1xuICAgICAgICBibG9ja0luZGV4ICs9IG51bVNraXA7IC8vIHNraXAgYmxvY2sgc2VnbWVudFxuICAgICAgICAvLyBjYW4gY29weSBhbGwgdGhlIHJlc3Qgb2YgdGhlIGluY29taW5nIGJsb2NrXG4gICAgICAgIGxldCBudW1Db3B5ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDtcbiAgICAgICAgLy8gY29ubm90IGNvcHkgbW9yZSB0aGFuIHdoYXQgZml0cyBpbnRvIHRoZSBmcmFtZVxuICAgICAgICBjb25zdCBtYXhDb3B5ID0gZnJhbWVTaXplIC0gZnJhbWVJbmRleDtcblxuICAgICAgICBpZiAobnVtQ29weSA+PSBtYXhDb3B5KVxuICAgICAgICAgIG51bUNvcHkgPSBtYXhDb3B5O1xuXG4gICAgICAgIC8vIGNvcHkgYmxvY2sgc2VnbWVudCBpbnRvIGZyYW1lXG4gICAgICAgIGNvbnN0IGNvcHkgPSBibG9jay5zdWJhcnJheShibG9ja0luZGV4LCBibG9ja0luZGV4ICsgbnVtQ29weSk7XG4gICAgICAgIG91dEZyYW1lLnNldChjb3B5LCBmcmFtZUluZGV4KTtcbiAgICAgICAgLy8gYWR2YW5jZSBibG9jayBhbmQgZnJhbWUgaW5kZXhcbiAgICAgICAgYmxvY2tJbmRleCArPSBudW1Db3B5O1xuICAgICAgICBmcmFtZUluZGV4ICs9IG51bUNvcHk7XG5cbiAgICAgICAgLy8gc2VuZCBmcmFtZSB3aGVuIGNvbXBsZXRlZFxuICAgICAgICBpZiAoZnJhbWVJbmRleCA9PT0gZnJhbWVTaXplKSB7XG4gICAgICAgICAgLy8gZGVmaW5lIHRpbWUgdGFnIGZvciB0aGUgb3V0RnJhbWUgYWNjb3JkaW5nIHRvIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICBpZiAoY2VudGVyZWRUaW1lVGFncylcbiAgICAgICAgICAgIHRoaXMuZnJhbWUudGltZSA9IHRpbWUgKyAoYmxvY2tJbmRleCAtIGZyYW1lU2l6ZSAvIDIpICogc2FtcGxlUGVyaW9kO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuZnJhbWUudGltZSA9IHRpbWUgKyAoYmxvY2tJbmRleCAtIGZyYW1lU2l6ZSkgKiBzYW1wbGVQZXJpb2Q7XG5cbiAgICAgICAgICB0aGlzLmZyYW1lLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgICAgLy8gZm9yd2FyZCB0byBuZXh0IG5vZGVzXG4gICAgICAgICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuXG4gICAgICAgICAgLy8gc2hpZnQgZnJhbWUgbGVmdFxuICAgICAgICAgIGlmIChob3BTaXplIDwgZnJhbWVTaXplKVxuICAgICAgICAgICAgb3V0RnJhbWUuc2V0KG91dEZyYW1lLnN1YmFycmF5KGhvcFNpemUsIGZyYW1lU2l6ZSksIDApO1xuXG4gICAgICAgICAgZnJhbWVJbmRleCAtPSBob3BTaXplOyAvLyBob3AgZm9yd2FyZFxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBza2lwIGVudGlyZSBibG9ja1xuICAgICAgICBjb25zdCBibG9ja1Jlc3QgPSBibG9ja1NpemUgLSBibG9ja0luZGV4O1xuICAgICAgICBmcmFtZUluZGV4ICs9IGJsb2NrUmVzdDtcbiAgICAgICAgYmxvY2tJbmRleCArPSBibG9ja1Jlc3Q7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5mcmFtZUluZGV4ID0gZnJhbWVJbmRleDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTbGljZXI7XG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuXG5jb25zdCBjZWlsID0gTWF0aC5jZWlsO1xuXG4vKipcbiAqIHBhcGVyOiBodHRwOi8vcmVjaGVyY2hlLmlyY2FtLmZyL2VxdWlwZXMvcGNtL2NoZXZlaWduL3Bzcy8yMDAyX0pBU0FfWUlOLnBkZlxuICogaW1wbGVtZW50YXRpb24gYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2FzaG9rZmVybmFuZGV6L1lpbi1QaXRjaC1UcmFja2luZ1xuICogQHByaXZhdGVcbiAqL1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgdGhyZXNob2xkOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiAwLjEsIC8vIGRlZmF1bHQgZnJvbSBwYXBlclxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIGRvd25TYW1wbGluZ0V4cDogeyAvLyBkb3duc2FtcGxpbmcgZmFjdG9yXG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDIsXG4gICAgbWluOiAwLFxuICAgIG1heDogMyxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBtaW5GcmVxOiB7IC8vXG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiA2MCwgLy8gbWVhbiA3MzUgc2FtcGxlc1xuICAgIG1pbjogMCxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxufVxuXG4vKipcbiAqIFlpbiBmdW5kYW1lbnRhbCBmcmVxdWVuY3kgZXN0aW1hdG9yLCBiYXNlZCBvbiBhbGdvcml0aG0gZGVzY3JpYmVkIGluXG4gKiBbWUlOLCBhIGZ1bmRhbWVudGFsIGZyZXF1ZW5jeSBlc3RpbWF0b3IgZm9yIHNwZWVjaCBhbmQgbXVzaWNdKGh0dHA6Ly9yZWNoZXJjaGUuaXJjYW0uZnIvZXF1aXBlcy9wY20vY2hldmVpZ24vcHNzLzIwMDJfSkFTQV9ZSU4ucGRmKVxuICogYnkgQ2hldmVpZ25lIGFuZCBLYXdhaGFyYS5cbiAqIE9uIGVhY2ggZnJhbWUsIHRoaXMgb3BlcmF0b3IgcHJvcGFnYXRlIGEgdmVjdG9yIGNvbnRhaW5pbmcgdGhlIGZvbGxvd2luZ1xuICogdmFsdWVzOiBgZnJlcXVlbmN5YCwgYHByb2JhYmlsaXR5YC5cbiAqXG4gKiBGb3IgZ29vZCByZXN1bHRzIHRoZSBpbnB1dCBmcmFtZSBzaXplIHNob3VsZCBiZSBsYXJnZSAoMTAyNCBvciAyMDQ4KS5cbiAqXG4gKiBfc3VwcG9ydCBgc3RhbmRhbG9uZWAgdXNhZ2VfXG4gKlxuICogQG5vdGUgLSBJbiBub2RlIGZvciBhIGZyYW1lIG9mIDIwNDggc2FtcGxlcywgYXZlcmFnZSBjb21wdXRhdGlvbiB0aW1lIGlzOlxuICogICAgICAgICAwLjAwMDE2NzQyMjgzMzM5OTkzMzg5IHNlY29uZC5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnRocmVzaG9sZD0wLjFdIC0gQWJzb2x1dGUgdGhyZXNob2xkIHRvIHRlc3QgdGhlXG4gKiAgbm9ybWFsaXplZCBkaWZmZXJlbmNlIChzZWUgcGFwZXIgZm9yIG1vcmUgaW5mb3JtYXRpb25zKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5kb3duU2FtcGxpbmdFeHA9Ml0gLSBEb3duIHNhbXBsZSB0aGUgaW5wdXQgZnJhbWUgYnlcbiAqICBhIGZhY3RvciBvZiAyIGF0IHRoZSBwb3dlciBvZiBgZG93blNhbXBsaW5nRXhwYCAobWluPTAgYW5kIG1heD0zKSBmb3JcbiAqICBwZXJmb3JtYW5jZSBpbXByb3ZlbWVudHMuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWluRnJlcT02MF0gLSBNaW5pbXVtIGZyZXF1ZW5jeSB0aGUgb3BlcmF0b3IgY2FuXG4gKiAgc2VhcmNoIGZvci4gVGhpcyBwYXJhbWV0ZXIgZGVmaW5lcyB0aGUgc2l6ZSBvZiB0aGUgYXV0b2NvcnJlbGF0aW9uIHBlcmZvcm1lZFxuICogIG9uIHRoZSBzaWduYWwsIHRoZSBpbnB1dCBmcmFtZSBzaXplIHNob3VsZCBiZSBhcm91bmQgMiB0aW1lIHRoaXMgc2l6ZSBmb3JcbiAqICBnb29kIHJlc3VsdHMgKGkuZS4gYGlucHV0RnJhbWVTaXplIOKJiCAyICogKHNhbXBsaW5nUmF0ZSAvIG1pbkZyZXEpYCkuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiAvLyBhc3N1bWluZyBzb21lIEF1ZGlvQnVmZmVyXG4gKiBjb25zdCBzb3VyY2UgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luQnVmZmVyKHtcbiAqICAgYXVkaW9CdWZmZXI6IGF1ZGlvQnVmZmVyLFxuICogfSk7XG4gKlxuICogY29uc3Qgc2xpY2VyID0gbmV3IGxmby5vcGVyYXRvci5TbGljZXIoe1xuICogICBmcmFtZVNpemU6IDIwNDgsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCB5aW4gPSBuZXcgbGZvLm9wZXJhdG9yLllpbigpO1xuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IGRhdGE6IHRydWUgfSk7XG4gKlxuICogc291cmNlLmNvbm5lY3Qoc2xpY2VyKTtcbiAqIHNsaWNlci5jb25uZWN0KHlpbik7XG4gKiB5aW4uY29ubmVjdChsb2dnZXIpO1xuICpcbiAqIHNvdXJjZS5zdGFydCgpO1xuICovXG5jbGFzcyBZaW4gZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMucHJvYmFiaWxpdHkgPSAwO1xuICAgIHRoaXMucGl0Y2ggPSAtMTtcblxuICAgIHRoaXMudGVzdCA9IDA7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2Rvd25zYW1wbGUoaW5wdXQsIHNpemUsIG91dHB1dCwgZG93blNhbXBsaW5nRXhwKSB7XG4gICAgY29uc3Qgb3V0cHV0U2l6ZSA9IHNpemUgPj4gZG93blNhbXBsaW5nRXhwO1xuICAgIGxldCBpLCBqO1xuXG4gICAgc3dpdGNoIChkb3duU2FtcGxpbmdFeHApIHtcbiAgICAgIGNhc2UgMDogLy8gbm8gZG93biBzYW1wbGluZ1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc2l6ZTsgaSsrKVxuICAgICAgICAgIG91dHB1dFtpXSA9IGlucHV0W2ldO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICBmb3IgKGkgPSAwLCBqID0gMDsgaSA8IG91dHB1dFNpemU7IGkrKywgaiArPSAyKVxuICAgICAgICAgIG91dHB1dFtpXSA9IDAuNSAqIChpbnB1dFtqXSArIGlucHV0W2ogKyAxXSk7XG5cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgZm9yIChpID0gMCwgaiA9IDA7IGkgPCBvdXRwdXRTaXplOyBpKyssIGogKz0gNClcbiAgICAgICAgICBvdXRwdXRbaV0gPSAwLjI1ICogKGlucHV0W2pdICsgaW5wdXRbaiArIDFdICsgaW5wdXRbaiArIDJdICsgaW5wdXRbaiArIDNdKTtcblxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgZm9yIChpID0gMCwgaiA9IDA7IGkgPCBvdXRwdXRTaXplOyBpKyssIGogKz0gOClcbiAgICAgICAgICBvdXRwdXRbaV0gPSAwLjEyNSAqIChpbnB1dFtqXSArIGlucHV0W2ogKyAxXSArIGlucHV0W2ogKyAyXSArIGlucHV0W2ogKyAzXSArIGlucHV0W2ogKyA0XSArIGlucHV0W2ogKyA1XSArIGlucHV0W2ogKyA2XSArIGlucHV0W2ogKyA3XSk7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dFNpemU7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3ZlY3Rvcic7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gMjtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5kZXNjcmlwdGlvbiA9IFsnZnJlcXVlbmN5JywgJ2NvbmZpZGVuY2UnXTtcblxuICAgIHRoaXMuaW5wdXRGcmFtZVNpemUgPSBwcmV2U3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICAvLyBoYW5kbGUgcGFyYW1zXG4gICAgY29uc3Qgc291cmNlU2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG4gICAgY29uc3QgZG93blNhbXBsaW5nRXhwID0gdGhpcy5wYXJhbXMuZ2V0KCdkb3duU2FtcGxpbmdFeHAnKTtcbiAgICBjb25zdCBkb3duRmFjdG9yID0gMSA8PCBkb3duU2FtcGxpbmdFeHA7IC8vIDJeblxuICAgIGNvbnN0IGRvd25TUiA9IHNvdXJjZVNhbXBsZVJhdGUgLyBkb3duRmFjdG9yO1xuICAgIGNvbnN0IGRvd25GcmFtZVNpemUgPSB0aGlzLmlucHV0RnJhbWVTaXplIC8gZG93bkZhY3RvcjsgLy8gbl90aWNrX2Rvd24gLy8gMSAvIDJeblxuXG4gICAgY29uc3QgbWluRnJlcSA9IHRoaXMucGFyYW1zLmdldCgnbWluRnJlcScpO1xuICAgIC8vIGxpbWl0IG1pbiBmcmVxLCBjZi4gcGFwZXIgSVYuIHNlbnNpdGl2aXR5IHRvIHBhcmFtZXRlcnNcbiAgICBjb25zdCBtaW5GcmVxTmJyU2FtcGxlcyA9IGRvd25TUiAvIG1pbkZyZXE7XG4gICAgLy8gY29uc3QgYnVmZmVyU2l6ZSA9IHByZXZTdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuaGFsZkJ1ZmZlclNpemUgPSBkb3duRnJhbWVTaXplIC8gMjtcblxuICAgIC8vIG1pbmltdW0gZXJyb3IgdG8gbm90IGNyYXNoIGJ1dCBub3QgZW5vdWdodCB0byBoYXZlIHJlc3VsdHNcbiAgICBpZiAobWluRnJlcU5iclNhbXBsZXMgPiB0aGlzLmhhbGZCdWZmZXJTaXplKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGlucHV0IGZyYW1lIHNpemUsIHRvbyBzbWFsbCBmb3IgZ2l2ZW4gXCJtaW5GcmVxXCInKTtcblxuICAgIHRoaXMuZG93blNhbXBsaW5nRXhwID0gZG93blNhbXBsaW5nRXhwO1xuICAgIHRoaXMuZG93blNhbXBsaW5nUmF0ZSA9IGRvd25TUjtcbiAgICB0aGlzLmRvd25GcmFtZVNpemUgPSBkb3duRnJhbWVTaXplO1xuICAgIHRoaXMuYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShkb3duRnJhbWVTaXplKTtcbiAgICAvLyBhdXRvY29ycmVsYXRpb24gYnVmZmVyXG4gICAgdGhpcy55aW5CdWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuaGFsZkJ1ZmZlclNpemUpO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZG93bnNhbXBsZShpbnB1dCwgc2l6ZSwgb3V0cHV0LCBkb3duU2FtcGxpbmdFeHApIHtcbiAgICBjb25zdCBvdXRwdXRTaXplID0gc2l6ZSA+PiBkb3duU2FtcGxpbmdFeHA7XG4gICAgbGV0IGksIGo7XG5cbiAgICBzd2l0Y2ggKGRvd25TYW1wbGluZ0V4cCkge1xuICAgICAgY2FzZSAwOiAvLyBubyBkb3duIHNhbXBsaW5nXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBzaXplOyBpKyspXG4gICAgICAgICAgb3V0cHV0W2ldID0gaW5wdXRbaV07XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGZvciAoaSA9IDAsIGogPSAwOyBpIDwgb3V0cHV0U2l6ZTsgaSsrLCBqICs9IDIpXG4gICAgICAgICAgb3V0cHV0W2ldID0gMC41ICogKGlucHV0W2pdICsgaW5wdXRbaiArIDFdKTtcblxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICBmb3IgKGkgPSAwLCBqID0gMDsgaSA8IG91dHB1dFNpemU7IGkrKywgaiArPSA0KVxuICAgICAgICAgIG91dHB1dFtpXSA9IDAuMjUgKiAoaW5wdXRbal0gKyBpbnB1dFtqICsgMV0gKyBpbnB1dFtqICsgMl0gKyBpbnB1dFtqICsgM10pO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBmb3IgKGkgPSAwLCBqID0gMDsgaSA8IG91dHB1dFNpemU7IGkrKywgaiArPSA4KVxuICAgICAgICAgIG91dHB1dFtpXSA9IDAuMTI1ICogKGlucHV0W2pdICsgaW5wdXRbaiArIDFdICsgaW5wdXRbaiArIDJdICsgaW5wdXRbaiArIDNdICsgaW5wdXRbaiArIDRdICsgaW5wdXRbaiArIDVdICsgaW5wdXRbaiArIDZdICsgaW5wdXRbaiArIDddKTtcblxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0cHV0U2l6ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGVwIDEsIDIgYW5kIDMgLSBTcXVhcmVkIGRpZmZlcmVuY2Ugb2YgdGhlIHNoaWZ0ZWQgc2lnbmFsIHdpdGggaXRzZWxmLlxuICAgKiBjdW11bGF0aXZlIG1lYW4gbm9ybWFsaXplZCBkaWZmZXJlbmNlLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX25vcm1hbGl6ZWREaWZmZXJlbmNlKGJ1ZmZlcikge1xuICAgIGNvbnN0IGhhbGZCdWZmZXJTaXplID0gdGhpcy5oYWxmQnVmZmVyU2l6ZTtcbiAgICBjb25zdCB5aW5CdWZmZXIgPSB0aGlzLnlpbkJ1ZmZlcjtcbiAgICBsZXQgc3VtID0gMDtcblxuICAgIC8vIGRpZmZlcmVuY2UgZm9yIGRpZmZlcmVudCBzaGlmdCB2YWx1ZXMgKHRhdSlcbiAgICBmb3IgKGxldCB0YXUgPSAwOyB0YXUgPCBoYWxmQnVmZmVyU2l6ZTsgdGF1KyspIHtcbiAgICAgIGxldCBzcXVhcmVkRGlmZmVyZW5jZSA9IDA7IC8vIHJlc2V0IGJ1ZmZlclxuXG4gICAgICAvLyB0YWtlIGRpZmZlcmVuY2Ugb2YgdGhlIHNpZ25hbCB3aXRoIGEgc2hpZnRlZCB2ZXJzaW9uIG9mIGl0c2VsZiB0aGVuXG4gICAgICAvLyBzcWF1cmUgdGhlIHJlc3VsdFxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYWxmQnVmZmVyU2l6ZTsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gYnVmZmVyW2ldIC0gYnVmZmVyW2kgKyB0YXVdO1xuICAgICAgICBzcXVhcmVkRGlmZmVyZW5jZSArPSBkZWx0YSAqIGRlbHRhO1xuICAgICAgfVxuXG4gICAgICAvLyBzdGVwIDMgLSBub3JtYWxpemUgeWluQnVmZmVyXG4gICAgICBpZiAodGF1ID4gMCkge1xuICAgICAgICBzdW0gKz0gc3F1YXJlZERpZmZlcmVuY2U7XG4gICAgICAgIHlpbkJ1ZmZlclt0YXVdID0gc3F1YXJlZERpZmZlcmVuY2UgKiAodGF1IC8gc3VtKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB5aW5CdWZmZXJbMF0gPSAxO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0ZXAgNCAtIGZpbmQgZmlyc3QgYmVzdCB0YXUgdGhhdCBpcyB1bmRlciB0aGUgdGhyZXNvbGQuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWJzb2x1dGVUaHJlc2hvbGQoKSB7XG4gICAgY29uc3QgdGhyZXNob2xkID0gdGhpcy5wYXJhbXMuZ2V0KCd0aHJlc2hvbGQnKTtcbiAgICBjb25zdCB5aW5CdWZmZXIgPSB0aGlzLnlpbkJ1ZmZlcjtcbiAgICBjb25zdCBoYWxmQnVmZmVyU2l6ZSA9IHRoaXMuaGFsZkJ1ZmZlclNpemU7XG4gICAgbGV0IHRhdTtcblxuICAgIGZvciAodGF1ID0gMTsgdGF1IDwgaGFsZkJ1ZmZlclNpemU7IHRhdSsrKSB7XG4gICAgICBpZiAoeWluQnVmZmVyW3RhdV0gPCB0aHJlc2hvbGQpIHtcbiAgICAgICAgLy8ga2VlcCBpbmNyZWFzaW5nIHRhdSBpZiBuZXh0IHZhbHVlIGlzIGJldHRlclxuICAgICAgICB3aGlsZSAodGF1ICsgMSA8IGhhbGZCdWZmZXJTaXplICYmIHlpbkJ1ZmZlclt0YXUgKyAxXSA8IHlpbkJ1ZmZlclt0YXVdKVxuICAgICAgICAgIHRhdSArPSAxO1xuXG4gICAgICAgIC8vIGJlc3QgdGF1IGZvdW5kICwgeWluQnVmZmVyW3RhdV0gY2FuIGJlIHNlZW4gYXMgYW4gZXN0aW1hdGlvbiBvZlxuICAgICAgICAvLyBhcGVyaW9kaWNpdHkgdGhlbjogcGVyaW9kaWNpdHkgPSAxIC0gYXBlcmlvZGljaXR5XG4gICAgICAgIHRoaXMucHJvYmFiaWxpdHkgPSAxIC0geWluQnVmZmVyW3RhdV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJldHVybiAtMSBpZiBub3QgbWF0Y2ggZm91bmRcbiAgICByZXR1cm4gKHRhdSA9PT0gaGFsZkJ1ZmZlclNpemUpID8gLTEgOiB0YXU7XG4gIH1cblxuICAvKipcbiAgICogU3RlcCA1IC0gRmluZCBhIGJldHRlciBmcmFjdGlvbm5hbCBhcHByb3hpbWF0ZSBvZiB0YXUuXG4gICAqIHRoaXMgY2FuIHByb2JhYmx5IGJlIHNpbXBsaWZpZWQuLi5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9wYXJhYm9saWNJbnRlcnBvbGF0aW9uKHRhdUVzdGltYXRlKSB7XG4gICAgY29uc3QgaGFsZkJ1ZmZlclNpemUgPSB0aGlzLmhhbGZCdWZmZXJTaXplO1xuICAgIGNvbnN0IHlpbkJ1ZmZlciA9IHRoaXMueWluQnVmZmVyO1xuICAgIGxldCBiZXR0ZXJUYXU7XG4gICAgLy8gQG5vdGUgLSB0YXVFc3RpbWF0ZSBjYW5ub3QgYmUgemVybyBhcyB0aGUgbG9vcCBzdGFydCBhdCAxIGluIHN0ZXAgNFxuICAgIGNvbnN0IHgwID0gdGF1RXN0aW1hdGUgLSAxO1xuICAgIGNvbnN0IHgyID0gKHRhdUVzdGltYXRlIDwgaGFsZkJ1ZmZlclNpemUgLSAxKSA/IHRhdUVzdGltYXRlICsgMSA6IHRhdUVzdGltYXRlO1xuXG4gICAgLy8gaWYgYHRhdUVzdGltYXRlYCBpcyBsYXN0IGluZGV4LCB3ZSBjYW4ndCBpbnRlcnBvbGF0ZVxuICAgIGlmICh4MiA9PT0gdGF1RXN0aW1hdGUpIHtcbiAgICAgICAgYmV0dGVyVGF1ID0gdGF1RXN0aW1hdGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHMwID0geWluQnVmZmVyW3gwXTtcbiAgICAgIGNvbnN0IHMxID0geWluQnVmZmVyW3RhdUVzdGltYXRlXTtcbiAgICAgIGNvbnN0IHMyID0geWluQnVmZmVyW3gyXTtcblxuICAgICAgLy8gQG5vdGUgLSBkb24ndCBmdWxseSB1bmRlcnN0YW5kIHRoaXMgZm9ybXVsYSBuZWl0aGVyLi4uXG4gICAgICBiZXR0ZXJUYXUgPSB0YXVFc3RpbWF0ZSArIChzMiAtIHMwKSAvICgyICogKDIgKiBzMSAtIHMyIC0gczApKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYmV0dGVyVGF1O1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSB0aGUgYFlpbmAgb3BlcmF0b3IgaW4gYHN0YW5kYWxvbmVgIG1vZGUgKGkuZS4gb3V0c2lkZSBvZiBhIGdyYXBoKS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheXxGbG9hdDMyQXJyYXl9IGlucHV0IC0gVGhlIHNpZ25hbCBmcmFnbWVudCB0byBwcm9jZXNzLlxuICAgKiBAcmV0dXJuIHtBcnJheX0gLSBBcnJheSBjb250YWluaW5nIHRoZSBgZnJlcXVlbmN5YCwgYGVuZXJneWAsIGBwZXJpb2RpY2l0eWBcbiAgICogIGFuZCBgQUMxYFxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gICAqXG4gICAqIGNvbnN0IHlpbiA9IG5ldyBsZm8ub3BlcmF0b3IuWWluKCk7XG4gICAqIHlpbi5pbml0U3RyZWFtKHtcbiAgICogICBmcmFtZVNpemU6IDIwNDgsXG4gICAqICAgZnJhbWVUeXBlOiAnc2lnbmFsJyxcbiAgICogICBzb3VyY2VTYW1wbGVSYXRlOiA0NDEwMFxuICAgKiB9KTtcbiAgICpcbiAgICogY29uc3QgcmVzdWx0cyA9IHlpbi5pbnB1dFNpZ25hbChzaWduYWwpO1xuICAgKi9cbiAgaW5wdXRTaWduYWwoaW5wdXQpIHtcbiAgICB0aGlzLnBpdGNoID0gLTE7XG4gICAgdGhpcy5wcm9iYWJpbGl0eSA9IDA7XG5cbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICBjb25zdCBpbnB1dEZyYW1lU2l6ZSA9IHRoaXMuaW5wdXRGcmFtZVNpemU7XG4gICAgY29uc3QgZG93blNhbXBsaW5nRXhwID0gdGhpcy5kb3duU2FtcGxpbmdFeHA7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMuZG93blNhbXBsaW5nUmF0ZTtcbiAgICBjb25zdCBvdXREYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgIGxldCB0YXVFc3RpbWF0ZSA9IC0xO1xuXG4gICAgLy8gc3Vic2FtcGxpbmdcbiAgICB0aGlzLl9kb3duc2FtcGxlKGlucHV0LCBpbnB1dEZyYW1lU2l6ZSwgYnVmZmVyLCBkb3duU2FtcGxpbmdFeHApO1xuICAgIC8vIHN0ZXAgMSwgMiwgMyAtIG5vcm1hbGl6ZWQgc3F1YXJlZCBkaWZmZXJlbmNlIG9mIHRoZSBzaWduYWwgd2l0aCBhXG4gICAgLy8gc2hpZnRlZCB2ZXJzaW9uIG9mIGl0c2VsZlxuICAgIHRoaXMuX25vcm1hbGl6ZWREaWZmZXJlbmNlKGJ1ZmZlcik7XG4gICAgLy8gc3RlcCA0IC0gZmluZCBmaXJzdCBiZXN0IHRhdSBlc3RpbWF0ZSB0aGF0IGlzIG92ZXIgdGhlIHRocmVzaG9sZFxuICAgIHRhdUVzdGltYXRlID0gdGhpcy5fYWJzb2x1dGVUaHJlc2hvbGQoKTtcblxuICAgIGlmICh0YXVFc3RpbWF0ZSAhPT0gLTEpIHtcbiAgICAgIC8vIHN0ZXAgNSAtIHNvIGZhciB0YXUgaXMgYW4gaW50ZWdlciBzaGlmdCBvZiB0aGUgc2lnbmFsLCBjaGVjayBpZlxuICAgICAgLy8gdGhlcmUgaXMgYSBiZXR0ZXIgZnJhY3Rpb25uYWwgdmFsdWUgYXJvdW5kXG4gICAgICB0YXVFc3RpbWF0ZSA9IHRoaXMuX3BhcmFib2xpY0ludGVycG9sYXRpb24odGF1RXN0aW1hdGUpO1xuICAgICAgdGhpcy5waXRjaCA9IHNhbXBsZVJhdGUgLyB0YXVFc3RpbWF0ZTtcbiAgICB9XG5cbiAgICBvdXREYXRhWzBdID0gdGhpcy5waXRjaDtcbiAgICBvdXREYXRhWzFdID0gdGhpcy5wcm9iYWJpbGl0eTtcblxuICAgIHJldHVybiBvdXREYXRhO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTaWduYWwoZnJhbWUpIHtcbiAgICB0aGlzLmlucHV0U2lnbmFsKGZyYW1lLmRhdGEpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFlpbjtcbiIsImltcG9ydCBCaXF1YWQgZnJvbSAnLi9CaXF1YWQnO1xuaW1wb3J0IERjdCBmcm9tICcuL0RjdCc7XG5pbXBvcnQgRmZ0IGZyb20gJy4vRmZ0JztcbmltcG9ydCBNYWduaXR1ZGUgZnJvbSAnLi9NYWduaXR1ZGUnO1xuaW1wb3J0IE1lYW5TdGRkZXYgZnJvbSAnLi9NZWFuU3RkZGV2JztcbmltcG9ydCBNZWwgZnJvbSAnLi9NZWwnO1xuaW1wb3J0IE1mY2MgZnJvbSAnLi9NZmNjJztcbmltcG9ydCBNaW5NYXggZnJvbSAnLi9NaW5NYXgnO1xuaW1wb3J0IE1vdmluZ0F2ZXJhZ2UgZnJvbSAnLi9Nb3ZpbmdBdmVyYWdlJztcbmltcG9ydCBNb3ZpbmdNZWRpYW4gZnJvbSAnLi9Nb3ZpbmdNZWRpYW4nO1xuaW1wb3J0IE9uT2ZmIGZyb20gJy4vT25PZmYnO1xuaW1wb3J0IFJtcyBmcm9tICcuL1Jtcyc7XG5pbXBvcnQgU2VnbWVudGVyIGZyb20gJy4vU2VnbWVudGVyJztcbmltcG9ydCBTZWxlY3QgZnJvbSAnLi9TZWxlY3QnO1xuaW1wb3J0IFNsaWNlciBmcm9tICcuL1NsaWNlcic7XG5pbXBvcnQgWWluIGZyb20gJy4vWWluJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBCaXF1YWQsXG4gIERjdCxcbiAgRmZ0LFxuICBNYWduaXR1ZGUsXG4gIE1lYW5TdGRkZXYsXG4gIE1lbCxcbiAgTWZjYyxcbiAgTWluTWF4LFxuICBNb3ZpbmdBdmVyYWdlLFxuICBNb3ZpbmdNZWRpYW4sXG4gIE9uT2ZmLFxuICBSbXMsXG4gIFNlZ21lbnRlcixcbiAgU2VsZWN0LFxuICBTbGljZXIsXG4gIFlpbixcbn07XG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgcHJvY2Vzc1N0cmVhbVBhcmFtczoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG4gIHByb2Nlc3NGcmFtZToge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG4gIGZpbmFsaXplU3RyZWFtOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbn07XG5cbi8qKlxuICogQ3JlYXRlIGEgYnJpZGdlIGJldHdlZW4gdGhlIGdyYXBoIGFuZCBhcHBsaWNhdGlvbiBsb2dpYy4gSGFuZGxlIGBwdXNoYFxuICogYW5kIGBwdWxsYCBwYXJhZGlnbXMuXG4gKlxuICogVGhpcyBzaW5rIGNhbiBoYW5kbGUgYW55IHR5cGUgb2YgaW5wdXQgKGBzaWduYWxgLCBgdmVjdG9yYCwgYHNjYWxhcmApXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24uc2lua1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMucHJvY2Vzc0ZyYW1lPW51bGxdIC0gQ2FsbGJhY2sgZXhlY3V0ZWQgb24gZWFjaFxuICogIGBwcm9jZXNzRnJhbWVgIGNhbGwuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5maW5hbGl6ZVN0cmVhbT1udWxsXSAtIENhbGxiYWNrIGV4ZWN1dGVkIG9uIGVhY2hcbiAqICBgZmluYWxpemVTdHJlYW1gIGNhbGwuXG4gKlxuICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc0ZyYW1lfVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jb21tb24nO1xuICpcbiAqIGNvbnN0IGZyYW1lcyA9IFtcbiAqICB7IHRpbWU6IDAsIGRhdGE6IFswLCAxXSB9LFxuICogIHsgdGltZTogMSwgZGF0YTogWzEsIDJdIH0sXG4gKiBdO1xuICpcbiAqIGNvbnN0IGV2ZW50SW4gPSBuZXcgRXZlbnRJbih7XG4gKiAgIGZyYW1lVHlwZTogJ3ZlY3RvcicsXG4gKiAgIGZyYW1lU2l6ZTogMixcbiAqICAgZnJhbWVSYXRlOiAxLFxuICogfSk7XG4gKlxuICogY29uc3QgYnJpZGdlID0gbmV3IEJyaWRnZSh7XG4gKiAgIHByb2Nlc3NGcmFtZTogKGZyYW1lKSA9PiBjb25zb2xlLmxvZyhmcmFtZSksXG4gKiB9KTtcbiAqXG4gKiBldmVudEluLmNvbm5lY3QoYnJpZGdlKTtcbiAqIGV2ZW50SW4uc3RhcnQoKTtcbiAqXG4gKiAvLyBjYWxsYmFjayBleGVjdXRlZCBvbiBlYWNoIGZyYW1lXG4gKiBldmVudEluLnByb2Nlc3NGcmFtZShmcmFtZVswXSk7XG4gKiA+IHsgdGltZTogMCwgZGF0YTogWzAsIDFdIH1cbiAqIGV2ZW50SW4ucHJvY2Vzc0ZyYW1lKGZyYW1lWzFdKTtcbiAqID4geyB0aW1lOiAxLCBkYXRhOiBbMSwgMl0gfVxuICpcbiAqIC8vIHB1bGwgY3VycmVudCBmcmFtZSB3aGVuIG5lZWRlZFxuICogY29uc29sZS5sb2coYnJpZGdlLmZyYW1lKTtcbiAqID4geyB0aW1lOiAxLCBkYXRhOiBbMSwgMl0gfVxuICovXG5jbGFzcyBCcmlkZ2UgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIGNvbnN0IHByb2Nlc3NTdHJlYW1QYXJhbXNDYWxsYmFjayA9IHRoaXMucGFyYW1zLmdldCgncHJvY2Vzc1N0cmVhbVBhcmFtcycpO1xuXG4gICAgaWYgKHByb2Nlc3NTdHJlYW1QYXJhbXNDYWxsYmFjayAhPT0gbnVsbClcbiAgICAgIHByb2Nlc3NTdHJlYW1QYXJhbXNDYWxsYmFjayh0aGlzLnN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGZpbmFsaXplU3RyZWFtKGVuZFRpbWUpIHtcbiAgICBjb25zdCBmaW5hbGl6ZVN0cmVhbUNhbGxiYWNrID0gdGhpcy5wYXJhbXMuZ2V0KCdmaW5hbGl6ZVN0cmVhbScpO1xuXG4gICAgaWYgKGZpbmFsaXplU3RyZWFtQ2FsbGJhY2sgIT09IG51bGwpXG4gICAgICBmaW5hbGl6ZVN0cmVhbUNhbGxiYWNrKGVuZFRpbWUpO1xuICB9XG5cbiAgLy8gcHJvY2VzcyBhbnkgdHlwZVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NjYWxhcigpIHt9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKCkge31cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTaWduYWwoKSB7fVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgICB0aGlzLnByZXBhcmVGcmFtZSgpO1xuXG4gICAgY29uc3QgcHJvY2Vzc0ZyYW1lQ2FsbGJhY2sgPSB0aGlzLnBhcmFtcy5nZXQoJ3Byb2Nlc3NGcmFtZScpO1xuICAgIGNvbnN0IG91dHB1dCA9IHRoaXMuZnJhbWU7XG4gICAgb3V0cHV0LmRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSk7XG4gICAgLy8gcHVsbCBpbnRlcmZhY2UgKHdlIGNvcHkgZGF0YSBzaW5jZSB3ZSBkb24ndCBrbm93IHdoYXQgY291bGRcbiAgICAvLyBiZSBkb25lIG91dHNpZGUgdGhlIGdyYXBoKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplOyBpKyspXG4gICAgICBvdXRwdXQuZGF0YVtpXSA9IGZyYW1lLmRhdGFbaV07XG5cbiAgICBvdXRwdXQudGltZSA9IGZyYW1lLnRpbWU7XG4gICAgb3V0cHV0Lm1ldGFkYXRhID0gZnJhbWUubWV0YWRhdGE7XG5cbiAgICAvLyBgcHVzaGAgaW50ZXJmYWNlXG4gICAgaWYgKHByb2Nlc3NGcmFtZUNhbGxiYWNrICE9PSBudWxsKVxuICAgICAgcHJvY2Vzc0ZyYW1lQ2FsbGJhY2sob3V0cHV0KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCcmlkZ2U7XG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBzZXBhcmF0ZUFycmF5czoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgY2FsbGJhY2s6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxufTtcblxuLyoqXG4gKiBSZWNvcmQgaW5wdXQgZnJhbWVzIGZyb20gYSBncmFwaC4gVGhpcyBzaW5rIGNhbiBoYW5kbGUgYHNpZ25hbGAsIGB2ZWN0b3JgXG4gKiBvciBgc2NhbGFyYCBpbnB1dHMuXG4gKlxuICogV2hlbiB0aGUgcmVjb3JkaW5nIGlzIHN0b3BwZWQgKGVpdGhlciBieSBjYWxsaW5nIGBzdG9wYCBvbiB0aGUgbm9kZSBvciB3aGVuXG4gKiB0aGUgc3RyZWFtIGlzIGZpbmFsaXplZCksIHRoZSBjYWxsYmFjayBnaXZlbiBhcyBwYXJhbWV0ZXIgaXMgZXhlY3V0ZWQgd2l0aFxuICogdGhlIHJlY29yZGVyIGRhdGEgYXMgYXJndW1lbnQuXG4gKlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zZXBhcmF0ZUFycmF5cz1mYWxzZV0gLSBGb3JtYXQgb2YgdGhlIHJldHJpZXZlZFxuICogIHZhbHVlczpcbiAqICAtIHdoZW4gYGZhbHNlYCwgZm9ybWF0IGlzIFt7IHRpbWUsIGRhdGEgfSwgeyB0aW1lLCBkYXRhIH0sIC4uLl1cbiAqICAtIHdoZW4gYHRydWVgLCBmb3JtYXQgaXMgeyB0aW1lOiBbLi4uXSwgZGF0YTogWy4uLl0gfVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuY2FsbGJhY2tdIC0gQ2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbmV3IHJlY29yZFxuICogIGlzIGVuZGVkLiBUaGlzIGNhbiBoYXBwZW4gd2hlbjogYHN0b3BgIGlzIGNhbGxlZCBvbiB0aGUgcmVjb3JkZXIsIG9yIGBzdG9wYFxuICogIGlzIGNhbGxlZCBvbiB0aGUgc291cmNlLlxuICpcbiAqIEB0b2RvIC0gQWRkIGF1dG8gcmVjb3JkIHBhcmFtLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLnNpbmtcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jb21tb24nO1xuICpcbiAqIGNvbnN0IGV2ZW50SW4gPSBuZXcgbGZvLnNvdXJjZS5FdmVudEluKHtcbiAqICBmcmFtZVR5cGU6ICd2ZWN0b3InLFxuICogIGZyYW1lU2l6ZTogMixcbiAqICBmcmFtZVJhdGU6IDAsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCByZWNvcmRlciA9IG5ldyBsZm8uc2luay5EYXRhUmVjb3JkZXIoe1xuICogICBjYWxsYmFjazogKGRhdGEpID0+IGNvbnNvbGUubG9nKGRhdGEpLFxuICogfSk7XG4gKlxuICogZXZlbnRJbi5jb25uZWN0KHJlY29yZGVyKTtcbiAqIGV2ZW50SW4uc3RhcnQoKTtcbiAqIHJlY29yZGVyLnN0YXJ0KCk7XG4gKlxuICogZXZlbnRJbi5wcm9jZXNzKDAsIFswLCAxXSk7XG4gKiBldmVudEluLnByb2Nlc3MoMSwgWzEsIDJdKTtcbiAqXG4gKiByZWNvcmRlci5zdG9wKCk7XG4gKiA+IFt7IHRpbWU6IDAsIGRhdGE6IFswLCAxXSB9LCB7IHRpbWU6IDEsIGRhdGE6IFsxLCAyXSB9XTtcbiAqL1xuY2xhc3MgRGF0YVJlY29yZGVyIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZSBpZiB0aGUgbm9kZSBpcyBjdXJyZW50bHkgcmVjb3JkaW5nLlxuICAgICAqXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG5hbWUgaXNSZWNvcmRpbmdcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNpbmsuU2lnbmFsUmVjb3JkZXJcbiAgICAgKi9cbiAgICB0aGlzLmlzUmVjb3JkaW5nID0gZmFsc2U7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2luaXRTdG9yZSgpIHtcbiAgICBjb25zdCBzZXBhcmF0ZUFycmF5cyA9IHRoaXMucGFyYW1zLmdldCgnc2VwYXJhdGVBcnJheXMnKTtcblxuICAgIGlmIChzZXBhcmF0ZUFycmF5cylcbiAgICAgIHRoaXMuX3N0b3JlID0geyB0aW1lOiBbXSwgZGF0YTogW10gfTtcbiAgICBlbHNlXG4gICAgICB0aGlzLl9zdG9yZSA9IFtdO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcbiAgICB0aGlzLl9pbml0U3RvcmUoKTtcbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHJlY29yZGluZy5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNsaWVudC5zaW5rLkRhdGFSZWNvcmRlciNzdG9wfVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5pc1JlY29yZGluZyA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCByZWNvcmRpbmcgYW5kIGV4ZWN1dGUgdGhlIGNhbGxiYWNrIGRlZmluZWQgaW4gcGFyYW1ldGVycy5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNsaWVudC5zaW5rLkRhdGFSZWNvcmRlciNzdGFydH1cbiAgICovXG4gIHN0b3AoKSB7XG4gICAgaWYgKHRoaXMuaXNSZWNvcmRpbmcpIHtcbiAgICAgIHRoaXMuaXNSZWNvcmRpbmcgPSBmYWxzZTtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5wYXJhbXMuZ2V0KCdjYWxsYmFjaycpO1xuXG4gICAgICBpZiAoY2FsbGJhY2sgIT09IG51bGwpXG4gICAgICAgIGNhbGxiYWNrKHRoaXMuX3N0b3JlKTtcblxuICAgICAgdGhpcy5faW5pdFN0b3JlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGZpbmFsaXplU3RyZWFtKCkge1xuICAgIHRoaXMuc3RvcCgpO1xuICB9XG5cbiAgLy8gaGFuZGxlIGFueSBpbnB1dCB0eXBlc1xuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NjYWxhcihmcmFtZSkge31cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTaWduYWwoZnJhbWUpIHt9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKGZyYW1lKSB7fVxuXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIGlmICh0aGlzLmlzUmVjb3JkaW5nKSB7XG4gICAgICB0aGlzLnByZXBhcmVGcmFtZShmcmFtZSk7XG5cbiAgICAgIGNvbnN0IHNlcGFyYXRlQXJyYXlzID0gdGhpcy5wYXJhbXMuZ2V0KCdzZXBhcmF0ZUFycmF5cycpO1xuICAgICAgY29uc3QgZW50cnkgPSB7XG4gICAgICAgIHRpbWU6IGZyYW1lLnRpbWUsXG4gICAgICAgIGRhdGE6IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWUuZGF0YSksXG4gICAgICB9O1xuXG4gICAgICBpZiAoIXNlcGFyYXRlQXJyYXlzKSB7XG4gICAgICAgIHRoaXMuX3N0b3JlLnB1c2goZW50cnkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc3RvcmUudGltZS5wdXNoKGVudHJ5LnRpbWUpO1xuICAgICAgICB0aGlzLl9zdG9yZS5kYXRhLnB1c2goZW50cnkuZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERhdGFSZWNvcmRlcjtcblxuIiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIHRpbWU6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH1cbiAgfSxcbiAgZGF0YToge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfVxuICB9LFxuICBtZXRhZGF0YToge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfVxuICB9LFxuICBzdHJlYW1QYXJhbXM6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH1cbiAgfSxcbiAgZnJhbWVJbmRleDoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfVxuICB9LFxufVxuXG4vKipcbiAqIExvZyBgZnJhbWUudGltZWAsIGBmcmFtZS5kYXRhYCwgYGZyYW1lLm1ldGFkYXRhYCBhbmQvb3JcbiAqIGBzdHJlYW1BdHRyaWJ1dGVzYCBvZiBhbnkgbm9kZSBpbiB0aGUgY29uc29sZS5cbiAqXG4gKiBUaGlzIHNpbmsgY2FuIGhhbmRsZSBhbnkgdHlwZSBpZiBpbnB1dCAoYHNpZ25hbGAsIGB2ZWN0b3JgLCBgc2NhbGFyYClcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIHBhcmFtZXRlcnMgZGVmYXVsdCB2YWx1ZXMuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnRpbWU9ZmFsc2VdIC0gTG9nIGluY29tbWluZyBgZnJhbWUudGltZWAgaWYgYHRydWVgLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5kYXRhPWZhbHNlXSAtIExvZyBpbmNvbW1pbmcgYGZyYW1lLmRhdGFgIGlmIGB0cnVlYC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMubWV0YWRhdGE9ZmFsc2VdIC0gTG9nIGluY29tbWluZyBgZnJhbWUubWV0YWRhdGFgXG4gKiAgaWYgYHRydWVgLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zdHJlYW1QYXJhbXM9ZmFsc2VdIC0gTG9nIGBzdHJlYW1QYXJhbXNgIG9mIHRoZVxuICogIHByZXZpb3VzIG5vZGUgd2hlbiBncmFwaCBpcyBzdGFydGVkLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5mcmFtZUluZGV4PWZhbHNlXSAtIExvZyBpbmRleCBvZiB0aGUgaW5jb21taW5nXG4gKiAgYGZyYW1lYC5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5zaW5rXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY29tbW9uJztcbiAqXG4gKiBjb25zdCBsb2dnZXIgPSBuZXcgbGZvLnNpbmsuTG9nZ2VyKHsgZGF0YTogdHJ1ZSB9KTtcbiAqIHdoYXRldmVyT3BlcmF0b3IuY29ubmVjdChsb2dnZXIpO1xuICovXG5jbGFzcyBMb2dnZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdzdHJlYW1QYXJhbXMnKSA9PT0gdHJ1ZSlcbiAgICAgIGNvbnNvbGUubG9nKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5mcmFtZUluZGV4ID0gMDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzRnVuY3Rpb24oZnJhbWUpIHtcbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdmcmFtZUluZGV4JykgPT09IHRydWUpXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmZyYW1lSW5kZXgrKyk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCd0aW1lJykgPT09IHRydWUpXG4gICAgICBjb25zb2xlLmxvZyhmcmFtZS50aW1lKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ2RhdGEnKSA9PT0gdHJ1ZSlcbiAgICAgIGNvbnNvbGUubG9nKGZyYW1lLmRhdGEpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnbWV0YWRhdGEnKSA9PT0gdHJ1ZSlcbiAgICAgIGNvbnNvbGUubG9nKGZyYW1lLm1ldGFkYXRhKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2dnZXI7XG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgZHVyYXRpb246IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDEwLFxuICAgIG1pbjogMCxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBjYWxsYmFjazoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG4gIGlnbm9yZUxlYWRpbmdaZXJvczoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIHJldHJpZXZlQXVkaW9CdWZmZXI6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGF1ZGlvQ29udGV4dDoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gIH0sXG59O1xuXG4vKipcbiAqIFJlY29yZCBhbiBgc2lnbmFsYCBpbnB1dCBzdHJlYW0gb2YgYXJiaXRyYXJ5IGR1cmF0aW9uIGFuZCByZXRyaWV2ZSBpdFxuICogd2hlbiBkb25lLlxuICpcbiAqIFdoZW4gcmVjb3JkaW5nIGlzIHN0b3BwZWQgKGVpdGhlciB3aGVuIHRoZSBgc3RvcGAgbWV0aG9kIGlzIGNhbGxlZCwgdGhlXG4gKiBkZWZpbmVkIGR1cmF0aW9uIGhhcyBiZWVuIHJlY29yZGVkLCBvciB0aGUgc291cmNlIG9mIHRoZSBncmFwaCBmaW5hbGl6ZWRcbiAqIHRoZSBzdHJlYW0pLCB0aGUgY2FsbGJhY2sgZ2l2ZW4gYXMgcGFyYW1ldGVyIGlzIGV4ZWN1dGVkICB3aXRoIHRoZVxuICogYEF1ZGlvQnVmZmVyYCBvciBgRmxvYXQzMkFycmF5YCBjb250YWluaW5nIHRoZSByZWNvcmRlZCBzaWduYWwgYXMgYXJndW1lbnQuXG4gKlxuICogQHRvZG8gLSBhZGQgb3B0aW9uIHRvIHJldHVybiBvbmx5IHRoZSBGbG9hdDMyQXJyYXkgYW5kIG5vdCBhbiBhdWRpbyBidWZmZXJcbiAqICAobm9kZSBjb21wbGlhbnQpIGByZXRyaWV2ZUF1ZGlvQnVmZmVyOiBmYWxzZWBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5kdXJhdGlvbj0xMF0gLSBNYXhpbXVtIGR1cmF0aW9uIG9mIHRoZSByZWNvcmRpbmcuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuY2FsbGJhY2tdIC0gQ2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbmV3IHJlY29yZCBpc1xuICogIGVuZGVkLiBUaGlzIGNhbiBoYXBwZW46IGBzdG9wYCBpcyBjYWxsZWQgb24gdGhlIHJlY29yZGVyLCBgc3RvcGAgaXMgY2FsbGVkXG4gKiAgb24gdGhlIHNvdXJjZSBvciB3aGVuIHRoZSBidWZmZXIgaXMgZnVsbCBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIGBkdXJhdGlvbmAuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuaWdub3JlTGVhZGluZ1plcm9zPXRydWVdIC0gU3RhcnQgdGhlIGVmZmVjdGl2ZVxuICogIHJlY29yZGluZyBvbiB0aGUgZmlyc3Qgbm9uLXplcm8gdmFsdWUuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnJldHJpZXZlQXVkaW9CdWZmZXI9ZmFsc2VdIC0gRGVmaW5lIGlmIGFuIGBBdWRpb0J1ZmZlcmBcbiAqICBzaG91bGQgYmUgcmV0cmlldmVkIG9yIG9ubHkgdGhlIHJhdyBGbG9hdDMyQXJyYXkgb2YgZGF0YS5cbiAqICAod29ya3Mgb25seSBpbiBicm93c2VyKVxuICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IFtvcHRpb25zLmF1ZGlvQ29udGV4dD1udWxsXSAtIElmXG4gKiAgYHJldHJpZXZlQXVkaW9CdWZmZXJgIGlzIHNldCB0byBgdHJ1ZWAsIGF1ZGlvIGNvbnRleHQgdG8gYmUgdXNlZFxuICogIGluIG9yZGVyIHRvIGNyZWF0ZSB0aGUgZmluYWwgYXVkaW8gYnVmZmVyLlxuICogICh3b3JrcyBvbmx5IGluIGJyb3dzZXIpXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24uc2lua1xuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gKlxuICogY29uc3QgYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICpcbiAqIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAqICAgLmdldFVzZXJNZWRpYSh7IGF1ZGlvOiB0cnVlIH0pXG4gKiAgIC50aGVuKGluaXQpXG4gKiAgIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVyci5zdGFjaykpO1xuICpcbiAqIGZ1bmN0aW9uIGluaXQoc3RyZWFtKSB7XG4gKiAgIGNvbnN0IHNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVNZWRpYVN0cmVhbVNvdXJjZShzdHJlYW0pO1xuICpcbiAqICAgY29uc3QgYXVkaW9Jbk5vZGUgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luTm9kZSh7XG4gKiAgICAgc291cmNlTm9kZTogc291cmNlLFxuICogICAgIGF1ZGlvQ29udGV4dDogYXVkaW9Db250ZXh0LFxuICogICB9KTtcbiAqXG4gKiAgIGNvbnN0IHNpZ25hbFJlY29yZGVyID0gbmV3IGxmby5zaW5rLlNpZ25hbFJlY29yZGVyKHtcbiAqICAgICBkdXJhdGlvbjogNixcbiAqICAgICByZXRyaWV2ZUF1ZGlvQnVmZmVyOiB0cnVlLFxuICogICAgIGF1ZGlvQ29udGV4dDogYXVkaW9Db250ZXh0LFxuICogICAgIGNhbGxiYWNrOiAoYnVmZmVyKSA9PiB7XG4gKiAgICAgICBjb25zdCBidWZmZXJTb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gKiAgICAgICBidWZmZXJTb3VyY2UuYnVmZmVyID0gYnVmZmVyO1xuICogICAgICAgYnVmZmVyU291cmNlLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAqICAgICAgIGJ1ZmZlclNvdXJjZS5zdGFydCgpO1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogICBhdWRpb0luTm9kZS5jb25uZWN0KHNpZ25hbFJlY29yZGVyKTtcbiAqICAgYXVkaW9Jbk5vZGUuc3RhcnQoKTtcbiAqICAgc2lnbmFsUmVjb3JkZXIuc3RhcnQoKTtcbiAqIH0pO1xuICovXG5jbGFzcyBTaWduYWxSZWNvcmRlciBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmUgaXMgdGhlIG5vZGUgaXMgY3VycmVudGx5IHJlY29yZGluZyBvciBub3QuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAbmFtZSBpc1JlY29yZGluZ1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y2xpZW50LnNpbmsuU2lnbmFsUmVjb3JkZXJcbiAgICAgKi9cbiAgICB0aGlzLmlzUmVjb3JkaW5nID0gZmFsc2U7XG5cbiAgICBjb25zdCByZXRyaWV2ZUF1ZGlvQnVmZmVyID0gdGhpcy5wYXJhbXMuZ2V0KCdyZXRyaWV2ZUF1ZGlvQnVmZmVyJyk7XG4gICAgbGV0IGF1ZGlvQ29udGV4dCA9IHRoaXMucGFyYW1zLmdldCgnYXVkaW9Db250ZXh0Jyk7XG4gICAgLy8gbmVlZGVkIHRvIHJldHJpZXZlIGFuIEF1ZGlvQnVmZmVyXG4gICAgaWYgKHJldHJpZXZlQXVkaW9CdWZmZXIgJiYgYXVkaW9Db250ZXh0ID09PSBudWxsKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHBhcmFtZXRlciBcImF1ZGlvQ29udGV4dFwiOiBhbiBBdWRpb0NvbnRleHQgbXVzdCBiZSBwcm92aWRlZCB3aGVuIGByZXRyaWV2ZUF1ZGlvQnVmZmVyYCBpcyBzZXQgdG8gYHRydWVgJylcblxuICAgIHRoaXMuX2F1ZGlvQ29udGV4dCA9IGF1ZGlvQ29udGV4dDtcbiAgICB0aGlzLl9pZ25vcmVaZXJvcyA9IGZhbHNlO1xuICAgIHRoaXMuX2lzSW5maW5pdGVCdWZmZXIgPSBmYWxzZTtcbiAgICB0aGlzLl9zdGFjayA9IFtdO1xuICAgIHRoaXMuX2J1ZmZlciA9IG51bGw7XG4gICAgdGhpcy5fYnVmZmVyTGVuZ3RoID0gbnVsbDtcbiAgICB0aGlzLl9jdXJyZW50SW5kZXggPSBudWxsO1xuICB9XG5cbiAgX2luaXRCdWZmZXIoKSB7XG4gICAgdGhpcy5fYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLl9idWZmZXJMZW5ndGgpO1xuICAgIHRoaXMuX3N0YWNrLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5fY3VycmVudEluZGV4ID0gMDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMucGFyYW1zLmdldCgnZHVyYXRpb24nKTtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcblxuICAgIGlmIChpc0Zpbml0ZShkdXJhdGlvbikpIHtcbiAgICAgIHRoaXMuX2lzSW5maW5pdGVCdWZmZXIgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2J1ZmZlckxlbmd0aCA9IHNhbXBsZVJhdGUgKiBkdXJhdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faXNJbmZpbml0ZUJ1ZmZlciA9IHRydWU7XG4gICAgICB0aGlzLl9idWZmZXJMZW5ndGggPSBzYW1wbGVSYXRlICogMTA7XG4gICAgfVxuXG4gICAgdGhpcy5faW5pdEJ1ZmZlcigpO1xuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgcmVjb3JkaW5nLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5pc1JlY29yZGluZyA9IHRydWU7XG4gICAgdGhpcy5faWdub3JlWmVyb3MgPSB0aGlzLnBhcmFtcy5nZXQoJ2lnbm9yZUxlYWRpbmdaZXJvcycpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgcmVjb3JkaW5nIGFuZCBleGVjdXRlIHRoZSBjYWxsYmFjayBkZWZpbmVkIGluIHBhcmFtZXRlcnMuXG4gICAqL1xuICBzdG9wKCkge1xuICAgIGlmICh0aGlzLmlzUmVjb3JkaW5nKSB7XG4gICAgICAvLyBpZ25vcmUgbmV4dCBpbmNvbW1pbmcgZnJhbWVcbiAgICAgIHRoaXMuaXNSZWNvcmRpbmcgPSBmYWxzZTtcblxuICAgICAgY29uc3QgcmV0cmlldmVBdWRpb0J1ZmZlciA9IHRoaXMucGFyYW1zLmdldCgncmV0cmlldmVBdWRpb0J1ZmZlcicpO1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLnBhcmFtcy5nZXQoJ2NhbGxiYWNrJyk7XG4gICAgICBjb25zdCBjdXJyZW50SW5kZXggPSB0aGlzLl9jdXJyZW50SW5kZXg7XG4gICAgICBjb25zdCBidWZmZXIgPSB0aGlzLl9idWZmZXI7XG4gICAgICBsZXQgb3V0cHV0O1xuXG4gICAgICBpZiAoIXRoaXMuX2lzSW5maW5pdGVCdWZmZXIpIHtcbiAgICAgICAgb3V0cHV0ID0gbmV3IEZsb2F0MzJBcnJheShjdXJyZW50SW5kZXgpO1xuICAgICAgICBvdXRwdXQuc2V0KGJ1ZmZlci5zdWJhcnJheSgwLCBjdXJyZW50SW5kZXgpLCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGJ1ZmZlckxlbmd0aCA9IHRoaXMuX2J1ZmZlckxlbmd0aDtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSB0aGlzLl9zdGFjaztcblxuICAgICAgICBvdXRwdXQgPSBuZXcgRmxvYXQzMkFycmF5KHN0YWNrLmxlbmd0aCAqIGJ1ZmZlckxlbmd0aCArIGN1cnJlbnRJbmRleCk7XG5cbiAgICAgICAgLy8gY29weSBhbGwgc3RhY2tlZCBidWZmZXJzXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhY2subGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBzdGFja2VkQnVmZmVyID0gc3RhY2tbaV07XG4gICAgICAgICAgb3V0cHV0LnNldChzdGFja2VkQnVmZmVyLCBidWZmZXJMZW5ndGggKiBpKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gY29weSBkYXRhIGNvbnRhaW5lZCBpbiBjdXJyZW50IGJ1ZmZlclxuICAgICAgICBvdXRwdXQuc2V0KGJ1ZmZlci5zdWJhcnJheSgwLCBjdXJyZW50SW5kZXgpLCBzdGFjay5sZW5ndGggKiBidWZmZXJMZW5ndGgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmV0cmlldmVBdWRpb0J1ZmZlciAmJiB0aGlzLl9hdWRpb0NvbnRleHQpIHtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gb3V0cHV0Lmxlbmd0aDtcbiAgICAgICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG4gICAgICAgIGNvbnN0IGF1ZGlvQnVmZmVyID0gdGhpcy5fYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCBsZW5ndGgsIHNhbXBsZVJhdGUpO1xuICAgICAgICBjb25zdCBjaGFubmVsRGF0YSA9IGF1ZGlvQnVmZmVyLmdldENoYW5uZWxEYXRhKDApO1xuICAgICAgICBjaGFubmVsRGF0YS5zZXQob3V0cHV0LCAwKTtcblxuICAgICAgICBjYWxsYmFjayhhdWRpb0J1ZmZlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayhvdXRwdXQpO1xuICAgICAgfVxuXG4gICAgICAvLyByZWluaXQgYnVmZmVyLCBzdGFjaywgYW5kIGN1cnJlbnRJbmRleFxuICAgICAgdGhpcy5faW5pdEJ1ZmZlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBmaW5hbGl6ZVN0cmVhbShlbmRUaW1lKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIGlmICghdGhpcy5pc1JlY29yZGluZylcbiAgICAgIHJldHVybjtcblxuICAgIGxldCBibG9jayA9IG51bGw7XG4gICAgY29uc3QgaW5wdXQgPSBmcmFtZS5kYXRhO1xuICAgIGNvbnN0IGJ1ZmZlckxlbmd0aCA9IHRoaXMuX2J1ZmZlckxlbmd0aDtcbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLl9idWZmZXI7XG5cbiAgICBpZiAodGhpcy5faWdub3JlWmVyb3MgPT09IGZhbHNlKSB7XG4gICAgICBibG9jayA9IG5ldyBGbG9hdDMyQXJyYXkoaW5wdXQpO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRbaW5wdXQubGVuZ3RoIC0gMV0gIT09IDApIHtcbiAgICAgIC8vIGZpbmQgZmlyc3QgaW5kZXggd2hlcmUgdmFsdWUgIT09IDBcbiAgICAgIGxldCBpO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspXG4gICAgICAgIGlmIChpbnB1dFtpXSAhPT0gMCkgYnJlYWs7XG5cbiAgICAgIC8vIGNvcHkgbm9uIHplcm8gc2VnbWVudFxuICAgICAgYmxvY2sgPSBuZXcgRmxvYXQzMkFycmF5KGlucHV0LnN1YmFycmF5KGkpKTtcbiAgICAgIC8vIGRvbid0IHJlcGVhdCB0aGlzIGxvZ2ljIG9uY2UgYSBub24temVybyB2YWx1ZSBoYXMgYmVlbiBmb3VuZFxuICAgICAgdGhpcy5faWdub3JlWmVyb3MgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoYmxvY2sgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGF2YWlsYWJsZVNwYWNlID0gYnVmZmVyTGVuZ3RoIC0gdGhpcy5fY3VycmVudEluZGV4O1xuICAgICAgbGV0IGN1cnJlbnRCbG9jaztcblxuICAgICAgaWYgKGF2YWlsYWJsZVNwYWNlIDwgYmxvY2subGVuZ3RoKVxuICAgICAgICBjdXJyZW50QmxvY2sgPSBibG9jay5zdWJhcnJheSgwLCBhdmFpbGFibGVTcGFjZSk7XG4gICAgICBlbHNlXG4gICAgICAgIGN1cnJlbnRCbG9jayA9IGJsb2NrO1xuXG4gICAgICBidWZmZXIuc2V0KGN1cnJlbnRCbG9jaywgdGhpcy5fY3VycmVudEluZGV4KTtcbiAgICAgIHRoaXMuX2N1cnJlbnRJbmRleCArPSBjdXJyZW50QmxvY2subGVuZ3RoO1xuXG4gICAgICBpZiAodGhpcy5faXNJbmZpbml0ZUJ1ZmZlciAmJiB0aGlzLl9jdXJyZW50SW5kZXggPT09IGJ1ZmZlckxlbmd0aCkge1xuICAgICAgICB0aGlzLl9zdGFjay5wdXNoKGJ1ZmZlcik7XG5cbiAgICAgICAgY3VycmVudEJsb2NrID0gYmxvY2suc3ViYXJyYXkoYXZhaWxhYmxlU3BhY2UpO1xuICAgICAgICB0aGlzLl9idWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KGJ1ZmZlckxlbmd0aCk7XG4gICAgICAgIHRoaXMuX2J1ZmZlci5zZXQoY3VycmVudEJsb2NrLCAwKTtcbiAgICAgICAgdGhpcy5fY3VycmVudEluZGV4ID0gY3VycmVudEJsb2NrLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgLy8gIHN0b3AgaWYgdGhlIGJ1ZmZlciBpcyBmaW5pdGUgYW5kIGZ1bGxcbiAgICAgIGlmICghdGhpcy5faXNJbmZpbml0ZUJ1ZmZlciAmJiB0aGlzLl9jdXJyZW50SW5kZXggPT09IGJ1ZmZlckxlbmd0aClcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNpZ25hbFJlY29yZGVyO1xuXG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuaW1wb3J0IFNvdXJjZU1peGluIGZyb20gJy4uLy4uL2NvcmUvU291cmNlTWl4aW4nO1xuXG4vLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE3NTc1NzkwL2Vudmlyb25tZW50LWRldGVjdGlvbi1ub2RlLWpzLW9yLWJyb3dzZXJcbmNvbnN0IGlzTm9kZSA9IG5ldyBGdW5jdGlvbigndHJ5IHsgcmV0dXJuIHRoaXMgPT09IGdsb2JhbDsgfSBjYXRjaChlKSB7IHJldHVybiBmYWxzZSB9Jyk7XG5cbi8qKlxuICogQ3JlYXRlIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRpbWUgaW4gc2Vjb25kcyBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnRcbiAqIGVudmlyb25uZW1lbnQgKG5vZGUgb3IgYnJvd3NlcikuXG4gKiBJZiBydW5uaW5nIGluIG5vZGUgdGhlIHRpbWUgcmVseSBvbiBgcHJvY2Vzcy5ocnRpbWVgLCB3aGlsZSBpZiBpbiB0aGUgYnJvd3NlclxuICogaXQgaXMgcHJvdmlkZWQgYnkgdGhlIGBjdXJyZW50VGltZWAgb2YgYW4gYEF1ZGlvQ29udGV4dGAsIHRoaXMgY29udGV4dCBjYW5cbiAqIG9wdGlvbm5hbHkgYmUgcHJvdmlkZWQgdG8ga2VlcCB0aW1lIGNvbnNpc3RlbmN5IGJldHdlZW4gc2V2ZXJhbCBgRXZlbnRJbmBcbiAqIG5vZGVzLlxuICpcbiAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBbYXVkaW9Db250ZXh0PW51bGxdIC0gT3B0aW9ubmFsIGF1ZGlvIGNvbnRleHQuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGdldFRpbWVGdW5jdGlvbihhdWRpb0NvbnRleHQgPSBudWxsKSB7XG4gIGlmIChpc05vZGUoKSkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb25zdCB0ID0gcHJvY2Vzcy5ocnRpbWUoKTtcbiAgICAgIHJldHVybiB0WzBdICsgdFsxXSAqIDFlLTk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEB0b2RvIC0gcmVwbGFjZSB3aXRoIGBwZXJmb3JtYW5jZS5ub3dgXG4gICAgaWYgKGF1ZGlvQ29udGV4dCA9PT0gbnVsbCB8fMKgKCFhdWRpb0NvbnRleHQgaW5zdGFuY2VvZiBBdWRpb0NvbnRleHQpKSB7XG4gICAgICBjb25zdCBBdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8wqB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuICAgICAgYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICAgIH1cblxuICAgIHJldHVybiAoKSA9PiBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gIH1cbn1cblxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgYWJzb2x1dGVUaW1lOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBhdWRpb0NvbnRleHQ6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICB9LFxuICBmcmFtZVR5cGU6IHtcbiAgICB0eXBlOiAnZW51bScsXG4gICAgbGlzdDogWydzaWduYWwnLCAndmVjdG9yJywgJ3NjYWxhciddLFxuICAgIGRlZmF1bHQ6ICdzaWduYWwnLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBmcmFtZVNpemU6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMSxcbiAgICBtaW46IDEsXG4gICAgbWF4OiArSW5maW5pdHksIC8vIG5vdCByZWNvbW1lbmRlZC4uLlxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIHNhbXBsZVJhdGU6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbWluOiAwLFxuICAgIG1heDogK0luZmluaXR5LCAvLyBzYW1lIGhlcmVcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBmcmFtZVJhdGU6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbWluOiAwLFxuICAgIG1heDogK0luZmluaXR5LCAvLyBzYW1lIGhlcmVcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBkZXNjcmlwdGlvbjoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH1cbn07XG5cbi8qKlxuICogVGhlIGBFdmVudEluYCBvcGVyYXRvciBhbGxvd3MgdG8gbWFudWFsbHkgY3JlYXRlIGEgc3RyZWFtIG9mIGRhdGEgb3IgdG8gZmVlZFxuICogYSBzdHJlYW0gZnJvbSBhbm90aGVyIHNvdXJjZSAoZS5nLiBzZW5zb3JzKSBpbnRvIGEgcHJvY2Vzc2luZyBncmFwaC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIHBhcmFtZXRlcnMnIGRlZmF1bHQgdmFsdWVzLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmZyYW1lVHlwZT0nc2lnbmFsJ10gLSBUeXBlIG9mIHRoZSBpbnB1dCAtIGFsbG93ZWRcbiAqIHZhbHVlczogYHNpZ25hbGAsICBgdmVjdG9yYCBvciBgc2NhbGFyYC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5mcmFtZVNpemU9MV0gLSBTaXplIG9mIHRoZSBvdXRwdXQgZnJhbWUuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuc2FtcGxlUmF0ZT1udWxsXSAtIFNhbXBsZSByYXRlIG9mIHRoZSBzb3VyY2Ugc3RyZWFtLFxuICogIGlmIG9mIHR5cGUgYHNpZ25hbGAuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZnJhbWVSYXRlPW51bGxdIC0gUmF0ZSBvZiB0aGUgc291cmNlIHN0cmVhbSwgaWYgb2ZcbiAqICB0eXBlIGB2ZWN0b3JgLlxuICogQHBhcmFtIHtBcnJheXxTdHJpbmd9IFtvcHRpb25zLmRlc2NyaXB0aW9uXSAtIE9wdGlvbm5hbCBkZXNjcmlwdGlvblxuICogIGRlc2NyaWJpbmcgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIG91dHB1dCBmcmFtZVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5hYnNvbHV0ZVRpbWU9ZmFsc2VdIC0gRGVmaW5lIGlmIHRpbWUgc2hvdWxkIGJlIHVzZWRcbiAqICBhcyBmb3J3YXJkZWQgYXMgZ2l2ZW4gaW4gdGhlIHByb2Nlc3MgbWV0aG9kLCBvciByZWxhdGl2ZWx5IHRvIHRoZSB0aW1lIG9mXG4gKiAgdGhlIGZpcnN0IGBwcm9jZXNzYCBjYWxsIGFmdGVyIHN0YXJ0LlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLnNvdXJjZVxuICpcbiAqIEB0b2RvIC0gQWRkIGEgYGxvZ2ljYWxUaW1lYCBwYXJhbWV0ZXIgdG8gdGFnIGZyYW1lIGFjY29yZGluZyB0byBmcmFtZSByYXRlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVR5cGU6ICd2ZWN0b3InLFxuICogICBmcmFtZVNpemU6IDMsXG4gKiAgIGZyYW1lUmF0ZTogMSAvIDUwLFxuICogICBkZXNjcmlwdGlvbjogWydhbHBoYScsICdiZXRhJywgJ2dhbW1hJ10sXG4gKiB9KTtcbiAqXG4gKiAvLyBjb25uZWN0IHNvdXJjZSB0byBvcGVyYXRvcnMgYW5kIHNpbmsocylcbiAqXG4gKiAvLyBpbml0aWFsaXplIGFuZCBzdGFydCB0aGUgZ3JhcGhcbiAqIGV2ZW50SW4uc3RhcnQoKTtcbiAqXG4gKiAvLyBmZWVkIGBkZXZpY2VvcmllbnRhdGlvbmAgZGF0YSBpbnRvIHRoZSBncmFwaFxuICogd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW9yaWVudGF0aW9uJywgKGUpID0+IHtcbiAqICAgY29uc3QgZnJhbWUgPSB7XG4gKiAgICAgdGltZTogd2luZG93LnBlcmZvcm1hY2Uubm93KCkgLyAxMDAwLFxuICogICAgIGRhdGE6IFtlLmFscGhhLCBlLmJldGEsIGUuZ2FtbWFdLFxuICogICB9O1xuICpcbiAqICAgZXZlbnRJbi5wcm9jZXNzRnJhbWUoZnJhbWUpO1xuICogfSwgZmFsc2UpO1xuICovXG5jbGFzcyBFdmVudEluIGV4dGVuZHMgU291cmNlTWl4aW4oQmFzZUxmbykge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBhdWRpb0NvbnRleHQgPSB0aGlzLnBhcmFtcy5nZXQoJ2F1ZGlvQ29udGV4dCcpO1xuICAgIHRoaXMuX2dldFRpbWUgPSBnZXRUaW1lRnVuY3Rpb24oYXVkaW9Db250ZXh0KTtcbiAgICB0aGlzLl9zdGFydFRpbWUgPSBudWxsO1xuICAgIHRoaXMuX3N5c3RlbVRpbWUgPSBudWxsO1xuICAgIHRoaXMuX2Fic29sdXRlVGltZSA9IHRoaXMucGFyYW1zLmdldCgnYWJzb2x1dGVUaW1lJyk7XG4gIH1cblxuICAvKipcbiAgICogUHJvcGFnYXRlIHRoZSBgc3RyZWFtUGFyYW1zYCBpbiB0aGUgZ3JhcGggYW5kIGFsbG93IHRvIHB1c2ggZnJhbWVzIGludG9cbiAgICogdGhlIGdyYXBoLiBBbnkgY2FsbCB0byBgcHJvY2Vzc2Agb3IgYHByb2Nlc3NGcmFtZWAgYmVmb3JlIGBzdGFydGAgd2lsbCBiZVxuICAgKiBpZ25vcmVkLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNyZXNldFN0cmVhbX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5zb3VyY2UuRXZlbnRJbiNzdG9wfVxuICAgKi9cbiAgc3RhcnQoc3RhcnRUaW1lID0gbnVsbCkge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkID09PSBmYWxzZSkge1xuICAgICAgaWYgKHRoaXMuaW5pdFByb21pc2UgPT09IG51bGwpIC8vIGluaXQgaGFzIG5vdCB5ZXQgYmVlbiBjYWxsZWRcbiAgICAgICAgdGhpcy5pbml0UHJvbWlzZSA9IHRoaXMuaW5pdCgpO1xuXG4gICAgICB0aGlzLmluaXRQcm9taXNlLnRoZW4oKCkgPT4gdGhpcy5zdGFydChzdGFydFRpbWUpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9zdGFydFRpbWUgPSBzdGFydFRpbWU7XG4gICAgdGhpcy5fc3lzdGVtVGltZSA9IG51bGw7IC8vIHZhbHVlIHNldCBpbiB0aGUgZmlyc3QgYHByb2Nlc3NgIGNhbGxcblxuICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogRmluYWxpemUgdGhlIHN0cmVhbSBhbmQgc3RvcCB0aGUgd2hvbGUgZ3JhcGguIEFueSBjYWxsIHRvIGBwcm9jZXNzYCBvclxuICAgKiBgcHJvY2Vzc0ZyYW1lYCBhZnRlciBgc3RvcGAgd2lsbCBiZSBpZ25vcmVkLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNmaW5hbGl6ZVN0cmVhbX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5zb3VyY2UuRXZlbnRJbiNzdGFydH1cbiAgICovXG4gIHN0b3AoKSB7XG4gICAgaWYgKHRoaXMuc3RhcnRlZCAmJiB0aGlzLl9zdGFydFRpbWUgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gdGhpcy5fZ2V0VGltZSgpO1xuICAgICAgY29uc3QgZW5kVGltZSA9IHRoaXMuZnJhbWUudGltZSArIChjdXJyZW50VGltZSAtIHRoaXMuX3N5c3RlbVRpbWUpO1xuXG4gICAgICB0aGlzLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMoKSB7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdmcmFtZVNpemUnKTtcbiAgICBjb25zdCBmcmFtZVR5cGUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lVHlwZScpO1xuICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnBhcmFtcy5nZXQoJ3NhbXBsZVJhdGUnKTtcbiAgICBjb25zdCBmcmFtZVJhdGUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lUmF0ZScpO1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdGhpcy5wYXJhbXMuZ2V0KCdkZXNjcmlwdGlvbicpO1xuICAgIC8vIGluaXQgb3BlcmF0b3IncyBzdHJlYW0gcGFyYW1zXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gZnJhbWVUeXBlID09PSAnc2NhbGFyJyA/IDEgOiBmcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gZnJhbWVUeXBlO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG5cbiAgICBpZiAoZnJhbWVUeXBlID09PSAnc2lnbmFsJykge1xuICAgICAgaWYgKHNhbXBsZVJhdGUgPT09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5kZWZpbmVkIFwic2FtcGxlUmF0ZVwiIGZvciBcInNpZ25hbFwiIHN0cmVhbScpO1xuXG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlID0gc2FtcGxlUmF0ZTtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHNhbXBsZVJhdGUgLyBmcmFtZVNpemU7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVDb3VudCA9IGZyYW1lU2l6ZTtcblxuICAgIH0gZWxzZSBpZiAoZnJhbWVUeXBlID09PSAndmVjdG9yJyB8fCBmcmFtZVR5cGUgPT09ICdzY2FsYXInKSB7XG4gICAgICBpZiAoZnJhbWVSYXRlID09PSBudWxsKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZGVmaW5lZCBcImZyYW1lUmF0ZVwiIGZvciBcInZlY3RvclwiIHN0cmVhbScpO1xuXG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSBmcmFtZVJhdGU7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlID0gZnJhbWVSYXRlO1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlQ291bnQgPSAxO1xuICAgIH1cblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0Z1bmN0aW9uKGZyYW1lKSB7XG4gICAgY29uc3QgY3VycmVudFRpbWUgPSB0aGlzLl9nZXRUaW1lKCk7XG4gICAgY29uc3QgaW5EYXRhID0gZnJhbWUuZGF0YS5sZW5ndGggPyBmcmFtZS5kYXRhIDogW2ZyYW1lLmRhdGFdO1xuICAgIGNvbnN0IG91dERhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgLy8gaWYgbm8gdGltZSBwcm92aWRlZCwgdXNlIHN5c3RlbSB0aW1lXG4gICAgbGV0IHRpbWUgPSBOdW1iZXIuaXNGaW5pdGUoZnJhbWUudGltZSkgPyBmcmFtZS50aW1lIDogY3VycmVudFRpbWU7XG5cbiAgICBpZiAodGhpcy5fc3RhcnRUaW1lID09PSBudWxsKVxuICAgICAgdGhpcy5fc3RhcnRUaW1lID0gdGltZTtcblxuICAgIGlmICh0aGlzLl9hYnNvbHV0ZVRpbWUgPT09IGZhbHNlKVxuICAgICAgdGltZSA9IHRpbWUgLSB0aGlzLl9zdGFydFRpbWU7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTsgaSA8IGw7IGkrKylcbiAgICAgIG91dERhdGFbaV0gPSBpbkRhdGFbaV07XG5cbiAgICB0aGlzLmZyYW1lLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMuZnJhbWUubWV0YWRhdGEgPSBmcmFtZS5tZXRhZGF0YTtcbiAgICAvLyBzdG9yZSBjdXJyZW50IHRpbWUgdG8gY29tcHV0ZSBgZW5kVGltZWAgb24gc3RvcFxuICAgIHRoaXMuX3N5c3RlbVRpbWUgPSBjdXJyZW50VGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbHRlcm5hdGl2ZSBpbnRlcmZhY2UgdG8gcHJvcGFnYXRlIGEgZnJhbWUgaW4gdGhlIGdyYXBoLiBQYWNrIGB0aW1lYCxcbiAgICogYGRhdGFgIGFuZCBgbWV0YWRhdGFgIGluIGEgZnJhbWUgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSAtIEZyYW1lIHRpbWUuXG4gICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fEFycmF5fSBkYXRhIC0gRnJhbWUgZGF0YS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG1ldGFkYXRhIC0gT3B0aW9ubmFsIGZyYW1lIG1ldGFkYXRhLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBldmVudEluLnByb2Nlc3MoMSwgWzAsIDEsIDJdKTtcbiAgICogLy8gaXMgZXF1aXZhbGVudCB0b1xuICAgKiBldmVudEluLnByb2Nlc3NGcmFtZSh7IHRpbWU6IDEsIGRhdGE6IFswLCAxLCAyXSB9KTtcbiAgICovXG4gIHByb2Nlc3ModGltZSwgZGF0YSwgbWV0YWRhdGEgPSBudWxsKSB7XG4gICAgdGhpcy5wcm9jZXNzRnJhbWUoeyB0aW1lLCBkYXRhLCBtZXRhZGF0YSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGUgYSBmcmFtZSBvYmplY3QgaW4gdGhlIGdyYXBoLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZnJhbWUgLSBJbnB1dCBmcmFtZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGZyYW1lLnRpbWUgLSBGcmFtZSB0aW1lLlxuICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheXxBcnJheX0gZnJhbWUuZGF0YSAtIEZyYW1lIGRhdGEuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbZnJhbWUubWV0YWRhdGE9dW5kZWZpbmVkXSAtIE9wdGlvbm5hbCBmcmFtZSBtZXRhZGF0YS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogZXZlbnRJbi5wcm9jZXNzRnJhbWUoeyB0aW1lOiAxLCBkYXRhOiBbMCwgMSwgMl0gfSk7XG4gICAqL1xuICBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgICBpZiAoIXRoaXMuc3RhcnRlZCkgcmV0dXJuO1xuXG4gICAgdGhpcy5wcmVwYXJlRnJhbWUoKTtcbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG4gICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50SW47XG4iLCJcbi8vIHNob3J0Y3V0cyAvIGhlbHBlcnNcbmNvbnN0IFBJICAgPSBNYXRoLlBJO1xuY29uc3QgY29zICA9IE1hdGguY29zO1xuY29uc3Qgc2luICA9IE1hdGguc2luO1xuY29uc3Qgc3FydCA9IE1hdGguc3FydDtcblxuLy8gd2luZG93IGNyZWF0aW9uIGZ1bmN0aW9uc1xuZnVuY3Rpb24gaW5pdEhhbm5XaW5kb3coYnVmZmVyLCBzaXplLCBub3JtQ29lZnMpIHtcbiAgbGV0IGxpblN1bSA9IDA7XG4gIGxldCBwb3dTdW0gPSAwO1xuICBjb25zdCBzdGVwID0gMiAqIFBJIC8gc2l6ZTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgIGNvbnN0IHBoaSA9IGkgKiBzdGVwO1xuICAgIGNvbnN0IHZhbHVlID0gMC41IC0gMC41ICogY29zKHBoaSk7XG5cbiAgICBidWZmZXJbaV0gPSB2YWx1ZTtcblxuICAgIGxpblN1bSArPSB2YWx1ZTtcbiAgICBwb3dTdW0gKz0gdmFsdWUgKiB2YWx1ZTtcbiAgfVxuXG4gIG5vcm1Db2Vmcy5saW5lYXIgPSBzaXplIC8gbGluU3VtO1xuICBub3JtQ29lZnMucG93ZXIgPSBzcXJ0KHNpemUgLyBwb3dTdW0pO1xufVxuXG5mdW5jdGlvbiBpbml0SGFtbWluZ1dpbmRvdyhidWZmZXIsIHNpemUsIG5vcm1Db2Vmcykge1xuICBsZXQgbGluU3VtID0gMDtcbiAgbGV0IHBvd1N1bSA9IDA7XG4gIGNvbnN0IHN0ZXAgPSAyICogUEkgLyBzaXplO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgY29uc3QgcGhpID0gaSAqIHN0ZXA7XG4gICAgY29uc3QgdmFsdWUgPSAwLjU0IC0gMC40NiAqIGNvcyhwaGkpO1xuXG4gICAgYnVmZmVyW2ldID0gdmFsdWU7XG5cbiAgICBsaW5TdW0gKz0gdmFsdWU7XG4gICAgcG93U3VtICs9IHZhbHVlICogdmFsdWU7XG4gIH1cblxuICBub3JtQ29lZnMubGluZWFyID0gc2l6ZSAvIGxpblN1bTtcbiAgbm9ybUNvZWZzLnBvd2VyID0gc3FydChzaXplIC8gcG93U3VtKTtcbn1cblxuZnVuY3Rpb24gaW5pdEJsYWNrbWFuV2luZG93KGJ1ZmZlciwgc2l6ZSwgbm9ybUNvZWZzKSB7XG4gIGxldCBsaW5TdW0gPSAwO1xuICBsZXQgcG93U3VtID0gMDtcbiAgY29uc3Qgc3RlcCA9IDIgKiBQSSAvIHNpemU7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICBjb25zdCBwaGkgPSBpICogc3RlcDtcbiAgICBjb25zdCB2YWx1ZSA9IDAuNDIgLSAwLjUgKiBjb3MocGhpKSArIDAuMDggKiBjb3MoMiAqIHBoaSk7XG5cbiAgICBidWZmZXJbaV0gPSB2YWx1ZTtcblxuICAgIGxpblN1bSArPSB2YWx1ZTtcbiAgICBwb3dTdW0gKz0gdmFsdWUgKiB2YWx1ZTtcbiAgfVxuXG4gIG5vcm1Db2Vmcy5saW5lYXIgPSBzaXplIC8gbGluU3VtO1xuICBub3JtQ29lZnMucG93ZXIgPSBzcXJ0KHNpemUgLyBwb3dTdW0pO1xufVxuXG5mdW5jdGlvbiBpbml0QmxhY2ttYW5IYXJyaXNXaW5kb3coYnVmZmVyLCBzaXplLCBub3JtQ29lZnMpIHtcbiAgbGV0IGxpblN1bSA9IDA7XG4gIGxldCBwb3dTdW0gPSAwO1xuICBjb25zdCBhMCA9IDAuMzU4NzU7XG4gIGNvbnN0IGExID0gMC40ODgyOTtcbiAgY29uc3QgYTIgPSAwLjE0MTI4O1xuICBjb25zdCBhMyA9IDAuMDExNjg7XG4gIGNvbnN0IHN0ZXAgPSAyICogUEkgLyBzaXplO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgY29uc3QgcGhpID0gaSAqIHN0ZXA7XG4gICAgY29uc3QgdmFsdWUgPSBhMCAtIGExICogY29zKHBoaSkgKyBhMiAqIGNvcygyICogcGhpKTsgLSBhMyAqIGNvcygzICogcGhpKTtcblxuICAgIGJ1ZmZlcltpXSA9IHZhbHVlO1xuXG4gICAgbGluU3VtICs9IHZhbHVlO1xuICAgIHBvd1N1bSArPSB2YWx1ZSAqIHZhbHVlO1xuICB9XG5cbiAgbm9ybUNvZWZzLmxpbmVhciA9IHNpemUgLyBsaW5TdW07XG4gIG5vcm1Db2Vmcy5wb3dlciA9IHNxcnQoc2l6ZSAvIHBvd1N1bSk7XG59XG5cbmZ1bmN0aW9uIGluaXRTaW5lV2luZG93KGJ1ZmZlciwgc2l6ZSwgbm9ybUNvZWZzKSB7XG4gIGxldCBsaW5TdW0gPSAwO1xuICBsZXQgcG93U3VtID0gMDtcbiAgY29uc3Qgc3RlcCA9IFBJIC8gc2l6ZTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgIGNvbnN0IHBoaSA9IGkgKiBzdGVwO1xuICAgIGNvbnN0IHZhbHVlID0gc2luKHBoaSk7XG5cbiAgICBidWZmZXJbaV0gPSB2YWx1ZTtcblxuICAgIGxpblN1bSArPSB2YWx1ZTtcbiAgICBwb3dTdW0gKz0gdmFsdWUgKiB2YWx1ZTtcbiAgfVxuXG4gIG5vcm1Db2Vmcy5saW5lYXIgPSBzaXplIC8gbGluU3VtO1xuICBub3JtQ29lZnMucG93ZXIgPSBzcXJ0KHNpemUgLyBwb3dTdW0pO1xufVxuXG5mdW5jdGlvbiBpbml0UmVjdGFuZ2xlV2luZG93KGJ1ZmZlciwgc2l6ZSwgbm9ybUNvZWZzKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKVxuICAgIGJ1ZmZlcltpXSA9IDE7XG5cbiAgLy8gQHRvZG8gLSBjaGVjayBpZiB0aGVzZSBhcmUgcHJvcGVyIHZhbHVlc1xuICBub3JtQ29lZnMubGluZWFyID0gMTtcbiAgbm9ybUNvZWZzLnBvd2VyID0gMTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBidWZmZXIgd2l0aCB3aW5kb3cgc2lnbmFsLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLnV0aWxzXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSB3aW5kb3cuXG4gKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gYnVmZmVyIC0gQnVmZmVyIHRvIGJlIHBvcHVsYXRlZCB3aXRoIHRoZSB3aW5kb3cgc2lnbmFsLlxuICogQHBhcmFtIHtOdW1iZXJ9IHNpemUgLSBTaXplIG9mIHRoZSBidWZmZXIuXG4gKiBAcGFyYW0ge09iamVjdH0gbm9ybUNvZWZzIC0gT2JqZWN0IHRvIGJlIHBvcHVsYXRlZCB3aXRoIHRoZSBub3JtYWlsemF0aW9uXG4gKiAgY29lZmZpY2llbnRzLlxuICovXG5mdW5jdGlvbiBpbml0V2luZG93KG5hbWUsIGJ1ZmZlciwgc2l6ZSwgbm9ybUNvZWZzKSB7XG4gIG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgc3dpdGNoIChuYW1lKSB7XG4gICAgY2FzZSAnaGFubic6XG4gICAgY2FzZSAnaGFubmluZyc6XG4gICAgICBpbml0SGFubldpbmRvdyhidWZmZXIsIHNpemUsIG5vcm1Db2Vmcyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdoYW1taW5nJzpcbiAgICAgIGluaXRIYW1taW5nV2luZG93KGJ1ZmZlciwgc2l6ZSwgbm9ybUNvZWZzKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2JsYWNrbWFuJzpcbiAgICAgIGluaXRCbGFja21hbldpbmRvdyhidWZmZXIsIHNpemUsIG5vcm1Db2Vmcyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdibGFja21hbmhhcnJpcyc6XG4gICAgICBpbml0QmxhY2ttYW5IYXJyaXNXaW5kb3coYnVmZmVyLCBzaXplLCBub3JtQ29lZnMpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc2luZSc6XG4gICAgICBpbml0U2luZVdpbmRvdyhidWZmZXIsIHNpemUsIG5vcm1Db2Vmcyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdyZWN0YW5nbGUnOlxuICAgICAgaW5pdFJlY3RhbmdsZVdpbmRvdyhidWZmZXIsIHNpemUsIG5vcm1Db2Vmcyk7XG4gICAgICBicmVhaztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBpbml0V2luZG93O1xuXG5cbiIsIi8vaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy84NjA5Mjg5L2NvbnZlcnQtYS1iaW5hcnktbm9kZWpzLWJ1ZmZlci10by1qYXZhc2NyaXB0LWFycmF5YnVmZmVyXG4vLyBjb252ZXJ0cyBhIG5vZGVqcyBCdWZmZXIgdG8gQXJyYXlCdWZmZXJcbi8vIGV4cG9ydCBmdW5jdGlvbiBidWZmZXJUb0FycmF5QnVmZmVyKGJ1ZmZlcikge1xuLy8gICBjb25zdCBhYiA9IG5ldyBBcnJheUJ1ZmZlcihidWZmZXIubGVuZ3RoKTtcbi8vICAgY29uc3QgdmlldyA9IG5ldyBVaW50OEFycmF5KGFiKTtcblxuLy8gICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1ZmZlci5sZW5ndGg7ICsraSlcbi8vICAgICB2aWV3W2ldID0gYnVmZmVyW2ldO1xuXG4vLyAgIHJldHVybiBhYjtcbi8vIH1cblxuLy8gZXhwb3J0IGZ1bmN0aW9uIGFycmF5QnVmZmVyVG9CdWZmZXIoYXJyYXlCdWZmZXIpIHtcbi8vICAgY29uc3QgYnVmZmVyID0gbmV3IEJ1ZmZlcihhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoKTtcbi8vICAgY29uc3QgdmlldyA9IG5ldyBVaW50OEFycmF5KGFycmF5QnVmZmVyKTtcblxuLy8gICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1ZmZlci5sZW5ndGg7ICsraSlcbi8vICAgICBidWZmZXJbaV0gPSB2aWV3W2ldO1xuXG4vLyAgIHJldHVybiBidWZmZXI7XG4vLyB9XG5cbi8vIGh0dHA6Ly91cGRhdGVzLmh0bWw1cm9ja3MuY29tLzIwMTIvMDYvSG93LXRvLWNvbnZlcnQtQXJyYXlCdWZmZXItdG8tYW5kLWZyb20tU3RyaW5nXG5mdW5jdGlvbiBVaW50MTZBcnJheTJqc29uKGFycikge1xuICBjb25zdCBzdHIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIGFycik7XG4gIHJldHVybiBKU09OLnBhcnNlKHN0ci5yZXBsYWNlKC9cXHUwMDAwL2csICcnKSlcbn1cblxuZnVuY3Rpb24ganNvbjJVaW50MTZBcnJheShqc29uKSB7XG4gIGNvbnN0IHN0ciA9IEpTT04uc3RyaW5naWZ5KGpzb24pO1xuICBjb25zdCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoc3RyLmxlbmd0aCAqIDIpOyAvLyAyIGJ5dGVzIGZvciBlYWNoIGNoYXJcbiAgY29uc3QgYnVmZmVyVmlldyA9IG5ldyBVaW50MTZBcnJheShidWZmZXIpO1xuXG4gIGZvciAobGV0IGkgPSAwLCBsID0gc3RyLmxlbmd0aDsgaSA8IGw7IGkrKylcbiAgICBidWZmZXJWaWV3W2ldID0gc3RyLmNoYXJDb2RlQXQoaSk7XG5cbiAgcmV0dXJuIGJ1ZmZlclZpZXc7XG59XG5cblxuZXhwb3J0IGNvbnN0IG9wY29kZXMgPSB7XG4gIElOSVRfTU9EVUxFX1JFUTogMTAsXG4gIElOSVRfTU9EVUxFX0FDSzogMTEsXG4gIFBST0NFU1NfU1RSRUFNX1BBUkFNUzogMTIsXG4gIFJFU0VUX1NUUkVBTTogMTMsXG4gIEZJTkFMSVpFX1NUUkVBTTogMTQsXG4gIFBST0NFU1NfRlJBTUU6IDE1XG59XG5cbi8vXG5leHBvcnQgY29uc3QgZW5jb2RlcnMgPSB7XG4gIG9wY29kZShuYW1lKSB7XG4gICAgY29uc3Qgb3Bjb2RlID0gb3Bjb2Rlc1tuYW1lXTtcbiAgICBjb25zdCBidWZmZXIgPSBuZXcgVWludDE2QXJyYXkoMSk7XG4gICAgYnVmZmVyWzBdID0gb3Bjb2RlO1xuXG4gICAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSxcbiAgLy8gYG9wY29kZWAgICAgMiBieXRlcyAoVWludDE2KSB8XG4gIGluaXRNb2R1bGVSZXE6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHBheWxvYWQgPSBlbmNvZGVycy5vcGNvZGUoJ0lOSVRfTU9EVUxFX1JFUScpO1xuICAgIHJldHVybiBwYXlsb2FkLmJ1ZmZlcjtcbiAgfSxcbiAgLy8gYG9wY29kZWAgICAgMiBieXRlcyAoVWludDE2KSB8XG4gIGluaXRNb2R1bGVBY2s6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHBheWxvYWQgPSBlbmNvZGVycy5vcGNvZGUoJ0lOSVRfTU9EVUxFX0FDSycpO1xuICAgIHJldHVybiBwYXlsb2FkLmJ1ZmZlcjtcbiAgfSxcbiAgLy8gYG9wY29kZWAgICAgMiBieXRlcyAoVWludDE2KSB8XG4gIC8vIGBzdHJlYW1QYXJhbXNgICBuIGJ5dGVzIChVaW50MTYpXG4gIHN0cmVhbVBhcmFtczogZnVuY3Rpb24oc3RyZWFtUGFyYW1zKSB7XG4gICAgY29uc3Qgb3Bjb2RlID0gZW5jb2RlcnMub3Bjb2RlKCdQUk9DRVNTX1NUUkVBTV9QQVJBTVMnKTtcbiAgICBjb25zdCBzdHJlYW1QYXJhbXNCdWZmZXIgPSBqc29uMlVpbnQxNkFycmF5KHN0cmVhbVBhcmFtcyk7XG5cbiAgICBjb25zdCBwYXlsb2FkID0gbmV3IFVpbnQxNkFycmF5KDEgKyBzdHJlYW1QYXJhbXNCdWZmZXIubGVuZ3RoKTtcbiAgICBwYXlsb2FkLnNldChvcGNvZGUsIDApO1xuICAgIHBheWxvYWQuc2V0KHN0cmVhbVBhcmFtc0J1ZmZlciwgMSk7XG5cbiAgICByZXR1cm4gcGF5bG9hZC5idWZmZXI7XG4gIH0sXG4gIC8vIGBvcGNvZGVgICAgIDIgYnl0ZXMgKFVpbnQxNikgfFxuICByZXNldFN0cmVhbTogZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgcGF5bG9hZCA9IGVuY29kZXJzLm9wY29kZSgnUkVTRVRfU1RSRUFNJyk7XG4gICAgcmV0dXJuIHBheWxvYWQuYnVmZmVyO1xuICB9LFxuICAvLyBgb3Bjb2RlYCAgICAyIGJ5dGVzIChVaW50MTYpIHxcbiAgLy8gYGVuZFRpbWVgICAgOCBieXRlcyAoRmxvYXQ2NClcbiAgZmluYWxpemVTdHJlYW06IGZ1bmN0aW9uKGVuZFRpbWUpIHtcbiAgICBjb25zdCBvcGNvZGUgPSBlbmNvZGVycy5vcGNvZGUoJ1JFU0VUX1NUUkVBTScpO1xuXG4gICAgY29uc3QgZW5kVGltZUJ1ZmZlciA9IG5ldyBGbG9hdDY0QXJyYXkoMSk7XG4gICAgZW5kVGltZUJ1ZmZlclswXSA9IGVuZFRpbWU7XG5cbiAgICBjb25zdCBwYXlsb2FkID0gbmV3IFVpbnQxNkFycmF5KDEgKyA0KTtcbiAgICBwYXlsb2FkLnNldChvcGNvZGUsIDApO1xuICAgIHBheWxvYWQuc2V0KG5ldyBVaW50MTZBcnJheShlbmRUaW1lQnVmZmVyLmJ1ZmZlciksIDEpO1xuXG4gICAgcmV0dXJuIHBheWxvYWQuYnVmZmVyO1xuICB9LFxuICAvLyBgb3Bjb2RlYCAgICAyIGJ5dGVzIChVaW50MTYpIHxcbiAgLy8gYHRpbWVgICAgICAgOCBieXRlcyAoRmxvYXQ2NCkgfFxuICAvLyBgZGF0YWAgICAgICBmcmFtZVNpemUgKiA0IChGbG9hdDMyKSB8XG4gIC8vIGBtZXRhZGF0YWAgIG4gYnl0ZXMgKFVpbnQxNilcbiAgcHJvY2Vzc0ZyYW1lOiBmdW5jdGlvbihmcmFtZSwgZnJhbWVTaXplKSB7XG4gICAgY29uc3Qgb3Bjb2RlID0gZW5jb2RlcnMub3Bjb2RlKCdQUk9DRVNTX0ZSQU1FJyk7XG5cbiAgICBjb25zdCB0aW1lID0gbmV3IEZsb2F0NjRBcnJheSgxKTtcbiAgICB0aW1lWzBdID0gZnJhbWUudGltZTtcblxuICAgIGNvbnN0IGRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KGZyYW1lU2l6ZSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKylcbiAgICAgIGRhdGFbaV0gPSBmcmFtZS5kYXRhW2ldO1xuXG4gICAgY29uc3QgbWV0YWRhdGEgPSBqc29uMlVpbnQxNkFycmF5KGZyYW1lLm1ldGFkYXRhKTtcblxuICAgIGNvbnN0IGxlbmd0aCA9IDEgKyA0ICsgKDIgKiBmcmFtZVNpemUpICsgbWV0YWRhdGEubGVuZ3RoO1xuICAgIGNvbnN0IHBheWxvYWQgPSBuZXcgVWludDE2QXJyYXkobGVuZ3RoKTtcbiAgICBwYXlsb2FkLnNldChvcGNvZGUsIDApO1xuICAgIHBheWxvYWQuc2V0KG5ldyBVaW50MTZBcnJheSh0aW1lLmJ1ZmZlciksIDEpO1xuICAgIHBheWxvYWQuc2V0KG5ldyBVaW50MTZBcnJheShkYXRhLmJ1ZmZlciksIDEgKyA0KTtcbiAgICBwYXlsb2FkLnNldChtZXRhZGF0YSwgMSArIDQgKyAoMiAqIGZyYW1lU2l6ZSkpO1xuXG4gICAgcmV0dXJuIHBheWxvYWQuYnVmZmVyO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBkZWNvZGVycyA9IHtcbiAgb3Bjb2RlKGFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIG5ldyBVaW50MTZBcnJheShhcnJheUJ1ZmZlcilbMF07XG4gIH0sXG4gIC8vIGBvcGNvZGVgICAgIDIgYnl0ZXMgKFVpbnQxNikgfFxuICAvLyBgc3RyZWFtUGFyYW1zYCAgbiBieXRlcyAoVWludDE2KVxuICBzdHJlYW1QYXJhbXMoYXJyYXlCdWZmZXIpIHtcbiAgICBjb25zdCBwYXlsb2FkID0gbmV3IFVpbnQxNkFycmF5KGFycmF5QnVmZmVyLnNsaWNlKDIpKTtcbiAgICBjb25zdCBwcmV2U3RyZWFtUGFyYW1zID0gVWludDE2QXJyYXkyanNvbihwYXlsb2FkKTtcbiAgICByZXR1cm4gcHJldlN0cmVhbVBhcmFtcztcbiAgfSxcbiAgLy8gYG9wY29kZWAgICAgMiBieXRlcyAoVWludDE2KSB8XG4gIC8vIGBlbmRUaW1lYCAgIDggYnl0ZXMgKEZsb2F0NjQpXG4gIGZpbmFsaXplU3RyZWFtKGFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIG5ldyBGbG9hdDY0QXJyYXkoYXJyYXlCdWZmZXIuc2xpY2UoMikpWzBdO1xuICB9LFxuICAvLyBgb3Bjb2RlYCAgICAyIGJ5dGVzIChVaW50MTYpIHxcbiAgLy8gYHRpbWVgICAgICAgOCBieXRlcyAoRmxvYXQ2NCkgfFxuICAvLyBgZGF0YWAgICAgICBmcmFtZVNpemUgKiA0IChGbG9hdDMyKSB8XG4gIC8vIGBtZXRhZGF0YWAgIG4gYnl0ZXMgKFVpbnQxNilcbiAgcHJvY2Vzc0ZyYW1lKGFycmF5QnVmZmVyLCBmcmFtZVNpemUpIHtcbiAgICAgIC8vIDEgKiA4IGJ5dGVzXG4gICAgICBjb25zdCB0aW1lU3RhcnQgPSAyO1xuICAgICAgY29uc3QgdGltZUVuZCA9IHRpbWVTdGFydCArIDg7XG4gICAgICBjb25zdCB0aW1lID0gbmV3IEZsb2F0NjRBcnJheShhcnJheUJ1ZmZlci5zbGljZSh0aW1lU3RhcnQsIHRpbWVFbmQpKVswXTtcbiAgICAgIC8vIGZyYW1lU2l6ZSAqIDQgYnl0ZXNcbiAgICAgIGNvbnN0IGRhdGFTdGFydCA9IHRpbWVFbmQ7XG4gICAgICBjb25zdCBkYXRhRW5kID0gZGF0YVN0YXJ0ICsgNCAqIGZyYW1lU2l6ZTtcbiAgICAgIGNvbnN0IGRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KGFycmF5QnVmZmVyLnNsaWNlKGRhdGFTdGFydCwgZGF0YUVuZCkpO1xuICAgICAgLy8gcmVzdCBvZiBwYXlsb2FkXG4gICAgICBjb25zdCBtZXRhU3RhcnQgPSBkYXRhRW5kO1xuICAgICAgY29uc3QgbWV0YUJ1ZmZlciA9IG5ldyBVaW50MTZBcnJheShhcnJheUJ1ZmZlci5zbGljZShtZXRhU3RhcnQpKTtcbiAgICAgIGNvbnN0IG1ldGFkYXRhID0gVWludDE2QXJyYXkyanNvbihtZXRhQnVmZmVyKTtcblxuICAgICAgcmV0dXJuIHsgdGltZSwgZGF0YSwgbWV0YWRhdGEgfTtcbiAgfVxufVxuIiwiaW1wb3J0IHBhcmFtZXRlcnMgZnJvbSAncGFyYW1ldGVycyc7XG5cbmxldCBpZCA9IDA7XG5cbi8qKlxuICogQmFzZSBgbGZvYCBjbGFzcyB0byBiZSBleHRlbmRlZCBpbiBvcmRlciB0byBjcmVhdGUgbmV3IG5vZGVzLlxuICpcbiAqIE5vZGVzIGFyZSBkaXZpZGVkIGluIDMgY2F0ZWdvcmllczpcbiAqIC0gKipgc291cmNlYCoqIGFyZSByZXNwb25zaWJsZSBmb3IgYWNxdWVyaW5nIGEgc2lnbmFsIGFuZCBpdHMgcHJvcGVydGllc1xuICogICAoZnJhbWVSYXRlLCBmcmFtZVNpemUsIGV0Yy4pXG4gKiAtICoqYHNpbmtgKiogYXJlIGVuZHBvaW50cyBvZiB0aGUgZ3JhcGgsIHN1Y2ggbm9kZXMgY2FuIGJlIHJlY29yZGVycyxcbiAqICAgdmlzdWFsaXplcnMsIGV0Yy5cbiAqIC0gKipgb3BlcmF0b3JgKiogYXJlIHVzZWQgdG8gbWFrZSBjb21wdXRhdGlvbiBvbiB0aGUgaW5wdXQgc2lnbmFsIGFuZFxuICogICBmb3J3YXJkIHRoZSByZXN1bHRzIGJlbG93IGluIHRoZSBncmFwaC5cbiAqXG4gKiBJbiBtb3N0IGNhc2VzIHRoZSBtZXRob2RzIHRvIG92ZXJyaWRlIC8gZXh0ZW5kIGFyZTpcbiAqIC0gdGhlICoqYGNvbnN0cnVjdG9yYCoqIHRvIGRlZmluZSB0aGUgcGFyYW1ldGVycyBvZiB0aGUgbmV3IGxmbyBub2RlLlxuICogLSB0aGUgKipgcHJvY2Vzc1N0cmVhbVBhcmFtc2AqKiBtZXRob2QgdG8gZGVmaW5lIGhvdyB0aGUgbm9kZSBtb2RpZnkgdGhlXG4gKiAgIHN0cmVhbSBhdHRyaWJ1dGVzIChlLmcuIGJ5IGNoYW5naW5nIHRoZSBmcmFtZSBzaXplKVxuICogLSB0aGUgKipgcHJvY2Vzc3tGcmFtZVR5cGV9YCoqIG1ldGhvZCB0byBkZWZpbmUgdGhlIG9wZXJhdGlvbnMgdGhhdCB0aGVcbiAqICAgbm9kZSBhcHBseSBvbiB0aGUgc3RyZWFtLiBUaGUgdHlwZSBvZiBpbnB1dCBhIG5vZGUgY2FuIGhhbmRsZSBpcyBkZWZpbmVkXG4gKiAgIGJ5IGl0cyBpbXBsZW1lbnRlZCBpbnRlcmZhY2UsIGlmIGl0IGltcGxlbWVudHMgYHByb2Nlc3NTaWduYWxgLCBhIHN0cmVhbVxuICogICBvZiB0eXBlIGBzaWduYWxgIGNhbiBiZSBwcm9jZXNzZWQsIGBwcm9jZXNzVmVjdG9yYCB0byBoYW5kbGVcbiAqICAgYW4gaW5wdXQgb2YgdHlwZSBgdmVjdG9yYC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fVGhpcyBjbGFzcyBzaG91bGQgYmUgY29uc2lkZXJlZCBhYnN0cmFjdCBhbmQgb25seVxuICogYmUgdXNlZCBhcyBhIGJhc2UgY2xhc3MgdG8gZXh0ZW5kLl88L3NwYW4+XG4gKlxuICogIyMjIyBvdmVydmlldyBvZiB0aGUgaW50ZXJmYWNlXG4gKlxuICogKippbml0TW9kdWxlKipcbiAqXG4gKiBSZXR1cm5zIGEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIG1vZHVsZSBpcyBpbml0aWFsaXplZC4gSXNcbiAqIGVzcGVjaWFsbHkgaW1wb3J0YW50IGZvciBtb2R1bGVzIHRoYXQgcmVseSBvbiBhc3luY2hyb25vdXMgdW5kZXJseWluZyBBUElzLlxuICpcbiAqICoqcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSoqXG4gKlxuICogYGJhc2VgIGNsYXNzIChkZWZhdWx0IGltcGxlbWVudGF0aW9uKVxuICogLSBjYWxsIGBwcmVwYXJlU3RyZWFtUGFyYW1zYFxuICogLSBjYWxsIGBwcm9wYWdhdGVTdHJlYW1QYXJhbXNgXG4gKlxuICogYGNoaWxkYCBjbGFzc1xuICogLSBvdmVycmlkZSBzb21lIG9mIHRoZSBpbmhlcml0ZWQgYHN0cmVhbVBhcmFtc2BcbiAqIC0gY3JlYXRlcyB0aGUgYW55IHJlbGF0ZWQgbG9naWMgYnVmZmVyc1xuICogLSBjYWxsIGBwcm9wYWdhdGVTdHJlYW1QYXJhbXNgXG4gKlxuICogX3Nob3VsZCBub3QgY2FsbCBgc3VwZXIucHJvY2Vzc1N0cmVhbVBhcmFtc2BfXG4gKlxuICogKipwcmVwYXJlU3RyZWFtUGFyYW1zKCkqKlxuICpcbiAqIC0gYXNzaWduIHByZXZTdHJlYW1QYXJhbXMgdG8gdGhpcy5zdHJlYW1QYXJhbXNcbiAqIC0gY2hlY2sgaWYgdGhlIGNsYXNzIGltcGxlbWVudHMgdGhlIGNvcnJlY3QgYHByb2Nlc3NJbnB1dGAgbWV0aG9kXG4gKlxuICogX3Nob3VsZG4ndCBiZSBleHRlbmRlZCwgb25seSBjb25zdW1lZCBpbiBgcHJvY2Vzc1N0cmVhbVBhcmFtc2BfXG4gKlxuICogKipwcm9wYWdhdGVTdHJlYW1QYXJhbXMoKSoqXG4gKlxuICogLSBjcmVhdGVzIHRoZSBgZnJhbWVEYXRhYCBidWZmZXJcbiAqIC0gcHJvcGFnYXRlIGBzdHJlYW1QYXJhbXNgIHRvIGNoaWxkcmVuXG4gKlxuICogX3Nob3VsZG4ndCBiZSBleHRlbmRlZCwgb25seSBjb25zdW1lZCBpbiBgcHJvY2Vzc1N0cmVhbVBhcmFtc2BfXG4gKlxuICogKipwcm9jZXNzRnJhbWUoKSoqXG4gKlxuICogYGJhc2VgIGNsYXNzIChkZWZhdWx0IGltcGxlbWVudGF0aW9uKVxuICogLSBjYWxsIGBwcmVwYXJlRnJhbWVgXG4gKiAtIGFzc2lnbiBmcmFtZVRpbWUgYW5kIGZyYW1lTWV0YWRhdGEgdG8gaWRlbnRpdHlcbiAqIC0gY2FsbCB0aGUgcHJvcGVyIGZ1bmN0aW9uIGFjY29yZGluZyB0byBpbnB1dFR5cGVcbiAqIC0gY2FsbCBgcHJvcGFnYXRlRnJhbWVgXG4gKlxuICogYGNoaWxkYCBjbGFzc1xuICogLSBjYWxsIGBwcmVwYXJlRnJhbWVgXG4gKiAtIGRvIHdoYXRldmVyIHlvdSB3YW50IHdpdGggaW5jb21taW5nIGZyYW1lXG4gKiAtIGNhbGwgYHByb3BhZ2F0ZUZyYW1lYFxuICpcbiAqIF9zaG91bGQgbm90IGNhbGwgYHN1cGVyLnByb2Nlc3NGcmFtZWBfXG4gKlxuICogKipwcmVwYXJlRnJhbWUoKSoqXG4gKlxuICogLSBpZiBgcmVpbml0YCBhbmQgdHJpZ2dlciBgcHJvY2Vzc1N0cmVhbVBhcmFtc2AgaWYgbmVlZGVkXG4gKlxuICogX3Nob3VsZG4ndCBiZSBleHRlbmRlZCwgb25seSBjb25zdW1lZCBpbiBgcHJvY2Vzc0ZyYW1lYF9cbiAqXG4gKiAqKnByb3BhZ2F0ZUZyYW1lKCkqKlxuICpcbiAqIC0gcHJvcGFnYXRlIGZyYW1lIHRvIGNoaWxkcmVuXG4gKlxuICogX3Nob3VsZG4ndCBiZSBleHRlbmRlZCwgb25seSBjb25zdW1lZCBpbiBgcHJvY2Vzc0ZyYW1lYF9cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvcmVcbiAqL1xuY2xhc3MgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKGRlZmluaXRpb25zID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuY2lkID0gaWQrKztcblxuICAgIC8qKlxuICAgICAqIFBhcmFtZXRlciBiYWcgY29udGFpbmluZyBwYXJhbWV0ZXIgaW5zdGFuY2VzLlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAbmFtZSBwYXJhbXNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm9cbiAgICAgKi9cbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtZXRlcnMoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuICAgIC8vIGxpc3RlbiBmb3IgcGFyYW0gdXBkYXRlc1xuICAgIHRoaXMucGFyYW1zLmFkZExpc3RlbmVyKHRoaXMub25QYXJhbVVwZGF0ZS5iaW5kKHRoaXMpKTtcblxuICAgIC8qKlxuICAgICAqIERlc2NyaXB0aW9uIG9mIHRoZSBzdHJlYW0gb3V0cHV0IG9mIHRoZSBub2RlLlxuICAgICAqIFNldCB0byBgbnVsbGAgd2hlbiB0aGUgbm9kZSBpcyBkZXN0cm95ZWQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBmcmFtZVNpemUgLSBGcmFtZSBzaXplIGF0IHRoZSBvdXRwdXQgb2YgdGhlIG5vZGUuXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGZyYW1lUmF0ZSAtIEZyYW1lIHJhdGUgYXQgdGhlIG91dHB1dCBvZiB0aGUgbm9kZS5cbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gZnJhbWVUeXBlIC0gRnJhbWUgdHlwZSBhdCB0aGUgb3V0cHV0IG9mIHRoZSBub2RlLFxuICAgICAqICBwb3NzaWJsZSB2YWx1ZXMgYXJlIGBzaWduYWxgLCBgdmVjdG9yYCBvciBgc2NhbGFyYC5cbiAgICAgKiBAcHJvcGVydHkge0FycmF5fFN0cmluZ30gZGVzY3JpcHRpb24gLSBJZiB0eXBlIGlzIGB2ZWN0b3JgLCBkZXNjcmliZVxuICAgICAqICB0aGUgZGltZW5zaW9uKHMpIG9mIG91dHB1dCBzdHJlYW0uXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHNvdXJjZVNhbXBsZVJhdGUgLSBTYW1wbGUgcmF0ZSBvZiB0aGUgc291cmNlIG9mIHRoZVxuICAgICAqICBncmFwaC4gX1RoZSB2YWx1ZSBzaG91bGQgYmUgZGVmaW5lZCBieSBzb3VyY2VzIGFuZCBuZXZlciBtb2RpZmllZF8uXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHNvdXJjZVNhbXBsZUNvdW50IC0gTnVtYmVyIG9mIGNvbnNlY3V0aXZlIGRpc2NyZXRlXG4gICAgICogIHRpbWUgdmFsdWVzIGNvbnRhaW5lZCBpbiB0aGUgZGF0YSBmcmFtZSBvdXRwdXQgYnkgdGhlIHNvdXJjZS5cbiAgICAgKiAgX1RoZSB2YWx1ZSBzaG91bGQgYmUgZGVmaW5lZCBieSBzb3VyY2VzIGFuZCBuZXZlciBtb2RpZmllZF8uXG4gICAgICpcbiAgICAgKiBAbmFtZSBzdHJlYW1QYXJhbXNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm9cbiAgICAgKi9cbiAgICB0aGlzLnN0cmVhbVBhcmFtcyA9IHtcbiAgICAgIGZyYW1lVHlwZTogbnVsbCxcbiAgICAgIGZyYW1lU2l6ZTogMSxcbiAgICAgIGZyYW1lUmF0ZTogMCxcbiAgICAgIGRlc2NyaXB0aW9uOiBudWxsLFxuICAgICAgc291cmNlU2FtcGxlUmF0ZTogMCxcbiAgICAgIHNvdXJjZVNhbXBsZUNvdW50OiBudWxsLFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDdXJyZW50IGZyYW1lLiBUaGlzIG9iamVjdCBhbmQgaXRzIGRhdGEgYXJlIHVwZGF0ZWQgYXQgZWFjaCBpbmNvbW1pbmdcbiAgICAgKiBmcmFtZSB3aXRob3V0IHJlYWxsb2NhdGluZyBtZW1vcnkuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBuYW1lIGZyYW1lXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHRpbWUgLSBUaW1lIG9mIHRoZSBjdXJyZW50IGZyYW1lLlxuICAgICAqIEBwcm9wZXJ0eSB7RmxvYXQzMkFycmF5fSBkYXRhIC0gRGF0YSBvZiB0aGUgY3VycmVudCBmcmFtZS5cbiAgICAgKiBAcHJvcGVydHkge09iamVjdH0gbWV0YWRhdGEgLSBNZXRhZGF0YSBhc3NvY2l0ZWQgdG8gdGhlIGN1cnJlbnQgZnJhbWUuXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvXG4gICAgICovXG4gICAgdGhpcy5mcmFtZSA9IHtcbiAgICAgIHRpbWU6IDAsXG4gICAgICBkYXRhOiBudWxsLFxuICAgICAgbWV0YWRhdGE6IHt9LFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIG5vZGVzIGNvbm5lY3RlZCB0byB0aGUgb3VwdXQgb2YgdGhlIG5vZGUgKGxvd2VyIGluIHRoZSBncmFwaCkuXG4gICAgICogQXQgZWFjaCBmcmFtZSwgdGhlIG5vZGUgZm9yd2FyZCBpdHMgYGZyYW1lYCB0byB0byBhbGwgaXRzIGBuZXh0TW9kdWxlc2AuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7QXJyYXk8QmFzZUxmbz59XG4gICAgICogQG5hbWUgbmV4dE1vZHVsZXNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm9cbiAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNjb25uZWN0fVxuICAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Rpc2Nvbm5lY3R9XG4gICAgICovXG4gICAgdGhpcy5uZXh0TW9kdWxlcyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5vZGUgZnJvbSB3aGljaCB0aGUgbm9kZSByZWNlaXZlIHRoZSBmcmFtZXMgKHVwcGVyIGluIHRoZSBncmFwaCkuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7QmFzZUxmb31cbiAgICAgKiBAbmFtZSBwcmV2TW9kdWxlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvXG4gICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jY29ubmVjdH1cbiAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNkaXNjb25uZWN0fVxuICAgICAqL1xuICAgIHRoaXMucHJldk1vZHVsZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBJcyBzZXQgdG8gdHJ1ZSB3aGVuIGEgc3RhdGljIHBhcmFtZXRlciBpcyB1cGRhdGVkLiBPbiB0aGUgbmV4dCBpbnB1dFxuICAgICAqIGZyYW1lIGFsbCB0aGUgc3ViZ3JhcGggc3RyZWFtUGFyYW1zIHN0YXJ0aW5nIGZyb20gdGhpcyBub2RlIHdpbGwgYmVcbiAgICAgKiB1cGRhdGVkLlxuICAgICAqXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG5hbWUgX3JlaW5pdFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fcmVpbml0ID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBvYmplY3QgZGVzY3JpYmluZyBlYWNoIGF2YWlsYWJsZSBwYXJhbWV0ZXIgb2YgdGhlIG5vZGUuXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIGdldFBhcmFtc0Rlc2NyaXB0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy5nZXREZWZpbml0aW9ucygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IGFsbCBwYXJhbWV0ZXJzIHRvIHRoZWlyIGluaXRpYWwgdmFsdWUgKGFzIGRlZmluZWQgb24gaW5zdGFudGljYXRpb24pXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3N0cmVhbVBhcmFtc31cbiAgICovXG4gIHJlc2V0UGFyYW1zKCkge1xuICAgIHRoaXMucGFyYW1zLnJlc2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogRnVuY3Rpb24gY2FsbGVkIHdoZW4gYSBwYXJhbSBpcyB1cGRhdGVkLiBCeSBkZWZhdWx0IHNldCB0aGUgYF9yZWluaXRgXG4gICAqIGZsYWcgdG8gYHRydWVgIGlmIHRoZSBwYXJhbSBpcyBgc3RhdGljYCBvbmUuIFRoaXMgbWV0aG9kIHNob3VsZCBiZVxuICAgKiBleHRlbmRlZCB0byBoYW5kbGUgcGFydGljdWxhciBsb2dpYyBib3VuZCB0byBhIHNwZWNpZmljIHBhcmFtZXRlci5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIC0gVmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG1ldGFzIC0gTWV0YWRhdGEgYXNzb2NpYXRlZCB0byB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMgPSB7fSkge1xuICAgIGlmIChtZXRhcy5raW5kID09PSAnc3RhdGljJylcbiAgICAgIHRoaXMuX3JlaW5pdCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ29ubmVjdCB0aGUgY3VycmVudCBub2RlIChgcHJldk1vZHVsZWApIHRvIGFub3RoZXIgbm9kZSAoYG5leHRPcGApLlxuICAgKiBBIGdpdmVuIG5vZGUgY2FuIGJlIGNvbm5lY3RlZCB0byBzZXZlcmFsIG9wZXJhdG9ycyBhbmQgcHJvcGFnYXRlIGZyYW1lc1xuICAgKiB0byBlYWNoIG9mIHRoZW0uXG4gICAqXG4gICAqIEBwYXJhbSB7QmFzZUxmb30gbmV4dCAtIE5leHQgb3BlcmF0b3IgaW4gdGhlIGdyYXBoLlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzRnJhbWV9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Rpc2Nvbm5lY3R9XG4gICAqL1xuICBjb25uZWN0KG5leHQpIHtcbiAgICBpZiAoIShuZXh0IGluc3RhbmNlb2YgQmFzZUxmbykpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29ubmVjdGlvbjogY2hpbGQgbm9kZSBpcyBub3QgYW4gaW5zdGFuY2Ugb2YgYEJhc2VMZm9gJyk7XG5cbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMgPT09IG51bGwgfHxuZXh0LnN0cmVhbVBhcmFtcyA9PT0gbnVsbClcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb25uZWN0aW9uOiBjYW5ub3QgY29ubmVjdCBhIGRlYWQgbm9kZScpO1xuXG4gICAgaWYgKHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSAhPT0gbnVsbCkgeyAvLyBncmFwaCBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWRcbiAgICAgIC8vIG5leHQucHJvY2Vzc1N0cmVhbVBhcmFtcyh0aGlzLnN0cmVhbVBhcmFtcyk7XG4gICAgICBuZXh0LmluaXRNb2R1bGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgbmV4dC5wcm9jZXNzU3RyZWFtUGFyYW1zKHRoaXMuc3RyZWFtUGFyYW1zKTtcbiAgICAgICAgLy8gd2UgY2FuIGZvcndhcmQgZnJhbWUgZnJvbSBub3dcbiAgICAgICAgdGhpcy5uZXh0TW9kdWxlcy5wdXNoKG5leHQpO1xuICAgICAgICBuZXh0LnByZXZNb2R1bGUgPSB0aGlzO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubmV4dE1vZHVsZXMucHVzaChuZXh0KTtcbiAgICAgIG5leHQucHJldk1vZHVsZSA9IHRoaXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgZ2l2ZW4gb3BlcmF0b3IgZnJvbSBpdHMgcHJldmlvdXMgb3BlcmF0b3JzJyBgbmV4dE1vZHVsZXNgLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jhc2VMZm99IFtuZXh0PW51bGxdIC0gVGhlIG9wZXJhdG9yIHRvIGRpc2Nvbm5lY3QgZnJvbSB0aGUgY3VycmVudFxuICAgKiAgb3BlcmF0b3IuIElmIGBudWxsYCBkaXNjb25uZWN0IGFsbCB0aGUgbmV4dCBvcGVyYXRvcnMuXG4gICAqL1xuICBkaXNjb25uZWN0KG5leHQgPSBudWxsKSB7XG4gICAgaWYgKG5leHQgPT09IG51bGwpIHtcbiAgICAgIHRoaXMubmV4dE1vZHVsZXMuZm9yRWFjaCgobmV4dCkgPT4gdGhpcy5kaXNjb25uZWN0KG5leHQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLm5leHRNb2R1bGVzLmluZGV4T2YodGhpcyk7XG4gICAgICB0aGlzLm5leHRNb2R1bGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICBuZXh0LnByZXZNb2R1bGUgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IGFsbCB0aGUgbm9kZXMgaW4gdGhlIHN1Yi1ncmFwaCBzdGFydGluZyBmcm9tIHRoZSBjdXJyZW50IG5vZGUuXG4gICAqIFdoZW4gZGV0cm95ZWQsIHRoZSBgc3RyZWFtUGFyYW1zYCBvZiB0aGUgbm9kZSBhcmUgc2V0IHRvIGBudWxsYCwgdGhlXG4gICAqIG9wZXJhdG9yIGlzIHRoZW4gY29uc2lkZXJlZCBhcyBgZGVhZGAgYW5kIGNhbm5vdCBiZSByZWNvbm5lY3RlZC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jY29ubmVjdH1cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gZGVzdHJveSBhbGwgY2hpZHJlblxuICAgIGxldCBpbmRleCA9IHRoaXMubmV4dE1vZHVsZXMubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGluZGV4LS0pXG4gICAgICB0aGlzLm5leHRNb2R1bGVzW2luZGV4XS5kZXN0cm95KCk7XG5cbiAgICAvLyBkaXNjb25uZWN0IGl0c2VsZiBmcm9tIHRoZSBwcmV2aW91cyBvcGVyYXRvclxuICAgIGlmICh0aGlzLnByZXZNb2R1bGUpXG4gICAgICB0aGlzLnByZXZNb2R1bGUuZGlzY29ubmVjdCh0aGlzKTtcblxuICAgIC8vIG1hcmsgdGhlIG9iamVjdCBhcyBkZWFkXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIGBQcm9taXNlYCB0aGF0IHJlc29sdmUgd2hlbiB0aGUgbW9kdWxlIGlzIHJlYWR5IHRvIGJlIGNvbnN1bWVkLlxuICAgKiBTb21lIG1vZHVsZXMgcmVsaWVzIG9uIGFzeW5jaHJvbm91cyBBUElzIGF0IGluaXRpYWxpemF0aW9uIGFuZCB0aHVzIGNvdWxkXG4gICAqIGJlIG5vdCByZWFkeSB0byBiZSBjb25zdW1lZCB3aGVuIHRoZSBncmFwaCBzdGFydHMuXG4gICAqIEEgbW9kdWxlIHNob3VsZCBiZSBjb25zaWRlciBhcyBpbml0aWFsaXplZCB3aGVuIGFsbCBuZXh0IG1vZHVsZXMgKGNoaWxkcmVuKVxuICAgKiBhcmUgdGhlbXNlbHZlcyBpbml0aWFsaXplZC4gVGhlIGV2ZW50IGJ1YmJsZXMgdXAgZnJvbSBzaW5rcyB0byBzb3VyY2VzLlxuICAgKiBXaGVuIGFsbCBpdHMgbmV4dCBvcGVyYXRvcnMgYXJlIHJlYWR5LCBhIHNvdXJjZSBjYW4gY29uc2lkZXIgdGhlIHdob2xlIGdyYXBoXG4gICAqIGFzIHJlYWR5IGFuZCB0aGVuIHN0YXJ0IHRvIHByb2R1Y2UgZnJhbWVzLlxuICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiByZXNvbHZlcyB3aGVuIGFsbCBuZXh0IG9wZXJhdG9ycyBhcmUgcmVzb2x2ZWRcbiAgICogdGhlbXNlbHZlcy5cbiAgICogQW4gb3BlcmF0b3IgcmVseWluZyBvbiBleHRlcm5hbCBhc3luYyBBUEkgbXVzdCBvdmVycmlkZSB0aGlzIG1ldGhvZCB0b1xuICAgKiByZXNvbHZlIG9ubHkgd2hlbiBpdHMgZGVwZW5kZWN5IGlzIHJlYWR5LlxuICAgKlxuICAgKiBAcmV0dXJuIFByb21pc2VcbiAgICogQHRvZG8gLSBIYW5kbGUgZHluYW1pYyBjb25uZWN0aW9uc1xuICAgKi9cbiAgaW5pdE1vZHVsZSgpIHtcbiAgICBjb25zdCBuZXh0UHJvbWlzZXMgPSB0aGlzLm5leHRNb2R1bGVzLm1hcCgobW9kdWxlKSA9PiB7XG4gICAgICByZXR1cm4gbW9kdWxlLmluaXRNb2R1bGUoKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBQcm9taXNlLmFsbChuZXh0UHJvbWlzZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciB0byBpbml0aWFsaXplIHRoZSBzdHJlYW0gaW4gc3RhbmRhbG9uZSBtb2RlLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW3N0cmVhbVBhcmFtcz17fV0gLSBQYXJhbWV0ZXJzIG9mIHRoZSBzdHJlYW0uXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Jlc2V0U3RyZWFtfVxuICAgKi9cbiAgaW5pdFN0cmVhbShzdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIHRoaXMucHJvY2Vzc1N0cmVhbVBhcmFtcyhzdHJlYW1QYXJhbXMpO1xuICAgIHRoaXMucmVzZXRTdHJlYW0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgYGZyYW1lLmRhdGFgIGJ1ZmZlciBieSBzZXR0aW5nIGFsbCBpdHMgdmFsdWVzIHRvIDAuXG4gICAqIEEgc291cmNlIG9wZXJhdG9yIHNob3VsZCBjYWxsIGBwcm9jZXNzU3RyZWFtUGFyYW1zYCBhbmQgYHJlc2V0U3RyZWFtYCB3aGVuXG4gICAqIHN0YXJ0ZWQsIGVhY2ggb2YgdGhlc2UgbWV0aG9kIHByb3BhZ2F0ZSB0aHJvdWdoIHRoZSBncmFwaCBhdXRvbWF0aWNhbHkuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqL1xuICByZXNldFN0cmVhbSgpIHtcbiAgICAvLyBidXR0b20gdXBcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubmV4dE1vZHVsZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgdGhpcy5uZXh0TW9kdWxlc1tpXS5yZXNldFN0cmVhbSgpO1xuXG4gICAgLy8gbm8gYnVmZmVyIGZvciBgc2NhbGFyYCB0eXBlIG9yIHNpbmsgbm9kZVxuICAgIC8vIEBub3RlIC0gdGhpcyBzaG91bGQgYmUgcmV2aWV3ZWRcbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlICE9PSAnc2NhbGFyJyAmJiB0aGlzLmZyYW1lLmRhdGEgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspXG4gICAgICAgIGRhdGFbaV0gPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5hbGl6ZSB0aGUgc3RyZWFtLiBBIHNvdXJjZSBub2RlIHNob3VsZCBjYWxsIHRoaXMgbWV0aG9kIHdoZW4gc3RvcHBlZCxcbiAgICogYGZpbmFsaXplU3RyZWFtYCBpcyBhdXRvbWF0aWNhbGx5IHByb3BhZ2F0ZWQgdGhyb3VnaHQgdGhlIGdyYXBoLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gZW5kVGltZSAtIExvZ2ljYWwgdGltZSBhdCB3aGljaCB0aGUgZ3JhcGggaXMgc3RvcHBlZC5cbiAgICovXG4gIGZpbmFsaXplU3RyZWFtKGVuZFRpbWUpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubmV4dE1vZHVsZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgdGhpcy5uZXh0TW9kdWxlc1tpXS5maW5hbGl6ZVN0cmVhbShlbmRUaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIG9yIHVwZGF0ZSB0aGUgb3BlcmF0b3IncyBgc3RyZWFtUGFyYW1zYCBhY2NvcmRpbmcgdG8gdGhlXG4gICAqIHByZXZpb3VzIG9wZXJhdG9ycyBgc3RyZWFtUGFyYW1zYCB2YWx1ZXMuXG4gICAqXG4gICAqIFdoZW4gaW1wbGVtZW50aW5nIGEgbmV3IG9wZXJhdG9yIHRoaXMgbWV0aG9kIHNob3VsZDpcbiAgICogMS4gY2FsbCBgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zYCB3aXRoIHRoZSBnaXZlbiBgcHJldlN0cmVhbVBhcmFtc2BcbiAgICogMi4gb3B0aW9ubmFsbHkgY2hhbmdlIHZhbHVlcyB0byBgdGhpcy5zdHJlYW1QYXJhbXNgIGFjY29yZGluZyB0byB0aGVcbiAgICogICAgbG9naWMgcGVyZm9ybWVkIGJ5IHRoZSBvcGVyYXRvci5cbiAgICogMy4gb3B0aW9ubmFsbHkgYWxsb2NhdGUgbWVtb3J5IGZvciByaW5nIGJ1ZmZlcnMsIGV0Yy5cbiAgICogNC4gY2FsbCBgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXNgIHRvIHRyaWdnZXIgdGhlIG1ldGhvZCBvbiB0aGUgbmV4dFxuICAgKiAgICBvcGVyYXRvcnMgaW4gdGhlIGdyYXBoLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJldlN0cmVhbVBhcmFtcyAtIGBzdHJlYW1QYXJhbXNgIG9mIHRoZSBwcmV2aW91cyBvcGVyYXRvci5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJlcGFyZVN0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvcGFnYXRlU3RyZWFtUGFyYW1zfVxuICAgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zID0ge30pIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21tb24gbG9naWMgdG8gZG8gYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgYHByb2Nlc3NTdHJlYW1QYXJhbWAsIG11c3QgYmVcbiAgICogY2FsbGVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgYW55IGBwcm9jZXNzU3RyZWFtUGFyYW1gIGltcGxlbWVudGF0aW9uLlxuICAgKlxuICAgKiBUaGUgbWV0aG9kIG1haW5seSBjaGVjayBpZiB0aGUgY3VycmVudCBub2RlIGltcGxlbWVudCB0aGUgaW50ZXJmYWNlIHRvXG4gICAqIGhhbmRsZSB0aGUgdHlwZSBvZiBmcmFtZSBwcm9wYWdhdGVkIGJ5IGl0J3MgcGFyZW50OlxuICAgKiAtIHRvIGhhbmRsZSBhIGB2ZWN0b3JgIGZyYW1lIHR5cGUsIHRoZSBjbGFzcyBtdXN0IGltcGxlbWVudCBgcHJvY2Vzc1ZlY3RvcmBcbiAgICogLSB0byBoYW5kbGUgYSBgc2lnbmFsYCBmcmFtZSB0eXBlLCB0aGUgY2xhc3MgbXVzdCBpbXBsZW1lbnQgYHByb2Nlc3NTaWduYWxgXG4gICAqIC0gaW4gY2FzZSBvZiBhICdzY2FsYXInIGZyYW1lIHR5cGUsIHRoZSBjbGFzcyBjYW4gaW1wbGVtZW50IGFueSBvZiB0aGVcbiAgICogZm9sbG93aW5nIGJ5IG9yZGVyIG9mIHByZWZlcmVuY2U6IGBwcm9jZXNzU2NhbGFyYCwgYHByb2Nlc3NWZWN0b3JgLFxuICAgKiBgcHJvY2Vzc1NpZ25hbGAuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcmV2U3RyZWFtUGFyYW1zIC0gYHN0cmVhbVBhcmFtc2Agb2YgdGhlIHByZXZpb3VzIG9wZXJhdG9yLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9wYWdhdGVTdHJlYW1QYXJhbXN9XG4gICAqL1xuICBwcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5zdHJlYW1QYXJhbXMsIHByZXZTdHJlYW1QYXJhbXMpO1xuICAgIGNvbnN0IHByZXZGcmFtZVR5cGUgPSBwcmV2U3RyZWFtUGFyYW1zLmZyYW1lVHlwZTtcblxuICAgIHN3aXRjaCAocHJldkZyYW1lVHlwZSkge1xuICAgICAgY2FzZSAnc2NhbGFyJzpcbiAgICAgICAgaWYgKHRoaXMucHJvY2Vzc1NjYWxhcilcbiAgICAgICAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbiA9IHRoaXMucHJvY2Vzc1NjYWxhcjtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5wcm9jZXNzVmVjdG9yKVxuICAgICAgICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5wcm9jZXNzVmVjdG9yO1xuICAgICAgICBlbHNlIGlmICh0aGlzLnByb2Nlc3NTaWduYWwpXG4gICAgICAgICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLnByb2Nlc3NTaWduYWw7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSAtIG5vIFwicHJvY2Vzc1wiIGZ1bmN0aW9uIGZvdW5kYCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndmVjdG9yJzpcbiAgICAgICAgaWYgKCEoJ3Byb2Nlc3NWZWN0b3InIGluIHRoaXMpKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9IC0gXCJwcm9jZXNzVmVjdG9yXCIgaXMgbm90IGRlZmluZWRgKTtcblxuICAgICAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbiA9IHRoaXMucHJvY2Vzc1ZlY3RvcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzaWduYWwnOlxuICAgICAgICBpZiAoISgncHJvY2Vzc1NpZ25hbCcgaW4gdGhpcykpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMuY29uc3RydWN0b3IubmFtZX0gLSBcInByb2Nlc3NTaWduYWxcIiBpcyBub3QgZGVmaW5lZGApO1xuXG4gICAgICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5wcm9jZXNzU2lnbmFsO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIGRlZmF1bHRzIHRvIHByb2Nlc3NGdW5jdGlvblxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSBgdGhpcy5mcmFtZS5kYXRhYCBidWZmZXIgYW5kIGZvcndhcmQgdGhlIG9wZXJhdG9yJ3MgYHN0cmVhbVBhcmFtYFxuICAgKiB0byBhbGwgaXRzIG5leHQgb3BlcmF0b3JzLCBtdXN0IGJlIGNhbGxlZCBhdCB0aGUgZW5kIG9mIGFueVxuICAgKiBgcHJvY2Vzc1N0cmVhbVBhcmFtc2AgaW1wbGVtZW50YXRpb24uXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3ByZXBhcmVTdHJlYW1QYXJhbXN9XG4gICAqL1xuICBwcm9wYWdhdGVTdHJlYW1QYXJhbXMoKSB7XG4gICAgdGhpcy5mcmFtZS5kYXRhID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm5leHRNb2R1bGVzLmxlbmd0aDsgaSA8IGw7IGkrKylcbiAgICAgIHRoaXMubmV4dE1vZHVsZXNbaV0ucHJvY2Vzc1N0cmVhbVBhcmFtcyh0aGlzLnN0cmVhbVBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIHRoZSBwYXJ0aWN1bGFyIGxvZ2ljIHRoZSBvcGVyYXRvciBhcHBsaWVzIHRvIHRoZSBzdHJlYW0uXG4gICAqIEFjY29yZGluZyB0byB0aGUgZnJhbWUgdHlwZSBvZiB0aGUgcHJldmlvdXMgbm9kZSwgdGhlIG1ldGhvZCBjYWxscyBvbmVcbiAgICogb2YgdGhlIGZvbGxvd2luZyBtZXRob2QgYHByb2Nlc3NWZWN0b3JgLCBgcHJvY2Vzc1NpZ25hbGAgb3IgYHByb2Nlc3NTY2FsYXJgXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmcmFtZSAtIEZyYW1lICh0aW1lLCBkYXRhLCBhbmQgbWV0YWRhdGEpIGFzIGdpdmVuIGJ5IHRoZVxuICAgKiAgcHJldmlvdXMgb3BlcmF0b3IuIFRoZSBpbmNvbW1pbmcgZnJhbWUgc2hvdWxkIG5ldmVyIGJlIG1vZGlmaWVkIGJ5XG4gICAqICB0aGUgb3BlcmF0b3IuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3ByZXBhcmVGcmFtZX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvcGFnYXRlRnJhbWV9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqL1xuICBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgICB0aGlzLnByZXBhcmVGcmFtZSgpO1xuXG4gICAgLy8gZnJhbWVUaW1lIGFuZCBmcmFtZU1ldGFkYXRhIGRlZmF1bHRzIHRvIGlkZW50aXR5XG4gICAgdGhpcy5mcmFtZS50aW1lID0gZnJhbWUudGltZTtcbiAgICB0aGlzLmZyYW1lLm1ldGFkYXRhID0gZnJhbWUubWV0YWRhdGE7XG5cbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG4gICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBvaW50ZXIgdG8gdGhlIG1ldGhvZCBjYWxsZWQgaW4gYHByb2Nlc3NGcmFtZWAgYWNjb3JkaW5nIHRvIHRoZVxuICAgKiBmcmFtZSB0eXBlIG9mIHRoZSBwcmV2aW91cyBvcGVyYXRvci4gSXMgZHluYW1pY2FsbHkgYXNzaWduZWQgaW5cbiAgICogYHByZXBhcmVTdHJlYW1QYXJhbXNgLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcmVwYXJlU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzRnJhbWV9XG4gICAqL1xuICBwcm9jZXNzRnVuY3Rpb24oZnJhbWUpIHtcbiAgICB0aGlzLmZyYW1lID0gZnJhbWU7XG4gIH1cblxuICAvKipcbiAgICogQ29tbW9uIGxvZ2ljIHRvIHBlcmZvcm0gYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgYHByb2Nlc3NGcmFtZWAuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NGcmFtZX1cbiAgICovXG4gIHByZXBhcmVGcmFtZSgpIHtcbiAgICBpZiAodGhpcy5fcmVpbml0ID09PSB0cnVlKSB7XG4gICAgICBjb25zdCBzdHJlYW1QYXJhbXMgPSB0aGlzLnByZXZNb2R1bGUgIT09IG51bGwgPyB0aGlzLnByZXZNb2R1bGUuc3RyZWFtUGFyYW1zIDoge307XG4gICAgICB0aGlzLmluaXRTdHJlYW0oc3RyZWFtUGFyYW1zKTtcbiAgICAgIHRoaXMuX3JlaW5pdCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGb3J3YXJkIHRoZSBjdXJyZW50IGBmcmFtZWAgdG8gdGhlIG5leHQgb3BlcmF0b3JzLCBpcyBjYWxsZWQgYXQgdGhlIGVuZCBvZlxuICAgKiBgcHJvY2Vzc0ZyYW1lYC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc0ZyYW1lfVxuICAgKi9cbiAgcHJvcGFnYXRlRnJhbWUoKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm5leHRNb2R1bGVzLmxlbmd0aDsgaSA8IGw7IGkrKylcbiAgICAgIHRoaXMubmV4dE1vZHVsZXNbaV0ucHJvY2Vzc0ZyYW1lKHRoaXMuZnJhbWUpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJhc2VMZm87XG4iLCJcbi8qKlxuICogSW50ZXJmYWNlIGFkZGVkIHRvIGBMZm9Db3JlIHRvIGltcGxlbWVudCBzb3VyY2VcbiAqXG4gKiBTb3VyY2UgaGF2ZSBzb21lIHJlc3BvbnNhYmlsaXR5IG9uIGdyYXBoIGFzIHRoZXkgbW9zdGx5IGNvbnRyb2wgaXRzIHdob2xlXG4gKiBsaWZlY3ljbGUuIFRoZXkgbXVzdCBpbXBsZW1lbnQgdGhlIHN0YXJ0IGFuZCBzdG9wIG1ldGhvZCBpbiBvcmRlciB0b1xuICogbWFrZSBzdXJlIHRoZSBncmFwaCBpcyBpbml0aWFsaXplZCBhbmQgc2V0IGBzdGFydGVkYCB0byB0cnVlLlxuICogQSBzb3VyY2Ugc2hvdWxkIG5ldmVyIGFjY2VwdCBhbmQgcHJvcGFnYXRlIGluY29tbWluZyBmcmFtZXMgdW50aWwgYHN0YXJ0ZWRgXG4gKiBpcyBzZXQgdG8gYHRydWVgLlxuICpcbiAqIEBleGFtcGxlXG4gKiBjbGFzcyBNeVNvdXJjZSBleHRlbmRzIFNvdXJjZU1peGluKEJhc2VMZm8pIHt9XG4gKi9cbiBjb25zdCBTb3VyY2VNaXhpbiA9IChzdXBlcmNsYXNzKSA9PiBjbGFzcyBleHRlbmRzIHN1cGVyY2xhc3Mge1xuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgc3VwZXIoLi4uYXJncyk7XG5cbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdGhpcy5pbml0UHJvbWlzZSA9IG51bGw7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLnN0YXJ0ID0gdGhpcy5zdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3RvcCA9IHRoaXMuc3RvcC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGdyYXBoIGJ5IGNhbGxpbmcgYGluaXRNb2R1bGVgLiBXaGVuIHRoZSByZXR1cm5lZCBgUHJvbWlzZWBcbiAgICogZnVsZmlsbHMsIHRoZSBncmFwaCBjYW4gYmUgY29uc2lkZXJlZCBhcyBpbml0aWFsaXplZCBhbmQgYHN0YXJ0YCBjYW4gYmVcbiAgICogY2FsbGVkIHNhZmVseS4gSWYgYHN0YXJ0YCBpcyBjYWxsZWQgd2hpdGhvdXQgZXhwbGljaXQgYGluaXRgLCBgaW5pdGAgaXNcbiAgICogbWFkZSBpbnRlcm5hbGx5LCBhY3R1YWwgc3RhcnQgb2YgdGhlIGdyYXBoIGlzIHRoZW4gbm90IGdhcmFudGVlZCB0byBiZVxuICAgKiBzeW5jaHJvbm91cy5cbiAgICpcbiAgICogQHJldHVybiBQcm9taXNlXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIHNhZmUgaW5pdGlhbGl6YXRpb24gYW5kIHN0YXJ0XG4gICAqIHNvdXJjZS5pbml0KCkudGhlbigoKSA9PiBzb3VyY2Uuc3RhcnQoKSlcbiAgICogLy8gc2FmZSBpbml0aWFsaXphdGlvbiBhbmQgc3RhcnRcbiAgICogc291cmNlLnN0YXJ0KCk7XG4gICAqL1xuICBpbml0KCkge1xuICAgIHRoaXMuaW5pdFByb21pc2UgPSB0aGlzLmluaXRNb2R1bGUoKS50aGVuKCgpID0+IHsgLy8gd2hlbiBncmFwaCBpcyBzdGFydGVkXG4gICAgICB0aGlzLmluaXRTdHJlYW0oKTsgLy8gdGhpcyBpcyBzeW5jaHJvbm91c1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMuaW5pdFByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBpbXBsZW1lbnQgdGhhdCBzdGFydHMgdGhlIGdyYXBoLlxuICAgKlxuICAgKiBUaGUgbWV0aG9kIG1haW4gcHVycG9zZSBpcyB0byBtYWtlIHN1cmUgdGFrZSB2ZXJpZnkgaW5pdGlhbGl6YXRpb24gc3RlcCBhbmRcbiAgICogc2V0IGBzdGFydGVkYCB0byBgdHJ1ZWAgd2hlbiBkb25lLlxuICAgKiBTaG91bGQgYmVoYXZlIHN5bmNocm9ub3VzbHkgd2hlbiBjYWxsZWQgaW5zaWRlIGBpbml0KCkudGhlbigpYCBhbmQgYXN5bmNcbiAgICogaWYgY2FsbGVkIHdpdGhvdXQgaW5pdCBzdGVwLlxuICAgKlxuICAgKiBAYWJzdHJhY3RcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gYmFzaWMgYHN0YXJ0YCBpbXBsZW1lbnRhdGlvblxuICAgKiBzdGFydCgpIHtcbiAgICogICBpZiAodGhpcy5pbml0aWFsaXplZCA9PT0gZmFsc2UpIHtcbiAgICogICAgIGlmICh0aGlzLmluaXRQcm9taXNlID09PSBudWxsKSAvLyBpbml0IGhhcyBub3QgeWV0IGJlZW4gY2FsbGVkXG4gICAqICAgICAgIHRoaXMuaW5pdFByb21pc2UgPSB0aGlzLmluaXQoKTtcbiAgICpcbiAgICogICAgIHRoaXMuaW5pdFByb21pc2UudGhlbih0aGlzLnN0YXJ0KTtcbiAgICogICAgIHJldHVybjtcbiAgICogICB9XG4gICAqXG4gICAqICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICogfVxuICAgKi9cbiAgc3RhcnQoKSB7fVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIGltcGxlbWVudCB0aGF0IHN0b3BzIHRoZSBncmFwaC5cbiAgICpcbiAgICogQGFic3RyYWN0XG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIGJhc2ljIGBzdG9wYCBpbXBsZW1lbnRhdGlvblxuICAgKiBzdG9wKCkge1xuICAgKiAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuICAgKiB9XG4gICAqL1xuICBzdG9wKCkge31cblxuICAvKipcbiAgICogVGhlIGltcGxlbWVudGF0aW9uIHNob3VsZCBuZXZlciBhbGxvdyBpbmNvbW1pbmcgZnJhbWVzXG4gICAqIGlmIGB0aGlzLnN0YXJ0ZWRgIGlzIG5vdCBgdHJ1ZWAuXG4gICAqXG4gICAqIEBhYnN0cmFjdFxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZnJhbWVcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gYmFzaWMgYHByb2Nlc3NGcmFtZWAgaW1wbGVtZW50YXRpb25cbiAgICogcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAqICAgaWYgKHRoaXMuc3RhcnRlZCA9PT0gdHJ1ZSkge1xuICAgKiAgICAgdGhpcy5wcmVwYXJlRnJhbWUoKTtcbiAgICogICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uKGZyYW1lKTtcbiAgICogICAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcbiAgICogICB9XG4gICAqIH1cbiAgICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge31cbn1cblxuZXhwb3J0IGRlZmF1bHQgU291cmNlTWl4aW47XG4iLCJleHBvcnQgY29uc3QgdmVyc2lvbiA9ICcldmVyc2lvbiUnO1xuXG5leHBvcnQgeyBkZWZhdWx0IGFzIEJhc2VMZm8gfSBmcm9tICcuL0Jhc2VMZm8nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTb3VyY2VNaXhpbiB9IGZyb20gJy4vU291cmNlTWl4aW4nO1xuIiwiaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuXG5jb25zdCBBdWRpb0NvbnRleHQgPSAod2luZG93LkF1ZGlvQ29udGV4dCB8fMKgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCk7XG5jb25zdCBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG5cbmNvbnN0IGZyYW1lU2l6ZSA9IE1hdGguZmxvb3IoMC4wMjAgKiBhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSk7XG5jb25zdCBob3BTaXplID0gTWF0aC5mbG9vcigwLjAwNSAqIGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlKTtcblxubmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICAuZ2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSlcbiAgLnRoZW4oaW5pdClcbiAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKSk7XG5cbmZ1bmN0aW9uIGluaXQoc3RyZWFtKSB7XG4gIGNvbnN0IHNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVNZWRpYVN0cmVhbVNvdXJjZShzdHJlYW0pO1xuXG4gIGNvbnN0IGF1ZGlvSW5Ob2RlID0gbmV3IGxmby5zb3VyY2UuQXVkaW9Jbk5vZGUoe1xuICAgIHNvdXJjZU5vZGU6IHNvdXJjZSxcbiAgICBhdWRpb0NvbnRleHQ6IGF1ZGlvQ29udGV4dCxcbiAgfSk7XG5cbiAgY29uc3Qgc2xpY2VyID0gbmV3IGxmby5vcGVyYXRvci5TbGljZXIoe1xuICAgIGZyYW1lU2l6ZTogZnJhbWVTaXplLFxuICAgIGhvcFNpemU6IGhvcFNpemUsXG4gICAgY2VudGVyZWRUaW1lVGFnczogdHJ1ZVxuICB9KTtcblxuICBjb25zdCBwb3dlciA9IG5ldyBsZm8ub3BlcmF0b3IuUm1zKHtcbiAgICBwb3dlcjogdHJ1ZSxcbiAgfSk7XG5cbiAgY29uc3Qgc2VnbWVudGVyID0gbmV3IGxmby5vcGVyYXRvci5TZWdtZW50ZXIoe1xuICAgIGxvZ0lucHV0OiB0cnVlLFxuICAgIGZpbHRlck9yZGVyOiA1LFxuICAgIHRocmVzaG9sZDogNCxcbiAgICBvZmZUaHJlc2hvbGQ6IC1JbmZpbml0eSxcbiAgICBtaW5JbnRlcjogMC4xMDAsXG4gICAgbWF4RHVyYXRpb246IDAuMDIwLFxuICB9KTtcblxuICBjb25zdCB3YXZlZm9ybURpc3BsYXkgPSBuZXcgbGZvLnNpbmsuV2F2ZWZvcm1EaXNwbGF5KHtcbiAgICBjYW52YXM6ICcjd2F2ZWZvcm0nLFxuICB9KTtcblxuICBjb25zdCBtYXJrZXJEaXNwbGF5ID0gbmV3IGxmby5zaW5rLk1hcmtlckRpc3BsYXkoe1xuICAgIGNhbnZhczogJyNtYXJrZXJzJyxcbiAgfSk7XG5cbiAgbmV3IGxmby51dGlscy5EaXNwbGF5U3luYyh3YXZlZm9ybURpc3BsYXksIG1hcmtlckRpc3BsYXkpO1xuXG4gIGF1ZGlvSW5Ob2RlLmNvbm5lY3Qoc2xpY2VyKTtcbiAgYXVkaW9Jbk5vZGUuY29ubmVjdCh3YXZlZm9ybURpc3BsYXkpO1xuICBzbGljZXIuY29ubmVjdChwb3dlcik7XG4gIHBvd2VyLmNvbm5lY3Qoc2VnbWVudGVyKTtcbiAgc2VnbWVudGVyLmNvbm5lY3QobWFya2VyRGlzcGxheSk7XG5cbiAgYXVkaW9Jbk5vZGUuc3RhcnQoKTtcbn1cbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vanNvbi9zdHJpbmdpZnlcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vbWF0aC9sb2cxMFwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9udW1iZXIvaXMtZmluaXRlXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9hc3NpZ25cIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2NyZWF0ZVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZGVmaW5lLXByb3BlcnR5XCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2dldC1wcm90b3R5cGUtb2ZcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L3NldC1wcm90b3R5cGUtb2ZcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vcHJvbWlzZVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9zeW1ib2xcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vc3ltYm9sL2l0ZXJhdG9yXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2RlZmluZVByb3BlcnR5ID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L2RlZmluZS1wcm9wZXJ0eVwiKTtcblxudmFyIF9kZWZpbmVQcm9wZXJ0eTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZWZpbmVQcm9wZXJ0eSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICAoMCwgX2RlZmluZVByb3BlcnR5Mi5kZWZhdWx0KSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSgpOyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2RlZmluZVByb3BlcnR5ID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L2RlZmluZS1wcm9wZXJ0eVwiKTtcblxudmFyIF9kZWZpbmVQcm9wZXJ0eTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZWZpbmVQcm9wZXJ0eSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICAoMCwgX2RlZmluZVByb3BlcnR5Mi5kZWZhdWx0KShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2dldFByb3RvdHlwZU9mID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2ZcIik7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ2V0UHJvdG90eXBlT2YpO1xuXG52YXIgX2dldE93blByb3BlcnR5RGVzY3JpcHRvciA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JcIik7XG5cbnZhciBfZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldE93blByb3BlcnR5RGVzY3JpcHRvcik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIGdldChvYmplY3QsIHByb3BlcnR5LCByZWNlaXZlcikge1xuICBpZiAob2JqZWN0ID09PSBudWxsKSBvYmplY3QgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG4gIHZhciBkZXNjID0gKDAsIF9nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IyLmRlZmF1bHQpKG9iamVjdCwgcHJvcGVydHkpO1xuXG4gIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgcGFyZW50ID0gKDAsIF9nZXRQcm90b3R5cGVPZjIuZGVmYXVsdCkob2JqZWN0KTtcblxuICAgIGlmIChwYXJlbnQgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBnZXQocGFyZW50LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChcInZhbHVlXCIgaW4gZGVzYykge1xuICAgIHJldHVybiBkZXNjLnZhbHVlO1xuICB9IGVsc2Uge1xuICAgIHZhciBnZXR0ZXIgPSBkZXNjLmdldDtcblxuICAgIGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3NldFByb3RvdHlwZU9mID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L3NldC1wcm90b3R5cGUtb2ZcIik7XG5cbnZhciBfc2V0UHJvdG90eXBlT2YyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2V0UHJvdG90eXBlT2YpO1xuXG52YXIgX2NyZWF0ZSA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL29iamVjdC9jcmVhdGVcIik7XG5cbnZhciBfY3JlYXRlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZSk7XG5cbnZhciBfdHlwZW9mMiA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL3R5cGVvZlwiKTtcblxudmFyIF90eXBlb2YzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdHlwZW9mMik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyAodHlwZW9mIHN1cGVyQ2xhc3MgPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogKDAsIF90eXBlb2YzLmRlZmF1bHQpKHN1cGVyQ2xhc3MpKSk7XG4gIH1cblxuICBzdWJDbGFzcy5wcm90b3R5cGUgPSAoMCwgX2NyZWF0ZTIuZGVmYXVsdCkoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZjIuZGVmYXVsdCA/ICgwLCBfc2V0UHJvdG90eXBlT2YyLmRlZmF1bHQpKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3R5cGVvZjIgPSByZXF1aXJlKFwiLi4vaGVscGVycy90eXBlb2ZcIik7XG5cbnZhciBfdHlwZW9mMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3R5cGVvZjIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoc2VsZiwgY2FsbCkge1xuICBpZiAoIXNlbGYpIHtcbiAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gIH1cblxuICByZXR1cm4gY2FsbCAmJiAoKHR5cGVvZiBjYWxsID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6ICgwLCBfdHlwZW9mMy5kZWZhdWx0KShjYWxsKSkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfaXRlcmF0b3IgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9zeW1ib2wvaXRlcmF0b3JcIik7XG5cbnZhciBfaXRlcmF0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXRlcmF0b3IpO1xuXG52YXIgX3N5bWJvbCA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL3N5bWJvbFwiKTtcblxudmFyIF9zeW1ib2wyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3ltYm9sKTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgX3N5bWJvbDIuZGVmYXVsdCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBfaXRlcmF0b3IyLmRlZmF1bHQgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBfc3ltYm9sMi5kZWZhdWx0ID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBfc3ltYm9sMi5kZWZhdWx0ICYmIG9iaiAhPT0gX3N5bWJvbDIuZGVmYXVsdC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gdHlwZW9mIF9zeW1ib2wyLmRlZmF1bHQgPT09IFwiZnVuY3Rpb25cIiAmJiBfdHlwZW9mKF9pdGVyYXRvcjIuZGVmYXVsdCkgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2Yob2JqKTtcbn0gOiBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogJiYgdHlwZW9mIF9zeW1ib2wyLmRlZmF1bHQgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IF9zeW1ib2wyLmRlZmF1bHQgJiYgb2JqICE9PSBfc3ltYm9sMi5kZWZhdWx0LnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2Yob2JqKTtcbn07IiwidmFyIGNvcmUgID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpXG4gICwgJEpTT04gPSBjb3JlLkpTT04gfHwgKGNvcmUuSlNPTiA9IHtzdHJpbmdpZnk6IEpTT04uc3RyaW5naWZ5fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCl7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgcmV0dXJuICRKU09OLnN0cmluZ2lmeS5hcHBseSgkSlNPTiwgYXJndW1lbnRzKTtcbn07IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYubWF0aC5sb2cxMCcpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuTWF0aC5sb2cxMDsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5udW1iZXIuaXMtZmluaXRlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5OdW1iZXIuaXNGaW5pdGU7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LmFzc2lnbjsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuY3JlYXRlJyk7XG52YXIgJE9iamVjdCA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3Q7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZShQLCBEKXtcbiAgcmV0dXJuICRPYmplY3QuY3JlYXRlKFAsIEQpO1xufTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuZGVmaW5lLXByb3BlcnR5Jyk7XG52YXIgJE9iamVjdCA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3Q7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIGRlc2Mpe1xuICByZXR1cm4gJE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBkZXNjKTtcbn07IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcicpO1xudmFyICRPYmplY3QgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gIHJldHVybiAkT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KTtcbn07IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmdldC1wcm90b3R5cGUtb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdC5nZXRQcm90b3R5cGVPZjsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LnNldFByb3RvdHlwZU9mOyIsInJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5wcm9taXNlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvX2NvcmUnKS5Qcm9taXNlOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN5bWJvbCcpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczcuc3ltYm9sLmFzeW5jLWl0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNy5zeW1ib2wub2JzZXJ2YWJsZScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuU3ltYm9sOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX3drcy1leHQnKS5mKCdpdGVyYXRvcicpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZih0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSwgZm9yYmlkZGVuRmllbGQpe1xuICBpZighKGl0IGluc3RhbmNlb2YgQ29uc3RydWN0b3IpIHx8IChmb3JiaWRkZW5GaWVsZCAhPT0gdW5kZWZpbmVkICYmIGZvcmJpZGRlbkZpZWxkIGluIGl0KSl7XG4gICAgdGhyb3cgVHlwZUVycm9yKG5hbWUgKyAnOiBpbmNvcnJlY3QgaW52b2NhdGlvbiEnKTtcbiAgfSByZXR1cm4gaXQ7XG59OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKCFpc09iamVjdChpdCkpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9MZW5ndGggID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCB0b0luZGV4ICAgPSByZXF1aXJlKCcuL190by1pbmRleCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihJU19JTkNMVURFUyl7XG4gIHJldHVybiBmdW5jdGlvbigkdGhpcywgZWwsIGZyb21JbmRleCl7XG4gICAgdmFyIE8gICAgICA9IHRvSU9iamVjdCgkdGhpcylcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXG4gICAgICAsIGluZGV4ICA9IHRvSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpXG4gICAgICAsIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICBpZihJU19JTkNMVURFUyAmJiBlbCAhPSBlbCl3aGlsZShsZW5ndGggPiBpbmRleCl7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICBpZih2YWx1ZSAhPSB2YWx1ZSlyZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSN0b0luZGV4IGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTyl7XG4gICAgICBpZihPW2luZGV4XSA9PT0gZWwpcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTsiLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpXG4gICwgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJylcbiAgLy8gRVMzIHdyb25nIGhlcmVcbiAgLCBBUkcgPSBjb2YoZnVuY3Rpb24oKXsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IHRyeUdldChPID0gT2JqZWN0KGl0KSwgVEFHKSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59OyIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07IiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHt2ZXJzaW9uOiAnMi40LjAnfTtcbmlmKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmKHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XG4gIHN3aXRjaChsZW5ndGgpe1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07IiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcbn0pOyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudFxuICAvLyBpbiBvbGQgSUUgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCdcbiAgLCBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTsiLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTsiLCIvLyBhbGwgZW51bWVyYWJsZSBvYmplY3Qga2V5cywgaW5jbHVkZXMgc3ltYm9sc1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpXG4gICwgZ09QUyAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJylcbiAgLCBwSUUgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHZhciByZXN1bHQgICAgID0gZ2V0S2V5cyhpdClcbiAgICAsIGdldFN5bWJvbHMgPSBnT1BTLmY7XG4gIGlmKGdldFN5bWJvbHMpe1xuICAgIHZhciBzeW1ib2xzID0gZ2V0U3ltYm9scyhpdClcbiAgICAgICwgaXNFbnVtICA9IHBJRS5mXG4gICAgICAsIGkgICAgICAgPSAwXG4gICAgICAsIGtleTtcbiAgICB3aGlsZShzeW1ib2xzLmxlbmd0aCA+IGkpaWYoaXNFbnVtLmNhbGwoaXQsIGtleSA9IHN5bWJvbHNbaSsrXSkpcmVzdWx0LnB1c2goa2V5KTtcbiAgfSByZXR1cm4gcmVzdWx0O1xufTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgPSByZXF1aXJlKCcuL19jb3JlJylcbiAgLCBjdHggICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGhpZGUgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GXG4gICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG4gICAgLCBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TXG4gICAgLCBJU19QUk9UTyAgPSB0eXBlICYgJGV4cG9ydC5QXG4gICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG4gICAgLCBJU19XUkFQICAgPSB0eXBlICYgJGV4cG9ydC5XXG4gICAgLCBleHBvcnRzICAgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KVxuICAgICwgZXhwUHJvdG8gID0gZXhwb3J0c1tQUk9UT1RZUEVdXG4gICAgLCB0YXJnZXQgICAgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdXG4gICAgLCBrZXksIG93biwgb3V0O1xuICBpZihJU19HTE9CQUwpc291cmNlID0gbmFtZTtcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgaWYob3duICYmIGtleSBpbiBleHBvcnRzKWNvbnRpbnVlO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gb3duID8gdGFyZ2V0W2tleV0gOiBzb3VyY2Vba2V5XTtcbiAgICAvLyBwcmV2ZW50IGdsb2JhbCBwb2xsdXRpb24gZm9yIG5hbWVzcGFjZXNcbiAgICBleHBvcnRzW2tleV0gPSBJU19HTE9CQUwgJiYgdHlwZW9mIHRhcmdldFtrZXldICE9ICdmdW5jdGlvbicgPyBzb3VyY2Vba2V5XVxuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgOiBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbClcbiAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxuICAgIDogSVNfV1JBUCAmJiB0YXJnZXRba2V5XSA9PSBvdXQgPyAoZnVuY3Rpb24oQyl7XG4gICAgICB2YXIgRiA9IGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgICBpZih0aGlzIGluc3RhbmNlb2YgQyl7XG4gICAgICAgICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpe1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IEM7XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBuZXcgQyhhKTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBDKGEsIGIpO1xuICAgICAgICAgIH0gcmV0dXJuIG5ldyBDKGEsIGIsIGMpO1xuICAgICAgICB9IHJldHVybiBDLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgRltQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgICAgcmV0dXJuIEY7XG4gICAgLy8gbWFrZSBzdGF0aWMgdmVyc2lvbnMgZm9yIHByb3RvdHlwZSBtZXRob2RzXG4gICAgfSkob3V0KSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5tZXRob2RzLiVOQU1FJVxuICAgIGlmKElTX1BST1RPKXtcbiAgICAgIChleHBvcnRzLnZpcnR1YWwgfHwgKGV4cG9ydHMudmlydHVhbCA9IHt9KSlba2V5XSA9IG91dDtcbiAgICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5wcm90b3R5cGUuJU5BTUUlXG4gICAgICBpZih0eXBlICYgJGV4cG9ydC5SICYmIGV4cFByb3RvICYmICFleHBQcm90b1trZXldKWhpZGUoZXhwUHJvdG8sIGtleSwgb3V0KTtcbiAgICB9XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgIFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59OyIsInZhciBjdHggICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgY2FsbCAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKVxuICAsIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpXG4gICwgYW5PYmplY3QgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIHRvTGVuZ3RoICAgID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCBnZXRJdGVyRm4gICA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJylcbiAgLCBCUkVBSyAgICAgICA9IHt9XG4gICwgUkVUVVJOICAgICAgPSB7fTtcbnZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQsIElURVJBVE9SKXtcbiAgdmFyIGl0ZXJGbiA9IElURVJBVE9SID8gZnVuY3Rpb24oKXsgcmV0dXJuIGl0ZXJhYmxlOyB9IDogZ2V0SXRlckZuKGl0ZXJhYmxlKVxuICAgICwgZiAgICAgID0gY3R4KGZuLCB0aGF0LCBlbnRyaWVzID8gMiA6IDEpXG4gICAgLCBpbmRleCAgPSAwXG4gICAgLCBsZW5ndGgsIHN0ZXAsIGl0ZXJhdG9yLCByZXN1bHQ7XG4gIGlmKHR5cGVvZiBpdGVyRm4gIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXRlcmFibGUgKyAnIGlzIG5vdCBpdGVyYWJsZSEnKTtcbiAgLy8gZmFzdCBjYXNlIGZvciBhcnJheXMgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yXG4gIGlmKGlzQXJyYXlJdGVyKGl0ZXJGbikpZm9yKGxlbmd0aCA9IHRvTGVuZ3RoKGl0ZXJhYmxlLmxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKXtcbiAgICByZXN1bHQgPSBlbnRyaWVzID8gZihhbk9iamVjdChzdGVwID0gaXRlcmFibGVbaW5kZXhdKVswXSwgc3RlcFsxXSkgOiBmKGl0ZXJhYmxlW2luZGV4XSk7XG4gICAgaWYocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTilyZXR1cm4gcmVzdWx0O1xuICB9IGVsc2UgZm9yKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoaXRlcmFibGUpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7ICl7XG4gICAgcmVzdWx0ID0gY2FsbChpdGVyYXRvciwgZiwgc3RlcC52YWx1ZSwgZW50cmllcyk7XG4gICAgaWYocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTilyZXR1cm4gcmVzdWx0O1xuICB9XG59O1xuZXhwb3J0cy5CUkVBSyAgPSBCUkVBSztcbmV4cG9ydHMuUkVUVVJOID0gUkVUVVJOOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYodHlwZW9mIF9fZyA9PSAnbnVtYmVyJylfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIGtleSl7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTsiLCJ2YXIgZFAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIHJldHVybiBkUC5mKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7IiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnZGl2JyksICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCIvLyBmYXN0IGFwcGx5LCBodHRwOi8vanNwZXJmLmxua2l0LmNvbS9mYXN0LWFwcGx5LzVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIGFyZ3MsIHRoYXQpe1xuICB2YXIgdW4gPSB0aGF0ID09PSB1bmRlZmluZWQ7XG4gIHN3aXRjaChhcmdzLmxlbmd0aCl7XG4gICAgY2FzZSAwOiByZXR1cm4gdW4gPyBmbigpXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQpO1xuICAgIGNhc2UgMTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgIGNhc2UgNDogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSk7XG4gIH0gcmV0dXJuICAgICAgICAgICAgICBmbi5hcHBseSh0aGF0LCBhcmdzKTtcbn07IiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07IiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIElURVJBVE9SICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTsiLCIvLyA3LjIuMiBJc0FycmF5KGFyZ3VtZW50KVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXkoYXJnKXtcbiAgcmV0dXJuIGNvZihhcmcpID09ICdBcnJheSc7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTsiLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaChlKXtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmKHJldCAhPT0gdW5kZWZpbmVkKWFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgLCBkZXNjcmlwdG9yICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpe1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHtuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSAgICAgICAgPSByZXF1aXJlKCcuL19saWJyYXJ5JylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgcmVkZWZpbmUgICAgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZScpXG4gICwgaGlkZSAgICAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgSXRlcmF0b3JzICAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsICRpdGVyQ3JlYXRlICAgID0gcmVxdWlyZSgnLi9faXRlci1jcmVhdGUnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpXG4gICwgSVRFUkFUT1IgICAgICAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEJVR0dZICAgICAgICAgID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpIC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbiAgLCBGRl9JVEVSQVRPUiAgICA9ICdAQGl0ZXJhdG9yJ1xuICAsIEtFWVMgICAgICAgICAgID0gJ2tleXMnXG4gICwgVkFMVUVTICAgICAgICAgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpe1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbihraW5kKXtcbiAgICBpZighQlVHR1kgJiYga2luZCBpbiBwcm90bylyZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoKGtpbmQpe1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgICAgICAgID0gTkFNRSArICcgSXRlcmF0b3InXG4gICAgLCBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVNcbiAgICAsIFZBTFVFU19CVUcgPSBmYWxzZVxuICAgICwgcHJvdG8gICAgICA9IEJhc2UucHJvdG90eXBlXG4gICAgLCAkbmF0aXZlICAgID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdXG4gICAgLCAkZGVmYXVsdCAgID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVClcbiAgICAsICRlbnRyaWVzICAgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkXG4gICAgLCAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZVxuICAgICwgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZigkYW55TmF0aXZlKXtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSkpO1xuICAgIGlmKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlKXtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZighTElCUkFSWSAmJiAhaGFzKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUikpaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUyl7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpe1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gID0gcmV0dXJuVGhpcztcbiAgaWYoREVGQVVMVCl7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogIERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogICAgSVNfU0VUICAgICA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmKEZPUkNFRClmb3Ioa2V5IGluIG1ldGhvZHMpe1xuICAgICAgaWYoIShrZXkgaW4gcHJvdG8pKXJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07IiwidmFyIElURVJBVE9SICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtJVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24oKXsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24oKXsgdGhyb3cgMjsgfSk7XG59IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYywgc2tpcENsb3Npbmcpe1xuICBpZighc2tpcENsb3NpbmcgJiYgIVNBRkVfQ0xPU0lORylyZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciAgPSBbN11cbiAgICAgICwgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbigpeyByZXR1cm4ge2RvbmU6IHNhZmUgPSB0cnVlfTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24oKXsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRvbmUsIHZhbHVlKXtcbiAgcmV0dXJuIHt2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZX07XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge307IiwidmFyIGdldEtleXMgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgZWwpe1xuICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KG9iamVjdClcbiAgICAsIGtleXMgICA9IGdldEtleXMoTylcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgLCBpbmRleCAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKGxlbmd0aCA+IGluZGV4KWlmKE9ba2V5ID0ga2V5c1tpbmRleCsrXV0gPT09IGVsKXJldHVybiBrZXk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gdHJ1ZTsiLCJ2YXIgTUVUQSAgICAgPSByZXF1aXJlKCcuL191aWQnKSgnbWV0YScpXG4gICwgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGhhcyAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBzZXREZXNjICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBpZCAgICAgICA9IDA7XG52YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBmdW5jdGlvbigpe1xuICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgRlJFRVpFID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIGlzRXh0ZW5zaWJsZShPYmplY3QucHJldmVudEV4dGVuc2lvbnMoe30pKTtcbn0pO1xudmFyIHNldE1ldGEgPSBmdW5jdGlvbihpdCl7XG4gIHNldERlc2MoaXQsIE1FVEEsIHt2YWx1ZToge1xuICAgIGk6ICdPJyArICsraWQsIC8vIG9iamVjdCBJRFxuICAgIHc6IHt9ICAgICAgICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH19KTtcbn07XG52YXIgZmFzdEtleSA9IGZ1bmN0aW9uKGl0LCBjcmVhdGUpe1xuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJyA/IGl0IDogKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcbiAgaWYoIWhhcyhpdCwgTUVUQSkpe1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmKCFjcmVhdGUpcmV0dXJuICdFJztcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gb2JqZWN0IElEXG4gIH0gcmV0dXJuIGl0W01FVEFdLmk7XG59O1xudmFyIGdldFdlYWsgPSBmdW5jdGlvbihpdCwgY3JlYXRlKXtcbiAgaWYoIWhhcyhpdCwgTUVUQSkpe1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuIHRydWU7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZighY3JlYXRlKXJldHVybiBmYWxzZTtcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gaGFzaCB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IHJldHVybiBpdFtNRVRBXS53O1xufTtcbi8vIGFkZCBtZXRhZGF0YSBvbiBmcmVlemUtZmFtaWx5IG1ldGhvZHMgY2FsbGluZ1xudmFyIG9uRnJlZXplID0gZnVuY3Rpb24oaXQpe1xuICBpZihGUkVFWkUgJiYgbWV0YS5ORUVEICYmIGlzRXh0ZW5zaWJsZShpdCkgJiYgIWhhcyhpdCwgTUVUQSkpc2V0TWV0YShpdCk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgbWV0YSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBLRVk6ICAgICAgTUVUQSxcbiAgTkVFRDogICAgIGZhbHNlLFxuICBmYXN0S2V5OiAgZmFzdEtleSxcbiAgZ2V0V2VhazogIGdldFdlYWssXG4gIG9uRnJlZXplOiBvbkZyZWV6ZVxufTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBtYWNyb3Rhc2sgPSByZXF1aXJlKCcuL190YXNrJykuc2V0XG4gICwgT2JzZXJ2ZXIgID0gZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXJcbiAgLCBwcm9jZXNzICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIFByb21pc2UgICA9IGdsb2JhbC5Qcm9taXNlXG4gICwgaXNOb2RlICAgID0gcmVxdWlyZSgnLi9fY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XG4gIHZhciBoZWFkLCBsYXN0LCBub3RpZnk7XG5cbiAgdmFyIGZsdXNoID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgcGFyZW50LCBmbjtcbiAgICBpZihpc05vZGUgJiYgKHBhcmVudCA9IHByb2Nlc3MuZG9tYWluKSlwYXJlbnQuZXhpdCgpO1xuICAgIHdoaWxlKGhlYWQpe1xuICAgICAgZm4gICA9IGhlYWQuZm47XG4gICAgICBoZWFkID0gaGVhZC5uZXh0O1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm4oKTtcbiAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIGlmKGhlYWQpbm90aWZ5KCk7XG4gICAgICAgIGVsc2UgbGFzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9IGxhc3QgPSB1bmRlZmluZWQ7XG4gICAgaWYocGFyZW50KXBhcmVudC5lbnRlcigpO1xuICB9O1xuXG4gIC8vIE5vZGUuanNcbiAgaWYoaXNOb2RlKXtcbiAgICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gICAgfTtcbiAgLy8gYnJvd3NlcnMgd2l0aCBNdXRhdGlvbk9ic2VydmVyXG4gIH0gZWxzZSBpZihPYnNlcnZlcil7XG4gICAgdmFyIHRvZ2dsZSA9IHRydWVcbiAgICAgICwgbm9kZSAgID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICAgIG5ldyBPYnNlcnZlcihmbHVzaCkub2JzZXJ2ZShub2RlLCB7Y2hhcmFjdGVyRGF0YTogdHJ1ZX0pOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgICBub2RlLmRhdGEgPSB0b2dnbGUgPSAhdG9nZ2xlO1xuICAgIH07XG4gIC8vIGVudmlyb25tZW50cyB3aXRoIG1heWJlIG5vbi1jb21wbGV0ZWx5IGNvcnJlY3QsIGJ1dCBleGlzdGVudCBQcm9taXNlXG4gIH0gZWxzZSBpZihQcm9taXNlICYmIFByb21pc2UucmVzb2x2ZSl7XG4gICAgdmFyIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgICAgcHJvbWlzZS50aGVuKGZsdXNoKTtcbiAgICB9O1xuICAvLyBmb3Igb3RoZXIgZW52aXJvbm1lbnRzIC0gbWFjcm90YXNrIGJhc2VkIG9uOlxuICAvLyAtIHNldEltbWVkaWF0ZVxuICAvLyAtIE1lc3NhZ2VDaGFubmVsXG4gIC8vIC0gd2luZG93LnBvc3RNZXNzYWdcbiAgLy8gLSBvbnJlYWR5c3RhdGVjaGFuZ2VcbiAgLy8gLSBzZXRUaW1lb3V0XG4gIH0gZWxzZSB7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAgIC8vIHN0cmFuZ2UgSUUgKyB3ZWJwYWNrIGRldiBzZXJ2ZXIgYnVnIC0gdXNlIC5jYWxsKGdsb2JhbClcbiAgICAgIG1hY3JvdGFzay5jYWxsKGdsb2JhbCwgZmx1c2gpO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24oZm4pe1xuICAgIHZhciB0YXNrID0ge2ZuOiBmbiwgbmV4dDogdW5kZWZpbmVkfTtcbiAgICBpZihsYXN0KWxhc3QubmV4dCA9IHRhc2s7XG4gICAgaWYoIWhlYWQpe1xuICAgICAgaGVhZCA9IHRhc2s7XG4gICAgICBub3RpZnkoKTtcbiAgICB9IGxhc3QgPSB0YXNrO1xuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG52YXIgZ2V0S2V5cyAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpXG4gICwgZ09QUyAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpXG4gICwgcElFICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJylcbiAgLCB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgSU9iamVjdCAgPSByZXF1aXJlKCcuL19pb2JqZWN0JylcbiAgLCAkYXNzaWduICA9IE9iamVjdC5hc3NpZ247XG5cbi8vIHNob3VsZCB3b3JrIHdpdGggc3ltYm9scyBhbmQgc2hvdWxkIGhhdmUgZGV0ZXJtaW5pc3RpYyBwcm9wZXJ0eSBvcmRlciAoVjggYnVnKVxubW9kdWxlLmV4cG9ydHMgPSAhJGFzc2lnbiB8fCByZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHZhciBBID0ge31cbiAgICAsIEIgPSB7fVxuICAgICwgUyA9IFN5bWJvbCgpXG4gICAgLCBLID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0JztcbiAgQVtTXSA9IDc7XG4gIEsuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24oayl7IEJba10gPSBrOyB9KTtcbiAgcmV0dXJuICRhc3NpZ24oe30sIEEpW1NdICE9IDcgfHwgT2JqZWN0LmtleXMoJGFzc2lnbih7fSwgQikpLmpvaW4oJycpICE9IEs7XG59KSA/IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSl7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgdmFyIFQgICAgID0gdG9PYmplY3QodGFyZ2V0KVxuICAgICwgYUxlbiAgPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBpbmRleCA9IDFcbiAgICAsIGdldFN5bWJvbHMgPSBnT1BTLmZcbiAgICAsIGlzRW51bSAgICAgPSBwSUUuZjtcbiAgd2hpbGUoYUxlbiA+IGluZGV4KXtcbiAgICB2YXIgUyAgICAgID0gSU9iamVjdChhcmd1bWVudHNbaW5kZXgrK10pXG4gICAgICAsIGtleXMgICA9IGdldFN5bWJvbHMgPyBnZXRLZXlzKFMpLmNvbmNhdChnZXRTeW1ib2xzKFMpKSA6IGdldEtleXMoUylcbiAgICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAgICwgaiAgICAgID0gMFxuICAgICAgLCBrZXk7XG4gICAgd2hpbGUobGVuZ3RoID4gailpZihpc0VudW0uY2FsbChTLCBrZXkgPSBrZXlzW2orK10pKVRba2V5XSA9IFNba2V5XTtcbiAgfSByZXR1cm4gVDtcbn0gOiAkYXNzaWduOyIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBkUHMgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKVxuICAsIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpXG4gICwgSUVfUFJPVE8gICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJylcbiAgLCBFbXB0eSAgICAgICA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH1cbiAgLCBQUk9UT1RZUEUgICA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uKCl7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpXG4gICAgLCBpICAgICAgPSBlbnVtQnVnS2V5cy5sZW5ndGhcbiAgICAsIGx0ICAgICA9ICc8J1xuICAgICwgZ3QgICAgID0gJz4nXG4gICAgLCBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArICdzY3JpcHQnICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnL3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZShpLS0pZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpe1xuICB2YXIgcmVzdWx0O1xuICBpZihPICE9PSBudWxsKXtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5O1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGRQICAgICAgICAgICAgID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyl7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZihJRThfRE9NX0RFRklORSl0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICBpZignZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKU9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07IiwidmFyIGRQICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZ2V0S2V5cyAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcyl7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyAgID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGkgPSAwXG4gICAgLCBQO1xuICB3aGlsZShsZW5ndGggPiBpKWRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTsiLCJ2YXIgcElFICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJylcbiAgLCBjcmVhdGVEZXNjICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIHRvSU9iamVjdCAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCBnT1BEICAgICAgICAgICA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBnT1BEIDogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApe1xuICBPID0gdG9JT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGdPUEQoTywgUCk7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgaWYoaGFzKE8sIFApKXJldHVybiBjcmVhdGVEZXNjKCFwSUUuZi5jYWxsKE8sIFApLCBPW1BdKTtcbn07IiwiLy8gZmFsbGJhY2sgZm9yIElFMTEgYnVnZ3kgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgd2l0aCBpZnJhbWUgYW5kIHdpbmRvd1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIGdPUE4gICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJykuZlxuICAsIHRvU3RyaW5nICA9IHt9LnRvU3RyaW5nO1xuXG52YXIgd2luZG93TmFtZXMgPSB0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvdyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc1xuICA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHdpbmRvdykgOiBbXTtcblxudmFyIGdldFdpbmRvd05hbWVzID0gZnVuY3Rpb24oaXQpe1xuICB0cnkge1xuICAgIHJldHVybiBnT1BOKGl0KTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gd2luZG93TmFtZXMuc2xpY2UoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuZiA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpe1xuICByZXR1cm4gd2luZG93TmFtZXMgJiYgdG9TdHJpbmcuY2FsbChpdCkgPT0gJ1tvYmplY3QgV2luZG93XScgPyBnZXRXaW5kb3dOYW1lcyhpdCkgOiBnT1BOKHRvSU9iamVjdChpdCkpO1xufTtcbiIsIi8vIDE5LjEuMi43IC8gMTUuMi4zLjQgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbnZhciAka2V5cyAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKVxuICAsIGhpZGRlbktleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJykuY29uY2F0KCdsZW5ndGgnLCAncHJvdG90eXBlJyk7XG5cbmV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHx8IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoTyl7XG4gIHJldHVybiAka2V5cyhPLCBoaWRkZW5LZXlzKTtcbn07IiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9sczsiLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCB0b09iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgSUVfUFJPVE8gICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJylcbiAgLCBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uKE8pe1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmKGhhcyhPLCBJRV9QUk9UTykpcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZih0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKXtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59OyIsInZhciBoYXMgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHRvSU9iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpXG4gICwgSUVfUFJPVE8gICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgbmFtZXMpe1xuICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KG9iamVjdClcbiAgICAsIGkgICAgICA9IDBcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBrZXk7XG4gIGZvcihrZXkgaW4gTylpZihrZXkgIT0gSUVfUFJPVE8paGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSl7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTsiLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJylcbiAgLCBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pe1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTsiLCJleHBvcnRzLmYgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTsiLCIvLyBtb3N0IE9iamVjdCBtZXRob2RzIGJ5IEVTNiBzaG91bGQgYWNjZXB0IHByaW1pdGl2ZXNcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBjb3JlICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgZmFpbHMgICA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEtFWSwgZXhlYyl7XG4gIHZhciBmbiAgPSAoY29yZS5PYmplY3QgfHwge30pW0tFWV0gfHwgT2JqZWN0W0tFWV1cbiAgICAsIGV4cCA9IHt9O1xuICBleHBbS0VZXSA9IGV4ZWMoZm4pO1xuICAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIGZhaWxzKGZ1bmN0aW9uKCl7IGZuKDEpOyB9KSwgJ09iamVjdCcsIGV4cCk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYml0bWFwLCB2YWx1ZSl7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZSAgOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWUgICAgICAgOiB2YWx1ZVxuICB9O1xufTsiLCJ2YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFyZ2V0LCBzcmMsIHNhZmUpe1xuICBmb3IodmFyIGtleSBpbiBzcmMpe1xuICAgIGlmKHNhZmUgJiYgdGFyZ2V0W2tleV0pdGFyZ2V0W2tleV0gPSBzcmNba2V5XTtcbiAgICBlbHNlIGhpZGUodGFyZ2V0LCBrZXksIHNyY1trZXldKTtcbiAgfSByZXR1cm4gdGFyZ2V0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2hpZGUnKTsiLCIvLyBXb3JrcyB3aXRoIF9fcHJvdG9fXyBvbmx5LiBPbGQgdjggY2FuJ3Qgd29yayB3aXRoIG51bGwgcHJvdG8gb2JqZWN0cy5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgY2hlY2sgPSBmdW5jdGlvbihPLCBwcm90byl7XG4gIGFuT2JqZWN0KE8pO1xuICBpZighaXNPYmplY3QocHJvdG8pICYmIHByb3RvICE9PSBudWxsKXRocm93IFR5cGVFcnJvcihwcm90byArIFwiOiBjYW4ndCBzZXQgYXMgcHJvdG90eXBlIVwiKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgKCdfX3Byb3RvX18nIGluIHt9ID8gLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIGZ1bmN0aW9uKHRlc3QsIGJ1Z2d5LCBzZXQpe1xuICAgICAgdHJ5IHtcbiAgICAgICAgc2V0ID0gcmVxdWlyZSgnLi9fY3R4JykoRnVuY3Rpb24uY2FsbCwgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKS5mKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQsIDIpO1xuICAgICAgICBzZXQodGVzdCwgW10pO1xuICAgICAgICBidWdneSA9ICEodGVzdCBpbnN0YW5jZW9mIEFycmF5KTtcbiAgICAgIH0gY2F0Y2goZSl7IGJ1Z2d5ID0gdHJ1ZTsgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKE8sIHByb3RvKXtcbiAgICAgICAgY2hlY2soTywgcHJvdG8pO1xuICAgICAgICBpZihidWdneSlPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICBlbHNlIHNldChPLCBwcm90byk7XG4gICAgICAgIHJldHVybiBPO1xuICAgICAgfTtcbiAgICB9KHt9LCBmYWxzZSkgOiB1bmRlZmluZWQpLFxuICBjaGVjazogY2hlY2tcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIGRQICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJylcbiAgLCBTUEVDSUVTICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZKXtcbiAgdmFyIEMgPSB0eXBlb2YgY29yZVtLRVldID09ICdmdW5jdGlvbicgPyBjb3JlW0tFWV0gOiBnbG9iYWxbS0VZXTtcbiAgaWYoREVTQ1JJUFRPUlMgJiYgQyAmJiAhQ1tTUEVDSUVTXSlkUC5mKEMsIFNQRUNJRVMsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfVxuICB9KTtcbn07IiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBoYXMgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCB0YWcsIHN0YXQpe1xuICBpZihpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKWRlZihpdCwgVEFHLCB7Y29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnfSk7XG59OyIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpXG4gICwgdWlkICAgID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59OyIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXG4gICwgc3RvcmUgID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07IiwiLy8gNy4zLjIwIFNwZWNpZXNDb25zdHJ1Y3RvcihPLCBkZWZhdWx0Q29uc3RydWN0b3IpXG52YXIgYW5PYmplY3QgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJylcbiAgLCBTUEVDSUVTICAgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihPLCBEKXtcbiAgdmFyIEMgPSBhbk9iamVjdChPKS5jb25zdHJ1Y3RvciwgUztcbiAgcmV0dXJuIEMgPT09IHVuZGVmaW5lZCB8fCAoUyA9IGFuT2JqZWN0KEMpW1NQRUNJRVNdKSA9PSB1bmRlZmluZWQgPyBEIDogYUZ1bmN0aW9uKFMpO1xufTsiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgZGVmaW5lZCAgID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXG4gICAgICAsIGwgPSBzLmxlbmd0aFxuICAgICAgLCBhLCBiO1xuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTsiLCJ2YXIgY3R4ICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBpbnZva2UgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19pbnZva2UnKVxuICAsIGh0bWwgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2h0bWwnKVxuICAsIGNlbCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKVxuICAsIGdsb2JhbCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgcHJvY2VzcyAgICAgICAgICAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBzZXRUYXNrICAgICAgICAgICAgPSBnbG9iYWwuc2V0SW1tZWRpYXRlXG4gICwgY2xlYXJUYXNrICAgICAgICAgID0gZ2xvYmFsLmNsZWFySW1tZWRpYXRlXG4gICwgTWVzc2FnZUNoYW5uZWwgICAgID0gZ2xvYmFsLk1lc3NhZ2VDaGFubmVsXG4gICwgY291bnRlciAgICAgICAgICAgID0gMFxuICAsIHF1ZXVlICAgICAgICAgICAgICA9IHt9XG4gICwgT05SRUFEWVNUQVRFQ0hBTkdFID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSdcbiAgLCBkZWZlciwgY2hhbm5lbCwgcG9ydDtcbnZhciBydW4gPSBmdW5jdGlvbigpe1xuICB2YXIgaWQgPSArdGhpcztcbiAgaWYocXVldWUuaGFzT3duUHJvcGVydHkoaWQpKXtcbiAgICB2YXIgZm4gPSBxdWV1ZVtpZF07XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgICBmbigpO1xuICB9XG59O1xudmFyIGxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpe1xuICBydW4uY2FsbChldmVudC5kYXRhKTtcbn07XG4vLyBOb2RlLmpzIDAuOSsgJiBJRTEwKyBoYXMgc2V0SW1tZWRpYXRlLCBvdGhlcndpc2U6XG5pZighc2V0VGFzayB8fCAhY2xlYXJUYXNrKXtcbiAgc2V0VGFzayA9IGZ1bmN0aW9uIHNldEltbWVkaWF0ZShmbil7XG4gICAgdmFyIGFyZ3MgPSBbXSwgaSA9IDE7XG4gICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICBxdWV1ZVsrK2NvdW50ZXJdID0gZnVuY3Rpb24oKXtcbiAgICAgIGludm9rZSh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJyA/IGZuIDogRnVuY3Rpb24oZm4pLCBhcmdzKTtcbiAgICB9O1xuICAgIGRlZmVyKGNvdW50ZXIpO1xuICAgIHJldHVybiBjb3VudGVyO1xuICB9O1xuICBjbGVhclRhc2sgPSBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShpZCl7XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgfTtcbiAgLy8gTm9kZS5qcyAwLjgtXG4gIGlmKHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJyl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGN0eChydW4sIGlkLCAxKSk7XG4gICAgfTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBNZXNzYWdlQ2hhbm5lbCwgaW5jbHVkZXMgV2ViV29ya2Vyc1xuICB9IGVsc2UgaWYoTWVzc2FnZUNoYW5uZWwpe1xuICAgIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWw7XG4gICAgcG9ydCAgICA9IGNoYW5uZWwucG9ydDI7XG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaXN0ZW5lcjtcbiAgICBkZWZlciA9IGN0eChwb3J0LnBvc3RNZXNzYWdlLCBwb3J0LCAxKTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBwb3N0TWVzc2FnZSwgc2tpcCBXZWJXb3JrZXJzXG4gIC8vIElFOCBoYXMgcG9zdE1lc3NhZ2UsIGJ1dCBpdCdzIHN5bmMgJiB0eXBlb2YgaXRzIHBvc3RNZXNzYWdlIGlzICdvYmplY3QnXG4gIH0gZWxzZSBpZihnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lciAmJiB0eXBlb2YgcG9zdE1lc3NhZ2UgPT0gJ2Z1bmN0aW9uJyAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKGlkICsgJycsICcqJyk7XG4gICAgfTtcbiAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGxpc3RlbmVyLCBmYWxzZSk7XG4gIC8vIElFOC1cbiAgfSBlbHNlIGlmKE9OUkVBRFlTVEFURUNIQU5HRSBpbiBjZWwoJ3NjcmlwdCcpKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoY2VsKCdzY3JpcHQnKSlbT05SRUFEWVNUQVRFQ0hBTkdFXSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcbiAgICAgIH07XG4gICAgfTtcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcbiAgfSBlbHNlIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcbiAgICB9O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiAgIHNldFRhc2ssXG4gIGNsZWFyOiBjbGVhclRhc2tcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1heCAgICAgICA9IE1hdGgubWF4XG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGluZGV4LCBsZW5ndGgpe1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTsiLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsICA9IE1hdGguY2VpbFxuICAsIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07IiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTsiLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgUyl7XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZih0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07IiwidmFyIGlkID0gMFxuICAsIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07IiwidmFyIGdsb2JhbCAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIExJQlJBUlkgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgd2tzRXh0ICAgICAgICAgPSByZXF1aXJlKCcuL193a3MtZXh0JylcbiAgLCBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICB2YXIgJFN5bWJvbCA9IGNvcmUuU3ltYm9sIHx8IChjb3JlLlN5bWJvbCA9IExJQlJBUlkgPyB7fSA6IGdsb2JhbC5TeW1ib2wgfHwge30pO1xuICBpZihuYW1lLmNoYXJBdCgwKSAhPSAnXycgJiYgIShuYW1lIGluICRTeW1ib2wpKWRlZmluZVByb3BlcnR5KCRTeW1ib2wsIG5hbWUsIHt2YWx1ZTogd2tzRXh0LmYobmFtZSl9KTtcbn07IiwiZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fd2tzJyk7IiwidmFyIHN0b3JlICAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJylcbiAgLCB1aWQgICAgICAgID0gcmVxdWlyZSgnLi9fdWlkJylcbiAgLCBTeW1ib2wgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sXG4gICwgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lKXtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7IiwidmFyIGNsYXNzb2YgICA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKVxuICAsIElURVJBVE9SICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgIT0gdW5kZWZpbmVkKXJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFkZFRvVW5zY29wYWJsZXMgPSByZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKVxuICAsIHN0ZXAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKVxuICAsIEl0ZXJhdG9ycyAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIHRvSU9iamVjdCAgICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGtpbmQgID0gdGhpcy5fa1xuICAgICwgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcbiAgICB0aGlzLl90ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdGVwKDEpO1xuICB9XG4gIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xuICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5hZGRUb1Vuc2NvcGFibGVzKCdrZXlzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCd2YWx1ZXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ2VudHJpZXMnKTsiLCIvLyAyMC4yLjIuMjEgTWF0aC5sb2cxMCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICBsb2cxMDogZnVuY3Rpb24gbG9nMTAoeCl7XG4gICAgcmV0dXJuIE1hdGgubG9nKHgpIC8gTWF0aC5MTjEwO1xuICB9XG59KTsiLCIvLyAyMC4xLjIuMiBOdW1iZXIuaXNGaW5pdGUobnVtYmVyKVxudmFyICRleHBvcnQgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgX2lzRmluaXRlID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuaXNGaW5pdGU7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTnVtYmVyJywge1xuICBpc0Zpbml0ZTogZnVuY3Rpb24gaXNGaW5pdGUoaXQpe1xuICAgIHJldHVybiB0eXBlb2YgaXQgPT0gJ251bWJlcicgJiYgX2lzRmluaXRlKGl0KTtcbiAgfVxufSk7IiwiLy8gMTkuMS4zLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GLCAnT2JqZWN0Jywge2Fzc2lnbjogcmVxdWlyZSgnLi9fb2JqZWN0LWFzc2lnbicpfSk7IiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHtjcmVhdGU6IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKX0pOyIsInZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG4vLyAxOS4xLjIuNCAvIDE1LjIuMy42IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSwgJ09iamVjdCcsIHtkZWZpbmVQcm9wZXJ0eTogcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZn0pOyIsIi8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbnZhciB0b0lPYmplY3QgICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJykuZjtcblxucmVxdWlyZSgnLi9fb2JqZWN0LXNhcCcpKCdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3InLCBmdW5jdGlvbigpe1xuICByZXR1cm4gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xuICAgIHJldHVybiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRvSU9iamVjdChpdCksIGtleSk7XG4gIH07XG59KTsiLCIvLyAxOS4xLjIuOSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciB0b09iamVjdCAgICAgICAgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsICRnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKTtcblxucmVxdWlyZSgnLi9fb2JqZWN0LXNhcCcpKCdnZXRQcm90b3R5cGVPZicsIGZ1bmN0aW9uKCl7XG4gIHJldHVybiBmdW5jdGlvbiBnZXRQcm90b3R5cGVPZihpdCl7XG4gICAgcmV0dXJuICRnZXRQcm90b3R5cGVPZih0b09iamVjdChpdCkpO1xuICB9O1xufSk7IiwiLy8gMTkuMS4zLjE5IE9iamVjdC5zZXRQcm90b3R5cGVPZihPLCBwcm90bylcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHtzZXRQcm90b3R5cGVPZjogcmVxdWlyZSgnLi9fc2V0LXByb3RvJykuc2V0fSk7IiwiIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKVxuICAsIGdsb2JhbCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgY3R4ICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBjbGFzc29mICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jbGFzc29mJylcbiAgLCAkZXhwb3J0ICAgICAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIGlzT2JqZWN0ICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uICAgICAgICAgID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpXG4gICwgYW5JbnN0YW5jZSAgICAgICAgID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKVxuICAsIGZvck9mICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2Zvci1vZicpXG4gICwgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9fc3BlY2llcy1jb25zdHJ1Y3RvcicpXG4gICwgdGFzayAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fdGFzaycpLnNldFxuICAsIG1pY3JvdGFzayAgICAgICAgICA9IHJlcXVpcmUoJy4vX21pY3JvdGFzaycpKClcbiAgLCBQUk9NSVNFICAgICAgICAgICAgPSAnUHJvbWlzZSdcbiAgLCBUeXBlRXJyb3IgICAgICAgICAgPSBnbG9iYWwuVHlwZUVycm9yXG4gICwgcHJvY2VzcyAgICAgICAgICAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCAkUHJvbWlzZSAgICAgICAgICAgPSBnbG9iYWxbUFJPTUlTRV1cbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIGlzTm9kZSAgICAgICAgICAgICA9IGNsYXNzb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnXG4gICwgZW1wdHkgICAgICAgICAgICAgID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfVxuICAsIEludGVybmFsLCBHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHksIFdyYXBwZXI7XG5cbnZhciBVU0VfTkFUSVZFID0gISFmdW5jdGlvbigpe1xuICB0cnkge1xuICAgIC8vIGNvcnJlY3Qgc3ViY2xhc3Npbmcgd2l0aCBAQHNwZWNpZXMgc3VwcG9ydFxuICAgIHZhciBwcm9taXNlICAgICA9ICRQcm9taXNlLnJlc29sdmUoMSlcbiAgICAgICwgRmFrZVByb21pc2UgPSAocHJvbWlzZS5jb25zdHJ1Y3RvciA9IHt9KVtyZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpXSA9IGZ1bmN0aW9uKGV4ZWMpeyBleGVjKGVtcHR5LCBlbXB0eSk7IH07XG4gICAgLy8gdW5oYW5kbGVkIHJlamVjdGlvbnMgdHJhY2tpbmcgc3VwcG9ydCwgTm9kZUpTIFByb21pc2Ugd2l0aG91dCBpdCBmYWlscyBAQHNwZWNpZXMgdGVzdFxuICAgIHJldHVybiAoaXNOb2RlIHx8IHR5cGVvZiBQcm9taXNlUmVqZWN0aW9uRXZlbnQgPT0gJ2Z1bmN0aW9uJykgJiYgcHJvbWlzZS50aGVuKGVtcHR5KSBpbnN0YW5jZW9mIEZha2VQcm9taXNlO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG59KCk7XG5cbi8vIGhlbHBlcnNcbnZhciBzYW1lQ29uc3RydWN0b3IgPSBmdW5jdGlvbihhLCBiKXtcbiAgLy8gd2l0aCBsaWJyYXJ5IHdyYXBwZXIgc3BlY2lhbCBjYXNlXG4gIHJldHVybiBhID09PSBiIHx8IGEgPT09ICRQcm9taXNlICYmIGIgPT09IFdyYXBwZXI7XG59O1xudmFyIGlzVGhlbmFibGUgPSBmdW5jdGlvbihpdCl7XG4gIHZhciB0aGVuO1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmIHR5cGVvZiAodGhlbiA9IGl0LnRoZW4pID09ICdmdW5jdGlvbicgPyB0aGVuIDogZmFsc2U7XG59O1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oQyl7XG4gIHJldHVybiBzYW1lQ29uc3RydWN0b3IoJFByb21pc2UsIEMpXG4gICAgPyBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICA6IG5ldyBHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkoQyk7XG59O1xudmFyIFByb21pc2VDYXBhYmlsaXR5ID0gR2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oQyl7XG4gIHZhciByZXNvbHZlLCByZWplY3Q7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBDKGZ1bmN0aW9uKCQkcmVzb2x2ZSwgJCRyZWplY3Qpe1xuICAgIGlmKHJlc29sdmUgIT09IHVuZGVmaW5lZCB8fCByZWplY3QgIT09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoJ0JhZCBQcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gICAgcmVzb2x2ZSA9ICQkcmVzb2x2ZTtcbiAgICByZWplY3QgID0gJCRyZWplY3Q7XG4gIH0pO1xuICB0aGlzLnJlc29sdmUgPSBhRnVuY3Rpb24ocmVzb2x2ZSk7XG4gIHRoaXMucmVqZWN0ICA9IGFGdW5jdGlvbihyZWplY3QpO1xufTtcbnZhciBwZXJmb3JtID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB7ZXJyb3I6IGV9O1xuICB9XG59O1xudmFyIG5vdGlmeSA9IGZ1bmN0aW9uKHByb21pc2UsIGlzUmVqZWN0KXtcbiAgaWYocHJvbWlzZS5fbilyZXR1cm47XG4gIHByb21pc2UuX24gPSB0cnVlO1xuICB2YXIgY2hhaW4gPSBwcm9taXNlLl9jO1xuICBtaWNyb3Rhc2soZnVuY3Rpb24oKXtcbiAgICB2YXIgdmFsdWUgPSBwcm9taXNlLl92XG4gICAgICAsIG9rICAgID0gcHJvbWlzZS5fcyA9PSAxXG4gICAgICAsIGkgICAgID0gMDtcbiAgICB2YXIgcnVuID0gZnVuY3Rpb24ocmVhY3Rpb24pe1xuICAgICAgdmFyIGhhbmRsZXIgPSBvayA/IHJlYWN0aW9uLm9rIDogcmVhY3Rpb24uZmFpbFxuICAgICAgICAsIHJlc29sdmUgPSByZWFjdGlvbi5yZXNvbHZlXG4gICAgICAgICwgcmVqZWN0ICA9IHJlYWN0aW9uLnJlamVjdFxuICAgICAgICAsIGRvbWFpbiAgPSByZWFjdGlvbi5kb21haW5cbiAgICAgICAgLCByZXN1bHQsIHRoZW47XG4gICAgICB0cnkge1xuICAgICAgICBpZihoYW5kbGVyKXtcbiAgICAgICAgICBpZighb2spe1xuICAgICAgICAgICAgaWYocHJvbWlzZS5faCA9PSAyKW9uSGFuZGxlVW5oYW5kbGVkKHByb21pc2UpO1xuICAgICAgICAgICAgcHJvbWlzZS5faCA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGhhbmRsZXIgPT09IHRydWUpcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZihkb21haW4pZG9tYWluLmVudGVyKCk7XG4gICAgICAgICAgICByZXN1bHQgPSBoYW5kbGVyKHZhbHVlKTtcbiAgICAgICAgICAgIGlmKGRvbWFpbilkb21haW4uZXhpdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZihyZXN1bHQgPT09IHJlYWN0aW9uLnByb21pc2Upe1xuICAgICAgICAgICAgcmVqZWN0KFR5cGVFcnJvcignUHJvbWlzZS1jaGFpbiBjeWNsZScpKTtcbiAgICAgICAgICB9IGVsc2UgaWYodGhlbiA9IGlzVGhlbmFibGUocmVzdWx0KSl7XG4gICAgICAgICAgICB0aGVuLmNhbGwocmVzdWx0LCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0gZWxzZSByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSByZWplY3QodmFsdWUpO1xuICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSlydW4oY2hhaW5baSsrXSk7IC8vIHZhcmlhYmxlIGxlbmd0aCAtIGNhbid0IHVzZSBmb3JFYWNoXG4gICAgcHJvbWlzZS5fYyA9IFtdO1xuICAgIHByb21pc2UuX24gPSBmYWxzZTtcbiAgICBpZihpc1JlamVjdCAmJiAhcHJvbWlzZS5faClvblVuaGFuZGxlZChwcm9taXNlKTtcbiAgfSk7XG59O1xudmFyIG9uVW5oYW5kbGVkID0gZnVuY3Rpb24ocHJvbWlzZSl7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIHZhbHVlID0gcHJvbWlzZS5fdlxuICAgICAgLCBhYnJ1cHQsIGhhbmRsZXIsIGNvbnNvbGU7XG4gICAgaWYoaXNVbmhhbmRsZWQocHJvbWlzZSkpe1xuICAgICAgYWJydXB0ID0gcGVyZm9ybShmdW5jdGlvbigpe1xuICAgICAgICBpZihpc05vZGUpe1xuICAgICAgICAgIHByb2Nlc3MuZW1pdCgndW5oYW5kbGVkUmVqZWN0aW9uJywgdmFsdWUsIHByb21pc2UpO1xuICAgICAgICB9IGVsc2UgaWYoaGFuZGxlciA9IGdsb2JhbC5vbnVuaGFuZGxlZHJlamVjdGlvbil7XG4gICAgICAgICAgaGFuZGxlcih7cHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiB2YWx1ZX0pO1xuICAgICAgICB9IGVsc2UgaWYoKGNvbnNvbGUgPSBnbG9iYWwuY29uc29sZSkgJiYgY29uc29sZS5lcnJvcil7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIEJyb3dzZXJzIHNob3VsZCBub3QgdHJpZ2dlciBgcmVqZWN0aW9uSGFuZGxlZGAgZXZlbnQgaWYgaXQgd2FzIGhhbmRsZWQgaGVyZSwgTm9kZUpTIC0gc2hvdWxkXG4gICAgICBwcm9taXNlLl9oID0gaXNOb2RlIHx8IGlzVW5oYW5kbGVkKHByb21pc2UpID8gMiA6IDE7XG4gICAgfSBwcm9taXNlLl9hID0gdW5kZWZpbmVkO1xuICAgIGlmKGFicnVwdCl0aHJvdyBhYnJ1cHQuZXJyb3I7XG4gIH0pO1xufTtcbnZhciBpc1VuaGFuZGxlZCA9IGZ1bmN0aW9uKHByb21pc2Upe1xuICBpZihwcm9taXNlLl9oID09IDEpcmV0dXJuIGZhbHNlO1xuICB2YXIgY2hhaW4gPSBwcm9taXNlLl9hIHx8IHByb21pc2UuX2NcbiAgICAsIGkgICAgID0gMFxuICAgICwgcmVhY3Rpb247XG4gIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpe1xuICAgIHJlYWN0aW9uID0gY2hhaW5baSsrXTtcbiAgICBpZihyZWFjdGlvbi5mYWlsIHx8ICFpc1VuaGFuZGxlZChyZWFjdGlvbi5wcm9taXNlKSlyZXR1cm4gZmFsc2U7XG4gIH0gcmV0dXJuIHRydWU7XG59O1xudmFyIG9uSGFuZGxlVW5oYW5kbGVkID0gZnVuY3Rpb24ocHJvbWlzZSl7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIGhhbmRsZXI7XG4gICAgaWYoaXNOb2RlKXtcbiAgICAgIHByb2Nlc3MuZW1pdCgncmVqZWN0aW9uSGFuZGxlZCcsIHByb21pc2UpO1xuICAgIH0gZWxzZSBpZihoYW5kbGVyID0gZ2xvYmFsLm9ucmVqZWN0aW9uaGFuZGxlZCl7XG4gICAgICBoYW5kbGVyKHtwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHByb21pc2UuX3Z9KTtcbiAgICB9XG4gIH0pO1xufTtcbnZhciAkcmVqZWN0ID0gZnVuY3Rpb24odmFsdWUpe1xuICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gIGlmKHByb21pc2UuX2QpcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fcyA9IDI7XG4gIGlmKCFwcm9taXNlLl9hKXByb21pc2UuX2EgPSBwcm9taXNlLl9jLnNsaWNlKCk7XG4gIG5vdGlmeShwcm9taXNlLCB0cnVlKTtcbn07XG52YXIgJHJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHZhciBwcm9taXNlID0gdGhpc1xuICAgICwgdGhlbjtcbiAgaWYocHJvbWlzZS5fZClyZXR1cm47XG4gIHByb21pc2UuX2QgPSB0cnVlO1xuICBwcm9taXNlID0gcHJvbWlzZS5fdyB8fCBwcm9taXNlOyAvLyB1bndyYXBcbiAgdHJ5IHtcbiAgICBpZihwcm9taXNlID09PSB2YWx1ZSl0aHJvdyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIGl0c2VsZlwiKTtcbiAgICBpZih0aGVuID0gaXNUaGVuYWJsZSh2YWx1ZSkpe1xuICAgICAgbWljcm90YXNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB3cmFwcGVyID0ge193OiBwcm9taXNlLCBfZDogZmFsc2V9OyAvLyB3cmFwXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBjdHgoJHJlc29sdmUsIHdyYXBwZXIsIDEpLCBjdHgoJHJlamVjdCwgd3JhcHBlciwgMSkpO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICRyZWplY3QuY2FsbCh3cmFwcGVyLCBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgICAgIHByb21pc2UuX3MgPSAxO1xuICAgICAgbm90aWZ5KHByb21pc2UsIGZhbHNlKTtcbiAgICB9XG4gIH0gY2F0Y2goZSl7XG4gICAgJHJlamVjdC5jYWxsKHtfdzogcHJvbWlzZSwgX2Q6IGZhbHNlfSwgZSk7IC8vIHdyYXBcbiAgfVxufTtcblxuLy8gY29uc3RydWN0b3IgcG9seWZpbGxcbmlmKCFVU0VfTkFUSVZFKXtcbiAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcbiAgJFByb21pc2UgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKXtcbiAgICBhbkluc3RhbmNlKHRoaXMsICRQcm9taXNlLCBQUk9NSVNFLCAnX2gnKTtcbiAgICBhRnVuY3Rpb24oZXhlY3V0b3IpO1xuICAgIEludGVybmFsLmNhbGwodGhpcyk7XG4gICAgdHJ5IHtcbiAgICAgIGV4ZWN1dG9yKGN0eCgkcmVzb2x2ZSwgdGhpcywgMSksIGN0eCgkcmVqZWN0LCB0aGlzLCAxKSk7XG4gICAgfSBjYXRjaChlcnIpe1xuICAgICAgJHJlamVjdC5jYWxsKHRoaXMsIGVycik7XG4gICAgfVxuICB9O1xuICBJbnRlcm5hbCA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3Ipe1xuICAgIHRoaXMuX2MgPSBbXTsgICAgICAgICAgICAgLy8gPC0gYXdhaXRpbmcgcmVhY3Rpb25zXG4gICAgdGhpcy5fYSA9IHVuZGVmaW5lZDsgICAgICAvLyA8LSBjaGVja2VkIGluIGlzVW5oYW5kbGVkIHJlYWN0aW9uc1xuICAgIHRoaXMuX3MgPSAwOyAgICAgICAgICAgICAgLy8gPC0gc3RhdGVcbiAgICB0aGlzLl9kID0gZmFsc2U7ICAgICAgICAgIC8vIDwtIGRvbmVcbiAgICB0aGlzLl92ID0gdW5kZWZpbmVkOyAgICAgIC8vIDwtIHZhbHVlXG4gICAgdGhpcy5faCA9IDA7ICAgICAgICAgICAgICAvLyA8LSByZWplY3Rpb24gc3RhdGUsIDAgLSBkZWZhdWx0LCAxIC0gaGFuZGxlZCwgMiAtIHVuaGFuZGxlZFxuICAgIHRoaXMuX24gPSBmYWxzZTsgICAgICAgICAgLy8gPC0gbm90aWZ5XG4gIH07XG4gIEludGVybmFsLnByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpKCRQcm9taXNlLnByb3RvdHlwZSwge1xuICAgIC8vIDI1LjQuNS4zIFByb21pc2UucHJvdG90eXBlLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXG4gICAgdGhlbjogZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCl7XG4gICAgICB2YXIgcmVhY3Rpb24gICAgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShzcGVjaWVzQ29uc3RydWN0b3IodGhpcywgJFByb21pc2UpKTtcbiAgICAgIHJlYWN0aW9uLm9rICAgICA9IHR5cGVvZiBvbkZ1bGZpbGxlZCA9PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiB0cnVlO1xuICAgICAgcmVhY3Rpb24uZmFpbCAgID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT0gJ2Z1bmN0aW9uJyAmJiBvblJlamVjdGVkO1xuICAgICAgcmVhY3Rpb24uZG9tYWluID0gaXNOb2RlID8gcHJvY2Vzcy5kb21haW4gOiB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9jLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYodGhpcy5fYSl0aGlzLl9hLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYodGhpcy5fcylub3RpZnkodGhpcywgZmFsc2UpO1xuICAgICAgcmV0dXJuIHJlYWN0aW9uLnByb21pc2U7XG4gICAgfSxcbiAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxuICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpe1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuICAgIH1cbiAgfSk7XG4gIFByb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgcHJvbWlzZSAgPSBuZXcgSW50ZXJuYWw7XG4gICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbiAgICB0aGlzLnJlc29sdmUgPSBjdHgoJHJlc29sdmUsIHByb21pc2UsIDEpO1xuICAgIHRoaXMucmVqZWN0ICA9IGN0eCgkcmVqZWN0LCBwcm9taXNlLCAxKTtcbiAgfTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwge1Byb21pc2U6ICRQcm9taXNlfSk7XG5yZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpKCRQcm9taXNlLCBQUk9NSVNFKTtcbnJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJykoUFJPTUlTRSk7XG5XcmFwcGVyID0gcmVxdWlyZSgnLi9fY29yZScpW1BST01JU0VdO1xuXG4vLyBzdGF0aWNzXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC41IFByb21pc2UucmVqZWN0KHIpXG4gIHJlamVjdDogZnVuY3Rpb24gcmVqZWN0KHIpe1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkodGhpcylcbiAgICAgICwgJCRyZWplY3QgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgICQkcmVqZWN0KHIpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoTElCUkFSWSB8fCAhVVNFX05BVElWRSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjYgUHJvbWlzZS5yZXNvbHZlKHgpXG4gIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoeCl7XG4gICAgLy8gaW5zdGFuY2VvZiBpbnN0ZWFkIG9mIGludGVybmFsIHNsb3QgY2hlY2sgYmVjYXVzZSB3ZSBzaG91bGQgZml4IGl0IHdpdGhvdXQgcmVwbGFjZW1lbnQgbmF0aXZlIFByb21pc2UgY29yZVxuICAgIGlmKHggaW5zdGFuY2VvZiAkUHJvbWlzZSAmJiBzYW1lQ29uc3RydWN0b3IoeC5jb25zdHJ1Y3RvciwgdGhpcykpcmV0dXJuIHg7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSh0aGlzKVxuICAgICAgLCAkJHJlc29sdmUgID0gY2FwYWJpbGl0eS5yZXNvbHZlO1xuICAgICQkcmVzb2x2ZSh4KTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIShVU0VfTkFUSVZFICYmIHJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24oaXRlcil7XG4gICRQcm9taXNlLmFsbChpdGVyKVsnY2F0Y2gnXShlbXB0eSk7XG59KSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjEgUHJvbWlzZS5hbGwoaXRlcmFibGUpXG4gIGFsbDogZnVuY3Rpb24gYWxsKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyAgICAgICAgICA9IHRoaXNcbiAgICAgICwgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgICAsIHJlc29sdmUgICAgPSBjYXBhYmlsaXR5LnJlc29sdmVcbiAgICAgICwgcmVqZWN0ICAgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgdmFsdWVzICAgID0gW11cbiAgICAgICAgLCBpbmRleCAgICAgPSAwXG4gICAgICAgICwgcmVtYWluaW5nID0gMTtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgIHZhciAkaW5kZXggICAgICAgID0gaW5kZXgrK1xuICAgICAgICAgICwgYWxyZWFkeUNhbGxlZCA9IGZhbHNlO1xuICAgICAgICB2YWx1ZXMucHVzaCh1bmRlZmluZWQpO1xuICAgICAgICByZW1haW5pbmcrKztcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgIGlmKGFscmVhZHlDYWxsZWQpcmV0dXJuO1xuICAgICAgICAgIGFscmVhZHlDYWxsZWQgID0gdHJ1ZTtcbiAgICAgICAgICB2YWx1ZXNbJGluZGV4XSA9IHZhbHVlO1xuICAgICAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUodmFsdWVzKTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgIH0pO1xuICAgIGlmKGFicnVwdClyZWplY3QoYWJydXB0LmVycm9yKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9LFxuICAvLyAyNS40LjQuNCBQcm9taXNlLnJhY2UoaXRlcmFibGUpXG4gIHJhY2U6IGZ1bmN0aW9uIHJhY2UoaXRlcmFibGUpe1xuICAgIHZhciBDICAgICAgICAgID0gdGhpc1xuICAgICAgLCBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgICwgcmVqZWN0ICAgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihjYXBhYmlsaXR5LnJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZihhYnJ1cHQpcmVqZWN0KGFicnVwdC5lcnJvcik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCAgPSByZXF1aXJlKCcuL19zdHJpbmctYXQnKSh0cnVlKTtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbihpdGVyYXRlZCl7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGluZGV4ID0gdGhpcy5faVxuICAgICwgcG9pbnQ7XG4gIGlmKGluZGV4ID49IE8ubGVuZ3RoKXJldHVybiB7dmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZX07XG4gIHBvaW50ID0gJGF0KE8sIGluZGV4KTtcbiAgdGhpcy5faSArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7dmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZX07XG59KTsiLCIndXNlIHN0cmljdCc7XG4vLyBFQ01BU2NyaXB0IDYgc3ltYm9scyBzaGltXG52YXIgZ2xvYmFsICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBERVNDUklQVE9SUyAgICA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgcmVkZWZpbmUgICAgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZScpXG4gICwgTUVUQSAgICAgICAgICAgPSByZXF1aXJlKCcuL19tZXRhJykuS0VZXG4gICwgJGZhaWxzICAgICAgICAgPSByZXF1aXJlKCcuL19mYWlscycpXG4gICwgc2hhcmVkICAgICAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIHVpZCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fdWlkJylcbiAgLCB3a3MgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3drcycpXG4gICwgd2tzRXh0ICAgICAgICAgPSByZXF1aXJlKCcuL193a3MtZXh0JylcbiAgLCB3a3NEZWZpbmUgICAgICA9IHJlcXVpcmUoJy4vX3drcy1kZWZpbmUnKVxuICAsIGtleU9mICAgICAgICAgID0gcmVxdWlyZSgnLi9fa2V5b2YnKVxuICAsIGVudW1LZXlzICAgICAgID0gcmVxdWlyZSgnLi9fZW51bS1rZXlzJylcbiAgLCBpc0FycmF5ICAgICAgICA9IHJlcXVpcmUoJy4vX2lzLWFycmF5JylcbiAgLCBhbk9iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgdG9JT2JqZWN0ICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCB0b1ByaW1pdGl2ZSAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXG4gICwgY3JlYXRlRGVzYyAgICAgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJylcbiAgLCBfY3JlYXRlICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKVxuICAsIGdPUE5FeHQgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4tZXh0JylcbiAgLCAkR09QRCAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJylcbiAgLCAkRFAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgJGtleXMgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpXG4gICwgZ09QRCAgICAgICAgICAgPSAkR09QRC5mXG4gICwgZFAgICAgICAgICAgICAgPSAkRFAuZlxuICAsIGdPUE4gICAgICAgICAgID0gZ09QTkV4dC5mXG4gICwgJFN5bWJvbCAgICAgICAgPSBnbG9iYWwuU3ltYm9sXG4gICwgJEpTT04gICAgICAgICAgPSBnbG9iYWwuSlNPTlxuICAsIF9zdHJpbmdpZnkgICAgID0gJEpTT04gJiYgJEpTT04uc3RyaW5naWZ5XG4gICwgUFJPVE9UWVBFICAgICAgPSAncHJvdG90eXBlJ1xuICAsIEhJRERFTiAgICAgICAgID0gd2tzKCdfaGlkZGVuJylcbiAgLCBUT19QUklNSVRJVkUgICA9IHdrcygndG9QcmltaXRpdmUnKVxuICAsIGlzRW51bSAgICAgICAgID0ge30ucHJvcGVydHlJc0VudW1lcmFibGVcbiAgLCBTeW1ib2xSZWdpc3RyeSA9IHNoYXJlZCgnc3ltYm9sLXJlZ2lzdHJ5JylcbiAgLCBBbGxTeW1ib2xzICAgICA9IHNoYXJlZCgnc3ltYm9scycpXG4gICwgT1BTeW1ib2xzICAgICAgPSBzaGFyZWQoJ29wLXN5bWJvbHMnKVxuICAsIE9iamVjdFByb3RvICAgID0gT2JqZWN0W1BST1RPVFlQRV1cbiAgLCBVU0VfTkFUSVZFICAgICA9IHR5cGVvZiAkU3ltYm9sID09ICdmdW5jdGlvbidcbiAgLCBRT2JqZWN0ICAgICAgICA9IGdsb2JhbC5RT2JqZWN0O1xuLy8gRG9uJ3QgdXNlIHNldHRlcnMgaW4gUXQgU2NyaXB0LCBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvMTczXG52YXIgc2V0dGVyID0gIVFPYmplY3QgfHwgIVFPYmplY3RbUFJPVE9UWVBFXSB8fCAhUU9iamVjdFtQUk9UT1RZUEVdLmZpbmRDaGlsZDtcblxuLy8gZmFsbGJhY2sgZm9yIG9sZCBBbmRyb2lkLCBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9Njg3XG52YXIgc2V0U3ltYm9sRGVzYyA9IERFU0NSSVBUT1JTICYmICRmYWlscyhmdW5jdGlvbigpe1xuICByZXR1cm4gX2NyZWF0ZShkUCh7fSwgJ2EnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gZFAodGhpcywgJ2EnLCB7dmFsdWU6IDd9KS5hOyB9XG4gIH0pKS5hICE9IDc7XG59KSA/IGZ1bmN0aW9uKGl0LCBrZXksIEQpe1xuICB2YXIgcHJvdG9EZXNjID0gZ09QRChPYmplY3RQcm90bywga2V5KTtcbiAgaWYocHJvdG9EZXNjKWRlbGV0ZSBPYmplY3RQcm90b1trZXldO1xuICBkUChpdCwga2V5LCBEKTtcbiAgaWYocHJvdG9EZXNjICYmIGl0ICE9PSBPYmplY3RQcm90bylkUChPYmplY3RQcm90bywga2V5LCBwcm90b0Rlc2MpO1xufSA6IGRQO1xuXG52YXIgd3JhcCA9IGZ1bmN0aW9uKHRhZyl7XG4gIHZhciBzeW0gPSBBbGxTeW1ib2xzW3RhZ10gPSBfY3JlYXRlKCRTeW1ib2xbUFJPVE9UWVBFXSk7XG4gIHN5bS5fayA9IHRhZztcbiAgcmV0dXJuIHN5bTtcbn07XG5cbnZhciBpc1N5bWJvbCA9IFVTRV9OQVRJVkUgJiYgdHlwZW9mICRTeW1ib2wuaXRlcmF0b3IgPT0gJ3N5bWJvbCcgPyBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCc7XG59IDogZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgaW5zdGFuY2VvZiAkU3ltYm9sO1xufTtcblxudmFyICRkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIEQpe1xuICBpZihpdCA9PT0gT2JqZWN0UHJvdG8pJGRlZmluZVByb3BlcnR5KE9QU3ltYm9scywga2V5LCBEKTtcbiAgYW5PYmplY3QoaXQpO1xuICBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpO1xuICBhbk9iamVjdChEKTtcbiAgaWYoaGFzKEFsbFN5bWJvbHMsIGtleSkpe1xuICAgIGlmKCFELmVudW1lcmFibGUpe1xuICAgICAgaWYoIWhhcyhpdCwgSElEREVOKSlkUChpdCwgSElEREVOLCBjcmVhdGVEZXNjKDEsIHt9KSk7XG4gICAgICBpdFtISURERU5dW2tleV0gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZihoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKWl0W0hJRERFTl1ba2V5XSA9IGZhbHNlO1xuICAgICAgRCA9IF9jcmVhdGUoRCwge2VudW1lcmFibGU6IGNyZWF0ZURlc2MoMCwgZmFsc2UpfSk7XG4gICAgfSByZXR1cm4gc2V0U3ltYm9sRGVzYyhpdCwga2V5LCBEKTtcbiAgfSByZXR1cm4gZFAoaXQsIGtleSwgRCk7XG59O1xudmFyICRkZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhpdCwgUCl7XG4gIGFuT2JqZWN0KGl0KTtcbiAgdmFyIGtleXMgPSBlbnVtS2V5cyhQID0gdG9JT2JqZWN0KFApKVxuICAgICwgaSAgICA9IDBcbiAgICAsIGwgPSBrZXlzLmxlbmd0aFxuICAgICwga2V5O1xuICB3aGlsZShsID4gaSkkZGVmaW5lUHJvcGVydHkoaXQsIGtleSA9IGtleXNbaSsrXSwgUFtrZXldKTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciAkY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGl0LCBQKXtcbiAgcmV0dXJuIFAgPT09IHVuZGVmaW5lZCA/IF9jcmVhdGUoaXQpIDogJGRlZmluZVByb3BlcnRpZXMoX2NyZWF0ZShpdCksIFApO1xufTtcbnZhciAkcHJvcGVydHlJc0VudW1lcmFibGUgPSBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShrZXkpe1xuICB2YXIgRSA9IGlzRW51bS5jYWxsKHRoaXMsIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSkpO1xuICBpZih0aGlzID09PSBPYmplY3RQcm90byAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhaGFzKE9QU3ltYm9scywga2V5KSlyZXR1cm4gZmFsc2U7XG4gIHJldHVybiBFIHx8ICFoYXModGhpcywga2V5KSB8fCAhaGFzKEFsbFN5bWJvbHMsIGtleSkgfHwgaGFzKHRoaXMsIEhJRERFTikgJiYgdGhpc1tISURERU5dW2tleV0gPyBFIDogdHJ1ZTtcbn07XG52YXIgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KXtcbiAgaXQgID0gdG9JT2JqZWN0KGl0KTtcbiAga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKTtcbiAgaWYoaXQgPT09IE9iamVjdFByb3RvICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICFoYXMoT1BTeW1ib2xzLCBrZXkpKXJldHVybjtcbiAgdmFyIEQgPSBnT1BEKGl0LCBrZXkpO1xuICBpZihEICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICEoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSkpRC5lbnVtZXJhYmxlID0gdHJ1ZTtcbiAgcmV0dXJuIEQ7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCl7XG4gIHZhciBuYW1lcyAgPSBnT1BOKHRvSU9iamVjdChpdCkpXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwgaSAgICAgID0gMFxuICAgICwga2V5O1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKXtcbiAgICBpZighaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIGtleSAhPSBISURERU4gJiYga2V5ICE9IE1FVEEpcmVzdWx0LnB1c2goa2V5KTtcbiAgfSByZXR1cm4gcmVzdWx0O1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KXtcbiAgdmFyIElTX09QICA9IGl0ID09PSBPYmplY3RQcm90b1xuICAgICwgbmFtZXMgID0gZ09QTihJU19PUCA/IE9QU3ltYm9scyA6IHRvSU9iamVjdChpdCkpXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwgaSAgICAgID0gMFxuICAgICwga2V5O1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKXtcbiAgICBpZihoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYgKElTX09QID8gaGFzKE9iamVjdFByb3RvLCBrZXkpIDogdHJ1ZSkpcmVzdWx0LnB1c2goQWxsU3ltYm9sc1trZXldKTtcbiAgfSByZXR1cm4gcmVzdWx0O1xufTtcblxuLy8gMTkuNC4xLjEgU3ltYm9sKFtkZXNjcmlwdGlvbl0pXG5pZighVVNFX05BVElWRSl7XG4gICRTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woKXtcbiAgICBpZih0aGlzIGluc3RhbmNlb2YgJFN5bWJvbCl0aHJvdyBUeXBlRXJyb3IoJ1N5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvciEnKTtcbiAgICB2YXIgdGFnID0gdWlkKGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTtcbiAgICB2YXIgJHNldCA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIGlmKHRoaXMgPT09IE9iamVjdFByb3RvKSRzZXQuY2FsbChPUFN5bWJvbHMsIHZhbHVlKTtcbiAgICAgIGlmKGhhcyh0aGlzLCBISURERU4pICYmIGhhcyh0aGlzW0hJRERFTl0sIHRhZykpdGhpc1tISURERU5dW3RhZ10gPSBmYWxzZTtcbiAgICAgIHNldFN5bWJvbERlc2ModGhpcywgdGFnLCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG4gICAgfTtcbiAgICBpZihERVNDUklQVE9SUyAmJiBzZXR0ZXIpc2V0U3ltYm9sRGVzYyhPYmplY3RQcm90bywgdGFnLCB7Y29uZmlndXJhYmxlOiB0cnVlLCBzZXQ6ICRzZXR9KTtcbiAgICByZXR1cm4gd3JhcCh0YWcpO1xuICB9O1xuICByZWRlZmluZSgkU3ltYm9sW1BST1RPVFlQRV0sICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCl7XG4gICAgcmV0dXJuIHRoaXMuX2s7XG4gIH0pO1xuXG4gICRHT1BELmYgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICAkRFAuZiAgID0gJGRlZmluZVByb3BlcnR5O1xuICByZXF1aXJlKCcuL19vYmplY3QtZ29wbicpLmYgPSBnT1BORXh0LmYgPSAkZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpLmYgID0gJHByb3BlcnR5SXNFbnVtZXJhYmxlO1xuICByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpLmYgPSAkZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuXG4gIGlmKERFU0NSSVBUT1JTICYmICFyZXF1aXJlKCcuL19saWJyYXJ5Jykpe1xuICAgIHJlZGVmaW5lKE9iamVjdFByb3RvLCAncHJvcGVydHlJc0VudW1lcmFibGUnLCAkcHJvcGVydHlJc0VudW1lcmFibGUsIHRydWUpO1xuICB9XG5cbiAgd2tzRXh0LmYgPSBmdW5jdGlvbihuYW1lKXtcbiAgICByZXR1cm4gd3JhcCh3a3MobmFtZSkpO1xuICB9XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHtTeW1ib2w6ICRTeW1ib2x9KTtcblxuZm9yKHZhciBzeW1ib2xzID0gKFxuICAvLyAxOS40LjIuMiwgMTkuNC4yLjMsIDE5LjQuMi40LCAxOS40LjIuNiwgMTkuNC4yLjgsIDE5LjQuMi45LCAxOS40LjIuMTAsIDE5LjQuMi4xMSwgMTkuNC4yLjEyLCAxOS40LjIuMTMsIDE5LjQuMi4xNFxuICAnaGFzSW5zdGFuY2UsaXNDb25jYXRTcHJlYWRhYmxlLGl0ZXJhdG9yLG1hdGNoLHJlcGxhY2Usc2VhcmNoLHNwZWNpZXMsc3BsaXQsdG9QcmltaXRpdmUsdG9TdHJpbmdUYWcsdW5zY29wYWJsZXMnXG4pLnNwbGl0KCcsJyksIGkgPSAwOyBzeW1ib2xzLmxlbmd0aCA+IGk7ICl3a3Moc3ltYm9sc1tpKytdKTtcblxuZm9yKHZhciBzeW1ib2xzID0gJGtleXMod2tzLnN0b3JlKSwgaSA9IDA7IHN5bWJvbHMubGVuZ3RoID4gaTsgKXdrc0RlZmluZShzeW1ib2xzW2krK10pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCAnU3ltYm9sJywge1xuICAvLyAxOS40LjIuMSBTeW1ib2wuZm9yKGtleSlcbiAgJ2Zvcic6IGZ1bmN0aW9uKGtleSl7XG4gICAgcmV0dXJuIGhhcyhTeW1ib2xSZWdpc3RyeSwga2V5ICs9ICcnKVxuICAgICAgPyBTeW1ib2xSZWdpc3RyeVtrZXldXG4gICAgICA6IFN5bWJvbFJlZ2lzdHJ5W2tleV0gPSAkU3ltYm9sKGtleSk7XG4gIH0sXG4gIC8vIDE5LjQuMi41IFN5bWJvbC5rZXlGb3Ioc3ltKVxuICBrZXlGb3I6IGZ1bmN0aW9uIGtleUZvcihrZXkpe1xuICAgIGlmKGlzU3ltYm9sKGtleSkpcmV0dXJuIGtleU9mKFN5bWJvbFJlZ2lzdHJ5LCBrZXkpO1xuICAgIHRocm93IFR5cGVFcnJvcihrZXkgKyAnIGlzIG5vdCBhIHN5bWJvbCEnKTtcbiAgfSxcbiAgdXNlU2V0dGVyOiBmdW5jdGlvbigpeyBzZXR0ZXIgPSB0cnVlOyB9LFxuICB1c2VTaW1wbGU6IGZ1bmN0aW9uKCl7IHNldHRlciA9IGZhbHNlOyB9XG59KTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgJ09iamVjdCcsIHtcbiAgLy8gMTkuMS4yLjIgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxuICBjcmVhdGU6ICRjcmVhdGUsXG4gIC8vIDE5LjEuMi40IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxuICBkZWZpbmVQcm9wZXJ0eTogJGRlZmluZVByb3BlcnR5LFxuICAvLyAxOS4xLjIuMyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKVxuICBkZWZpbmVQcm9wZXJ0aWVzOiAkZGVmaW5lUHJvcGVydGllcyxcbiAgLy8gMTkuMS4yLjYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIC8vIDE5LjEuMi43IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG4gIGdldE93blByb3BlcnR5TmFtZXM6ICRnZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICAvLyAxOS4xLjIuOCBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKE8pXG4gIGdldE93blByb3BlcnR5U3ltYm9sczogJGdldE93blByb3BlcnR5U3ltYm9sc1xufSk7XG5cbi8vIDI0LjMuMiBKU09OLnN0cmluZ2lmeSh2YWx1ZSBbLCByZXBsYWNlciBbLCBzcGFjZV1dKVxuJEpTT04gJiYgJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoIVVTRV9OQVRJVkUgfHwgJGZhaWxzKGZ1bmN0aW9uKCl7XG4gIHZhciBTID0gJFN5bWJvbCgpO1xuICAvLyBNUyBFZGdlIGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyB7fVxuICAvLyBXZWJLaXQgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIG51bGxcbiAgLy8gVjggdGhyb3dzIG9uIGJveGVkIHN5bWJvbHNcbiAgcmV0dXJuIF9zdHJpbmdpZnkoW1NdKSAhPSAnW251bGxdJyB8fCBfc3RyaW5naWZ5KHthOiBTfSkgIT0gJ3t9JyB8fCBfc3RyaW5naWZ5KE9iamVjdChTKSkgIT0gJ3t9Jztcbn0pKSwgJ0pTT04nLCB7XG4gIHN0cmluZ2lmeTogZnVuY3Rpb24gc3RyaW5naWZ5KGl0KXtcbiAgICBpZihpdCA9PT0gdW5kZWZpbmVkIHx8IGlzU3ltYm9sKGl0KSlyZXR1cm47IC8vIElFOCByZXR1cm5zIHN0cmluZyBvbiB1bmRlZmluZWRcbiAgICB2YXIgYXJncyA9IFtpdF1cbiAgICAgICwgaSAgICA9IDFcbiAgICAgICwgcmVwbGFjZXIsICRyZXBsYWNlcjtcbiAgICB3aGlsZShhcmd1bWVudHMubGVuZ3RoID4gaSlhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgIHJlcGxhY2VyID0gYXJnc1sxXTtcbiAgICBpZih0eXBlb2YgcmVwbGFjZXIgPT0gJ2Z1bmN0aW9uJykkcmVwbGFjZXIgPSByZXBsYWNlcjtcbiAgICBpZigkcmVwbGFjZXIgfHwgIWlzQXJyYXkocmVwbGFjZXIpKXJlcGxhY2VyID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XG4gICAgICBpZigkcmVwbGFjZXIpdmFsdWUgPSAkcmVwbGFjZXIuY2FsbCh0aGlzLCBrZXksIHZhbHVlKTtcbiAgICAgIGlmKCFpc1N5bWJvbCh2YWx1ZSkpcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gICAgYXJnc1sxXSA9IHJlcGxhY2VyO1xuICAgIHJldHVybiBfc3RyaW5naWZ5LmFwcGx5KCRKU09OLCBhcmdzKTtcbiAgfVxufSk7XG5cbi8vIDE5LjQuMy40IFN5bWJvbC5wcm90b3R5cGVbQEB0b1ByaW1pdGl2ZV0oaGludClcbiRTeW1ib2xbUFJPVE9UWVBFXVtUT19QUklNSVRJVkVdIHx8IHJlcXVpcmUoJy4vX2hpZGUnKSgkU3ltYm9sW1BST1RPVFlQRV0sIFRPX1BSSU1JVElWRSwgJFN5bWJvbFtQUk9UT1RZUEVdLnZhbHVlT2YpO1xuLy8gMTkuNC4zLjUgU3ltYm9sLnByb3RvdHlwZVtAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoJFN5bWJvbCwgJ1N5bWJvbCcpO1xuLy8gMjAuMi4xLjkgTWF0aFtAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoTWF0aCwgJ01hdGgnLCB0cnVlKTtcbi8vIDI0LjMuMyBKU09OW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZyhnbG9iYWwuSlNPTiwgJ0pTT04nLCB0cnVlKTsiLCJyZXF1aXJlKCcuL193a3MtZGVmaW5lJykoJ2FzeW5jSXRlcmF0b3InKTsiLCJyZXF1aXJlKCcuL193a3MtZGVmaW5lJykoJ29ic2VydmFibGUnKTsiLCJyZXF1aXJlKCcuL2VzNi5hcnJheS5pdGVyYXRvcicpO1xudmFyIGdsb2JhbCAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGhpZGUgICAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBJdGVyYXRvcnMgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCBUT19TVFJJTkdfVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbmZvcih2YXIgY29sbGVjdGlvbnMgPSBbJ05vZGVMaXN0JywgJ0RPTVRva2VuTGlzdCcsICdNZWRpYUxpc3QnLCAnU3R5bGVTaGVldExpc3QnLCAnQ1NTUnVsZUxpc3QnXSwgaSA9IDA7IGkgPCA1OyBpKyspe1xuICB2YXIgTkFNRSAgICAgICA9IGNvbGxlY3Rpb25zW2ldXG4gICAgLCBDb2xsZWN0aW9uID0gZ2xvYmFsW05BTUVdXG4gICAgLCBwcm90byAgICAgID0gQ29sbGVjdGlvbiAmJiBDb2xsZWN0aW9uLnByb3RvdHlwZTtcbiAgaWYocHJvdG8gJiYgIXByb3RvW1RPX1NUUklOR19UQUddKWhpZGUocHJvdG8sIFRPX1NUUklOR19UQUcsIE5BTUUpO1xuICBJdGVyYXRvcnNbTkFNRV0gPSBJdGVyYXRvcnMuQXJyYXk7XG59Il19
