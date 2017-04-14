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

var _MinMax = require('../../common/operator/MinMax');

var _MinMax2 = _interopRequireDefault(_MinMax);

var _Rms = require('../../common/operator/Rms');

var _Rms2 = _interopRequireDefault(_Rms);

var _displayUtils = require('../utils/display-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  colors: {
    type: 'any',
    default: (0, _displayUtils.getColors)('waveform'),
    metas: { kind: 'dyanmic' }
  },
  rms: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dyanmic' }
  }
};

/**
 * Display a waveform (along with optionnal Rms) of a given `signal` input in
 * a canvas.
 *
 * @param {Object} options - Override default parameters.
 * @param {Array<String>} [options.colors=['waveform', 'rms']] - Array
 *  containing the color codes for the waveform (index 0) and rms (index 1).
 *  _dynamic parameter_
 * @param {Boolean} [options.rms=false] - Set to `true` to display the rms.
 *  _dynamic parameter_
 * @param {Number} [options.duration=1] - Duration (in seconds) represented in
 *  the canvas. _dynamic parameter_
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
 * @param {Number} [options.referenceTime=null] - Optionnal reference time the
 *  display should considerer as the origin. Is only usefull when synchronizing
 *  several display using the `DisplaySync` class.
 *
 * @memberof module:client.sink
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const audioContext = new window.AudioContext();
 *
 * navigator.mediaDevices
 *   .getUserMedia({ audio: true })
 *   .then(init)
 *   .catch((err) => console.error(err.stack));
 *
 * function init(stream) {
 *   const audioIn = audioContext.createMediaStreamSource(stream);
 *
 *   const audioInNode = new lfo.source.AudioInNode({
 *     audioContext: audioContext,
 *     sourceNode: audioIn,
 *     frameSize: 512,
 *   });
 *
 *   const waveformDisplay = new lfo.sink.WaveformDisplay({
 *     canvas: '#waveform',
 *     duration: 3.5,
 *     rms: true,
 *   });
 *
 *   audioInNode.connect(waveformDisplay);
 *   audioInNode.start();
 * });
 */

