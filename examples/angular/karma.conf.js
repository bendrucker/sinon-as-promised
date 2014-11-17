module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'mocha'],
    files: [
      './node_modules/angular/angular.js',
      './node_modules/angular-mocks/angular-mocks.js',
      './test.js'
    ],
    preprocessors: {
      './test.js': ['browserify']
    },
    browserify: {
      transform: ['browserify-shim']
    },
    browsers: ['PhantomJS']
  });
};
