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

    _get(Object.getPrototypeOf(Segmenter.prototype), 'constructor', this).call(this, options, {
      logInput: false,
      filterOrder: 5,
      threshold: 0.08,
      offThreshold: -Infinity,
      minInter: 0.050,
      maxDuration: Infinity
    });

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
      var value = frame[0];

      if (this.params.logInput) value = Math.log(value);

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
        this.min = Math.min(this.min, value);
        this.max = Math.max(this.max, value);
        this.sum += value;
        this.sumOfSquares += value * value;
        this.count++;

        if (time - this.onsetTime >= this.params.maxDuration || value < this.params.offThreshold) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvc2VnbWVudGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7d0JBQWdCLFdBQVc7Ozs7SUFFTixTQUFTO1lBQVQsU0FBUzs7QUFDakIsV0FEUSxTQUFTLENBQ2hCLE9BQU8sRUFBRTswQkFERixTQUFTOztBQUUxQiwrQkFGaUIsU0FBUyw2Q0FFcEIsT0FBTyxFQUFFO0FBQ2IsY0FBUSxFQUFFLEtBQUs7QUFDZixpQkFBVyxFQUFFLENBQUM7QUFDZCxlQUFTLEVBQUUsSUFBSTtBQUNmLGtCQUFZLEVBQUUsQ0FBQyxRQUFRO0FBQ3ZCLGNBQVEsRUFBRSxLQUFLO0FBQ2YsaUJBQVcsRUFBRSxRQUFRO0tBQ3RCLEVBQUU7O0FBRUgsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLHNCQUFJLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0FBQ3pGLFFBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztHQUNwQjs7ZUFia0IsU0FBUzs7V0F1QmpCLHVCQUFHO0FBQ1osVUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDM0IsVUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLFFBQVEsQ0FBQzs7O0FBRzNCLFVBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDckIsVUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDYixVQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztBQUN0QixVQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztLQUNoQjs7O1dBRVksdUJBQUMsSUFBSSxFQUFFO0FBQ2xCLFVBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUM1QixVQUFJLENBQUMsUUFBUSxDQUFD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Qzs7QUFFYixZQUFHLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTtBQUN2RixjQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLGNBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1NBQzVCO09BQ0Y7S0FDRjs7O1NBMUZZLGFBQUMsS0FBSyxFQUFFO0FBQ25CLFVBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztLQUMvQjs7O1NBRWUsYUFBQyxLQUFLLEVBQUU7QUFDdEIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0tBQ2xDOzs7U0FyQmtCLFNBQVM7R0FBUyxzQkFBSSxJQUFJLENBQUMsT0FBTzs7cUJBQWxDLFNBQVMiLCJmaWxlIjoiZXM2L29wZXJhdG9ycy9zZWdtZW50ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbGZvIGZyb20gJ3dhdmVzLWxmbyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlZ21lbnRlciBleHRlbmRzIGxmby5jb3JlLkJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucywge1xuICAgICAgbG9nSW5wdXQ6IGZhbHNlLFxuICAgICAgZmlsdGVyT3JkZXI6IDUsXG4gICAgICB0aHJlc2hvbGQ6IDAuMDgsXG4gICAgICBvZmZUaHJlc2hvbGQ6IC1JbmZpbml0eSxcbiAgICAgIG1pbkludGVyOiAwLjA1MCxcbiAgICAgIG1heER1cmF0aW9uOiBJbmZpbml0eSxcbiAgICB9KTtcblxuICAgIHRoaXMubW92aW5nQXZlcmFnZSA9IG5ldyBsZm8ub3BlcmF0b3JzLk1vdmluZ0F2ZXJhZ2UoeyBvcmRlcjogdGhpcy5wYXJhbXMuZmlsdGVyT3JkZXIgfSk7XG4gICAgdGhpcy5pbml0U2VnbWVudCgpO1xuICB9XG5cbiAgc2V0IHRocmVzaG9sZCh2YWx1ZSkge1xuICAgIHRoaXMucGFyYW1zLnRocmVzaG9sZCA9IHZhbHVlO1xuICB9XG5cbiAgc2V0IG9mZlRocmVzaG9sZCh2YWx1ZSkge1xuICAgIHRoaXMucGFyYW1zLm9mZlRocmVzaG9sZCA9IHZhbHVlO1xuICB9XG5cbiAgaW5pdFNlZ21lbnQoKSB7XG4gICAgdGhpcy5pbnNpZGVTZWdtZW50ID0gZmFsc2U7XG4gICAgdGhpcy5vbnNldFRpbWUgPSAtSW5maW5pdHk7XG5cbiAgICAvLyBzdGF0c1xuICAgIHRoaXMubWluID0gSW5maW5pdHk7XG4gICAgdGhpcy5tYXggPSAtSW5maW5pdHk7XG4gICAgdGhpcy5zdW0gPSAwO1xuICAgIHRoaXMuc3VtT2ZTcXVhcmVzID0gMDtcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgfVxuXG4gIG91dHB1dFNlZ21lbnQodGltZSkge1xuICAgIHRoaXMub3V0RnJhbWVbMF0gPSB0aGlzLm1heDtcbiAgICB0aGlzLm91dEZyYW1lWzFdID0gdGhpcy5taW47XG5cbiAgICBjb25zdCBub3JtID0gMSAvIHRoaXMuY291bnQ7XG4gICAgY29uc3QgbWVhbiA9IHRoaXMuc3VtICogbm9ybTtcbiAgICBjb25zdCBtZWFuT2ZTcXVhcmUgPSB0aGlzLnN1bU9mU3F1YXJlcyAqIG5vcm07XG4gICAgY29uc3Qgc3F1YXJlT2ZtZWFuID0gbWVhbiAqIG1lYW47XG5cbiAgICB0aGlzLm91dEZyYW1lWzJdID0gbWVhbjtcbiAgICB0aGlzLm91dEZyYW1lWzNdID0gMDtcblxuICAgIGlmKG1lYW5PZlNxdWFyZSA+IHNxdWFyZU9mbWVhbilcbiAgICAgIHRoaXMub3V0RnJhbWVbM10gPSBzcXJ0KG1lYW5PZlNxdWFyZSAtIHNxdWFyZU9mbWVhbik7XG5cbiAgICB0aGlzLm1ldGFEYXRhLmR1cmF0aW9uID0gdGltZSAtIHRoaXMub25zZXRUaW1lO1xuXG4gICAgdGhpcy5vdXRwdXQodGhpcy5vbnNldFRpbWUpO1xuICB9XG5cbiAgY29uZmlndXJlU3RyZWFtKCkge1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IDQ7IC8vIG1pbiwgbWF4LCBtZWFuLCBzdGRkZXZcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHN1cGVyLnJlc2V0KCk7XG4gICAgdGhpcy5tb3ZpbmdBdmVyYWdlLnJlc2V0KCk7XG4gICAgdGhpcy5yZXNldFNlZ21lbnQoKTtcbiAgfVxuXG4gIGZpbmFsaXplKHRpbWUpIHtcbiAgICBzdXBlci5maW5hbGl6ZSh0aW1lKTtcblxuICAgIGlmKHRoaXMuaW5zaWRlU2VnbWVudClcbiAgICAgIHRoaXMub3V0cHV0U2VnbWVudCh0aW1lKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgbGV0IHZhbHVlID0gZnJhbWVbMF07XG5cbiAgICBpZih0aGlzLnBhcmFtcy5sb2dJbnB1dClcbiAgICAgIHZhbHVlID0gTWF0aC5sb2codmFsdWUpO1xuXG4gICAgY29uc3QgbXZhdnJnID0gdGhpcy5tb3ZpbmdBdmVyYWdlLmlucHV0U2NhbGFyKHZhbHVlKTtcbiAgICBjb25zdCBkaWZmID0gdmFsdWUgLSBtdmF2cmc7XG5cbiAgICB0aGlzLm1ldGFEYXRhID0gbWV0YURhdGE7XG5cbiAgICBpZiAoZGlmZiA+IHRoaXMucGFyYW1zLnRocmVzaG9sZCAmJiB0aW1lIC0gdGhpcy5vbnNldFRpbWUgPiB0aGlzLnBhcmFtcy5taW5JbnRlcikge1xuICAgICAgaWYodGhpcy5pbnNpZGVTZWdtZW50KVxuICAgICAgICB0aGlzLm91dHB1dFNlZ21lbnQodGltZSk7XG5cbiAgICAgIC8vIHN0YXJ0IHNlZ21lbnRcbiAgICAgIHRoaXMuaW5zaWRlU2VnbWVudCA9IHRydWU7XG4gICAgICB0aGlzLm9uc2V0VGltZSA9IHRpbWU7XG4gICAgICB0aGlzLm1heCA9IC1JbmZpbml0eTtcbiAgICB9XG5cbiAgICBpZih0aGlzLmluc2lkZVNlZ21lbnQpIHtcbiAgICAgIHRoaXMubWluID0gTWF0aC5taW4odGhpcy5taW4sIHZhbHVlKTtcbiAgICAgIHRoaXMubWF4ID0gTWF0aC5tYXgodGhpcy5tYXgsIHZhbHVlKTtcbiAgICAgIHRoaXMuc3VtICs9IHZhbHVlO1xuICAgICAgdGhpcy5zdW1PZlNxdWFyZXMgKz0gdmFsdWUgKiB2YWx1ZTtcbiAgICAgIHRoaXMuY291bnQrKztcblxuICAgICAgaWYodGltZSAtIHRoaXMub25zZXRUaW1lID49IHRoaXMucGFyYW1zLm1heER1cmF0aW9uIHx8IHZhbHVlIDwgdGhpcy5wYXJhbXMub2ZmVGhyZXNob2xkKSB7XG4gICAgICAgIHRoaXMub3V0cHV0U2VnbWVudCh0aW1lKTtcbiAgICAgICAgdGhpcy5pbnNpZGVTZWdtZW50ID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=