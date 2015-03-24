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

    var blockSize = this.streamParams.frameSize;
    this.scriptProcessor = this.ctx.createScriptProcessor(blockSize, 1, 1);
    // keep the script processor alive
    this.ctx["_process-" + new Date().getTime()] = this.scriptProcessor;

    this.scriptProcessor.onaudioprocess = this.process.bind(this);
  }

  _inherits(AudioInNode, _AudioIn);

  _createClass(AudioInNode, {
    start: {

      // connect the audio nodes to start streaming

      value: function start() {
        // start "the patch" ;)
        this.src.connect(this.scriptProcessor);
        this.scriptProcessor.connect(this.ctx.destination);
      }
    },
    process: {
      value: function process(e) {
        var block = e.inputBuffer.getChannelData(this.params.channel);

        this.time += block.length / this.streamParams.blockSampleRate;
        this.outFrame.set(block, 0);
        this.output();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLW5vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O2VBRWtCLE9BQU8sQ0FBQyxZQUFZLENBQUM7O0lBQWpDLE9BQU8sWUFBUCxPQUFPOztBQUNiLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7OztJQUczQixXQUFXO0FBRUosV0FGUCxXQUFXLEdBRVc7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQUZwQixXQUFXOztBQUdiLHFDQUhFLFdBQVcsNkNBR1AsT0FBTyxFQUFFO0FBQ2YsUUFBSSxDQUFDLElBQUksR0FBRyxlQUFlLENBQUM7O0FBRTVCLFFBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO0FBQzVDLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUV2RSxRQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQzs7QUFFcEUsUUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDL0Q7O1lBWkcsV0FBVzs7ZUFBWCxXQUFXO0FBZWYsU0FBSzs7OzthQUFBLGlCQUFHOztBQUVOLFlBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN2QyxZQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO09BQ3BEOztBQUVELFdBQU87YUFBQSxpQkFBQyxDQUFDLEVBQUU7QUFDVCxZQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU5RCxZQUFJLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUM7QUFDOUQsWUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVCLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNmOzs7O1NBM0JHLFdBQVc7R0FBUyxPQUFPOzs7Ozs7OztBQW9DakMsTUFBTSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMiLCJmaWxlIjoiZXM2L3NvdXJjZXMvYXVkaW8taW4tbm9kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5sZXQgeyBBdWRpb0luIH0gPSByZXF1aXJlKCcuL2F1ZGlvLWluJyk7XG5sZXQgRnJhbWVyID0gcmVxdWlyZSgnLi9mcmFtZXInKTtcblxuLy8gd2ViIGF1ZGlvIEFQSSBub2RlIGFzIGEgc291cmNlXG5jbGFzcyBBdWRpb0luTm9kZSBleHRlbmRzIEF1ZGlvSW4ge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIHRoaXMudHlwZSA9ICdhdWRpby1pbi1ub2RlJztcblxuICAgIHZhciBibG9ja1NpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgdGhpcy5zY3JpcHRQcm9jZXNzb3IgPSB0aGlzLmN0eC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IoYmxvY2tTaXplLCAxLCAxKTtcbiAgICAvLyBrZWVwIHRoZSBzY3JpcHQgcHJvY2Vzc29yIGFsaXZlXG4gICAgdGhpcy5jdHhbJ19wcm9jZXNzLScgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKV0gPSB0aGlzLnNjcmlwdFByb2Nlc3NvcjtcblxuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gdGhpcy5wcm9jZXNzLmJpbmQodGhpcyk7XG4gIH1cblxuICAvLyBjb25uZWN0IHRoZSBhdWRpbyBub2RlcyB0byBzdGFydCBzdHJlYW1pbmdcbiAgc3RhcnQoKSB7XG4gICAgLy8gc3RhcnQgXCJ0aGUgcGF0Y2hcIiA7KVxuICAgIHRoaXMuc3JjLmNvbm5lY3QodGhpcy5zY3JpcHRQcm9jZXNzb3IpO1xuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLmNvbm5lY3QodGhpcy5jdHguZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvY2VzcyhlKSB7XG4gICAgdmFyIGJsb2NrID0gZS5pbnB1dEJ1ZmZlci5nZXRDaGFubmVsRGF0YSh0aGlzLnBhcmFtcy5jaGFubmVsKTtcblxuICAgIHRoaXMudGltZSArPSBibG9jay5sZW5ndGggLyB0aGlzLnN0cmVhbVBhcmFtcy5ibG9ja1NhbXBsZVJhdGU7XG4gICAgdGhpcy5vdXRGcmFtZS5zZXQoYmxvY2ssIDApO1xuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cblxuLy8gZnVuY3Rpb24gZmFjdG9yeShvcHRpb25zKSB7XG4vLyAgIHJldHVybiBuZXcgQXVkaW9Jbk5vZGUob3B0aW9ucyk7XG4vLyB9XG4vLyBmYWN0b3J5LkF1ZGlvSW5Ob2RlID0gQXVkaW9Jbk5vZGU7XG5cbi8vIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTtcbm1vZHVsZS5leHBvcnRzID0gQXVkaW9Jbk5vZGU7Il19