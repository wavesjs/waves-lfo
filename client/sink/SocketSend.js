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
 * Send an lfo frame as a socket message to a `node.source.SocketReceive`
 * instance.
 *
 * <p class="warning">Experimental</p>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvY2tldFNlbmQuanMiXSwibmFtZXMiOlsicGFyYW1ldGVycyIsInBvcnQiLCJ0eXBlIiwiZGVmYXVsdCIsIm51bGxhYmxlIiwiY29uc3RhbnQiLCJ1cmwiLCJTb2NrZXRTZW5kIiwib3B0aW9ucyIsInByb3RvY29sIiwid2luZG93IiwibG9jYXRpb24iLCJyZXBsYWNlIiwiYWRkcmVzcyIsInBhcmFtcyIsImdldCIsImhvc3RuYW1lIiwic29ja2V0QWRkcmVzcyIsInNvY2tldCIsIldlYlNvY2tldCIsImJpbmFyeVR5cGUiLCJvcGVuZWRQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIm9ub3BlbiIsIm9uZXJyb3IiLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJzdGFjayIsInRoZW4iLCJvbm1lc3NhZ2UiLCJlIiwib3Bjb2RlIiwiZGF0YSIsIklOSVRfTU9EVUxFX0FDSyIsImJ1ZmZlciIsImluaXRNb2R1bGVSZXEiLCJzZW5kIiwicHJldlN0cmVhbVBhcmFtcyIsInN0cmVhbVBhcmFtcyIsInJlc2V0U3RyZWFtIiwiZW5kVGltZSIsImZpbmFsaXplU3RyZWFtIiwiZnJhbWUiLCJmcmFtZVNpemUiLCJ0aW1lIiwic2V0IiwibWV0YWRhdGEiLCJwcm9jZXNzRnJhbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUEsSUFBTUEsYUFBYTtBQUNqQkMsUUFBTTtBQUNKQyxVQUFNLFNBREY7QUFFSkMsYUFBUyxJQUZMO0FBR0pDLGNBQVUsSUFITjtBQUlKQyxjQUFVO0FBSk4sR0FEVztBQU9qQkMsT0FBSztBQUNISixVQUFNLFFBREg7QUFFSEMsYUFBUyxJQUZOO0FBR0hDLGNBQVUsSUFIUDtBQUlIQyxjQUFVO0FBSlA7QUFQWSxDQUFuQjs7QUFlQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBZ0NNRSxVOzs7QUFDSix3QkFBMEI7QUFBQSxRQUFkQyxPQUFjLHVF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QUFDRDs7Ozs7a0JBR1k3QixVIiwiZmlsZSI6IlNvY2tldFNlbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuaW1wb3J0IHsgb3Bjb2RlcywgZW5jb2RlcnMsIGRlY29kZXJzIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzL3dzVXRpbHMnO1xuXG5jb25zdCBwYXJhbWV0ZXJzID0ge1xuICBwb3J0OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDgwMDAsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIHVybDoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH1cbn1cblxuLyoqXG4gKiBTZW5kIGFuIGxmbyBmcmFtZSBhcyBhIHNvY2tldCBtZXNzYWdlIHRvIGEgYG5vZGUuc291cmNlLlNvY2tldFJlY2VpdmVgXG4gKiBpbnN0YW5jZS5cbiAqXG4gKiA8cCBjbGFzcz1cIndhcm5pbmdcIj5FeHBlcmltZW50YWw8L3A+XG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGV2ZW50SW4gPSBuZXcgbGZvLnNvdXJjZS5FdmVudEluKHtcbiAqICAgZnJhbWVUeXBlOiAndmVjdG9yJyxcbiAqICAgZnJhbWVTaXplOiAyLFxuICogICBmcmFtZVJhdGU6IDEsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBzb2NrZXRTZW5kID0gbmV3IGxmby5zaW5rLlNvY2tldFNlbmQoe1xuICogICBwb3J0OiAzMDAwXG4gKiB9KTtcbiAqXG4gKiBldmVudEluLmNvbm5lY3Qoc29ja2V0U2VuZCk7XG4gKlxuICogZXZlbnRJbi5pbml0KCkudGhlbigoKSA9PiB7XG4gKiAgIGV2ZW50SW4uc3RhcnQoKTtcbiAqXG4gKiAgIGxldCB0aW1lID0gMDtcbiAqXG4gKiAgIChmdW5jdGlvbiBjcmVhdGVGcmFtZSgpIHtcbiAqICAgICBldmVudEluLnByb2Nlc3ModGltZSwgW01hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCldLCB7IHRlc3Q6IHRydWUgfSk7XG4gKiAgICAgdGltZSArPSAxO1xuICpcbiAqICAgICBzZXRUaW1lb3V0KGNyZWF0ZUZyYW1lLCAxMDAwKTtcbiAqICAgfSgpKTtcbiAqIH0pO1xuICovXG5jbGFzcyBTb2NrZXRTZW5kIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgcHJvdG9jb2wgPSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wucmVwbGFjZSgvXmh0dHAvLCAnd3MnKTtcbiAgICBjb25zdCBhZGRyZXNzID0gdGhpcy5wYXJhbXMuZ2V0KCd1cmwnKSB8fMKgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lO1xuICAgIGNvbnN0IHBvcnQgPSB0aGlzLnBhcmFtcy5nZXQoJ3BvcnQnKSB8fCAnJzsgLy8gZXZlcnl0aGluZyBmYWxzeSBiZWNvbWVzICcnXG4gICAgY29uc3Qgc29ja2V0QWRkcmVzcyA9IGAke3Byb3RvY29sfS8vJHthZGRyZXNzfToke3BvcnR9YDtcblxuICAgIHRoaXMuc29ja2V0ID0gbmV3IFdlYlNvY2tldChzb2NrZXRBZGRyZXNzKTtcbiAgICB0aGlzLnNvY2tldC5iaW5hcnlUeXBlID0gJ2FycmF5YnVmZmVyJztcblxuICAgIHRoaXMub3BlbmVkUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuc29ja2V0Lm9ub3BlbiA9IHJlc29sdmU7XG4gICAgfSk7XG5cbiAgICB0aGlzLnNvY2tldC5vbmVycm9yID0gKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spO1xuICB9XG5cbiAgaW5pdE1vZHVsZSgpIHtcbiAgICAvLyBzZW5kIGEgSU5JVF9NT0RVTEVfUkVRIGFuZCB3YWl0IGZvciBJTklUX01PRFVMRV9BQ0tcbiAgICAvLyBubyBuZWVkIHRvIGdldCBjaGlsZHJlbiBwcm9taXNlcyBhcyB3ZSBhcmUgaW4gYSBsZWVmXG4gICAgcmV0dXJuIHRoaXMub3BlbmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHRoaXMuc29ja2V0Lm9ubWVzc2FnZSA9IChlKSA9PiB7XG4gICAgICAgICAgY29uc3Qgb3Bjb2RlID0gZGVjb2RlcnMub3Bjb2RlKGUuZGF0YSk7XG5cbiAgICAgICAgICBpZiAob3Bjb2RlID09PSBvcGNvZGVzLklOSVRfTU9EVUxFX0FDSylcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IGVuY29kZXJzLmluaXRNb2R1bGVSZXEoKTtcbiAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChidWZmZXIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICBzdXBlci5wcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgY29uc3QgYnVmZmVyID0gZW5jb2RlcnMuc3RyZWFtUGFyYW1zKHRoaXMuc3RyZWFtUGFyYW1zKTtcbiAgICB0aGlzLnNvY2tldC5zZW5kKGJ1ZmZlcik7XG4gIH1cblxuICByZXNldFN0cmVhbSgpIHtcbiAgICBzdXBlci5yZXNldFN0cmVhbSgpO1xuXG4gICAgY29uc3QgYnVmZmVyID0gZW5jb2RlcnMucmVzZXRTdHJlYW0oKTtcbiAgICB0aGlzLnNvY2tldC5zZW5kKGJ1ZmZlcik7XG4gIH1cblxuICAgIC8qKiBAcHJpdmF0ZSAqL1xuICBmaW5hbGl6ZVN0cmVhbShlbmRUaW1lKSB7XG4gICAgc3VwZXIuZmluYWxpemVTdHJlYW0oZW5kVGltZSk7XG5cbiAgICBjb25zdCBidWZmZXIgPSBlbmNvZGVycy5maW5hbGl6ZVN0cmVhbShlbmRUaW1lKTtcbiAgICB0aGlzLnNvY2tldC5zZW5kKGJ1ZmZlcik7XG4gIH1cblxuICAvLyBwcm9jZXNzIGFueSB0eXBlXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2NhbGFyKCkge31cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoKSB7fVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbCgpIHt9XG5cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuZnJhbWUudGltZSA9IGZyYW1lLnRpbWU7XG4gICAgdGhpcy5mcmFtZS5kYXRhLnNldChmcmFtZS5kYXRhLCAwKTtcbiAgICB0aGlzLmZyYW1lLm1ldGFkYXRhID0gZnJhbWUubWV0YWRhdGE7XG5cbiAgICBjb25zdCBidWZmZXIgPSBlbmNvZGVycy5wcm9jZXNzRnJhbWUodGhpcy5mcmFtZSwgZnJhbWVTaXplKTtcbiAgICB0aGlzLnNvY2tldC5zZW5kKGJ1ZmZlcik7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU29ja2V0U2VuZDtcbiJdfQ==