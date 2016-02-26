'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreBaseLfo = require('../core/base-lfo');

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var Magnitude = (function (_BaseLfo) {
  _inherits(Magnitude, _BaseLfo);

  function Magnitude(options) {
    _classCallCheck(this, Magnitude);

    var defaults = {
      normalize: true,
      power: false
    };

    _get(Object.getPrototypeOf(Magnitude.prototype), 'constructor', this).call(this, options, defaults);
  }

  _createClass(Magnitude, [{
    key: 'configureStream',
    value: function configureStream() {
      this.streamParams.frameSize = 1;
    }
  }, {
    key: 'inputArray',
    value: function inputArray(frame) {
      var outFrame = this.outFrame;
      var frameSize = frame.length;
      var sum = 0;

      for (var i = 0; i < frameSize; i++) {
        sum += frame[i] * frame[i];
      }var mag = sum;

      if (this.params.normalize) mag /= frameSize;

      if (!this.params.power) mag = Math.sqrt(mag);

      outFrame[0] = mag;

      return outFrame;
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      this.inputArray(frame);
      this.output(time, this.outFrame, metaData);
    }
  }]);

  return Magnitude;
})(_coreBaseLfo2['default']);

exports['default'] = Magnitude;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbWFnbml0dWRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7OztJQUdqQixTQUFTO1lBQVQsU0FBUzs7QUFDakIsV0FEUSxTQUFTLENBQ2hCLE9BQU8sRUFBRTswQkFERixTQUFTOztBQUUxQixRQUFNLFFBQVEsR0FBRztBQUNmLGVBQVMsRUFBRSxJQUFJO0FBQ2YsV0FBSyxFQUFFLEtBQUs7S0FDYixDQUFDOztBQUVGLCtCQVBpQixTQUFTLDZDQU9wQixPQUFPLEVBQUUsUUFBUSxFQUFFO0dBQzFCOztlQVJrQixTQUFTOztXQVViLDJCQUFHO0FBQ2hCLFVBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztLQUNqQzs7O1dBRVMsb0JBQUMsS0FBSyxFQUFFO0FBQ2hCLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDL0IsVUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUMvQixVQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7O0FBRVosV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUU7QUFDaEMsV0FBRyxJQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEFBQUMsQ0FBQztPQUFBLEFBRS9CLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQzs7QUFFZCxVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUN2QixHQUFHLElBQUksU0FBUyxDQUFDOztBQUVuQixVQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQ3BCLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUV2QixjQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDOztBQUVsQixhQUFPLFFBQVEsQ0FBQztLQUNqQjs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsVUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2QixVQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQzVDOzs7U0F0Q2tCLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6ImVzNi9vcGVyYXRvcnMvbWFnbml0dWRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFnbml0dWRlIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIG5vcm1hbGl6ZTogdHJ1ZSxcbiAgICAgIHBvd2VyOiBmYWxzZSxcbiAgICB9O1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuICB9XG5cbiAgY29uZmlndXJlU3RyZWFtKCkge1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IDE7XG4gIH1cblxuICBpbnB1dEFycmF5KGZyYW1lKSB7XG4gICAgY29uc3Qgb3V0RnJhbWUgPSB0aGlzLm91dEZyYW1lO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IGZyYW1lLmxlbmd0aDtcbiAgICBsZXQgc3VtID0gMDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspXG4gICAgICBzdW0gKz0gKGZyYW1lW2ldICogZnJhbWVbaV0pO1xuXG4gICAgbGV0IG1hZyA9IHN1bTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5ub3JtYWxpemUpXG4gICAgICBtYWcgLz0gZnJhbWVTaXplO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5wb3dlcilcbiAgICAgIG1hZyA9IE1hdGguc3FydChtYWcpO1xuXG4gICAgb3V0RnJhbWVbMF0gPSBtYWc7XG5cbiAgICByZXR1cm4gb3V0RnJhbWU7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIHRoaXMuaW5wdXRBcnJheShmcmFtZSk7XG4gICAgdGhpcy5vdXRwdXQodGltZSwgdGhpcy5vdXRGcmFtZSwgbWV0YURhdGEpO1xuICB9XG59XG4iXX0=