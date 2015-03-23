"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var EventEmitter = require("events").EventEmitter;
// var extend = require('object-assign');

var Lfo = (function (_EventEmitter) {
  function Lfo() {
    var previous = arguments[0] === undefined ? null : arguments[0];
    var options = arguments[1] === undefined ? {} : arguments[1];
    var defaults = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, Lfo);

    this.idx = 0;
    this.params = {};
    this.streamParams = {
      frameSize: 1,
      frameRate: 0
    };

    this.params = _core.Object.assign({}, defaults, options);

    if (previous) {
      // add ourselves to the previous operator if its passed
      previous.add(this);
      // pass on stream params
      this.streamParams = _core.Object.assign({}, previous.streamParams);
    }
  }

  _inherits(Lfo, _EventEmitter);

  _createClass(Lfo, {
    reset: {

      // reset `outFrame` and call reset on children

      value: function reset() {}
    },
    finalize: {

      // fill the on-going buffer with 0
      // output it, then call reset on all the children
      // @NOTE the event based system (async) could produce that the reset
      //       could be called before the child finalize

      value: function finalize() {}
    },
    setupStream: {

      // common stream config based on the instantiated params

      value: function setupStream() {
        var opts = arguments[0] === undefined ? {} : arguments[0];

        if (opts.frameRate) {
          this.streamParams.frameRate = opts.frameRate;
        }
        if (opts.frameSize) {
          this.streamParams.frameSize = opts.frameSize;
        }
        if (opts.blockSampleRate) {
          this.streamParams.blockSampleRate = opts.blockSampleRate;
        }

        this.outFrame = new Float32Array(this.streamParams.frameSize);
      }
    },
    add: {

      // bind child node

      value: function add() {
        var lfo = arguments[0] === undefined ? null : arguments[0];

        this.on("frame", function (time, frame, metaData) {
          lfo.process(time, frame, metaData);
        });
      }
    },
    output: {

      // we take care of the emit ourselves

      value: function output() {
        var outTime = arguments[0] === undefined ? this.time : arguments[0];
        var outFrame = arguments[1] === undefined ? this.outFrame : arguments[1];
        var metaData = arguments[2] === undefined ? this.metaData : arguments[2];

        this.emit("frame", outTime, outFrame, metaData);
      }
    },
    remove: {

      // removes all children from listening

      value: function remove() {
        this.removeAllListeners("frame");
      }
    },
    process: {
      value: function process(time, frame, metadata) {
        this.time = time;
      }
    },
    destroy: {

      // will delete itself from the parent node
      // @NOTE this node and all his children will never garbage collected
      // `this.previous = null` fixes the first problem but not the second one

      value: function destroy() {
        if (!this.previous) {
          return;
        }
        this.previous.removeListener("frame", this);
      }
    }
  });

  return Lfo;
})(EventEmitter);

function factory(previous, options, defaults) {
  return new Lfo(previous, options, defaults);
}
factory.Lfo = Lfo;

