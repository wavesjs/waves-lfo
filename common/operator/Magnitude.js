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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sqrt = Math.sqrt;

var definitions = {
  normalize: {
    type: 'boolean',
    default: true,
    metas: { kind: 'dynamic' }
  },
  power: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Compute the magnitude of a `vector` input.
 *
 * _support `standalone` usage_
 *
 * @param {Object} options - Override default parameters.
 * @param {Boolean} [options.normalize=true] - Normalize output according to
 *  the vector size.
 * @param {Boolean} [options.power=false] - If true, returns the squared
 *  magnitude (power).
 *
 * @memberof module:common.operator
 *
 * @example
 * import * as lfo from 'waves-lfo/common';
 *
 * const eventIn = new lfo.source.EventIn({ frameSize: 2, frameType: 'vector' });
 * const magnitude = new lfo.operator.Magnitude();
 * const logger = new lfo.sink.Logger({ outFrame: true });
 *
 * eventIn.connect(magnitude);
 * magnitude.connect(logger);
 * eventIn.start();
 *
 * eventIn.process(null, [1, 1]);
 * > [1]
 * eventIn.process(null, [2, 2]);
 * > [2.82842712475]
 * eventIn.process(null, [3, 3]);
 * > [4.24264068712]
 */

var Magnitude = function (_BaseLfo) {
  (0, _inherits3.default)(Magnitude, _BaseLfo);

  function Magnitude() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Magnitude);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Magnitude.__proto__ || (0, _getPrototypeOf2.default)(Magnitude)).call(this, definitions, options));

    _this._normalize = _this.params.get('normalize');
    _this._power = _this.params.get('power');
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Magnitude, [{
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      (0, _get3.default)(Magnitude.prototype.__proto__ || (0, _getPrototypeOf2.default)(Magnitude.prototype), 'onParamUpdate', this).call(this, name, value, metas);

      switch (name) {
        case 'normalize':
          this._normalize = value;
          break;
        case 'power':
          this._power = value;
          break;
      }
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);
      this.streamParams.frameSize = 1;
      this.streamParams.frameType = 'scalar';
      this.streamParams.description = ['magnitude'];
      this.propagateStreamParams();
    }

    /**
     * Use the `Magnitude` operator in `standalone` mode (i.e. outside of a graph).
     *
     * @param {Array|Float32Array} values - Values to process.
     * @return {Number} - Magnitude value.
     *
     * @example
     * import * as lfo from 'waves-lfo/client';
     *
     * const magnitude = new lfo.operator.Magnitude({ power: true });
     * magnitude.initStream({ frameType: 'vector', frameSize: 3 });
     * magnitude.inputVector([3, 3]);
     * > 4.24264068712
     */

  }, {
    key: 'inputVector',
    value: function inputVector(values) {
      var length = values.length;
      var sum = 0;

      for (var i = 0; i < length; i++) {
        sum += values[i] * values[i];
      }var mag = sum;

      if (this._normalize) mag /= length;

      if (!this._power) mag = sqrt(mag);

      return mag;
    }

    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame) {
      this.frame.data[0] = this.inputVector(frame.data);
    }
  }]);
  return Magnitude;
}(_BaseLfo3.default);

