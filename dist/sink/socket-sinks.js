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

/*
class SocketSynk {
  constructor() {

  }

  // prepare the buffer to send over the network
  formatMessage() {

  }

  // onmessage callback
  // dispatch handchecks and data message
  routeMessage() {

  }
}
*/

// send an Lfo stream from the browser over the network
// throught a WebSocket - should be paired with a SocketSourceServer
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

        this.socket.onerror = function () {};
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

// should not receive messages
// maybe handshakes form the server ?

// repoen socket ?
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rL3NvY2tldC1zaW5rcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUN0QyxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDOztlQUNpQixPQUFPLENBQUMsdUJBQXVCLENBQUM7O0lBQXRGLGFBQWEsWUFBYixhQUFhO0lBQUUsYUFBYSxZQUFiLGFBQWE7SUFBRSxtQkFBbUIsWUFBbkIsbUJBQW1COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBd0JqRCxnQkFBZ0I7QUFDVCxXQURQLGdCQUFnQixDQUNSLE9BQU8sRUFBRTswQkFEakIsZ0JBQWdCOztBQUVsQixRQUFJLFFBQVEsR0FBRztBQUNiLFVBQUksRUFBRSxJQUFJO0FBQ1YsYUFBTyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUTtLQUNsQyxDQUFDOztBQUVGLHFDQVBFLGdCQUFnQiw2Q0FPWixPQUFPLEVBQUUsUUFBUSxFQUFFOztBQUV6QixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixRQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7R0FDdkI7O1lBWEcsZ0JBQWdCOztlQUFoQixnQkFBZ0I7QUFhcEIsa0JBQWM7YUFBQSwwQkFBRzs7O0FBQ2YsWUFBSSxVQUFVLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztBQUN4RSxZQUFJLENBQUMsTUFBTSxHQUFHLElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hDLFlBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLGFBQWEsQ0FBQzs7O0FBR3ZDLFlBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLFlBQU07QUFDekIsZ0JBQUssTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3RCLENBQUM7O0FBRUYsWUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBTSxFQUUzQixDQUFDOztBQUVGLFlBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLFlBQU0sRUFHN0IsQ0FBQzs7QUFFRixZQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFNLEVBRTNCLENBQUM7T0FDSDs7QUFFRCxXQUFPO2FBQUEsaUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsWUFBSSxNQUFNLEdBQUcsYUFBYSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbEQsWUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDMUI7Ozs7U0F4Q0csZ0JBQWdCO0dBQVMsR0FBRzs7SUEyQzVCLGdCQUFnQjtBQUNULFdBRFAsZ0JBQWdCLENBQ1IsT0FBTyxFQUFFOzBCQURqQixnQkFBZ0I7O0FBRWxCLFFBQUksUUFBUSxHQUFHO0FBQ2IsVUFBSSxFQUFFLElBQUk7S0FDWCxDQUFDOztBQUVGLHFDQU5FLGdCQUFnQiw2Q0FNWixPQUFPLEVBQUUsUUFBUSxFQUFFOztBQUV6QixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixRQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDbkI7O1lBVkcsZ0JBQWdCOztlQUFoQixnQkFBZ0I7QUFZcEIsY0FBVTthQUFBLHNCQUFHO0FBQ1gsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGVBQWUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7T0FDL0Q7O0FBRUQsV0FBTzthQUFBLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFlBQUksV0FBVyxHQUFHLGFBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZELFlBQUksTUFBTSxHQUFHLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUU5QyxZQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBUyxNQUFNLEVBQUU7QUFDM0MsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDckIsQ0FBQyxDQUFDO09BQ0o7Ozs7U0F2QkcsZ0JBQWdCO0dBQVMsR0FBRzs7QUEwQmxDLE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixrQkFBZ0IsRUFBRSxnQkFBZ0I7QUFDbEMsa0JBQWdCLEVBQUUsZ0JBQWdCO0NBQ25DLENBQUMiLCJmaWxlIjoiZXM2L3Npbmsvc29ja2V0LXNpbmtzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgTGZvID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xudmFyIFdlYlNvY2tldFNlcnZlciA9IHJlcXVpcmUoJ3dzJykuU2VydmVyO1xudmFyIHsgZW5jb2RlTWVzc2FnZSwgZGVjb2RlTWVzc2FnZSwgYXJyYXlCdWZmZXJUb0J1ZmZlciB9ID0gcmVxdWlyZSgnLi4vdXRpbHMvc29ja2V0LXV0aWxzJyk7XG5cbi8qXG5jbGFzcyBTb2NrZXRTeW5rIHtcbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgfVxuXG4gIC8vIHByZXBhcmUgdGhlIGJ1ZmZlciB0byBzZW5kIG92ZXIgdGhlIG5ldHdvcmtcbiAgZm9ybWF0TWVzc2FnZSgpIHtcblxuICB9XG5cbiAgLy8gb25tZXNzYWdlIGNhbGxiYWNrXG4gIC8vIGRpc3BhdGNoIGhhbmRjaGVja3MgYW5kIGRhdGEgbWVzc2FnZVxuICByb3V0ZU1lc3NhZ2UoKSB7XG5cbiAgfVxufVxuKi9cblxuLy8gc2VuZCBhbiBMZm8gc3RyZWFtIGZyb20gdGhlIGJyb3dzZXIgb3ZlciB0aGUgbmV0d29ya1xuLy8gdGhyb3VnaHQgYSBXZWJTb2NrZXQgLSBzaG91bGQgYmUgcGFpcmVkIHdpdGggYSBTb2NrZXRTb3VyY2VTZXJ2ZXJcbi8vIEBOT1RFOiBkb2VzIGl0IG5lZWQgdG8gaW1wbGVtZW50IHNvbWUgcGluZyBwcm9jZXNzIHRvIG1haW50YWluIGNvbm5lY3Rpb24gP1xuY2xhc3MgU29ja2V0U2lua0NsaWVudCBleHRlbmRzIExmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBwb3J0OiAzMDMwLFxuICAgICAgYWRkcmVzczogd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIHRoaXMuc29ja2V0ID0gbnVsbDtcbiAgICB0aGlzLmluaXRDb25uZWN0aW9uKCk7XG4gIH1cblxuICBpbml0Q29ubmVjdGlvbigpIHtcbiAgICB2YXIgc29ja2V0QWRkciA9ICd3czovLycgKyB0aGlzLnBhcmFtcy5hZGRyZXNzICsgJzonICsgdGhpcy5wYXJhbXMucG9ydDtcbiAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQoc29ja2V0QWRkcik7XG4gICAgdGhpcy5zb2NrZXQuYmluYXJ5VHlwZSA9ICdhcnJheWJ1ZmZlcic7XG5cbiAgICAvLyBjYWxsYmFjayB0byBzdGFydCB0byB3aGVuIFdlYlNvY2tldCBpcyBjb25uZWN0ZWRcbiAgICB0aGlzLnNvY2tldC5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICB0aGlzLnBhcmFtcy5vbm9wZW4oKTtcbiAgICB9O1xuXG4gICAgdGhpcy5zb2NrZXQub25jbG9zZSA9ICgpID0+IHtcblxuICAgIH07XG5cbiAgICB0aGlzLnNvY2tldC5vbm1lc3NhZ2UgPSAoKSA9PiB7XG4gICAgICAvLyBzaG91bGQgbm90IHJlY2VpdmUgbWVzc2FnZXNcbiAgICAgIC8vIG1heWJlIGhhbmRzaGFrZXMgZm9ybSB0aGUgc2VydmVyID9cbiAgICB9O1xuXG4gICAgdGhpcy5zb2NrZXQub25lcnJvciA9ICgpID0+IHtcbiAgICAgIC8vIHJlcG9lbiBzb2NrZXQgP1xuICAgIH07XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIHZhciBidWZmZXIgPSBlbmNvZGVNZXNzYWdlKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSk7XG4gICAgdGhpcy5zb2NrZXQuc2VuZChidWZmZXIpO1xuICB9XG59XG5cbmNsYXNzIFNvY2tldFNpbmtTZXJ2ZXIgZXh0ZW5kcyBMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgcG9ydDogMzAzMVxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICB0aGlzLnNlcnZlciA9IG51bGw7XG4gICAgdGhpcy5pbml0U2VydmVyKCk7XG4gIH1cblxuICBpbml0U2VydmVyKCkge1xuICAgIHRoaXMuc2VydmVyID0gbmV3IFdlYlNvY2tldFNlcnZlcih7IHBvcnQ6IHRoaXMucGFyYW1zLnBvcnQgfSk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIHZhciBhcnJheUJ1ZmZlciA9IGVuY29kZU1lc3NhZ2UodGltZSwgZnJhbWUsIG1ldGFEYXRhKTtcbiAgICB2YXIgYnVmZmVyID0gYXJyYXlCdWZmZXJUb0J1ZmZlcihhcnJheUJ1ZmZlcik7XG5cbiAgICB0aGlzLnNlcnZlci5jbGllbnRzLmZvckVhY2goZnVuY3Rpb24oY2xpZW50KSB7XG4gICAgICBjbGllbnQuc2VuZChidWZmZXIpO1xuICAgIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBTb2NrZXRTaW5rQ2xpZW50OiBTb2NrZXRTaW5rQ2xpZW50LFxuICBTb2NrZXRTaW5rU2VydmVyOiBTb2NrZXRTaW5rU2VydmVyXG59O1xuXG5cblxuXG5cblxuXG4iXX0=