import * as lfo from 'waves-lfo/client';

function json2Uint16Array(json) {
  const str = JSON.stringify(json);
  const buffer = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  const bufferView = new Uint16Array(buffer);

  for (let i = 0, l = str.length; i < l; i++)
    bufferView[i] = str.charCodeAt(i);

  return bufferView;
}

function createSocket() {
  // const url = window.location.origin.replace('http', 'ws');
  const url = 'ws://127.0.0.1:8000';
  const socket = new WebSocket(url);
  socket.binaryType = 'arraybuffer';

  socket.addEventListener('open', () => {
    // const data = new Float32Array([Math.random(), Math.random(), Math.random()]);
    // socket.send(data.buffer);

    // console.log('sent:', data);

    { // processStreamParams
      const streamParams = { frameSize: 4, frameType: 'vector', frameRate: 1000, sourceSampleCount: null };
      const streamParamsArray = json2Uint16Array(streamParams);

      const ab = new ArrayBuffer(2 + streamParamsArray.length * 2);
      const opcode = new Uint16Array(ab, 0, 1);
      opcode[0] = 0;

      const payload = new Uint16Array(ab, 2, streamParamsArray.length);
      payload.set(streamParamsArray);

      socket.send(ab);
    }

    { // resetStream();
      const opcode = new Uint16Array(1);
      opcode[0] = 1;

      const data = new Uint16Array(1);
      data.set(opcode, 0);

      socket.send(data);
    }

    { // resetStream();
      const opcode = new Uint16Array(1);
      opcode[0] = 2;

      const endTime = new Float64Array(1);
      endTime[0] = Math.PI;

      const data = new Uint16Array(1 + 4);
      data.set(opcode, 0);
      data.set(new Uint16Array(endTime.buffer), 1);

      console.log(data);
      socket.send(data);
    }
  });

  socket.addEventListener('message', (e) => {
    console.log('received:', new Float32Array(e.data));
  });

  socket.addEventListener('error', () => {});
  socket.addEventListener('close', () => {});

  return socket;
}

function init() {
  const socket = createSocket();
  console.log(socket);
}

window.addEventListener('load', init);
