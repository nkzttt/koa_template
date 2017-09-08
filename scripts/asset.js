const fse = require('fs-extra');
const path = require('path');
const globby = require('globby');
const mkdirp = require('mkdirp');

const assetsPath = path.resolve('assets');
const regFilePath = new RegExp(`^${assetsPath}(.+)$`);
const distPath = path.resolve('public');

const copy = (filePath) => {
  return new Promise((resolve) => {
    const distFullPath = path.join(distPath, filePath.match(regFilePath)[1]);
    fse.copy(filePath, distFullPath, (err) => {
      if (err) console.error(err);
      resolve();
    });
  });
};

// if this script is called by 'require', export compile module and end.
if (require.main !== module) {
  return module.exports = copy;
}

const tasks = [];
const files = globby.sync(path.join(assetsPath, '**/*.*'));
files.forEach((filePath) => {
  tasks.push(copy(filePath));
});

// compile execution
Promise.all(tasks).then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
