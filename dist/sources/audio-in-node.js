"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("./audio-in");

var AudioIn = _require.AudioIn;

var Framer = require("./framer");

// web audio API node as a source

var AudioInNode = (function (AudioIn) {
  function AudioInNode() {
    var _this = this;

    var options = arguments[0] === undefined ? {} : arguments[0];

    _babelHelpers.classCallCheck(this, AudioInNode);

    _babelHelpers.get(_core.Object.getPrototypeOf(AudioInNode.prototype), "constructor", this).call(this, options);

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

function factory(options) {
  return new AudioInNode(options);
}
factory.AudioInNode = AudioInNode;

module.exports = factory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztlQUdrQixPQUFPLENBQUMsWUFBWSxDQUFDOztJQUFqQyxPQUFPLFlBQVAsT0FBTzs7QUFDYixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7Ozs7SUFHM0IsV0FBVyxjQUFTLE9BQU87QUFFcEIsV0FGUCxXQUFXOzs7UUFFSCxPQUFPLGdDQUFHLEVBQUU7O3VDQUZwQixXQUFXOztBQUdiLGtEQUhFLFdBQVcsNkNBR1AsT0FBTyxFQUFFOztBQUVmLFFBQUksQ0FBQyxJQUFJLEdBQUcsZUFBZSxDQUFDOztBQUU1QixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFDLElBQUksRUFBRSxLQUFLLEVBQUs7QUFDN0YsWUFBSyxNQUFNLENBQUMsTUFBSyxJQUFJLENBQUMsQ0FBQztLQUN4QixDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVqRSxRQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztHQUM1RDs7eUJBZEcsV0FBVyxFQUFTLE9BQU87O29DQUEzQixXQUFXO0FBaUJmLFNBQUs7Ozs7YUFBQSxpQkFBRzs7O0FBRU4sWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEdBQUcsVUFBQyxDQUFDLEVBQUs7QUFDakMsY0FBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsTUFBSyxPQUFPLENBQUMsQ0FBQztBQUN2RCxnQkFBSyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQUssSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3RDLGdCQUFLLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQUssVUFBVSxDQUFDO1NBQzdDLENBQUM7OztBQUdGLFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5QixZQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO09BQzNDOzs7Ozs7U0E1QkcsV0FBVztHQUFTLE9BQU87O0FBZ0NqQyxTQUFTLE9BQU8sQ0FBQyxPQUFPLEVBQUU7QUFDeEIsU0FBTyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUNqQztBQUNELE9BQU8sQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDOztBQUVsQyxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJlczYvc291cmNlcy9wcm9jZXNzLXdvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmxldCB7IEF1ZGlvSW4gfSA9IHJlcXVpcmUoJy4vYXVkaW8taW4nKTtcbmxldCBGcmFtZXIgPSByZXF1aXJlKCcuL2ZyYW1lcicpO1xuXG4vLyB3ZWIgYXVkaW8gQVBJIG5vZGUgYXMgYSBzb3VyY2VcbmNsYXNzIEF1ZGlvSW5Ob2RlIGV4dGVuZHMgQXVkaW9JbiB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICB0aGlzLnR5cGUgPSAnYXVkaW8taW4tbm9kZSc7XG5cbiAgICB0aGlzLnJlc2xpY2VyID0gbmV3IEZyYW1lcih0aGlzLm91dEZyYW1lLCB0aGlzLmhvcFNpemUsIHRoaXMuX2N0eC5zYW1wbGVSYXRlLCAodGltZSwgZnJhbWUpID0+IHtcbiAgICAgIHRoaXMub3V0cHV0KHRoaXMudGltZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9wcm9jID0gdGhpcy5fY3R4LmNyZWF0ZVNjcmlwdFByb2Nlc3Nvcih0aGlzLmhvcFNpemUsIDEsIDEpO1xuICAgIC8vIGtlZXBhbGl2ZVxuICAgIHRoaXMuX2N0eFsnX3Byb2Nlc3MtJyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpXSA9IHRoaXMuX3Byb2M7XG4gIH1cblxuICAvLyBjb25uZWN0IHRoZSBhdWRpbyBub2RlcyB0byBzdGFydCBzdHJlYW1pbmdcbiAgc3RhcnQoKSB7XG5cbiAgICB0aGlzLl9wcm9jLm9uYXVkaW9wcm9jZXNzID0gKGUpID0+IHtcbiAgICAgIHZhciBibG9jayA9IGUuaW5wdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEodGhpcy5jaGFubmVsKTtcbiAgICAgIHRoaXMucmVzbGljZXIuaW5wdXQodGhpcy50aW1lLCBibG9jayk7XG4gICAgICB0aGlzLnRpbWUgKz0gYmxvY2subGVuZ3RoIC8gdGhpcy5zYW1wbGVSYXRlO1xuICAgIH07XG5cbiAgICAvLyBzdGFydCBcInRoZSBwYXRjaFwiIDspXG4gICAgdGhpcy5fc3JjLmNvbm5lY3QodGhpcy5fcHJvYyk7XG4gICAgdGhpcy5fcHJvYy5jb25uZWN0KHRoaXMuX2N0eC5kZXN0aW5hdGlvbik7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBmYWN0b3J5KG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBBdWRpb0luTm9kZShvcHRpb25zKTtcbn1cbmZhY3RvcnkuQXVkaW9Jbk5vZGUgPSBBdWRpb0luTm9kZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5OyJdfQ==