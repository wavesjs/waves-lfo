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

var worker = '\nvar isInfiniteBuffer = false;\nvar stack = [];\nvar buffer;\nvar bufferLength;\nvar currentIndex;\n\nfunction init() {\n  if (!buffer) {\n    buffer = new Float32Array(bufferLength);\n  } else {\n    if (isInfiniteBuffer) {\n      buffer = stack[0];\n      stack.length = 0;\n    }\n\n    for (var i = 0; i < bufferLength; i++) {\n      buffer[i] = 0;\n    }\n  }\n\n  currentIndex = 0;\n}\n\nfunction append(block) {\n  var availableSpace = bufferLength - currentIndex;\n  var currentBlock;\n  // return if already full\n  if (availableSpace <= 0) { return; }\n\n  if (availableSpace < block.length) {\n    currentBlock = block.subarray(0, availableSpace);\n  } else {\n    currentBlock = block;\n  }\n\n  buffer.set(currentBlock, currentIndex);\n  currentIndex += currentBlock.length;\n\n  if (isInfiniteBuffer && currentIndex === buffer.length) {\n    stack.push(buffer);\n\n    currentBlock = block.subarray(availableSpace);\n    buffer = new Float32Array(buffer.length);\n    buffer.set(currentBlock, 0);\n    currentIndex = currentBlock.length;\n  }\n}\n\nself.addEventListener(\'message\', function(e) {\n  switch (e.data.command) {\n    case \'init\':\n      if (isFinite(e.data.duration)) {\n        bufferLength = e.data.sampleRate * e.data.duration;\n      } else {\n        isInfiniteBuffer = true;\n        bufferLength = e.data.sampleRate * 10;\n      }\n\n      init();\n      break;\n\n    case \'process\':\n      var block = new Float32Array(e.data.buffer);\n      append(block);\n\n      // if the buffer is full return it, only works with finite buffers\n      if (!isInfiniteBuffer && currentIndex === bufferLength) {\n        var buf = buffer.buffer.slice(0);\n        self.postMessage({ buffer: buf }, [buf]);\n        init();\n      }\n      break;\n\n    case \'finalize\':\n      if (!isInfiniteBuffer) {\n        // @TODO add option to not clip the returned buffer\n        // values in FLoat32Array are 4 bytes long (32 / 8)\n        var copy = buffer.buffer.slice(0, currentIndex * (32 / 8));\n        self.postMessage({ buffer: copy }, [copy]);\n      } else {\n        var copy = new Float32Array(stack.length * bufferLength + currentIndex);\n        stack.forEach(function(buffer, index) {\n          copy.set(buffer, bufferLength * index);\n        });\n\n        copy.set(buffer.subarray(0, currentIndex), stack.length * bufferLength);\n        self.postMessage({ buffer: copy.buffer }, [copy.buffer]);\n      }\n      init();\n      break;\n  }\n}, false)';

var audioContext = undefined;

/**
 * Record an audio stream
 */

