"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");
var WebSocketServer = require("ws").Server;

var _require = require("../utils/socket-utils");

var encodeMessage = _require.encodeMessage;
var decodeMessage = _require.decodeMessage;
var arrayBufferToBuffer = _require.arrayBufferToBuffer;

// send an Lfo stream from the browser over the network
// through a WebSocket - should be paired with a SocketSourceServer
// @NOTE: does it need to implement some ping process to maintain connection ?

var SocketSinkClient = (function (_Lfo) {
  function SocketSinkClient(options) {
    _classCallCheck(this, SocketSinkClient);

    var defaults = {
      port: 3030,
      address: window.location.hostname
    };

    _get(_core.Object.getPrototypeOf(SocketSinkClient.prototype), "constructor", this).call(this, options, defaults);

    this.socket = null;
    this.initConnection();
  }

  _inherits(SocketSinkClient, _Lfo);

  _createClass(SocketSinkClient, {
    initConnection: {
      value: function initConnection() {
        var _this = this;

        var socketAddr = "ws://" + this.params.address + ":" + this.params.port;
        this.socket = new WebSocket(socketAddr);
        this.socket.binaryType = "arraybuffer";

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
    },
    process: {
      value: function process(time, frame, metaData) {
        var buffer = encodeMessage(time, frame, metaData);

        this.socket.send(buffer);
      }
    }
  });

  return SocketSinkClient;
})(Lfo);

var SocketSinkServer = (function (_Lfo2) {
  function SocketSinkServer(options) {
    _classCallCheck(this, SocketSinkServer);

    var defaults = {
      port: 3031
    };

    _get(_core.Object.getPrototypeOf(SocketSinkServer.prototype), "constructor", this).call(this, options, defaults);

    this.server = null;
    this.initServer();
  }

  _inherits(SocketSinkServer, _Lfo2);

  _createClass(SocketSinkServer, {
    initServer: {
      value: function initServer() {
        this.server = new WebSocketServer({ port: this.params.port });
      }
    },
    process: {
      value: function process(time, frame, metaData) {
        var arrayBuffer = encodeMessage(time, frame, metaData);
        var buffer = arrayBufferToBuffer(arrayBuffer);

        this.server.clients.forEach(function (client) {
          // console.timeEnd('ServerProcess');
          client.send(buffer);
        });
      }
    }
  });

  return SocketSinkServer;
})(Lfo);

module.exports = {
  SocketSinkClient: SocketSinkClient,
  SocketSinkServer: SocketSinkServer
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rL3NvY2tldC1zaW5rcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUN0QyxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDOztlQUNpQixPQUFPLENBQUMsdUJBQXVCLENBQUM7O0lBQXRGLGFBQWEsWUFBYixhQUFhO0lBQUUsYUFBYSxZQUFiLGFBQWE7SUFBRSxtQkFBbUIsWUFBbkIsbUJBQW1COzs7Ozs7SUFLakQsZ0JBQWdCO0FBQ1QsV0FEUCxnQkFBZ0IsQ0FDUixPQUFPLEVBQUU7MEJBRGpCLGdCQUFnQjs7QUFFbEIsUUFBSSxRQUFRLEdBQUc7QUFDYixVQUFJLEVBQUUsSUFBSTtBQUNWLGFBQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVE7S0FDbEMsQ0FBQzs7QUFFRixxQ0FQRSxnQkFBZ0IsNkNBT1osT0FBTyxFQUFFLFFBQVEsRUFBRTs7QUFFekIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsUUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0dBQ3ZCOztZQVhHLGdCQUFnQjs7ZUFBaEIsZ0JBQWdCO0FBYXBCLGtCQUFjO2FBQUEsMEJBQUc7OztBQUNmLFlBQUksVUFBVSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDeEUsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN4QyxZQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxhQUFhLENBQUM7OztBQUd2QyxZQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFNO0FBQ3pCLGdCQUFLLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUN0QixDQUFDOztBQUVGLFlBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLFlBQU0sRUFFM0IsQ0FBQzs7QUFFRixZQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxZQUFNLEVBRTdCLENBQUM7O0FBRUYsWUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBQyxHQUFHLEVBQUs7QUFDN0IsaUJBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEIsQ0FBQztPQUNIOztBQUVELFdBQU87YUFBQSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixZQUFJLE1BQU0sR0FBRyxhQUFhLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQzs7QUFFbEQsWUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDMUI7Ozs7U0F4Q0csZ0JBQWdCO0dBQVMsR0FBRzs7SUEyQzVCLGdCQUFnQjtBQUNULFdBRFAsZ0JBQWdCLENBQ1IsT0FBTyxFQUFFOzBCQURqQixnQkFBZ0I7O0FBRWxCLFFBQUksUUFBUSxHQUFHO0FBQ2IsVUFBSSxFQUFFLElBQUk7S0FDWCxDQUFDOztBQUVGLHFDQU5FLGdCQUFnQiw2Q0FNWixPQUFPLEVBQUUsUUFBUSxFQUFFOztBQUV6QixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixRQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDbkI7O1lBVkcsZ0JBQWdCOztlQUFoQixnQkFBZ0I7QUFZcEIsY0FBVTthQUFBLHNCQUFHO0FBQ1gsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGVBQWUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7T0FDL0Q7O0FBRUQsV0FBTzthQUFBLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFlBQUksV0FBVyxHQUFHLGFBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZELFlBQUksTUFBTSxHQUFHLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUU5QyxZQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBUyxNQUFNLEVBQUU7O0FBRTNDLGdCQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3JCLENBQUMsQ0FBQztPQUNKOzs7O1NBeEJHLGdCQUFnQjtHQUFTLEdBQUc7O0FBMkJsQyxNQUFNLENBQUMsT0FBTyxHQUFHO0FBQ2Ysa0JBQWdCLEVBQUUsZ0JBQWdCO0FBQ2xDLGtCQUFnQixFQUFFLGdCQUFnQjtDQUNuQyxDQUFDIiwiZmlsZSI6ImVzNi9zaW5rL3NvY2tldC1zaW5rcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIExmbyA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcbnZhciBXZWJTb2NrZXRTZXJ2ZXIgPSByZXF1aXJlKCd3cycpLlNlcnZlcjtcbnZhciB7IGVuY29kZU1lc3NhZ2UsIGRlY29kZU1lc3NhZ2UsIGFycmF5QnVmZmVyVG9CdWZmZXIgfSA9IHJlcXVpcmUoJy4uL3V0aWxzL3NvY2tldC11dGlscycpO1xuXG4vLyBzZW5kIGFuIExmbyBzdHJlYW0gZnJvbSB0aGUgYnJvd3NlciBvdmVyIHRoZSBuZXR3b3JrXG4vLyB0aHJvdWdoIGEgV2ViU29ja2V0IC0gc2hvdWxkIGJlIHBhaXJlZCB3aXRoIGEgU29ja2V0U291cmNlU2VydmVyXG4vLyBATk9URTogZG9lcyBpdCBuZWVkIHRvIGltcGxlbWVudCBzb21lIHBpbmcgcHJvY2VzcyB0byBtYWludGFpbiBjb25uZWN0aW9uID9cbmNsYXNzIFNvY2tldFNpbmtDbGllbnQgZXh0ZW5kcyBMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgcG9ydDogMzAzMCxcbiAgICAgIGFkZHJlc3M6IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZVxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICB0aGlzLnNvY2tldCA9IG51bGw7XG4gICAgdGhpcy5pbml0Q29ubmVjdGlvbigpO1xuICB9XG5cbiAgaW5pdENvbm5lY3Rpb24oKSB7XG4gICAgdmFyIHNvY2tldEFkZHIgPSAnd3M6Ly8nICsgdGhpcy5wYXJhbXMuYWRkcmVzcyArICc6JyArIHRoaXMucGFyYW1zLnBvcnQ7XG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KHNvY2tldEFkZHIpO1xuICAgIHRoaXMuc29ja2V0LmJpbmFyeVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG4gICAgLy8gY2FsbGJhY2sgdG8gc3RhcnQgdG8gd2hlbiBXZWJTb2NrZXQgaXMgY29ubmVjdGVkXG4gICAgdGhpcy5zb2NrZXQub25vcGVuID0gKCkgPT4ge1xuICAgICAgdGhpcy5wYXJhbXMub25vcGVuKCk7XG4gICAgfTtcblxuICAgIHRoaXMuc29ja2V0Lm9uY2xvc2UgPSAoKSA9PiB7XG5cbiAgICB9O1xuXG4gICAgdGhpcy5zb2NrZXQub25tZXNzYWdlID0gKCkgPT4ge1xuXG4gICAgfTtcblxuICAgIHRoaXMuc29ja2V0Lm9uZXJyb3IgPSAoZXJyKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH07XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIHZhciBidWZmZXIgPSBlbmNvZGVNZXNzYWdlKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSk7XG5cbiAgICB0aGlzLnNvY2tldC5zZW5kKGJ1ZmZlcik7XG4gIH1cbn1cblxuY2xhc3MgU29ja2V0U2lua1NlcnZlciBleHRlbmRzIExmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBwb3J0OiAzMDMxXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIHRoaXMuc2VydmVyID0gbnVsbDtcbiAgICB0aGlzLmluaXRTZXJ2ZXIoKTtcbiAgfVxuXG4gIGluaXRTZXJ2ZXIoKSB7XG4gICAgdGhpcy5zZXJ2ZXIgPSBuZXcgV2ViU29ja2V0U2VydmVyKHsgcG9ydDogdGhpcy5wYXJhbXMucG9ydCB9KTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgdmFyIGFycmF5QnVmZmVyID0gZW5jb2RlTWVzc2FnZSh0aW1lLCBmcmFtZSwgbWV0YURhdGEpO1xuICAgIHZhciBidWZmZXIgPSBhcnJheUJ1ZmZlclRvQnVmZmVyKGFycmF5QnVmZmVyKTtcblxuICAgIHRoaXMuc2VydmVyLmNsaWVudHMuZm9yRWFjaChmdW5jdGlvbihjbGllbnQpIHtcbiAgICAgIC8vIGNvbnNvbGUudGltZUVuZCgnU2VydmVyUHJvY2VzcycpO1xuICAgICAgY2xpZW50LnNlbmQoYnVmZmVyKTtcbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgU29ja2V0U2lua0NsaWVudDogU29ja2V0U2lua0NsaWVudCxcbiAgU29ja2V0U2lua1NlcnZlcjogU29ja2V0U2lua1NlcnZlclxufTtcblxuXG5cblxuXG5cblxuIl19