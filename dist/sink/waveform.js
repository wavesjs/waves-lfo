"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var BaseDraw = require("base-draw");

var Waveform = (function (_BaseDraw) {
  function Waveform(previous, options) {
    _classCallCheck(this, Waveform);

    var extendDefaults = {};

    _get(_core.Object.getPrototypeOf(Waveform.prototype), "constructor", this).call(this, previous, options, extendDefaults);

    if (!this.params.color) {
      this.params.color = getRandomColor();
    }
  }

  _inherits(Waveform, _BaseDraw);

  _createClass(Waveform, {
    process: {
      value: function process(time, frame) {
        this.scrollModeDraw(time, frame);
        _get(_core.Object.getPrototypeOf(Waveform.prototype), "process", this).call(this, time, frame);
      }
    },
    drawCurve: {
      value: function drawCurve(frame, previousFrame, iShift) {
        var ctx = this.ctx;
      }
    }
  });

  return Waveform;
})(BaseDraw);

module.exports = Waveform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rL3dhdmVmb3JtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUVBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzs7SUFFOUIsUUFBUTtBQUNELFdBRFAsUUFBUSxDQUNBLFFBQVEsRUFBRSxPQUFPLEVBQUU7MEJBRDNCLFFBQVE7O0FBRVYsUUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDOztBQUV4QixxQ0FKRSxRQUFRLDZDQUlKLFFBQVEsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFOztBQUV6QyxRQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7QUFDdEIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsY0FBYyxFQUFFLENBQUM7S0FDdEM7R0FDRjs7WUFURyxRQUFROztlQUFSLFFBQVE7QUFXWixXQUFPO2FBQUEsaUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNuQixZQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqQyx5Q0FiRSxRQUFRLHlDQWFJLElBQUksRUFBRSxLQUFLLEVBQUU7T0FDNUI7O0FBRUQsYUFBUzthQUFBLG1CQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFO0FBQ3RDLFlBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7T0FHcEI7Ozs7U0FwQkcsUUFBUTtHQUFTLFFBQVE7O0FBdUIvQixNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyIsImZpbGUiOiJlczYvc2luay93YXZlZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIEJhc2VEcmF3ID0gcmVxdWlyZSgnYmFzZS1kcmF3Jyk7XG5cbmNsYXNzIFdhdmVmb3JtIGV4dGVuZHMgQmFzZURyYXcge1xuICBjb25zdHJ1Y3RvcihwcmV2aW91cywgb3B0aW9ucykge1xuICAgIHZhciBleHRlbmREZWZhdWx0cyA9IHt9O1xuXG4gICAgc3VwZXIocHJldmlvdXMsIG9wdGlvbnMsIGV4dGVuZERlZmF1bHRzKTtcblxuICAgIGlmICghdGhpcy5wYXJhbXMuY29sb3IpIHtcbiAgICAgIHRoaXMucGFyYW1zLmNvbG9yID0gZ2V0UmFuZG9tQ29sb3IoKTtcbiAgICB9XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lKSB7XG4gICAgdGhpcy5zY3JvbGxNb2RlRHJhdyh0aW1lLCBmcmFtZSk7XG4gICAgc3VwZXIucHJvY2Vzcyh0aW1lLCBmcmFtZSk7XG4gIH1cblxuICBkcmF3Q3VydmUoZnJhbWUsIHByZXZpb3VzRnJhbWUsIGlTaGlmdCkge1xuICAgIHZhciBjdHggPSB0aGlzLmN0eDtcblxuXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBXYXZlZm9ybTsiXX0=