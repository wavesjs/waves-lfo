'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _baseLfo = require('../core/base-lfo');

var _baseLfo2 = _interopRequireDefault(_baseLfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var worker = '\nvar isInfiniteBuffer = false;\nvar stack = [];\nvar buffer;\nvar bufferLength;\nvar currentIndex;\n\nfunction init() {\n  buffer = new Float32Array(bufferLength);\n  stack.length = 0;\n  currentIndex = 0;\n}\n\nfunction append(block) {\n  var availableSpace = bufferLength - currentIndex;\n  var currentBlock;\n  // return if already full\n  if (availableSpace <= 0) { return; }\n\n  if (availableSpace < block.length) {\n    currentBlock = block.subarray(0, availableSpace);\n  } else {\n    currentBlock = block;\n  }\n\n  buffer.set(currentBlock, currentIndex);\n  currentIndex += currentBlock.length;\n\n  if (isInfiniteBuffer && currentIndex === buffer.length) {\n    stack.push(buffer);\n\n    currentBlock = block.subarray(availableSpace);\n    buffer = new Float32Array(buffer.length);\n    buffer.set(currentBlock, 0);\n    currentIndex = currentBlock.length;\n  }\n}\n\nself.addEventListener(\'message\', function(e) {\n  switch (e.data.command) {\n    case \'init\':\n      if (isFinite(e.data.duration)) {\n        bufferLength = e.data.sampleRate * e.data.duration;\n      } else {\n        isInfiniteBuffer = true;\n        bufferLength = e.data.sampleRate * 10;\n      }\n\n      init();\n      break;\n\n    case \'process\':\n      var block = new Float32Array(e.data.buffer);\n      append(block);\n\n\n      // if the buffer is full return it, only works with finite buffers\n      if (!isInfiniteBuffer && currentIndex === bufferLength) {\n        var buf = buffer.buffer.slice(0);\n        self.postMessage({ buffer: buf }, [buf]);\n        init();\n      }\n      break;\n\n    case \'stop\':\n      if (!isInfiniteBuffer) {\n        // @TODO add option to not clip the returned buffer\n        // values in FLoat32Array are 4 bytes long (32 / 8)\n        var copy = buffer.buffer.slice(0, currentIndex * (32 / 8));\n        self.postMessage({ buffer: copy }, [copy]);\n      } else {\n        var copy = new Float32Array(stack.length * bufferLength + currentIndex);\n        stack.forEach(function(buffer, index) {\n          copy.set(buffer, bufferLength * index);\n        });\n\n        copy.set(buffer.subarray(0, currentIndex), stack.length * bufferLength);\n        self.postMessage({ buffer: copy.buffer }, [copy.buffer]);\n      }\n      init();\n      break;\n  }\n}, false)';

var audioContext = void 0;

/**
 * Record an audio stream
 */

var AudioRecorder = function (_BaseLfo) {
  (0, _inherits3.default)(AudioRecorder, _BaseLfo);

  function AudioRecorder(options) {
    (0, _classCallCheck3.default)(this, AudioRecorder);


    // needed to retrive an AudioBuffer

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(AudioRecorder).call(this, {
      duration: 10, // seconds
      ignoreLeadingZeros: true }, // ignore zeros at the beginning of the recoarding
    options));

    if (!_this.params.ctx) {
      if (!audioContext) {
        audioContext = new window.AudioContext();
      }
      _this.ctx = audioContext;
    } else {
      _this.ctx = _this.params.ctx;
    }

    _this._isStarted = false;
    _this._ignoreZeros = false;

    var blob = new Blob([worker], { type: 'text/javascript' });
    _this.worker = new Worker(window.URL.createObjectURL(blob));
    return _this;
  }

  (0, _createClass3.default)(AudioRecorder, [{
    key: 'initialize',
    value: function initialize(inStreamParams) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(AudioRecorder.prototype), 'initialize', this).call(this, inStreamParams);

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
        var i = void 0;

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
      var _this2 = this;

      return new _promise2.default(function (resolve, reject) {
        var callback = function callback(e) {
          // if called when buffer is full, stop the recorder too
          _this2._isStarted = false;

          _this2.worker.removeEventListener('message', callback, false);
          // create an audio buffer from the data
          var buffer = new Float32Array(e.data.buffer);
          var length = buffer.length;
          var sampleRate = _this2.streamParams.sourceSampleRate;

          var audioBuffer = _this2.ctx.createBuffer(1, length, sampleRate);
          var audioArrayBuffer = audioBuffer.getChannelData(0);
          audioArrayBuffer.set(buffer, 0);

          resolve(audioBuffer);
        };

        _this2.worker.addEventListener('message', callback, false);
      });
    }
  }]);
  return AudioRecorder;
}(_baseLfo2.default);

