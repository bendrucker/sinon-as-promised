sinon-as-promised [![Build Status](https://travis-ci.org/bendrucker/sinon-as-promised.svg?branch=master)](https://travis-ci.org/bendrucker/sinon-as-promised)
=================

> Extend [Sinon](https://github.com/cjohansen/sinon.js) stubs with promise stubbing methods.

*Sinon 2 added `resolves` and `rejects` methods and no longer requires this library.*

## Installing
```sh
npm install sinon-as-promised
```

If you're using sinon-as-promised in the browser and are not using Browserify/Webpack, use [3.x](https://github.com/bendrucker/sinon-as-promised/tree/v3.0.1) or earlier.

## Usage

#### Stub

```js
var sinon  = require('sinon')
require('sinon-as-promised')

sinon.stub().resolves('foo')().then(function (value) {
  assert.equal(value, 'foo')
})
```

#### Spy

```js
var sinon  = require('sinon')
require('sinon-as-promised')

var spy = sinon.spy().resolves('foo')

spy.promised('hello', 'world').then(function (value) {
  assert.equal(value, 'foo')
})

assert(spy.firstCall.args[0], 'hello')
assert(spy.firstCall.args[1], 'world')
```

#### Using Bluebird

You'll only need to require sinon-as-promised once. It attaches the appropriate stubbing functions which will then be available anywhere else you require sinon. It defaults to using native ES6 Promise [(or provides a polyfill)](https://github.com/getify/native-promise-only), but you can use another promise library if you'd like, as long as it exposes a constructor:

```js
// Using Bluebird
var Bluebird = require('bluebird')
require('sinon-as-promised')(Bluebird)
```

## API

### Stub

#### `stub.resolves(value)` -> `stub`


##### value

*Required*  
Type: `any`

When called, the stub will return a "thenable" object which will return a promise for the provided `value`. Any [Promises/A+](https://promisesaplus.com/) compliant library will handle this object properly.

```js
var stub = sinon.stub();
stub.resolves('foo');

stub().then(function (value) {
    // value === 'foo'
});

stub.onCall(0).resolves('bar')
stub().then(function (value) {
    // value === 'bar'
});
```
---

#### `stub.rejects(err)` -> `stub`

##### err

*Required*  
Type: `error` / `string`

When called, the stub will return a thenable which will return a reject promise with the provided `err`. If `err` is a string, it will be set as the message on an `Error` object.

```js
stub.rejects(new Error('foo'))().catch(function (error) {
    // error.message === 'foo'
});
stub.rejects('foo')().catch(function (error) {
    // error.message === 'foo'
});

stub.onCall(0).rejects('bar');
stub().catch(function (error) {
    // error.message === 'bar'
});
```

### Spy

#### `spy.resolves(value)` -> `spy` with `promised` function


##### value

*Required*  
Type: `any`

When called, the spy will return a "thenable" object which will return a promise for the provided `value`. Any [Promises/A+](https://promisesaplus.com/) compliant library will handle this object properly.

Unlike stub, spy returns the `Promise` function by the `promised` variable, because the `spy` object should be used to do the spy work(checking calls).   

```js
var spy = sinon.spy().resolves('foo');

function test(spy) {
    return spy('hello')
    .then(function(value) {
        // value === 'foo'
        return value    
    })
}

test(spy)
.then(function(value) {
    // value === 'foo'
    assert(spy.firstCall.args[0], 'hello')
})
```
---

#### `spy.rejects(err)` -> `spy` with `promised` function

##### err

*Required*  
Type: `error` / `string`

When called, the stub will return a thenable which will return a reject promise with the provided `err`. If `err` is a string, it will be set as the message on an `Error` object.

Unlike stub, spy returns the `Promise` function by the `promised` variable, because the `spy` object should be used to do the spy work(checking calls).

```js
// Example with string
var spy = sinon.spy().rejects('foo');

function test(spy) {
    return spy('hello')
    .catch(function(err) {
        // err === 'foo'
        return 'baz'    
    })
}

test(spy)
.then(function(value) {
    // value === 'baz'
    assert(spy.firstCall.args[0], 'hello')
})

// Example with Error object
var spy2 = sinon.spy().rejects(new Error('bar'))

function test(spy) {
    return spy('world')
    .catch(function(err) {
        // err.message === 'bar'
        return 'xab'    
    })
}

test(spy2)
.then(function(value) {
    // value === 'xab'
    assert(spy2.firstCall.args[0], 'world')
})
```

## Examples

* [angular](https://github.com/bendrucker/sinon-as-promised/tree/master/examples/angular)
* [Bluebird](https://github.com/bendrucker/sinon-as-promised/tree/master/examples/bluebird)
* [Node or Browserify](https://github.com/bendrucker/sinon-as-promised/tree/master/examples/node-browserify)

## License

MIT © [Ben Drucker](http://bendrucker.me)
