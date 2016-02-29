'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreBaseLfo = require('../core/base-lfo');

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var workerCode = '\nself.addEventListener(\'message\', function process(e) {\n  var blockSize = e.data.blockSize;\n  var bufferSource = e.data.buffer;\n  var buffer = new Float32Array(bufferSource);\n  var length = buffer.length;\n  var index = 0;\n\n  while (index < length) {\n    var copySize = Math.min(length - index, blockSize);\n    var block = buffer.subarray(index, index + copySize);\n    var sendBlock = new Float32Array(block);\n\n    postMessage({\n      command: \'process\',\n      index: index,\n      buffer: sendBlock.buffer,\n    }, [sendBlock.buffer]);\n\n    index += copySize;\n  }\n\n  postMessage({\n    command: \'finalize\',\n    index: index,\n    buffer: bufferSource,\n  }, [bufferSource]);\n}, false)';

var _PseudoWorker = (function () {
  function _PseudoWorker() {
    _classCallCheck(this, _PseudoWorker);

    this._callback = null;
  }

  /**
   * AudioBuffer as source, sliced it in blocks through a worker
   */

  _createClass(_PseudoWorker, [{
    key: 'postMessage',
    value: function postMessage(e) {
      var blockSize = e.blockSize;
      var bufferSource = e.buffer;
      var buffer = new Float32Array(bufferSource);
      var length = buffer.length;
      var that = this;
      var index = 0;

      (function slice() {
        if (index < length) {
          var copySize = Math.min(length - index, blockSize);
          var block = buffer.subarray(index, index + copySize);
          var sendBlock = new Float32Array(block);

          that._send({
            command: 'process',
            index: index,
            buffer: sendBlock.buffer
          });

          index += copySize;
          setTimeout(slice, 0);
        } else {
          that._send({
            command: 'finalize',
            index: index,
            buffer: buffer
          });
        }
      })();
    }
  }, {
    key: 'addListener',
    value: function addListener(callback) {
      this._callback = callback;
    }
  }, {
    key: '_send',
    value: function _send(msg) {
      this._callback({ data: msg });
    }
  }]);

  return _PseudoWorker;
})();

var AudioInBuffer = (function (_BaseLfo) {
  _inherits(AudioInBuffer, _BaseLfo);

  function AudioInBuffer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, AudioInBuffer);

    _get(Object.getPrototypeOf(AudioInBuffer.prototype), 'constructor', this).call(this, {
      frameSize: 512,
      channel: 0,
      ctx: null,
      buffer: null,
      useWorker: true
    }, options);

    this.buffer = this.params.buffer;
    this.endTime = 0;

    if (!this.params.ctx || !(this.params.ctx instanceof AudioContext)) throw new Error('Missing audio context parameter (ctx)');

    if (!this.params.buffer || !(this.params.buffer instanceof AudioBuffer)) throw new Error('Missing audio buffer parameter (buffer)');

    this.blob = new Blob([workerCode], { type: "text/javascript" });
    this.worker = null;

    this.process = this.process.bind(this);
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
        frameRate: this.buffer.sampleRate / this.params.frameSize,
        sourceSampleRate: this.buffer.sampleRate
      });
    }
  }, {
    key: 'start',
    value: function start() {
      this.initialize();
      this.reset();

      if (this.params.useWorker) {
        this.worker = new Worker(window.URL.createObjectURL(this.blob));
        this.worker.addEventListener('message', this.process, false);
      } else {
        this.worker = new _PseudoWorker();
        this.worker.addListener(this.process);
      }

      this.endTime = 0;

      var buffer = this.buffer.getChannelData(this.params.channel).buffer;
      var sendBuffer = buffer;

      if (this.params.useWorker) sendBuffer = buffer.slice(0);

      this.worker.postMessage({
        blockSize: this.streamParams.frameSize,
        buffer: sendBuffer
      }, [sendBuffer]);
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.worker.terminate();
      this.worker = null;

      this.finalize(this.endTime);
    }

    // worker callback
  }, {
    key: 'process',
    value: function process(e) {
      var sourceSampleRate = this.streamParams.sourceSampleRate;
      var command = e.data.command;
      var index = e.data.index;
      var buffer = e.data.buffer;
      var time = index / sourceSampleRate;

      if (command === 'finalize') {
        this.finalize(time);
      } else {
        this.outFrame = new Float32Array(buffer);
        this.time = time;
        this.output();

        console.log('buffer in process');

        this.endTime = this.time + this.outFrame.length / sourceSampleRate;
      }
    }
  }]);

  return AudioInBuffer;
})(_coreBaseLfo2['default']);

