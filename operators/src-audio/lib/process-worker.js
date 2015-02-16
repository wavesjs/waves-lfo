self.addEventListener('message', function(e) { process(e.data); }, false);

function process(message) {

  var that = message.options;
  var hopSize = that.hopSize;
  var frameSize = that.frameSize;
  var sampleRate = that.sampleRate;
  var buffer = message.data;
  var length = buffer.length;

  var currentTime = 0;
  var index = 0;

  // frame broadcast
  while(index <= length){
    var subBuffer = buffer.subarray(index, index+frameSize);
    postMessage({frame: subBuffer, time: currentTime});
    
    index += hopSize;
    currentTime += (hopSize / sampleRate);
  }

}