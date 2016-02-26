'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreBaseLfo = require('../core/base-lfo');

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

/*
  can forward
    - relativeTime (according to it's start() method)
    - absoluteTime (audioContex time)
    - input time

  methods
    - `start()` -> call `reset()`
    - `stop()`  -> call `finalize()`
*/

var EventIn = (function (_BaseLfo) {
  _inherits(EventIn, _BaseLfo);

  function EventIn(options) {
    _classCallCheck(this, EventIn);

    _get(Object.getPrototypeOf(EventIn.prototype), 'constructor', this).call(this, {
      timeType: 'absolute'
    });

    // test AudioContext for use in node environment
    if (!this.params.ctx && typeof process === 'undefined') {
      this.params.ctx = new AudioContext();
    }

    this._isStarted = false;
    this._startTime = undefined;
  }

  _createClass(EventIn, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(EventIn.prototype), 'initialize', this).call(this, {
        frameSize: this.params.frameSize,
        frameRate: this.params.frameRate,
        sourceSampleRate: this.params.frameRate
      });
    }
  }, {
    key: 'start',
    value: function start() {
      this.initialize();
      this.reset();

      // should be setted in the first process call
      this._isStarted = true;
      this._startTime = undefined;
    }
  }, {
    key: 'stop',
    value: function stop() {
      this._isStarted = false;
      this._startTime = undefined;
      this.finalize();
    }
  }, {
    key: 'process',
    value: function process(time, frame) {
      var metaData = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      if (!this._isStarted) {
        return;
      }
      // à revoir
      // if no time provided, use audioContext.currentTime
      var frameTime = !isNaN(parseFloat(time)) && isFinite(time) ? time : this.params.ctx.currentTime;

      // set `startTime` if first call after a `start`
      if (!this._startTime) {
        this._startTime = frameTime;
      }

      // handle time according to config
      if (this.params.timeType === 'relative') {
        frameTime = time - this._startTime;
      }

      // if scalar, create a vector
      if (frame.length === undefined) {
        frame = [frame];
      }
      // works if frame is an array
      this.outFrame.set(frame, 0);
      this.time = frameTime;
      this.metaData = metaData;

      this.output();
    }
  }]);

  return EventIn;
})(_coreBaseLfo2['default']);

exports['default'] = EventIn;

