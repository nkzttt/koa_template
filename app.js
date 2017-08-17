const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const webpack = require('webpack');

const index = require('./routes/index');
const users = require('./routes/users');

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'ect',
  options: {
    root: __dirname + '/views',
    ext : '.ect'
  }
}));

// for development
if (process.env.NODE_ENV === 'development') {

  const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware');
  const devConfig = require('./webpack.config.dev');
  const compile = webpack(devConfig);

  app.use(devMiddleware(compile, {
    publicPath: devConfig.output.publicPath,
    stats: {
      colors: true
    }
  }));

  app.use(hotMiddleware(compile, {
    log: console.log
  }));

  const livereload = require('livereload');
  const lrServer = livereload.createServer({
    exts: ['ect']
  });
  lrServer.watch(__dirname + '/views');

}

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});


// routing
router.use('/', index.routes(), index.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());

app.use(router.routes(), router.allowedMethods());
// response

app.on('error', function(err, ctx){
  console.log(err);
  logger.error('server error', err, ctx);
});


module.exports = app;