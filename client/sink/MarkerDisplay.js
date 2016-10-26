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

var _displayUtils = require('../../common/utils/display-utils');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1hcmtlckRpc3BsYXkuanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJ0aHJlc2hvbGQiLCJ0eXBlIiwiZGVmYXVsdCIsIm51bGxhYmxlIiwibWV0YXMiLCJraW5kIiwidGhyZXNob2xkSW5kZXgiLCJjb2xvciIsIk1hcmtlckRpc3BsYXkiLCJvcHRpb25zIiwiZnJhbWUiLCJmcmFtZVdpZHRoIiwicGl4ZWxzU2luY2VMYXN0RnJhbWUiLCJwYXJhbXMiLCJnZXQiLCJjdHgiLCJoZWlnaHQiLCJ2YWx1ZSIsImRhdGEiLCJ5TWluIiwiZ2V0WVBvc2l0aW9uIiwieU1heCIsInYiLCJzYXZlIiwiZmlsbFN0eWxlIiwiZmlsbFJlY3QiLCJyZXN0b3JlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxjQUFjO0FBQ2xCQyxhQUFXO0FBQ1RDLFVBQU0sT0FERztBQUVUQyxhQUFTLElBRkE7QUFHVEMsY0FBVSxJQUhEO0FBSVRDLFdBQU8sRUFBRUMsTUFBTSxTQUFSO0FBSkUsR0FETztBQU9sQkMsa0JBQWdCO0FBQ2RMLFVBQU0sU0FEUTtBQUVkQyxhQUFTLENBRks7QUFHZEUsV0FBTyxFQUFFQyxNQUFNLFNBQVI7QUFITyxHQVBFO0FBWWxCRSxTQUFPO0FBQ0xOLFVBQU0sUUFERDtBQUVMQyxhQUFTLDZCQUFVLFFBQVYsQ0FGSjtBQUdMQyxjQUFVLElBSEw7QUFJTEMsV0FBTyxFQUFFQyxNQUFNLFNBQVI7QUFKRjtBQVpXLENBQXBCOztBQW9CQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXNETUcsYTs7O0FBQ0osMkJBQTBCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7QUFBQSwrSUFDbEJWLFdBRGtCLEVBQ0xVLE9BREs7QUFFekI7O0FBRUQ7Ozs7O2tDQUNjQyxLLEVBQU9DLFUsRUFBWUMsb0IsRUFBc0I7QUFDckQsVUFBTUwsUUFBUSxLQUFLTSxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsT0FBaEIsQ0FBZDtBQUNBLFVBQU1kLFlBQVksS0FBS2EsTUFBTCxDQUFZQyxHQUFaLENBQWdCLFdBQWhCLENBQWxCO0FBQ0EsVUFBTVIsaUJBQWlCLEtBQUtPLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixnQkFBaEIsQ0FBdkI7QUFDQSxVQUFNQyxNQUFNLEtBQUtBLEdBQWpCO0FBQ0EsVUFBTUMsU0FBU0QsSUFBSUMsTUFBbkI7QUFDQSxVQUFNQyxRQUFRUCxNQUFNUSxJQUFOLENBQVdaLGNBQVgsQ0FBZDs7QUFFQSxVQUFJTixjQUFjLElBQWQsSUFBc0JpQixTQUFTakIsU0FBbkMsRUFBOEM7QUFDNUMsWUFBSW1CLE9BQU8sS0FBS0MsWUFBTCxDQUFrQixLQUFLUCxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsS0FBaEIsQ0FBbEIsQ0FBWDtBQUNBLFlBQUlPLE9BQU8sS0FBS0QsWUFBTCxDQUFrQixLQUFLUCxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsS0FBaEIsQ0FBbEIsQ0FBWDs7QUFFQSxZQUFJSyxPQUFPRSxJQUFYLEVBQWlCO0FBQ2YsY0FBTUMsSUFBSUQsSUFBVjtBQUNBQSxpQkFBT0YsSUFBUDtBQUNBQSxpQkFBT0csQ0FBUDtBQUNEOztBQUVEUCxZQUFJUSxJQUFKO0FBQ0FSLFlBQUlTLFNBQUosR0FBZ0JqQixLQUFoQjtBQUNBUSxZQUFJVSxRQUFKLENBQWEsQ0FBYixFQUFnQk4sSUFBaEIsRUFBc0IsQ0FBdEIsRUFBeUJFLElBQXpCO0FBQ0FOLFlBQUlXLE9BQUo7QUFDRDtBQUNGOzs7OztrQkFHWWxCLGEiLCJmaWxlIjoiTWFya2VyRGlzcGxheS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlRGlzcGxheSBmcm9tICcuL0Jhc2VEaXNwbGF5JztcbmltcG9ydCB7IGdldENvbG9ycyB9IGZyb20gJy4uLy4uL2NvbW1vbi91dGlscy9kaXNwbGF5LXV0aWxzJztcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIHRocmVzaG9sZDoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgdGhyZXNob2xkSW5kZXg6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMCxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgY29sb3I6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiBnZXRDb2xvcnMoJ21hcmtlcicpLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9XG59O1xuXG4vKipcbiAqIERpc3BsYXkgYSBtYXJrZXIgYWNjb3JkaW5nIHRvIGEgYHZlY3RvcmAgaW5wdXQgZnJhbWUuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjbGllbnQuc2lua1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuY29sb3IgLSBDb2xvciBvZiB0aGUgbWFya2VyLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnRocmVzaG9sZEluZGV4PTBdIC0gSW5kZXggb2YgdGhlIGluY29tbWluZyBmcmFtZVxuICogIGRhdGEgdG8gY29tcGFyZSBhZ2FpbnN0IHRoZSB0aHJlc2hvbGQuIF9TaG91bGQgYmUgdXNlZCBpbiBjb25qb25jdGlvbiB3aXRoXG4gKiAgYHRocmVzaG9sZGBfLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnRocmVzaG9sZD1udWxsXSAtIE1pbmltdW0gdmFsdWUgdGhlIGluY29tbWluZyB2YWx1ZVxuICogIG11c3QgaGF2ZSB0byB0cmlnZ2VyIHRoZSBkaXNwbGF5IG9mIGEgbWFya2VyLiBJZiBudWxsIGVhY2ggaW5jb21taW5nIGV2ZW50XG4gKiAgdHJpZ2dlcnMgYSBtYXJrZXIuIF9TaG91bGQgYmUgdXNlZCBpbiBjb25qb25jdGlvbiB3aXRoIGB0aHJlc2hvbGRJbmRleGBfLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndpZHRoPTMwMF0gLSBXaWR0aCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oZWlnaHQ9MTUwXSAtIEhlaWdodCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY29udGFpbmVyPW51bGxdIC0gQ29udGFpbmVyIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBpbnNlcnQgdGhlIGNhbnZhcy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY2FudmFzPW51bGxdIC0gQ2FudmFzIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBkcmF3LiBfY29uc3RhbnQgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmR1cmF0aW9uPTFdIC0gRHVyYXRpb24gKGluIHNlY29uZHMpIHJlcHJlc2VudGVkIGluXG4gKiAgdGhlIGNhbnZhcy4gVGhpcyBwYXJhbWV0ZXIgb25seSBleGlzdHMgZm9yIG9wZXJhdG9ycyB0aGF0IGRpc3BsYXkgc2V2ZXJhbFxuICogIGNvbnNlY3V0aXZlIGZyYW1lcyBvbiB0aGUgY2FudmFzLiBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucmVmZXJlbmNlVGltZT1udWxsXSAtIE9wdGlvbm5hbCByZWZlcmVuY2UgdGltZSB0aGVcbiAqICBkaXNwbGF5IHNob3VsZCBjb25zaWRlcmVyIGFzIHRoZSBvcmlnaW4uIElzIG9ubHkgdXNlZnVsbCB3aGVuIHN5bmNocm9uaXppbmdcbiAqICBzZXZlcmFsIGRpc3BsYXkgdXNpbmcgdGhlIGBEaXNwbGF5U3luY2AgY2xhc3MuIFRoaXMgcGFyYW1ldGVyIG9ubHkgZXhpc3RzXG4gKiAgZm9yIG9wZXJhdG9ycyB0aGF0IGRpc3BsYXkgc2V2ZXJhbCBjb25zZWN1dGl2ZSBmcmFtZXMgb24gdGhlIGNhbnZhcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIGNvbnN0IGV2ZW50SW4gPSBuZXcgbGZvLnNvdXJjZS5FdmVudEluKHtcbiAqICAgZnJhbWVUeXBlOiAnc2NhbGFyJyxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IG1hcmtlciA9IG5ldyBsZm8uc2luay5NYXJrZXJEaXNwbGF5KHtcbiAqICAgY2FudmFzOiAnI21hcmtlcicsXG4gKiAgIHRocmVzaG9sZDogMC41LFxuICogfSk7XG4gKlxuICogZXZlbnRJbi5jb25uZWN0KG1hcmtlcik7XG4gKiBldmVudEluLnN0YXJ0KCk7XG4gKlxuICogbGV0IHRpbWUgPSAwO1xuICogY29uc3QgcGVyaW9kID0gMTtcbiAqXG4gKiAoZnVuY3Rpb24gZ2VuZXJhdGVEYXRhKCkge1xuICogICBldmVudEluLnByb2Nlc3ModGltZSwgTWF0aC5yYW5kb20oKSk7XG4gKlxuICogICB0aW1lICs9IHBlcmlvZDtcbiAqICAgc2V0VGltZW91dChnZW5lcmF0ZURhdGEsIHBlcmlvZCAqIDEwMDApO1xuICogfSgpKTtcbiAqL1xuY2xhc3MgTWFya2VyRGlzcGxheSBleHRlbmRzIEJhc2VEaXNwbGF5IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUsIGZyYW1lV2lkdGgsIHBpeGVsc1NpbmNlTGFzdEZyYW1lKSB7XG4gICAgY29uc3QgY29sb3IgPSB0aGlzLnBhcmFtcy5nZXQoJ2NvbG9yJyk7XG4gICAgY29uc3QgdGhyZXNob2xkID0gdGhpcy5wYXJhbXMuZ2V0KCd0aHJlc2hvbGQnKTtcbiAgICBjb25zdCB0aHJlc2hvbGRJbmRleCA9IHRoaXMucGFyYW1zLmdldCgndGhyZXNob2xkSW5kZXgnKTtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCBoZWlnaHQgPSBjdHguaGVpZ2h0O1xuICAgIGNvbnN0IHZhbHVlID0gZnJhbWUuZGF0YVt0aHJlc2hvbGRJbmRleF07XG5cbiAgICBpZiAodGhyZXNob2xkID09PSBudWxsIHx8IHZhbHVlID49IHRocmVzaG9sZCkge1xuICAgICAgbGV0IHlNaW4gPSB0aGlzLmdldFlQb3NpdGlvbih0aGlzLnBhcmFtcy5nZXQoJ21pbicpKTtcbiAgICAgIGxldCB5TWF4ID0gdGhpcy5nZXRZUG9zaXRpb24odGhpcy5wYXJhbXMuZ2V0KCdtYXgnKSk7XG5cbiAgICAgIGlmICh5TWluID4geU1heCkge1xuICAgICAgICBjb25zdCB2ID0geU1heDtcbiAgICAgICAgeU1heCA9IHlNaW47XG4gICAgICAgIHlNaW4gPSB2O1xuICAgICAgfVxuXG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgICAgY3R4LmZpbGxSZWN0KDAsIHlNaW4sIDEsIHlNYXgpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFya2VyRGlzcGxheTtcbiJdfQ==