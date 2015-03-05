"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../../core/lfo-base");
var audioContext = require("audio-context");

var AudioIn = (function (Lfo) {
  function AudioIn() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _babelHelpers.classCallCheck(this, AudioIn);

    if (!(this instanceof AudioIn)) {
      return new AudioIn(options);
    }this.type = "audio-in";

    // defaults
    var defaults = {
      frameSize: 512,
      blockSize: 2048,
      hopSize: 512,
      channel: 0
    };

    _babelHelpers.get(_core.Object.getPrototypeOf(AudioIn.prototype), "constructor", this).call(this, null, options, defaults);

    // pubs
    this.frameSize = this.params.frameSize;
    this.blockSize = this.params.blockSize;
    this.hopSize = this.params.hopSize;
    this.channel = this.params.channel;
    this.frameOffset = 0;
    this.sampleRate = audioContext.sampleRate;

    // privs
    this._ctx = audioContext;
    this._currentTime = 0;
    this._src = this.params.src;

    this.setupStream({
      frameRate: this.sampleRate / this.hopSize,
      frameSize: this.frameSize,
      audioSampleRate: this._ctx.sampleRate
    });
  }

  _babelHelpers.inherits(AudioIn, Lfo);

  _babelHelpers.prototypeProperties(AudioIn, null, {
    start: {
      value: function start() {},
      writable: true,
      configurable: true
    }
  });

  return AudioIn;
})(Lfo);

module.exports = AudioIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9vcGVyYXRvcnMvc3JjLWF1ZGlvL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ3pDLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzs7SUFFdEMsT0FBTyxjQUFTLEdBQUc7QUFFWixXQUZQLE9BQU87UUFFQyxPQUFPLGdDQUFHLEVBQUU7O3VDQUZwQixPQUFPOztBQUdULFFBQUksRUFBRSxJQUFJLFlBQVksT0FBTyxDQUFBLEFBQUM7QUFBRSxhQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQUEsQUFFNUQsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7OztBQUd2QixRQUFJLFFBQVEsR0FBRztBQUNiLGVBQVMsRUFBRSxHQUFHO0FBQ2QsZUFBUyxFQUFFLElBQUk7QUFDZixhQUFPLEVBQUUsR0FBRztBQUNaLGFBQU8sRUFBRSxDQUFDO0tBQ1gsQ0FBQzs7QUFFRixrREFmRSxPQUFPLDZDQWVILElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFOzs7QUFHL0IsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUN2QyxRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3ZDLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDbkMsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUNuQyxRQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztBQUNyQixRQUFJLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUM7OztBQUcxQyxRQUFJLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQztBQUN6QixRQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztBQUN0QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDOztBQUU1QixRQUFJLENBQUMsV0FBVyxDQUFDO0FBQ2YsZUFBUyxFQUFFLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU87QUFDekMsZUFBUyxFQUFFLElBQUksQ0FBQyxTQUFTO0FBQ3pCLHFCQUFlLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVO0tBQ3RDLENBQUMsQ0FBQztHQUNKOzt5QkFuQ0csT0FBTyxFQUFTLEdBQUc7O29DQUFuQixPQUFPO0FBcUNYLFNBQUs7YUFBQSxpQkFBRyxFQUFFOzs7Ozs7U0FyQ04sT0FBTztHQUFTLEdBQUc7O0FBeUN6QixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJzcmMvb3BlcmF0b3JzL3NyYy1hdWRpby9wcm9jZXNzLXdvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBMZm8gPSByZXF1aXJlKCcuLi8uLi9jb3JlL2xmby1iYXNlJyk7XG52YXIgYXVkaW9Db250ZXh0ID0gcmVxdWlyZSgnYXVkaW8tY29udGV4dCcpO1xuXG5jbGFzcyBBdWRpb0luIGV4dGVuZHMgTGZvIHtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQXVkaW9JbikpIHJldHVybiBuZXcgQXVkaW9JbihvcHRpb25zKTtcblxuICAgIHRoaXMudHlwZSA9ICdhdWRpby1pbic7XG5cbiAgICAvLyBkZWZhdWx0c1xuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIGZyYW1lU2l6ZTogNTEyLFxuICAgICAgYmxvY2tTaXplOiAyMDQ4LFxuICAgICAgaG9wU2l6ZTogNTEyLFxuICAgICAgY2hhbm5lbDogMFxuICAgIH07XG5cbiAgICBzdXBlcihudWxsLCBvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICAvLyBwdWJzXG4gICAgdGhpcy5mcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5mcmFtZVNpemU7XG4gICAgdGhpcy5ibG9ja1NpemUgPSB0aGlzLnBhcmFtcy5ibG9ja1NpemU7XG4gICAgdGhpcy5ob3BTaXplID0gdGhpcy5wYXJhbXMuaG9wU2l6ZTtcbiAgICB0aGlzLmNoYW5uZWwgPSB0aGlzLnBhcmFtcy5jaGFubmVsO1xuICAgIHRoaXMuZnJhbWVPZmZzZXQgPSAwO1xuICAgIHRoaXMuc2FtcGxlUmF0ZSA9IGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlO1xuXG4gICAgLy8gcHJpdnNcbiAgICB0aGlzLl9jdHggPSBhdWRpb0NvbnRleHQ7XG4gICAgdGhpcy5fY3VycmVudFRpbWUgPSAwO1xuICAgIHRoaXMuX3NyYyA9IHRoaXMucGFyYW1zLnNyYztcblxuICAgIHRoaXMuc2V0dXBTdHJlYW0oe1xuICAgICAgZnJhbWVSYXRlOiB0aGlzLnNhbXBsZVJhdGUgLyB0aGlzLmhvcFNpemUsXG4gICAgICBmcmFtZVNpemU6IHRoaXMuZnJhbWVTaXplLFxuICAgICAgYXVkaW9TYW1wbGVSYXRlOiB0aGlzLl9jdHguc2FtcGxlUmF0ZVxuICAgIH0pO1xuICB9XG5cbiAgc3RhcnQoKSB7fVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXVkaW9JbjsiXX0=