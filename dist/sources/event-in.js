"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");

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
      // @NOTE does it make sens ?
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
        this.reset();
      }
    },
    stop: {
      value: function stop() {
        this.startTime = undefined;
        this.isStarted = false;
        this.finalize();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2V2ZW50LWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUVBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7O0lBYWhDLE9BQU87QUFDQSxXQURQLE9BQU8sQ0FDQyxPQUFPLEVBQUU7MEJBRGpCLE9BQU87O0FBR1QsUUFBSSxRQUFRLEdBQUc7QUFDYixjQUFRLEVBQUUsVUFBVTtBQUNwQixlQUFTLEVBQUUsQ0FBQztLQUNiLENBQUM7O0FBRUYscUNBUkUsT0FBTyw2Q0FRSCxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTs7QUFFL0IsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFO0FBQzdCLFVBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7S0FDL0M7O0FBRUQsUUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDM0IsUUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7O0FBRXZCLFFBQUksQ0FBQyxXQUFXLENBQUM7QUFDZixlQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTO0FBQ2hDLGVBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7O0FBRWhDLHFCQUFlLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTO0tBQy9ELENBQUMsQ0FBQztHQUNKOztZQXZCRyxPQUFPOztlQUFQLE9BQU87QUF5QlgsU0FBSzthQUFBLGlCQUFHOztBQUVOLFlBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFlBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLFlBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztPQUNkOztBQUVELFFBQUk7YUFBQSxnQkFBRztBQUNMLFlBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFlBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLFlBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztPQUNqQjs7QUFFRCxXQUFPO2FBQUEsaUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBaUI7WUFBZixRQUFRLGdDQUFHLEVBQUU7O0FBQ2hDLFlBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQUUsaUJBQU87U0FBRTs7QUFFaEMsWUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7QUFDNUMsWUFBSSxTQUFTLENBQUM7Ozs7QUFJZCxpQkFBUyxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FDcEQsSUFBSSxHQUFHLFlBQVksQ0FBQyxXQUFXLENBQUM7OztBQUdsQyxZQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGNBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1NBQUU7OztBQUcvQyxZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtBQUN2QyxtQkFBUyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQ25DOzs7QUFHRCxZQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO0FBQUUsZUFBSyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FBRTs7QUFFcEQsWUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVCLFlBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3RCLFlBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUV6QixZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZjs7OztTQWpFRyxPQUFPO0dBQVMsR0FBRzs7QUFvRXpCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL2V2ZW50LWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgTGZvID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xuXG4vKlxuICBjYW4gZm9yd2FyZFxuICAgIC0gcmVsYXRpdmVUaW1lIChhY2NvcmRpbmcgdG8gaXQncyBzdGFydCgpIG1ldGhvZClcbiAgICAtIGFic29sdXRlVGltZSAoYXVkaW9Db250ZXggdGltZSlcbiAgICAtIGlucHV0IHRpbWVcblxuICBtZXRob2RzXG4gICAgLSBgc3RhcnQoKWAgLT4gY2FsbCBgcmVzZXQoKWBcbiAgICAtIGBzdG9wKClgICAtPiBjYWxsIGBmaW5hbGl6ZSgpYFxuKi9cblxuY2xhc3MgRXZlbnRJbiBleHRlbmRzIExmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIHRpbWVUeXBlOiAnYWJzb2x1dGUnLFxuICAgICAgZnJhbWVTaXplOiAxXG4gICAgfTtcbiAgICAvLyBjYW5ub3QgaGF2ZSBwcmV2aW91c1xuICAgIHN1cGVyKG51bGwsIG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIGlmICghdGhpcy5wYXJhbXMuYXVkaW9Db250ZXh0KSB7XG4gICAgICB0aGlzLnBhcmFtcy5hdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5zdGFydFRpbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5pc1N0YXJ0ZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuc2V0dXBTdHJlYW0oe1xuICAgICAgZnJhbWVTaXplOiB0aGlzLnBhcmFtcy5mcmFtZVNpemUsXG4gICAgICBmcmFtZVJhdGU6IHRoaXMucGFyYW1zLmZyYW1lUmF0ZSxcbiAgICAgIC8vIEBOT1RFIGRvZXMgaXQgbWFrZSBzZW5zID9cbiAgICAgIGJsb2NrU2FtcGxlUmF0ZTogdGhpcy5wYXJhbXMuZnJhbWVSYXRlICogdGhpcy5wYXJhbXMuZnJhbWVTaXplXG4gICAgfSk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICAvLyBzaG91bGQgYmUgc2V0dGVkIGluIHRoZSBmaXJzdCBwcm9jZXNzIGNhbGxcbiAgICB0aGlzLnN0YXJ0VGltZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmlzU3RhcnRlZCA9IHRydWU7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLnN0YXJ0VGltZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmlzU3RhcnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmluYWxpemUoKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhID0ge30pIHtcbiAgICBpZiAoIXRoaXMuaXNTdGFydGVkKSB7IHJldHVybjsgfVxuXG4gICAgdmFyIGF1ZGlvQ29udGV4dCA9IHRoaXMucGFyYW1zLmF1ZGlvQ29udGV4dDtcbiAgICB2YXIgZnJhbWVUaW1lO1xuXG4gICAgLy8gw6AgcmV2b2lyXG4gICAgLy8gaWYgbm8gdGltZSBwcm92aWRlZCwgdXNlIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZVxuICAgIGZyYW1lVGltZSA9ICFpc05hTihwYXJzZUZsb2F0KHRpbWUpKSAmJiBpc0Zpbml0ZSh0aW1lKSA/XG4gICAgICB0aW1lIDogYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuXG4gICAgLy8gc2V0IGBzdGFydFRpbWVgIGlmIGZpcnN0IGNhbGwgYWZ0ZXIgYSBgc3RhcnRgXG4gICAgaWYgKCF0aGlzLnN0YXJ0VGltZSkgeyB0aGlzLnN0YXJ0VGltZSA9IHRpbWU7IH1cblxuICAgIC8vIGhhbmRsZSB0aW1lIGFjY29yZGluZyB0byBjb25maWdcbiAgICBpZiAodGhpcy5wYXJhbXMudGltZVR5cGUgPT09ICdyZWxhdGl2ZScpIHtcbiAgICAgIGZyYW1lVGltZSA9IHRpbWUgLSB0aGlzLnN0YXJ0VGltZTtcbiAgICB9XG5cbiAgICAvLyBpZiBzY2FsYXIsIGNyZWF0ZSBhIHZlY3RvclxuICAgIGlmIChmcmFtZS5sZW5ndGggPT09IHVuZGVmaW5lZCkgeyBmcmFtZSA9IFtmcmFtZV07IH1cbiAgICAvLyB3b3JrcyBpZiBmcmFtZSBpcyBhbiBhcnJheVxuICAgIHRoaXMub3V0RnJhbWUuc2V0KGZyYW1lLCAwKTtcbiAgICB0aGlzLnRpbWUgPSBmcmFtZVRpbWU7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50SW47XG4iXX0=