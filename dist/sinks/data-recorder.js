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

var worker = '\nvar _separateArrays = false;\nvar _data = [];\nvar _separateArraysData = { time: [], data: [] };\n\nfunction init() {\n  _data.length = 0;\n  _separateArraysData.time.length = 0;\n  _separateArraysData.data.length = 0;\n}\n\nfunction process(time, data) {\n  if (_separateArrays) {\n    _separateArraysData.time.push(time);\n    _separateArraysData.data.push(data);\n  } else {\n    var datum = { time: time, data: data };\n    _data.push(datum);\n  }\n}\n\nself.addEventListener(\'message\', function(e) {\n  switch (e.data.command) {\n    case \'init\':\n      _separateArrays = e.data.separateArrays;\n      init();\n      break;\n    case \'process\':\n      var time = e.data.time;\n      var data = new Float32Array(e.data.buffer);\n      process(time, data);\n      break;\n    case \'finalize\':\n      var data = _separateArrays ? _separateArraysData : _data;\n      self.postMessage({ data: data });\n      init();\n      break;\n  }\n});\n';

var DataRecorder = (function (_BaseLfo) {
  _inherits(DataRecorder, _BaseLfo);

  function DataRecorder(options) {
    _classCallCheck(this, DataRecorder);

    var defaults = {
      // default format is [{time, data}, {time, data}]
      // if set to `true` format is { time: [...], data: [...] }
      separateArrays: false
    };

    _get(Object.getPrototypeOf(DataRecorder.prototype), 'constructor', this).call(this, options, defaults);
    this._isStarted = false;

    // init worker
    var blob = new Blob([worker], { type: 'text/javascript' });
    this.worker = new Worker(window.URL.createObjectURL(blob));
  }

  _createClass(DataRecorder, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(DataRecorder.prototype), 'initialize', this).call(this);

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
      this.finalize();
      this._isStarted = false;
    }
  }, {
    key: 'finalize',
    value: function finalize() {
      if (!this._isStarted) {
        return;
      }
      this.worker.postMessage({ command: 'finalize' });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy9kYXRhLXJlY29yZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7O0FBRXRDLElBQU0sTUFBTSw2N0JBdUNYLENBQUM7O0lBRW1CLFlBQVk7WUFBWixZQUFZOztBQUNwQixXQURRLFlBQVksQ0FDbkIsT0FBTyxFQUFFOzBCQURGLFlBQVk7O0FBRTdCLFFBQU0sUUFBUSxHQUFHOzs7QUFHZixvQkFBYyxFQUFFLEtBQUs7S0FDdEIsQ0FBQzs7QUFFRiwrQkFSaUIsWUFBWSw2Q0FRdkIsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUN6QixRQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQzs7O0FBR3hCLFFBQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO0FBQzdELFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUM1RDs7ZUFka0IsWUFBWTs7V0FnQnJCLHNCQUFHO0FBQ1gsaUNBakJpQixZQUFZLDRDQWlCVjs7QUFFbkIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDdEIsZUFBTyxFQUFFLE1BQU07QUFDZixzQkFBYyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYztPQUMzQyxDQUFDLENBQUM7S0FDSjs7O1dBRUksaUJBQUc7QUFDTixVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztLQUN4Qjs7O1dBRUcsZ0JBQUc7QUFDTCxVQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDaEIsVUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7S0FDekI7OztXQUVPLG9CQUFHO0FBQ1QsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFBRSxlQUFPO09BQUU7QUFDakMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztLQUNsRDs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFBRSxlQUFPO09BQUU7O0FBRWpDLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEMsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7O0FBRXBDLFVBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBQ3RCLGVBQU8sRUFBRSxTQUFTO0FBQ2xCLFlBQUksRUFBRSxJQUFJO0FBQ1YsY0FBTSxFQUFFLE1BQU07T0FDZixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUVkOzs7V0FFTyxvQkFBRzs7O0FBQ1QsYUFBTyxhQUFZLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUN0QyxZQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVEsQ0FBSSxDQUFDLEVBQUs7QUFDdEIsZ0JBQUssUUFBUSxHQUFHLEtBQUssQ0FBQzs7QUFFdEIsZ0JBQUssTUFBTSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDNUQsaUJBQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3RCLENBQUM7O0FBRUYsY0FBSyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUMxRCxDQUFDLENBQUM7S0FDSjs7O1NBaEVrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiJlczYvc2lua3MvZGF0YS1yZWNvcmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG5jb25zdCB3b3JrZXIgPSBgXG52YXIgX3NlcGFyYXRlQXJyYXlzID0gZmFsc2U7XG52YXIgX2RhdGEgPSBbXTtcbnZhciBfc2VwYXJhdGVBcnJheXNEYXRhID0geyB0aW1lOiBbXSwgZGF0YTogW10gfTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgX2RhdGEubGVuZ3RoID0gMDtcbiAgX3NlcGFyYXRlQXJyYXlzRGF0YS50aW1lLmxlbmd0aCA9IDA7XG4gIF9zZXBhcmF0ZUFycmF5c0RhdGEuZGF0YS5sZW5ndGggPSAwO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzKHRpbWUsIGRhdGEpIHtcbiAgaWYgKF9zZXBhcmF0ZUFycmF5cykge1xuICAgIF9zZXBhcmF0ZUFycmF5c0RhdGEudGltZS5wdXNoKHRpbWUpO1xuICAgIF9zZXBhcmF0ZUFycmF5c0RhdGEuZGF0YS5wdXNoKGRhdGEpO1xuICB9IGVsc2Uge1xuICAgIHZhciBkYXR1bSA9IHsgdGltZTogdGltZSwgZGF0YTogZGF0YSB9O1xuICAgIF9kYXRhLnB1c2goZGF0dW0pO1xuICB9XG59XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKGUpIHtcbiAgc3dpdGNoIChlLmRhdGEuY29tbWFuZCkge1xuICAgIGNhc2UgJ2luaXQnOlxuICAgICAgX3NlcGFyYXRlQXJyYXlzID0gZS5kYXRhLnNlcGFyYXRlQXJyYXlzO1xuICAgICAgaW5pdCgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncHJvY2Vzcyc6XG4gICAgICB2YXIgdGltZSA9IGUuZGF0YS50aW1lO1xuICAgICAgdmFyIGRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KGUuZGF0YS5idWZmZXIpO1xuICAgICAgcHJvY2Vzcyh0aW1lLCBkYXRhKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2ZpbmFsaXplJzpcbiAgICAgIHZhciBkYXRhID0gX3NlcGFyYXRlQXJyYXlzID8gX3NlcGFyYXRlQXJyYXlzRGF0YSA6IF9kYXRhO1xuICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7IGRhdGE6IGRhdGEgfSk7XG4gICAgICBpbml0KCk7XG4gICAgICBicmVhaztcbiAgfVxufSk7XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEYXRhUmVjb3JkZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgLy8gZGVmYXVsdCBmb3JtYXQgaXMgW3t0aW1lLCBkYXRhfSwge3RpbWUsIGRhdGF9XVxuICAgICAgLy8gaWYgc2V0IHRvIGB0cnVlYCBmb3JtYXQgaXMgeyB0aW1lOiBbLi4uXSwgZGF0YTogWy4uLl0gfVxuICAgICAgc2VwYXJhdGVBcnJheXM6IGZhbHNlLFxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG5cbiAgICAvLyBpbml0IHdvcmtlclxuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbd29ya2VyXSwgeyB0eXBlOiAndGV4dC9qYXZhc2NyaXB0JyB9KTtcbiAgICB0aGlzLndvcmtlciA9IG5ldyBXb3JrZXIod2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYikpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG5cbiAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh7XG4gICAgICBjb21tYW5kOiAnaW5pdCcsXG4gICAgICBzZXBhcmF0ZUFycmF5czogdGhpcy5wYXJhbXMuc2VwYXJhdGVBcnJheXMsXG4gICAgfSk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSB0cnVlO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gIH1cblxuICBmaW5hbGl6ZSgpIHtcbiAgICBpZiAoIXRoaXMuX2lzU3RhcnRlZCkgeyByZXR1cm47IH1cbiAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh7IGNvbW1hbmQ6ICdmaW5hbGl6ZScgfSk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGlmICghdGhpcy5faXNTdGFydGVkKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5vdXRGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWUpO1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMub3V0RnJhbWUuYnVmZmVyO1xuXG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgICAgY29tbWFuZDogJ3Byb2Nlc3MnLFxuICAgICAgdGltZTogdGltZSxcbiAgICAgIGJ1ZmZlcjogYnVmZmVyLFxuICAgIH0sIFtidWZmZXJdKTtcblxuICB9XG5cbiAgcmV0cmlldmUoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gKGUpID0+IHtcbiAgICAgICAgdGhpcy5fc3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMud29ya2VyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBjYWxsYmFjaywgZmFsc2UpO1xuICAgICAgICByZXNvbHZlKGUuZGF0YS5kYXRhKTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMud29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBjYWxsYmFjaywgZmFsc2UpO1xuICAgIH0pO1xuICB9XG59Il19