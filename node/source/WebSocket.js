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

var _BaseLfo = require('../../core/BaseLfo');

var _BaseLfo2 = _interopRequireDefault(_BaseLfo);

var _SourceMixin2 = require('../../core/SourceMixin');

var _SourceMixin3 = _interopRequireDefault(_SourceMixin2);

var _wsServerFactory = require('../utils/wsServerFactory');

var _wsUtils = require('../../common/utils/wsUtils');

var wsUtils = _interopRequireWildcard(_wsUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
 *
 *
 *
 */

var WebSocket = function (_SourceMixin) {
  (0, _inherits3.default)(WebSocket, _SourceMixin);

  function WebSocket() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, WebSocket);

    var _this = (0, _possibleConstructorReturn3.default)(this, (WebSocket.__proto__ || (0, _getPrototypeOf2.default)(WebSocket)).call(this, parameters, options));

    _this._onConnection = _this._onConnection.bind(_this);
    // this._onDisconnect = this._onDisconnect.bind(this);
    _this._dispatch = _this._dispatch.bind(_this);

    _this.wss = (0, _wsServerFactory.wsServerFactory)(_this.params.get('port'));
    _this.wss.on('connection', _this._onConnection);
    // this.wss.on('disconnect', this._onDisconnect); // doesn't exists ?
    return _this;
  }

  (0, _createClass3.default)(WebSocket, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      (0, _get3.default)(WebSocket.prototype.__proto__ || (0, _getPrototypeOf2.default)(WebSocket.prototype), 'processStreamParams', this).call(this, prevStreamParams);
      console.log('processStreamParams');
    }
  }, {
    key: 'resetStream',
    value: function resetStream() {
      this.frame.data.fill(0);
      console.log('resetStream');
    }
  }, {
    key: 'finalizeStream',
    value: function finalizeStream(endTime) {
      console.log('finalizeStream', endTime);
      (0, _get3.default)(WebSocket.prototype.__proto__ || (0, _getPrototypeOf2.default)(WebSocket.prototype), 'finalizeStream', this).call(this, endTime);
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

    /** @private */

  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      this.prepareFrame();

      var output = this.frame;
      // pull interface (we copy data since we don't know what could
      // be done outside the graph)
      for (var i = 0, l = this.streamParams.frameSize; i < l; i++) {
        output.data[i] = frame.data[i];
      }output.time = frame.time;
      output.metadata = frame.metadata;

      this.propagateFrame();
    }
  }, {
    key: '_onConnection',
    value: function _onConnection(socket) {
      socket.on('message', this._dispatch);
    }

    // _onDisconnect(socket) {
    //   console.log('disconnect', socket);
    // }

    /**
     *
     * code 1 bytes
     *
     */

  }, {
    key: '_dispatch',
    value: function _dispatch(ab) {
      var opcode = new Uint16Array(ab)[0]; // 1 bytes for opcode, 1 dead byte
      console.log('[opcode]', opcode);

      switch (opcode) {
        case 0: // PING
        // const
        // processStreamParams :   [1 byte for opcode, x bytes for payload]
        case 1:
          // PONG
          var payload = new Uint16Array(ab.slice(2));
          var prevStreamParams = wsUtils.Uint16Array2json(payload);
          this.processStreamParams(prevStreamParams);
          break;
        // resetStream
        case 1:
          this.resetStream();
          break;
        // finalizeStream
        case 2:
          var endTime = new Float64Array(ab.slice(2))[0];
          console.log(endTime);
          this.finalizeStream(endTime);
          break;
        case 3:

          break;
      }
    }
  }]);
  return WebSocket;
}((0, _SourceMixin3.default)(_BaseLfo2.default));

