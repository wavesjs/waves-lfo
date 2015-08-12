
"use strict";

var _get = require("babel-runtime/helpers/get")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var Lfo = require('../core/lfo-base');

var Magnitude = (function (_Lfo) {
  _inherits(Magnitude, _Lfo);

  function Magnitude() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Magnitude);

    var defaults = {
      normalize: false
    };

    _get(Object.getPrototypeOf(Magnitude.prototype), "constructor", this).call(this, options, defaults);
  }

  _createClass(Magnitude, [{
    key: "configureStream",
    value: function configureStream() {
      this.streamParams.frameSize = 1;
    }
  }, {
    key: "process",
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
  }]);

  return Magnitude;
})(Lfo);

module.exports = Magnitude;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbWFnbml0dWRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7QUFFYixJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7SUFFaEMsU0FBUztZQUFULFNBQVM7O0FBRUYsV0FGUCxTQUFTLEdBRWE7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQUZwQixTQUFTOztBQUdYLFFBQUksUUFBUSxHQUFHO0FBQ2IsZUFBUyxFQUFFLEtBQUs7S0FDakIsQ0FBQzs7QUFFRiwrQkFQRSxTQUFTLDZDQU9MLE9BQU8sRUFBRSxRQUFRLEVBQUU7R0FDMUI7O2VBUkcsU0FBUzs7V0FVRSwyQkFBRztBQUNoQixVQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7S0FDakM7OztXQUVNLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFVBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDN0IsVUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ1osVUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVWLFdBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzlCLFdBQUcsSUFBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxBQUFDLENBQUM7T0FDOUI7O0FBRUQsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTs7QUFFekIsV0FBRyxJQUFJLFNBQVMsQ0FBQztPQUNsQjs7QUFFRCxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEMsVUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7O0FBRXpCLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7U0FqQ0csU0FBUztHQUFTLEdBQUc7O0FBb0MzQixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyIsImZpbGUiOiJlczYvb3BlcmF0b3JzL21hZ25pdHVkZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBMZm8gPSByZXF1aXJlKCcuLi9jb3JlL2xmby1iYXNlJyk7XG5cbmNsYXNzIE1hZ25pdHVkZSBleHRlbmRzIExmbyB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgbm9ybWFsaXplOiBmYWxzZVxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG4gIH1cblxuICBjb25maWd1cmVTdHJlYW0oKSB7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gMTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgdmFyIGZyYW1lU2l6ZSA9IGZyYW1lLmxlbmd0aDtcbiAgICB2YXIgc3VtID0gMDtcbiAgICB2YXIgaSA9IDA7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgIHN1bSArPSAoZnJhbWVbaV0gKiBmcmFtZVtpXSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyYW1zLm5vcm1hbGl6ZSkge1xuICAgICAgLy8gc3VtIGlzIGEgbWVhbiBoZXJlIChmb3Igcm1zKVxuICAgICAgc3VtIC89IGZyYW1lU2l6ZTtcbiAgICB9XG5cbiAgICB0aGlzLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMub3V0RnJhbWVbMF0gPSBNYXRoLnNxcnQoc3VtKTtcbiAgICB0aGlzLm1ldGFEYXRhID0gbWV0YURhdGE7XG5cbiAgICB0aGlzLm91dHB1dCgpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWFnbml0dWRlOyJdfQ==