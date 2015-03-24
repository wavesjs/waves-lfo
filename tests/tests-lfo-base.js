var assert = require('assert');
var lfo = require('../es6/core/lfo-base');

describe('Lfo-base', function() {
  describe('#constructor', function() {
    it('should create an instance porperly', function(done) {
      var instance = lfo();
      assert.equal(instance instanceof lfo.Lfo, true);
      done();
    });

    it('should override `defaults` with `options`', function(done) {
      var defaults = { a: 1, b: 2 };
      var options = { a: 2, b: 2 };
      var instance = lfo(null, options, defaults);
      assert.equal(instance.params.a, 2);
      assert.equal(instance.params.b, 2);
      done();
    });

    it('should inherit parent\'s streamParams', function(done) {
      var parent = lfo();
      parent.streamParams.frameRate = 20;
      parent.streamParams.frameSize = 20;
      var child = lfo(parent);

      assert.equal(child.streamParams.frameRate, 20);
      assert.equal(child.streamParams.frameSize, 20);
      done();
    });

    it('should register it\'s process method to be called on parent\'s `frame` event', function(done) {
      var parent = lfo();
      var child = lfo(parent);
      child.process = function() {
        assert.equal(true, true);
        done();
      }
      parent.emit('frame');
    });
  });

  describe('#setupStream', function() {
    it('should override `this.streamParams` with options', function(done) {
      var instance = lfo();
      instance.setupStream({ frameRate: 20, frameSize: 20 });

      assert.equal(instance.streamParams.frameRate, 20);
      assert.equal(instance.streamParams.frameSize, 20);
      done();
    });

    it('should create it\'s out frame based on it\'s frameSize param', function(done) {
      var instance = lfo();
      instance.setupStream({ frameSize: 20 });

      assert.equal(instance.streamParams.frameSize, 20);
      assert.equal(instance.outFrame.length, 20);
      assert.equal(instance.outFrame instanceof Float32Array, true);
      done();
    });
  });

  describe('#add', function() {

  });

  describe('#output', function() {

  });

  describe('#process', function() {

  });

  describe('#reset', function() {
    // class DestroyLogger extends lfo.noop {
    //   destroy() {
    //     super();
    //     console.log('destroy', this.params.id);
    //   }

    //   reset() {
    //     super();
    //     console.log('reset', this.params.id, this.outFrame);
    //   }
    // }

    // var source = new lfo.sourceEventIn({
    //   frameSize: 3
    // });

    // var child1 = new DestroyLogger(source, { id: 'child1' });
    // var child11 = new DestroyLogger(child1, { id: 'child11' });
    // var child111 = new DestroyLogger(child11, { id: 'child111' });

    // source.start();
    // source.process(null, [1, 2, 3]);
    // => should be equal to [1, 2, 3]
    // console.log(child111.outFrame);

    // // test reset
    // source.reset();
    // outFrame of all children should be [0, 0, 0]
  });

  describe('#destroy', function() {
    it('should destroy its children recursivly', function(done) {
      // class DestroyLogger extends lfo.noop {
      //   destroy() {
      //     super();
      //     console.log(this.params.id, 'destroyed');
      //   }
      // }

      // var source = new lfo.sourceEventIn({
      //   frameSize: 3
      // });

      // var child1 = new DestroyLogger(source, { id: 'child1' });
      // var child11 = new DestroyLogger(child1, { id: 'child11' });
      // var child111 = new DestroyLogger(child11, { id: 'child111' });


      // var child2 = new DestroyLogger(source, { id: 'child2' });
      // var child21 = new DestroyLogger(child2, { id: 'child21' });
      // var child22 = new DestroyLogger(child2, { id: 'child22' });

      // child1.destroy();

      // // should throw an error
      // var noop = new lfo.noop(child1);
    });

    it('should destroy all its children', function(done) {

    });

    it('should set `streamParams` to `null` to all dead nodes', function(done) {

    });
  });
});
























