"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("../core/lfo-base");

var Lfo = _require.Lfo;

// var audioContext = new window.AudioContext();

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
    this.ctx = this.params.ctx || new window.AudioContext();
    // this._currentTime = 0;
    this.src = this.params.src;

    this.time = 0;
    this.metaData = {};

    // public
    // this.frameSize = this.params.frameSize;
    // this.blockSize = this.params.blockSize;
    // this.hopSize = this.params.hopSize;
    // this.channel = this.params.channel;
    this.frameOffset = 0;
    // this.sampleRate = this.ctx.sampleRate;

    this.setupStream({
      frameRate: this.ctx.sampleRate / this.params.frameSize,
      frameSize: this.params.frameSize,
      blockSampleRate: this.ctx.sampleRate
    });

    // console.log(this.streamParams);
  }

  _inherits(AudioIn, _Lfo);

  _createClass(AudioIn, {
    start: {
      value: function start() {}
    }
  });

  return AudioIn;
})(Lfo);

function factory(options) {
  return new AudioIn(options);
}
factory.AudioIn = AudioIn;

module.exports = factory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztlQUdjLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7SUFBbkMsR0FBRyxZQUFILEdBQUc7Ozs7SUFHSCxPQUFPO0FBRUEsV0FGUCxPQUFPLEdBRWU7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQUZwQixPQUFPOztBQUdULFFBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDOzs7QUFHdkIsUUFBSSxRQUFRLEdBQUc7QUFDYixlQUFTLEVBQUUsR0FBRzs7O0FBR2QsYUFBTyxFQUFFLENBQUM7S0FDWCxDQUFDOztBQUVGLHFDQWJFLE9BQU8sNkNBYUgsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7OztBQUcvQixRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDOztBQUV4RCxRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDOztBQUUzQixRQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNkLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDOzs7Ozs7O0FBT25CLFFBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDOzs7QUFHckIsUUFBSSxDQUFDLFdBQVcsQ0FBQztBQUNmLGVBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7QUFDdEQsZUFBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUztBQUNoQyxxQkFBZSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVTtLQUNyQyxDQUFDLENBQUM7OztHQUdKOztZQXRDRyxPQUFPOztlQUFQLE9BQU87QUF3Q1gsU0FBSzthQUFBLGlCQUFHLEVBQUU7Ozs7U0F4Q04sT0FBTztHQUFTLEdBQUc7O0FBNEN6QixTQUFTLE9BQU8sQ0FBQyxPQUFPLEVBQUU7QUFDeEIsU0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUM3QjtBQUNELE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOztBQUUxQixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJlczYvc291cmNlcy9hdWRpby1pbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciB7IExmbyB9ID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xuLy8gdmFyIGF1ZGlvQ29udGV4dCA9IG5ldyB3aW5kb3cuQXVkaW9Db250ZXh0KCk7XG5cbmNsYXNzIEF1ZGlvSW4gZXh0ZW5kcyBMZm8ge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMudHlwZSA9ICdhdWRpby1pbic7XG5cbiAgICAvLyBkZWZhdWx0c1xuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIGZyYW1lU2l6ZTogNTEyLFxuICAgICAgLy8gYmxvY2tTaXplOiAyMDQ4LFxuICAgICAgLy8gaG9wU2l6ZTogNTEyLFxuICAgICAgY2hhbm5lbDogMFxuICAgIH07XG5cbiAgICBzdXBlcihudWxsLCBvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICAvLyBwcml2YXRlXG4gICAgdGhpcy5jdHggPSB0aGlzLnBhcmFtcy5jdHggfHzCoG5ldyB3aW5kb3cuQXVkaW9Db250ZXh0KCk7XG4gICAgLy8gdGhpcy5fY3VycmVudFRpbWUgPSAwO1xuICAgIHRoaXMuc3JjID0gdGhpcy5wYXJhbXMuc3JjO1xuXG4gICAgdGhpcy50aW1lID0gMDtcbiAgICB0aGlzLm1ldGFEYXRhID0ge307XG5cbiAgICAvLyBwdWJsaWNcbiAgICAvLyB0aGlzLmZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcbiAgICAvLyB0aGlzLmJsb2NrU2l6ZSA9IHRoaXMucGFyYW1zLmJsb2NrU2l6ZTtcbiAgICAvLyB0aGlzLmhvcFNpemUgPSB0aGlzLnBhcmFtcy5ob3BTaXplO1xuICAgIC8vIHRoaXMuY2hhbm5lbCA9IHRoaXMucGFyYW1zLmNoYW5uZWw7XG4gICAgdGhpcy5mcmFtZU9mZnNldCA9IDA7XG4gICAgLy8gdGhpcy5zYW1wbGVSYXRlID0gdGhpcy5jdHguc2FtcGxlUmF0ZTtcblxuICAgIHRoaXMuc2V0dXBTdHJlYW0oe1xuICAgICAgZnJhbWVSYXRlOiB0aGlzLmN0eC5zYW1wbGVSYXRlIC8gdGhpcy5wYXJhbXMuZnJhbWVTaXplLFxuICAgICAgZnJhbWVTaXplOiB0aGlzLnBhcmFtcy5mcmFtZVNpemUsXG4gICAgICBibG9ja1NhbXBsZVJhdGU6IHRoaXMuY3R4LnNhbXBsZVJhdGVcbiAgICB9KTtcblxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RyZWFtUGFyYW1zKTtcbiAgfVxuXG4gIHN0YXJ0KCkge31cblxufVxuXG5mdW5jdGlvbiBmYWN0b3J5KG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBBdWRpb0luKG9wdGlvbnMpO1xufVxuZmFjdG9yeS5BdWRpb0luID0gQXVkaW9JbjtcblxubW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5OyJdfQ==