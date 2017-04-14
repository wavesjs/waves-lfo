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

var _BaseDisplay2 = require('./BaseDisplay');

var _BaseDisplay3 = _interopRequireDefault(_BaseDisplay2);

var _displayUtils = require('../utils/display-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var floor = Math.floor;
var ceil = Math.ceil;

function downSample(data, targetLength) {
  var length = data.length;
  var hop = length / targetLength;
  var target = new Float32Array(targetLength);
  var counter = 0;

  for (var i = 0; i < targetLength; i++) {
    var index = floor(counter);
    var phase = counter - index;
    var prev = data[index];
    var next = data[index + 1];

    target[i] = (next - prev) * phase + prev;
    counter += hop;
  }

  return target;
}

var definitions = {
  color: {
    type: 'string',
    default: (0, _displayUtils.getColors)('signal'),
    nullable: true
  }
};

/**
 * Display a stream of type `signal` on a canvas.
 *
 * @param {Object} options - Override default parameters.
 * @param {String} [options.color='#00e600'] - Color of the signal.
 * @param {Number} [options.min=-1] - Minimum value represented in the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.max=1] - Maximum value represented in the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.width=300] - Width of the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.height=150] - Height of the canvas.
 *  _dynamic parameter_
 * @param {Element|CSSSelector} [options.container=null] - Container element
 *  in which to insert the canvas. _constant parameter_
 * @param {Element|CSSSelector} [options.canvas=null] - Canvas element
 *  in which to draw. _constant parameter_
 * @param {Number} [options.duration=1] - Duration (in seconds) represented in
 *  the canvas. This parameter only exists for operators that display several
 *  consecutive frames on the canvas. _dynamic parameter_
 * @param {Number} [options.referenceTime=null] - Optionnal reference time the
 *  display should considerer as the origin. Is only usefull when synchronizing
 *  several display using the `DisplaySync` class. This parameter only exists
 *  for operators that display several consecutive frames on the canvas.
 *
 * @memberof module:client.sink
 *
 * @example
 * const eventIn = new lfo.source.EventIn({
 *   frameType: 'signal',
 *   sampleRate: 8,
 *   frameSize: 4,
 * });
 *
 * const signalDisplay = new lfo.sink.SignalDisplay({
 *   canvas: '#signal-canvas',
 * });
 *
 * eventIn.connect(signalDisplay);
 * eventIn.start();
 *
 * // push triangle signal in the graph
 * eventIn.process(0, [0, 0.5, 1, 0.5]);
 * eventIn.process(0.5, [0, -0.5, -1, -0.5]);
 * // ...
 */

var SignalDisplay = function (_BaseDisplay) {
  (0, _inherits3.default)(SignalDisplay, _BaseDisplay);

  function SignalDisplay(options) {
    (0, _classCallCheck3.default)(this, SignalDisplay);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SignalDisplay.__proto__ || (0, _getPrototypeOf2.default)(SignalDisplay)).call(this, definitions, options, true));

    _this.lastPosY = null;
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(SignalDisplay, [{
    key: 'processSignal',
    value: function processSignal(frame, frameWidth, pixelsSinceLastFrame) {
      var color = this.params.get('color');
      var frameSize = this.streamParams.frameSize;
      var ctx = this.ctx;
      var data = frame.data;

      if (frameWidth < frameSize) data = downSample(data, frameWidth);

      var length = data.length;
      var hopX = frameWidth / length;
      var posX = 0;
      var lastY = this.lastPosY;

      ctx.strokeStyle = color;
      ctx.beginPath();

      for (var i = 0; i < data.length; i++) {
        var posY = this.getYPosition(data[i]);

        if (lastY === null) {
          ctx.moveTo(posX, posY);
        } else {
          if (i === 0) ctx.moveTo(-hopX, lastY);

          ctx.lineTo(posX, posY);
        }

        posX += hopX;
        lastY = posY;
      }

      ctx.stroke();
      ctx.closePath();

      this.lastPosY = lastY;
    }
  }]);
  return SignalDisplay;
}(_BaseDisplay3.default);

