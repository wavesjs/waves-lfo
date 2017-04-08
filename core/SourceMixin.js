"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Interface added to the lfo core to implement source
 *
 * Source have some responsability on graph as they mostly control its whole
 * lifecycle.
 * Sources must then
 *
 *
 */
var SourceMixin = function SourceMixin(superclass) {
  return function (_superclass) {
    (0, _inherits3.default)(_class, _superclass);

    function _class() {
      var _ref;

      (0, _classCallCheck3.default)(this, _class);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _this = (0, _possibleConstructorReturn3.default)(this, (_ref = _class.__proto__ || (0, _getPrototypeOf2.default)(_class)).call.apply(_ref, [this].concat(args)));

      _this._initPromise = null;
      _this.ready = false;
      return _this;
    }

    /**
     * Maybe in sources only (source mixin ?)
     *
     * @todo - Add source mixin (init, start, stop)
     */


    (0, _createClass3.default)(_class, [{
      key: "init",
      value: function init() {
        var _this2 = this;

        this._initPromise = this.initModule().then(function () {
          _this2.initStream(); // synchronous
          return _promise2.default.resolve(true);
        });

        return this._initPromise;
      }

      /**
       * Start method implementation should more or less follow this pattern.
       * It's main purpose is to make sur init step is finished and set
       * `this.ready` to true when done. setting `this.ready`.
       * Should beahve synchronously when called inside `init().then()` and async
       * if called without init step.
       */

    }, {
      key: "start",
      value: function start() {
        var _this3 = this;

        if (!this._initPromise) {
          this._initPromise = this.init();
          this._initPromise.then(function () {
            return _this3.start(startTime);
          });
          return;
        }

        this._startTime = startTime;
        this._systemTime = null; // value set in the first `process` call

        this.ready = true;
      }
    }, {
      key: "stop",
      value: function stop() {
        this.ready = false;
      }

      // if a source is async this is to late to block the frame
      // propagateFrame() {
      //   if (this.ready === true)
      //     super.propagateFrame();
      // }

    }, {
      key: "processFrame",
      value: function processFrame(frame) {
        if (!this.ready === true) {
          this.prepareFrame();
          this.processFunction(frame);
          this.propagateFrame();
        }
      }
    }]);
    return _class;
  }(superclass);
};

