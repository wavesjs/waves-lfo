
module.exports = {
  // core
  graph: require('./dist/core/graph'),
  lfoBase: require('./dist/core/lfo-base'),
  // sources
  sourceAudioNode: require('./dist/sources/audio-in-node'),
  sourceAudioBuffer: require('./dist/sources/audio-in-buffer'),
  sourceEventIn: require('./dist/sources/event-in'),
  // sink
  sinkDraw: require('./dist/sink/draw'),
  sinkBpf: require('./dist/sink/bpf'),
  sinkTrace: require('./dist/sink/trace'),
  sinkWaveform: require('./dist/sink/waveform'),
  synchronizedSink: require('./dist/sink/synchronized-sink'),
  // operators
  magnitude: require('./dist/operators/magnitude'),
  framer: require('./dist/operators/framer'),
  biquad: require('./dist/operators/biquad'),
  minMax: require('./dist/operators/min-max'),

  noop: require('./dist/operators/noop')
};
