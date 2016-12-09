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

var definitions = {
  threshold: {
    type: 'float',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' }
  },
  thresholdIndex: {
    type: 'integer',
    default: 0,
    metas: { kind: 'dynamic' }
  },
  color: {
    type: 'string',
    default: (0, _displayUtils.getColors)('marker'),
    nullable: true,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Display a marker according to a `vector` input frame.
 *
 * @memberof module:client.sink
 *
 * @param {Object} options - Override default parameters.
 * @param {String} options.color - Color of the marker.
 * @param {Number} [options.thresholdIndex=0] - Index of the incomming frame
 *  data to compare against the threshold. _Should be used in conjonction with
 *  `threshold`_.
 * @param {Number} [options.threshold=null] - Minimum value the incomming value
 *  must have to trigger the display of a marker. If null each incomming event
 *  triggers a marker. _Should be used in conjonction with `thresholdIndex`_.
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
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameType: 'scalar',
 * });
 *
 * const marker = new lfo.sink.MarkerDisplay({
 *   canvas: '#marker',
 *   threshold: 0.5,
 * });
 *
 * eventIn.connect(marker);
 * eventIn.start();
 *
 * let time = 0;
 * const period = 1;
 *
 * (function generateData() {
 *   eventIn.process(time, Math.random());
 *
 *   time += period;
 *   setTimeout(generateData, period * 1000);
 * }());
 */

var MarkerDisplay = function (_BaseDisplay) {
  (0, _inherits3.default)(MarkerDisplay, _BaseDisplay);

  function MarkerDisplay() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, MarkerDisplay);
    return (0, _possibleConstructorReturn3.default)(this, (MarkerDisplay.__proto__ || (0, _getPrototypeOf2.default)(MarkerDisplay)).call(this, definitions, options));
  }

  /** @private */


  (0, _createClass3.default)(MarkerDisplay, [{
    key: 'processVector',
    value: function processVector(frame, frameWidth, pixelsSinceLastFrame) {
      var color = this.params.get('color');
      var threshold = this.params.get('threshold');
      var thresholdIndex = this.params.get('thresholdIndex');
      var ctx = this.ctx;
      var height = ctx.height;
      var value = frame.data[thresholdIndex];

      if (threshold === null || value >= threshold) {
        var yMin = this.getYPosition(this.params.get('min'));
        var yMax = this.getYPosition(this.params.get('max'));

        if (yMin > yMax) {
          var v = yMax;
          yMax = yMin;
          yMin = v;
        }

        ctx.save();
        ctx.fillStyle = color;
        ctx.fillRect(0, yMin, 1, yMax);
        ctx.restore();
      }
    }
  }]);
  return MarkerDisplay;
}(_BaseDisplay3.default);

