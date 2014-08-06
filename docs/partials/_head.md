# LFPGraph

> {%= description %}

Although LFPs allow you to chain them up by passing it the previous operator as an argument to its constructor, the LFPGraph gives you more flexibility by allowing you to lay out your LFP chain in a tree-graph structure using its `pipe` method.  
The `pipe` method will take in an LFP operator constructor, its options and an optional instance name that will allow you to retrieve the node later on in case you want to branch out from there to another separate chain.