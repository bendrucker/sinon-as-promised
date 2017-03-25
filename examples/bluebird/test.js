'use strict';

/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var Bluebird = require('bluebird');

require('sinon-as-promised')(Bluebird);

describe('sinon-as-promised with ES6', function () {
  it('can create a stub that resolves', function () {
    var stub = sinon.stub().resolves('value');
    return stub().then(function (value) {
      expect(value).to.equal('value')
    })
  })
});
