// @TODO pass * uppercase as it is constructors
module.exports = {
  // core
  graph: require('./dist/core/graph'),
  lfoBase: require('./dist/core/lfo-base'),
  // sources
  sourceAudioNode: require('./dist/sources/audio-in-node'),
  sourceAudioBuffer: require('./dist/sources/audio-in-buffer'),
  sourceEventIn: require('./dist/sources/event-in'),
  // sink
  sinkBpf: require('./dist/sink/bpf'),
  sinkTrace: require('./dist/sink/trace'),
  sinkWaveform: require('./dist/sink/waveform'),
  synchronizedSink: require('./dist/sink/synchronized-sink'),
  // operators
  magnitude: require('./dist/operators/magnitude'),
  framer: require('./dist/operators/framer'),
  biquad: require('./dist/operators/biquad'),
  minMax: require('./dist/operators/min-max'),
  operator: require('./dist/operators/operator'),

  noop: require('./dist/operators/noop')
};
