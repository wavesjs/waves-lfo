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
      timeType: "absolute"
    };
    // cannot have previous
    _get(_core.Object.getPrototypeOf(EventIn.prototype), "constructor", this).call(this, options, defaults);

    // test AudioContext for use in node environment
    if (!this.params.audioContext && typeof process === "undefined") {
      this.params.audioContext = new AudioContext();
    }

    this.startTime = undefined;
    this.isStarted = false;

    // this.setupStream({
    //   frameSize: this.params.frameSize,
    //   frameRate: this.params.frameRate,
    //   // @NOTE does it make sens ?
    //   blockSampleRate: this.params.frameRate * this.params.frameSize
    // });
  }

  _inherits(EventIn, _Lfo);

  _createClass(EventIn, {
    configureStream: {
      value: function configureStream() {
        // test if some values are not defined ?
        this.streamParams.frameSize = this.params.frameSize;
        this.streamParams.frameRate = this.params.frameRate;
        this.streamParams.blockSampleRate = this.params.frameSize * this.params.frameRate;
      }
    },
    start: {
      value: function start() {
        // should be setted in the first process call
        this.startTime = undefined;
        this.isStarted = true;

        this.initialize();
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

        // à revoir
        // if no time provided, use audioContext.currentTime
        var frameTime = !isNaN(parseFloat(time)) && isFinite(time) ? time : this.params.audioContext.currentTime;

        // set `startTime` if first call after a `start`
        if (!this.startTime) {
          this.startTime = frameTime;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2V2ZW50LWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUVBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7O0lBYWhDLE9BQU87QUFDQSxXQURQLE9BQU8sQ0FDQyxPQUFPLEVBQUU7MEJBRGpCLE9BQU87O0FBR1QsUUFBSSxRQUFRLEdBQUc7QUFDYixjQUFRLEVBQUUsVUFBVTtLQUNyQixDQUFDOztBQUVGLHFDQVBFLE9BQU8sNkNBT0gsT0FBTyxFQUFFLFFBQVEsRUFBRTs7O0FBR3pCLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksSUFBSyxPQUFPLE9BQU8sS0FBSyxXQUFXLEFBQUMsRUFBRTtBQUNqRSxVQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0tBQy9DOztBQUVELFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDOzs7Ozs7OztHQVF4Qjs7WUF2QkcsT0FBTzs7ZUFBUCxPQUFPO0FBeUJYLG1CQUFlO2FBQUEsMkJBQUc7O0FBRWhCLFlBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3BELFlBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3BELFlBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO09BQ25GOztBQUVELFNBQUs7YUFBQSxpQkFBRzs7QUFFTixZQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMzQixZQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzs7QUFFdEIsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLFlBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztPQUNkOztBQUVELFFBQUk7YUFBQSxnQkFBRztBQUNMLFlBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFlBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLFlBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztPQUNqQjs7QUFFRCxXQUFPO2FBQUEsaUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBaUI7WUFBZixRQUFRLGdDQUFHLEVBQUU7O0FBQ2hDLFlBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQUUsaUJBQU87U0FBRTs7OztBQUloQyxZQUFJLFNBQVMsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQ3hELElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUM7OztBQUc5QyxZQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGNBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1NBQUU7OztBQUdwRCxZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtBQUN2QyxtQkFBUyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQ25DOzs7QUFHRCxZQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO0FBQUUsZUFBSyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FBRTs7QUFFcEQsWUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVCLFlBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3RCLFlBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUV6QixZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZjs7OztTQXZFRyxPQUFPO0dBQVMsR0FBRzs7QUEwRXpCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL2V2ZW50LWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgTGZvID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xuXG4vKlxuICBjYW4gZm9yd2FyZFxuICAgIC0gcmVsYXRpdmVUaW1lIChhY2NvcmRpbmcgdG8gaXQncyBzdGFydCgpIG1ldGhvZClcbiAgICAtIGFic29sdXRlVGltZSAoYXVkaW9Db250ZXggdGltZSlcbiAgICAtIGlucHV0IHRpbWVcblxuICBtZXRob2RzXG4gICAgLSBgc3RhcnQoKWAgLT4gY2FsbCBgcmVzZXQoKWBcbiAgICAtIGBzdG9wKClgICAtPiBjYWxsIGBmaW5hbGl6ZSgpYFxuKi9cblxuY2xhc3MgRXZlbnRJbiBleHRlbmRzIExmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIHRpbWVUeXBlOiAnYWJzb2x1dGUnXG4gICAgfTtcbiAgICAvLyBjYW5ub3QgaGF2ZSBwcmV2aW91c1xuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIC8vIHRlc3QgQXVkaW9Db250ZXh0IGZvciB1c2UgaW4gbm9kZSBlbnZpcm9ubWVudFxuICAgIGlmICghdGhpcy5wYXJhbXMuYXVkaW9Db250ZXh0ICYmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICB0aGlzLnBhcmFtcy5hdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5zdGFydFRpbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5pc1N0YXJ0ZWQgPSBmYWxzZTtcblxuICAgIC8vIHRoaXMuc2V0dXBTdHJlYW0oe1xuICAgIC8vICAgZnJhbWVTaXplOiB0aGlzLnBhcmFtcy5mcmFtZVNpemUsXG4gICAgLy8gICBmcmFtZVJhdGU6IHRoaXMucGFyYW1zLmZyYW1lUmF0ZSxcbiAgICAvLyAgIC8vIEBOT1RFIGRvZXMgaXQgbWFrZSBzZW5zID9cbiAgICAvLyAgIGJsb2NrU2FtcGxlUmF0ZTogdGhpcy5wYXJhbXMuZnJhbWVSYXRlICogdGhpcy5wYXJhbXMuZnJhbWVTaXplXG4gICAgLy8gfSk7XG4gIH1cblxuICBjb25maWd1cmVTdHJlYW0oKSB7XG4gICAgLy8gdGVzdCBpZiBzb21lIHZhbHVlcyBhcmUgbm90IGRlZmluZWQgP1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSB0aGlzLnBhcmFtcy5mcmFtZVJhdGU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuYmxvY2tTYW1wbGVSYXRlID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplICogdGhpcy5wYXJhbXMuZnJhbWVSYXRlO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgLy8gc2hvdWxkIGJlIHNldHRlZCBpbiB0aGUgZmlyc3QgcHJvY2VzcyBjYWxsXG4gICAgdGhpcy5zdGFydFRpbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5pc1N0YXJ0ZWQgPSB0cnVlO1xuXG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLnN0YXJ0VGltZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmlzU3RhcnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmluYWxpemUoKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhID0ge30pIHtcbiAgICBpZiAoIXRoaXMuaXNTdGFydGVkKSB7IHJldHVybjsgfVxuXG4gICAgLy8gw6AgcmV2b2lyXG4gICAgLy8gaWYgbm8gdGltZSBwcm92aWRlZCwgdXNlIGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZVxuICAgIHZhciBmcmFtZVRpbWUgPSAhaXNOYU4ocGFyc2VGbG9hdCh0aW1lKSkgJiYgaXNGaW5pdGUodGltZSkgP1xuICAgICAgdGltZSA6IHRoaXMucGFyYW1zLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblxuICAgIC8vIHNldCBgc3RhcnRUaW1lYCBpZiBmaXJzdCBjYWxsIGFmdGVyIGEgYHN0YXJ0YFxuICAgIGlmICghdGhpcy5zdGFydFRpbWUpIHsgdGhpcy5zdGFydFRpbWUgPSBmcmFtZVRpbWU7IH1cblxuICAgIC8vIGhhbmRsZSB0aW1lIGFjY29yZGluZyB0byBjb25maWdcbiAgICBpZiAodGhpcy5wYXJhbXMudGltZVR5cGUgPT09ICdyZWxhdGl2ZScpIHtcbiAgICAgIGZyYW1lVGltZSA9IHRpbWUgLSB0aGlzLnN0YXJ0VGltZTtcbiAgICB9XG5cbiAgICAvLyBpZiBzY2FsYXIsIGNyZWF0ZSBhIHZlY3RvclxuICAgIGlmIChmcmFtZS5sZW5ndGggPT09IHVuZGVmaW5lZCkgeyBmcmFtZSA9IFtmcmFtZV07IH1cbiAgICAvLyB3b3JrcyBpZiBmcmFtZSBpcyBhbiBhcnJheVxuICAgIHRoaXMub3V0RnJhbWUuc2V0KGZyYW1lLCAwKTtcbiAgICB0aGlzLnRpbWUgPSBmcmFtZVRpbWU7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50SW47XG4iXX0=