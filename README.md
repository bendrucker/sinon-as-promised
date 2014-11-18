sinon-as-promised [![Build Status](https://travis-ci.org/bendrucker/sinon-as-promised.svg?branch=master)](https://travis-ci.org/bendrucker/sinon-as-promised) [![NPM version](https://badge.fury.io/js/sinon-as-promised.svg)](http://badge.fury.io/js/sinon-as-promised)
=================

Sugar methods for using sinon.js stubs with promises.

## Getting Started
```js
var sinon           = require('sinon');
var sinonAsPromised = require('sinon-as-promised');
```

You'll only need to require `sinon-as-promised` once. It attaches the appropriate stubbing functions which will then be available anywhere else you require `sinon`. You'll probably want to call it in a setup file that is required before your tests. It defaults to [Bluebird](https://github.com/petkaantonov/bluebird), but you can use another promise library if you'd like, as long as it exposes a constructor:

```js
// Using RSVP
var RSVP            = require('rsvp');
var sinonAsPromised = require('sinon-as-promised')(RSVP.Promise);
// ES6 promises
var sinonAsPromised = require('sinon-as-promised')(Promise);
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

## Custom Scheduler

By default, sinon-as-promised schedules the resolution or rejection of your stub promises using `process.nextTick` in Node and `setImmediate` in the browser. This helps ensure that [Bluebird's error handling mechanism](https://github.com/petkaantonov/bluebird/blob/master/API.md#error-management-configuration) does not treat rejections as "possibly unhandled" since you'll have a chance to attach an error handler while the promise is still pending.

Sometimes you may want to change this behavior, most commonly when using sinon-as-promised with Angular and `$q`. Angular allows you to flush the queue of deferred functions with `$timeout.flush()`. sinon-as-promised exposes a `setScheduler` method to allow you to override the default scheduling mechanism. 

#### `sinonAsPromised.setScheduler(fn)` -> `undefined`

To replicate the default behavior:

```js
sinonAsPromised.setScheduler(function (fn) {
  process.nextTick(fn);
});
```

To use with Angular:

```js
sinonAsPromised($q);
sinonAsPromised.setScheduler(function (fn) {
  $rootScope.$evalAsync(fn);
});
```

## Examples

* [angular](https://github.com/bendrucker/sinon-as-promised/tree/master/examples/angular)
* [ES6](https://github.com/bendrucker/sinon-as-promised/tree/master/examples/es6)
* [Node or Browserify](https://github.com/bendrucker/sinon-as-promised/tree/master/examples/node-browserify)

## License
[MIT](LICENSE)
