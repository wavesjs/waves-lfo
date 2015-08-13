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

var worker = '\nvar isInfiniteBuffer = false;\nvar stack = [];\nvar buffer;\nvar bufferLength;\nvar currentIndex;\n\nfunction init() {\n  buffer = new Float32Array(bufferLength);\n  stack.length = 0;\n  currentIndex = 0;\n}\n\nfunction append(block) {\n  var availableSpace = bufferLength - currentIndex;\n  var currentBlock;\n  // return if already full\n  if (availableSpace <= 0) { return; }\n\n  if (availableSpace < block.length) {\n    currentBlock = block.subarray(0, availableSpace);\n  } else {\n    currentBlock = block;\n  }\n\n  buffer.set(currentBlock, currentIndex);\n  currentIndex += currentBlock.length;\n\n  if (isInfiniteBuffer && currentIndex === buffer.length) {\n    stack.push(buffer);\n\n    currentBlock = block.subarray(availableSpace);\n    buffer = new Float32Array(buffer.length);\n    buffer.set(currentBlock, 0);\n    currentIndex = currentBlock.length;\n  }\n}\n\nself.addEventListener(\'message\', function(e) {\n  switch (e.data.command) {\n    case \'init\':\n      if (isFinite(e.data.duration)) {\n        bufferLength = e.data.sampleRate * e.data.duration;\n      } else {\n        isInfiniteBuffer = true;\n        bufferLength = e.data.sampleRate * 10;\n      }\n\n      init();\n      break;\n\n    case \'process\':\n      var block = new Float32Array(e.data.buffer);\n      append(block);\n\n      // if the buffer is full return it, only works with finite buffers\n      if (!isInfiniteBuffer && currentIndex === bufferLength) {\n        var buf = buffer.buffer.slice(0);\n        self.postMessage({ buffer: buf }, [buf]);\n        init();\n      }\n      break;\n\n    case \'finalize\':\n      if (!isInfiniteBuffer) {\n        // @TODO add option to not clip the returned buffer\n        // values in FLoat32Array are 4 bytes long (32 / 8)\n        var copy = buffer.buffer.slice(0, currentIndex * (32 / 8));\n        self.postMessage({ buffer: copy }, [copy]);\n      } else {\n        var copy = new Float32Array(stack.length * bufferLength + currentIndex);\n        stack.forEach(function(buffer, index) {\n          copy.set(buffer, bufferLength * index);\n        });\n\n        copy.set(buffer.subarray(0, currentIndex), stack.length * bufferLength);\n        self.postMessage({ buffer: copy.buffer }, [copy.buffer]);\n      }\n      init();\n      break;\n  }\n}, false)';

var audioContext = undefined;

/**
 * Record an audio stream
 */

