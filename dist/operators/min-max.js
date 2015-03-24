"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");

var MinMax = (function (_Lfo) {
  function MinMax(previous, options) {
    _classCallCheck(this, MinMax);

    var defaults = {};

    _get(_core.Object.getPrototypeOf(MinMax.prototype), "constructor", this).call(this, previous, options, defaults);

    this.setupStream({ frameSize: 2 });
  }

  _inherits(MinMax, _Lfo);

  _createClass(MinMax, {
    process: {
      value: function process(time, frame, metaData) {
        var min = +Infinity;
        var max = -Infinity;

        for (var i = 0, l = frame.length; i < l; i++) {
          var value = frame[i];
          if (value < min) {
            min = value;
          }
          if (value > max) {
            max = value;
          }
        }

        this.time = time;
        this.outFrame.set([min, max], 0);
        this.metaData = metaData;

        this.output();
      }
    }
  });

  return MinMax;
})(Lfo);

module.exports = MinMax;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbWluLW1heC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7SUFFaEMsTUFBTTtBQUNDLFdBRFAsTUFBTSxDQUNFLFFBQVEsRUFBRSxPQUFPLEVBQUU7MEJBRDNCLE1BQU07O0FBRVIsUUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDOztBQUVsQixxQ0FKRSxNQUFNLDZDQUlGLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFOztBQUVuQyxRQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7R0FDcEM7O1lBUEcsTUFBTTs7ZUFBTixNQUFNO0FBU1YsV0FBTzthQUFBLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFlBQUksR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQ3BCLFlBQUksR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDOztBQUVwQixhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzVDLGNBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQixjQUFJLEtBQUssR0FBRyxHQUFHLEVBQUU7QUFBRSxlQUFHLEdBQUcsS0FBSyxDQUFBO1dBQUU7QUFDaEMsY0FBSSxLQUFLLEdBQUcsR0FBRyxFQUFFO0FBQUUsZUFBRyxHQUFHLEtBQUssQ0FBQTtXQUFFO1NBQ2pDOztBQUVELFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFlBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pDLFlBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUV6QixZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZjs7OztTQXhCRyxNQUFNO0dBQVMsR0FBRzs7QUEyQnhCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDIiwiZmlsZSI6ImVzNi9vcGVyYXRvcnMvbWluLW1heC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIExmbyA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcblxuY2xhc3MgTWluTWF4IGV4dGVuZHMgTGZvIHtcbiAgY29uc3RydWN0b3IocHJldmlvdXMsIG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSB7fTtcblxuICAgIHN1cGVyKHByZXZpb3VzLCBvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICB0aGlzLnNldHVwU3RyZWFtKHsgZnJhbWVTaXplOiAyIH0pO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICB2YXIgbWluID0gK0luZmluaXR5O1xuICAgIHZhciBtYXggPSAtSW5maW5pdHk7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGZyYW1lLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gZnJhbWVbaV07XG4gICAgICBpZiAodmFsdWUgPCBtaW4pIHsgbWluID0gdmFsdWUgfVxuICAgICAgaWYgKHZhbHVlID4gbWF4KSB7IG1heCA9IHZhbHVlIH1cbiAgICB9XG5cbiAgICB0aGlzLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMub3V0RnJhbWUuc2V0KFttaW4sIG1heF0sIDApO1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNaW5NYXg7Il19