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

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sqrt = Math.sqrt;

var definitions = {
  power: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Compute the Root Mean Square of a `signal`.
 *
 * _support `standalone` usage_
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Boolean} [options.power=false] - If `true` remove the "R" of the
 *  "Rms" and return the squared result (i.e. power).
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * // assuming some `AudioBuffer`
 * const audioInBuffer = new lfo.source.AudioInBuffer({
 *   audioBuffer: audioBuffer,
 *   frameSize: 512,
 * });
 *
 * const rms = new lfo.operator.Rms();
 * const logger = new lfo.sink.Logger({ data: true });
 *
 * audioInBuffer.connect(rms);
 * rms.connect(logger);
 *
 * audioInBuffer.start();
 */

var Rms = function (_BaseLfo) {
  (0, _inherits3.default)(Rms, _BaseLfo);

  function Rms() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Rms);
    return (0, _possibleConstructorReturn3.default)(this, (Rms.__proto__ || (0, _getPrototypeOf2.default)(Rms)).call(this, definitions, options));
  }

  /** @private */


  (0, _createClass3.default)(Rms, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      this.streamParams.frameSize = 1;
      this.streamParams.frameType = 'scalar';
      this.streamParams.description = ['rms'];

      this.propagateStreamParams();
    }

    /**
     * Allows for the use of a `Rms` outside a graph (e.g. inside
     * another node). Return the rms of the given signal block.
     *
     * @param {Number} signal - Signal block to be computed.
     * @return {Number} - rms of the input signal.
     *
     * @example
     * import * as lfo from 'waves-lfo/client';
     *
     * const rms = new lfo.operator.Rms();
     * rms.initStream({ frameType: 'signal', frameSize: 1000 });
     *
     * const results = rms.inputSignal([...values]);
     */

  }, {
    key: 'inputSignal',
    value: function inputSignal(signal) {
      var power = this.params.get('power');
      var length = signal.length;
      var rms = 0;

      for (var i = 0; i < length; i++) {
        rms += signal[i] * signal[i];
      }rms = rms / length;

      if (!power) rms = sqrt(rms);

      return rms;
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      this.frame.data[0] = this.inputSignal(frame.data);
    }
  }]);
  return Rms;
}(_BaseLfo3.default);

