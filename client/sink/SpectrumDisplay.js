'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _log = require('babel-runtime/core-js/math/log10');

var _log2 = _interopRequireDefault(_log);

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

var _FFT = require('../../common/operator/FFT');

var _FFT2 = _interopRequireDefault(_FFT);

var _displayUtils = require('../../common/utils/display-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  scale: {
    type: 'float',
    default: 1,
    metas: { kind: 'dynamic' }
  },
  color: {
    type: 'string',
    default: (0, _displayUtils.getColors)('spectrum'),
    nullable: true,
    metas: { kind: 'dynamic' }
  },
  min: {
    type: 'float',
    default: -80,
    metas: { kind: 'dynamic' }
  },
  max: {
    type: 'float',
    default: 6,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Display the spectrum of the incomming `signal` input.
 *
 * @memberof module:client.sink
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.scale=1] - Scale display of the spectrogram.
 * @param {String} [options.color=null] - Color of the spectrogram.
 * @param {Number} [options.min=-80] - Minimum displayed value (in dB).
 * @param {Number} [options.max=6] - Maximum displayed value (in dB).
 * @param {Number} [options.width=300] - Width of the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.height=150] - Height of the canvas.
 *  _dynamic parameter_
 * @param {Element|CSSSelector} [options.container=null] - Container element
 *  in which to insert the canvas. _constant parameter_
 * @param {Element|CSSSelector} [options.canvas=null] - Canvas element
 *  in which to draw. _constant parameter_
 *
 * @todo - expose more `fft` config options
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const audioContext = new AudioContext();
 *
 * navigator.mediaDevices
 *   .getUserMedia({ audio: true })
 *   .then(init)
 *   .catch((err) => console.error(err.stack));
 *
 * function init(stream) {
 *   const source = audioContext.createMediaStreamSource(stream);
 *
 *   const audioInNode = new lfo.source.AudioInNode({
 *     audioContext: audioContext,
 *     sourceNode: source,
 *   });
 *
 *   const spectrum = new lfo.sink.SpectrumDisplay({
 *     canvas: '#spectrum',
 *   });
 *
 *   audioInNode.connect(spectrum);
 *   audioInNode.start();
 * }
 */

var SpectrumDisplay = function (_BaseDisplay) {
  (0, _inherits3.default)(SpectrumDisplay, _BaseDisplay);

  function SpectrumDisplay() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, SpectrumDisplay);
    return (0, _possibleConstructorReturn3.default)(this, (SpectrumDisplay.__proto__ || (0, _getPrototypeOf2.default)(SpectrumDisplay)).call(this, definitions, options, false));
  }

  /** @private */


  (0, _createClass3.default)(SpectrumDisplay, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      this.fft = new _FFT2.default({
        size: this.streamParams.frameSize,
        window: 'hann',
        norm: 'linear'
      });

      this.fft.initStream(this.streamParams);

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      var bins = this.fft.inputSignal(frame.data);
      var nbrBins = bins.length;

      var width = this.canvasWidth;
      var height = this.canvasHeight;
      var scale = this.params.get('scale');

      var binWidth = width / nbrBins;
      var ctx = this.ctx;

      ctx.fillStyle = this.params.get('color');

      // error handling needs review...
      var error = 0;

      for (var i = 0; i < nbrBins; i++) {
        var x1Float = i * binWidth + error;
        var x1Int = Math.round(x1Float);
        var x2Float = x1Float + (binWidth - error);
        var x2Int = Math.round(x2Float);

        error = x2Int - x2Float;

        if (x1Int !== x2Int) {
          var _width = x2Int - x1Int;
          var db = 20 * (0, _log2.default)(bins[i]);
          var y = this.getYPosition(db * scale);
          ctx.fillRect(x1Int, y, _width, height - y);
        } else {
          error -= binWidth;
        }
      }
    }
  }]);
  return SpectrumDisplay;
}(_BaseDisplay3.default);

