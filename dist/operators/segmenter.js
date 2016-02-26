'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _wavesLfo = require('waves-lfo');

var _wavesLfo2 = _interopRequireDefault(_wavesLfo);

var Segmenter = (function (_lfo$core$BaseLfo) {
  _inherits(Segmenter, _lfo$core$BaseLfo);

  function Segmenter(options) {
    _classCallCheck(this, Segmenter);

    _get(Object.getPrototypeOf(Segmenter.prototype), 'constructor', this).call(this, {
      logInput: false,
      filterOrder: 5,
      threshold: 0.08,
      offThreshold: -Infinity,
      minInter: 0.050,
      maxDuration: Infinity
    }, options);

    this.movingAverage = new _wavesLfo2['default'].operators.MovingAverage({ order: this.params.filterOrder });
    this.initSegment();
  }

  _createClass(Segmenter, [{
    key: 'initSegment',
    value: function initSegment() {
      this.insideSegment = false;
      this.onsetTime = -Infinity;

      // stats
      this.min = Infinity;
      this.max = -Infinity;
      this.sum = 0;
      this.sumOfSquares = 0;
      this.count = 0;
    }
  }, {
    key: 'outputSegment',
    value: function outputSegment(time) {
      this.outFrame[0] = this.max;
      this.outFrame[1] = this.min;

      var norm = 1 / this.count;
      var mean = this.sum * norm;
      var meanOfSquare = this.sumOfSquares * norm;
      var squareOfmean = mean * mean;

      this.outFrame[2] = mean;
      this.outFrame[3] = 0;

      if (meanOfSquare > squareOfmean) this.outFrame[3] = sqrt(meanOfSquare - squareOfmean);

      this.metaData.duration = time - this.onsetTime;

      this.output(this.onsetTime);
    }
  }, {
    key: 'configureStream',
    value: function configureStream() {
      this.streamParams.frameSize = 4; // min, max, mean, stddev
    }
  }, {
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(Segmenter.prototype), 'reset', this).call(this);
      this.movingAverage.reset();
      this.resetSegment();
    }
  }, {
    key: 'finalize',
    value: function finalize(time) {
      _get(Object.getPrototypeOf(Segmenter.prototype), 'finalize', this).call(this, time);

      if (this.insideSegment) this.outputSegment(time);
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var rawValue = frame[0];
      var value = this.params.logInput ? Math.log(value) : rawValue;
      var mvavrg = this.movingAverage.inputScalar(value);
      var diff = value - mvavrg;

      this.metaData = metaData;

      if (diff > this.params.threshold && time - this.onsetTime > this.params.minInter) {
        if (this.insideSegment) this.outputSegment(time);

        // start segment
        this.insideSegment = true;
        this.onsetTime = time;
        this.max = -Infinity;
      }

      if (this.insideSegment) {
        this.min = Math.min(this.min, rawValue);
        this.max = Math.max(this.max, rawValue);
        this.sum += rawValue;
        this.sumOfSquares += rawValue * rawValue;
        this.count++;

        if (time - this.onsetTime >= this.params.maxDuration || value <= this.params.offThreshold) {
          this.outputSegment(time);
          this.insideSegment = false;
        }
      }
    }
  }, {
    key: 'threshold',
    set: function set(value) {
      this.params.threshold = value;
    }
  }, {
    key: 'offThreshold',
    set: function set(value) {
      this.params.offThreshold = value;
    }
  }]);

  return Segmenter;
})(_wavesLfo2['default'].core.BaseLfo);

