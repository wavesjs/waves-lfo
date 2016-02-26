'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreBaseLfo = require('../core/base-lfo');

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var _ws = require('ws');

var ws = _interopRequireWildcard(_ws);

var _utilsSocketUtils = require('../utils/socket-utils');

var SocketServer = (function (_BaseLfo) {
  _inherits(SocketServer, _BaseLfo);

  function SocketServer(options) {
    _classCallCheck(this, SocketServer);

    _get(Object.getPrototypeOf(SocketServer.prototype), 'constructor', this).call(this, options, {
      port: 3031
    });

    this.server = null;
    this.initServer();
  }

  _createClass(SocketServer, [{
    key: 'initServer',
    value: function initServer() {
      this.server = new ws.Server({ port: this.params.port });
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var arrayBuffer = (0, _utilsSocketUtils.encodeMessage)(time, frame, metaData);
      var buffer = (0, _utilsSocketUtils.arrayBufferToBuffer)(arrayBuffer);

      this.server.clients.forEach(function (client) {
        client.send(buffer);
      });
    }
  }]);

  return SocketServer;
})(_coreBaseLfo2['default']);

exports['default'] = SocketServer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy9zb2NrZXQtc2VydmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7O2tCQUNsQixJQUFJOztJQUFaLEVBQUU7O2dDQUNxQyx1QkFBdUI7O0lBR3JELFlBQVk7WUFBWixZQUFZOztBQUNwQixXQURRLFlBQVksQ0FDbkIsT0FBTyxFQUFFOzBCQURGLFlBQVk7O0FBRTdCLCtCQUZpQixZQUFZLDZDQUV2QixPQUFPLEVBQUU7QUFDYixVQUFJLEVBQUUsSUFBSTtLQUNYLEVBQUU7O0FBRUgsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsUUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0dBQ25COztlQVJrQixZQUFZOztXQVVyQixzQkFBRztBQUNYLFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUN6RDs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsVUFBSSxXQUFXLEdBQUcscUNBQWMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN2RCxVQUFJLE1BQU0sR0FBRywyQ0FBb0IsV0FBVyxDQUFDLENBQUM7O0FBRTlDLFVBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFTLE1BQU0sRUFBRTtBQUMzQyxjQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ3JCLENBQUMsQ0FBQztLQUNKOzs7U0FyQmtCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6ImVzNi9zaW5rcy9zb2NrZXQtc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5pbXBvcnQgKiBhcyB3cyBmcm9tICd3cyc7XG5pbXBvcnQgeyBlbmNvZGVNZXNzYWdlLCBhcnJheUJ1ZmZlclRvQnVmZmVyIH0gZnJvbSAnLi4vdXRpbHMvc29ja2V0LXV0aWxzJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb2NrZXRTZXJ2ZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMsIHtcbiAgICAgIHBvcnQ6IDMwMzFcbiAgICB9KTtcblxuICAgIHRoaXMuc2VydmVyID0gbnVsbDtcbiAgICB0aGlzLmluaXRTZXJ2ZXIoKTtcbiAgfVxuXG4gIGluaXRTZXJ2ZXIoKSB7XG4gICAgdGhpcy5zZXJ2ZXIgPSBuZXcgd3MuU2VydmVyKHsgcG9ydDogdGhpcy5wYXJhbXMucG9ydCB9KTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgdmFyIGFycmF5QnVmZmVyID0gZW5jb2RlTWVzc2FnZSh0aW1lLCBmcmFtZSwgbWV0YURhdGEpO1xuICAgIHZhciBidWZmZXIgPSBhcnJheUJ1ZmZlclRvQnVmZmVyKGFycmF5QnVmZmVyKTtcblxuICAgIHRoaXMuc2VydmVyLmNsaWVudHMuZm9yRWFjaChmdW5jdGlvbihjbGllbnQpIHtcbiAgICAgIGNsaWVudC5zZW5kKGJ1ZmZlcik7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==