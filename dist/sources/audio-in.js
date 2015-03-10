"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("../core/lfo-base");

var Lfo = _require.Lfo;

// var audioContext = new window.AudioContext();

var AudioIn = (function (_Lfo) {
  function AudioIn() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, AudioIn);

    this.type = "audio-in";

    // defaults
    var defaults = {
      frameSize: 512,
      blockSize: 2048,
      hopSize: 512,
      channel: 0
    };

    _get(_core.Object.getPrototypeOf(AudioIn.prototype), "constructor", this).call(this, null, options, defaults);

    // private
    this._ctx = this.params.ctx || new window.AudioContext();
    this._currentTime = 0;
    this._src = this.params.src;

    // public
    this.frameSize = this.params.frameSize;
    this.blockSize = this.params.blockSize;
    this.hopSize = this.params.hopSize;
    this.channel = this.params.channel;
    this.frameOffset = 0;
    this.sampleRate = this._ctx.sampleRate;

    this.setupStream({
      frameRate: this.sampleRate / this.hopSize,
      frameSize: this.frameSize,
      audioSampleRate: this._ctx.sampleRate // cannot be used ... why is this here ?
    });
  }

  _inherits(AudioIn, _Lfo);

  _createClass(AudioIn, {
    start: {
      value: function start() {}
    }
  });

  return AudioIn;
})(Lfo);

function factory(options) {
  return new AudioIn(options);
}
factory.AudioIn = AudioIn;

module.exports = factory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztlQUdjLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7SUFBbkMsR0FBRyxZQUFILEdBQUc7Ozs7SUFHSCxPQUFPO0FBRUEsV0FGUCxPQUFPLEdBRWU7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQUZwQixPQUFPOztBQUdULFFBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDOzs7QUFHdkIsUUFBSSxRQUFRLEdBQUc7QUFDYixlQUFTLEVBQUUsR0FBRztBQUNkLGVBQVMsRUFBRSxJQUFJO0FBQ2YsYUFBTyxFQUFFLEdBQUc7QUFDWixhQUFPLEVBQUUsQ0FBQztLQUNYLENBQUM7O0FBRUYscUNBYkUsT0FBTyw2Q0FhSCxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTs7O0FBRy9CLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDekQsUUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7QUFDdEIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQzs7O0FBRzVCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDdkMsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUN2QyxRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQ25DLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDbkMsUUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDckIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQzs7QUFFdkMsUUFBSSxDQUFDLFdBQVcsQ0FBQztBQUNmLGVBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPO0FBQ3pDLGVBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztBQUN6QixxQkFBZSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVTtBQUFBLEtBQ3RDLENBQUMsQ0FBQztHQUNKOztZQWpDRyxPQUFPOztlQUFQLE9BQU87QUFtQ1gsU0FBSzthQUFBLGlCQUFHLEVBQUU7Ozs7U0FuQ04sT0FBTztHQUFTLEdBQUc7O0FBdUN6QixTQUFTLE9BQU8sQ0FBQyxPQUFPLEVBQUU7QUFDeEIsU0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUM3QjtBQUNELE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOztBQUUxQixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJlczYvc291cmNlcy9wcm9jZXNzLXdvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciB7IExmbyB9ID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xuLy8gdmFyIGF1ZGlvQ29udGV4dCA9IG5ldyB3aW5kb3cuQXVkaW9Db250ZXh0KCk7XG5cbmNsYXNzIEF1ZGlvSW4gZXh0ZW5kcyBMZm8ge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMudHlwZSA9ICdhdWRpby1pbic7XG5cbiAgICAvLyBkZWZhdWx0c1xuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIGZyYW1lU2l6ZTogNTEyLFxuICAgICAgYmxvY2tTaXplOiAyMDQ4LFxuICAgICAgaG9wU2l6ZTogNTEyLFxuICAgICAgY2hhbm5lbDogMFxuICAgIH07XG5cbiAgICBzdXBlcihudWxsLCBvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICAvLyBwcml2YXRlXG4gICAgdGhpcy5fY3R4ID0gdGhpcy5wYXJhbXMuY3R4IHx8wqBuZXcgd2luZG93LkF1ZGlvQ29udGV4dCgpO1xuICAgIHRoaXMuX2N1cnJlbnRUaW1lID0gMDtcbiAgICB0aGlzLl9zcmMgPSB0aGlzLnBhcmFtcy5zcmM7XG5cbiAgICAvLyBwdWJsaWNcbiAgICB0aGlzLmZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB0aGlzLmJsb2NrU2l6ZSA9IHRoaXMucGFyYW1zLmJsb2NrU2l6ZTtcbiAgICB0aGlzLmhvcFNpemUgPSB0aGlzLnBhcmFtcy5ob3BTaXplO1xuICAgIHRoaXMuY2hhbm5lbCA9IHRoaXMucGFyYW1zLmNoYW5uZWw7XG4gICAgdGhpcy5mcmFtZU9mZnNldCA9IDA7XG4gICAgdGhpcy5zYW1wbGVSYXRlID0gdGhpcy5fY3R4LnNhbXBsZVJhdGU7XG5cbiAgICB0aGlzLnNldHVwU3RyZWFtKHtcbiAgICAgIGZyYW1lUmF0ZTogdGhpcy5zYW1wbGVSYXRlIC8gdGhpcy5ob3BTaXplLFxuICAgICAgZnJhbWVTaXplOiB0aGlzLmZyYW1lU2l6ZSxcbiAgICAgIGF1ZGlvU2FtcGxlUmF0ZTogdGhpcy5fY3R4LnNhbXBsZVJhdGUgLy8gY2Fubm90IGJlIHVzZWQgLi4uIHdoeSBpcyB0aGlzIGhlcmUgP1xuICAgIH0pO1xuICB9XG5cbiAgc3RhcnQoKSB7fVxuXG59XG5cbmZ1bmN0aW9uIGZhY3Rvcnkob3B0aW9ucykge1xuICByZXR1cm4gbmV3IEF1ZGlvSW4ob3B0aW9ucyk7XG59XG5mYWN0b3J5LkF1ZGlvSW4gPSBBdWRpb0luO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7Il19