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

var _baseLfo = require('../core/base-lfo');

var _baseLfo2 = _interopRequireDefault(_baseLfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Magnitude = function (_BaseLfo) {
  (0, _inherits3.default)(Magnitude, _BaseLfo);

  function Magnitude(options) {
    (0, _classCallCheck3.default)(this, Magnitude);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Magnitude).call(this, {
      normalize: true,
      power: false
    }, options));
  }

  (0, _createClass3.default)(Magnitude, [{
    key: 'initialize',
    value: function initialize(inStreamParams) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Magnitude.prototype), 'initialize', this).call(this, inStreamParams, {
        frameSize: 1
      });
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
}(_baseLfo2.default);

exports.default = Magnitude;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hZ25pdHVkZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0lBR3FCOzs7QUFDbkIsV0FEbUIsU0FDbkIsQ0FBWSxPQUFaLEVBQXFCO3dDQURGLFdBQ0U7d0ZBREYsc0JBRVg7QUFDSixpQkFBVyxJQUFYO0FBQ0EsYUFBTyxLQUFQO09BQ0MsVUFKZ0I7R0FBckI7OzZCQURtQjs7K0JBUVIsZ0JBQWdCO0FBQ3pCLHVEQVRpQixxREFTQSxnQkFBZ0I7QUFDL0IsbUJBQVcsQ0FBWDtRQURGLENBRHlCOzs7OytCQU1oQixPQUFPO0FBQ2hCLFVBQU0sV0FBVyxLQUFLLFFBQUwsQ0FERDtBQUVoQixVQUFNLFlBQVksTUFBTSxNQUFOLENBRkY7QUFHaEIsVUFBSSxNQUFNLENBQU4sQ0FIWTs7QUFLaEIsV0FBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksU0FBSixFQUFlLEdBQS9CO0FBQ0UsZUFBUSxNQUFNLENBQU4sSUFBVyxNQUFNLENBQU4sQ0FBWDtPQURWLElBR0ksTUFBTSxHQUFOLENBUlk7O0FBVWhCLFVBQUksS0FBSyxNQUFMLENBQVksU0FBWixFQUNGLE9BQU8sU0FBUCxDQURGOztBQUdBLFVBQUksQ0FBQyxLQUFLLE1BQUwsQ0FBWSxLQUFaLEVBQ0gsTUFBTSxLQUFLLElBQUwsQ0FBVSxHQUFWLENBQU4sQ0FERjs7QUFHQSxlQUFTLENBQVQsSUFBYyxHQUFkLENBaEJnQjs7QUFrQmhCLGFBQU8sUUFBUCxDQWxCZ0I7Ozs7NEJBcUJWLE1BQU0sT0FBTyxVQUFVO0FBQzdCLFdBQUssVUFBTCxDQUFnQixLQUFoQixFQUQ2QjtBQUU3QixXQUFLLE1BQUwsQ0FBWSxJQUFaLEVBQWtCLEtBQUssUUFBTCxFQUFlLFFBQWpDLEVBRjZCOzs7U0FuQ1oiLCJmaWxlIjoibWFnbml0dWRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFnbml0dWRlIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICBub3JtYWxpemU6IHRydWUsXG4gICAgICBwb3dlcjogZmFsc2UsXG4gICAgfSwgb3B0aW9ucyk7XG4gIH1cblxuICBpbml0aWFsaXplKGluU3RyZWFtUGFyYW1zKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZShpblN0cmVhbVBhcmFtcywge1xuICAgICAgZnJhbWVTaXplOiAxLFxuICAgIH0pO1xuICB9XG5cbiAgaW5wdXRBcnJheShmcmFtZSkge1xuICAgIGNvbnN0IG91dEZyYW1lID0gdGhpcy5vdXRGcmFtZTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSBmcmFtZS5sZW5ndGg7XG4gICAgbGV0IHN1bSA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKVxuICAgICAgc3VtICs9IChmcmFtZVtpXSAqIGZyYW1lW2ldKTtcblxuICAgIGxldCBtYWcgPSBzdW07XG5cbiAgICBpZiAodGhpcy5wYXJhbXMubm9ybWFsaXplKVxuICAgICAgbWFnIC89IGZyYW1lU2l6ZTtcblxuICAgIGlmICghdGhpcy5wYXJhbXMucG93ZXIpXG4gICAgICBtYWcgPSBNYXRoLnNxcnQobWFnKTtcblxuICAgIG91dEZyYW1lWzBdID0gbWFnO1xuXG4gICAgcmV0dXJuIG91dEZyYW1lO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICB0aGlzLmlucHV0QXJyYXkoZnJhbWUpO1xuICAgIHRoaXMub3V0cHV0KHRpbWUsIHRoaXMub3V0RnJhbWUsIG1ldGFEYXRhKTtcbiAgfVxufVxuIl19