var AudioRecorder = (function (_BaseLfo) {
  _inherits(AudioRecorder, _BaseLfo);

  function AudioRecorder() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, AudioRecorder);

    var defaults = {
      duration: 60 };

    // seconds
    _get(Object.getPrototypeOf(AudioRecorder.prototype), 'constructor', this).call(this, options, defaults);
    this.metaData = {};

    // needed to retrive an AudioBuffer
    if (!this.params.ctx) {
      if (!audioContext) {
        audioContext = new window.AudioContext();
      }
      this.ctx = audioContext;
    } else {
      this.ctx = this.params.ctx;
    }

    var blob = new Blob([worker], { type: 'text/javascript' });
    this.worker = new Worker(window.URL.createObjectURL(blob));
  }

  _createClass(AudioRecorder, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(AudioRecorder.prototype), 'initialize', this).call(this);
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
    }
  }, {
    key: 'stop',
    value: function stop() {
      this._isStarted = false;
      this.finalize();
    }

    // called when `stop` is triggered on the source
  }, {
    key: 'finalize',
    value: function finalize() {
      this.worker.postMessage({ command: 'finalize' });
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      if (!this._isStarted) {
        return;
      }
      // `this.outFrame` must be recreated each time because
      // it is copied in the worker and lost for this context
      this.outFrame = new Float32Array(frame);

      var buffer = this.outFrame.buffer;
      this.worker.postMessage({ command: 'process', buffer: buffer }, [buffer]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rL2F1ZGlvLXJlY29yZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7O0FBRXRDLElBQU0sTUFBTSxpOEVBNEZGLENBQUM7O0FBRVgsSUFBSSxZQUFZLFlBQUEsQ0FBQzs7Ozs7O0lBS0ksYUFBYTtZQUFiLGFBQWE7O0FBQ3JCLFdBRFEsYUFBYSxHQUNOO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFETCxhQUFhOztBQUU5QixRQUFNLFFBQVEsR0FBRztBQUNmLGNBQVEsRUFBRSxFQUFFLEVBQ2IsQ0FBQzs7O0FBRUYsK0JBTmlCLGFBQWEsNkNBTXhCLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDekIsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7OztBQUduQixRQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7QUFDcEIsVUFBSSxDQUFDLFlBQVksRUFBRTtBQUFFLG9CQUFZLEdBQUcsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7T0FBRTtBQUNoRSxVQUFJLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQztLQUN6QixNQUFNO0FBQ0wsVUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztLQUM1Qjs7QUFFRCxRQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FBQztBQUM3RCxRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDNUQ7O2VBbkJrQixhQUFhOztXQXFCdEIsc0JBQUc7QUFDWCxpQ0F0QmlCLGFBQWEsNENBc0JYOztBQUVuQixVQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztBQUN0QixlQUFPLEVBQUUsTUFBTTtBQUNmLGdCQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRO0FBQzlCLGtCQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0I7T0FDL0MsQ0FBQyxDQUFDO0tBQ0o7OztXQUVJLGlCQUFHO0FBQ04sVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7S0FDeEI7OztXQUVHLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDeEIsVUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ2pCOzs7OztXQUdPLG9CQUFHO0FBQ1QsVUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztLQUNsRDs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFBRSxlQUFPO09BQUU7OztBQUdqQyxVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV4QyxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUNwQyxVQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUMzRTs7Ozs7Ozs7V0FNTyxvQkFBRzs7O0FBQ1QsYUFBTyxhQUFZLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUN0QyxZQUFJLFFBQVEsR0FBRyxTQUFYLFFBQVEsQ0FBSSxDQUFDLEVBQUs7O0FBRXBCLGdCQUFLLFVBQVUsR0FBRyxLQUFLLENBQUM7O0FBRXhCLGdCQUFLLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUU1RCxjQUFNLE1BQU0sR0FBRyxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9DLGNBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDN0IsY0FBTSxVQUFVLEdBQUcsTUFBSyxZQUFZLENBQUMsZ0JBQWdCLENBQUM7O0FBRXRELGNBQU0sV0FBVyxHQUFHLE1BQUssR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2pFLGNBQU0sZ0JBQWdCLEdBQUcsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2RCwwQkFBZ0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVoQyxpQkFBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3RCLENBQUM7O0FBRUYsY0FBSyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUMxRCxDQUFDLENBQUM7S0FDSjs7O1NBaEZrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJlczYvc2luay9hdWRpby1yZWNvcmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG5jb25zdCB3b3JrZXIgPSBgXG52YXIgaXNJbmZpbml0ZUJ1ZmZlciA9IGZhbHNlO1xudmFyIHN0YWNrID0gW107XG52YXIgYnVmZmVyO1xudmFyIGJ1ZmZlckxlbmd0aDtcbnZhciBjdXJyZW50SW5kZXg7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gIGlmICghYnVmZmVyKSB7XG4gICAgYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShidWZmZXJMZW5ndGgpO1xuICB9IGVsc2Uge1xuICAgIGlmIChpc0luZmluaXRlQnVmZmVyKSB7XG4gICAgICBidWZmZXIgPSBzdGFja1swXTtcbiAgICAgIHN0YWNrLmxlbmd0aCA9IDA7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBidWZmZXJMZW5ndGg7IGkrKykge1xuICAgICAgYnVmZmVyW2ldID0gMDtcbiAgICB9XG4gIH1cblxuICBjdXJyZW50SW5kZXggPSAwO1xufVxuXG5mdW5jdGlvbiBhcHBlbmQoYmxvY2spIHtcbiAgdmFyIGF2YWlsYWJsZVNwYWNlID0gYnVmZmVyTGVuZ3RoIC0gY3VycmVudEluZGV4O1xuICB2YXIgY3VycmVudEJsb2NrO1xuICAvLyByZXR1cm4gaWYgYWxyZWFkeSBmdWxsXG4gIGlmIChhdmFpbGFibGVTcGFjZSA8PSAwKSB7IHJldHVybjsgfVxuXG4gIGlmIChhdmFpbGFibGVTcGFjZSA8IGJsb2NrLmxlbmd0aCkge1xuICAgIGN1cnJlbnRCbG9jayA9IGJsb2NrLnN1YmFycmF5KDAsIGF2YWlsYWJsZVNwYWNlKTtcbiAgfSBlbHNlIHtcbiAgICBjdXJyZW50QmxvY2sgPSBibG9jaztcbiAgfVxuXG4gIGJ1ZmZlci5zZXQoY3VycmVudEJsb2NrLCBjdXJyZW50SW5kZXgpO1xuICBjdXJyZW50SW5kZXggKz0gY3VycmVudEJsb2NrLmxlbmd0aDtcblxuICBpZiAoaXNJbmZpbml0ZUJ1ZmZlciAmJiBjdXJyZW50SW5kZXggPT09IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICBzdGFjay5wdXNoKGJ1ZmZlcik7XG5cbiAgICBjdXJyZW50QmxvY2sgPSBibG9jay5zdWJhcnJheShhdmFpbGFibGVTcGFjZSk7XG4gICAgYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShidWZmZXIubGVuZ3RoKTtcbiAgICBidWZmZXIuc2V0KGN1cnJlbnRCbG9jaywgMCk7XG4gICAgY3VycmVudEluZGV4ID0gY3VycmVudEJsb2NrLmxlbmd0aDtcbiAgfVxufVxuXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbihlKSB7XG4gIHN3aXRjaCAoZS5kYXRhLmNvbW1hbmQpIHtcbiAgICBjYXNlICdpbml0JzpcbiAgICAgIGlmIChpc0Zpbml0ZShlLmRhdGEuZHVyYXRpb24pKSB7XG4gICAgICAgIGJ1ZmZlckxlbmd0aCA9IGUuZGF0YS5zYW1wbGVSYXRlICogZS5kYXRhLmR1cmF0aW9uO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXNJbmZpbml0ZUJ1ZmZlciA9IHRydWU7XG4gICAgICAgIGJ1ZmZlckxlbmd0aCA9IGUuZGF0YS5zYW1wbGVSYXRlICogMTA7XG4gICAgICB9XG5cbiAgICAgIGluaXQoKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAncHJvY2Vzcyc6XG4gICAgICB2YXIgYmxvY2sgPSBuZXcgRmxvYXQzMkFycmF5KGUuZGF0YS5idWZmZXIpO1xuICAgICAgYXBwZW5kKGJsb2NrKTtcblxuICAgICAgLy8gaWYgdGhlIGJ1ZmZlciBpcyBmdWxsIHJldHVybiBpdCwgb25seSB3b3JrcyB3aXRoIGZpbml0ZSBidWZmZXJzXG4gICAgICBpZiAoIWlzSW5maW5pdGVCdWZmZXIgJiYgY3VycmVudEluZGV4ID09PSBidWZmZXJMZW5ndGgpIHtcbiAgICAgICAgdmFyIGJ1ZiA9IGJ1ZmZlci5idWZmZXIuc2xpY2UoMCk7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoeyBidWZmZXI6IGJ1ZiB9LCBbYnVmXSk7XG4gICAgICAgIGluaXQoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnZmluYWxpemUnOlxuICAgICAgaWYgKCFpc0luZmluaXRlQnVmZmVyKSB7XG4gICAgICAgIC8vIEBUT0RPIGFkZCBvcHRpb24gdG8gbm90IGNsaXAgdGhlIHJldHVybmVkIGJ1ZmZlclxuICAgICAgICAvLyB2YWx1ZXMgaW4gRkxvYXQzMkFycmF5IGFyZSA0IGJ5dGVzIGxvbmcgKDMyIC8gOClcbiAgICAgICAgdmFyIGNvcHkgPSBidWZmZXIuYnVmZmVyLnNsaWNlKDAsIGN1cnJlbnRJbmRleCAqICgzMiAvIDgpKTtcbiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7IGJ1ZmZlcjogY29weSB9LCBbY29weV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGNvcHkgPSBuZXcgRmxvYXQzMkFycmF5KHN0YWNrLmxlbmd0aCAqIGJ1ZmZlckxlbmd0aCArIGN1cnJlbnRJbmRleCk7XG4gICAgICAgIHN0YWNrLmZvckVhY2goZnVuY3Rpb24oYnVmZmVyLCBpbmRleCkge1xuICAgICAgICAgIGNvcHkuc2V0KGJ1ZmZlciwgYnVmZmVyTGVuZ3RoICogaW5kZXgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb3B5LnNldChidWZmZXIuc3ViYXJyYXkoMCwgY3VycmVudEluZGV4KSwgc3RhY2subGVuZ3RoICogYnVmZmVyTGVuZ3RoKTtcbiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7IGJ1ZmZlcjogY29weS5idWZmZXIgfSwgW2NvcHkuYnVmZmVyXSk7XG4gICAgICB9XG4gICAgICBpbml0KCk7XG4gICAgICBicmVhaztcbiAgfVxufSwgZmFsc2UpYDtcblxubGV0IGF1ZGlvQ29udGV4dDtcblxuLyoqXG4gKiBSZWNvcmQgYW4gYXVkaW8gc3RyZWFtXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1ZGlvUmVjb3JkZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBkdXJhdGlvbjogNjAsIC8vIHNlY29uZHNcbiAgICB9O1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuICAgIHRoaXMubWV0YURhdGEgPSB7fTtcblxuICAgIC8vIG5lZWRlZCB0byByZXRyaXZlIGFuIEF1ZGlvQnVmZmVyXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5jdHgpIHtcbiAgICAgIGlmICghYXVkaW9Db250ZXh0KSB7IGF1ZGlvQ29udGV4dCA9IG5ldyB3aW5kb3cuQXVkaW9Db250ZXh0KCk7IH1cbiAgICAgIHRoaXMuY3R4ID0gYXVkaW9Db250ZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN0eCA9IHRoaXMucGFyYW1zLmN0eDtcbiAgICB9XG5cbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW3dvcmtlcl0sIHsgdHlwZTogJ3RleHQvamF2YXNjcmlwdCcgfSk7XG4gICAgdGhpcy53b3JrZXIgPSBuZXcgV29ya2VyKHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIC8vIHByb3BhZ2F0ZSBgc3RyZWFtUGFyYW1zYCB0byB0aGUgd29ya2VyXG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgICAgY29tbWFuZDogJ2luaXQnLFxuICAgICAgZHVyYXRpb246IHRoaXMucGFyYW1zLmR1cmF0aW9uLFxuICAgICAgc2FtcGxlUmF0ZTogdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZVxuICAgIH0pO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5faXNTdGFydGVkID0gdHJ1ZTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuICB9XG5cbiAgLy8gY2FsbGVkIHdoZW4gYHN0b3BgIGlzIHRyaWdnZXJlZCBvbiB0aGUgc291cmNlXG4gIGZpbmFsaXplKCkge1xuICAgIHRoaXMud29ya2VyLnBvc3RNZXNzYWdlKHsgY29tbWFuZDogJ2ZpbmFsaXplJyB9KTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgaWYgKCF0aGlzLl9pc1N0YXJ0ZWQpIHsgcmV0dXJuOyB9XG4gICAgLy8gYHRoaXMub3V0RnJhbWVgIG11c3QgYmUgcmVjcmVhdGVkIGVhY2ggdGltZSBiZWNhdXNlXG4gICAgLy8gaXQgaXMgY29waWVkIGluIHRoZSB3b3JrZXIgYW5kIGxvc3QgZm9yIHRoaXMgY29udGV4dFxuICAgIHRoaXMub3V0RnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KGZyYW1lKTtcblxuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMub3V0RnJhbWUuYnVmZmVyO1xuICAgIHRoaXMud29ya2VyLnBvc3RNZXNzYWdlKHsgY29tbWFuZDogJ3Byb2Nlc3MnLCBidWZmZXI6IGJ1ZmZlciB9LCBbYnVmZmVyXSk7XG4gIH1cblxuICAvKipcbiAgICogcmV0cmlldmUgdGhlIGNyZWF0ZWQgYXVkaW9CdWZmZXJcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIHJldHJpZXZlKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB2YXIgY2FsbGJhY2sgPSAoZSkgPT4ge1xuICAgICAgICAvLyBpZiBjYWxsZWQgd2hlbiBidWZmZXIgaXMgZnVsbCwgc3RvcCB0aGUgcmVjb3JkZXIgdG9vXG4gICAgICAgIHRoaXMuX2lzU3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMud29ya2VyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBjYWxsYmFjaywgZmFsc2UpO1xuICAgICAgICAvLyBjcmVhdGUgYW4gYXVkaW8gYnVmZmVyIGZyb20gdGhlIGRhdGFcbiAgICAgICAgY29uc3QgYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShlLmRhdGEuYnVmZmVyKTtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aDtcbiAgICAgICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG5cbiAgICAgICAgY29uc3QgYXVkaW9CdWZmZXIgPSB0aGlzLmN0eC5jcmVhdGVCdWZmZXIoMSwgbGVuZ3RoLCBzYW1wbGVSYXRlKTtcbiAgICAgICAgY29uc3QgYXVkaW9BcnJheUJ1ZmZlciA9IGF1ZGlvQnVmZmVyLmdldENoYW5uZWxEYXRhKDApO1xuICAgICAgICBhdWRpb0FycmF5QnVmZmVyLnNldChidWZmZXIsIDApO1xuXG4gICAgICAgIHJlc29sdmUoYXVkaW9CdWZmZXIpO1xuICAgICAgfTtcblxuICAgICAgdGhpcy53b3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgfSk7XG4gIH1cbn0iXX0=