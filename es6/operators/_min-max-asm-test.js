import BaseLfo from '../core/base-lfo';

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

function asmModule(stdlib, foreign, heap) {
  'use asm';

  var log = foreign.log

  function minMax() {
    var min = 0.0;
    var max = 0.0;
    min = stdlib.Infinity * 1.0;
    max = stdlib.Infinity * -1.0;

    for (var i = 0, l = (heap.length - 2)|0; i < l; i += (1|0)) {
      var value = +(heap[i]);
      if (value < min) { min = value; }
      if (value > max) { max = value; }
    }

    log(min, max);

    heap[(heap.length - 2)|0] = min;
    heap[(heap.length - 1)|0] = max;
  }

  return {
    minMax: minMax
  };
}

/**
 */
export default class MinMaxAsm extends BaseLfo {
  constructor(options) {
    const defaults = {};
    super(options, defaults);
  }

  configureStream() {
    this.streamParams.frameSize = 2;
  }

  process(time, frame, metaData) {
    const heap = new Float32Array(frame.length + 2);
    heap.set(frame, 0);

    const module = asmModule({ Infinity: window.Infinity }, { log: console.log.bind(console) }, heap);
    module.minMax();

    this.outFrame[0] = heap[heap.length - 2];
    this.outFrame[1] = heap[heap.length - 1];

    this.metaData = metaData;
    this.output();
  }
}