exports.default = MarkerDisplay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1hcmtlckRpc3BsYXkuanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJ0aHJlc2hvbGQiLCJ0eXBlIiwiZGVmYXVsdCIsIm51bGxhYmxlIiwibWV0YXMiLCJraW5kIiwidGhyZXNob2xkSW5kZXgiLCJjb2xvciIsIk1hcmtlckRpc3BsYXkiLCJvcHRpb25zIiwiZnJhbWUiLCJmcmFtZVdpZHRoIiwicGl4ZWxzU2luY2VMYXN0RnJhbWUiLCJwYXJhbXMiLCJnZXQiLCJjdHgiLCJoZWlnaHQiLCJ2YWx1ZSIsImRhdGEiLCJ5TWluIiwiZ2V0WVBvc2l0aW9uIiwieU1heCIsInYiLCJzYXZlIiwiZmlsbFN0eWxlIiwiZmlsbFJlY3QiLCJyZXN0b3JlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxjQUFjO0FBQ2xCQyxhQUFXO0FBQ1RDLFVBQU0sT0FERztBQUVUQyxhQUFTLElBRkE7QUFHVEMsY0FBVSxJQUhEO0FBSVRDLFdBQU8sRUFBRUMsTUFBTSxTQUFSO0FBSkUsR0FETztBQU9sQkMsa0JBQWdCO0FBQ2RMLFVBQU0sU0FEUTtBQUVkQyxhQUFTLENBRks7QUFHZEUsV0FBTyxFQUFFQyxNQUFNLFNBQVI7QUFITyxHQVBFO0FBWWxCRSxTQUFPO0FBQ0xOLFVBQU0sUUFERDtBQUVMQyxhQUFTLDZCQUFVLFFBQVYsQ0FGSjtBQUdMQyxjQUFVLElBSEw7QUFJTEMsV0FBTyxFQUFFQyxNQUFNLFNBQVI7QUFKRjtBQVpXLENBQXBCOztBQW9CQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXNETUcsYTs7O0FBQ0osMkJBQTBCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7QUFBQSwrSUFDbEJWLFdBRGtCLEVBQ0xVLE9BREs7QUFFekI7O0FBRUQ7Ozs7O2tDQUNjQyxLLEVBQU9DLFUsRUFBWUMsb0IsRUFBc0I7QUFDckQsVUFBTUwsUUFBUSxLQUFLTSxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsT0FBaEIsQ0FBZDtBQUNBLFVBQU1kLFlBQVksS0FBS2EsTUFBTCxDQUFZQyxHQUFaLENBQWdCLFdBQWhCLENBQWxCO0FBQ0EsVUFBTVIsaUJBQWlCLEtBQUtPLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixnQkFBaEIsQ0FBdkI7QUFDQSxVQUFNQyxNQUFNLEtBQUtBLEdBQWpCO0FBQ0EsVUFBTUMsU0FBU0QsSUFBSUMsTUFBbkI7QUFDQSxVQUFNQyxRQUFRUCxNQUFNUSxJQUFOLENBQVdaLGNBQVgsQ0FBZDs7QUFFQSxVQUFJTixjQUFjLElBQWQsSUFBc0JpQixTQUFTakIsU0FBbkMsRUFBOEM7QUFDNUMsWUFBSW1CLE9BQU8sS0FBS0MsWUFBTCxDQUFrQixLQUFLUCxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsS0FBaEIsQ0FBbEIsQ0FBWDtBQUNBLFlBQUlPLE9BQU8sS0FBS0QsWUFBTCxDQUFrQixLQUFLUCxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsS0FBaEIsQ0FBbEIsQ0FBWDs7QUFFQSxZQUFJSyxPQUFPRSxJQUFYLEVBQWlCO0FBQ2YsY0FBTUMsSUFBSUQsSUFBVjtBQUNBQSxpQkFBT0YsSUFBUDtBQUNBQSxpQkFBT0csQ0FBUDtBQUNEOztBQUVEUCxZQUFJUSxJQUFKO0FBQ0FSLFlBQUlTLFNBQUosR0FBZ0JqQixLQUFoQjtBQUNBUSxZQUFJVSxRQUFKLENBQWEsQ0FBYixFQUFnQk4sSUFBaEIsRUFBc0IsQ0FBdEIsRUFBeUJFLElBQXpCO0FBQ0FOLFlBQUlXLE9BQUo7QUFDRDtBQUNGOzs7OztrQkFHWWxCLGEiLCJmaWxlIjoiTWFya2VyRGlzcGxheS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlRGlzcGxheSBmcm9tICcuL0Jhc2VEaXNwbGF5JztcbmltcG9ydCB7IGdldENvbG9ycyB9IGZyb20gJy4uL3V0aWxzL2Rpc3BsYXktdXRpbHMnO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgdGhyZXNob2xkOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICB0aHJlc2hvbGRJbmRleDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAwLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICBjb2xvcjoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6IGdldENvbG9ycygnbWFya2VyJyksXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH1cbn07XG5cbi8qKlxuICogRGlzcGxheSBhIG1hcmtlciBhY2NvcmRpbmcgdG8gYSBgdmVjdG9yYCBpbnB1dCBmcmFtZS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNsaWVudC5zaW5rXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5jb2xvciAtIENvbG9yIG9mIHRoZSBtYXJrZXIuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMudGhyZXNob2xkSW5kZXg9MF0gLSBJbmRleCBvZiB0aGUgaW5jb21taW5nIGZyYW1lXG4gKiAgZGF0YSB0byBjb21wYXJlIGFnYWluc3QgdGhlIHRocmVzaG9sZC4gX1Nob3VsZCBiZSB1c2VkIGluIGNvbmpvbmN0aW9uIHdpdGhcbiAqICBgdGhyZXNob2xkYF8uXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMudGhyZXNob2xkPW51bGxdIC0gTWluaW11bSB2YWx1ZSB0aGUgaW5jb21taW5nIHZhbHVlXG4gKiAgbXVzdCBoYXZlIHRvIHRyaWdnZXIgdGhlIGRpc3BsYXkgb2YgYSBtYXJrZXIuIElmIG51bGwgZWFjaCBpbmNvbW1pbmcgZXZlbnRcbiAqICB0cmlnZ2VycyBhIG1hcmtlci4gX1Nob3VsZCBiZSB1c2VkIGluIGNvbmpvbmN0aW9uIHdpdGggYHRocmVzaG9sZEluZGV4YF8uXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMud2lkdGg9MzAwXSAtIFdpZHRoIG9mIHRoZSBjYW52YXMuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmhlaWdodD0xNTBdIC0gSGVpZ2h0IG9mIHRoZSBjYW52YXMuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtFbGVtZW50fENTU1NlbGVjdG9yfSBbb3B0aW9ucy5jb250YWluZXI9bnVsbF0gLSBDb250YWluZXIgZWxlbWVudFxuICogIGluIHdoaWNoIHRvIGluc2VydCB0aGUgY2FudmFzLiBfY29uc3RhbnQgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtFbGVtZW50fENTU1NlbGVjdG9yfSBbb3B0aW9ucy5jYW52YXM9bnVsbF0gLSBDYW52YXMgZWxlbWVudFxuICogIGluIHdoaWNoIHRvIGRyYXcuIF9jb25zdGFudCBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZHVyYXRpb249MV0gLSBEdXJhdGlvbiAoaW4gc2Vjb25kcykgcmVwcmVzZW50ZWQgaW5cbiAqICB0aGUgY2FudmFzLiBUaGlzIHBhcmFtZXRlciBvbmx5IGV4aXN0cyBmb3Igb3BlcmF0b3JzIHRoYXQgZGlzcGxheSBzZXZlcmFsXG4gKiAgY29uc2VjdXRpdmUgZnJhbWVzIG9uIHRoZSBjYW52YXMuIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5yZWZlcmVuY2VUaW1lPW51bGxdIC0gT3B0aW9ubmFsIHJlZmVyZW5jZSB0aW1lIHRoZVxuICogIGRpc3BsYXkgc2hvdWxkIGNvbnNpZGVyZXIgYXMgdGhlIG9yaWdpbi4gSXMgb25seSB1c2VmdWxsIHdoZW4gc3luY2hyb25pemluZ1xuICogIHNldmVyYWwgZGlzcGxheSB1c2luZyB0aGUgYERpc3BsYXlTeW5jYCBjbGFzcy4gVGhpcyBwYXJhbWV0ZXIgb25seSBleGlzdHNcbiAqICBmb3Igb3BlcmF0b3JzIHRoYXQgZGlzcGxheSBzZXZlcmFsIGNvbnNlY3V0aXZlIGZyYW1lcyBvbiB0aGUgY2FudmFzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVR5cGU6ICdzY2FsYXInLFxuICogfSk7XG4gKlxuICogY29uc3QgbWFya2VyID0gbmV3IGxmby5zaW5rLk1hcmtlckRpc3BsYXkoe1xuICogICBjYW52YXM6ICcjbWFya2VyJyxcbiAqICAgdGhyZXNob2xkOiAwLjUsXG4gKiB9KTtcbiAqXG4gKiBldmVudEluLmNvbm5lY3QobWFya2VyKTtcbiAqIGV2ZW50SW4uc3RhcnQoKTtcbiAqXG4gKiBsZXQgdGltZSA9IDA7XG4gKiBjb25zdCBwZXJpb2QgPSAxO1xuICpcbiAqIChmdW5jdGlvbiBnZW5lcmF0ZURhdGEoKSB7XG4gKiAgIGV2ZW50SW4ucHJvY2Vzcyh0aW1lLCBNYXRoLnJhbmRvbSgpKTtcbiAqXG4gKiAgIHRpbWUgKz0gcGVyaW9kO1xuICogICBzZXRUaW1lb3V0KGdlbmVyYXRlRGF0YSwgcGVyaW9kICogMTAwMCk7XG4gKiB9KCkpO1xuICovXG5jbGFzcyBNYXJrZXJEaXNwbGF5IGV4dGVuZHMgQmFzZURpc3BsYXkge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcihmcmFtZSwgZnJhbWVXaWR0aCwgcGl4ZWxzU2luY2VMYXN0RnJhbWUpIHtcbiAgICBjb25zdCBjb2xvciA9IHRoaXMucGFyYW1zLmdldCgnY29sb3InKTtcbiAgICBjb25zdCB0aHJlc2hvbGQgPSB0aGlzLnBhcmFtcy5nZXQoJ3RocmVzaG9sZCcpO1xuICAgIGNvbnN0IHRocmVzaG9sZEluZGV4ID0gdGhpcy5wYXJhbXMuZ2V0KCd0aHJlc2hvbGRJbmRleCcpO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IGhlaWdodCA9IGN0eC5oZWlnaHQ7XG4gICAgY29uc3QgdmFsdWUgPSBmcmFtZS5kYXRhW3RocmVzaG9sZEluZGV4XTtcblxuICAgIGlmICh0aHJlc2hvbGQgPT09IG51bGwgfHwgdmFsdWUgPj0gdGhyZXNob2xkKSB7XG4gICAgICBsZXQgeU1pbiA9IHRoaXMuZ2V0WVBvc2l0aW9uKHRoaXMucGFyYW1zLmdldCgnbWluJykpO1xuICAgICAgbGV0IHlNYXggPSB0aGlzLmdldFlQb3NpdGlvbih0aGlzLnBhcmFtcy5nZXQoJ21heCcpKTtcblxuICAgICAgaWYgKHlNaW4gPiB5TWF4KSB7XG4gICAgICAgIGNvbnN0IHYgPSB5TWF4O1xuICAgICAgICB5TWF4ID0geU1pbjtcbiAgICAgICAgeU1pbiA9IHY7XG4gICAgICB9XG5cbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gICAgICBjdHguZmlsbFJlY3QoMCwgeU1pbiwgMSwgeU1heCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYXJrZXJEaXNwbGF5O1xuIl19