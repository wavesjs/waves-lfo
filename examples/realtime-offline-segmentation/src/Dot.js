
class Dot {
  constructor() {
    this.size = 40;
    this.numFrameActive = 0;
    this.active = false;

    const $el = document.querySelector('#dot');
    this.ctx = $el.getContext('2d');
    this.ctx.canvas.width = this.size;
    this.ctx.canvas.height = this.size;

    this.render = this.render.bind(this);
  }

  render() {
    requestAnimationFrame(this.render);

    const size = this.size;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, size, size);

    if (this.active)
      this.numFrameActive += 1;

    if (this.numFrameActive > 3) {
      this.numFrameActive = 0;
      this.active = false;
    }

    ctx.save();
    ctx.translate(size / 2, size / 2);

    if (this.active) {
      ctx.beginPath();
      ctx.fillStyle = 'red';
      ctx.arc(0, 0, size / 2 - 3, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
    }

    ctx.beginPath();
    ctx.strokeStyle = '#cdcdcd';
    ctx.lineWidth = 4;
    ctx.arc(0, 0, size / 2 - 3, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }
}

export default Dot;
