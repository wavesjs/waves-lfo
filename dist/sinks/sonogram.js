'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseDraw = require('./base-draw');

var _baseDraw2 = _interopRequireDefault(_baseDraw);

var _utilsDrawUtils = require('../utils/draw-utils');

var counter = 0;

var Sonogram = (function (_BaseDraw) {
  _inherits(Sonogram, _BaseDraw);

  function Sonogram(options) {
    _classCallCheck(this, Sonogram);

    _get(Object.getPrototypeOf(Sonogram.prototype), 'constructor', this).call(this, options, {
      scale: 1
    });
  }

  _createClass(Sonogram, [{
    key: 'process',
    value: function process(time, frame, metaData) {
      this.scrollModeDraw(time, frame);
      _get(Object.getPrototypeOf(Sonogram.prototype), 'process', this).call(this, time, frame, metaData);
    }
  }, {
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
})(_baseDraw2['default']);

exports['default'] = Sonogram;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy9zb25vZ3JhbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3dCQUFxQixhQUFhOzs7OzhCQUNILHFCQUFxQjs7QUFFcEQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDOztJQUNLLFFBQVE7WUFBUixRQUFROztBQUNoQixXQURRLFFBQVEsQ0FDZixPQUFPLEVBQUU7MEJBREYsUUFBUTs7QUFFekIsK0JBRmlCLFFBQVEsNkNBRW5CLE9BQU8sRUFBRTtBQUNiLFdBQUssRUFBRSxDQUFDO0tBQ1QsRUFBRTtHQUNKOztlQUxrQixRQUFROztXQWVwQixpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixVQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqQyxpQ0FqQmlCLFFBQVEseUNBaUJYLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0tBQ3RDOzs7V0FFUSxtQkFBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRTtBQUN0QyxVQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3JCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2xDLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2hDLFVBQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7O0FBRXRELFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Ozs7OztBQU0vQixZQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDO0FBQzdCLFlBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEMsWUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFckMsWUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3BDLFlBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFcEMsWUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLFlBQVksQ0FBQztBQUNyQyxZQUFNLEtBQUssR0FBSSxPQUFPLEdBQUcsT0FBTyxBQUFDLENBQUM7QUFDbEMsWUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDO0FBQzFCLFlBQU0sV0FBVyxHQUFHLEtBQUssR0FBRyxRQUFRLEdBQUcsU0FBUyxDQUFDO0FBQ2pELFlBQU0sZUFBZSxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUM7O0FBRWxELFlBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNqQyxZQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUM7O0FBRXBELFdBQUcsQ0FBQyxTQUFTLGFBQVcsQ0FBQyxVQUFLLENBQUMsVUFBSyxDQUFDLFNBQU0sQ0FBQztBQUM1QyxXQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUN0QztLQUNGOzs7U0E1Q1EsYUFBQyxLQUFLLEVBQUU7QUFDZixVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDM0I7U0FFUSxlQUFHO0FBQ1YsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztLQUMxQjs7O1NBYmtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6ImVzNi9zaW5rcy9zb25vZ3JhbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlRHJhdyBmcm9tICcuL2Jhc2UtZHJhdyc7XG5pbXBvcnQgeyBnZXRSYW5kb21Db2xvciB9IGZyb20gJy4uL3V0aWxzL2RyYXctdXRpbHMnO1xuXG5sZXQgY291bnRlciA9IDA7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb25vZ3JhbSBleHRlbmRzIEJhc2VEcmF3IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMsIHtcbiAgICAgIHNjYWxlOiAxXG4gICAgfSk7XG4gIH1cblxuICBzZXQgc2NhbGUodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy5zY2FsZSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHNjYWxlKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy5zY2FsZTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgdGhpcy5zY3JvbGxNb2RlRHJhdyh0aW1lLCBmcmFtZSk7XG4gICAgc3VwZXIucHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpO1xuICB9XG5cbiAgZHJhd0N1cnZlKGZyYW1lLCBwcmV2aW91c0ZyYW1lLCBpU2hpZnQpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgY29uc3Qgc2NhbGUgPSB0aGlzLnBhcmFtcy5zY2FsZTtcbiAgICBjb25zdCBiaW5QZXJQaXhlbCA9IGZyYW1lLmxlbmd0aCAvIHRoaXMucGFyYW1zLmhlaWdodDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGVpZ2h0OyBpKyspIHtcbiAgICAgIC8vIGludGVycG9sYXRlIGJldHdlZW4gcHJldiBhbmQgbmV4dCBiaW5zXG4gICAgICAvLyBpcyBub3QgYSB2ZXJ5IGdvb2Qgc3RyYXRlZ3kgaWYgbW9yZSB0aGFuIHR3byBiaW5zIHBlciBwaXhlbHNcbiAgICAgIC8vIHNvbWUgdmFsdWVzIHdvbid0IGJlIHRha2VuIGludG8gYWNjb3VudFxuICAgICAgLy8gdGhpcyBoYWNrIGlzIG5vdCByZWxpYWJsZVxuICAgICAgLy8gLT4gY291bGQgd2UgcmVzYW1wbGUgdGhlIGZyYW1lIGluIGZyZXF1ZW5jeSBkb21haW4gP1xuICAgICAgY29uc3QgZkJpbiA9IGkgKiBiaW5QZXJQaXhlbDtcbiAgICAgIGNvbnN0IHByZXZCaW5JbmRleCA9IE1hdGguZmxvb3IoZkJpbik7XG4gICAgICBjb25zdCBuZXh0QmluSW5kZXggPSBNYXRoLmNlaWwoZkJpbik7XG5cbiAgICAgIGNvbnN0IHByZXZCaW4gPSBmcmFtZVtwcmV2QmluSW5kZXhdO1xuICAgICAgY29uc3QgbmV4dEJpbiA9IGZyYW1lW25leHRCaW5JbmRleF07XG5cbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gZkJpbiAtIHByZXZCaW5JbmRleDtcbiAgICAgIGNvbnN0IHNsb3BlID0gKG5leHRCaW4gLSBwcmV2QmluKTtcbiAgICAgIGNvbnN0IGludGVyY2VwdCA9IHByZXZCaW47XG4gICAgICBjb25zdCB3ZWlnaHRlZEJpbiA9IHNsb3BlICogcG9zaXRpb24gKyBpbnRlcmNlcHQ7XG4gICAgICBjb25zdCBzcXJ0V2VpZ2h0ZWRCaW4gPSB3ZWlnaHRlZEJpbiAqIHdlaWdodGVkQmluO1xuXG4gICAgICBjb25zdCB5ID0gdGhpcy5wYXJhbXMuaGVpZ2h0IC0gaTtcbiAgICAgIGNvbnN0IGMgPSBNYXRoLnJvdW5kKHNxcnRXZWlnaHRlZEJpbiAqIHNjYWxlICogMjU1KTtcblxuICAgICAgY3R4LmZpbGxTdHlsZSA9IGByZ2JhKCR7Y30sICR7Y30sICR7Y30sIDEpYDtcbiAgICAgIGN0eC5maWxsUmVjdCgtaVNoaWZ0LCB5LCBpU2hpZnQsIC0xKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==