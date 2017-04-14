'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

var _wsUtils = require('../../common/utils/wsUtils');

var _wsServerFactory = require('../utils/wsServerFactory');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parameters = {
  port: {
    type: 'integer',
    default: 8000,
    constant: true,
    nullable: true
  },
  server: {
    type: 'any',
    default: null,
    constant: true,
    nullable: true
  }
};

/**
 * Send an lfo frame as a socket message to a `client.source.SocketReceive`
 * instance.
 *
 * <p class="warning">Experimental</p>
 *
 * @params {Object} options
 */

var SocketSend = function (_BaseLfo) {
  (0, _inherits3.default)(SocketSend, _BaseLfo);

  function SocketSend() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, SocketSend);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SocketSend.__proto__ || (0, _getPrototypeOf2.default)(SocketSend)).call(this, parameters, options));

    _this.wss = (0, _wsServerFactory.wsServerFactory)({
      port: _this.params.get('port'),
      server: _this.params.get('server')
    });

    // this.wss.onconnection = (socket) => {
    //   if (this.initialized) {
    //     // socket.send(initModule)
    //     // then
    //     // socket.procesStreamParams
    //     // socket.
    //   }
    // }
    return _this;
  }

  (0, _createClass3.default)(SocketSend, [{
    key: '_broadcast',
    value: function _broadcast(buffer) {
      this.wss.clients.forEach(function (client) {
        if (client.readyState === _wsServerFactory.WebSocket.OPEN) client.send(buffer);
      });
    }
  }, {
    key: 'initModule',
    value: function initModule() {
      // send a INIT_MODULE_REQ to each client and wait for INIT_MODULE_ACK
      // no need to get children promises as we are in a leef
      var promises = [];

      this.wss.clients.forEach(function (client) {
        var promise = new _promise2.default(function (resolve, reject) {
          client.onmessage = function (e) {
            var opcode = _wsUtils.decoders.opcode(e.data);

            if (opcode === _wsUtils.opcodes.INIT_MODULE_ACK) resolve();
          };
        });

        promises.push(promise);
      });

      var buffer = _wsUtils.encoders.initModuleReq();
      this._broadcast(buffer);

      return _promise2.default.all(promises);
    }
  }, {
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      (0, _get3.default)(SocketSend.prototype.__proto__ || (0, _getPrototypeOf2.default)(SocketSend.prototype), 'processStreamParams', this).call(this, prevStreamParams);

      var buffer = _wsUtils.encoders.streamParams(this.streamParams);
      this._broadcast(buffer);
    }
  }, {
    key: 'resetStream',
    value: function resetStream() {
      (0, _get3.default)(SocketSend.prototype.__proto__ || (0, _getPrototypeOf2.default)(SocketSend.prototype), 'resetStream', this).call(this);

      var buffer = _wsUtils.encoders.resetStream();
      this._broadcast(buffer);
    }

    /** @private */

  }, {
    key: 'finalizeStream',
    value: function finalizeStream(endTime) {
      (0, _get3.default)(SocketSend.prototype.__proto__ || (0, _getPrototypeOf2.default)(SocketSend.prototype), 'finalizeStream', this).call(this, endTime);

      var buffer = _wsUtils.encoders.finalizeStream(endTime);
      this._broadcast(buffer);
    }

    // process any type
    /** @private */

  }, {
    key: 'processScalar',
    value: function processScalar() {}
    /** @private */

  }, {
    key: 'processVector',
    value: function processVector() {}
    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal() {}
  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      var frameSize = this.streamParams.frameSize;
      this.frame.time = frame.time;
      this.frame.data.set(frame.data, 0);
      this.frame.metadata = frame.metadata;

      var buffer = _wsUtils.encoders.processFrame(this.frame, frameSize);
      this._broadcast(buffer);
    }
  }]);
  return SocketSend;
}(_BaseLfo3.default);

