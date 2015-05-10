module.exports = function (config) {
  config.set({
    frameworks: ['browserify', 'mocha'],
    files: [
      './test.js'
    ],
    preprocessors: {
      './test.js': ['browserify']
    },
    browsers: ['PhantomJS']
  })
}