exports.default = SourceMixin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvdXJjZU1peGluLmpzIl0sIm5hbWVzIjpbIlNvdXJjZU1peGluIiwic3VwZXJjbGFzcyIsImFyZ3MiLCJfaW5pdFByb21pc2UiLCJyZWFkeSIsImluaXRNb2R1bGUiLCJ0aGVuIiwiaW5pdFN0cmVhbSIsInJlc29sdmUiLCJpbml0Iiwic3RhcnQiLCJzdGFydFRpbWUiLCJfc3RhcnRUaW1lIiwiX3N5c3RlbVRpbWUiLCJmcmFtZSIsInByZXBhcmVGcmFtZSIsInByb2Nlc3NGdW5jdGlvbiIsInByb3BhZ2F0ZUZyYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOzs7Ozs7Ozs7QUFTQyxJQUFNQSxjQUFjLFNBQWRBLFdBQWMsQ0FBQ0MsVUFBRDtBQUFBO0FBQUE7O0FBQ25CLHNCQUFxQjtBQUFBOztBQUFBOztBQUFBLHdDQUFOQyxJQUFNO0FBQU5BLFlBQU07QUFBQTs7QUFBQSxtS0FDVkEsSUFEVTs7QUFHbkIsWUFBS0MsWUFBTCxHQUFvQixJQUFwQjtBQUNBLFlBQUtDLEtBQUwsR0FBYSxLQUFiO0FBSm1CO0FBS3BCOztBQUVEOzs7Ozs7O0FBUm1CO0FBQUE7QUFBQSw2QkFhWjtBQUFBOztBQUNMLGFBQUtELFlBQUwsR0FBb0IsS0FBS0UsVUFBTCxHQUFrQkMsSUFBbEIsQ0FBdUIsWUFBTTtBQUMvQyxpQkFBS0MsVUFBTCxHQUQrQyxDQUM1QjtBQUNuQixpQkFBTyxrQkFBUUMsT0FBUixDQUFnQixJQUFoQixDQUFQO0FBQ0QsU0FIbUIsQ0FBcEI7O0FBS0EsZUFBTyxLQUFLTCxZQUFaO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O0FBdEJtQjtBQUFBO0FBQUEsOEJBNkJYO0FBQUE7O0FBQ04sWUFBSSxDQUFDLEtBQUtBLFlBQVYsRUFBd0I7QUFDdEIsZUFBS0EsWUFBTCxHQUFvQixLQUFLTSxJQUFMLEVBQXBCO0FBQ0EsZUFBS04sWUFBTCxDQUFrQkcsSUFBbEIsQ0FBdUI7QUFBQSxtQkFBTSxPQUFLSSxLQUFMLENBQVdDLFNBQVgsQ0FBTjtBQUFBLFdBQXZCO0FBQ0E7QUFDRDs7QUFFRCxhQUFLQyxVQUFMLEdBQWtCRCxTQUFsQjtBQUNBLGFBQUtFLFdBQUwsR0FBbUIsSUFBbkIsQ0FSTSxDQVFtQjs7QUFFekIsYUFBS1QsS0FBTCxHQUFhLElBQWI7QUFDRDtBQXhDa0I7QUFBQTtBQUFBLDZCQTBDWjtBQUNMLGFBQUtBLEtBQUwsR0FBYSxLQUFiO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFsRG1CO0FBQUE7QUFBQSxtQ0FvRE5VLEtBcERNLEVBb0RDO0FBQ2xCLFlBQUksQ0FBQyxLQUFLVixLQUFOLEtBQWdCLElBQXBCLEVBQTBCO0FBQ3hCLGVBQUtXLFlBQUw7QUFDQSxlQUFLQyxlQUFMLENBQXFCRixLQUFyQjtBQUNBLGVBQUtHLGNBQUw7QUFDRDtBQUNGO0FBMURrQjtBQUFBO0FBQUEsSUFBOEJoQixVQUE5QjtBQUFBLENBQXBCOztrQkE2RGNELFciLCJmaWxlIjoiU291cmNlTWl4aW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogSW50ZXJmYWNlIGFkZGVkIHRvIHRoZSBsZm8gY29yZSB0byBpbXBsZW1lbnQgc291cmNlXG4gKlxuICogU291cmNlIGhhdmUgc29tZSByZXNwb25zYWJpbGl0eSBvbiBncmFwaCBhcyB0aGV5IG1vc3RseSBjb250cm9sIGl0cyB3aG9sZVxuICogbGlmZWN5Y2xlLlxuICogU291cmNlcyBtdXN0IHRoZW5cbiAqXG4gKlxuICovXG4gY29uc3QgU291cmNlTWl4aW4gPSAoc3VwZXJjbGFzcykgPT4gY2xhc3MgZXh0ZW5kcyBzdXBlcmNsYXNzIHtcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgdGhpcy5faW5pdFByb21pc2UgPSBudWxsO1xuICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXliZSBpbiBzb3VyY2VzIG9ubHkgKHNvdXJjZSBtaXhpbiA/KVxuICAgKlxuICAgKiBAdG9kbyAtIEFkZCBzb3VyY2UgbWl4aW4gKGluaXQsIHN0YXJ0LCBzdG9wKVxuICAgKi9cbiAgaW5pdCgpIHtcbiAgICB0aGlzLl9pbml0UHJvbWlzZSA9IHRoaXMuaW5pdE1vZHVsZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5pbml0U3RyZWFtKCk7IC8vIHN5bmNocm9ub3VzXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMuX2luaXRQcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IG1ldGhvZCBpbXBsZW1lbnRhdGlvbiBzaG91bGQgbW9yZSBvciBsZXNzIGZvbGxvdyB0aGlzIHBhdHRlcm4uXG4gICAqIEl0J3MgbWFpbiBwdXJwb3NlIGlzIHRvIG1ha2Ugc3VyIGluaXQgc3RlcCBpcyBmaW5pc2hlZCBhbmQgc2V0XG4gICAqIGB0aGlzLnJlYWR5YCB0byB0cnVlIHdoZW4gZG9uZS4gc2V0dGluZyBgdGhpcy5yZWFkeWAuXG4gICAqIFNob3VsZCBiZWFodmUgc3luY2hyb25vdXNseSB3aGVuIGNhbGxlZCBpbnNpZGUgYGluaXQoKS50aGVuKClgIGFuZCBhc3luY1xuICAgKiBpZiBjYWxsZWQgd2l0aG91dCBpbml0IHN0ZXAuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBpZiAoIXRoaXMuX2luaXRQcm9taXNlKSB7XG4gICAgICB0aGlzLl9pbml0UHJvbWlzZSA9IHRoaXMuaW5pdCgpO1xuICAgICAgdGhpcy5faW5pdFByb21pc2UudGhlbigoKSA9PiB0aGlzLnN0YXJ0KHN0YXJ0VGltZSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3N0YXJ0VGltZSA9IHN0YXJ0VGltZTtcbiAgICB0aGlzLl9zeXN0ZW1UaW1lID0gbnVsbDsgLy8gdmFsdWUgc2V0IGluIHRoZSBmaXJzdCBgcHJvY2Vzc2AgY2FsbFxuXG4gICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIGlmIGEgc291cmNlIGlzIGFzeW5jIHRoaXMgaXMgdG8gbGF0ZSB0byBibG9jayB0aGUgZnJhbWVcbiAgLy8gcHJvcGFnYXRlRnJhbWUoKSB7XG4gIC8vICAgaWYgKHRoaXMucmVhZHkgPT09IHRydWUpXG4gIC8vICAgICBzdXBlci5wcm9wYWdhdGVGcmFtZSgpO1xuICAvLyB9XG5cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgaWYgKCF0aGlzLnJlYWR5ID09PSB0cnVlKSB7XG4gICAgICB0aGlzLnByZXBhcmVGcmFtZSgpO1xuICAgICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuICAgICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTb3VyY2VNaXhpbjtcbiJdfQ==