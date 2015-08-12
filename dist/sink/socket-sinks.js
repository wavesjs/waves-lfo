'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var Lfo = require('../core/lfo-base');
var WebSocketServer = require('ws').Server;

var _require = require('../utils/socket-utils');

// send an Lfo stream from the browser over the network
// through a WebSocket - should be paired with a SocketSourceServer
// @NOTE: does it need to implement some ping process to maintain connection ?
var encodeMessage = _require.encodeMessage;
var decodeMessage = _require.decodeMessage;
var arrayBufferToBuffer = _require.arrayBufferToBuffer;

var SocketSinkClient = (function (_Lfo) {
  _inherits(SocketSinkClient, _Lfo);

  function SocketSinkClient(options) {
    _classCallCheck(this, SocketSinkClient);

    var defaults = {
      port: 3030,
      address: window.location.hostname
    };

    _get(Object.getPrototypeOf(SocketSinkClient.prototype), 'constructor', this).call(this, options, defaults);

    this.socket = null;
    this.initConnection();
  }

  _createClass(SocketSinkClient, [{
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
        console.log(err);
      };
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var buffer = encodeMessage(time, frame, metaData);

      this.socket.send(buffer);
    }
  }]);

  return SocketSinkClient;
})(Lfo);

var SocketSinkServer = (function (_Lfo2) {
  _inherits(SocketSinkServer, _Lfo2);

  function SocketSinkServer(options) {
    _classCallCheck(this, SocketSinkServer);

    var defaults = {
      port: 3031
    };

    _get(Object.getPrototypeOf(SocketSinkServer.prototype), 'constructor', this).call(this, options, defaults);

    this.server = null;
    this.initServer();
  }

  _createClass(SocketSinkServer, [{
    key: 'initServer',
    value: function initServer() {
      this.server = new WebSocketServer({ port: this.params.port });
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var arrayBuffer = encodeMessage(time, frame, metaData);
      var buffer = arrayBufferToBuffer(arrayBuffer);

      this.server.clients.forEach(function (client) {
        // console.timeEnd('ServerProcess');
        client.send(buffer);
      });
    }
  }]);

  return SocketSinkServer;
})(Lfo);