exports['default'] = Segmenter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvc2VnbWVudGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7d0JBQWdCLFdBQVc7Ozs7SUFFTixTQUFTO1lBQVQsU0FBUzs7QUFDakIsV0FEUSxTQUFTLENBQ2hCLE9BQU8sRUFBRTswQkFERixTQUFTOztBQUUxQiwrQkFGaUIsU0FBUyw2Q0FFcEI7QUFDSixjQUFRLEVBQUUsS0FBSztBQUNmLGlCQUFXLEVBQUUsQ0FBQztBQUNkLGVBQVMsRUFBRSxJQUFJO0FBQ2Ysa0JBQVksRUFBRSxDQUFDLFFBQVE7QUFDdkIsY0FBUSxFQUFFLEtBQUs7QUFDZixpQkFBVyxFQUFFLFFBQVE7S0FDdEIsRUFBRSxPQUFPLEVBQUU7O0FBRVosUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLHNCQUFJLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0FBQ3pGLFFBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztHQUNwQjs7ZUFia0IsU0FBUzs7V0F1QmpCLHVCQUFHO0FBQ1osVUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDM0IsVUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLFFBQVEsQ0FBQzs7O0FBRzNCLFVBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDckIsVUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDYixVQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztBQUN0QixVQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztLQUNoQjs7O1dBRVksdUJBQUMsSUFBSSxFQUFFO0FBQ2xCLFVBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUM1QixVQUFJLENBQUMsUUFBUSxDQUFD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QUFFLENBQUM7O0FBRWIsWUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7QUFDekYsY0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixjQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztTQUM1QjtPQUNGO0tBQ0Y7OztTQXZGWSxhQUFDLEtBQUssRUFBRTtBQUNuQixVQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7S0FDL0I7OztTQUVlLGFBQUMsS0FBSyxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztLQUNsQzs7O1NBckJrQixTQUFTO0dBQVMsc0JBQUksSUFBSSxDQUFDLE9BQU87O3FCQUFsQyxTQUFTIiwiZmlsZSI6ImVzNi9vcGVyYXRvcnMvc2VnbWVudGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGxmbyBmcm9tICd3YXZlcy1sZm8nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWdtZW50ZXIgZXh0ZW5kcyBsZm8uY29yZS5CYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIGxvZ0lucHV0OiBmYWxzZSxcbiAgICAgIGZpbHRlck9yZGVyOiA1LFxuICAgICAgdGhyZXNob2xkOiAwLjA4LFxuICAgICAgb2ZmVGhyZXNob2xkOiAtSW5maW5pdHksXG4gICAgICBtaW5JbnRlcjogMC4wNTAsXG4gICAgICBtYXhEdXJhdGlvbjogSW5maW5pdHksXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLm1vdmluZ0F2ZXJhZ2UgPSBuZXcgbGZvLm9wZXJhdG9ycy5Nb3ZpbmdBdmVyYWdlKHsgb3JkZXI6IHRoaXMucGFyYW1zLmZpbHRlck9yZGVyIH0pO1xuICAgIHRoaXMuaW5pdFNlZ21lbnQoKTtcbiAgfVxuXG4gIHNldCB0aHJlc2hvbGQodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy50aHJlc2hvbGQgPSB2YWx1ZTtcbiAgfVxuXG4gIHNldCBvZmZUaHJlc2hvbGQodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy5vZmZUaHJlc2hvbGQgPSB2YWx1ZTtcbiAgfVxuXG4gIGluaXRTZWdtZW50KCkge1xuICAgIHRoaXMuaW5zaWRlU2VnbWVudCA9IGZhbHNlO1xuICAgIHRoaXMub25zZXRUaW1lID0gLUluZmluaXR5O1xuXG4gICAgLy8gc3RhdHNcbiAgICB0aGlzLm1pbiA9IEluZmluaXR5O1xuICAgIHRoaXMubWF4ID0gLUluZmluaXR5O1xuICAgIHRoaXMuc3VtID0gMDtcbiAgICB0aGlzLnN1bU9mU3F1YXJlcyA9IDA7XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gIH1cblxuICBvdXRwdXRTZWdtZW50KHRpbWUpIHtcbiAgICB0aGlzLm91dEZyYW1lWzBdID0gdGhpcy5tYXg7XG4gICAgdGhpcy5vdXRGcmFtZVsxXSA9IHRoaXMubWluO1xuXG4gICAgY29uc3Qgbm9ybSA9IDEgLyB0aGlzLmNvdW50O1xuICAgIGNvbnN0IG1lYW4gPSB0aGlzLnN1bSAqIG5vcm07XG4gICAgY29uc3QgbWVhbk9mU3F1YXJlID0gdGhpcy5zdW1PZlNxdWFyZXMgKiBub3JtO1xuICAgIGNvbnN0IHNxdWFyZU9mbWVhbiA9IG1lYW4gKiBtZWFuO1xuXG4gICAgdGhpcy5vdXRGcmFtZVsyXSA9IG1lYW47XG4gICAgdGhpcy5vdXRGcmFtZVszXSA9IDA7XG5cbiAgICBpZihtZWFuT2ZTcXVhcmUgPiBzcXVhcmVPZm1lYW4pXG4gICAgICB0aGlzLm91dEZyYW1lWzNdID0gc3FydChtZWFuT2ZTcXVhcmUgLSBzcXVhcmVPZm1lYW4pO1xuXG4gICAgdGhpcy5tZXRhRGF0YS5kdXJhdGlvbiA9IHRpbWUgLSB0aGlzLm9uc2V0VGltZTtcblxuICAgIHRoaXMub3V0cHV0KHRoaXMub25zZXRUaW1lKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZVN0cmVhbSgpIHtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSA0OyAvLyBtaW4sIG1heCwgbWVhbiwgc3RkZGV2XG4gIH1cblxuICByZXNldCgpIHtcbiAgICBzdXBlci5yZXNldCgpO1xuICAgIHRoaXMubW92aW5nQXZlcmFnZS5yZXNldCgpO1xuICAgIHRoaXMucmVzZXRTZWdtZW50KCk7XG4gIH1cblxuICBmaW5hbGl6ZSh0aW1lKSB7XG4gICAgc3VwZXIuZmluYWxpemUodGltZSk7XG5cbiAgICBpZih0aGlzLmluc2lkZVNlZ21lbnQpXG4gICAgICB0aGlzLm91dHB1dFNlZ21lbnQodGltZSk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGNvbnN0IHJhd1ZhbHVlID0gZnJhbWVbMF07XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnBhcmFtcy5sb2dJbnB1dCA/IE1hdGgubG9nKHZhbHVlKSA6IHJhd1ZhbHVlO1xuICAgIGNvbnN0IG12YXZyZyA9IHRoaXMubW92aW5nQXZlcmFnZS5pbnB1dFNjYWxhcih2YWx1ZSk7XG4gICAgY29uc3QgZGlmZiA9IHZhbHVlIC0gbXZhdnJnO1xuXG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgaWYgKGRpZmYgPiB0aGlzLnBhcmFtcy50aHJlc2hvbGQgJiYgdGltZSAtIHRoaXMub25zZXRUaW1lID4gdGhpcy5wYXJhbXMubWluSW50ZXIpIHtcbiAgICAgIGlmKHRoaXMuaW5zaWRlU2VnbWVudClcbiAgICAgICAgdGhpcy5vdXRwdXRTZWdtZW50KHRpbWUpO1xuXG4gICAgICAvLyBzdGFydCBzZWdtZW50XG4gICAgICB0aGlzLmluc2lkZVNlZ21lbnQgPSB0cnVlO1xuICAgICAgdGhpcy5vbnNldFRpbWUgPSB0aW1lO1xuICAgICAgdGhpcy5tYXggPSAtSW5maW5pdHk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaW5zaWRlU2VnbWVudCkge1xuICAgICAgdGhpcy5taW4gPSBNYXRoLm1pbih0aGlzLm1pbiwgcmF3VmFsdWUpO1xuICAgICAgdGhpcy5tYXggPSBNYXRoLm1heCh0aGlzLm1heCwgcmF3VmFsdWUpO1xuICAgICAgdGhpcy5zdW0gKz0gcmF3VmFsdWU7XG4gICAgICB0aGlzLnN1bU9mU3F1YXJlcyArPSByYXdWYWx1ZSAqIHJhd1ZhbHVlO1xuICAgICAgdGhpcy5jb3VudCsrO1xuXG4gICAgICBpZiAodGltZSAtIHRoaXMub25zZXRUaW1lID49IHRoaXMucGFyYW1zLm1heER1cmF0aW9uIHx8IHZhbHVlIDw9IHRoaXMucGFyYW1zLm9mZlRocmVzaG9sZCkge1xuICAgICAgICB0aGlzLm91dHB1dFNlZ21lbnQodGltZSk7XG4gICAgICAgIHRoaXMuaW5zaWRlU2VnbWVudCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19