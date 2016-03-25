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

var worker = '\nvar _separateArrays = false;\nvar _data = [];\nvar _separateArraysData = { time: [], data: [] };\n\nfunction init() {\n  _data.length = 0;\n  _separateArraysData.time.length = 0;\n  _separateArraysData.data.length = 0;\n}\n\nfunction process(time, data) {\n  if (_separateArrays) {\n    _separateArraysData.time.push(time);\n    _separateArraysData.data.push(data);\n  } else {\n    var datum = { time: time, data: data };\n    _data.push(datum);\n  }\n}\n\nself.addEventListener(\'message\', function(e) {\n  switch (e.data.command) {\n    case \'init\':\n      _separateArrays = e.data.separateArrays;\n      init();\n      break;\n    case \'process\':\n      var time = e.data.time;\n      var data = new Float32Array(e.data.buffer);\n      process(time, data);\n      break;\n    case \'stop\':\n      var data = _separateArrays ? _separateArraysData : _data;\n      self.postMessage({ data: data });\n      init();\n      break;\n  }\n});\n';

var DataRecorder = function (_BaseLfo) {
  (0, _inherits3.default)(DataRecorder, _BaseLfo);

  function DataRecorder(options) {
    (0, _classCallCheck3.default)(this, DataRecorder);


    // @todo - rename `isRecording`

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(DataRecorder).call(this, {
      // default format is [{time, data}, {time, data}]
      // if set to `true` format is { time: [...], data: [...] }
      separateArrays: false
    }, options));

    _this._isStarted = false;

    // init worker
    var blob = new Blob([worker], { type: 'text/javascript' });
    _this.worker = new Worker(window.URL.createObjectURL(blob));
    return _this;
  }

  (0, _createClass3.default)(DataRecorder, [{
    key: 'initialize',
    value: function initialize(inStreamParams) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(DataRecorder.prototype), 'initialize', this).call(this, inStreamParams);

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
      var _this2 = this;

      return new _promise2.default(function (resolve, reject) {
        var callback = function callback(e) {
          _this2._started = false;

          _this2.worker.removeEventListener('message', callback, false);
          resolve(e.data.data);
        };

        _this2.worker.addEventListener('message', callback, false);
      });
    }
  }]);
  return DataRecorder;
}(_baseLfo2.default);

