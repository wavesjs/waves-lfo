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

var _ws = require('ws');

var ws = _interopRequireWildcard(_ws);

var _socketUtils = require('../utils/socket-utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @TODO: handle `start` and `stop`

var SocketServer = function (_BaseLfo) {
  (0, _inherits3.default)(SocketServer, _BaseLfo);

  function SocketServer(options) {
    (0, _classCallCheck3.default)(this, SocketServer);


    // @TODO handle disconnect and so on...

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SocketServer).call(this, {
      port: 3030
    }, options));

    _this.clients = [];
    _this.server = null;
    _this.initServer();

    // @FIXME - right place ?
    _this.start();
    return _this;
  }

  (0, _createClass3.default)(SocketServer, [{
    key: 'start',
    value: function start() {
      this.initialize();
      this.reset();
    }
  }, {
    key: 'initServer',
    value: function initServer() {
      var _this2 = this;

      this.server = new ws.Server({ port: this.params.port });

      this.server.on('connection', function (socket) {
        // this.clients.push(socket);
        socket.on('message', _this2.process.bind(_this2));
      });
    }
  }, {
    key: 'process',
    value: function process(buffer) {
      var arrayBuffer = (0, _socketUtils.bufferToArrayBuffer)(buffer);
      var message = (0, _socketUtils.decodeMessage)(arrayBuffer);

      this.time = message.time;
      this.outFrame = message.frame;
      this.metaData = message.metaData;

      this.output();
    }
  }]);
  return SocketServer;
}(_baseLfo2.default);

exports.default = SocketServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldC1zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztJQUFZOztBQUNaOzs7Ozs7OztJQUlxQjs7O0FBQ25CLFdBRG1CLFlBQ25CLENBQVksT0FBWixFQUFxQjt3Q0FERixjQUNFOzs7Ozs2RkFERix5QkFFWDtBQUNKLFlBQU0sSUFBTjtPQUNDLFVBSGdCOztBQU1uQixVQUFLLE9BQUwsR0FBZSxFQUFmLENBTm1CO0FBT25CLFVBQUssTUFBTCxHQUFjLElBQWQsQ0FQbUI7QUFRbkIsVUFBSyxVQUFMOzs7QUFSbUIsU0FXbkIsQ0FBSyxLQUFMLEdBWG1COztHQUFyQjs7NkJBRG1COzs0QkFlWDtBQUNOLFdBQUssVUFBTCxHQURNO0FBRU4sV0FBSyxLQUFMLEdBRk07Ozs7aUNBS0s7OztBQUNYLFdBQUssTUFBTCxHQUFjLElBQUksR0FBRyxNQUFILENBQVUsRUFBRSxNQUFNLEtBQUssTUFBTCxDQUFZLElBQVosRUFBdEIsQ0FBZCxDQURXOztBQUdYLFdBQUssTUFBTCxDQUFZLEVBQVosQ0FBZSxZQUFmLEVBQTZCLGtCQUFVOztBQUVyQyxlQUFPLEVBQVAsQ0FBVSxTQUFWLEVBQXFCLE9BQUssT0FBTCxDQUFhLElBQWIsUUFBckIsRUFGcUM7T0FBVixDQUE3QixDQUhXOzs7OzRCQVNMLFFBQVE7QUFDZCxVQUFJLGNBQWMsc0NBQW9CLE1BQXBCLENBQWQsQ0FEVTtBQUVkLFVBQUksVUFBVSxnQ0FBYyxXQUFkLENBQVYsQ0FGVTs7QUFJZCxXQUFLLElBQUwsR0FBWSxRQUFRLElBQVIsQ0FKRTtBQUtkLFdBQUssUUFBTCxHQUFnQixRQUFRLEtBQVIsQ0FMRjtBQU1kLFdBQUssUUFBTCxHQUFnQixRQUFRLFFBQVIsQ0FORjs7QUFRZCxXQUFLLE1BQUwsR0FSYzs7O1NBN0JHIiwiZmlsZSI6InNvY2tldC1zZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcbmltcG9ydCAqIGFzIHdzIGZyb20gJ3dzJztcbmltcG9ydCB7IGJ1ZmZlclRvQXJyYXlCdWZmZXIsIGRlY29kZU1lc3NhZ2UgfSBmcm9tICcuLi91dGlscy9zb2NrZXQtdXRpbHMnO1xuXG5cbi8vIEBUT0RPOiBoYW5kbGUgYHN0YXJ0YCBhbmQgYHN0b3BgXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb2NrZXRTZXJ2ZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIHBvcnQ6IDMwMzBcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIC8vIEBUT0RPIGhhbmRsZSBkaXNjb25uZWN0IGFuZCBzbyBvbi4uLlxuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuICAgIHRoaXMuc2VydmVyID0gbnVsbDtcbiAgICB0aGlzLmluaXRTZXJ2ZXIoKTtcblxuICAgIC8vIEBGSVhNRSAtIHJpZ2h0IHBsYWNlID9cbiAgICB0aGlzLnN0YXJ0KCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICBpbml0U2VydmVyKCkge1xuICAgIHRoaXMuc2VydmVyID0gbmV3IHdzLlNlcnZlcih7IHBvcnQ6IHRoaXMucGFyYW1zLnBvcnQgfSk7XG5cbiAgICB0aGlzLnNlcnZlci5vbignY29ubmVjdGlvbicsIHNvY2tldCA9PiB7XG4gICAgICAvLyB0aGlzLmNsaWVudHMucHVzaChzb2NrZXQpO1xuICAgICAgc29ja2V0Lm9uKCdtZXNzYWdlJywgdGhpcy5wcm9jZXNzLmJpbmQodGhpcykpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvY2VzcyhidWZmZXIpIHtcbiAgICB2YXIgYXJyYXlCdWZmZXIgPSBidWZmZXJUb0FycmF5QnVmZmVyKGJ1ZmZlcik7XG4gICAgdmFyIG1lc3NhZ2UgPSBkZWNvZGVNZXNzYWdlKGFycmF5QnVmZmVyKTtcblxuICAgIHRoaXMudGltZSA9IG1lc3NhZ2UudGltZTtcbiAgICB0aGlzLm91dEZyYW1lID0gbWVzc2FnZS5mcmFtZTtcbiAgICB0aGlzLm1ldGFEYXRhID0gbWVzc2FnZS5tZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cbiJdfQ==