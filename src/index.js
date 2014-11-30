'use strict';

var Promise = require('bluebird');
var sinon   = require('sinon');

function thenable (promiseFactory) {
  return Object.keys(Promise.prototype)
    .filter(function (method) {
      return Promise.prototype.hasOwnProperty(method) && method !== 'then';
    })
    .reduce(function (acc, method) {
      acc[method] = function () {
        var args = arguments;
        var promise = this.then();
        return promise[method].apply(promise, args);
      };
      return acc;
    }, 
    {
      then: function (resolve, reject) {
        return promiseFactory().then(resolve, reject);
      }
    });
}

function resolves (value) {
  /*jshint validthis:true */
  return this.returns(thenable(function () {
    return new Promise(function (resolve) {
      resolve(value);
    });
  }));
}

sinon.stub.resolves = resolves;
sinon.behavior.resolves = resolves;


function rejects (err) {
  if (typeof err === 'string') {
    err = new Error(err);
  }
  /*jshint validthis:true */
  return this.returns(thenable(function () {
    return new Promise(function (resolve, reject) {
      reject(err);
    });
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
