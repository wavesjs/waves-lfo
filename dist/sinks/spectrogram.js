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

var Spectrogram = (function (_BaseDraw) {
  _inherits(Spectrogram, _BaseDraw);

  function Spectrogram(options) {
    _classCallCheck(this, Spectrogram);

    var defaults = {
      min: 0,
      max: 1,
      scale: 1
    };

    _get(Object.getPrototypeOf(Spectrogram.prototype), 'constructor', this).call(this, options, defaults);
  }

  _createClass(Spectrogram, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(Spectrogram.prototype), 'initialize', this).call(this);

      this._rafFlag = true;
      if (!this.params.color) {
        this.params.color = (0, _utilsDrawUtils.getRandomColor)();
      }
    }
  }, {
    key: 'finalize',
    value: function finalize() {
      _get(Object.getPrototypeOf(Spectrogram.prototype), 'finalize', this).call(this);
      this._rafFlag = false;
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var _this = this;

      if (this._rafFlag) {
        this._rafFlag = false;
        requestAnimationFrame(function () {
          return _this.drawCurve(frame);
        });
      }

      _get(Object.getPrototypeOf(Spectrogram.prototype), 'process', this).call(this, time, frame, metaData);
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

      for (var i = 0; i < nbrBins; i++) {
        var x = i / nbrBins * width;
        var y = this.getYPosition(frame[i] * scale);

        ctx.fillRect(x, y, binWidth, height - y);
      }

      this._rafFlag = true;
    }
  }, {
    key: 'scale',
    set: function set(value) {
      this.params.scale = value;
    }
  }]);

  return Spectrogram;
})(_baseDraw2['default']);

exports['default'] = Spectrogram;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy9zcGVjdHJvZ3JhbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3dCQUFxQixhQUFhOzs7OzhCQUNILHFCQUFxQjs7SUFHL0IsV0FBVztZQUFYLFdBQVc7O0FBQ25CLFdBRFEsV0FBVyxDQUNsQixPQUFPLEVBQUU7MEJBREYsV0FBVzs7QUFFNUIsUUFBTSxRQUFRLEdBQUc7QUFDZixTQUFHLEVBQUUsQ0FBQztBQUNOLFNBQUcsRUFBRSxDQUFDO0FBQ04sV0FBSyxFQUFFLENBQUM7S0FDVCxDQUFDOztBQUVGLCtCQVJpQixXQUFXLDZDQVF0QixPQUFPLEVBQUUsUUFBUSxFQUFFO0dBQzFCOztlQVRrQixXQUFXOztXQWVwQixzQkFBRztBQUNYLGlDQWhCaUIsV0FBVyw0Q0FnQlQ7O0FBRW5CLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtBQUFFLFlBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLG9CQXRCekMsY0FBYyxHQXNCMkMsQ0FBQztPQUFFO0tBQ2xFOzs7V0FFTyxvQkFBRztBQUNULGlDQXZCaUIsV0FBVywwQ0F1Qlg7QUFDakIsVUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7S0FDdkI7OztXQUVNLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFOzs7QUFDN0IsVUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pCLFlBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQ3RCLDZCQUFxQixDQUFDO2lCQUFNLE1BQUssU0FBUyxDQUFDLEtBQUssQ0FBQztTQUFBLENBQUMsQ0FBQztPQUNwRDs7QUFFRCxpQ0FqQ2lCLFdBQVcseUNBaUNkLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0tBQ3RDOzs7V0FFUSxtQkFBQyxLQUFLLEVBQUU7QUFDZixVQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQzdCLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2hDLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2xDLFVBQU0sUUFBUSxHQUFHLEtBQUssR0FBRyxPQUFPLENBQUM7QUFDakMsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDaEMsVUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQzs7QUFFckIsU0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNsQyxTQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUVuQyxXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2hDLFlBQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQzlCLFlBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDOztBQUU5QyxXQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztPQUMxQzs7QUFFRCxVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztLQUN0Qjs7O1NBNUNRLGFBQUMsS0FBSyxFQUFFO0FBQ2YsVUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQzNCOzs7U0Fia0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiZXM2L3NpbmtzL3NwZWN0cm9ncmFtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VEcmF3IGZyb20gJy4vYmFzZS1kcmF3JztcbmltcG9ydCB7IGdldFJhbmRvbUNvbG9yIH0gZnJvbSAnLi4vdXRpbHMvZHJhdy11dGlscyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BlY3Ryb2dyYW0gZXh0ZW5kcyBCYXNlRHJhdyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIG1pbjogMCxcbiAgICAgIG1heDogMSxcbiAgICAgIHNjYWxlOiAxXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcbiAgfVxuXG4gIHNldCBzY2FsZSh2YWx1ZSkge1xuICAgIHRoaXMucGFyYW1zLnNjYWxlID0gdmFsdWU7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcblxuICAgIHRoaXMuX3JhZkZsYWcgPSB0cnVlO1xuICAgIGlmICghdGhpcy5wYXJhbXMuY29sb3IpIHsgdGhpcy5wYXJhbXMuY29sb3IgPSBnZXRSYW5kb21Db2xvcigpOyB9XG4gIH1cblxuICBmaW5hbGl6ZSgpIHtcbiAgICBzdXBlci5maW5hbGl6ZSgpO1xuICAgIHRoaXMuX3JhZkZsYWcgPSBmYWxzZTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgaWYgKHRoaXMuX3JhZkZsYWcpIHtcbiAgICAgIHRoaXMuX3JhZkZsYWcgPSBmYWxzZTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmRyYXdDdXJ2ZShmcmFtZSkpO1xuICAgIH1cblxuICAgIHN1cGVyLnByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKTtcbiAgfVxuXG4gIGRyYXdDdXJ2ZShmcmFtZSkge1xuICAgIGNvbnN0IG5ickJpbnMgPSBmcmFtZS5sZW5ndGg7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnBhcmFtcy53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgY29uc3QgYmluV2lkdGggPSB3aWR0aCAvIG5ickJpbnM7XG4gICAgY29uc3Qgc2NhbGUgPSB0aGlzLnBhcmFtcy5zY2FsZTtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcblxuICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYnJCaW5zOyBpKyspIHtcbiAgICAgIGNvbnN0IHggPSBpIC8gbmJyQmlucyAqIHdpZHRoO1xuICAgICAgY29uc3QgeSA9IHRoaXMuZ2V0WVBvc2l0aW9uKGZyYW1lW2ldICogc2NhbGUpO1xuXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgYmluV2lkdGgsIGhlaWdodCAtIHkpO1xuICAgIH1cblxuICAgIHRoaXMuX3JhZkZsYWcgPSB0cnVlO1xuICB9XG59Il19