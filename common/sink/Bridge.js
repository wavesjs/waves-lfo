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

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../common/core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  processFrame: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' }
  },
  finalizeStream: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Create a bridge between the graph and application logic. Handle `push`
 * and `pull` paradigms.
 *
 * This sink can handle any type of input (`signal`, `vector`, `scalar`)
 *
 * @memberof module:common.sink
 *
 * @param {Object} options - Override default parameters.
 * @param {Function} [options.processFrame=null] - Callback executed on each
 *  `processFrame` call.
 * @param {Function} [options.finalizeStream=null] - Callback executed on each
 *  `finalizeStream` call.
 *
 * @see {@link module:common.core.BaseLfo#processFrame}
 * @see {@link module:common.core.BaseLfo#processStreamParams}
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const frames = [
 *  { time: 0, data: [0, 1] },
 *  { time: 1, data: [1, 2] },
 * ];
 *
 * const eventIn = new EventIn({
 *   frameType: 'vector',
 *   frameSize: 2,
 *   frameRate: 1,
 * });
 *
 * const bridge = new Bridge({
 *   processFrame: (frame) => console.log(frame),
 * });
 *
 * eventIn.connect(bridge);
 * eventIn.start();
 *
 * // callback executed on each frame
 * eventIn.processFrame(frame[0]);
 * > { time: 0, data: [0, 1] }
 * eventIn.processFrame(frame[1]);
 * > { time: 1, data: [1, 2] }
 *
 * // pull current frame when needed
 * console.log(bridge.frame);
 * > { time: 1, data: [1, 2] }
 */

var Bridge = function (_BaseLfo) {
  (0, _inherits3.default)(Bridge, _BaseLfo);

  function Bridge() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Bridge);
    return (0, _possibleConstructorReturn3.default)(this, (Bridge.__proto__ || (0, _getPrototypeOf2.default)(Bridge)).call(this, definitions, options));
  }

  /** @private */


  (0, _createClass3.default)(Bridge, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);
      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'finalizeStream',
    value: function finalizeStream(endTime) {
      var finalizeStreamCallback = this.params.get('finalizeStream');

      if (finalizeStreamCallback !== null) finalizeStreamCallback(endTime);
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

      var processFrameCallback = this.params.get('processFrame');
      var output = this.frame;
      output.data = new Float32Array(this.streamParams.frameSize);
      // pull interface (we copy data since we don't know what could
      // be done outside the graph)
      for (var i = 0; i < this.streamParams.frameSize; i++) {
        output.data[i] = frame.data[i];
      }output.time = frame.time;
      output.metadata = frame.metadata;

      // `push` interface
      if (processFrameCallback !== null) processFrameCallback(output);
    }
  }]);
  return Bridge;
}(_BaseLfo3.default);

