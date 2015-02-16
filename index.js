"use strict";

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

var LFO = require('lfo');

var sin = Math.sin;
var cos = Math.cos;
var M_PI = Math.PI;
var sqrt = Math.sqrt;

class Biquad extends LFO {
  constructor(opts) {

    opts = this.extend(this.config, opts);

    var type = opts.type || 'lowpass';
    var frameRate = opts.frameRate;
  
    var f0 = (opts.f0 || 1000) / frameRate;
    var gain = opts.gain || 1;
    var q = 1.0;

    if(opts.q)  q = opts.q;
    if(opts.bw) q = f0 / opts.bw;

    // to implement
    // if(opts.damp) …
    // if(opts.decay) …
    // if(opts.over) …

    this.b0  = 0;
    this.b1  = 0;
    this.b2  = 0;
    this.a1  = 0;
    this.a2  = 0;

    this.xn_1  = 0;
    this.xn_2  = 0;
    this.yn_1  = 0;
    this.yn_2  = 0;

    this.coefs(type, f0, q, gain);
  }

  /* helper */
  coefs(type, f0, q, gain) {

    switch(type) {
      case 'lowpass':
        this.lowpass_coefs(f0, q);
        break;

      case 'highpass':
        this.highpass_coefs(f0, q);
        break;

      case 'bandpass_constant_skirt':
        this.bandpass_constant_skirt_coefs(f0, q);
        break;

      case 'bandpass_constant_peak':
        this.bandpass_constant_peak_coefs(f0, q);
        break;

      case 'notch':
        this.notch_coefs(f0, q);
        break;

      case 'allpass':
        this.allpass_coefs(f0, q);
        break;

      case 'peaking':
        this.peaking_coefs(f0, q, gain);
        break;

      case 'lowshelf':
        this.lowshelf_coefs(f0, q, gain);
        break;

      case 'highshelf':
        this.highshelf_coefs(f0, q, gain);
        break;
    }

    switch(type) {
      case 'lowpass':
      case 'highpass':
      case 'bandpass_constant_skirt':
      case 'bandpass_constant_peak':
      case 'notch':
      case 'allpass':

       if(gain != 1.0) {
         this.b0 *= gain;
         this.b1 *= gain;
         this.b2 *= gain;
       }

       break;

      /* gain is already integrated for the following */
      case 'peaking':
      case 'lowshelf':
      case 'highshelf':
        break;
    }

  }

  // coefs calculations
  // ------------------

  /* LPF: H(s) = 1 / (s^2 + s/Q + 1) */
  lowpass_coefs(f0, q) {
    
    var w0 = M_PI * f0;
    var alpha = sin(w0) / (2.0 * q);
    var c = cos(w0);

    var a0_inv = 1.0 / (1.0 + alpha);

    this.a1 = (-2.0 * c) * a0_inv;
    this.a2 = (1.0 - alpha) * a0_inv;

    this.b0 = ((1.0 - c) * 0.5) * a0_inv;
    this.b1 = (1.0 - c) * a0_inv;
    this.b2 = this.b0;

  }

  /* HPF: H(s) = s^2 / (s^2 + s/Q + 1) */
  highpass_coefs(f0, q) {
    
    var w0 = M_PI * f0;
    var alpha = sin(w0) / (2.0 * q);
    var c = cos(w0);

    var a0_inv = 1.0 / (1.0 + alpha);

    this.a1 = (-2.0 * c) * a0_inv;
    this.a2 = (1.0 - alpha) * a0_inv;

    this.b0 = ((1.0 + c) * 0.5) * a0_inv;
    this.b1 = (-1.0 - c) * a0_inv;
    this.b2 = this.b0;

  }

  /* BPF: H(s) = s / (s^2 + s/Q + 1)  (constant skirt gain, peak gain = Q) */
  bandpass_constant_skirt_coefs(f0, q) {

    var w0 = M_PI * f0;
    var s = sin(w0);
    var alpha = s / (2.0 * q);
    var c = cos(w0);

    var a0_inv = 1.0 / (1.0 + alpha);

    this.a1 = (-2.0 * c) * a0_inv;
    this.a2 = (1.0 - alpha) * a0_inv;

    this.b0 = (s * 0.5) * a0_inv;
    this.b1 = 0.0;
    this.b2 = -this.b0;

  }

  /* BPF: H(s) = (s/Q) / (s^2 + s/Q + 1)      (constant 0 dB peak gain) */
  bandpass_constant_peak_coefs(f0, q) {
    
    var w0 = M_PI * f0;
    var alpha = sin(w0) / (2.0 * q);
    var c = cos(w0);

    var a0_inv = 1.0 / (1.0 + alpha);

    this.a1 = (-2.0 * c) * a0_inv;
    this.a2 = (1.0 - alpha) * a0_inv;

    this.b0 = alpha * a0_inv;
    this.b1 = 0.0;
    this.b2 = -this.b0;
  }

  /* notch: H(s) = (s^2 + 1) / (s^2 + s/Q + 1) */
  notch_coefs(f0, q) {

    var w0 = M_PI * f0;
    var alpha = sin(w0) / (2.0 * q);
    var c = cos(w0);

    var a0_inv = 1.0 / (1.0 + alpha);

    this.a1 = (-2.0 * c) * a0_inv;
    this.a2 = (1.0 - alpha) * a0_inv;

    this.b0 = a0_inv;
    this.b1 = this.a1;
    this.b2 = this.b0;

  }

