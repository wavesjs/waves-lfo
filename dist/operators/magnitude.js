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

    var defaults = {
      normalize: false
    };

    _get(Object.getPrototypeOf(Magnitude.prototype), 'constructor', this).call(this, options, defaults);
  }

  _createClass(Magnitude, [{
    key: 'configureStream',
    value: function configureStream() {
      this.streamParams.frameSize = 1;
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var frameSize = frame.length;
      var sum = 0;

      for (var i = 0; i < frameSize; i++) {
        sum += frame[i] * frame[i];
      }

      if (this.params.normalize) {
        // sum is a mean here (for rms)
        sum /= frameSize;
      }

      this.time = time;
      this.outFrame[0] = Math.sqrt(sum);
      this.metaData = metaData;

      this.output();
    }
  }]);

  return Magnitude;
})(_coreBaseLfo2['default']);

exports['default'] = Magnitude;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbWFnbml0dWRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQ29CLGtCQUFrQjs7OztJQUVqQixTQUFTO1lBQVQsU0FBUzs7QUFFakIsV0FGUSxTQUFTLENBRWhCLE9BQU8sRUFBRTswQkFGRixTQUFTOztBQUcxQixRQUFNLFFBQVEsR0FBRztBQUNmLGVBQVMsRUFBRSxLQUFLO0tBQ2pCLENBQUM7O0FBRUYsK0JBUGlCLFNBQVMsNkNBT3BCLE9BQU8sRUFBRSxRQUFRLEVBQUU7R0FDMUI7O2VBUmtCLFNBQVM7O1dBVWIsMkJBQUc7QUFDaEIsVUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0tBQ2pDOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixVQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQy9CLFVBQUksR0FBRyxHQUFHLENBQUMsQ0FBQzs7QUFFWixXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2xDLFdBQUcsSUFBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxBQUFDLENBQUM7T0FDOUI7O0FBRUQsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTs7QUFFekIsV0FBRyxJQUFJLFNBQVMsQ0FBQztPQUNsQjs7QUFFRCxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEMsVUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7O0FBRXpCLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7U0FoQ2tCLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6ImVzNi9vcGVyYXRvcnMvbWFnbml0dWRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFnbml0dWRlIGV4dGVuZHMgQmFzZUxmbyB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgbm9ybWFsaXplOiBmYWxzZVxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG4gIH1cblxuICBjb25maWd1cmVTdHJlYW0oKSB7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gMTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgY29uc3QgZnJhbWVTaXplID0gZnJhbWUubGVuZ3RoO1xuICAgIGxldCBzdW0gPSAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgc3VtICs9IChmcmFtZVtpXSAqIGZyYW1lW2ldKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJhbXMubm9ybWFsaXplKSB7XG4gICAgICAvLyBzdW0gaXMgYSBtZWFuIGhlcmUgKGZvciBybXMpXG4gICAgICBzdW0gLz0gZnJhbWVTaXplO1xuICAgIH1cblxuICAgIHRoaXMudGltZSA9IHRpbWU7XG4gICAgdGhpcy5vdXRGcmFtZVswXSA9IE1hdGguc3FydChzdW0pO1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cbiJdfQ==