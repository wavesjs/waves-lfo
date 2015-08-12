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

// // MinMax benchmark
// (function() {
//   var length = 1000000;
//   var frame = new Float32Array(length);
//   for (var i = 0; i < length; i++) {
//     frame.set([Math.random()], i);
//   }

//   // second branch
//   const minMaxAsm = new lfo.operator.MinMaxAsm();
//   minMaxAsm.outFrame = new Float32Array(2);

//   const minMax = new lfo.operator.MinMax();
//   minMax.outFrame = new Float32Array(2);

//   console.time('MinMaxAsm');
//   minMaxAsm.process(0, frame, {});
//   console.timeEnd('MinMaxAsm');

//   console.time('MinMax');
//   minMax.process(0, frame, {});
//   console.timeEnd('MinMax');
// }());

/*
chrome:
MinMaxAsm: 19.592ms
MinMax: 3.570ms

firefox:
MinMaxAsm : 4.43ms
MinMax : 2.9ms

 * Real poor performances...
 * - asm is maybe badly written firefox says "TypeError: asm.js type error: Disabled by debugger"
 * - hard to debug,
 * - impossible to know if the code is executed with AOT compilation
*/

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

function asmModule(stdlib, foreign, heap) {
  'use asm';

  var log = foreign.log;

  function minMax() {
    var min = 0.0;
    var max = 0.0;
    min = stdlib.Infinity * 1.0;
    max = stdlib.Infinity * -1.0;

    for (var i = 0, l = heap.length - 2 | 0; i < l; i += 1 | 0) {
      var value = +heap[i];
      if (value < min) {
        min = value;
      }
      if (value > max) {
        max = value;
      }
    }

    log(min, max);

    heap[heap.length - 2 | 0] = min;
    heap[heap.length - 1 | 0] = max;
  }

  return {
    minMax: minMax
  };
}

/**
 */

var MinMaxAsm = (function (_BaseLfo) {
  _inherits(MinMaxAsm, _BaseLfo);

  function MinMaxAsm(options) {
    _classCallCheck(this, MinMaxAsm);

    var defaults = {};
    _get(Object.getPrototypeOf(MinMaxAsm.prototype), 'constructor', this).call(this, options, defaults);
  }

  _createClass(MinMaxAsm, [{
    key: 'configureStream',
    value: function configureStream() {
      this.streamParams.frameSize = 2;
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var heap = new Float32Array(frame.length + 2);
      heap.set(frame, 0);

      var module = asmModule({ Infinity: window.Infinity }, { log: console.log.bind(console) }, heap);
      module.minMax();

      this.outFrame[0] = heap[heap.length - 2];
      this.outFrame[1] = heap[heap.length - 1];

      this.metaData = metaData;
      this.output();
    }
  }]);

  return MinMaxAsm;
})(_coreBaseLfo2['default']);

