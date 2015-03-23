"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("../core/lfo-base");

var Lfo = _require.Lfo;

// apply a given function on each frame

var Operation = (function (_Lfo) {
  function Operation(previous, options) {
    _classCallCheck(this, Operation);

    _get(_core.Object.getPrototypeOf(Operation.prototype), "constructor", this).call(this, previous, options, {});
  }

  _inherits(Operation, _Lfo);

  _createClass(Operation, {
    process: {
      value: function process(time, frame, metadata) {
        // copy input frame
        this.outFrame.set(frame, 0);
        // apply the callback to the frame
        this.outFrame.forEach(this.params.func);

        _get(_core.Object.getPrototypeOf(Operation.prototype), "process", this).call(this);
        this.output();
      }
    }
  });

  return Operation;
})(Lfo);

;

module.exports = Operation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvb3BlcmF0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztlQUVjLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7SUFBbkMsR0FBRyxZQUFILEdBQUc7Ozs7SUFHSCxTQUFTO0FBRUYsV0FGUCxTQUFTLENBRUQsUUFBUSxFQUFFLE9BQU8sRUFBRTswQkFGM0IsU0FBUzs7QUFHWCxxQ0FIRSxTQUFTLDZDQUdMLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFO0dBQzlCOztZQUpHLFNBQVM7O2VBQVQsU0FBUztBQU1iLFdBQU87YUFBQSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTs7QUFFN0IsWUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUU1QixZQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV4Qyx5Q0FaRSxTQUFTLHlDQVlLO0FBQ2hCLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNmOzs7O1NBZEcsU0FBUztHQUFTLEdBQUc7O0FBZ0IxQixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDIiwiZmlsZSI6ImVzNi9vcGVyYXRvcnMvb3BlcmF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgeyBMZm8gfSA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcblxuLy8gYXBwbHkgYSBnaXZlbiBmdW5jdGlvbiBvbiBlYWNoIGZyYW1lXG5jbGFzcyBPcGVyYXRpb24gZXh0ZW5kcyBMZm8ge1xuXG4gIGNvbnN0cnVjdG9yKHByZXZpb3VzLCBvcHRpb25zKSB7XG4gICAgc3VwZXIocHJldmlvdXMsIG9wdGlvbnMsIHt9KTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFkYXRhKSB7XG4gICAgLy8gY29weSBpbnB1dCBmcmFtZVxuICAgIHRoaXMub3V0RnJhbWUuc2V0KGZyYW1lLCAwKTtcbiAgICAvLyBhcHBseSB0aGUgY2FsbGJhY2sgdG8gdGhlIGZyYW1lXG4gICAgdGhpcy5vdXRGcmFtZS5mb3JFYWNoKHRoaXMucGFyYW1zLmZ1bmMpO1xuXG4gICAgc3VwZXIucHJvY2VzcygpO1xuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPcGVyYXRpb247Il19