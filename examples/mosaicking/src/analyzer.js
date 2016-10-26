import * as lfo from 'waves-lfo/client';

export default {
  init(config, source) {
    this.source = source;
    this.config = config;

    this.analyze = this.analyze.bind(this);
    this.getStats = this.getStats.bind(this);
    this.normalize = this.normalize.bind(this);
  },

  run() {
    return this.analyze()
      .then(this.getStats)
      .then(this.normalize);
  },

  analyze() {
    return new Promise((resolve, reject) => {
      console.time('analyze');

      const slicer = new lfo.operator.Slicer({
        frameSize: this.config.frameSize,
        hopSize: this.config.hopSize,
      });

      const mfcc = new lfo.operator.MFCC({
        nbrBands: this.config.nbrBands,
        nbrCoefs: this.config.nbrCoefs,
        minFreq: this.config.minFreq,
        maxFreq: this.config.maxFreq,
      });

      const dataRecorder = new lfo.sink.DataRecorder({
        callback: (frames) => {
          console.timeEnd('analyze');
          resolve(frames);
        },
      });

      const logger = new lfo.sink.Logger({ time: true });

      this.source.connect(slicer);
      slicer.connect(mfcc);
      mfcc.connect(dataRecorder);

      dataRecorder.start();
      this.source.start();
    });
  },

  getStats(frames) {
    console.time('getStats');

    const nbrCoefs = this.config.nbrCoefs;
    const stats = new Array(nbrCoefs);
    const cepsSignals = new Array(nbrCoefs);
    const meanStddev = new lfo.operator.MeanStddev();
    meanStddev.initStream({ frameSize: frames.length });
    // mean sdtdev on each ceps
    for (let i = 0; i < nbrCoefs; i++)
      cepsSignals[i] = new Float32Array(frames.length);

    // transpose
    for (let i = 0; i < frames.length; i++) {
      for (let j = 0; j < nbrCoefs; j++)
        cepsSignals[j][i] = frames[i].data[j];
    }

    for (let i = 0; i < nbrCoefs; i++)
      stats[i] = meanStddev.inputSignal(cepsSignals[i]).slice(0);

    console.timeEnd('getStats');

    return Promise.all([frames, stats]);
  },

  normalize([frames, stats]) {
    console.time('normalize');

    for (let i = 0; i < frames.length; i++) {
      const data = frames[i].data;

      for (let j = 0; j < stats.length; j++) {
        data[j] -= stats[j][0];
        data[j] /= stats[j][1];
      }
    }

    console.timeEnd('normalize');
    return Promise.resolve(frames);
  },
};
