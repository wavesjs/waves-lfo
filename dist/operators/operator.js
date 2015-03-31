"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");

// apply a given function on each frame

var Operator = (function (_Lfo) {
  function Operator(options) {
    _classCallCheck(this, Operator);

    _get(_core.Object.getPrototypeOf(Operator.prototype), "constructor", this).call(this, options, {});

    this.params.type = this.params.type || "scalar";

    if (this.params.onProcess) {
      this.onProcess(this.params.onProcess);
    }
  }

  _inherits(Operator, _Lfo);

  _createClass(Operator, {
    configureStream: {
      value: function configureStream() {
        if (this.params.type === "vector" && this.params.frameSize) {
          this.streamParams.frameSize = this.params.frameSize;
        }
      }
    },
    onProcess: {

      // register the callback to be consumed in process

      // @SIGNATURE scalar callback
      // function(value, index, frame) {
      //   return doSomething(value)
      // }

      // @SIGNATURE vector callback
      // function(time, inFrame, outFrame) {
      //   outFrame.set(inFrame, 0);
      //   return time + 1;
      // }

      value: function onProcess(func) {
        // bind current context
        this.callback = func.bind(this);
      }
    },
    process: {
      value: function process(time, frame, metaData) {
        // apply the callback to the frame
        if (this.params.type === "vector") {
          var outTime = this.callback(time, frame, this.outFrame);

          if (outTime !== undefined) {
            time = outTime;
          }
        } else {
          for (var i = 0, l = frame.length; i < l; i++) {
            this.outFrame[i] = this.callback(frame[i], i);
          }
        }

        this.time = time;
        this.metaData = metaData;

        this.output();
      }
    }
  });

  return Operator;
})(Lfo);

;

module.exports = Operator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvb3BlcmF0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBRUEsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7Ozs7SUFHaEMsUUFBUTtBQUVELFdBRlAsUUFBUSxDQUVBLE9BQU8sRUFBRTswQkFGakIsUUFBUTs7QUFHVixxQ0FIRSxRQUFRLDZDQUdKLE9BQU8sRUFBRSxFQUFFLEVBQUU7O0FBRW5CLFFBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQzs7QUFFaEQsUUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtBQUN6QixVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDdkM7R0FDRjs7WUFWRyxRQUFROztlQUFSLFFBQVE7QUFZWixtQkFBZTthQUFBLDJCQUFHO0FBQ2hCLFlBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO0FBQzFELGNBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1NBQ3JEO09BQ0Y7O0FBY0QsYUFBUzs7Ozs7Ozs7Ozs7Ozs7O2FBQUEsbUJBQUMsSUFBSSxFQUFFOztBQUVkLFlBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNqQzs7QUFFRCxXQUFPO2FBQUEsaUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7O0FBRTdCLFlBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQ2pDLGNBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXhELGNBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtBQUN6QixnQkFBSSxHQUFHLE9BQU8sQ0FBQztXQUNoQjtTQUNGLE1BQU07QUFDTCxlQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzVDLGdCQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1dBQy9DO1NBQ0Y7O0FBRUQsWUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsWUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7O0FBRXpCLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNmOzs7O1NBckRHLFFBQVE7R0FBUyxHQUFHOztBQXNEekIsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyIsImZpbGUiOiJlczYvb3BlcmF0b3JzL29wZXJhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgTGZvID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xuXG4vLyBhcHBseSBhIGdpdmVuIGZ1bmN0aW9uIG9uIGVhY2ggZnJhbWVcbmNsYXNzIE9wZXJhdG9yIGV4dGVuZHMgTGZvIHtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucywge30pO1xuXG4gICAgdGhpcy5wYXJhbXMudHlwZSA9IHRoaXMucGFyYW1zLnR5cGUgfHzCoCdzY2FsYXInO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLm9uUHJvY2Vzcykge1xuICAgICAgdGhpcy5vblByb2Nlc3ModGhpcy5wYXJhbXMub25Qcm9jZXNzKTtcbiAgICB9XG4gIH1cblxuICBjb25maWd1cmVTdHJlYW0oKSB7XG4gICAgaWYgKHRoaXMucGFyYW1zLnR5cGUgPT09ICd2ZWN0b3InICYmIHRoaXMucGFyYW1zLmZyYW1lU2l6ZSkge1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIH1cbiAgfVxuXG4gIC8vIHJlZ2lzdGVyIHRoZSBjYWxsYmFjayB0byBiZSBjb25zdW1lZCBpbiBwcm9jZXNzXG5cbiAgLy8gQFNJR05BVFVSRSBzY2FsYXIgY2FsbGJhY2tcbiAgLy8gZnVuY3Rpb24odmFsdWUsIGluZGV4LCBmcmFtZSkge1xuICAvLyAgIHJldHVybiBkb1NvbWV0aGluZyh2YWx1ZSlcbiAgLy8gfVxuXG4gIC8vIEBTSUdOQVRVUkUgdmVjdG9yIGNhbGxiYWNrXG4gIC8vIGZ1bmN0aW9uKHRpbWUsIGluRnJhbWUsIG91dEZyYW1lKSB7XG4gIC8vICAgb3V0RnJhbWUuc2V0KGluRnJhbWUsIDApO1xuICAvLyAgIHJldHVybiB0aW1lICsgMTtcbiAgLy8gfVxuICBvblByb2Nlc3MoZnVuYykge1xuICAgIC8vIGJpbmQgY3VycmVudCBjb250ZXh0XG4gICAgdGhpcy5jYWxsYmFjayA9IGZ1bmMuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgLy8gYXBwbHkgdGhlIGNhbGxiYWNrIHRvIHRoZSBmcmFtZVxuICAgIGlmICh0aGlzLnBhcmFtcy50eXBlID09PSAndmVjdG9yJykge1xuICAgICAgdmFyIG91dFRpbWUgPSB0aGlzLmNhbGxiYWNrKHRpbWUsIGZyYW1lLCB0aGlzLm91dEZyYW1lKTtcblxuICAgICAgaWYgKG91dFRpbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aW1lID0gb3V0VGltZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBmcmFtZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdGhpcy5vdXRGcmFtZVtpXSA9IHRoaXMuY2FsbGJhY2soZnJhbWVbaV0sIGkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudGltZSA9IHRpbWU7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPcGVyYXRvcjsiXX0=