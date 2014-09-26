'use strict';

var sinon = require('sinon');

module.exports = function (Promise) {

  if (!Promise) {
    throw new Error('A Promise constructor must be provided');
  }

  sinon.stub.resolves = function (value) {
    return this.returns(new Promise(function (resolve) {
      process.nextTick(resolve.bind(null, value));
    }));
  };

  sinon.stub.rejects = function (err) {
    if (typeof err === 'string') {
      err = new Error(err);
    }
    return this.returns(new Promise(function (resolve, reject) {
      process.nextTick(reject.bind(null, err));
    }));
  };

  return sinon;

};
