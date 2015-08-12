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

/*
  can forward
    - relativeTime (according to it's start() method)
    - absoluteTime (audioContex time)
    - input time

  methods
    - `start()` -> call `reset()`
    - `stop()`  -> call `finalize()`
*/

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var EventIn = (function (_BaseLfo) {
  _inherits(EventIn, _BaseLfo);

  function EventIn(options) {
    _classCallCheck(this, EventIn);

    var defaults = {
      timeType: 'absolute'
    };
    // cannot have previous
    _get(Object.getPrototypeOf(EventIn.prototype), 'constructor', this).call(this, options, defaults);

    // test AudioContext for use in node environment
    if (!this.params.ctx && typeof process === 'undefined') {
      this.params.ctx = new AudioContext();
    }

    this._isStarted = false;
    this._startTime = undefined;

    // this.setupStream({
    //   frameSize: this.params.frameSize,
    //   frameRate: this.params.frameRate,
    //   // @NOTE does it make sens ?
    //   blockSampleRate: this.params.frameRate * this.params.frameSize
    // });
  }

  _createClass(EventIn, [{
    key: 'configureStream',
    value: function configureStream() {
      // test if some values are not defined ?
      this.streamParams.frameSize = this.params.frameSize;
      this.streamParams.frameRate = this.params.frameRate;
      this.streamParams.sourceSampleRate = this.params.frameSize * this.params.frameRate;
    }
  }, {
    key: 'start',
    value: function start() {
      // should be setted in the first process call
      this._isStarted = true;
      this._startTime = undefined;

      this.initialize();
      this.reset();
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

      if (!this.isStarted) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2V2ZW50LWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7Ozs7Ozs7Ozs7Ozs7O0lBYWpCLE9BQU87WUFBUCxPQUFPOztBQUNmLFdBRFEsT0FBTyxDQUNkLE9BQU8sRUFBRTswQkFERixPQUFPOztBQUd4QixRQUFJLFFBQVEsR0FBRztBQUNiLGNBQVEsRUFBRSxVQUFVO0tBQ3JCLENBQUM7O0FBRUYsK0JBUGlCLE9BQU8sNkNBT2xCLE9BQU8sRUFBRSxRQUFRLEVBQUU7OztBQUd6QixRQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUssT0FBTyxPQUFPLEtBQUssV0FBVyxBQUFDLEVBQUU7QUFDeEQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztLQUN0Qzs7QUFFRCxRQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztBQUN4QixRQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQzs7Ozs7Ozs7R0FRN0I7O2VBdkJrQixPQUFPOztXQXlCWCwyQkFBRzs7QUFFaEIsVUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDcEQsVUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDcEQsVUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztLQUNwRjs7O1dBRUksaUJBQUc7O0FBRU4sVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDdkIsVUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7O0FBRTVCLFVBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNsQixVQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDZDs7O1dBRUcsZ0JBQUc7QUFDTCxVQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztBQUN4QixVQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztBQUM1QixVQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDakI7OztXQUVNLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQWlCO1VBQWYsUUFBUSx5REFBRyxFQUFFOztBQUNoQyxVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGVBQU87T0FBRTs7OztBQUloQyxVQUFJLFNBQVMsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQ3hELElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7OztBQUdyQyxVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUFFLFlBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO09BQUU7OztBQUd0RCxVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtBQUN2QyxpQkFBUyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO09BQ3BDOzs7QUFHRCxVQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO0FBQUUsYUFBSyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7T0FBRTs7QUFFcEQsVUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVCLFVBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUV6QixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O1NBdkVrQixPQUFPOzs7cUJBQVAsT0FBTzs7QUEwRTVCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL2V2ZW50LWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cbi8qXG4gIGNhbiBmb3J3YXJkXG4gICAgLSByZWxhdGl2ZVRpbWUgKGFjY29yZGluZyB0byBpdCdzIHN0YXJ0KCkgbWV0aG9kKVxuICAgIC0gYWJzb2x1dGVUaW1lIChhdWRpb0NvbnRleCB0aW1lKVxuICAgIC0gaW5wdXQgdGltZVxuXG4gIG1ldGhvZHNcbiAgICAtIGBzdGFydCgpYCAtPiBjYWxsIGByZXNldCgpYFxuICAgIC0gYHN0b3AoKWAgIC0+IGNhbGwgYGZpbmFsaXplKClgXG4qL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudEluIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIHRpbWVUeXBlOiAnYWJzb2x1dGUnXG4gICAgfTtcbiAgICAvLyBjYW5ub3QgaGF2ZSBwcmV2aW91c1xuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIC8vIHRlc3QgQXVkaW9Db250ZXh0IGZvciB1c2UgaW4gbm9kZSBlbnZpcm9ubWVudFxuICAgIGlmICghdGhpcy5wYXJhbXMuY3R4ICYmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICB0aGlzLnBhcmFtcy5jdHggPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gICAgdGhpcy5fc3RhcnRUaW1lID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gdGhpcy5zZXR1cFN0cmVhbSh7XG4gICAgLy8gICBmcmFtZVNpemU6IHRoaXMucGFyYW1zLmZyYW1lU2l6ZSxcbiAgICAvLyAgIGZyYW1lUmF0ZTogdGhpcy5wYXJhbXMuZnJhbWVSYXRlLFxuICAgIC8vICAgLy8gQE5PVEUgZG9lcyBpdCBtYWtlIHNlbnMgP1xuICAgIC8vICAgYmxvY2tTYW1wbGVSYXRlOiB0aGlzLnBhcmFtcy5mcmFtZVJhdGUgKiB0aGlzLnBhcmFtcy5mcmFtZVNpemVcbiAgICAvLyB9KTtcbiAgfVxuXG4gIGNvbmZpZ3VyZVN0cmVhbSgpIHtcbiAgICAvLyB0ZXN0IGlmIHNvbWUgdmFsdWVzIGFyZSBub3QgZGVmaW5lZCA/XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHRoaXMucGFyYW1zLmZyYW1lUmF0ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplICogdGhpcy5wYXJhbXMuZnJhbWVSYXRlO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgLy8gc2hvdWxkIGJlIHNldHRlZCBpbiB0aGUgZmlyc3QgcHJvY2VzcyBjYWxsXG4gICAgdGhpcy5faXNTdGFydGVkID0gdHJ1ZTtcbiAgICB0aGlzLl9zdGFydFRpbWUgPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuX2lzU3RhcnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3N0YXJ0VGltZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSA9IHt9KSB7XG4gICAgaWYgKCF0aGlzLmlzU3RhcnRlZCkgeyByZXR1cm47IH1cblxuICAgIC8vIMOgIHJldm9pclxuICAgIC8vIGlmIG5vIHRpbWUgcHJvdmlkZWQsIHVzZSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWVcbiAgICB2YXIgZnJhbWVUaW1lID0gIWlzTmFOKHBhcnNlRmxvYXQodGltZSkpICYmIGlzRmluaXRlKHRpbWUpID9cbiAgICAgIHRpbWUgOiB0aGlzLnBhcmFtcy5jdHguY3VycmVudFRpbWU7XG5cbiAgICAvLyBzZXQgYHN0YXJ0VGltZWAgaWYgZmlyc3QgY2FsbCBhZnRlciBhIGBzdGFydGBcbiAgICBpZiAoIXRoaXMuX3N0YXJ0VGltZSkgeyB0aGlzLl9zdGFydFRpbWUgPSBmcmFtZVRpbWU7IH1cblxuICAgIC8vIGhhbmRsZSB0aW1lIGFjY29yZGluZyB0byBjb25maWdcbiAgICBpZiAodGhpcy5wYXJhbXMudGltZVR5cGUgPT09ICdyZWxhdGl2ZScpIHtcbiAgICAgIGZyYW1lVGltZSA9IHRpbWUgLSB0aGlzLl9zdGFydFRpbWU7XG4gICAgfVxuXG4gICAgLy8gaWYgc2NhbGFyLCBjcmVhdGUgYSB2ZWN0b3JcbiAgICBpZiAoZnJhbWUubGVuZ3RoID09PSB1bmRlZmluZWQpIHsgZnJhbWUgPSBbZnJhbWVdOyB9XG4gICAgLy8gd29ya3MgaWYgZnJhbWUgaXMgYW4gYXJyYXlcbiAgICB0aGlzLm91dEZyYW1lLnNldChmcmFtZSwgMCk7XG4gICAgdGhpcy50aW1lID0gZnJhbWVUaW1lO1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEluO1xuIl19