var WaveformDisplay = function (_BaseDisplay) {
  (0, _inherits3.default)(WaveformDisplay, _BaseDisplay);

  function WaveformDisplay(options) {
    (0, _classCallCheck3.default)(this, WaveformDisplay);

    var _this = (0, _possibleConstructorReturn3.default)(this, (WaveformDisplay.__proto__ || (0, _getPrototypeOf2.default)(WaveformDisplay)).call(this, definitions, options, true));

    _this.minMaxOperator = new _MinMax2.default();
    _this.rmsOperator = new _Rms2.default();
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(WaveformDisplay, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      this.minMaxOperator.initStream(this.streamParams);
      this.rmsOperator.initStream(this.streamParams);

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame, frameWidth, pixelsSinceLastFrame) {
      // drop frames that cannot be displayed
      if (frameWidth < 1) return;

      var colors = this.params.get('colors');
      var showRms = this.params.get('rms');
      var ctx = this.ctx;
      var data = frame.data;
      var iSamplesPerPixels = Math.floor(data.length / frameWidth);

      for (var index = 0; index < frameWidth; index++) {
        var start = index * iSamplesPerPixels;
        var end = index === frameWidth - 1 ? undefined : start + iSamplesPerPixels;
        var slice = data.subarray(start, end);

        var minMax = this.minMaxOperator.inputSignal(slice);
        var minY = this.getYPosition(minMax[0]);
        var maxY = this.getYPosition(minMax[1]);

        ctx.strokeStyle = colors[0];
        ctx.beginPath();
        ctx.moveTo(index, minY);
        ctx.lineTo(index, maxY);
        ctx.closePath();
        ctx.stroke();

        if (showRms) {
          var rms = this.rmsOperator.inputSignal(slice);
          var rmsMaxY = this.getYPosition(rms);
          var rmsMinY = this.getYPosition(-rms);

          ctx.strokeStyle = colors[1];
          ctx.beginPath();
          ctx.moveTo(index, rmsMinY);
          ctx.lineTo(index, rmsMaxY);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  }]);
  return WaveformDisplay;
}(_BaseDisplay3.default);

exports.default = WaveformDisplay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldhdmVmb3JtRGlzcGxheS5qcyJdLCJuYW1lcyI6WyJkZWZpbml0aW9ucyIsImNvbG9ycyIsInR5cGUiLCJkZWZhdWx0IiwibWV0YXMiLCJraW5kIiwicm1zIiwiV2F2ZWZvcm1EaXNwbGF5Iiwib3B0aW9ucyIsIm1pbk1heE9wZXJhdG9yIiwicm1zT3BlcmF0b3IiLCJwcmV2U3RyZWFtUGFyYW1zIiwicHJlcGFyZVN0cmVhbVBhcmFtcyIsImluaXRTdHJlYW0iLCJzdHJlYW1QYXJhbXMiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJmcmFtZSIsImZyYW1lV2lkdGgiLCJwaXhlbHNTaW5jZUxhc3RGcmFtZSIsInBhcmFtcyIsImdldCIsInNob3dSbXMiLCJjdHgiLCJkYXRhIiwiaVNhbXBsZXNQZXJQaXhlbHMiLCJNYXRoIiwiZmxvb3IiLCJsZW5ndGgiLCJpbmRleCIsInN0YXJ0IiwiZW5kIiwidW5kZWZpbmVkIiwic2xpY2UiLCJzdWJhcnJheSIsIm1pbk1heCIsImlucHV0U2lnbmFsIiwibWluWSIsImdldFlQb3NpdGlvbiIsIm1heFkiLCJzdHJva2VTdHlsZSIsImJlZ2luUGF0aCIsIm1vdmVUbyIsImxpbmVUbyIsImNsb3NlUGF0aCIsInN0cm9rZSIsInJtc01heFkiLCJybXNNaW5ZIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBR0EsSUFBTUEsY0FBYztBQUNsQkMsVUFBUTtBQUNOQyxVQUFNLEtBREE7QUFFTkMsYUFBUyw2QkFBVSxVQUFWLENBRkg7QUFHTkMsV0FBTyxFQUFFQyxNQUFNLFNBQVI7QUFIRCxHQURVO0FBTWxCQyxPQUFLO0FBQ0hKLFVBQU0sU0FESDtBQUVIQyxhQUFTLEtBRk47QUFHSEMsV0FBTyxFQUFFQyxNQUFNLFNBQVI7QUFISjtBQU5hLENBQXBCOztBQWFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEyRE1FLGU7OztBQUNKLDJCQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBQUEsd0pBQ2JSLFdBRGEsRUFDQVEsT0FEQSxFQUNTLElBRFQ7O0FBR25CLFVBQUtDLGNBQUwsR0FBc0Isc0JBQXRCO0FBQ0EsVUFBS0MsV0FBTCxHQUFtQixtQkFBbkI7QUFKbUI7QUFLcEI7O0FBRUQ7Ozs7O3dDQUNvQkMsZ0IsRUFBa0I7QUFDcEMsV0FBS0MsbUJBQUwsQ0FBeUJELGdCQUF6Qjs7QUFFQSxXQUFLRixjQUFMLENBQW9CSSxVQUFwQixDQUErQixLQUFLQyxZQUFwQztBQUNBLFdBQUtKLFdBQUwsQ0FBaUJHLFVBQWpCLENBQTRCLEtBQUtDLFlBQWpDOztBQUVBLFdBQUtDLHFCQUFMO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2NDLEssRUFBT0MsVSxFQUFZQyxvQixFQUFzQjtBQUNyRDtBQUNBLFVBQUlELGFBQWEsQ0FBakIsRUFBb0I7O0FBRXBCLFVBQU1oQixTQUFTLEtBQUtrQixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsUUFBaEIsQ0FBZjtBQUNBLFVBQU1DLFVBQVUsS0FBS0YsTUFBTCxDQUFZQyxHQUFaLENBQWdCLEtBQWhCLENBQWhCO0FBQ0EsVUFBTUUsTUFBTSxLQUFLQSxHQUFqQjtBQUNBLFVBQU1DLE9BQU9QLE1BQU1PLElBQW5CO0FBQ0EsVUFBTUMsb0JBQW9CQyxLQUFLQyxLQUFMLENBQVdILEtBQUtJLE1BQUwsR0FBY1YsVUFBekIsQ0FBMUI7O0FBRUEsV0FBSyxJQUFJVyxRQUFRLENBQWpCLEVBQW9CQSxRQUFRWCxVQUE1QixFQUF3Q1csT0FBeEMsRUFBaUQ7QUFDL0MsWUFBTUMsUUFBUUQsUUFBUUosaUJBQXRCO0FBQ0EsWUFBTU0sTUFBTUYsVUFBVVgsYUFBYSxDQUF2QixHQUEyQmMsU0FBM0IsR0FBdUNGLFFBQVFMLGlCQUEzRDtBQUNBLFlBQU1RLFFBQVFULEtBQUtVLFFBQUwsQ0FBY0osS0FBZCxFQUFxQkMsR0FBckIsQ0FBZDs7QUFFQSxZQUFNSSxTQUFTLEtBQUt6QixjQUFMLENBQW9CMEIsV0FBcEIsQ0FBZ0NILEtBQWhDLENBQWY7QUFDQSxZQUFNSSxPQUFPLEtBQUtDLFlBQUwsQ0FBa0JILE9BQU8sQ0FBUCxDQUFsQixDQUFiO0FBQ0EsWUFBTUksT0FBTyxLQUFLRCxZQUFMLENBQWtCSCxPQUFPLENBQVAsQ0FBbEIsQ0FBYjs7QUFFQVosWUFBSWlCLFdBQUosR0FBa0J0QyxPQUFPLENBQVAsQ0FBbEI7QUFDQXFCLFlBQUlrQixTQUFKO0FBQ0FsQixZQUFJbUIsTUFBSixDQUFXYixLQUFYLEVBQWtCUSxJQUFsQjtBQUNBZCxZQUFJb0IsTUFBSixDQUFXZCxLQUFYLEVBQWtCVSxJQUFsQjtBQUNBaEIsWUFBSXFCLFNBQUo7QUFDQXJCLFlBQUlzQixNQUFKOztBQUVBLFlBQUl2QixPQUFKLEVBQWE7QUFDWCxjQUFNZixNQUFNLEtBQUtJLFdBQUwsQ0FBaUJ5QixXQUFqQixDQUE2QkgsS0FBN0IsQ0FBWjtBQUNBLGNBQU1hLFVBQVUsS0FBS1IsWUFBTCxDQUFrQi9CLEdBQWxCLENBQWhCO0FBQ0EsY0FBTXdDLFVBQVUsS0FBS1QsWUFBTCxDQUFrQixDQUFDL0IsR0FBbkIsQ0FBaEI7O0FBRUFnQixjQUFJaUIsV0FBSixHQUFrQnRDLE9BQU8sQ0FBUCxDQUFsQjtBQUNBcUIsY0FBSWtCLFNBQUo7QUFDQWxCLGNBQUltQixNQUFKLENBQVdiLEtBQVgsRUFBa0JrQixPQUFsQjtBQUNBeEIsY0FBSW9CLE1BQUosQ0FBV2QsS0FBWCxFQUFrQmlCLE9BQWxCO0FBQ0F2QixjQUFJcUIsU0FBSjtBQUNBckIsY0FBSXNCLE1BQUo7QUFDRDtBQUNGO0FBQ0Y7Ozs7O2tCQUdZckMsZSIsImZpbGUiOiJXYXZlZm9ybURpc3BsYXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZURpc3BsYXkgZnJvbSAnLi9CYXNlRGlzcGxheSc7XG5pbXBvcnQgTWluTWF4IGZyb20gJy4uLy4uL2NvbW1vbi9vcGVyYXRvci9NaW5NYXgnO1xuaW1wb3J0IFJtcyBmcm9tICcuLi8uLi9jb21tb24vb3BlcmF0b3IvUm1zJztcbmltcG9ydCB7IGdldENvbG9ycyB9IGZyb20gJy4uL3V0aWxzL2Rpc3BsYXktdXRpbHMnO1xuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBjb2xvcnM6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBnZXRDb2xvcnMoJ3dhdmVmb3JtJyksXG4gICAgbWV0YXM6IHsga2luZDogJ2R5YW5taWMnIH0sXG4gIH0sXG4gIHJtczoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHlhbm1pYycgfSxcbiAgfVxufTtcblxuLyoqXG4gKiBEaXNwbGF5IGEgd2F2ZWZvcm0gKGFsb25nIHdpdGggb3B0aW9ubmFsIFJtcykgb2YgYSBnaXZlbiBgc2lnbmFsYCBpbnB1dCBpblxuICogYSBjYW52YXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IFtvcHRpb25zLmNvbG9ycz1bJ3dhdmVmb3JtJywgJ3JtcyddXSAtIEFycmF5XG4gKiAgY29udGFpbmluZyB0aGUgY29sb3IgY29kZXMgZm9yIHRoZSB3YXZlZm9ybSAoaW5kZXggMCkgYW5kIHJtcyAoaW5kZXggMSkuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5ybXM9ZmFsc2VdIC0gU2V0IHRvIGB0cnVlYCB0byBkaXNwbGF5IHRoZSBybXMuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmR1cmF0aW9uPTFdIC0gRHVyYXRpb24gKGluIHNlY29uZHMpIHJlcHJlc2VudGVkIGluXG4gKiAgdGhlIGNhbnZhcy4gX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1pbj0tMV0gLSBNaW5pbXVtIHZhbHVlIHJlcHJlc2VudGVkIGluIHRoZSBjYW52YXMuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1heD0xXSAtIE1heGltdW0gdmFsdWUgcmVwcmVzZW50ZWQgaW4gdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMud2lkdGg9MzAwXSAtIFdpZHRoIG9mIHRoZSBjYW52YXMuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmhlaWdodD0xNTBdIC0gSGVpZ2h0IG9mIHRoZSBjYW52YXMuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtFbGVtZW50fENTU1NlbGVjdG9yfSBbb3B0aW9ucy5jb250YWluZXI9bnVsbF0gLSBDb250YWluZXIgZWxlbWVudFxuICogIGluIHdoaWNoIHRvIGluc2VydCB0aGUgY2FudmFzLiBfY29uc3RhbnQgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtFbGVtZW50fENTU1NlbGVjdG9yfSBbb3B0aW9ucy5jYW52YXM9bnVsbF0gLSBDYW52YXMgZWxlbWVudFxuICogIGluIHdoaWNoIHRvIGRyYXcuIF9jb25zdGFudCBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucmVmZXJlbmNlVGltZT1udWxsXSAtIE9wdGlvbm5hbCByZWZlcmVuY2UgdGltZSB0aGVcbiAqICBkaXNwbGF5IHNob3VsZCBjb25zaWRlcmVyIGFzIHRoZSBvcmlnaW4uIElzIG9ubHkgdXNlZnVsbCB3aGVuIHN5bmNocm9uaXppbmdcbiAqICBzZXZlcmFsIGRpc3BsYXkgdXNpbmcgdGhlIGBEaXNwbGF5U3luY2AgY2xhc3MuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjbGllbnQuc2lua1xuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gKlxuICogY29uc3QgYXVkaW9Db250ZXh0ID0gbmV3IHdpbmRvdy5BdWRpb0NvbnRleHQoKTtcbiAqXG4gKiBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXG4gKiAgIC5nZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSB9KVxuICogICAudGhlbihpbml0KVxuICogICAuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcbiAqXG4gKiBmdW5jdGlvbiBpbml0KHN0cmVhbSkge1xuICogICBjb25zdCBhdWRpb0luID0gYXVkaW9Db250ZXh0LmNyZWF0ZU1lZGlhU3RyZWFtU291cmNlKHN0cmVhbSk7XG4gKlxuICogICBjb25zdCBhdWRpb0luTm9kZSA9IG5ldyBsZm8uc291cmNlLkF1ZGlvSW5Ob2RlKHtcbiAqICAgICBhdWRpb0NvbnRleHQ6IGF1ZGlvQ29udGV4dCxcbiAqICAgICBzb3VyY2VOb2RlOiBhdWRpb0luLFxuICogICAgIGZyYW1lU2l6ZTogNTEyLFxuICogICB9KTtcbiAqXG4gKiAgIGNvbnN0IHdhdmVmb3JtRGlzcGxheSA9IG5ldyBsZm8uc2luay5XYXZlZm9ybURpc3BsYXkoe1xuICogICAgIGNhbnZhczogJyN3YXZlZm9ybScsXG4gKiAgICAgZHVyYXRpb246IDMuNSxcbiAqICAgICBybXM6IHRydWUsXG4gKiAgIH0pO1xuICpcbiAqICAgYXVkaW9Jbk5vZGUuY29ubmVjdCh3YXZlZm9ybURpc3BsYXkpO1xuICogICBhdWRpb0luTm9kZS5zdGFydCgpO1xuICogfSk7XG4gKi9cbmNsYXNzIFdhdmVmb3JtRGlzcGxheSBleHRlbmRzIEJhc2VEaXNwbGF5IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zLCB0cnVlKTtcblxuICAgIHRoaXMubWluTWF4T3BlcmF0b3IgPSBuZXcgTWluTWF4KCk7XG4gICAgdGhpcy5ybXNPcGVyYXRvciA9IG5ldyBSbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLm1pbk1heE9wZXJhdG9yLmluaXRTdHJlYW0odGhpcy5zdHJlYW1QYXJhbXMpO1xuICAgIHRoaXMucm1zT3BlcmF0b3IuaW5pdFN0cmVhbSh0aGlzLnN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTaWduYWwoZnJhbWUsIGZyYW1lV2lkdGgsIHBpeGVsc1NpbmNlTGFzdEZyYW1lKSB7XG4gICAgLy8gZHJvcCBmcmFtZXMgdGhhdCBjYW5ub3QgYmUgZGlzcGxheWVkXG4gICAgaWYgKGZyYW1lV2lkdGggPCAxKSByZXR1cm47XG5cbiAgICBjb25zdCBjb2xvcnMgPSB0aGlzLnBhcmFtcy5nZXQoJ2NvbG9ycycpO1xuICAgIGNvbnN0IHNob3dSbXMgPSB0aGlzLnBhcmFtcy5nZXQoJ3JtcycpO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IGRhdGEgPSBmcmFtZS5kYXRhO1xuICAgIGNvbnN0IGlTYW1wbGVzUGVyUGl4ZWxzID0gTWF0aC5mbG9vcihkYXRhLmxlbmd0aCAvIGZyYW1lV2lkdGgpO1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGZyYW1lV2lkdGg7IGluZGV4KyspIHtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gaW5kZXggKiBpU2FtcGxlc1BlclBpeGVscztcbiAgICAgIGNvbnN0IGVuZCA9IGluZGV4ID09PSBmcmFtZVdpZHRoIC0gMSA/IHVuZGVmaW5lZCA6IHN0YXJ0ICsgaVNhbXBsZXNQZXJQaXhlbHM7XG4gICAgICBjb25zdCBzbGljZSA9IGRhdGEuc3ViYXJyYXkoc3RhcnQsIGVuZCk7XG5cbiAgICAgIGNvbnN0IG1pbk1heCA9IHRoaXMubWluTWF4T3BlcmF0b3IuaW5wdXRTaWduYWwoc2xpY2UpO1xuICAgICAgY29uc3QgbWluWSA9IHRoaXMuZ2V0WVBvc2l0aW9uKG1pbk1heFswXSk7XG4gICAgICBjb25zdCBtYXhZID0gdGhpcy5nZXRZUG9zaXRpb24obWluTWF4WzFdKTtcblxuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gY29sb3JzWzBdO1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4Lm1vdmVUbyhpbmRleCwgbWluWSk7XG4gICAgICBjdHgubGluZVRvKGluZGV4LCBtYXhZKTtcbiAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcblxuICAgICAgaWYgKHNob3dSbXMpIHtcbiAgICAgICAgY29uc3Qgcm1zID0gdGhpcy5ybXNPcGVyYXRvci5pbnB1dFNpZ25hbChzbGljZSk7XG4gICAgICAgIGNvbnN0IHJtc01heFkgPSB0aGlzLmdldFlQb3NpdGlvbihybXMpO1xuICAgICAgICBjb25zdCBybXNNaW5ZID0gdGhpcy5nZXRZUG9zaXRpb24oLXJtcyk7XG5cbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gY29sb3JzWzFdO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5tb3ZlVG8oaW5kZXgsIHJtc01pblkpO1xuICAgICAgICBjdHgubGluZVRvKGluZGV4LCBybXNNYXhZKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdhdmVmb3JtRGlzcGxheTtcbiJdfQ==