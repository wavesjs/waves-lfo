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
      value: function process(time, frame) {
        this.outputFrame = frame;

        this.output(time);
      }
    }
  });

  return Noop;
})();

module.exports = Noop;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7ZUFFYyxPQUFPLENBQUMsa0JBQWtCLENBQUM7O0lBQW5DLEdBQUcsWUFBSCxHQUFHOztJQUVILElBQUk7QUFDRyxXQURQLElBQUksQ0FDSSxRQUFRLEVBQWdCO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFEOUIsSUFBSTs7QUFFTixxQ0FGRSxJQUFJLDZDQUVBLFFBQVEsRUFBRSxPQUFPLEVBQUU7R0FDMUI7O2VBSEcsSUFBSTtBQUtSLFdBQU87YUFBQSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ25CLFlBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDOztBQUV6QixZQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ25COzs7O1NBVEcsSUFBSTs7O0FBWVYsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMiLCJmaWxlIjoiZXM2L3NvdXJjZXMvcHJvY2Vzcy13b3JrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciB7IExmbyB9ID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xuXG5jbGFzcyBOb29wIHtcbiAgY29uc3RydWN0b3IocHJldmlvdXMsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKHByZXZpb3VzLCBvcHRpb25zKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUpIHtcbiAgICB0aGlzLm91dHB1dEZyYW1lID0gZnJhbWU7XG5cbiAgICB0aGlzLm91dHB1dCh0aW1lKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5vb3A7Il19