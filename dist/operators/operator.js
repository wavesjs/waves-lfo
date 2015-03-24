"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("../core/lfo-base");

var Lfo = _require.Lfo;

// apply a given function on each frame

var Operator = (function (_Lfo) {
  function Operator(previous, options) {
    _classCallCheck(this, Operator);

    _get(_core.Object.getPrototypeOf(Operator.prototype), "constructor", this).call(this, previous, options, {});

    this.params.type = this.params.type || "scalar";

    if (this.params.type === "vector" && this.params.frameSize) {
      this.setupStream({ frameSize: this.params.frameSize });
    } else {
      // if type `scalar` outFrame.length === inFrame.length
      this.setupStream();
    }
  }

  _inherits(Operator, _Lfo);

  _createClass(Operator, {
    callback: {

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

      value: function callback(func) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvb3BlcmF0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O2VBRWMsT0FBTyxDQUFDLGtCQUFrQixDQUFDOztJQUFuQyxHQUFHLFlBQUgsR0FBRzs7OztJQUdILFFBQVE7QUFFRCxXQUZQLFFBQVEsQ0FFQSxRQUFRLEVBQUUsT0FBTyxFQUFFOzBCQUYzQixRQUFROztBQUdWLHFDQUhFLFFBQVEsNkNBR0osUUFBUSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUU7O0FBRTdCLFFBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQzs7QUFFaEQsUUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7QUFDMUQsVUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7S0FDeEQsTUFBTTs7QUFFTCxVQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7S0FDcEI7R0FDRjs7WUFiRyxRQUFROztlQUFSLFFBQVE7QUEyQlosWUFBUTs7Ozs7Ozs7Ozs7Ozs7O2FBQUEsa0JBQUMsSUFBSSxFQUFFOztBQUViLFlBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNqQzs7QUFFRCxXQUFPO2FBQUEsaUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7O0FBRTdCLFlBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQ2pDLGNBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXhELGNBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtBQUN6QixnQkFBSSxHQUFHLE9BQU8sQ0FBQztXQUNoQjtTQUNGLE1BQU07QUFDTCxlQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzVDLGdCQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1dBQy9DO1NBQ0Y7O0FBRUQsWUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsWUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7O0FBRXpCLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNmOzs7O1NBbERHLFFBQVE7R0FBUyxHQUFHOztBQW1EekIsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyIsImZpbGUiOiJlczYvb3BlcmF0b3JzL29wZXJhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgeyBMZm8gfSA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcblxuLy8gYXBwbHkgYSBnaXZlbiBmdW5jdGlvbiBvbiBlYWNoIGZyYW1lXG5jbGFzcyBPcGVyYXRvciBleHRlbmRzIExmbyB7XG5cbiAgY29uc3RydWN0b3IocHJldmlvdXMsIG9wdGlvbnMpIHtcbiAgICBzdXBlcihwcmV2aW91cywgb3B0aW9ucywge30pO1xuXG4gICAgdGhpcy5wYXJhbXMudHlwZSA9IHRoaXMucGFyYW1zLnR5cGUgfHzCoCdzY2FsYXInO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLnR5cGUgPT09ICd2ZWN0b3InICYmIHRoaXMucGFyYW1zLmZyYW1lU2l6ZSkge1xuICAgICAgdGhpcy5zZXR1cFN0cmVhbSh7IGZyYW1lU2l6ZTogdGhpcy5wYXJhbXMuZnJhbWVTaXplIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpZiB0eXBlIGBzY2FsYXJgIG91dEZyYW1lLmxlbmd0aCA9PT0gaW5GcmFtZS5sZW5ndGhcbiAgICAgIHRoaXMuc2V0dXBTdHJlYW0oKTtcbiAgICB9XG4gIH1cblxuICAvLyByZWdpc3RlciB0aGUgY2FsbGJhY2sgdG8gYmUgY29uc3VtZWQgaW4gcHJvY2Vzc1xuXG4gIC8vIEBTSUdOQVRVUkUgc2NhbGFyIGNhbGxiYWNrXG4gIC8vIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgZnJhbWUpIHtcbiAgLy8gICByZXR1cm4gZG9Tb21ldGhpbmcodmFsdWUpXG4gIC8vIH1cblxuICAvLyBAU0lHTkFUVVJFIHZlY3RvciBjYWxsYmFja1xuICAvLyBmdW5jdGlvbih0aW1lLCBpbkZyYW1lLCBvdXRGcmFtZSkge1xuICAvLyAgIG91dEZyYW1lLnNldChpbkZyYW1lLCAwKTtcbiAgLy8gICByZXR1cm4gdGltZSArIDE7XG4gIC8vIH1cbiAgY2FsbGJhY2soZnVuYykge1xuICAgIC8vIGJpbmQgY3VycmVudCBjb250ZXh0XG4gICAgdGhpcy5jYWxsYmFjayA9IGZ1bmMuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgLy8gYXBwbHkgdGhlIGNhbGxiYWNrIHRvIHRoZSBmcmFtZVxuICAgIGlmICh0aGlzLnBhcmFtcy50eXBlID09PSAndmVjdG9yJykge1xuICAgICAgdmFyIG91dFRpbWUgPSB0aGlzLmNhbGxiYWNrKHRpbWUsIGZyYW1lLCB0aGlzLm91dEZyYW1lKTtcblxuICAgICAgaWYgKG91dFRpbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aW1lID0gb3V0VGltZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBmcmFtZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdGhpcy5vdXRGcmFtZVtpXSA9IHRoaXMuY2FsbGJhY2soZnJhbWVbaV0sIGkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudGltZSA9IHRpbWU7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPcGVyYXRvcjsiXX0=