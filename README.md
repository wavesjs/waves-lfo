# LFPGraph

> LFPGraph is a tree graph data structure for LFP operators

Although LFPs allow you to chain them up by passing it the previous operator as an argument to its constructor, the LFPGraph gives you more flexibility by allowing you to lay out your LFP chain in a tree-graph structure using its `pipe` method.  
The `pipe` method will take in an LFP operator constructor, its options and an optional instance name that will allow you to retrieve the node later on in case you want to branch out from there to another separate chain.

### Usage

#### Source
The graph must be instantiated with a root node. The root node have to be of a **source type** of LFP.  

```js
// new lfpGraph(constructor, options, instance-id)
var graph = lfpGraph(audioIn, {src: audioNode}, 'audio'); 
```
#### lfpGraph pipe
A tree instance has its own `pipe` method that initializes and appends piped in nodes into the root node that it was initialised with, then returns the appended node for further piping.
_In this case we pipe the raw source straight into the`sink` type draw operator._

```js
graph
	.pipe(draw, {canvas: document.querySelector('canvas'), color: '#cccccc'});
```

####Node pipe
The `pipe` method always returns a *tree-node* type, that has it's own`pipe` method that then can be used to append operators to the last piped LFP.

#### Branching out

##### Getting a node from the existing chain
You can at any point of your processor chain branch out a new chain and continue from there.  To do that you need to get the node you want to branch out from by it's id.
Node id's can be passed in as the third argument to the pipe method. If none is passed the graph will automatically generate new ones based on the type of LFP and an auto incremented number.  

See this example to have a clearer picture:

```js
graph
	.pipe(biquad, {mode: 'low-pass'}) // will get the id biquad-1
	.pipe(biquad, {mode: 'band-pass'})  // will get the id biquad-2
// we can then start another branch from the first biquad like so
graph
	.get('biquad-1') // returns the node
	.pipe(draw, {canvas: document.querySelector('canvas'), color: '#cccccc'});
```

You can of course at any moment branch straight from the root of the tree via the `graph.pipe()` method.

### Status

This library is under heavy development and subject to change.  
Evert new API breaking change we will be adding snapshots to the repository so you can always fetch a working copy.

For an in depth  explanation on the philosophy and usage of this library please refer to [this blog post](http://wave.ircam.fr/publications/low-frequency-processors/).
## License
This module is released under the [BSD-3-Clause license](http://opensource.org/licenses/BSD-3-Clause).
## Acknowledgments
This code is part of the [WAVE project](http://wave.ircam.fr),  
funded by ANR (The French National Research Agency),  
_ContInt_ program,  
2012-2015.