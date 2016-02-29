'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreBaseLfo = require('../core/base-lfo');

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var worker = '\nvar isInfiniteBuffer = false;\nvar stack = [];\nvar buffer;\nvar bufferLength;\nvar currentIndex;\n\nfunction init() {\n  buffer = new Float32Array(bufferLength);\n  stack.length = 0;\n  currentIndex = 0;\n}\n\nfunction append(block) {\n  var availableSpace = bufferLength - currentIndex;\n  var currentBlock;\n  // return if already full\n  if (availableSpace <= 0) { return; }\n\n  if (availableSpace < block.length) {\n    currentBlock = block.subarray(0, availableSpace);\n  } else {\n    currentBlock = block;\n  }\n\n  buffer.set(currentBlock, currentIndex);\n  currentIndex += currentBlock.length;\n\n  if (isInfiniteBuffer && currentIndex === buffer.length) {\n    stack.push(buffer);\n\n    currentBlock = block.subarray(availableSpace);\n    buffer = new Float32Array(buffer.length);\n    buffer.set(currentBlock, 0);\n    currentIndex = currentBlock.length;\n  }\n}\n\nself.addEventListener(\'message\', function(e) {\n  switch (e.data.command) {\n    case \'init\':\n      if (isFinite(e.data.duration)) {\n        bufferLength = e.data.sampleRate * e.data.duration;\n      } else {\n        isInfiniteBuffer = true;\n        bufferLength = e.data.sampleRate * 10;\n      }\n\n      init();\n      break;\n\n    case \'process\':\n      var block = new Float32Array(e.data.buffer);\n      append(block);\n\n\n      // if the buffer is full return it, only works with finite buffers\n      if (!isInfiniteBuffer && currentIndex === bufferLength) {\n        var buf = buffer.buffer.slice(0);\n        self.postMessage({ buffer: buf }, [buf]);\n        init();\n      }\n      break;\n\n    case \'stop\':\n      if (!isInfiniteBuffer) {\n        // @TODO add option to not clip the returned buffer\n        // values in FLoat32Array are 4 bytes long (32 / 8)\n        var copy = buffer.buffer.slice(0, currentIndex * (32 / 8));\n        self.postMessage({ buffer: copy }, [copy]);\n      } else {\n        var copy = new Float32Array(stack.length * bufferLength + currentIndex);\n        stack.forEach(function(buffer, index) {\n          copy.set(buffer, bufferLength * index);\n        });\n\n        copy.set(buffer.subarray(0, currentIndex), stack.length * bufferLength);\n        self.postMessage({ buffer: copy.buffer }, [copy.buffer]);\n      }\n      init();\n      break;\n  }\n}, false)';

var audioContext = undefined;

/**
 * Record an audio stream
 */

