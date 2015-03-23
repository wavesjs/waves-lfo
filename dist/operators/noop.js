"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("../core/lfo-base");

var Lfo = _require.Lfo;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbm9vcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7ZUFFYyxPQUFPLENBQUMsa0JBQWtCLENBQUM7O0lBQW5DLEdBQUcsWUFBSCxHQUFHOztJQUVILElBQUk7QUFDRyxXQURQLElBQUksQ0FDSSxRQUFRLEVBQWdCO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFEOUIsSUFBSTs7QUFFTixxQ0FGRSxJQUFJLDZDQUVBLFFBQVEsRUFBRSxPQUFPLEVBQUU7QUFDekIsUUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0dBQ3BCOztZQUpHLElBQUk7O2VBQUosSUFBSTtBQU1SLFdBQU87YUFBQSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixZQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUIsWUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsWUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7O0FBRXpCLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNmOzs7O1NBWkcsSUFBSTtHQUFTLEdBQUc7O0FBZXRCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDIiwiZmlsZSI6ImVzNi9vcGVyYXRvcnMvbm9vcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIHsgTGZvIH0gPSByZXF1aXJlKCcuLi9jb3JlL2xmby1iYXNlJyk7XG5cbmNsYXNzIE5vb3AgZXh0ZW5kcyBMZm8ge1xuICBjb25zdHJ1Y3RvcihwcmV2aW91cywgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIocHJldmlvdXMsIG9wdGlvbnMpO1xuICAgIHRoaXMuc2V0dXBTdHJlYW0oKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgdGhpcy5vdXRGcmFtZS5zZXQoZnJhbWUsIDApO1xuICAgIHRoaXMudGltZSA9IHRpbWU7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5vb3A7Il19