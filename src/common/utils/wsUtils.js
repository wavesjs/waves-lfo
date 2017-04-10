//http://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer
// converts a nodejs Buffer to ArrayBuffer
// export function bufferToArrayBuffer(buffer) {
//   const ab = new ArrayBuffer(buffer.length);
//   const view = new Uint8Array(ab);

//   for (let i = 0; i < buffer.length; ++i)
//     view[i] = buffer[i];

//   return ab;
// }

// export function arrayBufferToBuffer(arrayBuffer) {
//   const buffer = new Buffer(arrayBuffer.byteLength);
//   const view = new Uint8Array(arrayBuffer);

//   for (let i = 0; i < buffer.length; ++i)
//     buffer[i] = view[i];

//   return buffer;
// }

export const opcodes = {
  INIT_MODULE_REQ: 10,
  INIT_MODULE_ACK: 11,
  PROCESS_STREAM_PARAMS: 12,
  RESET_STREAM: 13,
  FINALIZE_STREAM: 14,
  PROCESS_FRAME: 15
}

// http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
function Uint16Array2json(arr) {
  const str = String.fromCharCode.apply(null, arr);
  return JSON.parse(str.replace(/\u0000/g, ''))
}

function json2Uint16Array(json) {
  const str = JSON.stringify(json);
  const buffer = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  const bufferView = new Uint16Array(buffer);

  for (let i = 0, l = str.length; i < l; i++)
    bufferView[i] = str.charCodeAt(i);

  return bufferView;
}

//
export const encoders = {
  opcode(name) {
    const opcode = opcodes[name];
    const buffer = new Uint16Array(1);
    buffer[0] = opcode;

    return buffer;
  },
  // `opcode`    2 bytes (Uint16) |
  initModuleReq: function() {
    const payload = encoders.opcode('INIT_MODULE_REQ');
    return payload.buffer;
  },
  // `opcode`    2 bytes (Uint16) |
  initModuleAck: function() {
    const payload = encoders.opcode('INIT_MODULE_ACK');
    return payload.buffer;
  },
  // `opcode`    2 bytes (Uint16) |
  // `streamParams`  n bytes (Uint16)
  streamParams: function(streamParams) {
    const opcode = encoders.opcode('PROCESS_STREAM_PARAMS');
    const streamParamsBuffer = json2Uint16Array(streamParams);

    const payload = new Uint16Array(1 + streamParamsBuffer.length);
    payload.set(opcode, 0);
    payload.set(streamParamsBuffer, 1);

    return payload.buffer;
  },
  // `opcode`    2 bytes (Uint16) |
  resetStream: function() {
    const payload = encoders.opcode('RESET_STREAM');
    return payload.buffer;
  },
  // `opcode`    2 bytes (Uint16) |
  // `endTime`   8 bytes (Float64)
  finalizeStream: function(endTime) {
    const opcode = encoders.opcode('RESET_STREAM');

    const endTimeBuffer = new Float64Array(1);
    endTimeBuffer[0] = endTime;

    const payload = new Uint16Array(1 + 4);
    payload.set(opcode, 0);
    payload.set(new Uint16Array(endTimeBuffer.buffer), 1);

    return payload.buffer;
  },
  // `opcode`    2 bytes (Uint16) |
  // `time`      8 bytes (Float64) |
  // `data`      frameSize * 4 (Float32) |
  // `metadata`  n bytes (Uint16)
  processFrame: function(frame, frameSize) {
    const opcode = encoders.opcode('PROCESS_FRAME');

    const time = new Float64Array(1);
    time[0] = frame.time;

    const data = new Float32Array(frameSize);
    for (let i = 0; i < frameSize; i++)
      data[i] = frame.data[i];

    const metadata = json2Uint16Array(frame.metadata);

    const length = 1 + 4 + (2 * frameSize) + metadata.length;
    const payload = new Uint16Array(length);
    payload.set(opcode, 0);
    payload.set(new Uint16Array(time.buffer), 1);
    payload.set(new Uint16Array(data.buffer), 1 + 4);
    payload.set(metadata, 1 + 4 + (2 * frameSize));

    return payload.buffer;
  }
}

export const decoders = {
  opcode(arrayBuffer) {
    return new Uint16Array(arrayBuffer)[0];
  },
  // `opcode`    2 bytes (Uint16) |
  // `streamParams`  n bytes (Uint16)
  streamParams(arrayBuffer) {
    const payload = new Uint16Array(arrayBuffer.slice(2));
    const prevStreamParams = Uint16Array2json(payload);
    return prevStreamParams;
  },
  // `opcode`    2 bytes (Uint16) |
  // `endTime`   8 bytes (Float64)
  finalizeStream(arrayBuffer) {
    return new Float64Array(arrayBuffer.slice(2))[0];
  },
  // `opcode`    2 bytes (Uint16) |
  // `time`      8 bytes (Float64) |
  // `data`      frameSize * 4 (Float32) |
  // `metadata`  n bytes (Uint16)
  processFrame(arrayBuffer, frameSize) {
      // 1 * 8 bytes
      const timeStart = 2;
      const timeEnd = timeStart + 8;
      const time = new Float64Array(arrayBuffer.slice(timeStart, timeEnd))[0];
      // frameSize * 4 bytes
      const dataStart = timeEnd;
      const dataEnd = dataStart + 4 * frameSize;
      const data = new Float32Array(arrayBuffer.slice(dataStart, dataEnd));
      // rest of payload
      const metaStart = dataEnd;
      const metaBuffer = new Uint16Array(arrayBuffer.slice(metaStart));
      const metadata = Uint16Array2json(metaBuffer);

      return { time, data, metadata };
  }
}
