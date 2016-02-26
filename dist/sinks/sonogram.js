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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy9zb25vZ3JhbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3dCQUFxQixhQUFhOzs7OzhCQUNILHFCQUFxQjs7QUFFcEQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDOztJQUNLLFFBQVE7WUFBUixRQUFROztBQUNoQixXQURRLFFBQVEsQ0FDZixPQUFPLEVBQUU7MEJBREYsUUFBUTs7QUFFekIsK0JBRmlCLFFBQVEsNkNBRW5CLE9BQU8sRUFBRTtBQUNiLFdBQUssRUFBRSxDQUFDO0tBQ1QsRUFBRTtHQUNKOztlQUxrQixRQUFROztXQWVsQixtQkFBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRTtBQUN0QyxVQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3JCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2xDLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2hDLFVBQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7O0FBRXRELFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Ozs7OztBQU0vQixZQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDO0FBQzdCLFlBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEMsWUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFckMsWUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3BDLFlBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFcEMsWUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLFlBQVksQ0FBQztBQUNyQyxZQUFNLEtBQUssR0FBSSxPQUFPLEdBQUcsT0FBTyxBQUFDLENBQUM7QUFDbEMsWUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDO0FBQzFCLFlBQU0sV0FBVyxHQUFHLEtBQUssR0FBRyxRQUFRLEdBQUcsU0FBUyxDQUFDO0FBQ2pELFlBQU0sZUFBZSxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUM7O0FBRWxELFlBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNqQyxZQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUM7O0FBRXBELFdBQUcsQ0FBQyxTQUFTLGFBQVcsQ0FBQyxVQUFLLENBQUMsVUFBSyxDQUFDLFNBQU0sQ0FBQztBQUM1QyxXQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUN0QztLQUNGOzs7U0F2Q1EsYUFBQyxLQUFLLEVBQUU7QUFDZixVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDM0I7U0FFUSxlQUFHO0FBQ1YsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztLQUMxQjs7O1NBYmtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6ImVzNi9zaW5rcy9zb25vZ3JhbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlRHJhdyBmcm9tICcuL2Jhc2UtZHJhdyc7XG5pbXBvcnQgeyBnZXRSYW5kb21Db2xvciB9IGZyb20gJy4uL3V0aWxzL2RyYXctdXRpbHMnO1xuXG5sZXQgY291bnRlciA9IDA7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb25vZ3JhbSBleHRlbmRzIEJhc2VEcmF3IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMsIHtcbiAgICAgIHNjYWxlOiAxXG4gICAgfSk7XG4gIH1cblxuICBzZXQgc2NhbGUodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy5zY2FsZSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHNjYWxlKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy5zY2FsZTtcbiAgfVxuXG4gIGRyYXdDdXJ2ZShmcmFtZSwgcHJldmlvdXNGcmFtZSwgaVNoaWZ0KSB7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIGNvbnN0IHNjYWxlID0gdGhpcy5wYXJhbXMuc2NhbGU7XG4gICAgY29uc3QgYmluUGVyUGl4ZWwgPSBmcmFtZS5sZW5ndGggLyB0aGlzLnBhcmFtcy5oZWlnaHQ7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhlaWdodDsgaSsrKSB7XG4gICAgICAvLyBpbnRlcnBvbGF0ZSBiZXR3ZWVuIHByZXYgYW5kIG5leHQgYmluc1xuICAgICAgLy8gaXMgbm90IGEgdmVyeSBnb29kIHN0cmF0ZWd5IGlmIG1vcmUgdGhhbiB0d28gYmlucyBwZXIgcGl4ZWxzXG4gICAgICAvLyBzb21lIHZhbHVlcyB3b24ndCBiZSB0YWtlbiBpbnRvIGFjY291bnRcbiAgICAgIC8vIHRoaXMgaGFjayBpcyBub3QgcmVsaWFibGVcbiAgICAgIC8vIC0+IGNvdWxkIHdlIHJlc2FtcGxlIHRoZSBmcmFtZSBpbiBmcmVxdWVuY3kgZG9tYWluID9cbiAgICAgIGNvbnN0IGZCaW4gPSBpICogYmluUGVyUGl4ZWw7XG4gICAgICBjb25zdCBwcmV2QmluSW5kZXggPSBNYXRoLmZsb29yKGZCaW4pO1xuICAgICAgY29uc3QgbmV4dEJpbkluZGV4ID0gTWF0aC5jZWlsKGZCaW4pO1xuXG4gICAgICBjb25zdCBwcmV2QmluID0gZnJhbWVbcHJldkJpbkluZGV4XTtcbiAgICAgIGNvbnN0IG5leHRCaW4gPSBmcmFtZVtuZXh0QmluSW5kZXhdO1xuXG4gICAgICBjb25zdCBwb3NpdGlvbiA9IGZCaW4gLSBwcmV2QmluSW5kZXg7XG4gICAgICBjb25zdCBzbG9wZSA9IChuZXh0QmluIC0gcHJldkJpbik7XG4gICAgICBjb25zdCBpbnRlcmNlcHQgPSBwcmV2QmluO1xuICAgICAgY29uc3Qgd2VpZ2h0ZWRCaW4gPSBzbG9wZSAqIHBvc2l0aW9uICsgaW50ZXJjZXB0O1xuICAgICAgY29uc3Qgc3FydFdlaWdodGVkQmluID0gd2VpZ2h0ZWRCaW4gKiB3ZWlnaHRlZEJpbjtcblxuICAgICAgY29uc3QgeSA9IHRoaXMucGFyYW1zLmhlaWdodCAtIGk7XG4gICAgICBjb25zdCBjID0gTWF0aC5yb3VuZChzcXJ0V2VpZ2h0ZWRCaW4gKiBzY2FsZSAqIDI1NSk7XG5cbiAgICAgIGN0eC5maWxsU3R5bGUgPSBgcmdiYSgke2N9LCAke2N9LCAke2N9LCAxKWA7XG4gICAgICBjdHguZmlsbFJlY3QoLWlTaGlmdCwgeSwgaVNoaWZ0LCAtMSk7XG4gICAgfVxuICB9XG59XG4iXX0=