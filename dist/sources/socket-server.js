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

// @TODO: handle `start` and `stop`

var SocketServer = (function (_BaseLfo) {
  _inherits(SocketServer, _BaseLfo);

  function SocketServer(options) {
    _classCallCheck(this, SocketServer);

    var defaults = {
      port: 3030
    };

    _get(Object.getPrototypeOf(SocketServer.prototype), 'constructor', this).call(this, options, defaults);

    // @TODO handle disconnect and so on...
    this.clients = [];
    this.server = null;
    this.initServer();

    // @FIXME - right place ?
    this.start();
  }

  _createClass(SocketServer, [{
    key: 'start',
    value: function start() {
      this.initialize();
      this.reset();
    }
  }, {
    key: 'initServer',
    value: function initServer() {
      var _this = this;

      this.server = new ws.Server({ port: this.params.port });

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

  return SocketServer;
})(_coreBaseLfo2['default']);

exports['default'] = SocketServer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3NvY2tldC1zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OzJCQUFvQixrQkFBa0I7Ozs7a0JBQ2xCLElBQUk7O0lBQVosRUFBRTs7Z0NBQ3FDLHVCQUF1Qjs7OztJQUlyRCxZQUFZO1lBQVosWUFBWTs7QUFDcEIsV0FEUSxZQUFZLENBQ25CLE9BQU8sRUFBRTswQkFERixZQUFZOztBQUU3QixRQUFJLFFBQVEsR0FBRztBQUNiLFVBQUksRUFBRSxJQUFJO0tBQ1gsQ0FBQzs7QUFFRiwrQkFOaUIsWUFBWSw2Q0FNdkIsT0FBTyxFQUFFLFFBQVEsRUFBRTs7O0FBR3pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLFFBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzs7O0FBR2xCLFFBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztHQUNkOztlQWZrQixZQUFZOztXQWlCMUIsaUJBQUc7QUFDTixVQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ2Q7OztXQUVTLHNCQUFHOzs7QUFDWCxVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7O0FBRXhELFVBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFBLE1BQU0sRUFBSTs7QUFFckMsY0FBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsTUFBSyxPQUFPLENBQUMsSUFBSSxPQUFNLENBQUMsQ0FBQztPQUMvQyxDQUFDLENBQUM7S0FDSjs7O1dBRU0saUJBQUMsTUFBTSxFQUFFO0FBQ2QsVUFBSSxXQUFXLEdBQUcsc0JBcENiLG1CQUFtQixFQW9DYyxNQUFNLENBQUMsQ0FBQztBQUM5QyxVQUFJLE9BQU8sR0FBRyxzQkFyQ1ksYUFBYSxFQXFDWCxXQUFXLENBQUMsQ0FBQzs7QUFFekMsVUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ3pCLFVBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztBQUM5QixVQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7O0FBRWpDLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7U0F4Q2tCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6ImVzNi9zb3VyY2VzL3NvY2tldC1zZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcbmltcG9ydCAqIGFzIHdzIGZyb20gJ3dzJztcbmltcG9ydCB7IGJ1ZmZlclRvQXJyYXlCdWZmZXIsIGRlY29kZU1lc3NhZ2UgfSBmcm9tICcuLi91dGlscy9zb2NrZXQtdXRpbHMnO1xuXG5cbi8vIEBUT0RPOiBoYW5kbGUgYHN0YXJ0YCBhbmQgYHN0b3BgXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb2NrZXRTZXJ2ZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIHBvcnQ6IDMwMzBcbiAgICB9O1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgLy8gQFRPRE8gaGFuZGxlIGRpc2Nvbm5lY3QgYW5kIHNvIG9uLi4uXG4gICAgdGhpcy5jbGllbnRzID0gW107XG4gICAgdGhpcy5zZXJ2ZXIgPSBudWxsO1xuICAgIHRoaXMuaW5pdFNlcnZlcigpO1xuXG4gICAgLy8gQEZJWE1FIC0gcmlnaHQgcGxhY2UgP1xuICAgIHRoaXMuc3RhcnQoKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIGluaXRTZXJ2ZXIoKSB7XG4gICAgdGhpcy5zZXJ2ZXIgPSBuZXcgd3MuU2VydmVyKHsgcG9ydDogdGhpcy5wYXJhbXMucG9ydCB9KTtcblxuICAgIHRoaXMuc2VydmVyLm9uKCdjb25uZWN0aW9uJywgc29ja2V0ID0+IHtcbiAgICAgIC8vIHRoaXMuY2xpZW50cy5wdXNoKHNvY2tldCk7XG4gICAgICBzb2NrZXQub24oJ21lc3NhZ2UnLCB0aGlzLnByb2Nlc3MuYmluZCh0aGlzKSk7XG4gICAgfSk7XG4gIH1cblxuICBwcm9jZXNzKGJ1ZmZlcikge1xuICAgIHZhciBhcnJheUJ1ZmZlciA9IGJ1ZmZlclRvQXJyYXlCdWZmZXIoYnVmZmVyKTtcbiAgICB2YXIgbWVzc2FnZSA9IGRlY29kZU1lc3NhZ2UoYXJyYXlCdWZmZXIpO1xuXG4gICAgdGhpcy50aW1lID0gbWVzc2FnZS50aW1lO1xuICAgIHRoaXMub3V0RnJhbWUgPSBtZXNzYWdlLmZyYW1lO1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXNzYWdlLm1ldGFEYXRhO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufSJdfQ==