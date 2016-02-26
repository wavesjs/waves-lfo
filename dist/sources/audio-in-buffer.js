'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _audioIn = require('./audio-in');

var _audioIn2 = _interopRequireDefault(_audioIn);

var workerCode = '\nself.addEventListener(\'message\', function process(e) {\n  var blockSize = e.data.blockSize;\n  var sampleRate = e.data.sampleRate;\n  var buffer = new Float32Array(e.data.buffer);\n  var length = buffer.length;\n  var index = 0;\n\n  while (index + blockSize < length) {\n    var copySize = Math.min(length - index, blockSize);\n    var block = buffer.subarray(index, index + copySize);\n    var sendBlock = new Float32Array(block);\n\n    postMessage({ msg: \'process\', buffer: sendBlock.buffer, time: index / sampleRate }, [sendBlock.buffer]);\n\n    index += blockSize;\n  }\n\n  copySize = length - index;\n\n  if(copySize > 0) {\n    block = buffer.subarray(index, index + copySize);\n    sendBlock = new Float32Array(block);\n    postMessage({ msg: \'finalize\', buffer: block.buffer, time: index / sampleRate }, [block.buffer]);\n  }\n}, false)';

/**
 * AudioBuffer as source, sliced it in blocks through a worker
 */

var AudioInBuffer = (function (_AudioIn) {
  _inherits(AudioInBuffer, _AudioIn);

  function AudioInBuffer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, AudioInBuffer);

    _get(Object.getPrototypeOf(AudioInBuffer.prototype), 'constructor', this).call(this, options, {});

    if (!this.params.src || !(this.params.src instanceof AudioBuffer)) {
      throw new Error('An AudioBuffer source must be given');
    }

    this.blob = new Blob([workerCode], { type: "text/javascript" });
    this.worker = null;
  }

  _createClass(AudioInBuffer, [{
    key: 'configureStream',
    value: function configureStream() {
      this.streamParams.frameSize = this.params.frameSize;
      this.streamParams.frameRate = this.params.src.sampleRate / this.params.frameSize;
      this.streamParams.sourceSampleRate = this.params.src.sampleRate;
    }
  }, {
    key: 'setupStream',
    value: function setupStream() {
      this.outFrame = null;
    }
  }, {
    key: 'start',
    value: function start() {
      this.initialize();
      this.reset();

      this.worker = new Worker(window.URL.createObjectURL(this.blob));
      this.worker.addEventListener('message', this.process.bind(this), false);

      var buffer = this.src.getChannelData(this.channel).buffer;

      this.worker.postMessage({
        sampleRate: this.streamParams.sourceSampleRate,
        blockSize: this.streamParams.frameSize,
        buffer: buffer
      }, [buffer]);
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.worker.terminate();
      this.worker = null;

      this.finalize();
    }

    // worker callback
  }, {
    key: 'process',
    value: function process(e) {
      var msg = e.data.msg;
      var buffer = e.data.buffer;

      if (buffer) {
        this.outFrame = new Float32Array(buffer);
        this.time = e.data.time;
        this.output();
      }

      if (msg === 'finalize') this.finalize();
    }
  }]);

  return AudioInBuffer;
})(_audioIn2['default']);

