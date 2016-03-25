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

var _baseDraw = require('./base-draw');

var _baseDraw2 = _interopRequireDefault(_baseDraw);

var _drawUtils = require('../utils/draw-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Spectrogram = function (_BaseDraw) {
  (0, _inherits3.default)(Spectrogram, _BaseDraw);

  function Spectrogram(options) {
    (0, _classCallCheck3.default)(this, Spectrogram);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Spectrogram).call(this, {
      min: 0,
      max: 1,
      scale: 1,
      color: (0, _drawUtils.getRandomColor)()
    }, options));
  }

  (0, _createClass3.default)(Spectrogram, [{
    key: 'executeDraw',


    // no need to scroll or anything
    value: function executeDraw(time, frame) {
      this.drawCurve(frame);
    }
  }, {
    key: 'drawCurve',
    value: function drawCurve(frame) {
      var nbrBins = frame.length;
      var width = this.params.width;
      var height = this.params.height;
      var binWidth = width / nbrBins;
      var scale = this.params.scale;
      var ctx = this.ctx;

      ctx.fillStyle = this.params.color;
      ctx.clearRect(0, 0, width, height);

      var error = 0;

      for (var i = 0; i < nbrBins; i++) {
        var x = Math.round(i * binWidth);
        var y = this.getYPosition(frame[i] * scale);
        ctx.fillRect(x, y, binWidth, height - y);
      }
    }
  }, {
    key: 'scale',
    set: function set(value) {
      this.params.scale = value;
    },
    get: function get() {
      return this.params.scale;
    }
  }]);
  return Spectrogram;
}(_baseDraw2.default);

exports.default = Spectrogram;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNwZWN0cm9ncmFtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztJQUdxQjs7O0FBQ25CLFdBRG1CLFdBQ25CLENBQVksT0FBWixFQUFxQjt3Q0FERixhQUNFO3dGQURGLHdCQUVYO0FBQ0osV0FBSyxDQUFMO0FBQ0EsV0FBSyxDQUFMO0FBQ0EsYUFBTyxDQUFQO0FBQ0EsYUFBTyxnQ0FBUDtPQUNDLFVBTmdCO0dBQXJCOzs2QkFEbUI7Ozs7O2dDQW1CUCxNQUFNLE9BQU87QUFDdkIsV0FBSyxTQUFMLENBQWUsS0FBZixFQUR1Qjs7Ozs4QkFJZixPQUFPO0FBQ2YsVUFBTSxVQUFVLE1BQU0sTUFBTixDQUREO0FBRWYsVUFBTSxRQUFRLEtBQUssTUFBTCxDQUFZLEtBQVosQ0FGQztBQUdmLFVBQU0sU0FBUyxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBSEE7QUFJZixVQUFNLFdBQVcsUUFBUSxPQUFSLENBSkY7QUFLZixVQUFNLFFBQVEsS0FBSyxNQUFMLENBQVksS0FBWixDQUxDO0FBTWYsVUFBTSxNQUFNLEtBQUssR0FBTCxDQU5HOztBQVFmLFVBQUksU0FBSixHQUFnQixLQUFLLE1BQUwsQ0FBWSxLQUFaLENBUkQ7QUFTZixVQUFJLFNBQUosQ0FBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLEtBQXBCLEVBQTJCLE1BQTNCLEVBVGU7O0FBV2YsVUFBSSxRQUFRLENBQVIsQ0FYVzs7QUFhZixXQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxPQUFKLEVBQWEsR0FBN0IsRUFBa0M7QUFDaEMsWUFBTSxJQUFJLEtBQUssS0FBTCxDQUFXLElBQUksUUFBSixDQUFmLENBRDBCO0FBRWhDLFlBQU0sSUFBSSxLQUFLLFlBQUwsQ0FBa0IsTUFBTSxDQUFOLElBQVcsS0FBWCxDQUF0QixDQUYwQjtBQUdoQyxZQUFJLFFBQUosQ0FBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLFFBQW5CLEVBQTZCLFNBQVMsQ0FBVCxDQUE3QixDQUhnQztPQUFsQzs7OztzQkExQlEsT0FBTztBQUNmLFdBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsS0FBcEIsQ0FEZTs7d0JBSUw7QUFDVixhQUFPLEtBQUssTUFBTCxDQUFZLEtBQVosQ0FERzs7O1NBZE8iLCJmaWxlIjoic3BlY3Ryb2dyYW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZURyYXcgZnJvbSAnLi9iYXNlLWRyYXcnO1xuaW1wb3J0IHsgZ2V0UmFuZG9tQ29sb3IgfSBmcm9tICcuLi91dGlscy9kcmF3LXV0aWxzJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcGVjdHJvZ3JhbSBleHRlbmRzIEJhc2VEcmF3IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIG1pbjogMCxcbiAgICAgIG1heDogMSxcbiAgICAgIHNjYWxlOiAxLFxuICAgICAgY29sb3I6IGdldFJhbmRvbUNvbG9yKCksXG4gICAgfSwgb3B0aW9ucyk7XG4gIH1cblxuICBzZXQgc2NhbGUodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy5zY2FsZSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHNjYWxlKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy5zY2FsZTtcbiAgfVxuXG4gIC8vIG5vIG5lZWQgdG8gc2Nyb2xsIG9yIGFueXRoaW5nXG4gIGV4ZWN1dGVEcmF3KHRpbWUsIGZyYW1lKSB7XG4gICAgdGhpcy5kcmF3Q3VydmUoZnJhbWUpO1xuICB9XG5cbiAgZHJhd0N1cnZlKGZyYW1lKSB7XG4gICAgY29uc3QgbmJyQmlucyA9IGZyYW1lLmxlbmd0aDtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMucGFyYW1zLndpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICBjb25zdCBiaW5XaWR0aCA9IHdpZHRoIC8gbmJyQmlucztcbiAgICBjb25zdCBzY2FsZSA9IHRoaXMucGFyYW1zLnNjYWxlO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuXG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMucGFyYW1zLmNvbG9yO1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICBsZXQgZXJyb3IgPSAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYnJCaW5zOyBpKyspIHtcbiAgICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKGkgKiBiaW5XaWR0aCk7XG4gICAgICBjb25zdCB5ID0gdGhpcy5nZXRZUG9zaXRpb24oZnJhbWVbaV0gKiBzY2FsZSk7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgYmluV2lkdGgsIGhlaWdodCAtIHkpO1xuICAgIH1cbiAgfVxufVxuIl19