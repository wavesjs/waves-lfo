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
 * a NoOp Lfo
 */

var Noop = (function (_BaseLfo) {
  _inherits(Noop, _BaseLfo);

  function Noop(options) {
    _classCallCheck(this, Noop);

    _get(Object.getPrototypeOf(Noop.prototype), 'constructor', this).call(this, options);
  }

  _createClass(Noop, [{
    key: 'process',
    value: function process(time, frame, metaData) {
      this.outFrame.set(frame, 0);
      this.time = time;
      this.metaData = metaData;

      this.output();
    }
  }]);

  return Noop;
})(_coreBaseLfo2['default']);

exports['default'] = Noop;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbm9vcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzJCQUFvQixrQkFBa0I7Ozs7Ozs7O0lBS2pCLElBQUk7WUFBSixJQUFJOztBQUNaLFdBRFEsSUFBSSxDQUNYLE9BQU8sRUFBRTswQkFERixJQUFJOztBQUVyQiwrQkFGaUIsSUFBSSw2Q0FFZixPQUFPLEVBQUU7R0FDaEI7O2VBSGtCLElBQUk7O1dBS2hCLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFVBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QixVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFekIsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2Y7OztTQVhrQixJQUFJOzs7cUJBQUosSUFBSSIsImZpbGUiOiJlczYvb3BlcmF0b3JzL25vb3AuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuLyoqXG4gKiBhIE5vT3AgTGZvXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vb3AgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICB0aGlzLm91dEZyYW1lLnNldChmcmFtZSwgMCk7XG4gICAgdGhpcy50aW1lID0gdGltZTtcbiAgICB0aGlzLm1ldGFEYXRhID0gbWV0YURhdGE7XG5cbiAgICB0aGlzLm91dHB1dCgpO1xuICB9XG59XG4iXX0=