import BaseLfo from '../core/base-lfo';


/**
 *  accumulate intput and expose it - allow view (see waves-ui) to pull data for rendering
 *  bridge between `push` to `pull` paradigm
 */
export default class Bridge extends BaseLfo {
  constructor(options, process) {
    super(options, {});

    this.process = process.bind(this);
    this.data = this.outFrame = [];
  }

  setupStream() {
    super.setupStream();
    this.data.length = 0;
  }

  reset() {
    this.data.length = 0;
  }
}