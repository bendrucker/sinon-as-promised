'use strict';

var Promise = require('bluebird');
var fs      = Promise.promisifyAll(require('fs'));
var child   = Promise.promisifyAll(require('child_process'));
var path    = require('path');
var del     = Promise.promisify(require('del'));
var ncp     = Promise.promisify(require('ncp').ncp);

function runExample (example) {
  var dir = path.join('examples', example);
  function npmRun (cmd) {
    return new Promise(function (resolve, reject) {
      child.spawn('npm', [cmd], {
        cwd: dir,
        stdio: 'inherit'
      })
      .on('close', function (code) {
        if (code === 0) {
          return resolve();
        }
        else {
          return reject(new Error('Exited with ' + code));
        }
      });
    });
  }
  var localModuleDir = path.join(dir, 'node_modules/sinon-as-promised');
  return npmRun('install')
    .then(function () {
      return del(localModuleDir + '/**/*');
    })
    .then(function () {
      return Promise.join(
        ncp('package.json', localModuleDir + '/package.json'),
        ncp('src', localModuleDir + '/src')
      );
    })
    .then(function () {
      return npmRun('test');
    });
}

fs.readdirAsync('./examples')
  .filter(function (file) {
    return fs.lstatAsync(path.join('./examples', file))
      .then(function (stat) {
        return stat.isDirectory();
      });
  })
  .each(function (example) {
    console.log('Running', example, 'example');
    return runExample(example)
  })
  .catch(function (err) {
    console.error(err);
    process.exit(1);
  });
