module.exports = {
  // core
  // Graph: require('./dist/core/graph'), // still needed ?
  core: {
    LfoBase: require('./dist/core/lfo-base'),
  },

  source: {
    AudioInNode: require('./dist/sources/audio-in-node'),
    AudioInBuffer: require('./dist/sources/audio-in-buffer'),
    EventIn: require('./dist/sources/event-in'),
    // retest
    SocketServer: require('./dist/sources/socket-sources').SocketSourceServer,
    SocketClient: require('./dist/sources/socket-sources').SocketSourceClient,
  },

  sink: {
    Bpf: require('./dist/sink/bpf'),
    Trace: require('./dist/sink/trace'),
    Waveform: require('./dist/sink/waveform'),
    SynchronizedDraw: require('./dist/sink/synchronized-draw'),
    Recorder: require('./dist/sink/recorder'),
    // retest
    SocketClient: require('./dist/sink/socket-sinks').SocketSinkClient,
    SocketServer: require('./dist/sink/socket-sinks').SocketSinkServer,
  },

  operator: {
    Magnitude: require('./dist/operators/magnitude'),
    Framer: require('./dist/operators/framer'),
    Biquad: require('./dist/operators/biquad'),
    MinMax: require('./dist/operators/min-max'),
    // MinMaxAsm: require('./dist/operators/_min-max-asm-test'),
    Operator: require('./dist/operators/operator'),
    Noop: require('./dist/operators/noop'),
  },
};
