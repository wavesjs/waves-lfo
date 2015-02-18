self.addEventListener('message', function(e) { process(e.data); }, false);

function process(message) {

  var that = message.options;
  var hopSize = that.hopSize;
  var frameSize = that.frameSize;
  var blockSize = that.blockSize;
  var sampleRate = that.sampleRate;
  var buffer = message.data;
  var length = buffer.length;

  var block = new Float32Array(blockSize);

  for (var index = 0; index < length; index += blockSize) {
    var copySize = length - index;

    if(copySize > blockSize)
      copySize = blockSize;

    var bufferSegment = buffer.subarray(index, index + copySize);

    block.set(bufferSegment, 0);

    for(var i = copySize; i < blockSize; i++)
      block[i] = 0;

    postMessage({block: block, time: index / sampleRate});
  }
}