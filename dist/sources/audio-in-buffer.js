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

var workerCode = '\nself.addEventListener(\'message\', function process(e) {\n  var blockSize = e.data.blockSize;\n  var buffer = new Float32Array(e.data.buffer);\n  var length = buffer.length;\n  var index = 0;\n\n  while (index < length) {\n    var copySize = Math.min(length - index, blockSize);\n    var block = buffer.subarray(index, index + copySize);\n    var sendBlock = new Float32Array(block);\n\n    postMessage({\n      command: \'process\',\n      index: index,\n      buffer: sendBlock.buffer,\n    }, [sendBlock.buffer]);\n\n    index += copySize;\n  }\n\n  postMessage({\n    command: \'finalize\',\n    index: index,\n  });\n}, false)';

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

    if (!this.params.ctx || !(this.params.ctx instanceof AudioContext)) throw new Error('Missing audio context parameter (ctx)');

    if (!this.params.buffer || !(this.params.buffer instanceof AudioBuffer)) throw new Error('Missing audio buffer parameter (buffer)');

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
      var sourceSampleRate = this.streamParams.sourceSampleRate;
      var command = e.data.command;
      var index = e.data.index;
      var time = index / sourceSampleRate;

      if (command === 'finalize') {
        this.finalize(time);
      } else {
        var buffer = e.data.buffer;
        this.outFrame = new Float32Array(buffer);
        this.time = time;
        this.output();
      }
    }
  }]);

  return AudioInBuffer;
})(_coreBaseLfo2['default']);

