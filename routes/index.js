var router = require('koa-router')();

router.get('/', async function (ctx, next) {
  ctx.state = ctx.createState({
    title: 'koa2 title'
  });

  await ctx.render('index');
})
module.exports = router;
