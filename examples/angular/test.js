'use strict';

var expect          = require('chai').expect;
var sinon           = require('sinon');
var sinonAsPromised = require('sinon-as-promised');
var angular         = require('angular');

describe('sinon-as-promised node example', function () {

  var $timeout;
  beforeEach(angular.mock.inject(function ($rootScope, $q, _$timeout_) {
    sinonAsPromised($q);
    sinonAsPromised.setScheduler(function (fn) {
      $rootScope.$evalAsync(fn);
    });
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