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

    var defaults = {
      scale: 1
    };

    _get(Object.getPrototypeOf(Sonogram.prototype), 'constructor', this).call(this, options, defaults);
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

        var y = this.params.height - i;
        var c = Math.round(weightedBin * scale * 255);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy9zb25vZ3JhbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3dCQUFxQixhQUFhOzs7OzhCQUNILHFCQUFxQjs7QUFFcEQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDOztJQUNLLFFBQVE7WUFBUixRQUFROztBQUNoQixXQURRLFFBQVEsQ0FDZixPQUFPLEVBQUU7MEJBREYsUUFBUTs7QUFFekIsUUFBTSxRQUFRLEdBQUc7QUFDZixXQUFLLEVBQUUsQ0FBQztLQUNULENBQUM7O0FBRUYsK0JBTmlCLFFBQVEsNkNBTW5CLE9BQU8sRUFBRSxRQUFRLEVBQUU7R0FDMUI7O2VBUGtCLFFBQVE7O1dBaUJwQixpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixVQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqQyxpQ0FuQmlCLFFBQVEseUNBbUJYLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0tBQ3RDOzs7V0FFUSxtQkFBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRTtBQUN0QyxVQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3JCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2xDLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2hDLFVBQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7O0FBRXRELFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Ozs7OztBQU0vQixZQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDO0FBQzdCLFlBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEMsWUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFckMsWUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3BDLFlBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFcEMsWUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLFlBQVksQ0FBQztBQUNyQyxZQUFNLEtBQUssR0FBSSxPQUFPLEdBQUcsT0FBTyxBQUFDLENBQUM7QUFDbEMsWUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDO0FBQzFCLFlBQU0sV0FBVyxHQUFHLEtBQUssR0FBRyxRQUFRLEdBQUcsU0FBUyxDQUFDOztBQUVqRCxZQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDakMsWUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDOztBQUVoRCxXQUFHLENBQUMsU0FBUyxhQUFXLENBQUMsVUFBSyxDQUFDLFVBQUssQ0FBQyxTQUFNLENBQUM7QUFDNUMsV0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDdEM7S0FDRjs7O1NBM0NRLGFBQUMsS0FBSyxFQUFFO0FBQ2YsVUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQzNCO1NBRVEsZUFBRztBQUNWLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7S0FDMUI7OztTQWZrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiJlczYvc2lua3Mvc29ub2dyYW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZURyYXcgZnJvbSAnLi9iYXNlLWRyYXcnO1xuaW1wb3J0IHsgZ2V0UmFuZG9tQ29sb3IgfSBmcm9tICcuLi91dGlscy9kcmF3LXV0aWxzJztcblxubGV0IGNvdW50ZXIgPSAwO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29ub2dyYW0gZXh0ZW5kcyBCYXNlRHJhdyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHNjYWxlOiAxXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcbiAgfVxuXG4gIHNldCBzY2FsZSh2YWx1ZSkge1xuICAgIHRoaXMucGFyYW1zLnNjYWxlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLnNjYWxlO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICB0aGlzLnNjcm9sbE1vZGVEcmF3KHRpbWUsIGZyYW1lKTtcbiAgICBzdXBlci5wcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSk7XG4gIH1cblxuICBkcmF3Q3VydmUoZnJhbWUsIHByZXZpb3VzRnJhbWUsIGlTaGlmdCkge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICBjb25zdCBzY2FsZSA9IHRoaXMucGFyYW1zLnNjYWxlO1xuICAgIGNvbnN0IGJpblBlclBpeGVsID0gZnJhbWUubGVuZ3RoIC8gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoZWlnaHQ7IGkrKykge1xuICAgICAgLy8gaW50ZXJwb2xhdGUgYmV0d2VlbiBwcmV2IGFuZCBuZXh0IGJpbnNcbiAgICAgIC8vIGlzIG5vdCBhIHZlcnkgZ29vZCBzdHJhdGVneSBpZiBtb3JlIHRoYW4gdHdvIGJpbnMgcGVyIHBpeGVsc1xuICAgICAgLy8gc29tZSB2YWx1ZXMgd29uJ3QgYmUgdGFrZW4gaW50byBhY2NvdW50XG4gICAgICAvLyB0aGlzIGhhY2sgaXMgbm90IHJlbGlhYmxlXG4gICAgICAvLyAtPiBjb3VsZCB3ZSByZXNhbXBsZSB0aGUgZnJhbWUgaW4gZnJlcXVlbmN5IGRvbWFpbiA/XG4gICAgICBjb25zdCBmQmluID0gaSAqIGJpblBlclBpeGVsO1xuICAgICAgY29uc3QgcHJldkJpbkluZGV4ID0gTWF0aC5mbG9vcihmQmluKTtcbiAgICAgIGNvbnN0IG5leHRCaW5JbmRleCA9IE1hdGguY2VpbChmQmluKTtcblxuICAgICAgY29uc3QgcHJldkJpbiA9IGZyYW1lW3ByZXZCaW5JbmRleF07XG4gICAgICBjb25zdCBuZXh0QmluID0gZnJhbWVbbmV4dEJpbkluZGV4XTtcblxuICAgICAgY29uc3QgcG9zaXRpb24gPSBmQmluIC0gcHJldkJpbkluZGV4O1xuICAgICAgY29uc3Qgc2xvcGUgPSAobmV4dEJpbiAtIHByZXZCaW4pO1xuICAgICAgY29uc3QgaW50ZXJjZXB0ID0gcHJldkJpbjtcbiAgICAgIGNvbnN0IHdlaWdodGVkQmluID0gc2xvcGUgKiBwb3NpdGlvbiArIGludGVyY2VwdDtcblxuICAgICAgY29uc3QgeSA9IHRoaXMucGFyYW1zLmhlaWdodCAtIGk7XG4gICAgICBjb25zdCBjID0gTWF0aC5yb3VuZCh3ZWlnaHRlZEJpbiAqIHNjYWxlICogMjU1KTtcblxuICAgICAgY3R4LmZpbGxTdHlsZSA9IGByZ2JhKCR7Y30sICR7Y30sICR7Y30sIDEpYDtcbiAgICAgIGN0eC5maWxsUmVjdCgtaVNoaWZ0LCB5LCBpU2hpZnQsIC0xKTtcbiAgICB9XG4gIH1cbn0iXX0=