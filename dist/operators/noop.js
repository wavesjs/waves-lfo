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
  }

  _inherits(Noop, _Lfo);

  _createClass(Noop, {
    process: {

      // default noop - override if needed

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbm9vcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7SUFFaEMsSUFBSTtBQUNHLFdBRFAsSUFBSSxDQUNJLFFBQVEsRUFBZ0I7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQUQ5QixJQUFJOztBQUVOLHFDQUZFLElBQUksNkNBRUEsUUFBUSxFQUFFLE9BQU8sRUFBRTtHQUMxQjs7WUFIRyxJQUFJOztlQUFKLElBQUk7QUFNUixXQUFPOzs7O2FBQUEsaUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsWUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVCLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFlBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUV6QixZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZjs7OztTQVpHLElBQUk7R0FBUyxHQUFHOztBQWV0QixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyIsImZpbGUiOiJlczYvb3BlcmF0b3JzL25vb3AuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBMZm8gPSByZXF1aXJlKCcuLi9jb3JlL2xmby1iYXNlJyk7XG5cbmNsYXNzIE5vb3AgZXh0ZW5kcyBMZm8ge1xuICBjb25zdHJ1Y3RvcihwcmV2aW91cywgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIocHJldmlvdXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLy8gZGVmYXVsdCBub29wIC0gb3ZlcnJpZGUgaWYgbmVlZGVkXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgdGhpcy5vdXRGcmFtZS5zZXQoZnJhbWUsIDApO1xuICAgIHRoaXMudGltZSA9IHRpbWU7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5vb3A7Il19