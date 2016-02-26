'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreBaseLfo = require('../core/base-lfo');

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var _movingAverage = require('./moving-average');

var _movingAverage2 = _interopRequireDefault(_movingAverage);

var Segmenter = (function (_BaseLfo) {
  _inherits(Segmenter, _BaseLfo);

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

    this.movingAverage = new _movingAverage2['default']({ order: this.params.filterOrder });
  }

  _createClass(Segmenter, [{
    key: 'resetSegment',
    value: function resetSegment() {
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
    key: 'initialize',
    value: function initialize(streamParams) {
      _get(Object.getPrototypeOf(Segmenter.prototype), 'initialize', this).call(this, streamParams);
      this.movingAverage.initialize(streamParams);
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
})(_coreBaseLfo2['default']);

exports['default'] = Segmenter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvc2VnbWVudGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7Ozs2QkFDWixrQkFBa0I7Ozs7SUFHdkIsU0FBUztZQUFULFNBQVM7O0FBQ2pCLFdBRFEsU0FBUyxDQUNoQixPQUFPLEVBQUU7MEJBREYsU0FBUzs7QUFFMUIsK0JBRmlCLFNBQVMsNkNBRXBCLE9BQU8sRUFBRTtBQUNiLGNBQVEsRUFBRSxLQUFLO0FBQ2YsaUJBQVcsRUFBRSxDQUFDO0FBQ2QsZUFBUyxFQUFFLElBQUk7QUFDZixrQkFBWSxFQUFFLENBQUMsUUFBUTtBQUN2QixjQUFRLEVBQUUsS0FBSztBQUNmLGlCQUFXLEVBQUUsUUFBUTtLQUN0QixFQUFFOztBQUVILFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQWtCLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztHQUM1RTs7ZUFaa0IsU0FBUzs7V0FzQmhCLHdCQUFHO0FBQ2IsVUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDM0IsVUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLFFBQVEsQ0FBQzs7O0FBRzNCLFVBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDckIsVUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDYixVQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztBQUN0QixVQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztLQUNoQjs7O1dBRVksdUJBQUMsSUFBSSxFQUFFO0FBQ2xCLFVBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUM1QixVQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7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SSxRQUFRLENBQUM7QUFDckIsWUFBSSxDQUFDLFlBQVksSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3pDLFlBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFYixZQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTtBQUN6RixjQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLGNBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1NBQzVCO09BQ0Y7S0FDRjs7O1NBNUZZLGFBQUMsS0FBSyxFQUFFO0FBQ25CLFVBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztLQUMvQjs7O1NBRWUsYUFBQyxLQUFLLEVBQUU7QUFDdEIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0tBQ2xDOzs7U0FwQmtCLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6ImVzNi9vcGVyYXRvcnMvc2VnbWVudGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5pbXBvcnQgTW92aW5nQXZlcmFnZSBmcm9tICcuL21vdmluZy1hdmVyYWdlJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWdtZW50ZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMsIHtcbiAgICAgIGxvZ0lucHV0OiBmYWxzZSxcbiAgICAgIGZpbHRlck9yZGVyOiA1LFxuICAgICAgdGhyZXNob2xkOiAwLjA4LFxuICAgICAgb2ZmVGhyZXNob2xkOiAtSW5maW5pdHksXG4gICAgICBtaW5JbnRlcjogMC4wNTAsXG4gICAgICBtYXhEdXJhdGlvbjogSW5maW5pdHksXG4gICAgfSk7XG5cbiAgICB0aGlzLm1vdmluZ0F2ZXJhZ2UgPSBuZXcgTW92aW5nQXZlcmFnZSh7IG9yZGVyOiB0aGlzLnBhcmFtcy5maWx0ZXJPcmRlciB9KTtcbiAgfVxuXG4gIHNldCB0aHJlc2hvbGQodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy50aHJlc2hvbGQgPSB2YWx1ZTtcbiAgfVxuXG4gIHNldCBvZmZUaHJlc2hvbGQodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy5vZmZUaHJlc2hvbGQgPSB2YWx1ZTtcbiAgfVxuXG4gIHJlc2V0U2VnbWVudCgpIHtcbiAgICB0aGlzLmluc2lkZVNlZ21lbnQgPSBmYWxzZTtcbiAgICB0aGlzLm9uc2V0VGltZSA9IC1JbmZpbml0eTtcblxuICAgIC8vIHN0YXRzXG4gICAgdGhpcy5taW4gPSBJbmZpbml0eTtcbiAgICB0aGlzLm1heCA9IC1JbmZpbml0eTtcbiAgICB0aGlzLnN1bSA9IDA7XG4gICAgdGhpcy5zdW1PZlNxdWFyZXMgPSAwO1xuICAgIHRoaXMuY291bnQgPSAwO1xuICB9XG5cbiAgb3V0cHV0U2VnbWVudCh0aW1lKSB7XG4gICAgdGhpcy5vdXRGcmFtZVswXSA9IHRoaXMubWF4O1xuICAgIHRoaXMub3V0RnJhbWVbMV0gPSB0aGlzLm1pbjtcblxuICAgIGNvbnN0IG5vcm0gPSAxIC8gdGhpcy5jb3VudDtcbiAgICBjb25zdCBtZWFuID0gdGhpcy5zdW0gKiBub3JtO1xuICAgIGNvbnN0IG1lYW5PZlNxdWFyZSA9IHRoaXMuc3VtT2ZTcXVhcmVzICogbm9ybTtcbiAgICBjb25zdCBzcXVhcmVPZm1lYW4gPSBtZWFuICogbWVhbjtcblxuICAgIHRoaXMub3V0RnJhbWVbMl0gPSBtZWFuO1xuICAgIHRoaXMub3V0RnJhbWVbM10gPSAwO1xuXG4gICAgaWYobWVhbk9mU3F1YXJlID4gc3F1YXJlT2ZtZWFuKVxuICAgICAgdGhpcy5vdXRGcmFtZVszXSA9IHNxcnQobWVhbk9mU3F1YXJlIC0gc3F1YXJlT2ZtZWFuKTtcblxuICAgIHRoaXMubWV0YURhdGEuZHVyYXRpb24gPSB0aW1lIC0gdGhpcy5vbnNldFRpbWU7XG5cbiAgICB0aGlzLm91dHB1dCh0aGlzLm9uc2V0VGltZSk7XG4gIH1cblxuICBjb25maWd1cmVTdHJlYW0oKSB7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gNDsgLy8gbWluLCBtYXgsIG1lYW4sIHN0ZGRldlxuICB9XG5cbiAgaW5pdGlhbGl6ZShzdHJlYW1QYXJhbXMpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKHN0cmVhbVBhcmFtcyk7XG4gICAgdGhpcy5tb3ZpbmdBdmVyYWdlLmluaXRpYWxpemUoc3RyZWFtUGFyYW1zKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHN1cGVyLnJlc2V0KCk7XG4gICAgdGhpcy5tb3ZpbmdBdmVyYWdlLnJlc2V0KCk7XG4gICAgdGhpcy5yZXNldFNlZ21lbnQoKTtcbiAgfVxuXG4gIGZpbmFsaXplKHRpbWUpIHtcbiAgICBzdXBlci5maW5hbGl6ZSh0aW1lKTtcblxuICAgIGlmICh0aGlzLmluc2lkZVNlZ21lbnQpXG4gICAgICB0aGlzLm91dHB1dFNlZ21lbnQodGltZSk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGNvbnN0IHJhd1ZhbHVlID0gZnJhbWVbMF07XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnBhcmFtcy5sb2dJbnB1dCA/IE1hdGgubG9nKHZhbHVlKSA6IHJhd1ZhbHVlO1xuICAgIGNvbnN0IG12YXZyZyA9IHRoaXMubW92aW5nQXZlcmFnZS5pbnB1dFNjYWxhcih2YWx1ZSk7XG4gICAgY29uc3QgZGlmZiA9IHZhbHVlIC0gbXZhdnJnO1xuXG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgaWYgKGRpZmYgPiB0aGlzLnBhcmFtcy50aHJlc2hvbGQgJiYgdGltZSAtIHRoaXMub25zZXRUaW1lID4gdGhpcy5wYXJhbXMubWluSW50ZXIpIHtcbiAgICAgIGlmKHRoaXMuaW5zaWRlU2VnbWVudClcbiAgICAgICAgdGhpcy5vdXRwdXRTZWdtZW50KHRpbWUpO1xuXG4gICAgICAvLyBzdGFydCBzZWdtZW50XG4gICAgICB0aGlzLmluc2lkZVNlZ21lbnQgPSB0cnVlO1xuICAgICAgdGhpcy5vbnNldFRpbWUgPSB0aW1lO1xuICAgICAgdGhpcy5tYXggPSAtSW5maW5pdHk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaW5zaWRlU2VnbWVudCkge1xuICAgICAgdGhpcy5taW4gPSBNYXRoLm1pbih0aGlzLm1pbiwgcmF3VmFsdWUpO1xuICAgICAgdGhpcy5tYXggPSBNYXRoLm1heCh0aGlzLm1heCwgcmF3VmFsdWUpO1xuICAgICAgdGhpcy5zdW0gKz0gcmF3VmFsdWU7XG4gICAgICB0aGlzLnN1bU9mU3F1YXJlcyArPSByYXdWYWx1ZSAqIHJhd1ZhbHVlO1xuICAgICAgdGhpcy5jb3VudCsrO1xuXG4gICAgICBpZiAodGltZSAtIHRoaXMub25zZXRUaW1lID49IHRoaXMucGFyYW1zLm1heER1cmF0aW9uIHx8IHZhbHVlIDw9IHRoaXMucGFyYW1zLm9mZlRocmVzaG9sZCkge1xuICAgICAgICB0aGlzLm91dHB1dFNlZ21lbnQodGltZSk7XG4gICAgICAgIHRoaXMuaW5zaWRlU2VnbWVudCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19