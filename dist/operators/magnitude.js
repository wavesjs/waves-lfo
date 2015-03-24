"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");

var Magnitude = (function (_Lfo) {
  function Magnitude() {
    var previous = arguments[0] === undefined ? null : arguments[0];
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Magnitude);

    _get(_core.Object.getPrototypeOf(Magnitude.prototype), "constructor", this).call(this, previous, options, { normalize: false });
    this.type = "magnitude";
    // sets the necessary logic based on the params
    this.setupStream({ frameSize: 1 });
  }

  _inherits(Magnitude, _Lfo);

  _createClass(Magnitude, {
    process: {
      value: function process(time, frame) {
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

        this.outFrame[0] = Math.sqrt(sum);
        this.output(time);
      }
    }
  });

  return Magnitude;
})(Lfo);

function factory(previous, options) {
  return new Magnitude(previous, options);
}
factory.Magnitude = Magnitude;

module.exports = factory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbWFnbml0dWRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUdBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztJQUVoQyxTQUFTO0FBRUYsV0FGUCxTQUFTLEdBRThCO1FBQS9CLFFBQVEsZ0NBQUcsSUFBSTtRQUFFLE9BQU8sZ0NBQUcsRUFBRTs7MEJBRnJDLFNBQVM7O0FBR1gscUNBSEUsU0FBUyw2Q0FHTCxRQUFRLEVBQUUsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxFQUFFO0FBQy9DLFFBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDOztBQUV4QixRQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7R0FDcEM7O1lBUEcsU0FBUzs7ZUFBVCxTQUFTO0FBU2IsV0FBTzthQUFBLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDbkIsWUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUM3QixZQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDWixZQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRVYsYUFBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDOUIsYUFBRyxJQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEFBQUMsQ0FBQztTQUM5Qjs7QUFFRCxZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFOztBQUV6QixhQUFHLElBQUksU0FBUyxDQUFDO1NBQ2xCOztBQUVELFlBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxZQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ25COzs7O1NBekJHLFNBQVM7R0FBUyxHQUFHOztBQTRCM0IsU0FBUyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRTtBQUNsQyxTQUFPLElBQUksU0FBUyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztDQUN6QztBQUNELE9BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDOztBQUU5QixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJlczYvb3BlcmF0b3JzL21hZ25pdHVkZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBMZm8gPSByZXF1aXJlKCcuLi9jb3JlL2xmby1iYXNlJyk7XG5cbmNsYXNzIE1hZ25pdHVkZSBleHRlbmRzIExmbyB7XG5cbiAgY29uc3RydWN0b3IocHJldmlvdXMgPSBudWxsLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihwcmV2aW91cywgb3B0aW9ucywgeyBub3JtYWxpemU6IGZhbHNlIH0pO1xuICAgIHRoaXMudHlwZSA9ICdtYWduaXR1ZGUnO1xuICAgIC8vIHNldHMgdGhlIG5lY2Vzc2FyeSBsb2dpYyBiYXNlZCBvbiB0aGUgcGFyYW1zXG4gICAgdGhpcy5zZXR1cFN0cmVhbSh7IGZyYW1lU2l6ZTogMSB9KTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUpIHtcbiAgICB2YXIgZnJhbWVTaXplID0gZnJhbWUubGVuZ3RoO1xuICAgIHZhciBzdW0gPSAwO1xuICAgIHZhciBpID0gMDtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgc3VtICs9IChmcmFtZVtpXSAqIGZyYW1lW2ldKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJhbXMubm9ybWFsaXplKSB7XG4gICAgICAvLyBzdW0gaXMgYSBtZWFuIGhlcmUgKGZvciBybXMpXG4gICAgICBzdW0gLz0gZnJhbWVTaXplO1xuICAgIH1cblxuICAgIHRoaXMub3V0RnJhbWVbMF0gPSBNYXRoLnNxcnQoc3VtKTtcbiAgICB0aGlzLm91dHB1dCh0aW1lKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmYWN0b3J5KHByZXZpb3VzLCBvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgTWFnbml0dWRlKHByZXZpb3VzLCBvcHRpb25zKTtcbn1cbmZhY3RvcnkuTWFnbml0dWRlID0gTWFnbml0dWRlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7Il19