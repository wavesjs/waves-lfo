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
 *
 *
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvY2tldFJlY2VpdmUuanMiXSwibmFtZXMiOlsicGFyYW1ldGVycyIsInBvcnQiLCJ0eXBlIiwiZGVmYXVsdCIsIm51bGxhYmxlIiwiY29uc3RhbnQiLCJ1cmwiLCJTb2NrZXRSZWNlaXZlIiwib3B0aW9ucyIsInByb3RvY29sIiwid2luZG93IiwibG9jYXRpb24iLCJyZXBsYWNlIiwiYWRkcmVzcyIsInBhcmFtcyIsImdldCIsImhvc3RuYW1lIiwic29ja2V0QWRkcmVzcyIsIl9kaXNwYXRjaCIsImJpbmQiLCJzb2NrZXQiLCJXZWJTb2NrZXQiLCJiaW5hcnlUeXBlIiwib3BlbmVkUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbm9wZW4iLCJvbm1lc3NhZ2UiLCJvbmVycm9yIiwiZXJyIiwiY29uc29sZSIsImVycm9yIiwic3RhY2siLCJwcm9taXNlcyIsIm5leHRNb2R1bGVzIiwibWFwIiwibW9kIiwiaW5pdE1vZHVsZSIsInB1c2giLCJhbGwiLCJ0aGVuIiwiYnVmZmVyIiwiaW5pdE1vZHVsZUFjayIsInNlbmQiLCJmcmFtZSIsInByZXBhcmVGcmFtZSIsInByb3BhZ2F0ZUZyYW1lIiwiZSIsImFycmF5QnVmZmVyIiwiZGF0YSIsIm9wY29kZSIsIklOSVRfTU9EVUxFX1JFUSIsIlBST0NFU1NfU1RSRUFNX1BBUkFNUyIsInByZXZTdHJlYW1QYXJhbXMiLCJzdHJlYW1QYXJhbXMiLCJwcm9jZXNzU3RyZWFtUGFyYW1zIiwiUkVTRVRfU1RSRUFNIiwicmVzZXRTdHJlYW0iLCJGSU5BTElaRV9TVFJFQU0iLCJlbmRUaW1lIiwiZmluYWxpemVTdHJlYW0iLCJQUk9DRVNTX0ZSQU1FIiwiZnJhbWVTaXplIiwicHJvY2Vzc0ZyYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUEsSUFBTUEsYUFBYTtBQUNqQkMsUUFBTTtBQUNKQyxVQUFNLFNBREY7QUFFSkMsYUFBUyxJQUZMO0FB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Q0E7QUFDRixhQUFLLGlCQUFRRSxhQUFiO0FBQ0UsY0FBTUMsWUFBWSxLQUFLUixZQUFMLENBQWtCUSxTQUFwQztBQUNBLGNBQU1sQixRQUFRLGtCQUFTbUIsWUFBVCxDQUFzQmYsV0FBdEIsRUFBbUNjLFNBQW5DLENBQWQ7QUFDQSxlQUFLQyxZQUFMLENBQWtCbkIsS0FBbEI7QUFDQTtBQW5CSjtBQXFCRDs7Ozs7a0JBR1lyQyxhIiwiZmlsZSI6IlNvY2tldFJlY2VpdmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuaW1wb3J0IHsgb3Bjb2RlcywgZW5jb2RlcnMsIGRlY29kZXJzIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzL3dzVXRpbHMnO1xuXG5jb25zdCBwYXJhbWV0ZXJzID0ge1xuICBwb3J0OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDgwMDAsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIHVybDoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH1cbn1cblxuLyoqXG4gKlxuICpcbiAqL1xuY2xhc3MgU29ja2V0UmVjZWl2ZSBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihwYXJhbWV0ZXJzLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IHByb3RvY29sID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sLnJlcGxhY2UoL15odHRwLywgJ3dzJyk7XG4gICAgY29uc3QgYWRkcmVzcyA9IHRoaXMucGFyYW1zLmdldCgndXJsJykgfHzCoHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZTtcbiAgICBjb25zdCBwb3J0ID0gdGhpcy5wYXJhbXMuZ2V0KCdwb3J0JykgfHwgJyc7IC8vIGV2ZXJ5dGhpbmcgZmFsc3kgYmVjb21lcyAnJ1xuICAgIGNvbnN0IHNvY2tldEFkZHJlc3MgPSBgJHtwcm90b2NvbH0vLyR7YWRkcmVzc306JHtwb3J0fWA7XG5cbiAgICB0aGlzLl9kaXNwYXRjaCA9IHRoaXMuX2Rpc3BhdGNoLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQoc29ja2V0QWRkcmVzcyk7XG4gICAgdGhpcy5zb2NrZXQuYmluYXJ5VHlwZSA9ICdhcnJheWJ1ZmZlcic7XG5cbiAgICB0aGlzLm9wZW5lZFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnNvY2tldC5vbm9wZW4gPSByZXNvbHZlO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zb2NrZXQub25tZXNzYWdlID0gdGhpcy5fZGlzcGF0Y2g7XG4gICAgdGhpcy5zb2NrZXQub25lcnJvciA9IChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpbml0TW9kdWxlKCkge1xuICAgIGNvbnN0IHByb21pc2VzID0gdGhpcy5uZXh0TW9kdWxlcy5tYXAoKG1vZCkgPT4gbW9kLmluaXRNb2R1bGUoKSk7XG4gICAgcHJvbWlzZXMucHVzaCh0aGlzLm9wZW5lZFByb21pc2UpO1xuICAgIC8vIHdhaXQgZm9yIGNoaWxkcmVuIHByb21pc2VzIGFuZCBzZW5kIElOSVRfTU9EVUxFX0FDS1xuICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IGVuY29kZXJzLmluaXRNb2R1bGVBY2soKTtcbiAgICAgIHRoaXMuc29ja2V0LnNlbmQoYnVmZmVyKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHByb2Nlc3MgYW55IHR5cGVcbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTY2FsYXIoKSB7fVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcigpIHt9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKCkge31cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgdGhpcy5wcmVwYXJlRnJhbWUoKTtcbiAgICB0aGlzLmZyYW1lID0gZnJhbWU7XG4gICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlY29kZSBhbmQgZGlzcGF0Y2ggaW5jb21taW5nIGZyYW1lIGFjY29yZGluZyB0byBvcGNvZGVcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9kaXNwYXRjaChlKSB7XG4gICAgY29uc3QgYXJyYXlCdWZmZXIgPSBlLmRhdGE7XG4gICAgY29uc3Qgb3Bjb2RlID0gZGVjb2RlcnMub3Bjb2RlKGFycmF5QnVmZmVyKTtcblxuICAgIHN3aXRjaCAob3Bjb2RlKSB7XG4gICAgICBjYXNlIG9wY29kZXMuSU5JVF9NT0RVTEVfUkVROlxuICAgICAgICB0aGlzLmluaXRNb2R1bGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG9wY29kZXMuUFJPQ0VTU19TVFJFQU1fUEFSQU1TOlxuICAgICAgICBjb25zdCBwcmV2U3RyZWFtUGFyYW1zID0gZGVjb2RlcnMuc3RyZWFtUGFyYW1zKGFycmF5QnVmZmVyKTtcbiAgICAgICAgdGhpcy5wcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2Ugb3Bjb2Rlcy5SRVNFVF9TVFJFQU06XG4gICAgICAgIHRoaXMucmVzZXRTdHJlYW0oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG9wY29kZXMuRklOQUxJWkVfU1RSRUFNOlxuICAgICAgICBjb25zdCBlbmRUaW1lID0gZGVjb2RlcnMuZmluYWxpemVTdHJlYW0oYXJyYXlCdWZmZXIpO1xuICAgICAgICB0aGlzLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2Ugb3Bjb2Rlcy5QUk9DRVNTX0ZSQU1FOlxuICAgICAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgICAgIGNvbnN0IGZyYW1lID0gZGVjb2RlcnMucHJvY2Vzc0ZyYW1lKGFycmF5QnVmZmVyLCBmcmFtZVNpemUpO1xuICAgICAgICB0aGlzLnByb2Nlc3NGcmFtZShmcmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTb2NrZXRSZWNlaXZlO1xuIl19