exports.default = Magnitude;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1hZ25pdHVkZS5qcyJdLCJuYW1lcyI6WyJzcXJ0IiwiTWF0aCIsImRlZmluaXRpb25zIiwibm9ybWFsaXplIiwidHlwZSIsImRlZmF1bHQiLCJtZXRhcyIsImtpbmQiLCJwb3dlciIsIk1hZ25pdHVkZSIsIm9wdGlvbnMiLCJfbm9ybWFsaXplIiwicGFyYW1zIiwiZ2V0IiwiX3Bvd2VyIiwibmFtZSIsInZhbHVlIiwicHJldlN0cmVhbVBhcmFtcyIsInByZXBhcmVTdHJlYW1QYXJhbXMiLCJzdHJlYW1QYXJhbXMiLCJmcmFtZVNpemUiLCJmcmFtZVR5cGUiLCJkZXNjcmlwdGlvbiIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsInZhbHVlcyIsImxlbmd0aCIsInN1bSIsImkiLCJtYWciLCJmcmFtZSIsImRhdGEiLCJpbnB1dFZlY3RvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBLElBQU1BLE9BQU9DLEtBQUtELElBQWxCOztBQUVBLElBQU1FLGNBQWM7QUFDbEJDLGFBQVc7QUFDVEMsVUFBTSxTQURHO0FBRVRDLGFBQVMsSUFGQTtBQUdUQyxXQUFPLEVBQUVDLE1BQU0sU0FBUjtBQUhFLEdBRE87QUFNbEJDLFNBQU87QUFDTEosVUFBTSxTQUREO0FBRUxDLGFBQVMsS0FGSjtBQUdMQyxXQUFPLEVBQUVDLE1BQU0sU0FBUjtBQUhGO0FBTlcsQ0FBcEI7O0FBYUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBK0JNRSxTOzs7QUFDSix1QkFBMEI7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFBQSw0SUFDbEJSLFdBRGtCLEVBQ0xRLE9BREs7O0FBR3hCLFVBQUtDLFVBQUwsR0FBa0IsTUFBS0MsTUFBTCxDQUFZQyxHQUFaLENBQWdCLFdBQWhCLENBQWxCO0FBQ0EsVUFBS0MsTUFBTCxHQUFjLE1BQUtGLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixPQUFoQixDQUFkO0FBSndCO0FBS3pCOztBQUVEOzs7OztrQ0FDY0UsSSxFQUFNQyxLLEVBQU9WLEssRUFBTztBQUNoQyxnSkFBb0JTLElBQXBCLEVBQTBCQyxLQUExQixFQUFpQ1YsS0FBakM7O0FBRUEsY0FBUVMsSUFBUjtBQUNFLGFBQUssV0FBTDtBQUNFLGVBQUtKLFVBQUwsR0FBa0JLLEtBQWxCO0FBQ0E7QUFDRixhQUFLLE9BQUw7QUFDRSxlQUFLRixNQUFMLEdBQWNFLEtBQWQ7QUFDQTtBQU5KO0FBUUQ7O0FBRUQ7Ozs7d0NBQ29CQyxnQixFQUFrQjtBQUNwQyxXQUFLQyxtQkFBTCxDQUF5QkQsZ0JBQXpCO0FBQ0EsV0FBS0UsWUFBTCxDQUFrQkMsU0FBbEIsR0FBOEIsQ0FBOUI7QUFDQSxXQUFLRCxZQUFMLENBQWtCRSxTQUFsQixHQUE4QixRQUE5QjtBQUNBLFdBQUtGLFlBQUwsQ0FBa0JHLFdBQWxCLEdBQWdDLENBQUMsV0FBRCxDQUFoQztBQUNBLFdBQUtDLHFCQUFMO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7O2dDQWNZQyxNLEVBQVE7QUFDbEIsVUFBTUMsU0FBU0QsT0FBT0MsTUFBdEI7QUFDQSxVQUFJQyxNQUFNLENBQVY7O0FBRUEsV0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlGLE1BQXBCLEVBQTRCRSxHQUE1QjtBQUNFRCxlQUFRRixPQUFPRyxDQUFQLElBQVlILE9BQU9HLENBQVAsQ0FBcEI7QUFERixPQUdBLElBQUlDLE1BQU1GLEdBQVY7O0FBRUEsVUFBSSxLQUFLZixVQUFULEVBQ0VpQixPQUFPSCxNQUFQOztBQUVGLFVBQUksQ0FBQyxLQUFLWCxNQUFWLEVBQ0VjLE1BQU01QixLQUFLNEIsR0FBTCxDQUFOOztBQUVGLGFBQU9BLEdBQVA7QUFDRDs7QUFFRDs7OztrQ0FDY0MsSyxFQUFPO0FBQ25CLFdBQUtBLEtBQUwsQ0FBV0MsSUFBWCxDQUFnQixDQUFoQixJQUFxQixLQUFLQyxXQUFMLENBQWlCRixNQUFNQyxJQUF2QixDQUFyQjtBQUNEOzs7OztrQkFHWXJCLFMiLCJmaWxlIjoiTWFnbml0dWRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcblxuY29uc3Qgc3FydCA9IE1hdGguc3FydDtcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIG5vcm1hbGl6ZToge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICBwb3dlcjoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfVxufVxuXG4vKipcbiAqIENvbXB1dGUgdGhlIG1hZ25pdHVkZSBvZiBhIGB2ZWN0b3JgIGlucHV0LlxuICpcbiAqIF9zdXBwb3J0IGBzdGFuZGFsb25lYCB1c2FnZV9cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMubm9ybWFsaXplPXRydWVdIC0gTm9ybWFsaXplIG91dHB1dCBhY2NvcmRpbmcgdG9cbiAqICB0aGUgdmVjdG9yIHNpemUuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnBvd2VyPWZhbHNlXSAtIElmIHRydWUsIHJldHVybnMgdGhlIHNxdWFyZWRcbiAqICBtYWduaXR1ZGUgKHBvd2VyKS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NvbW1vbic7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oeyBmcmFtZVNpemU6IDIsIGZyYW1lVHlwZTogJ3ZlY3RvcicgfSk7XG4gKiBjb25zdCBtYWduaXR1ZGUgPSBuZXcgbGZvLm9wZXJhdG9yLk1hZ25pdHVkZSgpO1xuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IG91dEZyYW1lOiB0cnVlIH0pO1xuICpcbiAqIGV2ZW50SW4uY29ubmVjdChtYWduaXR1ZGUpO1xuICogbWFnbml0dWRlLmNvbm5lY3QobG9nZ2VyKTtcbiAqIGV2ZW50SW4uc3RhcnQoKTtcbiAqXG4gKiBldmVudEluLnByb2Nlc3MobnVsbCwgWzEsIDFdKTtcbiAqID4gWzFdXG4gKiBldmVudEluLnByb2Nlc3MobnVsbCwgWzIsIDJdKTtcbiAqID4gWzIuODI4NDI3MTI0NzVdXG4gKiBldmVudEluLnByb2Nlc3MobnVsbCwgWzMsIDNdKTtcbiAqID4gWzQuMjQyNjQwNjg3MTJdXG4gKi9cbmNsYXNzIE1hZ25pdHVkZSBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9ub3JtYWxpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ25vcm1hbGl6ZScpO1xuICAgIHRoaXMuX3Bvd2VyID0gdGhpcy5wYXJhbXMuZ2V0KCdwb3dlcicpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIG9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKSB7XG4gICAgc3VwZXIub25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpO1xuXG4gICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICBjYXNlICdub3JtYWxpemUnOlxuICAgICAgICB0aGlzLl9ub3JtYWxpemUgPSB2YWx1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdwb3dlcic6XG4gICAgICAgIHRoaXMuX3Bvd2VyID0gdmFsdWU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gMTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVR5cGUgPSAnc2NhbGFyJztcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5kZXNjcmlwdGlvbiA9IFsnbWFnbml0dWRlJ107XG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgdGhlIGBNYWduaXR1ZGVgIG9wZXJhdG9yIGluIGBzdGFuZGFsb25lYCBtb2RlIChpLmUuIG91dHNpZGUgb2YgYSBncmFwaCkuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl8RmxvYXQzMkFycmF5fSB2YWx1ZXMgLSBWYWx1ZXMgdG8gcHJvY2Vzcy5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIE1hZ25pdHVkZSB2YWx1ZS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICAgKlxuICAgKiBjb25zdCBtYWduaXR1ZGUgPSBuZXcgbGZvLm9wZXJhdG9yLk1hZ25pdHVkZSh7IHBvd2VyOiB0cnVlIH0pO1xuICAgKiBtYWduaXR1ZGUuaW5pdFN0cmVhbSh7IGZyYW1lVHlwZTogJ3ZlY3RvcicsIGZyYW1lU2l6ZTogMyB9KTtcbiAgICogbWFnbml0dWRlLmlucHV0VmVjdG9yKFszLCAzXSk7XG4gICAqID4gNC4yNDI2NDA2ODcxMlxuICAgKi9cbiAgaW5wdXRWZWN0b3IodmFsdWVzKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aDtcbiAgICBsZXQgc3VtID0gMDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspXG4gICAgICBzdW0gKz0gKHZhbHVlc1tpXSAqIHZhbHVlc1tpXSk7XG5cbiAgICBsZXQgbWFnID0gc3VtO1xuXG4gICAgaWYgKHRoaXMuX25vcm1hbGl6ZSlcbiAgICAgIG1hZyAvPSBsZW5ndGg7XG5cbiAgICBpZiAoIXRoaXMuX3Bvd2VyKVxuICAgICAgbWFnID0gc3FydChtYWcpO1xuXG4gICAgcmV0dXJuIG1hZztcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKGZyYW1lKSB7XG4gICAgdGhpcy5mcmFtZS5kYXRhWzBdID0gdGhpcy5pbnB1dFZlY3RvcihmcmFtZS5kYXRhKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYWduaXR1ZGU7XG4iXX0=