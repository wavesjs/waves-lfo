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
 * @experimental
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvY2tldFNlbmQuanMiXSwibmFtZXMiOlsicGFyYW1ldGVycyIsInBvcnQiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwibnVsbGFibGUiLCJzZXJ2ZXIiLCJTb2NrZXRTZW5kIiwib3B0aW9ucyIsIndzcyIsInBhcmFtcyIsImdldCIsImJ1ZmZlciIsImNsaWVudHMiLCJmb3JFYWNoIiwiY2xpZW50IiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJzZW5kIiwicHJvbWlzZXMiLCJwcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIm9ubWVzc2FnZSIsImUiLCJvcGNvZGUiLCJkYXRhIiwiSU5JVF9NT0RVTEVfQUNLIiwicHVzaCIsImluaXRNb2R1bGVSZXEiLCJfYnJvYWRjYXN0IiwiYWxsIiwicHJldlN0cmVhbVBhcmFtcyIsInN0cmVhbVBhcmFtcyIsInJlc2V0U3RyZWFtIiwiZW5kVGltZSIsImZpbmFsaXplU3RyZWFtIiwiZnJhbWUiLCJmcmFtZVNpemUiLCJ0aW1lIiwic2V0IiwibWV0YWRhdGEiLCJwcm9jZXNzRnJhbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBR0EsSUFBTUEsYUFBYTtBQUNqQkMsUUFBTTtBQUNKQyxVQUFNLFNBREY7QUFFSkMsYUFBUyxJQUZMO0FBR0pDLGNBQVUsSUFITjtBQUlKQyxjQUFVO0FBSk4sR0FEVztBQU9qQkMsVUFBUTtBQUNOSixVQUFNLEtBREE7QUFFTkMsYUFBUyxJQUZIO0FBR05DLGNBQVUsSUFISjtBQUlOQyxjQUFVO0FBSko7QUFQUyxDQUFuQjs7QUFlQTs7Ozs7Ozs7SUFPTUUsVTs7O0FBQ0osd0JBQTBCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQUEsOElBQ2xCUixVQURrQixFQUNOUSxPQURNOztBQUd4QixVQUFLQyxHQUFMLEdBQVcsc0NBQWdCO0FBQ3pCUixZQUFNLE1BQUtTLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixNQUFoQixDQURtQjtBQUV6QkwsY0FBUSxNQUFLSSxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsUUFBaEI7QUFGaUIsS0FBaEIsQ0FBWDs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZndCO0FBZ0J6Qjs7OzsrQkFFVUMsTSxFQUFRO0FBQ2pCLFdBQUtILEdBQUwsQ0FBU0ksT0FBVCxDQUFpQkMsT0FBakIsQ0FBeUIsVUFBQ0MsTUFBRCxFQUFZO0FBQ25DLFlBQUlBLE9BQU9DLFVBQVAsS0FBc0IsMkJBQVVDLElBQXBDLEVBQ0VGLE9BQU9HLElBQVAsQ0FBWU4sTUFBWjtBQUNILE9BSEQ7QUFJRDs7O2lDQUVZO0FBQ1g7QUFDQTtBQUNBLFVBQU1PLFdBQVcsRUFBakI7O0FBRUEsV0FBS1YsR0FBTCxDQUFTSSxPQUFULENBQWlCQyxPQUFqQixDQUF5QixVQUFDQyxNQUFELEVBQVk7QUFDbkMsWUFBTUssVUFBVSxzQkFBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDL0NQLGlCQUFPUSxTQUFQLEdBQW1CLFVBQUNDLENBQUQsRUFBTztBQUN4QixnQkFBTUMsU0FBUyxrQkFBU0EsTUFBVCxDQUFnQkQsRUFBRUUsSUFBbEIsQ0FBZjs7QUFFQSxnQkFBSUQsV0FBVyxpQkFBUUUsZUFBdkIsRUFDRU47QUFDSCxXQUxEO0FBTUQsU0FQZSxDQUFoQjs7QUFTQUYsaUJBQVNTLElBQVQsQ0FBY1IsT0FBZDtBQUNELE9BWEQ7O0FBYUEsVUFBTVIsU0FBUyxrQkFBU2lCLGFBQVQsRUFBZjtBQUNBLFdBQUtDLFVBQUwsQ0FBZ0JsQixNQUFoQjs7QUFFQSxhQUFPLGtCQUFRbUIsR0FBUixDQUFZWixRQUFaLENBQVA7QUFDRDs7O3dDQUVtQmEsZ0IsRUFBa0I7QUFDcEMsd0pBQTBCQSxnQkFBMUI7O0FBRUEsVUFBTXBCLFNBQVMsa0JBQVNxQixZQUFULENBQXNCLEtBQUtBLFlBQTNCLENBQWY7QUFDQSxXQUFLSCxVQUFMLENBQWdCbEIsTUFBaEI7QUFDRDs7O2tDQUVhO0FBQ1o7O0FBRUEsVUFBTUEsU0FBUyxrQkFBU3NCLFdBQVQsRUFBZjtBQUNBLFdBQUtKLFVBQUwsQ0FBZ0JsQixNQUFoQjtBQUNEOztBQUVDOzs7O21DQUNhdUIsTyxFQUFTO0FBQ3RCLG1KQUFxQkEsT0FBckI7O0FBRUEsVUFBTXZCLFNBQVMsa0JBQVN3QixjQUFULENBQXdCRCxPQUF4QixDQUFmO0FBQ0EsV0FBS0wsVUFBTCxDQUFnQmxCLE1BQWhCO0FBQ0Q7O0FBRUQ7QUFDQTs7OztvQ0FDZ0IsQ0FBRTtBQUNsQjs7OztvQ0FDZ0IsQ0FBRTtBQUNsQjs7OztvQ0FDZ0IsQ0FBRTs7O2lDQUVMeUIsSyxFQUFPO0FBQ2xCLFVBQU1DLFlBQVksS0FBS0wsWUFBTCxDQUFrQkssU0FBcEM7QUFDQSxXQUFLRCxLQUFMLENBQVdFLElBQVgsR0FBa0JGLE1BQU1FLElBQXhCO0FBQ0EsV0FBS0YsS0FBTCxDQUFXWCxJQUFYLENBQWdCYyxHQUFoQixDQUFvQkgsTUFBTVgsSUFBMUIsRUFBZ0MsQ0FBaEM7QUFDQSxXQUFLVyxLQUFMLENBQVdJLFFBQVgsR0FBc0JKLE1BQU1JLFFBQTVCOztBQUVBLFVBQU03QixTQUFTLGtCQUFTOEIsWUFBVCxDQUFzQixLQUFLTCxLQUEzQixFQUFrQ0MsU0FBbEMsQ0FBZjtBQUNBLFdBQUtSLFVBQUwsQ0FBZ0JsQixNQUFoQjtBQUNEOzs7OztrQkFHWUwsVSIsImZpbGUiOiJTb2NrZXRTZW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcbmltcG9ydCB7IG9wY29kZXMsIGVuY29kZXJzLCBkZWNvZGVycyB9IGZyb20gJy4uLy4uL2NvbW1vbi91dGlscy93c1V0aWxzJztcbmltcG9ydCB7IFdlYlNvY2tldCwgd3NTZXJ2ZXJGYWN0b3J5IH0gZnJvbSAnLi4vdXRpbHMvd3NTZXJ2ZXJGYWN0b3J5JztcblxuXG5jb25zdCBwYXJhbWV0ZXJzID0ge1xuICBwb3J0OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDgwMDAsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gIH0sXG59O1xuXG4vKipcbiAqIFNlbmQgYW4gbGZvIGZyYW1lIGFzIGEgc29ja2V0IG1lc3NhZ2UgdG8gYSBgY2xpZW50LnNvdXJjZS5Tb2NrZXRSZWNlaXZlYFxuICogaW5zdGFuY2UuXG4gKlxuICogQGV4cGVyaW1lbnRhbFxuICogQHBhcmFtcyB7T2JqZWN0fSBvcHRpb25zXG4gKi9cbmNsYXNzIFNvY2tldFNlbmQgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIocGFyYW1ldGVycywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLndzcyA9IHdzU2VydmVyRmFjdG9yeSh7XG4gICAgICBwb3J0OiB0aGlzLnBhcmFtcy5nZXQoJ3BvcnQnKSxcbiAgICAgIHNlcnZlcjogdGhpcy5wYXJhbXMuZ2V0KCdzZXJ2ZXInKSxcbiAgICB9KTtcblxuICAgIC8vIHRoaXMud3NzLm9uY29ubmVjdGlvbiA9IChzb2NrZXQpID0+IHtcbiAgICAvLyAgIGlmICh0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgLy8gICAgIC8vIHNvY2tldC5zZW5kKGluaXRNb2R1bGUpXG4gICAgLy8gICAgIC8vIHRoZW5cbiAgICAvLyAgICAgLy8gc29ja2V0LnByb2Nlc1N0cmVhbVBhcmFtc1xuICAgIC8vICAgICAvLyBzb2NrZXQuXG4gICAgLy8gICB9XG4gICAgLy8gfVxuICB9XG5cbiAgX2Jyb2FkY2FzdChidWZmZXIpIHtcbiAgICB0aGlzLndzcy5jbGllbnRzLmZvckVhY2goKGNsaWVudCkgPT4ge1xuICAgICAgaWYgKGNsaWVudC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTilcbiAgICAgICAgY2xpZW50LnNlbmQoYnVmZmVyKTtcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRNb2R1bGUoKSB7XG4gICAgLy8gc2VuZCBhIElOSVRfTU9EVUxFX1JFUSB0byBlYWNoIGNsaWVudCBhbmQgd2FpdCBmb3IgSU5JVF9NT0RVTEVfQUNLXG4gICAgLy8gbm8gbmVlZCB0byBnZXQgY2hpbGRyZW4gcHJvbWlzZXMgYXMgd2UgYXJlIGluIGEgbGVlZlxuICAgIGNvbnN0IHByb21pc2VzID0gW107XG5cbiAgICB0aGlzLndzcy5jbGllbnRzLmZvckVhY2goKGNsaWVudCkgPT4ge1xuICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY2xpZW50Lm9ubWVzc2FnZSA9IChlKSA9PiB7XG4gICAgICAgICAgY29uc3Qgb3Bjb2RlID0gZGVjb2RlcnMub3Bjb2RlKGUuZGF0YSk7XG5cbiAgICAgICAgICBpZiAob3Bjb2RlID09PSBvcGNvZGVzLklOSVRfTU9EVUxFX0FDSylcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBidWZmZXIgPSBlbmNvZGVycy5pbml0TW9kdWxlUmVxKCk7XG4gICAgdGhpcy5fYnJvYWRjYXN0KGJ1ZmZlcik7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICB9XG5cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgc3VwZXIucHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIGNvbnN0IGJ1ZmZlciA9IGVuY29kZXJzLnN0cmVhbVBhcmFtcyh0aGlzLnN0cmVhbVBhcmFtcyk7XG4gICAgdGhpcy5fYnJvYWRjYXN0KGJ1ZmZlcik7XG4gIH1cblxuICByZXNldFN0cmVhbSgpIHtcbiAgICBzdXBlci5yZXNldFN0cmVhbSgpO1xuXG4gICAgY29uc3QgYnVmZmVyID0gZW5jb2RlcnMucmVzZXRTdHJlYW0oKTtcbiAgICB0aGlzLl9icm9hZGNhc3QoYnVmZmVyKTtcbiAgfVxuXG4gICAgLyoqIEBwcml2YXRlICovXG4gIGZpbmFsaXplU3RyZWFtKGVuZFRpbWUpIHtcbiAgICBzdXBlci5maW5hbGl6ZVN0cmVhbShlbmRUaW1lKTtcblxuICAgIGNvbnN0IGJ1ZmZlciA9IGVuY29kZXJzLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICAgIHRoaXMuX2Jyb2FkY2FzdChidWZmZXIpO1xuICB9XG5cbiAgLy8gcHJvY2VzcyBhbnkgdHlwZVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NjYWxhcigpIHt9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKCkge31cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTaWduYWwoKSB7fVxuXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB0aGlzLmZyYW1lLnRpbWUgPSBmcmFtZS50aW1lO1xuICAgIHRoaXMuZnJhbWUuZGF0YS5zZXQoZnJhbWUuZGF0YSwgMCk7XG4gICAgdGhpcy5mcmFtZS5tZXRhZGF0YSA9IGZyYW1lLm1ldGFkYXRhO1xuXG4gICAgY29uc3QgYnVmZmVyID0gZW5jb2RlcnMucHJvY2Vzc0ZyYW1lKHRoaXMuZnJhbWUsIGZyYW1lU2l6ZSk7XG4gICAgdGhpcy5fYnJvYWRjYXN0KGJ1ZmZlcik7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU29ja2V0U2VuZDtcbiJdfQ==