exports.default = SocketSend;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvY2tldFNlbmQuanMiXSwibmFtZXMiOlsicGFyYW1ldGVycyIsInBvcnQiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwibnVsbGFibGUiLCJzZXJ2ZXIiLCJTb2NrZXRTZW5kIiwib3B0aW9ucyIsIndzcyIsInBhcmFtcyIsImdldCIsImJ1ZmZlciIsImNsaWVudHMiLCJmb3JFYWNoIiwiY2xpZW50IiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJzZW5kIiwicHJvbWlzZXMiLCJwcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIm9ubWVzc2FnZSIsImUiLCJvcGNvZGUiLCJkYXRhIiwiSU5JVF9NT0RVTEVfQUNLIiwicHVzaCIsImluaXRNb2R1bGVSZXEiLCJfYnJvYWRjYXN0IiwiYWxsIiwicHJldlN0cmVhbVBhcmFtcyIsInN0cmVhbVBhcmFtcyIsInJlc2V0U3RyZWFtIiwiZW5kVGltZSIsImZpbmFsaXplU3RyZWFtIiwiZnJhbWUiLCJmcmFtZVNpemUiLCJ0aW1lIiwic2V0IiwibWV0YWRhdGEiLCJwcm9jZXNzRnJhbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBR0EsSUFBTUEsYUFBYTtBQUNqQkMsUUFBTTtBQUNKQyxVQUFNLFNBREY7QUFFSkMsYUFBUyxJQUZMO0FBR0pDLGNBQVUsSUFITjtBQUlKQyxjQUFVO0FBSk4sR0FEVztBQU9qQkMsVUFBUTtBQUNOSixVQUFNLEtBREE7QUFFTkMsYUFBUyxJQUZIO0FBR05DLGNBQVUsSUFISjtBQUlOQyxjQUFVO0FBSko7QUFQUyxDQUFuQjs7QUFlQTs7Ozs7Ozs7O0lBUU1FLFU7OztBQUNKLHdCQUEwQjtBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTtBQUFBOztBQUFBLDhJQUNsQlIsVUFEa0IsRUFDTlEsT0FETTs7QUFHeEIsVUFBS0MsR0FBTCxHQUFXLHNDQUFnQjtBQUN6QlIsWUFBTSxNQUFLUyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsTUFBaEIsQ0FEbUI7QUFFekJMLGNBQVEsTUFBS0ksTUFBTCxDQUFZQyxHQUFaLENBQWdCLFFBQWhCO0FBRmlCLEtBQWhCLENBQVg7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWZ3QjtBQWdCekI7Ozs7K0JBRVVDLE0sRUFBUTtBQUNqQixXQUFLSCxHQUFMLENBQVNJLE9BQVQsQ0FBaUJDLE9BQWpCLENBQXlCLFVBQUNDLE1BQUQsRUFBWTtBQUNuQyxZQUFJQSxPQUFPQyxVQUFQLEtBQXNCLDJCQUFVQyxJQUFwQyxFQUNFRixPQUFPRyxJQUFQLENBQVlOLE1BQVo7QUFDSCxPQUhEO0FBSUQ7OztpQ0FFWTtBQUNYO0FBQ0E7QUFDQSxVQUFNTyxXQUFXLEVBQWpCOztBQUVBLFdBQUtWLEdBQUwsQ0FBU0ksT0FBVCxDQUFpQkMsT0FBakIsQ0FBeUIsVUFBQ0MsTUFBRCxFQUFZO0FBQ25DLFlBQU1LLFVBQVUsc0JBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQy9DUCxpQkFBT1EsU0FBUCxHQUFtQixVQUFDQyxDQUFELEVBQU87QUFDeEIsZ0JBQU1DLFNBQVMsa0JBQVNBLE1BQVQsQ0FBZ0JELEVBQUVFLElBQWxCLENBQWY7O0FBRUEsZ0JBQUlELFdBQVcsaUJBQVFFLGVBQXZCLEVBQ0VOO0FBQ0gsV0FMRDtBQU1ELFNBUGUsQ0FBaEI7O0FBU0FGLGlCQUFTUyxJQUFULENBQWNSLE9BQWQ7QUFDRCxPQVhEOztBQWFBLFVBQU1SLFNBQVMsa0JBQVNpQixhQUFULEVBQWY7QUFDQSxXQUFLQyxVQUFMLENBQWdCbEIsTUFBaEI7O0FBRUEsYUFBTyxrQkFBUW1CLEdBQVIsQ0FBWVosUUFBWixDQUFQO0FBQ0Q7Ozt3Q0FFbUJhLGdCLEVBQWtCO0FBQ3BDLHdKQUEwQkEsZ0JBQTFCOztBQUVBLFVBQU1wQixTQUFTLGtCQUFTcUIsWUFBVCxDQUFzQixLQUFLQSxZQUEzQixDQUFmO0FBQ0EsV0FBS0gsVUFBTCxDQUFnQmxCLE1BQWhCO0FBQ0Q7OztrQ0FFYTtBQUNaOztBQUVBLFVBQU1BLFNBQVMsa0JBQVNzQixXQUFULEVBQWY7QUFDQSxXQUFLSixVQUFMLENBQWdCbEIsTUFBaEI7QUFDRDs7QUFFQzs7OzttQ0FDYXVCLE8sRUFBUztBQUN0QixtSkFBcUJBLE9BQXJCOztBQUVBLFVBQU12QixTQUFTLGtCQUFTd0IsY0FBVCxDQUF3QkQsT0FBeEIsQ0FBZjtBQUNBLFdBQUtMLFVBQUwsQ0FBZ0JsQixNQUFoQjtBQUNEOztBQUVEO0FBQ0E7Ozs7b0NBQ2dCLENBQUU7QUFDbEI7Ozs7b0NBQ2dCLENBQUU7QUFDbEI7Ozs7b0NBQ2dCLENBQUU7OztpQ0FFTHlCLEssRUFBTztBQUNsQixVQUFNQyxZQUFZLEtBQUtMLFlBQUwsQ0FBa0JLLFNBQXBDO0FBQ0EsV0FBS0QsS0FBTCxDQUFXRSxJQUFYLEdBQWtCRixNQUFNRSxJQUF4QjtBQUNBLFdBQUtGLEtBQUwsQ0FBV1gsSUFBWCxDQUFnQmMsR0FBaEIsQ0FBb0JILE1BQU1YLElBQTFCLEVBQWdDLENBQWhDO0FBQ0EsV0FBS1csS0FBTCxDQUFXSSxRQUFYLEdBQXNCSixNQUFNSSxRQUE1Qjs7QUFFQSxVQUFNN0IsU0FBUyxrQkFBUzhCLFlBQVQsQ0FBc0IsS0FBS0wsS0FBM0IsRUFBa0NDLFNBQWxDLENBQWY7QUFDQSxXQUFLUixVQUFMLENBQWdCbEIsTUFBaEI7QUFDRDs7Ozs7a0JBR1lMLFUiLCJmaWxlIjoiU29ja2V0U2VuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5pbXBvcnQgeyBvcGNvZGVzLCBlbmNvZGVycywgZGVjb2RlcnMgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMvd3NVdGlscyc7XG5pbXBvcnQgeyBXZWJTb2NrZXQsIHdzU2VydmVyRmFjdG9yeSB9IGZyb20gJy4uL3V0aWxzL3dzU2VydmVyRmFjdG9yeSc7XG5cblxuY29uc3QgcGFyYW1ldGVycyA9IHtcbiAgcG9ydDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiA4MDAwLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICB9LFxufTtcblxuLyoqXG4gKiBTZW5kIGFuIGxmbyBmcmFtZSBhcyBhIHNvY2tldCBtZXNzYWdlIHRvIGEgYGNsaWVudC5zb3VyY2UuU29ja2V0UmVjZWl2ZWBcbiAqIGluc3RhbmNlLlxuICpcbiAqIDxwIGNsYXNzPVwid2FybmluZ1wiPkV4cGVyaW1lbnRhbDwvcD5cbiAqXG4gKiBAcGFyYW1zIHtPYmplY3R9IG9wdGlvbnNcbiAqL1xuY2xhc3MgU29ja2V0U2VuZCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihwYXJhbWV0ZXJzLCBvcHRpb25zKTtcblxuICAgIHRoaXMud3NzID0gd3NTZXJ2ZXJGYWN0b3J5KHtcbiAgICAgIHBvcnQ6IHRoaXMucGFyYW1zLmdldCgncG9ydCcpLFxuICAgICAgc2VydmVyOiB0aGlzLnBhcmFtcy5nZXQoJ3NlcnZlcicpLFxuICAgIH0pO1xuXG4gICAgLy8gdGhpcy53c3Mub25jb25uZWN0aW9uID0gKHNvY2tldCkgPT4ge1xuICAgIC8vICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAvLyAgICAgLy8gc29ja2V0LnNlbmQoaW5pdE1vZHVsZSlcbiAgICAvLyAgICAgLy8gdGhlblxuICAgIC8vICAgICAvLyBzb2NrZXQucHJvY2VzU3RyZWFtUGFyYW1zXG4gICAgLy8gICAgIC8vIHNvY2tldC5cbiAgICAvLyAgIH1cbiAgICAvLyB9XG4gIH1cblxuICBfYnJvYWRjYXN0KGJ1ZmZlcikge1xuICAgIHRoaXMud3NzLmNsaWVudHMuZm9yRWFjaCgoY2xpZW50KSA9PiB7XG4gICAgICBpZiAoY2xpZW50LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKVxuICAgICAgICBjbGllbnQuc2VuZChidWZmZXIpO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdE1vZHVsZSgpIHtcbiAgICAvLyBzZW5kIGEgSU5JVF9NT0RVTEVfUkVRIHRvIGVhY2ggY2xpZW50IGFuZCB3YWl0IGZvciBJTklUX01PRFVMRV9BQ0tcbiAgICAvLyBubyBuZWVkIHRvIGdldCBjaGlsZHJlbiBwcm9taXNlcyBhcyB3ZSBhcmUgaW4gYSBsZWVmXG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcblxuICAgIHRoaXMud3NzLmNsaWVudHMuZm9yRWFjaCgoY2xpZW50KSA9PiB7XG4gICAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjbGllbnQub25tZXNzYWdlID0gKGUpID0+IHtcbiAgICAgICAgICBjb25zdCBvcGNvZGUgPSBkZWNvZGVycy5vcGNvZGUoZS5kYXRhKTtcblxuICAgICAgICAgIGlmIChvcGNvZGUgPT09IG9wY29kZXMuSU5JVF9NT0RVTEVfQUNLKVxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcHJvbWlzZXMucHVzaChwcm9taXNlKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGJ1ZmZlciA9IGVuY29kZXJzLmluaXRNb2R1bGVSZXEoKTtcbiAgICB0aGlzLl9icm9hZGNhc3QoYnVmZmVyKTtcblxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gIH1cblxuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICBzdXBlci5wcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgY29uc3QgYnVmZmVyID0gZW5jb2RlcnMuc3RyZWFtUGFyYW1zKHRoaXMuc3RyZWFtUGFyYW1zKTtcbiAgICB0aGlzLl9icm9hZGNhc3QoYnVmZmVyKTtcbiAgfVxuXG4gIHJlc2V0U3RyZWFtKCkge1xuICAgIHN1cGVyLnJlc2V0U3RyZWFtKCk7XG5cbiAgICBjb25zdCBidWZmZXIgPSBlbmNvZGVycy5yZXNldFN0cmVhbSgpO1xuICAgIHRoaXMuX2Jyb2FkY2FzdChidWZmZXIpO1xuICB9XG5cbiAgICAvKiogQHByaXZhdGUgKi9cbiAgZmluYWxpemVTdHJlYW0oZW5kVGltZSkge1xuICAgIHN1cGVyLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuXG4gICAgY29uc3QgYnVmZmVyID0gZW5jb2RlcnMuZmluYWxpemVTdHJlYW0oZW5kVGltZSk7XG4gICAgdGhpcy5fYnJvYWRjYXN0KGJ1ZmZlcik7XG4gIH1cblxuICAvLyBwcm9jZXNzIGFueSB0eXBlXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2NhbGFyKCkge31cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoKSB7fVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbCgpIHt9XG5cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuZnJhbWUudGltZSA9IGZyYW1lLnRpbWU7XG4gICAgdGhpcy5mcmFtZS5kYXRhLnNldChmcmFtZS5kYXRhLCAwKTtcbiAgICB0aGlzLmZyYW1lLm1ldGFkYXRhID0gZnJhbWUubWV0YWRhdGE7XG5cbiAgICBjb25zdCBidWZmZXIgPSBlbmNvZGVycy5wcm9jZXNzRnJhbWUodGhpcy5mcmFtZSwgZnJhbWVTaXplKTtcbiAgICB0aGlzLl9icm9hZGNhc3QoYnVmZmVyKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTb2NrZXRTZW5kO1xuIl19