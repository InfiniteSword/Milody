const koaRouter = require('koa-router');
const init = require('../controller');

module.exports = function routes (app) {
  const router = koaRouter();

  app.use(router.routes())
    .use(router.allowedMethods());

  init(router);
};
