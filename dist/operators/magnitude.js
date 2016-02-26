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
      }var mag = sum;

      if (this.params.normalize) mag /= frameSize;

      if (!this.params.power) mag = Math.sqrt(mag);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbWFnbml0dWRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7OztJQUdqQixTQUFTO1lBQVQsU0FBUzs7QUFDakIsV0FEUSxTQUFTLENBQ2hCLE9BQU8sRUFBRTswQkFERixTQUFTOztBQUUxQiwrQkFGaUIsU0FBUyw2Q0FFcEI7QUFDSixlQUFTLEVBQUUsSUFBSTtBQUNmLFdBQUssRUFBRSxLQUFLO0tBQ2IsRUFBRSxPQUFPLEVBQUU7R0FDYjs7ZUFOa0IsU0FBUzs7V0FRbEIsb0JBQUMsY0FBYyxFQUFFO0FBQ3pCLGlDQVRpQixTQUFTLDRDQVNULGNBQWMsRUFBRTtBQUMvQixpQkFBUyxFQUFFLENBQUM7T0FDYixFQUFFO0tBQ0o7OztXQUVTLG9CQUFDLEtBQUssRUFBRTtBQUNoQixVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQy9CLFVBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDL0IsVUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDOztBQUVaLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFO0FBQ2hDLFdBQUcsSUFBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxBQUFDLENBQUM7T0FBQSxBQUUvQixJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUM7O0FBRWQsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFDdkIsR0FBRyxJQUFJLFNBQVMsQ0FBQzs7QUFFbkIsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUNwQixHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFdkIsY0FBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQzs7QUFFbEIsYUFBTyxRQUFRLENBQUM7S0FDakI7OztXQUVNLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFVBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUM1Qzs7O1NBdENrQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiJlczYvb3BlcmF0b3JzL21hZ25pdHVkZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hZ25pdHVkZSBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoe1xuICAgICAgbm9ybWFsaXplOiB0cnVlLFxuICAgICAgcG93ZXI6IGZhbHNlLFxuICAgIH0sIG9wdGlvbnMpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShpblN0cmVhbVBhcmFtcykge1xuICAgIHN1cGVyLmluaXRpYWxpemUoaW5TdHJlYW1QYXJhbXMsIHtcbiAgICAgIGZyYW1lU2l6ZTogMSxcbiAgICB9KTtcbiAgfVxuXG4gIGlucHV0QXJyYXkoZnJhbWUpIHtcbiAgICBjb25zdCBvdXRGcmFtZSA9IHRoaXMub3V0RnJhbWU7XG4gICAgY29uc3QgZnJhbWVTaXplID0gZnJhbWUubGVuZ3RoO1xuICAgIGxldCBzdW0gPSAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKylcbiAgICAgIHN1bSArPSAoZnJhbWVbaV0gKiBmcmFtZVtpXSk7XG5cbiAgICBsZXQgbWFnID0gc3VtO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLm5vcm1hbGl6ZSlcbiAgICAgIG1hZyAvPSBmcmFtZVNpemU7XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLnBvd2VyKVxuICAgICAgbWFnID0gTWF0aC5zcXJ0KG1hZyk7XG5cbiAgICBvdXRGcmFtZVswXSA9IG1hZztcblxuICAgIHJldHVybiBvdXRGcmFtZTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgdGhpcy5pbnB1dEFycmF5KGZyYW1lKTtcbiAgICB0aGlzLm91dHB1dCh0aW1lLCB0aGlzLm91dEZyYW1lLCBtZXRhRGF0YSk7XG4gIH1cbn1cbiJdfQ==