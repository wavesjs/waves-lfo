//http://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer
// converts a nodejs Buffer to ArrayBuffer
export function bufferToArrayBuffer(buffer) {
  const ab = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(ab);

  for (let i = 0; i < buffer.length; ++i)
    view[i] = buffer[i];

  return ab;
}

export function arrayBufferToBuffer(arrayBuffer) {
  const buffer = new Buffer(arrayBuffer.byteLength);
  const view = new Uint8Array(arrayBuffer);

  for (let i = 0; i < buffer.length; ++i)
    buffer[i] = view[i];

  return buffer;
}

// http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
export function Uint16Array2json(arr) {
  const str = String.fromCharCode.apply(null, arr);
  return JSON.parse(str.replace(/\u0000/g, ''))
}

export function json2Uint16Array(str) {
  const buffer = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  const bufferView = new Uint16Array(buffer);

  for (let i = 0, l = str.length; i < l; i++)
    bufferView[i] = str.charCodeAt(i);

  return bufferView;
}
