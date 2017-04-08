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
    key: 'start',
    value: function start() {
      if (this.initialized === false) {
        if (this.initPromise === null) // init has not yet been called
          this.initPromise = this.init();

        this.initPromise.then(this.start);
        return;
      }

      this.started = true;
    }
  }, {
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
      (0, _get3.default)(WebSocket.prototype.__proto__ || (0, _getPrototypeOf2.default)(WebSocket.prototype), 'finalizeStream', this).call(this, endTime);
      console.log('finalizeStream', endTime);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldlYlNvY2tldC5qcyJdLCJuYW1lcyI6WyJ3c1V0aWxzIiwicGFyYW1ldGVycyIsInBvcnQiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwibnVsbGFibGUiLCJzZXJ2ZXIiLCJXZWJTb2NrZXQiLCJvcHRpb25zIiwiX29uQ29ubmVjdGlvbiIsImJpbmQiLCJfZGlzcGF0Y2giLCJ3c3MiLCJwYXJhbXMiLCJnZXQiLCJvbiIsImluaXRpYWxpemVkIiwiaW5pdFByb21pc2UiLCJpbml0IiwidGhlbiIsInN0YXJ0Iiwic3RhcnRlZCIsInByZXZTdHJlYW1QYXJhbXMiLCJjb25zb2xlIiwibG9nIiwiZnJhbWUiLCJkYXRhIiwiZmlsbCIsImVuZFRpbWUiLCJwcmVwYXJlRnJhbWUiLCJvdXRwdXQiLCJpIiwibCIsInN0cmVhbVBhcmFtcyIsImZyYW1lU2l6ZSIsInRpbWUiLCJtZXRhZGF0YSIsInByb3BhZ2F0ZUZyYW1lIiwic29ja2V0IiwiYWIiLCJvcGNvZGUiLCJVaW50MTZBcnJheSIsInBheWxvYWQiLCJzbGljZSIsIlVpbnQxNkFycmF5Mmpzb24iLCJwcm9jZXNzU3RyZWFtUGFyYW1zIiwicmVzZXRTdHJlYW0iLCJGbG9hdDY0QXJyYXkiLCJmaW5hbGl6ZVN0cmVhbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztJQUFZQSxPOzs7Ozs7QUFHWixJQUFNQyxhQUFhO0FBQ2pCQyxRQUFNO0FBQ0pDLFVBQU0sU0FERjtBQUVKQyxhQUFTLElBRkw7QUFHSkMsY0FBVSxJQUhOO0FBSUpDLGNBQVU7QUFKTixHQURXO0FBT2pCQyxVQUFRO0FBQ05KLFVBQU0sS0FEQTtBQUVOQyxhQUFTLElBRkg7QUFHTkMsY0FBVSxJQUhKO0FBSU5DLGNBQVU7QUFKSjtBQVBTLENBQW5COztBQWVBOzs7Ozs7SUFLTUUsUzs7O0FBQ0osdUJBQTBCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJ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LENBQW9CcEIsT0FBcEI7QUFDQTtBQUNGLGFBQUssQ0FBTDs7QUFFRTtBQXJCSjtBQXVCRDs7O0VBekdxQiw2Qzs7a0JBNEdUckIsUyIsImZpbGUiOiJXZWJTb2NrZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuaW1wb3J0IFNvdXJjZU1peGluIGZyb20gJy4uLy4uL2NvcmUvU291cmNlTWl4aW4nO1xuaW1wb3J0IHsgd3NTZXJ2ZXJGYWN0b3J5IH0gZnJvbSAnLi4vdXRpbHMvd3NTZXJ2ZXJGYWN0b3J5JztcbmltcG9ydCAqIGFzIHdzVXRpbHMgZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzL3dzVXRpbHMnO1xuXG5cbmNvbnN0IHBhcmFtZXRlcnMgPSB7XG4gIHBvcnQ6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogODAwMCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgfSxcbn07XG5cbi8qKlxuICpcbiAqXG4gKlxuICovXG5jbGFzcyBXZWJTb2NrZXQgZXh0ZW5kcyBTb3VyY2VNaXhpbihCYXNlTGZvKSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fb25Db25uZWN0aW9uID0gdGhpcy5fb25Db25uZWN0aW9uLmJpbmQodGhpcyk7XG4gICAgLy8gdGhpcy5fb25EaXNjb25uZWN0ID0gdGhpcy5fb25EaXNjb25uZWN0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fZGlzcGF0Y2ggPSB0aGlzLl9kaXNwYXRjaC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy53c3MgPSB3c1NlcnZlckZhY3RvcnkodGhpcy5wYXJhbXMuZ2V0KCdwb3J0JykpO1xuICAgIHRoaXMud3NzLm9uKCdjb25uZWN0aW9uJywgdGhpcy5fb25Db25uZWN0aW9uKTtcbiAgICAvLyB0aGlzLndzcy5vbignZGlzY29ubmVjdCcsIHRoaXMuX29uRGlzY29ubmVjdCk7IC8vIGRvZXNuJ3QgZXhpc3RzID9cbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkID09PSBmYWxzZSkge1xuICAgICAgaWYgKHRoaXMuaW5pdFByb21pc2UgPT09IG51bGwpIC8vIGluaXQgaGFzIG5vdCB5ZXQgYmVlbiBjYWxsZWRcbiAgICAgICAgdGhpcy5pbml0UHJvbWlzZSA9IHRoaXMuaW5pdCgpO1xuXG4gICAgICB0aGlzLmluaXRQcm9taXNlLnRoZW4odGhpcy5zdGFydCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgfVxuXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHN1cGVyLnByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG4gICAgY29uc29sZS5sb2coJ3Byb2Nlc3NTdHJlYW1QYXJhbXMnKTtcbiAgfVxuXG4gIHJlc2V0U3RyZWFtKCkge1xuICAgIHRoaXMuZnJhbWUuZGF0YS5maWxsKDApO1xuICAgIGNvbnNvbGUubG9nKCdyZXNldFN0cmVhbScpO1xuICB9XG5cbiAgZmluYWxpemVTdHJlYW0oZW5kVGltZSkge1xuICAgIHN1cGVyLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICAgIGNvbnNvbGUubG9nKCdmaW5hbGl6ZVN0cmVhbScsIGVuZFRpbWUpO1xuICB9XG5cbiAgLy8gcHJvY2VzcyBhbnkgdHlwZVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NjYWxhcigpIHt9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKCkge31cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTaWduYWwoKSB7fVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgICB0aGlzLnByZXBhcmVGcmFtZSgpO1xuXG4gICAgY29uc3Qgb3V0cHV0ID0gdGhpcy5mcmFtZTtcbiAgICAvLyBwdWxsIGludGVyZmFjZSAod2UgY29weSBkYXRhIHNpbmNlIHdlIGRvbid0IGtub3cgd2hhdCBjb3VsZFxuICAgIC8vIGJlIGRvbmUgb3V0c2lkZSB0aGUgZ3JhcGgpXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7IGkgPCBsOyBpKyspXG4gICAgICBvdXRwdXQuZGF0YVtpXSA9IGZyYW1lLmRhdGFbaV07XG5cbiAgICBvdXRwdXQudGltZSA9IGZyYW1lLnRpbWU7XG4gICAgb3V0cHV0Lm1ldGFkYXRhID0gZnJhbWUubWV0YWRhdGE7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZUZyYW1lKCk7XG4gIH1cblxuXG4gIF9vbkNvbm5lY3Rpb24oc29ja2V0KSB7XG4gICAgc29ja2V0Lm9uKCdtZXNzYWdlJywgdGhpcy5fZGlzcGF0Y2gpO1xuICB9XG5cbiAgLy8gX29uRGlzY29ubmVjdChzb2NrZXQpIHtcbiAgLy8gICBjb25zb2xlLmxvZygnZGlzY29ubmVjdCcsIHNvY2tldCk7XG4gIC8vIH1cblxuICAvKipcbiAgICpcbiAgICogY29kZSAxIGJ5dGVzXG4gICAqXG4gICAqL1xuICBfZGlzcGF0Y2goYWIpIHtcbiAgICBjb25zdCBvcGNvZGUgPSBuZXcgVWludDE2QXJyYXkoYWIpWzBdOyAvLyAxIGJ5dGVzIGZvciBvcGNvZGUsIDEgZGVhZCBieXRlXG4gICAgY29uc29sZS5sb2coJ1tvcGNvZGVdJywgb3Bjb2RlKTtcblxuICAgIHN3aXRjaCAob3Bjb2RlKSB7XG4gICAgICBjYXNlIDA6IC8vIFBJTkdcbiAgICAgICAgLy8gY29uc3RcbiAgICAgIC8vIHByb2Nlc3NTdHJlYW1QYXJhbXMgOiAgIFsxIGJ5dGUgZm9yIG9wY29kZSwgeCBieXRlcyBmb3IgcGF5bG9hZF1cbiAgICAgIGNhc2UgMTogLy8gUE9OR1xuICAgICAgICBjb25zdCBwYXlsb2FkID0gbmV3IFVpbnQxNkFycmF5KGFiLnNsaWNlKDIpKTtcbiAgICAgICAgY29uc3QgcHJldlN0cmVhbVBhcmFtcyA9IHdzVXRpbHMuVWludDE2QXJyYXkyanNvbihwYXlsb2FkKTtcbiAgICAgICAgdGhpcy5wcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHJlc2V0U3RyZWFtXG4gICAgICBjYXNlIDE6XG4gICAgICAgIHRoaXMucmVzZXRTdHJlYW0oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBmaW5hbGl6ZVN0cmVhbVxuICAgICAgY2FzZSAyOlxuICAgICAgICBjb25zdCBlbmRUaW1lID0gbmV3IEZsb2F0NjRBcnJheShhYi5zbGljZSgyKSlbMF07XG4gICAgICAgIGNvbnNvbGUubG9nKGVuZFRpbWUpO1xuICAgICAgICB0aGlzLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcblxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgV2ViU29ja2V0O1xuIl19