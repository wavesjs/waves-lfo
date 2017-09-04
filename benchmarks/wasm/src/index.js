import * as loaders from 'waves-loaders';
import * as Benchmark from 'benchmark';
import FftAsm from './FftAsm';

window.Benchmark = Benchmark;
const loader = new loaders.AudioBufferLoader();
const audioContext = new AudioContext();

if (!('WebAssembly' in window))
  alert('you need a browser with wasm support enabled :(');

const $log = document.querySelector('#log');
function log(val) {
  const $p = document.createElement('p');
  $p.textContent = val;
  $log.appendChild($p);
}

// loads a WebAssembly dynamic library, returns a promise.
// imports is an optional imports object
function loadWebAssembly(filename, imports) {
  // Fetch the file and compile it
  return fetch(filename)
    .then(response => response.arrayBuffer())
    .then(buffer => WebAssembly.compile(buffer))
    .then(module => {
      // create the imports for the module, including the
      // standard dynamic library imports
      imports = imports || {};
      imports.env = imports.env || {};
      imports.env.memoryBase = imports.env.memoryBase || 0;
      imports.env.tableBase = imports.env.tableBase || 0;

      // note: just take really memory for now...
      if (!imports.env.memory)
        imports.env.memory = new WebAssembly.Memory({ initial: 256 });

      if (!imports.env.table)
        imports.env.table = new WebAssembly.Table({ initial: 0, element: 'anyfunc' });

      // create the instance
      const instance = new WebAssembly.Instance(module, imports);
      return Promise.resolve({ instance, imports });
    });
}

const webAssemblyPromise = loadWebAssembly('fft.wasm');
const audioBufferPromise = loader.load('assets/drum-loop-extract-1s.wav');

Promise.all([webAssemblyPromise, audioBufferPromise])
  .then(([wasm, audioBuffer]) => {
    var exports = wasm.instance.exports; // the exports of that instance
    var imports = wasm.imports;

    const frameSize = 256;

    const buffer = audioBuffer.getChannelData(0);
    const bufferLength = buffer.length;
    const sampleRate = audioContext.sampleRate;
    const numFrames = Math.floor(bufferLength / frameSize);

    const fft = new FftAsm({
      size: frameSize, // fftSize
      window: 'none',
      mode: 'magnitude',
      norm: 'none',
      fftWasmExport: exports,
      wasmMemory: imports.env.memory.buffer,
    });

    fft.processStreamParams({
      frameSize: frameSize,
      frameType: 'signal',
      sourceSampleRate: sampleRate,
    });
    // const output = fft.inputSignal(input);

    const suite = new Benchmark.Suite();

    suite.add(`lfo-asm:fft\tframeSize: ${frameSize}\t`, {
      fn: function() {
        for (let i = 0; i < numFrames; i++) {
          const start = i * frameSize;
          const end = start + frameSize;
          const frame = buffer.subarray(start, end);
          const res = fft.inputSignal(frame);
        }
      },
    });

    suite.on('cycle', function(event) {
      log(String(event.target));
    });

    suite.on('complete', function() {
      log('==> Fastest is ' + this.filter('fastest').map('name'));
    });

    suite.run({ async: false });
  });
