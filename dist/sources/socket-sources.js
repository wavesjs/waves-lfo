"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");
var WebSocketServer = require("ws").Server;

var _require = require("../utils/socket-utils");

var bufferToArrayBuffer = _require.bufferToArrayBuffer;
var encodeMessage = _require.encodeMessage;
var decodeMessage = _require.decodeMessage;

// @TODO: handle `start` and `stop`

var SocketSourceServer = (function (_Lfo) {
  function SocketSourceServer(options) {
    _classCallCheck(this, SocketSourceServer);

    var defaults = {
      port: 3030
    };

    _get(_core.Object.getPrototypeOf(SocketSourceServer.prototype), "constructor", this).call(this, options, defaults);

    // @TODO handle disconnect and so on...
    this.clients = [];
    this.server = null;
    this.initServer();

    // @FIXME - right place ?
    this.start();
  }

  _inherits(SocketSourceServer, _Lfo);

  _createClass(SocketSourceServer, {
    start: {
      value: function start() {
        this.initialize();
        this.reset();
      }
    },
    initServer: {
      value: function initServer() {
        var _this = this;

        this.server = new WebSocketServer({ port: this.params.port });

        this.server.on("connection", function (socket) {
          // this.clients.push(socket);
          socket.on("message", _this.process.bind(_this));
        });
      }
    },
    process: {
      value: function process(buffer) {
        var arrayBuffer = bufferToArrayBuffer(buffer);
        var message = decodeMessage(arrayBuffer);

        this.time = message.time;
        this.outFrame = message.frame;
        this.metaData = message.metaData;

        this.output();
      }
    }
  });

  return SocketSourceServer;
})(Lfo);

var SocketSourceClient = (function (_Lfo2) {
  function SocketSourceClient(options) {
    _classCallCheck(this, SocketSourceClient);

    var defaults = {
      port: 3031,
      address: window.location.hostname
    };

    _get(_core.Object.getPrototypeOf(SocketSourceClient.prototype), "constructor", this).call(this, options, defaults);

    this.socket = null;
    this.initConnection();
  }

  _inherits(SocketSourceClient, _Lfo2);

  _createClass(SocketSourceClient, {
    start: {
      value: function start() {
        this.initialize();
        this.reset();
      }
    },
    configureStream: {
      value: function configureStream() {
        this.streamParams.frameSize = this.params.frameSize;
        this.streamParams.frameRate = this.params.frameRate;
        // @NOTE does it make sens ?
        this.streamParams.blockSampleRate = this.params.frameRate * this.params.frameSize;
      }
    },
    initConnection: {
      value: function initConnection() {
        var _this = this;

        var socketAddr = "ws://" + this.params.address + ":" + this.params.port;
        this.socket = new WebSocket(socketAddr);
        this.socket.binaryType = "arraybuffer";

        // callback to start to when WebSocket is connected
        this.socket.onopen = function () {
          _this.start();
        };

        this.socket.onclose = function () {};

        this.socket.onmessage = function (message) {
          _this.process(message.data);
        };

        this.socket.onerror = function () {
          console.log(err);
        };
      }
    },
    process: {
      value: function process(buffer) {
        var message = decodeMessage(buffer);

        this.time = message.time;
        this.outFrame = message.frame;
        this.metaData = message.metaData;

        this.output();
      }
    }
  });

  return SocketSourceClient;
})(Lfo);

