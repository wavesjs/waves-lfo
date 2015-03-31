// @TODO pass * uppercase as it is constructors
module.exports = {
  // core
  // Graph: require('./dist/core/graph'),
  LfoBase: require('./dist/core/lfo-base'),
  // sources
  SourceAudioNode: require('./dist/sources/audio-in-node'),
  SourceAudioBuffer: require('./dist/sources/audio-in-buffer'),
  SourceEventIn: require('./dist/sources/event-in'),

  SocketSourceServer: require('./dist/sources/socket-sources').SocketSourceServer,
  SocketSourceClient: require('./dist/sources/socket-sources').SocketSourceClient,
  // sink
  SinkBpf: require('./dist/sink/bpf'),
  SinkTrace: require('./dist/sink/trace'),
  SinkWaveform: require('./dist/sink/waveform'),
  SynchronizedDraw: require('./dist/sink/synchronized-draw'),

  SocketSinkClient: require('./dist/sink/socket-sinks').SocketSinkClient,
  SocketSinkServer: require('./dist/sink/socket-sinks').SocketSinkServer,
  // operators
  Magnitude: require('./dist/operators/magnitude'),
  Framer: require('./dist/operators/framer'),
  Biquad: require('./dist/operators/biquad'),
  MinMax: require('./dist/operators/min-max'),
  Operator: require('./dist/operators/operator'),

  Noop: require('./dist/operators/noop')
};
