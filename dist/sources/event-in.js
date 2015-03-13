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

    this.setupStream({ frameSize: this.params.frameSize });
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
      value: function process(time, frame, metadata) {
        if (!this.isStarted) {
          return;
        }

        var audioContext = this.params.audioContext;
        var frameTime;

        // à revoir
        // if no time provided, use audioContext.currentTime
        time = !isNaN(parseFloat(time)) && isFinite(time) ? time : audioContext.currentTime;

        // set `startTime` if first call of the method
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
        this.output();
      }
    }
  });

  return EventIn;
})(Lfo);

module.exports = EventIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2V2ZW50LWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztlQUVjLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7SUFBbkMsR0FBRyxZQUFILEdBQUc7Ozs7Ozs7Ozs7Ozs7SUFhSCxPQUFPO0FBQ0EsV0FEUCxPQUFPLENBQ0MsT0FBTyxFQUFFOzBCQURqQixPQUFPOztBQUdULFFBQUksUUFBUSxHQUFHO0FBQ2IsY0FBUSxFQUFFLFVBQVU7QUFDcEIsZUFBUyxFQUFFLENBQUM7S0FDYixDQUFDOztBQUVGLHFDQVJFLE9BQU8sNkNBUUgsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7O0FBRS9CLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTtBQUM3QixVQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0tBQy9DOztBQUVELFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDOztBQUV2QixRQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztHQUN4RDs7WUFsQkcsT0FBTzs7ZUFBUCxPQUFPO0FBb0JYLFNBQUs7YUFBQSxpQkFBRzs7QUFFTixZQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMzQixZQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztPQUN2Qjs7QUFFRCxRQUFJO2FBQUEsZ0JBQUc7QUFDTCxZQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDaEIsWUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDM0IsWUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7T0FDeEI7O0FBRUQsV0FBTzthQUFBLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFlBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQUUsaUJBQU87U0FBRTs7QUFFaEMsWUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7QUFDNUMsWUFBSSxTQUFTLENBQUM7Ozs7QUFJZCxZQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxHQUMvQyxJQUFJLEdBQUcsWUFBWSxDQUFDLFdBQVcsQ0FBQzs7O0FBR2xDLFlBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ25CLGNBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1NBQ3ZCOzs7QUFHRCxZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtBQUN2QyxtQkFBUyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQ25DLE1BQU07QUFDTCxtQkFBUyxHQUFHLElBQUksQ0FBQztTQUNsQjs7O0FBR0QsWUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtBQUFFLGVBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQUU7O0FBRXBELFlBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QixZQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztBQUN0QixZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZjs7OztTQTdERyxPQUFPO0dBQVMsR0FBRzs7QUFnRXpCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL2V2ZW50LWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgeyBMZm8gfSA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcblxuLypcbiAgY2FuIGZvcndhcmRcbiAgICAtIHJlbGF0aXZlVGltZSAoYWNjb3JkaW5nIHRvIGl0J3Mgc3RhcnQoKSBtZXRob2QpXG4gICAgLSBhYnNvbHV0ZVRpbWUgKGF1ZGlvQ29udGV4IHRpbWUpXG4gICAgLSBpbnB1dCB0aW1lXG5cbiAgbWV0aG9kc1xuICAgIC0gYHN0YXJ0KClgIC0+IGNhbGwgYHJlc2V0KClgXG4gICAgLSBgc3RvcCgpYCAgLT4gY2FsbCBgZmluYWxpemUoKWBcbiovXG5cbmNsYXNzIEV2ZW50SW4gZXh0ZW5kcyBMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG5cbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICB0aW1lVHlwZTogJ2Fic29sdXRlJyxcbiAgICAgIGZyYW1lU2l6ZTogMVxuICAgIH07XG4gICAgLy8gY2Fubm90IGhhdmUgcHJldmlvdXNcbiAgICBzdXBlcihudWxsLCBvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLmF1ZGlvQ29udGV4dCkge1xuICAgICAgdGhpcy5wYXJhbXMuYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICAgIH1cblxuICAgIHRoaXMuc3RhcnRUaW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuaXNTdGFydGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLnNldHVwU3RyZWFtKHsgZnJhbWVTaXplOiB0aGlzLnBhcmFtcy5mcmFtZVNpemUgfSk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICAvLyBzaG91bGQgYmUgc2V0dGVkIGluIHRoZSBmaXJzdCBwcm9jZXNzIGNhbGxcbiAgICB0aGlzLnN0YXJ0VGltZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmlzU3RhcnRlZCA9IHRydWU7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcbiAgICB0aGlzLnN0YXJ0VGltZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmlzU3RhcnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YWRhdGEpIHtcbiAgICBpZiAoIXRoaXMuaXNTdGFydGVkKSB7IHJldHVybjsgfVxuXG4gICAgdmFyIGF1ZGlvQ29udGV4dCA9IHRoaXMucGFyYW1zLmF1ZGlvQ29udGV4dDtcbiAgICB2YXIgZnJhbWVUaW1lO1xuXG4gICAgLy8gw6AgcmV2b2lyXG4gICAgLy8gaWYgbm8gdGltZSBwcm92aWRlZCwgdXNlIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZVxuICAgIHRpbWUgPSAhaXNOYU4ocGFyc2VGbG9hdCh0aW1lKSkgJiYgaXNGaW5pdGUodGltZSkgP1xuICAgICAgdGltZSA6IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblxuICAgIC8vIHNldCBgc3RhcnRUaW1lYCBpZiBmaXJzdCBjYWxsIG9mIHRoZSBtZXRob2RcbiAgICBpZiAoIXRoaXMuc3RhcnRUaW1lKSB7XG4gICAgICB0aGlzLnN0YXJ0VGltZSA9IHRpbWU7XG4gICAgfVxuXG4gICAgLy8gaGFuZGxlIHRpbWUgYWNjb3JkaW5nIHRvIGNvbmZpZ1xuICAgIGlmICh0aGlzLnBhcmFtcy50aW1lVHlwZSA9PT0gJ3JlbGF0aXZlJykge1xuICAgICAgZnJhbWVUaW1lID0gdGltZSAtIHRoaXMuc3RhcnRUaW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcmFtZVRpbWUgPSB0aW1lO1xuICAgIH1cblxuICAgIC8vIGlmIHNjYWxhciwgY3JlYXRlIGEgdmVjdG9yXG4gICAgaWYgKGZyYW1lLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7IGZyYW1lID0gW2ZyYW1lXTsgfVxuICAgIC8vIHdvcmtzIGlmIGZyYW1lIGlzIGFuIGFycmF5XG4gICAgdGhpcy5vdXRGcmFtZS5zZXQoZnJhbWUsIDApO1xuICAgIHRoaXMudGltZSA9IGZyYW1lVGltZTtcbiAgICB0aGlzLm91dHB1dCgpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRJbjtcbiJdfQ==