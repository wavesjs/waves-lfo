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

      // error handling needs review...
      var error = 0;

      for (var i = 0; i < nbrBins; i++) {
        var x1Float = i * binWidth + error;
        var x1Int = Math.round(x1Float);
        var x2Float = x1Float + (binWidth - error);
        var x2Int = Math.round(x2Float);

        error = x2Int - x2Float;

        if (x1Int !== x2Int) {
          var _width = x2Int - x1Int;
          var y = this.getYPosition(frame[i] * scale);
          ctx.fillRect(x1Int, y, _width, height - y);
        } else {
          error -= binWidth;
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNwZWN0cm9ncmFtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztJQUdxQjs7O0FBQ25CLFdBRG1CLFdBQ25CLENBQVksT0FBWixFQUFxQjt3Q0FERixhQUNFO3dGQURGLHdCQUVYO0FBQ0osV0FBSyxDQUFMO0FBQ0EsV0FBSyxDQUFMO0FBQ0EsYUFBTyxDQUFQO0FBQ0EsYUFBTyxnQ0FBUDtPQUNDLFVBTmdCO0dBQXJCOzs2QkFEbUI7Ozs7O2dDQW1CUCxNQUFNLE9BQU87QUFDdkIsV0FBSyxTQUFMLENBQWUsS0FBZixFQUR1Qjs7Ozs4QkFJZixPQUFPO0FBQ2YsVUFBTSxVQUFVLE1BQU0sTUFBTixDQUREO0FBRWYsVUFBTSxRQUFRLEtBQUssTUFBTCxDQUFZLEtBQVosQ0FGQztBQUdmLFVBQU0sU0FBUyxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBSEE7QUFJZixVQUFNLFdBQVcsUUFBUSxPQUFSLENBSkY7QUFLZixVQUFNLFFBQVEsS0FBSyxNQUFMLENBQVksS0FBWixDQUxDO0FBTWYsVUFBTSxNQUFNLEtBQUssR0FBTCxDQU5HOztBQVFmLFVBQUksU0FBSixHQUFnQixLQUFLLE1BQUwsQ0FBWSxLQUFaLENBUkQ7QUFTZixVQUFJLFNBQUosQ0FBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLEtBQXBCLEVBQTJCLE1BQTNCOzs7QUFUZSxVQVlYLFFBQVEsQ0FBUixDQVpXOztBQWNmLFdBQUssSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLE9BQUosRUFBYSxHQUE3QixFQUFrQztBQUNoQyxZQUFNLFVBQVUsSUFBSSxRQUFKLEdBQWUsS0FBZixDQURnQjtBQUVoQyxZQUFNLFFBQVEsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFSLENBRjBCO0FBR2hDLFlBQU0sVUFBVSxXQUFXLFdBQVcsS0FBWCxDQUFYLENBSGdCO0FBSWhDLFlBQU0sUUFBUSxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQVIsQ0FKMEI7O0FBTWhDLGdCQUFRLFFBQVEsT0FBUixDQU53Qjs7QUFRaEMsWUFBSSxVQUFVLEtBQVYsRUFBaUI7QUFDbkIsY0FBTSxTQUFRLFFBQVEsS0FBUixDQURLO0FBRW5CLGNBQU0sSUFBSSxLQUFLLFlBQUwsQ0FBa0IsTUFBTSxDQUFOLElBQVcsS0FBWCxDQUF0QixDQUZhO0FBR25CLGNBQUksUUFBSixDQUFhLEtBQWIsRUFBb0IsQ0FBcEIsRUFBdUIsTUFBdkIsRUFBOEIsU0FBUyxDQUFULENBQTlCLENBSG1CO1NBQXJCLE1BSU87QUFDTCxtQkFBUyxRQUFULENBREs7U0FKUDtPQVJGOzs7O3NCQTNCUSxPQUFPO0FBQ2YsV0FBSyxNQUFMLENBQVksS0FBWixHQUFvQixLQUFwQixDQURlOzt3QkFJTDtBQUNWLGFBQU8sS0FBSyxNQUFMLENBQVksS0FBWixDQURHOzs7U0FkTyIsImZpbGUiOiJzcGVjdHJvZ3JhbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlRHJhdyBmcm9tICcuL2Jhc2UtZHJhdyc7XG5pbXBvcnQgeyBnZXRSYW5kb21Db2xvciB9IGZyb20gJy4uL3V0aWxzL2RyYXctdXRpbHMnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwZWN0cm9ncmFtIGV4dGVuZHMgQmFzZURyYXcge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoe1xuICAgICAgbWluOiAwLFxuICAgICAgbWF4OiAxLFxuICAgICAgc2NhbGU6IDEsXG4gICAgICBjb2xvcjogZ2V0UmFuZG9tQ29sb3IoKSxcbiAgICB9LCBvcHRpb25zKTtcbiAgfVxuXG4gIHNldCBzY2FsZSh2YWx1ZSkge1xuICAgIHRoaXMucGFyYW1zLnNjYWxlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLnNjYWxlO1xuICB9XG5cbiAgLy8gbm8gbmVlZCB0byBzY3JvbGwgb3IgYW55dGhpbmdcbiAgZXhlY3V0ZURyYXcodGltZSwgZnJhbWUpIHtcbiAgICB0aGlzLmRyYXdDdXJ2ZShmcmFtZSk7XG4gIH1cblxuICBkcmF3Q3VydmUoZnJhbWUpIHtcbiAgICBjb25zdCBuYnJCaW5zID0gZnJhbWUubGVuZ3RoO1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5wYXJhbXMud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIGNvbnN0IGJpbldpZHRoID0gd2lkdGggLyBuYnJCaW5zO1xuICAgIGNvbnN0IHNjYWxlID0gdGhpcy5wYXJhbXMuc2NhbGU7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG5cbiAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5wYXJhbXMuY29sb3I7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIC8vIGVycm9yIGhhbmRsaW5nIG5lZWRzIHJldmlldy4uLlxuICAgIGxldCBlcnJvciA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ickJpbnM7IGkrKykge1xuICAgICAgY29uc3QgeDFGbG9hdCA9IGkgKiBiaW5XaWR0aCArIGVycm9yO1xuICAgICAgY29uc3QgeDFJbnQgPSBNYXRoLnJvdW5kKHgxRmxvYXQpO1xuICAgICAgY29uc3QgeDJGbG9hdCA9IHgxRmxvYXQgKyAoYmluV2lkdGggLSBlcnJvcik7XG4gICAgICBjb25zdCB4MkludCA9IE1hdGgucm91bmQoeDJGbG9hdCk7XG5cbiAgICAgIGVycm9yID0geDJJbnQgLSB4MkZsb2F0O1xuXG4gICAgICBpZiAoeDFJbnQgIT09IHgySW50KSB7XG4gICAgICAgIGNvbnN0IHdpZHRoID0geDJJbnQgLSB4MUludDtcbiAgICAgICAgY29uc3QgeSA9IHRoaXMuZ2V0WVBvc2l0aW9uKGZyYW1lW2ldICogc2NhbGUpO1xuICAgICAgICBjdHguZmlsbFJlY3QoeDFJbnQsIHksIHdpZHRoLCBoZWlnaHQgLSB5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVycm9yIC09IGJpbldpZHRoO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19