exports.default = SpectrumDisplay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNwZWN0cnVtRGlzcGxheS5qcyJdLCJuYW1lcyI6WyJkZWZpbml0aW9ucyIsInNjYWxlIiwidHlwZSIsImRlZmF1bHQiLCJtZXRhcyIsImtpbmQiLCJjb2xvciIsIm51bGxhYmxlIiwibWluIiwibWF4IiwiU3BlY3RydW1EaXNwbGF5Iiwib3B0aW9ucyIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwiZmZ0Iiwic2l6ZSIsInN0cmVhbVBhcmFtcyIsImZyYW1lU2l6ZSIsIndpbmRvdyIsIm5vcm0iLCJpbml0U3RyZWFtIiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwiZnJhbWUiLCJiaW5zIiwiaW5wdXRTaWduYWwiLCJkYXRhIiwibmJyQmlucyIsImxlbmd0aCIsIndpZHRoIiwiY2FudmFzV2lkdGgiLCJoZWlnaHQiLCJjYW52YXNIZWlnaHQiLCJwYXJhbXMiLCJnZXQiLCJiaW5XaWR0aCIsImN0eCIsImZpbGxTdHlsZSIsImVycm9yIiwiaSIsIngxRmxvYXQiLCJ4MUludCIsIk1hdGgiLCJyb3VuZCIsIngyRmxvYXQiLCJ4MkludCIsImRiIiwieSIsImdldFlQb3NpdGlvbiIsImZpbGxSZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFHQSxJQUFNQSxjQUFjO0FBQ2xCQyxTQUFPO0FBQ0xDLFVBQU0sT0FERDtBQUVMQyxhQUFTLENBRko7QUFHTEMsV0FBTyxFQUFFQyxNQUFNLFNBQVI7QUFIRixHQURXO0FBTWxCQyxTQUFPO0FBQ0xKLFVBQU0sUUFERDtBQUVMQyxhQUFTLDZCQUFVLFVBQVYsQ0FGSjtBQUdMSSxjQUFVLElBSEw7QUFJTEgsV0FBTyxFQUFFQyxNQUFNLFNBQVI7QUFKRixHQU5XO0FBWWxCRyxPQUFLO0FBQ0hOLFVBQU0sT0FESDtBQUVIQyxhQUFTLENBQUMsRUFGUDtBQUdIQyxXQUFPLEVBQUVDLE1BQU0sU0FBUjtBQUhKLEdBWmE7QUFpQmxCSSxPQUFLO0FBQ0hQLFVBQU0sT0FESDtBQUVIQyxhQUFTLENBRk47QUFHSEMsV0FBTyxFQUFFQyxNQUFNLFNBQVI7QUFISjtBQWpCYSxDQUFwQjs7QUF5QkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQStDTUssZTs7O0FBQ0osNkJBQTBCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7QUFBQSxtSkFDbEJYLFdBRGtCLEVBQ0xXLE9BREssRUFDSSxLQURKO0FBRXpCOztBQUVEOzs7Ozt3Q0FDb0JDLGdCLEVBQWtCO0FBQ3BDLFdBQUtDLG1CQUFMLENBQXlCRCxnQkFBekI7O0FBRUEsV0FBS0UsR0FBTCxHQUFXLGtCQUFRO0FBQ2pCQyxjQUFNLEtBQUtDLFlBQUwsQ0FBa0JDLFNBRFA7QUFFakJDLGdCQUFRLE1BRlM7QUFHakJDLGNBQU07QUFIVyxPQUFSLENBQVg7O0FBTUEsV0FBS0wsR0FBTCxDQUFTTSxVQUFULENBQW9CLEtBQUtKLFlBQXpCOztBQUVBLFdBQUtLLHFCQUFMO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2NDLEssRUFBTztBQUNuQixVQUFNQyxPQUFPLEtBQUtULEdBQUwsQ0FBU1UsV0FBVCxDQUFxQkYsTUFBTUcsSUFBM0IsQ0FBYjtBQUNBLFVBQU1DLFVBQVVILEtBQUtJLE1BQXJCOztBQUVBLFVBQU1DLFFBQVEsS0FBS0MsV0FBbkI7QUFDQSxVQUFNQyxTQUFTLEtBQUtDLFlBQXBCO0FBQ0EsVUFBTTlCLFFBQVEsS0FBSytCLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixPQUFoQixDQUFkOztBQUVBLFVBQU1DLFdBQVdOLFFBQVFGLE9BQXpCO0FBQ0EsVUFBTVMsTUFBTSxLQUFLQSxHQUFqQjs7QUFFQUEsVUFBSUMsU0FBSixHQUFnQixLQUFLSixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsT0FBaEIsQ0FBaEI7O0FBRUE7QUFDQSxVQUFJSSxRQUFRLENBQVo7O0FBRUEsV0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlaLE9BQXBCLEVBQTZCWSxHQUE3QixFQUFrQztBQUNoQyxZQUFNQyxVQUFVRCxJQUFJSixRQUFKLEdBQWVHLEtBQS9CO0FBQ0EsWUFBTUcsUUFBUUMsS0FBS0MsS0FBTCxDQUFXSCxPQUFYLENBQWQ7QUFDQSxZQUFNSSxVQUFVSixXQUFXTCxXQUFXRyxLQUF0QixDQUFoQjtBQUNBLFlBQU1PLFFBQVFILEtBQUtDLEtBQUwsQ0FBV0MsT0FBWCxDQUFkOztBQUVBTixnQkFBUU8sUUFBUUQsT0FBaEI7O0FBRUEsWUFBSUgsVUFBVUksS0FBZCxFQUFxQjtBQUNuQixjQUFNaEIsU0FBUWdCLFFBQVFKLEtBQXRCO0FBQ0EsY0FBTUssS0FBSyxLQUFLLG1CQUFXdEIsS0FBS2UsQ0FBTCxDQUFYLENBQWhCO0FBQ0EsY0FBTVEsSUFBSSxLQUFLQyxZQUFMLENBQWtCRixLQUFLNUMsS0FBdkIsQ0FBVjtBQUNBa0MsY0FBSWEsUUFBSixDQUFhUixLQUFiLEVBQW9CTSxDQUFwQixFQUF1QmxCLE1BQXZCLEVBQThCRSxTQUFTZ0IsQ0FBdkM7QUFDRCxTQUxELE1BS087QUFDTFQsbUJBQVNILFFBQVQ7QUFDRDtBQUNGO0FBQ0Y7Ozs7O2tCQUdZeEIsZSIsImZpbGUiOiJTcGVjdHJ1bURpc3BsYXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZURpc3BsYXkgZnJvbSAnLi9CYXNlRGlzcGxheSc7XG5pbXBvcnQgRkZUIGZyb20gJy4uLy4uL2NvbW1vbi9vcGVyYXRvci9GRlQnO1xuaW1wb3J0IHsgZ2V0Q29sb3JzIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzL2Rpc3BsYXktdXRpbHMnO1xuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBzY2FsZToge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogMSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgY29sb3I6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiBnZXRDb2xvcnMoJ3NwZWN0cnVtJyksXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG4gIG1pbjoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogLTgwLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICBtYXg6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDYsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH1cbn07XG5cblxuLyoqXG4gKiBEaXNwbGF5IHRoZSBzcGVjdHJ1bSBvZiB0aGUgaW5jb21taW5nIGBzaWduYWxgIGlucHV0LlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y2xpZW50LnNpbmtcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5zY2FsZT0xXSAtIFNjYWxlIGRpc3BsYXkgb2YgdGhlIHNwZWN0cm9ncmFtLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPW51bGxdIC0gQ29sb3Igb2YgdGhlIHNwZWN0cm9ncmFtLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1pbj0tODBdIC0gTWluaW11bSBkaXNwbGF5ZWQgdmFsdWUgKGluIGRCKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXg9Nl0gLSBNYXhpbXVtIGRpc3BsYXllZCB2YWx1ZSAoaW4gZEIpLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLndpZHRoPTMwMF0gLSBXaWR0aCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oZWlnaHQ9MTUwXSAtIEhlaWdodCBvZiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY29udGFpbmVyPW51bGxdIC0gQ29udGFpbmVyIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBpbnNlcnQgdGhlIGNhbnZhcy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7RWxlbWVudHxDU1NTZWxlY3Rvcn0gW29wdGlvbnMuY2FudmFzPW51bGxdIC0gQ2FudmFzIGVsZW1lbnRcbiAqICBpbiB3aGljaCB0byBkcmF3LiBfY29uc3RhbnQgcGFyYW1ldGVyX1xuICpcbiAqIEB0b2RvIC0gZXhwb3NlIG1vcmUgYGZmdGAgY29uZmlnIG9wdGlvbnNcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIGNvbnN0IGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAqXG4gKiBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXG4gKiAgIC5nZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSB9KVxuICogICAudGhlbihpbml0KVxuICogICAuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcbiAqXG4gKiBmdW5jdGlvbiBpbml0KHN0cmVhbSkge1xuICogICBjb25zdCBzb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlTWVkaWFTdHJlYW1Tb3VyY2Uoc3RyZWFtKTtcbiAqXG4gKiAgIGNvbnN0IGF1ZGlvSW5Ob2RlID0gbmV3IGxmby5zb3VyY2UuQXVkaW9Jbk5vZGUoe1xuICogICAgIGF1ZGlvQ29udGV4dDogYXVkaW9Db250ZXh0LFxuICogICAgIHNvdXJjZU5vZGU6IHNvdXJjZSxcbiAqICAgfSk7XG4gKlxuICogICBjb25zdCBzcGVjdHJ1bSA9IG5ldyBsZm8uc2luay5TcGVjdHJ1bURpc3BsYXkoe1xuICogICAgIGNhbnZhczogJyNzcGVjdHJ1bScsXG4gKiAgIH0pO1xuICpcbiAqICAgYXVkaW9Jbk5vZGUuY29ubmVjdChzcGVjdHJ1bSk7XG4gKiAgIGF1ZGlvSW5Ob2RlLnN0YXJ0KCk7XG4gKiB9XG4gKi9cbmNsYXNzIFNwZWN0cnVtRGlzcGxheSBleHRlbmRzIEJhc2VEaXNwbGF5IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLmZmdCA9IG5ldyBGRlQoe1xuICAgICAgc2l6ZTogdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplLFxuICAgICAgd2luZG93OiAnaGFubicsXG4gICAgICBub3JtOiAnbGluZWFyJyxcbiAgICB9KTtcblxuICAgIHRoaXMuZmZ0LmluaXRTdHJlYW0odGhpcy5zdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKGZyYW1lKSB7XG4gICAgY29uc3QgYmlucyA9IHRoaXMuZmZ0LmlucHV0U2lnbmFsKGZyYW1lLmRhdGEpO1xuICAgIGNvbnN0IG5ickJpbnMgPSBiaW5zLmxlbmd0aDtcblxuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcbiAgICBjb25zdCBzY2FsZSA9IHRoaXMucGFyYW1zLmdldCgnc2NhbGUnKTtcblxuICAgIGNvbnN0IGJpbldpZHRoID0gd2lkdGggLyBuYnJCaW5zO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuXG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMucGFyYW1zLmdldCgnY29sb3InKTtcblxuICAgIC8vIGVycm9yIGhhbmRsaW5nIG5lZWRzIHJldmlldy4uLlxuICAgIGxldCBlcnJvciA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ickJpbnM7IGkrKykge1xuICAgICAgY29uc3QgeDFGbG9hdCA9IGkgKiBiaW5XaWR0aCArIGVycm9yO1xuICAgICAgY29uc3QgeDFJbnQgPSBNYXRoLnJvdW5kKHgxRmxvYXQpO1xuICAgICAgY29uc3QgeDJGbG9hdCA9IHgxRmxvYXQgKyAoYmluV2lkdGggLSBlcnJvcik7XG4gICAgICBjb25zdCB4MkludCA9IE1hdGgucm91bmQoeDJGbG9hdCk7XG5cbiAgICAgIGVycm9yID0geDJJbnQgLSB4MkZsb2F0O1xuXG4gICAgICBpZiAoeDFJbnQgIT09IHgySW50KSB7XG4gICAgICAgIGNvbnN0IHdpZHRoID0geDJJbnQgLSB4MUludDtcbiAgICAgICAgY29uc3QgZGIgPSAyMCAqIE1hdGgubG9nMTAoYmluc1tpXSk7XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLmdldFlQb3NpdGlvbihkYiAqIHNjYWxlKTtcbiAgICAgICAgY3R4LmZpbGxSZWN0KHgxSW50LCB5LCB3aWR0aCwgaGVpZ2h0IC0geSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcnJvciAtPSBiaW5XaWR0aDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3BlY3RydW1EaXNwbGF5O1xuIl19