exports['default'] = AudioInBuffer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLWJ1ZmZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzJCQUFvQixrQkFBa0I7Ozs7QUFFdEMsSUFBTSxVQUFVLDhuQkF5Qk4sQ0FBQzs7Ozs7O0lBS1UsYUFBYTtZQUFiLGFBQWE7O0FBQ3JCLFdBRFEsYUFBYSxHQUNOO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFETCxhQUFhOztBQUU5QiwrQkFGaUIsYUFBYSw2Q0FFeEI7QUFDSixlQUFTLEVBQUUsR0FBRztBQUNkLGFBQU8sRUFBRSxDQUFDO0FBQ1YsU0FBRyxFQUFFLElBQUk7QUFDVCxZQUFNLEVBQUUsSUFBSTtLQUNiLEVBQUUsT0FBTyxFQUFFOztBQUVaLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxZQUFZLFlBQVksQ0FBQSxBQUFDLEVBQ2hFLE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQzs7QUFFM0QsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLFlBQVksV0FBVyxDQUFBLEFBQUMsRUFDckUsTUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDOztBQUU3RCxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO0FBQ2hFLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0dBQ3BCOztlQWpCa0IsYUFBYTs7V0FtQnJCLHVCQUFHO0FBQ1osVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7S0FDdEI7OztXQUVTLHNCQUFHO0FBQ1gsaUNBeEJpQixhQUFhLDRDQXdCYjtBQUNmLGlCQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTO0FBQ2hDLGlCQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUztBQUNoRSx3QkFBZ0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVO09BQ2hELEVBQUU7S0FDSjs7O1dBRUksaUJBQUc7QUFDTixVQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUViLFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDaEUsVUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRXhFLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQTs7QUFFNUUsVUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDdEIsaUJBQVMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVM7QUFDdEMsY0FBTSxFQUFFLE1BQU07T0FDZixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUNkOzs7V0FFRyxnQkFBRztBQUNMLFVBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDeEIsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7O0FBRW5CLFVBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUNqQjs7Ozs7V0FHTSxpQkFBQyxDQUFDLEVBQUU7QUFDVCxVQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUM7QUFDNUQsVUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDL0IsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDM0IsVUFBTSxJQUFJLEdBQUcsS0FBSyxHQUFHLGdCQUFnQixDQUFDOztBQUV0QyxVQUFJLE9BQU8sS0FBSyxVQUFVLEVBQUU7QUFDMUIsWUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNyQixNQUFNO0FBQ0wsWUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDN0IsWUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6QyxZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZjtLQUNGOzs7U0FwRWtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6ImVzNi9zb3VyY2VzL2F1ZGlvLWluLWJ1ZmZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG5jb25zdCB3b3JrZXJDb2RlID0gYFxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gcHJvY2VzcyhlKSB7XG4gIHZhciBibG9ja1NpemUgPSBlLmRhdGEuYmxvY2tTaXplO1xuICB2YXIgYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShlLmRhdGEuYnVmZmVyKTtcbiAgdmFyIGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG4gIHZhciBpbmRleCA9IDA7XG5cbiAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGNvcHlTaXplID0gTWF0aC5taW4obGVuZ3RoIC0gaW5kZXgsIGJsb2NrU2l6ZSk7XG4gICAgdmFyIGJsb2NrID0gYnVmZmVyLnN1YmFycmF5KGluZGV4LCBpbmRleCArIGNvcHlTaXplKTtcbiAgICB2YXIgc2VuZEJsb2NrID0gbmV3IEZsb2F0MzJBcnJheShibG9jayk7XG5cbiAgICBwb3N0TWVzc2FnZSh7XG4gICAgICBjb21tYW5kOiAncHJvY2VzcycsXG4gICAgICBpbmRleDogaW5kZXgsXG4gICAgICBidWZmZXI6IHNlbmRCbG9jay5idWZmZXIsXG4gICAgfSwgW3NlbmRCbG9jay5idWZmZXJdKTtcblxuICAgIGluZGV4ICs9IGNvcHlTaXplO1xuICB9XG5cbiAgcG9zdE1lc3NhZ2Uoe1xuICAgIGNvbW1hbmQ6ICdmaW5hbGl6ZScsXG4gICAgaW5kZXg6IGluZGV4LFxuICB9KTtcbn0sIGZhbHNlKWA7XG5cbi8qKlxuICogQXVkaW9CdWZmZXIgYXMgc291cmNlLCBzbGljZWQgaXQgaW4gYmxvY2tzIHRocm91Z2ggYSB3b3JrZXJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXVkaW9JbkJ1ZmZlciBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcih7XG4gICAgICBmcmFtZVNpemU6IDUxMixcbiAgICAgIGNoYW5uZWw6IDAsXG4gICAgICBjdHg6IG51bGwsXG4gICAgICBidWZmZXI6IG51bGwsXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLmN0eCB8fCAhKHRoaXMucGFyYW1zLmN0eCBpbnN0YW5jZW9mIEF1ZGlvQ29udGV4dCkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgYXVkaW8gY29udGV4dCBwYXJhbWV0ZXIgKGN0eCknKTtcblxuICAgIGlmICghdGhpcy5wYXJhbXMuYnVmZmVyIHx8ICEodGhpcy5wYXJhbXMuYnVmZmVyIGluc3RhbmNlb2YgQXVkaW9CdWZmZXIpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGF1ZGlvIGJ1ZmZlciBwYXJhbWV0ZXIgKGJ1ZmZlciknKTtcblxuICAgIHRoaXMuYmxvYiA9IG5ldyBCbG9iKFt3b3JrZXJDb2RlXSwgeyB0eXBlOiBcInRleHQvamF2YXNjcmlwdFwiIH0pO1xuICAgIHRoaXMud29ya2VyID0gbnVsbDtcbiAgfVxuXG4gIHNldHVwU3RyZWFtKCkge1xuICAgIHRoaXMub3V0RnJhbWUgPSBudWxsO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKHtcbiAgICAgIGZyYW1lU2l6ZTogdGhpcy5wYXJhbXMuZnJhbWVTaXplLFxuICAgICAgZnJhbWVSYXRlOiB0aGlzLnBhcmFtcy5idWZmZXIuc2FtcGxlUmF0ZSAvIHRoaXMucGFyYW1zLmZyYW1lU2l6ZSxcbiAgICAgIHNvdXJjZVNhbXBsZVJhdGU6IHRoaXMucGFyYW1zLmJ1ZmZlci5zYW1wbGVSYXRlLFxuICAgIH0pO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5yZXNldCgpO1xuXG4gICAgdGhpcy53b3JrZXIgPSBuZXcgV29ya2VyKHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKHRoaXMuYmxvYikpO1xuICAgIHRoaXMud29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCB0aGlzLnByb2Nlc3MuYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5wYXJhbXMuYnVmZmVyLmdldENoYW5uZWxEYXRhKHRoaXMucGFyYW1zLmNoYW5uZWwpLmJ1ZmZlclxuXG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgICAgYmxvY2tTaXplOiB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUsXG4gICAgICBidWZmZXI6IGJ1ZmZlcixcbiAgICB9LCBbYnVmZmVyXSk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMud29ya2VyLnRlcm1pbmF0ZSgpO1xuICAgIHRoaXMud29ya2VyID0gbnVsbDtcblxuICAgIHRoaXMuZmluYWxpemUoKTtcbiAgfVxuXG4gIC8vIHdvcmtlciBjYWxsYmFja1xuICBwcm9jZXNzKGUpIHtcbiAgICBjb25zdCBzb3VyY2VTYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcbiAgICBjb25zdCBjb21tYW5kID0gZS5kYXRhLmNvbW1hbmQ7XG4gICAgY29uc3QgaW5kZXggPSBlLmRhdGEuaW5kZXg7XG4gICAgY29uc3QgdGltZSA9IGluZGV4IC8gc291cmNlU2FtcGxlUmF0ZTtcblxuICAgIGlmIChjb21tYW5kID09PSAnZmluYWxpemUnKSB7XG4gICAgICB0aGlzLmZpbmFsaXplKHRpbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBlLmRhdGEuYnVmZmVyO1xuICAgICAgdGhpcy5vdXRGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkoYnVmZmVyKTtcbiAgICAgIHRoaXMudGltZSA9IHRpbWU7XG4gICAgICB0aGlzLm91dHB1dCgpO1xuICAgIH1cbiAgfVxufVxuIl19