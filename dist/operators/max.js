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

var _baseLfo = require('../core/base-lfo');

var _baseLfo2 = _interopRequireDefault(_baseLfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Max = function (_BaseLfo) {
  (0, _inherits3.default)(Max, _BaseLfo);

  function Max(options) {
    (0, _classCallCheck3.default)(this, Max);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Max).call(this, options));
  }

  (0, _createClass3.default)(Max, [{
    key: 'initialize',
    value: function initialize(inStreamParams) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Max.prototype), 'initialize', this).call(this, inStreamParams, {
        frameSize: 1
      });
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      this.time = time;
      this.outFrame[0] = Math.max.apply(null, frame);
      this.metaData = metaData;

      this.output();
    }
  }]);
  return Max;
}(_baseLfo2.default);

exports.default = Max;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1heC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0lBRXFCOzs7QUFDbkIsV0FEbUIsR0FDbkIsQ0FBWSxPQUFaLEVBQXFCO3dDQURGLEtBQ0U7d0ZBREYsZ0JBRVgsVUFEYTtHQUFyQjs7NkJBRG1COzsrQkFLUixnQkFBZ0I7QUFDekIsdURBTmlCLCtDQU1BLGdCQUFnQjtBQUMvQixtQkFBVyxDQUFYO1FBREYsQ0FEeUI7Ozs7NEJBTW5CLE1BQU0sT0FBTyxVQUFVO0FBQzdCLFdBQUssSUFBTCxHQUFZLElBQVosQ0FENkI7QUFFN0IsV0FBSyxRQUFMLENBQWMsQ0FBZCxJQUFtQixLQUFLLEdBQUwsQ0FBUyxLQUFULENBQWUsSUFBZixFQUFxQixLQUFyQixDQUFuQixDQUY2QjtBQUc3QixXQUFLLFFBQUwsR0FBZ0IsUUFBaEIsQ0FINkI7O0FBSzdCLFdBQUssTUFBTCxHQUw2Qjs7O1NBWFoiLCJmaWxlIjoibWF4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1heCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gIH1cblxuICBpbml0aWFsaXplKGluU3RyZWFtUGFyYW1zKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZShpblN0cmVhbVBhcmFtcywge1xuICAgICAgZnJhbWVTaXplOiAxLFxuICAgIH0pO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICB0aGlzLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMub3V0RnJhbWVbMF0gPSBNYXRoLm1heC5hcHBseShudWxsLCBmcmFtZSk7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufVxuIl19