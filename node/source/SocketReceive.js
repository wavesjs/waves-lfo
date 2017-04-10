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
 * Receive an lfo frame as a socket message from a `client.sink.SocketSend`
 * instance.
 *
 * @experimental
 *
 * @params {Object} options
 *
 * @example
 * const socket = new lfo.source.SocketReceive({ port: 8000 });
 * const logger = new lfo.sink.Logger({
 *   time: true,
 *   data: true,
 * });
 *
 * socket.connect(logger);
 */

var SocketReceive = function (_BaseLfo) {
  (0, _inherits3.default)(SocketReceive, _BaseLfo);

  function SocketReceive() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, SocketReceive);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SocketReceive.__proto__ || (0, _getPrototypeOf2.default)(SocketReceive)).call(this, parameters, options));

    _this._onConnection = _this._onConnection.bind(_this);
    _this._dispatch = _this._dispatch.bind(_this);

    _this.wss = (0, _wsServerFactory.wsServerFactory)({
      port: _this.params.get('port'),
      server: _this.params.get('server')
    });

    _this.wss.on('connection', _this._onConnection);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(SocketReceive, [{
    key: 'initModule',
    value: function initModule(socket) {
      var promises = this.nextModules.map(function (mod) {
        return mod.initModule();
      });
      // wait for children promises and send INIT_MODULE_ACK
      _promise2.default.all(promises).then(function () {
        var buffer = _wsUtils.encoders.initModuleAck();
        socket.send(buffer);
      });
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
      this.frame = frame;
      this.propagateFrame();
    }

    /** @private */

  }, {
    key: '_onConnection',
    value: function _onConnection(socket) {
      socket.on('message', this._dispatch(socket));
    }

    /**
     * Decode and dispatch incomming frame according to opcode
     * @private
     */

  }, {
    key: '_dispatch',
    value: function _dispatch(socket) {
      var _this2 = this;

      return function (arrayBuffer) {
        var opcode = _wsUtils.decoders.opcode(arrayBuffer);

        switch (opcode) {
          case _wsUtils.opcodes.INIT_MODULE_REQ:
            _this2.initModule(socket);
            break;
          case _wsUtils.opcodes.PROCESS_STREAM_PARAMS:
            var prevStreamParams = _wsUtils.decoders.streamParams(arrayBuffer);
            _this2.processStreamParams(prevStreamParams);
            break;
          case _wsUtils.opcodes.RESET_STREAM:
            _this2.resetStream();
            break;
          case _wsUtils.opcodes.FINALIZE_STREAM:
            var endTime = _wsUtils.decoders.finalizeStream(arrayBuffer);
            _this2.finalizeStream(endTime);
            break;
          case _wsUtils.opcodes.PROCESS_FRAME:
            var frameSize = _this2.streamParams.frameSize;
            var frame = _wsUtils.decoders.processFrame(arrayBuffer, frameSize);
            _this2.processFrame(frame);
            break;
        }
      };
    }
  }]);
  return SocketReceive;
}(_BaseLfo3.default);

