'use strict';

var internals = {};

internals.resolves = function (Promise, value) {
  return this.returns(new Promise(function (resolve) {
    resolve(value);
  }));
};

internals.rejects = function (Promise, err) {
  if (typeof err === 'string') {
    err = new Error(err);
  }
  return this.returns(new Promise(function (resolve, reject) {
    reject(err);
  }));
};

module.exports = function (Promise) {
  var sinon = require('sinon');
  if (!Promise) {
    throw new Error('A Promise constructor must be provided');
  }
  sinon.stub.resolves = function (value) {
    return internals.resolves.call(this, Promise, value);
  };
  sinon.stub.rejects = function (err) {
    return internals.rejects.call(this, Promise, err);
  };
};