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

var Max = (function (_BaseLfo) {
  _inherits(Max, _BaseLfo);

  function Max(options) {
    _classCallCheck(this, Max);

    var defaults = {};
    _get(Object.getPrototypeOf(Max.prototype), 'constructor', this).call(this, options, defaults);
  }

  _createClass(Max, [{
    key: 'configureStream',
    value: function configureStream() {
      this.streamParams.frameSize = 1;
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var max = -Infinity;
      var value = undefined;
      var length = frame.length;

      for (var i = 0; i < length; i++) {
        value = frame[i];

        if (value > max) max = value;
      }

      this.time = time;
      this.outFrame[0] = max;
      this.metaData = metaData;

      this.output();
    }
  }]);

  return Max;
})(_coreBaseLfo2['default']);

exports['default'] = Max;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbWF4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7OztJQUVqQixHQUFHO1lBQUgsR0FBRzs7QUFDWCxXQURRLEdBQUcsQ0FDVixPQUFPLEVBQUU7MEJBREYsR0FBRzs7QUFFcEIsUUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLCtCQUhpQixHQUFHLDZDQUdkLE9BQU8sRUFBRSxRQUFRLEVBQUU7R0FDMUI7O2VBSmtCLEdBQUc7O1dBTVAsMkJBQUc7QUFDaEIsVUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0tBQ2pDOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixVQUFJLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUNwQixVQUFJLEtBQUssWUFBQSxDQUFDO0FBQ1YsVUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQzs7QUFFNUIsV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMvQixhQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVqQixZQUFJLEtBQUssR0FBRyxHQUFHLEVBQ2IsR0FBRyxHQUFHLEtBQUssQ0FBQztPQUNmOztBQUVELFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFVBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUV6QixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O1NBM0JrQixHQUFHOzs7cUJBQUgsR0FBRyIsImZpbGUiOiJlczYvb3BlcmF0b3JzL21heC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXggZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge307XG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuICB9XG5cbiAgY29uZmlndXJlU3RyZWFtKCkge1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IDE7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGxldCBtYXggPSAtSW5maW5pdHk7XG4gICAgbGV0IHZhbHVlO1xuICAgIGNvbnN0IGxlbmd0aCA9IGZyYW1lLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhbHVlID0gZnJhbWVbaV07XG5cbiAgICAgIGlmICh2YWx1ZSA+IG1heClcbiAgICAgICAgbWF4ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy50aW1lID0gdGltZTtcbiAgICB0aGlzLm91dEZyYW1lWzBdID0gbWF4O1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cbiJdfQ==