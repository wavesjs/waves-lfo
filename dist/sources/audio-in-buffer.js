"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("./audio-in");

var AudioIn = _require.AudioIn;

var Framer = require("./framer");
// remove fs, avoid brfs transform
var fs = require("fs");

// BinaryArray as source

var AudioInBuffer = (function (AudioIn) {
  function AudioInBuffer() {
    var _this = this;

    var options = arguments[0] === undefined ? {} : arguments[0];

    _babelHelpers.classCallCheck(this, AudioInBuffer);

    _babelHelpers.get(_core.Object.getPrototypeOf(AudioInBuffer.prototype), "constructor", this).call(this, options);

    this.type = "audio-in-buffer";

    this.framer = new Framer(this.outFrame, this.hopSize, this._ctx.sampleRate, function (time, frame) {
      _this.output(time);
    });

    var wrk = fs.readFileSync(__dirname + "/process-worker.js", "utf8");
    var blob = new Blob([wrk], { type: "text/javascript" });

    var workerMessage = function (e) {
      var block = e.data.block;
      var time = e.data.time;

      _this.framer.input(time, block);
    };

    this._proc = new Worker(window.URL.createObjectURL(blob));
    this._proc.addEventListener("message", workerMessage, false);
  }

  _babelHelpers.inherits(AudioInBuffer, AudioIn);

  _babelHelpers.prototypeProperties(AudioInBuffer, null, {
    start: {
      value: function start() {
        var message = {
          options: {
            sampleRate: this.sampleRate,
            hopSize: this.hopSize,
            blockSize: this.blockSize,
            frameSize: this.frameSize
          },
          data: this._src.getChannelData(this.channel)
        };

        this._proc.postMessage(message);
      },
      writable: true,
      configurable: true
    }
  });

  return AudioInBuffer;
})(AudioIn);

function factory(options) {
  return new AudioInBuffer(options);
}
factory.AudioInBuffer = AudioInBuffer;

module.exports = factory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztlQUdrQixPQUFPLENBQUMsWUFBWSxDQUFDOztJQUFqQyxPQUFPLFlBQVAsT0FBTzs7QUFDYixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRWpDLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7OztJQUdqQixhQUFhLGNBQVMsT0FBTztBQUV0QixXQUZQLGFBQWE7OztRQUVMLE9BQU8sZ0NBQUcsRUFBRTs7dUNBRnBCLGFBQWE7O0FBR2Ysa0RBSEUsYUFBYSw2Q0FHVCxPQUFPLEVBQUU7O0FBRWYsUUFBSSxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQzs7QUFFOUIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsVUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFLO0FBQzNGLFlBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ25CLENBQUMsQ0FBQzs7QUFFSCxRQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxvQkFBb0IsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNwRSxRQUFJLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FBQzs7QUFHeEQsUUFBSSxhQUFhLEdBQUcsVUFBQyxDQUFDLEVBQUs7QUFDekIsVUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDekIsVUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7O0FBRXZCLFlBQUssTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDaEMsQ0FBQzs7QUFFRixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDMUQsUUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQzlEOzt5QkF4QkcsYUFBYSxFQUFTLE9BQU87O29DQUE3QixhQUFhO0FBMEJqQixTQUFLO2FBQUEsaUJBQUc7QUFDTixZQUFJLE9BQU8sR0FBRztBQUNaLGlCQUFPLEVBQUU7QUFDUCxzQkFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO0FBQzNCLG1CQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87QUFDckIscUJBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztBQUN6QixxQkFBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1dBQzFCO0FBQ0QsY0FBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDN0MsQ0FBQzs7QUFFRixZQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUNqQzs7Ozs7O1NBdENHLGFBQWE7R0FBUyxPQUFPOztBQXlDbkMsU0FBUyxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ3hCLFNBQU8sSUFBSSxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FDbkM7QUFDRCxPQUFPLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQzs7QUFFdEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiZXM2L3NvdXJjZXMvcHJvY2Vzcy13b3JrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcblwidXNlIHN0cmljdFwiO1xuXG5sZXQgeyBBdWRpb0luIH0gPSByZXF1aXJlKCcuL2F1ZGlvLWluJyk7XG5sZXQgRnJhbWVyID0gcmVxdWlyZSgnLi9mcmFtZXInKTtcbi8vIHJlbW92ZSBmcywgYXZvaWQgYnJmcyB0cmFuc2Zvcm1cbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5cbi8vIEJpbmFyeUFycmF5IGFzIHNvdXJjZVxuY2xhc3MgQXVkaW9JbkJ1ZmZlciBleHRlbmRzIEF1ZGlvSW4ge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgdGhpcy50eXBlID0gJ2F1ZGlvLWluLWJ1ZmZlcic7XG5cbiAgICB0aGlzLmZyYW1lciA9IG5ldyBGcmFtZXIodGhpcy5vdXRGcmFtZSwgdGhpcy5ob3BTaXplLCB0aGlzLl9jdHguc2FtcGxlUmF0ZSwgKHRpbWUsIGZyYW1lKSA9PiB7XG4gICAgICB0aGlzLm91dHB1dCh0aW1lKTtcbiAgICB9KTtcblxuICAgIHZhciB3cmsgPSBmcy5yZWFkRmlsZVN5bmMoX19kaXJuYW1lICsgJy9wcm9jZXNzLXdvcmtlci5qcycsICd1dGY4Jyk7XG4gICAgdmFyIGJsb2IgPSBuZXcgQmxvYihbd3JrXSwgeyB0eXBlOiBcInRleHQvamF2YXNjcmlwdFwiIH0pO1xuXG5cbiAgICB2YXIgd29ya2VyTWVzc2FnZSA9IChlKSA9PiB7XG4gICAgICB2YXIgYmxvY2sgPSBlLmRhdGEuYmxvY2s7XG4gICAgICB2YXIgdGltZSA9IGUuZGF0YS50aW1lO1xuXG4gICAgICB0aGlzLmZyYW1lci5pbnB1dCh0aW1lLCBibG9jayk7XG4gICAgfTtcblxuICAgIHRoaXMuX3Byb2MgPSBuZXcgV29ya2VyKHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpKTtcbiAgICB0aGlzLl9wcm9jLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCB3b3JrZXJNZXNzYWdlLCBmYWxzZSk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB2YXIgbWVzc2FnZSA9IHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgc2FtcGxlUmF0ZTogdGhpcy5zYW1wbGVSYXRlLFxuICAgICAgICBob3BTaXplOiB0aGlzLmhvcFNpemUsXG4gICAgICAgIGJsb2NrU2l6ZTogdGhpcy5ibG9ja1NpemUsXG4gICAgICAgIGZyYW1lU2l6ZTogdGhpcy5mcmFtZVNpemVcbiAgICAgIH0sXG4gICAgICBkYXRhOiB0aGlzLl9zcmMuZ2V0Q2hhbm5lbERhdGEodGhpcy5jaGFubmVsKVxuICAgIH07XG5cbiAgICB0aGlzLl9wcm9jLnBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZhY3Rvcnkob3B0aW9ucykge1xuICByZXR1cm4gbmV3IEF1ZGlvSW5CdWZmZXIob3B0aW9ucyk7XG59XG5mYWN0b3J5LkF1ZGlvSW5CdWZmZXIgPSBBdWRpb0luQnVmZmVyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7Il19