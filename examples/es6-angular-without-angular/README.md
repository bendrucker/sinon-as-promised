ES6 Angular Without Angular
===========================

Writing Angular 1 code with ES6 is the new new thing. What's even more 
fun: writing Angular 1 code and tests with ES6, but without loading 
Angular. Instead, write your services and controllers with no Angular 
imports and do TDD under iojs using Mocha's compiler support for Babel.

``sinon-as-promised`` makes this TDD mode a breeze by letting you write
promise-style code with convenient testing.

## Running

1. ``npm install mocha chai babel``

2. ``node_modules/.bin/mocha --compilers js:babel/register 
examples/es6-angular-without-angular/test.js``

The ``--compilers`` part is the most important. This runs the source 
and test code through Babel.

## Background

Just to re-emphasize the point, neither the code we are testing, nor 
the tests, load any Angular. If we did import Angular, we'd need a fake
DOM, and we'd then probably just use Karma.

As preamble for those new to ES6, this code uses arrow functions to 
solve the ``this`` binding problem. We also use the newly-recommended 
class-approach to Angular 1.4 controllers and services. Doing so lets 
us store the flag on a scope. Finally, we don't need to pass a 
promise initializer to the "sinon-as-promised" constructor, as we are 
using native ES6 promises via Babel.

## Controller Test Explanation

The controller tests are relatively simple. We mock the dependency on 
our ``MyService``. Thanks to ``sinon-as-promised`` this is convenient 
and simple.

Our controller method calls our service's ``get`` method, which we've 
stubbed, and gets back a promise. The ``.then()`` in the controller 
grabs the value resolved by the service and stashes is on the 
controller, so we can test it.

This ``expect`` assertion has to:

- Be run in a ``.then()`` of the returned promise, which is...

- ...returned (``return result.then()``) otherwise the Mocha reporter 
won't get it.

## Service Test Explanation

This test is a bit different. Our service does the right thing and 
wraps the Angular ``$http`` service calls with our own promise, to let 
us fully control the interaction in the service. ``sinon-as-promised`` 
uses native ES6 promises. Angular 1.3 adopted an ES6-style promise 
constructor signature for ``$q``. Thus, all we have to do is hand our 
service a ``$q`` function that will return an instance of an ES6 Promise.

This test is also different because we have a promise inside a promise:
an ``$http`` promise inside our ``$q`` promise. We thus make a mock for
the ``$http.get()`` call, using ``sinon-as-promised``. Our test code 
then arranges for the mocked ``$http.get()`` to return (resolve) a 
flag, which our service stores as an instance value. Our test can then 
assert that value.

## More Information

This was a very minimal example. We didn't test any of the resolved 
values that were passed into our test ``.then()`` handlers. We didn't 
handle any promise ``reject()`` error handlers, etc.

For a full example of this, take a look at 
https://github.com/pauleveritt/sap-then-assert