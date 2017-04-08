import * as audio from 'waves-audio';

const audioContext = audio.audioContext;

class Synth extends audio.TimeEngine {
  constructor(grainPeriod, grainDuration, scheduler) {
    super();

    this.grainPeriod = grainPeriod;
    this.grainDuration = grainDuration;
    this.scheduler = scheduler;

    this.periodRand = 0.004;
  }

  setSearchSpace(kdTree, times) {
    this.kdTree = kdTree;
    this.times = times;
  }

  setModel(model) {
    this.model = model;
  }

  setBuffer(buffer) {
    this.buffer = buffer;
  }

  setStartCallback(callback) {
    this.startCallback = callback;
  }

  setAdvanceCallback(callback) {
    this.advanceCallback = callback;
  }

  setClearCallback(callback) {
    this.clearCallback = callback;
  }

  start() {
    this.index = 0;

    if (!this.model)
      return;

    this.startCallback(this.grainDuration);

    if (this.master)
      this.scheduler.resetEngineTime(this, audioContext.currentTime);
    else
      this.scheduler.add(this);
  }

  advanceTime(time) {
    // get closest grain index from kdTree
    const desc = this.model[this.index].data;
    const target = this.kdTree.nn(desc);
    const timeOffset = this.times[target];

    time = Math.max(time, audioContext.currentTime);

    const env = audioContext.createGain();
    env.connect(audioContext.destination);
    env.gain.value = 0;
    env.gain.setValueAtTime(0, time);
    env.gain.linearRampToValueAtTime(1, time + (this.grainDuration / 2));
    env.gain.linearRampToValueAtTime(0, time + this.grainDuration);

    const source = audioContext.createBufferSource();
    source.connect(env);
    source.buffer = this.buffer;
    source.start(time, timeOffset, this.grainDuration);
    source.stop(time + this.grainDuration);

    this.index += 1;

    if (this.index < this.model.length) {
      this.advanceCallback(this.index * this.grainPeriod, timeOffset);

      const rand = Math.random() * this.periodRand - (this.periodRand / 2);
      return time + this.grainPeriod + rand;
    } else {
      this.clearCallback();
      return undefined; // remove from scheduler
    }
  }
};

export default Synth;