exports.default = Bridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJyaWRnZS5qcyJdLCJuYW1lcyI6WyJkZWZpbml0aW9ucyIsInByb2Nlc3NGcmFtZSIsInR5cGUiLCJkZWZhdWx0IiwibnVsbGFibGUiLCJtZXRhcyIsImtpbmQiLCJmaW5hbGl6ZVN0cmVhbSIsIkJyaWRnZSIsIm9wdGlvbnMiLCJwcmV2U3RyZWFtUGFyYW1zIiwicHJlcGFyZVN0cmVhbVBhcmFtcyIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsImVuZFRpbWUiLCJmaW5hbGl6ZVN0cmVhbUNhbGxiYWNrIiwicGFyYW1zIiwiZ2V0IiwiZnJhbWUiLCJwcmVwYXJlRnJhbWUiLCJwcm9jZXNzRnJhbWVDYWxsYmFjayIsIm91dHB1dCIsImRhdGEiLCJGbG9hdDMyQXJyYXkiLCJzdHJlYW1QYXJhbXMiLCJmcmFtZVNpemUiLCJpIiwidGltZSIsIm1ldGFkYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFNQSxjQUFjO0FBQ2xCQyxnQkFBYztBQUNaQyxVQUFNLEtBRE07QUFFWkMsYUFBUyxJQUZHO0FBR1pDLGNBQVUsSUFIRTtBQUlaQyxXQUFPLEVBQUVDLE1BQU0sU0FBUjtBQUpLLEdBREk7QUFPbEJDLGtCQUFnQjtBQUNkTCxVQUFNLEtBRFE7QUFFZEMsYUFBUyxJQUZLO0FBR2RDLGNBQVUsSUFISTtBQUlkQyxXQUFPLEVBQUVDLE1BQU0sU0FBUjtBQUpPO0FBUEUsQ0FBcEI7O0FBZUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnRE1FLE07OztBQUNKLG9CQUEwQjtBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTtBQUFBO0FBQUEsaUlBQ2xCVCxXQURrQixFQUNMUyxPQURLO0FBRXpCOztBQUVEOzs7Ozt3Q0FDb0JDLGdCLEVBQWtCO0FBQ3BDLFdBQUtDLG1CQUFMLENBQXlCRCxnQkFBekI7QUFDQSxXQUFLRSxxQkFBTDtBQUNEOztBQUVEOzs7O21DQUNlQyxPLEVBQVM7QUFDdEIsVUFBTUMseUJBQXlCLEtBQUtDLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixnQkFBaEIsQ0FBL0I7O0FBRUEsVUFBSUYsMkJBQTJCLElBQS9CLEVBQ0VBLHVCQUF1QkQsT0FBdkI7QUFDSDs7QUFFRDtBQUNBOzs7O29DQUNnQixDQUFFO0FBQ2xCOzs7O29DQUNnQixDQUFFO0FBQ2xCOzs7O29DQUNnQixDQUFFOztBQUVsQjs7OztpQ0FDYUksSyxFQUFPO0FBQ2xCLFdBQUtDLFlBQUw7O0FBRUEsVUFBTUMsdUJBQXVCLEtBQUtKLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixjQUFoQixDQUE3QjtBQUNBLFVBQU1JLFNBQVMsS0FBS0gsS0FBcEI7QUFDQUcsYUFBT0MsSUFBUCxHQUFjLElBQUlDLFlBQUosQ0FBaUIsS0FBS0MsWUFBTCxDQUFrQkMsU0FBbkMsQ0FBZDtBQUNBO0FBQ0E7QUFDQSxXQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSSxLQUFLRixZQUFMLENBQWtCQyxTQUF0QyxFQUFpREMsR0FBakQ7QUFDRUwsZUFBT0MsSUFBUCxDQUFZSSxDQUFaLElBQWlCUixNQUFNSSxJQUFOLENBQVdJLENBQVgsQ0FBakI7QUFERixPQUdBTCxPQUFPTSxJQUFQLEdBQWNULE1BQU1TLElBQXBCO0FBQ0FOLGFBQU9PLFFBQVAsR0FBa0JWLE1BQU1VLFFBQXhCOztBQUVBO0FBQ0EsVUFBSVIseUJBQXlCLElBQTdCLEVBQ0VBLHFCQUFxQkMsTUFBckI7QUFDSDs7Ozs7a0JBR1laLE0iLCJmaWxlIjoiQnJpZGdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29tbW9uL2NvcmUvQmFzZUxmbyc7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBwcm9jZXNzRnJhbWU6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICBmaW5hbGl6ZVN0cmVhbToge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIGJyaWRnZSBiZXR3ZWVuIHRoZSBncmFwaCBhbmQgYXBwbGljYXRpb24gbG9naWMuIEhhbmRsZSBgcHVzaGBcbiAqIGFuZCBgcHVsbGAgcGFyYWRpZ21zLlxuICpcbiAqIFRoaXMgc2luayBjYW4gaGFuZGxlIGFueSB0eXBlIG9mIGlucHV0IChgc2lnbmFsYCwgYHZlY3RvcmAsIGBzY2FsYXJgKVxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLnNpbmtcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLnByb2Nlc3NGcmFtZT1udWxsXSAtIENhbGxiYWNrIGV4ZWN1dGVkIG9uIGVhY2hcbiAqICBgcHJvY2Vzc0ZyYW1lYCBjYWxsLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuZmluYWxpemVTdHJlYW09bnVsbF0gLSBDYWxsYmFjayBleGVjdXRlZCBvbiBlYWNoXG4gKiAgYGZpbmFsaXplU3RyZWFtYCBjYWxsLlxuICpcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NGcmFtZX1cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiBjb25zdCBmcmFtZXMgPSBbXG4gKiAgeyB0aW1lOiAwLCBkYXRhOiBbMCwgMV0gfSxcbiAqICB7IHRpbWU6IDEsIGRhdGE6IFsxLCAyXSB9LFxuICogXTtcbiAqXG4gKiBjb25zdCBldmVudEluID0gbmV3IEV2ZW50SW4oe1xuICogICBmcmFtZVR5cGU6ICd2ZWN0b3InLFxuICogICBmcmFtZVNpemU6IDIsXG4gKiAgIGZyYW1lUmF0ZTogMSxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGJyaWRnZSA9IG5ldyBCcmlkZ2Uoe1xuICogICBwcm9jZXNzRnJhbWU6IChmcmFtZSkgPT4gY29uc29sZS5sb2coZnJhbWUpLFxuICogfSk7XG4gKlxuICogZXZlbnRJbi5jb25uZWN0KGJyaWRnZSk7XG4gKiBldmVudEluLnN0YXJ0KCk7XG4gKlxuICogLy8gY2FsbGJhY2sgZXhlY3V0ZWQgb24gZWFjaCBmcmFtZVxuICogZXZlbnRJbi5wcm9jZXNzRnJhbWUoZnJhbWVbMF0pO1xuICogPiB7IHRpbWU6IDAsIGRhdGE6IFswLCAxXSB9XG4gKiBldmVudEluLnByb2Nlc3NGcmFtZShmcmFtZVsxXSk7XG4gKiA+IHsgdGltZTogMSwgZGF0YTogWzEsIDJdIH1cbiAqXG4gKiAvLyBwdWxsIGN1cnJlbnQgZnJhbWUgd2hlbiBuZWVkZWRcbiAqIGNvbnNvbGUubG9nKGJyaWRnZS5mcmFtZSk7XG4gKiA+IHsgdGltZTogMSwgZGF0YTogWzEsIDJdIH1cbiAqL1xuY2xhc3MgQnJpZGdlIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBmaW5hbGl6ZVN0cmVhbShlbmRUaW1lKSB7XG4gICAgY29uc3QgZmluYWxpemVTdHJlYW1DYWxsYmFjayA9IHRoaXMucGFyYW1zLmdldCgnZmluYWxpemVTdHJlYW0nKTtcblxuICAgIGlmIChmaW5hbGl6ZVN0cmVhbUNhbGxiYWNrICE9PSBudWxsKVxuICAgICAgZmluYWxpemVTdHJlYW1DYWxsYmFjayhlbmRUaW1lKTtcbiAgfVxuXG4gIC8vIHByb2Nlc3MgYW55IHR5cGVcbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTY2FsYXIoKSB7fVxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcigpIHt9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKCkge31cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgdGhpcy5wcmVwYXJlRnJhbWUoKTtcblxuICAgIGNvbnN0IHByb2Nlc3NGcmFtZUNhbGxiYWNrID0gdGhpcy5wYXJhbXMuZ2V0KCdwcm9jZXNzRnJhbWUnKTtcbiAgICBjb25zdCBvdXRwdXQgPSB0aGlzLmZyYW1lO1xuICAgIG91dHB1dC5kYXRhID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUpO1xuICAgIC8vIHB1bGwgaW50ZXJmYWNlICh3ZSBjb3B5IGRhdGEgc2luY2Ugd2UgZG9uJ3Qga25vdyB3aGF0IGNvdWxkXG4gICAgLy8gYmUgZG9uZSBvdXRzaWRlIHRoZSBncmFwaClcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTsgaSsrKVxuICAgICAgb3V0cHV0LmRhdGFbaV0gPSBmcmFtZS5kYXRhW2ldO1xuXG4gICAgb3V0cHV0LnRpbWUgPSBmcmFtZS50aW1lO1xuICAgIG91dHB1dC5tZXRhZGF0YSA9IGZyYW1lLm1ldGFkYXRhO1xuXG4gICAgLy8gYHB1c2hgIGludGVyZmFjZVxuICAgIGlmIChwcm9jZXNzRnJhbWVDYWxsYmFjayAhPT0gbnVsbClcbiAgICAgIHByb2Nlc3NGcmFtZUNhbGxiYWNrKG91dHB1dCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnJpZGdlO1xuIl19