exports['default'] = MinMaxAsm;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvX21pbi1tYXgtYXNtLXRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUN0QyxTQUFTLFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtBQUN4QyxXQUFTLENBQUM7O0FBRVYsTUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQTs7QUFFckIsV0FBUyxNQUFNLEdBQUc7QUFDaEIsUUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2QsUUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2QsT0FBRyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0FBQzVCLE9BQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxHQUFHLENBQUMsR0FBRyxDQUFDOztBQUU3QixTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQUFBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUssQ0FBQyxHQUFDLENBQUMsQUFBQyxFQUFFO0FBQzFELFVBQUksS0FBSyxHQUFHLENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxBQUFDLENBQUM7QUFDdkIsVUFBSSxLQUFLLEdBQUcsR0FBRyxFQUFFO0FBQUUsV0FBRyxHQUFHLEtBQUssQ0FBQztPQUFFO0FBQ2pDLFVBQUksS0FBSyxHQUFHLEdBQUcsRUFBRTtBQUFFLFdBQUcsR0FBRyxLQUFLLENBQUM7T0FBRTtLQUNsQzs7QUFFRCxPQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUVkLFFBQUksQ0FBQyxBQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNoQyxRQUFJLENBQUMsQUFBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7R0FDakM7O0FBRUQsU0FBTztBQUNMLFVBQU0sRUFBRSxNQUFNO0dBQ2YsQ0FBQztDQUNIOzs7OztJQUlvQixTQUFTO1lBQVQsU0FBUzs7QUFDakIsV0FEUSxTQUFTLENBQ2hCLE9BQU8sRUFBRTswQkFERixTQUFTOztBQUUxQixRQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDcEIsK0JBSGlCLFNBQVMsNkNBR3BCLE9BQU8sRUFBRSxRQUFRLEVBQUU7R0FDMUI7O2VBSmtCLFNBQVM7O1dBTWIsMkJBQUc7QUFDaEIsVUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0tBQ2pDOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixVQUFNLElBQUksR0FBRyxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2hELFVBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVuQixVQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDbEcsWUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUVoQixVQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLFVBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0FBRXpDLFVBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7U0F0QmtCLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6ImVzNi9vcGVyYXRvcnMvX21pbi1tYXgtYXNtLXRlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuLy8gLy8gTWluTWF4IGJlbmNobWFya1xuLy8gKGZ1bmN0aW9uKCkge1xuLy8gICB2YXIgbGVuZ3RoID0gMTAwMDAwMDtcbi8vICAgdmFyIGZyYW1lID0gbmV3IEZsb2F0MzJBcnJheShsZW5ndGgpO1xuLy8gICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4vLyAgICAgZnJhbWUuc2V0KFtNYXRoLnJhbmRvbSgpXSwgaSk7XG4vLyAgIH1cblxuLy8gICAvLyBzZWNvbmQgYnJhbmNoXG4vLyAgIGNvbnN0IG1pbk1heEFzbSA9IG5ldyBsZm8ub3BlcmF0b3IuTWluTWF4QXNtKCk7XG4vLyAgIG1pbk1heEFzbS5vdXRGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkoMik7XG5cbi8vICAgY29uc3QgbWluTWF4ID0gbmV3IGxmby5vcGVyYXRvci5NaW5NYXgoKTtcbi8vICAgbWluTWF4Lm91dEZyYW1lID0gbmV3IEZsb2F0MzJBcnJheSgyKTtcblxuLy8gICBjb25zb2xlLnRpbWUoJ01pbk1heEFzbScpO1xuLy8gICBtaW5NYXhBc20ucHJvY2VzcygwLCBmcmFtZSwge30pO1xuLy8gICBjb25zb2xlLnRpbWVFbmQoJ01pbk1heEFzbScpO1xuXG4vLyAgIGNvbnNvbGUudGltZSgnTWluTWF4Jyk7XG4vLyAgIG1pbk1heC5wcm9jZXNzKDAsIGZyYW1lLCB7fSk7XG4vLyAgIGNvbnNvbGUudGltZUVuZCgnTWluTWF4Jyk7XG4vLyB9KCkpO1xuXG4vKlxuY2hyb21lOlxuTWluTWF4QXNtOiAxOS41OTJtc1xuTWluTWF4OiAzLjU3MG1zXG5cbmZpcmVmb3g6XG5NaW5NYXhBc20gOiA0LjQzbXNcbk1pbk1heCA6IDIuOW1zXG5cbiAqIFJlYWwgcG9vciBwZXJmb3JtYW5jZXMuLi5cbiAqIC0gYXNtIGlzIG1heWJlIGJhZGx5IHdyaXR0ZW4gZmlyZWZveCBzYXlzIFwiVHlwZUVycm9yOiBhc20uanMgdHlwZSBlcnJvcjogRGlzYWJsZWQgYnkgZGVidWdnZXJcIlxuICogLSBoYXJkIHRvIGRlYnVnLFxuICogLSBpbXBvc3NpYmxlIHRvIGtub3cgaWYgdGhlIGNvZGUgaXMgZXhlY3V0ZWQgd2l0aCBBT1QgY29tcGlsYXRpb25cbiovXG5cbmZ1bmN0aW9uIGFzbU1vZHVsZShzdGRsaWIsIGZvcmVpZ24sIGhlYXApIHtcbiAgJ3VzZSBhc20nO1xuXG4gIHZhciBsb2cgPSBmb3JlaWduLmxvZ1xuXG4gIGZ1bmN0aW9uIG1pbk1heCgpIHtcbiAgICB2YXIgbWluID0gMC4wO1xuICAgIHZhciBtYXggPSAwLjA7XG4gICAgbWluID0gc3RkbGliLkluZmluaXR5ICogMS4wO1xuICAgIG1heCA9IHN0ZGxpYi5JbmZpbml0eSAqIC0xLjA7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IChoZWFwLmxlbmd0aCAtIDIpfDA7IGkgPCBsOyBpICs9ICgxfDApKSB7XG4gICAgICB2YXIgdmFsdWUgPSArKGhlYXBbaV0pO1xuICAgICAgaWYgKHZhbHVlIDwgbWluKSB7IG1pbiA9IHZhbHVlOyB9XG4gICAgICBpZiAodmFsdWUgPiBtYXgpIHsgbWF4ID0gdmFsdWU7IH1cbiAgICB9XG5cbiAgICBsb2cobWluLCBtYXgpO1xuXG4gICAgaGVhcFsoaGVhcC5sZW5ndGggLSAyKXwwXSA9IG1pbjtcbiAgICBoZWFwWyhoZWFwLmxlbmd0aCAtIDEpfDBdID0gbWF4O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBtaW5NYXg6IG1pbk1heFxuICB9O1xufVxuXG4vKipcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWluTWF4QXNtIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHt9O1xuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZVN0cmVhbSgpIHtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSAyO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICBjb25zdCBoZWFwID0gbmV3IEZsb2F0MzJBcnJheShmcmFtZS5sZW5ndGggKyAyKTtcbiAgICBoZWFwLnNldChmcmFtZSwgMCk7XG5cbiAgICBjb25zdCBtb2R1bGUgPSBhc21Nb2R1bGUoeyBJbmZpbml0eTogd2luZG93LkluZmluaXR5IH0sIHsgbG9nOiBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpIH0sIGhlYXApO1xuICAgIG1vZHVsZS5taW5NYXgoKTtcblxuICAgIHRoaXMub3V0RnJhbWVbMF0gPSBoZWFwW2hlYXAubGVuZ3RoIC0gMl07XG4gICAgdGhpcy5vdXRGcmFtZVsxXSA9IGhlYXBbaGVhcC5sZW5ndGggLSAxXTtcblxuICAgIHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcbiAgICB0aGlzLm91dHB1dCgpO1xuICB9XG59XG4iXX0=