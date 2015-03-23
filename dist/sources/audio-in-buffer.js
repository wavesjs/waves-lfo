"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("./audio-in");

var AudioIn = _require.AudioIn;

var Framer = require("./framer");
// remove fs, avoid brfs transform
var fs = require("fs");

// BinaryArray as source
// slice it blocks through process-worker
// forward to the framer and output in framer callback ?

var AudioInBuffer = (function (_AudioIn) {
  function AudioInBuffer() {
    var _this = this;

    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, AudioInBuffer);

    _get(_core.Object.getPrototypeOf(AudioInBuffer.prototype), "constructor", this).call(this, options);

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

  _inherits(AudioInBuffer, _AudioIn);

  _createClass(AudioInBuffer, {
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
      }
    }
  });

  return AudioInBuffer;
})(AudioIn);

function factory(options) {
  return new AudioInBuffer(options);
}
factory.AudioInBuffer = AudioInBuffer;

module.exports = factory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLWJ1ZmZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7ZUFFa0IsT0FBTyxDQUFDLFlBQVksQ0FBQzs7SUFBakMsT0FBTyxZQUFQLE9BQU87O0FBQ2IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUVqQyxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7OztJQUtqQixhQUFhO0FBRU4sV0FGUCxhQUFhLEdBRVM7OztRQUFkLE9BQU8sZ0NBQUcsRUFBRTs7MEJBRnBCLGFBQWE7O0FBR2YscUNBSEUsYUFBYSw2Q0FHVCxPQUFPLEVBQUU7O0FBRWYsUUFBSSxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQzs7QUFFOUIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsVUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFLO0FBQzNGLFlBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ25CLENBQUMsQ0FBQzs7QUFFSCxRQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxvQkFBb0IsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNwRSxRQUFJLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FBQzs7QUFFeEQsUUFBSSxhQUFhLEdBQUcsVUFBQyxDQUFDLEVBQUs7QUFDekIsVUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDekIsVUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7O0FBRXZCLFlBQUssTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDaEMsQ0FBQzs7QUFFRixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDMUQsUUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQzlEOztZQXZCRyxhQUFhOztlQUFiLGFBQWE7QUF5QmpCLFNBQUs7YUFBQSxpQkFBRztBQUNOLFlBQUksT0FBTyxHQUFHO0FBQ1osaUJBQU8sRUFBRTtBQUNQLHNCQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7QUFDM0IsbUJBQU8sRUFBRSxJQUFJLENBQUMsT0FBTztBQUNyQixxQkFBUyxFQUFFLElBQUksQ0FBQyxTQUFTO0FBQ3pCLHFCQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7V0FDMUI7QUFDRCxjQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUM3QyxDQUFDOztBQUVGLFlBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQ2pDOzs7O1NBckNHLGFBQWE7R0FBUyxPQUFPOztBQXdDbkMsU0FBUyxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ3hCLFNBQU8sSUFBSSxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FDbkM7QUFDRCxPQUFPLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQzs7QUFFdEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiZXM2L3NvdXJjZXMvYXVkaW8taW4tYnVmZmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmxldCB7IEF1ZGlvSW4gfSA9IHJlcXVpcmUoJy4vYXVkaW8taW4nKTtcbmxldCBGcmFtZXIgPSByZXF1aXJlKCcuL2ZyYW1lcicpO1xuLy8gcmVtb3ZlIGZzLCBhdm9pZCBicmZzIHRyYW5zZm9ybVxudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcblxuLy8gQmluYXJ5QXJyYXkgYXMgc291cmNlXG4vLyBzbGljZSBpdCBibG9ja3MgdGhyb3VnaCBwcm9jZXNzLXdvcmtlclxuLy8gZm9yd2FyZCB0byB0aGUgZnJhbWVyIGFuZCBvdXRwdXQgaW4gZnJhbWVyIGNhbGxiYWNrID9cbmNsYXNzIEF1ZGlvSW5CdWZmZXIgZXh0ZW5kcyBBdWRpb0luIHtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zKTtcblxuICAgIHRoaXMudHlwZSA9ICdhdWRpby1pbi1idWZmZXInO1xuXG4gICAgdGhpcy5mcmFtZXIgPSBuZXcgRnJhbWVyKHRoaXMub3V0RnJhbWUsIHRoaXMuaG9wU2l6ZSwgdGhpcy5fY3R4LnNhbXBsZVJhdGUsICh0aW1lLCBmcmFtZSkgPT4ge1xuICAgICAgdGhpcy5vdXRwdXQodGltZSk7XG4gICAgfSk7XG5cbiAgICB2YXIgd3JrID0gZnMucmVhZEZpbGVTeW5jKF9fZGlybmFtZSArICcvcHJvY2Vzcy13b3JrZXIuanMnLCAndXRmOCcpO1xuICAgIHZhciBibG9iID0gbmV3IEJsb2IoW3dya10sIHsgdHlwZTogXCJ0ZXh0L2phdmFzY3JpcHRcIiB9KTtcblxuICAgIHZhciB3b3JrZXJNZXNzYWdlID0gKGUpID0+IHtcbiAgICAgIHZhciBibG9jayA9IGUuZGF0YS5ibG9jaztcbiAgICAgIHZhciB0aW1lID0gZS5kYXRhLnRpbWU7XG5cbiAgICAgIHRoaXMuZnJhbWVyLmlucHV0KHRpbWUsIGJsb2NrKTtcbiAgICB9O1xuXG4gICAgdGhpcy5fcHJvYyA9IG5ldyBXb3JrZXIod2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYikpO1xuICAgIHRoaXMuX3Byb2MuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHdvcmtlck1lc3NhZ2UsIGZhbHNlKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHZhciBtZXNzYWdlID0ge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBzYW1wbGVSYXRlOiB0aGlzLnNhbXBsZVJhdGUsXG4gICAgICAgIGhvcFNpemU6IHRoaXMuaG9wU2l6ZSxcbiAgICAgICAgYmxvY2tTaXplOiB0aGlzLmJsb2NrU2l6ZSxcbiAgICAgICAgZnJhbWVTaXplOiB0aGlzLmZyYW1lU2l6ZVxuICAgICAgfSxcbiAgICAgIGRhdGE6IHRoaXMuX3NyYy5nZXRDaGFubmVsRGF0YSh0aGlzLmNoYW5uZWwpXG4gICAgfTtcblxuICAgIHRoaXMuX3Byb2MucG9zdE1lc3NhZ2UobWVzc2FnZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmFjdG9yeShvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgQXVkaW9JbkJ1ZmZlcihvcHRpb25zKTtcbn1cbmZhY3RvcnkuQXVkaW9JbkJ1ZmZlciA9IEF1ZGlvSW5CdWZmZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTsiXX0=