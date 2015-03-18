"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

// is used to keep several draw in sync
// when a view is installed in a synchronized draw
// the meta view is installed as a member of all it's children

var SynchronizedSink = (function () {
  function SynchronizedSink() {
    _classCallCheck(this, SynchronizedSink);

    this.children = [];
  }

  _createClass(SynchronizedSink, {
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
        this.children.push(view);
        view.params.isSynchronized = true;
        view.synchronizer = this;
      }
    },
    shiftSiblings: {
      value: function shiftSiblings(iShift, view) {
        this.children.forEach(function (child) {
          if (child === view) {
            return;
          }
          child.shiftCanvas(iShift);
        });
      }
    }
  });

  return SynchronizedSink;
})();

module.exports = SynchronizedSink;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rL3N5bmNocm9uaXplZC1zaW5rLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFLTSxnQkFBZ0I7QUFDVCxXQURQLGdCQUFnQixHQUNOOzBCQURWLGdCQUFnQjs7QUFFbEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7R0FDcEI7O2VBSEcsZ0JBQWdCO0FBS3BCLE9BQUc7YUFBQSxlQUFXOzs7MENBQVAsS0FBSztBQUFMLGVBQUs7OztBQUNWLGFBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLEVBQUk7QUFDcEIsZ0JBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3BCLENBQUMsQ0FBQztPQUNKOztBQUVELFdBQU87YUFBQSxpQkFBQyxJQUFJLEVBQUU7QUFDWixZQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixZQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFDbEMsWUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7T0FDMUI7O0FBRUQsaUJBQWE7YUFBQSx1QkFBQyxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQzFCLFlBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQy9CLGNBQUksS0FBSyxLQUFLLElBQUksRUFBRTtBQUFFLG1CQUFPO1dBQUU7QUFDL0IsZUFBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMzQixDQUFDLENBQUM7T0FDSjs7OztTQXRCRyxnQkFBZ0I7OztBQXlCdEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyIsImZpbGUiOiJlczYvc2luay9zeW5jaHJvbml6ZWQtc2luay5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLy8gaXMgdXNlZCB0byBrZWVwIHNldmVyYWwgZHJhdyBpbiBzeW5jXG4vLyB3aGVuIGEgdmlldyBpcyBpbnN0YWxsZWQgaW4gYSBzeW5jaHJvbml6ZWQgZHJhd1xuLy8gdGhlIG1ldGEgdmlldyBpcyBpbnN0YWxsZWQgYXMgYSBtZW1iZXIgb2YgYWxsIGl0J3MgY2hpbGRyZW5cbmNsYXNzIFN5bmNocm9uaXplZFNpbmsge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gIH1cblxuICBhZGQoLi4udmlld3MpIHtcbiAgICB2aWV3cy5mb3JFYWNoKHZpZXcgPT4ge1xuICAgICAgdGhpcy5pbnN0YWxsKHZpZXcpO1xuICAgIH0pO1xuICB9XG5cbiAgaW5zdGFsbCh2aWV3KSB7XG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKHZpZXcpO1xuICAgIHZpZXcucGFyYW1zLmlzU3luY2hyb25pemVkID0gdHJ1ZTtcbiAgICB2aWV3LnN5bmNocm9uaXplciA9IHRoaXM7XG4gIH1cblxuICBzaGlmdFNpYmxpbmdzKGlTaGlmdCwgdmlldykge1xuICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGlmIChjaGlsZCA9PT0gdmlldykgeyByZXR1cm47IH1cbiAgICAgIGNoaWxkLnNoaWZ0Q2FudmFzKGlTaGlmdCk7XG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTeW5jaHJvbml6ZWRTaW5rOyJdfQ==