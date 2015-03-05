"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var AudioIn = require("./audio-in");
var Framer = require("./framer");

// web audio API node as a source

var AudioInNode = (function (AudioIn) {
  function AudioInNode() {
    var _this = this;

    var options = arguments[0] === undefined ? {} : arguments[0];

    _babelHelpers.classCallCheck(this, AudioInNode);

    if (!(this instanceof AudioInNode)) {
      return new AudioInNode(options);
    }_babelHelpers.get(_core.Object.getPrototypeOf(AudioInNode.prototype), "constructor", this).call(this, options);

    this.type = "audio-in-node";

    this.reslicer = new Framer(this.outFrame, this.hopSize, this._ctx.sampleRate, function (time, frame) {
      _this.output(_this.time);
    });

    this._proc = this._ctx.createScriptProcessor(this.hopSize, 1, 1);
    // keepalive
    this._ctx["_process-" + new Date().getTime()] = this._proc;
  }

  _babelHelpers.inherits(AudioInNode, AudioIn);

  _babelHelpers.prototypeProperties(AudioInNode, null, {
    start: {

      // connect the audio nodes to start streaming

      value: function start() {
        var _this = this;

        this._proc.onaudioprocess = function (e) {
          var block = e.inputBuffer.getChannelData(_this.channel);
          _this.reslicer.input(_this.time, block);
          _this.time += block.length / _this.sampleRate;
        };

        // start "the patch" ;)
        this._src.connect(this._proc);
        this._proc.connect(this._ctx.destination);
      },
      writable: true,
      configurable: true
    }
  });

  return AudioInNode;
})(AudioIn);

module.exports = AudioInNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNwQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7Ozs7SUFHM0IsV0FBVyxjQUFTLE9BQU87QUFFcEIsV0FGUCxXQUFXOzs7UUFFSCxPQUFPLGdDQUFHLEVBQUU7O3VDQUZwQixXQUFXOztBQUdiLFFBQUksRUFBRSxJQUFJLFlBQVksV0FBVyxDQUFBLEFBQUM7QUFBRSxhQUFPLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQUEsQUFDcEUsOENBSkUsV0FBVyw2Q0FJUCxPQUFPLEVBQUU7O0FBRWYsUUFBSSxDQUFDLElBQUksR0FBRyxlQUFlLENBQUM7O0FBRTVCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQUMsSUFBSSxFQUFFLEtBQUssRUFBSztBQUM3RixZQUFLLE1BQU0sQ0FBQyxNQUFLLElBQUksQ0FBQyxDQUFDO0tBQ3hCLENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRWpFLFFBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0dBQzVEOzt5QkFmRyxXQUFXLEVBQVMsT0FBTzs7b0NBQTNCLFdBQVc7QUFrQmYsU0FBSzs7OzthQUFBLGlCQUFHOzs7QUFFTixZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsR0FBRyxVQUFDLENBQUMsRUFBSztBQUNqQyxjQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxNQUFLLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZELGdCQUFLLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBSyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDdEMsZ0JBQUssSUFBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBSyxVQUFVLENBQUM7U0FDN0MsQ0FBQzs7O0FBR0YsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlCLFlBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7T0FDM0M7Ozs7OztTQTdCRyxXQUFXO0dBQVMsT0FBTzs7QUFpQ2pDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5cInVzZSBzdHJpY3RcIjtcblxubGV0IEF1ZGlvSW4gPSByZXF1aXJlKCcuL2F1ZGlvLWluJyk7XG5sZXQgRnJhbWVyID0gcmVxdWlyZSgnLi9mcmFtZXInKTtcblxuLy8gd2ViIGF1ZGlvIEFQSSBub2RlIGFzIGEgc291cmNlXG5jbGFzcyBBdWRpb0luTm9kZSBleHRlbmRzIEF1ZGlvSW4ge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBBdWRpb0luTm9kZSkpIHJldHVybiBuZXcgQXVkaW9Jbk5vZGUob3B0aW9ucyk7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gICAgXG4gICAgdGhpcy50eXBlID0gJ2F1ZGlvLWluLW5vZGUnO1xuXG4gICAgdGhpcy5yZXNsaWNlciA9IG5ldyBGcmFtZXIodGhpcy5vdXRGcmFtZSwgdGhpcy5ob3BTaXplLCB0aGlzLl9jdHguc2FtcGxlUmF0ZSwgKHRpbWUsIGZyYW1lKSA9PiB7XG4gICAgICB0aGlzLm91dHB1dCh0aGlzLnRpbWUpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fcHJvYyA9IHRoaXMuX2N0eC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IodGhpcy5ob3BTaXplLCAxLCAxKTtcbiAgICAvLyBrZWVwYWxpdmVcbiAgICB0aGlzLl9jdHhbJ19wcm9jZXNzLScgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKV0gPSB0aGlzLl9wcm9jO1xuICB9XG5cbiAgLy8gY29ubmVjdCB0aGUgYXVkaW8gbm9kZXMgdG8gc3RhcnQgc3RyZWFtaW5nXG4gIHN0YXJ0KCkge1xuXG4gICAgdGhpcy5fcHJvYy5vbmF1ZGlvcHJvY2VzcyA9IChlKSA9PiB7XG4gICAgICB2YXIgYmxvY2sgPSBlLmlucHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKHRoaXMuY2hhbm5lbCk7XG4gICAgICB0aGlzLnJlc2xpY2VyLmlucHV0KHRoaXMudGltZSwgYmxvY2spO1xuICAgICAgdGhpcy50aW1lICs9IGJsb2NrLmxlbmd0aCAvIHRoaXMuc2FtcGxlUmF0ZTtcbiAgICB9O1xuXG4gICAgLy8gc3RhcnQgXCJ0aGUgcGF0Y2hcIiA7KSBcbiAgICB0aGlzLl9zcmMuY29ubmVjdCh0aGlzLl9wcm9jKTtcbiAgICB0aGlzLl9wcm9jLmNvbm5lY3QodGhpcy5fY3R4LmRlc3RpbmF0aW9uKTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXVkaW9Jbk5vZGU7Il19