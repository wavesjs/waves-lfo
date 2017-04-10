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

      this.nextModules.push(next);
      next.prevModule = this;

      if (this.streamParams.frameType !== null) // graph has already been started
        next.processStreamParams(this.streamParams);
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
      var _this = this;

      var next = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (next === null) {
        this.nextModules.forEach(function (next) {
          return _this.disconnect(next);
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
     * Return a promise that resolve when the module is ready to be consumed.
     * Some modules have an async behavior at initialization and thus could
     * be not ready to be consumed when the graph starts.
     * A module should be consider as initialized when all next modules (children)
     * are themselves initialized. The event bubbles up from sinks to sources.
     * When all its next operators are ready, a source can consider the whole graph
     * as ready and then accept incoming.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2VMZm8uanMiXSwibmFtZXMiOlsiaWQiLCJCYXNlTGZvIiwiZGVmaW5pdGlvbnMiLCJvcHRpb25zIiwiY2lkIiwicGFyYW1zIiwiYWRkTGlzdGVuZXIiLCJvblBhcmFtVXBkYXRlIiwiYmluZCIsInN0cmVhbVBhcmFtcyIsImZyYW1lVHlwZSIsImZyYW1lU2l6ZSIsImZyYW1lUmF0ZSIsImRlc2NyaXB0aW9uIiwic291cmNlU2FtcGxlUmF0ZSIsInNvdXJjZVNhbXBsZUNvdW50IiwiZnJhbWUiLCJ0aW1lIiwiZGF0YSIsIm1ldGFkYXRhIiwibmV4dE1vZHVsZXMiLCJwcmV2TW9kdWxlIiwiX3JlaW5pdCIsImdldERlZmluaXRpb25zIiwicmVzZXQiLCJuYW1lIiwidmFsdWUiLCJtZXRhcyIsImtpbmQiLCJuZXh0IiwiRXJyb3IiLCJwdXNoIiwicHJvY2Vzc1N0cmVhbVBhcmFtcyIsImZvckVhY2giLCJkaXNjb25uZWN0IiwiaW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwibGVuZ3RoIiwiZGVzdHJveSIsIm5leHRQcm9taXNlcyIsIm1hcCIsIm1vZHVsZSIsImluaXRNb2R1bGUiLCJhbGwiLCJyZXNldFN0cmVhbSIsImkiLCJsIiwiZW5kVGltZSIsImZpbmFsaXplU3RyZWFtIiwicHJldlN0cmVhbVBhcmFtcyIsInByZXBhcmVTdHJlYW1QYXJhbXMiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJwcmV2RnJhbWVUeXBlIiwicHJvY2Vzc1NjYWxhciIsInByb2Nlc3NGdW5jdGlvbiIsInByb2Nlc3NWZWN0b3IiLCJwcm9jZXNzU2lnbmFsIiwiY29uc3RydWN0b3IiLCJGbG9hdDMyQXJyYXkiLCJwcmVwYXJlRnJhbWUiLCJwcm9wYWdhdGVGcmFtZSIsImluaXRTdHJlYW0iLCJwcm9jZXNzRnJhbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBSUEsS0FBSyxDQUFUOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7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Q0Y7O0FBRUQ7Ozs7Ozs7OztxQ0FNaUI7QUFDZixXQUFLLElBQUl3QixJQUFJLENBQVIsRUFBV0MsSUFBSSxLQUFLM0IsV0FBTCxDQUFpQmtCLE1BQXJDLEVBQTZDUSxJQUFJQyxDQUFqRCxFQUFvREQsR0FBcEQ7QUFDRSxhQUFLMUIsV0FBTCxDQUFpQjBCLENBQWpCLEVBQW9CaUIsWUFBcEIsQ0FBaUMsS0FBSy9DLEtBQXRDO0FBREY7QUFFRDs7Ozs7a0JBR1lmLE8iLCJmaWxlIjoiQmFzZUxmby5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXJhbWV0ZXJzIGZyb20gJ3BhcmFtZXRlcnMnO1xuXG5sZXQgaWQgPSAwO1xuXG4vKipcbiAqIEJhc2UgYGxmb2AgY2xhc3MgdG8gYmUgZXh0ZW5kZWQgaW4gb3JkZXIgdG8gY3JlYXRlIG5ldyBub2Rlcy5cbiAqXG4gKiBOb2RlcyBhcmUgZGl2aWRlZCBpbiAzIGNhdGVnb3JpZXM6XG4gKiAtICoqYHNvdXJjZWAqKiBhcmUgcmVzcG9uc2libGUgZm9yIGFjcXVlcmluZyBhIHNpZ25hbCBhbmQgaXRzIHByb3BlcnRpZXNcbiAqICAgKGZyYW1lUmF0ZSwgZnJhbWVTaXplLCBldGMuKVxuICogLSAqKmBzaW5rYCoqIGFyZSBlbmRwb2ludHMgb2YgdGhlIGdyYXBoLCBzdWNoIG5vZGVzIGNhbiBiZSByZWNvcmRlcnMsXG4gKiAgIHZpc3VhbGl6ZXJzLCBldGMuXG4gKiAtICoqYG9wZXJhdG9yYCoqIGFyZSB1c2VkIHRvIG1ha2UgY29tcHV0YXRpb24gb24gdGhlIGlucHV0IHNpZ25hbCBhbmRcbiAqICAgZm9yd2FyZCB0aGUgcmVzdWx0cyBiZWxvdyBpbiB0aGUgZ3JhcGguXG4gKlxuICogSW4gbW9zdCBjYXNlcyB0aGUgbWV0aG9kcyB0byBvdmVycmlkZSAvIGV4dGVuZCBhcmU6XG4gKiAtIHRoZSAqKmBjb25zdHJ1Y3RvcmAqKiB0byBkZWZpbmUgdGhlIHBhcmFtZXRlcnMgb2YgdGhlIG5ldyBsZm8gbm9kZS5cbiAqIC0gdGhlICoqYHByb2Nlc3NTdHJlYW1QYXJhbXNgKiogbWV0aG9kIHRvIGRlZmluZSBob3cgdGhlIG5vZGUgbW9kaWZ5IHRoZVxuICogICBzdHJlYW0gYXR0cmlidXRlcyAoZS5nLiBieSBjaGFuZ2luZyB0aGUgZnJhbWUgc2l6ZSlcbiAqIC0gdGhlICoqYHByb2Nlc3N7RnJhbWVUeXBlfWAqKiBtZXRob2QgdG8gZGVmaW5lIHRoZSBvcGVyYXRpb25zIHRoYXQgdGhlXG4gKiAgIG5vZGUgYXBwbHkgb24gdGhlIHN0cmVhbS4gVGhlIHR5cGUgb2YgaW5wdXQgYSBub2RlIGNhbiBoYW5kbGUgaXMgZGVmaW5lXG4gKiAgIGJ5IGl0cyBpbXBsZW1lbnRlZCBpbnRlcmZhY2UsIGlmIGl0IGltcGxlbWVudHMgYHByb2Nlc3NTaWduYWxgIGEgc3RyZWFtXG4gKiAgIHdpdGggYGZyYW1lVHlwZSA9PT0gJ3NpZ25hbCdgIGNhbiBiZSBwcm9jZXNzZWQsIGBwcm9jZXNzVmVjdG9yYCB0byBoYW5kbGVcbiAqICAgYW4gaW5wdXQgb2YgdHlwZSBgdmVjdG9yYC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fVGhpcyBjbGFzcyBzaG91bGQgYmUgY29uc2lkZXJlZCBhYnN0cmFjdCBhbmQgb25seVxuICogYmUgdXNlZCB0byBiZSBleHRlbmRlZC5fPC9zcGFuPlxuICpcbiAqXG4gKiAvLyBvdmVydmlldyBvZiB0aGUgYmVoYXZpb3Igb2YgYSBub2RlXG4gKlxuICogKipwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpKipcbiAqXG4gKiBgYmFzZWAgY2xhc3MgKGRlZmF1bHQgaW1wbGVtZW50YXRpb24pXG4gKiAtIGNhbGwgYHByZXByb2Nlc3NTdHJlYW1QYXJhbXNgXG4gKiAtIGNhbGwgYHByb3BhZ2F0ZVN0cmVhbVBhcmFtc2BcbiAqXG4gKiBgY2hpbGRgIGNsYXNzXG4gKiAtIGNhbGwgYHByZXByb2Nlc3NTdHJlYW1QYXJhbXNgXG4gKiAtIG92ZXJyaWRlIHNvbWUgb2YgdGhlIGluaGVyaXRlZCBgc3RyZWFtUGFyYW1zYFxuICogLSBjcmVhdGVzIHRoZSBhbnkgcmVsYXRlZCBsb2dpYyBidWZmZXJzXG4gKiAtIGNhbGwgYHByb3BhZ2F0ZVN0cmVhbVBhcmFtc2BcbiAqXG4gKiBfc2hvdWxkIG5vdCBjYWxsIGBzdXBlci5wcm9jZXNzU3RyZWFtUGFyYW1zYF9cbiAqXG4gKiAqKnByZXBhcmVTdHJlYW1QYXJhbXMoKSoqXG4gKlxuICogLSBhc3NpZ24gcHJldlN0cmVhbVBhcmFtcyB0byB0aGlzLnN0cmVhbVBhcmFtc1xuICogLSBjaGVjayBpZiB0aGUgY2xhc3MgaW1wbGVtZW50cyB0aGUgY29ycmVjdCBgcHJvY2Vzc0lucHV0YCBtZXRob2RcbiAqXG4gKiBfc2hvdWxkbid0IGJlIGV4dGVuZGVkLCBvbmx5IGNvbnN1bWVkIGluIGBwcm9jZXNzU3RyZWFtUGFyYW1zYF9cbiAqXG4gKiAqKnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpKipcbiAqXG4gKiAtIGNyZWF0ZXMgdGhlIGBmcmFtZURhdGFgIGJ1ZmZlclxuICogLSBwcm9wYWdhdGUgYHN0cmVhbVBhcmFtc2AgdG8gY2hpbGRyZW5cbiAqXG4gKiBfc2hvdWxkbid0IGJlIGV4dGVuZGVkLCBvbmx5IGNvbnN1bWVkIGluIGBwcm9jZXNzU3RyZWFtUGFyYW1zYF9cbiAqXG4gKiAqKnByb2Nlc3NGcmFtZSgpKipcbiAqXG4gKiBgYmFzZWAgY2xhc3MgKGRlZmF1bHQgaW1wbGVtZW50YXRpb24pXG4gKiAtIGNhbGwgYHByZXByb2Nlc3NGcmFtZWBcbiAqIC0gYXNzaWduIGZyYW1lVGltZSBhbmQgZnJhbWVNZXRhZGF0YSB0byBpZGVudGl0eVxuICogLSBjYWxsIHRoZSBwcm9wZXIgZnVuY3Rpb24gYWNjb3JkaW5nIHRvIGlucHV0VHlwZVxuICogLSBjYWxsIGBwcm9wYWdhdGVGcmFtZWBcbiAqXG4gKiBgY2hpbGRgIGNsYXNzXG4gKiAtIGNhbGwgYHByZXByb2Nlc3NGcmFtZWBcbiAqIC0gZG8gd2hhdGV2ZXIgeW91IHdhbnQgd2l0aCBpbmNvbW1pbmcgZnJhbWVcbiAqIC0gY2FsbCBgcHJvcGFnYXRlRnJhbWVgXG4gKlxuICogX3Nob3VsZCBub3QgY2FsbCBgc3VwZXIucHJvY2Vzc0ZyYW1lYF9cbiAqXG4gKiAqKnByZXBhcmVGcmFtZSgpKipcbiAqXG4gKiAtIGlmIGByZWluaXRgIGFuZCB0cmlnZ2VyIGBwcm9jZXNzU3RyZWFtUGFyYW1zYCBpZiBuZWVkZWRcbiAqXG4gKiBfc2hvdWxkbid0IGJlIGV4dGVuZGVkLCBvbmx5IGNvbnN1bWVkIGluIGBwcm9jZXNzRnJhbWVgX1xuICpcbiAqICoqcHJvcGFnYXRlRnJhbWUoKSoqXG4gKlxuICogLSBwcm9wYWdhdGUgZnJhbWUgdG8gY2hpbGRyZW5cbiAqXG4gKiBfc2hvdWxkbid0IGJlIGV4dGVuZGVkLCBvbmx5IGNvbnN1bWVkIGluIGBwcm9jZXNzRnJhbWVgX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29yZVxuICovXG5jbGFzcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3IoZGVmaW5pdGlvbnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5jaWQgPSBpZCsrO1xuXG4gICAgLyoqXG4gICAgICogUGFyYW1ldGVyIGJhZyBjb250YWluaW5nIHBhcmFtZXRlciBpbnN0YW5jZXMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBuYW1lIHBhcmFtc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqL1xuICAgIHRoaXMucGFyYW1zID0gcGFyYW1ldGVycyhkZWZpbml0aW9ucywgb3B0aW9ucyk7XG4gICAgLy8gbGlzdGVuIGZvciBwYXJhbSB1cGRhdGVzXG4gICAgdGhpcy5wYXJhbXMuYWRkTGlzdGVuZXIodGhpcy5vblBhcmFtVXBkYXRlLmJpbmQodGhpcykpO1xuXG4gICAgLyoqXG4gICAgICogRGVzY3JpcHRpb24gb2YgdGhlIHN0cmVhbSBvdXRwdXQgb2YgdGhlIG5vZGUuXG4gICAgICogU2V0IHRvIGBudWxsYCB3aGVuIHRoZSBub2RlIGlzIGRlc3Ryb3llZC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGZyYW1lU2l6ZSAtIEZyYW1lIHNpemUgYXQgdGhlIG91dHB1dCBvZiB0aGUgbm9kZS5cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZnJhbWVSYXRlIC0gRnJhbWUgcmF0ZSBhdCB0aGUgb3V0cHV0IG9mIHRoZSBub2RlLlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBmcmFtZVR5cGUgLSBGcmFtZSB0eXBlIGF0IHRoZSBvdXRwdXQgb2YgdGhlIG5vZGUsXG4gICAgICogIHBvc3NpYmxlIHZhbHVlcyBhcmUgYHNpZ25hbGAsIGB2ZWN0b3JgIG9yIGBzY2FsYXJgLlxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl8U3RyaW5nfSBkZXNjcmlwdGlvbiAtIElmIHR5cGUgaXMgYHZlY3RvcmAsIGRlc2NyaWJlXG4gICAgICogIHRoZSBkaW1lbnNpb24ocykgb2Ygb3V0cHV0IHN0cmVhbS5cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gc291cmNlU2FtcGxlUmF0ZSAtIFNhbXBsZSByYXRlIG9mIHRoZSBzb3VyY2Ugb2YgdGhlXG4gICAgICogIGdyYXBoLiBfVGhlIHZhbHVlIHNob3VsZCBiZSBkZWZpbmVkIGJ5IHNvdXJjZXMgYW5kIG5ldmVyIG1vZGlmaWVkXy5cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gc291cmNlU2FtcGxlQ291bnQgLSBOdW1iZXIgb2YgY29uc2VjdXRpdmUgZGlzY3JldGVcbiAgICAgKiAgdGltZSB2YWx1ZXMgY29udGFpbmVkIGluIHRoZSBkYXRhIGZyYW1lIG91dHB1dCBieSB0aGUgc291cmNlLlxuICAgICAqICBfVGhlIHZhbHVlIHNob3VsZCBiZSBkZWZpbmVkIGJ5IHNvdXJjZXMgYW5kIG5ldmVyIG1vZGlmaWVkXy5cbiAgICAgKlxuICAgICAqIEBuYW1lIHN0cmVhbVBhcmFtc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqL1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zID0ge1xuICAgICAgZnJhbWVUeXBlOiBudWxsLFxuICAgICAgZnJhbWVTaXplOiAxLFxuICAgICAgZnJhbWVSYXRlOiAwLFxuICAgICAgZGVzY3JpcHRpb246IG51bGwsXG4gICAgICBzb3VyY2VTYW1wbGVSYXRlOiAwLFxuICAgICAgc291cmNlU2FtcGxlQ291bnQ6IG51bGwsXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEN1cnJlbnQgZnJhbWUuIFRoaXMgb2JqZWN0IGFuZCBpdHMgZGF0YSBhcmUgdXBkYXRlZCBhdCBlYWNoIGluY29tbWluZ1xuICAgICAqIGZyYW1lIHdpdGhvdXQgcmVhbGxvY2F0aW5nIG1lbW9yeS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgZnJhbWVcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gdGltZSAtIFRpbWUgb2YgdGhlIGN1cnJlbnQgZnJhbWUuXG4gICAgICogQHByb3BlcnR5IHtGbG9hdDMyQXJyYXl9IGRhdGEgLSBEYXRhIG9mIHRoZSBjdXJyZW50IGZyYW1lLlxuICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBtZXRhZGF0YSAtIE1ldGFkYXRhIGFzc29jaXRlZCB0byB0aGUgY3VycmVudCBmcmFtZS5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm9cbiAgICAgKi9cbiAgICB0aGlzLmZyYW1lID0ge1xuICAgICAgdGltZTogMCxcbiAgICAgIGRhdGE6IG51bGwsXG4gICAgICBtZXRhZGF0YToge30sXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2Ygbm9kZXMgY29ubmVjdGVkIHRvIHRoZSBvdXB1dCBvZiB0aGUgbm9kZSAobG93ZXIgaW4gdGhlIGdyYXBoKS5cbiAgICAgKiBBdCBlYWNoIGZyYW1lLCB0aGUgbm9kZSBmb3J3YXJkIGl0cyBgZnJhbWVgIHRvIHRvIGFsbCBpdHMgYG5leHRNb2R1bGVzYC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtBcnJheTxCYXNlTGZvPn1cbiAgICAgKiBAbmFtZSBuZXh0TW9kdWxlc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Nvbm5lY3R9XG4gICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jZGlzY29ubmVjdH1cbiAgICAgKi9cbiAgICB0aGlzLm5leHRNb2R1bGVzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbm9kZSBmcm9tIHdoaWNoIHRoZSBub2RlIHJlY2VpdmUgdGhlIGZyYW1lcyAodXBwZXIgaW4gdGhlIGdyYXBoKS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtCYXNlTGZvfVxuICAgICAqIEBuYW1lIHByZXZNb2R1bGVcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm9cbiAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNjb25uZWN0fVxuICAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Rpc2Nvbm5lY3R9XG4gICAgICovXG4gICAgdGhpcy5wcmV2TW9kdWxlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIElzIHNldCB0byB0cnVlIHdoZW4gYSBzdGF0aWMgcGFyYW1ldGVyIGlzIHVwZGF0ZWQuIE9uIHRoZSBuZXh0IGlucHV0XG4gICAgICogZnJhbWUgYWxsIHRoZSBzdWJncmFwaCBzdHJlYW1QYXJhbXMgc3RhcnRpbmcgZnJvbSB0aGlzIG5vZGUgd2lsbCBiZVxuICAgICAqIHVwZGF0ZWQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAbmFtZSBfcmVpbml0XG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9yZWluaXQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIG9iamVjdCBkZXNjcmliaW5nIGVhY2ggYXZhaWxhYmxlIHBhcmFtZXRlciBvZiB0aGUgbm9kZS5cbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgZ2V0UGFyYW1zRGVzY3JpcHRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLmdldERlZmluaXRpb25zKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgYWxsIHBhcmFtZXRlcnMgdG8gdGhlaXIgaW5pdGlhbCB2YWx1ZSAoYXMgZGVmaW5lZCBvbiBpbnN0YW50aWNhdGlvbilcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jc3RyZWFtUGFyYW1zfVxuICAgKi9cbiAgcmVzZXRQYXJhbXMoKSB7XG4gICAgdGhpcy5wYXJhbXMucmVzZXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiBjYWxsZWQgd2hlbiBhIHBhcmFtIGlzIHVwZGF0ZWQuIEJ5IGRlZmF1bHQgc2V0IHRoZSBgX3JlaW5pdGBcbiAgICogZmxhZyB0byBgdHJ1ZWAgaWYgdGhlIHBhcmFtIGlzIGBzdGF0aWNgIG9uZS4gVGhpcyBtZXRob2Qgc2hvdWxkIGJlXG4gICAqIGV4dGVuZGVkIHRvIGhhbmRsZSBwYXJ0aWN1bGFyIGxvZ2ljIGJvdW5kIHRvIGEgc3BlY2lmaWMgcGFyYW1ldGVyLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgLSBWYWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gbWV0YXMgLSBNZXRhZGF0YSBhc3NvY2lhdGVkIHRvIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBvblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcyA9IHt9KSB7XG4gICAgaWYgKG1ldGFzLmtpbmQgPT09ICdzdGF0aWMnKVxuICAgICAgdGhpcy5fcmVpbml0ID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25uZWN0IHRoZSBjdXJyZW50IG5vZGUgKGBwcmV2TW9kdWxlYCkgdG8gYW5vdGhlciBub2RlIChgbmV4dE9wYCkuXG4gICAqIEEgZ2l2ZW4gbm9kZSBjYW4gYmUgY29ubmVjdGVkIHRvIHNldmVyYWwgb3BlcmF0b3JzIGFuZCBwcm9wYWdhdGUgdGhlXG4gICAqIHN0cmVhbSB0byBlYWNoIG9mIHRoZW0uXG4gICAqXG4gICAqIEBwYXJhbSB7QmFzZUxmb30gbmV4dCAtIE5leHQgb3BlcmF0b3IgaW4gdGhlIGdyYXBoLlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzRnJhbWV9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Rpc2Nvbm5lY3R9XG4gICAqL1xuICBjb25uZWN0KG5leHQpIHtcbiAgICBpZiAoIShuZXh0IGluc3RhbmNlb2YgQmFzZUxmbykpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29ubmVjdGlvbjogY2hpbGQgbm9kZSBpcyBub3QgYW4gaW5zdGFuY2Ugb2YgYEJhc2VMZm9gJyk7XG5cbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMgPT09IG51bGwgfHxuZXh0LnN0cmVhbVBhcmFtcyA9PT0gbnVsbClcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb25uZWN0aW9uOiBjYW5ub3QgY29ubmVjdCBhIGRlYWQgbm9kZScpO1xuXG4gICAgdGhpcy5uZXh0TW9kdWxlcy5wdXNoKG5leHQpO1xuICAgIG5leHQucHJldk1vZHVsZSA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlICE9PSBudWxsKSAvLyBncmFwaCBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWRcbiAgICAgIG5leHQucHJvY2Vzc1N0cmVhbVBhcmFtcyh0aGlzLnN0cmVhbVBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBnaXZlbiBvcGVyYXRvciBmcm9tIGl0cyBwcmV2aW91cyBvcGVyYXRvcnMnIGBuZXh0TW9kdWxlc2AuXG4gICAqXG4gICAqIEBwYXJhbSB7QmFzZUxmb30gW25leHQ9bnVsbF0gLSBUaGUgb3BlcmF0b3IgdG8gZGlzY29ubmVjdCBmcm9tIHRoZSBjdXJyZW50XG4gICAqICBvcGVyYXRvci4gSWYgYG51bGxgIGRpc2Nvbm5lY3QgYWxsIHRoZSBuZXh0IG9wZXJhdG9ycy5cbiAgICovXG4gIGRpc2Nvbm5lY3QobmV4dCA9IG51bGwpIHtcbiAgICBpZiAobmV4dCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5uZXh0TW9kdWxlcy5mb3JFYWNoKChuZXh0KSA9PiB0aGlzLmRpc2Nvbm5lY3QobmV4dCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMubmV4dE1vZHVsZXMuaW5kZXhPZih0aGlzKTtcbiAgICAgIHRoaXMubmV4dE1vZHVsZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIG5leHQucHJldk1vZHVsZSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgYWxsIHRoZSBub2RlcyBpbiB0aGUgc3ViLWdyYXBoIHN0YXJ0aW5nIGZyb20gdGhlIGN1cnJlbnQgbm9kZS5cbiAgICogV2hlbiBkZXRyb3llZCwgdGhlIGBzdHJlYW1QYXJhbXNgIG9mIHRoZSBub2RlIGFyZSBzZXQgdG8gYG51bGxgLCB0aGVcbiAgICogb3BlcmF0b3IgaXMgdGhlbiBjb25zaWRlcmVkIGFzIGBkZWFkYCBhbmQgY2Fubm90IGJlIHJlY29ubmVjdGVkLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNjb25uZWN0fVxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICAvLyBkZXN0cm95IGFsbCBjaGlkcmVuXG4gICAgbGV0IGluZGV4ID0gdGhpcy5uZXh0TW9kdWxlcy5sZW5ndGg7XG5cbiAgICB3aGlsZSAoaW5kZXgtLSlcbiAgICAgIHRoaXMubmV4dE1vZHVsZXNbaW5kZXhdLmRlc3Ryb3koKTtcblxuICAgIC8vIGRpc2Nvbm5lY3QgaXRzZWxmIGZyb20gdGhlIHByZXZpb3VzIG9wZXJhdG9yXG4gICAgaWYgKHRoaXMucHJldk1vZHVsZSlcbiAgICAgIHRoaXMucHJldk1vZHVsZS5kaXNjb25uZWN0KHRoaXMpO1xuXG4gICAgLy8gbWFyayB0aGUgb2JqZWN0IGFzIGRlYWRcbiAgICB0aGlzLnN0cmVhbVBhcmFtcyA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmUgd2hlbiB0aGUgbW9kdWxlIGlzIHJlYWR5IHRvIGJlIGNvbnN1bWVkLlxuICAgKiBTb21lIG1vZHVsZXMgaGF2ZSBhbiBhc3luYyBiZWhhdmlvciBhdCBpbml0aWFsaXphdGlvbiBhbmQgdGh1cyBjb3VsZFxuICAgKiBiZSBub3QgcmVhZHkgdG8gYmUgY29uc3VtZWQgd2hlbiB0aGUgZ3JhcGggc3RhcnRzLlxuICAgKiBBIG1vZHVsZSBzaG91bGQgYmUgY29uc2lkZXIgYXMgaW5pdGlhbGl6ZWQgd2hlbiBhbGwgbmV4dCBtb2R1bGVzIChjaGlsZHJlbilcbiAgICogYXJlIHRoZW1zZWx2ZXMgaW5pdGlhbGl6ZWQuIFRoZSBldmVudCBidWJibGVzIHVwIGZyb20gc2lua3MgdG8gc291cmNlcy5cbiAgICogV2hlbiBhbGwgaXRzIG5leHQgb3BlcmF0b3JzIGFyZSByZWFkeSwgYSBzb3VyY2UgY2FuIGNvbnNpZGVyIHRoZSB3aG9sZSBncmFwaFxuICAgKiBhcyByZWFkeSBhbmQgdGhlbiBhY2NlcHQgaW5jb21pbmcuXG4gICAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIHJlc29sdmVzIHdoZW4gYWxsIG5leHQgb3BlcmF0b3JzIGFyZSByZXNvbHZlZFxuICAgKiB0aGVtc2VsdmVzLlxuICAgKiBBbiBvcGVyYXRvciByZWx5aW5nIG9uIGV4dGVybmFsIGFzeW5jIEFQSSBtdXN0IG92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvXG4gICAqIHJlc29sdmUgb25seSB3aGVuIGl0cyBkZXBlbmRlY3kgaXMgcmVhZHkuXG4gICAqXG4gICAqIEByZXR1cm4gUHJvbWlzZVxuICAgKiBAdG9kbyAtIEhhbmRsZSBkeW5hbWljIGNvbm5lY3Rpb25zXG4gICAqL1xuICBpbml0TW9kdWxlKCkge1xuICAgIGNvbnN0IG5leHRQcm9taXNlcyA9IHRoaXMubmV4dE1vZHVsZXMubWFwKChtb2R1bGUpID0+IHtcbiAgICAgIHJldHVybiBtb2R1bGUuaW5pdE1vZHVsZSgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKG5leHRQcm9taXNlcyk7XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIHRvIGluaXRpYWxpemUgdGhlIHN0cmVhbSBpbiBzdGFuZGFsb25lIG1vZGUuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbc3RyZWFtUGFyYW1zPXt9XSAtIFBhcmFtZXRlcnMgb2YgdGhlIHN0cmVhbS5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcmVzZXRTdHJlYW19XG4gICAqL1xuICBpbml0U3RyZWFtKHN0cmVhbVBhcmFtcyA9IHt9KSB7XG4gICAgdGhpcy5wcm9jZXNzU3RyZWFtUGFyYW1zKHN0cmVhbVBhcmFtcyk7XG4gICAgdGhpcy5yZXNldFN0cmVhbSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBgZnJhbWUuZGF0YWAgYnVmZmVyIGJ5IHNldHRpbmcgYWxsIGl0cyB2YWx1ZXMgdG8gMC5cbiAgICogQSBzb3VyY2Ugb3BlcmF0b3Igc2hvdWxkIGNhbGwgYHByb2Nlc3NTdHJlYW1QYXJhbXNgIGFuZCBgcmVzZXRTdHJlYW1gIHdoZW5cbiAgICogc3RhcnRlZCwgZWFjaCBvZiB0aGVzZSBtZXRob2QgcHJvcGFnYXRlIHRocm91Z2ggdGhlIGdyYXBoIGF1dG9tYXRpY2FseS5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICovXG4gIHJlc2V0U3RyZWFtKCkge1xuICAgIC8vIGJ1dHRvbSB1cFxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5uZXh0TW9kdWxlcy5sZW5ndGg7IGkgPCBsOyBpKyspXG4gICAgICB0aGlzLm5leHRNb2R1bGVzW2ldLnJlc2V0U3RyZWFtKCk7XG5cbiAgICAvLyBubyBidWZmZXIgZm9yIGBzY2FsYXJgIHR5cGUgb3Igc2luayBub2RlXG4gICAgLy8gQG5vdGUgLSB0aGlzIHNob3VsZCBiZSByZXZpZXdlZFxuICAgIGlmICh0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVR5cGUgIT09ICdzY2FsYXInICYmIHRoaXMuZnJhbWUuZGF0YSAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKylcbiAgICAgICAgZGF0YVtpXSA9IDA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZpbmFsaXplIHRoZSBzdHJlYW0uIEEgc291cmNlIG5vZGUgc2hvdWxkIGNhbGwgdGhpcyBtZXRob2Qgd2hlbiBzdG9wcGVkLFxuICAgKiBgZmluYWxpemVTdHJlYW1gIGlzIGF1dG9tYXRpY2FsbHkgcHJvcGFnYXRlZCB0aHJvdWdodCB0aGUgZ3JhcGguXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBlbmRUaW1lIC0gTG9naWNhbCB0aW1lIGF0IHdoaWNoIHRoZSBncmFwaCBpcyBzdG9wcGVkLlxuICAgKi9cbiAgZmluYWxpemVTdHJlYW0oZW5kVGltZSkge1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5uZXh0TW9kdWxlcy5sZW5ndGg7IGkgPCBsOyBpKyspXG4gICAgICB0aGlzLm5leHRNb2R1bGVzW2ldLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgb3IgdXBkYXRlIHRoZSBvcGVyYXRvcidzIGBzdHJlYW1QYXJhbXNgIGFjY29yZGluZyB0byB0aGVcbiAgICogcHJldmlvdXMgb3BlcmF0b3JzIGBzdHJlYW1QYXJhbXNgIHZhbHVlcy5cbiAgICpcbiAgICogV2hlbiBpbXBsZW1lbnRpbmcgYSBuZXcgb3BlcmF0b3IgdGhpcyBtZXRob2Qgc2hvdWxkOlxuICAgKiAxLiBjYWxsIGB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXNgIHdpdGggdGhlIGdpdmVuIGBwcmV2U3RyZWFtUGFyYW1zYFxuICAgKiAyLiBvcHRpb25uYWxseSBjaGFuZ2UgdmFsdWVzIHRvIGB0aGlzLnN0cmVhbVBhcmFtc2AgYWNjb3JkaW5nIHRvIHRoZVxuICAgKiAgICBsb2dpYyBwZXJmb3JtZWQgYnkgdGhlIG9wZXJhdG9yLlxuICAgKiAzLiBvcHRpb25uYWxseSBhbGxvY2F0ZSBtZW1vcnkgZm9yIHJpbmcgYnVmZmVycywgZXRjLlxuICAgKiA0LiBjYWxsIGB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtc2AgdG8gdHJpZ2dlciB0aGUgbWV0aG9kIG9uIHRoZSBuZXh0XG4gICAqICAgIG9wZXJhdG9ycyBpbiB0aGUgZ3JhcGguXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcmV2U3RyZWFtUGFyYW1zIC0gYHN0cmVhbVBhcmFtc2Agb2YgdGhlIHByZXZpb3VzIG9wZXJhdG9yLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcmVwYXJlU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9wYWdhdGVTdHJlYW1QYXJhbXN9XG4gICAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbW1vbiBsb2dpYyB0byBkbyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBgcHJvY2Vzc1N0cmVhbVBhcmFtYCwgbXVzdCBiZVxuICAgKiBjYWxsZWQgYXQgdGhlIGJlZ2lubmluZyBvZiBhbnkgYHByb2Nlc3NTdHJlYW1QYXJhbWAgaW1wbGVtZW50YXRpb24uXG4gICAqXG4gICAqIFRoZSBtZXRob2QgbWFpbmx5IGNoZWNrIGlmIHRoZSBjdXJyZW50IG5vZGUgaW1wbGVtZW50IHRoZSBpbnRlcmZhY2UgdG9cbiAgICogaGFuZGxlIHRoZSB0eXBlIG9mIGZyYW1lIHByb3BhZ2F0ZWQgYnkgaXQncyBwYXJlbnQ6XG4gICAqIC0gdG8gaGFuZGxlIGEgYHZlY3RvcmAgZnJhbWUgdHlwZSwgdGhlIGNsYXNzIG11c3QgaW1wbGVtZW50IGBwcm9jZXNzVmVjdG9yYFxuICAgKiAtIHRvIGhhbmRsZSBhIGBzaWduYWxgIGZyYW1lIHR5cGUsIHRoZSBjbGFzcyBtdXN0IGltcGxlbWVudCBgcHJvY2Vzc1NpZ25hbGBcbiAgICogLSBpbiBjYXNlIG9mIGEgJ3NjYWxhcicgZnJhbWUgdHlwZSwgdGhlIGNsYXNzIGNhbiBpbXBsZW1lbnQgYW55IG9mIHRoZVxuICAgKiBmb2xsb3dpbmcgYnkgb3JkZXIgb2YgcHJlZmVyZW5jZTogYHByb2Nlc3NTY2FsYXJgLCBgcHJvY2Vzc1ZlY3RvcmAsXG4gICAqIGBwcm9jZXNzU2lnbmFsYC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHByZXZTdHJlYW1QYXJhbXMgLSBgc3RyZWFtUGFyYW1zYCBvZiB0aGUgcHJldmlvdXMgb3BlcmF0b3IuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb3BhZ2F0ZVN0cmVhbVBhcmFtc31cbiAgICovXG4gIHByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyA9IHt9KSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0cmVhbVBhcmFtcywgcHJldlN0cmVhbVBhcmFtcyk7XG4gICAgY29uc3QgcHJldkZyYW1lVHlwZSA9IHByZXZTdHJlYW1QYXJhbXMuZnJhbWVUeXBlO1xuXG4gICAgc3dpdGNoIChwcmV2RnJhbWVUeXBlKSB7XG4gICAgICBjYXNlICdzY2FsYXInOlxuICAgICAgICBpZiAodGhpcy5wcm9jZXNzU2NhbGFyKVxuICAgICAgICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5wcm9jZXNzU2NhbGFyO1xuICAgICAgICBlbHNlIGlmICh0aGlzLnByb2Nlc3NWZWN0b3IpXG4gICAgICAgICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLnByb2Nlc3NWZWN0b3I7XG4gICAgICAgIGVsc2UgaWYgKHRoaXMucHJvY2Vzc1NpZ25hbClcbiAgICAgICAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbiA9IHRoaXMucHJvY2Vzc1NpZ25hbDtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9IC0gbm8gXCJwcm9jZXNzXCIgZnVuY3Rpb24gZm91bmRgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd2ZWN0b3InOlxuICAgICAgICBpZiAoISgncHJvY2Vzc1ZlY3RvcicgaW4gdGhpcykpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMuY29uc3RydWN0b3IubmFtZX0gLSBcInByb2Nlc3NWZWN0b3JcIiBpcyBub3QgZGVmaW5lZGApO1xuXG4gICAgICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5wcm9jZXNzVmVjdG9yO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NpZ25hbCc6XG4gICAgICAgIGlmICghKCdwcm9jZXNzU2lnbmFsJyBpbiB0aGlzKSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSAtIFwicHJvY2Vzc1NpZ25hbFwiIGlzIG5vdCBkZWZpbmVkYCk7XG5cbiAgICAgICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLnByb2Nlc3NTaWduYWw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgLy8gZGVmYXVsdHMgdG8gcHJvY2Vzc0Z1bmN0aW9uXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIGB0aGlzLmZyYW1lLmRhdGFgIGJ1ZmZlciBhbmQgZm9yd2FyZCB0aGUgb3BlcmF0b3IncyBgc3RyZWFtUGFyYW1gXG4gICAqIHRvIGFsbCBpdHMgbmV4dCBvcGVyYXRvcnMsIG11c3QgYmUgY2FsbGVkIGF0IHRoZSBlbmQgb2YgYW55XG4gICAqIGBwcm9jZXNzU3RyZWFtUGFyYW1zYCBpbXBsZW1lbnRhdGlvbi5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJlcGFyZVN0cmVhbVBhcmFtc31cbiAgICovXG4gIHByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpIHtcbiAgICB0aGlzLmZyYW1lLmRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubmV4dE1vZHVsZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgdGhpcy5uZXh0TW9kdWxlc1tpXS5wcm9jZXNzU3RyZWFtUGFyYW1zKHRoaXMuc3RyZWFtUGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgdGhlIHBhcnRpY3VsYXIgbG9naWMgdGhlIG9wZXJhdG9yIGFwcGxpZXMgdG8gdGhlIHN0cmVhbS5cbiAgICogQWNjb3JkaW5nIHRvIHRoZSBmcmFtZSB0eXBlIG9mIHRoZSBwcmV2aW91cyBub2RlLCB0aGUgbWV0aG9kIGNhbGxzIG9uZVxuICAgKiBvZiB0aGUgZm9sbG93aW5nIG1ldGhvZCBgcHJvY2Vzc1ZlY3RvcmAsIGBwcm9jZXNzU2lnbmFsYCBvciBgcHJvY2Vzc1NjYWxhcmBcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGZyYW1lIC0gRnJhbWUgKHRpbWUsIGRhdGEsIGFuZCBtZXRhZGF0YSkgYXMgZ2l2ZW4gYnkgdGhlXG4gICAqICBwcmV2aW91cyBvcGVyYXRvci4gVGhlIGluY29tbWluZyBmcmFtZSBzaG91bGQgbmV2ZXIgYmUgbW9kaWZpZWQgYnlcbiAgICogIHRoZSBvcGVyYXRvci5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJlcGFyZUZyYW1lfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9wYWdhdGVGcmFtZX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIHRoaXMucHJlcGFyZUZyYW1lKCk7XG5cbiAgICAvLyBmcmFtZVRpbWUgYW5kIGZyYW1lTWV0YWRhdGEgZGVmYXVsdHMgdG8gaWRlbnRpdHlcbiAgICB0aGlzLmZyYW1lLnRpbWUgPSBmcmFtZS50aW1lO1xuICAgIHRoaXMuZnJhbWUubWV0YWRhdGEgPSBmcmFtZS5tZXRhZGF0YTtcblxuICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uKGZyYW1lKTtcbiAgICB0aGlzLnByb3BhZ2F0ZUZyYW1lKCk7XG4gIH1cblxuICAvKipcbiAgICogUG9pbnRlciB0byB0aGUgbWV0aG9kIGNhbGxlZCBpbiBgcHJvY2Vzc0ZyYW1lYCBhY2NvcmRpbmcgdG8gdGhlXG4gICAqIGZyYW1lIHR5cGUgb2YgdGhlIHByZXZpb3VzIG9wZXJhdG9yLiBJcyBkeW5hbWljYWxseSBhc3NpZ25lZCBpblxuICAgKiBgcHJlcGFyZVN0cmVhbVBhcmFtc2AuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3ByZXBhcmVTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NGcmFtZX1cbiAgICovXG4gIHByb2Nlc3NGdW5jdGlvbihmcmFtZSkge1xuICAgIHRoaXMuZnJhbWUgPSBmcmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21tb24gbG9naWMgdG8gcGVyZm9ybSBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBgcHJvY2Vzc0ZyYW1lYC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc0ZyYW1lfVxuICAgKi9cbiAgcHJlcGFyZUZyYW1lKCkge1xuICAgIGlmICh0aGlzLl9yZWluaXQgPT09IHRydWUpIHtcbiAgICAgIGNvbnN0IHN0cmVhbVBhcmFtcyA9IHRoaXMucHJldk1vZHVsZSAhPT0gbnVsbCA/IHRoaXMucHJldk1vZHVsZS5zdHJlYW1QYXJhbXMgOiB7fTtcbiAgICAgIHRoaXMuaW5pdFN0cmVhbShzdHJlYW1QYXJhbXMpO1xuICAgICAgdGhpcy5fcmVpbml0ID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZvcndhcmQgdGhlIGN1cnJlbnQgYGZyYW1lYCB0byB0aGUgbmV4dCBvcGVyYXRvcnMsIGlzIGNhbGxlZCBhdCB0aGUgZW5kIG9mXG4gICAqIGBwcm9jZXNzRnJhbWVgLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzRnJhbWV9XG4gICAqL1xuICBwcm9wYWdhdGVGcmFtZSgpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubmV4dE1vZHVsZXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgdGhpcy5uZXh0TW9kdWxlc1tpXS5wcm9jZXNzRnJhbWUodGhpcy5mcmFtZSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmFzZUxmbztcbiJdfQ==