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

    _get(Object.getPrototypeOf(SocketClient.prototype), 'constructor', this).call(this, {
      port: 3030,
      address: window.location.hostname
    }, options);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy9zb2NrZXQtY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7OztnQ0FDUix1QkFBdUI7Ozs7OztJQUtoQyxZQUFZO1lBQVosWUFBWTs7QUFDcEIsV0FEUSxZQUFZLENBQ25CLE9BQU8sRUFBRTswQkFERixZQUFZOztBQUU3QiwrQkFGaUIsWUFBWSw2Q0FFdkI7QUFDSixVQUFJLEVBQUUsSUFBSTtBQUNWLGFBQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVE7S0FDbEMsRUFBRSxPQUFPLEVBQUU7O0FBRVosUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsUUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0dBQ3ZCOztlQVRrQixZQUFZOztXQVdqQiwwQkFBRzs7O0FBQ2YsVUFBSSxVQUFVLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztBQUN4RSxVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hDLFVBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLGFBQWEsQ0FBQzs7O0FBR3ZDLFVBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLFlBQU07QUFDekIsY0FBSyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDdEIsQ0FBQzs7QUFFRixVQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFNLEVBRTNCLENBQUM7O0FBRUYsVUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsWUFBTSxFQUU3QixDQUFDOztBQUVGLFVBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQUMsR0FBRyxFQUFLO0FBQzdCLGVBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDcEIsQ0FBQztLQUNIOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixVQUFJLE1BQU0sR0FBRyxxQ0FBYyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2xELFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzFCOzs7U0FyQ2tCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6ImVzNi9zaW5rcy9zb2NrZXQtY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5pbXBvcnQgeyBlbmNvZGVNZXNzYWdlIH0gZnJvbSAnLi4vdXRpbHMvc29ja2V0LXV0aWxzJztcblxuLy8gc2VuZCBhbiBMZm8gc3RyZWFtIGZyb20gdGhlIGJyb3dzZXIgb3ZlciB0aGUgbmV0d29ya1xuLy8gdGhyb3VnaCBhIFdlYlNvY2tldCAtIHNob3VsZCBiZSBwYWlyZWQgd2l0aCBhIFNvY2tldFNvdXJjZVNlcnZlclxuLy8gQE5PVEU6IGRvZXMgaXQgbmVlZCB0byBpbXBsZW1lbnQgc29tZSBwaW5nIHByb2Nlc3MgdG8gbWFpbnRhaW4gY29ubmVjdGlvbiA/XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb2NrZXRDbGllbnQgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIHBvcnQ6IDMwMzAsXG4gICAgICBhZGRyZXNzOiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWVcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHRoaXMuc29ja2V0ID0gbnVsbDtcbiAgICB0aGlzLmluaXRDb25uZWN0aW9uKCk7XG4gIH1cblxuICBpbml0Q29ubmVjdGlvbigpIHtcbiAgICB2YXIgc29ja2V0QWRkciA9ICd3czovLycgKyB0aGlzLnBhcmFtcy5hZGRyZXNzICsgJzonICsgdGhpcy5wYXJhbXMucG9ydDtcbiAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQoc29ja2V0QWRkcik7XG4gICAgdGhpcy5zb2NrZXQuYmluYXJ5VHlwZSA9ICdhcnJheWJ1ZmZlcic7XG5cbiAgICAvLyBjYWxsYmFjayB0byBzdGFydCB0byB3aGVuIFdlYlNvY2tldCBpcyBjb25uZWN0ZWRcbiAgICB0aGlzLnNvY2tldC5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICB0aGlzLnBhcmFtcy5vbm9wZW4oKTtcbiAgICB9O1xuXG4gICAgdGhpcy5zb2NrZXQub25jbG9zZSA9ICgpID0+IHtcblxuICAgIH07XG5cbiAgICB0aGlzLnNvY2tldC5vbm1lc3NhZ2UgPSAoKSA9PiB7XG5cbiAgICB9O1xuXG4gICAgdGhpcy5zb2NrZXQub25lcnJvciA9IChlcnIpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9O1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICB2YXIgYnVmZmVyID0gZW5jb2RlTWVzc2FnZSh0aW1lLCBmcmFtZSwgbWV0YURhdGEpO1xuICAgIHRoaXMuc29ja2V0LnNlbmQoYnVmZmVyKTtcbiAgfVxufVxuIl19