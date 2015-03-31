"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");

var MinMax = (function (_Lfo) {
  function MinMax(options) {
    _classCallCheck(this, MinMax);

    var defaults = {};

    _get(_core.Object.getPrototypeOf(MinMax.prototype), "constructor", this).call(this, options, defaults);
  }

  _inherits(MinMax, _Lfo);

  _createClass(MinMax, {
    configureStream: {
      value: function configureStream() {
        this.streamParams.frameSize = 2;
      }
    },
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
        this.outFrame[0] = min;
        this.outFrame[1] = max;
        this.metaData = metaData;

        this.output();
      }
    }
  });

  return MinMax;
})(Lfo);

module.exports = MinMax;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbWluLW1heC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7SUFFaEMsTUFBTTtBQUNDLFdBRFAsTUFBTSxDQUNFLE9BQU8sRUFBRTswQkFEakIsTUFBTTs7QUFFUixRQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7O0FBRWxCLHFDQUpFLE1BQU0sNkNBSUYsT0FBTyxFQUFFLFFBQVEsRUFBRTtHQUMxQjs7WUFMRyxNQUFNOztlQUFOLE1BQU07QUFPVixtQkFBZTthQUFBLDJCQUFHO0FBQ2hCLFlBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztPQUNqQzs7QUFFRCxXQUFPO2FBQUEsaUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsWUFBSSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDcEIsWUFBSSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7O0FBRXBCLGFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDNUMsY0FBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JCLGNBQUksS0FBSyxHQUFHLEdBQUcsRUFBRTtBQUFFLGVBQUcsR0FBRyxLQUFLLENBQUM7V0FBRTtBQUNqQyxjQUFJLEtBQUssR0FBRyxHQUFHLEVBQUU7QUFBRSxlQUFHLEdBQUcsS0FBSyxDQUFDO1dBQUU7U0FDbEM7O0FBRUQsWUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsWUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDdkIsWUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDdkIsWUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7O0FBRXpCLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNmOzs7O1NBM0JHLE1BQU07R0FBUyxHQUFHOztBQThCeEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMiLCJmaWxlIjoiZXM2L29wZXJhdG9ycy9taW4tbWF4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgTGZvID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xuXG5jbGFzcyBNaW5NYXggZXh0ZW5kcyBMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzID0ge307XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG4gIH1cblxuICBjb25maWd1cmVTdHJlYW0oKSB7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gMjtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgdmFyIG1pbiA9ICtJbmZpbml0eTtcbiAgICB2YXIgbWF4ID0gLUluZmluaXR5O1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBmcmFtZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IGZyYW1lW2ldO1xuICAgICAgaWYgKHZhbHVlIDwgbWluKSB7IG1pbiA9IHZhbHVlOyB9XG4gICAgICBpZiAodmFsdWUgPiBtYXgpIHsgbWF4ID0gdmFsdWU7IH1cbiAgICB9XG5cbiAgICB0aGlzLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMub3V0RnJhbWVbMF0gPSBtaW47XG4gICAgdGhpcy5vdXRGcmFtZVsxXSA9IG1heDtcbiAgICB0aGlzLm1ldGFEYXRhID0gbWV0YURhdGE7XG5cbiAgICB0aGlzLm91dHB1dCgpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWluTWF4OyJdfQ==