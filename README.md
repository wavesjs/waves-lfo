# `lfo` - Low Frequency Operators

`lfo` is an API that aims to formalise the processing and analysis of arbitrary data streams (audio, video, sensor data etc.). By normalizing the stream format in it's input and output ends, a graph allows to manipulate and analyse the data through a processing chain and encapsulate common processing algorithms with a unified interface that can be shared and reused.

## Installation

```sh
$ npm install wavesjs/waves-lfo [--save]
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
