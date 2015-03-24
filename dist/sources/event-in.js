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
      value: function process(time, frame) {
        var metaData = arguments[2] === undefined ? {} : arguments[2];

        if (!this.isStarted) {
          return;
        }

        var audioContext = this.params.audioContext;
        var frameTime;

        // à revoir
        // if no time provided, use audioContext.currentTime
        frameTime = !isNaN(parseFloat(time)) && isFinite(time) ? time : audioContext.currentTime;

        // set `startTime` if first call after a `start`
        if (!this.startTime) {
          this.startTime = time;
        }

        // handle time according to config
        if (this.params.timeType === "relative") {
          frameTime = time - this.startTime;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2V2ZW50LWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztlQUVjLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7SUFBbkMsR0FBRyxZQUFILEdBQUc7Ozs7Ozs7Ozs7Ozs7SUFhSCxPQUFPO0FBQ0EsV0FEUCxPQUFPLENBQ0MsT0FBTyxFQUFFOzBCQURqQixPQUFPOztBQUdULFFBQUksUUFBUSxHQUFHO0FBQ2IsY0FBUSxFQUFFLFVBQVU7QUFDcEIsZUFBUyxFQUFFLENBQUM7S0FDYixDQUFDOztBQUVGLHFDQVJFLE9BQU8sNkNBUUgsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7O0FBRS9CLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTtBQUM3QixVQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0tBQy9DOztBQUVELFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDOztBQUV2QixRQUFJLENBQUMsV0FBVyxDQUFDO0FBQ2YsZUFBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUztBQUNoQyxlQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTO0FBQ2hDLHFCQUFlLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTO0tBQy9ELENBQUMsQ0FBQztHQUNKOztZQXRCRyxPQUFPOztlQUFQLE9BQU87QUF3QlgsU0FBSzthQUFBLGlCQUFHOztBQUVOLFlBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFlBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO09BQ3ZCOztBQUVELFFBQUk7YUFBQSxnQkFBRztBQUNMLFlBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNoQixZQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMzQixZQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztPQUN4Qjs7QUFFRCxXQUFPO2FBQUEsaUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBaUI7WUFBZixRQUFRLGdDQUFHLEVBQUU7O0FBQ2hDLFlBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQUUsaUJBQU87U0FBRTs7QUFFaEMsWUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7QUFDNUMsWUFBSSxTQUFTLENBQUM7Ozs7QUFJZCxpQkFBUyxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FDcEQsSUFBSSxHQUFHLFlBQVksQ0FBQyxXQUFXLENBQUM7OztBQUdsQyxZQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGNBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1NBQUU7OztBQUcvQyxZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtBQUN2QyxtQkFBUyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQ25DOzs7QUFHRCxZQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO0FBQUUsZUFBSyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FBRTs7QUFFcEQsWUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVCLFlBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3RCLFlBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUV6QixZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZjs7OztTQS9ERyxPQUFPO0dBQVMsR0FBRzs7QUFrRXpCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL2V2ZW50LWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgeyBMZm8gfSA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcblxuLypcbiAgY2FuIGZvcndhcmRcbiAgICAtIHJlbGF0aXZlVGltZSAoYWNjb3JkaW5nIHRvIGl0J3Mgc3RhcnQoKSBtZXRob2QpXG4gICAgLSBhYnNvbHV0ZVRpbWUgKGF1ZGlvQ29udGV4IHRpbWUpXG4gICAgLSBpbnB1dCB0aW1lXG5cbiAgbWV0aG9kc1xuICAgIC0gYHN0YXJ0KClgIC0+IGNhbGwgYHJlc2V0KClgXG4gICAgLSBgc3RvcCgpYCAgLT4gY2FsbCBgZmluYWxpemUoKWBcbiovXG5cbmNsYXNzIEV2ZW50SW4gZXh0ZW5kcyBMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG5cbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICB0aW1lVHlwZTogJ2Fic29sdXRlJyxcbiAgICAgIGZyYW1lU2l6ZTogMVxuICAgIH07XG4gICAgLy8gY2Fubm90IGhhdmUgcHJldmlvdXNcbiAgICBzdXBlcihudWxsLCBvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLmF1ZGlvQ29udGV4dCkge1xuICAgICAgdGhpcy5wYXJhbXMuYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICAgIH1cblxuICAgIHRoaXMuc3RhcnRUaW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuaXNTdGFydGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLnNldHVwU3RyZWFtKHtcbiAgICAgIGZyYW1lU2l6ZTogdGhpcy5wYXJhbXMuZnJhbWVTaXplLFxuICAgICAgZnJhbWVSYXRlOiB0aGlzLnBhcmFtcy5mcmFtZVJhdGUsXG4gICAgICBibG9ja1NhbXBsZVJhdGU6IHRoaXMucGFyYW1zLmZyYW1lUmF0ZSAqIHRoaXMucGFyYW1zLmZyYW1lU2l6ZVxuICAgIH0pO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgLy8gc2hvdWxkIGJlIHNldHRlZCBpbiB0aGUgZmlyc3QgcHJvY2VzcyBjYWxsXG4gICAgdGhpcy5zdGFydFRpbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5pc1N0YXJ0ZWQgPSB0cnVlO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG4gICAgdGhpcy5zdGFydFRpbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhID0ge30pIHtcbiAgICBpZiAoIXRoaXMuaXNTdGFydGVkKSB7IHJldHVybjsgfVxuXG4gICAgdmFyIGF1ZGlvQ29udGV4dCA9IHRoaXMucGFyYW1zLmF1ZGlvQ29udGV4dDtcbiAgICB2YXIgZnJhbWVUaW1lO1xuXG4gICAgLy8gw6AgcmV2b2lyXG4gICAgLy8gaWYgbm8gdGltZSBwcm92aWRlZCwgdXNlIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZVxuICAgIGZyYW1lVGltZSA9ICFpc05hTihwYXJzZUZsb2F0KHRpbWUpKSAmJiBpc0Zpbml0ZSh0aW1lKSA/XG4gICAgICB0aW1lIDogYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuXG4gICAgLy8gc2V0IGBzdGFydFRpbWVgIGlmIGZpcnN0IGNhbGwgYWZ0ZXIgYSBgc3RhcnRgXG4gICAgaWYgKCF0aGlzLnN0YXJ0VGltZSkgeyB0aGlzLnN0YXJ0VGltZSA9IHRpbWU7IH1cblxuICAgIC8vIGhhbmRsZSB0aW1lIGFjY29yZGluZyB0byBjb25maWdcbiAgICBpZiAodGhpcy5wYXJhbXMudGltZVR5cGUgPT09ICdyZWxhdGl2ZScpIHtcbiAgICAgIGZyYW1lVGltZSA9IHRpbWUgLSB0aGlzLnN0YXJ0VGltZTtcbiAgICB9XG5cbiAgICAvLyBpZiBzY2FsYXIsIGNyZWF0ZSBhIHZlY3RvclxuICAgIGlmIChmcmFtZS5sZW5ndGggPT09IHVuZGVmaW5lZCkgeyBmcmFtZSA9IFtmcmFtZV07IH1cbiAgICAvLyB3b3JrcyBpZiBmcmFtZSBpcyBhbiBhcnJheVxuICAgIHRoaXMub3V0RnJhbWUuc2V0KGZyYW1lLCAwKTtcbiAgICB0aGlzLnRpbWUgPSBmcmFtZVRpbWU7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50SW47XG4iXX0=