exports['default'] = AudioInBuffer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLWJ1ZmZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzJCQUFvQixrQkFBa0I7Ozs7QUFFdEMsSUFBTSxVQUFVLDZzQkEyQk4sQ0FBQzs7SUFHTCxhQUFhO0FBQ04sV0FEUCxhQUFhLEdBQ0g7MEJBRFYsYUFBYTs7QUFFZixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztHQUN2Qjs7Ozs7O2VBSEcsYUFBYTs7V0FLTixxQkFBQyxDQUFDLEVBQUU7QUFDYixVQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDO0FBQzlCLFVBQU0sWUFBWSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDOUIsVUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDOUMsVUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUM3QixVQUFNLElBQUksR0FBRyxJQUFJLENBQUM7QUFDbEIsVUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDOztBQUVkLEFBQUMsT0FBQSxTQUFTLEtBQUssR0FBRztBQUNoQixZQUFJLEtBQUssR0FBRyxNQUFNLEVBQUU7QUFDbEIsY0FBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ25ELGNBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQztBQUNyRCxjQUFJLFNBQVMsR0FBRyxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFeEMsY0FBSSxDQUFDLEtBQUssQ0FBQztBQUNULG1CQUFPLEVBQUUsU0FBUztBQUNsQixpQkFBSyxFQUFFLEtBQUs7QUFDWixrQkFBTSxFQUFFLFNBQVMsQ0FBQyxNQUFNO1dBQ3pCLENBQUMsQ0FBQzs7QUFFSCxlQUFLLElBQUksUUFB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QU8sS0FBSyxVQUFVLEVBQUU7QUFDMUIsWUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNyQixNQUFNO0FBQ0wsWUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6QyxZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7O0FBRWQsZUFBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUVqQyxZQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLENBQUM7T0FDcEU7S0FDRjs7O1NBekZrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJlczYvc291cmNlcy9hdWRpby1pbi1idWZmZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuY29uc3Qgd29ya2VyQ29kZSA9IGBcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIHByb2Nlc3MoZSkge1xuICB2YXIgYmxvY2tTaXplID0gZS5kYXRhLmJsb2NrU2l6ZTtcbiAgdmFyIGJ1ZmZlclNvdXJjZSA9IGUuZGF0YS5idWZmZXI7XG4gIHZhciBidWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KGJ1ZmZlclNvdXJjZSk7XG4gIHZhciBsZW5ndGggPSBidWZmZXIubGVuZ3RoO1xuICB2YXIgaW5kZXggPSAwO1xuXG4gIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBjb3B5U2l6ZSA9IE1hdGgubWluKGxlbmd0aCAtIGluZGV4LCBibG9ja1NpemUpO1xuICAgIHZhciBibG9jayA9IGJ1ZmZlci5zdWJhcnJheShpbmRleCwgaW5kZXggKyBjb3B5U2l6ZSk7XG4gICAgdmFyIHNlbmRCbG9jayA9IG5ldyBGbG9hdDMyQXJyYXkoYmxvY2spO1xuXG4gICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgY29tbWFuZDogJ3Byb2Nlc3MnLFxuICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgYnVmZmVyOiBzZW5kQmxvY2suYnVmZmVyLFxuICAgIH0sIFtzZW5kQmxvY2suYnVmZmVyXSk7XG5cbiAgICBpbmRleCArPSBjb3B5U2l6ZTtcbiAgfVxuXG4gIHBvc3RNZXNzYWdlKHtcbiAgICBjb21tYW5kOiAnZmluYWxpemUnLFxuICAgIGluZGV4OiBpbmRleCxcbiAgICBidWZmZXI6IGJ1ZmZlclNvdXJjZSxcbiAgfSwgW2J1ZmZlclNvdXJjZV0pO1xufSwgZmFsc2UpYDtcblxuXG5jbGFzcyBfUHNldWRvV29ya2VyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2sgPSBudWxsO1xuICB9XG5cbiAgcG9zdE1lc3NhZ2UoZSkge1xuICAgIGNvbnN0IGJsb2NrU2l6ZSA9IGUuYmxvY2tTaXplO1xuICAgIGNvbnN0IGJ1ZmZlclNvdXJjZSA9IGUuYnVmZmVyO1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoYnVmZmVyU291cmNlKTtcbiAgICBjb25zdCBsZW5ndGggPSBidWZmZXIubGVuZ3RoO1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIGxldCBpbmRleCA9IDA7XG5cbiAgICAoZnVuY3Rpb24gc2xpY2UoKSB7XG4gICAgICBpZiAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgdmFyIGNvcHlTaXplID0gTWF0aC5taW4obGVuZ3RoIC0gaW5kZXgsIGJsb2NrU2l6ZSk7XG4gICAgICAgIHZhciBibG9jayA9IGJ1ZmZlci5zdWJhcnJheShpbmRleCwgaW5kZXggKyBjb3B5U2l6ZSk7XG4gICAgICAgIHZhciBzZW5kQmxvY2sgPSBuZXcgRmxvYXQzMkFycmF5KGJsb2NrKTtcblxuICAgICAgICB0aGF0Ll9zZW5kKHtcbiAgICAgICAgICBjb21tYW5kOiAncHJvY2VzcycsXG4gICAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICAgIGJ1ZmZlcjogc2VuZEJsb2NrLmJ1ZmZlcixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaW5kZXggKz0gY29weVNpemU7XG4gICAgICAgIHNldFRpbWVvdXQoc2xpY2UsIDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhhdC5fc2VuZCh7XG4gICAgICAgICAgY29tbWFuZDogJ2ZpbmFsaXplJyxcbiAgICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgICAgYnVmZmVyOiBidWZmZXIsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0oKSk7XG4gIH1cblxuICBhZGRMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG4gIH1cblxuICBfc2VuZChtc2cpIHtcbiAgICB0aGlzLl9jYWxsYmFjayh7IGRhdGE6IG1zZyB9KTtcbiAgfVxufVxuXG4vKipcbiAqIEF1ZGlvQnVmZmVyIGFzIHNvdXJjZSwgc2xpY2VkIGl0IGluIGJsb2NrcyB0aHJvdWdoIGEgd29ya2VyXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1ZGlvSW5CdWZmZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoe1xuICAgICAgZnJhbWVTaXplOiA1MTIsXG4gICAgICBjaGFubmVsOiAwLFxuICAgICAgY3R4OiBudWxsLFxuICAgICAgYnVmZmVyOiBudWxsLFxuICAgICAgdXNlV29ya2VyOiB0cnVlLFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5idWZmZXIgPSB0aGlzLnBhcmFtcy5idWZmZXI7XG4gICAgdGhpcy5lbmRUaW1lID0gMDtcblxuICAgIGlmICghdGhpcy5wYXJhbXMuY3R4IHx8ICEodGhpcy5wYXJhbXMuY3R4IGluc3RhbmNlb2YgQXVkaW9Db250ZXh0KSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBhdWRpbyBjb250ZXh0IHBhcmFtZXRlciAoY3R4KScpO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5idWZmZXIgfHwgISh0aGlzLnBhcmFtcy5idWZmZXIgaW5zdGFuY2VvZiBBdWRpb0J1ZmZlcikpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgYXVkaW8gYnVmZmVyIHBhcmFtZXRlciAoYnVmZmVyKScpO1xuXG4gICAgdGhpcy5ibG9iID0gbmV3IEJsb2IoW3dvcmtlckNvZGVdLCB7IHR5cGU6IFwidGV4dC9qYXZhc2NyaXB0XCIgfSk7XG4gICAgdGhpcy53b3JrZXIgPSBudWxsO1xuXG4gICAgdGhpcy5wcm9jZXNzID0gdGhpcy5wcm9jZXNzLmJpbmQodGhpcyk7XG4gIH1cblxuICBzZXR1cFN0cmVhbSgpIHtcbiAgICB0aGlzLm91dEZyYW1lID0gbnVsbDtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSh7XG4gICAgICBmcmFtZVNpemU6IHRoaXMucGFyYW1zLmZyYW1lU2l6ZSxcbiAgICAgIGZyYW1lUmF0ZTogdGhpcy5idWZmZXIuc2FtcGxlUmF0ZSAvIHRoaXMucGFyYW1zLmZyYW1lU2l6ZSxcbiAgICAgIHNvdXJjZVNhbXBsZVJhdGU6IHRoaXMuYnVmZmVyLnNhbXBsZVJhdGUsXG4gICAgfSk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMudXNlV29ya2VyKSB7XG4gICAgICB0aGlzLndvcmtlciA9IG5ldyBXb3JrZXIod2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwodGhpcy5ibG9iKSk7XG4gICAgICB0aGlzLndvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgdGhpcy5wcm9jZXNzLCBmYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMud29ya2VyID0gbmV3IF9Qc2V1ZG9Xb3JrZXIoKTtcbiAgICAgIHRoaXMud29ya2VyLmFkZExpc3RlbmVyKHRoaXMucHJvY2Vzcyk7XG4gICAgfVxuXG4gICAgdGhpcy5lbmRUaW1lID0gMDtcblxuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuYnVmZmVyLmdldENoYW5uZWxEYXRhKHRoaXMucGFyYW1zLmNoYW5uZWwpLmJ1ZmZlcjtcbiAgICBsZXQgc2VuZEJ1ZmZlciA9IGJ1ZmZlcjtcblxuICAgIGlmICh0aGlzLnBhcmFtcy51c2VXb3JrZXIpXG4gICAgICBzZW5kQnVmZmVyID0gYnVmZmVyLnNsaWNlKDApO1xuXG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgICAgYmxvY2tTaXplOiB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUsXG4gICAgICBidWZmZXI6IHNlbmRCdWZmZXIsXG4gICAgfSwgW3NlbmRCdWZmZXJdKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy53b3JrZXIudGVybWluYXRlKCk7XG4gICAgdGhpcy53b3JrZXIgPSBudWxsO1xuXG4gICAgdGhpcy5maW5hbGl6ZSh0aGlzLmVuZFRpbWUpO1xuICB9XG5cbiAgLy8gd29ya2VyIGNhbGxiYWNrXG4gIHByb2Nlc3MoZSkge1xuICAgIGNvbnN0IHNvdXJjZVNhbXBsZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuICAgIGNvbnN0IGNvbW1hbmQgPSBlLmRhdGEuY29tbWFuZDtcbiAgICBjb25zdCBpbmRleCA9IGUuZGF0YS5pbmRleDtcbiAgICBjb25zdCBidWZmZXIgPSBlLmRhdGEuYnVmZmVyO1xuICAgIGNvbnN0IHRpbWUgPSBpbmRleCAvIHNvdXJjZVNhbXBsZVJhdGU7XG5cbiAgICBpZiAoY29tbWFuZCA9PT0gJ2ZpbmFsaXplJykge1xuICAgICAgdGhpcy5maW5hbGl6ZSh0aW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vdXRGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkoYnVmZmVyKTtcbiAgICAgIHRoaXMudGltZSA9IHRpbWU7XG4gICAgICB0aGlzLm91dHB1dCgpO1xuXG4gICAgICBjb25zb2xlLmxvZygnYnVmZmVyIGluIHByb2Nlc3MnKTtcblxuICAgICAgdGhpcy5lbmRUaW1lID0gdGhpcy50aW1lICsgdGhpcy5vdXRGcmFtZS5sZW5ndGggLyBzb3VyY2VTYW1wbGVSYXRlO1xuICAgIH1cbiAgfVxufVxuIl19