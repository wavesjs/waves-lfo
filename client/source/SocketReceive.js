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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parameters = {
  port: {
    type: 'integer',
    default: 8000,
    nullable: true,
    constant: true
  },
  url: {
    type: 'string',
    default: null,
    nullable: true,
    constant: true
  }
};

/**
 * Receive an lfo frame as a socket message from a `node.sink.SocketSend`
 * instance.
 *
 * @experimental
 * @todo - handle init / start properly.
 */

var SocketReceive = function (_BaseLfo) {
  (0, _inherits3.default)(SocketReceive, _BaseLfo);

  function SocketReceive() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, SocketReceive);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SocketReceive.__proto__ || (0, _getPrototypeOf2.default)(SocketReceive)).call(this, parameters, options));

    var protocol = window.location.protocol.replace(/^http/, 'ws');
    var address = _this.params.get('url') || window.location.hostname;
    var port = _this.params.get('port') || ''; // everything falsy becomes ''
    var socketAddress = protocol + '//' + address + ':' + port;

    _this._dispatch = _this._dispatch.bind(_this);

    _this.socket = new WebSocket(socketAddress);
    _this.socket.binaryType = 'arraybuffer';

    _this.openedPromise = new _promise2.default(function (resolve, reject) {
      _this.socket.onopen = resolve;
    });

    _this.socket.onmessage = _this._dispatch;
    _this.socket.onerror = function (err) {
      return console.error(err.stack);
    };
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(SocketReceive, [{
    key: 'initModule',
    value: function initModule() {
      var _this2 = this;

      var promises = this.nextModules.map(function (mod) {
        return mod.initModule();
      });
      promises.push(this.openedPromise);
      // wait for children promises and send INIT_MODULE_ACK
      _promise2.default.all(promises).then(function () {
        var buffer = _wsUtils.encoders.initModuleAck();
        _this2.socket.send(buffer);
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

    /**
     * Decode and dispatch incomming frame according to opcode
     * @private
     */

  }, {
    key: '_dispatch',
    value: function _dispatch(e) {
      var arrayBuffer = e.data;
      var opcode = _wsUtils.decoders.opcode(arrayBuffer);

      switch (opcode) {
        case _wsUtils.opcodes.INIT_MODULE_REQ:
          this.initModule();
          break;
        case _wsUtils.opcodes.PROCESS_STREAM_PARAMS:
          var prevStreamParams = _wsUtils.decoders.streamParams(arrayBuffer);
          this.processStreamParams(prevStreamParams);
          break;
        case _wsUtils.opcodes.RESET_STREAM:
          this.resetStream();
          break;
        case _wsUtils.opcodes.FINALIZE_STREAM:
          var endTime = _wsUtils.decoders.finalizeStream(arrayBuffer);
          this.finalizeStream(endTime);
          break;
        case _wsUtils.opcodes.PROCESS_FRAME:
          var frameSize = this.streamParams.frameSize;
          var frame = _wsUtils.decoders.processFrame(arrayBuffer, frameSize);
          this.processFrame(frame);
          break;
      }
    }
  }]);
  return SocketReceive;
}(_BaseLfo3.default);

exports.default = SocketReceive;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvY2tldFJlY2VpdmUuanMiXSwibmFtZXMiOlsicGFyYW1ldGVycyIsInBvcnQiLCJ0eXBlIiwiZGVmYXVsdCIsIm51bGxhYmxlIiwiY29uc3RhbnQiLCJ1cmwiLCJTb2NrZXRSZWNlaXZlIiwib3B0aW9ucyIsInByb3RvY29sIiwid2luZG93IiwibG9jYXRpb24iLCJyZXBsYWNlIiwiYWRkcmVzcyIsInBhcmFtcyIsImdldCIsImhvc3RuYW1lIiwic29ja2V0QWRkcmVzcyIsIl9kaXNwYXRjaCIsImJpbmQiLCJzb2NrZXQiLCJXZWJTb2NrZXQiLCJiaW5hcnlUeXBlIiwib3BlbmVkUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbm9wZW4iLCJvbm1lc3NhZ2UiLCJvbmVycm9yIiwiZXJyIiwiY29uc29sZSIsImVycm9yIiwic3RhY2siLCJwcm9taXNlcyIsIm5leHRNb2R1bGVzIiwibWFwIiwibW9kIiwiaW5pdE1vZHVsZSIsInB1c2giLCJhbGwiLCJ0aGVuIiwiYnVmZmVyIiwiaW5pdE1vZHVsZUFjayIsInNlbmQiLCJmcmFtZSIsInByZXBhcmVGcmFtZSIsInByb3BhZ2F0ZUZyYW1lIiwiZSIsImFycmF5QnVmZmVyIiwiZGF0YSIsIm9wY29kZSIsIklOSVRfTU9EVUxFX1JFUSIsIlBST0NFU1NfU1RSRUFNX1BBUkFNUyIsInByZXZTdHJlYW1QYXJhbXMiLCJzdHJlYW1QYXJhbXMiLCJwcm9jZXNzU3RyZWFtUGFyYW1zIiwiUkVTRVRfU1RSRUFNIiwicmVzZXRTdHJlYW0iLCJGSU5BTElaRV9TVFJFQU0iLCJlbmRUaW1lIiwiZmluYWxpemVTdHJlYW0iLCJQUk9DRVNTX0ZSQU1FIiwiZnJhbWVTaXplIiwicHJvY2Vzc0ZyYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUEsSUFBTUEsYUFBYTtBQUNqQkMsUUFBTTtBQUNKQyxVQUFNLFNBREY7QUFFSkMsYUFBUyxJQUZMO0FB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O0FBQ0E7QUFDRixhQUFLLGlCQUFRRSxhQUFiO0FBQ0UsY0FBTUMsWUFBWSxLQUFLUixZQUFMLENBQWtCUSxTQUFwQztBQUNBLGNBQU1sQixRQUFRLGtCQUFTbUIsWUFBVCxDQUFzQmYsV0FBdEIsRUFBbUNjLFNBQW5DLENBQWQ7QUFDQSxlQUFLQyxZQUFMLENBQWtCbkIsS0FBbEI7QUFDQTtBQW5CSjtBQXFCRDs7Ozs7a0JBR1lyQyxhIiwiZmlsZSI6IlNvY2tldFJlY2VpdmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuaW1wb3J0IHsgb3Bjb2RlcywgZW5jb2RlcnMsIGRlY29kZXJzIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzL3dzVXRpbHMnO1xuXG5jb25zdCBwYXJhbWV0ZXJzID0ge1xuICBwb3J0OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDgwMDAsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIHVybDoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH1cbn1cblxuLyoqXG4gKiBSZWNlaXZlIGFuIGxmbyBmcmFtZSBhcyBhIHNvY2tldCBtZXNzYWdlIGZyb20gYSBgbm9kZS5zaW5rLlNvY2tldFNlbmRgXG4gKiBpbnN0YW5jZS5cbiAqXG4gKiBAZXhwZXJpbWVudGFsXG4gKiBAdG9kbyAtIGhhbmRsZSBpbml0IC8gc3RhcnQgcHJvcGVybHkuXG4gKi9cbmNsYXNzIFNvY2tldFJlY2VpdmUgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIocGFyYW1ldGVycywgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBwcm90b2NvbCA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbC5yZXBsYWNlKC9eaHR0cC8sICd3cycpO1xuICAgIGNvbnN0IGFkZHJlc3MgPSB0aGlzLnBhcmFtcy5nZXQoJ3VybCcpIHx8wqB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWU7XG4gICAgY29uc3QgcG9ydCA9IHRoaXMucGFyYW1zLmdldCgncG9ydCcpIHx8ICcnOyAvLyBldmVyeXRoaW5nIGZhbHN5IGJlY29tZXMgJydcbiAgICBjb25zdCBzb2NrZXRBZGRyZXNzID0gYCR7cHJvdG9jb2x9Ly8ke2FkZHJlc3N9OiR7cG9ydH1gO1xuXG4gICAgdGhpcy5fZGlzcGF0Y2ggPSB0aGlzLl9kaXNwYXRjaC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KHNvY2tldEFkZHJlc3MpO1xuICAgIHRoaXMuc29ja2V0LmJpbmFyeVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG4gICAgdGhpcy5vcGVuZWRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5zb2NrZXQub25vcGVuID0gcmVzb2x2ZTtcbiAgICB9KTtcblxuICAgIHRoaXMuc29ja2V0Lm9ubWVzc2FnZSA9IHRoaXMuX2Rpc3BhdGNoO1xuICAgIHRoaXMuc29ja2V0Lm9uZXJyb3IgPSAoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdE1vZHVsZSgpIHtcbiAgICBjb25zdCBwcm9taXNlcyA9IHRoaXMubmV4dE1vZHVsZXMubWFwKChtb2QpID0+IG1vZC5pbml0TW9kdWxlKCkpO1xuICAgIHByb21pc2VzLnB1c2godGhpcy5vcGVuZWRQcm9taXNlKTtcbiAgICAvLyB3YWl0IGZvciBjaGlsZHJlbiBwcm9taXNlcyBhbmQgc2VuZCBJTklUX01PRFVMRV9BQ0tcbiAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBidWZmZXIgPSBlbmNvZGVycy5pbml0TW9kdWxlQWNrKCk7XG4gICAgICB0aGlzLnNvY2tldC5zZW5kKGJ1ZmZlcik7XG4gICAgfSk7XG4gIH1cblxuICAvLyBwcm9jZXNzIGFueSB0eXBlXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2NhbGFyKCkge31cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoKSB7fVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbCgpIHt9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIHRoaXMucHJlcGFyZUZyYW1lKCk7XG4gICAgdGhpcy5mcmFtZSA9IGZyYW1lO1xuICAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWNvZGUgYW5kIGRpc3BhdGNoIGluY29tbWluZyBmcmFtZSBhY2NvcmRpbmcgdG8gb3Bjb2RlXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZGlzcGF0Y2goZSkge1xuICAgIGNvbnN0IGFycmF5QnVmZmVyID0gZS5kYXRhO1xuICAgIGNvbnN0IG9wY29kZSA9IGRlY29kZXJzLm9wY29kZShhcnJheUJ1ZmZlcik7XG5cbiAgICBzd2l0Y2ggKG9wY29kZSkge1xuICAgICAgY2FzZSBvcGNvZGVzLklOSVRfTU9EVUxFX1JFUTpcbiAgICAgICAgdGhpcy5pbml0TW9kdWxlKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBvcGNvZGVzLlBST0NFU1NfU1RSRUFNX1BBUkFNUzpcbiAgICAgICAgY29uc3QgcHJldlN0cmVhbVBhcmFtcyA9IGRlY29kZXJzLnN0cmVhbVBhcmFtcyhhcnJheUJ1ZmZlcik7XG4gICAgICAgIHRoaXMucHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG9wY29kZXMuUkVTRVRfU1RSRUFNOlxuICAgICAgICB0aGlzLnJlc2V0U3RyZWFtKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBvcGNvZGVzLkZJTkFMSVpFX1NUUkVBTTpcbiAgICAgICAgY29uc3QgZW5kVGltZSA9IGRlY29kZXJzLmZpbmFsaXplU3RyZWFtKGFycmF5QnVmZmVyKTtcbiAgICAgICAgdGhpcy5maW5hbGl6ZVN0cmVhbShlbmRUaW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG9wY29kZXMuUFJPQ0VTU19GUkFNRTpcbiAgICAgICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgICAgICBjb25zdCBmcmFtZSA9IGRlY29kZXJzLnByb2Nlc3NGcmFtZShhcnJheUJ1ZmZlciwgZnJhbWVTaXplKTtcbiAgICAgICAgdGhpcy5wcm9jZXNzRnJhbWUoZnJhbWUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU29ja2V0UmVjZWl2ZTtcbiJdfQ==