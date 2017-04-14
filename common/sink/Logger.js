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

var definitions = {
  time: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  },
  data: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  },
  metadata: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  },
  streamParams: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  },
  frameIndex: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Log `frame.time`, `frame.data`, `frame.metadata` and/or
 * `streamAttributes` of any node in the console.
 *
 * This sink can handle any type if input (`signal`, `vector`, `scalar`)
 *
 * @param {Object} options - Override parameters default values.
 * @param {Boolean} [options.time=false] - Log incomming `frame.time` if `true`.
 * @param {Boolean} [options.data=false] - Log incomming `frame.data` if `true`.
 * @param {Boolean} [options.metadata=false] - Log incomming `frame.metadata`
 *  if `true`.
 * @param {Boolean} [options.streamParams=false] - Log `streamParams` of the
 *  previous node when graph is started.
 * @param {Boolean} [options.frameIndex=false] - Log index of the incomming
 *  `frame`.
 *
 * @memberof module:common.sink
 *
 * @example
 * import * as lfo from 'waves-lfo/common';
 *
 * const logger = new lfo.sink.Logger({ data: true });
 * whateverOperator.connect(logger);
 */

var Logger = function (_BaseLfo) {
  (0, _inherits3.default)(Logger, _BaseLfo);

  function Logger(options) {
    (0, _classCallCheck3.default)(this, Logger);
    return (0, _possibleConstructorReturn3.default)(this, (Logger.__proto__ || (0, _getPrototypeOf2.default)(Logger)).call(this, definitions, options));
  }

  /** @private */


  (0, _createClass3.default)(Logger, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      if (this.params.get('streamParams') === true) console.log(prevStreamParams);

      this.frameIndex = 0;
    }

    /** @private */

  }, {
    key: 'processFunction',
    value: function processFunction(frame) {
      if (this.params.get('frameIndex') === true) console.log(this.frameIndex++);

      if (this.params.get('time') === true) console.log(frame.time);

      if (this.params.get('data') === true) console.log(frame.data);

      if (this.params.get('metadata') === true) console.log(frame.metadata);
    }
  }]);
  return Logger;
}(_BaseLfo3.default);

