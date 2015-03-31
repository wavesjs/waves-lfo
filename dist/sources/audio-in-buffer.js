"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var AudioIn = require("./audio-in");

var worker = "self.addEventListener(\"message\", function process(e) {      var message = e.data;                                                   var blockSize = message.options.blockSize;                              var sampleRate = message.options.sampleRate;                            var buffer = message.data;                                              var length = buffer.length;                                             var block = new Float32Array(blockSize);                                                                                                        for (var index = 0; index < length; index += blockSize) {                 var copySize = length - index;                                                                                                                  if (copySize > blockSize) { copySize = blockSize; }                                                                                             var bufferSegment = buffer.subarray(index, index + copySize);           block.set(bufferSegment, 0);                                                                                                                    /* no need for that, handled natively by Float32Array */                /* for (var i = copySize; i < blockSize; i++) { block[i] = 0; } */                                                                              postMessage({ block: block, time: index / sampleRate });              }                                                                     }, false);".replace(/\s+/g, " ");

// AudioBuffer as source
// slice it in blocks through a worker

var AudioInBuffer = (function (_AudioIn) {
  function AudioInBuffer() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, AudioInBuffer);

    var defaults = {};
    this.metaData = {};

    _get(_core.Object.getPrototypeOf(AudioInBuffer.prototype), "constructor", this).call(this, options, defaults);

    if (!this.params.src || !(this.params.src instanceof AudioBuffer)) {
      throw new Error("An AudioBuffer source must be given");
    }
  }

  _inherits(AudioInBuffer, _AudioIn);

  _createClass(AudioInBuffer, {
    configureStream: {
      value: function configureStream() {
        this.streamParams.frameSize = this.params.frameSize;
        this.streamParams.frameRate = this.params.src.sampleRate / this.frameSize;
        this.streamParams.blockSampleRate = this.params.src.sampleRate;
      }
    },
    initialize: {
      value: function initialize() {
        _get(_core.Object.getPrototypeOf(AudioInBuffer.prototype), "initialize", this).call(this);
        // init worker
        var blob = new Blob([worker], { type: "text/javascript" });
        this.worker = new Worker(window.URL.createObjectURL(blob));
        this.worker.addEventListener("message", this.process.bind(this), false);
      }
    },
    start: {
      value: function start() {
        this.initialize();
        this.reset();

        this.worker.postMessage({
          options: {
            sampleRate: this.streamParams.blockSampleRate,
            blockSize: this.streamParams.frameSize
          },
          data: this.src.getChannelData(this.channel)
        });
      }
    },
    stop: {
      value: function stop() {
        this.finalize();
      }
    },
    process: {

      // callback of the worker

      value: function process(e) {
        this.outFrame = e.data.block;
        this.time = e.data.time;

        this.output();
      }
    }
  });

  return AudioInBuffer;
})(AudioIn);

