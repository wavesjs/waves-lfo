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

var worker = '\nvar _separateArrays = false;\nvar _data = [];\nvar _separateArraysData = { time: [], data: [] };\n\nfunction init() {\n  _data.length = 0;\n  _separateArraysData.time.length = 0;\n  _separateArraysData.data.length = 0;\n}\n\nfunction process(time, data) {\n  if (_separateArrays) {\n    _separateArraysData.time.push(time);\n    _separateArraysData.data.push(data);\n  } else {\n    var datum = { time: time, data: data };\n    _data.push(datum);\n  }\n}\n\nself.addEventListener(\'message\', function(e) {\n  switch (e.data.command) {\n    case \'init\':\n      _separateArrays = e.data.separateArrays;\n      init();\n      break;\n    case \'process\':\n      var time = e.data.time;\n      var data = new Float32Array(e.data.buffer);\n      process(time, data);\n      break;\n    case \'stop\':\n      var data = _separateArrays ? _separateArraysData : _data;\n      self.postMessage({ data: data });\n      init();\n      break;\n  }\n});\n';

var DataRecorder = (function (_BaseLfo) {
  _inherits(DataRecorder, _BaseLfo);

  function DataRecorder(options) {
    _classCallCheck(this, DataRecorder);

    _get(Object.getPrototypeOf(DataRecorder.prototype), 'constructor', this).call(this, {
      // default format is [{time, data}, {time, data}]
      // if set to `true` format is { time: [...], data: [...] }
      separateArrays: false
    }, options);

    // @todo - rename `isRecording`
    this._isStarted = false;

    // init worker
    var blob = new Blob([worker], { type: 'text/javascript' });
    this.worker = new Worker(window.URL.createObjectURL(blob));
  }

  _createClass(DataRecorder, [{
    key: 'initialize',
    value: function initialize(inStreamParams) {
      _get(Object.getPrototypeOf(DataRecorder.prototype), 'initialize', this).call(this, inStreamParams);

      this.worker.postMessage({
        command: 'init',
        separateArrays: this.params.separateArrays
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
      if (this._isStarted) {
        this.worker.postMessage({ command: 'stop' });
        this._isStarted = false;
      }
    }
  }, {
    key: 'finalize',
    value: function finalize() {
      this.stop();
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      if (!this._isStarted) {
        return;
      }

      this.outFrame = new Float32Array(frame);
      var buffer = this.outFrame.buffer;

      this.worker.postMessage({
        command: 'process',
        time: time,
        buffer: buffer
      }, [buffer]);
    }
  }, {
    key: 'retrieve',
    value: function retrieve() {
      var _this = this;

      return new _Promise(function (resolve, reject) {
        var callback = function callback(e) {
          _this._started = false;

          _this.worker.removeEventListener('message', callback, false);
          resolve(e.data.data);
        };

        _this.worker.addEventListener('message', callback, false);
      });
    }
  }]);

  return DataRecorder;
})(_coreBaseLfo2['default']);

exports['default'] = DataRecorder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy9kYXRhLXJlY29yZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7O0FBRXRDLElBQU0sTUFBTSx5N0JBdUNYLENBQUM7O0lBRW1CLFlBQVk7WUFBWixZQUFZOztBQUNwQixXQURRLFlBQVksQ0FDbkIsT0FBTyxFQUFFOzBCQURGLFlBQVk7O0FBRTdCLCtCQUZpQixZQUFZLDZDQUV2Qjs7O0FBR0osb0JBQWMsRUFBRSxLQUFLO0tBQ3RCLEVBQUUsT0FBTyxFQUFFOzs7QUFHWixRQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQzs7O0FBR3hCLFFBQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO0FBQzdELFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUM1RDs7ZUFka0IsWUFBWTs7V0FnQnJCLG9CQUFDLGNBQWMsRUFBRTtBQUN6QixpQ0FqQmlCLFlBQVksNENBaUJaLGNBQWMsRUFBRTs7QUFFakMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDdEIsZUFBTyxFQUFFLE1BQU07QUFDZixzQkFBYyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYztPQUMzQyxDQUFDLENBQUM7S0FDSjs7O1dBRUksaUJBQUc7QUFDTixVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztLQUN4Qjs7O1dBRUcsZ0JBQUc7QUFDTCxVQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDbkIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUM3QyxZQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztPQUN6QjtLQUNGOzs7V0FFTyxvQkFBRztBQUNULFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUFFLGVBQU87T0FBRTs7QUFFakMsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QyxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzs7QUFFcEMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDdEIsZUFBTyxFQUFFLFNBQVM7QUFDbEIsWUFBSSxFQUFFLElBQUk7QUFDVixjQUFNLEVBQUUsTUFBTTtPQUNmLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBRWQ7OztXQUVPLG9CQUFHOzs7QUFDVCxhQUFPLGFBQVksVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3RDLFlBQU0sUUFBUSxHQUFHLFNBQVgsUUFBUSxDQUFJLENBQUMsRUFBSztBQUN0QixnQkFBSyxRQUFRLEdBQUcsS0FBSyxDQUFDOztBQUV0QixnQkFBSyxNQUFNLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM1RCxpQkFBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEIsQ0FBQzs7QUFFRixjQUFLLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQzFELENBQUMsQ0FBQztLQUNKOzs7U0FqRWtCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6ImVzNi9zaW5rcy9kYXRhLXJlY29yZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cbmNvbnN0IHdvcmtlciA9IGBcbnZhciBfc2VwYXJhdGVBcnJheXMgPSBmYWxzZTtcbnZhciBfZGF0YSA9IFtdO1xudmFyIF9zZXBhcmF0ZUFycmF5c0RhdGEgPSB7IHRpbWU6IFtdLCBkYXRhOiBbXSB9O1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICBfZGF0YS5sZW5ndGggPSAwO1xuICBfc2VwYXJhdGVBcnJheXNEYXRhLnRpbWUubGVuZ3RoID0gMDtcbiAgX3NlcGFyYXRlQXJyYXlzRGF0YS5kYXRhLmxlbmd0aCA9IDA7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3ModGltZSwgZGF0YSkge1xuICBpZiAoX3NlcGFyYXRlQXJyYXlzKSB7XG4gICAgX3NlcGFyYXRlQXJyYXlzRGF0YS50aW1lLnB1c2godGltZSk7XG4gICAgX3NlcGFyYXRlQXJyYXlzRGF0YS5kYXRhLnB1c2goZGF0YSk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGRhdHVtID0geyB0aW1lOiB0aW1lLCBkYXRhOiBkYXRhIH07XG4gICAgX2RhdGEucHVzaChkYXR1bSk7XG4gIH1cbn1cblxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24oZSkge1xuICBzd2l0Y2ggKGUuZGF0YS5jb21tYW5kKSB7XG4gICAgY2FzZSAnaW5pdCc6XG4gICAgICBfc2VwYXJhdGVBcnJheXMgPSBlLmRhdGEuc2VwYXJhdGVBcnJheXM7XG4gICAgICBpbml0KCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdwcm9jZXNzJzpcbiAgICAgIHZhciB0aW1lID0gZS5kYXRhLnRpbWU7XG4gICAgICB2YXIgZGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoZS5kYXRhLmJ1ZmZlcik7XG4gICAgICBwcm9jZXNzKHRpbWUsIGRhdGEpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc3RvcCc6XG4gICAgICB2YXIgZGF0YSA9IF9zZXBhcmF0ZUFycmF5cyA/IF9zZXBhcmF0ZUFycmF5c0RhdGEgOiBfZGF0YTtcbiAgICAgIHNlbGYucG9zdE1lc3NhZ2UoeyBkYXRhOiBkYXRhIH0pO1xuICAgICAgaW5pdCgpO1xuICAgICAgYnJlYWs7XG4gIH1cbn0pO1xuYDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGF0YVJlY29yZGVyIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICAvLyBkZWZhdWx0IGZvcm1hdCBpcyBbe3RpbWUsIGRhdGF9LCB7dGltZSwgZGF0YX1dXG4gICAgICAvLyBpZiBzZXQgdG8gYHRydWVgIGZvcm1hdCBpcyB7IHRpbWU6IFsuLi5dLCBkYXRhOiBbLi4uXSB9XG4gICAgICBzZXBhcmF0ZUFycmF5czogZmFsc2UsXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICAvLyBAdG9kbyAtIHJlbmFtZSBgaXNSZWNvcmRpbmdgXG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG5cbiAgICAvLyBpbml0IHdvcmtlclxuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbd29ya2VyXSwgeyB0eXBlOiAndGV4dC9qYXZhc2NyaXB0JyB9KTtcbiAgICB0aGlzLndvcmtlciA9IG5ldyBXb3JrZXIod2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYikpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShpblN0cmVhbVBhcmFtcykge1xuICAgIHN1cGVyLmluaXRpYWxpemUoaW5TdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgICAgY29tbWFuZDogJ2luaXQnLFxuICAgICAgc2VwYXJhdGVBcnJheXM6IHRoaXMucGFyYW1zLnNlcGFyYXRlQXJyYXlzLFxuICAgIH0pO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5faXNTdGFydGVkID0gdHJ1ZTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgaWYgKHRoaXMuX2lzU3RhcnRlZCkge1xuICAgICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2UoeyBjb21tYW5kOiAnc3RvcCcgfSk7XG4gICAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmaW5hbGl6ZSgpIHtcbiAgICB0aGlzLnN0b3AoKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgaWYgKCF0aGlzLl9pc1N0YXJ0ZWQpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLm91dEZyYW1lID0gbmV3IEZsb2F0MzJBcnJheShmcmFtZSk7XG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5vdXRGcmFtZS5idWZmZXI7XG5cbiAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh7XG4gICAgICBjb21tYW5kOiAncHJvY2VzcycsXG4gICAgICB0aW1lOiB0aW1lLFxuICAgICAgYnVmZmVyOiBidWZmZXIsXG4gICAgfSwgW2J1ZmZlcl0pO1xuXG4gIH1cblxuICByZXRyaWV2ZSgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSAoZSkgPT4ge1xuICAgICAgICB0aGlzLl9zdGFydGVkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy53b3JrZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgIHJlc29sdmUoZS5kYXRhLmRhdGEpO1xuICAgICAgfTtcblxuICAgICAgdGhpcy53b3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==