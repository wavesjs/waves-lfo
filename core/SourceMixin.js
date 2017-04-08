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

      _this.start = _this.start.bind(_this);
      _this.stop = _this.stop.bind(_this);
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
       *     this.initPromise.then(this.start);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvdXJjZU1peGluLmpzIl0sIm5hbWVzIjpbIlNvdXJjZU1peGluIiwic3VwZXJjbGFzcyIsImFyZ3MiLCJpbml0aWFsaXplZCIsImluaXRQcm9taXNlIiwic3RhcnRlZCIsInN0YXJ0IiwiYmluZCIsInN0b3AiLCJpbml0TW9kdWxlIiwidGhlbiIsImluaXRTdHJlYW0iLCJyZXNvbHZlIiwiZnJhbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQVlDLElBQU1BLGNBQWMsU0FBZEEsV0FBYyxDQUFDQyxVQUFEO0FBQUE7QUFBQTs7QUFDbkIsc0JBQXFCO0FBQUE7O0FBQUE7O0FBQUEsd0NBQU5DLElBQU07QUFBTkEsWUFBTTtBQUFBOztBQUFBLG1LQUNWQSxJQURVOztBQUduQixZQUFLQyxXQUFMLEdBQW1CLEtBQW5CO0FBQ0EsWUFBS0MsV0FBTCxHQUFtQixJQUFuQjtBQUNBLFlBQUtDLE9BQUwsR0FBZSxLQUFmOztBQUVBLFlBQUtDLEtBQUwsR0FBYSxNQUFLQSxLQUFMLENBQVdDLElBQVgsT0FBYjtBQUNBLFlBQUtDLElBQUwsR0FBWSxNQUFLQSxJQUFMLENBQVVELElBQVYsT0FBWjtBQVJtQjtBQVNwQjs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFabUI7QUFBQTtBQUFBLDZCQTJCWjtBQUFBOztBQUNMLGFBQUtILFdBQUwsR0FBbUIsS0FBS0ssVUFBTCxHQUFrQkMsSUFBbEIsQ0FBdUIsWUFBTTtBQUFFO0FBQ2hELGlCQUFLQyxVQUFMLEdBRDhDLENBQzNCO0FBQ25CLGlCQUFLUixXQUFMLEdBQW1CLElBQW5CO0FBQ0EsaUJBQU8sa0JBQVFTLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNELFNBSmtCLENBQW5COztBQU1BLGVBQU8sS0FBS1IsV0FBWjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXJDbUI7QUFBQTtBQUFBLDhCQTJEWCxDQUFFOztBQUVWOzs7Ozs7Ozs7O0FBN0RtQjtBQUFBO0FBQUEsNkJBc0VaLENBQUU7O0FBRVQ7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeEVtQjtBQUFBO0FBQUEsbUNBd0ZOUyxLQXhGTSxFQXdGQyxDQUFFO0FBeEZIO0FBQUE7QUFBQSxJQUE4QlosVUFBOUI7QUFBQSxDQUFwQjs7a0JBMkZjRCxXIiwiZmlsZSI6IlNvdXJjZU1peGluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKipcbiAqIEludGVyZmFjZSBhZGRlZCB0byBgTGZvQ29yZSB0byBpbXBsZW1lbnQgc291cmNlXG4gKlxuICogU291cmNlIGhhdmUgc29tZSByZXNwb25zYWJpbGl0eSBvbiBncmFwaCBhcyB0aGV5IG1vc3RseSBjb250cm9sIGl0cyB3aG9sZVxuICogbGlmZWN5Y2xlLiBUaGV5IG11c3QgaW1wbGVtZW50IHRoZSBzdGFydCBhbmQgc3RvcCBtZXRob2QgaW4gb3JkZXIgdG9cbiAqIG1ha2Ugc3VyZSB0aGUgZ3JhcGggaXMgaW5pdGlhbGl6ZWQgYW5kIHNldCBgc3RhcnRlZGAgdG8gdHJ1ZS5cbiAqIEEgc291cmNlIHNob3VsZCBuZXZlciBhY2NlcHQgYW5kIHByb3BhZ2F0ZSBpbmNvbW1pbmcgZnJhbWVzIHVudGlsIGBzdGFydGVkYFxuICogaXMgc2V0IHRvIGB0cnVlYC5cbiAqXG4gKiBAZXhhbXBsZVxuICogY2xhc3MgTXlTb3VyY2UgZXh0ZW5kcyBTb3VyY2VNaXhpbihCYXNlTGZvKSB7fVxuICovXG4gY29uc3QgU291cmNlTWl4aW4gPSAoc3VwZXJjbGFzcykgPT4gY2xhc3MgZXh0ZW5kcyBzdXBlcmNsYXNzIHtcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHRoaXMuaW5pdFByb21pc2UgPSBudWxsO1xuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5zdGFydCA9IHRoaXMuc3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN0b3AgPSB0aGlzLnN0b3AuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBncmFwaCBieSBjYWxsaW5nIGBpbml0TW9kdWxlYC4gV2hlbiB0aGUgcmV0dXJuZWQgYFByb21pc2VgXG4gICAqIGZ1bGZpbGxzLCB0aGUgZ3JhcGggY2FuIGJlIGNvbnNpZGVyZWQgYXMgaW5pdGlhbGl6ZWQgYW5kIGBzdGFydGAgY2FuIGJlXG4gICAqIGNhbGxlZCBzYWZlbHkuIElmIGBzdGFydGAgaXMgY2FsbGVkIHdoaXRob3V0IGV4cGxpY2l0IGBpbml0YCwgYGluaXRgIGlzXG4gICAqIG1hZGUgaW50ZXJuYWxseSwgYWN0dWFsIHN0YXJ0IG9mIHRoZSBncmFwaCBpcyB0aGVuIG5vdCBnYXJhbnRlZWQgdG8gYmVcbiAgICogc3luY2hyb25vdXMuXG4gICAqXG4gICAqIEByZXR1cm4gUHJvbWlzZVxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBzYWZlIGluaXRpYWxpemF0aW9uIGFuZCBzdGFydFxuICAgKiBzb3VyY2UuaW5pdCgpLnRoZW4oKCkgPT4gc291cmNlLnN0YXJ0KCkpXG4gICAqIC8vIHNhZmUgaW5pdGlhbGl6YXRpb24gYW5kIHN0YXJ0XG4gICAqIHNvdXJjZS5zdGFydCgpO1xuICAgKi9cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmluaXRQcm9taXNlID0gdGhpcy5pbml0TW9kdWxlKCkudGhlbigoKSA9PiB7IC8vIHdoZW4gZ3JhcGggaXMgc3RhcnRlZFxuICAgICAgdGhpcy5pbml0U3RyZWFtKCk7IC8vIHRoaXMgaXMgc3luY2hyb25vdXNcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLmluaXRQcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gaW1wbGVtZW50IHRoYXQgc3RhcnRzIHRoZSBncmFwaC5cbiAgICpcbiAgICogVGhlIG1ldGhvZCBtYWluIHB1cnBvc2UgaXMgdG8gbWFrZSBzdXJlIHRha2UgdmVyaWZ5IGluaXRpYWxpemF0aW9uIHN0ZXAgYW5kXG4gICAqIHNldCBgc3RhcnRlZGAgdG8gYHRydWVgIHdoZW4gZG9uZS5cbiAgICogU2hvdWxkIGJlaGF2ZSBzeW5jaHJvbm91c2x5IHdoZW4gY2FsbGVkIGluc2lkZSBgaW5pdCgpLnRoZW4oKWAgYW5kIGFzeW5jXG4gICAqIGlmIGNhbGxlZCB3aXRob3V0IGluaXQgc3RlcC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gYmFzaWMgYHN0YXJ0YCBpbXBsZW1lbnRhdGlvblxuICAgKiBzdGFydCgpIHtcbiAgICogICBpZiAodGhpcy5pbml0aWFsaXplZCA9PT0gZmFsc2UpIHtcbiAgICogICAgIGlmICh0aGlzLmluaXRQcm9taXNlID09PSBudWxsKSAvLyBpbml0IGhhcyBub3QgeWV0IGJlZW4gY2FsbGVkXG4gICAqICAgICAgIHRoaXMuaW5pdFByb21pc2UgPSB0aGlzLmluaXQoKTtcbiAgICpcbiAgICogICAgIHRoaXMuaW5pdFByb21pc2UudGhlbih0aGlzLnN0YXJ0KTtcbiAgICogICAgIHJldHVybjtcbiAgICogICB9XG4gICAqXG4gICAqICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICogfVxuICAgKi9cbiAgc3RhcnQoKSB7fVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIGltcGxlbWVudCB0aGF0IHN0b3BzIHRoZSBncmFwaC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gYmFzaWMgYHN0b3BgIGltcGxlbWVudGF0aW9uXG4gICAqIHN0b3AoKSB7XG4gICAqICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAqIH1cbiAgICovXG4gIHN0b3AoKSB7fVxuXG4gIC8qKlxuICAgKiBUaGUgaW1wbGVtZW50YXRpb24gc2hvdWxkIG5ldmVyIGFsbG93IGluY29tbWluZyBmcmFtZXNcbiAgICogaWYgYHRoaXMuc3RhcnRlZGAgaXMgbm90IGB0cnVlYC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGZyYW1lXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIGJhc2ljIGBwcm9jZXNzRnJhbWVgIGltcGxlbWVudGF0aW9uXG4gICAqIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgKiAgIGlmICh0aGlzLnN0YXJ0ZWQgPT09IHRydWUpIHtcbiAgICogICAgIHRoaXMucHJlcGFyZUZyYW1lKCk7XG4gICAqICAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG4gICAqICAgICB0aGlzLnByb3BhZ2F0ZUZyYW1lKCk7XG4gICAqICAgfVxuICAgKiB9XG4gICAqL1xuICBwcm9jZXNzRnJhbWUoZnJhbWUpIHt9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNvdXJjZU1peGluO1xuIl19