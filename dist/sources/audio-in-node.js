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
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, AudioInNode);

    _get(_core.Object.getPrototypeOf(AudioInNode.prototype), "constructor", this).call(this, options);

    this.type = "audio-in-node";

    console.log(this.params);

    // this.reslicer = new Framer(this.outFrame, this.hopSize, this._ctx.sampleRate, (time, frame) => {
    //   this.output(this.time);
    // });

    this.scriptProcessor = this.ctx.createScriptProcessor(this.frameSize, 1, 1);
    // keep the script processor alive
    this.ctx["_process-" + new Date().getTime()] = this.scriptProcessor;
  }

  _inherits(AudioInNode, _AudioIn);

  _createClass(AudioInNode, {
    start: {

      // connect the audio nodes to start streaming

      value: function start() {
        var _this = this;

        this.scriptProcessor.onaudioprocess = function (e) {
          var block = e.inputBuffer.getChannelData(_this.channel);
          // this.reslicer.input(this.time, block);
          // @FIXME: `this.time` is always `NaN`
          _this.time += block.length / _this.sampleRate;
          _this.outFrame.set(block, 0);
          _this.output();
        };

        // start "the patch" ;)
        this.src.connect(this.scriptProcessor);
        this.scriptProcessor.connect(this.ctx.destination);
      }
    }
  });

  return AudioInNode;
})(AudioIn);

// function factory(options) {
//   return new AudioInNode(options);
// }
// factory.AudioInNode = AudioInNode;

// module.exports = factory;
module.exports = AudioInNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLW5vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O2VBRWtCLE9BQU8sQ0FBQyxZQUFZLENBQUM7O0lBQWpDLE9BQU8sWUFBUCxPQUFPOztBQUNiLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7OztJQUczQixXQUFXO0FBRUosV0FGUCxXQUFXLEdBRVc7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQUZwQixXQUFXOztBQUdiLHFDQUhFLFdBQVcsNkNBR1AsT0FBTyxFQUFFOztBQUVmLFFBQUksQ0FBQyxJQUFJLEdBQUcsZUFBZSxDQUFDOztBQUU1QixXQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7Ozs7O0FBTXpCLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFNUUsUUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7R0FDckU7O1lBaEJHLFdBQVc7O2VBQVgsV0FBVztBQW1CZixTQUFLOzs7O2FBQUEsaUJBQUc7OztBQUVOLFlBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxHQUFHLFVBQUMsQ0FBQyxFQUFLO0FBQzNDLGNBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLE1BQUssT0FBTyxDQUFDLENBQUM7OztBQUd2RCxnQkFBSyxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFLLFVBQVUsQ0FBQztBQUM1QyxnQkFBSyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QixnQkFBSyxNQUFNLEVBQUUsQ0FBQztTQUNmLENBQUM7OztBQUdGLFlBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN2QyxZQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO09BQ3BEOzs7O1NBakNHLFdBQVc7R0FBUyxPQUFPOzs7Ozs7OztBQTBDakMsTUFBTSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMiLCJmaWxlIjoiZXM2L3NvdXJjZXMvYXVkaW8taW4tbm9kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5sZXQgeyBBdWRpb0luIH0gPSByZXF1aXJlKCcuL2F1ZGlvLWluJyk7XG5sZXQgRnJhbWVyID0gcmVxdWlyZSgnLi9mcmFtZXInKTtcblxuLy8gd2ViIGF1ZGlvIEFQSSBub2RlIGFzIGEgc291cmNlXG5jbGFzcyBBdWRpb0luTm9kZSBleHRlbmRzIEF1ZGlvSW4ge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgdGhpcy50eXBlID0gJ2F1ZGlvLWluLW5vZGUnO1xuXG4gICAgY29uc29sZS5sb2codGhpcy5wYXJhbXMpO1xuXG4gICAgLy8gdGhpcy5yZXNsaWNlciA9IG5ldyBGcmFtZXIodGhpcy5vdXRGcmFtZSwgdGhpcy5ob3BTaXplLCB0aGlzLl9jdHguc2FtcGxlUmF0ZSwgKHRpbWUsIGZyYW1lKSA9PiB7XG4gICAgLy8gICB0aGlzLm91dHB1dCh0aGlzLnRpbWUpO1xuICAgIC8vIH0pO1xuXG4gICAgdGhpcy5zY3JpcHRQcm9jZXNzb3IgPSB0aGlzLmN0eC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IodGhpcy5mcmFtZVNpemUsIDEsIDEpO1xuICAgIC8vIGtlZXAgdGhlIHNjcmlwdCBwcm9jZXNzb3IgYWxpdmVcbiAgICB0aGlzLmN0eFsnX3Byb2Nlc3MtJyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpXSA9IHRoaXMuc2NyaXB0UHJvY2Vzc29yO1xuICB9XG5cbiAgLy8gY29ubmVjdCB0aGUgYXVkaW8gbm9kZXMgdG8gc3RhcnQgc3RyZWFtaW5nXG4gIHN0YXJ0KCkge1xuXG4gICAgdGhpcy5zY3JpcHRQcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3MgPSAoZSkgPT4ge1xuICAgICAgdmFyIGJsb2NrID0gZS5pbnB1dEJ1ZmZlci5nZXRDaGFubmVsRGF0YSh0aGlzLmNoYW5uZWwpO1xuICAgICAgLy8gdGhpcy5yZXNsaWNlci5pbnB1dCh0aGlzLnRpbWUsIGJsb2NrKTtcbiAgICAgIC8vIEBGSVhNRTogYHRoaXMudGltZWAgaXMgYWx3YXlzIGBOYU5gXG4gICAgICB0aGlzLnRpbWUgKz0gYmxvY2subGVuZ3RoIC8gdGhpcy5zYW1wbGVSYXRlO1xuICAgICAgdGhpcy5vdXRGcmFtZS5zZXQoYmxvY2ssIDApO1xuICAgICAgdGhpcy5vdXRwdXQoKTtcbiAgICB9O1xuXG4gICAgLy8gc3RhcnQgXCJ0aGUgcGF0Y2hcIiA7KVxuICAgIHRoaXMuc3JjLmNvbm5lY3QodGhpcy5zY3JpcHRQcm9jZXNzb3IpO1xuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLmNvbm5lY3QodGhpcy5jdHguZGVzdGluYXRpb24pO1xuICB9XG59XG5cbi8vIGZ1bmN0aW9uIGZhY3Rvcnkob3B0aW9ucykge1xuLy8gICByZXR1cm4gbmV3IEF1ZGlvSW5Ob2RlKG9wdGlvbnMpO1xuLy8gfVxuLy8gZmFjdG9yeS5BdWRpb0luTm9kZSA9IEF1ZGlvSW5Ob2RlO1xuXG4vLyBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7XG5tb2R1bGUuZXhwb3J0cyA9IEF1ZGlvSW5Ob2RlOyJdfQ==