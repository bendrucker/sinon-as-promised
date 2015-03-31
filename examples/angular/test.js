'use strict';

var expect          = require('chai').expect;
var sinon           = require('sinon');
var sinonAsPromised = require('sinon-as-promised');
var angular         = require('angular');

require('angular-mocks');

describe('sinon-as-promised angular example', function () {

  var $timeout;
  beforeEach(angular.mock.inject(function ($rootScope, $q, _$timeout_) {
    sinonAsPromised($q);
    $timeout = _$timeout_;
  }));

  it('can create a stub that resolves', function () {
    var stub = sinon.stub().resolves('value');
    var fulfilled = false;
    stub().then(function (value) {
      fulfilled = true;
      expect(value).to.equal('value');
    });
    expect(fulfilled).to.be.false;
    $timeout.flush();
    expect(fulfilled).to.be.true;
  });

});
