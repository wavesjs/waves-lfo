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
    // this.type = 'audio-in-node';
    this.metaData = {};
  }

  _inherits(AudioInNode, _AudioIn);

  _createClass(AudioInNode, {
    configureStream: {
      value: function configureStream() {
        this.streamParams.frameSize = this.params.frameSize;
        this.streamParams.frameRate = this.ctx.sampleRate / this.params.frameSize;
        this.streamParams.blockSampleRate = this.ctx.sampleRate;
      }
    },
    initialize: {
      value: function initialize() {
        _get(_core.Object.getPrototypeOf(AudioInNode.prototype), "initialize", this).call(this);

        var blockSize = this.streamParams.frameSize;
        this.scriptProcessor = this.ctx.createScriptProcessor(blockSize, 1, 1);
        // audio process callback
        this.scriptProcessor.onaudioprocess = this.process.bind(this);
        // prepare connection
        this.src.connect(this.scriptProcessor);
      }
    },
    start: {

      // connect the audio nodes to start streaming

      value: function start() {
        this.initialize();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLW5vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBRUEsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDOzs7O0lBRzlCLFdBQVc7QUFFSixXQUZQLFdBQVcsR0FFVztRQUFkLE9BQU8sZ0NBQUcsRUFBRTs7MEJBRnBCLFdBQVc7O0FBR2IscUNBSEUsV0FBVyw2Q0FHUCxPQUFPLEVBQUU7O0FBRWYsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7R0FDcEI7O1lBTkcsV0FBVzs7ZUFBWCxXQUFXO0FBUWYsbUJBQWU7YUFBQSwyQkFBRztBQUNoQixZQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNwRCxZQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUMxRSxZQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztPQUN6RDs7QUFFRCxjQUFVO2FBQUEsc0JBQUc7QUFDWCx5Q0FmRSxXQUFXLDRDQWVNOztBQUVuQixZQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztBQUM1QyxZQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFdkUsWUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTlELFlBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztPQUN4Qzs7QUFHRCxTQUFLOzs7O2FBQUEsaUJBQUc7QUFDTixZQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsWUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUViLFlBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7T0FDcEQ7O0FBRUQsUUFBSTthQUFBLGdCQUFHO0FBQ0wsWUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2hCLFlBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLENBQUM7T0FDbkM7O0FBR0QsV0FBTzs7OzthQUFBLGlCQUFDLENBQUMsRUFBRTtBQUNULFlBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTlELFlBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQztBQUM5RCxZQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUIsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2Y7Ozs7U0E3Q0csV0FBVztHQUFTLE9BQU87O0FBZ0RqQyxNQUFNLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyIsImZpbGUiOiJlczYvc291cmNlcy9hdWRpby1pbi1ub2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmxldCBBdWRpb0luID0gcmVxdWlyZSgnLi9hdWRpby1pbicpO1xuXG4vLyB3ZWIgYXVkaW8gQVBJIG5vZGUgYXMgYSBzb3VyY2VcbmNsYXNzIEF1ZGlvSW5Ob2RlIGV4dGVuZHMgQXVkaW9JbiB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gICAgLy8gdGhpcy50eXBlID0gJ2F1ZGlvLWluLW5vZGUnO1xuICAgIHRoaXMubWV0YURhdGEgPSB7fTtcbiAgfVxuXG4gIGNvbmZpZ3VyZVN0cmVhbSgpIHtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5mcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gdGhpcy5jdHguc2FtcGxlUmF0ZSAvIHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5ibG9ja1NhbXBsZVJhdGUgPSB0aGlzLmN0eC5zYW1wbGVSYXRlO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG5cbiAgICB2YXIgYmxvY2tTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yID0gdGhpcy5jdHguY3JlYXRlU2NyaXB0UHJvY2Vzc29yKGJsb2NrU2l6ZSwgMSwgMSk7XG4gICAgLy8gYXVkaW8gcHJvY2VzcyBjYWxsYmFja1xuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gdGhpcy5wcm9jZXNzLmJpbmQodGhpcyk7XG4gICAgLy8gcHJlcGFyZSBjb25uZWN0aW9uXG4gICAgdGhpcy5zcmMuY29ubmVjdCh0aGlzLnNjcmlwdFByb2Nlc3Nvcik7XG4gIH1cblxuICAvLyBjb25uZWN0IHRoZSBhdWRpbyBub2RlcyB0byBzdGFydCBzdHJlYW1pbmdcbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5yZXNldCgpO1xuICAgIC8vIHN0YXJ0IFwidGhlIHBhdGNoXCIgOylcbiAgICB0aGlzLnNjcmlwdFByb2Nlc3Nvci5jb25uZWN0KHRoaXMuY3R4LmRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLmRpc2Nvbm5lY3QoKTtcbiAgfVxuXG4gIC8vIGlzIGJhc2ljYWxseSB0aGUgYHNjcmlwdFByb2Nlc3Nvci5vbmF1ZGlvcHJvY2Vzc2AgY2FsbGJhY2tcbiAgcHJvY2VzcyhlKSB7XG4gICAgdmFyIGJsb2NrID0gZS5pbnB1dEJ1ZmZlci5nZXRDaGFubmVsRGF0YSh0aGlzLnBhcmFtcy5jaGFubmVsKTtcblxuICAgIHRoaXMudGltZSArPSBibG9jay5sZW5ndGggLyB0aGlzLnN0cmVhbVBhcmFtcy5ibG9ja1NhbXBsZVJhdGU7XG4gICAgdGhpcy5vdXRGcmFtZS5zZXQoYmxvY2ssIDApO1xuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBdWRpb0luTm9kZTtcbiJdfQ==