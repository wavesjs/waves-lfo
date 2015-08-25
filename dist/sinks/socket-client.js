'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreBaseLfo = require('../core/base-lfo');

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var _utilsSocketUtils = require('../utils/socket-utils');

// send an Lfo stream from the browser over the network
// through a WebSocket - should be paired with a SocketSourceServer
// @NOTE: does it need to implement some ping process to maintain connection ?

var SocketClient = (function (_BaseLfo) {
  _inherits(SocketClient, _BaseLfo);

  function SocketClient(options) {
    _classCallCheck(this, SocketClient);

    var defaults = {
      port: 3030,
      address: window.location.hostname
    };

    _get(Object.getPrototypeOf(SocketClient.prototype), 'constructor', this).call(this, options, defaults);

    this.socket = null;
    this.initConnection();
  }

  _createClass(SocketClient, [{
    key: 'initConnection',
    value: function initConnection() {
      var _this = this;

      var socketAddr = 'ws://' + this.params.address + ':' + this.params.port;
      this.socket = new WebSocket(socketAddr);
      this.socket.binaryType = 'arraybuffer';

      // callback to start to when WebSocket is connected
      this.socket.onopen = function () {
        _this.params.onopen();
      };

      this.socket.onclose = function () {};

      this.socket.onmessage = function () {};

      this.socket.onerror = function (err) {
        console.error(err);
      };
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var buffer = (0, _utilsSocketUtils.encodeMessage)(time, frame, metaData);
      this.socket.send(buffer);
    }
  }]);

  return SocketClient;
})(_coreBaseLfo2['default']);

exports['default'] = SocketClient;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy9zb2NrZXQtY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7OztnQ0FDUix1QkFBdUI7Ozs7OztJQUtoQyxZQUFZO1lBQVosWUFBWTs7QUFDcEIsV0FEUSxZQUFZLENBQ25CLE9BQU8sRUFBRTswQkFERixZQUFZOztBQUU3QixRQUFJLFFBQVEsR0FBRztBQUNiLFVBQUksRUFBRSxJQUFJO0FBQ1YsYUFBTyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUTtLQUNsQyxDQUFDOztBQUVGLCtCQVBpQixZQUFZLDZDQU92QixPQUFPLEVBQUUsUUFBUSxFQUFFOztBQUV6QixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixRQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7R0FDdkI7O2VBWGtCLFlBQVk7O1dBYWpCLDBCQUFHOzs7QUFDZixVQUFJLFVBQVUsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ3hFLFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsYUFBYSxDQUFDOzs7QUFHdkMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsWUFBTTtBQUN6QixjQUFLLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUN0QixDQUFDOztBQUVGLFVBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLFlBQU0sRUFFM0IsQ0FBQzs7QUFFRixVQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxZQUFNLEVBRTdCLENBQUM7O0FBRUYsVUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBQyxHQUFHLEVBQUs7QUFDN0IsZUFBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUNwQixDQUFDO0tBQ0g7OztXQUVNLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFVBQUksTUFBTSxHQUFHLHNCQTFDUixhQUFhLEVBMENTLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbEQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDMUI7OztTQXZDa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoiZXM2L3NpbmtzL3NvY2tldC1jbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcbmltcG9ydCB7IGVuY29kZU1lc3NhZ2UgfSBmcm9tICcuLi91dGlscy9zb2NrZXQtdXRpbHMnO1xuXG4vLyBzZW5kIGFuIExmbyBzdHJlYW0gZnJvbSB0aGUgYnJvd3NlciBvdmVyIHRoZSBuZXR3b3JrXG4vLyB0aHJvdWdoIGEgV2ViU29ja2V0IC0gc2hvdWxkIGJlIHBhaXJlZCB3aXRoIGEgU29ja2V0U291cmNlU2VydmVyXG4vLyBATk9URTogZG9lcyBpdCBuZWVkIHRvIGltcGxlbWVudCBzb21lIHBpbmcgcHJvY2VzcyB0byBtYWludGFpbiBjb25uZWN0aW9uID9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvY2tldENsaWVudCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgcG9ydDogMzAzMCxcbiAgICAgIGFkZHJlc3M6IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZVxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICB0aGlzLnNvY2tldCA9IG51bGw7XG4gICAgdGhpcy5pbml0Q29ubmVjdGlvbigpO1xuICB9XG5cbiAgaW5pdENvbm5lY3Rpb24oKSB7XG4gICAgdmFyIHNvY2tldEFkZHIgPSAnd3M6Ly8nICsgdGhpcy5wYXJhbXMuYWRkcmVzcyArICc6JyArIHRoaXMucGFyYW1zLnBvcnQ7XG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KHNvY2tldEFkZHIpO1xuICAgIHRoaXMuc29ja2V0LmJpbmFyeVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG4gICAgLy8gY2FsbGJhY2sgdG8gc3RhcnQgdG8gd2hlbiBXZWJTb2NrZXQgaXMgY29ubmVjdGVkXG4gICAgdGhpcy5zb2NrZXQub25vcGVuID0gKCkgPT4ge1xuICAgICAgdGhpcy5wYXJhbXMub25vcGVuKCk7XG4gICAgfTtcblxuICAgIHRoaXMuc29ja2V0Lm9uY2xvc2UgPSAoKSA9PiB7XG5cbiAgICB9O1xuXG4gICAgdGhpcy5zb2NrZXQub25tZXNzYWdlID0gKCkgPT4ge1xuXG4gICAgfTtcblxuICAgIHRoaXMuc29ja2V0Lm9uZXJyb3IgPSAoZXJyKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgfTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgdmFyIGJ1ZmZlciA9IGVuY29kZU1lc3NhZ2UodGltZSwgZnJhbWUsIG1ldGFEYXRhKTtcbiAgICB0aGlzLnNvY2tldC5zZW5kKGJ1ZmZlcik7XG4gIH1cbn0iXX0=