sinon-as-promised [![Build Status](https://travis-ci.org/bendrucker/sinon-as-promised.png)](https://travis-ci.org/bendrucker/sinon-as-promised) [![NPM version](https://badge.fury.io/js/sinon-as-promised.png)](http://badge.fury.io/js/sinon-as-promised)
=================

Sugar methods for using sinon.js stubs with promises.

## Getting Started
```js
var sinon           = require('sinon');
var sinonAsPromised = require('sinon-as-promised');
```

You'll only need to require `sinon-as-promised` once. It attaches the appropriate stubbing functions which will then be available anywhere else you require `sinon`. You'll probably want to call it in a setup file that is required before your tests. It defaults to [Bluebird](https://github.com/petkaantonov/bluebird), but you can use another promise library if you'd like, as long as it exposes a constructor:

```js
var RSVP            = require('rsvp');
var sinonAsPromised = require('sinon-as-promised')(RSVP.Promise);
```

## Usage

#### `stub.resolves(value)`
When called, the stub will return a promise which resolves with the provided `value`.

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
When called, the stub will return a promise which rejects with the provided `error`. If `error` is a string, it will be set as the error message.

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

## License
[MIT](LICENSE)
