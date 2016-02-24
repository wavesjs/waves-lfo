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
  }

  _createClass(EventIn, [{
    key: 'configureStream',
    value: function configureStream() {
      // throw error if some values are undefined ?
      this.streamParams.frameSize = this.params.frameSize;
      this.streamParams.frameRate = this.params.frameRate;
      // @NOTE what does make sens in this case ?
      // this.streamParams.sourceSampleRate = this.params.frameSize * this.params.frameRate;
      this.streamParams.sourceSampleRate = this.params.sourceSampleRate || this.params.frameRate;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2V2ZW50LWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7Ozs7Ozs7Ozs7Ozs7O0lBYWpCLE9BQU87WUFBUCxPQUFPOztBQUNmLFdBRFEsT0FBTyxDQUNkLE9BQU8sRUFBRTswQkFERixPQUFPOztBQUd4QixRQUFJLFFBQVEsR0FBRztBQUNiLGNBQVEsRUFBRSxVQUFVO0tBQ3JCLENBQUM7O0FBRUYsK0JBUGlCLE9BQU8sNkNBT2xCLE9BQU8sRUFBRSxRQUFRLEVBQUU7OztBQUd6QixRQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUssT0FBTyxPQUFPLEtBQUssV0FBVyxBQUFDLEVBQUU7QUFDeEQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztLQUN0Qzs7QUFFRCxRQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztBQUN4QixRQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztHQUM3Qjs7ZUFoQmtCLE9BQU87O1dBa0JYLDJCQUFHOztBQUVoQixVQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNwRCxVQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQzs7O0FBR3BELFVBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEdBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQUFBQyxDQUFDO0tBQzlGOzs7V0FFSSxpQkFBRzs7QUFFTixVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztBQUN2QixVQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQzs7QUFFNUIsVUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNkOzs7V0FFRyxnQkFBRztBQUNMLFVBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQ3hCLFVBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0FBQzVCLFVBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUNqQjs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBaUI7VUFBZixRQUFRLHlEQUFHLEVBQUU7O0FBQ2hDLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQUUsZUFBTztPQUFFOzs7QUFHakMsVUFBSSxTQUFTLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxHQUN4RCxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDOzs7QUFHckMsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFBRSxZQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztPQUFFOzs7QUFHdEQsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsS0FBSyxVQUFVLEVBQUU7QUFDdkMsaUJBQVMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztPQUNwQzs7O0FBR0QsVUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtBQUFFLGFBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQUU7O0FBRXBELFVBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QixVQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztBQUN0QixVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFekIsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2Y7OztTQWpFa0IsT0FBTzs7O3FCQUFQLE9BQU87O0FBb0U1QixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJlczYvc291cmNlcy9ldmVudC1pbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG4vKlxuICBjYW4gZm9yd2FyZFxuICAgIC0gcmVsYXRpdmVUaW1lIChhY2NvcmRpbmcgdG8gaXQncyBzdGFydCgpIG1ldGhvZClcbiAgICAtIGFic29sdXRlVGltZSAoYXVkaW9Db250ZXggdGltZSlcbiAgICAtIGlucHV0IHRpbWVcblxuICBtZXRob2RzXG4gICAgLSBgc3RhcnQoKWAgLT4gY2FsbCBgcmVzZXQoKWBcbiAgICAtIGBzdG9wKClgICAtPiBjYWxsIGBmaW5hbGl6ZSgpYFxuKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRJbiBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG5cbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICB0aW1lVHlwZTogJ2Fic29sdXRlJ1xuICAgIH07XG4gICAgLy8gY2Fubm90IGhhdmUgcHJldmlvdXNcbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICAvLyB0ZXN0IEF1ZGlvQ29udGV4dCBmb3IgdXNlIGluIG5vZGUgZW52aXJvbm1lbnRcbiAgICBpZiAoIXRoaXMucGFyYW1zLmN0eCAmJiAodHlwZW9mIHByb2Nlc3MgPT09ICd1bmRlZmluZWQnKSkge1xuICAgICAgdGhpcy5wYXJhbXMuY3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICAgIH1cblxuICAgIHRoaXMuX2lzU3RhcnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3N0YXJ0VGltZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbmZpZ3VyZVN0cmVhbSgpIHtcbiAgICAvLyB0aHJvdyBlcnJvciBpZiBzb21lIHZhbHVlcyBhcmUgdW5kZWZpbmVkID9cbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5mcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gdGhpcy5wYXJhbXMuZnJhbWVSYXRlO1xuICAgIC8vIEBOT1RFIHdoYXQgZG9lcyBtYWtlIHNlbnMgaW4gdGhpcyBjYXNlID9cbiAgICAvLyB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplICogdGhpcy5wYXJhbXMuZnJhbWVSYXRlO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgPSAodGhpcy5wYXJhbXMuc291cmNlU2FtcGxlUmF0ZSB8fMKgdGhpcy5wYXJhbXMuZnJhbWVSYXRlKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIC8vIHNob3VsZCBiZSBzZXR0ZWQgaW4gdGhlIGZpcnN0IHByb2Nlc3MgY2FsbFxuICAgIHRoaXMuX2lzU3RhcnRlZCA9IHRydWU7XG4gICAgdGhpcy5fc3RhcnRUaW1lID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9zdGFydFRpbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEgPSB7fSkge1xuICAgIGlmICghdGhpcy5faXNTdGFydGVkKSB7IHJldHVybjsgfVxuICAgIC8vIMOgIHJldm9pclxuICAgIC8vIGlmIG5vIHRpbWUgcHJvdmlkZWQsIHVzZSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWVcbiAgICB2YXIgZnJhbWVUaW1lID0gIWlzTmFOKHBhcnNlRmxvYXQodGltZSkpICYmIGlzRmluaXRlKHRpbWUpID9cbiAgICAgIHRpbWUgOiB0aGlzLnBhcmFtcy5jdHguY3VycmVudFRpbWU7XG5cbiAgICAvLyBzZXQgYHN0YXJ0VGltZWAgaWYgZmlyc3QgY2FsbCBhZnRlciBhIGBzdGFydGBcbiAgICBpZiAoIXRoaXMuX3N0YXJ0VGltZSkgeyB0aGlzLl9zdGFydFRpbWUgPSBmcmFtZVRpbWU7IH1cblxuICAgIC8vIGhhbmRsZSB0aW1lIGFjY29yZGluZyB0byBjb25maWdcbiAgICBpZiAodGhpcy5wYXJhbXMudGltZVR5cGUgPT09ICdyZWxhdGl2ZScpIHtcbiAgICAgIGZyYW1lVGltZSA9IHRpbWUgLSB0aGlzLl9zdGFydFRpbWU7XG4gICAgfVxuXG4gICAgLy8gaWYgc2NhbGFyLCBjcmVhdGUgYSB2ZWN0b3JcbiAgICBpZiAoZnJhbWUubGVuZ3RoID09PSB1bmRlZmluZWQpIHsgZnJhbWUgPSBbZnJhbWVdOyB9XG4gICAgLy8gd29ya3MgaWYgZnJhbWUgaXMgYW4gYXJyYXlcbiAgICB0aGlzLm91dEZyYW1lLnNldChmcmFtZSwgMCk7XG4gICAgdGhpcy50aW1lID0gZnJhbWVUaW1lO1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEluO1xuIl19