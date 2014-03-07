/* global describe: false, it: false, before: false, after: false, beforeEach: false */

'use strict';

require('mocha-as-promised')();

var chai   = require('chai');
var expect = chai.expect;

chai.use(require('chai-as-promised'));

var sinon   = require('sinon');
var Promise = require('bluebird');

var sinonAsPromised = require('./sinon-as-promised');

describe('sinon-as-promised', function () {

  var throwUnhandled = function (handler) {
    handler = handler || function (err) {
      throw err;
    };
    Promise.onPossiblyUnhandledRejection(handler);
  };

  before(function () {
    throwUnhandled();
  });

  before(function () {
    sinonAsPromised(sinon, Promise);
  });

  it('requires a Promise constructor', function () {
    expect(sinonAsPromised.bind(null, sinon)).to.throw(/Promise/);
  });

  it('references the Promise constructor on sinon', function () {
    expect(sinon).to.have.property('__Promise', Promise);
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

    });

    describe('#rejects', function () {

      var err;
      beforeEach(function () {
        err = new Error();
        stub.rejects(err);
      });

      before(function () {
        // if the unhandled err is the one we rejected with, we can ignore it
        // otherwise we'd have to handle errors inside each expectation
        throwUnhandled(function (error) {
          if (error !== err) throw error;
        });
      });

      after(function () {
        throwUnhandled();
      });

      it('sets the returnValue to the promise', function () {
        expect(stub.defaultBehavior.returnValue).to.itself.respondTo('then');
      });

      it('returns the promise when called', function () {
        return expect(stub()).to.be.rejectedWith(err);
      });

      it('can reject with an error message', function () {
        stub.rejects('Rejection');
        return expect(stub()).to.be.rejectedWith('Rejection');
      });

      it('can be chained normally', function () {
        expect(stub).to.itself.respondTo('withArgs');
      });

    });

  });

});