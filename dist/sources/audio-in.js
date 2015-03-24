"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");
var audioContext; // for lazy audioContext creation

var AudioIn = (function (_Lfo) {
  function AudioIn() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, AudioIn);

    this.type = "audio-in";

    // defaults
    var defaults = {
      frameSize: 512,
      // blockSize: 2048,
      // hopSize: 512,
      channel: 0
    };

    _get(_core.Object.getPrototypeOf(AudioIn.prototype), "constructor", this).call(this, null, options, defaults);

    // private
    if (!this.params.ctx) {
      audioContext = new AudioContext();
      this.ctx = audioContext;
    } else {
      this.ctx = this.params.ctx;
    }

    this.src = this.params.src;
    this.time = 0;
    this.metaData = {};
    // this.frameOffset = 0;

    this.setupStream({
      frameRate: this.ctx.sampleRate / this.params.frameSize,
      frameSize: this.params.frameSize,
      blockSampleRate: this.ctx.sampleRate
    });
  }

  _inherits(AudioIn, _Lfo);

  _createClass(AudioIn, {
    start: {
      value: function start() {}
    }
  });

  return AudioIn;
})(Lfo);

module.exports = AudioIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUdBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3RDLElBQUksWUFBWSxDQUFDOztJQUVYLE9BQU87QUFFQSxXQUZQLE9BQU8sR0FFZTtRQUFkLE9BQU8sZ0NBQUcsRUFBRTs7MEJBRnBCLE9BQU87O0FBR1QsUUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7OztBQUd2QixRQUFJLFFBQVEsR0FBRztBQUNiLGVBQVMsRUFBRSxHQUFHOzs7QUFHZCxhQUFPLEVBQUUsQ0FBQztLQUNYLENBQUM7O0FBRUYscUNBYkUsT0FBTyw2Q0FhSCxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTs7O0FBRy9CLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtBQUNwQixrQkFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7QUFDbEMsVUFBSSxDQUFDLEdBQUcsR0FBRyxZQUFZLENBQUM7S0FDekIsTUFBTTtBQUNMLFVBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7S0FDNUI7O0FBRUQsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUMzQixRQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNkLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDOzs7QUFHbkIsUUFBSSxDQUFDLFdBQVcsQ0FBQztBQUNmLGVBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7QUFDdEQsZUFBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUztBQUNoQyxxQkFBZSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVTtLQUNyQyxDQUFDLENBQUM7R0FDSjs7WUFqQ0csT0FBTzs7ZUFBUCxPQUFPO0FBbUNYLFNBQUs7YUFBQSxpQkFBRyxFQUFFOzs7O1NBbkNOLE9BQU87R0FBUyxHQUFHOztBQXNDekIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiZXM2L3NvdXJjZXMvYXVkaW8taW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcblwidXNlIHN0cmljdFwiO1xuXG52YXIgTGZvID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xudmFyIGF1ZGlvQ29udGV4dDsgLy8gZm9yIGxhenkgYXVkaW9Db250ZXh0IGNyZWF0aW9uXG5cbmNsYXNzIEF1ZGlvSW4gZXh0ZW5kcyBMZm8ge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMudHlwZSA9ICdhdWRpby1pbic7XG5cbiAgICAvLyBkZWZhdWx0c1xuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIGZyYW1lU2l6ZTogNTEyLFxuICAgICAgLy8gYmxvY2tTaXplOiAyMDQ4LFxuICAgICAgLy8gaG9wU2l6ZTogNTEyLFxuICAgICAgY2hhbm5lbDogMFxuICAgIH07XG5cbiAgICBzdXBlcihudWxsLCBvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICAvLyBwcml2YXRlXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5jdHgpIHtcbiAgICAgIGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAgICAgIHRoaXMuY3R4ID0gYXVkaW9Db250ZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN0eCA9IHRoaXMucGFyYW1zLmN0eDtcbiAgICB9XG5cbiAgICB0aGlzLnNyYyA9IHRoaXMucGFyYW1zLnNyYztcbiAgICB0aGlzLnRpbWUgPSAwO1xuICAgIHRoaXMubWV0YURhdGEgPSB7fTtcbiAgICAvLyB0aGlzLmZyYW1lT2Zmc2V0ID0gMDtcblxuICAgIHRoaXMuc2V0dXBTdHJlYW0oe1xuICAgICAgZnJhbWVSYXRlOiB0aGlzLmN0eC5zYW1wbGVSYXRlIC8gdGhpcy5wYXJhbXMuZnJhbWVTaXplLFxuICAgICAgZnJhbWVTaXplOiB0aGlzLnBhcmFtcy5mcmFtZVNpemUsXG4gICAgICBibG9ja1NhbXBsZVJhdGU6IHRoaXMuY3R4LnNhbXBsZVJhdGVcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXJ0KCkge31cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBdWRpb0luOyJdfQ==