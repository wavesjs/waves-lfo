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

var workerCode = '\nself.addEventListener(\'message\', function process(e) {\n  var blockSize = e.data.blockSize;\n  var sampleRate = e.data.sampleRate;\n  var buffer = new Float32Array(e.data.buffer);\n  var length = buffer.length;\n  var index = 0;\n\n  while (index + blockSize < length) {\n    var copySize = Math.min(length - index, blockSize);\n    var block = buffer.subarray(index, index + copySize);\n    var sendBlock = new Float32Array(block);\n\n    postMessage({ msg: \'process\', buffer: sendBlock.buffer, time: index / sampleRate }, [sendBlock.buffer]);\n\n    index += blockSize;\n  }\n\n  copySize = length - index;\n\n  if (copySize > 0) {\n    block = buffer.subarray(index, index + copySize);\n    sendBlock = new Float32Array(block);\n    postMessage({ msg: \'finalize\', buffer: block.buffer, time: index / sampleRate }, [block.buffer]);\n  }\n}, false)';

/**
 * AudioBuffer as source, sliced it in blocks through a worker
 */

var AudioInBuffer = (function (_AudioIn) {
  _inherits(AudioInBuffer, _AudioIn);

  function AudioInBuffer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, AudioInBuffer);

    _get(Object.getPrototypeOf(AudioInBuffer.prototype), 'constructor', this).call(this, options, {});

    if (!this.params.src || !(this.params.src instanceof AudioBuffer)) throw new Error('An AudioBuffer source must be given');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLWJ1ZmZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3VCQUFvQixZQUFZOzs7O0FBRWhDLElBQU0sVUFBVSw4MUJBeUJOLENBQUM7Ozs7OztJQUtVLGFBQWE7WUFBYixhQUFhOztBQUNyQixXQURRLGFBQWEsR0FDTjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBREwsYUFBYTs7QUFFOUIsK0JBRmlCLGFBQWEsNkNBRXhCLE9BQU8sRUFBRSxFQUFFLEVBQUU7O0FBRW5CLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxZQUFZLFdBQVcsQ0FBQSxBQUFDLEVBQy9ELE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQzs7QUFFekQsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FBQztBQUNoRSxRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztHQUNwQjs7ZUFUa0IsYUFBYTs7V0FXakIsMkJBQUc7QUFDaEIsVUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDcEQsVUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ2pGLFVBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO0tBQ2pFOzs7V0FFVSx1QkFBRztBQUNaLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0tBQ3RCOzs7V0FFSSxpQkFBRztBQUNOLFVBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNsQixVQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRWIsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNoRSxVQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFeEUsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQTs7QUFFM0QsVUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDdEIsa0JBQVUsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQjtBQUM5QyxpQkFBUyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUztBQUN0QyxjQUFNLEVBQUUsTUFBTTtPQUNmLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQ2Q7OztXQUVHLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUN4QixVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzs7QUFFbkIsVUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ2pCOzs7OztXQUdNLGlCQUFDLENBQUMsRUFBRTtBQUNULFVBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3ZCLFVBQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDOztBQUU3QixVQUFJLE1BQU0sRUFBRTtBQUNWLFlBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDekMsWUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN4QixZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZjs7QUFFRCxVQUFJLEdBQUcsS0FBSyxVQUFVLEVBQ3BCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUNuQjs7O1NBekRrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJlczYvc291cmNlcy9hdWRpby1pbi1idWZmZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXVkaW9JbiBmcm9tICcuL2F1ZGlvLWluJztcblxuY29uc3Qgd29ya2VyQ29kZSA9IGBcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIHByb2Nlc3MoZSkge1xuICB2YXIgYmxvY2tTaXplID0gZS5kYXRhLmJsb2NrU2l6ZTtcbiAgdmFyIHNhbXBsZVJhdGUgPSBlLmRhdGEuc2FtcGxlUmF0ZTtcbiAgdmFyIGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoZS5kYXRhLmJ1ZmZlcik7XG4gIHZhciBsZW5ndGggPSBidWZmZXIubGVuZ3RoO1xuICB2YXIgaW5kZXggPSAwO1xuXG4gIHdoaWxlIChpbmRleCArIGJsb2NrU2l6ZSA8IGxlbmd0aCkge1xuICAgIHZhciBjb3B5U2l6ZSA9IE1hdGgubWluKGxlbmd0aCAtIGluZGV4LCBibG9ja1NpemUpO1xuICAgIHZhciBibG9jayA9IGJ1ZmZlci5zdWJhcnJheShpbmRleCwgaW5kZXggKyBjb3B5U2l6ZSk7XG4gICAgdmFyIHNlbmRCbG9jayA9IG5ldyBGbG9hdDMyQXJyYXkoYmxvY2spO1xuXG4gICAgcG9zdE1lc3NhZ2UoeyBtc2c6ICdwcm9jZXNzJywgYnVmZmVyOiBzZW5kQmxvY2suYnVmZmVyLCB0aW1lOiBpbmRleCAvIHNhbXBsZVJhdGUgfSwgW3NlbmRCbG9jay5idWZmZXJdKTtcblxuICAgIGluZGV4ICs9IGJsb2NrU2l6ZTtcbiAgfVxuXG4gIGNvcHlTaXplID0gbGVuZ3RoIC0gaW5kZXg7XG5cbiAgaWYgKGNvcHlTaXplID4gMCkge1xuICAgIGJsb2NrID0gYnVmZmVyLnN1YmFycmF5KGluZGV4LCBpbmRleCArIGNvcHlTaXplKTtcbiAgICBzZW5kQmxvY2sgPSBuZXcgRmxvYXQzMkFycmF5KGJsb2NrKTtcbiAgICBwb3N0TWVzc2FnZSh7IG1zZzogJ2ZpbmFsaXplJywgYnVmZmVyOiBibG9jay5idWZmZXIsIHRpbWU6IGluZGV4IC8gc2FtcGxlUmF0ZSB9LCBbYmxvY2suYnVmZmVyXSk7XG4gIH1cbn0sIGZhbHNlKWA7XG5cbi8qKlxuICogQXVkaW9CdWZmZXIgYXMgc291cmNlLCBzbGljZWQgaXQgaW4gYmxvY2tzIHRocm91Z2ggYSB3b3JrZXJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXVkaW9JbkJ1ZmZlciBleHRlbmRzIEF1ZGlvSW4ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLCB7fSk7XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLnNyYyB8fCAhKHRoaXMucGFyYW1zLnNyYyBpbnN0YW5jZW9mIEF1ZGlvQnVmZmVyKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignQW4gQXVkaW9CdWZmZXIgc291cmNlIG11c3QgYmUgZ2l2ZW4nKTtcblxuICAgIHRoaXMuYmxvYiA9IG5ldyBCbG9iKFt3b3JrZXJDb2RlXSwgeyB0eXBlOiBcInRleHQvamF2YXNjcmlwdFwiIH0pO1xuICAgIHRoaXMud29ya2VyID0gbnVsbDtcbiAgfVxuXG4gIGNvbmZpZ3VyZVN0cmVhbSgpIHtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5mcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gdGhpcy5wYXJhbXMuc3JjLnNhbXBsZVJhdGUgLyB0aGlzLnBhcmFtcy5mcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSA9IHRoaXMucGFyYW1zLnNyYy5zYW1wbGVSYXRlO1xuICB9XG5cbiAgc2V0dXBTdHJlYW0oKSB7XG4gICAgdGhpcy5vdXRGcmFtZSA9IG51bGw7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICB0aGlzLndvcmtlciA9IG5ldyBXb3JrZXIod2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwodGhpcy5ibG9iKSk7XG4gICAgdGhpcy53b3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMucHJvY2Vzcy5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLnNyYy5nZXRDaGFubmVsRGF0YSh0aGlzLmNoYW5uZWwpLmJ1ZmZlclxuXG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgICAgc2FtcGxlUmF0ZTogdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSxcbiAgICAgIGJsb2NrU2l6ZTogdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplLFxuICAgICAgYnVmZmVyOiBidWZmZXIsXG4gICAgfSwgW2J1ZmZlcl0pO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLndvcmtlci50ZXJtaW5hdGUoKTtcbiAgICB0aGlzLndvcmtlciA9IG51bGw7XG5cbiAgICB0aGlzLmZpbmFsaXplKCk7XG4gIH1cblxuICAvLyB3b3JrZXIgY2FsbGJhY2tcbiAgcHJvY2VzcyhlKSB7XG4gICAgY29uc3QgbXNnID0gZS5kYXRhLm1zZztcbiAgICBjb25zdCBidWZmZXIgPSBlLmRhdGEuYnVmZmVyO1xuXG4gICAgaWYgKGJ1ZmZlcikge1xuICAgICAgdGhpcy5vdXRGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkoYnVmZmVyKTtcbiAgICAgIHRoaXMudGltZSA9IGUuZGF0YS50aW1lO1xuICAgICAgdGhpcy5vdXRwdXQoKTtcbiAgICB9XG5cbiAgICBpZiAobXNnID09PSAnZmluYWxpemUnKVxuICAgICAgdGhpcy5maW5hbGl6ZSgpO1xuICB9XG59XG4iXX0=