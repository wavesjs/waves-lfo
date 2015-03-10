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
        var frameSize = this.streamParams.frameSize,
            normalize = this.params.normalize,
            sum = 0,
            i;

        for (i = 0; i < frameSize; i++) {
          sum += frame[i] * frame[i];
        }

        if (normalize) {
          sum /= frameSize;
        }

        this.outFrame.set([Math.sqrt(sum)], 0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztlQUdjLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7SUFBbkMsR0FBRyxZQUFILEdBQUc7O0lBRUgsU0FBUztBQUVGLFdBRlAsU0FBUyxHQUU4QjtRQUEvQixRQUFRLGdDQUFHLElBQUk7UUFBRSxPQUFPLGdDQUFHLEVBQUU7OzBCQUZyQyxTQUFTOztBQUdYLHFDQUhFLFNBQVMsNkNBR0wsUUFBUSxFQUFFLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUMvQyxRQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQzs7QUFFeEIsUUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0dBQ3BDOztZQVBHLFNBQVM7O2VBQVQsU0FBUztBQVNiLFdBQU87YUFBQSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ25CLFlBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUztZQUN6QyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTO1lBQ2pDLEdBQUcsR0FBRyxDQUFDO1lBQ1AsQ0FBQyxDQUFDOztBQUVKLGFBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzlCLGFBQUcsSUFBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxBQUFDLENBQUM7U0FDOUI7O0FBRUQsWUFBSSxTQUFTLEVBQUU7QUFBRSxhQUFHLElBQUksU0FBUyxDQUFDO1NBQUU7O0FBRXBDLFlBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFlBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDbkI7Ozs7U0F2QkcsU0FBUztHQUFTLEdBQUc7O0FBMEIzQixTQUFTLE9BQU8sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFO0FBQ2xDLFNBQU8sSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0NBQ3pDO0FBQ0QsT0FBTyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7O0FBRTlCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIHsgTGZvIH0gPSByZXF1aXJlKCcuLi9jb3JlL2xmby1iYXNlJyk7XG5cbmNsYXNzIE1hZ25pdHVkZSBleHRlbmRzIExmbyB7XG5cbiAgY29uc3RydWN0b3IocHJldmlvdXMgPSBudWxsLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihwcmV2aW91cywgb3B0aW9ucywgeyBub3JtYWxpemU6IGZhbHNlIH0pO1xuICAgIHRoaXMudHlwZSA9ICdtYWduaXR1ZGUnO1xuICAgIC8vIHNldHMgdGhlIG5lY2Vzc2FyeSBsb2dpYyBiYXNlZCBvbiB0aGUgcGFyYW1zXG4gICAgdGhpcy5zZXR1cFN0cmVhbSh7IGZyYW1lU2l6ZTogMSB9KTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUpIHtcbiAgICB2YXIgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplLFxuICAgICAgbm9ybWFsaXplID0gdGhpcy5wYXJhbXMubm9ybWFsaXplLFxuICAgICAgc3VtID0gMCxcbiAgICAgIGk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgIHN1bSArPSAoZnJhbWVbaV0gKiBmcmFtZVtpXSk7XG4gICAgfVxuXG4gICAgaWYgKG5vcm1hbGl6ZSkge8Kgc3VtIC89IGZyYW1lU2l6ZTsgfVxuXG4gICAgdGhpcy5vdXRGcmFtZS5zZXQoW01hdGguc3FydChzdW0pXSwgMCk7XG4gICAgdGhpcy5vdXRwdXQodGltZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmFjdG9yeShwcmV2aW91cywgb3B0aW9ucykge1xuICByZXR1cm4gbmV3IE1hZ25pdHVkZShwcmV2aW91cywgb3B0aW9ucyk7XG59XG5mYWN0b3J5Lk1hZ25pdHVkZSA9IE1hZ25pdHVkZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5OyJdfQ==