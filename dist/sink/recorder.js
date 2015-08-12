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

var worker = '\nvar buffer;\nvar bufferLength;\nvar currentIndex;\n\nfunction append(block) {\n  var availableSpace = bufferLength - currentIndex;\n\n  // return if already full\n  if (availableSpace <= 0) { return; }\n\n  if (availableSpace < block.length) {\n    block = block.subarray(0, availableSpace);\n  }\n\n  buffer.set(block, currentIndex);\n  currentIndex += block.length;\n}\n\nself.addEventListener(\'message\', function(e) {\n  switch (e.data.command) {\n    case \'init\':\n      bufferLength = e.data.sampleRate * e.data.duration;\n      buffer = new Float32Array(bufferLength);\n      currentIndex = 0;\n      break;\n    case \'process\':\n      var block = new Float32Array(e.data.buffer);\n      append(block);\n      break;\n    case \'retrieve\':\n      var buf = buffer.buffer;\n      self.postMessage({ buffer: buf }, [buf]);\n      break;\n  }\n}, false)';

var audioContext = undefined;

/**
 * Record an audio stream
 */

var Recorder = (function (_BaseLfo) {
  _inherits(Recorder, _BaseLfo);

  function Recorder() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Recorder);

    var defaults = {
      duration: 60 };

    // seconds
    _get(Object.getPrototypeOf(Recorder.prototype), 'constructor', this).call(this, options, defaults);
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
  }

  _createClass(Recorder, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(Recorder.prototype), 'initialize', this).call(this);

      var blob = new Blob([worker], { type: "text/javascript" });
      this.worker = new Worker(window.URL.createObjectURL(blob));

      this.worker.postMessage({
        command: 'init',
        duration: this.params.duration,
        sampleRate: this.streamParams.sourceSampleRate
      });
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
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
          _this.worker.removeEventListener('message', callback, false);
          // create an audio buffer from the data
          var buffer = new Float32Array(e.data.buffer);
          var audioBuffer = _this.ctx.createBuffer(1, buffer.length, _this.streamParams.sourceSampleRate);
          var audioArrayBuffer = audioBuffer.getChannelData(0);
          audioArrayBuffer.set(buffer, 0);

          resolve(audioBuffer);
        };

        _this.worker.addEventListener('message', callback, false);
        _this.worker.postMessage({ command: 'retrieve' });
      });
    }
  }]);

  return Recorder;
})(_coreBaseLfo2['default']);

