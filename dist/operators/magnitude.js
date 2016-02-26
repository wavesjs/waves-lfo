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

var Magnitude = (function (_BaseLfo) {
  _inherits(Magnitude, _BaseLfo);

  function Magnitude(options) {
    _classCallCheck(this, Magnitude);

    _get(Object.getPrototypeOf(Magnitude.prototype), 'constructor', this).call(this, {
      normalize: true,
      power: false
    }, options);
  }

  _createClass(Magnitude, [{
    key: 'initialize',
    value: function initialize(inStreamParams) {
      _get(Object.getPrototypeOf(Magnitude.prototype), 'initialize', this).call(this, inStreamParams, {
        frameSize: 1
      });
    }
  }, {
    key: 'inputArray',
    value: function inputArray(frame) {
      var outFrame = this.outFrame;
      var frameSize = frame.length;
      var sum = 0;

      for (var i = 0; i < frameSize; i++) {
        sum += frame[i] * frame[i];
      }

      var mag = sum;

      if (this.params.normalize) {
        mag /= frameSize;
      }

      if (!this.params.power) {
        mag = Math.sqrt(mag);
      }

      outFrame[0] = mag;

      return outFrame;
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      this.inputArray(frame);
      this.output(time, this.outFrame, metaData);
    }
  }]);

  return Magnitude;
})(_coreBaseLfo2['default']);

exports['default'] = Magnitude;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbWFnbml0dWRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7OztJQUVqQixTQUFTO1lBQVQsU0FBUzs7QUFFakIsV0FGUSxTQUFTLENBRWhCLE9BQU8sRUFBRTswQkFGRixTQUFTOztBQUcxQiwrQkFIaUIsU0FBUyw2Q0FHcEI7QUFDSixlQUFTLEVBQUUsSUFBSTtBQUNmLFdBQUssRUFBRSxLQUFLO0tBQ2IsRUFBRSxPQUFPLEVBQUU7R0FDYjs7ZUFQa0IsU0FBUzs7V0FTbEIsb0JBQUMsY0FBYyxFQUFFO0FBQ3pCLGlDQVZpQixTQUFTLDRDQVVULGNBQWMsRUFBRTtBQUMvQixpQkFBUyxFQUFFLENBQUM7T0FDYixFQUFFO0tBQ0o7OztXQUVTLG9CQUFDLEtBQUssRUFBRTtBQUNoQixVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQy9CLFVBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDL0IsVUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDOztBQUVaLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbEMsV0FBRyxJQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEFBQUMsQ0FBQztPQUM5Qjs7QUFFRCxVQUFJLEdBQUcsR0FBRyxHQUFHLENBQUM7O0FBRWQsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtBQUN6QixXQUFHLElBQUksU0FBUyxDQUFDO09BQ2xCOztBQUVELFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtBQUN0QixXQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUN0Qjs7QUFFRCxjQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDOztBQUVsQixhQUFPLFFBQVEsQ0FBQztLQUNqQjs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsVUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2QixVQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQzVDOzs7U0ExQ2tCLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6ImVzNi9vcGVyYXRvcnMvbWFnbml0dWRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hZ25pdHVkZSBleHRlbmRzIEJhc2VMZm8ge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICBub3JtYWxpemU6IHRydWUsXG4gICAgICBwb3dlcjogZmFsc2UsXG4gICAgfSwgb3B0aW9ucyk7XG4gIH1cblxuICBpbml0aWFsaXplKGluU3RyZWFtUGFyYW1zKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZShpblN0cmVhbVBhcmFtcywge1xuICAgICAgZnJhbWVTaXplOiAxLFxuICAgIH0pO1xuICB9XG5cbiAgaW5wdXRBcnJheShmcmFtZSkge1xuICAgIGNvbnN0IG91dEZyYW1lID0gdGhpcy5vdXRGcmFtZTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSBmcmFtZS5sZW5ndGg7XG4gICAgbGV0IHN1bSA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICBzdW0gKz0gKGZyYW1lW2ldICogZnJhbWVbaV0pO1xuICAgIH1cblxuICAgIGxldCBtYWcgPSBzdW07XG5cbiAgICBpZiAodGhpcy5wYXJhbXMubm9ybWFsaXplKSB7XG4gICAgICBtYWcgLz0gZnJhbWVTaXplO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5wYXJhbXMucG93ZXIpIHtcbiAgICAgIG1hZyA9IE1hdGguc3FydChtYWcpO1xuICAgIH1cblxuICAgIG91dEZyYW1lWzBdID0gbWFnO1xuXG4gICAgcmV0dXJuIG91dEZyYW1lO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICB0aGlzLmlucHV0QXJyYXkoZnJhbWUpO1xuICAgIHRoaXMub3V0cHV0KHRpbWUsIHRoaXMub3V0RnJhbWUsIG1ldGFEYXRhKTtcbiAgfVxufVxuIl19