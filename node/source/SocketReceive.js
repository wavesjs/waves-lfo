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
 * This module doesn't implement start and stop as it is inherently part
 * of a larger graph.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvY2tldFJlY2VpdmUuanMiXSwibmFtZXMiOlsicGFyYW1ldGVycyIsInBvcnQiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwibnVsbGFibGUiLCJzZXJ2ZXIiLCJTb2NrZXRSZWNlaXZlIiwib3B0aW9ucyIsIl9vbkNvbm5lY3Rpb24iLCJiaW5kIiwiX2Rpc3BhdGNoIiwid3NzIiwicGFyYW1zIiwiZ2V0Iiwib24iLCJzb2NrZXQiLCJwcm9taXNlcyIsIm5leHRNb2R1bGVzIiwibWFwIiwibW9kIiwiaW5pdE1vZHVsZSIsImFsbCIsInRoZW4iLCJidWZmZXIiLCJpbml0TW9kdWxlQWNrIiwic2VuZCIsImZyYW1lIiwicHJlcGFyZUZyYW1lIiwicHJvcGFnYXRlRnJhbWUiLCJhcnJheUJ1ZmZlciIsIm9wY29kZSIsIklOSVRfTU9EVUxFX1JFUSIsIlBST0NFU1NfU1RSRUFNX1BBUkFNUyIsInByZXZTdHJlYW1QYXJhbXMiLCJzdHJlYW1QYXJhbXMiLCJwcm9jZXNzU3RyZWFtUGFyYW1zIiwiUkVTRVRfU1RSRUFNIiwicmVzZXRTdHJlYW0iLCJGSU5BTElaRV9TVFJFQU0iLCJlbmRUaW1lIiwiZmluYWxpemVTdHJlYW0iLCJQUk9DRVNTX0ZSQU1FIiwiZnJhbWVTaXplIiwicHJvY2Vzc0ZyYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBR0EsSUFBTUEsYUFBYTtBQUNqQkMsUUFBTTtBQUNKQyxVQUFNLFNBREY7QUFFSkMsYUFBUyxJQUZMO0FBR0pDLGNBQVUsSUFITjtBQUlKQyxjQUFVO0FBSk4sR0FEVztBQU9qQkMsVUFBUTtBQUNOSixVQUFNLEtBREE7QUFFTkMsYUFBUyxJQUZIO0FBR05DLGNBQVUsSUFISjtBQUlOQyxjQUFVO0FBSko7QUFQUyxDQUFuQjs7QUFlQTs7Ozs7Ozs7Ozs7Ozs7OztJQWVNRSxhOzs7QUFDSiwyQkFBMEI7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFBQSxvSkFDbEJSLFVBRGtCLEVBQ05RLE9BRE07O0FBR3hCLFVBQUtDLGFBQUwsR0FBcUIsTUFBS0EsYUFBTCxDQUFtQkMsSUFBbkIsT0FBckI7QUFDQSxVQUFLQyxTQUFMLEdBQWlCLE1BQUtBLFNBQUwsQ0FBZUQsSUFBZixPQUFqQjs7QUFFQSxVQUFLRSxHQUFMLEdBQVcsc0NBQWdCO0FBQ3pCWCxZQUFNLE1BQUtZLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixNQUFoQixDQURtQjtBQUV6QlIsY0FBUSxNQUFLTyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsUUFBaEI7QUFGaUIsS0FBaEIsQ0FBWDs7QUFLQSxVQUFLRixHQUFMLENBQVNHLEVBQVQsQ0FBWSxZQUFaLEVBQTBCLE1BQUtOLGFBQS9CO0FBWHdCO0FBWXpCOztBQUVEOzs7OzsrQkFDV08sTSxFQUFRO0FBQ2pCLFVBQU1DLFdBQVcsS0FBS0MsV0FBTCxDQUFpQkMsR0FBakIsQ0FBcUIsVUFBQ0MsR0FBRDtBQUFBLGVBQVNBLElBQUlDLFVBQUosRUFBVDtBQUFBLE9BQXJCLENBQWpCO0FBQ0E7QUFDQSx3QkFBUUMsR0FBUixDQUFZTCxRQUFaLEVBQXNCTSxJQUF0QixDQUEyQixZQUFNO0FBQy9CLFlBQU1DLFNBQVMsa0JBQVNDLGFBQVQsRUFBZjtBQUNBVCxlQUFPVSxJQUFQLENBQVlGLE1BQVo7QUFDRCxPQUhEO0FBSUQ7O0FBRUQ7QUFDQTs7OztvQ0FDZ0IsQ0FBRTtBQUNsQjs7OztvQ0FDZ0IsQ0FBRTtBQUNsQjs7OztvQ0FDZ0IsQ0FBRTs7QUFFbEI7Ozs7aUNBQ2FHLEssRUFBTztBQUNsQixXQUFLQyxZQUFMO0FBQ0EsV0FBS0QsS0FBTCxHQUFhQSxLQUFiO0FBQ0EsV0FBS0UsY0FBTDtBQUNEOztBQUVEOzs7O2tDQUNjYixNLEVBQVE7QUFDcEJBLGFBQU9ELEVBQVAsQ0FBVSxTQUFWLEVBQXFCLEtBQUtKLFNBQUwsQ0FBZUssTUFBZixDQUFyQjtBQUNEOztBQUVEOzs7Ozs7OzhCQUlVQSxNLEVBQVE7QUFBQTs7QUFDaEIsYUFBTyxVQUFDYyxXQUFELEVBQWlCO0FBQ3RCLFlBQU1DLFNBQVMsa0JBQVNBLE1BQVQsQ0FBZ0JELFdBQWhCLENBQWY7O0FBRUEsZ0JBQVFDLE1BQVI7QUFDRSxlQUFLLGlCQUFRQyxlQUFiO0FBQ0UsbUJBQUtYLFVBQUwsQ0FBZ0JMLE1BQWhCO0FBQ0E7QUFDRixlQUFLLGlCQUFRaUIscUJBQWI7QUFDRSxnQkFBTUMsbUJBQW1CLGtCQUFTQyxZQUFULENBQXNCTCxXQUF0QixDQUF6QjtBQUNBLG1CQUFLTSxtQkFBTCxDQUF5QkYsZ0JBQXpCO0FBQ0E7QUFDRixlQUFLLGlCQUFRRyxZQUFiO0FBQ0UsbUJBQUtDLFdBQUw7QUFDQTtBQUNGLGVBQUssaUJBQVFDLGVBQWI7QUFDRSxnQkFBTUMsVUFBVSxrQkFBU0MsY0FBVCxDQUF3QlgsV0FBeEIsQ0FBaEI7QUFDQSxtQkFBS1csY0FBTCxDQUFvQkQsT0FBcEI7QUFDQTtBQUNGLGVBQUssaUJBQVFFLGFBQWI7QUFDRSxnQkFBTUMsWUFBWSxPQUFLUixZQUFMLENBQWtCUSxTQUFwQztBQUNBLGdCQUFNaEIsUUFBUSxrQkFBU2lCLFlBQVQsQ0FBc0JkLFdBQXRCLEVBQW1DYSxTQUFuQyxDQUFkO0FBQ0EsbUJBQUtDLFlBQUwsQ0FBa0JqQixLQUFsQjtBQUNBO0FBbkJKO0FBcUJELE9BeEJEO0FBeUJEOzs7OztrQkFHWXBCLGEiLCJmaWxlIjoiU29ja2V0UmVjZWl2ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5pbXBvcnQgeyBvcGNvZGVzLCBkZWNvZGVycywgZW5jb2RlcnMgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMvd3NVdGlscyc7XG5pbXBvcnQgeyB3c1NlcnZlckZhY3RvcnkgfSBmcm9tICcuLi91dGlscy93c1NlcnZlckZhY3RvcnknO1xuXG5cbmNvbnN0IHBhcmFtZXRlcnMgPSB7XG4gIHBvcnQ6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogODAwMCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgfSxcbn07XG5cbi8qKlxuICogVGhpcyBtb2R1bGUgZG9lc24ndCBpbXBsZW1lbnQgc3RhcnQgYW5kIHN0b3AgYXMgaXQgaXMgaW5oZXJlbnRseSBwYXJ0XG4gKiBvZiBhIGxhcmdlciBncmFwaC5cbiAqXG4gKiBAcGFyYW1zIHtPYmplY3R9IG9wdGlvbnNcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3Qgc29ja2V0ID0gbmV3IGxmby5zb3VyY2UuU29ja2V0UmVjZWl2ZSh7IHBvcnQ6IDgwMDAgfSk7XG4gKiBjb25zdCBsb2dnZXIgPSBuZXcgbGZvLnNpbmsuTG9nZ2VyKHtcbiAqICAgdGltZTogdHJ1ZSxcbiAqICAgZGF0YTogdHJ1ZSxcbiAqIH0pO1xuICpcbiAqIHNvY2tldC5jb25uZWN0KGxvZ2dlcik7XG4gKi9cbmNsYXNzIFNvY2tldFJlY2VpdmUgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIocGFyYW1ldGVycywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9vbkNvbm5lY3Rpb24gPSB0aGlzLl9vbkNvbm5lY3Rpb24uYmluZCh0aGlzKTtcbiAgICB0aGlzLl9kaXNwYXRjaCA9IHRoaXMuX2Rpc3BhdGNoLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLndzcyA9IHdzU2VydmVyRmFjdG9yeSh7XG4gICAgICBwb3J0OiB0aGlzLnBhcmFtcy5nZXQoJ3BvcnQnKSxcbiAgICAgIHNlcnZlcjogdGhpcy5wYXJhbXMuZ2V0KCdzZXJ2ZXInKSxcbiAgICB9KTtcblxuICAgIHRoaXMud3NzLm9uKCdjb25uZWN0aW9uJywgdGhpcy5fb25Db25uZWN0aW9uKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpbml0TW9kdWxlKHNvY2tldCkge1xuICAgIGNvbnN0IHByb21pc2VzID0gdGhpcy5uZXh0TW9kdWxlcy5tYXAoKG1vZCkgPT4gbW9kLmluaXRNb2R1bGUoKSk7XG4gICAgLy8gd2FpdCBmb3IgY2hpbGRyZW4gcHJvbWlzZXMgYW5kIHNlbmQgSU5JVF9NT0RVTEVfQUNLXG4gICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xuICAgICAgY29uc3QgYnVmZmVyID0gZW5jb2RlcnMuaW5pdE1vZHVsZUFjaygpO1xuICAgICAgc29ja2V0LnNlbmQoYnVmZmVyKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHByb2Nlc3MgYW55IHR5cGVcbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTY2FsYXIoKSB7fVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcigpIHt9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKCkge31cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgdGhpcy5wcmVwYXJlRnJhbWUoKTtcbiAgICB0aGlzLmZyYW1lID0gZnJhbWU7XG4gICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkNvbm5lY3Rpb24oc29ja2V0KSB7XG4gICAgc29ja2V0Lm9uKCdtZXNzYWdlJywgdGhpcy5fZGlzcGF0Y2goc29ja2V0KSk7XG4gIH1cblxuICAvKipcbiAgICogRGVjb2RlIGFuZCBkaXNwYXRjaCBpbmNvbW1pbmcgZnJhbWUgYWNjb3JkaW5nIHRvIG9wY29kZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2Rpc3BhdGNoKHNvY2tldCkge1xuICAgIHJldHVybiAoYXJyYXlCdWZmZXIpID0+IHtcbiAgICAgIGNvbnN0IG9wY29kZSA9IGRlY29kZXJzLm9wY29kZShhcnJheUJ1ZmZlcik7XG5cbiAgICAgIHN3aXRjaCAob3Bjb2RlKSB7XG4gICAgICAgIGNhc2Ugb3Bjb2Rlcy5JTklUX01PRFVMRV9SRVE6XG4gICAgICAgICAgdGhpcy5pbml0TW9kdWxlKHNvY2tldCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugb3Bjb2Rlcy5QUk9DRVNTX1NUUkVBTV9QQVJBTVM6XG4gICAgICAgICAgY29uc3QgcHJldlN0cmVhbVBhcmFtcyA9IGRlY29kZXJzLnN0cmVhbVBhcmFtcyhhcnJheUJ1ZmZlcik7XG4gICAgICAgICAgdGhpcy5wcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIG9wY29kZXMuUkVTRVRfU1RSRUFNOlxuICAgICAgICAgIHRoaXMucmVzZXRTdHJlYW0oKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBvcGNvZGVzLkZJTkFMSVpFX1NUUkVBTTpcbiAgICAgICAgICBjb25zdCBlbmRUaW1lID0gZGVjb2RlcnMuZmluYWxpemVTdHJlYW0oYXJyYXlCdWZmZXIpO1xuICAgICAgICAgIHRoaXMuZmluYWxpemVTdHJlYW0oZW5kVGltZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugb3Bjb2Rlcy5QUk9DRVNTX0ZSQU1FOlxuICAgICAgICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICAgICAgICBjb25zdCBmcmFtZSA9IGRlY29kZXJzLnByb2Nlc3NGcmFtZShhcnJheUJ1ZmZlciwgZnJhbWVTaXplKTtcbiAgICAgICAgICB0aGlzLnByb2Nlc3NGcmFtZShmcmFtZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNvY2tldFJlY2VpdmU7XG4iXX0=