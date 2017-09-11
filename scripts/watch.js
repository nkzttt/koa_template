const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const bs = require('browser-sync').create();

const compiler = {
  css: require('./css'),
  js: require('./js'),
  asset: require('./asset')
};

// start server
bs.init({
  proxy: "http://localhost:3000"
});

// watch task to be run only once at short interval
const runWatchTask = (() => {
  let timer = null;
  return (fn) => {
    clearTimeout(timer);
    timer = setTimeout(fn, 100);
  };
})();

// set up watching directories and its relate tasks
const watchConfigs = [
  {
    dir: path.resolve('src/css'),
    compiler: compiler.css,
    script: 'npm run build:css',
    reload: '*.css'
  },
  {
    dir: path.resolve('src/js'),
    compiler: compiler.js,
    script: 'npm run build:js',
    reload: ''
  },
  {
    dir: path.resolve('assets'),
    compiler: compiler.asset,
    script: 'npm run build:asset',
    reload: ''
  },
  {
    dir: path.resolve('views'),
    compiler: null,
    script: null,
    reload: ''
  }
];

const watchOptions = {
  // interval: 1000,
  recursive: true
};

// start watch
watchConfigs.forEach(function (config) {
  fs.watch(config.dir, watchOptions, (event, filename) => {
    // function squeezes at once by timer because it ignites three times at one change
    runWatchTask(() => {
      const _filename = /___/.test(filename) ?
        filename.match(/^(.+?)___/)[1] :
        filename;
      const fileFullPath = path.join(config.dir, _filename);
      outputLog(event, fileFullPath);

      // check whether the path is a build target and switch the function to use accordingly.
      const compileFn = /^_/.test(filename) ? compileByScript : compileByCompiler;
      
      compileFn(config, fileFullPath).then(() => {
        bs.reload(config.reload);
      });
    });
  });
});

/**
 * output log at file change
 * @param event
 * @param filename
 */
function outputLog(event, filename) {
  console.log('---------- change log ----------');
  console.log(new Date());
  console.log('event type: ' + event);
  console.log('changing file: ' + filename);
  console.log('--------------------------------');
}

/**
 * when filename is not build target, run npm script and build all file 
 * @param config
 * @returns {Promise}
 */
function compileByScript(config) {
  return new Promise((resolve) => {
    if (!config.script) return resolve();

    exec(config.script, (err, stdout, stderr) => {
      if (err) console.error(err);
      resolve();
    });
  });
}

/**
 * when filename is build target, build target file by compiler 
 * @param fileFullPath
 * @param config
 * @returns {Promise}
 */
function compileByCompiler(config, fileFullPath) {
  return new Promise((resolve) => {
    if (!config.compiler) return resolve();

    config.compiler(fileFullPath).then(() => {
      resolve();
    });
  });
}
