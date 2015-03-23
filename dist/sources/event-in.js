"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("../core/lfo-base");

var Lfo = _require.Lfo;

/*
  can forward
    - relativeTime (according to it's start() method)
    - absoluteTime (audioContex time)
    - input time

  methods
    - `start()` -> call `reset()`
    - `stop()`  -> call `finalize()`
*/

var EventIn = (function (_Lfo) {
  function EventIn(options) {
    _classCallCheck(this, EventIn);

    var defaults = {
      timeType: "absolute",
      frameSize: 1
    };
    // cannot have previous
    _get(_core.Object.getPrototypeOf(EventIn.prototype), "constructor", this).call(this, null, options, defaults);

    if (!this.params.audioContext) {
      this.params.audioContext = new AudioContext();
    }

    this.startTime = undefined;
    this.isStarted = false;

    this.setupStream({
      frameSize: this.params.frameSize,
      frameRate: this.params.frameRate,
      blockSampleRate: this.params.frameRate * this.params.frameSize
    });
  }

  _inherits(EventIn, _Lfo);

  _createClass(EventIn, {
    start: {
      value: function start() {
        // should be setted in the first process call
        this.startTime = undefined;
        this.isStarted = true;
      }
    },
    stop: {
      value: function stop() {
        this.finalize();
        this.startTime = undefined;
        this.isStarted = false;
      }
    },
    process: {
      value: function process(time, frame, metaData) {
        if (!this.isStarted) {
          return;
        }

        var audioContext = this.params.audioContext;
        var frameTime;

        // à revoir
        // if no time provided, use audioContext.currentTime
        time = !isNaN(parseFloat(time)) && isFinite(time) ? time : audioContext.currentTime;

        // set `startTime` if first call after a `start`
        if (!this.startTime) {
          this.startTime = time;
        }

        // handle time according to config
        if (this.params.timeType === "relative") {
          frameTime = time - this.startTime;
        } else {
          frameTime = time;
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
    }
  });

  return EventIn;
})(Lfo);

module.exports = EventIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2V2ZW50LWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztlQUVjLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7SUFBbkMsR0FBRyxZQUFILEdBQUc7Ozs7Ozs7Ozs7Ozs7SUFhSCxPQUFPO0FBQ0EsV0FEUCxPQUFPLENBQ0MsT0FBTyxFQUFFOzBCQURqQixPQUFPOztBQUdULFFBQUksUUFBUSxHQUFHO0FBQ2IsY0FBUSxFQUFFLFVBQVU7QUFDcEIsZUFBUyxFQUFFLENBQUM7S0FDYixDQUFDOztBQUVGLHFDQVJFLE9BQU8sNkNBUUgsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7O0FBRS9CLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTtBQUM3QixVQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0tBQy9DOztBQUVELFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDOztBQUV2QixRQUFJLENBQUMsV0FBVyxDQUFDO0FBQ2YsZUFBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUztBQUNoQyxlQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTO0FBQ2hDLHFCQUFlLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTO0tBQy9ELENBQUMsQ0FBQztHQUNKOztZQXRCRyxPQUFPOztlQUFQLE9BQU87QUF3QlgsU0FBSzthQUFBLGlCQUFHOztBQUVOLFlBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFlBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO09BQ3ZCOztBQUVELFFBQUk7YUFBQSxnQkFBRztBQUNMLFlBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNoQixZQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMzQixZQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztPQUN4Qjs7QUFFRCxXQUFPO2FBQUEsaUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxpQkFBTztTQUFFOztBQUVoQyxZQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztBQUM1QyxZQUFJLFNBQVMsQ0FBQzs7OztBQUlkLFlBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQy9DLElBQUksR0FBRyxZQUFZLENBQUMsV0FBVyxDQUFDOzs7QUFHbEMsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxjQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztTQUFFOzs7QUFHL0MsWUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsS0FBSyxVQUFVLEVBQUU7QUFDdkMsbUJBQVMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUNuQyxNQUFNO0FBQ0wsbUJBQVMsR0FBRyxJQUFJLENBQUM7U0FDbEI7OztBQUdELFlBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7QUFBRSxlQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUFFOztBQUVwRCxZQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUIsWUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7QUFDdEIsWUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7O0FBRXpCLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNmOzs7O1NBakVHLE9BQU87R0FBUyxHQUFHOztBQW9FekIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiZXM2L3NvdXJjZXMvZXZlbnQtaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciB7IExmbyB9ID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xuXG4vKlxuICBjYW4gZm9yd2FyZFxuICAgIC0gcmVsYXRpdmVUaW1lIChhY2NvcmRpbmcgdG8gaXQncyBzdGFydCgpIG1ldGhvZClcbiAgICAtIGFic29sdXRlVGltZSAoYXVkaW9Db250ZXggdGltZSlcbiAgICAtIGlucHV0IHRpbWVcblxuICBtZXRob2RzXG4gICAgLSBgc3RhcnQoKWAgLT4gY2FsbCBgcmVzZXQoKWBcbiAgICAtIGBzdG9wKClgICAtPiBjYWxsIGBmaW5hbGl6ZSgpYFxuKi9cblxuY2xhc3MgRXZlbnRJbiBleHRlbmRzIExmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIHRpbWVUeXBlOiAnYWJzb2x1dGUnLFxuICAgICAgZnJhbWVTaXplOiAxXG4gICAgfTtcbiAgICAvLyBjYW5ub3QgaGF2ZSBwcmV2aW91c1xuICAgIHN1cGVyKG51bGwsIG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIGlmICghdGhpcy5wYXJhbXMuYXVkaW9Db250ZXh0KSB7XG4gICAgICB0aGlzLnBhcmFtcy5hdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5zdGFydFRpbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5pc1N0YXJ0ZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuc2V0dXBTdHJlYW0oe1xuICAgICAgZnJhbWVTaXplOiB0aGlzLnBhcmFtcy5mcmFtZVNpemUsXG4gICAgICBmcmFtZVJhdGU6IHRoaXMucGFyYW1zLmZyYW1lUmF0ZSxcbiAgICAgIGJsb2NrU2FtcGxlUmF0ZTogdGhpcy5wYXJhbXMuZnJhbWVSYXRlICogdGhpcy5wYXJhbXMuZnJhbWVTaXplXG4gICAgfSk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICAvLyBzaG91bGQgYmUgc2V0dGVkIGluIHRoZSBmaXJzdCBwcm9jZXNzIGNhbGxcbiAgICB0aGlzLnN0YXJ0VGltZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmlzU3RhcnRlZCA9IHRydWU7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcbiAgICB0aGlzLnN0YXJ0VGltZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmlzU3RhcnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICBpZiAoIXRoaXMuaXNTdGFydGVkKSB7IHJldHVybjsgfVxuXG4gICAgdmFyIGF1ZGlvQ29udGV4dCA9IHRoaXMucGFyYW1zLmF1ZGlvQ29udGV4dDtcbiAgICB2YXIgZnJhbWVUaW1lO1xuXG4gICAgLy8gw6AgcmV2b2lyXG4gICAgLy8gaWYgbm8gdGltZSBwcm92aWRlZCwgdXNlIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZVxuICAgIHRpbWUgPSAhaXNOYU4ocGFyc2VGbG9hdCh0aW1lKSkgJiYgaXNGaW5pdGUodGltZSkgP1xuICAgICAgdGltZSA6IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblxuICAgIC8vIHNldCBgc3RhcnRUaW1lYCBpZiBmaXJzdCBjYWxsIGFmdGVyIGEgYHN0YXJ0YFxuICAgIGlmICghdGhpcy5zdGFydFRpbWUpIHsgdGhpcy5zdGFydFRpbWUgPSB0aW1lOyB9XG5cbiAgICAvLyBoYW5kbGUgdGltZSBhY2NvcmRpbmcgdG8gY29uZmlnXG4gICAgaWYgKHRoaXMucGFyYW1zLnRpbWVUeXBlID09PSAncmVsYXRpdmUnKSB7XG4gICAgICBmcmFtZVRpbWUgPSB0aW1lIC0gdGhpcy5zdGFydFRpbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZyYW1lVGltZSA9IHRpbWU7XG4gICAgfVxuXG4gICAgLy8gaWYgc2NhbGFyLCBjcmVhdGUgYSB2ZWN0b3JcbiAgICBpZiAoZnJhbWUubGVuZ3RoID09PSB1bmRlZmluZWQpIHsgZnJhbWUgPSBbZnJhbWVdOyB9XG4gICAgLy8gd29ya3MgaWYgZnJhbWUgaXMgYW4gYXJyYXlcbiAgICB0aGlzLm91dEZyYW1lLnNldChmcmFtZSwgMCk7XG4gICAgdGhpcy50aW1lID0gZnJhbWVUaW1lO1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEluO1xuIl19