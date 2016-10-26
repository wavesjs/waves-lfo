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

var _RMS = require('../../common/operator/RMS');

var _RMS2 = _interopRequireDefault(_RMS);

var _displayUtils = require('../../common/utils/display-utils');

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
 * Display a waveform (along with optionnal RMS) of a given `signal` input in
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
    _this.rmsOperator = new _RMS2.default();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldhdmVmb3JtRGlzcGxheS5qcyJdLCJuYW1lcyI6WyJkZWZpbml0aW9ucyIsImNvbG9ycyIsInR5cGUiLCJkZWZhdWx0IiwibWV0YXMiLCJraW5kIiwicm1zIiwiV2F2ZWZvcm1EaXNwbGF5Iiwib3B0aW9ucyIsIm1pbk1heE9wZXJhdG9yIiwicm1zT3BlcmF0b3IiLCJwcmV2U3RyZWFtUGFyYW1zIiwicHJlcGFyZVN0cmVhbVBhcmFtcyIsImluaXRTdHJlYW0iLCJzdHJlYW1QYXJhbXMiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJmcmFtZSIsImZyYW1lV2lkdGgiLCJwaXhlbHNTaW5jZUxhc3RGcmFtZSIsInBhcmFtcyIsImdldCIsInNob3dSbXMiLCJjdHgiLCJkYXRhIiwiaVNhbXBsZXNQZXJQaXhlbHMiLCJNYXRoIiwiZmxvb3IiLCJsZW5ndGgiLCJpbmRleCIsInN0YXJ0IiwiZW5kIiwidW5kZWZpbmVkIiwic2xpY2UiLCJzdWJhcnJheSIsIm1pbk1heCIsImlucHV0U2lnbmFsIiwibWluWSIsImdldFlQb3NpdGlvbiIsIm1heFkiLCJzdHJva2VTdHlsZSIsImJlZ2luUGF0aCIsIm1vdmVUbyIsImxpbmVUbyIsImNsb3NlUGF0aCIsInN0cm9rZSIsInJtc01heFkiLCJybXNNaW5ZIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBR0EsSUFBTUEsY0FBYztBQUNsQkMsVUFBUTtBQUNOQyxVQUFNLEtBREE7QUFFTkMsYUFBUyw2QkFBVSxVQUFWLENBRkg7QUFHTkMsV0FBTyxFQUFFQyxNQUFNLFNBQVI7QUFIRCxHQURVO0FBTWxCQyxPQUFLO0FBQ0hKLFVBQU0sU0FESDtBQUVIQyxhQUFTLEtBRk47QUFHSEMsV0FBTyxFQUFFQyxNQUFNLFNBQVI7QUFISjtBQU5hLENBQXBCOztBQWFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEyRE1FLGU7OztBQUNKLDJCQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBQUEsd0pBQ2JSLFdBRGEsRUFDQVEsT0FEQSxFQUNTLElBRFQ7O0FBR25CLFVBQUtDLGNBQUwsR0FBc0Isc0JBQXRCO0FBQ0EsVUFBS0MsV0FBTCxHQUFtQixtQkFBbkI7QUFKbUI7QUFLcEI7O0FBRUQ7Ozs7O3dDQUNvQkMsZ0IsRUFBa0I7QUFDcEMsV0FBS0MsbUJBQUwsQ0FBeUJELGdCQUF6Qjs7QUFFQSxXQUFLRixjQUFMLENBQW9CSSxVQUFwQixDQUErQixLQUFLQyxZQUFwQztBQUNBLFdBQUtKLFdBQUwsQ0FBaUJHLFVBQWpCLENBQTRCLEtBQUtDLFlBQWpDOztBQUVBLFdBQUtDLHFCQUFMO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2NDLEssRUFBT0MsVSxFQUFZQyxvQixFQUFzQjtBQUNyRDtBQUNBLFVBQUlELGFBQWEsQ0FBakIsRUFBb0I7O0FBRXBCLFVBQU1oQixTQUFTLEtBQUtrQixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsUUFBaEIsQ0FBZjtBQUNBLFVBQU1DLFVBQVUsS0FBS0YsTUFBTCxDQUFZQyxHQUFaLENBQWdCLEtBQWhCLENBQWhCO0FBQ0EsVUFBTUUsTUFBTSxLQUFLQSxHQUFqQjtBQUNBLFVBQU1DLE9BQU9QLE1BQU1PLElBQW5CO0FBQ0EsVUFBTUMsb0JBQW9CQyxLQUFLQyxLQUFMLENBQVdILEtBQUtJLE1BQUwsR0FBY1YsVUFBekIsQ0FBMUI7O0FBRUEsV0FBSyxJQUFJVyxRQUFRLENBQWpCLEVBQW9CQSxRQUFRWCxVQUE1QixFQUF3Q1csT0FBeEMsRUFBaUQ7QUFDL0MsWUFBTUMsUUFBUUQsUUFBUUosaUJBQXRCO0FBQ0EsWUFBTU0sTUFBTUYsVUFBVVgsYUFBYSxDQUF2QixHQUEyQmMsU0FBM0IsR0FBdUNGLFFBQVFMLGlCQUEzRDtBQUNBLFlBQU1RLFFBQVFULEtBQUtVLFFBQUwsQ0FBY0osS0FBZCxFQUFxQkMsR0FBckIsQ0FBZDs7QUFFQSxZQUFNSSxTQUFTLEtBQUt6QixjQUFMLENBQW9CMEIsV0FBcEIsQ0FBZ0NILEtBQWhDLENBQWY7QUFDQSxZQUFNSSxPQUFPLEtBQUtDLFlBQUwsQ0FBa0JILE9BQU8sQ0FBUCxDQUFsQixDQUFiO0FBQ0EsWUFBTUksT0FBTyxLQUFLRCxZQUFMLENBQWtCSCxPQUFPLENBQVAsQ0FBbEIsQ0FBYjs7QUFFQVosWUFBSWlCLFdBQUosR0FBa0J0QyxPQUFPLENBQVAsQ0FBbEI7QUFDQXFCLFlBQUlrQixTQUFKO0FBQ0FsQixZQUFJbUIsTUFBSixDQUFXYixLQUFYLEVBQWtCUSxJQUFsQjtBQUNBZCxZQUFJb0IsTUFBSixDQUFXZCxLQUFYLEVBQWtCVSxJQUFsQjtBQUNBaEIsWUFBSXFCLFNBQUo7QUFDQXJCLFlBQUlzQixNQUFKOztBQUVBLFlBQUl2QixPQUFKLEVBQWE7QUFDWCxjQUFNZixNQUFNLEtBQUtJLFdBQUwsQ0FBaUJ5QixXQUFqQixDQUE2QkgsS0FBN0IsQ0FBWjtBQUNBLGNBQU1hLFVBQVUsS0FBS1IsWUFBTCxDQUFrQi9CLEdBQWxCLENBQWhCO0FBQ0EsY0FBTXdDLFVBQVUsS0FBS1QsWUFBTCxDQUFrQixDQUFDL0IsR0FBbkIsQ0FBaEI7O0FBRUFnQixjQUFJaUIsV0FBSixHQUFrQnRDLE9BQU8sQ0FBUCxDQUFsQjtBQUNBcUIsY0FBSWtCLFNBQUo7QUFDQWxCLGNBQUltQixNQUFKLENBQVdiLEtBQVgsRUFBa0JrQixPQUFsQjtBQUNBeEIsY0FBSW9CLE1BQUosQ0FBV2QsS0FBWCxFQUFrQmlCLE9BQWxCO0FBQ0F2QixjQUFJcUIsU0FBSjtBQUNBckIsY0FBSXNCLE1BQUo7QUFDRDtBQUNGO0FBQ0Y7Ozs7O2tCQUdZckMsZSIsImZpbGUiOiJXYXZlZm9ybURpc3BsYXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZURpc3BsYXkgZnJvbSAnLi9CYXNlRGlzcGxheSc7XG5pbXBvcnQgTWluTWF4IGZyb20gJy4uLy4uL2NvbW1vbi9vcGVyYXRvci9NaW5NYXgnO1xuaW1wb3J0IFJNUyBmcm9tICcuLi8uLi9jb21tb24vb3BlcmF0b3IvUk1TJztcbmltcG9ydCB7IGdldENvbG9ycyB9IGZyb20gJy4uLy4uL2NvbW1vbi91dGlscy9kaXNwbGF5LXV0aWxzJztcblxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgY29sb3JzOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogZ2V0Q29sb3JzKCd3YXZlZm9ybScpLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICBybXM6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5YW5taWMnIH0sXG4gIH1cbn07XG5cbi8qKlxuICogRGlzcGxheSBhIHdhdmVmb3JtIChhbG9uZyB3aXRoIG9wdGlvbm5hbCBSTVMpIG9mIGEgZ2l2ZW4gYHNpZ25hbGAgaW5wdXQgaW5cbiAqIGEgY2FudmFzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBbb3B0aW9ucy5jb2xvcnM9Wyd3YXZlZm9ybScsICdybXMnXV0gLSBBcnJheVxuICogIGNvbnRhaW5pbmcgdGhlIGNvbG9yIGNvZGVzIGZvciB0aGUgd2F2ZWZvcm0gKGluZGV4IDApIGFuZCBybXMgKGluZGV4IDEpLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucm1zPWZhbHNlXSAtIFNldCB0byBgdHJ1ZWAgdG8gZGlzcGxheSB0aGUgcm1zLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5kdXJhdGlvbj0xXSAtIER1cmF0aW9uIChpbiBzZWNvbmRzKSByZXByZXNlbnRlZCBpblxuICogIHRoZSBjYW52YXMuIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5taW49LTFdIC0gTWluaW11bSB2YWx1ZSByZXByZXNlbnRlZCBpbiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXg9MV0gLSBNYXhpbXVtIHZhbHVlIHJlcHJlc2VudGVkIGluIHRoZSBjYW52YXMuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndpZHRoPTMwMF0gLSBXaWR0aCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oZWlnaHQ9MTUwXSAtIEhlaWdodCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY29udGFpbmVyPW51bGxdIC0gQ29udGFpbmVyIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBpbnNlcnQgdGhlIGNhbnZhcy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY2FudmFzPW51bGxdIC0gQ2FudmFzIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBkcmF3LiBfY29uc3RhbnQgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnJlZmVyZW5jZVRpbWU9bnVsbF0gLSBPcHRpb25uYWwgcmVmZXJlbmNlIHRpbWUgdGhlXG4gKiAgZGlzcGxheSBzaG91bGQgY29uc2lkZXJlciBhcyB0aGUgb3JpZ2luLiBJcyBvbmx5IHVzZWZ1bGwgd2hlbiBzeW5jaHJvbml6aW5nXG4gKiAgc2V2ZXJhbCBkaXNwbGF5IHVzaW5nIHRoZSBgRGlzcGxheVN5bmNgIGNsYXNzLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y2xpZW50LnNpbmtcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIGNvbnN0IGF1ZGlvQ29udGV4dCA9IG5ldyB3aW5kb3cuQXVkaW9Db250ZXh0KCk7XG4gKlxuICogbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICogICAuZ2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSlcbiAqICAgLnRoZW4oaW5pdClcbiAqICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKSk7XG4gKlxuICogZnVuY3Rpb24gaW5pdChzdHJlYW0pIHtcbiAqICAgY29uc3QgYXVkaW9JbiA9IGF1ZGlvQ29udGV4dC5jcmVhdGVNZWRpYVN0cmVhbVNvdXJjZShzdHJlYW0pO1xuICpcbiAqICAgY29uc3QgYXVkaW9Jbk5vZGUgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luTm9kZSh7XG4gKiAgICAgYXVkaW9Db250ZXh0OiBhdWRpb0NvbnRleHQsXG4gKiAgICAgc291cmNlTm9kZTogYXVkaW9JbixcbiAqICAgICBmcmFtZVNpemU6IDUxMixcbiAqICAgfSk7XG4gKlxuICogICBjb25zdCB3YXZlZm9ybURpc3BsYXkgPSBuZXcgbGZvLnNpbmsuV2F2ZWZvcm1EaXNwbGF5KHtcbiAqICAgICBjYW52YXM6ICcjd2F2ZWZvcm0nLFxuICogICAgIGR1cmF0aW9uOiAzLjUsXG4gKiAgICAgcm1zOiB0cnVlLFxuICogICB9KTtcbiAqXG4gKiAgIGF1ZGlvSW5Ob2RlLmNvbm5lY3Qod2F2ZWZvcm1EaXNwbGF5KTtcbiAqICAgYXVkaW9Jbk5vZGUuc3RhcnQoKTtcbiAqIH0pO1xuICovXG5jbGFzcyBXYXZlZm9ybURpc3BsYXkgZXh0ZW5kcyBCYXNlRGlzcGxheSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucywgdHJ1ZSk7XG5cbiAgICB0aGlzLm1pbk1heE9wZXJhdG9yID0gbmV3IE1pbk1heCgpO1xuICAgIHRoaXMucm1zT3BlcmF0b3IgPSBuZXcgUk1TKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5taW5NYXhPcGVyYXRvci5pbml0U3RyZWFtKHRoaXMuc3RyZWFtUGFyYW1zKTtcbiAgICB0aGlzLnJtc09wZXJhdG9yLmluaXRTdHJlYW0odGhpcy5zdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKGZyYW1lLCBmcmFtZVdpZHRoLCBwaXhlbHNTaW5jZUxhc3RGcmFtZSkge1xuICAgIC8vIGRyb3AgZnJhbWVzIHRoYXQgY2Fubm90IGJlIGRpc3BsYXllZFxuICAgIGlmIChmcmFtZVdpZHRoIDwgMSkgcmV0dXJuO1xuXG4gICAgY29uc3QgY29sb3JzID0gdGhpcy5wYXJhbXMuZ2V0KCdjb2xvcnMnKTtcbiAgICBjb25zdCBzaG93Um1zID0gdGhpcy5wYXJhbXMuZ2V0KCdybXMnKTtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCBkYXRhID0gZnJhbWUuZGF0YTtcbiAgICBjb25zdCBpU2FtcGxlc1BlclBpeGVscyA9IE1hdGguZmxvb3IoZGF0YS5sZW5ndGggLyBmcmFtZVdpZHRoKTtcblxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBmcmFtZVdpZHRoOyBpbmRleCsrKSB7XG4gICAgICBjb25zdCBzdGFydCA9IGluZGV4ICogaVNhbXBsZXNQZXJQaXhlbHM7XG4gICAgICBjb25zdCBlbmQgPSBpbmRleCA9PT0gZnJhbWVXaWR0aCAtIDEgPyB1bmRlZmluZWQgOiBzdGFydCArIGlTYW1wbGVzUGVyUGl4ZWxzO1xuICAgICAgY29uc3Qgc2xpY2UgPSBkYXRhLnN1YmFycmF5KHN0YXJ0LCBlbmQpO1xuXG4gICAgICBjb25zdCBtaW5NYXggPSB0aGlzLm1pbk1heE9wZXJhdG9yLmlucHV0U2lnbmFsKHNsaWNlKTtcbiAgICAgIGNvbnN0IG1pblkgPSB0aGlzLmdldFlQb3NpdGlvbihtaW5NYXhbMF0pO1xuICAgICAgY29uc3QgbWF4WSA9IHRoaXMuZ2V0WVBvc2l0aW9uKG1pbk1heFsxXSk7XG5cbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yc1swXTtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5tb3ZlVG8oaW5kZXgsIG1pblkpO1xuICAgICAgY3R4LmxpbmVUbyhpbmRleCwgbWF4WSk7XG4gICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG5cbiAgICAgIGlmIChzaG93Um1zKSB7XG4gICAgICAgIGNvbnN0IHJtcyA9IHRoaXMucm1zT3BlcmF0b3IuaW5wdXRTaWduYWwoc2xpY2UpO1xuICAgICAgICBjb25zdCBybXNNYXhZID0gdGhpcy5nZXRZUG9zaXRpb24ocm1zKTtcbiAgICAgICAgY29uc3Qgcm1zTWluWSA9IHRoaXMuZ2V0WVBvc2l0aW9uKC1ybXMpO1xuXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yc1sxXTtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKGluZGV4LCBybXNNaW5ZKTtcbiAgICAgICAgY3R4LmxpbmVUbyhpbmRleCwgcm1zTWF4WSk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBXYXZlZm9ybURpc3BsYXk7XG4iXX0=