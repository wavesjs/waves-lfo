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

var _ws = require('ws');

var _utilsSocketUtils = require('../utils/socket-utils');

var WebSocketServer = _ws.Server;
// @TODO: handle `start` and `stop`

var SocketSourceServer = (function (_BaseLfo) {
  _inherits(SocketSourceServer, _BaseLfo);

  function SocketSourceServer(options) {
    _classCallCheck(this, SocketSourceServer);

    var defaults = {
      port: 3030
    };

    _get(Object.getPrototypeOf(SocketSourceServer.prototype), 'constructor', this).call(this, options, defaults);

    // @TODO handle disconnect and so on...
    this.clients = [];
    this.server = null;
    this.initServer();

    // @FIXME - right place ?
    this.start();
  }

  _createClass(SocketSourceServer, [{
    key: 'start',
    value: function start() {
      this.initialize();
      this.reset();
    }
  }, {
    key: 'initServer',
    value: function initServer() {
      var _this = this;

      this.server = new WebSocketServer({ port: this.params.port });

      this.server.on('connection', function (socket) {
        // this.clients.push(socket);
        socket.on('message', _this.process.bind(_this));
      });
    }
  }, {
    key: 'process',
    value: function process(buffer) {
      var arrayBuffer = (0, _utilsSocketUtils.bufferToArrayBuffer)(buffer);
      var message = (0, _utilsSocketUtils.decodeMessage)(arrayBuffer);

      this.time = message.time;
      this.outFrame = message.frame;
      this.metaData = message.metaData;

      this.output();
    }
  }]);

  return SocketSourceServer;
})(_coreBaseLfo2['default']);

var SocketSourceClient = (function (_BaseLfo2) {
  _inherits(SocketSourceClient, _BaseLfo2);

  function SocketSourceClient(options) {
    _classCallCheck(this, SocketSourceClient);

    var defaults = {
      port: 3031,
      address: window.location.hostname
    };

    _get(Object.getPrototypeOf(SocketSourceClient.prototype), 'constructor', this).call(this, options, defaults);

    this.socket = null;
    this.initConnection();
  }

  _createClass(SocketSourceClient, [{
    key: 'start',
    value: function start() {
      this.initialize();
      this.reset();
    }
  }, {
    key: 'configureStream',
    value: function configureStream() {
      this.streamParams.frameSize = this.params.frameSize;
      this.streamParams.frameRate = this.params.frameRate;
      // @NOTE does it make sens ?
      this.streamParams.blockSampleRate = this.params.frameRate * this.params.frameSize;
    }
  }, {
    key: 'initConnection',
    value: function initConnection() {
      var _this2 = this;

      var socketAddr = 'ws://' + this.params.address + ':' + this.params.port;
      this.socket = new WebSocket(socketAddr);
      this.socket.binaryType = 'arraybuffer';

      // callback to start to when WebSocket is connected
      this.socket.onopen = function () {
        _this2.start();
      };

      this.socket.onclose = function () {};

      this.socket.onmessage = function (message) {
        _this2.process(message.data);
      };

      this.socket.onerror = function () {
        console.log(err);
      };
    }
  }, {
    key: 'process',
    value: function process(buffer) {
      var message = (0, _utilsSocketUtils.decodeMessage)(buffer);

      this.time = message.time;
      this.outFrame = message.frame;
      this.metaData = message.metaData;

      this.output();
    }
  }]);

  return SocketSourceClient;
})(_coreBaseLfo2['default']);

