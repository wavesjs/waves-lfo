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

var SocketServer = function (_BaseLfo) {
  (0, _inherits3.default)(SocketServer, _BaseLfo);

  function SocketServer(options) {
    (0, _classCallCheck3.default)(this, SocketServer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SocketServer).call(this, {
      port: 3031
    }, options));

    _this.server = null;
    _this.initServer();
    return _this;
  }

  (0, _createClass3.default)(SocketServer, [{
    key: 'initServer',
    value: function initServer() {
      this.server = new ws.Server({ port: this.params.port });
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var arrayBuffer = (0, _socketUtils.encodeMessage)(time, frame, metaData);
      var buffer = (0, _socketUtils.arrayBufferToBuffer)(arrayBuffer);

      this.server.clients.forEach(function (client) {
        client.send(buffer);
      });
    }
  }]);
  return SocketServer;
}(_baseLfo2.default);

exports.default = SocketServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldC1zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztJQUFZOztBQUNaOzs7Ozs7SUFHcUI7OztBQUNuQixXQURtQixZQUNuQixDQUFZLE9BQVosRUFBcUI7d0NBREYsY0FDRTs7NkZBREYseUJBRVg7QUFDSixZQUFNLElBQU47T0FDQyxVQUhnQjs7QUFLbkIsVUFBSyxNQUFMLEdBQWMsSUFBZCxDQUxtQjtBQU1uQixVQUFLLFVBQUwsR0FObUI7O0dBQXJCOzs2QkFEbUI7O2lDQVVOO0FBQ1gsV0FBSyxNQUFMLEdBQWMsSUFBSSxHQUFHLE1BQUgsQ0FBVSxFQUFFLE1BQU0sS0FBSyxNQUFMLENBQVksSUFBWixFQUF0QixDQUFkLENBRFc7Ozs7NEJBSUwsTUFBTSxPQUFPLFVBQVU7QUFDN0IsVUFBSSxjQUFjLGdDQUFjLElBQWQsRUFBb0IsS0FBcEIsRUFBMkIsUUFBM0IsQ0FBZCxDQUR5QjtBQUU3QixVQUFJLFNBQVMsc0NBQW9CLFdBQXBCLENBQVQsQ0FGeUI7O0FBSTdCLFdBQUssTUFBTCxDQUFZLE9BQVosQ0FBb0IsT0FBcEIsQ0FBNEIsVUFBUyxNQUFULEVBQWlCO0FBQzNDLGVBQU8sSUFBUCxDQUFZLE1BQVosRUFEMkM7T0FBakIsQ0FBNUIsQ0FKNkI7OztTQWRaIiwiZmlsZSI6InNvY2tldC1zZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcbmltcG9ydCAqIGFzIHdzIGZyb20gJ3dzJztcbmltcG9ydCB7IGVuY29kZU1lc3NhZ2UsIGFycmF5QnVmZmVyVG9CdWZmZXIgfSBmcm9tICcuLi91dGlscy9zb2NrZXQtdXRpbHMnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvY2tldFNlcnZlciBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoe1xuICAgICAgcG9ydDogMzAzMVxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5zZXJ2ZXIgPSBudWxsO1xuICAgIHRoaXMuaW5pdFNlcnZlcigpO1xuICB9XG5cbiAgaW5pdFNlcnZlcigpIHtcbiAgICB0aGlzLnNlcnZlciA9IG5ldyB3cy5TZXJ2ZXIoeyBwb3J0OiB0aGlzLnBhcmFtcy5wb3J0IH0pO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICB2YXIgYXJyYXlCdWZmZXIgPSBlbmNvZGVNZXNzYWdlKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSk7XG4gICAgdmFyIGJ1ZmZlciA9IGFycmF5QnVmZmVyVG9CdWZmZXIoYXJyYXlCdWZmZXIpO1xuXG4gICAgdGhpcy5zZXJ2ZXIuY2xpZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGNsaWVudCkge1xuICAgICAgY2xpZW50LnNlbmQoYnVmZmVyKTtcbiAgICB9KTtcbiAgfVxufVxuIl19