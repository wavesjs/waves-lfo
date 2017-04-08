import * as lfo from 'waves-lfo/client';


class AsyncInit extends lfo.core.BaseLfo {
  // override BaseLfo.initModule to introduce asynchronous initialization
  initModule() {
    // get promises from children
    const promises = this.nextModules.map((module) => {
      return module.initModule();
    });
    // add own async initialization
    const asyncInit = new Promise((resolve, reject) => {
      setTimeout(resolve, 1000);
    });

    promises.push(asyncInit);
    // resolve when everything is done
    return Promise.all(promises);
  }

  processVector(frame) {
    this.frame.data = frame.data;
  }
}

const src = new lfo.source.EventIn({
  frameSize: 2,
  frameType: 'vector',
  frameRate: 0,
  absoluteTime: true,
});

const asyncInit = new AsyncInit();
const logger = new lfo.sink.Logger({
  data: true,
  time: true,
});

src.connect(asyncInit);
asyncInit.connect(logger);

// `init` resolves when start can be called safely, synchronously
src.init().then(() => {
  src.start();
  src.processFrame({ time: 1, data: [1, 1] });
});

src.processFrame({ time: 0, data: [0, 0] });

// async (lazy) use of `start`, `init` is then called internally
// src.start();
// setTimeout(() => {
//   src.processFrame({ time: 0, data: [0, 0] });
// }, 1000);

// setTimeout(() => {
//   src.processFrame({ time: 1, data: [1, 1] });
// }, 4000);