module.exports = {
  SocketSourceServer: SocketSourceServer,
  SocketSourceClient: SocketSourceClient
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3NvY2tldC1zb3VyY2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUVBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3RDLElBQUksZUFBZSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUM7O2VBQ2lCLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQzs7SUFBdEYsbUJBQW1CLFlBQW5CLG1CQUFtQjtJQUFFLGFBQWEsWUFBYixhQUFhO0lBQUUsYUFBYSxZQUFiLGFBQWE7Ozs7SUFJakQsa0JBQWtCO0FBQ1gsV0FEUCxrQkFBa0IsQ0FDVixPQUFPLEVBQUU7MEJBRGpCLGtCQUFrQjs7QUFFcEIsUUFBSSxRQUFRLEdBQUc7QUFDYixVQUFJLEVBQUUsSUFBSTtLQUNYLENBQUM7O0FBRUYscUNBTkUsa0JBQWtCLDZDQU1kLE9BQU8sRUFBRSxRQUFRLEVBQUU7OztBQUd6QixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNsQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixRQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7OztBQUdsQixRQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDZDs7WUFmRyxrQkFBa0I7O2VBQWxCLGtCQUFrQjtBQWlCdEIsU0FBSzthQUFBLGlCQUFHO0FBQ04sWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLFlBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztPQUNkOztBQUVELGNBQVU7YUFBQSxzQkFBRzs7O0FBQ1gsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGVBQWUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7O0FBRTlELFlBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFBLE1BQU0sRUFBSTs7QUFFckMsZ0JBQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLE1BQUssT0FBTyxDQUFDLElBQUksT0FBTSxDQUFDLENBQUM7U0FDL0MsQ0FBQyxDQUFDO09BQ0o7O0FBRUQsV0FBTzthQUFBLGlCQUFDLE1BQU0sRUFBRTtBQUNkLFlBQUksV0FBVyxHQUFHLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLFlBQUksT0FBTyxHQUFHLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFekMsWUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ3pCLFlBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztBQUM5QixZQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7O0FBRWpDLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNmOzs7O1NBeENHLGtCQUFrQjtHQUFTLEdBQUc7O0lBMkM5QixrQkFBa0I7QUFDWCxXQURQLGtCQUFrQixDQUNWLE9BQU8sRUFBRTswQkFEakIsa0JBQWtCOztBQUVwQixRQUFJLFFBQVEsR0FBRztBQUNiLFVBQUksRUFBRSxJQUFJO0FBQ1YsYUFBTyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUTtLQUNsQyxDQUFDOztBQUVGLHFDQVBFLGtCQUFrQiw2Q0FPZCxPQUFPLEVBQUUsUUFBUSxFQUFFOztBQUV6QixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixRQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7R0FDdkI7O1lBWEcsa0JBQWtCOztlQUFsQixrQkFBa0I7QUFhdEIsU0FBSzthQUFBLGlCQUFHO0FBQ04sWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLFlBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztPQUNkOztBQUVELG1CQUFlO2FBQUEsMkJBQUc7QUFDaEIsWUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDcEQsWUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7O0FBRXBELFlBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO09BQ25GOztBQUVELGtCQUFjO2FBQUEsMEJBQUc7OztBQUNmLFlBQUksVUFBVSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDeEUsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN4QyxZQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxhQUFhLENBQUM7OztBQUd2QyxZQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFNO0FBQ3pCLGdCQUFLLEtBQUssRUFBRSxDQUFDO1NBQ2QsQ0FBQzs7QUFFRixZQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFNLEVBRTNCLENBQUM7O0FBRUYsWUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsVUFBQyxPQUFPLEVBQUs7QUFDbkMsZ0JBQUssT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1QixDQUFDOztBQUVGLFlBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLFlBQU07QUFDMUIsaUJBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEIsQ0FBQztPQUNIOztBQUVELFdBQU87YUFBQSxpQkFBQyxNQUFNLEVBQUU7QUFDZCxZQUFJLE9BQU8sR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXBDLFlBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztBQUN6QixZQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7QUFDOUIsWUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDOztBQUVqQyxZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZjs7OztTQXhERyxrQkFBa0I7R0FBUyxHQUFHOztBQTJEcEMsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLG9CQUFrQixFQUFFLGtCQUFrQjtBQUN0QyxvQkFBa0IsRUFBRSxrQkFBa0I7Q0FDdkMsQ0FBQyIsImZpbGUiOiJlczYvc291cmNlcy9zb2NrZXQtc291cmNlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIExmbyA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcbnZhciBXZWJTb2NrZXRTZXJ2ZXIgPSByZXF1aXJlKCd3cycpLlNlcnZlcjtcbnZhciB7IGJ1ZmZlclRvQXJyYXlCdWZmZXIsIGVuY29kZU1lc3NhZ2UsIGRlY29kZU1lc3NhZ2UgfSA9IHJlcXVpcmUoJy4uL3V0aWxzL3NvY2tldC11dGlscycpO1xuXG4vLyBAVE9ETzogaGFuZGxlIGBzdGFydGAgYW5kIGBzdG9wYFxuXG5jbGFzcyBTb2NrZXRTb3VyY2VTZXJ2ZXIgZXh0ZW5kcyBMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgcG9ydDogMzAzMFxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICAvLyBAVE9ETyBoYW5kbGUgZGlzY29ubmVjdCBhbmQgc28gb24uLi5cbiAgICB0aGlzLmNsaWVudHMgPSBbXTtcbiAgICB0aGlzLnNlcnZlciA9IG51bGw7XG4gICAgdGhpcy5pbml0U2VydmVyKCk7XG5cbiAgICAvLyBARklYTUUgLSByaWdodCBwbGFjZSA/XG4gICAgdGhpcy5zdGFydCgpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgaW5pdFNlcnZlcigpIHtcbiAgICB0aGlzLnNlcnZlciA9IG5ldyBXZWJTb2NrZXRTZXJ2ZXIoeyBwb3J0OiB0aGlzLnBhcmFtcy5wb3J0IH0pO1xuXG4gICAgdGhpcy5zZXJ2ZXIub24oJ2Nvbm5lY3Rpb24nLCBzb2NrZXQgPT4ge1xuICAgICAgLy8gdGhpcy5jbGllbnRzLnB1c2goc29ja2V0KTtcbiAgICAgIHNvY2tldC5vbignbWVzc2FnZScsIHRoaXMucHJvY2Vzcy5iaW5kKHRoaXMpKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByb2Nlc3MoYnVmZmVyKSB7XG4gICAgdmFyIGFycmF5QnVmZmVyID0gYnVmZmVyVG9BcnJheUJ1ZmZlcihidWZmZXIpO1xuICAgIHZhciBtZXNzYWdlID0gZGVjb2RlTWVzc2FnZShhcnJheUJ1ZmZlcik7XG5cbiAgICB0aGlzLnRpbWUgPSBtZXNzYWdlLnRpbWU7XG4gICAgdGhpcy5vdXRGcmFtZSA9IG1lc3NhZ2UuZnJhbWU7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1lc3NhZ2UubWV0YURhdGE7XG5cbiAgICB0aGlzLm91dHB1dCgpO1xuICB9XG59XG5cbmNsYXNzIFNvY2tldFNvdXJjZUNsaWVudCBleHRlbmRzIExmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBwb3J0OiAzMDMxLFxuICAgICAgYWRkcmVzczogd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIHRoaXMuc29ja2V0ID0gbnVsbDtcbiAgICB0aGlzLmluaXRDb25uZWN0aW9uKCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICBjb25maWd1cmVTdHJlYW0oKSB7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHRoaXMucGFyYW1zLmZyYW1lUmF0ZTtcbiAgICAvLyBATk9URSBkb2VzIGl0IG1ha2Ugc2VucyA/XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuYmxvY2tTYW1wbGVSYXRlID0gdGhpcy5wYXJhbXMuZnJhbWVSYXRlICogdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICB9XG5cbiAgaW5pdENvbm5lY3Rpb24oKSB7XG4gICAgdmFyIHNvY2tldEFkZHIgPSAnd3M6Ly8nICsgdGhpcy5wYXJhbXMuYWRkcmVzcyArICc6JyArIHRoaXMucGFyYW1zLnBvcnQ7XG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KHNvY2tldEFkZHIpO1xuICAgIHRoaXMuc29ja2V0LmJpbmFyeVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG4gICAgLy8gY2FsbGJhY2sgdG8gc3RhcnQgdG8gd2hlbiBXZWJTb2NrZXQgaXMgY29ubmVjdGVkXG4gICAgdGhpcy5zb2NrZXQub25vcGVuID0gKCkgPT4ge1xuICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH07XG5cbiAgICB0aGlzLnNvY2tldC5vbmNsb3NlID0gKCkgPT4ge1xuXG4gICAgfTtcblxuICAgIHRoaXMuc29ja2V0Lm9ubWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XG4gICAgICB0aGlzLnByb2Nlc3MobWVzc2FnZS5kYXRhKTtcbiAgICB9O1xuXG4gICAgdGhpcy5zb2NrZXQub25lcnJvciA9ICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfTtcbiAgfVxuXG4gIHByb2Nlc3MoYnVmZmVyKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSBkZWNvZGVNZXNzYWdlKGJ1ZmZlcik7XG5cbiAgICB0aGlzLnRpbWUgPSBtZXNzYWdlLnRpbWU7XG4gICAgdGhpcy5vdXRGcmFtZSA9IG1lc3NhZ2UuZnJhbWU7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1lc3NhZ2UubWV0YURhdGE7XG5cbiAgICB0aGlzLm91dHB1dCgpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBTb2NrZXRTb3VyY2VTZXJ2ZXI6IFNvY2tldFNvdXJjZVNlcnZlcixcbiAgU29ja2V0U291cmNlQ2xpZW50OiBTb2NrZXRTb3VyY2VDbGllbnRcbn07Il19