module.exports = AudioInBuffer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLWJ1ZmZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7O0FBRXBDLElBQUksTUFBTSxHQUFHLHcrQ0FxQkYsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDOzs7OztJQUkzQixhQUFhO0FBRU4sV0FGUCxhQUFhLEdBRVM7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQUZwQixhQUFhOztBQUdmLFFBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNsQixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQzs7QUFFbkIscUNBTkUsYUFBYSw2Q0FNVCxPQUFPLEVBQUUsUUFBUSxFQUFFOztBQUV6QixRQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsWUFBWSxXQUFXLENBQUEsQUFBQyxFQUFFO0FBQ2pFLFlBQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztLQUN4RDtHQUNGOztZQVhHLGFBQWE7O2VBQWIsYUFBYTtBQWFqQixtQkFBZTthQUFBLDJCQUFHO0FBQ2hCLFlBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3BELFlBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQzFFLFlBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztPQUNoRTs7QUFFRCxjQUFVO2FBQUEsc0JBQUc7QUFDWCx5Q0FwQkUsYUFBYSw0Q0FvQkk7O0FBRW5CLFlBQUksSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO0FBQzNELFlBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMzRCxZQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUN6RTs7QUFFRCxTQUFLO2FBQUEsaUJBQUc7QUFDTixZQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsWUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUViLFlBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBQ3RCLGlCQUFPLEVBQUU7QUFDUCxzQkFBVSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZTtBQUM3QyxxQkFBUyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUztXQUN2QztBQUNELGNBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQzVDLENBQUMsQ0FBQztPQUNKOztBQUVELFFBQUk7YUFBQSxnQkFBRztBQUNMLFlBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztPQUNqQjs7QUFHRCxXQUFPOzs7O2FBQUEsaUJBQUMsQ0FBQyxFQUFFO0FBQ1QsWUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUM3QixZQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDOztBQUV4QixZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZjs7OztTQWxERyxhQUFhO0dBQVMsT0FBTzs7QUFxRG5DLE1BQU0sQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL2F1ZGlvLWluLWJ1ZmZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQXVkaW9JbiA9IHJlcXVpcmUoJy4vYXVkaW8taW4nKTtcblxudmFyIHdvcmtlciA9ICdzZWxmLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uIHByb2Nlc3MoZSkgeyAgICBcXFxuICB2YXIgbWVzc2FnZSA9IGUuZGF0YTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxcbiAgdmFyIGJsb2NrU2l6ZSA9IG1lc3NhZ2Uub3B0aW9ucy5ibG9ja1NpemU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcXG4gIHZhciBzYW1wbGVSYXRlID0gbWVzc2FnZS5vcHRpb25zLnNhbXBsZVJhdGU7ICAgICAgICAgICAgICAgICAgICAgICAgICBcXFxuICB2YXIgYnVmZmVyID0gbWVzc2FnZS5kYXRhOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxcbiAgdmFyIGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcXG4gIHZhciBibG9jayA9IG5ldyBGbG9hdDMyQXJyYXkoYmxvY2tTaXplKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxcbiAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gYmxvY2tTaXplKSB7ICAgICAgICAgICAgIFxcXG4gICAgdmFyIGNvcHlTaXplID0gbGVuZ3RoIC0gaW5kZXg7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxcbiAgICBpZiAoY29weVNpemUgPiBibG9ja1NpemUpIHsgY29weVNpemUgPSBibG9ja1NpemU7IH0gICAgICAgICAgICAgICAgIFxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXFxuICAgIHZhciBidWZmZXJTZWdtZW50ID0gYnVmZmVyLnN1YmFycmF5KGluZGV4LCBpbmRleCArIGNvcHlTaXplKTsgICAgICAgXFxcbiAgICBibG9jay5zZXQoYnVmZmVyU2VnbWVudCwgMCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXFxuICAgIC8qIG5vIG5lZWQgZm9yIHRoYXQsIGhhbmRsZWQgbmF0aXZlbHkgYnkgRmxvYXQzMkFycmF5ICovICAgICAgICAgICAgXFxcbiAgICAvKiBmb3IgKHZhciBpID0gY29weVNpemU7IGkgPCBibG9ja1NpemU7IGkrKykgeyBibG9ja1tpXSA9IDA7IH0gKi8gIFxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXFxuICAgIHBvc3RNZXNzYWdlKHsgYmxvY2s6IGJsb2NrLCB0aW1lOiBpbmRleCAvIHNhbXBsZVJhdGUgfSk7ICAgICAgICAgICAgXFxcbiAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcXG59LCBmYWxzZSk7Jy5yZXBsYWNlKC9cXHMrL2csICcgJyk7XG5cbi8vIEF1ZGlvQnVmZmVyIGFzIHNvdXJjZVxuLy8gc2xpY2UgaXQgaW4gYmxvY2tzIHRocm91Z2ggYSB3b3JrZXJcbmNsYXNzIEF1ZGlvSW5CdWZmZXIgZXh0ZW5kcyBBdWRpb0luIHtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZGVmYXVsdHMgPSB7fTtcbiAgICB0aGlzLm1ldGFEYXRhID0ge307XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLnNyYyB8fCAhKHRoaXMucGFyYW1zLnNyYyBpbnN0YW5jZW9mIEF1ZGlvQnVmZmVyKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbiBBdWRpb0J1ZmZlciBzb3VyY2UgbXVzdCBiZSBnaXZlbicpO1xuICAgIH1cbiAgfVxuXG4gIGNvbmZpZ3VyZVN0cmVhbSgpIHtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5mcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gdGhpcy5wYXJhbXMuc3JjLnNhbXBsZVJhdGUgLyB0aGlzLmZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5ibG9ja1NhbXBsZVJhdGUgPSB0aGlzLnBhcmFtcy5zcmMuc2FtcGxlUmF0ZTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIC8vIGluaXQgd29ya2VyXG4gICAgdmFyIGJsb2IgPSBuZXcgQmxvYihbd29ya2VyXSwgeyB0eXBlOiBcInRleHQvamF2YXNjcmlwdFwiIH0pO1xuICAgIHRoaXMud29ya2VyID0gbmV3IFdvcmtlcih3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKSk7XG4gICAgdGhpcy53b3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMucHJvY2Vzcy5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIHNhbXBsZVJhdGU6IHRoaXMuc3RyZWFtUGFyYW1zLmJsb2NrU2FtcGxlUmF0ZSxcbiAgICAgICAgYmxvY2tTaXplOiB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemVcbiAgICAgIH0sXG4gICAgICBkYXRhOiB0aGlzLnNyYy5nZXRDaGFubmVsRGF0YSh0aGlzLmNoYW5uZWwpXG4gICAgfSk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcbiAgfVxuXG4gIC8vIGNhbGxiYWNrIG9mIHRoZSB3b3JrZXJcbiAgcHJvY2VzcyhlKSB7XG4gICAgdGhpcy5vdXRGcmFtZSA9IGUuZGF0YS5ibG9jaztcbiAgICB0aGlzLnRpbWUgPSBlLmRhdGEudGltZTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBdWRpb0luQnVmZmVyO1xuIl19