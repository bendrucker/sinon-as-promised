/* global describe: false, it: false, before: false, after: false, beforeEach: false */

'use strict';

var chai            = require('chai');
var expect          = chai.expect;
var sinon           = require('sinon');
var Promise         = require('bluebird');
var sinonAsPromised = require('./');

chai.use(require('chai-as-promised'));


describe('sinon-as-promised', function () {

  Promise.onPossiblyUnhandledRejection(function (err) {
    throw err;
  });

  it('can set a Promise constructor', function () {
    sinonAsPromised(Promise);
  });

  it('requires a Promise constructor if called', function () {
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

      it('can use a custom scheduler', function () {
        var deferreds = [];
        sinonAsPromised.setScheduler(function (fn) {
          deferreds.push(fn);
        });
        stub.resolves('foo');
        expect(deferreds).to.have.length(1);
        deferreds[0]();
        expect(stub().isFulfilled()).to.be.true;
        sinonAsPromised.setScheduler(function (fn) {
          process.nextTick(fn);
        });
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


    describe('#rejects', function () {

      var unhandled;
      var ignored;
      Promise.onPossiblyUnhandledRejection(function (err) {
        unhandled.push(err);
      });
      beforeEach(function () {
        unhandled = [];
        ignored = [];
      });
      afterEach(function () {
        var errors = unhandled.filter(function (err) {
          return ignored.indexOf(err) === -1;
        });
        if (errors.length) {
          throw new Error(errors.length + ' unhandled: ' + errors.join(', '));
        }
      });

      var err;
      beforeEach(function () {
        err = new Error('Default');
        stub.rejects(err);
      });

      function isErr (error) {
        return error === err;
      }

      function noop () {}

      it('sets the returnValue to the promise', function () {
        ignored.push(err);
        expect(stub.defaultBehavior.returnValue).to.itself.respondTo('then');
      });

      it('returns the promise when called', function () {
        return expect(stub()).to.be.rejectedWith(err);
      });

      it('can reject with an error message', function () {
        ignored.push(err);
        stub.rejects('Rejection');
        return expect(stub()).to.be.rejectedWith('Rejection');
      });

      it('can be chained normally', function () {
        ignored.push(err);
        expect(stub).to.itself.respondTo('withArgs');
      });

      describe('#onCall', function () {

        var firstErr;
        beforeEach(function () {
          firstErr = new Error('First');
          stub.onCall(0).rejects(firstErr);
          stub.onCall(1).resolves('foo');
        });

        it('returns the first rejection when called', function () {
          ignored.push(err);
          return expect(stub()).to.be.rejectedWith(firstErr);
        });

        it('can be mixed with resolves', function () {
          ignored.push(firstErr);
          ignored.push(err);
          stub();
          return stub().then(function (value) {
            expect(value).to.equal('foo');
          });
        });

        it('defaults to main rejects', function () {
          ignored.push(firstErr);
          ignored.push(err);
          stub();
          stub();
          return expect(stub()).to.be.rejectedWith(err);
        });

      });

    });

  });

});