exports.default = AudioRecorder;
//# sourceMappingURL=data:application/json;base64,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U0FBVDtBQUNBLGtCQUFRLE1BQVI7U0FGRixFQUdHLENBQUMsTUFBRCxDQUhILEVBRmE7T0FBZjs7Ozs7Ozs7OzsrQkFhUzs7O0FBQ1QsYUFBTyxzQkFBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3RDLFlBQU0sV0FBVyxTQUFYLFFBQVcsQ0FBQyxDQUFELEVBQU87O0FBRXRCLGlCQUFLLFVBQUwsR0FBa0IsS0FBbEIsQ0FGc0I7O0FBSXRCLGlCQUFLLE1BQUwsQ0FBWSxtQkFBWixDQUFnQyxTQUFoQyxFQUEyQyxRQUEzQyxFQUFxRCxLQUFyRDs7QUFKc0IsY0FNaEIsU0FBUyxJQUFJLFlBQUosQ0FBaUIsRUFBRSxJQUFGLENBQU8sTUFBUCxDQUExQixDQU5nQjtBQU90QixjQUFNLFNBQVMsT0FBTyxNQUFQLENBUE87QUFRdEIsY0FBTSxhQUFhLE9BQUssWUFBTCxDQUFrQixnQkFBbEIsQ0FSRzs7QUFVdEIsY0FBTSxjQUFjLE9BQUssR0FBTCxDQUFTLFlBQVQsQ0FBc0IsQ0FBdEIsRUFBeUIsTUFBekIsRUFBaUMsVUFBakMsQ0FBZCxDQVZnQjtBQVd0QixjQUFNLG1CQUFtQixZQUFZLGNBQVosQ0FBMkIsQ0FBM0IsQ0FBbkIsQ0FYZ0I7QUFZdEIsMkJBQWlCLEdBQWpCLENBQXFCLE1BQXJCLEVBQTZCLENBQTdCLEVBWnNCOztBQWN0QixrQkFBUSxXQUFSLEVBZHNCO1NBQVAsQ0FEcUI7O0FBa0J0QyxlQUFLLE1BQUwsQ0FBWSxnQkFBWixDQUE2QixTQUE3QixFQUF3QyxRQUF4QyxFQUFrRCxLQUFsRCxFQWxCc0M7T0FBckIsQ0FBbkIsQ0FEUzs7O1NBeEZRIiwiZmlsZSI6ImF1ZGlvLXJlY29yZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cbmNvbnN0IHdvcmtlciA9IGBcbnZhciBpc0luZmluaXRlQnVmZmVyID0gZmFsc2U7XG52YXIgc3RhY2sgPSBbXTtcbnZhciBidWZmZXI7XG52YXIgYnVmZmVyTGVuZ3RoO1xudmFyIGN1cnJlbnRJbmRleDtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShidWZmZXJMZW5ndGgpO1xuICBzdGFjay5sZW5ndGggPSAwO1xuICBjdXJyZW50SW5kZXggPSAwO1xufVxuXG5mdW5jdGlvbiBhcHBlbmQoYmxvY2spIHtcbiAgdmFyIGF2YWlsYWJsZVNwYWNlID0gYnVmZmVyTGVuZ3RoIC0gY3VycmVudEluZGV4O1xuICB2YXIgY3VycmVudEJsb2NrO1xuICAvLyByZXR1cm4gaWYgYWxyZWFkeSBmdWxsXG4gIGlmIChhdmFpbGFibGVTcGFjZSA8PSAwKSB7IHJldHVybjsgfVxuXG4gIGlmIChhdmFpbGFibGVTcGFjZSA8IGJsb2NrLmxlbmd0aCkge1xuICAgIGN1cnJlbnRCbG9jayA9IGJsb2NrLnN1YmFycmF5KDAsIGF2YWlsYWJsZVNwYWNlKTtcbiAgfSBlbHNlIHtcbiAgICBjdXJyZW50QmxvY2sgPSBibG9jaztcbiAgfVxuXG4gIGJ1ZmZlci5zZXQoY3VycmVudEJsb2NrLCBjdXJyZW50SW5kZXgpO1xuICBjdXJyZW50SW5kZXggKz0gY3VycmVudEJsb2NrLmxlbmd0aDtcblxuICBpZiAoaXNJbmZpbml0ZUJ1ZmZlciAmJiBjdXJyZW50SW5kZXggPT09IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICBzdGFjay5wdXNoKGJ1ZmZlcik7XG5cbiAgICBjdXJyZW50QmxvY2sgPSBibG9jay5zdWJhcnJheShhdmFpbGFibGVTcGFjZSk7XG4gICAgYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShidWZmZXIubGVuZ3RoKTtcbiAgICBidWZmZXIuc2V0KGN1cnJlbnRCbG9jaywgMCk7XG4gICAgY3VycmVudEluZGV4ID0gY3VycmVudEJsb2NrLmxlbmd0aDtcbiAgfVxufVxuXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbihlKSB7XG4gIHN3aXRjaCAoZS5kYXRhLmNvbW1hbmQpIHtcbiAgICBjYXNlICdpbml0JzpcbiAgICAgIGlmIChpc0Zpbml0ZShlLmRhdGEuZHVyYXRpb24pKSB7XG4gICAgICAgIGJ1ZmZlckxlbmd0aCA9IGUuZGF0YS5zYW1wbGVSYXRlICogZS5kYXRhLmR1cmF0aW9uO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXNJbmZpbml0ZUJ1ZmZlciA9IHRydWU7XG4gICAgICAgIGJ1ZmZlckxlbmd0aCA9IGUuZGF0YS5zYW1wbGVSYXRlICogMTA7XG4gICAgICB9XG5cbiAgICAgIGluaXQoKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAncHJvY2Vzcyc6XG4gICAgICB2YXIgYmxvY2sgPSBuZXcgRmxvYXQzMkFycmF5KGUuZGF0YS5idWZmZXIpO1xuICAgICAgYXBwZW5kKGJsb2NrKTtcblxuXG4gICAgICAvLyBpZiB0aGUgYnVmZmVyIGlzIGZ1bGwgcmV0dXJuIGl0LCBvbmx5IHdvcmtzIHdpdGggZmluaXRlIGJ1ZmZlcnNcbiAgICAgIGlmICghaXNJbmZpbml0ZUJ1ZmZlciAmJiBjdXJyZW50SW5kZXggPT09IGJ1ZmZlckxlbmd0aCkge1xuICAgICAgICB2YXIgYnVmID0gYnVmZmVyLmJ1ZmZlci5zbGljZSgwKTtcbiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7IGJ1ZmZlcjogYnVmIH0sIFtidWZdKTtcbiAgICAgICAgaW5pdCgpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdzdG9wJzpcbiAgICAgIGlmICghaXNJbmZpbml0ZUJ1ZmZlcikge1xuICAgICAgICAvLyBAVE9ETyBhZGQgb3B0aW9uIHRvIG5vdCBjbGlwIHRoZSByZXR1cm5lZCBidWZmZXJcbiAgICAgICAgLy8gdmFsdWVzIGluIEZMb2F0MzJBcnJheSBhcmUgNCBieXRlcyBsb25nICgzMiAvIDgpXG4gICAgICAgIHZhciBjb3B5ID0gYnVmZmVyLmJ1ZmZlci5zbGljZSgwLCBjdXJyZW50SW5kZXggKiAoMzIgLyA4KSk7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoeyBidWZmZXI6IGNvcHkgfSwgW2NvcHldKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBjb3B5ID0gbmV3IEZsb2F0MzJBcnJheShzdGFjay5sZW5ndGggKiBidWZmZXJMZW5ndGggKyBjdXJyZW50SW5kZXgpO1xuICAgICAgICBzdGFjay5mb3JFYWNoKGZ1bmN0aW9uKGJ1ZmZlciwgaW5kZXgpIHtcbiAgICAgICAgICBjb3B5LnNldChidWZmZXIsIGJ1ZmZlckxlbmd0aCAqIGluZGV4KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29weS5zZXQoYnVmZmVyLnN1YmFycmF5KDAsIGN1cnJlbnRJbmRleCksIHN0YWNrLmxlbmd0aCAqIGJ1ZmZlckxlbmd0aCk7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoeyBidWZmZXI6IGNvcHkuYnVmZmVyIH0sIFtjb3B5LmJ1ZmZlcl0pO1xuICAgICAgfVxuICAgICAgaW5pdCgpO1xuICAgICAgYnJlYWs7XG4gIH1cbn0sIGZhbHNlKWA7XG5cbmxldCBhdWRpb0NvbnRleHQ7XG5cbi8qKlxuICogUmVjb3JkIGFuIGF1ZGlvIHN0cmVhbVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdWRpb1JlY29yZGVyIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICBkdXJhdGlvbjogMTAsIC8vIHNlY29uZHNcbiAgICAgIGlnbm9yZUxlYWRpbmdaZXJvczogdHJ1ZSwgLy8gaWdub3JlIHplcm9zIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIHJlY29hcmRpbmdcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIC8vIG5lZWRlZCB0byByZXRyaXZlIGFuIEF1ZGlvQnVmZmVyXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5jdHgpIHtcbiAgICAgIGlmICghYXVkaW9Db250ZXh0KSB7IGF1ZGlvQ29udGV4dCA9IG5ldyB3aW5kb3cuQXVkaW9Db250ZXh0KCk7IH1cbiAgICAgIHRoaXMuY3R4ID0gYXVkaW9Db250ZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN0eCA9IHRoaXMucGFyYW1zLmN0eDtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9pZ25vcmVaZXJvcyA9IGZhbHNlO1xuXG4gICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFt3b3JrZXJdLCB7IHR5cGU6ICd0ZXh0L2phdmFzY3JpcHQnIH0pO1xuICAgIHRoaXMud29ya2VyID0gbmV3IFdvcmtlcih3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKSk7XG4gIH1cblxuICBpbml0aWFsaXplKGluU3RyZWFtUGFyYW1zKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZShpblN0cmVhbVBhcmFtcyk7XG5cbiAgICAvLyBwcm9wYWdhdGUgYHN0cmVhbVBhcmFtc2AgdG8gdGhlIHdvcmtlclxuICAgIHRoaXMud29ya2VyLnBvc3RNZXNzYWdlKHtcbiAgICAgIGNvbW1hbmQ6ICdpbml0JyxcbiAgICAgIGR1cmF0aW9uOiB0aGlzLnBhcmFtcy5kdXJhdGlvbixcbiAgICAgIHNhbXBsZVJhdGU6IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGVcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuX2lzU3RhcnRlZCA9IHRydWU7XG4gICAgdGhpcy5faWdub3JlWmVyb3MgPSB0aGlzLnBhcmFtcy5pZ25vcmVMZWFkaW5nWmVyb3M7XG5cbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgaWYgKHRoaXMuX2lzU3RhcnRlZCkge1xuICAgICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2UoeyBjb21tYW5kOiAnc3RvcCcgfSk7XG4gICAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBjYWxsZWQgd2hlbiBgc3RvcGAgaXMgdHJpZ2dlcmVkIG9uIHRoZSBzb3VyY2VcbiAgLy8gQHRvZG8gLSBvcHRpb25uYWx5IHRydW5jYXRlIHJldHJpZXZlZCBidWZmZXIgdG8gZW5kIHRpbWVcbiAgZmluYWxpemUoZW5kVGltZSkge1xuICAgIHRoaXMuc3RvcCgpO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICBpZiAoIXRoaXMuX2lzU3RhcnRlZCkgeyByZXR1cm47IH1cbiAgICAvLyBgdGhpcy5vdXRGcmFtZWAgbXVzdCBiZSByZWNyZWF0ZWQgZWFjaCB0aW1lIGJlY2F1c2VcbiAgICAvLyBpdCBpcyBjb3BpZWQgaW4gdGhlIHdvcmtlciBhbmQgbG9zdCBmb3IgdGhpcyBjb250ZXh0XG4gICAgbGV0IHNlbmRGcmFtZSA9IG51bGw7XG5cbiAgICBpZiAoIXRoaXMuX2lnbm9yZVplcm9zKSB7XG4gICAgICBzZW5kRnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KGZyYW1lKTtcbiAgICB9IGVsc2UgaWYgKGZyYW1lW2ZyYW1lLmxlbmd0aCAtIDFdICE9PSAwKSB7XG4gICAgICBjb25zdCBsZW4gPSBmcmFtZS5sZW5ndGg7XG4gICAgICBsZXQgaTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChmcmFtZVtpXSAhPT0gMClcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgLy8gY29weSBub24gemVybyBzZWdtZW50XG4gICAgICBzZW5kRnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KGZyYW1lLnN1YmFycmF5KGkpKTtcbiAgICAgIHRoaXMuX2lnbm9yZVplcm9zID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHNlbmRGcmFtZSkge1xuICAgICAgY29uc3QgYnVmZmVyID0gc2VuZEZyYW1lLmJ1ZmZlcjtcbiAgICAgIHRoaXMud29ya2VyLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgY29tbWFuZDogJ3Byb2Nlc3MnLFxuICAgICAgICBidWZmZXI6IGJ1ZmZlclxuICAgICAgfSwgW2J1ZmZlcl0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiByZXRyaWV2ZSB0aGUgY3JlYXRlZCBhdWRpb0J1ZmZlclxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgcmV0cmlldmUoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gKGUpID0+IHtcbiAgICAgICAgLy8gaWYgY2FsbGVkIHdoZW4gYnVmZmVyIGlzIGZ1bGwsIHN0b3AgdGhlIHJlY29yZGVyIHRvb1xuICAgICAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLndvcmtlci5yZW1vdmVFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgICAgLy8gY3JlYXRlIGFuIGF1ZGlvIGJ1ZmZlciBmcm9tIHRoZSBkYXRhXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoZS5kYXRhLmJ1ZmZlcik7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuXG4gICAgICAgIGNvbnN0IGF1ZGlvQnVmZmVyID0gdGhpcy5jdHguY3JlYXRlQnVmZmVyKDEsIGxlbmd0aCwgc2FtcGxlUmF0ZSk7XG4gICAgICAgIGNvbnN0IGF1ZGlvQXJyYXlCdWZmZXIgPSBhdWRpb0J1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcbiAgICAgICAgYXVkaW9BcnJheUJ1ZmZlci5zZXQoYnVmZmVyLCAwKTtcblxuICAgICAgICByZXNvbHZlKGF1ZGlvQnVmZmVyKTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMud29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBjYWxsYmFjaywgZmFsc2UpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=