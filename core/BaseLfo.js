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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2VMZm8uanMiXSwibmFtZXMiOlsiaWQiLCJCYXNlTGZvIiwiZGVmaW5pdGlvbnMiLCJvcHRpb25zIiwiY2lkIiwicGFyYW1zIiwiYWRkTGlzdGVuZXIiLCJvblBhcmFtVXBkYXRlIiwiYmluZCIsInN0cmVhbVBhcmFtcyIsImZyYW1lVHlwZSIsImZyYW1lU2l6ZSIsImZyYW1lUmF0ZSIsImRlc2NyaXB0aW9uIiwic291cmNlU2FtcGxlUmF0ZSIsInNvdXJjZVNhbXBsZUNvdW50IiwiZnJhbWUiLCJ0aW1lIiwiZGF0YSIsIm1ldGFkYXRhIiwibmV4dE1vZHVsZXMiLCJwcmV2TW9kdWxlIiwiX3JlaW5pdCIsImdldERlZmluaXRpb25zIiwicmVzZXQiLCJuYW1lIiwidmFsdWUiLCJtZXRhcyIsImtpbmQiLCJuZXh0IiwiRXJyb3IiLCJpbml0TW9kdWxlIiwidGhlbiIsInByb2Nlc3NTdHJlYW1QYXJhbXMiLCJwdXNoIiwiZm9yRWFjaCIsImRpc2Nvbm5lY3QiLCJpbmRleCIsImluZGV4T2YiLCJzcGxpY2UiLCJsZW5ndGgiLCJkZXN0cm95IiwibmV4dFByb21pc2VzIiwibWFwIiwibW9kdWxlIiwiYWxsIiwicmVzZXRTdHJlYW0iLCJpIiwibCIsImVuZFRpbWUiLCJmaW5hbGl6ZVN0cmVhbSIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwicHJldkZyYW1lVHlwZSIsInByb2Nlc3NTY2FsYXIiLCJwcm9jZXNzRnVuY3Rpb24iLCJwcm9jZXNzVmVjdG9yIiwicHJvY2Vzc1NpZ25hbCIsImNvbnN0cnVjdG9yIiwiRmxvYXQzMkFycmF5IiwicHJlcGFyZUZyYW1lIiwicHJvcGFnYXRlRnJhbWUiLCJpbml0U3RyZWFtIiwicHJvY2Vzc0ZyYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBLElBQUlBLEtBQUssQ0FBVDs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXVGTUMsTztBQUNKLHFCQUE0QztBQUFBLFFBQWhDQyxXQUFnQyx1RUFBbEIsRUFBa0I7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFDMUMsU0FBS0MsR0FBTCxHQUFXSixJQUFYOztBQUVBOzs7Ozs7OztBQVFBLFNBQUtLLE1BQUwsR0FBYywwQkFBV0gsV0FBWCxFQUF3QkMsT0FBeEIsQ0FBZDtBQUNBO0FBQ0EsU0FBS0UsTUFBTCxDQUFZQyxXQUFaLENBQXdCLEtBQUtDLGFBQUwsQ0FBbUJDLElBQW5CLENBQXdCLElBQXhCLENBQXhCOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkEsU0FBS0MsWUFBTCxHQUFvQjtBQUNsQkMsaUJBQVcsSUFETztBQUVsQkMsaUJBQVcsQ0FGTztBQUdsQkMsaUJBQVcsQ0FITztBQUlsQkMsbUJBQWEsSUFKSztBQUtsQkMsd0JBQWtCLENBTEE7QUFNbEJDLHlCQUFtQjtBQU5ELEtBQXBCOztBQVNBOzs7Ozs7Ozs7Ozs7QUFZQSxTQUFLQyxLQUFMLEdBQWE7QUFDWEMsWUFBTSxDQURLO0FBRVhDLFlBQU0sSUFGSztBQUdYQyxnQkFBVTtBQUhDLEtBQWI7O0FBTUE7Ozs7Ozs7Ozs7O0FBV0EsU0FBS0MsV0FBTCxHQUFtQixFQUFuQjs7QUFFQTs7Ozs7Ozs7OztBQVVBLFNBQUtDLFVBQUwsR0FBa0IsSUFBbEI7O0FBRUE7Ozs7Ozs7Ozs7O0FBV0EsU0FBS0MsT0FBTCxHQUFlLEtBQWY7QUFDRDs7QUFFRDs7Ozs7Ozs7OzJDQUt1QjtBQUNyQixhQUFPLEtBQUtqQixNQUFMLENBQVlrQixjQUFaLEVBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7a0NBS2M7QUFDWixXQUFLbEIsTUFBTCxDQUFZbUIsS0FBWjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7a0NBU2NDLEksRUFBTUMsSyxFQUFtQjtBQUFBLFVBQVpDLEtBQVksdUVBQUosRUFBSTs7QUFDckMsVUFBSUEsTUFBTUMsSUFBTixLQUFlLFFBQW5CLEVBQ0UsS0FBS04sT0FBTCxHQUFlLElBQWY7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7OzRCQVNRTyxJLEVBQU07QUFBQTs7QUFDWixVQUFJLEVBQUVBLGdCQUFnQjVCLE9BQWxCLENBQUosRUFDRSxNQUFNLElBQUk2QixLQUFKLENBQVUsZ0VBQVYsQ0FBTjs7QUFFRixVQUFJLEtBQUtyQixZQUFMLEtBQXNCLElBQXRCLElBQTZCb0IsS0FBS3BCLFlBQUwsS0FBc0IsSUFBdkQsRUFDRSxNQUFNLElBQUlxQixLQUFKLENBQVUsZ0RBQVYsQ0FBTjs7QUFFRixVQUFJLEtBQUtyQixZQUFMLENBQWtCQyxTQUFsQixLQUFnQyxJQUFwQyxFQUEwQztBQUFFO0FBQzFDO0FBQ0FtQixhQUFLRSxVQUFMLEdBQWtCQyxJQUFsQixDQUF1QixZQUFNO0FBQzNCSCxlQUFLSSxtQkFBTCxDQUF5QixNQUFLeEIsWUFBOUI7QUFDQTtBQUNBLGdCQUFLVyxXQUFMLENBQWlCYyxJQUFqQixDQUFzQkwsSUFBdEI7QUFDQUEsZUFBS1IsVUFBTDtBQUNELFNBTEQ7QUFNRCxPQVJELE1BUU87QUFDTCxhQUFLRCxXQUFMLENBQWlCYyxJQUFqQixDQUFzQkwsSUFBdEI7QUFDQUEsYUFBS1IsVUFBTCxHQUFrQixJQUFsQjtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7OztpQ0FNd0I7QUFBQTs7QUFBQSxVQUFiUSxJQUFhLHVFQUFOLElBQU07O0FBQ3RCLFVBQUlBLFNBQVMsSUFBYixFQUFtQjtBQUNqQixhQUFLVCxXQUFMLENBQWlCZSxPQUFqQixDQUF5QixVQUFDTixJQUFEO0FBQUEsaUJBQVUsT0FBS08sVUFBTCxDQUFnQlAsSUFBaEIsQ0FBVjtBQUFBLFNBQXpCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsWUFBTVEsUUFBUSxLQUFLakIsV0FBTCxDQUFpQmtCLE9BQWpCLENBQXlCLElBQXpCLENBQWQ7QUFDQSxhQUFLbEIsV0FBTCxDQUFpQm1CLE1BQWpCLENBQXdCRixLQUF4QixFQUErQixDQUEvQjtBQUNBUixhQUFLUixVQUFMLEdBQWtCLElBQWxCO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs4QkFPVTtBQUNSO0FBQ0EsVUFBSWdCLFFBQVEsS0FBS2pCLFdBQUwsQ0FBaUJvQixNQUE3Qjs7QUFFQSxhQUFPSCxPQUFQO0FBQ0UsYUFBS2pCLFdBQUwsQ0FBaUJpQixLQUFqQixFQUF3QkksT0FBeEI7QUFERixPQUpRLENBT1I7QUFDQSxVQUFJLEtBQUtwQixVQUFULEVBQ0UsS0FBS0EsVUFBTCxDQUFnQmUsVUFBaEIsQ0FBMkIsSUFBM0I7O0FBRUY7QUFDQSxXQUFLM0IsWUFBTCxHQUFvQixJQUFwQjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O2lDQWdCYTtBQUNYLFVBQU1pQyxlQUFlLEtBQUt0QixXQUFMLENBQWlCdUIsR0FBakIsQ0FBcUIsVUFBQ0MsTUFBRCxFQUFZO0FBQ3BELGVBQU9BLE9BQU9iLFVBQVAsRUFBUDtBQUNELE9BRm9CLENBQXJCOztBQUlBLGFBQU8sa0JBQVFjLEdBQVIsQ0FBWUgsWUFBWixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7O2lDQVE4QjtBQUFBLFVBQW5CakMsWUFBbUIsdUVBQUosRUFBSTs7QUFDNUIsV0FBS3dCLG1CQUFMLENBQXlCeEIsWUFBekI7QUFDQSxXQUFLcUMsV0FBTDtBQUNEOztBQUVEOzs7Ozs7Ozs7O2tDQU9jO0FBQ1o7QUFDQSxXQUFLLElBQUlDLElBQUksQ0FBUixFQUFXQyxJQUFJLEtBQUs1QixXQUFMLENBQWlCb0IsTUFBckMsRUFBNkNPLElBQUlDLENBQWpELEVBQW9ERCxHQUFwRDtBQUNFLGFBQUszQixXQUFMLENBQWlCMkIsQ0FBakIsRUFBb0JELFdBQXBCO0FBREYsT0FGWSxDQUtaO0FBQ0E7QUFDQSxVQUFJLEtBQUtyQyxZQUFMLENBQWtCQyxTQUFsQixLQUFnQyxRQUFoQyxJQUE0QyxLQUFLTSxLQUFMLENBQVdFLElBQVgsS0FBb0IsSUFBcEUsRUFBMEU7QUFDeEUsWUFBTVAsWUFBWSxLQUFLRixZQUFMLENBQWtCRSxTQUFwQztBQUNBLFlBQU1PLE9BQU8sS0FBS0YsS0FBTCxDQUFXRSxJQUF4Qjs7QUFFQSxhQUFLLElBQUk2QixLQUFJLENBQWIsRUFBZ0JBLEtBQUlwQyxTQUFwQixFQUErQm9DLElBQS9CO0FBQ0U3QixlQUFLNkIsRUFBTCxJQUFVLENBQVY7QUFERjtBQUVEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7OzttQ0FNZUUsTyxFQUFTO0FBQ3RCLFdBQUssSUFBSUYsSUFBSSxDQUFSLEVBQVdDLElBQUksS0FBSzVCLFdBQUwsQ0FBaUJvQixNQUFyQyxFQUE2Q08sSUFBSUMsQ0FBakQsRUFBb0RELEdBQXBEO0FBQ0UsYUFBSzNCLFdBQUwsQ0FBaUIyQixDQUFqQixFQUFvQkcsY0FBcEIsQ0FBbUNELE9BQW5DO0FBREY7QUFFRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MENBaUIyQztBQUFBLFVBQXZCRSxnQkFBdUIsdUVBQUosRUFBSTs7QUFDekMsV0FBS0MsbUJBQUwsQ0FBeUJELGdCQUF6QjtBQUNBLFdBQUtFLHFCQUFMO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzBDQWlCMkM7QUFBQSxVQUF2QkYsZ0JBQXVCLHVFQUFKLEVBQUk7O0FBQ3pDLDRCQUFjLEtBQUsxQyxZQUFuQixFQUFpQzBDLGdCQUFqQztBQUNBLFVBQU1HLGdCQUFnQkgsaUJBQWlCekMsU0FBdkM7O0FBRUEsY0FBUTRDLGFBQVI7QUFDRSxhQUFLLFFBQUw7QUFDRSxjQUFJLEtBQUtDLGFBQVQsRUFDRSxLQUFLQyxlQUFMLEdBQXVCLEtBQUtELGFBQTVCLENBREYsS0FFSyxJQUFJLEtBQUtFLGFBQVQsRUFDSCxLQUFLRCxlQUFMLEdBQXVCLEtBQUtDLGFBQTVCLENBREcsS0FFQSxJQUFJLEtBQUtDLGFBQVQsRUFDSCxLQUFLRixlQUFMLEdBQXVCLEtBQUtFLGFBQTVCLENBREcsS0FHSCxNQUFNLElBQUk1QixLQUFKLENBQWEsS0FBSzZCLFdBQUwsQ0FBaUJsQyxJQUE5QixvQ0FBTjtBQUNGO0FBQ0YsYUFBSyxRQUFMO0FBQ0UsY0FBSSxFQUFFLG1CQUFtQixJQUFyQixDQUFKLEVBQ0UsTUFBTSxJQUFJSyxLQUFKLENBQWEsS0FBSzZCLFdBQUwsQ0FBaUJsQyxJQUE5Qix1Q0FBTjs7QUFFRixlQUFLK0IsZUFBTCxHQUF1QixLQUFLQyxhQUE1QjtBQUNBO0FBQ0YsYUFBSyxRQUFMO0FBQ0UsY0FBSSxFQUFFLG1CQUFtQixJQUFyQixDQUFKLEVBQ0UsTUFBTSxJQUFJM0IsS0FBSixDQUFhLEtBQUs2QixXQUFMLENBQWlCbEMsSUFBOUIsdUNBQU47O0FBRUYsZUFBSytCLGVBQUwsR0FBdUIsS0FBS0UsYUFBNUI7QUFDQTtBQUNGO0FBQ0U7QUFDQTtBQXpCSjtBQTJCRDs7QUFFRDs7Ozs7Ozs7Ozs7NENBUXdCO0FBQ3RCLFdBQUsxQyxLQUFMLENBQVdFLElBQVgsR0FBa0IsSUFBSTBDLFlBQUosQ0FBaUIsS0FBS25ELFlBQUwsQ0FBa0JFLFNBQW5DLENBQWxCOztBQUVBLFdBQUssSUFBSW9DLElBQUksQ0FBUixFQUFXQyxJQUFJLEtBQUs1QixXQUFMLENBQWlCb0IsTUFBckMsRUFBNkNPLElBQUlDLENBQWpELEVBQW9ERCxHQUFwRDtBQUNFLGFBQUszQixXQUFMLENBQWlCMkIsQ0FBakIsRUFBb0JkLG1CQUFwQixDQUF3QyxLQUFLeEIsWUFBN0M7QUFERjtBQUVEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7O2lDQWFhTyxLLEVBQU87QUFDbEIsV0FBSzZDLFlBQUw7O0FBRUE7QUFDQSxXQUFLN0MsS0FBTCxDQUFXQyxJQUFYLEdBQWtCRCxNQUFNQyxJQUF4QjtBQUNBLFdBQUtELEtBQUwsQ0FBV0csUUFBWCxHQUFzQkgsTUFBTUcsUUFBNUI7O0FBRUEsV0FBS3FDLGVBQUwsQ0FBcUJ4QyxLQUFyQjtBQUNBLFdBQUs4QyxjQUFMO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7O29DQVFnQjlDLEssRUFBTztBQUNyQixXQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFDRDs7QUFFRDs7Ozs7Ozs7bUNBS2U7QUFDYixVQUFJLEtBQUtNLE9BQUwsS0FBaUIsSUFBckIsRUFBMkI7QUFDekIsWUFBTWIsZUFBZSxLQUFLWSxVQUFMLEtBQW9CLElBQXBCLEdBQTJCLEtBQUtBLFVBQUwsQ0FBZ0JaLFlBQTNDLEdBQTBELEVBQS9FO0FBQ0EsYUFBS3NELFVBQUwsQ0FBZ0J0RCxZQUFoQjtBQUNBLGFBQUthLE9BQUwsR0FBZSxLQUFmO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7O3FDQU1pQjtBQUNmLFdBQUssSUFBSXlCLElBQUksQ0FBUixFQUFXQyxJQUFJLEtBQUs1QixXQUFMLENBQWlCb0IsTUFBckMsRUFBNkNPLElBQUlDLENBQWpELEVBQW9ERCxHQUFwRDtBQUNFLGFBQUszQixXQUFMLENBQWlCMkIsQ0FBakIsRUFBb0JpQixZQUFwQixDQUFpQyxLQUFLaEQsS0FBdEM7QUFERjtBQUVEOzs7OztrQkFHWWYsTyIsImZpbGUiOiJCYXNlTGZvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhcmFtZXRlcnMgZnJvbSAncGFyYW1ldGVycyc7XG5cbmxldCBpZCA9IDA7XG5cbi8qKlxuICogQmFzZSBgbGZvYCBjbGFzcyB0byBiZSBleHRlbmRlZCBpbiBvcmRlciB0byBjcmVhdGUgbmV3IG5vZGVzLlxuICpcbiAqIE5vZGVzIGFyZSBkaXZpZGVkIGluIDMgY2F0ZWdvcmllczpcbiAqIC0gKipgc291cmNlYCoqIGFyZSByZXNwb25zaWJsZSBmb3IgYWNxdWVyaW5nIGEgc2lnbmFsIGFuZCBpdHMgcHJvcGVydGllc1xuICogICAoZnJhbWVSYXRlLCBmcmFtZVNpemUsIGV0Yy4pXG4gKiAtICoqYHNpbmtgKiogYXJlIGVuZHBvaW50cyBvZiB0aGUgZ3JhcGgsIHN1Y2ggbm9kZXMgY2FuIGJlIHJlY29yZGVycyxcbiAqICAgdmlzdWFsaXplcnMsIGV0Yy5cbiAqIC0gKipgb3BlcmF0b3JgKiogYXJlIHVzZWQgdG8gbWFrZSBjb21wdXRhdGlvbiBvbiB0aGUgaW5wdXQgc2lnbmFsIGFuZFxuICogICBmb3J3YXJkIHRoZSByZXN1bHRzIGJlbG93IGluIHRoZSBncmFwaC5cbiAqXG4gKiBJbiBtb3N0IGNhc2VzIHRoZSBtZXRob2RzIHRvIG92ZXJyaWRlIC8gZXh0ZW5kIGFyZTpcbiAqIC0gdGhlICoqYGNvbnN0cnVjdG9yYCoqIHRvIGRlZmluZSB0aGUgcGFyYW1ldGVycyBvZiB0aGUgbmV3IGxmbyBub2RlLlxuICogLSB0aGUgKipgcHJvY2Vzc1N0cmVhbVBhcmFtc2AqKiBtZXRob2QgdG8gZGVmaW5lIGhvdyB0aGUgbm9kZSBtb2RpZnkgdGhlXG4gKiAgIHN0cmVhbSBhdHRyaWJ1dGVzIChlLmcuIGJ5IGNoYW5naW5nIHRoZSBmcmFtZSBzaXplKVxuICogLSB0aGUgKipgcHJvY2Vzc3tGcmFtZVR5cGV9YCoqIG1ldGhvZCB0byBkZWZpbmUgdGhlIG9wZXJhdGlvbnMgdGhhdCB0aGVcbiAqICAgbm9kZSBhcHBseSBvbiB0aGUgc3RyZWFtLiBUaGUgdHlwZSBvZiBpbnB1dCBhIG5vZGUgY2FuIGhhbmRsZSBpcyBkZWZpbmVkXG4gKiAgIGJ5IGl0cyBpbXBsZW1lbnRlZCBpbnRlcmZhY2UsIGlmIGl0IGltcGxlbWVudHMgYHByb2Nlc3NTaWduYWxgLCBhIHN0cmVhbVxuICogICBvZiB0eXBlIGBzaWduYWxgIGNhbiBiZSBwcm9jZXNzZWQsIGBwcm9jZXNzVmVjdG9yYCB0byBoYW5kbGVcbiAqICAgYW4gaW5wdXQgb2YgdHlwZSBgdmVjdG9yYC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fVGhpcyBjbGFzcyBzaG91bGQgYmUgY29uc2lkZXJlZCBhYnN0cmFjdCBhbmQgb25seVxuICogYmUgdXNlZCBhcyBhIGJhc2UgY2xhc3MgdG8gZXh0ZW5kLl88L3NwYW4+XG4gKlxuICogIyMjIyBvdmVydmlldyBvZiB0aGUgaW50ZXJmYWNlXG4gKlxuICogKippbml0TW9kdWxlKipcbiAqXG4gKiBSZXR1cm5zIGEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIG1vZHVsZSBpcyBpbml0aWFsaXplZC4gSXNcbiAqIGVzcGVjaWFsbHkgaW1wb3J0YW50IGZvciBtb2R1bGVzIHRoYXQgcmVseSBvbiBhc3luY2hyb25vdXMgdW5kZXJseWluZyBBUElzLlxuICpcbiAqICoqcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSoqXG4gKlxuICogYGJhc2VgIGNsYXNzIChkZWZhdWx0IGltcGxlbWVudGF0aW9uKVxuICogLSBjYWxsIGBwcmVwYXJlU3RyZWFtUGFyYW1zYFxuICogLSBjYWxsIGBwcm9wYWdhdGVTdHJlYW1QYXJhbXNgXG4gKlxuICogYGNoaWxkYCBjbGFzc1xuICogLSBvdmVycmlkZSBzb21lIG9mIHRoZSBpbmhlcml0ZWQgYHN0cmVhbVBhcmFtc2BcbiAqIC0gY3JlYXRlcyB0aGUgYW55IHJlbGF0ZWQgbG9naWMgYnVmZmVyc1xuICogLSBjYWxsIGBwcm9wYWdhdGVTdHJlYW1QYXJhbXNgXG4gKlxuICogX3Nob3VsZCBub3QgY2FsbCBgc3VwZXIucHJvY2Vzc1N0cmVhbVBhcmFtc2BfXG4gKlxuICogKipwcmVwYXJlU3RyZWFtUGFyYW1zKCkqKlxuICpcbiAqIC0gYXNzaWduIHByZXZTdHJlYW1QYXJhbXMgdG8gdGhpcy5zdHJlYW1QYXJhbXNcbiAqIC0gY2hlY2sgaWYgdGhlIGNsYXNzIGltcGxlbWVudHMgdGhlIGNvcnJlY3QgYHByb2Nlc3NJbnB1dGAgbWV0aG9kXG4gKlxuICogX3Nob3VsZG4ndCBiZSBleHRlbmRlZCwgb25seSBjb25zdW1lZCBpbiBgcHJvY2Vzc1N0cmVhbVBhcmFtc2BfXG4gKlxuICogKipwcm9wYWdhdGVTdHJlYW1QYXJhbXMoKSoqXG4gKlxuICogLSBjcmVhdGVzIHRoZSBgZnJhbWVEYXRhYCBidWZmZXJcbiAqIC0gcHJvcGFnYXRlIGBzdHJlYW1QYXJhbXNgIHRvIGNoaWxkcmVuXG4gKlxuICogX3Nob3VsZG4ndCBiZSBleHRlbmRlZCwgb25seSBjb25zdW1lZCBpbiBgcHJvY2Vzc1N0cmVhbVBhcmFtc2BfXG4gKlxuICogKipwcm9jZXNzRnJhbWUoKSoqXG4gKlxuICogYGJhc2VgIGNsYXNzIChkZWZhdWx0IGltcGxlbWVudGF0aW9uKVxuICogLSBjYWxsIGBwcmVwYXJlRnJhbWVgXG4gKiAtIGFzc2lnbiBmcmFtZVRpbWUgYW5kIGZyYW1lTWV0YWRhdGEgdG8gaWRlbnRpdHlcbiAqIC0gY2FsbCB0aGUgcHJvcGVyIGZ1bmN0aW9uIGFjY29yZGluZyB0byBpbnB1dFR5cGVcbiAqIC0gY2FsbCBgcHJvcGFnYXRlRnJhbWVgXG4gKlxuICogYGNoaWxkYCBjbGFzc1xuICogLSBjYWxsIGBwcmVwYXJlRnJhbWVgXG4gKiAtIGRvIHdoYXRldmVyIHlvdSB3YW50IHdpdGggaW5jb21taW5nIGZyYW1lXG4gKiAtIGNhbGwgYHByb3BhZ2F0ZUZyYW1lYFxuICpcbiAqIF9zaG91bGQgbm90IGNhbGwgYHN1cGVyLnByb2Nlc3NGcmFtZWBfXG4gKlxuICogKipwcmVwYXJlRnJhbWUoKSoqXG4gKlxuICogLSBpZiBgcmVpbml0YCBhbmQgdHJpZ2dlciBgcHJvY2Vzc1N0cmVhbVBhcmFtc2AgaWYgbmVlZGVkXG4gKlxuICogX3Nob3VsZG4ndCBiZSBleHRlbmRlZCwgb25seSBjb25zdW1lZCBpbiBgcHJvY2Vzc0ZyYW1lYF9cbiAqXG4gKiAqKnByb3BhZ2F0ZUZyYW1lKCkqKlxuICpcbiAqIC0gcHJvcGFnYXRlIGZyYW1lIHRvIGNoaWxkcmVuXG4gKlxuICogX3Nob3VsZG4ndCBiZSBleHRlbmRlZCwgb25seSBjb25zdW1lZCBpbiBgcHJvY2Vzc0ZyYW1lYF9cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvcmVcbiAqL1xuY2xhc3MgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKGRlZmluaXRpb25zID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuY2lkID0gaWQrKztcblxuICAgIC8qKlxuICAgICAqIFBhcmFtZXRlciBiYWcgY29udGFpbmluZyBwYXJhbWV0ZXIgaW5zdGFuY2VzLlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAbmFtZSBwYXJhbXNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm9cbiAgICAgKi9cbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtZXRlcnMoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuICAgIC8vIGxpc3RlbiBmb3IgcGFyYW0gdXBkYXRlc1xuICAgIHRoaXMucGFyYW1zLmFkZExpc3RlbmVyKHRoaXMub25QYXJhbVVwZGF0ZS5iaW5kKHRoaXMpKTtcblxuICAgIC8qKlxuICAgICAqIERlc2NyaXB0aW9uIG9mIHRoZSBzdHJlYW0gb3V0cHV0IG9mIHRoZSBub2RlLlxuICAgICAqIFNldCB0byBgbnVsbGAgd2hlbiB0aGUgbm9kZSBpcyBkZXN0cm95ZWQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBmcmFtZVNpemUgLSBGcmFtZSBzaXplIGF0IHRoZSBvdXRwdXQgb2YgdGhlIG5vZGUuXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGZyYW1lUmF0ZSAtIEZyYW1lIHJhdGUgYXQgdGhlIG91dHB1dCBvZiB0aGUgbm9kZS5cbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gZnJhbWVUeXBlIC0gRnJhbWUgdHlwZSBhdCB0aGUgb3V0cHV0IG9mIHRoZSBub2RlLFxuICAgICAqICBwb3NzaWJsZSB2YWx1ZXMgYXJlIGBzaWduYWxgLCBgdmVjdG9yYCBvciBgc2NhbGFyYC5cbiAgICAgKiBAcHJvcGVydHkge0FycmF5fFN0cmluZ30gZGVzY3JpcHRpb24gLSBJZiB0eXBlIGlzIGB2ZWN0b3JgLCBkZXNjcmliZVxuICAgICAqICB0aGUgZGltZW5zaW9uKHMpIG9mIG91dHB1dCBzdHJlYW0uXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHNvdXJjZVNhbXBsZVJhdGUgLSBTYW1wbGUgcmF0ZSBvZiB0aGUgc291cmNlIG9mIHRoZVxuICAgICAqICBncmFwaC4gX1RoZSB2YWx1ZSBzaG91bGQgYmUgZGVmaW5lZCBieSBzb3VyY2VzIGFuZCBuZXZlciBtb2RpZmllZF8uXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHNvdXJjZVNhbXBsZUNvdW50IC0gTnVtYmVyIG9mIGNvbnNlY3V0aXZlIGRpc2NyZXRlXG4gICAgICogIHRpbWUgdmFsdWVzIGNvbnRhaW5lZCBpbiB0aGUgZGF0YSBmcmFtZSBvdXRwdXQgYnkgdGhlIHNvdXJjZS5cbiAgICAgKiAgX1RoZSB2YWx1ZSBzaG91bGQgYmUgZGVmaW5lZCBieSBzb3VyY2VzIGFuZCBuZXZlciBtb2RpZmllZF8uXG4gICAgICpcbiAgICAgKiBAbmFtZSBzdHJlYW1QYXJhbXNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm9cbiAgICAgKi9cbiAgICB0aGlzLnN0cmVhbVBhcmFtcyA9IHtcbiAgICAgIGZyYW1lVHlwZTogbnVsbCxcbiAgICAgIGZyYW1lU2l6ZTogMSxcbiAgICAgIGZyYW1lUmF0ZTogMCxcbiAgICAgIGRlc2NyaXB0aW9uOiBudWxsLFxuICAgICAgc291cmNlU2FtcGxlUmF0ZTogMCxcbiAgICAgIHNvdXJjZVNhbXBsZUNvdW50OiBudWxsLFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDdXJyZW50IGZyYW1lLiBUaGlzIG9iamVjdCBhbmQgaXRzIGRhdGEgYXJlIHVwZGF0ZWQgYXQgZWFjaCBpbmNvbW1pbmdcbiAgICAgKiBmcmFtZSB3aXRob3V0IHJlYWxsb2NhdGluZyBtZW1vcnkuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBuYW1lIGZyYW1lXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHRpbWUgLSBUaW1lIG9mIHRoZSBjdXJyZW50IGZyYW1lLlxuICAgICAqIEBwcm9wZXJ0eSB7RmxvYXQzMkFycmF5fSBkYXRhIC0gRGF0YSBvZiB0aGUgY3VycmVudCBmcmFtZS5cbiAgICAgKiBAcHJvcGVydHkge09iamVjdH0gbWV0YWRhdGEgLSBNZXRhZGF0YSBhc3NvY2l0ZWQgdG8gdGhlIGN1cnJlbnQgZnJhbWUuXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvXG4gICAgICovXG4gICAgdGhpcy5mcmFtZSA9IHtcbiAgICAgIHRpbWU6IDAsXG4gICAgICBkYXRhOiBudWxsLFxuICAgICAgbWV0YWRhdGE6IHt9LFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIG5vZGVzIGNvbm5lY3RlZCB0byB0aGUgb3VwdXQgb2YgdGhlIG5vZGUgKGxvd2VyIGluIHRoZSBncmFwaCkuXG4gICAgICogQXQgZWFjaCBmcmFtZSwgdGhlIG5vZGUgZm9yd2FyZCBpdHMgYGZyYW1lYCB0byB0byBhbGwgaXRzIGBuZXh0TW9kdWxlc2AuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7QXJyYXk8QmFzZUxmbz59XG4gICAgICogQG5hbWUgbmV4dE1vZHVsZXNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm9cbiAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNjb25uZWN0fVxuICAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Rpc2Nvbm5lY3R9XG4gICAgICovXG4gICAgdGhpcy5uZXh0TW9kdWxlcyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5vZGUgZnJvbSB3aGljaCB0aGUgbm9kZSByZWNlaXZlIHRoZSBmcmFtZXMgKHVwcGVyIGluIHRoZSBncmFwaCkuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7QmFzZUxmb31cbiAgICAgKiBAbmFtZSBwcmV2TW9kdWxlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvXG4gICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jY29ubmVjdH1cbiAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNkaXNjb25uZWN0fVxuICAgICAqL1xuICAgIHRoaXMucHJldk1vZHVsZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBJcyBzZXQgdG8gdHJ1ZSB3aGVuIGEgc3RhdGljIHBhcmFtZXRlciBpcyB1cGRhdGVkLiBPbiB0aGUgbmV4dCBpbnB1dFxuICAgICAqIGZyYW1lIGFsbCB0aGUgc3ViZ3JhcGggc3RyZWFtUGFyYW1zIHN0YXJ0aW5nIGZyb20gdGhpcyBub2RlIHdpbGwgYmVcbiAgICAgKiB1cGRhdGVkLlxuICAgICAqXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG5hbWUgX3JlaW5pdFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fcmVpbml0ID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBvYmplY3QgZGVzY3JpYmluZyBlYWNoIGF2YWlsYWJsZSBwYXJhbWV0ZXIgb2YgdGhlIG5vZGUuXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIGdldFBhcmFtc0Rlc2NyaXB0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy5nZXREZWZpbml0aW9ucygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IGFsbCBwYXJhbWV0ZXJzIHRvIHRoZWlyIGluaXRpYWwgdmFsdWUgKGFzIGRlZmluZWQgb24gaW5zdGFudGljYXRpb24pXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3N0cmVhbVBhcmFtc31cbiAgICovXG4gIHJlc2V0UGFyYW1zKCkge1xuICAgIHRoaXMucGFyYW1zLnJlc2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogRnVuY3Rpb24gY2FsbGVkIHdoZW4gYSBwYXJhbSBpcyB1cGRhdGVkLiBCeSBkZWZhdWx0IHNldCB0aGUgYF9yZWluaXRgXG4gICAqIGZsYWcgdG8gYHRydWVgIGlmIHRoZSBwYXJhbSBpcyBgc3RhdGljYCBvbmUuIFRoaXMgbWV0aG9kIHNob3VsZCBiZVxuICAgKiBleHRlbmRlZCB0byBoYW5kbGUgcGFydGljdWxhciBsb2dpYyBib3VuZCB0byBhIHNwZWNpZmljIHBhcmFtZXRlci5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIC0gVmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG1ldGFzIC0gTWV0YWRhdGEgYXNzb2NpYXRlZCB0byB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMgPSB7fSkge1xuICAgIGlmIChtZXRhcy5raW5kID09PSAnc3RhdGljJylcbiAgICAgIHRoaXMuX3JlaW5pdCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ29ubmVjdCB0aGUgY3VycmVudCBub2RlIChgcHJldk1vZHVsZWApIHRvIGFub3RoZXIgbm9kZSAoYG5leHRPcGApLlxuICAgKiBBIGdpdmVuIG5vZGUgY2FuIGJlIGNvbm5lY3RlZCB0byBzZXZlcmFsIG9wZXJhdG9ycyBhbmQgcHJvcGFnYXRlIGZyYW1lc1xuICAgKiB0byBlYWNoIG9mIHRoZW0uXG4gICAqXG4gICAqIEBwYXJhbSB7QmFzZUxmb30gbmV4dCAtIE5leHQgb3BlcmF0b3IgaW4gdGhlIGdyYXBoLlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzRnJhbWV9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Rpc2Nvbm5lY3R9XG4gICAqL1xuICBjb25uZWN0KG5leHQpIHtcbiAgICBpZiAoIShuZXh0IGluc3RhbmNlb2YgQmFzZUxmbykpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29ubmVjdGlvbjogY2hpbGQgbm9kZSBpcyBub3QgYW4gaW5zdGFuY2Ugb2YgYEJhc2VMZm9gJyk7XG5cbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMgPT09IG51bGwgfHxuZXh0LnN0cmVhbVBhcmFtcyA9PT0gbnVsbClcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb25uZWN0aW9uOiBjYW5ub3QgY29ubmVjdCBhIGRlYWQgbm9kZScpO1xuXG4gICAgaWYgKHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSAhPT0gbnVsbCkgeyAvLyBncmFwaCBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWRcbiAgICAgIC8vIG5leHQucHJvY2Vzc1N0cmVhbVBhcmFtcyh0aGlzLnN0cmVhbVBhcmFtcyk7XG4gICAgICBuZXh0LmluaXRNb2R1bGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgbmV4dC5wcm9jZXNzU3RyZWFtUGFyYW1zKHRoaXMuc3RyZWFtUGFyYW1zKTtcbiAgICAgICAgLy8gd2UgY2FuIGZvcndhcmQgZnJhbWUgZnJvbSBub3dcbiAgICAgICAgdGhpcy5uZXh0TW9kdWxlcy5wdXNoKG5leHQpO1xuICAgICAgICBuZXh0LnByZXZNb2R1bGUgPSB0aGlzO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubmV4dE1vZHVsZXMucHVzaChuZXh0KTtcbiAgICAgIG5leHQucHJldk1vZHVsZSA9IHRoaXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgZ2l2ZW4gb3BlcmF0b3IgZnJvbSBpdHMgcHJldmlvdXMgb3BlcmF0b3JzJyBgbmV4dE1vZHVsZXNgLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jhc2VMZm99IFtuZXh0PW51bGxdIC0gVGhlIG9wZXJhdG9yIHRvIGRpc2Nvbm5lY3QgZnJvbSB0aGUgY3VycmVudFxuICAgKiAgb3BlcmF0b3IuIElmIGBudWxsYCBkaXNjb25uZWN0IGFsbCB0aGUgbmV4dCBvcGVyYXRvcnMuXG4gICAqL1xuICBkaXNjb25uZWN0KG5leHQgPSBudWxsKSB7XG4gICAgaWYgKG5leHQgPT09IG51bGwpIHtcbiAgICAgIHRoaXMubmV4dE1vZHVsZXMuZm9yRWFjaCgobmV4dCkgPT4gdGhpcy5kaXNjb25uZWN0KG5leHQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLm5leHRNb2R1bGVzLmluZGV4T2YodGhpcyk7XG4gICAgICB0aGlzLm5leHRNb2R1bGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICBuZXh0LnByZXZNb2R1bGUgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IGFsbCB0aGUgbm9kZXMgaW4gdGhlIHN1Yi1ncmFwaCBzdGFydGluZyBmcm9tIHRoZSBjdXJyZW50IG5vZGUuXG4gICAqIFdoZW4gZGV0cm95ZWQsIHRoZSBgc3RyZWFtUGFyYW1zYCBvZiB0aGUgbm9kZSBhcmUgc2V0IHRvIGBudWxsYCwgdGhlXG4gICAqIG9wZXJhdG9yIGlzIHRoZW4gY29uc2lkZXJlZCBhcyBgZGVhZGAgYW5kIGNhbm5vdCBiZSByZWNvbm5lY3RlZC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jY29ubmVjdH1cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gZGVzdHJveSBhbGwgY2hpZHJlblxuICAgIGxldCBpbmRleCA9IHRoaXMubmV4dE1vZHVsZXMubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGluZGV4LS0pXG4gICAgICB0aGlzLm5leHRNb2R1bGVzW2luZGV4XS5kZXN0cm95KCk7XG5cbiAgICAvLyBkaXNjb25uZWN0IGl0c2VsZiBmcm9tIHRoZSBwcmV2aW91cyBvcGVyYXRvclxuICAgIGlmICh0aGlzLnByZXZNb2R1bGUpXG4gICAgICB0aGlzLnByZXZNb2R1bGUuZGlzY29ubmVjdCh0aGlzKTtcblxuICAgIC8vIG1hcmsgdGhlIG9iamVjdCBhcyBkZWFkXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIGBQcm9taXNlYCB0aGF0IHJlc29sdmUgd2hlbiB0aGUgbW9kdWxlIGlzIHJlYWR5IHRvIGJlIGNvbnN1bWVkLlxuICAgKiBTb21lIG1vZHVsZXMgcmVsaWVzIG9uIGFzeW5jaHJvbm91cyBBUElzIGF0IGluaXRpYWxpemF0aW9uIGFuZCB0aHVzIGNvdWxkXG4gICAqIGJlIG5vdCByZWFkeSB0byBiZSBjb25zdW1lZCB3aGVuIHRoZSBncmFwaCBzdGFydHMuXG4gICAqIEEgbW9kdWxlIHNob3VsZCBiZSBjb25zaWRlciBhcyBpbml0aWFsaXplZCB3aGVuIGFsbCBuZXh0IG1vZHVsZXMgKGNoaWxkcmVuKVxuICAgKiBhcmUgdGhlbXNlbHZlcyBpbml0aWFsaXplZC4gVGhlIGV2ZW50IGJ1YmJsZXMgdXAgZnJvbSBzaW5rcyB0byBzb3VyY2VzLlxuICAgKiBXaGVuIGFsbCBpdHMgbmV4dCBvcGVyYXRvcnMgYXJlIHJlYWR5LCBhIHNvdXJjZSBjYW4gY29uc2lkZXIgdGhlIHdob2xlIGdyYXBoXG4gICAqIGFzIHJlYWR5IGFuZCB0aGVuIHN0YXJ0IHRvIHByb2R1Y2UgZnJhbWVzLlxuICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiByZXNvbHZlcyB3aGVuIGFsbCBuZXh0IG9wZXJhdG9ycyBhcmUgcmVzb2x2ZWRcbiAgICogdGhlbXNlbHZlcy5cbiAgICogQW4gb3BlcmF0b3IgcmVseWluZyBvbiBleHRlcm5hbCBhc3luYyBBUEkgbXVzdCBvdmVycmlkZSB0aGlzIG1ldGhvZCB0b1xuICAgKiByZXNvbHZlIG9ubHkgd2hlbiBpdHMgZGVwZW5kZWN5IGlzIHJlYWR5LlxuICAgKlxuICAgKiBAcmV0dXJuIFByb21pc2VcbiAgICogQHRvZG8gLSBIYW5kbGUgZHluYW1pYyBjb25uZWN0aW9uc1xuICAgKi9cbiAgaW5pdE1vZHVsZSgpIHtcbiAgICBjb25zdCBuZXh0UHJvbWlzZXMgPSB0aGlzLm5leHRNb2R1bGVzLm1hcCgobW9kdWxlKSA9PiB7XG4gICAgICByZXR1cm4gbW9kdWxlLmluaXRNb2R1bGUoKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBQcm9taXNlLmFsbChuZXh0UHJvbWlzZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciB0byBpbml0aWFsaXplIHRoZSBzdHJlYW0gaW4gc3RhbmRhbG9uZSBtb2RlLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW3N0cmVhbVBhcmFtcz17fV0gLSBQYXJhbWV0ZXJzIG9mIHRoZSBzdHJlYW0uXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Jlc2V0U3RyZWFtfVxuICAgKi9cbiAgaW5pdFN0cmVhbShzdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIHRoaXMucHJvY2Vzc1N0cmVhbVBhcmFtcyhzdHJlYW1QYXJhbXMpO1xuICAgIHRoaXMucmVzZXRTdHJlYW0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgYGZyYW1lLmRhdGFgIGJ1ZmZlciBieSBzZXR0aW5nIGFsbCBpdHMgdmFsdWVzIHRvIDAuXG4gICAqIEEgc291cmNlIG9wZXJhdG9yIHNob3VsZCBjYWxsIGBwcm9jZXNzU3RyZWFtUGFyYW1zYCBhbmQgYHJlc2V0U3RyZWFtYCB3aGVuXG4gICAqIHN0YXJ0ZWQsIGVhY2ggb2YgdGhlc2UgbWV0aG9kIHByb3BhZ2F0ZSB0aHJvdWdoIHRoZSBncmFwaCBhdXRvbWF0aWNhbHkuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqL1xuICByZXNldFN0cmVhbSgpIHtcbiAgICAvLyBidXR0b20gdXBcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubmV4dE1vZHVsZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgdGhpcy5uZXh0TW9kdWxlc1tpXS5yZXNldFN0cmVhbSgpO1xuXG4gICAgLy8gbm8gYnVmZmVyIGZvciBgc2NhbGFyYCB0eXBlIG9yIHNpbmsgbm9kZVxuICAgIC8vIEBub3RlIC0gdGhpcyBzaG91bGQgYmUgcmV2aWV3ZWRcbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlICE9PSAnc2NhbGFyJyAmJiB0aGlzLmZyYW1lLmRhdGEgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspXG4gICAgICAgIGRhdGFbaV0gPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5hbGl6ZSB0aGUgc3RyZWFtLiBBIHNvdXJjZSBub2RlIHNob3VsZCBjYWxsIHRoaXMgbWV0aG9kIHdoZW4gc3RvcHBlZCxcbiAgICogYGZpbmFsaXplU3RyZWFtYCBpcyBhdXRvbWF0aWNhbGx5IHByb3BhZ2F0ZWQgdGhyb3VnaHQgdGhlIGdyYXBoLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gZW5kVGltZSAtIExvZ2ljYWwgdGltZSBhdCB3aGljaCB0aGUgZ3JhcGggaXMgc3RvcHBlZC5cbiAgICovXG4gIGZpbmFsaXplU3RyZWFtKGVuZFRpbWUpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubmV4dE1vZHVsZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgdGhpcy5uZXh0TW9kdWxlc1tpXS5maW5hbGl6ZVN0cmVhbShlbmRUaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIG9yIHVwZGF0ZSB0aGUgb3BlcmF0b3IncyBgc3RyZWFtUGFyYW1zYCBhY2NvcmRpbmcgdG8gdGhlXG4gICAqIHByZXZpb3VzIG9wZXJhdG9ycyBgc3RyZWFtUGFyYW1zYCB2YWx1ZXMuXG4gICAqXG4gICAqIFdoZW4gaW1wbGVtZW50aW5nIGEgbmV3IG9wZXJhdG9yIHRoaXMgbWV0aG9kIHNob3VsZDpcbiAgICogMS4gY2FsbCBgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zYCB3aXRoIHRoZSBnaXZlbiBgcHJldlN0cmVhbVBhcmFtc2BcbiAgICogMi4gb3B0aW9ubmFsbHkgY2hhbmdlIHZhbHVlcyB0byBgdGhpcy5zdHJlYW1QYXJhbXNgIGFjY29yZGluZyB0byB0aGVcbiAgICogICAgbG9naWMgcGVyZm9ybWVkIGJ5IHRoZSBvcGVyYXRvci5cbiAgICogMy4gb3B0aW9ubmFsbHkgYWxsb2NhdGUgbWVtb3J5IGZvciByaW5nIGJ1ZmZlcnMsIGV0Yy5cbiAgICogNC4gY2FsbCBgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXNgIHRvIHRyaWdnZXIgdGhlIG1ldGhvZCBvbiB0aGUgbmV4dFxuICAgKiAgICBvcGVyYXRvcnMgaW4gdGhlIGdyYXBoLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJldlN0cmVhbVBhcmFtcyAtIGBzdHJlYW1QYXJhbXNgIG9mIHRoZSBwcmV2aW91cyBvcGVyYXRvci5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJlcGFyZVN0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvcGFnYXRlU3RyZWFtUGFyYW1zfVxuICAgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zID0ge30pIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21tb24gbG9naWMgdG8gZG8gYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgYHByb2Nlc3NTdHJlYW1QYXJhbWAsIG11c3QgYmVcbiAgICogY2FsbGVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgYW55IGBwcm9jZXNzU3RyZWFtUGFyYW1gIGltcGxlbWVudGF0aW9uLlxuICAgKlxuICAgKiBUaGUgbWV0aG9kIG1haW5seSBjaGVjayBpZiB0aGUgY3VycmVudCBub2RlIGltcGxlbWVudCB0aGUgaW50ZXJmYWNlIHRvXG4gICAqIGhhbmRsZSB0aGUgdHlwZSBvZiBmcmFtZSBwcm9wYWdhdGVkIGJ5IGl0J3MgcGFyZW50OlxuICAgKiAtIHRvIGhhbmRsZSBhIGB2ZWN0b3JgIGZyYW1lIHR5cGUsIHRoZSBjbGFzcyBtdXN0IGltcGxlbWVudCBgcHJvY2Vzc1ZlY3RvcmBcbiAgICogLSB0byBoYW5kbGUgYSBgc2lnbmFsYCBmcmFtZSB0eXBlLCB0aGUgY2xhc3MgbXVzdCBpbXBsZW1lbnQgYHByb2Nlc3NTaWduYWxgXG4gICAqIC0gaW4gY2FzZSBvZiBhICdzY2FsYXInIGZyYW1lIHR5cGUsIHRoZSBjbGFzcyBjYW4gaW1wbGVtZW50IGFueSBvZiB0aGVcbiAgICogZm9sbG93aW5nIGJ5IG9yZGVyIG9mIHByZWZlcmVuY2U6IGBwcm9jZXNzU2NhbGFyYCwgYHByb2Nlc3NWZWN0b3JgLFxuICAgKiBgcHJvY2Vzc1NpZ25hbGAuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcmV2U3RyZWFtUGFyYW1zIC0gYHN0cmVhbVBhcmFtc2Agb2YgdGhlIHByZXZpb3VzIG9wZXJhdG9yLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9wYWdhdGVTdHJlYW1QYXJhbXN9XG4gICAqL1xuICBwcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5zdHJlYW1QYXJhbXMsIHByZXZTdHJlYW1QYXJhbXMpO1xuICAgIGNvbnN0IHByZXZGcmFtZVR5cGUgPSBwcmV2U3RyZWFtUGFyYW1zLmZyYW1lVHlwZTtcblxuICAgIHN3aXRjaCAocHJldkZyYW1lVHlwZSkge1xuICAgICAgY2FzZSAnc2NhbGFyJzpcbiAgICAgICAgaWYgKHRoaXMucHJvY2Vzc1NjYWxhcilcbiAgICAgICAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbiA9IHRoaXMucHJvY2Vzc1NjYWxhcjtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5wcm9jZXNzVmVjdG9yKVxuICAgICAgICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5wcm9jZXNzVmVjdG9yO1xuICAgICAgICBlbHNlIGlmICh0aGlzLnByb2Nlc3NTaWduYWwpXG4gICAgICAgICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLnByb2Nlc3NTaWduYWw7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSAtIG5vIFwicHJvY2Vzc1wiIGZ1bmN0aW9uIGZvdW5kYCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndmVjdG9yJzpcbiAgICAgICAgaWYgKCEoJ3Byb2Nlc3NWZWN0b3InIGluIHRoaXMpKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9IC0gXCJwcm9jZXNzVmVjdG9yXCIgaXMgbm90IGRlZmluZWRgKTtcblxuICAgICAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbiA9IHRoaXMucHJvY2Vzc1ZlY3RvcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzaWduYWwnOlxuICAgICAgICBpZiAoISgncHJvY2Vzc1NpZ25hbCcgaW4gdGhpcykpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMuY29uc3RydWN0b3IubmFtZX0gLSBcInByb2Nlc3NTaWduYWxcIiBpcyBub3QgZGVmaW5lZGApO1xuXG4gICAgICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5wcm9jZXNzU2lnbmFsO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIGRlZmF1bHRzIHRvIHByb2Nlc3NGdW5jdGlvblxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSBgdGhpcy5mcmFtZS5kYXRhYCBidWZmZXIgYW5kIGZvcndhcmQgdGhlIG9wZXJhdG9yJ3MgYHN0cmVhbVBhcmFtYFxuICAgKiB0byBhbGwgaXRzIG5leHQgb3BlcmF0b3JzLCBtdXN0IGJlIGNhbGxlZCBhdCB0aGUgZW5kIG9mIGFueVxuICAgKiBgcHJvY2Vzc1N0cmVhbVBhcmFtc2AgaW1wbGVtZW50YXRpb24uXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3ByZXBhcmVTdHJlYW1QYXJhbXN9XG4gICAqL1xuICBwcm9wYWdhdGVTdHJlYW1QYXJhbXMoKSB7XG4gICAgdGhpcy5mcmFtZS5kYXRhID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm5leHRNb2R1bGVzLmxlbmd0aDsgaSA8IGw7IGkrKylcbiAgICAgIHRoaXMubmV4dE1vZHVsZXNbaV0ucHJvY2Vzc1N0cmVhbVBhcmFtcyh0aGlzLnN0cmVhbVBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIHRoZSBwYXJ0aWN1bGFyIGxvZ2ljIHRoZSBvcGVyYXRvciBhcHBsaWVzIHRvIHRoZSBzdHJlYW0uXG4gICAqIEFjY29yZGluZyB0byB0aGUgZnJhbWUgdHlwZSBvZiB0aGUgcHJldmlvdXMgbm9kZSwgdGhlIG1ldGhvZCBjYWxscyBvbmVcbiAgICogb2YgdGhlIGZvbGxvd2luZyBtZXRob2QgYHByb2Nlc3NWZWN0b3JgLCBgcHJvY2Vzc1NpZ25hbGAgb3IgYHByb2Nlc3NTY2FsYXJgXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmcmFtZSAtIEZyYW1lICh0aW1lLCBkYXRhLCBhbmQgbWV0YWRhdGEpIGFzIGdpdmVuIGJ5IHRoZVxuICAgKiAgcHJldmlvdXMgb3BlcmF0b3IuIFRoZSBpbmNvbW1pbmcgZnJhbWUgc2hvdWxkIG5ldmVyIGJlIG1vZGlmaWVkIGJ5XG4gICAqICB0aGUgb3BlcmF0b3IuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3ByZXBhcmVGcmFtZX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvcGFnYXRlRnJhbWV9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqL1xuICBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgICB0aGlzLnByZXBhcmVGcmFtZSgpO1xuXG4gICAgLy8gZnJhbWVUaW1lIGFuZCBmcmFtZU1ldGFkYXRhIGRlZmF1bHRzIHRvIGlkZW50aXR5XG4gICAgdGhpcy5mcmFtZS50aW1lID0gZnJhbWUudGltZTtcbiAgICB0aGlzLmZyYW1lLm1ldGFkYXRhID0gZnJhbWUubWV0YWRhdGE7XG5cbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG4gICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBvaW50ZXIgdG8gdGhlIG1ldGhvZCBjYWxsZWQgaW4gYHByb2Nlc3NGcmFtZWAgYWNjb3JkaW5nIHRvIHRoZVxuICAgKiBmcmFtZSB0eXBlIG9mIHRoZSBwcmV2aW91cyBvcGVyYXRvci4gSXMgZHluYW1pY2FsbHkgYXNzaWduZWQgaW5cbiAgICogYHByZXBhcmVTdHJlYW1QYXJhbXNgLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcmVwYXJlU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzRnJhbWV9XG4gICAqL1xuICBwcm9jZXNzRnVuY3Rpb24oZnJhbWUpIHtcbiAgICB0aGlzLmZyYW1lID0gZnJhbWU7XG4gIH1cblxuICAvKipcbiAgICogQ29tbW9uIGxvZ2ljIHRvIHBlcmZvcm0gYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgYHByb2Nlc3NGcmFtZWAuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NGcmFtZX1cbiAgICovXG4gIHByZXBhcmVGcmFtZSgpIHtcbiAgICBpZiAodGhpcy5fcmVpbml0ID09PSB0cnVlKSB7XG4gICAgICBjb25zdCBzdHJlYW1QYXJhbXMgPSB0aGlzLnByZXZNb2R1bGUgIT09IG51bGwgPyB0aGlzLnByZXZNb2R1bGUuc3RyZWFtUGFyYW1zIDoge307XG4gICAgICB0aGlzLmluaXRTdHJlYW0oc3RyZWFtUGFyYW1zKTtcbiAgICAgIHRoaXMuX3JlaW5pdCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGb3J3YXJkIHRoZSBjdXJyZW50IGBmcmFtZWAgdG8gdGhlIG5leHQgb3BlcmF0b3JzLCBpcyBjYWxsZWQgYXQgdGhlIGVuZCBvZlxuICAgKiBgcHJvY2Vzc0ZyYW1lYC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc0ZyYW1lfVxuICAgKi9cbiAgcHJvcGFnYXRlRnJhbWUoKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm5leHRNb2R1bGVzLmxlbmd0aDsgaSA8IGw7IGkrKylcbiAgICAgIHRoaXMubmV4dE1vZHVsZXNbaV0ucHJvY2Vzc0ZyYW1lKHRoaXMuZnJhbWUpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJhc2VMZm87XG4iXX0=