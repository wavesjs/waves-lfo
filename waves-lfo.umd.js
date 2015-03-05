(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wavesLFO = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

module.exports = {
  // core
  graph: require('./dist/core/graph'),
  lfoBase: require('./dist/core/lfo-base'),
  // sources
  sourceAudioNode: require('./dist/sources/audio-in-node'),
  sourceAudioBuffer: require('./dist/sources/audio-in-buffer'),
  // sink
  sinkDraw: require('./dist/sink/draw'),
  // operators
  magnitude: require('./dist/operators/magnitude'),
  biquad: require('./dist/operators/biquad')
};

},{"./dist/core/graph":2,"./dist/core/lfo-base":3,"./dist/operators/biquad":4,"./dist/operators/magnitude":5,"./dist/sink/draw":6,"./dist/sources/audio-in-buffer":7,"./dist/sources/audio-in-node":8}],2:[function(require,module,exports){
"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var Node = (function () {
  function Node(graph, lfo) {
    _babelHelpers.classCallCheck(this, Node);

    this.graph = graph;
    this.lfo = lfo;
    this.nodes = [];
  }

  _babelHelpers.prototypeProperties(Node, null, {
    pipe: {
      value: function pipe(ctor) {
        var options = arguments[1] === undefined ? {} : arguments[1];
        var id = arguments[2] === undefined ? null : arguments[2];

        var lfo = ctor(options);
        var nextNode = new Node(this.graph, lfo);

        this.lfo.add(lfo); // add to operators
        this.graph.add(this, nextNode, id); // add to graph: parent, child, id

        return nextNode;
      },
      writable: true,
      configurable: true
    },
    remove: {
      value: function remove() {
        this.graph.remove(this);
        this.lfo.remove(this);
      },
      writable: true,
      configurable: true
    }
  });

  return Node;
})();

var LfpGraph = (function () {
  function LfpGraph(ctor) {
    var options = arguments[1] === undefined ? {} : arguments[1];
    var id = arguments[2] === undefined ? null : arguments[2];

    _babelHelpers.classCallCheck(this, LfpGraph);

    if (!(this instanceof LfpGraph)) {
      return new LfpGraph(ctor, options, id);
    }this.nodes = {};
    this.typeCount = {};
    this.rootNode = null;

    var node = new Node(this, ctor(options));

    this.add(null, node, id);
  }

  _babelHelpers.prototypeProperties(LfpGraph, null, {
    add: {

      // adds a node to the structure

      value: function add(parent, node) {
        var id = arguments[2] === undefined ? null : arguments[2];

        id = id || node.lfo.type;
        this.typeCount[id] = this.typeCount[id] + 1 || 0;
        id = this.typeCount[id] === 0 ? id : "" + id + "-" + this.typeCount[id];
        node.id = id; // to remove the node later

        if (parent) {
          // && this.nodes[parent.id]) {
          // debugging
          if (!this.nodes[parent.id]) console.error("Parent didnt register correctly");

          // fetch parent node
          var p = this.get(parent.id);

          // add node as nodes in the graph
          p.nodes.push(node.id);

          // removing logic, clean up when code is ready
          // node.parent = p.lfo; // bind the parnt for removing later
          // node.index = idx; // necessary?
        } else {
          this.rootNode = id;
        }

        this.nodes[node.id] = node;

        // console.log(this.nodes);
        return id;
      },
      writable: true,
      configurable: true
    },
    remove: {

      // removes a node from the structure

      value: function remove(item) {
        var _this = this;

        // clear nodes nodes from the node
        // remove nodes from the graph

        // only if it has nodes
        if (item.nodes.length > 0) {

          // subnodes
          item.nodes.forEach(function (id) {
            var node = _this.get(id);
            _this.remove(node); // remove subnodes
            delete _this.nodes[id];
          });

          item.nodes = []; // reset nodes container
        }
      },
      writable: true,
      configurable: true
    },
    pipe: {

      // graph pipe, only adds nodes into the rootNode

      value: function pipe(ctor) {
        var options = arguments[1] === undefined ? {} : arguments[1];
        var id = arguments[2] === undefined ? null : arguments[2];

        var lfo = ctor(options);
        var node = new Node(this, lfo);

        var parent = this.get(this.rootNode);
        parent.lfo.add(lfo);
        this.add(parent, node, id);

        return node;
      },
      writable: true,
      configurable: true
    },
    start: {
      value: function start() {
        for (var key in this.nodes) {
          var node = this.nodes[key].lfo;
          if ("start" in node) node.start();
        }
      },
      writable: true,
      configurable: true
    },
    get: {
      value: function get(id) {
        return this.nodes[id];
      },
      writable: true,
      configurable: true
    },
    toString: {
      value: function toString() {
        return this.nodes;
      },
      writable: true,
      configurable: true
    }
  });

  return LfpGraph;
})();

module.exports = LfpGraph;

},{"babel-runtime/helpers":12}],3:[function(require,module,exports){
"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var EventEmitter = require("events").EventEmitter;
// var extend = require('object-assign');

var Lfo = (function (EventEmitter) {
  function Lfo() {
    var previous = arguments[0] === undefined ? null : arguments[0];
    var options = arguments[1] === undefined ? {} : arguments[1];
    var defaults = arguments[2] === undefined ? {} : arguments[2];

    _babelHelpers.classCallCheck(this, Lfo);

    if (!(this instanceof Lfo)) {
      return new Lfo(previous, options);
    }this.idx = 0;
    this.params = {};
    this.streamParams = {
      frameSize: 1,
      frameRate: 0
    };

    this.params = _core.Object.assign(defaults, options);

    if (previous) {
      // add ourselves to the previous operator if its passed
      previous.add(this);
      // pass on stream params
      this.streamParams = _core.Object.assign({}, previous.streamParams);
    }
  }

  _babelHelpers.inherits(Lfo, EventEmitter);

  _babelHelpers.prototypeProperties(Lfo, null, {
    setupStream: {

      // common stream config based on the instantiated params

      value: function setupStream() {
        var opts = arguments[0] === undefined ? {} : arguments[0];

        if (opts.frameRate) this.streamParams.frameRate = opts.frameRate;
        if (opts.frameSize) this.streamParams.frameSize = opts.frameSize;
        this.outFrame = new Float32Array(this.streamParams.frameSize);
      },
      writable: true,
      configurable: true
    },
    add: {

      // bind child node

      value: function add() {
        var lfo = arguments[0] === undefined ? null : arguments[0];

        this.on("frame", function (t, d) {
          return lfo.process(t, d);
        });
      },
      writable: true,
      configurable: true
    },
    output: {

      // we take care of the emit ourselves

      value: function output() {
        var outTime = arguments[0] === undefined ? null : arguments[0];

        if (!outTime) outTime = this.time;
        this.emit("frame", outTime, this.outFrame);
      },
      writable: true,
      configurable: true
    },
    remove: {

      // removes all children from listening

      value: function remove() {
        this.removeAllListeners("frame");
      },
      writable: true,
      configurable: true
    },
    process: {
      value: function process(time, data) {
        console.error("process not implemented");
      },
      writable: true,
      configurable: true
    },
    destroy: {

      // will delete itself from the parent node

      value: function destroy() {
        if (this.previous) this.previous.removeListener("frame", this);
      },
      writable: true,
      configurable: true
    }
  });

  return Lfo;
})(EventEmitter);

module.exports = Lfo;

},{"babel-runtime/core-js":11,"babel-runtime/helpers":12,"events":14}],4:[function(require,module,exports){
"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

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

var Lfo = require("../core/lfo-base");

var sin = Math.sin;
var cos = Math.cos;
var M_PI = Math.PI;
var sqrt = Math.sqrt;

// coefs calculations
// ------------------

/* LPF: H(s) = 1 / (s^2 + s/Q + 1) */
function lowpass_coefs(f0, q, coefs) {

  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2 * q);
  var c = cos(w0);

  var a0_inv = 1 / (1 + alpha);

  coefs.a1 = -2 * c * a0_inv;
  coefs.a2 = (1 - alpha) * a0_inv;

  coefs.b0 = (1 - c) * 0.5 * a0_inv;
  coefs.b1 = (1 - c) * a0_inv;
  coefs.b2 = coefs.b0;
}

/* HPF: H(s) = s^2 / (s^2 + s/Q + 1) */
function highpass_coefs(f0, q, coefs) {

  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2 * q);
  var c = cos(w0);

  var a0_inv = 1 / (1 + alpha);

  coefs.a1 = -2 * c * a0_inv;
  coefs.a2 = (1 - alpha) * a0_inv;

  coefs.b0 = (1 + c) * 0.5 * a0_inv;
  coefs.b1 = (-1 - c) * a0_inv;
  coefs.b2 = coefs.b0;
}

/* BPF: H(s) = s / (s^2 + s/Q + 1)  (constant skirt gain, peak gain = Q) */
function bandpass_constant_skirt_coefs(f0, q, coefs) {

  var w0 = M_PI * f0;
  var s = sin(w0);
  var alpha = s / (2 * q);
  var c = cos(w0);

  var a0_inv = 1 / (1 + alpha);

  coefs.a1 = -2 * c * a0_inv;
  coefs.a2 = (1 - alpha) * a0_inv;

  coefs.b0 = s * 0.5 * a0_inv;
  coefs.b1 = 0;
  coefs.b2 = -coefs.b0;
}

/* BPF: H(s) = (s/Q) / (s^2 + s/Q + 1)      (constant 0 dB peak gain) */
function bandpass_constant_peak_coefs(f0, q, coefs) {

  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2 * q);
  var c = cos(w0);

  var a0_inv = 1 / (1 + alpha);

  coefs.a1 = -2 * c * a0_inv;
  coefs.a2 = (1 - alpha) * a0_inv;

  coefs.b0 = alpha * a0_inv;
  coefs.b1 = 0;
  coefs.b2 = -coefs.b0;
}

/* notch: H(s) = (s^2 + 1) / (s^2 + s/Q + 1) */
function notch_coefs(f0, q, coefs) {

  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2 * q);
  var c = cos(w0);

  var a0_inv = 1 / (1 + alpha);

  coefs.a1 = -2 * c * a0_inv;
  coefs.a2 = (1 - alpha) * a0_inv;

  coefs.b0 = a0_inv;
  coefs.b1 = coefs.a1;
  coefs.b2 = coefs.b0;
}

/* APF: H(s) = (s^2 - s/Q + 1) / (s^2 + s/Q + 1) */
function allpass_coefs(f0, q, coefs) {

  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2 * q);
  var c = cos(w0);

  var a0_inv = 1 / (1 + alpha);

  coefs.a1 = -2 * c * a0_inv;
  coefs.a2 = (1 - alpha) * a0_inv;

  coefs.b0 = coefs.a2;
  coefs.b1 = coefs.a1;
  coefs.b2 = 1;
}

/* peakingEQ: H(s) = (s^2 + s*(A/Q) + 1) / (s^2 + s/(A*Q) + 1) */
/* A = sqrt( 10^(dBgain/20) ) = 10^(dBgain/40) */
/* gain is linear here */
function peaking_coefs(f0, q, gain, coefs) {

  var g = sqrt(gain);
  var g_inv = 1 / g;

  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2 * q);
  var c = cos(w0);

  var a0_inv = 1 / (1 + alpha * g_inv);

  coefs.a1 = -2 * c * a0_inv;
  coefs.a2 = (1 - alpha * g_inv) * a0_inv;

  coefs.b0 = (1 + alpha * g) * a0_inv;
  coefs.b1 = coefs.a1;
  coefs.b2 = (1 - alpha * g) * a0_inv;
}

/* lowShelf: H(s) = A * (s^2 + (sqrt(A)/Q)*s + A)/(A*s^2 + (sqrt(A)/Q)*s + 1) */
/* A = sqrt( 10^(dBgain/20) ) = 10^(dBgain/40) */
/* gain is linear here */
function lowshelf_coefs(f0, q, gain, coefs) {

  var g = sqrt(gain);

  var w0 = M_PI * f0;
  var alpha_2_sqrtg = sin(w0) * sqrt(g) / q;
  var c = cos(w0);

  var a0_inv = 1 / (g + 1 + (g - 1) * c + alpha_2_sqrtg);

  coefs.a1 = -2 * (g - 1 + (g + 1) * c) * a0_inv;
  coefs.a2 = (g + 1 + (g - 1) * c - alpha_2_sqrtg) * a0_inv;

  coefs.b0 = g * (g + 1 - (g - 1) * c + alpha_2_sqrtg) * a0_inv;
  coefs.b1 = 2 * g * (g - 1 - (g + 1) * c) * a0_inv;
  coefs.b2 = g * (g + 1 - (g - 1) * c - alpha_2_sqrtg) * a0_inv;
}

/* highShelf: H(s) = A * (A*s^2 + (sqrt(A)/Q)*s + 1)/(s^2 + (sqrt(A)/Q)*s + A) */
/* A = sqrt( 10^(dBgain/20) ) = 10^(dBgain/40) */
/* gain is linear here */
function highshelf_coefs(f0, q, gain, coefs) {

  var g = sqrt(gain);

  var w0 = M_PI * f0;
  var alpha_2_sqrtg = sin(w0) * sqrt(g) / q;
  var c = cos(w0);

  var a0_inv = 1 / (g + 1 - (g - 1) * c + alpha_2_sqrtg);

  coefs.a1 = 2 * (g - 1 - (g + 1) * c) * a0_inv;
  coefs.a2 = (g + 1 - (g - 1) * c - alpha_2_sqrtg) * a0_inv;

  coefs.b0 = g * (g + 1 + (g - 1) * c + alpha_2_sqrtg) * a0_inv;
  coefs.b1 = -2 * g * (g - 1 + (g + 1) * c) * a0_inv;
  coefs.b2 = g * (g + 1 + (g - 1) * c - alpha_2_sqrtg) * a0_inv;
}

/* helper */
function calculateCoefs(type, f0, q, gain, coefs) {

  switch (type) {
    case "lowpass":
      lowpass_coefs(f0, q, coefs);
      break;

    case "highpass":
      highpass_coefs(f0, q, coefs);
      break;

    case "bandpass_constant_skirt":
      bandpass_constant_skirt_coefs(f0, q, coefs);
      break;

    case "bandpass_constant_peak":
      bandpass_constant_peak_coefs(f0, q, coefs);
      break;

    case "notch":
      notch_coefs(f0, q, coefs);
      break;

    case "allpass":
      allpass_coefs(f0, q, coefs);
      break;

    case "peaking":
      peaking_coefs(f0, q, gain, coefs);
      break;

    case "lowshelf":
      lowshelf_coefs(f0, q, gain, coefs);
      break;

    case "highshelf":
      highshelf_coefs(f0, q, gain, coefs);
      break;
  }

  switch (type) {
    case "lowpass":
    case "highpass":
    case "bandpass_constant_skirt":
    case "bandpass_constant_peak":
    case "notch":
    case "allpass":

      if (gain != 1) {
        coefs.b0 *= gain;
        coefs.b1 *= gain;
        coefs.b2 *= gain;
      }

      break;

    /* gain is already integrated for the following */
    case "peaking":
    case "lowshelf":
    case "highshelf":
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

var Biquad = (function (Lfo) {
  function Biquad(previous, options) {
    _babelHelpers.classCallCheck(this, Biquad);

    if (!(this instanceof Biquad)) {
      return new Biquad(previous, options);
    }var defaults = {
      filterType: "lowpass",
      f0: 1,
      gain: 1,
      q: 1
    };

    this.type = "biquad";

    _babelHelpers.get(_core.Object.getPrototypeOf(Biquad.prototype), "constructor", this).call(this, previous, options, defaults);
    // from here on options is this.params

    // to implement
    // if(opts.damp) …
    // if(opts.decay) …
    // if(opts.over) …

    var frameRate = this.streamParams.frameRate;
    // if no frameRate or framerate is 0 we shall halt!
    if (!frameRate || frameRate <= 0) throw new Error("This Operator requires a frameRate higher than 0.");

    var normF0 = this.params.f0 / frameRate,
        gain = this.params.gain,
        q;

    if (this.params.q) q = this.params.q;
    if (this.params.bw) q = this.params.f0 / this.params.bw;

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
    this.setupStream();
  }

  _babelHelpers.inherits(Biquad, Lfo);

  _babelHelpers.prototypeProperties(Biquad, null, {
    process: {
      value: function process(time, frame) {
        biquadArrayDf1(this.coefs, this.state, frame, this.outFrame, frame.length);
        this.output(time);
      },
      writable: true,
      configurable: true
    }
  });

  return Biquad;
})(Lfo);

module.exports = Biquad;

},{"../core/lfo-base":3,"babel-runtime/core-js":11,"babel-runtime/helpers":12}],5:[function(require,module,exports){
"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");

var Magnitude = (function (Lfo) {
  function Magnitude() {
    var previous = arguments[0] === undefined ? null : arguments[0];
    var options = arguments[1] === undefined ? {} : arguments[1];

    _babelHelpers.classCallCheck(this, Magnitude);

    if (!(this instanceof Magnitude)) {
      return new Magnitude(previous, options);
    }_babelHelpers.get(_core.Object.getPrototypeOf(Magnitude.prototype), "constructor", this).call(this, previous, options, { normalize: false });

    this.type = "magnitude";

    // sets the necessary logic based on the params
    this.setupStream({ frameSize: 1 });
  }

  _babelHelpers.inherits(Magnitude, Lfo);

  _babelHelpers.prototypeProperties(Magnitude, null, {
    process: {
      value: function process(time, frame) {
        var frameSize = this.streamParams.frameSize,
            normalize = this.params.normalize,
            sum = 0,
            i;

        for (i = 0; i < frameSize; i++) sum += frame[i] * frame[i];

        if (normalize) sum /= frameSize;

        this.outFrame.set([Math.sqrt(sum)], 0);
        this.output(time);
      },
      writable: true,
      configurable: true
    }
  });

  return Magnitude;
})(Lfo);

module.exports = Magnitude;

},{"../core/lfo-base":3,"babel-runtime/core-js":11,"babel-runtime/helpers":12}],6:[function(require,module,exports){
"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var LFO = require("../core/lfo-base");

var Draw = (function (LFO) {
  function Draw() {
    var previous = arguments[0] === undefined ? null : arguments[0];
    var options = arguments[1] === undefined ? {} : arguments[1];

    _babelHelpers.classCallCheck(this, Draw);

    if (!(this instanceof Draw)) {
      return new Draw(previous, options);
    }this.type = "sink-draw";

    var defaults = {
      scroll: true,
      color: "#000000"
    };

    _babelHelpers.get(_core.Object.getPrototypeOf(Draw.prototype), "constructor", this).call(this, previous, options, defaults);

    if (!this.params.canvas) {
      return console.error("Please note: a canvas element is required or this module");
    } // pubs
    this.scrolls = this.params.scroll;
    this.canvas = this.params.canvas;
    this.color = this.params.color;

    // privs
    this._buffer = document.createElement("canvas");
    this._buffer.width = this.canvas.width;
    this._buffer.height = this.canvas.height;

    this._buffCtx = this._buffer.getContext("2d");
    this._cvCtx = this.canvas.getContext("2d");

    this._width = this.canvas.width;
    this._height = this.canvas.height;
    this._amp = this._height / 2;

    this._x = 0;
    this._i = 0;
    this._rate = 0.1;

    this._minVal = -1;
    this._maxVal = 1;
  }

  _babelHelpers.inherits(Draw, LFO);

  _babelHelpers.prototypeProperties(Draw, null, {
    _clearCanvas: {

      // Private Methods
      // ---------------

      value: function _clearCanvas(cv) {
        cv.height = this._height;cv.width = this._width;
      },
      writable: true,
      configurable: true
    },
    _scrollLeft: {
      value: function _scrollLeft() {

        // clear the buffer
        this._clearCanvas(this._buffer);
        // draw the destination into the buffer at 0 0
        this._buffCtx.drawImage(this.canvas, 0, 0);

        // clear the destination
        this._clearCanvas(this.canvas);
        // save the destination state
        this._cvCtx.save();
        // translate destination by 1 px on x
        this._cvCtx.translate(-1, 0);
        // draw the buffer into the destination
        this._cvCtx.drawImage(this._buffer, 0, 0);
        // restore the destination
        this._cvCtx.restore();

        // re-set the index
        this._x = this._width - 1;
      },
      writable: true,
      configurable: true
    },
    process: {

      // Public Methods
      // --------------

      value: function process(time, data) {
        var min = this._maxVal;
        var max = this._minVal;
        var step = data.length;

        if (this.scrolls && this._i % 4 === 0) {

          for (var j = 0; j < step; j++) {
            var datum = data[j];
            if (datum < min) min = datum;
            if (datum > max) max = datum;
          }

          var pos = this._maxVal - max * this._amp + this._amp;
          var h = (max - min) * this._amp;

          this._cvCtx.fillStyle = this.color;
          this._cvCtx.fillRect(this._x, pos, 1, Math.max(1, h));

          this._x++;
          if (this._x >= this._width) this._scrollLeft();
        }

        this._i++;
      },
      writable: true,
      configurable: true
    }
  });

  return Draw;
})(LFO);

module.exports = Draw;

},{"../core/lfo-base":3,"babel-runtime/core-js":11,"babel-runtime/helpers":12}],7:[function(require,module,exports){
(function (__dirname){
"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var AudioIn = require("./audio-in");
var Framer = require("./framer");
// remove fs, avoid brfs transform
var fs = require("fs");

// BinaryArray as source

var AudioInBuffer = (function (AudioIn) {
  function AudioInBuffer() {
    var _this = this;

    var options = arguments[0] === undefined ? {} : arguments[0];

    _babelHelpers.classCallCheck(this, AudioInBuffer);

    if (!(this instanceof AudioInBuffer)) {
      return new AudioInBuffer(options);
    }_babelHelpers.get(_core.Object.getPrototypeOf(AudioInBuffer.prototype), "constructor", this).call(this, options);

    this.type = "audio-in-buffer";

    this.framer = new Framer(this.outFrame, this.hopSize, this._ctx.sampleRate, function (time, frame) {
      _this.output(time);
    });

    var wrk = fs.readFileSync(__dirname + "/process-worker.js", "utf8");
    var blob = new Blob([wrk], { type: "text/javascript" });

    var workerMessage = function (e) {
      var block = e.data.block;
      var time = e.data.time;

      _this.framer.input(time, block);
    };

    this._proc = new Worker(window.URL.createObjectURL(blob));
    this._proc.addEventListener("message", workerMessage, false);
  }

  _babelHelpers.inherits(AudioInBuffer, AudioIn);

  _babelHelpers.prototypeProperties(AudioInBuffer, null, {
    start: {
      value: function start() {
        var message = {
          options: {
            sampleRate: this.sampleRate,
            hopSize: this.hopSize,
            blockSize: this.blockSize,
            frameSize: this.frameSize
          },
          data: this._src.getChannelData(this.channel)
        };

        this._proc.postMessage(message);
      },
      writable: true,
      configurable: true
    }
  });

  return AudioInBuffer;
})(AudioIn);

module.exports = AudioInBuffer;

}).call(this,"/dist/sources")

},{"./audio-in":9,"./framer":10,"babel-runtime/core-js":11,"babel-runtime/helpers":12,"fs":13}],8:[function(require,module,exports){
"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var AudioIn = require("./audio-in");
var Framer = require("./framer");

// web audio API node as a source

var AudioInNode = (function (AudioIn) {
  function AudioInNode() {
    var _this = this;

    var options = arguments[0] === undefined ? {} : arguments[0];

    _babelHelpers.classCallCheck(this, AudioInNode);

    if (!(this instanceof AudioInNode)) {
      return new AudioInNode(options);
    }_babelHelpers.get(_core.Object.getPrototypeOf(AudioInNode.prototype), "constructor", this).call(this, options);

    this.type = "audio-in-node";

    this.reslicer = new Framer(this.outFrame, this.hopSize, this._ctx.sampleRate, function (time, frame) {
      _this.output(_this.time);
    });

    this._proc = this._ctx.createScriptProcessor(this.hopSize, 1, 1);
    // keepalive
    this._ctx["_process-" + new Date().getTime()] = this._proc;
  }

  _babelHelpers.inherits(AudioInNode, AudioIn);

  _babelHelpers.prototypeProperties(AudioInNode, null, {
    start: {

      // connect the audio nodes to start streaming

      value: function start() {
        var _this = this;

        this._proc.onaudioprocess = function (e) {
          var block = e.inputBuffer.getChannelData(_this.channel);
          _this.reslicer.input(_this.time, block);
          _this.time += block.length / _this.sampleRate;
        };

        // start "the patch" ;)
        this._src.connect(this._proc);
        this._proc.connect(this._ctx.destination);
      },
      writable: true,
      configurable: true
    }
  });

  return AudioInNode;
})(AudioIn);

module.exports = AudioInNode;

},{"./audio-in":9,"./framer":10,"babel-runtime/core-js":11,"babel-runtime/helpers":12}],9:[function(require,module,exports){
"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");
var audioContext = new AudioContext();

var AudioIn = (function (Lfo) {
  function AudioIn() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _babelHelpers.classCallCheck(this, AudioIn);

    if (!(this instanceof AudioIn)) {
      return new AudioIn(options);
    }this.type = "audio-in";

    // defaults
    var defaults = {
      frameSize: 512,
      blockSize: 2048,
      hopSize: 512,
      channel: 0
    };

    _babelHelpers.get(_core.Object.getPrototypeOf(AudioIn.prototype), "constructor", this).call(this, null, options, defaults);

    // pubs
    this.frameSize = this.params.frameSize;
    this.blockSize = this.params.blockSize;
    this.hopSize = this.params.hopSize;
    this.channel = this.params.channel;
    this.frameOffset = 0;
    this.sampleRate = audioContext.sampleRate;

    // privs
    this._ctx = audioContext;
    this._currentTime = 0;
    this._src = this.params.src;

    this.setupStream({
      frameRate: this.sampleRate / this.hopSize,
      frameSize: this.frameSize,
      audioSampleRate: this._ctx.sampleRate
    });
  }

  _babelHelpers.inherits(AudioIn, Lfo);

  _babelHelpers.prototypeProperties(AudioIn, null, {
    start: {
      value: function start() {},
      writable: true,
      configurable: true
    }
  });

  return AudioIn;
})(Lfo);

module.exports = AudioIn;

},{"../core/lfo-base":3,"babel-runtime/core-js":11,"babel-runtime/helpers":12}],10:[function(require,module,exports){
"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var Framer = (function () {
  function Framer(outFrame, hopSize, sampleRate, callback) {
    _babelHelpers.classCallCheck(this, Framer);

    this._outFrame = outFrame;
    this._hopSize = hopSize;
    this._samplePeriod = 1 / sampleRate;
    this._callback = callback;

    this._frameIndex = 0;
  }

  _babelHelpers.prototypeProperties(Framer, null, {
    reset: {
      value: function reset() {
        this._frameIndex = 0;
      },
      writable: true,
      configurable: true
    },
    finalize: {
      value: function finalize(time) {
        var frameIndex = this._frameIndex;
        var frameSize = this._frameIndex;
        var outFrame = this._outFrame;

        if (frameIndex > 0) {
          // zero pad frame
          outFrame.fill(0, frameIndex);

          // output zero padded frame
          var frameTime = time + (frameSize / 2 + frameIndex) * this._samplePeriod; // frameSize / 2 - frameIndex - frameSize / 2)
          this._callback(frameTime, outFrame);
        }
      },
      writable: true,
      configurable: true
    },
    input: {
      value: function input(time, block) {
        var frameIndex = this._frameIndex;
        var frameSize = this._outFrame.length;
        var blockSize = block.length;
        var blockIndex = 0;

        // consume block
        while (blockIndex < blockSize) {
          var numSkip = 0;

          // skip block samples for negative frameIndex
          if (frameIndex < 0) numSkip = -frameIndex;

          if (numSkip < blockSize) {
            blockIndex += numSkip; // skip block segment

            var numCopy = blockSize - blockIndex; // can copy all the rest of teh incoming block
            var maxCopy = frameSize - frameIndex; // connot copy more than what fits into the frame

            if (numCopy >= maxCopy) numCopy = maxCopy;

            // copy block segment into frame
            var copy = block.subarray(blockIndex, blockIndex + numCopy);
            this._outFrame.set(copy, frameIndex);

            // advance block and frame index
            blockIndex += numCopy;
            frameIndex += numCopy;

            // send frame when completed
            if (frameIndex === frameSize) {
              var outFrame = this._outFrame;

              // output complete frame
              var frameTime = time + (blockIndex - frameSize / 2) * this._samplePeriod;
              this._callback(frameTime, outFrame);

              // shift frame left
              if (this._hopSize < frameSize) outFrame.set(outFrame.subarray(this._hopSize, frameSize), 0);

              frameIndex -= this._hopSize; // hop forward
            }
          } else {
            // skip entire block
            var blockRest = blockSize - blockIndex;
            frameIndex += blockRest;
            blockIndex += blockRest;
          }
        }

        this._frameIndex = frameIndex;
      },
      writable: true,
      configurable: true
    }
  });

  return Framer;
})();

module.exports = Framer;

},{"babel-runtime/helpers":12}],11:[function(require,module,exports){
/**
 * Core.js 0.6.1
 * https://github.com/zloirock/core-js
 * License: http://rock.mit-license.org
 * © 2015 Denis Pushkarev
 */
!function(global, framework, undefined){
'use strict';

/******************************************************************************
 * Module : common                                                            *
 ******************************************************************************/

  // Shortcuts for [[Class]] & property names
var OBJECT          = 'Object'
  , FUNCTION        = 'Function'
  , ARRAY           = 'Array'
  , STRING          = 'String'
  , NUMBER          = 'Number'
  , REGEXP          = 'RegExp'
  , DATE            = 'Date'
  , MAP             = 'Map'
  , SET             = 'Set'
  , WEAKMAP         = 'WeakMap'
  , WEAKSET         = 'WeakSet'
  , SYMBOL          = 'Symbol'
  , PROMISE         = 'Promise'
  , MATH            = 'Math'
  , ARGUMENTS       = 'Arguments'
  , PROTOTYPE       = 'prototype'
  , CONSTRUCTOR     = 'constructor'
  , TO_STRING       = 'toString'
  , TO_STRING_TAG   = TO_STRING + 'Tag'
  , TO_LOCALE       = 'toLocaleString'
  , HAS_OWN         = 'hasOwnProperty'
  , FOR_EACH        = 'forEach'
  , ITERATOR        = 'iterator'
  , FF_ITERATOR     = '@@' + ITERATOR
  , PROCESS         = 'process'
  , CREATE_ELEMENT  = 'createElement'
  // Aliases global objects and prototypes
  , Function        = global[FUNCTION]
  , Object          = global[OBJECT]
  , Array           = global[ARRAY]
  , String          = global[STRING]
  , Number          = global[NUMBER]
  , RegExp          = global[REGEXP]
  , Date            = global[DATE]
  , Map             = global[MAP]
  , Set             = global[SET]
  , WeakMap         = global[WEAKMAP]
  , WeakSet         = global[WEAKSET]
  , Symbol          = global[SYMBOL]
  , Math            = global[MATH]
  , TypeError       = global.TypeError
  , RangeError      = global.RangeError
  , setTimeout      = global.setTimeout
  , setImmediate    = global.setImmediate
  , clearImmediate  = global.clearImmediate
  , parseInt        = global.parseInt
  , isFinite        = global.isFinite
  , process         = global[PROCESS]
  , nextTick        = process && process.nextTick
  , document        = global.document
  , html            = document && document.documentElement
  , navigator       = global.navigator
  , define          = global.define
  , console         = global.console || {}
  , ArrayProto      = Array[PROTOTYPE]
  , ObjectProto     = Object[PROTOTYPE]
  , FunctionProto   = Function[PROTOTYPE]
  , Infinity        = 1 / 0
  , DOT             = '.';

// http://jsperf.com/core-js-isobject
function isObject(it){
  return it !== null && (typeof it == 'object' || typeof it == 'function');
}
function isFunction(it){
  return typeof it == 'function';
}
// Native function?
var isNative = ctx(/./.test, /\[native code\]\s*\}\s*$/, 1);

// Object internal [[Class]] or toStringTag
// http://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring
var toString = ObjectProto[TO_STRING];
function setToStringTag(it, tag, stat){
  if(it && !has(it = stat ? it : it[PROTOTYPE], SYMBOL_TAG))hidden(it, SYMBOL_TAG, tag);
}
function cof(it){
  return toString.call(it).slice(8, -1);
}
function classof(it){
  var O, T;
  return it == undefined ? it === undefined ? 'Undefined' : 'Null'
    : typeof (T = (O = Object(it))[SYMBOL_TAG]) == 'string' ? T : cof(O);
}

// Function
var call  = FunctionProto.call
  , apply = FunctionProto.apply
  , REFERENCE_GET;
// Partial apply
function part(/* ...args */){
  var fn     = assertFunction(this)
    , length = arguments.length
    , args   = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((args[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that    = this
      , _length = arguments.length
      , i = 0, j = 0, _args;
    if(!holder && !_length)return invoke(fn, args, that);
    _args = args.slice();
    if(holder)for(;length > i; i++)if(_args[i] === _)_args[i] = arguments[j++];
    while(_length > j)_args.push(arguments[j++]);
    return invoke(fn, _args, that);
  }
}
// Optional / simple context binding
function ctx(fn, that, length){
  assertFunction(fn);
  if(~length && that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    }
    case 2: return function(a, b){
      return fn.call(that, a, b);
    }
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    }
  } return function(/* ...args */){
      return fn.apply(that, arguments);
  }
}
// Fast apply
// http://jsperf.lnkit.com/fast-apply/5
function invoke(fn, args, that){
  var un = that === undefined;
  switch(args.length | 0){
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
    case 5: return un ? fn(args[0], args[1], args[2], args[3], args[4])
                      : fn.call(that, args[0], args[1], args[2], args[3], args[4]);
  } return              fn.apply(that, args);
}

// Object:
var create           = Object.create
  , getPrototypeOf   = Object.getPrototypeOf
  , setPrototypeOf   = Object.setPrototypeOf
  , defineProperty   = Object.defineProperty
  , defineProperties = Object.defineProperties
  , getOwnDescriptor = Object.getOwnPropertyDescriptor
  , getKeys          = Object.keys
  , getNames         = Object.getOwnPropertyNames
  , getSymbols       = Object.getOwnPropertySymbols
  , isFrozen         = Object.isFrozen
  , has              = ctx(call, ObjectProto[HAS_OWN], 2)
  // Dummy, fix for not array-like ES3 string in es5 module
  , ES5Object        = Object
  , Dict;
function toObject(it){
  return ES5Object(assertDefined(it));
}
function returnIt(it){
  return it;
}
function returnThis(){
  return this;
}
function get(object, key){
  if(has(object, key))return object[key];
}
function ownKeys(it){
  assertObject(it);
  return getSymbols ? getNames(it).concat(getSymbols(it)) : getNames(it);
}
// 19.1.2.1 Object.assign(target, source, ...)
var assign = Object.assign || function(target, source){
  var T = Object(assertDefined(target))
    , l = arguments.length
    , i = 1;
  while(l > i){
    var S      = ES5Object(arguments[i++])
      , keys   = getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)T[key = keys[j++]] = S[key];
  }
  return T;
}
function keyOf(object, el){
  var O      = toObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
}

// Array
// array('str1,str2,str3') => ['str1', 'str2', 'str3']
function array(it){
  return String(it).split(',');
}
var push    = ArrayProto.push
  , unshift = ArrayProto.unshift
  , slice   = ArrayProto.slice
  , splice  = ArrayProto.splice
  , indexOf = ArrayProto.indexOf
  , forEach = ArrayProto[FOR_EACH];
/*
 * 0 -> forEach
 * 1 -> map
 * 2 -> filter
 * 3 -> some
 * 4 -> every
 * 5 -> find
 * 6 -> findIndex
 */
function createArrayMethod(type){
  var isMap       = type == 1
    , isFilter    = type == 2
    , isSome      = type == 3
    , isEvery     = type == 4
    , isFindIndex = type == 6
    , noholes     = type == 5 || isFindIndex;
  return function(callbackfn/*, that = undefined */){
    var O      = Object(assertDefined(this))
      , that   = arguments[1]
      , self   = ES5Object(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = isMap ? Array(length) : isFilter ? [] : undefined
      , val, res;
    for(;length > index; index++)if(noholes || index in self){
      val = self[index];
      res = f(val, index, O);
      if(type){
        if(isMap)result[index] = res;             // map
        else if(res)switch(type){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(isEvery)return false;           // every
      }
    }
    return isFindIndex ? -1 : isSome || isEvery ? isEvery : result;
  }
}
function createArrayContains(isContains){
  return function(el /*, fromIndex = 0 */){
    var O      = toObject(this)
      , length = toLength(O.length)
      , index  = toIndex(arguments[1], length);
    if(isContains && el != el){
      for(;length > index; index++)if(sameNaN(O[index]))return isContains || index;
    } else for(;length > index; index++)if(isContains || index in O){
      if(O[index] === el)return isContains || index;
    } return !isContains && -1;
  }
}
function generic(A, B){
  // strange IE quirks mode bug -> use typeof vs isFunction
  return typeof A == 'function' ? A : B;
}

// Math
var MAX_SAFE_INTEGER = 0x1fffffffffffff // pow(2, 53) - 1 == 9007199254740991
  , pow    = Math.pow
  , abs    = Math.abs
  , ceil   = Math.ceil
  , floor  = Math.floor
  , max    = Math.max
  , min    = Math.min
  , random = Math.random
  , trunc  = Math.trunc || function(it){
      return (it > 0 ? floor : ceil)(it);
    }
// 20.1.2.4 Number.isNaN(number)
function sameNaN(number){
  return number != number;
}
// 7.1.4 ToInteger
function toInteger(it){
  return isNaN(it) ? 0 : trunc(it);
}
// 7.1.15 ToLength
function toLength(it){
  return it > 0 ? min(toInteger(it), MAX_SAFE_INTEGER) : 0;
}
function toIndex(index, length){
  var index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
}
function lz(num){
  return num > 9 ? num : '0' + num;
}

function createReplacer(regExp, replace, isStatic){
  var replacer = isObject(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(isStatic ? it : this).replace(regExp, replacer);
  }
}
function createPointAt(toString){
  return function(pos){
    var s = String(assertDefined(this))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return toString ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? toString ? s.charAt(i) : a
      : toString ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  }
}

// Assertion & errors
var REDUCE_ERROR = 'Reduce of empty object with no initial value';
function assert(condition, msg1, msg2){
  if(!condition)throw TypeError(msg2 ? msg1 + msg2 : msg1);
}
function assertDefined(it){
  if(it == undefined)throw TypeError('Function called on null or undefined');
  return it;
}
function assertFunction(it){
  assert(isFunction(it), it, ' is not a function!');
  return it;
}
function assertObject(it){
  assert(isObject(it), it, ' is not an object!');
  return it;
}
function assertInstance(it, Constructor, name){
  assert(it instanceof Constructor, name, ": use the 'new' operator!");
}

// Property descriptors & Symbol
function descriptor(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  }
}
function simpleSet(object, key, value){
  object[key] = value;
  return object;
}
function createDefiner(bitmap){
  return DESC ? function(object, key, value){
    return defineProperty(object, key, descriptor(bitmap, value));
  } : simpleSet;
}
function uid(key){
  return SYMBOL + '(' + key + ')_' + (++sid + random())[TO_STRING](36);
}
function getWellKnownSymbol(name, setter){
  return (Symbol && Symbol[name]) || (setter ? Symbol : safeSymbol)(SYMBOL + DOT + name);
}
// The engine works fine with descriptors? Thank's IE8 for his funny defineProperty.
var DESC = !!function(){
      try {
        return defineProperty({}, 'a', {get: function(){ return 2 }}).a == 2;
      } catch(e){}
    }()
  , sid    = 0
  , hidden = createDefiner(1)
  , set    = Symbol ? simpleSet : hidden
  , safeSymbol = Symbol || uid;
function assignHidden(target, src){
  for(var key in src)hidden(target, key, src[key]);
  return target;
}

var SYMBOL_UNSCOPABLES = getWellKnownSymbol('unscopables')
  , ArrayUnscopables   = ArrayProto[SYMBOL_UNSCOPABLES] || {}
  , SYMBOL_TAG         = getWellKnownSymbol(TO_STRING_TAG)
  , SYMBOL_SPECIES     = getWellKnownSymbol('species')
  , SYMBOL_ITERATOR;
function setSpecies(C){
  if(DESC && (framework || !isNative(C)))defineProperty(C, SYMBOL_SPECIES, {
    configurable: true,
    get: returnThis
  });
}

/******************************************************************************
 * Module : common.export                                                     *
 ******************************************************************************/

var NODE = cof(process) == PROCESS
  , core = {}
  , path = framework ? global : core
  , old  = global.core
  , exportGlobal
  // type bitmap
  , FORCED = 1
  , GLOBAL = 2
  , STATIC = 4
  , PROTO  = 8
  , BIND   = 16
  , WRAP   = 32;
function $define(type, name, source){
  var key, own, out, exp
    , isGlobal = type & GLOBAL
    , target   = isGlobal ? global : (type & STATIC)
        ? global[name] : (global[name] || ObjectProto)[PROTOTYPE]
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // there is a similar native
    own = !(type & FORCED) && target && key in target
      && (!isFunction(target[key]) || isNative(target[key]));
    // export native or passed
    out = (own ? target : source)[key];
    // prevent global pollution for namespaces
    if(!framework && isGlobal && !isFunction(target[key]))exp = source[key];
    // bind timers to global for call from export context
    else if(type & BIND && own)exp = ctx(out, global);
    // wrap global constructors for prevent change them in library
    else if(type & WRAP && !framework && target[key] == out){
      exp = function(param){
        return this instanceof out ? new out(param) : out(param);
      }
      exp[PROTOTYPE] = out[PROTOTYPE];
    } else exp = type & PROTO && isFunction(out) ? ctx(call, out) : out;
    // extend global
    if(framework && target && !own){
      if(isGlobal)target[key] = out;
      else delete target[key] && hidden(target, key, out);
    }
    // export
    if(exports[key] != out)hidden(exports, key, exp);
  }
}
// CommonJS export
if(typeof module != 'undefined' && module.exports)module.exports = core;
// RequireJS export
else if(isFunction(define) && define.amd)define(function(){return core});
// Export to global object
else exportGlobal = true;
if(exportGlobal || framework){
  core.noConflict = function(){
    global.core = old;
    return core;
  }
  global.core = core;
}

/******************************************************************************
 * Module : common.iterators                                                  *
 ******************************************************************************/

SYMBOL_ITERATOR = getWellKnownSymbol(ITERATOR);
var ITER  = safeSymbol('iter')
  , KEY   = 1
  , VALUE = 2
  , Iterators = {}
  , IteratorPrototype = {}
    // Safari has byggy iterators w/o `next`
  , BUGGY_ITERATORS = 'keys' in ArrayProto && !('next' in [].keys());
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
setIterator(IteratorPrototype, returnThis);
function setIterator(O, value){
  hidden(O, SYMBOL_ITERATOR, value);
  // Add iterator for FF iterator protocol
  FF_ITERATOR in ArrayProto && hidden(O, FF_ITERATOR, value);
}
function createIterator(Constructor, NAME, next, proto){
  Constructor[PROTOTYPE] = create(proto || IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
}
function defineIterator(Constructor, NAME, value, DEFAULT){
  var proto = Constructor[PROTOTYPE]
    , iter  = get(proto, SYMBOL_ITERATOR) || get(proto, FF_ITERATOR) || (DEFAULT && get(proto, DEFAULT)) || value;
  if(framework){
    // Define iterator
    setIterator(proto, iter);
    if(iter !== value){
      var iterProto = getPrototypeOf(iter.call(new Constructor));
      // Set @@toStringTag to native iterators
      setToStringTag(iterProto, NAME + ' Iterator', true);
      // FF fix
      has(proto, FF_ITERATOR) && setIterator(iterProto, returnThis);
    }
  }
  // Plug for library
  Iterators[NAME] = iter;
  // FF & v8 fix
  Iterators[NAME + ' Iterator'] = returnThis;
  return iter;
}
function defineStdIterators(Base, NAME, Constructor, next, DEFAULT, IS_SET){
  function createIter(kind){
    return function(){
      return new Constructor(this, kind);
    }
  }
  createIterator(Constructor, NAME, next);
  var entries = createIter(KEY+VALUE)
    , values  = createIter(VALUE);
  if(DEFAULT == VALUE)values = defineIterator(Base, NAME, values, 'values');
  else entries = defineIterator(Base, NAME, entries, 'entries');
  if(DEFAULT){
    $define(PROTO + FORCED * BUGGY_ITERATORS, NAME, {
      entries: entries,
      keys: IS_SET ? values : createIter(KEY),
      values: values
    });
  }
}
function iterResult(done, value){
  return {value: value, done: !!done};
}
function isIterable(it){
  var O      = Object(it)
    , Symbol = global[SYMBOL]
    , hasExt = (Symbol && Symbol[ITERATOR] || FF_ITERATOR) in O;
  return hasExt || SYMBOL_ITERATOR in O || has(Iterators, classof(O));
}
function getIterator(it){
  var Symbol  = global[SYMBOL]
    , ext     = it[Symbol && Symbol[ITERATOR] || FF_ITERATOR]
    , getIter = ext || it[SYMBOL_ITERATOR] || Iterators[classof(it)];
  return assertObject(getIter.call(it));
}
function stepCall(fn, value, entries){
  return entries ? invoke(fn, value) : fn(value);
}
function checkDangerIterClosing(fn){
  var danger = true;
  var O = {
    next: function(){ throw 1 },
    'return': function(){ danger = false }
  };
  O[SYMBOL_ITERATOR] = returnThis;
  try {
    fn(O);
  } catch(e){}
  return danger;
}
function closeIterator(iterator){
  var ret = iterator['return'];
  if(ret !== undefined)ret.call(iterator);
}
function safeIterClose(exec, iterator){
  try {
    exec(iterator);
  } catch(e){
    closeIterator(iterator);
    throw e;
  }
}
function forOf(iterable, entries, fn, that){
  safeIterClose(function(iterator){
    var f = ctx(fn, that, entries ? 2 : 1)
      , step;
    while(!(step = iterator.next()).done)if(stepCall(f, step.value, entries) === false){
      return closeIterator(iterator);
    }
  }, getIterator(iterable));
}

/******************************************************************************
 * Module : es6.symbol                                                        *
 ******************************************************************************/

// ECMAScript 6 symbols shim
!function(TAG, SymbolRegistry, AllSymbols, setter){
  // 19.4.1.1 Symbol([description])
  if(!isNative(Symbol)){
    Symbol = function(description){
      assert(!(this instanceof Symbol), SYMBOL + ' is not a ' + CONSTRUCTOR);
      var tag = uid(description)
        , sym = set(create(Symbol[PROTOTYPE]), TAG, tag);
      AllSymbols[tag] = sym;
      DESC && setter && defineProperty(ObjectProto, tag, {
        configurable: true,
        set: function(value){
          hidden(this, tag, value);
        }
      });
      return sym;
    }
    hidden(Symbol[PROTOTYPE], TO_STRING, function(){
      return this[TAG];
    });
  }
  $define(GLOBAL + WRAP, {Symbol: Symbol});
  
  var symbolStatics = {
    // 19.4.2.1 Symbol.for(key)
    'for': function(key){
      return has(SymbolRegistry, key += '')
        ? SymbolRegistry[key]
        : SymbolRegistry[key] = Symbol(key);
    },
    // 19.4.2.4 Symbol.iterator
    iterator: SYMBOL_ITERATOR || getWellKnownSymbol(ITERATOR),
    // 19.4.2.5 Symbol.keyFor(sym)
    keyFor: part.call(keyOf, SymbolRegistry),
    // 19.4.2.10 Symbol.species
    species: SYMBOL_SPECIES,
    // 19.4.2.13 Symbol.toStringTag
    toStringTag: SYMBOL_TAG = getWellKnownSymbol(TO_STRING_TAG, true),
    // 19.4.2.14 Symbol.unscopables
    unscopables: SYMBOL_UNSCOPABLES,
    pure: safeSymbol,
    set: set,
    useSetter: function(){setter = true},
    useSimple: function(){setter = false}
  };
  // 19.4.2.2 Symbol.hasInstance
  // 19.4.2.3 Symbol.isConcatSpreadable
  // 19.4.2.6 Symbol.match
  // 19.4.2.8 Symbol.replace
  // 19.4.2.9 Symbol.search
  // 19.4.2.11 Symbol.split
  // 19.4.2.12 Symbol.toPrimitive
  forEach.call(array('hasInstance,isConcatSpreadable,match,replace,search,split,toPrimitive'),
    function(it){
      symbolStatics[it] = getWellKnownSymbol(it);
    }
  );
  $define(STATIC, SYMBOL, symbolStatics);
  
  setToStringTag(Symbol, SYMBOL);
  
  $define(STATIC + FORCED * !isNative(Symbol), OBJECT, {
    // 19.1.2.7 Object.getOwnPropertyNames(O)
    getOwnPropertyNames: function(it){
      var names = getNames(toObject(it)), result = [], key, i = 0;
      while(names.length > i)has(AllSymbols, key = names[i++]) || result.push(key);
      return result;
    },
    // 19.1.2.8 Object.getOwnPropertySymbols(O)
    getOwnPropertySymbols: function(it){
      var names = getNames(toObject(it)), result = [], key, i = 0;
      while(names.length > i)has(AllSymbols, key = names[i++]) && result.push(AllSymbols[key]);
      return result;
    }
  });
  
  // 20.2.1.9 Math[@@toStringTag]
  setToStringTag(Math, MATH, true);
  // 24.3.3 JSON[@@toStringTag]
  setToStringTag(global.JSON, 'JSON', true);
}(safeSymbol('tag'), {}, {}, true);

/******************************************************************************
 * Module : es6.object.statics                                                *
 ******************************************************************************/

!function(){
  var objectStatic = {
    // 19.1.3.1 Object.assign(target, source)
    assign: assign,
    // 19.1.3.10 Object.is(value1, value2)
    is: function(x, y){
      return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
    }
  };
  // 19.1.3.19 Object.setPrototypeOf(O, proto)
  // Works with __proto__ only. Old v8 can't works with null proto objects.
  '__proto__' in ObjectProto && function(buggy, set){
    try {
      set = ctx(call, getOwnDescriptor(ObjectProto, '__proto__').set, 2);
      set({}, ArrayProto);
    } catch(e){ buggy = true }
    objectStatic.setPrototypeOf = setPrototypeOf = setPrototypeOf || function(O, proto){
      assertObject(O);
      assert(proto === null || isObject(proto), proto, ": can't set as prototype!");
      if(buggy)O.__proto__ = proto;
      else set(O, proto);
      return O;
    }
  }();
  $define(STATIC, OBJECT, objectStatic);
}();

/******************************************************************************
 * Module : es6.object.statics-accept-primitives                              *
 ******************************************************************************/

!function(){
  // Object static methods accept primitives
  function wrapObjectMethod(key, MODE){
    var fn  = Object[key]
      , exp = core[OBJECT][key]
      , f   = 0
      , o   = {};
    if(!exp || isNative(exp)){
      o[key] = MODE == 1 ? function(it){
        return isObject(it) ? fn(it) : it;
      } : MODE == 2 ? function(it){
        return isObject(it) ? fn(it) : true;
      } : MODE == 3 ? function(it){
        return isObject(it) ? fn(it) : false;
      } : MODE == 4 ? function(it, key){
        return fn(toObject(it), key);
      } : function(it){
        return fn(toObject(it));
      };
      try { fn(DOT) }
      catch(e){ f = 1 }
      $define(STATIC + FORCED * f, OBJECT, o);
    }
  }
  wrapObjectMethod('freeze', 1);
  wrapObjectMethod('seal', 1);
  wrapObjectMethod('preventExtensions', 1);
  wrapObjectMethod('isFrozen', 2);
  wrapObjectMethod('isSealed', 2);
  wrapObjectMethod('isExtensible', 3);
  wrapObjectMethod('getOwnPropertyDescriptor', 4);
  wrapObjectMethod('getPrototypeOf');
  wrapObjectMethod('keys');
  wrapObjectMethod('getOwnPropertyNames');
}();

/******************************************************************************
 * Module : es6.number.statics                                                *
 ******************************************************************************/

!function(isInteger){
  $define(STATIC, NUMBER, {
    // 20.1.2.1 Number.EPSILON
    EPSILON: pow(2, -52),
    // 20.1.2.2 Number.isFinite(number)
    isFinite: function(it){
      return typeof it == 'number' && isFinite(it);
    },
    // 20.1.2.3 Number.isInteger(number)
    isInteger: isInteger,
    // 20.1.2.4 Number.isNaN(number)
    isNaN: sameNaN,
    // 20.1.2.5 Number.isSafeInteger(number)
    isSafeInteger: function(number){
      return isInteger(number) && abs(number) <= MAX_SAFE_INTEGER;
    },
    // 20.1.2.6 Number.MAX_SAFE_INTEGER
    MAX_SAFE_INTEGER: MAX_SAFE_INTEGER,
    // 20.1.2.10 Number.MIN_SAFE_INTEGER
    MIN_SAFE_INTEGER: -MAX_SAFE_INTEGER,
    // 20.1.2.12 Number.parseFloat(string)
    parseFloat: parseFloat,
    // 20.1.2.13 Number.parseInt(string, radix)
    parseInt: parseInt
  });
// 20.1.2.3 Number.isInteger(number)
}(Number.isInteger || function(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
});

/******************************************************************************
 * Module : es6.math                                                          *
 ******************************************************************************/

// ECMAScript 6 shim
!function(){
  // 20.2.2.28 Math.sign(x)
  var E    = Math.E
    , exp  = Math.exp
    , log  = Math.log
    , sqrt = Math.sqrt
    , sign = Math.sign || function(x){
        return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
      };
  
  // 20.2.2.5 Math.asinh(x)
  function asinh(x){
    return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log(x + sqrt(x * x + 1));
  }
  // 20.2.2.14 Math.expm1(x)
  function expm1(x){
    return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
  }
    
  $define(STATIC, MATH, {
    // 20.2.2.3 Math.acosh(x)
    acosh: function(x){
      return (x = +x) < 1 ? NaN : isFinite(x) ? log(x / E + sqrt(x + 1) * sqrt(x - 1) / E) + 1 : x;
    },
    // 20.2.2.5 Math.asinh(x)
    asinh: asinh,
    // 20.2.2.7 Math.atanh(x)
    atanh: function(x){
      return (x = +x) == 0 ? x : log((1 + x) / (1 - x)) / 2;
    },
    // 20.2.2.9 Math.cbrt(x)
    cbrt: function(x){
      return sign(x = +x) * pow(abs(x), 1 / 3);
    },
    // 20.2.2.11 Math.clz32(x)
    clz32: function(x){
      return (x >>>= 0) ? 32 - x[TO_STRING](2).length : 32;
    },
    // 20.2.2.12 Math.cosh(x)
    cosh: function(x){
      return (exp(x = +x) + exp(-x)) / 2;
    },
    // 20.2.2.14 Math.expm1(x)
    expm1: expm1,
    // 20.2.2.16 Math.fround(x)
    // TODO: fallback for IE9-
    fround: function(x){
      return new Float32Array([x])[0];
    },
    // 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
    hypot: function(value1, value2){
      var sum  = 0
        , len1 = arguments.length
        , len2 = len1
        , args = Array(len1)
        , larg = -Infinity
        , arg;
      while(len1--){
        arg = args[len1] = +arguments[len1];
        if(arg == Infinity || arg == -Infinity)return Infinity;
        if(arg > larg)larg = arg;
      }
      larg = arg || 1;
      while(len2--)sum += pow(args[len2] / larg, 2);
      return larg * sqrt(sum);
    },
    // 20.2.2.18 Math.imul(x, y)
    imul: function(x, y){
      var UInt16 = 0xffff
        , xn = +x
        , yn = +y
        , xl = UInt16 & xn
        , yl = UInt16 & yn;
      return 0 | xl * yl + ((UInt16 & xn >>> 16) * yl + xl * (UInt16 & yn >>> 16) << 16 >>> 0);
    },
    // 20.2.2.20 Math.log1p(x)
    log1p: function(x){
      return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log(1 + x);
    },
    // 20.2.2.21 Math.log10(x)
    log10: function(x){
      return log(x) / Math.LN10;
    },
    // 20.2.2.22 Math.log2(x)
    log2: function(x){
      return log(x) / Math.LN2;
    },
    // 20.2.2.28 Math.sign(x)
    sign: sign,
    // 20.2.2.30 Math.sinh(x)
    sinh: function(x){
      return (abs(x = +x) < 1) ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (E / 2);
    },
    // 20.2.2.33 Math.tanh(x)
    tanh: function(x){
      var a = expm1(x = +x)
        , b = expm1(-x);
      return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
    },
    // 20.2.2.34 Math.trunc(x)
    trunc: trunc
  });
}();

/******************************************************************************
 * Module : es6.string                                                        *
 ******************************************************************************/

!function(fromCharCode){
  function assertNotRegExp(it){
    if(cof(it) == REGEXP)throw TypeError();
  }
  
  $define(STATIC, STRING, {
    // 21.1.2.2 String.fromCodePoint(...codePoints)
    fromCodePoint: function(x){
      var res = []
        , len = arguments.length
        , i   = 0
        , code
      while(len > i){
        code = +arguments[i++];
        if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
        res.push(code < 0x10000
          ? fromCharCode(code)
          : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
        );
      } return res.join('');
    },
    // 21.1.2.4 String.raw(callSite, ...substitutions)
    raw: function(callSite){
      var raw = toObject(callSite.raw)
        , len = toLength(raw.length)
        , sln = arguments.length
        , res = []
        , i   = 0;
      while(len > i){
        res.push(String(raw[i++]));
        if(i < sln)res.push(String(arguments[i]));
      } return res.join('');
    }
  });
  
  $define(PROTO, STRING, {
    // 21.1.3.3 String.prototype.codePointAt(pos)
    codePointAt: createPointAt(false),
    // 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
    endsWith: function(searchString /*, endPosition = @length */){
      assertNotRegExp(searchString);
      var that = String(assertDefined(this))
        , endPosition = arguments[1]
        , len = toLength(that.length)
        , end = endPosition === undefined ? len : min(toLength(endPosition), len);
      searchString += '';
      return that.slice(end - searchString.length, end) === searchString;
    },
    // 21.1.3.7 String.prototype.includes(searchString, position = 0)
    includes: function(searchString /*, position = 0 */){
      assertNotRegExp(searchString);
      return !!~String(assertDefined(this)).indexOf(searchString, arguments[1]);
    },
    // 21.1.3.13 String.prototype.repeat(count)
    repeat: function(count){
      var str = String(assertDefined(this))
        , res = ''
        , n   = toInteger(count);
      if(0 > n || n == Infinity)throw RangeError("Count can't be negative");
      for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
      return res;
    },
    // 21.1.3.18 String.prototype.startsWith(searchString [, position ])
    startsWith: function(searchString /*, position = 0 */){
      assertNotRegExp(searchString);
      var that  = String(assertDefined(this))
        , index = toLength(min(arguments[1], that.length));
      searchString += '';
      return that.slice(index, index + searchString.length) === searchString;
    }
  });
}(String.fromCharCode);

/******************************************************************************
 * Module : es6.array.statics                                                 *
 ******************************************************************************/

!function(){
  $define(STATIC + FORCED * checkDangerIterClosing(Array.from), ARRAY, {
    // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
    from: function(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
      var O       = Object(assertDefined(arrayLike))
        , mapfn   = arguments[1]
        , mapping = mapfn !== undefined
        , f       = mapping ? ctx(mapfn, arguments[2], 2) : undefined
        , index   = 0
        , length, result, step;
      if(isIterable(O)){
        result = new (generic(this, Array));
        safeIterClose(function(iterator){
          for(; !(step = iterator.next()).done; index++){
            result[index] = mapping ? f(step.value, index) : step.value;
          }
        }, getIterator(O));
      } else {
        result = new (generic(this, Array))(length = toLength(O.length));
        for(; length > index; index++){
          result[index] = mapping ? f(O[index], index) : O[index];
        }
      }
      result.length = index;
      return result;
    }
  });
  
  $define(STATIC, ARRAY, {
    // 22.1.2.3 Array.of( ...items)
    of: function(/* ...args */){
      var index  = 0
        , length = arguments.length
        , result = new (generic(this, Array))(length);
      while(length > index)result[index] = arguments[index++];
      result.length = length;
      return result;
    }
  });
  
  setSpecies(Array);
}();

/******************************************************************************
 * Module : es6.array.prototype                                               *
 ******************************************************************************/

!function(){
  $define(PROTO, ARRAY, {
    // 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
    copyWithin: function(target /* = 0 */, start /* = 0, end = @length */){
      var O     = Object(assertDefined(this))
        , len   = toLength(O.length)
        , to    = toIndex(target, len)
        , from  = toIndex(start, len)
        , end   = arguments[2]
        , fin   = end === undefined ? len : toIndex(end, len)
        , count = min(fin - from, len - to)
        , inc   = 1;
      if(from < to && to < from + count){
        inc  = -1;
        from = from + count - 1;
        to   = to + count - 1;
      }
      while(count-- > 0){
        if(from in O)O[to] = O[from];
        else delete O[to];
        to += inc;
        from += inc;
      } return O;
    },
    // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
    fill: function(value /*, start = 0, end = @length */){
      var O      = Object(assertDefined(this))
        , length = toLength(O.length)
        , index  = toIndex(arguments[1], length)
        , end    = arguments[2]
        , endPos = end === undefined ? length : toIndex(end, length);
      while(endPos > index)O[index++] = value;
      return O;
    },
    // 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
    find: createArrayMethod(5),
    // 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
    findIndex: createArrayMethod(6)
  });
  
  if(framework){
    // 22.1.3.31 Array.prototype[@@unscopables]
    forEach.call(array('find,findIndex,fill,copyWithin,entries,keys,values'), function(it){
      ArrayUnscopables[it] = true;
    });
    SYMBOL_UNSCOPABLES in ArrayProto || hidden(ArrayProto, SYMBOL_UNSCOPABLES, ArrayUnscopables);
  }
}();

/******************************************************************************
 * Module : es6.iterators                                                     *
 ******************************************************************************/

!function(at){
  // 22.1.3.4 Array.prototype.entries()
  // 22.1.3.13 Array.prototype.keys()
  // 22.1.3.29 Array.prototype.values()
  // 22.1.3.30 Array.prototype[@@iterator]()
  defineStdIterators(Array, ARRAY, function(iterated, kind){
    set(this, ITER, {o: toObject(iterated), i: 0, k: kind});
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
  }, function(){
    var iter  = this[ITER]
      , O     = iter.o
      , kind  = iter.k
      , index = iter.i++;
    if(!O || index >= O.length){
      iter.o = undefined;
      return iterResult(1);
    }
    if(kind == KEY)  return iterResult(0, index);
    if(kind == VALUE)return iterResult(0, O[index]);
                     return iterResult(0, [index, O[index]]);
  }, VALUE);
  
  // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
  Iterators[ARGUMENTS] = Iterators[ARRAY];
  
  // 21.1.3.27 String.prototype[@@iterator]()
  defineStdIterators(String, STRING, function(iterated){
    set(this, ITER, {o: String(iterated), i: 0});
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
  }, function(){
    var iter  = this[ITER]
      , O     = iter.o
      , index = iter.i
      , point;
    if(index >= O.length)return iterResult(1);
    point = at.call(O, index);
    iter.i += point.length;
    return iterResult(0, point);
  });
}(createPointAt(true));

/******************************************************************************
 * Module : web.immediate                                                     *
 ******************************************************************************/

// setImmediate shim
// Node.js 0.9+ & IE10+ has setImmediate, else:
isFunction(setImmediate) && isFunction(clearImmediate) || function(ONREADYSTATECHANGE){
  var postMessage      = global.postMessage
    , addEventListener = global.addEventListener
    , MessageChannel   = global.MessageChannel
    , counter          = 0
    , queue            = {}
    , defer, channel, port;
  setImmediate = function(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(isFunction(fn) ? fn : Function(fn), args);
    }
    defer(counter);
    return counter;
  }
  clearImmediate = function(id){
    delete queue[id];
  }
  function run(id){
    if(has(queue, id)){
      var fn = queue[id];
      delete queue[id];
      fn();
    }
  }
  function listner(event){
    run(event.data);
  }
  // Node.js 0.8-
  if(NODE){
    defer = function(id){
      nextTick(part.call(run, id));
    }
  // Modern browsers, skip implementation for WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is object
  } else if(addEventListener && isFunction(postMessage) && !global.importScripts){
    defer = function(id){
      postMessage(id, '*');
    }
    addEventListener('message', listner, false);
  // WebWorkers
  } else if(isFunction(MessageChannel)){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // IE8-
  } else if(document && ONREADYSTATECHANGE in document[CREATE_ELEMENT]('script')){
    defer = function(id){
      html.appendChild(document[CREATE_ELEMENT]('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run(id);
      }
    }
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(run, 0, id);
    }
  }
}('onreadystatechange');
$define(GLOBAL + BIND, {
  setImmediate:   setImmediate,
  clearImmediate: clearImmediate
});

/******************************************************************************
 * Module : es6.promise                                                       *
 ******************************************************************************/

// ES6 promises shim
// Based on https://github.com/getify/native-promise-only/
!function(Promise, test){
  isFunction(Promise) && isFunction(Promise.resolve)
  && Promise.resolve(test = new Promise(function(){})) == test
  || function(asap, RECORD){
    function isThenable(it){
      var then;
      if(isObject(it))then = it.then;
      return isFunction(then) ? then : false;
    }
    function handledRejectionOrHasOnRejected(promise){
      var record = promise[RECORD]
        , chain  = record.c
        , i      = 0
        , react;
      if(record.h)return true;
      while(chain.length > i){
        react = chain[i++];
        if(react.fail || handledRejectionOrHasOnRejected(react.P))return true;
      }
    }
    function notify(record, reject){
      var chain = record.c;
      if(reject || chain.length)asap(function(){
        var promise = record.p
          , value   = record.v
          , ok      = record.s == 1
          , i       = 0;
        if(reject && !handledRejectionOrHasOnRejected(promise)){
          setTimeout(function(){
            if(!handledRejectionOrHasOnRejected(promise)){
              if(NODE){
                if(!process.emit('unhandledRejection', value, promise)){
                  // default node.js behavior
                }
              } else if(isFunction(console.error)){
                console.error('Unhandled promise rejection', value);
              }
            }
          }, 1e3);
        } else while(chain.length > i)!function(react){
          var cb = ok ? react.ok : react.fail
            , ret, then;
          try {
            if(cb){
              if(!ok)record.h = true;
              ret = cb === true ? value : cb(value);
              if(ret === react.P){
                react.rej(TypeError(PROMISE + '-chain cycle'));
              } else if(then = isThenable(ret)){
                then.call(ret, react.res, react.rej);
              } else react.res(ret);
            } else react.rej(value);
          } catch(err){
            react.rej(err);
          }
        }(chain[i++]);
        chain.length = 0;
      });
    }
    function resolve(value){
      var record = this
        , then, wrapper;
      if(record.d)return;
      record.d = true;
      record = record.r || record; // unwrap
      try {
        if(then = isThenable(value)){
          wrapper = {r: record, d: false}; // wrap
          then.call(value, ctx(resolve, wrapper, 1), ctx(reject, wrapper, 1));
        } else {
          record.v = value;
          record.s = 1;
          notify(record);
        }
      } catch(err){
        reject.call(wrapper || {r: record, d: false}, err); // wrap
      }
    }
    function reject(value){
      var record = this;
      if(record.d)return;
      record.d = true;
      record = record.r || record; // unwrap
      record.v = value;
      record.s = 2;
      notify(record, true);
    }
    function getConstructor(C){
      var S = assertObject(C)[SYMBOL_SPECIES];
      return S != undefined ? S : C;
    }
    // 25.4.3.1 Promise(executor)
    Promise = function(executor){
      assertFunction(executor);
      assertInstance(this, Promise, PROMISE);
      var record = {
        p: this,      // promise
        c: [],        // chain
        s: 0,         // state
        d: false,     // done
        v: undefined, // value
        h: false      // handled rejection
      };
      hidden(this, RECORD, record);
      try {
        executor(ctx(resolve, record, 1), ctx(reject, record, 1));
      } catch(err){
        reject.call(record, err);
      }
    }
    assignHidden(Promise[PROTOTYPE], {
      // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
      then: function(onFulfilled, onRejected){
        var S = assertObject(assertObject(this)[CONSTRUCTOR])[SYMBOL_SPECIES];
        var react = {
          ok:   isFunction(onFulfilled) ? onFulfilled : true,
          fail: isFunction(onRejected)  ? onRejected  : false
        } , P = react.P = new (S != undefined ? S : Promise)(function(resolve, reject){
          react.res = assertFunction(resolve);
          react.rej = assertFunction(reject);
        }), record = this[RECORD];
        record.c.push(react);
        record.s && notify(record);
        return P;
      },
      // 25.4.5.1 Promise.prototype.catch(onRejected)
      'catch': function(onRejected){
        return this.then(undefined, onRejected);
      }
    });
    assignHidden(Promise, {
      // 25.4.4.1 Promise.all(iterable)
      all: function(iterable){
        var Promise = getConstructor(this)
          , values  = [];
        return new Promise(function(resolve, reject){
          forOf(iterable, false, push, values);
          var remaining = values.length
            , results   = Array(remaining);
          if(remaining)forEach.call(values, function(promise, index){
            Promise.resolve(promise).then(function(value){
              results[index] = value;
              --remaining || resolve(results);
            }, reject);
          });
          else resolve(results);
        });
      },
      // 25.4.4.4 Promise.race(iterable)
      race: function(iterable){
        var Promise = getConstructor(this);
        return new Promise(function(resolve, reject){
          forOf(iterable, false, function(promise){
            Promise.resolve(promise).then(resolve, reject);
          });
        });
      },
      // 25.4.4.5 Promise.reject(r)
      reject: function(r){
        return new (getConstructor(this))(function(resolve, reject){
          reject(r);
        });
      },
      // 25.4.4.6 Promise.resolve(x)
      resolve: function(x){
        return isObject(x) && RECORD in x && getPrototypeOf(x) === this[PROTOTYPE]
          ? x : new (getConstructor(this))(function(resolve, reject){
            resolve(x);
          });
      }
    });
  }(nextTick || setImmediate, safeSymbol('record'));
  setToStringTag(Promise, PROMISE);
  setSpecies(Promise);
  $define(GLOBAL + FORCED * !isNative(Promise), {Promise: Promise});
}(global[PROMISE]);

/******************************************************************************
 * Module : es6.collections                                                   *
 ******************************************************************************/

// ECMAScript 6 collections shim
!function(){
  var UID   = safeSymbol('uid')
    , O1    = safeSymbol('O1')
    , WEAK  = safeSymbol('weak')
    , LEAK  = safeSymbol('leak')
    , LAST  = safeSymbol('last')
    , FIRST = safeSymbol('first')
    , SIZE  = DESC ? safeSymbol('size') : 'size'
    , uid   = 0
    , tmp   = {};
  
  function getCollection(C, NAME, methods, commonMethods, isMap, isWeak){
    var ADDER = isMap ? 'set' : 'add'
      , proto = C && C[PROTOTYPE]
      , O     = {};
    function initFromIterable(that, iterable){
      if(iterable != undefined)forOf(iterable, isMap, that[ADDER], that);
      return that;
    }
    function fixSVZ(key, chain){
      var method = proto[key];
      if(framework)proto[key] = function(a, b){
        var result = method.call(this, a === 0 ? 0 : a, b);
        return chain ? this : result;
      };
    }
    if(!isNative(C) || !(isWeak || (!BUGGY_ITERATORS && has(proto, FOR_EACH) && has(proto, 'entries')))){
      // create collection constructor
      C = isWeak
        ? function(iterable){
            assertInstance(this, C, NAME);
            set(this, UID, uid++);
            initFromIterable(this, iterable);
          }
        : function(iterable){
            var that = this;
            assertInstance(that, C, NAME);
            set(that, O1, create(null));
            set(that, SIZE, 0);
            set(that, LAST, undefined);
            set(that, FIRST, undefined);
            initFromIterable(that, iterable);
          };
      assignHidden(assignHidden(C[PROTOTYPE], methods), commonMethods);
      isWeak || !DESC || defineProperty(C[PROTOTYPE], 'size', {get: function(){
        return assertDefined(this[SIZE]);
      }});
    } else {
      var Native = C
        , inst   = new C
        , chain  = inst[ADDER](isWeak ? {} : -0, 1)
        , buggyZero;
      // wrap to init collections from iterable
      if(checkDangerIterClosing(function(O){ new C(O) })){
        C = function(iterable){
          assertInstance(this, C, NAME);
          return initFromIterable(new Native, iterable);
        }
        C[PROTOTYPE] = proto;
        if(framework)proto[CONSTRUCTOR] = C;
      }
      isWeak || inst[FOR_EACH](function(val, key){
        buggyZero = 1 / key === -Infinity;
      });
      // fix converting -0 key to +0
      if(buggyZero){
        fixSVZ('delete');
        fixSVZ('has');
        isMap && fixSVZ('get');
      }
      // + fix .add & .set for chaining
      if(buggyZero || chain !== inst)fixSVZ(ADDER, true);
    }
    setToStringTag(C, NAME);
    setSpecies(C);
    
    O[NAME] = C;
    $define(GLOBAL + WRAP + FORCED * !isNative(C), O);
    
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    isWeak || defineStdIterators(C, NAME, function(iterated, kind){
      set(this, ITER, {o: iterated, k: kind});
    }, function(){
      var iter  = this[ITER]
        , kind  = iter.k
        , entry = iter.l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!iter.o || !(iter.l = entry = entry ? entry.n : iter.o[FIRST])){
        // or finish the iteration
        iter.o = undefined;
        return iterResult(1);
      }
      // return step by kind
      if(kind == KEY)  return iterResult(0, entry.k);
      if(kind == VALUE)return iterResult(0, entry.v);
                       return iterResult(0, [entry.k, entry.v]);   
    }, isMap ? KEY+VALUE : VALUE, !isMap);
    
    return C;
  }
  
  function fastKey(it, create){
    // return primitive with prefix
    if(!isObject(it))return (typeof it == 'string' ? 'S' : 'P') + it;
    // can't set id to frozen object
    if(isFrozen(it))return 'F';
    if(!has(it, UID)){
      // not necessary to add id
      if(!create)return 'E';
      // add missing object id
      hidden(it, UID, ++uid);
    // return object id with prefix
    } return 'O' + it[UID];
  }
  function getEntry(that, key){
    // fast case
    var index = fastKey(key), entry;
    if(index != 'F')return that[O1][index];
    // frozen object case
    for(entry = that[FIRST]; entry; entry = entry.n){
      if(entry.k == key)return entry;
    }
  }
  function def(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry)entry.v = value;
    // create new entry
    else {
      that[LAST] = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that[LAST],          // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that[FIRST])that[FIRST] = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index != 'F')that[O1][index] = entry;
    } return that;
  }

  var collectionMethods = {
    // 23.1.3.1 Map.prototype.clear()
    // 23.2.3.2 Set.prototype.clear()
    clear: function(){
      for(var that = this, data = that[O1], entry = that[FIRST]; entry; entry = entry.n){
        entry.r = true;
        if(entry.p)entry.p = entry.p.n = undefined;
        delete data[entry.i];
      }
      that[FIRST] = that[LAST] = undefined;
      that[SIZE] = 0;
    },
    // 23.1.3.3 Map.prototype.delete(key)
    // 23.2.3.4 Set.prototype.delete(value)
    'delete': function(key){
      var that  = this
        , entry = getEntry(that, key);
      if(entry){
        var next = entry.n
          , prev = entry.p;
        delete that[O1][entry.i];
        entry.r = true;
        if(prev)prev.n = next;
        if(next)next.p = prev;
        if(that[FIRST] == entry)that[FIRST] = next;
        if(that[LAST] == entry)that[LAST] = prev;
        that[SIZE]--;
      } return !!entry;
    },
    // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
    // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
    forEach: function(callbackfn /*, that = undefined */){
      var f = ctx(callbackfn, arguments[1], 3)
        , entry;
      while(entry = entry ? entry.n : this[FIRST]){
        f(entry.v, entry.k, this);
        // revert to the last existing entry
        while(entry && entry.r)entry = entry.p;
      }
    },
    // 23.1.3.7 Map.prototype.has(key)
    // 23.2.3.7 Set.prototype.has(value)
    has: function(key){
      return !!getEntry(this, key);
    }
  }
  
  // 23.1 Map Objects
  Map = getCollection(Map, MAP, {
    // 23.1.3.6 Map.prototype.get(key)
    get: function(key){
      var entry = getEntry(this, key);
      return entry && entry.v;
    },
    // 23.1.3.9 Map.prototype.set(key, value)
    set: function(key, value){
      return def(this, key === 0 ? 0 : key, value);
    }
  }, collectionMethods, true);
  
  // 23.2 Set Objects
  Set = getCollection(Set, SET, {
    // 23.2.3.1 Set.prototype.add(value)
    add: function(value){
      return def(this, value = value === 0 ? 0 : value, value);
    }
  }, collectionMethods);
  
  function defWeak(that, key, value){
    if(isFrozen(assertObject(key)))leakStore(that).set(key, value);
    else {
      has(key, WEAK) || hidden(key, WEAK, {});
      key[WEAK][that[UID]] = value;
    } return that;
  }
  function leakStore(that){
    return that[LEAK] || hidden(that, LEAK, new Map)[LEAK];
  }
  
  var weakMethods = {
    // 23.3.3.2 WeakMap.prototype.delete(key)
    // 23.4.3.3 WeakSet.prototype.delete(value)
    'delete': function(key){
      if(!isObject(key))return false;
      if(isFrozen(key))return leakStore(this)['delete'](key);
      return has(key, WEAK) && has(key[WEAK], this[UID]) && delete key[WEAK][this[UID]];
    },
    // 23.3.3.4 WeakMap.prototype.has(key)
    // 23.4.3.4 WeakSet.prototype.has(value)
    has: function(key){
      if(!isObject(key))return false;
      if(isFrozen(key))return leakStore(this).has(key);
      return has(key, WEAK) && has(key[WEAK], this[UID]);
    }
  };
  
  // 23.3 WeakMap Objects
  WeakMap = getCollection(WeakMap, WEAKMAP, {
    // 23.3.3.3 WeakMap.prototype.get(key)
    get: function(key){
      if(isObject(key)){
        if(isFrozen(key))return leakStore(this).get(key);
        if(has(key, WEAK))return key[WEAK][this[UID]];
      }
    },
    // 23.3.3.5 WeakMap.prototype.set(key, value)
    set: function(key, value){
      return defWeak(this, key, value);
    }
  }, weakMethods, true, true);
  
  // IE11 WeakMap frozen keys fix
  if(framework && new WeakMap().set(Object.freeze(tmp), 7).get(tmp) != 7){
    forEach.call(array('delete,has,get,set'), function(key){
      var method = WeakMap[PROTOTYPE][key];
      WeakMap[PROTOTYPE][key] = function(a, b){
        // store frozen objects on leaky map
        if(isObject(a) && isFrozen(a)){
          var result = leakStore(this)[key](a, b);
          return key == 'set' ? this : result;
        // store all the rest on native weakmap
        } return method.call(this, a, b);
      };
    });
  }
  
  // 23.4 WeakSet Objects
  WeakSet = getCollection(WeakSet, WEAKSET, {
    // 23.4.3.1 WeakSet.prototype.add(value)
    add: function(value){
      return defWeak(this, value, true);
    }
  }, weakMethods, false, true);
}();

/******************************************************************************
 * Module : es6.reflect                                                       *
 ******************************************************************************/

!function(){
  function Enumerate(iterated){
    var keys = [], key;
    for(key in iterated)keys.push(key);
    set(this, ITER, {o: iterated, a: keys, i: 0});
  }
  createIterator(Enumerate, OBJECT, function(){
    var iter = this[ITER]
      , keys = iter.a
      , key;
    do {
      if(iter.i >= keys.length)return iterResult(1);
    } while(!((key = keys[iter.i++]) in iter.o));
    return iterResult(0, key);
  });
  
  function wrap(fn){
    return function(it){
      assertObject(it);
      try {
        return fn.apply(undefined, arguments), true;
      } catch(e){
        return false;
      }
    }
  }
  
  function reflectGet(target, propertyKey/*, receiver*/){
    var receiver = arguments.length < 3 ? target : arguments[2]
      , desc = getOwnDescriptor(assertObject(target), propertyKey), proto;
    if(desc)return has(desc, 'value')
      ? desc.value
      : desc.get === undefined
        ? undefined
        : desc.get.call(receiver);
    return isObject(proto = getPrototypeOf(target))
      ? reflectGet(proto, propertyKey, receiver)
      : undefined;
  }
  function reflectSet(target, propertyKey, V/*, receiver*/){
    var receiver = arguments.length < 4 ? target : arguments[3]
      , ownDesc  = getOwnDescriptor(assertObject(target), propertyKey)
      , existingDescriptor, proto;
    if(!ownDesc){
      if(isObject(proto = getPrototypeOf(target))){
        return reflectSet(proto, propertyKey, V, receiver);
      }
      ownDesc = descriptor(0);
    }
    if(has(ownDesc, 'value')){
      if(ownDesc.writable === false || !isObject(receiver))return false;
      existingDescriptor = getOwnDescriptor(receiver, propertyKey) || descriptor(0);
      existingDescriptor.value = V;
      return defineProperty(receiver, propertyKey, existingDescriptor), true;
    }
    return ownDesc.set === undefined
      ? false
      : (ownDesc.set.call(receiver, V), true);
  }
  var isExtensible = Object.isExtensible || returnIt;
  
  var reflect = {
    // 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
    apply: ctx(call, apply, 3),
    // 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
    construct: function(target, argumentsList /*, newTarget*/){
      var proto    = assertFunction(arguments.length < 3 ? target : arguments[2])[PROTOTYPE]
        , instance = create(isObject(proto) ? proto : ObjectProto)
        , result   = apply.call(target, instance, argumentsList);
      return isObject(result) ? result : instance;
    },
    // 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
    defineProperty: wrap(defineProperty),
    // 26.1.4 Reflect.deleteProperty(target, propertyKey)
    deleteProperty: function(target, propertyKey){
      var desc = getOwnDescriptor(assertObject(target), propertyKey);
      return desc && !desc.configurable ? false : delete target[propertyKey];
    },
    // 26.1.5 Reflect.enumerate(target)
    enumerate: function(target){
      return new Enumerate(assertObject(target));
    },
    // 26.1.6 Reflect.get(target, propertyKey [, receiver])
    get: reflectGet,
    // 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
    getOwnPropertyDescriptor: function(target, propertyKey){
      return getOwnDescriptor(assertObject(target), propertyKey);
    },
    // 26.1.8 Reflect.getPrototypeOf(target)
    getPrototypeOf: function(target){
      return getPrototypeOf(assertObject(target));
    },
    // 26.1.9 Reflect.has(target, propertyKey)
    has: function(target, propertyKey){
      return propertyKey in target;
    },
    // 26.1.10 Reflect.isExtensible(target)
    isExtensible: function(target){
      return !!isExtensible(assertObject(target));
    },
    // 26.1.11 Reflect.ownKeys(target)
    ownKeys: ownKeys,
    // 26.1.12 Reflect.preventExtensions(target)
    preventExtensions: wrap(Object.preventExtensions || returnIt),
    // 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
    set: reflectSet
  }
  // 26.1.14 Reflect.setPrototypeOf(target, proto)
  if(setPrototypeOf)reflect.setPrototypeOf = function(target, proto){
    return setPrototypeOf(assertObject(target), proto), true;
  };
  
  $define(GLOBAL, {Reflect: {}});
  $define(STATIC, 'Reflect', reflect);
}();

/******************************************************************************
 * Module : es7.proposals                                                     *
 ******************************************************************************/

!function(){
  $define(PROTO, ARRAY, {
    // https://github.com/domenic/Array.prototype.includes
    includes: createArrayContains(true)
  });
  $define(PROTO, STRING, {
    // https://github.com/mathiasbynens/String.prototype.at
    at: createPointAt(true)
  });
  
  function createObjectToArray(isEntries){
    return function(object){
      var O      = toObject(object)
        , keys   = getKeys(object)
        , length = keys.length
        , i      = 0
        , result = Array(length)
        , key;
      if(isEntries)while(length > i)result[i] = [key = keys[i++], O[key]];
      else while(length > i)result[i] = O[keys[i++]];
      return result;
    }
  }
  $define(STATIC, OBJECT, {
    // https://gist.github.com/WebReflection/9353781
    getOwnPropertyDescriptors: function(object){
      var O      = toObject(object)
        , result = {};
      forEach.call(ownKeys(O), function(key){
        defineProperty(result, key, descriptor(0, getOwnDescriptor(O, key)));
      });
      return result;
    },
    // https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-04/apr-9.md#51-objectentries-objectvalues
    values:  createObjectToArray(false),
    entries: createObjectToArray(true)
  });
  $define(STATIC, REGEXP, {
    // https://gist.github.com/kangax/9698100
    escape: createReplacer(/([\\\-[\]{}()*+?.,^$|])/g, '\\$1', true)
  });
}();

/******************************************************************************
 * Module : es7.abstract-refs                                                 *
 ******************************************************************************/

// https://github.com/zenparsing/es-abstract-refs
!function(REFERENCE){
  REFERENCE_GET = getWellKnownSymbol(REFERENCE+'Get', true);
  var REFERENCE_SET = getWellKnownSymbol(REFERENCE+SET, true)
    , REFERENCE_DELETE = getWellKnownSymbol(REFERENCE+'Delete', true);
  
  $define(STATIC, SYMBOL, {
    referenceGet: REFERENCE_GET,
    referenceSet: REFERENCE_SET,
    referenceDelete: REFERENCE_DELETE
  });
  
  hidden(FunctionProto, REFERENCE_GET, returnThis);
  
  function setMapMethods(Constructor){
    if(Constructor){
      var MapProto = Constructor[PROTOTYPE];
      hidden(MapProto, REFERENCE_GET, MapProto.get);
      hidden(MapProto, REFERENCE_SET, MapProto.set);
      hidden(MapProto, REFERENCE_DELETE, MapProto['delete']);
    }
  }
  setMapMethods(Map);
  setMapMethods(WeakMap);
}('reference');

/******************************************************************************
 * Module : core.dict                                                         *
 ******************************************************************************/

!function(DICT){
  Dict = function(iterable){
    var dict = create(null);
    if(iterable != undefined){
      if(isIterable(iterable)){
        forOf(iterable, true, function(key, value){
          dict[key] = value;
        });
      } else assign(dict, iterable);
    }
    return dict;
  }
  Dict[PROTOTYPE] = null;
  
  function DictIterator(iterated, kind){
    set(this, ITER, {o: toObject(iterated), a: getKeys(iterated), i: 0, k: kind});
  }
  createIterator(DictIterator, DICT, function(){
    var iter = this[ITER]
      , O    = iter.o
      , keys = iter.a
      , kind = iter.k
      , key;
    do {
      if(iter.i >= keys.length){
        iter.o = undefined;
        return iterResult(1);
      }
    } while(!has(O, key = keys[iter.i++]));
    if(kind == KEY)  return iterResult(0, key);
    if(kind == VALUE)return iterResult(0, O[key]);
                     return iterResult(0, [key, O[key]]);
  });
  function createDictIter(kind){
    return function(it){
      return new DictIterator(it, kind);
    }
  }
  
  /*
   * 0 -> forEach
   * 1 -> map
   * 2 -> filter
   * 3 -> some
   * 4 -> every
   * 5 -> find
   * 6 -> findKey
   * 7 -> mapPairs
   */
  function createDictMethod(type){
    var isMap    = type == 1
      , isEvery  = type == 4;
    return function(object, callbackfn, that /* = undefined */){
      var f      = ctx(callbackfn, that, 3)
        , O      = toObject(object)
        , result = isMap || type == 7 || type == 2 ? new (generic(this, Dict)) : undefined
        , key, val, res;
      for(key in O)if(has(O, key)){
        val = O[key];
        res = f(val, key, object);
        if(type){
          if(isMap)result[key] = res;             // map
          else if(res)switch(type){
            case 2: result[key] = val; break      // filter
            case 3: return true;                  // some
            case 5: return val;                   // find
            case 6: return key;                   // findKey
            case 7: result[res[0]] = res[1];      // mapPairs
          } else if(isEvery)return false;         // every
        }
      }
      return type == 3 || isEvery ? isEvery : result;
    }
  }
  function createDictReduce(isTurn){
    return function(object, mapfn, init){
      assertFunction(mapfn);
      var O      = toObject(object)
        , keys   = getKeys(O)
        , length = keys.length
        , i      = 0
        , memo, key, result;
      if(isTurn)memo = init == undefined ? new (generic(this, Dict)) : Object(init);
      else if(arguments.length < 3){
        assert(length, REDUCE_ERROR);
        memo = O[keys[i++]];
      } else memo = Object(init);
      while(length > i)if(has(O, key = keys[i++])){
        result = mapfn(memo, O[key], key, object);
        if(isTurn){
          if(result === false)break;
        } else memo = result;
      }
      return memo;
    }
  }
  var findKey = createDictMethod(6);
  function includes(object, el){
    return (el == el ? keyOf(object, el) : findKey(object, sameNaN)) !== undefined;
  }
  
  var dictMethods = {
    keys:    createDictIter(KEY),
    values:  createDictIter(VALUE),
    entries: createDictIter(KEY+VALUE),
    forEach: createDictMethod(0),
    map:     createDictMethod(1),
    filter:  createDictMethod(2),
    some:    createDictMethod(3),
    every:   createDictMethod(4),
    find:    createDictMethod(5),
    findKey: findKey,
    mapPairs:createDictMethod(7),
    reduce:  createDictReduce(false),
    turn:    createDictReduce(true),
    keyOf:   keyOf,
    includes:includes,
    // Has / get / set own property
    has: has,
    get: get,
    set: createDefiner(0),
    isDict: function(it){
      return isObject(it) && getPrototypeOf(it) === Dict[PROTOTYPE];
    }
  };
  
  if(REFERENCE_GET)for(var key in dictMethods)!function(fn){
    function method(){
      for(var args = [this], i = 0; i < arguments.length;)args.push(arguments[i++]);
      return invoke(fn, args);
    }
    fn[REFERENCE_GET] = function(){
      return method;
    }
  }(dictMethods[key]);
  
  $define(GLOBAL + FORCED, {Dict: assignHidden(Dict, dictMethods)});
}('Dict');

/******************************************************************************
 * Module : core.$for                                                         *
 ******************************************************************************/

!function(ENTRIES, FN){  
  function $for(iterable, entries){
    if(!(this instanceof $for))return new $for(iterable, entries);
    this[ITER]    = getIterator(iterable);
    this[ENTRIES] = !!entries;
  }
  
  createIterator($for, 'Wrapper', function(){
    return this[ITER].next();
  });
  var $forProto = $for[PROTOTYPE];
  setIterator($forProto, function(){
    return this[ITER]; // unwrap
  });
  
  function createChainIterator(next){
    function Iter(I, fn, that){
      this[ITER]    = getIterator(I);
      this[ENTRIES] = I[ENTRIES];
      this[FN]      = ctx(fn, that, I[ENTRIES] ? 2 : 1);
    }
    createIterator(Iter, 'Chain', next, $forProto);
    setIterator(Iter[PROTOTYPE], returnThis); // override $forProto iterator
    return Iter;
  }
  
  var MapIter = createChainIterator(function(){
    var step = this[ITER].next();
    return step.done ? step : iterResult(0, stepCall(this[FN], step.value, this[ENTRIES]));
  });
  
  var FilterIter = createChainIterator(function(){
    for(;;){
      var step = this[ITER].next();
      if(step.done || stepCall(this[FN], step.value, this[ENTRIES]))return step;
    }
  });
  
  assignHidden($forProto, {
    of: function(fn, that){
      forOf(this, this[ENTRIES], fn, that);
    },
    array: function(fn, that){
      var result = [];
      forOf(fn != undefined ? this.map(fn, that) : this, false, push, result);
      return result;
    },
    filter: function(fn, that){
      return new FilterIter(this, fn, that);
    },
    map: function(fn, that){
      return new MapIter(this, fn, that);
    }
  });
  
  $for.isIterable  = isIterable;
  $for.getIterator = getIterator;
  
  $define(GLOBAL + FORCED, {$for: $for});
}('entries', safeSymbol('fn'));

/******************************************************************************
 * Module : core.delay                                                        *
 ******************************************************************************/

// https://esdiscuss.org/topic/promise-returning-delay-function
$define(GLOBAL + FORCED, {
  delay: function(time){
    return new Promise(function(resolve){
      setTimeout(resolve, time, true);
    });
  }
});

/******************************************************************************
 * Module : core.binding                                                      *
 ******************************************************************************/

!function(_, toLocaleString){
  // Placeholder
  core._ = path._ = path._ || {};

  $define(PROTO + FORCED, FUNCTION, {
    part: part,
    only: function(numberArguments, that /* = @ */){
      var fn     = assertFunction(this)
        , n      = toLength(numberArguments)
        , isThat = arguments.length > 1;
      return function(/* ...args */){
        var length = min(n, arguments.length)
          , args   = Array(length)
          , i      = 0;
        while(length > i)args[i] = arguments[i++];
        return invoke(fn, args, isThat ? that : this);
      }
    }
  });
  
  function tie(key){
    var that  = this
      , bound = {};
    return hidden(that, _, function(key){
      if(key === undefined || !(key in that))return toLocaleString.call(that);
      return has(bound, key) ? bound[key] : (bound[key] = ctx(that[key], that, -1));
    })[_](key);
  }
  
  hidden(path._, TO_STRING, function(){
    return _;
  });
  
  hidden(ObjectProto, _, tie);
  DESC || hidden(ArrayProto, _, tie);
  // IE8- dirty hack - redefined toLocaleString is not enumerable
}(DESC ? uid('tie') : TO_LOCALE, ObjectProto[TO_LOCALE]);

/******************************************************************************
 * Module : core.object                                                       *
 ******************************************************************************/

!function(){
  function define(target, mixin){
    var keys   = ownKeys(toObject(mixin))
      , length = keys.length
      , i = 0, key;
    while(length > i)defineProperty(target, key = keys[i++], getOwnDescriptor(mixin, key));
    return target;
  };
  $define(STATIC + FORCED, OBJECT, {
    isObject: isObject,
    classof: classof,
    define: define,
    make: function(proto, mixin){
      return define(create(proto), mixin);
    }
  });
}();

/******************************************************************************
 * Module : core.array                                                        *
 ******************************************************************************/

$define(PROTO + FORCED, ARRAY, {
  turn: function(fn, target /* = [] */){
    assertFunction(fn);
    var memo   = target == undefined ? [] : Object(target)
      , O      = ES5Object(this)
      , length = toLength(O.length)
      , index  = 0;
    while(length > index)if(fn(memo, O[index], index++, this) === false)break;
    return memo;
  }
});
if(framework)ArrayUnscopables.turn = true;

/******************************************************************************
 * Module : core.number                                                       *
 ******************************************************************************/

!function(numberMethods){  
  function NumberIterator(iterated){
    set(this, ITER, {l: toLength(iterated), i: 0});
  }
  createIterator(NumberIterator, NUMBER, function(){
    var iter = this[ITER]
      , i    = iter.i++;
    return i < iter.l ? iterResult(0, i) : iterResult(1);
  });
  defineIterator(Number, NUMBER, function(){
    return new NumberIterator(this);
  });
  
  numberMethods.random = function(lim /* = 0 */){
    var a = +this
      , b = lim == undefined ? 0 : +lim
      , m = min(a, b);
    return random() * (max(a, b) - m) + m;
  };

  forEach.call(array(
      // ES3:
      'round,floor,ceil,abs,sin,asin,cos,acos,tan,atan,exp,sqrt,max,min,pow,atan2,' +
      // ES6:
      'acosh,asinh,atanh,cbrt,clz32,cosh,expm1,hypot,imul,log1p,log10,log2,sign,sinh,tanh,trunc'
    ), function(key){
      var fn = Math[key];
      if(fn)numberMethods[key] = function(/* ...args */){
        // ie9- dont support strict mode & convert `this` to object -> convert it to number
        var args = [+this]
          , i    = 0;
        while(arguments.length > i)args.push(arguments[i++]);
        return invoke(fn, args);
      }
    }
  );
  
  $define(PROTO + FORCED, NUMBER, numberMethods);
}({});

/******************************************************************************
 * Module : core.string                                                       *
 ******************************************************************************/

!function(){
  var escapeHTMLDict = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  }, unescapeHTMLDict = {}, key;
  for(key in escapeHTMLDict)unescapeHTMLDict[escapeHTMLDict[key]] = key;
  $define(PROTO + FORCED, STRING, {
    escapeHTML:   createReplacer(/[&<>"']/g, escapeHTMLDict),
    unescapeHTML: createReplacer(/&(?:amp|lt|gt|quot|apos);/g, unescapeHTMLDict)
  });
}();

/******************************************************************************
 * Module : core.date                                                         *
 ******************************************************************************/

!function(formatRegExp, flexioRegExp, locales, current, SECONDS, MINUTES, HOURS, MONTH, YEAR){
  function createFormat(prefix){
    return function(template, locale /* = current */){
      var that = this
        , dict = locales[has(locales, locale) ? locale : current];
      function get(unit){
        return that[prefix + unit]();
      }
      return String(template).replace(formatRegExp, function(part){
        switch(part){
          case 's'  : return get(SECONDS);                  // Seconds : 0-59
          case 'ss' : return lz(get(SECONDS));              // Seconds : 00-59
          case 'm'  : return get(MINUTES);                  // Minutes : 0-59
          case 'mm' : return lz(get(MINUTES));              // Minutes : 00-59
          case 'h'  : return get(HOURS);                    // Hours   : 0-23
          case 'hh' : return lz(get(HOURS));                // Hours   : 00-23
          case 'D'  : return get(DATE);                     // Date    : 1-31
          case 'DD' : return lz(get(DATE));                 // Date    : 01-31
          case 'W'  : return dict[0][get('Day')];           // Day     : Понедельник
          case 'N'  : return get(MONTH) + 1;                // Month   : 1-12
          case 'NN' : return lz(get(MONTH) + 1);            // Month   : 01-12
          case 'M'  : return dict[2][get(MONTH)];           // Month   : Январь
          case 'MM' : return dict[1][get(MONTH)];           // Month   : Января
          case 'Y'  : return get(YEAR);                     // Year    : 2014
          case 'YY' : return lz(get(YEAR) % 100);           // Year    : 14
        } return part;
      });
    }
  }
  function addLocale(lang, locale){
    function split(index){
      var result = [];
      forEach.call(array(locale.months), function(it){
        result.push(it.replace(flexioRegExp, '$' + index));
      });
      return result;
    }
    locales[lang] = [array(locale.weekdays), split(1), split(2)];
    return core;
  }
  $define(PROTO + FORCED, DATE, {
    format:    createFormat('get'),
    formatUTC: createFormat('getUTC')
  });
  addLocale(current, {
    weekdays: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
    months: 'January,February,March,April,May,June,July,August,September,October,November,December'
  });
  addLocale('ru', {
    weekdays: 'Воскресенье,Понедельник,Вторник,Среда,Четверг,Пятница,Суббота',
    months: 'Январ:я|ь,Феврал:я|ь,Март:а|,Апрел:я|ь,Ма:я|й,Июн:я|ь,' +
            'Июл:я|ь,Август:а|,Сентябр:я|ь,Октябр:я|ь,Ноябр:я|ь,Декабр:я|ь'
  });
  core.locale = function(locale){
    return has(locales, locale) ? current = locale : current;
  };
  core.addLocale = addLocale;
}(/\b\w\w?\b/g, /:(.*)\|(.*)$/, {}, 'en', 'Seconds', 'Minutes', 'Hours', 'Month', 'FullYear');

/******************************************************************************
 * Module : core.global                                                       *
 ******************************************************************************/

$define(GLOBAL + FORCED, {global: global});

/******************************************************************************
 * Module : js.array.statics                                                  *
 ******************************************************************************/

// JavaScript 1.6 / Strawman array statics shim
!function(arrayStatics){
  function setArrayStatics(keys, length){
    forEach.call(array(keys), function(key){
      if(key in ArrayProto)arrayStatics[key] = ctx(call, ArrayProto[key], length);
    });
  }
  setArrayStatics('pop,reverse,shift,keys,values,entries', 1);
  setArrayStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
  setArrayStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
                  'reduce,reduceRight,copyWithin,fill,turn');
  $define(STATIC, ARRAY, arrayStatics);
}({});

/******************************************************************************
 * Module : web.dom.itarable                                                  *
 ******************************************************************************/

!function(NodeList){
  if(framework && NodeList && !(SYMBOL_ITERATOR in NodeList[PROTOTYPE])){
    hidden(NodeList[PROTOTYPE], SYMBOL_ITERATOR, Iterators[ARRAY]);
  }
  Iterators.NodeList = Iterators[ARRAY];
}(global.NodeList);

/******************************************************************************
 * Module : core.log                                                          *
 ******************************************************************************/

!function(log, enabled){
  // Methods from https://github.com/DeveloperToolsWG/console-object/blob/master/api.md
  forEach.call(array('assert,clear,count,debug,dir,dirxml,error,exception,' +
      'group,groupCollapsed,groupEnd,info,isIndependentlyComposed,log,' +
      'markTimeline,profile,profileEnd,table,time,timeEnd,timeline,' +
      'timelineEnd,timeStamp,trace,warn'), function(key){
    log[key] = function(){
      if(enabled && key in console)return apply.call(console[key], console, arguments);
    };
  });
  $define(GLOBAL + FORCED, {log: assign(log.log, log, {
    enable: function(){
      enabled = true;
    },
    disable: function(){
      enabled = false;
    }
  })});
}({}, true);
}(typeof self != 'undefined' && self.Math === Math ? self : Function('return this')(), false);
module.exports = { "default": module.exports, __esModule: true };

},{}],12:[function(require,module,exports){
(function (global){
"use strict";

var _core = require("babel-runtime/core-js")["default"];

var helpers = exports["default"] = {};
exports.__esModule = true;

helpers.inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) subClass.__proto__ = superClass;
};

helpers.defaults = function (obj, defaults) {
  var keys = _core.Object.getOwnPropertyNames(defaults);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];

    var value = _core.Object.getOwnPropertyDescriptor(defaults, key);

    if (value && value.configurable && obj[key] === undefined) {
      Object.defineProperty(obj, key, value);
    }
  }

  return obj;
};

helpers.prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

helpers.applyConstructor = function (Constructor, args) {
  var instance = Object.create(Constructor.prototype);
  var result = Constructor.apply(instance, args);
  return result != null && (typeof result == "object" || typeof result == "function") ? result : instance;
};

helpers.taggedTemplateLiteral = function (strings, raw) {
  return _core.Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: _core.Object.freeze(raw)
    }
  }));
};

helpers.taggedTemplateLiteralLoose = function (strings, raw) {
  strings.raw = raw;
  return strings;
};

helpers.interopRequire = function (obj) {
  return obj && obj.__esModule ? obj["default"] : obj;
};

helpers.toArray = function (arr) {
  return Array.isArray(arr) ? arr : _core.Array.from(arr);
};

helpers.toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return _core.Array.from(arr);
  }
};

helpers.slicedToArray = function (arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else if (_core.$for.isIterable(Object(arr))) {
    var _arr = [];

    for (var _iterator = _core.$for.getIterator(arr), _step; !(_step = _iterator.next()).done;) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  } else {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }
};

helpers.objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

helpers.hasOwn = Object.prototype.hasOwnProperty;
helpers.slice = Array.prototype.slice;
helpers.bind = Function.prototype.bind;

helpers.defineProperty = function (obj, key, value) {
  return Object.defineProperty(obj, key, {
    value: value,
    enumerable: true,
    configurable: true,
    writable: true
  });
};

helpers.asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _core.Promise(function (resolve, reject) {
      var callNext = step.bind(null, "next");
      var callThrow = step.bind(null, "throw");

      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          _core.Promise.resolve(value).then(callNext, callThrow);
        }
      }

      callNext();
    });
  };
};

helpers.interopRequireWildcard = function (obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
};

helpers._typeof = function (obj) {
  return obj && obj.constructor === _core.Symbol ? "symbol" : typeof obj;
};

helpers._extends = _core.Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

helpers.get = function get(_x, _x2, _x3) {
  var _again = true;

  _function: while (_again) {
    _again = false;
    var object = _x,
        property = _x2,
        receiver = _x3;
    desc = parent = getter = undefined;

    var desc = _core.Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = _core.Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        _x = parent;
        _x2 = property;
        _x3 = receiver;
        _again = true;
        continue _function;
      }
    } else if ("value" in desc && desc.writable) {
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

helpers.set = function set(_x, _x2, _x3, _x4) {
  var _again = true;

  _function: while (_again) {
    _again = false;
    var object = _x,
        property = _x2,
        value = _x3,
        receiver = _x4;
    desc = parent = setter = undefined;

    var desc = _core.Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = _core.Object.getPrototypeOf(object);

      if (parent !== null) {
        _x = parent;
        _x2 = property;
        _x3 = value;
        _x4 = receiver;
        _again = true;
        continue _function;
      }
    } else if ("value" in desc && desc.writable) {
      return desc.value = value;
    } else {
      var setter = desc.set;

      if (setter !== undefined) {
        return setter.call(receiver, value);
      }
    }
  }
};

helpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

helpers.objectDestructuringEmpty = function (obj) {
  if (obj == null) throw new TypeError("Cannot destructure undefined");
};

helpers.temporalUndefined = {};

helpers.temporalAssertDefined = function (val, name, undef) {
  if (val === undef) {
    throw new ReferenceError(name + " is not defined - temporal dead zone");
  }

  return true;
};

helpers.selfGlobal = typeof global === "undefined" ? self : global;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"babel-runtime/core-js":11}],13:[function(require,module,exports){

},{}],14:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3YXZlcy1sZm8uanMiLCJlczYvc291cmNlcy9wcm9jZXNzLXdvcmtlci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7SUNYTSxJQUFJO0FBRUcsV0FGUCxJQUFJLENBRUksS0FBSyxFQUFFLEdBQUc7dUNBRmxCLElBQUk7O0FBR04sUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsUUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztHQUNqQjs7b0NBTkcsSUFBSTtBQVFSLFFBQUk7YUFBQSxjQUFDLElBQUksRUFBMkI7WUFBekIsT0FBTyxnQ0FBRyxFQUFFO1lBQUUsRUFBRSxnQ0FBRyxJQUFJOztBQUNoQyxZQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEIsWUFBSSxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFekMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEIsWUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFB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TUFBSSxNQUFNLEdBQUcsQ0FBRyxJQUFLLEFBQUMsQ0FBQyxHQUFDLENBQUcsR0FBSSxDQUFDLENBQUMsR0FBQyxDQUFHLENBQUEsR0FBSSxDQUFDLEdBQUcsYUFBYSxDQUFBLEFBQUMsQ0FBQzs7QUFFNUQsT0FBSyxDQUFDLEVBQUUsR0FBRyxBQUFDLENBQUMsQ0FBRyxJQUFTLEFBQUMsQ0FBQyxHQUFDLENBQUcsR0FBSSxDQUFDLENBQUMsR0FBQyxDQUFHLENBQUEsR0FBSSxDQUFDLENBQUEsQUFBaUIsR0FBSyxNQUFNLENBQUM7QUFDM0UsT0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFjLEFBQUMsQ0FBQyxHQUFDLENBQUcsR0FBSSxDQUFDLENBQUMsR0FBQyxDQUFHLENBQUEsR0FBSSxDQUFDLEdBQUcsYUFBYSxDQUFBLEdBQU0sTUFBTSxDQUFDOztBQUUzRSxPQUFLLENBQUMsRUFBRSxHQUFHLEFBQVEsQ0FBQyxJQUFLLEFBQUMsQ0FBQyxHQUFDLENBQUcsR0FBSSxDQUFDLENBQUMsR0FBQyxDQUFHLENBQUEsR0FBSSxDQUFDLEdBQUcsYUFBYSxDQUFBLEFBQUMsR0FBSyxNQUFNLENBQUM7QUFDM0UsT0FBSyxDQUFDLEVBQUUsR0FBRyxBQUFFLENBQUcsR0FBRyxDQUFDLElBQUssQUFBQyxDQUFDLEdBQUMsQ0FBRyxHQUFJLENBQUMsQ0FBQyxHQUFDLENBQUcsQ0FBQSxHQUFJLENBQUMsQ0FBQSxBQUFpQixHQUFLLE1BQU0sQ0FBQztBQUMzRSxPQUFLLENBQUMsRUFBRSxHQUFHLEFBQVEsQ0FBQyxJQUFLLEFBQUMsQ0FBQyxHQUFDLENBQUcsR0FBSSxDQUFDLENBQUMsR0FBQyxDQUFHLENBQUEsR0FBSSxDQUFDLEdBQUcsYUFBYSxDQUFBLEFBQUMsR0FBSyxNQUFNLENBQUM7Q0FFNUU7Ozs7O0FBS0gsU0FBUyxlQUFlLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFOztBQUV6QyxNQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRW5CLE1B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QVUsQ0FBQztPQUMvQjs7Ozs7O1NBbkZHLE1BQU07OztBQXNGWixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQzs7O0FDeEZ4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDcHlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzlRQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIGNvcmVcbiAgZ3JhcGg6IHJlcXVpcmUoJy4vZGlzdC9jb3JlL2dyYXBoJyksXG4gIGxmb0Jhc2U6IHJlcXVpcmUoJy4vZGlzdC9jb3JlL2xmby1iYXNlJyksXG4gIC8vIHNvdXJjZXNcbiAgc291cmNlQXVkaW9Ob2RlOiByZXF1aXJlKCcuL2Rpc3Qvc291cmNlcy9hdWRpby1pbi1ub2RlJyksXG4gIHNvdXJjZUF1ZGlvQnVmZmVyOiByZXF1aXJlKCcuL2Rpc3Qvc291cmNlcy9hdWRpby1pbi1idWZmZXInKSxcbiAgLy8gc2lua1xuICBzaW5rRHJhdzogcmVxdWlyZSgnLi9kaXN0L3NpbmsvZHJhdycpLFxuICAvLyBvcGVyYXRvcnNcbiAgbWFnbml0dWRlOiByZXF1aXJlKCcuL2Rpc3Qvb3BlcmF0b3JzL21hZ25pdHVkZScpLFxuICBiaXF1YWQ6IHJlcXVpcmUoJy4vZGlzdC9vcGVyYXRvcnMvYmlxdWFkJylcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuY2xhc3MgRnJhbWVyIHtcbiAgY29uc3RydWN0b3Iob3V0RnJhbWUsIGhvcFNpemUsIHNhbXBsZVJhdGUsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fb3V0RnJhbWUgPSBvdXRGcmFtZTtcbiAgICB0aGlzLl9ob3BTaXplID0gaG9wU2l6ZTtcbiAgICB0aGlzLl9zYW1wbGVQZXJpb2QgPSAxIC8gc2FtcGxlUmF0ZTtcbiAgICB0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xuXG4gICAgdGhpcy5fZnJhbWVJbmRleCA9IDA7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLl9mcmFtZUluZGV4ID0gMDtcbiAgfVxuXG4gIGZpbmFsaXplKHRpbWUpIHtcbiAgICB2YXIgZnJhbWVJbmRleCA9IHRoaXMuX2ZyYW1lSW5kZXg7XG4gICAgdmFyIGZyYW1lU2l6ZSA9IHRoaXMuX2ZyYW1lSW5kZXg7XG4gICAgdmFyIG91dEZyYW1lID0gdGhpcy5fb3V0RnJhbWU7XG5cbiAgICBpZiAoZnJhbWVJbmRleCA+IDApIHtcbiAgICAgIC8vIHplcm8gcGFkIGZyYW1lXG4gICAgICBvdXRGcmFtZS5maWxsKDAsIGZyYW1lSW5kZXgpO1xuXG4gICAgICAvLyBvdXRwdXQgemVybyBwYWRkZWQgZnJhbWVcbiAgICAgIHZhciBmcmFtZVRpbWUgPSB0aW1lICsgKGZyYW1lU2l6ZSAvIDIgKyBmcmFtZUluZGV4KSAqIHRoaXMuX3NhbXBsZVBlcmlvZDsgLy8gZnJhbWVTaXplIC8gMiAtIGZyYW1lSW5kZXggLSBmcmFtZVNpemUgLyAyKVxuICAgICAgdGhpcy5fY2FsbGJhY2soZnJhbWVUaW1lLCBvdXRGcmFtZSk7XG4gICAgfVxuICB9XG5cbiAgaW5wdXQodGltZSwgYmxvY2spIHtcbiAgICB2YXIgZnJhbWVJbmRleCA9IHRoaXMuX2ZyYW1lSW5kZXg7XG4gICAgdmFyIGZyYW1lU2l6ZSA9IHRoaXMuX291dEZyYW1lLmxlbmd0aDtcbiAgICB2YXIgYmxvY2tTaXplID0gYmxvY2subGVuZ3RoO1xuICAgIHZhciBibG9ja0luZGV4ID0gMDtcblxuICAgIC8vIGNvbnN1bWUgYmxvY2tcbiAgICB3aGlsZSAoYmxvY2tJbmRleCA8IGJsb2NrU2l6ZSkge1xuICAgICAgdmFyIG51bVNraXAgPSAwO1xuXG4gICAgICAvLyBza2lwIGJsb2NrIHNhbXBsZXMgZm9yIG5lZ2F0aXZlIGZyYW1lSW5kZXhcbiAgICAgIGlmIChmcmFtZUluZGV4IDwgMClcbiAgICAgICAgbnVtU2tpcCA9IC1mcmFtZUluZGV4O1xuXG4gICAgICBpZiAobnVtU2tpcCA8IGJsb2NrU2l6ZSkge1xuICAgICAgICBibG9ja0luZGV4ICs9IG51bVNraXA7IC8vIHNraXAgYmxvY2sgc2VnbWVudFxuXG4gICAgICAgIHZhciBudW1Db3B5ID0gYmxvY2tTaXplIC0gYmxvY2tJbmRleDsgLy8gY2FuIGNvcHkgYWxsIHRoZSByZXN0IG9mIHRlaCBpbmNvbWluZyBibG9ja1xuICAgICAgICB2YXIgbWF4Q29weSA9IGZyYW1lU2l6ZSAtIGZyYW1lSW5kZXg7IC8vIGNvbm5vdCBjb3B5IG1vcmUgdGhhbiB3aGF0IGZpdHMgaW50byB0aGUgZnJhbWVcblxuICAgICAgICBpZiAobnVtQ29weSA+PSBtYXhDb3B5KVxuICAgICAgICAgIG51bUNvcHkgPSBtYXhDb3B5O1xuXG4gICAgICAgIC8vIGNvcHkgYmxvY2sgc2VnbWVudCBpbnRvIGZyYW1lXG4gICAgICAgIHZhciBjb3B5ID0gYmxvY2suc3ViYXJyYXkoYmxvY2tJbmRleCwgYmxvY2tJbmRleCArIG51bUNvcHkpO1xuICAgICAgICB0aGlzLl9vdXRGcmFtZS5zZXQoY29weSwgZnJhbWVJbmRleCk7XG5cbiAgICAgICAgLy8gYWR2YW5jZSBibG9jayBhbmQgZnJhbWUgaW5kZXhcbiAgICAgICAgYmxvY2tJbmRleCArPSBudW1Db3B5O1xuICAgICAgICBmcmFtZUluZGV4ICs9IG51bUNvcHk7XG5cbiAgICAgICAgLy8gc2VuZCBmcmFtZSB3aGVuIGNvbXBsZXRlZFxuICAgICAgICBpZiAoZnJhbWVJbmRleCA9PT0gZnJhbWVTaXplKSB7XG4gICAgICAgICAgdmFyIG91dEZyYW1lID0gdGhpcy5fb3V0RnJhbWU7XG5cbiAgICAgICAgICAvLyBvdXRwdXQgY29tcGxldGUgZnJhbWVcbiAgICAgICAgICB2YXIgZnJhbWVUaW1lID0gdGltZSArIChibG9ja0luZGV4IC0gZnJhbWVTaXplIC8gMikgKiB0aGlzLl9zYW1wbGVQZXJpb2Q7XG4gICAgICAgICAgdGhpcy5fY2FsbGJhY2soZnJhbWVUaW1lLCBvdXRGcmFtZSk7XG5cbiAgICAgICAgICAvLyBzaGlmdCBmcmFtZSBsZWZ0XG4gICAgICAgICAgaWYgKHRoaXMuX2hvcFNpemUgPCBmcmFtZVNpemUpXG4gICAgICAgICAgICBvdXRGcmFtZS5zZXQob3V0RnJhbWUuc3ViYXJyYXkodGhpcy5faG9wU2l6ZSwgZnJhbWVTaXplKSwgMCk7XG5cbiAgICAgICAgICBmcmFtZUluZGV4IC09IHRoaXMuX2hvcFNpemU7IC8vIGhvcCBmb3J3YXJkXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHNraXAgZW50aXJlIGJsb2NrXG4gICAgICAgIHZhciBibG9ja1Jlc3QgPSBibG9ja1NpemUgLSBibG9ja0luZGV4O1xuICAgICAgICBmcmFtZUluZGV4ICs9IGJsb2NrUmVzdDtcbiAgICAgICAgYmxvY2tJbmRleCArPSBibG9ja1Jlc3Q7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fZnJhbWVJbmRleCA9IGZyYW1lSW5kZXg7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGcmFtZXI7XG4iLCIvKipcbiAqIENvcmUuanMgMC42LjFcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzXG4gKiBMaWNlbnNlOiBodHRwOi8vcm9jay5taXQtbGljZW5zZS5vcmdcbiAqIMKpIDIwMTUgRGVuaXMgUHVzaGthcmV2XG4gKi9cbiFmdW5jdGlvbihnbG9iYWwsIGZyYW1ld29yaywgdW5kZWZpbmVkKXtcbid1c2Ugc3RyaWN0JztcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29tbW9uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAvLyBTaG9ydGN1dHMgZm9yIFtbQ2xhc3NdXSAmIHByb3BlcnR5IG5hbWVzXHJcbnZhciBPQkpFQ1QgICAgICAgICAgPSAnT2JqZWN0J1xyXG4gICwgRlVOQ1RJT04gICAgICAgID0gJ0Z1bmN0aW9uJ1xyXG4gICwgQVJSQVkgICAgICAgICAgID0gJ0FycmF5J1xyXG4gICwgU1RSSU5HICAgICAgICAgID0gJ1N0cmluZydcclxuICAsIE5VTUJFUiAgICAgICAgICA9ICdOdW1iZXInXHJcbiAgLCBSRUdFWFAgICAgICAgICAgPSAnUmVnRXhwJ1xyXG4gICwgREFURSAgICAgICAgICAgID0gJ0RhdGUnXHJcbiAgLCBNQVAgICAgICAgICAgICAgPSAnTWFwJ1xyXG4gICwgU0VUICAgICAgICAgICAgID0gJ1NldCdcclxuICAsIFdFQUtNQVAgICAgICAgICA9ICdXZWFrTWFwJ1xyXG4gICwgV0VBS1NFVCAgICAgICAgID0gJ1dlYWtTZXQnXHJcbiAgLCBTWU1CT0wgICAgICAgICAgPSAnU3ltYm9sJ1xyXG4gICwgUFJPTUlTRSAgICAgICAgID0gJ1Byb21pc2UnXHJcbiAgLCBNQVRIICAgICAgICAgICAgPSAnTWF0aCdcclxuICAsIEFSR1VNRU5UUyAgICAgICA9ICdBcmd1bWVudHMnXHJcbiAgLCBQUk9UT1RZUEUgICAgICAgPSAncHJvdG90eXBlJ1xyXG4gICwgQ09OU1RSVUNUT1IgICAgID0gJ2NvbnN0cnVjdG9yJ1xyXG4gICwgVE9fU1RSSU5HICAgICAgID0gJ3RvU3RyaW5nJ1xyXG4gICwgVE9fU1RSSU5HX1RBRyAgID0gVE9fU1RSSU5HICsgJ1RhZydcclxuICAsIFRPX0xPQ0FMRSAgICAgICA9ICd0b0xvY2FsZVN0cmluZydcclxuICAsIEhBU19PV04gICAgICAgICA9ICdoYXNPd25Qcm9wZXJ0eSdcclxuICAsIEZPUl9FQUNIICAgICAgICA9ICdmb3JFYWNoJ1xyXG4gICwgSVRFUkFUT1IgICAgICAgID0gJ2l0ZXJhdG9yJ1xyXG4gICwgRkZfSVRFUkFUT1IgICAgID0gJ0BAJyArIElURVJBVE9SXHJcbiAgLCBQUk9DRVNTICAgICAgICAgPSAncHJvY2VzcydcclxuICAsIENSRUFURV9FTEVNRU5UICA9ICdjcmVhdGVFbGVtZW50J1xyXG4gIC8vIEFsaWFzZXMgZ2xvYmFsIG9iamVjdHMgYW5kIHByb3RvdHlwZXNcclxuICAsIEZ1bmN0aW9uICAgICAgICA9IGdsb2JhbFtGVU5DVElPTl1cclxuICAsIE9iamVjdCAgICAgICAgICA9IGdsb2JhbFtPQkpFQ1RdXHJcbiAgLCBBcnJheSAgICAgICAgICAgPSBnbG9iYWxbQVJSQVldXHJcbiAgLCBTdHJpbmcgICAgICAgICAgPSBnbG9iYWxbU1RSSU5HXVxyXG4gICwgTnVtYmVyICAgICAgICAgID0gZ2xvYmFsW05VTUJFUl1cclxuICAsIFJlZ0V4cCAgICAgICAgICA9IGdsb2JhbFtSRUdFWFBdXHJcbiAgLCBEYXRlICAgICAgICAgICAgPSBnbG9iYWxbREFURV1cclxuICAsIE1hcCAgICAgICAgICAgICA9IGdsb2JhbFtNQVBdXHJcbiAgLCBTZXQgICAgICAgICAgICAgPSBnbG9iYWxbU0VUXVxyXG4gICwgV2Vha01hcCAgICAgICAgID0gZ2xvYmFsW1dFQUtNQVBdXHJcbiAgLCBXZWFrU2V0ICAgICAgICAgPSBnbG9iYWxbV0VBS1NFVF1cclxuICAsIFN5bWJvbCAgICAgICAgICA9IGdsb2JhbFtTWU1CT0xdXHJcbiAgLCBNYXRoICAgICAgICAgICAgPSBnbG9iYWxbTUFUSF1cclxuICAsIFR5cGVFcnJvciAgICAgICA9IGdsb2JhbC5UeXBlRXJyb3JcclxuICAsIFJhbmdlRXJyb3IgICAgICA9IGdsb2JhbC5SYW5nZUVycm9yXHJcbiAgLCBzZXRUaW1lb3V0ICAgICAgPSBnbG9iYWwuc2V0VGltZW91dFxyXG4gICwgc2V0SW1tZWRpYXRlICAgID0gZ2xvYmFsLnNldEltbWVkaWF0ZVxyXG4gICwgY2xlYXJJbW1lZGlhdGUgID0gZ2xvYmFsLmNsZWFySW1tZWRpYXRlXHJcbiAgLCBwYXJzZUludCAgICAgICAgPSBnbG9iYWwucGFyc2VJbnRcclxuICAsIGlzRmluaXRlICAgICAgICA9IGdsb2JhbC5pc0Zpbml0ZVxyXG4gICwgcHJvY2VzcyAgICAgICAgID0gZ2xvYmFsW1BST0NFU1NdXHJcbiAgLCBuZXh0VGljayAgICAgICAgPSBwcm9jZXNzICYmIHByb2Nlc3MubmV4dFRpY2tcclxuICAsIGRvY3VtZW50ICAgICAgICA9IGdsb2JhbC5kb2N1bWVudFxyXG4gICwgaHRtbCAgICAgICAgICAgID0gZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XHJcbiAgLCBuYXZpZ2F0b3IgICAgICAgPSBnbG9iYWwubmF2aWdhdG9yXHJcbiAgLCBkZWZpbmUgICAgICAgICAgPSBnbG9iYWwuZGVmaW5lXHJcbiAgLCBjb25zb2xlICAgICAgICAgPSBnbG9iYWwuY29uc29sZSB8fCB7fVxyXG4gICwgQXJyYXlQcm90byAgICAgID0gQXJyYXlbUFJPVE9UWVBFXVxyXG4gICwgT2JqZWN0UHJvdG8gICAgID0gT2JqZWN0W1BST1RPVFlQRV1cclxuICAsIEZ1bmN0aW9uUHJvdG8gICA9IEZ1bmN0aW9uW1BST1RPVFlQRV1cclxuICAsIEluZmluaXR5ICAgICAgICA9IDEgLyAwXHJcbiAgLCBET1QgICAgICAgICAgICAgPSAnLic7XHJcblxyXG4vLyBodHRwOi8vanNwZXJmLmNvbS9jb3JlLWpzLWlzb2JqZWN0XHJcbmZ1bmN0aW9uIGlzT2JqZWN0KGl0KXtcclxuICByZXR1cm4gaXQgIT09IG51bGwgJiYgKHR5cGVvZiBpdCA9PSAnb2JqZWN0JyB8fCB0eXBlb2YgaXQgPT0gJ2Z1bmN0aW9uJyk7XHJcbn1cclxuZnVuY3Rpb24gaXNGdW5jdGlvbihpdCl7XHJcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnZnVuY3Rpb24nO1xyXG59XHJcbi8vIE5hdGl2ZSBmdW5jdGlvbj9cclxudmFyIGlzTmF0aXZlID0gY3R4KC8uLy50ZXN0LCAvXFxbbmF0aXZlIGNvZGVcXF1cXHMqXFx9XFxzKiQvLCAxKTtcclxuXHJcbi8vIE9iamVjdCBpbnRlcm5hbCBbW0NsYXNzXV0gb3IgdG9TdHJpbmdUYWdcclxuLy8gaHR0cDovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZ1xyXG52YXIgdG9TdHJpbmcgPSBPYmplY3RQcm90b1tUT19TVFJJTkddO1xyXG5mdW5jdGlvbiBzZXRUb1N0cmluZ1RhZyhpdCwgdGFnLCBzdGF0KXtcclxuICBpZihpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXRbUFJPVE9UWVBFXSwgU1lNQk9MX1RBRykpaGlkZGVuKGl0LCBTWU1CT0xfVEFHLCB0YWcpO1xyXG59XHJcbmZ1bmN0aW9uIGNvZihpdCl7XHJcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcclxufVxyXG5mdW5jdGlvbiBjbGFzc29mKGl0KXtcclxuICB2YXIgTywgVDtcclxuICByZXR1cm4gaXQgPT0gdW5kZWZpbmVkID8gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogJ051bGwnXHJcbiAgICA6IHR5cGVvZiAoVCA9IChPID0gT2JqZWN0KGl0KSlbU1lNQk9MX1RBR10pID09ICdzdHJpbmcnID8gVCA6IGNvZihPKTtcclxufVxyXG5cclxuLy8gRnVuY3Rpb25cclxudmFyIGNhbGwgID0gRnVuY3Rpb25Qcm90by5jYWxsXHJcbiAgLCBhcHBseSA9IEZ1bmN0aW9uUHJvdG8uYXBwbHlcclxuICAsIFJFRkVSRU5DRV9HRVQ7XHJcbi8vIFBhcnRpYWwgYXBwbHlcclxuZnVuY3Rpb24gcGFydCgvKiAuLi5hcmdzICovKXtcclxuICB2YXIgZm4gICAgID0gYXNzZXJ0RnVuY3Rpb24odGhpcylcclxuICAgICwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgLCBhcmdzICAgPSBBcnJheShsZW5ndGgpXHJcbiAgICAsIGkgICAgICA9IDBcclxuICAgICwgXyAgICAgID0gcGF0aC5fXHJcbiAgICAsIGhvbGRlciA9IGZhbHNlO1xyXG4gIHdoaWxlKGxlbmd0aCA+IGkpaWYoKGFyZ3NbaV0gPSBhcmd1bWVudHNbaSsrXSkgPT09IF8paG9sZGVyID0gdHJ1ZTtcclxuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XHJcbiAgICB2YXIgdGhhdCAgICA9IHRoaXNcclxuICAgICAgLCBfbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAsIGkgPSAwLCBqID0gMCwgX2FyZ3M7XHJcbiAgICBpZighaG9sZGVyICYmICFfbGVuZ3RoKXJldHVybiBpbnZva2UoZm4sIGFyZ3MsIHRoYXQpO1xyXG4gICAgX2FyZ3MgPSBhcmdzLnNsaWNlKCk7XHJcbiAgICBpZihob2xkZXIpZm9yKDtsZW5ndGggPiBpOyBpKyspaWYoX2FyZ3NbaV0gPT09IF8pX2FyZ3NbaV0gPSBhcmd1bWVudHNbaisrXTtcclxuICAgIHdoaWxlKF9sZW5ndGggPiBqKV9hcmdzLnB1c2goYXJndW1lbnRzW2orK10pO1xyXG4gICAgcmV0dXJuIGludm9rZShmbiwgX2FyZ3MsIHRoYXQpO1xyXG4gIH1cclxufVxyXG4vLyBPcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcclxuZnVuY3Rpb24gY3R4KGZuLCB0aGF0LCBsZW5ndGgpe1xyXG4gIGFzc2VydEZ1bmN0aW9uKGZuKTtcclxuICBpZih+bGVuZ3RoICYmIHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XHJcbiAgc3dpdGNoKGxlbmd0aCl7XHJcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcclxuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XHJcbiAgICB9XHJcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcclxuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XHJcbiAgICB9XHJcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhLCBiLCBjKXtcclxuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XHJcbiAgICB9XHJcbiAgfSByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XHJcbiAgICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xyXG4gIH1cclxufVxyXG4vLyBGYXN0IGFwcGx5XHJcbi8vIGh0dHA6Ly9qc3BlcmYubG5raXQuY29tL2Zhc3QtYXBwbHkvNVxyXG5mdW5jdGlvbiBpbnZva2UoZm4sIGFyZ3MsIHRoYXQpe1xyXG4gIHZhciB1biA9IHRoYXQgPT09IHVuZGVmaW5lZDtcclxuICBzd2l0Y2goYXJncy5sZW5ndGggfCAwKXtcclxuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQpO1xyXG4gICAgY2FzZSAxOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xyXG4gICAgY2FzZSAyOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xyXG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xyXG4gICAgY2FzZSA0OiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xyXG4gICAgY2FzZSA1OiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdLCBhcmdzWzRdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10sIGFyZ3NbNF0pO1xyXG4gIH0gcmV0dXJuICAgICAgICAgICAgICBmbi5hcHBseSh0aGF0LCBhcmdzKTtcclxufVxyXG5cclxuLy8gT2JqZWN0OlxyXG52YXIgY3JlYXRlICAgICAgICAgICA9IE9iamVjdC5jcmVhdGVcclxuICAsIGdldFByb3RvdHlwZU9mICAgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2ZcclxuICAsIHNldFByb3RvdHlwZU9mICAgPSBPYmplY3Quc2V0UHJvdG90eXBlT2ZcclxuICAsIGRlZmluZVByb3BlcnR5ICAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHlcclxuICAsIGRlZmluZVByb3BlcnRpZXMgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllc1xyXG4gICwgZ2V0T3duRGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JcclxuICAsIGdldEtleXMgICAgICAgICAgPSBPYmplY3Qua2V5c1xyXG4gICwgZ2V0TmFtZXMgICAgICAgICA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzXHJcbiAgLCBnZXRTeW1ib2xzICAgICAgID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9sc1xyXG4gICwgaXNGcm96ZW4gICAgICAgICA9IE9iamVjdC5pc0Zyb3plblxyXG4gICwgaGFzICAgICAgICAgICAgICA9IGN0eChjYWxsLCBPYmplY3RQcm90b1tIQVNfT1dOXSwgMilcclxuICAvLyBEdW1teSwgZml4IGZvciBub3QgYXJyYXktbGlrZSBFUzMgc3RyaW5nIGluIGVzNSBtb2R1bGVcclxuICAsIEVTNU9iamVjdCAgICAgICAgPSBPYmplY3RcclxuICAsIERpY3Q7XHJcbmZ1bmN0aW9uIHRvT2JqZWN0KGl0KXtcclxuICByZXR1cm4gRVM1T2JqZWN0KGFzc2VydERlZmluZWQoaXQpKTtcclxufVxyXG5mdW5jdGlvbiByZXR1cm5JdChpdCl7XHJcbiAgcmV0dXJuIGl0O1xyXG59XHJcbmZ1bmN0aW9uIHJldHVyblRoaXMoKXtcclxuICByZXR1cm4gdGhpcztcclxufVxyXG5mdW5jdGlvbiBnZXQob2JqZWN0LCBrZXkpe1xyXG4gIGlmKGhhcyhvYmplY3QsIGtleSkpcmV0dXJuIG9iamVjdFtrZXldO1xyXG59XHJcbmZ1bmN0aW9uIG93bktleXMoaXQpe1xyXG4gIGFzc2VydE9iamVjdChpdCk7XHJcbiAgcmV0dXJuIGdldFN5bWJvbHMgPyBnZXROYW1lcyhpdCkuY29uY2F0KGdldFN5bWJvbHMoaXQpKSA6IGdldE5hbWVzKGl0KTtcclxufVxyXG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXHJcbnZhciBhc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHRhcmdldCwgc291cmNlKXtcclxuICB2YXIgVCA9IE9iamVjdChhc3NlcnREZWZpbmVkKHRhcmdldCkpXHJcbiAgICAsIGwgPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAsIGkgPSAxO1xyXG4gIHdoaWxlKGwgPiBpKXtcclxuICAgIHZhciBTICAgICAgPSBFUzVPYmplY3QoYXJndW1lbnRzW2krK10pXHJcbiAgICAgICwga2V5cyAgID0gZ2V0S2V5cyhTKVxyXG4gICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXHJcbiAgICAgICwgaiAgICAgID0gMFxyXG4gICAgICAsIGtleTtcclxuICAgIHdoaWxlKGxlbmd0aCA+IGopVFtrZXkgPSBrZXlzW2orK11dID0gU1trZXldO1xyXG4gIH1cclxuICByZXR1cm4gVDtcclxufVxyXG5mdW5jdGlvbiBrZXlPZihvYmplY3QsIGVsKXtcclxuICB2YXIgTyAgICAgID0gdG9PYmplY3Qob2JqZWN0KVxyXG4gICAgLCBrZXlzICAgPSBnZXRLZXlzKE8pXHJcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXHJcbiAgICAsIGluZGV4ICA9IDBcclxuICAgICwga2V5O1xyXG4gIHdoaWxlKGxlbmd0aCA+IGluZGV4KWlmKE9ba2V5ID0ga2V5c1tpbmRleCsrXV0gPT09IGVsKXJldHVybiBrZXk7XHJcbn1cclxuXHJcbi8vIEFycmF5XHJcbi8vIGFycmF5KCdzdHIxLHN0cjIsc3RyMycpID0+IFsnc3RyMScsICdzdHIyJywgJ3N0cjMnXVxyXG5mdW5jdGlvbiBhcnJheShpdCl7XHJcbiAgcmV0dXJuIFN0cmluZyhpdCkuc3BsaXQoJywnKTtcclxufVxyXG52YXIgcHVzaCAgICA9IEFycmF5UHJvdG8ucHVzaFxyXG4gICwgdW5zaGlmdCA9IEFycmF5UHJvdG8udW5zaGlmdFxyXG4gICwgc2xpY2UgICA9IEFycmF5UHJvdG8uc2xpY2VcclxuICAsIHNwbGljZSAgPSBBcnJheVByb3RvLnNwbGljZVxyXG4gICwgaW5kZXhPZiA9IEFycmF5UHJvdG8uaW5kZXhPZlxyXG4gICwgZm9yRWFjaCA9IEFycmF5UHJvdG9bRk9SX0VBQ0hdO1xyXG4vKlxyXG4gKiAwIC0+IGZvckVhY2hcclxuICogMSAtPiBtYXBcclxuICogMiAtPiBmaWx0ZXJcclxuICogMyAtPiBzb21lXHJcbiAqIDQgLT4gZXZlcnlcclxuICogNSAtPiBmaW5kXHJcbiAqIDYgLT4gZmluZEluZGV4XHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVBcnJheU1ldGhvZCh0eXBlKXtcclxuICB2YXIgaXNNYXAgICAgICAgPSB0eXBlID09IDFcclxuICAgICwgaXNGaWx0ZXIgICAgPSB0eXBlID09IDJcclxuICAgICwgaXNTb21lICAgICAgPSB0eXBlID09IDNcclxuICAgICwgaXNFdmVyeSAgICAgPSB0eXBlID09IDRcclxuICAgICwgaXNGaW5kSW5kZXggPSB0eXBlID09IDZcclxuICAgICwgbm9ob2xlcyAgICAgPSB0eXBlID09IDUgfHwgaXNGaW5kSW5kZXg7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKGNhbGxiYWNrZm4vKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XHJcbiAgICB2YXIgTyAgICAgID0gT2JqZWN0KGFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAgICwgdGhhdCAgID0gYXJndW1lbnRzWzFdXHJcbiAgICAgICwgc2VsZiAgID0gRVM1T2JqZWN0KE8pXHJcbiAgICAgICwgZiAgICAgID0gY3R4KGNhbGxiYWNrZm4sIHRoYXQsIDMpXHJcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoc2VsZi5sZW5ndGgpXHJcbiAgICAgICwgaW5kZXggID0gMFxyXG4gICAgICAsIHJlc3VsdCA9IGlzTWFwID8gQXJyYXkobGVuZ3RoKSA6IGlzRmlsdGVyID8gW10gOiB1bmRlZmluZWRcclxuICAgICAgLCB2YWwsIHJlcztcclxuICAgIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYobm9ob2xlcyB8fCBpbmRleCBpbiBzZWxmKXtcclxuICAgICAgdmFsID0gc2VsZltpbmRleF07XHJcbiAgICAgIHJlcyA9IGYodmFsLCBpbmRleCwgTyk7XHJcbiAgICAgIGlmKHR5cGUpe1xyXG4gICAgICAgIGlmKGlzTWFwKXJlc3VsdFtpbmRleF0gPSByZXM7ICAgICAgICAgICAgIC8vIG1hcFxyXG4gICAgICAgIGVsc2UgaWYocmVzKXN3aXRjaCh0eXBlKXtcclxuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgICAgICAgICAvLyBzb21lXHJcbiAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWw7ICAgICAgICAgICAgICAgICAgICAgLy8gZmluZFxyXG4gICAgICAgICAgY2FzZSA2OiByZXR1cm4gaW5kZXg7ICAgICAgICAgICAgICAgICAgIC8vIGZpbmRJbmRleFxyXG4gICAgICAgICAgY2FzZSAyOiByZXN1bHQucHVzaCh2YWwpOyAgICAgICAgICAgICAgIC8vIGZpbHRlclxyXG4gICAgICAgIH0gZWxzZSBpZihpc0V2ZXJ5KXJldHVybiBmYWxzZTsgICAgICAgICAgIC8vIGV2ZXJ5XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBpc0ZpbmRJbmRleCA/IC0xIDogaXNTb21lIHx8IGlzRXZlcnkgPyBpc0V2ZXJ5IDogcmVzdWx0O1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBjcmVhdGVBcnJheUNvbnRhaW5zKGlzQ29udGFpbnMpe1xyXG4gIHJldHVybiBmdW5jdGlvbihlbCAvKiwgZnJvbUluZGV4ID0gMCAqLyl7XHJcbiAgICB2YXIgTyAgICAgID0gdG9PYmplY3QodGhpcylcclxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcclxuICAgICAgLCBpbmRleCAgPSB0b0luZGV4KGFyZ3VtZW50c1sxXSwgbGVuZ3RoKTtcclxuICAgIGlmKGlzQ29udGFpbnMgJiYgZWwgIT0gZWwpe1xyXG4gICAgICBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKHNhbWVOYU4oT1tpbmRleF0pKXJldHVybiBpc0NvbnRhaW5zIHx8IGluZGV4O1xyXG4gICAgfSBlbHNlIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYoaXNDb250YWlucyB8fCBpbmRleCBpbiBPKXtcclxuICAgICAgaWYoT1tpbmRleF0gPT09IGVsKXJldHVybiBpc0NvbnRhaW5zIHx8IGluZGV4O1xyXG4gICAgfSByZXR1cm4gIWlzQ29udGFpbnMgJiYgLTE7XHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIGdlbmVyaWMoQSwgQil7XHJcbiAgLy8gc3RyYW5nZSBJRSBxdWlya3MgbW9kZSBidWcgLT4gdXNlIHR5cGVvZiB2cyBpc0Z1bmN0aW9uXHJcbiAgcmV0dXJuIHR5cGVvZiBBID09ICdmdW5jdGlvbicgPyBBIDogQjtcclxufVxyXG5cclxuLy8gTWF0aFxyXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDB4MWZmZmZmZmZmZmZmZmYgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxyXG4gICwgcG93ICAgID0gTWF0aC5wb3dcclxuICAsIGFicyAgICA9IE1hdGguYWJzXHJcbiAgLCBjZWlsICAgPSBNYXRoLmNlaWxcclxuICAsIGZsb29yICA9IE1hdGguZmxvb3JcclxuICAsIG1heCAgICA9IE1hdGgubWF4XHJcbiAgLCBtaW4gICAgPSBNYXRoLm1pblxyXG4gICwgcmFuZG9tID0gTWF0aC5yYW5kb21cclxuICAsIHRydW5jICA9IE1hdGgudHJ1bmMgfHwgZnVuY3Rpb24oaXQpe1xyXG4gICAgICByZXR1cm4gKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xyXG4gICAgfVxyXG4vLyAyMC4xLjIuNCBOdW1iZXIuaXNOYU4obnVtYmVyKVxyXG5mdW5jdGlvbiBzYW1lTmFOKG51bWJlcil7XHJcbiAgcmV0dXJuIG51bWJlciAhPSBudW1iZXI7XHJcbn1cclxuLy8gNy4xLjQgVG9JbnRlZ2VyXHJcbmZ1bmN0aW9uIHRvSW50ZWdlcihpdCl7XHJcbiAgcmV0dXJuIGlzTmFOKGl0KSA/IDAgOiB0cnVuYyhpdCk7XHJcbn1cclxuLy8gNy4xLjE1IFRvTGVuZ3RoXHJcbmZ1bmN0aW9uIHRvTGVuZ3RoKGl0KXtcclxuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIE1BWF9TQUZFX0lOVEVHRVIpIDogMDtcclxufVxyXG5mdW5jdGlvbiB0b0luZGV4KGluZGV4LCBsZW5ndGgpe1xyXG4gIHZhciBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XHJcbiAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XHJcbn1cclxuZnVuY3Rpb24gbHoobnVtKXtcclxuICByZXR1cm4gbnVtID4gOSA/IG51bSA6ICcwJyArIG51bTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlUmVwbGFjZXIocmVnRXhwLCByZXBsYWNlLCBpc1N0YXRpYyl7XHJcbiAgdmFyIHJlcGxhY2VyID0gaXNPYmplY3QocmVwbGFjZSkgPyBmdW5jdGlvbihwYXJ0KXtcclxuICAgIHJldHVybiByZXBsYWNlW3BhcnRdO1xyXG4gIH0gOiByZXBsYWNlO1xyXG4gIHJldHVybiBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gU3RyaW5nKGlzU3RhdGljID8gaXQgOiB0aGlzKS5yZXBsYWNlKHJlZ0V4cCwgcmVwbGFjZXIpO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBjcmVhdGVQb2ludEF0KHRvU3RyaW5nKXtcclxuICByZXR1cm4gZnVuY3Rpb24ocG9zKXtcclxuICAgIHZhciBzID0gU3RyaW5nKGFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXHJcbiAgICAgICwgbCA9IHMubGVuZ3RoXHJcbiAgICAgICwgYSwgYjtcclxuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gdG9TdHJpbmcgPyAnJyA6IHVuZGVmaW5lZDtcclxuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XHJcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxyXG4gICAgICA/IHRvU3RyaW5nID8gcy5jaGFyQXQoaSkgOiBhXHJcbiAgICAgIDogdG9TdHJpbmcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBBc3NlcnRpb24gJiBlcnJvcnNcclxudmFyIFJFRFVDRV9FUlJPUiA9ICdSZWR1Y2Ugb2YgZW1wdHkgb2JqZWN0IHdpdGggbm8gaW5pdGlhbCB2YWx1ZSc7XHJcbmZ1bmN0aW9uIGFzc2VydChjb25kaXRpb24sIG1zZzEsIG1zZzIpe1xyXG4gIGlmKCFjb25kaXRpb24pdGhyb3cgVHlwZUVycm9yKG1zZzIgPyBtc2cxICsgbXNnMiA6IG1zZzEpO1xyXG59XHJcbmZ1bmN0aW9uIGFzc2VydERlZmluZWQoaXQpe1xyXG4gIGlmKGl0ID09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoJ0Z1bmN0aW9uIGNhbGxlZCBvbiBudWxsIG9yIHVuZGVmaW5lZCcpO1xyXG4gIHJldHVybiBpdDtcclxufVxyXG5mdW5jdGlvbiBhc3NlcnRGdW5jdGlvbihpdCl7XHJcbiAgYXNzZXJ0KGlzRnVuY3Rpb24oaXQpLCBpdCwgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcclxuICByZXR1cm4gaXQ7XHJcbn1cclxuZnVuY3Rpb24gYXNzZXJ0T2JqZWN0KGl0KXtcclxuICBhc3NlcnQoaXNPYmplY3QoaXQpLCBpdCwgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xyXG4gIHJldHVybiBpdDtcclxufVxyXG5mdW5jdGlvbiBhc3NlcnRJbnN0YW5jZShpdCwgQ29uc3RydWN0b3IsIG5hbWUpe1xyXG4gIGFzc2VydChpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yLCBuYW1lLCBcIjogdXNlIHRoZSAnbmV3JyBvcGVyYXRvciFcIik7XHJcbn1cclxuXHJcbi8vIFByb3BlcnR5IGRlc2NyaXB0b3JzICYgU3ltYm9sXHJcbmZ1bmN0aW9uIGRlc2NyaXB0b3IoYml0bWFwLCB2YWx1ZSl7XHJcbiAgcmV0dXJuIHtcclxuICAgIGVudW1lcmFibGUgIDogIShiaXRtYXAgJiAxKSxcclxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcclxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcclxuICAgIHZhbHVlICAgICAgIDogdmFsdWVcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gc2ltcGxlU2V0KG9iamVjdCwga2V5LCB2YWx1ZSl7XHJcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcclxuICByZXR1cm4gb2JqZWN0O1xyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZURlZmluZXIoYml0bWFwKXtcclxuICByZXR1cm4gREVTQyA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XHJcbiAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkob2JqZWN0LCBrZXksIGRlc2NyaXB0b3IoYml0bWFwLCB2YWx1ZSkpO1xyXG4gIH0gOiBzaW1wbGVTZXQ7XHJcbn1cclxuZnVuY3Rpb24gdWlkKGtleSl7XHJcbiAgcmV0dXJuIFNZTUJPTCArICcoJyArIGtleSArICcpXycgKyAoKytzaWQgKyByYW5kb20oKSlbVE9fU1RSSU5HXSgzNik7XHJcbn1cclxuZnVuY3Rpb24gZ2V0V2VsbEtub3duU3ltYm9sKG5hbWUsIHNldHRlcil7XHJcbiAgcmV0dXJuIChTeW1ib2wgJiYgU3ltYm9sW25hbWVdKSB8fCAoc2V0dGVyID8gU3ltYm9sIDogc2FmZVN5bWJvbCkoU1lNQk9MICsgRE9UICsgbmFtZSk7XHJcbn1cclxuLy8gVGhlIGVuZ2luZSB3b3JrcyBmaW5lIHdpdGggZGVzY3JpcHRvcnM/IFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHkuXHJcbnZhciBERVNDID0gISFmdW5jdGlvbigpe1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gMiB9fSkuYSA9PSAyO1xyXG4gICAgICB9IGNhdGNoKGUpe31cclxuICAgIH0oKVxyXG4gICwgc2lkICAgID0gMFxyXG4gICwgaGlkZGVuID0gY3JlYXRlRGVmaW5lcigxKVxyXG4gICwgc2V0ICAgID0gU3ltYm9sID8gc2ltcGxlU2V0IDogaGlkZGVuXHJcbiAgLCBzYWZlU3ltYm9sID0gU3ltYm9sIHx8IHVpZDtcclxuZnVuY3Rpb24gYXNzaWduSGlkZGVuKHRhcmdldCwgc3JjKXtcclxuICBmb3IodmFyIGtleSBpbiBzcmMpaGlkZGVuKHRhcmdldCwga2V5LCBzcmNba2V5XSk7XHJcbiAgcmV0dXJuIHRhcmdldDtcclxufVxyXG5cclxudmFyIFNZTUJPTF9VTlNDT1BBQkxFUyA9IGdldFdlbGxLbm93blN5bWJvbCgndW5zY29wYWJsZXMnKVxyXG4gICwgQXJyYXlVbnNjb3BhYmxlcyAgID0gQXJyYXlQcm90b1tTWU1CT0xfVU5TQ09QQUJMRVNdIHx8IHt9XHJcbiAgLCBTWU1CT0xfVEFHICAgICAgICAgPSBnZXRXZWxsS25vd25TeW1ib2woVE9fU1RSSU5HX1RBRylcclxuICAsIFNZTUJPTF9TUEVDSUVTICAgICA9IGdldFdlbGxLbm93blN5bWJvbCgnc3BlY2llcycpXHJcbiAgLCBTWU1CT0xfSVRFUkFUT1I7XHJcbmZ1bmN0aW9uIHNldFNwZWNpZXMoQyl7XHJcbiAgaWYoREVTQyAmJiAoZnJhbWV3b3JrIHx8ICFpc05hdGl2ZShDKSkpZGVmaW5lUHJvcGVydHkoQywgU1lNQk9MX1NQRUNJRVMsIHtcclxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgIGdldDogcmV0dXJuVGhpc1xyXG4gIH0pO1xyXG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvbW1vbi5leHBvcnQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBOT0RFID0gY29mKHByb2Nlc3MpID09IFBST0NFU1NcclxuICAsIGNvcmUgPSB7fVxyXG4gICwgcGF0aCA9IGZyYW1ld29yayA/IGdsb2JhbCA6IGNvcmVcclxuICAsIG9sZCAgPSBnbG9iYWwuY29yZVxyXG4gICwgZXhwb3J0R2xvYmFsXHJcbiAgLy8gdHlwZSBiaXRtYXBcclxuICAsIEZPUkNFRCA9IDFcclxuICAsIEdMT0JBTCA9IDJcclxuICAsIFNUQVRJQyA9IDRcclxuICAsIFBST1RPICA9IDhcclxuICAsIEJJTkQgICA9IDE2XHJcbiAgLCBXUkFQICAgPSAzMjtcclxuZnVuY3Rpb24gJGRlZmluZSh0eXBlLCBuYW1lLCBzb3VyY2Upe1xyXG4gIHZhciBrZXksIG93biwgb3V0LCBleHBcclxuICAgICwgaXNHbG9iYWwgPSB0eXBlICYgR0xPQkFMXHJcbiAgICAsIHRhcmdldCAgID0gaXNHbG9iYWwgPyBnbG9iYWwgOiAodHlwZSAmIFNUQVRJQylcclxuICAgICAgICA/IGdsb2JhbFtuYW1lXSA6IChnbG9iYWxbbmFtZV0gfHwgT2JqZWN0UHJvdG8pW1BST1RPVFlQRV1cclxuICAgICwgZXhwb3J0cyAgPSBpc0dsb2JhbCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xyXG4gIGlmKGlzR2xvYmFsKXNvdXJjZSA9IG5hbWU7XHJcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xyXG4gICAgLy8gdGhlcmUgaXMgYSBzaW1pbGFyIG5hdGl2ZVxyXG4gICAgb3duID0gISh0eXBlICYgRk9SQ0VEKSAmJiB0YXJnZXQgJiYga2V5IGluIHRhcmdldFxyXG4gICAgICAmJiAoIWlzRnVuY3Rpb24odGFyZ2V0W2tleV0pIHx8IGlzTmF0aXZlKHRhcmdldFtrZXldKSk7XHJcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxyXG4gICAgb3V0ID0gKG93biA/IHRhcmdldCA6IHNvdXJjZSlba2V5XTtcclxuICAgIC8vIHByZXZlbnQgZ2xvYmFsIHBvbGx1dGlvbiBmb3IgbmFtZXNwYWNlc1xyXG4gICAgaWYoIWZyYW1ld29yayAmJiBpc0dsb2JhbCAmJiAhaXNGdW5jdGlvbih0YXJnZXRba2V5XSkpZXhwID0gc291cmNlW2tleV07XHJcbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxyXG4gICAgZWxzZSBpZih0eXBlICYgQklORCAmJiBvd24pZXhwID0gY3R4KG91dCwgZ2xvYmFsKTtcclxuICAgIC8vIHdyYXAgZ2xvYmFsIGNvbnN0cnVjdG9ycyBmb3IgcHJldmVudCBjaGFuZ2UgdGhlbSBpbiBsaWJyYXJ5XHJcbiAgICBlbHNlIGlmKHR5cGUgJiBXUkFQICYmICFmcmFtZXdvcmsgJiYgdGFyZ2V0W2tleV0gPT0gb3V0KXtcclxuICAgICAgZXhwID0gZnVuY3Rpb24ocGFyYW0pe1xyXG4gICAgICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2Ygb3V0ID8gbmV3IG91dChwYXJhbSkgOiBvdXQocGFyYW0pO1xyXG4gICAgICB9XHJcbiAgICAgIGV4cFtQUk9UT1RZUEVdID0gb3V0W1BST1RPVFlQRV07XHJcbiAgICB9IGVsc2UgZXhwID0gdHlwZSAmIFBST1RPICYmIGlzRnVuY3Rpb24ob3V0KSA/IGN0eChjYWxsLCBvdXQpIDogb3V0O1xyXG4gICAgLy8gZXh0ZW5kIGdsb2JhbFxyXG4gICAgaWYoZnJhbWV3b3JrICYmIHRhcmdldCAmJiAhb3duKXtcclxuICAgICAgaWYoaXNHbG9iYWwpdGFyZ2V0W2tleV0gPSBvdXQ7XHJcbiAgICAgIGVsc2UgZGVsZXRlIHRhcmdldFtrZXldICYmIGhpZGRlbih0YXJnZXQsIGtleSwgb3V0KTtcclxuICAgIH1cclxuICAgIC8vIGV4cG9ydFxyXG4gICAgaWYoZXhwb3J0c1trZXldICE9IG91dCloaWRkZW4oZXhwb3J0cywga2V5LCBleHApO1xyXG4gIH1cclxufVxyXG4vLyBDb21tb25KUyBleHBvcnRcclxuaWYodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyltb2R1bGUuZXhwb3J0cyA9IGNvcmU7XHJcbi8vIFJlcXVpcmVKUyBleHBvcnRcclxuZWxzZSBpZihpc0Z1bmN0aW9uKGRlZmluZSkgJiYgZGVmaW5lLmFtZClkZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gY29yZX0pO1xyXG4vLyBFeHBvcnQgdG8gZ2xvYmFsIG9iamVjdFxyXG5lbHNlIGV4cG9ydEdsb2JhbCA9IHRydWU7XHJcbmlmKGV4cG9ydEdsb2JhbCB8fCBmcmFtZXdvcmspe1xyXG4gIGNvcmUubm9Db25mbGljdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICBnbG9iYWwuY29yZSA9IG9sZDtcclxuICAgIHJldHVybiBjb3JlO1xyXG4gIH1cclxuICBnbG9iYWwuY29yZSA9IGNvcmU7XHJcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29tbW9uLml0ZXJhdG9ycyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuU1lNQk9MX0lURVJBVE9SID0gZ2V0V2VsbEtub3duU3ltYm9sKElURVJBVE9SKTtcclxudmFyIElURVIgID0gc2FmZVN5bWJvbCgnaXRlcicpXHJcbiAgLCBLRVkgICA9IDFcclxuICAsIFZBTFVFID0gMlxyXG4gICwgSXRlcmF0b3JzID0ge31cclxuICAsIEl0ZXJhdG9yUHJvdG90eXBlID0ge31cclxuICAgIC8vIFNhZmFyaSBoYXMgYnlnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcclxuICAsIEJVR0dZX0lURVJBVE9SUyA9ICdrZXlzJyBpbiBBcnJheVByb3RvICYmICEoJ25leHQnIGluIFtdLmtleXMoKSk7XHJcbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXHJcbnNldEl0ZXJhdG9yKEl0ZXJhdG9yUHJvdG90eXBlLCByZXR1cm5UaGlzKTtcclxuZnVuY3Rpb24gc2V0SXRlcmF0b3IoTywgdmFsdWUpe1xyXG4gIGhpZGRlbihPLCBTWU1CT0xfSVRFUkFUT1IsIHZhbHVlKTtcclxuICAvLyBBZGQgaXRlcmF0b3IgZm9yIEZGIGl0ZXJhdG9yIHByb3RvY29sXHJcbiAgRkZfSVRFUkFUT1IgaW4gQXJyYXlQcm90byAmJiBoaWRkZW4oTywgRkZfSVRFUkFUT1IsIHZhbHVlKTtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGVJdGVyYXRvcihDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCwgcHJvdG8pe1xyXG4gIENvbnN0cnVjdG9yW1BST1RPVFlQRV0gPSBjcmVhdGUocHJvdG8gfHwgSXRlcmF0b3JQcm90b3R5cGUsIHtuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpfSk7XHJcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XHJcbn1cclxuZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3IoQ29uc3RydWN0b3IsIE5BTUUsIHZhbHVlLCBERUZBVUxUKXtcclxuICB2YXIgcHJvdG8gPSBDb25zdHJ1Y3RvcltQUk9UT1RZUEVdXHJcbiAgICAsIGl0ZXIgID0gZ2V0KHByb3RvLCBTWU1CT0xfSVRFUkFUT1IpIHx8IGdldChwcm90bywgRkZfSVRFUkFUT1IpIHx8IChERUZBVUxUICYmIGdldChwcm90bywgREVGQVVMVCkpIHx8IHZhbHVlO1xyXG4gIGlmKGZyYW1ld29yayl7XHJcbiAgICAvLyBEZWZpbmUgaXRlcmF0b3JcclxuICAgIHNldEl0ZXJhdG9yKHByb3RvLCBpdGVyKTtcclxuICAgIGlmKGl0ZXIgIT09IHZhbHVlKXtcclxuICAgICAgdmFyIGl0ZXJQcm90byA9IGdldFByb3RvdHlwZU9mKGl0ZXIuY2FsbChuZXcgQ29uc3RydWN0b3IpKTtcclxuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xyXG4gICAgICBzZXRUb1N0cmluZ1RhZyhpdGVyUHJvdG8sIE5BTUUgKyAnIEl0ZXJhdG9yJywgdHJ1ZSk7XHJcbiAgICAgIC8vIEZGIGZpeFxyXG4gICAgICBoYXMocHJvdG8sIEZGX0lURVJBVE9SKSAmJiBzZXRJdGVyYXRvcihpdGVyUHJvdG8sIHJldHVyblRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XHJcbiAgSXRlcmF0b3JzW05BTUVdID0gaXRlcjtcclxuICAvLyBGRiAmIHY4IGZpeFxyXG4gIEl0ZXJhdG9yc1tOQU1FICsgJyBJdGVyYXRvciddID0gcmV0dXJuVGhpcztcclxuICByZXR1cm4gaXRlcjtcclxufVxyXG5mdW5jdGlvbiBkZWZpbmVTdGRJdGVyYXRvcnMoQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCl7XHJcbiAgZnVuY3Rpb24gY3JlYXRlSXRlcihraW5kKXtcclxuICAgIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpO1xyXG4gICAgfVxyXG4gIH1cclxuICBjcmVhdGVJdGVyYXRvcihDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XHJcbiAgdmFyIGVudHJpZXMgPSBjcmVhdGVJdGVyKEtFWStWQUxVRSlcclxuICAgICwgdmFsdWVzICA9IGNyZWF0ZUl0ZXIoVkFMVUUpO1xyXG4gIGlmKERFRkFVTFQgPT0gVkFMVUUpdmFsdWVzID0gZGVmaW5lSXRlcmF0b3IoQmFzZSwgTkFNRSwgdmFsdWVzLCAndmFsdWVzJyk7XHJcbiAgZWxzZSBlbnRyaWVzID0gZGVmaW5lSXRlcmF0b3IoQmFzZSwgTkFNRSwgZW50cmllcywgJ2VudHJpZXMnKTtcclxuICBpZihERUZBVUxUKXtcclxuICAgICRkZWZpbmUoUFJPVE8gKyBGT1JDRUQgKiBCVUdHWV9JVEVSQVRPUlMsIE5BTUUsIHtcclxuICAgICAgZW50cmllczogZW50cmllcyxcclxuICAgICAga2V5czogSVNfU0VUID8gdmFsdWVzIDogY3JlYXRlSXRlcihLRVkpLFxyXG4gICAgICB2YWx1ZXM6IHZhbHVlc1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIGl0ZXJSZXN1bHQoZG9uZSwgdmFsdWUpe1xyXG4gIHJldHVybiB7dmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmV9O1xyXG59XHJcbmZ1bmN0aW9uIGlzSXRlcmFibGUoaXQpe1xyXG4gIHZhciBPICAgICAgPSBPYmplY3QoaXQpXHJcbiAgICAsIFN5bWJvbCA9IGdsb2JhbFtTWU1CT0xdXHJcbiAgICAsIGhhc0V4dCA9IChTeW1ib2wgJiYgU3ltYm9sW0lURVJBVE9SXSB8fCBGRl9JVEVSQVRPUikgaW4gTztcclxuICByZXR1cm4gaGFzRXh0IHx8IFNZTUJPTF9JVEVSQVRPUiBpbiBPIHx8IGhhcyhJdGVyYXRvcnMsIGNsYXNzb2YoTykpO1xyXG59XHJcbmZ1bmN0aW9uIGdldEl0ZXJhdG9yKGl0KXtcclxuICB2YXIgU3ltYm9sICA9IGdsb2JhbFtTWU1CT0xdXHJcbiAgICAsIGV4dCAgICAgPSBpdFtTeW1ib2wgJiYgU3ltYm9sW0lURVJBVE9SXSB8fCBGRl9JVEVSQVRPUl1cclxuICAgICwgZ2V0SXRlciA9IGV4dCB8fCBpdFtTWU1CT0xfSVRFUkFUT1JdIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XHJcbiAgcmV0dXJuIGFzc2VydE9iamVjdChnZXRJdGVyLmNhbGwoaXQpKTtcclxufVxyXG5mdW5jdGlvbiBzdGVwQ2FsbChmbiwgdmFsdWUsIGVudHJpZXMpe1xyXG4gIHJldHVybiBlbnRyaWVzID8gaW52b2tlKGZuLCB2YWx1ZSkgOiBmbih2YWx1ZSk7XHJcbn1cclxuZnVuY3Rpb24gY2hlY2tEYW5nZXJJdGVyQ2xvc2luZyhmbil7XHJcbiAgdmFyIGRhbmdlciA9IHRydWU7XHJcbiAgdmFyIE8gPSB7XHJcbiAgICBuZXh0OiBmdW5jdGlvbigpeyB0aHJvdyAxIH0sXHJcbiAgICAncmV0dXJuJzogZnVuY3Rpb24oKXsgZGFuZ2VyID0gZmFsc2UgfVxyXG4gIH07XHJcbiAgT1tTWU1CT0xfSVRFUkFUT1JdID0gcmV0dXJuVGhpcztcclxuICB0cnkge1xyXG4gICAgZm4oTyk7XHJcbiAgfSBjYXRjaChlKXt9XHJcbiAgcmV0dXJuIGRhbmdlcjtcclxufVxyXG5mdW5jdGlvbiBjbG9zZUl0ZXJhdG9yKGl0ZXJhdG9yKXtcclxuICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xyXG4gIGlmKHJldCAhPT0gdW5kZWZpbmVkKXJldC5jYWxsKGl0ZXJhdG9yKTtcclxufVxyXG5mdW5jdGlvbiBzYWZlSXRlckNsb3NlKGV4ZWMsIGl0ZXJhdG9yKXtcclxuICB0cnkge1xyXG4gICAgZXhlYyhpdGVyYXRvcik7XHJcbiAgfSBjYXRjaChlKXtcclxuICAgIGNsb3NlSXRlcmF0b3IoaXRlcmF0b3IpO1xyXG4gICAgdGhyb3cgZTtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gZm9yT2YoaXRlcmFibGUsIGVudHJpZXMsIGZuLCB0aGF0KXtcclxuICBzYWZlSXRlckNsb3NlKGZ1bmN0aW9uKGl0ZXJhdG9yKXtcclxuICAgIHZhciBmID0gY3R4KGZuLCB0aGF0LCBlbnRyaWVzID8gMiA6IDEpXHJcbiAgICAgICwgc3RlcDtcclxuICAgIHdoaWxlKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSlpZihzdGVwQ2FsbChmLCBzdGVwLnZhbHVlLCBlbnRyaWVzKSA9PT0gZmFsc2Upe1xyXG4gICAgICByZXR1cm4gY2xvc2VJdGVyYXRvcihpdGVyYXRvcik7XHJcbiAgICB9XHJcbiAgfSwgZ2V0SXRlcmF0b3IoaXRlcmFibGUpKTtcclxufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczYuc3ltYm9sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBFQ01BU2NyaXB0IDYgc3ltYm9scyBzaGltXHJcbiFmdW5jdGlvbihUQUcsIFN5bWJvbFJlZ2lzdHJ5LCBBbGxTeW1ib2xzLCBzZXR0ZXIpe1xyXG4gIC8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxyXG4gIGlmKCFpc05hdGl2ZShTeW1ib2wpKXtcclxuICAgIFN5bWJvbCA9IGZ1bmN0aW9uKGRlc2NyaXB0aW9uKXtcclxuICAgICAgYXNzZXJ0KCEodGhpcyBpbnN0YW5jZW9mIFN5bWJvbCksIFNZTUJPTCArICcgaXMgbm90IGEgJyArIENPTlNUUlVDVE9SKTtcclxuICAgICAgdmFyIHRhZyA9IHVpZChkZXNjcmlwdGlvbilcclxuICAgICAgICAsIHN5bSA9IHNldChjcmVhdGUoU3ltYm9sW1BST1RPVFlQRV0pLCBUQUcsIHRhZyk7XHJcbiAgICAgIEFsbFN5bWJvbHNbdGFnXSA9IHN5bTtcclxuICAgICAgREVTQyAmJiBzZXR0ZXIgJiYgZGVmaW5lUHJvcGVydHkoT2JqZWN0UHJvdG8sIHRhZywge1xyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKXtcclxuICAgICAgICAgIGhpZGRlbih0aGlzLCB0YWcsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gc3ltO1xyXG4gICAgfVxyXG4gICAgaGlkZGVuKFN5bWJvbFtQUk9UT1RZUEVdLCBUT19TVFJJTkcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiB0aGlzW1RBR107XHJcbiAgICB9KTtcclxuICB9XHJcbiAgJGRlZmluZShHTE9CQUwgKyBXUkFQLCB7U3ltYm9sOiBTeW1ib2x9KTtcclxuICBcclxuICB2YXIgc3ltYm9sU3RhdGljcyA9IHtcclxuICAgIC8vIDE5LjQuMi4xIFN5bWJvbC5mb3Ioa2V5KVxyXG4gICAgJ2Zvcic6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIHJldHVybiBoYXMoU3ltYm9sUmVnaXN0cnksIGtleSArPSAnJylcclxuICAgICAgICA/IFN5bWJvbFJlZ2lzdHJ5W2tleV1cclxuICAgICAgICA6IFN5bWJvbFJlZ2lzdHJ5W2tleV0gPSBTeW1ib2woa2V5KTtcclxuICAgIH0sXHJcbiAgICAvLyAxOS40LjIuNCBTeW1ib2wuaXRlcmF0b3JcclxuICAgIGl0ZXJhdG9yOiBTWU1CT0xfSVRFUkFUT1IgfHwgZ2V0V2VsbEtub3duU3ltYm9sKElURVJBVE9SKSxcclxuICAgIC8vIDE5LjQuMi41IFN5bWJvbC5rZXlGb3Ioc3ltKVxyXG4gICAga2V5Rm9yOiBwYXJ0LmNhbGwoa2V5T2YsIFN5bWJvbFJlZ2lzdHJ5KSxcclxuICAgIC8vIDE5LjQuMi4xMCBTeW1ib2wuc3BlY2llc1xyXG4gICAgc3BlY2llczogU1lNQk9MX1NQRUNJRVMsXHJcbiAgICAvLyAxOS40LjIuMTMgU3ltYm9sLnRvU3RyaW5nVGFnXHJcbiAgICB0b1N0cmluZ1RhZzogU1lNQk9MX1RBRyA9IGdldFdlbGxLbm93blN5bWJvbChUT19TVFJJTkdfVEFHLCB0cnVlKSxcclxuICAgIC8vIDE5LjQuMi4xNCBTeW1ib2wudW5zY29wYWJsZXNcclxuICAgIHVuc2NvcGFibGVzOiBTWU1CT0xfVU5TQ09QQUJMRVMsXHJcbiAgICBwdXJlOiBzYWZlU3ltYm9sLFxyXG4gICAgc2V0OiBzZXQsXHJcbiAgICB1c2VTZXR0ZXI6IGZ1bmN0aW9uKCl7c2V0dGVyID0gdHJ1ZX0sXHJcbiAgICB1c2VTaW1wbGU6IGZ1bmN0aW9uKCl7c2V0dGVyID0gZmFsc2V9XHJcbiAgfTtcclxuICAvLyAxOS40LjIuMiBTeW1ib2wuaGFzSW5zdGFuY2VcclxuICAvLyAxOS40LjIuMyBTeW1ib2wuaXNDb25jYXRTcHJlYWRhYmxlXHJcbiAgLy8gMTkuNC4yLjYgU3ltYm9sLm1hdGNoXHJcbiAgLy8gMTkuNC4yLjggU3ltYm9sLnJlcGxhY2VcclxuICAvLyAxOS40LjIuOSBTeW1ib2wuc2VhcmNoXHJcbiAgLy8gMTkuNC4yLjExIFN5bWJvbC5zcGxpdFxyXG4gIC8vIDE5LjQuMi4xMiBTeW1ib2wudG9QcmltaXRpdmVcclxuICBmb3JFYWNoLmNhbGwoYXJyYXkoJ2hhc0luc3RhbmNlLGlzQ29uY2F0U3ByZWFkYWJsZSxtYXRjaCxyZXBsYWNlLHNlYXJjaCxzcGxpdCx0b1ByaW1pdGl2ZScpLFxyXG4gICAgZnVuY3Rpb24oaXQpe1xyXG4gICAgICBzeW1ib2xTdGF0aWNzW2l0XSA9IGdldFdlbGxLbm93blN5bWJvbChpdCk7XHJcbiAgICB9XHJcbiAgKTtcclxuICAkZGVmaW5lKFNUQVRJQywgU1lNQk9MLCBzeW1ib2xTdGF0aWNzKTtcclxuICBcclxuICBzZXRUb1N0cmluZ1RhZyhTeW1ib2wsIFNZTUJPTCk7XHJcbiAgXHJcbiAgJGRlZmluZShTVEFUSUMgKyBGT1JDRUQgKiAhaXNOYXRpdmUoU3ltYm9sKSwgT0JKRUNULCB7XHJcbiAgICAvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxyXG4gICAgZ2V0T3duUHJvcGVydHlOYW1lczogZnVuY3Rpb24oaXQpe1xyXG4gICAgICB2YXIgbmFtZXMgPSBnZXROYW1lcyh0b09iamVjdChpdCkpLCByZXN1bHQgPSBbXSwga2V5LCBpID0gMDtcclxuICAgICAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSloYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH0sXHJcbiAgICAvLyAxOS4xLjIuOCBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKE8pXHJcbiAgICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6IGZ1bmN0aW9uKGl0KXtcclxuICAgICAgdmFyIG5hbWVzID0gZ2V0TmFtZXModG9PYmplY3QoaXQpKSwgcmVzdWx0ID0gW10sIGtleSwgaSA9IDA7XHJcbiAgICAgIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIHJlc3VsdC5wdXNoKEFsbFN5bWJvbHNba2V5XSk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbiAgLy8gMjAuMi4xLjkgTWF0aFtAQHRvU3RyaW5nVGFnXVxyXG4gIHNldFRvU3RyaW5nVGFnKE1hdGgsIE1BVEgsIHRydWUpO1xyXG4gIC8vIDI0LjMuMyBKU09OW0BAdG9TdHJpbmdUYWddXHJcbiAgc2V0VG9TdHJpbmdUYWcoZ2xvYmFsLkpTT04sICdKU09OJywgdHJ1ZSk7XHJcbn0oc2FmZVN5bWJvbCgndGFnJyksIHt9LCB7fSwgdHJ1ZSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNi5vYmplY3Quc3RhdGljcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbigpe1xyXG4gIHZhciBvYmplY3RTdGF0aWMgPSB7XHJcbiAgICAvLyAxOS4xLjMuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKVxyXG4gICAgYXNzaWduOiBhc3NpZ24sXHJcbiAgICAvLyAxOS4xLjMuMTAgT2JqZWN0LmlzKHZhbHVlMSwgdmFsdWUyKVxyXG4gICAgaXM6IGZ1bmN0aW9uKHgsIHkpe1xyXG4gICAgICByZXR1cm4geCA9PT0geSA/IHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5IDogeCAhPSB4ICYmIHkgIT0geTtcclxuICAgIH1cclxuICB9O1xyXG4gIC8vIDE5LjEuMy4xOSBPYmplY3Quc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pXHJcbiAgLy8gV29ya3Mgd2l0aCBfX3Byb3RvX18gb25seS4gT2xkIHY4IGNhbid0IHdvcmtzIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxyXG4gICdfX3Byb3RvX18nIGluIE9iamVjdFByb3RvICYmIGZ1bmN0aW9uKGJ1Z2d5LCBzZXQpe1xyXG4gICAgdHJ5IHtcclxuICAgICAgc2V0ID0gY3R4KGNhbGwsIGdldE93bkRlc2NyaXB0b3IoT2JqZWN0UHJvdG8sICdfX3Byb3RvX18nKS5zZXQsIDIpO1xyXG4gICAgICBzZXQoe30sIEFycmF5UHJvdG8pO1xyXG4gICAgfSBjYXRjaChlKXsgYnVnZ3kgPSB0cnVlIH1cclxuICAgIG9iamVjdFN0YXRpYy5zZXRQcm90b3R5cGVPZiA9IHNldFByb3RvdHlwZU9mID0gc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24oTywgcHJvdG8pe1xyXG4gICAgICBhc3NlcnRPYmplY3QoTyk7XHJcbiAgICAgIGFzc2VydChwcm90byA9PT0gbnVsbCB8fCBpc09iamVjdChwcm90byksIHByb3RvLCBcIjogY2FuJ3Qgc2V0IGFzIHByb3RvdHlwZSFcIik7XHJcbiAgICAgIGlmKGJ1Z2d5KU8uX19wcm90b19fID0gcHJvdG87XHJcbiAgICAgIGVsc2Ugc2V0KE8sIHByb3RvKTtcclxuICAgICAgcmV0dXJuIE87XHJcbiAgICB9XHJcbiAgfSgpO1xyXG4gICRkZWZpbmUoU1RBVElDLCBPQkpFQ1QsIG9iamVjdFN0YXRpYyk7XHJcbn0oKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM2Lm9iamVjdC5zdGF0aWNzLWFjY2VwdC1wcmltaXRpdmVzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKCl7XHJcbiAgLy8gT2JqZWN0IHN0YXRpYyBtZXRob2RzIGFjY2VwdCBwcmltaXRpdmVzXHJcbiAgZnVuY3Rpb24gd3JhcE9iamVjdE1ldGhvZChrZXksIE1PREUpe1xyXG4gICAgdmFyIGZuICA9IE9iamVjdFtrZXldXHJcbiAgICAgICwgZXhwID0gY29yZVtPQkpFQ1RdW2tleV1cclxuICAgICAgLCBmICAgPSAwXHJcbiAgICAgICwgbyAgID0ge307XHJcbiAgICBpZighZXhwIHx8IGlzTmF0aXZlKGV4cCkpe1xyXG4gICAgICBvW2tleV0gPSBNT0RFID09IDEgPyBmdW5jdGlvbihpdCl7XHJcbiAgICAgICAgcmV0dXJuIGlzT2JqZWN0KGl0KSA/IGZuKGl0KSA6IGl0O1xyXG4gICAgICB9IDogTU9ERSA9PSAyID8gZnVuY3Rpb24oaXQpe1xyXG4gICAgICAgIHJldHVybiBpc09iamVjdChpdCkgPyBmbihpdCkgOiB0cnVlO1xyXG4gICAgICB9IDogTU9ERSA9PSAzID8gZnVuY3Rpb24oaXQpe1xyXG4gICAgICAgIHJldHVybiBpc09iamVjdChpdCkgPyBmbihpdCkgOiBmYWxzZTtcclxuICAgICAgfSA6IE1PREUgPT0gNCA/IGZ1bmN0aW9uKGl0LCBrZXkpe1xyXG4gICAgICAgIHJldHVybiBmbih0b09iamVjdChpdCksIGtleSk7XHJcbiAgICAgIH0gOiBmdW5jdGlvbihpdCl7XHJcbiAgICAgICAgcmV0dXJuIGZuKHRvT2JqZWN0KGl0KSk7XHJcbiAgICAgIH07XHJcbiAgICAgIHRyeSB7IGZuKERPVCkgfVxyXG4gICAgICBjYXRjaChlKXsgZiA9IDEgfVxyXG4gICAgICAkZGVmaW5lKFNUQVRJQyArIEZPUkNFRCAqIGYsIE9CSkVDVCwgbyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHdyYXBPYmplY3RNZXRob2QoJ2ZyZWV6ZScsIDEpO1xyXG4gIHdyYXBPYmplY3RNZXRob2QoJ3NlYWwnLCAxKTtcclxuICB3cmFwT2JqZWN0TWV0aG9kKCdwcmV2ZW50RXh0ZW5zaW9ucycsIDEpO1xyXG4gIHdyYXBPYmplY3RNZXRob2QoJ2lzRnJvemVuJywgMik7XHJcbiAgd3JhcE9iamVjdE1ldGhvZCgnaXNTZWFsZWQnLCAyKTtcclxuICB3cmFwT2JqZWN0TWV0aG9kKCdpc0V4dGVuc2libGUnLCAzKTtcclxuICB3cmFwT2JqZWN0TWV0aG9kKCdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3InLCA0KTtcclxuICB3cmFwT2JqZWN0TWV0aG9kKCdnZXRQcm90b3R5cGVPZicpO1xyXG4gIHdyYXBPYmplY3RNZXRob2QoJ2tleXMnKTtcclxuICB3cmFwT2JqZWN0TWV0aG9kKCdnZXRPd25Qcm9wZXJ0eU5hbWVzJyk7XHJcbn0oKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM2Lm51bWJlci5zdGF0aWNzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKGlzSW50ZWdlcil7XHJcbiAgJGRlZmluZShTVEFUSUMsIE5VTUJFUiwge1xyXG4gICAgLy8gMjAuMS4yLjEgTnVtYmVyLkVQU0lMT05cclxuICAgIEVQU0lMT046IHBvdygyLCAtNTIpLFxyXG4gICAgLy8gMjAuMS4yLjIgTnVtYmVyLmlzRmluaXRlKG51bWJlcilcclxuICAgIGlzRmluaXRlOiBmdW5jdGlvbihpdCl7XHJcbiAgICAgIHJldHVybiB0eXBlb2YgaXQgPT0gJ251bWJlcicgJiYgaXNGaW5pdGUoaXQpO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjEuMi4zIE51bWJlci5pc0ludGVnZXIobnVtYmVyKVxyXG4gICAgaXNJbnRlZ2VyOiBpc0ludGVnZXIsXHJcbiAgICAvLyAyMC4xLjIuNCBOdW1iZXIuaXNOYU4obnVtYmVyKVxyXG4gICAgaXNOYU46IHNhbWVOYU4sXHJcbiAgICAvLyAyMC4xLjIuNSBOdW1iZXIuaXNTYWZlSW50ZWdlcihudW1iZXIpXHJcbiAgICBpc1NhZmVJbnRlZ2VyOiBmdW5jdGlvbihudW1iZXIpe1xyXG4gICAgICByZXR1cm4gaXNJbnRlZ2VyKG51bWJlcikgJiYgYWJzKG51bWJlcikgPD0gTUFYX1NBRkVfSU5URUdFUjtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4xLjIuNiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxyXG4gICAgTUFYX1NBRkVfSU5URUdFUjogTUFYX1NBRkVfSU5URUdFUixcclxuICAgIC8vIDIwLjEuMi4xMCBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUlxyXG4gICAgTUlOX1NBRkVfSU5URUdFUjogLU1BWF9TQUZFX0lOVEVHRVIsXHJcbiAgICAvLyAyMC4xLjIuMTIgTnVtYmVyLnBhcnNlRmxvYXQoc3RyaW5nKVxyXG4gICAgcGFyc2VGbG9hdDogcGFyc2VGbG9hdCxcclxuICAgIC8vIDIwLjEuMi4xMyBOdW1iZXIucGFyc2VJbnQoc3RyaW5nLCByYWRpeClcclxuICAgIHBhcnNlSW50OiBwYXJzZUludFxyXG4gIH0pO1xyXG4vLyAyMC4xLjIuMyBOdW1iZXIuaXNJbnRlZ2VyKG51bWJlcilcclxufShOdW1iZXIuaXNJbnRlZ2VyIHx8IGZ1bmN0aW9uKGl0KXtcclxuICByZXR1cm4gIWlzT2JqZWN0KGl0KSAmJiBpc0Zpbml0ZShpdCkgJiYgZmxvb3IoaXQpID09PSBpdDtcclxufSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNi5tYXRoICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIEVDTUFTY3JpcHQgNiBzaGltXHJcbiFmdW5jdGlvbigpe1xyXG4gIC8vIDIwLjIuMi4yOCBNYXRoLnNpZ24oeClcclxuICB2YXIgRSAgICA9IE1hdGguRVxyXG4gICAgLCBleHAgID0gTWF0aC5leHBcclxuICAgICwgbG9nICA9IE1hdGgubG9nXHJcbiAgICAsIHNxcnQgPSBNYXRoLnNxcnRcclxuICAgICwgc2lnbiA9IE1hdGguc2lnbiB8fCBmdW5jdGlvbih4KXtcclxuICAgICAgICByZXR1cm4gKHggPSAreCkgPT0gMCB8fCB4ICE9IHggPyB4IDogeCA8IDAgPyAtMSA6IDE7XHJcbiAgICAgIH07XHJcbiAgXHJcbiAgLy8gMjAuMi4yLjUgTWF0aC5hc2luaCh4KVxyXG4gIGZ1bmN0aW9uIGFzaW5oKHgpe1xyXG4gICAgcmV0dXJuICFpc0Zpbml0ZSh4ID0gK3gpIHx8IHggPT0gMCA/IHggOiB4IDwgMCA/IC1hc2luaCgteCkgOiBsb2coeCArIHNxcnQoeCAqIHggKyAxKSk7XHJcbiAgfVxyXG4gIC8vIDIwLjIuMi4xNCBNYXRoLmV4cG0xKHgpXHJcbiAgZnVuY3Rpb24gZXhwbTEoeCl7XHJcbiAgICByZXR1cm4gKHggPSAreCkgPT0gMCA/IHggOiB4ID4gLTFlLTYgJiYgeCA8IDFlLTYgPyB4ICsgeCAqIHggLyAyIDogZXhwKHgpIC0gMTtcclxuICB9XHJcbiAgICBcclxuICAkZGVmaW5lKFNUQVRJQywgTUFUSCwge1xyXG4gICAgLy8gMjAuMi4yLjMgTWF0aC5hY29zaCh4KVxyXG4gICAgYWNvc2g6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICByZXR1cm4gKHggPSAreCkgPCAxID8gTmFOIDogaXNGaW5pdGUoeCkgPyBsb2coeCAvIEUgKyBzcXJ0KHggKyAxKSAqIHNxcnQoeCAtIDEpIC8gRSkgKyAxIDogeDtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuNSBNYXRoLmFzaW5oKHgpXHJcbiAgICBhc2luaDogYXNpbmgsXHJcbiAgICAvLyAyMC4yLjIuNyBNYXRoLmF0YW5oKHgpXHJcbiAgICBhdGFuaDogZnVuY3Rpb24oeCl7XHJcbiAgICAgIHJldHVybiAoeCA9ICt4KSA9PSAwID8geCA6IGxvZygoMSArIHgpIC8gKDEgLSB4KSkgLyAyO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjIuMi45IE1hdGguY2JydCh4KVxyXG4gICAgY2JydDogZnVuY3Rpb24oeCl7XHJcbiAgICAgIHJldHVybiBzaWduKHggPSAreCkgKiBwb3coYWJzKHgpLCAxIC8gMyk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjExIE1hdGguY2x6MzIoeClcclxuICAgIGNsejMyOiBmdW5jdGlvbih4KXtcclxuICAgICAgcmV0dXJuICh4ID4+Pj0gMCkgPyAzMiAtIHhbVE9fU1RSSU5HXSgyKS5sZW5ndGggOiAzMjtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuMTIgTWF0aC5jb3NoKHgpXHJcbiAgICBjb3NoOiBmdW5jdGlvbih4KXtcclxuICAgICAgcmV0dXJuIChleHAoeCA9ICt4KSArIGV4cCgteCkpIC8gMjtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuMTQgTWF0aC5leHBtMSh4KVxyXG4gICAgZXhwbTE6IGV4cG0xLFxyXG4gICAgLy8gMjAuMi4yLjE2IE1hdGguZnJvdW5kKHgpXHJcbiAgICAvLyBUT0RPOiBmYWxsYmFjayBmb3IgSUU5LVxyXG4gICAgZnJvdW5kOiBmdW5jdGlvbih4KXtcclxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3hdKVswXTtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuMTcgTWF0aC5oeXBvdChbdmFsdWUxWywgdmFsdWUyWywg4oCmIF1dXSlcclxuICAgIGh5cG90OiBmdW5jdGlvbih2YWx1ZTEsIHZhbHVlMil7XHJcbiAgICAgIHZhciBzdW0gID0gMFxyXG4gICAgICAgICwgbGVuMSA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAsIGxlbjIgPSBsZW4xXHJcbiAgICAgICAgLCBhcmdzID0gQXJyYXkobGVuMSlcclxuICAgICAgICAsIGxhcmcgPSAtSW5maW5pdHlcclxuICAgICAgICAsIGFyZztcclxuICAgICAgd2hpbGUobGVuMS0tKXtcclxuICAgICAgICBhcmcgPSBhcmdzW2xlbjFdID0gK2FyZ3VtZW50c1tsZW4xXTtcclxuICAgICAgICBpZihhcmcgPT0gSW5maW5pdHkgfHwgYXJnID09IC1JbmZpbml0eSlyZXR1cm4gSW5maW5pdHk7XHJcbiAgICAgICAgaWYoYXJnID4gbGFyZylsYXJnID0gYXJnO1xyXG4gICAgICB9XHJcbiAgICAgIGxhcmcgPSBhcmcgfHwgMTtcclxuICAgICAgd2hpbGUobGVuMi0tKXN1bSArPSBwb3coYXJnc1tsZW4yXSAvIGxhcmcsIDIpO1xyXG4gICAgICByZXR1cm4gbGFyZyAqIHNxcnQoc3VtKTtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuMTggTWF0aC5pbXVsKHgsIHkpXHJcbiAgICBpbXVsOiBmdW5jdGlvbih4LCB5KXtcclxuICAgICAgdmFyIFVJbnQxNiA9IDB4ZmZmZlxyXG4gICAgICAgICwgeG4gPSAreFxyXG4gICAgICAgICwgeW4gPSAreVxyXG4gICAgICAgICwgeGwgPSBVSW50MTYgJiB4blxyXG4gICAgICAgICwgeWwgPSBVSW50MTYgJiB5bjtcclxuICAgICAgcmV0dXJuIDAgfCB4bCAqIHlsICsgKChVSW50MTYgJiB4biA+Pj4gMTYpICogeWwgKyB4bCAqIChVSW50MTYgJiB5biA+Pj4gMTYpIDw8IDE2ID4+PiAwKTtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuMjAgTWF0aC5sb2cxcCh4KVxyXG4gICAgbG9nMXA6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICByZXR1cm4gKHggPSAreCkgPiAtMWUtOCAmJiB4IDwgMWUtOCA/IHggLSB4ICogeCAvIDIgOiBsb2coMSArIHgpO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjIuMi4yMSBNYXRoLmxvZzEwKHgpXHJcbiAgICBsb2cxMDogZnVuY3Rpb24oeCl7XHJcbiAgICAgIHJldHVybiBsb2coeCkgLyBNYXRoLkxOMTA7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjIyIE1hdGgubG9nMih4KVxyXG4gICAgbG9nMjogZnVuY3Rpb24oeCl7XHJcbiAgICAgIHJldHVybiBsb2coeCkgLyBNYXRoLkxOMjtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuMjggTWF0aC5zaWduKHgpXHJcbiAgICBzaWduOiBzaWduLFxyXG4gICAgLy8gMjAuMi4yLjMwIE1hdGguc2luaCh4KVxyXG4gICAgc2luaDogZnVuY3Rpb24oeCl7XHJcbiAgICAgIHJldHVybiAoYWJzKHggPSAreCkgPCAxKSA/IChleHBtMSh4KSAtIGV4cG0xKC14KSkgLyAyIDogKGV4cCh4IC0gMSkgLSBleHAoLXggLSAxKSkgKiAoRSAvIDIpO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjIuMi4zMyBNYXRoLnRhbmgoeClcclxuICAgIHRhbmg6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICB2YXIgYSA9IGV4cG0xKHggPSAreClcclxuICAgICAgICAsIGIgPSBleHBtMSgteCk7XHJcbiAgICAgIHJldHVybiBhID09IEluZmluaXR5ID8gMSA6IGIgPT0gSW5maW5pdHkgPyAtMSA6IChhIC0gYikgLyAoZXhwKHgpICsgZXhwKC14KSk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjM0IE1hdGgudHJ1bmMoeClcclxuICAgIHRydW5jOiB0cnVuY1xyXG4gIH0pO1xyXG59KCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNi5zdHJpbmcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbihmcm9tQ2hhckNvZGUpe1xyXG4gIGZ1bmN0aW9uIGFzc2VydE5vdFJlZ0V4cChpdCl7XHJcbiAgICBpZihjb2YoaXQpID09IFJFR0VYUCl0aHJvdyBUeXBlRXJyb3IoKTtcclxuICB9XHJcbiAgXHJcbiAgJGRlZmluZShTVEFUSUMsIFNUUklORywge1xyXG4gICAgLy8gMjEuMS4yLjIgU3RyaW5nLmZyb21Db2RlUG9pbnQoLi4uY29kZVBvaW50cylcclxuICAgIGZyb21Db2RlUG9pbnQ6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICB2YXIgcmVzID0gW11cclxuICAgICAgICAsIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAsIGkgICA9IDBcclxuICAgICAgICAsIGNvZGVcclxuICAgICAgd2hpbGUobGVuID4gaSl7XHJcbiAgICAgICAgY29kZSA9ICthcmd1bWVudHNbaSsrXTtcclxuICAgICAgICBpZih0b0luZGV4KGNvZGUsIDB4MTBmZmZmKSAhPT0gY29kZSl0aHJvdyBSYW5nZUVycm9yKGNvZGUgKyAnIGlzIG5vdCBhIHZhbGlkIGNvZGUgcG9pbnQnKTtcclxuICAgICAgICByZXMucHVzaChjb2RlIDwgMHgxMDAwMFxyXG4gICAgICAgICAgPyBmcm9tQ2hhckNvZGUoY29kZSlcclxuICAgICAgICAgIDogZnJvbUNoYXJDb2RlKCgoY29kZSAtPSAweDEwMDAwKSA+PiAxMCkgKyAweGQ4MDAsIGNvZGUgJSAweDQwMCArIDB4ZGMwMClcclxuICAgICAgICApO1xyXG4gICAgICB9IHJldHVybiByZXMuam9pbignJyk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjEuMS4yLjQgU3RyaW5nLnJhdyhjYWxsU2l0ZSwgLi4uc3Vic3RpdHV0aW9ucylcclxuICAgIHJhdzogZnVuY3Rpb24oY2FsbFNpdGUpe1xyXG4gICAgICB2YXIgcmF3ID0gdG9PYmplY3QoY2FsbFNpdGUucmF3KVxyXG4gICAgICAgICwgbGVuID0gdG9MZW5ndGgocmF3Lmxlbmd0aClcclxuICAgICAgICAsIHNsbiA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAsIHJlcyA9IFtdXHJcbiAgICAgICAgLCBpICAgPSAwO1xyXG4gICAgICB3aGlsZShsZW4gPiBpKXtcclxuICAgICAgICByZXMucHVzaChTdHJpbmcocmF3W2krK10pKTtcclxuICAgICAgICBpZihpIDwgc2xuKXJlcy5wdXNoKFN0cmluZyhhcmd1bWVudHNbaV0pKTtcclxuICAgICAgfSByZXR1cm4gcmVzLmpvaW4oJycpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIFxyXG4gICRkZWZpbmUoUFJPVE8sIFNUUklORywge1xyXG4gICAgLy8gMjEuMS4zLjMgU3RyaW5nLnByb3RvdHlwZS5jb2RlUG9pbnRBdChwb3MpXHJcbiAgICBjb2RlUG9pbnRBdDogY3JlYXRlUG9pbnRBdChmYWxzZSksXHJcbiAgICAvLyAyMS4xLjMuNiBTdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoKHNlYXJjaFN0cmluZyBbLCBlbmRQb3NpdGlvbl0pXHJcbiAgICBlbmRzV2l0aDogZnVuY3Rpb24oc2VhcmNoU3RyaW5nIC8qLCBlbmRQb3NpdGlvbiA9IEBsZW5ndGggKi8pe1xyXG4gICAgICBhc3NlcnROb3RSZWdFeHAoc2VhcmNoU3RyaW5nKTtcclxuICAgICAgdmFyIHRoYXQgPSBTdHJpbmcoYXNzZXJ0RGVmaW5lZCh0aGlzKSlcclxuICAgICAgICAsIGVuZFBvc2l0aW9uID0gYXJndW1lbnRzWzFdXHJcbiAgICAgICAgLCBsZW4gPSB0b0xlbmd0aCh0aGF0Lmxlbmd0aClcclxuICAgICAgICAsIGVuZCA9IGVuZFBvc2l0aW9uID09PSB1bmRlZmluZWQgPyBsZW4gOiBtaW4odG9MZW5ndGgoZW5kUG9zaXRpb24pLCBsZW4pO1xyXG4gICAgICBzZWFyY2hTdHJpbmcgKz0gJyc7XHJcbiAgICAgIHJldHVybiB0aGF0LnNsaWNlKGVuZCAtIHNlYXJjaFN0cmluZy5sZW5ndGgsIGVuZCkgPT09IHNlYXJjaFN0cmluZztcclxuICAgIH0sXHJcbiAgICAvLyAyMS4xLjMuNyBTdHJpbmcucHJvdG90eXBlLmluY2x1ZGVzKHNlYXJjaFN0cmluZywgcG9zaXRpb24gPSAwKVxyXG4gICAgaW5jbHVkZXM6IGZ1bmN0aW9uKHNlYXJjaFN0cmluZyAvKiwgcG9zaXRpb24gPSAwICovKXtcclxuICAgICAgYXNzZXJ0Tm90UmVnRXhwKHNlYXJjaFN0cmluZyk7XHJcbiAgICAgIHJldHVybiAhIX5TdHJpbmcoYXNzZXJ0RGVmaW5lZCh0aGlzKSkuaW5kZXhPZihzZWFyY2hTdHJpbmcsIGFyZ3VtZW50c1sxXSk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjEuMS4zLjEzIFN0cmluZy5wcm90b3R5cGUucmVwZWF0KGNvdW50KVxyXG4gICAgcmVwZWF0OiBmdW5jdGlvbihjb3VudCl7XHJcbiAgICAgIHZhciBzdHIgPSBTdHJpbmcoYXNzZXJ0RGVmaW5lZCh0aGlzKSlcclxuICAgICAgICAsIHJlcyA9ICcnXHJcbiAgICAgICAgLCBuICAgPSB0b0ludGVnZXIoY291bnQpO1xyXG4gICAgICBpZigwID4gbiB8fCBuID09IEluZmluaXR5KXRocm93IFJhbmdlRXJyb3IoXCJDb3VudCBjYW4ndCBiZSBuZWdhdGl2ZVwiKTtcclxuICAgICAgZm9yKDtuID4gMDsgKG4gPj4+PSAxKSAmJiAoc3RyICs9IHN0cikpaWYobiAmIDEpcmVzICs9IHN0cjtcclxuICAgICAgcmV0dXJuIHJlcztcclxuICAgIH0sXHJcbiAgICAvLyAyMS4xLjMuMTggU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoKHNlYXJjaFN0cmluZyBbLCBwb3NpdGlvbiBdKVxyXG4gICAgc3RhcnRzV2l0aDogZnVuY3Rpb24oc2VhcmNoU3RyaW5nIC8qLCBwb3NpdGlvbiA9IDAgKi8pe1xyXG4gICAgICBhc3NlcnROb3RSZWdFeHAoc2VhcmNoU3RyaW5nKTtcclxuICAgICAgdmFyIHRoYXQgID0gU3RyaW5nKGFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAgICAgLCBpbmRleCA9IHRvTGVuZ3RoKG1pbihhcmd1bWVudHNbMV0sIHRoYXQubGVuZ3RoKSk7XHJcbiAgICAgIHNlYXJjaFN0cmluZyArPSAnJztcclxuICAgICAgcmV0dXJuIHRoYXQuc2xpY2UoaW5kZXgsIGluZGV4ICsgc2VhcmNoU3RyaW5nLmxlbmd0aCkgPT09IHNlYXJjaFN0cmluZztcclxuICAgIH1cclxuICB9KTtcclxufShTdHJpbmcuZnJvbUNoYXJDb2RlKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM2LmFycmF5LnN0YXRpY3MgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKCl7XHJcbiAgJGRlZmluZShTVEFUSUMgKyBGT1JDRUQgKiBjaGVja0Rhbmdlckl0ZXJDbG9zaW5nKEFycmF5LmZyb20pLCBBUlJBWSwge1xyXG4gICAgLy8gMjIuMS4yLjEgQXJyYXkuZnJvbShhcnJheUxpa2UsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxyXG4gICAgZnJvbTogZnVuY3Rpb24oYXJyYXlMaWtlLyosIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKi8pe1xyXG4gICAgICB2YXIgTyAgICAgICA9IE9iamVjdChhc3NlcnREZWZpbmVkKGFycmF5TGlrZSkpXHJcbiAgICAgICAgLCBtYXBmbiAgID0gYXJndW1lbnRzWzFdXHJcbiAgICAgICAgLCBtYXBwaW5nID0gbWFwZm4gIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICwgZiAgICAgICA9IG1hcHBpbmcgPyBjdHgobWFwZm4sIGFyZ3VtZW50c1syXSwgMikgOiB1bmRlZmluZWRcclxuICAgICAgICAsIGluZGV4ICAgPSAwXHJcbiAgICAgICAgLCBsZW5ndGgsIHJlc3VsdCwgc3RlcDtcclxuICAgICAgaWYoaXNJdGVyYWJsZShPKSl7XHJcbiAgICAgICAgcmVzdWx0ID0gbmV3IChnZW5lcmljKHRoaXMsIEFycmF5KSk7XHJcbiAgICAgICAgc2FmZUl0ZXJDbG9zZShmdW5jdGlvbihpdGVyYXRvcil7XHJcbiAgICAgICAgICBmb3IoOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGluZGV4Kyspe1xyXG4gICAgICAgICAgICByZXN1bHRbaW5kZXhdID0gbWFwcGluZyA/IGYoc3RlcC52YWx1ZSwgaW5kZXgpIDogc3RlcC52YWx1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCBnZXRJdGVyYXRvcihPKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0ID0gbmV3IChnZW5lcmljKHRoaXMsIEFycmF5KSkobGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpKTtcclxuICAgICAgICBmb3IoOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKyl7XHJcbiAgICAgICAgICByZXN1bHRbaW5kZXhdID0gbWFwcGluZyA/IGYoT1tpbmRleF0sIGluZGV4KSA6IE9baW5kZXhdO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXN1bHQubGVuZ3RoID0gaW5kZXg7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbiAgJGRlZmluZShTVEFUSUMsIEFSUkFZLCB7XHJcbiAgICAvLyAyMi4xLjIuMyBBcnJheS5vZiggLi4uaXRlbXMpXHJcbiAgICBvZjogZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XHJcbiAgICAgIHZhciBpbmRleCAgPSAwXHJcbiAgICAgICAgLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICAgLCByZXN1bHQgPSBuZXcgKGdlbmVyaWModGhpcywgQXJyYXkpKShsZW5ndGgpO1xyXG4gICAgICB3aGlsZShsZW5ndGggPiBpbmRleClyZXN1bHRbaW5kZXhdID0gYXJndW1lbnRzW2luZGV4KytdO1xyXG4gICAgICByZXN1bHQubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIFxyXG4gIHNldFNwZWNpZXMoQXJyYXkpO1xyXG59KCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNi5hcnJheS5wcm90b3R5cGUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbigpe1xyXG4gICRkZWZpbmUoUFJPVE8sIEFSUkFZLCB7XHJcbiAgICAvLyAyMi4xLjMuMyBBcnJheS5wcm90b3R5cGUuY29weVdpdGhpbih0YXJnZXQsIHN0YXJ0LCBlbmQgPSB0aGlzLmxlbmd0aClcclxuICAgIGNvcHlXaXRoaW46IGZ1bmN0aW9uKHRhcmdldCAvKiA9IDAgKi8sIHN0YXJ0IC8qID0gMCwgZW5kID0gQGxlbmd0aCAqLyl7XHJcbiAgICAgIHZhciBPICAgICA9IE9iamVjdChhc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAgICwgbGVuICAgPSB0b0xlbmd0aChPLmxlbmd0aClcclxuICAgICAgICAsIHRvICAgID0gdG9JbmRleCh0YXJnZXQsIGxlbilcclxuICAgICAgICAsIGZyb20gID0gdG9JbmRleChzdGFydCwgbGVuKVxyXG4gICAgICAgICwgZW5kICAgPSBhcmd1bWVudHNbMl1cclxuICAgICAgICAsIGZpbiAgID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB0b0luZGV4KGVuZCwgbGVuKVxyXG4gICAgICAgICwgY291bnQgPSBtaW4oZmluIC0gZnJvbSwgbGVuIC0gdG8pXHJcbiAgICAgICAgLCBpbmMgICA9IDE7XHJcbiAgICAgIGlmKGZyb20gPCB0byAmJiB0byA8IGZyb20gKyBjb3VudCl7XHJcbiAgICAgICAgaW5jICA9IC0xO1xyXG4gICAgICAgIGZyb20gPSBmcm9tICsgY291bnQgLSAxO1xyXG4gICAgICAgIHRvICAgPSB0byArIGNvdW50IC0gMTtcclxuICAgICAgfVxyXG4gICAgICB3aGlsZShjb3VudC0tID4gMCl7XHJcbiAgICAgICAgaWYoZnJvbSBpbiBPKU9bdG9dID0gT1tmcm9tXTtcclxuICAgICAgICBlbHNlIGRlbGV0ZSBPW3RvXTtcclxuICAgICAgICB0byArPSBpbmM7XHJcbiAgICAgICAgZnJvbSArPSBpbmM7XHJcbiAgICAgIH0gcmV0dXJuIE87XHJcbiAgICB9LFxyXG4gICAgLy8gMjIuMS4zLjYgQXJyYXkucHJvdG90eXBlLmZpbGwodmFsdWUsIHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5sZW5ndGgpXHJcbiAgICBmaWxsOiBmdW5jdGlvbih2YWx1ZSAvKiwgc3RhcnQgPSAwLCBlbmQgPSBAbGVuZ3RoICovKXtcclxuICAgICAgdmFyIE8gICAgICA9IE9iamVjdChhc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXHJcbiAgICAgICAgLCBpbmRleCAgPSB0b0luZGV4KGFyZ3VtZW50c1sxXSwgbGVuZ3RoKVxyXG4gICAgICAgICwgZW5kICAgID0gYXJndW1lbnRzWzJdXHJcbiAgICAgICAgLCBlbmRQb3MgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IHRvSW5kZXgoZW5kLCBsZW5ndGgpO1xyXG4gICAgICB3aGlsZShlbmRQb3MgPiBpbmRleClPW2luZGV4KytdID0gdmFsdWU7XHJcbiAgICAgIHJldHVybiBPO1xyXG4gICAgfSxcclxuICAgIC8vIDIyLjEuMy44IEFycmF5LnByb3RvdHlwZS5maW5kKHByZWRpY2F0ZSwgdGhpc0FyZyA9IHVuZGVmaW5lZClcclxuICAgIGZpbmQ6IGNyZWF0ZUFycmF5TWV0aG9kKDUpLFxyXG4gICAgLy8gMjIuMS4zLjkgQXJyYXkucHJvdG90eXBlLmZpbmRJbmRleChwcmVkaWNhdGUsIHRoaXNBcmcgPSB1bmRlZmluZWQpXHJcbiAgICBmaW5kSW5kZXg6IGNyZWF0ZUFycmF5TWV0aG9kKDYpXHJcbiAgfSk7XHJcbiAgXHJcbiAgaWYoZnJhbWV3b3JrKXtcclxuICAgIC8vIDIyLjEuMy4zMSBBcnJheS5wcm90b3R5cGVbQEB1bnNjb3BhYmxlc11cclxuICAgIGZvckVhY2guY2FsbChhcnJheSgnZmluZCxmaW5kSW5kZXgsZmlsbCxjb3B5V2l0aGluLGVudHJpZXMsa2V5cyx2YWx1ZXMnKSwgZnVuY3Rpb24oaXQpe1xyXG4gICAgICBBcnJheVVuc2NvcGFibGVzW2l0XSA9IHRydWU7XHJcbiAgICB9KTtcclxuICAgIFNZTUJPTF9VTlNDT1BBQkxFUyBpbiBBcnJheVByb3RvIHx8IGhpZGRlbihBcnJheVByb3RvLCBTWU1CT0xfVU5TQ09QQUJMRVMsIEFycmF5VW5zY29wYWJsZXMpO1xyXG4gIH1cclxufSgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczYuaXRlcmF0b3JzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oYXQpe1xyXG4gIC8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcclxuICAvLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxyXG4gIC8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcclxuICAvLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcclxuICBkZWZpbmVTdGRJdGVyYXRvcnMoQXJyYXksIEFSUkFZLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XHJcbiAgICBzZXQodGhpcywgSVRFUiwge286IHRvT2JqZWN0KGl0ZXJhdGVkKSwgaTogMCwgazoga2luZH0pO1xyXG4gIC8vIDIyLjEuNS4yLjEgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxyXG4gIH0sIGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgaXRlciAgPSB0aGlzW0lURVJdXHJcbiAgICAgICwgTyAgICAgPSBpdGVyLm9cclxuICAgICAgLCBraW5kICA9IGl0ZXIua1xyXG4gICAgICAsIGluZGV4ID0gaXRlci5pKys7XHJcbiAgICBpZighTyB8fCBpbmRleCA+PSBPLmxlbmd0aCl7XHJcbiAgICAgIGl0ZXIubyA9IHVuZGVmaW5lZDtcclxuICAgICAgcmV0dXJuIGl0ZXJSZXN1bHQoMSk7XHJcbiAgICB9XHJcbiAgICBpZihraW5kID09IEtFWSkgIHJldHVybiBpdGVyUmVzdWx0KDAsIGluZGV4KTtcclxuICAgIGlmKGtpbmQgPT0gVkFMVUUpcmV0dXJuIGl0ZXJSZXN1bHQoMCwgT1tpbmRleF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlclJlc3VsdCgwLCBbaW5kZXgsIE9baW5kZXhdXSk7XHJcbiAgfSwgVkFMVUUpO1xyXG4gIFxyXG4gIC8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJSAoOS40LjQuNiwgOS40LjQuNylcclxuICBJdGVyYXRvcnNbQVJHVU1FTlRTXSA9IEl0ZXJhdG9yc1tBUlJBWV07XHJcbiAgXHJcbiAgLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxyXG4gIGRlZmluZVN0ZEl0ZXJhdG9ycyhTdHJpbmcsIFNUUklORywgZnVuY3Rpb24oaXRlcmF0ZWQpe1xyXG4gICAgc2V0KHRoaXMsIElURVIsIHtvOiBTdHJpbmcoaXRlcmF0ZWQpLCBpOiAwfSk7XHJcbiAgLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxyXG4gIH0sIGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgaXRlciAgPSB0aGlzW0lURVJdXHJcbiAgICAgICwgTyAgICAgPSBpdGVyLm9cclxuICAgICAgLCBpbmRleCA9IGl0ZXIuaVxyXG4gICAgICAsIHBvaW50O1xyXG4gICAgaWYoaW5kZXggPj0gTy5sZW5ndGgpcmV0dXJuIGl0ZXJSZXN1bHQoMSk7XHJcbiAgICBwb2ludCA9IGF0LmNhbGwoTywgaW5kZXgpO1xyXG4gICAgaXRlci5pICs9IHBvaW50Lmxlbmd0aDtcclxuICAgIHJldHVybiBpdGVyUmVzdWx0KDAsIHBvaW50KTtcclxuICB9KTtcclxufShjcmVhdGVQb2ludEF0KHRydWUpKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogd2ViLmltbWVkaWF0ZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gc2V0SW1tZWRpYXRlIHNoaW1cclxuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgZWxzZTpcclxuaXNGdW5jdGlvbihzZXRJbW1lZGlhdGUpICYmIGlzRnVuY3Rpb24oY2xlYXJJbW1lZGlhdGUpIHx8IGZ1bmN0aW9uKE9OUkVBRFlTVEFURUNIQU5HRSl7XHJcbiAgdmFyIHBvc3RNZXNzYWdlICAgICAgPSBnbG9iYWwucG9zdE1lc3NhZ2VcclxuICAgICwgYWRkRXZlbnRMaXN0ZW5lciA9IGdsb2JhbC5hZGRFdmVudExpc3RlbmVyXHJcbiAgICAsIE1lc3NhZ2VDaGFubmVsICAgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWxcclxuICAgICwgY291bnRlciAgICAgICAgICA9IDBcclxuICAgICwgcXVldWUgICAgICAgICAgICA9IHt9XHJcbiAgICAsIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xyXG4gIHNldEltbWVkaWF0ZSA9IGZ1bmN0aW9uKGZuKXtcclxuICAgIHZhciBhcmdzID0gW10sIGkgPSAxO1xyXG4gICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcclxuICAgIHF1ZXVlWysrY291bnRlcl0gPSBmdW5jdGlvbigpe1xyXG4gICAgICBpbnZva2UoaXNGdW5jdGlvbihmbikgPyBmbiA6IEZ1bmN0aW9uKGZuKSwgYXJncyk7XHJcbiAgICB9XHJcbiAgICBkZWZlcihjb3VudGVyKTtcclxuICAgIHJldHVybiBjb3VudGVyO1xyXG4gIH1cclxuICBjbGVhckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGlkKXtcclxuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIHJ1bihpZCl7XHJcbiAgICBpZihoYXMocXVldWUsIGlkKSl7XHJcbiAgICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcclxuICAgICAgZGVsZXRlIHF1ZXVlW2lkXTtcclxuICAgICAgZm4oKTtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gbGlzdG5lcihldmVudCl7XHJcbiAgICBydW4oZXZlbnQuZGF0YSk7XHJcbiAgfVxyXG4gIC8vIE5vZGUuanMgMC44LVxyXG4gIGlmKE5PREUpe1xyXG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XHJcbiAgICAgIG5leHRUaWNrKHBhcnQuY2FsbChydW4sIGlkKSk7XHJcbiAgICB9XHJcbiAgLy8gTW9kZXJuIGJyb3dzZXJzLCBza2lwIGltcGxlbWVudGF0aW9uIGZvciBXZWJXb3JrZXJzXHJcbiAgLy8gSUU4IGhhcyBwb3N0TWVzc2FnZSwgYnV0IGl0J3Mgc3luYyAmIHR5cGVvZiBpdHMgcG9zdE1lc3NhZ2UgaXMgb2JqZWN0XHJcbiAgfSBlbHNlIGlmKGFkZEV2ZW50TGlzdGVuZXIgJiYgaXNGdW5jdGlvbihwb3N0TWVzc2FnZSkgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKXtcclxuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xyXG4gICAgICBwb3N0TWVzc2FnZShpZCwgJyonKTtcclxuICAgIH1cclxuICAgIGFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0bmVyLCBmYWxzZSk7XHJcbiAgLy8gV2ViV29ya2Vyc1xyXG4gIH0gZWxzZSBpZihpc0Z1bmN0aW9uKE1lc3NhZ2VDaGFubmVsKSl7XHJcbiAgICBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsO1xyXG4gICAgcG9ydCAgICA9IGNoYW5uZWwucG9ydDI7XHJcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RuZXI7XHJcbiAgICBkZWZlciA9IGN0eChwb3J0LnBvc3RNZXNzYWdlLCBwb3J0LCAxKTtcclxuICAvLyBJRTgtXHJcbiAgfSBlbHNlIGlmKGRvY3VtZW50ICYmIE9OUkVBRFlTVEFURUNIQU5HRSBpbiBkb2N1bWVudFtDUkVBVEVfRUxFTUVOVF0oJ3NjcmlwdCcpKXtcclxuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xyXG4gICAgICBodG1sLmFwcGVuZENoaWxkKGRvY3VtZW50W0NSRUFURV9FTEVNRU5UXSgnc2NyaXB0JykpW09OUkVBRFlTVEFURUNIQU5HRV0gPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XHJcbiAgICAgICAgcnVuKGlkKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIC8vIFJlc3Qgb2xkIGJyb3dzZXJzXHJcbiAgfSBlbHNlIHtcclxuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xyXG4gICAgICBzZXRUaW1lb3V0KHJ1biwgMCwgaWQpO1xyXG4gICAgfVxyXG4gIH1cclxufSgnb25yZWFkeXN0YXRlY2hhbmdlJyk7XHJcbiRkZWZpbmUoR0xPQkFMICsgQklORCwge1xyXG4gIHNldEltbWVkaWF0ZTogICBzZXRJbW1lZGlhdGUsXHJcbiAgY2xlYXJJbW1lZGlhdGU6IGNsZWFySW1tZWRpYXRlXHJcbn0pO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczYucHJvbWlzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBFUzYgcHJvbWlzZXMgc2hpbVxyXG4vLyBCYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vZ2V0aWZ5L25hdGl2ZS1wcm9taXNlLW9ubHkvXHJcbiFmdW5jdGlvbihQcm9taXNlLCB0ZXN0KXtcclxuICBpc0Z1bmN0aW9uKFByb21pc2UpICYmIGlzRnVuY3Rpb24oUHJvbWlzZS5yZXNvbHZlKVxyXG4gICYmIFByb21pc2UucmVzb2x2ZSh0ZXN0ID0gbmV3IFByb21pc2UoZnVuY3Rpb24oKXt9KSkgPT0gdGVzdFxyXG4gIHx8IGZ1bmN0aW9uKGFzYXAsIFJFQ09SRCl7XHJcbiAgICBmdW5jdGlvbiBpc1RoZW5hYmxlKGl0KXtcclxuICAgICAgdmFyIHRoZW47XHJcbiAgICAgIGlmKGlzT2JqZWN0KGl0KSl0aGVuID0gaXQudGhlbjtcclxuICAgICAgcmV0dXJuIGlzRnVuY3Rpb24odGhlbikgPyB0aGVuIDogZmFsc2U7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBoYW5kbGVkUmVqZWN0aW9uT3JIYXNPblJlamVjdGVkKHByb21pc2Upe1xyXG4gICAgICB2YXIgcmVjb3JkID0gcHJvbWlzZVtSRUNPUkRdXHJcbiAgICAgICAgLCBjaGFpbiAgPSByZWNvcmQuY1xyXG4gICAgICAgICwgaSAgICAgID0gMFxyXG4gICAgICAgICwgcmVhY3Q7XHJcbiAgICAgIGlmKHJlY29yZC5oKXJldHVybiB0cnVlO1xyXG4gICAgICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXtcclxuICAgICAgICByZWFjdCA9IGNoYWluW2krK107XHJcbiAgICAgICAgaWYocmVhY3QuZmFpbCB8fCBoYW5kbGVkUmVqZWN0aW9uT3JIYXNPblJlamVjdGVkKHJlYWN0LlApKXJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBub3RpZnkocmVjb3JkLCByZWplY3Qpe1xyXG4gICAgICB2YXIgY2hhaW4gPSByZWNvcmQuYztcclxuICAgICAgaWYocmVqZWN0IHx8IGNoYWluLmxlbmd0aClhc2FwKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHByb21pc2UgPSByZWNvcmQucFxyXG4gICAgICAgICAgLCB2YWx1ZSAgID0gcmVjb3JkLnZcclxuICAgICAgICAgICwgb2sgICAgICA9IHJlY29yZC5zID09IDFcclxuICAgICAgICAgICwgaSAgICAgICA9IDA7XHJcbiAgICAgICAgaWYocmVqZWN0ICYmICFoYW5kbGVkUmVqZWN0aW9uT3JIYXNPblJlamVjdGVkKHByb21pc2UpKXtcclxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgaWYoIWhhbmRsZWRSZWplY3Rpb25Pckhhc09uUmVqZWN0ZWQocHJvbWlzZSkpe1xyXG4gICAgICAgICAgICAgIGlmKE5PREUpe1xyXG4gICAgICAgICAgICAgICAgaWYoIXByb2Nlc3MuZW1pdCgndW5oYW5kbGVkUmVqZWN0aW9uJywgdmFsdWUsIHByb21pc2UpKXtcclxuICAgICAgICAgICAgICAgICAgLy8gZGVmYXVsdCBub2RlLmpzIGJlaGF2aW9yXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmKGlzRnVuY3Rpb24oY29uc29sZS5lcnJvcikpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJywgdmFsdWUpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSwgMWUzKTtcclxuICAgICAgICB9IGVsc2Ugd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSkhZnVuY3Rpb24ocmVhY3Qpe1xyXG4gICAgICAgICAgdmFyIGNiID0gb2sgPyByZWFjdC5vayA6IHJlYWN0LmZhaWxcclxuICAgICAgICAgICAgLCByZXQsIHRoZW47XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZihjYil7XHJcbiAgICAgICAgICAgICAgaWYoIW9rKXJlY29yZC5oID0gdHJ1ZTtcclxuICAgICAgICAgICAgICByZXQgPSBjYiA9PT0gdHJ1ZSA/IHZhbHVlIDogY2IodmFsdWUpO1xyXG4gICAgICAgICAgICAgIGlmKHJldCA9PT0gcmVhY3QuUCl7XHJcbiAgICAgICAgICAgICAgICByZWFjdC5yZWooVHlwZUVycm9yKFBST01JU0UgKyAnLWNoYWluIGN5Y2xlJykpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZih0aGVuID0gaXNUaGVuYWJsZShyZXQpKXtcclxuICAgICAgICAgICAgICAgIHRoZW4uY2FsbChyZXQsIHJlYWN0LnJlcywgcmVhY3QucmVqKTtcclxuICAgICAgICAgICAgICB9IGVsc2UgcmVhY3QucmVzKHJldCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSByZWFjdC5yZWoodmFsdWUpO1xyXG4gICAgICAgICAgfSBjYXRjaChlcnIpe1xyXG4gICAgICAgICAgICByZWFjdC5yZWooZXJyKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KGNoYWluW2krK10pO1xyXG4gICAgICAgIGNoYWluLmxlbmd0aCA9IDA7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcmVzb2x2ZSh2YWx1ZSl7XHJcbiAgICAgIHZhciByZWNvcmQgPSB0aGlzXHJcbiAgICAgICAgLCB0aGVuLCB3cmFwcGVyO1xyXG4gICAgICBpZihyZWNvcmQuZClyZXR1cm47XHJcbiAgICAgIHJlY29yZC5kID0gdHJ1ZTtcclxuICAgICAgcmVjb3JkID0gcmVjb3JkLnIgfHwgcmVjb3JkOyAvLyB1bndyYXBcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpZih0aGVuID0gaXNUaGVuYWJsZSh2YWx1ZSkpe1xyXG4gICAgICAgICAgd3JhcHBlciA9IHtyOiByZWNvcmQsIGQ6IGZhbHNlfTsgLy8gd3JhcFxyXG4gICAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBjdHgocmVzb2x2ZSwgd3JhcHBlciwgMSksIGN0eChyZWplY3QsIHdyYXBwZXIsIDEpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVjb3JkLnYgPSB2YWx1ZTtcclxuICAgICAgICAgIHJlY29yZC5zID0gMTtcclxuICAgICAgICAgIG5vdGlmeShyZWNvcmQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaChlcnIpe1xyXG4gICAgICAgIHJlamVjdC5jYWxsKHdyYXBwZXIgfHwge3I6IHJlY29yZCwgZDogZmFsc2V9LCBlcnIpOyAvLyB3cmFwXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSl7XHJcbiAgICAgIHZhciByZWNvcmQgPSB0aGlzO1xyXG4gICAgICBpZihyZWNvcmQuZClyZXR1cm47XHJcbiAgICAgIHJlY29yZC5kID0gdHJ1ZTtcclxuICAgICAgcmVjb3JkID0gcmVjb3JkLnIgfHwgcmVjb3JkOyAvLyB1bndyYXBcclxuICAgICAgcmVjb3JkLnYgPSB2YWx1ZTtcclxuICAgICAgcmVjb3JkLnMgPSAyO1xyXG4gICAgICBub3RpZnkocmVjb3JkLCB0cnVlKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGdldENvbnN0cnVjdG9yKEMpe1xyXG4gICAgICB2YXIgUyA9IGFzc2VydE9iamVjdChDKVtTWU1CT0xfU1BFQ0lFU107XHJcbiAgICAgIHJldHVybiBTICE9IHVuZGVmaW5lZCA/IFMgOiBDO1xyXG4gICAgfVxyXG4gICAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcclxuICAgIFByb21pc2UgPSBmdW5jdGlvbihleGVjdXRvcil7XHJcbiAgICAgIGFzc2VydEZ1bmN0aW9uKGV4ZWN1dG9yKTtcclxuICAgICAgYXNzZXJ0SW5zdGFuY2UodGhpcywgUHJvbWlzZSwgUFJPTUlTRSk7XHJcbiAgICAgIHZhciByZWNvcmQgPSB7XHJcbiAgICAgICAgcDogdGhpcywgICAgICAvLyBwcm9taXNlXHJcbiAgICAgICAgYzogW10sICAgICAgICAvLyBjaGFpblxyXG4gICAgICAgIHM6IDAsICAgICAgICAgLy8gc3RhdGVcclxuICAgICAgICBkOiBmYWxzZSwgICAgIC8vIGRvbmVcclxuICAgICAgICB2OiB1bmRlZmluZWQsIC8vIHZhbHVlXHJcbiAgICAgICAgaDogZmFsc2UgICAgICAvLyBoYW5kbGVkIHJlamVjdGlvblxyXG4gICAgICB9O1xyXG4gICAgICBoaWRkZW4odGhpcywgUkVDT1JELCByZWNvcmQpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGV4ZWN1dG9yKGN0eChyZXNvbHZlLCByZWNvcmQsIDEpLCBjdHgocmVqZWN0LCByZWNvcmQsIDEpKTtcclxuICAgICAgfSBjYXRjaChlcnIpe1xyXG4gICAgICAgIHJlamVjdC5jYWxsKHJlY29yZCwgZXJyKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgYXNzaWduSGlkZGVuKFByb21pc2VbUFJPVE9UWVBFXSwge1xyXG4gICAgICAvLyAyNS40LjUuMyBQcm9taXNlLnByb3RvdHlwZS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxyXG4gICAgICB0aGVuOiBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCl7XHJcbiAgICAgICAgdmFyIFMgPSBhc3NlcnRPYmplY3QoYXNzZXJ0T2JqZWN0KHRoaXMpW0NPTlNUUlVDVE9SXSlbU1lNQk9MX1NQRUNJRVNdO1xyXG4gICAgICAgIHZhciByZWFjdCA9IHtcclxuICAgICAgICAgIG9rOiAgIGlzRnVuY3Rpb24ob25GdWxmaWxsZWQpID8gb25GdWxmaWxsZWQgOiB0cnVlLFxyXG4gICAgICAgICAgZmFpbDogaXNGdW5jdGlvbihvblJlamVjdGVkKSAgPyBvblJlamVjdGVkICA6IGZhbHNlXHJcbiAgICAgICAgfSAsIFAgPSByZWFjdC5QID0gbmV3IChTICE9IHVuZGVmaW5lZCA/IFMgOiBQcm9taXNlKShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG4gICAgICAgICAgcmVhY3QucmVzID0gYXNzZXJ0RnVuY3Rpb24ocmVzb2x2ZSk7XHJcbiAgICAgICAgICByZWFjdC5yZWogPSBhc3NlcnRGdW5jdGlvbihyZWplY3QpO1xyXG4gICAgICAgIH0pLCByZWNvcmQgPSB0aGlzW1JFQ09SRF07XHJcbiAgICAgICAgcmVjb3JkLmMucHVzaChyZWFjdCk7XHJcbiAgICAgICAgcmVjb3JkLnMgJiYgbm90aWZ5KHJlY29yZCk7XHJcbiAgICAgICAgcmV0dXJuIFA7XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIDI1LjQuNS4xIFByb21pc2UucHJvdG90eXBlLmNhdGNoKG9uUmVqZWN0ZWQpXHJcbiAgICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBhc3NpZ25IaWRkZW4oUHJvbWlzZSwge1xyXG4gICAgICAvLyAyNS40LjQuMSBQcm9taXNlLmFsbChpdGVyYWJsZSlcclxuICAgICAgYWxsOiBmdW5jdGlvbihpdGVyYWJsZSl7XHJcbiAgICAgICAgdmFyIFByb21pc2UgPSBnZXRDb25zdHJ1Y3Rvcih0aGlzKVxyXG4gICAgICAgICAgLCB2YWx1ZXMgID0gW107XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcbiAgICAgICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIHB1c2gsIHZhbHVlcyk7XHJcbiAgICAgICAgICB2YXIgcmVtYWluaW5nID0gdmFsdWVzLmxlbmd0aFxyXG4gICAgICAgICAgICAsIHJlc3VsdHMgICA9IEFycmF5KHJlbWFpbmluZyk7XHJcbiAgICAgICAgICBpZihyZW1haW5pbmcpZm9yRWFjaC5jYWxsKHZhbHVlcywgZnVuY3Rpb24ocHJvbWlzZSwgaW5kZXgpe1xyXG4gICAgICAgICAgICBQcm9taXNlLnJlc29sdmUocHJvbWlzZSkudGhlbihmdW5jdGlvbih2YWx1ZSl7XHJcbiAgICAgICAgICAgICAgcmVzdWx0c1tpbmRleF0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHJlc3VsdHMpO1xyXG4gICAgICAgICAgICB9LCByZWplY3QpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBlbHNlIHJlc29sdmUocmVzdWx0cyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIDI1LjQuNC40IFByb21pc2UucmFjZShpdGVyYWJsZSlcclxuICAgICAgcmFjZTogZnVuY3Rpb24oaXRlcmFibGUpe1xyXG4gICAgICAgIHZhciBQcm9taXNlID0gZ2V0Q29uc3RydWN0b3IodGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcbiAgICAgICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uKHByb21pc2Upe1xyXG4gICAgICAgICAgICBQcm9taXNlLnJlc29sdmUocHJvbWlzZSkudGhlbihyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIDI1LjQuNC41IFByb21pc2UucmVqZWN0KHIpXHJcbiAgICAgIHJlamVjdDogZnVuY3Rpb24ocil7XHJcbiAgICAgICAgcmV0dXJuIG5ldyAoZ2V0Q29uc3RydWN0b3IodGhpcykpKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcbiAgICAgICAgICByZWplY3Qocik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIDI1LjQuNC42IFByb21pc2UucmVzb2x2ZSh4KVxyXG4gICAgICByZXNvbHZlOiBmdW5jdGlvbih4KXtcclxuICAgICAgICByZXR1cm4gaXNPYmplY3QoeCkgJiYgUkVDT1JEIGluIHggJiYgZ2V0UHJvdG90eXBlT2YoeCkgPT09IHRoaXNbUFJPVE9UWVBFXVxyXG4gICAgICAgICAgPyB4IDogbmV3IChnZXRDb25zdHJ1Y3Rvcih0aGlzKSkoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcclxuICAgICAgICAgICAgcmVzb2x2ZSh4KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KG5leHRUaWNrIHx8IHNldEltbWVkaWF0ZSwgc2FmZVN5bWJvbCgncmVjb3JkJykpO1xyXG4gIHNldFRvU3RyaW5nVGFnKFByb21pc2UsIFBST01JU0UpO1xyXG4gIHNldFNwZWNpZXMoUHJvbWlzZSk7XHJcbiAgJGRlZmluZShHTE9CQUwgKyBGT1JDRUQgKiAhaXNOYXRpdmUoUHJvbWlzZSksIHtQcm9taXNlOiBQcm9taXNlfSk7XHJcbn0oZ2xvYmFsW1BST01JU0VdKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM2LmNvbGxlY3Rpb25zICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gRUNNQVNjcmlwdCA2IGNvbGxlY3Rpb25zIHNoaW1cclxuIWZ1bmN0aW9uKCl7XHJcbiAgdmFyIFVJRCAgID0gc2FmZVN5bWJvbCgndWlkJylcclxuICAgICwgTzEgICAgPSBzYWZlU3ltYm9sKCdPMScpXHJcbiAgICAsIFdFQUsgID0gc2FmZVN5bWJvbCgnd2VhaycpXHJcbiAgICAsIExFQUsgID0gc2FmZVN5bWJvbCgnbGVhaycpXHJcbiAgICAsIExBU1QgID0gc2FmZVN5bWJvbCgnbGFzdCcpXHJcbiAgICAsIEZJUlNUID0gc2FmZVN5bWJvbCgnZmlyc3QnKVxyXG4gICAgLCBTSVpFICA9IERFU0MgPyBzYWZlU3ltYm9sKCdzaXplJykgOiAnc2l6ZSdcclxuICAgICwgdWlkICAgPSAwXHJcbiAgICAsIHRtcCAgID0ge307XHJcbiAgXHJcbiAgZnVuY3Rpb24gZ2V0Q29sbGVjdGlvbihDLCBOQU1FLCBtZXRob2RzLCBjb21tb25NZXRob2RzLCBpc01hcCwgaXNXZWFrKXtcclxuICAgIHZhciBBRERFUiA9IGlzTWFwID8gJ3NldCcgOiAnYWRkJ1xyXG4gICAgICAsIHByb3RvID0gQyAmJiBDW1BST1RPVFlQRV1cclxuICAgICAgLCBPICAgICA9IHt9O1xyXG4gICAgZnVuY3Rpb24gaW5pdEZyb21JdGVyYWJsZSh0aGF0LCBpdGVyYWJsZSl7XHJcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgaXNNYXAsIHRoYXRbQURERVJdLCB0aGF0KTtcclxuICAgICAgcmV0dXJuIHRoYXQ7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBmaXhTVlooa2V5LCBjaGFpbil7XHJcbiAgICAgIHZhciBtZXRob2QgPSBwcm90b1trZXldO1xyXG4gICAgICBpZihmcmFtZXdvcmspcHJvdG9ba2V5XSA9IGZ1bmN0aW9uKGEsIGIpe1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBtZXRob2QuY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEsIGIpO1xyXG4gICAgICAgIHJldHVybiBjaGFpbiA/IHRoaXMgOiByZXN1bHQ7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICBpZighaXNOYXRpdmUoQykgfHwgIShpc1dlYWsgfHwgKCFCVUdHWV9JVEVSQVRPUlMgJiYgaGFzKHByb3RvLCBGT1JfRUFDSCkgJiYgaGFzKHByb3RvLCAnZW50cmllcycpKSkpe1xyXG4gICAgICAvLyBjcmVhdGUgY29sbGVjdGlvbiBjb25zdHJ1Y3RvclxyXG4gICAgICBDID0gaXNXZWFrXHJcbiAgICAgICAgPyBmdW5jdGlvbihpdGVyYWJsZSl7XHJcbiAgICAgICAgICAgIGFzc2VydEluc3RhbmNlKHRoaXMsIEMsIE5BTUUpO1xyXG4gICAgICAgICAgICBzZXQodGhpcywgVUlELCB1aWQrKyk7XHJcbiAgICAgICAgICAgIGluaXRGcm9tSXRlcmFibGUodGhpcywgaXRlcmFibGUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIDogZnVuY3Rpb24oaXRlcmFibGUpe1xyXG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgICAgIGFzc2VydEluc3RhbmNlKHRoYXQsIEMsIE5BTUUpO1xyXG4gICAgICAgICAgICBzZXQodGhhdCwgTzEsIGNyZWF0ZShudWxsKSk7XHJcbiAgICAgICAgICAgIHNldCh0aGF0LCBTSVpFLCAwKTtcclxuICAgICAgICAgICAgc2V0KHRoYXQsIExBU1QsIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgIHNldCh0aGF0LCBGSVJTVCwgdW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgaW5pdEZyb21JdGVyYWJsZSh0aGF0LCBpdGVyYWJsZSk7XHJcbiAgICAgICAgICB9O1xyXG4gICAgICBhc3NpZ25IaWRkZW4oYXNzaWduSGlkZGVuKENbUFJPVE9UWVBFXSwgbWV0aG9kcyksIGNvbW1vbk1ldGhvZHMpO1xyXG4gICAgICBpc1dlYWsgfHwgIURFU0MgfHwgZGVmaW5lUHJvcGVydHkoQ1tQUk9UT1RZUEVdLCAnc2l6ZScsIHtnZXQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIGFzc2VydERlZmluZWQodGhpc1tTSVpFXSk7XHJcbiAgICAgIH19KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBOYXRpdmUgPSBDXHJcbiAgICAgICAgLCBpbnN0ICAgPSBuZXcgQ1xyXG4gICAgICAgICwgY2hhaW4gID0gaW5zdFtBRERFUl0oaXNXZWFrID8ge30gOiAtMCwgMSlcclxuICAgICAgICAsIGJ1Z2d5WmVybztcclxuICAgICAgLy8gd3JhcCB0byBpbml0IGNvbGxlY3Rpb25zIGZyb20gaXRlcmFibGVcclxuICAgICAgaWYoY2hlY2tEYW5nZXJJdGVyQ2xvc2luZyhmdW5jdGlvbihPKXsgbmV3IEMoTykgfSkpe1xyXG4gICAgICAgIEMgPSBmdW5jdGlvbihpdGVyYWJsZSl7XHJcbiAgICAgICAgICBhc3NlcnRJbnN0YW5jZSh0aGlzLCBDLCBOQU1FKTtcclxuICAgICAgICAgIHJldHVybiBpbml0RnJvbUl0ZXJhYmxlKG5ldyBOYXRpdmUsIGl0ZXJhYmxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgQ1tQUk9UT1RZUEVdID0gcHJvdG87XHJcbiAgICAgICAgaWYoZnJhbWV3b3JrKXByb3RvW0NPTlNUUlVDVE9SXSA9IEM7XHJcbiAgICAgIH1cclxuICAgICAgaXNXZWFrIHx8IGluc3RbRk9SX0VBQ0hdKGZ1bmN0aW9uKHZhbCwga2V5KXtcclxuICAgICAgICBidWdneVplcm8gPSAxIC8ga2V5ID09PSAtSW5maW5pdHk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBmaXggY29udmVydGluZyAtMCBrZXkgdG8gKzBcclxuICAgICAgaWYoYnVnZ3laZXJvKXtcclxuICAgICAgICBmaXhTVlooJ2RlbGV0ZScpO1xyXG4gICAgICAgIGZpeFNWWignaGFzJyk7XHJcbiAgICAgICAgaXNNYXAgJiYgZml4U1ZaKCdnZXQnKTtcclxuICAgICAgfVxyXG4gICAgICAvLyArIGZpeCAuYWRkICYgLnNldCBmb3IgY2hhaW5pbmdcclxuICAgICAgaWYoYnVnZ3laZXJvIHx8IGNoYWluICE9PSBpbnN0KWZpeFNWWihBRERFUiwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICBzZXRUb1N0cmluZ1RhZyhDLCBOQU1FKTtcclxuICAgIHNldFNwZWNpZXMoQyk7XHJcbiAgICBcclxuICAgIE9bTkFNRV0gPSBDO1xyXG4gICAgJGRlZmluZShHTE9CQUwgKyBXUkFQICsgRk9SQ0VEICogIWlzTmF0aXZlKEMpLCBPKTtcclxuICAgIFxyXG4gICAgLy8gYWRkIC5rZXlzLCAudmFsdWVzLCAuZW50cmllcywgW0BAaXRlcmF0b3JdXHJcbiAgICAvLyAyMy4xLjMuNCwgMjMuMS4zLjgsIDIzLjEuMy4xMSwgMjMuMS4zLjEyLCAyMy4yLjMuNSwgMjMuMi4zLjgsIDIzLjIuMy4xMCwgMjMuMi4zLjExXHJcbiAgICBpc1dlYWsgfHwgZGVmaW5lU3RkSXRlcmF0b3JzKEMsIE5BTUUsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcclxuICAgICAgc2V0KHRoaXMsIElURVIsIHtvOiBpdGVyYXRlZCwgazoga2luZH0pO1xyXG4gICAgfSwgZnVuY3Rpb24oKXtcclxuICAgICAgdmFyIGl0ZXIgID0gdGhpc1tJVEVSXVxyXG4gICAgICAgICwga2luZCAgPSBpdGVyLmtcclxuICAgICAgICAsIGVudHJ5ID0gaXRlci5sO1xyXG4gICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcclxuICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XHJcbiAgICAgIC8vIGdldCBuZXh0IGVudHJ5XHJcbiAgICAgIGlmKCFpdGVyLm8gfHwgIShpdGVyLmwgPSBlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IGl0ZXIub1tGSVJTVF0pKXtcclxuICAgICAgICAvLyBvciBmaW5pc2ggdGhlIGl0ZXJhdGlvblxyXG4gICAgICAgIGl0ZXIubyA9IHVuZGVmaW5lZDtcclxuICAgICAgICByZXR1cm4gaXRlclJlc3VsdCgxKTtcclxuICAgICAgfVxyXG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXHJcbiAgICAgIGlmKGtpbmQgPT0gS0VZKSAgcmV0dXJuIGl0ZXJSZXN1bHQoMCwgZW50cnkuayk7XHJcbiAgICAgIGlmKGtpbmQgPT0gVkFMVUUpcmV0dXJuIGl0ZXJSZXN1bHQoMCwgZW50cnkudik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZXJSZXN1bHQoMCwgW2VudHJ5LmssIGVudHJ5LnZdKTsgICBcclxuICAgIH0sIGlzTWFwID8gS0VZK1ZBTFVFIDogVkFMVUUsICFpc01hcCk7XHJcbiAgICBcclxuICAgIHJldHVybiBDO1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBmYXN0S2V5KGl0LCBjcmVhdGUpe1xyXG4gICAgLy8gcmV0dXJuIHByaW1pdGl2ZSB3aXRoIHByZWZpeFxyXG4gICAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcclxuICAgIC8vIGNhbid0IHNldCBpZCB0byBmcm96ZW4gb2JqZWN0XHJcbiAgICBpZihpc0Zyb3plbihpdCkpcmV0dXJuICdGJztcclxuICAgIGlmKCFoYXMoaXQsIFVJRCkpe1xyXG4gICAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBpZFxyXG4gICAgICBpZighY3JlYXRlKXJldHVybiAnRSc7XHJcbiAgICAgIC8vIGFkZCBtaXNzaW5nIG9iamVjdCBpZFxyXG4gICAgICBoaWRkZW4oaXQsIFVJRCwgKyt1aWQpO1xyXG4gICAgLy8gcmV0dXJuIG9iamVjdCBpZCB3aXRoIHByZWZpeFxyXG4gICAgfSByZXR1cm4gJ08nICsgaXRbVUlEXTtcclxuICB9XHJcbiAgZnVuY3Rpb24gZ2V0RW50cnkodGhhdCwga2V5KXtcclxuICAgIC8vIGZhc3QgY2FzZVxyXG4gICAgdmFyIGluZGV4ID0gZmFzdEtleShrZXkpLCBlbnRyeTtcclxuICAgIGlmKGluZGV4ICE9ICdGJylyZXR1cm4gdGhhdFtPMV1baW5kZXhdO1xyXG4gICAgLy8gZnJvemVuIG9iamVjdCBjYXNlXHJcbiAgICBmb3IoZW50cnkgPSB0aGF0W0ZJUlNUXTsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XHJcbiAgICAgIGlmKGVudHJ5LmsgPT0ga2V5KXJldHVybiBlbnRyeTtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gZGVmKHRoYXQsIGtleSwgdmFsdWUpe1xyXG4gICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KVxyXG4gICAgICAsIHByZXYsIGluZGV4O1xyXG4gICAgLy8gY2hhbmdlIGV4aXN0aW5nIGVudHJ5XHJcbiAgICBpZihlbnRyeSllbnRyeS52ID0gdmFsdWU7XHJcbiAgICAvLyBjcmVhdGUgbmV3IGVudHJ5XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhhdFtMQVNUXSA9IGVudHJ5ID0ge1xyXG4gICAgICAgIGk6IGluZGV4ID0gZmFzdEtleShrZXksIHRydWUpLCAvLyA8LSBpbmRleFxyXG4gICAgICAgIGs6IGtleSwgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBrZXlcclxuICAgICAgICB2OiB2YWx1ZSwgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcclxuICAgICAgICBwOiBwcmV2ID0gdGhhdFtMQVNUXSwgICAgICAgICAgLy8gPC0gcHJldmlvdXMgZW50cnlcclxuICAgICAgICBuOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgLy8gPC0gbmV4dCBlbnRyeVxyXG4gICAgICAgIHI6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSByZW1vdmVkXHJcbiAgICAgIH07XHJcbiAgICAgIGlmKCF0aGF0W0ZJUlNUXSl0aGF0W0ZJUlNUXSA9IGVudHJ5O1xyXG4gICAgICBpZihwcmV2KXByZXYubiA9IGVudHJ5O1xyXG4gICAgICB0aGF0W1NJWkVdKys7XHJcbiAgICAgIC8vIGFkZCB0byBpbmRleFxyXG4gICAgICBpZihpbmRleCAhPSAnRicpdGhhdFtPMV1baW5kZXhdID0gZW50cnk7XHJcbiAgICB9IHJldHVybiB0aGF0O1xyXG4gIH1cclxuXHJcbiAgdmFyIGNvbGxlY3Rpb25NZXRob2RzID0ge1xyXG4gICAgLy8gMjMuMS4zLjEgTWFwLnByb3RvdHlwZS5jbGVhcigpXHJcbiAgICAvLyAyMy4yLjMuMiBTZXQucHJvdG90eXBlLmNsZWFyKClcclxuICAgIGNsZWFyOiBmdW5jdGlvbigpe1xyXG4gICAgICBmb3IodmFyIHRoYXQgPSB0aGlzLCBkYXRhID0gdGhhdFtPMV0sIGVudHJ5ID0gdGhhdFtGSVJTVF07IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xyXG4gICAgICAgIGVudHJ5LnIgPSB0cnVlO1xyXG4gICAgICAgIGlmKGVudHJ5LnApZW50cnkucCA9IGVudHJ5LnAubiA9IHVuZGVmaW5lZDtcclxuICAgICAgICBkZWxldGUgZGF0YVtlbnRyeS5pXTtcclxuICAgICAgfVxyXG4gICAgICB0aGF0W0ZJUlNUXSA9IHRoYXRbTEFTVF0gPSB1bmRlZmluZWQ7XHJcbiAgICAgIHRoYXRbU0laRV0gPSAwO1xyXG4gICAgfSxcclxuICAgIC8vIDIzLjEuMy4zIE1hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcclxuICAgIC8vIDIzLjIuMy40IFNldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxyXG4gICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIHZhciB0aGF0ICA9IHRoaXNcclxuICAgICAgICAsIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcclxuICAgICAgaWYoZW50cnkpe1xyXG4gICAgICAgIHZhciBuZXh0ID0gZW50cnkublxyXG4gICAgICAgICAgLCBwcmV2ID0gZW50cnkucDtcclxuICAgICAgICBkZWxldGUgdGhhdFtPMV1bZW50cnkuaV07XHJcbiAgICAgICAgZW50cnkuciA9IHRydWU7XHJcbiAgICAgICAgaWYocHJldilwcmV2Lm4gPSBuZXh0O1xyXG4gICAgICAgIGlmKG5leHQpbmV4dC5wID0gcHJldjtcclxuICAgICAgICBpZih0aGF0W0ZJUlNUXSA9PSBlbnRyeSl0aGF0W0ZJUlNUXSA9IG5leHQ7XHJcbiAgICAgICAgaWYodGhhdFtMQVNUXSA9PSBlbnRyeSl0aGF0W0xBU1RdID0gcHJldjtcclxuICAgICAgICB0aGF0W1NJWkVdLS07XHJcbiAgICAgIH0gcmV0dXJuICEhZW50cnk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjMuMi4zLjYgU2V0LnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXHJcbiAgICAvLyAyMy4xLjMuNSBNYXAucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcclxuICAgIGZvckVhY2g6IGZ1bmN0aW9uKGNhbGxiYWNrZm4gLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xyXG4gICAgICB2YXIgZiA9IGN0eChjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0sIDMpXHJcbiAgICAgICAgLCBlbnRyeTtcclxuICAgICAgd2hpbGUoZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGlzW0ZJUlNUXSl7XHJcbiAgICAgICAgZihlbnRyeS52LCBlbnRyeS5rLCB0aGlzKTtcclxuICAgICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcclxuICAgICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIDIzLjEuMy43IE1hcC5wcm90b3R5cGUuaGFzKGtleSlcclxuICAgIC8vIDIzLjIuMy43IFNldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxyXG4gICAgaGFzOiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICByZXR1cm4gISFnZXRFbnRyeSh0aGlzLCBrZXkpO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICAvLyAyMy4xIE1hcCBPYmplY3RzXHJcbiAgTWFwID0gZ2V0Q29sbGVjdGlvbihNYXAsIE1BUCwge1xyXG4gICAgLy8gMjMuMS4zLjYgTWFwLnByb3RvdHlwZS5nZXQoa2V5KVxyXG4gICAgZ2V0OiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGlzLCBrZXkpO1xyXG4gICAgICByZXR1cm4gZW50cnkgJiYgZW50cnkudjtcclxuICAgIH0sXHJcbiAgICAvLyAyMy4xLjMuOSBNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxyXG4gICAgc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlKXtcclxuICAgICAgcmV0dXJuIGRlZih0aGlzLCBrZXkgPT09IDAgPyAwIDoga2V5LCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfSwgY29sbGVjdGlvbk1ldGhvZHMsIHRydWUpO1xyXG4gIFxyXG4gIC8vIDIzLjIgU2V0IE9iamVjdHNcclxuICBTZXQgPSBnZXRDb2xsZWN0aW9uKFNldCwgU0VULCB7XHJcbiAgICAvLyAyMy4yLjMuMSBTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcclxuICAgIGFkZDogZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgICByZXR1cm4gZGVmKHRoaXMsIHZhbHVlID0gdmFsdWUgPT09IDAgPyAwIDogdmFsdWUsIHZhbHVlKTtcclxuICAgIH1cclxuICB9LCBjb2xsZWN0aW9uTWV0aG9kcyk7XHJcbiAgXHJcbiAgZnVuY3Rpb24gZGVmV2Vhayh0aGF0LCBrZXksIHZhbHVlKXtcclxuICAgIGlmKGlzRnJvemVuKGFzc2VydE9iamVjdChrZXkpKSlsZWFrU3RvcmUodGhhdCkuc2V0KGtleSwgdmFsdWUpO1xyXG4gICAgZWxzZSB7XHJcbiAgICAgIGhhcyhrZXksIFdFQUspIHx8IGhpZGRlbihrZXksIFdFQUssIHt9KTtcclxuICAgICAga2V5W1dFQUtdW3RoYXRbVUlEXV0gPSB2YWx1ZTtcclxuICAgIH0gcmV0dXJuIHRoYXQ7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGxlYWtTdG9yZSh0aGF0KXtcclxuICAgIHJldHVybiB0aGF0W0xFQUtdIHx8IGhpZGRlbih0aGF0LCBMRUFLLCBuZXcgTWFwKVtMRUFLXTtcclxuICB9XHJcbiAgXHJcbiAgdmFyIHdlYWtNZXRob2RzID0ge1xyXG4gICAgLy8gMjMuMy4zLjIgV2Vha01hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcclxuICAgIC8vIDIzLjQuMy4zIFdlYWtTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcclxuICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICBpZighaXNPYmplY3Qoa2V5KSlyZXR1cm4gZmFsc2U7XHJcbiAgICAgIGlmKGlzRnJvemVuKGtleSkpcmV0dXJuIGxlYWtTdG9yZSh0aGlzKVsnZGVsZXRlJ10oa2V5KTtcclxuICAgICAgcmV0dXJuIGhhcyhrZXksIFdFQUspICYmIGhhcyhrZXlbV0VBS10sIHRoaXNbVUlEXSkgJiYgZGVsZXRlIGtleVtXRUFLXVt0aGlzW1VJRF1dO1xyXG4gICAgfSxcclxuICAgIC8vIDIzLjMuMy40IFdlYWtNYXAucHJvdG90eXBlLmhhcyhrZXkpXHJcbiAgICAvLyAyMy40LjMuNCBXZWFrU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXHJcbiAgICBoYXM6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIGlmKCFpc09iamVjdChrZXkpKXJldHVybiBmYWxzZTtcclxuICAgICAgaWYoaXNGcm96ZW4oa2V5KSlyZXR1cm4gbGVha1N0b3JlKHRoaXMpLmhhcyhrZXkpO1xyXG4gICAgICByZXR1cm4gaGFzKGtleSwgV0VBSykgJiYgaGFzKGtleVtXRUFLXSwgdGhpc1tVSURdKTtcclxuICAgIH1cclxuICB9O1xyXG4gIFxyXG4gIC8vIDIzLjMgV2Vha01hcCBPYmplY3RzXHJcbiAgV2Vha01hcCA9IGdldENvbGxlY3Rpb24oV2Vha01hcCwgV0VBS01BUCwge1xyXG4gICAgLy8gMjMuMy4zLjMgV2Vha01hcC5wcm90b3R5cGUuZ2V0KGtleSlcclxuICAgIGdldDogZnVuY3Rpb24oa2V5KXtcclxuICAgICAgaWYoaXNPYmplY3Qoa2V5KSl7XHJcbiAgICAgICAgaWYoaXNGcm96ZW4oa2V5KSlyZXR1cm4gbGVha1N0b3JlKHRoaXMpLmdldChrZXkpO1xyXG4gICAgICAgIGlmKGhhcyhrZXksIFdFQUspKXJldHVybiBrZXlbV0VBS11bdGhpc1tVSURdXTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIDIzLjMuMy41IFdlYWtNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxyXG4gICAgc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlKXtcclxuICAgICAgcmV0dXJuIGRlZldlYWsodGhpcywga2V5LCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfSwgd2Vha01ldGhvZHMsIHRydWUsIHRydWUpO1xyXG4gIFxyXG4gIC8vIElFMTEgV2Vha01hcCBmcm96ZW4ga2V5cyBmaXhcclxuICBpZihmcmFtZXdvcmsgJiYgbmV3IFdlYWtNYXAoKS5zZXQoT2JqZWN0LmZyZWV6ZSh0bXApLCA3KS5nZXQodG1wKSAhPSA3KXtcclxuICAgIGZvckVhY2guY2FsbChhcnJheSgnZGVsZXRlLGhhcyxnZXQsc2V0JyksIGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIHZhciBtZXRob2QgPSBXZWFrTWFwW1BST1RPVFlQRV1ba2V5XTtcclxuICAgICAgV2Vha01hcFtQUk9UT1RZUEVdW2tleV0gPSBmdW5jdGlvbihhLCBiKXtcclxuICAgICAgICAvLyBzdG9yZSBmcm96ZW4gb2JqZWN0cyBvbiBsZWFreSBtYXBcclxuICAgICAgICBpZihpc09iamVjdChhKSAmJiBpc0Zyb3plbihhKSl7XHJcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gbGVha1N0b3JlKHRoaXMpW2tleV0oYSwgYik7XHJcbiAgICAgICAgICByZXR1cm4ga2V5ID09ICdzZXQnID8gdGhpcyA6IHJlc3VsdDtcclxuICAgICAgICAvLyBzdG9yZSBhbGwgdGhlIHJlc3Qgb24gbmF0aXZlIHdlYWttYXBcclxuICAgICAgICB9IHJldHVybiBtZXRob2QuY2FsbCh0aGlzLCBhLCBiKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBcclxuICAvLyAyMy40IFdlYWtTZXQgT2JqZWN0c1xyXG4gIFdlYWtTZXQgPSBnZXRDb2xsZWN0aW9uKFdlYWtTZXQsIFdFQUtTRVQsIHtcclxuICAgIC8vIDIzLjQuMy4xIFdlYWtTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcclxuICAgIGFkZDogZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgICByZXR1cm4gZGVmV2Vhayh0aGlzLCB2YWx1ZSwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgfSwgd2Vha01ldGhvZHMsIGZhbHNlLCB0cnVlKTtcclxufSgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczYucmVmbGVjdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oKXtcclxuICBmdW5jdGlvbiBFbnVtZXJhdGUoaXRlcmF0ZWQpe1xyXG4gICAgdmFyIGtleXMgPSBbXSwga2V5O1xyXG4gICAgZm9yKGtleSBpbiBpdGVyYXRlZClrZXlzLnB1c2goa2V5KTtcclxuICAgIHNldCh0aGlzLCBJVEVSLCB7bzogaXRlcmF0ZWQsIGE6IGtleXMsIGk6IDB9KTtcclxuICB9XHJcbiAgY3JlYXRlSXRlcmF0b3IoRW51bWVyYXRlLCBPQkpFQ1QsIGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgaXRlciA9IHRoaXNbSVRFUl1cclxuICAgICAgLCBrZXlzID0gaXRlci5hXHJcbiAgICAgICwga2V5O1xyXG4gICAgZG8ge1xyXG4gICAgICBpZihpdGVyLmkgPj0ga2V5cy5sZW5ndGgpcmV0dXJuIGl0ZXJSZXN1bHQoMSk7XHJcbiAgICB9IHdoaWxlKCEoKGtleSA9IGtleXNbaXRlci5pKytdKSBpbiBpdGVyLm8pKTtcclxuICAgIHJldHVybiBpdGVyUmVzdWx0KDAsIGtleSk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgZnVuY3Rpb24gd3JhcChmbil7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oaXQpe1xyXG4gICAgICBhc3NlcnRPYmplY3QoaXQpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBmbi5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyksIHRydWU7XHJcbiAgICAgIH0gY2F0Y2goZSl7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIHJlZmxlY3RHZXQodGFyZ2V0LCBwcm9wZXJ0eUtleS8qLCByZWNlaXZlciovKXtcclxuICAgIHZhciByZWNlaXZlciA9IGFyZ3VtZW50cy5sZW5ndGggPCAzID8gdGFyZ2V0IDogYXJndW1lbnRzWzJdXHJcbiAgICAgICwgZGVzYyA9IGdldE93bkRlc2NyaXB0b3IoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KSwgcHJvdG87XHJcbiAgICBpZihkZXNjKXJldHVybiBoYXMoZGVzYywgJ3ZhbHVlJylcclxuICAgICAgPyBkZXNjLnZhbHVlXHJcbiAgICAgIDogZGVzYy5nZXQgPT09IHVuZGVmaW5lZFxyXG4gICAgICAgID8gdW5kZWZpbmVkXHJcbiAgICAgICAgOiBkZXNjLmdldC5jYWxsKHJlY2VpdmVyKTtcclxuICAgIHJldHVybiBpc09iamVjdChwcm90byA9IGdldFByb3RvdHlwZU9mKHRhcmdldCkpXHJcbiAgICAgID8gcmVmbGVjdEdldChwcm90bywgcHJvcGVydHlLZXksIHJlY2VpdmVyKVxyXG4gICAgICA6IHVuZGVmaW5lZDtcclxuICB9XHJcbiAgZnVuY3Rpb24gcmVmbGVjdFNldCh0YXJnZXQsIHByb3BlcnR5S2V5LCBWLyosIHJlY2VpdmVyKi8pe1xyXG4gICAgdmFyIHJlY2VpdmVyID0gYXJndW1lbnRzLmxlbmd0aCA8IDQgPyB0YXJnZXQgOiBhcmd1bWVudHNbM11cclxuICAgICAgLCBvd25EZXNjICA9IGdldE93bkRlc2NyaXB0b3IoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KVxyXG4gICAgICAsIGV4aXN0aW5nRGVzY3JpcHRvciwgcHJvdG87XHJcbiAgICBpZighb3duRGVzYyl7XHJcbiAgICAgIGlmKGlzT2JqZWN0KHByb3RvID0gZ2V0UHJvdG90eXBlT2YodGFyZ2V0KSkpe1xyXG4gICAgICAgIHJldHVybiByZWZsZWN0U2V0KHByb3RvLCBwcm9wZXJ0eUtleSwgViwgcmVjZWl2ZXIpO1xyXG4gICAgICB9XHJcbiAgICAgIG93bkRlc2MgPSBkZXNjcmlwdG9yKDApO1xyXG4gICAgfVxyXG4gICAgaWYoaGFzKG93bkRlc2MsICd2YWx1ZScpKXtcclxuICAgICAgaWYob3duRGVzYy53cml0YWJsZSA9PT0gZmFsc2UgfHwgIWlzT2JqZWN0KHJlY2VpdmVyKSlyZXR1cm4gZmFsc2U7XHJcbiAgICAgIGV4aXN0aW5nRGVzY3JpcHRvciA9IGdldE93bkRlc2NyaXB0b3IocmVjZWl2ZXIsIHByb3BlcnR5S2V5KSB8fCBkZXNjcmlwdG9yKDApO1xyXG4gICAgICBleGlzdGluZ0Rlc2NyaXB0b3IudmFsdWUgPSBWO1xyXG4gICAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkocmVjZWl2ZXIsIHByb3BlcnR5S2V5LCBleGlzdGluZ0Rlc2NyaXB0b3IpLCB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG93bkRlc2Muc2V0ID09PSB1bmRlZmluZWRcclxuICAgICAgPyBmYWxzZVxyXG4gICAgICA6IChvd25EZXNjLnNldC5jYWxsKHJlY2VpdmVyLCBWKSwgdHJ1ZSk7XHJcbiAgfVxyXG4gIHZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IHJldHVybkl0O1xyXG4gIFxyXG4gIHZhciByZWZsZWN0ID0ge1xyXG4gICAgLy8gMjYuMS4xIFJlZmxlY3QuYXBwbHkodGFyZ2V0LCB0aGlzQXJndW1lbnQsIGFyZ3VtZW50c0xpc3QpXHJcbiAgICBhcHBseTogY3R4KGNhbGwsIGFwcGx5LCAzKSxcclxuICAgIC8vIDI2LjEuMiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3VtZW50c0xpc3QgWywgbmV3VGFyZ2V0XSlcclxuICAgIGNvbnN0cnVjdDogZnVuY3Rpb24odGFyZ2V0LCBhcmd1bWVudHNMaXN0IC8qLCBuZXdUYXJnZXQqLyl7XHJcbiAgICAgIHZhciBwcm90byAgICA9IGFzc2VydEZ1bmN0aW9uKGFyZ3VtZW50cy5sZW5ndGggPCAzID8gdGFyZ2V0IDogYXJndW1lbnRzWzJdKVtQUk9UT1RZUEVdXHJcbiAgICAgICAgLCBpbnN0YW5jZSA9IGNyZWF0ZShpc09iamVjdChwcm90bykgPyBwcm90byA6IE9iamVjdFByb3RvKVxyXG4gICAgICAgICwgcmVzdWx0ICAgPSBhcHBseS5jYWxsKHRhcmdldCwgaW5zdGFuY2UsIGFyZ3VtZW50c0xpc3QpO1xyXG4gICAgICByZXR1cm4gaXNPYmplY3QocmVzdWx0KSA/IHJlc3VsdCA6IGluc3RhbmNlO1xyXG4gICAgfSxcclxuICAgIC8vIDI2LjEuMyBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpXHJcbiAgICBkZWZpbmVQcm9wZXJ0eTogd3JhcChkZWZpbmVQcm9wZXJ0eSksXHJcbiAgICAvLyAyNi4xLjQgUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5KVxyXG4gICAgZGVsZXRlUHJvcGVydHk6IGZ1bmN0aW9uKHRhcmdldCwgcHJvcGVydHlLZXkpe1xyXG4gICAgICB2YXIgZGVzYyA9IGdldE93bkRlc2NyaXB0b3IoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KTtcclxuICAgICAgcmV0dXJuIGRlc2MgJiYgIWRlc2MuY29uZmlndXJhYmxlID8gZmFsc2UgOiBkZWxldGUgdGFyZ2V0W3Byb3BlcnR5S2V5XTtcclxuICAgIH0sXHJcbiAgICAvLyAyNi4xLjUgUmVmbGVjdC5lbnVtZXJhdGUodGFyZ2V0KVxyXG4gICAgZW51bWVyYXRlOiBmdW5jdGlvbih0YXJnZXQpe1xyXG4gICAgICByZXR1cm4gbmV3IEVudW1lcmF0ZShhc3NlcnRPYmplY3QodGFyZ2V0KSk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjYuMS42IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcGVydHlLZXkgWywgcmVjZWl2ZXJdKVxyXG4gICAgZ2V0OiByZWZsZWN0R2V0LFxyXG4gICAgLy8gMjYuMS43IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcGVydHlLZXkpXHJcbiAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IGZ1bmN0aW9uKHRhcmdldCwgcHJvcGVydHlLZXkpe1xyXG4gICAgICByZXR1cm4gZ2V0T3duRGVzY3JpcHRvcihhc3NlcnRPYmplY3QodGFyZ2V0KSwgcHJvcGVydHlLZXkpO1xyXG4gICAgfSxcclxuICAgIC8vIDI2LjEuOCBSZWZsZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldClcclxuICAgIGdldFByb3RvdHlwZU9mOiBmdW5jdGlvbih0YXJnZXQpe1xyXG4gICAgICByZXR1cm4gZ2V0UHJvdG90eXBlT2YoYXNzZXJ0T2JqZWN0KHRhcmdldCkpO1xyXG4gICAgfSxcclxuICAgIC8vIDI2LjEuOSBSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3BlcnR5S2V5KVxyXG4gICAgaGFzOiBmdW5jdGlvbih0YXJnZXQsIHByb3BlcnR5S2V5KXtcclxuICAgICAgcmV0dXJuIHByb3BlcnR5S2V5IGluIHRhcmdldDtcclxuICAgIH0sXHJcbiAgICAvLyAyNi4xLjEwIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldClcclxuICAgIGlzRXh0ZW5zaWJsZTogZnVuY3Rpb24odGFyZ2V0KXtcclxuICAgICAgcmV0dXJuICEhaXNFeHRlbnNpYmxlKGFzc2VydE9iamVjdCh0YXJnZXQpKTtcclxuICAgIH0sXHJcbiAgICAvLyAyNi4xLjExIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpXHJcbiAgICBvd25LZXlzOiBvd25LZXlzLFxyXG4gICAgLy8gMjYuMS4xMiBSZWZsZWN0LnByZXZlbnRFeHRlbnNpb25zKHRhcmdldClcclxuICAgIHByZXZlbnRFeHRlbnNpb25zOiB3cmFwKE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyB8fCByZXR1cm5JdCksXHJcbiAgICAvLyAyNi4xLjEzIFJlZmxlY3Quc2V0KHRhcmdldCwgcHJvcGVydHlLZXksIFYgWywgcmVjZWl2ZXJdKVxyXG4gICAgc2V0OiByZWZsZWN0U2V0XHJcbiAgfVxyXG4gIC8vIDI2LjEuMTQgUmVmbGVjdC5zZXRQcm90b3R5cGVPZih0YXJnZXQsIHByb3RvKVxyXG4gIGlmKHNldFByb3RvdHlwZU9mKXJlZmxlY3Quc2V0UHJvdG90eXBlT2YgPSBmdW5jdGlvbih0YXJnZXQsIHByb3RvKXtcclxuICAgIHJldHVybiBzZXRQcm90b3R5cGVPZihhc3NlcnRPYmplY3QodGFyZ2V0KSwgcHJvdG8pLCB0cnVlO1xyXG4gIH07XHJcbiAgXHJcbiAgJGRlZmluZShHTE9CQUwsIHtSZWZsZWN0OiB7fX0pO1xyXG4gICRkZWZpbmUoU1RBVElDLCAnUmVmbGVjdCcsIHJlZmxlY3QpO1xyXG59KCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNy5wcm9wb3NhbHMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbigpe1xyXG4gICRkZWZpbmUoUFJPVE8sIEFSUkFZLCB7XHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZG9tZW5pYy9BcnJheS5wcm90b3R5cGUuaW5jbHVkZXNcclxuICAgIGluY2x1ZGVzOiBjcmVhdGVBcnJheUNvbnRhaW5zKHRydWUpXHJcbiAgfSk7XHJcbiAgJGRlZmluZShQUk9UTywgU1RSSU5HLCB7XHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLmF0XHJcbiAgICBhdDogY3JlYXRlUG9pbnRBdCh0cnVlKVxyXG4gIH0pO1xyXG4gIFxyXG4gIGZ1bmN0aW9uIGNyZWF0ZU9iamVjdFRvQXJyYXkoaXNFbnRyaWVzKXtcclxuICAgIHJldHVybiBmdW5jdGlvbihvYmplY3Qpe1xyXG4gICAgICB2YXIgTyAgICAgID0gdG9PYmplY3Qob2JqZWN0KVxyXG4gICAgICAgICwga2V5cyAgID0gZ2V0S2V5cyhvYmplY3QpXHJcbiAgICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxyXG4gICAgICAgICwgaSAgICAgID0gMFxyXG4gICAgICAgICwgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKVxyXG4gICAgICAgICwga2V5O1xyXG4gICAgICBpZihpc0VudHJpZXMpd2hpbGUobGVuZ3RoID4gaSlyZXN1bHRbaV0gPSBba2V5ID0ga2V5c1tpKytdLCBPW2tleV1dO1xyXG4gICAgICBlbHNlIHdoaWxlKGxlbmd0aCA+IGkpcmVzdWx0W2ldID0gT1trZXlzW2krK11dO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gIH1cclxuICAkZGVmaW5lKFNUQVRJQywgT0JKRUNULCB7XHJcbiAgICAvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9XZWJSZWZsZWN0aW9uLzkzNTM3ODFcclxuICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcnM6IGZ1bmN0aW9uKG9iamVjdCl7XHJcbiAgICAgIHZhciBPICAgICAgPSB0b09iamVjdChvYmplY3QpXHJcbiAgICAgICAgLCByZXN1bHQgPSB7fTtcclxuICAgICAgZm9yRWFjaC5jYWxsKG93bktleXMoTyksIGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgICAgZGVmaW5lUHJvcGVydHkocmVzdWx0LCBrZXksIGRlc2NyaXB0b3IoMCwgZ2V0T3duRGVzY3JpcHRvcihPLCBrZXkpKSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSxcclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9yd2FsZHJvbi90YzM5LW5vdGVzL2Jsb2IvbWFzdGVyL2VzNi8yMDE0LTA0L2Fwci05Lm1kIzUxLW9iamVjdGVudHJpZXMtb2JqZWN0dmFsdWVzXHJcbiAgICB2YWx1ZXM6ICBjcmVhdGVPYmplY3RUb0FycmF5KGZhbHNlKSxcclxuICAgIGVudHJpZXM6IGNyZWF0ZU9iamVjdFRvQXJyYXkodHJ1ZSlcclxuICB9KTtcclxuICAkZGVmaW5lKFNUQVRJQywgUkVHRVhQLCB7XHJcbiAgICAvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9rYW5nYXgvOTY5ODEwMFxyXG4gICAgZXNjYXBlOiBjcmVhdGVSZXBsYWNlcigvKFtcXFxcXFwtW1xcXXt9KCkqKz8uLF4kfF0pL2csICdcXFxcJDEnLCB0cnVlKVxyXG4gIH0pO1xyXG59KCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNy5hYnN0cmFjdC1yZWZzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96ZW5wYXJzaW5nL2VzLWFic3RyYWN0LXJlZnNcclxuIWZ1bmN0aW9uKFJFRkVSRU5DRSl7XHJcbiAgUkVGRVJFTkNFX0dFVCA9IGdldFdlbGxLbm93blN5bWJvbChSRUZFUkVOQ0UrJ0dldCcsIHRydWUpO1xyXG4gIHZhciBSRUZFUkVOQ0VfU0VUID0gZ2V0V2VsbEtub3duU3ltYm9sKFJFRkVSRU5DRStTRVQsIHRydWUpXHJcbiAgICAsIFJFRkVSRU5DRV9ERUxFVEUgPSBnZXRXZWxsS25vd25TeW1ib2woUkVGRVJFTkNFKydEZWxldGUnLCB0cnVlKTtcclxuICBcclxuICAkZGVmaW5lKFNUQVRJQywgU1lNQk9MLCB7XHJcbiAgICByZWZlcmVuY2VHZXQ6IFJFRkVSRU5DRV9HRVQsXHJcbiAgICByZWZlcmVuY2VTZXQ6IFJFRkVSRU5DRV9TRVQsXHJcbiAgICByZWZlcmVuY2VEZWxldGU6IFJFRkVSRU5DRV9ERUxFVEVcclxuICB9KTtcclxuICBcclxuICBoaWRkZW4oRnVuY3Rpb25Qcm90bywgUkVGRVJFTkNFX0dFVCwgcmV0dXJuVGhpcyk7XHJcbiAgXHJcbiAgZnVuY3Rpb24gc2V0TWFwTWV0aG9kcyhDb25zdHJ1Y3Rvcil7XHJcbiAgICBpZihDb25zdHJ1Y3Rvcil7XHJcbiAgICAgIHZhciBNYXBQcm90byA9IENvbnN0cnVjdG9yW1BST1RPVFlQRV07XHJcbiAgICAgIGhpZGRlbihNYXBQcm90bywgUkVGRVJFTkNFX0dFVCwgTWFwUHJvdG8uZ2V0KTtcclxuICAgICAgaGlkZGVuKE1hcFByb3RvLCBSRUZFUkVOQ0VfU0VULCBNYXBQcm90by5zZXQpO1xyXG4gICAgICBoaWRkZW4oTWFwUHJvdG8sIFJFRkVSRU5DRV9ERUxFVEUsIE1hcFByb3RvWydkZWxldGUnXSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHNldE1hcE1ldGhvZHMoTWFwKTtcclxuICBzZXRNYXBNZXRob2RzKFdlYWtNYXApO1xyXG59KCdyZWZlcmVuY2UnKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29yZS5kaWN0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKERJQ1Qpe1xyXG4gIERpY3QgPSBmdW5jdGlvbihpdGVyYWJsZSl7XHJcbiAgICB2YXIgZGljdCA9IGNyZWF0ZShudWxsKTtcclxuICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZCl7XHJcbiAgICAgIGlmKGlzSXRlcmFibGUoaXRlcmFibGUpKXtcclxuICAgICAgICBmb3JPZihpdGVyYWJsZSwgdHJ1ZSwgZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgICAgICAgICBkaWN0W2tleV0gPSB2YWx1ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIGFzc2lnbihkaWN0LCBpdGVyYWJsZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGljdDtcclxuICB9XHJcbiAgRGljdFtQUk9UT1RZUEVdID0gbnVsbDtcclxuICBcclxuICBmdW5jdGlvbiBEaWN0SXRlcmF0b3IoaXRlcmF0ZWQsIGtpbmQpe1xyXG4gICAgc2V0KHRoaXMsIElURVIsIHtvOiB0b09iamVjdChpdGVyYXRlZCksIGE6IGdldEtleXMoaXRlcmF0ZWQpLCBpOiAwLCBrOiBraW5kfSk7XHJcbiAgfVxyXG4gIGNyZWF0ZUl0ZXJhdG9yKERpY3RJdGVyYXRvciwgRElDVCwgZnVuY3Rpb24oKXtcclxuICAgIHZhciBpdGVyID0gdGhpc1tJVEVSXVxyXG4gICAgICAsIE8gICAgPSBpdGVyLm9cclxuICAgICAgLCBrZXlzID0gaXRlci5hXHJcbiAgICAgICwga2luZCA9IGl0ZXIua1xyXG4gICAgICAsIGtleTtcclxuICAgIGRvIHtcclxuICAgICAgaWYoaXRlci5pID49IGtleXMubGVuZ3RoKXtcclxuICAgICAgICBpdGVyLm8gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuIGl0ZXJSZXN1bHQoMSk7XHJcbiAgICAgIH1cclxuICAgIH0gd2hpbGUoIWhhcyhPLCBrZXkgPSBrZXlzW2l0ZXIuaSsrXSkpO1xyXG4gICAgaWYoa2luZCA9PSBLRVkpICByZXR1cm4gaXRlclJlc3VsdCgwLCBrZXkpO1xyXG4gICAgaWYoa2luZCA9PSBWQUxVRSlyZXR1cm4gaXRlclJlc3VsdCgwLCBPW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlclJlc3VsdCgwLCBba2V5LCBPW2tleV1dKTtcclxuICB9KTtcclxuICBmdW5jdGlvbiBjcmVhdGVEaWN0SXRlcihraW5kKXtcclxuICAgIHJldHVybiBmdW5jdGlvbihpdCl7XHJcbiAgICAgIHJldHVybiBuZXcgRGljdEl0ZXJhdG9yKGl0LCBraW5kKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgLypcclxuICAgKiAwIC0+IGZvckVhY2hcclxuICAgKiAxIC0+IG1hcFxyXG4gICAqIDIgLT4gZmlsdGVyXHJcbiAgICogMyAtPiBzb21lXHJcbiAgICogNCAtPiBldmVyeVxyXG4gICAqIDUgLT4gZmluZFxyXG4gICAqIDYgLT4gZmluZEtleVxyXG4gICAqIDcgLT4gbWFwUGFpcnNcclxuICAgKi9cclxuICBmdW5jdGlvbiBjcmVhdGVEaWN0TWV0aG9kKHR5cGUpe1xyXG4gICAgdmFyIGlzTWFwICAgID0gdHlwZSA9PSAxXHJcbiAgICAgICwgaXNFdmVyeSAgPSB0eXBlID09IDQ7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0LCBjYWxsYmFja2ZuLCB0aGF0IC8qID0gdW5kZWZpbmVkICovKXtcclxuICAgICAgdmFyIGYgICAgICA9IGN0eChjYWxsYmFja2ZuLCB0aGF0LCAzKVxyXG4gICAgICAgICwgTyAgICAgID0gdG9PYmplY3Qob2JqZWN0KVxyXG4gICAgICAgICwgcmVzdWx0ID0gaXNNYXAgfHwgdHlwZSA9PSA3IHx8IHR5cGUgPT0gMiA/IG5ldyAoZ2VuZXJpYyh0aGlzLCBEaWN0KSkgOiB1bmRlZmluZWRcclxuICAgICAgICAsIGtleSwgdmFsLCByZXM7XHJcbiAgICAgIGZvcihrZXkgaW4gTylpZihoYXMoTywga2V5KSl7XHJcbiAgICAgICAgdmFsID0gT1trZXldO1xyXG4gICAgICAgIHJlcyA9IGYodmFsLCBrZXksIG9iamVjdCk7XHJcbiAgICAgICAgaWYodHlwZSl7XHJcbiAgICAgICAgICBpZihpc01hcClyZXN1bHRba2V5XSA9IHJlczsgICAgICAgICAgICAgLy8gbWFwXHJcbiAgICAgICAgICBlbHNlIGlmKHJlcylzd2l0Y2godHlwZSl7XHJcbiAgICAgICAgICAgIGNhc2UgMjogcmVzdWx0W2tleV0gPSB2YWw7IGJyZWFrICAgICAgLy8gZmlsdGVyXHJcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgICAgICAgLy8gc29tZVxyXG4gICAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWw7ICAgICAgICAgICAgICAgICAgIC8vIGZpbmRcclxuICAgICAgICAgICAgY2FzZSA2OiByZXR1cm4ga2V5OyAgICAgICAgICAgICAgICAgICAvLyBmaW5kS2V5XHJcbiAgICAgICAgICAgIGNhc2UgNzogcmVzdWx0W3Jlc1swXV0gPSByZXNbMV07ICAgICAgLy8gbWFwUGFpcnNcclxuICAgICAgICAgIH0gZWxzZSBpZihpc0V2ZXJ5KXJldHVybiBmYWxzZTsgICAgICAgICAvLyBldmVyeVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdHlwZSA9PSAzIHx8IGlzRXZlcnkgPyBpc0V2ZXJ5IDogcmVzdWx0O1xyXG4gICAgfVxyXG4gIH1cclxuICBmdW5jdGlvbiBjcmVhdGVEaWN0UmVkdWNlKGlzVHVybil7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0LCBtYXBmbiwgaW5pdCl7XHJcbiAgICAgIGFzc2VydEZ1bmN0aW9uKG1hcGZuKTtcclxuICAgICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KG9iamVjdClcclxuICAgICAgICAsIGtleXMgICA9IGdldEtleXMoTylcclxuICAgICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXHJcbiAgICAgICAgLCBpICAgICAgPSAwXHJcbiAgICAgICAgLCBtZW1vLCBrZXksIHJlc3VsdDtcclxuICAgICAgaWYoaXNUdXJuKW1lbW8gPSBpbml0ID09IHVuZGVmaW5lZCA/IG5ldyAoZ2VuZXJpYyh0aGlzLCBEaWN0KSkgOiBPYmplY3QoaW5pdCk7XHJcbiAgICAgIGVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aCA8IDMpe1xyXG4gICAgICAgIGFzc2VydChsZW5ndGgsIFJFRFVDRV9FUlJPUik7XHJcbiAgICAgICAgbWVtbyA9IE9ba2V5c1tpKytdXTtcclxuICAgICAgfSBlbHNlIG1lbW8gPSBPYmplY3QoaW5pdCk7XHJcbiAgICAgIHdoaWxlKGxlbmd0aCA+IGkpaWYoaGFzKE8sIGtleSA9IGtleXNbaSsrXSkpe1xyXG4gICAgICAgIHJlc3VsdCA9IG1hcGZuKG1lbW8sIE9ba2V5XSwga2V5LCBvYmplY3QpO1xyXG4gICAgICAgIGlmKGlzVHVybil7XHJcbiAgICAgICAgICBpZihyZXN1bHQgPT09IGZhbHNlKWJyZWFrO1xyXG4gICAgICAgIH0gZWxzZSBtZW1vID0gcmVzdWx0O1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBtZW1vO1xyXG4gICAgfVxyXG4gIH1cclxuICB2YXIgZmluZEtleSA9IGNyZWF0ZURpY3RNZXRob2QoNik7XHJcbiAgZnVuY3Rpb24gaW5jbHVkZXMob2JqZWN0LCBlbCl7XHJcbiAgICByZXR1cm4gKGVsID09IGVsID8ga2V5T2Yob2JqZWN0LCBlbCkgOiBmaW5kS2V5KG9iamVjdCwgc2FtZU5hTikpICE9PSB1bmRlZmluZWQ7XHJcbiAgfVxyXG4gIFxyXG4gIHZhciBkaWN0TWV0aG9kcyA9IHtcclxuICAgIGtleXM6ICAgIGNyZWF0ZURpY3RJdGVyKEtFWSksXHJcbiAgICB2YWx1ZXM6ICBjcmVhdGVEaWN0SXRlcihWQUxVRSksXHJcbiAgICBlbnRyaWVzOiBjcmVhdGVEaWN0SXRlcihLRVkrVkFMVUUpLFxyXG4gICAgZm9yRWFjaDogY3JlYXRlRGljdE1ldGhvZCgwKSxcclxuICAgIG1hcDogICAgIGNyZWF0ZURpY3RNZXRob2QoMSksXHJcbiAgICBmaWx0ZXI6ICBjcmVhdGVEaWN0TWV0aG9kKDIpLFxyXG4gICAgc29tZTogICAgY3JlYXRlRGljdE1ldGhvZCgzKSxcclxuICAgIGV2ZXJ5OiAgIGNyZWF0ZURpY3RNZXRob2QoNCksXHJcbiAgICBmaW5kOiAgICBjcmVhdGVEaWN0TWV0aG9kKDUpLFxyXG4gICAgZmluZEtleTogZmluZEtleSxcclxuICAgIG1hcFBhaXJzOmNyZWF0ZURpY3RNZXRob2QoNyksXHJcbiAgICByZWR1Y2U6ICBjcmVhdGVEaWN0UmVkdWNlKGZhbHNlKSxcclxuICAgIHR1cm46ICAgIGNyZWF0ZURpY3RSZWR1Y2UodHJ1ZSksXHJcbiAgICBrZXlPZjogICBrZXlPZixcclxuICAgIGluY2x1ZGVzOmluY2x1ZGVzLFxyXG4gICAgLy8gSGFzIC8gZ2V0IC8gc2V0IG93biBwcm9wZXJ0eVxyXG4gICAgaGFzOiBoYXMsXHJcbiAgICBnZXQ6IGdldCxcclxuICAgIHNldDogY3JlYXRlRGVmaW5lcigwKSxcclxuICAgIGlzRGljdDogZnVuY3Rpb24oaXQpe1xyXG4gICAgICByZXR1cm4gaXNPYmplY3QoaXQpICYmIGdldFByb3RvdHlwZU9mKGl0KSA9PT0gRGljdFtQUk9UT1RZUEVdO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgXHJcbiAgaWYoUkVGRVJFTkNFX0dFVClmb3IodmFyIGtleSBpbiBkaWN0TWV0aG9kcykhZnVuY3Rpb24oZm4pe1xyXG4gICAgZnVuY3Rpb24gbWV0aG9kKCl7XHJcbiAgICAgIGZvcih2YXIgYXJncyA9IFt0aGlzXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOylhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xyXG4gICAgICByZXR1cm4gaW52b2tlKGZuLCBhcmdzKTtcclxuICAgIH1cclxuICAgIGZuW1JFRkVSRU5DRV9HRVRdID0gZnVuY3Rpb24oKXtcclxuICAgICAgcmV0dXJuIG1ldGhvZDtcclxuICAgIH1cclxuICB9KGRpY3RNZXRob2RzW2tleV0pO1xyXG4gIFxyXG4gICRkZWZpbmUoR0xPQkFMICsgRk9SQ0VELCB7RGljdDogYXNzaWduSGlkZGVuKERpY3QsIGRpY3RNZXRob2RzKX0pO1xyXG59KCdEaWN0Jyk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvcmUuJGZvciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbihFTlRSSUVTLCBGTil7ICBcclxuICBmdW5jdGlvbiAkZm9yKGl0ZXJhYmxlLCBlbnRyaWVzKXtcclxuICAgIGlmKCEodGhpcyBpbnN0YW5jZW9mICRmb3IpKXJldHVybiBuZXcgJGZvcihpdGVyYWJsZSwgZW50cmllcyk7XHJcbiAgICB0aGlzW0lURVJdICAgID0gZ2V0SXRlcmF0b3IoaXRlcmFibGUpO1xyXG4gICAgdGhpc1tFTlRSSUVTXSA9ICEhZW50cmllcztcclxuICB9XHJcbiAgXHJcbiAgY3JlYXRlSXRlcmF0b3IoJGZvciwgJ1dyYXBwZXInLCBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXNbSVRFUl0ubmV4dCgpO1xyXG4gIH0pO1xyXG4gIHZhciAkZm9yUHJvdG8gPSAkZm9yW1BST1RPVFlQRV07XHJcbiAgc2V0SXRlcmF0b3IoJGZvclByb3RvLCBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXNbSVRFUl07IC8vIHVud3JhcFxyXG4gIH0pO1xyXG4gIFxyXG4gIGZ1bmN0aW9uIGNyZWF0ZUNoYWluSXRlcmF0b3IobmV4dCl7XHJcbiAgICBmdW5jdGlvbiBJdGVyKEksIGZuLCB0aGF0KXtcclxuICAgICAgdGhpc1tJVEVSXSAgICA9IGdldEl0ZXJhdG9yKEkpO1xyXG4gICAgICB0aGlzW0VOVFJJRVNdID0gSVtFTlRSSUVTXTtcclxuICAgICAgdGhpc1tGTl0gICAgICA9IGN0eChmbiwgdGhhdCwgSVtFTlRSSUVTXSA/IDIgOiAxKTtcclxuICAgIH1cclxuICAgIGNyZWF0ZUl0ZXJhdG9yKEl0ZXIsICdDaGFpbicsIG5leHQsICRmb3JQcm90byk7XHJcbiAgICBzZXRJdGVyYXRvcihJdGVyW1BST1RPVFlQRV0sIHJldHVyblRoaXMpOyAvLyBvdmVycmlkZSAkZm9yUHJvdG8gaXRlcmF0b3JcclxuICAgIHJldHVybiBJdGVyO1xyXG4gIH1cclxuICBcclxuICB2YXIgTWFwSXRlciA9IGNyZWF0ZUNoYWluSXRlcmF0b3IoZnVuY3Rpb24oKXtcclxuICAgIHZhciBzdGVwID0gdGhpc1tJVEVSXS5uZXh0KCk7XHJcbiAgICByZXR1cm4gc3RlcC5kb25lID8gc3RlcCA6IGl0ZXJSZXN1bHQoMCwgc3RlcENhbGwodGhpc1tGTl0sIHN0ZXAudmFsdWUsIHRoaXNbRU5UUklFU10pKTtcclxuICB9KTtcclxuICBcclxuICB2YXIgRmlsdGVySXRlciA9IGNyZWF0ZUNoYWluSXRlcmF0b3IoZnVuY3Rpb24oKXtcclxuICAgIGZvcig7Oyl7XHJcbiAgICAgIHZhciBzdGVwID0gdGhpc1tJVEVSXS5uZXh0KCk7XHJcbiAgICAgIGlmKHN0ZXAuZG9uZSB8fCBzdGVwQ2FsbCh0aGlzW0ZOXSwgc3RlcC52YWx1ZSwgdGhpc1tFTlRSSUVTXSkpcmV0dXJuIHN0ZXA7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbiAgYXNzaWduSGlkZGVuKCRmb3JQcm90bywge1xyXG4gICAgb2Y6IGZ1bmN0aW9uKGZuLCB0aGF0KXtcclxuICAgICAgZm9yT2YodGhpcywgdGhpc1tFTlRSSUVTXSwgZm4sIHRoYXQpO1xyXG4gICAgfSxcclxuICAgIGFycmF5OiBmdW5jdGlvbihmbiwgdGhhdCl7XHJcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgZm9yT2YoZm4gIT0gdW5kZWZpbmVkID8gdGhpcy5tYXAoZm4sIHRoYXQpIDogdGhpcywgZmFsc2UsIHB1c2gsIHJlc3VsdCk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9LFxyXG4gICAgZmlsdGVyOiBmdW5jdGlvbihmbiwgdGhhdCl7XHJcbiAgICAgIHJldHVybiBuZXcgRmlsdGVySXRlcih0aGlzLCBmbiwgdGhhdCk7XHJcbiAgICB9LFxyXG4gICAgbWFwOiBmdW5jdGlvbihmbiwgdGhhdCl7XHJcbiAgICAgIHJldHVybiBuZXcgTWFwSXRlcih0aGlzLCBmbiwgdGhhdCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbiAgJGZvci5pc0l0ZXJhYmxlICA9IGlzSXRlcmFibGU7XHJcbiAgJGZvci5nZXRJdGVyYXRvciA9IGdldEl0ZXJhdG9yO1xyXG4gIFxyXG4gICRkZWZpbmUoR0xPQkFMICsgRk9SQ0VELCB7JGZvcjogJGZvcn0pO1xyXG59KCdlbnRyaWVzJywgc2FmZVN5bWJvbCgnZm4nKSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvcmUuZGVsYXkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIGh0dHBzOi8vZXNkaXNjdXNzLm9yZy90b3BpYy9wcm9taXNlLXJldHVybmluZy1kZWxheS1mdW5jdGlvblxyXG4kZGVmaW5lKEdMT0JBTCArIEZPUkNFRCwge1xyXG4gIGRlbGF5OiBmdW5jdGlvbih0aW1lKXtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKXtcclxuICAgICAgc2V0VGltZW91dChyZXNvbHZlLCB0aW1lLCB0cnVlKTtcclxuICAgIH0pO1xyXG4gIH1cclxufSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvcmUuYmluZGluZyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbihfLCB0b0xvY2FsZVN0cmluZyl7XHJcbiAgLy8gUGxhY2Vob2xkZXJcclxuICBjb3JlLl8gPSBwYXRoLl8gPSBwYXRoLl8gfHwge307XHJcblxyXG4gICRkZWZpbmUoUFJPVE8gKyBGT1JDRUQsIEZVTkNUSU9OLCB7XHJcbiAgICBwYXJ0OiBwYXJ0LFxyXG4gICAgb25seTogZnVuY3Rpb24obnVtYmVyQXJndW1lbnRzLCB0aGF0IC8qID0gQCAqLyl7XHJcbiAgICAgIHZhciBmbiAgICAgPSBhc3NlcnRGdW5jdGlvbih0aGlzKVxyXG4gICAgICAgICwgbiAgICAgID0gdG9MZW5ndGgobnVtYmVyQXJndW1lbnRzKVxyXG4gICAgICAgICwgaXNUaGF0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDE7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcclxuICAgICAgICB2YXIgbGVuZ3RoID0gbWluKG4sIGFyZ3VtZW50cy5sZW5ndGgpXHJcbiAgICAgICAgICAsIGFyZ3MgICA9IEFycmF5KGxlbmd0aClcclxuICAgICAgICAgICwgaSAgICAgID0gMDtcclxuICAgICAgICB3aGlsZShsZW5ndGggPiBpKWFyZ3NbaV0gPSBhcmd1bWVudHNbaSsrXTtcclxuICAgICAgICByZXR1cm4gaW52b2tlKGZuLCBhcmdzLCBpc1RoYXQgPyB0aGF0IDogdGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuICBcclxuICBmdW5jdGlvbiB0aWUoa2V5KXtcclxuICAgIHZhciB0aGF0ICA9IHRoaXNcclxuICAgICAgLCBib3VuZCA9IHt9O1xyXG4gICAgcmV0dXJuIGhpZGRlbih0aGF0LCBfLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgICBpZihrZXkgPT09IHVuZGVmaW5lZCB8fCAhKGtleSBpbiB0aGF0KSlyZXR1cm4gdG9Mb2NhbGVTdHJpbmcuY2FsbCh0aGF0KTtcclxuICAgICAgcmV0dXJuIGhhcyhib3VuZCwga2V5KSA/IGJvdW5kW2tleV0gOiAoYm91bmRba2V5XSA9IGN0eCh0aGF0W2tleV0sIHRoYXQsIC0xKSk7XHJcbiAgICB9KVtfXShrZXkpO1xyXG4gIH1cclxuICBcclxuICBoaWRkZW4ocGF0aC5fLCBUT19TVFJJTkcsIGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gXztcclxuICB9KTtcclxuICBcclxuICBoaWRkZW4oT2JqZWN0UHJvdG8sIF8sIHRpZSk7XHJcbiAgREVTQyB8fCBoaWRkZW4oQXJyYXlQcm90bywgXywgdGllKTtcclxuICAvLyBJRTgtIGRpcnR5IGhhY2sgLSByZWRlZmluZWQgdG9Mb2NhbGVTdHJpbmcgaXMgbm90IGVudW1lcmFibGVcclxufShERVNDID8gdWlkKCd0aWUnKSA6IFRPX0xPQ0FMRSwgT2JqZWN0UHJvdG9bVE9fTE9DQUxFXSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvcmUub2JqZWN0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbigpe1xyXG4gIGZ1bmN0aW9uIGRlZmluZSh0YXJnZXQsIG1peGluKXtcclxuICAgIHZhciBrZXlzICAgPSBvd25LZXlzKHRvT2JqZWN0KG1peGluKSlcclxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxyXG4gICAgICAsIGkgPSAwLCBrZXk7XHJcbiAgICB3aGlsZShsZW5ndGggPiBpKWRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5ID0ga2V5c1tpKytdLCBnZXRPd25EZXNjcmlwdG9yKG1peGluLCBrZXkpKTtcclxuICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgfTtcclxuICAkZGVmaW5lKFNUQVRJQyArIEZPUkNFRCwgT0JKRUNULCB7XHJcbiAgICBpc09iamVjdDogaXNPYmplY3QsXHJcbiAgICBjbGFzc29mOiBjbGFzc29mLFxyXG4gICAgZGVmaW5lOiBkZWZpbmUsXHJcbiAgICBtYWtlOiBmdW5jdGlvbihwcm90bywgbWl4aW4pe1xyXG4gICAgICByZXR1cm4gZGVmaW5lKGNyZWF0ZShwcm90byksIG1peGluKTtcclxuICAgIH1cclxuICB9KTtcclxufSgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb3JlLmFycmF5ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4kZGVmaW5lKFBST1RPICsgRk9SQ0VELCBBUlJBWSwge1xyXG4gIHR1cm46IGZ1bmN0aW9uKGZuLCB0YXJnZXQgLyogPSBbXSAqLyl7XHJcbiAgICBhc3NlcnRGdW5jdGlvbihmbik7XHJcbiAgICB2YXIgbWVtbyAgID0gdGFyZ2V0ID09IHVuZGVmaW5lZCA/IFtdIDogT2JqZWN0KHRhcmdldClcclxuICAgICAgLCBPICAgICAgPSBFUzVPYmplY3QodGhpcylcclxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcclxuICAgICAgLCBpbmRleCAgPSAwO1xyXG4gICAgd2hpbGUobGVuZ3RoID4gaW5kZXgpaWYoZm4obWVtbywgT1tpbmRleF0sIGluZGV4KyssIHRoaXMpID09PSBmYWxzZSlicmVhaztcclxuICAgIHJldHVybiBtZW1vO1xyXG4gIH1cclxufSk7XHJcbmlmKGZyYW1ld29yaylBcnJheVVuc2NvcGFibGVzLnR1cm4gPSB0cnVlO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb3JlLm51bWJlciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24obnVtYmVyTWV0aG9kcyl7ICBcclxuICBmdW5jdGlvbiBOdW1iZXJJdGVyYXRvcihpdGVyYXRlZCl7XHJcbiAgICBzZXQodGhpcywgSVRFUiwge2w6IHRvTGVuZ3RoKGl0ZXJhdGVkKSwgaTogMH0pO1xyXG4gIH1cclxuICBjcmVhdGVJdGVyYXRvcihOdW1iZXJJdGVyYXRvciwgTlVNQkVSLCBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGl0ZXIgPSB0aGlzW0lURVJdXHJcbiAgICAgICwgaSAgICA9IGl0ZXIuaSsrO1xyXG4gICAgcmV0dXJuIGkgPCBpdGVyLmwgPyBpdGVyUmVzdWx0KDAsIGkpIDogaXRlclJlc3VsdCgxKTtcclxuICB9KTtcclxuICBkZWZpbmVJdGVyYXRvcihOdW1iZXIsIE5VTUJFUiwgZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBuZXcgTnVtYmVySXRlcmF0b3IodGhpcyk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgbnVtYmVyTWV0aG9kcy5yYW5kb20gPSBmdW5jdGlvbihsaW0gLyogPSAwICovKXtcclxuICAgIHZhciBhID0gK3RoaXNcclxuICAgICAgLCBiID0gbGltID09IHVuZGVmaW5lZCA/IDAgOiArbGltXHJcbiAgICAgICwgbSA9IG1pbihhLCBiKTtcclxuICAgIHJldHVybiByYW5kb20oKSAqIChtYXgoYSwgYikgLSBtKSArIG07XHJcbiAgfTtcclxuXHJcbiAgZm9yRWFjaC5jYWxsKGFycmF5KFxyXG4gICAgICAvLyBFUzM6XHJcbiAgICAgICdyb3VuZCxmbG9vcixjZWlsLGFicyxzaW4sYXNpbixjb3MsYWNvcyx0YW4sYXRhbixleHAsc3FydCxtYXgsbWluLHBvdyxhdGFuMiwnICtcclxuICAgICAgLy8gRVM2OlxyXG4gICAgICAnYWNvc2gsYXNpbmgsYXRhbmgsY2JydCxjbHozMixjb3NoLGV4cG0xLGh5cG90LGltdWwsbG9nMXAsbG9nMTAsbG9nMixzaWduLHNpbmgsdGFuaCx0cnVuYydcclxuICAgICksIGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIHZhciBmbiA9IE1hdGhba2V5XTtcclxuICAgICAgaWYoZm4pbnVtYmVyTWV0aG9kc1trZXldID0gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XHJcbiAgICAgICAgLy8gaWU5LSBkb250IHN1cHBvcnQgc3RyaWN0IG1vZGUgJiBjb252ZXJ0IGB0aGlzYCB0byBvYmplY3QgLT4gY29udmVydCBpdCB0byBudW1iZXJcclxuICAgICAgICB2YXIgYXJncyA9IFsrdGhpc11cclxuICAgICAgICAgICwgaSAgICA9IDA7XHJcbiAgICAgICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcclxuICAgICAgICByZXR1cm4gaW52b2tlKGZuLCBhcmdzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICk7XHJcbiAgXHJcbiAgJGRlZmluZShQUk9UTyArIEZPUkNFRCwgTlVNQkVSLCBudW1iZXJNZXRob2RzKTtcclxufSh7fSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvcmUuc3RyaW5nICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbigpe1xyXG4gIHZhciBlc2NhcGVIVE1MRGljdCA9IHtcclxuICAgICcmJzogJyZhbXA7JyxcclxuICAgICc8JzogJyZsdDsnLFxyXG4gICAgJz4nOiAnJmd0OycsXHJcbiAgICAnXCInOiAnJnF1b3Q7JyxcclxuICAgIFwiJ1wiOiAnJmFwb3M7J1xyXG4gIH0sIHVuZXNjYXBlSFRNTERpY3QgPSB7fSwga2V5O1xyXG4gIGZvcihrZXkgaW4gZXNjYXBlSFRNTERpY3QpdW5lc2NhcGVIVE1MRGljdFtlc2NhcGVIVE1MRGljdFtrZXldXSA9IGtleTtcclxuICAkZGVmaW5lKFBST1RPICsgRk9SQ0VELCBTVFJJTkcsIHtcclxuICAgIGVzY2FwZUhUTUw6ICAgY3JlYXRlUmVwbGFjZXIoL1smPD5cIiddL2csIGVzY2FwZUhUTUxEaWN0KSxcclxuICAgIHVuZXNjYXBlSFRNTDogY3JlYXRlUmVwbGFjZXIoLyYoPzphbXB8bHR8Z3R8cXVvdHxhcG9zKTsvZywgdW5lc2NhcGVIVE1MRGljdClcclxuICB9KTtcclxufSgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb3JlLmRhdGUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oZm9ybWF0UmVnRXhwLCBmbGV4aW9SZWdFeHAsIGxvY2FsZXMsIGN1cnJlbnQsIFNFQ09ORFMsIE1JTlVURVMsIEhPVVJTLCBNT05USCwgWUVBUil7XHJcbiAgZnVuY3Rpb24gY3JlYXRlRm9ybWF0KHByZWZpeCl7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24odGVtcGxhdGUsIGxvY2FsZSAvKiA9IGN1cnJlbnQgKi8pe1xyXG4gICAgICB2YXIgdGhhdCA9IHRoaXNcclxuICAgICAgICAsIGRpY3QgPSBsb2NhbGVzW2hhcyhsb2NhbGVzLCBsb2NhbGUpID8gbG9jYWxlIDogY3VycmVudF07XHJcbiAgICAgIGZ1bmN0aW9uIGdldCh1bml0KXtcclxuICAgICAgICByZXR1cm4gdGhhdFtwcmVmaXggKyB1bml0XSgpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBTdHJpbmcodGVtcGxhdGUpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbihwYXJ0KXtcclxuICAgICAgICBzd2l0Y2gocGFydCl7XHJcbiAgICAgICAgICBjYXNlICdzJyAgOiByZXR1cm4gZ2V0KFNFQ09ORFMpOyAgICAgICAgICAgICAgICAgIC8vIFNlY29uZHMgOiAwLTU5XHJcbiAgICAgICAgICBjYXNlICdzcycgOiByZXR1cm4gbHooZ2V0KFNFQ09ORFMpKTsgICAgICAgICAgICAgIC8vIFNlY29uZHMgOiAwMC01OVxyXG4gICAgICAgICAgY2FzZSAnbScgIDogcmV0dXJuIGdldChNSU5VVEVTKTsgICAgICAgICAgICAgICAgICAvLyBNaW51dGVzIDogMC01OVxyXG4gICAgICAgICAgY2FzZSAnbW0nIDogcmV0dXJuIGx6KGdldChNSU5VVEVTKSk7ICAgICAgICAgICAgICAvLyBNaW51dGVzIDogMDAtNTlcclxuICAgICAgICAgIGNhc2UgJ2gnICA6IHJldHVybiBnZXQoSE9VUlMpOyAgICAgICAgICAgICAgICAgICAgLy8gSG91cnMgICA6IDAtMjNcclxuICAgICAgICAgIGNhc2UgJ2hoJyA6IHJldHVybiBseihnZXQoSE9VUlMpKTsgICAgICAgICAgICAgICAgLy8gSG91cnMgICA6IDAwLTIzXHJcbiAgICAgICAgICBjYXNlICdEJyAgOiByZXR1cm4gZ2V0KERBVEUpOyAgICAgICAgICAgICAgICAgICAgIC8vIERhdGUgICAgOiAxLTMxXHJcbiAgICAgICAgICBjYXNlICdERCcgOiByZXR1cm4gbHooZ2V0KERBVEUpKTsgICAgICAgICAgICAgICAgIC8vIERhdGUgICAgOiAwMS0zMVxyXG4gICAgICAgICAgY2FzZSAnVycgIDogcmV0dXJuIGRpY3RbMF1bZ2V0KCdEYXknKV07ICAgICAgICAgICAvLyBEYXkgICAgIDog0J/QvtC90LXQtNC10LvRjNC90LjQulxyXG4gICAgICAgICAgY2FzZSAnTicgIDogcmV0dXJuIGdldChNT05USCkgKyAxOyAgICAgICAgICAgICAgICAvLyBNb250aCAgIDogMS0xMlxyXG4gICAgICAgICAgY2FzZSAnTk4nIDogcmV0dXJuIGx6KGdldChNT05USCkgKyAxKTsgICAgICAgICAgICAvLyBNb250aCAgIDogMDEtMTJcclxuICAgICAgICAgIGNhc2UgJ00nICA6IHJldHVybiBkaWN0WzJdW2dldChNT05USCldOyAgICAgICAgICAgLy8gTW9udGggICA6INCv0L3QstCw0YDRjFxyXG4gICAgICAgICAgY2FzZSAnTU0nIDogcmV0dXJuIGRpY3RbMV1bZ2V0KE1PTlRIKV07ICAgICAgICAgICAvLyBNb250aCAgIDog0K/QvdCy0LDRgNGPXHJcbiAgICAgICAgICBjYXNlICdZJyAgOiByZXR1cm4gZ2V0KFlFQVIpOyAgICAgICAgICAgICAgICAgICAgIC8vIFllYXIgICAgOiAyMDE0XHJcbiAgICAgICAgICBjYXNlICdZWScgOiByZXR1cm4gbHooZ2V0KFlFQVIpICUgMTAwKTsgICAgICAgICAgIC8vIFllYXIgICAgOiAxNFxyXG4gICAgICAgIH0gcmV0dXJuIHBhcnQ7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBmdW5jdGlvbiBhZGRMb2NhbGUobGFuZywgbG9jYWxlKXtcclxuICAgIGZ1bmN0aW9uIHNwbGl0KGluZGV4KXtcclxuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICBmb3JFYWNoLmNhbGwoYXJyYXkobG9jYWxlLm1vbnRocyksIGZ1bmN0aW9uKGl0KXtcclxuICAgICAgICByZXN1bHQucHVzaChpdC5yZXBsYWNlKGZsZXhpb1JlZ0V4cCwgJyQnICsgaW5kZXgpKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBsb2NhbGVzW2xhbmddID0gW2FycmF5KGxvY2FsZS53ZWVrZGF5cyksIHNwbGl0KDEpLCBzcGxpdCgyKV07XHJcbiAgICByZXR1cm4gY29yZTtcclxuICB9XHJcbiAgJGRlZmluZShQUk9UTyArIEZPUkNFRCwgREFURSwge1xyXG4gICAgZm9ybWF0OiAgICBjcmVhdGVGb3JtYXQoJ2dldCcpLFxyXG4gICAgZm9ybWF0VVRDOiBjcmVhdGVGb3JtYXQoJ2dldFVUQycpXHJcbiAgfSk7XHJcbiAgYWRkTG9jYWxlKGN1cnJlbnQsIHtcclxuICAgIHdlZWtkYXlzOiAnU3VuZGF5LE1vbmRheSxUdWVzZGF5LFdlZG5lc2RheSxUaHVyc2RheSxGcmlkYXksU2F0dXJkYXknLFxyXG4gICAgbW9udGhzOiAnSmFudWFyeSxGZWJydWFyeSxNYXJjaCxBcHJpbCxNYXksSnVuZSxKdWx5LEF1Z3VzdCxTZXB0ZW1iZXIsT2N0b2JlcixOb3ZlbWJlcixEZWNlbWJlcidcclxuICB9KTtcclxuICBhZGRMb2NhbGUoJ3J1Jywge1xyXG4gICAgd2Vla2RheXM6ICfQktC+0YHQutGA0LXRgdC10L3RjNC1LNCf0L7QvdC10LTQtdC70YzQvdC40Los0JLRgtC+0YDQvdC40Los0KHRgNC10LTQsCzQp9C10YLQstC10YDQsyzQn9GP0YLQvdC40YbQsCzQodGD0LHQsdC+0YLQsCcsXHJcbiAgICBtb250aHM6ICfQr9C90LLQsNGAOtGPfNGMLNCk0LXQstGA0LDQuzrRj3zRjCzQnNCw0YDRgjrQsHws0JDQv9GA0LXQuzrRj3zRjCzQnNCwOtGPfNC5LNCY0Y7QvTrRj3zRjCwnICtcclxuICAgICAgICAgICAgJ9CY0Y7QuzrRj3zRjCzQkNCy0LPRg9GB0YI60LB8LNCh0LXQvdGC0Y/QsdGAOtGPfNGMLNCe0LrRgtGP0LHRgDrRj3zRjCzQndC+0Y/QsdGAOtGPfNGMLNCU0LXQutCw0LHRgDrRj3zRjCdcclxuICB9KTtcclxuICBjb3JlLmxvY2FsZSA9IGZ1bmN0aW9uKGxvY2FsZSl7XHJcbiAgICByZXR1cm4gaGFzKGxvY2FsZXMsIGxvY2FsZSkgPyBjdXJyZW50ID0gbG9jYWxlIDogY3VycmVudDtcclxuICB9O1xyXG4gIGNvcmUuYWRkTG9jYWxlID0gYWRkTG9jYWxlO1xyXG59KC9cXGJcXHdcXHc/XFxiL2csIC86KC4qKVxcfCguKikkLywge30sICdlbicsICdTZWNvbmRzJywgJ01pbnV0ZXMnLCAnSG91cnMnLCAnTW9udGgnLCAnRnVsbFllYXInKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29yZS5nbG9iYWwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuJGRlZmluZShHTE9CQUwgKyBGT1JDRUQsIHtnbG9iYWw6IGdsb2JhbH0pO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBqcy5hcnJheS5zdGF0aWNzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBKYXZhU2NyaXB0IDEuNiAvIFN0cmF3bWFuIGFycmF5IHN0YXRpY3Mgc2hpbVxyXG4hZnVuY3Rpb24oYXJyYXlTdGF0aWNzKXtcclxuICBmdW5jdGlvbiBzZXRBcnJheVN0YXRpY3Moa2V5cywgbGVuZ3RoKXtcclxuICAgIGZvckVhY2guY2FsbChhcnJheShrZXlzKSwgZnVuY3Rpb24oa2V5KXtcclxuICAgICAgaWYoa2V5IGluIEFycmF5UHJvdG8pYXJyYXlTdGF0aWNzW2tleV0gPSBjdHgoY2FsbCwgQXJyYXlQcm90b1trZXldLCBsZW5ndGgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHNldEFycmF5U3RhdGljcygncG9wLHJldmVyc2Usc2hpZnQsa2V5cyx2YWx1ZXMsZW50cmllcycsIDEpO1xyXG4gIHNldEFycmF5U3RhdGljcygnaW5kZXhPZixldmVyeSxzb21lLGZvckVhY2gsbWFwLGZpbHRlcixmaW5kLGZpbmRJbmRleCxpbmNsdWRlcycsIDMpO1xyXG4gIHNldEFycmF5U3RhdGljcygnam9pbixzbGljZSxjb25jYXQscHVzaCxzcGxpY2UsdW5zaGlmdCxzb3J0LGxhc3RJbmRleE9mLCcgK1xyXG4gICAgICAgICAgICAgICAgICAncmVkdWNlLHJlZHVjZVJpZ2h0LGNvcHlXaXRoaW4sZmlsbCx0dXJuJyk7XHJcbiAgJGRlZmluZShTVEFUSUMsIEFSUkFZLCBhcnJheVN0YXRpY3MpO1xyXG59KHt9KTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogd2ViLmRvbS5pdGFyYWJsZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKE5vZGVMaXN0KXtcclxuICBpZihmcmFtZXdvcmsgJiYgTm9kZUxpc3QgJiYgIShTWU1CT0xfSVRFUkFUT1IgaW4gTm9kZUxpc3RbUFJPVE9UWVBFXSkpe1xyXG4gICAgaGlkZGVuKE5vZGVMaXN0W1BST1RPVFlQRV0sIFNZTUJPTF9JVEVSQVRPUiwgSXRlcmF0b3JzW0FSUkFZXSk7XHJcbiAgfVxyXG4gIEl0ZXJhdG9ycy5Ob2RlTGlzdCA9IEl0ZXJhdG9yc1tBUlJBWV07XHJcbn0oZ2xvYmFsLk5vZGVMaXN0KTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29yZS5sb2cgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKGxvZywgZW5hYmxlZCl7XHJcbiAgLy8gTWV0aG9kcyBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9EZXZlbG9wZXJUb29sc1dHL2NvbnNvbGUtb2JqZWN0L2Jsb2IvbWFzdGVyL2FwaS5tZFxyXG4gIGZvckVhY2guY2FsbChhcnJheSgnYXNzZXJ0LGNsZWFyLGNvdW50LGRlYnVnLGRpcixkaXJ4bWwsZXJyb3IsZXhjZXB0aW9uLCcgK1xyXG4gICAgICAnZ3JvdXAsZ3JvdXBDb2xsYXBzZWQsZ3JvdXBFbmQsaW5mbyxpc0luZGVwZW5kZW50bHlDb21wb3NlZCxsb2csJyArXHJcbiAgICAgICdtYXJrVGltZWxpbmUscHJvZmlsZSxwcm9maWxlRW5kLHRhYmxlLHRpbWUsdGltZUVuZCx0aW1lbGluZSwnICtcclxuICAgICAgJ3RpbWVsaW5lRW5kLHRpbWVTdGFtcCx0cmFjZSx3YXJuJyksIGZ1bmN0aW9uKGtleSl7XHJcbiAgICBsb2dba2V5XSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgIGlmKGVuYWJsZWQgJiYga2V5IGluIGNvbnNvbGUpcmV0dXJuIGFwcGx5LmNhbGwoY29uc29sZVtrZXldLCBjb25zb2xlLCBhcmd1bWVudHMpO1xyXG4gICAgfTtcclxuICB9KTtcclxuICAkZGVmaW5lKEdMT0JBTCArIEZPUkNFRCwge2xvZzogYXNzaWduKGxvZy5sb2csIGxvZywge1xyXG4gICAgZW5hYmxlOiBmdW5jdGlvbigpe1xyXG4gICAgICBlbmFibGVkID0gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICBkaXNhYmxlOiBmdW5jdGlvbigpe1xyXG4gICAgICBlbmFibGVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSl9KTtcclxufSh7fSwgdHJ1ZSk7XG59KHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PT0gTWF0aCA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpLCBmYWxzZSk7XG5tb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IG1vZHVsZS5leHBvcnRzLCBfX2VzTW9kdWxlOiB0cnVlIH07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jb3JlID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qc1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBoZWxwZXJzID0gZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB7fTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmhlbHBlcnMuaW5oZXJpdHMgPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuICBpZiAoc3VwZXJDbGFzcykgc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzcztcbn07XG5cbmhlbHBlcnMuZGVmYXVsdHMgPSBmdW5jdGlvbiAob2JqLCBkZWZhdWx0cykge1xuICB2YXIga2V5cyA9IF9jb3JlLk9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGRlZmF1bHRzKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2V5ID0ga2V5c1tpXTtcblxuICAgIHZhciB2YWx1ZSA9IF9jb3JlLk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZGVmYXVsdHMsIGtleSk7XG5cbiAgICBpZiAodmFsdWUgJiYgdmFsdWUuY29uZmlndXJhYmxlICYmIG9ialtrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG5oZWxwZXJzLnByb3RvdHlwZVByb3BlcnRpZXMgPSBmdW5jdGlvbiAoY2hpbGQsIHN0YXRpY1Byb3BzLCBpbnN0YW5jZVByb3BzKSB7XG4gIGlmIChzdGF0aWNQcm9wcykgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoY2hpbGQsIHN0YXRpY1Byb3BzKTtcbiAgaWYgKGluc3RhbmNlUHJvcHMpIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGNoaWxkLnByb3RvdHlwZSwgaW5zdGFuY2VQcm9wcyk7XG59O1xuXG5oZWxwZXJzLmFwcGx5Q29uc3RydWN0b3IgPSBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIGFyZ3MpIHtcbiAgdmFyIGluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZShDb25zdHJ1Y3Rvci5wcm90b3R5cGUpO1xuICB2YXIgcmVzdWx0ID0gQ29uc3RydWN0b3IuYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xuICByZXR1cm4gcmVzdWx0ICE9IG51bGwgJiYgKHR5cGVvZiByZXN1bHQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgcmVzdWx0ID09IFwiZnVuY3Rpb25cIikgPyByZXN1bHQgOiBpbnN0YW5jZTtcbn07XG5cbmhlbHBlcnMudGFnZ2VkVGVtcGxhdGVMaXRlcmFsID0gZnVuY3Rpb24gKHN0cmluZ3MsIHJhdykge1xuICByZXR1cm4gX2NvcmUuT2JqZWN0LmZyZWV6ZShPYmplY3QuZGVmaW5lUHJvcGVydGllcyhzdHJpbmdzLCB7XG4gICAgcmF3OiB7XG4gICAgICB2YWx1ZTogX2NvcmUuT2JqZWN0LmZyZWV6ZShyYXcpXG4gICAgfVxuICB9KSk7XG59O1xuXG5oZWxwZXJzLnRhZ2dlZFRlbXBsYXRlTGl0ZXJhbExvb3NlID0gZnVuY3Rpb24gKHN0cmluZ3MsIHJhdykge1xuICBzdHJpbmdzLnJhdyA9IHJhdztcbiAgcmV0dXJuIHN0cmluZ3M7XG59O1xuXG5oZWxwZXJzLmludGVyb3BSZXF1aXJlID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqW1wiZGVmYXVsdFwiXSA6IG9iajtcbn07XG5cbmhlbHBlcnMudG9BcnJheSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXJyKSA/IGFyciA6IF9jb3JlLkFycmF5LmZyb20oYXJyKTtcbn07XG5cbmhlbHBlcnMudG9Db25zdW1hYmxlQXJyYXkgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBhcnIyW2ldID0gYXJyW2ldO1xuXG4gICAgcmV0dXJuIGFycjI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIF9jb3JlLkFycmF5LmZyb20oYXJyKTtcbiAgfVxufTtcblxuaGVscGVycy5zbGljZWRUb0FycmF5ID0gZnVuY3Rpb24gKGFyciwgaSkge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgcmV0dXJuIGFycjtcbiAgfSBlbHNlIGlmIChfY29yZS4kZm9yLmlzSXRlcmFibGUoT2JqZWN0KGFycikpKSB7XG4gICAgdmFyIF9hcnIgPSBbXTtcblxuICAgIGZvciAodmFyIF9pdGVyYXRvciA9IF9jb3JlLiRmb3IuZ2V0SXRlcmF0b3IoYXJyKSwgX3N0ZXA7ICEoX3N0ZXAgPSBfaXRlcmF0b3IubmV4dCgpKS5kb25lOykge1xuICAgICAgX2Fyci5wdXNoKF9zdGVwLnZhbHVlKTtcblxuICAgICAgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBfYXJyO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpO1xuICB9XG59O1xuXG5oZWxwZXJzLm9iamVjdFdpdGhvdXRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKG9iaiwga2V5cykge1xuICB2YXIgdGFyZ2V0ID0ge307XG5cbiAgZm9yICh2YXIgaSBpbiBvYmopIHtcbiAgICBpZiAoa2V5cy5pbmRleE9mKGkpID49IDApIGNvbnRpbnVlO1xuICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGNvbnRpbnVlO1xuICAgIHRhcmdldFtpXSA9IG9ialtpXTtcbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59O1xuXG5oZWxwZXJzLmhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5oZWxwZXJzLnNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuaGVscGVycy5iaW5kID0gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQ7XG5cbmhlbHBlcnMuZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiAob2JqLCBrZXksIHZhbHVlKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICB2YWx1ZTogdmFsdWUsXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWVcbiAgfSk7XG59O1xuXG5oZWxwZXJzLmFzeW5jVG9HZW5lcmF0b3IgPSBmdW5jdGlvbiAoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZ2VuID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gbmV3IF9jb3JlLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGNhbGxOZXh0ID0gc3RlcC5iaW5kKG51bGwsIFwibmV4dFwiKTtcbiAgICAgIHZhciBjYWxsVGhyb3cgPSBzdGVwLmJpbmQobnVsbCwgXCJ0aHJvd1wiKTtcblxuICAgICAgZnVuY3Rpb24gc3RlcChrZXksIGFyZykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciBpbmZvID0gZ2VuW2tleV0oYXJnKTtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBpbmZvLnZhbHVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgICAgIHJlc29sdmUodmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9jb3JlLlByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihjYWxsTmV4dCwgY2FsbFRocm93KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjYWxsTmV4dCgpO1xuICAgIH0pO1xuICB9O1xufTtcblxuaGVscGVycy5pbnRlcm9wUmVxdWlyZVdpbGRjYXJkID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDoge1xuICAgIFwiZGVmYXVsdFwiOiBvYmpcbiAgfTtcbn07XG5cbmhlbHBlcnMuX3R5cGVvZiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouY29uc3RydWN0b3IgPT09IF9jb3JlLlN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xufTtcblxuaGVscGVycy5fZXh0ZW5kcyA9IF9jb3JlLk9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59O1xuXG5oZWxwZXJzLmdldCA9IGZ1bmN0aW9uIGdldChfeCwgX3gyLCBfeDMpIHtcbiAgdmFyIF9hZ2FpbiA9IHRydWU7XG5cbiAgX2Z1bmN0aW9uOiB3aGlsZSAoX2FnYWluKSB7XG4gICAgX2FnYWluID0gZmFsc2U7XG4gICAgdmFyIG9iamVjdCA9IF94LFxuICAgICAgICBwcm9wZXJ0eSA9IF94MixcbiAgICAgICAgcmVjZWl2ZXIgPSBfeDM7XG4gICAgZGVzYyA9IHBhcmVudCA9IGdldHRlciA9IHVuZGVmaW5lZDtcblxuICAgIHZhciBkZXNjID0gX2NvcmUuT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTtcblxuICAgIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBwYXJlbnQgPSBfY29yZS5PYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3ggPSBwYXJlbnQ7XG4gICAgICAgIF94MiA9IHByb3BlcnR5O1xuICAgICAgICBfeDMgPSByZWNlaXZlcjtcbiAgICAgICAgX2FnYWluID0gdHJ1ZTtcbiAgICAgICAgY29udGludWUgX2Z1bmN0aW9uO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MgJiYgZGVzYy53cml0YWJsZSkge1xuICAgICAgcmV0dXJuIGRlc2MudmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBnZXR0ZXIgPSBkZXNjLmdldDtcblxuICAgICAgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7XG4gICAgfVxuICB9XG59O1xuXG5oZWxwZXJzLnNldCA9IGZ1bmN0aW9uIHNldChfeCwgX3gyLCBfeDMsIF94NCkge1xuICB2YXIgX2FnYWluID0gdHJ1ZTtcblxuICBfZnVuY3Rpb246IHdoaWxlIChfYWdhaW4pIHtcbiAgICBfYWdhaW4gPSBmYWxzZTtcbiAgICB2YXIgb2JqZWN0ID0gX3gsXG4gICAgICAgIHByb3BlcnR5ID0gX3gyLFxuICAgICAgICB2YWx1ZSA9IF94MyxcbiAgICAgICAgcmVjZWl2ZXIgPSBfeDQ7XG4gICAgZGVzYyA9IHBhcmVudCA9IHNldHRlciA9IHVuZGVmaW5lZDtcblxuICAgIHZhciBkZXNjID0gX2NvcmUuT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTtcblxuICAgIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBwYXJlbnQgPSBfY29yZS5PYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcblxuICAgICAgaWYgKHBhcmVudCAhPT0gbnVsbCkge1xuICAgICAgICBfeCA9IHBhcmVudDtcbiAgICAgICAgX3gyID0gcHJvcGVydHk7XG4gICAgICAgIF94MyA9IHZhbHVlO1xuICAgICAgICBfeDQgPSByZWNlaXZlcjtcbiAgICAgICAgX2FnYWluID0gdHJ1ZTtcbiAgICAgICAgY29udGludWUgX2Z1bmN0aW9uO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MgJiYgZGVzYy53cml0YWJsZSkge1xuICAgICAgcmV0dXJuIGRlc2MudmFsdWUgPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHNldHRlciA9IGRlc2Muc2V0O1xuXG4gICAgICBpZiAoc2V0dGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHNldHRlci5jYWxsKHJlY2VpdmVyLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5oZWxwZXJzLmNsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07XG5cbmhlbHBlcnMub2JqZWN0RGVzdHJ1Y3R1cmluZ0VtcHR5ID0gZnVuY3Rpb24gKG9iaikge1xuICBpZiAob2JqID09IG51bGwpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgZGVzdHJ1Y3R1cmUgdW5kZWZpbmVkXCIpO1xufTtcblxuaGVscGVycy50ZW1wb3JhbFVuZGVmaW5lZCA9IHt9O1xuXG5oZWxwZXJzLnRlbXBvcmFsQXNzZXJ0RGVmaW5lZCA9IGZ1bmN0aW9uICh2YWwsIG5hbWUsIHVuZGVmKSB7XG4gIGlmICh2YWwgPT09IHVuZGVmKSB7XG4gICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKG5hbWUgKyBcIiBpcyBub3QgZGVmaW5lZCAtIHRlbXBvcmFsIGRlYWQgem9uZVwiKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuaGVscGVycy5zZWxmR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiBnbG9iYWw7IixudWxsLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iXX0=
