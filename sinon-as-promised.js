'use strict';

var Promise = require('bluebird');
var sinon   = require('sinon');

function resolves (value) {
  /*jshint validthis:true */
  return this.returns(new Promise(function (resolve) {
    process.nextTick(resolve.bind(null, value));
  }));
}

sinon.stub.resolves = resolves;
sinon.behavior.resolves = resolves;


function rejects (err) {
  if (typeof err === 'string') {
    err = new Error(err);
  }
  /*jshint validthis:true */
  return this.returns(new Promise(function (resolve, reject) {
    process.nextTick(reject.bind(null, err));
  }));
}

sinon.stub.rejects = rejects;
sinon.behavior.rejects = rejects;

module.exports = function (_Promise_) {
  if (typeof _Promise_ !== 'function') {
    throw new Error('A Promise constructor must be provided');
  }
  else {
    Promise = _Promise_;
  }
  return sinon;
};
