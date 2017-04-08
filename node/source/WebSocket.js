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

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

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

var WebSocket = function (_BaseLfo) {
  (0, _inherits3.default)(WebSocket, _BaseLfo);

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
        // processStreamParams :   [1 byte for opcode, x bytes for payload]
        case 0:
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
}(_BaseLfo3.default);

exports.default = WebSocket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldlYlNvY2tldC5qcyJdLCJuYW1lcyI6WyJ3c1V0aWxzIiwicGFyYW1ldGVycyIsInBvcnQiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwibnVsbGFibGUiLCJzZXJ2ZXIiLCJXZWJTb2NrZXQiLCJvcHRpb25zIiwiX29uQ29ubmVjdGlvbiIsImJpbmQiLCJfZGlzcGF0Y2giLCJ3c3MiLCJwYXJhbXMiLCJnZXQiLCJvbiIsInByZXZTdHJlYW1QYXJhbXMiLCJjb25zb2xlIiwibG9nIiwiZnJhbWUiLCJkYXRhIiwiZmlsbCIsImVuZFRpbWUiLCJwcmVwYXJlRnJhbWUiLCJvdXRwdXQiLCJpIiwibCIsInN0cmVhbVBhcmFtcyIsImZyYW1lU2l6ZSIsInRpbWUiLCJtZXRhZGF0YSIsInByb3BhZ2F0ZUZyYW1lIiwic29ja2V0IiwiYWIiLCJvcGNvZGUiLCJVaW50MTZBcnJheSIsInBheWxvYWQiLCJzbGljZSIsIlVpbnQxNkFycmF5Mmpzb24iLCJwcm9jZXNzU3RyZWFtUGFyYW1zIiwicmVzZXRTdHJlYW0iLCJGbG9hdDY0QXJyYXkiLCJmaW5hbGl6ZVN0cmVhbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7SUFBWUEsTzs7Ozs7O0FBR1osSUFBTUMsYUFBYTtBQUNqQkMsUUFBTTtBQUNKQyxVQUFNLFNBREY7QUFFSkMsYUFBUyxJQUZMO0FBR0pDLGNBQVUsSUFITjtBQUlKQyxjQUFVO0FBSk4sR0FEVztBQU9qQkMsVUFBUTtBQUNOSixVQUFNLEtBREE7QUFFTkMsYUFBUyxJQUZIO0FBR05DLGNBQVUsSUFISjtBQUlOQyxjQUFVO0FBSko7QUFQUyxDQUFuQjs7QUFlQTs7Ozs7O0lBS01FLFM7OztBQUNKLHVCQUEwQjtBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTtBQUFBOztBQUFBLDRJQUNsQlIsVUFEa0IsRUFDTlEsT0FETTs7QUFHeEIsVUFBS0MsYUFBTCxHQUFxQixNQUFLQSxhQUFMLENBQW1CQyxJQUFuQixPQUFyQjtBQUNBO0FBQ0EsVUFBS0MsU0FBTCxHQUFpQixNQUFLQSxTQUFMLENBQWVELElBQWYsT0FBakI7O0FBRUEsVUFBS0UsR0FBTCxHQUFXLHNDQUFnQixNQUFLQyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsTUFBaEIsQ0FBaEIsQ0FBWDtBQUNBLFVBQUtGLEdBQUwsQ0FBU0csRUFBVCxDQUFZLFlBQVosRUFBMEIsTUFBS04sYUFBL0I7QUFDQTtBQVR3QjtBQVV6Qjs7Ozt3Q0FFbUJPLGdCLEVBQWtCO0FBQ3BDLHNKQUEwQkEsZ0JBQTFCO0FBQ0FDLGNBQVFDLEdBQVIsQ0FBWSxxQkFBWjtBQUNEOzs7a0NBRWE7QUFDWixXQUFLQyxLQUFMLENBQVdDLElBQVgsQ0FBZ0JDLElBQWhCLENBQXFCLENBQXJCO0FBQ0FKLGNBQVFDLEdBQVIsQ0FBWSxhQUFaO0FBQ0Q7OzttQ0FFY0ksTyxFQUFTO0FBQ3RCTCxjQUFRQyxHQUFSLENBQVksZ0JBQVosRUFBOEJJLE9BQTlCO0FBQ0EsaUpBQXFCQSxPQUFyQjtBQUNEOztBQUVEO0FBQ0E7Ozs7b0NBQ2dCLENBQUU7QUFDbEI7Ozs7b0NBQ2dCLENBQUU7QUFDbEI7Ozs7b0NBQ2dCLENBQUU7O0FBRWxCOzs7O2lDQUNhSCxLLEVBQU87QUFDbEIsV0FBS0ksWUFBTDs7QUFFQSxVQUFNQyxTQUFTLEtBQUtMLEtBQXBCO0FBQ0E7QUFDQTtBQUNBLFdBQUssSUFBSU0sSUFBSSxDQUFSLEVBQVdDLElBQUksS0FBS0MsWUFBTCxDQUFrQkMsU0FBdEMsRUFBaURILElBQUlDLENBQXJELEVBQXdERCxHQUF4RDtBQUNFRCxlQUFPSixJQUFQLENBQVlLLENBQVosSUFBaUJOLE1BQU1DLElBQU4sQ0FBV0ssQ0FBWCxDQUFqQjtBQURGLE9BR0FELE9BQU9LLElBQVAsR0FBY1YsTUFBTVUsSUFBcEI7QUFDQUwsYUFBT00sUUFBUCxHQUFrQlgsTUFBTVcsUUFBeEI7O0FBRUEsV0FBS0MsY0FBTDtBQUNEOzs7a0NBR2FDLE0sRUFBUTtBQUNwQkEsYUFBT2pCLEVBQVAsQ0FBVSxTQUFWLEVBQXFCLEtBQUtKLFNBQTFCO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs4QkFLVXNCLEUsRUFBSTtBQUNaLFVBQU1DLFNBQVMsSUFBSUMsV0FBSixDQUFnQkYsRUFBaEIsRUFBb0IsQ0FBcEIsQ0FBZixDQURZLENBQzJCO0FBQ3ZDaEIsY0FBUUMsR0FBUixDQUFZLFVBQVosRUFBd0JnQixNQUF4Qjs7QUFFQSxjQUFRQSxNQUFSO0FBQ0U7QUFDQSxhQUFLLENBQUw7QUFDRSxjQUFNRSxVQUFVLElBQUlELFdBQUosQ0FBZ0JGLEdBQUdJLEtBQUgsQ0FBUyxDQUFULENBQWhCLENBQWhCO0FBQ0EsY0FBTXJCLG1CQUFtQmpCLFFBQVF1QyxnQkFBUixDQUF5QkYsT0FBekIsQ0FBekI7QUFDQSxlQUFLRyxtQkFBTCxDQUF5QnZCLGdCQUF6QjtBQUNBO0FBQ0Y7QUFDQSxhQUFLLENBQUw7QUFDRSxlQUFLd0IsV0FBTDtBQUNBO0FBQ0Y7QUFDQSxhQUFLLENBQUw7QUFDRSxjQUFNbEIsVUFBVSxJQUFJbUIsWUFBSixDQUFpQlIsR0FBR0ksS0FBSCxDQUFTLENBQVQsQ0FBakIsRUFBOEIsQ0FBOUIsQ0FBaEI7QUFDQXBCLGtCQUFRQyxHQUFSLENBQVlJLE9BQVo7QUFDQSxlQUFLb0IsY0FBTCxDQUFvQnBCLE9BQXBCO0FBQ0E7QUFDRixhQUFLLENBQUw7O0FBRUU7QUFuQko7QUFxQkQ7Ozs7O2tCQUdZZixTIiwiZmlsZSI6IldlYlNvY2tldC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5pbXBvcnQgeyB3c1NlcnZlckZhY3RvcnkgfSBmcm9tICcuLi91dGlscy93c1NlcnZlckZhY3RvcnknO1xuaW1wb3J0ICogYXMgd3NVdGlscyBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMvd3NVdGlscyc7XG5cblxuY29uc3QgcGFyYW1ldGVycyA9IHtcbiAgcG9ydDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiA4MDAwLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICB9LFxufTtcblxuLyoqXG4gKlxuICpcbiAqXG4gKi9cbmNsYXNzIFdlYlNvY2tldCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihwYXJhbWV0ZXJzLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX29uQ29ubmVjdGlvbiA9IHRoaXMuX29uQ29ubmVjdGlvbi5iaW5kKHRoaXMpO1xuICAgIC8vIHRoaXMuX29uRGlzY29ubmVjdCA9IHRoaXMuX29uRGlzY29ubmVjdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX2Rpc3BhdGNoID0gdGhpcy5fZGlzcGF0Y2guYmluZCh0aGlzKTtcblxuICAgIHRoaXMud3NzID0gd3NTZXJ2ZXJGYWN0b3J5KHRoaXMucGFyYW1zLmdldCgncG9ydCcpKTtcbiAgICB0aGlzLndzcy5vbignY29ubmVjdGlvbicsIHRoaXMuX29uQ29ubmVjdGlvbik7XG4gICAgLy8gdGhpcy53c3Mub24oJ2Rpc2Nvbm5lY3QnLCB0aGlzLl9vbkRpc2Nvbm5lY3QpOyAvLyBkb2Vzbid0IGV4aXN0cyA/XG4gIH1cblxuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICBzdXBlci5wcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuICAgIGNvbnNvbGUubG9nKCdwcm9jZXNzU3RyZWFtUGFyYW1zJyk7XG4gIH1cblxuICByZXNldFN0cmVhbSgpIHtcbiAgICB0aGlzLmZyYW1lLmRhdGEuZmlsbCgwKTtcbiAgICBjb25zb2xlLmxvZygncmVzZXRTdHJlYW0nKTtcbiAgfVxuXG4gIGZpbmFsaXplU3RyZWFtKGVuZFRpbWUpIHtcbiAgICBjb25zb2xlLmxvZygnZmluYWxpemVTdHJlYW0nLCBlbmRUaW1lKTtcbiAgICBzdXBlci5maW5hbGl6ZVN0cmVhbShlbmRUaW1lKTtcbiAgfVxuXG4gIC8vIHByb2Nlc3MgYW55IHR5cGVcbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTY2FsYXIoKSB7fVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcigpIHt9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKCkge31cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgdGhpcy5wcmVwYXJlRnJhbWUoKTtcblxuICAgIGNvbnN0IG91dHB1dCA9IHRoaXMuZnJhbWU7XG4gICAgLy8gcHVsbCBpbnRlcmZhY2UgKHdlIGNvcHkgZGF0YSBzaW5jZSB3ZSBkb24ndCBrbm93IHdoYXQgY291bGRcbiAgICAvLyBiZSBkb25lIG91dHNpZGUgdGhlIGdyYXBoKVxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplOyBpIDwgbDsgaSsrKVxuICAgICAgb3V0cHV0LmRhdGFbaV0gPSBmcmFtZS5kYXRhW2ldO1xuXG4gICAgb3V0cHV0LnRpbWUgPSBmcmFtZS50aW1lO1xuICAgIG91dHB1dC5tZXRhZGF0YSA9IGZyYW1lLm1ldGFkYXRhO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICB9XG5cblxuICBfb25Db25uZWN0aW9uKHNvY2tldCkge1xuICAgIHNvY2tldC5vbignbWVzc2FnZScsIHRoaXMuX2Rpc3BhdGNoKTtcbiAgfVxuXG4gIC8vIF9vbkRpc2Nvbm5lY3Qoc29ja2V0KSB7XG4gIC8vICAgY29uc29sZS5sb2coJ2Rpc2Nvbm5lY3QnLCBzb2NrZXQpO1xuICAvLyB9XG5cbiAgLyoqXG4gICAqXG4gICAqIGNvZGUgMSBieXRlc1xuICAgKlxuICAgKi9cbiAgX2Rpc3BhdGNoKGFiKSB7XG4gICAgY29uc3Qgb3Bjb2RlID0gbmV3IFVpbnQxNkFycmF5KGFiKVswXTsgLy8gMSBieXRlcyBmb3Igb3Bjb2RlLCAxIGRlYWQgYnl0ZVxuICAgIGNvbnNvbGUubG9nKCdbb3Bjb2RlXScsIG9wY29kZSk7XG5cbiAgICBzd2l0Y2ggKG9wY29kZSkge1xuICAgICAgLy8gcHJvY2Vzc1N0cmVhbVBhcmFtcyA6ICAgWzEgYnl0ZSBmb3Igb3Bjb2RlLCB4IGJ5dGVzIGZvciBwYXlsb2FkXVxuICAgICAgY2FzZSAwOlxuICAgICAgICBjb25zdCBwYXlsb2FkID0gbmV3IFVpbnQxNkFycmF5KGFiLnNsaWNlKDIpKTtcbiAgICAgICAgY29uc3QgcHJldlN0cmVhbVBhcmFtcyA9IHdzVXRpbHMuVWludDE2QXJyYXkyanNvbihwYXlsb2FkKTtcbiAgICAgICAgdGhpcy5wcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHJlc2V0U3RyZWFtXG4gICAgICBjYXNlIDE6XG4gICAgICAgIHRoaXMucmVzZXRTdHJlYW0oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBmaW5hbGl6ZVN0cmVhbVxuICAgICAgY2FzZSAyOlxuICAgICAgICBjb25zdCBlbmRUaW1lID0gbmV3IEZsb2F0NjRBcnJheShhYi5zbGljZSgyKSlbMF07XG4gICAgICAgIGNvbnNvbGUubG9nKGVuZFRpbWUpO1xuICAgICAgICB0aGlzLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcblxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgV2ViU29ja2V0O1xuIl19