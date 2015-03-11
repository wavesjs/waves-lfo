"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("../core/lfo-base");

var Lfo = _require.Lfo;

/*
  can forward
    - relativeTime (according to it's start() method)
    - absoluteTime (audioContex time)
    - input time

  methods
    - `start()` -> call `reset()`
    - `stop()`  -> call `finalize()`
*/

var EventIn = (function (_Lfo) {
  function EventIn(options) {
    _classCallCheck(this, EventIn);

    var defaults = {
      timeType: "absolute", // 'absolute', 'relative', 'slave'
      audioContext: new AudioContext(), // should overriden in options
      frameSize: 1 };
    // cannot have previous
    _get(_core.Object.getPrototypeOf(EventIn.prototype), "constructor", this).call(this, null, options, defaults);

    /*
      frameSize: 1,
      frameRate: 0
      // are ok ?
    */
    this.setupStream({ frameSize: this.params.frameSize });
  }

  _inherits(EventIn, _Lfo);

  _createClass(EventIn, {
    start: {
      value: function start() {
        this.startTime = this.params.currentTime;
        this.isStarted = true;
      }
    },
    stop: {
      value: function stop() {
        this.finalize();
        this.isStarted = false;
      }
    },
    process: {
      value: function process(time, frame) {
        if (!this.isStarted) {
          return;
        }
        var frameTime;
        var audioContext = this.params.audioContext;
        // handle time according to config
        switch (this.params.timeType) {
          case "relative":
            frameTime = audioContext.currentTime - this.startTime;
            break;
          case "absolute":
            frameTime = audioContext.currentTime;
            break;
          case "slave":
          default:
            frameTime = time;
            break;
        }

        // works if frame is an array
        this.outFrame.set(frame, 0);
        // fallback if number ?
        this.output(time);
      }
    }
  });

  return EventIn;
})(Lfo);

module.exports = EventIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2V2ZW50LWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztlQUVjLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7SUFBbkMsR0FBRyxZQUFILEdBQUc7Ozs7Ozs7Ozs7Ozs7SUFhSCxPQUFPO0FBQ0EsV0FEUCxPQUFPLENBQ0MsT0FBTyxFQUFFOzBCQURqQixPQUFPOztBQUdULFFBQUksUUFBUSxHQUFHO0FBQ2IsY0FBUSxFQUFFLFVBQVU7QUFDcEIsa0JBQVksRUFBRSxJQUFJLFlBQVksRUFBRTtBQUNoQyxlQUFTLEVBQUUsQ0FBQyxFQUNiLENBQUM7O0FBRUYscUNBVEUsT0FBTyw2Q0FTSCxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTs7Ozs7OztBQU8vQixRQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztHQUN4RDs7WUFqQkcsT0FBTzs7ZUFBUCxPQUFPO0FBbUJYLFNBQUs7YUFBQSxpQkFBRztBQUNOLFlBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDekMsWUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7T0FDdkI7O0FBRUQsUUFBSTthQUFBLGdCQUFHO0FBQ0wsWUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2hCLFlBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO09BQ3hCOztBQUVELFdBQU87YUFBQSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ25CLFlBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQUUsaUJBQU87U0FBRTtBQUNoQyxZQUFJLFNBQVMsQ0FBQztBQUNkLFlBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDOztBQUU1QyxnQkFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVE7QUFDMUIsZUFBSyxVQUFVO0FBQ2IscUJBQVMsR0FBRyxZQUFZLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDdEQsa0JBQU07QUFBQSxBQUNSLGVBQUssVUFBVTtBQUNiLHFCQUFTLEdBQUcsWUFBWSxDQUFDLFdBQVcsQ0FBQztBQUNyQyxrQkFBTTtBQUFBLEFBQ1IsZUFBSyxPQUFPLENBQUM7QUFDYjtBQUNFLHFCQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLGtCQUFNO0FBQUEsU0FDVDs7O0FBR0QsWUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUU1QixZQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ25COzs7O1NBbkRHLE9BQU87R0FBUyxHQUFHOztBQXNEekIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiZXM2L3NvdXJjZXMvZXZlbnQtaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciB7IExmbyB9ID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xuXG4vKlxuICBjYW4gZm9yd2FyZFxuICAgIC0gcmVsYXRpdmVUaW1lIChhY2NvcmRpbmcgdG8gaXQncyBzdGFydCgpIG1ldGhvZClcbiAgICAtIGFic29sdXRlVGltZSAoYXVkaW9Db250ZXggdGltZSlcbiAgICAtIGlucHV0IHRpbWVcblxuICBtZXRob2RzXG4gICAgLSBgc3RhcnQoKWAgLT4gY2FsbCBgcmVzZXQoKWBcbiAgICAtIGBzdG9wKClgICAtPiBjYWxsIGBmaW5hbGl6ZSgpYFxuKi9cblxuY2xhc3MgRXZlbnRJbiBleHRlbmRzIExmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIHRpbWVUeXBlOiAnYWJzb2x1dGUnLCAvLyAnYWJzb2x1dGUnLCAncmVsYXRpdmUnLCAnc2xhdmUnXG4gICAgICBhdWRpb0NvbnRleHQ6IG5ldyBBdWRpb0NvbnRleHQoKSwgLy8gc2hvdWxkIG92ZXJyaWRlbiBpbiBvcHRpb25zXG4gICAgICBmcmFtZVNpemU6IDEsXG4gICAgfTtcbiAgICAvLyBjYW5ub3QgaGF2ZSBwcmV2aW91c1xuICAgIHN1cGVyKG51bGwsIG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIC8qXG4gICAgICBmcmFtZVNpemU6IDEsXG4gICAgICBmcmFtZVJhdGU6IDBcbiAgICAgIC8vIGFyZSBvayA/XG4gICAgKi9cbiAgICB0aGlzLnNldHVwU3RyZWFtKHsgZnJhbWVTaXplOiB0aGlzLnBhcmFtcy5mcmFtZVNpemUgfSk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLnN0YXJ0VGltZSA9IHRoaXMucGFyYW1zLmN1cnJlbnRUaW1lO1xuICAgIHRoaXMuaXNTdGFydGVkID0gdHJ1ZTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuICAgIHRoaXMuaXNTdGFydGVkID0gZmFsc2U7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lKSB7XG4gICAgaWYgKCF0aGlzLmlzU3RhcnRlZCkgeyByZXR1cm47IH1cbiAgICB2YXIgZnJhbWVUaW1lO1xuICAgIHZhciBhdWRpb0NvbnRleHQgPSB0aGlzLnBhcmFtcy5hdWRpb0NvbnRleHQ7XG4gICAgLy8gaGFuZGxlIHRpbWUgYWNjb3JkaW5nIHRvIGNvbmZpZ1xuICAgIHN3aXRjaCAodGhpcy5wYXJhbXMudGltZVR5cGUpIHtcbiAgICAgIGNhc2UgJ3JlbGF0aXZlJzpcbiAgICAgICAgZnJhbWVUaW1lID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lIC0gdGhpcy5zdGFydFRpbWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYWJzb2x1dGUnOlxuICAgICAgICBmcmFtZVRpbWUgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2xhdmUnOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgZnJhbWVUaW1lID0gdGltZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gd29ya3MgaWYgZnJhbWUgaXMgYW4gYXJyYXlcbiAgICB0aGlzLm91dEZyYW1lLnNldChmcmFtZSwgMCk7XG4gICAgLy8gZmFsbGJhY2sgaWYgbnVtYmVyID9cbiAgICB0aGlzLm91dHB1dCh0aW1lKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50SW47Il19