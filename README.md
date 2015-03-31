sinon-as-promised [![Build Status](https://travis-ci.org/bendrucker/sinon-as-promised.svg?branch=master)](https://travis-ci.org/bendrucker/sinon-as-promised) [![NPM version](https://badge.fury.io/js/sinon-as-promised.svg)](http://badge.fury.io/js/sinon-as-promised)
=================

Sugar methods for using sinon.js stubs with promises.

## Installing
```bash
# via npm:
$ npm install sinon-as-promised
# or bower:
$ bower install sinon-as-promised
```

Tagged versions (which Bower uses) include a `./release/sinon-as-promised.js` build that expect sinon to be available as `window.sinon` and exposes its method for changing the promise constructor as `window.sinonAsPromised`. The normal version in `./src` used by npm expects to be able to `require('sinon')`.

## Setup
```js
var sinon           = require('sinon');
var sinonAsPromised = require('sinon-as-promised');
```

You'll only need to require `sinon-as-promised` once. It attaches the appropriate stubbing functions which will then be available anywhere else you require `sinon`. You'll probably want to call it in a setup file that is required before your tests. It defaults to using native ES6 Promise [(or provides a polyfill)](https://github.com/getify/native-promise-only), but you can use another promise library if you'd like, as long as it exposes a constructor:

```js
// Using Bluebird
var Bluebird        = require('bluebird');
var sinonAsPromised = require('sinon-as-promised')(Bluebird);
```

## API

#### `stub.resolves(value)`
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

#### `stub.rejects(error)`
When called, the stub will return a thenable which will return a reject promise with the provided `error`. If `error` is a string, it will be set as the message on an `Error` object.

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

## Examples

* [angular](https://github.com/bendrucker/sinon-as-promised/tree/master/examples/angular)
* [Bluebird](https://github.com/bendrucker/sinon-as-promised/tree/master/examples/bluebird)
* [Node or Browserify](https://github.com/bendrucker/sinon-as-promised/tree/master/examples/node-browserify)

## License
[MIT](LICENSE)
