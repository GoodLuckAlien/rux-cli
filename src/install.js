const which = require('which')

function runCmd(cmd, args, fn) {
  args = args || []
  var runner = require('child_process').spawn(cmd, args, {
    stdio: 'inherit'
  })
  runner.on('close', function (code) {
    if (fn) {
      fn(code)
    }
  })
}

function findNpm() {
  var npms = process.platform === 'win32' ? ['npm.cmd'] : ['npm']
  for (var i = 0; i < npms.length; i++) {
    try {
      which.sync(npms[i])
      console.log('use npm: ' + npms[i])
      return npms[i]
    } catch (e) {
    }
  }
  throw new Error('please install npm')
}

module.exports = function (installArg = [ 'install' ]) {
  const npm = findNpm()
  return function (done){
    runCmd( which.sync(npm),installArg, function () {
        done && done()
     })
  }
}
