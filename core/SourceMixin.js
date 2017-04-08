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
 * Interface added to `LfoCore to implement source
 *
 * Source have some responsability on graph as they mostly control its whole
 * lifecycle. They must implement the start and stop method in order to
 * make sure the graph is initialized and set `started` to true.
 * A source should never accept and propagate incomming frames until `started`
 * is set to `true`.
 *
 * @example
 * class MySource extends SourceMixin(BaseLfo) {
 *   start() {}
 *   stop() {}
 *   init() {}
 * }
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

      _this.initialized = false;
      _this.initPromise = null;
      _this.started = false;
      return _this;
    }

    /**
     * Initialize the graph by calling `initModule`. When the returned `Promise`
     * fulfills, the graph can be considered as initialized and `start` can be
     * called safely. If `start` is called whithout explicit `init`, `init` is
     * made internally, actual start of the graph is then not garanteed to be
     * synchronous.
     *
     * @return Promise
     *
     * @example
     * // safe initialization and start
     * source.init().then(() => source.start())
     * // safe initialization and start
     * source.start();
     */


    (0, _createClass3.default)(_class, [{
      key: "init",
      value: function init() {
        var _this2 = this;

        this.initPromise = this.initModule().then(function () {
          // when graph is started
          _this2.initStream(); // this is synchronous
          _this2.initialized = true;
          return _promise2.default.resolve(true);
        });

        return this.initPromise;
      }

      /**
       * Interface method to implement that starts the graph.
       *
       * The method main purpose is to make sure take verify initialization step and
       * set `started` to `true` when done.
       * Should behave synchronously when called inside `init().then()` and async
       * if called without init step.
       *
       * @example
       * // basic `start` implementation
       * start() {
       *   if (this.initialized === false) {
       *     if (this.initPromise === null) // init has not yet been called
       *       this.initPromise = this.init();
       *
       *     this.initPromise.then(() => this.start(startTime));
       *     return;
       *   }
       *
       *   this.started = true;
       * }
       */

    }, {
      key: "start",
      value: function start() {}

      /**
       * Interface method to implement that stops the graph.
       *
       * @example
       * // basic `stop` implementation
       * stop() {
       *   this.started = false;
       * }
       */

    }, {
      key: "stop",
      value: function stop() {}

      /**
       * The implementation should never allow incomming frames
       * if `this.started` is not `true`.
       *
       * @param {Object} frame
       *
       * @example
       * // basic `processFrame` implementation
       * processFrame(frame) {
       *   if (this.started === true) {
       *     this.prepareFrame();
       *     this.processFunction(frame);
       *     this.propagateFrame();
       *   }
       * }
       */

    }, {
      key: "processFrame",
      value: function processFrame(frame) {}
    }]);
    return _class;
  }(superclass);
};

exports.default = SourceMixin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvdXJjZU1peGluLmpzIl0sIm5hbWVzIjpbIlNvdXJjZU1peGluIiwic3VwZXJjbGFzcyIsImFyZ3MiLCJpbml0aWFsaXplZCIsImluaXRQcm9taXNlIiwic3RhcnRlZCIsImluaXRNb2R1bGUiLCJ0aGVuIiwiaW5pdFN0cmVhbSIsInJlc29sdmUiLCJmcmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQyxJQUFNQSxjQUFjLFNBQWRBLFdBQWMsQ0FBQ0MsVUFBRDtBQUFBO0FBQUE7O0FBQ25CLHNCQUFxQjtBQUFBOztBQUFBOztBQUFBLHdDQUFOQyxJQUFNO0FBQU5BLFlBQU07QUFBQTs7QUFBQSxtS0FDVkEsSUFEVTs7QUFHbkIsWUFBS0MsV0FBTCxHQUFtQixLQUFuQjtBQUNBLFlBQUtDLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxZQUFLQyxPQUFMLEdBQWUsS0FBZjtBQUxtQjtBQU1wQjs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFUbUI7QUFBQTtBQUFBLDZCQXdCWjtBQUFBOztBQUNMLGFBQUtELFdBQUwsR0FBbUIsS0FBS0UsVUFBTCxHQUFrQkMsSUFBbEIsQ0FBdUIsWUFBTTtBQUFFO0FBQ2hELGlCQUFLQyxVQUFMLEdBRDhDLENBQzNCO0FBQ25CLGlCQUFLTCxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsaUJBQU8sa0JBQVFNLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNELFNBSmtCLENBQW5COztBQU1BLGVBQU8sS0FBS0wsV0FBWjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWxDbUI7QUFBQTtBQUFBLDhCQXdEWCxDQUFFOztBQUVWOzs7Ozs7Ozs7O0FBMURtQjtBQUFBO0FBQUEsNkJBbUVaLENBQUU7O0FBRVQ7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBckVtQjtBQUFBO0FBQUEsbUNBcUZOTSxLQXJGTSxFQXFGQyxDQUFFO0FBckZIO0FBQUE7QUFBQSxJQUE4QlQsVUFBOUI7QUFBQSxDQUFwQjs7a0JBd0ZjRCxXIiwiZmlsZSI6IlNvdXJjZU1peGluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKipcbiAqIEludGVyZmFjZSBhZGRlZCB0byBgTGZvQ29yZSB0byBpbXBsZW1lbnQgc291cmNlXG4gKlxuICogU291cmNlIGhhdmUgc29tZSByZXNwb25zYWJpbGl0eSBvbiBncmFwaCBhcyB0aGV5IG1vc3RseSBjb250cm9sIGl0cyB3aG9sZVxuICogbGlmZWN5Y2xlLiBUaGV5IG11c3QgaW1wbGVtZW50IHRoZSBzdGFydCBhbmQgc3RvcCBtZXRob2QgaW4gb3JkZXIgdG9cbiAqIG1ha2Ugc3VyZSB0aGUgZ3JhcGggaXMgaW5pdGlhbGl6ZWQgYW5kIHNldCBgc3RhcnRlZGAgdG8gdHJ1ZS5cbiAqIEEgc291cmNlIHNob3VsZCBuZXZlciBhY2NlcHQgYW5kIHByb3BhZ2F0ZSBpbmNvbW1pbmcgZnJhbWVzIHVudGlsIGBzdGFydGVkYFxuICogaXMgc2V0IHRvIGB0cnVlYC5cbiAqXG4gKiBAZXhhbXBsZVxuICogY2xhc3MgTXlTb3VyY2UgZXh0ZW5kcyBTb3VyY2VNaXhpbihCYXNlTGZvKSB7XG4gKiAgIHN0YXJ0KCkge31cbiAqICAgc3RvcCgpIHt9XG4gKiAgIGluaXQoKSB7fVxuICogfVxuICovXG4gY29uc3QgU291cmNlTWl4aW4gPSAoc3VwZXJjbGFzcykgPT4gY2xhc3MgZXh0ZW5kcyBzdXBlcmNsYXNzIHtcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHRoaXMuaW5pdFByb21pc2UgPSBudWxsO1xuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGdyYXBoIGJ5IGNhbGxpbmcgYGluaXRNb2R1bGVgLiBXaGVuIHRoZSByZXR1cm5lZCBgUHJvbWlzZWBcbiAgICogZnVsZmlsbHMsIHRoZSBncmFwaCBjYW4gYmUgY29uc2lkZXJlZCBhcyBpbml0aWFsaXplZCBhbmQgYHN0YXJ0YCBjYW4gYmVcbiAgICogY2FsbGVkIHNhZmVseS4gSWYgYHN0YXJ0YCBpcyBjYWxsZWQgd2hpdGhvdXQgZXhwbGljaXQgYGluaXRgLCBgaW5pdGAgaXNcbiAgICogbWFkZSBpbnRlcm5hbGx5LCBhY3R1YWwgc3RhcnQgb2YgdGhlIGdyYXBoIGlzIHRoZW4gbm90IGdhcmFudGVlZCB0byBiZVxuICAgKiBzeW5jaHJvbm91cy5cbiAgICpcbiAgICogQHJldHVybiBQcm9taXNlXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIHNhZmUgaW5pdGlhbGl6YXRpb24gYW5kIHN0YXJ0XG4gICAqIHNvdXJjZS5pbml0KCkudGhlbigoKSA9PiBzb3VyY2Uuc3RhcnQoKSlcbiAgICogLy8gc2FmZSBpbml0aWFsaXphdGlvbiBhbmQgc3RhcnRcbiAgICogc291cmNlLnN0YXJ0KCk7XG4gICAqL1xuICBpbml0KCkge1xuICAgIHRoaXMuaW5pdFByb21pc2UgPSB0aGlzLmluaXRNb2R1bGUoKS50aGVuKCgpID0+IHsgLy8gd2hlbiBncmFwaCBpcyBzdGFydGVkXG4gICAgICB0aGlzLmluaXRTdHJlYW0oKTsgLy8gdGhpcyBpcyBzeW5jaHJvbm91c1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMuaW5pdFByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBpbXBsZW1lbnQgdGhhdCBzdGFydHMgdGhlIGdyYXBoLlxuICAgKlxuICAgKiBUaGUgbWV0aG9kIG1haW4gcHVycG9zZSBpcyB0byBtYWtlIHN1cmUgdGFrZSB2ZXJpZnkgaW5pdGlhbGl6YXRpb24gc3RlcCBhbmRcbiAgICogc2V0IGBzdGFydGVkYCB0byBgdHJ1ZWAgd2hlbiBkb25lLlxuICAgKiBTaG91bGQgYmVoYXZlIHN5bmNocm9ub3VzbHkgd2hlbiBjYWxsZWQgaW5zaWRlIGBpbml0KCkudGhlbigpYCBhbmQgYXN5bmNcbiAgICogaWYgY2FsbGVkIHdpdGhvdXQgaW5pdCBzdGVwLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBiYXNpYyBgc3RhcnRgIGltcGxlbWVudGF0aW9uXG4gICAqIHN0YXJ0KCkge1xuICAgKiAgIGlmICh0aGlzLmluaXRpYWxpemVkID09PSBmYWxzZSkge1xuICAgKiAgICAgaWYgKHRoaXMuaW5pdFByb21pc2UgPT09IG51bGwpIC8vIGluaXQgaGFzIG5vdCB5ZXQgYmVlbiBjYWxsZWRcbiAgICogICAgICAgdGhpcy5pbml0UHJvbWlzZSA9IHRoaXMuaW5pdCgpO1xuICAgKlxuICAgKiAgICAgdGhpcy5pbml0UHJvbWlzZS50aGVuKCgpID0+IHRoaXMuc3RhcnQoc3RhcnRUaW1lKSk7XG4gICAqICAgICByZXR1cm47XG4gICAqICAgfVxuICAgKlxuICAgKiAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG4gICAqIH1cbiAgICovXG4gIHN0YXJ0KCkge31cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBpbXBsZW1lbnQgdGhhdCBzdG9wcyB0aGUgZ3JhcGguXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIGJhc2ljIGBzdG9wYCBpbXBsZW1lbnRhdGlvblxuICAgKiBzdG9wKCkge1xuICAgKiAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuICAgKiB9XG4gICAqL1xuICBzdG9wKCkge31cblxuICAvKipcbiAgICogVGhlIGltcGxlbWVudGF0aW9uIHNob3VsZCBuZXZlciBhbGxvdyBpbmNvbW1pbmcgZnJhbWVzXG4gICAqIGlmIGB0aGlzLnN0YXJ0ZWRgIGlzIG5vdCBgdHJ1ZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmcmFtZVxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBiYXNpYyBgcHJvY2Vzc0ZyYW1lYCBpbXBsZW1lbnRhdGlvblxuICAgKiBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgICogICBpZiAodGhpcy5zdGFydGVkID09PSB0cnVlKSB7XG4gICAqICAgICB0aGlzLnByZXBhcmVGcmFtZSgpO1xuICAgKiAgICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuICAgKiAgICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICAgKiAgIH1cbiAgICogfVxuICAgKi9cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7fVxufVxuXG5leHBvcnQgZGVmYXVsdCBTb3VyY2VNaXhpbjtcbiJdfQ==