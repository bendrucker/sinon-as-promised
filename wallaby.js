module.exports = function () {
  return {
    files: ['index.js'],
    tests: ['test.js'],
    env: {
      type: 'node',
      runner: 'node'
    },
    testFramework: 'mocha',
    setup: function (wallaby) {
      var mocha = wallaby.testFramework;
      mocha.timeout(200);
    }
  }
};
