(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wavesLFO = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
var id = 0;

var BaseLfo = (function () {
  function BaseLfo() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var defaults = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, BaseLfo);

    this.cid = id++;
    this.params = {};

    this.streamParams = {
      frameSize: 1,
      frameRate: 0,
      sourceSampleRate: 0
    };

    this.params = _Object$assign({}, defaults, options);
    this.children = [];
  }

  // WebAudioAPI `connect` like method

  _createClass(BaseLfo, [{
    key: 'connect',
    value: function connect(child) {
      if (this.streamParams === null) {
        throw new Error('cannot connect to a dead lfo node');
      }

      this.children.push(child);
      child.parent = this;
    }

    // initialize the current node stream and propagate to it's children
  }, {
    key: 'initialize',
    value: function initialize() {
      if (this.parent) {
        // defaults to inherit parent's stream parameters
        this.streamParams = _Object$assign(this.streamParams, this.parent.streamParams);
      }

      // entry point for stream params configuration in derived class
      this.configureStream();
      // create the `outFrame` arrayBuffer
      this.setupStream();

      // propagate initialization in lfo chain
      for (var i = 0, l = this.children.length; i < l; i++) {
        this.children[i].initialize();
      }
    }

    // sources only
    // start() {
    //   this.initialize();
    //   this.reset();
    // }

    /**
     * override inherited streamParams, only if specified in `params`
     */
  }, {
    key: 'configureStream',
    value: function configureStream() {
      if (this.params.frameSize) {
        this.streamParams.frameSize = this.params.frameSize;
      }

      if (this.params.frameRate) {
        this.streamParams.frameRate = this.params.frameRate;
      }

      if (this.params.sourceSampleRate) {
        this.streamParams.sourceSampleRate = this.params.sourceSampleRate;
      }
    }

    /**
     * create the outputFrame according to the `streamParams`
     * @NOTE remove commented code ?
     */
  }, {
    key: 'setupStream',
    value: function setupStream() /* opts = {} */{
      // if (opts.frameRate) { this.streamParams.frameRate = opts.frameRate; }
      // if (opts.frameSize) { this.streamParams.frameSize = opts.frameSize; }
      // if (opts.sourceSampleRate) { this.streamParams.sourceSampleRate = opts.sourceSampleRate; }
      this.outFrame = new Float32Array(this.streamParams.frameSize);
    }

    // reset `outFrame` and call reset on children
  }, {
    key: 'reset',
    value: function reset() {
      for (var i = 0, l = this.children.length; i < l; i++) {
        this.children[i].reset();
      }

      // sinks have no `outFrame`
      if (!this.outFrame) {
        return;
      }

      // this.outFrame.fill(0); // probably better but doesn't work yet
      for (var i = 0, l = this.outFrame.length; i < l; i++) {
        this.outFrame[i] = 0;
      }
    }

    // fill the on-going buffer with 0 (is done)
    // output it, then call reset on all the children (sure ?)
    // @NOTE: `reset` is called in `sources.start`,
    //  if is called here, it will be called more than once in a child node
    //  is this a problem ?
  }, {
    key: 'finalize',
    value: function finalize() {
      for (var i = 0, l = this.children.length; i < l; i++) {
        this.children[i].finalize();
      }
    }

    // forward the current state (time, frame, metaData) to all the children
  }, {
    key: 'output',
    value: function output() {
      var time = arguments.length <= 0 || arguments[0] === undefined ? this.time : arguments[0];
      var outFrame = arguments.length <= 1 || arguments[1] === undefined ? this.outFrame : arguments[1];
      var metaData = arguments.length <= 2 || arguments[2] === undefined ? this.metaData : arguments[2];

      for (var i = 0, l = this.children.length; i < l; i++) {
        this.children[i].process(time, outFrame, metaData);
      }
    }

    // main function to override, defaults to noop
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      this.time = time;
      this.outFrame = frame;
      this.metaData = metaData;

      this.output();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      // call `destroy` in all it's children
      var index = this.children.length;

      while (index--) {
        this.children[index].destroy();
      }

      // delete itself from the parent node
      if (this.parent) {
        var _index = this.parent.children.indexOf(this);
        this.parent.children.splice(_index, 1);
      }

      // cannot use a dead object as parent
      this.streamParams = null;

      // clean it's own references / disconnect audio nodes if needed
    }
  }]);

  return BaseLfo;
})();

exports['default'] = BaseLfo;
module.exports = exports['default'];

},{"babel-runtime/core-js/object/assign":33,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40}],2:[function(require,module,exports){
/**
 * @fileoverview WAVE LFO module: biquad filter.
 * @author Jean-Philippe.Lambert@ircam.fr, Norbert.Schnell@ircam.fr, victor.saiz@ircam.fr
 * @version 0.1.0
 *
 * @brief  Biquad filter and coefficients calculator
 *
 * Based on the "Cookbook formulae for audio EQ biquad filter
 * coefficients" by Robert Bristow-Johnson
 *
 */

/* y(n) = b0 x(n) + b1 x(n-1) + b2 x(n-2)  */
/*                - a1 x(n-1) - a2 x(n-2)  */

/* f0 is normalised by the nyquist frequency */
/* q must be > 0. */
/* gain must be > 0. and is linear */

/* when there is no gain parameter, one can simply multiply the b
 * coefficients by a (linear) gain */

/* a0 is always 1. as each coefficient is normalised by a0, including a0 */

/* a1 is a[0] and a2 is a[1] */

'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
var BaseLfo = require('../core/base-lfo');

var sin = Math.sin;
var cos = Math.cos;
var M_PI = Math.PI;
var sqrt = Math.sqrt;

// coefs calculations
// ------------------

/* LPF: H(s) = 1 / (s^2 + s/Q + 1) */
function lowpass_coefs(f0, q, coefs) {
  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha);

  coefs.a1 = -2.0 * c * a0_inv;
  coefs.a2 = (1.0 - alpha) * a0_inv;

  coefs.b0 = (1.0 - c) * 0.5 * a0_inv;
  coefs.b1 = (1.0 - c) * a0_inv;
  coefs.b2 = coefs.b0;
}

/* HPF: H(s) = s^2 / (s^2 + s/Q + 1) */
function highpass_coefs(f0, q, coefs) {
  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha);

  coefs.a1 = -2.0 * c * a0_inv;
  coefs.a2 = (1.0 - alpha) * a0_inv;

  coefs.b0 = (1.0 + c) * 0.5 * a0_inv;
  coefs.b1 = (-1.0 - c) * a0_inv;
  coefs.b2 = coefs.b0;
}

/* BPF: H(s) = s / (s^2 + s/Q + 1)  (constant skirt gain, peak gain = Q) */
function bandpass_constant_skirt_coefs(f0, q, coefs) {
  var w0 = M_PI * f0;
  var s = sin(w0);
  var alpha = s / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha);

  coefs.a1 = -2.0 * c * a0_inv;
  coefs.a2 = (1.0 - alpha) * a0_inv;

  coefs.b0 = s * 0.5 * a0_inv;
  coefs.b1 = 0.0;
  coefs.b2 = -coefs.b0;
}

/* BPF: H(s) = (s/Q) / (s^2 + s/Q + 1)      (constant 0 dB peak gain) */
function bandpass_constant_peak_coefs(f0, q, coefs) {
  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha);

  coefs.a1 = -2.0 * c * a0_inv;
  coefs.a2 = (1.0 - alpha) * a0_inv;

  coefs.b0 = alpha * a0_inv;
  coefs.b1 = 0.0;
  coefs.b2 = -coefs.b0;
}

/* notch: H(s) = (s^2 + 1) / (s^2 + s/Q + 1) */
function notch_coefs(f0, q, coefs) {
  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha);

  coefs.a1 = -2.0 * c * a0_inv;
  coefs.a2 = (1.0 - alpha) * a0_inv;

  coefs.b0 = a0_inv;
  coefs.b1 = coefs.a1;
  coefs.b2 = coefs.b0;
}

/* APF: H(s) = (s^2 - s/Q + 1) / (s^2 + s/Q + 1) */
function allpass_coefs(f0, q, coefs) {
  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha);

  coefs.a1 = -2.0 * c * a0_inv;
  coefs.a2 = (1.0 - alpha) * a0_inv;

  coefs.b0 = coefs.a2;
  coefs.b1 = coefs.a1;
  coefs.b2 = 1.0;
}

/* peakingEQ: H(s) = (s^2 + s*(A/Q) + 1) / (s^2 + s/(A*Q) + 1) */
/* A = sqrt( 10^(dBgain/20) ) = 10^(dBgain/40) */
/* gain is linear here */
function peaking_coefs(f0, q, gain, coefs) {
  var g = sqrt(gain);
  var g_inv = 1.0 / g;

  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha * g_inv);

  coefs.a1 = -2.0 * c * a0_inv;
  coefs.a2 = (1.0 - alpha * g_inv) * a0_inv;

  coefs.b0 = (1.0 + alpha * g) * a0_inv;
  coefs.b1 = coefs.a1;
  coefs.b2 = (1.0 - alpha * g) * a0_inv;
}

/* lowShelf: H(s) = A * (s^2 + (sqrt(A)/Q)*s + A)/(A*s^2 + (sqrt(A)/Q)*s + 1) */
/* A = sqrt( 10^(dBgain/20) ) = 10^(dBgain/40) */
/* gain is linear here */
function lowshelf_coefs(f0, q, gain, coefs) {
  var g = sqrt(gain);

  var w0 = M_PI * f0;
  var alpha_2_sqrtg = sin(w0) * sqrt(g) / q;
  var c = cos(w0);

  var a0_inv = 1.0 / (g + 1.0 + (g - 1.0) * c + alpha_2_sqrtg);

  coefs.a1 = -2.0 * (g - 1.0 + (g + 1.0) * c) * a0_inv;
  coefs.a2 = (g + 1.0 + (g - 1.0) * c - alpha_2_sqrtg) * a0_inv;

  coefs.b0 = g * (g + 1.0 - (g - 1.0) * c + alpha_2_sqrtg) * a0_inv;
  coefs.b1 = 2.0 * g * (g - 1.0 - (g + 1.0) * c) * a0_inv;
  coefs.b2 = g * (g + 1.0 - (g - 1.0) * c - alpha_2_sqrtg) * a0_inv;
}

/* highShelf: H(s) = A * (A*s^2 + (sqrt(A)/Q)*s + 1)/(s^2 + (sqrt(A)/Q)*s + A) */
/* A = sqrt( 10^(dBgain/20) ) = 10^(dBgain/40) */
/* gain is linear here */
function highshelf_coefs(f0, q, gain, coefs) {
  var g = sqrt(gain);

  var w0 = M_PI * f0;
  var alpha_2_sqrtg = sin(w0) * sqrt(g) / q;
  var c = cos(w0);

  var a0_inv = 1.0 / (g + 1.0 - (g - 1.0) * c + alpha_2_sqrtg);

  coefs.a1 = 2.0 * (g - 1.0 - (g + 1.0) * c) * a0_inv;
  coefs.a2 = (g + 1.0 - (g - 1.0) * c - alpha_2_sqrtg) * a0_inv;

  coefs.b0 = g * (g + 1.0 + (g - 1.0) * c + alpha_2_sqrtg) * a0_inv;
  coefs.b1 = -2.0 * g * (g - 1.0 + (g + 1.0) * c) * a0_inv;
  coefs.b2 = g * (g + 1.0 + (g - 1.0) * c - alpha_2_sqrtg) * a0_inv;
}

/* helper */
function calculateCoefs(type, f0, q, gain, coefs) {

  switch (type) {
    case 'lowpass':
      lowpass_coefs(f0, q, coefs);
      break;

    case 'highpass':
      highpass_coefs(f0, q, coefs);
      break;

    case 'bandpass_constant_skirt':
      bandpass_constant_skirt_coefs(f0, q, coefs);
      break;

    case 'bandpass_constant_peak':
      bandpass_constant_peak_coefs(f0, q, coefs);
      break;

    case 'notch':
      notch_coefs(f0, q, coefs);
      break;

    case 'allpass':
      allpass_coefs(f0, q, coefs);
      break;

    case 'peaking':
      peaking_coefs(f0, q, gain, coefs);
      break;

    case 'lowshelf':
      lowshelf_coefs(f0, q, gain, coefs);
      break;

    case 'highshelf':
      highshelf_coefs(f0, q, gain, coefs);
      break;
  }

  // apply gain
  switch (type) {
    case 'lowpass':
    case 'highpass':
    case 'bandpass_constant_skirt':
    case 'bandpass_constant_peak':
    case 'notch':
    case 'allpass':
      if (gain != 1.0) {
        coefs.b0 *= gain;
        coefs.b1 *= gain;
        coefs.b2 *= gain;
      }
      break;
    /* gain is already integrated for the following */
    case 'peaking':
    case 'lowshelf':
    case 'highshelf':
      break;
  }
}

/* direct form I */
/* a0 = 1, a1 = a[0], a2 = a[1] */
/* 4 states (in that order): x(n-1), x(n-2), y(n-1), y(n-2)  */
function biquadArrayDf1(coefs, state, inFrame, outFrame, size) {
  for (var i = 0; i < size; i++) {
    var y = coefs.b0 * inFrame[i] + coefs.b1 * state.xn_1[i] + coefs.b2 * state.xn_2[i] - coefs.a1 * state.yn_1[i] - coefs.a2 * state.yn_2[i];

    outFrame[i] = y;

    // update states
    state.xn_2[i] = state.xn_1[i];
    state.xn_1[i] = inFrame[i];

    state.yn_2[i] = state.yn_1[i];
    state.yn_1[i] = y;
  }
}

/* transposed direct form II */
/* a0 = 1, a1 = a[0], a2 = a[1] */
/* 2 states */
function biquadArrayDf2(coefs, state, inFrame, outFrame, size) {
  for (var i = 0; i < size; i++) {
    outFrame[i] = coefs.b0 * inFrame[i] + state.xn_1[i];

    // update states
    state.xn_1[i] = coefs.b1 * inFrame[i] - coefs.a1[i] * outFrame[i] + state.xn_2[i];
    state.xn_2[i] = coefs.b2 * inFrame[i] - coefs.a2[i] * outFrame[i];
  }
}

var Biquad = (function (_BaseLfo) {
  _inherits(Biquad, _BaseLfo);

  function Biquad(options) {
    _classCallCheck(this, Biquad);

    var defaults = {
      filterType: 'lowpass',
      f0: 1.0,
      gain: 1.0,
      q: 1.0
    };

    _get(Object.getPrototypeOf(Biquad.prototype), 'constructor', this).call(this, options, defaults);
    // this.type = 'biquad';

    // from here on options is this.params

    // to implement
    // if(opts.damp) …
    // if(opts.decay) …
    // if(opts.over) …

    // var frameRate = this.streamParams.frameRate;
    // // if no frameRate or framerate is 0 we shall halt!
    // if (!frameRate || frameRate <= 0) {
    //   throw new Error('This Operator requires a frameRate higher than 0.');
    // }

    // var normF0 = this.params.f0 / frameRate,
    //     gain = this.params.gain,
    //     q;

    // if (this.params.q)  { q = this.params.q; }
    // if (this.params.bw) { q = this.params.f0 / this.params.bw; }

    // this.coefs = {
    //   b0: 0,
    //   b1: 0,
    //   b2: 0,
    //   a1: 0,
    //   a2: 0
    // };

    // var frameSize = this.streamParams.frameSize;
    // this.state = {
    //   xn_1: new Float32Array(frameSize),
    //   xn_2: new Float32Array(frameSize),
    //   yn_1: new Float32Array(frameSize),
    //   yn_2: new Float32Array(frameSize)
    // };

    // calculateCoefs(this.params.filterType, normF0, q, gain, this.coefs);
    // this.setupStream();
  }

  _createClass(Biquad, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(Biquad.prototype), 'initialize', this).call(this);

      var frameRate = this.streamParams.frameRate;
      // if no frameRate or framerate is 0 we shall halt!
      if (!frameRate || frameRate <= 0) {
        throw new Error('This Operator requires a frameRate higher than 0.');
      }

      var normF0 = this.params.f0 / frameRate,
          gain = this.params.gain,
          q;

      if (this.params.q) {
        q = this.params.q;
      }
      if (this.params.bw) {
        q = this.params.f0 / this.params.bw;
      }

      this.coefs = {
        b0: 0,
        b1: 0,
        b2: 0,
        a1: 0,
        a2: 0
      };

      var frameSize = this.streamParams.frameSize;
      this.state = {
        xn_1: new Float32Array(frameSize),
        xn_2: new Float32Array(frameSize),
        yn_1: new Float32Array(frameSize),
        yn_2: new Float32Array(frameSize)
      };

      calculateCoefs(this.params.filterType, normF0, q, gain, this.coefs);
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      biquadArrayDf1(this.coefs, this.state, frame, this.outFrame, frame.length);
      // console.log(this.outFrame);
      this.output(time, this.outFrame, metaData);
    }
  }]);

  return Biquad;
})(BaseLfo);

exports['default'] = Biquad;
module.exports = exports['default'];

},{"../core/base-lfo":1,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42}],3:[function(require,module,exports){
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

var _jsfft = require('jsfft');

var _jsfft2 = _interopRequireDefault(_jsfft);

var _jsfftLibComplex_array = require('jsfft/lib/complex_array');

var _jsfftLibComplex_array2 = _interopRequireDefault(_jsfftLibComplex_array);

var _utilsFftWindows = require('../utils/fft-windows');

// const PI   = Math.PI;
// const cos  = Math.cos;
// const sin  = Math.sin;

var _utilsFftWindows2 = _interopRequireDefault(_utilsFftWindows);

var sqrt = Math.sqrt;

var isPowerOfTwo = function isPowerOfTwo(number) {
  while (number % 2 === 0 && number > 1) {
    number = number / 2;
  }

  return number === 1;
};

var Fft = (function (_BaseLfo) {
  _inherits(Fft, _BaseLfo);

  function Fft(options) {
    _classCallCheck(this, Fft);

    var defaults = {
      fftSize: 1024,
      windowName: 'hann',
      outType: 'magnitude'
    };

    _get(Object.getPrototypeOf(Fft.prototype), 'constructor', this).call(this, options, defaults);

    if (!isPowerOfTwo(this.params.fftSize)) {
      throw new Error('fftSize must be a power of two');
    }
  }

  _createClass(Fft, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(Fft.prototype), 'initialize', this).call(this);

      var inFrameSize = this.parent.streamParams.frameSize;
      var fftSize = this.params.fftSize;
      // keep of the window size to be applied
      this.appliedWindowSize = inFrameSize < fftSize ? inFrameSize : fftSize;
      // references to populate in window functions
      this.normalizeCoefs = { linear: 0, power: 0 };
      this.window = new Float32Array(this.appliedWindowSize);
      // init the complex array to reuse for the FFT
      this.complexFrame = new _jsfftLibComplex_array2['default'].ComplexArray(fftSize);

      (0, _utilsFftWindows2['default'])(this.params.windowName, this.window, // buffer to populate with the window
      this.appliedWindowSize, // buffer.length
      this.normalizeCoefs // an object to populate with the normalization coefs
      );

      // ArrayBuffers to reuse in process
      this.windowedFrame = new Float32Array(fftSize);
    }
  }, {
    key: 'configureStream',
    value: function configureStream() {
      this.streamParams.frameSize = this.params.fftSize / 2 + 1;
    }

    /**
     * the first call of this method can be quite long (~4ms),
     * the subsequent ones are faster (~0.5ms) for fftSize = 1024
     */
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var _this = this;

      var inFrameSize = this.parent.streamParams.frameSize;
      var outFrameSize = this.streamParams.frameSize;
      var sampleRate = this.streamParams.sourceSampleRate;
      var fftSize = this.params.fftSize;
      // clip frame if bigger than fftSize
      frame = inFrameSize > fftSize ? frame.subarray(0, fftSize) : frame;

      // apply window on frame
      // => `this.window` and `frame` have the same length
      // => if `this.windowedFrame` is bigger, it's filled with zero
      // and window don't apply there
      for (var i = 0; i < this.appliedWindowSize; i++) {
        this.windowedFrame[i] = frame[i] * this.window[i];
      }

      // FFT
      // this.complexFrame = new complexArray.ComplexArray(fftSize);
      // reuse the same complexFrame
      this.complexFrame.map(function (value, i) {
        value.real = _this.windowedFrame[i];
        value.imag = 0;
      });

      var complexSpectrum = this.complexFrame.FFT();
      var scale = 1 / fftSize;
      // DC index
      var realDc = complexSpectrum.real[0];
      var imagDc = complexSpectrum.imag[0];
      this.outFrame[0] = (realDc * realDc + imagDc * imagDc) * scale;
      // Nquyst index
      var realNy = complexSpectrum.real[fftSize / 2];
      var imagNy = complexSpectrum.imag[fftSize / 2];
      this.outFrame[fftSize / 2] = (realNy * realNy + imagNy * imagNy) * scale;

      // power spectrum
      for (var i = 1, j = fftSize - 1; i < fftSize / 2; i++, j--) {
        var real = complexSpectrum.real[i] + complexSpectrum.real[j];
        var imag = complexSpectrum.imag[i] - complexSpectrum.imag[j];

        this.outFrame[i] = (real * real + imag * imag) * scale;
      }

      // magnitude spectrum
      // @NOTE maybe check how to remove this loop properly
      if (this.params.outType === 'magnitude') {
        for (var i = 0; i < outFrameSize; i++) {
          this.outFrame[i] = sqrt(this.outFrame[i]);
        }
      }

      // @NOTE what shall we do with `this.normalizeCoefs` ?
      // time is centered on the frame ?
      this.time = time + inFrameSize / sampleRate / 2;

      this.output();
    }
  }]);

  return Fft;
})(_coreBaseLfo2['default']);

exports['default'] = Fft;
module.exports = exports['default'];

},{"../core/base-lfo":1,"../utils/fft-windows":30,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43,"jsfft":117,"jsfft/lib/complex_array":116}],4:[function(require,module,exports){
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

var Framer = (function (_BaseLfo) {
  _inherits(Framer, _BaseLfo);

  function Framer(options) {
    _classCallCheck(this, Framer);

    var defaults = {
      frameSize: 512,
      centeredTimeTag: false
    };

    _get(Object.getPrototypeOf(Framer.prototype), 'constructor', this).call(this, options, defaults);

    this.frameIndex = 0;
  }

  _createClass(Framer, [{
    key: 'configureStream',
    value: function configureStream() {
      // defaults to `hopSize` === `frameSize`
      if (!this.params.hopSize) {
        this.params.hopSize = this.params.frameSize;
      }

      this.streamParams.frameSize = this.params.frameSize;
      this.streamParams.frameRate = this.streamParams.sourceSampleRate / this.params.hopSize;
    }

    // @NOTE must be tested
  }, {
    key: 'reset',
    value: function reset() {
      this.frameIndex = 0;
      _get(Object.getPrototypeOf(Framer.prototype), 'reset', this).call(this);
    }
  }, {
    key: 'finalize',
    value: function finalize() {
      // @NOTE what about time ?
      // fill the ongoing buffer with 0
      for (var i = this.frameIndex, l = this.outFrame.length; i < l; i++) {
        this.outFrame[i] = 0;
      }
      // output it
      this.output();

      _get(Object.getPrototypeOf(Framer.prototype), 'finalize', this).call(this);
    }
  }, {
    key: 'process',
    value: function process(time, block, metaData) {
      var sampleRate = this.streamParams.sourceSampleRate;
      var samplePeriod = 1 / sampleRate;

      var frameIndex = this.frameIndex;
      var frameSize = this.streamParams.frameSize;
      var blockSize = block.length;
      var blockIndex = 0;
      var hopSize = this.params.hopSize;

      var outFrame = this.outFrame;

      while (blockIndex < blockSize) {
        var numSkip = 0;

        // skip block samples for negative frameIndex
        if (frameIndex < 0) {
          numSkip = -frameIndex;
        }

        if (numSkip < blockSize) {
          blockIndex += numSkip; // skip block segment
          // can copy all the rest of the incoming block
          var numCopy = blockSize - blockIndex;
          // connot copy more than what fits into the frame
          var maxCopy = frameSize - frameIndex;

          if (numCopy >= maxCopy) {
            numCopy = maxCopy;
          }

          // copy block segment into frame
          var copy = block.subarray(blockIndex, blockIndex + numCopy);
          // console.log(blockIndex, frameIndex, numCopy);
          outFrame.set(copy, frameIndex);

          // advance block and frame index
          blockIndex += numCopy;
          frameIndex += numCopy;

          // send frame when completed
          if (frameIndex === frameSize) {
            // define time tag for the outFrame according to configuration
            if (this.params.centeredTimeTag) {
              this.time = time + (blockIndex - frameSize / 2) * samplePeriod;
            } else {
              this.time = time + (blockIndex - frameSize) * samplePeriod;
            }

            // forward metaData ?
            this.metaData = metaData;

            // forward to next nodes
            this.output();

            // shift frame left
            if (hopSize < frameSize) {
              outFrame.set(outFrame.subarray(hopSize, frameSize), 0);
            }

            frameIndex -= hopSize; // hop forward
          }
        } else {
            // skip entire block
            var blockRest = blockSize - blockIndex;
            frameIndex += blockRest;
            blockIndex += blockRest;
          }
      }

      this.frameIndex = frameIndex;
    }
  }]);

  return Framer;
})(_coreBaseLfo2['default']);

exports['default'] = Framer;
module.exports = exports['default'];

},{"../core/base-lfo":1,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],5:[function(require,module,exports){
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

var Magnitude = (function (_BaseLfo) {
  _inherits(Magnitude, _BaseLfo);

  function Magnitude(options) {
    _classCallCheck(this, Magnitude);

    var defaults = {
      normalize: false
    };

    _get(Object.getPrototypeOf(Magnitude.prototype), 'constructor', this).call(this, options, defaults);
  }

  _createClass(Magnitude, [{
    key: 'configureStream',
    value: function configureStream() {
      this.streamParams.frameSize = 1;
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var frameSize = frame.length;
      var sum = 0;

      for (var i = 0; i < frameSize; i++) {
        sum += frame[i] * frame[i];
      }

      if (this.params.normalize) {
        // sum is a mean here (for rms)
        sum /= frameSize;
      }

      this.time = time;
      this.outFrame[0] = Math.sqrt(sum);
      this.metaData = metaData;

      this.output();
    }
  }]);

  return Magnitude;
})(_coreBaseLfo2['default']);

exports['default'] = Magnitude;
module.exports = exports['default'];

},{"../core/base-lfo":1,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],6:[function(require,module,exports){
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

/**
 * Returns the min and max values from each frame
 */

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var MinMax = (function (_BaseLfo) {
  _inherits(MinMax, _BaseLfo);

  function MinMax(options) {
    _classCallCheck(this, MinMax);

    var defaults = {};
    _get(Object.getPrototypeOf(MinMax.prototype), 'constructor', this).call(this, options, defaults);
  }

  _createClass(MinMax, [{
    key: 'configureStream',
    value: function configureStream() {
      this.streamParams.frameSize = 2;
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var min = +Infinity;
      var max = -Infinity;

      for (var i = 0, l = frame.length; i < l; i++) {
        var value = frame[i];
        if (value < min) {
          min = value;
        }
        if (value > max) {
          max = value;
        }
      }

      this.time = time;
      this.outFrame[0] = min;
      this.outFrame[1] = max;
      this.metaData = metaData;

      this.output();
    }
  }]);

  return MinMax;
})(_coreBaseLfo2['default']);

exports['default'] = MinMax;
module.exports = exports['default'];

},{"../core/base-lfo":1,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],7:[function(require,module,exports){
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

// NOTES:
// - add 'symetrical' option (how to deal with values between frames ?) ?
// - can we improve algorithm implementation ?

var MovingAverage = (function (_BaseLfo) {
  _inherits(MovingAverage, _BaseLfo);

  function MovingAverage(options) {
    _classCallCheck(this, MovingAverage);

    var defaults = {
      order: 10,
      zeroFill: true
    };

    _get(Object.getPrototypeOf(MovingAverage.prototype), 'constructor', this).call(this, options, defaults);

    this.sum = 0;
    this.counter = 0;
    this.queue = new Float32Array(this.params.order);
  }

  // streamParams should stay the same ?

  _createClass(MovingAverage, [{
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(MovingAverage.prototype), 'reset', this).call(this);

      for (var i = 0, l = this.queue.length; i < l; i++) {
        this.queue[i] = 0;
      }

      this.sum = 0;
      this.counter = 0;
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var outFrame = this.outFrame;
      var frameSize = this.streamParams.frameSize;
      var order = this.params.order;
      var pushIndex = this.params.order - 1;
      var zeroFill = this.params.zeroFill;
      var divisor = undefined;

      for (var i = 0; i < frameSize; i++) {
        var current = frame[i];

        this.sum -= this.queue[0];
        this.sum += current;

        if (!zeroFill) {
          if (this.counter < order) {
            this.counter += 1;
            divisor = this.counter;
          } else {
            divisor = order;
          }

          outFrame[i] = this.sum / divisor;
        } else {
          outFrame[i] = this.sum / order;
        }

        // maintain stack
        this.queue.set(this.queue.subarray(1), 0);
        this.queue[pushIndex] = current;
      }

      this.output(time, outFrame, metaData);
    }
  }]);

  return MovingAverage;
})(_coreBaseLfo2['default']);

exports['default'] = MovingAverage;
module.exports = exports['default'];

},{"../core/base-lfo":1,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],8:[function(require,module,exports){
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

    var defaults = {
      order: 9
    };

    _get(Object.getPrototypeOf(MovingMedian.prototype), 'constructor', this).call(this, options, defaults);

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

},{"../core/base-lfo":1,"babel-runtime/core-js/array/from":32,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],9:[function(require,module,exports){
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

/**
 * a NoOp Lfo
 */

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var Noop = (function (_BaseLfo) {
  _inherits(Noop, _BaseLfo);

  function Noop(options) {
    _classCallCheck(this, Noop);

    _get(Object.getPrototypeOf(Noop.prototype), 'constructor', this).call(this, options, {});
  }

  _createClass(Noop, [{
    key: 'process',
    value: function process(time, frame, metaData) {
      this.outFrame.set(frame, 0);
      this.time = time;
      this.metaData = metaData;

      this.output();
    }
  }]);

  return Noop;
})(_coreBaseLfo2['default']);

exports['default'] = Noop;
module.exports = exports['default'];

},{"../core/base-lfo":1,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],10:[function(require,module,exports){
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

/**
 * apply a given function on each frame
 *
 * @SIGNATURE scalar callback
 * function(value, index, frame) {
 *   return doSomething(value)
 * }
 *
 * @SIGNATURE vector callback
 * function(time, inFrame, outFrame) {
 *   outFrame.set(inFrame, 0);
 *   return time + 1;
 * }
 *
 */

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var Operator = (function (_BaseLfo) {
  _inherits(Operator, _BaseLfo);

  function Operator(options) {
    _classCallCheck(this, Operator);

    _get(Object.getPrototypeOf(Operator.prototype), 'constructor', this).call(this, options, {});

    this.params.type = this.params.type || 'scalar';

    if (this.params.onProcess) {
      this.callback = this.params.onProcess.bind(this);
    }
  }

  _createClass(Operator, [{
    key: 'configureStream',
    value: function configureStream() {
      if (this.params.type === 'vector' && this.params.frameSize) {
        this.streamParams.frameSize = this.params.frameSize;
      }
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
})(_coreBaseLfo2['default']);

exports['default'] = Operator;
;
module.exports = exports['default'];

},{"../core/base-lfo":1,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],11:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreBaseLfo = require('../core/base-lfo');

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var worker = '\nvar isInfiniteBuffer = false;\nvar stack = [];\nvar buffer;\nvar bufferLength;\nvar currentIndex;\n\nfunction init() {\n  buffer = new Float32Array(bufferLength);\n  stack.length = 0;\n  currentIndex = 0;\n}\n\nfunction append(block) {\n  var availableSpace = bufferLength - currentIndex;\n  var currentBlock;\n  // return if already full\n  if (availableSpace <= 0) { return; }\n\n  if (availableSpace < block.length) {\n    currentBlock = block.subarray(0, availableSpace);\n  } else {\n    currentBlock = block;\n  }\n\n  buffer.set(currentBlock, currentIndex);\n  currentIndex += currentBlock.length;\n\n  if (isInfiniteBuffer && currentIndex === buffer.length) {\n    stack.push(buffer);\n\n    currentBlock = block.subarray(availableSpace);\n    buffer = new Float32Array(buffer.length);\n    buffer.set(currentBlock, 0);\n    currentIndex = currentBlock.length;\n  }\n}\n\nself.addEventListener(\'message\', function(e) {\n  switch (e.data.command) {\n    case \'init\':\n      if (isFinite(e.data.duration)) {\n        bufferLength = e.data.sampleRate * e.data.duration;\n      } else {\n        isInfiniteBuffer = true;\n        bufferLength = e.data.sampleRate * 10;\n      }\n\n      init();\n      break;\n\n    case \'process\':\n      var block = new Float32Array(e.data.buffer);\n      append(block);\n\n      // if the buffer is full return it, only works with finite buffers\n      if (!isInfiniteBuffer && currentIndex === bufferLength) {\n        var buf = buffer.buffer.slice(0);\n        self.postMessage({ buffer: buf }, [buf]);\n        init();\n      }\n      break;\n\n    case \'finalize\':\n      if (!isInfiniteBuffer) {\n        // @TODO add option to not clip the returned buffer\n        // values in FLoat32Array are 4 bytes long (32 / 8)\n        var copy = buffer.buffer.slice(0, currentIndex * (32 / 8));\n        self.postMessage({ buffer: copy }, [copy]);\n      } else {\n        var copy = new Float32Array(stack.length * bufferLength + currentIndex);\n        stack.forEach(function(buffer, index) {\n          copy.set(buffer, bufferLength * index);\n        });\n\n        copy.set(buffer.subarray(0, currentIndex), stack.length * bufferLength);\n        self.postMessage({ buffer: copy.buffer }, [copy.buffer]);\n      }\n      init();\n      break;\n  }\n}, false)';

var audioContext = undefined;

/**
 * Record an audio stream
 */

var AudioRecorder = (function (_BaseLfo) {
  _inherits(AudioRecorder, _BaseLfo);

  function AudioRecorder(options) {
    _classCallCheck(this, AudioRecorder);

    var defaults = {
      duration: 10 };

    // seconds
    _get(Object.getPrototypeOf(AudioRecorder.prototype), 'constructor', this).call(this, options, defaults);
    this.metaData = {};

    // needed to retrive an AudioBuffer
    if (!this.params.ctx) {
      if (!audioContext) {
        audioContext = new window.AudioContext();
      }
      this.ctx = audioContext;
    } else {
      this.ctx = this.params.ctx;
    }

    var blob = new Blob([worker], { type: 'text/javascript' });
    this.worker = new Worker(window.URL.createObjectURL(blob));
  }

  _createClass(AudioRecorder, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(AudioRecorder.prototype), 'initialize', this).call(this);
      // propagate `streamParams` to the worker
      this.worker.postMessage({
        command: 'init',
        duration: this.params.duration,
        sampleRate: this.streamParams.sourceSampleRate
      });
    }
  }, {
    key: 'start',
    value: function start() {
      this._isStarted = true;
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.finalize();
      this._isStarted = false;
    }

    // called when `stop` is triggered on the source
  }, {
    key: 'finalize',
    value: function finalize() {
      if (!this._isStarted) {
        return;
      } // don't finalize if not started
      this.worker.postMessage({ command: 'finalize' });
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      if (!this._isStarted) {
        return;
      }
      // `this.outFrame` must be recreated each time because
      // it is copied in the worker and lost for this context
      this.outFrame = new Float32Array(frame);

      var buffer = this.outFrame.buffer;
      this.worker.postMessage({ command: 'process', buffer: buffer }, [buffer]);
    }

    /**
     * retrieve the created audioBuffer
     * @return {Promise}
     */
  }, {
    key: 'retrieve',
    value: function retrieve() {
      var _this = this;

      return new _Promise(function (resolve, reject) {
        var callback = function callback(e) {
          // if called when buffer is full, stop the recorder too
          _this._isStarted = false;

          _this.worker.removeEventListener('message', callback, false);
          // create an audio buffer from the data
          var buffer = new Float32Array(e.data.buffer);
          var length = buffer.length;
          var sampleRate = _this.streamParams.sourceSampleRate;

          var audioBuffer = _this.ctx.createBuffer(1, length, sampleRate);
          var audioArrayBuffer = audioBuffer.getChannelData(0);
          audioArrayBuffer.set(buffer, 0);

          resolve(audioBuffer);
        };

        _this.worker.addEventListener('message', callback, false);
      });
    }
  }]);

  return AudioRecorder;
})(_coreBaseLfo2['default']);

exports['default'] = AudioRecorder;
module.exports = exports['default'];

},{"../core/base-lfo":1,"babel-runtime/core-js/promise":38,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],12:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreBaseLfo = require('../core/base-lfo');

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var BaseDraw = (function (_BaseLfo) {
  _inherits(BaseDraw, _BaseLfo);

  function BaseDraw() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var extendDefaults = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, BaseDraw);

    var defaults = _Object$assign({
      duration: 1,
      min: -1,
      max: 1,
      width: 300,
      height: 150, // default canvas size in DOM too
      isSynchronized: false // is set to true if used in a synchronizedSink
    }, extendDefaults);

    _get(Object.getPrototypeOf(BaseDraw.prototype), 'constructor', this).call(this, options, defaults);

    if (!this.params.canvas) {
      throw new Error('params.canvas is mandatory and must be canvas DOM element');
    }

    // prepare canvas
    this.canvas = this.params.canvas;
    this.ctx = this.canvas.getContext('2d');

    this.cachedCanvas = document.createElement('canvas');
    this.cachedCtx = this.cachedCanvas.getContext('2d');

    this.ctx.canvas.width = this.cachedCtx.canvas.width = this.params.width;
    this.ctx.canvas.height = this.cachedCtx.canvas.height = this.params.height;

    this.previousTime = 0;
    this.lastShiftError = 0;
    this.currentPartialShift = 0;

    // this._cache = [];
    // this._rafId;
    // this.draw = this.draw.bind(this);
  }

  // initialize() {
  //   super.initialize();
  //   // this._rafId = requestAnimationFrame(this.draw);
  // }

  // finalize() {
  //   super.finalize();
  //   // cancelAnimationFrame(this._rafId);
  // }

  // draw() {
  //   console.log('draw', this._cache.length);
  //   this._cache.forEach((infos) => {
  //     console.log(infos);
  //     this.scrollModeDraw(infos.time, infos.frame);
  //   });

  //   this._cache.length = 0;
  //   this._rafId = requestAnimationFrame(this.draw);
  // }

  _createClass(BaseDraw, [{
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(BaseDraw.prototype), 'reset', this).call(this);
      this.ctx.clearRect(0, 0, this.params.width, this.params.height);
      this.cachedCtx.clearRect(0, 0, this.params.width, this.params.height);
    }
  }, {
    key: 'setupStream',
    value: function setupStream() {
      _get(Object.getPrototypeOf(BaseDraw.prototype), 'setupStream', this).call(this);
      this.previousFrame = new Float32Array(this.streamParams.frameSize);
    }

    // http://stackoverflow.com/questions/5294955/how-to-scale-down-a-range-of-numbers-with-a-known-min-and-max-value
    //        (b-a)(x - min)
    // f(x) = -------------- + a
    //          max - min
  }, {
    key: 'getYPosition',
    value: function getYPosition(value) {
      // a = height
      // b = 0
      var min = this.params.min;
      var max = this.params.max;
      var height = this.params.height;

      return (0 - height) * (value - min) / (max - min) + height;
    }

    // params modifiers
  }, {
    key: 'process',

    // main process method
    value: function process(time, frame, metaData) {
      _get(Object.getPrototypeOf(BaseDraw.prototype), 'process', this).call(this, time, frame, metaData);
    }

    // default draw mode
  }, {
    key: 'scrollModeDraw',
    value: function scrollModeDraw(time, frame) {
      var width = this.params.width;
      var height = this.params.height;
      var duration = this.params.duration;
      var ctx = this.ctx;

      var dt = time - this.previousTime;
      var fShift = dt / duration * width - this.lastShiftError;
      var iShift = Math.round(fShift);
      this.lastShiftError = iShift - fShift;

      var partialShift = iShift - this.currentPartialShift;
      this.shiftCanvas(partialShift);

      // shift all siblings if synchronized
      if (this.params.isSynchronized && this.synchronizer) {
        this.synchronizer.shiftSiblings(partialShift, this);
      }

      // translate to the current frame and draw a new polygon
      ctx.save();
      ctx.translate(width, 0);
      this.drawCurve(frame, this.previousFrame, iShift);
      ctx.restore();
      // update `currentPartialShift`
      this.currentPartialShift -= iShift;
      // save current state into buffer canvas
      this.cachedCtx.clearRect(0, 0, width, height);
      this.cachedCtx.drawImage(this.canvas, 0, 0, width, height);

      this.previousFrame.set(frame, 0);
      this.previousTime = time;
    }
  }, {
    key: 'shiftCanvas',
    value: function shiftCanvas(shift) {
      var width = this.params.width;
      var height = this.params.height;
      var ctx = this.ctx;

      this.currentPartialShift += shift;

      ctx.clearRect(0, 0, width, height);
      ctx.save();

      ctx.drawImage(this.cachedCanvas, this.currentPartialShift, 0, width - this.currentPartialShift, height, 0, 0, width - this.currentPartialShift, height);

      ctx.restore();
    }

    // Must implement the logic to draw the shape between
    // the previous and the current frame.
    // Assuming the context is centered on the current frame
  }, {
    key: 'drawCurve',
    value: function drawCurve(frame, prevFrame, iShift) {
      console.error('must be implemented');
    }
  }, {
    key: 'duration',
    set: function set(duration) {
      this.params.duration = duration;
    }
  }, {
    key: 'min',
    set: function set(min) {
      this.params.min = min;
    }
  }, {
    key: 'max',
    set: function set(max) {
      this.params.max = max;
    }
  }]);

  return BaseDraw;
})(_coreBaseLfo2['default']);

exports['default'] = BaseDraw;

module.exports = BaseDraw;
module.exports = exports['default'];

},{"../core/base-lfo":1,"babel-runtime/core-js/object/assign":33,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],13:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseDraw = require('./base-draw');

var _baseDraw2 = _interopRequireDefault(_baseDraw);

var _utilsDrawUtils = require('../utils/draw-utils');

var Bpf = (function (_BaseDraw) {
  _inherits(Bpf, _BaseDraw);

  function Bpf(options) {
    _classCallCheck(this, Bpf);

    var defaults = {
      trigger: false,
      radius: 0,
      line: true
    };

    _get(Object.getPrototypeOf(Bpf.prototype), 'constructor', this).call(this, options, defaults);
    // for loop mode
    this.currentXPosition = 0;
  }

  _createClass(Bpf, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(Bpf.prototype), 'initialize', this).call(this);

      // create an array of colors according to the `outFrame` size
      if (!this.params.colors) {
        this.params.colors = [];
        for (var i = 0, l = this.streamParams.frameSize; i < l; i++) {
          this.params.colors.push((0, _utilsDrawUtils.getRandomColor)());
        }
      }
    }

    // allow to witch easily between the 2 modes
  }, {
    key: 'setTrigger',
    value: function setTrigger(bool) {
      this.params.trigger = bool;
      // clear canvas and cache
      this.ctx.clearRect(0, 0, this.params.width, this.params.height);
      this.cachedCtx.clearRect(0, 0, this.params.width, this.params.height);
      // reset currentXPosition
      this.currentXPosition = 0;
      this.lastShiftError = 0;
    }
  }, {
    key: 'process',
    value: function process(time, frame) {
      // @TODO: compare dt - if dt < fps return; (?)
      if (this.params.trigger) {
        this.triggerModeDraw(time, frame);
      } else {
        this.scrollModeDraw(time, frame);
      }

      _get(Object.getPrototypeOf(Bpf.prototype), 'process', this).call(this, time, frame);
    }

    // add an alternative drawing mode
    // draw from left to right, go back to left when > width
  }, {
    key: 'triggerModeDraw',
    value: function triggerModeDraw(time, frame) {
      var width = this.params.width;
      var height = this.params.height;
      var duration = this.params.duration;
      var ctx = this.ctx;

      var dt = time - this.previousTime;
      var fShift = dt / duration * width - this.lastShiftError; // px
      var iShift = Math.round(fShift);
      this.lastShiftError = iShift - fShift;

      this.currentXPosition += iShift;

      // draw the right part
      ctx.save();
      ctx.translate(this.currentXPosition, 0);
      ctx.clearRect(-iShift, 0, iShift, height);
      this.drawCurve(frame, iShift);
      ctx.restore();

      // go back to the left of the canvas and redraw the same thing
      if (this.currentXPosition > width) {
        // go back to start
        this.currentXPosition -= width;

        ctx.save();
        ctx.translate(this.currentXPosition, 0);
        ctx.clearRect(-iShift, 0, iShift, height);
        this.drawCurve(frame, this.previousFrame, iShift);
        ctx.restore();
      }
    }

    // implements drawCurve
  }, {
    key: 'drawCurve',
    value: function drawCurve(frame, prevFrame, iShift) {
      var colors = this.params.colors;
      var ctx = this.ctx;
      var radius = this.params.radius;
      // @TODO this can and should be abstracted
      for (var i = 0, l = frame.length; i < l; i++) {
        ctx.save();
        // color should bechosen according to index
        ctx.fillStyle = colors[i];
        ctx.strokeStyle = colors[i];

        var posY = this.getYPosition(frame[i]);
        // as an options ? radius ?
        if (radius > 0) {
          ctx.beginPath();
          ctx.arc(0, posY, radius, 0, Math.PI * 2, false);
          ctx.fill();
          ctx.closePath();
        }

        if (prevFrame && this.params.line) {
          var lastPosY = this.getYPosition(prevFrame[i]);
          // draw line
          ctx.beginPath();
          ctx.moveTo(-iShift, lastPosY);
          ctx.lineTo(0, posY);
          ctx.stroke();
          ctx.closePath();
        }

        ctx.restore();
      }
    }
  }]);

  return Bpf;
})(_baseDraw2['default']);

exports['default'] = Bpf;
module.exports = exports['default'];

},{"../utils/draw-utils":29,"./base-draw":12,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],14:[function(require,module,exports){
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

/**
 *  accumulate intput and expose it - allow view (see waves-ui) to pull data for rendering
 *  brodge between `push` to `pull` paradigm
 */

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var Bridge = (function (_BaseLfo) {
  _inherits(Bridge, _BaseLfo);

  function Bridge(options, process) {
    _classCallCheck(this, Bridge);

    _get(Object.getPrototypeOf(Bridge.prototype), 'constructor', this).call(this, options, {});

    this.process = process.bind(this);
    this.data = this.outFrame = [];
  }

  _createClass(Bridge, [{
    key: 'setupStream',
    value: function setupStream() {
      _get(Object.getPrototypeOf(Bridge.prototype), 'setupStream', this).call(this);
      this.data.length = 0;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.data.length = 0;
    }
  }]);

  return Bridge;
})(_coreBaseLfo2['default']);

exports['default'] = Bridge;
module.exports = exports['default'];

},{"../core/base-lfo":1,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],15:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreBaseLfo = require('../core/base-lfo');

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var worker = '\nvar _separateArrays = false;\nvar _data = [];\nvar _separateArraysData = { time: [], data: [] };\n\nfunction init() {\n  _data.length = 0;\n  _separateArraysData.time.length = 0;\n  _separateArraysData.data.length = 0;\n}\n\nfunction process(time, data) {\n  if (_separateArrays) {\n    _separateArraysData.time.push(time);\n    _separateArraysData.data.push(data);\n  } else {\n    var datum = { time: time, data: data };\n    _data.push(datum);\n  }\n}\n\nself.addEventListener(\'message\', function(e) {\n  switch (e.data.command) {\n    case \'init\':\n      _separateArrays = e.data.separateArrays;\n      init();\n      break;\n    case \'process\':\n      var time = e.data.time;\n      var data = new Float32Array(e.data.buffer);\n      process(time, data);\n      break;\n    case \'finalize\':\n      var data = _separateArrays ? _separateArraysData : _data;\n      self.postMessage({ data: data });\n      init();\n      break;\n  }\n});\n';

var DataRecorder = (function (_BaseLfo) {
  _inherits(DataRecorder, _BaseLfo);

  function DataRecorder(options) {
    _classCallCheck(this, DataRecorder);

    var defaults = {
      // default format is [{time, data}, {time, data}]
      // if set to `true` format is { time: [...], data: [...] }
      separateArrays: false
    };

    _get(Object.getPrototypeOf(DataRecorder.prototype), 'constructor', this).call(this, options, defaults);
    this._isStarted = false;

    // init worker
    var blob = new Blob([worker], { type: 'text/javascript' });
    this.worker = new Worker(window.URL.createObjectURL(blob));
  }

  _createClass(DataRecorder, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(DataRecorder.prototype), 'initialize', this).call(this);

      this.worker.postMessage({
        command: 'init',
        separateArrays: this.params.separateArrays
      });
    }
  }, {
    key: 'start',
    value: function start() {
      this._isStarted = true;
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.finalize();
      this._isStarted = false;
    }
  }, {
    key: 'finalize',
    value: function finalize() {
      if (!this._isStarted) {
        return;
      }
      this.worker.postMessage({ command: 'finalize' });
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      if (!this._isStarted) {
        return;
      }

      this.outFrame = new Float32Array(frame);
      var buffer = this.outFrame.buffer;

      this.worker.postMessage({
        command: 'process',
        time: time,
        buffer: buffer
      }, [buffer]);
    }
  }, {
    key: 'retrieve',
    value: function retrieve() {
      var _this = this;

      return new _Promise(function (resolve, reject) {
        var callback = function callback(e) {
          _this._started = false;

          _this.worker.removeEventListener('message', callback, false);
          resolve(e.data.data);
        };

        _this.worker.addEventListener('message', callback, false);
      });
    }
  }]);

  return DataRecorder;
})(_coreBaseLfo2['default']);

exports['default'] = DataRecorder;
module.exports = exports['default'];

},{"../core/base-lfo":1,"babel-runtime/core-js/promise":38,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],16:[function(require,module,exports){
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

var _utilsSocketUtils = require('../utils/socket-utils');

// send an Lfo stream from the browser over the network
// through a WebSocket - should be paired with a SocketSourceServer
// @NOTE: does it need to implement some ping process to maintain connection ?

var SocketClient = (function (_BaseLfo) {
  _inherits(SocketClient, _BaseLfo);

  function SocketClient(options) {
    _classCallCheck(this, SocketClient);

    var defaults = {
      port: 3030,
      address: window.location.hostname
    };

    _get(Object.getPrototypeOf(SocketClient.prototype), 'constructor', this).call(this, options, defaults);

    this.socket = null;
    this.initConnection();
  }

  _createClass(SocketClient, [{
    key: 'initConnection',
    value: function initConnection() {
      var _this = this;

      var socketAddr = 'ws://' + this.params.address + ':' + this.params.port;
      this.socket = new WebSocket(socketAddr);
      this.socket.binaryType = 'arraybuffer';

      // callback to start to when WebSocket is connected
      this.socket.onopen = function () {
        _this.params.onopen();
      };

      this.socket.onclose = function () {};

      this.socket.onmessage = function () {};

      this.socket.onerror = function (err) {
        console.error(err);
      };
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var buffer = (0, _utilsSocketUtils.encodeMessage)(time, frame, metaData);
      this.socket.send(buffer);
    }
  }]);

  return SocketClient;
})(_coreBaseLfo2['default']);

exports['default'] = SocketClient;
module.exports = exports['default'];

},{"../core/base-lfo":1,"../utils/socket-utils":31,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],17:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreBaseLfo = require('../core/base-lfo');

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var _ws = require('ws');

var ws = _interopRequireWildcard(_ws);

var _utilsSocketUtils = require('../utils/socket-utils');

var SocketServer = (function (_BaseLfo) {
  _inherits(SocketServer, _BaseLfo);

  function SocketServer(options) {
    _classCallCheck(this, SocketServer);

    var defaults = {
      port: 3031
    };

    _get(Object.getPrototypeOf(SocketServer.prototype), 'constructor', this).call(this, options, defaults);

    this.server = null;
    this.initServer();
  }

  _createClass(SocketServer, [{
    key: 'initServer',
    value: function initServer() {
      this.server = new ws.Server({ port: this.params.port });
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var arrayBuffer = (0, _utilsSocketUtils.encodeMessage)(time, frame, metaData);
      var buffer = (0, _utilsSocketUtils.arrayBufferToBuffer)(arrayBuffer);

      this.server.clients.forEach(function (client) {
        client.send(buffer);
      });
    }
  }]);

  return SocketServer;
})(_coreBaseLfo2['default']);

exports['default'] = SocketServer;
module.exports = exports['default'];

},{"../core/base-lfo":1,"../utils/socket-utils":31,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43,"babel-runtime/helpers/interop-require-wildcard":44,"ws":118}],18:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseDraw = require('./base-draw');

var _baseDraw2 = _interopRequireDefault(_baseDraw);

var _utilsDrawUtils = require('../utils/draw-utils');

var counter = 0;

var Sonogram = (function (_BaseDraw) {
  _inherits(Sonogram, _BaseDraw);

  function Sonogram(options) {
    _classCallCheck(this, Sonogram);

    var defaults = {
      scale: 1
    };

    _get(Object.getPrototypeOf(Sonogram.prototype), 'constructor', this).call(this, options, defaults);
  }

  _createClass(Sonogram, [{
    key: 'process',
    value: function process(time, frame, metaData) {
      this.scrollModeDraw(time, frame);
      _get(Object.getPrototypeOf(Sonogram.prototype), 'process', this).call(this, time, frame, metaData);
    }
  }, {
    key: 'drawCurve',
    value: function drawCurve(frame, previousFrame, iShift) {
      var ctx = this.ctx;
      var height = this.params.height;
      var scale = this.params.scale;
      var binPerPixel = frame.length / this.params.height;

      for (var i = 0; i < height; i++) {
        // interpolate between prev and next bins
        // is not a very good strategy if more than two bins per pixels
        // some values won't be taken into account
        // this hack is not reliable
        // -> could we resample the frame in frequency domain ?
        var fBin = i * binPerPixel;
        var prevBinIndex = Math.floor(fBin);
        var nextBinIndex = Math.ceil(fBin);

        var prevBin = frame[prevBinIndex];
        var nextBin = frame[nextBinIndex];

        var position = fBin - prevBinIndex;
        var slope = nextBin - prevBin;
        var intercept = prevBin;
        var weightedBin = slope * position + intercept;

        var y = this.params.height - i;
        var c = Math.round(weightedBin * scale * 255);

        ctx.fillStyle = 'rgba(' + c + ', ' + c + ', ' + c + ', 1)';
        ctx.fillRect(-iShift, y, iShift, -1);
      }
    }
  }, {
    key: 'scale',
    set: function set(value) {
      this.params.scale = value;
    },
    get: function get() {
      return this.params.scale;
    }
  }]);

  return Sonogram;
})(_baseDraw2['default']);

exports['default'] = Sonogram;
module.exports = exports['default'];

},{"../utils/draw-utils":29,"./base-draw":12,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],19:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseDraw = require('./base-draw');

var _baseDraw2 = _interopRequireDefault(_baseDraw);

var _utilsDrawUtils = require('../utils/draw-utils');

var Spectrogram = (function (_BaseDraw) {
  _inherits(Spectrogram, _BaseDraw);

  function Spectrogram(options) {
    _classCallCheck(this, Spectrogram);

    var defaults = {
      min: 0,
      max: 1,
      scale: 1
    };

    _get(Object.getPrototypeOf(Spectrogram.prototype), 'constructor', this).call(this, options, defaults);
  }

  _createClass(Spectrogram, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(Spectrogram.prototype), 'initialize', this).call(this);

      this._rafFlag = true;
      if (!this.params.color) {
        this.params.color = (0, _utilsDrawUtils.getRandomColor)();
      }
    }
  }, {
    key: 'finalize',
    value: function finalize() {
      _get(Object.getPrototypeOf(Spectrogram.prototype), 'finalize', this).call(this);
      this._rafFlag = false;
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var _this = this;

      if (this._rafFlag) {
        this._rafFlag = false;
        requestAnimationFrame(function () {
          return _this.drawCurve(frame);
        });
      }

      _get(Object.getPrototypeOf(Spectrogram.prototype), 'process', this).call(this, time, frame, metaData);
    }
  }, {
    key: 'drawCurve',
    value: function drawCurve(frame) {
      var nbrBins = frame.length;
      var width = this.params.width;
      var height = this.params.height;
      var binWidth = width / nbrBins;
      var scale = this.params.scale;
      var ctx = this.ctx;

      ctx.fillStyle = this.params.color;
      ctx.clearRect(0, 0, width, height);

      for (var i = 0; i < nbrBins; i++) {
        var x = i / nbrBins * width;
        var y = this.getYPosition(frame[i] * scale);

        ctx.fillRect(x, y, binWidth, height - y);
      }

      this._rafFlag = true;
    }
  }, {
    key: 'scale',
    set: function set(value) {
      this.params.scale = value;
    }
  }]);

  return Spectrogram;
})(_baseDraw2['default']);

exports['default'] = Spectrogram;
module.exports = exports['default'];

},{"../utils/draw-utils":29,"./base-draw":12,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],20:[function(require,module,exports){
/**
 * is used to keep several draw in sync
 * when a view is installed in a synchronized draw
 * the meta view is installed as a member of all it's children
 */
"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SynchronizedDraw = (function () {
  function SynchronizedDraw() {
    _classCallCheck(this, SynchronizedDraw);

    this.views = [];

    for (var _len = arguments.length, views = Array(_len), _key = 0; _key < _len; _key++) {
      views[_key] = arguments[_key];
    }

    this.add.apply(this, views);
  }

  _createClass(SynchronizedDraw, [{
    key: "add",
    value: function add() {
      var _this = this;

      for (var _len2 = arguments.length, views = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        views[_key2] = arguments[_key2];
      }

      views.forEach(function (view) {
        _this.install(view);
      });
    }
  }, {
    key: "install",
    value: function install(view) {
      this.views.push(view);
      view.params.isSynchronized = true;
      view.synchronizer = this;
    }
  }, {
    key: "shiftSiblings",
    value: function shiftSiblings(iShift, view) {
      this.views.forEach(function (child) {
        if (child === view) {
          return;
        }
        child.shiftCanvas(iShift);
      });
    }
  }]);

  return SynchronizedDraw;
})();

exports["default"] = SynchronizedDraw;
module.exports = exports["default"];

},{"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40}],21:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseDraw = require('./base-draw');

var _baseDraw2 = _interopRequireDefault(_baseDraw);

var _utilsDrawUtils = require('../utils/draw-utils');

var Trace = (function (_BaseDraw) {
  _inherits(Trace, _BaseDraw);

  function Trace(options) {
    _classCallCheck(this, Trace);

    var defaults = {
      colorScheme: 'none' // color, opacity
    };

    _get(Object.getPrototypeOf(Trace.prototype), 'constructor', this).call(this, options, defaults);
  }

  _createClass(Trace, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(Trace.prototype), 'initialize', this).call(this);

      if (!this.params.color) {
        this.params.color = (0, _utilsDrawUtils.getRandomColor)();
      }
    }
  }, {
    key: 'process',
    value: function process(time, frame) {
      this.scrollModeDraw(time, frame);
      _get(Object.getPrototypeOf(Trace.prototype), 'process', this).call(this, time, frame);
    }
  }, {
    key: 'drawCurve',
    value: function drawCurve(frame, prevFrame, iShift) {
      var ctx = this.ctx;
      var color = undefined,
          gradient = undefined;

      var halfRange = frame[1] / 2;
      var mean = this.getYPosition(frame[0]);
      var min = this.getYPosition(frame[0] - halfRange);
      var max = this.getYPosition(frame[0] + halfRange);

      var prevHalfRange = undefined;
      var prevMin = undefined;
      var prevMax = undefined;

      if (prevFrame) {
        prevHalfRange = prevFrame[1] / 2;
        prevMin = this.getYPosition(prevFrame[0] - prevHalfRange);
        prevMax = this.getYPosition(prevFrame[0] + prevHalfRange);
      }

      switch (this.params.colorScheme) {
        case 'none':
          ctx.fillStyle = this.params.color;
          break;
        case 'hue':
          gradient = ctx.createLinearGradient(-iShift, 0, 0, 0);

          if (prevFrame) {
            gradient.addColorStop(0, 'hsl(' + (0, _utilsDrawUtils.getHue)(prevFrame[2]) + ', 100%, 50%)');
          } else {
            gradient.addColorStop(0, 'hsl(' + (0, _utilsDrawUtils.getHue)(frame[2]) + ', 100%, 50%)');
          }

          gradient.addColorStop(1, 'hsl(' + (0, _utilsDrawUtils.getHue)(frame[2]) + ', 100%, 50%)');
          ctx.fillStyle = gradient;
          break;
        case 'opacity':
          var rgb = (0, _utilsDrawUtils.hexToRGB)(this.params.color);
          gradient = ctx.createLinearGradient(-iShift, 0, 0, 0);

          if (prevFrame) {
            gradient.addColorStop(0, 'rgba(' + rgb.join(',') + ',' + prevFrame[2] + ')');
          } else {
            gradient.addColorStop(0, 'rgba(' + rgb.join(',') + ',' + frame[2] + ')');
          }

          gradient.addColorStop(1, 'rgba(' + rgb.join(',') + ',' + frame[2] + ')');
          ctx.fillStyle = gradient;
          break;
      }

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, mean);
      ctx.lineTo(0, max);

      if (prevFrame) {
        ctx.lineTo(-iShift, prevMax);
        ctx.lineTo(-iShift, prevMin);
      }

      ctx.lineTo(0, min);
      ctx.closePath();

      ctx.fill();
      ctx.restore();
    }
  }]);

  return Trace;
})(_baseDraw2['default']);

exports['default'] = Trace;
;

module.exports = Trace;
module.exports = exports['default'];

},{"../utils/draw-utils":29,"./base-draw":12,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],22:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseDraw = require('./base-draw');

var _baseDraw2 = _interopRequireDefault(_baseDraw);

var _utilsDrawUtils = require('../utils/draw-utils');

var Waveform = (function (_BaseDraw) {
  _inherits(Waveform, _BaseDraw);

  function Waveform(options) {
    _classCallCheck(this, Waveform);

    var defaults = {};
    _get(Object.getPrototypeOf(Waveform.prototype), 'constructor', this).call(this, options, defaults);
  }

  _createClass(Waveform, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(Waveform.prototype), 'initialize', this).call(this);

      if (!this.params.color) {
        this.params.color = (0, _utilsDrawUtils.getRandomColor)();
      }
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      this.scrollModeDraw(time, frame);
      // this._cache.push({ time, frame });
      _get(Object.getPrototypeOf(Waveform.prototype), 'process', this).call(this, time, frame, metaData);
    }
  }, {
    key: 'drawCurve',
    value: function drawCurve(frame, previousFrame, iShift) {
      var ctx = this.ctx;
      var min = this.getYPosition(frame[0]);
      var max = this.getYPosition(frame[1]);

      ctx.save();

      ctx.fillStyle = this.params.color;
      ctx.beginPath();

      ctx.moveTo(0, this.getYPosition(0));
      ctx.lineTo(0, max);

      if (previousFrame) {
        var prevMin = this.getYPosition(previousFrame[0]);
        var prevMax = this.getYPosition(previousFrame[1]);
        ctx.lineTo(-iShift, prevMax);
        ctx.lineTo(-iShift, prevMin);
      }

      ctx.lineTo(0, min);

      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }]);

  return Waveform;
})(_baseDraw2['default']);

exports['default'] = Waveform;
module.exports = exports['default'];

},{"../utils/draw-utils":29,"./base-draw":12,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],23:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _audioIn = require('./audio-in');

var _audioIn2 = _interopRequireDefault(_audioIn);

var worker = '\nself.addEventListener(\'message\', function process(e) {\n  var blockSize = e.data.options.blockSize;\n  var sampleRate = e.data.options.sampleRate;\n  var buffer = new Float32Array(e.data.buffer);\n\n  var length = buffer.length;\n  // var block = new Float32Array(blockSize);\n\n  for (var index = 0; index < length; index += blockSize) {\n    var copySize = length - index;\n    if (copySize > blockSize) { copySize = blockSize; }\n\n    var block = buffer.subarray(index, index + copySize);\n    block = new Float32Array(block);\n\n    postMessage({ buffer: block.buffer, time: index / sampleRate }, [block.buffer]);\n  }\n}, false)';

/**
 * AudioBuffer as source, sliced it in blocks through a worker
 */

var AudioInBuffer = (function (_AudioIn) {
  _inherits(AudioInBuffer, _AudioIn);

  function AudioInBuffer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, AudioInBuffer);

    _get(Object.getPrototypeOf(AudioInBuffer.prototype), 'constructor', this).call(this, options, {});
    this.metaData = {};

    if (!this.params.src || !(this.params.src instanceof AudioBuffer)) {
      throw new Error('An AudioBuffer source must be given');
    }
  }

  _createClass(AudioInBuffer, [{
    key: 'configureStream',
    value: function configureStream() {
      this.streamParams.frameSize = this.params.frameSize;
      this.streamParams.frameRate = this.params.src.sampleRate / this.params.frameSize;
      this.streamParams.sourceSampleRate = this.params.src.sampleRate;
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(AudioInBuffer.prototype), 'initialize', this).call(this);
      // init worker
      // @NOTE: could be done once in constructor ?
      var blob = new Blob([worker], { type: "text/javascript" });
      this.worker = new Worker(window.URL.createObjectURL(blob));
      this.worker.addEventListener('message', this.process.bind(this), false);
    }
  }, {
    key: 'start',
    value: function start() {
      // propagate to the whole chain
      this.initialize();
      this.reset();

      var buffer = this.src.getChannelData(this.channel).buffer;

      this.worker.postMessage({
        options: {
          sampleRate: this.streamParams.sourceSampleRate,
          blockSize: this.streamParams.frameSize
        },
        buffer: buffer
      }, [buffer]);
    }
  }, {
    key: 'stop',
    value: function stop() {
      // propagate to the whole chain
      this.finalize();
    }

    // callback of the worker
  }, {
    key: 'process',
    value: function process(e) {
      var block = new Float32Array(e.data.buffer);
      this.outFrame.set(block, 0);
      this.time = e.data.time;

      this.output();
    }
  }]);

  return AudioInBuffer;
})(_audioIn2['default']);

exports['default'] = AudioInBuffer;
module.exports = exports['default'];

},{"./audio-in":25,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],24:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _audioIn = require('./audio-in');

/**
 *  Use a WebAudio node as a source
 */

var _audioIn2 = _interopRequireDefault(_audioIn);

var AudioInNode = (function (_AudioIn) {
  _inherits(AudioInNode, _AudioIn);

  function AudioInNode() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, AudioInNode);

    var defaults = {
      timeType: 'absolute'
    };

    _get(Object.getPrototypeOf(AudioInNode.prototype), 'constructor', this).call(this, options);

    this.metaData = {};
  }

  _createClass(AudioInNode, [{
    key: 'configureStream',
    value: function configureStream() {
      this.streamParams.frameSize = this.params.frameSize;
      this.streamParams.frameRate = this.ctx.sampleRate / this.params.frameSize;
      this.streamParams.sourceSampleRate = this.ctx.sampleRate;
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(AudioInNode.prototype), 'initialize', this).call(this);

      var blockSize = this.streamParams.frameSize;
      this.scriptProcessor = this.ctx.createScriptProcessor(blockSize, 1, 1);
      // prepare audio graph
      this.scriptProcessor.onaudioprocess = this.process.bind(this);
      this.src.connect(this.scriptProcessor);
    }

    // connect the audio nodes to start streaming
  }, {
    key: 'start',
    value: function start() {
      if (this.params.timeType === 'relative') {
        this.time = 0;
      }

      this.initialize();
      this.reset();
      // start "the patch" ;)
      this.scriptProcessor.connect(this.ctx.destination);
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.finalize();
      this.scriptProcessor.disconnect();
    }

    // is basically the `scriptProcessor.onaudioprocess` callback
  }, {
    key: 'process',
    value: function process(e) {
      var block = e.inputBuffer.getChannelData(this.params.channel);

      this.time += block.length / this.streamParams.sourceSampleRate;
      this.outFrame.set(block, 0);
      this.output();
    }
  }]);

  return AudioInNode;
})(_audioIn2['default']);

exports['default'] = AudioInNode;
module.exports = exports['default'];

},{"./audio-in":25,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],25:[function(require,module,exports){
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

var audioContext = undefined; // for lazy audioContext creation

var AudioIn = (function (_BaseLfo) {
  _inherits(AudioIn, _BaseLfo);

  function AudioIn() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, AudioIn);

    // defaults
    var defaults = {
      frameSize: 512,
      channel: 0
    };

    _get(Object.getPrototypeOf(AudioIn.prototype), 'constructor', this).call(this, options, defaults);

    // private
    if (!this.params.ctx) {
      if (!audioContext) {
        audioContext = new window.AudioContext();
      }

      this.ctx = audioContext;
    } else {
      this.ctx = this.params.ctx;
    }

    this.src = this.params.src;
    this.time = 0;
    this.metaData = {};
  }

  _createClass(AudioIn, [{
    key: 'start',
    value: function start() {}
  }, {
    key: 'stop',
    value: function stop() {}
  }]);

  return AudioIn;
})(_coreBaseLfo2['default']);

exports['default'] = AudioIn;

module.exports = AudioIn;
module.exports = exports['default'];

},{"../core/base-lfo":1,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],26:[function(require,module,exports){
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

/*
  can forward
    - relativeTime (according to it's start() method)
    - absoluteTime (audioContex time)
    - input time

  methods
    - `start()` -> call `reset()`
    - `stop()`  -> call `finalize()`
*/

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var EventIn = (function (_BaseLfo) {
  _inherits(EventIn, _BaseLfo);

  function EventIn(options) {
    _classCallCheck(this, EventIn);

    var defaults = {
      timeType: 'absolute'
    };
    // cannot have previous
    _get(Object.getPrototypeOf(EventIn.prototype), 'constructor', this).call(this, options, defaults);

    // test AudioContext for use in node environment
    if (!this.params.ctx && typeof process === 'undefined') {
      this.params.ctx = new AudioContext();
    }

    this._isStarted = false;
    this._startTime = undefined;
  }

  _createClass(EventIn, [{
    key: 'configureStream',
    value: function configureStream() {
      // throw error if some values are undefined ?
      this.streamParams.frameSize = this.params.frameSize;
      this.streamParams.frameRate = this.params.frameRate;
      // @NOTE what does make sens in this case ?
      // this.streamParams.sourceSampleRate = this.params.frameSize * this.params.frameRate;
      this.streamParams.sourceSampleRate = this.params.sourceSampleRate || this.params.frameRate;
    }
  }, {
    key: 'start',
    value: function start() {
      // should be setted in the first process call
      this._isStarted = true;
      this._startTime = undefined;

      this.initialize();
      this.reset();
    }
  }, {
    key: 'stop',
    value: function stop() {
      this._isStarted = false;
      this._startTime = undefined;
      this.finalize();
    }
  }, {
    key: 'process',
    value: function process(time, frame) {
      var metaData = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      if (!this._isStarted) {
        return;
      }
      // à revoir
      // if no time provided, use audioContext.currentTime
      var frameTime = !isNaN(parseFloat(time)) && isFinite(time) ? time : this.params.ctx.currentTime;

      // set `startTime` if first call after a `start`
      if (!this._startTime) {
        this._startTime = frameTime;
      }

      // handle time according to config
      if (this.params.timeType === 'relative') {
        frameTime = time - this._startTime;
      }

      // if scalar, create a vector
      if (frame.length === undefined) {
        frame = [frame];
      }
      // works if frame is an array
      this.outFrame.set(frame, 0);
      this.time = frameTime;
      this.metaData = metaData;

      this.output();
    }
  }]);

  return EventIn;
})(_coreBaseLfo2['default']);

exports['default'] = EventIn;

module.exports = EventIn;
module.exports = exports['default'];

},{"../core/base-lfo":1,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],27:[function(require,module,exports){
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

var _utilsSocketUtils = require('../utils/socket-utils');

// @TODO: handle `start` and `stop`

var SocketClient = (function (_BaseLfo) {
  _inherits(SocketClient, _BaseLfo);

  function SocketClient(options) {
    _classCallCheck(this, SocketClient);

    var defaults = {
      port: 3031,
      address: window.location.hostname
    };

    _get(Object.getPrototypeOf(SocketClient.prototype), 'constructor', this).call(this, options, defaults);

    this.socket = null;
    this.initConnection();
  }

  _createClass(SocketClient, [{
    key: 'start',
    value: function start() {
      this.initialize();
      this.reset();
    }
  }, {
    key: 'configureStream',
    value: function configureStream() {
      this.streamParams.frameSize = this.params.frameSize;
      this.streamParams.frameRate = this.params.frameRate;
    }
  }, {
    key: 'initConnection',
    value: function initConnection() {
      var _this = this;

      var socketAddr = 'ws://' + this.params.address + ':' + this.params.port;
      this.socket = new WebSocket(socketAddr);
      this.socket.binaryType = 'arraybuffer';

      // callback to start to when WebSocket is connected
      this.socket.onopen = function () {
        _this.start();
      };

      this.socket.onclose = function () {};

      this.socket.onmessage = function (message) {
        _this.process(message.data);
      };

      this.socket.onerror = function (err) {
        console.error(err);
      };
    }
  }, {
    key: 'process',
    value: function process(buffer) {
      var message = (0, _utilsSocketUtils.decodeMessage)(buffer);

      this.time = message.time;
      this.outFrame = message.frame;
      this.metaData = message.metaData;

      this.output();
    }
  }]);

  return SocketClient;
})(_coreBaseLfo2['default']);

exports['default'] = SocketClient;
module.exports = exports['default'];

},{"../core/base-lfo":1,"../utils/socket-utils":31,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43}],28:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreBaseLfo = require('../core/base-lfo');

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var _ws = require('ws');

var ws = _interopRequireWildcard(_ws);

var _utilsSocketUtils = require('../utils/socket-utils');

// @TODO: handle `start` and `stop`

var SocketServer = (function (_BaseLfo) {
  _inherits(SocketServer, _BaseLfo);

  function SocketServer(options) {
    _classCallCheck(this, SocketServer);

    var defaults = {
      port: 3030
    };

    _get(Object.getPrototypeOf(SocketServer.prototype), 'constructor', this).call(this, options, defaults);

    // @TODO handle disconnect and so on...
    this.clients = [];
    this.server = null;
    this.initServer();

    // @FIXME - right place ?
    this.start();
  }

  _createClass(SocketServer, [{
    key: 'start',
    value: function start() {
      this.initialize();
      this.reset();
    }
  }, {
    key: 'initServer',
    value: function initServer() {
      var _this = this;

      this.server = new ws.Server({ port: this.params.port });

      this.server.on('connection', function (socket) {
        // this.clients.push(socket);
        socket.on('message', _this.process.bind(_this));
      });
    }
  }, {
    key: 'process',
    value: function process(buffer) {
      var arrayBuffer = (0, _utilsSocketUtils.bufferToArrayBuffer)(buffer);
      var message = (0, _utilsSocketUtils.decodeMessage)(arrayBuffer);

      this.time = message.time;
      this.outFrame = message.frame;
      this.metaData = message.metaData;

      this.output();
    }
  }]);

  return SocketServer;
})(_coreBaseLfo2['default']);

exports['default'] = SocketServer;
module.exports = exports['default'];

},{"../core/base-lfo":1,"../utils/socket-utils":31,"babel-runtime/helpers/class-call-check":39,"babel-runtime/helpers/create-class":40,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/interop-require-default":43,"babel-runtime/helpers/interop-require-wildcard":44,"ws":118}],29:[function(require,module,exports){
// http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var getRandomColor = function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// scale from domain [0, 1] to range [270, 0] to consume in
// hsl(x, 100%, 50%) color scheme
var getHue = function getHue(x) {
  var domainMin = 0;
  var domainMax = 1;
  var rangeMin = 270;
  var rangeMax = 0;

  return (rangeMax - rangeMin) * (x - domainMin) / (domainMax - domainMin) + rangeMin;
};

var hexToRGB = function hexToRGB(hex) {
  hex = hex.substring(1, 7);
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b];
};

exports['default'] = { getRandomColor: getRandomColor, getHue: getHue, hexToRGB: hexToRGB };
module.exports = exports['default'];

},{}],30:[function(require,module,exports){

// shortcuts / helpers
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var PI = Math.PI;
var cos = Math.cos;
var sin = Math.sin;
var sqrt = Math.sqrt;

// window creation functions
function initHannWindow(buffer, size, normCoefs) {
  var linSum = 0;
  var powSum = 0;
  var step = 2 * PI / size;

  for (var i = 0; i < size; i++) {
    var phi = i * step;
    var value = 0.5 - 0.5 * cos(phi);

    buffer[i] = value;

    linSum += value;
    powSum += value * value;
  }

  normCoefs.linear = size / linSum;
  normCoefs.power = sqrt(size / powSum);
}

function initHammingWindow(buffer, size, normCoefs) {
  var linSum = 0;
  var powSum = 0;
  var step = 2 * PI / size;

  for (var i = 0; i < size; i++) {
    var phi = i * step;
    var value = 0.54 - 0.46 * cos(phi);

    buffer[i] = value;

    linSum += value;
    powSum += value * value;
  }

  normCoefs.linear = size / linSum;
  normCoefs.power = sqrt(size / powSum);
}

function initBlackmanWindow(buffer, size, normCoefs) {
  var linSum = 0;
  var powSum = 0;
  var step = 2 * PI / size;

  for (var i = 0; i < size; i++) {
    var phi = i * step;
    var value = 0.42 - 0.5 * cos(phi) + 0.08 * cos(2 * phi);

    buffer[i] = value;

    linSum += value;
    powSum += value * value;
  }

  normCoefs.linear = size / linSum;
  normCoefs.power = sqrt(size / powSum);
}

function initBlackmanHarrisWindow(buffer, size, normCoefs) {
  var linSum = 0;
  var powSum = 0;
  var a0 = 0.35875;
  var a1 = 0.48829;
  var a2 = 0.14128;
  var a3 = 0.01168;
  var step = 2 * PI / size;

  for (var i = 0; i < size; i++) {
    var phi = i * step;
    var value = a0 - a1 * cos(phi) + a2 * cos(2 * phi);-a3 * cos(3 * phi);

    buffer[i] = value;

    linSum += value;
    powSum += value * value;
  }

  normCoefs.linear = size / linSum;
  normCoefs.power = sqrt(size / powSum);
}

function initSineWindow(buffer, size, normCoefs) {
  var linSum = 0;
  var powSum = 0;
  var step = PI / size;

  for (var i = 0; i < size; i++) {
    var phi = i * step;
    var value = sin(phi);

    buffer[i] = value;

    linSum += value;
    powSum += value * value;
  }

  normCoefs.linear = size / linSum;
  normCoefs.power = sqrt(size / powSum);
}

function initRectangleWindow(buffer, size, normCoefs) {
  // @TODO normCoefs
  for (var i = 0; i < size; i++) {
    buffer[i] = 1;
  }
}

exports['default'] = (function () {
  // @NOTE implement some caching system (is this really usefull ?)
  var cache = {};

  return function (name, buffer, size, normCoefs) {
    name = name.toLowerCase();

    switch (name) {
      case 'hann':
      case 'hanning':
        initHannWindow(buffer, size, normCoefs);
        break;
      case 'hamming':
        initHammingWindow(buffer, size, normCoefs);
        break;
      case 'blackman':
        initBlackmanWindow(buffer, size, normCoefs);
        break;
      case 'blackmanharris':
        initBlackmanHarrisWindow(buffer, size, normCoefs);
        break;
      case 'sine':
        initSineWindow(buffer, size, normCoefs);
        break;
      case 'rectangle':
        initRectangleWindow(buffer, size, normCoefs);
        break;
    }
  };
})();

module.exports = exports['default'];

},{}],31:[function(require,module,exports){
(function (Buffer){
"use strict";

// http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
function Uint16Array2str(buf) {
  return String.fromCharCode.apply(null, buf);
}

function str2Uint16Array(str) {
  var buffer = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufferView = new Uint16Array(buffer);

  for (var i = 0, l = str.length; i < l; i++) {
    bufferView[i] = str.charCodeAt(i);
  }
  return bufferView;
}

//http://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer
// converts a nodejs Buffer to ArrayBuffer
module.exports.bufferToArrayBuffer = function (buffer) {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
};

module.exports.arrayBufferToBuffer = function (arrayBuffer) {
  var buffer = new Buffer(arrayBuffer.byteLength);
  var view = new Uint8Array(arrayBuffer);
  for (var i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
};

// @TODO `encodeMessage` and `decodeMessage` could probably use DataView to parse the buffer

// concat the lfo stream, time and metaData into a single buffer
// the concatenation is done as follow :
//  * time          => 8 bytes
//  * frame.length  => 2 bytes
//  * frame         => 4 * frameLength bytes
//  * metaData      => rest of the message
// @return  ArrayBuffer of the created message
// @note    must create a new buffer each time because metaData length is not known
module.exports.encodeMessage = function (time, frame, metaData) {
  // should probably use use DataView instead
  // http://www.html5rocks.com/en/tutorials/webgl/typed_arrays/
  var time64 = new Float64Array(1);
  time64[0] = time;
  var time16 = new Uint16Array(time64.buffer);

  var length16 = new Uint16Array(1);
  length16[0] = frame.length;

  var frame16 = new Uint16Array(frame.buffer);

  var metaData16 = str2Uint16Array(JSON.stringify(metaData));

  var bufferLength = time16.length + length16.length + frame16.length + metaData16.length;

  var buffer = new Uint16Array(bufferLength);

  // buffer is the concatenation of time, frameLength, frame, metaData
  buffer.set(time16, 0);
  buffer.set(length16, time16.length);
  buffer.set(frame16, time16.length + length16.length);
  buffer.set(metaData16, time16.length + length16.length + frame16.length);

  return buffer.buffer;
};

// recreate the Lfo stream (time, frame, metaData) form a buffer
// created with `encodeMessage`
module.exports.decodeMessage = function (buffer) {
  // time is a float64Array of size 1 (8 bytes)
  var timeArray = new Float64Array(buffer.slice(0, 8));
  var time = timeArray[0];

  // frame length is encoded in 2 bytes
  var frameLengthArray = new Uint16Array(buffer.slice(8, 10));
  var frameLength = frameLengthArray[0];

  // frame is a float32Array (4 bytes) * frameLength
  var frameByteLength = 4 * frameLength;
  var frame = new Float32Array(buffer.slice(10, 10 + frameByteLength));

  // metaData is the rest of the buffer
  var metaDataArray = new Uint16Array(buffer.slice(10 + frameByteLength));
  // JSON.parse here crashes node because of this character : `\u0000` (null in unicode) ??
  var metaData = Uint16Array2str(metaDataArray);
  metaData = JSON.parse(metaData.replace(/\u0000/g, ""));

  return { time: time, frame: frame, metaData: metaData };
};

}).call(this,require("buffer").Buffer)

},{"buffer":112}],32:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":45}],33:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":46}],34:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":47}],35:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":48}],36:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":49}],37:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":50}],38:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/promise"), __esModule: true };
},{"core-js/library/fn/promise":51}],39:[function(require,module,exports){
"use strict";

exports["default"] = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

exports.__esModule = true;
},{}],40:[function(require,module,exports){
"use strict";

var _Object$defineProperty = require("babel-runtime/core-js/object/define-property")["default"];

exports["default"] = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;

      _Object$defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

exports.__esModule = true;
},{"babel-runtime/core-js/object/define-property":35}],41:[function(require,module,exports){
"use strict";

var _Object$getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor")["default"];

exports["default"] = function get(_x, _x2, _x3) {
  var _again = true;

  _function: while (_again) {
    var object = _x,
        property = _x2,
        receiver = _x3;
    _again = false;
    if (object === null) object = Function.prototype;

    var desc = _Object$getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        _x = parent;
        _x2 = property;
        _x3 = receiver;
        _again = true;
        desc = parent = undefined;
        continue _function;
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  }
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/get-own-property-descriptor":36}],42:[function(require,module,exports){
"use strict";

var _Object$create = require("babel-runtime/core-js/object/create")["default"];

var _Object$setPrototypeOf = require("babel-runtime/core-js/object/set-prototype-of")["default"];

exports["default"] = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = _Object$create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/create":34,"babel-runtime/core-js/object/set-prototype-of":37}],43:[function(require,module,exports){
"use strict";

exports["default"] = function (obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
};

exports.__esModule = true;
},{}],44:[function(require,module,exports){
"use strict";

exports["default"] = function (obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
};

exports.__esModule = true;
},{}],45:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/$.core').Array.from;
},{"../../modules/$.core":57,"../../modules/es6.array.from":103,"../../modules/es6.string.iterator":110}],46:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/$.core').Object.assign;
},{"../../modules/$.core":57,"../../modules/es6.object.assign":105}],47:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function create(P, D){
  return $.create(P, D);
};
},{"../../modules/$":79}],48:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};
},{"../../modules/$":79}],49:[function(require,module,exports){
var $ = require('../../modules/$');
require('../../modules/es6.object.get-own-property-descriptor');
module.exports = function getOwnPropertyDescriptor(it, key){
  return $.getDesc(it, key);
};
},{"../../modules/$":79,"../../modules/es6.object.get-own-property-descriptor":106}],50:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/$.core').Object.setPrototypeOf;
},{"../../modules/$.core":57,"../../modules/es6.object.set-prototype-of":107}],51:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.promise');
module.exports = require('../modules/$.core').Promise;
},{"../modules/$.core":57,"../modules/es6.object.to-string":108,"../modules/es6.promise":109,"../modules/es6.string.iterator":110,"../modules/web.dom.iterable":111}],52:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],53:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],54:[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":72}],55:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./$.cof')
  , TAG = require('./$.wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./$.cof":56,"./$.wks":101}],56:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],57:[function(require,module,exports){
var core = module.exports = {version: '1.2.6'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],58:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./$.a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./$.a-function":52}],59:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],60:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":63}],61:[function(require,module,exports){
var isObject = require('./$.is-object')
  , document = require('./$.global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$.global":65,"./$.is-object":72}],62:[function(require,module,exports){
var global    = require('./$.global')
  , core      = require('./$.core')
  , ctx       = require('./$.ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
// type bitmap
$export.F = 1;  // forced
$export.G = 2;  // global
$export.S = 4;  // static
$export.P = 8;  // proto
$export.B = 16; // bind
$export.W = 32; // wrap
module.exports = $export;
},{"./$.core":57,"./$.ctx":58,"./$.global":65}],63:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],64:[function(require,module,exports){
var ctx         = require('./$.ctx')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , anObject    = require('./$.an-object')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"./$.an-object":54,"./$.ctx":58,"./$.is-array-iter":71,"./$.iter-call":73,"./$.to-length":98,"./core.get-iterator-method":102}],65:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],66:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],67:[function(require,module,exports){
var $          = require('./$')
  , createDesc = require('./$.property-desc');
module.exports = require('./$.descriptors') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":79,"./$.descriptors":60,"./$.property-desc":84}],68:[function(require,module,exports){
module.exports = require('./$.global').document && document.documentElement;
},{"./$.global":65}],69:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],70:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":56}],71:[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./$.iterators')
  , ITERATOR   = require('./$.wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./$.iterators":78,"./$.wks":101}],72:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],73:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./$.an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./$.an-object":54}],74:[function(require,module,exports){
'use strict';
var $              = require('./$')
  , descriptor     = require('./$.property-desc')
  , setToStringTag = require('./$.set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./$.hide')(IteratorPrototype, require('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./$":79,"./$.hide":67,"./$.property-desc":84,"./$.set-to-string-tag":90,"./$.wks":101}],75:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./$.library')
  , $export        = require('./$.export')
  , redefine       = require('./$.redefine')
  , hide           = require('./$.hide')
  , has            = require('./$.has')
  , Iterators      = require('./$.iterators')
  , $iterCreate    = require('./$.iter-create')
  , setToStringTag = require('./$.set-to-string-tag')
  , getProto       = require('./$').getProto
  , ITERATOR       = require('./$.wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , methods, key;
  // Fix native
  if($native){
    var IteratorPrototype = getProto($default.call(new Base));
    // Set @@toStringTag to native iterators
    setToStringTag(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    // fix Array#{values, @@iterator}.name in V8 / FF
    if(DEF_VALUES && $native.name !== VALUES){
      VALUES_BUG = true;
      $default = function values(){ return $native.call(this); };
    }
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES  ? $default : getMethod(VALUES),
      keys:    IS_SET      ? $default : getMethod(KEYS),
      entries: !DEF_VALUES ? $default : getMethod('entries')
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./$":79,"./$.export":62,"./$.has":66,"./$.hide":67,"./$.iter-create":74,"./$.iterators":78,"./$.library":80,"./$.redefine":86,"./$.set-to-string-tag":90,"./$.wks":101}],76:[function(require,module,exports){
var ITERATOR     = require('./$.wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./$.wks":101}],77:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],78:[function(require,module,exports){
module.exports = {};
},{}],79:[function(require,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],80:[function(require,module,exports){
module.exports = true;
},{}],81:[function(require,module,exports){
var global    = require('./$.global')
  , macrotask = require('./$.task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = require('./$.cof')(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, domain, fn;
  if(isNode && (parent = process.domain)){
    process.domain = null;
    parent.exit();
  }
  while(head){
    domain = head.domain;
    fn     = head.fn;
    if(domain)domain.enter();
    fn(); // <- currently we use it only for Promise - try / catch not required
    if(domain)domain.exit();
    head = head.next;
  } last = undefined;
  if(parent)parent.enter();
};

// Node.js
if(isNode){
  notify = function(){
    process.nextTick(flush);
  };
// browsers with MutationObserver
} else if(Observer){
  var toggle = 1
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = -toggle;
  };
// environments with maybe non-completely correct, but existent Promise
} else if(Promise && Promise.resolve){
  notify = function(){
    Promise.resolve().then(flush);
  };
// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
} else {
  notify = function(){
    // strange IE + webpack dev server bug - use .call(global)
    macrotask.call(global, flush);
  };
}

module.exports = function asap(fn){
  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};
},{"./$.cof":56,"./$.global":65,"./$.task":95}],82:[function(require,module,exports){
// 19.1.2.1 Object.assign(target, source, ...)
var $        = require('./$')
  , toObject = require('./$.to-object')
  , IObject  = require('./$.iobject');

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = require('./$.fails')(function(){
  var a = Object.assign
    , A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , $$    = arguments
    , $$len = $$.length
    , index = 1
    , getKeys    = $.getKeys
    , getSymbols = $.getSymbols
    , isEnum     = $.isEnum;
  while($$len > index){
    var S      = IObject($$[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  }
  return T;
} : Object.assign;
},{"./$":79,"./$.fails":63,"./$.iobject":70,"./$.to-object":99}],83:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./$.export')
  , core    = require('./$.core')
  , fails   = require('./$.fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":57,"./$.export":62,"./$.fails":63}],84:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],85:[function(require,module,exports){
var redefine = require('./$.redefine');
module.exports = function(target, src){
  for(var key in src)redefine(target, key, src[key]);
  return target;
};
},{"./$.redefine":86}],86:[function(require,module,exports){
module.exports = require('./$.hide');
},{"./$.hide":67}],87:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],88:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = require('./$').getDesc
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./$":79,"./$.an-object":54,"./$.ctx":58,"./$.is-object":72}],89:[function(require,module,exports){
'use strict';
var core        = require('./$.core')
  , $           = require('./$')
  , DESCRIPTORS = require('./$.descriptors')
  , SPECIES     = require('./$.wks')('species');

module.exports = function(KEY){
  var C = core[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./$":79,"./$.core":57,"./$.descriptors":60,"./$.wks":101}],90:[function(require,module,exports){
var def = require('./$').setDesc
  , has = require('./$.has')
  , TAG = require('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./$":79,"./$.has":66,"./$.wks":101}],91:[function(require,module,exports){
var global = require('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":65}],92:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = require('./$.an-object')
  , aFunction = require('./$.a-function')
  , SPECIES   = require('./$.wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./$.a-function":52,"./$.an-object":54,"./$.wks":101}],93:[function(require,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],94:[function(require,module,exports){
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$.defined":59,"./$.to-integer":96}],95:[function(require,module,exports){
var ctx                = require('./$.ctx')
  , invoke             = require('./$.invoke')
  , html               = require('./$.html')
  , cel                = require('./$.dom-create')
  , global             = require('./$.global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listner = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./$.cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listner, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./$.cof":56,"./$.ctx":58,"./$.dom-create":61,"./$.global":65,"./$.html":68,"./$.invoke":69}],96:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],97:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./$.iobject')
  , defined = require('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":59,"./$.iobject":70}],98:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./$.to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./$.to-integer":96}],99:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./$.defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./$.defined":59}],100:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],101:[function(require,module,exports){
var store  = require('./$.shared')('wks')
  , uid    = require('./$.uid')
  , Symbol = require('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
};
},{"./$.global":65,"./$.shared":91,"./$.uid":100}],102:[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./$.classof":55,"./$.core":57,"./$.iterators":78,"./$.wks":101}],103:[function(require,module,exports){
'use strict';
var ctx         = require('./$.ctx')
  , $export     = require('./$.export')
  , toObject    = require('./$.to-object')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
$export($export.S + $export.F * !require('./$.iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , $$      = arguments
      , $$len   = $$.length
      , mapfn   = $$len > 1 ? $$[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        result[index] = mapping ? mapfn(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});

},{"./$.ctx":58,"./$.export":62,"./$.is-array-iter":71,"./$.iter-call":73,"./$.iter-detect":76,"./$.to-length":98,"./$.to-object":99,"./core.get-iterator-method":102}],104:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./$.add-to-unscopables')
  , step             = require('./$.iter-step')
  , Iterators        = require('./$.iterators')
  , toIObject        = require('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./$.iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./$.add-to-unscopables":53,"./$.iter-define":75,"./$.iter-step":77,"./$.iterators":78,"./$.to-iobject":97}],105:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./$.export');

$export($export.S + $export.F, 'Object', {assign: require('./$.object-assign')});
},{"./$.export":62,"./$.object-assign":82}],106:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./$.to-iobject');

require('./$.object-sap')('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./$.object-sap":83,"./$.to-iobject":97}],107:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./$.export');
$export($export.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.export":62,"./$.set-proto":88}],108:[function(require,module,exports){

},{}],109:[function(require,module,exports){
'use strict';
var $          = require('./$')
  , LIBRARY    = require('./$.library')
  , global     = require('./$.global')
  , ctx        = require('./$.ctx')
  , classof    = require('./$.classof')
  , $export    = require('./$.export')
  , isObject   = require('./$.is-object')
  , anObject   = require('./$.an-object')
  , aFunction  = require('./$.a-function')
  , strictNew  = require('./$.strict-new')
  , forOf      = require('./$.for-of')
  , setProto   = require('./$.set-proto').set
  , same       = require('./$.same-value')
  , SPECIES    = require('./$.wks')('species')
  , speciesConstructor = require('./$.species-constructor')
  , asap       = require('./$.microtask')
  , PROMISE    = 'Promise'
  , process    = global.process
  , isNode     = classof(process) == 'process'
  , P          = global[PROMISE]
  , Wrapper;

var testResolve = function(sub){
  var test = new P(function(){});
  if(sub)test.constructor = Object;
  return P.resolve(test) === test;
};

var USE_NATIVE = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = P && P.resolve && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && require('./$.descriptors')){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
var sameConstructor = function(a, b){
  // library wrapper special case
  if(LIBRARY && a === P && b === Wrapper)return true;
  return same(a, b);
};
var getConstructor = function(C){
  var S = anObject(C)[SPECIES];
  return S != undefined ? S : C;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var PromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve),
  this.reject  = aFunction(reject)
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(record, isReject){
  if(record.n)return;
  record.n = true;
  var chain = record.c;
  asap(function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , result, then;
      try {
        if(handler){
          if(!ok)record.h = true;
          result = handler === true ? value : handler(value);
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
    record.n = false;
    if(isReject)setTimeout(function(){
      var promise = record.p
        , handler, console;
      if(isUnhandled(promise)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      } record.a = undefined;
    }, 1);
  });
};
var isUnhandled = function(promise){
  var record = promise._d
    , chain  = record.a || record.c
    , i      = 0
    , reaction;
  if(record.h)return false;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var $reject = function(value){
  var record = this;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  notify(record, true);
};
var $resolve = function(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(record.p === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      asap(function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record, false);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    aFunction(executor);
    var record = this._d = {
      p: strictNew(this, P, PROMISE),         // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false,                               // <- handled rejection
      n: false                                // <- notify
    };
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  require('./$.redefine-all')(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction = new PromiseCapability(speciesConstructor(this, P))
        , promise  = reaction.promise
        , record   = this._d;
      reaction.ok   = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      record.c.push(reaction);
      if(record.a)record.a.push(reaction);
      if(record.s)notify(record, false);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: P});
require('./$.set-to-string-tag')(P, PROMISE);
require('./$.set-species')(PROMISE);
Wrapper = require('./$.core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = new PromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (!USE_NATIVE || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof P && sameConstructor(x.constructor, this))return x;
    var capability = new PromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./$.iter-detect')(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject
      , values     = [];
    var abrupt = perform(function(){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        var alreadyCalled = false;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled = true;
          results[index] = value;
          --remaining || resolve(results);
        }, reject);
      });
      else resolve(results);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});
},{"./$":79,"./$.a-function":52,"./$.an-object":54,"./$.classof":55,"./$.core":57,"./$.ctx":58,"./$.descriptors":60,"./$.export":62,"./$.for-of":64,"./$.global":65,"./$.is-object":72,"./$.iter-detect":76,"./$.library":80,"./$.microtask":81,"./$.redefine-all":85,"./$.same-value":87,"./$.set-proto":88,"./$.set-species":89,"./$.set-to-string-tag":90,"./$.species-constructor":92,"./$.strict-new":93,"./$.wks":101}],110:[function(require,module,exports){
'use strict';
var $at  = require('./$.string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./$.iter-define":75,"./$.string-at":94}],111:[function(require,module,exports){
require('./es6.array.iterator');
var Iterators = require('./$.iterators');
Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
},{"./$.iterators":78,"./es6.array.iterator":104}],112:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('is-array')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
 *     on objects.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

function typedArraySupport () {
  function Bar () {}
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    arr.constructor = Bar
    return arr.foo() === 42 && // typed array instances can be augmented
        arr.constructor === Bar && // constructor can be set
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  this.length = 0
  this.parent = undefined

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined') {
    if (object.buffer instanceof ArrayBuffer) {
      return fromTypedArray(that, object)
    }
    if (object instanceof ArrayBuffer) {
      return fromArrayBuffer(that, object)
    }
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    array.byteLength
    that = Buffer._augment(new Uint8Array(array))
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromTypedArray(that, new Uint8Array(array))
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = Buffer._augment(new Uint8Array(length))
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
    that._isBuffer = true
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  var i = 0
  var len = Math.min(x, y)
  while (i < len) {
    if (a[i] !== b[i]) break

    ++i
  }

  if (i !== len) {
    x = a[i]
    y = b[i]
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = '' + string

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

// pre-set for values that may exist in the future
Buffer.prototype.length = undefined
Buffer.prototype.parent = undefined

function slowToString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` is deprecated
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` is deprecated
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), targetStart)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"base64-js":113,"ieee754":114,"is-array":115}],113:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],114:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],115:[function(require,module,exports){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

},{}],116:[function(require,module,exports){
'use strict';

!function(exports, undefined) {

  var
    // If the typed array is unspecified, use this.
    DefaultArrayType = Float32Array,
    // Simple math functions we need.
    sqrt = Math.sqrt,
    sqr = function(number) {return Math.pow(number, 2)},
    // Internal convenience copies of the exported functions
    isComplexArray,
    ComplexArray

  exports.isComplexArray = isComplexArray = function(obj) {
    return obj !== undefined &&
      obj.hasOwnProperty !== undefined &&
      obj.hasOwnProperty('real') &&
      obj.hasOwnProperty('imag')
  }

  exports.ComplexArray = ComplexArray = function(other, opt_array_type){
    if (isComplexArray(other)) {
      // Copy constuctor.
      this.ArrayType = other.ArrayType
      this.real = new this.ArrayType(other.real)
      this.imag = new this.ArrayType(other.imag)
    } else {
      this.ArrayType = opt_array_type || DefaultArrayType
      // other can be either an array or a number.
      this.real = new this.ArrayType(other)
      this.imag = new this.ArrayType(this.real.length)
    }

    this.length = this.real.length
  }

  ComplexArray.prototype.toString = function() {
    var components = []

    this.forEach(function(c_value, i) {
      components.push(
        '(' +
        c_value.real.toFixed(2) + ',' +
        c_value.imag.toFixed(2) +
        ')'
      )
    })

    return '[' + components.join(',') + ']'
  }

  // In-place mapper.
  ComplexArray.prototype.map = function(mapper) {
    var
      i,
      n = this.length,
      // For GC efficiency, pass a single c_value object to the mapper.
      c_value = {}

    for (i = 0; i < n; i++) {
      c_value.real = this.real[i]
      c_value.imag = this.imag[i]
      mapper(c_value, i, n)
      this.real[i] = c_value.real
      this.imag[i] = c_value.imag
    }

    return this
  }

  ComplexArray.prototype.forEach = function(iterator) {
    var
      i,
      n = this.length,
      // For consistency with .map.
      c_value = {}

    for (i = 0; i < n; i++) {
      c_value.real = this.real[i]
      c_value.imag = this.imag[i]
      iterator(c_value, i, n)
    }
  }

  ComplexArray.prototype.conjugate = function() {
    return (new ComplexArray(this)).map(function(value) {
      value.imag *= -1
    })
  }

  // Helper so we can make ArrayType objects returned have similar interfaces
  //   to ComplexArrays.
  function iterable(obj) {
    if (!obj.forEach)
      obj.forEach = function(iterator) {
        var i, n = this.length

        for (i = 0; i < n; i++)
          iterator(this[i], i, n)
      }

    return obj
  }

  ComplexArray.prototype.magnitude = function() {
    var mags = new this.ArrayType(this.length)

    this.forEach(function(value, i) {
      mags[i] = sqrt(sqr(value.real) + sqr(value.imag))
    })

    // ArrayType will not necessarily be iterable: make it so.
    return iterable(mags)
  }
}(typeof exports === 'undefined' && (this.complex_array = {}) || exports)

},{}],117:[function(require,module,exports){
'use strict';

!function(exports, complex_array) {

  var
    ComplexArray = complex_array.ComplexArray,
    // Math constants and functions we need.
    PI = Math.PI,
    SQRT1_2 = Math.SQRT1_2,
    sqrt = Math.sqrt,
    cos = Math.cos,
    sin = Math.sin

  ComplexArray.prototype.FFT = function() {
    return FFT(this, false)
  }

  exports.FFT = function(input) {
    return ensureComplexArray(input).FFT()
  }

  ComplexArray.prototype.InvFFT = function() {
    return FFT(this, true)
  }

  exports.InvFFT = function(input) {
    return ensureComplexArray(input).InvFFT()
  }

  // Applies a frequency-space filter to input, and returns the real-space
  // filtered input.
  // filterer accepts freq, i, n and modifies freq.real and freq.imag.
  ComplexArray.prototype.frequencyMap = function(filterer) {
    return this.FFT().map(filterer).InvFFT()
  }

  exports.frequencyMap = function(input, filterer) {
    return ensureComplexArray(input).frequencyMap(filterer)
  }

  function ensureComplexArray(input) {
    return complex_array.isComplexArray(input) && input ||
        new ComplexArray(input)
  }

  function FFT(input, inverse) {
    var n = input.length

    if (n & (n - 1)) {
      return FFT_Recursive(input, inverse)
    } else {
      return FFT_2_Iterative(input, inverse)
    }
  }

  function FFT_Recursive(input, inverse) {
    var
      n = input.length,
      // Counters.
      i, j,
      output,
      // Complex multiplier and its delta.
      f_r, f_i, del_f_r, del_f_i,
      // Lowest divisor and remainder.
      p, m,
      normalisation,
      recursive_result,
      _swap, _real, _imag

    if (n === 1) {
      return input
    }

    output = new ComplexArray(n, input.ArrayType)

    // Use the lowest odd factor, so we are able to use FFT_2_Iterative in the
    // recursive transforms optimally.
    p = LowestOddFactor(n)
    m = n / p
    normalisation = 1 / sqrt(p)
    recursive_result = new ComplexArray(m, input.ArrayType)

    // Loops go like O(n Σ p_i), where p_i are the prime factors of n.
    // for a power of a prime, p, this reduces to O(n p log_p n)
    for(j = 0; j < p; j++) {
      for(i = 0; i < m; i++) {
        recursive_result.real[i] = input.real[i * p + j]
        recursive_result.imag[i] = input.imag[i * p + j]
      }
      // Don't go deeper unless necessary to save allocs.
      if (m > 1) {
        recursive_result = FFT(recursive_result, inverse)
      }

      del_f_r = cos(2*PI*j/n)
      del_f_i = (inverse ? -1 : 1) * sin(2*PI*j/n)
      f_r = 1
      f_i = 0

      for(i = 0; i < n; i++) {
        _real = recursive_result.real[i % m]
        _imag = recursive_result.imag[i % m]

        output.real[i] += f_r * _real - f_i * _imag
        output.imag[i] += f_r * _imag + f_i * _real

        _swap = f_r * del_f_r - f_i * del_f_i
        f_i = f_r * del_f_i + f_i * del_f_r
        f_r = _swap
      }
    }

    // Copy back to input to match FFT_2_Iterative in-placeness
    // TODO: faster way of making this in-place?
    for(i = 0; i < n; i++) {
      input.real[i] = normalisation * output.real[i]
      input.imag[i] = normalisation * output.imag[i]
    }

    return input
  }

  function FFT_2_Iterative(input, inverse) {
    var
      n = input.length,
      // Counters.
      i, j,
      output, output_r, output_i,
      // Complex multiplier and its delta.
      f_r, f_i, del_f_r, del_f_i, temp,
      // Temporary loop variables.
      l_index, r_index,
      left_r, left_i, right_r, right_i,
      // width of each sub-array for which we're iteratively calculating FFT.
      width

    output = BitReverseComplexArray(input)
    output_r = output.real
    output_i = output.imag
    // Loops go like O(n log n):
    //   width ~ log n; i,j ~ n
    width = 1
    while (width < n) {
      del_f_r = cos(PI/width)
      del_f_i = (inverse ? -1 : 1) * sin(PI/width)
      for (i = 0; i < n/(2*width); i++) {
        f_r = 1
        f_i = 0
        for (j = 0; j < width; j++) {
          l_index = 2*i*width + j
          r_index = l_index + width

          left_r = output_r[l_index]
          left_i = output_i[l_index]
          right_r = f_r * output_r[r_index] - f_i * output_i[r_index]
          right_i = f_i * output_r[r_index] + f_r * output_i[r_index]

          output_r[l_index] = SQRT1_2 * (left_r + right_r)
          output_i[l_index] = SQRT1_2 * (left_i + right_i)
          output_r[r_index] = SQRT1_2 * (left_r - right_r)
          output_i[r_index] = SQRT1_2 * (left_i - right_i)
          temp = f_r * del_f_r - f_i * del_f_i
          f_i = f_r * del_f_i + f_i * del_f_r
          f_r = temp
        }
      }
      width <<= 1
    }

    return output
  }

  function BitReverseIndex(index, n) {
    var bitreversed_index = 0

    while (n > 1) {
      bitreversed_index <<= 1
      bitreversed_index += index & 1
      index >>= 1
      n >>= 1
    }
    return bitreversed_index
  }

  function BitReverseComplexArray(array) {
    var n = array.length,
        flips = {},
        swap,
        i

    for(i = 0; i < n; i++) {
      var r_i = BitReverseIndex(i, n)

      if (flips.hasOwnProperty(i) || flips.hasOwnProperty(r_i)) continue

      swap = array.real[r_i]
      array.real[r_i] = array.real[i]
      array.real[i] = swap

      swap = array.imag[r_i]
      array.imag[r_i] = array.imag[i]
      array.imag[i] = swap

      flips[i] = flips[r_i] = true
    }

    return array
  }

  function LowestOddFactor(n) {
    var factor = 3,
        sqrt_n = sqrt(n)

    while(factor <= sqrt_n) {
      if (n % factor === 0) return factor
      factor = factor + 2
    }
    return n
  }

}(
  typeof exports === 'undefined' && (this.fft = {}) || exports,
  typeof require === 'undefined' && (this.complex_array) ||
    require('./complex_array')
)

},{"./complex_array":116}],118:[function(require,module,exports){

/**
 * Module dependencies.
 */

var global = (function() { return this; })();

/**
 * WebSocket constructor.
 */

var WebSocket = global.WebSocket || global.MozWebSocket;

/**
 * Module exports.
 */

module.exports = WebSocket ? ws : null;

/**
 * WebSocket constructor.
 *
 * The third `opts` options object gets ignored in web browsers, since it's
 * non-standard, and throws a TypeError if passed to the constructor.
 * See: https://github.com/einaros/ws/issues/227
 *
 * @param {String} uri
 * @param {Array} protocols (optional)
 * @param {Object) opts (optional)
 * @api public
 */

function ws(uri, protocols, opts) {
  var instance;
  if (protocols) {
    instance = new WebSocket(uri, protocols);
  } else {
    instance = new WebSocket(uri);
  }
  return instance;
}

if (WebSocket) ws.prototype = WebSocket.prototype;

},{}],119:[function(require,module,exports){
module.exports = {
  core: {
    BaseLfo           : require('./dist/core/base-lfo'),
  },
  sources: {
    AudioInBuffer     : require('./dist/sources/audio-in-buffer'),
    AudioInNode       : require('./dist/sources/audio-in-node'),
    EventIn           : require('./dist/sources/event-in'),
    // retest
    SocketClient      : require('./dist/sources/socket-client'),
    SocketServer      : require('./dist/sources/socket-server'),
  },
  sinks: {
    AudioRecorder     : require('./dist/sinks/audio-recorder'),
    Bpf               : require('./dist/sinks/bpf'),
    Bridge            : require('./dist/sinks/bridge'),
    DataRecorder      : require('./dist/sinks/data-recorder'),
    Trace             : require('./dist/sinks/trace'),
    Spectrogram       : require('./dist/sinks/spectrogram'),
    SocketClient      : require('./dist/sinks/socket-client'),
    SocketServer      : require('./dist/sinks/socket-server'),
    Sonogram          : require('./dist/sinks/sonogram'),
    SynchronizedDraw  : require('./dist/sinks/synchronized-draw'),
    Waveform          : require('./dist/sinks/waveform'),
  },
  operators: {
    Biquad            : require('./dist/operators/biquad'),
    Fft               : require('./dist/operators/fft'),
    // Ifft           : require('./dist/operators/ifft'),
    Framer            : require('./dist/operators/framer'),
    Magnitude         : require('./dist/operators/magnitude'),
    MinMax            : require('./dist/operators/min-max'),
    MovingAverage     : require('./dist/operators/moving-average'),
    MovingMedian      : require('./dist/operators/moving-median'),
    Noop              : require('./dist/operators/noop'),
    Operator          : require('./dist/operators/operator'),
  },
};

},{"./dist/core/base-lfo":1,"./dist/operators/biquad":2,"./dist/operators/fft":3,"./dist/operators/framer":4,"./dist/operators/magnitude":5,"./dist/operators/min-max":6,"./dist/operators/moving-average":7,"./dist/operators/moving-median":8,"./dist/operators/noop":9,"./dist/operators/operator":10,"./dist/sinks/audio-recorder":11,"./dist/sinks/bpf":13,"./dist/sinks/bridge":14,"./dist/sinks/data-recorder":15,"./dist/sinks/socket-client":16,"./dist/sinks/socket-server":17,"./dist/sinks/sonogram":18,"./dist/sinks/spectrogram":19,"./dist/sinks/synchronized-draw":20,"./dist/sinks/trace":21,"./dist/sinks/waveform":22,"./dist/sources/audio-in-buffer":23,"./dist/sources/audio-in-node":24,"./dist/sources/event-in":26,"./dist/sources/socket-client":27,"./dist/sources/socket-server":28}]},{},[119])(119)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2NvcmUvZXM2L2NvcmUvYmFzZS1sZm8uanMiLCJkaXN0L29wZXJhdG9ycy9lczYvb3BlcmF0b3JzL2JpcXVhZC5qcyIsImRpc3Qvb3BlcmF0b3JzL2VzNi9vcGVyYXRvcnMvZmZ0LmpzIiwiZGlzdC9vcGVyYXRvcnMvZXM2L29wZXJhdG9ycy9mcmFtZXIuanMiLCJkaXN0L29wZXJhdG9ycy9lczYvb3BlcmF0b3JzL21hZ25pdHVkZS5qcyIsImRpc3Qvb3BlcmF0b3JzL2VzNi9vcGVyYXRvcnMvbWluLW1heC5qcyIsImRpc3Qvb3BlcmF0b3JzL2VzNi9vcGVyYXRvcnMvbW92aW5nLWF2ZXJhZ2UuanMiLCJkaXN0L29wZXJhdG9ycy9lczYvb3BlcmF0b3JzL21vdmluZy1tZWRpYW4uanMiLCJkaXN0L29wZXJhdG9ycy9lczYvb3BlcmF0b3JzL25vb3AuanMiLCJkaXN0L29wZXJhdG9ycy9lczYvb3BlcmF0b3JzL29wZXJhdG9yLmpzIiwiZGlzdC9zaW5rcy9lczYvc2lua3MvYXVkaW8tcmVjb3JkZXIuanMiLCJkaXN0L3NpbmtzL2VzNi9zaW5rcy9iYXNlLWRyYXcuanMiLCJkaXN0L3NpbmtzL2VzNi9zaW5rcy9icGYuanMiLCJkaXN0L3NpbmtzL2VzNi9zaW5rcy9icmlkZ2UuanMiLCJkaXN0L3NpbmtzL2VzNi9zaW5rcy9kYXRhLXJlY29yZGVyLmpzIiwiZGlzdC9zaW5rcy9lczYvc2lua3Mvc29ja2V0LWNsaWVudC5qcyIsImRpc3Qvc2lua3MvZXM2L3NpbmtzL3NvY2tldC1zZXJ2ZXIuanMiLCJkaXN0L3NpbmtzL2VzNi9zaW5rcy9zb25vZ3JhbS5qcyIsImRpc3Qvc2lua3MvZXM2L3NpbmtzL3NwZWN0cm9ncmFtLmpzIiwiZGlzdC9zaW5rcy9lczYvc2luay9zeW5jaHJvbml6ZWQtZHJhdy5qcyIsImRpc3Qvc2lua3MvZXM2L3NpbmsvdHJhY2UuanMiLCJkaXN0L3NpbmtzL2VzNi9zaW5rcy93YXZlZm9ybS5qcyIsImRpc3Qvc291cmNlcy9lczYvc291cmNlcy9hdWRpby1pbi1idWZmZXIuanMiLCJkaXN0L3NvdXJjZXMvZXM2L3NvdXJjZXMvYXVkaW8taW4tbm9kZS5qcyIsImRpc3Qvc291cmNlcy9lczYvc291cmNlcy9hdWRpby1pbi5qcyIsImRpc3Qvc291cmNlcy9lczYvc291cmNlcy9ldmVudC1pbi5qcyIsImRpc3Qvc291cmNlcy9lczYvc291cmNlcy9zb2NrZXQtY2xpZW50LmpzIiwiZGlzdC9zb3VyY2VzL2VzNi9zb3VyY2VzL3NvY2tldC1zZXJ2ZXIuanMiLCJkaXN0L3V0aWxzL2VzNi91dGlscy9kcmF3LXV0aWxzLmpzIiwiZGlzdC91dGlscy9lczYvdXRpbHMvZmZ0LXdpbmRvd3MuanMiLCJkaXN0L3V0aWxzL2Rpc3QvdXRpbHMvZXM2L3V0aWxzL3NvY2tldC11dGlscy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvYXJyYXkvZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2Fzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2NyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1vd24tcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L3NldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3Byb21pc2UuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzLWNhbGwtY2hlY2suanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZS1jbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvZ2V0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvaW50ZXJvcC1yZXF1aXJlLWRlZmF1bHQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2ludGVyb3AtcmVxdWlyZS13aWxkY2FyZC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vYXJyYXkvZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2Fzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2NyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2dldC1vd24tcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L3NldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL3Byb21pc2UuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY2xhc3NvZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmNvZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmNvcmUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jdHguanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5kZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZmFpbHMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5mb3Itb2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5oYXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmludm9rZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmlvYmplY3QuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pcy1hcnJheS1pdGVyLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXMtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1jYWxsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLml0ZXItZGV0ZWN0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1zdGVwLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlcmF0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQubWljcm90YXNrLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQub2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLm9iamVjdC1zYXAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQucmVkZWZpbmUtYWxsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQucmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zYW1lLXZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc2V0LXByb3RvLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc2V0LXNwZWNpZXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnNoYXJlZC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnNwZWNpZXMtY29uc3RydWN0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zdHJpY3QtbmV3LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc3RyaW5nLWF0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudGFzay5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnRvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC50by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudWlkLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQud2tzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkuZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5wcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9pcy1hcnJheS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9qc2ZmdC9saWIvY29tcGxleF9hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9qc2ZmdC9saWIvZmZ0LmpzIiwibm9kZV9tb2R1bGVzL3dzL2xpYi9icm93c2VyLmpzIiwid2F2ZXMtbGZvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7QUNBQSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7O0lBRVUsT0FBTztBQUNmLFdBRFEsT0FBTyxHQUNlO1FBQTdCLE9BQU8seURBQUcs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RUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQztDQUNsQyxDQUFBOzs7OztBQy9GRDs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTs7QUNGQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBOztBQ0ZBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7OztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3hnREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IGlkID0gMDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSwgZGVmYXVsdHMgPSB7fSkge1xuICAgIHRoaXMuY2lkID0gaWQrKztcbiAgICB0aGlzLnBhcmFtcyA9IHt9O1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMgPSB7XG4gICAgICBmcmFtZVNpemU6IDEsXG4gICAgICBmcmFtZVJhdGU6IDAsXG4gICAgICBzb3VyY2VTYW1wbGVSYXRlOiAwXG4gICAgfTtcblxuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgfVxuXG4gIC8vIFdlYkF1ZGlvQVBJIGBjb25uZWN0YCBsaWtlIG1ldGhvZFxuICBjb25uZWN0KGNoaWxkKSB7XG4gICAgaWYgKHRoaXMuc3RyZWFtUGFyYW1zID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBjb25uZWN0IHRvIGEgZGVhZCBsZm8gbm9kZScpO1xuICAgIH1cblxuICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgfVxuXG4gIC8vIGluaXRpYWxpemUgdGhlIGN1cnJlbnQgbm9kZSBzdHJlYW0gYW5kIHByb3BhZ2F0ZSB0byBpdCdzIGNoaWxkcmVuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICAvLyBkZWZhdWx0cyB0byBpbmhlcml0IHBhcmVudCdzIHN0cmVhbSBwYXJhbWV0ZXJzXG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcyA9IE9iamVjdC5hc3NpZ24odGhpcy5zdHJlYW1QYXJhbXMsIHRoaXMucGFyZW50LnN0cmVhbVBhcmFtcyk7XG4gICAgfVxuXG4gICAgLy8gZW50cnkgcG9pbnQgZm9yIHN0cmVhbSBwYXJhbXMgY29uZmlndXJhdGlvbiBpbiBkZXJpdmVkIGNsYXNzXG4gICAgdGhpcy5jb25maWd1cmVTdHJlYW0oKTtcbiAgICAvLyBjcmVhdGUgdGhlIGBvdXRGcmFtZWAgYXJyYXlCdWZmZXJcbiAgICB0aGlzLnNldHVwU3RyZWFtKCk7XG5cbiAgICAvLyBwcm9wYWdhdGUgaW5pdGlhbGl6YXRpb24gaW4gbGZvIGNoYWluXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5jaGlsZHJlbltpXS5pbml0aWFsaXplKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gc291cmNlcyBvbmx5XG4gIC8vIHN0YXJ0KCkge1xuICAvLyAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAvLyAgIHRoaXMucmVzZXQoKTtcbiAgLy8gfVxuXG4gIC8qKlxuICAgKiBvdmVycmlkZSBpbmhlcml0ZWQgc3RyZWFtUGFyYW1zLCBvbmx5IGlmIHNwZWNpZmllZCBpbiBgcGFyYW1zYFxuICAgKi9cbiAgY29uZmlndXJlU3RyZWFtKCkge1xuICAgIGlmICh0aGlzLnBhcmFtcy5mcmFtZVNpemUpIHtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZnJhbWVSYXRlKSB7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSB0aGlzLnBhcmFtcy5mcmFtZVJhdGU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUpIHtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgPSB0aGlzLnBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGUgdGhlIG91dHB1dEZyYW1lIGFjY29yZGluZyB0byB0aGUgYHN0cmVhbVBhcmFtc2BcbiAgICogQE5PVEUgcmVtb3ZlIGNvbW1lbnRlZCBjb2RlID9cbiAgICovXG4gIHNldHVwU3RyZWFtKC8qIG9wdHMgPSB7fSAqLykge1xuICAgIC8vIGlmIChvcHRzLmZyYW1lUmF0ZSkgeyB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSBvcHRzLmZyYW1lUmF0ZTsgfVxuICAgIC8vIGlmIChvcHRzLmZyYW1lU2l6ZSkgeyB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSBvcHRzLmZyYW1lU2l6ZTsgfVxuICAgIC8vIGlmIChvcHRzLnNvdXJjZVNhbXBsZVJhdGUpIHsgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSA9IG9wdHMuc291cmNlU2FtcGxlUmF0ZTsgfVxuICAgIHRoaXMub3V0RnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSk7XG4gIH1cblxuICAvLyByZXNldCBgb3V0RnJhbWVgIGFuZCBjYWxsIHJlc2V0IG9uIGNoaWxkcmVuXG4gIHJlc2V0KCkge1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMuY2hpbGRyZW5baV0ucmVzZXQoKTtcbiAgICB9XG5cbiAgICAvLyBzaW5rcyBoYXZlIG5vIGBvdXRGcmFtZWBcbiAgICBpZiAoIXRoaXMub3V0RnJhbWUpIHsgcmV0dXJuIH1cblxuICAgIC8vIHRoaXMub3V0RnJhbWUuZmlsbCgwKTsgLy8gcHJvYmFibHkgYmV0dGVyIGJ1dCBkb2Vzbid0IHdvcmsgeWV0XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm91dEZyYW1lLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5vdXRGcmFtZVtpXSA9IDA7XG4gICAgfVxuICB9XG5cbiAgLy8gZmlsbCB0aGUgb24tZ29pbmcgYnVmZmVyIHdpdGggMCAoaXMgZG9uZSlcbiAgLy8gb3V0cHV0IGl0LCB0aGVuIGNhbGwgcmVzZXQgb24gYWxsIHRoZSBjaGlsZHJlbiAoc3VyZSA/KVxuICAvLyBATk9URTogYHJlc2V0YCBpcyBjYWxsZWQgaW4gYHNvdXJjZXMuc3RhcnRgLFxuICAvLyAgaWYgaXMgY2FsbGVkIGhlcmUsIGl0IHdpbGwgYmUgY2FsbGVkIG1vcmUgdGhhbiBvbmNlIGluIGEgY2hpbGQgbm9kZVxuICAvLyAgaXMgdGhpcyBhIHByb2JsZW0gP1xuICBmaW5hbGl6ZSgpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuW2ldLmZpbmFsaXplKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gZm9yd2FyZCB0aGUgY3VycmVudCBzdGF0ZSAodGltZSwgZnJhbWUsIG1ldGFEYXRhKSB0byBhbGwgdGhlIGNoaWxkcmVuXG4gIG91dHB1dCh0aW1lID0gdGhpcy50aW1lLCBvdXRGcmFtZSA9IHRoaXMub3V0RnJhbWUsIG1ldGFEYXRhID0gdGhpcy5tZXRhRGF0YSkge1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMuY2hpbGRyZW5baV0ucHJvY2Vzcyh0aW1lLCBvdXRGcmFtZSwgbWV0YURhdGEpO1xuICAgIH1cbiAgfVxuXG4gIC8vIG1haW4gZnVuY3Rpb24gdG8gb3ZlcnJpZGUsIGRlZmF1bHRzIHRvIG5vb3BcbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICB0aGlzLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMub3V0RnJhbWUgPSBmcmFtZTtcbiAgICB0aGlzLm1ldGFEYXRhID0gbWV0YURhdGE7XG5cbiAgICB0aGlzLm91dHB1dCgpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICAvLyBjYWxsIGBkZXN0cm95YCBpbiBhbGwgaXQncyBjaGlsZHJlblxuICAgIGxldCBpbmRleCA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICAgIHRoaXMuY2hpbGRyZW5baW5kZXhdLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICAvLyBkZWxldGUgaXRzZWxmIGZyb20gdGhlIHBhcmVudCBub2RlXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICBjb25zdCBpbmRleCA9ICB0aGlzLnBhcmVudC5jaGlsZHJlbi5pbmRleE9mKHRoaXMpO1xuICAgICAgdGhpcy5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICAvLyBjYW5ub3QgdXNlIGEgZGVhZCBvYmplY3QgYXMgcGFyZW50XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMgPSBudWxsO1xuXG4gICAgLy8gY2xlYW4gaXQncyBvd24gcmVmZXJlbmNlcyAvIGRpc2Nvbm5lY3QgYXVkaW8gbm9kZXMgaWYgbmVlZGVkXG4gIH1cbn1cbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBXQVZFIExGTyBtb2R1bGU6IGJpcXVhZCBmaWx0ZXIuXG4gKiBAYXV0aG9yIEplYW4tUGhpbGlwcGUuTGFtYmVydEBpcmNhbS5mciwgTm9yYmVydC5TY2huZWxsQGlyY2FtLmZyLCB2aWN0b3Iuc2FpekBpcmNhbS5mclxuICogQHZlcnNpb24gMC4xLjBcbiAqXG4gKiBAYnJpZWYgIEJpcXVhZCBmaWx0ZXIgYW5kIGNvZWZmaWNpZW50cyBjYWxjdWxhdG9yXG4gKlxuICogQmFzZWQgb24gdGhlIFwiQ29va2Jvb2sgZm9ybXVsYWUgZm9yIGF1ZGlvIEVRIGJpcXVhZCBmaWx0ZXJcbiAqIGNvZWZmaWNpZW50c1wiIGJ5IFJvYmVydCBCcmlzdG93LUpvaG5zb25cbiAqXG4gKi9cblxuLyogeShuKSA9IGIwIHgobikgKyBiMSB4KG4tMSkgKyBiMiB4KG4tMikgICovXG4vKiAgICAgICAgICAgICAgICAtIGExIHgobi0xKSAtIGEyIHgobi0yKSAgKi9cblxuLyogZjAgaXMgbm9ybWFsaXNlZCBieSB0aGUgbnlxdWlzdCBmcmVxdWVuY3kgKi9cbi8qIHEgbXVzdCBiZSA+IDAuICovXG4vKiBnYWluIG11c3QgYmUgPiAwLiBhbmQgaXMgbGluZWFyICovXG5cbi8qIHdoZW4gdGhlcmUgaXMgbm8gZ2FpbiBwYXJhbWV0ZXIsIG9uZSBjYW4gc2ltcGx5IG11bHRpcGx5IHRoZSBiXG4gKiBjb2VmZmljaWVudHMgYnkgYSAobGluZWFyKSBnYWluICovXG5cbi8qIGEwIGlzIGFsd2F5cyAxLiBhcyBlYWNoIGNvZWZmaWNpZW50IGlzIG5vcm1hbGlzZWQgYnkgYTAsIGluY2x1ZGluZyBhMCAqL1xuXG4vKiBhMSBpcyBhWzBdIGFuZCBhMiBpcyBhWzFdICovXG5cbnZhciBCYXNlTGZvID0gcmVxdWlyZSgnLi4vY29yZS9iYXNlLWxmbycpO1xuXG52YXIgc2luID0gTWF0aC5zaW47XG52YXIgY29zID0gTWF0aC5jb3M7XG52YXIgTV9QSSA9IE1hdGguUEk7XG52YXIgc3FydCA9IE1hdGguc3FydDtcblxuLy8gY29lZnMgY2FsY3VsYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS1cblxuLyogTFBGOiBIKHMpID0gMSAvIChzXjIgKyBzL1EgKyAxKSAqL1xuZnVuY3Rpb24gbG93cGFzc19jb2VmcyhmMCwgcSwgY29lZnMpIHtcbiAgdmFyIHcwID0gTV9QSSAqIGYwO1xuICB2YXIgYWxwaGEgPSBzaW4odzApIC8gKDIuMCAqIHEpO1xuICB2YXIgYyA9IGNvcyh3MCk7XG5cbiAgdmFyIGEwX2ludiA9IDEuMCAvICgxLjAgKyBhbHBoYSk7XG5cbiAgY29lZnMuYTEgPSAoLTIuMCAqIGMpICogYTBfaW52O1xuICBjb2Vmcy5hMiA9ICgxLjAgLSBhbHBoYSkgKiBhMF9pbnY7XG5cbiAgY29lZnMuYjAgPSAoKDEuMCAtIGMpICogMC41KSAqIGEwX2ludjtcbiAgY29lZnMuYjEgPSAoMS4wIC0gYykgKiBhMF9pbnY7XG4gIGNvZWZzLmIyID0gY29lZnMuYjA7XG59XG5cbiAgLyogSFBGOiBIKHMpID0gc14yIC8gKHNeMiArIHMvUSArIDEpICovXG5mdW5jdGlvbiBoaWdocGFzc19jb2VmcyhmMCwgcSwgY29lZnMpIHtcbiAgdmFyIHcwID0gTV9QSSAqIGYwO1xuICB2YXIgYWxwaGEgPSBzaW4odzApIC8gKDIuMCAqIHEpO1xuICB2YXIgYyA9IGNvcyh3MCk7XG5cbiAgdmFyIGEwX2ludiA9IDEuMCAvICgxLjAgKyBhbHBoYSk7XG5cbiAgY29lZnMuYTEgPSAoLTIuMCAqIGMpICogYTBfaW52O1xuICBjb2Vmcy5hMiA9ICgxLjAgLSBhbHBoYSkgKiBhMF9pbnY7XG5cbiAgY29lZnMuYjAgPSAoKDEuMCArIGMpICogMC41KSAqIGEwX2ludjtcbiAgY29lZnMuYjEgPSAoLTEuMCAtIGMpICogYTBfaW52O1xuICBjb2Vmcy5iMiA9IGNvZWZzLmIwO1xufVxuXG4vKiBCUEY6IEgocykgPSBzIC8gKHNeMiArIHMvUSArIDEpICAoY29uc3RhbnQgc2tpcnQgZ2FpbiwgcGVhayBnYWluID0gUSkgKi9cbmZ1bmN0aW9uIGJhbmRwYXNzX2NvbnN0YW50X3NraXJ0X2NvZWZzKGYwLCBxLCBjb2Vmcykge1xuICB2YXIgdzAgPSBNX1BJICogZjA7XG4gIHZhciBzID0gc2luKHcwKTtcbiAgdmFyIGFscGhhID0gcyAvICgyLjAgKiBxKTtcbiAgdmFyIGMgPSBjb3ModzApO1xuXG4gIHZhciBhMF9pbnYgPSAxLjAgLyAoMS4wICsgYWxwaGEpO1xuXG4gIGNvZWZzLmExID0gKC0yLjAgKiBjKSAqIGEwX2ludjtcbiAgY29lZnMuYTIgPSAoMS4wIC0gYWxwaGEpICogYTBfaW52O1xuXG4gIGNvZWZzLmIwID0gKHMgKiAwLjUpICogYTBfaW52O1xuICBjb2Vmcy5iMSA9IDAuMDtcbiAgY29lZnMuYjIgPSAtY29lZnMuYjA7XG59XG5cbi8qIEJQRjogSChzKSA9IChzL1EpIC8gKHNeMiArIHMvUSArIDEpICAgICAgKGNvbnN0YW50IDAgZEIgcGVhayBnYWluKSAqL1xuZnVuY3Rpb24gYmFuZHBhc3NfY29uc3RhbnRfcGVha19jb2VmcyhmMCwgcSwgY29lZnMpIHtcbiAgdmFyIHcwID0gTV9QSSAqIGYwO1xuICB2YXIgYWxwaGEgPSBzaW4odzApIC8gKDIuMCAqIHEpO1xuICB2YXIgYyA9IGNvcyh3MCk7XG5cbiAgdmFyIGEwX2ludiA9IDEuMCAvICgxLjAgKyBhbHBoYSk7XG5cbiAgY29lZnMuYTEgPSAoLTIuMCAqIGMpICogYTBfaW52O1xuICBjb2Vmcy5hMiA9ICgxLjAgLSBhbHBoYSkgKiBhMF9pbnY7XG5cbiAgY29lZnMuYjAgPSBhbHBoYSAqIGEwX2ludjtcbiAgY29lZnMuYjEgPSAwLjA7XG4gIGNvZWZzLmIyID0gLWNvZWZzLmIwO1xufVxuXG4vKiBub3RjaDogSChzKSA9IChzXjIgKyAxKSAvIChzXjIgKyBzL1EgKyAxKSAqL1xuZnVuY3Rpb24gbm90Y2hfY29lZnMoZjAsIHEsIGNvZWZzKSB7XG4gIHZhciB3MCA9IE1fUEkgKiBmMDtcbiAgdmFyIGFscGhhID0gc2luKHcwKSAvICgyLjAgKiBxKTtcbiAgdmFyIGMgPSBjb3ModzApO1xuXG4gIHZhciBhMF9pbnYgPSAxLjAgLyAoMS4wICsgYWxwaGEpO1xuXG4gIGNvZWZzLmExID0gKC0yLjAgKiBjKSAqIGEwX2ludjtcbiAgY29lZnMuYTIgPSAoMS4wIC0gYWxwaGEpICogYTBfaW52O1xuXG4gIGNvZWZzLmIwID0gYTBfaW52O1xuICBjb2Vmcy5iMSA9IGNvZWZzLmExO1xuICBjb2Vmcy5iMiA9IGNvZWZzLmIwO1xufVxuXG4vKiBBUEY6IEgocykgPSAoc14yIC0gcy9RICsgMSkgLyAoc14yICsgcy9RICsgMSkgKi9cbmZ1bmN0aW9uIGFsbHBhc3NfY29lZnMoZjAsIHEsIGNvZWZzKSB7XG4gIHZhciB3MCA9IE1fUEkgKiBmMDtcbiAgdmFyIGFscGhhID0gc2luKHcwKSAvICgyLjAgKiBxKTtcbiAgdmFyIGMgPSBjb3ModzApO1xuXG4gIHZhciBhMF9pbnYgPSAxLjAgLyAoMS4wICsgYWxwaGEpO1xuXG4gIGNvZWZzLmExID0gKC0yLjAgKiBjKSAqIGEwX2ludjtcbiAgY29lZnMuYTIgPSAoMS4wIC0gYWxwaGEpICogYTBfaW52O1xuXG4gIGNvZWZzLmIwID0gY29lZnMuYTI7XG4gIGNvZWZzLmIxID0gY29lZnMuYTE7XG4gIGNvZWZzLmIyID0gMS4wO1xufVxuXG4vKiBwZWFraW5nRVE6IEgocykgPSAoc14yICsgcyooQS9RKSArIDEpIC8gKHNeMiArIHMvKEEqUSkgKyAxKSAqL1xuLyogQSA9IHNxcnQoIDEwXihkQmdhaW4vMjApICkgPSAxMF4oZEJnYWluLzQwKSAqL1xuLyogZ2FpbiBpcyBsaW5lYXIgaGVyZSAqL1xuZnVuY3Rpb24gcGVha2luZ19jb2VmcyhmMCwgcSwgZ2FpbiwgY29lZnMpIHtcbiAgdmFyIGcgPSBzcXJ0KGdhaW4pO1xuICB2YXIgZ19pbnYgPSAxLjAgLyBnO1xuXG4gIHZhciB3MCA9IE1fUEkgKiBmMDtcbiAgdmFyIGFscGhhID0gc2luKHcwKSAvICgyLjAgKiBxKTtcbiAgdmFyIGMgPSBjb3ModzApO1xuXG4gIHZhciBhMF9pbnYgPSAxLjAgLyAoMS4wICsgYWxwaGEgKiBnX2ludik7XG5cbiAgY29lZnMuYTEgPSAoLTIuMCAqIGMpICogYTBfaW52O1xuICBjb2Vmcy5hMiA9ICgxLjAgLSBhbHBoYSAqIGdfaW52KSAqIGEwX2ludjtcblxuICBjb2Vmcy5iMCA9ICgxLjAgKyBhbHBoYSAqIGcpICogYTBfaW52O1xuICBjb2Vmcy5iMSA9IGNvZWZzLmExO1xuICBjb2Vmcy5iMiA9ICgxLjAgLSBhbHBoYSAqIGcpICogYTBfaW52O1xufVxuXG4vKiBsb3dTaGVsZjogSChzKSA9IEEgKiAoc14yICsgKHNxcnQoQSkvUSkqcyArIEEpLyhBKnNeMiArIChzcXJ0KEEpL1EpKnMgKyAxKSAqL1xuLyogQSA9IHNxcnQoIDEwXihkQmdhaW4vMjApICkgPSAxMF4oZEJnYWluLzQwKSAqL1xuLyogZ2FpbiBpcyBsaW5lYXIgaGVyZSAqL1xuZnVuY3Rpb24gbG93c2hlbGZfY29lZnMoZjAsIHEsIGdhaW4sIGNvZWZzKSB7XG4gIHZhciBnID0gc3FydChnYWluKTtcblxuICB2YXIgdzAgPSBNX1BJICogZjA7XG4gIHZhciBhbHBoYV8yX3NxcnRnID0gc2luKHcwKSAqIHNxcnQoZykgLyBxIDtcbiAgdmFyIGMgPSBjb3ModzApO1xuXG4gIHZhciBhMF9pbnYgPSAxLjAgLyAoIChnKzEuMCkgKyAoZy0xLjApICogYyArIGFscGhhXzJfc3FydGcpO1xuXG4gIGNvZWZzLmExID0gKC0yLjAgKiAgICAgKCAoZy0xLjApICsgKGcrMS4wKSAqIGMgICAgICAgICAgICAgICAgKSApICogYTBfaW52O1xuICBjb2Vmcy5hMiA9ICggICAgICAgICAgICAgKGcrMS4wKSArIChnLTEuMCkgKiBjIC0gYWxwaGFfMl9zcXJ0ZyAgKSAqIGEwX2ludjtcblxuICBjb2Vmcy5iMCA9ICggICAgICAgZyAqICggKGcrMS4wKSAtIChnLTEuMCkgKiBjICsgYWxwaGFfMl9zcXJ0ZykgKSAqIGEwX2ludjtcbiAgY29lZnMuYjEgPSAoIDIuMCAqIGcgKiAoIChnLTEuMCkgLSAoZysxLjApICogYyAgICAgICAgICAgICAgICApICkgKiBhMF9pbnY7XG4gIGNvZWZzLmIyID0gKCAgICAgICBnICogKCAoZysxLjApIC0gKGctMS4wKSAqIGMgLSBhbHBoYV8yX3NxcnRnKSApICogYTBfaW52O1xufVxuXG4vKiBoaWdoU2hlbGY6IEgocykgPSBBICogKEEqc14yICsgKHNxcnQoQSkvUSkqcyArIDEpLyhzXjIgKyAoc3FydChBKS9RKSpzICsgQSkgKi9cbi8qIEEgPSBzcXJ0KCAxMF4oZEJnYWluLzIwKSApID0gMTBeKGRCZ2Fpbi80MCkgKi9cbi8qIGdhaW4gaXMgbGluZWFyIGhlcmUgKi9cbmZ1bmN0aW9uIGhpZ2hzaGVsZl9jb2VmcyhmMCwgcSwgZ2FpbiwgY29lZnMpIHtcbiAgdmFyIGcgPSBzcXJ0KGdhaW4pO1xuXG4gIHZhciB3MCA9IE1fUEkgKiBmMDtcbiAgdmFyIGFscGhhXzJfc3FydGcgPSBzaW4odzApICogc3FydChnKSAvIHEgO1xuICB2YXIgYyA9IGNvcyh3MCk7XG5cbiAgdmFyIGEwX2ludiA9IDEuMCAvICggKGcrMS4wKSAtIChnLTEuMCkgKiBjICsgYWxwaGFfMl9zcXJ0Zyk7XG5cbiAgY29lZnMuYTEgPSAoIDIuMCAqICAgICAoIChnLTEuMCkgLSAoZysxLjApICogYyAgICAgICAgICAgICAgICApICkgKiBhMF9pbnY7XG4gIGNvZWZzLmEyID0gKCAgICAgICAgICAgICAoZysxLjApIC0gKGctMS4wKSAqIGMgLSBhbHBoYV8yX3NxcnRnICApICogYTBfaW52O1xuXG4gIGNvZWZzLmIwID0gKCAgICAgIGcgKiAoICAoZysxLjApICsgKGctMS4wKSAqIGMgKyBhbHBoYV8yX3NxcnRnKSApICogYTBfaW52O1xuICBjb2Vmcy5iMSA9ICgtMi4wICogZyAqICggKGctMS4wKSArIChnKzEuMCkgKiBjICAgICAgICAgICAgICAgICkgKSAqIGEwX2ludjtcbiAgY29lZnMuYjIgPSAoICAgICAgZyAqICggIChnKzEuMCkgKyAoZy0xLjApICogYyAtIGFscGhhXzJfc3FydGcpICkgKiBhMF9pbnY7XG59XG5cbiAgLyogaGVscGVyICovXG5mdW5jdGlvbiBjYWxjdWxhdGVDb2Vmcyh0eXBlLCBmMCwgcSwgZ2FpbiwgY29lZnMpIHtcblxuICBzd2l0Y2godHlwZSkge1xuICAgIGNhc2UgJ2xvd3Bhc3MnOlxuICAgICAgbG93cGFzc19jb2VmcyhmMCwgcSwgY29lZnMpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdoaWdocGFzcyc6XG4gICAgICBoaWdocGFzc19jb2VmcyhmMCwgcSwgY29lZnMpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdiYW5kcGFzc19jb25zdGFudF9za2lydCc6XG4gICAgICBiYW5kcGFzc19jb25zdGFudF9za2lydF9jb2VmcyhmMCwgcSwgY29lZnMpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdiYW5kcGFzc19jb25zdGFudF9wZWFrJzpcbiAgICAgIGJhbmRwYXNzX2NvbnN0YW50X3BlYWtfY29lZnMoZjAsIHEsIGNvZWZzKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnbm90Y2gnOlxuICAgICAgbm90Y2hfY29lZnMoZjAsIHEsIGNvZWZzKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnYWxscGFzcyc6XG4gICAgICBhbGxwYXNzX2NvZWZzKGYwLCBxLCBjb2Vmcyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3BlYWtpbmcnOlxuICAgICAgcGVha2luZ19jb2VmcyhmMCwgcSwgZ2FpbiwgY29lZnMpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdsb3dzaGVsZic6XG4gICAgICBsb3dzaGVsZl9jb2VmcyhmMCwgcSwgZ2FpbiwgY29lZnMpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdoaWdoc2hlbGYnOlxuICAgICAgaGlnaHNoZWxmX2NvZWZzKGYwLCBxLCBnYWluLCBjb2Vmcyk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIC8vIGFwcGx5IGdhaW5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnbG93cGFzcyc6XG4gICAgY2FzZSAnaGlnaHBhc3MnOlxuICAgIGNhc2UgJ2JhbmRwYXNzX2NvbnN0YW50X3NraXJ0JzpcbiAgICBjYXNlICdiYW5kcGFzc19jb25zdGFudF9wZWFrJzpcbiAgICBjYXNlICdub3RjaCc6XG4gICAgY2FzZSAnYWxscGFzcyc6XG4gICAgICBpZiAoZ2FpbiAhPSAxLjApIHtcbiAgICAgICAgY29lZnMuYjAgKj0gZ2FpbjtcbiAgICAgICAgY29lZnMuYjEgKj0gZ2FpbjtcbiAgICAgICAgY29lZnMuYjIgKj0gZ2FpbjtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIC8qIGdhaW4gaXMgYWxyZWFkeSBpbnRlZ3JhdGVkIGZvciB0aGUgZm9sbG93aW5nICovXG4gICAgY2FzZSAncGVha2luZyc6XG4gICAgY2FzZSAnbG93c2hlbGYnOlxuICAgIGNhc2UgJ2hpZ2hzaGVsZic6XG4gICAgICBicmVhaztcbiAgfVxufVxuXG4vKiBkaXJlY3QgZm9ybSBJICovXG4vKiBhMCA9IDEsIGExID0gYVswXSwgYTIgPSBhWzFdICovXG4vKiA0IHN0YXRlcyAoaW4gdGhhdCBvcmRlcik6IHgobi0xKSwgeChuLTIpLCB5KG4tMSksIHkobi0yKSAgKi9cbmZ1bmN0aW9uIGJpcXVhZEFycmF5RGYxKGNvZWZzLCBzdGF0ZSwgaW5GcmFtZSwgb3V0RnJhbWUsIHNpemUpIHtcbiAgZm9yKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgIHZhciB5ID0gY29lZnMuYjAgKiBpbkZyYW1lW2ldXG4gICAgICAgICAgKyBjb2Vmcy5iMSAqIHN0YXRlLnhuXzFbaV0gKyBjb2Vmcy5iMiAqIHN0YXRlLnhuXzJbaV1cbiAgICAgICAgICAtIGNvZWZzLmExICogc3RhdGUueW5fMVtpXSAtIGNvZWZzLmEyICogc3RhdGUueW5fMltpXTtcblxuICAgIG91dEZyYW1lW2ldID0geTtcblxuICAgIC8vIHVwZGF0ZSBzdGF0ZXNcbiAgICBzdGF0ZS54bl8yW2ldID0gc3RhdGUueG5fMVtpXTtcbiAgICBzdGF0ZS54bl8xW2ldID0gaW5GcmFtZVtpXTtcblxuICAgIHN0YXRlLnluXzJbaV0gPSBzdGF0ZS55bl8xW2ldO1xuICAgIHN0YXRlLnluXzFbaV0gPSB5O1xuICB9XG59XG5cbi8qIHRyYW5zcG9zZWQgZGlyZWN0IGZvcm0gSUkgKi9cbi8qIGEwID0gMSwgYTEgPSBhWzBdLCBhMiA9IGFbMV0gKi9cbi8qIDIgc3RhdGVzICovXG5mdW5jdGlvbiBiaXF1YWRBcnJheURmMihjb2Vmcywgc3RhdGUsIGluRnJhbWUsIG91dEZyYW1lLCBzaXplKSB7XG4gIGZvcihsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICBvdXRGcmFtZVtpXSA9IGNvZWZzLmIwICogaW5GcmFtZVtpXSArIHN0YXRlLnhuXzFbaV07XG5cbiAgICAvLyB1cGRhdGUgc3RhdGVzXG4gICAgc3RhdGUueG5fMVtpXSA9IGNvZWZzLmIxICogaW5GcmFtZVtpXSAtIGNvZWZzLmExW2ldICogb3V0RnJhbWVbaV0gKyBzdGF0ZS54bl8yW2ldO1xuICAgIHN0YXRlLnhuXzJbaV0gPSBjb2Vmcy5iMiAqIGluRnJhbWVbaV0gLSBjb2Vmcy5hMltpXSAqIG91dEZyYW1lW2ldO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJpcXVhZCBleHRlbmRzIEJhc2VMZm8ge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBmaWx0ZXJUeXBlOidsb3dwYXNzJyxcbiAgICAgIGYwOiAxLjAsXG4gICAgICBnYWluOiAxLjAsXG4gICAgICBxOiAxLjBcbiAgICB9O1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuICAgIC8vIHRoaXMudHlwZSA9ICdiaXF1YWQnO1xuXG4gICAgLy8gZnJvbSBoZXJlIG9uIG9wdGlvbnMgaXMgdGhpcy5wYXJhbXNcblxuICAgIC8vIHRvIGltcGxlbWVudFxuICAgIC8vIGlmKG9wdHMuZGFtcCkg4oCmXG4gICAgLy8gaWYob3B0cy5kZWNheSkg4oCmXG4gICAgLy8gaWYob3B0cy5vdmVyKSDigKZcblxuICAgIC8vIHZhciBmcmFtZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGU7XG4gICAgLy8gLy8gaWYgbm8gZnJhbWVSYXRlIG9yIGZyYW1lcmF0ZSBpcyAwIHdlIHNoYWxsIGhhbHQhXG4gICAgLy8gaWYgKCFmcmFtZVJhdGUgfHwgZnJhbWVSYXRlIDw9IDApIHtcbiAgICAvLyAgIHRocm93IG5ldyBFcnJvcignVGhpcyBPcGVyYXRvciByZXF1aXJlcyBhIGZyYW1lUmF0ZSBoaWdoZXIgdGhhbiAwLicpO1xuICAgIC8vIH1cblxuICAgIC8vIHZhciBub3JtRjAgPSB0aGlzLnBhcmFtcy5mMCAvIGZyYW1lUmF0ZSxcbiAgICAvLyAgICAgZ2FpbiA9IHRoaXMucGFyYW1zLmdhaW4sXG4gICAgLy8gICAgIHE7XG5cbiAgICAvLyBpZiAodGhpcy5wYXJhbXMucSkgIHsgcSA9IHRoaXMucGFyYW1zLnE7IH1cbiAgICAvLyBpZiAodGhpcy5wYXJhbXMuYncpIHsgcSA9IHRoaXMucGFyYW1zLmYwIC8gdGhpcy5wYXJhbXMuYnc7IH1cblxuICAgIC8vIHRoaXMuY29lZnMgPSB7XG4gICAgLy8gICBiMDogMCxcbiAgICAvLyAgIGIxOiAwLFxuICAgIC8vICAgYjI6IDAsXG4gICAgLy8gICBhMTogMCxcbiAgICAvLyAgIGEyOiAwXG4gICAgLy8gfTtcblxuICAgIC8vIHZhciBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgLy8gdGhpcy5zdGF0ZSA9IHtcbiAgICAvLyAgIHhuXzE6IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplKSxcbiAgICAvLyAgIHhuXzI6IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplKSxcbiAgICAvLyAgIHluXzE6IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplKSxcbiAgICAvLyAgIHluXzI6IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplKVxuICAgIC8vIH07XG5cbiAgICAvLyBjYWxjdWxhdGVDb2Vmcyh0aGlzLnBhcmFtcy5maWx0ZXJUeXBlLCBub3JtRjAsIHEsIGdhaW4sIHRoaXMuY29lZnMpO1xuICAgIC8vIHRoaXMuc2V0dXBTdHJlYW0oKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgdmFyIGZyYW1lUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZTtcbiAgICAvLyBpZiBubyBmcmFtZVJhdGUgb3IgZnJhbWVyYXRlIGlzIDAgd2Ugc2hhbGwgaGFsdCFcbiAgICBpZiAoIWZyYW1lUmF0ZSB8fCBmcmFtZVJhdGUgPD0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIE9wZXJhdG9yIHJlcXVpcmVzIGEgZnJhbWVSYXRlIGhpZ2hlciB0aGFuIDAuJyk7XG4gICAgfVxuXG4gICAgdmFyIG5vcm1GMCA9IHRoaXMucGFyYW1zLmYwIC8gZnJhbWVSYXRlLFxuICAgICAgICBnYWluID0gdGhpcy5wYXJhbXMuZ2FpbixcbiAgICAgICAgcTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5xKSAgeyBxID0gdGhpcy5wYXJhbXMucTsgfVxuICAgIGlmICh0aGlzLnBhcmFtcy5idykgeyBxID0gdGhpcy5wYXJhbXMuZjAgLyB0aGlzLnBhcmFtcy5idzsgfVxuXG4gICAgdGhpcy5jb2VmcyA9IHtcbiAgICAgIGIwOiAwLFxuICAgICAgYjE6IDAsXG4gICAgICBiMjogMCxcbiAgICAgIGExOiAwLFxuICAgICAgYTI6IDBcbiAgICB9O1xuXG4gICAgdmFyIGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgeG5fMTogbmV3IEZsb2F0MzJBcnJheShmcmFtZVNpemUpLFxuICAgICAgeG5fMjogbmV3IEZsb2F0MzJBcnJheShmcmFtZVNpemUpLFxuICAgICAgeW5fMTogbmV3IEZsb2F0MzJBcnJheShmcmFtZVNpemUpLFxuICAgICAgeW5fMjogbmV3IEZsb2F0MzJBcnJheShmcmFtZVNpemUpXG4gICAgfTtcblxuICAgIGNhbGN1bGF0ZUNvZWZzKHRoaXMucGFyYW1zLmZpbHRlclR5cGUsIG5vcm1GMCwgcSwgZ2FpbiwgdGhpcy5jb2Vmcyk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGJpcXVhZEFycmF5RGYxKHRoaXMuY29lZnMsIHRoaXMuc3RhdGUsIGZyYW1lLCB0aGlzLm91dEZyYW1lLCBmcmFtZS5sZW5ndGgpO1xuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMub3V0RnJhbWUpO1xuICAgIHRoaXMub3V0cHV0KHRpbWUsIHRoaXMub3V0RnJhbWUsIG1ldGFEYXRhKTtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5pbXBvcnQganNmZnQgZnJvbSAnanNmZnQnO1xuaW1wb3J0IGNvbXBsZXhBcnJheSBmcm9tICdqc2ZmdC9saWIvY29tcGxleF9hcnJheSc7XG5pbXBvcnQgaW5pdFdpbmRvdyBmcm9tICcuLi91dGlscy9mZnQtd2luZG93cyc7XG5cblxuLy8gY29uc3QgUEkgICA9IE1hdGguUEk7XG4vLyBjb25zdCBjb3MgID0gTWF0aC5jb3M7XG4vLyBjb25zdCBzaW4gID0gTWF0aC5zaW47XG5jb25zdCBzcXJ0ID0gTWF0aC5zcXJ0O1xuXG5jb25zdCBpc1Bvd2VyT2ZUd28gPSBmdW5jdGlvbihudW1iZXIpIHtcbiAgd2hpbGUgKChudW1iZXIgJSAyID09PSAwKSAmJiBudW1iZXIgPiAxKSB7XG4gICAgbnVtYmVyID0gbnVtYmVyIC8gMjtcbiAgfVxuXG4gIHJldHVybiBudW1iZXIgPT09IDE7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZmdCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBmZnRTaXplOiAxMDI0LFxuICAgICAgd2luZG93TmFtZTogJ2hhbm4nLFxuICAgICAgb3V0VHlwZTogJ21hZ25pdHVkZSdcbiAgICB9O1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgaWYgKCFpc1Bvd2VyT2ZUd28odGhpcy5wYXJhbXMuZmZ0U2l6ZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZmZ0U2l6ZSBtdXN0IGJlIGEgcG93ZXIgb2YgdHdvJyk7XG4gICAgfVxuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG5cbiAgICBjb25zdCBpbkZyYW1lU2l6ZSA9IHRoaXMucGFyZW50LnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgZmZ0U2l6ZSA9IHRoaXMucGFyYW1zLmZmdFNpemU7XG4gICAgLy8ga2VlcCBvZiB0aGUgd2luZG93IHNpemUgdG8gYmUgYXBwbGllZFxuICAgIHRoaXMuYXBwbGllZFdpbmRvd1NpemUgPSBpbkZyYW1lU2l6ZSA8IGZmdFNpemUgPyBpbkZyYW1lU2l6ZSA6IGZmdFNpemU7XG4gICAgLy8gcmVmZXJlbmNlcyB0byBwb3B1bGF0ZSBpbiB3aW5kb3cgZnVuY3Rpb25zXG4gICAgdGhpcy5ub3JtYWxpemVDb2VmcyA9IHsgbGluZWFyOiAwLCBwb3dlcjogMCB9O1xuICAgIHRoaXMud2luZG93ID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmFwcGxpZWRXaW5kb3dTaXplKTtcbiAgICAvLyBpbml0IHRoZSBjb21wbGV4IGFycmF5IHRvIHJldXNlIGZvciB0aGUgRkZUXG4gICAgdGhpcy5jb21wbGV4RnJhbWUgPSBuZXcgY29tcGxleEFycmF5LkNvbXBsZXhBcnJheShmZnRTaXplKTtcblxuICAgIGluaXRXaW5kb3coXG4gICAgICB0aGlzLnBhcmFtcy53aW5kb3dOYW1lLFxuICAgICAgdGhpcy53aW5kb3csIC8vIGJ1ZmZlciB0byBwb3B1bGF0ZSB3aXRoIHRoZSB3aW5kb3dcbiAgICAgIHRoaXMuYXBwbGllZFdpbmRvd1NpemUsIC8vIGJ1ZmZlci5sZW5ndGhcbiAgICAgIHRoaXMubm9ybWFsaXplQ29lZnMgLy8gYW4gb2JqZWN0IHRvIHBvcHVsYXRlIHdpdGggdGhlIG5vcm1hbGl6YXRpb24gY29lZnNcbiAgICApO1xuXG4gICAgLy8gQXJyYXlCdWZmZXJzIHRvIHJldXNlIGluIHByb2Nlc3NcbiAgICB0aGlzLndpbmRvd2VkRnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KGZmdFNpemUpO1xuICB9XG5cbiAgY29uZmlndXJlU3RyZWFtKCkge1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmZmdFNpemUgLyAyICsgMTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0aGUgZmlyc3QgY2FsbCBvZiB0aGlzIG1ldGhvZCBjYW4gYmUgcXVpdGUgbG9uZyAofjRtcyksXG4gICAqIHRoZSBzdWJzZXF1ZW50IG9uZXMgYXJlIGZhc3RlciAofjAuNW1zKSBmb3IgZmZ0U2l6ZSA9IDEwMjRcbiAgICovXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgY29uc3QgaW5GcmFtZVNpemUgPSB0aGlzLnBhcmVudC5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IG91dEZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcbiAgICBjb25zdCBmZnRTaXplID0gdGhpcy5wYXJhbXMuZmZ0U2l6ZTtcbiAgICAvLyBjbGlwIGZyYW1lIGlmIGJpZ2dlciB0aGFuIGZmdFNpemVcbiAgICBmcmFtZSA9IChpbkZyYW1lU2l6ZSA+IGZmdFNpemUpID8gZnJhbWUuc3ViYXJyYXkoMCwgZmZ0U2l6ZSkgOiBmcmFtZTtcblxuICAgIC8vIGFwcGx5IHdpbmRvdyBvbiBmcmFtZVxuICAgIC8vID0+IGB0aGlzLndpbmRvd2AgYW5kIGBmcmFtZWAgaGF2ZSB0aGUgc2FtZSBsZW5ndGhcbiAgICAvLyA9PiBpZiBgdGhpcy53aW5kb3dlZEZyYW1lYCBpcyBiaWdnZXIsIGl0J3MgZmlsbGVkIHdpdGggemVyb1xuICAgIC8vIGFuZCB3aW5kb3cgZG9uJ3QgYXBwbHkgdGhlcmVcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXBwbGllZFdpbmRvd1NpemU7IGkrKykge1xuICAgICAgdGhpcy53aW5kb3dlZEZyYW1lW2ldID0gZnJhbWVbaV0gKiB0aGlzLndpbmRvd1tpXTtcbiAgICB9XG5cbiAgICAvLyBGRlRcbiAgICAvLyB0aGlzLmNvbXBsZXhGcmFtZSA9IG5ldyBjb21wbGV4QXJyYXkuQ29tcGxleEFycmF5KGZmdFNpemUpO1xuICAgIC8vIHJldXNlIHRoZSBzYW1lIGNvbXBsZXhGcmFtZVxuICAgIHRoaXMuY29tcGxleEZyYW1lLm1hcCgodmFsdWUsIGkpID0+IHtcbiAgICAgIHZhbHVlLnJlYWwgPSB0aGlzLndpbmRvd2VkRnJhbWVbaV07XG4gICAgICB2YWx1ZS5pbWFnID0gMDtcbiAgICB9KTtcblxuICAgIGNvbnN0IGNvbXBsZXhTcGVjdHJ1bSA9IHRoaXMuY29tcGxleEZyYW1lLkZGVCgpO1xuICAgIGNvbnN0IHNjYWxlID0gMSAvIGZmdFNpemU7XG4gICAgLy8gREMgaW5kZXhcbiAgICBjb25zdCByZWFsRGMgPSBjb21wbGV4U3BlY3RydW0ucmVhbFswXTtcbiAgICBjb25zdCBpbWFnRGMgPSBjb21wbGV4U3BlY3RydW0uaW1hZ1swXTtcbiAgICB0aGlzLm91dEZyYW1lWzBdID0gKHJlYWxEYyAqIHJlYWxEYyArIGltYWdEYyAqIGltYWdEYykgKiBzY2FsZTtcbiAgICAvLyBOcXV5c3QgaW5kZXhcbiAgICBjb25zdCByZWFsTnkgPSBjb21wbGV4U3BlY3RydW0ucmVhbFtmZnRTaXplIC8gMl07XG4gICAgY29uc3QgaW1hZ055ID0gY29tcGxleFNwZWN0cnVtLmltYWdbZmZ0U2l6ZSAvIDJdO1xuICAgIHRoaXMub3V0RnJhbWVbZmZ0U2l6ZSAvIDJdID0gKHJlYWxOeSAqIHJlYWxOeSArIGltYWdOeSAqIGltYWdOeSkgKiBzY2FsZTtcblxuICAgIC8vIHBvd2VyIHNwZWN0cnVtXG4gICAgZm9yIChsZXQgaSA9IDEsIGogPSBmZnRTaXplIC0gMTsgaSA8IGZmdFNpemUgLyAyOyBpKyssIGotLSkge1xuICAgICAgY29uc3QgcmVhbCA9IGNvbXBsZXhTcGVjdHJ1bS5yZWFsW2ldICsgY29tcGxleFNwZWN0cnVtLnJlYWxbal07XG4gICAgICBjb25zdCBpbWFnID0gY29tcGxleFNwZWN0cnVtLmltYWdbaV0gLSBjb21wbGV4U3BlY3RydW0uaW1hZ1tqXTtcblxuICAgICAgdGhpcy5vdXRGcmFtZVtpXSA9IChyZWFsICogcmVhbCArIGltYWcgKiBpbWFnKSAqIHNjYWxlO1xuICAgIH1cblxuICAgIC8vIG1hZ25pdHVkZSBzcGVjdHJ1bVxuICAgIC8vIEBOT1RFIG1heWJlIGNoZWNrIGhvdyB0byByZW1vdmUgdGhpcyBsb29wIHByb3Blcmx5XG4gICAgaWYgKHRoaXMucGFyYW1zLm91dFR5cGUgPT09ICdtYWduaXR1ZGUnKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dEZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICAgIHRoaXMub3V0RnJhbWVbaV0gPSBzcXJ0KHRoaXMub3V0RnJhbWVbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEBOT1RFIHdoYXQgc2hhbGwgd2UgZG8gd2l0aCBgdGhpcy5ub3JtYWxpemVDb2Vmc2AgP1xuICAgIC8vIHRpbWUgaXMgY2VudGVyZWQgb24gdGhlIGZyYW1lID9cbiAgICB0aGlzLnRpbWUgPSB0aW1lICsgKGluRnJhbWVTaXplIC8gc2FtcGxlUmF0ZSAvIDIpO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufVxuXG5cblxuXG5cbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZyYW1lciBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgZnJhbWVTaXplOiA1MTIsXG4gICAgICBjZW50ZXJlZFRpbWVUYWc6IGZhbHNlXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIHRoaXMuZnJhbWVJbmRleCA9IDA7XG4gIH1cblxuICBjb25maWd1cmVTdHJlYW0oKSB7XG4gICAgLy8gZGVmYXVsdHMgdG8gYGhvcFNpemVgID09PSBgZnJhbWVTaXplYFxuICAgIGlmICghdGhpcy5wYXJhbXMuaG9wU2l6ZSkge1xuICAgICAgdGhpcy5wYXJhbXMuaG9wU2l6ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB9XG5cbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5mcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSAvIHRoaXMucGFyYW1zLmhvcFNpemU7XG4gIH1cblxuICAvLyBATk9URSBtdXN0IGJlIHRlc3RlZFxuICByZXNldCgpIHtcbiAgICB0aGlzLmZyYW1lSW5kZXggPSAwO1xuICAgIHN1cGVyLnJlc2V0KCk7XG4gIH1cblxuICBmaW5hbGl6ZSgpIHtcbiAgICAvLyBATk9URSB3aGF0IGFib3V0IHRpbWUgP1xuICAgIC8vIGZpbGwgdGhlIG9uZ29pbmcgYnVmZmVyIHdpdGggMFxuICAgIGZvciAobGV0IGkgPSB0aGlzLmZyYW1lSW5kZXgsIGwgPSB0aGlzLm91dEZyYW1lLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5vdXRGcmFtZVtpXSA9IDA7XG4gICAgfVxuICAgIC8vIG91dHB1dCBpdFxuICAgIHRoaXMub3V0cHV0KCk7XG5cbiAgICBzdXBlci5maW5hbGl6ZSgpO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBibG9jaywgbWV0YURhdGEpIHtcbiAgICB2YXIgc2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG4gICAgdmFyIHNhbXBsZVBlcmlvZCA9IDEgLyBzYW1wbGVSYXRlO1xuXG4gICAgdmFyIGZyYW1lSW5kZXggPSB0aGlzLmZyYW1lSW5kZXg7XG4gICAgdmFyIGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB2YXIgYmxvY2tTaXplID0gYmxvY2subGVuZ3RoO1xuICAgIHZhciBibG9ja0luZGV4ID0gMDtcbiAgICB2YXIgaG9wU2l6ZSA9IHRoaXMucGFyYW1zLmhvcFNpemU7XG5cbiAgICB2YXIgb3V0RnJhbWUgPSB0aGlzLm91dEZyYW1lO1xuXG4gICAgd2hpbGUgKGJsb2NrSW5kZXggPCBibG9ja1NpemUpIHtcbiAgICAgIHZhciBudW1Ta2lwID0gMDtcblxuICAgICAgLy8gc2tpcCBibG9jayBzYW1wbGVzIGZvciBuZWdhdGl2ZSBmcmFtZUluZGV4XG4gICAgICBpZiAoZnJhbWVJbmRleCA8IDApIHtcbiAgICAgICAgbnVtU2tpcCA9IC1mcmFtZUluZGV4O1xuICAgICAgfVxuXG4gICAgICBpZiAobnVtU2tpcCA8IGJsb2NrU2l6ZSkge1xuICAgICAgICBibG9ja0luZGV4ICs9IG51bVNraXA7IC8vIHNraXAgYmxvY2sgc2VnbWVudFxuICAgICAgICAvLyBjYW4gY29weSBhbGwgdGhlIHJlc3Qgb2YgdGhlIGluY29taW5nIGJsb2NrXG4gICAgICAgIHZhciBudW1Db3B5ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDtcbiAgICAgICAgLy8gY29ubm90IGNvcHkgbW9yZSB0aGFuIHdoYXQgZml0cyBpbnRvIHRoZSBmcmFtZVxuICAgICAgICB2YXIgbWF4Q29weSA9IGZyYW1lU2l6ZSAtIGZyYW1lSW5kZXg7XG5cbiAgICAgICAgaWYgKG51bUNvcHkgPj0gbWF4Q29weSkge1xuICAgICAgICAgIG51bUNvcHkgPSBtYXhDb3B5O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY29weSBibG9jayBzZWdtZW50IGludG8gZnJhbWVcbiAgICAgICAgdmFyIGNvcHkgPSBibG9jay5zdWJhcnJheShibG9ja0luZGV4LCBibG9ja0luZGV4ICsgbnVtQ29weSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGJsb2NrSW5kZXgsIGZyYW1lSW5kZXgsIG51bUNvcHkpO1xuICAgICAgICBvdXRGcmFtZS5zZXQoY29weSwgZnJhbWVJbmRleCk7XG5cbiAgICAgICAgLy8gYWR2YW5jZSBibG9jayBhbmQgZnJhbWUgaW5kZXhcbiAgICAgICAgYmxvY2tJbmRleCArPSBudW1Db3B5O1xuICAgICAgICBmcmFtZUluZGV4ICs9IG51bUNvcHk7XG5cbiAgICAgICAgLy8gc2VuZCBmcmFtZSB3aGVuIGNvbXBsZXRlZFxuICAgICAgICBpZiAoZnJhbWVJbmRleCA9PT0gZnJhbWVTaXplKSB7XG4gICAgICAgICAgLy8gZGVmaW5lIHRpbWUgdGFnIGZvciB0aGUgb3V0RnJhbWUgYWNjb3JkaW5nIHRvIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICBpZiAodGhpcy5wYXJhbXMuY2VudGVyZWRUaW1lVGFnKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWUgPSB0aW1lICsgKGJsb2NrSW5kZXggLSBmcmFtZVNpemUgLyAyKSAqIHNhbXBsZVBlcmlvZDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50aW1lID0gdGltZSArIChibG9ja0luZGV4IC0gZnJhbWVTaXplKSAqIHNhbXBsZVBlcmlvZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBmb3J3YXJkIG1ldGFEYXRhID9cbiAgICAgICAgICB0aGlzLm1ldGFEYXRhID0gbWV0YURhdGE7XG5cbiAgICAgICAgICAvLyBmb3J3YXJkIHRvIG5leHQgbm9kZXNcbiAgICAgICAgICB0aGlzLm91dHB1dCgpO1xuXG4gICAgICAgICAgLy8gc2hpZnQgZnJhbWUgbGVmdFxuICAgICAgICAgIGlmIChob3BTaXplIDwgZnJhbWVTaXplKSB7XG4gICAgICAgICAgICBvdXRGcmFtZS5zZXQob3V0RnJhbWUuc3ViYXJyYXkoaG9wU2l6ZSwgZnJhbWVTaXplKSwgMCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZnJhbWVJbmRleCAtPSBob3BTaXplOyAvLyBob3AgZm9yd2FyZFxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBza2lwIGVudGlyZSBibG9ja1xuICAgICAgICB2YXIgYmxvY2tSZXN0ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDtcbiAgICAgICAgZnJhbWVJbmRleCArPSBibG9ja1Jlc3Q7XG4gICAgICAgIGJsb2NrSW5kZXggKz0gYmxvY2tSZXN0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZnJhbWVJbmRleCA9IGZyYW1lSW5kZXg7XG4gIH1cbn1cbiIsIlxuaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hZ25pdHVkZSBleHRlbmRzIEJhc2VMZm8ge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIG5vcm1hbGl6ZTogZmFsc2VcbiAgICB9O1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuICB9XG5cbiAgY29uZmlndXJlU3RyZWFtKCkge1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IDE7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IGZyYW1lLmxlbmd0aDtcbiAgICBsZXQgc3VtID0gMDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgIHN1bSArPSAoZnJhbWVbaV0gKiBmcmFtZVtpXSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyYW1zLm5vcm1hbGl6ZSkge1xuICAgICAgLy8gc3VtIGlzIGEgbWVhbiBoZXJlIChmb3Igcm1zKVxuICAgICAgc3VtIC89IGZyYW1lU2l6ZTtcbiAgICB9XG5cbiAgICB0aGlzLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMub3V0RnJhbWVbMF0gPSBNYXRoLnNxcnQoc3VtKTtcbiAgICB0aGlzLm1ldGFEYXRhID0gbWV0YURhdGE7XG5cbiAgICB0aGlzLm91dHB1dCgpO1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBtaW4gYW5kIG1heCB2YWx1ZXMgZnJvbSBlYWNoIGZyYW1lXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pbk1heCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG4gIH1cblxuICBjb25maWd1cmVTdHJlYW0oKSB7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gMjtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgbGV0IG1pbiA9ICtJbmZpbml0eTtcbiAgICBsZXQgbWF4ID0gLUluZmluaXR5O1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBmcmFtZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gZnJhbWVbaV07XG4gICAgICBpZiAodmFsdWUgPCBtaW4pIHsgbWluID0gdmFsdWU7IH1cbiAgICAgIGlmICh2YWx1ZSA+IG1heCkgeyBtYXggPSB2YWx1ZTsgfVxuICAgIH1cblxuICAgIHRoaXMudGltZSA9IHRpbWU7XG4gICAgdGhpcy5vdXRGcmFtZVswXSA9IG1pbjtcbiAgICB0aGlzLm91dEZyYW1lWzFdID0gbWF4O1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG5cbi8vIE5PVEVTOlxuLy8gLSBhZGQgJ3N5bWV0cmljYWwnIG9wdGlvbiAoaG93IHRvIGRlYWwgd2l0aCB2YWx1ZXMgYmV0d2VlbiBmcmFtZXMgPykgP1xuLy8gLSBjYW4gd2UgaW1wcm92ZSBhbGdvcml0aG0gaW1wbGVtZW50YXRpb24gP1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW92aW5nQXZlcmFnZSBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBvcmRlcjogMTAsXG4gICAgICB6ZXJvRmlsbDogdHJ1ZSxcbiAgICB9O1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5zdW0gPSAwO1xuICAgIHRoaXMuY291bnRlciA9IDA7XG4gICAgdGhpcy5xdWV1ZSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5wYXJhbXMub3JkZXIpO1xuICB9XG5cbiAgLy8gc3RyZWFtUGFyYW1zIHNob3VsZCBzdGF5IHRoZSBzYW1lID9cblxuICByZXNldCgpIHtcbiAgICBzdXBlci5yZXNldCgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnF1ZXVlLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5xdWV1ZVtpXSA9IDA7XG4gICAgfVxuXG4gICAgdGhpcy5zdW0gPSAwO1xuICAgIHRoaXMuY291bnRlciA9IDA7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGNvbnN0IG91dEZyYW1lID0gdGhpcy5vdXRGcmFtZTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5vcmRlcjtcbiAgICBjb25zdCBwdXNoSW5kZXggPSB0aGlzLnBhcmFtcy5vcmRlciAtIDE7XG4gICAgY29uc3QgemVyb0ZpbGwgPSB0aGlzLnBhcmFtcy56ZXJvRmlsbDtcbiAgICBsZXQgZGl2aXNvcjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IGN1cnJlbnQgPSBmcmFtZVtpXTtcblxuICAgICAgdGhpcy5zdW0gLT0gdGhpcy5xdWV1ZVswXTtcbiAgICAgIHRoaXMuc3VtICs9IGN1cnJlbnQ7XG5cbiAgICAgIGlmICghemVyb0ZpbGwpIHtcbiAgICAgICAgaWYgKHRoaXMuY291bnRlciA8IG9yZGVyKSB7XG4gICAgICAgICAgdGhpcy5jb3VudGVyICs9IDE7XG4gICAgICAgICAgZGl2aXNvciA9IHRoaXMuY291bnRlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkaXZpc29yID0gb3JkZXI7XG4gICAgICAgIH1cblxuICAgICAgICBvdXRGcmFtZVtpXSA9IHRoaXMuc3VtIC8gZGl2aXNvcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dEZyYW1lW2ldID0gdGhpcy5zdW0gLyBvcmRlcjtcbiAgICAgIH1cblxuICAgICAgLy8gbWFpbnRhaW4gc3RhY2tcbiAgICAgIHRoaXMucXVldWUuc2V0KHRoaXMucXVldWUuc3ViYXJyYXkoMSksIDApO1xuICAgICAgdGhpcy5xdWV1ZVtwdXNoSW5kZXhdID0gY3VycmVudDtcbiAgICB9XG5cbiAgICB0aGlzLm91dHB1dCh0aW1lLCBvdXRGcmFtZSwgbWV0YURhdGEpO1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb3ZpbmdNZWRpYW4gZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgb3JkZXI6IDksXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5vcmRlciAlIDIgPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignb3JkZXIgbXVzdCBiZSBhbiBvZGQgbnVtYmVyJyk7XG4gICAgfVxuXG4gICAgdGhpcy5xdWV1ZSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5wYXJhbXMub3JkZXIpO1xuICAgIHRoaXMuc29ydGVyID0gW107XG4gIH1cblxuICByZXNldCgpIHtcbiAgICBzdXBlci5yZXNldCgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnF1ZXVlLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5xdWV1ZVtpXSA9IDA7XG4gICAgfVxuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICBjb25zdCBvdXRGcmFtZSA9IHRoaXMub3V0RnJhbWU7XG4gICAgY29uc3QgZnJhbWVTaXplID0gZnJhbWUubGVuZ3RoO1xuICAgIGNvbnN0IG9yZGVyID0gdGhpcy5wYXJhbXMub3JkZXI7XG4gICAgY29uc3QgcHVzaEluZGV4ID0gdGhpcy5wYXJhbXMub3JkZXIgLSAxO1xuICAgIGNvbnN0IG1lZGlhbkluZGV4ID0gTWF0aC5mbG9vcihvcmRlciAvIDIpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgY29uc3QgY3VycmVudCA9IGZyYW1lW2ldO1xuICAgICAgLy8gdXBkYXRlIHF1ZXVlXG4gICAgICB0aGlzLnF1ZXVlLnNldCh0aGlzLnF1ZXVlLnN1YmFycmF5KDEpLCAwKTtcbiAgICAgIHRoaXMucXVldWVbcHVzaEluZGV4XSA9IGN1cnJlbnQ7XG4gICAgICAvLyBnZXQgbWVkaWFuXG4gICAgICB0aGlzLnNvcnRlciA9IEFycmF5LmZyb20odGhpcy5xdWV1ZS52YWx1ZXMoKSk7XG4gICAgICB0aGlzLnNvcnRlci5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG5cbiAgICAgIG91dEZyYW1lW2ldID0gdGhpcy5zb3J0ZXJbbWVkaWFuSW5kZXhdO1xuICAgIH1cblxuICAgIHRoaXMub3V0cHV0KHRpbWUsIG91dEZyYW1lLCBtZXRhRGF0YSk7XG4gIH1cbn0iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuLyoqXG4gKiBhIE5vT3AgTGZvXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vb3AgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMsIHt9KTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgdGhpcy5vdXRGcmFtZS5zZXQoZnJhbWUsIDApO1xuICAgIHRoaXMudGltZSA9IHRpbWU7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cbi8qKlxuICogYXBwbHkgYSBnaXZlbiBmdW5jdGlvbiBvbiBlYWNoIGZyYW1lXG4gKlxuICogQFNJR05BVFVSRSBzY2FsYXIgY2FsbGJhY2tcbiAqIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgZnJhbWUpIHtcbiAqICAgcmV0dXJuIGRvU29tZXRoaW5nKHZhbHVlKVxuICogfVxuICpcbiAqIEBTSUdOQVRVUkUgdmVjdG9yIGNhbGxiYWNrXG4gKiBmdW5jdGlvbih0aW1lLCBpbkZyYW1lLCBvdXRGcmFtZSkge1xuICogICBvdXRGcmFtZS5zZXQoaW5GcmFtZSwgMCk7XG4gKiAgIHJldHVybiB0aW1lICsgMTtcbiAqIH1cbiAqXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9wZXJhdG9yIGV4dGVuZHMgQmFzZUxmbyB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMsIHt9KTtcblxuICAgIHRoaXMucGFyYW1zLnR5cGUgPSB0aGlzLnBhcmFtcy50eXBlIHx8wqAnc2NhbGFyJztcblxuICAgIGlmICh0aGlzLnBhcmFtcy5vblByb2Nlc3MpIHtcbiAgICAgIHRoaXMuY2FsbGJhY2sgPSB0aGlzLnBhcmFtcy5vblByb2Nlc3MuYmluZCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICBjb25maWd1cmVTdHJlYW0oKSB7XG4gICAgaWYgKHRoaXMucGFyYW1zLnR5cGUgPT09ICd2ZWN0b3InICYmIHRoaXMucGFyYW1zLmZyYW1lU2l6ZSkge1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIH1cbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgLy8gYXBwbHkgdGhlIGNhbGxiYWNrIHRvIHRoZSBmcmFtZVxuICAgIGlmICh0aGlzLnBhcmFtcy50eXBlID09PSAndmVjdG9yJykge1xuICAgICAgdmFyIG91dFRpbWUgPSB0aGlzLmNhbGxiYWNrKHRpbWUsIGZyYW1lLCB0aGlzLm91dEZyYW1lKTtcblxuICAgICAgaWYgKG91dFRpbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aW1lID0gb3V0VGltZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBmcmFtZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdGhpcy5vdXRGcmFtZVtpXSA9IHRoaXMuY2FsbGJhY2soZnJhbWVbaV0sIGkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudGltZSA9IHRpbWU7XG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufTtcbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG5jb25zdCB3b3JrZXIgPSBgXG52YXIgaXNJbmZpbml0ZUJ1ZmZlciA9IGZhbHNlO1xudmFyIHN0YWNrID0gW107XG52YXIgYnVmZmVyO1xudmFyIGJ1ZmZlckxlbmd0aDtcbnZhciBjdXJyZW50SW5kZXg7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gIGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoYnVmZmVyTGVuZ3RoKTtcbiAgc3RhY2subGVuZ3RoID0gMDtcbiAgY3VycmVudEluZGV4ID0gMDtcbn1cblxuZnVuY3Rpb24gYXBwZW5kKGJsb2NrKSB7XG4gIHZhciBhdmFpbGFibGVTcGFjZSA9IGJ1ZmZlckxlbmd0aCAtIGN1cnJlbnRJbmRleDtcbiAgdmFyIGN1cnJlbnRCbG9jaztcbiAgLy8gcmV0dXJuIGlmIGFscmVhZHkgZnVsbFxuICBpZiAoYXZhaWxhYmxlU3BhY2UgPD0gMCkgeyByZXR1cm47IH1cblxuICBpZiAoYXZhaWxhYmxlU3BhY2UgPCBibG9jay5sZW5ndGgpIHtcbiAgICBjdXJyZW50QmxvY2sgPSBibG9jay5zdWJhcnJheSgwLCBhdmFpbGFibGVTcGFjZSk7XG4gIH0gZWxzZSB7XG4gICAgY3VycmVudEJsb2NrID0gYmxvY2s7XG4gIH1cblxuICBidWZmZXIuc2V0KGN1cnJlbnRCbG9jaywgY3VycmVudEluZGV4KTtcbiAgY3VycmVudEluZGV4ICs9IGN1cnJlbnRCbG9jay5sZW5ndGg7XG5cbiAgaWYgKGlzSW5maW5pdGVCdWZmZXIgJiYgY3VycmVudEluZGV4ID09PSBidWZmZXIubGVuZ3RoKSB7XG4gICAgc3RhY2sucHVzaChidWZmZXIpO1xuXG4gICAgY3VycmVudEJsb2NrID0gYmxvY2suc3ViYXJyYXkoYXZhaWxhYmxlU3BhY2UpO1xuICAgIGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoYnVmZmVyLmxlbmd0aCk7XG4gICAgYnVmZmVyLnNldChjdXJyZW50QmxvY2ssIDApO1xuICAgIGN1cnJlbnRJbmRleCA9IGN1cnJlbnRCbG9jay5sZW5ndGg7XG4gIH1cbn1cblxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24oZSkge1xuICBzd2l0Y2ggKGUuZGF0YS5jb21tYW5kKSB7XG4gICAgY2FzZSAnaW5pdCc6XG4gICAgICBpZiAoaXNGaW5pdGUoZS5kYXRhLmR1cmF0aW9uKSkge1xuICAgICAgICBidWZmZXJMZW5ndGggPSBlLmRhdGEuc2FtcGxlUmF0ZSAqIGUuZGF0YS5kdXJhdGlvbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlzSW5maW5pdGVCdWZmZXIgPSB0cnVlO1xuICAgICAgICBidWZmZXJMZW5ndGggPSBlLmRhdGEuc2FtcGxlUmF0ZSAqIDEwO1xuICAgICAgfVxuXG4gICAgICBpbml0KCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3Byb2Nlc3MnOlxuICAgICAgdmFyIGJsb2NrID0gbmV3IEZsb2F0MzJBcnJheShlLmRhdGEuYnVmZmVyKTtcbiAgICAgIGFwcGVuZChibG9jayk7XG5cbiAgICAgIC8vIGlmIHRoZSBidWZmZXIgaXMgZnVsbCByZXR1cm4gaXQsIG9ubHkgd29ya3Mgd2l0aCBmaW5pdGUgYnVmZmVyc1xuICAgICAgaWYgKCFpc0luZmluaXRlQnVmZmVyICYmIGN1cnJlbnRJbmRleCA9PT0gYnVmZmVyTGVuZ3RoKSB7XG4gICAgICAgIHZhciBidWYgPSBidWZmZXIuYnVmZmVyLnNsaWNlKDApO1xuICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHsgYnVmZmVyOiBidWYgfSwgW2J1Zl0pO1xuICAgICAgICBpbml0KCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2ZpbmFsaXplJzpcbiAgICAgIGlmICghaXNJbmZpbml0ZUJ1ZmZlcikge1xuICAgICAgICAvLyBAVE9ETyBhZGQgb3B0aW9uIHRvIG5vdCBjbGlwIHRoZSByZXR1cm5lZCBidWZmZXJcbiAgICAgICAgLy8gdmFsdWVzIGluIEZMb2F0MzJBcnJheSBhcmUgNCBieXRlcyBsb25nICgzMiAvIDgpXG4gICAgICAgIHZhciBjb3B5ID0gYnVmZmVyLmJ1ZmZlci5zbGljZSgwLCBjdXJyZW50SW5kZXggKiAoMzIgLyA4KSk7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoeyBidWZmZXI6IGNvcHkgfSwgW2NvcHldKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBjb3B5ID0gbmV3IEZsb2F0MzJBcnJheShzdGFjay5sZW5ndGggKiBidWZmZXJMZW5ndGggKyBjdXJyZW50SW5kZXgpO1xuICAgICAgICBzdGFjay5mb3JFYWNoKGZ1bmN0aW9uKGJ1ZmZlciwgaW5kZXgpIHtcbiAgICAgICAgICBjb3B5LnNldChidWZmZXIsIGJ1ZmZlckxlbmd0aCAqIGluZGV4KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29weS5zZXQoYnVmZmVyLnN1YmFycmF5KDAsIGN1cnJlbnRJbmRleCksIHN0YWNrLmxlbmd0aCAqIGJ1ZmZlckxlbmd0aCk7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoeyBidWZmZXI6IGNvcHkuYnVmZmVyIH0sIFtjb3B5LmJ1ZmZlcl0pO1xuICAgICAgfVxuICAgICAgaW5pdCgpO1xuICAgICAgYnJlYWs7XG4gIH1cbn0sIGZhbHNlKWA7XG5cbmxldCBhdWRpb0NvbnRleHQ7XG5cbi8qKlxuICogUmVjb3JkIGFuIGF1ZGlvIHN0cmVhbVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdWRpb1JlY29yZGVyIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGR1cmF0aW9uOiAxMCwgLy8gc2Vjb25kc1xuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG4gICAgdGhpcy5tZXRhRGF0YSA9IHt9O1xuXG4gICAgLy8gbmVlZGVkIHRvIHJldHJpdmUgYW4gQXVkaW9CdWZmZXJcbiAgICBpZiAoIXRoaXMucGFyYW1zLmN0eCkge1xuICAgICAgaWYgKCFhdWRpb0NvbnRleHQpIHsgYXVkaW9Db250ZXh0ID0gbmV3IHdpbmRvdy5BdWRpb0NvbnRleHQoKTsgfVxuICAgICAgdGhpcy5jdHggPSBhdWRpb0NvbnRleHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3R4ID0gdGhpcy5wYXJhbXMuY3R4O1xuICAgIH1cblxuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbd29ya2VyXSwgeyB0eXBlOiAndGV4dC9qYXZhc2NyaXB0JyB9KTtcbiAgICB0aGlzLndvcmtlciA9IG5ldyBXb3JrZXIod2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYikpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgLy8gcHJvcGFnYXRlIGBzdHJlYW1QYXJhbXNgIHRvIHRoZSB3b3JrZXJcbiAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh7XG4gICAgICBjb21tYW5kOiAnaW5pdCcsXG4gICAgICBkdXJhdGlvbjogdGhpcy5wYXJhbXMuZHVyYXRpb24sXG4gICAgICBzYW1wbGVSYXRlOiB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlXG4gICAgfSk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSB0cnVlO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gIH1cblxuICAvLyBjYWxsZWQgd2hlbiBgc3RvcGAgaXMgdHJpZ2dlcmVkIG9uIHRoZSBzb3VyY2VcbiAgZmluYWxpemUoKSB7XG4gICAgaWYgKCF0aGlzLl9pc1N0YXJ0ZWQpIHsgcmV0dXJuOyB9IC8vIGRvbid0IGZpbmFsaXplIGlmIG5vdCBzdGFydGVkXG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2UoeyBjb21tYW5kOiAnZmluYWxpemUnIH0pO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICBpZiAoIXRoaXMuX2lzU3RhcnRlZCkgeyByZXR1cm47IH1cbiAgICAvLyBgdGhpcy5vdXRGcmFtZWAgbXVzdCBiZSByZWNyZWF0ZWQgZWFjaCB0aW1lIGJlY2F1c2VcbiAgICAvLyBpdCBpcyBjb3BpZWQgaW4gdGhlIHdvcmtlciBhbmQgbG9zdCBmb3IgdGhpcyBjb250ZXh0XG4gICAgdGhpcy5vdXRGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWUpO1xuXG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5vdXRGcmFtZS5idWZmZXI7XG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2UoeyBjb21tYW5kOiAncHJvY2VzcycsIGJ1ZmZlcjogYnVmZmVyIH0sIFtidWZmZXJdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXRyaWV2ZSB0aGUgY3JlYXRlZCBhdWRpb0J1ZmZlclxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgcmV0cmlldmUoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gKGUpID0+IHtcbiAgICAgICAgLy8gaWYgY2FsbGVkIHdoZW4gYnVmZmVyIGlzIGZ1bGwsIHN0b3AgdGhlIHJlY29yZGVyIHRvb1xuICAgICAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLndvcmtlci5yZW1vdmVFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgICAgLy8gY3JlYXRlIGFuIGF1ZGlvIGJ1ZmZlciBmcm9tIHRoZSBkYXRhXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoZS5kYXRhLmJ1ZmZlcik7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuXG4gICAgICAgIGNvbnN0IGF1ZGlvQnVmZmVyID0gdGhpcy5jdHguY3JlYXRlQnVmZmVyKDEsIGxlbmd0aCwgc2FtcGxlUmF0ZSk7XG4gICAgICAgIGNvbnN0IGF1ZGlvQXJyYXlCdWZmZXIgPSBhdWRpb0J1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcbiAgICAgICAgYXVkaW9BcnJheUJ1ZmZlci5zZXQoYnVmZmVyLCAwKTtcblxuICAgICAgICByZXNvbHZlKGF1ZGlvQnVmZmVyKTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMud29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBjYWxsYmFjaywgZmFsc2UpO1xuICAgIH0pO1xuICB9XG59IiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZURyYXcgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9LCBleHRlbmREZWZhdWx0cyA9IHt9KSB7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZHVyYXRpb246IDEsXG4gICAgICBtaW46IC0xLFxuICAgICAgbWF4OiAxLFxuICAgICAgd2lkdGg6IDMwMCxcbiAgICAgIGhlaWdodDogMTUwLCAvLyBkZWZhdWx0IGNhbnZhcyBzaXplIGluIERPTSB0b29cbiAgICAgIGlzU3luY2hyb25pemVkOiBmYWxzZSAvLyBpcyBzZXQgdG8gdHJ1ZSBpZiB1c2VkIGluIGEgc3luY2hyb25pemVkU2lua1xuICAgIH0sIGV4dGVuZERlZmF1bHRzKTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIGlmICghdGhpcy5wYXJhbXMuY2FudmFzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BhcmFtcy5jYW52YXMgaXMgbWFuZGF0b3J5IGFuZCBtdXN0IGJlIGNhbnZhcyBET00gZWxlbWVudCcpO1xuICAgIH1cblxuICAgIC8vIHByZXBhcmUgY2FudmFzXG4gICAgdGhpcy5jYW52YXMgPSB0aGlzLnBhcmFtcy5jYW52YXM7XG4gICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgdGhpcy5jYWNoZWRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB0aGlzLmNhY2hlZEN0eCA9IHRoaXMuY2FjaGVkQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICB0aGlzLmN0eC5jYW52YXMud2lkdGggID0gdGhpcy5jYWNoZWRDdHguY2FudmFzLndpZHRoICA9IHRoaXMucGFyYW1zLndpZHRoO1xuICAgIHRoaXMuY3R4LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhY2hlZEN0eC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuXG4gICAgdGhpcy5wcmV2aW91c1RpbWUgPSAwO1xuICAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSAwO1xuICAgIHRoaXMuY3VycmVudFBhcnRpYWxTaGlmdCA9IDA7XG5cbiAgICAvLyB0aGlzLl9jYWNoZSA9IFtdO1xuICAgIC8vIHRoaXMuX3JhZklkO1xuICAgIC8vIHRoaXMuZHJhdyA9IHRoaXMuZHJhdy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLy8gaW5pdGlhbGl6ZSgpIHtcbiAgLy8gICBzdXBlci5pbml0aWFsaXplKCk7XG4gIC8vICAgLy8gdGhpcy5fcmFmSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5kcmF3KTtcbiAgLy8gfVxuXG4gIC8vIGZpbmFsaXplKCkge1xuICAvLyAgIHN1cGVyLmZpbmFsaXplKCk7XG4gIC8vICAgLy8gY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5fcmFmSWQpO1xuICAvLyB9XG5cbiAgLy8gZHJhdygpIHtcbiAgLy8gICBjb25zb2xlLmxvZygnZHJhdycsIHRoaXMuX2NhY2hlLmxlbmd0aCk7XG4gIC8vICAgdGhpcy5fY2FjaGUuZm9yRWFjaCgoaW5mb3MpID0+IHtcbiAgLy8gICAgIGNvbnNvbGUubG9nKGluZm9zKTtcbiAgLy8gICAgIHRoaXMuc2Nyb2xsTW9kZURyYXcoaW5mb3MudGltZSwgaW5mb3MuZnJhbWUpO1xuICAvLyAgIH0pO1xuXG4gIC8vICAgdGhpcy5fY2FjaGUubGVuZ3RoID0gMDtcbiAgLy8gICB0aGlzLl9yYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmRyYXcpO1xuICAvLyB9XG5cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5wYXJhbXMud2lkdGgsIHRoaXMucGFyYW1zLmhlaWdodCk7XG4gICAgdGhpcy5jYWNoZWRDdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucGFyYW1zLndpZHRoLCB0aGlzLnBhcmFtcy5oZWlnaHQpO1xuICB9XG5cbiAgc2V0dXBTdHJlYW0oKSB7XG4gICAgc3VwZXIuc2V0dXBTdHJlYW0oKTtcbiAgICB0aGlzLnByZXZpb3VzRnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSk7XG4gIH1cblxuICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUyOTQ5NTUvaG93LXRvLXNjYWxlLWRvd24tYS1yYW5nZS1vZi1udW1iZXJzLXdpdGgtYS1rbm93bi1taW4tYW5kLW1heC12YWx1ZVxuICAvLyAgICAgICAgKGItYSkoeCAtIG1pbilcbiAgLy8gZih4KSA9IC0tLS0tLS0tLS0tLS0tICsgYVxuICAvLyAgICAgICAgICBtYXggLSBtaW5cbiAgZ2V0WVBvc2l0aW9uKHZhbHVlKSB7XG4gICAgLy8gYSA9IGhlaWdodFxuICAgIC8vIGIgPSAwXG4gICAgY29uc3QgbWluID0gdGhpcy5wYXJhbXMubWluO1xuICAgIGNvbnN0IG1heCA9IHRoaXMucGFyYW1zLm1heDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG5cbiAgICByZXR1cm4gKCgoMCAtIGhlaWdodCkgKiAodmFsdWUgLSBtaW4pKSAvIChtYXggLSBtaW4pKSArIGhlaWdodDtcbiAgfVxuXG4gIC8vIHBhcmFtcyBtb2RpZmllcnNcbiAgc2V0IGR1cmF0aW9uKGR1cmF0aW9uKSB7XG4gICAgdGhpcy5wYXJhbXMuZHVyYXRpb24gPSBkdXJhdGlvbjtcbiAgfVxuXG4gIHNldCBtaW4obWluKSB7XG4gICAgdGhpcy5wYXJhbXMubWluID0gbWluO1xuICB9XG5cbiAgc2V0IG1heChtYXgpIHtcbiAgICB0aGlzLnBhcmFtcy5tYXggPSBtYXg7XG4gIH1cblxuICAvLyBtYWluIHByb2Nlc3MgbWV0aG9kXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgc3VwZXIucHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpO1xuICB9XG5cbiAgLy8gZGVmYXVsdCBkcmF3IG1vZGVcbiAgc2Nyb2xsTW9kZURyYXcodGltZSwgZnJhbWUpIHtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMucGFyYW1zLndpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMucGFyYW1zLmR1cmF0aW9uO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuXG4gICAgY29uc3QgZHQgPSB0aW1lIC0gdGhpcy5wcmV2aW91c1RpbWU7XG4gICAgY29uc3QgZlNoaWZ0ID0gKGR0IC8gZHVyYXRpb24pICogd2lkdGggLSB0aGlzLmxhc3RTaGlmdEVycm9yO1xuICAgIGNvbnN0IGlTaGlmdCA9IE1hdGgucm91bmQoZlNoaWZ0KTtcbiAgICB0aGlzLmxhc3RTaGlmdEVycm9yID0gaVNoaWZ0IC0gZlNoaWZ0O1xuXG4gICAgY29uc3QgcGFydGlhbFNoaWZ0ID0gaVNoaWZ0IC0gdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0O1xuICAgIHRoaXMuc2hpZnRDYW52YXMocGFydGlhbFNoaWZ0KTtcblxuICAgIC8vIHNoaWZ0IGFsbCBzaWJsaW5ncyBpZiBzeW5jaHJvbml6ZWRcbiAgICBpZiAodGhpcy5wYXJhbXMuaXNTeW5jaHJvbml6ZWQgJiYgdGhpcy5zeW5jaHJvbml6ZXIpIHtcbiAgICAgIHRoaXMuc3luY2hyb25pemVyLnNoaWZ0U2libGluZ3MocGFydGlhbFNoaWZ0LCB0aGlzKTtcbiAgICB9XG5cbiAgICAvLyB0cmFuc2xhdGUgdG8gdGhlIGN1cnJlbnQgZnJhbWUgYW5kIGRyYXcgYSBuZXcgcG9seWdvblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgdGhpcy5kcmF3Q3VydmUoZnJhbWUsIHRoaXMucHJldmlvdXNGcmFtZSwgaVNoaWZ0KTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICAgIC8vIHVwZGF0ZSBgY3VycmVudFBhcnRpYWxTaGlmdGBcbiAgICB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQgLT0gaVNoaWZ0O1xuICAgIC8vIHNhdmUgY3VycmVudCBzdGF0ZSBpbnRvIGJ1ZmZlciBjYW52YXNcbiAgICB0aGlzLmNhY2hlZEN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgdGhpcy5jYWNoZWRDdHguZHJhd0ltYWdlKHRoaXMuY2FudmFzLCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIHRoaXMucHJldmlvdXNGcmFtZS5zZXQoZnJhbWUsIDApO1xuICAgIHRoaXMucHJldmlvdXNUaW1lID0gdGltZTtcbiAgfVxuXG4gIHNoaWZ0Q2FudmFzKHNoaWZ0KSB7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnBhcmFtcy53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG5cbiAgICB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQgKz0gc2hpZnQ7XG5cbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjdHguZHJhd0ltYWdlKHRoaXMuY2FjaGVkQ2FudmFzLFxuICAgICAgdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0LCAwLCB3aWR0aCAtIHRoaXMuY3VycmVudFBhcnRpYWxTaGlmdCwgaGVpZ2h0LFxuICAgICAgMCwgMCwgd2lkdGggLSB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQsIGhlaWdodFxuICAgICk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgLy8gTXVzdCBpbXBsZW1lbnQgdGhlIGxvZ2ljIHRvIGRyYXcgdGhlIHNoYXBlIGJldHdlZW5cbiAgLy8gdGhlIHByZXZpb3VzIGFuZCB0aGUgY3VycmVudCBmcmFtZS5cbiAgLy8gQXNzdW1pbmcgdGhlIGNvbnRleHQgaXMgY2VudGVyZWQgb24gdGhlIGN1cnJlbnQgZnJhbWVcbiAgZHJhd0N1cnZlKGZyYW1lLCBwcmV2RnJhbWUsIGlTaGlmdCkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ211c3QgYmUgaW1wbGVtZW50ZWQnKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VEcmF3O1xuXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEJhc2VEcmF3IGZyb20gJy4vYmFzZS1kcmF3JztcbmltcG9ydCB7IGdldFJhbmRvbUNvbG9yIH0gZnJvbSAnLi4vdXRpbHMvZHJhdy11dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJwZiBleHRlbmRzIEJhc2VEcmF3IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgdHJpZ2dlcjogZmFsc2UsXG4gICAgICByYWRpdXM6IDAsXG4gICAgICBsaW5lOiB0cnVlXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcbiAgICAvLyBmb3IgbG9vcCBtb2RlXG4gICAgdGhpcy5jdXJyZW50WFBvc2l0aW9uID0gMDtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgLy8gY3JlYXRlIGFuIGFycmF5IG9mIGNvbG9ycyBhY2NvcmRpbmcgdG8gdGhlIGBvdXRGcmFtZWAgc2l6ZVxuICAgIGlmICghdGhpcy5wYXJhbXMuY29sb3JzKSB7XG4gICAgICB0aGlzLnBhcmFtcy5jb2xvcnMgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHRoaXMucGFyYW1zLmNvbG9ycy5wdXNoKGdldFJhbmRvbUNvbG9yKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIGFsbG93IHRvIHdpdGNoIGVhc2lseSBiZXR3ZWVuIHRoZSAyIG1vZGVzXG4gIHNldFRyaWdnZXIoYm9vbCkge1xuICAgIHRoaXMucGFyYW1zLnRyaWdnZXIgPSBib29sO1xuICAgIC8vIGNsZWFyIGNhbnZhcyBhbmQgY2FjaGVcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5wYXJhbXMud2lkdGgsIHRoaXMucGFyYW1zLmhlaWdodCk7XG4gICAgdGhpcy5jYWNoZWRDdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucGFyYW1zLndpZHRoLCB0aGlzLnBhcmFtcy5oZWlnaHQpO1xuICAgIC8vIHJlc2V0IGN1cnJlbnRYUG9zaXRpb25cbiAgICB0aGlzLmN1cnJlbnRYUG9zaXRpb24gPSAwO1xuICAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSAwO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSkge1xuICAgIC8vIEBUT0RPOiBjb21wYXJlIGR0IC0gaWYgZHQgPCBmcHMgcmV0dXJuOyAoPylcbiAgICBpZiAodGhpcy5wYXJhbXMudHJpZ2dlcikge1xuICAgICAgdGhpcy50cmlnZ2VyTW9kZURyYXcodGltZSwgZnJhbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNjcm9sbE1vZGVEcmF3KHRpbWUsIGZyYW1lKTtcbiAgICB9XG5cbiAgICBzdXBlci5wcm9jZXNzKHRpbWUsIGZyYW1lKTtcbiAgfVxuXG4gIC8vIGFkZCBhbiBhbHRlcm5hdGl2ZSBkcmF3aW5nIG1vZGVcbiAgLy8gZHJhdyBmcm9tIGxlZnQgdG8gcmlnaHQsIGdvIGJhY2sgdG8gbGVmdCB3aGVuID4gd2lkdGhcbiAgdHJpZ2dlck1vZGVEcmF3KHRpbWUsIGZyYW1lKSB7XG4gICAgY29uc3Qgd2lkdGggID0gdGhpcy5wYXJhbXMud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5wYXJhbXMuZHVyYXRpb247XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG5cbiAgICBjb25zdCBkdCA9IHRpbWUgLSB0aGlzLnByZXZpb3VzVGltZTtcbiAgICBjb25zdCBmU2hpZnQgPSAoZHQgLyBkdXJhdGlvbikgKiB3aWR0aCAtIHRoaXMubGFzdFNoaWZ0RXJyb3I7IC8vIHB4XG4gICAgY29uc3QgaVNoaWZ0ID0gTWF0aC5yb3VuZChmU2hpZnQpO1xuICAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSBpU2hpZnQgLSBmU2hpZnQ7XG5cbiAgICB0aGlzLmN1cnJlbnRYUG9zaXRpb24gKz0gaVNoaWZ0O1xuXG4gICAgLy8gZHJhdyB0aGUgcmlnaHQgcGFydFxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh0aGlzLmN1cnJlbnRYUG9zaXRpb24sIDApO1xuICAgIGN0eC5jbGVhclJlY3QoLWlTaGlmdCwgMCwgaVNoaWZ0LCBoZWlnaHQpO1xuICAgIHRoaXMuZHJhd0N1cnZlKGZyYW1lLCBpU2hpZnQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICAvLyBnbyBiYWNrIHRvIHRoZSBsZWZ0IG9mIHRoZSBjYW52YXMgYW5kIHJlZHJhdyB0aGUgc2FtZSB0aGluZ1xuICAgIGlmICh0aGlzLmN1cnJlbnRYUG9zaXRpb24gPiB3aWR0aCkge1xuICAgICAgLy8gZ28gYmFjayB0byBzdGFydFxuICAgICAgdGhpcy5jdXJyZW50WFBvc2l0aW9uIC09IHdpZHRoO1xuXG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnRyYW5zbGF0ZSh0aGlzLmN1cnJlbnRYUG9zaXRpb24sIDApO1xuICAgICAgY3R4LmNsZWFyUmVjdCgtaVNoaWZ0LCAwLCBpU2hpZnQsIGhlaWdodCk7XG4gICAgICB0aGlzLmRyYXdDdXJ2ZShmcmFtZSwgdGhpcy5wcmV2aW91c0ZyYW1lLCBpU2hpZnQpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cblxuICAvLyBpbXBsZW1lbnRzIGRyYXdDdXJ2ZVxuICBkcmF3Q3VydmUoZnJhbWUsIHByZXZGcmFtZSwgaVNoaWZ0KSB7XG4gICAgY29uc3QgY29sb3JzID0gdGhpcy5wYXJhbXMuY29sb3JzO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IHJhZGl1cyA9IHRoaXMucGFyYW1zLnJhZGl1cztcbiAgICAvLyBAVE9ETyB0aGlzIGNhbiBhbmQgc2hvdWxkIGJlIGFic3RyYWN0ZWRcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGZyYW1lLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIC8vIGNvbG9yIHNob3VsZCBiZWNob3NlbiBhY2NvcmRpbmcgdG8gaW5kZXhcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcnNbaV07XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcnNbaV07XG5cbiAgICAgIGNvbnN0IHBvc1kgPSB0aGlzLmdldFlQb3NpdGlvbihmcmFtZVtpXSk7XG4gICAgICAvLyBhcyBhbiBvcHRpb25zID8gcmFkaXVzID9cbiAgICAgIGlmIChyYWRpdXMgPiAwKSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmFyYygwLCBwb3NZLCByYWRpdXMsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XG4gICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByZXZGcmFtZSAmJiB0aGlzLnBhcmFtcy5saW5lKSB7XG4gICAgICAgIGNvbnN0IGxhc3RQb3NZID0gdGhpcy5nZXRZUG9zaXRpb24ocHJldkZyYW1lW2ldKTtcbiAgICAgICAgLy8gZHJhdyBsaW5lXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4Lm1vdmVUbygtaVNoaWZ0LCBsYXN0UG9zWSk7XG4gICAgICAgIGN0eC5saW5lVG8oMCwgcG9zWSk7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgfVxuXG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cblxuLyoqXG4gKiAgYWNjdW11bGF0ZSBpbnRwdXQgYW5kIGV4cG9zZSBpdCAtIGFsbG93IHZpZXcgKHNlZSB3YXZlcy11aSkgdG8gcHVsbCBkYXRhIGZvciByZW5kZXJpbmdcbiAqICBicm9kZ2UgYmV0d2VlbiBgcHVzaGAgdG8gYHB1bGxgIHBhcmFkaWdtXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJyaWRnZSBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zLCBwcm9jZXNzKSB7XG4gICAgc3VwZXIob3B0aW9ucywge30pO1xuXG4gICAgdGhpcy5wcm9jZXNzID0gcHJvY2Vzcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZGF0YSA9IHRoaXMub3V0RnJhbWUgPSBbXTtcbiAgfVxuXG4gIHNldHVwU3RyZWFtKCkge1xuICAgIHN1cGVyLnNldHVwU3RyZWFtKCk7XG4gICAgdGhpcy5kYXRhLmxlbmd0aCA9IDA7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmRhdGEubGVuZ3RoID0gMDtcbiAgfVxufSIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG5jb25zdCB3b3JrZXIgPSBgXG52YXIgX3NlcGFyYXRlQXJyYXlzID0gZmFsc2U7XG52YXIgX2RhdGEgPSBbXTtcbnZhciBfc2VwYXJhdGVBcnJheXNEYXRhID0geyB0aW1lOiBbXSwgZGF0YTogW10gfTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgX2RhdGEubGVuZ3RoID0gMDtcbiAgX3NlcGFyYXRlQXJyYXlzRGF0YS50aW1lLmxlbmd0aCA9IDA7XG4gIF9zZXBhcmF0ZUFycmF5c0RhdGEuZGF0YS5sZW5ndGggPSAwO1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzKHRpbWUsIGRhdGEpIHtcbiAgaWYgKF9zZXBhcmF0ZUFycmF5cykge1xuICAgIF9zZXBhcmF0ZUFycmF5c0RhdGEudGltZS5wdXNoKHRpbWUpO1xuICAgIF9zZXBhcmF0ZUFycmF5c0RhdGEuZGF0YS5wdXNoKGRhdGEpO1xuICB9IGVsc2Uge1xuICAgIHZhciBkYXR1bSA9IHsgdGltZTogdGltZSwgZGF0YTogZGF0YSB9O1xuICAgIF9kYXRhLnB1c2goZGF0dW0pO1xuICB9XG59XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKGUpIHtcbiAgc3dpdGNoIChlLmRhdGEuY29tbWFuZCkge1xuICAgIGNhc2UgJ2luaXQnOlxuICAgICAgX3NlcGFyYXRlQXJyYXlzID0gZS5kYXRhLnNlcGFyYXRlQXJyYXlzO1xuICAgICAgaW5pdCgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncHJvY2Vzcyc6XG4gICAgICB2YXIgdGltZSA9IGUuZGF0YS50aW1lO1xuICAgICAgdmFyIGRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KGUuZGF0YS5idWZmZXIpO1xuICAgICAgcHJvY2Vzcyh0aW1lLCBkYXRhKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2ZpbmFsaXplJzpcbiAgICAgIHZhciBkYXRhID0gX3NlcGFyYXRlQXJyYXlzID8gX3NlcGFyYXRlQXJyYXlzRGF0YSA6IF9kYXRhO1xuICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7IGRhdGE6IGRhdGEgfSk7XG4gICAgICBpbml0KCk7XG4gICAgICBicmVhaztcbiAgfVxufSk7XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEYXRhUmVjb3JkZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgLy8gZGVmYXVsdCBmb3JtYXQgaXMgW3t0aW1lLCBkYXRhfSwge3RpbWUsIGRhdGF9XVxuICAgICAgLy8gaWYgc2V0IHRvIGB0cnVlYCBmb3JtYXQgaXMgeyB0aW1lOiBbLi4uXSwgZGF0YTogWy4uLl0gfVxuICAgICAgc2VwYXJhdGVBcnJheXM6IGZhbHNlLFxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG5cbiAgICAvLyBpbml0IHdvcmtlclxuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbd29ya2VyXSwgeyB0eXBlOiAndGV4dC9qYXZhc2NyaXB0JyB9KTtcbiAgICB0aGlzLndvcmtlciA9IG5ldyBXb3JrZXIod2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYikpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG5cbiAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh7XG4gICAgICBjb21tYW5kOiAnaW5pdCcsXG4gICAgICBzZXBhcmF0ZUFycmF5czogdGhpcy5wYXJhbXMuc2VwYXJhdGVBcnJheXMsXG4gICAgfSk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSB0cnVlO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gIH1cblxuICBmaW5hbGl6ZSgpIHtcbiAgICBpZiAoIXRoaXMuX2lzU3RhcnRlZCkgeyByZXR1cm47IH1cbiAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh7IGNvbW1hbmQ6ICdmaW5hbGl6ZScgfSk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGlmICghdGhpcy5faXNTdGFydGVkKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5vdXRGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWUpO1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMub3V0RnJhbWUuYnVmZmVyO1xuXG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgICAgY29tbWFuZDogJ3Byb2Nlc3MnLFxuICAgICAgdGltZTogdGltZSxcbiAgICAgIGJ1ZmZlcjogYnVmZmVyLFxuICAgIH0sIFtidWZmZXJdKTtcblxuICB9XG5cbiAgcmV0cmlldmUoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gKGUpID0+IHtcbiAgICAgICAgdGhpcy5fc3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMud29ya2VyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBjYWxsYmFjaywgZmFsc2UpO1xuICAgICAgICByZXNvbHZlKGUuZGF0YS5kYXRhKTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMud29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBjYWxsYmFjaywgZmFsc2UpO1xuICAgIH0pO1xuICB9XG59IiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5pbXBvcnQgeyBlbmNvZGVNZXNzYWdlIH0gZnJvbSAnLi4vdXRpbHMvc29ja2V0LXV0aWxzJztcblxuLy8gc2VuZCBhbiBMZm8gc3RyZWFtIGZyb20gdGhlIGJyb3dzZXIgb3ZlciB0aGUgbmV0d29ya1xuLy8gdGhyb3VnaCBhIFdlYlNvY2tldCAtIHNob3VsZCBiZSBwYWlyZWQgd2l0aCBhIFNvY2tldFNvdXJjZVNlcnZlclxuLy8gQE5PVEU6IGRvZXMgaXQgbmVlZCB0byBpbXBsZW1lbnQgc29tZSBwaW5nIHByb2Nlc3MgdG8gbWFpbnRhaW4gY29ubmVjdGlvbiA/XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb2NrZXRDbGllbnQgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIHBvcnQ6IDMwMzAsXG4gICAgICBhZGRyZXNzOiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWVcbiAgICB9O1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5zb2NrZXQgPSBudWxsO1xuICAgIHRoaXMuaW5pdENvbm5lY3Rpb24oKTtcbiAgfVxuXG4gIGluaXRDb25uZWN0aW9uKCkge1xuICAgIHZhciBzb2NrZXRBZGRyID0gJ3dzOi8vJyArIHRoaXMucGFyYW1zLmFkZHJlc3MgKyAnOicgKyB0aGlzLnBhcmFtcy5wb3J0O1xuICAgIHRoaXMuc29ja2V0ID0gbmV3IFdlYlNvY2tldChzb2NrZXRBZGRyKTtcbiAgICB0aGlzLnNvY2tldC5iaW5hcnlUeXBlID0gJ2FycmF5YnVmZmVyJztcblxuICAgIC8vIGNhbGxiYWNrIHRvIHN0YXJ0IHRvIHdoZW4gV2ViU29ja2V0IGlzIGNvbm5lY3RlZFxuICAgIHRoaXMuc29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAgIHRoaXMucGFyYW1zLm9ub3BlbigpO1xuICAgIH07XG5cbiAgICB0aGlzLnNvY2tldC5vbmNsb3NlID0gKCkgPT4ge1xuXG4gICAgfTtcblxuICAgIHRoaXMuc29ja2V0Lm9ubWVzc2FnZSA9ICgpID0+IHtcblxuICAgIH07XG5cbiAgICB0aGlzLnNvY2tldC5vbmVycm9yID0gKGVycikgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIH07XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIHZhciBidWZmZXIgPSBlbmNvZGVNZXNzYWdlKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSk7XG4gICAgdGhpcy5zb2NrZXQuc2VuZChidWZmZXIpO1xuICB9XG59IiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5pbXBvcnQgKiBhcyB3cyBmcm9tICd3cyc7XG5pbXBvcnQgeyBlbmNvZGVNZXNzYWdlLCBhcnJheUJ1ZmZlclRvQnVmZmVyIH0gZnJvbSAnLi4vdXRpbHMvc29ja2V0LXV0aWxzJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb2NrZXRTZXJ2ZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIHBvcnQ6IDMwMzFcbiAgICB9O1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5zZXJ2ZXIgPSBudWxsO1xuICAgIHRoaXMuaW5pdFNlcnZlcigpO1xuICB9XG5cbiAgaW5pdFNlcnZlcigpIHtcbiAgICB0aGlzLnNlcnZlciA9IG5ldyB3cy5TZXJ2ZXIoeyBwb3J0OiB0aGlzLnBhcmFtcy5wb3J0IH0pO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICB2YXIgYXJyYXlCdWZmZXIgPSBlbmNvZGVNZXNzYWdlKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSk7XG4gICAgdmFyIGJ1ZmZlciA9IGFycmF5QnVmZmVyVG9CdWZmZXIoYXJyYXlCdWZmZXIpO1xuXG4gICAgdGhpcy5zZXJ2ZXIuY2xpZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGNsaWVudCkge1xuICAgICAgY2xpZW50LnNlbmQoYnVmZmVyKTtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VEcmF3IGZyb20gJy4vYmFzZS1kcmF3JztcbmltcG9ydCB7IGdldFJhbmRvbUNvbG9yIH0gZnJvbSAnLi4vdXRpbHMvZHJhdy11dGlscyc7XG5cbmxldCBjb3VudGVyID0gMDtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvbm9ncmFtIGV4dGVuZHMgQmFzZURyYXcge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBzY2FsZTogMVxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG4gIH1cblxuICBzZXQgc2NhbGUodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy5zY2FsZSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHNjYWxlKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy5zY2FsZTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgdGhpcy5zY3JvbGxNb2RlRHJhdyh0aW1lLCBmcmFtZSk7XG4gICAgc3VwZXIucHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpO1xuICB9XG5cbiAgZHJhd0N1cnZlKGZyYW1lLCBwcmV2aW91c0ZyYW1lLCBpU2hpZnQpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgY29uc3Qgc2NhbGUgPSB0aGlzLnBhcmFtcy5zY2FsZTtcbiAgICBjb25zdCBiaW5QZXJQaXhlbCA9IGZyYW1lLmxlbmd0aCAvIHRoaXMucGFyYW1zLmhlaWdodDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGVpZ2h0OyBpKyspIHtcbiAgICAgIC8vIGludGVycG9sYXRlIGJldHdlZW4gcHJldiBhbmQgbmV4dCBiaW5zXG4gICAgICAvLyBpcyBub3QgYSB2ZXJ5IGdvb2Qgc3RyYXRlZ3kgaWYgbW9yZSB0aGFuIHR3byBiaW5zIHBlciBwaXhlbHNcbiAgICAgIC8vIHNvbWUgdmFsdWVzIHdvbid0IGJlIHRha2VuIGludG8gYWNjb3VudFxuICAgICAgLy8gdGhpcyBoYWNrIGlzIG5vdCByZWxpYWJsZVxuICAgICAgLy8gLT4gY291bGQgd2UgcmVzYW1wbGUgdGhlIGZyYW1lIGluIGZyZXF1ZW5jeSBkb21haW4gP1xuICAgICAgY29uc3QgZkJpbiA9IGkgKiBiaW5QZXJQaXhlbDtcbiAgICAgIGNvbnN0IHByZXZCaW5JbmRleCA9IE1hdGguZmxvb3IoZkJpbik7XG4gICAgICBjb25zdCBuZXh0QmluSW5kZXggPSBNYXRoLmNlaWwoZkJpbik7XG5cbiAgICAgIGNvbnN0IHByZXZCaW4gPSBmcmFtZVtwcmV2QmluSW5kZXhdO1xuICAgICAgY29uc3QgbmV4dEJpbiA9IGZyYW1lW25leHRCaW5JbmRleF07XG5cbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gZkJpbiAtIHByZXZCaW5JbmRleDtcbiAgICAgIGNvbnN0IHNsb3BlID0gKG5leHRCaW4gLSBwcmV2QmluKTtcbiAgICAgIGNvbnN0IGludGVyY2VwdCA9IHByZXZCaW47XG4gICAgICBjb25zdCB3ZWlnaHRlZEJpbiA9IHNsb3BlICogcG9zaXRpb24gKyBpbnRlcmNlcHQ7XG5cbiAgICAgIGNvbnN0IHkgPSB0aGlzLnBhcmFtcy5oZWlnaHQgLSBpO1xuICAgICAgY29uc3QgYyA9IE1hdGgucm91bmQod2VpZ2h0ZWRCaW4gKiBzY2FsZSAqIDI1NSk7XG5cbiAgICAgIGN0eC5maWxsU3R5bGUgPSBgcmdiYSgke2N9LCAke2N9LCAke2N9LCAxKWA7XG4gICAgICBjdHguZmlsbFJlY3QoLWlTaGlmdCwgeSwgaVNoaWZ0LCAtMSk7XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IEJhc2VEcmF3IGZyb20gJy4vYmFzZS1kcmF3JztcbmltcG9ydCB7IGdldFJhbmRvbUNvbG9yIH0gZnJvbSAnLi4vdXRpbHMvZHJhdy11dGlscyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BlY3Ryb2dyYW0gZXh0ZW5kcyBCYXNlRHJhdyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIG1pbjogMCxcbiAgICAgIG1heDogMSxcbiAgICAgIHNjYWxlOiAxXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcbiAgfVxuXG4gIHNldCBzY2FsZSh2YWx1ZSkge1xuICAgIHRoaXMucGFyYW1zLnNjYWxlID0gdmFsdWU7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcblxuICAgIHRoaXMuX3JhZkZsYWcgPSB0cnVlO1xuICAgIGlmICghdGhpcy5wYXJhbXMuY29sb3IpIHsgdGhpcy5wYXJhbXMuY29sb3IgPSBnZXRSYW5kb21Db2xvcigpOyB9XG4gIH1cblxuICBmaW5hbGl6ZSgpIHtcbiAgICBzdXBlci5maW5hbGl6ZSgpO1xuICAgIHRoaXMuX3JhZkZsYWcgPSBmYWxzZTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgaWYgKHRoaXMuX3JhZkZsYWcpIHtcbiAgICAgIHRoaXMuX3JhZkZsYWcgPSBmYWxzZTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmRyYXdDdXJ2ZShmcmFtZSkpO1xuICAgIH1cblxuICAgIHN1cGVyLnByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKTtcbiAgfVxuXG4gIGRyYXdDdXJ2ZShmcmFtZSkge1xuICAgIGNvbnN0IG5ickJpbnMgPSBmcmFtZS5sZW5ndGg7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnBhcmFtcy53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgY29uc3QgYmluV2lkdGggPSB3aWR0aCAvIG5ickJpbnM7XG4gICAgY29uc3Qgc2NhbGUgPSB0aGlzLnBhcmFtcy5zY2FsZTtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcblxuICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYnJCaW5zOyBpKyspIHtcbiAgICAgIGNvbnN0IHggPSBpIC8gbmJyQmlucyAqIHdpZHRoO1xuICAgICAgY29uc3QgeSA9IHRoaXMuZ2V0WVBvc2l0aW9uKGZyYW1lW2ldICogc2NhbGUpO1xuXG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgYmluV2lkdGgsIGhlaWdodCAtIHkpO1xuICAgIH1cblxuICAgIHRoaXMuX3JhZkZsYWcgPSB0cnVlO1xuICB9XG59IiwiLyoqXG4gKiBpcyB1c2VkIHRvIGtlZXAgc2V2ZXJhbCBkcmF3IGluIHN5bmNcbiAqIHdoZW4gYSB2aWV3IGlzIGluc3RhbGxlZCBpbiBhIHN5bmNocm9uaXplZCBkcmF3XG4gKiB0aGUgbWV0YSB2aWV3IGlzIGluc3RhbGxlZCBhcyBhIG1lbWJlciBvZiBhbGwgaXQncyBjaGlsZHJlblxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTeW5jaHJvbml6ZWREcmF3IHtcbiAgY29uc3RydWN0b3IoLi4udmlld3MpIHtcbiAgICB0aGlzLnZpZXdzID0gW107XG4gICAgdGhpcy5hZGQuYXBwbHkodGhpcywgdmlld3MpO1xuICB9XG5cbiAgYWRkKC4uLnZpZXdzKSB7XG4gICAgdmlld3MuZm9yRWFjaCh2aWV3ID0+IHsgdGhpcy5pbnN0YWxsKHZpZXcpOyB9KTtcbiAgfVxuXG4gIGluc3RhbGwodmlldykge1xuICAgIHRoaXMudmlld3MucHVzaCh2aWV3KTtcbiAgICB2aWV3LnBhcmFtcy5pc1N5bmNocm9uaXplZCA9IHRydWU7XG4gICAgdmlldy5zeW5jaHJvbml6ZXIgPSB0aGlzO1xuICB9XG5cbiAgc2hpZnRTaWJsaW5ncyhpU2hpZnQsIHZpZXcpIHtcbiAgICB0aGlzLnZpZXdzLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICBpZiAoY2hpbGQgPT09IHZpZXcpIHsgcmV0dXJuOyB9XG4gICAgICBjaGlsZC5zaGlmdENhbnZhcyhpU2hpZnQpO1xuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZURyYXcgZnJvbSAnLi9iYXNlLWRyYXcnO1xuaW1wb3J0IHsgZ2V0UmFuZG9tQ29sb3IsIGdldEh1ZSwgaGV4VG9SR0IgfSBmcm9tICcuLi91dGlscy9kcmF3LXV0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2UgZXh0ZW5kcyBCYXNlRHJhdyB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgY29sb3JTY2hlbWU6ICdub25lJyAvLyBjb2xvciwgb3BhY2l0eVxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcblxuICAgIGlmICghdGhpcy5wYXJhbXMuY29sb3IpIHsgdGhpcy5wYXJhbXMuY29sb3IgPSBnZXRSYW5kb21Db2xvcigpOyB9XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lKSB7XG4gICAgdGhpcy5zY3JvbGxNb2RlRHJhdyh0aW1lLCBmcmFtZSk7XG4gICAgc3VwZXIucHJvY2Vzcyh0aW1lLCBmcmFtZSk7XG4gIH1cblxuICBkcmF3Q3VydmUoZnJhbWUsIHByZXZGcmFtZSwgaVNoaWZ0KSB7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG4gICAgbGV0IGNvbG9yLCBncmFkaWVudDtcblxuICAgIGNvbnN0IGhhbGZSYW5nZSA9IGZyYW1lWzFdIC8gMjtcbiAgICBjb25zdCBtZWFuID0gdGhpcy5nZXRZUG9zaXRpb24oZnJhbWVbMF0pO1xuICAgIGNvbnN0IG1pbiA9IHRoaXMuZ2V0WVBvc2l0aW9uKGZyYW1lWzBdIC0gaGFsZlJhbmdlKTtcbiAgICBjb25zdCBtYXggPSB0aGlzLmdldFlQb3NpdGlvbihmcmFtZVswXSArIGhhbGZSYW5nZSk7XG5cbiAgICBsZXQgcHJldkhhbGZSYW5nZTtcbiAgICBsZXQgcHJldk1pbjtcbiAgICBsZXQgcHJldk1heDtcblxuICAgIGlmIChwcmV2RnJhbWUpIHtcbiAgICAgIHByZXZIYWxmUmFuZ2UgPSBwcmV2RnJhbWVbMV0gLyAyO1xuICAgICAgcHJldk1pbiA9IHRoaXMuZ2V0WVBvc2l0aW9uKHByZXZGcmFtZVswXSAtIHByZXZIYWxmUmFuZ2UpO1xuICAgICAgcHJldk1heCA9IHRoaXMuZ2V0WVBvc2l0aW9uKHByZXZGcmFtZVswXSArIHByZXZIYWxmUmFuZ2UpO1xuICAgIH1cblxuICAgIHN3aXRjaCAodGhpcy5wYXJhbXMuY29sb3JTY2hlbWUpIHtcbiAgICAgIGNhc2UgJ25vbmUnOlxuICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5wYXJhbXMuY29sb3I7XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2h1ZSc6XG4gICAgICAgIGdyYWRpZW50ID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KC1pU2hpZnQsIDAsIDAsIDApO1xuXG4gICAgICAgIGlmIChwcmV2RnJhbWUpIHtcbiAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ2hzbCgnICsgZ2V0SHVlKHByZXZGcmFtZVsyXSkgKyAnLCAxMDAlLCA1MCUpJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdoc2woJyArIGdldEh1ZShmcmFtZVsyXSkgKyAnLCAxMDAlLCA1MCUpJyk7XG4gICAgICAgIH1cblxuICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ2hzbCgnICsgZ2V0SHVlKGZyYW1lWzJdKSArICcsIDEwMCUsIDUwJSknKTtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvcGFjaXR5JzpcbiAgICAgICAgY29uc3QgcmdiID0gaGV4VG9SR0IodGhpcy5wYXJhbXMuY29sb3IpO1xuICAgICAgICBncmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgtaVNoaWZ0LCAwLCAwLCAwKTtcblxuICAgICAgICBpZiAocHJldkZyYW1lKSB7XG4gICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKCcgKyByZ2Iuam9pbignLCcpICsgJywnICsgcHJldkZyYW1lWzJdICsgJyknKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoJyArIHJnYi5qb2luKCcsJykgKyAnLCcgKyBmcmFtZVsyXSArICcpJyk7XG4gICAgICAgIH1cblxuICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoJyArIHJnYi5qb2luKCcsJykgKyAnLCcgKyBmcmFtZVsyXSArICcpJyk7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5tb3ZlVG8oMCwgbWVhbik7XG4gICAgY3R4LmxpbmVUbygwLCBtYXgpO1xuXG4gICAgaWYgKHByZXZGcmFtZSkge1xuICAgICAgY3R4LmxpbmVUbygtaVNoaWZ0LCBwcmV2TWF4KTtcbiAgICAgIGN0eC5saW5lVG8oLWlTaGlmdCwgcHJldk1pbik7XG4gICAgfVxuXG4gICAgY3R4LmxpbmVUbygwLCBtaW4pO1xuICAgIGN0eC5jbG9zZVBhdGgoKTtcblxuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjZTtcbiIsImltcG9ydCBCYXNlRHJhdyBmcm9tICcuL2Jhc2UtZHJhdyc7XG5pbXBvcnQgeyBnZXRSYW5kb21Db2xvciB9IGZyb20gJy4uL3V0aWxzL2RyYXctdXRpbHMnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdmVmb3JtIGV4dGVuZHMgQmFzZURyYXcge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcblxuICAgIGlmICghdGhpcy5wYXJhbXMuY29sb3IpIHsgdGhpcy5wYXJhbXMuY29sb3IgPSBnZXRSYW5kb21Db2xvcigpOyB9XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIHRoaXMuc2Nyb2xsTW9kZURyYXcodGltZSwgZnJhbWUpO1xuICAgIC8vIHRoaXMuX2NhY2hlLnB1c2goeyB0aW1lLCBmcmFtZSB9KTtcbiAgICBzdXBlci5wcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSk7XG4gIH1cblxuICBkcmF3Q3VydmUoZnJhbWUsIHByZXZpb3VzRnJhbWUsIGlTaGlmdCkge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IG1pbiA9IHRoaXMuZ2V0WVBvc2l0aW9uKGZyYW1lWzBdKTtcbiAgICBjb25zdCBtYXggPSB0aGlzLmdldFlQb3NpdGlvbihmcmFtZVsxXSk7XG5cbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMucGFyYW1zLmNvbG9yO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcblxuICAgIGN0eC5tb3ZlVG8oMCwgdGhpcy5nZXRZUG9zaXRpb24oMCkpO1xuICAgIGN0eC5saW5lVG8oMCwgbWF4KTtcblxuICAgIGlmIChwcmV2aW91c0ZyYW1lKSB7XG4gICAgICBjb25zdCBwcmV2TWluID0gdGhpcy5nZXRZUG9zaXRpb24ocHJldmlvdXNGcmFtZVswXSk7XG4gICAgICBjb25zdCBwcmV2TWF4ID0gdGhpcy5nZXRZUG9zaXRpb24ocHJldmlvdXNGcmFtZVsxXSk7XG4gICAgICBjdHgubGluZVRvKC1pU2hpZnQsIHByZXZNYXgpO1xuICAgICAgY3R4LmxpbmVUbygtaVNoaWZ0LCBwcmV2TWluKTtcbiAgICB9XG5cbiAgICBjdHgubGluZVRvKDAsIG1pbik7XG5cbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgQXVkaW9JbiBmcm9tICcuL2F1ZGlvLWluJztcblxuY29uc3Qgd29ya2VyID0gYFxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gcHJvY2VzcyhlKSB7XG4gIHZhciBibG9ja1NpemUgPSBlLmRhdGEub3B0aW9ucy5ibG9ja1NpemU7XG4gIHZhciBzYW1wbGVSYXRlID0gZS5kYXRhLm9wdGlvbnMuc2FtcGxlUmF0ZTtcbiAgdmFyIGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoZS5kYXRhLmJ1ZmZlcik7XG5cbiAgdmFyIGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG4gIC8vIHZhciBibG9jayA9IG5ldyBGbG9hdDMyQXJyYXkoYmxvY2tTaXplKTtcblxuICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSBibG9ja1NpemUpIHtcbiAgICB2YXIgY29weVNpemUgPSBsZW5ndGggLSBpbmRleDtcbiAgICBpZiAoY29weVNpemUgPiBibG9ja1NpemUpIHsgY29weVNpemUgPSBibG9ja1NpemU7IH1cblxuICAgIHZhciBibG9jayA9IGJ1ZmZlci5zdWJhcnJheShpbmRleCwgaW5kZXggKyBjb3B5U2l6ZSk7XG4gICAgYmxvY2sgPSBuZXcgRmxvYXQzMkFycmF5KGJsb2NrKTtcblxuICAgIHBvc3RNZXNzYWdlKHsgYnVmZmVyOiBibG9jay5idWZmZXIsIHRpbWU6IGluZGV4IC8gc2FtcGxlUmF0ZSB9LCBbYmxvY2suYnVmZmVyXSk7XG4gIH1cbn0sIGZhbHNlKWA7XG5cbi8qKlxuICogQXVkaW9CdWZmZXIgYXMgc291cmNlLCBzbGljZWQgaXQgaW4gYmxvY2tzIHRocm91Z2ggYSB3b3JrZXJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXVkaW9JbkJ1ZmZlciBleHRlbmRzIEF1ZGlvSW4ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLCB7fSk7XG4gICAgdGhpcy5tZXRhRGF0YSA9IHt9O1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5zcmMgfHwgISh0aGlzLnBhcmFtcy5zcmMgaW5zdGFuY2VvZiBBdWRpb0J1ZmZlcikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQW4gQXVkaW9CdWZmZXIgc291cmNlIG11c3QgYmUgZ2l2ZW4nKTtcbiAgICB9XG4gIH1cblxuICBjb25maWd1cmVTdHJlYW0oKSB7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHRoaXMucGFyYW1zLnNyYy5zYW1wbGVSYXRlIC8gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgPSB0aGlzLnBhcmFtcy5zcmMuc2FtcGxlUmF0ZTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIC8vIGluaXQgd29ya2VyXG4gICAgLy8gQE5PVEU6IGNvdWxkIGJlIGRvbmUgb25jZSBpbiBjb25zdHJ1Y3RvciA/XG4gICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFt3b3JrZXJdLCB7IHR5cGU6IFwidGV4dC9qYXZhc2NyaXB0XCIgfSk7XG4gICAgdGhpcy53b3JrZXIgPSBuZXcgV29ya2VyKHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpKTtcbiAgICB0aGlzLndvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgdGhpcy5wcm9jZXNzLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIC8vIHByb3BhZ2F0ZSB0byB0aGUgd2hvbGUgY2hhaW5cbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLnNyYy5nZXRDaGFubmVsRGF0YSh0aGlzLmNoYW5uZWwpLmJ1ZmZlclxuXG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBzYW1wbGVSYXRlOiB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlLFxuICAgICAgICBibG9ja1NpemU6IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZVxuICAgICAgfSxcbiAgICAgIGJ1ZmZlcjogYnVmZmVyXG4gICAgfSwgW2J1ZmZlcl0pO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICAvLyBwcm9wYWdhdGUgdG8gdGhlIHdob2xlIGNoYWluXG4gICAgdGhpcy5maW5hbGl6ZSgpO1xuICB9XG5cbiAgLy8gY2FsbGJhY2sgb2YgdGhlIHdvcmtlclxuICBwcm9jZXNzKGUpIHtcbiAgICBjb25zdCBibG9jayA9IG5ldyBGbG9hdDMyQXJyYXkoZS5kYXRhLmJ1ZmZlcik7XG4gICAgdGhpcy5vdXRGcmFtZS5zZXQoYmxvY2ssIDApO1xuICAgIHRoaXMudGltZSA9IGUuZGF0YS50aW1lO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufVxuIiwiaW1wb3J0IEF1ZGlvSW4gZnJvbSAnLi9hdWRpby1pbic7XG5cbi8qKlxuICogIFVzZSBhIFdlYkF1ZGlvIG5vZGUgYXMgYSBzb3VyY2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXVkaW9Jbk5vZGUgZXh0ZW5kcyBBdWRpb0luIHtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHRpbWVUeXBlOiAnYWJzb2x1dGUnLFxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zKTtcblxuICAgIHRoaXMubWV0YURhdGEgPSB7fTtcbiAgfVxuXG4gIGNvbmZpZ3VyZVN0cmVhbSgpIHtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5mcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gdGhpcy5jdHguc2FtcGxlUmF0ZSAvIHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlID0gdGhpcy5jdHguc2FtcGxlUmF0ZTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgdmFyIGJsb2NrU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB0aGlzLnNjcmlwdFByb2Nlc3NvciA9IHRoaXMuY3R4LmNyZWF0ZVNjcmlwdFByb2Nlc3NvcihibG9ja1NpemUsIDEsIDEpO1xuICAgIC8vIHByZXBhcmUgYXVkaW8gZ3JhcGhcbiAgICB0aGlzLnNjcmlwdFByb2Nlc3Nvci5vbmF1ZGlvcHJvY2VzcyA9IHRoaXMucHJvY2Vzcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3JjLmNvbm5lY3QodGhpcy5zY3JpcHRQcm9jZXNzb3IpO1xuICB9XG5cbiAgLy8gY29ubmVjdCB0aGUgYXVkaW8gbm9kZXMgdG8gc3RhcnQgc3RyZWFtaW5nXG4gIHN0YXJ0KCkge1xuICAgIGlmICh0aGlzLnBhcmFtcy50aW1lVHlwZSA9PT0gJ3JlbGF0aXZlJykgeyB0aGlzLnRpbWUgPSAwOyB9XG5cbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gICAgLy8gc3RhcnQgXCJ0aGUgcGF0Y2hcIiA7KVxuICAgIHRoaXMuc2NyaXB0UHJvY2Vzc29yLmNvbm5lY3QodGhpcy5jdHguZGVzdGluYXRpb24pO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmZpbmFsaXplKCk7XG4gICAgdGhpcy5zY3JpcHRQcm9jZXNzb3IuZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgLy8gaXMgYmFzaWNhbGx5IHRoZSBgc2NyaXB0UHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzYCBjYWxsYmFja1xuICBwcm9jZXNzKGUpIHtcbiAgICBjb25zdCBibG9jayA9IGUuaW5wdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEodGhpcy5wYXJhbXMuY2hhbm5lbCk7XG5cbiAgICB0aGlzLnRpbWUgKz0gYmxvY2subGVuZ3RoIC8gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcbiAgICB0aGlzLm91dEZyYW1lLnNldChibG9jaywgMCk7XG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cbmxldCBhdWRpb0NvbnRleHQ7IC8vIGZvciBsYXp5IGF1ZGlvQ29udGV4dCBjcmVhdGlvblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdWRpb0luIGV4dGVuZHMgQmFzZUxmbyB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgLy8gZGVmYXVsdHNcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGZyYW1lU2l6ZTogNTEyLFxuICAgICAgY2hhbm5lbDogMCxcbiAgICB9O1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgLy8gcHJpdmF0ZVxuICAgIGlmICghdGhpcy5wYXJhbXMuY3R4KSB7XG4gICAgICBpZiAoIWF1ZGlvQ29udGV4dCkge1xuICAgICAgICBhdWRpb0NvbnRleHQgPSBuZXcgd2luZG93LkF1ZGlvQ29udGV4dCgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmN0eCA9IGF1ZGlvQ29udGV4dDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdHggPSB0aGlzLnBhcmFtcy5jdHg7XG4gICAgfVxuXG4gICAgdGhpcy5zcmMgPSB0aGlzLnBhcmFtcy5zcmM7XG4gICAgdGhpcy50aW1lID0gMDtcbiAgICB0aGlzLm1ldGFEYXRhID0ge307XG4gIH1cblxuICBzdGFydCgpIHt9XG4gIHN0b3AoKSB7fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEF1ZGlvSW47XG4iLCJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuLypcbiAgY2FuIGZvcndhcmRcbiAgICAtIHJlbGF0aXZlVGltZSAoYWNjb3JkaW5nIHRvIGl0J3Mgc3RhcnQoKSBtZXRob2QpXG4gICAgLSBhYnNvbHV0ZVRpbWUgKGF1ZGlvQ29udGV4IHRpbWUpXG4gICAgLSBpbnB1dCB0aW1lXG5cbiAgbWV0aG9kc1xuICAgIC0gYHN0YXJ0KClgIC0+IGNhbGwgYHJlc2V0KClgXG4gICAgLSBgc3RvcCgpYCAgLT4gY2FsbCBgZmluYWxpemUoKWBcbiovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50SW4gZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuXG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgdGltZVR5cGU6ICdhYnNvbHV0ZSdcbiAgICB9O1xuICAgIC8vIGNhbm5vdCBoYXZlIHByZXZpb3VzXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgLy8gdGVzdCBBdWRpb0NvbnRleHQgZm9yIHVzZSBpbiBub2RlIGVudmlyb25tZW50XG4gICAgaWYgKCF0aGlzLnBhcmFtcy5jdHggJiYgKHR5cGVvZiBwcm9jZXNzID09PSAndW5kZWZpbmVkJykpIHtcbiAgICAgIHRoaXMucGFyYW1zLmN0eCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9zdGFydFRpbWUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25maWd1cmVTdHJlYW0oKSB7XG4gICAgLy8gdGhyb3cgZXJyb3IgaWYgc29tZSB2YWx1ZXMgYXJlIHVuZGVmaW5lZCA/XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHRoaXMucGFyYW1zLmZyYW1lUmF0ZTtcbiAgICAvLyBATk9URSB3aGF0IGRvZXMgbWFrZSBzZW5zIGluIHRoaXMgY2FzZSA/XG4gICAgLy8gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZSAqIHRoaXMucGFyYW1zLmZyYW1lUmF0ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlID0gKHRoaXMucGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgfHzCoHRoaXMucGFyYW1zLmZyYW1lUmF0ZSk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICAvLyBzaG91bGQgYmUgc2V0dGVkIGluIHRoZSBmaXJzdCBwcm9jZXNzIGNhbGxcbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSB0cnVlO1xuICAgIHRoaXMuX3N0YXJ0VGltZSA9IHVuZGVmaW5lZDtcblxuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gICAgdGhpcy5fc3RhcnRUaW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZmluYWxpemUoKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhID0ge30pIHtcbiAgICBpZiAoIXRoaXMuX2lzU3RhcnRlZCkgeyByZXR1cm47IH1cbiAgICAvLyDDoCByZXZvaXJcbiAgICAvLyBpZiBubyB0aW1lIHByb3ZpZGVkLCB1c2UgYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lXG4gICAgdmFyIGZyYW1lVGltZSA9ICFpc05hTihwYXJzZUZsb2F0KHRpbWUpKSAmJiBpc0Zpbml0ZSh0aW1lKSA/XG4gICAgICB0aW1lIDogdGhpcy5wYXJhbXMuY3R4LmN1cnJlbnRUaW1lO1xuXG4gICAgLy8gc2V0IGBzdGFydFRpbWVgIGlmIGZpcnN0IGNhbGwgYWZ0ZXIgYSBgc3RhcnRgXG4gICAgaWYgKCF0aGlzLl9zdGFydFRpbWUpIHsgdGhpcy5fc3RhcnRUaW1lID0gZnJhbWVUaW1lOyB9XG5cbiAgICAvLyBoYW5kbGUgdGltZSBhY2NvcmRpbmcgdG8gY29uZmlnXG4gICAgaWYgKHRoaXMucGFyYW1zLnRpbWVUeXBlID09PSAncmVsYXRpdmUnKSB7XG4gICAgICBmcmFtZVRpbWUgPSB0aW1lIC0gdGhpcy5fc3RhcnRUaW1lO1xuICAgIH1cblxuICAgIC8vIGlmIHNjYWxhciwgY3JlYXRlIGEgdmVjdG9yXG4gICAgaWYgKGZyYW1lLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7IGZyYW1lID0gW2ZyYW1lXTsgfVxuICAgIC8vIHdvcmtzIGlmIGZyYW1lIGlzIGFuIGFycmF5XG4gICAgdGhpcy5vdXRGcmFtZS5zZXQoZnJhbWUsIDApO1xuICAgIHRoaXMudGltZSA9IGZyYW1lVGltZTtcbiAgICB0aGlzLm1ldGFEYXRhID0gbWV0YURhdGE7XG5cbiAgICB0aGlzLm91dHB1dCgpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRJbjtcbiIsImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuaW1wb3J0IHsgZGVjb2RlTWVzc2FnZSB9IGZyb20gJy4uL3V0aWxzL3NvY2tldC11dGlscyc7XG5cblxuLy8gQFRPRE86IGhhbmRsZSBgc3RhcnRgIGFuZCBgc3RvcGBcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvY2tldENsaWVudCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgcG9ydDogMzAzMSxcbiAgICAgIGFkZHJlc3M6IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZVxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICB0aGlzLnNvY2tldCA9IG51bGw7XG4gICAgdGhpcy5pbml0Q29ubmVjdGlvbigpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgY29uZmlndXJlU3RyZWFtKCkge1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSB0aGlzLnBhcmFtcy5mcmFtZVJhdGU7XG4gIH1cblxuICBpbml0Q29ubmVjdGlvbigpIHtcbiAgICB2YXIgc29ja2V0QWRkciA9ICd3czovLycgKyB0aGlzLnBhcmFtcy5hZGRyZXNzICsgJzonICsgdGhpcy5wYXJhbXMucG9ydDtcbiAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQoc29ja2V0QWRkcik7XG4gICAgdGhpcy5zb2NrZXQuYmluYXJ5VHlwZSA9ICdhcnJheWJ1ZmZlcic7XG5cbiAgICAvLyBjYWxsYmFjayB0byBzdGFydCB0byB3aGVuIFdlYlNvY2tldCBpcyBjb25uZWN0ZWRcbiAgICB0aGlzLnNvY2tldC5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfTtcblxuICAgIHRoaXMuc29ja2V0Lm9uY2xvc2UgPSAoKSA9PiB7XG5cbiAgICB9O1xuXG4gICAgdGhpcy5zb2NrZXQub25tZXNzYWdlID0gKG1lc3NhZ2UpID0+IHtcbiAgICAgIHRoaXMucHJvY2VzcyhtZXNzYWdlLmRhdGEpO1xuICAgIH07XG5cbiAgICB0aGlzLnNvY2tldC5vbmVycm9yID0gKGVycikgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIH07XG4gIH1cblxuICBwcm9jZXNzKGJ1ZmZlcikge1xuICAgIHZhciBtZXNzYWdlID0gZGVjb2RlTWVzc2FnZShidWZmZXIpO1xuXG4gICAgdGhpcy50aW1lID0gbWVzc2FnZS50aW1lO1xuICAgIHRoaXMub3V0RnJhbWUgPSBtZXNzYWdlLmZyYW1lO1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXNzYWdlLm1ldGFEYXRhO1xuXG4gICAgdGhpcy5vdXRwdXQoKTtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5pbXBvcnQgKiBhcyB3cyBmcm9tICd3cyc7XG5pbXBvcnQgeyBidWZmZXJUb0FycmF5QnVmZmVyLCBkZWNvZGVNZXNzYWdlIH0gZnJvbSAnLi4vdXRpbHMvc29ja2V0LXV0aWxzJztcblxuXG4vLyBAVE9ETzogaGFuZGxlIGBzdGFydGAgYW5kIGBzdG9wYFxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29ja2V0U2VydmVyIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBwb3J0OiAzMDMwXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIC8vIEBUT0RPIGhhbmRsZSBkaXNjb25uZWN0IGFuZCBzbyBvbi4uLlxuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuICAgIHRoaXMuc2VydmVyID0gbnVsbDtcbiAgICB0aGlzLmluaXRTZXJ2ZXIoKTtcblxuICAgIC8vIEBGSVhNRSAtIHJpZ2h0IHBsYWNlID9cbiAgICB0aGlzLnN0YXJ0KCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICBpbml0U2VydmVyKCkge1xuICAgIHRoaXMuc2VydmVyID0gbmV3IHdzLlNlcnZlcih7IHBvcnQ6IHRoaXMucGFyYW1zLnBvcnQgfSk7XG5cbiAgICB0aGlzLnNlcnZlci5vbignY29ubmVjdGlvbicsIHNvY2tldCA9PiB7XG4gICAgICAvLyB0aGlzLmNsaWVudHMucHVzaChzb2NrZXQpO1xuICAgICAgc29ja2V0Lm9uKCdtZXNzYWdlJywgdGhpcy5wcm9jZXNzLmJpbmQodGhpcykpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvY2VzcyhidWZmZXIpIHtcbiAgICB2YXIgYXJyYXlCdWZmZXIgPSBidWZmZXJUb0FycmF5QnVmZmVyKGJ1ZmZlcik7XG4gICAgdmFyIG1lc3NhZ2UgPSBkZWNvZGVNZXNzYWdlKGFycmF5QnVmZmVyKTtcblxuICAgIHRoaXMudGltZSA9IG1lc3NhZ2UudGltZTtcbiAgICB0aGlzLm91dEZyYW1lID0gbWVzc2FnZS5mcmFtZTtcbiAgICB0aGlzLm1ldGFEYXRhID0gbWVzc2FnZS5tZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn0iLCIvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE0ODQ1MDYvcmFuZG9tLWNvbG9yLWdlbmVyYXRvci1pbi1qYXZhc2NyaXB0XG5jb25zdCBnZXRSYW5kb21Db2xvciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbGV0dGVycyA9ICcwMTIzNDU2Nzg5QUJDREVGJy5zcGxpdCgnJyk7XG4gIHZhciBjb2xvciA9ICcjJztcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCA2OyBpKysgKSB7XG4gICAgY29sb3IgKz0gbGV0dGVyc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNildO1xuICB9XG4gIHJldHVybiBjb2xvcjtcbn07XG5cbi8vIHNjYWxlIGZyb20gZG9tYWluIFswLCAxXSB0byByYW5nZSBbMjcwLCAwXSB0byBjb25zdW1lIGluXG4vLyBoc2woeCwgMTAwJSwgNTAlKSBjb2xvciBzY2hlbWVcbmNvbnN0IGdldEh1ZSA9IGZ1bmN0aW9uKHgpIHtcbiAgdmFyIGRvbWFpbk1pbiA9IDA7XG4gIHZhciBkb21haW5NYXggPSAxO1xuICB2YXIgcmFuZ2VNaW4gPSAyNzA7XG4gIHZhciByYW5nZU1heCA9IDA7XG5cbiAgcmV0dXJuICgoKHJhbmdlTWF4IC0gcmFuZ2VNaW4pICogKHggLSBkb21haW5NaW4pKSAvIChkb21haW5NYXggLSBkb21haW5NaW4pKSArIHJhbmdlTWluO1xufTtcblxuY29uc3QgaGV4VG9SR0IgPSBmdW5jdGlvbihoZXgpIHtcbiAgaGV4ID0gaGV4LnN1YnN0cmluZygxLCA3KTtcbiAgdmFyIHIgPSBwYXJzZUludChoZXguc3Vic3RyaW5nKDAsIDIpLCAxNik7XG4gIHZhciBnID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZygyLCA0KSwgMTYpO1xuICB2YXIgYiA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoNCwgNiksIDE2KTtcbiAgcmV0dXJuIFtyLCBnLCBiXTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgZ2V0UmFuZG9tQ29sb3IsIGdldEh1ZSwgaGV4VG9SR0IgfTsiLCJcbi8vIHNob3J0Y3V0cyAvIGhlbHBlcnNcbmNvbnN0IFBJICAgPSBNYXRoLlBJO1xuY29uc3QgY29zICA9IE1hdGguY29zO1xuY29uc3Qgc2luICA9IE1hdGguc2luO1xuY29uc3Qgc3FydCA9IE1hdGguc3FydDtcblxuLy8gd2luZG93IGNyZWF0aW9uIGZ1bmN0aW9uc1xuZnVuY3Rpb24gaW5pdEhhbm5XaW5kb3coYnVmZmVyLCBzaXplLCBub3JtQ29lZnMpIHtcbiAgbGV0IGxpblN1bSA9IDA7XG4gIGxldCBwb3dTdW0gPSAwO1xuICBjb25zdCBzdGVwID0gMiAqIFBJIC8gc2l6ZTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgIGNvbnN0IHBoaSA9IGkgKiBzdGVwO1xuICAgIGNvbnN0IHZhbHVlID0gMC41IC0gMC41ICogY29zKHBoaSk7XG5cbiAgICBidWZmZXJbaV0gPSB2YWx1ZTtcblxuICAgIGxpblN1bSArPSB2YWx1ZTtcbiAgICBwb3dTdW0gKz0gdmFsdWUgKiB2YWx1ZTtcbiAgfVxuXG4gIG5vcm1Db2Vmcy5saW5lYXIgPSBzaXplIC8gbGluU3VtO1xuICBub3JtQ29lZnMucG93ZXIgPSBzcXJ0KHNpemUgLyBwb3dTdW0pO1xufVxuXG5mdW5jdGlvbiBpbml0SGFtbWluZ1dpbmRvdyhidWZmZXIsIHNpemUsIG5vcm1Db2Vmcykge1xuICBsZXQgbGluU3VtID0gMDtcbiAgbGV0IHBvd1N1bSA9IDA7XG4gIGNvbnN0IHN0ZXAgPSAyICogUEkgLyBzaXplO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgY29uc3QgcGhpID0gaSAqIHN0ZXA7XG4gICAgY29uc3QgdmFsdWUgPSAwLjU0IC0gMC40NiAqIGNvcyhwaGkpO1xuXG4gICAgYnVmZmVyW2ldID0gdmFsdWU7XG5cbiAgICBsaW5TdW0gKz0gdmFsdWU7XG4gICAgcG93U3VtICs9IHZhbHVlICogdmFsdWU7XG4gIH1cblxuICBub3JtQ29lZnMubGluZWFyID0gc2l6ZSAvIGxpblN1bTtcbiAgbm9ybUNvZWZzLnBvd2VyID0gc3FydChzaXplIC8gcG93U3VtKTtcbn1cblxuZnVuY3Rpb24gaW5pdEJsYWNrbWFuV2luZG93KGJ1ZmZlciwgc2l6ZSwgbm9ybUNvZWZzKSB7XG4gIGxldCBsaW5TdW0gPSAwO1xuICBsZXQgcG93U3VtID0gMDtcbiAgY29uc3Qgc3RlcCA9IDIgKiBQSSAvIHNpemU7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICBjb25zdCBwaGkgPSBpICogc3RlcDtcbiAgICBjb25zdCB2YWx1ZSA9IDAuNDIgLSAwLjUgKiBjb3MocGhpKSArIDAuMDggKiBjb3MoMiAqIHBoaSk7XG5cbiAgICBidWZmZXJbaV0gPSB2YWx1ZTtcblxuICAgIGxpblN1bSArPSB2YWx1ZTtcbiAgICBwb3dTdW0gKz0gdmFsdWUgKiB2YWx1ZTtcbiAgfVxuXG4gIG5vcm1Db2Vmcy5saW5lYXIgPSBzaXplIC8gbGluU3VtO1xuICBub3JtQ29lZnMucG93ZXIgPSBzcXJ0KHNpemUgLyBwb3dTdW0pO1xufVxuXG5mdW5jdGlvbiBpbml0QmxhY2ttYW5IYXJyaXNXaW5kb3coYnVmZmVyLCBzaXplLCBub3JtQ29lZnMpIHtcbiAgbGV0IGxpblN1bSA9IDA7XG4gIGxldCBwb3dTdW0gPSAwO1xuICBjb25zdCBhMCA9IDAuMzU4NzU7XG4gIGNvbnN0IGExID0gMC40ODgyOTtcbiAgY29uc3QgYTIgPSAwLjE0MTI4O1xuICBjb25zdCBhMyA9IDAuMDExNjg7XG4gIGNvbnN0IHN0ZXAgPSAyICogUEkgLyBzaXplO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgY29uc3QgcGhpID0gaSAqIHN0ZXA7XG4gICAgY29uc3QgdmFsdWUgPSBhMCAtIGExICogY29zKHBoaSkgKyBhMiAqIGNvcygyICogcGhpKTsgLSBhMyAqIGNvcygzICogcGhpKTtcblxuICAgIGJ1ZmZlcltpXSA9IHZhbHVlO1xuXG4gICAgbGluU3VtICs9IHZhbHVlO1xuICAgIHBvd1N1bSArPSB2YWx1ZSAqIHZhbHVlO1xuICB9XG5cbiAgbm9ybUNvZWZzLmxpbmVhciA9IHNpemUgLyBsaW5TdW07XG4gIG5vcm1Db2Vmcy5wb3dlciA9IHNxcnQoc2l6ZSAvIHBvd1N1bSk7XG59XG5cbmZ1bmN0aW9uIGluaXRTaW5lV2luZG93KGJ1ZmZlciwgc2l6ZSwgbm9ybUNvZWZzKSB7XG4gIGxldCBsaW5TdW0gPSAwO1xuICBsZXQgcG93U3VtID0gMDtcbiAgY29uc3Qgc3RlcCA9IFBJIC8gc2l6ZTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgIGNvbnN0IHBoaSA9IGkgKiBzdGVwO1xuICAgIGNvbnN0IHZhbHVlID0gc2luKHBoaSk7XG5cbiAgICBidWZmZXJbaV0gPSB2YWx1ZTtcblxuICAgIGxpblN1bSArPSB2YWx1ZTtcbiAgICBwb3dTdW0gKz0gdmFsdWUgKiB2YWx1ZTtcbiAgfVxuXG4gIG5vcm1Db2Vmcy5saW5lYXIgPSBzaXplIC8gbGluU3VtO1xuICBub3JtQ29lZnMucG93ZXIgPSBzcXJ0KHNpemUgLyBwb3dTdW0pO1xufVxuXG5mdW5jdGlvbiBpbml0UmVjdGFuZ2xlV2luZG93KGJ1ZmZlciwgc2l6ZSwgbm9ybUNvZWZzKSB7XG4gIC8vIEBUT0RPIG5vcm1Db2Vmc1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgIGJ1ZmZlcltpXSA9IDE7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uKCkge1xuICAvLyBATk9URSBpbXBsZW1lbnQgc29tZSBjYWNoaW5nIHN5c3RlbSAoaXMgdGhpcyByZWFsbHkgdXNlZnVsbCA/KVxuICBjb25zdCBjYWNoZSA9IHt9O1xuXG4gIHJldHVybiBmdW5jdGlvbihuYW1lLCBidWZmZXIsIHNpemUsIG5vcm1Db2Vmcykge1xuICAgIG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgIGNhc2UgJ2hhbm4nOlxuICAgICAgY2FzZSAnaGFubmluZyc6XG4gICAgICAgIGluaXRIYW5uV2luZG93KGJ1ZmZlciwgc2l6ZSwgbm9ybUNvZWZzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdoYW1taW5nJzpcbiAgICAgICAgaW5pdEhhbW1pbmdXaW5kb3coYnVmZmVyLCBzaXplLCBub3JtQ29lZnMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JsYWNrbWFuJzpcbiAgICAgICAgaW5pdEJsYWNrbWFuV2luZG93KGJ1ZmZlciwgc2l6ZSwgbm9ybUNvZWZzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdibGFja21hbmhhcnJpcyc6XG4gICAgICAgIGluaXRCbGFja21hbkhhcnJpc1dpbmRvdyhidWZmZXIsIHNpemUsIG5vcm1Db2Vmcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2luZSc6XG4gICAgICAgIGluaXRTaW5lV2luZG93KGJ1ZmZlciwgc2l6ZSwgbm9ybUNvZWZzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZWN0YW5nbGUnOlxuICAgICAgICBpbml0UmVjdGFuZ2xlV2luZG93KGJ1ZmZlciwgc2l6ZSwgbm9ybUNvZWZzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59KCkpOyIsIlxuLy8gaHR0cDovL3VwZGF0ZXMuaHRtbDVyb2Nrcy5jb20vMjAxMi8wNi9Ib3ctdG8tY29udmVydC1BcnJheUJ1ZmZlci10by1hbmQtZnJvbS1TdHJpbmdcbmZ1bmN0aW9uIFVpbnQxNkFycmF5MnN0cihidWYpIHtcbiAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgYnVmKTtcbn1cblxuZnVuY3Rpb24gc3RyMlVpbnQxNkFycmF5KHN0cikge1xuICB2YXIgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKHN0ci5sZW5ndGggKiAyKTsgLy8gMiBieXRlcyBmb3IgZWFjaCBjaGFyXG4gIHZhciBidWZmZXJWaWV3ID0gbmV3IFVpbnQxNkFycmF5KGJ1ZmZlcik7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBzdHIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgYnVmZmVyVmlld1tpXSA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICB9XG4gIHJldHVybiBidWZmZXJWaWV3O1xufVxuXG4vL2h0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvODYwOTI4OS9jb252ZXJ0LWEtYmluYXJ5LW5vZGVqcy1idWZmZXItdG8tamF2YXNjcmlwdC1hcnJheWJ1ZmZlclxuLy8gY29udmVydHMgYSBub2RlanMgQnVmZmVyIHRvIEFycmF5QnVmZmVyXG5tb2R1bGUuZXhwb3J0cy5idWZmZXJUb0FycmF5QnVmZmVyID0gZnVuY3Rpb24oYnVmZmVyKSB7XG4gIHZhciBhYiA9IG5ldyBBcnJheUJ1ZmZlcihidWZmZXIubGVuZ3RoKTtcbiAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShhYik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnVmZmVyLmxlbmd0aDsgKytpKSB7XG4gICAgdmlld1tpXSA9IGJ1ZmZlcltpXTtcbiAgfVxuICByZXR1cm4gYWI7XG59XG5cbm1vZHVsZS5leHBvcnRzLmFycmF5QnVmZmVyVG9CdWZmZXIgPSBmdW5jdGlvbihhcnJheUJ1ZmZlcikge1xuICB2YXIgYnVmZmVyID0gbmV3IEJ1ZmZlcihhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoKTtcbiAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnVmZmVyLmxlbmd0aDsgKytpKSB7XG4gICAgYnVmZmVyW2ldID0gdmlld1tpXTtcbiAgfVxuICByZXR1cm4gYnVmZmVyO1xufVxuXG4vLyBAVE9ETyBgZW5jb2RlTWVzc2FnZWAgYW5kIGBkZWNvZGVNZXNzYWdlYCBjb3VsZCBwcm9iYWJseSB1c2UgRGF0YVZpZXcgdG8gcGFyc2UgdGhlIGJ1ZmZlclxuXG4vLyBjb25jYXQgdGhlIGxmbyBzdHJlYW0sIHRpbWUgYW5kIG1ldGFEYXRhIGludG8gYSBzaW5nbGUgYnVmZmVyXG4vLyB0aGUgY29uY2F0ZW5hdGlvbiBpcyBkb25lIGFzIGZvbGxvdyA6XG4vLyAgKiB0aW1lICAgICAgICAgID0+IDggYnl0ZXNcbi8vICAqIGZyYW1lLmxlbmd0aCAgPT4gMiBieXRlc1xuLy8gICogZnJhbWUgICAgICAgICA9PiA0ICogZnJhbWVMZW5ndGggYnl0ZXNcbi8vICAqIG1ldGFEYXRhICAgICAgPT4gcmVzdCBvZiB0aGUgbWVzc2FnZVxuLy8gQHJldHVybiAgQXJyYXlCdWZmZXIgb2YgdGhlIGNyZWF0ZWQgbWVzc2FnZVxuLy8gQG5vdGUgICAgbXVzdCBjcmVhdGUgYSBuZXcgYnVmZmVyIGVhY2ggdGltZSBiZWNhdXNlIG1ldGFEYXRhIGxlbmd0aCBpcyBub3Qga25vd25cbm1vZHVsZS5leHBvcnRzLmVuY29kZU1lc3NhZ2UgPSBmdW5jdGlvbih0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgIC8vIHNob3VsZCBwcm9iYWJseSB1c2UgdXNlIERhdGFWaWV3IGluc3RlYWRcbiAgLy8gaHR0cDovL3d3dy5odG1sNXJvY2tzLmNvbS9lbi90dXRvcmlhbHMvd2ViZ2wvdHlwZWRfYXJyYXlzL1xuICB2YXIgdGltZTY0ID0gbmV3IEZsb2F0NjRBcnJheSgxKTtcbiAgdGltZTY0WzBdID0gdGltZTtcbiAgdmFyIHRpbWUxNiA9IG5ldyBVaW50MTZBcnJheSh0aW1lNjQuYnVmZmVyKTtcblxuICB2YXIgbGVuZ3RoMTYgPSBuZXcgVWludDE2QXJyYXkoMSk7XG4gIGxlbmd0aDE2WzBdID0gZnJhbWUubGVuZ3RoO1xuXG4gIHZhciBmcmFtZTE2ID0gbmV3IFVpbnQxNkFycmF5KGZyYW1lLmJ1ZmZlcik7XG5cbiAgdmFyIG1ldGFEYXRhMTYgPSBzdHIyVWludDE2QXJyYXkoSlNPTi5zdHJpbmdpZnkobWV0YURhdGEpKTtcblxuICB2YXIgYnVmZmVyTGVuZ3RoID0gdGltZTE2Lmxlbmd0aCArIGxlbmd0aDE2Lmxlbmd0aCArIGZyYW1lMTYubGVuZ3RoICsgbWV0YURhdGExNi5sZW5ndGg7XG5cbiAgdmFyIGJ1ZmZlciA9IG5ldyBVaW50MTZBcnJheShidWZmZXJMZW5ndGgpO1xuXG4gIC8vIGJ1ZmZlciBpcyB0aGUgY29uY2F0ZW5hdGlvbiBvZiB0aW1lLCBmcmFtZUxlbmd0aCwgZnJhbWUsIG1ldGFEYXRhXG4gIGJ1ZmZlci5zZXQodGltZTE2LCAwKTtcbiAgYnVmZmVyLnNldChsZW5ndGgxNiwgdGltZTE2Lmxlbmd0aCk7XG4gIGJ1ZmZlci5zZXQoZnJhbWUxNiwgdGltZTE2Lmxlbmd0aCArIGxlbmd0aDE2Lmxlbmd0aCk7XG4gIGJ1ZmZlci5zZXQobWV0YURhdGExNiwgdGltZTE2Lmxlbmd0aCArIGxlbmd0aDE2Lmxlbmd0aCArIGZyYW1lMTYubGVuZ3RoKTtcblxuICByZXR1cm4gYnVmZmVyLmJ1ZmZlcjtcbn1cblxuLy8gcmVjcmVhdGUgdGhlIExmbyBzdHJlYW0gKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkgZm9ybSBhIGJ1ZmZlclxuLy8gY3JlYXRlZCB3aXRoIGBlbmNvZGVNZXNzYWdlYFxubW9kdWxlLmV4cG9ydHMuZGVjb2RlTWVzc2FnZSA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICAvLyB0aW1lIGlzIGEgZmxvYXQ2NEFycmF5IG9mIHNpemUgMSAoOCBieXRlcylcbiAgdmFyIHRpbWVBcnJheSA9IG5ldyBGbG9hdDY0QXJyYXkoYnVmZmVyLnNsaWNlKDAsIDgpKTtcbiAgdmFyIHRpbWUgPSB0aW1lQXJyYXlbMF07XG5cbiAgLy8gZnJhbWUgbGVuZ3RoIGlzIGVuY29kZWQgaW4gMiBieXRlc1xuICB2YXIgZnJhbWVMZW5ndGhBcnJheSA9IG5ldyBVaW50MTZBcnJheShidWZmZXIuc2xpY2UoOCwgMTApKTtcbiAgdmFyIGZyYW1lTGVuZ3RoID0gZnJhbWVMZW5ndGhBcnJheVswXTtcblxuICAvLyBmcmFtZSBpcyBhIGZsb2F0MzJBcnJheSAoNCBieXRlcykgKiBmcmFtZUxlbmd0aFxuICB2YXIgZnJhbWVCeXRlTGVuZ3RoID0gNCAqIGZyYW1lTGVuZ3RoO1xuICB2YXIgZnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KGJ1ZmZlci5zbGljZSgxMCwgMTAgKyBmcmFtZUJ5dGVMZW5ndGgpKTtcblxuICAvLyBtZXRhRGF0YSBpcyB0aGUgcmVzdCBvZiB0aGUgYnVmZmVyXG4gIHZhciBtZXRhRGF0YUFycmF5ID0gbmV3IFVpbnQxNkFycmF5KGJ1ZmZlci5zbGljZSgxMCArIGZyYW1lQnl0ZUxlbmd0aCkpO1xuICAvLyBKU09OLnBhcnNlIGhlcmUgY3Jhc2hlcyBub2RlIGJlY2F1c2Ugb2YgdGhpcyBjaGFyYWN0ZXIgOiBgXFx1MDAwMGAgKG51bGwgaW4gdW5pY29kZSkgPz9cbiAgdmFyIG1ldGFEYXRhID0gVWludDE2QXJyYXkyc3RyKG1ldGFEYXRhQXJyYXkpO1xuICBtZXRhRGF0YSA9IEpTT04ucGFyc2UobWV0YURhdGEucmVwbGFjZSgvXFx1MDAwMC9nLCAnJykpO1xuXG4gIHJldHVybiB7IHRpbWUsIGZyYW1lLCBtZXRhRGF0YSB9O1xufVxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vYXJyYXkvZnJvbVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvYXNzaWduXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9jcmVhdGVcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3Byb21pc2VcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9PYmplY3QkZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHlcIilbXCJkZWZhdWx0XCJdO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IChmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuXG4gICAgICBfT2JqZWN0JGRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gIH07XG59KSgpO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX09iamVjdCRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JcIilbXCJkZWZhdWx0XCJdO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIGdldChfeCwgX3gyLCBfeDMpIHtcbiAgdmFyIF9hZ2FpbiA9IHRydWU7XG5cbiAgX2Z1bmN0aW9uOiB3aGlsZSAoX2FnYWluKSB7XG4gICAgdmFyIG9iamVjdCA9IF94LFxuICAgICAgICBwcm9wZXJ0eSA9IF94MixcbiAgICAgICAgcmVjZWl2ZXIgPSBfeDM7XG4gICAgX2FnYWluID0gZmFsc2U7XG4gICAgaWYgKG9iamVjdCA9PT0gbnVsbCkgb2JqZWN0ID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4gICAgdmFyIGRlc2MgPSBfT2JqZWN0JGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTtcblxuICAgIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3ggPSBwYXJlbnQ7XG4gICAgICAgIF94MiA9IHByb3BlcnR5O1xuICAgICAgICBfeDMgPSByZWNlaXZlcjtcbiAgICAgICAgX2FnYWluID0gdHJ1ZTtcbiAgICAgICAgZGVzYyA9IHBhcmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY29udGludWUgX2Z1bmN0aW9uO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIHtcbiAgICAgIHJldHVybiBkZXNjLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7XG5cbiAgICAgIGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9PYmplY3QkY3JlYXRlID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvY3JlYXRlXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9PYmplY3Qkc2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9zZXQtcHJvdG90eXBlLW9mXCIpW1wiZGVmYXVsdFwiXTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gX09iamVjdCRjcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIF9PYmplY3Qkc2V0UHJvdG90eXBlT2YgPyBfT2JqZWN0JHNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICBcImRlZmF1bHRcIjogb2JqXG4gIH07XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkge1xuICAgIHJldHVybiBvYmo7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG5ld09iaiA9IHt9O1xuXG4gICAgaWYgKG9iaiAhPSBudWxsKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5ld09ialtcImRlZmF1bHRcIl0gPSBvYmo7XG4gICAgcmV0dXJuIG5ld09iajtcbiAgfVxufTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LmFycmF5LmZyb20nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kLmNvcmUnKS5BcnJheS5mcm9tOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kLmNvcmUnKS5PYmplY3QuYXNzaWduOyIsInZhciAkID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZShQLCBEKXtcbiAgcmV0dXJuICQuY3JlYXRlKFAsIEQpO1xufTsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvJCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBkZXNjKXtcbiAgcmV0dXJuICQuc2V0RGVzYyhpdCwga2V5LCBkZXNjKTtcbn07IiwidmFyICQgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQnKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xuICByZXR1cm4gJC5nZXREZXNjKGl0LCBrZXkpO1xufTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQuY29yZScpLk9iamVjdC5zZXRQcm90b3R5cGVPZjsiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYucHJvbWlzZScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzLyQuY29yZScpLlByb21pc2U7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZighaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vJC53a3MnKSgndG9TdHJpbmdUYWcnKVxuICAvLyBFUzMgd3JvbmcgaGVyZVxuICAsIEFSRyA9IGNvZihmdW5jdGlvbigpeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gKE8gPSBPYmplY3QoaXQpKVtUQUddKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07IiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTsiLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0ge3ZlcnNpb246ICcxLjIuNid9O1xuaWYodHlwZW9mIF9fZSA9PSAnbnVtYmVyJylfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmEtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmKHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XG4gIHN3aXRjaChsZW5ndGgpe1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07IiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vJC5mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBkb2N1bWVudCA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKS5kb2N1bWVudFxuICAvLyBpbiBvbGQgSUUgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCdcbiAgLCBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgY29yZSAgICAgID0gcmVxdWlyZSgnLi8kLmNvcmUnKVxuICAsIGN0eCAgICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GXG4gICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG4gICAgLCBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TXG4gICAgLCBJU19QUk9UTyAgPSB0eXBlICYgJGV4cG9ydC5QXG4gICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG4gICAgLCBJU19XUkFQICAgPSB0eXBlICYgJGV4cG9ydC5XXG4gICAgLCBleHBvcnRzICAgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KVxuICAgICwgdGFyZ2V0ICAgID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXVxuICAgICwga2V5LCBvd24sIG91dDtcbiAgaWYoSVNfR0xPQkFMKXNvdXJjZSA9IG5hbWU7XG4gIGZvcihrZXkgaW4gc291cmNlKXtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiBrZXkgaW4gdGFyZ2V0O1xuICAgIGlmKG93biAmJiBrZXkgaW4gZXhwb3J0cyljb250aW51ZTtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG4gICAgZXhwb3J0c1trZXldID0gSVNfR0xPQkFMICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nID8gc291cmNlW2tleV1cbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcbiAgICA6IElTX1dSQVAgJiYgdGFyZ2V0W2tleV0gPT0gb3V0ID8gKGZ1bmN0aW9uKEMpe1xuICAgICAgdmFyIEYgPSBmdW5jdGlvbihwYXJhbSl7XG4gICAgICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgQyA/IG5ldyBDKHBhcmFtKSA6IEMocGFyYW0pO1xuICAgICAgfTtcbiAgICAgIEZbUFJPVE9UWVBFXSA9IENbUFJPVE9UWVBFXTtcbiAgICAgIHJldHVybiBGO1xuICAgIC8vIG1ha2Ugc3RhdGljIHZlcnNpb25zIGZvciBwcm90b3R5cGUgbWV0aG9kc1xuICAgIH0pKG91dCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICBpZihJU19QUk9UTykoZXhwb3J0c1tQUk9UT1RZUEVdIHx8IChleHBvcnRzW1BST1RPVFlQRV0gPSB7fSkpW2tleV0gPSBvdXQ7XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7IC8vIHdyYXBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiLCJ2YXIgY3R4ICAgICAgICAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCBjYWxsICAgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyLWNhbGwnKVxuICAsIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi8kLmlzLWFycmF5LWl0ZXInKVxuICAsIGFuT2JqZWN0ICAgID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXG4gICwgdG9MZW5ndGggICAgPSByZXF1aXJlKCcuLyQudG8tbGVuZ3RoJylcbiAgLCBnZXRJdGVyRm4gICA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhYmxlLCBlbnRyaWVzLCBmbiwgdGhhdCl7XG4gIHZhciBpdGVyRm4gPSBnZXRJdGVyRm4oaXRlcmFibGUpXG4gICAgLCBmICAgICAgPSBjdHgoZm4sIHRoYXQsIGVudHJpZXMgPyAyIDogMSlcbiAgICAsIGluZGV4ICA9IDBcbiAgICAsIGxlbmd0aCwgc3RlcCwgaXRlcmF0b3I7XG4gIGlmKHR5cGVvZiBpdGVyRm4gIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXRlcmFibGUgKyAnIGlzIG5vdCBpdGVyYWJsZSEnKTtcbiAgLy8gZmFzdCBjYXNlIGZvciBhcnJheXMgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yXG4gIGlmKGlzQXJyYXlJdGVyKGl0ZXJGbikpZm9yKGxlbmd0aCA9IHRvTGVuZ3RoKGl0ZXJhYmxlLmxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKXtcbiAgICBlbnRyaWVzID8gZihhbk9iamVjdChzdGVwID0gaXRlcmFibGVbaW5kZXhdKVswXSwgc3RlcFsxXSkgOiBmKGl0ZXJhYmxlW2luZGV4XSk7XG4gIH0gZWxzZSBmb3IoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChpdGVyYWJsZSk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgKXtcbiAgICBjYWxsKGl0ZXJhdG9yLCBmLCBzdGVwLnZhbHVlLCBlbnRyaWVzKTtcbiAgfVxufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07IiwidmFyICQgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuLyQucHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIHJldHVybiAkLnNldERlc2Mob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKS5kb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7IiwiLy8gZmFzdCBhcHBseSwgaHR0cDovL2pzcGVyZi5sbmtpdC5jb20vZmFzdC1hcHBseS81XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCBhcmdzLCB0aGF0KXtcbiAgdmFyIHVuID0gdGhhdCA9PT0gdW5kZWZpbmVkO1xuICBzd2l0Y2goYXJncy5sZW5ndGgpe1xuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0KTtcbiAgICBjYXNlIDE6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICBjYXNlIDQ6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xuICB9IHJldHVybiAgICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgYXJncyk7XG59OyIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi8kLmNvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTsiLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzICA9IHJlcXVpcmUoJy4vJC5pdGVyYXRvcnMnKVxuICAsIElURVJBVE9SICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59OyIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaChlKXtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmKHJldCAhPT0gdW5kZWZpbmVkKWFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGRlc2NyaXB0b3IgICAgID0gcmVxdWlyZSgnLi8kLnByb3BlcnR5LWRlc2MnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi8kLnNldC10by1zdHJpbmctdGFnJylcbiAgLCBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi8kLmhpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpe1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSAkLmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge25leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCl9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZICAgICAgICA9IHJlcXVpcmUoJy4vJC5saWJyYXJ5JylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi8kLnJlZGVmaW5lJylcbiAgLCBoaWRlICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oaWRlJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oYXMnKVxuICAsIEl0ZXJhdG9ycyAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpXG4gICwgJGl0ZXJDcmVhdGUgICAgPSByZXF1aXJlKCcuLyQuaXRlci1jcmVhdGUnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi8kLnNldC10by1zdHJpbmctdGFnJylcbiAgLCBnZXRQcm90byAgICAgICA9IHJlcXVpcmUoJy4vJCcpLmdldFByb3RvXG4gICwgSVRFUkFUT1IgICAgICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBCVUdHWSAgICAgICAgICA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKSAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG4gICwgRkZfSVRFUkFUT1IgICAgPSAnQEBpdGVyYXRvcidcbiAgLCBLRVlTICAgICAgICAgICA9ICdrZXlzJ1xuICAsIFZBTFVFUyAgICAgICAgID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKXtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24oa2luZCl7XG4gICAgaWYoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaChraW5kKXtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHICAgICAgICA9IE5BTUUgKyAnIEl0ZXJhdG9yJ1xuICAgICwgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTXG4gICAgLCBWQUxVRVNfQlVHID0gZmFsc2VcbiAgICAsIHByb3RvICAgICAgPSBCYXNlLnByb3RvdHlwZVxuICAgICwgJG5hdGl2ZSAgICA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXVxuICAgICwgJGRlZmF1bHQgICA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpXG4gICAgLCBtZXRob2RzLCBrZXk7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYoJG5hdGl2ZSl7XG4gICAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8oJGRlZmF1bHQuY2FsbChuZXcgQmFzZSkpO1xuICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAvLyBGRiBmaXhcbiAgICBpZighTElCUkFSWSAmJiBoYXMocHJvdG8sIEZGX0lURVJBVE9SKSloaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICAgIGlmKERFRl9WQUxVRVMgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpe1xuICAgICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICAgIH1cbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpe1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gID0gcmV0dXJuVGhpcztcbiAgaWYoREVGQVVMVCl7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogIERFRl9WQUxVRVMgID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6ICAgIElTX1NFVCAgICAgID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJylcbiAgICB9O1xuICAgIGlmKEZPUkNFRClmb3Ioa2V5IGluIG1ldGhvZHMpe1xuICAgICAgaWYoIShrZXkgaW4gcHJvdG8pKXJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07IiwidmFyIElURVJBVE9SICAgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uKCl7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uKCl7IHRocm93IDI7IH0pO1xufSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMsIHNraXBDbG9zaW5nKXtcbiAgaWYoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgID0gWzddXG4gICAgICAsIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24oKXsgc2FmZSA9IHRydWU7IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uKCl7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkb25lLCB2YWx1ZSl7XG4gIHJldHVybiB7dmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmV9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHt9OyIsInZhciAkT2JqZWN0ID0gT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZTogICAgICRPYmplY3QuY3JlYXRlLFxuICBnZXRQcm90bzogICAkT2JqZWN0LmdldFByb3RvdHlwZU9mLFxuICBpc0VudW06ICAgICB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZSxcbiAgZ2V0RGVzYzogICAgJE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIHNldERlc2M6ICAgICRPYmplY3QuZGVmaW5lUHJvcGVydHksXG4gIHNldERlc2NzOiAgICRPYmplY3QuZGVmaW5lUHJvcGVydGllcyxcbiAgZ2V0S2V5czogICAgJE9iamVjdC5rZXlzLFxuICBnZXROYW1lczogICAkT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMsXG4gIGdldFN5bWJvbHM6ICRPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLFxuICBlYWNoOiAgICAgICBbXS5mb3JFYWNoXG59OyIsIm1vZHVsZS5leHBvcnRzID0gdHJ1ZTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgbWFjcm90YXNrID0gcmVxdWlyZSgnLi8kLnRhc2snKS5zZXRcbiAgLCBPYnNlcnZlciAgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlclxuICAsIHByb2Nlc3MgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgUHJvbWlzZSAgID0gZ2xvYmFsLlByb21pc2VcbiAgLCBpc05vZGUgICAgPSByZXF1aXJlKCcuLyQuY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnXG4gICwgaGVhZCwgbGFzdCwgbm90aWZ5O1xuXG52YXIgZmx1c2ggPSBmdW5jdGlvbigpe1xuICB2YXIgcGFyZW50LCBkb21haW4sIGZuO1xuICBpZihpc05vZGUgJiYgKHBhcmVudCA9IHByb2Nlc3MuZG9tYWluKSl7XG4gICAgcHJvY2Vzcy5kb21haW4gPSBudWxsO1xuICAgIHBhcmVudC5leGl0KCk7XG4gIH1cbiAgd2hpbGUoaGVhZCl7XG4gICAgZG9tYWluID0gaGVhZC5kb21haW47XG4gICAgZm4gICAgID0gaGVhZC5mbjtcbiAgICBpZihkb21haW4pZG9tYWluLmVudGVyKCk7XG4gICAgZm4oKTsgLy8gPC0gY3VycmVudGx5IHdlIHVzZSBpdCBvbmx5IGZvciBQcm9taXNlIC0gdHJ5IC8gY2F0Y2ggbm90IHJlcXVpcmVkXG4gICAgaWYoZG9tYWluKWRvbWFpbi5leGl0KCk7XG4gICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgfSBsYXN0ID0gdW5kZWZpbmVkO1xuICBpZihwYXJlbnQpcGFyZW50LmVudGVyKCk7XG59O1xuXG4vLyBOb2RlLmpzXG5pZihpc05vZGUpe1xuICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICB9O1xuLy8gYnJvd3NlcnMgd2l0aCBNdXRhdGlvbk9ic2VydmVyXG59IGVsc2UgaWYoT2JzZXJ2ZXIpe1xuICB2YXIgdG9nZ2xlID0gMVxuICAgICwgbm9kZSAgID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICBuZXcgT2JzZXJ2ZXIoZmx1c2gpLm9ic2VydmUobm9kZSwge2NoYXJhY3RlckRhdGE6IHRydWV9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICBub2RlLmRhdGEgPSB0b2dnbGUgPSAtdG9nZ2xlO1xuICB9O1xuLy8gZW52aXJvbm1lbnRzIHdpdGggbWF5YmUgbm9uLWNvbXBsZXRlbHkgY29ycmVjdCwgYnV0IGV4aXN0ZW50IFByb21pc2Vcbn0gZWxzZSBpZihQcm9taXNlICYmIFByb21pc2UucmVzb2x2ZSl7XG4gIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmbHVzaCk7XG4gIH07XG4vLyBmb3Igb3RoZXIgZW52aXJvbm1lbnRzIC0gbWFjcm90YXNrIGJhc2VkIG9uOlxuLy8gLSBzZXRJbW1lZGlhdGVcbi8vIC0gTWVzc2FnZUNoYW5uZWxcbi8vIC0gd2luZG93LnBvc3RNZXNzYWdcbi8vIC0gb25yZWFkeXN0YXRlY2hhbmdlXG4vLyAtIHNldFRpbWVvdXRcbn0gZWxzZSB7XG4gIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICAgIG1hY3JvdGFzay5jYWxsKGdsb2JhbCwgZmx1c2gpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGFzYXAoZm4pe1xuICB2YXIgdGFzayA9IHtmbjogZm4sIG5leHQ6IHVuZGVmaW5lZCwgZG9tYWluOiBpc05vZGUgJiYgcHJvY2Vzcy5kb21haW59O1xuICBpZihsYXN0KWxhc3QubmV4dCA9IHRhc2s7XG4gIGlmKCFoZWFkKXtcbiAgICBoZWFkID0gdGFzaztcbiAgICBub3RpZnkoKTtcbiAgfSBsYXN0ID0gdGFzaztcbn07IiwiLy8gMTkuMS4yLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSwgLi4uKVxudmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCB0b09iamVjdCA9IHJlcXVpcmUoJy4vJC50by1vYmplY3QnKVxuICAsIElPYmplY3QgID0gcmVxdWlyZSgnLi8kLmlvYmplY3QnKTtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHZhciBhID0gT2JqZWN0LmFzc2lnblxuICAgICwgQSA9IHt9XG4gICAgLCBCID0ge31cbiAgICAsIFMgPSBTeW1ib2woKVxuICAgICwgSyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdCc7XG4gIEFbU10gPSA3O1xuICBLLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uKGspeyBCW2tdID0gazsgfSk7XG4gIHJldHVybiBhKHt9LCBBKVtTXSAhPSA3IHx8IE9iamVjdC5rZXlzKGEoe30sIEIpKS5qb2luKCcnKSAhPSBLO1xufSkgPyBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHZhciBUICAgICA9IHRvT2JqZWN0KHRhcmdldClcbiAgICAsICQkICAgID0gYXJndW1lbnRzXG4gICAgLCAkJGxlbiA9ICQkLmxlbmd0aFxuICAgICwgaW5kZXggPSAxXG4gICAgLCBnZXRLZXlzICAgID0gJC5nZXRLZXlzXG4gICAgLCBnZXRTeW1ib2xzID0gJC5nZXRTeW1ib2xzXG4gICAgLCBpc0VudW0gICAgID0gJC5pc0VudW07XG4gIHdoaWxlKCQkbGVuID4gaW5kZXgpe1xuICAgIHZhciBTICAgICAgPSBJT2JqZWN0KCQkW2luZGV4KytdKVxuICAgICAgLCBrZXlzICAgPSBnZXRTeW1ib2xzID8gZ2V0S2V5cyhTKS5jb25jYXQoZ2V0U3ltYm9scyhTKSkgOiBnZXRLZXlzKFMpXG4gICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgICAsIGogICAgICA9IDBcbiAgICAgICwga2V5O1xuICAgIHdoaWxlKGxlbmd0aCA+IGopaWYoaXNFbnVtLmNhbGwoUywga2V5ID0ga2V5c1tqKytdKSlUW2tleV0gPSBTW2tleV07XG4gIH1cbiAgcmV0dXJuIFQ7XG59IDogT2JqZWN0LmFzc2lnbjsiLCIvLyBtb3N0IE9iamVjdCBtZXRob2RzIGJ5IEVTNiBzaG91bGQgYWNjZXB0IHByaW1pdGl2ZXNcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgY29yZSAgICA9IHJlcXVpcmUoJy4vJC5jb3JlJylcbiAgLCBmYWlscyAgID0gcmVxdWlyZSgnLi8kLmZhaWxzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEtFWSwgZXhlYyl7XG4gIHZhciBmbiAgPSAoY29yZS5PYmplY3QgfHwge30pW0tFWV0gfHwgT2JqZWN0W0tFWV1cbiAgICAsIGV4cCA9IHt9O1xuICBleHBbS0VZXSA9IGV4ZWMoZm4pO1xuICAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIGZhaWxzKGZ1bmN0aW9uKCl7IGZuKDEpOyB9KSwgJ09iamVjdCcsIGV4cCk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYml0bWFwLCB2YWx1ZSl7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZSAgOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWUgICAgICAgOiB2YWx1ZVxuICB9O1xufTsiLCJ2YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLyQucmVkZWZpbmUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFyZ2V0LCBzcmMpe1xuICBmb3IodmFyIGtleSBpbiBzcmMpcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNyY1trZXldKTtcbiAgcmV0dXJuIHRhcmdldDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuaGlkZScpOyIsIi8vIDcuMi45IFNhbWVWYWx1ZSh4LCB5KVxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuaXMgfHwgZnVuY3Rpb24gaXMoeCwgeSl7XG4gIHJldHVybiB4ID09PSB5ID8geCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHkgOiB4ICE9IHggJiYgeSAhPSB5O1xufTsiLCIvLyBXb3JrcyB3aXRoIF9fcHJvdG9fXyBvbmx5LiBPbGQgdjggY2FuJ3Qgd29yayB3aXRoIG51bGwgcHJvdG8gb2JqZWN0cy5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG52YXIgZ2V0RGVzYyAgPSByZXF1aXJlKCcuLyQnKS5nZXREZXNjXG4gICwgaXNPYmplY3QgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKTtcbnZhciBjaGVjayA9IGZ1bmN0aW9uKE8sIHByb3RvKXtcbiAgYW5PYmplY3QoTyk7XG4gIGlmKCFpc09iamVjdChwcm90bykgJiYgcHJvdG8gIT09IG51bGwpdGhyb3cgVHlwZUVycm9yKHByb3RvICsgXCI6IGNhbid0IHNldCBhcyBwcm90b3R5cGUhXCIpO1xufTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCAoJ19fcHJvdG9fXycgaW4ge30gPyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgZnVuY3Rpb24odGVzdCwgYnVnZ3ksIHNldCl7XG4gICAgICB0cnkge1xuICAgICAgICBzZXQgPSByZXF1aXJlKCcuLyQuY3R4JykoRnVuY3Rpb24uY2FsbCwgZ2V0RGVzYyhPYmplY3QucHJvdG90eXBlLCAnX19wcm90b19fJykuc2V0LCAyKTtcbiAgICAgICAgc2V0KHRlc3QsIFtdKTtcbiAgICAgICAgYnVnZ3kgPSAhKHRlc3QgaW5zdGFuY2VvZiBBcnJheSk7XG4gICAgICB9IGNhdGNoKGUpeyBidWdneSA9IHRydWU7IH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZihPLCBwcm90byl7XG4gICAgICAgIGNoZWNrKE8sIHByb3RvKTtcbiAgICAgICAgaWYoYnVnZ3kpTy5fX3Byb3RvX18gPSBwcm90bztcbiAgICAgICAgZWxzZSBzZXQoTywgcHJvdG8pO1xuICAgICAgICByZXR1cm4gTztcbiAgICAgIH07XG4gICAgfSh7fSwgZmFsc2UpIDogdW5kZWZpbmVkKSxcbiAgY2hlY2s6IGNoZWNrXG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBjb3JlICAgICAgICA9IHJlcXVpcmUoJy4vJC5jb3JlJylcbiAgLCAkICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLyQuZGVzY3JpcHRvcnMnKVxuICAsIFNQRUNJRVMgICAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZKXtcbiAgdmFyIEMgPSBjb3JlW0tFWV07XG4gIGlmKERFU0NSSVBUT1JTICYmIEMgJiYgIUNbU1BFQ0lFU10pJC5zZXREZXNjKEMsIFNQRUNJRVMsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfVxuICB9KTtcbn07IiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vJCcpLnNldERlc2NcbiAgLCBoYXMgPSByZXF1aXJlKCcuLyQuaGFzJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuLyQud2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XG4gIGlmKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpZGVmKGl0LCBUQUcsIHtjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWd9KTtcbn07IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXG4gICwgc3RvcmUgID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07IiwiLy8gNy4zLjIwIFNwZWNpZXNDb25zdHJ1Y3RvcihPLCBkZWZhdWx0Q29uc3RydWN0b3IpXG52YXIgYW5PYmplY3QgID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmEtZnVuY3Rpb24nKVxuICAsIFNQRUNJRVMgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihPLCBEKXtcbiAgdmFyIEMgPSBhbk9iamVjdChPKS5jb25zdHJ1Y3RvciwgUztcbiAgcmV0dXJuIEMgPT09IHVuZGVmaW5lZCB8fCAoUyA9IGFuT2JqZWN0KEMpW1NQRUNJRVNdKSA9PSB1bmRlZmluZWQgPyBEIDogYUZ1bmN0aW9uKFMpO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSl7XG4gIGlmKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpdGhyb3cgVHlwZUVycm9yKG5hbWUgKyBcIjogdXNlIHRoZSAnbmV3JyBvcGVyYXRvciFcIik7XG4gIHJldHVybiBpdDtcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vJC50by1pbnRlZ2VyJylcbiAgLCBkZWZpbmVkICAgPSByZXF1aXJlKCcuLyQuZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXG4gICAgICAsIGwgPSBzLmxlbmd0aFxuICAgICAgLCBhLCBiO1xuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTsiLCJ2YXIgY3R4ICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgaW52b2tlICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmludm9rZScpXG4gICwgaHRtbCAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmh0bWwnKVxuICAsIGNlbCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5kb20tY3JlYXRlJylcbiAgLCBnbG9iYWwgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIHNldFRhc2sgICAgICAgICAgICA9IGdsb2JhbC5zZXRJbW1lZGlhdGVcbiAgLCBjbGVhclRhc2sgICAgICAgICAgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGVcbiAgLCBNZXNzYWdlQ2hhbm5lbCAgICAgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWxcbiAgLCBjb3VudGVyICAgICAgICAgICAgPSAwXG4gICwgcXVldWUgICAgICAgICAgICAgID0ge31cbiAgLCBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJ1xuICAsIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xudmFyIHJ1biA9IGZ1bmN0aW9uKCl7XG4gIHZhciBpZCA9ICt0aGlzO1xuICBpZihxdWV1ZS5oYXNPd25Qcm9wZXJ0eShpZCkpe1xuICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICAgIGZuKCk7XG4gIH1cbn07XG52YXIgbGlzdG5lciA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcnVuLmNhbGwoZXZlbnQuZGF0YSk7XG59O1xuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgb3RoZXJ3aXNlOlxuaWYoIXNldFRhc2sgfHwgIWNsZWFyVGFzayl7XG4gIHNldFRhc2sgPSBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoZm4pe1xuICAgIHZhciBhcmdzID0gW10sIGkgPSAxO1xuICAgIHdoaWxlKGFyZ3VtZW50cy5sZW5ndGggPiBpKWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgcXVldWVbKytjb3VudGVyXSA9IGZ1bmN0aW9uKCl7XG4gICAgICBpbnZva2UodHlwZW9mIGZuID09ICdmdW5jdGlvbicgPyBmbiA6IEZ1bmN0aW9uKGZuKSwgYXJncyk7XG4gICAgfTtcbiAgICBkZWZlcihjb3VudGVyKTtcbiAgICByZXR1cm4gY291bnRlcjtcbiAgfTtcbiAgY2xlYXJUYXNrID0gZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaWQpe1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gIH07XG4gIC8vIE5vZGUuanMgMC44LVxuICBpZihyZXF1aXJlKCcuLyQuY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBCcm93c2VycyB3aXRoIE1lc3NhZ2VDaGFubmVsLCBpbmNsdWRlcyBXZWJXb3JrZXJzXG4gIH0gZWxzZSBpZihNZXNzYWdlQ2hhbm5lbCl7XG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbDtcbiAgICBwb3J0ICAgID0gY2hhbm5lbC5wb3J0MjtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RuZXI7XG4gICAgZGVmZXIgPSBjdHgocG9ydC5wb3N0TWVzc2FnZSwgcG9ydCwgMSk7XG4gIC8vIEJyb3dzZXJzIHdpdGggcG9zdE1lc3NhZ2UsIHNraXAgV2ViV29ya2Vyc1xuICAvLyBJRTggaGFzIHBvc3RNZXNzYWdlLCBidXQgaXQncyBzeW5jICYgdHlwZW9mIGl0cyBwb3N0TWVzc2FnZSBpcyAnb2JqZWN0J1xuICB9IGVsc2UgaWYoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIgJiYgdHlwZW9mIHBvc3RNZXNzYWdlID09ICdmdW5jdGlvbicgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShpZCArICcnLCAnKicpO1xuICAgIH07XG4gICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0bmVyLCBmYWxzZSk7XG4gIC8vIElFOC1cbiAgfSBlbHNlIGlmKE9OUkVBRFlTVEFURUNIQU5HRSBpbiBjZWwoJ3NjcmlwdCcpKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoY2VsKCdzY3JpcHQnKSlbT05SRUFEWVNUQVRFQ0hBTkdFXSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcbiAgICAgIH07XG4gICAgfTtcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcbiAgfSBlbHNlIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcbiAgICB9O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiAgIHNldFRhc2ssXG4gIGNsZWFyOiBjbGVhclRhc2tcbn07IiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCAgPSBNYXRoLmNlaWxcbiAgLCBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59OyIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuLyQuaW9iamVjdCcpXG4gICwgZGVmaW5lZCA9IHJlcXVpcmUoJy4vJC5kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuLyQudG8taW50ZWdlcicpXG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07IiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuLyQuZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCJ2YXIgaWQgPSAwXG4gICwgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTsiLCJ2YXIgc3RvcmUgID0gcmVxdWlyZSgnLi8kLnNoYXJlZCcpKCd3a3MnKVxuICAsIHVpZCAgICA9IHJlcXVpcmUoJy4vJC51aWQnKVxuICAsIFN5bWJvbCA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKS5TeW1ib2w7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBTeW1ib2wgJiYgU3ltYm9sW25hbWVdIHx8IChTeW1ib2wgfHwgdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59OyIsInZhciBjbGFzc29mICAgPSByZXF1aXJlKCcuLyQuY2xhc3NvZicpXG4gICwgSVRFUkFUT1IgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXG4gICwgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCAhPSB1bmRlZmluZWQpcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgY3R4ICAgICAgICAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCAkZXhwb3J0ICAgICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIHRvT2JqZWN0ICAgID0gcmVxdWlyZSgnLi8kLnRvLW9iamVjdCcpXG4gICwgY2FsbCAgICAgICAgPSByZXF1aXJlKCcuLyQuaXRlci1jYWxsJylcbiAgLCBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vJC5pcy1hcnJheS1pdGVyJylcbiAgLCB0b0xlbmd0aCAgICA9IHJlcXVpcmUoJy4vJC50by1sZW5ndGgnKVxuICAsIGdldEl0ZXJGbiAgID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vJC5pdGVyLWRldGVjdCcpKGZ1bmN0aW9uKGl0ZXIpeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gIGZyb206IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlLyosIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKi8pe1xuICAgIHZhciBPICAgICAgID0gdG9PYmplY3QoYXJyYXlMaWtlKVxuICAgICAgLCBDICAgICAgID0gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheVxuICAgICAgLCAkJCAgICAgID0gYXJndW1lbnRzXG4gICAgICAsICQkbGVuICAgPSAkJC5sZW5ndGhcbiAgICAgICwgbWFwZm4gICA9ICQkbGVuID4gMSA/ICQkWzFdIDogdW5kZWZpbmVkXG4gICAgICAsIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkXG4gICAgICAsIGluZGV4ICAgPSAwXG4gICAgICAsIGl0ZXJGbiAgPSBnZXRJdGVyRm4oTylcbiAgICAgICwgbGVuZ3RoLCByZXN1bHQsIHN0ZXAsIGl0ZXJhdG9yO1xuICAgIGlmKG1hcHBpbmcpbWFwZm4gPSBjdHgobWFwZm4sICQkbGVuID4gMiA/ICQkWzJdIDogdW5kZWZpbmVkLCAyKTtcbiAgICAvLyBpZiBvYmplY3QgaXNuJ3QgaXRlcmFibGUgb3IgaXQncyBhcnJheSB3aXRoIGRlZmF1bHQgaXRlcmF0b3IgLSB1c2Ugc2ltcGxlIGNhc2VcbiAgICBpZihpdGVyRm4gIT0gdW5kZWZpbmVkICYmICEoQyA9PSBBcnJheSAmJiBpc0FycmF5SXRlcihpdGVyRm4pKSl7XG4gICAgICBmb3IoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChPKSwgcmVzdWx0ID0gbmV3IEM7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKyl7XG4gICAgICAgIHJlc3VsdFtpbmRleF0gPSBtYXBwaW5nID8gY2FsbChpdGVyYXRvciwgbWFwZm4sIFtzdGVwLnZhbHVlLCBpbmRleF0sIHRydWUpIDogc3RlcC52YWx1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgICAgZm9yKHJlc3VsdCA9IG5ldyBDKGxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKXtcbiAgICAgICAgcmVzdWx0W2luZGV4XSA9IG1hcHBpbmcgPyBtYXBmbihPW2luZGV4XSwgaW5kZXgpIDogT1tpbmRleF07XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5sZW5ndGggPSBpbmRleDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi8kLmFkZC10by11bnNjb3BhYmxlcycpXG4gICwgc3RlcCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyLXN0ZXAnKVxuICAsIEl0ZXJhdG9ycyAgICAgICAgPSByZXF1aXJlKCcuLyQuaXRlcmF0b3JzJylcbiAgLCB0b0lPYmplY3QgICAgICAgID0gcmVxdWlyZSgnLi8kLnRvLWlvYmplY3QnKTtcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuaXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGtpbmQgID0gdGhpcy5fa1xuICAgICwgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcbiAgICB0aGlzLl90ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdGVwKDEpO1xuICB9XG4gIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xuICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5hZGRUb1Vuc2NvcGFibGVzKCdrZXlzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCd2YWx1ZXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ2VudHJpZXMnKTsiLCIvLyAxOS4xLjMuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GLCAnT2JqZWN0Jywge2Fzc2lnbjogcmVxdWlyZSgnLi8kLm9iamVjdC1hc3NpZ24nKX0pOyIsIi8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuLyQudG8taW9iamVjdCcpO1xuXG5yZXF1aXJlKCcuLyQub2JqZWN0LXNhcCcpKCdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3InLCBmdW5jdGlvbigkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKXtcbiAgcmV0dXJuIGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KXtcbiAgICByZXR1cm4gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0b0lPYmplY3QoaXQpLCBrZXkpO1xuICB9O1xufSk7IiwiLy8gMTkuMS4zLjE5IE9iamVjdC5zZXRQcm90b3R5cGVPZihPLCBwcm90bylcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpO1xuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7c2V0UHJvdG90eXBlT2Y6IHJlcXVpcmUoJy4vJC5zZXQtcHJvdG8nKS5zZXR9KTsiLCIiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgTElCUkFSWSAgICA9IHJlcXVpcmUoJy4vJC5saWJyYXJ5JylcbiAgLCBnbG9iYWwgICAgID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgY3R4ICAgICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIGNsYXNzb2YgICAgPSByZXF1aXJlKCcuLyQuY2xhc3NvZicpXG4gICwgJGV4cG9ydCAgICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIGlzT2JqZWN0ICAgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBhbk9iamVjdCAgID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uICA9IHJlcXVpcmUoJy4vJC5hLWZ1bmN0aW9uJylcbiAgLCBzdHJpY3ROZXcgID0gcmVxdWlyZSgnLi8kLnN0cmljdC1uZXcnKVxuICAsIGZvck9mICAgICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCBzZXRQcm90byAgID0gcmVxdWlyZSgnLi8kLnNldC1wcm90bycpLnNldFxuICAsIHNhbWUgICAgICAgPSByZXF1aXJlKCcuLyQuc2FtZS12YWx1ZScpXG4gICwgU1BFQ0lFUyAgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpXG4gICwgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi8kLnNwZWNpZXMtY29uc3RydWN0b3InKVxuICAsIGFzYXAgICAgICAgPSByZXF1aXJlKCcuLyQubWljcm90YXNrJylcbiAgLCBQUk9NSVNFICAgID0gJ1Byb21pc2UnXG4gICwgcHJvY2VzcyAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgaXNOb2RlICAgICA9IGNsYXNzb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnXG4gICwgUCAgICAgICAgICA9IGdsb2JhbFtQUk9NSVNFXVxuICAsIFdyYXBwZXI7XG5cbnZhciB0ZXN0UmVzb2x2ZSA9IGZ1bmN0aW9uKHN1Yil7XG4gIHZhciB0ZXN0ID0gbmV3IFAoZnVuY3Rpb24oKXt9KTtcbiAgaWYoc3ViKXRlc3QuY29uc3RydWN0b3IgPSBPYmplY3Q7XG4gIHJldHVybiBQLnJlc29sdmUodGVzdCkgPT09IHRlc3Q7XG59O1xuXG52YXIgVVNFX05BVElWRSA9IGZ1bmN0aW9uKCl7XG4gIHZhciB3b3JrcyA9IGZhbHNlO1xuICBmdW5jdGlvbiBQMih4KXtcbiAgICB2YXIgc2VsZiA9IG5ldyBQKHgpO1xuICAgIHNldFByb3RvKHNlbGYsIFAyLnByb3RvdHlwZSk7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cbiAgdHJ5IHtcbiAgICB3b3JrcyA9IFAgJiYgUC5yZXNvbHZlICYmIHRlc3RSZXNvbHZlKCk7XG4gICAgc2V0UHJvdG8oUDIsIFApO1xuICAgIFAyLnByb3RvdHlwZSA9ICQuY3JlYXRlKFAucHJvdG90eXBlLCB7Y29uc3RydWN0b3I6IHt2YWx1ZTogUDJ9fSk7XG4gICAgLy8gYWN0dWFsIEZpcmVmb3ggaGFzIGJyb2tlbiBzdWJjbGFzcyBzdXBwb3J0LCB0ZXN0IHRoYXRcbiAgICBpZighKFAyLnJlc29sdmUoNSkudGhlbihmdW5jdGlvbigpe30pIGluc3RhbmNlb2YgUDIpKXtcbiAgICAgIHdvcmtzID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIGFjdHVhbCBWOCBidWcsIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTYyXG4gICAgaWYod29ya3MgJiYgcmVxdWlyZSgnLi8kLmRlc2NyaXB0b3JzJykpe1xuICAgICAgdmFyIHRoZW5hYmxlVGhlbkdvdHRlbiA9IGZhbHNlO1xuICAgICAgUC5yZXNvbHZlKCQuc2V0RGVzYyh7fSwgJ3RoZW4nLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKXsgdGhlbmFibGVUaGVuR290dGVuID0gdHJ1ZTsgfVxuICAgICAgfSkpO1xuICAgICAgd29ya3MgPSB0aGVuYWJsZVRoZW5Hb3R0ZW47XG4gICAgfVxuICB9IGNhdGNoKGUpeyB3b3JrcyA9IGZhbHNlOyB9XG4gIHJldHVybiB3b3Jrcztcbn0oKTtcblxuLy8gaGVscGVyc1xudmFyIHNhbWVDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uKGEsIGIpe1xuICAvLyBsaWJyYXJ5IHdyYXBwZXIgc3BlY2lhbCBjYXNlXG4gIGlmKExJQlJBUlkgJiYgYSA9PT0gUCAmJiBiID09PSBXcmFwcGVyKXJldHVybiB0cnVlO1xuICByZXR1cm4gc2FtZShhLCBiKTtcbn07XG52YXIgZ2V0Q29uc3RydWN0b3IgPSBmdW5jdGlvbihDKXtcbiAgdmFyIFMgPSBhbk9iamVjdChDKVtTUEVDSUVTXTtcbiAgcmV0dXJuIFMgIT0gdW5kZWZpbmVkID8gUyA6IEM7XG59O1xudmFyIGlzVGhlbmFibGUgPSBmdW5jdGlvbihpdCl7XG4gIHZhciB0aGVuO1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmIHR5cGVvZiAodGhlbiA9IGl0LnRoZW4pID09ICdmdW5jdGlvbicgPyB0aGVuIDogZmFsc2U7XG59O1xudmFyIFByb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oQyl7XG4gIHZhciByZXNvbHZlLCByZWplY3Q7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBDKGZ1bmN0aW9uKCQkcmVzb2x2ZSwgJCRyZWplY3Qpe1xuICAgIGlmKHJlc29sdmUgIT09IHVuZGVmaW5lZCB8fCByZWplY3QgIT09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoJ0JhZCBQcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gICAgcmVzb2x2ZSA9ICQkcmVzb2x2ZTtcbiAgICByZWplY3QgID0gJCRyZWplY3Q7XG4gIH0pO1xuICB0aGlzLnJlc29sdmUgPSBhRnVuY3Rpb24ocmVzb2x2ZSksXG4gIHRoaXMucmVqZWN0ICA9IGFGdW5jdGlvbihyZWplY3QpXG59O1xudmFyIHBlcmZvcm0gPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICBleGVjKCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHtlcnJvcjogZX07XG4gIH1cbn07XG52YXIgbm90aWZ5ID0gZnVuY3Rpb24ocmVjb3JkLCBpc1JlamVjdCl7XG4gIGlmKHJlY29yZC5uKXJldHVybjtcbiAgcmVjb3JkLm4gPSB0cnVlO1xuICB2YXIgY2hhaW4gPSByZWNvcmQuYztcbiAgYXNhcChmdW5jdGlvbigpe1xuICAgIHZhciB2YWx1ZSA9IHJlY29yZC52XG4gICAgICAsIG9rICAgID0gcmVjb3JkLnMgPT0gMVxuICAgICAgLCBpICAgICA9IDA7XG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uKHJlYWN0aW9uKXtcbiAgICAgIHZhciBoYW5kbGVyID0gb2sgPyByZWFjdGlvbi5vayA6IHJlYWN0aW9uLmZhaWxcbiAgICAgICAgLCByZXNvbHZlID0gcmVhY3Rpb24ucmVzb2x2ZVxuICAgICAgICAsIHJlamVjdCAgPSByZWFjdGlvbi5yZWplY3RcbiAgICAgICAgLCByZXN1bHQsIHRoZW47XG4gICAgICB0cnkge1xuICAgICAgICBpZihoYW5kbGVyKXtcbiAgICAgICAgICBpZighb2spcmVjb3JkLmggPSB0cnVlO1xuICAgICAgICAgIHJlc3VsdCA9IGhhbmRsZXIgPT09IHRydWUgPyB2YWx1ZSA6IGhhbmRsZXIodmFsdWUpO1xuICAgICAgICAgIGlmKHJlc3VsdCA9PT0gcmVhY3Rpb24ucHJvbWlzZSl7XG4gICAgICAgICAgICByZWplY3QoVHlwZUVycm9yKCdQcm9taXNlLWNoYWluIGN5Y2xlJykpO1xuICAgICAgICAgIH0gZWxzZSBpZih0aGVuID0gaXNUaGVuYWJsZShyZXN1bHQpKXtcbiAgICAgICAgICAgIHRoZW4uY2FsbChyZXN1bHQsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSBlbHNlIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHJlamVjdCh2YWx1ZSk7XG4gICAgICB9IGNhdGNoKGUpe1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXJ1bihjaGFpbltpKytdKTsgLy8gdmFyaWFibGUgbGVuZ3RoIC0gY2FuJ3QgdXNlIGZvckVhY2hcbiAgICBjaGFpbi5sZW5ndGggPSAwO1xuICAgIHJlY29yZC5uID0gZmFsc2U7XG4gICAgaWYoaXNSZWplY3Qpc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgdmFyIHByb21pc2UgPSByZWNvcmQucFxuICAgICAgICAsIGhhbmRsZXIsIGNvbnNvbGU7XG4gICAgICBpZihpc1VuaGFuZGxlZChwcm9taXNlKSl7XG4gICAgICAgIGlmKGlzTm9kZSl7XG4gICAgICAgICAgcHJvY2Vzcy5lbWl0KCd1bmhhbmRsZWRSZWplY3Rpb24nLCB2YWx1ZSwgcHJvbWlzZSk7XG4gICAgICAgIH0gZWxzZSBpZihoYW5kbGVyID0gZ2xvYmFsLm9udW5oYW5kbGVkcmVqZWN0aW9uKXtcbiAgICAgICAgICBoYW5kbGVyKHtwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHZhbHVlfSk7XG4gICAgICAgIH0gZWxzZSBpZigoY29uc29sZSA9IGdsb2JhbC5jb25zb2xlKSAmJiBjb25zb2xlLmVycm9yKXtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb24nLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gcmVjb3JkLmEgPSB1bmRlZmluZWQ7XG4gICAgfSwgMSk7XG4gIH0pO1xufTtcbnZhciBpc1VuaGFuZGxlZCA9IGZ1bmN0aW9uKHByb21pc2Upe1xuICB2YXIgcmVjb3JkID0gcHJvbWlzZS5fZFxuICAgICwgY2hhaW4gID0gcmVjb3JkLmEgfHwgcmVjb3JkLmNcbiAgICAsIGkgICAgICA9IDBcbiAgICAsIHJlYWN0aW9uO1xuICBpZihyZWNvcmQuaClyZXR1cm4gZmFsc2U7XG4gIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpe1xuICAgIHJlYWN0aW9uID0gY2hhaW5baSsrXTtcbiAgICBpZihyZWFjdGlvbi5mYWlsIHx8ICFpc1VuaGFuZGxlZChyZWFjdGlvbi5wcm9taXNlKSlyZXR1cm4gZmFsc2U7XG4gIH0gcmV0dXJuIHRydWU7XG59O1xudmFyICRyZWplY3QgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHZhciByZWNvcmQgPSB0aGlzO1xuICBpZihyZWNvcmQuZClyZXR1cm47XG4gIHJlY29yZC5kID0gdHJ1ZTtcbiAgcmVjb3JkID0gcmVjb3JkLnIgfHwgcmVjb3JkOyAvLyB1bndyYXBcbiAgcmVjb3JkLnYgPSB2YWx1ZTtcbiAgcmVjb3JkLnMgPSAyO1xuICByZWNvcmQuYSA9IHJlY29yZC5jLnNsaWNlKCk7XG4gIG5vdGlmeShyZWNvcmQsIHRydWUpO1xufTtcbnZhciAkcmVzb2x2ZSA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgdmFyIHJlY29yZCA9IHRoaXNcbiAgICAsIHRoZW47XG4gIGlmKHJlY29yZC5kKXJldHVybjtcbiAgcmVjb3JkLmQgPSB0cnVlO1xuICByZWNvcmQgPSByZWNvcmQuciB8fCByZWNvcmQ7IC8vIHVud3JhcFxuICB0cnkge1xuICAgIGlmKHJlY29yZC5wID09PSB2YWx1ZSl0aHJvdyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIGl0c2VsZlwiKTtcbiAgICBpZih0aGVuID0gaXNUaGVuYWJsZSh2YWx1ZSkpe1xuICAgICAgYXNhcChmdW5jdGlvbigpe1xuICAgICAgICB2YXIgd3JhcHBlciA9IHtyOiByZWNvcmQsIGQ6IGZhbHNlfTsgLy8gd3JhcFxuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgY3R4KCRyZXNvbHZlLCB3cmFwcGVyLCAxKSwgY3R4KCRyZWplY3QsIHdyYXBwZXIsIDEpKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAkcmVqZWN0LmNhbGwod3JhcHBlciwgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWNvcmQudiA9IHZhbHVlO1xuICAgICAgcmVjb3JkLnMgPSAxO1xuICAgICAgbm90aWZ5KHJlY29yZCwgZmFsc2UpO1xuICAgIH1cbiAgfSBjYXRjaChlKXtcbiAgICAkcmVqZWN0LmNhbGwoe3I6IHJlY29yZCwgZDogZmFsc2V9LCBlKTsgLy8gd3JhcFxuICB9XG59O1xuXG4vLyBjb25zdHJ1Y3RvciBwb2x5ZmlsbFxuaWYoIVVTRV9OQVRJVkUpe1xuICAvLyAyNS40LjMuMSBQcm9taXNlKGV4ZWN1dG9yKVxuICBQID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcil7XG4gICAgYUZ1bmN0aW9uKGV4ZWN1dG9yKTtcbiAgICB2YXIgcmVjb3JkID0gdGhpcy5fZCA9IHtcbiAgICAgIHA6IHN0cmljdE5ldyh0aGlzLCBQLCBQUk9NSVNFKSwgICAgICAgICAvLyA8LSBwcm9taXNlXG4gICAgICBjOiBbXSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gYXdhaXRpbmcgcmVhY3Rpb25zXG4gICAgICBhOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gY2hlY2tlZCBpbiBpc1VuaGFuZGxlZCByZWFjdGlvbnNcbiAgICAgIHM6IDAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBzdGF0ZVxuICAgICAgZDogZmFsc2UsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGRvbmVcbiAgICAgIHY6IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSB2YWx1ZVxuICAgICAgaDogZmFsc2UsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGhhbmRsZWQgcmVqZWN0aW9uXG4gICAgICBuOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gbm90aWZ5XG4gICAgfTtcbiAgICB0cnkge1xuICAgICAgZXhlY3V0b3IoY3R4KCRyZXNvbHZlLCByZWNvcmQsIDEpLCBjdHgoJHJlamVjdCwgcmVjb3JkLCAxKSk7XG4gICAgfSBjYXRjaChlcnIpe1xuICAgICAgJHJlamVjdC5jYWxsKHJlY29yZCwgZXJyKTtcbiAgICB9XG4gIH07XG4gIHJlcXVpcmUoJy4vJC5yZWRlZmluZS1hbGwnKShQLnByb3RvdHlwZSwge1xuICAgIC8vIDI1LjQuNS4zIFByb21pc2UucHJvdG90eXBlLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXG4gICAgdGhlbjogZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCl7XG4gICAgICB2YXIgcmVhY3Rpb24gPSBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoc3BlY2llc0NvbnN0cnVjdG9yKHRoaXMsIFApKVxuICAgICAgICAsIHByb21pc2UgID0gcmVhY3Rpb24ucHJvbWlzZVxuICAgICAgICAsIHJlY29yZCAgID0gdGhpcy5fZDtcbiAgICAgIHJlYWN0aW9uLm9rICAgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogdHJ1ZTtcbiAgICAgIHJlYWN0aW9uLmZhaWwgPSB0eXBlb2Ygb25SZWplY3RlZCA9PSAnZnVuY3Rpb24nICYmIG9uUmVqZWN0ZWQ7XG4gICAgICByZWNvcmQuYy5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmKHJlY29yZC5hKXJlY29yZC5hLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYocmVjb3JkLnMpbm90aWZ5KHJlY29yZCwgZmFsc2UpO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfSxcbiAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxuICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpe1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuICAgIH1cbiAgfSk7XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHtQcm9taXNlOiBQfSk7XG5yZXF1aXJlKCcuLyQuc2V0LXRvLXN0cmluZy10YWcnKShQLCBQUk9NSVNFKTtcbnJlcXVpcmUoJy4vJC5zZXQtc3BlY2llcycpKFBST01JU0UpO1xuV3JhcHBlciA9IHJlcXVpcmUoJy4vJC5jb3JlJylbUFJPTUlTRV07XG5cbi8vIHN0YXRpY3NcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjUgUHJvbWlzZS5yZWplY3QocilcbiAgcmVqZWN0OiBmdW5jdGlvbiByZWplY3Qocil7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXcgUHJvbWlzZUNhcGFiaWxpdHkodGhpcylcbiAgICAgICwgJCRyZWplY3QgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgICQkcmVqZWN0KHIpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoIVVTRV9OQVRJVkUgfHwgdGVzdFJlc29sdmUodHJ1ZSkpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC42IFByb21pc2UucmVzb2x2ZSh4KVxuICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKHgpe1xuICAgIC8vIGluc3RhbmNlb2YgaW5zdGVhZCBvZiBpbnRlcm5hbCBzbG90IGNoZWNrIGJlY2F1c2Ugd2Ugc2hvdWxkIGZpeCBpdCB3aXRob3V0IHJlcGxhY2VtZW50IG5hdGl2ZSBQcm9taXNlIGNvcmVcbiAgICBpZih4IGluc3RhbmNlb2YgUCAmJiBzYW1lQ29uc3RydWN0b3IoeC5jb25zdHJ1Y3RvciwgdGhpcykpcmV0dXJuIHg7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXcgUHJvbWlzZUNhcGFiaWxpdHkodGhpcylcbiAgICAgICwgJCRyZXNvbHZlICA9IGNhcGFiaWxpdHkucmVzb2x2ZTtcbiAgICAkJHJlc29sdmUoeCk7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICEoVVNFX05BVElWRSAmJiByZXF1aXJlKCcuLyQuaXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXtcbiAgUC5hbGwoaXRlcilbJ2NhdGNoJ10oZnVuY3Rpb24oKXt9KTtcbn0pKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuMSBQcm9taXNlLmFsbChpdGVyYWJsZSlcbiAgYWxsOiBmdW5jdGlvbiBhbGwoaXRlcmFibGUpe1xuICAgIHZhciBDICAgICAgICAgID0gZ2V0Q29uc3RydWN0b3IodGhpcylcbiAgICAgICwgY2FwYWJpbGl0eSA9IG5ldyBQcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgICAgLCByZXNvbHZlICAgID0gY2FwYWJpbGl0eS5yZXNvbHZlXG4gICAgICAsIHJlamVjdCAgICAgPSBjYXBhYmlsaXR5LnJlamVjdFxuICAgICAgLCB2YWx1ZXMgICAgID0gW107XG4gICAgdmFyIGFicnVwdCA9IHBlcmZvcm0oZnVuY3Rpb24oKXtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgdmFsdWVzLnB1c2gsIHZhbHVlcyk7XG4gICAgICB2YXIgcmVtYWluaW5nID0gdmFsdWVzLmxlbmd0aFxuICAgICAgICAsIHJlc3VsdHMgICA9IEFycmF5KHJlbWFpbmluZyk7XG4gICAgICBpZihyZW1haW5pbmcpJC5lYWNoLmNhbGwodmFsdWVzLCBmdW5jdGlvbihwcm9taXNlLCBpbmRleCl7XG4gICAgICAgIHZhciBhbHJlYWR5Q2FsbGVkID0gZmFsc2U7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICBpZihhbHJlYWR5Q2FsbGVkKXJldHVybjtcbiAgICAgICAgICBhbHJlYWR5Q2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgICByZXN1bHRzW2luZGV4XSA9IHZhbHVlO1xuICAgICAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUocmVzdWx0cyk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICAgIGVsc2UgcmVzb2x2ZShyZXN1bHRzKTtcbiAgICB9KTtcbiAgICBpZihhYnJ1cHQpcmVqZWN0KGFicnVwdC5lcnJvcik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfSxcbiAgLy8gMjUuNC40LjQgUHJvbWlzZS5yYWNlKGl0ZXJhYmxlKVxuICByYWNlOiBmdW5jdGlvbiByYWNlKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyAgICAgICAgICA9IGdldENvbnN0cnVjdG9yKHRoaXMpXG4gICAgICAsIGNhcGFiaWxpdHkgPSBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgICwgcmVqZWN0ICAgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihjYXBhYmlsaXR5LnJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZihhYnJ1cHQpcmVqZWN0KGFicnVwdC5lcnJvcik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vJC5pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uKGl0ZXJhdGVkKXtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwgaW5kZXggPSB0aGlzLl9pXG4gICAgLCBwb2ludDtcbiAgaWYoaW5kZXggPj0gTy5sZW5ndGgpcmV0dXJuIHt2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHt2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlfTtcbn0pOyIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpO1xuSXRlcmF0b3JzLk5vZGVMaXN0ID0gSXRlcmF0b3JzLkhUTUxDb2xsZWN0aW9uID0gSXRlcmF0b3JzLkFycmF5OyIsIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXMtYXJyYXknKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gU2xvd0J1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyIC8vIG5vdCB1c2VkIGJ5IHRoaXMgaW1wbGVtZW50YXRpb25cblxudmFyIHJvb3RQYXJlbnQgPSB7fVxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBEdWUgdG8gdmFyaW91cyBicm93c2VyIGJ1Z3MsIHNvbWV0aW1lcyB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uIHdpbGwgYmUgdXNlZCBldmVuXG4gKiB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIHR5cGVkIGFycmF5cy5cbiAqXG4gKiBOb3RlOlxuICpcbiAqICAgLSBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsXG4gKiAgICAgU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzguXG4gKlxuICogICAtIFNhZmFyaSA1LTcgbGFja3Mgc3VwcG9ydCBmb3IgY2hhbmdpbmcgdGhlIGBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yYCBwcm9wZXJ0eVxuICogICAgIG9uIG9iamVjdHMuXG4gKlxuICogICAtIENocm9tZSA5LTEwIGlzIG1pc3NpbmcgdGhlIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24uXG4gKlxuICogICAtIElFMTAgaGFzIGEgYnJva2VuIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhcnJheXMgb2ZcbiAqICAgICBpbmNvcnJlY3QgbGVuZ3RoIGluIHNvbWUgc2l0dWF0aW9ucy5cblxuICogV2UgZGV0ZWN0IHRoZXNlIGJ1Z2d5IGJyb3dzZXJzIGFuZCBzZXQgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYCB0byBgZmFsc2VgIHNvIHRoZXlcbiAqIGdldCB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uLCB3aGljaCBpcyBzbG93ZXIgYnV0IGJlaGF2ZXMgY29ycmVjdGx5LlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUICE9PSB1bmRlZmluZWRcbiAgPyBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVFxuICA6IHR5cGVkQXJyYXlTdXBwb3J0KClcblxuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICBmdW5jdGlvbiBCYXIgKCkge31cbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoMSlcbiAgICBhcnIuZm9vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfVxuICAgIGFyci5jb25zdHJ1Y3RvciA9IEJhclxuICAgIHJldHVybiBhcnIuZm9vKCkgPT09IDQyICYmIC8vIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkXG4gICAgICAgIGFyci5jb25zdHJ1Y3RvciA9PT0gQmFyICYmIC8vIGNvbnN0cnVjdG9yIGNhbiBiZSBzZXRcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAmJiAvLyBjaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgICAgICAgYXJyLnN1YmFycmF5KDEsIDEpLmJ5dGVMZW5ndGggPT09IDAgLy8gaWUxMCBoYXMgYnJva2VuIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmZ1bmN0aW9uIGtNYXhMZW5ndGggKCkge1xuICByZXR1cm4gQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgICA/IDB4N2ZmZmZmZmZcbiAgICA6IDB4M2ZmZmZmZmZcbn1cblxuLyoqXG4gKiBDbGFzczogQnVmZmVyXG4gKiA9PT09PT09PT09PT09XG4gKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBhcmUgYXVnbWVudGVkXG4gKiB3aXRoIGZ1bmN0aW9uIHByb3BlcnRpZXMgZm9yIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBBUEkgZnVuY3Rpb25zLiBXZSB1c2VcbiAqIGBVaW50OEFycmF5YCBzbyB0aGF0IHNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0IHJldHVybnNcbiAqIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIEJ5IGF1Z21lbnRpbmcgdGhlIGluc3RhbmNlcywgd2UgY2FuIGF2b2lkIG1vZGlmeWluZyB0aGUgYFVpbnQ4QXJyYXlgXG4gKiBwcm90b3R5cGUuXG4gKi9cbmZ1bmN0aW9uIEJ1ZmZlciAoYXJnKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKSB7XG4gICAgLy8gQXZvaWQgZ29pbmcgdGhyb3VnaCBhbiBBcmd1bWVudHNBZGFwdG9yVHJhbXBvbGluZSBpbiB0aGUgY29tbW9uIGNhc2UuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSByZXR1cm4gbmV3IEJ1ZmZlcihhcmcsIGFyZ3VtZW50c1sxXSlcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihhcmcpXG4gIH1cblxuICB0aGlzLmxlbmd0aCA9IDBcbiAgdGhpcy5wYXJlbnQgPSB1bmRlZmluZWRcblxuICAvLyBDb21tb24gY2FzZS5cbiAgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIGZyb21OdW1iZXIodGhpcywgYXJnKVxuICB9XG5cbiAgLy8gU2xpZ2h0bHkgbGVzcyBjb21tb24gY2FzZS5cbiAgaWYgKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZyb21TdHJpbmcodGhpcywgYXJnLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6ICd1dGY4JylcbiAgfVxuXG4gIC8vIFVudXN1YWwuXG4gIHJldHVybiBmcm9tT2JqZWN0KHRoaXMsIGFyZylcbn1cblxuZnVuY3Rpb24gZnJvbU51bWJlciAodGhhdCwgbGVuZ3RoKSB7XG4gIHRoYXQgPSBhbGxvY2F0ZSh0aGF0LCBsZW5ndGggPCAwID8gMCA6IGNoZWNrZWQobGVuZ3RoKSB8IDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGF0W2ldID0gMFxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tU3RyaW5nICh0aGF0LCBzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnIHx8IGVuY29kaW5nID09PSAnJykgZW5jb2RpbmcgPSAndXRmOCdcblxuICAvLyBBc3N1bXB0aW9uOiBieXRlTGVuZ3RoKCkgcmV0dXJuIHZhbHVlIGlzIGFsd2F5cyA8IGtNYXhMZW5ndGguXG4gIHZhciBsZW5ndGggPSBieXRlTGVuZ3RoKHN0cmluZywgZW5jb2RpbmcpIHwgMFxuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoKVxuXG4gIHRoYXQud3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAodGhhdCwgb2JqZWN0KSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIob2JqZWN0KSkgcmV0dXJuIGZyb21CdWZmZXIodGhhdCwgb2JqZWN0KVxuXG4gIGlmIChpc0FycmF5KG9iamVjdCkpIHJldHVybiBmcm9tQXJyYXkodGhhdCwgb2JqZWN0KVxuXG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ211c3Qgc3RhcnQgd2l0aCBudW1iZXIsIGJ1ZmZlciwgYXJyYXkgb3Igc3RyaW5nJylcbiAgfVxuXG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKG9iamVjdC5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgICAgcmV0dXJuIGZyb21UeXBlZEFycmF5KHRoYXQsIG9iamVjdClcbiAgICB9XG4gICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKHRoYXQsIG9iamVjdClcbiAgICB9XG4gIH1cblxuICBpZiAob2JqZWN0Lmxlbmd0aCkgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqZWN0KVxuXG4gIHJldHVybiBmcm9tSnNvbk9iamVjdCh0aGF0LCBvYmplY3QpXG59XG5cbmZ1bmN0aW9uIGZyb21CdWZmZXIgKHRoYXQsIGJ1ZmZlcikge1xuICB2YXIgbGVuZ3RoID0gY2hlY2tlZChidWZmZXIubGVuZ3RoKSB8IDBcbiAgdGhhdCA9IGFsbG9jYXRlKHRoYXQsIGxlbmd0aClcbiAgYnVmZmVyLmNvcHkodGhhdCwgMCwgMCwgbGVuZ3RoKVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXkgKHRoYXQsIGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBhbGxvY2F0ZSh0aGF0LCBsZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICB0aGF0W2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG4vLyBEdXBsaWNhdGUgb2YgZnJvbUFycmF5KCkgdG8ga2VlcCBmcm9tQXJyYXkoKSBtb25vbW9ycGhpYy5cbmZ1bmN0aW9uIGZyb21UeXBlZEFycmF5ICh0aGF0LCBhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoKVxuICAvLyBUcnVuY2F0aW5nIHRoZSBlbGVtZW50cyBpcyBwcm9iYWJseSBub3Qgd2hhdCBwZW9wbGUgZXhwZWN0IGZyb20gdHlwZWRcbiAgLy8gYXJyYXlzIHdpdGggQllURVNfUEVSX0VMRU1FTlQgPiAxIGJ1dCBpdCdzIGNvbXBhdGlibGUgd2l0aCB0aGUgYmVoYXZpb3JcbiAgLy8gb2YgdGhlIG9sZCBCdWZmZXIgY29uc3RydWN0b3IuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICB0aGF0W2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlCdWZmZXIgKHRoYXQsIGFycmF5KSB7XG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLCBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIGFycmF5LmJ5dGVMZW5ndGhcbiAgICB0aGF0ID0gQnVmZmVyLl9hdWdtZW50KG5ldyBVaW50OEFycmF5KGFycmF5KSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgdGhhdCA9IGZyb21UeXBlZEFycmF5KHRoYXQsIG5ldyBVaW50OEFycmF5KGFycmF5KSlcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlMaWtlICh0aGF0LCBhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuLy8gRGVzZXJpYWxpemUgeyB0eXBlOiAnQnVmZmVyJywgZGF0YTogWzEsMiwzLC4uLl0gfSBpbnRvIGEgQnVmZmVyIG9iamVjdC5cbi8vIFJldHVybnMgYSB6ZXJvLWxlbmd0aCBidWZmZXIgZm9yIGlucHV0cyB0aGF0IGRvbid0IGNvbmZvcm0gdG8gdGhlIHNwZWMuXG5mdW5jdGlvbiBmcm9tSnNvbk9iamVjdCAodGhhdCwgb2JqZWN0KSB7XG4gIHZhciBhcnJheVxuICB2YXIgbGVuZ3RoID0gMFxuXG4gIGlmIChvYmplY3QudHlwZSA9PT0gJ0J1ZmZlcicgJiYgaXNBcnJheShvYmplY3QuZGF0YSkpIHtcbiAgICBhcnJheSA9IG9iamVjdC5kYXRhXG4gICAgbGVuZ3RoID0gY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB9XG4gIHRoYXQgPSBhbGxvY2F0ZSh0aGF0LCBsZW5ndGgpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIHRoYXRbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbmlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICBCdWZmZXIucHJvdG90eXBlLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXkucHJvdG90eXBlXG4gIEJ1ZmZlci5fX3Byb3RvX18gPSBVaW50OEFycmF5XG59XG5cbmZ1bmN0aW9uIGFsbG9jYXRlICh0aGF0LCBsZW5ndGgpIHtcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UsIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgdGhhdCA9IEJ1ZmZlci5fYXVnbWVudChuZXcgVWludDhBcnJheShsZW5ndGgpKVxuICAgIHRoYXQuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gYW4gb2JqZWN0IGluc3RhbmNlIG9mIHRoZSBCdWZmZXIgY2xhc3NcbiAgICB0aGF0Lmxlbmd0aCA9IGxlbmd0aFxuICAgIHRoYXQuX2lzQnVmZmVyID0gdHJ1ZVxuICB9XG5cbiAgdmFyIGZyb21Qb29sID0gbGVuZ3RoICE9PSAwICYmIGxlbmd0aCA8PSBCdWZmZXIucG9vbFNpemUgPj4+IDFcbiAgaWYgKGZyb21Qb29sKSB0aGF0LnBhcmVudCA9IHJvb3RQYXJlbnRcblxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwga01heExlbmd0aGAgaGVyZSBiZWNhdXNlIHRoYXQgZmFpbHMgd2hlblxuICAvLyBsZW5ndGggaXMgTmFOICh3aGljaCBpcyBvdGhlcndpc2UgY29lcmNlZCB0byB6ZXJvLilcbiAgaWYgKGxlbmd0aCA+PSBrTWF4TGVuZ3RoKCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAnc2l6ZTogMHgnICsga01heExlbmd0aCgpLnRvU3RyaW5nKDE2KSArICcgYnl0ZXMnKVxuICB9XG4gIHJldHVybiBsZW5ndGggfCAwXG59XG5cbmZ1bmN0aW9uIFNsb3dCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTbG93QnVmZmVyKSkgcmV0dXJuIG5ldyBTbG93QnVmZmVyKHN1YmplY3QsIGVuY29kaW5nKVxuXG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nKVxuICBkZWxldGUgYnVmLnBhcmVudFxuICByZXR1cm4gYnVmXG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyIChiKSB7XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihhKSB8fCAhQnVmZmVyLmlzQnVmZmVyKGIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIG11c3QgYmUgQnVmZmVycycpXG4gIH1cblxuICBpZiAoYSA9PT0gYikgcmV0dXJuIDBcblxuICB2YXIgeCA9IGEubGVuZ3RoXG4gIHZhciB5ID0gYi5sZW5ndGhcblxuICB2YXIgaSA9IDBcbiAgdmFyIGxlbiA9IE1hdGgubWluKHgsIHkpXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIGJyZWFrXG5cbiAgICArK2lcbiAgfVxuXG4gIGlmIChpICE9PSBsZW4pIHtcbiAgICB4ID0gYVtpXVxuICAgIHkgPSBiW2ldXG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gaXNFbmNvZGluZyAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIWlzQXJyYXkobGlzdCkpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2xpc3QgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzLicpXG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoMClcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGxlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgbGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIobGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXVxuICAgIGl0ZW0uY29weShidWYsIHBvcylcbiAgICBwb3MgKz0gaXRlbS5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSBzdHJpbmcgPSAnJyArIHN0cmluZ1xuXG4gIHZhciBsZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgLy8gRGVwcmVjYXRlZFxuICAgICAgY2FzZSAncmF3JzpcbiAgICAgIGNhc2UgJ3Jhd3MnOlxuICAgICAgICByZXR1cm4gbGVuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gbGVuICogMlxuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGxlbiA+Pj4gMVxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoIC8vIGFzc3VtZSB1dGY4XG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcblxuLy8gcHJlLXNldCBmb3IgdmFsdWVzIHRoYXQgbWF5IGV4aXN0IGluIHRoZSBmdXR1cmVcbkJ1ZmZlci5wcm90b3R5cGUubGVuZ3RoID0gdW5kZWZpbmVkXG5CdWZmZXIucHJvdG90eXBlLnBhcmVudCA9IHVuZGVmaW5lZFxuXG5mdW5jdGlvbiBzbG93VG9TdHJpbmcgKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG5cbiAgc3RhcnQgPSBzdGFydCB8IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID09PSBJbmZpbml0eSA/IHRoaXMubGVuZ3RoIDogZW5kIHwgMFxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG4gIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmIChlbmQgPD0gc3RhcnQpIHJldHVybiAnJ1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGJpbmFyeVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdXRmMTZsZVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9IChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGggfCAwXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiAnJ1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCAwLCBsZW5ndGgpXG4gIHJldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAoYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYikgPT09IDBcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gIHZhciBzdHIgPSAnJ1xuICB2YXIgbWF4ID0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFU1xuICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5tYXRjaCgvLnsyfS9nKS5qb2luKCcgJylcbiAgICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gMFxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYilcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gaW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0KSB7XG4gIGlmIChieXRlT2Zmc2V0ID4gMHg3ZmZmZmZmZikgYnl0ZU9mZnNldCA9IDB4N2ZmZmZmZmZcbiAgZWxzZSBpZiAoYnl0ZU9mZnNldCA8IC0weDgwMDAwMDAwKSBieXRlT2Zmc2V0ID0gLTB4ODAwMDAwMDBcbiAgYnl0ZU9mZnNldCA+Pj0gMFxuXG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xXG4gIGlmIChieXRlT2Zmc2V0ID49IHRoaXMubGVuZ3RoKSByZXR1cm4gLTFcblxuICAvLyBOZWdhdGl2ZSBvZmZzZXRzIHN0YXJ0IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyXG4gIGlmIChieXRlT2Zmc2V0IDwgMCkgYnl0ZU9mZnNldCA9IE1hdGgubWF4KHRoaXMubGVuZ3RoICsgYnl0ZU9mZnNldCwgMClcblxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xIC8vIHNwZWNpYWwgY2FzZTogbG9va2luZyBmb3IgZW1wdHkgc3RyaW5nIGFsd2F5cyBmYWlsc1xuICAgIHJldHVybiBTdHJpbmcucHJvdG90eXBlLmluZGV4T2YuY2FsbCh0aGlzLCB2YWwsIGJ5dGVPZmZzZXQpXG4gIH1cbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcih2YWwpKSB7XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQpXG4gIH1cbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwodGhpcywgdmFsLCBieXRlT2Zmc2V0KVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKHRoaXMsIFsgdmFsIF0sIGJ5dGVPZmZzZXQpXG4gIH1cblxuICBmdW5jdGlvbiBhcnJheUluZGV4T2YgKGFyciwgdmFsLCBieXRlT2Zmc2V0KSB7XG4gICAgdmFyIGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAodmFyIGkgPSAwOyBieXRlT2Zmc2V0ICsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFycltieXRlT2Zmc2V0ICsgaV0gPT09IHZhbFtmb3VuZEluZGV4ID09PSAtMSA/IDAgOiBpIC0gZm91bmRJbmRleF0pIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSBmb3VuZEluZGV4ID0gaVxuICAgICAgICBpZiAoaSAtIGZvdW5kSW5kZXggKyAxID09PSB2YWwubGVuZ3RoKSByZXR1cm4gYnl0ZU9mZnNldCArIGZvdW5kSW5kZXhcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvdW5kSW5kZXggPSAtMVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTFcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlcicpXG59XG5cbi8vIGBnZXRgIGlzIGRlcHJlY2F0ZWRcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0IChvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5nZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLnJlYWRVSW50OChvZmZzZXQpXG59XG5cbi8vIGBzZXRgIGlzIGRlcHJlY2F0ZWRcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0ICh2LCBvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5zZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLndyaXRlVUludDgodiwgb2Zmc2V0KVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChzdHJMZW4gJSAyICE9PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKGlzTmFOKHBhcnNlZCkpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGFzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gdWNzMldyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIHdyaXRlIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nKVxuICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIG9mZnNldFssIGxlbmd0aF1bLCBlbmNvZGluZ10pXG4gIH0gZWxzZSBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgICBpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgbGVuZ3RoID0gbGVuZ3RoIHwgMFxuICAgICAgaWYgKGVuY29kaW5nID09PSB1bmRlZmluZWQpIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIC8vIGxlZ2FjeSB3cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aCkgLSByZW1vdmUgaW4gdjAuMTNcbiAgfSBlbHNlIHtcbiAgICB2YXIgc3dhcCA9IGVuY29kaW5nXG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBvZmZzZXQgPSBsZW5ndGggfCAwXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCB8fCBsZW5ndGggPiByZW1haW5pbmcpIGxlbmd0aCA9IHJlbWFpbmluZ1xuXG4gIGlmICgoc3RyaW5nLmxlbmd0aCA+IDAgJiYgKGxlbmd0aCA8IDAgfHwgb2Zmc2V0IDwgMCkpIHx8IG9mZnNldCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2F0dGVtcHQgdG8gd3JpdGUgb3V0c2lkZSBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBiaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIHZhciByZXMgPSBbXVxuXG4gIHZhciBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICB2YXIgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgdmFyIGNvZGVQb2ludCA9IG51bGxcbiAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKSA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpID8gM1xuICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRikgPyAyXG4gICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIHZhciBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbnZhciBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgdmFyIGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgdmFyIHJlcyA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGJpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpICsgMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gfn5zdGFydFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IH5+ZW5kXG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ICs9IGxlblxuICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICB9IGVsc2UgaWYgKHN0YXJ0ID4gbGVuKSB7XG4gICAgc3RhcnQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlblxuICAgIGlmIChlbmQgPCAwKSBlbmQgPSAwXG4gIH0gZWxzZSBpZiAoZW5kID4gbGVuKSB7XG4gICAgZW5kID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgdmFyIG5ld0J1ZlxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBuZXdCdWYgPSBCdWZmZXIuX2F1Z21lbnQodGhpcy5zdWJhcnJheShzdGFydCwgZW5kKSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfVxuXG4gIGlmIChuZXdCdWYubGVuZ3RoKSBuZXdCdWYucGFyZW50ID0gdGhpcy5wYXJlbnQgfHwgdGhpc1xuXG4gIHJldHVybiBuZXdCdWZcbn1cblxuLypcbiAqIE5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgYnVmZmVyIGlzbid0IHRyeWluZyB0byB3cml0ZSBvdXQgb2YgYm91bmRzLlxuICovXG5mdW5jdGlvbiBjaGVja09mZnNldCAob2Zmc2V0LCBleHQsIGxlbmd0aCkge1xuICBpZiAoKG9mZnNldCAlIDEpICE9PSAwIHx8IG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdvZmZzZXQgaXMgbm90IHVpbnQnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gbGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRMRSA9IGZ1bmN0aW9uIHJlYWRVSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRSA9IGZ1bmN0aW9uIHJlYWRVSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIHZhciBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiByZWFkVUludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICgodGhpc1tvZmZzZXRdKSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikpICtcbiAgICAgICh0aGlzW29mZnNldCArIDNdICogMHgxMDAwMDAwKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdICogMHgxMDAwMDAwKSArXG4gICAgKCh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgIHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludExFID0gZnVuY3Rpb24gcmVhZEludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoXG4gIHZhciBtdWwgPSAxXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0taV1cbiAgd2hpbGUgKGkgPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1pXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiByZWFkSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICBpZiAoISh0aGlzW29mZnNldF0gJiAweDgwKSkgcmV0dXJuICh0aGlzW29mZnNldF0pXG4gIHJldHVybiAoKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gcmVhZEludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIDFdIHwgKHRoaXNbb2Zmc2V0XSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiByZWFkSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdKSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10gPDwgMjQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiByZWFkSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiByZWFkRmxvYXRCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgNTIsIDgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignYnVmZmVyIG11c3QgYmUgYSBCdWZmZXIgaW5zdGFuY2UnKVxuICBpZiAodmFsdWUgPiBtYXggfHwgdmFsdWUgPCBtaW4pIHRocm93IG5ldyBSYW5nZUVycm9yKCd2YWx1ZSBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdpbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludExFID0gZnVuY3Rpb24gd3JpdGVVSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSwgMClcblxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludEJFID0gZnVuY3Rpb24gd3JpdGVVSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSwgMClcblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiB3cml0ZVVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4ZmYsIDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludExFID0gZnVuY3Rpb24gd3JpdGVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGggLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IHZhbHVlIDwgMCA/IDEgOiAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gdmFsdWUgPCAwID8gMSA6IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndmFsdWUgaXMgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignaW5kZXggb3V0IG9mIHJhbmdlJylcbiAgaWYgKG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdpbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5mdW5jdGlvbiB3cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDgsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG4gIHJldHVybiBvZmZzZXQgKyA4XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weSAodGFyZ2V0LCB0YXJnZXRTdGFydCwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0U3RhcnQgPj0gdGFyZ2V0Lmxlbmd0aCkgdGFyZ2V0U3RhcnQgPSB0YXJnZXQubGVuZ3RoXG4gIGlmICghdGFyZ2V0U3RhcnQpIHRhcmdldFN0YXJ0ID0gMFxuICBpZiAoZW5kID4gMCAmJiBlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVybiAwXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgaWYgKHRhcmdldFN0YXJ0IDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgfVxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChlbmQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0ICsgc3RhcnRcbiAgfVxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuICB2YXIgaVxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQgJiYgc3RhcnQgPCB0YXJnZXRTdGFydCAmJiB0YXJnZXRTdGFydCA8IGVuZCkge1xuICAgIC8vIGRlc2NlbmRpbmcgY29weSBmcm9tIGVuZFxuICAgIGZvciAoaSA9IGxlbiAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIGlmIChsZW4gPCAxMDAwIHx8ICFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIGFzY2VuZGluZyBjb3B5IGZyb20gc3RhcnRcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5fc2V0KHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSwgdGFyZ2V0U3RhcnQpXG4gIH1cblxuICByZXR1cm4gbGVuXG59XG5cbi8vIGZpbGwodmFsdWUsIHN0YXJ0PTAsIGVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCAodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCF2YWx1ZSkgdmFsdWUgPSAwXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCkgZW5kID0gdGhpcy5sZW5ndGhcblxuICBpZiAoZW5kIDwgc3RhcnQpIHRocm93IG5ldyBSYW5nZUVycm9yKCdlbmQgPCBzdGFydCcpXG5cbiAgLy8gRmlsbCAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChlbmQgPCAwIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignZW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgdGhpc1tpXSA9IHZhbHVlXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBieXRlcyA9IHV0ZjhUb0J5dGVzKHZhbHVlLnRvU3RyaW5nKCkpXG4gICAgdmFyIGxlbiA9IGJ5dGVzLmxlbmd0aFxuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgIHRoaXNbaV0gPSBieXRlc1tpICUgbGVuXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgQXJyYXlCdWZmZXJgIHdpdGggdGhlICpjb3BpZWQqIG1lbW9yeSBvZiB0aGUgYnVmZmVyIGluc3RhbmNlLlxuICogQWRkZWQgaW4gTm9kZSAwLjEyLiBPbmx5IGF2YWlsYWJsZSBpbiBicm93c2VycyB0aGF0IHN1cHBvcnQgQXJyYXlCdWZmZXIuXG4gKi9cbkJ1ZmZlci5wcm90b3R5cGUudG9BcnJheUJ1ZmZlciA9IGZ1bmN0aW9uIHRvQXJyYXlCdWZmZXIgKCkge1xuICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgICByZXR1cm4gKG5ldyBCdWZmZXIodGhpcykpLmJ1ZmZlclxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5sZW5ndGgpXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYnVmLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgIGJ1ZltpXSA9IHRoaXNbaV1cbiAgICAgIH1cbiAgICAgIHJldHVybiBidWYuYnVmZmVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0J1ZmZlci50b0FycmF5QnVmZmVyIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJylcbiAgfVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbnZhciBCUCA9IEJ1ZmZlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBdWdtZW50IGEgVWludDhBcnJheSAqaW5zdGFuY2UqIChub3QgdGhlIFVpbnQ4QXJyYXkgY2xhc3MhKSB3aXRoIEJ1ZmZlciBtZXRob2RzXG4gKi9cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIF9hdWdtZW50IChhcnIpIHtcbiAgYXJyLmNvbnN0cnVjdG9yID0gQnVmZmVyXG4gIGFyci5faXNCdWZmZXIgPSB0cnVlXG5cbiAgLy8gc2F2ZSByZWZlcmVuY2UgdG8gb3JpZ2luYWwgVWludDhBcnJheSBzZXQgbWV0aG9kIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX3NldCA9IGFyci5zZXRcblxuICAvLyBkZXByZWNhdGVkXG4gIGFyci5nZXQgPSBCUC5nZXRcbiAgYXJyLnNldCA9IEJQLnNldFxuXG4gIGFyci53cml0ZSA9IEJQLndyaXRlXG4gIGFyci50b1N0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0xvY2FsZVN0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0pTT04gPSBCUC50b0pTT05cbiAgYXJyLmVxdWFscyA9IEJQLmVxdWFsc1xuICBhcnIuY29tcGFyZSA9IEJQLmNvbXBhcmVcbiAgYXJyLmluZGV4T2YgPSBCUC5pbmRleE9mXG4gIGFyci5jb3B5ID0gQlAuY29weVxuICBhcnIuc2xpY2UgPSBCUC5zbGljZVxuICBhcnIucmVhZFVJbnRMRSA9IEJQLnJlYWRVSW50TEVcbiAgYXJyLnJlYWRVSW50QkUgPSBCUC5yZWFkVUludEJFXG4gIGFyci5yZWFkVUludDggPSBCUC5yZWFkVUludDhcbiAgYXJyLnJlYWRVSW50MTZMRSA9IEJQLnJlYWRVSW50MTZMRVxuICBhcnIucmVhZFVJbnQxNkJFID0gQlAucmVhZFVJbnQxNkJFXG4gIGFyci5yZWFkVUludDMyTEUgPSBCUC5yZWFkVUludDMyTEVcbiAgYXJyLnJlYWRVSW50MzJCRSA9IEJQLnJlYWRVSW50MzJCRVxuICBhcnIucmVhZEludExFID0gQlAucmVhZEludExFXG4gIGFyci5yZWFkSW50QkUgPSBCUC5yZWFkSW50QkVcbiAgYXJyLnJlYWRJbnQ4ID0gQlAucmVhZEludDhcbiAgYXJyLnJlYWRJbnQxNkxFID0gQlAucmVhZEludDE2TEVcbiAgYXJyLnJlYWRJbnQxNkJFID0gQlAucmVhZEludDE2QkVcbiAgYXJyLnJlYWRJbnQzMkxFID0gQlAucmVhZEludDMyTEVcbiAgYXJyLnJlYWRJbnQzMkJFID0gQlAucmVhZEludDMyQkVcbiAgYXJyLnJlYWRGbG9hdExFID0gQlAucmVhZEZsb2F0TEVcbiAgYXJyLnJlYWRGbG9hdEJFID0gQlAucmVhZEZsb2F0QkVcbiAgYXJyLnJlYWREb3VibGVMRSA9IEJQLnJlYWREb3VibGVMRVxuICBhcnIucmVhZERvdWJsZUJFID0gQlAucmVhZERvdWJsZUJFXG4gIGFyci53cml0ZVVJbnQ4ID0gQlAud3JpdGVVSW50OFxuICBhcnIud3JpdGVVSW50TEUgPSBCUC53cml0ZVVJbnRMRVxuICBhcnIud3JpdGVVSW50QkUgPSBCUC53cml0ZVVJbnRCRVxuICBhcnIud3JpdGVVSW50MTZMRSA9IEJQLndyaXRlVUludDE2TEVcbiAgYXJyLndyaXRlVUludDE2QkUgPSBCUC53cml0ZVVJbnQxNkJFXG4gIGFyci53cml0ZVVJbnQzMkxFID0gQlAud3JpdGVVSW50MzJMRVxuICBhcnIud3JpdGVVSW50MzJCRSA9IEJQLndyaXRlVUludDMyQkVcbiAgYXJyLndyaXRlSW50TEUgPSBCUC53cml0ZUludExFXG4gIGFyci53cml0ZUludEJFID0gQlAud3JpdGVJbnRCRVxuICBhcnIud3JpdGVJbnQ4ID0gQlAud3JpdGVJbnQ4XG4gIGFyci53cml0ZUludDE2TEUgPSBCUC53cml0ZUludDE2TEVcbiAgYXJyLndyaXRlSW50MTZCRSA9IEJQLndyaXRlSW50MTZCRVxuICBhcnIud3JpdGVJbnQzMkxFID0gQlAud3JpdGVJbnQzMkxFXG4gIGFyci53cml0ZUludDMyQkUgPSBCUC53cml0ZUludDMyQkVcbiAgYXJyLndyaXRlRmxvYXRMRSA9IEJQLndyaXRlRmxvYXRMRVxuICBhcnIud3JpdGVGbG9hdEJFID0gQlAud3JpdGVGbG9hdEJFXG4gIGFyci53cml0ZURvdWJsZUxFID0gQlAud3JpdGVEb3VibGVMRVxuICBhcnIud3JpdGVEb3VibGVCRSA9IEJQLndyaXRlRG91YmxlQkVcbiAgYXJyLmZpbGwgPSBCUC5maWxsXG4gIGFyci5pbnNwZWN0ID0gQlAuaW5zcGVjdFxuICBhcnIudG9BcnJheUJ1ZmZlciA9IEJQLnRvQXJyYXlCdWZmZXJcblxuICByZXR1cm4gYXJyXG59XG5cbnZhciBJTlZBTElEX0JBU0U2NF9SRSA9IC9bXitcXC8wLTlBLVphLXotX10vZ1xuXG5mdW5jdGlvbiBiYXNlNjRjbGVhbiAoc3RyKSB7XG4gIC8vIE5vZGUgc3RyaXBzIG91dCBpbnZhbGlkIGNoYXJhY3RlcnMgbGlrZSBcXG4gYW5kIFxcdCBmcm9tIHRoZSBzdHJpbmcsIGJhc2U2NC1qcyBkb2VzIG5vdFxuICBzdHIgPSBzdHJpbmd0cmltKHN0cikucmVwbGFjZShJTlZBTElEX0JBU0U2NF9SRSwgJycpXG4gIC8vIE5vZGUgY29udmVydHMgc3RyaW5ncyB3aXRoIGxlbmd0aCA8IDIgdG8gJydcbiAgaWYgKHN0ci5sZW5ndGggPCAyKSByZXR1cm4gJydcbiAgLy8gTm9kZSBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgYmFzZTY0IHN0cmluZ3MgKG1pc3NpbmcgdHJhaWxpbmcgPT09KSwgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHdoaWxlIChzdHIubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgIHN0ciA9IHN0ciArICc9J1xuICB9XG4gIHJldHVybiBzdHJcbn1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyaW5nLCB1bml0cykge1xuICB1bml0cyA9IHVuaXRzIHx8IEluZmluaXR5XG4gIHZhciBjb2RlUG9pbnRcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcbiAgdmFyIGxlYWRTdXJyb2dhdGUgPSBudWxsXG4gIHZhciBieXRlcyA9IFtdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGNvZGVQb2ludCA9IHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cbiAgICAvLyBpcyBzdXJyb2dhdGUgY29tcG9uZW50XG4gICAgaWYgKGNvZGVQb2ludCA+IDB4RDdGRiAmJiBjb2RlUG9pbnQgPCAweEUwMDApIHtcbiAgICAgIC8vIGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoIWxlYWRTdXJyb2dhdGUpIHtcbiAgICAgICAgLy8gbm8gbGVhZCB5ZXRcbiAgICAgICAgaWYgKGNvZGVQb2ludCA+IDB4REJGRikge1xuICAgICAgICAgIC8vIHVuZXhwZWN0ZWQgdHJhaWxcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKGkgKyAxID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAvLyB1bnBhaXJlZCBsZWFkXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkIGxlYWRcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIDIgbGVhZHMgaW4gYSByb3dcbiAgICAgIGlmIChjb2RlUG9pbnQgPCAweERDMDApIHtcbiAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gdmFsaWQgc3Vycm9nYXRlIHBhaXJcbiAgICAgIGNvZGVQb2ludCA9IChsZWFkU3Vycm9nYXRlIC0gMHhEODAwIDw8IDEwIHwgY29kZVBvaW50IC0gMHhEQzAwKSArIDB4MTAwMDBcbiAgICB9IGVsc2UgaWYgKGxlYWRTdXJyb2dhdGUpIHtcbiAgICAgIC8vIHZhbGlkIGJtcCBjaGFyLCBidXQgbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgIH1cblxuICAgIGxlYWRTdXJyb2dhdGUgPSBudWxsXG5cbiAgICAvLyBlbmNvZGUgdXRmOFxuICAgIGlmIChjb2RlUG9pbnQgPCAweDgwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDEpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goY29kZVBvaW50KVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHg4MDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiB8IDB4QzAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDMpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgfCAweEUwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSA0KSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHgxMiB8IDB4RjAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIsIHVuaXRzKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG5cbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuIiwidmFyIGxvb2t1cCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcblxuOyhmdW5jdGlvbiAoZXhwb3J0cykge1xuXHQndXNlIHN0cmljdCc7XG5cbiAgdmFyIEFyciA9ICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgPyBVaW50OEFycmF5XG4gICAgOiBBcnJheVxuXG5cdHZhciBQTFVTICAgPSAnKycuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0ggID0gJy8nLmNoYXJDb2RlQXQoMClcblx0dmFyIE5VTUJFUiA9ICcwJy5jaGFyQ29kZUF0KDApXG5cdHZhciBMT1dFUiAgPSAnYScuY2hhckNvZGVBdCgwKVxuXHR2YXIgVVBQRVIgID0gJ0EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFBMVVNfVVJMX1NBRkUgPSAnLScuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0hfVVJMX1NBRkUgPSAnXycuY2hhckNvZGVBdCgwKVxuXG5cdGZ1bmN0aW9uIGRlY29kZSAoZWx0KSB7XG5cdFx0dmFyIGNvZGUgPSBlbHQuY2hhckNvZGVBdCgwKVxuXHRcdGlmIChjb2RlID09PSBQTFVTIHx8XG5cdFx0ICAgIGNvZGUgPT09IFBMVVNfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjIgLy8gJysnXG5cdFx0aWYgKGNvZGUgPT09IFNMQVNIIHx8XG5cdFx0ICAgIGNvZGUgPT09IFNMQVNIX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYzIC8vICcvJ1xuXHRcdGlmIChjb2RlIDwgTlVNQkVSKVxuXHRcdFx0cmV0dXJuIC0xIC8vbm8gbWF0Y2hcblx0XHRpZiAoY29kZSA8IE5VTUJFUiArIDEwKVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBOVU1CRVIgKyAyNiArIDI2XG5cdFx0aWYgKGNvZGUgPCBVUFBFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBVUFBFUlxuXHRcdGlmIChjb2RlIDwgTE9XRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gTE9XRVIgKyAyNlxuXHR9XG5cblx0ZnVuY3Rpb24gYjY0VG9CeXRlQXJyYXkgKGI2NCkge1xuXHRcdHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG5cblx0XHRpZiAoYjY0Lmxlbmd0aCAlIDQgPiAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHR2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXHRcdHBsYWNlSG9sZGVycyA9ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAyKSA/IDIgOiAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMSkgPyAxIDogMFxuXG5cdFx0Ly8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5cdFx0YXJyID0gbmV3IEFycihiNjQubGVuZ3RoICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cblx0XHQvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG5cdFx0bCA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gNCA6IGI2NC5sZW5ndGhcblxuXHRcdHZhciBMID0gMFxuXG5cdFx0ZnVuY3Rpb24gcHVzaCAodikge1xuXHRcdFx0YXJyW0wrK10gPSB2XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxOCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCAxMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA8PCA2KSB8IGRlY29kZShiNjQuY2hhckF0KGkgKyAzKSlcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMDAwKSA+PiAxNilcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPj4gNClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxMCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCA0KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpID4+IDIpXG5cdFx0XHRwdXNoKCh0bXAgPj4gOCkgJiAweEZGKVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdHJldHVybiBhcnJcblx0fVxuXG5cdGZ1bmN0aW9uIHVpbnQ4VG9CYXNlNjQgKHVpbnQ4KSB7XG5cdFx0dmFyIGksXG5cdFx0XHRleHRyYUJ5dGVzID0gdWludDgubGVuZ3RoICUgMywgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcblx0XHRcdG91dHB1dCA9IFwiXCIsXG5cdFx0XHR0ZW1wLCBsZW5ndGhcblxuXHRcdGZ1bmN0aW9uIGVuY29kZSAobnVtKSB7XG5cdFx0XHRyZXR1cm4gbG9va3VwLmNoYXJBdChudW0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBlbmNvZGUobnVtID4+IDE4ICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDEyICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDYgJiAweDNGKSArIGVuY29kZShudW0gJiAweDNGKVxuXHRcdH1cblxuXHRcdC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcblx0XHRmb3IgKGkgPSAwLCBsZW5ndGggPSB1aW50OC5sZW5ndGggLSBleHRyYUJ5dGVzOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcblx0XHRcdHRlbXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApXG5cdFx0fVxuXG5cdFx0Ly8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuXHRcdHN3aXRjaCAoZXh0cmFCeXRlcykge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0ZW1wID0gdWludDhbdWludDgubGVuZ3RoIC0gMV1cblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDIpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz09J1xuXHRcdFx0XHRicmVha1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMTApXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPj4gNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDIpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9J1xuXHRcdFx0XHRicmVha1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXRcblx0fVxuXG5cdGV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheVxuXHRleHBvcnRzLmZyb21CeXRlQXJyYXkgPSB1aW50OFRvQmFzZTY0XG59KHR5cGVvZiBleHBvcnRzID09PSAndW5kZWZpbmVkJyA/ICh0aGlzLmJhc2U2NGpzID0ge30pIDogZXhwb3J0cykpXG4iLCJleHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cbiIsIlxuLyoqXG4gKiBpc0FycmF5XG4gKi9cblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG4vKipcbiAqIHRvU3RyaW5nXG4gKi9cblxudmFyIHN0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogV2hldGhlciBvciBub3QgdGhlIGdpdmVuIGB2YWxgXG4gKiBpcyBhbiBhcnJheS5cbiAqXG4gKiBleGFtcGxlOlxuICpcbiAqICAgICAgICBpc0FycmF5KFtdKTtcbiAqICAgICAgICAvLyA+IHRydWVcbiAqICAgICAgICBpc0FycmF5KGFyZ3VtZW50cyk7XG4gKiAgICAgICAgLy8gPiBmYWxzZVxuICogICAgICAgIGlzQXJyYXkoJycpO1xuICogICAgICAgIC8vID4gZmFsc2VcbiAqXG4gKiBAcGFyYW0ge21peGVkfSB2YWxcbiAqIEByZXR1cm4ge2Jvb2x9XG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5IHx8IGZ1bmN0aW9uICh2YWwpIHtcbiAgcmV0dXJuICEhIHZhbCAmJiAnW29iamVjdCBBcnJheV0nID09IHN0ci5jYWxsKHZhbCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4hZnVuY3Rpb24oZXhwb3J0cywgdW5kZWZpbmVkKSB7XG5cbiAgdmFyXG4gICAgLy8gSWYgdGhlIHR5cGVkIGFycmF5IGlzIHVuc3BlY2lmaWVkLCB1c2UgdGhpcy5cbiAgICBEZWZhdWx0QXJyYXlUeXBlID0gRmxvYXQzMkFycmF5LFxuICAgIC8vIFNpbXBsZSBtYXRoIGZ1bmN0aW9ucyB3ZSBuZWVkLlxuICAgIHNxcnQgPSBNYXRoLnNxcnQsXG4gICAgc3FyID0gZnVuY3Rpb24obnVtYmVyKSB7cmV0dXJuIE1hdGgucG93KG51bWJlciwgMil9LFxuICAgIC8vIEludGVybmFsIGNvbnZlbmllbmNlIGNvcGllcyBvZiB0aGUgZXhwb3J0ZWQgZnVuY3Rpb25zXG4gICAgaXNDb21wbGV4QXJyYXksXG4gICAgQ29tcGxleEFycmF5XG5cbiAgZXhwb3J0cy5pc0NvbXBsZXhBcnJheSA9IGlzQ29tcGxleEFycmF5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAhPT0gdW5kZWZpbmVkICYmXG4gICAgICBvYmouaGFzT3duUHJvcGVydHkgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgb2JqLmhhc093blByb3BlcnR5KCdyZWFsJykgJiZcbiAgICAgIG9iai5oYXNPd25Qcm9wZXJ0eSgnaW1hZycpXG4gIH1cblxuICBleHBvcnRzLkNvbXBsZXhBcnJheSA9IENvbXBsZXhBcnJheSA9IGZ1bmN0aW9uKG90aGVyLCBvcHRfYXJyYXlfdHlwZSl7XG4gICAgaWYgKGlzQ29tcGxleEFycmF5KG90aGVyKSkge1xuICAgICAgLy8gQ29weSBjb25zdHVjdG9yLlxuICAgICAgdGhpcy5BcnJheVR5cGUgPSBvdGhlci5BcnJheVR5cGVcbiAgICAgIHRoaXMucmVhbCA9IG5ldyB0aGlzLkFycmF5VHlwZShvdGhlci5yZWFsKVxuICAgICAgdGhpcy5pbWFnID0gbmV3IHRoaXMuQXJyYXlUeXBlKG90aGVyLmltYWcpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuQXJyYXlUeXBlID0gb3B0X2FycmF5X3R5cGUgfHwgRGVmYXVsdEFycmF5VHlwZVxuICAgICAgLy8gb3RoZXIgY2FuIGJlIGVpdGhlciBhbiBhcnJheSBvciBhIG51bWJlci5cbiAgICAgIHRoaXMucmVhbCA9IG5ldyB0aGlzLkFycmF5VHlwZShvdGhlcilcbiAgICAgIHRoaXMuaW1hZyA9IG5ldyB0aGlzLkFycmF5VHlwZSh0aGlzLnJlYWwubGVuZ3RoKVxuICAgIH1cblxuICAgIHRoaXMubGVuZ3RoID0gdGhpcy5yZWFsLmxlbmd0aFxuICB9XG5cbiAgQ29tcGxleEFycmF5LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb21wb25lbnRzID0gW11cblxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbihjX3ZhbHVlLCBpKSB7XG4gICAgICBjb21wb25lbnRzLnB1c2goXG4gICAgICAgICcoJyArXG4gICAgICAgIGNfdmFsdWUucmVhbC50b0ZpeGVkKDIpICsgJywnICtcbiAgICAgICAgY192YWx1ZS5pbWFnLnRvRml4ZWQoMikgK1xuICAgICAgICAnKSdcbiAgICAgIClcbiAgICB9KVxuXG4gICAgcmV0dXJuICdbJyArIGNvbXBvbmVudHMuam9pbignLCcpICsgJ10nXG4gIH1cblxuICAvLyBJbi1wbGFjZSBtYXBwZXIuXG4gIENvbXBsZXhBcnJheS5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24obWFwcGVyKSB7XG4gICAgdmFyXG4gICAgICBpLFxuICAgICAgbiA9IHRoaXMubGVuZ3RoLFxuICAgICAgLy8gRm9yIEdDIGVmZmljaWVuY3ksIHBhc3MgYSBzaW5nbGUgY192YWx1ZSBvYmplY3QgdG8gdGhlIG1hcHBlci5cbiAgICAgIGNfdmFsdWUgPSB7fVxuXG4gICAgZm9yIChpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgY192YWx1ZS5yZWFsID0gdGhpcy5yZWFsW2ldXG4gICAgICBjX3ZhbHVlLmltYWcgPSB0aGlzLmltYWdbaV1cbiAgICAgIG1hcHBlcihjX3ZhbHVlLCBpLCBuKVxuICAgICAgdGhpcy5yZWFsW2ldID0gY192YWx1ZS5yZWFsXG4gICAgICB0aGlzLmltYWdbaV0gPSBjX3ZhbHVlLmltYWdcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgQ29tcGxleEFycmF5LnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oaXRlcmF0b3IpIHtcbiAgICB2YXJcbiAgICAgIGksXG4gICAgICBuID0gdGhpcy5sZW5ndGgsXG4gICAgICAvLyBGb3IgY29uc2lzdGVuY3kgd2l0aCAubWFwLlxuICAgICAgY192YWx1ZSA9IHt9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICBjX3ZhbHVlLnJlYWwgPSB0aGlzLnJlYWxbaV1cbiAgICAgIGNfdmFsdWUuaW1hZyA9IHRoaXMuaW1hZ1tpXVxuICAgICAgaXRlcmF0b3IoY192YWx1ZSwgaSwgbilcbiAgICB9XG4gIH1cblxuICBDb21wbGV4QXJyYXkucHJvdG90eXBlLmNvbmp1Z2F0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAobmV3IENvbXBsZXhBcnJheSh0aGlzKSkubWFwKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YWx1ZS5pbWFnICo9IC0xXG4gICAgfSlcbiAgfVxuXG4gIC8vIEhlbHBlciBzbyB3ZSBjYW4gbWFrZSBBcnJheVR5cGUgb2JqZWN0cyByZXR1cm5lZCBoYXZlIHNpbWlsYXIgaW50ZXJmYWNlc1xuICAvLyAgIHRvIENvbXBsZXhBcnJheXMuXG4gIGZ1bmN0aW9uIGl0ZXJhYmxlKG9iaikge1xuICAgIGlmICghb2JqLmZvckVhY2gpXG4gICAgICBvYmouZm9yRWFjaCA9IGZ1bmN0aW9uKGl0ZXJhdG9yKSB7XG4gICAgICAgIHZhciBpLCBuID0gdGhpcy5sZW5ndGhcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKVxuICAgICAgICAgIGl0ZXJhdG9yKHRoaXNbaV0sIGksIG4pXG4gICAgICB9XG5cbiAgICByZXR1cm4gb2JqXG4gIH1cblxuICBDb21wbGV4QXJyYXkucHJvdG90eXBlLm1hZ25pdHVkZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBtYWdzID0gbmV3IHRoaXMuQXJyYXlUeXBlKHRoaXMubGVuZ3RoKVxuXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBpKSB7XG4gICAgICBtYWdzW2ldID0gc3FydChzcXIodmFsdWUucmVhbCkgKyBzcXIodmFsdWUuaW1hZykpXG4gICAgfSlcblxuICAgIC8vIEFycmF5VHlwZSB3aWxsIG5vdCBuZWNlc3NhcmlseSBiZSBpdGVyYWJsZTogbWFrZSBpdCBzby5cbiAgICByZXR1cm4gaXRlcmFibGUobWFncylcbiAgfVxufSh0eXBlb2YgZXhwb3J0cyA9PT0gJ3VuZGVmaW5lZCcgJiYgKHRoaXMuY29tcGxleF9hcnJheSA9IHt9KSB8fCBleHBvcnRzKVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4hZnVuY3Rpb24oZXhwb3J0cywgY29tcGxleF9hcnJheSkge1xuXG4gIHZhclxuICAgIENvbXBsZXhBcnJheSA9IGNvbXBsZXhfYXJyYXkuQ29tcGxleEFycmF5LFxuICAgIC8vIE1hdGggY29uc3RhbnRzIGFuZCBmdW5jdGlvbnMgd2UgbmVlZC5cbiAgICBQSSA9IE1hdGguUEksXG4gICAgU1FSVDFfMiA9IE1hdGguU1FSVDFfMixcbiAgICBzcXJ0ID0gTWF0aC5zcXJ0LFxuICAgIGNvcyA9IE1hdGguY29zLFxuICAgIHNpbiA9IE1hdGguc2luXG5cbiAgQ29tcGxleEFycmF5LnByb3RvdHlwZS5GRlQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gRkZUKHRoaXMsIGZhbHNlKVxuICB9XG5cbiAgZXhwb3J0cy5GRlQgPSBmdW5jdGlvbihpbnB1dCkge1xuICAgIHJldHVybiBlbnN1cmVDb21wbGV4QXJyYXkoaW5wdXQpLkZGVCgpXG4gIH1cblxuICBDb21wbGV4QXJyYXkucHJvdG90eXBlLkludkZGVCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBGRlQodGhpcywgdHJ1ZSlcbiAgfVxuXG4gIGV4cG9ydHMuSW52RkZUID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICByZXR1cm4gZW5zdXJlQ29tcGxleEFycmF5KGlucHV0KS5JbnZGRlQoKVxuICB9XG5cbiAgLy8gQXBwbGllcyBhIGZyZXF1ZW5jeS1zcGFjZSBmaWx0ZXIgdG8gaW5wdXQsIGFuZCByZXR1cm5zIHRoZSByZWFsLXNwYWNlXG4gIC8vIGZpbHRlcmVkIGlucHV0LlxuICAvLyBmaWx0ZXJlciBhY2NlcHRzIGZyZXEsIGksIG4gYW5kIG1vZGlmaWVzIGZyZXEucmVhbCBhbmQgZnJlcS5pbWFnLlxuICBDb21wbGV4QXJyYXkucHJvdG90eXBlLmZyZXF1ZW5jeU1hcCA9IGZ1bmN0aW9uKGZpbHRlcmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuRkZUKCkubWFwKGZpbHRlcmVyKS5JbnZGRlQoKVxuICB9XG5cbiAgZXhwb3J0cy5mcmVxdWVuY3lNYXAgPSBmdW5jdGlvbihpbnB1dCwgZmlsdGVyZXIpIHtcbiAgICByZXR1cm4gZW5zdXJlQ29tcGxleEFycmF5KGlucHV0KS5mcmVxdWVuY3lNYXAoZmlsdGVyZXIpXG4gIH1cblxuICBmdW5jdGlvbiBlbnN1cmVDb21wbGV4QXJyYXkoaW5wdXQpIHtcbiAgICByZXR1cm4gY29tcGxleF9hcnJheS5pc0NvbXBsZXhBcnJheShpbnB1dCkgJiYgaW5wdXQgfHxcbiAgICAgICAgbmV3IENvbXBsZXhBcnJheShpbnB1dClcbiAgfVxuXG4gIGZ1bmN0aW9uIEZGVChpbnB1dCwgaW52ZXJzZSkge1xuICAgIHZhciBuID0gaW5wdXQubGVuZ3RoXG5cbiAgICBpZiAobiAmIChuIC0gMSkpIHtcbiAgICAgIHJldHVybiBGRlRfUmVjdXJzaXZlKGlucHV0LCBpbnZlcnNlKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gRkZUXzJfSXRlcmF0aXZlKGlucHV0LCBpbnZlcnNlKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIEZGVF9SZWN1cnNpdmUoaW5wdXQsIGludmVyc2UpIHtcbiAgICB2YXJcbiAgICAgIG4gPSBpbnB1dC5sZW5ndGgsXG4gICAgICAvLyBDb3VudGVycy5cbiAgICAgIGksIGosXG4gICAgICBvdXRwdXQsXG4gICAgICAvLyBDb21wbGV4IG11bHRpcGxpZXIgYW5kIGl0cyBkZWx0YS5cbiAgICAgIGZfciwgZl9pLCBkZWxfZl9yLCBkZWxfZl9pLFxuICAgICAgLy8gTG93ZXN0IGRpdmlzb3IgYW5kIHJlbWFpbmRlci5cbiAgICAgIHAsIG0sXG4gICAgICBub3JtYWxpc2F0aW9uLFxuICAgICAgcmVjdXJzaXZlX3Jlc3VsdCxcbiAgICAgIF9zd2FwLCBfcmVhbCwgX2ltYWdcblxuICAgIGlmIChuID09PSAxKSB7XG4gICAgICByZXR1cm4gaW5wdXRcbiAgICB9XG5cbiAgICBvdXRwdXQgPSBuZXcgQ29tcGxleEFycmF5KG4sIGlucHV0LkFycmF5VHlwZSlcblxuICAgIC8vIFVzZSB0aGUgbG93ZXN0IG9kZCBmYWN0b3IsIHNvIHdlIGFyZSBhYmxlIHRvIHVzZSBGRlRfMl9JdGVyYXRpdmUgaW4gdGhlXG4gICAgLy8gcmVjdXJzaXZlIHRyYW5zZm9ybXMgb3B0aW1hbGx5LlxuICAgIHAgPSBMb3dlc3RPZGRGYWN0b3IobilcbiAgICBtID0gbiAvIHBcbiAgICBub3JtYWxpc2F0aW9uID0gMSAvIHNxcnQocClcbiAgICByZWN1cnNpdmVfcmVzdWx0ID0gbmV3IENvbXBsZXhBcnJheShtLCBpbnB1dC5BcnJheVR5cGUpXG5cbiAgICAvLyBMb29wcyBnbyBsaWtlIE8obiDOoyBwX2kpLCB3aGVyZSBwX2kgYXJlIHRoZSBwcmltZSBmYWN0b3JzIG9mIG4uXG4gICAgLy8gZm9yIGEgcG93ZXIgb2YgYSBwcmltZSwgcCwgdGhpcyByZWR1Y2VzIHRvIE8obiBwIGxvZ19wIG4pXG4gICAgZm9yKGogPSAwOyBqIDwgcDsgaisrKSB7XG4gICAgICBmb3IoaSA9IDA7IGkgPCBtOyBpKyspIHtcbiAgICAgICAgcmVjdXJzaXZlX3Jlc3VsdC5yZWFsW2ldID0gaW5wdXQucmVhbFtpICogcCArIGpdXG4gICAgICAgIHJlY3Vyc2l2ZV9yZXN1bHQuaW1hZ1tpXSA9IGlucHV0LmltYWdbaSAqIHAgKyBqXVxuICAgICAgfVxuICAgICAgLy8gRG9uJ3QgZ28gZGVlcGVyIHVubGVzcyBuZWNlc3NhcnkgdG8gc2F2ZSBhbGxvY3MuXG4gICAgICBpZiAobSA+IDEpIHtcbiAgICAgICAgcmVjdXJzaXZlX3Jlc3VsdCA9IEZGVChyZWN1cnNpdmVfcmVzdWx0LCBpbnZlcnNlKVxuICAgICAgfVxuXG4gICAgICBkZWxfZl9yID0gY29zKDIqUEkqai9uKVxuICAgICAgZGVsX2ZfaSA9IChpbnZlcnNlID8gLTEgOiAxKSAqIHNpbigyKlBJKmovbilcbiAgICAgIGZfciA9IDFcbiAgICAgIGZfaSA9IDBcblxuICAgICAgZm9yKGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIF9yZWFsID0gcmVjdXJzaXZlX3Jlc3VsdC5yZWFsW2kgJSBtXVxuICAgICAgICBfaW1hZyA9IHJlY3Vyc2l2ZV9yZXN1bHQuaW1hZ1tpICUgbV1cblxuICAgICAgICBvdXRwdXQucmVhbFtpXSArPSBmX3IgKiBfcmVhbCAtIGZfaSAqIF9pbWFnXG4gICAgICAgIG91dHB1dC5pbWFnW2ldICs9IGZfciAqIF9pbWFnICsgZl9pICogX3JlYWxcblxuICAgICAgICBfc3dhcCA9IGZfciAqIGRlbF9mX3IgLSBmX2kgKiBkZWxfZl9pXG4gICAgICAgIGZfaSA9IGZfciAqIGRlbF9mX2kgKyBmX2kgKiBkZWxfZl9yXG4gICAgICAgIGZfciA9IF9zd2FwXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ29weSBiYWNrIHRvIGlucHV0IHRvIG1hdGNoIEZGVF8yX0l0ZXJhdGl2ZSBpbi1wbGFjZW5lc3NcbiAgICAvLyBUT0RPOiBmYXN0ZXIgd2F5IG9mIG1ha2luZyB0aGlzIGluLXBsYWNlP1xuICAgIGZvcihpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgaW5wdXQucmVhbFtpXSA9IG5vcm1hbGlzYXRpb24gKiBvdXRwdXQucmVhbFtpXVxuICAgICAgaW5wdXQuaW1hZ1tpXSA9IG5vcm1hbGlzYXRpb24gKiBvdXRwdXQuaW1hZ1tpXVxuICAgIH1cblxuICAgIHJldHVybiBpbnB1dFxuICB9XG5cbiAgZnVuY3Rpb24gRkZUXzJfSXRlcmF0aXZlKGlucHV0LCBpbnZlcnNlKSB7XG4gICAgdmFyXG4gICAgICBuID0gaW5wdXQubGVuZ3RoLFxuICAgICAgLy8gQ291bnRlcnMuXG4gICAgICBpLCBqLFxuICAgICAgb3V0cHV0LCBvdXRwdXRfciwgb3V0cHV0X2ksXG4gICAgICAvLyBDb21wbGV4IG11bHRpcGxpZXIgYW5kIGl0cyBkZWx0YS5cbiAgICAgIGZfciwgZl9pLCBkZWxfZl9yLCBkZWxfZl9pLCB0ZW1wLFxuICAgICAgLy8gVGVtcG9yYXJ5IGxvb3AgdmFyaWFibGVzLlxuICAgICAgbF9pbmRleCwgcl9pbmRleCxcbiAgICAgIGxlZnRfciwgbGVmdF9pLCByaWdodF9yLCByaWdodF9pLFxuICAgICAgLy8gd2lkdGggb2YgZWFjaCBzdWItYXJyYXkgZm9yIHdoaWNoIHdlJ3JlIGl0ZXJhdGl2ZWx5IGNhbGN1bGF0aW5nIEZGVC5cbiAgICAgIHdpZHRoXG5cbiAgICBvdXRwdXQgPSBCaXRSZXZlcnNlQ29tcGxleEFycmF5KGlucHV0KVxuICAgIG91dHB1dF9yID0gb3V0cHV0LnJlYWxcbiAgICBvdXRwdXRfaSA9IG91dHB1dC5pbWFnXG4gICAgLy8gTG9vcHMgZ28gbGlrZSBPKG4gbG9nIG4pOlxuICAgIC8vICAgd2lkdGggfiBsb2cgbjsgaSxqIH4gblxuICAgIHdpZHRoID0gMVxuICAgIHdoaWxlICh3aWR0aCA8IG4pIHtcbiAgICAgIGRlbF9mX3IgPSBjb3MoUEkvd2lkdGgpXG4gICAgICBkZWxfZl9pID0gKGludmVyc2UgPyAtMSA6IDEpICogc2luKFBJL3dpZHRoKVxuICAgICAgZm9yIChpID0gMDsgaSA8IG4vKDIqd2lkdGgpOyBpKyspIHtcbiAgICAgICAgZl9yID0gMVxuICAgICAgICBmX2kgPSAwXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCB3aWR0aDsgaisrKSB7XG4gICAgICAgICAgbF9pbmRleCA9IDIqaSp3aWR0aCArIGpcbiAgICAgICAgICByX2luZGV4ID0gbF9pbmRleCArIHdpZHRoXG5cbiAgICAgICAgICBsZWZ0X3IgPSBvdXRwdXRfcltsX2luZGV4XVxuICAgICAgICAgIGxlZnRfaSA9IG91dHB1dF9pW2xfaW5kZXhdXG4gICAgICAgICAgcmlnaHRfciA9IGZfciAqIG91dHB1dF9yW3JfaW5kZXhdIC0gZl9pICogb3V0cHV0X2lbcl9pbmRleF1cbiAgICAgICAgICByaWdodF9pID0gZl9pICogb3V0cHV0X3Jbcl9pbmRleF0gKyBmX3IgKiBvdXRwdXRfaVtyX2luZGV4XVxuXG4gICAgICAgICAgb3V0cHV0X3JbbF9pbmRleF0gPSBTUVJUMV8yICogKGxlZnRfciArIHJpZ2h0X3IpXG4gICAgICAgICAgb3V0cHV0X2lbbF9pbmRleF0gPSBTUVJUMV8yICogKGxlZnRfaSArIHJpZ2h0X2kpXG4gICAgICAgICAgb3V0cHV0X3Jbcl9pbmRleF0gPSBTUVJUMV8yICogKGxlZnRfciAtIHJpZ2h0X3IpXG4gICAgICAgICAgb3V0cHV0X2lbcl9pbmRleF0gPSBTUVJUMV8yICogKGxlZnRfaSAtIHJpZ2h0X2kpXG4gICAgICAgICAgdGVtcCA9IGZfciAqIGRlbF9mX3IgLSBmX2kgKiBkZWxfZl9pXG4gICAgICAgICAgZl9pID0gZl9yICogZGVsX2ZfaSArIGZfaSAqIGRlbF9mX3JcbiAgICAgICAgICBmX3IgPSB0ZW1wXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHdpZHRoIDw8PSAxXG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dFxuICB9XG5cbiAgZnVuY3Rpb24gQml0UmV2ZXJzZUluZGV4KGluZGV4LCBuKSB7XG4gICAgdmFyIGJpdHJldmVyc2VkX2luZGV4ID0gMFxuXG4gICAgd2hpbGUgKG4gPiAxKSB7XG4gICAgICBiaXRyZXZlcnNlZF9pbmRleCA8PD0gMVxuICAgICAgYml0cmV2ZXJzZWRfaW5kZXggKz0gaW5kZXggJiAxXG4gICAgICBpbmRleCA+Pj0gMVxuICAgICAgbiA+Pj0gMVxuICAgIH1cbiAgICByZXR1cm4gYml0cmV2ZXJzZWRfaW5kZXhcbiAgfVxuXG4gIGZ1bmN0aW9uIEJpdFJldmVyc2VDb21wbGV4QXJyYXkoYXJyYXkpIHtcbiAgICB2YXIgbiA9IGFycmF5Lmxlbmd0aCxcbiAgICAgICAgZmxpcHMgPSB7fSxcbiAgICAgICAgc3dhcCxcbiAgICAgICAgaVxuXG4gICAgZm9yKGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICB2YXIgcl9pID0gQml0UmV2ZXJzZUluZGV4KGksIG4pXG5cbiAgICAgIGlmIChmbGlwcy5oYXNPd25Qcm9wZXJ0eShpKSB8fCBmbGlwcy5oYXNPd25Qcm9wZXJ0eShyX2kpKSBjb250aW51ZVxuXG4gICAgICBzd2FwID0gYXJyYXkucmVhbFtyX2ldXG4gICAgICBhcnJheS5yZWFsW3JfaV0gPSBhcnJheS5yZWFsW2ldXG4gICAgICBhcnJheS5yZWFsW2ldID0gc3dhcFxuXG4gICAgICBzd2FwID0gYXJyYXkuaW1hZ1tyX2ldXG4gICAgICBhcnJheS5pbWFnW3JfaV0gPSBhcnJheS5pbWFnW2ldXG4gICAgICBhcnJheS5pbWFnW2ldID0gc3dhcFxuXG4gICAgICBmbGlwc1tpXSA9IGZsaXBzW3JfaV0gPSB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5XG4gIH1cblxuICBmdW5jdGlvbiBMb3dlc3RPZGRGYWN0b3Iobikge1xuICAgIHZhciBmYWN0b3IgPSAzLFxuICAgICAgICBzcXJ0X24gPSBzcXJ0KG4pXG5cbiAgICB3aGlsZShmYWN0b3IgPD0gc3FydF9uKSB7XG4gICAgICBpZiAobiAlIGZhY3RvciA9PT0gMCkgcmV0dXJuIGZhY3RvclxuICAgICAgZmFjdG9yID0gZmFjdG9yICsgMlxuICAgIH1cbiAgICByZXR1cm4gblxuICB9XG5cbn0oXG4gIHR5cGVvZiBleHBvcnRzID09PSAndW5kZWZpbmVkJyAmJiAodGhpcy5mZnQgPSB7fSkgfHwgZXhwb3J0cyxcbiAgdHlwZW9mIHJlcXVpcmUgPT09ICd1bmRlZmluZWQnICYmICh0aGlzLmNvbXBsZXhfYXJyYXkpIHx8XG4gICAgcmVxdWlyZSgnLi9jb21wbGV4X2FycmF5JylcbilcbiIsIlxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBnbG9iYWwgPSAoZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSgpO1xuXG4vKipcbiAqIFdlYlNvY2tldCBjb25zdHJ1Y3Rvci5cbiAqL1xuXG52YXIgV2ViU29ja2V0ID0gZ2xvYmFsLldlYlNvY2tldCB8fCBnbG9iYWwuTW96V2ViU29ja2V0O1xuXG4vKipcbiAqIE1vZHVsZSBleHBvcnRzLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gV2ViU29ja2V0ID8gd3MgOiBudWxsO1xuXG4vKipcbiAqIFdlYlNvY2tldCBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBUaGUgdGhpcmQgYG9wdHNgIG9wdGlvbnMgb2JqZWN0IGdldHMgaWdub3JlZCBpbiB3ZWIgYnJvd3NlcnMsIHNpbmNlIGl0J3NcbiAqIG5vbi1zdGFuZGFyZCwgYW5kIHRocm93cyBhIFR5cGVFcnJvciBpZiBwYXNzZWQgdG8gdGhlIGNvbnN0cnVjdG9yLlxuICogU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZWluYXJvcy93cy9pc3N1ZXMvMjI3XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVyaVxuICogQHBhcmFtIHtBcnJheX0gcHJvdG9jb2xzIChvcHRpb25hbClcbiAqIEBwYXJhbSB7T2JqZWN0KSBvcHRzIChvcHRpb25hbClcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gd3ModXJpLCBwcm90b2NvbHMsIG9wdHMpIHtcbiAgdmFyIGluc3RhbmNlO1xuICBpZiAocHJvdG9jb2xzKSB7XG4gICAgaW5zdGFuY2UgPSBuZXcgV2ViU29ja2V0KHVyaSwgcHJvdG9jb2xzKTtcbiAgfSBlbHNlIHtcbiAgICBpbnN0YW5jZSA9IG5ldyBXZWJTb2NrZXQodXJpKTtcbiAgfVxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbmlmIChXZWJTb2NrZXQpIHdzLnByb3RvdHlwZSA9IFdlYlNvY2tldC5wcm90b3R5cGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29yZToge1xuICAgIEJhc2VMZm8gICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L2NvcmUvYmFzZS1sZm8nKSxcbiAgfSxcbiAgc291cmNlczoge1xuICAgIEF1ZGlvSW5CdWZmZXIgICAgIDogcmVxdWlyZSgnLi9kaXN0L3NvdXJjZXMvYXVkaW8taW4tYnVmZmVyJyksXG4gICAgQXVkaW9Jbk5vZGUgICAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvc291cmNlcy9hdWRpby1pbi1ub2RlJyksXG4gICAgRXZlbnRJbiAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvc291cmNlcy9ldmVudC1pbicpLFxuICAgIC8vIHJldGVzdFxuICAgIFNvY2tldENsaWVudCAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3NvdXJjZXMvc29ja2V0LWNsaWVudCcpLFxuICAgIFNvY2tldFNlcnZlciAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3NvdXJjZXMvc29ja2V0LXNlcnZlcicpLFxuICB9LFxuICBzaW5rczoge1xuICAgIEF1ZGlvUmVjb3JkZXIgICAgIDogcmVxdWlyZSgnLi9kaXN0L3NpbmtzL2F1ZGlvLXJlY29yZGVyJyksXG4gICAgQnBmICAgICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvc2lua3MvYnBmJyksXG4gICAgQnJpZGdlICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvc2lua3MvYnJpZGdlJyksXG4gICAgRGF0YVJlY29yZGVyICAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvc2lua3MvZGF0YS1yZWNvcmRlcicpLFxuICAgIFRyYWNlICAgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3NpbmtzL3RyYWNlJyksXG4gICAgU3BlY3Ryb2dyYW0gICAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvc2lua3Mvc3BlY3Ryb2dyYW0nKSxcbiAgICBTb2NrZXRDbGllbnQgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9zaW5rcy9zb2NrZXQtY2xpZW50JyksXG4gICAgU29ja2V0U2VydmVyICAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvc2lua3Mvc29ja2V0LXNlcnZlcicpLFxuICAgIFNvbm9ncmFtICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3NpbmtzL3Nvbm9ncmFtJyksXG4gICAgU3luY2hyb25pemVkRHJhdyAgOiByZXF1aXJlKCcuL2Rpc3Qvc2lua3Mvc3luY2hyb25pemVkLWRyYXcnKSxcbiAgICBXYXZlZm9ybSAgICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9zaW5rcy93YXZlZm9ybScpLFxuICB9LFxuICBvcGVyYXRvcnM6IHtcbiAgICBCaXF1YWQgICAgICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9vcGVyYXRvcnMvYmlxdWFkJyksXG4gICAgRmZ0ICAgICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvb3BlcmF0b3JzL2ZmdCcpLFxuICAgIC8vIElmZnQgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L29wZXJhdG9ycy9pZmZ0JyksXG4gICAgRnJhbWVyICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvb3BlcmF0b3JzL2ZyYW1lcicpLFxuICAgIE1hZ25pdHVkZSAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L29wZXJhdG9ycy9tYWduaXR1ZGUnKSxcbiAgICBNaW5NYXggICAgICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9vcGVyYXRvcnMvbWluLW1heCcpLFxuICAgIE1vdmluZ0F2ZXJhZ2UgICAgIDogcmVxdWlyZSgnLi9kaXN0L29wZXJhdG9ycy9tb3ZpbmctYXZlcmFnZScpLFxuICAgIE1vdmluZ01lZGlhbiAgICAgIDogcmVxdWlyZSgnLi9kaXN0L29wZXJhdG9ycy9tb3ZpbmctbWVkaWFuJyksXG4gICAgTm9vcCAgICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvb3BlcmF0b3JzL25vb3AnKSxcbiAgICBPcGVyYXRvciAgICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9vcGVyYXRvcnMvb3BlcmF0b3InKSxcbiAgfSxcbn07XG4iXX0=
