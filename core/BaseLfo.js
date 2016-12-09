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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2VMZm8uanMiXSwibmFtZXMiOlsiaWQiLCJCYXNlTGZvIiwiZGVmaW5pdGlvbnMiLCJvcHRpb25zIiwiY2lkIiwicGFyYW1zIiwiYWRkTGlzdGVuZXIiLCJvblBhcmFtVXBkYXRlIiwiYmluZCIsInN0cmVhbVBhcmFtcyIsImZyYW1lVHlwZSIsImZyYW1lU2l6ZSIsImZyYW1lUmF0ZSIsImRlc2NyaXB0aW9uIiwic291cmNlU2FtcGxlUmF0ZSIsInNvdXJjZVNhbXBsZUNvdW50IiwiZnJhbWUiLCJ0aW1lIiwiZGF0YSIsIm1ldGFkYXRhIiwibmV4dE9wcyIsInByZXZPcCIsIl9yZWluaXQiLCJnZXREZWZpbml0aW9ucyIsInJlc2V0IiwibmFtZSIsInZhbHVlIiwibWV0YXMiLCJraW5kIiwibmV4dCIsIkVycm9yIiwicHVzaCIsInByb2Nlc3NTdHJlYW1QYXJhbXMiLCJmb3JFYWNoIiwiZGlzY29ubmVjdCIsImluZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsImxlbmd0aCIsImRlc3Ryb3kiLCJyZXNldFN0cmVhbSIsImkiLCJsIiwiZW5kVGltZSIsImZpbmFsaXplU3RyZWFtIiwicHJldlN0cmVhbVBhcmFtcyIsInByZXBhcmVTdHJlYW1QYXJhbXMiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJwcmV2RnJhbWVUeXBlIiwicHJvY2Vzc1NjYWxhciIsInByb2Nlc3NGdW5jdGlvbiIsInByb2Nlc3NWZWN0b3IiLCJwcm9jZXNzU2lnbmFsIiwiY29uc3RydWN0b3IiLCJGbG9hdDMyQXJyYXkiLCJwcmVwYXJlRnJhbWUiLCJwcm9wYWdhdGVGcmFtZSIsImluaXRTdHJlYW0iLCJwcm9jZXNzRnJhbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFJQSxLQUFLLENBQVQ7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QVIsRUFBV0MsSUFBSSxLQUFLdEIsT0FBTCxDQUFha0IsTUFBakMsRUFBeUNHLElBQUlDLENBQTdDLEVBQWdERCxHQUFoRDtBQUNFLGFBQUtyQixPQUFMLENBQWFxQixDQUFiLEVBQWdCVCxtQkFBaEIsQ0FBb0MsS0FBS3ZCLFlBQXpDO0FBREY7QUFFRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OztpQ0FhYU8sSyxFQUFPO0FBQ2xCLFdBQUt1QyxZQUFMOztBQUVBO0FBQ0EsV0FBS3ZDLEtBQUwsQ0FBV0MsSUFBWCxHQUFrQkQsTUFBTUMsSUFBeEI7QUFDQSxXQUFLRCxLQUFMLENBQVdHLFFBQVgsR0FBc0JILE1BQU1HLFFBQTVCOztBQUVBLFdBQUsrQixlQUFMLENBQXFCbEMsS0FBckI7QUFDQSxXQUFLd0MsY0FBTDtBQUNEOztBQUVEOzs7Ozs7Ozs7OztvQ0FRZ0J4QyxLLEVBQU87QUFDckIsV0FBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O21DQUtlO0FBQ2IsVUFBSSxLQUFLTSxPQUFMLEtBQWlCLElBQXJCLEVBQTJCO0FBQ3pCLFlBQU1iLGVBQWUsS0FBS1ksTUFBTCxLQUFnQixJQUFoQixHQUF1QixLQUFLQSxNQUFMLENBQVlaLFlBQW5DLEdBQWtELEVBQXZFO0FBQ0EsYUFBS2dELFVBQUwsQ0FBZ0JoRCxZQUFoQjtBQUNBLGFBQUthLE9BQUwsR0FBZSxLQUFmO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7O3FDQU1pQjtBQUNmLFdBQUssSUFBSW1CLElBQUksQ0FBUixFQUFXQyxJQUFJLEtBQUt0QixPQUFMLENBQWFrQixNQUFqQyxFQUF5Q0csSUFBSUMsQ0FBN0MsRUFBZ0RELEdBQWhEO0FBQ0UsYUFBS3JCLE9BQUwsQ0FBYXFCLENBQWIsRUFBZ0JpQixZQUFoQixDQUE2QixLQUFLMUMsS0FBbEM7QUFERjtBQUVEOzs7OztrQkFHWWYsTyIsImZpbGUiOiJCYXNlTGZvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhcmFtZXRlcnMgZnJvbSAncGFyYW1ldGVycyc7XG5cbmxldCBpZCA9IDA7XG5cbi8qKlxuICogQmFzZSBgbGZvYCBjbGFzcyB0byBiZSBleHRlbmRlZCBpbiBvcmRlciB0byBjcmVhdGUgbmV3IG5vZGVzLlxuICpcbiAqIE5vZGVzIGFyZSBkaXZpZGVkIGluIDMgY2F0ZWdvcmllczpcbiAqIC0gKipgc291cmNlYCoqIGFyZSByZXNwb25zaWJsZSBmb3IgYWNxdWVyaW5nIGEgc2lnbmFsIGFuZCBpdHMgcHJvcGVydGllc1xuICogICAoZnJhbWVSYXRlLCBmcmFtZVNpemUsIGV0Yy4pXG4gKiAtICoqYHNpbmtgKiogYXJlIGVuZHBvaW50cyBvZiB0aGUgZ3JhcGgsIHN1Y2ggbm9kZXMgY2FuIGJlIHJlY29yZGVycyxcbiAqICAgdmlzdWFsaXplcnMsIGV0Yy5cbiAqIC0gKipgb3BlcmF0b3JgKiogYXJlIHVzZWQgdG8gbWFrZSBjb21wdXRhdGlvbiBvbiB0aGUgaW5wdXQgc2lnbmFsIGFuZFxuICogICBmb3J3YXJkIHRoZSByZXN1bHRzIGJlbG93IGluIHRoZSBncmFwaC5cbiAqXG4gKiBJbiBtb3N0IGNhc2VzIHRoZSBtZXRob2RzIHRvIG92ZXJyaWRlIC8gZXh0ZW5kIGFyZTpcbiAqIC0gdGhlICoqYGNvbnN0cnVjdG9yYCoqIHRvIGRlZmluZSB0aGUgcGFyYW1ldGVycyBvZiB0aGUgbmV3IGxmbyBub2RlLlxuICogLSB0aGUgKipgcHJvY2Vzc1N0cmVhbVBhcmFtc2AqKiBtZXRob2QgdG8gZGVmaW5lIGhvdyB0aGUgbm9kZSBtb2RpZnkgdGhlXG4gKiAgIHN0cmVhbSBhdHRyaWJ1dGVzIChlLmcuIGJ5IGNoYW5naW5nIHRoZSBmcmFtZSBzaXplKVxuICogLSB0aGUgKipgcHJvY2Vzc3tGcmFtZVR5cGV9YCoqIG1ldGhvZCB0byBkZWZpbmUgdGhlIG9wZXJhdGlvbnMgdGhhdCB0aGVcbiAqICAgbm9kZSBhcHBseSBvbiB0aGUgc3RyZWFtLiBUaGUgdHlwZSBvZiBpbnB1dCBhIG5vZGUgY2FuIGhhbmRsZSBpcyBkZWZpbmVcbiAqICAgYnkgaXRzIGltcGxlbWVudGVkIGludGVyZmFjZSwgaWYgaXQgaW1wbGVtZW50cyBgcHJvY2Vzc1NpZ25hbGAgYSBzdHJlYW1cbiAqICAgd2l0aCBgZnJhbWVUeXBlID09PSAnc2lnbmFsJ2AgY2FuIGJlIHByb2Nlc3NlZCwgYHByb2Nlc3NWZWN0b3JgIHRvIGhhbmRsZVxuICogICBhbiBpbnB1dCBvZiB0eXBlIGB2ZWN0b3JgLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9UaGlzIGNsYXNzIHNob3VsZCBiZSBjb25zaWRlcmVkIGFic3RyYWN0IGFuZCBvbmx5XG4gKiBiZSB1c2VkIHRvIGJlIGV4dGVuZGVkLl88L3NwYW4+XG4gKlxuICpcbiAqIC8vIG92ZXJ2aWV3IG9mIHRoZSBiZWhhdmlvciBvZiBhIG5vZGVcbiAqXG4gKiAqKnByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykqKlxuICpcbiAqIGBiYXNlYCBjbGFzcyAoZGVmYXVsdCBpbXBsZW1lbnRhdGlvbilcbiAqIC0gY2FsbCBgcHJlcHJvY2Vzc1N0cmVhbVBhcmFtc2BcbiAqIC0gY2FsbCBgcHJvcGFnYXRlU3RyZWFtUGFyYW1zYFxuICpcbiAqIGBjaGlsZGAgY2xhc3NcbiAqIC0gY2FsbCBgcHJlcHJvY2Vzc1N0cmVhbVBhcmFtc2BcbiAqIC0gb3ZlcnJpZGUgc29tZSBvZiB0aGUgaW5oZXJpdGVkIGBzdHJlYW1QYXJhbXNgXG4gKiAtIGNyZWF0ZXMgdGhlIGFueSByZWxhdGVkIGxvZ2ljIGJ1ZmZlcnNcbiAqIC0gY2FsbCBgcHJvcGFnYXRlU3RyZWFtUGFyYW1zYFxuICpcbiAqIF9zaG91bGQgbm90IGNhbGwgYHN1cGVyLnByb2Nlc3NTdHJlYW1QYXJhbXNgX1xuICpcbiAqICoqcHJlcGFyZVN0cmVhbVBhcmFtcygpKipcbiAqXG4gKiAtIGFzc2lnbiBwcmV2U3RyZWFtUGFyYW1zIHRvIHRoaXMuc3RyZWFtUGFyYW1zXG4gKiAtIGNoZWNrIGlmIHRoZSBjbGFzcyBpbXBsZW1lbnRzIHRoZSBjb3JyZWN0IGBwcm9jZXNzSW5wdXRgIG1ldGhvZFxuICpcbiAqIF9zaG91bGRuJ3QgYmUgZXh0ZW5kZWQsIG9ubHkgY29uc3VtZWQgaW4gYHByb2Nlc3NTdHJlYW1QYXJhbXNgX1xuICpcbiAqICoqcHJvcGFnYXRlU3RyZWFtUGFyYW1zKCkqKlxuICpcbiAqIC0gY3JlYXRlcyB0aGUgYGZyYW1lRGF0YWAgYnVmZmVyXG4gKiAtIHByb3BhZ2F0ZSBgc3RyZWFtUGFyYW1zYCB0byBjaGlsZHJlblxuICpcbiAqIF9zaG91bGRuJ3QgYmUgZXh0ZW5kZWQsIG9ubHkgY29uc3VtZWQgaW4gYHByb2Nlc3NTdHJlYW1QYXJhbXNgX1xuICpcbiAqICoqcHJvY2Vzc0ZyYW1lKCkqKlxuICpcbiAqIGBiYXNlYCBjbGFzcyAoZGVmYXVsdCBpbXBsZW1lbnRhdGlvbilcbiAqIC0gY2FsbCBgcHJlcHJvY2Vzc0ZyYW1lYFxuICogLSBhc3NpZ24gZnJhbWVUaW1lIGFuZCBmcmFtZU1ldGFkYXRhIHRvIGlkZW50aXR5XG4gKiAtIGNhbGwgdGhlIHByb3BlciBmdW5jdGlvbiBhY2NvcmRpbmcgdG8gaW5wdXRUeXBlXG4gKiAtIGNhbGwgYHByb3BhZ2F0ZUZyYW1lYFxuICpcbiAqIGBjaGlsZGAgY2xhc3NcbiAqIC0gY2FsbCBgcHJlcHJvY2Vzc0ZyYW1lYFxuICogLSBkbyB3aGF0ZXZlciB5b3Ugd2FudCB3aXRoIGluY29tbWluZyBmcmFtZVxuICogLSBjYWxsIGBwcm9wYWdhdGVGcmFtZWBcbiAqXG4gKiBfc2hvdWxkIG5vdCBjYWxsIGBzdXBlci5wcm9jZXNzRnJhbWVgX1xuICpcbiAqICoqcHJlcGFyZUZyYW1lKCkqKlxuICpcbiAqIC0gaWYgYHJlaW5pdGAgYW5kIHRyaWdnZXIgYHByb2Nlc3NTdHJlYW1QYXJhbXNgIGlmIG5lZWRlZFxuICpcbiAqIF9zaG91bGRuJ3QgYmUgZXh0ZW5kZWQsIG9ubHkgY29uc3VtZWQgaW4gYHByb2Nlc3NGcmFtZWBfXG4gKlxuICogKipwcm9wYWdhdGVGcmFtZSgpKipcbiAqXG4gKiAtIHByb3BhZ2F0ZSBmcmFtZSB0byBjaGlsZHJlblxuICpcbiAqIF9zaG91bGRuJ3QgYmUgZXh0ZW5kZWQsIG9ubHkgY29uc3VtZWQgaW4gYHByb2Nlc3NGcmFtZWBfXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb3JlXG4gKi9cbmNsYXNzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihkZWZpbml0aW9ucyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmNpZCA9IGlkKys7XG5cbiAgICAvKipcbiAgICAgKiBQYXJhbWV0ZXIgYmFnIGNvbnRhaW5pbmcgcGFyYW1ldGVyIGluc3RhbmNlcy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgcGFyYW1zXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvXG4gICAgICovXG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbWV0ZXJzKGRlZmluaXRpb25zLCBvcHRpb25zKTtcbiAgICAvLyBsaXN0ZW4gZm9yIHBhcmFtIHVwZGF0ZXNcbiAgICB0aGlzLnBhcmFtcy5hZGRMaXN0ZW5lcih0aGlzLm9uUGFyYW1VcGRhdGUuYmluZCh0aGlzKSk7XG5cbiAgICAvKipcbiAgICAgKiBEZXNjcmlwdGlvbiBvZiB0aGUgc3RyZWFtIG91dHB1dCBvZiB0aGUgbm9kZS5cbiAgICAgKiBTZXQgdG8gYG51bGxgIHdoZW4gdGhlIG5vZGUgaXMgZGVzdHJveWVkLlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZnJhbWVTaXplIC0gRnJhbWUgc2l6ZSBhdCB0aGUgb3V0cHV0IG9mIHRoZSBub2RlLlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBmcmFtZVJhdGUgLSBGcmFtZSByYXRlIGF0IHRoZSBvdXRwdXQgb2YgdGhlIG5vZGUuXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGZyYW1lVHlwZSAtIEZyYW1lIHR5cGUgYXQgdGhlIG91dHB1dCBvZiB0aGUgbm9kZSxcbiAgICAgKiAgcG9zc2libGUgdmFsdWVzIGFyZSBgc2lnbmFsYCwgYHZlY3RvcmAgb3IgYHNjYWxhcmAuXG4gICAgICogQHByb3BlcnR5IHtBcnJheXxTdHJpbmd9IGRlc2NyaXB0aW9uIC0gSWYgdHlwZSBpcyBgdmVjdG9yYCwgZGVzY3JpYmVcbiAgICAgKiAgdGhlIGRpbWVuc2lvbihzKSBvZiBvdXRwdXQgc3RyZWFtLlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBzb3VyY2VTYW1wbGVSYXRlIC0gU2FtcGxlIHJhdGUgb2YgdGhlIHNvdXJjZSBvZiB0aGVcbiAgICAgKiAgZ3JhcGguIF9UaGUgdmFsdWUgc2hvdWxkIGJlIGRlZmluZWQgYnkgc291cmNlcyBhbmQgbmV2ZXIgbW9kaWZpZWRfLlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBzb3VyY2VTYW1wbGVDb3VudCAtIE51bWJlciBvZiBjb25zZWN1dGl2ZSBkaXNjcmV0ZVxuICAgICAqICB0aW1lIHZhbHVlcyBjb250YWluZWQgaW4gdGhlIGRhdGEgZnJhbWUgb3V0cHV0IGJ5IHRoZSBzb3VyY2UuXG4gICAgICogIF9UaGUgdmFsdWUgc2hvdWxkIGJlIGRlZmluZWQgYnkgc291cmNlcyBhbmQgbmV2ZXIgbW9kaWZpZWRfLlxuICAgICAqXG4gICAgICogQG5hbWUgc3RyZWFtUGFyYW1zXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvXG4gICAgICovXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMgPSB7XG4gICAgICBmcmFtZVR5cGU6IG51bGwsXG4gICAgICBmcmFtZVNpemU6IDEsXG4gICAgICBmcmFtZVJhdGU6IDAsXG4gICAgICBkZXNjcmlwdGlvbjogbnVsbCxcbiAgICAgIHNvdXJjZVNhbXBsZVJhdGU6IDAsXG4gICAgICBzb3VyY2VTYW1wbGVDb3VudDogbnVsbCxcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3VycmVudCBmcmFtZS4gVGhpcyBvYmplY3QgYW5kIGl0cyBkYXRhIGFyZSB1cGRhdGVkIGF0IGVhY2ggaW5jb21taW5nXG4gICAgICogZnJhbWUgd2l0aG91dCByZWFsbG9jYXRpbmcgbWVtb3J5LlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAbmFtZSBmcmFtZVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB0aW1lIC0gVGltZSBvZiB0aGUgY3VycmVudCBmcmFtZS5cbiAgICAgKiBAcHJvcGVydHkge0Zsb2F0MzJBcnJheX0gZGF0YSAtIERhdGEgb2YgdGhlIGN1cnJlbnQgZnJhbWUuXG4gICAgICogQHByb3BlcnR5IHtPYmplY3R9IG1ldGFkYXRhIC0gTWV0YWRhdGEgYXNzb2NpdGVkIHRvIHRoZSBjdXJyZW50IGZyYW1lLlxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqL1xuICAgIHRoaXMuZnJhbWUgPSB7XG4gICAgICB0aW1lOiAwLFxuICAgICAgZGF0YTogbnVsbCxcbiAgICAgIG1ldGFkYXRhOiB7fSxcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiBub2RlcyBjb25uZWN0ZWQgdG8gdGhlIG91cHV0IG9mIHRoZSBub2RlIChsb3dlciBpbiB0aGUgZ3JhcGgpLlxuICAgICAqIEF0IGVhY2ggZnJhbWUsIHRoZSBub2RlIGZvcndhcmQgaXRzIGBmcmFtZWAgdG8gdG8gYWxsIGl0cyBgbmV4dE9wc2AuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7QXJyYXk8QmFzZUxmbz59XG4gICAgICogQG5hbWUgbmV4dE9wc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Nvbm5lY3R9XG4gICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jZGlzY29ubmVjdH1cbiAgICAgKi9cbiAgICB0aGlzLm5leHRPcHMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBub2RlIGZyb20gd2hpY2ggdGhlIG5vZGUgcmVjZWl2ZSB0aGUgZnJhbWVzICh1cHBlciBpbiB0aGUgZ3JhcGgpLlxuICAgICAqXG4gICAgICogQHR5cGUge0Jhc2VMZm99XG4gICAgICogQG5hbWUgcHJldk9wXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvXG4gICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jY29ubmVjdH1cbiAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNkaXNjb25uZWN0fVxuICAgICAqL1xuICAgIHRoaXMucHJldk9wID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIElzIHNldCB0byB0cnVlIHdoZW4gYSBzdGF0aWMgcGFyYW1ldGVyIGlzIHVwZGF0ZWQuIE9uIHRoZSBuZXh0IGlucHV0XG4gICAgICogZnJhbWUgYWxsIHRoZSBzdWJncmFwaCBzdHJlYW1QYXJhbXMgc3RhcnRpbmcgZnJvbSB0aGlzIG5vZGUgd2lsbCBiZVxuICAgICAqIHVwZGF0ZWQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAbmFtZSBfcmVpbml0XG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9yZWluaXQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIG9iamVjdCBkZXNjcmliaW5nIGVhY2ggYXZhaWxhYmxlIHBhcmFtZXRlciBvZiB0aGUgbm9kZS5cbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgZ2V0UGFyYW1zRGVzY3JpcHRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLmdldERlZmluaXRpb25zKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgYWxsIHBhcmFtZXRlcnMgdG8gdGhlaXIgaW5pdGlhbCB2YWx1ZSAoYXMgZGVmaW5lZCBvbiBpbnN0YW50aWNhdGlvbilcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jc3RyZWFtUGFyYW1zfVxuICAgKi9cbiAgcmVzZXRQYXJhbXMoKSB7XG4gICAgdGhpcy5wYXJhbXMucmVzZXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiBjYWxsZWQgd2hlbiBhIHBhcmFtIGlzIHVwZGF0ZWQuIEJ5IGRlZmF1bHQgc2V0IHRoZSBgX3JlaW5pdGBcbiAgICogZmxhZyB0byBgdHJ1ZWAgaWYgdGhlIHBhcmFtIGlzIGBzdGF0aWNgIG9uZS4gVGhpcyBtZXRob2Qgc2hvdWxkIGJlXG4gICAqIGV4dGVuZGVkIHRvIGhhbmRsZSBwYXJ0aWN1bGFyIGxvZ2ljIGJvdW5kIHRvIGEgc3BlY2lmaWMgcGFyYW1ldGVyLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgLSBWYWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gbWV0YXMgLSBNZXRhZGF0YSBhc3NvY2lhdGVkIHRvIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBvblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcyA9IHt9KSB7XG4gICAgaWYgKG1ldGFzLmtpbmQgPT09ICdzdGF0aWMnKVxuICAgICAgdGhpcy5fcmVpbml0ID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25uZWN0IHRoZSBjdXJyZW50IG5vZGUgKGBwcmV2T3BgKSB0byBhbm90aGVyIG5vZGUgKGBuZXh0T3BgKS5cbiAgICogQSBnaXZlbiBub2RlIGNhbiBiZSBjb25uZWN0ZWQgdG8gc2V2ZXJhbCBvcGVyYXRvcnMgYW5kIHByb3BhZ2F0ZSB0aGVcbiAgICogc3RyZWFtIHRvIGVhY2ggb2YgdGhlbS5cbiAgICpcbiAgICogQHBhcmFtIHtCYXNlTGZvfSBuZXh0IC0gTmV4dCBvcGVyYXRvciBpbiB0aGUgZ3JhcGguXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NGcmFtZX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jZGlzY29ubmVjdH1cbiAgICovXG4gIGNvbm5lY3QobmV4dCkge1xuICAgIGlmICghKG5leHQgaW5zdGFuY2VvZiBCYXNlTGZvKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb25uZWN0aW9uOiBjaGlsZCBub2RlIGlzIG5vdCBhbiBpbnN0YW5jZSBvZiBgQmFzZUxmb2AnKTtcblxuICAgIGlmICh0aGlzLnN0cmVhbVBhcmFtcyA9PT0gbnVsbCB8fG5leHQuc3RyZWFtUGFyYW1zID09PSBudWxsKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvbm5lY3Rpb246IGNhbm5vdCBjb25uZWN0IGEgZGVhZCBub2RlJyk7XG5cbiAgICB0aGlzLm5leHRPcHMucHVzaChuZXh0KTtcbiAgICBuZXh0LnByZXZPcCA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlICE9PSBudWxsKSAvLyBncmFwaCBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWRcbiAgICAgIG5leHQucHJvY2Vzc1N0cmVhbVBhcmFtcyh0aGlzLnN0cmVhbVBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBnaXZlbiBvcGVyYXRvciBmcm9tIGl0cyBwcmV2aW91cyBvcGVyYXRvcnMnIGBuZXh0T3BzYC5cbiAgICpcbiAgICogQHBhcmFtIHtCYXNlTGZvfSBbbmV4dD1udWxsXSAtIFRoZSBvcGVyYXRvciB0byBkaXNjb25uZWN0IGZyb20gdGhlIGN1cnJlbnRcbiAgICogIG9wZXJhdG9yLiBJZiBgbnVsbGAgZGlzY29ubmVjdCBhbGwgdGhlIG5leHQgb3BlcmF0b3JzLlxuICAgKi9cbiAgZGlzY29ubmVjdChuZXh0ID0gbnVsbCkge1xuICAgIGlmIChuZXh0ID09PSBudWxsKSB7XG4gICAgICB0aGlzLm5leHRPcHMuZm9yRWFjaCgobmV4dCkgPT4gdGhpcy5kaXNjb25uZWN0KG5leHQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLm5leHRPcHMuaW5kZXhPZih0aGlzKTtcbiAgICAgIHRoaXMubmV4dE9wcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgbmV4dC5wcmV2T3AgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IGFsbCB0aGUgbm9kZXMgaW4gdGhlIHN1Yi1ncmFwaCBzdGFydGluZyBmcm9tIHRoZSBjdXJyZW50IG5vZGUuXG4gICAqIFdoZW4gZGV0cm95ZWQsIHRoZSBgc3RyZWFtUGFyYW1zYCBvZiB0aGUgbm9kZSBhcmUgc2V0IHRvIGBudWxsYCwgdGhlXG4gICAqIG9wZXJhdG9yIGlzIHRoZW4gY29uc2lkZXJlZCBhcyBgZGVhZGAgYW5kIGNhbm5vdCBiZSByZWNvbm5lY3RlZC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jY29ubmVjdH1cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gZGVzdHJveSBhbGwgY2hpZHJlblxuICAgIGxldCBpbmRleCA9IHRoaXMubmV4dE9wcy5sZW5ndGg7XG5cbiAgICB3aGlsZSAoaW5kZXgtLSlcbiAgICAgIHRoaXMubmV4dE9wc1tpbmRleF0uZGVzdHJveSgpO1xuXG4gICAgLy8gZGlzY29ubmVjdCBpdHNlbGYgZnJvbSB0aGUgcHJldmlvdXMgb3BlcmF0b3JcbiAgICBpZiAodGhpcy5wcmV2T3ApXG4gICAgICB0aGlzLnByZXZPcC5kaXNjb25uZWN0KHRoaXMpO1xuXG4gICAgLy8gbWFyayB0aGUgb2JqZWN0IGFzIGRlYWRcbiAgICB0aGlzLnN0cmVhbVBhcmFtcyA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIHRvIGluaXRpYWxpemUgdGhlIHN0cmVhbSBpbiBzdGFuZGFsb25lIG1vZGUuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbc3RyZWFtUGFyYW1zPXt9XSAtIFN0cmVhbSBwYXJhbWV0ZXJzIHRvIGJlIHVzZWQuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Jlc2V0U3RyZWFtfVxuICAgKi9cbiAgaW5pdFN0cmVhbShzdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIHRoaXMucHJvY2Vzc1N0cmVhbVBhcmFtcyhzdHJlYW1QYXJhbXMpO1xuICAgIHRoaXMucmVzZXRTdHJlYW0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgYGZyYW1lLmRhdGFgIGJ1ZmZlciBieSBzZXR0aW5nIGFsbCBpdHMgdmFsdWVzIHRvIDAuXG4gICAqIEEgc291cmNlIG9wZXJhdG9yIHNob3VsZCBjYWxsIGBwcm9jZXNzU3RyZWFtUGFyYW1zYCBhbmQgYHJlc2V0U3RyZWFtYCB3aGVuXG4gICAqIHN0YXJ0ZWQsIGVhY2ggb2YgdGhlc2UgbWV0aG9kIHByb3BhZ2F0ZSB0aHJvdWdoIHRoZSBncmFwaCBhdXRvbWF0aWNhbHkuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqL1xuICByZXNldFN0cmVhbSgpIHtcbiAgICAvLyBidXR0b20gdXBcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubmV4dE9wcy5sZW5ndGg7IGkgPCBsOyBpKyspXG4gICAgICB0aGlzLm5leHRPcHNbaV0ucmVzZXRTdHJlYW0oKTtcblxuICAgIC8vIG5vIGJ1ZmZlciBmb3IgYHNjYWxhcmAgdHlwZSBvciBzaW5rIG5vZGVcbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlICE9PSAnc2NhbGFyJyAmJiB0aGlzLmZyYW1lLmRhdGEgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspXG4gICAgICAgIGRhdGFbaV0gPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5hbGl6ZSB0aGUgc3RyZWFtLiBBIHNvdXJjZSBub2RlIHNob3VsZCBjYWxsIHRoaXMgbWV0aG9kIHdoZW4gc3RvcHBlZCxcbiAgICogYGZpbmFsaXplU3RyZWFtYCBpcyBhdXRvbWF0aWNhbGx5IHByb3BhZ2F0ZWQgdGhyb3VnaHQgdGhlIGdyYXBoLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gZW5kVGltZSAtIExvZ2ljYWwgdGltZSBhdCB3aGljaCB0aGUgZ3JhcGggaXMgc3RvcHBlZC5cbiAgICovXG4gIGZpbmFsaXplU3RyZWFtKGVuZFRpbWUpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubmV4dE9wcy5sZW5ndGg7IGkgPCBsOyBpKyspXG4gICAgICB0aGlzLm5leHRPcHNbaV0uZmluYWxpemVTdHJlYW0oZW5kVGltZSk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBvciB1cGRhdGUgdGhlIG9wZXJhdG9yJ3MgYHN0cmVhbVBhcmFtc2AgYWNjb3JkaW5nIHRvIHRoZVxuICAgKiBwcmV2aW91cyBvcGVyYXRvcnMgYHN0cmVhbVBhcmFtc2AgdmFsdWVzLlxuICAgKlxuICAgKiBXaGVuIGltcGxlbWVudGluZyBhIG5ldyBvcGVyYXRvciB0aGlzIG1ldGhvZCBzaG91bGQ6XG4gICAqIDEuIGNhbGwgYHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtc2Agd2l0aCB0aGUgZ2l2ZW4gYHByZXZTdHJlYW1QYXJhbXNgXG4gICAqIDIuIG9wdGlvbm5hbGx5IGNoYW5nZSB2YWx1ZXMgdG8gYHRoaXMuc3RyZWFtUGFyYW1zYCBhY2NvcmRpbmcgdG8gdGhlXG4gICAqICAgIGxvZ2ljIHBlcmZvcm1lZCBieSB0aGUgb3BlcmF0b3IuXG4gICAqIDMuIG9wdGlvbm5hbGx5IGFsbG9jYXRlIG1lbW9yeSBmb3IgcmluZyBidWZmZXJzLCBldGMuXG4gICAqIDQuIGNhbGwgYHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zYCB0byB0cmlnZ2VyIHRoZSBtZXRob2Qgb24gdGhlIG5leHRcbiAgICogICAgb3BlcmF0b3JzIGluIHRoZSBncmFwaC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHByZXZTdHJlYW1QYXJhbXMgLSBgc3RyZWFtUGFyYW1zYCBvZiB0aGUgcHJldmlvdXMgb3BlcmF0b3IuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3ByZXBhcmVTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb3BhZ2F0ZVN0cmVhbVBhcmFtc31cbiAgICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyA9IHt9KSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKipcbiAgICogQ29tbW9uIGxvZ2ljIHRvIGRvIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGBwcm9jZXNzU3RyZWFtUGFyYW1gLCBtdXN0IGJlXG4gICAqIGNhbGxlZCBhdCB0aGUgYmVnaW5uaW5nIG9mIGFueSBgcHJvY2Vzc1N0cmVhbVBhcmFtYCBpbXBsZW1lbnRhdGlvbi5cbiAgICpcbiAgICogVGhlIG1ldGhvZCBtYWlubHkgY2hlY2sgaWYgdGhlIGN1cnJlbnQgbm9kZSBpbXBsZW1lbnQgdGhlIGludGVyZmFjZSB0b1xuICAgKiBoYW5kbGUgdGhlIHR5cGUgb2YgZnJhbWUgcHJvcGFnYXRlZCBieSBpdCdzIHBhcmVudDpcbiAgICogLSB0byBoYW5kbGUgYSBgdmVjdG9yYCBmcmFtZSB0eXBlLCB0aGUgY2xhc3MgbXVzdCBpbXBsZW1lbnQgYHByb2Nlc3NWZWN0b3JgXG4gICAqIC0gdG8gaGFuZGxlIGEgYHNpZ25hbGAgZnJhbWUgdHlwZSwgdGhlIGNsYXNzIG11c3QgaW1wbGVtZW50IGBwcm9jZXNzU2lnbmFsYFxuICAgKiAtIGluIGNhc2Ugb2YgYSAnc2NhbGFyJyBmcmFtZSB0eXBlLCB0aGUgY2xhc3MgY2FuIGltcGxlbWVudCBhbnkgb2YgdGhlXG4gICAqIGZvbGxvd2luZyBieSBvcmRlciBvZiBwcmVmZXJlbmNlOiBgcHJvY2Vzc1NjYWxhcmAsIGBwcm9jZXNzVmVjdG9yYCxcbiAgICogYHByb2Nlc3NTaWduYWxgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJldlN0cmVhbVBhcmFtcyAtIGBzdHJlYW1QYXJhbXNgIG9mIHRoZSBwcmV2aW91cyBvcGVyYXRvci5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvcGFnYXRlU3RyZWFtUGFyYW1zfVxuICAgKi9cbiAgcHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zID0ge30pIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuc3RyZWFtUGFyYW1zLCBwcmV2U3RyZWFtUGFyYW1zKTtcbiAgICBjb25zdCBwcmV2RnJhbWVUeXBlID0gcHJldlN0cmVhbVBhcmFtcy5mcmFtZVR5cGU7XG5cbiAgICBzd2l0Y2ggKHByZXZGcmFtZVR5cGUpIHtcbiAgICAgIGNhc2UgJ3NjYWxhcic6XG4gICAgICAgIGlmICh0aGlzLnByb2Nlc3NTY2FsYXIpXG4gICAgICAgICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLnByb2Nlc3NTY2FsYXI7XG4gICAgICAgIGVsc2UgaWYgKHRoaXMucHJvY2Vzc1ZlY3RvcilcbiAgICAgICAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbiA9IHRoaXMucHJvY2Vzc1ZlY3RvcjtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5wcm9jZXNzU2lnbmFsKVxuICAgICAgICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5wcm9jZXNzU2lnbmFsO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMuY29uc3RydWN0b3IubmFtZX0gLSBubyBcInByb2Nlc3NcIiBmdW5jdGlvbiBmb3VuZGApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3ZlY3Rvcic6XG4gICAgICAgIGlmICghKCdwcm9jZXNzVmVjdG9yJyBpbiB0aGlzKSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSAtIFwicHJvY2Vzc1ZlY3RvclwiIGlzIG5vdCBkZWZpbmVkYCk7XG5cbiAgICAgICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLnByb2Nlc3NWZWN0b3I7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2lnbmFsJzpcbiAgICAgICAgaWYgKCEoJ3Byb2Nlc3NTaWduYWwnIGluIHRoaXMpKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9IC0gXCJwcm9jZXNzU2lnbmFsXCIgaXMgbm90IGRlZmluZWRgKTtcblxuICAgICAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbiA9IHRoaXMucHJvY2Vzc1NpZ25hbDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBkZWZhdWx0cyB0byBwcm9jZXNzRnVuY3Rpb25cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgYHRoaXMuZnJhbWUuZGF0YWAgYnVmZmVyIGFuZCBmb3J3YXJkIHRoZSBvcGVyYXRvcidzIGBzdHJlYW1QYXJhbWBcbiAgICogdG8gYWxsIGl0cyBuZXh0IG9wZXJhdG9ycywgbXVzdCBiZSBjYWxsZWQgYXQgdGhlIGVuZCBvZiBhbnlcbiAgICogYHByb2Nlc3NTdHJlYW1QYXJhbXNgIGltcGxlbWVudGF0aW9uLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcmVwYXJlU3RyZWFtUGFyYW1zfVxuICAgKi9cbiAgcHJvcGFnYXRlU3RyZWFtUGFyYW1zKCkge1xuICAgIHRoaXMuZnJhbWUuZGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5uZXh0T3BzLmxlbmd0aDsgaSA8IGw7IGkrKylcbiAgICAgIHRoaXMubmV4dE9wc1tpXS5wcm9jZXNzU3RyZWFtUGFyYW1zKHRoaXMuc3RyZWFtUGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgdGhlIHBhcnRpY3VsYXIgbG9naWMgdGhlIG9wZXJhdG9yIGFwcGxpZXMgdG8gdGhlIHN0cmVhbS5cbiAgICogQWNjb3JkaW5nIHRvIHRoZSBmcmFtZSB0eXBlIG9mIHRoZSBwcmV2aW91cyBub2RlLCB0aGUgbWV0aG9kIGNhbGxzIG9uZVxuICAgKiBvZiB0aGUgZm9sbG93aW5nIG1ldGhvZCBgcHJvY2Vzc1ZlY3RvcmAsIGBwcm9jZXNzU2lnbmFsYCBvciBgcHJvY2Vzc1NjYWxhcmBcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGZyYW1lIC0gRnJhbWUgKHRpbWUsIGRhdGEsIGFuZCBtZXRhZGF0YSkgYXMgZ2l2ZW4gYnkgdGhlXG4gICAqICBwcmV2aW91cyBvcGVyYXRvci4gVGhlIGluY29tbWluZyBmcmFtZSBzaG91bGQgbmV2ZXIgYmUgbW9kaWZpZWQgYnlcbiAgICogIHRoZSBvcGVyYXRvci5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJlcGFyZUZyYW1lfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9wYWdhdGVGcmFtZX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIHRoaXMucHJlcGFyZUZyYW1lKCk7XG5cbiAgICAvLyBmcmFtZVRpbWUgYW5kIGZyYW1lTWV0YWRhdGEgZGVmYXVsdHMgdG8gaWRlbnRpdHlcbiAgICB0aGlzLmZyYW1lLnRpbWUgPSBmcmFtZS50aW1lO1xuICAgIHRoaXMuZnJhbWUubWV0YWRhdGEgPSBmcmFtZS5tZXRhZGF0YTtcblxuICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uKGZyYW1lKTtcbiAgICB0aGlzLnByb3BhZ2F0ZUZyYW1lKCk7XG4gIH1cblxuICAvKipcbiAgICogUG9pbnRlciB0byB0aGUgbWV0aG9kIGNhbGxlZCBpbiBgcHJvY2Vzc0ZyYW1lYCBhY2NvcmRpbmcgdG8gdGhlXG4gICAqIGZyYW1lIHR5cGUgb2YgdGhlIHByZXZpb3VzIG9wZXJhdG9yLiBJcyBkeW5hbWljYWxseSBhc3NpZ25lZCBpblxuICAgKiBgcHJlcGFyZVN0cmVhbVBhcmFtc2AuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3ByZXBhcmVTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NGcmFtZX1cbiAgICovXG4gIHByb2Nlc3NGdW5jdGlvbihmcmFtZSkge1xuICAgIHRoaXMuZnJhbWUgPSBmcmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21tb24gbG9naWMgdG8gcGVyZm9ybSBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBgcHJvY2Vzc0ZyYW1lYC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc0ZyYW1lfVxuICAgKi9cbiAgcHJlcGFyZUZyYW1lKCkge1xuICAgIGlmICh0aGlzLl9yZWluaXQgPT09IHRydWUpIHtcbiAgICAgIGNvbnN0IHN0cmVhbVBhcmFtcyA9IHRoaXMucHJldk9wICE9PSBudWxsID8gdGhpcy5wcmV2T3Auc3RyZWFtUGFyYW1zIDoge307XG4gICAgICB0aGlzLmluaXRTdHJlYW0oc3RyZWFtUGFyYW1zKTtcbiAgICAgIHRoaXMuX3JlaW5pdCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGb3J3YXJkIHRoZSBjdXJyZW50IGBmcmFtZWAgdG8gdGhlIG5leHQgb3BlcmF0b3JzLCBpcyBjYWxsZWQgYXQgdGhlIGVuZCBvZlxuICAgKiBgcHJvY2Vzc0ZyYW1lYC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc0ZyYW1lfVxuICAgKi9cbiAgcHJvcGFnYXRlRnJhbWUoKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm5leHRPcHMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgdGhpcy5uZXh0T3BzW2ldLnByb2Nlc3NGcmFtZSh0aGlzLmZyYW1lKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCYXNlTGZvO1xuXG4iXX0=