
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

    // this.type = 'magnitude';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbWFnbml0dWRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7QUFFYixJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7SUFFaEMsU0FBUztZQUFULFNBQVM7O0FBRUYsV0FGUCxTQUFTLEdBRWE7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQUZwQixTQUFTOztBQUdYLFFBQUksUUFBUSxHQUFHO0FBQ2IsZUFBUyxFQUFFLEtBQUs7S0FDakIsQ0FBQzs7QUFFRiwrQkFQRSxTQUFTLDZDQU9MLE9BQU8sRUFBRSxRQUFRLEVBQUU7OztHQUcxQjs7ZUFWRyxTQUFTOztXQVlFLDJCQUFHO0FBQ2hCLFVBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztLQUNqQzs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsVUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUM3QixVQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDWixVQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRVYsV0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDOUIsV0FBRyxJQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEFBQUMsQ0FBQztPQUM5Qjs7QUFFRCxVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFOztBQUV6QixXQUFHLElBQUksU0FBUyxDQUFDO09BQ2xCOztBQUVELFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFVBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFekIsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2Y7OztTQW5DRyxTQUFTO0dBQVMsR0FBRzs7QUFzQzNCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDIiwiZmlsZSI6ImVzNi9vcGVyYXRvcnMvbWFnbml0dWRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIExmbyA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcblxuY2xhc3MgTWFnbml0dWRlIGV4dGVuZHMgTGZvIHtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBub3JtYWxpemU6IGZhbHNlXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIC8vIHRoaXMudHlwZSA9ICdtYWduaXR1ZGUnO1xuICB9XG5cbiAgY29uZmlndXJlU3RyZWFtKCkge1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IDE7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIHZhciBmcmFtZVNpemUgPSBmcmFtZS5sZW5ndGg7XG4gICAgdmFyIHN1bSA9IDA7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICBzdW0gKz0gKGZyYW1lW2ldICogZnJhbWVbaV0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmFtcy5ub3JtYWxpemUpIHtcbiAgICAgIC8vIHN1bSBpcyBhIG1lYW4gaGVyZSAoZm9yIHJtcylcbiAgICAgIHN1bSAvPSBmcmFtZVNpemU7XG4gICAgfVxuXG4gICAgdGhpcy50aW1lID0gdGltZTtcbiAgICB0aGlzLm91dEZyYW1lWzBdID0gTWF0aC5zcXJ0KHN1bSk7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hZ25pdHVkZTsiXX0=