var assert = require('assert');

var EventIn = require('../es6/sources/event-in');

var ctx = new AudioContext();

describe('EventIn', function() {
  describe('#constructor', function() {
    it('should create it\'s own audioContext if none given', function(done) {
      var lfo = new EventIn();

      assert.equal(lfo.params.audioContext instanceof AudioContext, true);
      done();
    });

    it('should use a given audioContext if passed in options', function(done) {
      var lfo = new EventIn({
        audioContext: ctx
      });

      assert.deepEqual(lfo.params.audioContext, ctx);
      done();
    });

    it('should default to frameSize of 1', function(done) {
      var lfo = new EventIn({ audioContext: ctx });
      assert.equal(lfo.outFrame.length, 1);
      done();
    });

    it('frameSize should be configurable', function(done) {
      var lfo = new EventIn({
        audioContext: ctx,
        frameSize: 4
      });
      assert.equal(lfo.outFrame.length, 4);
      done();
    });
  });

  describe('#start', function() {
    it('should set isStarted to true', function(done) {
      var lfo = new EventIn({ audioContext: ctx });
      lfo.start();
      assert.equal(lfo.isStarted, true);
      done();
    });

    it('should reset start time', function(done) {
      var lfo = new EventIn({ audioContext: ctx });
      lfo.start();
      assert.equal(lfo.startTime, undefined);
      done();
    });
  });

  describe('#stop', function() {
    it('should call finalize()', function(done) {
      var lfo = new EventIn({ audioContext: ctx });
      lfo.finalize = function() { assert.equal(true, true); done(); }
      lfo.stop();
      done();
    });

    it('should reset startTime and isStarted', function(done) {
      var lfo = new EventIn({ audioContext: ctx });
      lfo.start();
      lfo.stop();

      assert.equal(lfo.startTime, undefined);
      assert.equal(lfo.isStarted, false);
      done();
    })
  });

  describe('#process', function() {
    it('should return if not started', function(done) {
      var lfo = new EventIn({ audioContext: ctx });
      lfo.output = function() { assert.fail(); done(); }
      lfo.process();
      assert.ok(true);
      done();
    });

    it('should set startTime the first time it is called', function(done) {
      var lfo = new EventIn({ audioContext: ctx });
      lfo.start();
      lfo.process(2, [1]);
      var startTime = lfo.startTime;
      assert.notEqual(startTime, undefined);
      lfo.process(3, [1.1]);
      assert.equal(lfo.startTime, startTime);
      done();
    });

    it('should use passed in time if provided - absolute', function(done) {
      var lfo = new EventIn({ audioContext: ctx });
      lfo.output = function(time) {
        assert.equal(time, 2);
        done();
      }

      lfo.start();
      lfo.process(2, [1]);
    });

    it('should use passed in time if provided - relative', function(done) {
      var lfo = new EventIn({ audioContext: ctx, timeType: 'relative' });
      var startTime;

      lfo.output = function(time) {
        assert.equal(time, 2 - lfo.startTime);
        done();
      }

      lfo.start();
      lfo.process(2, [1]);
    });

    it('should use fallback to audioContext.currentTime - absolute', function(done) {
      var lfo = new EventIn({ audioContext: ctx });

      lfo.output = function(time) {
        assert.notEqual(time, undefined);
        done();
      }

      lfo.start();
      lfo.process(2, [1]);
    });

    it('should forward input data', function(done) {
      var lfo = new EventIn({ audioContext: ctx });
      lfo.start();
      lfo.process(false, [1]);
      assert.equal(lfo.outFrame[0], 1);
      done();
    });

    it('should be able to handle scalar value', function(done) {
      var lfo = new EventIn({ audioContext: ctx });
      lfo.start();
      lfo.process(false, 0);
      assert.deepEqual(lfo.outFrame[0], 0);
      done();
    });
  });
});























