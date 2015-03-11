"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("../core/lfo-base");

var Lfo = _require.Lfo;

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
        // var frameSize = this.streamParams.frameSize,
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
        // this.outFrame.set([Math.sqrt(sum)], 0);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztlQUdjLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7SUFBbkMsR0FBRyxZQUFILEdBQUc7O0lBRUgsU0FBUztBQUVGLFdBRlAsU0FBUyxHQUU4QjtRQUEvQixRQUFRLGdDQUFHLElBQUk7UUFBRSxPQUFPLGdDQUFHLEVBQUU7OzBCQUZyQyxTQUFTOztBQUdYLHFDQUhFLFNBQVMsNkNBR0wsUUFBUSxFQUFFLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUMvQyxRQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQzs7QUFFeEIsUUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0dBQ3BDOztZQVBHLFNBQVM7O2VBQVQsU0FBUztBQVNiLFdBQU87YUFBQSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFOztBQUVuQixZQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQzdCLFlBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNaLFlBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFVixhQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM5QixhQUFHLElBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQUFBQyxDQUFDO1NBQzlCOztBQUVELFlBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7O0FBRXpCLGFBQUcsSUFBSSxTQUFTLENBQUM7U0FDbEI7O0FBRUQsWUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs7QUFHbEMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNuQjs7OztTQTVCRyxTQUFTO0dBQVMsR0FBRzs7QUErQjNCLFNBQVMsT0FBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUU7QUFDbEMsU0FBTyxJQUFJLFNBQVMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7Q0FDekM7QUFDRCxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQzs7QUFFOUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiZXM2L3NvdXJjZXMvcHJvY2Vzcy13b3JrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcblwidXNlIHN0cmljdFwiO1xuXG52YXIgeyBMZm8gfSA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcblxuY2xhc3MgTWFnbml0dWRlIGV4dGVuZHMgTGZvIHtcblxuICBjb25zdHJ1Y3RvcihwcmV2aW91cyA9IG51bGwsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKHByZXZpb3VzLCBvcHRpb25zLCB7IG5vcm1hbGl6ZTogZmFsc2UgfSk7XG4gICAgdGhpcy50eXBlID0gJ21hZ25pdHVkZSc7XG4gICAgLy8gc2V0cyB0aGUgbmVjZXNzYXJ5IGxvZ2ljIGJhc2VkIG9uIHRoZSBwYXJhbXNcbiAgICB0aGlzLnNldHVwU3RyZWFtKHsgZnJhbWVTaXplOiAxIH0pO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSkge1xuICAgIC8vIHZhciBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUsXG4gICAgdmFyIGZyYW1lU2l6ZSA9IGZyYW1lLmxlbmd0aDtcbiAgICB2YXIgc3VtID0gMDtcbiAgICB2YXIgaSA9IDA7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgIHN1bSArPSAoZnJhbWVbaV0gKiBmcmFtZVtpXSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyYW1zLm5vcm1hbGl6ZSkge1xuICAgICAgLy8gc3VtIGlzIGEgbWVhbiBoZXJlIChmb3Igcm1zKVxuICAgICAgc3VtIC89IGZyYW1lU2l6ZTtcbiAgICB9XG5cbiAgICB0aGlzLm91dEZyYW1lWzBdID0gTWF0aC5zcXJ0KHN1bSk7XG4gICAgLy8gdGhpcy5vdXRGcmFtZS5zZXQoW01hdGguc3FydChzdW0pXSwgMCk7XG5cbiAgICB0aGlzLm91dHB1dCh0aW1lKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmYWN0b3J5KHByZXZpb3VzLCBvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgTWFnbml0dWRlKHByZXZpb3VzLCBvcHRpb25zKTtcbn1cbmZhY3RvcnkuTWFnbml0dWRlID0gTWFnbml0dWRlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7Il19