exports.default = DataRecorder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGEtcmVjb3JkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFNLCs3QkFBTjs7SUF5Q3FCOzs7QUFDbkIsV0FEbUIsWUFDbkIsQ0FBWSxPQUFaLEVBQXFCO3dDQURGLGNBQ0U7Ozs7OzZGQURGLHlCQUVYOzs7QUFHSixzQkFBZ0IsS0FBaEI7T0FDQyxVQUxnQjs7QUFRbkIsVUFBSyxVQUFMLEdBQWtCLEtBQWxCOzs7QUFSbUIsUUFXYixPQUFPLElBQUksSUFBSixDQUFTLENBQUMsTUFBRCxDQUFULEVBQW1CLEVBQUUsTUFBTSxpQkFBTixFQUFyQixDQUFQLENBWGE7QUFZbkIsVUFBSyxNQUFMLEdBQWMsSUFBSSxNQUFKLENBQVcsT0FBTyxHQUFQLENBQVcsZUFBWCxDQUEyQixJQUEzQixDQUFYLENBQWQsQ0FabUI7O0dBQXJCOzs2QkFEbUI7OytCQWdCUixnQkFBZ0I7QUFDekIsdURBakJpQix3REFpQkEsZUFBakIsQ0FEeUI7O0FBR3pCLFdBQUssTUFBTCxDQUFZLFdBQVosQ0FBd0I7QUFDdEIsaUJBQVMsTUFBVDtBQUNBLHdCQUFnQixLQUFLLE1BQUwsQ0FBWSxjQUFaO09BRmxCLEVBSHlCOzs7OzRCQVNuQjtBQUNOLFdBQUssVUFBTCxHQUFrQixJQUFsQixDQURNOzs7OzJCQUlEO0FBQ0wsVUFBSSxLQUFLLFVBQUwsRUFBaUI7QUFDbkIsYUFBSyxNQUFMLENBQVksV0FBWixDQUF3QixFQUFFLFNBQVMsTUFBVCxFQUExQixFQURtQjtBQUVuQixhQUFLLFVBQUwsR0FBa0IsS0FBbEIsQ0FGbUI7T0FBckI7Ozs7K0JBTVM7QUFDVCxXQUFLLElBQUwsR0FEUzs7Ozs0QkFJSCxNQUFNLE9BQU8sVUFBVTtBQUM3QixVQUFJLENBQUMsS0FBSyxVQUFMLEVBQWlCO0FBQUUsZUFBRjtPQUF0Qjs7QUFFQSxXQUFLLFFBQUwsR0FBZ0IsSUFBSSxZQUFKLENBQWlCLEtBQWpCLENBQWhCLENBSDZCO0FBSTdCLFVBQU0sU0FBUyxLQUFLLFFBQUwsQ0FBYyxNQUFkLENBSmM7O0FBTTdCLFdBQUssTUFBTCxDQUFZLFdBQVosQ0FBd0I7QUFDdEIsaUJBQVMsU0FBVDtBQUNBLGNBQU0sSUFBTjtBQUNBLGdCQUFRLE1BQVI7T0FIRixFQUlHLENBQUMsTUFBRCxDQUpILEVBTjZCOzs7OytCQWFwQjs7O0FBQ1QsYUFBTyxzQkFBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3RDLFlBQU0sV0FBVyxTQUFYLFFBQVcsQ0FBQyxDQUFELEVBQU87QUFDdEIsaUJBQUssUUFBTCxHQUFnQixLQUFoQixDQURzQjs7QUFHdEIsaUJBQUssTUFBTCxDQUFZLG1CQUFaLENBQWdDLFNBQWhDLEVBQTJDLFFBQTNDLEVBQXFELEtBQXJELEVBSHNCO0FBSXRCLGtCQUFRLEVBQUUsSUFBRixDQUFPLElBQVAsQ0FBUixDQUpzQjtTQUFQLENBRHFCOztBQVF0QyxlQUFLLE1BQUwsQ0FBWSxnQkFBWixDQUE2QixTQUE3QixFQUF3QyxRQUF4QyxFQUFrRCxLQUFsRCxFQVJzQztPQUFyQixDQUFuQixDQURTOzs7U0FyRFEiLCJmaWxlIjoiZGF0YS1yZWNvcmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG5jb25zdCB3b3JrZXIgPSBgXG52YXIgX3NlcGFyYXRlQXJyYXlzID0gZmFsc2U7XG52YXIgX2RhdGEgPSBbXTtcbnZhciBfc2VwYXJhdGVBcnJheXNEYXRhID0geyB0aW1lOiBbXSwgZGF0YTogW10gfTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgX2RhdGEubGVuZ3RoID0gMDtcbiAgX3NlcGFyYXRlQXJyYXlzRGF0YS50aW1lLmxlbmd0aCA9IDA7XG4gIF9zZXBhcmF0ZUFycmF5c0RhdGEuZGF0YS5sZW5ndGggPSAwO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzKHRpbWUsIGRhdGEpIHtcbiAgaWYgKF9zZXBhcmF0ZUFycmF5cykge1xuICAgIF9zZXBhcmF0ZUFycmF5c0RhdGEudGltZS5wdXNoKHRpbWUpO1xuICAgIF9zZXBhcmF0ZUFycmF5c0RhdGEuZGF0YS5wdXNoKGRhdGEpO1xuICB9IGVsc2Uge1xuICAgIHZhciBkYXR1bSA9IHsgdGltZTogdGltZSwgZGF0YTogZGF0YSB9O1xuICAgIF9kYXRhLnB1c2goZGF0dW0pO1xuICB9XG59XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKGUpIHtcbiAgc3dpdGNoIChlLmRhdGEuY29tbWFuZCkge1xuICAgIGNhc2UgJ2luaXQnOlxuICAgICAgX3NlcGFyYXRlQXJyYXlzID0gZS5kYXRhLnNlcGFyYXRlQXJyYXlzO1xuICAgICAgaW5pdCgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncHJvY2Vzcyc6XG4gICAgICB2YXIgdGltZSA9IGUuZGF0YS50aW1lO1xuICAgICAgdmFyIGRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KGUuZGF0YS5idWZmZXIpO1xuICAgICAgcHJvY2Vzcyh0aW1lLCBkYXRhKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3N0b3AnOlxuICAgICAgdmFyIGRhdGEgPSBfc2VwYXJhdGVBcnJheXMgPyBfc2VwYXJhdGVBcnJheXNEYXRhIDogX2RhdGE7XG4gICAgICBzZWxmLnBvc3RNZXNzYWdlKHsgZGF0YTogZGF0YSB9KTtcbiAgICAgIGluaXQoKTtcbiAgICAgIGJyZWFrO1xuICB9XG59KTtcbmA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERhdGFSZWNvcmRlciBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoe1xuICAgICAgLy8gZGVmYXVsdCBmb3JtYXQgaXMgW3t0aW1lLCBkYXRhfSwge3RpbWUsIGRhdGF9XVxuICAgICAgLy8gaWYgc2V0IHRvIGB0cnVlYCBmb3JtYXQgaXMgeyB0aW1lOiBbLi4uXSwgZGF0YTogWy4uLl0gfVxuICAgICAgc2VwYXJhdGVBcnJheXM6IGZhbHNlLFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgLy8gQHRvZG8gLSByZW5hbWUgYGlzUmVjb3JkaW5nYFxuICAgIHRoaXMuX2lzU3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgLy8gaW5pdCB3b3JrZXJcbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW3dvcmtlcl0sIHsgdHlwZTogJ3RleHQvamF2YXNjcmlwdCcgfSk7XG4gICAgdGhpcy53b3JrZXIgPSBuZXcgV29ya2VyKHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoaW5TdHJlYW1QYXJhbXMpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKGluU3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMud29ya2VyLnBvc3RNZXNzYWdlKHtcbiAgICAgIGNvbW1hbmQ6ICdpbml0JyxcbiAgICAgIHNlcGFyYXRlQXJyYXlzOiB0aGlzLnBhcmFtcy5zZXBhcmF0ZUFycmF5cyxcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuX2lzU3RhcnRlZCA9IHRydWU7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIGlmICh0aGlzLl9pc1N0YXJ0ZWQpIHtcbiAgICAgIHRoaXMud29ya2VyLnBvc3RNZXNzYWdlKHsgY29tbWFuZDogJ3N0b3AnIH0pO1xuICAgICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZmluYWxpemUoKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGlmICghdGhpcy5faXNTdGFydGVkKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5vdXRGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWUpO1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMub3V0RnJhbWUuYnVmZmVyO1xuXG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgICAgY29tbWFuZDogJ3Byb2Nlc3MnLFxuICAgICAgdGltZTogdGltZSxcbiAgICAgIGJ1ZmZlcjogYnVmZmVyLFxuICAgIH0sIFtidWZmZXJdKTtcbiAgfVxuXG4gIHJldHJpZXZlKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IChlKSA9PiB7XG4gICAgICAgIHRoaXMuX3N0YXJ0ZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLndvcmtlci5yZW1vdmVFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgICAgcmVzb2x2ZShlLmRhdGEuZGF0YSk7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLndvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICB9KTtcbiAgfVxufVxuIl19