var AudioRecorder = (function (_BaseLfo) {
  _inherits(AudioRecorder, _BaseLfo);

  function AudioRecorder(options) {
    _classCallCheck(this, AudioRecorder);

    _get(Object.getPrototypeOf(AudioRecorder.prototype), 'constructor', this).call(this, {
      duration: 10, // seconds
      ignoreLeadingZeros: true }, // ignore zeros at the beginning of the recoarding
    options);

    // needed to retrive an AudioBuffer
    if (!this.params.ctx) {
      if (!audioContext) {
        audioContext = new window.AudioContext();
      }
      this.ctx = audioContext;
    } else {
      this.ctx = this.params.ctx;
    }

    this._isStarted = false;
    this._ignoreZeros = false;

    var blob = new Blob([worker], { type: 'text/javascript' });
    this.worker = new Worker(window.URL.createObjectURL(blob));
  }

  _createClass(AudioRecorder, [{
    key: 'initialize',
    value: function initialize(inStreamParams) {
      _get(Object.getPrototypeOf(AudioRecorder.prototype), 'initialize', this).call(this, inStreamParams);

      // propagate `streamParams` to the worker
      this.worker.postMessage({
        command: 'init',
        duration: this.params.duration,
        sampleRate: this.streamParams.sourceSampleRate
      });
    }
  }, {
    key: 'start',
    value: function start() {
      this._isStarted = true;
      this._ignoreZeros = this.params.ignoreLeadingZeros;

      this.count = 0;
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this._isStarted) {
        this.worker.postMessage({ command: 'stop' });
        this._isStarted = false;
      }
    }

    // called when `stop` is triggered on the source
    // @todo - optionnaly truncate retrieved buffer to end time
  }, {
    key: 'finalize',
    value: function finalize(endTime) {
      this.stop();
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      if (!this._isStarted) {
        return;
      }
      // `this.outFrame` must be recreated each time because
      // it is copied in the worker and lost for this context
      var sendFrame = null;

      if (!this._ignoreZeros) {
        sendFrame = new Float32Array(frame);
      } else if (frame[frame.length - 1] !== 0) {
        var len = frame.length;
        var i = undefined;

        for (i = 0; i < len; i++) {
          if (frame[i] !== 0) break;
        }

        // copy non zero segment
        sendFrame = new Float32Array(frame.subarray(i));
        this._ignoreZeros = false;
      }

      if (sendFrame) {
        var buffer = sendFrame.buffer;
        this.worker.postMessage({
          command: 'process',
          buffer: buffer
        }, [buffer]);
      }
    }

    /**
     * retrieve the created audioBuffer
     * @return {Promise}
     */
  }, {
    key: 'retrieve',
    value: function retrieve() {
      var _this = this;

      return new _Promise(function (resolve, reject) {
        var callback = function callback(e) {
          // if called when buffer is full, stop the recorder too
          _this._isStarted = false;

          _this.worker.removeEventListener('message', callback, false);
          // create an audio buffer from the data
          var buffer = new Float32Array(e.data.buffer);
          var length = buffer.length;
          var sampleRate = _this.streamParams.sourceSampleRate;

          var audioBuffer = _this.ctx.createBuffer(1, length, sampleRate);
          var audioArrayBuffer = audioBuffer.getChannelData(0);
          audioArrayBuffer.set(buffer, 0);

          resolve(audioBuffer);
        };

        _this.worker.addEventListener('message', callback, false);
      });
    }
  }]);

  return AudioRecorder;
})(_coreBaseLfo2['default']);

