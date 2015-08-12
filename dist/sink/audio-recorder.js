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

var worker = '\nvar buffer;\nvar bufferLength;\nvar currentIndex;\n\nfunction init() {\n  if (!buffer) {\n    buffer = new Float32Array(bufferLength);\n  } else {\n    for (var i = 0; i < bufferLength; i++) {\n      buffer[i] = 0;\n    }\n  }\n\n  currentIndex = 0;\n}\n\nfunction append(block) {\n  var availableSpace = bufferLength - currentIndex;\n\n  // return if already full\n  if (availableSpace <= 0) { return; }\n\n  if (availableSpace < block.length) {\n    block = block.subarray(0, availableSpace);\n  }\n\n  buffer.set(block, currentIndex);\n  currentIndex += block.length;\n}\n\nself.addEventListener(\'message\', function(e) {\n  switch (e.data.command) {\n    case \'init\':\n      bufferLength = e.data.sampleRate * e.data.duration;\n      init();\n      break;\n\n    case \'process\':\n      var block = new Float32Array(e.data.buffer);\n      append(block);\n\n      // if the buffer is full return it\n      if (currentIndex === bufferLength) {\n        var buf = buffer.buffer.slice(0);\n        self.postMessage({ buffer: buf }, [buf]);\n        init();\n      }\n      break;\n\n    case \'finalize\':\n      // @TODO add option to not clip the returned buffer\n      // values in FLoat32Array are 4 bytes long (32 / 8)\n      var copy = buffer.buffer.slice(0, currentIndex * (32 / 8));\n      self.postMessage({ buffer: copy }, [copy]);\n      init();\n      break;\n  }\n}, false)';

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rL2F1ZGlvLXJlY29yZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7O0FBRXRDLElBQU0sTUFBTSxxM0NBMERGLENBQUM7O0FBRVgsSUFBSSxZQUFZLFlBQUEsQ0FBQzs7Ozs7O0lBS0ksYUFBYTtZQUFiLGFBQWE7O0FBQ3JCLFdBRFEsYUFBYSxHQUNOO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFETCxhQUFhOztBQUU5QixRQUFNLFFBQVEsR0FBRztBQUNmLGNBQVEsRUFBRSxFQUFFLEVBQ2IsQ0FBQzs7O0FBRUYsK0JBTmlCLGFBQWEsNkNBTXhCLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDekIsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7OztBQUduQixRQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7QUFDcEIsVUFBSSxDQUFDLFlBQVksRUFBRTtBQUFFLG9CQUFZLEdBQUcsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7T0FBRTtBQUNoRSxVQUFJLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQztLQUN6QixNQUFNO0FBQ0wsVUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztLQUM1Qjs7QUFFRCxRQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FBQztBQUM3RCxRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDNUQ7O2VBbkJrQixhQUFhOztXQXFCdEIsc0JBQUc7QUFDWCxpQ0F0QmlCLGFBQWEsNENBc0JYOztBQUVuQixVQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztBQUN0QixlQUFPLEVBQUUsTUFBTTtBQUNmLGdCQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRO0FBQzlCLGtCQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0I7T0FDL0MsQ0FBQyxDQUFDO0tBQ0o7OztXQUVJLGlCQUFHO0FBQ04sVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7S0FDeEI7OztXQUVHLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDeEIsVUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ2pCOzs7OztXQUdPLG9CQUFHO0FBQ1QsVUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztLQUNsRDs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFBRSxlQUFPO09BQUU7OztBQUdqQyxVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV4QyxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUNwQyxVQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUMzRTs7Ozs7Ozs7V0FNTyxvQkFBRzs7O0FBQ1QsYUFBTyxhQUFZLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUN0QyxZQUFJLFFBQVEsR0FBRyxTQUFYLFFBQVEsQ0FBSSxDQUFDLEVBQUs7O0FBRXBCLGdCQUFLLFVBQVUsR0FBRyxLQUFLLENBQUM7O0FBRXhCLGdCQUFLLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUU1RCxjQUFNLE1BQU0sR0FBRyxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9DLGNBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDN0IsY0FBTSxVQUFVLEdBQUcsTUFBSyxZQUFZLENBQUMsZ0JBQWdCLENBQUM7O0FBRXRELGNBQU0sV0FBVyxHQUFHLE1BQUssR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2pFLGNBQU0sZ0JBQWdCLEdBQUcsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2RCwwQkFBZ0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVoQyxpQkFBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3RCLENBQUM7O0FBRUYsY0FBSyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUMxRCxDQUFDLENBQUM7S0FDSjs7O1NBaEZrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJlczYvc2luay9hdWRpby1yZWNvcmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG5jb25zdCB3b3JrZXIgPSBgXG52YXIgYnVmZmVyO1xudmFyIGJ1ZmZlckxlbmd0aDtcbnZhciBjdXJyZW50SW5kZXg7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gIGlmICghYnVmZmVyKSB7XG4gICAgYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShidWZmZXJMZW5ndGgpO1xuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnVmZmVyTGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1ZmZlcltpXSA9IDA7XG4gICAgfVxuICB9XG5cbiAgY3VycmVudEluZGV4ID0gMDtcbn1cblxuZnVuY3Rpb24gYXBwZW5kKGJsb2NrKSB7XG4gIHZhciBhdmFpbGFibGVTcGFjZSA9IGJ1ZmZlckxlbmd0aCAtIGN1cnJlbnRJbmRleDtcblxuICAvLyByZXR1cm4gaWYgYWxyZWFkeSBmdWxsXG4gIGlmIChhdmFpbGFibGVTcGFjZSA8PSAwKSB7IHJldHVybjsgfVxuXG4gIGlmIChhdmFpbGFibGVTcGFjZSA8IGJsb2NrLmxlbmd0aCkge1xuICAgIGJsb2NrID0gYmxvY2suc3ViYXJyYXkoMCwgYXZhaWxhYmxlU3BhY2UpO1xuICB9XG5cbiAgYnVmZmVyLnNldChibG9jaywgY3VycmVudEluZGV4KTtcbiAgY3VycmVudEluZGV4ICs9IGJsb2NrLmxlbmd0aDtcbn1cblxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24oZSkge1xuICBzd2l0Y2ggKGUuZGF0YS5jb21tYW5kKSB7XG4gICAgY2FzZSAnaW5pdCc6XG4gICAgICBidWZmZXJMZW5ndGggPSBlLmRhdGEuc2FtcGxlUmF0ZSAqIGUuZGF0YS5kdXJhdGlvbjtcbiAgICAgIGluaXQoKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAncHJvY2Vzcyc6XG4gICAgICB2YXIgYmxvY2sgPSBuZXcgRmxvYXQzMkFycmF5KGUuZGF0YS5idWZmZXIpO1xuICAgICAgYXBwZW5kKGJsb2NrKTtcblxuICAgICAgLy8gaWYgdGhlIGJ1ZmZlciBpcyBmdWxsIHJldHVybiBpdFxuICAgICAgaWYgKGN1cnJlbnRJbmRleCA9PT0gYnVmZmVyTGVuZ3RoKSB7XG4gICAgICAgIHZhciBidWYgPSBidWZmZXIuYnVmZmVyLnNsaWNlKDApO1xuICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHsgYnVmZmVyOiBidWYgfSwgW2J1Zl0pO1xuICAgICAgICBpbml0KCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2ZpbmFsaXplJzpcbiAgICAgIC8vIEBUT0RPIGFkZCBvcHRpb24gdG8gbm90IGNsaXAgdGhlIHJldHVybmVkIGJ1ZmZlclxuICAgICAgLy8gdmFsdWVzIGluIEZMb2F0MzJBcnJheSBhcmUgNCBieXRlcyBsb25nICgzMiAvIDgpXG4gICAgICB2YXIgY29weSA9IGJ1ZmZlci5idWZmZXIuc2xpY2UoMCwgY3VycmVudEluZGV4ICogKDMyIC8gOCkpO1xuICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7IGJ1ZmZlcjogY29weSB9LCBbY29weV0pO1xuICAgICAgaW5pdCgpO1xuICAgICAgYnJlYWs7XG4gIH1cbn0sIGZhbHNlKWA7XG5cbmxldCBhdWRpb0NvbnRleHQ7XG5cbi8qKlxuICogUmVjb3JkIGFuIGF1ZGlvIHN0cmVhbVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdWRpb1JlY29yZGVyIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgZHVyYXRpb246IDYwLCAvLyBzZWNvbmRzXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcbiAgICB0aGlzLm1ldGFEYXRhID0ge307XG5cbiAgICAvLyBuZWVkZWQgdG8gcmV0cml2ZSBhbiBBdWRpb0J1ZmZlclxuICAgIGlmICghdGhpcy5wYXJhbXMuY3R4KSB7XG4gICAgICBpZiAoIWF1ZGlvQ29udGV4dCkgeyBhdWRpb0NvbnRleHQgPSBuZXcgd2luZG93LkF1ZGlvQ29udGV4dCgpOyB9XG4gICAgICB0aGlzLmN0eCA9IGF1ZGlvQ29udGV4dDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdHggPSB0aGlzLnBhcmFtcy5jdHg7XG4gICAgfVxuXG4gICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFt3b3JrZXJdLCB7IHR5cGU6ICd0ZXh0L2phdmFzY3JpcHQnIH0pO1xuICAgIHRoaXMud29ya2VyID0gbmV3IFdvcmtlcih3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKSk7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICAvLyBwcm9wYWdhdGUgYHN0cmVhbVBhcmFtc2AgdG8gdGhlIHdvcmtlclxuICAgIHRoaXMud29ya2VyLnBvc3RNZXNzYWdlKHtcbiAgICAgIGNvbW1hbmQ6ICdpbml0JyxcbiAgICAgIGR1cmF0aW9uOiB0aGlzLnBhcmFtcy5kdXJhdGlvbixcbiAgICAgIHNhbXBsZVJhdGU6IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGVcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuX2lzU3RhcnRlZCA9IHRydWU7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuX2lzU3RhcnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmluYWxpemUoKTtcbiAgfVxuXG4gIC8vIGNhbGxlZCB3aGVuIGBzdG9wYCBpcyB0cmlnZ2VyZWQgb24gdGhlIHNvdXJjZVxuICBmaW5hbGl6ZSgpIHtcbiAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh7IGNvbW1hbmQ6ICdmaW5hbGl6ZScgfSk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGlmICghdGhpcy5faXNTdGFydGVkKSB7IHJldHVybjsgfVxuICAgIC8vIGB0aGlzLm91dEZyYW1lYCBtdXN0IGJlIHJlY3JlYXRlZCBlYWNoIHRpbWUgYmVjYXVzZVxuICAgIC8vIGl0IGlzIGNvcGllZCBpbiB0aGUgd29ya2VyIGFuZCBsb3N0IGZvciB0aGlzIGNvbnRleHRcbiAgICB0aGlzLm91dEZyYW1lID0gbmV3IEZsb2F0MzJBcnJheShmcmFtZSk7XG5cbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLm91dEZyYW1lLmJ1ZmZlcjtcbiAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh7IGNvbW1hbmQ6ICdwcm9jZXNzJywgYnVmZmVyOiBidWZmZXIgfSwgW2J1ZmZlcl0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHJpZXZlIHRoZSBjcmVhdGVkIGF1ZGlvQnVmZmVyXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICByZXRyaWV2ZSgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdmFyIGNhbGxiYWNrID0gKGUpID0+IHtcbiAgICAgICAgLy8gaWYgY2FsbGVkIHdoZW4gYnVmZmVyIGlzIGZ1bGwsIHN0b3AgdGhlIHJlY29yZGVyIHRvb1xuICAgICAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLndvcmtlci5yZW1vdmVFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgICAgLy8gY3JlYXRlIGFuIGF1ZGlvIGJ1ZmZlciBmcm9tIHRoZSBkYXRhXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoZS5kYXRhLmJ1ZmZlcik7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuXG4gICAgICAgIGNvbnN0IGF1ZGlvQnVmZmVyID0gdGhpcy5jdHguY3JlYXRlQnVmZmVyKDEsIGxlbmd0aCwgc2FtcGxlUmF0ZSk7XG4gICAgICAgIGNvbnN0IGF1ZGlvQXJyYXlCdWZmZXIgPSBhdWRpb0J1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcbiAgICAgICAgYXVkaW9BcnJheUJ1ZmZlci5zZXQoYnVmZmVyLCAwKTtcblxuICAgICAgICByZXNvbHZlKGF1ZGlvQnVmZmVyKTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMud29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBjYWxsYmFjaywgZmFsc2UpO1xuICAgIH0pO1xuICB9XG59Il19