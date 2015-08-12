'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var Lfo = require('../core/lfo-base');

// apply a given function on each frame

var Operator = (function (_Lfo) {
  _inherits(Operator, _Lfo);

  function Operator(options) {
    _classCallCheck(this, Operator);

    _get(Object.getPrototypeOf(Operator.prototype), 'constructor', this).call(this, options, {});

    this.params.type = this.params.type || 'scalar';

    if (this.params.onProcess) {
      this.onProcess(this.params.onProcess);
    }
  }

  _createClass(Operator, [{
    key: 'configureStream',
    value: function configureStream() {
      if (this.params.type === 'vector' && this.params.frameSize) {
        this.streamParams.frameSize = this.params.frameSize;
      }
    }

    // register the callback to be consumed in process

    // @SIGNATURE scalar callback
    // function(value, index, frame) {
    //   return doSomething(value)
    // }

    // @SIGNATURE vector callback
    // function(time, inFrame, outFrame) {
    //   outFrame.set(inFrame, 0);
    //   return time + 1;
    // }
  }, {
    key: 'onProcess',
    value: function onProcess(func) {
      // bind current context
      this.callback = func.bind(this);
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      // apply the callback to the frame
      if (this.params.type === 'vector') {
        var outTime = this.callback(time, frame, this.outFrame);

        if (outTime !== undefined) {
          time = outTime;
        }
      } else {
        for (var i = 0, l = frame.length; i < l; i++) {
          this.outFrame[i] = this.callback(frame[i], i);
        }
      }

      this.time = time;
      this.metaData = metaData;

      this.output();
    }
  }]);

  return Operator;
})(Lfo);

;

module.exports = Operator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvb3BlcmF0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7O0FBRWIsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7Ozs7SUFHaEMsUUFBUTtZQUFSLFFBQVE7O0FBRUQsV0FGUCxRQUFRLENBRUEsT0FBTyxFQUFFOzBCQUZqQixRQUFROztBQUdWLCtCQUhFLFFBQVEsNkNBR0osT0FBTyxFQUFFLEVBQUUsRUFBRTs7QUFFbkIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDOztBQUVoRCxRQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO0FBQ3pCLFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUN2QztHQUNGOztlQVZHLFFBQVE7O1dBWUcsMkJBQUc7QUFDaEIsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7QUFDMUQsWUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7T0FDckQ7S0FDRjs7Ozs7Ozs7Ozs7Ozs7OztXQWNRLG1CQUFDLElBQUksRUFBRTs7QUFFZCxVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDakM7OztXQUVNLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFOztBQUU3QixVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtBQUNqQyxZQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUV4RCxZQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7QUFDekIsY0FBSSxHQUFHLE9BQU8sQ0FBQztTQUNoQjtPQUNGLE1BQU07QUFDTCxhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzVDLGNBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDL0M7T0FDRjs7QUFFRCxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFekIsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2Y7OztTQXJERyxRQUFRO0dBQVMsR0FBRzs7QUFzRHpCLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMiLCJmaWxlIjoiZXM2L29wZXJhdG9ycy9vcGVyYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIExmbyA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcblxuLy8gYXBwbHkgYSBnaXZlbiBmdW5jdGlvbiBvbiBlYWNoIGZyYW1lXG5jbGFzcyBPcGVyYXRvciBleHRlbmRzIExmbyB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMsIHt9KTtcblxuICAgIHRoaXMucGFyYW1zLnR5cGUgPSB0aGlzLnBhcmFtcy50eXBlIHx8wqAnc2NhbGFyJztcblxuICAgIGlmICh0aGlzLnBhcmFtcy5vblByb2Nlc3MpIHtcbiAgICAgIHRoaXMub25Qcm9jZXNzKHRoaXMucGFyYW1zLm9uUHJvY2Vzcyk7XG4gICAgfVxuICB9XG5cbiAgY29uZmlndXJlU3RyZWFtKCkge1xuICAgIGlmICh0aGlzLnBhcmFtcy50eXBlID09PSAndmVjdG9yJyAmJiB0aGlzLnBhcmFtcy5mcmFtZVNpemUpIHtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB9XG4gIH1cblxuICAvLyByZWdpc3RlciB0aGUgY2FsbGJhY2sgdG8gYmUgY29uc3VtZWQgaW4gcHJvY2Vzc1xuXG4gIC8vIEBTSUdOQVRVUkUgc2NhbGFyIGNhbGxiYWNrXG4gIC8vIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgZnJhbWUpIHtcbiAgLy8gICByZXR1cm4gZG9Tb21ldGhpbmcodmFsdWUpXG4gIC8vIH1cblxuICAvLyBAU0lHTkFUVVJFIHZlY3RvciBjYWxsYmFja1xuICAvLyBmdW5jdGlvbih0aW1lLCBpbkZyYW1lLCBvdXRGcmFtZSkge1xuICAvLyAgIG91dEZyYW1lLnNldChpbkZyYW1lLCAwKTtcbiAgLy8gICByZXR1cm4gdGltZSArIDE7XG4gIC8vIH1cbiAgb25Qcm9jZXNzKGZ1bmMpIHtcbiAgICAvLyBiaW5kIGN1cnJlbnQgY29udGV4dFxuICAgIHRoaXMuY2FsbGJhY2sgPSBmdW5jLmJpbmQodGhpcyk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIC8vIGFwcGx5IHRoZSBjYWxsYmFjayB0byB0aGUgZnJhbWVcbiAgICBpZiAodGhpcy5wYXJhbXMudHlwZSA9PT0gJ3ZlY3RvcicpIHtcbiAgICAgIHZhciBvdXRUaW1lID0gdGhpcy5jYWxsYmFjayh0aW1lLCBmcmFtZSwgdGhpcy5vdXRGcmFtZSk7XG5cbiAgICAgIGlmIChvdXRUaW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGltZSA9IG91dFRpbWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gZnJhbWUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHRoaXMub3V0RnJhbWVbaV0gPSB0aGlzLmNhbGxiYWNrKGZyYW1lW2ldLCBpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT3BlcmF0b3I7Il19