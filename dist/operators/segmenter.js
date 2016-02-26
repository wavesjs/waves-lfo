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

    _get(Object.getPrototypeOf(Segmenter.prototype), 'constructor', this).call(this, {
      logInput: false,
      minInput: 0.000001,
      filterOrder: 5,
      threshold: 0.5,
      offThreshold: -Infinity,
      minInter: 0.050,
      maxDuration: Infinity
    }, options);

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
    value: function outputSegment(endTime) {
      this.outFrame[0] = this.max;
      this.outFrame[1] = this.min;

      var norm = 1 / this.count;
      var mean = this.sum * norm;
      var meanOfSquare = this.sumOfSquares * norm;
      var squareOfmean = mean * mean;

      this.outFrame[2] = mean;
      this.outFrame[3] = 0;

      if (meanOfSquare > squareOfmean) this.outFrame[3] = Math.sqrt(meanOfSquare - squareOfmean);

      this.metaData.duration = endTime - this.onsetTime;

      this.output(this.onsetTime);
    }
  }, {
    key: 'initialize',
    value: function initialize(inStreamParams) {
      _get(Object.getPrototypeOf(Segmenter.prototype), 'initialize', this).call(this, inStreamParams, {
        frameSize: 4
      });

      this.movingAverage.initialize(inStreamParams);
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
    value: function finalize(endTime) {
      _get(Object.getPrototypeOf(Segmenter.prototype), 'finalize', this).call(this, endTime);

      if (this.insideSegment) this.outputSegment(endTime);
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var rawValue = frame[0];
      var minInput = this.params.minInput;
      var value = Math.max(rawValue, minInput);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvc2VnbWVudGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7Ozs2QkFDWixrQkFBa0I7Ozs7SUFHdkIsU0FBUztZQUFULFNBQVM7O0FBQ2pCLFdBRFEsU0FBUyxDQUNoQixPQUFPLEVBQUU7MEJBREYsU0FBUzs7QUFFMUIsK0JBRmlCLFNBQVMsNkNBRXBCO0FBQ0osY0FBUSxFQUFFLEtBQUs7QUFDZixjQUFRLEVBQUUsUUFBUTtBQUNsQixpQkFBVyxFQUFFLENBQUM7QUFDZCxlQUFTLEVBQUUsR0FBRztBQUNkLGtCQUFZLEVBQUUsQ0FBQyxRQUFRO0FBQ3ZCLGNBQVEsRUFBRSxLQUFLO0FBQ2YsaUJBQVcsRUFBRSxRQUFRO0tBQ3RCLEVBQUUsT0FBTyxFQUFFOztBQUVaLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQWtCLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztHQUM1RTs7ZUFia0IsU0FBUzs7V0F1QmhCLHdCQUFHO0FBQ2IsVUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDM0IsVUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLFFBQVEsQ0FBQzs7O0FBRzNCLFVBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDckIsVUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDYixVQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztBQUN0QixVQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztLQUNoQjs7O1dBRVksdUJBQUMsT0FBTyxFQUFFO0FBQ3JCLFVBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUM1QixVQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFH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QUFDO0FBQ3hDLFlBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3hDLFlBQUksQ0FBQyxHQUFHLElBQUksUUFBUSxDQUFDO0FBQ3JCLFlBQUksQ0FBQyxZQUFZLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6QyxZQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRWIsWUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7QUFDekYsY0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixjQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztTQUM1QjtPQUNGO0tBQ0Y7OztTQWhHWSxhQUFDLEtBQUssRUFBRTtBQUNuQixVQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7S0FDL0I7OztTQUVlLGFBQUMsS0FBSyxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztLQUNsQzs7O1NBckJrQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiJlczYvb3BlcmF0b3JzL3NlZ21lbnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuaW1wb3J0IE1vdmluZ0F2ZXJhZ2UgZnJvbSAnLi9tb3ZpbmctYXZlcmFnZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VnbWVudGVyIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICBsb2dJbnB1dDogZmFsc2UsXG4gICAgICBtaW5JbnB1dDogMC4wMDAwMDEsXG4gICAgICBmaWx0ZXJPcmRlcjogNSxcbiAgICAgIHRocmVzaG9sZDogMC41LFxuICAgICAgb2ZmVGhyZXNob2xkOiAtSW5maW5pdHksXG4gICAgICBtaW5JbnRlcjogMC4wNTAsXG4gICAgICBtYXhEdXJhdGlvbjogSW5maW5pdHksXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLm1vdmluZ0F2ZXJhZ2UgPSBuZXcgTW92aW5nQXZlcmFnZSh7IG9yZGVyOiB0aGlzLnBhcmFtcy5maWx0ZXJPcmRlciB9KTtcbiAgfVxuXG4gIHNldCB0aHJlc2hvbGQodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy50aHJlc2hvbGQgPSB2YWx1ZTtcbiAgfVxuXG4gIHNldCBvZmZUaHJlc2hvbGQodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy5vZmZUaHJlc2hvbGQgPSB2YWx1ZTtcbiAgfVxuXG4gIHJlc2V0U2VnbWVudCgpIHtcbiAgICB0aGlzLmluc2lkZVNlZ21lbnQgPSBmYWxzZTtcbiAgICB0aGlzLm9uc2V0VGltZSA9IC1JbmZpbml0eTtcblxuICAgIC8vIHN0YXRzXG4gICAgdGhpcy5taW4gPSBJbmZpbml0eTtcbiAgICB0aGlzLm1heCA9IC1JbmZpbml0eTtcbiAgICB0aGlzLnN1bSA9IDA7XG4gICAgdGhpcy5zdW1PZlNxdWFyZXMgPSAwO1xuICAgIHRoaXMuY291bnQgPSAwO1xuICB9XG5cbiAgb3V0cHV0U2VnbWVudChlbmRUaW1lKSB7XG4gICAgdGhpcy5vdXRGcmFtZVswXSA9IHRoaXMubWF4O1xuICAgIHRoaXMub3V0RnJhbWVbMV0gPSB0aGlzLm1pbjtcblxuICAgIGNvbnN0IG5vcm0gPSAxIC8gdGhpcy5jb3VudDtcbiAgICBjb25zdCBtZWFuID0gdGhpcy5zdW0gKiBub3JtO1xuICAgIGNvbnN0IG1lYW5PZlNxdWFyZSA9IHRoaXMuc3VtT2ZTcXVhcmVzICogbm9ybTtcbiAgICBjb25zdCBzcXVhcmVPZm1lYW4gPSBtZWFuICogbWVhbjtcblxuICAgIHRoaXMub3V0RnJhbWVbMl0gPSBtZWFuO1xuICAgIHRoaXMub3V0RnJhbWVbM10gPSAwO1xuXG4gICAgaWYgKG1lYW5PZlNxdWFyZSA+IHNxdWFyZU9mbWVhbilcbiAgICAgIHRoaXMub3V0RnJhbWVbM10gPSBNYXRoLnNxcnQobWVhbk9mU3F1YXJlIC0gc3F1YXJlT2ZtZWFuKTtcblxuICAgIHRoaXMubWV0YURhdGEuZHVyYXRpb24gPSBlbmRUaW1lIC0gdGhpcy5vbnNldFRpbWU7XG5cbiAgICB0aGlzLm91dHB1dCh0aGlzLm9uc2V0VGltZSk7XG4gIH1cblxuICBpbml0aWFsaXplKGluU3RyZWFtUGFyYW1zKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZShpblN0cmVhbVBhcmFtcywge1xuICAgICAgZnJhbWVTaXplOiA0LFxuICAgIH0pO1xuXG4gICAgdGhpcy5tb3ZpbmdBdmVyYWdlLmluaXRpYWxpemUoaW5TdHJlYW1QYXJhbXMpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcbiAgICB0aGlzLm1vdmluZ0F2ZXJhZ2UucmVzZXQoKTtcbiAgICB0aGlzLnJlc2V0U2VnbWVudCgpO1xuICB9XG5cbiAgZmluYWxpemUoZW5kVGltZSkge1xuICAgIHN1cGVyLmZpbmFsaXplKGVuZFRpbWUpO1xuXG4gICAgaWYgKHRoaXMuaW5zaWRlU2VnbWVudClcbiAgICAgIHRoaXMub3V0cHV0U2VnbWVudChlbmRUaW1lKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgY29uc3QgcmF3VmFsdWUgPSBmcmFtZVswXTtcbiAgICBjb25zdCBtaW5JbnB1dCA9IHRoaXMucGFyYW1zLm1pbklucHV0O1xuICAgIGxldCB2YWx1ZSA9IE1hdGgubWF4KHJhd1ZhbHVlLCBtaW5JbnB1dCk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMubG9nSW5wdXQpXG4gICAgICB2YWx1ZSA9IE1hdGgubG9nKHZhbHVlKTtcblxuICAgIGNvbnN0IG12YXZyZyA9IHRoaXMubW92aW5nQXZlcmFnZS5pbnB1dFNjYWxhcih2YWx1ZSk7XG4gICAgY29uc3QgZGlmZiA9IHZhbHVlIC0gbXZhdnJnO1xuXG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgaWYgKGRpZmYgPiB0aGlzLnBhcmFtcy50aHJlc2hvbGQgJiYgdGltZSAtIHRoaXMub25zZXRUaW1lID4gdGhpcy5wYXJhbXMubWluSW50ZXIpIHtcbiAgICAgIGlmKHRoaXMuaW5zaWRlU2VnbWVudClcbiAgICAgICAgdGhpcy5vdXRwdXRTZWdtZW50KHRpbWUpO1xuXG4gICAgICAvLyBzdGFydCBzZWdtZW50XG4gICAgICB0aGlzLmluc2lkZVNlZ21lbnQgPSB0cnVlO1xuICAgICAgdGhpcy5vbnNldFRpbWUgPSB0aW1lO1xuICAgICAgdGhpcy5tYXggPSAtSW5maW5pdHk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaW5zaWRlU2VnbWVudCkge1xuICAgICAgdGhpcy5taW4gPSBNYXRoLm1pbih0aGlzLm1pbiwgcmF3VmFsdWUpO1xuICAgICAgdGhpcy5tYXggPSBNYXRoLm1heCh0aGlzLm1heCwgcmF3VmFsdWUpO1xuICAgICAgdGhpcy5zdW0gKz0gcmF3VmFsdWU7XG4gICAgICB0aGlzLnN1bU9mU3F1YXJlcyArPSByYXdWYWx1ZSAqIHJhd1ZhbHVlO1xuICAgICAgdGhpcy5jb3VudCsrO1xuXG4gICAgICBpZiAodGltZSAtIHRoaXMub25zZXRUaW1lID49IHRoaXMucGFyYW1zLm1heER1cmF0aW9uIHx8IHZhbHVlIDw9IHRoaXMucGFyYW1zLm9mZlRocmVzaG9sZCkge1xuICAgICAgICB0aGlzLm91dHB1dFNlZ21lbnQodGltZSk7XG4gICAgICAgIHRoaXMuaW5zaWRlU2VnbWVudCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19