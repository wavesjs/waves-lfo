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
 * @memberof module:common.core
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2VMZm8uanMiXSwibmFtZXMiOlsiaWQiLCJCYXNlTGZvIiwiZGVmaW5pdGlvbnMiLCJvcHRpb25zIiwiY2lkIiwicGFyYW1zIiwiYWRkTGlzdGVuZXIiLCJvblBhcmFtVXBkYXRlIiwiYmluZCIsInN0cmVhbVBhcmFtcyIsImZyYW1lVHlwZSIsImZyYW1lU2l6ZSIsImZyYW1lUmF0ZSIsImRlc2NyaXB0aW9uIiwic291cmNlU2FtcGxlUmF0ZSIsInNvdXJjZVNhbXBsZUNvdW50IiwiZnJhbWUiLCJ0aW1lIiwiZGF0YSIsIm1ldGFkYXRhIiwibmV4dE9wcyIsInByZXZPcCIsIl9yZWluaXQiLCJnZXREZWZpbml0aW9ucyIsInJlc2V0IiwibmFtZSIsInZhbHVlIiwibWV0YXMiLCJraW5kIiwibmV4dCIsIkVycm9yIiwicHVzaCIsInByb2Nlc3NTdHJlYW1QYXJhbXMiLCJmb3JFYWNoIiwiZGlzY29ubmVjdCIsImluZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsImxlbmd0aCIsImRlc3Ryb3kiLCJyZXNldFN0cmVhbSIsImkiLCJsIiwiZW5kVGltZSIsImZpbmFsaXplU3RyZWFtIiwicHJldlN0cmVhbVBhcmFtcyIsInByZXBhcmVTdHJlYW1QYXJhbXMiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJwcmV2RnJhbWVUeXBlIiwicHJvY2Vzc1NjYWxhciIsInByb2Nlc3NGdW5jdGlvbiIsInByb2Nlc3NWZWN0b3IiLCJwcm9jZXNzU2lnbmFsIiwiY29uc3RydWN0b3IiLCJGbG9hdDMyQXJyYXkiLCJwcmVwYXJlRnJhbWUiLCJwcm9wYWdhdGVGcmFtZSIsImluaXRTdHJlYW0iLCJwcm9jZXNzRnJhbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFJQSxLQUFLLENBQVQ7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QVIsRUFBV0MsSUFBSSxLQUFLdEIsT0FBTCxDQUFha0IsTUFBakMsRUFBeUNHLElBQUlDLENBQTdDLEVBQWdERCxHQUFoRDtBQUNFLGFBQUtyQixPQUFMLENBQWFxQixDQUFiLEVBQWdCVCxtQkFBaEIsQ0FBb0MsS0FBS3ZCLFlBQXpDO0FBREY7QUFFRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OztpQ0FhYU8sSyxFQUFPO0FBQ2xCLFdBQUt1QyxZQUFMOztBQUVBO0FBQ0EsV0FBS3ZDLEtBQUwsQ0FBV0MsSUFBWCxHQUFrQkQsTUFBTUMsSUFBeEI7QUFDQSxXQUFLRCxLQUFMLENBQVdHLFFBQVgsR0FBc0JILE1BQU1HLFFBQTVCOztBQUVBLFdBQUsrQixlQUFMLENBQXFCbEMsS0FBckI7QUFDQSxXQUFLd0MsY0FBTDtBQUNEOztBQUVEOzs7Ozs7Ozs7OztvQ0FRZ0J4QyxLLEVBQU87QUFDckIsV0FBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O21DQUtlO0FBQ2IsVUFBSSxLQUFLTSxPQUFMLEtBQWlCLElBQXJCLEVBQTJCO0FBQ3pCLFlBQU1iLGVBQWUsS0FBS1ksTUFBTCxLQUFnQixJQUFoQixHQUF1QixLQUFLQSxNQUFMLENBQVlaLFlBQW5DLEdBQWtELEVBQXZFO0FBQ0EsYUFBS2dELFVBQUwsQ0FBZ0JoRCxZQUFoQjtBQUNBLGFBQUthLE9BQUwsR0FBZSxLQUFmO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7O3FDQU1pQjtBQUNmLFdBQUssSUFBSW1CLElBQUksQ0FBUixFQUFXQyxJQUFJLEtBQUt0QixPQUFMLENBQWFrQixNQUFqQyxFQUF5Q0csSUFBSUMsQ0FBN0MsRUFBZ0RELEdBQWhEO0FBQ0UsYUFBS3JCLE9BQUwsQ0FBYXFCLENBQWIsRUFBZ0JpQixZQUFoQixDQUE2QixLQUFLMUMsS0FBbEM7QUFERjtBQUVEOzs7OztrQkFHWWYsTyIsImZpbGUiOiJCYXNlTGZvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhcmFtZXRlcnMgZnJvbSAncGFyYW1ldGVycyc7XG5cbmxldCBpZCA9IDA7XG5cbi8qKlxuICogQmFzZSBgbGZvYCBjbGFzcyB0byBiZSBleHRlbmRlZCBpbiBvcmRlciB0byBjcmVhdGUgbmV3IG5vZGVzLlxuICpcbiAqIE5vZGVzIGFyZSBkaXZpZGVkIGluIDMgY2F0ZWdvcmllczpcbiAqIC0gKipgc291cmNlYCoqIGFyZSByZXNwb25zaWJsZSBmb3IgYWNxdWVyaW5nIGEgc2lnbmFsIGFuZCBpdHMgcHJvcGVydGllc1xuICogICAoZnJhbWVSYXRlLCBmcmFtZVNpemUsIGV0Yy4pXG4gKiAtICoqYHNpbmtgKiogYXJlIGVuZHBvaW50cyBvZiB0aGUgZ3JhcGgsIHN1Y2ggbm9kZXMgY2FuIGJlIHJlY29yZGVycyxcbiAqICAgdmlzdWFsaXplcnMsIGV0Yy5cbiAqIC0gKipgb3BlcmF0b3JgKiogYXJlIHVzZWQgdG8gbWFrZSBjb21wdXRhdGlvbiBvbiB0aGUgaW5wdXQgc2lnbmFsIGFuZFxuICogICBmb3J3YXJkIHRoZSByZXN1bHRzIGJlbG93IGluIHRoZSBncmFwaC5cbiAqXG4gKiBJbiBtb3N0IGNhc2VzIHRoZSBtZXRob2RzIHRvIG92ZXJyaWRlIC8gZXh0ZW5kIGFyZTpcbiAqIC0gdGhlICoqYGNvbnN0cnVjdG9yYCoqIHRvIGRlZmluZSB0aGUgcGFyYW1ldGVycyBvZiB0aGUgbmV3IGxmbyBub2RlLlxuICogLSB0aGUgKipgcHJvY2Vzc1N0cmVhbVBhcmFtc2AqKiBtZXRob2QgdG8gZGVmaW5lIGhvdyB0aGUgbm9kZSBtb2RpZnkgdGhlXG4gKiAgIHN0cmVhbSBhdHRyaWJ1dGVzIChlLmcuIGJ5IGNoYW5naW5nIHRoZSBmcmFtZSBzaXplKVxuICogLSB0aGUgKipgcHJvY2Vzc3tGcmFtZVR5cGV9YCoqIG1ldGhvZCB0byBkZWZpbmUgdGhlIG9wZXJhdGlvbnMgdGhhdCB0aGVcbiAqICAgbm9kZSBhcHBseSBvbiB0aGUgc3RyZWFtLiBUaGUgdHlwZSBvZiBpbnB1dCBhIG5vZGUgY2FuIGhhbmRsZSBpcyBkZWZpbmVcbiAqICAgYnkgaXRzIGltcGxlbWVudGVkIGludGVyZmFjZSwgaWYgaXQgaW1wbGVtZW50cyBgcHJvY2Vzc1NpZ25hbGAgYSBzdHJlYW1cbiAqICAgd2l0aCBgZnJhbWVUeXBlID09PSAnc2lnbmFsJ2AgY2FuIGJlIHByb2Nlc3NlZCwgYHByb2Nlc3NWZWN0b3JgIHRvIGhhbmRsZVxuICogICBhbiBpbnB1dCBvZiB0eXBlIGB2ZWN0b3JgLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9UaGlzIGNsYXNzIHNob3VsZCBiZSBjb25zaWRlcmVkIGFic3RyYWN0IGFuZCBvbmx5XG4gKiBiZSB1c2VkIHRvIGJlIGV4dGVuZGVkLl88L3NwYW4+XG4gKlxuICpcbiAqIC8vIG92ZXJ2aWV3IG9mIHRoZSBiZWhhdmlvciBvZiBhIG5vZGVcbiAqXG4gKiAqKnByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykqKlxuICpcbiAqIGBiYXNlYCBjbGFzcyAoZGVmYXVsdCBpbXBsZW1lbnRhdGlvbilcbiAqIC0gY2FsbCBgcHJlcHJvY2Vzc1N0cmVhbVBhcmFtc2BcbiAqIC0gY2FsbCBgcHJvcGFnYXRlU3RyZWFtUGFyYW1zYFxuICpcbiAqIGBjaGlsZGAgY2xhc3NcbiAqIC0gY2FsbCBgcHJlcHJvY2Vzc1N0cmVhbVBhcmFtc2BcbiAqIC0gb3ZlcnJpZGUgc29tZSBvZiB0aGUgaW5oZXJpdGVkIGBzdHJlYW1QYXJhbXNgXG4gKiAtIGNyZWF0ZXMgdGhlIGFueSByZWxhdGVkIGxvZ2ljIGJ1ZmZlcnNcbiAqIC0gY2FsbCBgcHJvcGFnYXRlU3RyZWFtUGFyYW1zYFxuICpcbiAqIF9zaG91bGQgbm90IGNhbGwgYHN1cGVyLnByb2Nlc3NTdHJlYW1QYXJhbXNgX1xuICpcbiAqICoqcHJlcGFyZVN0cmVhbVBhcmFtcygpKipcbiAqXG4gKiAtIGFzc2lnbiBwcmV2U3RyZWFtUGFyYW1zIHRvIHRoaXMuc3RyZWFtUGFyYW1zXG4gKiAtIGNoZWNrIGlmIHRoZSBjbGFzcyBpbXBsZW1lbnRzIHRoZSBjb3JyZWN0IGBwcm9jZXNzSW5wdXRgIG1ldGhvZFxuICpcbiAqIF9zaG91bGRuJ3QgYmUgZXh0ZW5kZWQsIG9ubHkgY29uc3VtZWQgaW4gYHByb2Nlc3NTdHJlYW1QYXJhbXNgX1xuICpcbiAqICoqcHJvcGFnYXRlU3RyZWFtUGFyYW1zKCkqKlxuICpcbiAqIC0gY3JlYXRlcyB0aGUgYGZyYW1lRGF0YWAgYnVmZmVyXG4gKiAtIHByb3BhZ2F0ZSBgc3RyZWFtUGFyYW1zYCB0byBjaGlsZHJlblxuICpcbiAqIF9zaG91bGRuJ3QgYmUgZXh0ZW5kZWQsIG9ubHkgY29uc3VtZWQgaW4gYHByb2Nlc3NTdHJlYW1QYXJhbXNgX1xuICpcbiAqICoqcHJvY2Vzc0ZyYW1lKCkqKlxuICpcbiAqIGBiYXNlYCBjbGFzcyAoZGVmYXVsdCBpbXBsZW1lbnRhdGlvbilcbiAqIC0gY2FsbCBgcHJlcHJvY2Vzc0ZyYW1lYFxuICogLSBhc3NpZ24gZnJhbWVUaW1lIGFuZCBmcmFtZU1ldGFkYXRhIHRvIGlkZW50aXR5XG4gKiAtIGNhbGwgdGhlIHByb3BlciBmdW5jdGlvbiBhY2NvcmRpbmcgdG8gaW5wdXRUeXBlXG4gKiAtIGNhbGwgYHByb3BhZ2F0ZUZyYW1lYFxuICpcbiAqIGBjaGlsZGAgY2xhc3NcbiAqIC0gY2FsbCBgcHJlcHJvY2Vzc0ZyYW1lYFxuICogLSBkbyB3aGF0ZXZlciB5b3Ugd2FudCB3aXRoIGluY29tbWluZyBmcmFtZVxuICogLSBjYWxsIGBwcm9wYWdhdGVGcmFtZWBcbiAqXG4gKiBfc2hvdWxkIG5vdCBjYWxsIGBzdXBlci5wcm9jZXNzRnJhbWVgX1xuICpcbiAqICoqcHJlcGFyZUZyYW1lKCkqKlxuICpcbiAqIC0gaWYgYHJlaW5pdGAgYW5kIHRyaWdnZXIgYHByb2Nlc3NTdHJlYW1QYXJhbXNgIGlmIG5lZWRlZFxuICpcbiAqIF9zaG91bGRuJ3QgYmUgZXh0ZW5kZWQsIG9ubHkgY29uc3VtZWQgaW4gYHByb2Nlc3NGcmFtZWBfXG4gKlxuICogKipwcm9wYWdhdGVGcmFtZSgpKipcbiAqXG4gKiAtIHByb3BhZ2F0ZSBmcmFtZSB0byBjaGlsZHJlblxuICpcbiAqIF9zaG91bGRuJ3QgYmUgZXh0ZW5kZWQsIG9ubHkgY29uc3VtZWQgaW4gYHByb2Nlc3NGcmFtZWBfXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24uY29yZVxuICovXG5jbGFzcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3IoZGVmaW5pdGlvbnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5jaWQgPSBpZCsrO1xuXG4gICAgLyoqXG4gICAgICogUGFyYW1ldGVyIGJhZyBjb250YWluaW5nIHBhcmFtZXRlciBpbnN0YW5jZXMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBuYW1lIHBhcmFtc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqL1xuICAgIHRoaXMucGFyYW1zID0gcGFyYW1ldGVycyhkZWZpbml0aW9ucywgb3B0aW9ucyk7XG4gICAgLy8gbGlzdGVuIGZvciBwYXJhbSB1cGRhdGVzXG4gICAgdGhpcy5wYXJhbXMuYWRkTGlzdGVuZXIodGhpcy5vblBhcmFtVXBkYXRlLmJpbmQodGhpcykpO1xuXG4gICAgLyoqXG4gICAgICogRGVzY3JpcHRpb24gb2YgdGhlIHN0cmVhbSBvdXRwdXQgb2YgdGhlIG5vZGUuXG4gICAgICogU2V0IHRvIGBudWxsYCB3aGVuIHRoZSBub2RlIGlzIGRlc3Ryb3llZC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGZyYW1lU2l6ZSAtIEZyYW1lIHNpemUgYXQgdGhlIG91dHB1dCBvZiB0aGUgbm9kZS5cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZnJhbWVSYXRlIC0gRnJhbWUgcmF0ZSBhdCB0aGUgb3V0cHV0IG9mIHRoZSBub2RlLlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBmcmFtZVR5cGUgLSBGcmFtZSB0eXBlIGF0IHRoZSBvdXRwdXQgb2YgdGhlIG5vZGUsXG4gICAgICogIHBvc3NpYmxlIHZhbHVlcyBhcmUgYHNpZ25hbGAsIGB2ZWN0b3JgIG9yIGBzY2FsYXJgLlxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl8U3RyaW5nfSBkZXNjcmlwdGlvbiAtIElmIHR5cGUgaXMgYHZlY3RvcmAsIGRlc2NyaWJlXG4gICAgICogIHRoZSBkaW1lbnNpb24ocykgb2Ygb3V0cHV0IHN0cmVhbS5cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gc291cmNlU2FtcGxlUmF0ZSAtIFNhbXBsZSByYXRlIG9mIHRoZSBzb3VyY2Ugb2YgdGhlXG4gICAgICogIGdyYXBoLiBfVGhlIHZhbHVlIHNob3VsZCBiZSBkZWZpbmVkIGJ5IHNvdXJjZXMgYW5kIG5ldmVyIG1vZGlmaWVkXy5cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gc291cmNlU2FtcGxlQ291bnQgLSBOdW1iZXIgb2YgY29uc2VjdXRpdmUgZGlzY3JldGVcbiAgICAgKiAgdGltZSB2YWx1ZXMgY29udGFpbmVkIGluIHRoZSBkYXRhIGZyYW1lIG91dHB1dCBieSB0aGUgc291cmNlLlxuICAgICAqICBfVGhlIHZhbHVlIHNob3VsZCBiZSBkZWZpbmVkIGJ5IHNvdXJjZXMgYW5kIG5ldmVyIG1vZGlmaWVkXy5cbiAgICAgKlxuICAgICAqIEBuYW1lIHN0cmVhbVBhcmFtc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqL1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zID0ge1xuICAgICAgZnJhbWVUeXBlOiBudWxsLFxuICAgICAgZnJhbWVTaXplOiAxLFxuICAgICAgZnJhbWVSYXRlOiAwLFxuICAgICAgZGVzY3JpcHRpb246IG51bGwsXG4gICAgICBzb3VyY2VTYW1wbGVSYXRlOiAwLFxuICAgICAgc291cmNlU2FtcGxlQ291bnQ6IG51bGwsXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEN1cnJlbnQgZnJhbWUuIFRoaXMgb2JqZWN0IGFuZCBpdHMgZGF0YSBhcmUgdXBkYXRlZCBhdCBlYWNoIGluY29tbWluZ1xuICAgICAqIGZyYW1lIHdpdGhvdXQgcmVhbGxvY2F0aW5nIG1lbW9yeS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgZnJhbWVcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gdGltZSAtIFRpbWUgb2YgdGhlIGN1cnJlbnQgZnJhbWUuXG4gICAgICogQHByb3BlcnR5IHtGbG9hdDMyQXJyYXl9IGRhdGEgLSBEYXRhIG9mIHRoZSBjdXJyZW50IGZyYW1lLlxuICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBtZXRhZGF0YSAtIE1ldGFkYXRhIGFzc29jaXRlZCB0byB0aGUgY3VycmVudCBmcmFtZS5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm9cbiAgICAgKi9cbiAgICB0aGlzLmZyYW1lID0ge1xuICAgICAgdGltZTogMCxcbiAgICAgIGRhdGE6IG51bGwsXG4gICAgICBtZXRhZGF0YToge30sXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2Ygbm9kZXMgY29ubmVjdGVkIHRvIHRoZSBvdXB1dCBvZiB0aGUgbm9kZSAobG93ZXIgaW4gdGhlIGdyYXBoKS5cbiAgICAgKiBBdCBlYWNoIGZyYW1lLCB0aGUgbm9kZSBmb3J3YXJkIGl0cyBgZnJhbWVgIHRvIHRvIGFsbCBpdHMgYG5leHRPcHNgLlxuICAgICAqXG4gICAgICogQHR5cGUge0FycmF5PEJhc2VMZm8+fVxuICAgICAqIEBuYW1lIG5leHRPcHNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm9cbiAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNjb25uZWN0fVxuICAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Rpc2Nvbm5lY3R9XG4gICAgICovXG4gICAgdGhpcy5uZXh0T3BzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbm9kZSBmcm9tIHdoaWNoIHRoZSBub2RlIHJlY2VpdmUgdGhlIGZyYW1lcyAodXBwZXIgaW4gdGhlIGdyYXBoKS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtCYXNlTGZvfVxuICAgICAqIEBuYW1lIHByZXZPcFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Nvbm5lY3R9XG4gICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jZGlzY29ubmVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnByZXZPcCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBJcyBzZXQgdG8gdHJ1ZSB3aGVuIGEgc3RhdGljIHBhcmFtZXRlciBpcyB1cGRhdGVkLiBPbiB0aGUgbmV4dCBpbnB1dFxuICAgICAqIGZyYW1lIGFsbCB0aGUgc3ViZ3JhcGggc3RyZWFtUGFyYW1zIHN0YXJ0aW5nIGZyb20gdGhpcyBub2RlIHdpbGwgYmVcbiAgICAgKiB1cGRhdGVkLlxuICAgICAqXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG5hbWUgX3JlaW5pdFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fcmVpbml0ID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBvYmplY3QgZGVzY3JpYmluZyBlYWNoIGF2YWlsYWJsZSBwYXJhbWV0ZXIgb2YgdGhlIG5vZGUuXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIGdldFBhcmFtc0Rlc2NyaXB0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy5nZXREZWZpbml0aW9ucygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IGFsbCBwYXJhbWV0ZXJzIHRvIHRoZWlyIGluaXRpYWwgdmFsdWUgKGFzIGRlZmluZWQgb24gaW5zdGFudGljYXRpb24pXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3N0cmVhbVBhcmFtc31cbiAgICovXG4gIHJlc2V0UGFyYW1zKCkge1xuICAgIHRoaXMucGFyYW1zLnJlc2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogRnVuY3Rpb24gY2FsbGVkIHdoZW4gYSBwYXJhbSBpcyB1cGRhdGVkLiBCeSBkZWZhdWx0IHNldCB0aGUgYF9yZWluaXRgXG4gICAqIGZsYWcgdG8gYHRydWVgIGlmIHRoZSBwYXJhbSBpcyBgc3RhdGljYCBvbmUuIFRoaXMgbWV0aG9kIHNob3VsZCBiZVxuICAgKiBleHRlbmRlZCB0byBoYW5kbGUgcGFydGljdWxhciBsb2dpYyBib3VuZCB0byBhIHNwZWNpZmljIHBhcmFtZXRlci5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIC0gVmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG1ldGFzIC0gTWV0YWRhdGEgYXNzb2NpYXRlZCB0byB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMgPSB7fSkge1xuICAgIGlmIChtZXRhcy5raW5kID09PSAnc3RhdGljJylcbiAgICAgIHRoaXMuX3JlaW5pdCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ29ubmVjdCB0aGUgY3VycmVudCBub2RlIChgcHJldk9wYCkgdG8gYW5vdGhlciBub2RlIChgbmV4dE9wYCkuXG4gICAqIEEgZ2l2ZW4gbm9kZSBjYW4gYmUgY29ubmVjdGVkIHRvIHNldmVyYWwgb3BlcmF0b3JzIGFuZCBwcm9wYWdhdGUgdGhlXG4gICAqIHN0cmVhbSB0byBlYWNoIG9mIHRoZW0uXG4gICAqXG4gICAqIEBwYXJhbSB7QmFzZUxmb30gbmV4dCAtIE5leHQgb3BlcmF0b3IgaW4gdGhlIGdyYXBoLlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzRnJhbWV9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Rpc2Nvbm5lY3R9XG4gICAqL1xuICBjb25uZWN0KG5leHQpIHtcbiAgICBpZiAoIShuZXh0IGluc3RhbmNlb2YgQmFzZUxmbykpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29ubmVjdGlvbjogY2hpbGQgbm9kZSBpcyBub3QgYW4gaW5zdGFuY2Ugb2YgYEJhc2VMZm9gJyk7XG5cbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMgPT09IG51bGwgfHxuZXh0LnN0cmVhbVBhcmFtcyA9PT0gbnVsbClcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb25uZWN0aW9uOiBjYW5ub3QgY29ubmVjdCBhIGRlYWQgbm9kZScpO1xuXG4gICAgdGhpcy5uZXh0T3BzLnB1c2gobmV4dCk7XG4gICAgbmV4dC5wcmV2T3AgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSAhPT0gbnVsbCkgLy8gZ3JhcGggaGFzIGFscmVhZHkgYmVlbiBzdGFydGVkXG4gICAgICBuZXh0LnByb2Nlc3NTdHJlYW1QYXJhbXModGhpcy5zdHJlYW1QYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgZ2l2ZW4gb3BlcmF0b3IgZnJvbSBpdHMgcHJldmlvdXMgb3BlcmF0b3JzJyBgbmV4dE9wc2AuXG4gICAqXG4gICAqIEBwYXJhbSB7QmFzZUxmb30gW25leHQ9bnVsbF0gLSBUaGUgb3BlcmF0b3IgdG8gZGlzY29ubmVjdCBmcm9tIHRoZSBjdXJyZW50XG4gICAqICBvcGVyYXRvci4gSWYgYG51bGxgIGRpc2Nvbm5lY3QgYWxsIHRoZSBuZXh0IG9wZXJhdG9ycy5cbiAgICovXG4gIGRpc2Nvbm5lY3QobmV4dCA9IG51bGwpIHtcbiAgICBpZiAobmV4dCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5uZXh0T3BzLmZvckVhY2goKG5leHQpID0+IHRoaXMuZGlzY29ubmVjdChuZXh0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5uZXh0T3BzLmluZGV4T2YodGhpcyk7XG4gICAgICB0aGlzLm5leHRPcHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIG5leHQucHJldk9wID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSBhbGwgdGhlIG5vZGVzIGluIHRoZSBzdWItZ3JhcGggc3RhcnRpbmcgZnJvbSB0aGUgY3VycmVudCBub2RlLlxuICAgKiBXaGVuIGRldHJveWVkLCB0aGUgYHN0cmVhbVBhcmFtc2Agb2YgdGhlIG5vZGUgYXJlIHNldCB0byBgbnVsbGAsIHRoZVxuICAgKiBvcGVyYXRvciBpcyB0aGVuIGNvbnNpZGVyZWQgYXMgYGRlYWRgIGFuZCBjYW5ub3QgYmUgcmVjb25uZWN0ZWQuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Nvbm5lY3R9XG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIC8vIGRlc3Ryb3kgYWxsIGNoaWRyZW5cbiAgICBsZXQgaW5kZXggPSB0aGlzLm5leHRPcHMubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGluZGV4LS0pXG4gICAgICB0aGlzLm5leHRPcHNbaW5kZXhdLmRlc3Ryb3koKTtcblxuICAgIC8vIGRpc2Nvbm5lY3QgaXRzZWxmIGZyb20gdGhlIHByZXZpb3VzIG9wZXJhdG9yXG4gICAgaWYgKHRoaXMucHJldk9wKVxuICAgICAgdGhpcy5wcmV2T3AuZGlzY29ubmVjdCh0aGlzKTtcblxuICAgIC8vIG1hcmsgdGhlIG9iamVjdCBhcyBkZWFkXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciB0byBpbml0aWFsaXplIHRoZSBzdHJlYW0gaW4gc3RhbmRhbG9uZSBtb2RlLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW3N0cmVhbVBhcmFtcz17fV0gLSBTdHJlYW0gcGFyYW1ldGVycyB0byBiZSB1c2VkLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNyZXNldFN0cmVhbX1cbiAgICovXG4gIGluaXRTdHJlYW0oc3RyZWFtUGFyYW1zID0ge30pIHtcbiAgICB0aGlzLnByb2Nlc3NTdHJlYW1QYXJhbXMoc3RyZWFtUGFyYW1zKTtcbiAgICB0aGlzLnJlc2V0U3RyZWFtKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGhlIGBmcmFtZS5kYXRhYCBidWZmZXIgYnkgc2V0dGluZyBhbGwgaXRzIHZhbHVlcyB0byAwLlxuICAgKiBBIHNvdXJjZSBvcGVyYXRvciBzaG91bGQgY2FsbCBgcHJvY2Vzc1N0cmVhbVBhcmFtc2AgYW5kIGByZXNldFN0cmVhbWAgd2hlblxuICAgKiBzdGFydGVkLCBlYWNoIG9mIHRoZXNlIG1ldGhvZCBwcm9wYWdhdGUgdGhyb3VnaCB0aGUgZ3JhcGggYXV0b21hdGljYWx5LlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzU3RyZWFtUGFyYW1zfVxuICAgKi9cbiAgcmVzZXRTdHJlYW0oKSB7XG4gICAgLy8gYnV0dG9tIHVwXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm5leHRPcHMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgdGhpcy5uZXh0T3BzW2ldLnJlc2V0U3RyZWFtKCk7XG5cbiAgICAvLyBubyBidWZmZXIgZm9yIGBzY2FsYXJgIHR5cGUgb3Igc2luayBub2RlXG4gICAgaWYgKHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSAhPT0gJ3NjYWxhcicgJiYgdGhpcy5mcmFtZS5kYXRhICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgICBjb25zdCBkYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKVxuICAgICAgICBkYXRhW2ldID0gMDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmluYWxpemUgdGhlIHN0cmVhbS4gQSBzb3VyY2Ugbm9kZSBzaG91bGQgY2FsbCB0aGlzIG1ldGhvZCB3aGVuIHN0b3BwZWQsXG4gICAqIGBmaW5hbGl6ZVN0cmVhbWAgaXMgYXV0b21hdGljYWxseSBwcm9wYWdhdGVkIHRocm91Z2h0IHRoZSBncmFwaC5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGVuZFRpbWUgLSBMb2dpY2FsIHRpbWUgYXQgd2hpY2ggdGhlIGdyYXBoIGlzIHN0b3BwZWQuXG4gICAqL1xuICBmaW5hbGl6ZVN0cmVhbShlbmRUaW1lKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm5leHRPcHMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgdGhpcy5uZXh0T3BzW2ldLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgb3IgdXBkYXRlIHRoZSBvcGVyYXRvcidzIGBzdHJlYW1QYXJhbXNgIGFjY29yZGluZyB0byB0aGVcbiAgICogcHJldmlvdXMgb3BlcmF0b3JzIGBzdHJlYW1QYXJhbXNgIHZhbHVlcy5cbiAgICpcbiAgICogV2hlbiBpbXBsZW1lbnRpbmcgYSBuZXcgb3BlcmF0b3IgdGhpcyBtZXRob2Qgc2hvdWxkOlxuICAgKiAxLiBjYWxsIGB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXNgIHdpdGggdGhlIGdpdmVuIGBwcmV2U3RyZWFtUGFyYW1zYFxuICAgKiAyLiBvcHRpb25uYWxseSBjaGFuZ2UgdmFsdWVzIHRvIGB0aGlzLnN0cmVhbVBhcmFtc2AgYWNjb3JkaW5nIHRvIHRoZVxuICAgKiAgICBsb2dpYyBwZXJmb3JtZWQgYnkgdGhlIG9wZXJhdG9yLlxuICAgKiAzLiBvcHRpb25uYWxseSBhbGxvY2F0ZSBtZW1vcnkgZm9yIHJpbmcgYnVmZmVycywgZXRjLlxuICAgKiA0LiBjYWxsIGB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtc2AgdG8gdHJpZ2dlciB0aGUgbWV0aG9kIG9uIHRoZSBuZXh0XG4gICAqICAgIG9wZXJhdG9ycyBpbiB0aGUgZ3JhcGguXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcmV2U3RyZWFtUGFyYW1zIC0gYHN0cmVhbVBhcmFtc2Agb2YgdGhlIHByZXZpb3VzIG9wZXJhdG9yLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcmVwYXJlU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9wYWdhdGVTdHJlYW1QYXJhbXN9XG4gICAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbW1vbiBsb2dpYyB0byBkbyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBgcHJvY2Vzc1N0cmVhbVBhcmFtYCwgbXVzdCBiZVxuICAgKiBjYWxsZWQgYXQgdGhlIGJlZ2lubmluZyBvZiBhbnkgYHByb2Nlc3NTdHJlYW1QYXJhbWAgaW1wbGVtZW50YXRpb24uXG4gICAqXG4gICAqIFRoZSBtZXRob2QgbWFpbmx5IGNoZWNrIGlmIHRoZSBjdXJyZW50IG5vZGUgaW1wbGVtZW50IHRoZSBpbnRlcmZhY2UgdG9cbiAgICogaGFuZGxlIHRoZSB0eXBlIG9mIGZyYW1lIHByb3BhZ2F0ZWQgYnkgaXQncyBwYXJlbnQ6XG4gICAqIC0gdG8gaGFuZGxlIGEgYHZlY3RvcmAgZnJhbWUgdHlwZSwgdGhlIGNsYXNzIG11c3QgaW1wbGVtZW50IGBwcm9jZXNzVmVjdG9yYFxuICAgKiAtIHRvIGhhbmRsZSBhIGBzaWduYWxgIGZyYW1lIHR5cGUsIHRoZSBjbGFzcyBtdXN0IGltcGxlbWVudCBgcHJvY2Vzc1NpZ25hbGBcbiAgICogLSBpbiBjYXNlIG9mIGEgJ3NjYWxhcicgZnJhbWUgdHlwZSwgdGhlIGNsYXNzIGNhbiBpbXBsZW1lbnQgYW55IG9mIHRoZVxuICAgKiBmb2xsb3dpbmcgYnkgb3JkZXIgb2YgcHJlZmVyZW5jZTogYHByb2Nlc3NTY2FsYXJgLCBgcHJvY2Vzc1ZlY3RvcmAsXG4gICAqIGBwcm9jZXNzU2lnbmFsYC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHByZXZTdHJlYW1QYXJhbXMgLSBgc3RyZWFtUGFyYW1zYCBvZiB0aGUgcHJldmlvdXMgb3BlcmF0b3IuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb3BhZ2F0ZVN0cmVhbVBhcmFtc31cbiAgICovXG4gIHByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyA9IHt9KSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0cmVhbVBhcmFtcywgcHJldlN0cmVhbVBhcmFtcyk7XG4gICAgY29uc3QgcHJldkZyYW1lVHlwZSA9IHByZXZTdHJlYW1QYXJhbXMuZnJhbWVUeXBlO1xuXG4gICAgc3dpdGNoIChwcmV2RnJhbWVUeXBlKSB7XG4gICAgICBjYXNlICdzY2FsYXInOlxuICAgICAgICBpZiAodGhpcy5wcm9jZXNzU2NhbGFyKVxuICAgICAgICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5wcm9jZXNzU2NhbGFyO1xuICAgICAgICBlbHNlIGlmICh0aGlzLnByb2Nlc3NWZWN0b3IpXG4gICAgICAgICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLnByb2Nlc3NWZWN0b3I7XG4gICAgICAgIGVsc2UgaWYgKHRoaXMucHJvY2Vzc1NpZ25hbClcbiAgICAgICAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbiA9IHRoaXMucHJvY2Vzc1NpZ25hbDtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9IC0gbm8gXCJwcm9jZXNzXCIgZnVuY3Rpb24gZm91bmRgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd2ZWN0b3InOlxuICAgICAgICBpZiAoISgncHJvY2Vzc1ZlY3RvcicgaW4gdGhpcykpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMuY29uc3RydWN0b3IubmFtZX0gLSBcInByb2Nlc3NWZWN0b3JcIiBpcyBub3QgZGVmaW5lZGApO1xuXG4gICAgICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5wcm9jZXNzVmVjdG9yO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NpZ25hbCc6XG4gICAgICAgIGlmICghKCdwcm9jZXNzU2lnbmFsJyBpbiB0aGlzKSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSAtIFwicHJvY2Vzc1NpZ25hbFwiIGlzIG5vdCBkZWZpbmVkYCk7XG5cbiAgICAgICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLnByb2Nlc3NTaWduYWw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgLy8gZGVmYXVsdHMgdG8gcHJvY2Vzc0Z1bmN0aW9uXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIGB0aGlzLmZyYW1lLmRhdGFgIGJ1ZmZlciBhbmQgZm9yd2FyZCB0aGUgb3BlcmF0b3IncyBgc3RyZWFtUGFyYW1gXG4gICAqIHRvIGFsbCBpdHMgbmV4dCBvcGVyYXRvcnMsIG11c3QgYmUgY2FsbGVkIGF0IHRoZSBlbmQgb2YgYW55XG4gICAqIGBwcm9jZXNzU3RyZWFtUGFyYW1zYCBpbXBsZW1lbnRhdGlvbi5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJlcGFyZVN0cmVhbVBhcmFtc31cbiAgICovXG4gIHByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpIHtcbiAgICB0aGlzLmZyYW1lLmRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubmV4dE9wcy5sZW5ndGg7IGkgPCBsOyBpKyspXG4gICAgICB0aGlzLm5leHRPcHNbaV0ucHJvY2Vzc1N0cmVhbVBhcmFtcyh0aGlzLnN0cmVhbVBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIHRoZSBwYXJ0aWN1bGFyIGxvZ2ljIHRoZSBvcGVyYXRvciBhcHBsaWVzIHRvIHRoZSBzdHJlYW0uXG4gICAqIEFjY29yZGluZyB0byB0aGUgZnJhbWUgdHlwZSBvZiB0aGUgcHJldmlvdXMgbm9kZSwgdGhlIG1ldGhvZCBjYWxscyBvbmVcbiAgICogb2YgdGhlIGZvbGxvd2luZyBtZXRob2QgYHByb2Nlc3NWZWN0b3JgLCBgcHJvY2Vzc1NpZ25hbGAgb3IgYHByb2Nlc3NTY2FsYXJgXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmcmFtZSAtIEZyYW1lICh0aW1lLCBkYXRhLCBhbmQgbWV0YWRhdGEpIGFzIGdpdmVuIGJ5IHRoZVxuICAgKiAgcHJldmlvdXMgb3BlcmF0b3IuIFRoZSBpbmNvbW1pbmcgZnJhbWUgc2hvdWxkIG5ldmVyIGJlIG1vZGlmaWVkIGJ5XG4gICAqICB0aGUgb3BlcmF0b3IuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3ByZXBhcmVGcmFtZX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvcGFnYXRlRnJhbWV9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqL1xuICBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgICB0aGlzLnByZXBhcmVGcmFtZSgpO1xuXG4gICAgLy8gZnJhbWVUaW1lIGFuZCBmcmFtZU1ldGFkYXRhIGRlZmF1bHRzIHRvIGlkZW50aXR5XG4gICAgdGhpcy5mcmFtZS50aW1lID0gZnJhbWUudGltZTtcbiAgICB0aGlzLmZyYW1lLm1ldGFkYXRhID0gZnJhbWUubWV0YWRhdGE7XG5cbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG4gICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBvaW50ZXIgdG8gdGhlIG1ldGhvZCBjYWxsZWQgaW4gYHByb2Nlc3NGcmFtZWAgYWNjb3JkaW5nIHRvIHRoZVxuICAgKiBmcmFtZSB0eXBlIG9mIHRoZSBwcmV2aW91cyBvcGVyYXRvci4gSXMgZHluYW1pY2FsbHkgYXNzaWduZWQgaW5cbiAgICogYHByZXBhcmVTdHJlYW1QYXJhbXNgLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcmVwYXJlU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzRnJhbWV9XG4gICAqL1xuICBwcm9jZXNzRnVuY3Rpb24oZnJhbWUpIHtcbiAgICB0aGlzLmZyYW1lID0gZnJhbWU7XG4gIH1cblxuICAvKipcbiAgICogQ29tbW9uIGxvZ2ljIHRvIHBlcmZvcm0gYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgYHByb2Nlc3NGcmFtZWAuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NGcmFtZX1cbiAgICovXG4gIHByZXBhcmVGcmFtZSgpIHtcbiAgICBpZiAodGhpcy5fcmVpbml0ID09PSB0cnVlKSB7XG4gICAgICBjb25zdCBzdHJlYW1QYXJhbXMgPSB0aGlzLnByZXZPcCAhPT0gbnVsbCA/IHRoaXMucHJldk9wLnN0cmVhbVBhcmFtcyA6IHt9O1xuICAgICAgdGhpcy5pbml0U3RyZWFtKHN0cmVhbVBhcmFtcyk7XG4gICAgICB0aGlzLl9yZWluaXQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRm9yd2FyZCB0aGUgY3VycmVudCBgZnJhbWVgIHRvIHRoZSBuZXh0IG9wZXJhdG9ycywgaXMgY2FsbGVkIGF0IHRoZSBlbmQgb2ZcbiAgICogYHByb2Nlc3NGcmFtZWAuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NGcmFtZX1cbiAgICovXG4gIHByb3BhZ2F0ZUZyYW1lKCkge1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5uZXh0T3BzLmxlbmd0aDsgaSA8IGw7IGkrKylcbiAgICAgIHRoaXMubmV4dE9wc1tpXS5wcm9jZXNzRnJhbWUodGhpcy5mcmFtZSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmFzZUxmbztcblxuIl19