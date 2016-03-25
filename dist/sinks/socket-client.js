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

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _baseLfo = require('../core/base-lfo');

var _baseLfo2 = _interopRequireDefault(_baseLfo);

var _socketUtils = require('../utils/socket-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// send an Lfo stream from the browser over the network
// through a WebSocket - should be paired with a SocketSourceServer
// @NOTE: does it need to implement some ping process to maintain connection ?

var SocketClient = function (_BaseLfo) {
  (0, _inherits3.default)(SocketClient, _BaseLfo);

  function SocketClient(options) {
    (0, _classCallCheck3.default)(this, SocketClient);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SocketClient).call(this, {
      port: 3030,
      address: window.location.hostname
    }, options));

    _this.socket = null;
    _this.initConnection();
    return _this;
  }

  (0, _createClass3.default)(SocketClient, [{
    key: 'initConnection',
    value: function initConnection() {
      var _this2 = this;

      var socketAddr = 'ws://' + this.params.address + ':' + this.params.port;
      this.socket = new WebSocket(socketAddr);
      this.socket.binaryType = 'arraybuffer';

      // callback to start to when WebSocket is connected
      this.socket.onopen = function () {
        _this2.params.onopen();
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
      var buffer = (0, _socketUtils.encodeMessage)(time, frame, metaData);
      this.socket.send(buffer);
    }
  }]);
  return SocketClient;
}(_baseLfo2.default);

exports.default = SocketClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldC1jbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7OztJQUtxQjs7O0FBQ25CLFdBRG1CLFlBQ25CLENBQVksT0FBWixFQUFxQjt3Q0FERixjQUNFOzs2RkFERix5QkFFWDtBQUNKLFlBQU0sSUFBTjtBQUNBLGVBQVMsT0FBTyxRQUFQLENBQWdCLFFBQWhCO09BQ1IsVUFKZ0I7O0FBTW5CLFVBQUssTUFBTCxHQUFjLElBQWQsQ0FObUI7QUFPbkIsVUFBSyxjQUFMLEdBUG1COztHQUFyQjs7NkJBRG1COztxQ0FXRjs7O0FBQ2YsVUFBSSxhQUFhLFVBQVUsS0FBSyxNQUFMLENBQVksT0FBWixHQUFzQixHQUFoQyxHQUFzQyxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBRHhDO0FBRWYsV0FBSyxNQUFMLEdBQWMsSUFBSSxTQUFKLENBQWMsVUFBZCxDQUFkLENBRmU7QUFHZixXQUFLLE1BQUwsQ0FBWSxVQUFaLEdBQXlCLGFBQXpCOzs7QUFIZSxVQU1mLENBQUssTUFBTCxDQUFZLE1BQVosR0FBcUIsWUFBTTtBQUN6QixlQUFLLE1BQUwsQ0FBWSxNQUFaLEdBRHlCO09BQU4sQ0FOTjs7QUFVZixXQUFLLE1BQUwsQ0FBWSxPQUFaLEdBQXNCLFlBQU0sRUFBTixDQVZQOztBQWNmLFdBQUssTUFBTCxDQUFZLFNBQVosR0FBd0IsWUFBTSxFQUFOLENBZFQ7O0FBa0JmLFdBQUssTUFBTCxDQUFZLE9BQVosR0FBc0IsVUFBQyxHQUFELEVBQVM7QUFDN0IsZ0JBQVEsS0FBUixDQUFjLEdBQWQsRUFENkI7T0FBVCxDQWxCUDs7Ozs0QkF1QlQsTUFBTSxPQUFPLFVBQVU7QUFDN0IsVUFBSSxTQUFTLGdDQUFjLElBQWQsRUFBb0IsS0FBcEIsRUFBMkIsUUFBM0IsQ0FBVCxDQUR5QjtBQUU3QixXQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLE1BQWpCLEVBRjZCOzs7U0FsQ1oiLCJmaWxlIjoic29ja2V0LWNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuaW1wb3J0IHsgZW5jb2RlTWVzc2FnZSB9IGZyb20gJy4uL3V0aWxzL3NvY2tldC11dGlscyc7XG5cbi8vIHNlbmQgYW4gTGZvIHN0cmVhbSBmcm9tIHRoZSBicm93c2VyIG92ZXIgdGhlIG5ldHdvcmtcbi8vIHRocm91Z2ggYSBXZWJTb2NrZXQgLSBzaG91bGQgYmUgcGFpcmVkIHdpdGggYSBTb2NrZXRTb3VyY2VTZXJ2ZXJcbi8vIEBOT1RFOiBkb2VzIGl0IG5lZWQgdG8gaW1wbGVtZW50IHNvbWUgcGluZyBwcm9jZXNzIHRvIG1haW50YWluIGNvbm5lY3Rpb24gP1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29ja2V0Q2xpZW50IGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICBwb3J0OiAzMDMwLFxuICAgICAgYWRkcmVzczogd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnNvY2tldCA9IG51bGw7XG4gICAgdGhpcy5pbml0Q29ubmVjdGlvbigpO1xuICB9XG5cbiAgaW5pdENvbm5lY3Rpb24oKSB7XG4gICAgdmFyIHNvY2tldEFkZHIgPSAnd3M6Ly8nICsgdGhpcy5wYXJhbXMuYWRkcmVzcyArICc6JyArIHRoaXMucGFyYW1zLnBvcnQ7XG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KHNvY2tldEFkZHIpO1xuICAgIHRoaXMuc29ja2V0LmJpbmFyeVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG4gICAgLy8gY2FsbGJhY2sgdG8gc3RhcnQgdG8gd2hlbiBXZWJTb2NrZXQgaXMgY29ubmVjdGVkXG4gICAgdGhpcy5zb2NrZXQub25vcGVuID0gKCkgPT4ge1xuICAgICAgdGhpcy5wYXJhbXMub25vcGVuKCk7XG4gICAgfTtcblxuICAgIHRoaXMuc29ja2V0Lm9uY2xvc2UgPSAoKSA9PiB7XG5cbiAgICB9O1xuXG4gICAgdGhpcy5zb2NrZXQub25tZXNzYWdlID0gKCkgPT4ge1xuXG4gICAgfTtcblxuICAgIHRoaXMuc29ja2V0Lm9uZXJyb3IgPSAoZXJyKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgfTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgdmFyIGJ1ZmZlciA9IGVuY29kZU1lc3NhZ2UodGltZSwgZnJhbWUsIG1ldGFEYXRhKTtcbiAgICB0aGlzLnNvY2tldC5zZW5kKGJ1ZmZlcik7XG4gIH1cbn1cbiJdfQ==