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
 * @example
 * const eventIn = new lfo.source.EventIn({
 *   frameType: 'vector',
 *   frameSize: 2,
 *   frameRate: 1,
 * });
 *
 * const socketSend = new lfo.sink.SocketSend({
 *   port: 3000
 * });
 *
 * eventIn.connect(socketSend);
 *
 * eventIn.init().then(() => {
 *   eventIn.start();
 *
 *   let time = 0;
 *
 *   (function createFrame() {
 *     eventIn.process(time, [Math.random(), Math.random()], { test: true });
 *     time += 1;
 *
 *     setTimeout(createFrame, 1000);
 *   }());
 * });
 */

var SocketSend = function (_BaseLfo) {
  (0, _inherits3.default)(SocketSend, _BaseLfo);

  function SocketSend() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, SocketSend);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SocketSend.__proto__ || (0, _getPrototypeOf2.default)(SocketSend)).call(this, parameters, options));

    var protocol = window.location.protocol.replace(/^http/, 'ws');
    var address = _this.params.get('url') || window.location.hostname;
    var port = _this.params.get('port') || ''; // everything falsy becomes ''
    var socketAddress = protocol + '//' + address + ':' + port;

    _this.socket = new WebSocket(socketAddress);
    _this.socket.binaryType = 'arraybuffer';

    _this.openedPromise = new _promise2.default(function (resolve, reject) {
      _this.socket.onopen = resolve;
    });

    _this.socket.onerror = function (err) {
      return console.error(err.stack);
    };
    return _this;
  }

  (0, _createClass3.default)(SocketSend, [{
    key: 'initModule',
    value: function initModule() {
      var _this2 = this;

      // send a INIT_MODULE_REQ and wait for INIT_MODULE_ACK
      // no need to get children promises as we are in a leef
      return this.openedPromise.then(function () {
        return new _promise2.default(function (resolve, reject) {
          _this2.socket.onmessage = function (e) {
            var opcode = _wsUtils.decoders.opcode(e.data);

            if (opcode === _wsUtils.opcodes.INIT_MODULE_ACK) resolve();
          };

          var buffer = _wsUtils.encoders.initModuleReq();
          _this2.socket.send(buffer);
        });
      });
    }
  }, {
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      (0, _get3.default)(SocketSend.prototype.__proto__ || (0, _getPrototypeOf2.default)(SocketSend.prototype), 'processStreamParams', this).call(this, prevStreamParams);

      var buffer = _wsUtils.encoders.streamParams(this.streamParams);
      this.socket.send(buffer);
    }
  }, {
    key: 'resetStream',
    value: function resetStream() {
      (0, _get3.default)(SocketSend.prototype.__proto__ || (0, _getPrototypeOf2.default)(SocketSend.prototype), 'resetStream', this).call(this);

      var buffer = _wsUtils.encoders.resetStream();
      this.socket.send(buffer);
    }

    /** @private */

  }, {
    key: 'finalizeStream',
    value: function finalizeStream(endTime) {
      (0, _get3.default)(SocketSend.prototype.__proto__ || (0, _getPrototypeOf2.default)(SocketSend.prototype), 'finalizeStream', this).call(this, endTime);

      var buffer = _wsUtils.encoders.finalizeStream(endTime);
      this.socket.send(buffer);
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
      this.socket.send(buffer);
    }
  }]);
  return SocketSend;
}(_BaseLfo3.default);