exports.default = WebSocket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldlYlNvY2tldC5qcyJdLCJuYW1lcyI6WyJ3c1V0aWxzIiwicGFyYW1ldGVycyIsInBvcnQiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwibnVsbGFibGUiLCJzZXJ2ZXIiLCJXZWJTb2NrZXQiLCJvcHRpb25zIiwiX29uQ29ubmVjdGlvbiIsImJpbmQiLCJfZGlzcGF0Y2giLCJ3c3MiLCJwYXJhbXMiLCJnZXQiLCJvbiIsInByZXZTdHJlYW1QYXJhbXMiLCJjb25zb2xlIiwibG9nIiwiZnJhbWUiLCJkYXRhIiwiZmlsbCIsImVuZFRpbWUiLCJwcmVwYXJlRnJhbWUiLCJvdXRwdXQiLCJpIiwibCIsInN0cmVhbVBhcmFtcyIsImZyYW1lU2l6ZSIsInRpbWUiLCJtZXRhZGF0YSIsInByb3BhZ2F0ZUZyYW1lIiwic29ja2V0IiwiYWIiLCJvcGNvZGUiLCJVaW50MTZBcnJheSIsInBheWxvYWQiLCJzbGljZSIsIlVpbnQxNkFycmF5Mmpzb24iLCJwcm9jZXNzU3RyZWFtUGFyYW1zIiwicmVzZXRTdHJlYW0iLCJGbG9hdDY0QXJyYXkiLCJmaW5hbGl6ZVN0cmVhbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztJQUFZQSxPOzs7Ozs7QUFHWixJQUFNQyxhQUFhO0FBQ2pCQyxRQUFNO0FBQ0pDLFVBQU0sU0FERjtBQUVKQyxhQUFTLElBRkw7QUFHSkMsY0FBVSxJQUhOO0FBSUpDLGNBQVU7QUFKTixHQURXO0FBT2pCQyxVQUFRO0FBQ05KLFVBQU0sS0FEQTtBQUVOQyxhQUFTLElBRkg7QUFHTkMsY0FBVSxJQUhKO0FBSU5DLGNBQVU7QUFKSjtBQVBTLENBQW5COztBQWVBOzs7Ozs7SUFLTUUsUzs7O0FBQ0osdUJBQTBCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQUEsNElBQ2xCUixVQURrQixFQUNOUSxPQURNOztBQUd4QixVQUFLQyxhQUFMLEdBQXFCLE1BQUtBLGFBQUwsQ0FBbUJDLElBQW5CLE9BQXJCO0FBQ0E7QUFDQSxVQUFLQyxTQUFMLEdBQWlCLE1BQUtBLFNBQUwsQ0FBZUQsSUFBZixPQUFqQjs7QUFFQSxVQUFLRSxHQUFMLEdBQVcsc0NBQWdCLE1BQUtDLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixNQUFoQixDQUFoQixDQUFYO0FBQ0EsVUFBS0YsR0FBTCxDQUFTRyxFQUFULENBQVksWUFBWixFQUEwQixNQUFLTixhQUEvQjtBQUNBO0FBVHdCO0FBVXpCOzs7O3dDQUVtQk8sZ0IsRUFBa0I7QUFDcEMsc0pBQTBCQSxnQkFBMUI7QUFDQUMsY0FBUUMsR0FBUixDQUFZLHFCQUFaO0FBQ0Q7OztrQ0FFYTtBQUNaLFdBQUtDLEtBQUwsQ0FBV0MsSUFBWCxDQUFnQkMsSUFBaEIsQ0FBcUIsQ0FBckI7QUFDQUosY0FBUUMsR0FBUixDQUFZLGFBQVo7QUFDRDs7O21DQUVjSSxPLEVBQVM7QUFDdEJMLGNBQVFDLEdBQVIsQ0FBWSxnQkFBWixFQUE4QkksT0FBOUI7QUFDQSxpSkFBcUJBLE9BQXJCO0FBQ0Q7O0FBRUQ7QUFDQTs7OztvQ0FDZ0IsQ0FBRTtBQUNsQjs7OztvQ0FDZ0IsQ0FBRTtBQUNsQjs7OztvQ0FDZ0IsQ0FBRTs7QUFFbEI7Ozs7aUNBQ2FILEssRUFBTztBQUNsQixXQUFLSSxZQUFMOztBQUVBLFVBQU1DLFNBQVMsS0FBS0wsS0FBcEI7QUFDQTtBQUNBO0FBQ0EsV0FBSyxJQUFJTSxJQUFJLENBQVIsRUFBV0MsSUFBSSxLQUFLQyxZQUFMLENBQWtCQyxTQUF0QyxFQUFpREgsSUFBSUMsQ0FBckQsRUFBd0RELEdBQXhEO0FBQ0VELGVBQU9KLElBQVAsQ0FBWUssQ0FBWixJQUFpQk4sTUFBTUMsSUFBTixDQUFXSyxDQUFYLENBQWpCO0FBREYsT0FHQUQsT0FBT0ssSUFBUCxHQUFjVixNQUFNVSxJQUFwQjtBQUNBTCxhQUFPTSxRQUFQLEdBQWtCWCxNQUFNVyxRQUF4Qjs7QUFFQSxXQUFLQyxjQUFMO0FBQ0Q7OztrQ0FHYUMsTSxFQUFRO0FBQ3BCQSxhQUFPakIsRUFBUCxDQUFVLFNBQVYsRUFBcUIsS0FBS0osU0FBMUI7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7OzhCQUtVc0IsRSxFQUFJO0FBQ1osVUFBTUMsU0FBUyxJQUFJQyxXQUFKLENBQWdCRixFQUFoQixFQUFvQixDQUFwQixDQUFmLENBRFksQ0FDMkI7QUFDdkNoQixjQUFRQyxHQUFSLENBQVksVUFBWixFQUF3QmdCLE1BQXhCOztBQUVBLGNBQVFBLE1BQVI7QUFDRSxhQUFLLENBQUwsQ0FERixDQUNVO0FBQ047QUFDRjtBQUNBLGFBQUssQ0FBTDtBQUFRO0FBQ04sY0FBTUUsVUFBVSxJQUFJRCxXQUFKLENBQWdCRixHQUFHSSxLQUFILENBQVMsQ0FBVCxDQUFoQixDQUFoQjtBQUNBLGNBQU1yQixtQkFBbUJqQixRQUFRdUMsZ0JBQVIsQ0FBeUJGLE9BQXpCLENBQXpCO0FBQ0EsZUFBS0csbUJBQUwsQ0FBeUJ2QixnQkFBekI7QUFDQTtBQUNGO0FBQ0EsYUFBSyxDQUFMO0FBQ0UsZUFBS3dCLFdBQUw7QUFDQTtBQUNGO0FBQ0EsYUFBSyxDQUFMO0FBQ0UsY0FBTWxCLFVBQVUsSUFBSW1CLFlBQUosQ0FBaUJSLEdBQUdJLEtBQUgsQ0FBUyxDQUFULENBQWpCLEVBQThCLENBQTlCLENBQWhCO0FBQ0FwQixrQkFBUUMsR0FBUixDQUFZSSxPQUFaO0FBQ0EsZUFBS29CLGNBQUwsQ0FBb0JwQixPQUFwQjtBQUNBO0FBQ0YsYUFBSyxDQUFMOztBQUVFO0FBckJKO0FBdUJEOzs7RUE3RnFCLDZDOztrQkFnR1RmLFMiLCJmaWxlIjoiV2ViU29ja2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcbmltcG9ydCBTb3VyY2VNaXhpbiBmcm9tICcuLi8uLi9jb3JlL1NvdXJjZU1peGluJztcbmltcG9ydCB7IHdzU2VydmVyRmFjdG9yeSB9IGZyb20gJy4uL3V0aWxzL3dzU2VydmVyRmFjdG9yeSc7XG5pbXBvcnQgKiBhcyB3c1V0aWxzIGZyb20gJy4uLy4uL2NvbW1vbi91dGlscy93c1V0aWxzJztcblxuXG5jb25zdCBwYXJhbWV0ZXJzID0ge1xuICBwb3J0OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDgwMDAsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gIH0sXG59O1xuXG4vKipcbiAqXG4gKlxuICpcbiAqL1xuY2xhc3MgV2ViU29ja2V0IGV4dGVuZHMgU291cmNlTWl4aW4oQmFzZUxmbykge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihwYXJhbWV0ZXJzLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX29uQ29ubmVjdGlvbiA9IHRoaXMuX29uQ29ubmVjdGlvbi5iaW5kKHRoaXMpO1xuICAgIC8vIHRoaXMuX29uRGlzY29ubmVjdCA9IHRoaXMuX29uRGlzY29ubmVjdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX2Rpc3BhdGNoID0gdGhpcy5fZGlzcGF0Y2guYmluZCh0aGlzKTtcblxuICAgIHRoaXMud3NzID0gd3NTZXJ2ZXJGYWN0b3J5KHRoaXMucGFyYW1zLmdldCgncG9ydCcpKTtcbiAgICB0aGlzLndzcy5vbignY29ubmVjdGlvbicsIHRoaXMuX29uQ29ubmVjdGlvbik7XG4gICAgLy8gdGhpcy53c3Mub24oJ2Rpc2Nvbm5lY3QnLCB0aGlzLl9vbkRpc2Nvbm5lY3QpOyAvLyBkb2Vzbid0IGV4aXN0cyA/XG4gIH1cblxuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICBzdXBlci5wcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuICAgIGNvbnNvbGUubG9nKCdwcm9jZXNzU3RyZWFtUGFyYW1zJyk7XG4gIH1cblxuICByZXNldFN0cmVhbSgpIHtcbiAgICB0aGlzLmZyYW1lLmRhdGEuZmlsbCgwKTtcbiAgICBjb25zb2xlLmxvZygncmVzZXRTdHJlYW0nKTtcbiAgfVxuXG4gIGZpbmFsaXplU3RyZWFtKGVuZFRpbWUpIHtcbiAgICBjb25zb2xlLmxvZygnZmluYWxpemVTdHJlYW0nLCBlbmRUaW1lKTtcbiAgICBzdXBlci5maW5hbGl6ZVN0cmVhbShlbmRUaW1lKTtcbiAgfVxuXG4gIC8vIHByb2Nlc3MgYW55IHR5cGVcbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTY2FsYXIoKSB7fVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcigpIHt9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKCkge31cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgdGhpcy5wcmVwYXJlRnJhbWUoKTtcblxuICAgIGNvbnN0IG91dHB1dCA9IHRoaXMuZnJhbWU7XG4gICAgLy8gcHVsbCBpbnRlcmZhY2UgKHdlIGNvcHkgZGF0YSBzaW5jZSB3ZSBkb24ndCBrbm93IHdoYXQgY291bGRcbiAgICAvLyBiZSBkb25lIG91dHNpZGUgdGhlIGdyYXBoKVxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplOyBpIDwgbDsgaSsrKVxuICAgICAgb3V0cHV0LmRhdGFbaV0gPSBmcmFtZS5kYXRhW2ldO1xuXG4gICAgb3V0cHV0LnRpbWUgPSBmcmFtZS50aW1lO1xuICAgIG91dHB1dC5tZXRhZGF0YSA9IGZyYW1lLm1ldGFkYXRhO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICB9XG5cblxuICBfb25Db25uZWN0aW9uKHNvY2tldCkge1xuICAgIHNvY2tldC5vbignbWVzc2FnZScsIHRoaXMuX2Rpc3BhdGNoKTtcbiAgfVxuXG4gIC8vIF9vbkRpc2Nvbm5lY3Qoc29ja2V0KSB7XG4gIC8vICAgY29uc29sZS5sb2coJ2Rpc2Nvbm5lY3QnLCBzb2NrZXQpO1xuICAvLyB9XG5cbiAgLyoqXG4gICAqXG4gICAqIGNvZGUgMSBieXRlc1xuICAgKlxuICAgKi9cbiAgX2Rpc3BhdGNoKGFiKSB7XG4gICAgY29uc3Qgb3Bjb2RlID0gbmV3IFVpbnQxNkFycmF5KGFiKVswXTsgLy8gMSBieXRlcyBmb3Igb3Bjb2RlLCAxIGRlYWQgYnl0ZVxuICAgIGNvbnNvbGUubG9nKCdbb3Bjb2RlXScsIG9wY29kZSk7XG5cbiAgICBzd2l0Y2ggKG9wY29kZSkge1xuICAgICAgY2FzZSAwOiAvLyBQSU5HXG4gICAgICAgIC8vIGNvbnN0XG4gICAgICAvLyBwcm9jZXNzU3RyZWFtUGFyYW1zIDogICBbMSBieXRlIGZvciBvcGNvZGUsIHggYnl0ZXMgZm9yIHBheWxvYWRdXG4gICAgICBjYXNlIDE6IC8vIFBPTkdcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IG5ldyBVaW50MTZBcnJheShhYi5zbGljZSgyKSk7XG4gICAgICAgIGNvbnN0IHByZXZTdHJlYW1QYXJhbXMgPSB3c1V0aWxzLlVpbnQxNkFycmF5Mmpzb24ocGF5bG9hZCk7XG4gICAgICAgIHRoaXMucHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyByZXNldFN0cmVhbVxuICAgICAgY2FzZSAxOlxuICAgICAgICB0aGlzLnJlc2V0U3RyZWFtKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gZmluYWxpemVTdHJlYW1cbiAgICAgIGNhc2UgMjpcbiAgICAgICAgY29uc3QgZW5kVGltZSA9IG5ldyBGbG9hdDY0QXJyYXkoYWIuc2xpY2UoMikpWzBdO1xuICAgICAgICBjb25zb2xlLmxvZyhlbmRUaW1lKTtcbiAgICAgICAgdGhpcy5maW5hbGl6ZVN0cmVhbShlbmRUaW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG5cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdlYlNvY2tldDtcbiJdfQ==