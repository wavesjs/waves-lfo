import BaseLfo from '../core/base-lfo';

let audioContext; // for lazy audioContext creation

export default class AudioIn extends BaseLfo {

  constructor(options = {}) {
    // defaults
    const defaults = {
      frameSize: 512,
      channel: 0,
    };

    super(options, defaults);

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

  start() {}
  stop() {}
}

module.exports = AudioIn;
