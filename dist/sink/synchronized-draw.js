'use strict';

// is used to keep several draw in sync
// when a view is installed in a synchronized draw
// the meta view is installed as a member of all it's children

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

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
    key: 'add',
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
    key: 'install',
    value: function install(view) {
      this.views.push(view);
      view.params.isSynchronized = true;
      view.synchronizer = this;
    }
  }, {
    key: 'shiftSiblings',
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

module.exports = SynchronizedDraw;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rL3N5bmNocm9uaXplZC1kcmF3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7OztJQUtQLGdCQUFnQjtBQUNULFdBRFAsZ0JBQWdCLEdBQ0U7MEJBRGxCLGdCQUFnQjs7QUFFbEIsUUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7O3NDQURILEtBQUs7QUFBTCxXQUFLOzs7QUFFbEIsUUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQzdCOztlQUpHLGdCQUFnQjs7V0FNakIsZUFBVzs7O3lDQUFQLEtBQUs7QUFBTCxhQUFLOzs7QUFDVixXQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQUUsY0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7T0FBRSxDQUFDLENBQUM7S0FDaEQ7OztXQUVNLGlCQUFDLElBQUksRUFBRTtBQUNaLFVBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztBQUNsQyxVQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztLQUMxQjs7O1dBRVksdUJBQUMsTUFBTSxFQUFFLElBQUksRUFBRTtBQUMxQixVQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBSztBQUM1QixZQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQy9CLGFBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDM0IsQ0FBQyxDQUFDO0tBQ0o7OztTQXJCRyxnQkFBZ0I7OztBQXdCdEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyIsImZpbGUiOiJlczYvc2luay9zeW5jaHJvbml6ZWQtZHJhdy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLy8gaXMgdXNlZCB0byBrZWVwIHNldmVyYWwgZHJhdyBpbiBzeW5jXG4vLyB3aGVuIGEgdmlldyBpcyBpbnN0YWxsZWQgaW4gYSBzeW5jaHJvbml6ZWQgZHJhd1xuLy8gdGhlIG1ldGEgdmlldyBpcyBpbnN0YWxsZWQgYXMgYSBtZW1iZXIgb2YgYWxsIGl0J3MgY2hpbGRyZW5cbmNsYXNzIFN5bmNocm9uaXplZERyYXcge1xuICBjb25zdHJ1Y3RvciguLi52aWV3cykge1xuICAgIHRoaXMudmlld3MgPSBbXTtcbiAgICB0aGlzLmFkZC5hcHBseSh0aGlzLCB2aWV3cyk7XG4gIH1cblxuICBhZGQoLi4udmlld3MpIHtcbiAgICB2aWV3cy5mb3JFYWNoKHZpZXcgPT4geyB0aGlzLmluc3RhbGwodmlldyk7IH0pO1xuICB9XG5cbiAgaW5zdGFsbCh2aWV3KSB7XG4gICAgdGhpcy52aWV3cy5wdXNoKHZpZXcpO1xuICAgIHZpZXcucGFyYW1zLmlzU3luY2hyb25pemVkID0gdHJ1ZTtcbiAgICB2aWV3LnN5bmNocm9uaXplciA9IHRoaXM7XG4gIH1cblxuICBzaGlmdFNpYmxpbmdzKGlTaGlmdCwgdmlldykge1xuICAgIHRoaXMudmlld3MuZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGlmIChjaGlsZCA9PT0gdmlldykgeyByZXR1cm47IH1cbiAgICAgIGNoaWxkLnNoaWZ0Q2FudmFzKGlTaGlmdCk7XG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTeW5jaHJvbml6ZWREcmF3OyJdfQ==