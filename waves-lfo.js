
module.exports = {
  'sinkDraw': require('./dist/operators/sink-draw'),
  'srcAudio': {
    node: require('./dist/operators/src-audio/audio-in-node'),
    buffer: require('./dist/operators/src-audio/audio-in-buffer')
  },
  'magnitude': require('./dist/operators/magnitude'),
  'biquad': require('./dist/operators/biquad'),
  'graph': require('./core/graph'),
};
