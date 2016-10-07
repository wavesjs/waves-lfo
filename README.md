# `lfo` - Low Frequency Operators

`lfo` is an API that aims to formalise the processing and analysis of arbitrary data streams (audio, video, sensor data etc.). By normalizing the stream format in it's input and output ends, a graph allows to manipulate and analyse the data through a processing chain and encapsulate common processing algorithms with a unified interface that can be shared and reused.

## Usage

```sh
$ npm install [--save] wavesjs/waves-lfo
```

```js
import * as lfo from 'waves-lfo';

const eventIn = new lfo.source.EventIn({ frameSize: 3, frameType: 'vector' });
const rms = new lfo.operator.RMS();
const logger = new lfo.sinks.Logger({ data: true });

eventIn.connect(rms);
rms.connect(sink);

eventIn.start();
eventIn.process([2, 1, 3]);
// > [2.16024689947]
```

## Terminology

__Scalar__ - Single value, can be considered as a `vector` as well as a `signal`

__Vector__ - Array of values in different dimensions, each dimension is 
bound to a specific index in each frame

__Signal__ - Array of values in time domain, fragment of a signal

__Data__ - Generic term to designate a `vector` a `signal` or a `scalar`

__Frame__ - Object associating a time tag, data, and optionnal metadatas.

__Stream__ - Succession of frames, the state of the stream is defined in the `streamParams` attribute in each node by the following values:
- `frameSize`: number of values in the frame at the output of the node
- `frameRate`: number of frame per seconds at the output of the node (if `0`, no frame rate)
- `frameType`: define if the output of the node should be considered as a `signal`, a `vector` or a `scalar`
- `sourceSampleRate`: number of frame per seconds as defined by the source of the graph
- `description`: array describing the output dimensions when `frameType` is `vector` (or `scalar`)

## Structure of a graph

Nodes of a `lfo` graph are divided in 3 categories:

- **`sources`** are responsible for acquering signals and their properties (frameRate, frameSize, etc.)
- **`sinks`** are endpoints of the graph. Such nodes can be recorders, visualizers, etc.
- **`operators`** make computation on the input stream and forward results to the next(s) operator(s).

A graph should then contain at least a `source` node, a `sink` and one or several `operator` nodes in between:


![](https://dl.dropboxusercontent.com/u/606131/lfo.png)


## Implementation of a new `lfo` operator

```js
// @todo - update
class Multiplier extends BaseLfo {
  constructor(options) {
    // define the default value for the `factor` parameter, and allow to 
    // override with the given `options`
    super({ factor: 1 }, options);

    // create a `float` parameter for the `factor` parameter, as a `static`
    // parameter the value of the parameter can be changed without 
    // reinitializing the node and its children
    this.addFloatParam('factor', -Infinity, +Infinity, 'static');
  }

  process(time, frame, metadata) {
    const frameSize = this.streamParams.frameSize;
    const factor = this.getParam('factor');

    // copy input value in `outFrame` and perform operations
    for (let i = 0; i < frameSize; i++)
      this.outFrame[i] = frame[i];

    // forward time and metadata to the children nodes
    this.time = time;
    this.metadata = metadata;

    this.output();
  }
}

const multiplier = new Multiplier({ factor: 4 });
```

