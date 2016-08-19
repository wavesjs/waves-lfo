# LFO - Low Frequency Operators

LFO is an API that aims to formalise the processing and analysis of arbitrary data streams (audio, video, sensor data etc.). By normalising the stream format in it's input and output ends we will be able to manipulate and analyse the data through a processing chain and encapsulate common processing algorithms with a unified interface that can be shared and reused.

The nodes are divided in 3 categories:

- **`sources`** are responsible for acquering a signal and its properties (frameRate, frameSize, etc.)
- **`sinks`** are endpoints of the graph, such nodes can be recorders, visualizers, etc.
- **`operators`** are use to make computation on the input signal and forward the results below in the graph.


![](https://dl.dropboxusercontent.com/u/606131/lfo.png)
