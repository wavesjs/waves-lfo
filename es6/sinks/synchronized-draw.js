/**
 * is used to keep several draw in sync
 * when a view is installed in a synchronized draw
 * the meta view is installed as a member of all it's children
 */
export default class SynchronizedDraw {
  constructor(...views) {
    this.views = [];
    this.add.apply(this, views);
  }

  add(...views) {
    views.forEach(view => { this.install(view); });
  }

  install(view) {
    this.views.push(view);
    view.params.isSynchronized = true;
    view.synchronizer = this;
  }

  shiftSiblings(iShift, view) {
    this.views.forEach((child) => {
      if (child === view) { return; }
      child.shiftCanvas(iShift);
    });
  }
}
