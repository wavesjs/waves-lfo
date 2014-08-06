### Usage

#### Source
The graph must be instantiated with a root node.  
The root node have to be of a **source type** of LFP.  

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