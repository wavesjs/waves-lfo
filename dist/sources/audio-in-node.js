"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("./audio-in");

var AudioIn = _require.AudioIn;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLW5vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O2VBRWtCLE9BQU8sQ0FBQyxZQUFZLENBQUM7O0lBQWpDLE9BQU8sWUFBUCxPQUFPOzs7O0lBR1AsV0FBVztBQUVKLFdBRlAsV0FBVyxHQUVXO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFGcEIsV0FBVzs7QUFHYixxQ0FIRSxXQUFXLDZDQUdQLE9BQU8sRUFBRTtBQUNmLFFBQUksQ0FBQyxJQUFJLEdBQUcsZUFBZSxDQUFDOztBQUU1QixRQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztBQUM1QyxRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O0FBR3ZFLFFBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO0FBQ3BFLFFBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQy9EOztZQVpHLFdBQVc7O2VBQVgsV0FBVztBQWVmLFNBQUs7Ozs7YUFBQSxpQkFBRzs7QUFFTixZQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDdkMsWUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztPQUNwRDs7QUFFRCxXQUFPO2FBQUEsaUJBQUMsQ0FBQyxFQUFFO0FBQ1QsWUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFOUQsWUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDO0FBQzlELFlBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QixZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZjs7OztTQTNCRyxXQUFXO0dBQVMsT0FBTzs7Ozs7Ozs7QUFvQ2pDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL2F1ZGlvLWluLW5vZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxubGV0IHsgQXVkaW9JbiB9ID0gcmVxdWlyZSgnLi9hdWRpby1pbicpO1xuXG4vLyB3ZWIgYXVkaW8gQVBJIG5vZGUgYXMgYSBzb3VyY2VcbmNsYXNzIEF1ZGlvSW5Ob2RlIGV4dGVuZHMgQXVkaW9JbiB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gICAgdGhpcy50eXBlID0gJ2F1ZGlvLWluLW5vZGUnO1xuXG4gICAgdmFyIGJsb2NrU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB0aGlzLnNjcmlwdFByb2Nlc3NvciA9IHRoaXMuY3R4LmNyZWF0ZVNjcmlwdFByb2Nlc3NvcihibG9ja1NpemUsIDEsIDEpO1xuXG4gICAgLy8ga2VlcCB0aGUgc2NyaXB0IHByb2Nlc3NvciBhbGl2ZVxuICAgIHRoaXMuY3R4WydfcHJvY2Vzcy0nICsgbmV3IERhdGUoKS5nZXRUaW1lKCldID0gdGhpcy5zY3JpcHRQcm9jZXNzb3I7XG4gICAgdGhpcy5zY3JpcHRQcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3MgPSB0aGlzLnByb2Nlc3MuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8vIGNvbm5lY3QgdGhlIGF1ZGlvIG5vZGVzIHRvIHN0YXJ0IHN0cmVhbWluZ1xuICBzdGFydCgpIHtcbiAgICAvLyBzdGFydCBcInRoZSBwYXRjaFwiIDspXG4gICAgdGhpcy5zcmMuY29ubmVjdCh0aGlzLnNjcmlwdFByb2Nlc3Nvcik7XG4gICAgdGhpcy5zY3JpcHRQcm9jZXNzb3IuY29ubmVjdCh0aGlzLmN0eC5kZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm9jZXNzKGUpIHtcbiAgICB2YXIgYmxvY2sgPSBlLmlucHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKHRoaXMucGFyYW1zLmNoYW5uZWwpO1xuXG4gICAgdGhpcy50aW1lICs9IGJsb2NrLmxlbmd0aCAvIHRoaXMuc3RyZWFtUGFyYW1zLmJsb2NrU2FtcGxlUmF0ZTtcbiAgICB0aGlzLm91dEZyYW1lLnNldChibG9jaywgMCk7XG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufVxuXG4vLyBmdW5jdGlvbiBmYWN0b3J5KG9wdGlvbnMpIHtcbi8vICAgcmV0dXJuIG5ldyBBdWRpb0luTm9kZShvcHRpb25zKTtcbi8vIH1cbi8vIGZhY3RvcnkuQXVkaW9Jbk5vZGUgPSBBdWRpb0luTm9kZTtcblxuLy8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xubW9kdWxlLmV4cG9ydHMgPSBBdWRpb0luTm9kZTsiXX0=