module.exports = EventIn;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2V2ZW50LWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7Ozs7Ozs7Ozs7Ozs7O0lBYWpCLE9BQU87WUFBUCxPQUFPOztBQUNmLFdBRFEsT0FBTyxDQUNkLE9BQU8sRUFBRTswQkFERixPQUFPOztBQUV4QiwrQkFGaUIsT0FBTyw2Q0FFbEI7QUFDSixjQUFRLEVBQUUsVUFBVTtLQUNyQixFQUFFOzs7QUFHSCxRQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUssT0FBTyxPQUFPLEtBQUssV0FBVyxBQUFDLEVBQUU7QUFDeEQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztLQUN0Qzs7QUFFRCxRQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztBQUN4QixRQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztHQUM3Qjs7ZUFia0IsT0FBTzs7V0FlaEIsc0JBQUc7QUFDWCxpQ0FoQmlCLE9BQU8sNENBZ0JQO0FBQ2YsaUJBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7QUFDaEMsaUJBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7QUFDaEMsd0JBQWdCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTO09BQ3hDLEVBQUU7S0FDSjs7O1dBRUksaUJBQUc7QUFDTixVQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDOzs7QUFHYixVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztBQUN2QixVQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztLQUM3Qjs7O1dBRUcsZ0JBQUc7QUFDTCxVQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztBQUN4QixVQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztBQUM1QixVQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDakI7OztXQUVNLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQWlCO1VBQWYsUUFBUSx5REFBRyxFQUFFOztBQUNoQyxVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUFFLGVBQU87T0FBRTs7O0FBR2pDLFVBQUksU0FBUyxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FDeEQsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQzs7O0FBR3JDLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQUUsWUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7T0FBRTs7O0FBR3RELFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssVUFBVSxFQUFFO0FBQ3ZDLGlCQUFTLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7T0FDcEM7OztBQUdELFVBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7QUFBRSxhQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUFFOztBQUVwRCxVQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUIsVUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7QUFDdEIsVUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7O0FBRXpCLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7U0E3RGtCLE9BQU87OztxQkFBUCxPQUFPOztBQWdFNUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiZXM2L3NvdXJjZXMvZXZlbnQtaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuLypcbiAgY2FuIGZvcndhcmRcbiAgICAtIHJlbGF0aXZlVGltZSAoYWNjb3JkaW5nIHRvIGl0J3Mgc3RhcnQoKSBtZXRob2QpXG4gICAgLSBhYnNvbHV0ZVRpbWUgKGF1ZGlvQ29udGV4IHRpbWUpXG4gICAgLSBpbnB1dCB0aW1lXG5cbiAgbWV0aG9kc1xuICAgIC0gYHN0YXJ0KClgIC0+IGNhbGwgYHJlc2V0KClgXG4gICAgLSBgc3RvcCgpYCAgLT4gY2FsbCBgZmluYWxpemUoKWBcbiovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50SW4gZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIHRpbWVUeXBlOiAnYWJzb2x1dGUnXG4gICAgfSk7XG5cbiAgICAvLyB0ZXN0IEF1ZGlvQ29udGV4dCBmb3IgdXNlIGluIG5vZGUgZW52aXJvbm1lbnRcbiAgICBpZiAoIXRoaXMucGFyYW1zLmN0eCAmJiAodHlwZW9mIHByb2Nlc3MgPT09ICd1bmRlZmluZWQnKSkge1xuICAgICAgdGhpcy5wYXJhbXMuY3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICAgIH1cblxuICAgIHRoaXMuX2lzU3RhcnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3N0YXJ0VGltZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSh7XG4gICAgICBmcmFtZVNpemU6IHRoaXMucGFyYW1zLmZyYW1lU2l6ZSxcbiAgICAgIGZyYW1lUmF0ZTogdGhpcy5wYXJhbXMuZnJhbWVSYXRlLFxuICAgICAgc291cmNlU2FtcGxlUmF0ZTogdGhpcy5wYXJhbXMuZnJhbWVSYXRlLFxuICAgIH0pO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5yZXNldCgpO1xuXG4gICAgLy8gc2hvdWxkIGJlIHNldHRlZCBpbiB0aGUgZmlyc3QgcHJvY2VzcyBjYWxsXG4gICAgdGhpcy5faXNTdGFydGVkID0gdHJ1ZTtcbiAgICB0aGlzLl9zdGFydFRpbWUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuX2lzU3RhcnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3N0YXJ0VGltZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSA9IHt9KSB7XG4gICAgaWYgKCF0aGlzLl9pc1N0YXJ0ZWQpIHsgcmV0dXJuOyB9XG4gICAgLy8gw6AgcmV2b2lyXG4gICAgLy8gaWYgbm8gdGltZSBwcm92aWRlZCwgdXNlIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZVxuICAgIHZhciBmcmFtZVRpbWUgPSAhaXNOYU4ocGFyc2VGbG9hdCh0aW1lKSkgJiYgaXNGaW5pdGUodGltZSkgP1xuICAgICAgdGltZSA6IHRoaXMucGFyYW1zLmN0eC5jdXJyZW50VGltZTtcblxuICAgIC8vIHNldCBgc3RhcnRUaW1lYCBpZiBmaXJzdCBjYWxsIGFmdGVyIGEgYHN0YXJ0YFxuICAgIGlmICghdGhpcy5fc3RhcnRUaW1lKSB7IHRoaXMuX3N0YXJ0VGltZSA9IGZyYW1lVGltZTsgfVxuXG4gICAgLy8gaGFuZGxlIHRpbWUgYWNjb3JkaW5nIHRvIGNvbmZpZ1xuICAgIGlmICh0aGlzLnBhcmFtcy50aW1lVHlwZSA9PT0gJ3JlbGF0aXZlJykge1xuICAgICAgZnJhbWVUaW1lID0gdGltZSAtIHRoaXMuX3N0YXJ0VGltZTtcbiAgICB9XG5cbiAgICAvLyBpZiBzY2FsYXIsIGNyZWF0ZSBhIHZlY3RvclxuICAgIGlmIChmcmFtZS5sZW5ndGggPT09IHVuZGVmaW5lZCkgeyBmcmFtZSA9IFtmcmFtZV07IH1cbiAgICAvLyB3b3JrcyBpZiBmcmFtZSBpcyBhbiBhcnJheVxuICAgIHRoaXMub3V0RnJhbWUuc2V0KGZyYW1lLCAwKTtcbiAgICB0aGlzLnRpbWUgPSBmcmFtZVRpbWU7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50SW47XG4iXX0=