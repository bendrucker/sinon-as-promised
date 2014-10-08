/* global describe: false, it: false, before: false, after: false, beforeEach: false */

'use strict';

var chai   = require('chai');
var expect = chai.expect;

chai.use(require('chai-as-promised'));

var sinon   = require('sinon');
var Promise = require('bluebird');

var sinonAsPromised = require('./sinon-as-promised');

describe('sinon-as-promised', function () {

  Promise.onPossiblyUnhandledRejection(function (err) {
    throw err;
  });

  before(function () {
    sinonAsPromised(Promise);
  });

  it('requires a Promise constructor', function () {
    expect(sinonAsPromised).to.throw(/Promise/);
  });

  it('returns sinon for convenience', function () {
    expect(sinonAsPromised(Promise)).to.equal(sinon);
  });

  describe('stub', function () {

    var stub;
    beforeEach(function () {
      stub = sinon.stub();
    });

    describe('#resolves', function () {

      beforeEach(function () {
        stub.resolves('foo');
      });

      it('sets the returnValue to the promise', function () {
        expect(stub.defaultBehavior.returnValue).to.itself.respondTo('then');
      });

      it('returns the promise when called', function () {
        return stub().then(function (value) {
          expect(value).to.equal('foo');
        });
      });

      it('can be chained normally', function () {
        expect(stub).to.itself.respondTo('withArgs');
      });

      describe('#onCall', function () {

        beforeEach(function () {
          stub.onCall(0).resolves('bar');
          stub.onCall(1).resolves('baz');
        });

        it('returns the different promises when called several times', function () {
          return stub().then(function (first) {
            expect(first).to.equal('bar');
            return stub();
          })
          .then(function (second) {
            expect(second).to.equal('baz');
          });
        });

        it('defaults to main resolves', function () {
          stub(); // bar
          stub(); // baz
          return stub().then(function (value) {
            expect(value).to.equal('foo');
          });
        });

      });

    });

    function isErr (error) {
      return error === stub._errorToBeIgnored;
    }

    function noop () {}

    function setupErrorIgnoranceOnBehavior (behavior) {
      if (behavior === null)
        return;
      behavior.returnValue.catch(isErr, noop);
    }

    function setupErrorIgnoranceOnAllBehaviors () {
      // ignore errors on all behaviors of the stub
      setupErrorIgnoranceOnBehavior(stub.defaultBehavior);
      for (var i = 0; i < stub.behaviors.length; ++i) {
        setupErrorIgnoranceOnBehavior(stub.behaviors[i]);
      }
    }

    function ignoreErr (errorToBeIgnored) {
      setupErrorIgnoranceOnAllBehaviors();
      stub._errorToBeIgnored = errorToBeIgnored;
    }

    describe('#rejects', function () {

      var err;
      beforeEach(function () {
        err = new Error();
        stub.rejects(err);
      });

      it('sets the returnValue to the promise', function () {
        ignoreErr(err);
        expect(stub.defaultBehavior.returnValue).to.itself.respondTo('then');
      });

      it('returns the promise when called', function () {
        return expect(stub()).to.be.rejectedWith(err);
      });

      it('can reject with an error message', function () {
        ignoreErr(err);
        stub.rejects('Rejection');
        return expect(stub()).to.be.rejectedWith('Rejection');
      });

      it('can be chained normally', function () {
        ignoreErr(err);
        expect(stub).to.itself.respondTo('withArgs');
      });

    });

    describe('#onCall(...).rejects', function () {

      var firstErr;
      beforeEach(function () {
        firstErr = new Error();
        stub.onCall(0).rejects(firstErr);
        stub.onCall(1).resolves('bunny');
      });

      it('returns the first rejection when called', function () {
        return expect(stub()).to.be.rejectedWith(firstErr);
      });

      it('can be mixed with resolves', function () {
        ignoreErr(firstErr);
        stub();
        return stub().then(function (value) {
          expect(value).to.equal('bunny');
        });
      });

      it('defaults to main rejects', function () {
        ignoreErr(firstErr);
        var defaultErr = new Error('default')
        stub.rejects(defaultErr);

        stub();
        stub();

        return expect(stub()).to.be.rejectedWith(defaultErr);
      });

    });

  });

});
