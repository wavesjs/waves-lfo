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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvSW5CdWZmZXIuanMiXSwibmFtZXMiOlsid3NVdGlscyIsInBhcmFtZXRlcnMiLCJwb3J0IiwidHlwZSIsImRlZmF1bHQiLCJjb25zdGFudCIsIm51bGxhYmxlIiwic2VydmVyIiwiV2ViU29ja2V0Iiwib3B0aW9ucyIsIl9vbkNvbm5lY3Rpb24iLCJiaW5kIiwiX2Rpc3BhdGNoIiwid3NzIiwicGFyYW1zIiwiZ2V0Iiwib24iLCJwcmV2U3RyZWFtUGFyYW1zIiwiY29uc29sZSIsImxvZyIsImZyYW1lIiwiZGF0YSIsImZpbGwiLCJlbmRUaW1lIiwicHJlcGFyZUZyYW1lIiwib3V0cHV0IiwiaSIsImwiLCJzdHJlYW1QYXJhbXMiLCJmcmFtZVNpemUiLCJ0aW1lIiwibWV0YWRhdGEiLCJwcm9wYWdhdGVGcmFtZSIsInNvY2tldCIsImFiIiwib3Bjb2RlIiwiVWludDE2QXJyYXkiLCJwYXlsb2FkIiwic2xpY2UiLCJVaW50MTZBcnJheTJqc29uIiwicHJvY2Vzc1N0cmVhbVBhcmFtcyIsInJlc2V0U3RyZWFtIiwiRmxvYXQ2NEFycmF5IiwiZmluYWxpemVTdHJlYW0iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7O0lBQVlBLE87Ozs7OztBQUdaLElBQU1DLGFBQWE7QUFDakJDLFFBQU07QUFDSkMsVUFBTSxTQURGO0FBRUpDLGFBQVMsSUFGTDtBQUdKQyxjQUFVLElBSE47QUFJSkMsY0FBVTtBQUpOLEdBRFc7QUFPakJDLFVBQVE7QUFDTkosVUFBTSxLQURBO0FBRU5DLGFBQVMsSUFGSDtBQUdOQyxjQUFVLElBSEo7QUFJTkMsY0FBVTtBQUpKO0FBUFMsQ0FBbkI7O0FBZUE7Ozs7OztJQUtNRSxTOzs7QUFDSix1QkFBMEI7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFBQSw0SUFDbEJSLFVBRGtCLEVBQ05RLE9BRE07O0FBR3hCLFVBQUtDLGFBQUwsR0FBcUIsTUFBS0EsYUFBTCxDQUFtQkMsSUFBbkIsT0FBckI7QUFDQTtBQUNBLFVBQUtDLFNBQUwsR0FBaUIsTUFBS0EsU0FBTCxDQUFlRCxJQUFmLE9BQWpCOztBQUVBLFVBQUtFLEdBQUwsR0FBVyxzQ0FBZ0IsTUFBS0MsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE1BQWhCLENBQWhCLENBQVg7QUFDQSxVQUFLRixHQUFMLENBQVNHLEVBQVQsQ0FBWSxZQUFaLEVBQTBCLE1BQUtOLGFBQS9CO0FBQ0E7QUFUd0I7QUFVekI7Ozs7d0NBRW1CTyxnQixFQUFrQjtBQUNwQyxzSkFBMEJBLGdCQUExQjtBQUNBQyxjQUFRQyxHQUFSLENBQVkscUJBQVo7QUFDRDs7O2tDQUVhO0FBQ1osV0FBS0MsS0FBTCxDQUFXQyxJQUFYLENBQWdCQyxJQUFoQixDQUFxQixDQUFyQjtBQUNBSixjQUFRQyxHQUFSLENBQVksYUFBWjtBQUNEOzs7bUNBRWNJLE8sRUFBUztBQUN0QkwsY0FBUUMsR0FBUixDQUFZLGdCQUFaLEVBQThCSSxPQUE5QjtBQUNBLGlKQUFxQkEsT0FBckI7QUFDRDs7QUFFRDtBQUNBOzs7O29DQUNnQixDQUFFO0FBQ2xCOzs7O29DQUNnQixDQUFFO0FBQ2xCOzs7O29DQUNnQixDQUFFOztBQUVsQjs7OztpQ0FDYUgsSyxFQUFPO0FBQ2xCLFdBQUtJLFlBQUw7O0FBRUEsVUFBTUMsU0FBUyxLQUFLTCxLQUFwQjtBQUNBO0FBQ0E7QUFDQSxXQUFLLElBQUlNLElBQUksQ0FBUixFQUFXQyxJQUFJLEtBQUtDLFlBQUwsQ0FBa0JDLFNBQXRDLEVBQWlESCxJQUFJQyxDQUFyRCxFQUF3REQsR0FBeEQ7QUFDRUQsZUFBT0osSUFBUCxDQUFZSyxDQUFaLElBQWlCTixNQUFNQyxJQUFOLENBQVdLLENBQVgsQ0FBakI7QUFERixPQUdBRCxPQUFPSyxJQUFQLEdBQWNWLE1BQU1VLElBQXBCO0FBQ0FMLGFBQU9NLFFBQVAsR0FBa0JYLE1BQU1XLFFBQXhCOztBQUVBLFdBQUtDLGNBQUw7QUFDRDs7O2tDQUdhQyxNLEVBQVE7QUFDcEJBLGFBQU9qQixFQUFQLENBQVUsU0FBVixFQUFxQixLQUFLSixTQUExQjtBQUNEOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7OEJBS1VzQixFLEVBQUk7QUFDWixVQUFNQyxTQUFTLElBQUlDLFdBQUosQ0FBZ0JGLEVBQWhCLEVBQW9CLENBQXBCLENBQWYsQ0FEWSxDQUMyQjtBQUN2Q2hCLGNBQVFDLEdBQVIsQ0FBWSxVQUFaLEVBQXdCZ0IsTUFBeEI7O0FBRUEsY0FBUUEsTUFBUjtBQUNFO0FBQ0EsYUFBSyxDQUFMO0FBQ0UsY0FBTUUsVUFBVSxJQUFJRCxXQUFKLENBQWdCRixHQUFHSSxLQUFILENBQVMsQ0FBVCxDQUFoQixDQUFoQjtBQUNBLGNBQU1yQixtQkFBbUJqQixRQUFRdUMsZ0JBQVIsQ0FBeUJGLE9BQXpCLENBQXpCO0FBQ0EsZUFBS0csbUJBQUwsQ0FBeUJ2QixnQkFBekI7QUFDQTtBQUNGO0FBQ0EsYUFBSyxDQUFMO0FBQ0UsZUFBS3dCLFdBQUw7QUFDQTtBQUNGO0FBQ0EsYUFBSyxDQUFMO0FBQ0UsY0FBTWxCLFVBQVUsSUFBSW1CLFlBQUosQ0FBaUJSLEdBQUdJLEtBQUgsQ0FBUyxDQUFULENBQWpCLEVBQThCLENBQTlCLENBQWhCO0FBQ0FwQixrQkFBUUMsR0FBUixDQUFZSSxPQUFaO0FBQ0EsZUFBS29CLGNBQUwsQ0FBb0JwQixPQUFwQjtBQUNBO0FBQ0YsYUFBSyxDQUFMOztBQUVFO0FBbkJKO0FBcUJEOzs7OztrQkFHWWYsUyIsImZpbGUiOiJBdWRpb0luQnVmZmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcbmltcG9ydCB7IHdzU2VydmVyRmFjdG9yeSB9IGZyb20gJy4uL3V0aWxzL3dzU2VydmVyRmFjdG9yeSc7XG5pbXBvcnQgKiBhcyB3c1V0aWxzIGZyb20gJy4uLy4uL2NvbW1vbi91dGlscy93c1V0aWxzJztcblxuXG5jb25zdCBwYXJhbWV0ZXJzID0ge1xuICBwb3J0OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDgwMDAsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gIH0sXG59O1xuXG4vKipcbiAqXG4gKlxuICpcbiAqL1xuY2xhc3MgV2ViU29ja2V0IGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fb25Db25uZWN0aW9uID0gdGhpcy5fb25Db25uZWN0aW9uLmJpbmQodGhpcyk7XG4gICAgLy8gdGhpcy5fb25EaXNjb25uZWN0ID0gdGhpcy5fb25EaXNjb25uZWN0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5fZGlzcGF0Y2ggPSB0aGlzLl9kaXNwYXRjaC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy53c3MgPSB3c1NlcnZlckZhY3RvcnkodGhpcy5wYXJhbXMuZ2V0KCdwb3J0JykpO1xuICAgIHRoaXMud3NzLm9uKCdjb25uZWN0aW9uJywgdGhpcy5fb25Db25uZWN0aW9uKTtcbiAgICAvLyB0aGlzLndzcy5vbignZGlzY29ubmVjdCcsIHRoaXMuX29uRGlzY29ubmVjdCk7IC8vIGRvZXNuJ3QgZXhpc3RzID9cbiAgfVxuXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHN1cGVyLnByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG4gICAgY29uc29sZS5sb2coJ3Byb2Nlc3NTdHJlYW1QYXJhbXMnKTtcbiAgfVxuXG4gIHJlc2V0U3RyZWFtKCkge1xuICAgIHRoaXMuZnJhbWUuZGF0YS5maWxsKDApO1xuICAgIGNvbnNvbGUubG9nKCdyZXNldFN0cmVhbScpO1xuICB9XG5cbiAgZmluYWxpemVTdHJlYW0oZW5kVGltZSkge1xuICAgIGNvbnNvbGUubG9nKCdmaW5hbGl6ZVN0cmVhbScsIGVuZFRpbWUpO1xuICAgIHN1cGVyLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICB9XG5cbiAgLy8gcHJvY2VzcyBhbnkgdHlwZVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NjYWxhcigpIHt9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKCkge31cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTaWduYWwoKSB7fVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgICB0aGlzLnByZXBhcmVGcmFtZSgpO1xuXG4gICAgY29uc3Qgb3V0cHV0ID0gdGhpcy5mcmFtZTtcbiAgICAvLyBwdWxsIGludGVyZmFjZSAod2UgY29weSBkYXRhIHNpbmNlIHdlIGRvbid0IGtub3cgd2hhdCBjb3VsZFxuICAgIC8vIGJlIGRvbmUgb3V0c2lkZSB0aGUgZ3JhcGgpXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7IGkgPCBsOyBpKyspXG4gICAgICBvdXRwdXQuZGF0YVtpXSA9IGZyYW1lLmRhdGFbaV07XG5cbiAgICBvdXRwdXQudGltZSA9IGZyYW1lLnRpbWU7XG4gICAgb3V0cHV0Lm1ldGFkYXRhID0gZnJhbWUubWV0YWRhdGE7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZUZyYW1lKCk7XG4gIH1cblxuXG4gIF9vbkNvbm5lY3Rpb24oc29ja2V0KSB7XG4gICAgc29ja2V0Lm9uKCdtZXNzYWdlJywgdGhpcy5fZGlzcGF0Y2gpO1xuICB9XG5cbiAgLy8gX29uRGlzY29ubmVjdChzb2NrZXQpIHtcbiAgLy8gICBjb25zb2xlLmxvZygnZGlzY29ubmVjdCcsIHNvY2tldCk7XG4gIC8vIH1cblxuICAvKipcbiAgICpcbiAgICogY29kZSAxIGJ5dGVzXG4gICAqXG4gICAqL1xuICBfZGlzcGF0Y2goYWIpIHtcbiAgICBjb25zdCBvcGNvZGUgPSBuZXcgVWludDE2QXJyYXkoYWIpWzBdOyAvLyAxIGJ5dGVzIGZvciBvcGNvZGUsIDEgZGVhZCBieXRlXG4gICAgY29uc29sZS5sb2coJ1tvcGNvZGVdJywgb3Bjb2RlKTtcblxuICAgIHN3aXRjaCAob3Bjb2RlKSB7XG4gICAgICAvLyBwcm9jZXNzU3RyZWFtUGFyYW1zIDogICBbMSBieXRlIGZvciBvcGNvZGUsIHggYnl0ZXMgZm9yIHBheWxvYWRdXG4gICAgICBjYXNlIDA6XG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBuZXcgVWludDE2QXJyYXkoYWIuc2xpY2UoMikpO1xuICAgICAgICBjb25zdCBwcmV2U3RyZWFtUGFyYW1zID0gd3NVdGlscy5VaW50MTZBcnJheTJqc29uKHBheWxvYWQpO1xuICAgICAgICB0aGlzLnByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gcmVzZXRTdHJlYW1cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgdGhpcy5yZXNldFN0cmVhbSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIGZpbmFsaXplU3RyZWFtXG4gICAgICBjYXNlIDI6XG4gICAgICAgIGNvbnN0IGVuZFRpbWUgPSBuZXcgRmxvYXQ2NEFycmF5KGFiLnNsaWNlKDIpKVswXTtcbiAgICAgICAgY29uc29sZS5sb2coZW5kVGltZSk7XG4gICAgICAgIHRoaXMuZmluYWxpemVTdHJlYW0oZW5kVGltZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBXZWJTb2NrZXQ7XG4iXX0=