module.exports = {
  SocketSinkClient: SocketSinkClient,
  SocketSinkServer: SocketSinkServer
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rL3NvY2tldC1zaW5rcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7QUFFYixJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUN0QyxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDOztlQUNpQixPQUFPLENBQUMsdUJBQXVCLENBQUM7Ozs7O0lBQXRGLGFBQWEsWUFBYixhQUFhO0lBQUUsYUFBYSxZQUFiLGFBQWE7SUFBRSxtQkFBbUIsWUFBbkIsbUJBQW1COztJQUtqRCxnQkFBZ0I7WUFBaEIsZ0JBQWdCOztBQUNULFdBRFAsZ0JBQWdCLENBQ1IsT0FBTyxFQUFFOzBCQURqQixnQkFBZ0I7O0FBRWxCLFFBQUksUUFBUSxHQUFHO0FBQ2IsVUFBSSxFQUFFLElBQUk7QUFDVixhQUFPLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRO0tBQ2xDLENBQUM7O0FBRUYsK0JBUEUsZ0JBQWdCLDZDQU9aLE9BQU8sRUFBRSxRQUFRLEVBQUU7O0FBRXpCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLFFBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztHQUN2Qjs7ZUFYRyxnQkFBZ0I7O1dBYU4sMEJBQUc7OztBQUNmLFVBQUksVUFBVSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDeEUsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN4QyxVQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxhQUFhLENBQUM7OztBQUd2QyxVQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFNO0FBQ3pCLGNBQUssTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ3RCLENBQUM7O0FBRUYsVUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBTSxFQUUzQixDQUFDOztBQUVGLFVBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLFlBQU0sRUFFN0IsQ0FBQzs7QUFFRixVQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFDLEdBQUcsRUFBSztBQUM3QixlQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ2xCLENBQUM7S0FDSDs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsVUFBSSxNQUFNLEdBQUcsYUFBYSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7O0FBRWxELFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzFCOzs7U0F4Q0csZ0JBQWdCO0dBQVMsR0FBRzs7SUEyQzVCLGdCQUFnQjtZQUFoQixnQkFBZ0I7O0FBQ1QsV0FEUCxnQkFBZ0IsQ0FDUixPQUFPLEVBQUU7MEJBRGpCLGdCQUFnQjs7QUFFbEIsUUFBSSxRQUFRLEdBQUc7QUFDYixVQUFJLEVBQUUsSUFBSTtLQUNYLENBQUM7O0FBRUYsK0JBTkUsZ0JBQWdCLDZDQU1aLE9BQU8sRUFBRSxRQUFRLEVBQUU7O0FBRXpCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLFFBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztHQUNuQjs7ZUFWRyxnQkFBZ0I7O1dBWVYsc0JBQUc7QUFDWCxVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksZUFBZSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUMvRDs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsVUFBSSxXQUFXLEdBQUcsYUFBYSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDdkQsVUFBSSxNQUFNLEdBQUcsbUJBQW1CLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRTlDLFVBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFTLE1BQU0sRUFBRTs7QUFFM0MsY0FBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUNyQixDQUFDLENBQUM7S0FDSjs7O1NBeEJHLGdCQUFnQjtHQUFTLEdBQUc7O0FBMkJsQyxNQUFNLENBQUMsT0FBTyxHQUFHO0FBQ2Ysa0JBQWdCLEVBQUUsZ0JBQWdCO0FBQ2xDLGtCQUFnQixFQUFFLGdCQUFnQjtDQUNuQyxDQUFDIiwiZmlsZSI6ImVzNi9zaW5rL3NvY2tldC1zaW5rcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIExmbyA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcbnZhciBXZWJTb2NrZXRTZXJ2ZXIgPSByZXF1aXJlKCd3cycpLlNlcnZlcjtcbnZhciB7IGVuY29kZU1lc3NhZ2UsIGRlY29kZU1lc3NhZ2UsIGFycmF5QnVmZmVyVG9CdWZmZXIgfSA9IHJlcXVpcmUoJy4uL3V0aWxzL3NvY2tldC11dGlscycpO1xuXG4vLyBzZW5kIGFuIExmbyBzdHJlYW0gZnJvbSB0aGUgYnJvd3NlciBvdmVyIHRoZSBuZXR3b3JrXG4vLyB0aHJvdWdoIGEgV2ViU29ja2V0IC0gc2hvdWxkIGJlIHBhaXJlZCB3aXRoIGEgU29ja2V0U291cmNlU2VydmVyXG4vLyBATk9URTogZG9lcyBpdCBuZWVkIHRvIGltcGxlbWVudCBzb21lIHBpbmcgcHJvY2VzcyB0byBtYWludGFpbiBjb25uZWN0aW9uID9cbmNsYXNzIFNvY2tldFNpbmtDbGllbnQgZXh0ZW5kcyBMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgcG9ydDogMzAzMCxcbiAgICAgIGFkZHJlc3M6IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZVxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICB0aGlzLnNvY2tldCA9IG51bGw7XG4gICAgdGhpcy5pbml0Q29ubmVjdGlvbigpO1xuICB9XG5cbiAgaW5pdENvbm5lY3Rpb24oKSB7XG4gICAgdmFyIHNvY2tldEFkZHIgPSAnd3M6Ly8nICsgdGhpcy5wYXJhbXMuYWRkcmVzcyArICc6JyArIHRoaXMucGFyYW1zLnBvcnQ7XG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KHNvY2tldEFkZHIpO1xuICAgIHRoaXMuc29ja2V0LmJpbmFyeVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG4gICAgLy8gY2FsbGJhY2sgdG8gc3RhcnQgdG8gd2hlbiBXZWJTb2NrZXQgaXMgY29ubmVjdGVkXG4gICAgdGhpcy5zb2NrZXQub25vcGVuID0gKCkgPT4ge1xuICAgICAgdGhpcy5wYXJhbXMub25vcGVuKCk7XG4gICAgfTtcblxuICAgIHRoaXMuc29ja2V0Lm9uY2xvc2UgPSAoKSA9PiB7XG5cbiAgICB9O1xuXG4gICAgdGhpcy5zb2NrZXQub25tZXNzYWdlID0gKCkgPT4ge1xuXG4gICAgfTtcblxuICAgIHRoaXMuc29ja2V0Lm9uZXJyb3IgPSAoZXJyKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH07XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIHZhciBidWZmZXIgPSBlbmNvZGVNZXNzYWdlKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSk7XG5cbiAgICB0aGlzLnNvY2tldC5zZW5kKGJ1ZmZlcik7XG4gIH1cbn1cblxuY2xhc3MgU29ja2V0U2lua1NlcnZlciBleHRlbmRzIExmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBwb3J0OiAzMDMxXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIHRoaXMuc2VydmVyID0gbnVsbDtcbiAgICB0aGlzLmluaXRTZXJ2ZXIoKTtcbiAgfVxuXG4gIGluaXRTZXJ2ZXIoKSB7XG4gICAgdGhpcy5zZXJ2ZXIgPSBuZXcgV2ViU29ja2V0U2VydmVyKHsgcG9ydDogdGhpcy5wYXJhbXMucG9ydCB9KTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgdmFyIGFycmF5QnVmZmVyID0gZW5jb2RlTWVzc2FnZSh0aW1lLCBmcmFtZSwgbWV0YURhdGEpO1xuICAgIHZhciBidWZmZXIgPSBhcnJheUJ1ZmZlclRvQnVmZmVyKGFycmF5QnVmZmVyKTtcblxuICAgIHRoaXMuc2VydmVyLmNsaWVudHMuZm9yRWFjaChmdW5jdGlvbihjbGllbnQpIHtcbiAgICAgIC8vIGNvbnNvbGUudGltZUVuZCgnU2VydmVyUHJvY2VzcycpO1xuICAgICAgY2xpZW50LnNlbmQoYnVmZmVyKTtcbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgU29ja2V0U2lua0NsaWVudDogU29ja2V0U2lua0NsaWVudCxcbiAgU29ja2V0U2lua1NlcnZlcjogU29ja2V0U2lua1NlcnZlclxufTtcblxuXG5cblxuXG5cblxuIl19