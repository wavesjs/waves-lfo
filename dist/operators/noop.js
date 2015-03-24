"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");

var Noop = (function (_Lfo) {
  function Noop(previous) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Noop);

    _get(_core.Object.getPrototypeOf(Noop.prototype), "constructor", this).call(this, previous, options);
    this.setupStream();
  }

  _inherits(Noop, _Lfo);

  _createClass(Noop, {
    process: {
      value: function process(time, frame, metaData) {
        this.outFrame.set(frame, 0);
        this.time = time;
        this.metaData = metaData;

        this.output();
      }
    }
  });

  return Noop;
})(Lfo);

module.exports = Noop;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbm9vcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7SUFFaEMsSUFBSTtBQUNHLFdBRFAsSUFBSSxDQUNJLFFBQVEsRUFBZ0I7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQUQ5QixJQUFJOztBQUVOLHFDQUZFLElBQUksNkNBRUEsUUFBUSxFQUFFLE9BQU8sRUFBRTtBQUN6QixRQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7R0FDcEI7O1lBSkcsSUFBSTs7ZUFBSixJQUFJO0FBTVIsV0FBTzthQUFBLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFlBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QixZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixZQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFekIsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2Y7Ozs7U0FaRyxJQUFJO0dBQVMsR0FBRzs7QUFldEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMiLCJmaWxlIjoiZXM2L29wZXJhdG9ycy9ub29wLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgTGZvID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xuXG5jbGFzcyBOb29wIGV4dGVuZHMgTGZvIHtcbiAgY29uc3RydWN0b3IocHJldmlvdXMsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKHByZXZpb3VzLCBvcHRpb25zKTtcbiAgICB0aGlzLnNldHVwU3RyZWFtKCk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIHRoaXMub3V0RnJhbWUuc2V0KGZyYW1lLCAwKTtcbiAgICB0aGlzLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOb29wOyJdfQ==