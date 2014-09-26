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

    });

    describe('#rejects', function () {

      function isErr (error) {
        return error === err;
      }

      function noop () {}

      function ignoreErr () {
        stub.defaultBehavior.returnValue.catch(isErr, noop);
      }

      var err;
      beforeEach(function () {
        err = new Error();
        stub.rejects(err);
      });

      it('sets the returnValue to the promise', function () {
        ignoreErr();
        expect(stub.defaultBehavior.returnValue).to.itself.respondTo('then');
      });

      it('returns the promise when called', function () {
        return expect(stub()).to.be.rejectedWith(err);
      });

      it('can reject with an error message', function () {
        ignoreErr();
        stub.rejects('Rejection');
        return expect(stub()).to.be.rejectedWith('Rejection');
      });

      it('can be chained normally', function () {
        ignoreErr();
        expect(stub).to.itself.respondTo('withArgs');
      });

    });

  });

});
