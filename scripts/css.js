const fs = require('fs');
const path = require('path');
const globby = require('globby');
const mkdirp = require('mkdirp');
const stylus = require('stylus');
const autoprefixer = require('autoprefixer-stylus');

const srcPath = path.resolve('src/css');
const regFilePath = new RegExp(`^${srcPath}(.+)$`);
const distPath = path.resolve('public/css');

// compile promise function
const compile = (filePath) => {
  return new Promise((resolve) => {
    const code = fs.readFileSync(filePath, 'utf8');
    stylus(code)
      .set('paths', [srcPath])
      .use(autoprefixer())
      .render((err, css) => {
        if (err) {
          console.error(err);
          return resolve();
        }

        let distFullPath = path.join(distPath, filePath.match(regFilePath)[1]).replace('\.styl', '\.css');
        mkdirp.sync(distFullPath.match(/^(.+)\//)[1]);
        fs.writeFileSync(distFullPath, css);
        resolve();
      });
  });
};

// if this script is called by 'require', export compile module and end.
if (require.main !== module) {
  return module.exports = compile;
}

// create array for running Promise.all
const tasks = [];
const files = globby.sync([
  path.join(srcPath, '**/*.styl'),
  '!' + path.join(srcPath, '_mixins/*'),
  '!' + path.join(srcPath, '_partials/*'),
  '!' + path.join(srcPath, '_variables/*')
]);
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
