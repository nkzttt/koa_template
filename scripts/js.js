const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const browserify = require('browserify');

const babelConfig = JSON.parse(fs.readFileSync(path.resolve('.babelrc'), 'utf8'));

const distPath = path.resolve('public/js/');
mkdirp.sync(distPath);

// compile promise function
const compile = (filePath) => {
  return new Promise((resolve) => {
    const b = browserify();
    b.add(filePath);
    b.transform('babelify', babelConfig);
    b.transform('uglifyify', {global: true});
    b.bundle((err, buf) => {
      if (err) return resolve();

      fs.writeFileSync(path.join(distPath, 'index.js'), buf);
      resolve();
    });
  });
};

// compile execution
compile(path.resolve('src/js/index.js')).then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
