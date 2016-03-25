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

var Marker = function (_BaseDraw) {
  (0, _inherits3.default)(Marker, _BaseDraw);

  function Marker(options) {
    (0, _classCallCheck3.default)(this, Marker);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Marker).call(this, {
      frameSize: 1,
      color: (0, _drawUtils.getRandomColor)(),
      threshold: 0
    }, options));
  }

  (0, _createClass3.default)(Marker, [{
    key: 'drawCurve',
    value: function drawCurve(frame, prevFrame, iShift) {
      var color = this.params.color;
      var ctx = this.ctx;
      var height = ctx.height;

      var value = frame[0];

      if (value > this.params.threshold) {
        ctx.save();
        ctx.strokeStyle = this.params.color;
        ctx.beginPath();
        ctx.moveTo(-iShift, this.getYPosition(this.params.min));
        ctx.lineTo(-iShift, this.getYPosition(this.params.max));
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      }
    }
  }]);
  return Marker;
}(_baseDraw2.default);

exports.default = Marker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hcmtlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7SUFHcUI7OztBQUNuQixXQURtQixNQUNuQixDQUFZLE9BQVosRUFBcUI7d0NBREYsUUFDRTt3RkFERixtQkFFWDtBQUNKLGlCQUFXLENBQVg7QUFDQSxhQUFPLGdDQUFQO0FBQ0EsaUJBQVcsQ0FBWDtPQUNDLFVBTGdCO0dBQXJCOzs2QkFEbUI7OzhCQVNULE9BQU8sV0FBVyxRQUFRO0FBQ2xDLFVBQU0sUUFBUSxLQUFLLE1BQUwsQ0FBWSxLQUFaLENBRG9CO0FBRWxDLFVBQU0sTUFBTSxLQUFLLEdBQUwsQ0FGc0I7QUFHbEMsVUFBTSxTQUFTLElBQUksTUFBSixDQUhtQjs7QUFLbEMsVUFBTSxRQUFRLE1BQU0sQ0FBTixDQUFSLENBTDRCOztBQU9sQyxVQUFJLFFBQVEsS0FBSyxNQUFMLENBQVksU0FBWixFQUF1QjtBQUNqQyxZQUFJLElBQUosR0FEaUM7QUFFakMsWUFBSSxXQUFKLEdBQWtCLEtBQUssTUFBTCxDQUFZLEtBQVosQ0FGZTtBQUdqQyxZQUFJLFNBQUosR0FIaUM7QUFJakMsWUFBSSxNQUFKLENBQVcsQ0FBQyxNQUFELEVBQVMsS0FBSyxZQUFMLENBQWtCLEtBQUssTUFBTCxDQUFZLEdBQVosQ0FBdEMsRUFKaUM7QUFLakMsWUFBSSxNQUFKLENBQVcsQ0FBQyxNQUFELEVBQVMsS0FBSyxZQUFMLENBQWtCLEtBQUssTUFBTCxDQUFZLEdBQVosQ0FBdEMsRUFMaUM7QUFNakMsWUFBSSxNQUFKLEdBTmlDO0FBT2pDLFlBQUksU0FBSixHQVBpQztBQVFqQyxZQUFJLE9BQUosR0FSaUM7T0FBbkM7OztTQWhCaUIiLCJmaWxlIjoibWFya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VEcmF3IGZyb20gJy4vYmFzZS1kcmF3JztcbmltcG9ydCB7IGdldFJhbmRvbUNvbG9yIH0gZnJvbSAnLi4vdXRpbHMvZHJhdy11dGlscyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFya2VyIGV4dGVuZHMgQmFzZURyYXcge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoe1xuICAgICAgZnJhbWVTaXplOiAxLFxuICAgICAgY29sb3I6IGdldFJhbmRvbUNvbG9yKCksXG4gICAgICB0aHJlc2hvbGQ6IDAsXG4gICAgfSwgb3B0aW9ucyk7XG4gIH1cblxuICBkcmF3Q3VydmUoZnJhbWUsIHByZXZGcmFtZSwgaVNoaWZ0KSB7XG4gICAgY29uc3QgY29sb3IgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCBoZWlnaHQgPSBjdHguaGVpZ2h0O1xuXG4gICAgY29uc3QgdmFsdWUgPSBmcmFtZVswXTtcblxuICAgIGlmICh2YWx1ZSA+IHRoaXMucGFyYW1zLnRocmVzaG9sZCkge1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMucGFyYW1zLmNvbG9yO1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4Lm1vdmVUbygtaVNoaWZ0LCB0aGlzLmdldFlQb3NpdGlvbih0aGlzLnBhcmFtcy5taW4pKTtcbiAgICAgIGN0eC5saW5lVG8oLWlTaGlmdCwgdGhpcy5nZXRZUG9zaXRpb24odGhpcy5wYXJhbXMubWF4KSk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfVxufVxuIl19