const Koa = require('koa');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body');
const send = require('koa-send');
const session = require('koa-session');
const convert = require('koa-convert');
const koaSlash = require('koa-slash');
const cors = require('koa-cors');
const mongoose = require('mongoose');
const clientUrl = require('./ClientUrl');

const routes = require('./route');

const app = new Koa();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/HuiYin');
mongoose.connection
  .once('open', () => console.log('连接数据库成功'))
  .on('error', console.error.bind(console, '连接数据库失败'));

app.use(koaSlash());
app.use(bodyParser());
app.keys = ['huiyin'];
app.use(convert(session(app)));
app.use(koaBody());
app.use(cors({
  origin: clientUrl,
  credentials: true
}));
app.use(async (ctx, next) => {
  await send(ctx, ctx.path, { root: path.resolve(__dirname, './upload') });
  if (ctx.status === 404) {
    await next();
  }
});
routes(app);

app.listen(8080, () => {
  console.log('Server is running on 8080');
});
