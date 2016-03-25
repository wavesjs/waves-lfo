"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * is used to keep several draw in sync
 * when a view is installed in a synchronized draw
 * the meta view is installed as a member of all it's children
 */

var SynchronizedDraw = function () {
  function SynchronizedDraw() {
    (0, _classCallCheck3.default)(this, SynchronizedDraw);

    this.views = [];
    this.add.apply(this, arguments);
  }

  (0, _createClass3.default)(SynchronizedDraw, [{
    key: "add",
    value: function add() {
      var _this = this;

      for (var _len = arguments.length, views = Array(_len), _key = 0; _key < _len; _key++) {
        views[_key] = arguments[_key];
      }

      views.forEach(function (view) {
        _this.install(view);
      });
    }
  }, {
    key: "install",
    value: function install(view) {
      this.views.push(view);
      view.params.isSynchronized = true;
      view.synchronizer = this;
    }
  }, {
    key: "shiftSiblings",
    value: function shiftSiblings(iShift, view) {
      this.views.forEach(function (child) {
        if (child === view) {
          return;
        }
        child.shiftCanvas(iShift);
      });
    }
  }]);
  return SynchronizedDraw;
}();

exports.default = SynchronizedDraw;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN5bmNocm9uaXplZC1kcmF3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFLcUI7QUFDbkIsV0FEbUIsZ0JBQ25CLEdBQXNCO3dDQURILGtCQUNHOztBQUNwQixTQUFLLEtBQUwsR0FBYSxFQUFiLENBRG9CO0FBRXBCLFNBQUssR0FBTCx3QkFGb0I7R0FBdEI7OzZCQURtQjs7MEJBTUw7Ozt3Q0FBUDs7T0FBTzs7QUFDWixZQUFNLE9BQU4sQ0FBYyxnQkFBUTtBQUFFLGNBQUssT0FBTCxDQUFhLElBQWIsRUFBRjtPQUFSLENBQWQsQ0FEWTs7Ozs0QkFJTixNQUFNO0FBQ1osV0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixFQURZO0FBRVosV0FBSyxNQUFMLENBQVksY0FBWixHQUE2QixJQUE3QixDQUZZO0FBR1osV0FBSyxZQUFMLEdBQW9CLElBQXBCLENBSFk7Ozs7a0NBTUEsUUFBUSxNQUFNO0FBQzFCLFdBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsVUFBQyxLQUFELEVBQVc7QUFDNUIsWUFBSSxVQUFVLElBQVYsRUFBZ0I7QUFBRSxpQkFBRjtTQUFwQjtBQUNBLGNBQU0sV0FBTixDQUFrQixNQUFsQixFQUY0QjtPQUFYLENBQW5CLENBRDBCOzs7U0FoQlQiLCJmaWxlIjoic3luY2hyb25pemVkLWRyYXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGlzIHVzZWQgdG8ga2VlcCBzZXZlcmFsIGRyYXcgaW4gc3luY1xuICogd2hlbiBhIHZpZXcgaXMgaW5zdGFsbGVkIGluIGEgc3luY2hyb25pemVkIGRyYXdcbiAqIHRoZSBtZXRhIHZpZXcgaXMgaW5zdGFsbGVkIGFzIGEgbWVtYmVyIG9mIGFsbCBpdCdzIGNoaWxkcmVuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN5bmNocm9uaXplZERyYXcge1xuICBjb25zdHJ1Y3RvciguLi52aWV3cykge1xuICAgIHRoaXMudmlld3MgPSBbXTtcbiAgICB0aGlzLmFkZCguLi52aWV3cyk7XG4gIH1cblxuICBhZGQoLi4udmlld3MpIHtcbiAgICB2aWV3cy5mb3JFYWNoKHZpZXcgPT4geyB0aGlzLmluc3RhbGwodmlldyk7IH0pO1xuICB9XG5cbiAgaW5zdGFsbCh2aWV3KSB7XG4gICAgdGhpcy52aWV3cy5wdXNoKHZpZXcpO1xuICAgIHZpZXcucGFyYW1zLmlzU3luY2hyb25pemVkID0gdHJ1ZTtcbiAgICB2aWV3LnN5bmNocm9uaXplciA9IHRoaXM7XG4gIH1cblxuICBzaGlmdFNpYmxpbmdzKGlTaGlmdCwgdmlldykge1xuICAgIHRoaXMudmlld3MuZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGlmIChjaGlsZCA9PT0gdmlldykgeyByZXR1cm47IH1cbiAgICAgIGNoaWxkLnNoaWZ0Q2FudmFzKGlTaGlmdCk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==