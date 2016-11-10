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
 * import * as lfo from 'waves-lfo/client';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1vdmluZ0F2ZXJhZ2UuanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJvcmRlciIsInR5cGUiLCJtaW4iLCJtYXgiLCJkZWZhdWx0IiwibWV0YXMiLCJraW5kIiwiZmlsbCIsIkluZmluaXR5IiwiTW92aW5nQXZlcmFnZSIsIm9wdGlvbnMiLCJzdW0iLCJyaW5nQnVmZmVyIiwicmluZ0luZGV4IiwibmFtZSIsInZhbHVlIiwicHJvY2Vzc1N0cmVhbVBhcmFtcyIsInJlc2V0U3RyZWFtIiwicHJldlN0cmVhbVBhcmFtcyIsInByZXBhcmVTdHJlYW1QYXJhbXMiLCJmcmFtZVNpemUiLCJzdHJlYW1QYXJhbXMiLCJwYXJhbXMiLCJnZXQiLCJGbG9hdDMyQXJyYXkiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJyaW5nTGVuZ3RoIiwibGVuZ3RoIiwiaSIsImZpbGxTdW0iLCJmcmFtZSIsImRhdGEiLCJpbnB1dFNjYWxhciIsImlucHV0VmVjdG9yIiwidmFsdWVzIiwib3V0RnJhbWUiLCJyaW5nT2Zmc2V0Iiwic2NhbGUiLCJyaW5nQnVmZmVySW5kZXgiLCJsb2NhbFN1bSIsInByZXBhcmVGcmFtZSIsInByb2Nlc3NGdW5jdGlvbiIsInRpbWUiLCJzb3VyY2VTYW1wbGVSYXRlIiwibWV0YWRhdGEiLCJwcm9wYWdhdGVGcmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBLElBQU1BLGNBQWM7QUFDbEJDLFNBQU87QUFDTEMsVUFBTSxTQUREO0FBRUxDLFNBQUssQ0FGQTtBQUdMQyxTQUFLLEdBSEE7QUFJTEMsYUFBUyxFQUpKO0FBS0xDLFdBQU8sRUFBRUMsTUFBTSxTQUFSO0FBTEYsR0FEVztBQVFsQkMsUUFBTTtBQUNKTixVQUFNLE9BREY7QUFFSkMsU0FBSyxDQUFDTSxRQUZGO0FBR0pMLFNBQUssQ0FBQ0ssUUFIRjtBQUlKSixhQUFTLENBSkw7QUFLSkMsV0FBTyxFQUFFQyxNQUFNLFNBQVI7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SyxFQUFPO0FBQ2xCLFdBQUtVLFlBQUw7QUFDQSxXQUFLQyxlQUFMLENBQXFCWCxLQUFyQjs7QUFFQSxVQUFNOUIsUUFBUSxLQUFLc0IsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE9BQWhCLENBQWQ7QUFDQSxVQUFJbUIsT0FBT1osTUFBTVksSUFBakI7QUFDQTtBQUNBLFVBQUksS0FBS3JCLFlBQUwsQ0FBa0JzQixnQkFBdEIsRUFDRUQsUUFBUyxPQUFPMUMsUUFBUSxDQUFmLElBQW9CLEtBQUtxQixZQUFMLENBQWtCc0IsZ0JBQS9DOztBQUVGLFdBQUtiLEtBQUwsQ0FBV1ksSUFBWCxHQUFrQkEsSUFBbEI7QUFDQSxXQUFLWixLQUFMLENBQVdjLFFBQVgsR0FBc0JkLE1BQU1jLFFBQTVCOztBQUVBLFdBQUtDLGNBQUw7QUFDRDs7Ozs7a0JBR1lwQyxhIiwiZmlsZSI6Ik1vdmluZ0F2ZXJhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL0Jhc2VMZm8nO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgb3JkZXI6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgbWluOiAxLFxuICAgIG1heDogMWU5LFxuICAgIGRlZmF1bHQ6IDEwLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9XG4gIH0sXG4gIGZpbGw6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIG1pbjogLUluZmluaXR5LFxuICAgIG1heDogK0luZmluaXR5LFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG59O1xuXG4vKipcbiAqIENvbXB1dGUgYSBtb3ZpbmcgYXZlcmFnZSBvcGVyYXRpb24gb24gdGhlIGluY29tbWluZyBmcmFtZXMgKGBzY2FsYXJgIG9yXG4gKiBgdmVjdG9yYCB0eXBlKS4gSWYgdGhlIGlucHV0IGlzIG9mIHR5cGUgdmVjdG9yLCB0aGUgbW92aW5nIGF2ZXJhZ2UgaXNcbiAqIGNvbXB1dGVkIGZvciBlYWNoIGRpbWVuc2lvbiBpbiBwYXJhbGxlbC4gSWYgdGhlIHNvdXJjZSBzYW1wbGUgcmF0ZSBpcyBkZWZpbmVkXG4gKiBmcmFtZSB0aW1lIGlzIHNoaWZ0ZWQgdG8gdGhlIG1pZGRsZSBvZiB0aGUgd2luZG93IGRlZmluZWQgYnkgdGhlIG9yZGVyLlxuICpcbiAqIF9zdXBwb3J0IGBzdGFuZGFsb25lYCB1c2FnZV9cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm9yZGVyPTEwXSAtIE51bWJlciBvZiBzdWNjZXNzaXZlIHZhbHVlcyBvbiB3aGljaFxuICogIHRoZSBhdmVyYWdlIGlzIGNvbXB1dGVkLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmZpbGw9MF0gLSBWYWx1ZSB0byBmaWxsIHRoZSByaW5nIGJ1ZmZlciB3aXRoIGJlZm9yZVxuICogIHRoZSBmaXJzdCBpbnB1dCBmcmFtZS5cbiAqXG4gKiBAdG9kbyAtIEltcGxlbWVudCBgcHJvY2Vzc1NpZ25hbGAgP1xuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVNpemU6IDIsXG4gKiAgIGZyYW1lVHlwZTogJ3ZlY3RvcidcbiAqIH0pO1xuICpcbiAqIGNvbnN0IG1vdmluZ0F2ZXJhZ2UgPSBuZXcgbGZvLm9wZXJhdG9yLk1vdmluZ0F2ZXJhZ2Uoe1xuICogICBvcmRlcjogNSxcbiAqICAgZmlsbDogMFxuICogfSk7XG4gKlxuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IGRhdGE6IHRydWUgfSk7XG4gKlxuICogZXZlbnRJbi5jb25uZWN0KG1vdmluZ0F2ZXJhZ2UpO1xuICogbW92aW5nQXZlcmFnZS5jb25uZWN0KGxvZ2dlcik7XG4gKlxuICogZXZlbnRJbi5zdGFydCgpO1xuICpcbiAqIGV2ZW50SW4ucHJvY2VzcyhudWxsLCBbMSwgMV0pO1xuICogPiBbMC4yLCAwLjJdXG4gKiBldmVudEluLnByb2Nlc3MobnVsbCwgWzEsIDFdKTtcbiAqID4gWzAuNCwgMC40XVxuICogZXZlbnRJbi5wcm9jZXNzKG51bGwsIFsxLCAxXSk7XG4gKiA+IFswLjYsIDAuNl1cbiAqIGV2ZW50SW4ucHJvY2VzcyhudWxsLCBbMSwgMV0pO1xuICogPiBbMC44LCAwLjhdXG4gKiBldmVudEluLnByb2Nlc3MobnVsbCwgWzEsIDFdKTtcbiAqID4gWzEsIDFdXG4gKi9cbmNsYXNzIE1vdmluZ0F2ZXJhZ2UgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5zdW0gPSBudWxsO1xuICAgIHRoaXMucmluZ0J1ZmZlciA9IG51bGw7XG4gICAgdGhpcy5yaW5nSW5kZXggPSAwO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIG9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKSB7XG4gICAgc3VwZXIub25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpO1xuXG4gICAgLy8gQHRvZG8gLSBzaG91bGQgYmUgZG9uZSBsYXppbHkgaW4gcHJvY2Vzc1xuICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgY2FzZSAnb3JkZXInOlxuICAgICAgICB0aGlzLnByb2Nlc3NTdHJlYW1QYXJhbXMoKTtcbiAgICAgICAgdGhpcy5yZXNldFN0cmVhbSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2ZpbGwnOlxuICAgICAgICB0aGlzLnJlc2V0U3RyZWFtKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ29yZGVyJyk7XG5cbiAgICB0aGlzLnJpbmdCdWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KG9yZGVyICogZnJhbWVTaXplKTtcblxuICAgIGlmIChmcmFtZVNpemUgPiAxKVxuICAgICAgdGhpcy5zdW0gPSBuZXcgRmxvYXQzMkFycmF5KGZyYW1lU2l6ZSk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5zdW0gPSAwO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICByZXNldFN0cmVhbSgpIHtcbiAgICBzdXBlci5yZXNldFN0cmVhbSgpO1xuXG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ29yZGVyJyk7XG4gICAgY29uc3QgZmlsbCA9IHRoaXMucGFyYW1zLmdldCgnZmlsbCcpO1xuICAgIGNvbnN0IHJpbmdCdWZmZXIgPSB0aGlzLnJpbmdCdWZmZXI7XG4gICAgY29uc3QgcmluZ0xlbmd0aCA9IHJpbmdCdWZmZXIubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByaW5nTGVuZ3RoOyBpKyspXG4gICAgICByaW5nQnVmZmVyW2ldID0gZmlsbDtcblxuICAgIGNvbnN0IGZpbGxTdW0gPSBvcmRlciAqIGZpbGw7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuXG4gICAgaWYgKGZyYW1lU2l6ZSA+IDEpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspXG4gICAgICAgIHRoaXMuc3VtW2ldID0gZmlsbFN1bTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdW0gPSBmaWxsU3VtO1xuICAgIH1cblxuICAgIHRoaXMucmluZ0luZGV4ID0gMDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2NhbGFyKHZhbHVlKSB7XG4gICAgdGhpcy5mcmFtZS5kYXRhWzBdID0gdGhpcy5pbnB1dFNjYWxhcihmcmFtZS5kYXRhWzBdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgdGhlIGBNb3ZpbmdBdmVyYWdlYCBvcGVyYXRvciBpbiBgc3RhbmRhbG9uZWAgbW9kZSAoaS5lLiBvdXRzaWRlIG9mIGFcbiAgICogZ3JhcGgpIHdpdGggYSBgc2NhbGFyYCBpbnB1dC5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIC0gVmFsdWUgdG8gZmVlZCB0aGUgbW92aW5nIGF2ZXJhZ2Ugd2l0aC5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIEF2ZXJhZ2UgdmFsdWUuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAgICpcbiAgICogY29uc3QgbW92aW5nQXZlcmFnZSA9IG5ldyBsZm8ub3BlcmF0b3IuTW92aW5nQXZlcmFnZSh7IG9yZGVyOiA1IH0pO1xuICAgKiBtb3ZpbmdBdmVyYWdlLmluaXRTdHJlYW0oeyBmcmFtZVNpemU6IDEsIGZyYW1lVHlwZTogJ3NjYWxhcicgfSk7XG4gICAqXG4gICAqIG1vdmluZ0F2ZXJhZ2UuaW5wdXRTY2FsYXIoMSk7XG4gICAqID4gMC4yXG4gICAqIG1vdmluZ0F2ZXJhZ2UuaW5wdXRTY2FsYXIoMSk7XG4gICAqID4gMC40XG4gICAqIG1vdmluZ0F2ZXJhZ2UuaW5wdXRTY2FsYXIoMSk7XG4gICAqID4gMC42XG4gICAqL1xuICBpbnB1dFNjYWxhcih2YWx1ZSkge1xuICAgIGNvbnN0IG9yZGVyID0gdGhpcy5wYXJhbXMuZ2V0KCdvcmRlcicpO1xuICAgIGNvbnN0IHJpbmdJbmRleCA9IHRoaXMucmluZ0luZGV4O1xuICAgIGNvbnN0IHJpbmdCdWZmZXIgPSB0aGlzLnJpbmdCdWZmZXI7XG4gICAgbGV0IHN1bSA9IHRoaXMuc3VtO1xuXG4gICAgc3VtIC09IHJpbmdCdWZmZXJbcmluZ0luZGV4XTtcbiAgICBzdW0gKz0gdmFsdWU7XG5cbiAgICB0aGlzLnN1bSA9IHN1bTtcbiAgICB0aGlzLnJpbmdCdWZmZXJbcmluZ0luZGV4XSA9IHZhbHVlO1xuICAgIHRoaXMucmluZ0luZGV4ID0gKHJpbmdJbmRleCArIDEpICUgb3JkZXI7XG5cbiAgICByZXR1cm4gc3VtIC8gb3JkZXI7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcihmcmFtZSkge1xuICAgIHRoaXMuaW5wdXRWZWN0b3IoZnJhbWUuZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIHRoZSBgTW92aW5nQXZlcmFnZWAgb3BlcmF0b3IgaW4gYHN0YW5kYWxvbmVgIG1vZGUgKGkuZS4gb3V0c2lkZSBvZiBhXG4gICAqIGdyYXBoKSB3aXRoIGEgYHZlY3RvcmAgaW5wdXQuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyAtIFZhbHVlcyB0byBmZWVkIHRoZSBtb3ZpbmcgYXZlcmFnZSB3aXRoLlxuICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXl9IC0gQXZlcmFnZSB2YWx1ZSBmb3IgZWFjaCBkaW1lbnNpb24uXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAgICpcbiAgICogY29uc3QgbW92aW5nQXZlcmFnZSA9IG5ldyBsZm8ub3BlcmF0b3IuTW92aW5nQXZlcmFnZSh7IG9yZGVyOiA1IH0pO1xuICAgKiBtb3ZpbmdBdmVyYWdlLmluaXRTdHJlYW0oeyBmcmFtZVNpemU6IDIsIGZyYW1lVHlwZTogJ3NjYWxhcicgfSk7XG4gICAqXG4gICAqIG1vdmluZ0F2ZXJhZ2UuaW5wdXRBcnJheShbMSwgMV0pO1xuICAgKiA+IFswLjIsIDAuMl1cbiAgICogbW92aW5nQXZlcmFnZS5pbnB1dEFycmF5KFsxLCAxXSk7XG4gICAqID4gWzAuNCwgMC40XVxuICAgKiBtb3ZpbmdBdmVyYWdlLmlucHV0QXJyYXkoWzEsIDFdKTtcbiAgICogPiBbMC42LCAwLjZdXG4gICAqL1xuICBpbnB1dFZlY3Rvcih2YWx1ZXMpIHtcbiAgICBjb25zdCBvcmRlciA9IHRoaXMucGFyYW1zLmdldCgnb3JkZXInKTtcbiAgICBjb25zdCBvdXRGcmFtZSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgcmluZ0luZGV4ID0gdGhpcy5yaW5nSW5kZXg7XG4gICAgY29uc3QgcmluZ09mZnNldCA9IHJpbmdJbmRleCAqIGZyYW1lU2l6ZTtcbiAgICBjb25zdCByaW5nQnVmZmVyID0gdGhpcy5yaW5nQnVmZmVyO1xuICAgIGNvbnN0IHN1bSA9IHRoaXMuc3VtO1xuICAgIGNvbnN0IHNjYWxlID0gMSAvIG9yZGVyO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgY29uc3QgcmluZ0J1ZmZlckluZGV4ID0gcmluZ09mZnNldCArIGk7XG4gICAgICBjb25zdCB2YWx1ZSA9IHZhbHVlc1tpXTtcbiAgICAgIGxldCBsb2NhbFN1bSA9IHN1bVtpXTtcblxuICAgICAgbG9jYWxTdW0gLT0gcmluZ0J1ZmZlcltyaW5nQnVmZmVySW5kZXhdO1xuICAgICAgbG9jYWxTdW0gKz0gdmFsdWU7XG5cbiAgICAgIHRoaXMuc3VtW2ldID0gbG9jYWxTdW07XG4gICAgICBvdXRGcmFtZVtpXSA9IGxvY2FsU3VtICogc2NhbGU7XG4gICAgICByaW5nQnVmZmVyW3JpbmdCdWZmZXJJbmRleF0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLnJpbmdJbmRleCA9IChyaW5nSW5kZXggKyAxKSAlIG9yZGVyO1xuXG4gICAgcmV0dXJuIG91dEZyYW1lO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIHRoaXMucHJlcGFyZUZyYW1lKCk7XG4gICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuXG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ29yZGVyJyk7XG4gICAgbGV0IHRpbWUgPSBmcmFtZS50aW1lO1xuICAgIC8vIHNoaWZ0IHRpbWUgdG8gdGFrZSBhY2NvdW50IG9mIHRoZSBhZGRlZCBsYXRlbmN5XG4gICAgaWYgKHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUpXG4gICAgICB0aW1lIC09ICgwLjUgKiAob3JkZXIgLSAxKSAvIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUpO1xuXG4gICAgdGhpcy5mcmFtZS50aW1lID0gdGltZTtcbiAgICB0aGlzLmZyYW1lLm1ldGFkYXRhID0gZnJhbWUubWV0YWRhdGE7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZUZyYW1lKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTW92aW5nQXZlcmFnZTtcbiJdfQ==