exports.default = Logger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxvZ2dlci5qcyJdLCJuYW1lcyI6WyJkZWZpbml0aW9ucyIsInRpbWUiLCJ0eXBlIiwiZGVmYXVsdCIsIm1ldGFzIiwia2luZCIsImRhdGEiLCJtZXRhZGF0YSIsInN0cmVhbVBhcmFtcyIsImZyYW1lSW5kZXgiLCJMb2dnZXIiLCJvcHRpb25zIiwicHJldlN0cmVhbVBhcmFtcyIsInBhcmFtcyIsImdldCIsImNvbnNvbGUiLCJsb2ciLCJmcmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTUEsY0FBYztBQUNsQkMsUUFBTTtBQUNKQyxVQUFNLFNBREY7QUFFSkMsYUFBUyxLQUZMO0FBR0pDLFdBQU8sRUFBRUMsTUFBTSxTQUFSO0FBSEgsR0FEWTtBQU1sQkMsUUFBTTtBQUNKSixVQUFNLFNBREY7QUFFSkMsYUFBUyxLQUZMO0FBR0pDLFdBQU8sRUFBRUMsTUFBTSxTQUFSO0FBSEgsR0FOWTtBQVdsQkUsWUFBVTtBQUNSTCxVQUFNLFNBREU7QUFFUkMsYUFBUyxLQUZEO0FBR1JDLFdBQU8sRUFBRUMsTUFBTSxTQUFSO0FBSEMsR0FYUTtBQWdCbEJHLGdCQUFjO0FBQ1pOLFVBQU0sU0FETTtBQUVaQyxhQUFTLEtBRkc7QUFHWkMsV0FBTyxFQUFFQyxNQUFNLFNBQVI7QUFISyxHQWhCSTtBQXFCbEJJLGNBQVk7QUFDVlAsVUFBTSxTQURJO0FBRVZDLGFBQVMsS0FGQztBQUdWQyxXQUFPLEVBQUVDLE1BQU0sU0FBUjtBQUhHO0FBckJNLENBQXBCOztBQTRCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXdCTUssTTs7O0FBQ0osa0JBQVlDLE9BQVosRUFBcUI7QUFBQTtBQUFBLGlJQUNiWCxXQURhLEVBQ0FXLE9BREE7QUFFcEI7O0FBRUQ7Ozs7O3dDQUNvQkMsZ0IsRUFBa0I7QUFDcEMsVUFBSSxLQUFLQyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsY0FBaEIsTUFBb0MsSUFBeEMsRUFDRUMsUUFBUUMsR0FBUixDQUFZSixnQkFBWjs7QUFFRixXQUFLSCxVQUFMLEdBQWtCLENBQWxCO0FBQ0Q7O0FBRUQ7Ozs7b0NBQ2dCUSxLLEVBQU87QUFDckIsVUFBSSxLQUFLSixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsWUFBaEIsTUFBa0MsSUFBdEMsRUFDRUMsUUFBUUMsR0FBUixDQUFZLEtBQUtQLFVBQUwsRUFBWjs7QUFFRixVQUFJLEtBQUtJLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixNQUFoQixNQUE0QixJQUFoQyxFQUNFQyxRQUFRQyxHQUFSLENBQVlDLE1BQU1oQixJQUFsQjs7QUFFRixVQUFJLEtBQUtZLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixNQUFoQixNQUE0QixJQUFoQyxFQUNFQyxRQUFRQyxHQUFSLENBQVlDLE1BQU1YLElBQWxCOztBQUVGLFVBQUksS0FBS08sTUFBTCxDQUFZQyxHQUFaLENBQWdCLFVBQWhCLE1BQWdDLElBQXBDLEVBQ0VDLFFBQVFDLEdBQVIsQ0FBWUMsTUFBTVYsUUFBbEI7QUFDSDs7Ozs7a0JBR1lHLE0iLCJmaWxlIjoiTG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIHRpbWU6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH1cbiAgfSxcbiAgZGF0YToge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfVxuICB9LFxuICBtZXRhZGF0YToge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfVxuICB9LFxuICBzdHJlYW1QYXJhbXM6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH1cbiAgfSxcbiAgZnJhbWVJbmRleDoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfVxuICB9LFxufVxuXG4vKipcbiAqIExvZyBgZnJhbWUudGltZWAsIGBmcmFtZS5kYXRhYCwgYGZyYW1lLm1ldGFkYXRhYCBhbmQvb3JcbiAqIGBzdHJlYW1BdHRyaWJ1dGVzYCBvZiBhbnkgbm9kZSBpbiB0aGUgY29uc29sZS5cbiAqXG4gKiBUaGlzIHNpbmsgY2FuIGhhbmRsZSBhbnkgdHlwZSBpZiBpbnB1dCAoYHNpZ25hbGAsIGB2ZWN0b3JgLCBgc2NhbGFyYClcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIHBhcmFtZXRlcnMgZGVmYXVsdCB2YWx1ZXMuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnRpbWU9ZmFsc2VdIC0gTG9nIGluY29tbWluZyBgZnJhbWUudGltZWAgaWYgYHRydWVgLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5kYXRhPWZhbHNlXSAtIExvZyBpbmNvbW1pbmcgYGZyYW1lLmRhdGFgIGlmIGB0cnVlYC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMubWV0YWRhdGE9ZmFsc2VdIC0gTG9nIGluY29tbWluZyBgZnJhbWUubWV0YWRhdGFgXG4gKiAgaWYgYHRydWVgLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zdHJlYW1QYXJhbXM9ZmFsc2VdIC0gTG9nIGBzdHJlYW1QYXJhbXNgIG9mIHRoZVxuICogIHByZXZpb3VzIG5vZGUgd2hlbiBncmFwaCBpcyBzdGFydGVkLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5mcmFtZUluZGV4PWZhbHNlXSAtIExvZyBpbmRleCBvZiB0aGUgaW5jb21taW5nXG4gKiAgYGZyYW1lYC5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5zaW5rXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY29tbW9uJztcbiAqXG4gKiBjb25zdCBsb2dnZXIgPSBuZXcgbGZvLnNpbmsuTG9nZ2VyKHsgZGF0YTogdHJ1ZSB9KTtcbiAqIHdoYXRldmVyT3BlcmF0b3IuY29ubmVjdChsb2dnZXIpO1xuICovXG5jbGFzcyBMb2dnZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdzdHJlYW1QYXJhbXMnKSA9PT0gdHJ1ZSlcbiAgICAgIGNvbnNvbGUubG9nKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5mcmFtZUluZGV4ID0gMDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzRnVuY3Rpb24oZnJhbWUpIHtcbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdmcmFtZUluZGV4JykgPT09IHRydWUpXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmZyYW1lSW5kZXgrKyk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCd0aW1lJykgPT09IHRydWUpXG4gICAgICBjb25zb2xlLmxvZyhmcmFtZS50aW1lKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ2RhdGEnKSA9PT0gdHJ1ZSlcbiAgICAgIGNvbnNvbGUubG9nKGZyYW1lLmRhdGEpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnbWV0YWRhdGEnKSA9PT0gdHJ1ZSlcbiAgICAgIGNvbnNvbGUubG9nKGZyYW1lLm1ldGFkYXRhKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2dnZXI7XG4iXX0=