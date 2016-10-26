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

      this.ringBuffer.fill(fill);

      var fillSum = order * fill;

      if (this.streamParams.frameSize > 1) this.sum.fill(fillSum);else this.sum = fillSum;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1vdmluZ0F2ZXJhZ2UuanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJvcmRlciIsInR5cGUiLCJtaW4iLCJtYXgiLCJkZWZhdWx0IiwibWV0YXMiLCJraW5kIiwiZmlsbCIsIkluZmluaXR5IiwiTW92aW5nQXZlcmFnZSIsIm9wdGlvbnMiLCJzdW0iLCJyaW5nQnVmZmVyIiwicmluZ0luZGV4IiwibmFtZSIsInZhbHVlIiwicHJvY2Vzc1N0cmVhbVBhcmFtcyIsInJlc2V0U3RyZWFtIiwicHJldlN0cmVhbVBhcmFtcyIsInByZXBhcmVTdHJlYW1QYXJhbXMiLCJmcmFtZVNpemUiLCJzdHJlYW1QYXJhbXMiLCJwYXJhbXMiLCJnZXQiLCJGbG9hdDMyQXJyYXkiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJmaWxsU3VtIiwiZnJhbWUiLCJkYXRhIiwiaW5wdXRTY2FsYXIiLCJpbnB1dFZlY3RvciIsInZhbHVlcyIsIm91dEZyYW1lIiwicmluZ09mZnNldCIsInNjYWxlIiwiaSIsInJpbmdCdWZmZXJJbmRleCIsImxvY2FsU3VtIiwicHJlcGFyZUZyYW1lIiwicHJvY2Vzc0Z1bmN0aW9uIiwidGltZSIsInNvdXJjZVNhbXBsZVJhdGUiLCJtZXRhZGF0YSIsInByb3BhZ2F0ZUZyYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTUEsY0FBYztBQUNsQkMsU0FBTztBQUNMQyxVQUFNLFNBREQ7QUFFTEMsU0FBSyxDQUZBO0FBR0xDLFNBQUssR0FIQTtBQUlMQyxhQUFTLEVBSko7QUFLTEMsV0FBTyxFQUFFQyxNQUFNLFNBQVI7QUFMRixHQURXO0FBUWxCQyxRQUFNO0FBQ0pOLFVBQU0sT0FERjtBQUVKQyxTQUFLLENBQUNNLFFBRkY7QUFHSkwsU0FBSyxDQUFDSyxRQUhGO0FBSUpKLGFBQVMsQ0FKTDtBQUtKQyxXQUFPLEVBQUVDLE1BQU0sU0FBUjtBQUxIO0FBUlksQ0FBcEI7O0FBaUJB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QkFBL0M7O0FBRUYsV0FBS2QsS0FBTCxDQUFXYSxJQUFYLEdBQWtCQSxJQUFsQjtBQUNBLFdBQUtiLEtBQUwsQ0FBV2UsUUFBWCxHQUFzQmYsTUFBTWUsUUFBNUI7O0FBRUEsV0FBS0MsY0FBTDtBQUNEOzs7OztrQkFHWWxDLGEiLCJmaWxlIjoiTW92aW5nQXZlcmFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvQmFzZUxmbyc7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBvcmRlcjoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBtaW46IDEsXG4gICAgbWF4OiAxZTksXG4gICAgZGVmYXVsdDogMTAsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH1cbiAgfSxcbiAgZmlsbDoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgbWluOiAtSW5maW5pdHksXG4gICAgbWF4OiArSW5maW5pdHksXG4gICAgZGVmYXVsdDogMCxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbn07XG5cbi8qKlxuICogQ29tcHV0ZSBhIG1vdmluZyBhdmVyYWdlIG9wZXJhdGlvbiBvbiB0aGUgaW5jb21taW5nIGZyYW1lcyAoYHNjYWxhcmAgb3JcbiAqIGB2ZWN0b3JgIHR5cGUpLiBJZiB0aGUgaW5wdXQgaXMgb2YgdHlwZSB2ZWN0b3IsIHRoZSBtb3ZpbmcgYXZlcmFnZSBpc1xuICogY29tcHV0ZWQgZm9yIGVhY2ggZGltZW5zaW9uIGluIHBhcmFsbGVsLiBJZiB0aGUgc291cmNlIHNhbXBsZSByYXRlIGlzIGRlZmluZWRcbiAqIGZyYW1lIHRpbWUgaXMgc2hpZnRlZCB0byB0aGUgbWlkZGxlIG9mIHRoZSB3aW5kb3cgZGVmaW5lZCBieSB0aGUgb3JkZXIuXG4gKlxuICogX3N1cHBvcnQgYHN0YW5kYWxvbmVgIHVzYWdlX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMub3JkZXI9MTBdIC0gTnVtYmVyIG9mIHN1Y2Nlc3NpdmUgdmFsdWVzIG9uIHdoaWNoXG4gKiAgdGhlIGF2ZXJhZ2UgaXMgY29tcHV0ZWQuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZmlsbD0wXSAtIFZhbHVlIHRvIGZpbGwgdGhlIHJpbmcgYnVmZmVyIHdpdGggYmVmb3JlXG4gKiAgdGhlIGZpcnN0IGlucHV0IGZyYW1lLlxuICpcbiAqIEB0b2RvIC0gSW1wbGVtZW50IGBwcm9jZXNzU2lnbmFsYCA/XG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiBjb25zdCBldmVudEluID0gbmV3IGxmby5zb3VyY2UuRXZlbnRJbih7XG4gKiAgIGZyYW1lU2l6ZTogMixcbiAqICAgZnJhbWVUeXBlOiAndmVjdG9yJ1xuICogfSk7XG4gKlxuICogY29uc3QgbW92aW5nQXZlcmFnZSA9IG5ldyBsZm8ub3BlcmF0b3IuTW92aW5nQXZlcmFnZSh7XG4gKiAgIG9yZGVyOiA1LFxuICogICBmaWxsOiAwXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBsb2dnZXIgPSBuZXcgbGZvLnNpbmsuTG9nZ2VyKHsgZGF0YTogdHJ1ZSB9KTtcbiAqXG4gKiBldmVudEluLmNvbm5lY3QobW92aW5nQXZlcmFnZSk7XG4gKiBtb3ZpbmdBdmVyYWdlLmNvbm5lY3QobG9nZ2VyKTtcbiAqXG4gKiBldmVudEluLnN0YXJ0KCk7XG4gKlxuICogZXZlbnRJbi5wcm9jZXNzKG51bGwsIFsxLCAxXSk7XG4gKiA+IFswLjIsIDAuMl1cbiAqIGV2ZW50SW4ucHJvY2VzcyhudWxsLCBbMSwgMV0pO1xuICogPiBbMC40LCAwLjRdXG4gKiBldmVudEluLnByb2Nlc3MobnVsbCwgWzEsIDFdKTtcbiAqID4gWzAuNiwgMC42XVxuICogZXZlbnRJbi5wcm9jZXNzKG51bGwsIFsxLCAxXSk7XG4gKiA+IFswLjgsIDAuOF1cbiAqIGV2ZW50SW4ucHJvY2VzcyhudWxsLCBbMSwgMV0pO1xuICogPiBbMSwgMV1cbiAqL1xuY2xhc3MgTW92aW5nQXZlcmFnZSBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnN1bSA9IG51bGw7XG4gICAgdGhpcy5yaW5nQnVmZmVyID0gbnVsbDtcbiAgICB0aGlzLnJpbmdJbmRleCA9IDA7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpIHtcbiAgICBzdXBlci5vblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcyk7XG5cbiAgICAvLyBAdG9kbyAtIHNob3VsZCBiZSBkb25lIGxhemlseSBpbiBwcm9jZXNzXG4gICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICBjYXNlICdvcmRlcic6XG4gICAgICAgIHRoaXMucHJvY2Vzc1N0cmVhbVBhcmFtcygpO1xuICAgICAgICB0aGlzLnJlc2V0U3RyZWFtKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZmlsbCc6XG4gICAgICAgIHRoaXMucmVzZXRTdHJlYW0oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBvcmRlciA9IHRoaXMucGFyYW1zLmdldCgnb3JkZXInKTtcblxuICAgIHRoaXMucmluZ0J1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkob3JkZXIgKiBmcmFtZVNpemUpO1xuXG4gICAgaWYgKGZyYW1lU2l6ZSA+IDEpXG4gICAgICB0aGlzLnN1bSA9IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLnN1bSA9IDA7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHJlc2V0U3RyZWFtKCkge1xuICAgIHN1cGVyLnJlc2V0U3RyZWFtKCk7XG5cbiAgICBjb25zdCBvcmRlciA9IHRoaXMucGFyYW1zLmdldCgnb3JkZXInKTtcbiAgICBjb25zdCBmaWxsID0gdGhpcy5wYXJhbXMuZ2V0KCdmaWxsJyk7XG5cbiAgICB0aGlzLnJpbmdCdWZmZXIuZmlsbChmaWxsKTtcblxuICAgIGNvbnN0IGZpbGxTdW0gPSBvcmRlciAqIGZpbGw7XG5cbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID4gMSlcbiAgICAgIHRoaXMuc3VtLmZpbGwoZmlsbFN1bSk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5zdW0gPSBmaWxsU3VtO1xuXG4gICAgdGhpcy5yaW5nSW5kZXggPSAwO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTY2FsYXIodmFsdWUpIHtcbiAgICB0aGlzLmZyYW1lLmRhdGFbMF0gPSB0aGlzLmlucHV0U2NhbGFyKGZyYW1lLmRhdGFbMF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSB0aGUgYE1vdmluZ0F2ZXJhZ2VgIG9wZXJhdG9yIGluIGBzdGFuZGFsb25lYCBtb2RlIChpLmUuIG91dHNpZGUgb2YgYVxuICAgKiBncmFwaCkgd2l0aCBhIGBzY2FsYXJgIGlucHV0LlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgLSBWYWx1ZSB0byBmZWVkIHRoZSBtb3ZpbmcgYXZlcmFnZSB3aXRoLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gQXZlcmFnZSB2YWx1ZS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICAgKlxuICAgKiBjb25zdCBtb3ZpbmdBdmVyYWdlID0gbmV3IGxmby5vcGVyYXRvci5Nb3ZpbmdBdmVyYWdlKHsgb3JkZXI6IDUgfSk7XG4gICAqIG1vdmluZ0F2ZXJhZ2UuaW5pdFN0cmVhbSh7IGZyYW1lU2l6ZTogMSwgZnJhbWVUeXBlOiAnc2NhbGFyJyB9KTtcbiAgICpcbiAgICogbW92aW5nQXZlcmFnZS5pbnB1dFNjYWxhcigxKTtcbiAgICogPiAwLjJcbiAgICogbW92aW5nQXZlcmFnZS5pbnB1dFNjYWxhcigxKTtcbiAgICogPiAwLjRcbiAgICogbW92aW5nQXZlcmFnZS5pbnB1dFNjYWxhcigxKTtcbiAgICogPiAwLjZcbiAgICovXG4gIGlucHV0U2NhbGFyKHZhbHVlKSB7XG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ29yZGVyJyk7XG4gICAgY29uc3QgcmluZ0luZGV4ID0gdGhpcy5yaW5nSW5kZXg7XG4gICAgY29uc3QgcmluZ0J1ZmZlciA9IHRoaXMucmluZ0J1ZmZlcjtcbiAgICBsZXQgc3VtID0gdGhpcy5zdW07XG5cbiAgICBzdW0gLT0gcmluZ0J1ZmZlcltyaW5nSW5kZXhdO1xuICAgIHN1bSArPSB2YWx1ZTtcblxuICAgIHRoaXMuc3VtID0gc3VtO1xuICAgIHRoaXMucmluZ0J1ZmZlcltyaW5nSW5kZXhdID0gdmFsdWU7XG4gICAgdGhpcy5yaW5nSW5kZXggPSAocmluZ0luZGV4ICsgMSkgJSBvcmRlcjtcblxuICAgIHJldHVybiBzdW0gLyBvcmRlcjtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKGZyYW1lKSB7XG4gICAgdGhpcy5pbnB1dFZlY3RvcihmcmFtZS5kYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgdGhlIGBNb3ZpbmdBdmVyYWdlYCBvcGVyYXRvciBpbiBgc3RhbmRhbG9uZWAgbW9kZSAoaS5lLiBvdXRzaWRlIG9mIGFcbiAgICogZ3JhcGgpIHdpdGggYSBgdmVjdG9yYCBpbnB1dC5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIC0gVmFsdWVzIHRvIGZlZWQgdGhlIG1vdmluZyBhdmVyYWdlIHdpdGguXG4gICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheX0gLSBBdmVyYWdlIHZhbHVlIGZvciBlYWNoIGRpbWVuc2lvbi5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICAgKlxuICAgKiBjb25zdCBtb3ZpbmdBdmVyYWdlID0gbmV3IGxmby5vcGVyYXRvci5Nb3ZpbmdBdmVyYWdlKHsgb3JkZXI6IDUgfSk7XG4gICAqIG1vdmluZ0F2ZXJhZ2UuaW5pdFN0cmVhbSh7IGZyYW1lU2l6ZTogMiwgZnJhbWVUeXBlOiAnc2NhbGFyJyB9KTtcbiAgICpcbiAgICogbW92aW5nQXZlcmFnZS5pbnB1dEFycmF5KFsxLCAxXSk7XG4gICAqID4gWzAuMiwgMC4yXVxuICAgKiBtb3ZpbmdBdmVyYWdlLmlucHV0QXJyYXkoWzEsIDFdKTtcbiAgICogPiBbMC40LCAwLjRdXG4gICAqIG1vdmluZ0F2ZXJhZ2UuaW5wdXRBcnJheShbMSwgMV0pO1xuICAgKiA+IFswLjYsIDAuNl1cbiAgICovXG4gIGlucHV0VmVjdG9yKHZhbHVlcykge1xuICAgIGNvbnN0IG9yZGVyID0gdGhpcy5wYXJhbXMuZ2V0KCdvcmRlcicpO1xuICAgIGNvbnN0IG91dEZyYW1lID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCByaW5nSW5kZXggPSB0aGlzLnJpbmdJbmRleDtcbiAgICBjb25zdCByaW5nT2Zmc2V0ID0gcmluZ0luZGV4ICogZnJhbWVTaXplO1xuICAgIGNvbnN0IHJpbmdCdWZmZXIgPSB0aGlzLnJpbmdCdWZmZXI7XG4gICAgY29uc3Qgc3VtID0gdGhpcy5zdW07XG4gICAgY29uc3Qgc2NhbGUgPSAxIC8gb3JkZXI7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCByaW5nQnVmZmVySW5kZXggPSByaW5nT2Zmc2V0ICsgaTtcbiAgICAgIGNvbnN0IHZhbHVlID0gdmFsdWVzW2ldO1xuICAgICAgbGV0IGxvY2FsU3VtID0gc3VtW2ldO1xuXG4gICAgICBsb2NhbFN1bSAtPSByaW5nQnVmZmVyW3JpbmdCdWZmZXJJbmRleF07XG4gICAgICBsb2NhbFN1bSArPSB2YWx1ZTtcblxuICAgICAgdGhpcy5zdW1baV0gPSBsb2NhbFN1bTtcbiAgICAgIG91dEZyYW1lW2ldID0gbG9jYWxTdW0gKiBzY2FsZTtcbiAgICAgIHJpbmdCdWZmZXJbcmluZ0J1ZmZlckluZGV4XSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMucmluZ0luZGV4ID0gKHJpbmdJbmRleCArIDEpICUgb3JkZXI7XG5cbiAgICByZXR1cm4gb3V0RnJhbWU7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgdGhpcy5wcmVwYXJlRnJhbWUoKTtcbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG5cbiAgICBjb25zdCBvcmRlciA9IHRoaXMucGFyYW1zLmdldCgnb3JkZXInKTtcbiAgICBsZXQgdGltZSA9IGZyYW1lLnRpbWU7XG4gICAgLy8gc2hpZnQgdGltZSB0byB0YWtlIGFjY291bnQgb2YgdGhlIGFkZGVkIGxhdGVuY3lcbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSlcbiAgICAgIHRpbWUgLT0gKDAuNSAqIChvcmRlciAtIDEpIC8gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSk7XG5cbiAgICB0aGlzLmZyYW1lLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMuZnJhbWUubWV0YWRhdGEgPSBmcmFtZS5tZXRhZGF0YTtcblxuICAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNb3ZpbmdBdmVyYWdlO1xuIl19