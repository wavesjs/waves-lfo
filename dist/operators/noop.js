"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("../core/lfo-base");

var Lfo = _require.Lfo;

var Noop = (function () {
  function Noop(previous) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Noop);

    _get(_core.Object.getPrototypeOf(Noop.prototype), "constructor", this).call(this, previous, options);
  }

  _createClass(Noop, {
    process: {
      value: function process(time, frame, metadata) {
        this.outputFrame = frame;

        this.output(time, metadata);
      }
    }
  });

  return Noop;
})();

module.exports = Noop;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbm9vcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2VBRWMsT0FBTyxDQUFDLGtCQUFrQixDQUFDOztJQUFuQyxHQUFHLFlBQUgsR0FBRzs7SUFFSCxJQUFJO0FBQ0csV0FEUCxJQUFJLENBQ0ksUUFBUSxFQUFnQjtRQUFkLE9BQU8sZ0NBQUcsRUFBRTs7MEJBRDlCLElBQUk7O0FBRU4scUNBRkUsSUFBSSw2Q0FFQSxRQUFRLEVBQUUsT0FBTyxFQUFFO0dBQzFCOztlQUhHLElBQUk7QUFLUixXQUFPO2FBQUEsaUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsWUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7O0FBRXpCLFlBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO09BQzdCOzs7O1NBVEcsSUFBSTs7O0FBWVYsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMiLCJmaWxlIjoiZXM2L29wZXJhdG9ycy9ub29wLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgeyBMZm8gfSA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcblxuY2xhc3MgTm9vcCB7XG4gIGNvbnN0cnVjdG9yKHByZXZpb3VzLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihwcmV2aW91cywgb3B0aW9ucyk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhZGF0YSkge1xuICAgIHRoaXMub3V0cHV0RnJhbWUgPSBmcmFtZTtcblxuICAgIHRoaXMub3V0cHV0KHRpbWUsIG1ldGFkYXRhKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5vb3A7Il19