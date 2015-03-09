"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("../core/lfo-base");

var Lfo = _require.Lfo;

var Magnitude = (function (Lfo) {
  function Magnitude() {
    var previous = arguments[0] === undefined ? null : arguments[0];
    var options = arguments[1] === undefined ? {} : arguments[1];

    _babelHelpers.classCallCheck(this, Magnitude);

    _babelHelpers.get(_core.Object.getPrototypeOf(Magnitude.prototype), "constructor", this).call(this, previous, options, { normalize: false });
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

function factory(previous, options) {
  return new Magnitude(previous, options);
}
factory.Magnitude = Magnitude;

module.exports = factory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztlQUdjLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7SUFBbkMsR0FBRyxZQUFILEdBQUc7O0lBRUgsU0FBUyxjQUFTLEdBQUc7QUFFZCxXQUZQLFNBQVM7UUFFRCxRQUFRLGdDQUFHLElBQUk7UUFBRSxPQUFPLGdDQUFHLEVBQUU7O3VDQUZyQyxTQUFTOztBQUdYLGtEQUhFLFNBQVMsNkNBR0wsUUFBUSxFQUFFLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUMvQyxRQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQzs7QUFFeEIsUUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0dBQ3BDOzt5QkFQRyxTQUFTLEVBQVMsR0FBRzs7b0NBQXJCLFNBQVM7QUFTYixXQUFPO2FBQUEsaUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNuQixZQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVM7WUFDekMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUztZQUNqQyxHQUFHLEdBQUcsQ0FBQztZQUNQLENBQUMsQ0FBQzs7QUFFSixhQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFDNUIsR0FBRyxJQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEFBQUMsQ0FBQzs7QUFFL0IsWUFBRyxTQUFTLEVBQUUsR0FBRyxJQUFJLFNBQVMsQ0FBQzs7QUFFL0IsWUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNuQjs7Ozs7O1NBdEJHLFNBQVM7R0FBUyxHQUFHOztBQXlCM0IsU0FBUyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRTtBQUNsQyxTQUFPLElBQUksU0FBUyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztDQUN6QztBQUNELE9BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDOztBQUU5QixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJlczYvc291cmNlcy9wcm9jZXNzLXdvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciB7IExmbyB9ID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xuXG5jbGFzcyBNYWduaXR1ZGUgZXh0ZW5kcyBMZm8ge1xuXG4gIGNvbnN0cnVjdG9yKHByZXZpb3VzID0gbnVsbCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIocHJldmlvdXMsIG9wdGlvbnMsIHsgbm9ybWFsaXplOiBmYWxzZSB9KTtcbiAgICB0aGlzLnR5cGUgPSAnbWFnbml0dWRlJztcbiAgICAvLyBzZXRzIHRoZSBuZWNlc3NhcnkgbG9naWMgYmFzZWQgb24gdGhlIHBhcmFtc1xuICAgIHRoaXMuc2V0dXBTdHJlYW0oeyBmcmFtZVNpemU6IDEgfSk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lKSB7XG4gICAgdmFyIGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSxcbiAgICAgIG5vcm1hbGl6ZSA9IHRoaXMucGFyYW1zLm5vcm1hbGl6ZSxcbiAgICAgIHN1bSA9IDAsXG4gICAgICBpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKVxuICAgICAgc3VtICs9IChmcmFtZVtpXSAqIGZyYW1lW2ldKTtcblxuICAgIGlmKG5vcm1hbGl6ZSkgc3VtIC89IGZyYW1lU2l6ZTtcblxuICAgIHRoaXMub3V0RnJhbWUuc2V0KFtNYXRoLnNxcnQoc3VtKV0sIDApO1xuICAgIHRoaXMub3V0cHV0KHRpbWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZhY3RvcnkocHJldmlvdXMsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBNYWduaXR1ZGUocHJldmlvdXMsIG9wdGlvbnMpO1xufVxuZmFjdG9yeS5NYWduaXR1ZGUgPSBNYWduaXR1ZGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTsiXX0=