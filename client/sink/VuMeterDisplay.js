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

var _log = require('babel-runtime/core-js/math/log10');

var _log2 = _interopRequireDefault(_log);

var _BaseDisplay2 = require('./BaseDisplay');

var _BaseDisplay3 = _interopRequireDefault(_BaseDisplay2);

var _RMS = require('../../common/operator/RMS');

var _RMS2 = _interopRequireDefault(_RMS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log10 = _log2.default;

var definitions = {
  offset: {
    type: 'float',
    default: -14,
    metas: { kind: 'dyanmic' }
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
  },
  width: {
    type: 'integer',
    default: 6,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Simple VU-Meter to used on a `signal` stream.
 *
 * @memberof module:client.sink
 *
 * @param {Object} options - Override defaults parameters.
 * @param {Number} [options.offset=-14] - dB offset applied to the signal.
 * @param {Number} [options.min=-80] - Minimum displayed value (in dB).
 * @param {Number} [options.max=6] - Maximum displayed value (in dB).
 * @param {Number} [options.width=6] - Width of the display (in pixels).
 * @param {Number} [options.height=150] - Height of the canvas.
 * @param {Element|CSSSelector} [options.container=null] - Container element
 *  in which to insert the canvas.
 * @param {Element|CSSSelector} [options.canvas=null] - Canvas element
 *  in which to draw.
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
 *   const source = audioContext.createMediaStreamSource(stream);
 *
 *   const audioInNode = new lfo.source.AudioInNode({
 *     audioContext: audioContext,
 *     sourceNode: source,
 *   });
 *
 *   const vuMeter = new lfo.sink.VuMeterDisplay({
 *     canvas: '#vu-meter',
 *   });
 *
 *   audioInNode.connect(vuMeter);
 *   audioInNode.start();
 * }
 */

var VuMeterDisplay = function (_BaseDisplay) {
  (0, _inherits3.default)(VuMeterDisplay, _BaseDisplay);

  function VuMeterDisplay() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, VuMeterDisplay);

    var _this = (0, _possibleConstructorReturn3.default)(this, (VuMeterDisplay.__proto__ || (0, _getPrototypeOf2.default)(VuMeterDisplay)).call(this, definitions, options, false));

    _this.rmsOperator = new _RMS2.default();

    _this.lastDB = 0;
    _this.peak = {
      value: 0,
      time: 0
    };

    _this.peakLifetime = 1; // sec
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(VuMeterDisplay, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      this.rmsOperator.initStream(this.streamParams);

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      var now = new Date().getTime() / 1000; // sec
      var offset = this.params.get('offset'); // offset zero of the vu meter
      var height = this.canvasHeight;
      var width = this.canvasWidth;
      var ctx = this.ctx;

      var lastDB = this.lastDB;
      var peak = this.peak;

      var red = '#ff2121';
      var yellow = '#ffff1f';
      var green = '#00ff00';

      // handle current db value
      var rms = this.rmsOperator.inputSignal(frame.data);
      var dB = 20 * log10(rms) - offset;

      // slow release (could probably be improved)
      if (lastDB > dB) dB = lastDB - 6;

      // handle peak
      if (dB > peak.value || now - peak.time > this.peakLifetime) {
        peak.value = dB;
        peak.time = now;
      }

      var y0 = this.getYPosition(0);
      var y = this.getYPosition(dB);
      var yPeak = this.getYPosition(peak.value);

      ctx.save();

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      var gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, green);
      gradient.addColorStop((height - y0) / height, yellow);
      gradient.addColorStop(1, red);

      // dB
      ctx.fillStyle = gradient;
      ctx.fillRect(0, y, width, height - y);

      // 0 dB marker
      ctx.fillStyle = '#dcdcdc';
      ctx.fillRect(0, y0, width, 2);

      // peak
      ctx.fillStyle = gradient;
      ctx.fillRect(0, yPeak, width, 2);

      ctx.restore();

      this.lastDB = dB;
    }
  }]);
  return VuMeterDisplay;
}(_BaseDisplay3.default);

