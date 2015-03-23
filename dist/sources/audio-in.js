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
    this.frameSize = this.params.frameSize;
    // this.blockSize = this.params.blockSize;
    // this.hopSize = this.params.hopSize;
    this.channel = this.params.channel;
    this.frameOffset = 0;
    this.sampleRate = this.ctx.sampleRate;

    this.setupStream({
      frameRate: this.sampleRate / this.frameSize,
      frameSize: this.frameSize,
      blockSampleRate: this.sampleRate
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztlQUdjLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7SUFBbkMsR0FBRyxZQUFILEdBQUc7Ozs7SUFHSCxPQUFPO0FBRUEsV0FGUCxPQUFPLEdBRWU7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQUZwQixPQUFPOztBQUdULFFBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDOzs7QUFHdkIsUUFBSSxRQUFRLEdBQUc7QUFDYixlQUFTLEVBQUUsR0FBRzs7O0FBR2QsYUFBTyxFQUFFLENBQUM7S0FDWCxDQUFDOztBQUVGLHFDQWJFLE9BQU8sNkNBYUgsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7OztBQUcvQixRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDOztBQUV4RCxRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDOztBQUUzQixRQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNkLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDOzs7QUFHbkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQzs7O0FBR3ZDLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDbkMsUUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDckIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQzs7QUFFdEMsUUFBSSxDQUFDLFdBQVcsQ0FBQztBQUNmLGVBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTO0FBQzNDLGVBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztBQUN6QixxQkFBZSxFQUFFLElBQUksQ0FBQyxVQUFVO0tBQ2pDLENBQUMsQ0FBQzs7O0dBR0o7O1lBdENHLE9BQU87O2VBQVAsT0FBTztBQXdDWCxTQUFLO2FBQUEsaUJBQUcsRUFBRTs7OztTQXhDTixPQUFPO0dBQVMsR0FBRzs7QUE0Q3pCLFNBQVMsT0FBTyxDQUFDLE9BQU8sRUFBRTtBQUN4QixTQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQzdCO0FBQ0QsT0FBTyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7O0FBRTFCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL2F1ZGlvLWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIHsgTGZvIH0gPSByZXF1aXJlKCcuLi9jb3JlL2xmby1iYXNlJyk7XG4vLyB2YXIgYXVkaW9Db250ZXh0ID0gbmV3IHdpbmRvdy5BdWRpb0NvbnRleHQoKTtcblxuY2xhc3MgQXVkaW9JbiBleHRlbmRzIExmbyB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy50eXBlID0gJ2F1ZGlvLWluJztcblxuICAgIC8vIGRlZmF1bHRzXG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgZnJhbWVTaXplOiA1MTIsXG4gICAgICAvLyBibG9ja1NpemU6IDIwNDgsXG4gICAgICAvLyBob3BTaXplOiA1MTIsXG4gICAgICBjaGFubmVsOiAwXG4gICAgfTtcblxuICAgIHN1cGVyKG51bGwsIG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIC8vIHByaXZhdGVcbiAgICB0aGlzLmN0eCA9IHRoaXMucGFyYW1zLmN0eCB8fMKgbmV3IHdpbmRvdy5BdWRpb0NvbnRleHQoKTtcbiAgICAvLyB0aGlzLl9jdXJyZW50VGltZSA9IDA7XG4gICAgdGhpcy5zcmMgPSB0aGlzLnBhcmFtcy5zcmM7XG5cbiAgICB0aGlzLnRpbWUgPSAwO1xuICAgIHRoaXMubWV0YURhdGEgPSB7fTtcblxuICAgIC8vIHB1YmxpY1xuICAgIHRoaXMuZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIC8vIHRoaXMuYmxvY2tTaXplID0gdGhpcy5wYXJhbXMuYmxvY2tTaXplO1xuICAgIC8vIHRoaXMuaG9wU2l6ZSA9IHRoaXMucGFyYW1zLmhvcFNpemU7XG4gICAgdGhpcy5jaGFubmVsID0gdGhpcy5wYXJhbXMuY2hhbm5lbDtcbiAgICB0aGlzLmZyYW1lT2Zmc2V0ID0gMDtcbiAgICB0aGlzLnNhbXBsZVJhdGUgPSB0aGlzLmN0eC5zYW1wbGVSYXRlO1xuXG4gICAgdGhpcy5zZXR1cFN0cmVhbSh7XG4gICAgICBmcmFtZVJhdGU6IHRoaXMuc2FtcGxlUmF0ZSAvIHRoaXMuZnJhbWVTaXplLFxuICAgICAgZnJhbWVTaXplOiB0aGlzLmZyYW1lU2l6ZSxcbiAgICAgIGJsb2NrU2FtcGxlUmF0ZTogdGhpcy5zYW1wbGVSYXRlXG4gICAgfSk7XG5cbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0cmVhbVBhcmFtcyk7XG4gIH1cblxuICBzdGFydCgpIHt9XG5cbn1cblxuZnVuY3Rpb24gZmFjdG9yeShvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgQXVkaW9JbihvcHRpb25zKTtcbn1cbmZhY3RvcnkuQXVkaW9JbiA9IEF1ZGlvSW47XG5cbm1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTsiXX0=