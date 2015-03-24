"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("./audio-in");

var AudioIn = _require.AudioIn;

var Framer = require("./framer");
var worker = require("./process-worker");

self.addEventListener("message", function process(e) {
  var message = e.data;
  var blockSize = message.options.blockSize;
  var sampleRate = message.options.sampleRate;
  var buffer = message.data;
  var length = buffer.length;
  var block = new Float32Array(blockSize);

  for (var index = 0; index < length; index += blockSize) {
    var copySize = length - index;

    if (copySize > blockSize) {
      copySize = blockSize;
    }

    var bufferSegment = buffer.subarray(index, index + copySize);
    block.set(bufferSegment, 0);

    // no need for that is handled natively in Float32Array
    // for (var i = copySize; i < blockSize; i++) { block[i] = 0; }

    postMessage({ block: block, time: index / sampleRate });
  }
}, false);

// AudioBuffer as source
// slice it in blocks through a worker

var AudioInBuffer = (function (_AudioIn) {
  function AudioInBuffer() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, AudioInBuffer);

    _get(_core.Object.getPrototypeOf(AudioInBuffer.prototype), "constructor", this).call(this, options);

    if (!this.params.src || !(this.params.src instanceof AudioBuffer)) {
      throw new Error("An AudioBuffer source must be given");
    }

    this.type = "audio-in-buffer";
    this.metaData = {};

    // a bit ugly but works
    worker = worker.toString().replace(/^function \(\) \{/, "").replace(/\}$/, "");

    // init worker
    var blob = new Blob([worker], { type: "text/javascript" });
    this.worker = new Worker(window.URL.createObjectURL(blob));

    this.setupStream({
      frameSize: this.params.frameSize,
      frameRate: this.params.src.sampleRate / this.frameSize,
      blockSampleRate: this.params.src.sampleRate
    });

    this.worker.addEventListener("message", this.process.bind(this), false);
  }

  _inherits(AudioInBuffer, _AudioIn);

  _createClass(AudioInBuffer, {
    start: {
      value: function start() {
        var message = {
          options: {
            sampleRate: this.streamParams.blockSampleRate,
            blockSize: this.streamParams.frameSize
          },
          data: this.src.getChannelData(this.channel)
        };

        this.worker.postMessage(message);
      }
    },
    process: {
      value: function process(e) {
        this.outFrame = e.data.block;
        this.time = e.data.time;

        this.output();
      }
    }
  });

  return AudioInBuffer;
})(AudioIn);

// function factory(options) {
//   return new AudioInBuffer(options);
// }
// factory.AudioInBuffer = AudioInBuffer;

