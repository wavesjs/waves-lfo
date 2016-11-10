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

var _BaseLfo2 = require('../core/BaseLfo');

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
 * import * as lfo from 'waves-lfo/client';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1vdmluZ01lZGlhbi5qcyJdLCJuYW1lcyI6WyJkZWZpbml0aW9ucyIsIm9yZGVyIiwidHlwZSIsIm1pbiIsIm1heCIsImRlZmF1bHQiLCJtZXRhcyIsImtpbmQiLCJmaWxsIiwiSW5maW5pdHkiLCJNb3ZpbmdNZWRpYW4iLCJvcHRpb25zIiwicmluZ0J1ZmZlciIsInNvcnRlciIsInJpbmdJbmRleCIsIl9lbnN1cmVPZGRPcmRlciIsInBhcmFtcyIsImdldCIsIkVycm9yIiwibmFtZSIsInZhbHVlIiwicHJvY2Vzc1N0cmVhbVBhcmFtcyIsInJlc2V0U3RyZWFtIiwicHJldlN0cmVhbVBhcmFtcyIsInByZXBhcmVTdHJlYW1QYXJhbXMiLCJmcmFtZVNpemUiLCJzdHJlYW1QYXJhbXMiLCJGbG9hdDMyQXJyYXkiLCJzb3J0QnVmZmVyIiwibWluSW5kaWNlcyIsIlVpbnQzMkFycmF5IiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwicmluZ0xlbmd0aCIsImxlbmd0aCIsImkiLCJmcmFtZSIsImRhdGEiLCJpbnB1dFNjYWxhciIsIm1lZGlhbkluZGV4Iiwic3RhcnRJbmRleCIsIm1pbkluZGV4IiwiaiIsImNhY2hlIiwibWVkaWFuIiwiaW5wdXRWZWN0b3IiLCJ2YWx1ZXMiLCJvdXRGcmFtZSIsIk1hdGgiLCJmbG9vciIsImsiLCJpbmRleCIsInN3YXBJbmRleCIsInYiLCJwcmVwcm9jZXNzRnJhbWUiLCJwcm9jZXNzRnVuY3Rpb24iLCJ0aW1lIiwic291cmNlU2FtcGxlUmF0ZSIsIm1ldGFkYXRhIiwicHJvcGFnYXRlRnJhbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFNQSxjQUFjO0FBQ2xCQyxTQUFPO0FBQ0xDLFVBQU0sU0FERDtBQUVMQyxTQUFLLENBRkE7QUFHTEMsU0FBSyxHQUhBO0FBSUxDLGFBQVMsQ0FKSjtBQUtMQyxXQUFPLEVBQUVDLE1BQU0sU0FBUjtBQUxGLEdBRFc7QUFRbEJDLFFBQU07QUFDSk4sVUFBTSxPQURGO0FBRUpDLFNBQUssQ0FBQ00sUUFGRjtBQUdKTCxTQUFLLENBQUNLLFFBSEY7QUFJSkosYUFBUyxDQUpMO0FBS0pDLFdBQU8sRUFBRUMsTUFBTSxTQUFSO0FBTEg7QUFSWSxDQUFwQjs7QUFpQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBaURNRyxZOzs7QUFDSiwwQkFBMEI7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFBQSxrSkFDbEJYLFdBRGtCLEVBQ0xXLE9BREs7O0FBR3hCLFVBQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxVQUFLQyxNQUFMLEdBQWMsSUFBZDtBQUNBLFVBQUtDLFNBQUwsR0FBaUIsQ0FBakI7O0FBRUEsVUFBS0MsZUFBTDtBQVB3QjtBQVF6Qjs7QUFFRDs7Ozs7c0NBQ2tCO0FBQ2hCLFVBQUksS0FBS0MsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE9BQWhCLElBQTJCLENBQTNCLEtBQWlDLENBQXJDLEVBQ0UsTUFBTSxJQUFJQyxLQUFKLG9CQUEyQmpCLEtBQTNCLHdDQUFOO0FBQ0g7O0FBRUQ7Ozs7a0NBQ2NrQixJLEVBQU1DLEssRUFBT2QsSyxFQUFPO0FBQ2hDLHNKQUFvQmEsSUFBcEIsRUFBMEJDLEtBQTFCLEVBQWlDZCxLQUFqQzs7QUFFQSxjQUFRYSxJQUFSO0FBQ0UsYUFBSyxPQUFMO0FBQ0UsZUFBS0osZUFBTDtBQUNBLGVBQUtNLG1CQUFMO0FBQ0EsZUFBS0MsV0FBTDtBQUNBO0FBQ0YsYUFBSyxNQUFMO0FBQ0UsZUFBS0EsV0FBTDtBQUNBO0FBUko7QUFVRDs7QUFFRDs7Ozt3Q0FDb0JDLGdCLEVBQWtCO0FBQ3BDLFdBQUtDLG1CQUFMLENBQXlCRCxnQkFBekI7QUFDQTs7QUFFQSxVQUFNRSxZQUFZLEtBQUtDLFlBQUwsQ0FBa0JELFNBQXBDO0FBQ0EsVUFBTXhCLFFBQVEsS0FBS2UsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE9BQWhCLENBQWQ7O0FBRUEsV0FBS0wsVUFBTCxHQUFrQixJQUFJZSxZQUFKLENBQWlCRixZQUFZeEIsS0FBN0IsQ0FBbEI7QUFDQSxXQUFLMkIsVUFBTCxHQUFrQixJQUFJRCxZQUFKLENBQWlCRixZQUFZeEIsS0FBN0IsQ0FBbEI7O0FBRUEsV0FBSzRCLFVBQUwsR0FBa0IsSUFBSUMsV0FBSixDQUFnQkwsU0FBaEIsQ0FBbEI7O0FBRUEsV0FBS00scUJBQUw7QUFDRDs7QUFFRDs7OztrQ0FDYztBQUNaOztBQUVBLFVBQU12QixPQUFPLEtBQUtRLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixNQUFoQixDQUFiO0FBQ0EsVUFBTUwsYUFBYSxLQUFLQSxVQUF4QjtBQUNBLFVBQU1vQixhQUFhcEIsV0FBV3FCLE1BQTlCOztBQUVBLFdBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRixVQUFwQixFQUFnQ0UsR0FBaEM7QUFDRSxhQUFLdEIsVUFBTCxDQUFnQnNCLENBQWhCLElBQXFCMUIsSUFBckI7QUFERixPQUdBLEtBQUtNLFNBQUwsR0FBaUIsQ0FBakI7QUFDRDs7QUFFRDs7OztrQ0FDY3FCLEssRUFBTztBQUNuQixXQUFLQSxLQUFMLENBQVdDLElBQVgsQ0FBZ0IsQ0FBaEIsSUFBcUIsS0FBS0MsV0FBTCxDQUFpQkYsTUFBTUMsSUFBTixDQUFXLENBQVgsQ0FBakIsQ0FBckI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0NBdUJZaEIsSyxFQUFPO0FBQ2pCLFVBQU1OLFlBQVksS0FBS0EsU0FBdkI7QUFDQSxVQUFNRixhQUFhLEtBQUtBLFVBQXhCO0FBQ0EsVUFBTWdCLGFBQWEsS0FBS0EsVUFBeEI7QUFDQSxVQUFNM0IsUUFBUSxLQUFLZSxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsT0FBaEIsQ0FBZDtBQUNBLFVBQU1xQixjQUFjLENBQUNyQyxRQUFRLENBQVQsSUFBYyxDQUFsQztBQUNBLFVBQUlzQyxhQUFhLENBQWpCOztBQUVBM0IsaUJBQVdFLFNBQVgsSUFBd0JNLEtBQXhCOztBQUVBLFdBQUssSUFBSWMsSUFBSSxDQUFiLEVBQWdCQSxLQUFLSSxXQUFyQixFQUFrQ0osR0FBbEMsRUFBdUM7QUFDckMsWUFBSS9CLE1BQU0sQ0FBQ00sUUFBWDtBQUNBLFlBQUkrQixXQUFXLElBQWY7O0FBRUEsYUFBSyxJQUFJQyxJQUFJRixVQUFiLEVBQXlCRSxJQUFJeEMsS0FBN0IsRUFBb0N3QyxHQUFwQyxFQUF5QztBQUN2QyxjQUFJUCxNQUFNLENBQVYsRUFDRU4sV0FBV2EsQ0FBWCxJQUFnQjdCLFdBQVc2QixDQUFYLENBQWhCOztBQUVGLGNBQUliLFdBQVdhLENBQVgsSUFBZ0J0QyxHQUFwQixFQUF5QjtBQUN2QkEsa0JBQU15QixXQUFXYSxDQUFYLENBQU47QUFDQUQsdUJBQVdDLENBQVg7QUFDRDtBQUNGOztBQUVEO0FBQ0EsWUFBTUMsUUFBUWQsV0FBV1csVUFBWCxDQUFkO0FBQ0FYLG1CQUFXVyxVQUFYLElBQXlCWCxXQUFXWSxRQUFYLENBQXpCO0FBQ0FaLG1CQUFXWSxRQUFYLElBQXVCRSxLQUF2Qjs7QUFFQUgsc0JBQWMsQ0FBZDtBQUNEOztBQUVELFVBQU1JLFNBQVNmLFdBQVdVLFdBQVgsQ0FBZjtBQUNBLFdBQUt4QixTQUFMLEdBQWlCLENBQUNBLFlBQVksQ0FBYixJQUFrQmIsS0FBbkM7O0FBRUEsYUFBTzBDLE1BQVA7QUFDRDs7QUFFRDs7OztrQ0FDY1IsSyxFQUFPO0FBQ25CLFdBQUtTLFdBQUwsQ0FBaUJULE1BQU1DLElBQXZCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQ0FxQllTLE0sRUFBUTtBQUNsQixVQUFNNUMsUUFBUSxLQUFLZSxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsT0FBaEIsQ0FBZDtBQUNBLFVBQU1MLGFBQWEsS0FBS0EsVUFBeEI7QUFDQSxVQUFNRSxZQUFZLEtBQUtBLFNBQXZCO0FBQ0EsVUFBTWMsYUFBYSxLQUFLQSxVQUF4QjtBQUNBLFVBQU1rQixXQUFXLEtBQUtYLEtBQUwsQ0FBV0MsSUFBNUI7QUFDQSxVQUFNUCxhQUFhLEtBQUtBLFVBQXhCO0FBQ0EsVUFBTUosWUFBWSxLQUFLQyxZQUFMLENBQWtCRCxTQUFwQztBQUNBLFVBQU1hLGNBQWNTLEtBQUtDLEtBQUwsQ0FBVy9DLFFBQVEsQ0FBbkIsQ0FBcEI7QUFDQSxVQUFJc0MsYUFBYSxDQUFqQjs7QUFFQSxXQUFLLElBQUlMLElBQUksQ0FBYixFQUFnQkEsS0FBS0ksV0FBckIsRUFBa0NKLEdBQWxDLEVBQXVDOztBQUVyQyxhQUFLLElBQUlPLElBQUksQ0FBYixFQUFnQkEsSUFBSWhCLFNBQXBCLEVBQStCZ0IsR0FBL0IsRUFBb0M7QUFDbENLLG1CQUFTTCxDQUFULElBQWMsQ0FBQ2hDLFFBQWY7QUFDQW9CLHFCQUFXWSxDQUFYLElBQWdCLENBQWhCOztBQUVBLGVBQUssSUFBSVEsSUFBSVYsVUFBYixFQUF5QlUsSUFBSWhELEtBQTdCLEVBQW9DZ0QsR0FBcEMsRUFBeUM7QUFDdkMsZ0JBQU1DLFFBQVFELElBQUl4QixTQUFKLEdBQWdCZ0IsQ0FBOUI7O0FBRUE7QUFDQSxnQkFBSVEsTUFBTW5DLFNBQU4sSUFBbUJvQixNQUFNLENBQTdCLEVBQ0V0QixXQUFXc0MsS0FBWCxJQUFvQkwsT0FBT0osQ0FBUCxDQUFwQjs7QUFFRjtBQUNBLGdCQUFJUCxNQUFNLENBQVYsRUFDRU4sV0FBV3NCLEtBQVgsSUFBb0J0QyxXQUFXc0MsS0FBWCxDQUFwQjs7QUFFRjtBQUNBLGdCQUFJdEIsV0FBV3NCLEtBQVgsSUFBb0JKLFNBQVNMLENBQVQsQ0FBeEIsRUFBcUM7QUFDbkNLLHVCQUFTTCxDQUFULElBQWNiLFdBQVdzQixLQUFYLENBQWQ7QUFDQXJCLHlCQUFXWSxDQUFYLElBQWdCUyxLQUFoQjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQSxjQUFNQyxZQUFZWixhQUFhZCxTQUFiLEdBQXlCZ0IsQ0FBM0M7QUFDQSxjQUFNVyxJQUFJeEIsV0FBV3VCLFNBQVgsQ0FBVjtBQUNBdkIscUJBQVd1QixTQUFYLElBQXdCdkIsV0FBV0MsV0FBV1ksQ0FBWCxDQUFYLENBQXhCO0FBQ0FiLHFCQUFXQyxXQUFXWSxDQUFYLENBQVgsSUFBNEJXLENBQTVCOztBQUVBO0FBQ0FOLG1CQUFTTCxDQUFULElBQWNiLFdBQVd1QixTQUFYLENBQWQ7QUFDRDs7QUFFRFosc0JBQWMsQ0FBZDtBQUNEOztBQUVELFdBQUt6QixTQUFMLEdBQWlCLENBQUNBLFlBQVksQ0FBYixJQUFrQmIsS0FBbkM7O0FBRUEsYUFBTyxLQUFLa0MsS0FBTCxDQUFXQyxJQUFsQjtBQUNEOztBQUVEOzs7O2lDQUNhRCxLLEVBQU87QUFDbEIsV0FBS2tCLGVBQUw7QUFDQSxXQUFLQyxlQUFMLENBQXFCbkIsS0FBckI7O0FBRUEsVUFBTWxDLFFBQVEsS0FBS2UsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE9BQWhCLENBQWQ7QUFDQSxVQUFJc0MsT0FBT3BCLE1BQU1vQixJQUFqQjtBQUNBO0FBQ0EsVUFBSSxLQUFLN0IsWUFBTCxDQUFrQjhCLGdCQUF0QixFQUNFRCxRQUFTLE9BQU90RCxRQUFRLENBQWYsSUFBb0IsS0FBS3lCLFlBQUwsQ0FBa0I4QixnQkFBL0M7O0FBRUYsV0FBS3JCLEtBQUwsQ0FBV29CLElBQVgsR0FBa0JBLElBQWxCO0FBQ0EsV0FBS3BCLEtBQUwsQ0FBV3NCLFFBQVgsR0FBc0J0QixNQUFNc0IsUUFBNUI7O0FBRUEsV0FBS0MsY0FBTCxDQUFvQkgsSUFBcEIsRUFBMEIsS0FBS1QsUUFBL0IsRUFBeUNXLFFBQXpDO0FBQ0Q7Ozs7O2tCQUdZL0MsWSIsImZpbGUiOiJNb3ZpbmdNZWRpYW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL0Jhc2VMZm8nO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgb3JkZXI6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgbWluOiAxLFxuICAgIG1heDogMWU5LFxuICAgIGRlZmF1bHQ6IDksXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG4gIGZpbGw6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIG1pbjogLUluZmluaXR5LFxuICAgIG1heDogK0luZmluaXR5LFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG59O1xuXG4vKipcbiAqIENvbXB1dGUgYSBtb3ZpbmcgbWVkaWFuIG9wZXJhdGlvbiBvbiB0aGUgaW5jb21taW5nIGZyYW1lcyAoYHNjYWxhcmAgb3JcbiAqIGB2ZWN0b3JgIHR5cGUpLiBJZiB0aGUgaW5wdXQgaXMgb2YgdHlwZSB2ZWN0b3IsIHRoZSBtb3ZpbmcgbWVkaWFuIGlzXG4gKiBjb21wdXRlZCBmb3IgZWFjaCBkaW1lbnNpb24gaW4gcGFyYWxsZWwuIElmIHRoZSBzb3VyY2Ugc2FtcGxlIHJhdGUgaXMgZGVmaW5lZFxuICogZnJhbWUgdGltZSBpcyBzaGlmdGVkIHRvIHRoZSBtaWRkbGUgb2YgdGhlIHdpbmRvdyBkZWZpbmVkIGJ5IHRoZSBvcmRlci5cbiAqXG4gKiBfc3VwcG9ydCBgc3RhbmRhbG9uZWAgdXNhZ2VfXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24ub3BlcmF0b3JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5vcmRlcj05XSAtIE51bWJlciBvZiBzdWNjZXNzaXZlIHZhbHVlcyBpbiB3aGljaFxuICogIHRoZSBtZWRpYW4gaXMgc2VhcmNoZWQuIFRoaXMgdmFsdWUgbXVzdCBiZSBvZGQuIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5maWxsPTBdIC0gVmFsdWUgdG8gZmlsbCB0aGUgcmluZyBidWZmZXIgd2l0aCBiZWZvcmVcbiAqICB0aGUgZmlyc3QgaW5wdXQgZnJhbWUuIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqXG4gKiBAdG9kbyAtIEltcGxlbWVudCBgcHJvY2Vzc1NpZ25hbGBcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIGNvbnN0IGV2ZW50SW4gPSBuZXcgbGZvLnNvdXJjZS5FdmVudEluKHtcbiAqICAgZnJhbWVTaXplOiAyLFxuICogICBmcmFtZVR5cGU6ICd2ZWN0b3InLFxuICogfSk7XG4gKlxuICogY29uc3QgbW92aW5nTWVkaWFuID0gbmV3IGxmby5vcGVyYXRvci5Nb3ZpbmdNZWRpYW4oe1xuICogICBvcmRlcjogNSxcbiAqICAgZmlsbDogMCxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGxvZ2dlciA9IG5ldyBsZm8uc2luay5Mb2dnZXIoeyBkYXRhOiB0cnVlIH0pO1xuICpcbiAqIGV2ZW50SW4uY29ubmVjdChtb3ZpbmdNZWRpYW4pO1xuICogbW92aW5nTWVkaWFuLmNvbm5lY3QobG9nZ2VyKTtcbiAqXG4gKiBldmVudEluLnN0YXJ0KCk7XG4gKlxuICogZXZlbnRJbi5wcm9jZXNzRnJhbWUobnVsbCwgWzEsIDFdKTtcbiAqID4gWzAsIDBdXG4gKiBldmVudEluLnByb2Nlc3NGcmFtZShudWxsLCBbMiwgMl0pO1xuICogPiBbMCwgMF1cbiAqIGV2ZW50SW4ucHJvY2Vzc0ZyYW1lKG51bGwsIFszLCAzXSk7XG4gKiA+IFsxLCAxXVxuICogZXZlbnRJbi5wcm9jZXNzRnJhbWUobnVsbCwgWzQsIDRdKTtcbiAqID4gWzIsIDJdXG4gKiBldmVudEluLnByb2Nlc3NGcmFtZShudWxsLCBbNSwgNV0pO1xuICogPiBbMywgM11cbiAqL1xuY2xhc3MgTW92aW5nTWVkaWFuIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMucmluZ0J1ZmZlciA9IG51bGw7XG4gICAgdGhpcy5zb3J0ZXIgPSBudWxsO1xuICAgIHRoaXMucmluZ0luZGV4ID0gMDtcblxuICAgIHRoaXMuX2Vuc3VyZU9kZE9yZGVyKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2Vuc3VyZU9kZE9yZGVyKCkge1xuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ29yZGVyJykgJSAyID09PSAwKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHZhbHVlICR7b3JkZXJ9IGZvciBwYXJhbSBcIm9yZGVyXCIgLSBzaG91bGQgYmUgb2RkYCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpIHtcbiAgICBzdXBlci5vblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcyk7XG5cbiAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgIGNhc2UgJ29yZGVyJzpcbiAgICAgICAgdGhpcy5fZW5zdXJlT2RkT3JkZXIoKTtcbiAgICAgICAgdGhpcy5wcm9jZXNzU3RyZWFtUGFyYW1zKCk7XG4gICAgICAgIHRoaXMucmVzZXRTdHJlYW0oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdmaWxsJzpcbiAgICAgICAgdGhpcy5yZXNldFN0cmVhbSgpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuICAgIC8vIG91dFR5cGUgaXMgc2ltaWxhciB0byBpbnB1dCB0eXBlXG5cbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ29yZGVyJyk7XG5cbiAgICB0aGlzLnJpbmdCdWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KGZyYW1lU2l6ZSAqIG9yZGVyKTtcbiAgICB0aGlzLnNvcnRCdWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KGZyYW1lU2l6ZSAqIG9yZGVyKTtcblxuICAgIHRoaXMubWluSW5kaWNlcyA9IG5ldyBVaW50MzJBcnJheShmcmFtZVNpemUpO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICByZXNldFN0cmVhbSgpIHtcbiAgICBzdXBlci5yZXNldFN0cmVhbSgpO1xuXG4gICAgY29uc3QgZmlsbCA9IHRoaXMucGFyYW1zLmdldCgnZmlsbCcpO1xuICAgIGNvbnN0IHJpbmdCdWZmZXIgPSB0aGlzLnJpbmdCdWZmZXI7XG4gICAgY29uc3QgcmluZ0xlbmd0aCA9IHJpbmdCdWZmZXIubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByaW5nTGVuZ3RoOyBpKyspXG4gICAgICB0aGlzLnJpbmdCdWZmZXJbaV0gPSBmaWxsO1xuXG4gICAgdGhpcy5yaW5nSW5kZXggPSAwO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTY2FsYXIoZnJhbWUpIHtcbiAgICB0aGlzLmZyYW1lLmRhdGFbMF0gPSB0aGlzLmlucHV0U2NhbGFyKGZyYW1lLmRhdGFbMF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyBmb3IgdGhlIHVzZSBvZiBhIGBNb3ZpbmdNZWRpYW5gIG91dHNpZGUgYSBncmFwaCAoZS5nLiBpbnNpZGVcbiAgICogYW5vdGhlciBub2RlKSwgaW4gdGhpcyBjYXNlIGBwcm9jZXNzU3RyZWFtUGFyYW1zYCBhbmQgYHJlc2V0U3RyZWFtYFxuICAgKiBzaG91bGQgYmUgY2FsbGVkIG1hbnVhbGx5IG9uIHRoZSBub2RlLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgLSBWYWx1ZSB0byBmZWVkIHRoZSBtb3ZpbmcgbWVkaWFuIHdpdGguXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBNZWRpYW4gdmFsdWUuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAgICpcbiAgICogY29uc3QgbW92aW5nTWVkaWFuID0gbmV3IE1vdmluZ01lZGlhbih7IG9yZGVyOiA1IH0pO1xuICAgKiBtb3ZpbmdNZWRpYW4uaW5pdFN0cmVhbSh7IGZyYW1lU2l6ZTogMSwgZnJhbWVUeXBlOiAnc2NhbGFyJyB9KTtcbiAgICpcbiAgICogbW92aW5nTWVkaWFuLmlucHV0U2NhbGFyKDEpO1xuICAgKiA+IDBcbiAgICogbW92aW5nTWVkaWFuLmlucHV0U2NhbGFyKDIpO1xuICAgKiA+IDBcbiAgICogbW92aW5nTWVkaWFuLmlucHV0U2NhbGFyKDMpO1xuICAgKiA+IDFcbiAgICogbW92aW5nTWVkaWFuLmlucHV0U2NhbGFyKDQpO1xuICAgKiA+IDJcbiAgICovXG4gIGlucHV0U2NhbGFyKHZhbHVlKSB7XG4gICAgY29uc3QgcmluZ0luZGV4ID0gdGhpcy5yaW5nSW5kZXg7XG4gICAgY29uc3QgcmluZ0J1ZmZlciA9IHRoaXMucmluZ0J1ZmZlcjtcbiAgICBjb25zdCBzb3J0QnVmZmVyID0gdGhpcy5zb3J0QnVmZmVyO1xuICAgIGNvbnN0IG9yZGVyID0gdGhpcy5wYXJhbXMuZ2V0KCdvcmRlcicpO1xuICAgIGNvbnN0IG1lZGlhbkluZGV4ID0gKG9yZGVyIC0gMSkgLyAyO1xuICAgIGxldCBzdGFydEluZGV4ID0gMDtcblxuICAgIHJpbmdCdWZmZXJbcmluZ0luZGV4XSA9IHZhbHVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gbWVkaWFuSW5kZXg7IGkrKykge1xuICAgICAgbGV0IG1pbiA9ICtJbmZpbml0eTtcbiAgICAgIGxldCBtaW5JbmRleCA9IG51bGw7XG5cbiAgICAgIGZvciAobGV0IGogPSBzdGFydEluZGV4OyBqIDwgb3JkZXI7IGorKykge1xuICAgICAgICBpZiAoaSA9PT0gMClcbiAgICAgICAgICBzb3J0QnVmZmVyW2pdID0gcmluZ0J1ZmZlcltqXTtcblxuICAgICAgICBpZiAoc29ydEJ1ZmZlcltqXSA8IG1pbikge1xuICAgICAgICAgIG1pbiA9IHNvcnRCdWZmZXJbal07XG4gICAgICAgICAgbWluSW5kZXggPSBqO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHN3YXAgbWluSW5kZXggYW5kIHN0YXJ0SW5kZXhcbiAgICAgIGNvbnN0IGNhY2hlID0gc29ydEJ1ZmZlcltzdGFydEluZGV4XTtcbiAgICAgIHNvcnRCdWZmZXJbc3RhcnRJbmRleF0gPSBzb3J0QnVmZmVyW21pbkluZGV4XTtcbiAgICAgIHNvcnRCdWZmZXJbbWluSW5kZXhdID0gY2FjaGU7XG5cbiAgICAgIHN0YXJ0SW5kZXggKz0gMTtcbiAgICB9XG5cbiAgICBjb25zdCBtZWRpYW4gPSBzb3J0QnVmZmVyW21lZGlhbkluZGV4XTtcbiAgICB0aGlzLnJpbmdJbmRleCA9IChyaW5nSW5kZXggKyAxKSAlIG9yZGVyO1xuXG4gICAgcmV0dXJuIG1lZGlhbjtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKGZyYW1lKSB7XG4gICAgdGhpcy5pbnB1dFZlY3RvcihmcmFtZS5kYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3MgZm9yIHRoZSB1c2Ugb2YgYSBgTW92aW5nTWVkaWFuYCBvdXRzaWRlIGEgZ3JhcGggKGUuZy4gaW5zaWRlXG4gICAqIGFub3RoZXIgbm9kZSksIGluIHRoaXMgY2FzZSBgcHJvY2Vzc1N0cmVhbVBhcmFtc2AgYW5kIGByZXNldFN0cmVhbWBcbiAgICogc2hvdWxkIGJlIGNhbGxlZCBtYW51YWxseSBvbiB0aGUgbm9kZS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIC0gVmFsdWVzIHRvIGZlZWQgdGhlIG1vdmluZyBtZWRpYW4gd2l0aC5cbiAgICogQHJldHVybiB7RmxvYXQzMkFycmF5fSAtIE1lZGlhbiB2YWx1ZXMgZm9yIGVhY2ggZGltZW5zaW9uLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gICAqXG4gICAqIGNvbnN0IG1vdmluZ01lZGlhbiA9IG5ldyBNb3ZpbmdNZWRpYW4oeyBvcmRlcjogMywgZmlsbDogMCB9KTtcbiAgICogbW92aW5nTWVkaWFuLmluaXRTdHJlYW0oeyBmcmFtZVNpemU6IDMsIGZyYW1lVHlwZTogJ3ZlY3RvcicgfSk7XG4gICAqXG4gICAqIG1vdmluZ01lZGlhbi5pbnB1dEFycmF5KFsxLCAxXSk7XG4gICAqID4gWzAsIDBdXG4gICAqIG1vdmluZ01lZGlhbi5pbnB1dEFycmF5KFsyLCAyXSk7XG4gICAqID4gWzEsIDFdXG4gICAqIG1vdmluZ01lZGlhbi5pbnB1dEFycmF5KFszLCAzXSk7XG4gICAqID4gWzIsIDJdXG4gICAqL1xuICBpbnB1dFZlY3Rvcih2YWx1ZXMpIHtcbiAgICBjb25zdCBvcmRlciA9IHRoaXMucGFyYW1zLmdldCgnb3JkZXInKTtcbiAgICBjb25zdCByaW5nQnVmZmVyID0gdGhpcy5yaW5nQnVmZmVyO1xuICAgIGNvbnN0IHJpbmdJbmRleCA9IHRoaXMucmluZ0luZGV4O1xuICAgIGNvbnN0IHNvcnRCdWZmZXIgPSB0aGlzLnNvcnRCdWZmZXI7XG4gICAgY29uc3Qgb3V0RnJhbWUgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3QgbWluSW5kaWNlcyA9IHRoaXMubWluSW5kaWNlcztcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgbWVkaWFuSW5kZXggPSBNYXRoLmZsb29yKG9yZGVyIC8gMik7XG4gICAgbGV0IHN0YXJ0SW5kZXggPSAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gbWVkaWFuSW5kZXg7IGkrKykge1xuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGZyYW1lU2l6ZTsgaisrKSB7XG4gICAgICAgIG91dEZyYW1lW2pdID0gK0luZmluaXR5O1xuICAgICAgICBtaW5JbmRpY2VzW2pdID0gMDtcblxuICAgICAgICBmb3IgKGxldCBrID0gc3RhcnRJbmRleDsgayA8IG9yZGVyOyBrKyspIHtcbiAgICAgICAgICBjb25zdCBpbmRleCA9IGsgKiBmcmFtZVNpemUgKyBqO1xuXG4gICAgICAgICAgLy8gdXBkYXRlIHJpbmcgYnVmZmVyIGNvcnJlc3BvbmRpbmcgdG8gY3VycmVudFxuICAgICAgICAgIGlmIChrID09PSByaW5nSW5kZXggJiYgaSA9PT0gMClcbiAgICAgICAgICAgIHJpbmdCdWZmZXJbaW5kZXhdID0gdmFsdWVzW2pdO1xuXG4gICAgICAgICAgLy8gY29weSB2YWx1ZSBpbiBzb3J0IGJ1ZmZlciBvbiBmaXJzdCBwYXNzXG4gICAgICAgICAgaWYgKGkgPT09IDApwqBcbiAgICAgICAgICAgIHNvcnRCdWZmZXJbaW5kZXhdID0gcmluZ0J1ZmZlcltpbmRleF07XG5cbiAgICAgICAgICAvLyBmaW5kIG1pbml1bSBpbiB0aGUgcmVtYWluaW5nIGFycmF5XG4gICAgICAgICAgaWYgKHNvcnRCdWZmZXJbaW5kZXhdIDwgb3V0RnJhbWVbal0pIHtcbiAgICAgICAgICAgIG91dEZyYW1lW2pdID0gc29ydEJ1ZmZlcltpbmRleF07XG4gICAgICAgICAgICBtaW5JbmRpY2VzW2pdID0gaW5kZXg7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3dhcCBtaW5pbXVtIGFuZCBjdXJlbnQgaW5kZXhcbiAgICAgICAgY29uc3Qgc3dhcEluZGV4ID0gc3RhcnRJbmRleCAqIGZyYW1lU2l6ZSArIGo7XG4gICAgICAgIGNvbnN0IHYgPSBzb3J0QnVmZmVyW3N3YXBJbmRleF07XG4gICAgICAgIHNvcnRCdWZmZXJbc3dhcEluZGV4XSA9IHNvcnRCdWZmZXJbbWluSW5kaWNlc1tqXV07XG4gICAgICAgIHNvcnRCdWZmZXJbbWluSW5kaWNlc1tqXV0gPSB2O1xuXG4gICAgICAgIC8vIHN0b3JlIHRoaXMgbWluaW11bSB2YWx1ZSBhcyBjdXJyZW50IHJlc3VsdFxuICAgICAgICBvdXRGcmFtZVtqXSA9IHNvcnRCdWZmZXJbc3dhcEluZGV4XTtcbiAgICAgIH1cblxuICAgICAgc3RhcnRJbmRleCArPSAxO1xuICAgIH1cblxuICAgIHRoaXMucmluZ0luZGV4ID0gKHJpbmdJbmRleCArIDEpICUgb3JkZXI7XG5cbiAgICByZXR1cm4gdGhpcy5mcmFtZS5kYXRhO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIHRoaXMucHJlcHJvY2Vzc0ZyYW1lKCk7XG4gICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuXG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ29yZGVyJyk7XG4gICAgbGV0IHRpbWUgPSBmcmFtZS50aW1lO1xuICAgIC8vIHNoaWZ0IHRpbWUgdG8gdGFrZSBhY2NvdW50IG9mIHRoZSBhZGRlZCBsYXRlbmN5XG4gICAgaWYgKHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUpXG4gICAgICB0aW1lIC09ICgwLjUgKiAob3JkZXIgLSAxKSAvIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUpO1xuXG4gICAgdGhpcy5mcmFtZS50aW1lID0gdGltZTtcbiAgICB0aGlzLmZyYW1lLm1ldGFkYXRhID0gZnJhbWUubWV0YWRhdGE7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZUZyYW1lKHRpbWUsIHRoaXMub3V0RnJhbWUsIG1ldGFkYXRhKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNb3ZpbmdNZWRpYW47XG4iXX0=