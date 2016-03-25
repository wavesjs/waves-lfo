'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

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

var MovingMedian = function (_BaseLfo) {
  (0, _inherits3.default)(MovingMedian, _BaseLfo);

  function MovingMedian(options) {
    (0, _classCallCheck3.default)(this, MovingMedian);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(MovingMedian).call(this, {
      order: 9
    }, options));

    if (_this.params.order % 2 === 0) {
      throw new Error('order must be an odd number');
    }

    _this.queue = new Float32Array(_this.params.order);
    _this.sorter = [];
    return _this;
  }

  (0, _createClass3.default)(MovingMedian, [{
    key: 'reset',
    value: function reset() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(MovingMedian.prototype), 'reset', this).call(this);

      for (var i = 0, l = this.queue.length; i < l; i++) {
        this.queue[i] = 0;
      }
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var outFrame = this.outFrame;
      var frameSize = frame.length;
      var order = this.params.order;
      var pushIndex = this.params.order - 1;
      var medianIndex = Math.floor(order / 2);

      for (var i = 0; i < frameSize; i++) {
        var current = frame[i];
        // update queue
        this.queue.set(this.queue.subarray(1), 0);
        this.queue[pushIndex] = current;
        // get median
        this.sorter = (0, _from2.default)(this.queue.values());
        this.sorter.sort(function (a, b) {
          return a - b;
        });

        outFrame[i] = this.sorter[medianIndex];
      }

      this.output(time, outFrame, metaData);
    }
  }]);
  return MovingMedian;
}(_baseLfo2.default);

exports.default = MovingMedian;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vdmluZy1tZWRpYW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7SUFFcUI7OztBQUNuQixXQURtQixZQUNuQixDQUFZLE9BQVosRUFBcUI7d0NBREYsY0FDRTs7NkZBREYseUJBRVg7QUFDSixhQUFPLENBQVA7T0FDQyxVQUhnQjs7QUFLbkIsUUFBSSxNQUFLLE1BQUwsQ0FBWSxLQUFaLEdBQW9CLENBQXBCLEtBQTBCLENBQTFCLEVBQTZCO0FBQy9CLFlBQU0sSUFBSSxLQUFKLENBQVUsNkJBQVYsQ0FBTixDQUQrQjtLQUFqQzs7QUFJQSxVQUFLLEtBQUwsR0FBYSxJQUFJLFlBQUosQ0FBaUIsTUFBSyxNQUFMLENBQVksS0FBWixDQUE5QixDQVRtQjtBQVVuQixVQUFLLE1BQUwsR0FBYyxFQUFkLENBVm1COztHQUFyQjs7NkJBRG1COzs0QkFjWDtBQUNOLHVEQWZpQixrREFlakIsQ0FETTs7QUFHTixXQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxLQUFLLEtBQUwsQ0FBVyxNQUFYLEVBQW1CLElBQUksQ0FBSixFQUFPLEdBQTlDLEVBQW1EO0FBQ2pELGFBQUssS0FBTCxDQUFXLENBQVgsSUFBZ0IsQ0FBaEIsQ0FEaUQ7T0FBbkQ7Ozs7NEJBS00sTUFBTSxPQUFPLFVBQVU7QUFDN0IsVUFBTSxXQUFXLEtBQUssUUFBTCxDQURZO0FBRTdCLFVBQU0sWUFBWSxNQUFNLE1BQU4sQ0FGVztBQUc3QixVQUFNLFFBQVEsS0FBSyxNQUFMLENBQVksS0FBWixDQUhlO0FBSTdCLFVBQU0sWUFBWSxLQUFLLE1BQUwsQ0FBWSxLQUFaLEdBQW9CLENBQXBCLENBSlc7QUFLN0IsVUFBTSxjQUFjLEtBQUssS0FBTCxDQUFXLFFBQVEsQ0FBUixDQUF6QixDQUx1Qjs7QUFPN0IsV0FBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksU0FBSixFQUFlLEdBQS9CLEVBQW9DO0FBQ2xDLFlBQU0sVUFBVSxNQUFNLENBQU4sQ0FBVjs7QUFENEIsWUFHbEMsQ0FBSyxLQUFMLENBQVcsR0FBWCxDQUFlLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsQ0FBcEIsQ0FBZixFQUF1QyxDQUF2QyxFQUhrQztBQUlsQyxhQUFLLEtBQUwsQ0FBVyxTQUFYLElBQXdCLE9BQXhCOztBQUprQyxZQU1sQyxDQUFLLE1BQUwsR0FBYyxvQkFBVyxLQUFLLEtBQUwsQ0FBVyxNQUFYLEVBQVgsQ0FBZCxDQU5rQztBQU9sQyxhQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLFVBQUMsQ0FBRCxFQUFJLENBQUo7aUJBQVUsSUFBSSxDQUFKO1NBQVYsQ0FBakIsQ0FQa0M7O0FBU2xDLGlCQUFTLENBQVQsSUFBYyxLQUFLLE1BQUwsQ0FBWSxXQUFaLENBQWQsQ0FUa0M7T0FBcEM7O0FBWUEsV0FBSyxNQUFMLENBQVksSUFBWixFQUFrQixRQUFsQixFQUE0QixRQUE1QixFQW5CNkI7OztTQXRCWiIsImZpbGUiOiJtb3ZpbmctbWVkaWFuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vdmluZ01lZGlhbiBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoe1xuICAgICAgb3JkZXI6IDksXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMub3JkZXIgJSAyID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ29yZGVyIG11c3QgYmUgYW4gb2RkIG51bWJlcicpO1xuICAgIH1cblxuICAgIHRoaXMucXVldWUgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMucGFyYW1zLm9yZGVyKTtcbiAgICB0aGlzLnNvcnRlciA9IFtdO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5xdWV1ZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMucXVldWVbaV0gPSAwO1xuICAgIH1cbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgY29uc3Qgb3V0RnJhbWUgPSB0aGlzLm91dEZyYW1lO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IGZyYW1lLmxlbmd0aDtcbiAgICBjb25zdCBvcmRlciA9IHRoaXMucGFyYW1zLm9yZGVyO1xuICAgIGNvbnN0IHB1c2hJbmRleCA9IHRoaXMucGFyYW1zLm9yZGVyIC0gMTtcbiAgICBjb25zdCBtZWRpYW5JbmRleCA9IE1hdGguZmxvb3Iob3JkZXIgLyAyKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IGN1cnJlbnQgPSBmcmFtZVtpXTtcbiAgICAgIC8vIHVwZGF0ZSBxdWV1ZVxuICAgICAgdGhpcy5xdWV1ZS5zZXQodGhpcy5xdWV1ZS5zdWJhcnJheSgxKSwgMCk7XG4gICAgICB0aGlzLnF1ZXVlW3B1c2hJbmRleF0gPSBjdXJyZW50O1xuICAgICAgLy8gZ2V0IG1lZGlhblxuICAgICAgdGhpcy5zb3J0ZXIgPSBBcnJheS5mcm9tKHRoaXMucXVldWUudmFsdWVzKCkpO1xuICAgICAgdGhpcy5zb3J0ZXIuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xuXG4gICAgICBvdXRGcmFtZVtpXSA9IHRoaXMuc29ydGVyW21lZGlhbkluZGV4XTtcbiAgICB9XG5cbiAgICB0aGlzLm91dHB1dCh0aW1lLCBvdXRGcmFtZSwgbWV0YURhdGEpO1xuICB9XG59XG4iXX0=