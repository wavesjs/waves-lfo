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
    Max               : require('./dist/operators/max'),
    MinMax            : require('./dist/operators/min-max'),
    MovingAverage     : require('./dist/operators/moving-average'),
    MovingMedian      : require('./dist/operators/moving-median'),
    Noop              : require('./dist/operators/noop'),
    Operator          : require('./dist/operators/operator'),
  },
};
