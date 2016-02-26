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

    _get(Object.getPrototypeOf(Bridge.prototype), 'constructor', this).call(this, options);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy9icmlkZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7Ozs7Ozs7SUFPakIsTUFBTTtZQUFOLE1BQU07O0FBQ2QsV0FEUSxNQUFNLENBQ2IsT0FBTyxFQUFFLE9BQU8sRUFBRTswQkFEWCxNQUFNOztBQUV2QiwrQkFGaUIsTUFBTSw2Q0FFakIsT0FBTyxFQUFFOztBQUVmLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsQyxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0dBQ2hDOztlQU5rQixNQUFNOztXQVFkLHVCQUFHO0FBQ1osaUNBVGlCLE1BQU0sNkNBU0g7QUFDcEIsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0tBQ3RCOzs7V0FFSSxpQkFBRztBQUNOLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztLQUN0Qjs7O1NBZmtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6ImVzNi9zaW5rcy9icmlkZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuXG4vKipcbiAqIENyZWF0ZSBhIGJyaWRnZSBiZXR3ZWVuIGBwdXNoYCB0byBgcHVsbGAgcGFyYWRpZ21zLlxuICogQWxpYXMgYG91dEZyYW1lYCB0byBgZGF0YWAgYW5kIGFjY3VtdWxhdGUgaW5jb21taW5nIGZyYW1lcyBpbnRvIGl0LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmlkZ2UgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucywgcHJvY2Vzcykge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgdGhpcy5wcm9jZXNzID0gcHJvY2Vzcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZGF0YSA9IHRoaXMub3V0RnJhbWUgPSBbXTtcbiAgfVxuXG4gIHNldHVwU3RyZWFtKCkge1xuICAgIHN1cGVyLnNldHVwU3RyZWFtKCk7XG4gICAgdGhpcy5kYXRhLmxlbmd0aCA9IDA7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmRhdGEubGVuZ3RoID0gMDtcbiAgfVxufVxuIl19