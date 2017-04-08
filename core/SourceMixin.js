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
       * Never allow incomming frames if `this.started` is not `true`.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvdXJjZU1peGluLmpzIl0sIm5hbWVzIjpbIlNvdXJjZU1peGluIiwic3VwZXJjbGFzcyIsImFyZ3MiLCJpbml0aWFsaXplZCIsImluaXRQcm9taXNlIiwic3RhcnRlZCIsImluaXRNb2R1bGUiLCJ0aGVuIiwiaW5pdFN0cmVhbSIsInJlc29sdmUiLCJmcmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQyxJQUFNQSxjQUFjLFNBQWRBLFdBQWMsQ0FBQ0MsVUFBRDtBQUFBO0FBQUE7O0FBQ25CLHNCQUFxQjtBQUFBOztBQUFBOztBQUFBLHdDQUFOQyxJQUFNO0FBQU5BLFlBQU07QUFBQTs7QUFBQSxtS0FDVkEsSUFEVTs7QUFHbkIsWUFBS0MsV0FBTCxHQUFtQixLQUFuQjtBQUNBLFlBQUtDLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxZQUFLQyxPQUFMLEdBQWUsS0FBZjtBQUxtQjtBQU1wQjs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFUbUI7QUFBQTtBQUFBLDZCQXdCWjtBQUFBOztBQUNMLGFBQUtELFdBQUwsR0FBbUIsS0FBS0UsVUFBTCxHQUFrQkMsSUFBbEIsQ0FBdUIsWUFBTTtBQUFFO0FBQ2hELGlCQUFLQyxVQUFMLEdBRDhDLENBQzNCO0FBQ25CLGlCQUFLTCxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsaUJBQU8sa0JBQVFNLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNELFNBSmtCLENBQW5COztBQU1BLGVBQU8sS0FBS0wsV0FBWjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWxDbUI7QUFBQTtBQUFBLDhCQXdEWCxDQUFFOztBQUVWOzs7Ozs7Ozs7O0FBMURtQjtBQUFBO0FBQUEsNkJBbUVaLENBQUU7O0FBRVQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUFyRW1CO0FBQUE7QUFBQSxtQ0FvRk5NLEtBcEZNLEVBb0ZDLENBQUU7QUFwRkg7QUFBQTtBQUFBLElBQThCVCxVQUE5QjtBQUFBLENBQXBCOztrQkF1RmNELFciLCJmaWxlIjoiU291cmNlTWl4aW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogSW50ZXJmYWNlIGFkZGVkIHRvIGBMZm9Db3JlIHRvIGltcGxlbWVudCBzb3VyY2VcbiAqXG4gKiBTb3VyY2UgaGF2ZSBzb21lIHJlc3BvbnNhYmlsaXR5IG9uIGdyYXBoIGFzIHRoZXkgbW9zdGx5IGNvbnRyb2wgaXRzIHdob2xlXG4gKiBsaWZlY3ljbGUuIFRoZXkgbXVzdCBpbXBsZW1lbnQgdGhlIHN0YXJ0IGFuZCBzdG9wIG1ldGhvZCBpbiBvcmRlciB0b1xuICogbWFrZSBzdXJlIHRoZSBncmFwaCBpcyBpbml0aWFsaXplZCBhbmQgc2V0IGBzdGFydGVkYCB0byB0cnVlLlxuICogQSBzb3VyY2Ugc2hvdWxkIG5ldmVyIGFjY2VwdCBhbmQgcHJvcGFnYXRlIGluY29tbWluZyBmcmFtZXMgdW50aWwgYHN0YXJ0ZWRgXG4gKiBpcyBzZXQgdG8gYHRydWVgLlxuICpcbiAqIEBleGFtcGxlXG4gKiBjbGFzcyBNeVNvdXJjZSBleHRlbmRzIFNvdXJjZU1peGluKEJhc2VMZm8pIHtcbiAqICAgc3RhcnQoKSB7fVxuICogICBzdG9wKCkge31cbiAqICAgaW5pdCgpIHt9XG4gKiB9XG4gKi9cbiBjb25zdCBTb3VyY2VNaXhpbiA9IChzdXBlcmNsYXNzKSA9PiBjbGFzcyBleHRlbmRzIHN1cGVyY2xhc3Mge1xuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgc3VwZXIoLi4uYXJncyk7XG5cbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdGhpcy5pbml0UHJvbWlzZSA9IG51bGw7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgZ3JhcGggYnkgY2FsbGluZyBgaW5pdE1vZHVsZWAuIFdoZW4gdGhlIHJldHVybmVkIGBQcm9taXNlYFxuICAgKiBmdWxmaWxscywgdGhlIGdyYXBoIGNhbiBiZSBjb25zaWRlcmVkIGFzIGluaXRpYWxpemVkIGFuZCBgc3RhcnRgIGNhbiBiZVxuICAgKiBjYWxsZWQgc2FmZWx5LiBJZiBgc3RhcnRgIGlzIGNhbGxlZCB3aGl0aG91dCBleHBsaWNpdCBgaW5pdGAsIGBpbml0YCBpc1xuICAgKiBtYWRlIGludGVybmFsbHksIGFjdHVhbCBzdGFydCBvZiB0aGUgZ3JhcGggaXMgdGhlbiBub3QgZ2FyYW50ZWVkIHRvIGJlXG4gICAqIHN5bmNocm9ub3VzLlxuICAgKlxuICAgKiBAcmV0dXJuIFByb21pc2VcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gc2FmZSBpbml0aWFsaXphdGlvbiBhbmQgc3RhcnRcbiAgICogc291cmNlLmluaXQoKS50aGVuKCgpID0+IHNvdXJjZS5zdGFydCgpKVxuICAgKiAvLyBzYWZlIGluaXRpYWxpemF0aW9uIGFuZCBzdGFydFxuICAgKiBzb3VyY2Uuc3RhcnQoKTtcbiAgICovXG4gIGluaXQoKSB7XG4gICAgdGhpcy5pbml0UHJvbWlzZSA9IHRoaXMuaW5pdE1vZHVsZSgpLnRoZW4oKCkgPT4geyAvLyB3aGVuIGdyYXBoIGlzIHN0YXJ0ZWRcbiAgICAgIHRoaXMuaW5pdFN0cmVhbSgpOyAvLyB0aGlzIGlzIHN5bmNocm9ub3VzXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy5pbml0UHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIGltcGxlbWVudCB0aGF0IHN0YXJ0cyB0aGUgZ3JhcGguXG4gICAqXG4gICAqIFRoZSBtZXRob2QgbWFpbiBwdXJwb3NlIGlzIHRvIG1ha2Ugc3VyZSB0YWtlIHZlcmlmeSBpbml0aWFsaXphdGlvbiBzdGVwIGFuZFxuICAgKiBzZXQgYHN0YXJ0ZWRgIHRvIGB0cnVlYCB3aGVuIGRvbmUuXG4gICAqIFNob3VsZCBiZWhhdmUgc3luY2hyb25vdXNseSB3aGVuIGNhbGxlZCBpbnNpZGUgYGluaXQoKS50aGVuKClgIGFuZCBhc3luY1xuICAgKiBpZiBjYWxsZWQgd2l0aG91dCBpbml0IHN0ZXAuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIGJhc2ljIGBzdGFydGAgaW1wbGVtZW50YXRpb25cbiAgICogc3RhcnQoKSB7XG4gICAqICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQgPT09IGZhbHNlKSB7XG4gICAqICAgICBpZiAodGhpcy5pbml0UHJvbWlzZSA9PT0gbnVsbCkgLy8gaW5pdCBoYXMgbm90IHlldCBiZWVuIGNhbGxlZFxuICAgKiAgICAgICB0aGlzLmluaXRQcm9taXNlID0gdGhpcy5pbml0KCk7XG4gICAqXG4gICAqICAgICB0aGlzLmluaXRQcm9taXNlLnRoZW4oKCkgPT4gdGhpcy5zdGFydChzdGFydFRpbWUpKTtcbiAgICogICAgIHJldHVybjtcbiAgICogICB9XG4gICAqXG4gICAqICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICogfVxuICAgKi9cbiAgc3RhcnQoKSB7fVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIGltcGxlbWVudCB0aGF0IHN0b3BzIHRoZSBncmFwaC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gYmFzaWMgYHN0b3BgIGltcGxlbWVudGF0aW9uXG4gICAqIHN0b3AoKSB7XG4gICAqICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAqIH1cbiAgICovXG4gIHN0b3AoKSB7fVxuXG4gIC8qKlxuICAgKiBOZXZlciBhbGxvdyBpbmNvbW1pbmcgZnJhbWVzIGlmIGB0aGlzLnN0YXJ0ZWRgIGlzIG5vdCBgdHJ1ZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmcmFtZVxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBiYXNpYyBgcHJvY2Vzc0ZyYW1lYCBpbXBsZW1lbnRhdGlvblxuICAgKiBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgICogICBpZiAodGhpcy5zdGFydGVkID09PSB0cnVlKSB7XG4gICAqICAgICB0aGlzLnByZXBhcmVGcmFtZSgpO1xuICAgKiAgICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuICAgKiAgICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICAgKiAgIH1cbiAgICogfVxuICAgKi9cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7fVxufVxuXG5leHBvcnQgZGVmYXVsdCBTb3VyY2VNaXhpbjtcbiJdfQ==