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
 * class MySource extends SourceMixin(BaseLfo) {}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvdXJjZU1peGluLmpzIl0sIm5hbWVzIjpbIlNvdXJjZU1peGluIiwic3VwZXJjbGFzcyIsImFyZ3MiLCJpbml0aWFsaXplZCIsImluaXRQcm9taXNlIiwic3RhcnRlZCIsImluaXRNb2R1bGUiLCJ0aGVuIiwiaW5pdFN0cmVhbSIsInJlc29sdmUiLCJmcmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBWUMsSUFBTUEsY0FBYyxTQUFkQSxXQUFjLENBQUNDLFVBQUQ7QUFBQTtBQUFBOztBQUNuQixzQkFBcUI7QUFBQTs7QUFBQTs7QUFBQSx3Q0FBTkMsSUFBTTtBQUFOQSxZQUFNO0FBQUE7O0FBQUEsbUtBQ1ZBLElBRFU7O0FBR25CLFlBQUtDLFdBQUwsR0FBbUIsS0FBbkI7QUFDQSxZQUFLQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsWUFBS0MsT0FBTCxHQUFlLEtBQWY7QUFMbUI7QUFNcEI7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBVG1CO0FBQUE7QUFBQSw2QkF3Qlo7QUFBQTs7QUFDTCxhQUFLRCxXQUFMLEdBQW1CLEtBQUtFLFVBQUwsR0FBa0JDLElBQWxCLENBQXVCLFlBQU07QUFBRTtBQUNoRCxpQkFBS0MsVUFBTCxHQUQ4QyxDQUMzQjtBQUNuQixpQkFBS0wsV0FBTCxHQUFtQixJQUFuQjtBQUNBLGlCQUFPLGtCQUFRTSxPQUFSLENBQWdCLElBQWhCLENBQVA7QUFDRCxTQUprQixDQUFuQjs7QUFNQSxlQUFPLEtBQUtMLFdBQVo7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFsQ21CO0FBQUE7QUFBQSw4QkF3RFgsQ0FBRTs7QUFFVjs7Ozs7Ozs7OztBQTFEbUI7QUFBQTtBQUFBLDZCQW1FWixDQUFFOztBQUVUOzs7Ozs7Ozs7Ozs7Ozs7OztBQXJFbUI7QUFBQTtBQUFBLG1DQXFGTk0sS0FyRk0sRUFxRkMsQ0FBRTtBQXJGSDtBQUFBO0FBQUEsSUFBOEJULFVBQTlCO0FBQUEsQ0FBcEI7O2tCQXdGY0QsVyIsImZpbGUiOiJTb3VyY2VNaXhpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBJbnRlcmZhY2UgYWRkZWQgdG8gYExmb0NvcmUgdG8gaW1wbGVtZW50IHNvdXJjZVxuICpcbiAqIFNvdXJjZSBoYXZlIHNvbWUgcmVzcG9uc2FiaWxpdHkgb24gZ3JhcGggYXMgdGhleSBtb3N0bHkgY29udHJvbCBpdHMgd2hvbGVcbiAqIGxpZmVjeWNsZS4gVGhleSBtdXN0IGltcGxlbWVudCB0aGUgc3RhcnQgYW5kIHN0b3AgbWV0aG9kIGluIG9yZGVyIHRvXG4gKiBtYWtlIHN1cmUgdGhlIGdyYXBoIGlzIGluaXRpYWxpemVkIGFuZCBzZXQgYHN0YXJ0ZWRgIHRvIHRydWUuXG4gKiBBIHNvdXJjZSBzaG91bGQgbmV2ZXIgYWNjZXB0IGFuZCBwcm9wYWdhdGUgaW5jb21taW5nIGZyYW1lcyB1bnRpbCBgc3RhcnRlZGBcbiAqIGlzIHNldCB0byBgdHJ1ZWAuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNsYXNzIE15U291cmNlIGV4dGVuZHMgU291cmNlTWl4aW4oQmFzZUxmbykge31cbiAqL1xuIGNvbnN0IFNvdXJjZU1peGluID0gKHN1cGVyY2xhc3MpID0+IGNsYXNzIGV4dGVuZHMgc3VwZXJjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcblxuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmluaXRQcm9taXNlID0gbnVsbDtcbiAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBncmFwaCBieSBjYWxsaW5nIGBpbml0TW9kdWxlYC4gV2hlbiB0aGUgcmV0dXJuZWQgYFByb21pc2VgXG4gICAqIGZ1bGZpbGxzLCB0aGUgZ3JhcGggY2FuIGJlIGNvbnNpZGVyZWQgYXMgaW5pdGlhbGl6ZWQgYW5kIGBzdGFydGAgY2FuIGJlXG4gICAqIGNhbGxlZCBzYWZlbHkuIElmIGBzdGFydGAgaXMgY2FsbGVkIHdoaXRob3V0IGV4cGxpY2l0IGBpbml0YCwgYGluaXRgIGlzXG4gICAqIG1hZGUgaW50ZXJuYWxseSwgYWN0dWFsIHN0YXJ0IG9mIHRoZSBncmFwaCBpcyB0aGVuIG5vdCBnYXJhbnRlZWQgdG8gYmVcbiAgICogc3luY2hyb25vdXMuXG4gICAqXG4gICAqIEByZXR1cm4gUHJvbWlzZVxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBzYWZlIGluaXRpYWxpemF0aW9uIGFuZCBzdGFydFxuICAgKiBzb3VyY2UuaW5pdCgpLnRoZW4oKCkgPT4gc291cmNlLnN0YXJ0KCkpXG4gICAqIC8vIHNhZmUgaW5pdGlhbGl6YXRpb24gYW5kIHN0YXJ0XG4gICAqIHNvdXJjZS5zdGFydCgpO1xuICAgKi9cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmluaXRQcm9taXNlID0gdGhpcy5pbml0TW9kdWxlKCkudGhlbigoKSA9PiB7IC8vIHdoZW4gZ3JhcGggaXMgc3RhcnRlZFxuICAgICAgdGhpcy5pbml0U3RyZWFtKCk7IC8vIHRoaXMgaXMgc3luY2hyb25vdXNcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLmluaXRQcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gaW1wbGVtZW50IHRoYXQgc3RhcnRzIHRoZSBncmFwaC5cbiAgICpcbiAgICogVGhlIG1ldGhvZCBtYWluIHB1cnBvc2UgaXMgdG8gbWFrZSBzdXJlIHRha2UgdmVyaWZ5IGluaXRpYWxpemF0aW9uIHN0ZXAgYW5kXG4gICAqIHNldCBgc3RhcnRlZGAgdG8gYHRydWVgIHdoZW4gZG9uZS5cbiAgICogU2hvdWxkIGJlaGF2ZSBzeW5jaHJvbm91c2x5IHdoZW4gY2FsbGVkIGluc2lkZSBgaW5pdCgpLnRoZW4oKWAgYW5kIGFzeW5jXG4gICAqIGlmIGNhbGxlZCB3aXRob3V0IGluaXQgc3RlcC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gYmFzaWMgYHN0YXJ0YCBpbXBsZW1lbnRhdGlvblxuICAgKiBzdGFydCgpIHtcbiAgICogICBpZiAodGhpcy5pbml0aWFsaXplZCA9PT0gZmFsc2UpIHtcbiAgICogICAgIGlmICh0aGlzLmluaXRQcm9taXNlID09PSBudWxsKSAvLyBpbml0IGhhcyBub3QgeWV0IGJlZW4gY2FsbGVkXG4gICAqICAgICAgIHRoaXMuaW5pdFByb21pc2UgPSB0aGlzLmluaXQoKTtcbiAgICpcbiAgICogICAgIHRoaXMuaW5pdFByb21pc2UudGhlbigoKSA9PiB0aGlzLnN0YXJ0KHN0YXJ0VGltZSkpO1xuICAgKiAgICAgcmV0dXJuO1xuICAgKiAgIH1cbiAgICpcbiAgICogICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xuICAgKiB9XG4gICAqL1xuICBzdGFydCgpIHt9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gaW1wbGVtZW50IHRoYXQgc3RvcHMgdGhlIGdyYXBoLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBiYXNpYyBgc3RvcGAgaW1wbGVtZW50YXRpb25cbiAgICogc3RvcCgpIHtcbiAgICogICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcbiAgICogfVxuICAgKi9cbiAgc3RvcCgpIHt9XG5cbiAgLyoqXG4gICAqIFRoZSBpbXBsZW1lbnRhdGlvbiBzaG91bGQgbmV2ZXIgYWxsb3cgaW5jb21taW5nIGZyYW1lc1xuICAgKiBpZiBgdGhpcy5zdGFydGVkYCBpcyBub3QgYHRydWVgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZnJhbWVcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gYmFzaWMgYHByb2Nlc3NGcmFtZWAgaW1wbGVtZW50YXRpb25cbiAgICogcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAqICAgaWYgKHRoaXMuc3RhcnRlZCA9PT0gdHJ1ZSkge1xuICAgKiAgICAgdGhpcy5wcmVwYXJlRnJhbWUoKTtcbiAgICogICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uKGZyYW1lKTtcbiAgICogICAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcbiAgICogICB9XG4gICAqIH1cbiAgICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge31cbn1cblxuZXhwb3J0IGRlZmF1bHQgU291cmNlTWl4aW47XG4iXX0=