exports.default = VuMeterDisplay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlZ1TWV0ZXJEaXNwbGF5LmpzIl0sIm5hbWVzIjpbImxvZzEwIiwiZGVmaW5pdGlvbnMiLCJvZmZzZXQiLCJ0eXBlIiwiZGVmYXVsdCIsIm1ldGFzIiwia2luZCIsIm1pbiIsIm1heCIsIndpZHRoIiwiVnVNZXRlckRpc3BsYXkiLCJvcHRpb25zIiwicm1zT3BlcmF0b3IiLCJsYXN0REIiLCJwZWFrIiwidmFsdWUiLCJ0aW1lIiwicGVha0xpZmV0aW1lIiwicHJldlN0cmVhbVBhcmFtcyIsInByZXBhcmVTdHJlYW1QYXJhbXMiLCJpbml0U3RyZWFtIiwic3RyZWFtUGFyYW1zIiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwiZnJhbWUiLCJub3ciLCJEYXRlIiwiZ2V0VGltZSIsInBhcmFtcyIsImdldCIsImhlaWdodCIsImNhbnZhc0hlaWdodCIsImNhbnZhc1dpZHRoIiwiY3R4IiwicmVkIiwieWVsbG93IiwiZ3JlZW4iLCJybXMiLCJpbnB1dFNpZ25hbCIsImRhdGEiLCJkQiIsInkwIiwiZ2V0WVBvc2l0aW9uIiwieSIsInlQZWFrIiwic2F2ZSIsImZpbGxTdHlsZSIsImZpbGxSZWN0IiwiZ3JhZGllbnQiLCJjcmVhdGVMaW5lYXJHcmFkaWVudCIsImFkZENvbG9yU3RvcCIsInJlc3RvcmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLHFCQUFOOztBQUVBLElBQU1DLGNBQWM7QUFDbEJDLFVBQVE7QUFDTkMsVUFBTSxPQURBO0FBRU5DLGFBQVMsQ0FBQyxFQUZKO0FBR05DLFdBQU8sRUFBRUMsTUFBTSxTQUFSO0FBSEQsR0FEVTtBQU1sQkMsT0FBSztBQUNISixVQUFNLE9BREg7QUFFSEMsYUFBUyxDQUFDLEVBRlA7QUFHSEMsV0FBTyxFQUFFQyxNQUFNLFNBQVI7QUFISixHQU5hO0FBV2xCRSxPQUFLO0FBQ0hMLFVBQU0sT0FESDtBQUVIQyxhQUFTLENBRk47QUFHSEMs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YyxRQUFKLENBQWEsQ0FBYixFQUFnQkosQ0FBaEIsRUFBbUJqQyxLQUFuQixFQUEwQm9CLFNBQVNhLENBQW5DOztBQUVBO0FBQ0FWLFVBQUlhLFNBQUosR0FBZ0IsU0FBaEI7QUFDQWIsVUFBSWMsUUFBSixDQUFhLENBQWIsRUFBZ0JOLEVBQWhCLEVBQW9CL0IsS0FBcEIsRUFBMkIsQ0FBM0I7O0FBRUE7QUFDQXVCLFVBQUlhLFNBQUosR0FBZ0JFLFFBQWhCO0FBQ0FmLFVBQUljLFFBQUosQ0FBYSxDQUFiLEVBQWdCSCxLQUFoQixFQUF1QmxDLEtBQXZCLEVBQThCLENBQTlCOztBQUVBdUIsVUFBSWtCLE9BQUo7O0FBRUEsV0FBS3JDLE1BQUwsR0FBYzBCLEVBQWQ7QUFDRDs7Ozs7a0JBR1k3QixjIiwiZmlsZSI6IlZ1TWV0ZXJEaXNwbGF5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VEaXNwbGF5IGZyb20gJy4vQmFzZURpc3BsYXknO1xuaW1wb3J0IFJNUyBmcm9tICcuLi8uLi9jb21tb24vb3BlcmF0b3IvUk1TJztcblxuY29uc3QgbG9nMTAgPSBNYXRoLmxvZzEwO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgb2Zmc2V0OiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiAtMTQsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5YW5taWMnIH0sXG4gIH0sXG4gIG1pbjoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogLTgwLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICBtYXg6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDYsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG4gIHdpZHRoOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDYsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH1cbn1cblxuLyoqXG4gKiBTaW1wbGUgVlUtTWV0ZXIgdG8gdXNlZCBvbiBhIGBzaWduYWxgIHN0cmVhbS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNsaWVudC5zaW5rXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0cyBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm9mZnNldD0tMTRdIC0gZEIgb2Zmc2V0IGFwcGxpZWQgdG8gdGhlIHNpZ25hbC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5taW49LTgwXSAtIE1pbmltdW0gZGlzcGxheWVkIHZhbHVlIChpbiBkQikuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWF4PTZdIC0gTWF4aW11bSBkaXNwbGF5ZWQgdmFsdWUgKGluIGRCKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy53aWR0aD02XSAtIFdpZHRoIG9mIHRoZSBkaXNwbGF5IChpbiBwaXhlbHMpLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmhlaWdodD0xNTBdIC0gSGVpZ2h0IG9mIHRoZSBjYW52YXMuXG4gKiBAcGFyYW0ge0VsZW1lbnR8Q1NTU2VsZWN0b3J9IFtvcHRpb25zLmNvbnRhaW5lcj1udWxsXSAtIENvbnRhaW5lciBlbGVtZW50XG4gKiAgaW4gd2hpY2ggdG8gaW5zZXJ0IHRoZSBjYW52YXMuXG4gKiBAcGFyYW0ge0VsZW1lbnR8Q1NTU2VsZWN0b3J9IFtvcHRpb25zLmNhbnZhcz1udWxsXSAtIENhbnZhcyBlbGVtZW50XG4gKiAgaW4gd2hpY2ggdG8gZHJhdy5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIGNvbnN0IGF1ZGlvQ29udGV4dCA9IG5ldyB3aW5kb3cuQXVkaW9Db250ZXh0KCk7XG4gKlxuICogbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICogICAuZ2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSlcbiAqICAgLnRoZW4oaW5pdClcbiAqICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKSk7XG4gKlxuICogZnVuY3Rpb24gaW5pdChzdHJlYW0pIHtcbiAqICAgY29uc3Qgc291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZU1lZGlhU3RyZWFtU291cmNlKHN0cmVhbSk7XG4gKlxuICogICBjb25zdCBhdWRpb0luTm9kZSA9IG5ldyBsZm8uc291cmNlLkF1ZGlvSW5Ob2RlKHtcbiAqICAgICBhdWRpb0NvbnRleHQ6IGF1ZGlvQ29udGV4dCxcbiAqICAgICBzb3VyY2VOb2RlOiBzb3VyY2UsXG4gKiAgIH0pO1xuICpcbiAqICAgY29uc3QgdnVNZXRlciA9IG5ldyBsZm8uc2luay5WdU1ldGVyRGlzcGxheSh7XG4gKiAgICAgY2FudmFzOiAnI3Z1LW1ldGVyJyxcbiAqICAgfSk7XG4gKlxuICogICBhdWRpb0luTm9kZS5jb25uZWN0KHZ1TWV0ZXIpO1xuICogICBhdWRpb0luTm9kZS5zdGFydCgpO1xuICogfVxuICovXG5jbGFzcyBWdU1ldGVyRGlzcGxheSBleHRlbmRzIEJhc2VEaXNwbGF5IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMsIGZhbHNlKTtcblxuICAgIHRoaXMucm1zT3BlcmF0b3IgPSBuZXcgUk1TKCk7XG5cbiAgICB0aGlzLmxhc3REQiA9IDA7XG4gICAgdGhpcy5wZWFrID0ge1xuICAgICAgdmFsdWU6IDAsXG4gICAgICB0aW1lOiAwLFxuICAgIH1cblxuICAgIHRoaXMucGVha0xpZmV0aW1lID0gMTsgLy8gc2VjXG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5ybXNPcGVyYXRvci5pbml0U3RyZWFtKHRoaXMuc3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMDsgLy8gc2VjXG4gICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy5wYXJhbXMuZ2V0KCdvZmZzZXQnKTsgLy8gb2Zmc2V0IHplcm8gb2YgdGhlIHZ1IG1ldGVyXG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5jYW52YXNIZWlnaHQ7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuXG4gICAgY29uc3QgbGFzdERCID0gdGhpcy5sYXN0REI7XG4gICAgY29uc3QgcGVhayA9IHRoaXMucGVhaztcblxuICAgIGNvbnN0IHJlZCA9ICcjZmYyMTIxJztcbiAgICBjb25zdCB5ZWxsb3cgPSAnI2ZmZmYxZic7XG4gICAgY29uc3QgZ3JlZW4gPSAnIzAwZmYwMCc7XG5cbiAgICAvLyBoYW5kbGUgY3VycmVudCBkYiB2YWx1ZVxuICAgIGNvbnN0IHJtcyA9IHRoaXMucm1zT3BlcmF0b3IuaW5wdXRTaWduYWwoZnJhbWUuZGF0YSk7XG4gICAgbGV0IGRCID0gMjAgKiBsb2cxMChybXMpIC0gb2Zmc2V0O1xuXG4gICAgLy8gc2xvdyByZWxlYXNlIChjb3VsZCBwcm9iYWJseSBiZSBpbXByb3ZlZClcbiAgICBpZiAobGFzdERCID4gZEIpXG4gICAgICBkQiA9IGxhc3REQiAtIDY7XG5cbiAgICAvLyBoYW5kbGUgcGVha1xuICAgIGlmIChkQiA+IHBlYWsudmFsdWUgfHzCoChub3cgLSBwZWFrLnRpbWUpID4gdGhpcy5wZWFrTGlmZXRpbWUpIHtcbiAgICAgIHBlYWsudmFsdWUgPSBkQjtcbiAgICAgIHBlYWsudGltZSA9IG5vdztcbiAgICB9XG5cbiAgICBjb25zdCB5MCA9IHRoaXMuZ2V0WVBvc2l0aW9uKDApO1xuICAgIGNvbnN0IHkgPSB0aGlzLmdldFlQb3NpdGlvbihkQik7XG4gICAgY29uc3QgeVBlYWsgPSB0aGlzLmdldFlQb3NpdGlvbihwZWFrLnZhbHVlKTtcblxuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjdHguZmlsbFN0eWxlID0gJyMwMDAwMDAnO1xuICAgIGN0eC5maWxsUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIGNvbnN0IGdyYWRpZW50ID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIGhlaWdodCwgMCwgMCk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIGdyZWVuKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoKGhlaWdodCAtIHkwKSAvIGhlaWdodCwgeWVsbG93KTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgcmVkKTtcblxuICAgIC8vIGRCXG4gICAgY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgIGN0eC5maWxsUmVjdCgwLCB5LCB3aWR0aCwgaGVpZ2h0IC0geSk7XG5cbiAgICAvLyAwIGRCIG1hcmtlclxuICAgIGN0eC5maWxsU3R5bGUgPSAnI2RjZGNkYyc7XG4gICAgY3R4LmZpbGxSZWN0KDAsIHkwLCB3aWR0aCwgMik7XG5cbiAgICAvLyBwZWFrXG4gICAgY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgIGN0eC5maWxsUmVjdCgwLCB5UGVhaywgd2lkdGgsIDIpO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcblxuICAgIHRoaXMubGFzdERCID0gZEI7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVnVNZXRlckRpc3BsYXk7XG4iXX0=