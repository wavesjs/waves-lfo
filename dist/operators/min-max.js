"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("../core/lfo-base");

var Lfo = _require.Lfo;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbWluLW1heC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7ZUFFYyxPQUFPLENBQUMsa0JBQWtCLENBQUM7O0lBQW5DLEdBQUcsWUFBSCxHQUFHOztJQUVILE1BQU07QUFDQyxXQURQLE1BQU0sQ0FDRSxRQUFRLEVBQUUsT0FBTyxFQUFFOzBCQUQzQixNQUFNOztBQUVSLFFBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQzs7QUFFbEIscUNBSkUsTUFBTSw2Q0FJRixRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTs7QUFFbkMsUUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0dBQ3BDOztZQVBHLE1BQU07O2VBQU4sTUFBTTtBQVNWLFdBQU87YUFBQSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixZQUFJLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUNwQixZQUFJLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQzs7QUFFcEIsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM1QyxjQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckIsY0FBSSxLQUFLLEdBQUcsR0FBRyxFQUFFO0FBQUUsZUFBRyxHQUFHLEtBQUssQ0FBQTtXQUFFO0FBQ2hDLGNBQUksS0FBSyxHQUFHLEdBQUcsRUFBRTtBQUFFLGVBQUcsR0FBRyxLQUFLLENBQUE7V0FBRTtTQUNqQzs7QUFFRCxZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixZQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqQyxZQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFekIsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2Y7Ozs7U0F4QkcsTUFBTTtHQUFTLEdBQUc7O0FBMkJ4QixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyIsImZpbGUiOiJlczYvb3BlcmF0b3JzL21pbi1tYXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciB7IExmbyB9ID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xuXG5jbGFzcyBNaW5NYXggZXh0ZW5kcyBMZm8ge1xuICBjb25zdHJ1Y3RvcihwcmV2aW91cywgb3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cyA9IHt9O1xuXG4gICAgc3VwZXIocHJldmlvdXMsIG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIHRoaXMuc2V0dXBTdHJlYW0oeyBmcmFtZVNpemU6IDIgfSk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIHZhciBtaW4gPSArSW5maW5pdHk7XG4gICAgdmFyIG1heCA9IC1JbmZpbml0eTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gZnJhbWUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBmcmFtZVtpXTtcbiAgICAgIGlmICh2YWx1ZSA8IG1pbikgeyBtaW4gPSB2YWx1ZSB9XG4gICAgICBpZiAodmFsdWUgPiBtYXgpIHsgbWF4ID0gdmFsdWUgfVxuICAgIH1cblxuICAgIHRoaXMudGltZSA9IHRpbWU7XG4gICAgdGhpcy5vdXRGcmFtZS5zZXQoW21pbiwgbWF4XSwgMCk7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1pbk1heDsiXX0=