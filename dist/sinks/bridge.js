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

/**
 * Create a bridge between `push` to `pull` paradigms.
 * Alias `outFrame` to `data` and accumulate incomming frames into it.
 */

var Bridge = function (_BaseLfo) {
  (0, _inherits3.default)(Bridge, _BaseLfo);

  function Bridge(options, process) {
    (0, _classCallCheck3.default)(this, Bridge);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Bridge).call(this, options));

    _this.process = process.bind(_this);
    _this.data = _this.outFrame = [];
    return _this;
  }

  (0, _createClass3.default)(Bridge, [{
    key: 'setupStream',
    value: function setupStream() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Bridge.prototype), 'setupStream', this).call(this);
      this.data.length = 0;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.data.length = 0;
    }
  }]);
  return Bridge;
}(_baseLfo2.default);

exports.default = Bridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJyaWRnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7SUFPcUI7OztBQUNuQixXQURtQixNQUNuQixDQUFZLE9BQVosRUFBcUIsT0FBckIsRUFBOEI7d0NBRFgsUUFDVzs7NkZBRFgsbUJBRVgsVUFEc0I7O0FBRzVCLFVBQUssT0FBTCxHQUFlLFFBQVEsSUFBUixPQUFmLENBSDRCO0FBSTVCLFVBQUssSUFBTCxHQUFZLE1BQUssUUFBTCxHQUFnQixFQUFoQixDQUpnQjs7R0FBOUI7OzZCQURtQjs7a0NBUUw7QUFDWix1REFUaUIsa0RBU2pCLENBRFk7QUFFWixXQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLENBQW5CLENBRlk7Ozs7NEJBS047QUFDTixXQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLENBQW5CLENBRE07OztTQWJXIiwiZmlsZSI6ImJyaWRnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG5cbi8qKlxuICogQ3JlYXRlIGEgYnJpZGdlIGJldHdlZW4gYHB1c2hgIHRvIGBwdWxsYCBwYXJhZGlnbXMuXG4gKiBBbGlhcyBgb3V0RnJhbWVgIHRvIGBkYXRhYCBhbmQgYWNjdW11bGF0ZSBpbmNvbW1pbmcgZnJhbWVzIGludG8gaXQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJyaWRnZSBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zLCBwcm9jZXNzKSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICB0aGlzLnByb2Nlc3MgPSBwcm9jZXNzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5kYXRhID0gdGhpcy5vdXRGcmFtZSA9IFtdO1xuICB9XG5cbiAgc2V0dXBTdHJlYW0oKSB7XG4gICAgc3VwZXIuc2V0dXBTdHJlYW0oKTtcbiAgICB0aGlzLmRhdGEubGVuZ3RoID0gMDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuZGF0YS5sZW5ndGggPSAwO1xuICB9XG59XG4iXX0=