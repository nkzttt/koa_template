const fs = require('fs');
const path = require('path');
const globby = require('globby');
const mkdirp = require('mkdirp');
const stylus = require('stylus');

const srcPath = path.resolve('src/css');
const regFilePath = new RegExp(`^${srcPath}(.+)$`);
const distPath = path.resolve('public/css');

return console.log(stylus);
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

// exports module
module.exports = compile;