exports['default'] = AudioInBuffer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLWJ1ZmZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3VCQUFvQixZQUFZOzs7O0FBRWhDLElBQU0sVUFBVSw2MUJBeUJOLENBQUM7Ozs7OztJQUtVLGFBQWE7WUFBYixhQUFhOztBQUNyQixXQURRLGFBQWEsR0FDTjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBREwsYUFBYTs7QUFFOUIsK0JBRmlCLGFBQWEsNkNBRXhCLE9BQU8sRUFBRSxFQUFFLEVBQUU7O0FBRW5CLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxZQUFZLFdBQVcsQ0FBQSxBQUFDLEVBQUU7QUFDakUsWUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0tBQ3hEOztBQUVELFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUM7QUFDaEUsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7R0FDcEI7O2VBVmtCLGFBQWE7O1dBWWpCLDJCQUFHO0FBQ2hCLFVBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3BELFVBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNqRixVQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztLQUNqRTs7O1dBRVUsdUJBQUc7QUFDWixVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztLQUN0Qjs7O1dBRUksaUJBQUc7QUFDTixVQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUViLFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDaEUsVUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRXhFLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUE7O0FBRTNELFVBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBQ3RCLGtCQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0I7QUFDOUMsaUJBQVMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVM7QUFDdEMsY0FBTSxFQUFFLE1BQU07T0FDZixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUNkOzs7V0FFRyxnQkFBRztBQUNMLFVBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDeEIsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7O0FBRW5CLFVBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUNqQjs7Ozs7V0FHTSxpQkFBQyxDQUFDLEVBQUU7QUFDVCxVQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUN2QixVQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7QUFFN0IsVUFBRyxNQUFNLEVBQUU7QUFDVCxZQUFJLENBQUMsUUFBUSxHQUFHLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3pDLFlBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDeEIsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2Y7O0FBRUQsVUFBRyxHQUFHLEtBQUssVUFBVSxFQUNuQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDbkI7OztTQTFEa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiZXM2L3NvdXJjZXMvYXVkaW8taW4tYnVmZmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEF1ZGlvSW4gZnJvbSAnLi9hdWRpby1pbic7XG5cbmNvbnN0IHdvcmtlckNvZGUgPSBgXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiBwcm9jZXNzKGUpIHtcbiAgdmFyIGJsb2NrU2l6ZSA9IGUuZGF0YS5ibG9ja1NpemU7XG4gIHZhciBzYW1wbGVSYXRlID0gZS5kYXRhLnNhbXBsZVJhdGU7XG4gIHZhciBidWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KGUuZGF0YS5idWZmZXIpO1xuICB2YXIgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gMDtcblxuICB3aGlsZSAoaW5kZXggKyBibG9ja1NpemUgPCBsZW5ndGgpIHtcbiAgICB2YXIgY29weVNpemUgPSBNYXRoLm1pbihsZW5ndGggLSBpbmRleCwgYmxvY2tTaXplKTtcbiAgICB2YXIgYmxvY2sgPSBidWZmZXIuc3ViYXJyYXkoaW5kZXgsIGluZGV4ICsgY29weVNpemUpO1xuICAgIHZhciBzZW5kQmxvY2sgPSBuZXcgRmxvYXQzMkFycmF5KGJsb2NrKTtcblxuICAgIHBvc3RNZXNzYWdlKHsgbXNnOiAncHJvY2VzcycsIGJ1ZmZlcjogc2VuZEJsb2NrLmJ1ZmZlciwgdGltZTogaW5kZXggLyBzYW1wbGVSYXRlIH0sIFtzZW5kQmxvY2suYnVmZmVyXSk7XG5cbiAgICBpbmRleCArPSBibG9ja1NpemU7XG4gIH1cblxuICBjb3B5U2l6ZSA9IGxlbmd0aCAtIGluZGV4O1xuXG4gIGlmKGNvcHlTaXplID4gMCkge1xuICAgIGJsb2NrID0gYnVmZmVyLnN1YmFycmF5KGluZGV4LCBpbmRleCArIGNvcHlTaXplKTtcbiAgICBzZW5kQmxvY2sgPSBuZXcgRmxvYXQzMkFycmF5KGJsb2NrKTtcbiAgICBwb3N0TWVzc2FnZSh7IG1zZzogJ2ZpbmFsaXplJywgYnVmZmVyOiBibG9jay5idWZmZXIsIHRpbWU6IGluZGV4IC8gc2FtcGxlUmF0ZSB9LCBbYmxvY2suYnVmZmVyXSk7XG4gIH1cbn0sIGZhbHNlKWA7XG5cbi8qKlxuICogQXVkaW9CdWZmZXIgYXMgc291cmNlLCBzbGljZWQgaXQgaW4gYmxvY2tzIHRocm91Z2ggYSB3b3JrZXJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXVkaW9JbkJ1ZmZlciBleHRlbmRzIEF1ZGlvSW4ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLCB7fSk7XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLnNyYyB8fCAhKHRoaXMucGFyYW1zLnNyYyBpbnN0YW5jZW9mIEF1ZGlvQnVmZmVyKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbiBBdWRpb0J1ZmZlciBzb3VyY2UgbXVzdCBiZSBnaXZlbicpO1xuICAgIH1cblxuICAgIHRoaXMuYmxvYiA9IG5ldyBCbG9iKFt3b3JrZXJDb2RlXSwgeyB0eXBlOiBcInRleHQvamF2YXNjcmlwdFwiIH0pO1xuICAgIHRoaXMud29ya2VyID0gbnVsbDtcbiAgfVxuXG4gIGNvbmZpZ3VyZVN0cmVhbSgpIHtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5mcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gdGhpcy5wYXJhbXMuc3JjLnNhbXBsZVJhdGUgLyB0aGlzLnBhcmFtcy5mcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSA9IHRoaXMucGFyYW1zLnNyYy5zYW1wbGVSYXRlO1xuICB9XG5cbiAgc2V0dXBTdHJlYW0oKSB7XG4gICAgdGhpcy5vdXRGcmFtZSA9IG51bGw7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICB0aGlzLndvcmtlciA9IG5ldyBXb3JrZXIod2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwodGhpcy5ibG9iKSk7XG4gICAgdGhpcy53b3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMucHJvY2Vzcy5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLnNyYy5nZXRDaGFubmVsRGF0YSh0aGlzLmNoYW5uZWwpLmJ1ZmZlclxuXG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgICAgc2FtcGxlUmF0ZTogdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSxcbiAgICAgIGJsb2NrU2l6ZTogdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplLFxuICAgICAgYnVmZmVyOiBidWZmZXIsXG4gICAgfSwgW2J1ZmZlcl0pO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLndvcmtlci50ZXJtaW5hdGUoKTtcbiAgICB0aGlzLndvcmtlciA9IG51bGw7XG5cbiAgICB0aGlzLmZpbmFsaXplKCk7XG4gIH1cblxuICAvLyB3b3JrZXIgY2FsbGJhY2tcbiAgcHJvY2VzcyhlKSB7XG4gICAgY29uc3QgbXNnID0gZS5kYXRhLm1zZztcbiAgICBjb25zdCBidWZmZXIgPSBlLmRhdGEuYnVmZmVyO1xuXG4gICAgaWYoYnVmZmVyKSB7XG4gICAgICB0aGlzLm91dEZyYW1lID0gbmV3IEZsb2F0MzJBcnJheShidWZmZXIpO1xuICAgICAgdGhpcy50aW1lID0gZS5kYXRhLnRpbWU7XG4gICAgICB0aGlzLm91dHB1dCgpO1xuICAgIH1cblxuICAgIGlmKG1zZyA9PT0gJ2ZpbmFsaXplJylcbiAgICAgIHRoaXMuZmluYWxpemUoKTtcbiAgfVxufVxuIl19