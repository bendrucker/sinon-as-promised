sinon-as-promised [![Build Status](https://travis-ci.org/valet-io/sinon-as-promised.png)](https://travis-ci.org/valet-io/sinon-as-promised) [![NPM version](https://badge.fury.io/js/sunin-as-promised.png)](http://badge.fury.io/js/sunin-as-promised)
=================

Sugar methods for using sinon.js stubs with promises.

## Getting Started
```js
var sinon           = require('sinon');
var Promise         = require('bluebird');
var sinonAsPromised = require('sinon-as-promised')(Promise);
```

You can use any promise library you'd like that exposes a constructor. You'll only need to call `sinon-as-promised` once. It attaches the appropriate stubbing functions which will then be available anywhere else you require `sinon`. You'll probably want to call it in a setup file that is required before your tests.

## Usage

#### `stub.resolves(value)`
When called, the stub will return a promise which resolves with the provided `value`. 

```js
stub.resolves('foo')().then(function (value) {
    // value === 'foo'
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
```

## License
[MIT](LICENSE)