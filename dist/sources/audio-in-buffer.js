"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var AudioIn = require("./audio-in");
var Framer = require("./framer");
// remove fs, avoid brfs transform
var fs = require("fs");

// BinaryArray as source

var AudioInBuffer = (function (AudioIn) {
  function AudioInBuffer() {
    var _this = this;

    var options = arguments[0] === undefined ? {} : arguments[0];

    _babelHelpers.classCallCheck(this, AudioInBuffer);

    if (!(this instanceof AudioInBuffer)) {
      return new AudioInBuffer(options);
    }_babelHelpers.get(_core.Object.getPrototypeOf(AudioInBuffer.prototype), "constructor", this).call(this, options);

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

module.exports = AudioInBuffer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNwQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRWpDLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7OztJQUdqQixhQUFhLGNBQVMsT0FBTztBQUV0QixXQUZQLGFBQWE7OztRQUVMLE9BQU8sZ0NBQUcsRUFBRTs7dUNBRnBCLGFBQWE7O0FBR2YsUUFBSSxFQUFFLElBQUksWUFBWSxhQUFhLENBQUEsQUFBQztBQUFFLGFBQU8sSUFBSSxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7S0FBQSxBQUN4RSw4Q0FKRSxhQUFhLDZDQUlULE9BQU8sRUFBRTs7QUFFZixRQUFJLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDOztBQUU5QixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFDLElBQUksRUFBRSxLQUFLLEVBQUs7QUFDM0YsWUFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbkIsQ0FBQyxDQUFDOztBQUVILFFBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLG9CQUFvQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3BFLFFBQUksSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDOztBQUd4RCxRQUFJLGFBQWEsR0FBRyxVQUFDLENBQUMsRUFBSztBQUN6QixVQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUN6QixVQUFJLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzs7QUFFdkIsWUFBSyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNoQyxDQUFDOztBQUVGLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMxRCxRQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDOUQ7O3lCQXpCRyxhQUFhLEVBQVMsT0FBTzs7b0NBQTdCLGFBQWE7QUEyQmpCLFNBQUs7YUFBQSxpQkFBRztBQUNOLFlBQUksT0FBTyxHQUFHO0FBQ1osaUJBQU8sRUFBRTtBQUNQLHNCQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7QUFDM0IsbUJBQU8sRUFBRSxJQUFJLENBQUMsT0FBTztBQUNyQixxQkFBUyxFQUFFLElBQUksQ0FBQyxTQUFTO0FBQ3pCLHFCQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7V0FDMUI7QUFDRCxjQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUM3QyxDQUFDOztBQUVGLFlBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQ2pDOzs7Ozs7U0F2Q0csYUFBYTtHQUFTLE9BQU87O0FBMENuQyxNQUFNLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyIsImZpbGUiOiJlczYvc291cmNlcy9wcm9jZXNzLXdvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmxldCBBdWRpb0luID0gcmVxdWlyZSgnLi9hdWRpby1pbicpO1xubGV0IEZyYW1lciA9IHJlcXVpcmUoJy4vZnJhbWVyJyk7XG4vLyByZW1vdmUgZnMsIGF2b2lkIGJyZnMgdHJhbnNmb3JtXG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xuXG4vLyBCaW5hcnlBcnJheSBhcyBzb3VyY2VcbmNsYXNzIEF1ZGlvSW5CdWZmZXIgZXh0ZW5kcyBBdWRpb0luIHtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQXVkaW9JbkJ1ZmZlcikpIHJldHVybiBuZXcgQXVkaW9JbkJ1ZmZlcihvcHRpb25zKTtcbiAgICBzdXBlcihvcHRpb25zKTtcblxuICAgIHRoaXMudHlwZSA9ICdhdWRpby1pbi1idWZmZXInO1xuXG4gICAgdGhpcy5mcmFtZXIgPSBuZXcgRnJhbWVyKHRoaXMub3V0RnJhbWUsIHRoaXMuaG9wU2l6ZSwgdGhpcy5fY3R4LnNhbXBsZVJhdGUsICh0aW1lLCBmcmFtZSkgPT4ge1xuICAgICAgdGhpcy5vdXRwdXQodGltZSk7XG4gICAgfSk7XG5cbiAgICB2YXIgd3JrID0gZnMucmVhZEZpbGVTeW5jKF9fZGlybmFtZSArICcvcHJvY2Vzcy13b3JrZXIuanMnLCAndXRmOCcpO1xuICAgIHZhciBibG9iID0gbmV3IEJsb2IoW3dya10sIHsgdHlwZTogXCJ0ZXh0L2phdmFzY3JpcHRcIiB9KTtcblxuXG4gICAgdmFyIHdvcmtlck1lc3NhZ2UgPSAoZSkgPT4ge1xuICAgICAgdmFyIGJsb2NrID0gZS5kYXRhLmJsb2NrO1xuICAgICAgdmFyIHRpbWUgPSBlLmRhdGEudGltZTtcblxuICAgICAgdGhpcy5mcmFtZXIuaW5wdXQodGltZSwgYmxvY2spO1xuICAgIH07XG5cbiAgICB0aGlzLl9wcm9jID0gbmV3IFdvcmtlcih3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKSk7XG4gICAgdGhpcy5fcHJvYy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgd29ya2VyTWVzc2FnZSwgZmFsc2UpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIHNhbXBsZVJhdGU6IHRoaXMuc2FtcGxlUmF0ZSxcbiAgICAgICAgaG9wU2l6ZTogdGhpcy5ob3BTaXplLFxuICAgICAgICBibG9ja1NpemU6IHRoaXMuYmxvY2tTaXplLFxuICAgICAgICBmcmFtZVNpemU6IHRoaXMuZnJhbWVTaXplXG4gICAgICB9LFxuICAgICAgZGF0YTogdGhpcy5fc3JjLmdldENoYW5uZWxEYXRhKHRoaXMuY2hhbm5lbClcbiAgICB9O1xuXG4gICAgdGhpcy5fcHJvYy5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEF1ZGlvSW5CdWZmZXI7Il19