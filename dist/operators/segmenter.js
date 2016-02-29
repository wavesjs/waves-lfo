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
      minInput: 0.000000000001,
      filterOrder: 5,
      threshold: 3,
      offThreshold: -Infinity,
      minInter: 0.050,
      maxDuration: Infinity
    }, options);

    this.insideSegment = false;
    this.onsetTime = -Infinity;

    // stats
    this.min = Infinity;
    this.max = -Infinity;
    this.sum = 0;
    this.sumOfSquares = 0;
    this.count = 0;

    var minInput = this.params.minInput;
    var fill = minInput;

    if (this.params.logInput && minInput > 0) fill = Math.log(minInput);

    this.movingAverage = new _movingAverage2['default']({
      order: this.params.filterOrder,
      fill: fill
    });

    this.lastMvavrg = fill;
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
      this.outFrame[0] = endTime - this.onsetTime;
      this.outFrame[1] = this.min;
      this.outFrame[2] = this.max;

      var norm = 1 / this.count;
      var mean = this.sum * norm;
      var meanOfSquare = this.sumOfSquares * norm;
      var squareOfmean = mean * mean;

      this.outFrame[3] = mean;
      this.outFrame[4] = 0;

      if (meanOfSquare > squareOfmean) this.outFrame[4] = Math.sqrt(meanOfSquare - squareOfmean);

      this.output(this.onsetTime);
    }
  }, {
    key: 'initialize',
    value: function initialize(inStreamParams) {
      _get(Object.getPrototypeOf(Segmenter.prototype), 'initialize', this).call(this, inStreamParams, {
        frameSize: 5,
        description: ['duration', 'min', 'max', 'mean', 'std dev']
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
      if (this.insideSegment) this.outputSegment(endTime);

      _get(Object.getPrototypeOf(Segmenter.prototype), 'finalize', this).call(this, endTime);
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var rawValue = frame[0];
      var minInput = this.params.minInput;
      var value = Math.max(rawValue, minInput);

      if (this.params.logInput) value = Math.log(value);

      var diff = value - this.lastMvavrg;
      this.lastMvavrg = this.movingAverage.inputScalar(value);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvc2VnbWVudGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7Ozs2QkFDWixrQkFBa0I7Ozs7SUFHdkIsU0FBUztZQUFULFNBQVM7O0FBQ2pCLFdBRFEsU0FBUyxDQUNoQixPQUFPLEVBQUU7MEJBREYsU0FBUzs7QUFFMUIsK0JBRmlCLFNBQVMsNkNBRXBCO0FBQ0osY0FBUSxFQUFFLEtBQUs7QUFDZixjQUFRLEVBQUUsY0FBYztBQUN4QixpQkFBVyxFQUFFLENBQUM7QUFDZCxlQUFTLEVBQUUsQ0FBQztBQUNaLGtCQUFZLEVBQUUsQ0FBQyxRQUFRO0FBQ3ZCLGNBQVEsRUFBRSxLQUFLO0FBQ2YsaUJBQVcsRUFBRSxRQUFRO0tBQ3RCLEVBQUUsT0FBTyxFQUFFOztBQUVaLFFBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxRQUFRLENBQUM7OztBQUczQixRQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQztBQUNwQixRQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsUUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7QUFDdEIsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7O0FBRWYsUUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDdEMsUUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDOztBQUVwQixRQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQ3JDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUU1QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUFrQjtBQUNyQyxXQUFLLEVBQUUsSUFBSSxDQUFD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QyxZQUFZLEVBQUU7QUFDekYsY0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixjQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztTQUM1QjtPQUNGO0tBQ0Y7OztTQXRHWSxhQUFDLEtBQUssRUFBRTtBQUNuQixVQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7S0FDL0I7OztTQUVlLGFBQUMsS0FBSyxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztLQUNsQzs7O1NBMUNrQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiJlczYvb3BlcmF0b3JzL3NlZ21lbnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuaW1wb3J0IE1vdmluZ0F2ZXJhZ2UgZnJvbSAnLi9tb3ZpbmctYXZlcmFnZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VnbWVudGVyIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICBsb2dJbnB1dDogZmFsc2UsXG4gICAgICBtaW5JbnB1dDogMC4wMDAwMDAwMDAwMDEsXG4gICAgICBmaWx0ZXJPcmRlcjogNSxcbiAgICAgIHRocmVzaG9sZDogMyxcbiAgICAgIG9mZlRocmVzaG9sZDogLUluZmluaXR5LFxuICAgICAgbWluSW50ZXI6IDAuMDUwLFxuICAgICAgbWF4RHVyYXRpb246IEluZmluaXR5LFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5pbnNpZGVTZWdtZW50ID0gZmFsc2U7XG4gICAgdGhpcy5vbnNldFRpbWUgPSAtSW5maW5pdHk7XG5cbiAgICAvLyBzdGF0c1xuICAgIHRoaXMubWluID0gSW5maW5pdHk7XG4gICAgdGhpcy5tYXggPSAtSW5maW5pdHk7XG4gICAgdGhpcy5zdW0gPSAwO1xuICAgIHRoaXMuc3VtT2ZTcXVhcmVzID0gMDtcbiAgICB0aGlzLmNvdW50ID0gMDtcblxuICAgIGNvbnN0IG1pbklucHV0ID0gdGhpcy5wYXJhbXMubWluSW5wdXQ7XG4gICAgbGV0IGZpbGwgPSBtaW5JbnB1dDtcblxuICAgIGlmKHRoaXMucGFyYW1zLmxvZ0lucHV0ICYmIG1pbklucHV0ID4gMClcbiAgICAgIGZpbGwgPSBNYXRoLmxvZyhtaW5JbnB1dCk7XG5cbiAgICB0aGlzLm1vdmluZ0F2ZXJhZ2UgPSBuZXcgTW92aW5nQXZlcmFnZSh7XG4gICAgICBvcmRlcjogdGhpcy5wYXJhbXMuZmlsdGVyT3JkZXIsXG4gICAgICBmaWxsOiBmaWxsLFxuICAgIH0pO1xuXG4gICAgdGhpcy5sYXN0TXZhdnJnID0gZmlsbDtcbiAgfVxuXG4gIHNldCB0aHJlc2hvbGQodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy50aHJlc2hvbGQgPSB2YWx1ZTtcbiAgfVxuXG4gIHNldCBvZmZUaHJlc2hvbGQodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy5vZmZUaHJlc2hvbGQgPSB2YWx1ZTtcbiAgfVxuXG4gIHJlc2V0U2VnbWVudCgpIHtcbiAgICB0aGlzLmluc2lkZVNlZ21lbnQgPSBmYWxzZTtcbiAgICB0aGlzLm9uc2V0VGltZSA9IC1JbmZpbml0eTtcblxuICAgIC8vIHN0YXRzXG4gICAgdGhpcy5taW4gPSBJbmZpbml0eTtcbiAgICB0aGlzLm1heCA9IC1JbmZpbml0eTtcbiAgICB0aGlzLnN1bSA9IDA7XG4gICAgdGhpcy5zdW1PZlNxdWFyZXMgPSAwO1xuICAgIHRoaXMuY291bnQgPSAwO1xuICB9XG5cbiAgb3V0cHV0U2VnbWVudChlbmRUaW1lKSB7XG4gICAgdGhpcy5vdXRGcmFtZVswXSA9IGVuZFRpbWUgLSB0aGlzLm9uc2V0VGltZTtcbiAgICB0aGlzLm91dEZyYW1lWzFdID0gdGhpcy5taW47XG4gICAgdGhpcy5vdXRGcmFtZVsyXSA9IHRoaXMubWF4O1xuXG4gICAgY29uc3Qgbm9ybSA9IDEgLyB0aGlzLmNvdW50O1xuICAgIGNvbnN0IG1lYW4gPSB0aGlzLnN1bSAqIG5vcm07XG4gICAgY29uc3QgbWVhbk9mU3F1YXJlID0gdGhpcy5zdW1PZlNxdWFyZXMgKiBub3JtO1xuICAgIGNvbnN0IHNxdWFyZU9mbWVhbiA9IG1lYW4gKiBtZWFuO1xuXG4gICAgdGhpcy5vdXRGcmFtZVszXSA9IG1lYW47XG4gICAgdGhpcy5vdXRGcmFtZVs0XSA9IDA7XG5cbiAgICBpZiAobWVhbk9mU3F1YXJlID4gc3F1YXJlT2ZtZWFuKVxuICAgICAgdGhpcy5vdXRGcmFtZVs0XSA9IE1hdGguc3FydChtZWFuT2ZTcXVhcmUgLSBzcXVhcmVPZm1lYW4pO1xuXG4gICAgdGhpcy5vdXRwdXQodGhpcy5vbnNldFRpbWUpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShpblN0cmVhbVBhcmFtcykge1xuICAgIHN1cGVyLmluaXRpYWxpemUoaW5TdHJlYW1QYXJhbXMsIHtcbiAgICAgIGZyYW1lU2l6ZTogNSxcbiAgICAgIGRlc2NyaXB0aW9uOiBbXG4gICAgICAgICdkdXJhdGlvbicsXG4gICAgICAgICdtaW4nLFxuICAgICAgICAnbWF4JyxcbiAgICAgICAgJ21lYW4nLFxuICAgICAgICAnc3RkIGRldicsXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgdGhpcy5tb3ZpbmdBdmVyYWdlLmluaXRpYWxpemUoaW5TdHJlYW1QYXJhbXMpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcbiAgICB0aGlzLm1vdmluZ0F2ZXJhZ2UucmVzZXQoKTtcbiAgICB0aGlzLnJlc2V0U2VnbWVudCgpO1xuICB9XG5cbiAgZmluYWxpemUoZW5kVGltZSkge1xuICAgIGlmICh0aGlzLmluc2lkZVNlZ21lbnQpXG4gICAgICB0aGlzLm91dHB1dFNlZ21lbnQoZW5kVGltZSk7XG5cbiAgICBzdXBlci5maW5hbGl6ZShlbmRUaW1lKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgY29uc3QgcmF3VmFsdWUgPSBmcmFtZVswXTtcbiAgICBjb25zdCBtaW5JbnB1dCA9IHRoaXMucGFyYW1zLm1pbklucHV0O1xuICAgIGxldCB2YWx1ZSA9IE1hdGgubWF4KHJhd1ZhbHVlLCBtaW5JbnB1dCk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMubG9nSW5wdXQpXG4gICAgICB2YWx1ZSA9IE1hdGgubG9nKHZhbHVlKTtcblxuICAgIGNvbnN0IGRpZmYgPSB2YWx1ZSAtIHRoaXMubGFzdE12YXZyZztcbiAgICB0aGlzLmxhc3RNdmF2cmcgPSB0aGlzLm1vdmluZ0F2ZXJhZ2UuaW5wdXRTY2FsYXIodmFsdWUpO1xuXG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgaWYgKGRpZmYgPiB0aGlzLnBhcmFtcy50aHJlc2hvbGQgJiYgdGltZSAtIHRoaXMub25zZXRUaW1lID4gdGhpcy5wYXJhbXMubWluSW50ZXIpIHtcbiAgICAgIGlmKHRoaXMuaW5zaWRlU2VnbWVudClcbiAgICAgICAgdGhpcy5vdXRwdXRTZWdtZW50KHRpbWUpO1xuXG4gICAgICAvLyBzdGFydCBzZWdtZW50XG4gICAgICB0aGlzLmluc2lkZVNlZ21lbnQgPSB0cnVlO1xuICAgICAgdGhpcy5vbnNldFRpbWUgPSB0aW1lO1xuICAgICAgdGhpcy5tYXggPSAtSW5maW5pdHk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaW5zaWRlU2VnbWVudCkge1xuICAgICAgdGhpcy5taW4gPSBNYXRoLm1pbih0aGlzLm1pbiwgcmF3VmFsdWUpO1xuICAgICAgdGhpcy5tYXggPSBNYXRoLm1heCh0aGlzLm1heCwgcmF3VmFsdWUpO1xuICAgICAgdGhpcy5zdW0gKz0gcmF3VmFsdWU7XG4gICAgICB0aGlzLnN1bU9mU3F1YXJlcyArPSByYXdWYWx1ZSAqIHJhd1ZhbHVlO1xuICAgICAgdGhpcy5jb3VudCsrO1xuXG4gICAgICBpZiAodGltZSAtIHRoaXMub25zZXRUaW1lID49IHRoaXMucGFyYW1zLm1heER1cmF0aW9uIHx8IHZhbHVlIDw9IHRoaXMucGFyYW1zLm9mZlRocmVzaG9sZCkge1xuICAgICAgICB0aGlzLm91dHB1dFNlZ21lbnQodGltZSk7XG4gICAgICAgIHRoaXMuaW5zaWRlU2VnbWVudCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19