exports['default'] = {
  SocketSourceServer: SocketSourceServer,
  SocketSourceClient: SocketSourceClient
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3NvY2tldC1zb3VyY2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OzsyQkFFTyxrQkFBa0I7Ozs7a0JBQ2YsSUFBSTs7Z0NBQ3VDLHVCQUF1Qjs7QUFFekYsSUFBTSxlQUFlLE9BSFosTUFBTSxBQUdlLENBQUM7OztJQUd6QixrQkFBa0I7WUFBbEIsa0JBQWtCOztBQUNYLFdBRFAsa0JBQWtCLENBQ1YsT0FBTyxFQUFFOzBCQURqQixrQkFBa0I7O0FBRXBCLFFBQUksUUFBUSxHQUFHO0FBQ2IsVUFBSSxFQUFFLElBQUk7S0FDWCxDQUFDOztBQUVGLCtCQU5FLGtCQUFrQiw2Q0FNZCxPQUFPLEVBQUUsUUFBUSxFQUFFOzs7QUFHekIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsUUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDOzs7QUFHbEIsUUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0dBQ2Q7O2VBZkcsa0JBQWtCOztXQWlCakIsaUJBQUc7QUFDTixVQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ2Q7OztXQUVTLHNCQUFHOzs7QUFDWCxVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksZUFBZSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQzs7QUFFOUQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLFVBQUEsTUFBTSxFQUFJOztBQUVyQyxjQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxNQUFLLE9BQU8sQ0FBQyxJQUFJLE9BQU0sQ0FBQyxDQUFDO09BQy9DLENBQUMsQ0FBQztLQUNKOzs7V0FFTSxpQkFBQyxNQUFNLEVBQUU7QUFDZCxVQUFJLFdBQVcs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QyIsImZpbGUiOiJlczYvc291cmNlcy9zb2NrZXQtc291cmNlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5pbXBvcnQgeyBTZXJ2ZXIgfSBmcm9tICd3cyc7XG5pbXBvcnQgeyBidWZmZXJUb0FycmF5QnVmZmVyLCBlbmNvZGVNZXNzYWdlLCBkZWNvZGVNZXNzYWdlIH0gZnJvbSAnLi4vdXRpbHMvc29ja2V0LXV0aWxzJztcblxuY29uc3QgV2ViU29ja2V0U2VydmVyID0gU2VydmVyO1xuLy8gQFRPRE86IGhhbmRsZSBgc3RhcnRgIGFuZCBgc3RvcGBcblxuY2xhc3MgU29ja2V0U291cmNlU2VydmVyIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBwb3J0OiAzMDMwXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIC8vIEBUT0RPIGhhbmRsZSBkaXNjb25uZWN0IGFuZCBzbyBvbi4uLlxuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuICAgIHRoaXMuc2VydmVyID0gbnVsbDtcbiAgICB0aGlzLmluaXRTZXJ2ZXIoKTtcblxuICAgIC8vIEBGSVhNRSAtIHJpZ2h0IHBsYWNlID9cbiAgICB0aGlzLnN0YXJ0KCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICBpbml0U2VydmVyKCkge1xuICAgIHRoaXMuc2VydmVyID0gbmV3IFdlYlNvY2tldFNlcnZlcih7IHBvcnQ6IHRoaXMucGFyYW1zLnBvcnQgfSk7XG5cbiAgICB0aGlzLnNlcnZlci5vbignY29ubmVjdGlvbicsIHNvY2tldCA9PiB7XG4gICAgICAvLyB0aGlzLmNsaWVudHMucHVzaChzb2NrZXQpO1xuICAgICAgc29ja2V0Lm9uKCdtZXNzYWdlJywgdGhpcy5wcm9jZXNzLmJpbmQodGhpcykpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvY2VzcyhidWZmZXIpIHtcbiAgICB2YXIgYXJyYXlCdWZmZXIgPSBidWZmZXJUb0FycmF5QnVmZmVyKGJ1ZmZlcik7XG4gICAgdmFyIG1lc3NhZ2UgPSBkZWNvZGVNZXNzYWdlKGFycmF5QnVmZmVyKTtcblxuICAgIHRoaXMudGltZSA9IG1lc3NhZ2UudGltZTtcbiAgICB0aGlzLm91dEZyYW1lID0gbWVzc2FnZS5mcmFtZTtcbiAgICB0aGlzLm1ldGFEYXRhID0gbWVzc2FnZS5tZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cblxuY2xhc3MgU29ja2V0U291cmNlQ2xpZW50IGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBwb3J0OiAzMDMxLFxuICAgICAgYWRkcmVzczogd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIHRoaXMuc29ja2V0ID0gbnVsbDtcbiAgICB0aGlzLmluaXRDb25uZWN0aW9uKCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICBjb25maWd1cmVTdHJlYW0oKSB7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHRoaXMucGFyYW1zLmZyYW1lUmF0ZTtcbiAgICAvLyBATk9URSBkb2VzIGl0IG1ha2Ugc2VucyA/XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuYmxvY2tTYW1wbGVSYXRlID0gdGhpcy5wYXJhbXMuZnJhbWVSYXRlICogdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICB9XG5cbiAgaW5pdENvbm5lY3Rpb24oKSB7XG4gICAgdmFyIHNvY2tldEFkZHIgPSAnd3M6Ly8nICsgdGhpcy5wYXJhbXMuYWRkcmVzcyArICc6JyArIHRoaXMucGFyYW1zLnBvcnQ7XG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KHNvY2tldEFkZHIpO1xuICAgIHRoaXMuc29ja2V0LmJpbmFyeVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG4gICAgLy8gY2FsbGJhY2sgdG8gc3RhcnQgdG8gd2hlbiBXZWJTb2NrZXQgaXMgY29ubmVjdGVkXG4gICAgdGhpcy5zb2NrZXQub25vcGVuID0gKCkgPT4ge1xuICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH07XG5cbiAgICB0aGlzLnNvY2tldC5vbmNsb3NlID0gKCkgPT4ge1xuXG4gICAgfTtcblxuICAgIHRoaXMuc29ja2V0Lm9ubWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XG4gICAgICB0aGlzLnByb2Nlc3MobWVzc2FnZS5kYXRhKTtcbiAgICB9O1xuXG4gICAgdGhpcy5zb2NrZXQub25lcnJvciA9ICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfTtcbiAgfVxuXG4gIHByb2Nlc3MoYnVmZmVyKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSBkZWNvZGVNZXNzYWdlKGJ1ZmZlcik7XG5cbiAgICB0aGlzLnRpbWUgPSBtZXNzYWdlLnRpbWU7XG4gICAgdGhpcy5vdXRGcmFtZSA9IG1lc3NhZ2UuZnJhbWU7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1lc3NhZ2UubWV0YURhdGE7XG5cbiAgICB0aGlzLm91dHB1dCgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgU29ja2V0U291cmNlU2VydmVyOiBTb2NrZXRTb3VyY2VTZXJ2ZXIsXG4gIFNvY2tldFNvdXJjZUNsaWVudDogU29ja2V0U291cmNlQ2xpZW50XG59OyJdfQ==