
module.exports = {
  // core
  graph: require('./dist/core/graph'),
  lfoBase: require('./dist/core/lfo-base'),
  // sources
  sourceAudioNode: require('./dist/sources/audio-in-node'),
  sourceAudioBuffer: require('./dist/sources/audio-in-buffer'),
  // sink
  sinkDraw: require('./dist/sink/draw'),
  // operators
  magnitude: require('./dist/operators/magnitude'),
  biquad: require('./dist/operators/biquad')
};
