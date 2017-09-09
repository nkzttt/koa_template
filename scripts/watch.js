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
    reload: '*.css'
  },
  {
    dir: path.resolve('src/js'),
    compiler: compiler.js,
    reload: ''
  },
  {
    dir: path.resolve('assets'),
    compiler: compiler.asset,
    reload: ''
  },
  {
    dir: path.resolve('views'),
    compiler: null,
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

      if (config.compiler) {
        config.compiler(fileFullPath).then(() => {
          bs.reload(config.reload);
        });
      } else {
        bs.reload(config.reload);
      }
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

