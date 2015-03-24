"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvb3BlcmF0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBRUEsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7Ozs7SUFHaEMsUUFBUTtBQUVELFdBRlAsUUFBUSxDQUVBLFFBQVEsRUFBRSxPQUFPLEVBQUU7MEJBRjNCLFFBQVE7O0FBR1YscUNBSEUsUUFBUSw2Q0FHSixRQUFRLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRTs7QUFFN0IsUUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDOztBQUVoRCxRQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtBQUMxRCxVQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztLQUN4RCxNQUFNOztBQUVMLFVBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUNwQjtHQUNGOztZQWJHLFFBQVE7O2VBQVIsUUFBUTtBQTJCWixZQUFROzs7Ozs7Ozs7Ozs7Ozs7YUFBQSxrQkFBQyxJQUFJLEVBQUU7O0FBRWIsWUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ2pDOztBQUVELFdBQU87YUFBQSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTs7QUFFN0IsWUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDakMsY0FBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFeEQsY0FBSSxPQUFPLEtBQUssU0FBUyxFQUFFO0FBQ3pCLGdCQUFJLEdBQUcsT0FBTyxDQUFDO1dBQ2hCO1NBQ0YsTUFBTTtBQUNMLGVBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDNUMsZ0JBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7V0FDL0M7U0FDRjs7QUFFRCxZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixZQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFekIsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2Y7Ozs7U0FsREcsUUFBUTtHQUFTLEdBQUc7O0FBbUR6QixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6ImVzNi9vcGVyYXRvcnMvb3BlcmF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBMZm8gPSByZXF1aXJlKCcuLi9jb3JlL2xmby1iYXNlJyk7XG5cbi8vIGFwcGx5IGEgZ2l2ZW4gZnVuY3Rpb24gb24gZWFjaCBmcmFtZVxuY2xhc3MgT3BlcmF0b3IgZXh0ZW5kcyBMZm8ge1xuXG4gIGNvbnN0cnVjdG9yKHByZXZpb3VzLCBvcHRpb25zKSB7XG4gICAgc3VwZXIocHJldmlvdXMsIG9wdGlvbnMsIHt9KTtcblxuICAgIHRoaXMucGFyYW1zLnR5cGUgPSB0aGlzLnBhcmFtcy50eXBlIHx8wqAnc2NhbGFyJztcblxuICAgIGlmICh0aGlzLnBhcmFtcy50eXBlID09PSAndmVjdG9yJyAmJiB0aGlzLnBhcmFtcy5mcmFtZVNpemUpIHtcbiAgICAgIHRoaXMuc2V0dXBTdHJlYW0oeyBmcmFtZVNpemU6IHRoaXMucGFyYW1zLmZyYW1lU2l6ZSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaWYgdHlwZSBgc2NhbGFyYCBvdXRGcmFtZS5sZW5ndGggPT09IGluRnJhbWUubGVuZ3RoXG4gICAgICB0aGlzLnNldHVwU3RyZWFtKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gcmVnaXN0ZXIgdGhlIGNhbGxiYWNrIHRvIGJlIGNvbnN1bWVkIGluIHByb2Nlc3NcblxuICAvLyBAU0lHTkFUVVJFIHNjYWxhciBjYWxsYmFja1xuICAvLyBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGZyYW1lKSB7XG4gIC8vICAgcmV0dXJuIGRvU29tZXRoaW5nKHZhbHVlKVxuICAvLyB9XG5cbiAgLy8gQFNJR05BVFVSRSB2ZWN0b3IgY2FsbGJhY2tcbiAgLy8gZnVuY3Rpb24odGltZSwgaW5GcmFtZSwgb3V0RnJhbWUpIHtcbiAgLy8gICBvdXRGcmFtZS5zZXQoaW5GcmFtZSwgMCk7XG4gIC8vICAgcmV0dXJuIHRpbWUgKyAxO1xuICAvLyB9XG4gIGNhbGxiYWNrKGZ1bmMpIHtcbiAgICAvLyBiaW5kIGN1cnJlbnQgY29udGV4dFxuICAgIHRoaXMuY2FsbGJhY2sgPSBmdW5jLmJpbmQodGhpcyk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIC8vIGFwcGx5IHRoZSBjYWxsYmFjayB0byB0aGUgZnJhbWVcbiAgICBpZiAodGhpcy5wYXJhbXMudHlwZSA9PT0gJ3ZlY3RvcicpIHtcbiAgICAgIHZhciBvdXRUaW1lID0gdGhpcy5jYWxsYmFjayh0aW1lLCBmcmFtZSwgdGhpcy5vdXRGcmFtZSk7XG5cbiAgICAgIGlmIChvdXRUaW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGltZSA9IG91dFRpbWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gZnJhbWUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHRoaXMub3V0RnJhbWVbaV0gPSB0aGlzLmNhbGxiYWNrKGZyYW1lW2ldLCBpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT3BlcmF0b3I7Il19