module.exports = {
  // core
  // Graph: require('./dist/core/graph'), // still needed ?
  core: {
    BaseLfo           : require('./dist/core/base-lfo'),
  },

  sources: {
    AudioInBuffer     : require('./dist/sources/audio-in-buffer'),
    AudioInNode       : require('./dist/sources/audio-in-node'),
    EventIn           : require('./dist/sources/event-in'),
    // retest
    // SocketServer: require('./dist/sources/socket-sources').SocketSourceServer,
    // SocketClient: require('./dist/sources/socket-sources').SocketSourceClient,
  },

  sinks: {
    AudioRecorder     : require('./dist/sinks/audio-recorder'),
    Bpf               : require('./dist/sinks/bpf'),
    DataRecorder      : require('./dist/sinks/data-recorder'),
    Trace             : require('./dist/sinks/trace'),
    SynchronizedDraw  : require('./dist/sinks/synchronized-draw'),
    Waveform          : require('./dist/sinks/waveform'),
    // retest
    // SocketClient: require('./dist/sink/socket-sinks').SocketSinkClient,
    // SocketServer: require('./dist/sink/socket-sinks').SocketSinkServer,
  },

  operators: {
    Biquad            : require('./dist/operators/biquad'),
    Fft               : require('./dist/operators/fft'),
    Framer            : require('./dist/operators/framer'),
    Magnitude         : require('./dist/operators/magnitude'),
    MinMax            : require('./dist/operators/min-max'),
    // MinMaxAsm: require('./dist/operators/_min-max-asm-test'),
    Noop              : require('./dist/operators/noop'),
    Operator          : require('./dist/operators/operator'),
  },
};
