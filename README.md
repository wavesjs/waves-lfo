# `lfo` - Low Frequency Operators

`lfo` is an API that aims to formalise the processing and analysis of arbitrary data streams (audio, video, sensor data etc.). By normalizing the stream format in it's input and output ends, a graph allows to manipulate and analyse the data through a processing chain and encapsulate common processing algorithms with a unified interface that can be shared and reused.

## Usage

```sh
$ npm install wavesjs/waves-lfo [--save]
```

```js
// @todo - create a working example that does something
import * as lfo from 'waves-lfo';

const source = new lfo.source.EventIn({ frameSize: 1 });
const max = new lfo.operator.Max({ order: 5 });
const logger = new lfo.sinks.Logger({ streamParams: false, metadata: false });

source.connect(max);
max.connect(sink);

source.start();
source.process(null, [0, 1]);

```

## Structure of a graph

Nodes of a `lfo` graph are divided in 3 categories:

- **`sources`** are responsible for acquering a signal and its properties (frameRate, frameSize, etc.)
- **`sinks`** are endpoints of the graph, such nodes can be recorders, visualizers, etc.
- **`operators`** are use to make computation on the input signal and forward the results below in the graph.

A graph should then contain at least a `source` node, a `sink` and one or several `operator` nodes in between:


![](https://dl.dropboxusercontent.com/u/606131/lfo.png)


## Definitions

__Vector__ - Array of values of different dimensionnalities, each dimension is 
bound to an specific index in each frame

__Block__ - Array of values in time domain, fragment of a signal

__Frame__ - generic term to designate a `vector` or a `block`

__Stream__ - flux a frames, the state of the stream is defined in the `streamParams` attribute in each node by the following values:
- `frameSize`: number of values in the frame at the output of the node
- `framRate`: number of frame per seconds at the output of the node
- `sourceSampleRate`: number of frame per seconds as defined by the source of the graph
- `type`: define if the output of the node should be considered as a `block` or
a `vector`


## Exemple implementation of a new `lfo` operator

```js
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