var AudioRecorder = (function (_BaseLfo) {
  _inherits(AudioRecorder, _BaseLfo);

  function AudioRecorder(options) {
    _classCallCheck(this, AudioRecorder);

    var defaults = {
      duration: 10 };

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
      this.finalize();
      this._isStarted = false;
    }

    // called when `stop` is triggered on the source
  }, {
    key: 'finalize',
    value: function finalize() {
      if (!this._isStarted) {
        return;
      } // don't finalize if not started
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy9hdWRpby1yZWNvcmRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7OztBQUV0QyxJQUFNLE1BQU0sMndFQWlGRixDQUFDOztBQUVYLElBQUksWUFBWSxZQUFBLENBQUM7Ozs7OztJQUtJLGFBQWE7WUFBYixhQUFhOztBQUNyQixXQURRLGFBQWEsQ0FDcEIsT0FBTyxFQUFFOzBCQURGLGFBQWE7O0FBRTlCLFFBQU0sUUFBUSxHQUFHO0FBQ2YsY0FBUSxFQUFFLEVBQUUsRUFDYixDQUFDOzs7QUFFRiwrQkFOaUIsYUFBYSw2Q0FNeEIsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUN6QixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQzs7O0FBR25CLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtBQUNwQixVQUFJLENBQUMsWUFBWSxFQUFFO0FBQUUsb0JBQVksR0FBRyxJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztPQUFFO0FBQ2hFLFVBQUksQ0FBQyxHQUFHLEdBQUcsWUFBWSxDQUFDO0tBQ3pCLE1BQU07QUFDTCxVQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0tBQzVCOztBQUVELFFBQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO0FBQzdELFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUM1RDs7ZUFuQmtCLGFBQWE7O1dBcUJ0QixzQkFBRztBQUNYLGlDQXRCaUIsYUFBYSw0Q0FzQlg7O0FBRW5CLFVBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBQ3RCLGVBQU8sRUFBRSxNQUFNO0FBQ2YsZ0JBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVE7QUFDOUIsa0JBQVUsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQjtPQUMvQyxDQUFDLENBQUM7S0FDSjs7O1dBRUksaUJBQUc7QUFDTixVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztLQUN4Qjs7O1dBRUcsZ0JBQUc7QUFDTCxVQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDaEIsVUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7S0FDekI7Ozs7O1dBR08sb0JBQUc7QUFDVCxVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUFFLGVBQU87T0FBRTtBQUNqQyxVQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0tBQ2xEOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUFFLGVBQU87T0FBRTs7O0FBR2pDLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXhDLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQ3BDLFVBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQzNFOzs7Ozs7OztXQU1PLG9CQUFHOzs7QUFDVCxhQUFPLGFBQVksVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3RDLFlBQU0sUUFBUSxHQUFHLFNBQVgsUUFBUSxDQUFJLENBQUMsRUFBSzs7QUFFdEIsZ0JBQUssVUFBVSxHQUFHLEtBQUssQ0FBQzs7QUFFeEIsZ0JBQUssTUFBTSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRTVELGNBQU0sTUFBTSxHQUFHLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDL0MsY0FBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUM3QixjQUFNLFVBQVUsR0FBRyxNQUFLLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQzs7QUFFdEQsY0FBTSxXQUFXLEdBQUcsTUFBSyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDakUsY0FBTSxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELDBCQUFnQixDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRWhDLGlCQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDdEIsQ0FBQzs7QUFFRixjQUFLLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQzFELENBQUMsQ0FBQztLQUNKOzs7U0FqRmtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6ImVzNi9zaW5rcy9hdWRpby1yZWNvcmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG5jb25zdCB3b3JrZXIgPSBgXG52YXIgaXNJbmZpbml0ZUJ1ZmZlciA9IGZhbHNlO1xudmFyIHN0YWNrID0gW107XG52YXIgYnVmZmVyO1xudmFyIGJ1ZmZlckxlbmd0aDtcbnZhciBjdXJyZW50SW5kZXg7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gIGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoYnVmZmVyTGVuZ3RoKTtcbiAgc3RhY2subGVuZ3RoID0gMDtcbiAgY3VycmVudEluZGV4ID0gMDtcbn1cblxuZnVuY3Rpb24gYXBwZW5kKGJsb2NrKSB7XG4gIHZhciBhdmFpbGFibGVTcGFjZSA9IGJ1ZmZlckxlbmd0aCAtIGN1cnJlbnRJbmRleDtcbiAgdmFyIGN1cnJlbnRCbG9jaztcbiAgLy8gcmV0dXJuIGlmIGFscmVhZHkgZnVsbFxuICBpZiAoYXZhaWxhYmxlU3BhY2UgPD0gMCkgeyByZXR1cm47IH1cblxuICBpZiAoYXZhaWxhYmxlU3BhY2UgPCBibG9jay5sZW5ndGgpIHtcbiAgICBjdXJyZW50QmxvY2sgPSBibG9jay5zdWJhcnJheSgwLCBhdmFpbGFibGVTcGFjZSk7XG4gIH0gZWxzZSB7XG4gICAgY3VycmVudEJsb2NrID0gYmxvY2s7XG4gIH1cblxuICBidWZmZXIuc2V0KGN1cnJlbnRCbG9jaywgY3VycmVudEluZGV4KTtcbiAgY3VycmVudEluZGV4ICs9IGN1cnJlbnRCbG9jay5sZW5ndGg7XG5cbiAgaWYgKGlzSW5maW5pdGVCdWZmZXIgJiYgY3VycmVudEluZGV4ID09PSBidWZmZXIubGVuZ3RoKSB7XG4gICAgc3RhY2sucHVzaChidWZmZXIpO1xuXG4gICAgY3VycmVudEJsb2NrID0gYmxvY2suc3ViYXJyYXkoYXZhaWxhYmxlU3BhY2UpO1xuICAgIGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoYnVmZmVyLmxlbmd0aCk7XG4gICAgYnVmZmVyLnNldChjdXJyZW50QmxvY2ssIDApO1xuICAgIGN1cnJlbnRJbmRleCA9IGN1cnJlbnRCbG9jay5sZW5ndGg7XG4gIH1cbn1cblxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24oZSkge1xuICBzd2l0Y2ggKGUuZGF0YS5jb21tYW5kKSB7XG4gICAgY2FzZSAnaW5pdCc6XG4gICAgICBpZiAoaXNGaW5pdGUoZS5kYXRhLmR1cmF0aW9uKSkge1xuICAgICAgICBidWZmZXJMZW5ndGggPSBlLmRhdGEuc2FtcGxlUmF0ZSAqIGUuZGF0YS5kdXJhdGlvbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlzSW5maW5pdGVCdWZmZXIgPSB0cnVlO1xuICAgICAgICBidWZmZXJMZW5ndGggPSBlLmRhdGEuc2FtcGxlUmF0ZSAqIDEwO1xuICAgICAgfVxuXG4gICAgICBpbml0KCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3Byb2Nlc3MnOlxuICAgICAgdmFyIGJsb2NrID0gbmV3IEZsb2F0MzJBcnJheShlLmRhdGEuYnVmZmVyKTtcbiAgICAgIGFwcGVuZChibG9jayk7XG5cbiAgICAgIC8vIGlmIHRoZSBidWZmZXIgaXMgZnVsbCByZXR1cm4gaXQsIG9ubHkgd29ya3Mgd2l0aCBmaW5pdGUgYnVmZmVyc1xuICAgICAgaWYgKCFpc0luZmluaXRlQnVmZmVyICYmIGN1cnJlbnRJbmRleCA9PT0gYnVmZmVyTGVuZ3RoKSB7XG4gICAgICAgIHZhciBidWYgPSBidWZmZXIuYnVmZmVyLnNsaWNlKDApO1xuICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHsgYnVmZmVyOiBidWYgfSwgW2J1Zl0pO1xuICAgICAgICBpbml0KCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2ZpbmFsaXplJzpcbiAgICAgIGlmICghaXNJbmZpbml0ZUJ1ZmZlcikge1xuICAgICAgICAvLyBAVE9ETyBhZGQgb3B0aW9uIHRvIG5vdCBjbGlwIHRoZSByZXR1cm5lZCBidWZmZXJcbiAgICAgICAgLy8gdmFsdWVzIGluIEZMb2F0MzJBcnJheSBhcmUgNCBieXRlcyBsb25nICgzMiAvIDgpXG4gICAgICAgIHZhciBjb3B5ID0gYnVmZmVyLmJ1ZmZlci5zbGljZSgwLCBjdXJyZW50SW5kZXggKiAoMzIgLyA4KSk7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoeyBidWZmZXI6IGNvcHkgfSwgW2NvcHldKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBjb3B5ID0gbmV3IEZsb2F0MzJBcnJheShzdGFjay5sZW5ndGggKiBidWZmZXJMZW5ndGggKyBjdXJyZW50SW5kZXgpO1xuICAgICAgICBzdGFjay5mb3JFYWNoKGZ1bmN0aW9uKGJ1ZmZlciwgaW5kZXgpIHtcbiAgICAgICAgICBjb3B5LnNldChidWZmZXIsIGJ1ZmZlckxlbmd0aCAqIGluZGV4KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29weS5zZXQoYnVmZmVyLnN1YmFycmF5KDAsIGN1cnJlbnRJbmRleCksIHN0YWNrLmxlbmd0aCAqIGJ1ZmZlckxlbmd0aCk7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoeyBidWZmZXI6IGNvcHkuYnVmZmVyIH0sIFtjb3B5LmJ1ZmZlcl0pO1xuICAgICAgfVxuICAgICAgaW5pdCgpO1xuICAgICAgYnJlYWs7XG4gIH1cbn0sIGZhbHNlKWA7XG5cbmxldCBhdWRpb0NvbnRleHQ7XG5cbi8qKlxuICogUmVjb3JkIGFuIGF1ZGlvIHN0cmVhbVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdWRpb1JlY29yZGVyIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGR1cmF0aW9uOiAxMCwgLy8gc2Vjb25kc1xuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG4gICAgdGhpcy5tZXRhRGF0YSA9IHt9O1xuXG4gICAgLy8gbmVlZGVkIHRvIHJldHJpdmUgYW4gQXVkaW9CdWZmZXJcbiAgICBpZiAoIXRoaXMucGFyYW1zLmN0eCkge1xuICAgICAgaWYgKCFhdWRpb0NvbnRleHQpIHsgYXVkaW9Db250ZXh0ID0gbmV3IHdpbmRvdy5BdWRpb0NvbnRleHQoKTsgfVxuICAgICAgdGhpcy5jdHggPSBhdWRpb0NvbnRleHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3R4ID0gdGhpcy5wYXJhbXMuY3R4O1xuICAgIH1cblxuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbd29ya2VyXSwgeyB0eXBlOiAndGV4dC9qYXZhc2NyaXB0JyB9KTtcbiAgICB0aGlzLndvcmtlciA9IG5ldyBXb3JrZXIod2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYikpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgLy8gcHJvcGFnYXRlIGBzdHJlYW1QYXJhbXNgIHRvIHRoZSB3b3JrZXJcbiAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh7XG4gICAgICBjb21tYW5kOiAnaW5pdCcsXG4gICAgICBkdXJhdGlvbjogdGhpcy5wYXJhbXMuZHVyYXRpb24sXG4gICAgICBzYW1wbGVSYXRlOiB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlXG4gICAgfSk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSB0cnVlO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gIH1cblxuICAvLyBjYWxsZWQgd2hlbiBgc3RvcGAgaXMgdHJpZ2dlcmVkIG9uIHRoZSBzb3VyY2VcbiAgZmluYWxpemUoKSB7XG4gICAgaWYgKCF0aGlzLl9pc1N0YXJ0ZWQpIHsgcmV0dXJuOyB9IC8vIGRvbid0IGZpbmFsaXplIGlmIG5vdCBzdGFydGVkXG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2UoeyBjb21tYW5kOiAnZmluYWxpemUnIH0pO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICBpZiAoIXRoaXMuX2lzU3RhcnRlZCkgeyByZXR1cm47IH1cbiAgICAvLyBgdGhpcy5vdXRGcmFtZWAgbXVzdCBiZSByZWNyZWF0ZWQgZWFjaCB0aW1lIGJlY2F1c2VcbiAgICAvLyBpdCBpcyBjb3BpZWQgaW4gdGhlIHdvcmtlciBhbmQgbG9zdCBmb3IgdGhpcyBjb250ZXh0XG4gICAgdGhpcy5vdXRGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWUpO1xuXG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5vdXRGcmFtZS5idWZmZXI7XG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2UoeyBjb21tYW5kOiAncHJvY2VzcycsIGJ1ZmZlcjogYnVmZmVyIH0sIFtidWZmZXJdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXRyaWV2ZSB0aGUgY3JlYXRlZCBhdWRpb0J1ZmZlclxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgcmV0cmlldmUoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gKGUpID0+IHtcbiAgICAgICAgLy8gaWYgY2FsbGVkIHdoZW4gYnVmZmVyIGlzIGZ1bGwsIHN0b3AgdGhlIHJlY29yZGVyIHRvb1xuICAgICAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLndvcmtlci5yZW1vdmVFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgICAgLy8gY3JlYXRlIGFuIGF1ZGlvIGJ1ZmZlciBmcm9tIHRoZSBkYXRhXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoZS5kYXRhLmJ1ZmZlcik7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuXG4gICAgICAgIGNvbnN0IGF1ZGlvQnVmZmVyID0gdGhpcy5jdHguY3JlYXRlQnVmZmVyKDEsIGxlbmd0aCwgc2FtcGxlUmF0ZSk7XG4gICAgICAgIGNvbnN0IGF1ZGlvQXJyYXlCdWZmZXIgPSBhdWRpb0J1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcbiAgICAgICAgYXVkaW9BcnJheUJ1ZmZlci5zZXQoYnVmZmVyLCAwKTtcblxuICAgICAgICByZXNvbHZlKGF1ZGlvQnVmZmVyKTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMud29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBjYWxsYmFjaywgZmFsc2UpO1xuICAgIH0pO1xuICB9XG59Il19