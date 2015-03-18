'use strict';

// is used to keep several draw in sync
// when a view is installed in a synchronized draw
// the meta view is installed as a member of all it's children
class SynchronizedSink {
  constructor() {
    this.children = [];
  }

  add(...views) {
    views.forEach(view => {
      this.install(view);
    });
  }

  install(view) {
    this.children.push(view);
    view.params.isSynchronized = true;
    view.synchronizer = this;
  }

  shiftSiblings(iShift, view) {
    this.children.forEach((child) => {
      if (child === view) { return; }
      child.shiftCanvas(iShift);
    });
  }
}

module.exports = SynchronizedSink;