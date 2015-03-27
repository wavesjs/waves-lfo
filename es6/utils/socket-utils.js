
// http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
function Uint16Array2str(buf) {
  return String.fromCharCode.apply(null, buf);
}

function str2Uint16Array(str) {
  var buffer = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufferView = new Uint16Array(buffer);

  for (var i = 0, l = str.length; i < l; i++) {
    bufferView[i] = str.charCodeAt(i);
  }
  return bufferView;
}

// concat the lfo stream, time and metaData into a single buffer
// the concatenation is done as follow :
//  * time          => 8 bytes
//  * frame.length  => 2 bytes
//  * frame         => 4 * frameLength bytes
//  * metaData      => rest of the message
// @return  ArrayBuffer of the created message
// @note    must create a new buffer each time because metaData length is not known
module.exports.encodeMessage = function(time, frame, metaData) {
   // should probably use use DataView instead
  // http://www.html5rocks.com/en/tutorials/webgl/typed_arrays/
  var time64 = new Float64Array(1);
  time64[0] = time;
  var time16 = new Uint16Array(time64.buffer);

  var length16 = new Uint16Array(1);
  length16[0] = frame.length;

  var frame16 = new Uint16Array(frame.buffer);

  var metaData16 = str2Uint16Array(JSON.stringify(metaData));

  var bufferLength = time16.length + length16.length + frame16.length + metaData16.length;
  var buffer = new Uint16Array(bufferLength);

  // buffer is the concatenation of time, frameLength, frame, metaData
  buffer.set(time16, 0);
  buffer.set(length16, time16.length);
  buffer.set(frame16, time16.length + length16.length);
  buffer.set(metaData16, time16.length + length16.length + frame16.length);

  return buffer.buffer;
}

// recreate the Lfo stream (time, frame, metaData) form a buffer
// created with `encodeMessage`
module.exports.decodeMessage = function(message) {

  var buffer = message.data;

  // time is a float64Array of size 1 (8 bytes)
  var timeArray = new Float64Array(buffer.slice(0, 8));
  var time = timeArray[0]

  // frame length is encoded in 2 bytes
  var frameLengthArray = new Uint16Array(buffer.slice(8, 10));
  var frameLength = frameLengthArray[0];

  // frame is a float32Array (4 bytes) * frameLength
  var frameByteLength = (4 * frameLength);
  var frame = new Float32Array(buffer.slice(10, 10 + frameByteLength));

  // metaData is the rest of the buffer
  var metaDataArray = new Uint16Array(buffer.slice(10 + frameByteLength));
  var metaData = JSON.parse(Uint16Array2str(metaDataArray));

  return { time, frame, metaData };
}