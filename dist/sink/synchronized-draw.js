"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

// is used to keep several draw in sync
// when a view is installed in a synchronized draw
// the meta view is installed as a member of all it's children

var SynchronizedDraw = (function () {
  function SynchronizedDraw() {
    for (var _len = arguments.length, views = Array(_len), _key = 0; _key < _len; _key++) {
      views[_key] = arguments[_key];
    }

    _classCallCheck(this, SynchronizedDraw);

    this.views = [];
    this.add.apply(this, views);
  }

  _createClass(SynchronizedDraw, {
    add: {
      value: function add() {
        var _this = this;

        for (var _len = arguments.length, views = Array(_len), _key = 0; _key < _len; _key++) {
          views[_key] = arguments[_key];
        }

        views.forEach(function (view) {
          _this.install(view);
        });
      }
    },
    install: {
      value: function install(view) {
        this.views.push(view);
        view.params.isSynchronized = true;
        view.synchronizer = this;
      }
    },
    shiftSiblings: {
      value: function shiftSiblings(iShift, view) {
        this.views.forEach(function (child) {
          if (child === view) {
            return;
          }
          child.shiftCanvas(iShift);
        });
      }
    }
  });

  return SynchronizedDraw;
})();

module.exports = SynchronizedDraw;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rL3N5bmNocm9uaXplZC1kcmF3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFLTSxnQkFBZ0I7QUFDVCxXQURQLGdCQUFnQixHQUNFO3NDQUFQLEtBQUs7QUFBTCxXQUFLOzs7MEJBRGhCLGdCQUFnQjs7QUFFbEIsUUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDaEIsUUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQzdCOztlQUpHLGdCQUFnQjtBQU1wQixPQUFHO2FBQUEsZUFBVzs7OzBDQUFQLEtBQUs7QUFBTCxlQUFLOzs7QUFDVixhQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQUUsZ0JBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQUUsQ0FBQyxDQUFDO09BQ2hEOztBQUVELFdBQU87YUFBQSxpQkFBQyxJQUFJLEVBQUU7QUFDWixZQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QixZQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFDbEMsWUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7T0FDMUI7O0FBRUQsaUJBQWE7YUFBQSx1QkFBQyxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQzFCLFlBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQzVCLGNBQUksS0FBSyxLQUFLLElBQUksRUFBRTtBQUFFLG1CQUFPO1dBQUU7QUFDL0IsZUFBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMzQixDQUFDLENBQUM7T0FDSjs7OztTQXJCRyxnQkFBZ0I7OztBQXdCdEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyIsImZpbGUiOiJlczYvc2luay9zeW5jaHJvbml6ZWQtZHJhdy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLy8gaXMgdXNlZCB0byBrZWVwIHNldmVyYWwgZHJhdyBpbiBzeW5jXG4vLyB3aGVuIGEgdmlldyBpcyBpbnN0YWxsZWQgaW4gYSBzeW5jaHJvbml6ZWQgZHJhd1xuLy8gdGhlIG1ldGEgdmlldyBpcyBpbnN0YWxsZWQgYXMgYSBtZW1iZXIgb2YgYWxsIGl0J3MgY2hpbGRyZW5cbmNsYXNzIFN5bmNocm9uaXplZERyYXcge1xuICBjb25zdHJ1Y3RvciguLi52aWV3cykge1xuICAgIHRoaXMudmlld3MgPSBbXTtcbiAgICB0aGlzLmFkZC5hcHBseSh0aGlzLCB2aWV3cyk7XG4gIH1cblxuICBhZGQoLi4udmlld3MpIHtcbiAgICB2aWV3cy5mb3JFYWNoKHZpZXcgPT4geyB0aGlzLmluc3RhbGwodmlldyk7IH0pO1xuICB9XG5cbiAgaW5zdGFsbCh2aWV3KSB7XG4gICAgdGhpcy52aWV3cy5wdXNoKHZpZXcpO1xuICAgIHZpZXcucGFyYW1zLmlzU3luY2hyb25pemVkID0gdHJ1ZTtcbiAgICB2aWV3LnN5bmNocm9uaXplciA9IHRoaXM7XG4gIH1cblxuICBzaGlmdFNpYmxpbmdzKGlTaGlmdCwgdmlldykge1xuICAgIHRoaXMudmlld3MuZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGlmIChjaGlsZCA9PT0gdmlldykgeyByZXR1cm47IH1cbiAgICAgIGNoaWxkLnNoaWZ0Q2FudmFzKGlTaGlmdCk7XG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTeW5jaHJvbml6ZWREcmF3OyJdfQ==