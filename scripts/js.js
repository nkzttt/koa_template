const fs = require('fs');
const path = require('path');
const globby = require('globby');
const mkdirp = require('mkdirp');
const browserify = require('browserify');

const babelConfig = JSON.parse(fs.readFileSync(path.resolve('.babelrc'), 'utf8'));
const srcPath = path.resolve('src/js');
const regFilePath = new RegExp(`^${srcPath}(.+)$`);
const distPath = path.resolve('public/js');

// compile promise function
const compile = (filePath) => {
  return new Promise((resolve) => {
    const b = browserify();
    b.add(filePath);
    b.transform('babelify', babelConfig);
    b.transform('uglifyify', {global: true});
    b.bundle((err, buf) => {
      if (err) {
        console.error(err);
        return resolve();
      }

      const distFullPath = path.join(distPath, filePath.match(regFilePath)[1]);
      mkdirp.sync(distFullPath.match(/^(.+)\//)[1]);
      fs.writeFileSync(distFullPath, buf);
      resolve();
    });
  });
};

// create array for running Promise.all
const tasks = [];
const files = globby.sync([path.join(srcPath, '**/*.js'), '!' + path.join(srcPath, 'util/*')]);
files.forEach((filePath) => {
  tasks.push(compile(filePath));
});

// compile execution
Promise.all(tasks).then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});

// exports module
module.exports = compile;
