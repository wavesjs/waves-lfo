'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreBaseLfo = require('../core/base-lfo');

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

/**
 *  accumulate intput and expose it - allow view (see waves-ui) to pull data for rendering
 *  bridge between `push` to `pull` paradigm
 */

var Bridge = (function (_BaseLfo) {
  _inherits(Bridge, _BaseLfo);

  function Bridge(options, process) {
    _classCallCheck(this, Bridge);

    _get(Object.getPrototypeOf(Bridge.prototype), 'constructor', this).call(this, options, {});

    this.process = process.bind(this);
    this.data = this.outFrame = [];
  }

  _createClass(Bridge, [{
    key: 'setupStream',
    value: function setupStream() {
      _get(Object.getPrototypeOf(Bridge.prototype), 'setupStream', this).call(this);
      this.data.length = 0;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.data.length = 0;
    }
  }]);

  return Bridge;
})(_coreBaseLfo2['default']);

exports['default'] = Bridge;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy9icmlkZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7Ozs7Ozs7SUFPakIsTUFBTTtZQUFOLE1BQU07O0FBQ2QsV0FEUSxNQUFNLENBQ2IsT0FBTyxFQUFFLE9BQU8sRUFBRTswQkFEWCxNQUFNOztBQUV2QiwrQkFGaUIsTUFBTSw2Q0FFakIsT0FBTyxFQUFFLEVBQUUsRUFBRTs7QUFFbkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7R0FDaEM7O2VBTmtCLE1BQU07O1dBUWQsdUJBQUc7QUFDWixpQ0FUaUIsTUFBTSw2Q0FTSDtBQUNwQixVQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7S0FDdEI7OztXQUVJLGlCQUFHO0FBQ04sVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0tBQ3RCOzs7U0Fma0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiZXM2L3NpbmtzL2JyaWRnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG5cbi8qKlxuICogIGFjY3VtdWxhdGUgaW50cHV0IGFuZCBleHBvc2UgaXQgLSBhbGxvdyB2aWV3IChzZWUgd2F2ZXMtdWkpIHRvIHB1bGwgZGF0YSBmb3IgcmVuZGVyaW5nXG4gKiAgYnJpZGdlIGJldHdlZW4gYHB1c2hgIHRvIGBwdWxsYCBwYXJhZGlnbVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmlkZ2UgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucywgcHJvY2Vzcykge1xuICAgIHN1cGVyKG9wdGlvbnMsIHt9KTtcblxuICAgIHRoaXMucHJvY2VzcyA9IHByb2Nlc3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLmRhdGEgPSB0aGlzLm91dEZyYW1lID0gW107XG4gIH1cblxuICBzZXR1cFN0cmVhbSgpIHtcbiAgICBzdXBlci5zZXR1cFN0cmVhbSgpO1xuICAgIHRoaXMuZGF0YS5sZW5ndGggPSAwO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5kYXRhLmxlbmd0aCA9IDA7XG4gIH1cbn0iXX0=