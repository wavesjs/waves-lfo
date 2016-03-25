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

var counter = 0;

var Sonogram = function (_BaseDraw) {
  (0, _inherits3.default)(Sonogram, _BaseDraw);

  function Sonogram(options) {
    (0, _classCallCheck3.default)(this, Sonogram);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Sonogram).call(this, {
      scale: 1
    }, options));
  }

  (0, _createClass3.default)(Sonogram, [{
    key: 'drawCurve',
    value: function drawCurve(frame, previousFrame, iShift) {
      var ctx = this.ctx;
      var height = this.params.height;
      var scale = this.params.scale;
      var binPerPixel = frame.length / this.params.height;

      for (var i = 0; i < height; i++) {
        // interpolate between prev and next bins
        // is not a very good strategy if more than two bins per pixels
        // some values won't be taken into account
        // this hack is not reliable
        // -> could we resample the frame in frequency domain ?
        var fBin = i * binPerPixel;
        var prevBinIndex = Math.floor(fBin);
        var nextBinIndex = Math.ceil(fBin);

        var prevBin = frame[prevBinIndex];
        var nextBin = frame[nextBinIndex];

        var position = fBin - prevBinIndex;
        var slope = nextBin - prevBin;
        var intercept = prevBin;
        var weightedBin = slope * position + intercept;
        var sqrtWeightedBin = weightedBin * weightedBin;

        var y = this.params.height - i;
        var c = Math.round(sqrtWeightedBin * scale * 255);

        ctx.fillStyle = 'rgba(' + c + ', ' + c + ', ' + c + ', 1)';
        ctx.fillRect(-iShift, y, iShift, -1);
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
  return Sonogram;
}(_baseDraw2.default);

exports.default = Sonogram;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvbm9ncmFtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUVBLElBQUksVUFBVSxDQUFWOztJQUNpQjs7O0FBQ25CLFdBRG1CLFFBQ25CLENBQVksT0FBWixFQUFxQjt3Q0FERixVQUNFO3dGQURGLHFCQUVYO0FBQ0osYUFBTyxDQUFQO09BQ0MsVUFIZ0I7R0FBckI7OzZCQURtQjs7OEJBZVQsT0FBTyxlQUFlLFFBQVE7QUFDdEMsVUFBTSxNQUFNLEtBQUssR0FBTCxDQUQwQjtBQUV0QyxVQUFNLFNBQVMsS0FBSyxNQUFMLENBQVksTUFBWixDQUZ1QjtBQUd0QyxVQUFNLFFBQVEsS0FBSyxNQUFMLENBQVksS0FBWixDQUh3QjtBQUl0QyxVQUFNLGNBQWMsTUFBTSxNQUFOLEdBQWUsS0FBSyxNQUFMLENBQVksTUFBWixDQUpHOztBQU10QyxXQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxNQUFKLEVBQVksR0FBNUIsRUFBaUM7Ozs7OztBQU0vQixZQUFNLE9BQU8sSUFBSSxXQUFKLENBTmtCO0FBTy9CLFlBQU0sZUFBZSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWYsQ0FQeUI7QUFRL0IsWUFBTSxlQUFlLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZixDQVJ5Qjs7QUFVL0IsWUFBTSxVQUFVLE1BQU0sWUFBTixDQUFWLENBVnlCO0FBVy9CLFlBQU0sVUFBVSxNQUFNLFlBQU4sQ0FBVixDQVh5Qjs7QUFhL0IsWUFBTSxXQUFXLE9BQU8sWUFBUCxDQWJjO0FBYy9CLFlBQU0sUUFBUyxVQUFVLE9BQVYsQ0FkZ0I7QUFlL0IsWUFBTSxZQUFZLE9BQVosQ0FmeUI7QUFnQi9CLFlBQU0sY0FBYyxRQUFRLFFBQVIsR0FBbUIsU0FBbkIsQ0FoQlc7QUFpQi9CLFlBQU0sa0JBQWtCLGNBQWMsV0FBZCxDQWpCTzs7QUFtQi9CLFlBQU0sSUFBSSxLQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQXFCLENBQXJCLENBbkJxQjtBQW9CL0IsWUFBTSxJQUFJLEtBQUssS0FBTCxDQUFXLGtCQUFrQixLQUFsQixHQUEwQixHQUExQixDQUFmLENBcEJ5Qjs7QUFzQi9CLFlBQUksU0FBSixhQUF3QixXQUFNLFdBQU0sVUFBcEMsQ0F0QitCO0FBdUIvQixZQUFJLFFBQUosQ0FBYSxDQUFDLE1BQUQsRUFBUyxDQUF0QixFQUF5QixNQUF6QixFQUFpQyxDQUFDLENBQUQsQ0FBakMsQ0F2QitCO09BQWpDOzs7O3NCQWRRLE9BQU87QUFDZixXQUFLLE1BQUwsQ0FBWSxLQUFaLEdBQW9CLEtBQXBCLENBRGU7O3dCQUlMO0FBQ1YsYUFBTyxLQUFLLE1BQUwsQ0FBWSxLQUFaLENBREc7OztTQVhPIiwiZmlsZSI6InNvbm9ncmFtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VEcmF3IGZyb20gJy4vYmFzZS1kcmF3JztcbmltcG9ydCB7IGdldFJhbmRvbUNvbG9yIH0gZnJvbSAnLi4vdXRpbHMvZHJhdy11dGlscyc7XG5cbmxldCBjb3VudGVyID0gMDtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvbm9ncmFtIGV4dGVuZHMgQmFzZURyYXcge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoe1xuICAgICAgc2NhbGU6IDFcbiAgICB9LCBvcHRpb25zKTtcbiAgfVxuXG4gIHNldCBzY2FsZSh2YWx1ZSkge1xuICAgIHRoaXMucGFyYW1zLnNjYWxlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLnNjYWxlO1xuICB9XG5cbiAgZHJhd0N1cnZlKGZyYW1lLCBwcmV2aW91c0ZyYW1lLCBpU2hpZnQpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgY29uc3Qgc2NhbGUgPSB0aGlzLnBhcmFtcy5zY2FsZTtcbiAgICBjb25zdCBiaW5QZXJQaXhlbCA9IGZyYW1lLmxlbmd0aCAvIHRoaXMucGFyYW1zLmhlaWdodDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGVpZ2h0OyBpKyspIHtcbiAgICAgIC8vIGludGVycG9sYXRlIGJldHdlZW4gcHJldiBhbmQgbmV4dCBiaW5zXG4gICAgICAvLyBpcyBub3QgYSB2ZXJ5IGdvb2Qgc3RyYXRlZ3kgaWYgbW9yZSB0aGFuIHR3byBiaW5zIHBlciBwaXhlbHNcbiAgICAgIC8vIHNvbWUgdmFsdWVzIHdvbid0IGJlIHRha2VuIGludG8gYWNjb3VudFxuICAgICAgLy8gdGhpcyBoYWNrIGlzIG5vdCByZWxpYWJsZVxuICAgICAgLy8gLT4gY291bGQgd2UgcmVzYW1wbGUgdGhlIGZyYW1lIGluIGZyZXF1ZW5jeSBkb21haW4gP1xuICAgICAgY29uc3QgZkJpbiA9IGkgKiBiaW5QZXJQaXhlbDtcbiAgICAgIGNvbnN0IHByZXZCaW5JbmRleCA9IE1hdGguZmxvb3IoZkJpbik7XG4gICAgICBjb25zdCBuZXh0QmluSW5kZXggPSBNYXRoLmNlaWwoZkJpbik7XG5cbiAgICAgIGNvbnN0IHByZXZCaW4gPSBmcmFtZVtwcmV2QmluSW5kZXhdO1xuICAgICAgY29uc3QgbmV4dEJpbiA9IGZyYW1lW25leHRCaW5JbmRleF07XG5cbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gZkJpbiAtIHByZXZCaW5JbmRleDtcbiAgICAgIGNvbnN0IHNsb3BlID0gKG5leHRCaW4gLSBwcmV2QmluKTtcbiAgICAgIGNvbnN0IGludGVyY2VwdCA9IHByZXZCaW47XG4gICAgICBjb25zdCB3ZWlnaHRlZEJpbiA9IHNsb3BlICogcG9zaXRpb24gKyBpbnRlcmNlcHQ7XG4gICAgICBjb25zdCBzcXJ0V2VpZ2h0ZWRCaW4gPSB3ZWlnaHRlZEJpbiAqIHdlaWdodGVkQmluO1xuXG4gICAgICBjb25zdCB5ID0gdGhpcy5wYXJhbXMuaGVpZ2h0IC0gaTtcbiAgICAgIGNvbnN0IGMgPSBNYXRoLnJvdW5kKHNxcnRXZWlnaHRlZEJpbiAqIHNjYWxlICogMjU1KTtcblxuICAgICAgY3R4LmZpbGxTdHlsZSA9IGByZ2JhKCR7Y30sICR7Y30sICR7Y30sIDEpYDtcbiAgICAgIGN0eC5maWxsUmVjdCgtaVNoaWZ0LCB5LCBpU2hpZnQsIC0xKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==