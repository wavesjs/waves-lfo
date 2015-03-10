"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("./audio-in");

var AudioIn = _require.AudioIn;

var Framer = require("./framer");

// web audio API node as a source

var AudioInNode = (function (_AudioIn) {
  function AudioInNode() {
    var _this = this;

    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, AudioInNode);

    _get(_core.Object.getPrototypeOf(AudioInNode.prototype), "constructor", this).call(this, options);

    this.type = "audio-in-node";

    console.log(this.params);

    this.reslicer = new Framer(this.outFrame, this.hopSize, this._ctx.sampleRate, function (time, frame) {
      _this.output(_this.time);
    });

    this._proc = this._ctx.createScriptProcessor(this.hopSize, 1, 1);
    // keep the script processor alive
    this._ctx["_process-" + new Date().getTime()] = this._proc;
  }

  _inherits(AudioInNode, _AudioIn);

  _createClass(AudioInNode, {
    start: {

      // connect the audio nodes to start streaming

      value: function start() {
        var _this = this;

        this._proc.onaudioprocess = function (e) {
          var block = e.inputBuffer.getChannelData(_this.channel);
          _this.reslicer.input(_this.time, block);
          // @FIXME: `this.time` is always `NaN`
          _this.time += block.length / _this.sampleRate;
        };

        // start "the patch" ;)
        this._src.connect(this._proc);
        // does it make sens ?
        this._proc.connect(this._ctx.destination);
      }
    }
  });

  return AudioInNode;
})(AudioIn);

function factory(options) {
  return new AudioInNode(options);
}
factory.AudioInNode = AudioInNode;

module.exports = factory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL3Byb2Nlc3Mtd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztlQUdrQixPQUFPLENBQUMsWUFBWSxDQUFDOztJQUFqQyxPQUFPLFlBQVAsT0FBTzs7QUFDYixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7Ozs7SUFHM0IsV0FBVztBQUVKLFdBRlAsV0FBVyxHQUVXOzs7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQUZwQixXQUFXOztBQUdiLHFDQUhFLFdBQVcsNkNBR1AsT0FBTyxFQUFFOztBQUVmLFFBQUksQ0FBQyxJQUFJLEdBQUcsZUFBZSxDQUFDOztBQUU1QixXQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFekIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsVUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFLO0FBQzdGLFlBQUssTUFBTSxDQUFDLE1BQUssSUFBSSxDQUFDLENBQUM7S0FDeEIsQ0FBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFakUsUUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7R0FDNUQ7O1lBaEJHLFdBQVc7O2VBQVgsV0FBVztBQW1CZixTQUFLOzs7O2FBQUEsaUJBQUc7OztBQUVOLFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxHQUFHLFVBQUMsQ0FBQyxFQUFLO0FBQ2pDLGNBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLE1BQUssT0FBTyxDQUFDLENBQUM7QUFDdkQsZ0JBQUssUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFLLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFdEMsZ0JBQUssSUFBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBSyxVQUFVLENBQUM7U0FDN0MsQ0FBQzs7O0FBR0YsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUU5QixZQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO09BQzNDOzs7O1NBaENHLFdBQVc7R0FBUyxPQUFPOztBQW1DakMsU0FBUyxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ3hCLFNBQU8sSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FDakM7QUFDRCxPQUFPLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQzs7QUFFbEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiZXM2L3NvdXJjZXMvcHJvY2Vzcy13b3JrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcblwidXNlIHN0cmljdFwiO1xuXG5sZXQgeyBBdWRpb0luIH0gPSByZXF1aXJlKCcuL2F1ZGlvLWluJyk7XG5sZXQgRnJhbWVyID0gcmVxdWlyZSgnLi9mcmFtZXInKTtcblxuLy8gd2ViIGF1ZGlvIEFQSSBub2RlIGFzIGEgc291cmNlXG5jbGFzcyBBdWRpb0luTm9kZSBleHRlbmRzIEF1ZGlvSW4ge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgdGhpcy50eXBlID0gJ2F1ZGlvLWluLW5vZGUnO1xuXG4gICAgY29uc29sZS5sb2codGhpcy5wYXJhbXMpO1xuXG4gICAgdGhpcy5yZXNsaWNlciA9IG5ldyBGcmFtZXIodGhpcy5vdXRGcmFtZSwgdGhpcy5ob3BTaXplLCB0aGlzLl9jdHguc2FtcGxlUmF0ZSwgKHRpbWUsIGZyYW1lKSA9PiB7XG4gICAgICB0aGlzLm91dHB1dCh0aGlzLnRpbWUpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fcHJvYyA9IHRoaXMuX2N0eC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IodGhpcy5ob3BTaXplLCAxLCAxKTtcbiAgICAvLyBrZWVwIHRoZSBzY3JpcHQgcHJvY2Vzc29yIGFsaXZlXG4gICAgdGhpcy5fY3R4WydfcHJvY2Vzcy0nICsgbmV3IERhdGUoKS5nZXRUaW1lKCldID0gdGhpcy5fcHJvYztcbiAgfVxuXG4gIC8vIGNvbm5lY3QgdGhlIGF1ZGlvIG5vZGVzIHRvIHN0YXJ0IHN0cmVhbWluZ1xuICBzdGFydCgpIHtcblxuICAgIHRoaXMuX3Byb2Mub25hdWRpb3Byb2Nlc3MgPSAoZSkgPT4ge1xuICAgICAgdmFyIGJsb2NrID0gZS5pbnB1dEJ1ZmZlci5nZXRDaGFubmVsRGF0YSh0aGlzLmNoYW5uZWwpO1xuICAgICAgdGhpcy5yZXNsaWNlci5pbnB1dCh0aGlzLnRpbWUsIGJsb2NrKTtcbiAgICAgIC8vIEBGSVhNRTogYHRoaXMudGltZWAgaXMgYWx3YXlzIGBOYU5gXG4gICAgICB0aGlzLnRpbWUgKz0gYmxvY2subGVuZ3RoIC8gdGhpcy5zYW1wbGVSYXRlO1xuICAgIH07XG5cbiAgICAvLyBzdGFydCBcInRoZSBwYXRjaFwiIDspXG4gICAgdGhpcy5fc3JjLmNvbm5lY3QodGhpcy5fcHJvYyk7XG4gICAgLy8gZG9lcyBpdCBtYWtlIHNlbnMgP1xuICAgIHRoaXMuX3Byb2MuY29ubmVjdCh0aGlzLl9jdHguZGVzdGluYXRpb24pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZhY3Rvcnkob3B0aW9ucykge1xuICByZXR1cm4gbmV3IEF1ZGlvSW5Ob2RlKG9wdGlvbnMpO1xufVxuZmFjdG9yeS5BdWRpb0luTm9kZSA9IEF1ZGlvSW5Ob2RlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7Il19