module.exports = AudioInBuffer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLWJ1ZmZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7ZUFFa0IsT0FBTyxDQUFDLFlBQVksQ0FBQzs7SUFBakMsT0FBTyxZQUFQLE9BQU87O0FBQ2IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2pDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUV6QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFNBQVMsT0FBTyxDQUFDLENBQUMsRUFBRTtBQUNuRCxNQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ3JCLE1BQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO0FBQzFDLE1BQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO0FBQzVDLE1BQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDMUIsTUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUMzQixNQUFJLEtBQUssR0FBRyxJQUFJLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFeEMsT0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLE1BQU0sRUFBRSxLQUFLLElBQUksU0FBUyxFQUFFO0FBQ3RELFFBQUksUUFBUSxHQUFHLE1BQU0sR0FBRyxLQUFLLENBQUM7O0FBRTlCLFFBQUksUUFBUSxHQUFHLFNBQVMsRUFBRTtBQUFFLGNBQVEsR0FBRyxTQUFTLENBQUM7S0FBRTs7QUFFbkQsUUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDO0FBQzdELFNBQUssQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7OztBQUs1QixlQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEdBQUcsVUFBVSxFQUFFLENBQUMsQ0FBQztHQUN6RDtDQUNGLEVBQUUsS0FBSyxDQUFDLENBQUM7Ozs7O0lBSUosYUFBYTtBQUVOLFdBRlAsYUFBYSxHQUVTO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFGcEIsYUFBYTs7QUFHZixxQ0FIRSxhQUFhLDZDQUdULE9BQU8sRUFBRTs7QUFFZixRQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsWUFBWSxXQUFXLENBQUEsQUFBQyxFQUFFO0FBQ2pFLFlBQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztLQUN4RDs7QUFFRCxRQUFJLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDO0FBQzlCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDOzs7QUFHbkIsVUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FDdkIsT0FBTyxDQUFDLG1CQUFtQixFQUFFLEVBQUUsQ0FBQyxDQUNoQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7QUFHdEIsUUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUM7QUFDM0QsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUUzRCxRQUFJLENBQUMsV0FBVyxDQUFDO0FBQ2YsZUFBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUztBQUNoQyxlQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTO0FBQ3RELHFCQUFlLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVTtLQUM1QyxDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDekU7O1lBNUJHLGFBQWE7O2VBQWIsYUFBYTtBQThCakIsU0FBSzthQUFBLGlCQUFHO0FBQ04sWUFBSSxPQUFPLEdBQUc7QUFDWixpQkFBTyxFQUFFO0FBQ1Asc0JBQVUsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWU7QUFDN0MscUJBQVMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVM7V0FDdkM7QUFDRCxjQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUM1QyxDQUFDOztBQUVGLFlBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQ2xDOztBQUVELFdBQU87YUFBQSxpQkFBQyxDQUFDLEVBQUU7QUFDVCxZQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQzdCLFlBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7O0FBRXhCLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNmOzs7O1NBL0NHLGFBQWE7R0FBUyxPQUFPOzs7Ozs7O0FBdURuQyxNQUFNLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyIsImZpbGUiOiJlczYvc291cmNlcy9hdWRpby1pbi1idWZmZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIHsgQXVkaW9JbiB9ID0gcmVxdWlyZSgnLi9hdWRpby1pbicpO1xudmFyIEZyYW1lciA9IHJlcXVpcmUoJy4vZnJhbWVyJyk7XG52YXIgd29ya2VyID0gcmVxdWlyZSgnLi9wcm9jZXNzLXdvcmtlcicpO1xuXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiBwcm9jZXNzKGUpIHtcbiAgdmFyIG1lc3NhZ2UgPSBlLmRhdGE7XG4gIHZhciBibG9ja1NpemUgPSBtZXNzYWdlLm9wdGlvbnMuYmxvY2tTaXplO1xuICB2YXIgc2FtcGxlUmF0ZSA9IG1lc3NhZ2Uub3B0aW9ucy5zYW1wbGVSYXRlO1xuICB2YXIgYnVmZmVyID0gbWVzc2FnZS5kYXRhO1xuICB2YXIgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aDtcbiAgdmFyIGJsb2NrID0gbmV3IEZsb2F0MzJBcnJheShibG9ja1NpemUpO1xuXG4gIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IGJsb2NrU2l6ZSkge1xuICAgIHZhciBjb3B5U2l6ZSA9IGxlbmd0aCAtIGluZGV4O1xuXG4gICAgaWYgKGNvcHlTaXplID4gYmxvY2tTaXplKSB7IGNvcHlTaXplID0gYmxvY2tTaXplOyB9XG5cbiAgICB2YXIgYnVmZmVyU2VnbWVudCA9IGJ1ZmZlci5zdWJhcnJheShpbmRleCwgaW5kZXggKyBjb3B5U2l6ZSk7XG4gICAgYmxvY2suc2V0KGJ1ZmZlclNlZ21lbnQsIDApO1xuXG4gICAgLy8gbm8gbmVlZCBmb3IgdGhhdCBpcyBoYW5kbGVkIG5hdGl2ZWx5IGluIEZsb2F0MzJBcnJheVxuICAgIC8vIGZvciAodmFyIGkgPSBjb3B5U2l6ZTsgaSA8IGJsb2NrU2l6ZTsgaSsrKSB7IGJsb2NrW2ldID0gMDsgfVxuXG4gICAgcG9zdE1lc3NhZ2UoeyBibG9jazogYmxvY2ssIHRpbWU6IGluZGV4IC8gc2FtcGxlUmF0ZSB9KTtcbiAgfVxufSwgZmFsc2UpO1xuXG4vLyBBdWRpb0J1ZmZlciBhcyBzb3VyY2Vcbi8vIHNsaWNlIGl0IGluIGJsb2NrcyB0aHJvdWdoIGEgd29ya2VyXG5jbGFzcyBBdWRpb0luQnVmZmVyIGV4dGVuZHMgQXVkaW9JbiB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLnNyYyB8fCAhKHRoaXMucGFyYW1zLnNyYyBpbnN0YW5jZW9mIEF1ZGlvQnVmZmVyKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbiBBdWRpb0J1ZmZlciBzb3VyY2UgbXVzdCBiZSBnaXZlbicpO1xuICAgIH1cblxuICAgIHRoaXMudHlwZSA9ICdhdWRpby1pbi1idWZmZXInO1xuICAgIHRoaXMubWV0YURhdGEgPSB7fTtcblxuICAgIC8vIGEgYml0IHVnbHkgYnV0IHdvcmtzXG4gICAgd29ya2VyID0gd29ya2VyLnRvU3RyaW5nKClcbiAgICAgIC5yZXBsYWNlKC9eZnVuY3Rpb24gXFwoXFwpIFxcey8sICcnKVxuICAgICAgLnJlcGxhY2UoL1xcfSQvLCAnJyk7XG5cbiAgICAvLyBpbml0IHdvcmtlclxuICAgIHZhciBibG9iID0gbmV3IEJsb2IoW3dvcmtlcl0sIHsgdHlwZTogXCJ0ZXh0L2phdmFzY3JpcHRcIiB9KTtcbiAgICB0aGlzLndvcmtlciA9IG5ldyBXb3JrZXIod2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYikpO1xuXG4gICAgdGhpcy5zZXR1cFN0cmVhbSh7XG4gICAgICBmcmFtZVNpemU6IHRoaXMucGFyYW1zLmZyYW1lU2l6ZSxcbiAgICAgIGZyYW1lUmF0ZTogdGhpcy5wYXJhbXMuc3JjLnNhbXBsZVJhdGUgLyB0aGlzLmZyYW1lU2l6ZSxcbiAgICAgIGJsb2NrU2FtcGxlUmF0ZTogdGhpcy5wYXJhbXMuc3JjLnNhbXBsZVJhdGVcbiAgICB9KTtcblxuICAgIHRoaXMud29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCB0aGlzLnByb2Nlc3MuYmluZCh0aGlzKSwgZmFsc2UpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIHNhbXBsZVJhdGU6IHRoaXMuc3RyZWFtUGFyYW1zLmJsb2NrU2FtcGxlUmF0ZSxcbiAgICAgICAgYmxvY2tTaXplOiB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemVcbiAgICAgIH0sXG4gICAgICBkYXRhOiB0aGlzLnNyYy5nZXRDaGFubmVsRGF0YSh0aGlzLmNoYW5uZWwpXG4gICAgfTtcblxuICAgIHRoaXMud29ya2VyLnBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xuICB9XG5cbiAgcHJvY2VzcyhlKSB7XG4gICAgdGhpcy5vdXRGcmFtZSA9IGUuZGF0YS5ibG9jaztcbiAgICB0aGlzLnRpbWUgPSBlLmRhdGEudGltZTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cblxuLy8gZnVuY3Rpb24gZmFjdG9yeShvcHRpb25zKSB7XG4vLyAgIHJldHVybiBuZXcgQXVkaW9JbkJ1ZmZlcihvcHRpb25zKTtcbi8vIH1cbi8vIGZhY3RvcnkuQXVkaW9JbkJ1ZmZlciA9IEF1ZGlvSW5CdWZmZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gQXVkaW9JbkJ1ZmZlcjsiXX0=