import BaseLfo from '../core/base-lfo';

const worker = `
var _separateArrays = false;
var _data = [];
var _separateArraysData = { time: [], data: [] };

function init() {
  _data.length = 0;
  _separateArraysData.time.length = 0;
  _separateArraysData.data.length = 0;
}

function process(time, data) {
  if (_separateArrays) {
    _separateArraysData.time.push(time);
    _separateArraysData.data.push(data);
  } else {
    var datum = { time: time, data: data };
    _data.push(datum);
  }
}

self.addEventListener('message', function(e) {
  switch (e.data.command) {
    case 'init':
      _separateArrays = e.data.separateArrays;
      init();
      break;
    case 'process':
      var time = e.data.time;
      var data = new Float32Array(e.data.buffer);
      process(time, data);
      break;
    case 'stop':
      var data = _separateArrays ? _separateArraysData : _data;
      self.postMessage({ data: data });
      init();
      break;
  }
});
`;

export default class DataRecorder extends BaseLfo {
  constructor(options) {
    super({
      // default format is [{time, data}, {time, data}]
      // if set to `true` format is { time: [...], data: [...] }
      separateArrays: false,
    }, options);

    // @todo - rename `isRecording`
    this._isStarted = false;

    // init worker
    const blob = new Blob([worker], { type: 'text/javascript' });
    this.worker = new Worker(window.URL.createObjectURL(blob));
  }

  initialize(inStreamParams) {
    super.initialize(inStreamParams);

    this.worker.postMessage({
      command: 'init',
      separateArrays: this.params.separateArrays,
    });
  }

  start() {
    this._isStarted = true;
  }

  stop() {
    if (this._isStarted) {
      this.worker.postMessage({ command: 'stop' });
      this._isStarted = false;
    }
  }

  finalize() {
    this.stop();
  }

  process(time, frame, metaData) {
    if (!this._isStarted) { return; }

    this.outFrame = new Float32Array(frame);
    const buffer = this.outFrame.buffer;

    this.worker.postMessage({
      command: 'process',
      time: time,
      buffer: buffer,
    }, [buffer]);
  }

  retrieve() {
    return new Promise((resolve, reject) => {
      const callback = (e) => {
        this._started = false;

        this.worker.removeEventListener('message', callback, false);
        resolve(e.data.data);
      };

      this.worker.addEventListener('message', callback, false);
    });
  }
}