exports['default'] = AudioRecorder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy9hdWRpby1yZWNvcmRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7OztBQUV0QyxJQUFNLE1BQU0seXdFQWtGRixDQUFDOztBQUVYLElBQUksWUFBWSxZQUFBLENBQUM7Ozs7OztJQUtJLGFBQWE7WUFBYixhQUFhOztBQUNyQixXQURRLGFBQWEsQ0FDcEIsT0FBTyxFQUFFOzBCQURGLGFBQWE7O0FBRTlCLCtCQUZpQixhQUFhLDZDQUV4QjtBQUNKLGNBQVEsRUFBRSxFQUFFO0FBQ1osd0JBQWtCLEVBQUUsSUFBSSxFQUN6QjtBQUFFLFdBQU8sRUFBRTs7O0FBR1osUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxZQUFZLEVBQUU7QUFBRSxvQkFBWSxHQUFHLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO09BQUU7QUFDaEUsVUFBSSxDQUFDLEdBQUcsR0FBRyxZQUFZLENBQUM7S0FDekIsTUFBTTtBQUNMLFVBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7S0FDNUI7O0FBRUQsUUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDeEIsUUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7O0FBRTFCLFFBQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO0FBQzdELFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUM1RDs7ZUFwQmtCLGFBQWE7O1dBc0J0QixvQkFBQyxjQUFjLEVBQUU7QUFDekIsaUNBdkJpQixhQUFhLDRDQXVCYixjQUFjLEVBQUU7OztBQUdq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QUFDLENBQUMsQ0FBQztBQUN2RCwwQkFBZ0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVoQyxpQkFBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3RCLENBQUM7O0FBRUYsY0FBSyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUMxRCxDQUFDLENBQUM7S0FDSjs7O1NBN0drQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJlczYvc2lua3MvYXVkaW8tcmVjb3JkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuY29uc3Qgd29ya2VyID0gYFxudmFyIGlzSW5maW5pdGVCdWZmZXIgPSBmYWxzZTtcbnZhciBzdGFjayA9IFtdO1xudmFyIGJ1ZmZlcjtcbnZhciBidWZmZXJMZW5ndGg7XG52YXIgY3VycmVudEluZGV4O1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICBidWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KGJ1ZmZlckxlbmd0aCk7XG4gIHN0YWNrLmxlbmd0aCA9IDA7XG4gIGN1cnJlbnRJbmRleCA9IDA7XG59XG5cbmZ1bmN0aW9uIGFwcGVuZChibG9jaykge1xuICB2YXIgYXZhaWxhYmxlU3BhY2UgPSBidWZmZXJMZW5ndGggLSBjdXJyZW50SW5kZXg7XG4gIHZhciBjdXJyZW50QmxvY2s7XG4gIC8vIHJldHVybiBpZiBhbHJlYWR5IGZ1bGxcbiAgaWYgKGF2YWlsYWJsZVNwYWNlIDw9IDApIHsgcmV0dXJuOyB9XG5cbiAgaWYgKGF2YWlsYWJsZVNwYWNlIDwgYmxvY2subGVuZ3RoKSB7XG4gICAgY3VycmVudEJsb2NrID0gYmxvY2suc3ViYXJyYXkoMCwgYXZhaWxhYmxlU3BhY2UpO1xuICB9IGVsc2Uge1xuICAgIGN1cnJlbnRCbG9jayA9IGJsb2NrO1xuICB9XG5cbiAgYnVmZmVyLnNldChjdXJyZW50QmxvY2ssIGN1cnJlbnRJbmRleCk7XG4gIGN1cnJlbnRJbmRleCArPSBjdXJyZW50QmxvY2subGVuZ3RoO1xuXG4gIGlmIChpc0luZmluaXRlQnVmZmVyICYmIGN1cnJlbnRJbmRleCA9PT0gYnVmZmVyLmxlbmd0aCkge1xuICAgIHN0YWNrLnB1c2goYnVmZmVyKTtcblxuICAgIGN1cnJlbnRCbG9jayA9IGJsb2NrLnN1YmFycmF5KGF2YWlsYWJsZVNwYWNlKTtcbiAgICBidWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KGJ1ZmZlci5sZW5ndGgpO1xuICAgIGJ1ZmZlci5zZXQoY3VycmVudEJsb2NrLCAwKTtcbiAgICBjdXJyZW50SW5kZXggPSBjdXJyZW50QmxvY2subGVuZ3RoO1xuICB9XG59XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKGUpIHtcbiAgc3dpdGNoIChlLmRhdGEuY29tbWFuZCkge1xuICAgIGNhc2UgJ2luaXQnOlxuICAgICAgaWYgKGlzRmluaXRlKGUuZGF0YS5kdXJhdGlvbikpIHtcbiAgICAgICAgYnVmZmVyTGVuZ3RoID0gZS5kYXRhLnNhbXBsZVJhdGUgKiBlLmRhdGEuZHVyYXRpb247XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpc0luZmluaXRlQnVmZmVyID0gdHJ1ZTtcbiAgICAgICAgYnVmZmVyTGVuZ3RoID0gZS5kYXRhLnNhbXBsZVJhdGUgKiAxMDtcbiAgICAgIH1cblxuICAgICAgaW5pdCgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdwcm9jZXNzJzpcbiAgICAgIHZhciBibG9jayA9IG5ldyBGbG9hdDMyQXJyYXkoZS5kYXRhLmJ1ZmZlcik7XG4gICAgICBhcHBlbmQoYmxvY2spO1xuXG5cbiAgICAgIC8vIGlmIHRoZSBidWZmZXIgaXMgZnVsbCByZXR1cm4gaXQsIG9ubHkgd29ya3Mgd2l0aCBmaW5pdGUgYnVmZmVyc1xuICAgICAgaWYgKCFpc0luZmluaXRlQnVmZmVyICYmIGN1cnJlbnRJbmRleCA9PT0gYnVmZmVyTGVuZ3RoKSB7XG4gICAgICAgIHZhciBidWYgPSBidWZmZXIuYnVmZmVyLnNsaWNlKDApO1xuICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHsgYnVmZmVyOiBidWYgfSwgW2J1Zl0pO1xuICAgICAgICBpbml0KCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3N0b3AnOlxuICAgICAgaWYgKCFpc0luZmluaXRlQnVmZmVyKSB7XG4gICAgICAgIC8vIEBUT0RPIGFkZCBvcHRpb24gdG8gbm90IGNsaXAgdGhlIHJldHVybmVkIGJ1ZmZlclxuICAgICAgICAvLyB2YWx1ZXMgaW4gRkxvYXQzMkFycmF5IGFyZSA0IGJ5dGVzIGxvbmcgKDMyIC8gOClcbiAgICAgICAgdmFyIGNvcHkgPSBidWZmZXIuYnVmZmVyLnNsaWNlKDAsIGN1cnJlbnRJbmRleCAqICgzMiAvIDgpKTtcbiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7IGJ1ZmZlcjogY29weSB9LCBbY29weV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGNvcHkgPSBuZXcgRmxvYXQzMkFycmF5KHN0YWNrLmxlbmd0aCAqIGJ1ZmZlckxlbmd0aCArIGN1cnJlbnRJbmRleCk7XG4gICAgICAgIHN0YWNrLmZvckVhY2goZnVuY3Rpb24oYnVmZmVyLCBpbmRleCkge1xuICAgICAgICAgIGNvcHkuc2V0KGJ1ZmZlciwgYnVmZmVyTGVuZ3RoICogaW5kZXgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb3B5LnNldChidWZmZXIuc3ViYXJyYXkoMCwgY3VycmVudEluZGV4KSwgc3RhY2subGVuZ3RoICogYnVmZmVyTGVuZ3RoKTtcbiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7IGJ1ZmZlcjogY29weS5idWZmZXIgfSwgW2NvcHkuYnVmZmVyXSk7XG4gICAgICB9XG4gICAgICBpbml0KCk7XG4gICAgICBicmVhaztcbiAgfVxufSwgZmFsc2UpYDtcblxubGV0IGF1ZGlvQ29udGV4dDtcblxuLyoqXG4gKiBSZWNvcmQgYW4gYXVkaW8gc3RyZWFtXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1ZGlvUmVjb3JkZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIGR1cmF0aW9uOiAxMCwgLy8gc2Vjb25kc1xuICAgICAgaWdub3JlTGVhZGluZ1plcm9zOiB0cnVlLCAvLyBpZ25vcmUgemVyb3MgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgcmVjb2FyZGluZ1xuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgLy8gbmVlZGVkIHRvIHJldHJpdmUgYW4gQXVkaW9CdWZmZXJcbiAgICBpZiAoIXRoaXMucGFyYW1zLmN0eCkge1xuICAgICAgaWYgKCFhdWRpb0NvbnRleHQpIHsgYXVkaW9Db250ZXh0ID0gbmV3IHdpbmRvdy5BdWRpb0NvbnRleHQoKTsgfVxuICAgICAgdGhpcy5jdHggPSBhdWRpb0NvbnRleHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3R4ID0gdGhpcy5wYXJhbXMuY3R4O1xuICAgIH1cblxuICAgIHRoaXMuX2lzU3RhcnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2lnbm9yZVplcm9zID0gZmFsc2U7XG5cbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW3dvcmtlcl0sIHsgdHlwZTogJ3RleHQvamF2YXNjcmlwdCcgfSk7XG4gICAgdGhpcy53b3JrZXIgPSBuZXcgV29ya2VyKHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoaW5TdHJlYW1QYXJhbXMpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKGluU3RyZWFtUGFyYW1zKTtcblxuICAgIC8vIHByb3BhZ2F0ZSBgc3RyZWFtUGFyYW1zYCB0byB0aGUgd29ya2VyXG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgICAgY29tbWFuZDogJ2luaXQnLFxuICAgICAgZHVyYXRpb246IHRoaXMucGFyYW1zLmR1cmF0aW9uLFxuICAgICAgc2FtcGxlUmF0ZTogdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZVxuICAgIH0pO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5faXNTdGFydGVkID0gdHJ1ZTtcbiAgICB0aGlzLl9pZ25vcmVaZXJvcyA9IHRoaXMucGFyYW1zLmlnbm9yZUxlYWRpbmdaZXJvcztcblxuICAgIHRoaXMuY291bnQgPSAwO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZiAodGhpcy5faXNTdGFydGVkKSB7XG4gICAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh7IGNvbW1hbmQ6ICdzdG9wJyB9KTtcbiAgICAgIHRoaXMuX2lzU3RhcnRlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNhbGxlZCB3aGVuIGBzdG9wYCBpcyB0cmlnZ2VyZWQgb24gdGhlIHNvdXJjZVxuICAvLyBAdG9kbyAtIG9wdGlvbm5hbHkgdHJ1bmNhdGUgcmV0cmlldmVkIGJ1ZmZlciB0byBlbmQgdGltZVxuICBmaW5hbGl6ZShlbmRUaW1lKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGlmICghdGhpcy5faXNTdGFydGVkKSB7IHJldHVybjsgfVxuICAgIC8vIGB0aGlzLm91dEZyYW1lYCBtdXN0IGJlIHJlY3JlYXRlZCBlYWNoIHRpbWUgYmVjYXVzZVxuICAgIC8vIGl0IGlzIGNvcGllZCBpbiB0aGUgd29ya2VyIGFuZCBsb3N0IGZvciB0aGlzIGNvbnRleHRcbiAgICBsZXQgc2VuZEZyYW1lID0gbnVsbDtcblxuICAgIGlmICghdGhpcy5faWdub3JlWmVyb3MpIHtcbiAgICAgIHNlbmRGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWUpO1xuICAgIH0gZWxzZSBpZiAoZnJhbWVbZnJhbWUubGVuZ3RoIC0gMV0gIT09IDApIHtcbiAgICAgIGNvbnN0IGxlbiA9IGZyYW1lLmxlbmd0aDtcbiAgICAgIGxldCBpO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGZyYW1lW2ldICE9PSAwKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAvLyBjb3B5IG5vbiB6ZXJvIHNlZ21lbnRcbiAgICAgIHNlbmRGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWUuc3ViYXJyYXkoaSkpO1xuICAgICAgdGhpcy5faWdub3JlWmVyb3MgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoc2VuZEZyYW1lKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBzZW5kRnJhbWUuYnVmZmVyO1xuICAgICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgICAgICBjb21tYW5kOiAncHJvY2VzcycsXG4gICAgICAgIGJ1ZmZlcjogYnVmZmVyXG4gICAgICB9LCBbYnVmZmVyXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHJldHJpZXZlIHRoZSBjcmVhdGVkIGF1ZGlvQnVmZmVyXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICByZXRyaWV2ZSgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSAoZSkgPT4ge1xuICAgICAgICAvLyBpZiBjYWxsZWQgd2hlbiBidWZmZXIgaXMgZnVsbCwgc3RvcCB0aGUgcmVjb3JkZXIgdG9vXG4gICAgICAgIHRoaXMuX2lzU3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMud29ya2VyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBjYWxsYmFjaywgZmFsc2UpO1xuICAgICAgICAvLyBjcmVhdGUgYW4gYXVkaW8gYnVmZmVyIGZyb20gdGhlIGRhdGFcbiAgICAgICAgY29uc3QgYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShlLmRhdGEuYnVmZmVyKTtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aDtcbiAgICAgICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG5cbiAgICAgICAgY29uc3QgYXVkaW9CdWZmZXIgPSB0aGlzLmN0eC5jcmVhdGVCdWZmZXIoMSwgbGVuZ3RoLCBzYW1wbGVSYXRlKTtcbiAgICAgICAgY29uc3QgYXVkaW9BcnJheUJ1ZmZlciA9IGF1ZGlvQnVmZmVyLmdldENoYW5uZWxEYXRhKDApO1xuICAgICAgICBhdWRpb0FycmF5QnVmZmVyLnNldChidWZmZXIsIDApO1xuXG4gICAgICAgIHJlc29sdmUoYXVkaW9CdWZmZXIpO1xuICAgICAgfTtcblxuICAgICAgdGhpcy53b3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==