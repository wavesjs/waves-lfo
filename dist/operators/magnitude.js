"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");

var Magnitude = (function (Lfo) {
  function Magnitude() {
    var previous = arguments[0] === undefined ? null : arguments[0];
    var options = arguments[1] === undefined ? {} : arguments[1];

    _babelHelpers.classCallCheck(this, Magnitude);

    if (!(this instanceof Magnitude)) {
      return new Magnitude(previous, options);
    }_babelHelpers.get(_core.Object.getPrototypeOf(Magnitude.prototype), "constructor", this).call(this, previous, options, { normalize: false });

    this.type = "magnitude";

    // sets the necessary logic based on the params
    this.setupStream({ frameSize: 1 });
  }

  _babelHelpers.inherits(Magnitude, Lfo);

  _babelHelpers.prototypeProperties(Magnitude, null, {
    process: {
      value: function process(time, frame) {
        var frameSize = this.streamParams.frameSize,
            normalize = this.params.normalize,
            sum = 0,
            i;

        for (i = 0; i < frameSize; i++) sum += frame[i] * frame[i];

        if (normalize) sum /= frameSize;

        this.outFrame.set([Math.sqrt(sum)], 0);
        this.output(time);
      },
      writable: true,
      configurable: true
    }
  });

  return Magnitude;
})(Lfo);

module.exports = Magnitude;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztJQUVoQyxTQUFTLGNBQVMsR0FBRztBQUVkLFdBRlAsU0FBUztRQUVELFFBQVEsZ0NBQUcsSUFBSTtRQUFFLE9BQU8sZ0NBQUcsRUFBRTs7dUNBRnJDLFNBQVM7O0FBSVgsUUFBSSxFQUFFLElBQUksWUFBWSxTQUFTLENBQUEsQUFBQztBQUFFLGFBQU8sSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQUEsQUFFMUUsOENBTkUsU0FBUyw2Q0FNTCxRQUFRLEVBQUUsT0FBTyxFQUFFLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxFQUFFOztBQUU3QyxRQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQzs7O0FBR3hCLFFBQUksQ0FBQyxXQUFXLENBQUMsRUFBQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztHQUNsQzs7eUJBWkcsU0FBUyxFQUFTLEdBQUc7O29DQUFyQixTQUFTO0FBY2IsV0FBTzthQUFBLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDbkIsWUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTO1lBQ3pDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7WUFDakMsR0FBRyxHQUFHLENBQUM7WUFDUCxDQUFDLENBQUM7O0FBRUosYUFBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQzVCLEdBQUcsSUFBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxBQUFDLENBQUM7O0FBRS9CLFlBQUcsU0FBUyxFQUFFLEdBQUcsSUFBSSxTQUFTLENBQUM7O0FBRS9CLFlBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFlBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDbkI7Ozs7OztTQTNCRyxTQUFTO0dBQVMsR0FBRzs7QUE4QjNCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIExmbyA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcblxuY2xhc3MgTWFnbml0dWRlIGV4dGVuZHMgTGZvIHtcblxuICBjb25zdHJ1Y3RvcihwcmV2aW91cyA9IG51bGwsIG9wdGlvbnMgPSB7fSkge1xuXG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE1hZ25pdHVkZSkpIHJldHVybiBuZXcgTWFnbml0dWRlKHByZXZpb3VzLCBvcHRpb25zKTtcblxuICAgIHN1cGVyKHByZXZpb3VzLCBvcHRpb25zLCB7bm9ybWFsaXplOiBmYWxzZX0pO1xuXG4gICAgdGhpcy50eXBlID0gJ21hZ25pdHVkZSc7XG5cbiAgICAvLyBzZXRzIHRoZSBuZWNlc3NhcnkgbG9naWMgYmFzZWQgb24gdGhlIHBhcmFtc1xuICAgIHRoaXMuc2V0dXBTdHJlYW0oe2ZyYW1lU2l6ZTogMX0pO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSkge1xuICAgIHZhciBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUsXG4gICAgICBub3JtYWxpemUgPSB0aGlzLnBhcmFtcy5ub3JtYWxpemUsXG4gICAgICBzdW0gPSAwLFxuICAgICAgaTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKylcbiAgICAgIHN1bSArPSAoZnJhbWVbaV0gKiBmcmFtZVtpXSk7XG5cbiAgICBpZihub3JtYWxpemUpIHN1bSAvPSBmcmFtZVNpemU7XG5cbiAgICB0aGlzLm91dEZyYW1lLnNldChbTWF0aC5zcXJ0KHN1bSldLCAwKTtcbiAgICB0aGlzLm91dHB1dCh0aW1lKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hZ25pdHVkZTsiXX0=