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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rL3N5bmNocm9uaXplZC1kcmF3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztJQUtxQixnQkFBZ0I7QUFDeEIsV0FEUSxnQkFBZ0IsR0FDYjswQkFESCxnQkFBZ0I7O0FBRWpDLFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDOztzQ0FESCxLQUFLO0FBQUwsV0FBSzs7O0FBRWxCLFFBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztHQUM3Qjs7ZUFKa0IsZ0JBQWdCOztXQU1oQyxlQUFXOzs7eUNBQVAsS0FBSztBQUFMLGFBQUs7OztBQUNWLFdBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLEVBQUk7QUFBRSxjQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUFFLENBQUMsQ0FBQztLQUNoRDs7O1dBRU0saUJBQUMsSUFBSSxFQUFFO0FBQ1osVUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBQ2xDLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0tBQzFCOzs7V0FFWSx1QkFBQyxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQzFCLFVBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQzVCLFlBQUksS0FBSyxLQUFLLElBQUksRUFBRTtBQUFFLGlCQUFPO1NBQUU7QUFDL0IsYUFBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUMzQixDQUFDLENBQUM7S0FDSjs7O1NBckJrQixnQkFBZ0I7OztxQkFBaEIsZ0JBQWdCIiwiZmlsZSI6ImVzNi9zaW5rL3N5bmNocm9uaXplZC1kcmF3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBpcyB1c2VkIHRvIGtlZXAgc2V2ZXJhbCBkcmF3IGluIHN5bmNcbiAqIHdoZW4gYSB2aWV3IGlzIGluc3RhbGxlZCBpbiBhIHN5bmNocm9uaXplZCBkcmF3XG4gKiB0aGUgbWV0YSB2aWV3IGlzIGluc3RhbGxlZCBhcyBhIG1lbWJlciBvZiBhbGwgaXQncyBjaGlsZHJlblxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTeW5jaHJvbml6ZWREcmF3IHtcbiAgY29uc3RydWN0b3IoLi4udmlld3MpIHtcbiAgICB0aGlzLnZpZXdzID0gW107XG4gICAgdGhpcy5hZGQuYXBwbHkodGhpcywgdmlld3MpO1xuICB9XG5cbiAgYWRkKC4uLnZpZXdzKSB7XG4gICAgdmlld3MuZm9yRWFjaCh2aWV3ID0+IHsgdGhpcy5pbnN0YWxsKHZpZXcpOyB9KTtcbiAgfVxuXG4gIGluc3RhbGwodmlldykge1xuICAgIHRoaXMudmlld3MucHVzaCh2aWV3KTtcbiAgICB2aWV3LnBhcmFtcy5pc1N5bmNocm9uaXplZCA9IHRydWU7XG4gICAgdmlldy5zeW5jaHJvbml6ZXIgPSB0aGlzO1xuICB9XG5cbiAgc2hpZnRTaWJsaW5ncyhpU2hpZnQsIHZpZXcpIHtcbiAgICB0aGlzLnZpZXdzLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICBpZiAoY2hpbGQgPT09IHZpZXcpIHsgcmV0dXJuOyB9XG4gICAgICBjaGlsZC5zaGlmdENhbnZhcyhpU2hpZnQpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=