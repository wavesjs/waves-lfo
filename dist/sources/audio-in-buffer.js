'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreBaseLfo = require('../core/base-lfo');

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var workerCode = '\nself.addEventListener(\'message\', function process(e) {\n  var blockSize = e.data.blockSize;\n  var sampleRate = e.data.sampleRate;\n  var buffer = new Float32Array(e.data.buffer);\n  var length = buffer.length;\n  var index = 0;\n\n  while (index + blockSize < length) {\n    var copySize = Math.min(length - index, blockSize);\n    var block = buffer.subarray(index, index + copySize);\n    var sendBlock = new Float32Array(block);\n\n    postMessage({ msg: \'process\', buffer: sendBlock.buffer, time: index / sampleRate }, [sendBlock.buffer]);\n\n    index += blockSize;\n  }\n\n  copySize = length - index;\n\n  if(copySize > 0) {\n    block = buffer.subarray(index, index + copySize);\n    sendBlock = new Float32Array(block);\n    postMessage({ msg: \'finalize\', buffer: block.buffer, time: index / sampleRate }, [block.buffer]);\n  }\n}, false)';

/**
 * AudioBuffer as source, sliced it in blocks through a worker
 */

var AudioInBuffer = (function (_BaseLfo) {
  _inherits(AudioInBuffer, _BaseLfo);

  function AudioInBuffer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, AudioInBuffer);

    _get(Object.getPrototypeOf(AudioInBuffer.prototype), 'constructor', this).call(this, {
      frameSize: 512,
      channel: 0,
      ctx: null,
      buffer: null
    }, options);

    if (!this.params.ctx || !(this.params.ctx instanceof AudioContext)) {
      throw new Error('Missing audio context parameter (ctx)');
    }

    if (!this.params.buffer || !(this.params.buffer instanceof AudioBuffer)) {
      throw new Error('Missing audio buffer parameter (buffer)');
    }

    this.blob = new Blob([workerCode], { type: "text/javascript" });
    this.worker = null;
  }

  _createClass(AudioInBuffer, [{
    key: 'setupStream',
    value: function setupStream() {
      this.outFrame = null;
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(AudioInBuffer.prototype), 'initialize', this).call(this, {
        frameSize: this.params.frameSize,
        frameRate: this.params.buffer.sampleRate / this.params.frameSize,
        sourceSampleRate: this.params.buffer.sampleRate
      });
    }
  }, {
    key: 'start',
    value: function start() {
      this.initialize();
      this.reset();

      this.worker = new Worker(window.URL.createObjectURL(this.blob));
      this.worker.addEventListener('message', this.process.bind(this), false);

      var buffer = this.params.buffer.getChannelData(this.params.channel).buffer;

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
})(_coreBaseLfo2['default']);

exports['default'] = AudioInBuffer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLWJ1ZmZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzJCQUFvQixrQkFBa0I7Ozs7QUFFdEMsSUFBTSxVQUFVLDYxQkF5Qk4sQ0FBQzs7Ozs7O0lBS1UsYUFBYTtZQUFiLGFBQWE7O0FBQ3JCLFdBRFEsYUFBYSxHQUNOO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFETCxhQUFhOztBQUU5QiwrQkFGaUIsYUFBYSw2Q0FFeEI7QUFDSixlQUFTLEVBQUUsR0FBRztBQUNkLGFBQU8sRUFBRSxDQUFDO0FBQ1YsU0FBRyxFQUFFLElBQUk7QUFDVCxZQUFNLEVBQUUsSUFBSTtLQUNiLEVBQUUsT0FBTyxFQUFFOztBQUVaLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxZQUFZLFlBQVksQ0FBQSxBQUFDLEVBQUU7QUFDbEUsWUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO0tBQzFEOztBQUVELFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxZQUFZLFdBQVcsQ0FBQSxBQUFDLEVBQUU7QUFDdkUsWUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0tBQzVEOztBQUVELFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUM7QUFDaEUsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7R0FDcEI7O2VBbkJrQixhQUFhOztXQXFCckIsdUJBQUc7QUFDWixVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztLQUN0Qjs7O1dBRVMsc0JBQUc7QUFDWCxpQ0ExQmlCLGFBQWEsNENBMEJiO0FBQ2YsaUJBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7QUFDaEMsaUJBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTO0FBQ2hFLHdCQUFnQixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVU7T0FDaEQsRUFBRTtLQUNKOzs7V0FFSSxpQkFBRztBQUNOLFVBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNsQixVQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRWIsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNoRSxVQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFeEUsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFBOztBQUU1RSxVQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztBQUN0QixrQkFBVSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCO0FBQzlDLGlCQUFTLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTO0FBQ3RDLGNBQU0sRUFBRSxNQUFNO09BQ2YsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDZDs7O1dBRUcsZ0JBQUc7QUFDTCxVQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ3hCLFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDOztBQUVuQixVQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDakI7Ozs7O1dBR00saUJBQUMsQ0FBQyxFQUFFO0FBQ1QsVUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDdkIsVUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7O0FBRTdCLFVBQUcsTUFBTSxFQUFFO0FBQ1QsWUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6QyxZQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3hCLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNmOztBQUVELFVBQUcsR0FBRyxLQUFLLFVBQVUsRUFDbkIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ25COzs7U0FyRWtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6ImVzNi9zb3VyY2VzL2F1ZGlvLWluLWJ1ZmZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG5jb25zdCB3b3JrZXJDb2RlID0gYFxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gcHJvY2VzcyhlKSB7XG4gIHZhciBibG9ja1NpemUgPSBlLmRhdGEuYmxvY2tTaXplO1xuICB2YXIgc2FtcGxlUmF0ZSA9IGUuZGF0YS5zYW1wbGVSYXRlO1xuICB2YXIgYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShlLmRhdGEuYnVmZmVyKTtcbiAgdmFyIGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG4gIHZhciBpbmRleCA9IDA7XG5cbiAgd2hpbGUgKGluZGV4ICsgYmxvY2tTaXplIDwgbGVuZ3RoKSB7XG4gICAgdmFyIGNvcHlTaXplID0gTWF0aC5taW4obGVuZ3RoIC0gaW5kZXgsIGJsb2NrU2l6ZSk7XG4gICAgdmFyIGJsb2NrID0gYnVmZmVyLnN1YmFycmF5KGluZGV4LCBpbmRleCArIGNvcHlTaXplKTtcbiAgICB2YXIgc2VuZEJsb2NrID0gbmV3IEZsb2F0MzJBcnJheShibG9jayk7XG5cbiAgICBwb3N0TWVzc2FnZSh7IG1zZzogJ3Byb2Nlc3MnLCBidWZmZXI6IHNlbmRCbG9jay5idWZmZXIsIHRpbWU6IGluZGV4IC8gc2FtcGxlUmF0ZSB9LCBbc2VuZEJsb2NrLmJ1ZmZlcl0pO1xuXG4gICAgaW5kZXggKz0gYmxvY2tTaXplO1xuICB9XG5cbiAgY29weVNpemUgPSBsZW5ndGggLSBpbmRleDtcblxuICBpZihjb3B5U2l6ZSA+IDApIHtcbiAgICBibG9jayA9IGJ1ZmZlci5zdWJhcnJheShpbmRleCwgaW5kZXggKyBjb3B5U2l6ZSk7XG4gICAgc2VuZEJsb2NrID0gbmV3IEZsb2F0MzJBcnJheShibG9jayk7XG4gICAgcG9zdE1lc3NhZ2UoeyBtc2c6ICdmaW5hbGl6ZScsIGJ1ZmZlcjogYmxvY2suYnVmZmVyLCB0aW1lOiBpbmRleCAvIHNhbXBsZVJhdGUgfSwgW2Jsb2NrLmJ1ZmZlcl0pO1xuICB9XG59LCBmYWxzZSlgO1xuXG4vKipcbiAqIEF1ZGlvQnVmZmVyIGFzIHNvdXJjZSwgc2xpY2VkIGl0IGluIGJsb2NrcyB0aHJvdWdoIGEgd29ya2VyXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1ZGlvSW5CdWZmZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoe1xuICAgICAgZnJhbWVTaXplOiA1MTIsXG4gICAgICBjaGFubmVsOiAwLFxuICAgICAgY3R4OiBudWxsLFxuICAgICAgYnVmZmVyOiBudWxsLFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5jdHggfHwgISh0aGlzLnBhcmFtcy5jdHggaW5zdGFuY2VvZiBBdWRpb0NvbnRleHQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgYXVkaW8gY29udGV4dCBwYXJhbWV0ZXIgKGN0eCknKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLmJ1ZmZlciB8fCAhKHRoaXMucGFyYW1zLmJ1ZmZlciBpbnN0YW5jZW9mIEF1ZGlvQnVmZmVyKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGF1ZGlvIGJ1ZmZlciBwYXJhbWV0ZXIgKGJ1ZmZlciknKTtcbiAgICB9XG5cbiAgICB0aGlzLmJsb2IgPSBuZXcgQmxvYihbd29ya2VyQ29kZV0sIHsgdHlwZTogXCJ0ZXh0L2phdmFzY3JpcHRcIiB9KTtcbiAgICB0aGlzLndvcmtlciA9IG51bGw7XG4gIH1cblxuICBzZXR1cFN0cmVhbSgpIHtcbiAgICB0aGlzLm91dEZyYW1lID0gbnVsbDtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSh7XG4gICAgICBmcmFtZVNpemU6IHRoaXMucGFyYW1zLmZyYW1lU2l6ZSxcbiAgICAgIGZyYW1lUmF0ZTogdGhpcy5wYXJhbXMuYnVmZmVyLnNhbXBsZVJhdGUgLyB0aGlzLnBhcmFtcy5mcmFtZVNpemUsXG4gICAgICBzb3VyY2VTYW1wbGVSYXRlOiB0aGlzLnBhcmFtcy5idWZmZXIuc2FtcGxlUmF0ZSxcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMucmVzZXQoKTtcblxuICAgIHRoaXMud29ya2VyID0gbmV3IFdvcmtlcih3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTCh0aGlzLmJsb2IpKTtcbiAgICB0aGlzLndvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgdGhpcy5wcm9jZXNzLmJpbmQodGhpcyksIGZhbHNlKTtcblxuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMucGFyYW1zLmJ1ZmZlci5nZXRDaGFubmVsRGF0YSh0aGlzLnBhcmFtcy5jaGFubmVsKS5idWZmZXJcblxuICAgIHRoaXMud29ya2VyLnBvc3RNZXNzYWdlKHtcbiAgICAgIHNhbXBsZVJhdGU6IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUsXG4gICAgICBibG9ja1NpemU6IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSxcbiAgICAgIGJ1ZmZlcjogYnVmZmVyLFxuICAgIH0sIFtidWZmZXJdKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy53b3JrZXIudGVybWluYXRlKCk7XG4gICAgdGhpcy53b3JrZXIgPSBudWxsO1xuXG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuICB9XG5cbiAgLy8gd29ya2VyIGNhbGxiYWNrXG4gIHByb2Nlc3MoZSkge1xuICAgIGNvbnN0IG1zZyA9IGUuZGF0YS5tc2c7XG4gICAgY29uc3QgYnVmZmVyID0gZS5kYXRhLmJ1ZmZlcjtcblxuICAgIGlmKGJ1ZmZlcikge1xuICAgICAgdGhpcy5vdXRGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkoYnVmZmVyKTtcbiAgICAgIHRoaXMudGltZSA9IGUuZGF0YS50aW1lO1xuICAgICAgdGhpcy5vdXRwdXQoKTtcbiAgICB9XG5cbiAgICBpZihtc2cgPT09ICdmaW5hbGl6ZScpXG4gICAgICB0aGlzLmZpbmFsaXplKCk7XG4gIH1cbn1cbiJdfQ==