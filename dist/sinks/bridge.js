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
 * Create a bridge between `push` to `pull` paradigms.
 * Alias `outFrame` to `data` and accumulate incomming frames into it.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy9icmlkZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7Ozs7Ozs7SUFPakIsTUFBTTtZQUFOLE1BQU07O0FBQ2QsV0FEUSxNQUFNLENBQ2IsT0FBTyxFQUFFLE9BQU8sRUFBRTswQkFEWCxNQUFNOztBQUV2QiwrQkFGaUIsTUFBTSw2Q0FFakIsT0FBTyxFQUFFLEVBQUUsRUFBRTs7QUFFbkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7R0FDaEM7O2VBTmtCLE1BQU07O1dBUWQsdUJBQUc7QUFDWixpQ0FUaUIsTUFBTSw2Q0FTSDtBQUNwQixVQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7S0FDdEI7OztXQUVJLGlCQUFHO0FBQ04sVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0tBQ3RCOzs7U0Fma0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiZXM2L3NpbmtzL2JyaWRnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG5cbi8qKlxuICogQ3JlYXRlIGEgYnJpZGdlIGJldHdlZW4gYHB1c2hgIHRvIGBwdWxsYCBwYXJhZGlnbXMuXG4gKiBBbGlhcyBgb3V0RnJhbWVgIHRvIGBkYXRhYCBhbmQgYWNjdW11bGF0ZSBpbmNvbW1pbmcgZnJhbWVzIGludG8gaXQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJyaWRnZSBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zLCBwcm9jZXNzKSB7XG4gICAgc3VwZXIob3B0aW9ucywge30pO1xuXG4gICAgdGhpcy5wcm9jZXNzID0gcHJvY2Vzcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZGF0YSA9IHRoaXMub3V0RnJhbWUgPSBbXTtcbiAgfVxuXG4gIHNldHVwU3RyZWFtKCkge1xuICAgIHN1cGVyLnNldHVwU3RyZWFtKCk7XG4gICAgdGhpcy5kYXRhLmxlbmd0aCA9IDA7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmRhdGEubGVuZ3RoID0gMDtcbiAgfVxufVxuIl19