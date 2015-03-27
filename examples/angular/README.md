# AngularJS + sinon-as-promised

sinon-as-promised is fully compatible with Angular 1.3+. If you're using Angular 1.2 or below, register [angular-q-constructor](https://github.com/bendrucker/angular-q-constructor) before configuring sinon-as-promised:

```js
angular.mock.module('q-constructor');
angular.mock.module('myApp');
angular.mock.inject(function ($q) {
  sinonAsPromised($q);
});
```
