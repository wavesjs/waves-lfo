"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");
var audioContext = new AudioContext();

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3RDLElBQUksWUFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7O0lBRWhDLE9BQU8sY0FBUyxHQUFHO0FBRVosV0FGUCxPQUFPO1FBRUMsT0FBTyxnQ0FBRyxFQUFFOzt1Q0FGcEIsT0FBTzs7QUFHVCxRQUFJLEVBQUUsSUFBSSxZQUFZLE9BQU8sQ0FBQSxBQUFDO0FBQUUsYUFBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUFBLEFBRTVELElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDOzs7QUFHdkIsUUFBSSxRQUFRLEdBQUc7QUFDYixlQUFTLEVBQUUsR0FBRztBQUNkLGVBQVMsRUFBRSxJQUFJO0FBQ2YsYUFBTyxFQUFFLEdBQUc7QUFDWixhQUFPLEVBQUUsQ0FBQztLQUNYLENBQUM7O0FBRUYsa0RBZkUsT0FBTyw2Q0FlSCxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTs7O0FBRy9CLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDdkMsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUN2QyxRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQ25DLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDbkMsUUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDckIsUUFBSSxDQUFDLFVBQVUsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDOzs7QUFHMUMsUUFBSSxDQUFDLElBQUksR0FBRyxZQUFZLENBQUM7QUFDekIsUUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7QUFDdEIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQzs7QUFFNUIsUUFBSSxDQUFDLFdBQVcsQ0FBQztBQUNmLGVBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPO0FBQ3pDLGVBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztBQUN6QixxQkFBZSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVTtLQUN0QyxDQUFDLENBQUM7R0FDSjs7eUJBbkNHLE9BQU8sRUFBUyxHQUFHOztvQ0FBbkIsT0FBTztBQXFDWCxTQUFLO2FBQUEsaUJBQUcsRUFBRTs7Ozs7O1NBckNOLE9BQU87R0FBUyxHQUFHOztBQXlDekIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiZXM2L3NvdXJjZXMvcHJvY2Vzcy13b3JrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcblwidXNlIHN0cmljdFwiO1xuXG52YXIgTGZvID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xudmFyIGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcblxuY2xhc3MgQXVkaW9JbiBleHRlbmRzIExmbyB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEF1ZGlvSW4pKSByZXR1cm4gbmV3IEF1ZGlvSW4ob3B0aW9ucyk7XG5cbiAgICB0aGlzLnR5cGUgPSAnYXVkaW8taW4nO1xuXG4gICAgLy8gZGVmYXVsdHNcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBmcmFtZVNpemU6IDUxMixcbiAgICAgIGJsb2NrU2l6ZTogMjA0OCxcbiAgICAgIGhvcFNpemU6IDUxMixcbiAgICAgIGNoYW5uZWw6IDBcbiAgICB9O1xuXG4gICAgc3VwZXIobnVsbCwgb3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgLy8gcHVic1xuICAgIHRoaXMuZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuYmxvY2tTaXplID0gdGhpcy5wYXJhbXMuYmxvY2tTaXplO1xuICAgIHRoaXMuaG9wU2l6ZSA9IHRoaXMucGFyYW1zLmhvcFNpemU7XG4gICAgdGhpcy5jaGFubmVsID0gdGhpcy5wYXJhbXMuY2hhbm5lbDtcbiAgICB0aGlzLmZyYW1lT2Zmc2V0ID0gMDtcbiAgICB0aGlzLnNhbXBsZVJhdGUgPSBhdWRpb0NvbnRleHQuc2FtcGxlUmF0ZTtcblxuICAgIC8vIHByaXZzXG4gICAgdGhpcy5fY3R4ID0gYXVkaW9Db250ZXh0O1xuICAgIHRoaXMuX2N1cnJlbnRUaW1lID0gMDtcbiAgICB0aGlzLl9zcmMgPSB0aGlzLnBhcmFtcy5zcmM7XG5cbiAgICB0aGlzLnNldHVwU3RyZWFtKHtcbiAgICAgIGZyYW1lUmF0ZTogdGhpcy5zYW1wbGVSYXRlIC8gdGhpcy5ob3BTaXplLFxuICAgICAgZnJhbWVTaXplOiB0aGlzLmZyYW1lU2l6ZSxcbiAgICAgIGF1ZGlvU2FtcGxlUmF0ZTogdGhpcy5fY3R4LnNhbXBsZVJhdGVcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXJ0KCkge31cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEF1ZGlvSW47Il19