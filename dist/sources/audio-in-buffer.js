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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztlQUdrQixPQUFPLENBQUMsWUFBWSxDQUFDOztJQUFqQyxPQUFPLFlBQVAsT0FBTzs7QUFDYixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRWpDLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7Ozs7O0lBS2pCLGFBQWE7QUFFTixXQUZQLGFBQWEsR0FFUzs7O1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFGcEIsYUFBYTs7QUFHZixxQ0FIRSxhQUFhLDZDQUdULE9BQU8sRUFBRTs7QUFFZixRQUFJLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDOztBQUU5QixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFDLElBQUksRUFBRSxLQUFLLEVBQUs7QUFDM0YsWUFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbkIsQ0FBQyxDQUFDOztBQUVILFFBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLG9CQUFvQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3BFLFFBQUksSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDOztBQUd4RCxRQUFJLGFBQWEsR0FBRyxVQUFDLENBQUMsRUFBSztBQUN6QixVQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUN6QixVQUFJLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzs7QUFFdkIsWUFBSyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNoQyxDQUFDOztBQUVGLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMxRCxRQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDOUQ7O1lBeEJHLGFBQWE7O2VBQWIsYUFBYTtBQTBCakIsU0FBSzthQUFBLGlCQUFHO0FBQ04sWUFBSSxPQUFPLEdBQUc7QUFDWixpQkFBTyxFQUFFO0FBQ1Asc0JBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtBQUMzQixtQkFBTyxFQUFFLElBQUksQ0FBQyxPQUFPO0FBQ3JCLHFCQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7QUFDekIscUJBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztXQUMxQjtBQUNELGNBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQzdDLENBQUM7O0FBRUYsWUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7T0FDakM7Ozs7U0F0Q0csYUFBYTtHQUFTLE9BQU87O0FBeUNuQyxTQUFTLE9BQU8sQ0FBQyxPQUFPLEVBQUU7QUFDeEIsU0FBTyxJQUFJLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUNuQztBQUNELE9BQU8sQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDOztBQUV0QyxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJlczYvc291cmNlcy9wcm9jZXNzLXdvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmxldCB7IEF1ZGlvSW4gfSA9IHJlcXVpcmUoJy4vYXVkaW8taW4nKTtcbmxldCBGcmFtZXIgPSByZXF1aXJlKCcuL2ZyYW1lcicpO1xuLy8gcmVtb3ZlIGZzLCBhdm9pZCBicmZzIHRyYW5zZm9ybVxudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcblxuLy8gQmluYXJ5QXJyYXkgYXMgc291cmNlXG4vLyBzbGljZSBpdCBibG9ja3MgdGhyb3VnaCBwcm9jZXNzLXdvcmtlclxuLy8gZm9yd2FyZCB0byB0aGUgZnJhbWVyIGFuZCBvdXRwdXQgaW4gZnJhbWVyIGNhbGxiYWNrID9cbmNsYXNzIEF1ZGlvSW5CdWZmZXIgZXh0ZW5kcyBBdWRpb0luIHtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zKTtcblxuICAgIHRoaXMudHlwZSA9ICdhdWRpby1pbi1idWZmZXInO1xuXG4gICAgdGhpcy5mcmFtZXIgPSBuZXcgRnJhbWVyKHRoaXMub3V0RnJhbWUsIHRoaXMuaG9wU2l6ZSwgdGhpcy5fY3R4LnNhbXBsZVJhdGUsICh0aW1lLCBmcmFtZSkgPT4ge1xuICAgICAgdGhpcy5vdXRwdXQodGltZSk7XG4gICAgfSk7XG5cbiAgICB2YXIgd3JrID0gZnMucmVhZEZpbGVTeW5jKF9fZGlybmFtZSArICcvcHJvY2Vzcy13b3JrZXIuanMnLCAndXRmOCcpO1xuICAgIHZhciBibG9iID0gbmV3IEJsb2IoW3dya10sIHsgdHlwZTogXCJ0ZXh0L2phdmFzY3JpcHRcIiB9KTtcblxuXG4gICAgdmFyIHdvcmtlck1lc3NhZ2UgPSAoZSkgPT4ge1xuICAgICAgdmFyIGJsb2NrID0gZS5kYXRhLmJsb2NrO1xuICAgICAgdmFyIHRpbWUgPSBlLmRhdGEudGltZTtcblxuICAgICAgdGhpcy5mcmFtZXIuaW5wdXQodGltZSwgYmxvY2spO1xuICAgIH07XG5cbiAgICB0aGlzLl9wcm9jID0gbmV3IFdvcmtlcih3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKSk7XG4gICAgdGhpcy5fcHJvYy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgd29ya2VyTWVzc2FnZSwgZmFsc2UpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIHNhbXBsZVJhdGU6IHRoaXMuc2FtcGxlUmF0ZSxcbiAgICAgICAgaG9wU2l6ZTogdGhpcy5ob3BTaXplLFxuICAgICAgICBibG9ja1NpemU6IHRoaXMuYmxvY2tTaXplLFxuICAgICAgICBmcmFtZVNpemU6IHRoaXMuZnJhbWVTaXplXG4gICAgICB9LFxuICAgICAgZGF0YTogdGhpcy5fc3JjLmdldENoYW5uZWxEYXRhKHRoaXMuY2hhbm5lbClcbiAgICB9O1xuXG4gICAgdGhpcy5fcHJvYy5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmYWN0b3J5KG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBBdWRpb0luQnVmZmVyKG9wdGlvbnMpO1xufVxuZmFjdG9yeS5BdWRpb0luQnVmZmVyID0gQXVkaW9JbkJ1ZmZlcjtcblxubW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5OyJdfQ==