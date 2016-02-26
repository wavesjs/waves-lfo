'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreBaseLfo = require('../core/base-lfo');

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var MovingMedian = (function (_BaseLfo) {
  _inherits(MovingMedian, _BaseLfo);

  function MovingMedian(options) {
    _classCallCheck(this, MovingMedian);

    _get(Object.getPrototypeOf(MovingMedian.prototype), 'constructor', this).call(this, options, {
      order: 9
    });

    if (this.params.order % 2 === 0) {
      throw new Error('order must be an odd number');
    }

    this.queue = new Float32Array(this.params.order);
    this.sorter = [];
  }

  _createClass(MovingMedian, [{
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(MovingMedian.prototype), 'reset', this).call(this);

      for (var i = 0, l = this.queue.length; i < l; i++) {
        this.queue[i] = 0;
      }
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var outFrame = this.outFrame;
      var frameSize = frame.length;
      var order = this.params.order;
      var pushIndex = this.params.order - 1;
      var medianIndex = Math.floor(order / 2);

      for (var i = 0; i < frameSize; i++) {
        var current = frame[i];
        // update queue
        this.queue.set(this.queue.subarray(1), 0);
        this.queue[pushIndex] = current;
        // get median
        this.sorter = _Array$from(this.queue.values());
        this.sorter.sort(function (a, b) {
          return a - b;
        });

        outFrame[i] = this.sorter[medianIndex];
      }

      this.output(time, outFrame, metaData);
    }
  }]);

  return MovingMedian;
})(_coreBaseLfo2['default']);

exports['default'] = MovingMedian;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbW92aW5nLW1lZGlhbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBQW9CLGtCQUFrQjs7OztJQUVqQixZQUFZO1lBQVosWUFBWTs7QUFDcEIsV0FEUSxZQUFZLENBQ25CLE9BQU8sRUFBRTswQkFERixZQUFZOztBQUU3QiwrQkFGaUIsWUFBWSw2Q0FFdkIsT0FBTyxFQUFFO0FBQ2IsV0FBSyxFQUFFLENBQUM7S0FDVCxFQUFFOztBQUVILFFBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUMvQixZQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7S0FDaEQ7O0FBRUQsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pELFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0dBQ2xCOztlQVprQixZQUFZOztXQWMxQixpQkFBRztBQUNOLGlDQWZpQixZQUFZLHVDQWVmOztBQUVkLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2pELFlBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ25CO0tBQ0Y7OztXQUVNLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDL0IsVUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUMvQixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNoQyxVQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDeEMsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0FBRTFDLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbEMsWUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV6QixZQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMxQyxZQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLE9BQU8sQ0FBQzs7QUFFaEMsWUFBSSxDQUFDLE1BQU0sR0FBRyxZQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUM5QyxZQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO2lCQUFLLENBQUMsR0FBRyxDQUFDO1NBQUEsQ0FBQyxDQUFDOztBQUVsQyxnQkFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7T0FDeEM7O0FBRUQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3ZDOzs7U0ExQ2tCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6ImVzNi9vcGVyYXRvcnMvbW92aW5nLW1lZGlhbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb3ZpbmdNZWRpYW4gZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMsIHtcbiAgICAgIG9yZGVyOiA5LFxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLm9yZGVyICUgMiA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdvcmRlciBtdXN0IGJlIGFuIG9kZCBudW1iZXInKTtcbiAgICB9XG5cbiAgICB0aGlzLnF1ZXVlID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnBhcmFtcy5vcmRlcik7XG4gICAgdGhpcy5zb3J0ZXIgPSBbXTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHN1cGVyLnJlc2V0KCk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMucXVldWUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLnF1ZXVlW2ldID0gMDtcbiAgICB9XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGNvbnN0IG91dEZyYW1lID0gdGhpcy5vdXRGcmFtZTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSBmcmFtZS5sZW5ndGg7XG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5vcmRlcjtcbiAgICBjb25zdCBwdXNoSW5kZXggPSB0aGlzLnBhcmFtcy5vcmRlciAtIDE7XG4gICAgY29uc3QgbWVkaWFuSW5kZXggPSBNYXRoLmZsb29yKG9yZGVyIC8gMik7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCBjdXJyZW50ID0gZnJhbWVbaV07XG4gICAgICAvLyB1cGRhdGUgcXVldWVcbiAgICAgIHRoaXMucXVldWUuc2V0KHRoaXMucXVldWUuc3ViYXJyYXkoMSksIDApO1xuICAgICAgdGhpcy5xdWV1ZVtwdXNoSW5kZXhdID0gY3VycmVudDtcbiAgICAgIC8vIGdldCBtZWRpYW5cbiAgICAgIHRoaXMuc29ydGVyID0gQXJyYXkuZnJvbSh0aGlzLnF1ZXVlLnZhbHVlcygpKTtcbiAgICAgIHRoaXMuc29ydGVyLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcblxuICAgICAgb3V0RnJhbWVbaV0gPSB0aGlzLnNvcnRlclttZWRpYW5JbmRleF07XG4gICAgfVxuXG4gICAgdGhpcy5vdXRwdXQodGltZSwgb3V0RnJhbWUsIG1ldGFEYXRhKTtcbiAgfVxufVxuIl19