exports['default'] = Recorder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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Y0FBSyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN6RCxjQUFLLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztPQUNsRCxDQUFDLENBQUM7S0FDSjs7O1NBNURrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiJlczYvc2luay9yZWNvcmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG5jb25zdCB3b3JrZXIgPSBgXG52YXIgYnVmZmVyO1xudmFyIGJ1ZmZlckxlbmd0aDtcbnZhciBjdXJyZW50SW5kZXg7XG5cbmZ1bmN0aW9uIGFwcGVuZChibG9jaykge1xuICB2YXIgYXZhaWxhYmxlU3BhY2UgPSBidWZmZXJMZW5ndGggLSBjdXJyZW50SW5kZXg7XG5cbiAgLy8gcmV0dXJuIGlmIGFscmVhZHkgZnVsbFxuICBpZiAoYXZhaWxhYmxlU3BhY2UgPD0gMCkgeyByZXR1cm47IH1cblxuICBpZiAoYXZhaWxhYmxlU3BhY2UgPCBibG9jay5sZW5ndGgpIHtcbiAgICBibG9jayA9IGJsb2NrLnN1YmFycmF5KDAsIGF2YWlsYWJsZVNwYWNlKTtcbiAgfVxuXG4gIGJ1ZmZlci5zZXQoYmxvY2ssIGN1cnJlbnRJbmRleCk7XG4gIGN1cnJlbnRJbmRleCArPSBibG9jay5sZW5ndGg7XG59XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKGUpIHtcbiAgc3dpdGNoIChlLmRhdGEuY29tbWFuZCkge1xuICAgIGNhc2UgJ2luaXQnOlxuICAgICAgYnVmZmVyTGVuZ3RoID0gZS5kYXRhLnNhbXBsZVJhdGUgKiBlLmRhdGEuZHVyYXRpb247XG4gICAgICBidWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KGJ1ZmZlckxlbmd0aCk7XG4gICAgICBjdXJyZW50SW5kZXggPSAwO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncHJvY2Vzcyc6XG4gICAgICB2YXIgYmxvY2sgPSBuZXcgRmxvYXQzMkFycmF5KGUuZGF0YS5idWZmZXIpO1xuICAgICAgYXBwZW5kKGJsb2NrKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3JldHJpZXZlJzpcbiAgICAgIHZhciBidWYgPSBidWZmZXIuYnVmZmVyO1xuICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7IGJ1ZmZlcjogYnVmIH0sIFtidWZdKTtcbiAgICAgIGJyZWFrO1xuICB9XG59LCBmYWxzZSlgO1xuXG5sZXQgYXVkaW9Db250ZXh0O1xuXG4vKipcbiAqIFJlY29yZCBhbiBhdWRpbyBzdHJlYW1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjb3JkZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBkdXJhdGlvbjogNjAsIC8vIHNlY29uZHNcbiAgICB9O1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuICAgIHRoaXMubWV0YURhdGEgPSB7fTtcblxuICAgIC8vIG5lZWRlZCB0byByZXRyaXZlIGFuIEF1ZGlvQnVmZmVyXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5jdHgpIHtcbiAgICAgIGlmICghYXVkaW9Db250ZXh0KSB7IGF1ZGlvQ29udGV4dCA9IG5ldyB3aW5kb3cuQXVkaW9Db250ZXh0KCk7IH1cbiAgICAgIHRoaXMuY3R4ID0gYXVkaW9Db250ZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN0eCA9IHRoaXMucGFyYW1zLmN0eDtcbiAgICB9XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcblxuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbd29ya2VyXSwgeyB0eXBlOiBcInRleHQvamF2YXNjcmlwdFwiIH0pO1xuICAgIHRoaXMud29ya2VyID0gbmV3IFdvcmtlcih3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKSk7XG5cbiAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh7XG4gICAgICBjb21tYW5kOiAnaW5pdCcsXG4gICAgICBkdXJhdGlvbjogdGhpcy5wYXJhbXMuZHVyYXRpb24sXG4gICAgICBzYW1wbGVSYXRlOiB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlXG4gICAgfSk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIC8vIGB0aGlzLm91dEZyYW1lYCBtdXN0IGJlIHJlY3JlYXRlZCBlYWNoIHRpbWUgYmVjYXVzZVxuICAgIC8vIGl0IGlzIGNvcGllZCBpbiB0aGUgd29ya2VyIGFuZCBsb3N0IGZvciB0aGlzIGNvbnRleHRcbiAgICB0aGlzLm91dEZyYW1lID0gbmV3IEZsb2F0MzJBcnJheShmcmFtZSk7XG5cbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLm91dEZyYW1lLmJ1ZmZlcjtcbiAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh7IGNvbW1hbmQ6ICdwcm9jZXNzJywgYnVmZmVyOiBidWZmZXIgfSwgW2J1ZmZlcl0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHJpZXZlIHRoZSBjcmVhdGVkIGF1ZGlvQnVmZmVyXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICByZXRyaWV2ZSgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdmFyIGNhbGxiYWNrID0gKGUpID0+IHtcbiAgICAgICAgdGhpcy53b3JrZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgIC8vIGNyZWF0ZSBhbiBhdWRpbyBidWZmZXIgZnJvbSB0aGUgZGF0YVxuICAgICAgICBjb25zdCBidWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KGUuZGF0YS5idWZmZXIpO1xuICAgICAgICBjb25zdCBhdWRpb0J1ZmZlciA9IHRoaXMuY3R4LmNyZWF0ZUJ1ZmZlcigxLCBidWZmZXIubGVuZ3RoLCB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlKTtcbiAgICAgICAgY29uc3QgYXVkaW9BcnJheUJ1ZmZlciA9IGF1ZGlvQnVmZmVyLmdldENoYW5uZWxEYXRhKDApO1xuICAgICAgICBhdWRpb0FycmF5QnVmZmVyLnNldChidWZmZXIsIDApO1xuXG4gICAgICAgIHJlc29sdmUoYXVkaW9CdWZmZXIpO1xuICAgICAgfTtcblxuICAgICAgdGhpcy53b3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh7IGNvbW1hbmQ6ICdyZXRyaWV2ZScgfSk7XG4gICAgfSk7XG4gIH1cbn0iXX0=