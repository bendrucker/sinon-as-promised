'use strict'

/* global describe, it */

var expect = require('chai').expect
var sinon = require('sinon')

require('sinon-as-promised')

describe('sinon-as-promised node example', function () {
  it('can create a stub that resolves', function () {
    var stub = sinon.stub().resolves('value')
    return stub().then(function (value) {
      expect(value).to.equal('value')
    })
  })
})
