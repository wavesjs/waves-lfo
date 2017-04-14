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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1pbk1heC5qcyJdLCJuYW1lcyI6WyJNaW5NYXgiLCJvcHRpb25zIiwicHJldlN0cmVhbVBhcmFtcyIsInByZXBhcmVTdHJlYW1QYXJhbXMiLCJzdHJlYW1QYXJhbXMiLCJmcmFtZVR5cGUiLCJmcmFtZVNpemUiLCJkZXNjcmlwdGlvbiIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsImRhdGEiLCJvdXREYXRhIiwiZnJhbWUiLCJtaW4iLCJJbmZpbml0eSIsIm1heCIsImkiLCJsIiwibGVuZ3RoIiwidmFsdWUiLCJpbnB1dFNpZ25hbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBZ0NNQSxNOzs7QUFDSixvQkFBMEI7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFDeEI7QUFEd0IsaUlBRWxCLEVBRmtCLEVBRWRBLE9BRmM7QUFHekI7O0FBRUQ7Ozs7OzBDQUMyQztBQUFBLFVBQXZCQyxnQkFBdUIsdUVBQUosRUFBSTs7QUFDekMsV0FBS0MsbUJBQUwsQ0FBeUJELGdCQUF6Qjs7QUFFQSxXQUFLRSxZQUFMLENBQWtCQyxTQUFsQixHQUE4QixRQUE5QjtBQUNBLFdBQUtELFlBQUwsQ0FBa0JFLFNBQWxCLEdBQThCLENBQTlCO0FBQ0EsV0FBS0YsWUFBTCxDQUFrQkcsV0FBbEIsR0FBZ0MsQ0FBQyxLQUFELEVBQVEsS0FBUixDQUFoQzs7QUFFQSxXQUFLQyxxQkFBTDtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7O2dDQWFZQyxJLEVBQU07QUFDaEIsVUFBTUMsVUFBVSxLQUFLQyxLQUFMLENBQVdGLElBQTNCO0FBQ0EsVUFBSUcsTUFBTSxDQUFDQyxRQUFYO0FBQ0EsVUFBSUMsTUFBTSxDQUFDRCxRQUFYOztBQUVBLFdBQUssSUFBSUUsSUFBSSxDQUFSLEVBQVdDLElBQUlQLEtBQUtRLE1BQXpCLEVBQWlDRixJQUFJQyxDQUFyQyxFQUF3Q0QsR0FBeEMsRUFBNkM7QUFDM0MsWUFBTUcsUUFBUVQsS0FBS00sQ0FBTCxDQUFkO0FBQ0EsWUFBSUcsUUFBUU4sR0FBWixFQUFpQkEsTUFBTU0sS0FBTjtBQUNqQixZQUFJQSxRQUFRSixHQUFaLEVBQWlCQSxNQUFNSSxLQUFOO0FBQ2xCOztBQUVEUixjQUFRLENBQVIsSUFBYUUsR0FBYjtBQUNBRixjQUFRLENBQVIsSUFBYUksR0FBYjs7QUFFQSxhQUFPSixPQUFQO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2NDLEssRUFBTztBQUNuQixXQUFLUSxXQUFMLENBQWlCUixNQUFNRixJQUF2QjtBQUNEOzs7OztrQkFHWVQsTSIsImZpbGUiOiJNaW5NYXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuXG4vKipcbiAqIEZpbmQgbWluaW11biBhbmQgbWF4aW11bSB2YWx1ZXMgb2YgYSBnaXZlbiBgc2lnbmFsYC5cbiAqXG4gKiBfc3VwcG9ydCBgc3RhbmRhbG9uZWAgdXNhZ2VfXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24ub3BlcmF0b3JcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jb21tb24nO1xuICpcbiAqIGNvbnN0IGV2ZW50SW4gPSBuZXcgbGZvLnNvdXJjZS5FdmVudEluKHtcbiAqICAgZnJhbWVTaXplOiA1MTIsXG4gKiAgIGZyYW1lVHlwZTogJ3NpZ25hbCcsXG4gKiAgIHNhbXBsZVJhdGU6IDAsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBtaW5NYXggPSBuZXcgbGZvLm9wZXJhdG9yLk1pbk1heCgpO1xuICpcbiAqIGNvbnN0IGxvZ2dlciA9IG5ldyBsZm8uc2luay5Mb2dnZXIoeyBkYXRhOiB0cnVlIH0pO1xuICpcbiAqIGV2ZW50SW4uY29ubmVjdChtaW5NYXgpO1xuICogbWluTWF4LmNvbm5lY3QobG9nZ2VyKTtcbiAqIGV2ZW50SW4uc3RhcnQoKVxuICpcbiAqIC8vIGNyZWF0ZSBhIGZyYW1lXG4gKiBjb25zdCBzaWduYWwgPSBuZXcgRmxvYXQzMkFycmF5KDUxMik7XG4gKiBmb3IgKGxldCBpID0gMDsgaSA8IDUxMjsgaSsrKVxuICogICBzaWduYWxbaV0gPSBpICsgMTtcbiAqXG4gKiBldmVudEluLnByb2Nlc3MobnVsbCwgc2lnbmFsKTtcbiAqID4gWzEsIDUxMl07XG4gKi9cbmNsYXNzIE1pbk1heCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAvLyB0aHJvdyBlcnJvcnMgaWYgb3B0aW9ucyBhcmUgZ2l2ZW5cbiAgICBzdXBlcih7fSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zID0ge30pIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVR5cGUgPSAndmVjdG9yJztcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSAyO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmRlc2NyaXB0aW9uID0gWydtaW4nLCAnbWF4J107XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSB0aGUgYE1pbk1heGAgb3BlcmF0b3IgaW4gYHN0YW5kYWxvbmVgIG1vZGUgKGkuZS4gb3V0c2lkZSBvZiBhIGdyYXBoKS5cbiAgICpcbiAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXl8QXJyYXl9IGRhdGEgLSBJbnB1dCBzaWduYWwuXG4gICAqIEByZXR1cm4ge0FycmF5fSAtIE1pbiBhbmQgbWF4IHZhbHVlcy5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3QgbWluTWF4ID0gbmV3IE1pbk1heCgpO1xuICAgKiBtaW5NYXguaW5pdFN0cmVhbSh7IGZyYW1lVHlwZTogJ3NpZ25hbCcsIGZyYW1lU2l6ZTogMTAgfSk7XG4gICAqXG4gICAqIG1pbk1heC5pbnB1dFNpZ25hbChbMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOV0pO1xuICAgKiA+IFswLCA1XVxuICAgKi9cbiAgaW5wdXRTaWduYWwoZGF0YSkge1xuICAgIGNvbnN0IG91dERhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgbGV0IG1pbiA9ICtJbmZpbml0eTtcbiAgICBsZXQgbWF4ID0gLUluZmluaXR5O1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBkYXRhLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgdmFsdWUgPSBkYXRhW2ldO1xuICAgICAgaWYgKHZhbHVlIDwgbWluKSBtaW4gPSB2YWx1ZTtcbiAgICAgIGlmICh2YWx1ZSA+IG1heCkgbWF4ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgb3V0RGF0YVswXSA9IG1pbjtcbiAgICBvdXREYXRhWzFdID0gbWF4O1xuXG4gICAgcmV0dXJuIG91dERhdGE7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIHRoaXMuaW5wdXRTaWduYWwoZnJhbWUuZGF0YSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWluTWF4O1xuIl19