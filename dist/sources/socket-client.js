'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _baseLfo = require('../core/base-lfo');

var _baseLfo2 = _interopRequireDefault(_baseLfo);

var _socketUtils = require('../utils/socket-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @TODO: handle `start` and `stop`

var SocketClient = function (_BaseLfo) {
  (0, _inherits3.default)(SocketClient, _BaseLfo);

  function SocketClient(options) {
    (0, _classCallCheck3.default)(this, SocketClient);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SocketClient).call(this, {
      port: 3031,
      address: window.location.hostname
    }, options));

    _this.socket = null;
    _this.initConnection();
    return _this;
  }

  (0, _createClass3.default)(SocketClient, [{
    key: 'start',
    value: function start() {
      this.initialize();
      this.reset();
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(SocketClient.prototype), 'initialize', this).call(this, undefined, {
        frameSize: this.params.frameSize,
        frameRate: this.params.frameRate
      });
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

      this.socket.onerror = function (err) {
        console.error(err);
      };
    }
  }, {
    key: 'process',
    value: function process(buffer) {
      var message = (0, _socketUtils.decodeMessage)(buffer);

      this.time = message.time;
      this.outFrame = message.frame;
      this.metaData = message.metaData;

      this.output();
    }
  }]);
  return SocketClient;
}(_baseLfo2.default);

exports.default = SocketClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldC1jbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0lBSXFCOzs7QUFDbkIsV0FEbUIsWUFDbkIsQ0FBWSxPQUFaLEVBQXFCO3dDQURGLGNBQ0U7OzZGQURGLHlCQUVYO0FBQ0osWUFBTSxJQUFOO0FBQ0EsZUFBUyxPQUFPLFFBQVAsQ0FBZ0IsUUFBaEI7T0FDUixVQUpnQjs7QUFNbkIsVUFBSyxNQUFMLEdBQWMsSUFBZCxDQU5tQjtBQU9uQixVQUFLLGNBQUwsR0FQbUI7O0dBQXJCOzs2QkFEbUI7OzRCQVdYO0FBQ04sV0FBSyxVQUFMLEdBRE07QUFFTixXQUFLLEtBQUwsR0FGTTs7OztpQ0FLSztBQUNYLHVEQWpCaUIsd0RBaUJBLFdBQVc7QUFDMUIsbUJBQVcsS0FBSyxNQUFMLENBQVksU0FBWjtBQUNYLG1CQUFXLEtBQUssTUFBTCxDQUFZLFNBQVo7UUFGYixDQURXOzs7O3FDQU9JOzs7QUFDZixVQUFJLGFBQWEsVUFBVSxLQUFLLE1BQUwsQ0FBWSxPQUFaLEdBQXNCLEdBQWhDLEdBQXNDLEtBQUssTUFBTCxDQUFZLElBQVosQ0FEeEM7QUFFZixXQUFLLE1BQUwsR0FBYyxJQUFJLFNBQUosQ0FBYyxVQUFkLENBQWQsQ0FGZTtBQUdmLFdBQUssTUFBTCxDQUFZLFVBQVosR0FBeUIsYUFBekI7OztBQUhlLFVBTWYsQ0FBSyxNQUFMLENBQVksTUFBWixHQUFxQixZQUFNO0FBQ3pCLGVBQUssS0FBTCxHQUR5QjtPQUFOLENBTk47O0FBVWYsV0FBSyxNQUFMLENBQVksT0FBWixHQUFzQixZQUFNLEVBQU4sQ0FWUDs7QUFjZixXQUFLLE1BQUwsQ0FBWSxTQUFaLEdBQXdCLFVBQUMsT0FBRCxFQUFhO0FBQ25DLGVBQUssT0FBTCxDQUFhLFFBQVEsSUFBUixDQUFiLENBRG1DO09BQWIsQ0FkVDs7QUFrQmYsV0FBSyxNQUFMLENBQVksT0FBWixHQUFzQixVQUFDLEdBQUQsRUFBUztBQUM3QixnQkFBUSxLQUFSLENBQWMsR0FBZCxFQUQ2QjtPQUFULENBbEJQOzs7OzRCQXVCVCxRQUFRO0FBQ2QsVUFBSSxVQUFVLGdDQUFjLE1BQWQsQ0FBVixDQURVOztBQUdkLFdBQUssSUFBTCxHQUFZLFFBQVEsSUFBUixDQUhFO0FBSWQsV0FBSyxRQUFMLEdBQWdCLFFBQVEsS0FBUixDQUpGO0FBS2QsV0FBSyxRQUFMLEdBQWdCLFFBQVEsUUFBUixDQUxGOztBQU9kLFdBQUssTUFBTCxHQVBjOzs7U0E5Q0ciLCJmaWxlIjoic29ja2V0LWNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuaW1wb3J0IHsgZGVjb2RlTWVzc2FnZSB9IGZyb20gJy4uL3V0aWxzL3NvY2tldC11dGlscyc7XG5cblxuLy8gQFRPRE86IGhhbmRsZSBgc3RhcnRgIGFuZCBgc3RvcGBcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvY2tldENsaWVudCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoe1xuICAgICAgcG9ydDogMzAzMSxcbiAgICAgIGFkZHJlc3M6IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZVxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5zb2NrZXQgPSBudWxsO1xuICAgIHRoaXMuaW5pdENvbm5lY3Rpb24oKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSh1bmRlZmluZWQsIHtcbiAgICAgIGZyYW1lU2l6ZTogdGhpcy5wYXJhbXMuZnJhbWVTaXplLFxuICAgICAgZnJhbWVSYXRlOiB0aGlzLnBhcmFtcy5mcmFtZVJhdGUsXG4gICAgfSk7XG4gIH1cblxuICBpbml0Q29ubmVjdGlvbigpIHtcbiAgICB2YXIgc29ja2V0QWRkciA9ICd3czovLycgKyB0aGlzLnBhcmFtcy5hZGRyZXNzICsgJzonICsgdGhpcy5wYXJhbXMucG9ydDtcbiAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQoc29ja2V0QWRkcik7XG4gICAgdGhpcy5zb2NrZXQuYmluYXJ5VHlwZSA9ICdhcnJheWJ1ZmZlcic7XG5cbiAgICAvLyBjYWxsYmFjayB0byBzdGFydCB0byB3aGVuIFdlYlNvY2tldCBpcyBjb25uZWN0ZWRcbiAgICB0aGlzLnNvY2tldC5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfTtcblxuICAgIHRoaXMuc29ja2V0Lm9uY2xvc2UgPSAoKSA9PiB7XG5cbiAgICB9O1xuXG4gICAgdGhpcy5zb2NrZXQub25tZXNzYWdlID0gKG1lc3NhZ2UpID0+IHtcbiAgICAgIHRoaXMucHJvY2VzcyhtZXNzYWdlLmRhdGEpO1xuICAgIH07XG5cbiAgICB0aGlzLnNvY2tldC5vbmVycm9yID0gKGVycikgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIH07XG4gIH1cblxuICBwcm9jZXNzKGJ1ZmZlcikge1xuICAgIHZhciBtZXNzYWdlID0gZGVjb2RlTWVzc2FnZShidWZmZXIpO1xuXG4gICAgdGhpcy50aW1lID0gbWVzc2FnZS50aW1lO1xuICAgIHRoaXMub3V0RnJhbWUgPSBtZXNzYWdlLmZyYW1lO1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXNzYWdlLm1ldGFEYXRhO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufVxuIl19