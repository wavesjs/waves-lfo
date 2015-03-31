"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");

var Magnitude = (function (_Lfo) {
  function Magnitude() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Magnitude);

    var defaults = {
      normalize: false
    };

    _get(_core.Object.getPrototypeOf(Magnitude.prototype), "constructor", this).call(this, options, defaults);

    // this.type = 'magnitude';
  }

  _inherits(Magnitude, _Lfo);

  _createClass(Magnitude, {
    configureStream: {
      value: function configureStream() {
        this.streamParams.frameSize = 1;
      }
    },
    process: {
      value: function process(time, frame, metaData) {
        var frameSize = frame.length;
        var sum = 0;
        var i = 0;

        for (i = 0; i < frameSize; i++) {
          sum += frame[i] * frame[i];
        }

        if (this.params.normalize) {
          // sum is a mean here (for rms)
          sum /= frameSize;
        }

        this.time = time;
        this.outFrame[0] = Math.sqrt(sum);
        this.metaData = metaData;

        this.output();
      }
    }
  });

  return Magnitude;
})(Lfo);

module.exports = Magnitude;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbWFnbml0dWRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUdBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztJQUVoQyxTQUFTO0FBRUYsV0FGUCxTQUFTLEdBRWE7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQUZwQixTQUFTOztBQUdYLFFBQUksUUFBUSxHQUFHO0FBQ2IsZUFBUyxFQUFFLEtBQUs7S0FDakIsQ0FBQzs7QUFFRixxQ0FQRSxTQUFTLDZDQU9MLE9BQU8sRUFBRSxRQUFRLEVBQUU7OztHQUcxQjs7WUFWRyxTQUFTOztlQUFULFNBQVM7QUFZYixtQkFBZTthQUFBLDJCQUFHO0FBQ2hCLFlBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztPQUNqQzs7QUFFRCxXQUFPO2FBQUEsaUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsWUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUM3QixZQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDWixZQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRVYsYUFBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDOUIsYUFBRyxJQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEFBQUMsQ0FBQztTQUM5Qjs7QUFFRCxZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFOztBQUV6QixhQUFHLElBQUksU0FBUyxDQUFDO1NBQ2xCOztBQUVELFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFlBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxZQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFekIsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2Y7Ozs7U0FuQ0csU0FBUztHQUFTLEdBQUc7O0FBc0MzQixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyIsImZpbGUiOiJlczYvb3BlcmF0b3JzL21hZ25pdHVkZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBMZm8gPSByZXF1aXJlKCcuLi9jb3JlL2xmby1iYXNlJyk7XG5cbmNsYXNzIE1hZ25pdHVkZSBleHRlbmRzIExmbyB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgbm9ybWFsaXplOiBmYWxzZVxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICAvLyB0aGlzLnR5cGUgPSAnbWFnbml0dWRlJztcbiAgfVxuXG4gIGNvbmZpZ3VyZVN0cmVhbSgpIHtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSAxO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICB2YXIgZnJhbWVTaXplID0gZnJhbWUubGVuZ3RoO1xuICAgIHZhciBzdW0gPSAwO1xuICAgIHZhciBpID0gMDtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgc3VtICs9IChmcmFtZVtpXSAqIGZyYW1lW2ldKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJhbXMubm9ybWFsaXplKSB7XG4gICAgICAvLyBzdW0gaXMgYSBtZWFuIGhlcmUgKGZvciBybXMpXG4gICAgICBzdW0gLz0gZnJhbWVTaXplO1xuICAgIH1cblxuICAgIHRoaXMudGltZSA9IHRpbWU7XG4gICAgdGhpcy5vdXRGcmFtZVswXSA9IE1hdGguc3FydChzdW0pO1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNYWduaXR1ZGU7Il19