module.exports = factory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL2xmby1iYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFHQSxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDOzs7SUFHNUMsR0FBRztBQUVJLFdBRlAsR0FBRyxHQUVtRDtRQUE5QyxRQUFRLGdDQUFHLElBQUk7UUFBRSxPQUFPLGdDQUFHLEVBQUU7UUFBRSxRQUFRLGdDQUFHLEVBQUU7OzBCQUZwRCxHQUFHOztBQUdMLFFBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxDQUFDLFlBQVksR0FBRztBQUNsQixlQUFTLEVBQUUsQ0FBQztBQUNaLGVBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQzs7QUFFRixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUVuRCxRQUFJLFFBQVEsRUFBRTs7QUFFWixjQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVuQixVQUFJLENBQUMsWUFBWSxHQUFHLE1BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQzlEO0dBQ0Y7O1lBbEJHLEdBQUc7O2VBQUgsR0FBRztBQXFCUCxTQUFLOzs7O2FBQUEsaUJBQUcsRUFBRTs7QUFNVixZQUFROzs7Ozs7O2FBQUEsb0JBQUcsRUFBRTs7QUFHYixlQUFXOzs7O2FBQUEsdUJBQVk7WUFBWCxJQUFJLGdDQUFHLEVBQUU7O0FBQ25CLFlBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGNBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7U0FBRTtBQUNyRSxZQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxjQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQUU7QUFDckUsWUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQUUsY0FBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztTQUFFOztBQUV2RixZQUFJLENBQUMsUUFBUSxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7T0FDL0Q7O0FBR0QsT0FBRzs7OzthQUFBLGVBQWE7WUFBWixHQUFHLGdDQUFHLElBQUk7O0FBQ1osWUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBUyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUMvQyxhQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDcEMsQ0FBQyxDQUFDO09BQ0o7O0FBR0QsVUFBTTs7OzthQUFBLGtCQUEwRTtZQUF6RSxPQUFPLGdDQUFHLElBQUksQ0FBQyxJQUFJO1lBQUUsUUFBUSxnQ0FBRyxJQUFJLENBQUMsUUFBUTtZQUFFLFFBQVEsZ0NBQUcsSUFBSSxDQUFDLFFBQVE7O0FBQzVFLFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7T0FDakQ7O0FBR0QsVUFBTTs7OzthQUFBLGtCQUFHO0FBQ1AsWUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQ2xDOztBQUVELFdBQU87YUFBQSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztPQUNsQjs7QUFLRCxXQUFPOzs7Ozs7YUFBQSxtQkFBRztBQUNSLFlBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQUUsaUJBQU87U0FBRTtBQUMvQixZQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDN0M7Ozs7U0FqRUcsR0FBRztHQUFTLFlBQVk7O0FBcUU5QixTQUFTLE9BQU8sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUM1QyxTQUFPLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7Q0FDN0M7QUFDRCxPQUFPLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQzs7QUFFbEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiZXM2L2NvcmUvbGZvLWJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcblwidXNlIHN0cmljdFwiO1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xuLy8gdmFyIGV4dGVuZCA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcblxuY2xhc3MgTGZvIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuICBjb25zdHJ1Y3RvcihwcmV2aW91cyA9IG51bGwsIG9wdGlvbnMgPSB7fSwgZGVmYXVsdHMgPSB7fSkge1xuICAgIHRoaXMuaWR4ID0gMDtcbiAgICB0aGlzLnBhcmFtcyA9IHt9O1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zID0ge1xuICAgICAgZnJhbWVTaXplOiAxLFxuICAgICAgZnJhbWVSYXRlOiAwXG4gICAgfTtcblxuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgaWYgKHByZXZpb3VzKSB7XG4gICAgICAvLyBhZGQgb3Vyc2VsdmVzIHRvIHRoZSBwcmV2aW91cyBvcGVyYXRvciBpZiBpdHMgcGFzc2VkXG4gICAgICBwcmV2aW91cy5hZGQodGhpcyk7XG4gICAgICAvLyBwYXNzIG9uIHN0cmVhbSBwYXJhbXNcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgcHJldmlvdXMuc3RyZWFtUGFyYW1zKTtcbiAgICB9XG4gIH1cblxuICAvLyByZXNldCBgb3V0RnJhbWVgIGFuZCBjYWxsIHJlc2V0IG9uIGNoaWxkcmVuXG4gIHJlc2V0KCkge31cblxuICAvLyBmaWxsIHRoZSBvbi1nb2luZyBidWZmZXIgd2l0aCAwXG4gIC8vIG91dHB1dCBpdCwgdGhlbiBjYWxsIHJlc2V0IG9uIGFsbCB0aGUgY2hpbGRyZW5cbiAgLy8gQE5PVEUgdGhlIGV2ZW50IGJhc2VkIHN5c3RlbSAoYXN5bmMpIGNvdWxkIHByb2R1Y2UgdGhhdCB0aGUgcmVzZXRcbiAgLy8gICAgICAgY291bGQgYmUgY2FsbGVkIGJlZm9yZSB0aGUgY2hpbGQgZmluYWxpemVcbiAgZmluYWxpemUoKSB7fVxuXG4gIC8vIGNvbW1vbiBzdHJlYW0gY29uZmlnIGJhc2VkIG9uIHRoZSBpbnN0YW50aWF0ZWQgcGFyYW1zXG4gIHNldHVwU3RyZWFtKG9wdHMgPSB7fSkge1xuICAgIGlmIChvcHRzLmZyYW1lUmF0ZSkgeyB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSBvcHRzLmZyYW1lUmF0ZTsgfVxuICAgIGlmIChvcHRzLmZyYW1lU2l6ZSkgeyB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSBvcHRzLmZyYW1lU2l6ZTsgfVxuICAgIGlmIChvcHRzLmJsb2NrU2FtcGxlUmF0ZSkgeyB0aGlzLnN0cmVhbVBhcmFtcy5ibG9ja1NhbXBsZVJhdGUgPSBvcHRzLmJsb2NrU2FtcGxlUmF0ZTsgfVxuXG4gICAgdGhpcy5vdXRGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplKTtcbiAgfVxuXG4gIC8vIGJpbmQgY2hpbGQgbm9kZVxuICBhZGQobGZvID0gbnVsbCkge1xuICAgIHRoaXMub24oJ2ZyYW1lJywgZnVuY3Rpb24odGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgICBsZm8ucHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gd2UgdGFrZSBjYXJlIG9mIHRoZSBlbWl0IG91cnNlbHZlc1xuICBvdXRwdXQob3V0VGltZSA9IHRoaXMudGltZSwgb3V0RnJhbWUgPSB0aGlzLm91dEZyYW1lLCBtZXRhRGF0YSA9IHRoaXMubWV0YURhdGEpIHtcbiAgICB0aGlzLmVtaXQoJ2ZyYW1lJywgb3V0VGltZSwgb3V0RnJhbWUsIG1ldGFEYXRhKTtcbiAgfVxuXG4gIC8vIHJlbW92ZXMgYWxsIGNoaWxkcmVuIGZyb20gbGlzdGVuaW5nXG4gIHJlbW92ZSgpIHtcbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygnZnJhbWUnKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFkYXRhKSB7XG4gICAgdGhpcy50aW1lID0gdGltZTtcbiAgfVxuXG4gIC8vIHdpbGwgZGVsZXRlIGl0c2VsZiBmcm9tIHRoZSBwYXJlbnQgbm9kZVxuICAvLyBATk9URSB0aGlzIG5vZGUgYW5kIGFsbCBoaXMgY2hpbGRyZW4gd2lsbCBuZXZlciBnYXJiYWdlIGNvbGxlY3RlZFxuICAvLyBgdGhpcy5wcmV2aW91cyA9IG51bGxgIGZpeGVzIHRoZSBmaXJzdCBwcm9ibGVtIGJ1dCBub3QgdGhlIHNlY29uZCBvbmVcbiAgZGVzdHJveSgpIHtcbiAgICBpZiAoIXRoaXMucHJldmlvdXMpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5wcmV2aW91cy5yZW1vdmVMaXN0ZW5lcignZnJhbWUnLCB0aGlzKTtcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGZhY3RvcnkocHJldmlvdXMsIG9wdGlvbnMsIGRlZmF1bHRzKSB7XG4gIHJldHVybiBuZXcgTGZvKHByZXZpb3VzLCBvcHRpb25zLCBkZWZhdWx0cyk7XG59XG5mYWN0b3J5LkxmbyA9IExmbztcblxubW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xuIl19