exports.default = SignalDisplay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNpZ25hbERpc3BsYXkuanMiXSwibmFtZXMiOlsiZmxvb3IiLCJNYXRoIiwiY2VpbCIsImRvd25TYW1wbGUiLCJkYXRhIiwidGFyZ2V0TGVuZ3RoIiwibGVuZ3RoIiwiaG9wIiwidGFyZ2V0IiwiRmxvYXQzMkFycmF5IiwiY291bnRlciIsImkiLCJpbmRleCIsInBoYXNlIiwicHJldiIsIm5leHQiLCJkZWZpbml0aW9ucyIsImNvbG9yIiwidHlwZSIsImRlZmF1bHQiLCJudWxsYWJsZSIsIlNpZ25hbERpc3BsYXkiLCJvcHRpb25zIiwibGFzdFBvc1kiLCJmcmFtZSIsImZyYW1lV2lkdGgiLCJwaXhlbHNTaW5jZUxhc3RGcmFtZSIsInBhcmFtcyIsImdldCIsImZyYW1lU2l6ZSIsInN0cmVhbVBhcmFtcyIsImN0eCIsImhvcFgiLCJwb3NYIiwibGFzdFkiLCJzdHJva2VTdHlsZSIsImJlZ2luUGF0aCIsInBvc1kiLCJnZXRZUG9zaXRpb24iLCJtb3ZlVG8iLCJsaW5lVG8iLCJzdHJva2UiLCJjbG9zZVBhdGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUVBLElBQU1BLFFBQVFDLEtBQUtELEtBQW5CO0FBQ0EsSUFBTUUsT0FBT0QsS0FBS0MsSUFBbEI7O0FBRUEsU0FBU0MsVUFBVCxDQUFvQkMsSUFBcEIsRUFBMEJDLFlBQTFCLEVBQXdDO0FBQ3RDLE1BQU1DLFNBQVNGLEtBQUtFLE1BQXBCO0FBQ0EsTUFBTUMsTUFBTUQsU0FBU0QsWUFBckI7QUFDQSxNQUFNRyxTQUFTLElBQUlDLFlBQUosQ0FBaUJKLFlBQWpCLENBQWY7QUFDQSxNQUFJSyxVQUFVLENBQWQ7O0FBRUEsT0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlOLFlBQXBCLEVBQWtDTSxHQUFsQyxFQUF1QztBQUNyQyxRQUFNQyxRQUFRWixNQUFNVSxPQUFOLENBQWQ7QUFDQSxRQUFNRyxRQUFRSCxVQUFVRSxLQUF4QjtBQUNBLFFBQU1FLE9BQU9WLEtBQUtRLEtBQUwsQ0FBYjtBQUNBLFFBQU1HLE9BQU9YLEtBQUtRLFFBQVEsQ0FBYixDQUFiOztBQUVBSixXQUFPRyxDQUFQLElBQVksQ0FBQ0ksT0FBT0QsSUFBUixJQUFnQkQsS0FBaEIsR0FBd0JDLElBQXBDO0FBQ0FKLGVBQVdILEdBQVg7QUFDRDs7QUFFRCxTQUFPQyxNQUFQO0FBQ0Q7O0FBRUQsSUFBTVEsY0FBYztBQUNsQkMsU0FBTztBQUNMQyxVQUFNLFFBREQ7QUFFTEMsYUFBUyw2QkFBVSxRQUFWLENBRko7QUFHTEMsY0FBVTtBQUhMO0FBRFcsQ0FBcEI7O0FBUUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBOENNQyxhOzs7QUFDSix5QkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUFBLG9KQUNiTixXQURhLEVBQ0FNLE9BREEsRUFDUyxJQURUOztBQUduQixVQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBSG1CO0FBSXBCOztBQUVEOzs7OztrQ0FDY0MsSyxFQUFPQyxVLEVBQVlDLG9CLEVBQXNCO0FBQ3JELFVBQU1ULFFBQVEsS0FBS1UsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE9BQWhCLENBQWQ7QUFDQSxVQUFNQyxZQUFZLEtBQUtDLFlBQUwsQ0FBa0JELFNBQXBDO0FBQ0EsVUFBTUUsTUFBTSxLQUFLQSxHQUFqQjtBQUNBLFVBQUkzQixPQUFPb0IsTUFBTXBCLElBQWpCOztBQUVBLFVBQUlxQixhQUFhSSxTQUFqQixFQUNFekIsT0FBT0QsV0FBV0MsSUFBWCxFQUFpQnFCLFVBQWpCLENBQVA7O0FBRUYsVUFBTW5CLFNBQVNGLEtBQUtFLE1BQXBCO0FBQ0EsVUFBTTBCLE9BQU9QLGFBQWFuQixNQUExQjtBQUNBLFVBQUkyQixPQUFPLENBQVg7QUFDQSxVQUFJQyxRQUFRLEtBQUtYLFFBQWpCOztBQUVBUSxVQUFJSSxXQUFKLEdBQWtCbEIsS0FBbEI7QUFDQWMsVUFBSUssU0FBSjs7QUFFQSxXQUFLLElBQUl6QixJQUFJLENBQWIsRUFBZ0JBLElBQUlQLEtBQUtFLE1BQXpCLEVBQWlDSyxHQUFqQyxFQUFzQztBQUNwQyxZQUFNMEIsT0FBTyxLQUFLQyxZQUFMLENBQWtCbEMsS0FBS08sQ0FBTCxDQUFsQixDQUFiOztBQUVBLFlBQUl1QixVQUFVLElBQWQsRUFBb0I7QUFDbEJILGNBQUlRLE1BQUosQ0FBV04sSUFBWCxFQUFpQkksSUFBakI7QUFDRCxTQUZELE1BRU87QUFDTCxjQUFJMUIsTUFBTSxDQUFWLEVBQ0VvQixJQUFJUSxNQUFKLENBQVcsQ0FBQ1AsSUFBWixFQUFrQkUsS0FBbEI7O0FBRUZILGNBQUlTLE1BQUosQ0FBV1AsSUFBWCxFQUFpQkksSUFBakI7QUFDRDs7QUFFREosZ0JBQVFELElBQVI7QUFDQUUsZ0JBQVFHLElBQVI7QUFDRDs7QUFFRE4sVUFBSVUsTUFBSjtBQUNBVixVQUFJVyxTQUFKOztBQUVBLFdBQUtuQixRQUFMLEdBQWdCVyxLQUFoQjtBQUNEOzs7OztrQkFHWWIsYSIsImZpbGUiOiJTaWduYWxEaXNwbGF5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VEaXNwbGF5IGZyb20gJy4vQmFzZURpc3BsYXknO1xuaW1wb3J0IHsgZ2V0Q29sb3JzIH0gZnJvbSAnLi4vdXRpbHMvZGlzcGxheS11dGlscyc7XG5cbmNvbnN0IGZsb29yID0gTWF0aC5mbG9vcjtcbmNvbnN0IGNlaWwgPSBNYXRoLmNlaWw7XG5cbmZ1bmN0aW9uIGRvd25TYW1wbGUoZGF0YSwgdGFyZ2V0TGVuZ3RoKSB7XG4gIGNvbnN0IGxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuICBjb25zdCBob3AgPSBsZW5ndGggLyB0YXJnZXRMZW5ndGg7XG4gIGNvbnN0IHRhcmdldCA9IG5ldyBGbG9hdDMyQXJyYXkodGFyZ2V0TGVuZ3RoKTtcbiAgbGV0IGNvdW50ZXIgPSAwO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGFyZ2V0TGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBpbmRleCA9IGZsb29yKGNvdW50ZXIpO1xuICAgIGNvbnN0IHBoYXNlID0gY291bnRlciAtIGluZGV4O1xuICAgIGNvbnN0IHByZXYgPSBkYXRhW2luZGV4XTtcbiAgICBjb25zdCBuZXh0ID0gZGF0YVtpbmRleCArIDFdO1xuXG4gICAgdGFyZ2V0W2ldID0gKG5leHQgLSBwcmV2KSAqIHBoYXNlICsgcHJldjtcbiAgICBjb3VudGVyICs9IGhvcDtcbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBjb2xvcjoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6IGdldENvbG9ycygnc2lnbmFsJyksXG4gICAgbnVsbGFibGU6IHRydWUsXG4gIH0sXG59O1xuXG4vKipcbiAqIERpc3BsYXkgYSBzdHJlYW0gb2YgdHlwZSBgc2lnbmFsYCBvbiBhIGNhbnZhcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nIzAwZTYwMCddIC0gQ29sb3Igb2YgdGhlIHNpZ25hbC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5taW49LTFdIC0gTWluaW11bSB2YWx1ZSByZXByZXNlbnRlZCBpbiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXg9MV0gLSBNYXhpbXVtIHZhbHVlIHJlcHJlc2VudGVkIGluIHRoZSBjYW52YXMuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndpZHRoPTMwMF0gLSBXaWR0aCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oZWlnaHQ9MTUwXSAtIEhlaWdodCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY29udGFpbmVyPW51bGxdIC0gQ29udGFpbmVyIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBpbnNlcnQgdGhlIGNhbnZhcy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY2FudmFzPW51bGxdIC0gQ2FudmFzIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBkcmF3LiBfY29uc3RhbnQgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmR1cmF0aW9uPTFdIC0gRHVyYXRpb24gKGluIHNlY29uZHMpIHJlcHJlc2VudGVkIGluXG4gKiAgdGhlIGNhbnZhcy4gVGhpcyBwYXJhbWV0ZXIgb25seSBleGlzdHMgZm9yIG9wZXJhdG9ycyB0aGF0IGRpc3BsYXkgc2V2ZXJhbFxuICogIGNvbnNlY3V0aXZlIGZyYW1lcyBvbiB0aGUgY2FudmFzLiBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucmVmZXJlbmNlVGltZT1udWxsXSAtIE9wdGlvbm5hbCByZWZlcmVuY2UgdGltZSB0aGVcbiAqICBkaXNwbGF5IHNob3VsZCBjb25zaWRlcmVyIGFzIHRoZSBvcmlnaW4uIElzIG9ubHkgdXNlZnVsbCB3aGVuIHN5bmNocm9uaXppbmdcbiAqICBzZXZlcmFsIGRpc3BsYXkgdXNpbmcgdGhlIGBEaXNwbGF5U3luY2AgY2xhc3MuIFRoaXMgcGFyYW1ldGVyIG9ubHkgZXhpc3RzXG4gKiAgZm9yIG9wZXJhdG9ycyB0aGF0IGRpc3BsYXkgc2V2ZXJhbCBjb25zZWN1dGl2ZSBmcmFtZXMgb24gdGhlIGNhbnZhcy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNsaWVudC5zaW5rXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGV2ZW50SW4gPSBuZXcgbGZvLnNvdXJjZS5FdmVudEluKHtcbiAqICAgZnJhbWVUeXBlOiAnc2lnbmFsJyxcbiAqICAgc2FtcGxlUmF0ZTogOCxcbiAqICAgZnJhbWVTaXplOiA0LFxuICogfSk7XG4gKlxuICogY29uc3Qgc2lnbmFsRGlzcGxheSA9IG5ldyBsZm8uc2luay5TaWduYWxEaXNwbGF5KHtcbiAqICAgY2FudmFzOiAnI3NpZ25hbC1jYW52YXMnLFxuICogfSk7XG4gKlxuICogZXZlbnRJbi5jb25uZWN0KHNpZ25hbERpc3BsYXkpO1xuICogZXZlbnRJbi5zdGFydCgpO1xuICpcbiAqIC8vIHB1c2ggdHJpYW5nbGUgc2lnbmFsIGluIHRoZSBncmFwaFxuICogZXZlbnRJbi5wcm9jZXNzKDAsIFswLCAwLjUsIDEsIDAuNV0pO1xuICogZXZlbnRJbi5wcm9jZXNzKDAuNSwgWzAsIC0wLjUsIC0xLCAtMC41XSk7XG4gKiAvLyAuLi5cbiAqL1xuY2xhc3MgU2lnbmFsRGlzcGxheSBleHRlbmRzIEJhc2VEaXNwbGF5IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zLCB0cnVlKTtcblxuICAgIHRoaXMubGFzdFBvc1kgPSBudWxsO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTaWduYWwoZnJhbWUsIGZyYW1lV2lkdGgsIHBpeGVsc1NpbmNlTGFzdEZyYW1lKSB7XG4gICAgY29uc3QgY29sb3IgPSB0aGlzLnBhcmFtcy5nZXQoJ2NvbG9yJyk7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGxldCBkYXRhID0gZnJhbWUuZGF0YTtcblxuICAgIGlmIChmcmFtZVdpZHRoIDwgZnJhbWVTaXplKVxuICAgICAgZGF0YSA9IGRvd25TYW1wbGUoZGF0YSwgZnJhbWVXaWR0aCk7XG5cbiAgICBjb25zdCBsZW5ndGggPSBkYXRhLmxlbmd0aDtcbiAgICBjb25zdCBob3BYID0gZnJhbWVXaWR0aCAvIGxlbmd0aDtcbiAgICBsZXQgcG9zWCA9IDA7XG4gICAgbGV0IGxhc3RZID0gdGhpcy5sYXN0UG9zWTtcblxuICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgcG9zWSA9IHRoaXMuZ2V0WVBvc2l0aW9uKGRhdGFbaV0pO1xuXG4gICAgICBpZiAobGFzdFkgPT09IG51bGwpIHtcbiAgICAgICAgY3R4Lm1vdmVUbyhwb3NYLCBwb3NZKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpID09PSAwKVxuICAgICAgICAgIGN0eC5tb3ZlVG8oLWhvcFgsIGxhc3RZKTtcblxuICAgICAgICBjdHgubGluZVRvKHBvc1gsIHBvc1kpO1xuICAgICAgfVxuXG4gICAgICBwb3NYICs9IGhvcFg7XG4gICAgICBsYXN0WSA9IHBvc1k7XG4gICAgfVxuXG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGN0eC5jbG9zZVBhdGgoKTtcblxuICAgIHRoaXMubGFzdFBvc1kgPSBsYXN0WTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaWduYWxEaXNwbGF5O1xuIl19