exports.default = Rms;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJtcy5qcyJdLCJuYW1lcyI6WyJzcXJ0IiwiTWF0aCIsImRlZmluaXRpb25zIiwicG93ZXIiLCJ0eXBlIiwiZGVmYXVsdCIsIm1ldGFzIiwia2luZCIsIlJtcyIsIm9wdGlvbnMiLCJwcmV2U3RyZWFtUGFyYW1zIiwicHJlcGFyZVN0cmVhbVBhcmFtcyIsInN0cmVhbVBhcmFtcyIsImZyYW1lU2l6ZSIsImZyYW1lVHlwZSIsImRlc2NyaXB0aW9uIiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwic2lnbmFsIiwicGFyYW1zIiwiZ2V0IiwibGVuZ3RoIiwicm1zIiwiaSIsImZyYW1lIiwiZGF0YSIsImlucHV0U2lnbmFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFNQSxPQUFPQyxLQUFLRCxJQUFsQjs7QUFFQSxJQUFNRSxjQUFjO0FBQ2xCQyxTQUFPO0FBQ0xDLFVBQU0sU0FERDtBQUVMQyxhQUFTLEtBRko7QUFHTEMsV0FBTyxFQUFFQyxNQUFNLFNBQVI7QUFIRjtBQURXLENBQXBCOztBQVFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTRCTUMsRzs7O0FBQ0osaUJBQTBCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7QUFBQSwySEFDbEJQLFdBRGtCLEVBQ0xPLE9BREs7QUFFekI7O0FBRUQ7Ozs7O3dDQUNvQkMsZ0IsRUFBa0I7QUFDcEMsV0FBS0MsbUJBQUwsQ0FBeUJELGdCQUF6Qjs7QUFFQSxXQUFLRSxZQUFMLENBQWtCQyxTQUFsQixHQUE4QixDQUE5QjtBQUNBLFdBQUtELFlBQUwsQ0FBa0JFLFNBQWxCLEdBQThCLFFBQTlCO0FBQ0EsV0FBS0YsWUFBTCxDQUFrQkcsV0FBbEIsR0FBZ0MsQ0FBQyxLQUFELENBQWhDOztBQUVBLFdBQUtDLHFCQUFMO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQ0FlWUMsTSxFQUFRO0FBQ2xCLFVBQU1kLFFBQVEsS0FBS2UsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE9BQWhCLENBQWQ7QUFDQSxVQUFNQyxTQUFTSCxPQUFPRyxNQUF0QjtBQUNBLFVBQUlDLE1BQU0sQ0FBVjs7QUFFQSxXQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUYsTUFBcEIsRUFBNEJFLEdBQTVCO0FBQ0VELGVBQVFKLE9BQU9LLENBQVAsSUFBWUwsT0FBT0ssQ0FBUCxDQUFwQjtBQURGLE9BR0FELE1BQU1BLE1BQU1ELE1BQVo7O0FBRUEsVUFBSSxDQUFDakIsS0FBTCxFQUNFa0IsTUFBTXJCLEtBQUtxQixHQUFMLENBQU47O0FBRUYsYUFBT0EsR0FBUDtBQUNEOztBQUVEOzs7O2tDQUNjRSxLLEVBQU87QUFDbkIsV0FBS0EsS0FBTCxDQUFXQyxJQUFYLENBQWdCLENBQWhCLElBQXFCLEtBQUtDLFdBQUwsQ0FBaUJGLE1BQU1DLElBQXZCLENBQXJCO0FBQ0Q7Ozs7O2tCQUdZaEIsRyIsImZpbGUiOiJSbXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuXG5jb25zdCBzcXJ0ID0gTWF0aC5zcXJ0O1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgcG93ZXI6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG59O1xuXG4vKipcbiAqIENvbXB1dGUgdGhlIFJvb3QgTWVhbiBTcXVhcmUgb2YgYSBgc2lnbmFsYC5cbiAqXG4gKiBfc3VwcG9ydCBgc3RhbmRhbG9uZWAgdXNhZ2VfXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24ub3BlcmF0b3JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucG93ZXI9ZmFsc2VdIC0gSWYgYHRydWVgIHJlbW92ZSB0aGUgXCJSXCIgb2YgdGhlXG4gKiAgXCJSbXNcIiBhbmQgcmV0dXJuIHRoZSBzcXVhcmVkIHJlc3VsdCAoaS5lLiBwb3dlcikuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiAvLyBhc3N1bWluZyBzb21lIGBBdWRpb0J1ZmZlcmBcbiAqIGNvbnN0IGF1ZGlvSW5CdWZmZXIgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luQnVmZmVyKHtcbiAqICAgYXVkaW9CdWZmZXI6IGF1ZGlvQnVmZmVyLFxuICogICBmcmFtZVNpemU6IDUxMixcbiAqIH0pO1xuICpcbiAqIGNvbnN0IHJtcyA9IG5ldyBsZm8ub3BlcmF0b3IuUm1zKCk7XG4gKiBjb25zdCBsb2dnZXIgPSBuZXcgbGZvLnNpbmsuTG9nZ2VyKHsgZGF0YTogdHJ1ZSB9KTtcbiAqXG4gKiBhdWRpb0luQnVmZmVyLmNvbm5lY3Qocm1zKTtcbiAqIHJtcy5jb25uZWN0KGxvZ2dlcik7XG4gKlxuICogYXVkaW9JbkJ1ZmZlci5zdGFydCgpO1xuICovXG5jbGFzcyBSbXMgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IDE7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3NjYWxhcic7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZGVzY3JpcHRpb24gPSBbJ3JtcyddO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3MgZm9yIHRoZSB1c2Ugb2YgYSBgUm1zYCBvdXRzaWRlIGEgZ3JhcGggKGUuZy4gaW5zaWRlXG4gICAqIGFub3RoZXIgbm9kZSkuIFJldHVybiB0aGUgcm1zIG9mIHRoZSBnaXZlbiBzaWduYWwgYmxvY2suXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzaWduYWwgLSBTaWduYWwgYmxvY2sgdG8gYmUgY29tcHV0ZWQuXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBybXMgb2YgdGhlIGlucHV0IHNpZ25hbC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICAgKlxuICAgKiBjb25zdCBybXMgPSBuZXcgbGZvLm9wZXJhdG9yLlJtcygpO1xuICAgKiBybXMuaW5pdFN0cmVhbSh7IGZyYW1lVHlwZTogJ3NpZ25hbCcsIGZyYW1lU2l6ZTogMTAwMCB9KTtcbiAgICpcbiAgICogY29uc3QgcmVzdWx0cyA9IHJtcy5pbnB1dFNpZ25hbChbLi4udmFsdWVzXSk7XG4gICAqL1xuICBpbnB1dFNpZ25hbChzaWduYWwpIHtcbiAgICBjb25zdCBwb3dlciA9IHRoaXMucGFyYW1zLmdldCgncG93ZXInKTtcbiAgICBjb25zdCBsZW5ndGggPSBzaWduYWwubGVuZ3RoO1xuICAgIGxldCBybXMgPSAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKylcbiAgICAgIHJtcyArPSAoc2lnbmFsW2ldICogc2lnbmFsW2ldKTtcblxuICAgIHJtcyA9IHJtcyAvIGxlbmd0aDtcblxuICAgIGlmICghcG93ZXIpXG4gICAgICBybXMgPSBzcXJ0KHJtcyk7XG5cbiAgICByZXR1cm4gcm1zO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTaWduYWwoZnJhbWUpIHtcbiAgICB0aGlzLmZyYW1lLmRhdGFbMF0gPSB0aGlzLmlucHV0U2lnbmFsKGZyYW1lLmRhdGEpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJtcztcbiJdfQ==