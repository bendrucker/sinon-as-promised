'use strict';

var Promise = require('bluebird');
var sinon   = require('sinon');

var scheduler = function (fn) {
  process.nextTick(fn);
};

function schedule (fn) {
  return function (resolve, reject) {
    scheduler(function () {
      fn(resolve, reject);
    });
  };
}

function resolves (value) {
  /*jshint validthis:true */
  return this.returns(new Promise(schedule(function (resolve) {
    resolve(value);
  })));
}

sinon.stub.resolves = resolves;
sinon.behavior.resolves = resolves;


function rejects (err) {
  if (typeof err === 'string') {
    err = new Error(err);
  }
  /*jshint validthis:true */
  return this.returns(new Promise(schedule(function (resolve, reject) {
    reject(err);
  })));
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

module.exports.setScheduler = function (_scheduler_) {
  scheduler = _scheduler_;
};
