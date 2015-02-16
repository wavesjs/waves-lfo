
"use strict";

let AudioIn = require('./audio-in');

// web audio API node as a source
class AudioInNode extends AudioIn {

  constructor(previous = null, options = {}) {
    if (!(this instanceof AudioInNode)) return new AudioInNode(previous, options);
    super(previous, options);
    
    this.type = 'audio-in-node';

    this.__frameRate = this.sampleRate / this.hopSize;
    this.__proc = this.__ctx.createScriptProcessor(this.hopSize, 1, 1);
    // keepalive
    this.__ctx['_process-' + new Date().getTime()] = this.__proc;
  }

  // connect the audio nodes to start streaming
  start() {

    var recBuffer = new Float32Array(this.__buferSize);

    this.__proc.onaudioprocess = (e) => {

      recBuffer.set(e.inputBuffer.getChannelData(this.channel), this.__currentIndex);

      this.__currentIndex += this.blockSize;
     
      // hop broadcast
      while(this.__currentIndex >= this.frameSize){

        // call the generic process method that loops through the operators
        this.emit('frame', this.__currentTime - this.offset, recBuffer.subarray(0, this.frameSize));

        recBuffer.set( recBuffer.subarray(this.hopSize, this.__currentIndex) , 0);
        this.__currentIndex -= this.hopSize;
        this.__currentTime += (this.hopSize / this.sampleRate);
      }

    };

    // start "the patch" ;) 
    this.__src.connect(this.__proc);
    this.__proc.connect(this.__ctx.destination);
  }

}

module.exports = AudioInNode;
