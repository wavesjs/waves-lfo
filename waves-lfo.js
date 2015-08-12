module.exports = {
  // core
  // Graph: require('./dist/core/graph'), // still needed ?
  core: {
    BaseLfo         : require('./dist/core/base-lfo'),
  },

  source: {
    AudioInBuffer   : require('./dist/sources/audio-in-buffer'),
    AudioInNode     : require('./dist/sources/audio-in-node'),
    // EventIn: require('./dist/sources/event-in'),
    // retest
    // SocketServer: require('./dist/sources/socket-sources').SocketSourceServer,
    // SocketClient: require('./dist/sources/socket-sources').SocketSourceClient,
  },

  sink: {
    // Bpf: require('./dist/sink/bpf'),
    // Trace: require('./dist/sink/trace'),
    // SynchronizedDraw: require('./dist/sink/synchronized-draw'),
    AudioRecorder   : require('./dist/sink/audio-recorder'),
    Waveform        : require('./dist/sink/waveform'),
    // // retest
    // SocketClient: require('./dist/sink/socket-sinks').SocketSinkClient,
    // SocketServer: require('./dist/sink/socket-sinks').SocketSinkServer,
  },

  operator: {
    // Magnitude: require('./dist/operators/magnitude'),
    // Framer: require('./dist/operators/framer'),
    // Biquad: require('./dist/operators/biquad'),
    MinMax          : require('./dist/operators/min-max'),
    // // MinMaxAsm: require('./dist/operators/_min-max-asm-test'),
    // Operator: require('./dist/operators/operator'),
    Noop            : require('./dist/operators/noop'),
  },
};
