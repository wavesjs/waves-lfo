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

var Waveform = (function (_BaseDraw) {
  _inherits(Waveform, _BaseDraw);

  function Waveform(options) {
    _classCallCheck(this, Waveform);

    var defaults = {};

    _get(Object.getPrototypeOf(Waveform.prototype), 'constructor', this).call(this, options, defaults);
  }

  _createClass(Waveform, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(Waveform.prototype), 'initialize', this).call(this);

      if (!this.params.color) {
        this.params.color = (0, _utilsDrawUtils.getRandomColor)();
      }
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      this.scrollModeDraw(time, frame);
      _get(Object.getPrototypeOf(Waveform.prototype), 'process', this).call(this, time, frame, metaData);
    }
  }, {
    key: 'drawCurve',
    value: function drawCurve(frame, previousFrame, iShift) {
      var ctx = this.ctx;
      var min = this.getYPosition(frame[0]);
      var max = this.getYPosition(frame[1]);

      ctx.save();

      ctx.fillStyle = this.params.color;
      ctx.beginPath();

      ctx.moveTo(0, this.getYPosition(0));
      ctx.lineTo(0, max);

      if (previousFrame) {
        var prevMin = this.getYPosition(previousFrame[0]);
        var prevMax = this.getYPosition(previousFrame[1]);
        ctx.lineTo(-iShift, prevMax);
        ctx.lineTo(-iShift, prevMin);
      }

      ctx.lineTo(0, min);

      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }]);

  return Waveform;
})(_baseDraw2['default']);

exports['default'] = Waveform;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rL3dhdmVmb3JtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7d0JBQXFCLGFBQWE7Ozs7OEJBQ0gscUJBQXFCOztJQUcvQixRQUFRO1lBQVIsUUFBUTs7QUFDaEIsV0FEUSxRQUFRLENBQ2YsT0FBTyxFQUFFOzBCQURGLFFBQVE7O0FBRXpCLFFBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQzs7QUFFbEIsK0JBSmlCLFFBQVEsNkNBSW5CLE9BQU8sRUFBRSxRQUFRLEVBQUU7R0FDMUI7O2VBTGtCLFFBQVE7O1dBT2pCLHNCQUFHO0FBQ1gsaUNBUmlCLFFBQVEsNENBUU47O0FBRW5CLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtBQUFFLFlBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLG9CQWJ6QyxjQUFjLEdBYTJDLENBQUM7T0FBRTtLQUNsRTs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsVUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDakMsaUNBZmlCLFFBQVEseUNBZVgsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7S0FDdEM7OztXQUVRLG1CQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFO0FBQ3RDLFVBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDckIsVUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QyxVQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV4QyxTQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRVgsU0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNsQyxTQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRWhCLFNBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxTQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFbkIsVUFBSSxhQUFhLEVBQUU7QUFDakIsWUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRCxZQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BELFdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDN0IsV0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztPQUM5Qjs7QUFFRCxTQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFbkIsU0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLFNBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLFNBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNmOzs7U0EzQ2tCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6ImVzNi9zaW5rL3dhdmVmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VEcmF3IGZyb20gJy4vYmFzZS1kcmF3JztcbmltcG9ydCB7IGdldFJhbmRvbUNvbG9yIH0gZnJvbSAnLi4vdXRpbHMvZHJhdy11dGlscyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F2ZWZvcm0gZXh0ZW5kcyBCYXNlRHJhdyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSB7fTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5jb2xvcikgeyB0aGlzLnBhcmFtcy5jb2xvciA9IGdldFJhbmRvbUNvbG9yKCk7IH1cbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgdGhpcy5zY3JvbGxNb2RlRHJhdyh0aW1lLCBmcmFtZSk7XG4gICAgc3VwZXIucHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpO1xuICB9XG5cbiAgZHJhd0N1cnZlKGZyYW1lLCBwcmV2aW91c0ZyYW1lLCBpU2hpZnQpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCBtaW4gPSB0aGlzLmdldFlQb3NpdGlvbihmcmFtZVswXSk7XG4gICAgY29uc3QgbWF4ID0gdGhpcy5nZXRZUG9zaXRpb24oZnJhbWVbMV0pO1xuXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgICBjdHgubW92ZVRvKDAsIHRoaXMuZ2V0WVBvc2l0aW9uKDApKTtcbiAgICBjdHgubGluZVRvKDAsIG1heCk7XG5cbiAgICBpZiAocHJldmlvdXNGcmFtZSkge1xuICAgICAgY29uc3QgcHJldk1pbiA9IHRoaXMuZ2V0WVBvc2l0aW9uKHByZXZpb3VzRnJhbWVbMF0pO1xuICAgICAgY29uc3QgcHJldk1heCA9IHRoaXMuZ2V0WVBvc2l0aW9uKHByZXZpb3VzRnJhbWVbMV0pO1xuICAgICAgY3R4LmxpbmVUbygtaVNoaWZ0LCBwcmV2TWF4KTtcbiAgICAgIGN0eC5saW5lVG8oLWlTaGlmdCwgcHJldk1pbik7XG4gICAgfVxuXG4gICAgY3R4LmxpbmVUbygwLCBtaW4pO1xuXG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIl19