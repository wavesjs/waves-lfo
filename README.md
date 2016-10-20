# `lfo` - Low Frequency Operators

> `lfo` is an library that formalize the processing and analysis of abitrary 
> data streams (audio signal, sensors, etc.) by creating graphs with input 
> (`source`), output(s) (`sink`) and processing units (`operator`).
> 
> The library expose two different flavor (`waves-lfo/client` and 
> `waves-lfo/node`) allowing it to be consumed both client side or in a node
> application. While the processing nodes are shared between this two entry 
> points, the `source` and `sink` nodes are specific to the environment.

Nodes of a `lfo` graph are divided in 3 categories:

- **`sources`** are responsible for acquering signals and their properties (frameRate, frameSize, etc.)
- **`sinks`** are endpoints of the graph. Such nodes can be recorders, visualizers, etc.
- **`operators`** make computation on the input stream and forward results to the next(s) operator(s).

A graph should then contain at least a `source` node, a `sink` and one or several `operator` nodes in between:


![](https://dl.dropboxusercontent.com/u/606131/lfo.png)

## Documentation

[http://wavesjs.github.io/waves-lfo](http://wavesjs.github.io/waves-lfo)

## Usage

### Install

```sh
$ npm install [--save] wavesjs/waves-lfo
```

### Import the library

```js
// in browser
import * as lfo from 'waves-lfo/client';

// in node
import * as lfo from 'waves-lfo/node';
```

### Create a graph

```js
import * as lfo from 'waves-lfo/client';

const eventIn = new lfo.source.EventIn({ 
  frameType: 'vector' 
  frameSize: 3, 
  frameRate: 0,
});

const rms = new lfo.operator.RMS();
const logger = new lfo.sinks.Logger({ data: true });

eventIn.connect(rms);
rms.connect(logger);

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

## Available nodes and examples

## Implementation of an `lfo` operator


```js
// define class parameters
const parameters = {
  factor: {
    type: 'integer',
    default: 1,
  },
};

class Multiplier extends BaseLfo {
  constructor(options) {
    // set the parameters and options of the node
    super(parameters, options);
  }

  // implementing this method allow the node to handle incomming `vector` frames
  processVector(frame) {
    const frameSize = this.streamParams.frameSize;
    const factor = this.getParam('factor');

    // transfert data from `frame` (output of previous node)
    // and current node data, the data from the incomming frame
    // should never be changed
    for (let i = 0; i < frameSize; i++)
      this.frame.data[i] = frame.data[i] * factor;
  }
}

const multiplier = new Multiplier({ factor: 4 });
```

<hr />
## License

This module is released under the BSD-3-Clause license.

<!--
Acknowledgments

This code has been developed in the framework of the WAVE and CoSiMa research projects, funded by the French National Research Agency (ANR).
-->