exports.default = SocketSend;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvY2tldFNlbmQuanMiXSwibmFtZXMiOlsicGFyYW1ldGVycyIsInBvcnQiLCJ0eXBlIiwiZGVmYXVsdCIsIm51bGxhYmxlIiwiY29uc3RhbnQiLCJ1cmwiLCJTb2NrZXRTZW5kIiwib3B0aW9ucyIsInByb3RvY29sIiwid2luZG93IiwibG9jYXRpb24iLCJyZXBsYWNlIiwiYWRkcmVzcyIsInBhcmFtcyIsImdldCIsImhvc3RuYW1lIiwic29ja2V0QWRkcmVzcyIsInNvY2tldCIsIldlYlNvY2tldCIsImJpbmFyeVR5cGUiLCJvcGVuZWRQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIm9ub3BlbiIsIm9uZXJyb3IiLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJzdGFjayIsInRoZW4iLCJvbm1lc3NhZ2UiLCJlIiwib3Bjb2RlIiwiZGF0YSIsIklOSVRfTU9EVUxFX0FDSyIsImJ1ZmZlciIsImluaXRNb2R1bGVSZXEiLCJzZW5kIiwicHJldlN0cmVhbVBhcmFtcyIsInN0cmVhbVBhcmFtcyIsInJlc2V0U3RyZWFtIiwiZW5kVGltZSIsImZpbmFsaXplU3RyZWFtIiwiZnJhbWUiLCJmcmFtZVNpemUiLCJ0aW1lIiwic2V0IiwibWV0YWRhdGEiLCJwcm9jZXNzRnJhbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUEsSUFBTUEsYUFBYTtBQUNqQkMsUUFBTTtBQUNKQyxVQUFNLFNBREY7QUFFSkMsYUFBUyxJQUZMO0FBR0pDLGNBQVUsSUFITjtBQUlKQyxjQUFVO0FBSk4sR0FEVztBQU9qQkMsT0FBSztBQUNISixVQUFNLFFBREg7QUFFSEMsYUFBUyxJQUZOO0FBR0hDLGNBQVUsSUFIUDtBQUlIQyxjQUFVO0FBSlA7QUFQWSxDQUFuQjs7QUFlQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBNkJNRSxVOzs7QUFDSix3QkFBMEI7QUFBQSxRQUFkQyxPQUFjLHVFQUFK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RDs7Ozs7a0JBR1k3QixVIiwiZmlsZSI6IlNvY2tldFNlbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuaW1wb3J0IHsgb3Bjb2RlcywgZW5jb2RlcnMsIGRlY29kZXJzIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzL3dzVXRpbHMnO1xuXG5jb25zdCBwYXJhbWV0ZXJzID0ge1xuICBwb3J0OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDgwMDAsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIHVybDoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH1cbn1cblxuLyoqXG4gKlxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBldmVudEluID0gbmV3IGxmby5zb3VyY2UuRXZlbnRJbih7XG4gKiAgIGZyYW1lVHlwZTogJ3ZlY3RvcicsXG4gKiAgIGZyYW1lU2l6ZTogMixcbiAqICAgZnJhbWVSYXRlOiAxLFxuICogfSk7XG4gKlxuICogY29uc3Qgc29ja2V0U2VuZCA9IG5ldyBsZm8uc2luay5Tb2NrZXRTZW5kKHtcbiAqICAgcG9ydDogMzAwMFxuICogfSk7XG4gKlxuICogZXZlbnRJbi5jb25uZWN0KHNvY2tldFNlbmQpO1xuICpcbiAqIGV2ZW50SW4uaW5pdCgpLnRoZW4oKCkgPT4ge1xuICogICBldmVudEluLnN0YXJ0KCk7XG4gKlxuICogICBsZXQgdGltZSA9IDA7XG4gKlxuICogICAoZnVuY3Rpb24gY3JlYXRlRnJhbWUoKSB7XG4gKiAgICAgZXZlbnRJbi5wcm9jZXNzKHRpbWUsIFtNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpXSwgeyB0ZXN0OiB0cnVlIH0pO1xuICogICAgIHRpbWUgKz0gMTtcbiAqXG4gKiAgICAgc2V0VGltZW91dChjcmVhdGVGcmFtZSwgMTAwMCk7XG4gKiAgIH0oKSk7XG4gKiB9KTtcbiAqL1xuY2xhc3MgU29ja2V0U2VuZCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihwYXJhbWV0ZXJzLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IHByb3RvY29sID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sLnJlcGxhY2UoL15odHRwLywgJ3dzJyk7XG4gICAgY29uc3QgYWRkcmVzcyA9IHRoaXMucGFyYW1zLmdldCgndXJsJykgfHzCoHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZTtcbiAgICBjb25zdCBwb3J0ID0gdGhpcy5wYXJhbXMuZ2V0KCdwb3J0JykgfHwgJyc7IC8vIGV2ZXJ5dGhpbmcgZmFsc3kgYmVjb21lcyAnJ1xuICAgIGNvbnN0IHNvY2tldEFkZHJlc3MgPSBgJHtwcm90b2NvbH0vLyR7YWRkcmVzc306JHtwb3J0fWA7XG5cbiAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQoc29ja2V0QWRkcmVzcyk7XG4gICAgdGhpcy5zb2NrZXQuYmluYXJ5VHlwZSA9ICdhcnJheWJ1ZmZlcic7XG5cbiAgICB0aGlzLm9wZW5lZFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnNvY2tldC5vbm9wZW4gPSByZXNvbHZlO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zb2NrZXQub25lcnJvciA9IChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKTtcbiAgfVxuXG4gIGluaXRNb2R1bGUoKSB7XG4gICAgLy8gc2VuZCBhIElOSVRfTU9EVUxFX1JFUSBhbmQgd2FpdCBmb3IgSU5JVF9NT0RVTEVfQUNLXG4gICAgLy8gbm8gbmVlZCB0byBnZXQgY2hpbGRyZW4gcHJvbWlzZXMgYXMgd2UgYXJlIGluIGEgbGVlZlxuICAgIHJldHVybiB0aGlzLm9wZW5lZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB0aGlzLnNvY2tldC5vbm1lc3NhZ2UgPSAoZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG9wY29kZSA9IGRlY29kZXJzLm9wY29kZShlLmRhdGEpO1xuXG4gICAgICAgICAgaWYgKG9wY29kZSA9PT0gb3Bjb2Rlcy5JTklUX01PRFVMRV9BQ0spXG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBidWZmZXIgPSBlbmNvZGVycy5pbml0TW9kdWxlUmVxKCk7XG4gICAgICAgIHRoaXMuc29ja2V0LnNlbmQoYnVmZmVyKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgc3VwZXIucHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIGNvbnN0IGJ1ZmZlciA9IGVuY29kZXJzLnN0cmVhbVBhcmFtcyh0aGlzLnN0cmVhbVBhcmFtcyk7XG4gICAgdGhpcy5zb2NrZXQuc2VuZChidWZmZXIpO1xuICB9XG5cbiAgcmVzZXRTdHJlYW0oKSB7XG4gICAgc3VwZXIucmVzZXRTdHJlYW0oKTtcblxuICAgIGNvbnN0IGJ1ZmZlciA9IGVuY29kZXJzLnJlc2V0U3RyZWFtKCk7XG4gICAgdGhpcy5zb2NrZXQuc2VuZChidWZmZXIpO1xuICB9XG5cbiAgICAvKiogQHByaXZhdGUgKi9cbiAgZmluYWxpemVTdHJlYW0oZW5kVGltZSkge1xuICAgIHN1cGVyLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuXG4gICAgY29uc3QgYnVmZmVyID0gZW5jb2RlcnMuZmluYWxpemVTdHJlYW0oZW5kVGltZSk7XG4gICAgdGhpcy5zb2NrZXQuc2VuZChidWZmZXIpO1xuICB9XG5cbiAgLy8gcHJvY2VzcyBhbnkgdHlwZVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NjYWxhcigpIHt9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKCkge31cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTaWduYWwoKSB7fVxuXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB0aGlzLmZyYW1lLnRpbWUgPSBmcmFtZS50aW1lO1xuICAgIHRoaXMuZnJhbWUuZGF0YS5zZXQoZnJhbWUuZGF0YSwgMCk7XG4gICAgdGhpcy5mcmFtZS5tZXRhZGF0YSA9IGZyYW1lLm1ldGFkYXRhO1xuXG4gICAgY29uc3QgYnVmZmVyID0gZW5jb2RlcnMucHJvY2Vzc0ZyYW1lKHRoaXMuZnJhbWUsIGZyYW1lU2l6ZSk7XG4gICAgdGhpcy5zb2NrZXQuc2VuZChidWZmZXIpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNvY2tldFNlbmQ7XG4iXX0=