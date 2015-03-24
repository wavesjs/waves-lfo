"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var AudioIn = require("./audio-in");

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
    // this.ctx['_process-' + new Date().getTime()] = this.scriptProcessor;
    this.scriptProcessor.onaudioprocess = this.process.bind(this);
    this.src.connect(this.scriptProcessor);
  }

  _inherits(AudioInNode, _AudioIn);

  _createClass(AudioInNode, {
    start: {

      // connect the audio nodes to start streaming

      value: function start() {
        this.reset();
        // start "the patch" ;)
        this.scriptProcessor.connect(this.ctx.destination);
      }
    },
    stop: {
      value: function stop() {
        this.finalize();
        this.scriptProcessor.disconnect();
      }
    },
    process: {

      // is basically the `scriptProcessor.onaudioprocess` callback

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

module.exports = AudioInNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLW5vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBRUEsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDOzs7O0lBRzlCLFdBQVc7QUFFSixXQUZQLFdBQVcsR0FFVztRQUFkLE9BQU8sZ0NBQUcsRUFBRTs7MEJBRnBCLFdBQVc7O0FBR2IscUNBSEUsV0FBVyw2Q0FHUCxPQUFPLEVBQUU7QUFDZixRQUFJLENBQUMsSUFBSSxHQUFHLGVBQWUsQ0FBQzs7QUFFNUIsUUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUM7QUFDNUMsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Ozs7QUFJdkUsUUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUQsUUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0dBQ3hDOztZQWJHLFdBQVc7O2VBQVgsV0FBVztBQWdCZixTQUFLOzs7O2FBQUEsaUJBQUc7QUFDTixZQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRWIsWUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztPQUNwRDs7QUFFRCxRQUFJO2FBQUEsZ0JBQUc7QUFDTCxZQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDaEIsWUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztPQUNuQzs7QUFHRCxXQUFPOzs7O2FBQUEsaUJBQUMsQ0FBQyxFQUFFO0FBQ1QsWUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFOUQsWUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDO0FBQzlELFlBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QixZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZjs7OztTQWxDRyxXQUFXO0dBQVMsT0FBTzs7QUFxQ2pDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDIiwiZmlsZSI6ImVzNi9zb3VyY2VzL2F1ZGlvLWluLW5vZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxubGV0IEF1ZGlvSW4gPSByZXF1aXJlKCcuL2F1ZGlvLWluJyk7XG5cbi8vIHdlYiBhdWRpbyBBUEkgbm9kZSBhcyBhIHNvdXJjZVxuY2xhc3MgQXVkaW9Jbk5vZGUgZXh0ZW5kcyBBdWRpb0luIHtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zKTtcbiAgICB0aGlzLnR5cGUgPSAnYXVkaW8taW4tbm9kZSc7XG5cbiAgICB2YXIgYmxvY2tTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yID0gdGhpcy5jdHguY3JlYXRlU2NyaXB0UHJvY2Vzc29yKGJsb2NrU2l6ZSwgMSwgMSk7XG5cbiAgICAvLyBrZWVwIHRoZSBzY3JpcHQgcHJvY2Vzc29yIGFsaXZlXG4gICAgLy8gdGhpcy5jdHhbJ19wcm9jZXNzLScgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKV0gPSB0aGlzLnNjcmlwdFByb2Nlc3NvcjtcbiAgICB0aGlzLnNjcmlwdFByb2Nlc3Nvci5vbmF1ZGlvcHJvY2VzcyA9IHRoaXMucHJvY2Vzcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3JjLmNvbm5lY3QodGhpcy5zY3JpcHRQcm9jZXNzb3IpO1xuICB9XG5cbiAgLy8gY29ubmVjdCB0aGUgYXVkaW8gbm9kZXMgdG8gc3RhcnQgc3RyZWFtaW5nXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICAvLyBzdGFydCBcInRoZSBwYXRjaFwiIDspXG4gICAgdGhpcy5zY3JpcHRQcm9jZXNzb3IuY29ubmVjdCh0aGlzLmN0eC5kZXN0aW5hdGlvbik7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuZmluYWxpemUoKTtcbiAgICB0aGlzLnNjcmlwdFByb2Nlc3Nvci5kaXNjb25uZWN0KCk7XG4gIH1cblxuICAvLyBpcyBiYXNpY2FsbHkgdGhlIGBzY3JpcHRQcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3NgIGNhbGxiYWNrXG4gIHByb2Nlc3MoZSkge1xuICAgIHZhciBibG9jayA9IGUuaW5wdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEodGhpcy5wYXJhbXMuY2hhbm5lbCk7XG5cbiAgICB0aGlzLnRpbWUgKz0gYmxvY2subGVuZ3RoIC8gdGhpcy5zdHJlYW1QYXJhbXMuYmxvY2tTYW1wbGVSYXRlO1xuICAgIHRoaXMub3V0RnJhbWUuc2V0KGJsb2NrLCAwKTtcbiAgICB0aGlzLm91dHB1dCgpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXVkaW9Jbk5vZGU7XG4iXX0=