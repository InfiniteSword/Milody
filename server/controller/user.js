const multer = require('koa-multer');
const { User } = require('../model/user');
const {ID} = require('../model/id');
const serverUrl = require('../config');
const path = require('path');
const gm = require('gm').subClass({imageMagick: true});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.dirname(require.main.filename) + '/upload/');
  },
  filename: function (req, file, cb) {
    let fileFormat = (file.originalname).split('.');
    cb(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1]);
  }
});
const upload = multer({storage: storage});
const files = upload.single('avatar_file');

module.exports = function userAPI (router) {
  router.post('/api/login', async (ctx, next) => {
    let {
      email,
      password
    } = JSON.parse(ctx.request.body);

    let { user } = ctx.session;
    if (user && user.id) {
      ctx.body = JSON.stringify(user);
      return true;
    }

    let res = await User.login(ctx, email, password);

    if (res.status === 'success') {
      ctx.session.user = res.user;
      ctx.body = JSON.stringify(res.user);
      return true;
    }
    if (res.status === 'error') {
      ctx.body = JSON.stringify({status: 'error', message: res.msg});
      return false;
    }
  });
  router.post('/api/update', async (ctx, next) => {
    let { user } = ctx.session;
    let {
      username,
      password
    } = JSON.parse(ctx.request.body);
    if (user) {
      let content = {};
      if (username) {
        content.username = username;
      }
      if (password) {
        content.password = password;
      }
      let res = await User.change(ctx, user.id, content);
      if (res.status === 'success') {
        ctx.session.user = res.user;
        ctx.body = JSON.stringify({status: 'success', message: '修改成功', user: res.user});
        return true;
      } else {
        ctx.body = JSON.stringify({status: 'error', message: res.msg, user: res.user});
        return false;
      }
    } else {
      ctx.body = JSON.stringify({status: 'error', message: '未登录'});
      return false;
    }
  });
  router.post('/api/changeAvatar', files, async (ctx, next) => {
    let { user } = ctx.session;
    let avatar = serverUrl + '/' + ctx.req.file.filename;

    let thumbName = 'thumb_' + ctx.req.file.filename;
    gm(path.dirname(require.main.filename) + '/upload/' + ctx.req.file.filename).resize(200, 200).write(path.dirname(require.main.filename) + '/upload/' + thumbName, function (err) {
      if (err) {
        console.log(err);
      }
    });
    let thumb = serverUrl + '/' + thumbName;

    if (user) {
      let content = {
        avatar,
        thumb
      };
      let res = await User.change(ctx, user.id, content);
      if (res.status === 'success') {
        ctx.session.user = res.user;
        ctx.body = JSON.stringify({status: 'success', message: '修改成功', user: res.user});
        return true;
      } else {
        ctx.body = JSON.stringify({status: 'error', message: res.msg, user: res.user});
        return false;
      }
    } else {
      ctx.body = JSON.stringify({status: 'error', message: '未登录'});
      return false;
    }
  });
  router.post('/api/loggedIn', async (ctx, next) => {
    let { user } = ctx.session;
    if (user) {
      ctx.body = JSON.stringify(user);
      return true;
    } else {
      ctx.body = JSON.stringify({status: 'error', message: '未登录'});
      return false;
    }
  });
  router.post('/api/logout', async (ctx, next) => {
    let { user } = ctx.session;
    if (user) {
      ctx.session.user = {};
      ctx.body = JSON.stringify({status: 'success', message: '已退出登录'});
      return true;
    } else {
      ctx.body = JSON.stringify({status: 'error', message: '未登录'});
      return false;
    }
  });
  router.post('/api/getUser', async (ctx, next) => {
    let { user } = ctx.session;
    let {
      id
    } = JSON.parse(ctx.request.body);
    let res = await User.get(ctx, id);
    if (res.status === 'success') {
      if (user && user.id === res.user.id) {
        ctx.body = JSON.stringify({status: 'success', message: 'self', user: res.user});
      } else {
        ctx.body = JSON.stringify({status: 'success', message: '找到了', user: res.user});
      }
      return true;
    } else {
      ctx.body = JSON.stringify({status: 'error', message: res.msg});
      return false;
    }
  });
  router.post('/api/register', async (ctx, next) => {
    let {
      username,
      email,
      password
    } = JSON.parse(ctx.request.body);

    let id = await ID.get(ctx, 'user');

    if (id.status === 'success') {
      await ID.add(ctx, 'user');
    }
    if (id.status === 'error') {
      let id = new ID({
        type: 'user',
        value: 1
      });
      await ID.create(ctx, id);
    }
    let idV = id.value || id.id.value;
    let user = new User({
      id: idV,
      username,
      email,
      password
    });

    let res = await User.add(ctx, user);

    if (res.status === 'success') {
      ctx.body = JSON.stringify(res.user);
      ctx.session.user = res.user;
      return true;
    }
    if (res.status === 'error') {
      ctx.body = JSON.stringify({status: 'error', message: res.msg});
      return false;
    }
  });
};
