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
        console.log('worker:stop');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy9kYXRhLXJlY29yZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7O0FBRXRDLElBQU0sTUFBTSx5N0JBdUNYLENBQUM7O0lBRW1CLFlBQVk7WUFBWixZQUFZOztBQUNwQixXQURRLFlBQVksQ0FDbkIsT0FBTyxFQUFFOzBCQURGLFlBQVk7O0FBRTdCLCtCQUZpQixZQUFZLDZDQUV2Qjs7O0FBR0osb0JBQWMsRUFBRSxLQUFLO0tBQ3RCLEVBQUUsT0FBTyxFQUFFOzs7QUFHWixRQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQzs7O0FBR3hCLFFBQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO0FBQzdELFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUM1RDs7ZUFka0IsWUFBWTs7V0FnQnJCLG9CQUFDLGNBQWMsRUFBRTtBQUN6QixpQ0FqQmlCLFlBQVksNENBaUJaLGNBQWMsRUFBRTs7QUFFakMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDdEIsZUFBTyxFQUFFLE1BQU07QUFDZixzQkFBYyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYztPQUMzQyxDQUFDLENBQUM7S0FDSjs7O1dBRUksaUJBQUc7QUFDTixVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztLQUN4Qjs7O1dBRUcsZ0JBQUc7QUFDTCxVQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDbkIsZUFBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMzQixZQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQzdDLFlBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO09BQ3pCO0tBQ0Y7OztXQUVPLG9CQUFHO0FBQ1QsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztXQUVNLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQUUsZUFBTztPQUFFOztBQUVqQyxVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hDLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDOztBQUVwQyxVQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztBQUN0QixlQUFPLEVBQUUsU0FBUztBQUNsQixZQUFJLEVBQUUsSUFBSTtBQUNWLGNBQU0sRUFBRSxNQUFNO09BQ2YsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDZDs7O1dBRU8sb0JBQUc7OztBQUNULGFBQU8sYUFBWSxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDdEMsWUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUksQ0FBQyxFQUFLO0FBQ3RCLGdCQUFLLFFBQVEsR0FBRyxLQUFLLENBQUM7O0FBRXRCLGdCQUFLLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzVELGlCQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0QixDQUFDOztBQUVGLGNBQUssTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FDMUQsQ0FBQyxDQUFDO0tBQ0o7OztTQWpFa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoiZXM2L3NpbmtzL2RhdGEtcmVjb3JkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuY29uc3Qgd29ya2VyID0gYFxudmFyIF9zZXBhcmF0ZUFycmF5cyA9IGZhbHNlO1xudmFyIF9kYXRhID0gW107XG52YXIgX3NlcGFyYXRlQXJyYXlzRGF0YSA9IHsgdGltZTogW10sIGRhdGE6IFtdIH07XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gIF9kYXRhLmxlbmd0aCA9IDA7XG4gIF9zZXBhcmF0ZUFycmF5c0RhdGEudGltZS5sZW5ndGggPSAwO1xuICBfc2VwYXJhdGVBcnJheXNEYXRhLmRhdGEubGVuZ3RoID0gMDtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzcyh0aW1lLCBkYXRhKSB7XG4gIGlmIChfc2VwYXJhdGVBcnJheXMpIHtcbiAgICBfc2VwYXJhdGVBcnJheXNEYXRhLnRpbWUucHVzaCh0aW1lKTtcbiAgICBfc2VwYXJhdGVBcnJheXNEYXRhLmRhdGEucHVzaChkYXRhKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgZGF0dW0gPSB7IHRpbWU6IHRpbWUsIGRhdGE6IGRhdGEgfTtcbiAgICBfZGF0YS5wdXNoKGRhdHVtKTtcbiAgfVxufVxuXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbihlKSB7XG4gIHN3aXRjaCAoZS5kYXRhLmNvbW1hbmQpIHtcbiAgICBjYXNlICdpbml0JzpcbiAgICAgIF9zZXBhcmF0ZUFycmF5cyA9IGUuZGF0YS5zZXBhcmF0ZUFycmF5cztcbiAgICAgIGluaXQoKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3Byb2Nlc3MnOlxuICAgICAgdmFyIHRpbWUgPSBlLmRhdGEudGltZTtcbiAgICAgIHZhciBkYXRhID0gbmV3IEZsb2F0MzJBcnJheShlLmRhdGEuYnVmZmVyKTtcbiAgICAgIHByb2Nlc3ModGltZSwgZGF0YSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdzdG9wJzpcbiAgICAgIHZhciBkYXRhID0gX3NlcGFyYXRlQXJyYXlzID8gX3NlcGFyYXRlQXJyYXlzRGF0YSA6IF9kYXRhO1xuICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7IGRhdGE6IGRhdGEgfSk7XG4gICAgICBpbml0KCk7XG4gICAgICBicmVhaztcbiAgfVxufSk7XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEYXRhUmVjb3JkZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIC8vIGRlZmF1bHQgZm9ybWF0IGlzIFt7dGltZSwgZGF0YX0sIHt0aW1lLCBkYXRhfV1cbiAgICAgIC8vIGlmIHNldCB0byBgdHJ1ZWAgZm9ybWF0IGlzIHsgdGltZTogWy4uLl0sIGRhdGE6IFsuLi5dIH1cbiAgICAgIHNlcGFyYXRlQXJyYXlzOiBmYWxzZSxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIC8vIEB0b2RvIC0gcmVuYW1lIGBpc1JlY29yZGluZ2BcbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcblxuICAgIC8vIGluaXQgd29ya2VyXG4gICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFt3b3JrZXJdLCB7IHR5cGU6ICd0ZXh0L2phdmFzY3JpcHQnIH0pO1xuICAgIHRoaXMud29ya2VyID0gbmV3IFdvcmtlcih3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKSk7XG4gIH1cblxuICBpbml0aWFsaXplKGluU3RyZWFtUGFyYW1zKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZShpblN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh7XG4gICAgICBjb21tYW5kOiAnaW5pdCcsXG4gICAgICBzZXBhcmF0ZUFycmF5czogdGhpcy5wYXJhbXMuc2VwYXJhdGVBcnJheXMsXG4gICAgfSk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSB0cnVlO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZiAodGhpcy5faXNTdGFydGVkKSB7XG4gICAgICBjb25zb2xlLmxvZygnd29ya2VyOnN0b3AnKTtcbiAgICAgIHRoaXMud29ya2VyLnBvc3RNZXNzYWdlKHsgY29tbWFuZDogJ3N0b3AnIH0pO1xuICAgICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZmluYWxpemUoKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGlmICghdGhpcy5faXNTdGFydGVkKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5vdXRGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWUpO1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMub3V0RnJhbWUuYnVmZmVyO1xuXG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgICAgY29tbWFuZDogJ3Byb2Nlc3MnLFxuICAgICAgdGltZTogdGltZSxcbiAgICAgIGJ1ZmZlcjogYnVmZmVyLFxuICAgIH0sIFtidWZmZXJdKTtcbiAgfVxuXG4gIHJldHJpZXZlKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IChlKSA9PiB7XG4gICAgICAgIHRoaXMuX3N0YXJ0ZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLndvcmtlci5yZW1vdmVFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgICAgcmVzb2x2ZShlLmRhdGEuZGF0YSk7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLndvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICB9KTtcbiAgfVxufVxuIl19