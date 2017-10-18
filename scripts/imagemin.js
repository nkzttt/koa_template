const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  return process.exit(0);
}

imagemin(['public/images/*.{jpg,png}'], 'public/images', {
  plugins: [
    imageminJpegtran(),
    imageminPngquant({quality: '65-80'})
  ]
}).then(files => {
  process.exit(0);
});


