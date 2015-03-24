"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("./audio-in");

var AudioIn = _require.AudioIn;

var worker = "self.addEventListener(\"message\", function process(e) {      var message = e.data;                                                   var blockSize = message.options.blockSize;                              var sampleRate = message.options.sampleRate;                            var buffer = message.data;                                              var length = buffer.length;                                             var block = new Float32Array(blockSize);                                                                                                        for (var index = 0; index < length; index += blockSize) {                 var copySize = length - index;                                                                                                                  if (copySize > blockSize) { copySize = blockSize; }                                                                                             var bufferSegment = buffer.subarray(index, index + copySize);           block.set(bufferSegment, 0);                                                                                                                    /* no need for that, handled natively by Float32Array */                /* for (var i = copySize; i < blockSize; i++) { block[i] = 0; } */                                                                              postMessage({ block: block, time: index / sampleRate });              }                                                                     }, false);".replace(/\s+/g, " ");

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
        this.worker.postMessage({
          options: {
            sampleRate: this.streamParams.blockSampleRate,
            blockSize: this.streamParams.frameSize
          },
          data: this.src.getChannelData(this.channel)
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLWJ1ZmZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7ZUFFa0IsT0FBTyxDQUFDLFlBQVksQ0FBQzs7SUFBakMsT0FBTyxZQUFQLE9BQU87O0FBRWIsSUFBSSxNQUFNLEdBQUcsdytDQXFCRixDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7Ozs7O0lBSTNCLGFBQWE7QUFFTixXQUZQLGFBQWEsR0FFUztRQUFkLE9BQU8sZ0NBQUcsRUFBRTs7MEJBRnBCLGFBQWE7O0FBR2YscUNBSEUsYUFBYSw2Q0FHVCxPQUFPLEVBQUU7O0FBRWYsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFlBQVksV0FBVyxDQUFBLEFBQUMsRUFBRTtBQUNqRSxZQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7S0FDeEQ7O0FBRUQsUUFBSSxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQztBQUM5QixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQzs7O0FBR25CLFFBQUksSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO0FBQzNELFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFM0QsUUFBSSxDQUFDLFdBQVcsQ0FBQztBQUNmLGVBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7QUFDaEMsZUFBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUztBQUN0RCxxQkFBZSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVU7S0FDNUMsQ0FBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQ3pFOztZQXZCRyxhQUFhOztlQUFiLGFBQWE7QUF5QmpCLFNBQUs7YUFBQSxpQkFBRztBQUNOLFlBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBQ3RCLGlCQUFPLEVBQUU7QUFDUCxzQkFBVSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZTtBQUM3QyxxQkFBUyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUztXQUN2QztBQUNELGNBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQzVDLENBQUMsQ0FBQztPQUNKOztBQUVELFdBQU87YUFBQSxpQkFBQyxDQUFDLEVBQUU7QUFDVCxZQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQzdCLFlBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7O0FBRXhCLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNmOzs7O1NBeENHLGFBQWE7R0FBUyxPQUFPOzs7Ozs7O0FBZ0RuQyxNQUFNLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyIsImZpbGUiOiJlczYvc291cmNlcy9hdWRpby1pbi1idWZmZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIHsgQXVkaW9JbiB9ID0gcmVxdWlyZSgnLi9hdWRpby1pbicpO1xuXG52YXIgd29ya2VyID0gJ3NlbGYuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZnVuY3Rpb24gcHJvY2VzcyhlKSB7ICAgIFxcXG4gIHZhciBtZXNzYWdlID0gZS5kYXRhOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXFxuICB2YXIgYmxvY2tTaXplID0gbWVzc2FnZS5vcHRpb25zLmJsb2NrU2l6ZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxcbiAgdmFyIHNhbXBsZVJhdGUgPSBtZXNzYWdlLm9wdGlvbnMuc2FtcGxlUmF0ZTsgICAgICAgICAgICAgICAgICAgICAgICAgIFxcXG4gIHZhciBidWZmZXIgPSBtZXNzYWdlLmRhdGE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXFxuICB2YXIgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxcbiAgdmFyIGJsb2NrID0gbmV3IEZsb2F0MzJBcnJheShibG9ja1NpemUpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXFxuICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSBibG9ja1NpemUpIHsgICAgICAgICAgICAgXFxcbiAgICB2YXIgY29weVNpemUgPSBsZW5ndGggLSBpbmRleDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXFxuICAgIGlmIChjb3B5U2l6ZSA+IGJsb2NrU2l6ZSkgeyBjb3B5U2l6ZSA9IGJsb2NrU2l6ZTsgfSAgICAgICAgICAgICAgICAgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcXG4gICAgdmFyIGJ1ZmZlclNlZ21lbnQgPSBidWZmZXIuc3ViYXJyYXkoaW5kZXgsIGluZGV4ICsgY29weVNpemUpOyAgICAgICBcXFxuICAgIGJsb2NrLnNldChidWZmZXJTZWdtZW50LCAwKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcXG4gICAgLyogbm8gbmVlZCBmb3IgdGhhdCwgaGFuZGxlZCBuYXRpdmVseSBieSBGbG9hdDMyQXJyYXkgKi8gICAgICAgICAgICBcXFxuICAgIC8qIGZvciAodmFyIGkgPSBjb3B5U2l6ZTsgaSA8IGJsb2NrU2l6ZTsgaSsrKSB7IGJsb2NrW2ldID0gMDsgfSAqLyAgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcXG4gICAgcG9zdE1lc3NhZ2UoeyBibG9jazogYmxvY2ssIHRpbWU6IGluZGV4IC8gc2FtcGxlUmF0ZSB9KTsgICAgICAgICAgICBcXFxuICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxcbn0sIGZhbHNlKTsnLnJlcGxhY2UoL1xccysvZywgJyAnKTtcblxuLy8gQXVkaW9CdWZmZXIgYXMgc291cmNlXG4vLyBzbGljZSBpdCBpbiBibG9ja3MgdGhyb3VnaCBhIHdvcmtlclxuY2xhc3MgQXVkaW9JbkJ1ZmZlciBleHRlbmRzIEF1ZGlvSW4ge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5zcmMgfHwgISh0aGlzLnBhcmFtcy5zcmMgaW5zdGFuY2VvZiBBdWRpb0J1ZmZlcikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQW4gQXVkaW9CdWZmZXIgc291cmNlIG11c3QgYmUgZ2l2ZW4nKTtcbiAgICB9XG5cbiAgICB0aGlzLnR5cGUgPSAnYXVkaW8taW4tYnVmZmVyJztcbiAgICB0aGlzLm1ldGFEYXRhID0ge307XG5cbiAgICAvLyBpbml0IHdvcmtlclxuICAgIHZhciBibG9iID0gbmV3IEJsb2IoW3dvcmtlcl0sIHsgdHlwZTogXCJ0ZXh0L2phdmFzY3JpcHRcIiB9KTtcbiAgICB0aGlzLndvcmtlciA9IG5ldyBXb3JrZXIod2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYikpO1xuXG4gICAgdGhpcy5zZXR1cFN0cmVhbSh7XG4gICAgICBmcmFtZVNpemU6IHRoaXMucGFyYW1zLmZyYW1lU2l6ZSxcbiAgICAgIGZyYW1lUmF0ZTogdGhpcy5wYXJhbXMuc3JjLnNhbXBsZVJhdGUgLyB0aGlzLmZyYW1lU2l6ZSxcbiAgICAgIGJsb2NrU2FtcGxlUmF0ZTogdGhpcy5wYXJhbXMuc3JjLnNhbXBsZVJhdGVcbiAgICB9KTtcblxuICAgIHRoaXMud29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCB0aGlzLnByb2Nlc3MuYmluZCh0aGlzKSwgZmFsc2UpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBzYW1wbGVSYXRlOiB0aGlzLnN0cmVhbVBhcmFtcy5ibG9ja1NhbXBsZVJhdGUsXG4gICAgICAgIGJsb2NrU2l6ZTogdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplXG4gICAgICB9LFxuICAgICAgZGF0YTogdGhpcy5zcmMuZ2V0Q2hhbm5lbERhdGEodGhpcy5jaGFubmVsKVxuICAgIH0pO1xuICB9XG5cbiAgcHJvY2VzcyhlKSB7XG4gICAgdGhpcy5vdXRGcmFtZSA9IGUuZGF0YS5ibG9jaztcbiAgICB0aGlzLnRpbWUgPSBlLmRhdGEudGltZTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cblxuLy8gZnVuY3Rpb24gZmFjdG9yeShvcHRpb25zKSB7XG4vLyAgIHJldHVybiBuZXcgQXVkaW9JbkJ1ZmZlcihvcHRpb25zKTtcbi8vIH1cbi8vIGZhY3RvcnkuQXVkaW9JbkJ1ZmZlciA9IEF1ZGlvSW5CdWZmZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gQXVkaW9JbkJ1ZmZlcjsiXX0=