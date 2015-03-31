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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zb3VyY2VzL2F1ZGlvLWluLW5vZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBRUEsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDOzs7O0lBRzlCLFdBQVc7QUFFSixXQUZQLFdBQVcsR0FFVztRQUFkLE9BQU8sZ0NBQUcsRUFBRTs7MEJBRnBCLFdBQVc7O0FBR2IscUNBSEUsV0FBVyw2Q0FHUCxPQUFPLEVBQUU7O0dBRWhCOztZQUxHLFdBQVc7O2VBQVgsV0FBVztBQU9mLG1CQUFlO2FBQUEsMkJBQUc7QUFDaEIsWUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDcEQsWUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDMUUsWUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7T0FDekQ7O0FBRUQsY0FBVTthQUFBLHNCQUFHO0FBQ1gseUNBZEUsV0FBVyw0Q0FjTTs7QUFFbkIsWUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUM7QUFDNUMsWUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRXZFLFlBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUU5RCxZQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7T0FDeEM7O0FBR0QsU0FBSzs7OzthQUFBLGlCQUFHO0FBQ04sWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLFlBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFYixZQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO09BQ3BEOztBQUVELFFBQUk7YUFBQSxnQkFBRztBQUNMLFlBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNoQixZQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxDQUFDO09BQ25DOztBQUdELFdBQU87Ozs7YUFBQSxpQkFBQyxDQUFDLEVBQUU7QUFDVCxZQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU5RCxZQUFJLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUM7QUFDOUQsWUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVCLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNmOzs7O1NBNUNHLFdBQVc7R0FBUyxPQUFPOztBQStDakMsTUFBTSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMiLCJmaWxlIjoiZXM2L3NvdXJjZXMvYXVkaW8taW4tbm9kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5sZXQgQXVkaW9JbiA9IHJlcXVpcmUoJy4vYXVkaW8taW4nKTtcblxuLy8gd2ViIGF1ZGlvIEFQSSBub2RlIGFzIGEgc291cmNlXG5jbGFzcyBBdWRpb0luTm9kZSBleHRlbmRzIEF1ZGlvSW4ge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIC8vIHRoaXMudHlwZSA9ICdhdWRpby1pbi1ub2RlJztcbiAgfVxuXG4gIGNvbmZpZ3VyZVN0cmVhbSgpIHtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5mcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gdGhpcy5jdHguc2FtcGxlUmF0ZSAvIHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5ibG9ja1NhbXBsZVJhdGUgPSB0aGlzLmN0eC5zYW1wbGVSYXRlO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG5cbiAgICB2YXIgYmxvY2tTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yID0gdGhpcy5jdHguY3JlYXRlU2NyaXB0UHJvY2Vzc29yKGJsb2NrU2l6ZSwgMSwgMSk7XG4gICAgLy8gYXVkaW8gcHJvY2VzcyBjYWxsYmFja1xuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gdGhpcy5wcm9jZXNzLmJpbmQodGhpcyk7XG4gICAgLy8gcHJlcGFyZSBjb25uZWN0aW9uXG4gICAgdGhpcy5zcmMuY29ubmVjdCh0aGlzLnNjcmlwdFByb2Nlc3Nvcik7XG4gIH1cblxuICAvLyBjb25uZWN0IHRoZSBhdWRpbyBub2RlcyB0byBzdGFydCBzdHJlYW1pbmdcbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5yZXNldCgpO1xuICAgIC8vIHN0YXJ0IFwidGhlIHBhdGNoXCIgOylcbiAgICB0aGlzLnNjcmlwdFByb2Nlc3Nvci5jb25uZWN0KHRoaXMuY3R4LmRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLmRpc2Nvbm5lY3QoKTtcbiAgfVxuXG4gIC8vIGlzIGJhc2ljYWxseSB0aGUgYHNjcmlwdFByb2Nlc3Nvci5vbmF1ZGlvcHJvY2Vzc2AgY2FsbGJhY2tcbiAgcHJvY2VzcyhlKSB7XG4gICAgdmFyIGJsb2NrID0gZS5pbnB1dEJ1ZmZlci5nZXRDaGFubmVsRGF0YSh0aGlzLnBhcmFtcy5jaGFubmVsKTtcblxuICAgIHRoaXMudGltZSArPSBibG9jay5sZW5ndGggLyB0aGlzLnN0cmVhbVBhcmFtcy5ibG9ja1NhbXBsZVJhdGU7XG4gICAgdGhpcy5vdXRGcmFtZS5zZXQoYmxvY2ssIDApO1xuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBdWRpb0luTm9kZTtcbiJdfQ==