exports.default = SocketReceive;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvY2tldFJlY2VpdmUuanMiXSwibmFtZXMiOlsicGFyYW1ldGVycyIsInBvcnQiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwibnVsbGFibGUiLCJzZXJ2ZXIiLCJTb2NrZXRSZWNlaXZlIiwib3B0aW9ucyIsIl9vbkNvbm5lY3Rpb24iLCJiaW5kIiwiX2Rpc3BhdGNoIiwid3NzIiwicGFyYW1zIiwiZ2V0Iiwib24iLCJzb2NrZXQiLCJwcm9taXNlcyIsIm5leHRNb2R1bGVzIiwibWFwIiwibW9kIiwiaW5pdE1vZHVsZSIsImFsbCIsInRoZW4iLCJidWZmZXIiLCJpbml0TW9kdWxlQWNrIiwic2VuZCIsImZyYW1lIiwicHJlcGFyZUZyYW1lIiwicHJvcGFnYXRlRnJhbWUiLCJhcnJheUJ1ZmZlciIsIm9wY29kZSIsIklOSVRfTU9EVUxFX1JFUSIsIlBST0NFU1NfU1RSRUFNX1BBUkFNUyIsInByZXZTdHJlYW1QYXJhbXMiLCJzdHJlYW1QYXJhbXMiLCJwcm9jZXNzU3RyZWFtUGFyYW1zIiwiUkVTRVRfU1RSRUFNIiwicmVzZXRTdHJlYW0iLCJGSU5BTElaRV9TVFJFQU0iLCJlbmRUaW1lIiwiZmluYWxpemVTdHJlYW0iLCJQUk9DRVNTX0ZSQU1FIiwiZnJhbWVTaXplIiwicHJvY2Vzc0ZyYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBR0EsSUFBTUEsYUFBYTtBQUNqQkMsUUFBTTtBQUNKQyxVQUFNLFNBREY7QUFFSkMsYUFBUyxJQUZMO0FBR0pDLGNBQVUsSUFITjtBQUlKQyxjQUFVO0FBSk4sR0FEVztBQU9qQkMsVUFBUTtBQUNOSixVQUFNLEtBREE7QUFFTkMsYUFBUyxJQUZIO0FBR05DLGNBQVUsSUFISjtBQUlOQyxjQUFVO0FBSko7QUFQUyxDQUFuQjs7QUFlQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBaUJNRSxhOzs7QUFDSiwyQkFBMEI7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFBQSxvSkFDbEJSLFVBRGtCLEVBQ05RLE9BRE07O0FBR3hCLFVBQUtDLGFBQUwsR0FBcUIsTUFBS0EsYUFBTCxDQUFtQkMsSUFBbkIsT0FBckI7QUFDQSxVQUFLQyxTQUFMLEdBQWlCLE1BQUtBLFNBQUwsQ0FBZUQsSUFBZixPQUFqQjs7QUFFQSxVQUFLRSxHQUFMLEdBQVcsc0NBQWdCO0FBQ3pCWCxZQUFNLE1BQUtZLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixNQUFoQixDQURtQjtBQUV6QlIsY0FBUSxNQUFLTyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsUUFBaEI7QUFGaUIsS0FBaEIsQ0FBWDs7QUFLQSxVQUFLRixHQUFMLENBQVNHLEVBQVQsQ0FBWSxZQUFaLEVBQTBCLE1BQUtOLGFBQS9CO0FBWHdCO0FBWXpCOztBQUVEOzs7OzsrQkFDV08sTSxFQUFRO0FBQ2pCLFVBQU1DLFdBQVcsS0FBS0MsV0FBTCxDQUFpQkMsR0FBakIsQ0FBcUIsVUFBQ0MsR0FBRDtBQUFBLGVBQVNBLElBQUlDLFVBQUosRUFBVDtBQUFBLE9BQXJCLENBQWpCO0FBQ0E7QUFDQSx3QkFBUUMsR0FBUixDQUFZTCxRQUFaLEVBQXNCTSxJQUF0QixDQUEyQixZQUFNO0FBQy9CLFlBQU1DLFNBQVMsa0JBQVNDLGFBQVQsRUFBZjtBQUNBVCxlQUFPVSxJQUFQLENBQVlGLE1BQVo7QUFDRCxPQUhEO0FBSUQ7O0FBRUQ7QUFDQTs7OztvQ0FDZ0IsQ0FBRTtBQUNsQjs7OztvQ0FDZ0IsQ0FBRTtBQUNsQjs7OztvQ0FDZ0IsQ0FBRTs7QUFFbEI7Ozs7aUNBQ2FHLEssRUFBTztBQUNsQixXQUFLQyxZQUFMO0FBQ0EsV0FBS0QsS0FBTCxHQUFhQSxLQUFiO0FBQ0EsV0FBS0UsY0FBTDtBQUNEOztBQUVEOzs7O2tDQUNjYixNLEVBQVE7QUFDcEJBLGFBQU9ELEVBQVAsQ0FBVSxTQUFWLEVBQXFCLEtBQUtKLFNBQUwsQ0FBZUssTUFBZixDQUFyQjtBQUNEOztBQUVEOzs7Ozs7OzhCQUlVQSxNLEVBQVE7QUFBQTs7QUFDaEIsYUFBTyxVQUFDYyxXQUFELEVBQWlCO0FBQ3RCLFlBQU1DLFNBQVMsa0JBQVNBLE1BQVQsQ0FBZ0JELFdBQWhCLENBQWY7O0FBRUEsZ0JBQVFDLE1BQVI7QUFDRSxlQUFLLGlCQUFRQyxlQUFiO0FBQ0UsbUJBQUtYLFVBQUwsQ0FBZ0JMLE1BQWhCO0FBQ0E7QUFDRixlQUFLLGlCQUFRaUIscUJBQWI7QUFDRSxnQkFBTUMsbUJBQW1CLGtCQUFTQyxZQUFULENBQXNCTCxXQUF0QixDQUF6QjtBQUNBLG1CQUFLTSxtQkFBTCxDQUF5QkYsZ0JBQXpCO0FBQ0E7QUFDRixlQUFLLGlCQUFRRyxZQUFiO0FBQ0UsbUJBQUtDLFdBQUw7QUFDQTtBQUNGLGVBQUssaUJBQVFDLGVBQWI7QUFDRSxnQkFBTUMsVUFBVSxrQkFBU0MsY0FBVCxDQUF3QlgsV0FBeEIsQ0FBaEI7QUFDQSxtQkFBS1csY0FBTCxDQUFvQkQsT0FBcEI7QUFDQTtBQUNGLGVBQUssaUJBQVFFLGFBQWI7QUFDRSxnQkFBTUMsWUFBWSxPQUFLUixZQUFMLENBQWtCUSxTQUFwQztBQUNBLGdCQUFNaEIsUUFBUSxrQkFBU2lCLFlBQVQsQ0FBc0JkLFdBQXRCLEVBQW1DYSxTQUFuQyxDQUFkO0FBQ0EsbUJBQUtDLFlBQUwsQ0FBa0JqQixLQUFsQjtBQUNBO0FBbkJKO0FBcUJELE9BeEJEO0FBeUJEOzs7OztrQkFHWXBCLGEiLCJmaWxlIjoiU29ja2V0UmVjZWl2ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5pbXBvcnQgeyBvcGNvZGVzLCBkZWNvZGVycywgZW5jb2RlcnMgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMvd3NVdGlscyc7XG5pbXBvcnQgeyB3c1NlcnZlckZhY3RvcnkgfSBmcm9tICcuLi91dGlscy93c1NlcnZlckZhY3RvcnknO1xuXG5cbmNvbnN0IHBhcmFtZXRlcnMgPSB7XG4gIHBvcnQ6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogODAwMCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgfSxcbn07XG5cbi8qKlxuICogUmVjZWl2ZSBhbiBsZm8gZnJhbWUgYXMgYSBzb2NrZXQgbWVzc2FnZSBmcm9tIGEgYGNsaWVudC5zaW5rLlNvY2tldFNlbmRgXG4gKiBpbnN0YW5jZS5cbiAqXG4gKiBAZXhwZXJpbWVudGFsXG4gKlxuICogQHBhcmFtcyB7T2JqZWN0fSBvcHRpb25zXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHNvY2tldCA9IG5ldyBsZm8uc291cmNlLlNvY2tldFJlY2VpdmUoeyBwb3J0OiA4MDAwIH0pO1xuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7XG4gKiAgIHRpbWU6IHRydWUsXG4gKiAgIGRhdGE6IHRydWUsXG4gKiB9KTtcbiAqXG4gKiBzb2NrZXQuY29ubmVjdChsb2dnZXIpO1xuICovXG5jbGFzcyBTb2NrZXRSZWNlaXZlIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fb25Db25uZWN0aW9uID0gdGhpcy5fb25Db25uZWN0aW9uLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fZGlzcGF0Y2ggPSB0aGlzLl9kaXNwYXRjaC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy53c3MgPSB3c1NlcnZlckZhY3Rvcnkoe1xuICAgICAgcG9ydDogdGhpcy5wYXJhbXMuZ2V0KCdwb3J0JyksXG4gICAgICBzZXJ2ZXI6IHRoaXMucGFyYW1zLmdldCgnc2VydmVyJyksXG4gICAgfSk7XG5cbiAgICB0aGlzLndzcy5vbignY29ubmVjdGlvbicsIHRoaXMuX29uQ29ubmVjdGlvbik7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdE1vZHVsZShzb2NrZXQpIHtcbiAgICBjb25zdCBwcm9taXNlcyA9IHRoaXMubmV4dE1vZHVsZXMubWFwKChtb2QpID0+IG1vZC5pbml0TW9kdWxlKCkpO1xuICAgIC8vIHdhaXQgZm9yIGNoaWxkcmVuIHByb21pc2VzIGFuZCBzZW5kIElOSVRfTU9EVUxFX0FDS1xuICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IGVuY29kZXJzLmluaXRNb2R1bGVBY2soKTtcbiAgICAgIHNvY2tldC5zZW5kKGJ1ZmZlcik7XG4gICAgfSk7XG4gIH1cblxuICAvLyBwcm9jZXNzIGFueSB0eXBlXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2NhbGFyKCkge31cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoKSB7fVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbCgpIHt9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIHRoaXMucHJlcGFyZUZyYW1lKCk7XG4gICAgdGhpcy5mcmFtZSA9IGZyYW1lO1xuICAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Db25uZWN0aW9uKHNvY2tldCkge1xuICAgIHNvY2tldC5vbignbWVzc2FnZScsIHRoaXMuX2Rpc3BhdGNoKHNvY2tldCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlY29kZSBhbmQgZGlzcGF0Y2ggaW5jb21taW5nIGZyYW1lIGFjY29yZGluZyB0byBvcGNvZGVcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9kaXNwYXRjaChzb2NrZXQpIHtcbiAgICByZXR1cm4gKGFycmF5QnVmZmVyKSA9PiB7XG4gICAgICBjb25zdCBvcGNvZGUgPSBkZWNvZGVycy5vcGNvZGUoYXJyYXlCdWZmZXIpO1xuXG4gICAgICBzd2l0Y2ggKG9wY29kZSkge1xuICAgICAgICBjYXNlIG9wY29kZXMuSU5JVF9NT0RVTEVfUkVROlxuICAgICAgICAgIHRoaXMuaW5pdE1vZHVsZShzb2NrZXQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIG9wY29kZXMuUFJPQ0VTU19TVFJFQU1fUEFSQU1TOlxuICAgICAgICAgIGNvbnN0IHByZXZTdHJlYW1QYXJhbXMgPSBkZWNvZGVycy5zdHJlYW1QYXJhbXMoYXJyYXlCdWZmZXIpO1xuICAgICAgICAgIHRoaXMucHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBvcGNvZGVzLlJFU0VUX1NUUkVBTTpcbiAgICAgICAgICB0aGlzLnJlc2V0U3RyZWFtKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugb3Bjb2Rlcy5GSU5BTElaRV9TVFJFQU06XG4gICAgICAgICAgY29uc3QgZW5kVGltZSA9IGRlY29kZXJzLmZpbmFsaXplU3RyZWFtKGFycmF5QnVmZmVyKTtcbiAgICAgICAgICB0aGlzLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIG9wY29kZXMuUFJPQ0VTU19GUkFNRTpcbiAgICAgICAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgICAgICAgY29uc3QgZnJhbWUgPSBkZWNvZGVycy5wcm9jZXNzRnJhbWUoYXJyYXlCdWZmZXIsIGZyYW1lU2l6ZSk7XG4gICAgICAgICAgdGhpcy5wcm9jZXNzRnJhbWUoZnJhbWUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTb2NrZXRSZWNlaXZlO1xuIl19