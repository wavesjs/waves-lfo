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
//# sourceMappingURL=data:application/json;base64,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LCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBMZm8gPSByZXF1aXJlKCcuLi9jb3JlL2xmby1iYXNlJyk7XG5cbi8qXG4gIGNhbiBmb3J3YXJkXG4gICAgLSByZWxhdGl2ZVRpbWUgKGFjY29yZGluZyB0byBpdCdzIHN0YXJ0KCkgbWV0aG9kKVxuICAgIC0gYWJzb2x1dGVUaW1lIChhdWRpb0NvbnRleCB0aW1lKVxuICAgIC0gaW5wdXQgdGltZVxuXG4gIG1ldGhvZHNcbiAgICAtIGBzdGFydCgpYCAtPiBjYWxsIGByZXNldCgpYFxuICAgIC0gYHN0b3AoKWAgIC0+IGNhbGwgYGZpbmFsaXplKClgXG4qL1xuXG5jbGFzcyBFdmVudEluIGV4dGVuZHMgTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuXG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgdGltZVR5cGU6ICdhYnNvbHV0ZScsXG4gICAgICBmcmFtZVNpemU6IDFcbiAgICB9O1xuICAgIC8vIGNhbm5vdCBoYXZlIHByZXZpb3VzXG4gICAgc3VwZXIobnVsbCwgb3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5hdWRpb0NvbnRleHQpIHtcbiAgICAgIHRoaXMucGFyYW1zLmF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXJ0VGltZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmlzU3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5zZXR1cFN0cmVhbSh7XG4gICAgICBmcmFtZVNpemU6IHRoaXMucGFyYW1zLmZyYW1lU2l6ZSxcbiAgICAgIGZyYW1lUmF0ZTogdGhpcy5wYXJhbXMuZnJhbWVSYXRlLFxuICAgICAgYmxvY2tTYW1wbGVSYXRlOiB0aGlzLnBhcmFtcy5mcmFtZVJhdGUgKiB0aGlzLnBhcmFtcy5mcmFtZVNpemVcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIC8vIHNob3VsZCBiZSBzZXR0ZWQgaW4gdGhlIGZpcnN0IHByb2Nlc3MgY2FsbFxuICAgIHRoaXMuc3RhcnRUaW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuaXNTdGFydGVkID0gdHJ1ZTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuICAgIHRoaXMuc3RhcnRUaW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuaXNTdGFydGVkID0gZmFsc2U7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSA9IHt9KSB7XG4gICAgaWYgKCF0aGlzLmlzU3RhcnRlZCkgeyByZXR1cm47IH1cblxuICAgIHZhciBhdWRpb0NvbnRleHQgPSB0aGlzLnBhcmFtcy5hdWRpb0NvbnRleHQ7XG4gICAgdmFyIGZyYW1lVGltZTtcblxuICAgIC8vIMOgIHJldm9pclxuICAgIC8vIGlmIG5vIHRpbWUgcHJvdmlkZWQsIHVzZSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWVcbiAgICBmcmFtZVRpbWUgPSAhaXNOYU4ocGFyc2VGbG9hdCh0aW1lKSkgJiYgaXNGaW5pdGUodGltZSkgP1xuICAgICAgdGltZSA6IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblxuICAgIC8vIHNldCBgc3RhcnRUaW1lYCBpZiBmaXJzdCBjYWxsIGFmdGVyIGEgYHN0YXJ0YFxuICAgIGlmICghdGhpcy5zdGFydFRpbWUpIHsgdGhpcy5zdGFydFRpbWUgPSB0aW1lOyB9XG5cbiAgICAvLyBoYW5kbGUgdGltZSBhY2NvcmRpbmcgdG8gY29uZmlnXG4gICAgaWYgKHRoaXMucGFyYW1zLnRpbWVUeXBlID09PSAncmVsYXRpdmUnKSB7XG4gICAgICBmcmFtZVRpbWUgPSB0aW1lIC0gdGhpcy5zdGFydFRpbWU7XG4gICAgfVxuXG4gICAgLy8gaWYgc2NhbGFyLCBjcmVhdGUgYSB2ZWN0b3JcbiAgICBpZiAoZnJhbWUubGVuZ3RoID09PSB1bmRlZmluZWQpIHsgZnJhbWUgPSBbZnJhbWVdOyB9XG4gICAgLy8gd29ya3MgaWYgZnJhbWUgaXMgYW4gYXJyYXlcbiAgICB0aGlzLm91dEZyYW1lLnNldChmcmFtZSwgMCk7XG4gICAgdGhpcy50aW1lID0gZnJhbWVUaW1lO1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEluO1xuIl19