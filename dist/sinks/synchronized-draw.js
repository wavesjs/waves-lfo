/**
 * is used to keep several draw in sync
 * when a view is installed in a synchronized draw
 * the meta view is installed as a member of all it's children
 */
"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SynchronizedDraw = (function () {
  function SynchronizedDraw() {
    _classCallCheck(this, SynchronizedDraw);

    this.views = [];

    for (var _len = arguments.length, views = Array(_len), _key = 0; _key < _len; _key++) {
      views[_key] = arguments[_key];
    }

    this.add.apply(this, views);
  }

  _createClass(SynchronizedDraw, [{
    key: "add",
    value: function add() {
      var _this = this;

      for (var _len2 = arguments.length, views = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        views[_key2] = arguments[_key2];
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
})();

exports["default"] = SynchronizedDraw;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy9zeW5jaHJvbml6ZWQtZHJhdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7SUFLcUIsZ0JBQWdCO0FBQ3hCLFdBRFEsZ0JBQWdCLEdBQ2I7MEJBREgsZ0JBQWdCOztBQUVqQyxRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQzs7c0NBREgsS0FBSztBQUFMLFdBQUs7OztBQUVsQixRQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDN0I7O2VBSmtCLGdCQUFnQjs7V0FNaEMsZUFBVzs7O3lDQUFQLEtBQUs7QUFBTCxhQUFLOzs7QUFDVixXQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQUUsY0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7T0FBRSxDQUFDLENBQUM7S0FDaEQ7OztXQUVNLGlCQUFDLElBQUksRUFBRTtBQUNaLFVBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztBQUNsQyxVQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztLQUMxQjs7O1dBRVksdUJBQUMsTUFBTSxFQUFFLElBQUksRUFBRTtBQUMxQixVQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBSztBQUM1QixZQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQy9CLGFBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDM0IsQ0FBQyxDQUFDO0tBQ0o7OztTQXJCa0IsZ0JBQWdCOzs7cUJBQWhCLGdCQUFnQiIsImZpbGUiOiJlczYvc2lua3Mvc3luY2hyb25pemVkLWRyYXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGlzIHVzZWQgdG8ga2VlcCBzZXZlcmFsIGRyYXcgaW4gc3luY1xuICogd2hlbiBhIHZpZXcgaXMgaW5zdGFsbGVkIGluIGEgc3luY2hyb25pemVkIGRyYXdcbiAqIHRoZSBtZXRhIHZpZXcgaXMgaW5zdGFsbGVkIGFzIGEgbWVtYmVyIG9mIGFsbCBpdCdzIGNoaWxkcmVuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN5bmNocm9uaXplZERyYXcge1xuICBjb25zdHJ1Y3RvciguLi52aWV3cykge1xuICAgIHRoaXMudmlld3MgPSBbXTtcbiAgICB0aGlzLmFkZC5hcHBseSh0aGlzLCB2aWV3cyk7XG4gIH1cblxuICBhZGQoLi4udmlld3MpIHtcbiAgICB2aWV3cy5mb3JFYWNoKHZpZXcgPT4geyB0aGlzLmluc3RhbGwodmlldyk7IH0pO1xuICB9XG5cbiAgaW5zdGFsbCh2aWV3KSB7XG4gICAgdGhpcy52aWV3cy5wdXNoKHZpZXcpO1xuICAgIHZpZXcucGFyYW1zLmlzU3luY2hyb25pemVkID0gdHJ1ZTtcbiAgICB2aWV3LnN5bmNocm9uaXplciA9IHRoaXM7XG4gIH1cblxuICBzaGlmdFNpYmxpbmdzKGlTaGlmdCwgdmlldykge1xuICAgIHRoaXMudmlld3MuZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGlmIChjaGlsZCA9PT0gdmlldykgeyByZXR1cm47IH1cbiAgICAgIGNoaWxkLnNoaWZ0Q2FudmFzKGlTaGlmdCk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==