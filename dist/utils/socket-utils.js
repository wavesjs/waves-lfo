"use strict";

// http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
function Uint16Array2str(buf) {
  return String.fromCharCode.apply(null, buf);
}

function str2Uint16Array(str) {
  var buffer = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufferView = new Uint16Array(buffer);

  for (var i = 0, l = str.length; i < l; i++) {
    bufferView[i] = str.charCodeAt(i);
  }
  return bufferView;
}

//http://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer
// converts a nodejs Buffer to ArrayBuffer
module.exports.bufferToArrayBuffer = function (buffer) {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
};

module.exports.arrayBufferToBuffer = function (arrayBuffer) {
  var buffer = new Buffer(arrayBuffer.byteLength);
  var view = new Uint8Array(arrayBuffer);
  for (var i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
};

// @TODO `encodeMessage` and `decodeMessage` could probably use DataView to parse the buffer

// concat the lfo stream, time and metaData into a single buffer
// the concatenation is done as follow :
//  * time          => 8 bytes
//  * frame.length  => 2 bytes
//  * frame         => 4 * frameLength bytes
//  * metaData      => rest of the message
// @return  ArrayBuffer of the created message
// @note    must create a new buffer each time because metaData length is not known
module.exports.encodeMessage = function (time, frame, metaData) {
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
};

// recreate the Lfo stream (time, frame, metaData) form a buffer
// created with `encodeMessage`
module.exports.decodeMessage = function (buffer) {
  // time is a float64Array of size 1 (8 bytes)
  var timeArray = new Float64Array(buffer.slice(0, 8));
  var time = timeArray[0];

  // frame length is encoded in 2 bytes
  var frameLengthArray = new Uint16Array(buffer.slice(8, 10));
  var frameLength = frameLengthArray[0];

  // frame is a float32Array (4 bytes) * frameLength
  var frameByteLength = 4 * frameLength;
  var frame = new Float32Array(buffer.slice(10, 10 + frameByteLength));

  // metaData is the rest of the buffer
  var metaDataArray = new Uint16Array(buffer.slice(10 + frameByteLength));
  // JSON.parse here crashes node because of this character : `\u0000` (null in unicode) ??
  var metaData = Uint16Array2str(metaDataArray);
  metaData = JSON.parse(metaData.replace(/\u0000/g, ""));

  return { time: time, frame: frame, metaData: metaData };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9zb2NrZXQtdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsU0FBUyxlQUFlLENBQUMsR0FBRyxFQUFFO0FBQzVCLFNBQU8sTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0NBQzdDOztBQUVELFNBQVMsZUFBZSxDQUFDLEdBQUcsRUFBRTtBQUM1QixNQUFJLE1BQU0sR0FBRyxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzdDLE1BQUksVUFBVSxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUV6QyxPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzFDLGNBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ25DO0FBQ0QsU0FBTyxVQUFVLENBQUM7Q0FDbkI7Ozs7QUFJRCxNQUFNLENBQUMsT0FBTyxDQUFDLG1CQUFtQixHQUFHLFVBQVMsTUFBTSxFQUFFO0FBQ3BELE1BQUksRUFBRSxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN4QyxNQUFJLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM5QixPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtBQUN0QyxRQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ3JCO0FBQ0QsU0FBTyxFQUFFLENBQUM7Q0FDWCxDQUFBOztBQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMs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QUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQzs7QUFFeEUsTUFBSSxRQUFRLEdBQUcsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzlDLFVBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRXZELFNBQU8sRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDO0NBQ2xDLENBQUEiLCJmaWxlIjoiZXM2L3V0aWxzL3NvY2tldC11dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLy8gaHR0cDovL3VwZGF0ZXMuaHRtbDVyb2Nrcy5jb20vMjAxMi8wNi9Ib3ctdG8tY29udmVydC1BcnJheUJ1ZmZlci10by1hbmQtZnJvbS1TdHJpbmdcbmZ1bmN0aW9uIFVpbnQxNkFycmF5MnN0cihidWYpIHtcbiAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgYnVmKTtcbn1cblxuZnVuY3Rpb24gc3RyMlVpbnQxNkFycmF5KHN0cikge1xuICB2YXIgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKHN0ci5sZW5ndGggKiAyKTsgLy8gMiBieXRlcyBmb3IgZWFjaCBjaGFyXG4gIHZhciBidWZmZXJWaWV3ID0gbmV3IFVpbnQxNkFycmF5KGJ1ZmZlcik7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBzdHIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgYnVmZmVyVmlld1tpXSA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICB9XG4gIHJldHVybiBidWZmZXJWaWV3O1xufVxuXG4vL2h0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvODYwOTI4OS9jb252ZXJ0LWEtYmluYXJ5LW5vZGVqcy1idWZmZXItdG8tamF2YXNjcmlwdC1hcnJheWJ1ZmZlclxuLy8gY29udmVydHMgYSBub2RlanMgQnVmZmVyIHRvIEFycmF5QnVmZmVyXG5tb2R1bGUuZXhwb3J0cy5idWZmZXJUb0FycmF5QnVmZmVyID0gZnVuY3Rpb24oYnVmZmVyKSB7XG4gIHZhciBhYiA9IG5ldyBBcnJheUJ1ZmZlcihidWZmZXIubGVuZ3RoKTtcbiAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShhYik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnVmZmVyLmxlbmd0aDsgKytpKSB7XG4gICAgdmlld1tpXSA9IGJ1ZmZlcltpXTtcbiAgfVxuICByZXR1cm4gYWI7XG59XG5cbm1vZHVsZS5leHBvcnRzLmFycmF5QnVmZmVyVG9CdWZmZXIgPSBmdW5jdGlvbihhcnJheUJ1ZmZlcikge1xuICB2YXIgYnVmZmVyID0gbmV3IEJ1ZmZlcihhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoKTtcbiAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnVmZmVyLmxlbmd0aDsgKytpKSB7XG4gICAgYnVmZmVyW2ldID0gdmlld1tpXTtcbiAgfVxuICByZXR1cm4gYnVmZmVyO1xufVxuXG4vLyBAVE9ETyBgZW5jb2RlTWVzc2FnZWAgYW5kIGBkZWNvZGVNZXNzYWdlYCBjb3VsZCBwcm9iYWJseSB1c2UgRGF0YVZpZXcgdG8gcGFyc2UgdGhlIGJ1ZmZlclxuXG4vLyBjb25jYXQgdGhlIGxmbyBzdHJlYW0sIHRpbWUgYW5kIG1ldGFEYXRhIGludG8gYSBzaW5nbGUgYnVmZmVyXG4vLyB0aGUgY29uY2F0ZW5hdGlvbiBpcyBkb25lIGFzIGZvbGxvdyA6XG4vLyAgKiB0aW1lICAgICAgICAgID0+IDggYnl0ZXNcbi8vICAqIGZyYW1lLmxlbmd0aCAgPT4gMiBieXRlc1xuLy8gICogZnJhbWUgICAgICAgICA9PiA0ICogZnJhbWVMZW5ndGggYnl0ZXNcbi8vICAqIG1ldGFEYXRhICAgICAgPT4gcmVzdCBvZiB0aGUgbWVzc2FnZVxuLy8gQHJldHVybiAgQXJyYXlCdWZmZXIgb2YgdGhlIGNyZWF0ZWQgbWVzc2FnZVxuLy8gQG5vdGUgICAgbXVzdCBjcmVhdGUgYSBuZXcgYnVmZmVyIGVhY2ggdGltZSBiZWNhdXNlIG1ldGFEYXRhIGxlbmd0aCBpcyBub3Qga25vd25cbm1vZHVsZS5leHBvcnRzLmVuY29kZU1lc3NhZ2UgPSBmdW5jdGlvbih0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgIC8vIHNob3VsZCBwcm9iYWJseSB1c2UgdXNlIERhdGFWaWV3IGluc3RlYWRcbiAgLy8gaHR0cDovL3d3dy5odG1sNXJvY2tzLmNvbS9lbi90dXRvcmlhbHMvd2ViZ2wvdHlwZWRfYXJyYXlzL1xuICB2YXIgdGltZTY0ID0gbmV3IEZsb2F0NjRBcnJheSgxKTtcbiAgdGltZTY0WzBdID0gdGltZTtcbiAgdmFyIHRpbWUxNiA9IG5ldyBVaW50MTZBcnJheSh0aW1lNjQuYnVmZmVyKTtcblxuICB2YXIgbGVuZ3RoMTYgPSBuZXcgVWludDE2QXJyYXkoMSk7XG4gIGxlbmd0aDE2WzBdID0gZnJhbWUubGVuZ3RoO1xuXG4gIHZhciBmcmFtZTE2ID0gbmV3IFVpbnQxNkFycmF5KGZyYW1lLmJ1ZmZlcik7XG5cbiAgdmFyIG1ldGFEYXRhMTYgPSBzdHIyVWludDE2QXJyYXkoSlNPTi5zdHJpbmdpZnkobWV0YURhdGEpKTtcblxuICB2YXIgYnVmZmVyTGVuZ3RoID0gdGltZTE2Lmxlbmd0aCArIGxlbmd0aDE2Lmxlbmd0aCArIGZyYW1lMTYubGVuZ3RoICsgbWV0YURhdGExNi5sZW5ndGg7XG5cbiAgdmFyIGJ1ZmZlciA9IG5ldyBVaW50MTZBcnJheShidWZmZXJMZW5ndGgpO1xuXG4gIC8vIGJ1ZmZlciBpcyB0aGUgY29uY2F0ZW5hdGlvbiBvZiB0aW1lLCBmcmFtZUxlbmd0aCwgZnJhbWUsIG1ldGFEYXRhXG4gIGJ1ZmZlci5zZXQodGltZTE2LCAwKTtcbiAgYnVmZmVyLnNldChsZW5ndGgxNiwgdGltZTE2Lmxlbmd0aCk7XG4gIGJ1ZmZlci5zZXQoZnJhbWUxNiwgdGltZTE2Lmxlbmd0aCArIGxlbmd0aDE2Lmxlbmd0aCk7XG4gIGJ1ZmZlci5zZXQobWV0YURhdGExNiwgdGltZTE2Lmxlbmd0aCArIGxlbmd0aDE2Lmxlbmd0aCArIGZyYW1lMTYubGVuZ3RoKTtcblxuICByZXR1cm4gYnVmZmVyLmJ1ZmZlcjtcbn1cblxuLy8gcmVjcmVhdGUgdGhlIExmbyBzdHJlYW0gKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkgZm9ybSBhIGJ1ZmZlclxuLy8gY3JlYXRlZCB3aXRoIGBlbmNvZGVNZXNzYWdlYFxubW9kdWxlLmV4cG9ydHMuZGVjb2RlTWVzc2FnZSA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICAvLyB0aW1lIGlzIGEgZmxvYXQ2NEFycmF5IG9mIHNpemUgMSAoOCBieXRlcylcbiAgdmFyIHRpbWVBcnJheSA9IG5ldyBGbG9hdDY0QXJyYXkoYnVmZmVyLnNsaWNlKDAsIDgpKTtcbiAgdmFyIHRpbWUgPSB0aW1lQXJyYXlbMF07XG5cbiAgLy8gZnJhbWUgbGVuZ3RoIGlzIGVuY29kZWQgaW4gMiBieXRlc1xuICB2YXIgZnJhbWVMZW5ndGhBcnJheSA9IG5ldyBVaW50MTZBcnJheShidWZmZXIuc2xpY2UoOCwgMTApKTtcbiAgdmFyIGZyYW1lTGVuZ3RoID0gZnJhbWVMZW5ndGhBcnJheVswXTtcblxuICAvLyBmcmFtZSBpcyBhIGZsb2F0MzJBcnJheSAoNCBieXRlcykgKiBmcmFtZUxlbmd0aFxuICB2YXIgZnJhbWVCeXRlTGVuZ3RoID0gNCAqIGZyYW1lTGVuZ3RoO1xuICB2YXIgZnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KGJ1ZmZlci5zbGljZSgxMCwgMTAgKyBmcmFtZUJ5dGVMZW5ndGgpKTtcblxuICAvLyBtZXRhRGF0YSBpcyB0aGUgcmVzdCBvZiB0aGUgYnVmZmVyXG4gIHZhciBtZXRhRGF0YUFycmF5ID0gbmV3IFVpbnQxNkFycmF5KGJ1ZmZlci5zbGljZSgxMCArIGZyYW1lQnl0ZUxlbmd0aCkpO1xuICAvLyBKU09OLnBhcnNlIGhlcmUgY3Jhc2hlcyBub2RlIGJlY2F1c2Ugb2YgdGhpcyBjaGFyYWN0ZXIgOiBgXFx1MDAwMGAgKG51bGwgaW4gdW5pY29kZSkgPz9cbiAgdmFyIG1ldGFEYXRhID0gVWludDE2QXJyYXkyc3RyKG1ldGFEYXRhQXJyYXkpO1xuICBtZXRhRGF0YSA9IEpTT04ucGFyc2UobWV0YURhdGEucmVwbGFjZSgvXFx1MDAwMC9nLCAnJykpO1xuXG4gIHJldHVybiB7IHRpbWUsIGZyYW1lLCBtZXRhRGF0YSB9O1xufVxuXG4iXX0=