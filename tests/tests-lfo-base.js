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

  describe('#remove', function() {

  });

  describe('#process', function() {

  });

  describe('#destroy', function() {

  });
});
























