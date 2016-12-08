'use strict'

var test = require('tape')
var sinon = require('sinon')
var Promise = require('native-promise-only')
var Bluebird = require('bluebird')
var sinonAsPromised = require('./')

test(function (t) {
  Bluebird.onPossiblyUnhandledRejection(function (err) {
    t.fail(err)
    process.exit(1)
  })

  t.ok(sinon.stub().resolves()().then() instanceof Promise)

  sinonAsPromised(Bluebird)
  t.ok(sinon.stub().resolves()().then() instanceof Bluebird)

  t.throws(sinonAsPromised, /Promise/, 'requires ctor')
  t.equal(sinonAsPromised(Bluebird), sinon)

  testStub(3, function (t, stub) {
    stub.resolves('foo')
    t.ok('then' in stub.defaultBehavior.returnValue, 'has then method')
    stub().then(function (value) {
      t.equal(value, 'foo', 'resolves')
      stub().call('substr', 0, 1).then(function (char) {
        t.equal(char, 'f', 'has proto methods')
      })
    })
  })

  testStub(2, function (t, stub) {
    stub.onCall(0).resolves('foo')
    stub.onCall(1).resolves('bar')
    stub().then(function (value) {
      t.equal(value, 'foo')
      return stub()
    })
    .then(function (value) {
      t.equal(value, 'bar')
    })
  })

  testStub(1, function (t, stub) {
    var err = new Error()
    stub.rejects(err)
    stub().catch(function (e) {
      t.equal(e, err)
    })
  })

  testStub(3, function (t, stub) {
    var err = new Error()
    stub.onCall(0).rejects(err)
    stub.onCall(1).rejects('msg')
    stub().catch(function (e) {
      t.equal(e, err)
      return stub()
    })
    .catch(function (err) {
      t.ok(err instanceof Error)
      t.equal(err.message, 'msg')
    })
  })

  function testStub (planned, callback) {
    t.test(function (t) {
      t.plan(planned)
      callback(t, sinon.stub())
    })
  }
})

test(function (t) {
  Bluebird.onPossiblyUnhandledRejection(function (err) {
    t.fail(err)
    process.exit(1)
  })

  t.equal(sinon.spy().resolves().promised().then().constructor.name, "Promise")

  sinonAsPromised(Bluebird)
  t.ok(sinon.spy().resolves().promised().then() instanceof Bluebird)

  t.throws(sinonAsPromised, /Promise/, 'requires ctor')
  t.equal(sinonAsPromised(Bluebird), sinon)

  testSpy(3, function (t, spy) {
    var s = spy.resolves('foo')
    t.ok('then' in s.promised(), 'has then method')
    spy.promised().then(function (value) {
      t.equal(value, 'foo', 'resolves')
      spy.promised().call('substr', 0, 1).then(function (char) {
        t.equal(char, 'f', 'has proto methods')
      })
    })
  })

  testSpy(4, function (t, spy) {
    function test(s) {
      return s('hello', 'world')
      .then(function(value){
        t.equal(value, 'foo')
        return 'bar'
      })
    }

    var s = spy.resolves('foo')
    test(s.promised)
    .then(function(value){
      t.equal(value, 'bar')
      t.equal(s.firstCall.args[0], 'hello')
      t.equal(s.firstCall.args[1], 'world')
    })
  })

  testSpy(4, function (t, spy) {
    function test(s) {
      return s('hello', 'world')
      .catch(function(value){
        t.equal(value, 'foo')
        return 'bar'
      })
    }

    var s = spy.rejects('foo')
    test(s.promised)
    .then(function(value){
      t.equal(value, 'bar')
      t.equal(s.firstCall.args[0], 'hello')
      t.equal(s.firstCall.args[1], 'world')
    })
  })

  testSpy(4, function (t, spy) {
    var err = new Error()
    function test(s) {
      return s('hello', 'world')
      .catch(function(e){
        t.equal(e, err)
        return 'bar'
      })
    }

    var s = spy.rejects(err)
    test(s.promised)
    .then(function(value){
      t.equal(value, 'bar')
      t.equal(s.firstCall.args[0], 'hello')
      t.equal(s.firstCall.args[1], 'world')
    })
  })

  function testSpy (planned, callback) {
    t.test(function (t) {
      t.plan(planned)
      callback(t, sinon.spy())
    })
  }
})
