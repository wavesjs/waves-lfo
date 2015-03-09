"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("../core/lfo-base");

var Lfo = _require.Lfo;

var audioContext = new window.AudioContext();

var AudioIn = (function (Lfo) {
  function AudioIn() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _babelHelpers.classCallCheck(this, AudioIn);

    this.type = "audio-in";

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

function factory(options) {
  return new AudioIn(options);
}
factory.AudioIn = AudioIn;

module.exports = factory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztlQUdjLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7SUFBbkMsR0FBRyxZQUFILEdBQUc7O0FBQ1QsSUFBSSxZQUFZLEdBQUcsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7O0lBRXZDLE9BQU8sY0FBUyxHQUFHO0FBRVosV0FGUCxPQUFPO1FBRUMsT0FBTyxnQ0FBRyxFQUFFOzt1Q0FGcEIsT0FBTzs7QUFHVCxRQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQzs7O0FBR3ZCLFFBQUksUUFBUSxHQUFHO0FBQ2IsZUFBUyxFQUFFLEdBQUc7QUFDZCxlQUFTLEVBQUUsSUFBSTtBQUNmLGFBQU8sRUFBRSxHQUFHO0FBQ1osYUFBTyxFQUFFLENBQUM7S0FDWCxDQUFDOztBQUVGLGtEQWJFLE9BQU8sNkNBYUgsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7OztBQUcvQixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3ZDLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDdkMsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUNuQyxRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQ25DLFFBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxVQUFVLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQzs7O0FBRzFDLFFBQUksQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7O0FBRTVCLFFBQUksQ0FBQyxXQUFXLENBQUM7QUFDZixlQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTztBQUN6QyxlQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7QUFDekIscUJBQWUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVU7S0FDdEMsQ0FBQyxDQUFDO0dBQ0o7O3lCQWpDRyxPQUFPLEVBQVMsR0FBRzs7b0NBQW5CLE9BQU87QUFtQ1gsU0FBSzthQUFBLGlCQUFHLEVBQUU7Ozs7OztTQW5DTixPQUFPO0dBQVMsR0FBRzs7QUF1Q3pCLFNBQVMsT0FBTyxDQUFDLE9BQU8sRUFBRTtBQUN4QixTQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQzdCO0FBQ0QsT0FBTyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7O0FBRTFCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIHsgTGZvIH0gPSByZXF1aXJlKCcuLi9jb3JlL2xmby1iYXNlJyk7XG52YXIgYXVkaW9Db250ZXh0ID0gbmV3IHdpbmRvdy5BdWRpb0NvbnRleHQoKTtcblxuY2xhc3MgQXVkaW9JbiBleHRlbmRzIExmbyB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy50eXBlID0gJ2F1ZGlvLWluJztcblxuICAgIC8vIGRlZmF1bHRzXG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgZnJhbWVTaXplOiA1MTIsXG4gICAgICBibG9ja1NpemU6IDIwNDgsXG4gICAgICBob3BTaXplOiA1MTIsXG4gICAgICBjaGFubmVsOiAwXG4gICAgfTtcblxuICAgIHN1cGVyKG51bGwsIG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIC8vIHB1YnNcbiAgICB0aGlzLmZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB0aGlzLmJsb2NrU2l6ZSA9IHRoaXMucGFyYW1zLmJsb2NrU2l6ZTtcbiAgICB0aGlzLmhvcFNpemUgPSB0aGlzLnBhcmFtcy5ob3BTaXplO1xuICAgIHRoaXMuY2hhbm5lbCA9IHRoaXMucGFyYW1zLmNoYW5uZWw7XG4gICAgdGhpcy5mcmFtZU9mZnNldCA9IDA7XG4gICAgdGhpcy5zYW1wbGVSYXRlID0gYXVkaW9Db250ZXh0LnNhbXBsZVJhdGU7XG5cbiAgICAvLyBwcml2c1xuICAgIHRoaXMuX2N0eCA9IGF1ZGlvQ29udGV4dDtcbiAgICB0aGlzLl9jdXJyZW50VGltZSA9IDA7XG4gICAgdGhpcy5fc3JjID0gdGhpcy5wYXJhbXMuc3JjO1xuXG4gICAgdGhpcy5zZXR1cFN0cmVhbSh7XG4gICAgICBmcmFtZVJhdGU6IHRoaXMuc2FtcGxlUmF0ZSAvIHRoaXMuaG9wU2l6ZSxcbiAgICAgIGZyYW1lU2l6ZTogdGhpcy5mcmFtZVNpemUsXG4gICAgICBhdWRpb1NhbXBsZVJhdGU6IHRoaXMuX2N0eC5zYW1wbGVSYXRlXG4gICAgfSk7XG4gIH1cblxuICBzdGFydCgpIHt9XG5cbn1cblxuZnVuY3Rpb24gZmFjdG9yeShvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgQXVkaW9JbihvcHRpb25zKTtcbn1cbmZhY3RvcnkuQXVkaW9JbiA9IEF1ZGlvSW47XG5cbm1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTsiXX0=