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
 * make sure the graph is initialized and set `ready` to true.
 * A source should never accept and propagate incomming frames until `ready`
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

      _this.initialized = null;
      _this.ready = false;
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

        this.initialized = this.initModule().then(function () {
          // when graph is ready
          _this2.initStream(); // this is synchronous
          return _promise2.default.resolve(true);
        });

        return this.initialized;
      }

      /**
       * Interface method to implement that starts the graph.
       *
       * The method main purpose is to make sure take verify initialization step and
       * set `ready` to `true` when done.
       * Should behave synchronously when called inside `init().then()` and async
       * if called without init step.
       *
       * @example
       * // basic `start` implementation
       * start() {
       *   // there might be a problem here if `start` is called twice synchronously
       *   // as we should test if the promise is fullfiled instead of just "existing"
       *   // unfortunatly there is no way to check the status of a promise
       *   // synchronously (see http://stackoverflow.com/questions/30564053/how-can-i-synchronously-determine-a-javascript-promises-state)
       *   // So let's hope people will do the right thing until we have a better
       *   // solution.
       *   if (!this.initialized) {
       *     this.initialized = this.init();
       *     this.initialized.then(() => this.start(startTime));
       *     return;
       *   }
       *
       *   this.ready = true;
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
       *   this.ready = false;
       * }
       */

    }, {
      key: "stop",
      value: function stop() {
        this.ready = false;
      }

      /**
       * Never allow incomming frames if `this.ready` is not `true`.
       *
       * @param {Object} frame
       */

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvdXJjZU1peGluLmpzIl0sIm5hbWVzIjpbIlNvdXJjZU1peGluIiwic3VwZXJjbGFzcyIsImFyZ3MiLCJpbml0aWFsaXplZCIsInJlYWR5IiwiaW5pdE1vZHVsZSIsInRoZW4iLCJpbml0U3RyZWFtIiwicmVzb2x2ZSIsImZyYW1lIiwicHJlcGFyZUZyYW1lIiwicHJvY2Vzc0Z1bmN0aW9uIiwicHJvcGFnYXRlRnJhbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkMsSUFBTUEsY0FBYyxTQUFkQSxXQUFjLENBQUNDLFVBQUQ7QUFBQTtBQUFBOztBQUNuQixzQkFBcUI7QUFBQTs7QUFBQTs7QUFBQSx3Q0FBTkMsSUFBTTtBQUFOQSxZQUFNO0FBQUE7O0FBQUEsbUtBQ1ZBLElBRFU7O0FBR25CLFlBQUtDLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxZQUFLQyxLQUFMLEdBQWEsS0FBYjtBQUptQjtBQUtwQjs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFSbUI7QUFBQTtBQUFBLDZCQXVCWjtBQUFBOztBQUNMLGFBQUtELFdBQUwsR0FBbUIsS0FBS0UsVUFBTCxHQUFrQkMsSUFBbEIsQ0FBdUIsWUFBTTtBQUFFO0FBQ2hELGlCQUFLQyxVQUFMLEdBRDhDLENBQzNCO0FBQ25CLGlCQUFPLGtCQUFRQyxPQUFSLENBQWdCLElBQWhCLENBQVA7QUFDRCxTQUhrQixDQUFuQjs7QUFLQSxlQUFPLEtBQUtMLFdBQVo7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaENtQjtBQUFBO0FBQUEsOEJBMERYLENBQUU7O0FBRVY7Ozs7Ozs7Ozs7QUE1RG1CO0FBQUE7QUFBQSw2QkFxRVo7QUFDTCxhQUFLQyxLQUFMLEdBQWEsS0FBYjtBQUNEOztBQUVEOzs7Ozs7QUF6RW1CO0FBQUE7QUFBQSxtQ0E4RU5LLEtBOUVNLEVBOEVDO0FBQ2xCLFlBQUksQ0FBQyxLQUFLTCxLQUFOLEtBQWdCLElBQXBCLEVBQTBCO0FBQ3hCLGVBQUtNLFlBQUw7QUFDQSxlQUFLQyxlQUFMLENBQXFCRixLQUFyQjtBQUNBLGVBQUtHLGNBQUw7QUFDRDtBQUNGO0FBcEZrQjtBQUFBO0FBQUEsSUFBOEJYLFVBQTlCO0FBQUEsQ0FBcEI7O2tCQXVGY0QsVyIsImZpbGUiOiJTb3VyY2VNaXhpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBJbnRlcmZhY2UgYWRkZWQgdG8gYExmb0NvcmUgdG8gaW1wbGVtZW50IHNvdXJjZVxuICpcbiAqIFNvdXJjZSBoYXZlIHNvbWUgcmVzcG9uc2FiaWxpdHkgb24gZ3JhcGggYXMgdGhleSBtb3N0bHkgY29udHJvbCBpdHMgd2hvbGVcbiAqIGxpZmVjeWNsZS4gVGhleSBtdXN0IGltcGxlbWVudCB0aGUgc3RhcnQgYW5kIHN0b3AgbWV0aG9kIGluIG9yZGVyIHRvXG4gKiBtYWtlIHN1cmUgdGhlIGdyYXBoIGlzIGluaXRpYWxpemVkIGFuZCBzZXQgYHJlYWR5YCB0byB0cnVlLlxuICogQSBzb3VyY2Ugc2hvdWxkIG5ldmVyIGFjY2VwdCBhbmQgcHJvcGFnYXRlIGluY29tbWluZyBmcmFtZXMgdW50aWwgYHJlYWR5YFxuICogaXMgc2V0IHRvIGB0cnVlYC5cbiAqXG4gKiBAZXhhbXBsZVxuICogY2xhc3MgTXlTb3VyY2UgZXh0ZW5kcyBTb3VyY2VNaXhpbihCYXNlTGZvKSB7XG4gKiAgIHN0YXJ0KCkge31cbiAqICAgc3RvcCgpIHt9XG4gKiAgIGluaXQoKSB7fVxuICogfVxuICovXG4gY29uc3QgU291cmNlTWl4aW4gPSAoc3VwZXJjbGFzcykgPT4gY2xhc3MgZXh0ZW5kcyBzdXBlcmNsYXNzIHtcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgdGhpcy5pbml0aWFsaXplZCA9IG51bGw7XG4gICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGdyYXBoIGJ5IGNhbGxpbmcgYGluaXRNb2R1bGVgLiBXaGVuIHRoZSByZXR1cm5lZCBgUHJvbWlzZWBcbiAgICogZnVsZmlsbHMsIHRoZSBncmFwaCBjYW4gYmUgY29uc2lkZXJlZCBhcyBpbml0aWFsaXplZCBhbmQgYHN0YXJ0YCBjYW4gYmVcbiAgICogY2FsbGVkIHNhZmVseS4gSWYgYHN0YXJ0YCBpcyBjYWxsZWQgd2hpdGhvdXQgZXhwbGljaXQgYGluaXRgLCBgaW5pdGAgaXNcbiAgICogbWFkZSBpbnRlcm5hbGx5LCBhY3R1YWwgc3RhcnQgb2YgdGhlIGdyYXBoIGlzIHRoZW4gbm90IGdhcmFudGVlZCB0byBiZVxuICAgKiBzeW5jaHJvbm91cy5cbiAgICpcbiAgICogQHJldHVybiBQcm9taXNlXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIHNhZmUgaW5pdGlhbGl6YXRpb24gYW5kIHN0YXJ0XG4gICAqIHNvdXJjZS5pbml0KCkudGhlbigoKSA9PiBzb3VyY2Uuc3RhcnQoKSlcbiAgICogLy8gc2FmZSBpbml0aWFsaXphdGlvbiBhbmQgc3RhcnRcbiAgICogc291cmNlLnN0YXJ0KCk7XG4gICAqL1xuICBpbml0KCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0aGlzLmluaXRNb2R1bGUoKS50aGVuKCgpID0+IHsgLy8gd2hlbiBncmFwaCBpcyByZWFkeVxuICAgICAgdGhpcy5pbml0U3RyZWFtKCk7IC8vIHRoaXMgaXMgc3luY2hyb25vdXNcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy5pbml0aWFsaXplZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIGltcGxlbWVudCB0aGF0IHN0YXJ0cyB0aGUgZ3JhcGguXG4gICAqXG4gICAqIFRoZSBtZXRob2QgbWFpbiBwdXJwb3NlIGlzIHRvIG1ha2Ugc3VyZSB0YWtlIHZlcmlmeSBpbml0aWFsaXphdGlvbiBzdGVwIGFuZFxuICAgKiBzZXQgYHJlYWR5YCB0byBgdHJ1ZWAgd2hlbiBkb25lLlxuICAgKiBTaG91bGQgYmVoYXZlIHN5bmNocm9ub3VzbHkgd2hlbiBjYWxsZWQgaW5zaWRlIGBpbml0KCkudGhlbigpYCBhbmQgYXN5bmNcbiAgICogaWYgY2FsbGVkIHdpdGhvdXQgaW5pdCBzdGVwLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBiYXNpYyBgc3RhcnRgIGltcGxlbWVudGF0aW9uXG4gICAqIHN0YXJ0KCkge1xuICAgKiAgIC8vIHRoZXJlIG1pZ2h0IGJlIGEgcHJvYmxlbSBoZXJlIGlmIGBzdGFydGAgaXMgY2FsbGVkIHR3aWNlIHN5bmNocm9ub3VzbHlcbiAgICogICAvLyBhcyB3ZSBzaG91bGQgdGVzdCBpZiB0aGUgcHJvbWlzZSBpcyBmdWxsZmlsZWQgaW5zdGVhZCBvZiBqdXN0IFwiZXhpc3RpbmdcIlxuICAgKiAgIC8vIHVuZm9ydHVuYXRseSB0aGVyZSBpcyBubyB3YXkgdG8gY2hlY2sgdGhlIHN0YXR1cyBvZiBhIHByb21pc2VcbiAgICogICAvLyBzeW5jaHJvbm91c2x5IChzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zMDU2NDA1My9ob3ctY2FuLWktc3luY2hyb25vdXNseS1kZXRlcm1pbmUtYS1qYXZhc2NyaXB0LXByb21pc2VzLXN0YXRlKVxuICAgKiAgIC8vIFNvIGxldCdzIGhvcGUgcGVvcGxlIHdpbGwgZG8gdGhlIHJpZ2h0IHRoaW5nIHVudGlsIHdlIGhhdmUgYSBiZXR0ZXJcbiAgICogICAvLyBzb2x1dGlvbi5cbiAgICogICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICogICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0aGlzLmluaXQoKTtcbiAgICogICAgIHRoaXMuaW5pdGlhbGl6ZWQudGhlbigoKSA9PiB0aGlzLnN0YXJ0KHN0YXJ0VGltZSkpO1xuICAgKiAgICAgcmV0dXJuO1xuICAgKiAgIH1cbiAgICpcbiAgICogICB0aGlzLnJlYWR5ID0gdHJ1ZTtcbiAgICogfVxuICAgKi9cbiAgc3RhcnQoKSB7fVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIGltcGxlbWVudCB0aGF0IHN0b3BzIHRoZSBncmFwaC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gYmFzaWMgYHN0b3BgIGltcGxlbWVudGF0aW9uXG4gICAqIHN0b3AoKSB7XG4gICAqICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuICAgKiB9XG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOZXZlciBhbGxvdyBpbmNvbW1pbmcgZnJhbWVzIGlmIGB0aGlzLnJlYWR5YCBpcyBub3QgYHRydWVgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZnJhbWVcbiAgICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIGlmICghdGhpcy5yZWFkeSA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5wcmVwYXJlRnJhbWUoKTtcbiAgICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uKGZyYW1lKTtcbiAgICAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU291cmNlTWl4aW47XG4iXX0=