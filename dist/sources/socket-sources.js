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
          // this.socket.on('message', this.process.bind(this));
          _this.start();
        };

        this.socket.onclose = function () {};

        this.socket.onmessage = function (message) {
          _this.process(message.data);

          // should not receive messages
          // maybe handshakes form the server ?
        };

        this.socket.onerror = function () {};
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

// repoen socket ?
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3NvY2tldC1zb3VyY2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUVBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3RDLElBQUksZUFBZSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUM7O2VBQ2lCLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQzs7SUFBdEYsbUJBQW1CLFlBQW5CLG1CQUFtQjtJQUFFLGFBQWEsWUFBYixhQUFhO0lBQUUsYUFBYSxZQUFiLGFBQWE7Ozs7SUFJakQsa0JBQWtCO0FBQ1gsV0FEUCxrQkFBa0IsQ0FDVixPQUFPLEVBQUU7MEJBRGpCLGtCQUFrQjs7QUFFcEIsUUFBSSxRQUFRLEdBQUc7QUFDYixVQUFJLEVBQUUsSUFBSTtLQUNYLENBQUM7O0FBRUYscUNBTkUsa0JBQWtCLDZDQU1kLE9BQU8sRUFBRSxRQUFRLEVBQUU7OztBQUd6QixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNsQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixRQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7OztBQUdsQixRQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDZDs7WUFmRyxrQkFBa0I7O2VBQWxCLGtCQUFrQjtBQWlCdEIsU0FBSzthQUFBLGlCQUFHO0FBQ04sWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLFlBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztPQUNkOztBQUVELGNBQVU7YUFBQSxzQkFBRzs7O0FBQ1gsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGVBQWUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7O0FBRTlELFlBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFBLE1BQU0sRUFBSTs7QUFFckMsZ0JB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Qzs7QUFFakMsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2Y7Ozs7U0E1REcsa0JBQWtCO0dBQVMsR0FBRzs7QUErRHBDLE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixvQkFBa0IsRUFBRSxrQkFBa0I7QUFDdEMsb0JBQWtCLEVBQUUsa0JBQWtCO0NBQ3ZDLENBQUMiLCJmaWxlIjoiZXM2L3NvdXJjZXMvc29ja2V0LXNvdXJjZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBMZm8gPSByZXF1aXJlKCcuLi9jb3JlL2xmby1iYXNlJyk7XG52YXIgV2ViU29ja2V0U2VydmVyID0gcmVxdWlyZSgnd3MnKS5TZXJ2ZXI7XG52YXIgeyBidWZmZXJUb0FycmF5QnVmZmVyLCBlbmNvZGVNZXNzYWdlLCBkZWNvZGVNZXNzYWdlIH0gPSByZXF1aXJlKCcuLi91dGlscy9zb2NrZXQtdXRpbHMnKTtcblxuLy8gQFRPRE86IGhhbmRsZSBgc3RhcnRgIGFuZCBgc3RvcGBcblxuY2xhc3MgU29ja2V0U291cmNlU2VydmVyIGV4dGVuZHMgTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIHBvcnQ6IDMwMzBcbiAgICB9O1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgLy8gQFRPRE8gaGFuZGxlIGRpc2Nvbm5lY3QgYW5kIHNvIG9uLi4uXG4gICAgdGhpcy5jbGllbnRzID0gW107XG4gICAgdGhpcy5zZXJ2ZXIgPSBudWxsO1xuICAgIHRoaXMuaW5pdFNlcnZlcigpO1xuXG4gICAgLy8gQEZJWE1FIC0gcmlnaHQgcGxhY2UgP1xuICAgIHRoaXMuc3RhcnQoKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIGluaXRTZXJ2ZXIoKSB7XG4gICAgdGhpcy5zZXJ2ZXIgPSBuZXcgV2ViU29ja2V0U2VydmVyKHsgcG9ydDogdGhpcy5wYXJhbXMucG9ydCB9KTtcblxuICAgIHRoaXMuc2VydmVyLm9uKCdjb25uZWN0aW9uJywgc29ja2V0ID0+IHtcbiAgICAgIC8vIHRoaXMuY2xpZW50cy5wdXNoKHNvY2tldCk7XG4gICAgICBzb2NrZXQub24oJ21lc3NhZ2UnLCB0aGlzLnByb2Nlc3MuYmluZCh0aGlzKSk7XG4gICAgfSk7XG4gIH1cblxuICBwcm9jZXNzKGJ1ZmZlcikge1xuICAgIHZhciBhcnJheUJ1ZmZlciA9IGJ1ZmZlclRvQXJyYXlCdWZmZXIoYnVmZmVyKTtcbiAgICB2YXIgbWVzc2FnZSA9IGRlY29kZU1lc3NhZ2UoYXJyYXlCdWZmZXIpO1xuXG4gICAgdGhpcy50aW1lID0gbWVzc2FnZS50aW1lO1xuICAgIHRoaXMub3V0RnJhbWUgPSBtZXNzYWdlLmZyYW1lO1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXNzYWdlLm1ldGFEYXRhO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufVxuXG5jbGFzcyBTb2NrZXRTb3VyY2VDbGllbnQgZXh0ZW5kcyBMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgcG9ydDogMzAzMSxcbiAgICAgIGFkZHJlc3M6IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZVxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICB0aGlzLnNvY2tldCA9IG51bGw7XG4gICAgdGhpcy5pbml0Q29ubmVjdGlvbigpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgY29uZmlndXJlU3RyZWFtKCkge1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSB0aGlzLnBhcmFtcy5mcmFtZVJhdGU7XG4gICAgLy8gQE5PVEUgZG9lcyBpdCBtYWtlIHNlbnMgP1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmJsb2NrU2FtcGxlUmF0ZSA9IHRoaXMucGFyYW1zLmZyYW1lUmF0ZSAqIHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcbiAgfVxuXG4gIGluaXRDb25uZWN0aW9uKCkge1xuICAgIHZhciBzb2NrZXRBZGRyID0gJ3dzOi8vJyArIHRoaXMucGFyYW1zLmFkZHJlc3MgKyAnOicgKyB0aGlzLnBhcmFtcy5wb3J0O1xuICAgIHRoaXMuc29ja2V0ID0gbmV3IFdlYlNvY2tldChzb2NrZXRBZGRyKTtcbiAgICB0aGlzLnNvY2tldC5iaW5hcnlUeXBlID0gJ2FycmF5YnVmZmVyJztcblxuICAgIC8vIGNhbGxiYWNrIHRvIHN0YXJ0IHRvIHdoZW4gV2ViU29ja2V0IGlzIGNvbm5lY3RlZFxuICAgIHRoaXMuc29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAgIC8vIHRoaXMuc29ja2V0Lm9uKCdtZXNzYWdlJywgdGhpcy5wcm9jZXNzLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH07XG5cbiAgICB0aGlzLnNvY2tldC5vbmNsb3NlID0gKCkgPT4ge1xuXG4gICAgfTtcblxuICAgIHRoaXMuc29ja2V0Lm9ubWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XG4gICAgICB0aGlzLnByb2Nlc3MobWVzc2FnZS5kYXRhKTtcblxuICAgICAgLy8gc2hvdWxkIG5vdCByZWNlaXZlIG1lc3NhZ2VzXG4gICAgICAvLyBtYXliZSBoYW5kc2hha2VzIGZvcm0gdGhlIHNlcnZlciA/XG4gICAgfTtcblxuICAgIHRoaXMuc29ja2V0Lm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAvLyByZXBvZW4gc29ja2V0ID9cbiAgICB9O1xuICB9XG5cbiAgcHJvY2VzcyhidWZmZXIpIHtcbiAgICB2YXIgbWVzc2FnZSA9IGRlY29kZU1lc3NhZ2UoYnVmZmVyKTtcblxuICAgIHRoaXMudGltZSA9IG1lc3NhZ2UudGltZTtcbiAgICB0aGlzLm91dEZyYW1lID0gbWVzc2FnZS5mcmFtZTtcbiAgICB0aGlzLm1ldGFEYXRhID0gbWVzc2FnZS5tZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFNvY2tldFNvdXJjZVNlcnZlcjogU29ja2V0U291cmNlU2VydmVyLFxuICBTb2NrZXRTb3VyY2VDbGllbnQ6IFNvY2tldFNvdXJjZUNsaWVudFxufTsiXX0=