  /* APF: H(s) = (s^2 - s/Q + 1) / (s^2 + s/Q + 1) */
  allpass_coefs(f0, q) {

    var w0 = M_PI * f0;
    var alpha = sin(w0) / (2.0 * q);
    var c = cos(w0);

    var a0_inv = 1.0 / (1.0 + alpha);

    this.a1 = (-2.0 * c) * a0_inv;
    this.a2 = (1.0 - alpha) * a0_inv;

    this.b0 = this.a2;
    this.b1 = this.a1;
    this.b2 = 1.0;

  }

  /* peakingEQ: H(s) = (s^2 + s*(A/Q) + 1) / (s^2 + s/(A*Q) + 1) */
  /* A = sqrt( 10^(dBgain/20) ) = 10^(dBgain/40) */
  /* gain is linear here */
  peaking_coefs(f0, q, gain) {
    
    var g = sqrt(gain);
    var g_inv = 1.0 / g;

    var w0 = M_PI * f0;
    var alpha = sin(w0) / (2.0 * q);
    var c = cos(w0);

    var a0_inv = 1.0 / (1.0 + alpha * g_inv);

    this.a1 = (-2.0 * c) * a0_inv;
    this.a2 = (1.0 - alpha * g_inv) * a0_inv;

    this.b0 = (1.0 + alpha * g) * a0_inv;
    this.b1 = this.a1;
    this.b2 = (1.0 - alpha * g) * a0_inv;

  }

  /* lowShelf: H(s) = A * (s^2 + (sqrt(A)/Q)*s + A)/(A*s^2 + (sqrt(A)/Q)*s + 1) */
  /* A = sqrt( 10^(dBgain/20) ) = 10^(dBgain/40) */
  /* gain is linear here */
  lowshelf_coefs(f0, q, gain) {

    var g = sqrt(gain);

    var w0 = M_PI * f0;
    var alpha_2_sqrtg = sin(w0) * sqrt(g) / q ;
    var c = cos(w0);

    var a0_inv = 1.0 / ( (g+1.0) + (g-1.0) * c + alpha_2_sqrtg);

    this.a1 = (-2.0 *     ( (g-1.0) + (g+1.0) * c                ) ) * a0_inv;
    this.a2 = (             (g+1.0) + (g-1.0) * c - alpha_2_sqrtg  ) * a0_inv;

    this.b0 = (       g * ( (g+1.0) - (g-1.0) * c + alpha_2_sqrtg) ) * a0_inv;
    this.b1 = ( 2.0 * g * ( (g-1.0) - (g+1.0) * c                ) ) * a0_inv;
    this.b2 = (       g * ( (g+1.0) - (g-1.0) * c - alpha_2_sqrtg) ) * a0_inv;

  }

  /* highShelf: H(s) = A * (A*s^2 + (sqrt(A)/Q)*s + 1)/(s^2 + (sqrt(A)/Q)*s + A) */
  /* A = sqrt( 10^(dBgain/20) ) = 10^(dBgain/40) */
  /* gain is linear here */
  highshelf_coefs(f0, q, gain) {
    
    var g = sqrt(gain);

    var w0 = M_PI * f0;
    var alpha_2_sqrtg = sin(w0) * sqrt(g) / q ;
    var c = cos(w0);

    var a0_inv = 1.0 / ( (g+1.0) - (g-1.0) * c + alpha_2_sqrtg);

    this.a1 = ( 2.0 *     ( (g-1.0) - (g+1.0) * c                ) ) * a0_inv;
    this.a2 = (             (g+1.0) - (g-1.0) * c - alpha_2_sqrtg  ) * a0_inv;

    this.b0 = (      g * (  (g+1.0) + (g-1.0) * c + alpha_2_sqrtg) ) * a0_inv;
    this.b1 = (-2.0 * g * ( (g-1.0) + (g+1.0) * c                ) ) * a0_inv;
    this.b2 = (      g * (  (g+1.0) + (g-1.0) * c - alpha_2_sqrtg) ) * a0_inv;

  }

  // Main processing function called
  processScalar(time, data) {

    this.nextOperator(time, this.df1(data));
  }

  /* direct form I */
  /* a0 = 1, a1 = a[0], a2 = a[1] */
  /* 4 states (in that order): x(n-1), x(n-2), y(n-1), y(n-2)  */
  df1(x) {
    
    var y = this.b0 * x + this.b1 * this.xn_1 + this.b2 * this.xn_2 - this.a1 * this.yn_1 - this.a2 * this.yn_2;

    // update states
    this.xn_2 = this.xn_1;
    this.xn_1 = x;

    this.xn_4 = this.xn_3;
    this.xn_3 = this.yn_1;

    return y;
  }

  /* transposed direct form II */
  /* a0 = 1, a1 = a[0], a2 = a[1] */
  /* 2 states */
  df2t(x) {

    var y = this.b0 * x + this.xn_1;
    
    this.xn_1 = this.b1 * x - this.a1 * y + this.xn_2;
    this.xn_2 = this.b2 * x - this.a2 * y;

    return y;
  }

}

module.exports = Biquad;
